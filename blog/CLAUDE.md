# blog/ — Blog Posts Working Memory
**Version:** v0.16.0

> **De-bloat 2026-07-15:** reference/history/planning bulk moved to `.claude/knowledge/`; build/transcript/audio/publish procedures live in the `blog-update` skill. This file keeps only always-on blog facts + authoring standards. See **Reference & procedures moved out** at the foot.

## Layout

- **Part-1 essays** (`01..04` + `03_1` interlude): `blog/<slug>.{md,html,transcript.md}` at this directory root.
- **B5 mini-series** (`05_1..05_9`): `blog/b5/<slug>.{md,html,transcript.md}` — moved 2026-05-18. Images at `blog/b5/images/`. Series working memory at `blog/b5/CLAUDE.md`.
- **B6 mini-series** (`06_1..06_10`): `blog/b6/<slug>.{md,html,transcript.md}` — moved 2026-05-19. Images at `blog/b6/images/`. Series working memory at `blog/b6/CLAUDE.md`.
- **B7 mini-series** (`07_1..07_9`): `blog/b7/<slug>.{md,html,transcript.md}` — moved 2026-05-18 (Commit F).
- **B8 mini-series** (`08_1..08_9`): `blog/b8/<slug>.{md,html,transcript.md}` — moved 2026-05-18 (Commit G).
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

### Ref-tag review job — OBSERVE notes (job 1784416070407796247, 2026-07-18)

**Job:** Stage-1 collaborative. Find + verify **5 problematic ref-tags** across b5..b8, spanning 4 categories (PARAGRAPH / CONTEXT-SYNC / CODE / BLOG). Deliverable = flags w/ evidence + 1-line fix, **NOT applied fixes**. NEVER edit `.claude/plugins` (flag + pending job instead).

**Ground truth established (from reading blog CLAUDE.md hierarchy):**
- **ref-tag IS canonical vocab** — glossed in `.claude/knowledge/blog-seed-vocabulary.md`. Canonical design ground truth = `hadosh_academy/.claude/context/INDEX.md`. **Rule 40:** essay prose conflicting with a `[consolidated]` term = the prose is the drift.
- **.md vs .html:** `.html` = **source of truth** (git-tracked). `.md` = **gitignored, local-only**. Flow syncs both ways → BLOG-category problems = `.md`↔`.html` disagreement + malformed tags.
- **`.claude/knowledge/blog-code-alignment-manifest.md`** = phase-ownership blog/code alignment manifest — DIRECTLY relevant to CODE-category verification. READ IT.
- **Banned-alias sweep** (blog/CLAUDE.md "Canonical Vocabulary" + `ledger.md`): `Form 1/2/3`, `sibling job`, `seal/sealed`, `[PLAN-APPROVAL]`, `stage-aware deflation`, etc. — known drift patterns; a ref-tag claim using a banned alias = candidate.
- **Review-depth signal:** B7/B8 GOAL ACHIEVED (more reviewed); **B5 + early-B6 still drafting** (LESS reviewed → likelier un-verified drift). Note: website-root CLAUDE.md says B5 9/9 GOAL — internal disagreement, NOT my target (not a ref-tag).

**Rhythm:** subagents inventory (running) → I verify each candidate vs live context+code+html → flag only proven disagreements.

**PRIOR LINEAGE (this is NOT a fresh job form).** Live silo: `.claude/knowledge/ref-tag-review/` (backlog-status.md + CLAUDE.md + lessons). Ref-tag anatomy authority = `.claude/context/identity.md` `### ref-tag [consolidated]`. Corpus ≈ 621 tags across 37 essays. **Binding policies:** stable pointers ONLY (file + section/function — **line numbers BANNED, always**); stale tag → REDUCE to stable content (never empty, never re-baked volatile numbers); 80% density = SOFT target; **MIRROR INVARIANT** (`.md` + `.html` byte-identical on the tag); ground-truth EVERY claim main-session (subagents fetch, seed adjudicates — they fabricate citations); `[WAITING]` for genuine design forks (this user ALSO wants judgment calls surfaced + Stage-1 needs ≥3/phase → surface REAL forks, not trivial fixes).

**Backlog map — what's ALREADY known (avoid re-flagging; hunt for NEW drift):**
- **B-LINE** (banned `file:LINE` middle-field): b6/b7/b8 **VERIFIED CLEAN 2026-07-17**; b5 05_1/05_2/05_6–05_9 DONE; **b5 05_3–05_5 (18 tags) OPEN**.
- **B-B5** (b5/05_2 test-counts ×2 + prefix-registry eight→ten): **OPEN**.
- **B6-SWEEP** (b6 full 277-tag deep pass): **OPEN** — largest under-reviewed surface.
- B-STUB (job_archiver/job_blocker caveat), B-PRIN, B-CNT, B-IMG, B-B7V: **RESOLVED/verified**.
- **Substrate (FLAG ONLY, never fix — routed to job 1784284305940794400):** B-IMGHTML (`generate_blog_html.py` `*`→`<em>` mangles `observe-* (13)` in rendered html), B-FOOTGUN, B-VOICE, B-EXVOICE, B-COMPACT, B-REFRESHER, B-HEARTBEAT, B-ANCHORHEALS.

**Render tooling:** `hadi-nayebi.github.io/.claude/tools/generate_blog_html.py` transforms `*[ref: ...]*` → hover-ⓘ `ref-marker` superscript (`title=` carries the claim); transcript generator strips tags. `.md` gitignored → enumerate via main-session Read on explicit paths, not Glob.

**Candidate-hunting plan:** target under-reviewed b5 + b6. For each candidate, cheapest live check first (Read real context file / real plugin code / diff .md vs .html). Assemble 5 spanning PARAGRAPH / CONTEXT-SYNC / CODE / BLOG (+1 richest). Per-series hunting notes → `blog/b5/CLAUDE.md` + `blog/b6/CLAUDE.md`.

