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

### PLAN (cycle 1) — Ref-tag sync b6/b7/b8 (Stage-1, plan_file=false)

Premortem (family-c, ACCEPT) reshaped this: TWO clean buckets (no "top-5 all in EXECUTE" framing); acceptance = THREE gates, not grep-zero alone.

## EXECUTE Deliverables (edit .md → regen .html; mirror invariant; ground-truth MAIN-SESSION)

**E1 · B-LINE** — strip line-number pointers from ref-tag MIDDLE fields → stable file/section anchors, BOTH surfaces.
- **E1a PRE-GATE (runs FIRST, main-session):** 06_9 D2-audit of the unverified prior strip-work. Confirm ALL: zero line-#s in .md AND .html; .md tag-count == .html tag-count (exact); EVERY new anchor greps non-zero in its cited impl (100% real — no invented anchors e.g. "gmode-gate.sh Justification Floor"); no collapsed-space-after-extension. If ANY anchor fabricated → HALT + surface list. Clear fabrication → discard+redo; ambiguous → [WAITING] to user.
- **E1b:** b7 07_1 / 07_4 / 07_5 / 07_7 / 07_9 (~10 tags) — strip, stable anchors, regen.
- **E1c:** splits 06_2b / 06_7b / 06_10b — ls-confirm exist FIRST (census predates 2026-06-21 splits); re-census live; strip if present.

