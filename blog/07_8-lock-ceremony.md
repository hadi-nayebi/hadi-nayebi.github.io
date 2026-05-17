---
title: "The Lock Ceremony"
date: "May 2026"
slug: "lock-ceremony"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, PLUGIN-LOCK, TEST-LOCK, Safe-lock, Historian]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/agent-anatomy.png"
---

# The Lock Ceremony

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

---

[Essay 7.7](07_7-smaller-organs-and-wiring.html) closed the kit's anatomy — the smaller organs that round out specialized plugins, and the brain-root wiring file that decides which hooks ever fire. With every organ named, one question is left: how does any of this get *edited* safely once the plugins are alive? Cell walls, dual voices, hidden state, evolution narratives — every organ is also a surface that, mishandled, can corrupt the plugin or the agent's whole enforcement layer. This sub-essay opens the ceremony that protects every edit.

---

## The Parts of the Ceremony

Plugin code does not get edited the way ordinary files do. Each plugin's hooks, scripts, tests, and code-bearing files have earned their current shape; the test suite enshrines that shape; any change pays the cost of opening the plugin, editing inside it, and re-passing the tests before the change commits.

The parts of the ceremony form a closed loop: **PLUGIN-LOCK** opens an edit session, **TEST-LOCK** gates test edits inside it, **safe-lock close-out** commits or reverts on the test result, and the **historian ratchet** can refuse to open the lock at all when the plugin's narrative has fallen behind. Each part guards a different risk; together they make plugin edits earn their landing.

---

## `[PLUGIN-LOCK]` — Opens an Edit Session

