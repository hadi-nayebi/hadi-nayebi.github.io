# blog/ — Blog Posts Working Memory
**Version:** v0.6.0

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
- **Interlude posts** (e.g., 3.1) use `*Series interlude — sits between Essay N and Essay N+1 of the Hadosh Academy series on agent architecture.*` instead of `*Essay N of 8 ...*`

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
7. Update SEO audit counts + arrays (no automated script in this repo — verify manually)
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

**Blog 3.1 (interlude):** Cognitive metabolism — `.claude/` in any folder turns that folder into an agent; brain in `.claude/`, work in siblings. Vision interlude bridging Part 1 → Part 2.

**Blog 4:** Consolidate terminology. Bridge from conceptual (1-3) to architectural (5-8). Vocabulary scaffold for the rest of the series.

**Blog 5 — The Single-Concern Digital Cortex:** The seed agent doesn't have memory; it has a **bus**. Five always-on plugins each own one concern. State lives in a layered CLAUDE.md hierarchy — not the chat. **Tier-3 close:** the historian ratchet (must re-read your own work before editing).

**Blog 6 — The Markov Phasic Brain:** Phases are cognitive isolation chambers. **Forbidding tools is the pedagogy.** The CONDENSE 7-step waterfall is the brain's growth mechanism. **Tier-3 close:** the multiplier is backward (3× = surgical, 0.5× = deep) — honest forecasting at phase entry.

**Blog 7 — The Plugin Kit:** A plugin is a cell with internal organs. The standard kit (hooks, scripts, hidden state, dual voices, tests, evolution.md, agents/) is what lets the brain grow new organs **safely**. **Tier-3 close:** walkthrough of building a new phase plugin.

**Blog 8 — From Apprentice to Architect:** Maturation through job formats. Patterns travel from voice → hook → plugin. **The brain stops growing in size but never stops learning.** **Tier-3 close:** bridge to the public seed agent (open-source, MIT, hand-off).

### Part 2 Architecture-Accuracy Rules (NON-NEGOTIABLE)

These rules emerged from cycle-1 review of the Blog 5 draft. Apply to ALL Part-2 drafts (5/6/7/8). Grep for violations before submitting any draft.

**Rule 1 — Categorical names, never count-based pointers.**
- WRONG: "the five always-on plugins", "the five things that always run", "this essay is about the five"
- RIGHT: "the always-on plugins (currently five in the prototype)", "this essay is about the always-on layer"
- Why: the seed agent is extensible. Users customizing their seed can add new always-on plugins, new phasic plugin flavors (additional observe phases, custom condense variants, etc.). Rigid counts age badly and hide the framework's extensibility. Categories are stable; numbers drift.
- Mention counts only as parentheticals or footnotes; never as the noun.

**Rule 2 — "You" pronoun discipline.**
- The reader IS the user. "You" in body text MUST refer to the reader/user.
- When describing seed-agent behavior, name it: "the seed agent", "the agent", or passive voice.
- WRONG: "every question you ask the user must start with a prefix" (where the asker is the agent)
- RIGHT: "every question the seed agent asks the user must start with a prefix"
- WRONG: "regardless of what you're doing" (where the doer is the agent)
- RIGHT: "regardless of what the agent is currently doing for the user"
- Exception: in B7's tier-3 close (building a new plugin) and B8 (user-journey arc), "you" addresses the reader-as-architect or reader-as-seed-cultivator. That's correct usage.

**Rule 3 — plugin_integrity dual-role discipline.**
- plugin_integrity has TWO concerns: (a) always-on edit monitoring + auto-revert on test fail, (b) the lock-and-historian ceremony for safe plugin creation/editing.
- In Blog 5 (always-on focus), describe ONLY role (a). Mention role (b) ONLY as a one-line forward-ref to Blog 7.
- Do NOT introduce a "meta-layer" as a separate plugin in Blog 5 — that double-counts plugin_integrity and reads as hallucination.
- Blog 7 introduces role (b) and the lock ceremony in detail.

