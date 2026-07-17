# CLAUDE.md — Hadosh Academy Website (Project Working Memory)
**Version:** v0.9.0

## What this project is

This is the **Hadosh Academy website** (`hadi-nayebi.github.io`) — the public face of the seed-agent
project: blog essays, agent pages, and community/support surfaces. It is a **static site served by
GitHub Pages directly from the tracked files at the repo root** — pure HTML/CSS/JS, no framework, no
build step. **The deployed site is whatever git tracks**, so a change to a tracked file is a change to
the live site.

This file is **project working memory** — file inventory, tech stack, and design/content/SEO/publishing
conventions. It is project facts, not any agent's private cognition. Whoever works here picks up this
context automatically, plus the project's own skills in `.claude/skills/` (which load on demand when
you work in this directory).

## How to use — and grow — this CLAUDE.md hierarchy (working memory)

The project's memory is spread across a **hierarchy of CLAUDE.md files**. Use it, and keep it healthy:

- **This root file** — project-wide facts every worker here needs.
- **`blog/CLAUDE.md`** — blog-wide authoring/build memory; **`blog/b5/CLAUDE.md`, `blog/b6/CLAUDE.md`, …** —
  per-series working memory (status, decisions, asset inventory). These load when you work in those dirs.

As you work, **record durable project learnings in the nearest CLAUDE.md's footer**, then **boil shared
insight UP the hierarchy**: something true across multiple sub-blogs is promoted into `blog/CLAUDE.md`;
something true project-wide is promoted into this root file. Keep each file lean — footer → boil-up →
condense under its cap. **Detail stays local; shared principles rise.** Skills carry procedures; this
hierarchy carries facts and standards.

## Canonical Glossary Anchor

The seed-agent vocabulary used across this site — blog essays, agent pages, prototype references — is
canonically defined in `hadosh_academy/.claude/context/INDEX.md` (Layer-1 root). The glossary is ground
truth: when site copy conflicts with a `[consolidated]` term there, the copy is the drift. The
blog-facing subset (compact glosses + banned aliases + a Phase-C sweep list) is distributed into
`blog/CLAUDE.md` "Canonical Vocabulary," with series-exclusive terms in `blog/b5/CLAUDE.md` and
`blog/b6/CLAUDE.md`. Start there for any blog work.

## Technology Stack (FIXED)

- Pure HTML/CSS/JS — no frameworks
- Static site — GitHub Pages
- Single CSS file: `css/styles.css` (~2000 lines)
- 5 JS files in `js/`: `components.js`, `theme-manager.js`, `wheel.js`, `form-handler.js`, `feedback.js`
- Local dev: `python dev-server.py` (live-reload, port 8000)

## Current File Inventory

### Pages (top-level)
| File | Purpose |
|------|---------|
| `index.html` | Landing — hero with orbit wheel + 3 cards (Blog / Agents / Community) |
| `blog.html` | Blog index — 7 essays, sidebar mirrors index |
| `agents.html` | Agent showcase — Seed Agent card (Coming Soon / Open Source / MIT / Free Forever) links to `seed-agent.html` + Skool CTA + soft support nudge |
| `seed-agent.html` | Seed Agent dedicated page — what it is, OPEVC cycle, Job Stages, plugin list, install preview, repo + community + support CTAs |
| `about.html` | Academy intro (3 pillars, visual sections) + founder bio |
| `contact.html` | EmailJS contact form (newcomer checkbox triggers welcome email) |
| `support.html` | Optional donation page — 12 Stripe Payment Links (10 one-time tiered + 2 monthly subs). See "Donations & Stripe" below. |
| `thanks.html` | Contact-form success page (noindex) |
| `thanks-support.html` | Stripe success-redirect page (noindex) |
| `404.html` | Custom 404 (noindex) |

### Blog Posts

**Layout (post-2026-06-01 restructure).** ALL series live in per-series subdirs with co-located
`images/`. Part-1 essays are in `blog/b1..b4/` (the **03_1 interlude lives inside `blog/b3/`** alongside
essay 03). B5–B8 in `blog/b5..b8/`. No essay remains at `blog/` root. Old `/blog/0X-...html` URLs now
404 (no redirect stubs, matching the B5–B8 precedent).

**Part 1 — Published in `blog/b1..b4/` subdirs (5 essays):**

| File | Title | Status |
|------|-------|--------|
| `b1/01-llms-are-not-the-agents.html` | LLMs Are Not the Agents | published |
| `b2/02-we-could-have-had-agi.html` | We Could Have Had AGI By Now | published |
| `b3/03-your-brain-was-never-built-for-this.html` | Your Brain Was Never Built for This | published |
| `b3/03_1-the-folder-is-alive.html` | The Folder Is Alive (interlude, in b3/) | published |
| `b4/04-the-language-of-agents.html` | The Language of Agents | published |

