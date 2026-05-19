---
title: "Plugin Kit Foundation"
date: "May 2026"
slug: "plugin-kit-foundation"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# Plugin Kit Foundation

*Essay 7.1 — The Plugin Kit, Part 1 of 9. Essay 7 opens here; Parts 2 through 9 follow.*

---

A plugin is a cell.

[Essay 5](../b5/05_1-the-two-layer-foundation.html) opened the always-on layer — the plugins that run continuously, each minding one concern, side-by-side with the CLAUDE.md hierarchy. [Essay 6](../b6/06_1-phasic-foundation.html) opened the phasic layer — the cycle of phases whose moves are themselves Markov chains. Both layers are built from the same kind of object: a **plugin**, sitting in its own directory under `.claude/plugins/`, carrying its own organs. This essay opens that object. *[ref: plugin-directory-anatomy | .claude/plugins/CLAUDE.md "Plugin Structure Convention" section + "Active Plugins" section + .claude/plugins/plugin_integrity/ as a worked example | The canonical convention names six directories per plugin (`CLAUDE.md`, `data.json`, `hooks/`, `scripts/`, `tests/`, `docs/`) with the explicit caveat "Not all directories required. Minimal plugin: just CLAUDE.md." Real plugins layer optional organs on top — `plugin_integrity` adds `agents/`, `template/`, `config.conf`, `evolution.md`, and dual `voice.xml` (hooks-side + scripts-side). The kit IS the architectural unit; the convention is a floor, not a ceiling.]*

The cell metaphor is load-bearing. A plugin is not a collection of loose files; it is a *system* of cognitive organs that read each other, write to each other, and depend on each other through declared channels. Each organ inside the cell carries the same read / write / depend-on triple: *[ref: triple-as-the-kit-design-model | .claude/plugins/plugin_integrity/CLAUDE.md "Structure" section | The Structure section of plugin_integrity catalogs one concrete plugin's organs: `hooks/` (event-fired writers — `plugin-guard.sh`, `lock-manager.sh`, `evolution-cap.sh`, `upstream-reporter-hook.sh`), `scripts/` (operator-callable surfaces — `lock-cmd.sh`, `safe-lock.sh`, `drift-check.sh`, `health-check.sh`), `agents/` (per-plugin `historian-*.md` guardians, one for each plugin in the registry), `data.json` (hidden state read by hooks). Each organ slots into one read/write/depend-on role; the triple is the kit's design language.]*

- **Who reads it** — which subsystem (the LLM, Claude Code itself, another plugin, the human operator) consumes the contents at runtime.
- **Who writes it** — which ceremony or phase is allowed to mutate it. Most organs have exactly one writer; the security model rests on that exclusivity.
- **What it depends on** — which other organs must already be in place for this organ to function correctly.

The read / write / depend-on triple is how the cell wall stays porous (organs talk through declared channels) and rigid (organs never reach through undeclared ones). Essay 7 opens the cell organ by organ, naming who reads it / writes it / what it depends on at each step, then closes with a Tier-3 walkthrough of authoring a new plugin from scratch. *[ref: plugin-lock-serializes-edits | .claude/plugins/plugin_integrity/scripts/lock-cmd.sh + .claude/plugins/plugin_integrity/CLAUDE.md "Structure" section + "How to Use" section | PLUGIN-LOCK is the exclusivity primitive — `lock-cmd.sh` admits one writer at a time per plugin by toggling state in `data.json` against the lock-manager hook chain. Declared channels (file paths, hook events, voice.xml block ids) make the read-graph auditable. Undeclared edits are blocked by per-organ guards (plugin-guard, evolution-cap, lock-manager) before they touch disk.]*

## The journey ahead

