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

When working on any task, follow this cycle:

1. **Observe** - Gather context from:
   - User conversations
   - Web research
   - Other subdirectories' CLAUDE.md files
   - Other repositories
   - Existing codebase

2. **Plan** - Document context in relevant local CLAUDE.md file, then create execution plan

3. **Execute** - Implement based on documented context and plan

4. **Verify** - Test and validate implementation

5. **Report** - Communicate results to user

6. **(r+) Iterate** - Repeat as needed

### Principle

**Active, proactive, and retroactive use of CLAUDE.md files as working memory**

- **Active**: Currently working with populated CLAUDE.md
- **Proactive**: Create and populate before starting work
- **Retroactive**: Review and update after completion

### CLAUDE.md File Lifecycle

#### During Development
- Maintain detailed notes
- Document decisions and context
- Track dependencies and relationships
- Note issues and resolutions

#### After Successful Implementation
- Condense to essential information only
- Keep what's needed for:
  - Future stability
  - Permissions and access patterns
  - Maintenance and updates
  - Onboarding and understanding

### Rules

1. **ALWAYS** populate local CLAUDE.md BEFORE starting work in that area
2. **NEVER** skip documentation - it's your working memory
3. **UPDATE** CLAUDE.md files as context evolves
4. **CONDENSE** after successful completion to maintain clarity
5. **REFERENCE** related CLAUDE.md files for cross-cutting concerns

---

## Core Principle: Compartmentalization

**Work on different topics and aspects separately - not everything at once.**

### Separation of Concerns

1. **Structure vs. Content**
   - Build website structure/framework first with placeholders
   - Add actual content separately in later phase
   - Use `[Placeholder text for ...]` to maintain focus

2. **Design vs. Implementation**
   - Define styling and UX principles first
   - Implement functionality separately
   - Keep visual consistency documented in local CLAUDE.md

3. **Focus on One Aspect at a Time**
   - Complete one compartmentalized task fully
   - Don't mix concerns (e.g., don't develop content while building framework)
   - This prevents distraction and maintains clarity

### Benefits

- Clearer thinking and planning
- Easier to verify each aspect independently
- Better separation of concerns in codebase
- Prevents scope creep and confusion
- Enables parallel work on different compartments later

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

- **Pure HTML/CSS/JS** - No frameworks, no build process
- **Static site** - No server-side rendering, no databases
- **Vanilla JavaScript** - No jQuery, React, Vue, or other libraries
- **No preprocessors** - No SASS, LESS, TypeScript compilation
- **No package managers** - No npm, yarn (except for local dev server)

**Rationale**:
1. Simple for agents to update (just edit HTML)
2. No dependencies to manage or break
3. Fast loading and performance
4. Direct browser compatibility
5. GitHub Pages compatible
6. Easy to visually inspect

### File Structure

```
/
├── index.html (landing page)
├── bio.html (personal bio)
├── template-agent.html (template documentation)
├── agents/ (agent-managed pages)
│   ├── CLAUDE.md
│   ├── example-1.html
│   ├── example-2.html
│   └── example-3.html
└── assets/ (all static assets)
    ├── CLAUDE.md (design system documentation)
    ├── css/ (3 files, specific load order)
    ├── js/ (minimal vanilla JS)
    └── images/
```

### HTML Standards

- **HTML5** with semantic elements
- **Mobile-first responsive**
- **Accessibility** (ARIA labels, alt text, semantic structure)
- **Consistent navigation** across all pages
- **Same CSS/JS includes** on every page

### CSS Load Order (CRITICAL)

All HTML pages MUST include CSS in this exact order:

```html
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="assets/css/glassmorphism.css">
<link rel="stylesheet" href="assets/css/components.css">
```

Changing this order will break styles.

### Design Philosophy (NON-NEGOTIABLE)

**Core Message**: "Easy, smooth, and relaxed"

Every design decision must support this feeling. The aesthetic itself teaches that building AI agents is accessible, not intimidating.

**Visual Style**: Dark glassy space
- See `assets/CLAUDE.md` for complete design system
- See `.claude/knowledge/website-requirements/CLAUDE.md` for philosophy

---

## Current Phase: Structure Complete

**Status**: All pages created with placeholders
**Next Phase**: Content development (separate compartmentalized task)

**DO NOT**:
- Mix content development with structural changes
- Change tech stack without updating this file
- Add dependencies or build tools
- Modify design system colors/spacing arbitrarily

**Always Reference**:
- `assets/CLAUDE.md` for design system and styling
- `agents/CLAUDE.md` for agent page workflows
- `.claude/knowledge/website-requirements/CLAUDE.md` for requirements
