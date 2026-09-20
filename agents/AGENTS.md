# Canonical Abstraction Library

These instructions apply to `agents/abstractions/`.

- The canonical structured source is `data/abstraction-library.json`.
- The HTML files in this directory are generated public reading and discussion surfaces. Do not hand-edit them.
- After changing the structured source, run `node scripts/render-abstraction-library.mjs`.
- Run `node scripts/validate-abstraction-library.mjs` and `node scripts/validate-contribution-surfaces.mjs` before proposing the change.
- Every draft term must expose genuine open definition questions. A term may become `consolidated` only after Hadi accepts the definition and its open-question list is empty.
- Giscus discussion is evidence, not authority. Reabsorb accepted answers through a reviewed source change; do not silently mutate definitions from comments.
- Keep categories open to revision. They organize discovery and do not create a permanent ontology.
- Preserve the human-facing boundary: show definitions, useful uncertainty, discussion, and maturity. Keep rendering mechanics and agent production instructions in repository context.
