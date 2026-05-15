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

`question_discipline` exists to make every question the seed agent asks the user *structured*. It works by gating every `AskUserQuestion` call against a small list of registered prefixes — only ceremonial questions (locks, approvals, plan-complete claims) get through. It applies on every `AskUserQuestion`, with one deliberate runtime exception for dispatched subagents. *[ref: question-discipline-exists-to-make | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:45-77 | Subagent bypass at line 47: `[[ "${CLAUDE_SUBAGENT:-}" == "true" ]] && exit 0`. `PREFIX_REGISTRY` (lines 66-77) enumerates 10 ceremonial prefixes: `[PLUGIN-LOCK]`, `[TEST-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, `[PLAN-APPROVAL]`, `[YAML-APPROVAL]`, `[POINT-BOOST]`, `[WAITING]`, `[REPORT-TO-UPSTREAM]`, `[JOB-APPROVE-CREATION]`. (The original cycle-1 list of 7 had `[PLAN-COMPLETE]`; that single prefix split into the separate `[PLAN-APPROVAL]` + `[YAML-APPROVAL]` gates during the plan-state-machine work. The tenth, `[JOB-APPROVE-CREATION]`, was added 2026-05-14 as part of A14 — see Essay 5.9 for the gate it powers.)]*

## How it works — batch-cascade against the registry

A pre-call hook walks every question in the call and matches its first token against a small registry of approved prefixes hardcoded in the script. The registry currently holds ten entries — nine name very specific ceremonies (unlocking a plugin, approving a job, approving a plan stage, reporting upstream, authorizing a plugin-editing job at creation, and so on), and one (`[WAITING]`) is the deliberate generic — a catch-all for the cases where the seed agent legitimately needs input from the user and the situation does not fit one of the structured ceremonies. The prefixes cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no hidden state; the registry is its only state. Dispatched subagents are flagged as such and bypass the gate so they can ask their own internal questions without the user-facing prefix overhead. *[ref: pre-call-hook-walks-questions | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:101-132 | Batch-cascade: comment "defense against multi-question batches sneaking unprefixed past. Validate ALL, not just [0]." `for ((i = 0; i < QCOUNT; i++))` iterates every question, sets `all_ok=0` on any failure; line 132 `if [[ "$all_ok" -eq 0 ]]` rejects entire batch.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard cross-section — an AskUserQuestion call carries three question prefixes; the gate matches each against a ten-entry registry; one prefix has no match, and the entire batch is rejected as a cascade.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the registry column, green for matched prefixes, orange for the AskUserQuestion call box, pink for the unmatched prefix tile, magenta for the REJECTED stamp);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Left side — a tall chalk column outlined in white chalk (no top label; the column shape itself reads as the batched call). Inside the column, three small chalk tiles stacked vertically, each holding one prefix label IN WHITE CHALK exactly: "[PLUGIN-LOCK]" (green fill), "[JOB-COMPLETE]" (green fill), "[PROCEED]" (pink fill, with a hand-drawn white-chalk X across it).
  Right side — a vertical chalk column (cyan fill) outlined in white chalk, listing the ten registered prefixes IN WHITE CHALK exactly, top to bottom: "[PLUGIN-LOCK]", "[TEST-LOCK]", "[GMODE]", "[JOB-COMPLETE]", "[PLAN-APPROVAL]", "[YAML-APPROVAL]", "[POINT-BOOST]", "[WAITING]", "[REPORT-TO-UPSTREAM]", "[JOB-APPROVE-CREATION]".
  White-chalk arrows from the first two left-column tiles point right and land cleanly on the matching entries in the registry column. A third white-chalk arrow from the "[PROCEED]" tile points right toward the registry and ends in a hand-drawn dead-end mark (small chalk wall, no match).
  Beneath the whole scene, a large white-chalk stamp drawn in slightly imperfect hand-lettering labeled exactly: "REJECTED" (magenta-tinted outline) spans the bottom of the left column, indicating the entire batch fails because one prefix missed.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "[PLUGIN-LOCK]", "[TEST-LOCK]", "[GMODE]", "[JOB-COMPLETE]", "[PLAN-APPROVAL]", "[YAML-APPROVAL]", "[POINT-BOOST]", "[WAITING]", "[REPORT-TO-UPSTREAM]", "[JOB-APPROVE-CREATION]", "[PROCEED]", "REJECTED", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.6. Every question's first token must match the registry; one unregistered prefix in the batch and the whole call is rejected — the cascade is the discipline."
-->

## What would break without it

Without `question_discipline`, every `AskUserQuestion` is fair game — the agent's asking surface bloats with low-value confirmations, and the structured ceremonies (locks, approvals, plan-complete claims) lose the prefix scaffolding the rest of the always-on layer uses to dispatch on. *[ref: without-question-discipline-asking | .claude/plugins/question_discipline/CLAUDE.md:6 | Objective: "Block any `AskUserQuestion` whose every question's text does not begin with a registered prefix. Forces every interactive question through the established prefix system... instead of casual proceed/pause/continue prompts." Without this gate every ask passes unchecked.]*

## What you would customize

`question_discipline` is the smallest plugin in the always-on layer but the most *catalytic* — every new ceremony in the rest of your seed needs an entry here.

You would *extend the registry*. The current ten entries are this prototype's catalog of structured-asking situations. Your seed will need its own — a research seed may want `[CITATION-CHECK]` for verifying a quoted source; a consulting seed may want `[CLIENT-APPROVAL]` for the equivalent of plan-stage approval. Each new entry pairs with: a Post handler in the plugin that owns the ceremony, a voice for failure messages, a word-floor and format constraint at the gate, and a clear semantic — what *kind* of question this prefix marks. Names are cheap; the discipline is in keeping each prefix narrow and orthogonal to the others.

You would tune the *batch-cascade strictness*. The current shape rejects the entire batch on any unprefixed question. A more lenient shape might accept partial batches (process the prefixed questions, drop the unprefixed). A stricter shape might require *the same* prefix across all questions in a batch (preventing prefix mixing). The cascade is the discipline; the exact rule is yours.

You would re-think the *subagent bypass*. The current prototype lets dispatched subagents bypass the gate so they can ask their own internal questions without prefix overhead. Your architecture may prefer to extend the same discipline downward — every subagent question also carries a prefix, every ceremony reaches recursively. The trade-off: more discipline but more ceremony in subagent dispatch.

You would add the `[WAITING]` *escape valve or remove it*. The current prototype keeps `[WAITING]` as a deliberate generic for situations that don't fit a structured ceremony. Your seed may decide that the escape valve is a leak — and every question must fit one of the named ceremonies. Tightening the registry tightens the architecture; loosening it eases day-to-day work. Both are defensible.

What you would **not** do is leave the gate off. Without it, the asking surface bloats with casual "proceed/pause/continue" confirmations, and the rest of the always-on layer's prefix-dispatched ceremonies (PLUGIN-LOCK, JOB-COMPLETE, PLAN-APPROVAL) lose the scaffolding they hang on.

---

That closes the tour of the five always-on plugins. The next part covers one of the substrate forms underneath them — the **working-memory form**, the CLAUDE.md hierarchy that the phasic layer writes through. The substrate as a whole holds many forms; the CLAUDE.md hierarchy is the one with a structured-edit protocol the always-on layer touches directly.

---

*Essay 5.6 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.5 — Cross-Session Memory (`interaction_summary`)](05_5-interaction-summary.html) — block-until-summarized.*
*Next: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — working memory bus, footer protocol, altered list.*
