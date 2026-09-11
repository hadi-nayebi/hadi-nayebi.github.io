---
title: "Mega-Prompt Compression — interaction_summary"
date: "May 2026"
slug: "interaction-summary"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.6.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Mega-Prompt Compression — `interaction_summary`

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

---

[Essay 5.4](05_4-job-core.html) showed how user direction accumulates on a durable job. This part covers the neighboring plugin that compresses that interaction history before it becomes difficult to use.

This essay describes an earlier private Claude Code prototype. Its threshold and summary schema are local design choices; the broader problem of preserving decisions through long work is portable.

---

## What it owns

`interaction_summary` maintains a per-job chain of structured interaction summaries. It does not copy the raw interactions or modify `job_core`. Instead, it creates a small mirror record under the same job ID only when that job first crosses the configured threshold. The record contains the last summarized interaction index, a `summary_needed` flag, and an append-only summary chain. *[ref: distributed-summary-extension | .claude/plugins/interaction_summary/CLAUDE.md, Distributed Job Extension and Data Model | The plugin reads the focused job through `job.sh`, keeps its own minimal record, and lazily begins tracking only jobs that need compression.]*

This is compression with provenance. Each summary entry records how far through the interaction list it reaches. The raw history remains in `job_core`; the compressed chain records the agent's evolving account of what matters.

## Detect debt, then enforce it

The live prototype separates detection from enforcement.

After an `AskUserQuestion` exchange, a post-tool hook examines the focused job's unsummarized `user_interactions`. It approximates tokens from word count using a configurable ratio. If the estimate reaches the default threshold of 500 tokens, the hook silently sets `summary_needed: true`. In-gmode questions are stored separately by `job_core`, so they do not enter this count. *[ref: detection | .claude/plugins/interaction_summary/hooks/token-counter.sh; .claude/plugins/interaction_summary/config.conf; .claude/plugins/interaction_summary/CLAUDE.md, Trigger Mechanism | Detection runs after `AskUserQuestion`, counts from `last_summarized_index`, uses the 13/10 approximation and 500-token default, and excludes the separate gmode interaction array.]*

The silence is deliberate. Detection records a debt; it does not interrupt the just-completed exchange with a long message. On the next productive tool call, the pre-tool guard sees the flag, blocks the call, and supplies the material needed to write the summary: the previous summary, the new interactions, the required structure, and the exact submission command. *[ref: enforcement | .claude/plugins/interaction_summary/hooks/summary-guard.sh, Summary Context Generation; .claude/plugins/interaction_summary/hooks/token-counter.sh, Threshold Trigger | The detector only flips state; the guard injects full context when the main session next attempts guarded work.]*

This timing creates a useful behavioral boundary:

1. conversation creates enough unsummarized context to incur debt;
2. debt becomes durable state;
3. the next attempt to continue work is blocked;
4. a valid summary pays the debt and releases the work.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/interaction-summary-b5-5.png
  STATUS: Historical concept retained; diagram redesign is outside this editorial pass.
  Note: The existing diagram correctly shows summary debt blocking productive work, but its single-path visual predates the shared escape, memory, and read-only job-status allowances described below.
  Caption: "Image 5.5. Summary debt blocks productive work until a valid summary is submitted; a small shared escape set remains available to prevent deadlocks."
-->

## Strict, with explicit escape routes

The guard covers the main session's productive tool surface: file reads and writes, search, shell commands, web access, new questions, and spawning an agent. A main-session agent cannot evade summary debt by switching from Read to Grep, asking another question, or sending the work to a subagent.

The block is strict, but it is not literally total. Four categories remain available:

- the dedicated `summary.sh submit` command;
- the shared always-callable commands for compaction, metacognition, and phase transitions;
- read-only `job.sh focused`, `show`, and `list` status checks;
- and direct access to the seed's cross-session memory files.

Those allowances prevent one gate from wedging another gate's recovery path. Infrastructure-prefixed questions are still blocked until the summary is submitted. Subagent-internal calls are exempt because the summary debt belongs to the main session, but the main session cannot spawn a new subagent while debt is active. Shell allowances must be the sole invocation, which prevents an unrelated command from hiding beside an allowed one. *[ref: guard-allowlist | .claude/plugins/interaction_summary/hooks/summary-guard.sh, Tool Validation, Native memory tool, and Command Whitelist | The live guard protects equivalent tools, admits the shared escape registry and narrow status/memory paths, and anchors shell exemptions against command chaining.]*

