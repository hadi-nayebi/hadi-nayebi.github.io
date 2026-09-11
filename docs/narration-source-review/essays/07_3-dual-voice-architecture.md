# Essay 07.3 review: The Dual Voice Architecture

## TLDR

This mature article received a bounded obvious-error pass. Its two-channel voice architecture, soft-to-hard maturation, YAML pairing, and consulting example remain intact. The corrections separate message intent from the callsite that actually injects or blocks.

## Substantive changes

1. The two voice files share a schema family but may contain different element types and inventories.
2. XML tags record message intent; the hook callsite and result determine context injection or refusal.
3. CLI voice primarily serves the operator, while command output can also return to an agent that invoked it through a tool.
4. Voice-id auditing must inspect both surfaces to avoid misclassifying valid IDs as orphaned.
5. Active and defensive checkpoint-restoration wording is aligned with the lock-ceremony essay.
6. Stage-3 YAML fields retain their callable voice-ID contract and required callsite wiring; YAML terminology is consistent.
7. All twelve ref tags retain their IDs and use generalized private verification.

## Removal and replacement ledger

- Matching-element-type claims were replaced because the two files share a schema family rather than identical inventories.
- Direct enforcement by XML tags was replaced because the callsite and hook result supply the behavior.
- Private counts, paths, code excerpts, and unpublished implementation details were removed from the public evidence surface.
- No section, channel, YAML mechanism, example, image instruction, or narrative beat was removed.

## Review record

- Baseline: `2664c97e80c73943a217715b88abfac36e19935a`
- Version: `v0.2.0`
- Source SHA-256: `6236dc1d20bac69e46ff1fbebff49cfdf0443b182b72cdc30799f2a0166d2840`
- Published-page SHA-256: `6c51858b15d763626f942ad71dd87ae2348cc44b890bd87b1e2172469997c974`
- Recorded source words: 1,710 to 1,780; net `+70`.
- Metadata uses the repository introduction date and records the September 11 review. The transcript is non-final and the stale audio player is hidden.
- Cross-writing consistency remains provisional; Hadi's content lock remains pending.
