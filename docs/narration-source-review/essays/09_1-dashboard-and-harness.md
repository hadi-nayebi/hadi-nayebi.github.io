# Essay 09.1 review: The Dashboard and the Harness Are One System

## TLDR

This article was re-reviewed against the current public Origin PR stack. Its dashboard-and-harness thesis and same-session relationship remain intact, while the anatomy, remote boundary, review surface, and evidence claims now reflect independent dashboard and Telegram engagement.

## Substantive changes

1. The continuing relationship now includes the optional Telegram channel while preserving separate channel histories and controls.
2. The former feedback/Agent Stop State split now describes two removable engagement plugins, channel-owned continuation and Stop votes, a neutral lifecycle core, and shared runtime transport.
3. User review is assigned to the owning channel rather than only the dashboard.
4. The limitation section distinguishes bounded Telegram engagement from accounts, hosted dashboards, and cloud synchronization, and separates automated evidence from live voice acceptance.
5. Canonical version is `v0.3.0`; the published article body is synchronized from Markdown.
6. First-run orientation now describes the replayable guide and Admin surface, which contains the Wiki and the two public reference plugins.
7. Telegram is explicitly text-first; transcription and cloned-voice replies are optional additions.
8. Acceptance now means the owner merges the exact thread-linked PR. The trusted hook blocks the agent's merge path, while repository branch protection remains the stronger remote control.

## Removal and replacement ledger

- The obsolete `agent-stop-state` global-owner paragraphs were replaced because Origin now composes independent channel-owned Stop decisions.
- The claim that Origin shipped no remote access was narrowed because the optional Telegram client is present in the public PR stack.
- No section, example, metaphor, or narrative beat was removed.

## Review record

- Baseline: `ec6b34efbaa4f7a5af81f44a6cb374cd8d624ae2`
- Version: `v0.3.0`
- Source SHA-256: `30480bfe68a5e327b59237d6f7956afeab0800fb14b6724f386fc35736d0b4fb`
- Published-page SHA-256: `2adc91374c107d303d7e4fc1733012d35c7cad002dbd669c8caf38b648394418`
- Reader-facing prose words: 1,372 to approximately 1,440; net `+68`.
- This page has no narration player or transcript to invalidate.
- Technical accuracy and source-page parity passed on September 12. Cross-writing consistency is
  evaluated with the complete B9 correction PR. Hadi's content lock is pending for the changed
  source hash.
