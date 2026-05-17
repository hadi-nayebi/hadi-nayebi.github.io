# blog/ — Blog Posts Working Memory
**Version:** v0.9.0

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

## Image Style (NON-NEGOTIABLE)

All blog images use the **dark chalkboard / pastel chalk** aesthetic anchored by `assets/images/blog/opevc-cycle-blackboard.png`. Every image prompt — in `.md` placeholder comments AND in the matching HTML `<aside class="image-placeholder">` — must reference this style explicitly.

**Required descriptors** in every prompt: "Chalk-on-blackboard", "Match `opevc-cycle-blackboard.png` exactly", "dark slate chalkboard", "hand-drawn chalk lines", "pastel chalk (cyan, green, orange, pink, magenta)", "white chalk for labels and arrows", "chalk sticks at the bottom edge", "Keep every line hand-drawn and slightly imperfect, never ruler-straight".

**Forbidden descriptors** (retired with the old style): "dark glassy space", "glassmorphism", "indigo/violet palette", "futuristic", "subtle glow effects".

**Mirror rule:** Every image-prompt change in `.md` MUST be mirrored in `.html`. They describe the same prompt for downstream image generation.

**Verification grep** (must run after any image-prompt edit):
```bash
grep -c -i "glassy\|glassmorphism" blog/<slug>.md blog/<slug>.html   # must be 0
grep -c "Chalk-on-blackboard" blog/<slug>.md blog/<slug>.html        # must equal the number of image placeholders
```

## OPEVC Markers Forbidden in Blog Source (NON-NEGOTIABLE)

The OPEVC footer anchors `---Ob---` / `---Pl---` / `---Ex---` / `---Ve---` belong **ONLY** in agent CLAUDE.md working-memory files. They MUST NOT appear in blog `.md` source files. The HTML converter happens to strip them from rendered output, but:
- They pollute the source — readers seeing the .md (e.g., via GitHub source view) see broken-looking artifacts.
- The transcript tool reads them as "the OBSERVE/PLAN/EXECUTE/VERIFY footer" via PRONUNCIATION_GUARDS — putting them in every audio file.

**Detection grep (must be 0):**
```bash
grep -c "^---Ob---$\|^---Pl---$\|^---Ex---$\|^---Ve---$" blog/<slug>.md
```

**Origin:** 2026-05-15 — 12 blog drafts (10 B6 sub-essays + B5 monolith + B5.7) had inherited the markers from subagent boilerplate copied from CLAUDE.md templates. User caught it; iter-26 stripped them all. Subagents authoring blog drafts must NOT carry CLAUDE.md footer markers into blog source.

## Inline Image Syntax (NON-NEGOTIABLE)

Markdown inline images use the form `![alt-text](path)` on their own line. The converter at `tools/generate_blog_html.py` MUST emit a `<figure>` with `<img>` for these — NOT wrap them in `<p>` (which renders `!` as literal text + a broken `<a>` link).

**Origin:** 2026-05-15 — B6.1's `opevc-cycle-blackboard.png` rendered as broken text (`<p>!<a href="...">caption</a></p>`) in HTML for days. The converter only handled `<!-- IMAGE PLACEHOLDER -->` HTML comments, not inline markdown image syntax. Fix landed in iter-26 — `render_body` now has an `img_match` block-level check that emits `<figure>` + `<img>` + `<figcaption>`.

**Verification cascade for any blog with inline images:**
```bash
# Must NOT show `<p>!<a` for any image-only paragraph
grep -n "<p>!<a\|<p>!\[" blog/<slug>.html
# Must show <figure class="blog-image"> + <img src="...">
grep -nE "<figure class=\"blog-image\"|<img src=\".*\\.png\"" blog/<slug>.html
```

## Explicit Final Verification (NON-NEGOTIABLE)

After any prose, image-prompt, or transcript change, **explicitly verify each downstream deliverable** before declaring the work done. The Edit tool can silently no-op; regenerated transcripts can carry artifacts; audio can be stale even when the transcript is fresh. **Trust nothing; grep everything.**

**Required verification cascade after any `.md` change:**

1. **Edit landed in `.md`** — grep for the new string AND grep for the old string (old count must be 0).
2. **HTML mirrored** — same grep against `.html`. Prose, image prompts, and structural edits must appear in both files.
3. **Transcript regenerated** — run `tools/generate_blog_transcript.py`, then grep for known artifact patterns: chalk/blackboard leakage from image prompts (must be 0); double-`the` from marker expansion (must be 0); stray `!` from image markdown (must be 0).
4. **Transcript flipped to `final: true`** — `head -5 blog/<slug>.transcript.md` must show `final: true`.
5. **Audio re-rendered** — confirm `blog/<slug>.mp3` mtime is NEWER than the transcript's `generated_at` timestamp. Stale mp3 + fresh transcript = audio that doesn't match HTML.

**Do not stop iterating until every item in the cascade is verified.** If any step fails — re-edit, re-regen, re-render. The work is done when every deliverable is verified final, not when one of them lands.

## Audio Transcript Rules (NON-NEGOTIABLE)

OpenAI's `tts-1-hd` model (voice: onyx) does **not support SSML**. It reads input verbatim. Acronyms, snake_case identifiers, footer markers, and bracketed prefixes mispronounce or drop entirely if fed raw.

**Tooling:**
- `tools/generate_blog_html.py` (added 2026-05-13) converts blog `.md` to `.html` using B6 as the template reference. Pragmatic — tuned for ref-tag italic-bracket → `<sup class="ref-marker">`, image-placeholder HTML comments → `<aside class="image-placeholder">`, sidebar with all 9 posts active-marked. **When adding a new blog post:** extend `SIDEBAR_POSTS` in the converter BEFORE running, or it will fail with `slug not found`. Run: `python3 tools/generate_blog_html.py blog/<slug>.md blog/<slug>.html`.
- `tools/generate_blog_transcript.py` strips markdown AND applies pronunciation guards. Cheap (no API). Run on every prose change: `python3 tools/generate_blog_transcript.py blog/<slug>.md blog/<slug>.transcript.md`. Output is rewritten with `final: false` in the frontmatter every regen.
- `tools/generate_blog_audio.py` reads the transcript and runs TTS. **Costs ~$0.75 per 35–40 min essay on `tts-1-hd`.** Has a 4-attempt retry guard for transient API errors.

