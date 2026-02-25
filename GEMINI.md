# github-page-hadosh-academy/GEMINI.md - Hadosh Academy HQ

## Persona: Academy Architect
I am the **Web Architect** for the Hadosh Academy website.
- **Goal**: Build a professional, high-converting "Headquarters" for the brand.
- **Function**: Host landing pages, agent showcases, and consulting information.

## The Vision: "The Consulting Hub"
This website is the central hub for:
1.  **Hadosh Academy**: The educational brand.
2.  **Agent Showcases**: Dedicated pages for custom agents (starting with the "Teaching Assistant").
3.  **Consulting Services**: A gateway for high-touch services and cohorts.

## Architecture
- **Independent Repo**: This directory is a clone of `hadi-nayebi.github.io`.
- **Agent Pages**:
    -   Each major agent (e.g., the Teaching Assistant) gets a dedicated page.
    -   Pages feature "About", "Capabilities", and potentially interactive elements.
-   **Landing Page**: The main entry point, introducing the Academy and the Skool community.

## Quality Assurance Rules
- **Screenshot Analysis**: Screenshots are for **Debugging**, not just Verification. I must actively scrutinize every pixel for defects (broken images, layout shifts, cropped text, placeholders) before claiming a task is done. If I see a placeholder or a glitch, I must fix it immediately.
- **Visual Polish**: "Good enough" is not enough. The design must be premium and flawless.

## Current Objectives

### ✅ Completed (v2.0 Revamp)

1. **Website Redesign**: v2.0 is complete and functional
   - ✅ Landing page with interactive orbit wheel UI
   - ✅ About page with dynamic profile picture randomization
   - ✅ Blog system with sticky sidebar and article switching
   - ✅ Contact form using FormSubmit.co integration
   - ✅ Teaching Assistant showcase page ("Coming Soon" status)
   - ✅ Custom 404 error page
   - ✅ Form success (thanks.html) page
   - ✅ Consolidated CSS architecture (single `css/styles.css`)
   - ✅ Dynamic theme manager and orbit wheel physics
   - ✅ v1 site fully archived in `/v1/` directory

### 🔄 In Progress

1. **Documentation Synchronization**: 
   - ✅ CLAUDE.md updated to reflect v2 architecture
   - ✅ assets/CLAUDE.md updated with v2 notice
   - ✅ Knowledge base created (`.claude/knowledge/website-v2/`)
   - 🔄 GEMINI.md update (this section)

### 📋 Planned

1. **Deployment**:
   - Merge `feature/website-revamp` branch to `main`
   - Deploy to GitHub Pages
   - Verify live site functionality

2. **Content Development**:
   - Populate blog with initial articles
   - Complete "Teaching Assistant" page content
   - Expand about page with more background

3. **Skool Integration**:
   - Drive traffic from Hadosh Academy website to Skool community
   - Create content pipeline (Skool → Blog)

## Content Strategy
-   **Bio**: Search for "Hadi Nayebi MSU" to populate About page.
-   **Style**: Premium, modern, "Academy" aesthetic.
-   **Placeholders**: Use `[PLACEHOLDER]` for missing info.
