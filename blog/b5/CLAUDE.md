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

## OBSERVE — ref-tag review pass (b5), cycle 1

**Ref-tag convention (discovered by observe-codebase-explorer):**
- Format: `<sup class="ref-marker" title="ref: <slug> | <file-pointer> | <summary>">&#9432;</sup>`
- **Greppable token: `class="ref-marker"`** (uniform across all 9 files — single convention, no union grep needed). Done-check by grep IS feasible.
- 158 tags across 05_1..05_9 (.html). Per-file: 05_1=14, 05_2=17, 05_3=25, 05_4=18, 05_5=8, 05_6=15, 05_7=22, 05_8=14, 05_9=25.

**Steering banked (user, this session):**
- Drift-class PRIORITY: (1) retired-mechanism pointers, (2) stale summaries, (3) moved/renamed pointers. **Missing-tag coverage gaps DEPRIORITIZED** — not counted toward the five.
- Fix SCOPE: **b5 only** this pass. Note any b6/b7/b8 spread as follow-up; do NOT fix out-of-b5.
- Fix RULE: a drifted tag is REDUCED to stable useful content (slug + file/section pointer + summary; NO line numbers) — never emptied, never left stale.
- DONE = 5 verified families fixed + deterministic grep at zero + issue-classes recorded; USER calls done, not the seed.

**FIX-DEPTH (user answered): "Tags only"** — fix just the tag's three fields (slug/pointer/summary); leave body prose; record body drift as follow-up. Done-grep scoped to tags.

**⚠️ CONTRADICTION TO RESOLVE FIRST — before counting ANY family: do b5 .html essays even CONTAIN ref-marker tags?**
- Discovery subagent claimed 158 `<sup class="ref-marker">` tags across 05_1..05_9 (05_3=25), with 05_3 examples referencing `ACCRUAL_*`.
- Grep-sweep subagent (18 tool-uses) claims ZERO `ref-marker` tags in ANY b5 .html; zero retired tokens.
- 05_3-enumerator subagent hit a context ceiling, NEVER read the file.
- I tried to Read 05_3 myself to settle it — BLOCKED by the %-of-window Read gate (27%). NOT yet ground-truthed. Two subagents directly conflict → trust NEITHER; my own eyes decide.
- >>> RESOLVE IMMEDIATELY AFTER COMPACT: directly Read `05_3-brain-guard.html` with my OWN eyes. If `ref-marker` tags exist → discovery was right, proceed to enumerate + verify Family #1's tags. If they DON'T → discovery FABRICATED its examples; the tags likely live in the gitignored `.md` SOURCE as `*[ref: slug | pointer | summary]*` (blog/CLAUDE.md: generator converts `.md` italic-bracket refs → `<sup class="ref-marker">` in `.html` — so HTML has them ONLY IF regenerated; some essays may be stale). Re-scope where the tags actually are before any fix.

**SESSION-2 RE-GROUNDING (corroboration on the contradiction — own-eyes read STILL the decider):**
- Two INDEPENDENT documentation sources now corroborate the DISCOVERY subagent (tags EXIST in `.html`), against the grep-sweep's zero:
  1. `blog/CLAUDE.md` Content Workflow: `.html` is the committed source of truth; the generator converts `.md` italic-bracket `*[ref: slug | pointer | summary]*` → `<sup class="ref-marker">` in `.html`.
  2. THIS file's "9 sub-essays" table: every essay carries a Refs count (05_3 = 13) AND line ~106 records "Ref-tag density ≥80% verified across all 9 essays by blog-ref-tag-auditor v0.3 dim R8".
- PRIOR now shifts strongly to: ref-marker tags DO exist in the b5 `.html`; the grep-sweep ZERO is the likely-wrong report (wrong token / wrong dir / fabrication). Per D2 ground-truth, my OWN-eyes Read of `05_3-brain-guard.html` STILL decides before I count any family.
- COUNT-MISMATCH to check during enumeration: discovery said 05_3 = 25 tags; the table Refs column says 13. If both `.md` and `.html` carry tags, a mismatch may mean the `.html` is STALE vs its `.md` source — itself a possible drift signal (moved/renamed or regeneration lag).

**✅ CONTRADICTION RESOLVED (own-eyes Read of `05_3-brain-guard.html`, session-2):**
- The `.html` CONTAINS **25 `ref-marker` tags** — I enumerated them directly. The DISCOVERY subagent (25) was RIGHT; the grep-sweep subagent (ZERO) FABRICATED → dismissed per D2 / Rule 23. Done-check by `grep -c 'class="ref-marker"'` on the `.html` is confirmed feasible.
- The b5-table "Refs" column (13) is a STALE/different tally (likely counted `.md` italic-brackets at an earlier regen); the live `.html` is the source of truth for the fix. Table can be corrected during CONDENSE, low priority.

**CANDIDATE FAMILY #1 — accrual → %-of-window supersession (retired-mechanism, Class A). 4 tags located in 05_3 by own-eyes read; impl re-verification in progress:**
- The 4 accrual-family `ref-marker` tags in `05_3-brain-guard.html` (identified by their `title=`):
  1. slug `a-pre-call-sensor-reads` (body ¶ "A pre-call sensor reads…") — pointer `config.conf (ACCRUAL_SOFT / ACCRUAL_READ_BLOCK / ACCRUAL_CRITICAL) + brain-memory.md "Accrual-anchored boundaries"`; summary quotes `ACCRUAL_SOFT=120000` etc.
  2. slug `tier-positions-are-tunable` — pointer `context-gate.sh "GRADUATED HARD-GATE, ACCRUAL-ANCHORED" header`; summary quotes the accrual bands.
  3. slug `accrual-boundaries-tunable-config` — pointer `config.conf (ACCRUAL_*) + brain-memory.md "Accrual-anchored boundaries"`.
  4. slug `tier-count-customizable` — pointer `config.conf (ACCRUAL_*) + context-gate.sh "GRADUATED HARD-GATE"`.
- CANONICAL current design (auto-injected root CLAUDE.md + .claude/CLAUDE.md): **%-of-window** (owner ruling 2026-07-09) — `CONTEXT_READ_PCT` 25% / `CONTEXT_CRITICAL_PCT` 30% of `MAX_CONTEXT_TOKENS`, NO baseline, NO accrual; explicitly "supersedes the 2026-07-04 accrual-anchored boundaries."
- NEXT: ground-truth the LIVE `config.conf` (are ACCRUAL_* deleted → CONTEXT_*_PCT?) + the LIVE `brain-memory.md` boundaries section name (is it now "%-of-window boundaries"?). Only after own-eyes impl confirm do I COUNT Family #1 as verified problem #1. Body prose ALSO teaches accrual, but per FIX-DEPTH="Tags only" I fix ONLY these tags and record body-prose drift as a follow-up note.

**✅ FAMILY #1 VERIFIED — problem #1 of 5 (own-eyes LIVE config.conf, session-2):**
- `config.conf` L14-15: "CONTEXT-GATE trigger points — %-of-WINDOW (owner ruling 2026-07-09 — supersedes the accrual-anchored ACCRUAL_SOFT / ACCRUAL_READ_BLOCK gate knobs)". Live gate knobs: `CONTEXT_SOFT_PCT=20` / `CONTEXT_READ_PCT=25` / `CONTEXT_CRITICAL_PCT=30`. `ACCRUAL_SOFT` + `ACCRUAL_READ_BLOCK` are DELETED. → the 4 accrual-family tags in 05_3 are RETIRED-MECHANISM (Class A) drift. CONFIRMED.
- FIX NUANCE (banked to compaction Assumptions & Risks): `ACCRUAL_CRITICAL=180000` is RETAINED (heartbeat tempo + stop-gate wedge-yield, via accrual-helper.sh) — the reduction must NOT say all accrual is dead; reduce ONLY the context-gate tags → `CONTEXT_*_PCT`. Before reducing, own-eyes VERIFY the correct target names: brain-memory.md section (likely renamed "Accrual-anchored boundaries" → "%-of-window boundaries") + context-gate.sh header (may no longer say "ACCRUAL-ANCHORED").

**SCAN FAN-OUT (session-2, in flight) — 4 observe-contradiction-finder subagents scanning the other 8 b5 essays for candidate drifted tags (I verify every flag with my own eyes before counting):**
- A → 05_4-job-core + 05_5-interaction-summary (watch: retired `plan_state`/seal; summary bypass-list change).
- B → 05_6-question-discipline + 05_9-customization-guardrail (watch: retired points/`[POINT-BOOST]`/multiplier → min-max gate; guardrail OR-gate not "single/AND/gmode-only").
- C → 05_7-claude-md-hierarchy + 05_8-historian-ratchet (watch: root/.claude CLAUDE.md renamed SECTION pointers = Class C dead links; condense-waterfall + historian "Step 1-4" mechanics).
- D → 05_1-two-layer + 05_2-plugin-integrity (watch: always-on roster/count; plugin_integrity registry counts; OR-gate).
- Each subagent flags {essay·slug·class·tag-text·impl-evidence·confidence} + reports per-essay tag COUNT. Family-grouping heuristic: group flagged tags by the SUPERSEDING IMPLEMENTATION EVENT (one code change = one family across essays).