**Rule 4 — Who uses CLAUDE.md as info bus.**
- The CLAUDE.md hierarchy is the SUBSTRATE / bus.
- The PHASIC plugins WRITE to it (footer markers `---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`, body sections, CONDENSE waterfall routes content).
- The ALWAYS-ON plugins do NOT write to CLAUDE.md as their primary state mechanism. They own their own hidden data files (`data.json` per plugin). They READ from CLAUDE.md (for size limits, identity, registered prefixes) but they don't generate its content.
- WRONG: "the always-on plugins use the bus constantly to write their state"
- RIGHT: "the always-on plugins protect the bus's integrity; the phasic plugins write to it (Blog 6)"
- Blog 5 introduces the bus as substrate. Blog 6 shows phases USING it. Blog 7 deep-dives the markers as protocol.

**Rule 5 — Context numbers are operating thresholds, not system limits.**
- The seed agent uses Opus 4.7 with 1M-token context, but `brain_guard` triggers compaction much earlier (soft tier 200k, hard tier 250k, critical 300k).
- When mentioning these numbers, frame as "current operating threshold" or "compaction trigger" — never as "the chat fits 250k tokens" (which sounds like a model limit).
- The 1M ceiling is the model; the 200k/250k/300k tiers are the discipline `brain_guard` enforces to keep cognitive coherence.

### Part 2 Tone (NON-NEGOTIABLE)

Blogs 1-4 lean **conceptual + heavy analogy** (toaster, organism, snake, cognitive metabolism). Blogs 5-8 lean **grounded + low analogy**. Mechanisms are named directly: file paths, marker syntax, plugin names. Analogies from earlier blogs return only as connective glue, never as the load-bearing image of a section.

**Healthy ratio target:**
- ≤1 extended analogy per ~1500 words of body
- ≥3 file-path or named-mechanism references per ~1500 words
- ≥1 callback to an earlier blog per ~1500 words (one-sentence hint + link, not a paragraph)
- **Tier-2 opening (semi-technical, conceptual) → Tier-3 closing (architect, real mechanisms) within EACH blog**

**Voice constants from blogs 1-4 to retain:**
- Single-line paragraphs as structural weapons (5-6 per post minimum)
- Direct address ("Watch what happens", "Look at")
- Crescendo ending — finish on a peak
- Mix short punches with flowing prose

**Voice shifts for blogs 5-8:**
- Less snark, more precision
- Less kitchen-concrete language ("toaster"), more architecture-concrete language ("hook", "marker", "footer", "plugin")
- Don't open with metaphor; open with the load-bearing claim
- Replace "recurring metaphor" pattern with **recurring mechanism callback** — pick one architectural concept per blog and return to it 4-5 times

### Cross-Blog Concept Arc (Part 2)

The four posts must feel aware of each other. Each concept is introduced once, then recalled with a one-line bridge in subsequent posts.

| Concept | B5 | B6 | B7 | B8 |
|---------|----|----|----|----|
| CLAUDE.md as info bus | **introduce** | use (phases write to it) | refine (markers as protocol) | reference |
| 3-layer model (always-on / phasic / meta) | **introduce** | extend (phasic deep-dive) | reference | reference |
| The 5 always-on plugins | **center** | reference | deep-dive (anatomy via plugin_integrity) | reference |
| Single-concern principle | **center** | recall | **center (anatomy)** | recall |
| OPEVC + the 5 phases | preview | **center** | reference | recall |
| Compartmentalization → forward-pressure | preview | **center** | reference | reference |
| CONDENSE as organ + 7-step waterfall | seed | **center** | mechanism | recall |
| Multiplier sentinel | — | **center** | reference | recall |
| Footer markers (`---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`) | seed | use | **center** | recall |
| Inline markers (`[PENDING-JOB]` etc.) | — | seed | **center** | recall |
| Dual voice architecture (soft/hard) | — | mention | **center** | maturation arc |
| Plugin anatomy (the kit) | reference | reference | **center** | reference |
| Subagent system + 80/20 | mention | mention | **center** | reference |
| Soft → hard migration | hint | hint | **mechanism** | **maturation arc** |
| Brain size limits + deflation | mention | mechanism | mention | **growth thesis** |
| Job formats (single / multi / sibling / dep) | reference | reference | reference | **center** |
| Knowledge layers (knowledge/, memory/, session/) | mention | mechanism | mechanism | **accumulation arc** |

