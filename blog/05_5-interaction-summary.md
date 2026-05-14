---
title: "Cross-Session Memory — interaction_summary"
date: "May 2026"
slug: "interaction-summary"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# Cross-Session Memory — `interaction_summary`

*Essay 5.5 of 9 — The Always-On Digital Cortex.*

---

[Essay 5.4](05_4-job-core.html) named the cumulative mega-prompt — every prompt, every Q&A, appended into the same job's interaction list. That list grows. Past a few hundred turns, it stops fitting cleanly in context. This part covers the plugin that keeps it legible.

---

## What it owns

`interaction_summary` exists to keep a job's dynamic mega-prompt legible as it grows. It works by counting tokens after every user interaction and forcing the agent to draft a structured summary the moment the unsummarized portion crosses a threshold. It applies inside any job whose interaction list grows long enough to compress — short jobs that never cross the threshold never see the plugin engage. *[ref: interaction-summary-exists-to-keep | .claude/plugins/interaction_summary/CLAUDE.md:38-49 | Trigger Mechanism: "Threshold: ~500 tokens. After each interaction is captured by job_core's question-capture: Count tokens in unsummarized interactions (word_count × 1.3)... If ≥ threshold → inject summarization request." Fires on PostToolUse:AskUserQuestion.]*

## How it works — block until summarized

Enforcement runs in two phases. A post-call hook fires right after `job_core` records each interaction, approximates the unsummarized portion in tokens, and trips a flag when the result crosses a threshold. On the next tool call, a pre-call guard blocks every productive tool the agent has — reads, writes, shell calls, even further questions — until a structured summary lands. The submit command refuses just any text: the summary must sit inside a tight word-count band and carry five named sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — each long enough to actually mean something. The same *shape compels production* trick `brain_guard` uses on `/compact`, applied to a different concern. The block has one deliberate escape hatch — infrastructure-prefixed questions like `[PLUGIN-LOCK]` and `[JOB-COMPLETE]` are still allowed, so the agent cannot get into a deadlock where it needs to ask for permission to do the very thing the guard is asking for. The summary chain is append-only and lives entirely in the plugin's hidden state; older entries cannot be rewritten. *[ref: enforcement-runs-in-two-phases | .claude/plugins/interaction_summary/scripts/summary.sh:230-236 | `REQUIRED_SECTIONS` array names exactly five: "User Requests", "Questions & Decisions", "Design Choices", "Corrections & Feedback", "Current State." Append-only chain: `.summary_chain += [...]` at line 276. Pre-call gate at summary-guard.sh:90 with `BYPASS_PREFIXES` including PLUGIN-LOCK + JOB-COMPLETE.]*

## What would break without it

Without this plugin, long jobs lose narrative coherence as the interaction list bloats; the summary chain is what keeps a job legible at a glance and what survives forward when the job spans more than one OPEVC cycle. *[ref: without-interaction-summary-long-jobs | .claude/plugins/interaction_summary/CLAUDE.md:15-17 | Objective: "Maintain a continuous summary chain from user interactions. When unsummarized interactions exceed a token threshold, block all work until the agent produces a summary that carries forward essential context." Chain persists keyed by job ID across cycles.]*

## What you would customize

`interaction_summary` is the second always-on plugin where the *shape* is the lesson and the names are your prototype's answer. Almost every parameter has a defensible reason to move.

You would tune the *threshold* — the token count at which the gate trips. The current ~500-token threshold balances summarization overhead against narrative coherence. A seed running shorter, sharper exchanges may want to trip at 250 tokens; a seed running longer interactions (chemical-engineering reviews, legal-citation walks) may comfortably stretch to 1,000. *[ref: summary-threshold-config | .claude/plugins/interaction_summary/config.conf:8 | `SUMMARY_THRESHOLD_TOKENS=500` — single knob, lives in config.conf, no code change to retune.]*

You would re-shape the *5-section template*. The current sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — encode what *this* prototype values in cross-session memory. Your seed will value different things. A research seed may want "Sources cited / Hypotheses tested / Open questions" sections. A consulting seed may want "Client goals / Constraints surfaced / Action items." A legal-research seed may want "Statutes referenced / Precedents reviewed / Open conflicts." The five sections aren't gospel. The shape — required headers, word-count band per section, append-only chain — is.

You would extend the *bypass-prefix list*. The current escape hatch lets `[PLUGIN-LOCK]` and `[JOB-COMPLETE]` through so the agent doesn't deadlock asking permission for the very thing the guard demands. Your seed will add new prefixed ceremonies; each one needs an explicit decision: does this prefix bypass the summarization gate, or is summarization a prerequisite even for *this* asking? Most architects forget this choice until a real deadlock teaches them.

You would change the *summarization shape itself*. The current shape is append-only chain — one block of five sections per crossing, accumulated forever. Hierarchical summaries (summary-of-summaries every N entries), topic-tagged summaries (separate chains for separate concerns), or domain-specific summary schemas (Q&A pair structure for support seeds, decision-log structure for governance seeds) are all defensible shapes for the same architectural fact: *long jobs need legible cross-session memory*. The chain mechanism is the architecture; what you put in each entry is yours.

What you would **not** do is let the mega-prompt grow without compression. Without the gate, a job that crosses ten cycles becomes unreadable; the next session loses the narrative thread; the agent starts drifting from prior decisions. The gate is the floor; the format above it is yours.

---

The next part covers the plugin that gates every question the seed agent asks the user — the asking surface for every ceremony in the rest of the architecture.

---

*Essay 5.5 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.4 — Job Lifecycle (`job_core`)](05_4-job-core.html) — the unit of compartmentalization and the dynamic mega-prompt.*
*Next: [Essay 5.6 — Structured Questions (`question_discipline`)](05_6-question-discipline.html) — the registered-prefix gate that powers every ceremony.*
