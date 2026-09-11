---
title: "The Lock Ceremony"
date: "May 17, 2026"
slug: "lock-ceremony"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, PLUGIN-LOCK, TEST-LOCK, Safe-lock, Historian]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# The Lock Ceremony

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

---

[Essay 7.7](07_7-smaller-organs-and-wiring.html) closed the kit's anatomy — the smaller organs that round out specialized plugins, and the brain-root wiring file that decides which hooks ever fire. With every organ named, one question is left: how does the hard substrate get *edited* safely once the plugins are alive? Hooks, scripts, tests, hidden state, and plugin birth can corrupt the plugin or the agent's whole enforcement layer when mishandled; soft narrative and voice surfaces have their own phase discipline. This sub-essay opens the ceremony that protects hard-substrate edits.

The lock names and mechanics below belong to one historical Claude-based reference architecture. The transferable design is a narrow, operator-approved edit boundary with protected tests, deterministic close-out, and a history check before further evolution.

---

## The Parts of the Ceremony

Plugin code does not get edited the way ordinary files do. Each plugin's hooks, scripts, tests, and code-bearing files have earned their current shape; the test suite enshrines that shape; any change pays the cost of opening the plugin, editing inside it, and re-passing the tests before the change commits. *[ref: plugin-guard-blocks-staged-unlocked-edits | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The parts of the ceremony form a closed loop: **PLUGIN-LOCK** opens an edit session, **TEST-LOCK** gates test edits inside it, two **close-out paths** test the result and either commit, preserve for repair, or defensively revert, and the **historian ratchet** can refuse to open the lock at all when the plugin's narrative has fallen behind. Each part guards a different risk; together they make plugin edits earn their landing.

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>Interactive diagram.</strong> Walk the whole ceremony as a deck &mdash; the plugin as a single-concern cell, the one-unlocked invariant, [PLUGIN-LOCK], lock-cmd <em>preserve</em> vs safe-lock <em>auto-revert</em>, the nested [TEST-LOCK], and how a brand-new plugin is born from a 3-file floor. Click any box for the live code behind it.</span>
  <a href="explore/plugin-substrate.html" title="Open the interactive plugin lock-ceremony walkthrough" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the ceremony</a>
</aside>
<!-- /RAW_HTML -->

---

## `[PLUGIN-LOCK]` — Opens an Edit Session

The agent issues a structured `AskUserQuestion` prefixed `[PLUGIN-LOCK] <plugin_name>` with a body long enough to surface the cognitive work (currently a 100-word floor in the prototype, configurable) naming which plugin it will open, the specific changes it intends to make, why this plugin specifically, and the tests it will run. The operator approves; `lock-manager.sh` captures a `git rev-parse HEAD` SHA as `checkpoint_ref` and writes the unlocked plugin name into `plugin_integrity`'s hidden `data.json`. From that moment, edits inside the unlocked plugin proceed; edits anywhere else under `.claude/plugins/` are rejected. *[ref: plugin-lock-100-word-floor-checkpoint-data | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Two protected contexts for plugin-substrate edits.** Editing an existing plugin *or birthing a new one* requires one of two protected contexts: (A) `[GMODE]` with a body long enough to surface the cognitive work (currently a 100-word floor in the prototype, configurable) — the operator's deliberate maintenance lane; or (B) a focused job whose top-level `plugin_lock_approval` flag is set — established by the user confirming one of two agent-proposed approval questions: `[JOB-APPROVE-CREATION]`, which mints a new job already cleared for plugin work, or `[JOB-APPROVE-PLUGIN]`, which raises the same flag on the focused job already in flight when its work turns out to need a plugin edit. Either way the flag is set; a job is never locked into creation-time-only approval. New-plugin birth does not bypass the gate. Creating a plugin writes the agent's enforcement substrate too, so the same approval rule applies whether the target directory already exists or not. *[ref: plugin-lock-gmode-or-approved-job-gate | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## `[TEST-LOCK]` — A Finer-Grained Sub-Session

By default, the unlocked plugin's shell test files are still frozen even *inside* the unlocked plugin. To edit a specific `test-*.sh` file, the agent issues `[TEST-LOCK] <test_file>`. The reason: it is too easy to silently rewrite a correctly-failing test to make a broken change look passing. Test edits demand explicit, named permission. *[ref: test-file-lock-default-frozen-inside-unlocked | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Two-tier lock — PLUGIN-LOCK opens the cell; TEST-LOCK opens a specific shell test file inside the cell. The agent never gets a blanket "all shell tests editable while the plugin is unlocked" pass. Each shell test file the change touches earns its own ceremony. *[ref: test-lock-handler-gated-on-plugin-unlock | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## Two Close-Out Paths — Pass, Repair, or Revert

