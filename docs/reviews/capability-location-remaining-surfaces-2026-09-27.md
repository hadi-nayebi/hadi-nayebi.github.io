# Capability-location remaining-surface review — 2026-09-27

## Source and scope

- Baseline website `main`: `3be4787969707cd2f6706af5245044aaf04de6f0`.
- Governing decision: Hadi's September 26 REVISE ruling in Departments Issue #188.
- Included: the File and Memory File definitions plus the Compaction Chain card data, audio guide, and orientation thesis.
- Excluded: Essay 1, which was accepted and merged through website PR #187; its current content-card excerpt already matches the governing architecture. The shared explorable accessibility repair remains isolated in website PR #183.

## Issue found

The primitives guide made universal claims about where all remembered information comes from. The Compaction Chain described a private historical mechanism as though a Seed's whole mind universally lived on disk. Both obscured the narrower, prescribed architecture: inspectable project memory, jobs, rules, decisions, corrections, and state live in the user-owned filesystem; the model and runtime remain parts of the operating system.

## Changes made

- `File` now defines persistent, inspectable project information and explains that the harness selects filesystem state for a future context.
- `Memory File` now describes selected learning, correction, reinjection, inspection, revision, and compatible-runtime portability.
- The Compaction Chain now says this historical Seed reconstructs operational continuity from project files after a clear.
- The mechanism, layout, links, controls, thresholds, and implementation references are unchanged.

## Evidence and validation

- The three Compaction Chain files are byte-identical to the previously rendered correction set:
  - cards blob `061bba3d5ac62b0c259fb333cb6a04b4729834da`
  - guide blob `bcbcf940210d8a8a2111e7cad03f634034fda5a8`
  - page blob `a28ff4f3730ed8d5804d7be532a88b33298bdcee`
- That exact Compaction Chain copy was previously rendered at 360, 412, 768, and 1440 px with no horizontal overflow and with the revised thesis visible.
- The current Essay 1 card excerpt was inspected on `main`; it already distinguishes model capability, harness action, and user-shaped filesystem identity, so no competing change was made.
- The primitive definitions are Markdown-only text changes; headings and surrounding document structure are unchanged.
- No private repository identity, private path, unpublished implementation detail, narration state, or publication action is included.

## Remaining boundary

Repository checks must pass on the replacement pull request's exact head. Hadi controls merge and publication. No narration, recording, distribution, or external promotion is authorized.
