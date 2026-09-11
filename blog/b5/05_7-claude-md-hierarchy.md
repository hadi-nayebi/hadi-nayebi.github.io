---
title: "The CLAUDE.md Hierarchy"
date: "May 18, 2026"
slug: "claude-md-hierarchy"
read_time: "12 min"
tags: [Architecture, Seed Agent, CLAUDE.md, Working Memory]
status: published
version: v0.5.0
audience: "Tier 2 → Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The CLAUDE.md Hierarchy

*Essay 5.7 — The Always-On Digital Cortex, Part 7 of 9.*

---

[Essay 5.6](05_6-question-discipline.html) closed the tour of the always-on plugins. This part covers a framework-generic substrate pattern underneath them — the **working-memory form**: a hierarchy of plain instruction files at known locations on disk, plus a protocol that turns those files into a structured information bus. The historical Claude-based reference architecture examined here implements the pattern with `CLAUDE.md` files. Its substrate also holds `knowledge/`, each plugin's hidden state, `voice.xml`, `evolution.md`, and `agents/`; the CLAUDE.md hierarchy is the form its phasic layer writes through. *[ref: claude-md-hierarchy-phasic-writes-through | private historical prototype | implementation claim checked against a private historical prototype]*

The plugins do their work throughout the cycle; this is where the cycle's experiential data *lands*.

---

## The native primitive

Many CLI-agent frameworks recognize project instruction files and load them according to directory scope. In Claude Code, put a file named `CLAUDE.md` at the project root or inside `.claude/`, and the CLI loads it as project instructions. Nest more inside subdirectories, and Claude Code loads each one on demand when it reads files in that subtree. The shared move is a plain Markdown file at a known location, added to the model's context when its scope becomes relevant. *[ref: drop-a-file-named-claude | private historical prototype | implementation claim checked against a private historical prototype]*

Other CLI agents use related conventions in their own ecosystems, with their own filenames and loading rules. The pattern is most obviously useful for code, where each instruction file doubles as information about how to manage future edits — and many CLI agents were originally built for software work. *[ref: other-agentic-cli-agents-run | private historical prototype | implementation claim checked against a private historical prototype]*

But as [the first essay](../b1/01-llms-are-not-the-agents.html) argued, the CLI form factor extends far beyond writing code — to any work whose product lives in files: research, legal analysis, business operations, consulting work, and beyond. *[ref: but-as-the-first-essay | private historical prototype | implementation claim checked against a private historical prototype]*

The native loading is layered. The [Claude Code memory documentation](https://code.claude.com/docs/en/memory) recognizes two locations for project-level instructions — `./CLAUDE.md` and `./.claude/CLAUDE.md`. The historical seed agent uses both: a high-level `CLAUDE.md` at the workspace root for identity and operating rules, and a brain index inside `.claude/` cataloging plugins and active jobs. Run `/memory` inside Claude Code and you will see loaded project and user instruction files. After a `/compact`, Claude re-reads project-root instructions from disk and re-injects them; nested files reload on demand when Claude next reads a file in their subtree. *[ref: the-native-loading-is-layered | private historical prototype | implementation claim checked against a private historical prototype]*

Claude Code supplies the loading primitive. The historical seed architecture adds its own protocol by *partitioning* each `CLAUDE.md` into compartments. *[ref: seed-agent-partitions-claude-md | private historical prototype | implementation claim checked against a private historical prototype]*

## The four-footer protocol

The body of the file — everything above the four anchors below — keeps the standard instruction-file role: identity, rules, structure, and the things the agent should remember about this directory at all times. Below the body, every `CLAUDE.md` inside this reference architecture's brain carries four anchored sections: *[ref: body-keeps-standard-claude-code-semantics | private historical prototype | implementation claim checked against a private historical prototype]*

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

Each footer section corresponds to one phase of the OPEVC cycle. The guard hooks inside each phase plugin enforce a single rule: a phase cannot edit *above* its own anchor. During OBSERVE, the agent can write into `---Ob---` and into any of the three sections below it. During PLAN, into `---Pl---` and below. During EXECUTE, into `---Ex---` and `---Ve---`. During VERIFY, only into `---Ve---`. The body — everything above the first anchor — is off-limits to all four phases. Only the CONDENSE phase is allowed to absorb content upward into the body, and only when closing the cycle. *[ref: each-footer-section-corresponds-phase | private historical prototype | implementation claim checked against a private historical prototype]*

The asymmetry is intentional. Earlier phases can leave forward-looking notes for later phases — OBSERVE can sketch an early plan or seed a verify checklist if it spots one; PLAN can pre-stage verification criteria for the work it is about to dispatch — but no phase can rewrite what an earlier phase has already committed. Information flows *downward* through the cycle. The full per-phase semantics — what each phase is encouraged to write where, how subagents feed OBSERVE from the knowledge directory, and how all four phases can drop prefixed marked notes for CONDENSE to consume — is the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). For now, the load-bearing fact is that the footer is a structured, append-forward, multi-author region. *[ref: asymmetry-is-intentional-forward-write | private historical prototype | implementation claim checked against a private historical prototype]*

