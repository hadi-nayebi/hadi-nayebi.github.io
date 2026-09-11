---
title: "Structured Questions — question_discipline"
date: "May 18, 2026"
slug: "question-discipline"
read_time: "8 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: published
version: v0.5.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Structured Questions — `question_discipline`

*Essay 5.6 — The Always-On Digital Cortex, Part 6 of 9.*

---

[Essay 5.5](05_5-interaction-summary.html) covered the mega-prompt that grows with every question. This part turns to a framework-generic problem: how can a CLI-agent harness make its *asking surface* explicit enough to inspect and govern? The historical Claude-based reference architecture examined in this series answered with a gate: every user-facing question carried a registered prefix, and the rest of the harness dispatched on those prefixes. *[ref: question-prefix-registry-dispatch | private historical prototype | implementation claim checked against a private historical prototype]*

---

## What it owns

In that reference architecture, `question_discipline` exists to make every question the seed agent asks the user *structured*. It works by gating each call to the CLI's user-question tool against a small list of registered prefixes — only registered question forms get through. Most registered forms are ceremonies (locks, approvals, completion claims), and `[WAITING]` is the deliberate generic escape valve. It applies on the main agent's user-facing question surface, with one deliberate runtime exception for dispatched subagents. *[ref: question-discipline-exists-to-make | private historical prototype | implementation claim checked against a private historical prototype]*

## How it works — batch-cascade against the registry

A pre-call hook walks every question in the call and matches its first token against a small registry of approved prefixes hardcoded in the script. The registry is short — most entries name very specific ceremonies (unlocking a plugin, approving a job, promoting a job to repeating, reporting upstream, authorizing a plugin-editing job at creation, and the others), and one (`[WAITING]`) is the deliberate generic — a catch-all for the cases where the seed agent legitimately needs input from the user and the situation does not fit one of the structured ceremonies. The prefixes cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no hidden state; the registry is its only state. *[ref: pre-call-hook-walks-questions | private historical prototype | implementation claim checked against a private historical prototype]*

Dispatched subagents present a non-`main` `agent_type` in the hook's stdin JSON payload, and the gate reads it and exits 0 before walking the registry — because a subagent is not supposed to become a second user-facing conversation surface. Their job is focused investigation; if they need user input, the cleaner pattern is to report the uncertainty back to the parent agent, which asks through the registered prefix system. The bypass is the one runtime exception the registry admits — every main-agent ask must clear a prefix, no matter which plugin's hook is firing or which phase the agent is in. This draws the boundary at the user-facing main-agent surface; extending the same discipline recursively into subagents is a customization choice, not the current prototype's default. *[ref: subagent-bypass-runtime-exception | private historical prototype | implementation claim checked against a private historical prototype]*

## How shape compels cognition — per-prefix admission gates

Past the registry gate, every admitted prefix lands in its owner plugin's per-prefix handler — and that handler is where the shape lives. Each handler demands a different slot-set the seed agent must fill before the question reaches the user. `[JOB-COMPLETE]` checks several slots: the focused job's name in the body, the literal `Review` option label, the literal `Approve completion` option label, and a ≥100-word body. `[JOB-APPROVE-CREATION]` — the ceremony that authorizes a plugin-touching job (Essay 5.9) — demands its own slot-set naming the proposed objective, the plugins to touch, why now, and the risk surface. `[PLUGIN-LOCK]` and `[TEST-LOCK]` check a ≥100-word body plus a plugin-name or filename regex on the header. `[GMODE]` checks a ≥100-word body plus the `[GMODE] <reason>` format. *[ref: per-prefix-shape-gates | private historical prototype | implementation claim checked against a private historical prototype]*

The shape IS the cognition — filling each slot is structured reasoning the gate forces before the user is asked. The seed agent cannot ask `[JOB-COMPLETE]` without first writing a substantial review block (the current prototype floors it at a hundred words); it cannot ask `[JOB-APPROVE-CREATION]` without naming the plugins the proposed job would touch and its risk surface; it cannot ask `[GMODE]` without justifying the maintenance the mode opens. The slot-set IS the agent's compelled think-through. Each handler is a tiny stencil; what makes it work is that the agent has to fill it before the question can land. *[ref: slot-set-is-compelled-thinking | private historical prototype | implementation claim checked against a private historical prototype]*

