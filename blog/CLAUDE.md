# blog/ — Blog Posts Working Memory
**Version:** v0.3.0

## Content Workflow

- **Source of truth:** `.html` files (committed to git)
- **Editing files:** `.md` files (gitignored, local-only)
- **Flow:** `.md` ↔ `.html` — changes sync both directions

### Frontmatter Format (.md files)
```yaml
---
title: "Post Title"
date: "Month Year"
slug: "url-slug"
read_time: "X min"
tags: [Tag1, Tag2]
og_image: "path/to/image.png"
---
```

### {Comment} Convention
- Hadi adds `{comments}` in `.md` files
- Agent scans for `{...}` patterns via OBSERVE.comments
- Comments are instructions: `{shorten this}`, `{add example}`, `{move to section X}`
- Remove comments after processing

## Voice & Style (NON-NEGOTIABLE)

Blog 1 ("LLMs Are Not the Agents") is the **reference voice**. All posts must match it.

### The Pattern
- **Open with a concrete metaphor**, not a disclaimer or meta-statement
- **Commit to claims** — no hedging ("not obviously wrong"), no double negatives
- **Jazz rhythm** — alternate short punches (5-7 words) with longer sentences (20-25)
- **Single-line paragraphs** as structural weapons (7-8 per post minimum)
- **Kitchen-concrete language** — toaster, car, blood, not "frameworks" or "ratios"
- **Recurring callback** — pick one metaphor and return to it 4-5 times throughout
- **Snark and edge** — "expensive autocomplete", "prompt soup" energy
- **Direct address** — "Look at", "Watch what happens", "Here is" (8+ per post)
- **Crescendo ending** — finish on a peak, not a plateau
- **No "X, but Y" hedging template** — pick a side, stay on it

### Anti-Patterns (AI-Written Indicators)
- Excessive hedging and qualifiers
- "X, but Y" balanced sentence template repeated
- Diplomatic neutrality — softening every strong claim
- List dumps (9 items in one paragraph)
- Template paragraphs: claim → elaboration → implication
- Absent personal voice / frustration / humor
- Meta-openings ("This is not another post about...")
- Flat energy curve — same volume throughout

### Experimental Mindset
- Lean toward experimental, provocative claims — back them up
- Better to be bold and specific than safe and generic
- The reader should feel the author has done the work and is impatient with those who haven't

## HTML Template Pattern

Every blog post follows the same structure:
1. Full SEO `<head>` (canonical, og:*, twitter:*, RSS link, favicon)
2. `<header id="site-header"></header>` (injected by components.js)
3. `.blog-layout` → `.article-content` + `.sidebar`
4. `.article-authors` byline below article-meta
5. `.article-body` contains all prose
6. `<footer id="site-footer"></footer>`
7. Scripts: theme-manager.js + components.js

## New Post Checklist

1. Create `blog/<slug>.md` with frontmatter
2. Create `blog/<slug>.html` from template
3. Add to `blog.html` index (newest first)
4. Update ALL blog post sidebars (sidebar sync rule)
5. Add to `sitemap.xml`
6. Add to `feed.xml` (newest first)
7. Update `.claude/scripts/check-seo.sh` counts + arrays
8. Add Giscus comment script (EXECUTE.setup-giscus)
9. Generate audio narration (EXECUTE.generate-audio)
10. Generate images for key sections (EXECUTE.generate-image)
11. Run content audit (VERIFY.content-audit) — read times, audio labels, meta sync, sidebars

## Content Metadata Rules

- **Read time = audio time** — use actual ffprobe duration, rounded to nearest minute
- **Audio label** and **read time** must show the same number
- **All instances must match:** article meta, sidebar cards (in ALL posts), blog.html index cards, .md frontmatter

## Biological Terminology Convention

When borrowing biological terms, **always prefix with "cognitive" or "digital"**:
- Agent components → **cognitive organs** (not just "organs")
- Files/instructions → **cognitive tissue** (not just "tissue")
- Memory files → **cognitive memory tissue**
- Hooks/events → **reflexes and sensory systems**
- `.claude/` directory → **digital cortex**
- Evolution frame: brainstem → cortex → **digital cortex**

This framing helps readers see agents as **extensions of their brain**, not separate tools.

## Glossary Linking (every post)

- **Link technical terms** at their first body-text occurrence in each post
- **Format (HTML):** `<a href="URL" title="brief plain-language tooltip" target="_blank" rel="noopener">term</a>`
- **Format (MD):** `[term](URL "brief plain-language tooltip")`
- **Only first occurrence** per post — do not repeat-link the same term
- **Tooltips:** one sentence, plain language, aimed at non-technical professionals
- **Sources:** Wikipedia or official docs (prefer Wikipedia for general terms)
- **Volume:** ~5-10 terms per post — enough to help, not so many it clutters
- **Skip terms already explained** in surrounding text (e.g., if the post defines "agent" in context, no need to link it)

## Current Posts

| Slug | Title | Version |
|------|-------|---------|
| llms-are-not-the-agents | LLMs Are Not the Agents | v0.3.1 |
| we-could-have-had-agi | We Could Have Had AGI By Now | v0.2.0 |
