---
title: "The Two-Layer Foundation"
date: "May 2026"
slug: "the-two-layer-foundation"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Information Bus]
status: draft
version: v0.2.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# The Two-Layer Foundation

*Essay 5.1 of 9 — The Always-On Digital Cortex. Hadosh Academy series on agent architecture. Essay 5 opens here; Essays 5.1 through 5.8 follow.*

---

Now we open `.claude/`.

In [Essay 2](02-we-could-have-had-agi.html), we argued the LLM is the token generator and the agent is everything we build around it — the system that metabolizes those generated tokens into durable forms of memory so the seed agent can form a coherent, stable identity across sessions. Inside `.claude/` is where that metabolism happens. Two compartments are canonical: `knowledge/` holds long-term memory the agent reaches for during active recall, and `plugins/` holds procedural memory — the hooks, scripts, and tests that enact discipline rather than describe it.

Other compartments carry their own forms. Auto-recall coaching lives in each plugin's `voice.xml`. Narrative memory lives in each plugin's `evolution.md`. Cross-session preferences live in `memory/`. And many more we will meet across this series. *[ref: each-subdirectory-preserves-a-form | .claude/CLAUDE.md:8-12 + .claude/plugins/CLAUDE.md:103-117 + .claude/plugins/plugin_integrity/scripts/evolution-cap.sh | Brain index (.claude/CLAUDE.md:8-12) names the canonical compartments: `knowledge/` (topical long-term), `plugins/` (procedural). Plugin Structure Convention (plugins/CLAUDE.md:103-117) shows every plugin ships its own `CLAUDE.md`, `data.json`, `hooks/`, `scripts/`, `tests/`, `docs/`, `voice.xml`. The `evolution.md` narrative-memory form lives under each plugin's `docs/` and carries a separate word-cap via `evolution-cap.sh`. The `memory/` user-side cross-session compartment is project-external. Multi-form claim has direct on-disk substantiation.]*

The deeper move is representing different forms of cognition as different forms of memory, so the seed agent always carries the optimum context for what it is currently doing. As you customize your own seed agent, you will invent compartments that fit your work, your roles, your professional context.

The chat session is the one place memory does **not** live by design. Chat context is capped by the model's window and survives compaction only as a lossy summary. The rest of `.claude/` is what makes the agent durable.

In this prototype, long before the model runs out of room, the seed agent forces a *self-compaction* — the conversation is summarized, most discarded, the rest rebuilt from a smaller context. The plugin that runs this — `brain_guard` — gets its own deep-dive later in this series. But the files inside `.claude/` sit on disk untouched; they are still there when the new context starts. *[ref: long-before-the-model-runs | .claude/plugins/brain_guard/CLAUDE.md:5 | Plugin's own Objective section: "Protect the agent's context window and critical infrastructure. Currently enforces a context-aware self-compact loop." Dedicated brain_guard definition — the plugin runs the self-compaction described in this paragraph, well before Opus 4.7's 1M context limit.]*

The pattern generalizes. [The interlude](03_1-the-folder-is-alive.html) put it directly: any folder with a `.claude/` becomes a seed agent — brain inside, work in siblings. The brain holds many forms of memory through many plugins, and this essay tours the ones this prototype ships, with hints toward the ones you will invent.

Start with the most visible. The seed agent's *working memory* — what it is currently doing or experiencing — lives in a hierarchy of plain Markdown files (`CLAUDE.md` files) at known locations on disk. Two plugin layers run on top of this hierarchy. The phasic layer writes each cycle's experiential data into it; the always-on layer runs alongside, mostly orthogonal to it.

Plugins are the procedural form: directories under `.claude/plugins/` that each bundle the hooks, scripts, and tests for one concern. [Essay 4](04-the-language-of-agents.html) introduced the vocabulary — *hook*, *plugin*, *voice*, *agent* — that this essay turns into a concrete file layout you can navigate. The plugins split into two categories. The always-on plugins are active all the time, shaping how the seed agent operates no matter what it is currently doing. The phasic plugins manage what we will call the *markov brain* — they actively control the seed agent's behavior while it is operating inside a particular phase. We open the markov brain in [Essay 6](06-the-markov-phasic-brain.html).

---

## Two Categories, One Substrate

The **always-on layer** is active all the time and runs on every prompt, every tool call, every session start, regardless of which job the seed agent is currently working on. This layer owns infrastructure: locking plugins for updates, context budgets, job structure, conversation discipline. The current prototype ships five always-on plugins (`plugin_integrity`, `brain_guard`, `job_core`, `interaction_summary`, `question_discipline`). The category is the load-bearing thing — not the count. A custom seed could add a sixth or a seventh and the architecture wouldn't shift. *[ref: the-always-on-layer-is-active | .claude/settings.local.json:11,23,43,53,123,153 | Hook registry — each always-on plugin's registration line: job_core/prompt-handler on UserPromptSubmit (11); plugin_integrity/plugin-guard (23), job_core/job-guard (43), interaction_summary/summary-guard (53), brain_guard/context-sensor (123) all on PreToolUse; question_discipline/question-discipline-gate on AskUserQuestion (153).]*

That's one layer. The other rotates.

The **phasic layer** activates one plugin at a time, dictated by which phase the active job is in. It currently implements a cognitive cycle called OPEVC — observe, plan, execute, verify, condense (five phases in the prototype) — plus an orchestrator (`phasic_system`) that tracks where each job sits in that cycle. The cycle can be extended as users customize their seed agent and grow its markov brain. Each phase makes a different set of tools available to the seed agent: OBSERVE and PLAN are read-only against project files, EXECUTE writes inside a fenced scope, VERIFY runs scripts only, and CONDENSE writes inside `.claude/` only, absorbing the recent experiential data from previous phases. *[ref: phases-make-different-tools-available | .claude/plugins/phase_observe/hooks/observe-guard.sh:151 + .claude/plugins/phase_plan/hooks/plan-guard.sh:134 + .claude/plugins/phase_verify/hooks/verify-guard.sh:117,144 + .claude/plugins/phase_condense/hooks/condense-guard.sh:303-341 | Each phase-guard hardcodes its own tool restrictions. OBSERVE + PLAN: "Bash limited to read-only git + wc + sleep. Everything else falls through to standard restrictions" (observe-guard:151, plan-guard:134). VERIFY: "only test/script runs consume budget, read-only bash does not" (verify-guard:117). CONDENSE: read-only bash whitelist (condense-guard:303-341) plus dedicated `.claude/`-only write scope. EXECUTE has its own altered-list scope mechanism. The read-only / fenced-scope / scripts-only / `.claude/`-only split is enforced in code, not convention.]* We open the phasic layer in [Essay 6](06-the-markov-phasic-brain.html).

Two layers. One multi-form substrate underneath.

The substrate is `.claude/` itself — the multi-form memory directory the opener introduced. Each form serves a different concern, and each is used by different machinery. The difference between the two plugin layers is not which substrate forms they touch — that varies plugin by plugin — but their relationship to phase. The always-on layer runs continuously, each plugin owning one concern and its own private state. The phasic layer activates one plugin at a time, dictated by the active job's current phase, and uses the CLAUDE.md hierarchy specifically as its working medium — writing into footers during each cycle, then absorbing the durable parts upward into bodies, sideways into knowledge files, and into voice files, subagent definitions, and other forms of memory at the end. *[ref: underneath-both-layers-sits | CLAUDE.md:111-112 | CONDENSE 7-step waterfall: (1) footer→body absorption, (2) cross-file CLAUDE.md migration, (3) `[PENDING-JOB]` → dep jobs, (4) `[VOICE-UPDATE]` → voice.xml, (5) `[AGENT-UPDATE]` → subagent defs, (6) `[KNOWLEDGE]` → knowledge files, (7) session archive fallback. Markers carried in phase footers `---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/always-on-plugins-b5-1.png
  Concept: Chalk-on-blackboard cross-section — two plugin layers above the shared CLAUDE.md + .claude/ substrate.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for cell fills (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL headers, labels, arrows, file/folder names, and captions; faint chalk dust at the edges;
  a couple of chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, or paths.
  Layout: Three horizontal chalk bands stacked vertically.
    Top band — white-chalk header above the band reads exactly "always-on plugins". Below the header, five small pastel chalk cells side by side, each labeled IN WHITE CHALK with the literal text:
      Cell 1 (cyan fill): "plugin_integrity"
      Cell 2 (green fill): "brain_guard"
      Cell 3 (orange fill): "job_core"
      Cell 4 (pink fill): "interaction_summary"
      Cell 5 (magenta fill): "question_discipline"
    Middle band — white-chalk header above the band reads exactly "phasic plugins (OPEVC orchestrator + 5 phase plugins)". Below the header, six small chalk cells side by side, each labeled IN WHITE CHALK with the literal text:
      Cell 1 (small, dim outline): "phasic_system"
      Cell 2 (cyan, dim): "OBSERVE"
      Cell 3 (green, dim): "PLAN"
      Cell 4 (orange, BRIGHT and haloed — currently active): "EXECUTE"
      Cell 5 (pink, dim): "VERIFY"
      Cell 6 (magenta, dim): "CONDENSE"
    Bottom band — wider chalk slab, white-chalk header reads exactly "the .claude/ substrate (multi-form)". Inside the slab, sketch a small chalk file-tree showing ONLY these literal paths (no other folders or files):
      CLAUDE.md
      .claude/
      ├── CLAUDE.md
      ├── plugins/
      ├── knowledge/
      └── agents/
  Two bidirectional white-chalk arrows connect the middle band to the bottom band, labeled IN WHITE CHALK exactly "writes into" (down-arrow) and "absorbs from" (up-arrow).
  No arrows from the top band to the bottom band.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "always-on plugins", "phasic plugins (OPEVC orchestrator + 5 phase plugins)", "plugin_integrity", "brain_guard", "job_core", "interaction_summary", "question_discipline", "phasic_system", "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE", "the .claude/ substrate (multi-form)", "CLAUDE.md", ".claude/", "plugins/", "knowledge/", "agents/", "writes into", "absorbs from", plus the caption below. No other words, file names, or folders may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.1. Two plugin layers, one multi-form substrate — the phasic layer writes through the CLAUDE.md hierarchy and absorbs at cycle close; the always-on layer runs alongside, phase-independent."
-->

---

## Why "Single Concern" Matters

Each always-on plugin owns exactly one concern.

`plugin_integrity` owns plugin edit safety. `brain_guard` owns self-compaction. `job_core` owns the job lifecycle. `interaction_summary` keeps a focused job's mega-prompt legible as it grows. `question_discipline` owns the asking gate. Each plugin lives in its own folder under `.claude/plugins/<name>/` with its own hooks, scripts, hidden state, tests, and voice files. Naming the concern is easy because each plugin only has one to name. *[ref: plugin-integrity-owns-edit-safety | .claude/plugins/CLAUDE.md:12-24,45,103-117 | Active Plugins table (lines 12-24) maps each named plugin to its objective; Plugin Structure Convention tree (lines 103-117) shows folder layout (CLAUDE.md, data.json, hooks/, scripts/, tests/, docs/); voice.xml documented at line 45 as "sibling concept to config.conf" and present in every plugin on disk.]*

The single-concern principle is a *minimize* rule, not an *eliminate* rule. Pure isolation is what a traditional library aims for — clean modules with no shared state, talking to nothing they don't import. The seed agent is a complex cognitive system, and a small amount of structured coupling between plugins is what lets the parts compose into ceremonies larger than any one plugin. Call this **single-concern + careful coupling**: each part stays narrow; the composition is what makes the ceremony possible. *[ref: single-concern-principle-minimize-rule | .claude/plugins/phase_execute/hooks/execute-guard.sh:85,240 | Structured coupling demonstrated: phase_execute imports `PHASE_SH="$PLUGIN_DIR/../phasic_system/scripts/phase.sh"` (line 85), then calls `bash "$PHASE_SH" current` at line 240. Each plugin owns one concern but composes via the other plugin's published command.]*

The historian ratchet inside `plugin_integrity` is a clean example — it blocks plugin editing when the plugin's evolution narrative has fallen behind, and to do that it depends on `question_discipline` registering the `[PLUGIN-LOCK]` prefix, on `job_core` capturing the user's approval answer, and on the safe-lock cycle protecting the plugin during the edit. Three plugins compose into one ceremony, each contributing what it owns. We deconstruct this composition in [Part 8 of this essay](05_8-historian-ratchet.html).

The discipline is in *how* the coupling happens. When plugins talk to each other, they talk through public, stable interfaces — small command-line surfaces each plugin publishes (one read-only command per concern, `job.sh focused` being the canonical example), a registry of question prefixes, named voice handles, and the footer marker protocol that organizes the bus. A plugin reads what another plugin chooses to publish; it never reaches into another plugin's private state. Each plugin's internal data stays private; only the interface is shared. *[ref: the-discipline-is-in-how | .claude/plugins/job_core/scripts/job.sh:391-396 | `job.sh focused` handler — inline comment reads "Returns just the focused job ID (or empty). Clean API for extension plugins." Read-only: reads `data.json`, never writes. Canonical public-interface example called by other plugins (e.g., execute-guard.sh).]*

The shape buys three concrete things. Plugins evolve independently — a change inside `interaction_summary` cannot break `job_core` as long as the read-only `job.sh` API stays the same. Plugins are testable in isolation — each `tests/` directory exercises one plugin's behavior without standing up the entire seed. Plugins are addable — a sixth always-on plugin slots into the architecture by exposing its own public commands, not by rewiring anyone else's. *[ref: the-shape-buys-three-concrete | .claude/plugins/job_core/tests/test-job-sh.sh:20-35 | Test isolation in practice: setup creates a temp directory + mocks dependent scripts (e.g., `plan.sh`) so `job.sh` runs without the full seed. Pattern is repeated in every plugin's `tests/` directory — interaction_summary tests mock job_core's `job.sh` the same way.]*

---

## The journey ahead

The foundation is in place: two layers above one substrate, each plugin owning one narrow concern, public interfaces wiring the ceremony. Essay 5 splits into nine short sub-essays — five plugin tours plus three deep-dives (substrate, composed ceremony, customization guardrail) plus this foundation:

- **Essay 5.1 — The Two-Layer Foundation** *(you are here)* — two plugin categories above one substrate
- [Essay 5.2 — Plugin Edit Safety](05_2-plugin-integrity.html) — `plugin_integrity` and the test gate
- [Essay 5.3 — Context Window Discipline](05_3-brain-guard.html) — `brain_guard` and the progressive squeeze
- [Essay 5.4 — Job Lifecycle](05_4-job-core.html) — `job_core` and the unit of compartmentalization
- [Essay 5.5 — Cross-Session Memory](05_5-interaction-summary.html) — `interaction_summary` and the dynamic mega-prompt
- [Essay 5.6 — Structured Questions](05_6-question-discipline.html) — `question_discipline` and the prefix registry
- [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — working memory, four-footer protocol, altered list
- [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins
- [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted

Each sub-essay covers what its plugin (or mechanism) owns, how it works, what would break without it, and what you would customize when you cultivate your own seed.

[Essay 8 — From Apprentice to Architect](08-from-apprentice-to-architect.html) closes the series by showing the four-stage maturation arc — how each form of work this prototype hosts grows from a single-cycle conversation into a customized plugin in your own seed. The promises this essay plants — extendable always-on layer, extendable cognitive cycle, more memory forms you will invent — are paid off there.

We start with `plugin_integrity`.

---

*Essay 5.1 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 4 — The Language of Agents](04-the-language-of-agents.html) — vocabulary that prepares the architecture.*
*Next: [Essay 5.2 — Plugin Edit Safety (`plugin_integrity`)](05_2-plugin-integrity.html) — first of five always-on plugin deep-dives.*
