---
title: "The Lock Ceremony"
date: "May 2026"
slug: "lock-ceremony"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, PLUGIN-LOCK, TEST-LOCK, Safe-lock, Historian]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# The Lock Ceremony

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

---

[Essay 7.7](07_7-smaller-organs-and-wiring.html) closed the kit's anatomy — the smaller organs that round out specialized plugins, and the brain-root wiring file that decides which hooks ever fire. With every organ named, one question is left: how does any of this get *edited* safely once the plugins are alive? Cell walls, dual voices, hidden state, evolution narratives — every organ is also a surface that, mishandled, can corrupt the plugin or the agent's whole enforcement layer. This sub-essay opens the ceremony that protects every edit.

---

## The Parts of the Ceremony

Plugin code does not get edited the way ordinary files do. Each plugin's hooks, scripts, tests, and code-bearing files have earned their current shape; the test suite enshrines that shape; any change pays the cost of opening the plugin, editing inside it, and re-passing the tests before the change commits. *[ref: plugin-guard-blocks-staged-unlocked-edits | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:385 | The phase-transition guard rejects any commit-attempt with staged plugin-code changes outside the unlock state: "BLOCKED: Staged code changes in plugin $_sp but it is not unlocked. Docs (CLAUDE.md, docs/*.md) commit freely without unlock; only scripts/hooks/tests require it. Unstage with git reset HEAD .claude/plugins/$_sp/ or unlock with [PLUGIN-LOCK] $_sp first." The cost is structural — code changes cannot land without going through the unlock-edit-test-commit loop the ceremony defines. Documentation under docs/ + CLAUDE.md commits freely (free of the test-gate); only the load-bearing code surfaces (scripts/, hooks/, tests/) require the ceremony.]*

The parts of the ceremony form a closed loop: **PLUGIN-LOCK** opens an edit session, **TEST-LOCK** gates test edits inside it, **safe-lock close-out** commits or reverts on the test result, and the **historian ratchet** can refuse to open the lock at all when the plugin's narrative has fallen behind. Each part guards a different risk; together they make plugin edits earn their landing.

---

## `[PLUGIN-LOCK]` — Opens an Edit Session

The agent issues a structured `AskUserQuestion` prefixed `[PLUGIN-LOCK] <plugin_name>` with a body long enough to surface the cognitive work (currently a 100-word floor in the prototype, configurable) explaining what flaw is being fixed, what files will be touched, and what the plugin's behavior will look like before vs after the edit. The operator approves; `lock-manager.sh` captures a `git rev-parse HEAD` SHA as `checkpoint_ref` and writes the unlocked plugin name into `plugin_integrity`'s hidden `data.json`. From that moment, edits inside the unlocked plugin proceed; edits anywhere else under `.claude/plugins/` are rejected. *[ref: plugin-lock-100-word-floor-checkpoint-data | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:127,141-142,189-192 | L189-190 enforce the 100-word floor: `q_word_count=$(echo "$QUESTION" | wc -w); if [[ "$q_word_count" -lt "${PLUGIN_LOCK_WORD_MIN:-100}" ]]`. L191-192 emit the block voice: "[PLUGIN-LOCK] question body is $q_word_count words; minimum is ${PLUGIN_LOCK_WORD_MIN:-100}. WHY: a short lock request hides the cognitive work that should precede every plugin unlock." L127 shows the data.json state schema: `'{"unlocked_plugin":"","checkpoint_ref":"","unlocked_test":"","revert_log":[]}'`. L141-142 commits both fields atomically: `.unlocked_plugin = $p | .checkpoint_ref = $c`. The checkpoint enables safe-lock revert; the unlocked_plugin field drives plugin-guard's edit allowlist.]*

**Two protected contexts for existing-plugin edits.** Editing an existing plugin requires one of two protected contexts: (A) `[GMODE]` with a body long enough to surface the cognitive work (currently a 100-word floor in the prototype, configurable) — the operator's deliberate maintenance lane; or (B) a focused job whose `completion_requirements.plugin_lock_approval` flag is set — established by the user confirming an agent-proposed `[JOB-APPROVE-CREATION]` question. New-plugin creation bypasses this gate: birth happens inside an OPEVC cycle's EXECUTE phase because the new plugin's code is being authored, not modified. The asymmetry codifies a real distinction — editing existing plugin code alters the agent's own enforcement substrate, which is meta-cognitive work that needs explicit user authorization (either ambient via gmode, or scope-bounded via an approved job). *[ref: plugin-lock-gmode-or-approved-job-gate | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:202-229 | L202 comment names the gate: "### Gmode-OR-plugin_lock_approval gate (existing plugin edits — D71 + A14)." L205-208 enumerate the two admit conditions verbatim: "(1) current_phase == \"gmode\" (the operator's deliberate maintenance lane); OR (2) the focused job's completion_requirements.plugin_lock_approval == true (the user-approved-job lane, set via [JOB-APPROVE-CREATION] confirmation — A14)." L221 reads the plugin_lock_approval arm from job_core/data.json via jq. L227 blocks when BOTH arms fail. L229 emits the block: "BLOCKED: [PLUGIN-LOCK] $target (existing plugin) requires either gmode OR a focused job with plugin_lock_approval=true … WHY: edits to existing plugin code alter the substrate that polices every other plugin's discipline; that work belongs in one of two protected contexts."]*

---

## `[TEST-LOCK]` — A Finer-Grained Sub-Session

By default, the unlocked plugin's `tests/` directory is frozen even *inside* the unlocked plugin. To edit a specific `test-*.sh` file, the agent issues `[TEST-LOCK] <test_file>`. The reason: it is too easy to silently rewrite a correctly-failing test to make a broken change look passing. Test edits demand explicit, named permission. *[ref: test-file-lock-default-frozen-inside-unlocked | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:663-697 | The CHECK 2 block enforces test-file lock independently of PLUGIN-LOCK: L676-678 — only `.sh` files in tests/ are protected ("CLAUDE.md and other non-.sh files are freely editable"); L693 — `[[ "$test_file" == "$unlocked_test" ]] && exit 0` allows the one currently TEST-LOCK'd file; L697 emits the block when a different test file is targeted: "BLOCKED: Test file $test_file is locked. Use [TEST-LOCK] $test_file to unlock it for editing." Two-tier lock is structural — PLUGIN-LOCK opens the cell, TEST-LOCK opens a named test file within it.]*