**E2 · B-STUB** — 07_3 / 07_5 / 07_6: grep the EXACT plugin-count phrasing in each first (base may differ 13 vs 11 — premortem #10); reconcile base to context ("11 active + 2 unimplemented", plugins-entities.md [consolidated]); banned-phrase grep -i '13 plugins|thirteen plugins' = 0; add uniform "(2 unimplemented)" caveat BOTH surfaces; regen.

**E3 · B-B7V** — grep BOTH hooks/ + scripts/ voice.xml live counts (essay must == SUM); locate the b7 essay(s) citing voice counts; if drifted fix BOTH surfaces + regen; else record verified.

**E4 · .gitignore** — add *.anchor-heals to hadi-nayebi.github.io/.gitignore (recurrence fix; user already removed the orphan).

**E5 · B8 FAST census (USER DIRECTIVE, fork-1 answer 2026-07-17) — bounded b8 sweep.** VERBATIM user directive:
> "Do the b8 sweep (option 3) but BOUNDED — the job names b6/b7/b8, so b8 cannot be silently dropped from a 'sync,' but do NOT turn this into a deep re-audit that risks not shipping.
> Concretely, in EXECUTE: run a FAST ref-tag census over the b8 essays (08_1, 08_2, 08_4-08_9) with a subagent — SAME method as b6/b7: grep every ref-tag, verify each against context (ground truth), fix real context-mismatches inline. Re-confirm 08_3's known items too (B-PRIN pointer + the preserved B-CNT dated counts — those stay preserved per the user decision).
> Do NOT re-rank or re-open the severity metric — b8 hits simply append to the EXECUTE fix-list.
> Circuit-breaker: if b8 has heavy, unexpected drift that would balloon the pass well beyond the top-5, PAUSE and tell me before expanding — do not silently convert this into a giant re-audit. If b8 is clean or light (likely — nothing but 08_3 was logged in the backlog), confirm it fast and proceed.
> Net: full b6/b7/b8 coverage, kept shippable tonight."

Operationalized: EXECUTE dispatches a subagent to FAST-census every ref-tag in b8 08_1/08_2/08_4-08_9 (fetch only — main-session ADJUDICATES each vs context, D2). Real context-mismatches → fix inline (edit .md → regen .html, mirror invariant), APPEND to the fix-list (no re-rank). 08_3: re-confirm B-PRIN pointer already-fixed + B-CNT dated counts PRESERVED (untouched). CIRCUIT-BREAKER: if b8 drift balloons well beyond the top-5, PAUSE + surface to user before expanding — never silently convert to a giant re-audit. Same 3-gate acceptance contract applies to b8 fixes.

### 06_9 RECONCILIATION (user ground-truth, 2026-07-17) — LANDMINE PREMISE REFUTED

VERBATIM user ground-truth (independently verified 06_9 live):
> "31 ref-tags, ALL section-name anchors (e.g. gmode-gate.sh Justification Floor, phase.sh enter-gmode arm) — I found NO line-number tags in the .md, .html, .transcript.md, or .yaml. .md and .html each carry exactly 31 tags — no md↔html count mismatch. Every source file I spot-checked EXISTS and the named mechanisms are REAL: the GMODE_WORD_MIN floor in gmode-gate.sh:104; the gmode_prepped 3-state field + 'the gmode arc' in brain-memory.md; enter/exit-gmode + gmode-prep arms in phase.sh. So your 'line-number tags / fabricated anchors / tag-count mismatch' framing does not match ground truth — possibly a stale inventory from before a prior pass already converted line-numbers to section anchors."

RECONCILIATION TABLE (inherited inventory claim vs user ground truth):
| Inventory claim (b6-reftag-sweep-job-state.md) | Alleged defect | Ground truth (user-verified) | Verdict |
|---|---|---|---|
| "gmode-gate.sh Justification Floor" | UNVERIFIED invented anchor | GMODE_WORD_MIN floor real @ gmode-gate.sh:104 | REAL — not invented |
| "phase.sh enter-gmode arm" | (reworded/unverified) | enter/exit-gmode + gmode-prep arms real in phase.sh | REAL |
| gmode_prepped 3-state / "the gmode arc" | (unverified) | real in brain-memory.md | REAL |
| "17 line-# tags, ~25 stripped (scope-creep)" | line-numbers unverified-stripped | 31 tags, ALL section-anchor, NO line-#s (.md/.html/.transcript/.yaml) | already clean |
| "count 25 vs 17 mismatch" | .md/.html parity broken | .md = 31 == .html = 31 | parity OK |

CONCLUSION: NO surviving 06_9 defect. The inventory is STALE — a prior pass DID convert 06_9's line-numbers to real section anchors and it landed (not left broken/uncommitted). The one named "invented anchor" is real. **06_9 DOWNGRADED from landmine → clean.** Per user decision rule: log the misread, no 06_9 edit. E1a PRE-GATE is REPLACED by a CONFIRMING grep only (zero line-# middle-fields both surfaces + .md==.html==31 tag count); if confirmed clean → 06_9 done, move on. A KNOWN defect can't be skipped, but there is no known defect here.

BROADER IMPLICATION: the inherited B-LINE inventory is proven STALE on 06_9 → EXECUTE MUST re-census ALL B-LINE targets (b7 07_1/07_4/07_5/07_7/07_9, splits 06_2b/06_7b/06_10b) LIVE with grep and let live counts OVERRIDE the inherited claims. They may also be already-clean. Do NOT trust the inventory's "line-number" claims without a live grep.

### B-LINE APPROACH (user STEER-4, 2026-07-17) — Option 3 chosen
VERBATIM user directive:
> "OPTION 3 — live-census + auto-fix survivors, pause if >5 in any one essay... I independently grepped b6/b7/b8 myself just now: ZERO ref-tags contain a :NNN line-number token across all three books. So 'little-to-nothing survives' is almost certainly 'nothing survives' — the B-LINE class looks EMPTY. Still run your own live census in EXECUTE as the authoritative pass; don't take my spot-check as the census. Two constraints on any survivor you DO find: 1. Fix by STRIPPING line-number -> section-name anchor (durable, matches 06_9's style). Never just re-point the number — it will drift again. 2. If the >5 breaker trips, show me the survivor list + your proposed new anchors before editing that essay (like 06_9). Otherwise trust the grep and proceed."

Operationalized (E1 B-LINE REVISED): EXECUTE runs the AUTHORITATIVE live census — main-session grep every ref-tag middle-field across b6/b7/b8 for `:NNN` line-number tokens. Expected EMPTY (user spot-check + 06_9 both clean). Any survivor: FIX = strip line-# → stable section-name anchor (NEVER re-point the number). >5 survivors in ONE essay → PAUSE, show survivor list + proposed new anchors, get user eyeball before editing that essay. B-LINE is now a CONFIRM-EMPTY step, not a fix batch.

[KNOWLEDGE]{ref-tag-live-census-over-stale-inventory — a repeatable ref-tag job treats the live deterministic grep as ground truth and any precompiled backlog/inventory (e.g. b6-reftag-sweep-job-state.md) as a STALE HINT to re-verify, never as fact. STEER-4 2026-07-17: the inherited 06_9 "landmine" was already-clean; user + live grep found zero :NNN tokens across b6/b7/b8. Trust the live check over any inherited list.}

## CONDENSE Memory-Forms (NOT execute — memory-layer)
- **C1 regen-path doc drift:** fix bare tools/… → .claude/tools/… in b6/CLAUDE.md "Tooling notes" (~L69-71) + blog-update SKILL.md (ls-confirm SKILL.md path first).
- **C2 substrate:** the ONE already-emitted [PENDING-JOB]{substrate-plugin-ref-tag-drift-batch} — verify exactly one; NEVER fix inline.
- **C3 tracker:** record each synced anchor in .claude/knowledge/ref-tag-review/backlog-status.md (Status + Cycle-closed); ls-confirm path first.
- **C4:** the 4 already-emitted [DRAFT-TERM] notes → CONDENSE deposits [draft] stubs in context.

## Acceptance Contract (3 gates — all MAIN-SESSION greps)
- **G1 grep-zero:** line-# middle-field grep = 0 on 06_9 · 07_1/07_4/07_5/07_7/07_9 · splits(if present) — BOTH .md+.html; banned grep -i '13 plugins|thirteen plugins' = 0 across b6/b7/b8.
- **G2 mirror:** per edited essay, .md ref-tag count == .html ref-tag count (exact 100%, grep -c both); regen exit-0; .html newer than .md; no unrelated line shift (regen idempotence).
- **G3 anchor/whitespace:** every new 06_9 anchor greps non-zero in cited impl; zero collapsed-space-after-extension; B-B7V essay count == live voice.xml SUM (hooks+scripts).
- **G4 scope:** substrate = exactly ONE [PENDING-JOB]; tracker + .gitignore updated.

## Execute Scope (nearest-CLAUDE.md declarations)
- blog/b6/ (06_9, splits) — declared in b6/CLAUDE.md observe-footer (already)
- blog/b7/ (07_1/07_3/07_4/07_5/07_6/07_7/07_9) — declared in b7/CLAUDE.md observe-footer (already)
- hadi-nayebi.github.io/ root (.gitignore) — declared in root website CLAUDE.md plan-footer (added this cycle)
- blog/b8/ (08_1/08_2/08_4-08_9; 08_3 re-confirm only) — declared in b8/CLAUDE.md plan-footer (added this cycle, user b8-sweep directive)

## Command Pre-Approval
Regen [COMMAND-APPROVE] → **APPROVED** (user, 2026-07-17): path hadi-nayebi.github.io/.claude/tools/generate_blog_html.py in allowed_commands. EXECUTE runs it matching the approved path anchor; VERIFY re-runs for the mirror check. Transcript regen **DECLINED** — do NOT regen transcripts this pass (ref-tag body edits don't change narration).

## Outstanding Items

## Fork resolutions (2026-07-17)
- **fork 1 essay-scope → RESOLVED (user):** bounded b8 FAST census (E5); full b6/b7/b8 coverage, shippable tonight; circuit-breaker on heavy drift.
- **fork 2 diagrams → DISSOLVED (seed/CTO):** b6/b7/b8 diagram surface ≈ 1 on-disk image (quick-phase-map-b6-2.png); the rest are pending generation. No separate audit needed — the census checks that one image's caption/alt-text inline. Revisit when images are generated.
- **fork 3 severity → CLOSED (user verbatim):** "Do NOT re-rank or re-open the severity metric — b8 hits simply append to the EXECUTE fix-list."

[VOICE-UPDATE]{plan-guard-block-voice | it lists allowed scripts but never states "sole command only — no pipe/redirect/&&", the actual trip cause, so a reader retries with a pipe and re-blocks | append "run the command ALONE — no pipe, redirect, or chaining" to the allowed-scripts line}

### PREMORTEM GUARDS (cycle-1 plan-premortem, verdict ACCEPT — folded into E/V, no design change)
Six failure modes → concrete guards that TIGHTEN the existing E-steps / G-gates (they refine VERIFY; they do NOT re-open the user-approved plan):
- **G2 regen idempotence (was tag-count only):** VERIFY runs the regen TWICE per edited essay — the SECOND run must produce zero diff (byte-parity, not just `.md`/`.html` tag-count parity). Catches non-idempotent re-indent / trailing-space / line-ending churn + the asterisk→`<em>` mangling.
- **E2 B-STUB base-first:** grep the EXACT base-count phrasing in EACH of 07_3/07_5/07_6 BEFORE adding the caveat (bases may differ — "11 plugins" vs "thirteen…" vs "13 enforcement tools"); confirm "(2 unimplemented)" reads naturally IN that sentence; only then edit. The G1 banned-grep is necessary, not sufficient.
- **E1/G1 B-LINE full regex:** the census pattern must cover EVERY line-pointer variant, not just `:NNN` — also `:NN-NN` ranges and `#LNNN` GitHub anchors. VERIFY documents the exact regex + hit-count. A weak grep is how the inherited inventory went stale-clean.
- **E5 B8 circuit-breaker THRESHOLD (CTO-set, operationalizes the user "heavy drift" directive):** PAUSE + AskUserQuestion if b8 shows **>5 real context-mismatches in ONE essay OR >12 total** across 08_1/08_2/08_4-08_9. At/under → fix inline + proceed. Removes the "guess" ambiguity without changing the user's intent.
- **G4 substrate routing audit:** VERIFY reads the EXECUTE diff — ANY `.claude/` (plugin-dir) surface touched → FAIL. Verifying/patching a plugin pointer's correctness is BLOCKED; it routes into the ONE [PENDING-JOB], never inline. G4 now audits HOW corrections were routed, not just the [PENDING-JOB] count.
- **E4/C1 ls-before-edit:** run the `ls`/path-confirm BEFORE any regen-path edit and capture it in the acceptance log; a missing file → surface it, never silently write the wrong path.

[AGENT-UPDATE]{post-compact-context-refresher | dispatched during a read-only phase (PLAN/OBSERVE) it is guard-blocked from ALL Bash and code-Read, so it cannot run its git/ls/Read re-grounding and returns a block-report instead of a digest (observed 2026-07-17, plan cycle 1) | add a phase-guard caveat: in PLAN/OBSERVE the refresher can only re-ground from the CLAUDE.md-layer + job.sh/plan.sh state, so the seed should re-ground via main-session Read there and reserve the refresher for EXECUTE/VERIFY/CONDENSE/gmode where Bash is allowed}





---Ex---





---Ve---

### VERIFY (cycle 1, session 3 post-clear 2026-07-17) — acceptance results

**Ground truth:** EXECUTE commit `9e5e6cb` landed `.md`-only B-STUB caveats (07_5 x2, 07_6 x1) + `.gitignore`, and EXPLICITLY DEFERRED `.html` regen + E1/E3/E5 to VERIFY. But `.html` regen is a WRITE (implementation) — VERIFY cannot do it; deferred write work = a backward-to-execute trigger.

**Gate results so far (all MAIN-SESSION greps, D2):**
- **G1 B-LINE (line-# grep-zero) — PASS.** Live census `\.(sh|md|py|yaml|yml|json|conf|txt|xml):[0-9]+` AND `#L[0-9]+` across b6/b7/b8 (`.md`+`.html`) = ZERO. Confirms user spot-check + prior grep; B-LINE class is EMPTY (no strip work needed).
- **G1 banned "13 plugins" — PASS (essays).** Only hits are in `blog/b7/CLAUDE.md` (working memory, NOT a deliverable). Zero in 06_/07_/08_ essay bodies.
- **G2 mirror (B-STUB) — FAIL.** Caveat "unimplemented designs" present in `07_5-docs-and-historian.md` (L29, L33) + `07_6-agents-and-80-20-budget.md` (L25) but ABSENT from their `.html` mirror (never regenerated). → BACKWARD to EXECUTE: regen 07_5 + 07_6 `.html` from `.md` via the approved `generate_blog_html.py`.
- **.gitignore — PASS.** `*.anchor-heals` at L41.

**Still OPEN (verify before routing backward, so the backward pass fixes everything at once):**
- **E3 B-B7V** — voice-count claim not yet checked vs live voice.xml SUM(hooks+scripts).
- **E5 b8 census** — execute claims "65 tags, 0 flags"; needs main-session spot-check (D2 never inherits a subagent count). b8 B-LINE + banned already zero.
- **G4** — substrate `[PENDING-JOB]` count == 1; tracker `backlog-status.md` updated.

**Decision forming:** G2 mirror FAIL is a confirmed backward-to-execute. Finish B-B7V + b8 spot-check + G4 FIRST, then route backward ONCE to regen `.html` (+ any B-B7V fix), avoiding piecemeal trips.

**UPDATE — B-B7V (E3/G3 voice count) — PASS.** Claim lives in `07_3-dual-voice-architecture.md` only (per b7/CLAUDE.md recon). Essay cites plugin_integrity `hooks/voice.xml` = 57 elements + `scripts/voice.xml` = 14. Live `grep -c 'id='`: hooks = **57**, scripts = **14** — EXACT match, NOT drifted. No 07_3 fix needed; no `.html` regen for 07_3 required.

**Remaining before backward route:** (a) b8 bounded spot-check (execute subagent claimed "65 tags, 0 flags"; my b8 B-LINE + banned-13 already ZERO — need a light banned-vocab + pointer spot-check per the user's bounded-census directive, NOT a deep re-audit); (b) G4 substrate `[PENDING-JOB]` count; (c) then verify-commit.sh --backward execute to regen 07_5 + 07_6 `.html`.

### VERIFY VERDICT (cycle 1) — all gates assessed
- **G1 B-LINE line-# (b6/b7/b8, both surfaces): PASS** — `\.(ext):[0-9]+` + `#L[0-9]+` = ZERO.
- **G1 banned "13 plugins" (essays): PASS** — zero; only hits are in `b7/CLAUDE.md` working memory.
- **G2 mirror — B-STUB 07_5/07_6: FAIL** — caveat "unimplemented designs" in `07_5-docs-and-historian.md` (L29,L33) + `07_6-agents-and-80-20-budget.md` (L25), ABSENT from their `.html`. Execute added `.md` only, deferred `.html` regen.
- **E3/G3 B-B7V: PASS** — 07_3 cites hooks=57/scripts=14; live `grep -c id=` = 57/14 exact.
- **E5 b8 bounded census: PASS** — line-#=0, banned-13=0, banned-vocab(sibling-job/PLAN-APPROVAL/YAML-APPROVAL)=0; 08_2 slugs canonical + current. Corroborates subagent 0-flags. Bounded per user (no deep re-audit). **B-PRIN re-confirmed FIXED**: 08_3 `session-archive-full-snapshot` tag cites `context/opevc-condense.md "Session archive (step 7)"` (correct home), NOT the old `phase_condense/docs/principles.md` misattribution; no "last resort" phrasing survives. **B-CNT preserved** (08_3 dated 2026-05-18 snapshot untouched, per user).
- **.gitignore `*.anchor-heals`: PASS** (L41).
- **G4 substrate `[PENDING-JOB]` = 1: PASS** — exactly one consumable bare marker (blog/CLAUDE.md L314); other 16 "PENDING-JOB" strings are prose/backtick refs. (G4 tracker clause = CONDENSE C3, not due at verify.)

**DECISION: FAIL on G2 mirror → route BACKWARD to EXECUTE.** Backward task is narrow: regen `07_5-docs-and-historian.html` + `07_6-agents-and-80-20-budget.html` from their `.md` via approved `generate_blog_html.py`, commit, return to verify, re-check G2 (caveat in `.html`, `.md`==`.html` ref-tag count, regen idempotence twice = byte-parity). All OTHER gates already green. NOTE: b5 precedent (git 1e1f1f9 / a08a325) — generator may run in verify but the multi-git COMMIT of regenerated `.html` needs execute phase, so backward is the correct route. Pre-req: confirm the regen path is in job `allowed_commands` (else neither phase can run it).

**CONDENSE hygiene note (not a verify blocker):** the ---Ob--- MARKED NOTES block (L304-308) holds backtick-wrapped copies of notes that also exist bare (L314-318); only the bare lines are CONDENSE-consumable (`^\[`). Minor duplication to clean at deflate.

### VERIFY (cycle 1, session 4 post-clear 2026-07-17) — re-derived mirror gap, resolving the execute-vs-verify regen fork

**Re-grounded (D2, main-session greps live this session):**
- **Mirror gap CONFIRMED (the one open gate G2):** `07_5-docs-and-historian.md` = **2** `unimplemented`, its `.html` = **0**; `07_6-agents-and-80-20-budget.md` = **1**, its `.html` = **0`. Caveat lives in `.md`, absent from `.html`.
- **Cause CONFIRMED:** `git show --stat 9e5e6cb` = `.md` (07_5, 07_6) + `b7/CLAUDE.md` + `.gitignore` only — NO `.html`. Execute deferred the regen.
- **Both repos CLEAN** (root + website `git status --short` empty) — so `.md` caveat committed, `.html` never regenerated.
- **Approved regen command CONFIRMED in `allowed_commands`:** `python3 | hadi-nayebi.github.io/.claude/tools/generate_blog_html.py | blog/bN/<slug>.md blog/bN/<slug>.html --version <stamp>`. Script exists (`generate_blog_html.py`, 68802 bytes).
- **All other gates re-affirmed from session-3 verdict** (G1 line-# = 0, banned-13 = 0 in essays, B-B7V 57/14 exact, b8 bounded census clean incl. B-PRIN fixed + B-CNT preserved, `.gitignore` done, substrate PENDING-JOB = 1). Those stand unless re-derivation contradicts.

**FORK to resolve before acting:** session-3 footer said backward-to-execute (b5 precedent: multi-git commit of regen'd `.html` needs execute); session-3 compaction carry said regen-in-verify via the approved command. Next step = inspect `verify-commit.sh` vs `execute-commit.sh` to see whether verify can COMMIT the regenerated `.html` deliverable, then pick the phase-clean route (no uncommitted `.html` left behind).

**FORK RESOLVED (session 4, by reading `verify-commit.sh` — fact over newer-note):**
- The `--force` forward path stages **only CLAUDE.md + plan files** (`_stage_verify_targets_in_repo`, L598) — NOT arbitrary project files like `.html`.
- The post-commit **clean-git invariant** (`require_clean_all_repos`, L681, **exit 2**) then REFUSES the forward advance if the regenerated `.html` is uncommitted.
- ∴ regen-in-verify + `verify-commit.sh --force` CANNOT commit the `.html` and CANNOT advance. The **session-3 fresh-carry was WRONG**; the **session-3 footer verdict + b5 precedent are RIGHT**.
- **ROUTE (Option A):** `verify-commit.sh --backward execute --commit` → in EXECUTE regen 07_5+07_6 `.html` (execute has full write + the approved `generate_blog_html.py`; `execute-commit.sh` is multi-git-aware for `.html` deliverables) → `execute-commit.sh --force` back to VERIFY → re-check G2 (caveat in `.html`, `.md`==`.html` ref-tag count, regen idempotence twice = byte-parity) → all gates green → `verify-commit.sh --force` to CONDENSE.
- **LESSON (anti-thrash):** checking the actual script capability, not trusting the most recent note, is what stopped an oscillation. The `.html` is a committed source-of-truth DELIVERABLE; producing+committing a deliverable is EXECUTE's job even though the regen command itself is verify-runnable.
- **EXECUTE pre-step:** grep the current `--version` stamp in each `.html` FIRST and regen with that exact stamp, so the diff = only the caveat (no spurious version churn); confirm regen idempotence.

### VERIFY (cycle 1, session 5 post-clear 2026-07-17) — the ONLY open gate re-confirmed; regen-in-verify path

**Re-grounded (D2 main-session, this session):**
- **Both repos CLEAN** (root + website `git status --short` empty) — `.md` caveat committed, `.html` never regenerated.
- **Mirror gap CONFIRMED (open gate G2):** `07_5-...md` grep `unimplemented` = present (L29,L33), `07_5-...html` = 0; `07_6-...md` = present (L25), `07_6-...html` = 0.
- **Both .html use `?v=20260704`** uniformly (3 asset refs each) → regen with `--version 20260704` so diff = only the caveat.
- **Approved generator:** `hadi-nayebi.github.io/.claude/tools/generate_blog_html.py` (job `allowed_commands`, VERIFY affordance per root CLAUDE.md COMMAND PRE-APPROVAL).
- **Heartbeat debt paid** (6 metacog-reflect this session before any other tool).

**FORK re-opened & to settle EMPIRICALLY (session-4 Option A regen-in-execute vs compaction-8 regen-in-verify):** root CLAUDE.md says `allowed_commands` is what "VERIFY will run" → the generator is a VERIFY affordance, not execute's. Compaction-8 (freshest carry) says execute-guard blocks ALL scripts and that mis-route burned 4 sessions. RESOLUTION: test verify-guard by running the approved generator IN verify; if it runs, ship via `verify-commit.sh --backward execute --commit` (ships .html) → `execute-commit.sh --force` back → re-check G2 → `verify-commit.sh --force` to CONDENSE. Confirm the backward+commit path ships .html by reading verify-commit.sh first.

**FORK RESOLVED EMPIRICALLY (session 5) — compaction-8 was right, regen runs IN VERIFY:**
- **verify-guard L760-793:** the job `allowed_commands` allowlist is checked BEFORE the interpreter-block (L827) — an approved `python3` command `exit 0`s first. Matcher anchors interpreter + the FULL script path `hadi-nayebi.github.io/.claude/tools/generate_blog_html.py` (via `shell_sole_invocation`, no chaining/redirect) → I MUST run from ROOT cwd with the full path, NOT cd into the site.
- **Generator is cwd-independent** (L1007-1009 self-derives website root from `__file__` by walking up to the dir containing `blog/`); only `input_md`/`output_html` are cwd-relative → root-relative arg paths work from root cwd.
- **verify-commit.sh L253-269:** `--backward execute --commit` runs `_stage_verify_targets_in_repo` + `git add -u` per owning repo → sweeps the regenerated `.html` into a multi-git backward commit. So regen-in-verify → backward-commit SHIPS the `.html`. (Session-4 Option A's "regen in execute" assumption was WRONG — allowed_commands is a VERIFY affordance.)

**G2 RESOLVED — both `.html` regenerated in verify (`--version 20260704`, each file's own stamp):**
- **07_5.html:** diff = exactly 2 ref-tags gaining "job_archiver and job_blocker are unimplemented designs" (4 lines, 2±). No version churn, no mangling.
- **07_6.html:** diff = exactly 1 ref-tag gaining "the last two are unimplemented designs" (2 lines, 1±). No B-IMGHTML asterisk→em mangling introduced (title-attr `observe-*`/`condense-*` intact).
- **Idempotence PASS:** 2nd regen of each produced ZERO additional diff (char counts stable 23,041 / 23,624) — byte-parity per premortem G2 guard.
- **NEXT:** grep-confirm `unimplemented` present in both `.html`, then SHIP: `verify-commit.sh --backward execute --commit` → `execute-commit.sh --force` → re-check G2 → `verify-commit.sh --force` to CONDENSE. All other gates already green (G1/E3/E5/G4 per session-4 verdict).
