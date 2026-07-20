# CLAUDE.md — Blog 6 Mini-Series (The Markov Phasic Brain)
**Version:** v1.2.0
**Series:** B6 — Pt 2 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture
**Audience:** Power Users & Architects (Tier 2 → Tier 3)
**Last updated:** 2026-07-15 (de-bloat: per-essay audit history + sweeps + asset backlog → `.claude/knowledge/b6-series-audit-history.md`; ref-tag line-number sweep job state → `.claude/knowledge/b6-reftag-sweep-job-state.md`)

## Purpose

B6 series working memory — everything specific to the sub-essays of *The Markov Phasic Brain* (13 after the 2026-06-21 splits). Parent context: `../CLAUDE.md` (website-wide) + `../../CLAUDE.md` (agent-side root). This is the **series compartment** — what's true about B6 without scrolling the parent files.

## What this mini-series teaches

The seed agent's second layer of cognitive infrastructure: the **phasic plugins** that compartmentalize work into named phases (OBSERVE → PLAN → EXECUTE → VERIFY → CONDENSE → idle), and the orchestrator that routes between them. By the end, the reader understands:

- Why compartmentalization-by-phase produces predictable behavior across cycles
- Each phase's owned write authority + the gates that enforce its boundaries
- The CONDENSE operation catalog as the brain's growth mechanism, run in three gated phases (ADDRESS marked notes to terminal states → ARCHIVE the footer → DEFLATE it)
- The rhythm of work: the count-based min-max gate paces each phase (per-activity-class counters, one reset event); the three-family exit gate is the advance condition
- GMODE as the deliberate off-cycle lane (≥100-word justification + atomic restore)
- The plan file: long-horizon memory that crosses cycle boundaries (the .md/.yaml cross-cycle handoff vessel — parallel Stage choices, not a promotion pipeline)

Series destination: hand off to B7 (the plugin kit) at the closing bridge.

## Canonical terms (series-exclusive)

Ground truth: `hadosh_academy/.claude/context/INDEX.md` (Rule 40 — prose conflicts with a `[consolidated]` definition are prose drift). Cross-cutting job-system vocabulary lives in the parent `../CLAUDE.md` "Canonical Vocabulary" section. The two transition-graph terms below are **B6-anchored** — they load here, when editing B6 essays:

- **Plan-verify backward loop** — the intra-cycle iteration VERIFY uses when it edits the plan file. The VERIFY custom gate detects the plan-file edit and blocks forward-advance; the agent calls `verify-commit.sh --backward plan` (reusing the existing BACKWARD_MAP `verify:plan` entry — no new transition); PLAN re-cognizes and routes to OBSERVE (more context) or to VERIFY directly (the loop's normal return — post-creation plan-file edits belong to VERIFY; PLAN's change-requests ride its CLAUDE.md edit). Converges in 1-3 iterations for cycle-1 plan establishment. _Avoid:_ "plan-edit retry," "plan revision cycle."
- **plan→verify forward transition** — the FORWARD_MAP entry (`plan:verify` in `phasic_system/scripts/phase.sh`, placed after `plan:execute` so the default advance stays plan→execute) letting PLAN advance straight to VERIFY without re-execution, taken via `plan-commit.sh --force --to verify`. Structural permission only; abuse prevention lives in the `--to verify` shape's required `## Why No Execute` section, not in any conditional field. BUILT (2026-06-10). _Avoid:_ "plan-verify skip," "verify shortcut," **"conditional forward transition" (BANNED — the prototype has no state-conditional transitions)**.

## The sub-essays (13)

Status legend: **published** = drove clean through the 3-CLEAN gate · **corrected** = rewritten after 2026-05-19 user pushback, re-audit pending · **new** = 2026-06-21 split. **Note:** the 2026-06-10 points-retirement sweep rewrote all essays to the count-based rhythm — re-audit through the 3-CLEAN gate is pending for the swept teachings. Full per-essay audit provenance + split ref-tag accounting: `.claude/knowledge/b6-series-audit-history.md`.

