---
title: "Structured Questions — question_discipline"
date: "May 2026"
slug: "question-discipline"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.3.0
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

A pre-call hook walks every question in the call and matches its first token against a small registry of approved prefixes hardcoded in the script. The registry currently holds ten entries — nine name very specific ceremonies (unlocking a plugin, approving a job, approving a plan stage, reporting upstream, authorizing a plugin-editing job at creation, and the others), and one (`[WAITING]`) is the deliberate generic — a catch-all for the cases where the seed agent legitimately needs input from the user and the situation does not fit one of the structured ceremonies. The prefixes cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no hidden state; the registry is its only state. *[ref: pre-call-hook-walks-questions | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:101-132 | Batch-cascade: comment "defense against multi-question batches sneaking unprefixed past. Validate ALL, not just [0]." `for ((i = 0; i < QCOUNT; i++))` iterates every question, sets `all_ok=0` on any failure; line 132 `if [[ "$all_ok" -eq 0 ]]` rejects entire batch.]*

Dispatched subagents are flagged as such and bypass the gate so they can ask their own internal questions without the user-facing prefix overhead. The bypass is the one runtime exception the registry admits — every other ask the seed agent makes of the user must clear a prefix.

## How shape compels cognition — per-prefix admission gates

Past the registry gate, every admitted prefix lands in its owner plugin's per-prefix handler — and that handler is where the shape lives. Each handler demands a different slot-set the seed agent must fill before the question reaches the user. `[JOB-COMPLETE]` checks four slots: the focused job's name in the body, the literal `Review` option label, the literal `Approve completion` option label, and a ≥100-word body. The plan-approval pair (`[PLAN-APPROVAL]`, `[YAML-APPROVAL]`) check six slots, including phase-of-firing (only VERIFY can ask) and a `plan_state` stage match. `[PLUGIN-LOCK]` and `[TEST-LOCK]` check a ≥100-word body plus a plugin-name or filename regex on the header. `[GMODE]` checks a ≥100-word body plus the `[GMODE] <reason>` format. *[ref: per-prefix-shape-gates | .claude/plugins/job_core/hooks/question-capture.sh:85-203 + .claude/plugins/plugin_integrity/hooks/lock-manager.sh:184-200,400-420 + .claude/plugins/phasic_system/hooks/gmode-gate.sh:69-83 | `[JOB-COMPLETE]` (capture.sh:85-131): 4 slots — name-in-text, Review option, Approve completion option, ≥100-word body. `[PLAN-APPROVAL]`/`[YAML-APPROVAL]` (capture.sh:137-203): 6 slots — phase=verify, plan_state stage, plan_file name in body, Approve label, Review label, ≥100-word body. `[PLUGIN-LOCK]`/`[TEST-LOCK]` (lock-manager.sh): ≥100-word body + name regex. `[GMODE]` (gmode-gate.sh): ≥100-word body + format. Two prefixes (`[REPORT-TO-UPSTREAM]`, `[JOB-APPROVE-CREATION]`) have only PostToolUse handlers — no Pre-side body shape today.]*

The shape IS the cognition — filling each slot is structured reasoning the gate forces before the user is asked. The seed agent cannot ask `[JOB-COMPLETE]` without first writing a hundred words reviewing the job; it cannot ask `[PLAN-APPROVAL]` without naming the plan file and being in VERIFY; it cannot ask `[GMODE]` without justifying the maintenance the mode opens. The slot-set IS the agent's compelled think-through. Each handler is a tiny stencil; what makes it work is that the agent has to fill it before the question can land.

Coverage is uneven by design. The ceremonies whose answer drives state changes — completion, plan-stage approval, plugin unlock — carry the heaviest slot enforcement. The lighter prefixes (`[POINT-BOOST]`, `[WAITING]`) check format and admit. Two surfaces (`[REPORT-TO-UPSTREAM]`, `[JOB-APPROVE-CREATION]`) capture the user's answer after it lands — admission shape lives on the answer side, not the question side. Whether to extend section-header shape (`WHY:` / `HOW:` / `BEFORE:` / `AFTER:` parsed from the body) to every prefix is the next maturation question — measure where word-floor falls short before hardening the registry into stencils.

