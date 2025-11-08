# Agent-Managed Pages - Working Memory

## Purpose

This directory contains pages that are managed by customized template agents. Each page showcases a specific agent and its specialty.

## Current Phase: STRUCTURE CREATED

**Status**: HTML templates created with placeholders
**Next Phase**: Define specific agent topics and configure agent update workflow

---

## Agent Pages Structure

### Current Pages
1. **example-1.html** - [Topic TBD]
2. **example-2.html** - [Topic TBD]
3. **example-3.html** - [Topic TBD]

Each page includes:
- Agent name and specialty
- Description of customization
- Agent-generated content area
- Last updated timestamp
- Navigation to other agent examples

---

## How Agents Will Update Pages

**TBD - To be defined based on workflow requirements**

Potential approaches:
- [ ] Agents make direct commits to their respective HTML files
- [ ] Agents create PRs for review before merge
- [ ] Agents work on dedicated branches
- [ ] Hybrid: automatic for content sections, PR for structural changes

**Git Workflow Considerations**:
- How to prevent conflicts between agents
- Review process (automated vs manual)
- Rollback procedures if agent makes errors
- Testing before deployment

---

## Agent Topics (To Be Defined)

Ideas for agent specialties:
- [ ] Research agent on specific topic (e.g., AI developments, tech trends)
- [ ] Content curator for a domain (e.g., design patterns, best practices)
- [ ] Documentation agent (e.g., maintaining guides, tutorials)
- [ ] Analysis agent (e.g., code analysis, performance insights)
- [ ] News aggregator (e.g., weekly summaries of specific field)

---

## Styling Consistency

**CRITICAL**: All agent pages must maintain the design philosophy:

> "Engineering my own agents is not complex and overwhelming. It is easy, smooth, and relaxed."

**Design Requirements**:
- Dark glassy space aesthetic
- Floating glass elements
- No harsh boundaries
- Generous whitespace
- Smooth transitions
- Calming, approachable feel

See `/assets/css/` for styling guidelines.

---

## Content Guidelines for Agents

When agents update their pages:
1. **Maintain HTML structure** - Don't break the template
2. **Update timestamp** - Always update "Last updated by agent" field
3. **Keep placeholder format** - Use `[Description]` format for clarity
4. **Test locally** - Verify page renders correctly
5. **Commit message format** - Clear description of updates

---

## Future Enhancements

- [ ] Add RSS feeds for agent updates
- [ ] Create agent activity log/changelog
- [ ] Add search/filter functionality for agent content
- [ ] Implement agent "health check" (last update, errors, etc.)
- [ ] Create agent dashboard showing all agents' status
