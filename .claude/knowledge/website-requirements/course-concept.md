# Course Concept - Initial Understanding

Date: 2025-11-08
Status: Pending detailed discussion with user

## Course Overview

**Working Name**: Claude Code Engineering
**Format**: Monthly cohorts
**Size**: 10-15 students per cohort
**Type**: Educational course

## Core Concept

Teaching students how to build a personal assistant from a template agent, with customization as the primary learning objective.

### Key Components

1. **Template Agent**
   - Base offering provided to students
   - Starting point for customization
   - Details pending user clarification

2. **Educational Materials**
   - Shared on the website
   - Available for download
   - Format and content TBD

3. **Agent Projects Showcase**
   - Custom agents doing specific tasks
   - Example: Agent researching and managing its own page on a topic
   - Side projects pages
   - Demonstrates what students can build

### Unique Concept: Agent-Managed Pages

Students build agents that can autonomously manage their own pages:
- Agent works on a specific topic
- Agent researches the topic
- Agent updates its dedicated page
- Demonstrates practical AI capabilities

## Website Purpose

Landing page for the course that provides:
1. Course information and overview
2. Educational material downloads
3. Showcase of agent projects (examples/student work)
4. Individual pages for specific agents/projects

## Questions to Clarify

### About the Course
- [ ] Official course name?
- [ ] Target audience? (developers, non-technical, mixed)
- [ ] Skill level expectations?
- [ ] Course schedule/timeline?
- [ ] Pricing/enrollment information?
- [ ] Instructor information to display?

### About Content
- [ ] Educational materials format? (PDFs, code, videos, docs)
- [ ] Template agent details - what is it exactly?
  - MCP server?
  - Codebase?
  - Claude Code configuration?
- [ ] Agent projects source:
  - Instructor examples?
  - Student projects?
  - Live agent-managed pages?

### About Agent-Managed Pages
- [ ] Workflow: How do agents update their pages?
- [ ] Autonomous commits/pushes?
- [ ] Demo vs. production?
- [ ] Example topics for agent pages?

### Technical Requirements
- [ ] Keep Firebase or remove?
- [ ] Need authentication/user accounts?
- [ ] Forms needed? (enrollment, contact)
- [ ] Framework preference?
- [ ] Hosting preference?
- [ ] Custom domain?
- [ ] Launch timeline?

## Proposed Site Structure (Draft)

```
📦 Course Website
├── 🏠 Landing Page
│   ├── Course Overview
│   ├── What You'll Learn
│   ├── Cohort Information
│   └── Enrollment CTA
│
├── 📚 Educational Materials
│   ├── Resources
│   ├── Downloads
│   └── Documentation
│
├── 🤖 Agent Projects
│   ├── Showcase Gallery
│   ├── Template Agent Info
│   └── Example Projects
│
└── 📄 Individual Agent Pages
    └── Agent-managed content
```

## Next Steps

1. Complete questions above with user
2. Finalize site structure
3. Choose technology stack
4. Begin implementation with OPEV(r+) workflow
