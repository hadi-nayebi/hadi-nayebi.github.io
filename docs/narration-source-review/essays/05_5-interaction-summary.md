# Essay 5.5 review: Mega-Prompt Compression

## TLDR

The essay keeps its central idea: long jobs need an owned compression process
that preserves user direction in a reviewable shape. The revision corrects the
live detect-and-enforce sequence, replaces the obsolete “total block” account
with the current deadlock-safe allowlist, and distinguishes a structured,
lossy summary from its recoverable source history.

## Reviewed revision

- Canonical source: `blog/b5/05_5-interaction-summary.md`
- Source version: `v0.6.0` (previously `v0.5.0`)
- Source SHA-256: `7542ac51905a9cf759801f0a1384fe3121964a3e3fedf0ff7d89c1a56dcb4516`
- Published page: `blog/b5/05_5-interaction-summary.html`
- Published-page SHA-256: `110346e7c4d7359a30c23f1f859b8b9346b65613b54374fcc380a901245325db`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located the mechanism inside the earlier private Claude Code prototype and
   separated its local parameters from the portable compression problem.
2. Corrected ownership: `interaction_summary` keeps a minimal mirror record
   under the shared job ID and reads raw interactions through `job_core`'s
   gateway without copying or mutating them.
3. Corrected lazy tracking: short jobs do not receive a summary record; the
   mirror is created only after the first threshold crossing.
4. Rebuilt the detector around the live `PostToolUse:AskUserQuestion` hook,
   the 500-token default, the 13/10 word-count approximation, and the structural
   exclusion of gmode interactions.
5. Corrected the two-phase sequence. Detection silently records summary debt;
   the next guarded tool call blocks and injects the prior summary, new
   interactions, required structure, and submission command.
6. Replaced the obsolete “every tool, one escape” claim with the current
   deadlock-safe allowlist: summary submission, shared phase and compaction
   escapes, read-only job status, and direct memory-file access.
7. Clarified that infrastructure questions remain blocked, main-session
   subagent spawning is blocked, and already-running subagent calls are exempt.
8. Preserved the five-section “shape compels production” explanation while
   adding its limit: enforced structure cannot prove insight or completeness.
9. Corrected the summary chain as append-only, indexed, and intentionally lossy,
   with raw interactions retained as the recovery source.
10. Distinguished the interaction-summary chain from the broader compaction
    handoff described in Essay 5.3.
11. Marked the existing diagram as historical because its single-path visual
    predates the current shared escape and memory allowances.
12. Corrected the May 14, 2026 publication date, September 10 modification
    date, six-minute reading time, RSS title and summary, sitemap date,
    adjacent-series reading times, and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including the
`interaction_summary` contract and configuration, token counter, summary
guard, submission gateway, and the relevant `job_core` interaction boundary.
The private prototype was not modified.

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional until
the B5 series is reviewed. Hadi's content lock remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit
  `efd46b67eaab693b7b78a641119ef5997ee760c6` on May 14, 2026.
- Visible source tightened from about 1,280 to about 1,230 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
