# Website Requirements - Working Memory

## Purpose

This directory captures all requirements, decisions, and planning for the course website rebuild.

## Current Phase: OBSERVE & PLAN

**Status**: Gathering requirements from user discussion
**Date**: 2025-11-08

---

## What We Know So Far

### Course Fundamentals
- **Type**: Claude Code Engineering course
- **Format**: Monthly cohorts of 10-15 students
- **Core Offering**: Template agent that students customize
- **Teaching Goal**: Build personal assistants from template

### Website Needs
1. Landing page for the course
2. Educational materials (downloadable)
3. Agent projects showcase
4. Individual agent-managed pages (agents maintain their own topic pages)

---

## Questions to Answer (During Discussion)

### Course Details
- [ ] Official course name
- [ ] Target audience and skill level
- [ ] Course description/overview
- [ ] Instructor information
- [ ] Pricing and enrollment details
- [ ] Schedule and timeline

### Content & Materials
- [ ] Educational materials format (PDFs, code, videos, docs)
- [ ] What is the "template agent" exactly?
  - [ ] MCP server?
  - [ ] Codebase/repository?
  - [ ] Claude Code configuration?
  - [ ] Something else?

### Agent Projects
- [ ] Who creates these projects?
  - [ ] Instructor examples?
  - [ ] Student projects from past cohorts?
  - [ ] Live demonstrations?
- [ ] How do "agent-managed pages" work?
  - [ ] Autonomous git commits?
  - [ ] What topics?
  - [ ] Update frequency?

### Technical Requirements
- [ ] Authentication needed?
- [ ] Forms (enrollment, contact)?
- [ ] Firebase - keep or remove?
- [ ] Hosting preference
- [ ] Custom domain
- [ ] Launch deadline

---

## Planned Outputs (To Be Defined)

### Files to Create During Planning
```
TBD - will define as requirements become clear:
- Site structure document
- Technology stack decision
- Page wireframes/content outline
- Deployment plan
```

### Actual Implementation Files
```
TBD - will be defined in this CLAUDE.md first, then generated
```

---

## Notes from Discussion

### Session 1: Site Structure (2025-11-08)

**Website Structure Clarified:**

1. **Primary Purpose**: Landing page for:
   - The course
   - The template agents

2. **Side Pages Architecture**:
   - Each side page = one customized template agent
   - Each agent manages its own page autonomously
   - Page content types:
     - Content pages
     - Research reports
     - Other agent-generated content
   - Each page showcases what that specific customized agent does
   - Plan: A few such pages (not many, keep it simple)

3. **Additional Pages**:
   - **Personal Bio Page**: Simple, basic personal information
   - **Template Agent Page**: Dedicated page for the base template agent
     - Will document basic behaviors
     - User has example HTML pages to share (pending)

**Key Insight**: The site demonstrates the concept by example - each side page IS a working customized agent managing itself.

---

## Updated Site Structure

```
Website
├── 🏠 Landing Page (main focus)
│   └── Course + Template Agents overview
│
├── 🤖 Template Agent Page
│   └── Base agent behaviors and documentation
│
├── 📄 Agent-Managed Side Pages (few examples)
│   ├── Example 1: [Topic TBD] - managed by customized agent
│   ├── Example 2: [Topic TBD] - managed by customized agent
│   └── Example 3: [Topic TBD] - managed by customized agent
│
└── 👤 Personal Bio
    └── Simple personal information page
```

---

## Next Steps

- [ ] Wait for example HTML pages from user
- [ ] Determine specific topics for agent-managed pages
- [ ] Define how agents will update their pages (git workflow)
- [ ] Choose technology stack based on requirements

