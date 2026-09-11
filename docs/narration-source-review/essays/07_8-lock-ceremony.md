# Essay 07.8 review: The Lock Ceremony

## TLDR

This mature article received a bounded obvious-error pass. Its lock ceremony, protected-test rationale, safe close-out, and historian ratchet remain intact. One summary contradiction was corrected so it agrees with the detailed active and defensive failure paths.

## Substantive changes

1. The lock names and concrete mechanics are identified as one historical Claude-based reference architecture, followed by the portable design they illustrate.
2. Active close-out and defensive safe-lock are now distinguished consistently: the active path preserves failing work for repair, while the defensive path reverts it.
3. The risk ledger attributes failing-test commit prevention to both close-out paths rather than safe-lock alone.
4. The stale diagram that collapsed both failures into a revert path is withheld; its corrected source brief now separates active repair from defensive revert.
5. All nine ref tags retain their IDs and use generalized private verification.

## Removal and replacement ledger

- The inaccurate claim that safe-lock alone closes the failing-test risk was replaced because the article's own detailed section correctly assigns that responsibility to two mechanisms.
- Private paths, code excerpts, state fields, and unpublished implementation details were replaced with generalized verification.
- The misleading published diagram was removed from this revision because diagram regeneration is outside the narration-source run; no prose section, example, lock stage, or narrative beat was removed.

## Review record

- Baseline: `2664c97e80c73943a217715b88abfac36e19935a`
- Version: `v0.2.0`
- Source SHA-256: `97131db97fafdbf10023c3d433fb9775fba219ceba63d1f9a09eef21614c5f41`
- Published-page SHA-256: `7d936da89c321830aca35b32e6e47b87c99a74b2d374a04bf6e3a2b5c4826570`
- Recorded source words: 1,794 to 1,829; net `+35`.
- Metadata uses the repository introduction date and records the September 11 review. The transcript is non-final and the stale audio player is hidden.
- Cross-writing consistency remains provisional; Hadi's content lock remains pending.
