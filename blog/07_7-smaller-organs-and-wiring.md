---
title: "Smaller Organs and Brain-Root Wiring"
date: "May 2026"
slug: "smaller-organs-and-wiring"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Wiring]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/agent-anatomy.png"
---

# Smaller Organs and Brain-Root Wiring

*Essay 7.7 — The Plugin Kit, Part 7 of 9.*

---

[Essay 7.6](07_6-agents-and-80-20-budget.html) opened the per-plugin subagent pool and the 80/20 budget that mechanizes how much direct action the main session is allowed before it must delegate again. This sub-essay closes out the cell's inventory — the smaller, conditional cognitive organs that round out the kit — and then steps *outside* the cell wall to name the one file at the brain root that makes any of it fire.

---

## The Smaller Organs

A few smaller organs round out the kit. They carry less load but are still load-bearing for specific plugins.

**`config.conf`** — the operator's tuning surface. Environment-style `KEY=value` lines for thresholds the plugin exposes for adjustment. `SOFT_THRESHOLD_TIER=20`, `MAX_EVOLUTION_WORDS=2000`, `DRIFT_THRESHOLD=10`. Read by scripts and hooks at fire time. Written by the operator (sometimes through gmode, sometimes directly). Most plugins carry one; `question_discipline` does not because it has no tunable thresholds. *[ref: config-conf-ten-plugins-one-skipped | .claude/plugins/*/config.conf | `find .claude/plugins -maxdepth 2 -name config.conf` returns 10 hits: brain_guard, interaction_summary, job_core, phase_condense, phase_execute, phase_observe, phase_plan, phase_verify, phasic_system, plugin_integrity. question_discipline is absent — confirming the claim that pure-gate plugins with no tunable thresholds skip config.conf. The cap-source pattern: evolution-cap.sh sources its own plugin's config.conf to read `MAX_EVOLUTION_WORDS`; the absence of config.conf = absence of operator-tunable surface.]*

**`tests/`** — the plugin's self-test suite. Read by the safe-lock cycle at the lock boundary; written through the `[TEST-LOCK]` ceremony, a finer-grained gate distinct from `[PLUGIN-LOCK]`. Every plugin ships tests; a plugin without them cannot survive the safe-lock cycle's commit-or-revert discipline. *[ref: test-lock-finer-grained-gate | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:6,374-392 | L6 documents the contract: "[TEST-LOCK] <filename.sh> → unlock test files in the currently unlocked plugin." L374-375: "### [TEST-LOCK] handler" + `if echo "$QUESTION" | grep -q '^\[TEST-LOCK\]'; then`. L391-392 enforce a 100-word floor on the [TEST-LOCK] body (configurable via TEST_LOCK_WORD_MIN). The reason: "test files are the safety net — unlocking one without prior thought risks coverage loss or fixture corruption." Two-tier lock: PLUGIN-LOCK opens the plugin, TEST-LOCK opens specific test files within it.]*

**`template/`** — the plugin's birthing surface. Only the creator plugins carry one — `plugin_integrity` and the phase plugins (currently five in the prototype) — because those are the plugins that *create* new instances of something. These creator plugins share a category: each one stamps new instances of its own kind. Read by `lock-manager.sh` at plugin-birth time when stamping a new plugin from the template. *[ref: template-dir-six-creator-plugins | .claude/plugins/*/template | `find .claude/plugins -maxdepth 2 -name template -type d` returns exactly 6 dirs: plugin_integrity + the five phase plugins (phase_condense, phase_execute, phase_observe, phase_plan, phase_verify). Each contains the skeleton stamped at birth: a new plugin instance for plugin_integrity, a new phase instance for the phase plugins. Plugins that do not create new instances of something (job_core, brain_guard, etc.) skip template/.]*

**`e2e/`** — Only `phasic_system`, the orchestrator plugin, carries this; no other plugin currently needs `e2e/`. End-to-end tests that exercise the full OPEVC cycle across multiple phases. Because no other plugin sees the cycle in its entirety, no other plugin needs `e2e/`. *[ref: e2e-dir-phasic-system-only | .claude/plugins/phasic_system/e2e/ | `find .claude/plugins -maxdepth 2 -name e2e -type d` returns exactly ONE result: phasic_system/e2e. No other plugin carries one because no other plugin owns the full OPEVC cycle — each phase plugin sees only its phase; only phasic_system orchestrates phase→phase transitions across the whole loop.]*

