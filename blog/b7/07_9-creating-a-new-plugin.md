---
title: "Building a New Plugin"
date: "May 2026"
slug: "creating-a-new-plugin"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Customization, Tier-3]
status: draft
version: v0.1.0
audience: "Tier 3"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# Building a New Plugin

*Essay 7.9 — The Plugin Kit, Part 9 of 9.*

---

[Essay 7.8](07_8-lock-ceremony.html) closed the four-part lock ceremony — PLUGIN-LOCK, TEST-LOCK, safe-lock, historian ratchet — the gates hard-substrate plugin edits pass through. The ceremony was named in the abstract. This essay puts it on the rails: a walkthrough of what guiding your seed to *build a brand-new plugin* actually looks like in motion. This is the section new users come back to.

---

## Two Paths to a New Plugin

When you install the public seed agent on your laptop and start running it, every job you point it at is a single-cycle OPEVC job at first ([Essay 8](../b8/08_1-apprentice-to-architect-foundation.html) covers the maturation stages). The seed is in *learning mode* — it asks questions, takes its time, builds experiential data from your work. When a job recurs and the seed has learned its shape, the job graduates to multi-cycle. When the multi-cycle plan stabilizes, the job graduates to a `.yaml` plan that injects job-specific context at every phase entry. And eventually — for jobs whose phase cognition needs customization beyond context injection — the job *itself* becomes a plugin. *[ref: maturation-arc-job-stages-taxonomy | CLAUDE.md "Job Stages (cycle-1 PLAN decides)" section | Root CLAUDE.md names the Job Stages, each decided in cycle-1 PLAN (not at job creation). `plan_file` is born null — the undecided set-once sentinel — and cycle-1 PLAN commits the Stage with an explicit `set-plan-file` call: Stage 1 — single-cycle collaborative, `set-plan-file <id> false`; Stage 2 — repeatable with a `.md` plan (`set-plan-file <name>.md`), accumulating across cycles; Stage 3 — repeatable with a `.yaml` plan, identical to Stage 2 in completion semantics, only the plan-file format differs; and an aspirational Stage 4, the per-job plugin form. The cycle-1 PLAN→EXECUTE advance is blocked while `plan_file` is null, so even Stage 1 requires its explicit `set-plan-file false` call — nothing auto-defaults. A job graduates Stage 1 → 2 → 3 as it recurs and its plan stabilizes — never automatically. Storage on the job object via `plan.sh set-plan-file`; cycle-1 PLAN reads the taxonomy for classification.]*

That is one path to a new plugin: a job that has matured through the earlier maturation stages and now needs phase-cognition customization the voice injection cannot deliver.

The other path is direct: you notice a gap in the seed's substrate and tell the seed to fix it — paying off the promise [Essay 5.1](../b5/05_1-the-two-layer-foundation.html) planted, that the always-on layer is addable: another always-on plugin slots in by exposing its own public commands, not by rewiring anyone else's. *[ref: plugin-extensibility-no-central-coupling | .claude/plugins/ directory structure + .claude/settings.local.json hook event registration | The directory structure is the extensibility contract: each plugin lives at `.claude/plugins/<name>/` with its own `hooks/`, `scripts/`, `tests/`, `voice.xml`, `data.json` (if stateful), and `docs/evolution.md`. No plugin's code references another plugin's internal scripts; cross-plugin coordination happens through `.claude/settings.local.json` hook registrations (the brain-root wiring file covered in Essay 7.7) where each plugin's hooks are listed under the events they fire on. Adding a new always-on plugin = creating a new `.claude/plugins/<new_name>/` directory + appending its hook entries to `settings.local.json`. No central registry to edit, no inheritance to override, no other plugin to rewire.]*

A consulting practice's seed might gain a `client-engagement-tracker` plugin this way; a research lab's seed might gain an `experiment-protocol` plugin; a writer's seed might gain a `manuscript-stage-gate`. Each plugin's organ list is the same kit; each plugin's substance is the operator's domain.

---

## The First Cycle — Single-Cycle DEEP

The seed treats new-plugin work as a single-cycle DEEP job at first: OBSERVE asks you questions about the gap, PLAN designs the new plugin's concern and organ list, EXECUTE stamps the template and fills in the substance, VERIFY runs the new plugin's test suite, CONDENSE absorbs the lessons into the knowledge layer. *[ref: single-cycle-stage-1-default | CLAUDE.md "Job Stages (cycle-1 PLAN decides)" decision rules + .claude/plugins/phase_plan/scripts/plan.sh `set-plan-file` subcommand | New plugin-creation jobs classify to Stage 1 (single-cycle deep) per root CLAUDE.md decision rules: a generic conversational request with no expected repeat, or a single bug fix / feature add / doc update, classifies Stage 1 — no plan file needed, one OPEVC pass closes it. `plan_file` is born null (the undecided set-once sentinel on the phase_plan extension); the Stage is decided in cycle-1 PLAN, after OBSERVE has gathered context, by an explicit `set-plan-file` call — `set-plan-file <id> false` for Stage 1, `<name>.md` for Stage 2, `<name>.yaml` for Stage 3. The cycle-1 PLAN→EXECUTE advance is BLOCKED while `plan_file` is still null, so even Stage 1 must call `set-plan-file false` — nothing auto-defaults. Once decided, `plan_file == false` IS the Stage-1 signal; backward edges and loops happen INSIDE one OPEVC cycle. New-plugin work fits Stage 1 because operator + seed are still co-discovering design preferences.]*

The seed performs the PLUGIN-LOCK ceremony at the moment EXECUTE needs to begin writing code; once approved, the lock-manager stamps the universal template at `.claude/plugins/<new_name>/`, substitutes the plugin name into the placeholders, generates the plugin's centralized `historian-<name>` subagent definition under `plugin_integrity/agents/`, and auto-commits the birth as the drift baseline. *[ref: birth-stamps-template-historian-and-baseline | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:322,336-341,344-350 | L322: "Plugin birth: create from template, replace placeholders, generate historian, auto-commit." L336-339 generate the historian for the new plugin from `_historian.md` into `plugin_integrity/agents/historian-${_target_dashed}.md`. L341 substitutes placeholders and writes the new historian. L344-350 commit the birth ("Auto-commit birth state to establish baseline" + `git commit -m "birth: $target plugin initialized from template"`) — the commit IS the drift counter's baseline.]*