**Cell-value definitions:**
- **center / introduce** — the concept is the load-bearing pillar of that blog
- **mechanism / deep-dive** — explained in detail with file paths
- **use / extend / refine** — referenced in flowing prose, building on prior introduction
- **seed / preview / hint** — one-sentence forward-reference to a later blog
- **recall / reference** — one-sentence callback, with hyperlink
- **mention** — present but not load-bearing

### Inter-Blog Callbacks (Part 2)

Each Part-2 blog must include callbacks to earlier blogs (1, 2, 3, 3.1, 4) AND forward-references to upcoming blogs (5-8). One sentence each, with link. Never assume the reader remembers — remind them.

| Blog | Backward callbacks | Forward references |
|------|-------------------|--------------------|
| 5 | 1 (filesystem = agent — now we name the files), 3.1 (.claude/ + sibling work — now we open .claude/), 4 (vocabulary — hooks, plugins) | 6 (phases USE the bus), 7 (plugin anatomy makes the bus possible) |
| 6 | 5 (the bus the phases write into), 1 (OPEVC was planted — now formal), 3.1 (cognitive metabolism — now phasic) | 7 (the kit lets you build new phases), 8 (multipliers + waterfall as long-horizon discipline) |
| 7 | 5 (single-concern principle), 6 (the phases are themselves plugins), 4 (vocabulary check: hooks, voices, agents) | 8 (the kit grows your seed over time) |
| 8 | 5 (always-on cortex), 6 (phasic discipline), 7 (the kit), 1 (your brain needs this — now you have it) | (no forward — series closes) |

**Rule:** When referencing a concept from an earlier blog, include a brief hint + link. One sentence, not a paragraph.

### Cross-Blog Closing Bridges

Each blog (except B8) ends with a one-line forward bridge in the **body** (not just the footer):

- **B5 close:** "But a bus is just substrate. What USES it intelligently — that's the phasic brain. Next."
- **B6 close:** "The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design? Next."
- **B7 close:** "The kit is in your hands. What does growth LOOK like when you use it over time? Next."
- **B8 close:** Series closure — bridge to public seed-agent repo + Hadosh Academy mission.

### Blogs 5-8: Per-Blog Pillars

**Blog 5 — The Single-Concern Digital Cortex** (~3000-4000 words)
- §1: The 3-layer architecture (always-on / phasic / meta) — sets up the rest of Part 2
- §2: Why "single concern" matters (counter-example: monolithic agent guards drift, mix concerns, become unfixable)
- §3: The 5 always-on plugins, one paragraph each — `plugin_integrity`, `brain_guard`, `job_core`, `interaction_summary`, `question_discipline`
- §4: **The CLAUDE.md hierarchy as information bus** (the load-bearing thesis — state offloaded to addressable, durable layers)
- §5: Tier-3 deep-dive — the historian ratchet (auto-injects evolution.md, drift counter blocks unlock until re-sync)
- §6: Bridge to B6

