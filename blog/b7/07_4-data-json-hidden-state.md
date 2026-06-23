---
title: "data.json — The Hidden State"
date: "May 2026"
slug: "data-json-hidden-state"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, State]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# `data.json` — The Hidden State

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

---

[Essay 7.3](07_3-dual-voice-architecture.html) opened the two voice surfaces — one for the LLM, one for the operator — and named Lock 13 as the policy that governs when soft coaching hardens into a deterministic block. This sub-essay opens the organ that carries the plugin's *state* — and the discipline that keeps it from being corrupted by concurrent reads, partial writes, or cross-plugin reach-arounds.

---

## `data.json` — The Hidden State

**What it is.** The plugin's private runtime state. The active focused job, the tier counter, the summary chain, the lock manifest. JSON-encoded, written atomically, lives only on the operator's machine, gitignored. *[ref: data-json-gitignored-per-machine | .gitignore:10-12 | The repo's top-level `.gitignore` contains three lines: `**/data.json`, `**/data.json.lock`, `**/data.json.tmp` — gitignoring not only the state file itself but also its lockfile and temp file. The state is per-machine and never enters the repo; this is enforced at the repo level with `**/` globs, so every plugin's `data.json` inherits the discipline automatically. (Individual plugins like `plugin_integrity` may also carry their own `.gitignore` with `data.json` for extra clarity, but the top-level rule is what actually matters.)]*

**Who reads it.** ONLY the plugin's own scripts. No other plugin reaches into this file. The discipline is structural: cross-plugin queries route through the plugin's published read-only commands (`job.sh focused`, `phase.sh current`), never through `cat data.json` from outside. *[ref: published-read-only-commands | .claude/plugins/job_core/scripts/job.sh — focused) case branch + .claude/plugins/phasic_system/scripts/phase.sh — current) case branch | The `focused)` case-statement branch in job.sh prints the focused job's record from data.json; the `current)` case-statement branch in phase.sh prints the current phase. Both are agent-callable read commands — the published CLI surface other plugins (and the agent) use to query state without touching the file. Direct `cat data.json` from outside the owning plugin is the anti-pattern this discipline prevents.]*

