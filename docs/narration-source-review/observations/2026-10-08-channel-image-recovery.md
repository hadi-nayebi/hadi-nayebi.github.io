# Episode 3 channel illustration recovery and complete-series verification

Hadi requested repair of the damaged Episode 3 slide 2 image and the final reader from Episodes 1–14. Narration recovery PR #216 is merged at main `ed7e138e45cb4caa23ea5a797f126b1e785cde3c`.

## Asset repair

The original September 7 JPEG had a corrupted lower half. Built-in image generation restored the missing stream and underwater fish scene while preserving the upper forest composition, deer, bird, scent current and substrate-vibration arcs. The intact Episode 3 opening image provided only style and underwater-composition reference. The final image was visually inspected and encoded as a complete optimized 1536×1024 JPEG. No narration or source claim was changed.

Active asset: `blog/observations/information-system-of-a-planet/images/episode-03/02-channel-physics-restored.jpg`. Canonical Episode 3 JSON and the storytelling inventory point to the new filename, preventing reuse of the damaged cached image. The original asset remains inactive historical material.

Prompt: preserve the existing upper forest scene; replace corrupted green bands with a continuous forest stream and split-level underwater fish scene, delicate acoustic wave arcs, matching painterly wildlife style, golden forest light and blue-green water; no text, borders, evolutionary ladder or unfinished regions. Generation mode: built-in edit, using the damaged asset as target and Episode 3 slide 1 as supporting style reference.

## Verification coverage correction

Rendering selection now includes image paths as well as episode JSON. Shared renderer, shell or rendering-workflow changes run the complete manifest rather than defaulting to Episodes 11 onward. This repair runs all fourteen episodes at four widths; automated checks and screenshots must be reviewed before readiness. The accepted-passage record from #216 remains the narration authority.
