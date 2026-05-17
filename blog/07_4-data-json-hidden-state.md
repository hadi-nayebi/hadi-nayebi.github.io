---
title: "data.json — The Hidden State"
date: "May 2026"
slug: "data-json-hidden-state"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, State]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/agent-anatomy.png"
---

# `data.json` — The Hidden State

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

---

[Essay 7.3](07_3-dual-voice-architecture.html) opened the two voice surfaces — one for the LLM, one for the operator — and named Lock 13 as the policy that governs when soft coaching hardens into a deterministic block. This sub-essay opens the organ that carries the plugin's *state* — and the discipline that keeps it from being corrupted by concurrent reads, partial writes, or cross-plugin reach-arounds.

---

## `data.json` — The Hidden State

**What it is.** The plugin's private runtime state. The active focused job, the tier counter, the summary chain, the lock manifest. JSON-encoded, written atomically, lives only on the operator's machine, gitignored. *[ref: data-json-gitignored-per-machine | .gitignore:10-12 | The repo's top-level `.gitignore` contains three lines: `**/data.json`, `**/data.json.lock`, `**/data.json.tmp` — gitignoring not only the state file itself but also its lockfile and temp file. The state is per-machine and never enters the repo; this is enforced at the repo level with `**/` globs, so every plugin's `data.json` inherits the discipline automatically. (Individual plugins like `plugin_integrity` may also carry their own `.gitignore` with `data.json` for extra clarity, but the top-level rule is what actually matters.)]*

**Who reads it.** ONLY the plugin's own scripts. No other plugin reaches into this file. The discipline is structural: cross-plugin queries route through the plugin's published read-only commands (`job.sh focused`, `phase.sh current`), never through `cat data.json` from outside.

**Who writes it.** ONLY the plugin's own scripts. Direct file-system writes are forbidden. Every mutation follows the same protocol: `flock` on a `/tmp/`-located lockfile (to handle concurrent access across hook fires) → read current state → transform with `jq` into a temp file → validate the temp with `jq empty` → atomic `mv` over the live file. The reader never sees a partial state. If parsing fails at read time, the gateway script rebuilds the file from defaults rather than blocking the agent. *[ref: data-json-flock-tmp-lockfile | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:39-44,81-83 | L39-43 comment: "Lockfile lives in /tmp/ to avoid polluting the repo's git status. Path-hashed from $DATA_FILE so each project gets a unique lock; flock is per-machine advisory so this is the correct scope." L44 defines the path: `LOCKFILE="/tmp/plugin-integrity${DATA_FILE//\//-}.lock"`. L81-83 declares the `flock_data` helper opening fd 9 on $LOCKFILE with `flock -w 5 9` (5-second timeout). On timeout, emits a `lock-acquisition-timeout` voice and exits 1.]*

**What it depends on.** The plugin's scripts (which mediate every read and write). The shared `lib/voice-helper/` (for error messages when validation or atomicity fails).

**Why the mandatory script-mediation.** Multiple subsystems may fire hooks against the same `data.json` within milliseconds of each other (e.g., two PreToolUse hooks from the same plugin both reading state). If both write directly to the file, one overwrites the other's update. The `flock` discipline serializes all mutations through the script gateway. Reads also go through scripts so corruption is handled fail-safe: when `data.json` is malformed, the script rebuilds rather than crashing the agent. *[ref: data-json-fail-safe-rebuild-on-malformed | .claude/plugins/phasic_system/scripts/phase.sh:85,92-94 | L85: `printf '%s\n' '{"jobs":[]}' > "$DATA_TMP_FILE"` — the default state. L92 emits the warning voice: "[phasic_system] WARNING: data.json was missing or corrupt — rebuilding state." L94 escalates to ERROR only if the rebuild itself fails: "[phasic_system] ERROR: failed to rebuild $DATA_FILE." The script chooses fail-safe-rebuild over fail-crash; the agent never gets blocked by a corrupt JSON state.]*

**The new-plugin lens.** When you guide your seed to add a plugin that needs state, the seed designs the state's *interface* first: what read commands does this plugin publish for other plugins (and the agent) to use? What mutation commands does this plugin publish for its own hooks to use? Then `data.json` becomes the cache the scripts operate on. Tell your seed: *if you cannot enumerate what reads each field and what writes each field, the design is not done yet.*

**The minimum-viable plugin shape.** A plugin without `data.json` is stateless — it carries no runtime bookkeeping. `question_discipline` is again the example: pure gate, no state, no `data.json`. The absence signals stateless enforcement.

---

State is private. Mutation is serialized. Cross-plugin queries route through the script CLI, never through the raw file. The next sub-essay opens the organ where the plugin's *narrated knowledge* lives — `docs/`, including the word-capped `evolution.md` and the historian ratchet that auto-injects it before every edit.

---

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

*Previous: [Essay 7.3 — The Dual Voice Architecture](07_3-dual-voice-architecture.html) — two voice.xml files, one for the LLM and one for the operator.*
*Next: [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet.*
