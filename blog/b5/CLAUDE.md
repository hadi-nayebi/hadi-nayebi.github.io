# CLAUDE.md — Blog 5 Mini-Series (Always-On Digital Cortex)
**Version:** v1.1.0
**Series:** B5 — Pt 1 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture
**Audience:** Power Users & Architects (Tier 2 → Tier 3)
**Last updated:** 2026-07-15 (de-bloat: series reference + banked decisions + this job's session-by-session narration EXTRACTED to `../../.claude/knowledge/b5-series-reference.md`, `b5-ref-tag-review-session-log.md`, `ref-tag-review-lessons.md`. The live ref-tag-review job state below is unchanged.) Series status: 9/9 GOAL ACHIEVED (2026-05-19); B5.9 re-audit pending.

## Purpose

B5 series working memory. Everything specific to the 9 sub-essays of *The Always-On Digital Cortex* lives here. Parent context: `../CLAUDE.md` (website-wide working memory) + `../../CLAUDE.md` (agent-side root). This file is the **series compartment** — plus, currently, the live working memory for the **b5 ref-tag review job** (OPEVC footers below).

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

| Slug | Title | Audience | Status |
|------|-------|----------|--------|
| `05_1-the-two-layer-foundation` | The Two-Layer Foundation | Tier 2/3 | GOAL ACHIEVED |
| `05_2-plugin-integrity` | `plugin_integrity` — Plugin Edit Safety | Tier 2/3 | GOAL ACHIEVED |
| `05_3-brain-guard` | `brain_guard` — Context Window Discipline | Tier 2/3 | GOAL ACHIEVED |
| `05_4-job-core` | `job_core` — Job Lifecycle | Tier 2/3 | GOAL ACHIEVED |
| `05_5-interaction-summary` | `interaction_summary` — Mega-Prompt Compression | Tier 2/3 | GOAL ACHIEVED |
| `05_6-question-discipline` | `question_discipline` — Structured Questions | Tier 2/3 | GOAL ACHIEVED |
| `05_7-claude-md-hierarchy` | The CLAUDE.md Hierarchy | Tier 2/3 | GOAL ACHIEVED |
| `05_8-historian-ratchet` | The Historian Ratchet | Tier 3 | GOAL ACHIEVED |
| `05_9-customization-guardrail` | The Customization Guardrail | Tier 3 | GOAL ACHIEVED |

Per-essay read-time / image / GOAL-provenance detail + the (stale) Refs column + asset tree + banked series decisions → `../../.claude/knowledge/b5-series-reference.md`. Live `.html` ref-marker counts (05_3=25, 05_4=18, 05_6=15, 05_7=22, 05_9=25) are corrected by the F4 fix below. Audio: zero MP3s yet; audio gen is USER-GATED (Rule 12 paid TTS spend + 2026-05-18 "only if text is absolute-final") — triple-verify every transcript before any audio API call.

## Tooling notes

- **Build:** `python3 tools/generate_blog_html.py blog/b5/<slug>.md blog/b5/<slug>.html --version 20260518` (autodetects subdir → depth-aware mode: `../../` site-nav, subdir canonical URL, `audio/` in subdir).
- **Transcript:** `python3 tools/generate_blog_transcript.py blog/b5/<slug>.md blog/b5/<slug>.transcript.md` (resets `final: false`; user flips to `true` to authorize audio).
- **Audio:** `python3 tools/generate_blog_audio.py blog/b5/<slug>.transcript.md blog/b5/audio/<slug>.mp3` (refuses unless `final: true`; ~$0.75/essay on tts-1-hd).
- **Live URL pattern:** `https://hadi-nayebi.github.io/blog/b5/05_X-<slug>.html` (old root-level URLs 404 — restructure approved, no redirects).

## Cross-references

- Parent: `../CLAUDE.md` (website-wide working memory) · agent-side root: `../../CLAUDE.md`.
- Sibling series (future): `../b6/CLAUDE.md`, `../b7/CLAUDE.md`, `../b8/CLAUDE.md`.
- Auditor specs: `../../.claude/agents/blog-{quality,ref-tag,series-coherence}-auditor.md`.
- /goal job memory: `~/.claude/projects/<this-project>/memory/jobs/job_goal_3_clean_rounds_b5_b8.md`.
- **Ref-tag-review archives:** session narration → `../../.claude/knowledge/b5-ref-tag-review-session-log.md`; reusable lessons (coverage-soundness, main-session-reads, taxonomy, b6-b8 follow-up) → `../../.claude/knowledge/ref-tag-review-lessons.md`.

---Ob---

## OBSERVE — b5 ref-tag review, cycle 1 (CONVERGED)

Full session-by-session derivation (the discovery-vs-grep-sweep contradiction, scan fan-outs, subagent-balloon wedge, done-def replacement) is archived in `../../.claude/knowledge/b5-ref-tag-review-session-log.md`. Below = the live converged state.

**Issue-class taxonomy + family-grouping heuristic:**
- Class 1 MISSING · Class 2 WRONG · Class 3 TOO-MUCH (over-scope) · Class 4 OUT-OF-SYNC vs CODE (retired mechanism, renamed symbol, stale count, line number) · Class 5 OUT-OF-SYNC vs `.claude/context/`.
- **Family-grouping heuristic:** group drifted tags by the SUPERSEDING IMPLEMENTATION EVENT — one code change (e.g. the 2026-07-09 %-of-window ruling) drifts every tag that referenced the old model, across essays. A "family" = all tags keyed to one retired mechanism. Count is an OUTPUT of coverage, never a target — do NOT invent problems (family-vs-instance). Known false-positive classes: "naive-grep false-positive" (05_9 OR-gate tags) + "naive-Glob false-positive" (05_7 L131 gitignored `.md` pointer).

**FINAL FAMILY SLATE (ref-tag defects in ESSAY bodies):**
- **F1 — accrual→%-of-window** (05_3, **5 tags** L125/L141/L143/L193/L203). Class 2+4. VERIFIED. Grep-at-zero: `grep -i 'ACCRUAL_SOFT\|ACCRUAL_READ_BLOCK' 05_3…html` → 0 AND `grep 'ACCRUAL-ANCHORED' 05_3…html` → 0.
- **F2 — "Principle 9 — Five Markers" section renamed** (05_7 L167, **1 tag**). Class-4. VERIFIED. Grep-at-zero: `grep 'Principle 9 — Five Markers' 05_7…html` → 0 (live heading = `9. Five CONDENSE Markers as Cross-Phase Signal System`).
- **F3 — line-numbers in ref-tag pointers** (Rule-20 bans everywhere), **14 tags** (05_1:1 L190 · 05_2:6 L119/L143/L156/L164/L168/L170 · 05_6:3 L129/L135/L141 · 05_7:4 L133/L161/L183/L185). Class-4 + policy. DOMINANT. Line refs appear in BOTH the pointer field (05_2 L119 `(L11)(L23)…`) AND the summary field (05_6 L135 `capture.sh:85-131`, 05_7 L133 `currently L4`) — the ban is whole-tag. Grep-at-zero: no `line [0-9]` / file`:NN` / `L[0-9]` file-location inside any b5 ref-marker `title=`.

**⚖️ F4 — b5 CLAUDE.md "9 sub-essays" table Refs column stale (class-4, architect ruled FIX THIS PASS):** stale rows 05_3(13→25), 05_4(12→18), 05_6(13→15), 05_7(20→22), 05_9(16→25); correct rows 05_1/05_2/05_5/05_8. Correct against live `grep -o 'class="ref-marker"'` counts.

**⚠️ F5 — stale-quoted-summary (class-2): a ref-tag SUMMARY quotes verbatim text from a live file that has since changed.**
- **05_1 L136** `cognition-as-memory-multi-form` — **CONFIRMED** (verified against injected live `.claude/CLAUDE.md`): quotes knowledge/ as "…The **sole** reference…" — LIVE "the **durable, monotonically-growing** reference…" (no "sole"); quotes `knowledge/identity/` = "INDEX + **5** deep-dives" — LIVE "INDEX + **one deep-dive per identity fact**"; identity now carries **6** facts.
- **CANDIDATES (owed VERIFY, architect ruled FIX ALL not defer):** 05_7 L127 `drop-a-file-named-claude` (quotes `brain_guard/hooks/CLAUDE.md` header + "116 CLAUDE.md files / 111 four-footer" counts) · 05_7 L155 `knowledge-directory-is-durable-layer` (cites `Principle 6 — Subagents as Extractors` — likely renamed `6.`) · 05_1 L138/L142/L184/L186 (quote `brain_guard/CLAUDE.md` Objective+Status, `settings.local.json` hook list, plugin Objective — SUSPECT post phasic-compaction upgrade).
- Grep-at-zero (F5): each confirmed stale quote's OLD verbatim string returns 0 inside its essay after fix.

**CAP-RELEVANT GUARDS (hold across all fixes):**
- **Source-of-truth mechanic:** `.html` = committed source-of-truth (served + git-tracked), GENERATED from `.md` (gitignored, local-only) via `generate_blog_html.py`. Fix = edit the `.md` `*[ref: slug | pointer | summary]*` bracket → regenerate the `.html` so both end consistent; grep-at-zero done-check runs on `.html`; also confirm `.md` so a regen never reintroduces drift.
- **`ACCRUAL_CRITICAL` is RETAINED** (=180000; heartbeat tempo + stop-gate wedge-yield via accrual-helper.sh). The F1 zero-grep EXCLUDES it on purpose — never blanket-delete "accrual"; own-eyes each F1 tag.
- **Rule 20 line-number ban** (revised 2026-06-10, canonical in `.claude/context/identity.md` "ref-tag" + blog/CLAUDE.md "ref-tag"): bans line numbers **EVERYWHERE** — the OLD "stable plugin code MAY keep file:line" exception is RETIRED. Dates / versions / counts / times are LEGAL digits; only file:line POINTERS violate.

**Live [VOICE-UPDATE] deliverables (surface to architect at done — substrate/gate gaps, NOT seed errors):**

`[VOICE-UPDATE]`{observe-commit-force-summary-file-requirement (observe→plan boundary block) | It HARD-requires a rolling --summary FILE, but observe-guard forbids writing ANY non-CLAUDE.md file in observe (Write to a scratch summary file is blocked), so the observe→plan advance is unreachable in-phase; the operator self-compact Prior-Summary fix (no scratch file) did NOT reach this boundary path. This is a substrate contradiction, not a seed error. | direction: make observe-commit --force read the rolling summary from the compaction file's ## Prior Summary (no scratch --summary file), matching the self-compact fix; OR exempt the boundary summary-file write from observe-guard so the seed can author it.}

---Pl---

## PLAN — b5 ref-tag review (Stage 1, cycle 1)

**Stage:** 1 (single-cycle collaborative). `plan_file=false` committed — actionable steps live in these footers, no plan file.

**Fix objective:** reduce every drifted b5 ref-tag to stable useful content (slug + VERIFIED file/section-or-function pointer + accurate summary), **TAGS ONLY**, **b5 essays only**, each fix proven by a deterministic grep-at-zero on the committed `.html`. The SOUND own-eyes 1/3/5 pass runs in EXECUTE/VERIFY, then the ARCHITECT calls DONE at CONDENSE.

**Verified family slate (ready to fix):** F1 accrual→%-of-window · `05_3` · 5 tags (class 2+4) · F2 "Principle 9 — Five Markers" rename · `05_7` · 1 tag (class 4) · F3 line-numbers in pointers (Rule 20) · `05_1/05_2/05_6/05_7` · 14 tags (class 4 + policy) · F5 stale-quoted-summary · `05_1` L136 confirmed · 1 tag (class 2). (F4 = the table-count fix, ruled in-scope below.)

**Reduction standard (what a fixed tag looks like):** slug unchanged · pointer = stable file + section/function name **verified to exist in the live file** (Growth Rule 8), NO line numbers · summary = accurate current-behavior description. Never emptied, never left stale, never paraphrased-but-still-stale.

**Risk mitigations (from premortem — EXECUTE must hold these):**
1. **Regen-validation gate** — after each regen, confirm the `.html` rebuilt: command exit 0 + file non-empty + contains `<!DOCTYPE`. Else FAIL-STOP. Silent `.md`↔`.html` desync is the top risk (grep can pass on a stale `.html`).
2. **New-pointer existence check** — before writing a repointed tag, grep the LIVE target to confirm it exists (F1 → `config.conf` `CONTEXT_*_PCT` + `brain-memory.md` "%-of-window boundaries"; F2 → `phase_condense/docs/principles.md` "9. Five CONDENSE Markers…").
3. **ACCRUAL_CRITICAL is RETAINED** — never delete it (heartbeat/stop-gate); the F1 zero-grep excludes it on purpose. Own-eyes each F1 tag; do NOT blanket-delete "accrual".
4. **Grep LOCATES, own-eyes ARBITRATES** — the literal greps find candidates; EXECUTE reads each located tag to catch variant line-number forms + paraphrased-stale quotes the pattern misses.
5. **Scope guard** — tags-only + b5-only. Pre-commit `git diff` must show ONLY `*[ref: …]*` bracket lines + regenerated `.html`; any body-prose diff is scope-drift → revert. Do NOT sweep b6/b7/b8.

**✅ ARCHITECT STEER — RESOLVED (Fable; verbatim-faithful):**
- **F1/F2/F3/F5 (21 confirmed defects) are REAL → FIX them.**
- **F4 = FIX THIS PASS** — correct the b5 CLAUDE.md "9 sub-essays" table Refs counts (05_3 13→25, 05_4 12→18, 05_6 13→15, 05_7 20→22, 05_9 16→25).
- **F5 = FIX ALL CANDIDATES too** (not defer) — verify 05_7 L127 + 05_1 L138/L142/L184/L186 the SOUND way in VERIFY (Read+Grep native), fix any confirmed stale.

**⛔ COVERAGE IS NOT COMPLETE — architect caught the unsoundness. Do NOT call it "own-eyes coverage of all 9":**
- Genuine own-eyes **paragraph→tag** reads happened ONLY for **05_1 + 05_2** (session-6). The other **7 essays (05_3–05_9) were PURE-GREP** = the **tag→source** direction, which **STRUCTURALLY cannot find class 1 (missing) / 3 (over-scoped) / 5 (glossary-drift)**.
- So **"1/3/5 clean corpus-wide" is UNSUPPORTED for 7 of 9 essays** — the same unsoundness that voided the prior review. Architect's independent spot-check of 05_4/05_5/05_8 found the corpus genuinely well-tagged → this pass will likely CONFIRM mostly-clean, but it must be verified the SOUND way, never grep-declared. (Full taxonomy-soundness lesson: `../../.claude/knowledge/ref-tag-review-lessons.md`.)

**MANDATE — genuine own-eyes paragraph→tag pass of 05_3, 05_4, 05_5, 05_6, 05_7, 05_8, 05_9 in EXECUTE/VERIFY** (Read+Grep are NATIVE there — the OBSERVE context-gate balloon does NOT apply):
- Per claim paragraph ask: **is it correctly + fully tagged?** class 1 = untagged real code/context claim · class 3 = tag over-claims its source · class 5 = tag's term drifted vs the `.claude/context/` dir.
- **Balloon-safe method:** Read each essay file directly (small files), scan its paragraphs; for a suspect tag extract ONLY the needed field + compare to the live file/context; short quote + file:line; a few paragraphs per subagent → findings-with-evidence.
- **Fold any new hits into the slate**, fix everything (incl. F4 + all F5 candidates), then re-present the COMPLETE slate with per-essay own-eyes 1/3/5 evidence at CONDENSE (the architect calls done).

**Class-1 (MISSING) fix rule — architect ruled AUTHOR this pass (Fable; verbatim-faithful):** a class-1 miss on a REAL claim is a defect; authoring the inline tag stays tags-only (no body prose touched). TWO GUARDRAILS + a borderline rule:
1. **Only genuine, checkable code/context claims get a tag** — NOT opener/closer bridges, aphorisms, or analogies (those are CORRECTLY untagged; a tag on a non-claim is itself a **class-3 over-scope defect** — do NOT over-author).
2. **Every new tag's pointer MUST be a STABLE anchor** (section/heading/verbatim quote-string), NEVER a line number — a line-number pointer would recreate the exact F3 defect. So: slug + verified STABLE pointer + accurate summary, each verified against the live file/context.
3. **Genuinely borderline** (real claim vs bridge) → RECORD as a finding for the architect's call, do NOT guess.

`[VOICE-UPDATE]`{stage1-collaborative-quota-block | The Stage-1 plan-commit --force gate requires at least 3 [WAITING] answers CAPTURED via the AskUserQuestion tool, but the architect answered all 3 genuine PLAN questions (slate, F4/F5 scope, class-1 rule) as FREE-FORM typed messages that interrupted the tool. Those answers ARE logged to user_interactions and ARE genuine collaboration, yet the quota stayed at 2/3 - so a Stage-1 job whose user prefers typed answers cannot satisfy its own collaborative gate through normal collaboration. | direction: either (a) count a user_interactions entry that answers a pending [WAITING] question toward the quota even when the AskUserQuestion tool was interrupted/rejected - credit the ANSWER, matching the design's own words "credit lands on CAPTURE, the answer logged to user_interactions"; OR (b) have the block voice explicitly tell the seed that only tool-SELECTED answers register and to ask the user to select rather than free-form. Substrate/gate gap, not a seed error.}

`[VOICE-UPDATE]`{compact-wake-clear-inject-reanchor (brain_guard SessionStart clear-hook + the /clear command note) | The wake instruction says "Read the compaction file DIRECTLY at its path — it is carved out of EVERY phase guard." In PLAN this is false: phase_plan/plan-guard.sh BLOCKED my main-session Read of `.claude/jobs/<id>/run-1/compaction-9.md` ("Read outside CLAUDE.md layer") AND blocked the dispatched post-compact-context-refresher subagent from reading it. So the promised carve-out does not hold in a read-narrowed phase, making the stated resume path unreachable; I re-grounded from the b5 CLAUDE.md footers instead (which worked). | direction: either (a) soften the voice — say the compaction-file carve-out holds only where the guard admits it, and in read-narrowed phases (plan/verify) re-ground from the CLAUDE.md footers / pay heartbeat then advance; or (b) treat as a substrate gap for the architect — the phase guards do NOT actually carve out the `.claude/jobs/**/compaction-*.md` path though the design claims they do. Flag as substrate contradiction, not a seed error.}

---Ex---

## EXECUTE — per-essay fix checklist (tags-only; Read-locate + Edit + regen)

Altered scope = `blog/b5/`. **Grep is a VERIFY tool, not available in EXECUTE** — locate targets by Reading the `.md` and finding the tokens/lines below. Per essay: **Read** `.md` → **Edit** each drifted `*[ref: …]*` tags-only per the reduction standard → **regen** `.html` via Bash → **regen-validation** (exit 0 + file non-empty + contains `<!DOCTYPE`). Commit per essay; pre-commit `git diff` shows ONLY ref-bracket + `.html` lines (any body-prose diff = scope-drift → revert).

**05_1 ✅ DONE** (F3+F5, .md+.html, S-13). **05_7 (S-13) own-eyes 1/3/5 CLEAN + fixes applied** (F2 rename + 4×F3 line-strips + L149 stale "Voice Architecture (C2 lessons)"→"Voice Architecture"; .md via subagent, .html mirror owed by main session). **NEW 05_7 candidates → VERIFY grep-native:** (a) L155 `knowledge-directory-is-durable-layer` cites `Principle 6 — Subagents as Extractors` — likely renamed `6.` (F2-family 2nd instance); (b) L27+L163 count "116 files / 111 footers" — verify live; (c) L27 `drop-a-file-named-claude` F5 brain_guard/hooks header quote → verify live.

**`05_2-plugin-integrity`** (F3, 6 tags) — the 6 tags carrying line-number pointers → strip line-numbers, keep file+section/function pointer. Regen → validate.

**`05_3-brain-guard`** (F1, 5 tags) — the 5 tags citing `ACCRUAL_SOFT` / `ACCRUAL_READ_BLOCK`: repoint the 4 retired-knob tags → `config.conf (CONTEXT_SOFT_PCT / CONTEXT_READ_PCT / CONTEXT_CRITICAL_PCT) + brain-memory.md "%-of-window boundaries"`; rewrite the 1 class-2 WRONG summary to describe %-of-window behavior. **RETAIN any `ACCRUAL_CRITICAL` reference** (heartbeat/stop-gate — legitimate). Regen → validate.

**`05_6-question-discipline`** (F3, 3 tags) — the 3 line-number tags → strip line-numbers, keep pointer. Regen → validate.

**`05_7-claude-md-hierarchy`** (F2 + F3, 5 tags) — F2 (tag `footers-replace-chat-working-memory`): repoint section title "Principle 9 — Five Markers" → "9. Five CONDENSE Markers as Cross-Phase Signal System"; keep slug+summary. F3 (4 tags): strip line-numbers, keep pointer. **ONE regen after both families** → validate.

**Step 0 (do FIRST) — SOUND own-eyes 1/3/5 pass of 05_3, 05_4, 05_5, 05_6, 05_7, 05_8, 05_9** (architect mandate; Read+Grep native in EXECUTE): Read each essay directly (small files), scan paragraph→tag for class 1 (untagged real code/context claim) · class 3 (tag over-claims its source) · class 5 (tag's term drifted vs `.claude/context/`). Balloon-safe: for a suspect tag extract ONLY the needed field, compare to the live file/context, short quote + file:line. **Fold any new hits into the slate before fixing.** (05_1 + 05_2 already own-eyed session-6 — 1/3/5 clean there.)

**F4 (this pass)** — correct the "9 sub-essays" table Refs column in THIS file against live `grep -o 'class="ref-marker"'` counts: 05_3→25, 05_4→18, 05_6→15, 05_7→22, 05_9→25 (05_1/05_2/05_5/05_8 rows already correct).

**F5-candidates (this pass)** — verify 05_7 L127 + 05_1 L138/L142/L184/L186 against their live files; reduce any CONFIRMED stale quote → stable file/section pointer + accurate summary (same reduction standard). Fix only what own-eyes confirms stale.

> Method (balloon wedge broken): own-eyes reads + tags-only edits run in the MAIN SESSION (subagent-read balloons past the 25% Read-block — see `ref-tag-review-lessons.md` Lesson 2); `.html` regen + live-source grep run in VERIFY (scripts + Grep native). Compact between essays. Follow-up job pointer + the b6/b7/b8 combined ref-tag review live in `ref-tag-review-lessons.md`.

**S-24 EXECUTE CLOSURE (backward from verify to commit the regen):** The F5 family EXECUTE deliverable is COMPLETE + committed. The 5 S-21 tags + the 6th Voice-Arch tag were fixed in `.md` (S-21), regenerated to `.html` by the architect (supervisor-run `generate_blog_html.py`, S-23), and committed to the website repo at **`a08a325`** via the sanctioned backward-to-execute `git add -u` multi-git path (verify-commit stages only CLAUDE.md/plans, so the two `.html` needed the execute-phase commit). grep-at-zero PASSES (S-23). Nothing left to fix — forwarding execute→verify to re-confirm, then verify→condense for the architect done-call.

`[AGENT-UPDATE]`{verify-code-evolution-tracker | dispatched for a grep-at-zero ground-truth check it INFERRED the counts from commit messages plus blog/b5/CLAUDE.md prose instead of running grep, and falsely reported all-zero-and-consistent while the committed .html was actually stale — the exact D2 antipattern | add a hard clause to its definition and to grep-at-zero dispatch prompts: for any grep-at-zero or count task it MUST run the literal grep and paste the integer output verbatim, and MUST NOT cite docs or commit messages as evidence}

`[VOICE-UPDATE]`{heartbeat-cadence-blocked heartbeat message in brain_guard heartbeat-sensor.sh | the block text claims batching N invocations in one Bash call counts as N, but empirically a multi-line batch and an ampersand-joined batch are both rejected and only ONE metacog-reflect per Bash call is credited — cost several wasted attempts and grew the debt | reword to one metacog-reflect per Bash call OR make the sensor genuinely credit each metacog-reflect token in a multi-call command. Plugin-code voice = route via a gmode PENDING-JOB, not a same-cycle condense-voice-updater edit}

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

**Own-eyes 1/3/5 ledger:** ✅ 05_4 / 05_5 / 05_8 (batch-1, clean — 05_4 full-field schema + pre/post hooks · 05_5 two-phase + `summary.sh submit` sole bypass · 05_8 every claim tagged, glossary-consistent) · ✅ **05_3** (session-9, main-session: 1/3/5 CLEAN; L37 two-events ¶ borderline-untagged, covered by adjacent L35 tag — not force-authored) · ✅ **05_6** (session-10, main-session: 1/3/5 CLEAN — every code/context-claim ¶ tagged, opener/closer bridges L19/L43/L83/L87 correctly untagged, tag terms glossary-consistent, no over-scope; **F3 3 tags FIXED in .md**: `pre-call-hook-walks-questions` stripped "line 135", `per-prefix-shape-gates` stripped "capture.sh:85-131", `waiting-current-vs-future-shape` stripped "gmode-gate.sh:54-63") · ✅ **05_7** (session-13, 1/3/5 CLEAN + F2/F3 fixes applied) · ✅ **05_9** (session-20, 1/3/5 CLEAN — corpus now fully own-eyed).

**05_3 F1 → 6 tags (own-eyes catch grep MISSED):** the 5 known + `file-size-ramp` (its closing clause called the context ramp "accrual stages baseline+~120k/~160k/~180k", stale post the 2026-07-09 %-of-window ruling); `dispatch-mechanism-customization` correctly EXCLUDED (dispatch-only summary). **Fix:** all 6 repointed → `config.conf CONTEXT_SOFT_PCT/CONTEXT_READ_PCT/CONTEXT_CRITICAL_PCT` + `brain-memory.md "%-of-window boundaries"`; summaries → %-of-window (Read-block 25% / critical 30% of MAX_CONTEXT_TOKENS, no baseline/accrual); **ACCRUAL_CRITICAL RETAINED** as the heartbeat/stop-gate knob. grep-at-zero: `ACCRUAL_SOFT` / `ACCRUAL_READ_BLOCK` / `ACCRUAL-ANCHORED` → 0 in 05_3 tags.

`[PENDING-JOB]`{b5-body-prose-accrual-to-percent-window — 05_3 BODY prose still teaches the retired accrual context-gate model as live (§"How it works — the progressive squeeze" L41; §"What you would customize" L114). Tags-only scope leaves the fixed F1 tags describing %-of-window while the body teaches accrual — a deliberate tag↔body mismatch flagging the body for a rewrite follow-up (b5, likely wider corpus); keep accrual framing only where it is genuinely the heartbeat tempo. Surface at architect done-checkpoint.}

**APPLIED (S-11→S-15).** All `.md` fixes DONE: 05_1(F3+F5), 05_2(6 F3), 05_3(6 F1→%-of-window), 05_6(3 F3), 05_7(F2+4 F3+L149).

**S-19 RE-GROUND (post-clear; git-audit confirmed; prior loop hand-mirrored `.html`, now resolved).** VERIFY landed the regen: HEAD `1e1f1f9` regenerated 05_2/05_3/05_6/05_7 `.html`; grep-at-zero PASSES F1(05_3)/F2(05_7)/F3(05_1,05_2,05_6)/F5(05_1 L136); tree CLEAN. **ONE defect → VERIFY backward to EXECUTE:** F3-05_7, 2 summary-field line-numbers the `.md` fix MISSED — tag `second-consequence-altered-list` (`execute-guard.sh Comment line 822`) + tag `claude-md-edits-gate-execution` (`plan-tracker.sh comment line 126`). FIX: Read 05_7.md → strip ONLY the line-number clause from each (keep file+function pointer, Rule 20) → commit → VERIFY regen 05_7.html + grep-at-zero F3-05_7. THEN owed VERIFY: own-eyes 1/3/5 (05_7, 05_9) · F5-candidates (05_7 L127/L155, 05_1 L138/L142/L184/L186) · F4 table → CONDENSE done-[WAITING] (architect calls done).

**S-21 APPLIED (this session, post-clear) — the 5 confirmed-stale F5 tags FIXED in `.md`, tags-only:**
- 05_1 `chat-session-not-where-memory-lives` + `long-before-the-model-runs` — stale brain_guard Objective clause "Currently enforces a context-aware self-compact loop" replaced with stable "finalize then clear-and-inject" current-behavior phrasing; the Status "Feature #1 … two dispatch modes" quote de-verbatimed but kept accurate (still true at live brain_guard/CLAUDE.md L8).
- 05_7 `knowledge-directory-is-durable-layer` — pointer "Principle 6 — Subagents as Extractors" → "6. Subagents as Extractors" (live `### 6.` heading); summary "Principle 6 names" → "Section 6, Subagents as Extractors, names".
- 05_7 `drop-a-file-named-claude` + `relationship-is-asymmetric-phasic-uses` — volatile "116 / 111 of 116" counts reduced to stable phrasing (many … nearly all), NOT a fresh hardcoded 141 that would re-drift; the still-accurate hooks/ header quote kept.
- Slugs + pointer structure preserved; body prose untouched. **OWED VERIFY (regen relocated here — Bash blocked in execute):** regen 05_1 + 05_7 `.html` → F5 grep-at-zero (each OLD verbatim quote → 0 in its essay: "Currently enforces a context-aware self-compact loop" → 0 in 05_1; "Principle 6 — Subagents as Extractors" → 0 and "116 CLAUDE.md" → 0 in 05_7) → md↔html consistency spot-check.

`[VOICE-UPDATE]`{execute-guard-metachar-scan (phase_execute/hooks/execute-guard.sh Bash-argv metachar block) | The compaction-section named with an ampersand trips execute-guard's literal Bash-argv metachar scan, so a metacog-reflect targeting that exact section is BLOCKED in execute even though the heartbeat gate itself exempts metacog-reflect — the one compaction section whose canonical name carries a metachar is unreachable in execute, forcing risk/assumption content to be misrouted to Process Insight or Open Threads. | direction: either (a) exempt the known compaction-section literal from execute-guard's metachar scan, or (b) accept a metachar-free alias in metacog-reflect that compaction-io.sh maps to the canonical section. Substrate/gate gap, not a seed error.}

`[PENDING-JOB]`{b5-body-prose-stale-counts — 05_7 L163 BODY prose still reads "well over a hundred CLAUDE.md files … 111 of 116 inside .claude/ alone" (live count 141); tags-only scope fixed the ref-tag summary counts but deliberately leaves this body-prose count stale — a tag-vs-body mismatch flagging the body for a count-refresh follow-up. Fold into the same body-rewrite follow-up as the 05_3 accrual-to-percent-window body drift. Surface at architect done-checkpoint. | reject-or-standalone}

**S-21 DRIFT-AUDIT reconciliation (execute-drift-auditor + D2 ground-truth):** auditor MATCHED 4/5 but flagged Edit-2 (05_1 `long-before-the-model-runs`) as MISSING — **D2 ground-truth REFUTED it as a FALSE NEGATIVE**: live 05_1 L85 carries the slug WITH the applied fix ("finalize then clear-and-inject", stale clause gone). No backward cycle wasted. Auditor's real catch (E): 05_7 L149 tag `brain-index-catalogs-plugins` still referenced renamed section "Voice Architecture (C2 lessons)" (live `.claude/CLAUDE.md` = "Voice Architecture") — a planned S-13 fix that never landed. **FIXED this session (6th tag, tags-only):** → "Voice Architecture". Grep-at-zero owed in VERIFY: `Voice Architecture (C2 lessons)` → 0 in 05_7.

## VERIFY-RESULTS — grep-at-zero re-run (S-20 session, post-clear; tree CLEAN so committed `.html` == working tree)

Git-audit spot-check: HEAD chain confirms `1e1f1f9` (regen 4 essays) + `3b773ca` (F3-05_7 residual strip) + `970470c` (family fixes complete) landed; `git status` clean. Regen claim from S-18/S-19 CONFIRMED true, not stale.

**grep-at-zero PASS (own-eyes-arbitrated, committed `.html`):**
- **F1** `05_3` — `grep -nE 'ACCRUAL_SOFT|ACCRUAL_READ_BLOCK|ACCRUAL-ANCHORED'` → **0** ✅ · guard: `ACCRUAL_CRITICAL` count=1 → RETAINED as designed ✅
- **F2** `05_7` — `grep 'Principle 9 — Five Markers'` → **0** ✅
- **F5** `05_1` L136 — `grep -nE 'sole reference|INDEX \+ 5|5 deep-dives'` → **0** ✅

- **F3** `05_1/05_2/05_6/05_7` — title-isolated `grep -oE 'title="ref:[^"]*"' <f> | grep -Eo 'line [0-9]+|[a-zA-Z._-]+:[0-9]+|L[0-9]+(-[0-9]+)?'` → **0** each ✅. D2 spot-check: extraction found **15/17/15/22** titles per file (non-empty → real pass, not a silent-empty false-pass); 05_6=15 + 05_7=22 also cross-match F4 expected ref-marker counts.

**⇒ ALL FAMILY TAG-FIXES VERIFIED: F1 ✅ F2 ✅ F3 ✅ F5(05_1 L136) ✅ on the committed `.html`.**

**F5-CANDIDATES — own-eyes vs live source (SOUND, architect-mandated):**
- ⛔ **STALE (need EXECUTE fix, tags-only):**
  1. `05_1 chat-session-not-where-memory-lives` — Objective quote "Currently enforces a context-aware self-compact loop" ABSENT from live `brain_guard/CLAUDE.md` (Objective reworded post phasic-compaction). Status quote ("Feature #1 … two dispatch modes", live L8) still accurate → fix ONLY the Objective clause.
  2. `05_1 long-before-the-model-runs` — same stale Objective quote → same fix.
  3. `05_7 knowledge-directory-is-durable-layer` — pointer "Principle 6 — Subagents as Extractors" renamed; live = `### 6. Subagents as Extractors` (F2-family 2nd instance) → repoint to `6. Subagents as Extractors`.
  4. `05_7 drop-a-file-named-claude` — count "116 CLAUDE.md / 111 four-footer" stale; live `find .claude -name CLAUDE.md | wc -l` = **141**. Header quote (L3 "Status: Live — Feature #1 hooks shipped") still accurate → REDUCE the volatile count to stable phrasing (reduction standard: "stable useful content", not a fresh hardcoded 141 that re-drifts).
- ✅ **CLEAN:** `05_1 the-always-on-layer-is-active` — all 7 named hooks present in `settings.local.json` (context-sensor/context-gate/prompt-handler/job-guard/summary-guard/plugin-guard/question-discipline-gate). BORDERLINE (architect's call, not forcing): newer `brain_guard/heartbeat-sensor` PreToolUse hook not named — the tag is illustrative, not an exhaustive registry, so not counted stale.

## META-AUDIT (family-c, verify-meta-audit) — verification gaps to CLOSE before advance (DO NOT ADVANCE yet)

The audit correctly caught grep-only over-confidence: grep-at-zero proves the OLD string GONE, it does NOT evidence class 1 (new pointer exists) / 3 (not over-scoped) / 5 (describes current behavior). Gaps ranked:

1. **[HARD GATE] 05_9 own-eyes 1/3/5 still owed** — the last essay; architect mandate requires it before advance. Read 05_9, record 1/3/5 verdict.
2. **New-pointer existence NOT spot-checked for F1/F2/F3** — a repoint can pass grep-zero on the OLD string while the NEW target is broken. Grep live: F1 `CONTEXT_*_PCT` in `config.conf` + `%-of-window boundaries` in `brain-memory.md`; F2 `9. Five CONDENSE Markers` in `principles.md`; F3 file+function pointers still valid.
3. **Regen-validation not recorded** (PLAN risk-mit #1) — spot-check each regenerated `.html` non-empty + contains `<!DOCTYPE`.
4. **05_1 candidate completeness** — I verified the brain_guard-quoting tags; MANY other 05_1 tags quote plugin Objectives (plugin_integrity/job_core/interaction_summary/question_discipline). Spot-check those vs live plugins/CLAUDE.md + each plugin's Objective.
5. **F4 — audit says re-add the Refs column to the table; BUT the architect's OWN de-bloat (commit cabc5a7, 2026-07-15) REMOVED that column and moved the stale counts to `../../.claude/knowledge/b5-series-reference.md`.** The de-bloat is MORE RECENT than the PLAN-phase "fix the table" ruling, so re-adding the column would UNDO the architect's own edit. → NOT a unilateral fix: surface to architect as a done-checkpoint question (correct the stale counts in b5-series-reference.md via CONDENSE / re-add column / drop F4). Verify live counts first so whichever path has correct numbers.
6. **05_7 own-eyes ledger contradiction** — line ~197 ledger marks 05_7 "⬜ owed" but line ~140/203 records 05_7 own-eyes CLEAN (S-13). The ledger is stale → correct it to ✅ 05_7 (done S-13).

**Sequence:** close gaps 2/3/4 (VERIFY spot-checks) → gap 1 (05_9 own-eyes) → gap 6 (ledger fix) → VERIFY→EXECUTE backward to fix 4 stale F5 tags + any new hits, regen 05_1/05_7 `.html`, re-grep → gap 5 (F4 architect question) → done-[WAITING] to architect (architect calls done).

## GAP-CLOSURE PROGRESS (S-20 session)

**Gap 3 regen-validation — CLOSED ✅:** `grep -Li doctype` across 05_1/05_2/05_3/05_6/05_7 `.html` → empty (all 5 contain `<!DOCTYPE`, non-empty valid HTML).

**Gap 2 new-pointer existence — F1 (05_3) SOUND ✅ (class 1/3/5 own-eyes-verified, not grep-only):**
- Extracted the ACTUAL repointed F1 tags. Plan's "%-of-window boundaries" was PLAN SHORTHAND; the real anchors are correct and EXIST: `config.conf CONTEXT_SOFT_PCT=20/READ_PCT=25/CRITICAL_PCT=30` ✅ · `brain-memory.md "P cluster"` (line 452 `<!-- ===== P cluster: phasic compaction ... =====`) ✅ · `brain-memory.md "File-size ramp (θ_lc)"` (line 499) ✅ · `"Compaction file"` / `"Compaction-file sections"` / `"Finalization pass"` / `"Clear + inject"` / `"Two-tier chain / Prior Summary"` (all real P-cluster anchors).
- class-5: F1 summaries describe CURRENT %-of-window behavior accurately (Read 25% / critical 30% of MAX_CONTEXT_TOKENS, Bash-never-blocked, ACCRUAL_CRITICAL RETAINED as heartbeat/stop-gate knob). class-3: scoped, not over-claiming. **⇒ F1 is genuinely sound, not just grep-zero.**
- ✅ Remaining F1 anchors CONFIRMED: `context-gate.sh "GRADUATED HARD-GATE"` (line 3) + `context-sensor.sh "WHAT THIS HOOK DOES"` (line 7). **F1 fully sound (all anchors real, summaries current, not over-scoped).**

**Gap 2 new-pointer existence — F2 (05_7) ✅:** `principles.md` line 93 `### 9. Five CONDENSE Markers as Cross-Phase Signal System` exists exactly (F2 repoint target real).

**Gap 4 — 05_1 plugin-Objective quote completeness CLOSED ✅:** the `five-plugin-concern-roll` tag's four other-plugin Objective quotes all match live plugin CLAUDE.md verbatim — plugin_integrity ("No plugin can be silently broken…"), question_discipline ("Block any AskUserQuestion whose every question's text does not begin with a registered prefix"), interaction_summary ("Maintain a continuous summary chain…"), job_core ("Manage job lifecycle: create, status transitions…"). Table-quoting tags (`always-on-single-concern-claim`, `layers-composed-…`) also match the live Active Plugins table. Only **brain_guard's** Objective drifted → the 2 F5 tags already flagged; no NEW 05_1 staleness.

**Gap 2 — F3 (05_6) pointer validity + F2 (05_7) summary CLOSED ✅:**
- F3: 05_6 fixed tags carry clean file+function pointers, NO line numbers (`question-discipline-gate.sh (batch-cascade validation loop)`, `gmode-gate.sh ([WAITING] format guard)`, `question-capture.sh ([JOB-COMPLETE] per-prefix handler)`). Both referenced files EXIST: `job_core/hooks/question-capture.sh` (Pre-gate) + `question-capture-hook.sh` (Post-handler) — the documented two-file pattern, no broken pointer.
- F2: summary quote matches principles.md line 95 verbatim ("…record findings via five standardized markers in their respective phase-section footers…") → class-5 accurate.

**⇒ ALL THREE FAMILIES SOUND BEYOND GREP-ZERO: F1 ✅ F2 ✅ F3 ✅** (anchors real, summaries current, pointers valid, not over-scoped).

### F5 confirmed-stale fix list (EXECUTE, tags-only) — 5 tags across 05_1 + 05_7:
1. `05_1 chat-session-not-where-memory-lives` — strip/replace stale Objective clause "Currently enforces a context-aware self-compact loop" (fetch CURRENT brain_guard Objective text at fix time). Keep the accurate Status quote.
2. `05_1 long-before-the-model-runs` — same stale Objective clause.
3. `05_7 knowledge-directory-is-durable-layer` — pointer "Principle 6 — Subagents as Extractors" → `6. Subagents as Extractors`.
4. `05_7 drop-a-file-named-claude` — reduce volatile count "116 CLAUDE.md / 111 four-footer" (live 141) to stable phrasing.
5. `05_7 relationship-is-asymmetric-phasic-uses` — reduce "111 of 116 CLAUDE.md files … carry all four phase footers" to stable phrasing (SECOND count instance, found during F2 check).

**Gap 1 — 05_9 own-eyes 1/3/5 CLOSED ✅ (CLEAN):** full paragraph→tag read in main session.
- Class 1: every code/context claim tagged (¶19/34/36/38/44/46/48/75/77/79/87/89/91/93/95/101/103/109/111/117/119/121/123/125/131); opener/closer bridges (¶21-23, ¶133) correctly untagged → no missing tags.
- Class 3: tags well-scoped, no over-claim. Class 5: terms current (gmode, plugin_lock_approval top-level, [JOB-APPROVE-CREATION] CONDENSE-only / [JOB-APPROVE-PLUGIN] any-active-phase, PREFIX_REGISTRY, 2026-05-19 schema flatten). Trivial borderline: `layered-discipline…` says "plugin-code layer" vs live Fact-2 "plugin layer" — immaterial, not a defect.
- F3-clean too (05_9 tags use section/quote pointers, zero line-numbers).
- **05_9 surfaces NO new fixes** → fix list stays at the 5 F5 tags.

**⇒ VERIFY VERIFICATION COMPLETE.** All 9 essays own-eyed corpus-wide (05_1/05_2 S-6 · 05_3 S-9 · 05_4/05_5/05_8 batch-1 · 05_6 S-10 · 05_7 S-13 · 05_9 S-20). Families F1/F2/F3 sound beyond grep-zero; F5 = 5 confirmed-stale tags to fix.

**Remaining (EXECUTE + done):** VERIFY→EXECUTE backward → fix 5 F5 tags (05_1×2 Objective, 05_7×1 principle-rename, 05_7×2 count) tags-only + correct the ---Ex--- ledger (05_7 → ✅ done S-13) → regen 05_1+05_7 `.html` → forward VERIFY → re-grep F5 zero → gap-5 F4 architect question + done-[WAITING] (architect calls done).

## S-22 grep-at-zero RE-RUN (this session, post-clear) — CONFIRMED FAIL on committed `.html`; pure regen owed (md↔html desync, NOT a re-fix)

The S-21 F5 `.md` fixes are all in place but 05_1.html + 05_7.html were NEVER regenerated (exactly the OWED note at the S-21 block). Main-session grep on the committed `.html` (each stale string, correct phrasing) → STILL PRESENT in ref-tag `title=`:
- `05_1.html` **L138** `chat-session-not-where-memory-lives` + **L186** `long-before-the-model-runs` → `"context-aware self-compact loop"` (`.md` = fixed "finalize then clear-and-inject")
- `05_7.html` **L127** `drop-a-file-named-claude` + **L230** `relationship-is-asymmetric-phasic-uses` → `"116 CLAUDE.md"` counts (`.md` = fixed "many … nearly all")
- `05_7.html` **L222** `knowledge-directory-is-durable-layer` → `"Principle 6 — Subagents as Extractors"` (`.md` = fixed "6. Subagents as Extractors") — my first grep missed this (em-dash, not plain space)
- `05_7.html` **L216** `brain-index-catalogs-plugins` → `"Voice Architecture (C2 lessons)"` (`.md` = fixed "Voice Architecture") — first grep missed (parens)

`.md` confirmed fixed for all 4 → this is a md↔html regeneration gap, not stale `.md`. **NEXT (regen runs in VERIFY per the S-18 established pattern — EXECUTE blocks Bash for this job):** regen 05_1.html + 05_7.html → re-grep the 4 stale strings (correct phrasing) → 0 each → md↔html consistency spot-check → commit website → then F4 architect question + done-`[WAITING]` (architect calls done).

**D2 LESSON (reaffirmed):** the async ground-truth subagent reported "all-zero-and-consistent" by INFERRING from commit messages + `blog/b5/CLAUDE.md` prose instead of running grep; main-session grep REFUTED it. Never accept an inferred grep count — reproduce it. (`[AGENT-UPDATE]` candidate: grep-at-zero dispatch prompts must forbid doc/commit inference and require the literal grep command + integer output.)

## S-23 grep-at-zero PASS (architect ran the regen, Option 1) — F5 family VERIFIED on regenerated `.html`

Architect regenerated 05_1.html + 05_7.html from the fixed `.md` via `generate_blog_html.py --version 20260704` (content-only diff: 05_1 +2/-2, 05_7 +4/-4 = the 5 F5 fixes, no other churn; still uncommitted at grep time). grep-at-zero on the regenerated `.html` (correct phrasing — em-dash / parens forms my first grep missed):
- `05_1.html` `"context-aware self-compact loop"` → **0** (exit 1) ✅ · POSITIVE `"finalize then clear"` ×2 present (both `chat-session-not-where-memory-lives` L138 + `long-before-the-model-runs` L186 fixed)
- `05_7.html` `"116 CLAUDE.md"` → **0** ✅ · `"Principle 6"` → **0** ✅ · `"Voice Architecture (C2 lessons)"` → **0** ✅ · POSITIVE `"6. Subagents as Extractors"` present + `"Voice Architecture"` (no C2) present
- md↔html consistent by construction (regen from fixed `.md`).

**⇒ F5 family COMPLETE on the (working-tree) `.html`.** Full verified slate now grep-at-zero clean: F1 (05_3, 6 tags) ✅ · F2 (05_7, 1 tag) ✅ · F3 (05_1/05_2/05_6/05_7, 14 tags) ✅ · F5 (05_1 L136 + the 5 S-21/S-22 tags + the 6th Voice-Arch tag) ✅. NEXT: commit the regenerated `.html` (website repo) → F4 architect scope call → done-`[WAITING]` (architect calls done).

`[VOICE-UPDATE]`{verify-guard.bash-write (verify-guard.sh write-block regex) | The write-block regex matches a BARE `>` anywhere in the command, so read-only commands that merely redirect stderr (`find … 2>/dev/null`, `… 2>&1`) are FALSE-BLOCKED as "implementation work" in verify — the seed must strip all redirects to run a plain find/grep. Over-broad; `>` should match a FILE-redirect target, not fd-duplication/stderr-suppression. | direction: exclude fd-redirect forms (`[0-9]*>&[0-9]+`, `2>/dev/null`, `2>&1`) from the write-block `>` alternation (the segment-allow path already strips `[0-9]*>&[0-9]+` — mirror that in the `_wv_scan` write-block), OR steer the block voice to say "strip the `2>/dev/null` redirect; plain read-only find/grep is allowed."}

## S-25 grep-at-zero RE-CONFIRMED by own hand (this post-clear session) — full slate verified on the COMMITTED `.html`

Fresh session; heartbeat debt paid (10 metacog-reflect into the empty seq-33 file) before touching project state. Website tree **CLEAN**, HEAD **`73961e9`** → working tree == committed source-of-truth. **D2 own-hand grep** (no subagent inference, no `2>&1` redirects — the verify-guard bare-`>` false-block):

- **F1 `05_3`** — `grep -cE 'ACCRUAL_SOFT|ACCRUAL_READ_BLOCK|ACCRUAL-ANCHORED'` → **0** ✅ · guard `ACCRUAL_CRITICAL` = 1 (RETAINED as designed) ✅
- **F2 `05_7`** — `grep -cF 'Principle 9 — Five Markers'` → **0** ✅
- **F3** — ref-title extraction `grep -oE 'title="ref:[^"]*"'` then line-number hunt → **0** hits in all four; non-empty title counts **05_1=15 · 05_2=17 · 05_6=15 · 05_7=22** (real pass, not silent-empty) ✅
- **F5 `05_1`** — stale `'context-aware self-compact loop'` → **0**, `'sole reference'` → **0**; POSITIVE `'finalize then clear'` = **2** ✅
- **F5 `05_7`** — stale `'116 CLAUDE.md'` → **0**, `'Principle 6 —'` → **0**, `'Voice Architecture (C2 lessons)'` → **0**; POSITIVE `'6. Subagents as Extractors'` = **1** ✅

**⇒ VERIFY COMPLETE on the committed `.html`: F1 ✅ F2 ✅ F3 ✅ F5 ✅** — every stale string absent, every positive fix present, tree clean. Prior-session own-eyes 1/3/5 coverage of all 9 essays (05_1..05_9) stands.

### F4 ground-truth (own-hand live ref-marker counts) — D2 caught a stale "corrected" number

Live `grep -oE 'class="ref-marker"' | wc -l` per essay: **05_1=15 · 05_2=17 · 05_3=25 · 05_4=19 · 05_5=8 · 05_6=15 · 05_7=22 · 05_8=14 · 05_9=25** (05_4 cross-checked via `title="ref:` = 19 too).

⚠️ **KEY:** the "F4 corrected" count `05_4=18` carried in BOTH b5 CLAUDE.md L44 AND the F4 note (L76) is ITSELF STALE — live is **19** (likely the post-2026-05-19 B5.4 3-ref-tag cascade). The archival `b5-series-reference.md` Refs column is stale too (05_3=13, 05_4=12, 05_6=13, 05_7=20, 05_9=16) — and that file lives in the **website** repo's `.claude/knowledge/` (the `../../` from `blog/b5/` resolves to the website root, NOT the agent root; earlier doc-link confusion resolved).

**F4 = the SOLE remaining item, and it is an ARCHITECT SCOPE CALL** (a CONDENSE-phase working-memory edit if approved, not an essay-tag fix): stale counts sit in the archival table (already carries a "don't treat as authoritative" disclaimer from the architect's own de-bloat cabc5a7) + the b5 CLAUDE.md L44 inline mention (wrong 05_4=18). Options to offer: (a) correct all count refs to live values (05_3=25/05_4=**19**/05_6=15/05_7=22/05_9=25) in CONDENSE; (b) fix only the live b5 CLAUDE.md working-memory line, leave the archival table stale-but-disclaimed; (c) drop F4. **Next: hand off to architect via `[WAITING]` — the architect calls done, never the seed.**

### ✅ F4 ARCHITECT DECISION (Fable, verbatim answer): "Correct all count refs"

Architect chose option (a): **correct EVERY count reference to live values in CONDENSE** — both the live b5 CLAUDE.md line AND the archival table's disclaimer note. No table column re-added. **CONDENSE fix spec (exact):**
1. **b5 CLAUDE.md body L44** — `05_4=18` → `05_4=19` in the `Live .html ref-marker counts (...)` sentence.
2. **b5 CLAUDE.md ---Ob--- F4 note (L76)** — `05_4(12→18)` → `05_4(12→19)`.
3. **`hadi-nayebi.github.io/.claude/knowledge/b5-series-reference.md`** — Refs column + the L19 disclaimer's "live counts" list corrected to the FINAL live slate: 05_1=15, 05_2=17, 05_3=25, **05_4=19**, 05_5=8, 05_6=15, 05_7=22, 05_8=14, 05_9=25. (All three are memory forms — CONDENSE-legal; none are essay .html tags.)

`[KNOWLEDGE]`{ref-tag-review-lessons — F4/count-drift: even a doc's OWN stated "live count" goes stale. The "corrected" 05_4=18 was carried verbatim in TWO working-memory surfaces yet live `grep -o 'class="ref-marker"' | wc -l` = 19. LESSON: never trust a stated count in CLAUDE.md/knowledge as ground truth — re-grep the committed .html at fix time (D2 extended to "corrected" numbers). SECOND lesson (from the meta-audit): count ref-tags by OCCURRENCE (`grep -o | wc -l`), NOT by line (`grep -c`) — a line can carry 2 ref-markers (05_1 + 05_4 each have one), so `grep -c` undercounts. Route to `.claude/knowledge/ref-tag-review-lessons.md`.}

### META-AUDIT disposition (verify-meta-audit, final pre-advance check) — 2 findings, both resolved

The final `verify-meta-audit` independently grepped all 9 `.html` + read this footer. It CONFIRMED **F1/F2/F3/F5 grep-at-zero** by its own hand (agrees with S-25). Two findings, both now resolved:

- **[count discrepancy] RESOLVED as a counting-METHOD artifact, NOT an error.** Auditor reported `05_1=14` / `05_4=18` (its `grep -c` = LINE count) vs my S-25 `05_1=15` / `05_4=19` (`grep -o | wc -l` = OCCURRENCE count). Reconciled own-hand: 05_1 = **15 occ / 14 lines / exactly 1 line with 2 ref-markers**; 05_4 = **19 occ / 18 lines / exactly 1 double-marker line** (15=14+1, 19=18+1). A "Refs" count = number of ref-tags = OCCURRENCES → **my counts stand: 05_1=15, 05_4=19.** Other 7 essays agree both ways (no double-marker line). D2 both-directions: reconciliation, not trust, settled it.
- **[own-eyes ledger completeness] CLOSED.** 05_1 + 05_2 got genuine paragraph→tag own-eyes in **session-6** (recorded PLAN L117 + EXECUTE L150 "1/3/5 clean there") but weren't echoed in the consolidated ledger line. Adding for airtight coverage: **✅ 05_1 (S-6, 1/3/5 CLEAN) · ✅ 05_2 (S-6, 1/3/5 CLEAN)** — the corpus own-eyes ledger is now explicit for all 9 (05_1/05_2 S-6 · 05_3 S-9 · 05_4/05_5/05_8 batch-1 · 05_6 S-10 · 05_7 S-13 · 05_9 S-20).
- **[acceptance-criteria staleness]** the "VERIFY — acceptance criteria" F4 line still reads `05_4=18` — that literal is the stale number the CONDENSE F4-fix corrects to 19; not a verification gap.

**⇒ VERIFY IS COMPLETE.** All families grep-at-zero (own-hand, committed .html); all 9 essays own-eyed 1/3/5; F4 decided; meta-audit findings dispositioned with no real gap surviving. Forwarding verify→condense for: the F4 count-fix (spec above) + marked-note consumption ([VOICE-UPDATE]s, the 2 body-prose [PENDING-JOB]s, the [AGENT-UPDATE], this [KNOWLEDGE]) + session-archive + deflate + the `[JOB-COMPLETE]` architect done-call (exact name: **b5 ref-tag review**).
