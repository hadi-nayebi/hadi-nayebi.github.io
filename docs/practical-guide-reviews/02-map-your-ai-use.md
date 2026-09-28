# Practical Guide 2 and Start Here integration review

## Artifact

- Canonical Guide 2 source: `blog/practical-guides/02-audit-ai-harness-portability.md`
- Rendered Guide 2 page: `blog/practical-guides/02-audit-ai-harness-portability.html`
- Start Here sources: `start-here-agent.md` and `start-here.html`
- Review date: 2026-09-23
- Baseline Guide 2 source blob: `4de513c38022730d56fc5158ea5619d18aa9fff9`

## Problem and accepted direction

The three Practical Guides offered different useful entry points, but the Start Here syllabus listed them only in its later cross-site map. It did not yet explain how a visiting agent should choose among them while keeping the full multi-session journey. “Agentic AI Use Doctor” also gave the conversational mapping guide an awkward clinical name.

The complete Phase 0–9 reading contract stays intact. The guides are optional bounded paths within that journey: map existing AI use and ownership, build a public website, or establish one private repository for continuing work. A person can arrive through any path and continue from actual evidence without being interviewed again. Guide 3 remains a hosted continuity layer, not a claim that GitHub supplies local hooks or full harness operation.

## Changes and backward audit

- Added an agent-facing choice rule and re-entry rule to Start Here without changing its first-response contract or phase gates.
- Added a three-guide choice section to the human page, using existing card styles and removing its duplicate Guide 1 card.
- Renamed Guide 2 to **Map Your AI Use** in canonical Markdown, rendered page, metadata, blog index, guide links, and current RSS title. Its existing URL, illustration filename, two-map method, scoring, and authority boundaries remain stable.
- Kept past What's New summaries as historical publication records. Open PRs #166, #173, and #174 touch related pages and must be reconciled before merge.

## Evidence and limits

No new empirical effectiveness claim is made. This is navigation, teaching-route, and editorial work. The guide's behavioral contract and user-controlled permission boundary remain as before. The current implementation has no field evidence that one route outperforms another; let actual user goals and results determine later revisions.

## Verification

- Canonical and HTML Guide 2 headings were checked for parity after the rename.
- Exact-head commit `2fa8990d` passed site visual, site navigation, form behavior, Practical Guide responsive, and expanded responsive layout validation. The expanded check covers 360, 412, 768, and 1440 px widths, guide destinations, overlap, contrast, keyboard access, and full-page screenshots.
- The first expanded pass found low-contrast labels and links and keyboard-inaccessible horizontally scrollable tables. Page-scoped fixes were added. Mobile Guide 2 tags now wrap; its final 360 px and 412 px full-page screenshots match their viewport widths.
- Manually reviewed final phone and desktop fold screenshots of Start Here and Guide 2, plus the Start Here three-guide section in the full-page captures. The chooser stacks without clipping on a phone and forms three cards on desktop. Screenshot artifact: [responsive-layout-screenshots](https://github.com/hadi-nayebi/hadi-nayebi.github.io/actions/runs/35928841790/artifacts/10780301302).
