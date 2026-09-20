# Canonical Abstraction Library

These instructions apply to `agents/abstractions/`.

- The canonical structured source is `data/abstraction-library.json`.
- The HTML files in this directory are generated public reading and discussion surfaces. Do not hand-edit them.
- After changing the structured source, run `node scripts/render-abstraction-library.mjs`.
- Run `node scripts/validate-abstraction-library.mjs` and `node scripts/validate-contribution-surfaces.mjs` before proposing the change.
- Every draft term must expose genuine open definition questions. A term may become `consolidated` only after Hadi accepts the definition and its open-question list is empty.
- Giscus discussion is evidence, not authority. Reabsorb accepted answers through a reviewed source change; do not silently mutate definitions from comments.
- Preserve the minimal public surface: term name, `draft` or `consolidated` state, current definition, open questions, and discussion. Add another visible section only after a demonstrated visitor need and Hadi's approval.
- The definition is the single canonical context block. Supporting production notes, implementation prompts, categories, relationship models, and agent instructions stay outside the public term page.
