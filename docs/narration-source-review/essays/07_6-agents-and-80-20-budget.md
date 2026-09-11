# Essay 07.6 review: agents/ and the 80/20 Dispatch Budget

## TLDR

This mature article received a bounded obvious-error pass. Its orchestration model, per-plugin worker pools, delegation budget, and research-lab example remain intact. The central correction distinguishes an 80/20 architectural target from what the mechanical budget can actually guarantee.

## Substantive changes

1. Directory names and numeric defaults are identified as historical, while orchestration and delegated work are stated as the portable architecture.
2. The runtime is framework-generic first; the concise worker description helps selection, and the full Markdown body supplies instructions when the worker runs.
3. Cross-plugin read-only investigation is allowed while mutation remains scoped to the owning plugin's lock boundary.
4. The 80/20 ratio is an architectural target; the deterministic budget guarantees recurring delegation pressure rather than an exact cognitive-work percentage.
5. The universal `.claude/` exemption is now the generic project-instruction layer.
6. The canonical image instruction no longer prohibits the required “20%” label.
7. All six ref tags retain their IDs and use public documentation or generalized private verification.

## Removal and replacement ledger

- The exact-ratio enforcement claim was replaced because edit and dispatch counters cannot measure all cognitive work.
- The ban on cross-plugin workers was narrowed because read-only comparison can be valid; write authority remains local.
- Private component names, counts, paths, and implementation excerpts were removed from the public evidence surface.
- No section, example, budget mechanism, image instruction, or narrative beat was removed.

## Public evidence

- [Claude Code subagents reference](https://code.claude.com/docs/en/sub-agents)

## Review record

- Baseline: `2664c97e80c73943a217715b88abfac36e19935a`
- Version: `v0.2.0`
- Source SHA-256: `7991631e37abc2d2353823d8131ec51d003771324fc289e99e53b7a89a68477d`
- Published-page SHA-256: `ba2690b6f91f6ad6a33139b9db5e82a0bdbd9465d0344833972d35df445a7bd1`
- Recorded source words: 1,297 to 1,367; net `+70`.
- Metadata uses the repository introduction date and records the September 11 review. The transcript is non-final and the stale audio player is hidden.
- Cross-writing consistency remains provisional; Hadi's content lock remains pending.
