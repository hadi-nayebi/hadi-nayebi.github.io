```markdown
# CLAUDE.md - Core Instructions

## Working Memory System

This project uses a structured knowledge management system where CLAUDE.md files serve as active working memory.

### System Structure

```
/
├── CLAUDE.md (root - core instructions - THIS FILE)
├── .claude/
│   └── knowledge/
│       └── <topic>/
│           └── <name>.md (learnings organized by topic)
└── <subdirectories>/
    └── CLAUDE.md (local working memory for each area)
```

### Core Workflow: OPEV(r+)

When working on any task, follow this cycle as a working *mindset* and as practical steps. These are modes you may freely transition between — the model is not strictly linear.

1. **Observe** - Gather and document context:
   - Actively capture ideas, concepts, requirements, constraints, and sources.
   - Save raw context and references in the relevant local CLAUDE.md or in `.claude/knowledge/<topic>/` if it is general knowledge.
   - Sources: User conversations, web research, other CLAUDE.md files, other repositories, and the existing codebase.
   - Observation is a documentation step as much as it is an information gathering step — do not skip writing down the context you observe.

2. **Plan** - Draft the execution plan inside the relevant local CLAUDE.md:
   - The local CLAUDE.md is the canonical *plan draft* for that area before execution begins.
   - The Plan MUST enumerate every artifact (exhaustively) that must be created, modified, or deleted. For each artifact include:
     - Exact filename and path (e.g., `index.html`, `assets/css/main.css`, `agents/example-1.html`)
     - High-level purpose (one sentence)
     - Brief content summary / scaffold (what should be inside, e.g., "landing page with hero and course outline")
     - Any dependencies / references (other files, images, assets)
   - The Plan MUST include verification plans:
     - Acceptance criteria and pass/fail conditions
     - Specific verification steps (manual checks, keyboard focus tests, sample inputs, browser/resolution checks)
     - Files or artifacts used for verification (e.g., `test-checklist.md`, `verify-local.md`)
     - Rollback or mitigation plan if verification fails
   - Any gaps discovered during planning must be recorded. If these gaps require more context, shift back to Observe and immediately document the additional context.

3. **Execute** - Implement according to the documented Plan:
   - Use the local CLAUDE.md as the authoritative checklist and progress tracker while implementing.
   - Update the local CLAUDE.md incrementally as each planned artifact is created/modified and as obstacles arise.
   - Do NOT deviate from the plan without documenting the deviation and its rationale in the local CLAUDE.md and, where relevant, in `.claude/knowledge/<topic>/`.

4. **Verify** - Run the verification plan documented in the Plan phase:
   - Follow the verification steps; record results in the local CLAUDE.md (pass/fail, screenshots, notes).
   - If verification fails, return to Observe or Plan as appropriate, document what changed, and iterate.
   - Verification is mandatory and must match the Plan's acceptance criteria.

5. **Report** - Communicate results and finalize local documentation:
   - Report outcomes to stakeholders and summarize results inside the local CLAUDE.md.
   - Add a condensed summary (key decisions, files added/changed, verification results) to `.claude/knowledge/<topic>/` as described below.

6. **(r+) Iterate** - Repeat as needed:
   - These modes are flexible — you may switch back to any mode at any time. Consider OPEV(r+) a probabilistic/Markov-style model of work modes rather than a strict pipeline.

### Principle

**Active, proactive, and retroactive use of CLAUDE.md files as working memory**

- **Active**: Use the local CLAUDE.md while working; it should be populated and authoritative.
- **Proactive**: Create and populate local CLAUDE.md before starting work.
- **Retroactive**: Review and update the local CLAUDE.md and `.claude/knowledge/` after completion.

### Mandatory Plan Requirements (explicit)
- Before any implementation begins (Execution), a local CLAUDE.md file must exist containing:
  - A concise problem statement.
  - An exhaustive list of files to be added/changed/removed with one-line purpose and short content notes.
  - Verification plans and acceptance criteria.
  - Risks and rollback plan.
  - Links to related CLAUDE.md and `.claude/knowledge` pages.
- The team/agent MUST NOT begin implementation until the local CLAUDE.md Plan exists and is committed into the working branch.

### CLAUDE.md File Lifecycle

#### During Development
- Maintain detailed notes and decisions.
- Document the exhaustive file list described above.
- Track dependencies and relationships.
- Note issues and resolutions.

#### After Successful Implementation
- Condense the local CLAUDE.md to essential information only.
- Migrate condensed, reusable knowledge to `.claude/knowledge/<topic>/`:
  - The migrated file must include: summary, key decisions, minimal reproducible examples, commands used, and links to relevant local CLAUDE.md.
  - Local CLAUDE.md should retain a short summary and pointers to the knowledge file.
- This migration must be exhaustive for the work done: do not leave important procedural or contextual notes only in commit messages or ephemeral locations.
- The knowledge files are the long-term store. When you next work in the same topic, pull the relevant knowledge into the local CLAUDE.md as needed.

### Rules (strengthened and explicit)
1. **ALWAYS** populate the local CLAUDE.md BEFORE starting work in that area — this must include the exhaustive file list and verification plan.
2. **NEVER** skip documentation — it's your working memory.
3. **UPDATE** CLAUDE.md files as context evolves; record any deviations from the Plan.
4. **CONDENSE & MIGRATE** after successful completion — store distilled knowledge in `.claude/knowledge/<topic>/`.
5. **REFERENCE** related CLAUDE.md files for cross-cutting concerns.
6. **NO FILES SKIPPED** — when moving info between local CLAUDE.md and `.claude/knowledge/`, ensure every relevant file and its context is recorded. Be exhaustive.
7. **PROTECTION** — consider `.claude/knowledge/` as the authoritative archive for condensed lessons and protect it (backups, access controls) as practical.

---

## Core Principle: Compartmentalization

**Work on different topics and aspects separately - not everything at once.**

(Existing guidance retained — structure vs. content, design vs. implementation, focus on one aspect.)

### Separation of Concerns

1. **Structure vs. Content**
   - Build website structure/framework first with placeholders.
   - Add content in a later phase.
   - Use `[Placeholder text for ...]` to maintain focus.

2. **Design vs. Implementation**
   - Define styling and UX principles first; implement functionality separately.
   - Keep visual consistency documented in local CLAUDE.md.

3. **Focus on One Aspect at a Time**
   - Complete one compartmentalized task fully.
   - Don't mix concerns (e.g., don't develop content while building framework).

---

## Project Overview

**Repository**: hadi-nayebi.github.io  
**Purpose**: Course website for Claude Code Engineering  
**Status**: New static site with placeholders (structure complete)  
**Branch**: `claude/rebuild-legacy-website-011CUuqJn9qBHTemVAYhcAzo`

See `.claude/knowledge/` for detailed project information.

---

## Website Technical Stack (FIXED - DO NOT CHANGE)

**Critical**: These decisions are fixed to ensure consistency and prevent regression.

### Technology Choices

- **Pure HTML/CSS/JS** - No frameworks, no build process.
- **Static site** - No server-side rendering, no databases.
- **Vanilla JavaScript** - No jQuery, React, Vue, or other libraries.
- **No preprocessors** - No SASS, LESS, TypeScript compilation.
- **No package managers** - No npm, yarn (except for local dev server).

**Rationale**:
1. Simple for agents to update (just edit HTML).
2. No dependencies to manage or break.
3. Fast loading and performance.
4. Direct browser compatibility.
5. GitHub Pages compatible.
6. Easy to visually inspect.

**Dynamic behavior rule (explicit)**:
- The site is intended to be static. If any dynamic feature is required (forms, comments, calendars, scheduling, authentication, interactive widgets), it MUST be implemented via calls to external APIs or services (i.e., hosted off-GitHub). The decision to add a dynamic feature must be discussed and approved separately, and the plan must include:
  - API provider(s) and endpoints.
  - Data flows and security considerations.
  - Where secrets/configuration will be stored (not in the repository).
  - Acceptance and verification steps for the integration.

### File Structure

```
/
├── index.html (landing page with orbit wheel)
├── about.html (bio page with dynamic profile pics)
├── blog.html (blog with article system and sidebar)
├── contact.html (contact form via FormSubmit.co)
├── teaching-assistant.html (agent showcase page)
├── 404.html (custom 404 page)
├── thanks.html (form success page)
├── css/
│   └── styles.css (consolidated v2 design system)
├── js/
│   ├── theme-manager.js (dynamic themes & profile pics)
│   └── wheel.js (orbit wheel animation)
├── assets/
│   ├── CLAUDE.md (asset documentation)
│   └── images/ (shared images: logos, profile pics, illustrations)
└── v1/ (legacy archive - complete v1 site)
    ├── index.html
    ├── bio.html
    ├── template-agent.html
    ├── agents/
    └── assets/
        ├── css/ (v1 styles: main, glassmorphism, components)
        └── js/ (v1 scripts)
