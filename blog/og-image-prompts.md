# OG Image Asset Record — Resolved

Last verified: September 29, 2026.

This path previously contained a generation brief claiming that five local
`og:image` files were missing and 21 article cards were broken. That claim
became stale. The B5 asset had already been added, and the B6–B8 prompt targets
used obsolete `assets/images/blog/...` paths instead of the canonical
series-local paths referenced by the published HTML.

## Verified canonical assets

| Series use | Canonical referenced file | State |
| --- | --- | --- |
| B5 shared card | `blog/b5/images/always-on-digital-cortex-b5.png` | present |
| B6 shared card | `blog/b6/images/markov-phasic-brain-b6.png` | present |
| B7 shared card | `blog/b7/images/plugin-kit-b7-banner.png` | present |
| B7 opener body diagram | `blog/b7/images/plugin-cell-anatomy-b7-1.png` | present |
| B8 opener card | `blog/b8/images/three-growth-axes-b8-1.png` | present |
| B8.2 card | `blog/b8/images/four-stages-b8-2.png` | present |
| B8 shared later-series card | `blog/b8/images/maturation-arc-b8-banner.png` | present |

There is no active five-image generation backlog at this path.

## Executable check

`scripts/validate-og-images.mjs` scans public HTML, resolves same-origin
`og:image` and `twitter:image` URLs to repository files, and fails when a
referenced local card is absent. The site-navigation workflow runs both its
positive/negative controls and the complete repository scan.

This record remains at the old path so repository links to the former brief
resolve to corrected state instead of preserving a false production claim.