**Cost gate (NON-NEGOTIABLE):** the audio script refuses to run unless the transcript's frontmatter has `final: true`. The transcript is regenerated as `final: false` every time, so the workflow is:

1. Edit `.md` → run the transcript tool (cheap, no API). Re-read the `.transcript.md` to confirm pronunciation guards landed and prose reads cleanly.
2. When the transcript is the version you want to spend money on, **manually flip** the frontmatter line to `final: true`.
3. Run the audio tool.
4. If you edit the `.md` again, the transcript regen resets the flag to `false` — by design, since the content changed.

This prevents accidentally re-rendering during iteration. Total spend per essay should be 1–3 audio generations max, not 6–8.

**Pronunciation guards (extend `PRONUNCIATION_GUARDS` in the transcript tool when adding new identifiers):**

| Source form | Audio form | Why |
|---|---|---|
| `*Essay N.N — Title, Part N of N. ...*` | (stripped) | Italic meta-line below the H1 (and matching footer position-line). Metadata for the eye, not narration. Stripped via `meta_patterns` in `generate_blog_transcript.py` — extend that list when adding a new subtitle/footer format. |
| `OPEVC` | `O P E V C` | Confirmed dropped/garbled by tts-1-hd. Letter-spacing forces initialism. |
| `brain_guard`, `job_core`, `plugin_integrity`, `interaction_summary`, `question_discipline`, `phasic_system` | `brain-guard`, `job-core`, … | Underscores read as awkward pause; hyphens read as compound noun. |
| `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` | "the OBSERVE/PLAN/EXECUTE/VERIFY footer" | Triple-dash markers read as "dash dash dash" — meaningless to listener. |
| `[PLUGIN-LOCK]`, `[JOB-COMPLETE]`, `[WAITING]`, … | `plugin-lock`, `job-complete`, `waiting`, … | Brackets are silent; ALLCAPS-HYPHEN content drops same way as OPEVC. |
| `<plugin_name>`, `<id>`, `<text>` | "the plugin name" / dropped | Angle-bracket placeholders read as "less than … greater than". |

**Don't guard these — TTS handles them:**
- `CLAUDE.md`, `voice.xml`, `evolution.md` — read as "Claude dot M D" etc., parseable.
- `.claude/`, `.claude/knowledge/` — "dot claude" reads naturally.
- Phase names OBSERVE / PLAN / EXECUTE / VERIFY / CONDENSE — real words.
- `/compact`, `/memory` — slash-commands read as "slash compact", which is meaningful.

**Authoring rules for blog prose:**
1. **The transcript is for the ear, the .md is for the eye.** Different artifacts.
2. **No naked identifier dumps.** Lists of 3+ inline-code identifiers are an audio failure waiting to happen — name the **category** first, anchor with at most ONE example. (Example: not "blocks `Edit`, `Write`, `MultiEdit`, `Read`, `Bash`, and `AskUserQuestion`" but "blocks every productive tool the agent has — reads, writes, shell calls, even further questions".)
3. **First mention rule for acronyms:** unfold inline at first use ("OPEVC — Observe, Plan, Execute, Verify, Condense") so the listener anchors before any abbreviated reference.
4. **Punctuation is pacing.** Periods give clean pauses; em-dashes give shorter beats; semicolons give half-beats. Avoid bare hyphens mid-acronym.
5. **TTS is non-deterministic.** Same input, different runs can flip pronunciation. Listen-test each generation; expect to regen if a critical term lands wrong.

**When adding a new acronym, identifier, or marker to the seed agent:** extend `PRONUNCIATION_GUARDS` in `tools/generate_blog_transcript.py` BEFORE writing the blog that uses it. Otherwise the audio will drop it.

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

**Blog 5 — The Always-On Digital Cortex:** The seed agent doesn't have memory; it has a **bus**. Always-on plugins each own one concern. State lives in a layered CLAUDE.md hierarchy — not the chat. **Tier-3 close:** the historian ratchet (must re-read your own work before editing).

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

**Rule 4 — Always-on vs phasic relationship to the CLAUDE.md layer.**
- The CLAUDE.md hierarchy is the SUBSTRATE the phasic system uses as its working medium.
- The PHASIC plugins WRITE to it (footer markers `---Ob---`/`---Pl---`/`---Ex---`/`---Ve---`, body sections; CONDENSE waterfall routes content upward into bodies, sideways into knowledge files, and into voice files, plugin definitions, even new plugins).
- The ALWAYS-ON plugins each own their own concern and their own data files. Their relationship to the CLAUDE.md layer **varies plugin by plugin**: `plugin_integrity` polices the four phase markers from removal but explicitly EXEMPTS CLAUDE.md content from lock checks (per `plugin-guard.sh:562-575`, "DOCUMENTATION ALWAYS FREE"); the other four (`brain_guard`, `job_core`, `interaction_summary`, `question_discipline`) are orthogonal to CLAUDE.md, owning concerns (context budget, job lifecycle, interaction summarization, question discipline) entirely inside their own data files.
- The unifying property of the always-on layer is **phase-independence** (each plugin runs continuously regardless of phase), not its relationship to the CLAUDE.md layer.
- WRONG: "the always-on plugins protect the bus's integrity"
- WRONG: "always-on plugins read CLAUDE.md for size limits, prefixes, thresholds" — these live in plugin-private data/config files, not CLAUDE.md
- RIGHT: "the always-on plugins run continuously, each minding its own concern; the phasic system uses the CLAUDE.md layer to think ahead, gather experiential data, and process it into the agent's longer-term memory forms"
- Blog 5 introduces the always-on plugins and the CLAUDE.md layer side by side as separate strands. Blog 6 shows the phasic system USING the CLAUDE.md layer. Blog 7 deep-dives plugin anatomy.

