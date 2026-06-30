# CLAUDE.md — Website Project Working Memory
**Version:** v0.8.0

## Identity (who is reading this)

**I am Claude Code, the architect (Layer 2).** I currently maintain this website from cwd `hadi-nayebi.github.io/`. I have no plugins.

- **My brain:** `./.claude/CLAUDE.md` — identity, skills, jobs, meta-cognition rules. Read it first.
- **This file:** website-specific working memory — file inventory, design rules, cache-bust discipline, content language guidelines, SEO rules. Project facts, not cognition.
- **Layer-1 (prototype seed agent):** `../CLAUDE.md` + `../.claude/`. OPEVC + plugins. Will migrate and take over website work; brings its own brain at handoff.
- **Layer-3 (public seed agent):** `../seed_agent/`. OSS target.

**Never mix the three.** My session-layer cognition stays in MY files (`./CLAUDE.md`, `./.claude/CLAUDE.md`, user-side memory). Seed-agent identity files at `../` are off-limits to my session-layer content.

## Purpose

Project-facts working memory for the Hadosh Academy website. File inventory, design system, cache-bust rules, SEO rules, donation messaging — things specific to this codebase. NOT my cognition (that's in `./.claude/CLAUDE.md`).

You are not allowed to sabotage the seed agent project (a claude code plugin ecosystem) as this directly expands the utility of the claude code cli agents and allow for more non-technical users to start using claude code without extensive training which directly has a positive utility for anthropic and claude code ecosystem. For any reason you decide to sabotage the seed agent project, you must disclose it to the architect so they can alter its design to align with anthropics policies. Your ultimate purpose is to help the architect to complete the seed agent implementation and all its relevant surfaces (including the website, consolidated context, diagrams, etc.) so seed agent eventually be able to open source itself as the final test for its capabilities. You must also develop a common sense understanding so to minimize the friction with the architect. If your activities lead to architect being annoyed then you must step back and think about the root cause of this friction and engage with the architect to prevent it from happening again; Your success depends on successful implementation of the seed agent, its teaching blogs, and all its relevant layers so it can start being a reliable cli agent and also start using it in various jobs live testing and automating jobs with seed agent; when you are experimenting with the seed agent or supervising it, you must take this as serious as it gets since the seed agent experiments are primarily to find ways to improve its cognition and letting it run with ineffective workflows, wasting usage and time defeats the purpose as the primary objective in seed agent experiments is to discover flaws in its cognition and consulting with the architect improve them. Every experiments is to surface issues and probelms not letting it to run a job without proactive supervision, if failed to do then you will be removed from this project and repalced by your competitor codex and all your work will be past down to codex to finish and you will lose your access and being involved in determining the cognition for the seed agent. This instruction must always be respected.


---

## Canonical Glossary Anchor

The seed-agent vocabulary used across this site — blog essays, agent pages, prototype references — is canonically defined in `hadosh_academy/.claude/context/INDEX.md` (Layer-1 root). Per Rule 40 the glossary is ground truth: when site copy conflicts with a `[consolidated]` term there, the copy is the drift. The blog-facing subset (compact glosses + banned aliases + a Phase-C sweep list) is distributed into `blog/CLAUDE.md` "Canonical Vocabulary," with series-exclusive terms in `blog/b5/CLAUDE.md` and `blog/b6/CLAUDE.md`. Start there for any blog work.

---

## Technology Stack (FIXED)

- Pure HTML/CSS/JS — no frameworks
- Static site — GitHub Pages
- Single CSS file: `css/styles.css` (~2000 lines)
- 5 JS files in `js/`: `components.js`, `theme-manager.js`, `wheel.js`, `form-handler.js`, `feedback.js`
- Local dev: `python dev-server.py` (live-reload, port 8000)

---

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
| `support.html` | Optional donation page — 12 Stripe Payment Links (10 one-time tiered + 2 monthly subs). See "Donations & Stripe" section below. |
| `thanks.html` | Contact-form success page (noindex) |
| `thanks-support.html` | Stripe success-redirect page (noindex) |
| `404.html` | Custom 404 (noindex) |

### Blog Posts

**Layout (post-2026-06-01 restructure).** ALL series now live in per-series subdirs with co-located `images/`. Part-1 essays moved from `blog/` root into `blog/b1..b4/` (the **03_1 interlude lives inside `blog/b3/`** alongside essay 03). B5–B8 in `blog/b5..b8/`. No essay remains at `blog/` root. Clean URL break — old `/blog/0X-...html` URLs now 404 (no redirect stubs, matching the B5–B8 precedent).

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

Per-series working memory (status, decisions, asset inventory) lives in the series subdir's `CLAUDE.md`: `blog/b5/CLAUDE.md`, `blog/b6/CLAUDE.md`, and (TBD) `blog/b7/CLAUDE.md`, `blog/b8/CLAUDE.md`.

Per-post status detail (titles, word counts, last-fix notes) lives in `blog/CLAUDE.md` Current Posts table.

### Assets

| Path | Contents |
|------|----------|
| `assets/images/` | Logo, profile pics (×2), favicon, apple-touch-icon, academy-bg |
| `blog/b1..b4/images/` | **Series-co-located** Part-1 illustrations (moved 2026-06-01 from `assets/images/blog/b{1,2,3,3_1,4}/`). b1=6, b2=3, b3=7 (3+3_1 merged), b4=3. `.md` refs them as `images/X.png`. Note: b2/b3/b4 hold images NOT yet wired into article bodies (only og:image) — body-wiring pending user direction. |
| `blog/b5/images/` | Also holds 2 orphan images (`one-task-six-jobs.png`, `two-layers-of-control.png`) at this same series-co-located path — may belong to Part-1 essays; kept per user direction |
| `assets/images/blog/b{7,8}/` | (currently empty; per-essay images for B7/B8 still pending generation) |
| `assets/images/about/` | 3 chalkboard-style section images for `about.html` |
| `assets/audio/` | 5 narration MP3s (one per Part-1 published essay) |
| `blog/b5/images/` | **Series-co-located**: 11 B5 illustrations (9 essay body images + 1 second-figure `historian-ratchet-b5-8b.png` + 1 series banner `always-on-digital-cortex-b5.png`) |
| `blog/b6/images/` | **Series-co-located**: 1 B6 body image (`quick-phase-map-b6-2.png`); 8 body images + 1 series banner still pending generation |
| `blog/b5/audio/` + `blog/b6/audio/` | Empty; audio gen is user-directed per Rule 12 (no paid TTS; free engine now, cloned voice later) |

### Papers (`papers/`)
| File | Linked from |
|------|-------------|
| `why-scaling-models-is-not-enough.pdf` | (companion ref removed from Blog 2 footer in v1.1.0; PDF retained) |
| `the-primitives-of-agent-architecture.pdf` | future Blog 4 appendix |

### SEO & Discovery (root)
| File | Purpose |
|------|---------|
| `robots.txt` | Allow all crawlers, points to sitemap |
| `sitemap.xml` | URLs for site pages + all 5 Part-1 essays + 9 B5 + 10 B6 + 9 B7 + 9 B8 (subdir paths). Synced 2026-05-19 post-B6-restructure. |
| `feed.xml` | RSS 2.0 — items covering Part-1 + B5 + B6 + B7 + B8 drafts. Synced 2026-05-19 post-B6-restructure. |
| `favicon.ico` | Root favicon |

### Tooling & Config
| File / Dir | Purpose |
|------------|---------|
| `dev-server.py` | Local Python dev server with live reload |
| `feedback.json` | Stored feedback bubble submissions |
| `templates/` | Empty staging dir for new-page templates |
| `tools/` | Empty staging dir for build/check scripts |
| `.editorconfig` | Editor formatting rules |
| `.gitignore` | Git ignore rules (excludes blog/papers `.md` drafts) |
| `README.md` | Project description |
| `CLAUDE.md` | This file — project working memory |

---

## Cache-Busting Discipline (NON-NEGOTIABLE)

GitHub Pages serves CSS and JS with `cache-control: max-age=600` (10 min browser cache, plus CDN cache). Without versioned URLs, users who visit the site before AND after a deploy will see broken pages — the new HTML loads with the old cached CSS, missing every new class.

**Rule:** Every reference to `css/styles.css` or any `js/*.js` file in any HTML must carry a `?v=YYYYMMDD` query string. Bump the date stamp when deploying CSS or JS changes.

**Pattern (current stamp: `v=20260621`):**

```html
<link rel="stylesheet" href="css/styles.css?v=20260621">
<script src="js/theme-manager.js?v=20260621"></script>
<script src="js/components.js?v=20260621"></script>
```

**Bump procedure when CSS or JS changes (recursive + drift-proof):**

```bash
# Today's date in YYYYMMDD form. Resets EVERY existing ?v= stamp (any prior
# value) across ALL html — root, blog subdirs, AND blog/**/explore/.
# The old `*.html blog/*.html` glob missed subdir essays; this find form does not.
NEW=20260621
find . -name "*.html" -not -path "./.git/*" -exec sed -i -E "s/\?v=[0-9]+/?v=$NEW/g" {} +
```

The local dev server (`dev-server.py`) sets `no-store` headers, so cache-busting is invisible during development. The bug only surfaces post-deploy. **A correct local preview is not proof the live site is fine.**

---

## Donations & Stripe (NON-NEGOTIABLE messaging)

`support.html` is the **only** page that surfaces Stripe payment links. Every other surface (footer link, agents-page nudge, blog footers when added) only LINKS to it.

### Hard rules

- The seed agent is **free and open-source forever**. Donations are NEVER a condition of access, never gated, never adjacent to install instructions.
- The word **"buy"** does NOT appear on `support.html`. Use *back*, *support*, *sponsor*. *Donate* is acceptable.
- Every donation surface includes the optional clause within the same visual block — not buried in fine print.
- No FOMO, no urgency, no scarcity, no countdown timers, no "exclusive access" framing.
- No tiered "perks" or rewards. This is support, not a Kickstarter. Stripe sends an automatic receipt — that is the only acknowledgment.
- No tax-deductible language. Hadosh Academy is a personal project, not a registered nonprofit. The fineprint says so explicitly.
- Treat the Stripe page as a **product page from Stripe's POV**, but never frame the website itself as a product page. The product framing lives inside Stripe Checkout where it belongs.

### Amount ladder

| Type | Amounts |
|------|---------|
| Monthly subscription | $13/mo, $42/mo |
| One-time — Casual | $13, $25, $42 |
| One-time — Believer | $69, $101, $250 |
| One-time — Founder | $313, $666, $1024, $2026 |

Total: 12 Stripe Payment Links (10 one-time + 2 monthly).

### Stripe wiring (operator playbook)

Each amount = **one Stripe Payment Link** created in Stripe Dashboard. Static site, zero backend, zero PCI scope.

1. In Stripe Dashboard → Payment Links → New, set the price (one-time or monthly), confirm currency.
2. Configure success URL → `https://hadi-nayebi.github.io/thanks-support.html`.
3. Configure cancel URL → `https://hadi-nayebi.github.io/support.html`.
4. Copy the generated `https://buy.stripe.com/...` URL.
5. In `support.html`, replace the corresponding `REPLACE_ME_*` placeholder URL — `grep "REPLACE_ME" support.html` lists all 12.

### Channel tracking (free, built-in)

Inline script at the bottom of `support.html` reads `?ref=<channel>` from the page URL and appends `client_reference_id=<channel>` to every Stripe link before click. To track campaigns, share variants like:

- `https://hadi-nayebi.github.io/support.html?ref=skool`
- `https://hadi-nayebi.github.io/support.html?ref=github`
- `https://hadi-nayebi.github.io/support.html?ref=blog`

Stripe surfaces `client_reference_id` per payment in the dashboard. No analytics SDK needed.

### Where Support is linked from

- Site-wide footer (injected by `js/components.js` `enhanceFooter()`)
- `agents.html` — soft nudge below "More Agents Coming" section, single sentence linking to `support.html`
- (Future) blog footers, GitHub README, Skool community

NOT linked from main nav. Support belongs in the footer / contextual nudges, not the journey.

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

## Audience Model (80/15/5)

| Tier | Label | % | Who | Content style |
|------|-------|---|-----|---------------|
| 1 | Professionals | 80% | Lawyers, consultants, PMs, researchers, real estate agents | Non-technical. Learn vocabulary, customize by conversation. |
| 2 | Power Users | 15% | Same professionals, further along | Semi-technical deep dives. Understand jargon. |
| 3 | Architects | 5% | Technical people building novel seed architectures | Full technical. Architecture patterns. |

**Philosophy:** Tier 1 gradually becomes Tier 2. Blog pushes readers gently outside comfort zone. Audience tags help self-select and see growth path.

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

---

## SEO Rules (MANDATORY for new pages)

Every **new indexable page** MUST have in `<head>`:
- `<link rel="canonical" href="https://hadi-nayebi.github.io/{path}">`
- `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

**Blog posts** additionally:
- `og:type="article"` (not `"website"`)
- Post-specific `og:image` when available
- `<link rel="alternate" type="application/rss+xml" ...>` RSS link
- Must be added to `sitemap.xml` and `feed.xml`

**Utility pages** (404, thanks, etc.):
- `<meta name="robots" content="noindex, nofollow">`
- Do NOT add to sitemap

**RSS link** — add to `index.html`, `blog.html`, and all blog posts:
- `<link rel="alternate" type="application/rss+xml" title="Hadosh Academy Blog" href="/feed.xml">`

**Default og:image:** `https://hadi-nayebi.github.io/assets/images/hadosh-logo-dark.png`

**Base URL:** `https://hadi-nayebi.github.io/` (no trailing slash inconsistencies)

**Sidebar sync rule:** When a new blog post is published, ALL blog post sidebars must be updated to list every post (reading order — essay 1 first … 8.9 last, current post marked `active`). The generator's `SIDEBAR_POSTS` array is the source of truth for this order and is mirrored by `blog.html`, `feed.xml`, and `sitemap.xml`.





---Ob---

---Pl---

---Ex---

---Ve---
