# Earlier-episode continuity recovery

## Finding

PRs #209, #210 and #211 merged 15 paragraph edits across Episodes 1–9. Each added paragraph was compared with the live episode JSON and found present on October 8, 2026 UTC. A fresh reader also displayed the merged Episode 1 opening. A subsequent exact-wording audit found that this merged opening was a compressed rewrite of the accepted proposal, rather than the proposal itself. Their Pages deployment succeeded; this is not a failed deployment of those 15 edits.

The final coherence review in the [shared October 7 session](https://chatgpt.com/share/6ac6f3de-877c-83e9-bf25-3ef4d0152fae?ogimg=plain) proposed two more transition edits. Hadi then asked to finalize Episodes 1–9. Those two transitions were omitted from the merge handoff and remained absent from live JSON. This PR carries those discussed transitions and restores the agreed Episode 1 opening.

## Episode 3, slide 7

Before:

> The next episode is about the performance change, not an invented timestamp.

After:

> Somewhere in the human lineage, communication would become far more open-ended. We cannot date its first sentence. But we can explore what changed when messages could express possibilities no one had described before.

## Episode 6, slide 6

Before:

> No portability bridge.

After:

> And before a written message could reach another reader, someone had to carry it. A single tablet might travel easily. An entire library was another matter.

## Verification and instruction disposition

The reader fetches episode JSON on initialization; an already-open page retains its loaded content until reload. No automatic polling is introduced.

The rendering workflow previously selected only Episodes 11 and above. That would give an unrelated green check for a retrospective edit to Episodes 3 or 6. It now selects the episode JSON files actually changed in the revision, falling back to the existing new-episode sweep for shared reader changes. This repairs evidence coverage without adding another editorial approval gate. Review-time claims must trace the agreed passage to actual diff, rendered text and deployment; proposed discussion text alone is not an applied correction.

No image, source, audio, chronology, numbering, act banner or historical boundary is changed. No publication occurs before Hadi merges this PR.

## Episode 1, slide 1 — approved wording was rewritten during implementation

Hadi accepted the proposed blended narration and said to apply the changes. PR #209 instead combined the dating evidence with the opening, replaced “information was already finding ways to survive” with a technical summary, and retained the old second paragraph. The deployment faithfully served that altered implementation. The October 8 initial audit checked merged-diff-to-live parity and incorrectly treated that as approved-draft parity.

Restored verbatim:

> Earth is about 4.54 billion years old. For most of that history, there were no brains, no books, no voices. Yet information was already finding ways to survive.

> At least 3.5 billion years ago, microbial life was already here. Somewhere in that immense stretch of time, living chemistry acquired a remarkable ability: patterns could persist by helping produce new generations of life.

The existing DNA qualification is retained immediately afterward; the now-duplicated introductory sentence is removed. The slide's facts, source links, image and audio placeholder are preserved.

Instruction correction: compare accepted before/after passages with canonical paragraph arrays, including paragraph boundaries. A blend-style direction is not evidence that a materially different opening satisfies a later request to preserve the agreed wording. Verification must distinguish discussion-to-diff parity from diff-to-live parity.

## Full shared-session audit — all earlier-episode decisions

Sixteen distinct accepted passage targets were traced from the complete earlier-episode discussion to merged #209–#211 and the current #216 branch. Counts of changed JSON paragraphs in the former PRs were not counts of accepted editorial targets. The current #216 head already matched seven targets; nine additional targets needed repair: five changed wordings and four compressed paragraph structures.

| Episode / slide | Accepted target | Finding before this follow-up |
|---|---|---|
| 1 / 1 | Earth is about 4.54 billion years old. For most of that history, there were no… | already exact |
| 1 / 5 | For billions of years, the long history of life was carried forward through ge… | wording changed |
| 2 / 1 | Imagine an animal discovering a safer route, a new food source, or a better wa… | wording changed |
| 2 / 4 | No page crosses the ocean. No permanent recording travels with the whales.… | wording changed |
| 3 / 1 | Deep in a forest, a monkey gives an alarm call.… | wording changed |
| 4 / 1 | Somewhere across millions of years of human-lineage history, voices and gestur… | already exact |
| 4 / 3 | A community does not need a separate signal for every possible thought. A limi… | already exact |
| 4 / 3 | A message no longer needs to be one of the messages that came before. Familiar… | already exact |
| 5 / 1 | A story can cross generations, but only while people keep remembering, perform… | already exact |
| 6 / 1 | Clay can preserve a mark for millennia. But preservation is not understanding.… | paragraph boundaries compressed |
| 7 / 4 | There was no single path from clay to papyrus, parchment, and books. Across th… | paragraph boundaries compressed |
| 8 / 2 | The expensive work moved to the beginning. Carve the page once, then print it … | wording changed |
| 8 / 4 | The page had become programmable. Its pieces could be arranged, used, taken ap… | paragraph boundaries compressed |
| 9 / 2 | The book was becoming a kind of random-access memory. Instead of moving throug… | paragraph boundaries compressed |
| 3 / 7 | Somewhere in the human lineage, communication would become far more open-ended… | already exact |
| 6 / 6 | And before a written message could reach another reader, someone had to carry … | already exact |

All sixteen accepted passages now occur contiguously and verbatim in canonical paragraph arrays. Context surrounding the three printing/retrieval excerpts is preserved in separate preceding paragraphs. No unrelated narration was rewritten. Full quoted before/after evidence is in `2026-10-08-early-session-passage-audit.json` beside this record.

### Non-edit decisions and instruction readback

- Keep the catalogue-maintenance passage (“The map had to be updated because the territory kept accepting donations”) unchanged: verified verbatim in Episode 9.
- Keep Episode 9's ending intact until the next act's structure is settled: no replacement wording was approved, so this audit does not invent an ending.
- Keep the four acts as an internal editorial map, not visible banners: I, Episodes 1–2, survival beyond one life; II, 3–4, greater expressive capacity; III, 5–7, memory outside living carriers; IV, 8–9, replication and addressability. A fifth “Knowledge Begins to Compound” was provisional and is not installed as a public title or fixed episode count.
- Preserve recognizable computing analogies, humor, precise mechanisms and scene-driven narration. Do not purge jargon or insert repetitive apologies explaining obvious metaphors. The accepted signature is recorded in the series AGENTS.md; source qualification stays in source drawers and genuine uncertainties remain in narration.
- The production job already preserves the accepted signature, information-as-protagonist lens, conversational before/after review, and conceptual acts; those directions were not missing from its instruction record. This website clarification makes the same accepted signature available to future series work.
- The Episode 3 closing and Episode 6 portability bridge remain restored in #216. Proposed commentary about future institutions, crafts, correspondence, experiment and correction was carried into the later accepted architecture; it did not approve another Episode 9 rewrite.

The audit is restricted to the last session's earlier-episode decisions before production of Episodes 11–14. Those episodes, images, numbering and sources are unchanged by this follow-up. The inherited damaged Episode 3 slide 2 JPEG remains a separately recorded asset defect.
