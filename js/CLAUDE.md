# js/ — JavaScript Working Memory
**Version:** v0.2.0

## File Inventory

| File | Loaded by | Purpose |
|------|-----------|---------|
| `components.js` | every page | Shared nav/footer injection, active-page highlight, dynamic copyright year, mobile nav-toggle behavior |
| `theme-manager.js` | every page | Random theme rotation (5 color schemes per visit) + profile pic randomization |
| `wheel.js` | `index.html` | Orbit wheel animation with rotating phrases (hero) |
| `form-handler.js` | `contact.html` | EmailJS contact form submit — sends notification email always; sends welcome email when newcomer checkbox is ticked. Service ID: `service_chq4jnq`, public key embedded |
| `feedback.js` | (where included) | Feedback bubble system — captures user feedback, posts to backing store referenced via `feedback.json` |
| `start-here.js` | `start-here.html` | Profession lenses, syllabus-aware profession prompts, accessible role tabs, and copy controls |

## Subdirectory Detection Note

`components.js` detects subdirectories to adjust relative paths for nav/footer links.
Blog posts in `blog/` use `../css/styles.css` and `../js/*.js` paths.

## Rules

- Vanilla JS only — no frameworks, no libraries
- No build process — files served directly
- Each file is self-contained with clear responsibility





---Ob---






---Pl---






---Ex---






---Ve---
