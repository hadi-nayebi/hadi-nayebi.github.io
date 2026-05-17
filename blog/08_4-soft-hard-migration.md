---
title: "Soft → Hard Migration"
date: "May 2026"
slug: "soft-hard-migration"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Hooks, Voices]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "assets/images/blog/agent-anatomy.png"
---

# Soft → Hard Migration

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

---

[Essay 8.3](08_3-brain-after-three-months.html) closed the brain inventory at three months — a small brain over a large knowledge layer with a narrow memory. That shape is the *outcome*. The *mechanism* that produces it is the migration of behavioral controls from soft form to hard form within the plugins themselves. This sub-essay opens that mechanism.

The graduation from stage 1 to stage 2 to stage 3 of the job-maturation arc ([Essay 8.2](08_2-job-maturation-stages.html)) is *only one* of the patterns by which the seed agent grows. The other — equally important — is the migration of behavioral controls from soft form to hard form within the plugins themselves.

The cleanest concrete migration in the prototype's history is the *multiplier sentinel*.

---

A lawyer's seed running matter-intake jobs will see the same migration shape applied to its own domain: a `[CONFLICT-CHECK]` voice fires probabilistically at the start of each new-matter cycle, the operator notices it being skipped under pressure, the operator (with the seed) hardens it into a `PreToolUse` block that refuses tool calls until the check returns clear. Same arc; different concern. The lawyer's seed earns hardening evidence the same way the prototype did — measurement first, then friction.

---

## The Multiplier Sentinel — A Worked Migration

In the early cycles, every phase entry shipped a single coaching voice (`entry-set-multiplier`) asking the agent to please set the phase's multiplier before starting work. The voice fired probabilistically into the LLM's context. The agent read it and, under cognitive load, often ignored it. Several cycles in, the data was clear: the ratio of voice-fires to actual-multiplier-sets had stopped converging. The voice was not holding.

The hardening landed in the 2026-05-04 multiplier-fix gmode work. Every phase's entry now initializes the multiplier to literal zero — a sentinel value. A `PreToolUse` guard reads the multiplier on every tool call; if it is zero, every tool is blocked. The agent's only available move is to call `<phase>.sh set-multiplier <job> <value>` with a value in a small allowed set. The coaching voice retired. In its place, two new voices took the load: `entry-set-multiplier-pre-set` informs the agent before the lock; `multiplier-zero-block` refuses tool calls when the gate fires. What was once probabilistic judgment is now mechanism. *[ref: multiplier-sentinel-pretooluse-zero-block | .claude/plugins/phase_observe/hooks/observe-guard.sh Sentinel-Lock-Gate block + .claude/plugins/phase_observe/hooks/observe-tracker.sh Sentinel-Lock-defense-in-depth block + .claude/plugins/phase_observe/scripts/observe.sh set-multiplier subcommand | observe-guard.sh comment: "Sentinel-Lock Gate (v0.12 — multiplier-fix gmode 2026-05-04)" — the PreToolUse block. observe-tracker.sh comment: "Sentinel-Lock defense-in-depth (v0.12 — multiplier-fix gmode 2026-05-04). observe-guard.sh blocks tools at multiplier=0, but if any tool slips through [...] exiting here keeps state simple and surfaces the sentinel as a structural lock." observe.sh set-multiplier subcommand documents the allowed value set and validates: any other value dies with "Invalid multiplier" naming the allowed set. The sentinel pattern replicates across all phase plugins in the prototype.]*

## The Cost Ladder — Voice, Hook, Plugin, Template

The pattern beyond this case is the cost ladder named in [Essay 7.3](07_3-dual-voice-architecture.html). New behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. The prototype's universal discipline `Lock 13: the over-engineering veto` codifies the restraint: no new hard gate hardens before measured cycles demonstrate the soft form is failing.

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The multiplier sentinel didn't just become a hook in `phasic_system`; it became part of the template every new phase plugin inherits. Brain_guard's cycle-1 universal disciplines (`verify-100-percent-before-bonus`, `subagent-spot-check`, `condense-not-deletion`, `no-dep-jobs-in-single-cycle`) made the same trip — from one cycle's lesson to a rule every cycle now obeys, codified into `.claude/knowledge/opevc/` and inherited by every new job. *[ref: brain-guard-c1-four-disciplines-codified | root CLAUDE.md "Durable disciplines from Brain_guard cycle 1" block + .claude/knowledge/opevc/subagent-report-spot-check-required.md + ~/.claude/projects/<encoded>/memory/feedback_verify_100_percent_before_bonus.md + ~/memory/feedback_no_dep_jobs_in_single_cycle.md | Root CLAUDE.md "Cycle-history archive" section names the four disciplines explicitly: "D1 verify-100%-before-bonus", "D2 subagent-spot-check", "D3 condense-not-deletion", "D4 job.sh create-only in multi-cycle". Each has a knowledge file or memory entry. The pattern: a single cycle's hard-learned lesson promoted to a permanent operating rule, inherited by every subsequent cycle through brain-root injection at session start.]*

## Two Axes, Same Shape

This soft-to-hard migration *mirrors* the job-maturation arc one level up. Each stage of the maturation arc maps to a hardening tier. The collaborative learning of an early-stage job becomes the codified `.md` plan once the work repeats; the plan itself migrates into a `.yaml` injected at phase entry once its shape stabilizes; the most-repeated patterns harden further into plugin form. Every step is voluntary, and every step trades inspectability for friction. The brain grows along both axes simultaneously: jobs mature upward; controls migrate inward. The limit on both axes is the same: friction plus evidence, not mathematical impossibility — a careless operator can ship a hook without tests; a missing hook registration is silently inert. The architecture makes the careful path *easier* than the careless one; it does not refuse the careless path.

<!-- IMAGE PLACEHOLDER:
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
      Bottom: "data.json counters"
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
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching voice", "voice.xml — probabilistic", "measurement", "data.json counters", "hook block", "PreToolUse — deterministic", "plugin tests", "tests/ — protects the gate", "kit template", "fossilized — every new plugin inherits", "soft → hard → out of brain", "Lock 13: data must show soft failed before hard lands", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.3. Patterns travel left to right. The brain shrinks; the kit grows."
-->

---

A pattern travels from voice to hook to template, and the cost ladder keeps the brain honest about which controls have earned the cost of hardening. The next sub-essay opens the inverse question: which limits *look* hard but are actually CONDENSE discipline, and which earn their gates.

---

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

*Previous: [Essay 8.3 — What Lives in the Brain After Three Months](08_3-brain-after-three-months.html) — the prototype as ground-truth inventory.*
*Next: [Essay 8.5 — What's Enforced vs What's Discipline](08_5-enforced-vs-discipline.html) — the honest accounting of size caps.*
