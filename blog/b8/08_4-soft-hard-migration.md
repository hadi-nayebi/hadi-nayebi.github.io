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

The graduation through the stages of the job-maturation arc ([Essay 8.2](08_2-job-maturation-stages.html)) — deep single-cycle, to multi-cycle `.md` plan, to multi-cycle `.yaml` plan, to plugin form of a job — is *only one* of the patterns by which the seed agent grows. The other — equally important — is the migration of behavioral controls from soft form to hard form within the plugins themselves. *[ref: job-forms-three-stages-canonical | CLAUDE.md "Job Forms" section | Root CLAUDE.md's "Job Forms" section enumerates the three forms verbatim: form 1 single-cycle deep (`plan_file = false`); form 2 multi-cycle with `.md` plan (`plan_state = drafting` until `[PLAN-APPROVAL]`); form 3 multi-cycle with `.yaml` plan (`plan_state = yaml_drafting` until `[YAML-APPROVAL]`, then yaml_ready injects at phase entry). The arc is the canonical job-maturation framing this essay's "deep single-cycle, to multi-cycle `.md` plan, to multi-cycle `.yaml` plan, to plugin form of a job" enumeration references.]*

The cleanest concrete migration in the prototype's history is the *multiplier sentinel* — a behavioral control that started as a coaching voice, was measured to be failing under load, and earned hardening into a `PreToolUse` block (a Claude Code hook event that fires before any tool is called, capable of refusing the call). *[ref: multiplier-sentinel-as-worked-example | .claude/plugins/phase_observe/hooks/voice.xml + .claude/plugins/phase_observe/hooks/observe-guard.sh | voice.xml carries the sentinel-era replacements (`entry-set-multiplier-pre-set`, `entry-set-multiplier-post-set`, `multiplier-zero-block`) — the bare `entry-set-multiplier` coaching voice is absent (retired). observe-guard.sh implements the hard side: the Sentinel-Lock-Gate block (PreToolUse on all tools — Edit, Write, Read, Bash, and every other tool the hook registers against) refuses every tool call when the phase multiplier is zero, except the specific `observe.sh set-multiplier` Bash invocation that escapes the lock. Together these two files document the worked example end-to-end — soft voice replaced by hard block.]*

---

