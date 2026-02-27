# CLAUDE.md — Website Project Working Memory
**Version:** v0.2.1

## Purpose

Local working memory for the Hadosh Academy website (`hadi-nayebi.github.io`).

**This is the PROJECT, not the brain.** Brain lives at `../.claude/`.

---

## Technology Stack (FIXED)

- Pure HTML/CSS/JS — no frameworks
- Static site — GitHub Pages
- Single CSS file: `css/styles.css`
- JS files: `js/theme-manager.js`, `js/wheel.js`, `js/components.js`

---

## Current File Inventory (v3)

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, orbit wheel, info cards |
| `about.html` | Personal page (Hadi bio) |
| `blog.html` | Blog article index |
| `blog/llms-are-not-the-agents.html` | First blog article |
| `agents.html` | Agent showcase (Basic Agent) |
| `contact.html` | Contact form (FormSubmit.co) |
| `404.html` | Custom 404 page |
| `thanks.html` | Form success page |

### Assets
| File | Purpose |
|------|---------|
| `css/styles.css` | Consolidated design system (705 lines) |
| `js/components.js` | Shared nav/footer injection, active page, dynamic year |
| `js/theme-manager.js` | Random theme rotation + profile pic |
| `js/wheel.js` | Orbit wheel animation with phrases |
| `assets/images/` | Logo, profile pics, hero image |

### Config
| File | Purpose |
|------|---------|
| `.editorconfig` | Editor formatting rules |
| `.gitignore` | Git ignore rules |
| `README.md` | Project description |
| `CLAUDE.md` | This file — project working memory |

---

## Design System Summary

- Dark background: `#050507`
- Primary: `#6366f1` (indigo)
- Accent: `#8b5cf6` (violet)
- Font: Inter (Google Fonts)
- Glassmorphism: `backdrop-filter: blur()`
- Random theme rotation: 5 color schemes per visit
- All styles in css/styles.css — zero inline, zero `<style>` blocks

---

## Content Language Guidelines (NON-NEGOTIABLE)

**Tone ladder** — adjust language by content depth:
- **Front-facing** (landing, agents, about): plain language, non-technical professionals
- **Blog articles**: moderate technical, explain jargon or link to explanations
- **Deep content** (architecture docs): full technical vocabulary OK

**Positive framing** — lead with what we offer:
- "Customize reliable seed agents through conversation"
- "Scale your professional skills with a personalized agentic workforce"
- Pair every negative ("not a chatbot") with a positive concept

**Key messaging pillars:**
- **Reliable & consistent** agents (not flaky AI)
- **Customization through conversation** (no coding, just talk)
- **Scaling professional skills** (lawyers, consultants, researchers extend themselves)

**Agent descriptions** — frame as philosophy, not features:
- "Job-based architecture" not "job scheduler agent" (general, not narrow)
- Describe behaviors users see, not internal mechanisms
- "Prevents the agent from stopping until all work is done" not "blocking stop hook"

**Cross-referencing** — technical terms on front pages must link to blog/docs explanations