**CANDIDATE SLATE (running — NONE flagged until MAIN-SESSION ground-truthed; 3 verify agents dispatched 2026-07-18):**
| # | Category | Essay / tag | Mismatch hypothesis | Verify via |
|---|---|---|---|---|
| C1 | PARAGRAPH | b5/05_3-brain-guard body | tags fixed to %-of-window (F1) but BODY prose may still teach accrual/baseline (tags-only fix; pending job 1784185778987757548) | Read 05_3 body vs its tag + brain-memory.md |
| C2 | CONTEXT-SYNC/CODE | b5/05_2-plugin-integrity test-counts + prefix-registry "eight→ten" (B-B5 OPEN) | blog numbers disagree w/ live suites / PREFIX_REGISTRY | grep live PASS + PREFIX_REGISTRY |
| C3 | CODE | b6/06_3-observe `observe-direct-action-budget-mechanizes-80-20` | claimed budget logic may not exist in observe-guard.sh | grep observe-guard.sh |
| C4 | CODE | b6/06_5-execute `execute-checkpoint-vs-forward-commit` | --force prefix logic drift | grep execute-commit.sh |
| C5 | CONTEXT-SYNC | b6/06_10 `stage-2-md-plan` | on-disk name plan.md vs <name>.md | job-stages-plans.md + plan.sh |
| C6 | BLOG | TBD — .md↔.html mirror mismatch / malformed tag | tag differs between surfaces / bad field count | diff .md tag vs .html title= |

**JUDGMENT-CALL forming → [WAITING] (scope fork):** most of the corpus is ALREADY reviewed + backlog-tracked. Ask user: should the 5 flags prefer genuinely NEW un-flagged drift, OR may known-but-unfixed backlog items (b5 body-prose staleness, B-B5 test-counts) count? Surface once ≥1 candidate is ground-truthed, so the question is concrete.

**VERIFICATION RESULTS (2026-07-18):**
- **C1 DROPPED (clean):** 05_3-brain-guard — all 4 surfaces teach %-of-window, no accrual residue.
- **C3 DROPPED (clean):** 06_3-observe `observe-direct-action-budget-mechanizes-80-20` — matches observe-guard.sh `has_direct_action_budget` (start 5, −1/read, +3/dispatch, live-from-entry).
- **C4 DROPPED (clean):** 06_5-execute `execute-checkpoint-vs-forward-commit` — matches execute-commit.sh (`--force`→"execute:" advance; else "execute: [intermediate]" stay).
- **★C2 STRONG (needs my ground-truth read):** 05_2-plugin-integrity tag `prefix-registry-current-entries` (~L79 .md / L166 .html) claims **9 prefixes**, list OMITS `[COMMAND-APPROVE]`. Subagent found: live `question-discipline-gate.sh` PREFIX_REGISTRY = **10**; `.claude/context/prefixed-questions.md` L71 = "10 active prefixes"; `plugins/CLAUDE.md` L26 = 10. → **CODE + CONTEXT-SYNC** drift (blog under-counts by 1). D2: subagent report conflated this tag with the test-count tag — MUST main-session-confirm all 3 sources before flag.
- **BONUS weak (skip):** test-count tag "725 tests/24 suites" MATCHES plugins/CLAUDE.md; only 25 test FILES vs "24 suites" — "suite"≠"file", ambiguous.
- **C6 BLOG:** hunter agent running (asterisk/markdown-mangle + malformed-tag sweep of b6+b7).

**Categories covered so far:** C2 → CODE (confirmed). Still NEED: PARAGRAPH, BLOG, a distinct CONTEXT-SYNC, +1 richest.

