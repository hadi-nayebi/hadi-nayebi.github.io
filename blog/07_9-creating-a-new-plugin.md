---
title: "Building a New Plugin"
date: "May 2026"
slug: "creating-a-new-plugin"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Customization, Tier-3]
status: draft
version: v0.1.0
audience: "Tier 3"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# Building a New Plugin

*Essay 7.9 — The Plugin Kit, Part 9 of 9.*

---

[Essay 7.8](07_8-lock-ceremony.html) closed the four-part lock ceremony — PLUGIN-LOCK, TEST-LOCK, safe-lock, historian ratchet — the gates every plugin edit passes through. The ceremony was named in the abstract. This sub-essay puts it on the rails: a walkthrough of what guiding your seed to *build a brand-new plugin* actually looks like in motion. This is the section new users come back to.

---

## Two Paths to a New Plugin

When you install the public seed agent on your laptop and start running it, every job you point it at is a single-cycle OPEVC job at first ([Essay 8](08_1-apprentice-to-architect-foundation.html) covers the maturation stages). The seed is in *learning mode* — it asks questions, takes its time, builds experiential data from your work. When a job recurs and the seed has learned its shape, the job graduates to multi-cycle. When the multi-cycle plan stabilizes, the job graduates to a `.yaml` plan that injects job-specific context at every phase entry. And eventually — for jobs whose phase cognition needs customization beyond context injection — the job *itself* becomes a plugin. *[ref: maturation-arc-job-forms-taxonomy | CLAUDE.md "Job Forms (OBSERVE cycle 1 classifies)" section | Root CLAUDE.md names three job forms: (1) Single-cycle deep — `plan_file = false`, freestyle collaborative; (2) Multi-cycle with .md plan — `plan_file = <name>.md`, plan accumulates across cycles; (3) Multi-cycle with .yaml plan — `plan_state ∈ {yaml_drafting, yaml_ready}`, .yaml injects at every phase entry. Forms 1→2 graduate when a job recurs and accumulates structure; forms 2→3 graduate via `[PLAN-APPROVAL]` user-confirmation in VERIFY. Storage on the job object via `plan.sh set-plan-file` / `approve-md` / `approve-yaml` / `seal-plan`. The taxonomy + lifecycle live in root CLAUDE.md so OBSERVE cycle 1 can read it for classification.]*

That is one path to a new plugin: a job that has matured through the earlier maturation stages and now needs phase-cognition customization the voice injection cannot deliver.

The other path is direct: you notice a gap in the seed's substrate and tell the seed to fix it — paying off the promise [Essay 5.1](b5/05_1-the-two-layer-foundation.html) planted, that the always-on layer is addable: another always-on plugin slots in by exposing its own public commands, not by rewiring anyone else's.

A consulting practice's seed might gain a `client-engagement-tracker` plugin this way; a research lab's seed might gain an `experiment-protocol` plugin; a writer's seed might gain a `manuscript-stage-gate`. Each plugin's organ list is the same kit; each plugin's substance is the operator's domain.

---

## The First Cycle — Single-Cycle DEEP

The seed treats new-plugin work as a single-cycle DEEP job at first: OBSERVE asks you questions about the gap, PLAN designs the new plugin's concern and organ list, EXECUTE stamps the template and fills in the substance, VERIFY runs the new plugin's test suite, CONDENSE absorbs the lessons into the knowledge layer. *[ref: single-cycle-deep-cycle-1-default | CLAUDE.md "Job Forms (OBSERVE cycle 1 classifies)" decision rules + .claude/plugins/job_core/scripts/plan.sh:335-376 | New plugin-creation jobs default to single-cycle DEEP per root CLAUDE.md decision rules: "Generic conversational request, no expected repeat → form 1" and "Single bug fix, single feature add, single doc update → form 1 (no plan_file needed; one OPEVC pass closes it)." Single-cycle DEEP has `plan_file = false` literal — no .md/.yaml plan exists. Backward edges and loops happen INSIDE one OPEVC cycle. Configured via `plan.sh set-plan-file <job-id> false` in PLAN of cycle 1 (plan.sh:335-376 `set-plan-file` handler). New-plugin work fits this shape because operator + seed are still co-discovering design preferences.]*

The seed performs the PLUGIN-LOCK ceremony at the moment EXECUTE needs to begin writing code; once approved, the lock-manager stamps the universal template at `.claude/plugins/<new_name>/`, substitutes the plugin name into the placeholders, generates the plugin's `historian-<name>` subagent definition, and auto-commits the birth as the drift baseline. *[ref: birth-stamps-template-historian-and-baseline | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:297,313-316,319,325 | L297: "Plugin birth: create from template, replace placeholders, generate historian, auto-commit." L313: `_historian_template="$PLUGIN_TEMPLATE_DIR/_historian.md"`. L314: `_historian_dest="$PLUGIN_DIR/agents/historian-${_target_dashed}.md"`. L316 substitutes placeholders and writes the new historian: `sed "s/{{PLUGIN_NAME}}/$target/g; s/{{PLUGIN_DASHED}}/$_target_dashed/g" "$_historian_template" > "$_historian_dest.tmp" && mv "$_historian_dest.tmp" "$_historian_dest"`. L319 + L325 commit the birth ("Auto-commit birth state to establish baseline" + `git commit -m "birth: $target plugin initialized from template"`) — the commit IS the drift counter's baseline.]*

