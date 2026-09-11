# Essay 5.1 review: The Two-Layer Foundation

## TLDR

The essay still opens the Always-On Digital Cortex series through the same
prototype, two plugin groups, multi-form substrate, single-concern principle,
historian-ratchet example, and real-estate analogy. The technical revision
changes the architectural frame around them: these are two behavioral groups
inside one older Claude-based prototype's cognitive layer, not the two layers
of every agent and not the current public Q-Seed implementation.

The largest corrections separate Claude Code's native instruction loading from
the prototype's own hooks and index; distinguish model context, durable files,
machine state, and deterministic controls; replace continuous-fire claims with
the actual event-specific hook registrations; and qualify plugin independence
as a tested interface discipline rather than guaranteed isolation.

## Reviewed revision

- Canonical source: `blog/b5/05_1-the-two-layer-foundation.md`
- Source version: `v0.7.0` (review began at `v0.5.0`)
- Source SHA-256: `ee83553fc9ccb3b96635f39eca173882301357d9507c875d285d5bdb41b014fa`
- Published page: `blog/b5/05_1-the-two-layer-foundation.html`
- Published-page SHA-256: `ac92da08eb8ba3a9d3036d92e28ece03f54240ef5aee112e0f14c3b65b7a920e`
- Hadi's narration-source approval remains pending.

## Changes made

1. **Established the maturity boundary.** The article now identifies its
   subject as an earlier private Claude-based prototype inside the cognitive
   layer. It does not claim to specify every seed agent or current public
   Q-Seed.
2. **Corrected Claude Code's loading behavior.** `CLAUDE.md` and
   `.claude/CLAUDE.md` are project instructions. Claude Code does not
   automatically load every file below `.claude/`; the prototype's own index
   and hooks connect the remaining compartments to runtime events.
3. **Corrected the role of `CLAUDE.md`.** The root file is described as
   project-level instructions rather than a persona or provider system
   message.
4. **Separated cognitive forms.** Prompt context, durable knowledge,
   configuration, machine state, and deterministic hooks now retain distinct
   roles instead of all being called memory.
5. **Located the two groups correctly.** Always-on and phasic are behavioral
   plugin groups inside the prototype. They do not replace Essay 4's broader
   model, runtime/framework, cognitive, and job architecture.
6. **Corrected hook frequency.** Phase-independent plugins attach to selected
   session, prompt, tool, question, and stop events. Individual plugins do not
   all fire for every event.
7. **Bounded the OPEVC summary.** The article keeps the high-level phase
   boundaries while deferring exact exceptions, budgets, and guard behavior to
   Essay 6.
8. **Qualified plugin anatomy.** A mature plugin may include hooks, scripts,
   state, tests, documentation, and coaching text; a smaller plugin need not
   fill every template slot.
9. **Qualified single concern.** Each plugin has one primary responsibility,
   while supporting functions and dependencies remain explicit.
10. **Grounded the historian ratchet.** The example now names the actual
    contribution from the question registry, lock manager, durable job
    authorization, historian sub-agent, and protected edit cycle. The grouped
    consistency pass corrected an earlier sentence that assigned capture of
    the concrete lock answer to `job_core`.
11. **Qualified isolation and addability.** Runtime guards reduce accidental
    coupling, but operating-system access can bypass conventions. Independent
    evolution and focused tests remain practical benefits that depend on stable
    interfaces and integration checks.
12. **Repaired metadata and stale audio.** The publication date now matches
    the introducing commit and RSS record on May 14, 2026; the page records the
    September 10 revision and a seven-minute reading time. Page, RSS, blog
    index, and adjacent-series summaries use the corrected frame. The old MP3
    player is removed because its recording predates this source revision.
13. **Made evidence readable.** Fifteen page-length legacy annotations were
    replaced with eight concise references tied to the exact prototype
    components supporting each technical claim.

## Evidence and review state

Prototype-specific claims were checked against the private Claude reference at
parent revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including its
brain index, plugin registry, hook configuration, phase guards,
`plugin_integrity`, `job_core`, `question_discipline`, and historian flow. The
private prototype was read as evidence and was not modified.

Claude Code's native instruction-loading boundary was checked against current
official documentation:

- [Claude Code project memory](https://code.claude.com/docs/en/memory)

Factual, technical, chronology, cross-writing consistency, editorial, and
source-page parity gates pass for the exact source hash. Hadi's content lock
remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit `57b783c3f0daacf871c7d9063f5413d424cbd781`.
- Source reduced from about 1,670 to 1,640 visible words while correcting the
  architecture and retaining the narrative examples.
- Narration corpus and relevant repository validators: passed.
- `git diff --check`: passed.
