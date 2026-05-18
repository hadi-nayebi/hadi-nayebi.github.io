---
title: "data.json — The Hidden State"
date: "May 2026"
slug: "data-json-hidden-state"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, State]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# `data.json` — The Hidden State

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

---

[Essay 7.3](07_3-dual-voice-architecture.html) opened the two voice surfaces — one for the LLM, one for the operator — and named Lock 13 as the policy that governs when soft coaching hardens into a deterministic block. This sub-essay opens the organ that carries the plugin's *state* — and the discipline that keeps it from being corrupted by concurrent reads, partial writes, or cross-plugin reach-arounds.

---

## `data.json` — The Hidden State

**What it is.** The plugin's private runtime state. The active focused job, the tier counter, the summary chain, the lock manifest. JSON-encoded, written atomically, lives only on the operator's machine, gitignored. *[ref: data-json-gitignored-per-machine | .gitignore:10-12 | The repo's top-level `.gitignore` contains three lines: `**/data.json`, `**/data.json.lock`, `**/data.json.tmp` — gitignoring not only the state file itself but also its lockfile and temp file. The state is per-machine and never enters the repo; this is enforced at the repo level with `**/` globs, so every plugin's `data.json` inherits the discipline automatically. (Individual plugins like `plugin_integrity` may also carry their own `.gitignore` with `data.json` for extra clarity, but the top-level rule is what actually matters.)]*

**Who reads it.** ONLY the plugin's own scripts. No other plugin reaches into this file. The discipline is structural: cross-plugin queries route through the plugin's published read-only commands (`job.sh focused`, `phase.sh current`), never through `cat data.json` from outside. *[ref: published-read-only-commands | .claude/plugins/job_core/scripts/job.sh:393 + .claude/plugins/phasic_system/scripts/phase.sh:472 | `job.sh:393` opens the `focused)` case-statement branch that prints the focused job's record from data.json; `phase.sh:472` opens the `current)` case-statement branch that prints the current phase. Both are agent-callable read commands — the published CLI surface other plugins (and the agent) use to query state without touching the file. Direct `cat data.json` from outside the owning plugin is the anti-pattern this discipline prevents.]*

**Who writes it.** ONLY the plugin's own scripts. Direct file-system writes are forbidden. Every mutation follows the same protocol: `flock` on a `/tmp/`-located lockfile serializes concurrent hook fires. Inside the lock, the script reads current state, transforms it through `jq` into a temp file, validates with `jq empty`, then atomically `mv`s over the live file. The reader never sees a partial state. If parsing fails at read time, the gateway script rebuilds the file from defaults rather than blocking the agent. *[ref: data-json-flock-tmp-lockfile | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:39-44,81-90 | L39-43 comment: "Lockfile lives in /tmp/ to avoid polluting the repo's git status. Path-hashed from $DATA_FILE so each project gets a unique lock; flock is per-machine advisory so this is the correct scope." L44 defines the path: `LOCKFILE="/tmp/plugin-integrity${DATA_FILE//\//-}.lock"`. L81-90 defines the `flock_data` helper: opens fd 9 on $LOCKFILE via `flock -w 5 9` (5-second timeout, L83), executes the wrapped command (L88), and closes the redirect via `9>"$LOCKFILE"` (L89). On timeout, emits a `lock-acquisition-timeout` voice and exits 1 (L84-86).]*

**What it depends on.** The plugin's scripts (which mediate every read and write). The shared `lib/voice-helper/` (for error messages when validation or atomicity fails). *[ref: voice-helper-sourced-by-lock-manager | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:50,63 | L50 declares the path: `VOICE_HELPER_SH="$PROJECT_ROOT/.claude/plugins/lib/voice-helper/voice-helper.sh"` — the helper lives outside any single plugin, in `.claude/plugins/lib/`. L63: `if ! source "$VOICE_HELPER_SH" 2>/dev/null; then` — sources the helper with a local fallback (`get_voice() { echo ""; }`) if the source fails, keeping the hook resilient. Every error message the lock manager emits (timeout, drift, lock conflict) flows through `get_voice` from this shared helper.]*

**Why the mandatory script-mediation.** Multiple subsystems may fire hooks against the same `data.json` within milliseconds of each other (e.g., two PreToolUse hooks from the same plugin both reading state). If both write directly to the file, one overwrites the other's update. The `flock` discipline serializes all mutations through the script gateway. Reads also go through scripts so corruption is handled fail-safe: when `data.json` is malformed, the script rebuilds rather than crashing the agent. The boundary is structural discipline, not a kernel enforcement; an operator who edits `data.json` directly bypasses the protocol entirely. The discipline holds because the seed agent and historian both refuse to write outside their scripts. *[ref: data-json-fail-safe-rebuild-on-malformed | .claude/plugins/phasic_system/scripts/phase.sh:85,92-94 | L85: `printf '%s\n' '{"jobs":[]}' > "$DATA_TMP_FILE"` — the default state. L92 emits the warning voice: "[phasic_system] WARNING: data.json was missing or corrupt — rebuilding state." L94 escalates to ERROR only if the rebuild itself fails: "[phasic_system] ERROR: failed to rebuild $DATA_FILE." The script chooses fail-safe-rebuild over fail-crash; the agent never gets blocked by a corrupt JSON state.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard flow diagram — concurrent hook fires queue at the lockfile, the script gateway serializes a single mutation through a jq transform into a temp file, validates, then atomically replaces the live data.json. The reader never sees a partial state.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the step badges (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, file boxes, and the lockfile icon; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, command names, or protocol descriptors.
  Layout: Left column — three small white-chalk arrows entering from the left edge, each labeled IN WHITE CHALK exactly "hook fire" (three identical labels, one per arrow), all three pointing at a single pastel chalk lock-icon (cyan fill) labeled IN WHITE CHALK exactly "flock /tmp/...lock".
  From the lockfile, a single white-chalk arrow points right into a horizontal flow of four pastel chalk step-badges arranged left-to-right, each labeled IN WHITE CHALK with its exact text:
    Badge 1 (green fill): "read data.json"
    Badge 2 (orange fill): "jq transform → data.json.tmp"
    Badge 3 (pink fill): "jq empty (validate)"
    Badge 4 (magenta fill): "atomic mv → data.json"
  Single white-chalk arrows connect Badge 1 → Badge 2 → Badge 3 → Badge 4.
  Below Badge 3, a small white-chalk side-arrow points DOWN to a small chalk box labeled IN WHITE CHALK exactly "validation fail → rm tmp + rebuild from default".
  To the far right, after Badge 4, draw a small chalk file-icon (cyan fill) labeled IN WHITE CHALK exactly "data.json" with a short white-chalk arrow above it labeled IN WHITE CHALK exactly "reader sees whole state".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "hook fire", "flock /tmp/...lock", "read data.json", "jq transform → data.json.tmp", "jq empty (validate)", "atomic mv → data.json", "validation fail → rm tmp + rebuild from default", "data.json", "reader sees whole state", plus the caption below. No other words, file names, folders, or step descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.4. Concurrent fires queue at the lockfile. One mutation at a time. Atomic mv flips the file; readers never catch a partial state."
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
