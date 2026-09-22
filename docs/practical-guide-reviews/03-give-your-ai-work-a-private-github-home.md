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

## Pass 2 — architecture and substrate

**Defect model:** the workflow could be followed, but the reason this particular substrate fits the Academy's abstraction was not yet explicit enough for a nontechnical reader.

**Inspection and material revision:** added the filesystem → Git → GitHub explanation; separated Git from GitHub; connected files, history, Issues, branches, pull requests, and merge to stable harness roles; linked the filesystem and vocabulary essays; and distinguished hosted ownership from a local clone and local runtime.

**Affected re-score:** conceptual completeness 9.7; Academy alignment 9.8; evidence discipline 9.6; examples and edge cases 9.5.

**Remaining gap:** the guide still needed explicit routing from observed connector capability rather than only three narrative paths.

## Pass 3 — capability and decision logic

**Defect model:** users could understand read-only and write-capable paths but might still overgeneralize from a product name, leave unknown capabilities unmarked, or lack a safe stop condition.

**Representative setups inspected:**

1. ChatGPT with direct read access but no demonstrated write path;
2. Codex cloud with selected-repository access and pull-request review;
3. a temporarily disconnected hosted assistant using manual transport;
4. a mobile-first user who can interact with Issues but prefers large diffs on a computer.

**Material revision:** added a six-row capability decision table, an explicit stop-and-repair result when the repository cannot be identified, a rule that untested capability remains unknown, and an exit path for narrowing or revoking GitHub App or OAuth access.

**Affected re-score:** diagnostic dimensions and independence 9.7; scoring or decision logic 9.8; evidence discipline and treatment of unknowns 9.9; privacy and authority 9.9; repeatability and verification 9.7.

**Remaining gap:** the complete route was accurate but visually long for a newcomer deciding whether they could finish it.

## Pass 4 — human utility and repair path

**Defect model:** a 4,000-plus-word guide can make a low-barrier path feel larger than it is, and the initial file structure lacked a complete browser-only creation route.

**Material revision:** added the nine-step “Shortest Useful Route”; added exact browser steps for the initial files; explained when first scaffolding commits may go directly to `main`; added the missing-Issues fallback; clarified when mobile is appropriate and when a larger screen is safer; and kept the first experiment to one repository, one project, one Issue, and one fresh-context test.

**Affected re-score:** audience problem and promised utility 9.8; human comprehensibility and narrative flow 9.7; actionability and repair path 9.9; agent usability 9.8; cross-channel entry-point value 9.7.

**Remaining gap:** discovery and corpus placement needed a complete backward audit, and the social invitation needed to promise a practical result without calling the hosted layer fully local.

## Pass 5 — editorial, discovery, and distribution

**Defect model:** the guide would be weaker as an isolated URL, and a social post could easily overstate “local” ownership or repeat the guide instead of earning the click.

**Material revision:** strengthened the opening around the cost of beginning again; kept the title outcome-led; made the whole Academy available as relevant agent context without imposing the corpus as prerequisite reading; connected Guides 1–3; prepared Blog, RSS, sitemap, What's New, README, and Start Here discovery updates; and drafted one LinkedIn invitation that presents the repository as a user-controlled, file-based hosted layer and a first step toward a local harness.

**Affected re-score:** story and portfolio fit 9.8; narrative flow 9.7; cross-channel entry-point value 9.8; Academy alignment 9.9; web and technical quality 9.6 pending rendered verification.

**Remaining gap:** rendered layout and repository validators must still pass before a merge recommendation. The content gate is complete; the release gate is not.

## Final adversarial verification

### Curious general reader

- **Strongest exit risk:** Git and GitHub language may imply programming expertise.
- **Repair:** the opening says no software-development background is required, the short route appears early, every term is defined by user benefit, and the agent must adapt examples to the person's own work.

### Skeptical technical reader

- **Strongest distrust risk:** calling a cloud-hosted private repository “local” or implying a connector has write authority.
- **Repair:** the guide calls it hosted, distinguishes Git from GitHub and a remote repo from a local clone, and routes entirely from observed capability.

### Reader already familiar with Hadosh Academy

- **Strongest dismissal risk:** repetition of the filesystem thesis without a new operational contribution.
- **Repair:** the guide translates that thesis into mobile Issues, connector verification, branch/PR review, revocation, a fresh-conversation test, and a concrete hosted implementation boundary.

### Agent following the handoff

- **Strongest execution risk:** treating the prompt as permission to create accounts, expose credentials, widen repository access, or merge.
- **Repair:** authentication remains on first-party screens; secrets and protected data are excluded; access is narrowed; consequential actions require explicit approval; merge remains human-owned.

## Final 15-dimension quality gate

| Required dimension | Score / 10 | Evidence |
| --- | ---: | --- |
| Story and portfolio fit | 9.8 | Converts the Doctor's ownership diagnosis and the filesystem thesis into the next low-barrier construction path. |
| Audience problem and promised utility | 9.8 | Starts from repeated reconstruction already felt by current agent users and promises one recoverable project home. |
| Conceptual completeness | 9.8 | Covers substrate, context, request, proposal, acceptance, recovery, limits, and evolution without presenting GitHub as the final architecture. |
| Diagnostic dimensions and independence | 9.7 | Separates repository access, Issue access, file write, branch, PR, and merge capabilities. |
| Scoring or decision logic | 9.8 | The capability table selects a safe path from observed evidence and preserves unknowns. |
| Evidence discipline and treatment of unknowns | 9.9 | Current product claims use official sources; untested capabilities remain unknown; browsing is not accepted as connector proof. |
| Agent usability and prompt reliability | 9.9 | The handoff defines context recovery, question discipline, security, capability testing, three execution paths, review, and completion. |
| Human comprehensibility and narrative flow | 9.7 | The shortest route, plain vocabulary, adaptive analogy, and staged parts reduce cognitive load without hiding the mechanism. |
| Actionability and repair path | 9.9 | The reader can create the repo and files, install mobile, connect, test, open an Issue, review work, repair failure, and revoke access. |
| Academy alignment | 9.9 | Human agency, inspectability, portable files, bounded permissions, verification, recovery, and plural substrates remain explicit. |
| Privacy, safety, and human authority | 10.0 | Credentials and protected data are excluded; repository access is narrow; merge and consequential action remain human decisions. |
| Examples and edge cases | 9.7 | Includes profession-adaptive examples, read-only/write/disconnected cases, disabled Issues, untested capability, and large-diff mobile limits. |
| Repeatability and verification method | 9.8 | One Issue and a fresh-conversation read-back provide a repeatable, falsifiable continuity test. |
| Cross-channel entry-point value | 9.8 | The guide works as a direct agent handoff, Blog entry, Start Here route, RSS item, What's New item, and LinkedIn destination. |
| Web, accessibility, and technical quality | 9.6 | Semantic headings, accessible tables, metadata, canonical URL, sidebar, contribution surface, and responsive CSS are present; final rendering remains the release check. |

All content-review dimensions exceed the requested 9.5/10 quality gate. The 9.6 web score is provisional until responsive screenshots and validators pass; any material rendering defect reopens Pass 5.

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
