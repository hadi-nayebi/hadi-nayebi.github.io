---
title: "What's Enforced vs What's Discipline"
date: "May 2026"
slug: "enforced-vs-discipline"
read_time: "4 min"
tags: [Architecture, Seed Agent, Maturation, Enforcement, Discipline]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "blog/b8/images/maturation-arc-b8-banner.png"
---

# What's Enforced vs What's Discipline

*Essay 8.5 — From Apprentice to Architect, Part 5 of 9.*

---

[Essay 8.4](08_4-soft-hard-migration.html) opened the soft-to-hard migration arc — how a behavioral pattern travels from coaching voice to hardened hook to fossilized template. The arc raises an inverse question: which of the seed's *current* limits are hard, and which are discipline pretending to be hard? This essay is the honest accounting.

A documented size limit and an enforced size limit are not the same thing. The prototype today is honest about the difference. *[ref: size-limit-vs-enforced-limit-distinction | .claude/context/brain-memory.md "Size limits (soft word caps)" section | The glossary splits the caps by enforcement: only CLAUDE.md (10,000 words) and docs/evolution.md (2,000 words) are code-gated; the plan / skill / MEMORY.md caps "remain soft discipline — calling THOSE enforced is the exact drift 08_5 warns against." A documented cap is therefore not automatically an enforced one — the honest accounting is knowing which axis each cap sits on.]*

---

A writer's seed running manuscript-stage-gate jobs could pretend its "max 80,000 words per first draft" limit is enforced when in fact it's CONDENSE discipline. The seed (and the writer) only catch the drift when a 95,000-word draft sails through. The same gap shape applies in every operator's domain: the only way to know which limit is real is to test the gate empirically. The honest framing — "this is discipline; this is enforcement" — saves the operator from misplaced trust.

---

## The Soft Caps

**Plan files. Memory entries. Skill files.** Three caps in the documentation table that no code hook polices. Each stays within its cap because the CONDENSE phase compresses the layer cycle after cycle — not because a `PreToolUse` guard refuses the edit. A writer who trusts a "2,000 words per plan file" limit is trusting discipline, and the only way to know discipline held is to test the gate. *[ref: soft-size-caps-no-code-gate | .claude/context/brain-memory.md "Size limits (soft word caps)" section | The consolidated glossary names the still-soft caps explicitly: "the plan / skill / MEMORY.md caps remain soft discipline — calling THOSE enforced is the exact drift 08_5 warns against." They are held by CONDENSE.compress re-routing during the cycle, with no PreToolUse gate — a 95,000-word plan draft would sail through a "max 2,000 words" target until tested empirically. (The former root 3,500 / subdirectory 800 CLAUDE.md targets are gone — subsumed by the single hard CLAUDE.md ceiling in the next section.)]*

## The Two Hard Caps

Two word-count caps are enforced in code — a `PreToolUse` hook counts the projected size and refuses the edit that would cross the line.

**`docs/evolution.md`. Hard.** A `PreToolUse` hook (`evolution-cap.sh` inside `plugin_integrity`) intercepts every edit to a plugin's `docs/evolution.md`, counts the post-edit word count, and refuses the edit if it would push the file past the cap. The voice that fires names the cap, names the current count, and points the agent at the sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/lessons-<topic>.md`) where older content should migrate. The historian subagent has free edit access to all `docs/*.md` files, so it can absorb older sections into the siblings as the plugin's narrative grows. *[ref: evolution-cap-pretooluse-hard-block | plugin_integrity/hooks/evolution-cap.sh | The hook registers as PreToolUse on Edit, Write, and MultiEdit; gates only paths ending in `/docs/evolution.md`; computes the projected post-edit word count using delta arithmetic (current_wc − wc(old_string) + wc(new_string) for Edit; full content wc for Write; sum of deltas for MultiEdit); and exits 2 (block) with the `evolution-word-cap` voice when the projection exceeds `MAX_EVOLUTION_WORDS` (default 2000, configurable via plugin_integrity/config.conf). The voice text names sibling files `docs/decisions.md`, `docs/lessons.md`, and `docs/lessons-<topic>.md` as the consolidation destinations and notes that the historian has free edit access to all `docs/*.md`.]*