| Slug | Title | Read | Refs | Status |
|------|-------|-----:|-----:|--------|
| `06_1-phasic-foundation` | Phasic Foundation | 10 min | — | published |
| `06_2-discipline-and-map` | The Discipline and the Map | 11 min | 29 | published — **CANONICAL source of truth for the cascading-downward anchor rule** |
| `06_2b-the-phase-map` | The Phase Map — A Tour Before the Deep-Dives | 5 min | 13 | new (split off 06_2) |
| `06_3-observe` | OBSERVE — Read Wide, Write Once | 11 min | — | corrected v0.4.0 |
| `06_4-plan` | PLAN — Decide, Then Lock | 10 min | — | corrected v0.4.0 |
| `06_5-execute` | EXECUTE — Build, in Scope, in Steps | 10 min | 32 | corrected v0.4.0 |
| `06_6-verify` | VERIFY — Independent Eyes | 9 min | — | corrected v0.3.0 (+M8/M9 ref-tag anchors 2026-07-19) |
| `06_7-condense` | CONDENSE — The Cognitive Organ | 11 min | 26 | published (+dependency-removal lifecycle 2026-06-19; +M11 anchor 2026-07-19 — live grep=26, recorded 32 was stale) |
| `06_7b-condense-uniquely-owns` | CONDENSE — What It Uniquely Owns | 6 min | 21 | new (split off 06_7; +M13 anchor 2026-07-19 — live grep=21) |
| `06_8-inverse-multiplier` | The Rhythm of Work (retitled 2026-06-10; was The Inverse Multiplier) | 11 min | 27 | published |
| `06_9-gmode` | GMODE — The Off-Cycle Lane | 8 min | 25 | published |
| `06_10-plan-state-machine` | The Plan File — Stages and Completion | 6 min | 16 | corrected/built-reconcile v0.4.0 (Tier 3) |
| `06_10b-long-horizon-memory` | The Plan File — Long-Horizon Memory | 10 min | 26 | new (split off 06_10; **series closer**, carries the B7 hand-off; Tier 3) |

## Asset inventory

```
blog/b6/
  CLAUDE.md
  06_{1..10}-<slug>.{md,html,transcript.md}   (+ split essays 06_2b, 06_7b, 06_10b)
  images/quick-phase-map-b6-2.png             # only B6 body image on disk so far
  audio/                                       (appears when MP3s are generated)
```

**Pending assets** (9 body images, series og:image, all audio — user-gated TTS spend): see `.claude/knowledge/b6-series-audit-history.md#asset-backlog`.

## URL convention (post-restructure 2026-05-19)

Live URLs: `https://hadi-nayebi.github.io/blog/b6/06_X-<slug>.html`. Old root-level URLs (`blog/06_X-<slug>.html`) return 404 — restructure approved with no redirects (matches B5/B7/B8). All cross-essay links across the site (sitemap.xml, feed.xml, blog.html cards, inline body links in B5/B7/B8, Part-1 root essays, and sibling B6 essays) point at `/blog/b6/06_X...html`.

## Tooling notes

- **Build:** `python3 .claude/tools/generate_blog_html.py blog/b6/<slug>.md blog/b6/<slug>.html --version 20260518` — the generator's `SLUG_SUBDIR_PREFIXES` map includes `"06_": "b6"`; it autodetects subdir from the output path and switches to depth-aware mode (`../../` site-nav, subdir canonical URL, subdir `audio/` path).
- **Transcript:** `python3 .claude/tools/generate_blog_transcript.py blog/b6/<slug>.md blog/b6/<slug>.transcript.md` (always resets `final: false`).
- **Audio:** `python3 .claude/tools/generate_blog_audio.py blog/b6/<slug>.transcript.md blog/b6/audio/<slug>.mp3` (refuses unless `final: true`; ~$0.75/essay on tts-1-hd; USER-GATED).

## Standards

- **Image style (chalk-on-blackboard)** is non-negotiable per `../CLAUDE.md` Image Style. Shared `opevc-cycle-blackboard.png` anchors the series visually; per-essay images at `blog/b6/images/`.
- **Ref-tag density ≥80%** per Rule 28 — every factual paragraph naming a Layer-1 specific carries an in-paragraph ref-tag; transitional paragraphs (opener/closer bridges, rhetorical punches) appropriately skip. Ref-tag pointers use STABLE anchors (filename + heading/section/function NAME), never line numbers.
- **Cross-subdir prefix** (Rule 42) — B6 essays reference B5/B7/B8 via `../b5/`, `../b7/`, `../b8/`; Part-1 via `../01-...html`. Enforced via auditor sweep.

## Cross-references

