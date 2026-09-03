# blog/ — Blog Posts Working Memory
**Version:** v0.16.0

> **De-bloat 2026-07-15:** reference/history/planning bulk moved to `.claude/knowledge/`; build/transcript/audio/publish procedures live in the `blog-update` skill. This file keeps only always-on blog facts + authoring standards. See **Reference & procedures moved out** at the foot.

## Layout

- **Part-1 essays** (`01..04` + `03_1` interlude): `blog/<slug>.{md,html,transcript.md}` at this directory root.
- **B5 mini-series** (`05_1..05_9`): `blog/b5/<slug>.{md,html,transcript.md}` — moved 2026-05-18. Images at `blog/b5/images/`. Series working memory at `blog/b5/CLAUDE.md`.
- **B6 mini-series** (`06_1..06_10`): `blog/b6/<slug>.{md,html,transcript.md}` — moved 2026-05-19. Images at `blog/b6/images/`. Series working memory at `blog/b6/CLAUDE.md`.
- **B7 mini-series** (`07_1..07_9`): `blog/b7/<slug>.{md,html,transcript.md}` — moved 2026-05-18 (Commit F).
- **B8 mini-series** (`08_1..08_9`): `blog/b8/<slug>.{md,html,transcript.md}` — moved 2026-05-18 (Commit G).
- **B9 mini-series** (`09_1..`): `blog/b9/<slug>.html` — dashboard-plus-harness series opened 2026-09-03; current public source is HTML and series memory lives at `blog/b9/CLAUDE.md`.
- B5 + B6 images co-located at `blog/b{5,6}/images/`. Part-1 + B7/B8 essay-specific images live under `assets/images/blog/b{7,8}/` (subdir-restructure landed but image co-location pending for B7/B8).

When working on B5 or B6, prefer the series-local CLAUDE.md at `blog/b5/CLAUDE.md` / `blog/b6/CLAUDE.md` for current state.

## Content Workflow

- **Source of truth:** `.html` files (committed to git)
- **Editing files:** `.md` files (gitignored, local-only)
- **Flow:** `.md` ↔ `.html` — changes sync both directions
- **HTML build · transcript · audio · sidebar/feed/publish · verification procedures:** the **`blog-update` skill** (`.claude/skills/blog-update/`) — run it, don't reinvent.

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
- **Educational asides pattern** — follow Blog 5's JSON model: soft intro → definition + link → concrete example → "why this matters" → "get comfortable with this term"
- **Self-appreciation ceiling** — avoid "most important idea in agent design"; present concepts, let readers draw conclusions
- **Don't teach as if correcting** — share our approach, don't fix an industry. "Here is what we found" not "here is the most common mistake"
- **No word salads** — dense comma-separated lists of abstract concepts are hard to parse. Break into separate sentences, each with its own subject-verb.
- **Forward/backward references** — every blog hints at future essays and callbacks to past ones. One sentence each, not paragraphs.
- **Ref-arc gap analysis** — not every gap in a blog needs to be filled in that blog; some are intentionally filled by a later blog in a reference arc. Before adding content, check whether an apparent gap is already addressed downstream.

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
- **Audio footer excluded** — narration stops at the closing line ("Build the toaster", "Build the organism", etc.)
- **Interlude posts** (e.g., 3.1) use `*Series interlude — sits between Essay N and Essay N+1 of the Hadosh Academy series on agent architecture.*` instead of `*Essay N of 8 ...*`

## Image Style (NON-NEGOTIABLE)

All blog images use the **dark chalkboard / pastel chalk** aesthetic anchored by `assets/images/blog/opevc-cycle-blackboard.png`. Every image prompt — in `.md` placeholder comments AND in the matching HTML `<aside class="image-placeholder">` — must reference this style explicitly.

**Required descriptors** in every prompt: "Chalk-on-blackboard", "Match `opevc-cycle-blackboard.png` exactly", "dark slate chalkboard", "hand-drawn chalk lines", "pastel chalk (cyan, green, orange, pink, magenta)", "white chalk for labels and arrows", "chalk sticks at the bottom edge", "Keep every line hand-drawn and slightly imperfect, never ruler-straight".

**Forbidden descriptors** (retired with the old style): "dark glassy space", "glassmorphism", "indigo/violet palette", "futuristic", "subtle glow effects".

**Mirror rule:** Every image-prompt change in `.md` MUST be mirrored in `.html`. They describe the same prompt for downstream image generation.

**Image-generation workflow + verification grep:** `blog-update` skill M5.

## Content Metadata Rules

- **Read time = audio time** — use actual ffprobe duration, rounded to nearest minute
- **Audio label** and **read time** must show the same number
- **All instances must match:** article meta, sidebar cards (in ALL posts), blog.html index cards, .md frontmatter

## Glossary Linking (every post)

- **Link technical terms** at their first body-text occurrence in each post
- **Format (HTML):** `<a href="URL" title="brief plain-language tooltip" target="_blank" rel="noopener">term</a>`
- **Format (MD):** `[term](URL "brief plain-language tooltip")`
- **Only first occurrence** per post — do not repeat-link the same term
- **Tooltips:** one sentence, plain language, aimed at non-technical professionals
- **Sources:** Wikipedia or official docs (prefer Wikipedia for general terms)
- **Volume:** ~5-10 terms per post — enough to help, not so many it clutters
- **Skip terms already explained** in surrounding text

## Biological Terminology Convention

When borrowing biological terms, **prefix with "cognitive" or "digital" at first use**:
- Agent components → **cognitive organs** (not just "organs")
- Files/instructions → **cognitive tissue** (not just "tissue")
- Memory files → **cognitive memory tissue**
- Hooks/events → **reflexes and sensory systems**
- `.claude/` directory → **digital cortex**
- Evolution frame: brainstem → cortex → **digital cortex**

