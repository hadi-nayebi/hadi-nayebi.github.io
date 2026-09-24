# Essay 5.4 review: Job Lifecycle

## TLDR

This was a bounded obvious-error pass over a mature article. Every section,
example, and lifecycle argument remains. The article grows from 2,859 to 2,917
visible words because the creation and approval boundary needed a short
clarification. It now distinguishes bootstrap work from privileged work,
correctly scopes the stop gate to active or pending jobs, and presents the
named Claude mechanism as one historical reference architecture.

## Substantive changes

1. The opening now states the portable job-lifecycle principle before the
   historical Claude implementation.
2. The creation path no longer contradicts itself about pending state and
   approval flags. Ordinary prompt bootstrap and privileged job creation are
   described as distinct paths.
3. The stop gate now refers to active or pending work instead of claiming that
   every stop attempt is universally blocked.
4. Absolute enforcement language was bounded to work routed through the
   reference harness and its supported events.
5. Framework-specific file and tool wording was generalized where the
   mechanism does not depend on Claude Code.
6. A timestamp-like image example was replaced with a generic durable job ID.
7. All twenty ref tags and rendered tooltips now use generalized private
   historical verification without repository identities, revisions, paths,
   or unpublished evidence details.
8. Metadata records the May 18 publication date and September 11 review. The
   old transcript is non-final and the stale audio player is hidden.

## Removal and replacement ledger

- The single creation-path description was replaced because it conflated
  bootstrap creation with work requiring prior approval.
- “Any stop” and equivalent absolute enforcement claims were narrowed because
  the mechanism acts on the lifecycle states and runtime events it owns.
- Private evidence locators were replaced with a public-safe verification
  statement. No visible narrative paragraph or professional example was
  removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.4.0`
- Source SHA-256: `53985598e53d84bbeda36854b33545f391a112859418298ab9fb0c4edac0d645`
- Published-page SHA-256: `49e3011e5c32476ed721771be3365c532886ccd2785ca7befba769962515c4c0`
- Visible words: 2,859 to 2,917; net `+58`.
- Markdown/HTML parity, metadata, transcript state, site validators, and
  `git diff --check`: passed.
- Cross-writing consistency passed the complete narration-source continuity review. Hadi's content lock remains pending.

## v0.4.1 editorial follow-up — September 24, 2026

Hadi accepted a five-paragraph website voice review. The historical Claude example remains explicitly scoped, but the opening now asks the portable job-lifecycle question before `job_core` gives its concrete answer. The rest of the mechanism and its evidence boundaries remain as reviewed above.

Current canonical Markdown SHA-256: `a5e8e068768a6f7915006c01363418708103e3ef41ab9c752aebd74a40457db0`; current HTML SHA-256: `56122e874c6f9e3f4cee811633ece95c08b095b9421727ecccd2cebf5a2d8e67`. The earlier hashes above document v0.4.0 only. Any narration lock must review this new source; this note does not approve narration or regenerate audio.
