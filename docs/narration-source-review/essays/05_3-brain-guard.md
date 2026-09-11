# Essay 5.3 review: Context Window Discipline

## TLDR

The essay keeps its central idea: long-running work needs a deliberately
prepared handoff before conversation context is compacted or cleared. The
revision replaces a nearly four-thousand-word implementation narrative with a
shorter, current map of the private prototype's three separate pressures:
percentage-of-window thresholds, an accrual-based reflection heartbeat, and a
file-size ramp. It also distinguishes native Claude Code compaction from the
prototype's local clear-and-inject automation.

## Reviewed revision

- Canonical source: `blog/b5/05_3-brain-guard.md`
- Source version: `v0.4.0` (previously `v0.3.1`)
- Source SHA-256: `86c5540ded9425df34476600dacd19f3432f24aa8d1554e5523c64b4a4e83e59`
- Published page: `blog/b5/05_3-brain-guard.html`
- Published-page SHA-256: `d08ce3d33aa75a46b78c73f8424eebda105388593ab821c699d7232431c42b9d`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located `brain_guard` inside the earlier private Claude prototype rather
   than presenting its mechanism as universal agent architecture.
2. Added the native boundary: Claude Code already supports automatic and manual
   compaction; the prototype adds an earlier, inspectable handoff and local
   clear-and-inject automation.
3. Corrected the compaction-file model to a per-job, per-run, per-sequence chain
   with four work sections, auto-fed commits, a bounded Prior Summary, and an
   append-only Settled Decisions ledger.
4. Removed “never condensed.” The current file can be folded; sealing freezes
   it and opens a new sequence with a summary index and back-reference.
5. Corrected the live context thresholds from the old defaults of 20 / 25 / 30
   to the checked-in experimental override of 31 / 39 / 42 percent.
6. Separated the percentage ramp from the accrual heartbeat. The heartbeat's
   live floor is two successful reflection updates per ten thousand accrued
   tokens, with three recommended and bounded debt.
7. Corrected the context-window assumption. The prototype defaults to one
   million tokens and requires acknowledgement for another denominator; current
   Claude Code also supports standard 200K and extended 1M calculations.
8. Corrected the file-size ramp: 70 percent coaches, 80 percent blocks further
   growth, 85 percent blocks reads of other files, and 100 percent collapses the
   tool surface. The Prior Summary has a separate budget.
9. Qualified “shape compels production.” The seal can require nonempty
   sections and bounded structure, but it cannot prove that the content is
   insightful or correct.
10. Rebuilt the clear-and-inject account around the current escape-first X11 or
    tmux dispatcher and the `SessionStart(source=clear)` wake sequence.
11. Removed guarantees of perfect or fixed-cost continuity. The rolling summary
    is intentionally lossy; sealed-file references preserve a recovery path.
12. Marked the existing illustration as historical because it shows the old
    default thresholds and a literal 100-percent native wall. Diagram redesign
    remains outside this narration-source round.
13. Corrected the May 14, 2026 publication date, September 10 modification
    date, nine-minute reading time, RSS summary, adjacent-series descriptions,
    and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including the live
configuration, context sensor and gate, heartbeat, file-size gate, compaction
I/O, clear dispatcher, and wake hook. The private prototype was not modified.

Native behavior was checked against current official Claude Code documentation:

- [Explore the context window](https://code.claude.com/docs/en/context-window)
- [Environment variables](https://code.claude.com/docs/en/env-vars)

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional until
the B5 series is reviewed. Hadi's content lock remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit `a8620d4474d66084ef74ed349ae8b65273da8158`.
- Visible source reduced from about 3,900 to about 1,800 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
