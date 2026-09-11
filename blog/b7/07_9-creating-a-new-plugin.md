---
title: "Building a New Plugin"
date: "May 17, 2026"
slug: "creating-a-new-plugin"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Customization, Tier-3]
status: published
version: v0.2.0
audience: "Tier 3"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# Building a New Plugin

*Essay 7.9 — The Plugin Kit, Part 9 of 9.*

---

[Essay 7.8](07_8-lock-ceremony.html) closed the four-part lock ceremony — PLUGIN-LOCK, TEST-LOCK, safe-lock, historian ratchet — the gates hard-substrate plugin edits pass through. The ceremony was named in the abstract. This essay puts it on the rails: a walkthrough of what guiding your seed to *build a brand-new plugin* actually looks like in motion. This is the section new users come back to.

---

## Two Paths to a New Plugin

When you and your agent assemble a seed in a local space you control, cycle-one PLAN chooses the job's form from its actual horizon ([Essay 8](../b8/08_1-apprentice-to-architect-foundation.html) covers the Stage taxonomy). A bounded request may use single-cycle Stage 1. Repeatable work may begin directly with a prose `.md` plan in Stage 2. Work that needs structured per-cycle context may begin directly with a `.yaml` plan in Stage 3. The choice is discussed with the user and never flips automatically. Learning from any of those forms can later be reused or restructured; when the job needs phase cognition beyond context injection, the job itself can become a plugin without first traversing every earlier Stage. *[ref: maturation-arc-job-stages-taxonomy | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

That is one path to a new plugin: existing work reveals a need for phase-cognition customization that plan context alone cannot deliver, regardless of which Stage first carried the work.