Essay 7 covers the plugin kit across the sub-essays listed below:

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

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plugin-cell-anatomy-b7-1.png
  NEEDS-REGEN (2026-05-19): prior version had overlap between arrows/labels and the cell-wall outline making text hard to read. Updated layout guidance below enforces clear spacing + center-of-shape label positioning. Old PNG deleted; awaiting regen.
  Concept: Chalk-on-blackboard cross-section — a single plugin "cell" with its internal cognitive organs visible inside the cell wall, the PLUGIN-LOCK ceremony drawn as a membrane gate on the wall, and the three property labels (reads / writes / depends on) listed beside the cell as the universal anatomy frame.
  Style: Chalk-on-blackboard. Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the organ shapes (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, the cell-wall outline, and the membrane-gate icon; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, organ names, or property descriptors. Treat the angle-bracket placeholder as literal text.
  READABILITY REQUIREMENTS (CRITICAL — prior version failed here):
    - Every label MUST appear AT THE CENTER of its shape, NOT on the boundary line. Labels never overlap arrows, the cell-wall outline, or other labels.
    - Each interior shape must have at least ONE shape-width of empty space between it and any adjacent shape. If 7 shapes would crowd, make the cell oval larger.
    - The cell wall (oval outline) is a single clean chalk stroke; no organ shape touches or crosses it.
    - The PLUGIN-LOCK gate icon sits ON the oval boundary at the top, drawn with a clear gap between its label "[PLUGIN-LOCK]" and any interior shape label. The gate label sits ABOVE the gate icon, outside the oval.
    - The vertical list to the right of the cell has at least three shape-widths of empty space between the rightmost interior shape and the list's left edge.
  Layout: One large hand-drawn chalk oval takes up the center-left of the board — the "cell wall". Above the oval, a white-chalk header reads exactly ".claude/plugins/<plugin_name>/" (header positioned with clear vertical gap from the oval). Inside the oval, seven small chalk shapes arranged with even spacing (see READABILITY REQUIREMENTS above for spacing rules), each labeled IN WHITE CHALK AT ITS CENTER with its exact name:
    Shape 1 (cyan fill, top-left position inside oval): "CLAUDE.md"
    Shape 2 (green fill, top-center): "hooks/"
    Shape 3 (orange fill, top-right): "scripts/"
    Shape 4 (pink fill, middle-left): "data.json"
    Shape 5 (magenta fill, middle-right): "docs/"
    Shape 6 (cyan fill darker, bottom-left): "agents/"
    Shape 7 (green fill darker, bottom-right): "tests/"
  On the cell wall itself (drawn as part of the oval outline at the top), draw a small white-chalk gate icon labeled IN WHITE CHALK exactly "[PLUGIN-LOCK]" (label above the icon, outside the oval, with clear gap).
  To the right of the cell (with at least three shape-widths of horizontal gap), draw a vertical white-chalk list with header "every organ has:" and three lines IN WHITE CHALK stacked below it (vertical line spacing equal to one label-height):
    Line 1: "who reads it"
    Line 2: "who writes it"
    Line 3: "what it depends on"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: ".claude/plugins/<plugin_name>/", "CLAUDE.md", "hooks/", "scripts/", "data.json", "docs/", "agents/", "tests/", "[PLUGIN-LOCK]", "every organ has:", "who reads it", "who writes it", "what it depends on", plus the caption below. No other words, file names, folders, or property descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.1. A plugin is a cell. Cognitive organs live inside the wall; the PLUGIN-LOCK membrane gates every edit; three properties name each organ."
-->

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plugin-kit-b7-banner.png
  Concept: Chalk-on-blackboard SERIES BANNER — multiple plugin "cells" arranged as a cellular composition, evoking the plugin kit as a community of cells working together. This is the og:image source for the B7 series (Essays 7.2-7.9 use this as their social card; opener 7.1 uses its own anatomy image above). Lives on disk at blog/b7/images/plugin-kit-b7-banner.png.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk fills for the cells (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels and the title; faint chalk dust at the edges; a couple of chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other plugin names, file names, or descriptors. Cells are intentionally UNLABELED (the kit's compositional nature, not specific plugins).
  READABILITY REQUIREMENTS: the title and subtitle sit in a clear horizontal band ABOVE the cluster of cells (top third of the board) with a clear vertical gap between the title text and the topmost cell. Caption sits at the bottom edge with clear gap from the lowest cell.
  Layout: A horizontal cluster of five to seven hand-drawn chalk ovals (the "cells") in the middle band of the board, each a different size and tilted slightly. Inside each oval, two or three small interior chalk dots suggest organs (no labels on the dots). The cells are positioned with some overlap and some gaps — not in a grid — to evoke organic composition. Above the cluster, a centered white-chalk title reads exactly: "The Plugin Kit". Just below the title (still above the cells, with clear gap), a single white-chalk subtitle reads exactly: "always-on layer · phasic layer · self-protecting".
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "The Plugin Kit", "always-on layer · phasic layer · self-protecting", plus the caption below. No other words, file names, plugin names, or descriptors may appear (cells are unlabeled).
  Caption (bottom of image, white chalk, hand-drawn): "Banner 7. The plugin kit — cells composing the brain. Each owns one concern. Each protects itself."
-->

---

We start with the universal skeleton — CLAUDE.md, hooks, and scripts — the load-bearing organs Essay 7.2 deep-dives. *[ref: universal-skeleton-trio | .claude/plugins/CLAUDE.md "Plugin Structure Convention" section | The canonical convention names six directories — `CLAUDE.md`, `data.json`, `hooks/`, `scripts/`, `tests/`, `docs/` — with the explicit caveat "Not all directories required. Minimal plugin: just CLAUDE.md. Tests needed for revert protection." Essay 7.2 takes the load-bearing organs (CLAUDE.md as working memory, hooks/ as event-driven reflexes, scripts/ as operator-callable surface) first because those organs are what give a plugin its read/write/dispatch shape; data.json, tests/, docs/ ride on top.]*

A consulting practice could organize its own seed agent's plugin around a `[CLIENT-INTAKE]` ceremony built from the same cell skeleton; the organ list (hooks, scripts, hidden state) transfers wholesale. Nothing in the kit is mathematically enforced; the protections are friction (PLUGIN-LOCK gating each edit, test-pass-or-revert undoing failed runs, dual voices coaching the operator and the LLM separately) plus operator discipline. *[ref: protections-are-friction-not-math | .claude/plugins/plugin_integrity/scripts/safe-lock.sh + .claude/plugins/plugin_integrity/hooks/voice.xml + .claude/plugins/plugin_integrity/scripts/voice.xml | Three friction primitives compose the kit's safety: PLUGIN-LOCK serializes edits per plugin via the lock-manager; safe-lock wraps the unlock window in a test-pass-or-revert cycle (`safe-lock.sh` runs the plugin's tests on commit and reverts the working tree on failure); dual voice.xml (hooks-side for LLM coaching, scripts-side for operator coaching) propagates the discipline through every gate without hard-coding it.]*

---

*Essay 7.1 — The Plugin Kit, Part 1 of 9.*

*Previous: [Essay 6.10 — The Plan-State Machine — Long-Horizon Memory](../b6/06_10-plan-state-machine.html) — closes the markov phasic brain series.*
*Next: [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the universal organs governed by PLUGIN-LOCK.*