- Parent: `../CLAUDE.md` (website-wide) · Siblings: `../b5/CLAUDE.md`, `../b7/CLAUDE.md`, `../b8/CLAUDE.md`
- Auditor specs: `../../.claude/agents/blog-{quality,ref-tag,series-coherence}-auditor.md`
- Rules 30/32/42 banked at `../../.claude/CLAUDE.md`
- Series audit history + asset backlog: `.claude/knowledge/b6-series-audit-history.md`
- Ref-tag line-number sweep job state (INACTIVE) + banked cross-job findings: `.claude/knowledge/b6-reftag-sweep-job-state.md`

---Ob---

### Ref-tag review job (1784416070407796247, 2026-07-18) — B6 hunting notes

B6 = **richest fresh ground** (B6-SWEEP 277-tag deep pass still OPEN; only B-LINE + banned-"13 plugins" verified clean 2026-07-17). Leads by category:
- **06_10-plan-state-machine** ("Plan File — Stages and Completion", Tier 3, 16 refs) — plan-file lifecycle had HEAVY vocab churn. Banned aliases to hunt in tags+prose: `plan_state` · `Form 1/2/3` · `seal/sealed`/`completed_plan`/`md_approved` · `[PLAN-APPROVAL]`/`[YAML-APPROVAL]` · "conditional forward transition" · "plan decided at job creation" (real: decided in cycle-1 PLAN). CONTEXT-SYNC/PARAGRAPH candidate — even the slug's "state-machine" framing is suspect.
- **06_9-gmode** (25 refs) — inventory flagged `atomic-pre-gmode-stash` (:39, "atomic jq update" — PARAGRAPH: verify `enter-gmode arm` is single-jq atomic) + gmode edge/cycle-counter tags. Verify vs `phasic_system/scripts/phase.sh` enter-gmode/exit-gmode + `hooks/gmode-gate.sh`.
- **06_5-execute** (32 refs) — inventory flagged `execute-checkpoint-vs-forward-commit` (CODE: verify `execute-commit.sh` --force prefix logic).
- **06_3-observe** — inventory flagged `observe-direct-action-budget-mechanizes-80-20` (CODE: verify `observe-guard.sh` has the claimed budget logic).
- Also check `.claude/knowledge/b6-reftag-sweep-job-state.md` (INACTIVE) for banked cross-job findings before flagging.

Method: pick candidates, cheapest live check first (Read real code / context / .md-vs-.html), verify BEFORE flag. Aim to source CODE + CONTEXT-SYNC here; PARAGRAPH from b5 05_3/05_7; BLOG from .md↔.html mirror or malformed tag.

**06_10-plan-state-machine READ (2026-07-18):** essay is WELL-maintained — explicitly says "There is no state machine walking a plan through named stages. There is a counting rule," correctly retires plan_state/named-approval-stages, tags cite real job-stages-plans.md + job-completion-reactivation.md sections. Two things to check, NOT yet flags:
- **Slug-vs-thesis oddity (BLOG-ish):** slug is `plan-state-machine` + og_image `markov-phasic-brain-b6.png` while the essay's whole thesis is that there is NO state machine. Slug is not a ref-tag though — likely out of scope; note only.
- **CANDIDATE to verify (`stage-2-md-plan` tag, :39):** claims cycle-1 EXECUTE creates the plan at `.claude/jobs/<job_id>/plan.md` (fixed name `plan.md`) while `set-plan-file` takes `<name>.md`. Is the on-disk name always `plan.md` or `<name>.md`? Check `.claude/context/job-stages-plans.md` "Plan file lifecycle" + `plan.sh`. Possible CONTEXT-SYNC/CODE mismatch — but 06_10 also says "plan.md" consistently, so ground-truth needed before flag.

### Idle-verb prose-drift fix job (1784494198850522700, 2026-07-20) — OBSERVE

**Objective:** in `06_2b-the-phase-map`, the PROSE (~L26) lists **9** idle verbs (extras believed update/complete/approve) while the ref-tag (~L28) and `phase-gate.sh:198` list only **6**. Reconcile prose DOWN to 6, on `.md` + `.html` mirror via the `blog-update` skill.

**Problem family:** doc-vs-code drift — SAME class as just-closed job 642 (prefix-count reconcile). CODE is ground truth; prose reconciles to it. Discipline: sweep the WHOLE essay (both files) for every idle-verb enumeration + bare 9/nine near idle-context; remove the exact extra tokens (parity, not just digit).

