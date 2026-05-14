---
title: "The CLAUDE.md Hierarchy"
date: "May 2026"
slug: "claude-md-hierarchy"
read_time: "12 min"
tags: [Architecture, Seed Agent, CLAUDE.md, Working Memory]
status: draft
version: v0.1.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# The CLAUDE.md Hierarchy

*Essay 5.7 of 9 — The Always-On Digital Cortex.*

---

[Essay 5.6](05_6-question-discipline.html) closed the tour of the five always-on plugins. This part covers one of the substrate forms underneath them — the **working-memory form**: a hierarchy of plain Markdown files (`CLAUDE.md` files) at known locations on disk, plus the protocol that turns those files into a structured information bus. The substrate as a whole holds many forms — `knowledge/`, each plugin's hidden state, `voice.xml`, `evolution.md`, `agents/`. The CLAUDE.md hierarchy is the one the phasic layer writes through.

The plugins do their work in parallel; this is where the cycle's experiential data *lands*.

---

## The native primitive

Drop a file named `CLAUDE.md` into a project, and the standard Claude Code CLI agent reads it. Drop one into `.claude/`, and it gets read too. Nest more of them inside subdirectories, and Claude Code surfaces each one when the agent works near it. The shared move: a plain Markdown file at a known location, automatically appended to the model's context whenever the agent reads or edits files in that directory. *[ref: drop-a-file-named-claude | .claude/plugins/brain_guard/hooks/CLAUDE.md:1-3 | Proof of nested loading: 4-level-deep `hooks/` CLAUDE.md begins "# hooks/ — Status: Live — Feature #1 hooks shipped..." The prototype contains 113 CLAUDE.md files inside `.claude/` alone, automatically surfaced when the agent works near each one.]*

Other agentic CLI agents run the same pattern in their own ecosystems — Codex and opencode read `AGENTS.md`, Gemini CLI reads `GEMINI.md`. The convention is most obviously useful for code, where each `CLAUDE.md` doubles as meta-information about how to manage future edits — and most agentic CLI agents were originally built for software work. *[ref: other-agentic-cli-agents-run | GEMINI.md:1 | Workspace root contains `GEMINI.md` titled "Gemini CLI Project Mandates" — direct proof Gemini CLI reads this convention. Codex/opencode's `AGENTS.md` pattern is externally documented; root CLAUDE.md:443 references "Collaboration Rules (from AGENTS.md)" confirming the cross-agent convention is in this project's awareness.]*

But as [the first essay](01-llms-are-not-the-agents.html) argued, the CLI form factor extends far beyond writing code — to any work whose product lives in files: research, legal analysis, business operations, consulting work, and beyond. *[ref: but-as-the-first-essay | blog/01-llms-are-not-the-agents.md:58 | Blog 1's exact phrasing: "Current tools — Claude Code, OpenCode, Gemini CLI — are marketed toward technical users... But what these tools actually do is manipulate files and respond to file content. That capability extends far beyond writing code." The specific enumeration (research, legal, business, consulting) is Blog 5's elaboration.]*