What about a hand-authored or project-tree `CLAUDE.md` that arrives missing some of its anchors? When a phase engages such a file — editing it or even just reading it — the guard restores the absent anchors in place, at their canonical position, keeping a snapshot, and work proceeds. The four anchors are a derivable structural fact, so the system can simply re-derive them — the same self-healing principle that runs throughout the prototype. *[ref: anchor-self-heal-engagement | private historical prototype | implementation claim checked against a private historical prototype]*

## Inflate and deflate

The footers are why the seed agent does not need to rely on the chat to hold its working memory. As a job moves through OBSERVE → PLAN → EXECUTE → VERIFY, each phase writes its experiential output — what was gathered, what was decided, what was built, what was checked — into its own footer slot in whichever `CLAUDE.md` is closest to where the work is happening. The footers *inflate* across the cycle. By the time the job reaches the end of VERIFY, the four sections together can hold thousands of words of fresh, cycle-specific memory. *[ref: footers-replace-chat-working-memory | private historical prototype | implementation claim checked against a private historical prototype]*

CONDENSE deflates them. CONDENSE is the cognitive organ that closes each OPEVC cycle — its waterfall pulls durable findings from the four footer sections up into the body of the same `CLAUDE.md` (so they survive the next cycle), routes topic-specific knowledge into `.claude/knowledge/`, and migrates anything that belongs higher up the tree into a parent `CLAUDE.md` or into the root brain. When CONDENSE finishes, the footers are mostly empty; the prototype requires substantial deflation rather than literal emptiness, so deferred fragments can remain. The next cycle of OPEVC starts with lighter working memory and a slightly enriched body. The hierarchy as a whole grows smarter with each pass. *[ref: condense-deflates-footers-organ | private historical prototype | implementation claim checked against a private historical prototype]*

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
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.7. Footers inflate across OPEVC, then CONDENSE deflates them — durable findings ratchet upward into the body, and the rest is discarded."
-->

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; color: rgba(255,255,255,0.82);">The whole substrate, walkable. The Markov self-model the seed reads at session start, the CLAUDE.md bus and the teeth that updating it grows, the layered hierarchy, the four phase footers, their birth-block and self-heal, the three durable surfaces the bus condenses into, and the soft size caps with the forgetting discipline &mdash; laid out as an interactive concept-deck you can hover and click.</span>
  <a href="explore/claude-md-hierarchy.html" style="flex-shrink: 0; display: inline-block; padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #fff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the CLAUDE.md hierarchy</a>
</aside>
<!-- /RAW_HTML -->

## The altered list — CLAUDE.md edits scope execution

There is a second consequence of CLAUDE.md edits during a cycle, and it is what gives the bus teeth. EXECUTE — the only phase that may touch project files outside `.claude/` — is fenced to the *altered list*: the set of directories whose `CLAUDE.md` the agent edited during OBSERVE or PLAN. EXECUTE inherits the list and may only modify files inside those directories. If a directory's `CLAUDE.md` was never touched during the read-only phases, EXECUTE cannot make project changes there in this cycle, however clearly the work seems to call for them. *[ref: second-consequence-altered-list | private historical prototype | implementation claim checked against a private historical prototype]*

The bus is not only where the agent stores experiential notes — it is where the agent *declares* the work it intends to do. Editing a `CLAUDE.md` during OBSERVE or PLAN is a commitment that scopes what EXECUTE will be allowed to attempt. GMODE — the deliberate user-gated escape — bypasses these phase guards entirely; outside GMODE, the altered-list gate is friction the agent reads and obeys, not a mathematical proof of containment. The deeper mechanics — how the altered list is checked, what file types EXECUTE may write inside an altered-list directory, how multi-commit checkpoints land — are the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). For the bus story, the structural fact is enough: `CLAUDE.md` edits gate execution. *[ref: claude-md-edits-gate-execution | private historical prototype | implementation claim checked against a private historical prototype]*

A directory with no `CLAUDE.md` yet is not a dead end — OBSERVE or PLAN simply creates the first one (body plus the four anchors) to declare it editable. Creation is blocked only if the new file lacks the four-footer protocol, so every working-memory file is born well-formed. *[ref: observe-plan-create-first-claude-md | private historical prototype | implementation claim checked against a private historical prototype]*

## The hierarchy itself

The seed agent's bus is not one `CLAUDE.md`. It is a hierarchy.

```
workspace/
├── CLAUDE.md                              ← root brain
├── .claude/
│   ├── CLAUDE.md                          ← brain index
│   ├── plugins/
│   │   ├── integrity/CLAUDE.md            ← plugin brain
│   │   ├── lifecycle/CLAUDE.md            ← plugin brain
│   │   └── ...                            ← one per plugin
│   └── knowledge/
│       ├── integrity/                     ← durable, per-topic
│       ├── lifecycle/
│       └── ...
└── project/
    └── CLAUDE.md                          ← project working memory
```

Your hierarchy will mirror your work, not this example. Same shape — root brain, plugin brains, knowledge silos, per-directory working memory — different folders, different layouts. The architecture is portable; the specific folder tree is one seed's answer to one user's work.

