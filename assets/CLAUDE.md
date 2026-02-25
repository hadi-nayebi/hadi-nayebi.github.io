> [!IMPORTANT]
> **v2 Architecture Note**: This directory primarily serves the v1 archive (located in `/v1/`).
> 
> **v2 uses**:
> - CSS: `/css/styles.css` (consolidated)
> - JS: `/js/theme-manager.js` and `/js/wheel.js`
> - Images: `/assets/images/` (shared across versions)
> 
> The v1 CSS/JS files have been moved to `/v1/assets/` to match v1 page references.

---

# Assets - Working Memory

## Purpose

This directory contains all static assets for the website: CSS, JavaScript, and images.

## Technology Stack

**FIXED - DO NOT CHANGE**:
- **Pure CSS** (no preprocessors like SASS/LESS)
- **Vanilla JavaScript** (no frameworks like React/Vue)
- **No build process** (no Webpack, Vite, etc.)
- **Static files only** (direct browser consumption)

**Rationale**:
- Simple for agents to update
- No dependencies to manage
- Fast loading
- Direct visual inspection

---

## Design System (CRITICAL - MUST MAINTAIN)

### Core Principle

> "Engineering my own agents is not complex and overwhelming. It is easy, smooth, and relaxed."

**This feeling MUST be maintained in all design decisions.**

### Visual Style: Dark Glassy Space

**Non-negotiable characteristics**:
- Dark background (space-like: `#0a0e27`)
- Glassmorphism effects (frosted glass, transparency)
- Floating elements (subtle shadows, elevation)
- Minimal visible lines and boundaries
- Generous whitespace
- Smooth, soft edges
- Calming, not overwhelming

### Color Palette (FIXED)

```css
--color-space-deep: #0a0e27;
--color-space-mid: #1a1f3a;
--color-space-light: #2a2f4a;
--color-accent-primary: #667eea;
--color-accent-secondary: #764ba2;
--color-accent-glow: rgba(102, 126, 234, 0.3);
```

**DO NOT** change these colors without updating this CLAUDE.md file.

### Spacing Scale (FIXED)

```css
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2.5rem;
--space-xl: 4rem;
--space-2xl: 6rem;
```

Use these consistently. DO NOT add arbitrary spacing values.

---

## File Structure

```
assets/
├── CLAUDE.md (this file - v1 reference documentation)
└── images/ (shared: v1 and v2)
    ├── hadosh-logo-dark.png
    ├── hadosh-logo-transparent.png
    ├── hero-construction.png
    ├── profile-pic1.png
    └── profile-pic2.png
```

**Note**: v1 CSS/JS files have been moved to `/v1/assets/css/` and `/v1/assets/js/` to keep the v1 archive complete.

### CSS Architecture

**Load Order (CRITICAL)**:
1. `main.css` - Must load first (base styles, design system)
2. `glassmorphism.css` - Second (effects build on base)
3. `components.css` - Third (components use both)

**DO NOT** change this load order or styles will break.

### CSS Methodology

- **CSS Variables** for all design tokens (colors, spacing, etc.)
- **No !important** unless absolutely necessary
- **Mobile-first** responsive design
- **Class-based** styling (avoid IDs for styles)

---

## JavaScript Guidelines

**Keep It Minimal**:
- Vanilla JS only
- Progressive enhancement (site works without JS)
- No external libraries (except Google Fonts)
- No build step

**Current JS Features**:
- Active navigation highlighting
- Smooth scroll (backup for CSS)
- Optional parallax (commented out)

---

## Adding New Styles

When adding new styles:

1. **Check existing variables** - Use design system tokens
2. **Follow glassmorphism pattern** - Maintain aesthetic
3. **Test responsively** - Mobile and desktop
4. **Update this CLAUDE.md** - Document new patterns

### Example Glass Element

```css
.new-glass-element {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-base);
}

.new-glass-element:hover {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-4px);
}
```

---

## Images

**Directory**: `assets/images/`

**Purpose**:
- Store all visual assets for the website
- Landing page images (hero backgrounds, illustrations, logos)
- Icons and graphics
- Agent page visuals
- Any other imagery used across the site

**Current Status**:
- Directory created and ready for uploads
- User will upload images for landing page development

**Guidelines**:
- Optimize before adding (compress, resize)
- Use modern formats (WebP with fallback)
- Include alt text in HTML
- Dark mode compatible
- Name files descriptively (e.g., `hero-background.jpg`, `logo-light.svg`)
- Keep file sizes reasonable (compress images)

---

## DO NOT

- ❌ Add CSS frameworks (Bootstrap, Tailwind, etc.)
- ❌ Add JavaScript frameworks (React, Vue, etc.)
- ❌ Change core color palette without updating CLAUDE.md
- ❌ Use arbitrary values (always use design system)
- ❌ Add build tools or preprocessors
- ❌ Break mobile responsiveness
- ❌ Change the load order of CSS files
