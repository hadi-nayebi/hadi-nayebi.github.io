# blog/ — Blog Posts Working Memory
**Version:** v0.4.1

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

### Stylistic Lessons (from editorial review)
- **Don't present novel concepts as established** — "most common architectural mistake" implies known patterns; we're introducing these ideas for the first time
- **Modulate the punchy tone** — staccato is a tool, not the default; overuse becomes annoying. Mix short punches with flowing prose.
- **Truthful essay references** — "introduced" not "built"; be accurate about what previous essays accomplished
- **Positive framing over negative lists** — avoid "Not X. Not Y. Not Z." — sounds sensational. Lead with what it IS.
- **Two tones OK** — non-technical friendly description as glue + light technical specifics (file names, concepts). Not monotonically smooth.
- **Educational asides pattern** — follow Blog 5's JSON model: soft intro → definition + link → concrete example → "why this matters" → "get comfortable with this term"
- **Self-appreciation ceiling** — avoid "most important idea in agent design"; present concepts, let readers draw conclusions
- **Don't teach as if correcting** — share our approach, don't fix an industry. "Here is what we found" not "here is the most common mistake"
- **No word salads** — dense comma-separated lists of abstract concepts are hard to parse. Break into separate sentences: "What does X buy you? Benefit one. Benefit two. Benefit three." Each benefit gets its own subject-verb.
- **Forward/backward references** — every blog should hint at future essays ("we will take this apart in a later essay") and callback to past ones ("in the previous essay, we identified X"). One sentence each, not paragraphs.
- **Ref-arc gap analysis** — not every gap in a blog needs to be filled in that blog. Some gaps are intentionally filled by a future blog in a reference arc (e.g., Blog 1 plants "free to build" → Blog 2 adds "$100/month" → Blog 3 completes with "utility bill"). When reviewing a blog, check whether an apparent gap is already addressed by a later blog in the series before adding content.

## Blog Footer Format (MANDATORY)

Every blog must end with this consistent footer after the closing line:

```markdown
---

*Essay N of 8 in the Hadosh Academy series on agent architecture.*

*Previous: ["Title"](link) — one-sentence hook.*
*Next: ["Title"](link) — one-sentence hook.*

*Companion: ["Title"](link) (type)* ← only if applicable
```

- **Series position** always first
- **Previous/Next** on separate lines with em dash + one-sentence description
- **Blog 1:** no Previous line. **Blog 8:** no Next line.
- **Companion resources** (white papers, etc.) only when they exist
- **Blog 2 companion PDF removed** (v1.1.0) — `papers/why-scaling-models-is-not-enough.pdf` still in repo, reference removed from footer. Recoverable from git history if needed.
- **Audio footer excluded** — narration stops at the closing line ("Build the toaster", "Build the organism", etc.)

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

## Blog Series Map (8 Essays)

### Series Arc
**Part 1 (1-4): Why + What** — conceptual pull, emotional urgency, vocabulary
**Part 2 (5-8): How** — seed agent architecture, increasingly mechanical

Part 1 is smooth, non-technical, lures audience in. Part 2 gradually introduces technical specifics — each blog adds one new technical concept (JSON → git → OPEVC → validation scripts).

### Hadi's Intent Per Blog

**Blog 1:** LLM ≠ agent, filesystem = agent. Making agents **accessible** — you don't need billions, just use existing LLMs as engines. Any LLM exposed to your unique filesystem becomes YOUR agent. Electricity → toaster.

**Blog 2:** Toaster = engineered, but AGI = **complex system**. Filesystem must be understood as a complex system. Shift focus from token generation to the rest. Novel token generators (jLLMs, dLLMs) will arrive — the agent metabolizes tokens regardless of source.

**Blog 3:** CLI agents = file manipulators = **the form factor** for building filesystem agents. CLI agent builds the filesystem and is influenced by it. Extends brain as a digital cortex. Personal urgency: your brain needs this.

**Blog 4:** Consolidate terminology. Bridge from conceptual (1-3) to architectural (5-8). Shift to describing the seed agent.

**Blog 5:** The skeleton — job system as structural framework. JSON aside. Job objects, protection tiers, stop-blocking.

**Blog 6:** Background jobs ONLY. Episodic memory + neighborhood awareness. Git aside. DC.md (XML). What they DO — no OPEVC internals, no CLAUDE.md layer details.

**Blog 7:** OPEVC workflow + CLAUDE.md as working memory. How background enforces focused work. The bridge that connects Blog 6 mechanisms to Blog 8 focused work.

**Blog 8:** Focused jobs. Collaboration spectrum. Four jobs. Why 6 patterns cover everything. Seed ships mechanisms, not categories.

### Reader's Cumulative Knowledge

| After | Knows | New Technical |
|-------|-------|---------------|
| 1 | Agent = filesystem. Any LLM works. OPEVC + CLAUDE.md planted. | — (conceptual) |
| 2 | AGI = complex system. Scale architecture. Seed agent planted. | — (conceptual) |
| 3 | Brain needs help. CLI agents = form factor. Digital cortex. | CLI agent concept |
| 4 | Full vocabulary: hooks, skills, plugins, sub-agents, MCP, seed. | Vocabulary |
| 5 | Skeleton: job system, job objects, protection, stop-blocking. | JSON |
| 6 | Background jobs: episodic memory (commits), neighborhood (DC.md). | Git/commits, DC.md (XML) |
| 7 | OPEVC workflow. CLAUDE.md working memory. Background enforces focused. | OPEVC mechanical |
| 8 | 4 focused jobs, spectrum, why 6 patterns cover everything. | Validation scripts, chaining |