**Blog 6 — The Markov Phasic Brain** (~4000-5000 words; densest)
- §1: Why 5 phases + 1 organ (CONDENSE is not a peer — it's neural consolidation)
- §2: Tool restrictions per phase = the discipline (forbidden tools as pedagogy)
- §3: OBSERVE — read-only, multiplier sentinel, point system
- §4: PLAN — read-only, plan_file as immutable contract
- §5: EXECUTE — full write, altered-list scope, multi-commit checkpoints
- §6: VERIFY — scripts only, auditor subagents, multi-backward
- §7: CONDENSE — the organ (irreversible forward, 7-step waterfall, deflation gate)
- §8: **Tier-3 close: the multiplier is backward** (3× surgical, 0.5× deep — honest scope forecasting)
- §9: Bridge to B7

**Blog 7 — The Plugin Kit** (~3500-4500 words)
- §1: Plugin = cell with internal organs (carry-over analogy from 3.1, used as glue)
- §2: The standard files (hooks/, scripts/, hidden `data.json`, tests/, evolution.md, dual `voice.xml`, agents/, CLAUDE.md)
- §3: PLUGIN-LOCK + TEST-LOCK + safe-lock auto-revert (test-pass-or-revert cycle)
- §4: **Markers as inter-phase protocol** — code-addressable, grep-dispatched, removed after consumption
- §5: **Dual voice architecture** — coaching (probabilistic LLM-interpreted) vs blocks (deterministic)
- §6: Subagent system + 80/20 (per-plugin agents, why not a global pool)
- §7: **Tier-3 close: building a new phase plugin** — recipe walkthrough
- §8: Bridge to B8

**Blog 8 — From Apprentice to Architect** (~3000-4000 words)
- §1: Job formats (single-cycle DEEP, multi-cycle, sibling, dependent) — what each teaches
- §2: The maturation arc (apprentice → journeyman → architect) — visible markers per stage
- §3: **Soft → hard migration** — voice → measurement → hook → plugin → out of brain
- §4: Why the brain shrinks as it learns (size limits force compression, deflation gates, the growth-by-pruning thesis)
- §5: Knowledge accumulation across cycles (knowledge/, memory/, session/ as durable layers)
- §6: **Tier-3 close: the meta-thesis** — system that safely modifies itself; the brain stops growing in size but never stops learning
- §7: Bridge to public seed-agent (open-source, MIT, the hand-off)

## Current Posts

Slug column shows the **prefixed filename** (`NN-slug`). All blog files are numbered.

| # | Slug | Title | Status |
|---|------|-------|--------|
| 1 | `01-llms-are-not-the-agents` | LLMs Are Not the Agents | **FINAL** |
| 2 | `02-we-could-have-had-agi` | We Could Have Had AGI By Now | **FINAL** |
| 3 | `03-your-brain-was-never-built-for-this` | Your Brain Was Never Built for This | **FINAL** |
| 3.1 | `03_1-the-folder-is-alive` | The Folder Is Alive (interlude) | **FINAL** |
| 4 | `04-the-language-of-agents` | The Language of Agents | **FINAL** |
| 5 | `05-the-single-concern-digital-cortex` | The Single-Concern Digital Cortex (working) | **drafting v0.1.1** |
| 6 | `06-the-markov-phasic-brain` | The Markov Phasic Brain (working) | **outlined** |
| 7 | `07-the-plugin-kit` | The Plugin Kit (working) | **outlined** |
| 8 | `08-from-apprentice-to-architect` | From Apprentice to Architect (working) | **outlined** |

### Status Legend

- **FINAL** — copy is locked. Do NOT edit prose without explicit user direction. Reference voice / structural anchor for the series.
- **drafting** — first draft in progress (`.md` only). HTML not yet built.
- **outlined** — pillars + tier-2/tier-3 hooks defined in Per-Blog Pillars above; no draft yet.

Working titles may shift; final titles lock when each `.md` is reviewed and approved.

### In-flight Files (5-8 rewrite agenda)

The previous Gemini-era drafts (`05-the-agents-steadfast-core.*`, `06-the-seed-agents-cognitive-rhythm.*`, `07-from-apprenticeship-to-mastery.*`) were deleted 2026-05-06 — older than the current architecture, replaced by from-scratch drafting against `../.claude/`. Old published HTML stubs (`05-the-agents-unsung-heroes.html`, `07-from-collaboration-to-competence.html`) are also gone.

`blog.html` index + sidebar were updated yesterday to show the OLD interim titles (Steadfast Core / Cognitive Rhythm / Apprenticeship to Mastery). When the new `.md` drafts land, sidebar + index will be re-synced to the working titles above (or whatever final titles emerge).

**When each Part-2 blog reaches publishable state, also sync:** `sitemap.xml`, `feed.xml`, sidebars across all posts, audio inventory in root `CLAUDE.md`, blog.html index card, all four blog-1..3.1..4 sidebars.





---Ob---






---Pl---






---Ex---






---Ve---
