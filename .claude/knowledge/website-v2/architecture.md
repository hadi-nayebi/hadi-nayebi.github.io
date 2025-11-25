# Website v2 Architecture

## Overview

Version 2.0 of the Hadosh Academy website represents a complete redesign focused on:
- **Simplified structure**: Consolidated CSS/JS files
- **Enhanced UX**: Dynamic theming, orbit wheel animation, interactive blog
- **Modern features**: FormSubmit integration, custom 404, responsive design

## Architecture Decisions

### CSS Consolidation

**Decision**: Merge three CSS files into one

**v1 Architecture**:
```
assets/css/
├── main.css (4.2KB) - design system, base styles
├── glassmorphism.css (3.9KB) - glass effects, animations
└── components.css (5.8KB) - UI components, buttons, nav
Total: 13.9KB across 3 files
```

**v2 Architecture**:
```
css/
└── styles.css (8.9KB) - complete design system
```

**Rationale**:
1. **Reduced HTTP requests**: 3 requests → 1 request
2. **Simplified maintenance**: Single source of truth for styles
3. **Better caching**: One file to cache instead of three
4. **Easier to edit**: All styles in one place
5. **No load order issues**: Eliminates critical CSS dependency chain

**Trade-offs**:
- Larger single file (but still smaller total size: 8.9KB vs 13.9KB)
- Less modular (but v2 is simpler overall)

### JavaScript Architecture

**v1**:
```javascript
// assets/js/main.js (1.8KB)
// Basic navigation highlighting, smooth scroll
```

**v2**:
```javascript
// js/theme-manager.js (3.0KB)
// - Randomizes CSS custom properties on page load
// - Switches profile pictures dynamically
// - Generates unique color schemes per visit

// js/wheel.js (8.4KB)
// - Physics-based orbit wheel animation
// - Scroll-controlled rotation
// - Gaussian focus effect
// - Smooth easing and momentum
```

**Rationale**:
- More sophisticated UX requires more JavaScript
- Still vanilla JS, no frameworks
- Total: 11.4KB (still lightweight)
- Progressive enhancement: Site works without JS

### Page Structure Changes

| Aspect | v1 | v2 |
|--------|----|----|
| **Bio** | `bio.html` | `about.html` |
| **Agent Pages** | `/agents/` directory | Single `teaching-assistant.html` |
| **Template** | `template-agent.html` | Removed (moved to v1 archive) |
| **Blog** | Not present | `blog.html` (inline JS article system) |
| **Contact** | Not present | `contact.html` (FormSubmit.co) |
| **404** | Not present | Custom `404.html` |
| **Thanks** | Not present | `thanks.html` (form success) |

**Rationale for changes**:
1. **about.html vs bio.html**: More standard naming convention
2. **Single agent page**: Simplified from directory structure (v1 had placeholder examples)
3. **Blog addition**: Needed for thought leadership, education
4. **Contact form**: Professional touch, lead generation
5. **Custom 404**: Brand consistency

## Design System

### Color Palette

v2 maintains the v1 glassmorphism aesthetic but uses CSS custom properties more extensively:

```css
:root {
  /* Base colors */
  --bg-main: #0a0e1a;
  --bg-card: rgba(26, 31, 42, 0.6);
  --border: rgba(255, 255, 255, 0.1);
  
  /* Text */
  --text-main: #ffffff;
  --text-muted: #9ca3af;
  
  /* Primary (randomized on page load) */
  --primary: /* Dynamic */
  --primary-glow: /* Dynamic */
}
```

**Dynamic Theming**: `theme-manager.js` randomizes `--primary` and `--primary-glow` on each page load, creating unique color schemes from a curated palette.

### Typography

Both v1 and v2 use:
- **Font**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

v2 adds more semantic HTML5 elements for better accessibility.

## New Features

### Orbit Wheel (`js/wheel.js`)

**Purpose**: Hero section animation on landing page

**Technical Details**:
- Physics-based rotation with momentum
- Scroll-controlled (middle 50% of viewport height)
- Gaussian blur focus effect
- 30 orbiting text items ("hooks", "intentions", "memory forms", etc.)
- Smooth easing using `requestAnimationFrame`

**Performance**:
- Uses CSS transforms (GPU-accelerated)
- Blur effect via CSS `filter`
- Optimized for 60fps

### Dynamic Theme Manager (`js/theme-manager.js`)

**Purpose**: Create visual variety across visits

**Behavior**:
1. On page load, randomly selects from 5 color palettes
2. Updates CSS custom properties (`--primary`, `--primary-glow`)
3. On `about.html`, randomly chooses profile picture (1 or 2)

**Color Palettes**:
- Indigo/purple (default)
- Blue/cyan
- Pink/magenta
- Green/teal
- Orange/amber

### Blog System (`blog.html`)

**Architecture**: Inline JavaScript (no backend)

**Structure**:
```javascript
const articles = [
  {
    id: 0,
    title: "...",
    date: "...",
    tags: ["..."],
    content: `<h1>...</h1><p>...</p>`
  },
  // ...
];
```

**Features**:
- Sidebar with clickable article cards
- Active article highlighting
- Smooth content transitions (fade effect)
- Tag system for categorization
- Read time estimates