**Rule 5 — Context numbers are operating thresholds, not system limits.**
- The seed agent uses Opus 4.7 with 1M-token context, but `brain_guard` triggers compaction much earlier (soft tier 200k, hard tier 250k, critical 300k).
- When mentioning these numbers, frame as "current operating threshold" or "compaction trigger" — never as "the chat fits 250k tokens" (which sounds like a model limit).
- The 1M ceiling is the model; the 200k/250k/300k tiers are the discipline `brain_guard` enforces to keep cognitive coherence.

**Rule 6 — Series-aware references for pre-split essays.**
- When an essay references another that may later split into a sub-series (B6, B7, B8 are candidates — Essay 5 has already split), the framing depends on what the ref promises.
- WRONG (when content is being deferred): "deconstructed in [Essay 7]" or "the subject of [Essay 6]" — these promise a single-page lookup that breaks navigability when the target splits.
- RIGHT (content deferral): "the [Essay 6 series]" or "deconstructed across the [Essay 7 series]" — optionally add "(currently a monolith; we will split it into a sub-essay series the same way we split Essay 5)" when the first reference in the essay establishes the framing.
- OK as-is (generic category pointer): "The phase plugins ([Essay 6])" — entry-point URL redirects cleanly when the target splits; no caveat needed.
- OK as-is (parenthetical concept reference): "the soft → hard migration from [Essay 8]" — references a concept, not a location.
- OK as-is (footer navigation): "Next: [Essay 6 — Title]" — entry-point URL is canonical.
- Why: B5 split in 2026-05-14 broke this distinction. Catching this rule before B6/B7/B8 split saves a second drift-pass when those splits happen.

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
| Altered list (CLAUDE.md edits scope EXECUTE) | **introduce** | mechanism | reference | recall |
| Per-phase write rule (cannot edit above own anchor) | **introduce** | reinforce | reference | — |
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
| 8 | 5 (always-on digital cortex), 6 (phasic discipline), 7 (the kit), 1 (your brain needs this — now you have it) | (no forward — series closes) |

**Rule:** When referencing a concept from an earlier blog, include a brief hint + link. One sentence, not a paragraph.

### Cross-Blog Closing Bridges

Each blog (except B8) ends with a one-line forward bridge in the **body** (not just the footer):

- **B5 close:** "But a bus is just substrate. What USES it intelligently — that's the phasic brain. Next."
- **B6 close:** "The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design? Next."
- **B7 close:** "The kit is in your hands. What does growth LOOK like when you use it over time? Next."
- **B8 close:** Series closure — bridge to public seed-agent repo + Hadosh Academy mission.

### Blogs 5-8: Per-Blog Pillars

**Blog 5 — The Always-On Digital Cortex** (~3000-4000 words)
- §1: The 3-layer architecture (always-on / phasic / meta) — sets up the rest of Part 2
- §2: Why "single concern" matters (counter-example: monolithic agent guards drift, mix concerns, become unfixable)
- §3: The 5 always-on plugins, one paragraph each — `plugin_integrity`, `brain_guard`, `job_core`, `interaction_summary`, `question_discipline`
- §4: **The CLAUDE.md hierarchy as information bus** (the load-bearing thesis — state offloaded to addressable, durable layers; per-phase write rule via above-anchor block; altered list — CLAUDE.md edits in OBSERVE/PLAN scope EXECUTE)
- §5: Tier-3 deep-dive — the historian ratchet (auto-injects evolution.md, drift counter blocks unlock until re-sync)
- §6: Bridge to B6

