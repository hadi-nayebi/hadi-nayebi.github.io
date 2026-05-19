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

[Essay 8.4](08_4-soft-hard-migration.html) opened the soft-to-hard migration arc — how a behavioral pattern travels from coaching voice to hardened hook to fossilized template. The arc raises an inverse question: which of the seed's *current* limits are hard, and which are discipline pretending to be hard? This essay is the honest accounting.

A documented size limit and an enforced size limit are not the same thing. The prototype today is honest about the difference. *[ref: size-limit-vs-enforced-limit-distinction | root CLAUDE.md "Size Limits" section | The "Size Limits" section is rendered as a documentation table — caps stated, no enforcement clause attached. No hook name, no script reference, no `PreToolUse` gate appears next to any cap. The documentation form itself is the contract: these are caps to keep in mind, not gates the code refuses to cross.]*

---

A writer's seed running manuscript-stage-gate jobs could pretend its "max 80,000 words per first draft" limit is enforced when in fact it's CONDENSE discipline. The seed (and the writer) only catch the drift when a 95,000-word draft sails through. The same gap shape applies in every operator's domain: the only way to know which limit is real is to test the gate empirically. The honest framing — "this is discipline; this is enforcement" — saves the operator from misplaced trust.

---

## The Soft Caps

**Root brain. Subdirectory CLAUDE.md. Plan files. Memory entries. Skill files.** Several caps in the documentation table (currently five in the prototype) — all of them soft. None are policed by a code hook today. The brain stays within these caps because the CONDENSE phase compresses each layer cycle after cycle, not because a `PreToolUse` guard refuses an edit. *[ref: soft-size-caps-no-code-gate | root CLAUDE.md "Size Limits" section | The "Size Limits" section is a single five-row table naming the per-file word caps: root CLAUDE.md 3,500 words; subdir CLAUDE.md 800; plan files 2,000; MEMORY.md 400; skill files 500. The table carries no code-gate reference, no enforcement clause, and no hook mention — its presence in a documentation table without any accompanying enforcement language is itself the evidence that all five are documentation-grade soft caps, not code-policed hard caps.]*

## The One Hard Cap

**`docs/evolution.md`. Hard.** A `PreToolUse` hook (`evolution-cap.sh` inside `plugin_integrity`) intercepts every edit to a plugin's `docs/evolution.md`, counts the post-edit word count, and refuses the edit if it would push the file past the cap. The voice that fires names the cap, names the current count, and points the agent at the sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/lessons-<topic>.md`) where older content should migrate. The historian subagent has free edit access to all `docs/*.md` files, so it can absorb older sections into the siblings as the plugin's narrative grows. *[ref: evolution-cap-pretooluse-hard-block | plugin_integrity/hooks/evolution-cap.sh | The hook registers as PreToolUse on Edit, Write, and MultiEdit; gates only paths ending in `/docs/evolution.md`; computes the projected post-edit word count using delta arithmetic (current_wc − wc(old_string) + wc(new_string) for Edit; full content wc for Write; sum of deltas for MultiEdit); and exits 2 (block) with the `evolution-word-cap` voice when the projection exceeds `MAX_EVOLUTION_WORDS` (default 2000, configurable via plugin_integrity/config.conf). The voice text names sibling files `docs/decisions.md`, `docs/lessons.md`, and `docs/lessons-<topic>.md` as the consolidation destinations and notes that the historian has free edit access to all `docs/*.md`.]*

## Why the Asymmetry

One hard limit out of several. The pattern is consistent with the cost ladder. `docs/evolution.md` got the hard gate because the historian subagent re-narrates the file on every drift trip, the result is auto-injected into the agent's context at every plugin unlock, and a bloated evolution.md would inflate the per-unlock context budget across the entire system. The cost of letting it grow was concrete; the gate paid for itself. *[ref: historian-drift-gate-and-unlock-injection | plugin_integrity/hooks/lock-manager.sh | At plugin unlock, `lock-manager.sh` calls `drift-check.sh` for the target plugin; if the drift count is at or above `DRIFT_THRESHOLD`, the unlock blocks (exit 2) with the `plugin-evolution-stale` voice instructing the agent to invoke `historian-<plugin>` to re-sync. On successful unlock the script emits a `[LIVING HISTORY (evolution.md)]` block — the full contents of the plugin's `docs/evolution.md` plus the recent-commits drift log — via `hookSpecificOutput.additionalContext` JSON on stdout (PostToolUse stderr from exit-0 hooks is silently dropped by Claude Code; only additionalContext reaches agent context). That additionalContext channel is how evolution.md gets auto-injected into the agent's context on every plugin unlock confirmation.]*

