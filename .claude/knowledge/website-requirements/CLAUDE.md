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

---

## Design Philosophy & Styling Requirements

### Core Emotional Message

**CRITICAL**: The website must visually communicate this feeling immediately:

> "Engineering my own agents is not complex and overwhelming. Actually, it is easy, smooth, and relaxed, and you can learn it easily. Just follow along with me."

The aesthetic itself teaches that this is **accessible, not scary**.

### Visual Style: Dark Glassy Space

**Theme**: Darker, spacious, glassy, floating elements in space

**Key Characteristics**:
- Dark background (space-like)
- Glass morphism effects (frosted glass, transparency)
- Floating elements (subtle shadows, elevation)
- Minimal visible lines and boundaries
- Generous whitespace
- Smooth, soft edges
- Calming, not overwhelming

### Interactive Elements

**Buttons & Clickables**:
- Floating glass or matte glass appearance
- Hover states: subtle glow or lift effect
- No harsh borders
- Smooth transitions

**Navigation**:
- Intuitive, minimal
- No overwhelming menus
- Clear visual hierarchy
- Smooth page transitions

### Typography & Layout

- Clean, modern fonts
- Generous line spacing
- Not too much text on screen at once
- Clear visual breathing room

### Color Palette

- **Base**: Dark grays, deep blues/purples (space-like)
- **Accents**: Soft glows, subtle gradients
- **Glass**: Semi-transparent whites/light grays
- **Text**: High contrast but not harsh

### UX Principles

1. **Not Overwhelming**: Less is more
2. **Intuitive**: No need to think about navigation
3. **Smooth**: Everything flows naturally
4. **Calming**: Relaxed, confident feeling
5. **Approachable**: Friendly, welcoming

---

## Current Phase: Structure Only (No Content)

**Compartmentalization**: Building website structure with placeholders ONLY

- Use `[Placeholder text for ...]` throughout
- Focus on structure, layout, and styling
- Content development is a separate phase
- This prevents distraction and scope creep

---

---

## Technology Stack & Architecture

### Decision: Static HTML/CSS/JS

**Rationale**:
- Simple, no build process required
- Easy for agents to update (just edit HTML/markdown files)
- Fast loading, no framework overhead
- Perfect for GitHub Pages hosting
- Direct visual inspection
- No dependencies to manage

### File Structure Plan

```
/
├── CLAUDE.md (root instructions)
├── .claude/ (knowledge management)
├── index.html (landing page)
├── bio.html (personal bio)
├── template-agent.html (base template agent page)
├── agents/
│   ├── CLAUDE.md (agent pages working memory)
│   ├── example-1.html (agent-managed page 1)
│   ├── example-2.html (agent-managed page 2)
│   └── example-3.html (agent-managed page 3)
├── assets/
│   ├── css/
│   │   ├── main.css (core styling)
│   │   ├── glassmorphism.css (glass effects)
│   │   └── components.css (reusable components)
│   ├── js/
│   │   └── main.js (interactions, if needed)
│   └── images/
│       └── (placeholder images)
└── README.md
```

### CSS Architecture

**Modular CSS Files**:
1. **main.css**: Core layout, typography, colors, base styles
2. **glassmorphism.css**: Glass effects, shadows, floating elements
3. **components.css**: Buttons, cards, navigation, reusable UI

**CSS Variables**: Define design system in :root
- Colors (dark theme, accents)
- Spacing scale
- Glass effect parameters
- Typography scale

### HTML Template Structure

**Shared Elements Across All Pages**:
- Navigation (minimal, floating glass bar)
- Footer (simple, glass card)
- Same base styling/classes
- Consistent spacing and layout

**Page-Specific Content**:
- Each page has unique content area
- All use placeholder text initially
- Consistent visual treatment

---

## Files to Create (Defined Here, Generated Next)

### 1. `/index.html` - Landing Page
**Purpose**: Main course and template agent overview
**Sections**:
- Hero section (large, centered, minimal)
- Course overview (brief, inviting)
- Template agent introduction
- Call-to-action (explore agents, view bio)
**Placeholders**: All text as `[Placeholder for ...]`

### 2. `/bio.html` - Personal Bio
**Purpose**: Simple personal information
**Sections**:
- Brief intro
- Background/experience
- Contact or social links (optional)
**Placeholders**: All biographical info

### 3. `/template-agent.html` - Template Agent Page
**Purpose**: Document base agent behaviors
**Sections**:
- What is the template agent
- Basic behaviors list
- How to customize
- Link to example customized agents
**Placeholders**: Technical documentation placeholders
**Note**: Will reference user's example HTML pages when provided

### 4. `/agents/example-1.html` - Agent-Managed Page 1
**Purpose**: Showcase customized agent (topic TBD)
**Structure**:
- Page header identifying the agent
- Agent description
- Agent-generated content area
- Last updated timestamp (for agent tracking)
**Placeholders**: Agent topic and content

### 5. `/agents/example-2.html` - Agent-Managed Page 2
**Purpose**: Showcase customized agent (topic TBD)
**Structure**: Same as example-1

### 6. `/agents/example-3.html` - Agent-Managed Page 3
**Purpose**: Showcase customized agent (topic TBD)
**Structure**: Same as example-1

### 7. `/agents/CLAUDE.md` - Agent Pages Working Memory
**Purpose**: Document agent-managed pages context
**Content**:
- How agents update their pages
- Topics for each agent page
- Git workflow for agents
- Consistency guidelines

### 8. `/assets/css/main.css` - Core Styling
**Content**:
- CSS variables (design system)
- Base layout (flexbox/grid)
- Typography
- Dark theme colors
- Spacing utilities

### 9. `/assets/css/glassmorphism.css` - Glass Effects
**Content**:
- Frosted glass backgrounds
- Blur effects
- Subtle shadows
- Floating element elevation
- Transparency layers

### 10. `/assets/css/components.css` - UI Components
**Content**:
- Glass buttons
- Navigation bar
- Content cards
- Footer
- Links and hover states

### 11. `/assets/js/main.js` - Interactions
**Content**:
- Smooth scroll (if needed)
- Navigation highlighting
- Any subtle animations
- Minimal, lightweight

### 12. `/README.md` - Repository Documentation
**Content**:
- Project overview
- How to run locally
- How agents update their pages
- Build/deployment info

---

## Next Steps

- [x] Tech stack defined
- [ ] Generate all files based on above definitions
- [ ] Apply glassmorphism styling
- [ ] Verify visual design
- [ ] Test in browser

