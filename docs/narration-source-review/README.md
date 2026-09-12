# Narration Source Review

This review locks the written corpus before any narration is generated. Its
scope and gates are defined in [`blog/AGENTS.md`](../../blog/AGENTS.md).

## Baseline

The review branch starts from website PR 104 at commit
`9985d0b9c57040ba803747b25968b3747960b65e`, one commit ahead of website
`main` at the time the review began. PR 104 already corrects user-owned Seed
framing in B7.9 and B8.1. Its changes are part of this audit. Open PR 105
touches unrelated forms and project-summary files and is not part of the
baseline.

The machine census is captured in `baseline.json` and can be regenerated with:

```bash
node scripts/audit-narration-source-corpus.mjs --json
```

The source hashes in that snapshot identify the prose that was actually
reviewed. They are not narration approvals.

## Confirmed corpus

- 49 numbered essays: 5 Part 1 principle writings and 44 technical writings.
- 6 published Observation episodes containing 40 narrated slides.
- 1 practical guide.
- Owner-excluded unpublished writing, Explore pages, diagram narration,
  project and portfolio pages, and every other website page are excluded.

## Baseline findings

1. **Publication labels do not represent content readiness.** All 40 B5-B8
   canonical Markdown files still say `status: draft`, while all have public
   HTML. The four B9 canonical Markdown files have no frontmatter or status.
   None can be treated as narration-locked.
2. **Implementation evidence needs a fresh pass.** B5-B8 contain 653 inline
   evidence annotations. File-existence and stable-pointer checks found no
   literal missing source file after accounting for two deliberate wildcard or
   placeholder references, and no duplicate slugs or line-number pointers.
   Seventeen evidence summaries exceed the existing 120-word legibility cap.
3. **Code drift is widespread enough to invalidate old review assumptions.**
   Twenty-eight of the 40 B5-B8 essays cite at least one implementation source
   file whose owning repository changed after the essay's latest website
   commit. This does not prove that each claim became false; it proves those
   claims need current semantic revalidation.
4. **One known technical contradiction is already present.** B5.3 describes
   retired 20/25/30 percent context thresholds, while the current documented
   prototype uses context accrued over a post-clear baseline. This requires a
   substantive correction in the essay and matching public HTML.
5. **Part 1 contains several claims that need narrower wording or primary
   support.** The review targets include categorical statements about model
   memory and learning, the cost of model training, human-brain stasis,
   prehistoric decision complexity, mRNA performing chemistry, the meaning of
   a CLI instruction file, universal hook behavior, and dated product-growth
   statistics. These are findings to resolve, not permission to rewrite the
   approved conceptual arc.
6. **The legacy HTML generator cannot establish parity.** A clean rebuild of
   B1-B8 currently regresses canonical URLs, directory depth, navigation,
   storytelling metadata, public contribution guidance, cache versions, and
   audio state. It also contains an owner-excluded unpublished sidebar entry. The review
   must use a safe parity check or repair a Codex-owned build path before
   rebuilding published pages. The legacy page generator remains untouched.
7. **B9 cannot use the legacy generator at all.** Its four Markdown files lack
   the frontmatter that generator requires. Their canonical-source and page
   relationship must be normalized before content lock.
8. **Observation has the strongest source structure.** Every slide already
   separates narration from source links and reserves audio as a placeholder.
   At the original review baseline, its 34 slides still required claim-by-claim source support, chronology,
   uncertainty, narrative-continuity, and editorial review.
9. **The practical guide needs a clean-room reproduction pass.** Every user
   action, product label, privacy choice, and GitHub Pages step must be tested
   from the intended beginner perspective before the prose is locked.

## Review order

1. Part 1 principle writings: minimal factual and editorial corrections, then
   a five-essay continuity read.
2. B5-B9 technical writings: current implementation evidence, maturity and
   chronology, cross-series consistency, then editorial review.
3. Practical guide: procedural reproduction, privacy/safety, and editorial
   review.
4. Observation: slide-level scientific and historical evidence, episode and
   series continuity, then editorial review.
5. Canonical-source/public-page parity and exact source-hash capture.
6. Hadi content review. Narration work remains blocked until this gate closes.

Every changed page will receive a concise final report of the issue, the
change, the evidence used, and any remaining uncertainty.

Machine-readable review locks live as one JSON file per writing under
`reviews/`. Keeping each record independent lets the principle writings ship as
separate pull requests without creating a shared-index merge conflict. The
corpus audit accepts a review record only when its source SHA-256 still matches.
