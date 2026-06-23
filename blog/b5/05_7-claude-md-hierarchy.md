---
title: "The CLAUDE.md Hierarchy"
date: "May 2026"
slug: "claude-md-hierarchy"
read_time: "12 min"
tags: [Architecture, Seed Agent, CLAUDE.md, Working Memory]
status: draft
version: v0.4.0
audience: "Tier 2 → Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The CLAUDE.md Hierarchy

*Essay 5.7 — The Always-On Digital Cortex, Part 7 of 9.*

---

[Essay 5.6](05_6-question-discipline.html) closed the tour of the always-on plugins. This part covers one of the substrate forms underneath them — the **working-memory form**: a hierarchy of plain Markdown files (`CLAUDE.md` files) at known locations on disk, plus the protocol that turns those files into a structured information bus. The substrate as a whole holds many forms — `knowledge/`, each plugin's hidden state, `voice.xml`, `evolution.md`, `agents/`. The CLAUDE.md hierarchy is the one the phasic layer writes through.

The plugins do their work in parallel; this is where the cycle's experiential data *lands*.

---

## The native primitive

Drop a file named `CLAUDE.md` into a project, and the standard Claude Code CLI agent reads it. Drop one into `.claude/`, and it gets read too. Nest more of them inside subdirectories, and Claude Code surfaces each one when the agent works near it. The shared move: a plain Markdown file at a known location, automatically appended to the model's context whenever the agent reads or edits files in that directory. *[ref: drop-a-file-named-claude | .claude/plugins/brain_guard/hooks/CLAUDE.md header (title + Status line) | Proof of nested loading: 4-level-deep `hooks/` CLAUDE.md begins "# hooks/ — Status: Live — Feature #1 hooks shipped..." The prototype currently contains 116 CLAUDE.md files inside `.claude/` alone (111 carrying all four phase footers), automatically surfaced when the agent works near each one.]*