The distinction matters. “Block until summarized” is the policy. “Block absolutely every possible action” would be a deadlock risk.

## Shape compels a usable summary

Submission goes through one gateway. The current configuration accepts an approximate total of 200 to 1,000 tokens and requires five Markdown sections:

- User Requests
- Questions & Decisions
- Design Choices
- Corrections & Feedback
- Current State

Each section must contribute at least 50 approximate tokens. If the summary is missing a section, too shallow in one section, or outside the total range, the command refuses it. A valid submission appends one entry, records the current interaction count as its coverage boundary, and clears `summary_needed`. *[ref: submission-shape | .claude/plugins/interaction_summary/scripts/summary.sh, submit handler; .claude/plugins/interaction_summary/config.conf, Summary validation | The gateway enforces five headings, the 200-to-1,000 total range, a 50-token section floor, append-only insertion, coverage indexing, and debt release.]*

This is another instance of *shape compels production*. The gate can force the agent to address requests, decisions, design choices, corrections, and current state separately. It cannot prove that the resulting account is wise or complete. Structure makes omission more visible; review still supplies judgment.

## A chain, not a pile

Each new summary is built with the previous summary and only the interactions beyond its recorded coverage index. The chain is append-only, so earlier entries remain inspectable. The newest entry becomes the practical orientation point while the raw interaction list remains available for recovery.

The design does not recursively collapse old entries into a separate meta-summary. The latest summary is expected to carry forward what remains important while incorporating the new interval. This is intentionally lossy: compression that preserved every detail would not be compression. The raw source and coverage indices provide a route back when a detail matters enough to recover. *[ref: summary-chain | .claude/plugins/interaction_summary/CLAUDE.md, Summary Chain and Decisions; .claude/plugins/interaction_summary/scripts/summary.sh, chain append | Each entry stores timestamp, coverage boundary, text, and token estimate; older entries are not rewritten and the raw interactions remain with `job_core`.]*

This chain is not the same artifact as the compaction file from [Essay 5.3](05_3-brain-guard.html). The interaction summary compresses user direction within a job. The compaction file prepares a broader cognitive handoff across a context boundary. They can inform each other, but they answer different questions.

## What would break without it

Without periodic compression, a long interaction history becomes expensive to inspect and easy to misread. Recent instructions can obscure earlier constraints; corrections can become detached from the decisions they changed; the next session may recover the words without recovering the narrative.

The plugin does not guarantee coherence. It creates a recurring checkpoint where coherence must be reconstructed in a reviewable shape. That checkpoint is the durable benefit.

## What you would customize

The threshold should reflect the cost and rhythm of the work. Short, high-frequency exchanges may justify earlier summaries. Long technical responses may need more room. The prototype's word-to-token estimate is fast and offline, but a different model or language may justify a tokenizer-aware counter.

The five-section schema should reflect the domain. A research seed might emphasize sources, hypotheses, and unresolved questions. A consulting seed might emphasize client goals, constraints, commitments, and next actions. A legal seed might separate authorities, interpretations, conflicts, and open verification.

The chain can also evolve. A much longer-running system may need topic-specific chains or a reviewed summary-of-summaries. Any such design should preserve three properties: a clear coverage boundary, access to the source history, and an explicit distinction between recorded evidence and the lossy account derived from it.

The architectural lesson is therefore larger than the current five headings. Long jobs need an owned compression process, and that process needs a trigger, a debt state, a reviewable shape, and a safe way back to its sources. *[ref: configurable-boundary | .claude/plugins/interaction_summary/config.conf; .claude/plugins/interaction_summary/CLAUDE.md, Configuration and Design Principle | Thresholds, approximation, length bounds, and section depth are configurable while distributed ownership and indexed summary state define the current architecture.]*

---

The next part covers the plugin that structures the questions through which the seed agent asks for consequential user decisions.

---

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

*Previous: [Essay 5.4 — Job Lifecycle — `job_core`](05_4-job-core.html) — the durable work unit shared across the prototype.*
*Next: [Essay 5.6 — Structured Questions — `question_discipline`](05_6-question-discipline.html) — the registry and gates behind consequential questions.*