**BLOG-hunter result (2026-07-18):** b6+b7 ref-tag mirrors ALL CLEAN — 0 `.md`↔`.html` mismatches, 0 markdown-mangling (asterisks/backticks/brackets render fine inside `title=`), 0 malformed tags (all exactly 2 pipes). Independently re-confirmed C2. → easy BLOG angle (mirror break) is a DEAD END in b6/b7. **Pivot BLOG → DEAD-POINTER hunt** (user's BLOG def includes "a dead pointer"): a ref-tag whose cited `.claude/...` path no longer resolves. (b5/b8 not yet mirror-scanned.)
- **C2 category = CODE** (tag cites exact code array; code has 10 not 9). Keep a DISTINCT CONTEXT-SYNC (blog-fact-vs-context, code not the pivot).

**CONFIRMED FINAL SLATE (main-session verified, 2026-07-18):**
1. **CONTEXT-SYNC — C2 (sharp, known-backlog).** `blog/b5/05_2-plugin-integrity.md:79` tag `prefix-registry-current-entries` says "**9 active prefixes**" (omits `[COMMAND-APPROVE]`); ground truth `.claude/context/prefixed-questions.md:71` = "**10 active prefixes**". Fix: 9→10, add `[COMMAND-APPROVE]`, mirror .md+.html.
2. **CODE — 06_2b (sharp, NEW).** `blog/b6/06_2b-the-phase-map.md:28` tag `idle-bash-allowlist-named-scripts` claims IDLE `job.sh` allowlist = `(show|focused|list|update|activate|focus|pause|complete|approve)` [9]; live `phase-gate.sh:198` = `(show|focused|list|activate|focus|pause)` [6] — over-lists update/complete/approve. (NB: essay prose L26 + phasic_system CLAUDE.md "Idle Allowed Activities" table ALSO list these → the drift may originate upstream; my flag = the tag-vs-phase-gate.sh code mismatch. Fix: correct the tag's enumerated list to the 6 real verbs; file pending job for the plugin-doc/table drift, do NOT edit plugin.)
3. **BLOG — 08_4 (soft, NEW).** `blog/b8/08_4-soft-hard-migration.md:19` tag `brain-maturation-soft-to-hard-canonical` middle field = `CLAUDE.md "Brain Maturation Model" section` — NO directory prefix; the named section+flow exists in ROOT `CLAUDE.md`, while `.claude/CLAUDE.md` has a DIFFERENT "Brain Maturation" section → ambiguous pointer. Fix: qualify as `root CLAUDE.md`.

**GAPS / FINAL STATE (2026-07-18):** no clean **PARAGRAPH** anywhere verified (b5 all, b6 all, b7 07_1-07_7, b8 sampled — prose consistent w/ tags). b5 line-number backlog = STALE (already fixed). **b7 PARAGRAPH sweep: 07_1-07_7 CLEAN**, 07_8/07_9 unread (subagent context ceiling). **Corpus-wide count-sweep: FAILED** — subagent hit its own 40% context gate, no finds (highest-value counts already main-session-checked: prefix, test-count 725/24, voice 57/14, idle-allowlist — only C2 + 06_2b drift). Un-verified residue: b7/07_8, 07_9, b6/06_7b (small). **HONEST DELIVERABLE = 3 verified diverse flags** (CONTEXT-SYNC C2 + CODE 06_2b + BLOG 08_4-soft); PARAGRAPH genuinely absent; 5th not found w/o padding. Both my context + subagent context are deep → pushing the residue needs a compaction. Surfacing to user as [WAITING]: lock honest 3-4 vs compact-and-push-for-5.

**USER DECISION (2026-07-18):** scope = **"Best real 5 (mixed)"** — flag the 5 strongest REAL problems (incl. known-backlog + soft), each labeled by provenance; prioritize evidence + diversity. NOT a license to invent — memory bans padding.

**ROUND 3 verification (main-session, 2026-07-18):**
- **05_7 (PARAGRAPH lead) → CLEAN.** Read full essay; no stale count in body; tags accurate. Dropped.
- **08_2 stage-3 tag (CONTEXT-SYNC lead) → CLEAN.** Prose correctly says Stage 3 is "a valid starting format... rather than graduating from Stage-2... not a state-flip, not a dependent" — matches job-stages-plans.md L23. Hunter's "framing drift" = false alarm. Dropped.
- **C5 (plan.md vs <name>.md naming) → CLEAN.** job-stages-plans.md L21+L114 ITSELF says `set-plan-file <name>.md` yet file lives at `.claude/jobs/<id>/plan.md` — essays faithfully reproduce the glossary. Not a drift.

**HONEST STATE:** after b5/b6/b7/b8 verification, **C2 is the ONLY sharp confirmed drift** (CODE). Corpus is thoroughly swept. Remaining REAL problems to draw from are KNOWN-OPEN backlog: **B-LINE** (b5 05_3-05_5, 18 line-number pointers OPEN — mis-formatted/volatile tags) + **B6-SWEEP** (277 tags never deep-content-verified). Plan: (1) proper independent b6 content sweep for a PARAGRAPH/CONTEXT-SYNC; (2) verify a B-LINE pointer (BLOG/mis-format slot); (3) await b8 BLOG scan. Assemble the honest best slate — labeled — even if it lands under 5; report the real per-category count.

**HUNT RESULTS ROUND 2 (2026-07-18):**
- **Dead-pointer scan (BLOG) → CLEAN.** All ~50+ distinct `.claude/` paths cited in b5/b6/b7-sample ref-tags resolve. (b8 + full b7 not scanned.) No BLOG dead-pointer candidate. (Aside: working-memory CLAUDE.md files cite non-existent `.claude/agents/blog-*-auditor.md`, but those are NOT published-essay ref-tags → not in scope.)
- **b7/b8 PARAGRAPH+CONTEXT-SYNC → 3 WEAK candidates, none clean:** [A] 08_2 "chunked from stage 1" = IMAGE-label-vs-prose (not a ref-tag); [B] 08_2 `stage-3-graduation-not-dependent` = framing drift only (claim correct); [B3] 08_4 brain-maturation pointer = murky/self-contradictory. NOT flag-worthy at the user's 100% bar.
- **HONEST PICTURE:** corpus is thoroughly reviewed. Only **C2 (CODE)** is a clean solid flag — and it's the KNOWN B-B5 backlog item. b6 277-tag deep CONTENT sweep now IN FLIGHT (highest-churn essays 06_8 points-retirement / 06_7 condense / 06_4+06_10b plan-lifecycle) — the last un-swept surface the user pointed at. If it yields clean finds → categories fill. If not → present truthful slate + scope [WAITING] (accept known/softer vs authorize deeper dig vs target may be <5).

**★ DELIVERABLE (partially SUPERSEDED — see USER RULING below).** The 3 DRIFT flags in "CONFIRMED FINAL SLATE" stay LOCKED. But the "close-out only / no more hunting / finding CLOSED" framing is **SUPERSEDED**: the job was EXPANDED (2026-07-18) — finding phase is RE-OPENED for a new MISSING category. Close-out path (still valid): OBSERVE exit (re-dispatch blindspot-finder for family-c) → PLAN (`set-plan-file false`, Stage 1) → EXECUTE (apply BOTH drift fixes + missing anchors) → VERIFY → CONDENSE (**[PENDING-JOB]** for 06_2b plugin-doc/code reconciliation + `.claude/knowledge/ref-tag-review/backlog-status.md` silo update + `[JOB-COMPLETE]`).

**★★ USER RULING (2026-07-18) — apply-vs-report RESOLVED + JOB EXPANDED. This SUPERSEDES the "close-out only / no more hunting" framing above.**

**(A) Apply-vs-report = APPLY inline (option 1).** Verbatim: *"APPLY the 3 verified drift fixes inline (your option 1). A ref-tag review's whole nature is to SYNC blog <-> code <-> context inline — fixing drifted paragraphs/tags is the deliverable, not a separate pass. 'Flags not applied fixes' was under-scoped; my standing fix-it-now standard governs — authorized website drift never gets left under the rug. Keep filing the [PENDING-JOB] for the 06_2b plugin-doc/code reconciliation (never edit the plugin)."*

**(B) STAY IN OBSERVE — expand before EXECUTE. NEW 5th category = MISSING ref-tags.** Verbatim: *"the corpus is NOT clean, so stay in OBSERVE and expand before you advance to EXECUTE. Your 3 flags all concern DRIFT in EXISTING tags; that is only half the surface. Add a 5th category: MISSING ref-tags."*

**MISSING definition (verbatim):** *"A ref-tag is an ANCHOR — it links a website spot (a blog paragraph, a diagram) to its implementation AND its ground-truth context, so that spot can be traced and kept in sync. A paragraph that makes an anchor-worthy claim — one that SHOULD be traceable to code/context — but carries NO ref-tag is itself a problem: an un-anchored claim. That surface is wide open and untouched."*

**OBSERVE-pass instructions (verbatim, 5 points):**
1. *"KEEP your 3 locked flags. ADD MISSING as a 5th category on top of them."*
2. *"Discover paragraphs whose claims warrant an anchor but lack one. For each, specify the anchor you would add — slug | code-path-or-context-anchor | claim — verified against the real code/context it should point to. (Inserting the tag is EXECUTE work; here you DISCOVER + specify precisely.)"*
3. *"Focus on the blogs — 41 blog files carry ref-tags; diagram sources do not yet (a future surface). Note an obvious diagram candidate only if you happen to see one; do not go hunting there."*
4. *"Prioritize the highest-value missing anchors — claims about real mechanisms a reader would want to trace. Aim for genuinely useful coverage, not a fixed count."*
5. *"Label every finding by category (PARAGRAPH / CONTEXT-SYNC / CODE / BLOG / MISSING, and new/known/soft)."*

**THEN (verbatim):** *"advance to EXECUTE and apply BOTH: the 3 authorized drift fixes AND the missing anchors you specified. Real operational work — proceed."*

**Consequence for method:** finding phase RE-OPENED for MISSING ONLY (the 3 DRIFT flags stay locked — do NOT re-litigate them). MISSING is a GENUINELY NEW category — the entire `backlog-status.md` silo (B-LINE, B-B5, B6-SWEEP, substrate) is about DRIFT in existing tags, never un-anchored claims. Discovery via observe-* subagents per series (80/20); MAIN-SESSION verifies each proposed anchor TARGET exists in real code/context before locking it (D2 — subagents fabricate; note `blog-code-alignment-manifest.md` AND `blog-status-history.md` are BOTH stale dead pointers, do not exist). Each missing-anchor spec = `slug | code-path-or-context-anchor | claim`. EXECUTE will apply the 3 drift fixes (mirror .md+.html each) PLUS insert the specified missing anchors (each in .md + .html, mirror invariant).

### DRIFT-FIX EXECUTE TARGETS (the 3 locked flags → concrete edits; synthesis for EXECUTE)

Each is a MIRROR pair — edit BOTH the `.md` and the `.html` `title=` so they stay byte-identical (MIRROR INVARIANT). Line numbers are approximate (re-locate by tag slug at EXECUTE, do not blind-edit a line #).

1. **C2 (CONTEXT-SYNC, known B-B5).** `blog/b5/05_2-plugin-integrity.md` + `.html`, tag slug `prefix-registry-current-entries`. Change claim **"9 active prefixes"** → **"10 active prefixes"** and add `[COMMAND-APPROVE]` to the enumerated list. Ground truth = `.claude/context/prefixed-questions.md:71` ("10 active prefixes") + live `question-discipline-gate.sh` PREFIX_REGISTRY (10 entries).
2. **06_2b (CODE, new).** `blog/b6/06_2b-the-phase-map.md` + `.html`, tag slug `idle-bash-allowlist-named-scripts`. Change enumerated idle `job.sh` verb list `(show|focused|list|update|activate|focus|pause|complete|approve)` [9] → `(show|focused|list|activate|focus|pause)` [6] to match live `phase-gate.sh:198`. **Separately** → `[PENDING-JOB]` (CONDENSE) for the plugin-doc/code reconciliation: essay prose (~L26) + `phasic_system` CLAUDE.md "Idle-Allowed-Activities" table ALSO over-list the 9 — genuine which-surface-is-ground-truth architect question; route to/sibling of substrate job `1784284305940794400`; NEVER edit the plugin.
3. **08_4 (BLOG, soft/new).** `blog/b8/08_4-soft-hard-migration.md` + `.html`, tag slug `brain-maturation-soft-to-hard-canonical`. Qualify the dir-ambiguous middle-field pointer as **`root CLAUDE.md "Brain Maturation Model"`** (the section+flow lives in ROOT `CLAUDE.md`; `.claude/CLAUDE.md` has a DIFFERENT "Brain Maturation" section → disambiguate).

**Substrate-routing note:** standalone substrate job `1784284305940794400` already collects "noticed but not fixed inline" plugin/tooling drifts (B-FOOTGUN, B-IMGHTML, B-VOICE, etc.) — the 06_2b reconciliation is the same shape and should join it (as a dependent or a linked note), decided at CONDENSE.

### MISSING-anchor discovery — WAVE 1 results + drift-target D2 confirms (2026-07-18)

**Both drift-fix TARGETS D2-confirmed main-session:**
- **06_2b** → live `phasic_system/hooks/phase-gate.sh:198` IDLE `job.sh` Bash whitelist = EXACTLY 6 verbs `(show|focused|list|activate|focus|pause)`. Blog tag claims 9 (adds `update|complete|approve`) → DRIFT CONFIRMED, fix tag → 6. (The `phasic_system/CLAUDE.md` "Idle-Allowed-Activities" table over-lists update/complete/etc., but it mixes AskUserQuestion/hook-driven capabilities with the Bash whitelist; the tag enumerates the BASH allowlist → 6 is ground truth. Table breadth = the substrate inconsistency → `[PENDING-JOB]`.)
- **C2** → `prefixed-questions.md:71` = "the canonical registry holds the **10 active prefixes**" incl. `[COMMAND-APPROVE]`. Fix 9→10 CONFIRMED.

**WAVE-1 MISSING discovery (4 observe-codebase-explorer, per series) — consistent signal: GOAL'd series are EXCEPTIONALLY well-anchored** (nearly every mechanism claim already tagged); zero solid new MISSING in the scanned set. BUT coverage INCOMPLETE — every agent hit a context/depth ceiling:
- **b7:** 9/9 read, but 07_4–09 depth-limited (~first 200-250 lines only); 0 missing in scanned.
- **b6:** 8/13 read (06_1,2,3,4,5,8,9,10); 0 missing. SKIPPED: **06_6, 06_7, 06_7b, 06_10b** (verify/condense — mechanism-dense).
- **b5:** only 05_1–05_3 read (agent drifted into b6, hit 25% ceiling); 0 solid missing. **UNSCANNED: 05_4–05_9** (interaction_summary + compaction/heartbeat — mechanism-dense, LESS-reviewed = likeliest yield).
- **b8:** NOT scanned (0/9).
- **1 WEAK candidate** (hold for adjudication): b6/06_3 "the *assumption-driven plan*" OBSERVE-purpose claim → could anchor `.claude/context/opevc-phases.md` OBSERVE; MEDIUM (conceptual).

**RECALIBRATION for wave 2:** "anchor-worthy" = traceable to code **OR context/glossary** (a ref-tag anchors to `.claude/context/` terms too, not only code) — include architectural/conceptual claims that map to a glossary term; do NOT dismiss as "not mechanism-specific." Use TIGHT slices (1–2 essays/agent) to beat the context ceiling; no silent truncation.

**Wave-2 priority (highest-value unscanned first):** (1) b5 05_4–09; (2) b6 06_6/06_7/06_7b/06_10b; (3) b8 08_1–09. b7 07_4–09 full-depth = DEFERRED low-priority (GOAL'd + shallow-clean; disclosed residual).

**Honest interim picture:** MISSING is likely SCARCER than "wide open" in the GOAL'd series; the real yield (if any) sits in the under-reviewed b5 residue + unscanned b8. Report the TRUE count — no padding to match an expectation.

### WAVE-2 batch-1 (b5 05_4–09) results — hypothesis CONFIRMED (2026-07-18)

The less-reviewed b5 residue DOES carry missing anchors (05_9 clean; 05_4/5/6/7/8 each yielded 1–2). MISSING candidates (PRELIM verdict pending main-session target-verify + anchor-worthiness judgment — keep concrete-mechanism + clean-target, DROP pure framing; NO padding):

- **M1 · 05_6-question-discipline** (code, STRONG): *"every question the seed agent asks the user carries a registered prefix, and the rest of the seed's machinery dispatches on those prefixes"* → `question_discipline/hooks/question-discipline-gate.sh` PREFIX_REGISTRY.
- **M2 · 05_5-interaction-summary** (context, GOOD): *"…let the mega-prompt grow without compression. Without the gate, a job that crosses ten cycles becomes unreadable; the next session loses the narrative thread…"* → `interaction_summary/CLAUDE.md` Objective.
- **M3 · 05_4-job-core** (context, GOOD): *"The whole always-on layer attaches to the job structurally; without the compartment, the rest of the layer has nothing to hang on."* → `job_core/CLAUDE.md` Design Principle.
- **M4 · 05_7-claude-md-hierarchy** (context, GOOD): *"The CLAUDE.md hierarchy is the one the phasic layer writes through."* → root `CLAUDE.md` Core Phases OR `.claude/context/opevc-phases.md`.
- **M5 · 05_8-historian-ratchet** (context, MEDIUM/abstract): *"The substrate is what makes the architecture teachable."* → identity Fact 5 (triangle-to-two).
- **M6 · 05_8-historian-ratchet** (context, MEDIUM/loose-target): *"…it is actually a small ring of single-concern plugins working together."* → plugin single-concern principle (target imprecise — verify).
- **M7 · 05_5-interaction-summary** (WEAK → likely DROP): *"the shape is the lesson and the names are your prototype's answer"* — pedagogical motif, no precise design home.

**Adjudication rule:** every KEPT candidate must have its target D2-verified to exist AND read as a claim a reader would genuinely want to trace. Prelim keep ≈ M1–M4; M5/M6 pending target check; M7 drop.

**Still to scan (wave-2 batch-2, launching now):** b6 06_6/06_7/06_7b/06_10b (verify/condense — mechanism-dense) + b8 08_1–09.

### WAVE-2 batch-2 running results (2026-07-18) — b6 verify/condense also yield MISSING

**b6/06_6 + 06_7 (fully read):** 5 candidates (all context-traceable architectural claims):
- **M8 · 06_6-verify** (HIGH): *"Self-verification is biased — that is the whole reason VERIFY is its own phase."* → `.claude/context/opevc-phases.md` VERIFY (phase-separation rationale).
- **M9 · 06_6-verify** (HIGH): *"…it is this discipline of choosing where to go, edge by edge, that gives the phasic layer its name"* → phasic-layer / Markov-property home (verify target: `opevc-phases.md` or phasic_system docs).
- **M10 · 06_7-condense** (MEDIUM): *"It is not a fifth work-on-the-project phase. It is a different kind of phase entirely."* → `opevc-phases.md` phase taxonomy.
- **M11 · 06_7-condense** (HIGH): *"The footer is never shrunk before it is preserved."* → `.claude/context/opevc-condense.md` preserve-before-deflate (ADDRESS→ARCHIVE→DEFLATE order).
- **M12 · 06_7-condense** (MEDIUM): *"A marked note is written in a parsable form — `[NOTETYPE]{content}`…"* → `opevc-condense.md` Marked-note lifecycle.

**b6/06_7b + 06_10b (fully read):** 06_10b well-anchored (ZERO missing); 06_7b gave 2:
- **M13 · 06_7b** (HIGH): *"What the architect would not remove is the lock-forward-only rule, nor the preserve-before-delete ordering."* → `.claude/context/opevc-phases.md` CONDENSE / `opevc-condense.md` design principles.
- **M14 · 06_7b** (MEDIUM): *"…the session-log command captures the full footers of every altered CLAUDE.md … into the cycle's session file in the run-aware job directory."* → `opevc-condense.md` Session archive (step 7).

**b8/08_1–03 (fully read):** 08_1 + 08_3 clean; 08_2 gave 1:
- **M15 · 08_2-job-maturation-stages** (MEDIUM): *"…the keys ARE voice ids directly, and the orchestrator augments each value's matching rendered voice when the phase opens. The yaml field name doesn't transform — it pairs by literal id match."* → `.claude/context/job-stages-plans.md` Stage 3.

**Target-verify progress:** M1 (PREFIX_REGISTRY) ✅ · M2 (`interaction_summary/CLAUDE.md` Objective) ✅ verified this session · M4 (root CLAUDE.md Core Phases) ✅. Remaining targets (opevc-phases/opevc-condense/job-stages-plans/identity/job_core) to confirm at adjudication.

**EDITORIAL PATTERN:** several candidates use the essays' recurring *"what the architect/you would NOT remove/do is X"* device (M2, M3, M13). Anchor-worthy when X is CONCRETE (lock-forward-only, preserve-before-delete, always-on-attaches-to-job); do NOT anchor every instance — pick highest-value, avoid over-tagging the device. M7 (abstract "shape is the lesson") = DROP.

**b8/08_4–06 (fully read):** 08_5+08_6 clean; 08_4 gave 1:
- **M16 · 08_4-soft-hard-migration** (MEDIUM, CODE): *"It is auto-injected as primary memory on every plugin unlock, and it grows on a structural schedule — every unlock appends to it."* → `plugin_integrity/hooks/lock-manager.sh` (evolution.md additionalContext injection).

### DISCOVERY COMPLETE (2026-07-18) — all 37 Part-2 essays scanned

Coverage: **b5 9/9**, **b6 13/13**, **b7 9/9** (07_4–09 depth-deferred — GOAL'd + shallow-clean), **b8 9/9**. (Part-1 b1–b4 NOT in scope this pass — mostly conceptual, few code-traceable claims; flag as an optional follow-up for the user.)

**FINAL MISSING candidate set = 15** (dropped M7 abstract): b5 → M1,M2,M3,M4,M5,M6 · b6 → M8,M9,M10,M11,M12,M13,M14 · b8 → M15,M16.
- HIGH: M1 (05_6 prefix-dispatch), M4 (05_7 CLAUDE.md-hierarchy), M8 (06_6 VERIFY-bias), M9 (06_6 phasic-name/Markov), M11 (06_7 preserve-before-deflate), M13 (06_7b lock-forward+preserve). GOOD: M2 (05_5 compression), M3 (05_4 job-attachment).
- MEDIUM/needs-target-check: M5 (teachable), M6 (single-concern ring), M10 (CONDENSE-not-a-work-phase), M12 (marked-note form), M14 (session-archive), M15 (yaml-keys-are-ids), M16 (evolution auto-inject).

**Signal (honest):** the GOAL'd series (b7, b8, late-b6) are genuinely well-anchored — MISSING was NOT "wide open" there; the real yield concentrated in less-reviewed b5 + b6 verify/condense. 15 real candidates, zero padding.

**ALL 15 anchor targets VERIFIED real** (target-verifier + main-session D2 spot-check of opevc-condense.md L32/L48). M15 target refined → `plugins-voices.md`/`identity.md` Stage-3 (not job-stages-plans.md Stage 3).

### ★ USER EDITORIAL DECISION (2026-07-18) — "HIGH-8 only" (answered [WAITING], captured)

**EXECUTE scope FINAL = 8 HIGH anchors + 3 drift fixes; skip 7 MEDIUM; Part-1 OUT of scope.**

**INSERT these 8 missing anchors** (each: write `*[ref: slug | target | summary]*` at the un-anchored claim, MIRROR .md + .html title=):
1. **M1 · b5/05_6-question-discipline** (code) — claim *"every question the seed agent asks the user carries a registered prefix, and the rest of the seed's machinery dispatches on those prefixes"* → `question_discipline/hooks/question-discipline-gate.sh` (PREFIX_REGISTRY).
2. **M2 · b5/05_5-interaction-summary** (context) — *"…let the mega-prompt grow without compression. Without the gate, a job that crosses ten cycles becomes unreadable; the next session loses the narrative thread…"* → `.claude/plugins/interaction_summary/CLAUDE.md` "Objective".
3. **M3 · b5/05_4-job-core** (context) — *"The whole always-on layer attaches to the job structurally; without the compartment, the rest of the layer has nothing to hang on."* → `.claude/plugins/job_core/CLAUDE.md` "Design Principle".
4. **M4 · b5/05_7-claude-md-hierarchy** (context) — *"The CLAUDE.md hierarchy is the one the phasic layer writes through."* → root `CLAUDE.md` "Core Phases (OPEVC)" (or `.claude/context/opevc-phases.md`).
5. **M8 · b6/06_6-verify** (context) — *"Self-verification is biased — that is the whole reason VERIFY is its own phase."* → `.claude/context/opevc-phases.md` VERIFY.
6. **M9 · b6/06_6-verify** (context) — *"…it is this discipline of choosing where to go, edge by edge, that gives the phasic layer its name"* → `.claude/context/plugins-entities.md` "Phasic layer".
7. **M11 · b6/06_7-condense** (context) — *"The footer is never shrunk before it is preserved."* → `.claude/context/opevc-condense.md` "CONDENSE 7-step waterfall" (preserve-before-deflate; near-verbatim).
8. **M13 · b6/06_7b-condense-uniquely-owns** (context) — *"What the architect would not remove is the lock-forward-only rule, nor the preserve-before-delete ordering."* → `.claude/context/opevc-condense.md` "Lock-forward only".

**SKIP (user restraint, no over-tagging):** M5, M6, M10, M12, M14, M15, M16. **DO NOT scan Part-1.**

**PLUS 3 drift fixes** (targets D2-confirmed): C2 `05_2` 9→10 prefixes · 06_2b `06_2b` idle-verbs 9→6 · 08_4 `08_4` pointer→`root CLAUDE.md`.

**EXECUTE work = 11 items × 2 surfaces (.md + .html mirror) = 22 edits.** Owed OBSERVE-exit: re-dispatch observe-blindspot-finder (family-c reflector) — DISPATCHED.

### Marked notes emitted this OBSERVE (for CONDENSE to consume)

[PENDING-JOB]{reconcile-idle-allowlist-doc-vs-code | the b6/06_2b blog tag, the essay prose (~L26), AND the phasic_system CLAUDE.md Idle-Allowed-Activities table all present ~9 idle job.sh verbs, but live phase-gate.sh:198 enforces only 6 (show, focused, list, activate, focus, pause) — which surface is ground truth (should idle allow update/complete/approve)? Architect decision. The blog TAG is fixed to 6 (matches code) in EXECUTE; the plugin-doc/essay-prose vs code split is a SUBSTRATE reconciliation — link/dependent to the existing substrate job 1784284305940794400; NEVER edit the plugin inline. dep:link}

[KNOWLEDGE]{ref-tag-review/missing-anchor-discovery-method}
MISSING-anchor discovery method (reusable): (1) recalibrate anchor-worthiness to claims traceable to code OR context/glossary — not only named-code mechanisms; a ref-tag legitimately anchors a `.claude/context/` term. (2) Dispatch observe subagents in TIGHT 1–2 essay slices — full-series reads reliably hit the subagent context ceiling and truncate. (3) GOAL'd/heavily-reviewed essays are near-fully anchored; MISSING yield concentrates in LESS-reviewed essays (b5 drafting, b6 verify/condense here). (4) The essays' recurring "what the architect/you would NOT remove/do is X" device marks load-bearing claims worth anchoring WHEN X names a concrete mechanism; skip the abstract ones (avoid over-tagging the device). (5) D2: subagents fetch candidates + propose targets; MAIN-SESSION verifies each target exists before locking.

[PENDING-JOB]{flag-claude-md-cap-false-positive | brain_guard claude-md-cap.sh (a Bash PreToolUse guard) BLOCKED a legal observe.sh metacog-reflect call purely because the reflection TEXT argument contained plugin CLAUDE.md path tokens (e.g. `job_core/CLAUDE.md`); the guard should inspect a command's WRITE TARGET, not string-match path tokens inside an unrelated quoted argument — a false-positive on a whitelisted script that forces awkward re-wording. Substrate/plugin fix ONLY (never edit the plugin inline); route to the substrate reconciliation job 1784284305940794400. dep:link}

[KNOWLEDGE]{ref-tag-review/review-scopes-both-drift-and-missing}
A ref-tag review is BIDIRECTIONAL by nature (user ruling 2026-07-18): auditing existing tags for DRIFT is only HALF the surface; discovering anchor-worthy claims that carry NO tag (MISSING) is the other half. Scope BOTH from the start — existing-tag drift AND un-anchored claims — or the review is only half done. A ref-tag exists to keep a website spot synced to code+context; an un-anchored anchor-worthy claim is an un-tracked sync risk, not merely a stylistic gap.

---Pl---

### Ref-tag review — PLAN (job 1784416070407796247, cycle 1, Stage 1)

**Stage 1** (`plan_file=false`) — single-cycle. Plan lives HERE in the footer; no plan file. Slate LOCKED by user "HIGH-8" ruling — do NOT re-open discovery or re-add the 7 skipped MEDIUM anchors.

**EXECUTE deliverable = 11 items × 2 surfaces (.md + .html mirror) = 22 edits** (3 DRIFT tag fixes + 8 HIGH MISSING anchor inserts).

**UNIVERSAL CONTROLS (every edit):**
- **MIRROR INVARIANT** — edit the `.md` tag AND the matching `.html` `title=` so the tag text is byte-identical on both surfaces.
- **RE-LOCATE BY SLUG / CLAIM TEXT** — line numbers are approximate + BANNED in tags; find each spot by its slug or claim sentence, never blind-edit a line #.
- **NEVER edit `.claude/plugins/`** inline — the 06_2b plugin-doc/code split is an emitted `[PENDING-JOB]` for CONDENSE (route to substrate job 1784284305940794400).
- **Tag anatomy** — `*[ref: slug | code-or-context-path | claim/summary]*`; middle field = stable pointer (file + section/function, NO line numbers); exactly 2 pipes.

**SCOPE SETUP (execute-scope declaration):** edits live in `blog/b5/`, `blog/b6/`, `blog/b8/`; each needs its nearest CLAUDE.md to declare it in-scope (exact, not recursive). b5 + b6 CLAUDE.md were declared in OBSERVE. **b8: DONE** — `blog/b8/CLAUDE.md` updated this job (its `---Pl---` scope note declares b8 in-scope for D3/08_4). All three series dirs now in EXECUTE scope (plan-scope-analyzer confirmed b5/b6/b8 CLAUDE.md all EXIST + carry this job's note).

**DRIFT FIXES (3):**

- **D1 · C2 · b5/05_2-plugin-integrity** {.md+.html} · slug `prefix-registry-current-entries` — "**9 active prefixes**" → "**10 active prefixes**", add `[COMMAND-APPROVE]` to the list. Ground truth: `.claude/context/prefixed-questions.md` + live `question-discipline-gate.sh` PREFIX_REGISTRY (10). **Accept:** "10 active prefixes" present + "9 active prefixes" absent + `[COMMAND-APPROVE]` in the tag list, on BOTH surfaces; mirror byte-identical.
- **D2 · 06_2b · b6/06_2b-the-phase-map** {.md+.html} · slug `idle-bash-allowlist-named-scripts` — verb list `(show|focused|list|update|activate|focus|pause|complete|approve)` [9] → `(show|focused|list|activate|focus|pause)` [6]. Ground truth: live `phase-gate.sh` IDLE `job.sh` whitelist = those 6. **Essay-prose = FIX TAG ONLY (user ruling 2026-07-19):** correct ONLY the tag to the 6 verbs; do NOT edit the essay's prose — the "should idle allow update/complete/approve" question stays the architect's `[PENDING-JOB]`, and editing prose to 6 now would pre-decide it. **Accept:** tag lists exactly the 6 verbs, `update|complete|approve` absent from the tag, essay prose UNCHANGED, both surfaces, mirror byte-identical.
- **D3 · 08_4 · b8/08_4-soft-hard-migration** {.md+.html} · slug `brain-maturation-soft-to-hard-canonical` — middle-field `CLAUDE.md "Brain Maturation Model"` → `root CLAUDE.md "Brain Maturation Model"` (disambiguate from `.claude/CLAUDE.md`'s different section). **Accept:** middle field reads "root CLAUDE.md …" both surfaces; mirror byte-identical.

**MISSING ANCHOR INSERTS (8)** — write `*[ref: slug | target | summary]*` at the named claim; MIRROR .md + .html:

| # | Essay {.md+.html} | Un-anchored claim (locate by text) | Target (middle field) |
|---|---|---|---|
| M1 | b5/05_6-question-discipline | "every question the seed agent asks … carries a registered prefix … dispatches on those prefixes" | `question_discipline/hooks/question-discipline-gate.sh` (PREFIX_REGISTRY) |
| M2 | b5/05_5-interaction-summary | "…let the mega-prompt grow without compression … the next session loses the narrative thread" | `.claude/plugins/interaction_summary/CLAUDE.md` "Objective" |
| M3 | b5/05_4-job-core | "The whole always-on layer attaches to the job structurally…" | `.claude/plugins/job_core/CLAUDE.md` "Design Principle" |
| M4 | b5/05_7-claude-md-hierarchy | "The CLAUDE.md hierarchy is the one the phasic layer writes through." | root `CLAUDE.md` "Core Phases (OPEVC)" |
| M8 | b6/06_6-verify | "Self-verification is biased — that is the whole reason VERIFY is its own phase." | `.claude/context/opevc-phases.md` VERIFY |
| M9 | b6/06_6-verify | "…choosing where to go, edge by edge … gives the phasic layer its name" | `.claude/context/plugins-entities.md` "Phasic layer" |
| M11 | b6/06_7-condense | "The footer is never shrunk before it is preserved." | `.claude/context/opevc-condense.md` "7-step waterfall" (preserve-before-deflate) |
| M13 | b6/06_7b-condense-uniquely-owns | "…lock-forward-only rule, nor the preserve-before-delete ordering." | `.claude/context/opevc-condense.md` "Lock-forward only" |

- New slug = descriptive kebab-case matching existing tag convention. **Summary field = PLAIN-LANGUAGE, READER-FIRST (user ruling 2026-07-19):** mirror the essay's own plain wording for the 80%-non-technical audience; traceability lives in the middle-field path, NOT in dense glossary terms in the summary. **Accept (per anchor):** slug present in BOTH .md + .html; tag sits at the named claim; middle-field target resolves (all 8 D2-confirmed); exactly 2 pipes; mirror byte-identical.

**EXECUTE CONTROLS (premortem-hardened):**
- **Exact-claim search, NOT paraphrase.** The MISSING claims above are OBSERVE paraphrases — at EXECUTE, Read the live essay, find the ACTUAL claim sentence, confirm it occurs ONCE, anchor there. If wording drifted or occurs 0×/multiple×, re-locate (don't blind-insert).
- **Mirror parity checklist.** Track every item as two ticks (`item/.md ✓  item/.html ✓`); never advance to the next item until BOTH surfaces carry the byte-identical tag.
- **Canonical middle-field format** (all 8 new anchors): `path/to/file.ext SECTION-OR-SYMBOL` — space-separated, NO parens/quotes — so the tag text is identical on both surfaces. E.g. `question_discipline/hooks/question-discipline-gate.sh PREFIX_REGISTRY`.
- **Slug-collision check.** Before inserting each new slug, grep the corpus; if it already tags another spot, pick a distinct slug.
- **Re-verify targets at EXECUTE (D2).** Live-Read each middle-field target file+section before inserting — ESPECIALLY M9 `.claude/context/plugins-entities.md "Phasic layer"` (absent from OBSERVE's short context-file list; if file/section missing, find the correct phasic-layer home before anchoring).
- **Gitignored `.md`:** grep `.html` normally + `.md` by EXPLICIT path (Bash grep reads gitignored files; the Glob tool does NOT).

**DONE = every acceptance grep passes on BOTH surfaces.** VERIFY re-greps each of the 11 slugs in .md AND .html + confirms claim-vs-ground-truth, item by item (no bulk "looks done").

**GUARD VALIDATION:** every EXECUTE step = `Edit` on a `blog/*.{md,html}` file inside a declared-scope dir — permitted by execute-guard. No plugin edits, no new scripts.

**CONDENSE owes:** consume the 4 emitted marked notes (2 `[PENDING-JOB]` + 2 `[KNOWLEDGE]`, which live in the `---Ob---` footer — CONDENSE greps all four phase footers, so no re-emit needed) + ask `[JOB-COMPLETE]`.

[KNOWLEDGE]{ref-tag-review/anchor-apply-controls}
Applying a ref-tag review inline (the EXECUTE half, distinct from the discovery method): each edit is a MIRROR PAIR — the .md tag and the .html title= must be byte-identical, tracked with a per-item two-tick parity checklist so neither surface is skipped. Re-locate every tag/claim by slug or live claim-sentence, never by line number — OBSERVE paraphrases must be matched to the essay's ACTUAL wording and confirmed to occur once before inserting. New anchors use a canonical middle-field format (path SPACE section-or-symbol, no parens/quotes) so the tag text is identical across surfaces; grep each new slug for collisions first. Re-verify each middle-field target still resolves via a live Read at EXECUTE (targets D2-verified at OBSERVE can go stale between phases/sessions). Gitignored .md files are grepped by explicit path (Bash grep reads them; the Glob tool does not). Summary voice follows the user's audience, set per-run.

---Ex---

### EXECUTE notes (job 1784416070407796247)

**D2 re-verify at EXECUTE (per plan control):**
- **M9 target CONFIRMED** — `.claude/context/plugins-entities.md` has the `### Phasic layer` section (the FORWARD_MAP/BACKWARD_MAP "choose where to go edge by edge" home). Anchor valid.
- **C2 ground truth CONFIRMED via LIVE CODE** — `question_discipline/hooks/question-discipline-gate.sh` `PREFIX_REGISTRY` (lines 81-92) = 10 entries INCLUDING `[COMMAND-APPROVE]`. Blog "9 active prefixes" is real drift; fix 9→10 + add COMMAND-APPROVE is correct.

[PENDING-JOB]{reconcile-prefix-registry-count-doc-vs-code | during C2 verification the LIVE question-discipline-gate.sh PREFIX_REGISTRY was confirmed to hold 10 entries INCLUDING [COMMAND-APPROVE], but two seed doc/context surfaces are drifted to 9 WITHOUT it: .claude/context/plugins-entities.md question_discipline "Registry" paragraph ("holds 9 entries", lists 9 sans COMMAND-APPROVE) AND .claude/plugins/question_discipline/CLAUDE.md + hooks/CLAUDE.md ("9 active/registered prefixes"). plugins/CLAUDE.md and prefixed-questions.md correctly say 10. Seed-internal doc/context drift (NOT the blog) — SUBSTRATE reconciliation, never edit inline in this website job; link/dependent to substrate job 1784284305940794400, same shape as the 06_2b doc-vs-code split. dep:link}

**PROGRESS (execute — subagent dispatch, 80/20):** Delegated the 22 edits to 3 execute-file-editor subagents, one per series. **b5** (C2 drift + M1/M2/M3/M4 anchors) and **b6** (06_2b drift + M8/M9/M11/M13 anchors) LAUNCHED; **b8** (08_4 drift) launching next. Each subagent studies the existing `.html` ref-marker format, applies mirror-paired edits (.md + .html byte-identical), confirms each middle-field target resolves, and reports verbatim. Awaiting their reports; then VERIFY re-greps all 11 slugs on BOTH surfaces + confirms claim-vs-ground-truth item by item.

**Confirmed `.html` ref-marker format (from b8 subagent report):** `<sup class="ref-marker" title="ref: SLUG | MIDDLE | CLAIM">&#9432;</sup>` — the `title=` carries `ref: slug | middle | claim`; any `"` inside the content is HTML-encoded as `&quot;` (so the mirror is byte-identical AFTER entity decoding, not literally). The `.md` side is the inline `*[ref: slug | middle | claim]*`. New anchors MUST match this exact `<sup class="ref-marker">` structure. **b8/D3 DONE + main-session verified** (middle field → "root CLAUDE.md", both surfaces). b5/b6 subagents still in flight.

**ALL 3 SUBAGENTS DONE — 11 items / 22 edits reported applied (subagent CLAIMS — NOT yet main-session verified):**
- **b8:** D3 08_4 ✓ verified.
- **b6:** D2 06_2b (verbs 9→6, prose confirmed UNCHANGED) · M8+M9 06_6 · M11 06_7 · M13 06_7b.
- **b5:** D1 05_2 (9→10 + COMMAND-APPROVE — subagent REWROTE the claim to a fuller 10-prefix enumerated list; accurate-looking but VERIFY must confirm accuracy + mirror) · M1 05_6 · M2 05_5 · M3 05_4 · M4 05_7.
- All report mirror byte-identical (after HTML-entity decode) + targets resolve.

**VERIFY OWES (main-session, D2):** re-check each of the 11 slugs on BOTH `.md`+`.html`; confirm (a) slug present both surfaces, (b) claim/tag content byte-identical after entity decode, (c) `.html` `<sup class="ref-marker">` well-formed, (d) middle-field target section actually exists. Extra scrutiny: **D1 claim-rewrite scope** + the 06_2b tag lists exactly the 6 verbs with prose untouched.

**GROUND-TRUTH CORRECTION (main-session read of 05_2 both surfaces):** **D1 is CORRECT + mirror-INTACT** — BOTH `.md` L79 and `.html` L166 read "10 active prefixes" incl `[COMMAND-APPROVE]`, byte-identical (all 10 listed). The `execute-drift-auditor` **FABRICATED** the "`.md` still says 9" mirror-break — it does not exist (textbook D2: the AUDITOR subagent fabricated; ground truth is the only arbiter). Its reported anchor slugs also disagree with the edit-subagents' → untrusted; VERIFY resolves the ACTUAL slugs by grep. **No execute fix needed for D1.** Side-note: M1–M4 + M8/M9/M11/M13 each ADDED a marker, so the `blog/b5/CLAUDE.md` per-essay ref-marker counts (05_4/05_5/05_6/05_7 +1; 06_6 +2; 06_7/06_7b +1) are now stale — update in CONDENSE.

---Ve---
