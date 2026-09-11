# AGENTS.md — Hadosh Academy Writings

## Scope

These instructions apply to `blog/` and its descendants. A more specific
`AGENTS.md` may add requirements for its own series. The repository-root
instructions continue to apply.

## Canonical writing surfaces

- Numbered essay Markdown in `b1/` through `b9/` is the canonical prose for
  the technical and principle-writing series. Published HTML and later
  narration must follow that prose.
- The Observation series owns its canonical narration in episode JSON under
  `observations/information-system-of-a-planet/episodes/`.
- Practical-guide Markdown is the canonical prose for its matching HTML page.
- Transcript files are derived narration surfaces. An old `final: true` flag
  or an existing MP3 is not evidence that current prose and audio still match.

## Current narration-source scope

The approved source corpus for the current review contains:

- all 49 numbered essays in `b1/` through `b9/`;
- every published slide in the current Information System of a Planet
  Observation series; and
- `practical-guides/01-build-your-own-space-on-the-web.md`.

It excludes Explore pages and their diagrams, project and portfolio pages,
site navigation/onboarding/marketing pages, and every other extra page.
NoemaProjects is private and excluded. Do not add a Noema article, transcript,
audio asset, source text, or discovery link to this public repository without
Hadi's explicit publication approval.

## Written-content lock before narration

Do not create, regenerate, restore, or mark narration audio ready until its
canonical writing passes all applicable review gates against an exact source
hash:

1. factual and source review;
2. technical or historical review against current primary evidence;
3. chronology and maturity review that distinguishes current behavior,
   historical implementation, design intent, and future proposal;
4. cross-writing terminology and contradiction review;
5. editorial review for argument, redundancy, clarity, grammar, and reading
   flow;
6. parity review across canonical source and published page; and
7. Hadi's content approval.

Record unresolved claims as unresolved. Do not smooth uncertainty into a
stronger statement. A content lock becomes stale as soon as the canonical
source hash changes.

## Editorial change boundary

The five Part 1 principle writings — B1, B2, B3, B3.1, and B4 — are previously
approved conceptual work. Preserve their voice, thesis, imagery, and structure.
Make only restrained corrections for factual accuracy, avoidable repetition,
continuity, grammar, and a coherent spoken arc. Report every prose change.

These principle writings are philosophical, metaphorical, prospective essays
for professionals across many fields. They aim to change the frame around
models, harnesses, files, tools, hooks, jobs, and complex systems and to argue
for a healthier future, even while current products and terminology continue
to mature. Preserve at least roughly 90 percent of each approved essay's
language, structure, metaphors, voice, and narrative. Use a strict token-level
sequence comparison with the review baseline as a warning when the diff may be
too large; then judge the actual prose rather than optimizing the number.
Correct a metaphor only when its central relationship would materially mislead
the intended professional reader. Do not demand a literal one-to-one mapping,
flatten thought experiments into technical documentation, or trade poetic
force and narration flow for details that do not affect the principle. Signal
future scenarios as prospective; verify empirical support and concrete current
capability claims to the degree needed to protect the argument.

B5 through B9 are technical writings. Correct them as extensively as required
for accuracy. Prefer product- and framework-agnostic principles, and label a
specific prototype or reference implementation as such. Do not present a
historical private implementation as a currently shipped public architecture.
Use the owner-supplied Hadosh Academy Claude prototype as read-only
implementation evidence for B5-B8. Use the owning Origin repository and its
dashboard evidence for B9. Read the applicable owner instructions and live Git
state before relying on either source; do not copy private implementation text
into the public site without a reader-facing reason.

The Observation series is narrative nonfiction. Follow its nested scientific,
historical, sourcing, voice, and incremental-episode rules. The practical guide
must be safe, current, reproducible, and clear for its stated audience.

## Evidence and review report

Prefer official documentation, owning repositories, primary sources, and
peer-reviewed research. Keep source evidence machine-facing unless a reader
benefits from the citation. For each changed writing, preserve a concise review
record containing the source revision, issues found, changes made, evidence,
remaining uncertainty, and validation result. End the corpus review with a
short per-writing change report for Hadi.

Complete one numbered writing as an independent review unit: canonical prose,
published-page parity, metadata, evidence record, validation, and coherent Git
commit. After that unit passes, send Hadi one separate Telegram voice report
covering that writing's changes before beginning the next numbered writing.
These checkpoint recordings are review summaries, not publication narration.

## Pull-request delivery

Deliver every website change through a reviewable pull request. Do not merge a
pull request for Hadi. Each Part 1 principle writing — B1, B2, B3, B3.1, and
B4 — must have its own pull request so its language diff can be reviewed in
isolation. Technical writings may share a pull request when the grouping is
coherent and the per-writing review records remain distinct.

## Narration handoff

After Hadi approves the locked writing, build a narration transcript as its own
editorial artifact. Remove visual-only controls, source drawers, raw URLs,
code-only detail, and production annotations; retain explanations a listener
needs. Expand abbreviations and add pauses deliberately. Chunk by semantic beat,
then verify the assembled audio against the approved transcript and source hash.
Pronunciation experiments and voice-engine choices are a later gated phase.
