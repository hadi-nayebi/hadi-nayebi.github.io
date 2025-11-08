# CLAUDE.md Working Memory System

## System Design

Created: 2025-11-08
Status: Active

### Purpose

A structured knowledge management system where CLAUDE.md files serve as working memory for AI agents working on this project.

### Architecture

#### File Types

1. **Root CLAUDE.md** (`/CLAUDE.md`)
   - Core instructions for the entire project
   - High-level workflow guidelines
   - Project overview
   - Links to knowledge base

2. **Knowledge Base** (`.claude/knowledge/<topic>/<name>.md`)
   - Organized by topic
   - Permanent learnings
   - Reference material
   - Decisions and context

3. **Local CLAUDE.md** (`<subdirectory>/CLAUDE.md`)
   - Working memory for specific areas
   - Context for that subdirectory
   - Active during development
   - Condensed after completion

### Workflow: OPEV(r+)

**O - Observe**: Gather context from multiple sources
**P - Plan**: Document in local CLAUDE.md, create execution plan
**E - Execute**: Implement based on documented context
**V - Verify**: Test and validate
**(r+) - Iterate**: Report and repeat as needed

### Usage Patterns

#### Before Starting Work
1. Identify relevant subdirectory
2. Create/locate local CLAUDE.md
3. Gather context from:
   - User conversations
   - Root CLAUDE.md
   - Related knowledge files
   - Other subdirectories
   - Web research
4. Populate local CLAUDE.md with context
5. Plan based on documented context

#### During Work
- Reference local CLAUDE.md continuously
- Update as new information emerges
- Add decisions, issues, resolutions
- Maintain detailed notes

#### After Completion
- Verify implementation
- Condense local CLAUDE.md to essentials
- Keep only:
  - Critical context for future work
  - Stability/maintenance info
  - Permission patterns
  - Key architectural decisions

### Principles

1. **Active**: Use populated CLAUDE.md during work
2. **Proactive**: Create and populate BEFORE starting
3. **Retroactive**: Review and update AFTER completion
4. **Interconnected**: Reference related files for cross-cutting concerns
5. **Living Document**: Evolves with project understanding

### Benefits

- Persistent context across sessions
- Knowledge transfer between agents
- Reduced redundant research
- Better decision continuity
- Easier onboarding
- Documentation naturally emerges from work
