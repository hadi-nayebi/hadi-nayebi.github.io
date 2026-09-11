# Essay 5.7 review: The CLAUDE.md Hierarchy

## TLDR

The essay keeps its central idea: plain instruction files can become an
inspectable working-memory bus when a phase protocol and execution gates are
built around them. The revision separates native Claude Code loading from the
prototype's four-footer machinery, corrects deflation and altered-list
enforcement, and removes a large amount of repeated hierarchy description.

## Reviewed revision

- Canonical source: `blog/b5/05_7-claude-md-hierarchy.md`
- Source version: `v0.5.0` (previously `v0.4.0`)
- Source SHA-256: `04d91652f0dd1272382fbfbd53ff1d6385781684b95ee2ba3babb29e73666298`
- Published page: `blog/b5/05_7-claude-md-hierarchy.html`
- Published-page SHA-256: `2148485c0915669d23f0311c6e0ad037087d7505fd558a9e5e64dbb55b11f477`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located the four-footer system inside the earlier private Claude Code
   prototype rather than treating it as native Claude Code behavior.
2. Rebuilt the native-loading section from current official documentation:
   project and ancestor instructions load from the launch path, nested files
   load on directory access, and instruction files shape behavior rather than
   replacing hooks or permissions.
3. Clarified that the prototype adds four working regions beneath a durable
   body and that CONDENSE has no fifth footer.
4. Corrected phase write boundaries and their forward asymmetry: each phase can
   write below its own anchor but cannot rewrite the durable body or earlier
   regions.
5. Preserved missing-anchor repair while adding its actual safety boundary:
   snapshots and ordered insertion for derivable absence; explicit blocking for
   duplicate or out-of-order anchors.
6. Qualified working-memory continuity. Nested instruction files reload on
   access and are not guaranteed to remain permanently present after context
   compaction.
7. Corrected CONDENSE from literal footer emptiness to the live gate requiring
   at least 80 percent deflation of the measured footer baseline.
8. Reframed condensation as an editorial judgment rather than automatic
   learning; a shaped process can still preserve a poor lesson.
9. Corrected the altered list as a hard hook boundary inside the configured
   runtime, while retaining the operator and gmode scope boundaries.
10. Simplified the hierarchy to root, brain index, plugin, project, and durable
    knowledge roles without tying the portable architecture to one website
    tree.
11. Clarified the asymmetry between plugin-owned operational JSON state and the
    phase layer's active use of the instruction hierarchy.
12. Removed the promotional Explore callout from the narration source and kept
    the existing diagram at its accurate concept level without redesign.
13. Corrected the May 14, 2026 publication date, September 10 modification
    date, eight-minute reading time, RSS summary, sitemap date,
    adjacent-series reading times, and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including the
shared section guard, phase-specific guards and altered-list trackers,
EXECUTE scope gate, CONDENSE deflation gate, plugin state model, and knowledge
routing rules. The private prototype was not modified.

Native behavior was checked against current official Claude Code documentation:

- [How Claude remembers your project](https://code.claude.com/docs/en/memory)

Factual, technical, chronology, cross-writing consistency, editorial, and
source-page parity gates pass for the exact source hash. Hadi's content lock
remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit
  `1c85308e1bc39d774acc78f3db3296a12f32735c` on May 14, 2026.
- Visible source reduced from about 2,760 to about 1,492 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