Shape lives on both sides — the question body and the option labels — and the design that closes the coverage gap is to give every prefix a body section-set that names what the question is FOR, plus an option-label set that names what the user is choosing between. `[WAITING]` is the test case for the body side. Today it admits any non-empty reason after the prefix; the next iteration would carry two required body sections — the actual question, and a justification block explaining why this needs user input and isn't a decision the seed agent should make alone. The shape block becomes the seed's own self-check: if it can't write the justification, it doesn't ask the question. The gate stops being a registry-membership filter and starts being a low-value-question filter — the agent reasons about whether the ask is worth the user's attention BEFORE making it.

The same discipline generalizes to every prefix; each body shape names what the question is about, which forces the seed to decide what it's about to do BEFORE handing the choice to the user. The coverage gap closes when every prefix carries a shape rich enough that filling it is the thinking — and the registry stops being a membership filter, becomes a slot-cognition filter that turns each ask into a deliberate, structured move.

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/question-shapes-compel-production-b5-6.png
  Concept: Chalk-on-blackboard cross-section showing three prefix templates side by side, each a labeled stencil with named empty slots the seed agent must fill before the question can be asked. The shape compels the structured thinking.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for tile borders, light green where a slot is conceptually being filled in the demo, white chalk for all labels, slot names, arrows);
  chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, paths, or slot names.
  Layout: Three vertical tiles span the board left-to-right, each outlined in white chalk with a cyan border tint.
  Tile 1 (left) — header at the top in white chalk: "[PLUGIN-LOCK]". Below the header, four labeled slots stacked vertically with dashed white-chalk underlines below each label (the empty fill area): "WHY", "HOW", "BEFORE", "AFTER".
  Tile 2 (center) — header: "[GMODE]". Three labeled slots: "ISSUE", "WHAT TRIED", "WHY GMODE".
  Tile 3 (right) — header: "[JOB-COMPLETE]". Three labeled slots: "WHAT WAS DONE", "DECISIONS", "CURRENT STATE".
  Above the three tiles, a single white-chalk arrow points downward into each tile labeled in white chalk: "agent fills before asking".
  Light-green chalk partially fills 1-2 slots per tile (suggesting the agent has begun filling — partial completion), with the remaining slots blank.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "[PLUGIN-LOCK]", "[GMODE]", "[JOB-COMPLETE]", "WHY", "HOW", "BEFORE", "AFTER", "ISSUE", "WHAT TRIED", "WHY GMODE", "WHAT WAS DONE", "DECISIONS", "CURRENT STATE", "agent fills before asking", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.6. Every prefix is a stencil — filling the slots IS the structured thinking the gate compels."
-->

## What would break without it

Without `question_discipline`, every `AskUserQuestion` is fair game — the agent's asking surface bloats with low-value confirmations, and the structured ceremonies (locks, approvals, plan-complete claims) lose the prefix scaffolding the rest of the always-on layer uses to dispatch on. *[ref: without-question-discipline-asking | .claude/plugins/question_discipline/CLAUDE.md:6 | Objective: "Block any `AskUserQuestion` whose every question's text does not begin with a registered prefix. Forces every interactive question through the established prefix system... instead of casual proceed/pause/continue prompts." Without this gate every ask passes unchecked.]*

## What you would customize

`question_discipline` is the smallest plugin in the always-on layer but the most *catalytic* — every new ceremony in the rest of your seed needs an entry here.

You would *extend the registry*. The current ten entries are this prototype's catalog of structured-asking situations. Your seed will need its own — a research seed may want `[CITATION-CHECK]` for verifying a quoted source; a consulting seed may want `[CLIENT-APPROVAL]` for the equivalent of plan-stage approval. Each new entry pairs with: a per-prefix handler in the plugin that owns the ceremony, a voice for failure messages, the slot-set the handler demands (see *How shape compels cognition* above — word-floor, named-token requirements, option-label requirements, phase or state matches), and a clear semantic — what *kind* of question this prefix marks. Names are cheap; the discipline is in keeping each prefix narrow and orthogonal — and in making the slot-set rich enough that filling it IS structured thinking.

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