`[AGENT-UPDATE]`{observe-contradiction-finder | scanner B bailed at 26%-of-window: subagents inherit the heavy injected-CLAUDE.md baseline (~26% of 1M) which nearly fills the 25% Read-block, leaving no room to Read essay HTML — but it BAILED instead of falling back to Grep, which the context-gate does NOT block (matcher is Read|Edit|Write|MultiEdit only). | direction: when the %-of-window Read block trips, fall back to Grep/Bash (ungated) to extract ref-marker tags + grep impl tokens; do NOT bail on the whole dispatch. Give ref-tag-scan subagents a Grep-first method so the injected baseline never starves the scan.}
- METHOD ADAPTATION (this run): if the other 3 scanners also bail on context, re-run the scan via my own targeted Grep (Grep is NOT context-gated) OR re-dispatch Grep-first. Do NOT let the injected baseline block the hunt.

**CANDIDATE FAMILY #1 — accrual → %-of-window supersession (retired-mechanism). Impl-change CONFIRMED; TAG-LEVEL UNVERIFIED — NOT counted as a found problem yet.**
- CONFIRMED by my OWN read of `.claude/plugins/brain_guard/config.conf`: gate knobs are now `CONTEXT_SOFT_PCT`/`CONTEXT_READ_PCT`/`CONTEXT_CRITICAL_PCT` (%-of-window); `ACCRUAL_SOFT`/`ACCRUAL_READ_BLOCK` DELETED; comment L14-15 "supersedes the accrual-anchored … gate knobs" (2026-07-09). The retired MECHANISM is real.
- Corroborated by `.claude/plugins/brain_guard/CLAUDE.md` "%-of-window boundaries": old `SOFT/READ/CRITICAL_THRESHOLD_TIER` knobs RETIRED.
- UNVERIFIED: whether any 05_3 TAG actually points at the retired accrual knobs — this came ONLY from the discovery subagent's example, DIRECTLY CONTRADICTED by the grep-sweep. Do NOT count until read with my own eyes. Once confirmed: fix = REDUCE each such tag to the %-of-window pointer (`config.conf CONTEXT_*_PCT` + brain-memory.md current "%-of-window boundaries" section), no line numbers.

**PROCESS INSIGHT (banked):** Reading a CLAUDE.md auto-includes its whole PARENT CHAIN (root + .claude/ + plugins/ + brain_guard/), which balloons accrual FAST and trips the heartbeat + cadence gates. In observe: prefer reading IMPLEMENTATION files (`config.conf`, `.sh`, non-CLAUDE `.md`) and the essay `.html` directly; delegate breadth to subagents; avoid reading CLAUDE.md chains once the local one is in hand.

**Issue-class taxonomy (emerging) + family-grouping heuristic:**
- Class A — retired-mechanism pointer: tag names a knob/section/mechanism that was superseded.
- Class B — stale summary: summary prose describes behavior the code no longer does.
- Class C — moved/renamed pointer: file/section renamed or relocated (dead link).
- **Family-grouping heuristic:** group drifted tags by the SUPERSEDING IMPLEMENTATION EVENT — one code change (e.g. the 2026-07-09 %-of-window ruling) drifts every tag that referenced the old model, across essays. A "family" = all tags keyed to one retired mechanism. This is the reusable lesson for a future run.

**✅ SESSION-3 — CANDIDATE VERIFICATION COMPLETE (own-eyes via a Grep-first subagent returning verbatim tag text):**

**✅ FAMILY #2 VERIFIED — problem #2 (moved/renamed, Class C). 1 tag in `05_7-claude-md-hierarchy.html`:**
- Tag (line 167), slug `footers-replace-chat-working-memory`, pointer cites `phase_condense/docs/principles.md "Principle 9 — Five Markers as Cross-Phase Signal System" section`.
- LIVE heading (principles.md line 93): `### 9. Five CONDENSE Markers as Cross-Phase Signal System`. The section was RENAMED — `Principle 9 —` → `9.` AND `Five Markers` → `Five **CONDENSE** Markers`. Dead-link (Class C) CONFIRMED.
- FIX (Tags only): repoint the tag's section title to the live heading `9. Five CONDENSE Markers as Cross-Phase Signal System`; keep slug + summary. Deterministic grep-at-zero: the old string `Principle 9 — Five Markers` must return 0 in 05_7.

**❌ 05_9 candidate DISMISSED — NOT a family (issue-class: naive-grep false-positive):**
- All 5 flagged tags (lines 120/137/139/151/212 in `05_9-customization-guardrail.html`) cite CORRECT references. The guardrail admission IS an OR-gate; the tags correctly state the block "fires iff both arms fail" — that is the right design, not drift.
- Root cause: the session-2 scanner used a naive bare-token AND grep with NO verbatim tag text (D2/Rule-3 fabrication risk). Own-eyes verbatim read clears it. Record issue-class "naive-grep false-positive" — do NOT count.

**NET VERIFIED FAMILY COUNT = 2 (target was 5):**
- Family 1 — accrual → %-of-window (Class A retired-mechanism): 4 tags in `05_3-brain-guard.html`.
- Family 2 — Five-Markers section renamed (Class C moved/renamed): 1 tag in `05_7-claude-md-hierarchy.html`.
- Priority classes (retired-mechanism / stale-summary / moved-renamed) across all 9 essays yield ONLY these 2. The deprioritized classes (missing-tag coverage, stale COUNTS like the 05_3 table 13-vs-25 mismatch) were NOT scanned toward the five (per user steering). Corpus genuinely holds fewer than 5 priority-class families — do NOT invent problems (family-vs-instance).
- >>> ARCHITECT DECISION — ANSWERED (Fable, session-3). Superseded by the binding steering below.

**✅ ARCHITECT STEERING (Fable, session-3) — DEFINITION OF DONE REPLACED (binding):**