The other path is direct: you notice a gap in the seed's substrate and tell the seed to fix it — paying off the promise [Essay 5.1](../b5/05_1-the-two-layer-foundation.html) planted, that the always-on layer is addable: another always-on plugin slots in by exposing its own public commands, not by rewiring anyone else's. *[ref: plugin-extensibility-no-central-coupling | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A consulting practice's seed might gain a `client-engagement-tracker` plugin this way; a research lab's seed might gain an `experiment-protocol` plugin; a writer's seed might gain a `manuscript-stage-gate`. Each plugin's organ list is the same kit; each plugin's substance is the operator's domain.

---

## The First Cycle — Establish the Job

New-plugin work starts by establishing the job in cycle 1, but its plan-file Stage follows the work's actual horizon. A narrow plugin addition may fit one collaborative OPEVC cycle; a substantial phase plugin will usually need a multi-cycle `.md` or `.yaml` plan. OBSERVE asks you questions about the gap, PLAN designs the new plugin's concern and organ list and chooses the Stage, EXECUTE stamps the template and fills in the substance, VERIFY runs the new plugin's test suite, and CONDENSE absorbs the lessons into the knowledge layer. *[ref: single-cycle-stage-1-default | private historical prototype | The cycle-1 Stage decision and OPEVC phase responsibilities were checked against a private historical prototype. Identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The seed performs the PLUGIN-LOCK ceremony at the moment EXECUTE needs to begin writing code; once approved, the lock-manager stamps the universal template at `.claude/plugins/<new_name>/`, substitutes the plugin name into the placeholders, generates the plugin's centralized `historian-<name>` subagent definition under `plugin_integrity/agents/`, and auto-commits the birth as the drift baseline. *[ref: birth-stamps-template-historian-and-baseline | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The substance the seed fills in** follows the organ-by-organ shape covered earlier in this series — CLAUDE.md first as the concern declaration ([Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html)), then hooks as the plugin's reflexes, scripts if the plugin publishes a CLI, tests covering each hook and script, voice files for the messages the plugin emits ([Essay 7.3](07_3-dual-voice-architecture.html)), and `docs/evolution.md` for the birth-cycle narration ([Essay 7.5](07_5-docs-and-historian.html)). The seed should surface the consequential design choices as it fills these organs because it is still learning your design preferences. *[ref: template-universal-kit-minimal-stamp | private historical prototype | The template floor and the distinction between stamped files and plugin-specific substance were checked against a private historical prototype. Identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## Phase Plugins Need a Second Lock

If the new plugin extends the phase system (e.g., a new `phase_research` between OBSERVE and PLAN — exactly the customization [Essay 6.1](../b6/06_1-phasic-foundation.html) named when it said the phase count is the prototype, not the architecture), one lock builds the cell, and a *second* lock on `phasic_system` updates the orchestrator's forward and backward edge maps so the new phase routes correctly. Adding a cognitive organ takes two ceremonies: one to author the organ, one to wire it into the body. New users should not be surprised by this — most plugin systems make wiring invisible; this architecture makes wiring explicit. *[ref: phasic-orchestrator-edge-maps-update-needed | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## The Knowledge Directory — By Birth, Not as Afterthought

This is the part most plugin tutorials skip. When the seed authors a new plugin, the seed *also* authors the plugin's knowledge directory at `.claude/knowledge/<plugin_name>/`. This is where the plugin's deep self-knowledge lives — the architectural rationale, the operating patterns, the lessons captured across cycles. In the reference implementation, each active plugin's code is paired with its own knowledge directory, giving that user-owned seed durable context for reasoning about its organs. Another seed may keep equivalent context in a different structure; the portable principle is that a reusable component should travel with enough rationale and operational knowledge to be understood and evolved. Future OBSERVE phases in this implementation recall these knowledge files when the agent encounters work touching this plugin. *[ref: every-active-plugin-has-knowledge-dir | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Tell your seed: give every new plugin durable context by birth, not as an afterthought.** Without it, reusable code becomes detached from the rationale and operating knowledge needed to adapt it; with it, another agent can evaluate the component, select what is useful, and reshape it for its user.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plugin-birth-b7-9.png
  Concept: Chalk-on-blackboard linear flow — the plugin birth sequence inside the EXECUTE phase of a job whose Stage matches its actual horizon.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk boxes
  and arrows; pastel chalk for box fills (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels and arrows; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other state names, command names, or descriptors.
  Layout: A small white-chalk title at the top reading exactly: "plugin birth — inside EXECUTE".
  Below the title, five hand-drawn chalk boxes arranged in a horizontal flow across the center of the board, each labeled IN WHITE CHALK with its exact text:
    Box 1 (cyan fill): "[PLUGIN-LOCK] new_plugin approved"
    Box 2 (green fill): "stamp template/ → .claude/plugins/new_plugin/"
    Box 3 (orange fill): "substitute {{PLUGIN_NAME}}"
    Box 4 (pink fill): "generate agents/historian-new-plugin.md"
    Box 5 (magenta fill): "auto-commit: birth baseline"
  Single white-chalk arrows connect Box 1 → Box 2 → Box 3 → Box 4 → Box 5.
  Below the right end of the flow (under Box 5), draw a small chalk note IN WHITE CHALK reading exactly: "operator step: register in settings.local.json".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "plugin birth — inside EXECUTE", "[PLUGIN-LOCK] new_plugin approved", "stamp template/ → .claude/plugins/new_plugin/", "substitute {{PLUGIN_NAME}}", "generate agents/historian-new-plugin.md", "auto-commit: birth baseline", "operator step: register in settings.local.json". No other words, file names, folders, or state descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.9. Plugin birth automates 5 steps. Hook registration stays operator-controlled."
-->

---

## Lock Closes — The Plugin Is Born, but Not Yet Alive

Once the lock closes, the plugin exists as files on disk — but in this historical reference architecture, no hook fires yet. The brain has to register the hooks via `settings.local.json` (covered in [Essay 7.7](07_7-smaller-organs-and-wiring.html)). That activation remains a separate operator-controlled wiring step, often performed with seed assistance during the same EXECUTE phase. Once the runtime loads that registration, the new plugin's reflexes fire. CONDENSE then absorbs the birth cycle's lessons, the historian writes the corresponding `evolution.md` entry, and the plugin enters its life. Other harnesses may package hook registration with the plugin, but they still need an explicit install or enablement step that makes the component active. *[ref: settings-local-json-no-auto-registration | https://code.claude.com/docs/en/hooks ; private historical prototype | Claude Code's public hooks reference distinguishes local-settings hooks from plugin-provided hooks. The historical birth ceremony created files without registering them; private implementation evidence is omitted.]*

---

## The Honest Framing

This is not a couple of editing sessions. A real new phase plugin is closer to a multi-cycle deep job: several editing sessions for the guard logic, more for the tracker and sensor, substantial voice content across the plugin's hooks and scripts, a meaningful test-assertion footprint across the plugin's test files, plus the orchestrator update for the two-lock pattern. The kit's gift is that the work is *bounded*, not that the work is small. Every file has a purpose, every purpose is named, and the safe-lock cycle keeps every step honest. *[ref: phase-plugin-organ-multiplicity | private historical prototype | Claim checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

What makes the work feel different from a from-scratch build is that the operator and seed are not inventing the structure. The cell template supplies the common floor and a kit of optional organs. The operator's seed selects what this plugin needs and fills each chosen organ with the substance for *this* concern. New users guide that filling-in through conversation; the seed records the conversation, learns the operator's preferences, and over time, the operator's seed becomes one that knows *how the operator wants plugins shaped*.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

By this point in the series, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? Next.

---

*Essay 7.9 — The Plugin Kit, Part 9 of 9. Closes The Plugin Kit (9-part series).*

*Previous: [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet, the four-part closed loop.*
*Next: [Essay 8 — From Apprentice to Architect](../b8/08_1-apprentice-to-architect-foundation.html) — Job Stages, the maturation arc, and the seed's hand-off.*