### Concept Flow (planted → defined → deepened)

| Concept | Planted | Defined | Deepened |
|---------|---------|---------|----------|
| Agent = filesystem | 1 | — | 5-8 (specific files) |
| Complex system | 2 | — | 6 (autonomic vs directed) |
| OPEVC | 1 (light) | 7 (full mechanical) | 8 (in focused jobs) |
| CLAUDE.md | 1 (light) | 7 (working memory role) | 8 (in OPEVC cycle) |
| Hooks | 1 (conceptual) | 4 (vocabulary) | 5-6 (applied) |
| JSON | — | 5 (aside) | 5+ (job objects) |
| Git / commits | — | 6 (aside) | 7 (phase labels) |
| DC.md | — | 6 (introduced) | 7 (in OPEVC context) |
| Job system | 2 (heartbeat) | 5 (full) | 6-8 (populated) |
| Seed agent | 2 (concept) | 4 (vocabulary) | 5-8 (built piece by piece) |

### Inter-Blog Callbacks (each blog must reference)

| Blog | Callbacks to |
|------|-------------|
| 5 | 1 (filesystem = agent → now see what files), 2 (seed agent), 4 (vocabulary) |
| 6 | 1 (OPEVC: "remember the five phases?"), 2 (complex system → autonomic), 3 (cognitive organs), 5 (skeleton) |
| 7 | 1 (OPEVC + CLAUDE.md: "we planted these in Essay 1, now we see them work"), 5 (job phases), 6 (episodic memory) |
| 8 | 2 (seed = mechanisms not categories), 5 (activation patterns), 6 (background serving focused), 7 (OPEVC) |

**Rule:** When referencing a concept from an earlier blog, include a brief hint + link. Never assume the reader remembers — remind them in one sentence.

### Blogs 1-4: Improvement Notes (80% retain / 20% improve)

**Blog 1:**
- Strengthen: "any LLM can power your agent" — building agents is accessible, not expensive
- Add: Forward-refs where OPEVC and CLAUDE.md appear ("we'll return to these as we build the seed agent")
- Keep: Toaster metaphor, diagrams, "Build the toaster" ending

**Blog 2:**
- Add: Brief mention of novel token generators (jLLMs, dLLMs) — agent metabolizes tokens regardless of source
- Strengthen: Shift-focus message — now that we have engines, think about the rest of the system
- Add: Better forward-ref to upcoming seed agent essays
- Keep: Biology metaphor, "Build the organism" ending

**Blog 3:**
- Strengthen: CLI agent = file manipulator = form factor for filesystem agents. Make this explicit.
- Add: CLI agents read files, write files, execute commands — they build and maintain the filesystem brain
- Keep: Snake metaphor, digital cortex, emotional urgency

**Blog 4:**
- Strengthen: Closing transition to architecture essays
- Add: Primitives section — files, directories, CLAUDE.md (auto-append on read), hooks, Ralph Loop as novel primitive. Either in-blog or as appendix PDF.
- Verify: All Blog 5-8 terms either defined here or flagged as new when introduced
- Keep: Vocabulary scaffolding, tone, structure

### Blogs 5-8: Structure Notes

**Blog 5:** Adjust closing teaser to match Blog 6 scope (background jobs only, not all 6 jobs).

**Blog 6:** Background jobs ONLY.
- Git aside (educational, following Blog 5's JSON pattern)
- Episodic memory: what it does (remembers via commits), not internal mechanics (no phase labels, no OPEVC)
- Neighborhood awareness: DC.md in XML format, what it contains, distributed memory
- No CLAUDE.md details, no OPEVC — save for Blog 7
- Describe what the two job types SHARE (objectives, deliverables, hooks) and how they DIFFER
- Don't imply the design is fragile — it's designed to not break

**Blog 7:** OPEVC + CLAUDE.md deep dive.
- Formally define all 5 phases (observe, plan, execute, verify, **condense** — not consolidate)
- CLAUDE.md as working memory: inflation during work, deflation during condense
- Reveal: episodic memory commit labels ARE phase labels — this is how background enforces focused
- Bridge: background jobs serving focused work (Hadi's insight)

**Blog 8:** Focused jobs + why 6 is enough.
- Collaboration spectrum (you-driven ↔ agent-driven)
- 4 jobs: Design, Brainstorm, Build, Self-Improvement
- Validation scripts as completion gates
- Chained activation, recurring activation
- Why 6 is enough: seed ships mechanisms, not categories
- Growth loop: custom jobs → experience → self-improvement

## Current Posts

| # | Slug | Title | Version | Status |
|---|------|-------|---------|--------|
| 1 | llms-are-not-the-agents | LLMs Are Not the Agents | v1.2.0 | published |
| 2 | we-could-have-had-agi | We Could Have Had AGI By Now | v1.1.0 | published |
| 3 | your-brain-was-never-built-for-this | Your Brain Was Never Built for This | v0.1.1 | published |
| 4 | the-language-of-agents | The Language of Agents | v0.1.1 | published |
| 5 | every-agent-needs-a-skeleton | Every Agent Needs a Skeleton | v0.4.0 | published |
| 6 | 06-your-agents-first-organs | TBD (background jobs) | v0.2.0 | draft |





---Ob---






---Pl---






---Ex---






---Ve---

