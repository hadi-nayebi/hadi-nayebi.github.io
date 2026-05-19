---
title: "agents/ and the 80/20 Dispatch Budget"
date: "May 2026"
slug: "agents-and-80-20-budget"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Subagents, 80-20]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# `agents/` and the 80/20 Dispatch Budget

*Essay 7.6 — The Plugin Kit, Part 6 of 9.*

---

[Essay 7.5](07_5-docs-and-historian.html) opened the cognitive docs organ — the per-plugin narrative the historian subagent writes on a drift-count ratchet. Subagents follow the same scoping discipline as the rest of the kit: each one lives inside the plugin that dispatches it. This sub-essay opens the cognitive `agents/` organ — the per-plugin subagent pool — and the budget that mechanizes the 80/20 split between main-session direct action and delegated investigation.

---

## `agents/` — The Subagent Pool

**What it is.** A directory of subagent definitions the plugin owns. Subagent names are namespace-prefixed to their owning plugin's concern — `historian-*` for evolution narration (owned by `plugin_integrity`), `observe-*` for research (owned by `phase_observe`), `verify-*` for auditing, `condense-*` for waterfall routing. The prefix is the lock-boundary marker. Per-plugin scoping — every plugin owns the subagents it dispatches. *[ref: agents-dir-per-plugin-scoping | .claude/plugins/*/agents/ | `find .claude/plugins -name agents -type d` returns 11 dirs (5 phase plugins + phasic_system + plugin_integrity + brain_guard + question_discipline + job_archiver + job_blocker) — NOT every plugin, only those that delegate investigation. Each agents/ dir contains the plugin's owned subagents: phase_observe/agents/ has observe-codebase-explorer, observe-contradiction-finder, observe-dependency-mapper, observe-file-comparer, etc. plugin_integrity/agents/ has 12 historian-* subagents; question_discipline/agents/ carries the 13th (historian-question-discipline) — 13 total historian-* across all plugins. Subagent names are name-spaced to their plugin (e.g., `observe-*`, `condense-*`, `historian-*`).]*

**Who reads them.** Claude Code, when the agent invokes a subagent by name. The agent itself reads only the subagent's frontmatter (description + tools) when deciding whether to dispatch.

**Who writes them.** CONDENSE step 5 (which consumes `[AGENT-UPDATE]` markers). PLUGIN-LOCK as the underlying gate. *[ref: condense-step-5-agent-update-marker | .claude/plugins/phase_condense/agents/CLAUDE.md (Agent Inventory + Defined Agents + Growth Model sections) + .claude/plugins/phase_condense/scripts/voice.xml `id="condense.commit.block-points"` | The Agent Inventory section names the worker: "**condense-agent-updater** | Use when: applying [AGENT-UPDATE] markers from..." The Defined Agents section specifies the protocol: "parse `[AGENT-UPDATE]` marker → Glob + realpath symlink resolve → Edit correct section." The Growth Model section establishes the cycle: "CONDENSE step 5 (condense-agent-updater) reads these blocks and applies updates to the agent .md file in a subsequent cycle. The agent does not edit its own definition — that loop is gated by CONDENSE's waterfall." The condense voice element `condense.commit.block-points` confirms the marker class in operator-facing coaching: "[AGENT-UPDATE] harden the subagent def."]*

