# Essay 5.4 review: Job Lifecycle

## TLDR

The essay keeps its central idea: the job is the spine that gives every other
cognitive mechanism a durable unit of work to belong to. The revision separates
`job_core`'s actual lifecycle ownership from the phase, plan, and summary
plugins around it; corrects creation, stop, approval, and completion mechanics;
and removes repeated implementation detail that obscured the narrative.

## Reviewed revision

- Canonical source: `blog/b5/05_4-job-core.md`
- Source version: `v0.4.0` (previously `v0.3.0`)
- Source SHA-256: `233ab422dce289897ddb488349a76c5d7d9381157ebfee803ddf1d413385292b`
- Published page: `blog/b5/05_4-job-core.html`
- Published-page SHA-256: `033e5414a08d1edd687ce8458de328b4387210dface785ed0cc88e01414d7113`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located `job_core` inside the earlier private Claude Code prototype rather
   than presenting its implementation as a universal agent standard.
2. Preserved the job-as-spine metaphor while narrowing `job_core`'s ownership
   to identity, lifecycle, focus, interactions, dependencies, approval, and
   stop behavior.
3. Removed the implication that `job_core` owns OPEVC phases, plan state, or
   every work artifact. Those remain plugin-owned extensions.
4. Rebuilt the creation section around the four live paths, including their
   CONDENSE restrictions and the prompt-bootstrap path.
5. Distinguished creation-time plugin approval from approval granted later to
   an already-focused job, and noted which approval survives reactivation.
6. Added the shallow dependency and voided-job behavior that controls whether
   related work blocks completion and Stop.
7. Corrected `plan_file` ownership and timing: it is introduced by
   `phase_plan`, decided after observation, and is not a `job_core` birth
   field.
8. Replaced the claim that the entire raw interaction list is reread as a
   “mega-prompt” every turn. The durable list records user direction; the next
   plugin keeps that history usable as it grows.
9. Qualified the shared-key model. A common job ID aligns plugin-owned records,
   while each plugin retains its own state, schema, gateways, and runtime
   coordination.
10. Corrected the stop hook from advisory friction to a blocking Claude Code
    hook inside the configured runtime, while preserving the operator boundary.
11. Rebuilt completion as a pre-question eligibility-and-shape gate followed by
    a post-question dependency, approval, and state-transition gate.
12. Corrected the “three kinds of done” chronology: job completion, CONDENSE
    completion, and cycle closure are separate changes that may occur near each
    other but do not happen as one atomic moment.
13. Corrected the May 14, 2026 publication date, September 10 modification
    date, eight-minute reading time, RSS summary, sitemap date,
    adjacent-series reading times, and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including the
`job_core` contract, canonical job-system glossary, planning ownership,
completion and reactivation rules, prompt hook, stop gate, and completion
question hooks. The private prototype was not modified.

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional until
the B5 series is reviewed. Hadi's content lock remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit
  `7509e91e48fb18621a375f0d91a69dff38788536` on May 14, 2026.
- Visible source reduced from about 2,475 to about 1,575 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
