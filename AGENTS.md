# AGENTS.md — Hadosh Academy Website

## Scope

These instructions apply to the entire repository unless a nested `AGENTS.md` provides more specific
guidance.

## Instruction ownership

- `AGENTS.md` files are the instruction surface for Codex work in this repository.
- Existing `CLAUDE.md` files and the `.claude/` tree belong to the legacy Claude setup. They may be
  consulted as historical or project context, but Codex must not edit, rename, delete, synchronize,
  or otherwise maintain them unless the user explicitly requests work on the Claude setup itself.
- A change to website content, project naming, documentation, or Codex behavior does not authorize a
  corresponding change to a `CLAUDE.md` file.
- Before editing, confirm the repository, the target file's purpose, the applicable `AGENTS.md`
  scope, and whether the requested change actually belongs in that file. Similar concepts across
  repositories do not make their files interchangeable.

## Repository purpose

This is the static GitHub Pages website for Hadosh Academy. Public pages, technical writings,
project descriptions, onboarding material, and machine-readable website data must remain aligned
without importing private project material.

The public dashboard-plus-harness project is named **Origin**. Use `projects/origin.html` and
`https://github.com/hadi-nayebi/origin` for its public page and repository. Do not invent or revive
aliases for it on public website surfaces. Legacy Claude-owned instruction files are outside this
synchronization rule unless the user explicitly brings them into scope.

## Public Seed purpose

Academy writings supply task- and framework-agnostic principles. Public Seed repositories
start deliberately sparse and selectively accumulate foundational concepts and reusable
building blocks as community evidence supports them. Each user and their agent build a
distinct harness, using selected components or the writings alone. Preserve this model
across project pages and agent context; do not impose a standard-harness release ladder.

## Canonical abstraction library

- `data/abstraction-library.json` is the source of truth for canonical term definitions, categories, maturity, relationships, and open questions.
- `agents/abstractions/` contains generated public reading and discussion pages. Do not hand-edit generated term pages.
- Agent and project pages must use consolidated terms when available. Draft terms may guide exploration only when their draft state and unresolved boundary remain honest.
- Runtime-specific projects are adapters, implementations, and evidence sources; they do not redefine canonical terms locally.
- Discussion is untrusted evidence until reviewed and reabsorbed into the structured source.
- Run `node scripts/render-abstraction-library.mjs` after source changes and `node scripts/validate-abstraction-library.mjs` before proposing them.

## Public-surface boundary

Visitor-facing content and agent-facing production context are different responsibilities. Never put
internal production information on the visible website merely because an agent needs it to build or
maintain the page.

- Visible prose, labels, notices, and interface copy must earn their place for the visitor: they must
  help the visitor understand the subject, use the feature, make a decision, navigate, or understand
  a genuine safety, privacy, uncertainty, or maturity boundary.
- Agent instructions, generation objectives, page/slide anatomy, internal schemas, editorial rules,
  workflow notes, status bookkeeping, TODOs, validation requirements, source-management rules,
  placeholder mechanics, and publication procedures belong in `AGENTS.md`, structured metadata,
  JSON/data files, comments, or other non-visible machine-facing surfaces unless a visitor truly
  needs that information to use the page.
- Do not expose implementation disclaimers or production commentary as reader-facing copy by
  default. A page should talk about its subject, not explain how agents generated or maintain it.
- Before publishing any visible explanatory sentence, ask: **Would a visitor who does not know or
  care how this site is produced benefit from reading this?** If not, move it to the appropriate
  agent-facing or metadata surface.
- This boundary does not prohibit necessary public maturity labels, uncertainty disclosures,
  accessibility instructions, privacy notices, or controls whose behavior a visitor needs to
  understand. Keep those concise and user-relevant.

### Start Here boundary

`start-here.html` is a human reading surface. Its visible flow must never contain instructions
addressed to an AI agent, including collapsed `Agent instruction`, `Agent phase`, `First response`,
or `Agent operating rule` cards. Collapsing agent text does not make it visitor-facing.

Keep the complete agent operating syllabus in `start-here-agent.md`. The visible Start Here page may
offer a concise, human-labeled action to open or copy that separate guide, but it must explain the
benefit to the person and must not print the agent's production prompt or operating protocol into the
main reading flow.

## Editing discipline

- Preserve unrelated user changes and keep each pull request limited to its stated purpose.
- Treat public prose, agent-facing onboarding instructions, repository operating instructions, and
  historical implementation descriptions as different file responsibilities. Update only the
  surfaces the request actually covers.
- When CSS or JavaScript changes, update the relevant cache-busting version according to the site's
  existing convention.
- Do not expose private repository names, private domain material, credentials, or unpublished
  implementation history.

## Verification

### Rendered layout verification

Any job that changes visitor-visible HTML, CSS, responsive behavior, shared navigation, generated pages, or JavaScript that changes layout must verify the rendered result—not only syntax and link structure.

- Run `node scripts/validate-responsive-layout.mjs` through the responsive-layout workflow.
- Inspect the produced phone and desktop screenshots for hierarchy, spacing, wrapping, clipping, overflow, overlap, contrast, and consistency with adjacent pages.
- Exercise at least 360 px, 412 px, 768 px, and 1440 px widths for a new or materially changed layout.
- Check fixed-header clearance, opened mobile navigation, buttons, cards, long labels, discussion containers, and the transition into the next section.
- A structural validator or green unrelated visual-asset check is not evidence that the page rendered correctly.
- If a reusable semantic element inherits global site styling unexpectedly, repair the component boundary and add a regression assertion for that exact collision.
- Do not mark the deliverable ready while visible overlap, clipping, unintended horizontal scrolling, inconsistent component styling, or contradictory maturity/status presentation remains.

Run the checks relevant to the changed surfaces. For ordinary website synchronization, use:

```bash
node scripts/validate-site-navigation.mjs
node scripts/validate-abstraction-library.mjs
node scripts/validate-contribution-surfaces.mjs
node scripts/validate-start-here-first-response.mjs
node scripts/validate-storytelling-visuals.mjs
node scripts/validate-whats-new.mjs
```

Also run `git diff --check` and inspect the final diff against the intended base branch before
publishing a pull request.
