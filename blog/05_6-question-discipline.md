---
title: "Structured Questions — question_discipline"
date: "May 2026"
slug: "question-discipline"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# Structured Questions — `question_discipline`

*Essay 5.6 of 9 — The Always-On Digital Cortex.*

---

[Essay 5.5](05_5-interaction-summary.html) covered the mega-prompt that grows with every question. This part covers the gate that grew the *asking surface* itself into something architectural — every question the seed agent asks the user carries a registered prefix, and the rest of the seed's machinery dispatches on those prefixes.

---

## What it owns

`question_discipline` exists to make every question the seed agent asks the user *structured*. It works by gating every `AskUserQuestion` call against a small list of registered prefixes — only ceremonial questions (locks, approvals, plan-complete claims) get through. It applies on every `AskUserQuestion`, with one deliberate runtime exception for dispatched subagents. *[ref: question-discipline-exists-to-make | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:45-74 | Subagent bypass at line 47: `[[ "${CLAUDE_SUBAGENT:-}" == "true" ]] && exit 0`. `PREFIX_REGISTRY` (lines 66-74) enumerates 9 ceremonial prefixes (post A11.5 + A11.6 additions): `[PLUGIN-LOCK]`, `[TEST-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, `[PLAN-APPROVAL]`, `[YAML-APPROVAL]`, `[POINT-BOOST]`, `[WAITING]`, `[REPORT-TO-UPSTREAM]`. (The original cycle-1 list of 7 had `[PLAN-COMPLETE]`; that single prefix split into the separate `[PLAN-APPROVAL]` + `[YAML-APPROVAL]` gates during the plan-state-machine work.)]*

## How it works — batch-cascade against the registry

A pre-call hook walks every question in the call and matches its first token against a small registry of approved prefixes hardcoded in the script. The registry currently holds nine entries — eight name very specific ceremonies (unlocking a plugin, approving a job, approving a plan stage, reporting upstream, and so on), and one (`[WAITING]`) is the deliberate generic — a catch-all for the cases where the seed agent legitimately needs input from the user and the situation does not fit one of the structured ceremonies. The prefixes cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no hidden state; the registry is its only state. Dispatched subagents are flagged as such and bypass the gate so they can ask their own internal questions without the user-facing prefix overhead. *[ref: pre-call-hook-walks-questions | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:101-132 | Batch-cascade: comment "defense against multi-question batches sneaking unprefixed past. Validate ALL, not just [0]." `for ((i = 0; i < QCOUNT; i++))` iterates every question, sets `all_ok=0` on any failure; line 132 `if [[ "$all_ok" -eq 0 ]]` rejects entire batch.]*

## What would break without it

Without `question_discipline`, every `AskUserQuestion` is fair game — the agent's asking surface bloats with low-value confirmations, and the structured ceremonies (locks, approvals, plan-complete claims) lose the prefix scaffolding the rest of the always-on layer uses to dispatch on. *[ref: without-question-discipline-asking | .claude/plugins/question_discipline/CLAUDE.md:6 | Objective: "Block any `AskUserQuestion` whose every question's text does not begin with a registered prefix. Forces every interactive question through the established prefix system... instead of casual proceed/pause/continue prompts." Without this gate every ask passes unchecked.]*

## What you would customize

`question_discipline` is the smallest plugin in the always-on layer but the most *catalytic* — every new ceremony in the rest of your seed needs an entry here.

You would *extend the registry*. The current nine entries are this prototype's catalog of structured-asking situations. Your seed will need its own — a research seed may want `[CITATION-CHECK]` for verifying a quoted source; a consulting seed may want `[CLIENT-APPROVAL]` for the equivalent of plan-stage approval. Each new entry pairs with: a Post handler in the plugin that owns the ceremony, a voice for failure messages, a word-floor and format constraint at the gate, and a clear semantic — what *kind* of question this prefix marks. Names are cheap; the discipline is in keeping each prefix narrow and orthogonal to the others.

You would tune the *batch-cascade strictness*. The current shape rejects the entire batch on any unprefixed question. A more lenient shape might accept partial batches (process the prefixed questions, drop the unprefixed). A stricter shape might require *the same* prefix across all questions in a batch (preventing prefix mixing). The cascade is the discipline; the exact rule is yours.

You would re-think the *subagent bypass*. The current prototype lets dispatched subagents bypass the gate so they can ask their own internal questions without prefix overhead. Your architecture may prefer to extend the same discipline downward — every subagent question also carries a prefix, every ceremony reaches recursively. The trade-off: more discipline but more ceremony in subagent dispatch.

You would add the `[WAITING]` *escape valve or remove it*. The current prototype keeps `[WAITING]` as a deliberate generic for situations that don't fit a structured ceremony. Your seed may decide that the escape valve is a leak — and every question must fit one of the named ceremonies. Tightening the registry tightens the architecture; loosening it eases day-to-day work. Both are defensible.

What you would **not** do is leave the gate off. Without it, the asking surface bloats with casual "proceed/pause/continue" confirmations, and the rest of the always-on layer's prefix-dispatched ceremonies (PLUGIN-LOCK, JOB-COMPLETE, PLAN-APPROVAL) lose the scaffolding they hang on.

---

That closes the tour of the five always-on plugins. The next part covers the *substrate* underneath them — the CLAUDE.md hierarchy that the phasic layer uses as its working medium, with one specific intersection point where the always-on layer touches the substrate directly.

---

*Essay 5.6 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.5 — Cross-Session Memory (`interaction_summary`)](05_5-interaction-summary.html) — block-until-summarized.*
*Next: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — working memory bus, footer protocol, altered list.*