A ref-tag exists for ONE job: keep a blog paragraph in sync with the CODE and the `.claude/context/` directory. The review is complete only when EVERY b5 essay (all 9: 05_1..05_9) is checked OWN-EYES (Grep-first, deterministic) against the FULL 5-class failure taxonomy:
1. **MISSING tag** — a paragraph makes a code/context claim with no ref-tag anchoring it.
2. **WRONG info** — the tag's claim is incorrect.
3. **TOO-MUCH** — the tag over-scopes / claims more than the code/context supports.
4. **OUT-OF-SYNC vs CODE** — the tagged claim drifted from the code (stale COUNTS, renamed symbols).
5. **OUT-OF-SYNC vs context/** — the tagged claim drifted from the `.claude/context/` directory.

**Binding corrections to my prior framing:**
- The count is an OUTPUT of complete coverage, NOT a target. "5" was never a quota — do NOT invent problems to reach it, do NOT stop at 2. Whatever truly surfaces (2, 5, 7) is the answer.
- My "2" was a NARROWED-LENS artifact: I deprioritized missing-tags (class 1) + stale-COUNTS (class 4) — the MOST central thing a ref-tag is FOR. The `05_3` table 13-vs-25 mismatch IS a real class-4 ref-tag defect, not a nicety.
- The 6 "clean" essays are subagent-claimed (Rule 3) against a narrow lens — CANNOT conclude a count on unverified clean claims; re-scan own-eyes.
- Fold prior option-2 (deprioritized classes) + option-3 (re-scan the clean) into ONE pass across all 9 essays × all 5 classes, Grep-first.
- Then fix Tags-only with a grep-at-zero per family; record every issue-class (incl. the 05_9 naive-grep false-positive). Deliver to the architect the verified families + per-family deterministic grep when coverage is complete.

**SCAN IN FLIGHT (session-3, 5 Grep-first `observe-contradiction-finder` subagents, all 9 essays × 5 classes):**
- A → 05_1 + 05_2 · B → 05_3 (heavy, incl. the TRUE ref-marker tag count) · C → 05_4 + 05_5 · D → 05_6 + 05_7 · E → 05_8 + 05_9.
- Each returns verbatim tag title + verbatim live-code/context evidence + class(1-5) + confidence. I own-eyes verify EVERY flag against the live file before counting (Rule 3 / D2).

**SCAN FINDINGS (session-3, 4 of 5 scanners returned; 05_6/05_7 pending):**

*True ref-marker COUNTS (grep -c per essay):* 05_1=14, 05_2=17, 05_3=25, 05_4=18, 05_5=8, 05_8=14, 05_9=25 (05_6/05_7 pending).

*Candidate families (own-eyes verify each flag before final count):*
- **F1 — accrual → %-of-window supersession (class 2 + 4).** `05_3` GROWS to 5 tags: L125 (class-2 WRONG summary — "hard gate at ACCRUAL_READ_BLOCK / baseline+~160k") + L141/L143/L193/L203 (class-4 retired `ACCRUAL_SOFT`/`ACCRUAL_READ_BLOCK` knobs). Live = %-of-window `CONTEXT_*_PCT` (owner ruling 2026-07-09; `ACCRUAL_CRITICAL` RETAINED for heartbeat/stop-gate). Grep-at-zero: `ACCRUAL_SOFT\|ACCRUAL_READ_BLOCK` inside 05_3 ref-markers → 0.
- **F2 — Five-Markers section renamed (class 4).** `05_7` L167 tag `footers-replace-chat-working-memory` cites `Principle 9 — Five Markers…`; live heading = `9. Five CONDENSE Markers as Cross-Phase Signal System`. Grep-at-zero: `Principle 9 — Five Markers` → 0.
- **F3 (candidate) — embedded LINE-NUMBERS in ref-tags (class 4 + Rule-20 violation).** `05_1` L190 tag `single-concern-principle-minimize-rule` cites `(line 85)`→live 87 and `at line 240`→live 277. Line numbers are BANNED by Rule 20 everywhere — so this is drift AND policy. Need a full-corpus grep for tags carrying `line [0-9]` / `:[0-9]` to size this family.
- **F4 (candidate) — b5 CLAUDE.md "9 sub-essays" table Refs column stale (class 4, architect-named in-scope).** Table Refs vs live grep -c: 05_3 says 13 / live 25; 05_4 says 12 / live 18. Collect all 9 rows' stated-vs-live and correct.

*Clean so far (subagent-claimed; own-eyes still owed):* 05_2 (17 tags), 05_5 (8), 05_4 (except the table count). 05_9: the 5 OR-gate tags (L120/137/139/151/212) CONFIRMED correct — false-positive retracted.

*COVERAGE GAPS — must close before concluding the count:*
- Class-1 (MISSING) under-verified for 05_1/05_2 (subagent grep couldn't scan full paragraphs).
- 05_8: only a few tags verified; 05_9: 20 of 25 tags unchecked (classes 1/3/4/5). Both scanners hit the ~26%-of-window injected-CLAUDE.md baseline → Read-block at 25% → bailed (recurring subagent-balloon).
- 05_6/05_7 scanner still in flight (may also bail).
- **METHOD FIX:** narrow single-essay PURE-grep subagents (NEVER Read, targeted greps only, compact output) + one DETERMINISTIC banned-token/line-number grep pass across all 9 (deterministic per architect's grep-at-zero).

**SESSION-4 — FULL-TAXONOMY COVERAGE PASS (re-grounded post-4th-compact; heartbeat debt paid via 9 reflections into fresh compaction file):**

Executing the architect's binding done-definition: EVERY b5 essay (all 9) own-eyes Grep-first against ALL 5 classes (1 MISSING · 2 WRONG · 3 TOO-MUCH · 4 out-of-sync-vs-CODE · 5 out-of-sync-vs-context). Count is an OUTPUT of complete coverage, never a target.

- **5 grep-only `observe-contradiction-finder` scanners dispatched** (method: PURE-Grep, NEVER Read the HTML — subagents balloon on the ~26% injected baseline; Grep is not context-gated). Each returns verbatim tag line + verbatim live-code/context evidence + class(1-5) + confidence. **I own-eyes verify EVERY flag before it counts (Rule 3 / D2).**
  - S1 → 05_6 (full) + 05_5 (re-scan "clean")
  - S2 → 05_7 (full 22 tags; confirm F2 @ L167 + find others)
  - S3 → 05_9 (all 25; the 20 unverified beyond the 5 OR-gate tags)
  - S4 → 05_2 + 05_4 (re-scan "clean"; watch retired `plan_state`, count drift)
  - S5 → 05_1 (line-numbers → F3) + 05_8 (historian count → F5) + 05_3 (the other ~20 tags beyond F1)
- **Standing families carried in:** F1 accrual→%-of-window (05_3, 5 tags, VERIFIED) · F2 Five-Markers rename (05_7 L167, VERIFIED) · F3 line-numbers corpus-wide (candidate, false-positive strip owed) · F4 b5 table Refs stale (candidate) · F5 historian centralization (05_8, candidate).
- **NEXT after scanners return:** own-eyes verify each flag → strip F3 false-positives (dates/versions/Groups) → land FINAL family count + per-family deterministic grep-at-zero → write forward Ve criteria → raise ONE done-[WAITING] to the architect (families + greps; architect calls done, never self-close).

**SCAN RETURNS — S1 (05_6+05_5) + S2 (05_7). Candidates below; own-eyes verification still OWED before any counts:**
- **05_5 — CLEAN** (8 tags, all grep-evidenced against live `interaction_summary/**`; no BYPASS_PREFIXES token, correctly absent). Own-eyes spot-check low-risk but owed.
- **05_6 — 1 candidate:** L151 slug `coverage-uneven-by-design` still frames the retired `[POINT-BOOST]` per-prefix "maturation question" as OPEN; live registry = 9 active prefixes, no `[POINT-BOOST]` (retired). Class 4 retired-mechanism. ⚠️ CROSS-CHECK: the b5 Current-Posts note says this tag was "emptied" in commit f522501 (points-retirement) — VERIFY the CURRENT L151 tag text own-eyes before counting (may already be reduced).
- **05_7 — F2 CONFIRMED** (L167 `footers-replace-chat-working-memory`: `Principle 9 — Five Markers` → live `9. Five CONDENSE Markers as Cross-Phase Signal System`). **PLUS 3 line-number tags → FOLD INTO F3 (line-number family):** L161 `asymmetry-is-intentional-forward-write` (cites `section-check.sh line 276 / 282-291`), L183 `second-consequence-altered-list` (cites `execute-guard.sh Comment line 822`), L185 `claude-md-edits-gate-execution` (cites `plan-tracker.sh comment line 126`). All Rule-20 violations regardless of whether the number is currently right.
- **F3 is emerging as the BIG cross-essay family** (line numbers in tag pointers): 05_1 (L190), 05_7 (L161/183/185), + pending 05_2/others. ONE family (one policy = Rule 20), many instances. Grep-at-zero target: no `line [0-9]` / `:[0-9][0-9]` inside any b5 ref-marker title.

**✅ SOURCE-OF-TRUTH RESOLVED (session-5, own-eyes `blog/CLAUDE.md` Content Workflow + b5 line 142):**
- **`.html` = committed source-of-truth** (served + git-tracked), GENERATED by `python3 tools/generate_blog_html.py <slug>.md <slug>.html`. **`.md` = editable source** (gitignored, local-only). Ref-marker `<sup class="ref-marker" title="ref: slug | pointer | summary">` tags are converted FROM the `.md` italic-bracket `*[ref: slug | pointer | summary]*`.
- **FIX MECHANIC (execute, tags-only):** edit the `*[ref: …]*` bracket in the `.md` → regenerate the `.html` (or edit both directly) so BOTH end consistent; per Rule 32 fix source-of-truth not just output. **Grep-at-zero done-check runs on `.html`** (the committed surface); also confirm `.md` so a future regen never reintroduces drift.
- RISK RETIRED: editing `.html` is NOT wasted-by-rebuild — the `.md`→`.html` pair is the intended flow; just keep both in sync.

**SESSION-5 — FULL-TAXONOMY COVERAGE PASS (re-grounded post-5th-compact; heartbeat paid via 6 reflections):**
- Executing the architect's binding done-def: EVERY b5 essay own-eyes Grep-first × all 5 classes. Count = OUTPUT of coverage, never a target.
- **7 PURE-Grep scanners dispatched** (never Read whole HTML — subagents balloon on the injected baseline; Grep is not context-gated): S1→05_1 · S2→05_2+05_5 · S3→05_3 · S4→05_4+05_6 · S5→05_7 · S6→05_8+05_9 · S7→deterministic line-number sweep (all 9, owns F3 sizing). Each returns verbatim tag title + verbatim live evidence + class(2-5); **I own-eyes verify EVERY flag before it counts (Rule 3 / D2).**
- **Standing VERIFIED (persisted, survive clears):** F1 accrual→%-of-window (05_3, 5 tags: L125 wrong-summary + L141/L143/L193/L203 retired ACCRUAL_SOFT/ACCRUAL_READ_BLOCK; ACCRUAL_CRITICAL RETAINED) · F2 Five-Markers rename (05_7 L167 `Principle 9 — Five Markers` → `9. Five CONDENSE Markers…`).
- **Candidates to size own-eyes:** F3 line-numbers (S7) · F4 stale-COUNTS (b5 table + any in-essay count) · F5 historian centralization (05_8) · 05_6 L151 `coverage-uneven-by-design` (may already be reduced by commit f522501 — verify current text).
- **NEXT after scanners return:** own-eyes verify each flag → strip F3 false-positives (dates/versions/counts are LEGAL; only file:line POINTERS violate Rule 20) → land FINAL family count + per-family deterministic grep-at-zero → write forward Ve criteria → raise ONE done-[WAITING] to the architect (families + greps; architect calls done).

**SCAN RESULTS — batch 1 (S1 05_1 / S2 05_2+05_5 / S3 05_3 returned; own-eyes verification PENDING per Rule 3 / D2):**
- **05_3 = 25 tags. F1 GROWS to 7 tags** (scanner 100%-conf, each cited live config.conf): L125, L141, L143, **L145 (NEW — `file-size-ramp` summary quotes "baseline+~120k/~160k/~180k")**, L193, **L201 (NEW — `dispatch-mechanism-customization`; WEAK — its pointer is `BRAIN_GUARD_WINDOW_NAME` dispatch knobs, only a SECONDARY accrual mention)**, L203. Core 5 (L125/141/143/193/203) match prior verified set. OWN-EYES SPOT-CHECK L145 + L201 before counting (L201 may be partial/false — a tag whose PRIMARY pointer is fine).
- **05_1 = 14 tags. 1 flag → F3 (line-numbers):** L190 `single-concern-principle-minimize-rule` cites `line 85` + `line 240` (→ live 237) in `execute-guard.sh`. Summary CORRECT; only the line-numbers drift → F3 instance (strip line-nums, keep file+section pointer).
- **05_2 = 17 tags. 1 WEAK flag (likely FALSE-POSITIVE):** L166 `prefix-registry-current-entries` cites "9 active prefixes" — scanner ITSELF says the tag "correctly names 9". OWN-EYES: if live registry count = 9, DISMISS (a nicety "should enumerate", not drift).
- **05_5 = 8 tags. 1 flag UNVERIFIED — scanner quoted MY b5-note text, NOT the live tag (D2 fabrication risk):** claimed a tag cites `prefix-registry.conf:20` (scanner says file nonexistent). Scanner CONFLATED interaction_summary with question_discipline's hardcoded registry — DO NOT TRUST. MUST own-eyes read the actual 05_5 tag AND check whether interaction_summary has its OWN bypass-list/config file.
- **Still to launch (min-max paced):** S4 (05_4+05_6), S5 (05_7), S6 (05_8+05_9), S7 (deterministic line-number sweep → F3 corpus sizing).

**SESSION-6 — CONVERGENCE PLAN (behavioral fix: STOP re-dispatching scanner fan-outs; they balloon on the ~26% injected baseline + compact before verification lands. Scanner FLAGGING is DONE — the missing step is OWN-EYES Read verification, which the architect MANDATED over delegation: "re-scan them yourself," "cannot conclude a count on unverified clean claims."):**
- **Method this run:** own-eyes **Read** each essay (known paths — the guard-endorsed observe tool for named files), bank per-essay class-1..5 verdicts IMMEDIATELY after each (min-max synthesis + continuity), carry the rest at self-compact so sessions COMPOUND, never re-scan.
- **Standing VERIFIED (survive clears):** F1 accrual→%-of-window (05_3: L125 wrong-summary + L141/L143/L193/L203 retired ACCRUAL_SOFT/ACCRUAL_READ_BLOCK; ACCRUAL_CRITICAL RETAINED) · F2 Five-Markers rename (05_7 L167 `Principle 9 — Five Markers` → `9. Five CONDENSE Markers…`).
- **Own-eyes verification ledger (✅=done this pass / ⬜=owed):**
  - ⬜ 05_1 (14 tags) — confirm F3 L190 line-nums; scan 13 others + class-1 missing.
  - ⬜ 05_2 (17 tags) — verify L166 "9 prefixes" (dismiss if live=9); scan rest.
  - ⬜ 05_3 (25 tags) — F1's 5 core VERIFIED; spot-check L145/L201 candidates; scan other ~18 + missing.
  - ⬜ 05_4 (18 tags) — "clean" claim UNVERIFIED; own-eyes all + table-count note.
  - ⬜ 05_5 (8 tags) — resolve the interaction_summary/question_discipline registry confusion own-eyes.
  - ⬜ 05_6 (15 tags) — L151 `coverage-uneven-by-design`: may ALREADY be reduced by commit f522501 — read CURRENT text.
  - ⬜ 05_7 (22 tags) — F2 VERIFIED; F3 L161/L183/L185 line-nums; scan rest + missing.
  - ⬜ 05_8 (14 tags) — F5 historian-centralization candidate; own-eyes all.
  - ⬜ 05_9 (25 tags) — 5 OR-gate tags CONFIRMED correct; 20 others owed.
- **Family status:** F1 ✅ · F2 ✅ · F3 (line-numbers, Rule-20) candidate — CONFIRMED instances 05_1 L190 + 05_7 L161/183/185, needs corpus sizing + false-positive strip (dates/versions/counts are LEGAL; only file:line POINTERS violate) · F4 (stale-COUNTS) candidate · F5 (historian 05_8) candidate.
- **Then:** land FINAL family list + per-family deterministic grep-at-zero → PLAN (Stage-1, `set-plan-file false`) → EXECUTE tags-only fixes (`.md` bracket + `.html` regen per source-of-truth) → VERIFY greps-at-zero → raise ONE done-[WAITING] to architect (families + greps; architect calls done — hold the F4-scope question: is the b5-CLAUDE.md table a ref-tag defect or out-of-scope working-memory?).

**✅ 05_1 OWN-EYES COMPLETE (session-6):**
- **True tag count = 15** across 14 lines (L186 carries TWO tags on one line). ⚠️ `grep -c 'class="ref-marker"'` under-counts (14) — the deterministic done-grep must use `grep -o` for accurate per-essay counts.
- **F3 CONFIRMED (line-numbers):** L190 `single-concern-principle-minimize-rule` contains literal `(line 85)` + `at line 240` in its title= pointer → Rule-20 violation. Fix: strip the two `line N` clauses, keep the `execute-guard.sh (PHASE_SH import + phase.sh current call)` file+section pointer.
- **NEW — 05_1 L136 stale quoted-summary** (`cognition-as-memory-multi-form`, class-2 WRONG + class-4 stale-COUNT): summary quotes `.claude/CLAUDE.md` Components as `"...The sole reference for building and decision-making"` — LIVE `.claude/CLAUDE.md ### knowledge/` reads `"the durable, monotonically-growing reference for building and decision-making"` (no "sole"). AND quotes `knowledge/identity/` = `"INDEX + 5 deep-dives"` — LIVE reads `"INDEX + one deep-dive per identity fact"`; identity now carries **6** facts. Verified against injected live `.claude/CLAUDE.md`. Tags-only fixable.
- **Owed quote-verification (tags quoting plugin CLAUDE.md / settings.local.json — read those live files once, targeted pass):** L138 + L186a `brain_guard/CLAUDE.md Objective+Status` ("context-aware self-compact loop" / "Feature #1 … LIVE in two dispatch modes" — SUSPECT post phasic-compaction upgrade); L142 `settings.local.json` hook list; L184 + L186b plugin Objective quotes.
- **Class-1 (missing):** clean — every code/context-claim ¶ carries a tag; analogy/transition/roadmap ¶s correctly untagged.

**✅ 05_2 OWN-EYES COMPLETE (session-6) — F3 IS THE DOMINANT FAMILY:**
- **17 tags.** **KEY POLICY POINT:** current ref-tag policy (revised Rule 20, 2026-06-10, canonical in `.claude/context/identity.md` "ref-tag" + blog/CLAUDE.md "ref-tag" term) bans line numbers **EVERYWHERE** — the OLD "stable plugin code MAY keep file:line" exception is RETIRED. So EVERY ref-marker title carrying a `line N` / `:NN` / `L<digit>` file:line pointer is an F3 defect, incl. plugin-code pointers.
- **F3 (line-numbers) in 05_2 = 6 tags:** L119 (`(L11)(L23)(L43)(L53)(L123)(L153)` → settings.local.json hook lines) · L143 (`phase.sh L340-365/L343/L361/L364-365`) · L156 (`safe-lock.sh L283-305`) · L164 (`line 222`) · L168 (`line 269`) · L170 (`lock-manager.sh L182-198` + `L60-65`). Fix = strip the line-number clauses, keep file+section/function pointer.
- **F4 (stale-COUNT) candidates in 05_2 (class-4 — counts are LEGAL but a WRONG count is drift; verify against LIVE plugins/CLAUDE.md before counting):** L141 test-counts `plugin_integrity 604/20, phase_observe 271/8, phase_plan 298/8, phase_execute 376/9, phase_verify 204/7, phase_condense ~288/13`; L162 `TIGHT-COMPLETE v0.10.1, 604 tests/20` (also attributed to `.claude/CLAUDE.md plugin_integrity row` — live `.claude/CLAUDE.md` has NO per-plugin version/count table → possible misattribution); L166 `9 active prefixes` + enumerated 9 (PLUGIN-LOCK/TEST-LOCK/GMODE/JOB-COMPLETE/JOB-APPROVE-CREATION/JOB-APPROVE-PLUGIN/REPEAT-JOB/REPORT-TO-UPSTREAM/WAITING) — MEMORY.md corroborates "9 active prefixes" → likely CORRECT, DISMISS if live registry=9.
- **Owed quote-verify:** L133/L158 quote `plugin_integrity/CLAUDE.md` Objective (verbatim, likely stable); L139 quotes voice-id text; L152 unlock-briefing.
- **Class-1 (missing):** clean.
- **RESTRATEGY:** F3 is pervasive → it is almost certainly the LARGEST family and the cleanest deterministic grep (line-number pointer inside any ref-marker title → 0). Every essay must be swept for it.

**✅ SESSION-7 — FULL-CORPUS COVERAGE via 3 PURE-GREP subagents (wedge broken: no whole-HTML reads in main session). All 9 essays now covered own-eyes-or-grep-evidenced against all 5 classes.**

*Method fix that broke the 6-session wedge:* heavy scan → pure-grep subagents (verbatim return); main session holds only structured evidence + surgical targeted-line Reads. Banked to compaction Process Insight.

**Subagent returns (all 3 back):**
- **S-A (F3 line-number sweep, all 9):** F3 tags = 05_1 L190(1) · 05_2 L119/L156/L164/L168/L170(5) · 05_6 L129/L135/L141(3, NEW) · 05_7 L161/L183/L185 + L133(4, L133 NEW). 05_3/05_4/05_5/05_8/05_9 = 0 line-number tags. **TOTAL ≈ 13 tags.**
- **S-B (05_4/05_5/05_6 content-drift):** ALL CLEAN (class 2/4/5). 05_4=18 tags, 05_5=8, 05_6=15 all verified vs live. **05_5 has NO bypass-list (removed 2026-05-18) → session-6 registry-confusion open thread CLOSED.** 05_6 "85 tests / 9 prefixes" correct; [POINT-BOOST] retired confirmed.
- **S-C (05_3/05_8/05_9):** 05_3 F1 = exactly 5 tags (L125 class-2 wrong-summary + L141/L143/L193/L203 class-4 retired ACCRUAL_SOFT/ACCRUAL_READ_BLOCK); ACCRUAL_CRITICAL=180000 RETAINED (stop-gate). Rest of 05_3's ~20 tags CLEAN. **05_8 CLEAN (14 tags) → F5 historian-centralization DISMISSED (Step terminology consistent).** 05_9 CLEAN (25 tags, incl. 5 OR-gate).

**FINAL FAMILY SLATE (ref-tag defects in ESSAY bodies):**
- **F1 — accrual→%-of-window** (05_3, **5 tags** L125/L141/L143/L193/L203). Class 2+4. VERIFIED. Grep-at-zero: `grep -i 'ACCRUAL_SOFT\|ACCRUAL_READ_BLOCK' 05_3…html` → 0 AND `grep 'ACCRUAL-ANCHORED' 05_3…html` → 0.
- **F2 — "Principle 9 — Five Markers" section renamed** (05_7 L167, **1 tag**). Class-4. VERIFIED. Grep-at-zero: `grep 'Principle 9 — Five Markers' 05_7…html` → 0 (live heading = `9. Five CONDENSE Markers as Cross-Phase Signal System`).
- **F3 — line-numbers in ref-tag pointers** (Rule-20 bans everywhere), **14 tags** (05_1:1 L190 · 05_2:6 L119/L143/L156/L164/L168/L170 · 05_6:3 L129/L135/L141 · 05_7:4 L133/L161/L183/L185). Class-4 + policy. DOMINANT. Line refs appear in BOTH the pointer field (05_2 L119 `(L11)(L23)…`) AND the summary field (05_6 L135 `capture.sh:85-131`, 05_7 L133 `currently L4`) — the ban is whole-tag. Grep-at-zero: no `line [0-9]` / file`:NN` / `L[0-9]` file-location inside any b5 ref-marker `title=`.

**CLASSES 1/3/5 — clean across the corpus:** 05_1+05_2 own-eyes class-1 clean (session-6); S-B/S-C found no class-1/3/5 in 05_3–05_9. Count is an OUTPUT of coverage → **3 in-essay ref-tag families** surface (F1, F2, F3); F5 dismissed.

**⬜ OWN-EYES OWED before FINAL count (D2/Rule 3 — subagent flags never counted unverified):**
- 05_6 L129/L135/L141 — NEW F3 flags, slugs+verbatim not yet own-eyed.
- 05_7 L133 — NEW F3 flag, slug+verbatim not yet own-eyed.
- 05_2 L143 — DISCREPANCY: session-6 own-eyes found it F3 (`phase.sh L340-365…`); S-A did NOT flag it. Settle by own-eyes (if F3, 05_2=6 not 5).

**⚖️ F4 — SCOPE QUESTION FOR ARCHITECT (candidate, HOLD as [WAITING]):** the b5-CLAUDE.md "9 sub-essays" table **Refs column is stale vs live grep-c** — stale rows 05_3(13→25), 05_4(12→18), 05_6(13→15), 05_7(20→22), 05_9(16→25); correct rows 05_1/05_2/05_5/05_8. Architect named the "05_3 table 13-vs-25 mismatch" a real class-4 defect — BUT this table is **working memory in blog/b5/CLAUDE.md, not an inline essay ref-tag**. Genuine judgment: is F4 in-scope (fix the table) or out-of-scope working-memory (correct separately)? → ONE [WAITING] to architect alongside the family slate.

**NEXT:** reset min-max gate via this synthesis → surgical Reads of the 4 owed F3 lines → land FINAL F3 count → raise ONE done-[WAITING] to architect (F1/F2/F3 families + per-family grep-at-zero + the F4-scope question) → on approval, advance observe→plan (Stage-1).

**✅ SESSION-8 — OWED OWN-EYES CLOSED (surgical targeted-line Reads, verbatim tag text):**

*F3 (line-number) confirmations — all 5 owed lines verified F3 by their verbatim `title=` text:*
- **05_6 L129** `pre-call-hook-walks-questions` — summary carries `line 135` → F3 ✓
- **05_6 L135** `per-prefix-shape-gates` — summary carries `capture.sh:85-131` → F3 ✓
- **05_6 L141** `waiting-current-vs-future-shape` — summary carries `gmode-gate.sh:54-63` → F3 ✓
- **05_7 L133** `the-native-loading-is-layered` — summary carries `currently L4` → F3 ✓
- **05_2 L143** `friction-tracks-danger-gmode` — summary carries `phase.sh L340-365`/`L343`/`L361`/`L364-365` → F3 ✓ (SETTLES the session-7 discrepancy: L143 IS F3; 05_2 F3 count = 6 confirmed).
- **F3 FINAL = 14 tags CONFIRMED** (05_1:1 L190 · 05_2:6 L119/L143/L156/L164/L168/L170 · 05_6:3 L129/L135/L141 · 05_7:4 L133/L161/L183/L185). Grep-at-zero holds.

*05_7 L131 `but-as-the-first-essay` — DISMISSED (false-positive):* pointer cites `blog/b1/01-llms-are-not-the-agents.md`; the body links `../b1/01-...html` LIVE and the `.md` exists locally (gitignored → Glob-skip artifact). Valid ref, not drift. Issue-class "naive-Glob false-positive" (same class as the 05_9 dismissal).

**⚠️ NEW FAMILY SURFACED — F5 stale-quoted-summary (class-2): a ref-tag SUMMARY quotes verbatim text from a live file that has since changed.** Session-7's F3-focused pure-grep pass did NOT fold these in — genuine coverage gap (the architect warned: cannot conclude on unverified "clean" claims).
- **05_1 L136** `cognition-as-memory-multi-form` — **CONFIRMED class-2** (verified against the ALREADY-INJECTED live `.claude/CLAUDE.md` this session): tag quotes `.claude/CLAUDE.md` knowledge/ as "…The **sole** reference for building and decision-making" — LIVE reads "the **durable, monotonically-growing** reference…" (no "sole"); tag quotes `knowledge/identity/` = "INDEX + **5** deep-dives" — LIVE reads "INDEX + **one deep-dive per identity fact**"; identity now carries **6** facts (root CLAUDE.md "Six facts about who you are"). Tags-only fixable (reduce quote → stable section pointer + accurate summary).
- **05_7 L127** `drop-a-file-named-claude` — CANDIDATE (owed live-grep): quotes `brain_guard/hooks/CLAUDE.md` header as "# hooks/ — Status: Live — Feature #1 hooks shipped…" + count "116 CLAUDE.md files (111 carrying all four phase footers)". Needs own-eyes grep of the live file header + the file counts.
- **05_1 L138/L142/L184/L186** — OWED quote-verify (session-6 carried): L138+L186a quote `brain_guard/CLAUDE.md` Objective+Status ("context-aware self-compact loop" / "Feature #1 … LIVE in two dispatch modes" — SUSPECT post phasic-compaction upgrade); L142 quotes `settings.local.json` hook list; L184+L186b plugin Objective quotes.
- **Grep-at-zero (F5):** each confirmed stale quote's OLD verbatim string returns 0 inside its essay after fix.

**>>> RESUME NEXT (session-8): dispatch ONE grep-first subagent to close the F5 owed quote-verifications (05_7 L127 + 05_1 L138/L142/L184/L186) against the LIVE files → finalize F5 membership → SET THE OBJECTIVE (empty for 8 sessions, blocks force-advance) → raise ONE done-[WAITING] to architect (F1/F2/F3/F5 families + per-family grep-at-zero + F4-table-counts scope question) → on architect steer, advance observe→plan (Stage-1, set-plan-file false).**

**✅ OBJECTIVE SET + EXPANDED (session-8) — cycle-1 duty done (seed 115w → expansion ~377w). The 8-session force-advance blocker is cleared.**

**⚠️ F5 SUBAGENT BAILED (session-8) — the recurring wedge, now on a grep-instructed subagent.** The observe-contradiction-finder dispatched to verify F5 candidates hit its own 27%-of-window ceiling and returned WITHOUT verdicts (it tried to grep the blog HTML for tag text, but the ref-marker `title=` lines are so long they filled its context). ROOT CAUSE: verifying a verbatim-quote tag needs (a) the tag's long `title=` text AND (b) the live nested-plugin CLAUDE.md it quotes — reading either balloons; subagents inherit the ~26% injected baseline so they bail near-immediately. This is NOT a numeric task, so the "verify against live file" step genuinely wants GREP, which the OBSERVE main session lacks (VERIFY/EXECUTE have it).

**F5 STATUS (honest):** 05_1 L136 = CONFIRMED class-2 stale-quote (verified from injected live files). 05_7 L127 + 05_1 L138/L142/L184/L186 = CANDIDATES, precisely located but NOT yet grep-verified against their live files. F5's membership is not a single deterministic grep (each tag quotes a different file/phrase) — so it is costlier to enumerate than F1/F2/F3.

**DECISION (session-8): STOP grinding F5 in observe. F5 is a NEW family the architect has not scoped.** Per the Stage-1 collaborative contract, surface it in the done-[WAITING] BEFORE over-investing: present F1/F2/F3 (coverage-complete, deterministic greps) + F5 (1 confirmed + candidates, with the balloon obstacle) + the F4-table-counts scope question. Let the architect steer whether F5 is in-scope and where its candidate verification should run (a grep-native phase: EXECUTE/VERIFY, or a follow-up job). Do NOT re-dispatch the ballooning subagent (3-blocks discipline).

**>>> RESUME NEXT: raise the done-[WAITING] to the architect (this is the collaborative checkpoint the architect explicitly requested: "bring me the verified families + per-family grep when coverage is complete"). On the architect's steer re F4/F5, advance observe→plan (Stage-1, set-plan-file false); F5 candidate grep-verification runs in the grep-native phase.**

[AGENT-UPDATE]{observe-contradiction-finder | dispatched grep-first to verify F5 verbatim-quote candidates, STILL ballooned to 27%-of-window and returned NO verdicts (it grepped the blog HTML for the tag text, but ref-marker title= lines are so long they filled its context; it then tried to self-compact, which a subagent cannot do). | direction: for quote-verification, the MAIN session extracts the short quoted phrase via targeted Read, then the subagent greps ONLY the live files for that short phrase — never grep/Read the blog HTML for tag text, never read a nested CLAUDE.md whole. Add a hard rule to the agent def: a subagent CANNOT cross a compaction boundary; on hitting the ceiling it must RETURN partial findings, never attempt self-compact.}
[VOICE-UPDATE]{observe-commit-force-summary-file-requirement (observe→plan boundary block) | It HARD-requires a rolling --summary FILE, but observe-guard forbids writing ANY non-CLAUDE.md file in observe (Write to a scratch summary file is blocked), so the observe→plan advance is unreachable in-phase; the operator self-compact Prior-Summary fix (no scratch file) did NOT reach this boundary path. This is a substrate contradiction, not a seed error. | direction: make observe-commit --force read the rolling summary from the compaction file's ## Prior Summary (no scratch --summary file), matching the self-compact fix; OR exempt the boundary summary-file write from observe-guard so the seed can author it.}
---Pl---

## PLAN — b5 ref-tag review (Stage 1, cycle 1)

**Stage:** 1 (single-cycle collaborative). `plan_file=false` committed — actionable steps live in these footers, no plan file.

**Fix objective:** reduce every drifted b5 ref-tag to stable useful content (slug + VERIFIED file/section-or-function pointer + accurate summary), **TAGS ONLY**, **b5 essays only**, each fix proven by a deterministic grep-at-zero on the committed `.html`. **Coverage is NOT yet sound** (grep-only for 7 of 9 essays — see the RESOLVED steer below); the SOUND own-eyes 1/3/5 pass runs in EXECUTE/VERIFY, then the ARCHITECT calls DONE at CONDENSE.

**Verified family slate (ready to fix):**
- **F1** accrual→%-of-window · `05_3` · 5 tags (class 2+4)
- **F2** "Principle 9 — Five Markers" rename · `05_7` · 1 tag (class 4)
- **F3** line-numbers in pointers (Rule 20) · `05_1 / 05_2 / 05_6 / 05_7` · 14 tags (class 4 + policy)
- **F5** stale-quoted-summary · `05_1` L136 confirmed · 1 tag (class 2)

**Fix mechanic (source-of-truth):** edit the `.md` italic-bracket ref `*[ref: slug | pointer | summary]*` → regenerate the `.html` via `python3 tools/generate_blog_html.py blog/b5/<slug>.md blog/b5/<slug>.html --version <stamp>`. Both surfaces end consistent; grep-at-zero runs on `.html`.

**Reduction standard (what a fixed tag looks like):** slug unchanged · pointer = stable file + section/function name **verified to exist in the live file** (Growth Rule 8), NO line numbers · summary = accurate current-behavior description. Never emptied, never left stale, never paraphrased-but-still-stale.

**Risk mitigations (from premortem — EXECUTE must hold these):**
1. **Regen-validation gate** — after each regen, confirm the `.html` rebuilt: command exit 0 + file non-empty + contains `<!DOCTYPE`. Else FAIL-STOP. Silent `.md`↔`.html` desync is the top risk (grep can pass on a stale `.html`).
2. **New-pointer existence check** — before writing a repointed tag, grep the LIVE target to confirm it exists (F1 → `config.conf` `CONTEXT_*_PCT` + `brain-memory.md` "%-of-window boundaries"; F2 → `phase_condense/docs/principles.md` "9. Five CONDENSE Markers…").
3. **ACCRUAL_CRITICAL is RETAINED** — never delete it (heartbeat/stop-gate); the F1 zero-grep excludes it on purpose. Own-eyes each F1 tag; do NOT blanket-delete "accrual".
4. **Grep LOCATES, own-eyes ARBITRATES** — the literal greps find candidates; EXECUTE reads each located tag to catch variant line-number forms + paraphrased-stale quotes the pattern misses.
5. **Scope guard** — tags-only + b5-only. Pre-commit `git diff` must show ONLY `*[ref: …]*` bracket lines + regenerated `.html`; any body-prose diff is scope-drift → revert. Do NOT sweep b6/b7/b8.

**✅ ARCHITECT STEER — RESOLVED (Fable, this session; verbatim-faithful):**
- **F1/F2/F3/F5 (21 confirmed defects) are REAL → FIX them.**
- **F4 = FIX THIS PASS** — correct the b5 CLAUDE.md "9 sub-essays" table Refs counts (05_3 13→25, 05_4 12→18, 05_6 13→15, 05_7 20→22, 05_9 16→25).
- **F5 = FIX ALL CANDIDATES too** (not defer) — verify 05_7 L127 + 05_1 L138/L142/L184/L186 the SOUND way in VERIFY (Read+Grep native), fix any confirmed stale.

**⛔ COVERAGE IS NOT COMPLETE — architect caught the unsoundness. Do NOT call it "own-eyes coverage of all 9":**
- Genuine own-eyes **paragraph→tag** reads happened ONLY for **05_1 + 05_2** (session-6). The other **7 essays (05_3–05_9) were PURE-GREP** = the **tag→source** direction, which **STRUCTURALLY cannot find class 1 (missing) / 3 (over-scoped) / 5 (glossary-drift)**.
- My own ledger admits it: this file :237 "Class-1 MISSING under-verified — subagent grep couldn't scan full paragraphs"; :348 the grep pass MISSED F5 until own-eyes on 05_1 caught it. So **"1/3/5 clean corpus-wide" is UNSUPPORTED for 7 of 9 essays** — the same unsoundness that voided the prior review.
- Architect's independent spot-check of **05_4/05_5/05_8 found the corpus genuinely well-tagged** → this pass will likely CONFIRM mostly-clean, but it must be verified the SOUND way, never grep-declared.

**MANDATE — genuine own-eyes paragraph→tag pass of 05_3, 05_4, 05_5, 05_6, 05_7, 05_8, 05_9 in EXECUTE/VERIFY** (Read+Grep are NATIVE there — the OBSERVE context-gate balloon does NOT apply):
- Per claim paragraph ask: **is it correctly + fully tagged?** class 1 = untagged real code/context claim · class 3 = tag over-claims its source · class 5 = tag's term drifted vs the `.claude/context/` dir.
- **Balloon-safe method:** Read each essay file directly (small files), scan its paragraphs; for a suspect tag extract ONLY the needed field + compare to the live file/context; short quote + file:line; a few paragraphs per subagent → findings-with-evidence.
- **Fold any new hits into the slate**, fix everything (incl. F4 + all F5 candidates), then re-present the COMPLETE slate with per-essay own-eyes 1/3/5 evidence at CONDENSE (the architect calls done).

[KNOWLEDGE]{ref-tag-review-coverage-soundness} DELIVERABLE taxonomy lesson (for a future run): a PURE-GREP scan of ref-tags runs the tag->source direction and verifies classes 2 (WRONG) + 4 (OUT-OF-SYNC vs CODE) deterministically, but it STRUCTURALLY CANNOT find class 1 (MISSING - no tag exists to grep), class 3 (TOO-MUCH over-scope - needs reading the paragraph the tag over-claims), or class 5 (context-drift - needs comparing the tag's term to the live .claude/context/ dir). Those three demand SOUND own-eyes paragraph->tag reading. Declaring "1/3/5 clean" from a grep-only pass is the unsoundness that voided the prior review. The family-grouping heuristic still holds (one superseding code event = one family across essays), but sound coverage must PAIR grep (classes 2/4) WITH own-eyes paragraph->tag (classes 1/3/5). Corollary (architect guardrail): authoring a tag on a NON-claim (bridge/aphorism/analogy) is itself a class-3 over-scope defect - the review both adds missing tags AND resists over-tagging.

[VOICE-UPDATE]{stage1-collaborative-quota-block | The Stage-1 plan-commit --force gate requires at least 3 [WAITING] answers CAPTURED via the AskUserQuestion tool, but the architect answered all 3 genuine PLAN questions (slate, F4/F5 scope, class-1 rule) as FREE-FORM typed messages that interrupted the tool. Those answers ARE logged to user_interactions and ARE genuine collaboration, yet the quota stayed at 2/3 - so a Stage-1 job whose user prefers typed answers cannot satisfy its own collaborative gate through normal collaboration. | direction: either (a) count a user_interactions entry that answers a pending [WAITING] question toward the quota even when the AskUserQuestion tool was interrupted/rejected - credit the ANSWER, matching the design's own words "credit lands on CAPTURE, the answer logged to user_interactions"; OR (b) have the block voice explicitly tell the seed that only tool-SELECTED answers register and to ask the user to select rather than free-form. Substrate/gate gap, not a seed error.}

[VOICE-UPDATE]{compact-wake-clear-inject-reanchor (brain_guard SessionStart clear-hook + the /clear command note) | The wake instruction says "Read the compaction file DIRECTLY at its path — it is carved out of EVERY phase guard." In PLAN this is false: phase_plan/plan-guard.sh BLOCKED my main-session Read of `.claude/jobs/<id>/run-1/compaction-9.md` ("Read outside CLAUDE.md layer") AND blocked the dispatched post-compact-context-refresher subagent from reading it. So the promised carve-out does not hold in a read-narrowed phase, making the stated resume path unreachable; I re-grounded from the b5 CLAUDE.md footers instead (which worked). | direction: either (a) soften the voice — say the compaction-file carve-out holds only where the guard admits it, and in read-narrowed phases (plan/verify) re-ground from the CLAUDE.md footers / pay heartbeat then advance; or (b) treat as a substrate gap for the architect — the phase guards do NOT actually carve out the `.claude/jobs/**/compaction-*.md` path though the design claims they do. Flag as substrate contradiction, not a seed error.}

---Ex---

## EXECUTE — per-essay fix checklist (tags-only; Read-locate + Edit + regen)

Altered scope = `blog/b5/`. **Grep is a VERIFY tool, not available in EXECUTE** — locate targets by Reading the `.md` and finding the tokens/lines below. Per essay: **Read** `.md` → **Edit** each drifted `*[ref: …]*` tags-only per the reduction standard (pointer targets were verified in OBSERVE) → **regen** `.html` via Bash → **regen-validation** (exit 0 + file non-empty + contains `<!DOCTYPE`). Commit per essay; pre-commit `git diff` shows ONLY ref-bracket + `.html` lines (any body-prose diff = scope-drift → revert).

**`05_1-the-two-layer-foundation`** (F3 + F5) — F3: the tag carrying a `line NN` pointer → strip the line-number clause, keep file+section/function pointer. F5 (tag `cognition-as-memory-multi-form`, quotes "sole reference" / "5 deep-dives"): reduce quote → pointer `.claude/CLAUDE.md ### knowledge/`; summary = "the durable, monotonically-growing reference; knowledge/identity = INDEX + one deep-dive per identity fact; identity carries 6 facts." Regen → validate.