A lawyer building a case-analysis seed could mirror the same shape — a root `CLAUDE.md` for firm-wide research protocols, per-matter `CLAUDE.md` files inside each case folder, knowledge silos for jurisdiction-specific precedent libraries. The four-footer protocol scopes which case files the agent may edit in any given cycle, the same way it scopes the seed agent's plugin work here.

Each layer plays a different role on the bus.

The **root CLAUDE.md** declares the agent's identity and operating rules — what phases exist, what the size limits are, how the brain is allowed to grow. It is the top of the bus, and one of the two project-level CLAUDE.md files Claude Code loads at session start. *[ref: root-CLAUDE-md-declares-identity | private historical prototype | implementation claim checked against a private historical prototype]*

The **brain index** at `.claude/CLAUDE.md` is the other one. It catalogs the plugins, points to the knowledge directory, and records the brain-maturation lessons accumulated across cycles. *[ref: brain-index-catalogs-plugins | private historical prototype | implementation claim checked against a private historical prototype]*

The **plugin CLAUDE.md files** declare what each plugin owns. They are how a plugin tells the rest of the system "I am responsible for X, here is how I work, here are my tests, here is my current version." When a plugin is being edited, that plugin's CLAUDE.md is the agent's working memory for the edit, and its footer is where the cycle's experiential data accumulates until CONDENSE absorbs it. *[ref: plugin-CLAUDE-md-files-declare | private historical prototype | implementation claim checked against a private historical prototype]*

The **working-directory CLAUDE.md files** are local. The website project has one. So does the blog folder. So does — when work is happening there — any directory deep in the tree where the focus currently sits. These are the files whose footers most often inflate during the OPEVC cycle and deflate during CONDENSE. *[ref: working-directory-CLAUDE-md-files-local | private historical prototype | implementation claim checked against a private historical prototype]*

The **knowledge directory** is the durable layer. When something has been learned that is worth keeping past the current cycle, CONDENSE routes it into `.claude/knowledge/<topic>/` as a real Markdown file with its own structure. The current prototype carries one topic silo per major plugin (`brain_guard/`, `phase_observe/`, `phase_condense/`, and so on) plus a cross-cutting `opevc/` directory that holds dozens of operational recipes mined from cycles across the system. Each topic dir tends to grow an `INDEX.md` plus a handful of focused topic files, refined cycle after cycle. OBSERVE phases recall from the directory; CONDENSE phases extend it; subagents are dispatched against it for parallel research. Knowledge files are how the agent remembers things across sessions, across cycles, across months. *[ref: knowledge-directory-is-durable-layer | private historical prototype | implementation claim checked against a private historical prototype]*

## The plugin–hierarchy asymmetry

In this reference architecture, every always-on plugin keeps its own state in hidden files inside its plugin directory — files the seed agent itself cannot read or edit directly. Every state mutation goes through a plugin-owned script. Some of that script's commands are public, callable as part of the agent's workflow (`job.sh focused` is a typical example); others are flagged as internal-only and restricted to other scripts and hooks within the seed, so the agent cannot reach them at all. None of these plugins treat `CLAUDE.md` as their primary state surface. The relationship to the hierarchy varies plugin by plugin — `plugin_integrity` polices the four phase anchors from removal but otherwise leaves `CLAUDE.md` content free to edit, while the others are mostly orthogonal, owning concerns (context budget, job lifecycle, interaction summarization, question discipline) that live in their own data files. *[ref: every-plugin-hidden-state-files | private historical prototype | implementation claim checked against a private historical prototype]*

The **phasic plugins** generate the bus's content. The choreography of how each phase writes its footer and how CONDENSE absorbs them is the subject of the [Essay 6 series](../b6/06_1-phasic-foundation.html). *[ref: phasic-plugins-generate-bus-content | private historical prototype | implementation claim checked against a private historical prototype]*

The relationship is asymmetric. The phasic layer is the system that actively uses the hierarchy — its phases write into footers during the cycle, and CONDENSE absorbs the durable parts upward into bodies, sideways into knowledge files, and into voice files, subagent definitions, and the brain's own operations, at cycle close. The always-on layer mostly does not — each of its plugins runs its own concern through its own state, with at most narrow points of contact (`plugin_integrity` guards the phase anchors; the rest are orthogonal). Across the reference architecture, the CLAUDE.md files consistently carry the four phase footers. The footer convention is the protocol — and the phasic layer is what writes through it. *[ref: relationship-is-asymmetric-phasic-uses | private historical prototype | implementation claim checked against a private historical prototype]*

This is the bus.

---

The working-memory form is built — body + four footers + altered-list gate + the layered hierarchy. The next part deconstructs one of the architecture's most elegant proofs that this substrate works in concert: three plugins compose into a ceremony that no plugin could enforce alone.

---

*Essay 5.7 — The Always-On Digital Cortex, Part 7 of 9.*

*Previous: [Essay 5.6 — Structured Questions — `question_discipline`](05_6-question-discipline.html) — the registered-prefix gate.*
*Next: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