```

### HTML Standards

- **HTML5** with semantic elements.
- **Mobile-first responsive**.
- **Accessibility** (ARIA labels, alt text, semantic structure).
- **Consistent navigation** across all pages.
- **Same CSS/JS includes** on every page.

### CSS Load Order

**v2.0 Architecture** (current):

All HTML pages use a single consolidated stylesheet:

```html
<link rel="stylesheet" href="css/styles.css">
```

**v1.0 Architecture** (legacy - archived in `/v1/`):

v1 used three separate files that had to load in exact order:

```html
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="assets/css/glassmorphism.css">
<link rel="stylesheet" href="assets/css/components.css">
```

**Migration Note**: v2 consolidated these three files into a single `css/styles.css` for improved maintainability and reduced HTTP requests.

### Design Philosophy (NON-NEGOTIABLE)

**Core Message**: "Easy, smooth, and relaxed"

Every design decision must support this feeling. The aesthetic itself teaches that building AI agents is accessible, not intimidating.

**Visual Style**: Dark glassy space
- See `assets/CLAUDE.md` for complete design system
- See `.claude/knowledge/website-requirements/CLAUDE.md` for philosophy

---

## Current Phase: v2.0 Complete

**Status**: v2 redesign complete and functional  
**Branch**: `feature/website-revamp` (ready for review/merge)  
**Architecture**: Consolidated CSS, dynamic theming, advanced UI features

### v2 Features Implemented

**Core Pages**:
- ✅ Landing page with orbit wheel hero animation
- ✅ About page with dynamic profile picture randomization
- ✅ Blog with inline article system and sticky sidebar
- ✅ Contact form using FormSubmit.co API
- ✅ Teaching Assistant agent showcase page
- ✅ Custom 404 error page
- ✅ Form success (thanks) page

**Technical Enhancements**:
- ✅ Consolidated CSS (`css/styles.css`)
- ✅ Dynamic theme manager (`js/theme-manager.js`)
- ✅ Physics-based orbit wheel (`js/wheel.js`)
- ✅ Responsive design across all pages
- ✅ SEO meta tags and semantic HTML

**Legacy Archive**:
- ✅ v1 site archived in `/v1/` directory
- ✅ v1 assets moved to `/v1/assets/`
- ✅ All v1 pages remain functional

### Next Steps

**Documentation**:
- Continue refining knowledge base in `.claude/knowledge/`
- Consider blog content development

**Deployment**:
- Merge `feature/website-revamp` to main
- Deploy to GitHub Pages

---

## Governance & Practical Suggestions
- Local CLAUDE.md files are intentionally flexible — include the fields you need (observations/context, exhaustive file list, plan steps, verification, and summary) but do not feel constrained by a rigid template.
- Consider lightweight automated checks (GitHub Actions) that validate required behaviors without adding a build step (e.g., check CSS include order, ensure a CLAUDE.md exists for PRs touching content directories).
- Define merge/publish workflow in a CONTRIBUTING.md if contributors will be external.

```
```
