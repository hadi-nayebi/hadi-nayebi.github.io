# Practical Guide 3 review record

## Artifact

- Canonical source: `blog/practical-guides/03-give-your-ai-work-a-private-github-home.md`
- Published page: `blog/practical-guides/03-give-your-ai-work-a-private-github-home.html`
- Review date: 2026-09-22
- Audience: people already using ChatGPT or another agent who do not yet have durable, user-controlled project context

## Accepted context synthesized

- Practical Guides are adaptive guided conversations, not fixed questionnaires.
- The user should be able to give the guide to the agent that already knows them.
- GitHub is a low-barrier hosted substrate, not the definition or final form of a harness.
- Files make context inspectable; Git versions and compartmentalizes changes; GitHub adds hosted access, Issues, pull requests, notifications, and mobile interaction.
- Issues are the primary request and clarification surface, especially from a phone.
- Access and authority are separate. Merge remains a human acceptance boundary.
- The workflow must support write-capable, read-only, and temporarily disconnected agents without disguising one capability as another.
- New accepted context can revise earlier material; unsupported questions remain open.
- Every guide can lead into the wider Hadosh Academy corpus without requiring the reader to study it before beginning.

## Pass 1 — structural draft

| Dimension | Score / 10 | Gap found |
| --- | ---: | --- |
| Conceptual alignment | 9.2 | The repository workflow was present, but the filesystem → Git → GitHub argument was only implicit. |
| Technical accuracy | 9.4 | Hosted GitHub and true local execution needed a sharper distinction. |
| Nontechnical pedagogy | 9.3 | Vocabulary was clear but needed a stronger background-adaptive teaching rule. |
| Adaptive agent handoff | 9.4 | The handoff needed explicit permission to use relevant Academy context. |
| Mobile usability | 9.4 | Installation and review were covered; the missing-Issues fallback was not. |
| Reproducibility | 9.1 | The guide proposed starter files without explaining how a no-connection user creates them. |
| Safety and privacy | 9.7 | Strong boundary; retain it through all revisions. |
| Capability honesty | 9.8 | Direct-connection test and read-only path were already explicit. |
| Corpus integration | 9.1 | The guide needed direct links to the filesystem and vocabulary essays. |
| Review and accumulation | 9.6 | Backward audit was present and should remain. |

## Changes after Pass 1

1. Added “Why a Filesystem, Why Git, and Why GitHub,” including the historical reason Git fits large, distributed, nonlinear editing.
2. Distinguished a user-controlled hosted repository from a local clone and local runtime.
3. Linked `LLMs Are Not the Agents`, `The Language of Agents`, Start Here, and the earlier Practical Guides.
4. Added a rule that analogies must come from the user's own background and return to exact GitHub meanings.
5. Added browser-only steps for creating the initial context files.
6. Added a fallback when Issues are disabled or absent.
7. Expanded the agent handoff so the whole Academy may serve as relevant context without becoming a mandatory reading assignment or prescribed implementation.
8. Kept the direct-GitHub capability test explicit: browsing a repository page is not proof of repository-tool access.

## Pass 2 — final content gate

| Dimension | Score / 10 | Evidence |
| --- | ---: | --- |
| Conceptual alignment | 9.9 | The guide now maps filesystem, Git, GitHub, Issues, branches, pull requests, and merge to the Academy's harness abstractions. |
| Technical accuracy | 9.7 | It separates Git from GitHub, hosted custody from local execution, and observed capability from product claims. |
| Nontechnical pedagogy | 9.7 | The reader begins with one project, receives a plain-language vocabulary, and learns through a domain-specific analogy. |
| Adaptive agent handoff | 9.9 | The agent starts from known context, exposes uncertainty, asks one high-value question at a time, and adapts language and structure. |
| Mobile usability | 9.7 | The guide covers installation, authentication, notifications, Issues, comments, PR review, and when to move to a larger screen. |
| Reproducibility | 9.8 | Account, repository, starter files, connection, capability test, first Issue, review path, and fresh-conversation test form a complete route. |
| Safety and privacy | 9.9 | Credentials, recovery material, regulated data, unauthorized employer/client content, and third-party personal data are explicitly excluded. |
| Capability honesty | 10.0 | Write, read-only, and disconnected paths are separate; unverified capabilities remain unknown; access never grants authority. |
| Corpus integration | 9.8 | The guide is a usable entry point and links the relevant conceptual, diagnostic, onboarding, and website-building paths. |
| Review and accumulation | 9.8 | Corrections become durable context, pull requests expose exact changes, and backward audit is part of continuing maintenance. |

All final dimensions exceed the requested 9.5/10 quality gate.

## Primary evidence checked

- GitHub Docs: GitHub Mobile capabilities and installation route
- GitHub Docs: Issues as a planning, discussion, and tracking surface, including creation from GitHub Mobile
- GitHub Docs: private repository creation and account security guidance
- Git project documentation: version control, Git history, distributed work, scale, and branching
- Official OpenAI documentation: Plugins installation and GitHub connection model
- Official OpenAI documentation: Codex cloud repository connection, environment creation, diff review, and pull-request flow

## Remaining uncertainty

- Product interfaces and account availability can change. The guide links current official documentation and tells the agent to verify observed capabilities rather than rely on screenshots or assumed product behavior.
- No hosted repository provides a complete local harness. Hooks, background jobs, local execution, credential management, and stronger enforcement remain later architecture choices.
- The smallest useful file structure varies by person and project; the guide intentionally provides a starting example rather than a mandatory schema.

## Backward audit

- Add Guide 3 to the Blog index, RSS feed, sitemap, What's New, README, and agent-facing Start Here path.
- Add Guide 3 as the next guide from Practical Guide 2.
- Repair missing Guide 1 → Guide 2 navigation.
- Add the previously omitted Practical Guide 2 to the RSS feed and sitemap while those surfaces are being updated.
- Do not revise the filesystem essay or vocabulary essay merely to advertise the new guide; linking from Guide 3 is sufficient because their arguments remain accurate.

## Validation required before merge recommendation

- Markdown/HTML parity review
- internal-link and metadata validation
- contribution-surface validation
- What's New validation
- responsive rendering at 360, 412, 768, and 1440 px
- mobile-navigation and long-table inspection
- final diff review against `main`