**Part 2 — Draft mini-series (37 sub-essays across 4 series — ALL GOAL'd through 3-CLEAN audit gate as of 2026-05-19):**

| Series | Location | Count | State |
|--------|----------|------:|-------|
| **B5** — The Always-On Digital Cortex | `blog/b5/05_1..05_9` | 9 | 9/9 GOAL ACHIEVED |
| **B6** — The Markov Phasic Brain | `blog/b6/06_1..06_10` | 10 | 10/10 GOAL ACHIEVED |
| **B7** — The Plugin Kit | `blog/b7/07_1..07_9` | 9 | 9/9 GOAL ACHIEVED |
| **B8** — From Apprentice to Architect | `blog/b8/08_1..08_9` | 9 | 9/9 GOAL ACHIEVED |

Per-series working memory (status, decisions, asset inventory) lives in the series subdir's `CLAUDE.md`:
`blog/b5/CLAUDE.md`, `blog/b6/CLAUDE.md`, and (TBD) `blog/b7/CLAUDE.md`, `blog/b8/CLAUDE.md`.
Per-post status detail (titles, word counts, last-fix notes) lives in `blog/CLAUDE.md` Current Posts table.

### Assets
| Path | Contents |
|------|----------|
| `assets/images/` | Logo, profile pics (×2), favicon, apple-touch-icon, academy-bg |
| `blog/b1..b4/images/` | **Series-co-located** Part-1 illustrations. b1=6, b2=3, b3=7 (3+3_1 merged), b4=3. `.md` refs them as `images/X.png`. b2/b3/b4 hold images NOT yet wired into article bodies (only og:image) — body-wiring pending user direction. |
| `blog/b5/images/` | **Series-co-located**: 11 B5 illustrations (9 essay body + `historian-ratchet-b5-8b.png` + series banner `always-on-digital-cortex-b5.png`); also 2 orphan images (`one-task-six-jobs.png`, `two-layers-of-control.png`) kept per user direction |
| `blog/b6/images/` | **Series-co-located**: 1 B6 body image (`quick-phase-map-b6-2.png`); 8 body + 1 series banner still pending generation |
| `assets/images/blog/b{7,8}/` | (currently empty; per-essay images for B7/B8 still pending generation) |
| `assets/images/about/` | 3 chalkboard-style section images for `about.html` |
| `assets/audio/` | 5 narration MP3s (one per Part-1 published essay) |
| `blog/b5/audio/` + `blog/b6/audio/` | Empty; audio gen is user-directed (no paid TTS; free engine now, cloned voice later) |

### Papers (`papers/`)
| File | Linked from |
|------|-------------|
| `why-scaling-models-is-not-enough.pdf` | (companion ref removed from Blog 2 footer in v1.1.0; PDF retained) |
| `the-primitives-of-agent-architecture.pdf` | future Blog 4 appendix |

### SEO & Discovery (root)
| File | Purpose |
|------|---------|
| `robots.txt` | Allow all crawlers, points to sitemap |
| `sitemap.xml` | URLs for site pages + all 5 Part-1 essays + 9 B5 + 10 B6 + 9 B7 + 9 B8 (subdir paths). |
| `feed.xml` | RSS 2.0 — items covering Part-1 + B5 + B6 + B7 + B8 drafts. |
| `favicon.ico` | Root favicon |

### Tooling & Config
| File / Dir | Purpose |
|------------|---------|
| `dev-server.py` | Local Python dev server with live reload |
| `feedback.json` | Stored feedback bubble submissions |
| `.claude/tools/` | Blog build pipeline (HTML/transcript/audio generators, audio-player wiring) — used by the `blog-update` skill |
| `.claude/skills/` | Project skills (load on demand when working here): `blog-update`, `video-create`, `cache-bust-deploy`, `stripe-payment-link-setup` |
| `README.md` | Project description |
| `CLAUDE.md` | This file — project working memory |

## Cache-Busting (invariant)

GitHub Pages caches CSS/JS ~10 min. **Every reference to `css/styles.css` or any `js/*.js` in HTML MUST
carry a `?v=YYYYMMDD` stamp**, bumped on every CSS/JS deploy — otherwise post-deploy visitors get new
HTML with stale CSS and broken pages. **A correct local preview is NOT proof the live site is fine**
(`dev-server.py` sends `no-store`, hiding the bug). The recursive, drift-proof bump procedure is the
**`cache-bust-deploy` skill**.

## Donations & Stripe (messaging — NON-NEGOTIABLE)

`support.html` is the **only** page that surfaces Stripe payment links. Every other surface (footer
link, agents-page nudge, blog footers when added) only LINKS to it.

### Hard rules
- The seed agent is **free and open-source forever**. Donations are NEVER a condition of access, never gated, never adjacent to install instructions.
- The word **"buy"** does NOT appear on `support.html`. Use *back*, *support*, *sponsor*. *Donate* is acceptable.
- Every donation surface includes the optional clause within the same visual block — not buried in fine print.
- No FOMO, no urgency, no scarcity, no countdown timers, no "exclusive access" framing.
- No tiered "perks" or rewards. This is support, not a Kickstarter. Stripe's automatic receipt is the only acknowledgment.
- No tax-deductible language. Hadosh Academy is a personal project, not a registered nonprofit. The fineprint says so explicitly.
- Treat the Stripe page as a **product page from Stripe's POV**, but never frame the website itself as a product page.

### Amount ladder
| Type | Amounts |
|------|---------|
| Monthly subscription | $13/mo, $42/mo |
| One-time — Casual | $13, $25, $42 |
| One-time — Believer | $69, $101, $250 |
| One-time — Founder | $313, $666, $1024, $2026 |

Total: 12 Stripe Payment Links (10 one-time + 2 monthly).

### Where Support is linked from
- Site-wide footer (injected by `js/components.js` `enhanceFooter()`)
- `agents.html` — soft nudge below "More Agents Coming", single sentence linking to `support.html`
- (Future) blog footers, GitHub README, Skool community
- NOT linked from main nav. Support belongs in the footer / contextual nudges, not the journey.

The operator playbook for creating the Payment Links and the `?ref=` channel tracking is the
**`stripe-payment-link-setup` skill**.

## Design System Summary
- Dark background: `#050507`
- Primary: `#6366f1` (indigo)
- Accent: `#8b5cf6` (violet)
- Font: Inter (Google Fonts)
- Glassmorphism: `backdrop-filter: blur()`
- Random theme rotation: 5 color schemes per visit
- All styles in `css/styles.css` — zero inline, zero `<style>` blocks

## Audience Model (80/15/5)
| Tier | Label | % | Who | Content style |
|------|-------|---|-----|---------------|
| 1 | Professionals | 80% | Lawyers, consultants, PMs, researchers, real estate agents | Non-technical. Learn vocabulary, customize by conversation. |
| 2 | Power Users | 15% | Same professionals, further along | Semi-technical deep dives. Understand jargon. |
| 3 | Architects | 5% | Technical people building novel seed architectures | Full technical. Architecture patterns. |

**Philosophy:** Tier 1 gradually becomes Tier 2. Blog pushes readers gently outside comfort zone.

## Content Language Guidelines (NON-NEGOTIABLE)

**Tone ladder** — adjust language by content depth:
- **Front-facing** (landing, agents, about): plain language, non-technical professionals
- **Blog articles**: moderate technical, explain jargon or link to explanations
- **Deep content** (architecture docs): full technical vocabulary OK

**Positive framing** — lead with what we offer; pair every negative ("not a chatbot") with a positive concept.

**Key messaging pillars:** Reliable & consistent agents (not flaky AI) · Customization through conversation (no coding, just talk) · Scaling professional skills.

**Agent descriptions** — frame as philosophy, not features: "Job-based architecture" not "job scheduler agent"; describe behaviors users see, not internal mechanisms ("Prevents the agent from stopping until all work is done" not "blocking stop hook").

**Cross-referencing** — technical terms on front pages must link to blog/docs explanations.

## SEO Rules (MANDATORY for new pages)

Every **new indexable page** MUST have in `<head>`:
- `<link rel="canonical" href="https://hadi-nayebi.github.io/{path}">`
- `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**Blog posts** additionally: `og:type="article"`; post-specific `og:image` when available;
`<link rel="alternate" type="application/rss+xml" ...>`; must be added to `sitemap.xml` and `feed.xml`.

**Utility pages** (404, thanks, etc.): `<meta name="robots" content="noindex, nofollow">`; do NOT add to sitemap.

**RSS link** — add to `index.html`, `blog.html`, and all blog posts:
`<link rel="alternate" type="application/rss+xml" title="Hadosh Academy Blog" href="/feed.xml">`

**Default og:image:** `https://hadi-nayebi.github.io/assets/images/hadosh-logo-dark.png`
**Base URL:** `https://hadi-nayebi.github.io/` (no trailing-slash inconsistencies)

**Sidebar sync rule:** When a new blog post is published, ALL blog post sidebars must list every post
(reading order — essay 1 first … 8.9 last, current post marked `active`). The generator's
`SIDEBAR_POSTS` array is the source of truth for this order and is mirrored by `blog.html`, `feed.xml`,
and `sitemap.xml`.
---Ob---
---Pl---
---Ex---
---Ve---
