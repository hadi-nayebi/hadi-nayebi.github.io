# Essay 5.3 review: Context Window Discipline

## TLDR

The article keeps its full conceptual route: the context ceiling, durable
compaction file, progressive squeeze, shape-compels-production principle,
clear-and-inject boundary, failure case, and architect customization. The
review corrects the implementation model underneath that route. The current
article distinguishes provider compaction from the historical prototype's
earlier job-scoped discipline, replaces the obsolete single-file account with
the compaction chain, and explains the separate context, heartbeat, and
file-size pressures that lead to a recoverable seal.

The baseline contained 3,886 visible words; the reviewed article contains
3,718. The net reduction removes obsolete threshold explanations and repeated
descriptions that contradicted the current mechanism. No section, professional
example, portable principle, or stage of the narrative was removed.

## Reviewed revision

- Canonical source: `blog/b5/05_3-brain-guard.md`
- Review baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Source version: `v0.9.0` (previously `v0.3.1`)
- Source SHA-256: `9ac4569f132d5bbe79d8bd979524e4ccbe378b213009efe857988f5b572bded0`
- Published page: `blog/b5/05_3-brain-guard.html`
- Published-page SHA-256: `bd67b675c6611c45005b0f4e539104f592e24277c4476d16e0da77c56627d327`
- Hadi's narration-source approval remains pending.

## Changes made

1. **Bounded the architecture historically.** The article now presents
   `brain_guard` as one earlier Claude-based reference architecture rather
   than a universal feature of CLI agents or the current public Seed.
2. **Separated native and added compaction.** Claude Code already provides
   manual and automatic compaction. The prototype adds an earlier,
   inspectable, job-scoped carry and normally uses a seal-and-clear boundary;
   native compaction remains available inside its maintenance mode.
3. **Replaced the single-file model with the chain.** A job, run, and sequence
   identify each working file. Sealed files remain recoverable, while a
   bounded Prior Summary indexes earlier sequences.
4. **Corrected how condensation works.** The live file grows during work, then
   its authored sections may be folded and deduplicated at the seal. That is
   distinct from ordinary CONDENSE cleanup.
5. **Corrected the context ramp.** The current prototype uses total context,
   not accrued context, for its access gate. The checked-in experimental
   values are 31, 39, and 42 percent; 20, 25, and 30 percent remain defaults.
6. **Separated the heartbeat.** Session accrual still drives metacognitive
   cadence: two required reflections and three recommended reflections per
   10,000-token window, with an eight-call hard-floor cap.
7. **Made progressive restriction recoverable.** Read closes before the
   remaining file tools; Bash, the focused compaction file, and operator
   recovery remain available so the gate cannot design a dead end.
8. **Corrected the file-size ramp.** Only authored work sections count toward
   the roughly 2,000-word target. Coaching begins at 70 percent, a warning at
   80, blocking at 85, and the absolute ceiling at 100. Prior Summary has a
   separate budget.
9. **Corrected the ceiling behavior.** Crossing a ceiling does not compact
   automatically. It narrows the permitted path until the agent authors the
   missing cognition, seals the sequence, and invokes the boundary.
10. **Expanded the seven-section shape.** Five authored cognitive sections
    are joined by an automatically fed commit trail and a separate settled-
    decisions ledger. Phase-specific prompts change the questions without
    changing the shared structure.
11. **Bounded “shape compels production.”** Required structure makes omitted
    thinking visible and raises the cost of shallow reflection; it does not
    prove that the resulting content is correct or insightful.
12. **Corrected clear-and-inject.** The sealed cognition reloads from disk at
    the fresh session boundary. Terminal injection carries the boundary and
    follow-up rather than pasting the complete cognitive file.
13. **Clarified completion and focus boundaries.** Job completion requires a
    seal before close. Refocusing reloads an existing chain; first focus creates
    one. Prompt-bootstrap and pause retain their distinct behavior.
14. **Bounded fixed-cost memory.** Routine loading stays bounded and the Prior
    Summary is intentionally lossy. Exact older detail remains recoverable
    through preserved files and back-references.
15. **Corrected the failure comparison.** Without the plugin, Claude Code
    still creates structured compaction summaries. What is missing is the
    separately authored, inspectable job cognition and recovery chain.
16. **Updated customization guidance.** Context-window configuration now
    distinguishes standard and extended provider windows, and the threshold,
    file-shape, metacognition, dispatch, and stage-count controls match the
    inspected reference architecture.
17. **Withheld the obsolete diagram.** The existing image encodes retired
    thresholds. Diagram work is outside this narration round, so the factual
    article no longer presents it as current evidence.
18. **Corrected metadata and narration state.** The page now records the May
    14 publication date, September 2026 revision, fifteen-minute reading time,
    updated feed description, non-final transcript, and no stale audio player.

## Removal and replacement ledger

- **“Replaces native `/compact`” was removed as an unqualified claim.** The
  replacement explains what Claude Code supplies and what the reference
  architecture adds.
- **The per-session single compaction file was replaced by a sequence chain.**
  This preserves the durable-memory argument while matching the actual sealed
  and rolled structure.
- **“Built gradually, never condensed” was replaced.** The live file is not
  ordinarily metabolized, but the seal deliberately folds its authored
  sections before carrying them forward.
- **The old 20/25/30 live-threshold account was replaced.** Those values are
  defaults; 31/39/42 are the current experimental override.
- **Accrual language was removed from the context gate.** Accrual belongs to
  the heartbeat cadence, while the access ramp measures total context.
- **The symmetric-ramp description was replaced.** The context and file-size
  ramps share progressive pressure but have different bands and measurements.
- **The claim that a ceiling effectively fires compaction was removed.** The
  agent must complete and invoke the seal; the mechanism does not invent
  missing cognition or pretend an unavailable dispatch succeeded.
- **The five-section-only description was expanded.** It omitted the commit
  trail and settled-decisions ledger and did not explain phase-flavored prompts.
- **The claim that structure guarantees substantive cognition was narrowed.**
  Structure forces an attempt and exposes omissions; verification still
  determines correctness.
- **Descriptions of pasting the compaction file through the terminal were
  replaced.** Session-start machinery reloads cognition from disk.
- **The perfect fixed-cost-memory implication was replaced.** Routine context
  remains bounded, but compression is lossy and precise recovery follows
  durable back-references.
- **The “default compaction keeps scraps” comparison was removed.** Provider
  compaction is structured; the architectural addition is a separately
  authored job-specific record.
- **The stale diagram and audio player were withheld.** Both represent the
  superseded article. Their source assets remain available for later approved
  regeneration.
- **Private evidence locators were removed from every ref tag and rendered
  tooltip.** The public record identifies only generalized private historical
  verification, while current provider claims link to public documentation.

## Evidence and review state

Current Claude Code behavior was checked against its public environment-
variable, context-window, and model-configuration documentation. Architecture-
specific claims were checked read-only against a private historical prototype.
Its identity, revision, paths, and unpublished evidence details are omitted.

Factual, technical, chronology, editorial, metadata, and source-page parity
gates pass for the exact source hash. Cross-writing consistency remains
provisional until the rest of B5-B9 is reviewed. Hadi's content lock remains
pending.

## Validation

- Visible words: 3,886 at baseline; 3,718 after review; net `-168` (`-4.3%`).
- Canonical Markdown and published article body: in sync.
- Existing transcript: explicitly non-final; stale player hidden.
- Public provider documentation:
  `https://code.claude.com/docs/en/env-vars`,
  `https://code.claude.com/docs/en/context-window`, and
  `https://code.claude.com/docs/en/model-config`.
- Relevant repository validators and `git diff --check`: passed.
