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

**ACTIVE JOB — ref-tag review/fix pass, b5 series (job 1783554633377038363, cycle-1 OBSERVE).** Re-run of job 1783194174436079495 (2026-07-04, git `15d54851`), reset before PLAN/EXECUTE. Objective: review the 9 b5 essays' ref-tags against the live implementation, find FIVE real verified problems (root-cause families, not raw instances), then fix each family completely — root cause, then the whole family, then the fix — before moving to the next.

**Ref-tag ground truth (3-source confirmed):** `*[ref: slug|source-pointer|content-summary]*` in `.md` → `<sup class="ref-marker" title="ref: SLUG|POINTER|SUMMARY">` in the mirrored `.html`. Line numbers are BANNED in every field (middle AND third) — stable file/section/function pointers only. Census by occurrence (`grep -oP`), never by line. Mirror invariant `.md`↔`.html` — targeted hand-edit both, never blind-regen. A stale tag is REDUCED to stable useful content (slug + pointer + value-bearing summary), never emptied, never left stale.

**3 families verified but NOT YET FIXED (inherited from the reset prior run — re-verify fresh, don't inherit a number blind):**
1. **line-echo / B-LINE-3F** — 2 tags in `05_6-question-discipline`, third-field line-number echoes (middle field is clean; the drift is in the content-summary's own line-number mentions).
2. **stale-number** — 4 members, each a DIFFERENT fact kind needing its own verification (not one uniform check): `05_2` test-counts, `05_3` two-tier-chain percentage, `05_4` call-site count, `05_7` CLAUDE.md file-counts.
3. **missing-tag** — 1 gap in `05_3-brain-guard` around L37-38 (a paragraph that should carry a ref-tag and doesn't).

**Ruled CLEAN (do not re-litigate):** banned middle-field line numbers across `05_1`–`05_5`.

**Unchecked gap — likely home of a 4th/5th family:** renamed/retired-mechanism drift (a ref-tag pointing at a file/section/mechanism that has since moved or been retired) has only been checked in 6/9 essays. `05_1`, `05_3`, `05_5` still need this specific sweep; fold in a missing-tag check on the same 3 essays while reading them.

**Method:** direct Read of each essay `.md` + the implementation file it cites (no Grep/Glob in this harness for the main session — dispatch an observe-* subagent, e.g. `observe-codebase-explorer`, for anything search-shaped; Read directly for files whose path is already known).

**Scope:** blog files + their ref-tags ONLY, b5 series first. Don't touch anything outside blog files/tags without asking. Ask when priorities or scope are unclear — precedent from the reset prior run: the user approved closing at 3 families for this identical task; if the fresh sweep still yields fewer than 5, surface that honestly rather than invent problems.

**Post-clear resume progress (2026-07-09) — 05_3 drift-check underway:**

- **Confirmed missing-tag gap** (family 3 member) directly via own Read of `05_3-brain-guard.md`: the paragraph starting "Two distinct events touch the file, and they should not be confused..." (phase-exit append vs full compaction event, ~L37-38) carries NO ref-tag while every surrounding paragraph does. Real gap, matches the prior cycle's finding.
- **Confirmed a NEW instance of the already-known "05_3 two-tier-chain percentage" stale-number family member (family 2)** via own Read of `.claude/plugins/brain_guard/config.conf`: `PRIOR_SUMMARY_PCT=30` (default; range 20-50). But `05_3`'s `two-tier-chain` ref-tag content-summary claims *"The Prior Summary is ~20% of θ_lc"* — drift between the essay's stated ~20% and the code's actual default of 30%. Dispatched `observe-codebase-explorer` (agent `afec287fadacf4a71`) to pull the exact canonical wording from `.claude/context/brain-memory.md` "Two-tier chain / Prior Summary" section before deciding the correct fix value.
- **Spot-checked `context-gate.sh` header comment** — CLEAN. Its "GRADUATED HARD-GATE, ACCRUAL-ANCHORED" block matches the essay's `tier-positions-are-tunable` ref-tag content-summary near-verbatim (accrual<160k soft / 160k-179k Read-blocked / ≥180k Read+Edit+Write+MultiEdit blocked, Bash never blocked).
- **Spot-checked `config.conf`'s accrual + θ_lc knobs** — CLEAN otherwise: `ACCRUAL_SOFT=120000` / `ACCRUAL_READ_BLOCK=160000` / `ACCRUAL_CRITICAL=180000` all match the essay's "~120k/~160k/~180k" claims; `THETA_LC=2000` / `THETA_LC_COACH_PCT=70` / `THETA_LC_BLOCK_PCT=85` / `THETA_LC_SEAL_PCT=80` all match the essay's "~2,000 words... ~70%... ~85%" claims.
- **Next:** await the dispatched subagent's report on the canonical Prior Summary percentage, then decide whether to fix `05_3`'s ref-tag to the correct number (or flag as a code-vs-glossary conflict if they disagree too). Then continue the 05_1/05_3/05_5 renamed-mechanism-drift + missing-tag sweep on the remaining cited files (`context-sensor.sh`, `self-compact.sh`, `interaction_summary/CLAUDE.md`, `opevc-metacog.md`) in small batches. Once 05_3 is settled, decide the honest family count (3, or 4/5 if new families surface) and move toward the PLAN commit.

**NEW SESSION RESTART (job 1783561630806597472, post-/clear, same task re-bootstrapped from a fresh user prompt with identical wording/intent).** This job is a continuation of the above in-progress research, not a fresh investigation — the `blog/b5/CLAUDE.md` file survived the `/clear` even though the prior job id (1783554633377038363) did not carry forward as focused. Treating everything above as OBSERVE.recall input; will re-verify per its own instruction ("don't inherit a number blind") rather than redo from scratch.

**Cross-validation from this cycle's dispatched agents (independent confirmation, not a re-derivation):**
- `observe-context-anchorer` confirms `ref-tag` + `ref-tag review job` are `[consolidated]` at `.claude/context/identity.md` L116-135 — matches the ground-truth already recorded above verbatim (slug|source-pointer|content-summary, no line numbers ever, drift = essay-moved OR implementation-moved OR retired-mechanism OR missing-tag-where-warranted). No `[DRAFT-TERM]` needed.
- `observe-codebase-explorer` independently mapped the 9 b5 files + the ref-tag markup shape (`*[ref: slug | source-pointer | content-summary]*` → `<sup class="ref-marker" title="ref: SLUG|POINTER|SUMMARY">`) — matches this file's recorded ground truth exactly. No new drift signal from this pass; it was a structure-mapping dispatch, not a content audit.
- `observe-experience-recaller` dispatched, pending return — expected to surface any OTHER past job touching ref-tags/b5 beyond the two job ids already known here (1783194174436079495 original, 1783554633377038363 reset re-run).

**Plan for the rest of this OBSERVE cycle:** (1) re-verify the 3 documented families fresh via own Read+grep (line-echo in 05_6, stale-number x4 across 05_2/05_3/05_4/05_7, missing-tag in 05_3) — do NOT inherit counts blind; (2) resolve the in-flight 05_3 two-tier-chain percentage check (essay says ~20%, `config.conf` says `PRIOR_SUMMARY_PCT=30` — needs the canonical glossary wording to know which is drift); (3) finish the renamed/retired-mechanism-drift + missing-tag sweep on 05_1/05_3/05_5 (only 6/9 essays swept so far) to see if a 4th/5th family surfaces, since the user wants 5 verified families; (4) if 5 aren't found honestly, surface that rather than inventing problems (explicit precedent: user approved closing at 3 for the identical task in a prior run).

**`observe-experience-recaller` returned — 3 candidate drift sources for family 4/5 (highest-probability targets for the mechanism-drift sweep):**
1. Point system + multiplier fully RETIRED 2026-06-10/2026-06-11, replaced by the count-based min-max gate + unconditional three-family exit gate; `METACOG_GATE_ENABLED` flag deleted. Any ref-tag still describing points/multiplier/sentinel-lock language is stale.
2. Voice-ID renames to `observe.<component>.<slug>` scoping pattern, started in `phase_observe`, planned for other phase plugins. Any ref-tag citing an old bare voice ID may be stale.
3. Session archives relocated from legacy `.claude/knowledge/session/` to the run-aware `.claude/jobs/<id>/run-<r>/session-log-<c>.md` path. Any ref-tag still citing the legacy path is stale.

Reusable methodology named by the recaller: `hadi-nayebi.github.io/.claude/agents/blog-ref-tag-auditor.md` v0.5 (9-dim R1-R9 audit) and `.claude/knowledge/opevc/shadow-cross-reference-validation.md` (phantom-pointer grep-and-classify method) — both directly usable for the mechanism-drift sweep instead of a bespoke read-and-compare.

**Verification-methodology decision:** rather than dispatch the full 9-dim `blog-ref-tag-auditor` (built for the architect's Layer-2 publishing-gate workflow, heavier than needed here), this job will do direct Read-and-compare per essay/citation pair — matches the "Method" note above (no Grep/Glob for the main session; dispatch `observe-codebase-explorer` only for genuinely search-shaped lookups; Read directly once a target file is named).

**NEW JOB (2026-07-08), same task, THIRD continuation — job 1783565540231629404.** After a `/clear`, this job was bootstrapped fresh from a fresh user prompt with the same wording/intent as the two prior job IDs recorded above (1783194174436079495 original; 1783554633377038363 reset re-run; 1783561630806597472 the prior post-clear restart). Treating ALL of the above OBSERVE content as OBSERVE.recall input per its own instruction — continuing the in-flight investigation, not restarting. Picking up exactly at the "Next" pointer left by the prior session: resolve the 05_3 two-tier-chain percentage (essay ~20% vs `config.conf` `PRIOR_SUMMARY_PCT=30`) using the dispatched `observe-codebase-explorer` agent's canonical-wording finding (agent id `afec287fadacf4a71` from the prior session — its report did not survive the clear, so this will be re-verified fresh via own Read of `.claude/context/brain-memory.md`), then finish the 05_1/05_3/05_5 renamed-mechanism-drift + missing-tag sweep, then settle the final family count (3 confirmed + line on whether a 4th/5th surfaces) before moving toward PLAN.

**Cross-session memory recall — `feedback_verify_100_percent_before_advance.md`:** the user's exhaustion-before-advance discipline (verify ALL paths, investigate every anomaly rather than deferring, advance only on 100%) applies to this job's VERIFY phase later: once fixes land, every family's grep acceptance check must be run to a confirmed zero, and any anomaly found along the way gets investigated now, not waved through as "good enough for 3/5 families."

**CRITICAL cross-session memory recall — `feedback_family_vs_instance_counting.md` (directly governs this job's counting model, confirmed by the user on THIS EXACT job's original run 2026-07-04):** "find FIVE real problems" means **5 distinct root-cause FAMILIES, not 5 individually-verified instances**. The 4 stale-number members (05_2/05_3/05_4/05_7) collapse into ONE family slot (family 2), not four — they get fixed together in one pass anyway. **Current honest family tally toward N=5: family 1 (line-echo, 05_6) + family 2 (stale-number, 4 members) + family 3 (missing-tag, 05_3) = 3 families confirmed.** If the renamed/retired-mechanism-drift sweep (05_1/05_3/05_5, in progress) finds real drift, that is family 4 (regardless of instance count within it) — still ONE slot toward 5. A genuine 5th family type is still needed beyond that, or the honest count is reported to the user per the memory's explicit precedent: "if the true family count comes up short of N after genuinely exhausting the plausible drift types, report the real count honestly rather than inventing problems to hit the target number."

**Cross-session memory recall — `feedback_d2_extends_across_attention_surfaces.md`:** subagent quantitative claims (grep-counts, tag-counts, drift-instance-counts) are unreliable and MUST be main-session spot-checked (`grep -c` / `find`) before being treated as ground truth. Directly applicable here: when the dispatched `observe-codebase-explorer` sweep of 05_1/05_3/05_5 returns, every claimed drift instance gets a main-session Read-and-confirm against the actual cited file before it counts toward a family — this job's own ground rule ("Verify each one against the actual files before counting it — no guesses") is this exact discipline restated by the user for this job specifically.

**Cross-session memory recall — `feedback_shallow_verify_antipattern.md`:** trust live-observed reality over self-reports/return-codes. Applies to this job's acceptance checks: the user wants deterministic greps they can run themselves — the check itself (not a subagent's "fixed!" claim) is the truth-source. When fixing each family, the fix is done only when the grep the user will run actually returns zero, verified by own-eyes grep, not assumed from the Edit having "succeeded."

**Cross-session memory recall — `feedback_cycle_close_requires_user_approval.md`:** applies primarily to multi-cycle jobs; this job reads as Stage-1 single-cycle collaborative ("done together," "one-time pass," talk later about repeating) per the user's own framing, so the lighter single-cycle `[JOB-COMPLETE]` approval path applies rather than the multi-cycle per-cycle-close gate. Still: technical pass (deterministic greps at zero) + workflow pass (explicit user sign-off on each family's fix before calling the job complete) are BOTH required — never self-approve on grep-zero alone without surfacing the fix to the user first, consistent with this job's own ground rule to ask when priorities/scope are unclear.

**Stage classification (cycle-1 PLAN decision, pre-noted here for continuity):** likely Stage 1 (single-cycle collaborative) given explicit user framing "This is a one-time pass for now, done together... if it proves useful we can talk later about making it a repeating job" — a textbook Stage-1-then-maybe-promote-to-Stage-2 pattern. Final call belongs to cycle-1 PLAN (informed by `plan-roster`), not pre-decided here.

**05_3 two-tier-chain percentage — RESOLVED (2026-07-09, own Read of `.claude/CLAUDE.md` + `.claude/context/brain-memory.md`, confirming the pre-clear dispatch's target fact fresh):** the canonical wording (root `.claude/CLAUDE.md` "brain_guard phasic-compaction upgrade" section) says the Prior Summary is "sized at a tunable 20-50% of θ_lc (`PRIOR_SUMMARY_PCT` knob)" — and `.claude/plugins/brain_guard/config.conf` sets `PRIOR_SUMMARY_PCT=30` as the DEFAULT. `05_3`'s ref-tag content-summary states the Prior Summary is "~20% of θ_lc" as if that were the headline figure — but ~20% is only the LOW END of the tunable range; the actual shipped default is 30%. This IS drift: fix `05_3`'s ref-tag to state the ~30% default (with the 20-50% tunable range as a parenthetical), not the low-end 20% alone. Confirmed real, joins family 2 (stale-number) as one more member alongside the test-count/call-site/file-count members already logged above — still ONE family slot, not a new family.

**FINAL SETTLED (2026-07-09, post-clear resume) — honest family count closes at 3, user-confirmed via chat.** The renamed/retired-mechanism-drift sweep is now CLEAN on all 9 essays (05_1/05_3/05_5 — the last 3 unchecked — returned clean this session and the prior one); the banned-line-number check on 05_6/05_8/05_9 (the last unchecked essays for that specific check) also returned ZERO violations (agent `ae63fa994d8b6030f`, re-dispatched post-clear after the pre-clear agent hit the same compaction boundary without a result). No 4th or 5th family surfaced despite exhausting every planned angle (banned line numbers × 9/9 essays, retired-mechanism drift × 9/9 essays, missing-tag spot-checks). Per the user's own precedent on this exact job (`feedback_family_vs_instance_counting.md`, confirmed 2026-07-04) and their explicit 2026-07-09 chat instruction — "close at whatever's HONEST... if it is short of 5, surface the shortfall... and STOP hunting" — **the count is honestly 3, confirmed by the user directly in chat (post a rejected AskUserQuestion popup), and OBSERVE is done. Do NOT split any family to manufacture a 5th.** The 3 families, final:

1. **line-echo (`05_6`)** — 3 ref-tags (not 2 as previously inherited/logged — count corrected via own Read) carry third-field line-number echoes in their content-summary (middle/source-pointer field stays clean in all 3): L29 "line 135" (batch-cascade ref-tag), L35 "capture.sh:85-131" (per-prefix-shape-gates ref-tag), L41 "gmode-gate.sh:54-63" (waiting-current-vs-future-shape ref-tag). **Fix:** strip the line-number echo from each of the 3 content-summaries, leaving the stable file/function pointer only.
2. **stale-number (4 members, one family)** — `05_2` test-counts, `05_3` two-tier-chain percentage (resolved above, ~20%→~30% default), `05_4` call-site count, `05_7` CLAUDE.md file-counts — 4 distinct facts across 3 essays, fixed together in one pass. **Fix:** refresh each of the 4 ref-tag values to a fresh count/fact at fix-time; `05_3` specifically restates the ~30% default with the 20-50% tunable range as a parenthetical.
3. **missing-tag (`05_3`)** — the "Two distinct events touch the file..." paragraph (~L37-38) carries no ref-tag while every surrounding paragraph does. **Fix:** add a new ref-tag to that paragraph citing a real file/section with a value-bearing content-summary.

Next: this OBSERVE cycle is ready to advance to PLAN — set fresh `---Ve---` deterministic-grep criteria for these 3 families (replacing the stale `05_5`-job checklist below, which belongs to a different completed job), then run the sanctioned observe→plan compaction boundary (rolling `--summary` + fresh `metacog-reflect` + `observe-commit.sh --force`).

[PENDING-JOB]{observe-guard's Bash whitelist (job.sh show/focused, phase.sh, observe.sh, summary.sh, lib/marked-note append-note) has no entry for plugins/lib/comms/comms.sh ask-card, so a phase_observe seed cannot deliver an AskUserQuestion via the Telegram card path even when a PreToolUse hook says current_channel=telegram and a terminal question will sit unseen. Either whitelist comms.sh ask-card in every phase guard, or make AskUserQuestion itself route through comms when the channel hint says telegram, so the two systems stop contradicting each other.}
---Pl---

## PLAN — ref-tag review/fix pass, b5 series (job 1783565540231629404, cycle 1)

**Superseding note:** the block previously here (a site-wide line-number-ban sweep, job
`1782320396187605322`) belongs to a different, unrelated completed job. It is stale working-memory
drift carried across `/clear` boundaries — a CONDENSE cleanup item, not this job's plan. Replaced
below with the real plan for THIS job's 3 confirmed families (see `---Ob---` "FINAL SETTLED").

**Scope-declaration — `blog/b5/` is activated for EXECUTE.** Touches exactly 5 essay files, each as
a `.md` + mirrored `.html` pair (mirror invariant — targeted hand-edit both, never blind regen):
`05_2-plugin-integrity`, `05_3-brain-guard`, `05_4-job-core`, `05_6-question-discipline`,
`05_7-claude-md-hierarchy`. No other blog file or non-blog file is in scope; anything else needs to
be asked first per this job's own ground rule.

**Fix order — one family fully closed (fix → deterministic verify → user sign-off) before the next:**

### Step E1 — Family 1: line-echo (`05_6-question-discipline`)
- Dispatch one `execute-file-editor` on `05_6-question-discipline.md` + `.html` together.
- Fix the 3 ref-tags whose **content-summary** (3rd field) echoes a line number — source-pointer
  (2nd field) stays untouched, it was already clean: L29 "line 135" (batch-cascade ref-tag), L35
  "capture.sh:85-131" (per-prefix-shape-gates ref-tag), L41 "gmode-gate.sh:54-63"
  (waiting-current-vs-future-shape ref-tag).
- Strip the line-number echo from each content-summary, leaving the stable file/function-name
  pointer + the value-bearing claim only — no numbers of any kind reintroduced.
- Verify: `---Ve---` Family 1 checklist (3 checks) must all pass before moving to E2.

### Step E2 — Family 3: missing-tag (`05_3-brain-guard`)
- Dispatch one `execute-file-editor` on `05_3-brain-guard.md` + `.html`.
- The paragraph starting "Two distinct events touch the file, and they should not be
  confused..." (~L37-38, phase-exit footer-append vs full-compaction event) carries no ref-tag
  while every surrounding paragraph does.
- EXECUTE reads the paragraph + the implementation it describes (candidates: append-section vs
  full-compact code paths in `.claude/plugins/brain_guard/scripts/compaction-io.sh` and
  `self-compact.sh`, or the canonical distinction in `.claude/context/brain-memory.md`) and adds a
  new ref-tag (slug + stable file/section pointer + value-bearing content-summary, no line numbers)
  in both `.md` and `.html`.
- **Citation-target steer (risk mitigation, plan-risk-assessor R1):** strongest candidate is
  `.claude/context/brain-memory.md`'s "Two-tier chain / Prior Summary" section (or the sibling
  section naming the phase-exit-append vs full-compaction distinction directly) — it is the
  canonical, most-stable home for this exact distinction. EXECUTE confirms the section still exists
  under that name before citing it; if renamed/moved, fall back to whichever of the two code files
  actually implements the described behavior at fix-time (never cite a candidate without reading it
  first).
- The new tag's content-summary must actually EXPLAIN the paragraph's claimed distinction (phase-exit
  footer-append vs full-compaction event) — not just point at a real file (risk mitigation,
  plan-risk-assessor R5). A citation that exists but doesn't teach the distinction is an incomplete
  fix.
- Verify: `---Ve---` Family 3 checklist before moving to E3.

### Step E3 — Family 2: stale-number (4 members, 3 files, ONE family, fixed together)
- 4 dispatches, one per file (each `.md` + `.html` together):
  1. `05_2-plugin-integrity` — refresh the test-count ref-tag value to a fresh count of the actual
     cited plugin's tests at fix-time.
  2. `05_3-brain-guard` — the two-tier-chain ref-tag: replace the "~20%" framing with the ~30%
     default (20-50% tunable range as parenthetical), matching
     `.claude/plugins/brain_guard/config.conf` `PRIOR_SUMMARY_PCT=30`. (Separate dispatch from E2 —
     different concern, same file; keeps each family's diff separable for review.)
  3. `05_4-job-core` — refresh the call-site count ref-tag to a fresh grep of the actual call sites
     in the cited file at fix-time.
  4. `05_7-claude-md-hierarchy` — refresh the CLAUDE.md file-count ref-tag to a fresh count of the
     actual files at fix-time.
- All 4 fixed tags keep slug + a value-bearing content-summary — never an empty `pending` shell.
- Verify: `---Ve---` Family 2 checklist (all 5 sub-checks) + the Global checklist.
- **Freshness method per member (closes premortem F2 — "matches a fresh count" was unverifiable
  without a stated method):** `05_2` test-count → `grep -c "^\s*\(it(\|test(\|def test_\)"`-style
  count (or the plugin's actual test-runner summary line) against the cited plugin's test dir at
  fix-time; `05_4` call-site count → `grep -c` for the cited function/pattern across the actual
  call sites in the cited file; `05_7` file-count → `find`/`ls` count of the actual CLAUDE.md files
  the tag claims to enumerate. Each fix records the exact command run + its result inline in the
  execution notes so VERIFY can re-run the same command and confirm the number still matches — a
  count that happens to be UNCHANGED from the stale value is still a valid fix outcome as long as
  it is the result of a fresh count, not an unexamined carry-forward.
- **Pre-count source-pointer check (risk mitigation, plan-risk-assessor R3):** before running any
  freshness command, EXECUTE confirms the ref-tag's EXISTING source-pointer (the file/section/dir it
  currently cites) still exists and is the right target — a fresh count against a moved/renamed
  target is a wrong count, not a fix. If the source-pointer itself is stale, do not blindly count
  against the wrong file — note it in the execution notes and pick the correct current location
  before counting.
- **Criteria check for `05_7` file-count (risk mitigation, plan-risk-assessor R4):** the file-count
  fix is not just a number swap — confirm the content-summary's stated ENUMERATION CRITERIA (which
  files/dirs it claims to count) is still accurate. If the criteria itself has drifted (e.g. new
  plugin dirs added, or the described scope no longer matches how CLAUDE.md files are actually
  organized), update the criteria wording alongside the count, not the count alone.

**Explicit non-scope guards (from this cycle's premortem review):**
- **Do NOT re-run `tools/generate_blog_html.py` for these 5 essays during this job.** All 3 families
  are targeted hand-edits to both `.md` and `.html`; a generator regen risks silently reverting the
  hand-edited `.html` (premortem F4). If a generator run is ever needed later, hand-edits must be
  re-applied after.
- **Cross-series drift (b6/b7/b8 essays citing the same 4 stale-number facts) is OUT OF SCOPE for
  this job** (premortem F8) — this job's declared scope is "blog files + their ref-tags ONLY, b5
  series first" per the original OBSERVE ground rule. **Enforced, not just advisory (risk
  mitigation, plan-risk-assessor R6):** if EXECUTE notices a matching stale value (same family, same
  drift kind) cited in ANY essay outside `blog/b5/`, it MUST NOT fix it in this task — it records a
  `[PENDING-JOB]` marked note in the execution notes naming the essay + the drift, for a follow-up
  cross-series review job. Never silently fix it, never silently skip noting it.
- **Family 3's missing-tag precondition (premortem F5) is ALREADY CONFIRMED, not an open risk:**
  OBSERVE directly Read `05_3-brain-guard.md` and confirmed the "Two distinct events..." paragraph
  exists at ~L37-38 with no ref-tag while every surrounding paragraph has one (see `---Ob---`
  "Confirmed missing-tag gap"). EXECUTE does not need to re-verify this precondition, only find the
  best citation for the new tag's content.

**Commits:** land per-family (one commit per E-step, never bundled) so each family's diff is
independently reviewable. Root git tracks `.md` (b5 `.md` is gitignored from the website git but
root-tracked); website git tracks `.html`. `execute-commit` is multi-git aware — pass both files,
it groups each to its owning repo.

**Workflow gate (Stage-1 collaborative):** per this job's own ground rule ("ask when priorities or
scope are unclear... I'd rather answer questions than undo work") and
`feedback_cycle_close_requires_user_approval.md`, get the user's explicit sign-off on each family's
fix before moving to the next family AND before `[JOB-COMPLETE]` — technical pass (greps at zero)
alone never suffices.

**Three low-stakes decisions — resolved autonomously (2026-07-09), per the user's explicit standing
instruction on this exact job to decide fix-order/grouping/implementation-path choices without
asking, and to reserve questions for genuine forks only:**
1. **Fix order + commit granularity — DECIDED: proceed with E1→E2→E3 as drafted above** (one commit
   per family, `05_3` touched in two separate commits across E2/E3 — keeps each family's diff
   independently reviewable, no combining).
2. **Family 3's new ref-tag citation — DECIDED: EXECUTE investigates the real implementation**
   (`compaction-io.sh` append-section vs `self-compact.sh` full-compact, or the canonical
   `brain-memory.md` distinction) and picks the most accurate stable pointer at fix-time — a
   citation-accuracy call, not a design fork.
3. **Sign-off cadence — DECIDED: per-family check-in** (3 separate sign-offs, each before the next
   family starts) — this is already the job's own standing ground rule (see "Workflow gate" above:
   "before moving to the next family AND before `[JOB-COMPLETE]`"), not actually an open question.

---Ex---

---Ve---

### Verify checklist — ref-tag review/fix, b5 series (job 1783565540231629404) — 3 honest families

**Family 1 — line-echo (`05_6-question-discipline`, 3 members: L29/L35/L41 third-field line-number echoes)**
- [ ] `grep -noP '\*\[ref:[^]]*\]\*' blog/b5/05_6-question-discipline.md | grep -E '(line [0-9]+|[A-Za-z0-9_.-]+\.(sh|py|md):[0-9]+(-[0-9]+)?)'` returns ZERO matches (was 3)
- [ ] Each fixed tag's middle field (source-pointer) stays stable/unchanged — the drift was in the content-summary only, not the pointer
- [ ] Mirror invariant: the 3 fixed tags' `title="ref: ..."` in `05_6-question-discipline.html` match the `.md` content-summary exactly (no line numbers there either)
- [ ] **Precision check (premortem F6 + plan-risk-assessor R2 — MANDATORY, not just the grep above):**
  the whole-tag grep checks BOTH fields at once, so a zero result alone is not sufficient proof —
  for EACH of the 3 fixed tags, run `grep -A2 -B2 '<the specific line-number text that was there>'
  blog/b5/05_6-question-discipline.md` (e.g. `grep -A2 -B2 'line 135'` for the L29 tag) and confirm
  ZERO matches ANYWHERE in the file — this proves the line-number text was actually REMOVED, not
  moved from field 3 into field 2 (which would make the whole-tag grep pass while the drift
  persists in a different field)

**Family 2 — stale-number (4 distinct facts across 3 essays, ONE family, fixed together)**
- [ ] `05_2-plugin-integrity` test-count ref-tag value matches a fresh count of the actual cited plugin's tests at fix-time
- [ ] `05_3-brain-guard` two-tier-chain ref-tag: `grep -c "20%" blog/b5/05_3-brain-guard.md` == 0 AND the essay states the ~30% default (20-50% tunable range as parenthetical) — matches `.claude/plugins/brain_guard/config.conf` `PRIOR_SUMMARY_PCT=30`
- [ ] `05_4-job-core` call-site count ref-tag value matches a fresh grep of the actual call sites in the cited file at fix-time
- [ ] `05_7-claude-md-hierarchy` CLAUDE.md file-count ref-tag value matches a fresh count of the actual files at fix-time
- [ ] All 4 fixed tags still carry slug + a value-bearing content-summary (never an empty `pending` shell)
- [ ] **Source-pointer sanity (plan-risk-assessor R3):** for each of the 4 members, the ref-tag's
  cited file/section/dir was confirmed to exist BEFORE the fresh count was taken (not counted against
  a moved/renamed target) — check the execution notes record this confirmation, not just the count
- [ ] **`05_7` criteria check (plan-risk-assessor R4):** the file-count tag's stated enumeration
  criteria (which files/dirs it claims to count) was verified still accurate, not just the number

**Family 3 — missing-tag (`05_3-brain-guard`, ~L37-38)**
- [ ] The "Two distinct events touch the file..." paragraph now carries a ref-tag: grep for `\*\[ref:` on that paragraph's line range returns ≥1 match (was 0)
- [ ] The new tag's content-summary is genuinely value-bearing (not a stub) and cites a real file/section that exists
- [ ] **Pedagogy check (plan-risk-assessor R5):** read the cited section of the new tag's source and
  confirm the content-summary text actually EXPLAINS the paragraph's claimed distinction (phase-exit
  footer-append vs full-compaction event) — a real citation that doesn't teach the distinction is an
  incomplete fix, not a pass

**Global**
- [ ] No collateral edits: `git diff` on the 3 touched essays (`05_3`, `05_4`, `05_6`, `05_7`, `05_2` — 5 files) shows ONLY the targeted family fixes, no blind HTML regen
- [ ] Both repos clean after commit (root for `.md`, website for `.html`; multi-git execute-commit groups each file to its owning repo)
- [ ] **No unresolved cross-series scope creep (plan-risk-assessor R6):** if EXECUTE flagged any
  `[PENDING-JOB]` note for a matching stale value outside `blog/b5/`, confirm it was recorded (not
  fixed in-scope and not silently dropped)
- [ ] Technical pass (all greps above return the expected zero/match) AND workflow pass (user explicitly signs off on each family's fix before `[JOB-COMPLETE]`) — both required per this job's Stage-1 collaborative framing