**What they depend on.** The plugin's own `scripts/` (for tools the subagent calls). The shared `.claude/plugins/lib/` if the subagent uses common helpers (e.g., `voice-helper`). The agents in this directory are NOT cross-plugin — each subagent is scoped to its owning plugin's surface. *[ref: subagent-per-plugin-scoping-evidenced | .claude/plugins/plugin_integrity/agents/historian-brain-guard.md (Objective + M2 sections) + .claude/plugins/lib/ | A representative historian (historian-brain-guard) declares "You are the architectural historian for the `brain_guard` plugin" (Objective section) and scopes its scan to `git log -p -- .claude/plugins/brain_guard/` (M2 section) — strict per-plugin surface. Tools in frontmatter (Read, Grep, Bash, Write, Edit, MultiEdit) call the plugin's own `scripts/`. The shared `.claude/plugins/lib/` (e.g., voice-helper.sh) is the common dependency surface; no per-plugin lib/ exists in the prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/agents-80-20-b7-6.png
  Concept: Chalk-on-blackboard hub-and-spoke — small main-session circle at the center orchestrating; larger plugin-scoped subagent pools fanning out around it.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk circles
  and arrows; pastel chalk for the subagent pools (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, and the main-session circle; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other subagent names, plugin names, or descriptors. Use only the counts listed.
  Layout: One small white-chalk circle at the dead center of the board, labeled IN WHITE CHALK exactly "main session (20%)". Around it, six larger pastel chalk circles fanning out in a hexagonal arrangement, each labeled IN WHITE CHALK with its exact text:
    Circle 1 (cyan, top): "observe-* (12)"
    Circle 2 (green, upper right): "plan-* (6)"
    Circle 3 (orange, lower right): "execute-* (3)"
    Circle 4 (pink, bottom): "verify-* (5)"
    Circle 5 (magenta, lower left): "condense-* (7)"
    Circle 6 (cyan, darker, upper left): "historian-* (13)"
  From the central main-session circle, a single white-chalk arrow goes OUT to each of the six surrounding pools (six arrows total, all radial). Each arrow is labeled with the same single word IN WHITE CHALK exactly: "dispatch".
  In a chalk box at the bottom-right corner of the board, draw a small "budget panel" with header IN WHITE CHALK reading exactly "direct-action budget", and two short white-chalk lines stacked:
    Line 1: "+3 grants per execute-* dispatch"
    Line 2: "-1 per project file edit"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "main session (20%)", "observe-* (12)", "plan-* (6)", "execute-* (3)", "verify-* (5)", "condense-* (7)", "historian-* (13)", "dispatch", "direct-action budget", "+3 grants per execute-* dispatch", "-1 per project file edit", plus the caption below. No other words, file names, plugin names, or subagent names may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.6. Main session orchestrates. Subagents fan out. The 80/20 split is a context-discipline budget, not a guideline."
-->

**Why per-plugin scoping.** The safe-lock cycle inside `plugin_integrity` requires that only one plugin be unlocked at a time. A subagent that ranged across multiple plugins would need to coordinate locks across every directory it touches, defeating the unlock discipline. Per-plugin scoping makes the subagent's surface match the lock boundary exactly. *[ref: single-unlocked-plugin-invariant | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:239-246 | The PreToolUse guard reads `.unlocked_plugin` from data.json (L245) and blocks further unlock attempts if a plugin is already unlocked. The invariant is enforced at the lock-acquisition step: only one plugin's `.unlocked_plugin` field can be non-empty at a time. Cross-plugin subagents would need to lock multiple plugins simultaneously, violating this invariant. Per-plugin scoping aligns the subagent's edit surface with the single-unlock contract.]*

**The 80/20 dispatch budget.** The architecture insists on the majority of cognitive work happening in subagents (the prototype targets roughly 80/20) and the remainder in the main session. Inside EXECUTE phase, this is mechanized: every `execute-*` subagent dispatch grants the main session a fixed budget of direct actions (currently three in the prototype, configurable); every non-`.claude/` file edit draws against the grant. When the budget hits zero, the EXECUTE guard hard-blocks further edits until the agent earns more capacity by launching another `execute-*` subagent. The 80/20 is not a guideline; it is a budget the main session must earn through dispatch. *[ref: execute-direct-action-budget-3-per-dispatch | .claude/plugins/phase_execute/hooks/execute-tracker.sh:29,358,365 + .claude/plugins/phase_execute/scripts/voice.xml `id="execute-tracker-coaching"` | execute-tracker.sh L29 documents the contract: "Budget Grant Model: Launched execute-* subagents earn +3 direct-action budget grants." L358: "for execute phase) get +3 direct-action budget grants. Grants are the ONLY way to [earn project-file edit budget]." L365: "Budget: grant +3 direct actions per execute-* subagent launch." The scripts/voice.xml coaching element `execute-tracker-coaching` surfaces the rule operator-side: "Each execute-* subagent launch grants +3 direct-action budget for file edits. Budget consumed -1 per non-claude/ edit. Stay aware: you're trading budget for execution surface." execute-guard.sh L387 emits the BLOCK voice when budget exhausted: "Direct action budget exhausted. Launch an execute-* subagent to earn +3 budget."]*

**The new-plugin lens.** When you guide your seed to add a plugin that needs delegated investigation, the seed authors subagent definitions inside the plugin's own `agents/` directory. Not in a global pool. Tell your seed: *a subagent that lives outside its owning plugin breaks the lock discipline; keep it local.* A plugin that does not delegate investigation skips `agents/` entirely — `job_core` and `interaction_summary` both ship without one because their concerns are local state machines, not research surfaces. A research lab's seed could carry the same shape — `experiment-*` subagents owned by an experiment-tracking plugin, `literature-*` subagents owned by a lit-review plugin; the lock boundary keeps each pool inside the plugin that mutates its own data. *[ref: agents-dir-skipped-by-stateful-plugins | .claude/plugins/job_core/ + .claude/plugins/interaction_summary/ | `find .claude/plugins -name agents -type d` confirms job_core and interaction_summary are absent from the result set; both plugins ship hooks/, scripts/, docs/, tests/ but NO agents/ dir because their concerns (job lifecycle state, summary chain) are mutations on local data.json, not research surfaces requiring delegated investigation. The absence is structural: plugins that DO delegate research (phase_observe, phase_verify, plugin_integrity historians) ship agents/; plugins that mutate state in place do not.]*

---

Subagents are per-plugin by design; the 80/20 split is enforced as a budget the main session must earn through dispatch. Investigation delegates; mutation stays local. The next sub-essay opens the smaller cognitive organs that round out the kit — `config.conf`, `tests/`, `template/`, `e2e/`, `LICENSE` + `README.md` — and the brain-root wiring file that makes any of it fire.

---

*Essay 7.6 — The Plugin Kit, Part 6 of 9.*

*Previous: [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet.*
*Next: [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — conditional organs + the registry that turns hooks on.*