A lawyer's seed running matter-intake jobs will see the same migration shape applied to its own domain: a `[CONFLICT-CHECK]` voice fires probabilistically at the start of each new-matter cycle, the operator notices it being skipped under pressure, the operator (with the seed) hardens it into a `PreToolUse` block that refuses tool calls until the check returns clear. Same arc; different concern. The lawyer's seed earns hardening evidence the same way the prototype did — measurement first, then friction. *[ref: lawyer-seed-analogy-pretooluse-shape | .claude/plugins/phase_observe/hooks/observe-guard.sh Sentinel-Lock-Gate block | The Sentinel-Lock-Gate in observe-guard.sh (PreToolUse on all tools, unconditional `block` call inside the multiplier=zero branch) is the literal block shape a lawyer's seed would replicate for `[CONFLICT-CHECK]` — load the prefixed voice into the same PreToolUse position, refuse tool calls until the gate's exit condition (multiplier-set in the prototype; check-clear in the lawyer's seed) is satisfied. Same enforcement primitive, different gate predicate.]*

---

## The Multiplier Sentinel — A Worked Migration

In the early cycles, every phase entry shipped a single coaching voice (`entry-set-multiplier`) asking the agent to please set the phase's multiplier before starting work. The voice fired probabilistically into the LLM's context. The agent read it and, under cognitive load, often ignored it. Several cycles in, the data was clear: the ratio of voice-fires to actual-multiplier-sets had stopped converging. The voice was not holding. *[ref: entry-set-multiplier-retired-voice-id | .claude/plugins/phase_observe/hooks/voice.xml | The bare `entry-set-multiplier` coaching voice ID has been retired; the current voice.xml holds the two sentinel-era replacements: `entry-set-multiplier-pre-set` (informational entry before the lock) and `entry-set-multiplier-post-set` (post-set acknowledgment). The retirement itself — the bare ID removed from registry, replaced by paired pre/post voices alongside the `multiplier-zero-block` hard gate — is the canonical demonstration of soft→hard migration in the prototype.]*

The hardening landed during a dedicated maintenance cycle. Every phase's entry now initializes the multiplier to literal zero — a sentinel value. A `PreToolUse` guard reads the multiplier on every tool call; if it is zero, every tool is blocked. The agent's only available move is to call `<phase>.sh set-multiplier <job> <value>` with a value in a small allowed set. The coaching voice retired. In its place, two new voices took the load: `entry-set-multiplier-pre-set` informs the agent before the lock; `multiplier-zero-block` refuses tool calls when the gate fires. What was once probabilistic judgment is now mechanism. *[ref: multiplier-sentinel-pretooluse-zero-block | .claude/plugins/phase_observe/hooks/observe-guard.sh Sentinel-Lock-Gate block + .claude/plugins/phase_observe/hooks/observe-tracker.sh Sentinel-Lock-defense-in-depth block + .claude/plugins/phase_observe/scripts/observe.sh set-multiplier subcommand | observe-guard.sh comment: "Sentinel-Lock Gate (v0.12 — multiplier-fix gmode 2026-05-04)" — the PreToolUse block. observe-tracker.sh comment: "Sentinel-Lock defense-in-depth (v0.12 — multiplier-fix gmode 2026-05-04). observe-guard.sh blocks tools at multiplier=0, but if any tool slips through [...] exiting here keeps state simple and surfaces the sentinel as a structural lock." observe.sh set-multiplier subcommand documents the allowed value set and validates: any other value dies with "Invalid multiplier" naming the allowed set. The sentinel pattern replicates across all phase plugins in the prototype.]*

## The Cost Ladder — Voice, Hook, Plugin, Template

The pattern beyond this case — what this essay calls the *cost ladder* — is consistent with the Lock-13 soft-vs-hard discipline that [Essay 7.3](../b7/07_3-dual-voice-architecture.html) names the over-engineering veto. In this prototype, new behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. Your seed can enter the ladder at any tier if prior evidence already justifies the cost — the order is a default, not a mandate. The prototype codifies this restraint as a named lock discipline (the over-engineering veto): no new hard gate hardens before measured cycles demonstrate the soft form is failing. *[ref: lock-13-over-engineering-veto-source | .claude/plugins/phase_condense/docs/principles.md | The principles.md file names "Lock 13" alongside Lock 9 as the source disciplines (`**Source:** plan_condense_redesign.md Lock 9 + Lock 13`). The over-engineering veto policy is operationalized as "voice-first precedence" — new behavioral gates start as coaching voices, and only when measurement proves the soft form consistently fails does the agent harden it. The same lock is taught in detail in Essay 7.3's dual-voice-architecture body + image whitelist.]*

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The multiplier sentinel didn't just become a hook in `phasic_system`; it became part of the template every new phase plugin inherits. Brain_guard's cycle-1 universal disciplines (`verify-100%-before-bonus`, `subagent-spot-check`, `condense-not-deletion`, `job.sh create-only in multi-cycle`) made the same trip — from one cycle's lesson to a rule every cycle now obeys, codified into `.claude/knowledge/opevc/` and inherited by every new job. *[ref: brain-guard-c1-four-disciplines-codified | root CLAUDE.md "Durable disciplines from Brain_guard cycle 1" block + .claude/knowledge/opevc/subagent-report-spot-check-required.md | Root CLAUDE.md "Cycle-history archive" section names the four disciplines verbatim: "D1 verify-100%-before-bonus", "D2 subagent-spot-check", "D3 condense-not-deletion", "D4 job.sh create-only in multi-cycle." D2 has its own knowledge file at `.claude/knowledge/opevc/subagent-report-spot-check-required.md`; the others sit in the CLAUDE.md block as condensed rules. The pattern: a single cycle's hard-learned lesson promoted to a permanent operating rule, inherited by every subsequent cycle through brain-root injection at session start.]*

## Two Axes, Same Shape

This soft-to-hard migration *mirrors* the job-maturation arc one level up. Each stage of the maturation arc maps to a hardening tier. The collaborative learning of an early-stage job becomes the codified `.md` plan once the work repeats; the plan itself migrates into a `.yaml` injected at phase entry once its shape stabilizes; the most-repeated patterns harden further into plugin form. Every step is voluntary, and every step trades inspectability for friction. The brain grows along both axes simultaneously: jobs mature upward; controls migrate inward. The limit on both axes is the same: friction plus evidence, not mathematical impossibility — a careless operator can ship a hook without tests; a missing hook registration is silently inert. The architecture makes the careful path *easier* than the careless one; it does not refuse the careless path. *[ref: two-axes-job-forms-and-soft-hard | CLAUDE.md "Job Forms" section | The same "Job Forms" section that anchors the three-stage arc (form 1 → form 2 → form 3) is what this paragraph mirrors against the soft→hard axis: `plan_file = false` / `.md` plan / `.yaml` plan → voice / hook / plugin. The arc enumerates `plan_state` transitions (`drafting` → `md_approved` → `yaml_drafting` → `yaml_ready`) and the user-gated approval prefixes (`[PLAN-APPROVAL]`, `[YAML-APPROVAL]`) that drive each stage forward — the same shape of voluntary, evidence-gated progression as the voice→hook→plugin axis this essay opens.]*

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
