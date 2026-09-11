---
title: "agents/ and the 80/20 Dispatch Budget"
date: "May 17, 2026"
slug: "agents-and-80-20-budget"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Subagents, 80-20]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# `agents/` and the 80/20 Dispatch Budget

*Essay 7.6 — The Plugin Kit, Part 6 of 9.*

---

[Essay 7.5](07_5-docs-and-historian.html) opened the docs organ — the per-plugin narrative the historian subagent writes on a drift-count ratchet. Subagents follow the same scoping discipline as the rest of the kit: each one lives inside the plugin that dispatches it. This sub-essay opens the `agents/` organ — the per-plugin subagent pool — and the budget that turns the 80/20 preference into recurring pressure to delegate. The directory names and numeric defaults describe one historical Claude-based reference architecture; the separation between orchestration and delegated work applies across CLI-agent harnesses.

---

## `agents/` — The Subagent Pool

**What it is.** A directory of subagent definitions the plugin owns. Subagent names are namespace-prefixed to their owning concern — `historian-*` for evolution narration, `observe-*` for research, `verify-*` for auditing, `condense-*` for waterfall routing. The prefix is the lock-boundary marker. Per-plugin scoping — every plugin owns the subagents it dispatches. *[ref: agents-dir-per-plugin-scoping | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who reads them.** The CLI-agent runtime reads the definitions when the orchestrating agent invokes a subagent by name. In the historical Claude implementation, the concise frontmatter description and tool list help the orchestrator decide when to dispatch; the definition's full body becomes the worker's instructions when it starts.

**Who writes them.** In the historical reference architecture, CONDENSE step 5 consumes `[AGENT-UPDATE]` markers and applies the accepted changes through the plugin's edit gate. The worker does not rewrite its own definition while it is running; the update returns through the harness's review waterfall. *[ref: condense-step-5-agent-update-marker | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**What they depend on.** The plugin's own `scripts/` for tools the subagent calls, plus the harness's shared library when a common helper is needed. The agents in this directory are not general cross-plugin editors — each subagent is scoped to its owning plugin's surface. *[ref: subagent-per-plugin-scoping-evidenced | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/agents-80-20-b7-6.png
  Concept: Chalk-on-blackboard hub-and-spoke teaching the 80/20 dispatch discipline. A SMALL main-session circle at the center (orchestration) and NOTICEABLY LARGER per-phase subagent pools around it (the bulk of the work). The size contrast — small hub, big pools — IS the message, plus a budget that makes delegation structural. Do not include agent counts; the pool size drifts over time.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk circles
  and arrows; pastel chalk for the subagent pools (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, and the main-session circle; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not add agent counts or numeric labels beyond the required "20%" text.
  Layout: One SMALL white-chalk circle at the dead center of the board — clearly the smallest circle on the board — labeled IN WHITE CHALK on two lines exactly "main session" / "orchestrate (20%)". Around it, six NOTICEABLY LARGER pastel chalk circles fanning out in a hexagonal arrangement (their larger size versus the tiny hub is the whole point), each labeled IN WHITE CHALK with its exact text and nothing else:
    Circle 1 (cyan, top): "observe-*"
    Circle 2 (green, upper right): "plan-*"
    Circle 3 (orange, lower right): "execute-*"
    Circle 4 (pink, bottom): "verify-*"
    Circle 5 (magenta, lower left): "condense-*"
    Circle 6 (cyan, darker, upper left): "historian-*"
  From the central main-session circle, a single white-chalk arrow goes OUT to each of the six surrounding pools (six arrows total, all radial), each labeled with the same single word IN WHITE CHALK exactly: "dispatch".
  In a chalk box at the bottom-right corner of the board, draw a small "budget panel" with header IN WHITE CHALK reading exactly "direct-action budget", and three short white-chalk lines stacked exactly:
    Line 1: "dispatch earns budget"
    Line 2: "direct edit spends it"
    Line 3: "at zero, you must delegate"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "main session", "orchestrate (20%)", "observe-*", "plan-*", "execute-*", "verify-*", "condense-*", "historian-*", "dispatch", "direct-action budget", "dispatch earns budget", "direct edit spends it", "at zero, you must delegate". No other words, numbers, counts, file names, plugin names, or subagent names may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.6. The 80/20 target — the main session stays small and orchestrates while the per-phase subagent pools do the bulk of the work. A direct-action budget makes delegation structural: dispatching earns budget for direct edits, so running dry forces delegation."
-->

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);">The whole economy, walkable. The eighty-twenty split, the direct-action budget that earns it back through dispatch, the gate exemption that lets fan-out run, the per-plugin pools and per-phase rosters, the two wiring hooks, and the workflow execution layer &mdash; laid out as an interactive concept-deck you can hover and click.</span>
  <a href="explore/delegation-economy.html" style="flex-shrink: 0; display: inline-block; padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; text-decoration: none; color: #fff; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the delegation economy</a>
</aside>
<!-- /RAW_HTML -->

**Why per-plugin scoping.** The historical reference architecture's safe-lock cycle allows only one plugin to be unlocked at a time. A subagent that mutated multiple plugins would need to coordinate locks across every directory it touched, defeating that discipline. Per-plugin scoping makes the subagent's writable surface match the lock boundary exactly. A read-only investigator can still compare evidence across plugins; the boundary governs mutation. *[ref: single-unlocked-plugin-invariant | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The 80/20 dispatch budget.** The architecture insists on the majority of cognitive work happening in subagents (the historical prototype targets roughly 80/20) and the remainder in the main session. Inside EXECUTE, every phase entry seeds a starting balance of five direct actions, so the main session can begin building right away; every edit outside the project-instruction layer draws against that balance, and every `execute-*` subagent dispatch replenishes it by three, with both defaults configurable. The main session spends the balance down and learns that dispatch is how the budget refills. When the balance hits zero, the EXECUTE guard blocks further direct edits until another `execute-*` worker is launched. The ratio is an architectural target, not arithmetic derived from counting edits and launches. The deterministic claim is narrower and stronger: direct action repeatedly runs out unless the main session delegates. *[ref: execute-direct-action-budget-3-per-dispatch | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The new-plugin lens.** When you guide your seed to add a plugin that needs delegated investigation, the seed authors subagent definitions inside the plugin's own `agents/` directory. Not in a global pool. Tell your seed: *a worker that can mutate a plugin belongs inside that plugin's lock boundary; keep its write authority local.* A plugin that does not delegate investigation skips `agents/` entirely. Lifecycle and interaction-summary plugins are examples: their concerns are local state machines, not research surfaces. A research lab's seed could carry the same shape — `experiment-*` subagents owned by an experiment-tracking plugin, `literature-*` subagents owned by a lit-review plugin; the lock boundary keeps each pool inside the plugin that owns its mutations. *[ref: agents-dir-skipped-by-stateful-plugins | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

Subagents are per-plugin by design; the dispatch budget keeps the main session returning work to them. Investigation delegates; mutation stays local. The next sub-essay opens the smaller cognitive organs that round out the kit — `config.conf`, `tests/`, `template/`, `e2e/`, `LICENSE` + `README.md` — and the brain-root wiring file that makes any of it fire.

---

*Essay 7.6 — The Plugin Kit, Part 6 of 9.*

*Previous: [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet.*
*Next: [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — conditional organs + the registry that turns hooks on.*