**Who writes it.** ONLY the plugin's own scripts. Direct file-system writes are forbidden. Every mutation follows the same protocol: `flock` on a `/tmp/`-located lockfile serializes concurrent hook fires. Inside the lock, the script reads current state, transforms it through `jq` into a temp file, validates with `jq empty`, then atomically `mv`s over the live file. The reader never sees a partial state. If parsing fails at read time, the gateway script rebuilds the file from defaults rather than blocking the agent. *[ref: data-json-flock-tmp-lockfile | .claude/plugins/plugin_integrity/hooks/lock-manager.sh — LOCKFILE definition + flock_data() helper | The lockfile comment ("Lockfile lives in /tmp/ to avoid polluting the repo's git status. Path-hashed from $DATA_FILE so each project gets a unique lock; flock is per-machine advisory so this is the correct scope") precedes the path definition `LOCKFILE="/tmp/plugin-integrity${DATA_FILE//\//-}.lock"`. The `flock_data` helper opens fd 9 on $LOCKFILE via `flock -w 5 9` (5-second timeout), executes the wrapped command, and closes the redirect via `9>"$LOCKFILE"`. On timeout, it emits a `lock-acquisition-timeout` voice and exits 1.]*

**What it depends on.** The plugin's scripts (which mediate every read and write). The shared `lib/voice-helper/` (for error messages when validation or atomicity fails). *[ref: voice-helper-sourced-by-lock-manager | .claude/plugins/plugin_integrity/hooks/lock-manager.sh — VOICE_HELPER_SH source arm | The path declaration `VOICE_HELPER_SH="$PROJECT_ROOT/.claude/plugins/lib/voice-helper/voice-helper.sh"` points at the helper that lives outside any single plugin, in `.claude/plugins/lib/`. The source arm `if ! source "$VOICE_HELPER_SH" 2>/dev/null; then` sources the helper with a local fallback (`get_voice() { echo ""; }`) if the source fails, keeping the hook resilient. Every error message the lock manager emits (timeout, drift, lock conflict) flows through `get_voice` from this shared helper.]*

**Why the mandatory script-mediation.** Multiple subsystems may fire hooks against the same `data.json` within milliseconds of each other (e.g., two PreToolUse hooks from the same plugin both reading state). If both write directly to the file, one overwrites the other's update. The `flock` discipline serializes all mutations through the script gateway. Reads also go through scripts so corruption is handled fail-safe: when `data.json` is malformed, the script rebuilds rather than crashing the agent. *[ref: data-json-fail-safe-rebuild-on-malformed | .claude/plugins/phasic_system/scripts/phase.sh — reset_state_file() rebuild arm | The rebuild arm writes the default state `printf '%s\n' '{"jobs":[]}' > "$DATA_TMP_FILE"`, emits the warning voice "[phasic_system] WARNING: data.json was missing or corrupt — rebuilding state," and escalates to ERROR only if the rebuild itself fails: "[phasic_system] ERROR: failed to rebuild $DATA_FILE." The script chooses fail-safe-rebuild over fail-crash; the agent never gets blocked by a corrupt JSON state.]*

**But "fail-safe" is not the same answer everywhere.** Rebuilding is the right move when the lost state is cheap — a tier counter or a phase marker reconstructs from defaults with no harm done. Where the state is *not* cheap, the same corruption demands the opposite reflex. The job lifecycle plugin's stop-gate refuses to release the agent while it cannot read the job records: a malformed `data.json` there means the gate fails toward *blocking*, not allowing. Silently resetting job state to a clean slate would erase work the agent has not finished — so the safe outcome is to halt and force a repair, not to wave the agent through on an empty rebuild. Forgiving where loss is cheap; refusing where loss is not. *[ref: data-json-fail-safe-block-on-corrupt-job-state | .claude/plugins/job_core/hooks/stop-gate.sh | The header comment states the stance outright: "FAIL-SAFE: corrupted JSON → BLOCK." The validate arm runs `jq empty "$DATA_FILE"`; on failure it emits the `stop-gate-corrupted-json` voice ("data.json is corrupted. Cannot verify job state. Fix data.json before stopping.") and `exit 2` — a hard block. This is the deliberate inverse of `phasic_system`'s rebuild-on-corrupt stance: the fail-safe direction is chosen per concern, because stopping with unverifiable job state is itself the unsafe outcome.]*

**The boundary is structural, not OS-level.** An operator who edits `data.json` directly bypasses the protocol entirely. The discipline holds because the seed agent and historian both refuse to write outside their scripts — a publishable-interface contract, not a kernel lock.