**`05_2-plugin-integrity`** (F3, 6 tags) — the 6 tags carrying line-number pointers → strip line-numbers, keep file+section/function pointer. Regen → validate.

**`05_3-brain-guard`** (F1, 5 tags) — the 5 tags citing `ACCRUAL_SOFT` / `ACCRUAL_READ_BLOCK`: repoint the 4 retired-knob tags → `config.conf (CONTEXT_SOFT_PCT / CONTEXT_READ_PCT / CONTEXT_CRITICAL_PCT) + brain-memory.md "%-of-window boundaries"`; rewrite the 1 class-2 WRONG summary to describe %-of-window behavior. **RETAIN any `ACCRUAL_CRITICAL` reference** (heartbeat/stop-gate — legitimate). Regen → validate.

**`05_6-question-discipline`** (F3, 3 tags) — the 3 line-number tags → strip line-numbers, keep pointer. Regen → validate.

**`05_7-claude-md-hierarchy`** (F2 + F3, 5 tags) — F2 (tag `footers-replace-chat-working-memory`): repoint section title "Principle 9 — Five Markers" → "9. Five CONDENSE Markers as Cross-Phase Signal System"; keep slug+summary. F3 (4 tags): strip line-numbers, keep pointer. **ONE regen after both families** → validate.

