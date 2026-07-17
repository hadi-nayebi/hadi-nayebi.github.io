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

### Ref-tag sync job — b6/b7/b8 (job 1784255953475439806 · Stage-1 collaborative · cycle 1)

**Objective:** all-surface ref-tag sync across b6/b7/b8. A ref-tag ANCHORS a fact; every surface of that fact must agree with **context (ground truth)**. Deliverable = **top ~5** issues most worth fixing (corpus-wide severity, NOT per-blog compartments). Depth is per-anchor.

**Ref-tag format (canonical + auditor-verified):** inline `*[ref: slug-kebab | source-pointer (file / section, NO line numbers) | content-summary ≤120w]*`; renders in `.html` as `<sup class="ref-marker" title="...">`. `[consolidated]` term in `../../.claude/context/identity.md` §"### ref-tag". Source-pointers like `.claude/plugins/X/...` resolve to the ROOT seed `/home/hadinayebi/CodingProjects/hadosh_academy/.claude/...` (one level UP from website `.claude/`). Ground truth = Rule 40 (`../../.claude/context/INDEX.md`).

**Scan frame (9-point, from `../.claude/agents/blog-ref-tag-auditor.md` — a WEBSITE agent, NOT dispatchable here; use as a THINKING FRAME inside observe-* prompts):** R1 presence (Layer-1 claim → tag within ±1¶) · R2 file exists (ls) · R3 content-match/anti-fabrication (grep the phrase) · R4 stable pointer, line-numbers BANNED everywhere · R5 slug-unique per essay · R6 content supports claim · R7 summary ≤120w · R8 density ≥80% (SOFT/JUDGMENT, never FAIL) · R9 stale-tag → REDUCE to stable useful content (Rule 47 — the "drift" this job hunts). R2/R3/R4/R9 are binary PASS/FAIL = the highest-value drift signals.

**Surfaces of a fact:** context (`.claude/context/`, ground-truth) · code (`.claude/plugins/` + seed source) · seed-repo explanation (comments · plugin docs/CLAUDE.md · `knowledge/`) · blog ¶ + its tag · diagrams. (Context also has a 4-tag sync convention `[sync:*]`+`[verified]`; NO diagrams tag — reconcile against a real paragraph.)

**Edit boundary (project line):** blog ¶/diagram drift → **fix inline** · tag wrong → **fix inline** · true-in-code/blog but missing-from-context → **ADD to `.claude/context/` as `[draft]`** (PRIMARY goal) · plugin surface disagrees w/ context → **file ONE pending job** (NEVER edit plugin dir here).

**Mechanics:** edit `.md` (gitignored, local) → regen `.html` (committed source-of-truth) so diff = only my edits. R9-fix must land in BOTH `.md` and `.html`. One canonical surface/fact (body-vs-tag contradiction IS a finding). A live transient knob does NOT override the documented default. Acceptance = deterministic greps at zero. Ask before touching outside website+context.

**PRIOR RUN — this job REPEATS; inherit BEFORE scanning:** prior ref-tag-review job `1781190945888385572` (B7 fixed 07_6 agent-pool counts; B8 deferred IRR-4 [08_3 stale dated counts] + IRR-5 [08_3 misattributed principles.md pointer] → pending job `1781200035845568970`). ⚠️ **BROKEN POINTERS (verified 2026-07-16):** root `.claude/knowledge/{ref-tag-review/, b6-reftag-sweep-job-state.md, blog-status-history.md}` do NOT exist at ROOT (index stale, 2026-05-13) — likely in WEBSITE `.claude/knowledge/`; LOCATE via ls. Ref counts (b6): 06_2=29·06_2b=13·06_5=32·06_7=32·06_7b=20·06_8=27·06_9=25·06_10=16·06_10b=26.

**Rhythm:** context-anchorer ✓ → relaunch experience-recaller (Bash: locate broken-ref files + mine ref-tag-review + enumerate corpus) + slice scan-subagents by series (9-pt frame) → I verify each flag vs LIVE code+context (no guesses) → 4-bucket classify → top-5. Build-path to verify: `.claude/tools/` vs `tools/generate_blog_html.py` vs `blog-update` skill.

