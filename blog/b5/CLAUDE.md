# CLAUDE.md — Blog 5 Mini-Series (Always-On Digital Cortex)
**Version:** v1.1.0
**Series:** B5 — Pt 1 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture
**Audience:** Power Users & Architects (Tier 2 → Tier 3)
**Last updated:** 2026-05-19 (post-B5.9-feedback /goal: item #2 PLUGIN-LOCK gating updated post-schema-flatten + post-birth-gating; counter state updated 9/9 GOAL with B5.9 re-audit pending)

## Purpose

B5 series working memory. Everything specific to the 9 sub-essays of *The Always-On Digital Cortex* lives here.

Parent context: `../CLAUDE.md` (website-wide working memory) + `../../CLAUDE.md` (agent-side root). This file is the **series compartment** — consolidates what's true about B5 without scrolling the parent files.

## What this mini-series teaches

The seed agent's first layer of cognitive infrastructure: the **always-on plugins** that run continuously regardless of phase, and the **CLAUDE.md hierarchy** they coordinate through. By the end, the reader understands:

- The two-layer architecture (always-on + phasic) and why neither alone is enough
- Each always-on plugin's narrow concern + the composition pattern that lets them act together
- The CLAUDE.md hierarchy as the working-memory substrate
- The historian ratchet as the canonical example of composed-ceremony emergence
- The customization guardrail that decides when plugin-layer edits are admitted at all

Series destination: hand off to B6 (the markov phasic brain) at the closing bridge.

## Canonical terms (series-exclusive)

Ground truth: `hadosh_academy/.claude/context/INDEX.md` (Rule 40 — prose conflicts with a `[consolidated]` definition are prose drift). The cross-cutting job-system vocabulary lives in the parent `../CLAUDE.md` "Canonical Vocabulary" section. The two terms below are **B5-anchored** — they load here, when editing B5 essays:

- **Historian-ratchet steps** — the four positions of the historian-ratchet wheel diagrammed in B5.8 (the ceremony that keeps each plugin's `evolution.md` periodically re-narrated): **Step 1** commits accumulate / the drift counter climbs; **Step 2** `drift_count ≥ DRIFT_THRESHOLD` (default 10) blocks the next `[PLUGIN-LOCK]` unlock; **Step 3** the matching `historian-<plugin>` subagent re-narrates `evolution.md`; **Step 4** the historian commits, the counter resets to zero, the unlock proceeds. _Avoid:_ **"Stage 1-4" (BANNED — "Stage" is reserved for Job Stage 1/2/3)**. The B5.8 image `images/historian-ratchet-b5-8.png` is not yet generated; the `05_8` image-prompt STRICT NAME WHITELIST already specifies "Step 1"–"Step 4" (not "Stage"), so it will render correctly when produced.
- **Self-compact reactivation rhythm** — Heartbeat-1 of the two-heartbeat reactivation model: the coupling between brain_guard's self-compact and a periodic scan-and-flip of repeating jobs past their interval, scoped to the WORKING phase. While the seed is working, every self-compact invocation runs the `scan-repeating-due.sh` scan sequentially (no cron, no daemon, no `PostCompact` hook *during the working phase* — self-compact firing IS the schedule); completed jobs where `repeating_interval > 0 AND (last_completed_at + repeating_interval*3600) < now()` are reactivated. The no-scheduler property does NOT extend to the quiescent phase (when the seed has stopped): reactivation there is driven by the separate Quiescent-phase heartbeat (Heartbeat-2, a detached timer-daemon). _Avoid:_ **scheduler, cron coupling, post-compact hook, reactivation timer for the WORKING phase (all BANNED — the working-phase rhythm IS self-compact firing); a blanket "no timer/no daemon ever" claim (the quiescent phase legitimately uses one)**.

## The 9 sub-essays

| Slug | Title | Audience | Read | Refs | Image | Status |
|------|-------|----------|-----:|-----:|-------|--------|
| `05_1-the-two-layer-foundation` | The Two-Layer Foundation | Tier 2/3 | 6 min | 15 | always-on-plugins-b5-1 | GOAL ACHIEVED 2026-05-18 (R1.b + R2 + R3 all 3 PASS post-L76+L84+L86 fixes) |
| `05_2-plugin-integrity` | `plugin_integrity` — Plugin Edit Safety | Tier 2/3 | 4 min | 17 | plugin-integrity-b5-2 | GOAL ACHIEVED 2026-05-17 |
| `05_3-brain-guard` | `brain_guard` — Context Window Discipline | Tier 2/3 | 8 min | 13 | self-compact-b5-3 | GOAL ACHIEVED 2026-05-17 |
| `05_4-job-core` | `job_core` — Job Lifecycle | Tier 2/3 | 7 min | 12 | job-core-b5-4 | GOAL ACHIEVED 2026-05-18 (R3 all 3 PASS post-L74-split) |
| `05_5-interaction-summary` | `interaction_summary` — Mega-Prompt Compression | Tier 2/3 | 5 min | 8 | interaction-summary-b5-5 | GOAL ACHIEVED 2026-05-18 (R1+R2+R3 all 3 PASS, bypass-removal verified verbatim) |
| `05_6-question-discipline` | `question_discipline` — Structured Questions | Tier 2/3 | 5 min | 13 | question-shapes-compel-production-b5-6 | GOAL ACHIEVED 2026-05-17 |
| `05_7-claude-md-hierarchy` | The CLAUDE.md Hierarchy | Tier 2/3 | 12 min | 20 | claude-md-anchors-b5-7 | GOAL ACHIEVED 2026-05-17 |
| `05_8-historian-ratchet` | The Historian Ratchet | Tier 3 | 10 min | 14 | historian-ratchet-b5-8 + ...-8b (2 images) | GOAL ACHIEVED 2026-05-18 (R1+R2.b+R3 PASS post-L73 count-as-noun rescue, commit 21f0ccf) |
| `05_9-customization-guardrail` | The Customization Guardrail | Tier 3 | 10 min | 16 | customization-guardrails-b5-9 | GOAL ACHIEVED 2026-05-17 |

**Counter state (2026-05-19):** 9/9 GOAL ACHIEVED across the series. Post-2026-05-19 prototype work (B5.9 feedback /goal — 8 commits 9ea9c958/8b8d6329/ec75186d/79dee6d9/d4f2726a/06767b3/8f4f61d/a6df0f9) re-touched B5.9 (full rewrite + R-fixes) and B5.4 (3 ref-tag cascade fixes). Both essays carry their post-feedback content; B5.9 re-audit pending (post-C6/C7 verification step).

## Asset inventory

All B5 series assets compartmentalized under this subdir:

```
blog/b5/
  CLAUDE.md                              (this file)
  05_1-the-two-layer-foundation.{md,html,transcript.md}
  05_2-plugin-integrity.{md,html,transcript.md}
  05_3-brain-guard.{md,html,transcript.md}
  05_4-job-core.{md,html,transcript.md}
  05_5-interaction-summary.{md,html,transcript.md}
  05_6-question-discipline.{md,html,transcript.md}
  05_7-claude-md-hierarchy.{md,html,transcript.md}
  05_8-historian-ratchet.{md,html,transcript.md}
  05_9-customization-guardrail.{md,html,transcript.md}
  images/
    always-on-digital-cortex-b5.png    # series banner — og:image for B5.2-B5.9 (added 2026-05-19)
    always-on-plugins-b5-1.png
    plugin-integrity-b5-2.png
    self-compact-b5-3.png
    job-core-b5-4.png
    interaction-summary-b5-5.png
    question-shapes-compel-production-b5-6.png
    claude-md-anchors-b5-7.png
    historian-ratchet-b5-8.png
    historian-ratchet-b5-8b.png
    customization-guardrails-b5-9.png
  audio/                                  (will appear when MP3s are generated)
```

**Audio:** zero MP3 files exist yet. Audio gen is USER-GATED per Rule 12 (paid TTS spend) AND per 2026-05-18 user condition ("only and only if the text is the absolute final and transcript reads what users will read/listen"). Triple-verify every transcript before any audio API call.

## URL convention (post-restructure 2026-05-18)

Live URLs are `https://hadi-nayebi.github.io/blog/b5/05_X-<slug>.html`. The old root-level URLs (`blog/05_X-<slug>.html`) return 404 — restructure was approved with no redirects.

All cross-essay links across the site (originals, B6/B7/B8, sitemap.xml, feed.xml, blog.html) updated to point at `/blog/b5/05_X-...html`.

## Tooling notes

- **Build:** `python3 tools/generate_blog_html.py blog/b5/<slug>.md blog/b5/<slug>.html --version 20260518`
- The generator autodetects subdir from output path and switches to depth-aware mode (`../../` site-nav, canonical URL with subdir segment, audio path in subdir's `audio/`, etc.)
- **Transcript:** `python3 tools/generate_blog_transcript.py blog/b5/<slug>.md blog/b5/<slug>.transcript.md` (always resets `final: false`; user flips to `true` to authorize audio gen)
- **Audio:** `python3 tools/generate_blog_audio.py blog/b5/<slug>.transcript.md blog/b5/audio/<slug>.mp3` (script refuses unless `final: true`; ~$0.75/essay on tts-1-hd)

## Key durable decisions banked in this series

These calls were made during B5 authoring and apply across the series:

1. **`interaction_summary` bypass-list REMOVED** (prototype commit `b77071cd` + blog align commit `fd17f54`, 2026-05-18). The summary-guard no longer exempts infrastructure-prefixed `AskUserQuestion` from the block — escape path is `summary.sh submit` (a Bash call already in the whitelist). Per Rule 26 (blog-as-spec). B5.5 L47+L61 rewritten + image placeholder reworked.
2. **PLUGIN-LOCK gating verified implemented** at `lock-manager.sh` "Gmode-OR-plugin_lock_approval gate" section. Both existing-plugin edits AND new plugin BIRTH require EITHER `current_phase == "gmode"` OR focused job's top-level `plugin_lock_approval == true` (post-2026-05-19 schema flatten dropped the prior `completion_requirements` wrapper; post-2026-05-19 birth-gating change removed the prior multi-cycle-EXECUTE bypass). The block voice distinguishes "existing plugin)" vs "new plugin birth)" via the `action_label`; the gate logic is identical. All 137 lock-manager tests PASS. Documented in `.claude/knowledge/identity/plugin-lock-privilege.md` (Fact 2 deep-dive) + `user-approved-jobs.md` (Fact 3).
3. **Categorical-not-count discipline applied series-wide** per Rule 30 sweep (2026-05-17/18). Multiple essays had dim 6 count-as-noun fixes:
   - B5.1 L82 "Three plugins compose" → "Single-concern plugins compose"
   - B5.4 L60/L74 "two stages"/"a hundred words" → categorical rescue
   - B5.5 L29/L45 + L51 (during B5.8 fixes) — canonical "(prototype sets X; your seed can tune it)" rescue pattern
   - B5.8 L19/L71/L77/L109 comprehensive sweep — drops all "Three plugins"/"Five phases" load-bearing counts
4. **Image style discipline (chalk-on-blackboard)** is non-negotiable per `../CLAUDE.md` Image Style section. Every B5 image-prompt carries: `Chalk-on-blackboard`, `Match opevc-cycle-blackboard.png exactly`, `STRICT NAME WHITELIST`, `Caption`.
5. **Ref-tag density ≥80%** per Rule 28 — verified across all 9 essays by `blog-ref-tag-auditor v0.3 dim R8`. Transitional paragraphs (opener bridges, closer bridges, rhetorical punches, single-line aphorisms) appropriately skip; every factual paragraph naming a Layer-1 specific carries an in-paragraph ref-tag.

## Cross-references

- Parent: `../CLAUDE.md` (website-wide working memory)
- Sibling series (future): `../b6/CLAUDE.md`, `../b7/CLAUDE.md`, `../b8/CLAUDE.md` (will exist when B6-B8 reach their own subdir-restructure)
- Auditor specs (used to drive B5 to publishable state): `../../.claude/agents/blog-{quality,ref-tag,series-coherence}-auditor.md`
- Rule 30 (anti-pattern sweep) banked at: `../../.claude/CLAUDE.md` Rule 30
- /goal job memory: `~/.claude/projects/<this-project>/memory/jobs/job_goal_3_clean_rounds_b5_b8.md`

---Ob---

**Cycle-4 forward-ref (ref-tag job 1781248437814993567).** Next run re-activates this dir for the **b5 B-LINE remainder 05_3–05_5** (18 tags, pre-censused 6/7/5 — a MAP, re-confirm BY CONTENT) + the B-LINE-3F third-field sweep. Method + criteria: silo `../../../.claude/knowledge/ref-tag-review/CLAUDE.md` + `run-5-cycle-3-lessons.md`. b5 `.md` gitignored → main-session acts; no `[JOB-APPROVE-PLUGIN]` (published prose).

## ACTIVE JOB — single-cycle ref-tag line-number fix, 05_5-interaction-summary (job 1782018675569981227, Stage 1)

**Scope:** THIS dir (`blog/b5/`) activated for EXECUTE. Execute edits TWO files here:
- `05_5-interaction-summary.md` (the `*[ref: slug | source-pointer | content-summary]*` inline tags) — root-repo-tracked (gitignored from website git)
- `05_5-interaction-summary.html` (the `title="..."` attr on each `<sup class="ref-marker">`) — website-repo-tracked

One-off: ~5 line-number-pointer tags in this ONE essay. NOT a full B-LINE sweep; NOT the 3F third-field sweep.

**Ref-tag ground rules (from `.claude/context/identity.md` consolidated term + `knowledge/ref-tag-review/` silo):**
- **Stable pointer shape:** MIDDLE field = `file.ext` (or `file + file2` joined by ` + `) **plus a section/function name** — e.g. `lock-manager.sh (Gmode-OR gate)`. **Line numbers BANNED** ("not worth maintaining").
- **Reduction rule (B-LINE):** drop only the `:LINE` specifics → replace with a stable named anchor LIFTED FROM THE TAG'S OWN SUMMARY (which usually names the symbol), ground-truthed main-session. If summary names no symbol → READ the cited file, find nearest enclosing stable anchor (function / named block / `## heading` / quoted comment). If lines span an unnamed region → FILE-LEVEL + descriptive phrase. **NEVER empty, NEVER re-baked numbers, NEVER left stale.**
- **Keep:** slug + value-bearing content-summary (≤120w). Drop ONLY drifted line-number specifics.
- **Mirror invariant:** fix BOTH surfaces IDENTICALLY — `.md` `*[ref:...]*` AND `.html` `title="..."`. Do NOT blind-regenerate the HTML (risks clobbering hand-edits); TARGETED hand-edit of both. Prior precedent: root `905d51db` + website `fcbf5c4`.
- **D2 ground-truth:** run the census + verify EVERY cited claim MAIN-SESSION (subagents fetch, I adjudicate — they fabricate citations). Census: `grep -nE '\*\[ref:[^]]*\.[A-Za-z0-9]+:[0-9]' ...05_5*.md` (line-number pointers in middle field). Census by OCCURRENCE (`grep -oP`), not line. Third-field `:digits` are OUT of scope (B-LINE-3F debt).
- **No `[WAITING]`:** this is decide-and-fix maintenance, not a design fork.

### Inventory + ground-truthed reduction map (8 tags total; 5 carry line-number MIDDLE pointers)

Tags WITHOUT line numbers (NO CHANGE): `interaction-summary-exists-to-keep` (L25), `without-interaction-summary-long-jobs` (L51), `summary-length-knobs` (L61).

**5 FIX TARGETS — middle source-pointer field only. Each new anchor ground-truthed MAIN-SESSION against the live file (the named section/array/arm verified to EXIST):**

| Tag (.md line) | slug | OLD middle pointer (drop `:LINE`) | NEW stable pointer (verified) |
|---|---|---|---|
| L45 | `two-phase-enforcement-post-then-pre` | `token-counter.sh:120-134 + summary.sh:287-302 + summary-guard.sh:2,114-115 + config.conf:36` | `token-counter.sh (Token Computation section) + summary.sh (flip-needed arm) + summary-guard.sh (Job State Read section) + config.conf (TOKEN_THRESHOLD)` |
| L47 | `enforcement-runs-in-two-phases` | `summary.sh:230-236,277 + summary-guard.sh:119-128` | `summary.sh (REQUIRED_SECTIONS array + submit summary_chain append) + summary-guard.sh (Command Whitelist section)` |
| L57 | `summary-threshold-config` | `config.conf:36` | `config.conf (TOKEN_THRESHOLD)` |
| L59 | `five-section-template-source` | `summary.sh:230-236` | `summary.sh (REQUIRED_SECTIONS array)` |
| L63 | `append-only-chain-shape` | `summary.sh:277` | `summary.sh (submit arm — summary_chain append)` |

(All paths keep their full `.claude/plugins/interaction_summary/...` prefix as in the source; only the `:LINE` token is replaced by the parenthetical anchor.)

**Ground-truth evidence (read main-session):**
- `token-counter.sh` L119 `# ### Token Computation` → L124 `unsummarized_count=...` → L134 threshold check. ✓
- `config.conf` L36 `TOKEN_THRESHOLD="${TOKEN_THRESHOLD:-500}"` (Section 2 knob). ✓
- `summary.sh` L230-236 `REQUIRED_SECTIONS=(...)` array; L277 `.summary_chain += [{...}]` inside the `submit` arm; L287 `# #### flip-needed` → L288 `flip-needed)` case arm. ✓
- `summary-guard.sh` L109 `# ### Job State Read` (reads `summary_needed`, L114-116); L118 `# ### Command Whitelist` → L119-129 (allow `summary.sh submit` + read-only `job.sh focused|show|list`). ✓

**KEEP the content-summary (3rd field) verbatim** — only the MIDDLE field changes. NOTE: 3rd-field summaries of L45/L47/L63 still contain `L287-302`/`L114`/`L115`/`:2`/`:36`/`line 277`/`:119-128` line refs — these are **B-LINE-3F debt, OUT of scope** this one-off job, already tracked in `knowledge/ref-tag-review/backlog-status.md` (do NOT touch, do NOT create a duplicate job).

**MIRROR (.html):** `05_5-interaction-summary.html` `title="..."` lines confirmed matching the `.md` exactly for all 8 tags (.html L132/141/143/147/153/155/157/159). The 5 fixed `title=` attrs get the SAME new pointer string (targeted hand-edit, no blind regen).

**OBSERVE seal (post-compact resume).** Cycle-1 custom gates closed this session: job NAMED (`ref-tag line-number fix 05_5-interaction-summary`) + objective EXPANDED to the 300-500w working form (both were empty after the prompt-hook bootstrap — the sealed compaction Forward State had missed them). Inventory + ground-truthed reduction map + Ve checklist + marked notes already banked (prior session). Scope FROZEN for PLAN: 5 MIDDLE-field line-number tags, decide-and-fix, no `[WAITING]`. Ready to advance OBSERVE→PLAN.

### Scope-declaration pointer (working memory lives in the tracked job-dir file)

The STAGING-BLOCKER + JOB-OWNERSHIP-fork prose that sat here was **RESOLVED by the user (2026-06-21): NOT a seed bug — the "scope block" was a misread.** The altered-list is edit-based (data.json), gitignore-independent, so editing this gitignored file DOES declare `blog/b5/` editable for EXECUTE. The only real constraint was that `observe-commit` needs a *committable* CLAUDE.md update — satisfied by putting working memory in the **tracked** job-dir file.

- **Committable working memory + canonical marked notes:** `.claude/jobs/1782018675569981227/CLAUDE.md` (root-tracked). This file is **scope-declaration ONLY** — no working memory, no marked notes (they were duplicated here and are now owned solely by the job-dir file).
- **Both `05_5-interaction-summary.{md,html}` are WEBSITE-repo-tracked** (one dir, one activation). EXECUTE's multi-git commit groups both to the website git; the job-dir CLAUDE.md commits to root. All repos end clean.
- **Finish HERE** — single-cycle Stage-1, no gmode, no recreate-the-repeatable-owner now (separate vehicle, tracked as a `[PENDING-JOB]` in the job-dir file).

---Pl---

## PLAN scope-declaration — ref-tag line-number sweep (job 1782320396187605322, cycle 1)

**This dir (`blog/b5/`) is activated for EXECUTE.** Strip every line number from every ref-tag in
the B5 essays — middle pointer AND any 3rd-field echo — and replace with the STABLE anchor: filename
+ the cited file's own heading/section/function NAME + distinctive keywords. Edit BOTH `.md`
(`*[ref:…]*`) AND `.html` (`title="…"`) — mirror invariant, targeted hand-edit, never blind regen.

- **Per-file targets (grep -c map; EXACT tag count re-greped at fix-time): b5 = 16** —
  `05_4`:8 · `05_5`:5 · `05_2`:2 · `05_7`:1.
- One `execute-file-editor` dispatch per essay file (both `.md` + `.html` in the same dispatch).
- Commits land in the website git (multi-git aware). NOTE: b5 `.md` is gitignored from the website
  git but root-tracked; execute-commit groups each file to its owning repo.
- Stale "ACTIVE JOB — 05_5 line-number fix (job 1782018675569981227)" block above (L120) is
  working-memory drift from a completed/pruned job → a CONDENSE cleanup note, NOT a blog-body fix.
- **Re-registered this PLAN pass (post-clear resume):** the altered list reset to the job dir at the
  `/clear` boundary, so this dir is re-touched HERE to re-declare `blog/b5/` editable for EXECUTE;
  the per-file map stands and EXECUTE re-greps each `.md` at fix-time (census MAP, not ground truth).

---Ex---

---Ve---

### Verify checklist — ref-tag line-number fix, 05_5 (job 1782018675569981227)

- [ ] Census re-run MAIN-SESSION: `grep -onE '\*\[ref:[^]]*\.[A-Za-z0-9]+:[0-9]' 05_5-interaction-summary.md` returns ZERO line-number pointers (was ~5)
- [ ] Every fixed tag's NEW middle-field pointer is stable (file + section/function), NO `:LINE` / `L<n>` token
- [ ] Each fixed tag still carries its slug + a value-bearing content-summary (not emptied, not a `pending` shell)
- [ ] Every NEW pointer ground-truthed MAIN-SESSION: the cited file exists AND the named section/function/anchor actually exists in it
- [ ] Mirror invariant: each fixed `.md` tag's new pointer appears IDENTICALLY in the `.html` `title="..."` — grep ≥1 fixed tag's title in the `.html` and confirm it matches the `.md`
- [ ] No collateral edits: only the targeted line-number tags changed (git diff shows only intended pointer changes; no blind HTML regen)
- [ ] Third-field `:digits` (B-LINE-3F) left untouched — out of scope this job
- [ ] Both repos clean after commit (root for `.md`, website for `.html`; multi-git execute-commit grouped each file)
