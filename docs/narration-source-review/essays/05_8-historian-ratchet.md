# Essay 5.8 review: The Historian Ratchet

## TLDR

This mature article received a bounded obvious-error pass. Its ratchet pattern,
portable examples, and composed-ceremony arc remain intact. The article moves
from 2,290 to 2,249 visible words. It now identifies the Claude-based system as
a historical reference architecture and correctly separates ownership of the
historian ratchet from the wider ceremony assembled around it.

## Substantive changes

1. The opening now frames project instructions generically and labels the
   Claude implementation as the historical reference used by the series.
2. The integrity plugin now owns the historian ratchet itself: drift check,
   blocking threshold, historian update, and reset.
3. The wider editing ceremony remains a composition of narrow concerns:
   question governance, durable job authorization, and protected editing. The
   integrity lock manager owns the concrete unlock answer.
4. Historian placement and template language were generalized so an
   incidental prototype exception is not presented as architecture.
5. The two image specifications and captions now agree with the corrected
   ownership model.
6. All fourteen ref tags and rendered tooltips use generalized private
   verification rather than private paths, revisions, or implementation detail.
7. Metadata records the May 18 publication date and September 11 review. The
   transcript is non-final and the stale audio player is hidden.

## Removal and replacement ledger

- A private file inventory and an incidental historian-location exception were
  replaced with the reusable rule: shared template, one historian per plugin.
- The claim that no plugin owns the ratchet was corrected. One plugin owns the
  ratchet; multiple plugins compose the broader protected editing ceremony.
- Private implementation locators were replaced with generalized verification.
- No section, example, analogy, mechanism step, or portable lesson was removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.4.0`
- Source SHA-256: `d6cbc87c9b7de3c8922f387cb4d2951dc230b17f9fabd8babd9630016a30860f`
- Published-page SHA-256: `0e3d3616f890fbd1de13108d7e89989465e55c2c24ee109903f159ade4422d24`
- Visible words: 2,290 to 2,249; net `-41`.
- Cross-writing consistency remains provisional; Hadi's content lock remains
  pending.
