# CLAUDE.md — Website Project Working Memory
**Version:** v0.1.0

## Purpose

Local working memory for the Hadosh Academy website (`hadi-nayebi.github.io`).

**This is the PROJECT, not the brain.** Brain lives at `../.claude/`.

---

## Technology Stack (FIXED)

- Pure HTML/CSS/JS — no frameworks
- Static site — GitHub Pages
- Single CSS file: `css/styles.css`
- JS files: `js/theme-manager.js`, `js/wheel.js`, `js/components.js` (planned)

---

## Current File Inventory

### Active Files (v2)
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Landing page with orbit wheel | Needs cleanup |
| `about.html` | Personal page (Hadi bio) | Needs cleanup |
| `blog.html` | Blog index (hardcoded articles) | Needs rewrite |
| `contact.html` | Contact form (FormSubmit.co) | Needs cleanup |
| `teaching-assistant.html` | Agent showcase | Rename to agents.html |
| `404.html` | Custom 404 page | Needs cleanup |
| `thanks.html` | Form success page | Needs cleanup |
| `css/styles.css` | Design system | Needs cleanup |
| `js/theme-manager.js` | Random themes + profile pics | Needs cleanup |
| `js/wheel.js` | Orbit wheel animation | Needs cleanup |

### Legacy / Cleanup Candidates
| File/Dir | Purpose | Action |
|----------|---------|--------|
| `v1/` | Archived v1 site | Review — likely remove |
| `.browserslistrc` | Angular leftover | Remove |
| `.editorconfig` | Angular leftover | Review |
| `.vscode/` | Editor config | Review |
| `assets/CLAUDE.md` | v1 design docs | Migrate useful content, remove |
| `v1/agents/CLAUDE.md` | v1 agent docs | Remove with v1/ |
| `.claude/knowledge/website-v2/` | Stale v2 docs | Already empty |

### Planned New Files
| File | Purpose |
|------|---------|
| `agents.html` | Agent showcase (replaces teaching-assistant.html) |
| `blog/` | Directory for individual blog post HTML files |
| `blog/llms-are-not-the-agents.html` | First real blog article |
| `js/components.js` | Shared nav/footer injection |

---

## Known Issues

1. **Duplicate nav/footer** — copied in all 7 HTML files
2. **Inline styles** — scattered `style="..."` attributes in HTML
3. **Blog styles in `<style>` tag** — should be in `css/styles.css`
4. **Hardcoded blog content** — JS objects in blog.html
5. **Wrong copyright year** — says 2025
6. **Stale references** — teaching-assistant.html, old wheel phrases
7. **Angular leftovers** — .browserslistrc, maybe .editorconfig
8. **v1 archive** — may be safe to remove

---

## Design System Summary

- Dark background: `#050507`
- Primary: `#6366f1` (indigo)
- Accent: `#8b5cf6` (violet)
- Font: Inter (Google Fonts)
- Glassmorphism: `backdrop-filter: blur()`
- Random theme rotation: 5 color schemes per visit
