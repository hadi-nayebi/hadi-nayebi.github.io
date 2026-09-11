---
title: "Smaller Organs and Brain-Root Wiring"
date: "May 17, 2026"
slug: "smaller-organs-and-wiring"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Wiring]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# Smaller Organs and Brain-Root Wiring

*Essay 7.7 — The Plugin Kit, Part 7 of 9.*

---

[Essay 7.6](07_6-agents-and-80-20-budget.html) opened the per-plugin subagent pool and the 80/20 budget that mechanizes how much direct action the main session is allowed before it must delegate again. This sub-essay closes out the cell's inventory — the smaller, conditional cognitive organs that round out the kit — and then steps *outside* the cell wall to name the one file at the brain root that makes any of it fire.

The concrete inventory and wiring below come from one historical Claude-based reference architecture. The portable pattern is a component whose supporting organs stay inside its boundary while an explicit runtime surface decides which of its reflexes are active.

---

## The Smaller Organs

A few smaller organs round out the kit. They carry less load but are still load-bearing for specific plugins.

**`config.conf`** — the operator's tuning surface. Environment-style `KEY=value` lines for thresholds the plugin exposes for adjustment. `SOFT_THRESHOLD_TIER=20`, `MAX_EVOLUTION_WORDS=2000`, `DRIFT_THRESHOLD=10`. Read by scripts and hooks at fire time. Written by the operator (sometimes through gmode, sometimes directly). Most plugins carry one; `question_discipline` does not because it has no tunable thresholds. *[ref: config-conf-ten-plugins-one-skipped | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**`tests/`** — the plugin's self-test suite. Read by the safe-lock cycle at the lock boundary; written through the `[TEST-LOCK]` ceremony, a finer-grained gate distinct from `[PLUGIN-LOCK]`. Every plugin ships tests; a plugin without them cannot survive the safe-lock cycle's commit-or-revert discipline. *[ref: test-lock-finer-grained-gate | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**`template/`** — the plugin's birthing surface. Only the creator plugins carry one — `plugin_integrity` and the phase plugins (currently five in the prototype) — because those are the plugins that *create* new instances of something. These creator plugins share a category: each one stamps new instances of its own kind. Read by `lock-manager.sh` at plugin-birth time when stamping a new plugin from the template. *[ref: template-dir-six-creator-plugins | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**`e2e/`** — Only `phasic_system`, the orchestrator plugin, carries this; no other plugin currently needs `e2e/`. End-to-end tests that exercise the full OPEVC cycle across multiple phases. Because no other plugin sees the cycle in its entirety, no other plugin needs `e2e/`. *[ref: e2e-dir-phasic-system-only | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**`LICENSE` + `README.md`** — open-source migration-preparation signals. Carrying both makes a plugin's terms and public explanation explicit; it does not, by itself, prove that the code is ready to migrate. In the historical prototype, some plugins carried both while others were still being prepared. *[ref: license-readme-migration-ready-subset | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/smaller-organs-b7-7.png
  Concept: Chalk-on-blackboard sketch teaching TWO clearly-separated ideas, split top and bottom by a horizontal divider line. BOTTOM: a plugin "cell" and its SMALLER ORGANS (the supporting files that belong to it). TOP: the BRAIN-ROOT WIRING file that lives outside the plugin and REGISTERS its hooks. The visual separation is the whole point — the organs are part of the plugin; the wiring file is not.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the organ tiles and the brain-root wiring box (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, the cell-wall outline, the divider line, and the event names; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, event names, or descriptors.
  Layout: A horizontal white-chalk DIVIDER line splits the board into a top band and a larger bottom region. Just above the line, write its label IN WHITE CHALK exactly "brain root (outside the plugin)".
  BOTTOM region — a small white-chalk header at its top-left reads exactly "the plugin and its smaller organs". In its center, one hand-drawn chalk oval (the cell wall) with a single small white-chalk label inside reading exactly "plugin". Five small pastel chalk tiles hug the outside of the oval, each with a short white-chalk arrow pointing INTO the cell wall (they belong to the plugin), labeled IN WHITE CHALK exactly:
    Tile 1 (cyan, upper-left of oval): "config.conf"
    Tile 2 (green, upper-right of oval): "tests/"
    Tile 3 (orange, left of oval): "template/"
    Tile 4 (pink, below oval): "e2e/"
    Tile 5 (magenta, right of oval): "LICENSE + README.md"
  TOP band (above the divider) — a single larger chalk box (darker cyan fill) labeled IN WHITE CHALK exactly ".claude/settings.local.json", with a small white-chalk note beside it reading exactly "registers the plugin". From this box, three white-chalk arrows reach DOWN, crossing the divider line toward the plugin oval, each labeled IN WHITE CHALK with one hook-event name:
    Arrow 1: "UserPromptSubmit"
    Arrow 2: "PreToolUse"
    Arrow 3: "Stop"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "brain root (outside the plugin)", "the plugin and its smaller organs", "plugin", "config.conf", "tests/", "template/", "e2e/", "LICENSE + README.md", ".claude/settings.local.json", "registers the plugin", "UserPromptSubmit", "PreToolUse", "Stop". No other words, file names, folders, or event names may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.7. A plugin's smaller organs complete it from within; the wiring that connects it to the brain lives outside, at the root, and registers its reflexes — the hook events it fires on."
-->

Target asset: assets/images/blog/b7/smaller-organs-and-wiring-b7-7.png

---

## `.claude/settings.local.json` — The Historical Brain-Root Wiring

**What it is.** In this historical reference architecture, a single project-local JSON file (`.claude/settings.local.json`) pairs Claude Code event names with hook script paths across every plugin. The wiring file is NOT inside any plugin — it lives outside. Current Claude Code also supports hooks packaged inside installed plugins, so this central file is the reference architecture's chosen wiring mechanism, not a universal restriction of the framework. *[ref: settings-local-json-brain-root-wiring | https://code.claude.com/docs/en/hooks ; private historical prototype | Claude Code's public hooks reference documents hooks from local settings and from installed plugins. The historical implementation used the local settings surface as its central registry; private implementation evidence is omitted.]*

**Who reads it.** Claude Code reads the project-local settings. In this architecture, those settings decide which registered hooks fire on which events for the whole brain.

**Who writes it.** The operator, when installing or removing a plugin. The seed agent partially participates: when a `[PLUGIN-LOCK] <new_plugin>` question fires the birth ceremony in `lock-manager.sh`, the ceremony stamps the template, generates the historian, and auto-commits the baseline — but does NOT modify `settings.local.json`. Registering the new plugin's hook entries remains an operator step, consistent with the architectural rule below. *[ref: plugin-birth-ceremony-stamps-not-registers | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**What it depends on.** Each plugin's `hooks/*.sh` paths. If a plugin's hook script exists at the right path but `settings.local.json` does not list it, the hook is dead code. *[ref: settings-local-json-listing-controls-activation | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The architectural rule in this design.** The brain registers plugins; plugins do not self-register. This is what makes the cell wall meaningful: the brain decides what's active, the plugins fill in what they own. New-plugin lens: when you guide this seed to add a new plugin, the *last* step before the plugin is alive is updating `settings.local.json` to register the new hooks. The plugin can be perfectly authored — every organ in place, every test green — and still inactive if the brain has not wired it in. Other harnesses can package or discover hooks differently while preserving the same separation between a component's contents and the runtime decision to activate it. *[ref: no-plugin-self-registration-mechanism | private historical prototype | The no-self-registration rule was verified for the historical reference architecture. Identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

A consulting practice's seed could install a `client-deliverables` plugin whose `config.conf` exposes a `MIN_QA_PASSES=3` knob; whose `template/` stamps a new client-deliverable each engagement; whose `e2e/` exercises the full review cycle. The kit's organ list is the same; the substance is the operator's domain.

The smaller organs fill in the kit's specialized surfaces — operator tuning, test coverage, plugin birthing, end-to-end orchestration, migration-readiness. The brain-root wiring file is what makes any of it fire: the brain registers; the plugins don't self-register. Cell wall and central nervous system, named together. The next sub-essay opens the *ceremony* that protects hard-substrate plugin edits — `[PLUGIN-LOCK]`, `[TEST-LOCK]`, the safe-lock cycle that commits-or-reverts code changes, and the historian ratchet.

---

*Essay 7.7 — The Plugin Kit, Part 7 of 9.*

*Previous: [Essay 7.6 — `agents/` and the 80/20 Dispatch Budget](07_6-agents-and-80-20-budget.html) — per-plugin subagent pools + the budget the main session must earn.*
*Next: [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet.*