The agent issues a structured `AskUserQuestion` prefixed `[PLUGIN-LOCK] <plugin_name>` with a body long enough to surface the cognitive work (currently a 100-word floor in the prototype, configurable) explaining what flaw is being fixed, what files will be touched, and what the plugin's behavior will look like before vs after the edit. The operator approves; `lock-manager.sh` captures a `git rev-parse HEAD` SHA as `checkpoint_ref` and writes the unlocked plugin name into `plugin_integrity`'s hidden `data.json`. From that moment, edits inside the unlocked plugin proceed; edits anywhere else under `.claude/plugins/` are rejected. *[ref: plugin-lock-100-word-floor-checkpoint-data | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:127,141-142,189-192 | L189-190 enforce the 100-word floor: `q_word_count=$(echo "$QUESTION" | wc -w); if [[ "$q_word_count" -lt "${PLUGIN_LOCK_WORD_MIN:-100}" ]]`. L191-192 emit the block voice: "[PLUGIN-LOCK] question body is $q_word_count words; minimum is ${PLUGIN_LOCK_WORD_MIN:-100}. WHY: a short lock request hides the cognitive work that should precede every plugin unlock." L127 shows the data.json state schema: `'{"unlocked_plugin":"","checkpoint_ref":"","unlocked_test":"","revert_log":[]}'`. L141-142 commits both fields atomically: `.unlocked_plugin = $p | .checkpoint_ref = $c`. The checkpoint enables safe-lock revert; the unlocked_plugin field drives plugin-guard's edit allowlist.]*

**Gmode-only for existing plugins.** Editing an existing plugin requires the operator to enter gmode first (`[GMODE]` with a body long enough to surface the cognitive work — currently a 100-word floor in the prototype, configurable). New plugin creation is different — that is a full multi-cycle OPEVC job with its own cycle-1 PLUGIN-LOCK. The asymmetry codifies a real distinction: editing existing plugin code alters the agent's own enforcement substrate, which is meta-cognitive work that belongs outside normal OPEVC cycles. Creating a new plugin fits inside an OPEVC cycle because the new plugin's code is being authored, not modified. *[ref: plugin-lock-requires-gmode-for-existing | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:202-213 | L202 comment: "### Gmode-only-lock check (existing plugin edits require gmode — D71, 2026-05-13)." L204: "already on disk, require current_phase == \"gmode\". New plugin creation is part of a [different path]." L213 emits the block: "[PLUGIN-LOCK] $target (existing plugin) requires gmode — currently in $current_phase. WHY: edits to existing plugin code happen in deliberate gmode sessions, NOT inside normal OPEVC cycles where the phase-section discipline applies. WHAT TO DO: ask [GMODE] first with a 100+ word justification." The asymmetry is enforced: existing-plugin edits gated on gmode; new-plugin birth has its own path.]*

---

## `[TEST-LOCK]` — A Finer-Grained Sub-Session

By default, the unlocked plugin's `tests/` directory is frozen even *inside* the unlocked plugin. To edit a specific `test-*.sh` file, the agent issues `[TEST-LOCK] <test_file>`. The reason: it is too easy to silently rewrite a correctly-failing test to make a broken change look passing. Test edits demand explicit, named permission.

Two-tier lock — PLUGIN-LOCK opens the cell; TEST-LOCK opens a specific test file inside the cell. The agent never gets a blanket "all tests editable while the plugin is unlocked" pass. Each test file the change touches earns its own ceremony.

---

## Safe-Lock Close-Out — Pass or Revert

The agent invokes `lock-cmd.sh` when edits are done. The plugin's full test suite runs at the lock boundary; on PASS the change commits and the lock clears; on FAIL the working tree rolls back to the captured `checkpoint_ref`, the plugin's hidden state records a structured revert entry, and a voice line writes to the operator's terminal. The agent does not get to ship a plugin change that breaks the plugin's own self-test.

The cycle is symmetric to PLUGIN-LOCK: every lock opened gets closed by the same mechanism, with the test suite as the gate. There is no inline override; the deliberate `[GMODE]` route covered above is the only escape, and it leaves an auditable trail. There is no "commit anyway"; there is no "I will fix it next session." The change either passes the tests it inherited or it disappears from the working tree.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard flowchart — the safe-lock cycle's pass-or-revert branch.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk boxes
  and arrows; pastel chalk for box fills (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels and arrows; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other state names, command names, or descriptors.
  Layout: Five hand-drawn chalk boxes arranged in a vertical flow down the center of the board, each labeled IN WHITE CHALK with its exact text:
    Box 1 (cyan fill, top): "[PLUGIN-LOCK] <name> approved"
    Box 2 (green fill): "edits inside unlocked plugin only"
    Box 3 (orange fill): "lock-cmd.sh OR safe-lock.sh fires"
    Box 4 (pink fill): "run plugin test suite"
    Box 5 (no fill, decision diamond drawn as a chalk rhombus): "all tests pass?"
  Single white-chalk arrows connect Box 1 → Box 2 → Box 3 → Box 4 → Box 5.
  From Box 5, two arrows fan out to two terminal boxes side-by-side at the bottom:
    Left arrow labeled IN WHITE CHALK exactly "yes" → magenta box labeled "commit + clear unlocked_plugin"
    Right arrow labeled IN WHITE CHALK exactly "no" → orange box (warmer chalk) labeled "revert to checkpoint_ref + log revert"
  Below the two terminal boxes, draw a small chalk note IN WHITE CHALK reading exactly: "no override".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "[PLUGIN-LOCK] <name> approved", "edits inside unlocked plugin only", "lock-cmd.sh OR safe-lock.sh fires", "run plugin test suite", "all tests pass?", "yes", "no", "commit + clear unlocked_plugin", "revert to checkpoint_ref + log revert", "no override", plus the caption below. No other words, file names, folders, or state descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.5. Test pass-or-revert. Every plugin edit passes through the same gate."
-->

---

## The Historian Ratchet — Refuses the Lock

The lock can be refused before it opens. Each plugin keeps the 2000-word-capped `docs/evolution.md` narrative covered in [Essay 7.5](07_5-docs-and-historian.html); `drift-check.sh` counts commits landed against the plugin since `evolution.md` was last touched. If drift exceeds threshold, `lock-manager.sh` rejects the `[PLUGIN-LOCK]` approval and tells the agent to dispatch the plugin's historian subagent first. The historian re-narrates the cycles since last sync, commits the refreshed `evolution.md`, and the drift counter resets. Only then does the lock open. A plugin cannot be edited indefinitely without periodically forcing its own history to be re-told. *[ref: drift-counter-rejects-lock-historian-forced | .claude/plugins/plugin_integrity/scripts/drift-check.sh:9-11 + .claude/plugins/plugin_integrity/hooks/lock-manager.sh (drift gate path) | The drift contract is the schedule-based ratchet: "every N git commits to the plugin, the historian must update [evolution.md] — no insertion thresholds — the historian is mandated to update on schedule." When the count exceeds `DRIFT_THRESHOLD` (default 10, configurable via plugin_integrity/config.conf), the [PLUGIN-LOCK] approval is rejected with a voice naming the plugin's historian subagent as the required next dispatch. Re-narrating + auto-committing the refreshed evolution.md resets the counter; only then does subsequent [PLUGIN-LOCK] succeed.]*

---

## A Closed Loop — The Only Way to Evolve a Plugin Is to Have Already Understood It

PLUGIN-LOCK gates the operator-approved entry. TEST-LOCK forces deliberate test edits. Safe-lock makes every commit conditional on tests passing or reverts the working tree. The historian ratchet refuses unlock when the plugin's narrative has fallen behind.

Each part, a risk closed:
- An edit landing without operator approval (closed by PLUGIN-LOCK).
- A correctly-failing test silently rewritten to mask a broken change (closed by TEST-LOCK).
- A change committing despite a failing test (closed by safe-lock).
- A plugin getting edited without anyone re-reading the cycles that produced its current shape (closed by the historian ratchet).

Plugin_integrity itself follows the same ceremony when its own hooks are edited — there is no privileged path. The plugin that enforces the ceremony submits to it. That is what makes the ceremony credible: it is not enforcement that lives outside the system; it is enforcement built into the same cell membrane every other plugin lives behind.

A research lab's seed could install the same ceremony around an `experiment-protocol` plugin — `[PROTOCOL-LOCK]` opens the edit session; `[REVIEWER-LOCK]` gates changes to the validator tests; the safe-lock cycle reverts if the IRB-checklist tests fail; the historian ratchet forces re-narration of the protocol's evolution before another edit lands.

---

The ceremony is the safety rail. The next sub-essay puts it on the track — a walkthrough of what guiding your seed to *create* a brand-new plugin actually looks like in motion, with every lock fired in the order the plugin needs it.

---

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

*Previous: [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — config, tests, template, e2e, and the wiring file that lives outside every cell wall.*
*Next: [Essay 7.9 — Building a New Plugin](07_9-creating-a-new-plugin.html) — the tier-3 walkthrough; the lock ceremony exercised through a real birth.*