Two-tier lock — PLUGIN-LOCK opens the cell; TEST-LOCK opens a specific test file inside the cell. The agent never gets a blanket "all tests editable while the plugin is unlocked" pass. Each test file the change touches earns its own ceremony.

---

## Safe-Lock Close-Out — Pass or Revert

Two scripts share the close-out duty. The agent invokes `lock-cmd.sh` when edits are done — the active path: the plugin's full test suite runs at the lock boundary; on PASS the change commits and the lock clears; on FAIL the failures surface to stderr and the working tree is **preserved** (no revert) so the agent can fix and re-run. The defensive partner is `safe-lock.sh`, which fires automatically when the agent attempts a non-whitelisted operation while a plugin is unlocked — editing outside the plugin's directory, transitioning phases, finalizing a job: on FAIL the working tree rolls back to the captured `checkpoint_ref`, the plugin's hidden state records a structured revert entry, and a voice line writes to the operator's terminal. The agent does not get to ship a plugin change that breaks the plugin's own self-test. *[ref: lock-cmd-active-vs-safe-lock-defensive | .claude/plugins/plugin_integrity/scripts/lock-cmd.sh:4-17 + .claude/plugins/plugin_integrity/scripts/safe-lock.sh | lock-cmd.sh header L4-5: "Complement to safe-lock.sh auto-revert. Active-lock is the PREFERRED close-out path: agent runs `bash lock-cmd.sh` to safely close the currently-unlocked plugin before any non-whitelisted phase transition." Behavior block L10-17: "PASS: commits plugin dir changes (or no-op if clean), clears unlocked_plugin + checkpoint_ref + unlocked_test, voice locked-tests-passed equivalent. exit 0. FAIL: surfaces failed test names + first 20 failure lines to stderr, emits lock-cmd-failed-no-revert voice, leaves data.json + working tree UNCHANGED (NO REVERT, NO QUARANTINE — active-lock preserves work). exit 1." safe-lock.sh fires auto-revert on the defensive path; together they cover both close-out scenarios.]*

The cycle is symmetric to PLUGIN-LOCK: every lock opened gets closed by one of the two mechanisms above, with the test suite as the gate. There is no inline override; the deliberate `[GMODE]` route covered above (plus the user-approved-job route) are the only ways to admit an existing-plugin edit, and both leave an auditable trail. There is no "commit anyway"; there is no "I will fix it next session." Either the active-lock cycle leaves the agent looking at preserved failures it now has to fix, or the auto-revert cycle removes the broken edit from the working tree entirely.

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
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.8. Test pass-or-revert. Every plugin edit passes through the same gate."
-->

