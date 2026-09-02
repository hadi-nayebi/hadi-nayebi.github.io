# css/ — Styles Working Memory
**Version:** v0.2.0

## Single-File Rule

**All styles live in `styles.css`.** No other CSS files. No inline styles. No `<style>` blocks. Currently ~2000 lines.

## Finding Classes

**Do NOT pin line numbers in this file** — they drift every edit. Use `grep -n "^\.classname" css/styles.css` when you need a location. The catalog below groups classes by area; trust the names, look up the lines on demand.

## Class Catalog (by area)

### Layout primitives
`.container`, `.grid`, `.card`, `.glass-card`, `.page-content`, `.text-gradient`, `.badge`, `.badge-coming-soon`

### Hero / nav / footer
`.hero`, `.hero-overflow`, `.hero-compact`, `.hero-description`, `.hero-actions`, `.logo`, `.nav-links`, `.nav-toggle`, `.nav-toggle-bar` (animated burger states under `.nav-toggle.is-active`), `#site-header`, `#site-footer`

### Buttons
`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-submit`, `.card-link`, `.card-link-disabled`

### Index page (orbit wheel)
`.orbit-container`, `.central-circle`, `.central-circle-content`, `.orbit-ring`, `.orbit-item`, `.orbit-text`, `.orbit-item.focused`

### Blog index page
`.blog-index-cards`, `.blog-index-header`, `.blog-index-card` (+ `:hover`, `.filter-hidden`), `.blog-card-tags`, `.blog-card-meta`, `.blog-card-excerpt`, `.blog-card-read-more`, `.blog-filter-bar`, `.blog-filter-divider`

### Blog post layout
`.blog-layout` (two-column grid), `.article-content`, `.article-body` (prose), `.article-meta`, `.article-meta-tags`, `.article-authors`, `.article-comments`, `.blog-back-link`, `.sidebar`, `.sidebar-title`, `.article-card` (+ `.active`), `.article-card-tags`, `.article-card-link`

### Blog audio narration
`.article-audio`, `.audio-controls`, `.audio-btn`, `.audio-speed-group`, `.audio-speed.active`

### Blog images / lightbox
`.blog-image` (`figure` + `img` + `figcaption`), `.blog-image-placeholder`, `.placeholder-box`, `.placeholder-prompt`, `.lightbox-overlay` (+ `.active`), `.lightbox-caption`, `.lightbox-close`

### Tags
`.tag`, `.tag-sm`, `.tag-audience`

### About / academy page
`.academy-hero`, `.academy-subtitle`, `.academy-section`, `.academy-pillars`, `.academy-pillar`, `.academy-vision`, `.lead-text`, `.about-visual-section` (+ `.reversed`), `.about-visual-image`, `.about-visual-content`, `.about-section-img`, `.about-essays-grid`, `.about-essay-card`, `.about-essay-number`, `.about-essay-title`, `.about-essay-desc`, `.about-grid`, `.about-image`, `.about-content`, `.about-cta`, `.profile-img`, `.founder-section`, `.bio-grid`, `.bio-heading`, `.bio-text`, `.profession-tags`, `.social-links`, `.social-link`

### About — identity bars
`.identity-section`, `.identity-item`, `.identity-header`, `.progress-track`, `.progress-fill` (with utility variants `.progress-fill-4` / `-13` / `-42` etc. — one per percentage value used)

### Agents page
`.agents-more-section`

### Forms (contact)
`.form-wrapper`, `.contact-card`, `.form-group`, `.form-control` (`:focus`), `.form-check`, `.form-check-input`, `.form-check-label`

### Start Here page (start-here.html)
`.audience-ladder`, `.audience-layer` (`<details>`; `[open]` state), `.audience-layer-summary` (clickable `<summary>` with `::after` chevron that rotates on open), `.audience-layer-name`, `.audience-layer-tagline`, `.audience-layer-content`, `.expectations-grid`, `.expectations-card`, `.expectations-not` (red ✕ bullets), `.expectations-are` (green ✓ bullets), `.vocab-grid` (4-col responsive), `.vocab-card`, `.vocab-def`, `.vocab-example`, `.academy-pillars.two-col` (variant of academy-pillars), `body.page-start-here .academy-section` (page-scoped: lifts max-width 900→1200px across every section on start-here.html so grids/cards/figures all align at one width — no jagged section alternation), `.system-overview-figure` (`<figure>` wrapping the canonical 8-node ontology map at `assets/images/system-overview.png`; image stays centred at its own 900px cap inside the wider section)

The current Start Here experience uses `.start-human-*` and `.start-library-*` cards for the human path, `.start-choice-*` for the ownership argument, `.start-phase-*` for the nine-phase syllabus, and distributed `.start-agent-instruction` `<details>` blocks. Agent instructions stay visible in the HTML DOM while collapsed for human readers. `start-here-agent.md` is the canonical text-only agent syllabus linked from page metadata.

## Breakpoints

| Width | Target |
|-------|--------|
| 768px | Tablet — sidebar stacks below article |
| 480px | Mobile — reduced padding / font sizes |





---Ob---






---Pl---






---Ex---






---Ve---
