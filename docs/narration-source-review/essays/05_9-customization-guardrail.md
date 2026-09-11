# Essay 5.9 review: The Customization Guardrail

## TLDR

This mature article received a bounded obvious-error pass. Its authorization
argument, two-condition gate, customization examples, and declarative ending
remain intact. The article moves from 2,759 to 2,762 visible words. It now
distinguishes the two gate conditions from the three ways authorization can be
initiated, and it records both setters of the job-level approval right.

## Substantive changes

1. The opening now states the portable customization-guardrail pattern first
   and labels the named protocol as a historical implementation.
2. The gate still has two admission conditions: deliberate maintenance mode or
   an approved focused job.
3. The approved-job condition now names both setters: approval during new-job
   creation and approval raised on a focused job already in flight.
4. The final lock request remains separately user-confirmed; prior job approval
   does not itself unlock a plugin.
5. The discussion now distinguishes two gate conditions, two agent-initiated
   shapes, and three authorization moments without conflating their counts.
6. The image specification and caption now match that two-condition model.
7. Private implementation locators in all twenty-five ref tags were replaced
   with generalized private verification.
8. Metadata records the May 18 publication date and September 11 review. The
   transcript is non-final and the stale audio player is hidden.
9. The handoff to B6 now identifies its thirteen published parts instead of
   calling it a ten-part series.

## Removal and replacement ledger

- Detailed private paths and handler locations were replaced with the public
  protocol relationship each detail supported.
- The incomplete claim that one prefix was the only approval-flag setter was
  replaced with the two-setter explanation.
- The phrase “two routes” was narrowed where it meant gate conditions and
  expanded where it meant concrete authorization moments.
- The B6 series count was corrected because the published sequence contains
  thirteen parts.
- No section, customization example, authorization step, warning, or
  declarative conclusion was removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.7.0`
- Source SHA-256: `6f722239447726002ce65e6b4786143f0023ec6c03673c0d676afb3acf4fb6df`
- Published-page SHA-256: `e1be1452a562308a7306da24c448389b592674ca6fe50994d8a58730fda191a1`
- Visible words: 2,759 to 2,762; net `+3`.
- Cross-writing consistency remains provisional; Hadi's content lock remains
  pending.
