# Essay 09.3 review: Internal Voices Are Reorientation, Not Notifications

## TLDR

This article was re-reviewed against the current public Origin PR stack. Its reorientation thesis, five-question structure, event variants, soft-versus-hard boundary, and authority rules remain intact. The examples now assign continuation voices and hard Stop decisions to their owning engagement channels.

## Substantive changes

1. The former Agent Stop State example now contrasts dashboard and Telegram continuation voices and explains why a global voice would erase source and recovery context.
2. The hard-control section now describes one in-progress thread per channel, separate journals and outboxes, and OR-composed Stop hooks in which passive channels abstain.
3. Canonical version is `v0.3.0`; the published article body is synchronized from Markdown.
4. User acceptance is now the GitHub-confirmed merge of the exact linked PR, not a status the agent may declare.
5. The trusted hook enforces the supported agent boundary locally; the review notes retain the explicit limitation that this is not an operating-system sandbox and that remote branch protection is still required.

## Removal and replacement ledger

- The obsolete global Agent Stop State example was replaced with the implemented channel-owned model.
- No section, question, authority boundary, or narrative beat was removed.

## Review record

- Baseline: `ec6b34efbaa4f7a5af81f44a6cb374cd8d624ae2`
- Version: `v0.3.0`
- Source SHA-256: `2e8a82702cf97f1caa0d918d44eacb9f87e6ed4fd603c8ee2001c778c4dc49fe`
- Published-page SHA-256: `802783b76d68485ad65b12dc1888fa1486cfb1dcba2cab9f34a5584739352f07`
- Reader-facing prose words: 1,160 to approximately 1,181; net `+21`.
- This page has no narration player or transcript to invalidate.
- Technical accuracy and source-page parity passed on September 12. Cross-writing consistency is
  evaluated with the complete B9 correction PR. Hadi's content lock is pending for the changed
  source hash.
