# Hadosh Academy visual storytelling standard

All generated site visuals share a dark, hand-drawn chalkboard medium. The medium does not decide the image's job. Every storytelling image must be classified before generation on the information-to-art spectrum below.

## Five-category spectrum

| Code | Information | Art | Use when |
|---|---:|---:|---|
| `I90-A10` | 90% | 10% | Exact architecture, sequence, boundaries, labels, or causality must be reconstructed without distraction. |
| `I70-A30` | 70% | 30% | A precise explanation benefits from a restrained metaphor or more humane composition. |
| `I50-A50` | 50% | 50% | The image must teach a real relationship while also making the idea approachable and memorable. |
| `I30-A70` | 30% | 70% | A coherent scene carries the main experience, with a small amount of instructional structure. |
| `I10-A90` | 10% | 90% | The image primarily creates imagination, feeling, or memory; prose must carry the technical explanation. |

The endpoints are deliberately not `I100-A0` or `I0-A100`: even exact diagrams should have enough visual care to be inviting, and even artwork should retain some relationship to the page's idea.

## Decision rule

1. If a visitor must reproduce a system or sequence, start at `I90-A10`.
2. If metaphor helps but precision still dominates, use `I70-A30`.
3. If comprehension and atmosphere are equally important, use `I50-A50`.
4. If the human consequence or imagined world is primary, use `I30-A70`.
5. Use `I10-A90` only when prose already carries the explanation and the image's job is primarily emotional or imaginative.

A prominent page is not sufficient reason to choose more artwork. Technical blog diagrams may correctly remain information-heavy. Distribution is a review lens, not a quota that overrides an image's job.

Existing head, brain-network, profile, and digital-cortex artwork is established site vocabulary and is preserved unless a future task explicitly names it for replacement.

## Required metadata

Every displayed storytelling image slot must expose these attributes on its containing figure or visual wrapper:

```html
data-visual-style="I70-A30"
data-information-weight="70"
data-artistic-weight="30"
data-visual-role="storytelling"
```

Figures created by `js/story-visuals.js` receive the same attributes through `makeFigure`. The canonical per-slot record is `docs/storytelling-visual-inventory.md`.

## Completed delivery sequence

| Round | Scope | Result |
|---|---|---|
| Batch 1 | Home, Start Here, Agents, Projects, Blog index | Delivered; style corrections completed in the following PR. |
| Batch 2 | Seed Agent, Q-Seed, Team Harnesses, Family Games | Delivered; Family Games artwork preserved. |
| Batch 3 | Crime Cartography and Portfolio | Delivered. |
| Batch 4 | Blogs 2, 3, 4, and Blog 6.2b | Delivered as raster images. |
| Batch 5 | Blogs 6.10, 6.7b, and 8.5 | Delivered; final displayed illustrative SVG replacement completed. |
| Rebalance 1 | Home, Projects, Blog index | Delivered. |
| Rebalance 2 | Start Here and Portfolio execution ladder | Delivered. |

## Delivery requirements

- Use raster assets for generated storytelling artwork; do not use generated SVG stand-ins.
- Preserve unrelated existing images, especially founder headshots and established digital-cortex artwork.
- Display one image per content slot; do not maintain alternate rendered page versions.
- Make every blackboard storytelling image open through the shared fullscreen lightbox and close by the close button, backdrop click, or Escape.
- Use versioned filenames or cache-key updates when replacing a deployed visual.
- Verify exact labels, source references, page placement, mobile readability, image loading, and close behavior before merge.
- Inline SVG is permitted for functional charts, icons, and interface geometry; it is not a substitute for generated storytelling artwork.

## Acceptance status

The current inventory contains 74 displayed storytelling slots. All 74 are categorized, all 74 are covered by the shared lightbox, and no displayed storytelling slot references an SVG. Functional inline charts and non-story assets are explicitly excluded in the inventory.
