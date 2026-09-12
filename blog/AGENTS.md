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
Owner-identified unpublished writing is excluded. Do not name, add, summarize,
or create a transcript, audio asset, source copy, or discovery link for excluded
material in this public repository without Hadi's explicit publication approval.

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
to mature. Preserve Hadi's declarative voice. Do not weaken an architectural
definition, future-facing argument, or thought experiment merely because the
future has not fully arrived. Distinguish concrete present-product claims,
proposed architectural definitions, prospective arguments, and metaphors.
Judge a metaphor by whether its central relationship illuminates the concept,
not by literal one-to-one equivalence. Preserve at least roughly 90 percent of each approved essay's
language, structure, metaphors, voice, and narrative. Use a strict token-level
sequence comparison with the review baseline as a warning when the diff may be
too large; then judge the actual prose rather than optimizing the number.
Correct a metaphor only when its central relationship would materially mislead
the intended professional reader. Do not demand a literal one-to-one mapping,
flatten thought experiments into technical documentation, or trade poetic
force and narration flow for details that do not affect the principle. Signal
future scenarios as prospective; verify empirical support and concrete current
capability claims to the degree needed to protect the argument.

Essay 4, "The Language of Agents," has an explicit terminology exception for
the 2026-09-10 review. It is an older vocabulary essay and may be revised or
expanded beyond the usual preservation threshold where the current harness
model is absent or incomplete. Preserve its central message and accessible
professional voice while bringing its account of models, files, runtime,
instructions, memory, tools, commands, hooks, permissions, jobs, skills,
plugins, verification, and assembled systems into a coherent vocabulary.

B5 through B9 are technical writings. Correct them as extensively as required
for accuracy. Prefer framework-generic language such as CLI agent, project
instructions, harness, runtime, hooks or events, and durable state. Mention
specific frameworks and their conventional instruction files parenthetically
when an example helps. Label the earlier Claude-based system in B5-B8 as one
historical reference architecture rather than a universal or current Hadosh
architecture. Private historical evidence may be consulted read-only, but no
private repository identity, revision, source path, internal compartment name,
or unpublished implementation detail may enter this public repository, its Git
history, review reports, ref tags, rendered tooltips, tests, or PR text. Public
records may say only that a claim was checked against a private historical
prototype. Keep sensitive-name scanning and its configuration outside this
repository. Use the public Origin repository and its public dashboard evidence
for B9.

The objective of this review is to make each writing better: improve its
explanations, descriptions, examples, narrative arc, factual accuracy, and
useful reader-facing references. Article length, audio duration, editing speed,
token use, and the number of changes are outcomes or diagnostics, never review
objectives. Begin each technical writing from its untouched canonical version
at the accepted baseline plus the owner-supplied reference evidence; do not use
a compressed rewrite as the source. If the intended result or a consequential
editorial choice is genuinely unclear, ask Hadi before making that dependent
change rather than inventing a proxy objective.

Judge repetition by the work it performs in the whole arc. An idea may return
after new context to reinforce the reader's model. When that return is useful,
reword it, deepen it, or approach it from the new angle rather than deleting it.
Remove prose only when it is false, misplaced, or actual duplication that adds
no reader value. The per-writing report must identify every substantive
removal or replacement and explain why it improves the reader's result. Record
baseline and final visible word counts as outcomes only; a shorter or longer
article does not establish quality.

The Observation series is narrative nonfiction. Follow its nested scientific,
historical, sourcing, voice, and incremental-episode rules. The practical guide
must be safe, current, reproducible, and clear for its stated audience.

## Evidence and review report

Prefer official documentation, public owning repositories, primary sources,
and peer-reviewed research. Keep source evidence machine-facing unless a reader
benefits from the citation. For each changed writing, preserve a concise public
review record containing the public source baseline, issues found, changes
made, public evidence, generalized private verification where applicable,
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

Record the public destination in the transcript before rendering. A standalone
writing uses one repository-relative `audio.publication_path` under that
writing directory's `audio/` folder. A grouped Observation transcript records
the canonical `slide_audio_path` on every chunk. Publication tooling must use
these explicit paths and refuse absent, absolute, traversing, or conflicting
destinations; it must never infer a filename from a title or slug.

Keep three forms distinct:

- canonical source prose remains the authority for meaning;
- readable narration text contains only words a listener should hear and may
  translate eye-oriented notation into equivalent spoken prose; and
- render-only text may use tested English respellings for names, acronyms,
  filenames, commands, or context-dependent homographs.

Do not rewrite the readable transcript in IPA. The current Qwen clone interface
does not expose a documented phoneme-input channel, and local trials found that
raw IPA and ARPAbet-like input were spoken as unrelated words or letters. Store
IPA only as pronunciation reference metadata. Put tested English respellings in
the render-only field, preserve their readable spelling separately, and require
an ASR check for every protected term.

Keep canonical spelling when the fixed-seed render already pronounces a term
correctly. Add an override only when a bounded same-seed comparison proves a
specific failure and the replacement fixes it without degrading rhythm.

Before a mass render, produce one representative technical-writing transcript
and a short pronunciation comparison. Hadi reviews voice identity, pace,
prosody, pauses, and protected-term pronunciation. Keep the transcript and
audio in review state until that checkpoint passes. After approval, generate in
bounded batches with exact source hashes, per-chunk timing, actual-duration
assembly, transcript round-trip checks, clipped-ending and filler-leak checks,
and decoded-media validation. A passing machine check does not replace the
voice-quality checkpoint.

Use one consistent Qwen-cloned Hadi voice across a publication narration unless
Hadi approves an engine change. Public players identify it concisely as
`Cloned voice: Hadi (Qwen).`
