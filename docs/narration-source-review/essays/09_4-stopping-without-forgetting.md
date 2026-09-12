# Essay 09.4 review: Stopping Without Forgetting

## TLDR

This article was re-reviewed against the current public Origin PR stack. Its response-versus-responsibility distinction, four continuation modes, waiting test, pause authority, recovery substrate, and closing argument remain intact. The mechanism now describes channel-owned state, independent pause, and OR-composed Stop hooks rather than one global record.

## Substantive changes

1. Stop is now one hook per installed engagement channel; active votes compose while passive hooks abstain.
2. Active, waiting, paused, and idle are defined per channel, including the rule that another active channel still prevents the whole relationship from stopping.
3. Pause is explicitly independent: one channel may retain new input while the other continues.
4. Idle is derived from each authoritative channel journal through neutral lifecycle code, replacing the retired single global record.
5. Review authority belongs to the user-facing surface of the owning channel.
6. Recovery now describes separate journals, continuation state, outboxes, and resume voices.
7. Canonical version is `v0.3.0`; the published article body is synchronized from Markdown.
8. Accepted work now closes only when the owner merges the exact linked PR and GitHub confirms the merge; dashboard and Telegram expose the same owner-authorized action.
9. The trusted hook denies agent-side merge and authority-file mutation paths, while the article explicitly preserves the need for repository branch protection as the remote boundary.

## Removal and replacement ledger

- The single global state and one-queue paragraphs were replaced because they directly contradicted the merged public implementation.
- Singular dashboard-only pause, review, recovery, and Stop wording was replaced with owning-channel language.
- No section, stop state, example, recovery mechanism, or narrative beat was removed.

## Review record

- Baseline: `ec6b34efbaa4f7a5af81f44a6cb374cd8d624ae2`
- Version: `v0.3.0`
- Source SHA-256: `1a28c771b8adb4d44877358c3a038cb9436f4ef9a9a8cf44c4e88455b17954da`
- Published-page SHA-256: `31bc740fab55f431b548246a6c35b752c6005c3149b9584e354a200952c55c08`
- Reader-facing prose words: 1,252 to approximately 1,341; net `+89` across both review passes.
- This page has no narration player or transcript to invalidate.
- Technical accuracy and source-page parity passed on September 12. Cross-writing consistency is
  evaluated with the complete B9 correction PR. Hadi's content lock is pending for the changed
  source hash.