Two scripts share the close-out duty. The agent invokes `lock-cmd.sh` when edits are done — the active path: the plugin's full test suite runs at the lock boundary; on PASS the change commits and the lock clears; on FAIL the failures surface to stderr and the working tree is **preserved** (no revert) so the agent can fix and re-run. The defensive partner is `safe-lock.sh`, which fires automatically when the agent attempts a non-whitelisted operation while a plugin is unlocked — editing outside the plugin's directory, transitioning phases, finalizing a job: on FAIL the working tree rolls back to the captured `checkpoint_ref`, the plugin's hidden state records a structured revert entry, and a voice line writes to the operator's terminal. The agent does not get to ship a plugin change that breaks the plugin's own self-test. *[ref: lock-cmd-active-vs-safe-lock-defensive | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The cycle is symmetric to PLUGIN-LOCK: every lock opened gets closed by one of the two mechanisms above, with the test suite as the gate. There is no inline override; the deliberate `[GMODE]` route covered above (plus the user-approved-job route) are the only ways to admit an existing-plugin edit, and both leave an auditable trail. There is no "commit anyway"; there is no "I will fix it next session." Either the active-lock cycle leaves the agent looking at preserved failures it now has to fix, or the auto-revert cycle removes the broken edit from the working tree entirely. *[ref: safe-lock-auto-revert-no-commit-anyway-path | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- STALE IMAGE BRIEF — withheld until the diagram matches both close-out paths:
  ASSET: images/lock-ceremony-b7-8.png
  Concept: Chalk-on-blackboard flowchart — the active and defensive close-out paths shown separately.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk boxes
  and arrows; pastel chalk for box fills (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels and arrows; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other state names, command names, or descriptors.
  Layout: Four hand-drawn chalk boxes arranged in a vertical flow down the center of the board, each labeled IN WHITE CHALK with its exact text:
    Box 1 (cyan fill, top): "[PLUGIN-LOCK] <name> approved"
    Box 2 (green fill): "edits inside unlocked plugin only"
    Box 3 (pink fill): "run plugin test suite"
    Box 4 (no fill, decision diamond drawn as a chalk rhombus): "all tests pass?"
  Single white-chalk arrows connect Box 1 → Box 2 → Box 3 → Box 4.
  From Box 4, three arrows fan out to terminal boxes at the bottom:
    Left arrow labeled IN WHITE CHALK exactly "yes" → magenta box labeled "commit + clear lock"
    Center arrow labeled IN WHITE CHALK exactly "active fail" → orange box labeled "preserve + fix + re-run"
    Right arrow labeled IN WHITE CHALK exactly "defensive fail" → orange box labeled "revert + log"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "[PLUGIN-LOCK] <name> approved", "edits inside unlocked plugin only", "run plugin test suite", "all tests pass?", "yes", "active fail", "defensive fail", "commit + clear lock", "preserve + fix + re-run", "revert + log". No other words, file names, folders, or state descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.8. Both paths test before commit. Active failure preserves work for repair; defensive failure reverts and logs."
-->

---

## The Historian Ratchet — Refuses the Lock

The lock can be refused before it opens. Each plugin keeps the 2000-word-capped `docs/evolution.md` narrative covered in [Essay 7.5](07_5-docs-and-historian.html); `drift-check.sh` counts commits landed against the plugin since `evolution.md` was last touched. If drift exceeds threshold, `lock-manager.sh` rejects the `[PLUGIN-LOCK]` approval and tells the agent to dispatch the plugin's historian subagent first. The historian re-narrates the cycles since last sync, commits the refreshed `evolution.md`, and the drift counter resets. Only then does the lock open. A plugin cannot be edited indefinitely without periodically forcing its own history to be re-told. *[ref: drift-counter-rejects-lock-historian-forced | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## A Closed Loop — The Only Way to Evolve a Plugin Is to Have Already Understood It

PLUGIN-LOCK gates the operator-approved entry. TEST-LOCK forces deliberate shell-test edits. The two close-out paths require passing tests before commit: active close-out preserves failures for repair, while defensive safe-lock reverts them. The historian ratchet refuses unlock when the plugin's narrative has fallen behind.

Each part, a risk closed:
- An edit landing without operator approval (closed by PLUGIN-LOCK).
- A correctly-failing test silently rewritten to mask a broken change (closed by TEST-LOCK).
- A change committing despite a failing test (closed by the active and defensive close-out paths).
- A plugin getting edited without anyone re-reading the cycles that produced its current shape (closed by the historian ratchet).

Plugin_integrity itself follows the same ceremony when its own hooks are edited — there is no privileged path. The plugin that enforces the ceremony submits to it. That is what makes the ceremony credible: it is not enforcement that lives outside the system; it is enforcement built into the same cell membrane every other plugin lives behind. *[ref: no-plugin-integrity-bypass | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A research lab's seed could install the same ceremony around an `experiment-protocol` plugin — `[PROTOCOL-LOCK]` opens the edit session; `[REVIEWER-LOCK]` gates changes to the validator tests; the safe-lock cycle reverts if the IRB-checklist tests fail; the historian ratchet forces re-narration of the protocol's evolution before another edit lands.

---

The ceremony is the safety rail. The next sub-essay puts it on the track — a walkthrough of what guiding your seed to *create* a brand-new plugin actually looks like in motion, with every lock fired in the order the plugin needs it.

---

*Essay 7.8 — The Plugin Kit, Part 8 of 9.*

*Previous: [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — config, tests, template, e2e, and the wiring file that lives outside every cell wall.*
*Next: [Essay 7.9 — Building a New Plugin](07_9-creating-a-new-plugin.html) — the tier-3 walkthrough; the lock ceremony exercised through a real birth.*