**Last-updated marker:** design TBD (candidate: reuse `[verified]`/`[sync:*]`) — options to user after seeing real tag.

**4 DRAFT-TERM notes to emit (from anchorer):** fact-surface partition (5-way) · ref-tag staleness/surface-desync (≠ Drift-gate) · seed/website/plugin-dir three-repo boundary · ref-tag last-checked marker. Home: `../../.claude/context/identity.md` near the ref-tag term.

### PRIOR STATE INHERITED (2026-07-16) — recaller + `backlog-status.md`

**File locations (broken pointers resolved):** `blog-status-history.md`, `b6-reftag-sweep-job-state.md`, `b6-series-audit-history.md` → WEBSITE `../.claude/knowledge/`; `ref-tag-review/` (INDEX + CLAUDE + **`backlog-status.md`** live tracker + per-cycle lessons) → ROOT `../../.claude/knowledge/ref-tag-review/`. All prior jobs WIPED in a seed reset — durable knowledge survives on disk; any `[PENDING-JOB]` I file is fresh.

**Same work as former repeatable job `1781248437814993567`** (frozen plan `../../.claude/jobs/1781248437814993567/plan_ref_tag_maintenance.md`); user set THIS run as fresh **Stage-1 b6/b7/b8**. Inherit its 12-class backlog as KNOWLEDGE, not a job link.

**BINDING POLICIES (from `ref-tag-review/CLAUDE.md` — apply verbatim):**
- Stable pointers ONLY; **line numbers BANNED**. Stale tag → REDUCE to stable useful content (never empty shell, never re-baked volatile numbers).
- **MIRROR INVARIANT:** every fix lands byte-identical in BOTH `.md` and `.html` (the `.html` `title=` mirrors the `.md` tag).
- **Ground-truth EVERY claim MAIN-SESSION** — subagents FETCH, the seed ADJUDICATES (they fabricate citations = D2). Census run main-session, never inherit a subagent count (census belongs in EXECUTE/VERIFY where Bash is allowed).
- `[WAITING]` reserved for GENUINE design forks ONLY — doc-sync / stale-counts / broken-links = **decide+fix**, never `[WAITING]`.

**CANDIDATE TOP ISSUES (b6/b7/b8 scope; all OPEN; must VERIFY live):**
1. **B-LINE** (the mechanical spine) — line-number pointers in ref-tag MIDDLE field; b6/b7/b8 ALL OPEN. Census: `grep -nE '\*\[ref:[^]]*\.[A-Za-z0-9]+:[0-9]' hadi-nayebi.github.io/blog/bN/*.md` (third-field colon-digits = B-LINE-3F sub-class).
2. **B-PRIN** (`08_3`) — tag cites `phase_condense/docs/principles.md` for "session as last resort"; real home = ROOT `CLAUDE.md` "Step 7 fallback". Verify: grep both (expect ABSENT in principles.md).
3. **B-IMG** (`07_6`) — image-prompt agent-pool counts vs live `ls .claude/plugins/*/agents/*.md | wc -l`.
4. **B-B7V** (b7) — voice count vs live `grep -c '<' <cited-plugin>/…/voice.xml` (BOTH hooks+scripts surfaces).
5. **B-CNT** (`08_3`) — dated index counts ("258,238w / 228 files / 19 silos") vs live `.claude/knowledge/CLAUDE.md` — LOWEST severity (date-qualified).
Plus **B6-SWEEP** (b6 277 tags, largest under-reviewed surface).

**JUDGMENT → `[WAITING]`:** **B-STUB** (`07_6`) — job_archiver/job_blocker 3-surface contradiction (docs "unimplemented, no hooks" vs filesystem `agents/` stubs + historians vs blog lumping them with active plugins); governed by `[draft]` "Plugin" term — re-check context `[draft]` status FIRST, never self-adjudicate.

**SUBSTRATE → ONE `[PENDING-JOB]` (NEVER fixed inline):** B-IMGHTML (`07_6` `*`→`<em>` generator mangling), B-EXVOICE (phase_execute entry voice still points at old `.claude/knowledge/plans/`), B-VOICE (question_discipline coaching voice), B-FOOTGUN (condense-job-creator focused-only update), B-COMPACT (brain_guard compaction-io deadlock).