Other agentic CLI agents run the same pattern in their own ecosystems — Codex and opencode read `AGENTS.md`, Gemini CLI reads `GEMINI.md`. The convention is most obviously useful for code, where each `CLAUDE.md` doubles as meta-information about how to manage future edits — and most agentic CLI agents were originally built for software work. *[ref: other-agentic-cli-agents-run | GEMINI.md (Gemini CLI Project Mandates header) + CLAUDE.md "Collaboration Rules (from AGENTS.md)" section | Workspace root contains `GEMINI.md` titled "Gemini CLI Project Mandates" — direct proof Gemini CLI reads this convention. Codex/opencode's `AGENTS.md` pattern is externally documented; root CLAUDE.md's "Collaboration Rules (from AGENTS.md)" section header itself cites that file, confirming the cross-agent convention is in this project's awareness.]*

But as [the first essay](../b1/01-llms-are-not-the-agents.html) argued, the CLI form factor extends far beyond writing code — to any work whose product lives in files: research, legal analysis, business operations, consulting work, and beyond. *[ref: but-as-the-first-essay | blog/b1/01-llms-are-not-the-agents.md "What Is an Agent, Really?" section | Blog 1's exact phrasing: "Current tools — Claude Code, OpenCode, Gemini CLI — are marketed toward technical users... But what these tools actually do is manipulate files and respond to file content. That capability extends far beyond writing code." The specific enumeration (research, legal, business, consulting) is Blog 5's elaboration.]*

The native loading is layered. The [Claude Code memory documentation](https://docs.claude.com/en/docs/claude-code/memory) recognizes two locations for project-level instructions — `./CLAUDE.md` and `./.claude/CLAUDE.md` — and both load at session start. The seed agent uses both: a high-level `CLAUDE.md` at the workspace root for identity and operating rules, and a brain index inside `.claude/` cataloging plugins and active jobs. Run `/memory` inside Claude Code and you will see them both listed alongside any user-level CLAUDE.md files. After a `/compact`, Claude re-reads the project-root file from disk and re-injects it. Every other `CLAUDE.md` further down the tree loads on demand: per the docs, *"they are included when Claude reads files in those subdirectories."* *[ref: the-native-loading-is-layered | CLAUDE.md Identity section + `.claude/CLAUDE.md` Components section | Root CLAUDE.md's Identity section opens "You are a **seed agent** — a customizable cognitive system that lives on disk, organized through plugins..." and points at `.claude/` as the brain. Root holds identity + operating rules; `.claude/CLAUDE.md` Components section catalogues plugins as the brain index. Identity section anchored at `## Identity` (currently L4), pointer to `.claude/` at the section's tail.]*

Every Claude Code user gets this primitive for free. What the seed agent does on top is *partition* each `CLAUDE.md` into compartments. *[ref: seed-agent-partitions-claude-md | CLAUDE.md footer-anchor block (`---Ob---` / `---Pl---` / `---Ex---` / `---Ve---`) | Root CLAUDE.md itself partitioned with the four footer anchors at the file's tail (each anchor sits on its own line, separated by blank-line gutters that the four phases write into). Every CLAUDE.md inside the seed-agent brain carries the same four anchors — the partition the seed agent adds on top of Claude Code's native loading.]*

## The four-footer protocol

The body of the file — everything above the four anchors below — keeps the standard Claude Code semantics: identity, rules, structure, the things the agent should remember about this directory at all times. Below the body, every `CLAUDE.md` inside the seed agent's brain carries four anchored sections: *[ref: body-keeps-standard-claude-code-semantics | .claude/plugins/brain_guard/hooks/CLAUDE.md four phase-section anchors | brain_guard/hooks/CLAUDE.md as universal example: the body (Files, Hook Contract, Prefix bypass) sits above the four phase-section anchors `---Ob---` / `---Pl---` / `---Ex---` / `---Ve---` at the file's tail, each on its own line separated by blank-line gutters that the four phases write into. Same body+footer split across every brain CLAUDE.md.]*

```
(body content — identity, rules, structure)

---Ob---

(observation content goes here)

---Pl---

(plan content goes here)

---Ex---

(execution content goes here)

---Ve---

(verification content goes here)
```

Each footer section corresponds to one phase of the OPEVC cycle. The guard hooks inside each phase plugin enforce a single rule: a phase cannot edit *above* its own anchor. During OBSERVE, the agent can write into `---Ob---` and into any of the three sections below it. During PLAN, into `---Pl---` and below. During EXECUTE, into `---Ex---` and `---Ve---`. During VERIFY, only into `---Ve---`. The body — everything above the first anchor — is off-limits to all four phases. Only the CONDENSE phase is allowed to absorb content upward into the body, and only when closing the cycle. *[ref: each-footer-section-corresponds-phase | .claude/plugins/phase_observe/hooks/observe-guard.sh (check_section_edit "---Ob---" call) | OBSERVE guard: `section_result=$(check_section_edit "---Ob---" "$FILE_PATH" "$OLD_STR" "$NEW_STR")`. Sister calls in plan-guard.sh (`---Pl---`), execute-guard.sh (`---Ex---`), verify-guard.sh (`---Ve---`). Each blocks edits above its own anchor; body protected; CONDENSE absorbs upward.]*

The asymmetry is intentional. Earlier phases can leave forward-looking notes for later phases — OBSERVE can sketch an early plan or seed a verify checklist if it spots one; PLAN can pre-stage verification criteria for the work it is about to dispatch — but no phase can rewrite what an earlier phase has already committed. Information flows *downward* through the cycle. The full per-phase semantics — what each phase is encouraged to write where, how subagents feed OBSERVE from the knowledge directory, and how all four phases can drop prefixed marked notes for CONDENSE to consume — is the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). For now, the load-bearing fact is that the footer is a structured, append-forward, multi-author region. *[ref: asymmetry-is-intentional-forward-write | .claude/plugins/lib/section_guard/section-check.sh ("STRICTLY BELOW" gate) | The "STRICTLY BELOW" gate (line 276 comment); lines 282-291 block edits whose anchor sits at or above the phase anchor: "Edit anchor '${first_sub}' found at line ${first_match_line} (at or above ${phase_anchor}). Edit must target content below ${phase_anchor}."]*