**Ground-truth anchors (3):** (a) `.claude/plugins/phasic_system/hooks/phase-gate.sh` ~L198 [code — canonical 6, PENDING verbatim confirm by file-comparer]; (b) in-essay ref-tag ~L28 [says 6 — becomes in-file template like prefixed-questions.md L71 was in 642]; (c) any `context/` idle-verb term [context-anchorer PENDING].

**Deliverable + routing:** `.html` = committed source of truth; `.md` = gitignored editing copy (Read directly, Glob skips it). BOTH must reconcile. Sync via `blog-update` skill — build cmd `python3 .claude/tools/generate_blog_html.py blog/b6/06_2b-the-phase-map.md blog/b6/06_2b-the-phase-map.html --version <YYYYMMDD>`. This is EXECUTE work (full write in blog/b6/) — NOT CONDENSE-routed like 642. **Execute scope = this dir (blog/b6/); this CLAUDE.md is the scope declaration.**

**Status caveat:** 06_2b is "new (split off 06_2)", NOT FINAL → prose edit permitted. (A FINAL essay would need explicit user direction.)

**OPEN threads (resolve before EXECUTE):** (1) exact 9-list vs canonical-6 → derive the extras, don't assume; (2) does `.html` exist/built + do .md/.html carry the SAME two lines; (3) blog-update skill's .md→.html contract; (4) is there a canonical idle-verb list in `context/`.

**CONFIRMED (observe-file-comparer, D2 verbatim + main-session spot-check DONE):**
- **Prose L26 (.md) = L125 (.html), 9 verbs:** ``show, focused, list, `update`, activate, focus, pause, `complete`, `approve` `` — bullet: "Unlock the job-management CLI — the lifecycle surface (…). Creation and graph mutations live elsewhere."
- **Ref-tag L28 (both files), 6:** job.sh whitelist `show|focused|list|activate|focus|pause`.
- **Code phase-gate.sh:198, 6 [D2-CONFIRMED by main-session Read L185-214]:** `IDLE_WHITELIST_RES` regex ``job\.sh[[:space:]]+(show|focused|list|activate|focus|pause)``. **GROUND TRUTH LOCKED AT 6.**
- **EXTRAS TO REMOVE (set-diff, derived): `update`, `complete`, `approve`.**
- **Parity:** `.md` L26 and `.html` L125 IDENTICAL prose → BOTH need the same edit.
- **Full sweep:** only ONE idle-verb enumeration; no other bare 9/nine near idle; CONDENSE's own ref-tag (L61) legitimately scopes `complete`/`update`/`add-dependency` to CONDENSE — LEAVE it.
- **blog/b6/CLAUDE.md exists; blog-update skill at `hadi-nayebi.github.io/.claude/skills/blog-update/`.**

**Fix shape (for PLAN):** in the L26/L125 prose bullet, drop the 3 extras so the lifecycle-surface list matches the 6 idle-callable verbs (`show`, `focused`, `list`, `activate`, `focus`, `pause`). Root cause = the bullet enumerated the *general* job CLI under the IDLE heading with no "idle-callable" qualifier; the adjacent ref-tag already had the correct 6.

**Precedent (on-point):** phasic_system/CLAUDE.md "Idle — Allowed Activities" DELETED its own enumerated idle-verb table because it "DUPLICATED the code whitelist and drifted," replaced by a pointer to the phase-gate.sh whitelist. The 06_2b prose is the SAME failure. Essay fix mirrors it: enumerate only the 6 idle-callable verbs.

**blog-update contract (from blog/CLAUDE.md; SKILL.md M-procedure deep-read deferred to PLAN):** `.html` = committed source of truth, `.md` = gitignored editing copy, sync BOTH. Build: `generate_blog_html.py blog/b6/06_2b-the-phase-map.md ...html --version <YYYYMMDD>`. TWO candidate EXECUTE routes for PLAN: (A) **surgical** identical 3-token removal in .md L26 + .html L125 — minimal/reversible, no rebuild, no ?v= bump; (B) edit .md then **regenerate** .html via skill (may reflow + bump stamp). Route A favored for a 3-token prose fix; confirm against SKILL.md.

