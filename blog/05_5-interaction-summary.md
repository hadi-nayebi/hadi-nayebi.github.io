---
title: "Cross-Session Memory — interaction_summary"
date: "May 2026"
slug: "interaction-summary"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.5.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# Cross-Session Memory — `interaction_summary`

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

---

[Essay 5.4](05_4-job-core.html) named the cumulative mega-prompt — every prompt, every Q&A, appended into the same job's interaction list. That list grows. Past a few hundred turns, it stops fitting cleanly in context. This part covers the plugin that keeps it legible.

---

## What it owns

`interaction_summary` exists to keep a job's dynamic mega-prompt legible as it grows. It works by counting tokens after every user interaction and forcing the agent to draft a structured summary the moment the unsummarized portion crosses a threshold. It applies inside any job whose interaction list grows long enough to compress — short jobs that never cross the threshold never see the plugin engage. *[ref: interaction-summary-exists-to-keep | .claude/plugins/interaction_summary/CLAUDE.md:38-49 | Trigger Mechanism: "Threshold: ~500 tokens. After each interaction is captured by job_core's question-capture: Count tokens in unsummarized interactions (word_count × 1.3)... If ≥ threshold → inject summarization request." Fires on PostToolUse:AskUserQuestion.]*

## How it works — block until summarized

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/interaction-summary-b5-5.png
  Concept: Chalk-on-blackboard cross-section — a token meter inside a job crosses a threshold and flips a flag; on the next tool call a guard blocks every productive tool while bypass-prefixed questions flow through a small escape hatch.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the token meter, green for the threshold line, orange for the summary_needed flag, pink for the blocked-tool tiles, magenta for the bypass-prefix arrow);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Left side — a vertical chalk bar (cyan fill) labeled IN WHITE CHALK exactly: "unsummarized tokens". A green-chalk dashed horizontal line crosses the bar near the top, labeled exactly: "threshold". A small white-chalk arrow exits the bar's top, points right, and lands on a small chalk box (orange fill) labeled exactly: "summary_needed".
  Right side — a larger chalk box outlined in white chalk labeled at the top exactly: "summary-guard". Inside the guard box, a 2x2 grid of small chalk tiles (pink fill) each crossed out with a white-chalk X, labeled IN WHITE CHALK exactly: "Bash", "Edit", "Write", "AskUserQuestion".
  Below the guard box, a single white-chalk arrow (magenta-tinted) flows AROUND the guard from left to right through a small gap labeled exactly: "BYPASS_PREFIXES". The arrow's tail starts at a small chalk tag labeled exactly: "[PLUGIN-LOCK]" and its head exits the right edge of the frame.
  A white-chalk arrow from "summary_needed" enters the top of the "summary-guard" box, showing the flag turning the guard on.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "unsummarized tokens", "threshold", "summary_needed", "summary-guard", "Bash", "Edit", "Write", "AskUserQuestion", "BYPASS_PREFIXES", "[PLUGIN-LOCK]", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.5. Cross the threshold, the flag flips, the guard blocks every productive tool — except infrastructure-prefixed questions, which slip through so the agent never deadlocks."
-->

Enforcement runs in two phases. A post-call hook fires right after `job_core` records each interaction, approximates the unsummarized portion in tokens, and trips a flag when the result crosses a threshold. On the next tool call, a pre-call guard blocks every productive tool the agent has — reads, writes, shell calls, even further questions — until a structured summary lands. The submit command refuses just any text: the summary must sit inside a tight word-count band and carry five named sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — each long enough to actually mean something. The same *shape compels production* trick `brain_guard` uses on `/compact`, applied to a different concern.

The block has one deliberate escape hatch — even with the productive-tool guard tripped, a small set of infrastructure-prefixed questions (`[PLUGIN-LOCK]`, `[JOB-COMPLETE]`, and a handful of other ceremonial asks) still pass through, so the agent cannot get into a deadlock where it needs to ask for permission to do the very thing the guard is asking for. The bypass list overlaps with but is not identical to the question_discipline registry — a deliberate trim, since some registered prefixes shouldn't slip past summary enforcement. The summary chain is append-only and lives entirely in the plugin's hidden state; older entries cannot be rewritten. *[ref: enforcement-runs-in-two-phases | .claude/plugins/interaction_summary/scripts/summary.sh:230-236 + .claude/plugins/lib/prefix-registry.conf:20 | `REQUIRED_SECTIONS` array names exactly five: "User Requests", "Questions & Decisions", "Design Choices", "Corrections & Feedback", "Current State." Append-only chain: `.summary_chain += [...]` at line 276. Pre-call gate at summary-guard.sh:131-141 reads `BYPASS_PREFIXES` from prefix-registry.conf:20: `PLUGIN-LOCK|TEST-LOCK|POINT-BOOST|GMODE|JOB-COMPLETE|PLAN-APPROVAL|YAML-APPROVAL|WAITING|PENDING-JOB|JOB-APPROVE-CREATION`. The question_discipline registry holds ten distinct entries — `PENDING-JOB` is bypassed but not registered; `REPORT-TO-UPSTREAM` is registered but not bypassed.]*

