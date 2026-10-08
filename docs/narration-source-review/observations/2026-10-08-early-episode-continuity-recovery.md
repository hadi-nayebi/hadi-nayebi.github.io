# Earlier-episode continuity recovery

## Finding

PRs #209, #210 and #211 merged 15 paragraph edits across Episodes 1–9. Each added paragraph was compared with the live episode JSON and found present on October 8, 2026 UTC. A fresh reader also displayed the revised Episode 1 opening. Their Pages deployment succeeded; this is not a failed deployment of those 15 edits.

The final coherence review in the [shared October 7 session](https://chatgpt.com/share/6ac6f3de-877c-83e9-bf25-3ef4d0152fae?ogimg=plain) proposed two more transition edits. Hadi then asked to finalize Episodes 1–9. Those two transitions were omitted from the merge handoff and remained absent from live JSON. This PR carries exactly those discussed transitions.

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