**The state schema upgrades itself.** A plugin's state grows new fields over time. The kit handles this without a migration step the operator has to run. Every `data.json` carries a `schema_version` number, and the plugin's scripts hold a short stack of idempotent helpers — one per field that was ever added. Each helper does the same small thing: check whether its field is present, add a default if it is missing, and no-op if it is already there. The plugin's command router runs the whole stack before it touches any subcommand, so an old `data.json` upgrades itself the first time any command fires against it. There is no version-mismatch rejection and no "run the migration" ceremony — the file just reaches the current shape on first touch. *[ref: data-json-schema-version-idempotent-migrations | .claude/plugins/brain_guard/scripts/brain_guard.sh _ensure_*_field helpers + _dispatch_hook | `brain_guard.sh` declares `schema_version: 6` in its default-state block. Four idempotent helpers form the migration stack: `_ensure_pin_wid_field` (→v3), `_ensure_last_compact_at_field` (→v4, adds `.last_self_compact_at`), `_ensure_pin_pane_field` (→v5), and `_ensure_jobs_field` (→v6, adds the per-job `.jobs` map). Each runs a `jq` expression of the form `.field = (.field // <default>) | .schema_version = N` — check-then-add, no-op when the field is present. `_dispatch_hook` calls all four in order before routing any subcommand, so the file self-upgrades on first touch. (The original v1→v2 helper was removed when its archive field was retired.) This is distinct from the corruption-rebuild path above: rebuild restores a clean default when JSON is malformed; the migration stack adds new fields to an otherwise-valid older file.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/data-json-flow-b7-4.png
  Concept: Chalk-on-blackboard flow diagram — concurrent hook fires queue at the lockfile, the script gateway serializes a single mutation through a jq transform into a temp file, validates, then atomically replaces the live data.json. The reader never sees a partial state.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the step badges (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, file boxes, and the lockfile icon; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, command names, or protocol descriptors.
  Layout: Left column — three small white-chalk arrows entering from the left edge, each labeled IN WHITE CHALK exactly "hook fire" (three identical labels, one per arrow), all three pointing at a single pastel chalk lock-icon (cyan fill) labeled IN WHITE CHALK exactly "flock /tmp/plugin-integrity-…lock".
  From the lockfile, a single white-chalk arrow points right into a horizontal flow of four pastel chalk step-badges arranged left-to-right, each labeled IN WHITE CHALK with its exact text:
    Badge 1 (green fill): "read data.json"
    Badge 2 (orange fill): "jq transform → data.json.tmp"
    Badge 3 (pink fill): "jq empty (validate)"
    Badge 4 (magenta fill): "atomic mv → data.json"
  Single white-chalk arrows connect Badge 1 → Badge 2 → Badge 3 → Badge 4.
  Below Badge 3, a small white-chalk side-arrow points DOWN to a small chalk box labeled IN WHITE CHALK exactly "validation fail → rm tmp + rebuild from default".
  To the far right, after Badge 4, draw a small chalk file-icon (cyan fill) labeled IN WHITE CHALK exactly "data.json" with a short white-chalk arrow above it labeled IN WHITE CHALK exactly "reader sees whole state".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "hook fire", "flock /tmp/plugin-integrity-…lock", "read data.json", "jq transform → data.json.tmp", "jq empty (validate)", "atomic mv → data.json", "validation fail → rm tmp + rebuild from default", "data.json", "reader sees whole state". No other words, file names, folders, or step descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.4. Concurrent fires queue at the lockfile. One mutation at a time. Atomic mv flips the file; readers never catch a partial state."
-->

Target asset: assets/images/blog/b7/data-json-atomic-protocol-b7-4.png

**The new-plugin lens.** When you guide your seed to add a plugin that needs state, the seed designs the state's *interface* first: what read commands does this plugin publish for other plugins (and the agent) to use? What mutation commands does this plugin publish for its own hooks to use? Then `data.json` becomes the cache the scripts operate on. Tell your seed: *if you cannot enumerate what reads each field and what writes each field, the design is not done yet.* A real-estate broker's seed could carry an open-listings manifest the same way; only the listings plugin's scripts mutate it, and concurrent showings-update hooks serialize through the same `flock` protocol.

**The minimum-viable plugin shape.** A plugin without `data.json` is stateless — it carries no runtime bookkeeping. `question_discipline` is again the example: pure gate, no state, no `data.json`. The absence signals stateless enforcement. *[ref: question-discipline-no-data-json-stateless | .claude/plugins/question_discipline/ directory listing | The plugin directory contains `CLAUDE.md`, `hooks/`, `tests/`, `agents/`, `docs/`, `LICENSE`, `README.md` — and notably NO `data.json`, NO `scripts/` (its single hook `question-discipline-gate.sh` lives directly under `hooks/`), NO `data.json.lock`, NO state file of any kind. The gate fires on every PreToolUse for AskUserQuestion, evaluates the prefix against its config, and returns — pure stateless enforcement.]*

---

State is private. Mutation is serialized. Cross-plugin queries route through the script CLI, never through the raw file. The next sub-essay opens the organ where the plugin's *narrated knowledge* lives — `docs/`, including the word-capped `evolution.md` and the historian ratchet that auto-injects it before every edit.

---

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

*Previous: [Essay 7.3 — The Dual Voice Architecture](07_3-dual-voice-architecture.html) — two voice.xml files, one for the LLM and one for the operator.*
*Next: [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet.*