Coverage is uneven by design. The ceremonies whose answer drives state changes — job completion, plugin-touch authorization, plugin unlock — carry the heaviest slot enforcement. `[WAITING]` now rides a two-section body (`## QUESTION` + `## WHY NOT LOW VALUE`, ≥15 words each); only `[COMMAND-APPROVE]` carries no `##` section shape. Two surfaces (`[REPORT-TO-UPSTREAM]`, `[JOB-APPROVE-CREATION]`) also capture the user's answer after it lands; that answer-side capture is separate from question-side admission. Extending the per-prefix section shape (each ceremony's own named slots — `Plugin` / `Specific Changes` / `Why` / `Tests Will Run` for a plugin unlock, say) to every prefix has now largely happened — every registered prefix except `[COMMAND-APPROVE]` (deliberately shapeless) carries a body shape. *[ref: coverage-uneven-by-design | private historical prototype | implementation claim checked against a private historical prototype]*

Shape lives on both sides — the question body and the option labels — and the design that closes the coverage gap is to give every prefix a body section-set that names what the question is FOR, plus an option-label set that names what the user is choosing between. `[WAITING]` is the test case for the body side. The prototype now ships it: the shape gate requires two body sections — `## QUESTION` (the decision the seed needs) and `## WHY NOT LOW VALUE` (why this needs user input and isn't a call the seed agent should make alone), each at least fifteen words. The shape block IS the seed's own self-check: if it can't write the justification, it doesn't ask the question. The gate stops being a registry-membership filter and starts being a low-value-question filter — the agent reasons about whether the ask is worth the user's attention BEFORE making it. *[ref: waiting-current-vs-future-shape | private historical prototype | implementation claim checked against a private historical prototype]*

There is one more turn of this idea, and it belongs to the job rather than the prefix. The per-prefix catalog is fixed — every job's `[JOB-COMPLETE]` answers the same standard sections. But a long job often has its own evidence dimensions the standard sections don't capture. So beyond the catalog, a single job can carry its own **Extended shape**: a handful of extra `## ` sections with flexible, job-specific titles — `## Plugin Surfaces Touched This Run`, `## Visual-Asset Implications` — that this one job declares are part of what "done" means for it. The job names those sections early, while it is first loading context, and from then on they ride alongside the standard ones. When the final cycle's `[JOB-COMPLETE]` question fires, the completion check validates the standard sections *and* the job's own declared sections — all present, all filled — before the question can reach the user. *[ref: extended-shape-job-specific-addition | private historical prototype | implementation claim checked against a private historical prototype]*

The shape of the idea is clean, and the prototype ships it: the job field holds the declared section titles, a cycle-1 setter lets a job declare them, the cycle-1 OBSERVE advance checks the declared sections exist in the expanded objective, and the inheritance check folds them into the completion gate. Each job carries its own definition of finished evidence without ever touching the shared per-prefix catalog. The catalog stays the same for everyone; the job adds what only it cares about. *[ref: extended-shape-build-state | private historical prototype | implementation claim checked against a private historical prototype]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/question-shapes-compel-production-b5-6.png
  Concept: Chalk-on-blackboard cross-section showing three prefix templates side by side, each a labeled stencil with named empty slots the seed agent must fill before the question can be asked. The shape compels the structured thinking.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  limited palette — cyan tile borders, light green for slots being filled, white chalk for labels and arrows — not the full chalk palette (canonical 5 is cyan / green / orange / pink / magenta; this image deliberately uses only the first three for visual focus);
  chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, paths, or slot names.
  Layout: Three vertical tiles span the board left-to-right, each outlined in white chalk with a cyan border tint.
  Tile 1 (left) — header at the top in white chalk: "[PLUGIN-LOCK]". Below the header, four labeled slots stacked vertically with dashed white-chalk underlines below each label (the empty fill area): "PLUGIN", "SPECIFIC CHANGES", "WHY", "TESTS WILL RUN".
  Tile 2 (center) — header: "[GMODE]". Five labeled slots: "BLOCKER", "FIX", "WHY NOT IN-PHASE", "EXIT CRITERION", "RETURN NOTE".
  Tile 3 (right) — header: "[JOB-APPROVE-CREATION]". Four labeled slots: "PROPOSED OBJECTIVE", "PLUGINS TO TOUCH", "WHY NOW", "RISK SURFACE".
  Above the three tiles, a single white-chalk arrow points downward into each tile labeled in white chalk: "agent fills before asking".
  Light-green chalk partially fills 1-2 slots per tile (suggesting the agent has begun filling — partial completion), with the remaining slots blank.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "[PLUGIN-LOCK]", "[GMODE]", "[JOB-APPROVE-CREATION]", "PLUGIN", "SPECIFIC CHANGES", "WHY", "TESTS WILL RUN", "BLOCKER", "FIX", "WHY NOT IN-PHASE", "EXIT CRITERION", "RETURN NOTE", "PROPOSED OBJECTIVE", "PLUGINS TO TOUCH", "WHY NOW", "RISK SURFACE", "agent fills before asking".
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.6. Each ceremony is a stencil of named slots — filling them IS the structured thinking the gate compels before the question can land."
-->

## What would break without it

Without `question_discipline`, every use of the user-question tool is fair game — the agent's asking surface bloats with low-value confirmations, and the structured ceremonies (locks, approvals, completion claims) lose the prefix scaffolding the rest of the always-on layer uses to dispatch on. *[ref: without-question-discipline-asking | private historical prototype | implementation claim checked against a private historical prototype]*

## What you would customize

`question_discipline` has a small code footprint but a *catalytic* role — every new ceremony in the rest of your seed needs an entry here. *[ref: question-discipline-smallest-catalytic | private historical prototype | implementation claim checked against a private historical prototype]*

You would *extend the registry*. The current registry is this prototype's catalog of structured-asking situations. Your seed will need its own — a research seed may want `[CITATION-CHECK]` for verifying a quoted source; a consulting seed may want `[CLIENT-APPROVAL]` for the equivalent of a client sign-off on a deliverable. Each new entry pairs with: a per-prefix handler in the plugin that owns the ceremony, a voice for failure messages, the slot-set the handler demands (see *How shape compels cognition* above — word-floor, named-token requirements, option-label requirements, phase or state matches), and a clear semantic — what *kind* of question this prefix marks. Names are cheap; the discipline is in keeping each prefix narrow and orthogonal — and in making the slot-set rich enough that filling it IS structured thinking. *[ref: current-prefix-registry-entries | private historical prototype | implementation claim checked against a private historical prototype]*

You would tune the *batch-cascade strictness*. The current shape rejects the entire batch on any unprefixed question. A more lenient shape might accept partial batches (process the prefixed questions, drop the unprefixed). A stricter shape might require *the same* prefix across all questions in a batch (preventing prefix mixing). The cascade is the discipline; the exact rule is yours. *[ref: batch-cascade-current-rule | private historical prototype | implementation claim checked against a private historical prototype]*

You would re-think the *subagent bypass*. The current prototype lets dispatched subagents bypass the gate because they should not become a second user-facing question surface; uncertainty should route back to the parent agent, which asks through the prefix system. Your architecture may prefer to extend the same discipline downward — every subagent question also carries a prefix, every ceremony reaches recursively. The trade-off: more discipline but more ceremony in subagent dispatch. *[ref: subagent-bypass-customization-point | private historical prototype | implementation claim checked against a private historical prototype]*

You would add the `[WAITING]` *escape valve or remove it*. The current prototype keeps `[WAITING]` as a deliberate generic for situations that don't fit a structured ceremony. Your seed may decide that the escape valve is a leak — and every question must fit one of the named ceremonies. Tightening the registry tightens the architecture; loosening it eases day-to-day work. Both are defensible. *[ref: waiting-escape-valve-registry-entry | private historical prototype | implementation claim checked against a private historical prototype]*

What you would **not** do is leave the gate off. Without it, the asking surface bloats with casual "proceed/pause/continue" confirmations, and the rest of the always-on layer's prefix-dispatched ceremonies (PLUGIN-LOCK, JOB-COMPLETE, JOB-APPROVE-CREATION) lose the scaffolding they hang on.

---

That closes the tour of the always-on plugins. The next part covers one of the substrate forms underneath them — the **working-memory form**. In the historical reference architecture, that form is a CLAUDE.md hierarchy that the phasic layer writes through. The substrate as a whole holds many forms; this hierarchy is the one with a structured-edit protocol the always-on layer touches directly.

---

*Essay 5.6 — The Always-On Digital Cortex, Part 6 of 9.*

*Previous: [Essay 5.5 — Mega-Prompt Compression — `interaction_summary`](05_5-interaction-summary.html) — block-until-summarized.*
*Next: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — working memory bus, footer protocol, altered list.*