**Regen (verified):** `python3 .claude/tools/generate_blog_html.py blog/bN/<slug>.md blog/bN/<slug>.html --version <stamp>` from `hadi-nayebi.github.io/`. Doc drift: `b6/CLAUDE.md` + `blog-update` skill say `tools/…` (path doesn't exist) → website inline-fix candidate.

### B-LINE OPEN FRONT + subagent-defect signatures (`b6-reftag-sweep-job-state.md`, job 1782320396187605322 INACTIVE)

**A THIRD sweep-state file exists** (`../.claude/knowledge/b6-reftag-sweep-job-state.md`) — tracking is FRAGMENTED across it + `ref-tag-review/backlog-status.md`. Inherited banked note `[PENDING-JOB]{reconcile-ref-tag-backlog-status}` already flags this.

**B-LINE true open front (b6/b7/b8) — line-number tags per essay:**
- DONE+committed BOTH surfaces: b6 `06_2`(5) · `06_4`(11) · `06_5`(32) · b7 `07_2`(2).
- **`06_9-gmode` (17 tags) = LANDMINE** — a 2nd execute-file-editor CLAIMED it stripped ~25 tags both surfaces but the work is **NOT trusted / NOT committed** (red flags: scope-creep 25 vs 17, reworded no-line-number tags, UNVERIFIED invented anchors e.g. "gmode-gate.sh Justification Floor"). Needs main-session D2 audit of `06_9.md`+`.html`: zero line-numbers both surfaces, tag-count parity, no collapsed-space, 100% new-anchor verification.
- **b7 OPEN: `07_1`(1) · `07_4`(1) · `07_5`(3) · `07_7`(3) · `07_9`(2) = 10 tags.**
- **Splits `06_2b`/`06_7b`/`06_10b` NEVER grepped** (census predates 2026-06-21 splits) — re-grep at fix-time.
- b8 `08_3`: stale-count tags (B-CNT, no line numbers).

**RECURRING subagent-defect signatures (bake into scanner prompts + my D2):** (1) collapsed-space-after-extension (`.sh`/`.md`/`.yaml`/`.py` + letter → `execute-commit.shPurpose`) — grep explicitly; (2) tag-count undercount (processes 31/32, claims "parity") — assert `.md-count == .html-count` deterministically; (3) reworded/invented anchors — verify EVERY new anchor against cited impl (user: 100%).

**ROOT-CAUSE of my accrual spike (prior job's exact lesson):** reading a blog-dir file AUTO-INJECTS the giant website+blog+series CLAUDE.md → spikes context; subagent Reads inherit the bloat + trip gates. **FIX: delegate ALL essay/impl reads to subagents; main-session Reads limited to the target `.html` for the final D2 audit + state files.**

**Banked carry-forwards to RE-EMIT this run** (prior notes, still valid): `[AGENT-UPDATE]{execute-file-editor}` derail-hardening (say "you are the editor, edit now"; avoid "dispatch"; don't require impl reads) · `[VOICE-UPDATE]{phase_observe}` brace-less marker examples · `[PENDING-JOB]{reconcile-ref-tag-backlog-status}` · `[PENDING-JOB]{self-compact-mid-execute-wedge}` · `[PENDING-JOB]{brain-guard-self-compact-summary-arg-discoverability}`.

**Housekeeping:** check + delete TEMP `blog/b6/.rolling-summary-resume.txt` if present (wedged-self-compact residue).

### OBSERVE constraint (discovered 2026-07-16): subagents CANNOT run arbitrary Bash

The B-LINE census scanner (Bash `grep`) was BLOCKED by observe-guard — the Bash whitelist (job.sh/phase.sh/observe.sh/summary.sh) applies to **subagents too**. So `grep`/`ls` ground-truthing is NOT an OBSERVE activity; it belongs in **EXECUTE/VERIFY** (Bash allowed), matching the prior job's "census at fix-time, main-session" rule.

**In OBSERVE, fetch via Read / Grep-tool / Glob-tool instead:**
- Seed source (`.claude/**`), root `CLAUDE.md`, blog `.html` are NOT gitignored → the **Grep tool + Glob tool WORK** on them (count pool sizes via Glob-result-count, not `ls|wc`).
- Blog `.md` ARE gitignored → the Grep tool SKIPS them → use **Read-by-path**, or Grep the committed `.html` mirror.
- Re-dispatch fetches as Read/Grep/Glob-based (observe-codebase-explorer / observe-contradiction-finder — no Bash). **B-LINE exact census → deferred to EXECUTE/VERIFY main-session `grep`** (only the still-open CONFIRMATION is needed in OBSERVE, via Read).

### USER DECISIONS (2026-07-16 `[WAITING]` answers) + FINALIZED TOP-5

**Answers:** (1) **B-STUB → Add inline caveat** — keep roster counts in `07_3/07_5/07_6`, add a brief "(2 of these are unimplemented designs)" note inline (both `.md`+`.html`). (2) **Re-run marker → Tracker file, NO blog markup** — use `ref-tag-review/backlog-status.md` + this job's CLAUDE.md as the skip-list; record each synced anchor there; NO per-tag / frontmatter markup in essays. (3) **B-CNT (`08_3` dated counts) → Preserve** — the 2026-05-18 snapshot is deliberate ("Brain After Three Months"); NOT a drift, leave as-is.

**FINALIZED top issues to SYNC this pass (Stage-1; fixes land in EXECUTE):**
1. **B-LINE** — strip line-number pointers → stable (file/section) anchors, BOTH surfaces (mirror invariant). Targets: b6 `06_9` (**LANDMINE — audit the unverified prior strip-work FIRST**: line-numbers gone both surfaces? tag-count parity? invented anchors? collapsed-space?) + b7 `07_1/07_4/07_5/07_7/07_9` (~10 tags) + re-grep splits `06_2b/06_7b/06_10b`. Exact census = EXECUTE main-session `grep`.
2. **B-STUB** — add "(unimplemented)" caveat to job_archiver/job_blocker roster counts in `07_3/07_5/07_6` (both surfaces). Context term `plugins-entities.md` "Unimplemented designs (2)" is `[consolidated]` ground truth — no context edit needed.
3. **B-B7V** — verify b7 voice-count claims vs live voice.xml (EXECUTE grep BOTH hooks+scripts surfaces); fix if drifted.
4. **Regen-path doc drift** — fix `tools/…` → `.claude/tools/…` in `b6/CLAUDE.md` + `blog-update` SKILL.md (website memory-forms; inline).
5. **Substrate → ONE `[PENDING-JOB]`** — B-IMGHTML, B-EXVOICE, B-VOICE, B-FOOTGUN, B-COMPACT (plugin-dir; NOTICE only, never fix inline).

**No action:** B-IMG + B-PRIN (verified already-fixed); B-CNT (preserved per user).

**Marker mechanism (per user):** as each anchor/essay is synced, record it in `../../.claude/knowledge/ref-tag-review/backlog-status.md` (Status + Cycle-closed columns) — the skip-list a re-run reads. No essay markup. (Fragmented-tracker `[PENDING-JOB]{reconcile-ref-tag-backlog-status}` still stands.)

### BLINDSPOT REFLECTOR — gaps PLAN must fill (family-c, 2026-07-16, verdict ACCEPT)

Gathering is intentionally Stage-1-shallow; the exhaustive census is deferred to EXECUTE by the OBSERVE-no-Bash constraint. 7 gaps → PLAN/EXECUTE todos:
1. **Essay-scope partition** — b7 `07_2/07_3/07_6/07_8` + b8 `08_1/08_2/08_4–08_9` never examined this run. → **PLAN `[WAITING]`** (which essays are IN-scope for the top-5 hunt?).
2. **Diagrams surface** — never audited (0 of 5 surfaces). Images user-gated/pending, but caption/alt-text drift could be checked. → **PLAN `[WAITING]`** (in/out of Stage-1 scope?).
3. **Census re-verify** — inherited B-LINE counts predate the 2026-06-21 splits; EXECUTE re-censuses LIVE (`grep`) and lets live counts OVERRIDE.
4. **Context R2/R3** — `06_10`'s cited context section-names never verified to resolve; EXECUTE greps each cited section exists.
5. **Severity metric** — undefined. → **PLAN defines** (proposed: binary-FAIL R2/R3/R4/R9 > #essays > #tags) and shows the ranking for user audit.
6. **Pending-job scope** — the substrate `[PENDING-JOB]` must ENUMERATE the plugin drifts + bound scope (done below).
7. **`06_9` D2 audit** — landmine prior strip-work must be main-session D2-audited in EXECUTE (parity, zero line-#s, every anchor real, no invented anchors).
Routing: gaps 1/2/5 → PLAN `[WAITING]`/decide (Stage-1's ≥3 PLAN questions). Gaps 3/4/6/7 → EXECUTE/PLAN todos I own.

### GROUND-TRUTH refinements (`.claude/context/plugins-entities.md`, read 2026-07-16)
- "Active plugin inventory" term is `[consolidated]` + `[verified]` + `[sync:blog-body]` (blog IS a sync target). Wording: "11 active plugins … plus 2 unimplemented designs"; **`_Avoid_` BANS "13 plugins"** ("count the active set; the 2 designs are not enforcement plugins"). → B-STUB caveat fix is consistent; EXECUTE must ALSO check no b7 essay literally says "13 plugins" (banned-vocab R3 fail — stronger than a caveat).
- **CONTEXT-EDIT MECHANISM CORRECTION:** the seed NEVER edits `.claude/context/` in OBSERVE/PLAN/EXECUTE — it emits `[DRAFT-TERM]` footer notes and CONDENSE (memory-layer scope) deposits the `[draft]` stub. So "add missing context as [draft]" = emit `[DRAFT-TERM]` → CONDENSE writes it, NOT an EXECUTE edit. (Per `.claude/context/CLAUDE.md`.)

### MARKED NOTES (family-b — for CONDENSE)
`[DRAFT-TERM]{fact-surface-partition (5-way: context/code/seed-repo-explanation/blog+tag/diagrams) | ref-tag-sync job framing, no context term exists | .claude/context/identity.md (sibling to ref-tag term)}`
`[DRAFT-TERM]{ref-tag-staleness / surface-desync (distinct from Drift-gate's historian-ratchet meaning) | only prose in identity.md ref-tag Lifecycle para, unnamed | .claude/context/identity.md (ref-tag section)}`
`[DRAFT-TERM]{seed/website/plugin-dir three-repo edit-boundary | only in root CLAUDE.md "Three separate gits", not promoted to context | .claude/context/identity.md (near Customization guardrail)}`
`[DRAFT-TERM]{ref-tag-review skip-list convention = the backlog-status.md tracker (user-chosen 2026-07-16, no per-tag blog marker) | ref-tag-review/backlog-status.md | .claude/context/identity.md (ref-tag Lifecycle)}`
`[PENDING-JOB]{substrate-plugin-ref-tag-drift-batch — B-IMGHTML (generate_blog_html.py asterisk->em mangling garbles observe-* (13) in 07_6 html) + B-EXVOICE (phase_execute info-create-plan-file-this-cycle voice points at retired .claude/knowledge/plans/; live=.claude/jobs/<id>/) + B-VOICE (question_discipline coaching voice) + B-FOOTGUN (condense-job-creator focused-only job.sh update) + B-COMPACT (brain_guard compaction-io no-trim + finalization-cannot-auto-fold + metacog-append bloat) + banked [AGENT-UPDATE]{execute-file-editor derail-hardening} + [VOICE-UPDATE]{phase_observe brace-less marker examples}. ALL plugin-dir/substrate — fix via gmode or JOB-APPROVE-PLUGIN, NEVER inline in this website job | plugin-lock}`





[PENDING-JOB]{substrate-plugin-ref-tag-drift-batch (plugin-lock; fix via gmode or JOB-APPROVE-PLUGIN, NEVER inline): B-IMGHTML (generate_blog_html.py asterisk-to-em mangling garbles observe-* (13) in 07_6 html) + B-EXVOICE (phase_execute info-create-plan-file-this-cycle voice points at retired .claude/knowledge/plans/; live=.claude/jobs/<id>/) + B-VOICE (question_discipline coaching voice doc-sync fork) + B-FOOTGUN (condense-job-creator focused-only job.sh update) + B-COMPACT (brain_guard compaction-io no-trim/finalization-cannot-fold/metacog-append-bloat) + banked AGENT-UPDATE execute-file-editor derail-hardening + VOICE-UPDATE phase_observe brace-less marker examples}
[DRAFT-TERM]{fact-surface-partition (5-way: context / code / seed-repo-explanation / blog-paragraph+tag / diagrams) | ref-tag-sync job framing needs it; no context term names the surface set | .claude/context/identity.md (sibling to the ref-tag term)}
[DRAFT-TERM]{ref-tag-staleness / surface-desync (a ref-tag whose blog claim or cited impl drifted apart) distinct from Drift-gate's historian-ratchet meaning | only prose in the identity.md ref-tag Lifecycle paragraph, unnamed | .claude/context/identity.md (ref-tag section)}
[DRAFT-TERM]{seed/website/plugin-dir three-repo edit-boundary (which repo/surface a given fix is allowed to touch) | stated only in root CLAUDE.md 'Three separate gits' + 'Workspace Structure', never promoted to context | .claude/context/identity.md (near the Customization guardrail term)}
[DRAFT-TERM]{ref-tag-review skip-list convention = the backlog-status.md tracker (a re-run reads it to skip already-synced anchors; user-chosen 2026-07-16, no per-tag/frontmatter blog markup) | .claude/knowledge/ref-tag-review/backlog-status.md | .claude/context/identity.md (ref-tag Lifecycle subsection)}

### OBSERVE-EXIT ADDENDUM (2026-07-17, post-compact resume — session 2)

OBSERVE cycle 1 re-confirmed complete; the finalized top-5 above stands. Two refinements for PLAN/CONDENSE:

- **COMMAND-APPROVE (PLAN todo):** job `allowed_commands` is EMPTY. PLAN must declare `[COMMAND-APPROVE]` for the `.html` regeneration command (`python3 .claude/tools/generate_blog_html.py …`) that EXECUTE runs and VERIFY re-checks (mirror invariant). Bare `grep`/`ls` census are system utils; the regen script is the project command that needs approval.
- **New substrate item → folds into the ONE substrate `[PENDING-JOB]` above (top-5 #5), NOT a new separate marker:** brain_guard `heartbeat-sensor` voice tells the seed to batch metacog-reflect in one Bash call, but the phase_observe / phase_plan guard BLOCKS compound/multi-line Bash — so batching is impossible in observe/plan; run ONE reflect per Bash call. The heartbeat-sensor voice needs a phase-guard caveat. Plugin surface = locked here → route via the substrate PENDING-JOB, never inline.

**Anchor-heals blocker RESOLVED (2026-07-17):** user chose remove+gitignore — user runs `! rm hadi-nayebi.github.io/CLAUDE.md.anchor-heals`; EXECUTE adds `*.anchor-heals` to the website .gitignore; the section-check.sh:465 root cause (un-gitignored sibling backup, no cleanup code, recurring transition wedge) folds into the substrate [PENDING-JOB].

**Proposed Ve criteria (PLAN formalizes below ---Ve---; observe-guard blocks writing there now):** all greps at ZERO / count-parity, MAIN-SESSION — B-LINE middle-field line-# grep = 0 on 06_9 · 07_1/07_4/07_5/07_7/07_9 · splits 06_2b/06_7b/06_10b, plus .md/.html tag-count parity + 06_9 D2 (every new anchor verified real, no collapsed-space); B-STUB `grep -c '13 plugins'` = 0 + "(2 unimplemented)" caveat BOTH surfaces; B-B7V voice-count == live grep BOTH voice.xml surfaces; regen-path no bare `tools/`; substrate = exactly ONE [PENDING-JOB]; mirror = every edited .md regenerated to .html, diff = only my edits; tracker + gitignore updated.

---Pl---





---Ex---





---Ve---