**The substance the seed fills in** follows the organ-by-organ shape covered earlier in this series — CLAUDE.md first as the concern declaration ([Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html)), then hooks as the plugin's reflexes, scripts if the plugin publishes a CLI, tests covering each hook and script, voice files for the messages the plugin emits ([Essay 7.3](07_3-dual-voice-architecture.html)), and `docs/evolution.md` for the cycle-1 narration ([Essay 7.5](07_5-docs-and-historian.html)). The seed asks you to confirm at each step because in this stage of maturation, the seed is still learning your design preferences. *[ref: template-universal-kit-minimal-stamp | .claude/plugins/plugin_integrity/template/ directory | The universal `template/` ships with the minimal kit stamped at birth: `CLAUDE.md` (the new plugin's concern declaration scaffold), `docs/` (the directory where the historian writes `evolution.md`), and `_historian.md` (the historian-subagent template — the leading underscore marks "agent templates, not shipped to plugin" per lock-manager.sh:327 copy-rule). Hooks, scripts, tests, voice.xml, data.json are NOT stamped — they are filled in by the seed during EXECUTE based on the new plugin's specific concern. Birth = the universal floor; substance = the operator-domain content the seed authors on top.]*

---

## Phase Plugins Need a Second Lock

If the new plugin extends the phase system (e.g., a new `phase_research` between OBSERVE and PLAN — exactly the customization [Essay 6.1](../b6/06_1-phasic-foundation.html) named when it said the phase count is the prototype, not the architecture), one lock builds the cell, and a *second* lock on `phasic_system` updates the orchestrator's forward and backward edge maps so the new phase routes correctly. Adding a cognitive organ takes two ceremonies: one to author the organ, one to wire it into the body. New users should not be surprised by this — most plugin systems make wiring invisible; this architecture makes wiring explicit. *[ref: phasic-orchestrator-edge-maps-update-needed | .claude/plugins/phasic_system/scripts/phase.sh | `phasic_system/scripts/phase.sh` holds OPEVC's phase set + transition map; `phase advance` chooses the next phase based on current phase + map. Adding a new phase plugin (e.g., `phase_research` between OBSERVE and PLAN) requires `phasic_system` to acknowledge the new phase in its transition map so routing reaches it. The second `[PLUGIN-LOCK] phasic_system` ceremony is operator discipline — the orchestrator does not auto-discover new phase plugins; the transition map is the wiring contract. Most plugin systems make wiring invisible; this architecture makes wiring explicit.]*

---

## The Knowledge Directory — By Birth, Not as Afterthought

