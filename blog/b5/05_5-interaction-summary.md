---
title: "Mega-Prompt Compression — interaction_summary"
date: "May 18, 2026"
slug: "interaction-summary"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: published
version: v0.6.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Mega-Prompt Compression — `interaction_summary`

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

---

[Essay 5.4](05_4-job-core.html) named the cumulative mega-prompt — every prompt, every Q&A, appended into the same job's interaction list. As its unsummarized portion grows, it becomes harder to fit cleanly in context. This part covers the plugin that keeps it legible.

The concrete mechanics below come from an earlier Claude-based prototype, used here as a historical reference architecture. The broader compression pattern applies to long-running work across CLI agent frameworks.

---

## What it owns

`interaction_summary` exists to keep a job's dynamic mega-prompt legible as it grows. It works by estimating tokens at configured interaction checkpoints and forcing the agent to draft a structured summary when the unsummarized portion crosses a threshold. It applies inside any job whose interaction list grows long enough to compress — short jobs that never cross the threshold never see the plugin engage. *[ref: interaction-summary-exists-to-keep | Checked against a private historical prototype.]*

## How it works — block until summarized

<!-- IMAGE PLACEHOLDER:
  ASSET: images/interaction-summary-b5-5.png
  Concept: Chalk-on-blackboard cross-section — a token meter inside a job crosses a threshold and flips a flag; on the next tool call a guard blocks every productive tool; the only path that clears the block is the dedicated `summary.sh submit` command, which the guard's Bash whitelist explicitly admits.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the token meter, green for the threshold line, orange for the summary_needed flag, pink for the blocked-tool tiles, magenta for the submit-command escape arrow);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Left side — a vertical chalk bar (cyan fill) labeled IN WHITE CHALK exactly: "unsummarized tokens". A green-chalk dashed horizontal line crosses the bar near the top, labeled exactly: "threshold". A small white-chalk arrow exits the bar's top, points right, and lands on a small chalk box (orange fill) labeled exactly: "summary_needed".
  Right side — a larger chalk box outlined in white chalk labeled at the top exactly: "summary-guard". Inside the guard box, a 2x2 grid of small chalk tiles (pink fill) each crossed out with a white-chalk X, labeled IN WHITE CHALK exactly: "Bash", "Edit", "Write", "AskUserQuestion".
  Below the guard box, a single white-chalk arrow (magenta-tinted) flows from left into the guard's bottom edge through a small explicit gap labeled exactly: "summary.sh submit". The arrow's head lands inside the guard box and erases the orange "summary_needed" flag (drawn as the flag with a chalk X struck through it), showing that submitting the summary clears the gate.
  A white-chalk arrow from "summary_needed" enters the top of the "summary-guard" box, showing the flag turning the guard on.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "unsummarized tokens", "threshold", "summary_needed", "summary-guard", "Bash", "Edit", "Write", "AskUserQuestion", "summary.sh submit".
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.5. Cross the threshold, the flag flips, the guard blocks every productive tool — the only path that clears the block is `summary.sh submit`, which the guard's Bash whitelist explicitly admits."
-->

Enforcement runs in two phases. A post-call hook fires after a configured question-and-answer capture, approximates the unsummarized portion in tokens, and trips a flag when the result crosses a threshold. On the next tool call, a pre-call guard blocks every productive tool the agent has — reads, writes, shell calls, even further questions — until a structured summary lands. The submit command does not accept just any text: the summary must sit inside a tight token-count band and carry five named sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — each long enough to actually mean something. The same *shape compels production* trick `brain_guard` uses on its compaction file, applied to a different concern. *[ref: two-phase-enforcement-post-then-pre | Checked against a private historical prototype.]*

The block is total — every productive tool, every question. The single path that clears it is `summary.sh submit`, the dedicated summary-submission command the guard's Bash whitelist explicitly admits; submitting a valid summary clears the flag, the gate releases, and any pending work resumes on the next turn. No parallel question-bypass list, no special-case prefixes — the discipline is one shape: submit the summary, then continue. The summary chain itself is append-only and lives entirely in the plugin's hidden state; its submission path does not rewrite older entries. *[ref: enforcement-runs-in-two-phases | Checked against a private historical prototype.]*

## What would break without it

Without this plugin, long jobs can lose narrative coherence as the interaction list grows; the summary chain is what keeps a job legible at a glance and what survives forward when the job spans more than one OPEVC cycle. *[ref: without-interaction-summary-long-jobs | Checked against a private historical prototype.]*

## What you would customize

`interaction_summary` is the second always-on plugin where the *shape* is the lesson and the names are the historical reference implementation's answer. Almost every parameter has a defensible reason to move.

You would tune the *threshold* — the token count at which the gate trips. The historical reference implementation defaults to roughly 500 tokens, balancing summarization overhead against narrative coherence. A seed running shorter, sharper exchanges may want to trip at 250 tokens; a seed running longer interactions (chemical-engineering reviews, legal-citation walks) may comfortably stretch to 1,000. *[ref: summary-threshold-config | Checked against a private historical prototype.]*

You would re-shape the *5-section template*. The reference implementation's sections — User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State — encode what that implementation values in its summary chain. Your seed will value different things. A research seed may want "Sources cited / Hypotheses tested / Open questions" sections. A consulting seed may want "Client goals / Constraints surfaced / Action items." A legal-research seed may want "Statutes referenced / Precedents reviewed / Open conflicts." The five sections aren't gospel. The shape — required headers, a token-depth floor per section, and an append-only chain — is. *[ref: five-section-template-source | Checked against a private historical prototype.]*

You would tune the *summary length band* and the *per-section depth floor*. The historical reference implementation requires every accepted summary to land inside a token range (roughly 200–1,000 tokens by default) and every named section to carry a substantive minimum of real content. A seed running shallow exchanges may want a tighter band and lower per-section floors so summaries stay brisk. A seed running deep technical reviews — chemical-engineering walkthroughs, legal-citation traces — may want a wider band and higher per-section floors that prevent stub sections from sliding through. All three knobs live in `config.conf` as plain shell variables; the architect tunes per seed without touching any hook or script. *[ref: summary-length-knobs | Checked against a private historical prototype.]*

You would change the *summarization shape itself*. The reference implementation uses an append-only chain — one block of five sections per crossing, accumulated forever. Hierarchical summaries (summary-of-summaries every N entries), topic-tagged summaries (separate chains for separate concerns), or domain-specific summary schemas (Q&A pair structure for support seeds, decision-log structure for governance seeds) are all defensible shapes for the same architectural fact: *long jobs need legible mega-prompt compression*. The chain mechanism is the architecture; what you put in each entry is yours. *[ref: append-only-chain-shape | Checked against a private historical prototype.]*

What you would **not** do is let the mega-prompt grow without compression. Without the gate, a job that spans many cycles can become difficult to reconstruct; later sessions may lose the narrative thread and drift from prior decisions. *[ref: interaction-summary-compression-gate | Checked against a private historical prototype.]* The gate is the floor; the format above it is yours.

---

The next part covers the plugin that gates every question the seed agent asks the user — the asking surface for every ceremony in the rest of the architecture.

---

*Essay 5.5 — The Always-On Digital Cortex, Part 5 of 9.*

*Previous: [Essay 5.4 — Job Lifecycle — `job_core`](05_4-job-core.html) — the unit of compartmentalization and the dynamic mega-prompt.*
*Next: [Essay 5.6 — Structured Questions — `question_discipline`](05_6-question-discipline.html) — the registered-prefix gate that powers every ceremony.*