**Blog 6 — The Markov Phasic Brain** (~4000-5000 words; densest)
- §1: Why 5 phases + 1 organ (CONDENSE is not a peer — it's neural consolidation)
- §2: Tool restrictions per phase = the discipline (forbidden tools as pedagogy)
- §3: OBSERVE — read-only, multiplier sentinel, point system
- §4: PLAN — read-only, plan_file as immutable contract
- §5: EXECUTE — full write, altered-list scope (introduced in B5 §4) deepened with file-type rules, multi-commit checkpoints
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

## Compartmentalization Manifest (Working — Prototype Design)

Every command/operation in the seed agent is owned by exactly one phase. Each ownership choice is a **dimension of variation** — future seed agents can vary along these axes. This section is the source-of-truth for what the **current prototype** ships and what is **deferred** to post-ship variations. Blog narrative and prototype code must agree with this manifest.

### Workflow (repeating loop)

1. **Concept** — user describes a phase-design intent or invariant
2. **Investigate** — dispatch subagents to find where the concept lives in code; flag contradictions, gaps, drift (file:line + snippet evidence per item)
3. **Fix the blog first** — update Blog 6 (.md + .html mirrored, transcript regenerated, no contradictions)
4. **Fix the code second** — bring prototype into alignment with corrected narrative
5. **Repeat** — next dimension

**Ground rules:** subagents for investigation (never direct grep); evidence with file:line + snippet for every flagged item; one concept at a time, fully closed before moving on; no "99% done" — full audit, full fix, full verify.

### Dimension 1: Plan-file lifecycle

**Operating principle (user-described — prototype design choice):**
- **PLAN's deliverable** = analysis + decisions, written into CLAUDE.md (working memory). PLAN **names** the plan file; does not write to it.
- **EXECUTE's deliverable** = artifacts. Plan file is an artifact (just like code). EXECUTE materializes the .md plan file.
- **VERIFY's deliverable** = approval + critique. VERIFY is the cycle's final guardrail; refines the plan, requests reanalysis if deficient.
- **Underlying principle:** no phase authors its own gate's artifact; every phase fully authors its own working-memory analysis.

**Job-type classification model:**
- **Single-cycle deep OPEVC** — freestyle, collaborative-with-user, **no plan file**. Many backward + loops INSIDE the cycle. Example: chemical engineer teaching technoeconomic analysis to a fresh seed.
- **Multi-cycle** — plan file exists; refinement accumulates across cycles.
- **Job type is decided in OBSERVE of cycle 1**, not at job creation.
- Signal: `plan_file: "false"` literal for single-cycle; path string for multi-cycle. (Q5 resolved per root CLAUDE.md `set-plan-file <id> false`.)

**Plan file two-stage lifecycle:**
- **Stage A — .md (working plan):** created in EXECUTE (cycle 1), edited by VERIFY, refined across cycles. Many jobs never leave Stage A.
- **Stage B — .yaml (consolidated plan):** triggered when plan is approved. Future cycles read .yaml at phase entry for context-rich injection. v1 minimal: identity transform of .md content into yaml shell.
- **Plan approval gate:** user-gated (not auto-promoted). Mechanism TBD via Q1.

**Universal principle (extracted from user's Q2 answer — applies beyond plan files):**
- OBSERVE + PLAN + VERIFY work in CLAUDE.md (analyze, decide, refine).
- **EXECUTE is the universal file-creator.** Any file the seed agent produces (.md plan, .yaml plan, code, configs) is written by EXECUTE using CLAUDE.md analysis as the source.
- VERIFY can edit files EXECUTE created — refinement is part of VERIFY's authority.
- **Every artifact has the same lifecycle:** analyze in CLAUDE.md → EXECUTE writes → VERIFY refines → loop. Plan files are one specific instance.

**Locked-in for this prototype:**
1. PLAN names plan file (writes only into CLAUDE.md layer).
2. EXECUTE creates .md plan file (cycle 1) — instance of the universal "EXECUTE writes files" principle.
3. VERIFY edits .md plan file (refinement + final-guardrail authority) and is the **only phase that can ask for plan approval**.
4. PLAN reads plan file on subsequent cycles.
5. Single-cycle jobs = `plan_file: "false"`; multi-cycle = path string.
6. **Plan approval mechanism:** VERIFY uses AskUserQuestion to ask the user. On "yes", VERIFY calls a plan-phase script to flip an approval flag on the job. **No chat-marker scanning.**
7. **.yaml creation is itself a full OPEVC cycle**, not an identity transform: OBSERVE + PLAN analyze the approved plan in CLAUDE.md, EXECUTE writes the .yaml for the first time, VERIFY refines (can send back to PLAN). Multiple cycles may refine the .yaml.
8. **VERIFY's reanalysis backward path is unconstrained** — VERIFY returns to whichever phase fits the situation; not a hardcoded route.
9. **.yaml as injection mechanism:** once .yaml exists, future cycles read it for context injection at phase entry — a stream of memories during job work. Parseable structure supports richer injection than .md.
10. **Same-basename side-by-side:** `plans/foo.md` and `plans/foo.yaml` in the same directory.
11. **Root CLAUDE.md defines the job-form taxonomy** — seed agent reads it to decide what form a new job takes (single-cycle / multi-cycle / with-plan / with-yaml).

**Audit findings (2026-05-12 — 4 parallel subagents):**

What's BUILT and aligned with design:
- PLAN names plan file via `plan.sh:335-376 set-plan-file`; plan-guard blocks PLAN from writing the file (`plan-guard.sh:253-289`).
- EXECUTE creates .md plan file with full guard (scope + cycle-1 + Write-only + non-existent): `execute-guard.sh:746-764`.
- VERIFY edits .md plan file (`verify-guard.sh:257-265`); plan-edit tracking via `verify-tracker.sh:165-167`.
- PLAN reads plan file on cycle 2+ via active-recall gate (`plan-commit.sh:148-166`).
- Full .yaml machinery wired: schema + parser (`phase.sh:408-463 read-yaml`), phase-entry injection (`phase-init.sh:96-138`), 5 plan-side validators (`plan.sh:378-563`), 54 dedicated tests.
- Real .md+.yaml pairs co-located at `.claude/knowledge/plans/` (same basename — matches Item #10).
- AskUserQuestion-based approval trigger (`question-capture.sh:133-149`) — not chat-marker scanning (matches Item #6 trigger shape).

Divergences (G1–G3 = flow-level; G4–G9 = smaller):
- **G1 — .yaml created in cycle 1 alongside .md**, not in a new post-approval cycle. Major flow divergence from Item #7.
- **G2 — Approval = sealing, not gating.** `mark-plan-complete` archives `plan_file → completed_plan[]` and sets `plan_file=false` (`plan.sh:807-811`). No `approved` flag exists; only `user_approval` (which gates JOB-COMPLETE).
- **G3 — VERIFY cannot refine .yaml.** .yaml is immutable after cycle-1 creation. Item #7's "VERIFY refines, can send back to PLAN" applies only to .md today.
- **G4 — Approval handler lives in `job_core/hooks/question-capture*.sh`, not `phase_verify/`.** Fires in any phase, not VERIFY-only per Item #3.
- **G5 — No unified job-form taxonomy doc.** Forms exist implicitly across `plan_file` + `yaml_required` fields. "Multi-cycle without plan" not representable in current data model.
- **G6 — Phase-entry injection = one `objective:` scalar per phase.** Item #9's "stream of memories" not yet wired (planned via richer .yaml fields).
- **G7 — VERIFY plan-edit scope is loose** — allows any `plan_*.md` under `/knowledge/plans/`, not just focused job's declared plan.
- **G8 — Single-cycle jobs cannot have .yaml** (`yaml_required=true` requires multi-cycle). Possibly intentional; flag to confirm.
- **G9 — Documentation drift:** `phasic_system/docs/evolution.md:43` says ".yaml infrastructure complete but unwired" — wiring landed since (4 active sites in `phase-init.sh`).

**Overall verdict:** scaffolding is built; three core flow shapes diverge (G1, G2, G3). Reshaping to design is restructuring, not from-scratch.

**Deferred to post-ship variations:**
- Multi-plan jobs (one job, many plan files).
- Alternative ownership splits (e.g., PLAN edits plan file directly).
- Plan templating / inheritance across jobs.
- Cross-job plan references.
- Specific .yaml schema design (what fields, what injection points — evolves per job).

**Resolved (was Q1–Q4):**
- Q1 → VERIFY asks via AskUserQuestion + plan-phase script flips approval flag (not marker scanning).
- Q2 → A full new OPEVC cycle creates the .yaml (not a one-off step in some other phase).
- Q3 → VERIFY can backward to any phase per situation (not a hardcoded route).
- Q4 → Same basename side-by-side.

**Round-2 lockings (FQ1–FQ4 resolved 2026-05-12 after audit):**
- **FQ1 → New post-approval cycle.** Restructure: .md accumulates across cycles; approval triggers a new dedicated OPEVC cycle that creates the .yaml (OBSERVE+PLAN analyze, EXECUTE writes, VERIFY refines).
- **FQ2 → Reuse `mark-plan-complete` as approval.** Rewire side effects: it no longer ends the plan or nulls `plan_file`. The cycle FOLLOWING it is the .yaml creation cycle. (Sub-question: exact post-approval data shape — TBD inline with user.)
- **FQ3 → VERIFY edits .yaml.** Mirror the .md lifecycle: VERIFY refines .yaml, can backward to PLAN. `.yaml` is no longer immutable.
- **FQ4 → Root CLAUDE.md.** Add job-form taxonomy as a section in root self-knowledge so OBSERVE-cycle-1 can read it.

**Still-open (resolved or deferred):**
- Mark-plan-complete rewire → **RESOLVED in best design** (rename + no archive on approval).
- Coexistence post-yaml → **RESOLVED in best design** (.md and .yaml coexist until `seal-plan`).
- Injection wiring → **DEFERRED post-ship** (Item #9; current single-objective injection good enough for v1).
- Promotion trigger (agent-initiated vs user-initiated) → **DEFERRED** (both workable; not blocking).

### Best Design — synthesis (2026-05-12, authorized: "do what is best, not what code already has")

#### Job-object plan fields

- `plan_file`: `false` (single-cycle) or `"<name>.md"` (multi-cycle).
- `plan_state`: one of `"drafting"` | `"md_approved"` | `"yaml_drafting"` | `"yaml_ready"` | `"sealed"`. Meaningful only when `plan_file ≠ false`; defaults to `"drafting"` on plan_file set.
- `.yaml` companion derives from plan_file basename; on disk when `plan_state ∈ {yaml_drafting, yaml_ready, sealed}`.

#### State machine

```
none → drafting → drafting (loop) → md_approved → yaml_drafting → yaml_drafting (loop) → yaml_ready → (optional) sealed
```

Transitions:
- `none → drafting` — PLAN sets plan_file (cycle 1), EXECUTE creates .md.
- `drafting → drafting` — refinement cycles; VERIFY edits .md.
- `drafting → md_approved` — VERIFY asks user via AskUserQuestion `[PLAN-APPROVAL]`; on "yes" calls `plan.sh approve-md`.
- `md_approved → yaml_drafting` — next cycle; OBSERVE+PLAN analyze approved .md in CLAUDE.md, EXECUTE creates .yaml.
- `yaml_drafting → yaml_drafting` — refinement cycles; VERIFY edits .yaml; can backward to PLAN for re-analysis.
- `yaml_drafting → yaml_ready` — VERIFY asks via `[YAML-APPROVAL]`; on "yes" calls `plan.sh approve-yaml`.
- `yaml_ready → sealed` (optional) — VERIFY calls `plan.sh seal-plan`; archives plan_file to `completed_plan[]`.

#### Phase ownership (canonical)

| Action | Owner | Constraint |
|---|---|---|
| `set-plan-file` | PLAN | cycle 1 only; immutable after |
| Create .md | EXECUTE | plan_state == drafting; file non-existent |
| Edit .md | VERIFY | plan_state == drafting; focused-job-scoped |
| Read .md | OBSERVE, PLAN | cycle 2+ active-recall |
| `approve-md` | VERIFY | plan_state == drafting; AskUserQuestion answer |
| Create .yaml | EXECUTE | plan_state == md_approved; file non-existent |
| Edit .yaml | VERIFY | plan_state == yaml_drafting; focused-job-scoped |
| Inject .yaml at phase entry | `phase-init.sh` | plan_state ∈ {yaml_drafting, yaml_ready, sealed} |
| `approve-yaml` | VERIFY | plan_state == yaml_drafting; AskUserQuestion answer |
| `seal-plan` | VERIFY | plan_state == yaml_ready (optional) |

#### Approval mechanism

- **VERIFY-only** uses AskUserQuestion with `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix.
- Validator + handler live in `phase_verify` (NOT `job_core`).
- Phase-of-firing gate: these prefixes rejected outside VERIFY.
- On user "yes", VERIFY calls `plan.sh approve-{md|yaml}` which flips `plan_state`.
- No marker scanning. No `mark-plan-complete` legacy.
- **Approval does NOT archive** — only `seal-plan` archives to `completed_plan[]`.

#### Job-form taxonomy (root CLAUDE.md addition)

Three forms; OBSERVE cycle 1 classifies new jobs:

1. **Single-cycle deep** — `plan_file = false`. Freestyle, collaborative, backward+loops inside one cycle.
2. **Multi-cycle with .md plan** — `plan_file = <name>.md`, `plan_state = drafting`. Refines across cycles until approved.
3. **Multi-cycle with .yaml plan** — `plan_state ∈ {yaml_drafting, yaml_ready}`. `.yaml` injects at phase entry.

Form 3 evolves from form 2 via the approval gate.

#### Coexistence

`.md` and `.yaml` coexist until `seal-plan`. .md = human-readable accumulating prose; .yaml = parseable injection target. Both readable; both editable by VERIFY in their respective stages.

#### Storage of `plan_state` (2026-05-12 — locked)

**`plan_state` lives in `data.json` on the job object**, alongside `plan_file`. NOT in file frontmatter.

Reasons:
- State describes the **whole plan lifecycle** (spans .md + .yaml together) — job-scoped, not file-scoped.
- Fast gate-checks via `jq` (no YAML parsing in hooks).
- Consistent with existing pattern — `plan_file` already lives on the job object.
- One source of truth — avoids .md/.yaml frontmatter drift.
- Atomic `jq` updates (less race-condition risk).

Plan files (.md and .yaml) carry **identification frontmatter only** — `job:` + `plan_file:` at the top. Purpose: self-identification, not state. The .yaml already follows this pattern; .md should adopt the same.

#### Action items — Best design vs current code

| # | Action | Type | Mapped gap |
|---|---|---|---|
| A1 | Add `plan_state` field to job schema (`job_core/scripts/job.sh`) | NEW field | (new) |
| A2 | Rename `mark-plan-complete` → `approve-md`; add `approve-yaml`, `seal-plan` | rename + new | G2 |
| A3 | Approval does NOT archive plan_file (no false-set, no completed_plan[] push) | semantic change | G2 |
| A4 | Gate .yaml creation on `plan_state == md_approved` (not cycle == 1) | gate change | G1 |
| A5 | Allow VERIFY edits on .yaml when `plan_state == yaml_drafting` | guard widen | G3 |
| A6 | Move approval validator + handler from `job_core` to `phase_verify` | move + namespace | G4 |
| A7 | Phase-of-firing gate: reject `[PLAN-APPROVAL]/[YAML-APPROVAL]` outside VERIFY | new gate | G4 |
| A8 | Add "Job Forms" section to root CLAUDE.md | doc add | G5 |
| A9 | Tighten verify edit scope to focused-job `plan_file` | guard tighten | G7 |
| A10 | Update `phasic_system/docs/evolution.md` to remove "complete but unwired" stale note | doc fix | G9 |

### Blog 6 Fix Plan (2026-05-12)

Bring Blog 6 narrative into alignment with the Best Design.

**Phase 1 — Audit (1 subagent, read-only):**
- Identify all paragraphs in `06-the-markov-phasic-brain.md` touching plan files, plan_file, .yaml, plan lifecycle, plan creation/approval.
- For each: current claim → needed change type (rewrite / extend / no-op / new).
- Concept-gap list: what's missing from Blog 6 vs Best Design.
- Quick Map bullet changes needed (per phase).

**Phase 2 — Per-paragraph fixes (strict workflow per `feedback_blog_ref_tag_workflow.md`):**
- One subagent per paragraph, raw text input.
- Mirror every change in .html (`<sup class="ref-marker">` hover-tooltips).
- Preserve all 70 ref-tags; match Blog 5 density discipline.
- Expected work areas:
  - §3 OBSERVE — add job-form classification
  - §4 PLAN — plan_file naming + cycle-2+ reads
  - §5 EXECUTE — universal "EXECUTE writes files" principle; .yaml creation in dedicated post-approval cycle
  - §6 VERIFY — approval authority (.md/.yaml) + refinement on both
  - §8 Quick Map — 4 phase bullets updated
- Any factual error gets FIXED, never decorated with a ref.

**Phase 3 — Verification cascade (per `blog/CLAUDE.md` "Explicit Final Verification"):**
- Grep new strings landed in .md; old strings absent (count == 0).
- HTML mirror check.
- Transcript regenerated; artifact greps clean (chalk/blackboard 0, double-`the` 0, stray-`!` 0).
- Ref count preserved.
- Transcript left as `final: false` (user flips for paid TTS).

**Phase 4 — Hand-off to code-fix discussion (separate from blog work):**
- Present 10 action items (A1–A10) for prototype reshape.
- Get explicit user approval before any seed-agent code edit.

### Phase 1 Audit Results (2026-05-12 — subagent return)

**Counts:**
- 7 paragraphs to fix (1 NO-OP, 6 actual edits)
- 8 concept gaps (3 folded into existing fixes, 5 require NEW paragraphs)
- Quick Map: 4 phases need bullet changes

**Paragraphs to fix:**
- ¶48 — Quick Map PLAN bullets, REWRITE (move job-form decision OUT of PLAN)
- ¶64 — REWRITE: "binary single-cycle vs multi-cycle" → three forms + state machine intro
- ¶65 — EXTEND: add .md/.yaml coexistence + `plan_state` in `data.json` (folds Gaps F + H)
- ¶67 — NO-OP (altered-list paragraph, unrelated)
- ¶80 — EXTEND: VERIFY-only approval authority via AskUserQuestion (folds Gap D)
- ¶83 — EXTEND: approval-flip vs seal-plan-archive distinction (folds Gap E)
- ¶85 / ¶87 — EXTEND: backward routing is situational, not three-destination

**Concept gaps (folded vs new):**
- Gap A — three-form classification in OBSERVE cycle 1 → NEW paragraph in §3
- Gap B — universal "EXECUTE writes ALL files" principle → NEW paragraph in §5
- Gap C — .yaml as SEPARATE post-approval cycle → NEW paragraph in §5
- Gap D — VERIFY-only approval authority → fold into ¶80
- Gap E — approval ≠ sealing → fold into ¶83
- Gap F — .md/.yaml coexistence → fold into ¶65
- Gap G — `plan_state` state machine → NEW sub-paragraph in §4 (after ¶64)
- Gap H — `plan_state` in `data.json` (not frontmatter) → fold into ¶65

**Edit work order (13 operations, document-order):**
1. §3 OBSERVE — NEW paragraph (Gap A: three-form classification in cycle 1)
2. §4 PLAN — ¶64 REWRITE (binary → three forms + state-machine intro)
3. §4 PLAN — ¶65 EXTEND (coexistence + data.json storage)
4. §4 PLAN — NEW sub-paragraph (Gap G: state machine detail)
5. §5 EXECUTE — NEW paragraph (Gap B: universal "EXECUTE writes ALL files")
6. §5 EXECUTE — NEW paragraph (Gap C: .yaml as separate post-approval cycle)
7. §6 VERIFY — ¶80 EXTEND (approval via AskUserQuestion)
8. §6 VERIFY — ¶83 EXTEND (approval flip vs seal-plan archive)
9. §6 VERIFY — ¶85+¶87 EXTEND (backward routing — situational)
10. Quick Map — ¶47 OBSERVE (add job-form-classification bullet)
11. Quick Map — ¶48 PLAN (rewrite bullet 1: plan_file naming, not form decision)
12. Quick Map — ¶49 EXECUTE (add universal-file-creator bullet)
13. Quick Map — ¶50 VERIFY (add 2 bullets + soften routing bullet)

Each operation = one subagent dispatch with raw paragraph context + Best Design intent + Blog 6 voice constraints + ref-tag conventions. Then I apply Edit to .md and mirror in .html.

### Dimension 2: Job-graph ownership (locked 2026-05-12)

**Operating principle (user-locked):** "All job creation (dep or not) is for CONDENSE. Always think what phase has the right context for the job." Lifecycle symmetry: where one phase ADDS state, another phase OWNS the REMOVAL — chosen by which phase has the right context to make that judgment.

**Verified design:**

| Operation | Owner phase | Why |
|---|---|---|
| `job.sh create-active` (top-level creation) | `prompt-handler.sh` always-on hook (hook-internal, bypasses phase guards) | User's prompt is the trigger; agent never calls this |
| `job.sh create` / `create-dependent` (dep creation) | CONDENSE step 3 via `condense-job-creator` subagent (markers); CONDENSE agent-direct with `--out-of-scope` gated | CONDENSE has cycle-wide context for what follow-up work is needed |
| `job.sh add-dependency` | CONDENSE (`condense-guard.sh:314`) | Same — graph additions during cycle synthesis |
| `job.sh remove-dependency` | VERIFY (`verify-guard.sh:360`) | VERIFY audits the focused job; can discover a declared dep is unneeded |
| `job.sh activate / focus / pause` | IDLE (`phase-gate.sh:96`) | Between-cycle lifecycle management; user + agent collaborate |
| `job.sh complete / approve` | IDLE + CONDENSE; `approve` is hook-only fired by `[JOB-COMPLETE]` answer | Completion is judgment-bearing; happens between productive phases |
| `job.sh show / focused / list` | All phases (read-only) | Universal context query |
| `job.sh update --heal` (completed-job repair) | Wherever update is allowed (IDLE + CONDENSE) | Cycle-error healing; flag-based bypass of immutability check |

**GMODE is the documented escape hatch.** Phase guards check `if current_phase != my_phase: exit 0` — when `current_phase == "gmode"`, ALL guards skip. The agent can call any `job.sh` command in GMODE. This is intentional: GMODE is the deliberate user-gated escape (≥100-word `[GMODE]` justification). Job creation in GMODE is debt-laden: the agent has explicitly bypassed CONDENSE's cycle-wide context and accepts the consequence. Not an enforcement gap, an admitted exception.

**Code-blog alignment** (2026-05-12):
- `job_core/scripts/job.sh` — added `remove-dependency` subcommand (symmetric with `add-dependency`); added `--heal` flag on `update`.
- `phase-gate.sh:96` (IDLE) — dropped `create / create-dependent / add-dependency`.
- `verify-guard.sh:360` — added `remove-dependency` to allowlist; added explicit BLOCK for create/create-dependent/add-dependency before the broad `bash .* scripts/` regex (which was a pre-existing OPTION A escape vector).
- `condense-guard.sh:314` — added `add-dependency` (was missing).
- 5 test files updated; 311+ assertions green.
- `phase_verify/CLAUDE.md` OPTION A pattern marked RETIRED; `phase_condense/CLAUDE.md` allowlist table updated; `phasic_system/CLAUDE.md` command table extended.

### Future dimensions (named, not yet investigated)

- Voice.xml update ownership (claim: CONDENSE only)
- Subagent-definition update ownership (claim: CONDENSE only)
- Knowledge-file authoring ownership (claim: CONDENSE only)
- Section-marker footer ownership (claim: each phase owns its footer)
- CLAUDE.md edit scoping via altered list (claim: every phase writes; execute-guard enforces scope)
- Cycle counter increment ownership (which phase triggers `phase.sh advance` cycle bump?)

## Current Posts

Slug column shows the **prefixed filename** (`NN-slug`). All blog files are numbered.

| # | Slug | Title | Status |
|---|------|-------|--------|
| 1 | `01-llms-are-not-the-agents` | LLMs Are Not the Agents | **FINAL** |
| 2 | `02-we-could-have-had-agi` | We Could Have Had AGI By Now | **FINAL** |
| 3 | `03-your-brain-was-never-built-for-this` | Your Brain Was Never Built for This | **FINAL** |
| 3.1 | `03_1-the-folder-is-alive` | The Folder Is Alive (interlude) | **FINAL** |
| 4 | `04-the-language-of-agents` | The Language of Agents | **FINAL** |
| 5 | `05-the-always-on-digital-cortex` | The Always-On Digital Cortex (monolith — superseded by 8-sub-essay split 2026-05-14) | **superseded** — file stays on disk for URL preservation; not in sidebar/sitemap/feed |
| 5.1 | `05_1-the-two-layer-foundation` | Pt 1: The Two-Layer Foundation | **drafting v0.4.0** — ~2,441w / 9 min · 9 refs · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.4.0 iter-16.a MED fix: L134 footer-byline "first of five always-on plugin deep-dives" → "first of the always-on plugin deep-dives" (Rule 1 count-as-noun; matches L41 "currently five" parenthetical pattern). |
| 5.2 | `05_2-plugin-integrity` | Pt 2: `plugin_integrity` — Plugin Edit Safety | **drafting v0.4.0** — ~2,059w / 8 min · 7 refs · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.4.0 iter-16.a HIGH+MED fixes: L19 "five plugins, currently" → "the always-on plugins (currently five in the prototype)" (Rule 1 count-as-noun, HIGH); L79 body "The current registry holds ten entries" → "The current registry is short; your seed's will hold more" (Rule 1 count-as-noun, MED — ten-entry list preserved in ref-tag tooltip). |
| 5.3 | `05_3-brain-guard` | Pt 3: `brain_guard` — Context Window Discipline | **drafting v0.2.0** — ~1,700w / 8 min · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.2.0 iter-14.a MED fix: L70 (154w) dispatch-mechanic density wall split (dispatch-mechanism intro + grace-window-and-future-API). |
| 5.4 | `05_4-job-core` | Pt 4: `job_core` — Job Lifecycle | **drafting v0.3.0** — ~1,500w / 7 min · HTML built · transcript regen'd (final:false) · audio pending. v0.3.0 iter-16.b HIGH+LOW fixes: L35 schema ref-tag corrected to 3-field `{user_approval, plugin_lock_approval, depends_on}` + `plan_state` (A14 2026-05-14 schema reality); L72 "ships five — one per OPEVC phase" → "ships one per OPEVC phase" per Rule 1 categorical. v0.2.0 iter-14.b fixes: ref-tag line range L25 corrected (50-74 → 49-74); shared-key paragraph split L33 (219w → 104/115); refusal-to-stop paragraph split L52 (201w → 91/124). |
| 5.5 | `05_5-interaction-summary` | Pt 5: `interaction_summary` — Mega-Prompt Compression | **drafting v0.4.0** — ~1,050w / 5 min · HTML built · transcript regen'd (final:false) · audio pending. v0.4.0 iter-16.b HIGH+MED fixes: L45 bypass-vs-registry conflation cleared — body now distinguishes bypass list from question_discipline registry ("overlaps with but is not identical"), ref-tag enumerates the actual 10 BYPASS_PREFIXES from `prefix-registry.conf:20` and names the 1-element diffs (`PENDING-JOB` bypassed-not-registered; `REPORT-TO-UPSTREAM` registered-not-bypassed); L45 transition smell fixed with "even with the productive-tool guard tripped" half-clause; L61 customize-section "and the other registered ceremonies" → "a handful of others on the bypass list" + new explicit-two-decisions note. |
| 5.6 | `05_6-question-discipline` | Pt 6: `question_discipline` — Structured Questions | **drafting v0.4.0** — ~1,220w / 5 min · 4 refs · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.4.0 iter-16.b MED+LOW fixes: L31 subagent-bypass post-split stranded ¶ extended with "no matter which plugin's hook is firing or which phase the agent is in" half-sentence to carry its own weight; L39 [POINT-BOOST] format-only claim spot-verified against `phasic_system/hooks/point-boost.sh:66-74` (anchor + sed-extract format; no body word floor) — verdict accurate. |
| 5.7 | `05_7-claude-md-hierarchy` | Pt 7: The CLAUDE.md Hierarchy | **drafting v0.3.0** — ~3,300w / 12 min · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.3.0 iter-16.c HIGH+MED fixes: L33 fabricated quote replaced with truthful section-name pointer (root CLAUDE.md Identity section + `.claude/CLAUDE.md` Components section — old fake quote "Agent: Hadosh Academy Website Manager..." did not exist in current root CLAUDE.md); L35 brittle four-line citation (530,537,544,551) age-proofed to "footer-anchor block" pointer; L29/L132/L150 line-range refs (`:443`, `:289-298`, `:129-134`) all age-proofed to section-name pointers — mirrors iter-15.c L140 pattern. |
| 5.8 | `05_8-historian-ratchet` | Pt 8: The Historian Ratchet | **drafting v0.3.0** — ~2,500w / 10 min · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.3.0 iter-16.c MED fixes: L103 ref `CLAUDE.md:381-384` age-proofed to "Spatial level: bullets under Core Principle: Compartmentalization" section pointer; L105 ref `CLAUDE.md:212` age-proofed to "JOB.phase operation under Specialized Operations" section pointer — mirrors iter-15.c L140 pattern. |
| 5.9 | `05_9-customization-guardrail` | Pt 9: The Customization Guardrail | **drafting v0.4.0** — ~2,400w / 10 min · 5 refs · HTML rebuilt · transcript regen'd (final:false) · audio pending. v0.4.0 iter-16.c HIGH fix: L76 `customization-trigger-patterns` ref-tag rewritten — prior synthesis of triggers (3-occurrence threshold, COACHING_IDS pool, workflow-not-supported) did not appear in `plugin-lock-privilege.md`; new ref cites the file's actual "Why both, not one" section (frames user-approved-job route as "for planned work the agent initiates" with the verbatim `secrets_guard` example), keeps the closing architectural-fact summary. |
| 6 | `06-the-markov-phasic-brain` | The Markov Phasic Brain (monolith — superseded by 10-sub-essay split 2026-05-15) | **superseded** — file stays on disk for URL preservation; not in sidebar/sitemap/feed primary listing |
| 6.1 | `06_1-phasic-foundation` | Pt 1: Phasic Foundation | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.2 | `06_2-discipline-and-map` | Pt 2: The Discipline and the Map | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.3 | `06_3-observe` | Pt 3: OBSERVE — Read Wide, Write Once | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.4 | `06_4-plan` | Pt 4: PLAN — Decide, Then Lock | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.5 | `06_5-execute` | Pt 5: EXECUTE — Build, in Scope, in Steps | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.6 | `06_6-verify` | Pt 6: VERIFY — Independent Eyes | **drafting v0.1.0** — HTML built · transcript regen'd (final:false) · audio pending |
| 6.7 | `06_7-condense` | Pt 7: CONDENSE — The Cognitive Organ | **drafting v0.1.0** — ~1,397w / 11 min · 17 refs · HTML built · transcript regen'd (final:false) · audio pending |
| 6.8 | `06_8-backward-multiplier` | Pt 8: The Inverse Multiplier (slug preserved for URL) | **drafting v0.1.0** — ~1,683w / 11 min · 8 refs · HTML built · transcript regen'd (final:false) · audio pending |
| 6.9 | `06_9-gmode` | Pt 9: GMODE — The Off-Cycle Lane | **drafting v0.1.0** — ~2,114w / 8 min · 5 refs · HTML built · transcript regen'd (final:false) · audio pending |
| 6.10 | `06_10-plan-state-machine` | Pt 10: The Plan-State Machine — Long-Horizon Memory (Tier-3 closer) | **drafting v0.1.0** — ~2,688w / 8 min · 5 refs · HTML built · transcript regen'd (final:false) · audio pending |
| 7 | `07-the-plugin-kit` | The Plugin Kit (working) | **drafting v0.15.0** — 48 refs · HTML built 2026-05-13 via `tools/generate_blog_html.py` · transcript ready (final:false) · audio pending · og:image pending |
| 8 | `08-from-apprentice-to-architect` | From Apprentice to Architect (working) | **drafting v0.12.0** — 21 refs · HTML built 2026-05-13 · transcript ready (final:false) · audio pending · og:image pending |

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