What about a hand-authored or project-tree `CLAUDE.md` that arrives missing some of its anchors? When a phase engages such a file — editing it or even just reading it — the guard restores the absent anchors in place, at their canonical position, keeping a snapshot, and work proceeds. The four anchors are a derivable structural fact, so the system can simply re-derive them — the same self-healing principle that runs throughout the prototype. *[ref: anchor-self-heal-engagement | .claude/plugins/lib/section_guard/section-check.sh heal_missing_anchors + the four phase guards' heal callsites | `heal_missing_anchors` counts each anchor, snapshots the file to a sibling `.anchor-heals` copy before any change, then inserts only the absent anchors at their canonical position (Ob < Pl < Ex < Ve) — never a blind append, which could leave an interior gap out of order. Duplicated or out-of-order anchors are NOT auto-fixed (that would be destructive) — the guard blocks and escalates instead. The wrapper `heal_claude_md_anchors_or_block` is called by all four phase guards at their Edit and Read engagement points (observe-guard.sh:310/395, plan-guard.sh:270/305, execute-guard.sh:868/928, verify-guard.sh:312/343) and emits one loud stderr line naming the file and the anchors added, so the heal is never silent.]*

## Inflate and deflate

The footers are why the seed agent does not need to rely on the chat to hold its working memory. As a job moves through OBSERVE → PLAN → EXECUTE → VERIFY, each phase writes its experiential output — what was gathered, what was decided, what was built, what was checked — into its own footer slot in whichever `CLAUDE.md` is closest to where the work is happening. The footers *inflate* across the cycle. By the time the job reaches the end of VERIFY, the four sections together can hold thousands of words of fresh, cycle-specific memory. *[ref: footers-replace-chat-working-memory | .claude/plugins/phase_condense/docs/principles.md "Principle 9 — Five Markers as Cross-Phase Signal System" section | Principle 9 states: "Observe, plan, execute, verify phases record findings via five standardized markers in their respective phase-section footers (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`)." Each phase appends; CONDENSE consumes + deflates only at cycle close.]*

CONDENSE deflates them. CONDENSE is the cognitive organ that closes each OPEVC cycle — its waterfall pulls durable findings from the four footer sections up into the body of the same `CLAUDE.md` (so they survive the next cycle), routes topic-specific knowledge into `.claude/knowledge/`, and migrates anything that belongs higher up the tree into a parent `CLAUDE.md` or into the root brain. When CONDENSE finishes, the footers are empty again. The next cycle of OPEVC starts with a clean working memory and a slightly enriched body. The hierarchy as a whole grows smarter with each pass. *[ref: condense-deflates-footers-organ | .claude/plugins/phase_condense/scripts/condense-commit.sh (80% deflation gate) | Deflation gate — a single 80% rule: at least 80% of the bottom-section words must be absorbed or migrated before `condense-commit.sh` advances to idle (it blocks if `current_total > max_remaining`). The threshold is uniform regardless of Job Stage. (The prototype's former split `CONDENSE_DEF_THRESHOLD_STAGE2=50` was removed with the stage-aware-deflation retirement — the gate is the single 80% threshold.) Footer emptiness is enforced, not coincidental.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/claude-md-anchors-b5-7.png
  Concept: Chalk-on-blackboard sequence — five panels of a CLAUDE.md file across the OPEVC cycle, footers inflating then CONDENSE deflating them.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk panels;
  pastel chalk for each phase header (cyan = OBSERVE, green = PLAN, orange = EXECUTE, pink = VERIFY, magenta = CONDENSE);
  white chalk for ALL file outlines, footer anchors, arrows, captions, and labels; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent any other phase names, file names, or directory names.
  Layout: Five small chalk panels arranged left to right, in this exact order. Above each panel, a phase header in pastel chalk reads exactly:
    Panel 1 header: "OBSERVE" (cyan)
    Panel 2 header: "PLAN" (green)
    Panel 3 header: "EXECUTE" (orange)
    Panel 4 header: "VERIFY" (pink)
    Panel 5 header: "CONDENSE" (magenta)
  Inside each panel, draw the SAME CLAUDE.md file as a chalk rectangle, divided top-to-bottom into:
    Top zone (labeled in white chalk exactly "body") — dense chalk scribbles.
    Below the body, four footer slots labeled in white chalk with these literal anchors in this top-to-bottom order:
      ---Ob---
      ---Pl---
      ---Ex---
      ---Ve---
  Panel-specific fill:
    Panel 1 (OBSERVE): only the ---Ob--- slot fills with chalk scribbles; other three slots empty.
    Panel 2 (PLAN): ---Ob--- and ---Pl--- both filled; ---Ex--- and ---Ve--- empty.
    Panel 3 (EXECUTE): ---Ob---, ---Pl---, ---Ex--- filled; ---Ve--- empty.
    Panel 4 (VERIFY): all four footers (---Ob---, ---Pl---, ---Ex---, ---Ve---) filled; the file visibly heavier.
    Panel 5 (CONDENSE): a chalk upward arrow inside the file lifts findings from the four footers into the body (the body grows slightly); the four footer slots are deflated nearly empty, with one small chalk note-fragment left behind in a footer to show deferred work that survives into the next cycle; off to the right side of panel 5, a small chalk side-branch peels off labeled in white chalk exactly ".claude/knowledge/".
  A curving white-chalk arrow connects panel 5 back to panel 1, labeled in white chalk exactly "next cycle".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE", "body", "---Ob---", "---Pl---", "---Ex---", "---Ve---", ".claude/knowledge/", "next cycle". No other phase names, file names, or directory names may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.7. Footers inflate across OPEVC, then CONDENSE deflates them — durable findings ratchet upward into the body, the rest discards."
-->

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; color: rgba(255,255,255,0.82);">The whole substrate, walkable. The Markov self-model the seed reads at session start, the CLAUDE.md bus and the teeth that updating it grows, the layered hierarchy, the four-state lifecycle, the footer anchors with their birth-block and self-heal, the three durable surfaces the bus condenses into, and the soft size caps with the forgetting discipline &mdash; laid out as an interactive concept-deck you can hover and click.</span>
  <a href="explore/claude-md-hierarchy.html" style="flex-shrink: 0; display: inline-block; padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #fff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the CLAUDE.md hierarchy</a>
</aside>
<!-- /RAW_HTML -->

## The altered list — CLAUDE.md edits scope execution

There is a second consequence of CLAUDE.md edits during a cycle, and it is what gives the bus teeth. EXECUTE — the only phase that may touch project files outside `.claude/` — is fenced to the *altered list*: the set of directories whose `CLAUDE.md` the agent edited during OBSERVE or PLAN. EXECUTE inherits the list and may only modify files inside those directories. If a directory's `CLAUDE.md` was never touched during the read-only phases, EXECUTE cannot make project changes there in this cycle, however clearly the work seems to call for them. *[ref: second-consequence-altered-list | .claude/plugins/phase_execute/hooks/execute-guard.sh (altered-list membership gate) | Comment line 822: "Observe + plan altered_claude_md lists are merged into execute's data.json at sensor init." Subsequent block enforces: `if ! echo "$altered_list" | grep -qxF "$claude_rel"; then block ...`. Verify-guard.sh separately blocks any project-file edit in VERIFY.]*

The bus is not only where the agent stores experiential notes — it is where the agent *declares* the work it intends to do. Editing a `CLAUDE.md` during OBSERVE or PLAN is a commitment that scopes what EXECUTE will be allowed to attempt. GMODE — the deliberate user-gated escape — bypasses these phase guards entirely; outside GMODE, the altered-list gate is friction the agent reads and obeys, not a mathematical proof of containment. The deeper mechanics — how the altered list is checked, what file types EXECUTE may write inside an altered-list directory, how multi-commit checkpoints land — are the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). For the bus story, the structural fact is enough: `CLAUDE.md` edits gate execution. *[ref: claude-md-edits-gate-execution | .claude/plugins/phase_plan/hooks/plan-tracker.sh (add-altered handler) | When a `CLAUDE.md` is edited during PLAN, `add-altered` records its path into the job's altered_claude_md list (comment line 126: "builds altered list"). Mirror in observe-tracker.sh fires the same hook during OBSERVE. The list freezes scope for EXECUTE.]*

A directory with no `CLAUDE.md` yet is not a dead end — OBSERVE or PLAN simply creates the first one (body plus the four anchors) to declare it editable. Creation is blocked only if the new file lacks the four-footer protocol, so every working-memory file is born well-formed. *[ref: observe-plan-create-first-claude-md | .claude/plugins/lib/section_guard/section-check.sh validate_new_claude_md_anchors + observe-guard.sh / plan-guard.sh callsites | `validate_new_claude_md_anchors` greps the proposed content for all four anchors (`---Ob---` / `---Pl---` / `---Ex---` / `---Ve---`) and returns "missing" if any are absent; observe-guard and plan-guard call it before allowing a Write to a non-existent `CLAUDE.md`, blocking creation of an anchorless file. EXECUTE and VERIFY cannot create `CLAUDE.md` files at all.]*

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

A lawyer building a case-analysis seed could mirror the same shape — a root `CLAUDE.md` for firm-wide research protocols, per-matter `CLAUDE.md` files inside each case folder, knowledge silos for jurisdiction-specific precedent libraries. The four-footer protocol scopes which case files the agent may edit in any given cycle, the same way it scopes the seed agent's plugin work here.

Each layer plays a different role on the bus.

The **root CLAUDE.md** declares the agent's identity and operating rules — what phases exist, what the size limits are, how the brain is allowed to grow. It is the top of the bus, and one of the two project-level CLAUDE.md files Claude Code loads at session start. *[ref: root-CLAUDE-md-declares-identity | CLAUDE.md "Growth Rules" section under "Markov Brain" | Growth Rules section (8 numbered rules): new operations need definition + transition maps, recurring patterns codify, >50-word ops extract to skills, CONDENSE grows brain, size limits drive reorganization, soft→hard migration, brain never stops growing, enumeration requires verification.]*

The **brain index** at `.claude/CLAUDE.md` is the other one. It catalogs the plugins, points to the knowledge directory, and records the brain-maturation lessons accumulated across cycles. *[ref: brain-index-catalogs-plugins | .claude/CLAUDE.md "Components" section | Components section enumerates every plugin (the plugins block, with version + tests + status) and the knowledge layer (the knowledge block immediately above). "Brain Maturation" and "Voice Architecture (C2 lessons)" sections at the file's tail hold cross-cycle disciplines.]*

The **plugin CLAUDE.md files** declare what each plugin owns. They are how a plugin tells the rest of the system "I am responsible for X, here is how I work, here are my tests, here is my current version." When a plugin is being edited, that plugin's CLAUDE.md is the agent's working memory for the edit, and its footer is where the cycle's experiential data accumulates until CONDENSE absorbs it. *[ref: plugin-CLAUDE-md-files-declare | .claude/plugins/CLAUDE.md "Plugin Structure Convention" section | Plugin Structure Convention describes each plugin's `CLAUDE.md` as "Working memory — objective, state, maintenance rules." Layout includes hooks/, scripts/, tests/, docs/ each with their own nested CLAUDE.md. Minimal plugin = just CLAUDE.md.]*

The **working-directory CLAUDE.md files** are local. The website project has one. So does the blog folder. So does — when work is happening there — any directory deep in the tree where the focus currently sits. These are the files whose footers most often inflate during the OPEVC cycle and deflate during CONDENSE. *[ref: working-directory-CLAUDE-md-files-local | CLAUDE.md "CLAUDE.md Lifecycle" section | CLAUDE.md Lifecycle states — Active (updated in every phase), Proactive (created before work in a directory), Retroactive (updated after work), Condensed (distilled at cycle close, knowledge migrated to .claude/knowledge/). Per-directory working memory.]*

The **knowledge directory** is the durable layer. When something has been learned that is worth keeping past the current cycle, CONDENSE routes it into `.claude/knowledge/<topic>/` as a real Markdown file with its own structure. The current prototype carries one topic silo per major plugin (`brain_guard/`, `phase_observe/`, `phase_condense/`, and so on) plus a cross-cutting `opevc/` directory that holds dozens of operational recipes mined from cycles across the system. Each topic dir tends to grow an `INDEX.md` plus a handful of focused topic files, refined cycle after cycle. OBSERVE phases recall from the directory; CONDENSE phases extend it; subagents are dispatched against it for parallel research. Knowledge files are how the agent remembers things across sessions, across cycles, across months. *[ref: knowledge-directory-is-durable-layer | .claude/plugins/phase_condense/docs/principles.md "Principle 6 — Subagents as Extractors" section | Principle 6 names `condense-knowledge-extractor → .claude/knowledge/<topic>/` as the routing rule. Subagents RESOLVE a note or HAND IT BACK to the seed; they do not reject or discard content. The session archive (run-aware job dir `run-<r>/session-log-<c>.md`) is the full-footer snapshot, NOT a fallback for knowledge no subagent accepted. Knowledge directory is the durable destination CONDENSE routes into.]*

## The plugin–hierarchy asymmetry

Every always-on plugin keeps its own state in hidden files inside its plugin directory — files the seed agent itself cannot read or edit directly. Every state mutation goes through a plugin-owned script. Some of that script's commands are public, callable as part of the agent's workflow (`job.sh focused` is a typical example); others are flagged as internal-only and restricted to other scripts and hooks within the seed, so the agent cannot reach them at all. None of these plugins treat `CLAUDE.md` as their primary state surface. The relationship to the hierarchy varies plugin by plugin — `plugin_integrity` polices the four phase anchors from removal but otherwise leaves `CLAUDE.md` content free to edit, while the others are mostly orthogonal, owning concerns (context budget, job lifecycle, interaction summarization, question discipline) that live in their own data files. *[ref: every-plugin-hidden-state-files | .claude/plugins/CLAUDE.md "Plugin State Model (data.json)" section | Plugin State Model: "data.json is hidden internal state. The agent cannot read or edit it directly. All access through the plugin's own scripts." Two modes — Public + `--hook`. plugin_integrity blocks direct reads/edits and the `--hook` flag from the agent.]*

The **phasic plugins** generate the bus's content. The choreography of how each phase writes its footer and how CONDENSE absorbs them is the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). *[ref: phasic-plugins-generate-bus-content | .claude/plugins/phase_condense/scripts/condense-commit.sh (anchor-grep + word-count in deflation gate) | CONDENSE deflation gate greps `^---(Ob|Pl|Ex|Ve)---$` first anchor in every altered CLAUDE.md, counts words AFTER (all four footers combined), computes `words_absorbed = total_baseline - current_total`. All four phasic plugins write through these anchors.]*

The relationship is asymmetric. The phasic layer is the system that actively uses the hierarchy — its phases write into footers during the cycle, and CONDENSE absorbs the durable parts upward into bodies, sideways into knowledge files, and into voice files, subagent definitions, and the brain's own operations, at cycle close. The always-on layer mostly does not — each of its plugins runs its own concern through its own state, with at most narrow points of contact (`plugin_integrity` guards the phase anchors; the rest are orthogonal). In the current prototype, well over a hundred `CLAUDE.md` files across the brain carry the four phase footers — 111 of 116 inside `.claude/` alone. The footer convention is the protocol — and the phasic layer is what writes through it. *[ref: relationship-is-asymmetric-phasic-uses | CLAUDE.md "CONDENSE.consume-markers" sub-operation (under "Sub-Operations of CONDENSE") | CONDENSE.consume-markers (steps 3-6) routes footer marked notes to multiple destinations: `[PENDING-JOB]` → job creation, `[VOICE-UPDATE]` → voice.xml, `[AGENT-UPDATE]` → subagent defs, `[KNOWLEDGE]` → knowledge files. Filesystem: 111 of 116 CLAUDE.md files inside `.claude/` carry all four phase footers.]*

This is the bus.

---

The working-memory form is built — body + four footers + altered-list gate + the layered hierarchy. The next part deconstructs one of the architecture's most elegant proofs that this substrate works in concert: three plugins compose into a ceremony that no plugin could enforce alone.

---

*Essay 5.7 — The Always-On Digital Cortex, Part 7 of 9.*

*Previous: [Essay 5.6 — Structured Questions — `question_discipline`](05_6-question-discipline.html) — the registered-prefix gate.*
*Next: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