**OPEN still:** (1) blog-update SKILL.md M-procedure read [PLAN]; (2) context/ canonical idle-verb surface [context-anchorer]; (3) reflector (blindspot-finder) before advance [family-c gate].
**Skipped:** experience-recaller — job 642 discipline already in context + file-comparer already swept (no over-orchestration on a 1-line drift).

**BLINDSPOT REFLECTOR (observe-blindspot-finder) — 5 gaps (4 cheap OBSERVE checks + 1 user design Q):**
1. **[CHECK] Parent 06_2 drift** — 06_2b split off `06_2-discipline-and-map`; does 06_2 STILL carry the 9-verb idle prose? If yes → OUT of this job's scope (scope=06_2b only) → emit `[PENDING-JOB]`; if clean → note only.
2. **[CHECK] Transcript** — does `06_2b-the-phase-map.transcript.md` exist + mirror the L26 prose? Route A (surgical) may leave transcript stale (manual edit or regen needed); Route B regen from .md handles it.
3. **[USER Q — HIGH] Remove vs Reframe** — editorial rule "reframe, don't remove." Reflector's proposed recast: *"The idle phase calls SIX of the job CLI verbs: show, focused, list, activate, focus, pause. Creation and graph mutations — plus job updates and approval — live elsewhere."* This is THE genuine design question → ask user.
4. **[CHECK] Outbound refs** — is the enumeration quoted in sidebar/feed.xml/sibling essays? A prose-only fix would create NEW drift if so. Likely none; confirm via grep.
5. **[CHECK] context/ canonical idle-verb** — Rule 40: a `[consolidated]` idle-verb list in context/ would be ground truth. LIKELY just a pointer to phase-gate.sh (per phasic_system/CLAUDE.md the idle table was DELETED as drift-prone). context-anchorer to confirm (it was cadence-blocked; relaunch).

