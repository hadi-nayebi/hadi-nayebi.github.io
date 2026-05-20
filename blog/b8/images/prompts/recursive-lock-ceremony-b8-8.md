---
source: "08_8-safe-self-modification.md"
asset: "images/recursive-lock-ceremony-b8-8.png"
aspect: "16:9"
style: "chalkboard educational diagram"
palette: "dark slate, white chalk, cyan, green, orange, magenta"
---

Create this exact Hadosh Academy blog illustration as a high-quality chalkboard-style educational diagram.

Concept: Chalk-on-blackboard recursive lock diagram — a large chalk box labeled "plugin_integrity" containing a smaller replica of itself under a chalk padlock, with the safe-lock cycle drawn as two branching arrows below (pass → commit, fail → revert).
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk
  nested boxes and arrows; pastel chalk fills for the boxes and the two branch arrows (magenta = outer plugin_integrity box, pink = inner self-replica under edit, green = pass-branch arrow, orange = fail-branch arrow — drawn from the cycle image palette);
  white chalk for ALL labels, padlock, arrows, and branch text; faint chalk dust at the edges; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other plugin names, script names, or descriptors.
  Layout: A large hand-drawn rectangular chalk box fills the upper two-thirds of the board (magenta fill). The box's header label IN WHITE CHALK at the top reads exactly: "plugin_integrity". Inside this outer box, a smaller rectangular chalk box (pink fill) is drawn centered, with a small white-chalk padlock icon resting on its top edge. The inner box's header label IN WHITE CHALK reads exactly: "plugin_integrity (under edit)". Above the padlock, a short white-chalk caption reads exactly: "[PLUGIN-LOCK]".
  From the bottom edge of the outer box, a single white-chalk arrow drops down into the lower third of the board and meets a small white-chalk diamond labeled IN WHITE CHALK exactly: "tests". From the diamond, two arrows branch outward:
    Left branch (green arrow, pointing down-left). Two-line label IN WHITE CHALK along the arrow:
      Top line:    "pass"
      Bottom line: "commit, lock closes"
    Right branch (orange arrow, pointing down-right). Two-line label IN WHITE CHALK along the arrow:
      Top line:    "fail"
      Bottom line: "revert to checkpoint_ref"
  Below the two branches, a single horizontal white-chalk note runs across the bottom of the board reading exactly: "the guard does not exempt itself"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "plugin_integrity", "plugin_integrity (under edit)", "[PLUGIN-LOCK]", "tests", "pass", "commit, lock closes", "fail", "revert to checkpoint_ref", "the guard does not exempt itself", plus the caption below. No other words, file names, folders, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.8. The lock that closes one cycle opens the next. Recursion all the way down."
  ASSET: images/recursive-lock-ceremony-b8-8.png

Global constraints:
- 16:9 landscape composition.
- Dark slate chalkboard background.
- Hand-drawn chalk linework, slightly imperfect, not ruler-straight.
- White chalk for labels unless a placeholder explicitly says otherwise.
- Preserve the exact label whitelist from the source block.
- Do not add extra words, signatures, watermarks, file names, random symbols, or decorative text.
- Keep labels large, legible, and separated from arrows/figures.
- Match the existing Hadosh Academy chalkboard visual family.