**`LICENSE` + `README.md`** — open-source migration-readiness signals. Plugins carrying both are ready for the public seed agent; plugins not yet carrying them are still maturing in the prototype. *[ref: license-readme-migration-ready-subset | .claude/plugins/*/LICENSE + .claude/plugins/*/README.md | `find .claude/plugins -maxdepth 2 -name LICENSE` returns 4 hits (brain_guard, interaction_summary, plugin_integrity, question_discipline) — and the corresponding README.md find returns the SAME 4 plugins. The phase plugins + phasic_system + job_core do NOT yet carry LICENSE or README.md because they are still maturing in the prototype; the 4 that do are migration-ready candidates for the public seed agent.]*

---

## `.claude/settings.local.json` — The Brain-Root Wiring

**What it is.** A single JSON file at the brain root (`.claude/settings.local.json`) that pairs Claude Code event names with hook script paths across every plugin. The wiring file is NOT inside any plugin — it lives outside. *[ref: settings-local-json-brain-root-wiring | .claude/settings.local.json:1-30 | The file's top-level structure: `{"permissions": {...}, "hooks": {"UserPromptSubmit": [...], "PreToolUse": [...], ...}}`. Each event entry lists `{matcher, hooks: [{type: "command", command: "bash .claude/plugins/<plugin>/hooks/<script>.sh", timeout}]}` blocks. Example from L5-15: UserPromptSubmit → `bash .claude/plugins/job_core/hooks/prompt-handler.sh`. The matcher field filters which tool calls trigger the hook (e.g., `"Edit|Write|MultiEdit|Read|Bash"` for plugin-guard.sh). One file wires every plugin's hooks; nothing self-registers.]*

**Who reads it.** Claude Code, at session start. Claude Code uses this file to decide which hooks fire on which events for the whole brain.

**Who writes it.** The operator, when installing or removing a plugin. The seed agent itself, when a `[PLUGIN-LOCK] <new_plugin>` question fires the birth ceremony in `lock-manager.sh` (which stamps the template + adds the new plugin's hook registrations to `settings.local.json`). *[ref: plugin-birth-ceremony-in-lock-manager | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:297,319,325 | L297 comment names the operation: "Plugin birth: create from template, replace placeholders, generate historian, auto-commit." L319: "Auto-commit birth state to establish baseline (prevents drift-check sentinel 999 on first unlock)." L325 commits with message: `git commit -m "birth: $target plugin initialized from template"`. The birth ceremony runs in the PostToolUse handler for [PLUGIN-LOCK] questions whose target plugin does not yet exist — NOT in CONDENSE step 3 (which handles [PENDING-JOB] markers for job creation, a different concern).]*

**What it depends on.** Each plugin's `hooks/*.sh` paths. If a plugin's hook script exists at the right path but `settings.local.json` does not list it, the hook is dead code.

**The architectural rule.** The brain registers plugins; plugins do not self-register. This is what makes the cell wall meaningful: the brain decides what's active, the plugins fill in what they own. New-plugin lens: when you guide your seed to add a new plugin, the *last* step before the plugin is alive is updating `settings.local.json` to register the new hooks. The plugin can be perfectly authored — every organ in place, every test green — and still inactive if the brain has not wired it in.

---

A consulting practice's seed could install a `client-deliverables` plugin whose `config.conf` exposes a `MIN_QA_PASSES=3` knob; whose `template/` stamps a new client-deliverable each engagement; whose `e2e/` exercises the full review cycle. The kit's organ list is the same; the substance is the operator's domain.

The smaller organs fill in the kit's specialized surfaces — operator tuning, test coverage, plugin birthing, end-to-end orchestration, migration-readiness. The brain-root wiring file is what makes any of it fire: the brain registers; the plugins don't self-register. Cell wall and central nervous system, named together. The next sub-essay opens the *ceremony* that protects every edit to every organ — `[PLUGIN-LOCK]`, `[TEST-LOCK]`, the safe-lock cycle that commits-or-reverts on every change, and the historian ratchet that fires when the plugin's drift counter trips.

---

*Essay 7.7 — The Plugin Kit, Part 7 of 9.*

*Previous: [Essay 7.6 — `agents/` and the 80/20 Dispatch Budget](07_6-agents-and-80-20-budget.html) — per-plugin subagent pools + the budget the main session must earn.*
*Next: [Essay 7.8 — The Lock Ceremony](07_8-lock-ceremony.html) — PLUGIN-LOCK + TEST-LOCK + safe-lock + historian ratchet.*
