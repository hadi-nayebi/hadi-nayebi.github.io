---
title: "Soft → Hard Migration"
date: "May 2026"
slug: "soft-hard-migration"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Hooks, Voices]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "blog/b8/images/maturation-arc-b8-banner.png"
---

# Soft → Hard Migration

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

---

[Essay 8.3](08_3-brain-after-three-months.html) closed the brain inventory at three months — a small brain over a large knowledge layer with a narrow memory. That shape is the *outcome*. The *mechanism* that produces it is the migration of behavioral controls from soft form to hard form within the plugins themselves. This essay opens that mechanism. *[ref: brain-maturation-soft-to-hard-canonical | CLAUDE.md "Brain Maturation Model" section | The "Brain Maturation Model" section codifies the soft→hard migration with the opening line "Controls start soft and harden over time as patterns prove themselves" and a bullet list contrasting young agent (large brain, few hooks, probabilistic controls) with mature agent (lean brain, many hooks, deterministic controls). The flow bullet — "Experience → notice pattern → add to brain → pattern proves reliable → migrate to hook → remove from brain" — is the canonical direction this essay teaches in detail.]*

The graduation through the stages of the job-maturation arc ([Essay 8.2](08_2-job-maturation-stages.html)) — deep single-cycle, to multi-cycle `.md` plan, to multi-cycle `.yaml` plan, to plugin form of a job — is *only one* of the patterns by which the seed agent grows. The other — equally important — is the migration of behavioral controls from soft form to hard form within the plugins themselves. *[ref: job-stages-maturation-arc-canonical | root CLAUDE.md "Job Stages" section | The "Job Stages" section enumerates the maturation arc, with the Stage decided in cycle-1 PLAN by an explicit `set-plan-file` call (every job is born with `plan_file` null — the undecided set-once sentinel — and the cycle-1 PLAN→EXECUTE advance is blocked until the decision is made): Stage 1 single-cycle deep (cycle-1 PLAN calls `set-plan-file <id> false`, collaborative); Stage 2 multi-cycle with a `.md` plan (cycle 1 PLAN calls `set-plan-file <id> <name>.md`; the plan declares `total_cycles`); Stage 3 multi-cycle with a `.yaml` plan (identical to Stage 2 in completion semantics — like every Stage, a valid STARTING format; moving a job between formats is a user-discussed decision, never an automatic promotion); and the aspirational Stage 4 "plugin form of a job." This essay's "deep single-cycle, to multi-cycle `.md` plan, to multi-cycle `.yaml` plan, to plugin form of a job" enumeration references that arc.]*

The cleanest concrete migration to study in the prototype is the *evolution.md word cap* — a size discipline that lives soft almost everywhere (a row in the brain's size-limits table, honored through CONDENSE compression) and hard in exactly one place, where the soft form could not hold: a `PreToolUse` block (a Claude Code hook event that fires before any tool is called, capable of refusing the call) that refuses any edit pushing a plugin's `docs/evolution.md` past its cap. *[ref: evolution-cap-as-worked-example | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh | The hook header states its concern — "Blocks edits to docs/evolution.md that would push word count above" the cap — and the block computes the current and projected post-edit word counts, refusing when the projection exceeds MAX_EVOLUTION_WORDS (2000, in config.conf). The hard side of the migration is this one file; every other size limit in the seed remains soft.]*

---

A lawyer's seed running matter-intake jobs will see the same migration shape applied to its own domain: a `[CONFLICT-CHECK]` voice fires probabilistically at the start of each new-matter cycle, the operator notices it being skipped under pressure, the operator (with the seed) hardens it into a `PreToolUse` block that refuses tool calls until the check returns clear. Same arc; different concern. The lawyer's seed earns hardening evidence the same way the prototype did — measurement first, then friction. *[ref: lawyer-seed-analogy-pretooluse-shape | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh block branch | The evolution-cap hook (a PreToolUse interception that computes a predicate — the projected word count — and refuses the edit when the predicate fails, emitting a voice that names the gap and the fix) is the literal block shape a lawyer's seed would replicate for `[CONFLICT-CHECK]`: same enforcement primitive, different gate predicate — word-count-under-cap in the prototype, check-returns-clear in the lawyer's seed.]*

---

## The Evolution Cap — A Worked Migration

Every size limit in the seed starts soft. The brain's size-limits table names a cap for each managed file — the root brain, the subdirectory CLAUDE.md files, plans, memory entries — and the discipline that holds them there is CONDENSE: compression on cycle close, migration of overflow into knowledge files. For most of those files the soft form holds, because the files grow only when cycles deposit content and CONDENSE runs before the next cycle opens. *[ref: size-limits-start-soft | root CLAUDE.md "Size Limits" table + "Brain Maturation Model" section | The Size Limits table names the per-file caps (root CLAUDE.md 3,500 words; subdir CLAUDE.md 800; plans 2,000; MEMORY.md 400; skills 500). The Brain Maturation Model names the discipline: "Size limits drive reorganization — when any file exceeds its limit, the system must split, extract, or migrate content"; controls start soft and harden only as patterns prove themselves.]*

One file kept breaking the soft form: `docs/evolution.md`, the historian's narrative from [Essay 7.5](../b7/07_5-docs-and-historian.html). It is auto-injected as primary memory on every plugin unlock, and it grows on a *structural* schedule — every unlock appends to it. A discipline that relies on remembering to compress loses to a file that grows by mechanism. So the cap hardened: a `PreToolUse` hook now intercepts every edit to a plugin's `docs/evolution.md`, computes the post-edit word count, and refuses the edit if it would push the file past the cap. The block voice names the cap and the current count, and routes the overflow — consolidate older dated sections into the sibling files (`docs/decisions.md`, `docs/lessons.md`), *then* add the new entry. What was once a remembered discipline is now mechanism. *[ref: evolution-cap-block-voice | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh fallback block message | The hook's block message verbatim: "BLOCKED: edit would push docs/evolution.md to N words (cap 2000; current M). WHY: evolution.md is the auto-injected primary memory dumped on every plugin unlock — keeping it lean preserves context budget per-unlock. WHAT TO DO: consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md), THEN add your new entry." The voice teaches the overflow route, not just the refusal.]*

## The Cost Ladder — Voice, Hook, Plugin, Template

The pattern beyond this case — what this essay calls the *cost ladder* — is consistent with the Lock-13 soft-vs-hard discipline that [Essay 7.3](../b7/07_3-dual-voice-architecture.html) names the over-engineering veto. In this prototype, new behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. Your seed can enter the ladder at any tier if prior evidence already justifies the cost — the order is a default, not a mandate. The prototype codifies this restraint as a named lock discipline (the over-engineering veto): no new hard gate hardens before measured cycles demonstrate the soft form is failing. *[ref: lock-13-over-engineering-veto-source | .claude/plugins/phase_condense/docs/principles.md | The principles.md file names "Lock 13" alongside Lock 9 as the source disciplines (`**Source:** plan_condense_redesign.md Lock 9 + Lock 13`). The over-engineering veto policy is operationalized as "voice-first precedence" — new behavioral gates start as coaching voices, and only when measurement proves the soft form consistently fails does the agent harden it. The same lock is taught in detail in Essay 7.3's dual-voice-architecture body + image whitelist.]*

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The evolution cap didn't stay a one-plugin fix; the historian, its capped `docs/evolution.md`, and the overflow siblings are standard organs of the plugin kit, so every new plugin is born carrying the hardened discipline. Brain_guard's cycle-1 universal disciplines (`verify-100%-before-bonus`, `subagent-spot-check`, `condense-not-deletion`, `job.sh create-only in multi-cycle`) made the same trip — from one cycle's lesson to a rule every cycle now obeys, codified into `.claude/knowledge/opevc/` and inherited by every new job. *[ref: brain-guard-c1-four-disciplines-codified | root CLAUDE.md "Durable disciplines from Brain_guard cycle 1" block + .claude/knowledge/opevc/subagent-report-spot-check-required.md | Root CLAUDE.md "Cycle-history archive" section names the four disciplines verbatim: "D1 verify-100%-before-bonus", "D2 subagent-spot-check", "D3 condense-not-deletion", "D4 job.sh create-only in multi-cycle." D2 has its own knowledge file at `.claude/knowledge/opevc/subagent-report-spot-check-required.md`; the others sit in the CLAUDE.md block as condensed rules. The pattern: a single cycle's hard-learned lesson promoted to a permanent operating rule, inherited by every subsequent cycle through brain-root injection at session start.]*

## Two Axes, Same Shape

This soft-to-hard migration *mirrors* the job-maturation arc one level up. Each stage of the maturation arc maps to a hardening tier. The collaborative learning of an early-stage job becomes the codified `.md` plan once the work repeats; the matured plan's shape seeds a `.yaml` injected at phase entry once the pattern stabilizes; the most-repeated patterns harden further into plugin form. Every step is voluntary, and every step trades inspectability for friction. The brain grows along both axes simultaneously: jobs mature upward; controls migrate inward. The limit on both axes is the same: friction plus evidence, not mathematical impossibility — a careless operator can ship a hook without tests; a missing hook registration is silently inert. The architecture makes the careful path *easier* than the careless one; it does not refuse the careless path. *[ref: two-axes-job-stages-and-soft-hard | root CLAUDE.md "Job Stages" + "Brain Maturation Model" sections | The "Job Stages" section frames the upward axis this paragraph mirrors against the soft→hard axis: the Stage is decided in cycle-1 PLAN by an explicit `set-plan-file` call (the job is born with `plan_file` null and the decision cannot be skipped) — Stage 1 (cycle-1 PLAN calls `set-plan-file <id> false`, collaborative) → Stage 2 (`.md` plan declaring `total_cycles`) → Stage 3 (`.yaml` plan, identical completion semantics — a new job's cycle-1 PLAN choosing the format a matured `.md` pattern has earned, a user-discussed decision, never an automatic flip). A job climbs only when its work has proven it repeats; the "Brain Maturation Model" section names the parallel control axis (voice → hook → template, "Soft controls harden over time"). The same shape of voluntary, evidence-gated progression along both axes this essay opens.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/soft-hard-migration-b8-4.png
  Concept: Chalk-on-blackboard horizontal pipeline — a behavioral pattern moving left to right through five stages of hardening, from coaching voice to fossilized template.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk stages
  and arrows; pastel chalk fills for the five stages (cyan, green, orange, pink, magenta — same palette as the cycle image, in left-to-right order);
  white chalk for ALL labels, arrows, and stage text; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, file names, or descriptors.
  Layout: Five hand-drawn rectangular chalk stages arranged horizontally across the board, left to right, equal size. White-chalk arrows connect each stage to the next (four arrows total). Each stage is labeled IN WHITE CHALK with TWO lines of text — the stage name on top, a short mechanism note below:
    Stage 1 (cyan fill, leftmost):
      Top:    "coaching voice"
      Bottom: "voice.xml — probabilistic"
    Stage 2 (green fill):
      Top:    "measurement"
      Bottom: "tracker counters"
    Stage 3 (orange fill):
      Top:    "hook block"
      Bottom: "PreToolUse — deterministic"
    Stage 4 (pink fill):
      Top:    "plugin tests"
      Bottom: "tests/ — protects the gate"
    Stage 5 (magenta fill, rightmost):
      Top:    "kit template"
      Bottom: "fossilized — every new plugin inherits"
  Above the five-stage pipeline, draw a single curving white-chalk arrow that arcs from Stage 1 over to Stage 5, with one short caption riding the arrow's curve IN WHITE CHALK exactly: "soft → hard → out of brain".
  Below the pipeline, a horizontal white-chalk note reads exactly: "Lock 13: data must show soft failed before hard lands".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching voice", "voice.xml — probabilistic", "measurement", "tracker counters", "hook block", "PreToolUse — deterministic", "plugin tests", "tests/ — protects the gate", "kit template", "fossilized — every new plugin inherits", "soft → hard → out of brain", "Lock 13: data must show soft failed before hard lands", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.4. Patterns travel left to right. The brain shrinks; the kit grows."
-->

---

A pattern travels from voice to hook to template, and the cost ladder keeps the brain honest about which controls have earned the cost of hardening. The next essay opens the inverse question: which limits *look* hard but are actually CONDENSE discipline, and which earn their gates.

---

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

*Previous: [Essay 8.3 — What Lives in the Brain After Three Months](08_3-brain-after-three-months.html) — the prototype as ground-truth inventory.*
*Next: [Essay 8.5 — What's Enforced vs What's Discipline](08_5-enforced-vs-discipline.html) — the honest accounting of size caps.*