**Local `CLAUDE.md` files. Hard — but only against growth.** Every `CLAUDE.md` that is *not* one of the two always-on brains — a plugin's, a subdirectory's, a job's working-memory file — carries a 10,000-word ceiling policed by `claude-md-cap.sh`. An edit that would grow such a file past the cap is refused; an edit that *shrinks* an already-over-cap file is always allowed, so the gate can never wedge a seed that needs to compress its way back under the line. The two always-on brains — the workspace-root `CLAUDE.md` and `.claude/CLAUDE.md` — are exempt from the block and only warn, because they are injected on every session and are shrunk under the operator's own supervision. This single ceiling replaced the old per-file targets. *[ref: claude-md-differentiated-hard-cap | brain_guard/hooks/claude-md-cap.sh + .claude/context/brain-memory.md "Size limits (soft word caps)" section | claude-md-cap.sh loads CLAUDE_MD_MAX_WORDS (default 10000) and branches: exit 0 for under-cap, for a ROOT-over-cap edit (warn only), and for a LOCAL-over-cap SHRINKING edit; exit 2 ONLY for a LOCAL CLAUDE.md that is over cap AND growing — the script's own comment calls this "the ONE blocking path; the always-allow-shrink escape keeps it safe." `_is_root_claude_md()` returns true only for the two always-on brains (`<ROOT_DIR>/CLAUDE.md` and `<ROOT_DIR>/.claude/CLAUDE.md`), which are exempt from the block. The glossary confirms this ceiling subsumes the older soft per-type targets (root 3,500 / subdir 800).]*

## Why the Asymmetry

Two hard limits, and both earned the gate the same way — a concrete, measured cost the soft form was failing to hold. `docs/evolution.md` got its gate because the historian subagent re-narrates the file on every drift trip, the result is auto-injected into the agent's context at every plugin unlock, and a bloated evolution.md would inflate the per-unlock context budget across the entire system. The local `CLAUDE.md` cap earned its gate the same way: a single job's working-memory file had grown to nearly 17,000 words and was re-read on every session resume — the concrete cause of a real compaction grind. In both cases the cost of letting the file grow was measurable; the gate paid for itself. *[ref: historian-drift-gate-and-unlock-injection | plugin_integrity/hooks/lock-manager.sh | At plugin unlock, `lock-manager.sh` calls `drift-check.sh` for the target plugin; if the drift count is at or above `DRIFT_THRESHOLD`, the unlock blocks (exit 2) with the `plugin-evolution-stale` voice instructing the agent to invoke `historian-<plugin>` to re-sync. On successful unlock the script emits a `[LIVING HISTORY (evolution.md)]` block — the full contents of the plugin's `docs/evolution.md` plus the recent-commits drift log — via `hookSpecificOutput.additionalContext` JSON on stdout (PostToolUse stderr from exit-0 hooks is silently dropped by Claude Code; only additionalContext reaches agent context). That additionalContext channel is how evolution.md gets auto-injected into the agent's context on every plugin unlock confirmation.]*

The other size limits are soft because the *measurement* has not yet shown the soft control failing. Root brain stays at its cap because CONDENSE compresses it. Subdirectory CLAUDE.md stays at its cap because CONDENSE migrates content out to knowledge files. Memory entries stay short because operators write feedback rules tersely. Skills stay small because operations exceeding a small word count get extracted to their own skill file. None of this needs a hook today. The honest claim: it might tomorrow. The cost ladder will decide. *[ref: soft-cap-discipline-in-root-CLAUDE | root CLAUDE.md "Sub-Operations of CONDENSE" + "Size Limits" + "Growth Rules" sections | The "Size Limits" section enumerates the per-file caps. The "Sub-Operations of CONDENSE" section defines `CONDENSE.compress` as "Enforce size limits across all managed files" and `CONDENSE.migrate-cross-file` as moving content to sibling or parent CLAUDE.md files across the hierarchy — these are the CONDENSE-phase mechanisms that hold the root brain and subdirectory CLAUDE.md files inside their caps. The "Growth Rules" section names rule 3 — "Operations exceeding 50 words get extracted to skill file" — as the discipline keeping the brain lean by pointing at skill files instead of inlining detail.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard two-column gate diagram — left column "hard caps" with two chalk padlocks; right column "soft caps" with three wavy-line caps. A short note beneath each column names what holds each line.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk
  padlocks and wavy caps; pastel chalk (cyan, green, orange, pink, magenta) — use magenta for the hard caps column fill, cyan for the soft caps column fill, with green, orange, and pink accents on the individual cap shapes and the bottom note;
  white chalk for ALL labels, file names, and the note text; faint chalk dust at the edges; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, threshold values, or descriptors.
  Layout: A vertical white-chalk divider line down the middle of the board splits it into two columns. Above each column, a one-line column header IN WHITE CHALK:
    Left column header: "hard caps"
    Right column header: "soft caps"
  In the LEFT column (magenta fill):
    Two hand-drawn chalk padlock icons stacked vertically. Beside the top padlock, two lines of label IN WHITE CHALK:
      "docs/evolution.md"
      "2,000 words"
    Beside the bottom padlock, two lines of label IN WHITE CHALK:
      "local CLAUDE.md"
      "10,000 words"
    Below the two padlocks, a short white-chalk note reads exactly: "code refuses the growing edit"
    A smaller white-chalk aside beside the bottom padlock reads exactly: "root brains exempt — warn only"
  In the RIGHT column (cyan fill):
    Three small hand-drawn chalk caps stacked vertically (like rough hat shapes with wavy brims), each labeled to its right IN WHITE CHALK:
      Cap 1: "plan files — 2,000 words"
      Cap 2: "memory entries — 400 words"
      Cap 3: "skill files — 500 words"
    Below the stack, a short white-chalk note reads exactly: "CONDENSE discipline holds the line"
  Across the bottom of the board, beneath both columns, a single horizontal white-chalk note reads exactly: "Lock 13: hard gates earn their cost; soft caps wait for evidence"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "hard caps", "soft caps", "docs/evolution.md", "2,000 words", "local CLAUDE.md", "10,000 words", "code refuses the growing edit", "root brains exempt — warn only", "plan files — 2,000 words", "memory entries — 400 words", "skill files — 500 words", "CONDENSE discipline holds the line", "Lock 13: hard gates earn their cost; soft caps wait for evidence". No other words, file names, folders, or threshold descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 8.5. Two hard caps. Three soft. The asymmetry is honest."
  ASSET: images/enforced-vs-discipline-b8-5.png
-->

## The Deflation Gate — A Different Boundary

A second enforcement runs at a different boundary — the *deflation gate* inside `phase_condense`. At condense entry, a sensor snapshots the total bottom-section word count across every CLAUDE.md the cycle touched. At commit time, the script re-measures and refuses to advance unless eighty percent of those bottom-section words have been absorbed — a single threshold, the same for every job whether it runs once or across many cycles. The gate fires at commit, not at edit — which is the right boundary, because the question isn't *did this individual edit fit* but *did the cycle, taken as a whole, compress enough to graduate*. *[ref: deflation-gate-single-80-at-commit | phase_condense/hooks/condense-sensor.sh + phase_condense/scripts/condense-commit.sh + .claude/context/opevc-condense.md "Deflation gate" | At condense entry, `condense-sensor.sh` snapshots per-file bottom-section word counts — measured from the first OPEVC anchor (`---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`) to end-of-file in every altered CLAUDE.md — and stores the baseline on the condense entry in `data.json`. At condense-commit time, `condense-commit.sh --force` re-measures the same bottom sections and refuses to advance until the single 80% threshold is met — the same for every Stage — blocking with the `condense.commit.block-deflation` voice otherwise. (The prototype's former split `CONDENSE_DEF_THRESHOLD_STAGE2=50` was removed per the Deletion ledger — the gate is a single 80% threshold.)]*

The pattern reads cleanly: hard limits cost something to maintain (every gate adds friction, every gate adds tests), and the architecture won't pay that cost until the soft form has demonstrably failed. The discipline isn't *more* enforcement; it is enforcement *where it pays for itself*. The limit on this honesty is the operator's: a seed that quietly bloats a soft cap will keep bloating it until the operator notices, because no code stops the drift.

---

The brain's enforcement is asymmetric by design — hard where the cost pays for itself, soft where CONDENSE discipline still holds. The next essay widens the lens from the *brain's* maturation to the *operator's* — the three rough stages of growing from apprentice to journeyman to architect.

---

*Essay 8.5 — From Apprentice to Architect, Part 5 of 9.*

*Previous: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
*Next: [Essay 8.6 — The Maturation Arc — Apprentice, Journeyman, Architect](08_6-apprentice-journeyman-architect.html) — the operator's three rough stages and the visible markers of each.*