**Benefits**:
- No database needed
- No build step
- Easy to add articles (just edit HTML)
- Fast loading (all content bundled)

### FormSubmit Integration (`contact.html`)

**Service**: FormSubmit.co (free form backend)

**Configuration**:
```html
<form action="https://formsubmit.co/hadinayebi+hadoshacademy@earthone.life" method="POST">
  <input type="hidden" name="_subject" value="New Submission from Hadosh Academy Website">
  <input type="hidden" name="_next" value="https://hadosh-academy.github.io/thanks.html">
  <input type="hidden" name="_captcha" value="false">
  <!-- Form fields -->
</form>
```

**Benefits**:
- No backend server needed
- No API keys or authentication
- Redirects to custom `thanks.html` page
- Email notification to specified address

## Migration Notes (v1 → v2)

### What Was Preserved

- Dark glassmorphism aesthetic
- Core design philosophy ("easy, smooth, relaxed")
- Pure HTML/CSS/JS (no frameworks)
- Static site architecture
- Image assets
- GitHub Pages compatibility

### What Changed

- **CSS**: 3 files → 1 file
- **JS**: Minimal → Feature-rich (but still vanilla)
- **Pages**: Simplified structure
- **Features**: Added blog, contact, dynamic theming, orbit wheel

### Why Archive v1

v1 represents the "Claude Code Engineering cohort" focus, while v2 pivots to "Hadosh Academy + Skool Community." Both are valuable, so v1 is fully preserved in `/v1/` for historical reference and potential future use.

## File Organization

### Root Level (v2)

Clean, minimal:
```
/
├── *.html (7 pages)
├── css/ (1 file)
├── js/ (2 files)
├── assets/images/ (shared)
└── v1/ (archive)
```

### v1 Archive

Complete and functional:
```
/v1/
├── *.html (v1 pages)
├── agents/ (example agents)
└── assets/
    ├── css/ (v1 styles)
    └── js/ (v1 scripts)
```

v1 pages still work because their relative paths (`../assets/css/`) now correctly point to `/v1/assets/css/`.

## Performance Characteristics

### v1
- **CSS**: 13.9KB (3 files)
- **JS**: 1.8KB (1 file)
- **Total**: 15.7KB
- **HTTP Requests**: 4 (CSS + JS)

### v2
- **CSS**: 8.9KB (1 file)
- **JS**: 11.4KB (2 files)
- **Total**: 20.3KB
- **HTTP Requests**: 3 (CSS + JS)

**Analysis**:
- v2 is +4.6KB larger (+29%)
- But v2 has significantly more features (orbit wheel, themes, blog system)
- Still well within acceptable range (<25KB for critical path)
- Modern compression (gzip) would reduce actual size significantly

## Browser Compatibility

Both v1 and v2 target:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Modern features used**:
- CSS custom properties (vars)
- CSS `backdrop-filter` (glassmorphism)
- JavaScript ES6+ (arrow functions, template literals, `const`/`let`)
- CSS Grid and Flexbox

**Graceful degradation**:
- Site is readable without CSS
- Forms work without JavaScript
- Orbit wheel degrades to static content

## SEO Improvements (v2)

All v2 pages include:
- Semantic HTML5 (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`)
- Proper heading hierarchy (single `<h1>` per page)
- Meta descriptions
- Title tags with branding
- Alt text on images
- Structured content

## Deployment

### GitHub Pages Setup

**Repository**: `hadi-nayebi.github.io` (or similar)  
**Branch**: `main` (or `gh-pages`)  
**Directory**: Root `/` (not `/docs`)

**Custom Domain** (optional):
- Configure CNAME record
- Add `CNAME` file to repository root

### Local Development

```bash
cd /path/to/github-page-hadosh-academy
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Note**: v1 and v2 both work locally via this method.

## Future Considerations

### Potential Enhancements

1. **Blog Backend**: Replace inline JS with markdown files + build step
2. **Search**: Add client-side search for blog articles
3. **Analytics**: Add privacy-friendly analytics (Plausible, Fathom)
4. **RSS Feed**: Generate RSS for blog
5. **Dark Mode Toggle**: Allow manual theme selection
6. **Performance**: Add service worker for offline support

### Constraints to Maintain

- Keep total CSS+JS under 50KB
- No frameworks (React, Vue, etc.)
- No build step (unless absolutely necessary)
- Maintain GitHub Pages compatibility
- Preserve v1 archive

## Lessons Learned

### What Worked Well

1. **CSS Consolidation**: Simplified maintenance significantly
2. **Vanilla JS**: Kept site fast and maintainable
3. **FormSubmit**: Easy contact form without backend
4. **Inline Blog**: Surprisingly effective for small article count

### What Could Be Improved

1. **Blog Scalability**: Inline JS won't scale beyond ~10-15 articles
2. **Theme Persistence**: Random theme changes on each page load (consider localStorage)
3. **Animation Performance**: Orbit wheel could be optimized further
4. **Documentation Lag**: CLAUDE.md fell behind during rapid v2 development

### Key Takeaway

**Documentation must be updated synchronously with implementation**, not retroactively. The OPEV workflow principle of "retroactive documentation" was violated, leading to the v1/v2 disconnect discovered later.

**Solution**: During future development, update CLAUDE.md **as changes are made**, not after completion.