The native loading is layered. The [Claude Code memory documentation](https://docs.claude.com/en/docs/claude-code/memory) recognizes two locations for project-level instructions — `./CLAUDE.md` and `./.claude/CLAUDE.md` — and both load at session start. The seed agent uses both: a high-level `CLAUDE.md` at the workspace root for identity and operating rules, and a brain index inside `.claude/` cataloging plugins and active jobs. Run `/memory` inside Claude Code and you will see them both listed alongside any user-level CLAUDE.md files. After a `/compact`, Claude re-reads the project-root file from disk and re-injects it. Every other `CLAUDE.md` further down the tree loads on demand: per the docs, *"they are included when Claude reads files in those subdirectories."* *[ref: the-native-loading-is-layered | CLAUDE.md:4-9 | Root CLAUDE.md Identity section: "Agent: Hadosh Academy Website Manager. Role: Build and maintain the Hadosh Academy website. Brain: `.claude/`. Project: `hadi-nayebi.github.io/`." Root holds identity/operating rules; `.claude/CLAUDE.md` Components section catalogues plugins as the brain index.]*

Every Claude Code user gets this primitive for free. What the seed agent does on top is *partition* each `CLAUDE.md` into compartments. *[ref: seed-agent-partitions-claude-md | CLAUDE.md:530,537,544,551 | Root CLAUDE.md itself partitioned with the four footer anchors: `---Ob---` (line 530), `---Pl---` (537), `---Ex---` (544), `---Ve---` (551). Every CLAUDE.md inside the seed-agent brain carries the same four anchors — the partition the seed agent adds on top of Claude Code's native loading.]*

## The four-footer protocol

The body of the file — everything above the four anchors below — keeps the standard Claude Code semantics: identity, rules, structure, the things the agent should remember about this directory at all times. Below the body, every `CLAUDE.md` inside the seed agent's brain carries four anchored sections: *[ref: body-keeps-standard-claude-code-semantics | .claude/plugins/brain_guard/CLAUDE.md:41,45,49,53 | brain_guard/CLAUDE.md as universal example: body lines 1-40 (Objective, Status, Architecture Map, Registration), then the four anchors at lines 41 (`---Ob---`), 45 (`---Pl---`), 49 (`---Ex---`), 53 (`---Ve---`). Same body+footer split across every brain CLAUDE.md.]*

```
---Ob---

(observation content goes here)

---Pl---

(plan content goes here)

---Ex---

(execution content goes here)

---Ve---

(verification content goes here)
```

Each footer section corresponds to one phase of the OPEVC cycle. The guard hooks inside each phase plugin enforce a single rule: a phase cannot edit *above* its own anchor. During OBSERVE, the agent can write into `---Ob---` and into any of the three sections below it. During PLAN, into `---Pl---` and below. During EXECUTE, into `---Ex---` and `---Ve---`. During VERIFY, only into `---Ve---`. The body — everything above the first anchor — is off-limits to all four phases. Only the CONDENSE phase is allowed to absorb content upward into the body, and only when closing the cycle. *[ref: each-footer-section-corresponds-phase | .claude/plugins/phase_observe/hooks/observe-guard.sh:309 | OBSERVE guard: `section_result=$(check_section_edit "---Ob---" "$FILE_PATH" "$OLD_STR" "$NEW_STR")`. Sister calls in plan-guard.sh:269 (`---Pl---`), execute-guard.sh:879 (`---Ex---`), verify-guard.sh:324 (`---Ve---`). Each blocks edits above its own anchor; body protected; CONDENSE absorbs upward.]*

The asymmetry is intentional. Earlier phases can leave forward-looking notes for later phases — OBSERVE can sketch an early plan or seed a verify checklist if it spots one; PLAN can pre-stage verification criteria for the work it is about to dispatch — but no phase can rewrite what an earlier phase has already committed. Information flows *downward* through the cycle. The full per-phase semantics — what each phase is encouraged to write where, how subagents feed OBSERVE from the knowledge directory, and how all four phases can drop prefixed markers for CONDENSE to consume — is the subject of [Essay 6](06-the-markov-phasic-brain.html). For now, the load-bearing fact is that the footer is a structured, append-forward, multi-author region. *[ref: asymmetry-is-intentional-forward-write | .claude/plugins/lib/section_guard/section-check.sh:276-291 | "STRICTLY BELOW" gate (line 276 comment); lines 282-291 block edits whose anchor sits at or above the phase marker: "Edit anchor '${first_sub}' found at line ${first_match_line} (at or above ${phase_marker}). Edit must target content below ${phase_marker}."]*

## Inflate and deflate

The footers are why the seed agent does not need to rely on the chat to hold its working memory. As a job moves through OBSERVE → PLAN → EXECUTE → VERIFY, each phase writes its experiential output — what was gathered, what was decided, what was built, what was checked — into its own footer slot in whichever `CLAUDE.md` is closest to where the work is happening. The footers *inflate* across the cycle. By the time the job reaches the end of VERIFY, the four sections together can hold thousands of words of fresh, cycle-specific memory. *[ref: footers-replace-chat-working-memory | .claude/plugins/phase_condense/docs/principles.md:87-95 | Principle 9 — Five Markers as Cross-Phase Signal System: "Observe, plan, execute, verify phases record findings via five standardized markers in their respective phase-section footers (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`)." Each phase appends; CONDENSE consumes + deflates only at cycle close.]*

CONDENSE deflates them. CONDENSE is the cognitive organ that closes each OPEVC cycle — its waterfall pulls durable findings from the four footer sections up into the body of the same `CLAUDE.md` (so they survive the next cycle), routes topic-specific knowledge into `.claude/knowledge/`, and migrates anything that belongs higher up the tree into a parent `CLAUDE.md` or into the root brain. When CONDENSE finishes, the footers are empty again. The next cycle of OPEVC starts with a clean working memory and a slightly enriched body. The hierarchy as a whole grows smarter with each pass. *[ref: condense-deflates-footers-organ | .claude/plugins/phase_condense/scripts/condense-commit.sh:110-160 | Stage-aware deflation gate: 80% (Stage 1, no plan_file) or ~50% (Stage 2, plan_file set) of bottom-section words must be absorbed/migrated before commit succeeds. Blocks `condense-commit.sh` advance to idle if `current_total > max_remaining`. Footer emptiness is enforced, not coincidental.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sequence — five panels of a CLAUDE.md file across the OPEVC cycle, footers inflating then CONDENSE deflating them.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk panels;
  pastel chalk for each phase header (cyan = OBSERVE, green = PLAN, orange = EXECUTE, pink = VERIFY, magenta = CONDENSE);
  white chalk for ALL file outlines, footer markers, arrows, captions, and labels; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent any other phase names, file names, or directory names.
  Layout: Five small chalk panels arranged left to right, in this exact order. Above each panel, a phase header in pastel chalk reads exactly:
    Panel 1 header: "OBSERVE" (cyan)
    Panel 2 header: "PLAN" (green)
    Panel 3 header: "EXECUTE" (orange)
    Panel 4 header: "VERIFY" (pink)
    Panel 5 header: "CONDENSE" (magenta)
  Inside each panel, draw the SAME CLAUDE.md file as a chalk rectangle, divided top-to-bottom into:
    Top zone (labeled in white chalk exactly "body") — dense chalk scribbles.
    Below the body, four footer slots labeled in white chalk with these literal markers in this top-to-bottom order:
      ---Ob---
      ---Pl---
      ---Ex---
      ---Ve---
  Panel-specific fill:
    Panel 1 (OBSERVE): only the ---Ob--- slot fills with chalk scribbles; other three slots empty.
    Panel 2 (PLAN): ---Ob--- and ---Pl--- both filled; ---Ex--- and ---Ve--- empty.
    Panel 3 (EXECUTE): ---Ob---, ---Pl---, ---Ex--- filled; ---Ve--- empty.
    Panel 4 (VERIFY): all four footers (---Ob---, ---Pl---, ---Ex---, ---Ve---) filled; the file visibly heavier.
    Panel 5 (CONDENSE): a chalk upward arrow inside the file lifts findings from the four footers into the body (the body grows slightly); all four footer slots are wiped clean; off to the right side of panel 5, a small chalk side-branch peels off labeled in white chalk exactly ".claude/knowledge/".
  A curving white-chalk arrow connects panel 5 back to panel 1, labeled in white chalk exactly "next cycle".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE", "body", "---Ob---", "---Pl---", "---Ex---", "---Ve---", ".claude/knowledge/", "next cycle", plus the caption below. No other phase names, file names, or directory names may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Footers inflate across OPEVC, then CONDENSE deflates them — durable findings ratchet upward into the body, the rest discards."
-->

## The altered list — CLAUDE.md edits scope execution

There is a second consequence of CLAUDE.md edits during a cycle, and it is what gives the bus teeth. EXECUTE — the only phase that may touch project files outside `.claude/` — is fenced to the *altered list*: the set of directories whose `CLAUDE.md` the agent edited during OBSERVE or PLAN. EXECUTE inherits the list and may only modify files inside those directories. If a directory's `CLAUDE.md` was never touched during the read-only phases, EXECUTE cannot make project changes there in this cycle, however clearly the work seems to call for them. *[ref: second-consequence-altered-list | .claude/plugins/phase_execute/hooks/execute-guard.sh:826-840 | Comment line 822: "Observe + plan altered_claude_md lists are merged into execute's data.json at sensor init." Subsequent block enforces: `if ! echo "$altered_list" | grep -qxF "$claude_rel"; then block ...`. Verify-guard.sh:315-316 separately blocks any project-file edit in VERIFY.]*

The bus is not only where the agent stores experiential notes — it is where the agent *declares* the work it intends to do. Editing a `CLAUDE.md` during OBSERVE or PLAN is a commitment that scopes what EXECUTE will be allowed to attempt. The deeper mechanics — how the altered list is checked, what file types EXECUTE may write inside an altered-list directory, how multi-commit checkpoints land — are the subject of [Essay 6](06-the-markov-phasic-brain.html). For the bus story, the structural fact is enough: `CLAUDE.md` edits gate execution. *[ref: claude-md-edits-gate-execution | .claude/plugins/phase_plan/hooks/plan-tracker.sh:126-138 | When a `CLAUDE.md` is edited during PLAN, `add-altered` records its path into the job's altered_claude_md list (comment line 126: "builds altered list"). Mirror in observe-tracker.sh:152-155 fires the same hook during OBSERVE. The list freezes scope for EXECUTE.]*

## The hierarchy itself

The seed agent's bus is not one `CLAUDE.md`. It is a hierarchy.

```
hadosh_academy/
├── CLAUDE.md                              ← root brain
├── .claude/
│   ├── CLAUDE.md                          ← brain index
│   ├── plugins/
│   │   ├── plugin_integrity/CLAUDE.md     ← plugin brain
│   │   ├── brain_guard/CLAUDE.md          ← plugin brain
│   │   └── ...                            ← one per plugin
│   └── knowledge/
│       ├── plugin_integrity/              ← durable, per-topic
│       ├── brain_guard/
│       └── ...
└── hadi-nayebi.github.io/
    └── CLAUDE.md                          ← project working memory
```

Your hierarchy will mirror your work, not this website. Same shape — root brain, plugin brains, knowledge silos, per-directory working memory — different folders, different layouts. The architecture is portable; the specific folder tree is one seed's answer to one user's work.

Each layer plays a different role on the bus.

The **root CLAUDE.md** declares the agent's identity and operating rules — what phases exist, what the size limits are, how the brain is allowed to grow. It is the top of the bus, and one of the two project-level CLAUDE.md files Claude Code loads at session start. *[ref: root-CLAUDE-md-declares-identity | CLAUDE.md:289-298 | Growth Rules section (8 numbered rules): new operations need definition + transition maps, recurring patterns codify, >50-word ops extract to skills, CONDENSE grows brain, size limits drive reorganization, soft→hard migration, brain never stops growing.]*

The **brain index** at `.claude/CLAUDE.md` is the other one. It catalogs the plugins, points to the knowledge directory, and records the brain-maturation lessons accumulated across cycles. *[ref: brain-index-catalogs-plugins | .claude/CLAUDE.md:8-47 | "Components" section enumerates every plugin (lines 17-32, with version + tests + status) and the knowledge layer (lines 10-15). "Brain Maturation" (lines 37-41) + "Voice Architecture (C2 lessons)" (lines 43-47) hold cross-cycle disciplines.]*

The **plugin CLAUDE.md files** declare what each plugin owns. They are how a plugin tells the rest of the system "I am responsible for X, here is how I work, here are my tests, here is my current version." When a plugin is being edited, that plugin's CLAUDE.md is the agent's working memory for the edit, and its footer is where the cycle's experiential data accumulates until CONDENSE absorbs it. *[ref: plugin-CLAUDE-md-files-declare | .claude/plugins/CLAUDE.md:103-119 | Plugin Structure Convention: each plugin's `CLAUDE.md` is "Working memory — objective, state, maintenance rules" (line 107). Layout includes hooks/, scripts/, tests/, docs/ each with their own nested CLAUDE.md. Minimal plugin = just CLAUDE.md.]*

The **working-directory CLAUDE.md files** are local. The website project has one. So does the blog folder. So does — when work is happening there — any directory deep in the tree where the focus currently sits. These are the files whose footers most often inflate during the OPEVC cycle and deflate during CONDENSE. *[ref: working-directory-CLAUDE-md-files-local | CLAUDE.md:329-334 | CLAUDE.md Lifecycle states — Active (updated in every phase), Proactive (created before work in a directory), Retroactive (updated after work), Condensed (distilled at cycle close, knowledge migrated to .claude/knowledge/). Per-directory working memory.]*

The **knowledge directory** is the durable layer. When something has been learned that is worth keeping past the current cycle, CONDENSE routes it into `.claude/knowledge/<topic>/` as a real Markdown file with its own structure. The current prototype carries one topic silo per major plugin (`brain_guard/`, `phase_observe/`, `phase_condense/`, and so on) plus a cross-cutting `opevc/` directory that holds dozens of operational recipes mined from cycles across the system. Each topic dir tends to grow an `INDEX.md` plus a handful of focused topic files, refined cycle after cycle. OBSERVE phases recall from the directory; CONDENSE phases extend it; subagents are dispatched against it for parallel research. Knowledge files are how the agent remembers things across sessions, across cycles, across months. *[ref: knowledge-directory-is-durable-layer | .claude/plugins/phase_condense/docs/principles.md:65-73 | Principle 6 "Subagents as Extractors": `condense-knowledge-extractor → .claude/knowledge/` (line 69). Rejection protocol routes content no subagent accepts to `knowledge/session/`. Knowledge directory is the durable destination CONDENSE routes into.]*

**Memory files** sit a layer beyond that — cross-session preferences and feedback that should outlive any individual project. This layer is managed by Claude Code itself, not by the seed agent: the CLI maintains them in the user's home directory under `~/.claude/projects/<encoded-path>/memory/`, with a small `MEMORY.md` index loaded on every session start. Each entry is a typed file (`feedback_*.md`, `user_*.md`, `project_*.md`, `reference_*.md`) the agent can grep by category when a session starts cold. The current seed-agent prototype does not extend this layer — it inherits Claude Code's native memory behavior unmodified. A future plugin could hook into it deliberately, using the entries as a source of context injections at session start, but no such plugin exists yet. *[ref: memory-files-cross-session-Claude-Code | ~/.claude/projects/<encoded>/memory/MEMORY.md:3-11 | Live MEMORY.md index for this workspace: 8 typed `feedback_*.md` entries + 1 `project_*.md` (`user_*.md`/`reference_*.md` slots empty). Claude Code maintains this layer; no seed-agent plugin reads or writes here (verified across `.claude/plugins/`).]*

## The plugin–substrate asymmetry

Every always-on plugin keeps its own state in hidden files inside its plugin directory — files the seed agent itself cannot read or edit directly. Every state mutation goes through a plugin-owned script. Some of that script's commands are public, callable as part of the agent's workflow (`job.sh focused` is a typical example); others are flagged as internal-only and restricted to other scripts and hooks within the seed, so the agent cannot reach them at all. None of these plugins treat `CLAUDE.md` as their primary state surface. The relationship to the hierarchy varies plugin by plugin — `plugin_integrity` polices the four phase markers from removal but otherwise leaves `CLAUDE.md` content free to edit, while the others are mostly orthogonal, owning concerns (context budget, job lifecycle, interaction summarization, question discipline) that live in their own data files. *[ref: every-plugin-hidden-state-files | .claude/plugins/CLAUDE.md:121-137 | Plugin State Model: "data.json is hidden internal state. The agent cannot read or edit it directly. All access through the plugin's own scripts." Two modes — Public + `--hook`. plugin_integrity blocks direct reads/edits and the `--hook` flag from the agent.]*

The **phasic plugins** generate the bus's content. The choreography of how each phase writes its footer and how CONDENSE absorbs them is the subject of [Essay 6](06-the-markov-phasic-brain.html). *[ref: phasic-plugins-generate-bus-content | .claude/plugins/phase_condense/scripts/condense-commit.sh:139-144 | CONDENSE deflation gate greps `^---(Ob|Pl|Ex|Ve)---$` first anchor in every altered CLAUDE.md, counts words AFTER (all four footers combined), computes `words_absorbed = total_baseline - current_total`. All four phasic plugins write through these markers.]*

The relationship is asymmetric. The phasic layer is the system that actively uses the hierarchy — its phases write into footers during the cycle, and CONDENSE absorbs the durable parts upward into bodies, sideways into knowledge files, and into voice files, subagent definitions, and the brain's own operations, at cycle close. The always-on layer mostly does not — each of its plugins runs its own concern through its own state, with at most narrow points of contact (`plugin_integrity` guards the phase markers; the rest are orthogonal). In the current prototype, well over a hundred `CLAUDE.md` files across the brain and the project carry the four phase footers. The footer convention is the protocol — and the phasic layer is what writes through it. *[ref: relationship-is-asymmetric-phasic-uses | CLAUDE.md:129-134 | CONDENSE.consume-markers (steps 3-6) routes footer markers to multiple destinations: `[PENDING-JOB]` → job creation, `[VOICE-UPDATE]` → voice.xml, `[AGENT-UPDATE]` → subagent defs, `[KNOWLEDGE]` → knowledge files. Filesystem: 113 of 119 CLAUDE.md files carry all four phase footers.]*

This is the bus.

---

The working-memory form is built — body + four footers + altered-list gate + the layered hierarchy. The next part deconstructs one of the architecture's most elegant proofs that this substrate works in concert: three plugins compose into a ceremony that no plugin could enforce alone.

---

*Essay 5.7 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.6 — Structured Questions (`question_discipline`)](05_6-question-discipline.html) — the registered-prefix gate.*
*Next: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
