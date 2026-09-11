---
title: "Soft → Hard Migration"
date: "May 17, 2026"
slug: "soft-hard-migration"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Hooks, Voices]
status: published
version: v0.2.0
audience: "Power Users & Architects"
og_image: "blog/b8/images/maturation-arc-b8-banner.png"
---

# Soft → Hard Migration

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

---

[Essay 8.3](08_3-brain-after-three-months.html) closed the brain inventory at three months — a small brain over a large knowledge layer with a narrow memory. That shape is the *outcome*. The *mechanism* that produces it is the migration of behavioral controls from soft form to hard form across the harness, including the plugins that carry reusable controls. This essay opens that mechanism. *[ref: brain-maturation-soft-to-hard-canonical | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The job-maturation forms from [Essay 8.2](08_2-job-maturation-stages.html) — deep single-cycle, multi-cycle with a `.md` plan, multi-cycle with a `.yaml` plan, and a proposed plugin form of a job — describe *one* way a seed agent grows. A job may begin in any form its work already justifies; moving between forms is a deliberate operator decision rather than an automatic graduation. The other growth pattern — equally important — is the migration of behavioral controls from soft form to hard form across the harness. *[ref: job-stages-maturation-arc-canonical | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The cleanest concrete migration to study in the historical Claude-based reference implementation is the *evolution.md word cap* — a size discipline that lived soft until measured failure justified a hard gate: a `PreToolUse` hook, which Claude Code runs before a matching tool call executes and which can refuse that call, rejects an edit that would push a plugin's `docs/evolution.md` past its cap. *[ref: evolution-cap-as-worked-example | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

A lawyer's seed running matter-intake jobs could apply the same migration shape to its own domain: a `[CONFLICT-CHECK]` voice fires probabilistically at the start of each new-matter cycle, the operator notices it being skipped under pressure, and the operator, working with the seed, hardens it into a pre-tool gate that refuses relevant tool calls until the check returns clear. Same arc; different concern. The lawyer's seed earns hardening evidence the same way the reference implementation did — measurement first, then friction. *[ref: lawyer-seed-analogy-pretooluse-shape | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

## The Evolution Cap — A Worked Migration

In the historical reference implementation, each documented size limit began soft. Its size-limits table named targets for managed instruction files, plans, memory entries, and skills; CONDENSE was responsible for compressing those layers and moving overflow into durable knowledge. The soft form held where repeated measurement showed that cycle-boundary review and compression were sufficient. *[ref: size-limits-start-soft | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

One file kept breaking the soft form: `docs/evolution.md`, the historian's narrative from [Essay 7.5](../b7/07_5-docs-and-historian.html). Plugin changes accumulate in that narrative, and the historical implementation injects it as primary memory when a plugin is unlocked. A discipline that relies on remembering to compress loses when the same growing file is repeatedly loaded into context. So the cap hardened: a `PreToolUse` hook computes the projected post-edit word count and refuses an edit that would push the file past the cap. The block voice names the cap and current count, then routes older detail into sibling decision and lesson files before the new entry lands. What was once a remembered discipline became mechanism. *[ref: evolution-cap-block-voice | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

## The Cost Ladder — Voice, Hook, Plugin, Template

The pattern beyond this case — what this essay calls the *cost ladder* — is consistent with the soft-vs-hard discipline that [Essay 7.3](../b7/07_3-dual-voice-architecture.html) names the over-engineering veto. In the historical reference implementation, new behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a pre-tool guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. Your seed can enter the ladder at any tier if prior evidence already justifies the cost — the order is a default, not a mandate. The implementation codifies this restraint as a named discipline: no new hard gate hardens before measured cycles demonstrate that the soft form is failing. *[ref: lock-13-over-engineering-veto-source | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The evolution cap did not remain a one-plugin repair; the historian, its bounded living-history file, and the overflow pattern became standard organs of the historical plugin kit, so later plugins inherited the discipline. Cycle-level lessons can make the same trip: experience becomes a documented rule, repeated evidence earns a tested guard or template default, and later jobs inherit the result without carrying the whole lesson in working context. *[ref: brain-guard-c1-four-disciplines-codified | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

## Two Axes, Same Shape

This soft-to-hard migration *mirrors* the job-maturation arc one level up, but the two do not map tier for tier. A recurring job may be represented by a prose or structured plan, and a new job may begin in either form when its work already justifies it. Separately, a measured behavioral concern may migrate from voice to hook, then into a dedicated plugin or the kit's template. Every move is voluntary and operator-driven; changing a plan format is not an automatic promotion, and hardening a control trades flexibility for enforcement and maintenance cost. The brain grows along both axes simultaneously: jobs become easier to repeat; controls migrate inward. The limit on both axes is the same: friction plus evidence, not mathematical impossibility — a careless operator can ship a hook without tests; a missing hook registration is silently inert. The architecture makes the careful path *easier* than the careless one; it does not refuse the careless path. *[ref: two-axes-job-stages-and-soft-hard | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

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
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching voice", "voice.xml — probabilistic", "measurement", "tracker counters", "hook block", "PreToolUse — deterministic", "plugin tests", "tests/ — protects the gate", "kit template", "fossilized — every new plugin inherits", "soft → hard → out of brain", "Lock 13: data must show soft failed before hard lands". No other words, file names, folders, or stage descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 8.4. Patterns travel left to right. The brain shrinks; the kit grows."
-->

---

A pattern travels from voice to hook to template, and the cost ladder keeps the brain honest about which controls have earned the cost of hardening. The next essay opens the inverse question: which limits *look* hard but are actually CONDENSE discipline, and which earn their gates.

---

*Essay 8.4 — From Apprentice to Architect, Part 4 of 9.*

*Previous: [Essay 8.3 — What Lives in the Brain After Three Months](08_3-brain-after-three-months.html) — the prototype as ground-truth inventory.*
*Next: [Essay 8.5 — What's Enforced vs What's Discipline](08_5-enforced-vs-discipline.html) — the honest accounting of size caps.*