This framing helps readers see agents as **extensions of their brain**, not separate tools.

**First-use rule, sparse-reuse principle.** Prefix the biological term explicitly at its first establishing use in a series (e.g., B7.1 anchors "cognitive organs" once). Subsequent shorthand within the same series may drop the prefix when the architectural meaning is unambiguous — the metaphor is already established. Do NOT mass-prefix every occurrence; it turns prose into word salad. Reserve a FAIL only for a novel biological term introduced without a prefix (e.g., "metabolism organ" without "cognitive metabolism organ" first).

## Blog-Source Hard Rules (NON-NEGOTIABLE)

- **OPEVC footer anchors** (`---Ob---` / `---Pl---` / `---Ex---` / `---Ve---`) belong ONLY in agent CLAUDE.md working-memory files. They MUST NOT appear as bare-line section anchors in blog `.md` source — they pollute the source view and the transcript tool reads them aloud as "the OBSERVE/PLAN/EXECUTE/VERIFY footer". **EXCEPTION:** anchors INSIDE fenced ` ``` ` code blocks are pedagogical (e.g. B5.7 teaches the four-footer protocol) — preserve those. Subagents authoring blog drafts must NOT carry CLAUDE.md footer anchors into blog source. Detection grep + fenced-vs-bare distinction: `blog-update` skill M5.
- **Inline markdown images** (`![alt](path)` on their own line) MUST render as `<figure>` + `<img>`, never `<p>!<a ...>`. Enforced by the converter and by the render-check greps in `blog-update` skill M5.

## Canonical Vocabulary

The seed's internal-architecture terms (Jobs, Phases, OPEVC, CONDENSE waterfall, the five markers, voices, ref-tag, customization layers, …) — the compact glosses that keep canonical names + banned aliases in working memory — moved to **`.claude/knowledge/blog-seed-vocabulary.md`** (recall it for **Part-2 / B5-B8 architecture blog work**). Canonical ground truth: `hadosh_academy/.claude/context/INDEX.md`; per Rule 40, when essay prose conflicts with a `[consolidated]` definition there, the prose is the drift — fix the prose.

**Banned-alias sweep — Phase-C actionable (replace on sight in essay bodies):** `Form 1/2/3` → Job Stage 1/2/3 · `sibling job` → standalone/dep job · `seal`/`sealed`/`seal-plan`/`completed_plan`/`plan_state`/`md_approved`/`yaml_drafting`/`yaml_ready`/`plan_file_last`/`previous_status` → retired (use the cycle-formula + plan_file-persistence model) · `[PLAN-APPROVAL]`/`[YAML-APPROVAL]` → retired · "Stage 1/2 hook" → pre-/post-completion hook · "stage-aware deflation"/"50% Stage-2" → single 80% deflation gate · "plan decided at job creation" → Stage decided in cycle-1 PLAN. Full list: ../.claude/context/ledger.md banned-vocabulary sweep.

## Current Posts

Status by series (status word only). **Full roster with slugs + titles + per-essay iteration/audit histories: `.claude/knowledge/blog-status-history.md`.** Live B5/B6 per-essay detail: `blog/b5/CLAUDE.md` + `blog/b6/CLAUDE.md`.

| Series | Scope | Status |
|---|---|---|
| Part 1 | `01`, `02`, `03`, `03_1` (interlude), `04` | **FINAL** — locked reference voice |
| B5 `b5/05_1..05_9` | The Always-On Digital Cortex (9 parts) | **drafting** (all 9) |
| B6 `b6/06_1..06_10` | The Markov Phasic Brain (10 parts) | `06_1..06_6` **drafting** · `06_7..06_10` **GOAL ACHIEVED** |
| B7 `b7/07_1..07_9` | The Plugin Kit (9 parts) | **GOAL ACHIEVED** (all 9) |
| B8 `b8/08_1..08_9` | Apprentice to Architect (9 parts) | **GOAL ACHIEVED · published** (all 9; og:image pending, b4 fallback) |
| B9 `b9/09_1..` | The Visible Harness | **IN PROGRESS** (1 published) |

Per B8.9's last recorded state: **37 of 37 essays GOAL'd + corpus published**. B5 + early-B6 are the remaining draft-polish surface.

### Status Legend

- **FINAL** — copy is locked. Do NOT edit prose without explicit user direction. Reference voice / structural anchor for the series.
- **drafting** — first draft in progress (`.md` only); HTML may or may not be built.
- **GOAL ACHIEVED** — passed the 3-consecutive-CLEAN audit gate (see `blog-update` M14). "· published" = live in sitemap/feed/blog.html.

## Reference & procedures moved out (de-bloat 2026-07-15)

- `.claude/knowledge/blog-seed-vocabulary.md` — seed-architecture vocabulary (Part-2 / B5-B8 work)
- `.claude/knowledge/blog-series-design.md` — series arc, per-blog intent, cross-blog concept-arc + callback tables, per-blog pillars
- `.claude/knowledge/blog-part2-authoring-rules.md` — Part-2 accuracy + tone lint rules (grep before submitting a B5-B8 draft)
- `.claude/knowledge/blog-code-alignment-manifest.md` — phase-ownership blog/code alignment manifest
- `.claude/knowledge/blog-status-history.md` — full per-essay iteration/audit histories
- `.claude/skills/blog-update/` — all build · transcript · audio · sidebar/feed · publish · verification procedures
- `blog/b5/CLAUDE.md` + `blog/b6/CLAUDE.md` — live B5/B6 per-essay state

---Ob---

---Pl---

---Ex---

---Ve---