The other size limits are soft because the *measurement* has not yet shown the soft control failing. Root brain stays at its cap because CONDENSE compresses it. Subdirectory CLAUDE.md stays at its cap because CONDENSE migrates content out to knowledge files. Memory entries stay short because operators write feedback rules tersely. Skills stay small because operations exceeding a small word count get extracted to their own skill file. None of this needs a hook today. The honest claim: it might tomorrow. The cost ladder will decide. *[ref: soft-cap-discipline-in-root-CLAUDE | root CLAUDE.md "Sub-Operations of CONDENSE" + "Size Limits" + "Growth Rules" sections | The "Size Limits" section enumerates the per-file caps. The "Sub-Operations of CONDENSE" section defines `CONDENSE.compress` as "Enforce size limits across all managed files" and `CONDENSE.migrate-cross-file` as moving content to sibling or parent CLAUDE.md files across the hierarchy — these are the CONDENSE-phase mechanisms that hold the root brain and subdirectory CLAUDE.md files inside their caps. The "Growth Rules" section names rule 3 — "Operations exceeding 50 words get extracted to skill file" — as the discipline keeping the brain lean by pointing at skill files instead of inlining detail.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard two-column gate diagram — left column "hard cap" with a single chalk padlock; right column "soft caps" with multiple wavy-line caps. A short note beneath each column names what holds each line.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk
  padlock and wavy caps; pastel chalk (cyan, green, orange, pink, magenta) — use magenta for the hard cap column fill, cyan for the soft caps column fill, with green, orange, and pink accents on the individual cap shapes and the bottom note;
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
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.5. One hard cap. Several soft. The asymmetry is honest."
  ASSET: assets/images/blog/b8/enforced-vs-discipline-b8-5.png
-->

## The Deflation Gate — A Different Boundary

A second enforcement runs at a different boundary — the *deflation gate* inside `phase_condense`. At condense entry, a sensor snapshots the total bottom-section word count across every CLAUDE.md the cycle touched. At commit time, the script re-measures and refuses to advance unless the absorbed-words ratio crosses a stage-aware threshold (single-cycle jobs default near four-fifths absorption, multi-cycle jobs near half). The gate fires at commit, not at edit — which is the right boundary, because the question isn't *did this individual edit fit* but *did the cycle, taken as a whole, compress enough to graduate*. *[ref: deflation-gate-stage-aware-at-commit | phase_condense/hooks/condense-sensor.sh + phase_condense/scripts/condense-commit.sh | At condense entry, `condense-sensor.sh` snapshots per-file bottom-section word counts — measured from the first OPEVC anchor marker (`---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`) to end-of-file in every altered CLAUDE.md — and stores the baseline on the condense entry in `data.json`. At condense-commit time, `condense-commit.sh --force` re-measures the same bottom sections, queries `job_core --hook stage` for stage detection, and computes `words_to_absorb = total_baseline * threshold/100` with `CONDENSE_DEF_THRESHOLD_STAGE1` defaulting to 80 (single-cycle) and `CONDENSE_DEF_THRESHOLD_STAGE2` defaulting to 50 (multi-cycle with active plan file). If `words_absorbed < words_to_absorb` the commit blocks with the `condense.commit.block-deflation` voice, refusing to advance the phase.]*

The pattern reads cleanly: hard limits cost something to maintain (every gate adds friction, every gate adds tests), and the architecture won't pay that cost until the soft form has demonstrably failed. The discipline isn't *more* enforcement; it is enforcement *where it pays for itself*. The limit on this honesty is the operator's: a seed that quietly bloats a soft cap will keep bloating it until the operator notices, because no code stops the drift.

---

The brain's enforcement is asymmetric by design — hard where the cost pays for itself, soft where CONDENSE discipline still holds. The next essay widens the lens from the *brain's* maturation to the *operator's* — the three rough stages of growing from apprentice to journeyman to architect.

---

*Essay 8.5 — From Apprentice to Architect, Part 5 of 9.*

*Previous: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
*Next: [Essay 8.6 — The Maturation Arc: Apprentice, Journeyman, Architect](08_6-apprentice-journeyman-architect.html) — the operator's three rough stages and the visible markers of each.*