This is the part most plugin tutorials skip. When the seed authors a new plugin, the seed *also* authors the plugin's knowledge directory at `.claude/knowledge/<plugin_name>/`. This is where the plugin's deep self-knowledge lives — the architectural rationale, the operating patterns, the lessons captured across cycles. The public seed agent ships every active plugin's knowledge directory along with the plugin code, so every operator's seed has the same depth of recall. Future OBSERVE phases will recall these knowledge files when the agent encounters work touching this plugin. *[ref: every-active-plugin-has-knowledge-dir | .claude/knowledge/*/INDEX.md | `find .claude/knowledge -maxdepth 2 -name INDEX.md` returns one INDEX.md per active plugin: brain_guard, interaction_summary, job_core, phase_condense, phase_execute, phase_observe, phase_plan, phase_verify, phasic_system, plugin_integrity, question_discipline — every active plugin in the prototype has its own knowledge dir. Plus topic dirs (opevc, migration, plans, session, etc.) for cross-plugin patterns. The convention holds: knowledge/<plugin_name>/ accompanies the plugin code rather than living separately.]*

**Tell your seed: every new plugin gets a knowledge directory by birth, not as an afterthought.** Without it, the plugin migrates to the public repo as code without context; with it, the public seed agent can teach new operators how to think about that plugin's concern.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plugin-birth-b7-9.png
  Concept: Chalk-on-blackboard linear flow — the plugin birth sequence inside the EXECUTE phase of a single-cycle DEEP job.
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
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "plugin birth — inside EXECUTE", "[PLUGIN-LOCK] new_plugin approved", "stamp template/ → .claude/plugins/new_plugin/", "substitute {{PLUGIN_NAME}}", "generate agents/historian-new-plugin.md", "auto-commit: birth baseline", "operator step: register in settings.local.json", plus the caption below. No other words, file names, folders, or state descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.9. Plugin birth automates 5 steps. Hook registration stays operator-controlled."
-->

---

## Lock Closes — The Plugin Is Born, but Not Yet Alive

Once the lock closes, the plugin exists as files on disk — but no hook fires yet. The brain has to register the hooks via `settings.local.json` (covered in [Essay 7.7](07_7-smaller-organs-and-wiring.html)). That activation remains a separate operator-controlled wiring step, often performed with seed assistance during the same EXECUTE phase. Once the brain rereads on the next session start, the new plugin's reflexes fire. CONDENSE then absorbs the cycle's lessons, the historian writes the cycle-1 evolution.md, and the plugin enters its life. *[ref: settings-local-json-no-auto-registration | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:322-350 + .claude/plugins/plugin_integrity/scripts/health-check.sh:90-96 | Plugin birth at `lock-manager.sh:322-350` stamps the template (L322 "Plugin birth: create from template, replace placeholders, generate historian, auto-commit"), generates the historian under `plugin_integrity/agents/` (L336-341), and auto-commits the baseline (L344-350 `git commit -m "birth: $target plugin initialized from template"`) — but does NOT modify `.claude/settings.local.json`. Hook registration remains an operator-controlled activation step performed after birth. `plugin_integrity/scripts/health-check.sh:90-96` validates that registered hooks have files (Check 1: "Hook files exist (registered hooks in settings.local.json)"). The architectural rule: birth = file creation; activation = settings.local.json edit.]*

---

## The Honest Framing

This is not a couple of editing sessions. A real new phase plugin is closer to a multi-cycle deep job: several editing sessions for the guard logic, more for the tracker and sensor, substantial voice content across the plugin's hooks and scripts, a meaningful test-assertion footprint across the plugin's test files, plus the orchestrator update for the two-lock pattern. The kit's gift is that the work is *bounded*, not that the work is small. Every file has a purpose, every purpose is named, and the safe-lock cycle keeps every step honest. *[ref: phase-plugin-organ-multiplicity | .claude/plugins/phase_plan/{hooks,scripts,tests,template,agents,docs}/ | `ls .claude/plugins/phase_plan/hooks/` returns plan-guard.sh + plan-sensor.sh + plan-tracker.sh + voice.xml — the guard/sensor/tracker triad named in the body, each its own organ. `ls .claude/plugins/phase_plan/scripts/` returns plan.sh + plan-commit.sh + voice.xml — second voice.xml confirms dual-voice architecture (hooks-side + scripts-side). `ls .claude/plugins/phase_plan/tests/` returns 8 test files (test-plan-guard, test-plan-sensor, test-plan-tracker, test-plan-commit, test-plan-markers, test-plan-sentinel, test-plan-sh, test-plan-yaml-cognition) — the meaningful test-assertion footprint. Plus agents/, template/, docs/ — bounded organ kit, not an open-ended file list.]*

What makes the work feel different from a from-scratch build is that the operator and seed are not inventing the structure. The cell template knows what cognitive organs every plugin needs. The operator's seed is filling each organ with the substance for *this* plugin's concern. New users guide that filling-in through conversation; the seed records the conversation, learns the operator's preferences, and over time, the operator's seed becomes one that knows *how the operator wants plugins shaped*.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

By this point in the series, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? Next.

---

*Essay 7.9 — The Plugin Kit, Part 9 of 9. Closes The Plugin Kit (9-part series).*

*Previous: [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet, the four-part closed loop.*
*Next: [Essay 8 — From Apprentice to Architect](../b8/08_1-apprentice-to-architect-foundation.html) — job formats, the maturation arc, and the seed's hand-off.*
