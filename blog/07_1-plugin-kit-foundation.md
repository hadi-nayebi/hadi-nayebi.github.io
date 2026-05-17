---
title: "Plugin Kit Foundation"
date: "May 2026"
slug: "plugin-kit-foundation"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/agent-anatomy.png"
---

# Plugin Kit Foundation

*Essay 7.1 — The Plugin Kit, Part 1 of 9. Essay 7 opens here; Parts 2 through 9 follow.*

---

A plugin is a cell.

[Essay 5](05_1-the-two-layer-foundation.html) opened the always-on layer — the plugins that run continuously, each minding one concern, side-by-side with the CLAUDE.md hierarchy. [Essay 6](06_1-phasic-foundation.html) opened the phasic layer — the cycle of phases whose moves are themselves Markov chains. Both layers are built from the same kind of object: a **plugin**, sitting in its own directory under `.claude/plugins/`, carrying its own organs. This essay opens that object.

The cell metaphor is load-bearing. A plugin is not a collection of loose files; it is a *system* of cognitive organs that read each other, write to each other, and depend on each other through declared channels. Each organ inside the cell carries the same three properties:

- **Who reads it** — which subsystem (the LLM, Claude Code itself, another plugin, the human operator) consumes the contents at runtime.
- **Who writes it** — which ceremony or phase is allowed to mutate it. Most organs have exactly one writer; the security model rests on that exclusivity.
- **What it depends on** — which other organs must already be in place for this organ to function correctly.

These three properties are how the cell wall stays porous (organs talk through declared channels) and rigid (organs never reach through undeclared ones). This mini-series opens the cell organ by organ, naming the three properties at each step, then closes with a Tier-3 walkthrough of authoring a new plugin from scratch.

## The journey ahead

Essay 7 splits into nine short sub-essays:

- **Essay 7.1 — Plugin Kit Foundation** *(you are here)* — the cell-as-system frame + this map
- [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the universal organs governed by PLUGIN-LOCK
- [Essay 7.3 — The Dual Voice Architecture](07_3-dual-voice-architecture.html) — `hooks/voice.xml` for the LLM + `scripts/voice.xml` for the operator
- [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — per-plugin private state, script-mediated
- [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet
- [Essay 7.6 — `agents/` and the 80/20 Dispatch Budget](07_6-agents-and-80-20-budget.html) — per-plugin subagent scoping
- [Essay 7.7 — Smaller Organs and Brain-Root Wiring](07_7-smaller-organs-and-wiring.html) — `config.conf`, `tests/`, `template/`, `settings.local.json`
- [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet
- [Essay 7.9 — Building a New Plugin](07_9-creating-a-new-plugin.html) — Tier-3 walkthrough

Essays 7.2 through 7.7 deep-dive the universal organs, one cluster per essay — the parts every plugin carries. Essay 7.8 opens the ceremony that protects edits to those organs once the plugin is in flight. Essay 7.9 is for the architects in the audience — a walkthrough of putting the kit to use, authoring a new plugin end to end.

---

We start with the universal skeleton — CLAUDE.md, hooks, and scripts — the three organs every plugin must have.

---

*Essay 7.1 — The Plugin Kit, Part 1 of 9.*

*Previous: [Essay 6.10 — The Plan-State Machine](06_10-plan-state-machine.html) — long-horizon memory closes the markov phasic brain series.*
*Next: [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the universal organs governed by PLUGIN-LOCK.*
