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

Run the checks relevant to the changed surfaces. For ordinary website synchronization, use:

```bash
node scripts/validate-site-navigation.mjs
node scripts/validate-contribution-surfaces.mjs
node scripts/validate-storytelling-visuals.mjs
node scripts/validate-whats-new.mjs
```

Also run `git diff --check` and inspect the final diff against the intended base branch before
publishing a pull request.
