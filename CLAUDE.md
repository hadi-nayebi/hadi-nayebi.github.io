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

## Project Overview

**Repository**: hadi-nayebi.github.io
**Purpose**: Course website for Claude Code Engineering
**Status**: Legacy Angular app being rebuilt
**Branch**: `claude/rebuild-legacy-website-011CUuqJn9qBHTemVAYhcAzo`

See `.claude/knowledge/` for detailed project information.