**Next:** dispatch investigation for gaps 1/2/4/5 (parallel observe-* agents), then batch the ONE genuine user Q (#3, remove-vs-reframe) via AskUserQuestion `[WAITING]`.

**DRAFT acceptance criteria (PLAN formalizes below ---Ve---; hold for EITHER remove OR reframe):**
- AC1: `06_2b-the-phase-map.md` idle-phase prose no longer presents `update`/`complete`/`approve` as idle-callable (removed, OR reframed so they are explicitly non-idle).
- AC2: `.html` L125 matches the corrected `.md` prose (parity re-verified by grep).
- AC3: transcript (if it exists) consistent with corrected prose (regenerated or hand-edited).
- AC4: ref-tag L28 (already 6) + phase-gate.sh:198 remain the cited ground truth; NO new inaccuracy introduced; the "Creation and graph mutations live elsewhere" clause stays accurate.
- AC5: no outbound reference (sidebar/feed/sibling essay) left contradicting the fix.
- AC6: cache-bust `?v=` handled per blog-update skill IF .html regenerated (Route B); N/A for Route A surgical.

**OBSERVE→PLAN handoff:** ground truth LOCKED (code=6, D2-confirmed); edit surface = .md L26 + .html L125 (+ transcript?); ONE user design Q pending (remove vs reframe); 4 completeness checks in flight (parent 06_2 / transcript / outbound / context-glossary). PLAN will: read blog-update SKILL.md (pick Route A vs B), set Stage (expect **Stage 1**, plan_file=false), formalize ACs below ---Ve---, and — if parent/outbound drift found — emit `[PENDING-JOB]` rather than expand this job's scope (scope stays 06_2b).

**CHECKS RESOLVED (observe-file-comparer #2):**
- **GAP 1 parent 06_2: CLEAN** — `06_2-discipline-and-map` has NO idle-verb enumeration (moved entirely to 06_2b in the 2026-06-21 split). No pending-job needed.
- **GAP 2 transcript: DRIFTED** — `06_2b-the-phase-map.transcript.md` L16 carries the IDENTICAL 9-verb line (`final: false`, unpublished). → **EDIT SURFACE = 3 FILES: `.md` L26 + `.html` L125 + `.transcript.md` L16.**
- **GAP 4 outbound: NONE** — no copy in feed.xml / sitemap.xml / blog.html / sibling essays. Fix self-contained to 06_2b's 3 files.
- **Impl call (CTO, Route A):** surgical 3-token edit to ALL 3 files — transcript is final:false + regenerates from .md, but the surgical edit keeps every mirror consistent NOW at zero cost + avoids a full .html rebuild / cache-bust bump. Confirm no rebuild needed against SKILL.md in PLAN.
- **GAP 5 context/: context-anchorer RELAUNCHED** (Rule-40 ground-truth check; expect "points-to-code-only" per phasic_system precedent).

**USER ANSWER (Q1 [WAITING] — ANSWERED): REFRAME.** Chosen recast: *"Unlock the job-management CLI. Six of its verbs answer from idle — show, focused, list, activate, focus, pause. Creation, graph mutations, and job update / complete / approve belong to later phases."* Aligns editorial "reframe, don't remove"; teaches WHERE the other verbs live → prevents recurrence. Apply to ALL 3 files, voice-matched to the essay's jazz rhythm in EXECUTE (final wording drafted then).

**GAP 5 RESOLVED (context-anchorer): context/ CORRECT (enumerates-and-self-verifies).** `.claude/context/opevc-phases.md:211` "Conductor/musicians model" `[consolidated]` enumerates the 6 idle verbs AND cross-checks phase-gate.sh:198. NOT drifted; no 4th surface to sync.
- **Reinforcing:** that term carries `[sync:blog-body]` — it EXPECTS the essay to teach the same 6. The essay currently BREAKS that sync (teaches 9); MY fix RESTORES it.
- **Separate cosmetic drift (NOT this job):** phase-gate.sh block-read voice still says "completing jobs" is an idle activity → ALREADY QUEUED as pending job `1784494390600149762`. No new job needed.

**blog-update SKILL.md READ — EXECUTE/VERIFY route CONFIRMED (Route A surgical):**
- **M5 md-html-mirror:** every .md prose edit gets a MATCHING .html edit; MD canonical for prose; NO full rebuild for a body-text edit. `.html` READ-before-Edit. The 9 verbs sit in `<code>` tags in .html → match that markup.
- **M6 transcript:** edit transcript prose FREELY while `final: false` (never flip final = user's TTS gate). Hand-edit `.transcript.md` L16 (plain text, no code tags).
- **M7 cache-bust:** `?v=` bump ONLY if CSS/JS changed → NOT needed (prose-only).
- **VERIFY = M5 render-check greps + parity (no residual update|complete|approve as idle-callable; `<code>` verbs render) + M13 self-review-pass** (read reframed bullet as fresh reader, voice-match). Full M14 triple-audit = disproportionate for a 3-token reframe (note only).
- **M3 validates my interview:** blog audit Qs are ONE-per-item; this fix = ONE audit item (idle drift) → ONE question (reframe vs remove), answered. The user's OWN documented blog method = one-Q-per-item — evidence the Stage-1 ≥3 quota mismatches a shallow single-item fix.

**OBSERVE COMPLETE.** Fix = REFRAME the idle bullet in `.md` L26 + `.html` L125 (match `<code>`) + `.transcript.md` L16 (plain), Route A surgical, no rebuild / no cache-bust. Ground truth code=6 (D2). Verify via M5 greps + M13. Scope tight to 06_2b. Expected Stage 1 (plan_file=false).

`[PENDING-JOB]{audit-06_2b-tour-and-b6-deep-dives-for-verb-command-drift | 06_2b is a phase-map TOUR listing each phase's traits; only the IDLE bullet was accuracy-checked. Other-phase bullets here (and the 06_3..06_10 deep-dive essays) may carry the same code-vs-prose verb/command drift — sweep each phase's stated verb/command set against its phase-gate whitelist. | standalone}` — deferred to keep THIS job scoped to the idle bullet (scope discipline).

[PENDING-JOB]{audit-06_2b-tour-and-b6-deep-dives-for-verb-command-drift — 06_2b is a phase-map tour listing each phase's traits, but only the IDLE bullet was accuracy-checked; other-phase bullets here and the 06_3..06_10 deep-dive essays may carry the same code-vs-prose verb/command drift. Sweep each phase's stated verb/command set against its phase-gate whitelist. Standalone; scope-split from job 1784494198850522700 to keep that fix tight to the idle bullet.}
---Pl---

### PLAN (job 1784494198850522700, cycle 1, 2026-07-20) — Stage 1, Route A surgical REFRAME

**Stage decision: Stage 1** (`plan_file=false`, set via `set-plan-file`). Single-surface prose doc-fix, single OPEVC cycle.

**Scope (D2-confirmed):** EXECUTE writes only in `blog/b6/` — THIS CLAUDE.md's `---Ob---` footer (line ~112) is the exact-dir scope declaration. Targets: `06_2b-the-phase-map.{md,html,transcript.md}`. Nothing else editable. (Scope is EXACT, not recursive — the website-root CLAUDE.md being present does NOT authorize this dir; the blog/b6 declaration does.)

**Route A surgical** (blog-update SKILL.md M5/M6/M7, confirmed in OBSERVE): hand-edit prose in all 3 mirrors; NO `generate_blog_html.py` rebuild; NO `?v=` cache-bust (prose-only). `.html` verbs in `<code>`; `.transcript.md` plain text; NEVER flip `final:false`.

**FINAL reframe wording (contract — EXECUTE Reads exact current markup, applies, may micro-polish for jazz voice):**
> Unlock the job-management CLI — the lifecycle surface. Six of its verbs answer from idle: `show`, `focused`, `list`, `activate`, `focus`, `pause` — you read the work and switch which job you are on. Changing a job or closing it out — `update`, `complete`, `approve` — belongs to later phases, not idle. Creation and graph mutations live elsewhere.

- Honors editorial "reframe, don't remove"; teaches the DISTINCTION (these three are non-idle) → prevents recurrence; PRESERVES the original "Creation and graph mutations live elsewhere" clause.
- **REVISED after premortem (family-c):** dropped the earlier "`update` in plan and verify, `complete`/`approve` in the condense wrap-up" phrasing. Pinning each verb to a named phase was (F1) possibly INACCURATE — OBSERVE L124 records the essay's own L61 CONDENSE ref-tag scoping `update` to CONDENSE, so `update` is likely multi-phase — and (F10) brittle to design change. The generic "belongs to later phases, not idle" is PROVABLY accurate from the D2 ground truth alone: `phase-gate.sh:198` IDLE_WHITELIST_RES holds EXACTLY the six, so anything outside it is non-idle by entailment (no extra code read needed). Also matches the user's own chosen recast (OBSERVE L162).
- **Backtick normalization (premortem F3):** current .md backticks only update/complete/approve (L119); EXECUTE backticks ALL NINE verbs consistently (all nine in `<code>` in .html; all plain in .transcript.md).
- Restores the `context/opevc-phases.md:211` `[sync:blog-body]` contract.

**Premortem triage (10 findings):** F1/F2 accuracy → DISSOLVED by the generic-wording choice (accuracy entailed by the D2 whitelist). F3 backtick-normalize → folded into EXECUTE steps. F5 transcript-final → already `final:false` (OBSERVE L157). F8 outbound-refs → already NONE (OBSERVE L158) + AC7 re-check. F4 parity / F6 line-drift / F9 voice → covered by AC4 + step-5 parity diff, Read-before-Edit, AC8 self-review. F7 quota → the WATCH item below. F10 brittleness → mitigated by the durable generic wording.

**EXECUTE steps (ordered — draft-once-then-render-per-surface):**
1. Confirm the canonical wording (above) into the `---Ex---` footer.
2. Edit `.md` (~L26): Read exact current bullet FIRST — current markup backticks only update/complete/approve (see `---Ob---` L119); NORMALIZE so the six idle verbs render consistently with `.html` `<code>`.
3. Edit `.html` (~L125): mirror wording; six verbs in `<code>` tags; Read-before-Edit; preserve HTML structure.
4. Edit `.transcript.md` (~L16): plain text, NO backticks/tags; keep `final:false`.
5. In-execute parity check: prose identical across 3 files (modulo markup); six verbs verbatim in all 3; no line-count/structural drift; extras only in the later-phase clause.
6. Commit immediately (`execute:` prefix, website repo) — the 3 files + this CLAUDE.md.

**WATCH — Stage-1 collaborative question quota:** ≥3 answered `[WAITING]` in OBSERVE + ≥3 in PLAN may gate the PLAN→EXECUTE advance. Current: OBSERVE=1, PLAN=0. Per the user's OWN blog-update M3 (one-Q-per-audit-item), this shallow single-item fix legitimately carries ONE design question (reframe-vs-remove — ANSWERED). If the advance BLOCKS on the quota → surface the shallow-vs-deep-Stage-1 mismatch to the user with this evidence; DO NOT manufacture filler questions (no gate-chasing, per standing rule).

`[AGENT-UPDATE]{plan-scope-analyzer | dispatched to confirm EXECUTE write-scope, it refused with "I need the altered_list + plan" and returned no answer — yet the activated scope was declared plainly in the target dir's CLAUDE.md footer (blog/b6/CLAUDE.md L112: "Execute scope = this dir; this CLAUDE.md is the scope declaration"), which it never read | teach plan-scope-analyzer that when no altered_list is handed in, it should Read the target directory's CLAUDE.md footer and treat an "Execute scope = <dir>; this CLAUDE.md is the scope declaration" line as valid activation proof, instead of refusing — and dispatch prompts should hand it the activated CLAUDE.md path}`

**USER RULING (Q2 [WAITING] — ANSWERED): PARK THE FIX AS PENDING.** The Stage-1 collaborative 3+3 question quota HARD-BLOCKED the PLAN→EXECUTE advance (OBSERVE=1/PLAN=0). This shallow single-item doc-fix genuinely carried ONE design call (reframe-vs-remove, answered). Per standing rules I did NOT manufacture filler questions and did NOT bypass. User chose: leave the reframe AND the gate untouched this session; record the reframe as a pending (parked) job; revisit reframe + gate together in a dedicated later pass. NOTHING lands this session.

**PARK actions taken:** (1) this reframe job (1784494198850522700) paused for later reactivation — the full plan + ACs (above / below `---Ve---`) persist here on disk, so a reactivation resumes with everything intact. (2) the gate-fix is spun out as a NEW standalone pending job (below). Revisit both together.

`[PENDING-JOB]{fix-stage1-shallow-vs-deep-collaborative-quota | the Stage-1 collaborative question quota (≥3 answered [WAITING] in OBSERVE + ≥3 in PLAN, phase_plan config) HARD-BLOCKS shallow single-item Stage-1 doc-fixes that genuinely carry only ONE design question — the quota is designed for DEEP collaborative Stage-1 jobs (teaching a new skill). Add a shallow/deep Stage-1 distinction (or a shallow single-item exemption) so shallow Stage-1 jobs are not forced to manufacture filler questions to advance. Touches phase_plan quota gate — PLUGIN-substrate work, needs gmode or a user-approved job. Discovered blocking job 1784494198850522700 (06_2b idle-verb reframe), which is parked pending this fix. | standalone}`

---Ex---

---Ve---

### ACCEPTANCE CRITERIA (PLAN-formalized; VERIFY runs these) — job 1784494198850522700

Anchor: the bullet beginning "Unlock the job-management CLI" in `06_2b-the-phase-map` (.md ~L26, .html ~L125, .transcript.md ~L16). REFRAME shape (not removal).

- **AC1 (reframe, per file):** in EACH of the 3 files, `update`/`complete`/`approve` NO LONGER appear inside the idle-callable enumeration — they appear ONLY in the "later phases" clause. (grep the bullet region; the six-verb idle list contains none of the 3 extras.)
- **AC2 (six present):** the six idle verbs `show`,`focused`,`list`,`activate`,`focus`,`pause` are all present in the idle enumeration in each file.
- **AC3 (names where):** the reframed bullet states update/complete/approve live in later phases (update→plan/verify; complete/approve→condense). grep bullet region for the phase names.
- **AC4 (.md↔.html parity + render, M5 greps):** .md and .html bullets carry identical prose (modulo markup); .html six verbs in `<code>`; NO `<p>!<a` mis-render; NO unrendered backticks/markdown in .html; NO OPEVC anchor strings (`---Ob---` etc.) in blog source.
- **AC5 (transcript plain):** `.transcript.md` bullet is plain text — no backticks, no `<code>`, no HTML angle brackets; frontmatter `final:false` unchanged.
- **AC6 (clause preserved):** the "Creation and graph mutations live elsewhere" clause is still present and literally true.
- **AC7 (no new outbound drift):** no feed.xml / sitemap.xml / blog.html / sibling-essay copy contradicts the fix (OBSERVE confirmed none; re-confirm at VERIFY).
- **AC8 (M13 self-review — JUDGMENT):** the reframed bullet reads in the essay's jazz voice — auditor: verify-observe-auditor or a fresh-reader self-review pass.
- **AC9 (Route A discipline):** NO `generate_blog_html.py` run; NO `?v=` cache-bust bump; git diff limited to the 3 files' bullet region + this CLAUDE.md.