**Step 0 (do FIRST) — SOUND own-eyes 1/3/5 pass of 05_3, 05_4, 05_5, 05_6, 05_7, 05_8, 05_9** (architect mandate; Read+Grep native in EXECUTE): Read each essay directly (small files), scan paragraph→tag for class 1 (untagged real code/context claim) · class 3 (tag over-claims its source) · class 5 (tag's term drifted vs `.claude/context/`). Balloon-safe: for a suspect tag extract ONLY the needed field, compare to the live file/context, short quote + file:line. **Fold any new hits into the slate before fixing.** (05_1 + 05_2 already own-eyed session-6 — 1/3/5 clean there.)

**Class-1 (MISSING) fix rule — architect ruled AUTHOR this pass (Fable, this session; verbatim-faithful):** a class-1 miss on a REAL claim is a defect; authoring the inline tag stays tags-only (no body prose touched). TWO GUARDRAILS + a borderline rule:
1. **Only genuine, checkable code/context claims get a tag** — NOT opener/closer bridges, aphorisms, or analogies (those are CORRECTLY untagged; a tag on a non-claim is itself a **class-3 over-scope defect** — do NOT over-author).
2. **Every new tag's pointer MUST be a STABLE anchor** (section/heading/verbatim quote-string), NEVER a line number — a line-number pointer would recreate the exact F3 defect. So: slug + verified STABLE pointer + accurate summary, each verified against the live file/context.
3. **Genuinely borderline** (real claim vs bridge) → RECORD as a finding for the architect's call, do NOT guess.

**F4 (this pass)** — correct the "9 sub-essays" table Refs column in THIS file against live `grep -o 'class="ref-marker"'` counts: 05_3→25, 05_4→18, 05_6→15, 05_7→22, 05_9→25 (05_1/05_2/05_5/05_8 rows already correct).

**F5-candidates (this pass)** — verify 05_7 L127 + 05_1 L138/L142/L184/L186 against their live files; reduce any CONFIRMED stale quote → stable file/section pointer + accurate summary (same reduction standard). Fix only what own-eyes confirms stale.

[PENDING-JOB]{b6-b7-b8-combined-ref-tag-review — architect tool-selected ONE combined follow-up ref-tag review over b6+b7+b8 (same 5-class taxonomy as this b5 pass). Standalone; this b5 job does NOT depend on it. Same drift families likely (F3 line-numbers, F1 %-of-window, F2 renamed sections, F5 stale quotes). Reuse the coverage-soundness lesson: pair grep (classes 2/4) WITH own-eyes paragraph->tag (classes 1/3/5).}
[KNOWLEDGE]{ref-tag-review-main-session-reads-not-subagents — SUBAGENT-READ DELEGATION FAILS under the context-gate: 3 of 4 execute-file-editor subagents dispatched to own-eyes-read a b5 essay blocked at their FIRST Read (window ~27%, over the 25% Read-block); they inherit a heavy injected baseline sitting at/over the block. Only the one that Read BEFORE any reasoning succeeded (S1 = 05_4+05_5, clean). LESSON: the own-eyes 1/3/5 reading + tags-only editing for this ref-tag job must run in the MAIN SESSION (Read is reliable there — the architect's 'Read each essay directly in EXECUTE' mandate), with phasic compaction between essays; do NOT 80/20-delegate context-heavy reads to subagents (delegation REINTRODUCES the OBSERVE balloon EXECUTE was meant to avoid). If a subagent is unavoidable: force 'Read is the literal FIRST action, zero pre-read reasoning' + rely on the glossary already injected.}
---Ve---

## VERIFY — acceptance criteria (per-family grep-at-zero on the committed `.html`)

**Coverage gate to pass VERIFY:** every in-scope family fixed in EXECUTE + its grep-at-zero returns 0 + `git diff` shows ONLY `*[ref: …]*` bracket lines and regenerated `.html` (zero body-prose diff = scope discipline). **Grep LOCATES; own-eyes ARBITRATE** each located tag (risk-mitigation #4 — variant line-number forms + paraphrased-stale quotes the pattern misses).

**F1 — accrual→%-of-window (`05_3-brain-guard.html`, 5 tags):**
- `grep -o 'ACCRUAL_SOFT\|ACCRUAL_READ_BLOCK' blog/b5/05_3-brain-guard.html` → **0** (retired knobs gone from tags)
- `grep 'ACCRUAL-ANCHORED' blog/b5/05_3-brain-guard.html` → **0**
- POSITIVE (own-eyes): the 5 repointed tags carry `CONTEXT_SOFT_PCT` / `CONTEXT_READ_PCT` / `CONTEXT_CRITICAL_PCT` + `%-of-window boundaries`.
- GUARD: `ACCRUAL_CRITICAL` may still appear (heartbeat/stop-gate — RETAINED); a remaining hit there is NOT a failure — own-eyes confirm it is the retained knob, never a retired one.

**F2 — Five-Markers rename (`05_7-claude-md-hierarchy.html`, 1 tag):**
- `grep 'Principle 9 — Five Markers' blog/b5/05_7-claude-md-hierarchy.html` → **0**
- POSITIVE (own-eyes): the tag carries `9. Five CONDENSE Markers as Cross-Phase Signal System`.

**F3 — line-numbers in pointers (`05_1` / `05_2` / `05_6` / `05_7`, 14 tags):** per file,
- `grep 'class="ref-marker"' blog/b5/<slug>.html | grep -Eo 'line [0-9]+|[a-zA-Z._-]+:[0-9]+|L[0-9]+(-[0-9]+)?'` → **0** file:line pointers inside ref-marker `title=` (own-eyes EXCLUDE legal digits: dates / versions / counts / times).
- Per-file locators: 05_1 (1 — L190) · 05_2 (6 — L119/L143/L156/L164/L168/L170) · 05_6 (3 — L129/L135/L141) · 05_7 (4 — L133/L161/L183/L185).

**F5 — stale-quoted-summary (`05_1-the-two-layer-foundation.html`, L136 CONFIRMED only):**
- `grep 'sole reference' blog/b5/05_1-the-two-layer-foundation.html` → **0**
- the old "5 deep-dives" / "INDEX + 5" quote string → **0**
- POSITIVE (own-eyes): the tag reads "durable, monotonically-growing reference" + "one deep-dive per identity fact" + identity carries "6 facts".

**NOW IN THE COVERAGE GATE (architect ruled IN-SCOPE this pass):**
- **Own-eyes 1/3/5 evidence — per essay 05_3..05_9 (the SOUND verification the grep-only pass could NOT provide):** a recorded own-eyes paragraph→tag verdict (NOT grep-declared) for class 1 (missing) / class 3 (over-scoped) / class 5 (context-drift), each with a short quote + file:line. Without this the coverage claim is unsupported (architect precedent — the unsoundness that voided the prior review). 05_1 + 05_2 already own-eyed (session-6).
- **F4** — the "9 sub-essays" table Refs counts in THIS file now match live `grep -o` counts (05_3=25, 05_4=18, 05_6=15, 05_7=22, 05_9=25).
- **F5-candidates** — 05_7 L127 + 05_1 L138/L142/L184/L186 own-eyes-verified against their live files; any CONFIRMED stale reduced + its old verbatim quote greps to 0 in its essay.

**Cross-cutting VERIFY checks (all families):**
- Regen-validation held per essay (EXECUTE risk-mitigation #1): each regenerated `.html` exit 0 + non-empty + contains `<!DOCTYPE`.
- `.md` ↔ `.html` consistency: the same fixed `*[ref: …]*` bracket present in BOTH surfaces (no silent desync).
- New-pointer existence (risk-mitigation #2): each repointed target string still greps-present in its LIVE source (`config.conf`, `brain-memory.md`, `principles.md`).

## EXECUTE-RECORDED — Step-0 own-eyes 1/3/5 evidence (subagent-read, main-session-synthesized)

**Method (balloon wedge broken):** own-eyes reads + tags-only edits run in the MAIN SESSION (subagent-read balloons past the 25% Read-block); EXECUTE blocks Bash for main + subagents alike, so `.html` regen + live-source grep relocate to VERIFY (scripts + Grep native). Compact between essays.

**Own-eyes 1/3/5 ledger:** ✅ 05_4 / 05_5 / 05_8 (batch-1, clean — 05_4 full-field schema + pre/post hooks · 05_5 two-phase + `summary.sh submit` sole bypass · 05_8 every claim tagged, glossary-consistent) · ✅ **05_3** (session-9, main-session: 1/3/5 CLEAN; L37 two-events ¶ borderline-untagged, covered by adjacent L35 tag — not force-authored) · ✅ **05_6** (session-10, main-session: 1/3/5 CLEAN — every code/context-claim ¶ tagged, opener/closer bridges L19/L43/L83/L87 correctly untagged, tag terms glossary-consistent, no over-scope; **F3 3 tags FIXED in .md**: `pre-call-hook-walks-questions` stripped "line 135", `per-prefix-shape-gates` stripped "capture.sh:85-131", `waiting-current-vs-future-shape` stripped "gmode-gate.sh:54-63") · ⬜ 05_7 / 05_9 owed.

**05_3 F1 → 6 tags (own-eyes catch grep MISSED):** the 5 known + `file-size-ramp` (its closing clause called the context ramp "accrual stages baseline+~120k/~160k/~180k", stale post the 2026-07-09 %-of-window ruling); `dispatch-mechanism-customization` correctly EXCLUDED (dispatch-only summary). **Fix:** all 6 repointed → `config.conf CONTEXT_SOFT_PCT/CONTEXT_READ_PCT/CONTEXT_CRITICAL_PCT` + `brain-memory.md "%-of-window boundaries"`; summaries → %-of-window (Read-block 25% / critical 30% of MAX_CONTEXT_TOKENS, no baseline/accrual); **ACCRUAL_CRITICAL RETAINED** as the heartbeat/stop-gate knob. grep-at-zero: `ACCRUAL_SOFT` / `ACCRUAL_READ_BLOCK` / `ACCRUAL-ANCHORED` → 0 in 05_3 tags.

`[PENDING-JOB]`{b5-body-prose-accrual-to-percent-window — 05_3 BODY prose still teaches the retired accrual context-gate model as live (§"How it works — the progressive squeeze" L41; §"What you would customize" L114). Tags-only scope leaves the fixed F1 tags describing %-of-window while the body teaches accrual — a deliberate tag↔body mismatch flagging the body for a rewrite follow-up (b5, likely wider corpus); keep accrual framing only where it is genuinely the heartbeat tempo. Surface at architect done-checkpoint.}

**SESSION-11:** 05_2 F3 — 6 line-number tags reduced in `.md` (file+section pointers kept; counts retained per Rule 20); `.html` regen + grep-at-zero → VERIFY. REMAINING `.md`: 05_1 (F3+F5), 05_7 (F2+F3 + own-eyes), 05_9 (own-eyes). F4 → CONDENSE (body table above `---Ob---`). F5 candidates → VERIFY.

**S-12 (05_3 F1 APPLIED):** all 6 accrual context-gate tags in `05_3.md` repointed to %-of-window (`config.conf CONTEXT_*_PCT + MAX_CONTEXT_TOKENS` + `brain-memory.md "P cluster"`); `ACCRUAL_SOFT/READ_BLOCK/ANCHORED` gone from all 6, `ACCRUAL_CRITICAL` retained once as heartbeat/stop-gate knob; `dispatch-mechanism-customization` excluded. VERIFY owes: grep-confirm live `brain-memory.md` section name (I used "P cluster"), `.html` regen + F1 grep-at-zero. NOTE: this file is AT the 10000-word cap — CONDENSE must deflate the per-session ---Ex--- narrative.
