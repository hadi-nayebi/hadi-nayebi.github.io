---
title: "What's Enforced vs What's Discipline"
date: "May 2026"
slug: "enforced-vs-discipline"
read_time: "4 min"
tags: [Architecture, Seed Agent, Maturation, Enforcement, Discipline]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# What's Enforced vs What's Discipline

*Essay 8.5 — From Apprentice to Architect, Part 5 of 9.*

---

[Essay 8.4](08_4-soft-hard-migration.html) opened the soft-to-hard migration arc — how a behavioral pattern travels from coaching voice to hardened hook to fossilized template. The arc raises an inverse question: which of the seed's *current* limits are hard, and which are discipline pretending to be hard? This sub-essay is the honest accounting.

A documented size limit and an enforced size limit are not the same thing. The prototype today is honest about the difference.

---

A writer's seed running manuscript-stage-gate jobs could pretend its "max 80,000 words per first draft" limit is enforced when in fact it's CONDENSE discipline. The seed (and the writer) only catch the drift when a 95,000-word draft sails through. The same gap shape applies in every operator's domain: the only way to know which limit is real is to test the gate empirically. The honest framing — "this is discipline; this is enforcement" — saves the operator from misplaced trust.

---

## The Soft Caps

**Root brain. Subdirectory CLAUDE.md. Plan files. Memory entries. Skill files.** Several caps in the documentation table (currently five in the prototype) — all of them soft. None are policed by a code hook today. The brain stays within these caps because the CONDENSE phase compresses each layer cycle after cycle, not because a `PreToolUse` guard refuses an edit. *[ref: soft-size-caps-no-code-gate | root CLAUDE.md "Size Limits" section | Root CLAUDE.md "Size Limits" section lists the five caps with their thresholds. Grep confirms only `evolution-cap.sh` registers a PreToolUse word-count gate; every other limit relies on CONDENSE.compress discipline (called explicitly by phase_condense docs). The honest design choice: data must justify a hard gate (Lock 13 over-engineering veto) before code lands.]*

## The One Hard Cap

**`docs/evolution.md`. Hard.** A `PreToolUse` hook (`evolution-cap.sh` inside `plugin_integrity`) intercepts every edit to a plugin's `docs/evolution.md`, counts the post-edit word count, and refuses the edit if it would push the file past the cap. The voice that fires names the cap, names the current count, and points the agent at the sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) where older content should migrate. The historian subagent reads that voice and uses the overflow rule to populate the sibling files as the plugin's narrative grows.

## Why the Asymmetry

One hard limit out of several. The pattern is consistent with the cost ladder. `docs/evolution.md` got the hard gate because the historian subagent re-narrates the file on every drift trip, the result is auto-injected into the agent's context at every plugin unlock, and a bloated evolution.md would inflate the per-unlock context budget across the entire system. The cost of letting it grow was concrete; the gate paid for itself.

The other size limits are soft because the *measurement* has not yet shown the soft control failing. Root brain stays at its cap because CONDENSE compresses it. Subdirectory CLAUDE.md stays at its cap because CONDENSE migrates content out to knowledge files. Memory entries stay short because operators write feedback rules tersely. Skills stay small because operations exceeding a small word count get extracted to their own skill file. None of this needs a hook today. The honest claim: it might tomorrow. The cost ladder will decide.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard two-column gate diagram — left column "hard cap" with a single chalk padlock; right column "soft caps" with multiple wavy-line caps. A short note beneath each column names what holds each line.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk
  padlock and wavy caps; pastel chalk fills for the two columns (magenta = hard cap column, cyan = soft caps column — drawn from the cycle image palette);
  white chalk for ALL labels, file names, and the note text; faint chalk dust at the edges; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, threshold values, or descriptors.
  Layout: A vertical white-chalk divider line down the middle of the board splits it into two columns. Above each column, a one-line column header IN WHITE CHALK:
    Left column header: "hard cap"
    Right column header: "soft caps"
  In the LEFT column (magenta fill):
    A single hand-drawn chalk padlock icon, large, centered. Below the padlock, three lines of label IN WHITE CHALK stacked:
      Top line:    "docs/evolution.md"
      Middle line: "2,000 words"
      Bottom line: "evolution-cap.sh PreToolUse"
    Below those, a short white-chalk note reads exactly: "code refuses the edit"
  In the RIGHT column (cyan fill):
    Five small hand-drawn chalk caps stacked vertically (like rough hat shapes with wavy brims), each labeled to its right IN WHITE CHALK:
      Cap 1: "root brain — 3,500 words"
      Cap 2: "subdir CLAUDE.md — 800 words"
      Cap 3: "plan files — 2,000 words"
      Cap 4: "memory entries — 400 words"
      Cap 5: "skill files — 500 words"
    Below the stack, a short white-chalk note reads exactly: "CONDENSE discipline holds the line"
  Across the bottom of the board, beneath both columns, a single horizontal white-chalk note reads exactly: "Lock 13: hard gates earn their cost; soft caps wait for evidence"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "hard cap", "soft caps", "docs/evolution.md", "2,000 words", "evolution-cap.sh PreToolUse", "code refuses the edit", "root brain — 3,500 words", "subdir CLAUDE.md — 800 words", "plan files — 2,000 words", "memory entries — 400 words", "skill files — 500 words", "CONDENSE discipline holds the line", "Lock 13: hard gates earn their cost; soft caps wait for evidence", plus the caption below. No other words, file names, folders, or threshold descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.2. One hard cap. Several soft. The asymmetry is honest."
  ASSET: assets/images/blog/b8/enforced-vs-discipline-b8-5.png
-->

## The Deflation Gate — A Different Boundary

A second enforcement runs at a different boundary — the *deflation gate* inside `phase_condense`. At condense entry, a sensor snapshots the total bottom-section word count across every CLAUDE.md the cycle touched. At commit time, the script re-measures and refuses to advance unless the absorbed-words ratio crosses a stage-aware threshold (single-cycle jobs default near four-fifths absorption, multi-cycle jobs near half). The gate fires at commit, not at edit — which is the right boundary, because the question isn't *did this individual edit fit* but *did the cycle, taken as a whole, compress enough to graduate*.

The pattern reads cleanly: hard limits cost something to maintain (every gate adds friction, every gate adds tests), and the architecture won't pay that cost until the soft form has demonstrably failed. The discipline isn't *more* enforcement; it is enforcement *where it pays for itself*. The limit on this honesty is the operator's: a seed that quietly bloats a soft cap will keep bloating it until the operator notices, because no code stops the drift.

---

The brain's enforcement is asymmetric by design — hard where the cost pays for itself, soft where CONDENSE discipline still holds. The next sub-essay widens the lens from the *brain's* maturation to the *operator's* — the three rough stages of growing from apprentice to journeyman to architect.

---

*Essay 8.5 — From Apprentice to Architect, Part 5 of 9.*

*Previous: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
*Next: [Essay 8.6 — The Maturation Arc: Apprentice, Journeyman, Architect](08_6-apprentice-journeyman-architect.html) — the operator's three rough stages and the visible markers of each.*