---

## The Historian Ratchet — Refuses the Lock

The lock can be refused before it opens. Each plugin keeps the 2000-word-capped `docs/evolution.md` narrative covered in [Essay 7.5](07_5-docs-and-historian.html); `drift-check.sh` counts commits landed against the plugin since `evolution.md` was last touched. If drift exceeds threshold, `lock-manager.sh` rejects the `[PLUGIN-LOCK]` approval and tells the agent to dispatch the plugin's historian subagent first. The historian re-narrates the cycles since last sync, commits the refreshed `evolution.md`, and the drift counter resets. Only then does the lock open. A plugin cannot be edited indefinitely without periodically forcing its own history to be re-told. *[ref: drift-counter-rejects-lock-historian-forced | .claude/plugins/plugin_integrity/scripts/drift-check.sh:9-12 + .claude/plugins/plugin_integrity/hooks/lock-manager.sh:236,250-253 | The drift contract (drift-check.sh L9-12): "Contract: every N git commits to the plugin, the historian must update docs/evolution.md. ANY commit touching evolution.md resets drift to 0 (no insertion thresholds — the historian is mandated to update on schedule and the count of commits since that update is the gauge)." The gate in lock-manager.sh L250: `if [[ "$drift_count" -ge "$DRIFT_THRESHOLD" ]]; then` — threshold is configurable (config.conf ships `DRIFT_THRESHOLD=10`; code fallback is 5 if unset). L252 emits the `plugin-evolution-stale` voice; L253 echoes a fallback block message naming the per-plugin historian subagent (`historian-${target//_/-}`) as the required next dispatch. Re-narrating + auto-committing the refreshed evolution.md resets the counter; only then does subsequent [PLUGIN-LOCK] succeed.]*

---

## A Closed Loop — The Only Way to Evolve a Plugin Is to Have Already Understood It

PLUGIN-LOCK gates the operator-approved entry. TEST-LOCK forces deliberate test edits. Safe-lock makes every commit conditional on tests passing or reverts the working tree. The historian ratchet refuses unlock when the plugin's narrative has fallen behind.

Each part, a risk closed:
- An edit landing without operator approval (closed by PLUGIN-LOCK).
- A correctly-failing test silently rewritten to mask a broken change (closed by TEST-LOCK).
- A change committing despite a failing test (closed by safe-lock).
- A plugin getting edited without anyone re-reading the cycles that produced its current shape (closed by the historian ratchet).

Plugin_integrity itself follows the same ceremony when its own hooks are edited — there is no privileged path. The plugin that enforces the ceremony submits to it. That is what makes the ceremony credible: it is not enforcement that lives outside the system; it is enforcement built into the same cell membrane every other plugin lives behind. *[ref: no-plugin-integrity-bypass | .claude/plugins/plugin_integrity/hooks/lock-manager.sh + .claude/plugins/plugin_integrity/hooks/plugin-guard.sh | Grep across both files for any `target == "plugin_integrity"` exception or `unlocked == "plugin_integrity"` bypass returns ZERO hits — no special-case logic exempts plugin_integrity from the lock-manager admit gate, the plugin-guard edit-allowlist, or the safe-lock test-run. To edit any of plugin_integrity's own hooks/, scripts/, or tests/, the agent must issue `[PLUGIN-LOCK] plugin_integrity` (admitted via gmode OR plugin_lock_approval), pass the same 100-word floor, and survive the same safe-lock test gate. The "[plugin_integrity] BLOCKED:" prefix on every voice line names the MESSAGE author, not a target exception. Self-application is structural, not aspirational.]*

A research lab's seed could install the same ceremony around an `experiment-protocol` plugin — `[PROTOCOL-LOCK]` opens the edit session; `[REVIEWER-LOCK]` gates changes to the validator tests; the safe-lock cycle reverts if the IRB-checklist tests fail; the historian ratchet forces re-narration of the protocol's evolution before another edit lands.

---

The ceremony is the safety rail. The next sub-essay puts it on the track — a walkthrough of what guiding your seed to *create* a brand-new plugin actually looks like in motion, with every lock fired in the order the plugin needs it.

---

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

*Previous: [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — config, tests, template, e2e, and the wiring file that lives outside every cell wall.*
*Next: [Essay 7.9 — Building a New Plugin](07_9-creating-a-new-plugin.html) — the tier-3 walkthrough; the lock ceremony exercised through a real birth.*