## What would break without it

Without this plugin, long jobs lose narrative coherence as the interaction list bloats; the summary chain is what keeps a job legible at a glance and what survives forward when the job spans more than one OPEVC cycle. *[ref: without-interaction-summary-long-jobs | .claude/plugins/interaction_summary/CLAUDE.md:15-17 | Objective: "Maintain a continuous summary chain from user interactions. When unsummarized interactions exceed a token threshold, block all work until the agent produces a summary that carries forward essential context." Chain persists keyed by job ID across cycles.]*

## What you would customize

`interaction_summary` is the second always-on plugin where the *shape* is the lesson and the names are your prototype's answer. Almost every parameter has a defensible reason to move.

You would tune the *threshold* — the token count at which the gate trips. The current ~500-token threshold balances summarization overhead against narrative coherence. A seed running shorter, sharper exchanges may want to trip at 250 tokens; a seed running longer interactions (chemical-engineering reviews, legal-citation walks) may comfortably stretch to 1,000. *[ref: summary-threshold-config | .claude/plugins/interaction_summary/config.conf:8 | `SUMMARY_THRESHOLD_TOKENS=500` — single knob, lives in config.conf, no code change to retune.]*

You would re-shape the *5-section template*. The current sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — encode what *this* prototype values in cross-session memory. Your seed will value different things. A research seed may want "Sources cited / Hypotheses tested / Open questions" sections. A consulting seed may want "Client goals / Constraints surfaced / Action items." A legal-research seed may want "Statutes referenced / Precedents reviewed / Open conflicts." The five sections aren't gospel. The shape — required headers, word-count band per section, append-only chain — is.

You would extend the *bypass-prefix list*. The current escape hatch lets the infrastructure-prefixed asks through — `[PLUGIN-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, and a handful of others on the bypass list — so the agent doesn't deadlock asking permission for the very thing the gate demands. The bypass list is its own ten-entry set, not identical to the question_discipline registry: each new prefix needs an explicit decision in BOTH lists — does this prefix get registered as a legal asking shape, and (separately) does it bypass the summarization gate, or is summarization a prerequisite even for *this* asking? The list lives at one regex line in `lib/prefix-registry.conf` — the architect edits it to admit or refuse each new ceremony. *[ref: bypass-prefix-list | .claude/plugins/lib/prefix-registry.conf:20 + .claude/plugins/interaction_summary/hooks/summary-guard.sh:131-141 | `BYPASS_PREFIXES` is a 10-entry regex string sourced by five guards (`plan-guard`, `verify-guard`, `observe-guard`, `execute-guard`, `summary-guard`): `PLUGIN-LOCK|TEST-LOCK|POINT-BOOST|GMODE|JOB-COMPLETE|PLAN-APPROVAL|YAML-APPROVAL|WAITING|PENDING-JOB|JOB-APPROVE-CREATION`. summary-guard.sh:131-135 comment names the deadlock rationale verbatim: "Blocking them would trap the user inside the summary block with no escape hatch." Adding a prefix to the bypass list is a one-line conf edit; no code change required.]*

You would change the *summarization shape itself*. The current shape is append-only chain — one block of five sections per crossing, accumulated forever. Hierarchical summaries (summary-of-summaries every N entries), topic-tagged summaries (separate chains for separate concerns), or domain-specific summary schemas (Q&A pair structure for support seeds, decision-log structure for governance seeds) are all defensible shapes for the same architectural fact: *long jobs need legible cross-session memory*. The chain mechanism is the architecture; what you put in each entry is yours.

What you would **not** do is let the mega-prompt grow without compression. Without the gate, a job that crosses ten cycles becomes unreadable; the next session loses the narrative thread; the agent starts drifting from prior decisions. The gate is the floor; the format above it is yours.

---

The next part covers the plugin that gates every question the seed agent asks the user — the asking surface for every ceremony in the rest of the architecture.

---

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

*Previous: [Essay 5.4 — Job Lifecycle (`job_core`)](05_4-job-core.html) — the unit of compartmentalization and the dynamic mega-prompt.*
*Next: [Essay 5.6 — Structured Questions (`question_discipline`)](05_6-question-discipline.html) — the registered-prefix gate that powers every ceremony.*