**The substance the seed fills in** follows the organ-by-organ shape covered earlier in this mini-series — CLAUDE.md first as the concern declaration ([Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html)), then hooks as the plugin's reflexes, scripts if the plugin publishes a CLI, tests covering each hook and script, voice files for the messages the plugin emits ([Essay 7.3](07_3-dual-voice-architecture.html)), and `docs/evolution.md` for the cycle-1 narration ([Essay 7.5](07_5-docs-and-historian.html)). The seed asks you to confirm at each step because in this stage of maturation, the seed is still learning your design preferences.

---

## Phase Plugins Need a Second Lock

If the new plugin extends the phase system (e.g., a new `phase_research` between OBSERVE and PLAN — exactly the customization [Essay 6.1](06_1-phasic-foundation.html) named when it said the phase count is the prototype, not the architecture), one lock builds the cell, and a *second* lock on `phasic_system` updates the orchestrator's forward and backward edge maps so the new phase routes correctly. Adding a cognitive organ takes two ceremonies: one to author the organ, one to wire it into the body. New users should not be surprised by this — most plugin systems make wiring invisible; this architecture makes wiring explicit. *[ref: phasic-orchestrator-edge-maps-update-needed | .claude/plugins/phasic_system/scripts/phase.sh | `phasic_system/scripts/phase.sh` holds OPEVC's phase set + transition map; `phase advance` chooses the next phase based on current phase + map. Adding a new phase plugin (e.g., `phase_research` between OBSERVE and PLAN) requires `phasic_system` to acknowledge the new phase in its transition map so routing reaches it. The second `[PLUGIN-LOCK] phasic_system` ceremony is operator discipline — the orchestrator does not auto-discover new phase plugins; the transition map is the wiring contract. Most plugin systems make wiring invisible; this architecture makes wiring explicit.]*

---

## The Knowledge Directory — By Birth, Not as Afterthought

This is the part most plugin tutorials skip. When the seed authors a new plugin, the seed *also* authors the plugin's knowledge directory at `.claude/knowledge/<plugin_name>/`. This is where the plugin's deep self-knowledge lives — the architectural rationale, the operating patterns, the lessons captured across cycles. The public seed agent ships every active plugin's knowledge directory along with the plugin code, so every operator's seed has the same depth of recall. Future OBSERVE phases will recall these knowledge files when the agent encounters work touching this plugin.

**Tell your seed: every new plugin gets a knowledge directory by birth, not as an afterthought.** Without it, the plugin migrates to the public repo as code without context; with it, the public seed agent can teach new operators how to think about that plugin's concern. *[ref: every-active-plugin-has-knowledge-dir | .claude/knowledge/*/INDEX.md | `find .claude/knowledge -maxdepth 2 -name INDEX.md` returns one INDEX.md per active plugin: brain_guard, interaction_summary, job_core, phase_condense, phase_execute, phase_observe, phase_plan, phase_verify, phasic_system, plugin_integrity, question_discipline — every active plugin in the prototype has its own knowledge dir. Plus topic dirs (opevc, migration, plans, session, etc.) for cross-plugin patterns. The convention holds: knowledge/<plugin_name>/ accompanies the plugin code rather than living separately.]*

<!-- IMAGE PLACEHOLDER:
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

Once the lock closes, the plugin exists as files on disk — but no hook fires yet. The brain has to register the hooks via `settings.local.json` (covered in [Essay 7.7](07_7-smaller-organs-and-wiring.html)). Inside the same EXECUTE phase the seed updates the settings file. Once the brain rereads on the next session start, the new plugin's reflexes fire. CONDENSE then absorbs the cycle's lessons, the historian writes the cycle-1 evolution.md, and the plugin enters its life. *[ref: settings-local-json-no-auto-registration | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:313-341 + .claude/plugins/plugin_integrity/scripts/health-check.sh:90-96 | Plugin birth at `lock-manager.sh:313-341` stamps the template (L313 "Plugin birth: create from template, replace placeholders, generate historian, auto-commit"), generates the historian (L329-332), and auto-commits the baseline (L335-341 `git commit -m "birth: $target plugin initialized from template"`) — but does NOT modify `.claude/settings.local.json`. Hook registration remains an operator step performed inside the same EXECUTE phase. `plugin_integrity/scripts/health-check.sh:90-96` validates that registered hooks have files (Check 1: "Hook files exist (registered hooks in settings.local.json)"). The architectural rule: birth = file creation; activation = settings.local.json edit.]*

---

## The Honest Framing

This is not a couple of editing sessions. A real new phase plugin is closer to a multi-cycle deep job: several editing sessions for the guard logic, more for the tracker and sensor, substantial voice content across the plugin's hooks and scripts, a meaningful test-assertion footprint across the plugin's test files, plus the orchestrator update for the two-lock pattern. The kit's gift is that the work is *bounded*, not that the work is small. Every file has a purpose, every purpose is named, and the safe-lock cycle keeps every step honest.

What makes the work feel different from a from-scratch build is that the operator and seed are not inventing the structure. The cell template knows what cognitive organs every plugin needs. The operator's seed is filling each organ with the substance for *this* plugin's concern. New users guide that filling-in through conversation; the seed records the conversation, learns the operator's preferences, and over time, the operator's seed becomes one that knows *how the operator wants plugins shaped*.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

Three essays in, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? Next.

---

*Essay 7.9 — The Plugin Kit, Part 9 of 9. Closes The Plugin Kit (9-part series).*

*Previous: [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet, the four-part closed loop.*
*Next: [Essay 8 — From Apprentice to Architect](08_1-apprentice-to-architect-foundation.html) — job formats, the maturation arc, and the seed's hand-off.*
