# CLAUDE.md — Blog 5 Mini-Series (Always-On Digital Cortex)
**Version:** v1.2.0
**Series:** B5 — Pt 1 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture
**Audience:** Power Users & Architects (Tier 2 → Tier 3)
**Last updated:** 2026-07-16 (ref-tag review CLOSED — architect Fable called done; the job's OPEVC working-memory footers were deflated into the session-log archive. De-bloat 2026-07-15: series reference + banked decisions + session narration extracted to `../../.claude/knowledge/b5-series-reference.md`, `b5-ref-tag-review-session-log.md`, `ref-tag-review-lessons.md`.) Series status: 9/9 GOAL ACHIEVED (2026-05-19); B5.9 re-audit pending.

## Purpose

B5 series working memory. Everything specific to the 9 sub-essays of *The Always-On Digital Cortex* lives here. Parent context: `../CLAUDE.md` (website-wide working memory) + `../../CLAUDE.md` (agent-side root). This file is the **series compartment**.

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

Per-essay read-time / image / GOAL-provenance detail + the Refs column + asset tree + banked series decisions → `../../.claude/knowledge/b5-series-reference.md`. Live `.html` ref-marker counts (05_1=15, 05_2=17, 05_3=25, 05_4=19, 05_5=8, 05_6=15, 05_7=22, 05_8=14, 05_9=25) — corrected 2026-07-16 by the ref-tag-review F4 fix (architect Fable ruled: correct all count refs). Audio: zero MP3s yet; audio gen is USER-GATED (Rule 12 paid TTS spend + 2026-05-18 "only if text is absolute-final") — triple-verify every transcript before any audio API call.

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

## Ref-tag review — CLOSED (2026-07-16, architect Fable called done)

Stage-1 tags-only ref-tag review-and-fix pass over all 9 b5 essays. Every drift family verified **grep-at-zero clean on the committed `.html`**; all 9 essays own-eyed against the full 5-class taxonomy (1 MISSING · 2 WRONG · 3 TOO-MUCH over-scope · 4 OUT-OF-SYNC-vs-CODE · 5 OUT-OF-SYNC-vs-context). Family count is an OUTPUT of coverage, never a target.

- **F1** accrual→%-of-window — `05_3`, 6 tags (class 2+4)
- **F2** "Principle 9 — Five Markers" section rename — `05_7`, 1 tag (class 4)
- **F3** line-numbers-in-pointers (Rule-20 ban) — `05_1`/`05_2`/`05_6`/`05_7`, 14 tags (class 4)
- **F5** stale-quoted-summary — `05_1` + `05_7` (class 2)
- **F4** ref-marker COUNTS corrected to the live slate (above) in this file + `b5-series-reference.md` (architect ruled "correct all count refs")

**Follow-up jobs (pending):** `1784185778987757548` b5 body-prose drift rewrite (05_3 accrual + 05_7 stale count — tags-only deliberately left the essay BODIES stale) · `1784185780384326117` b6/b7/b8 ref-tag review (corpus follow-up) · `1784185778063684459` b5-review substrate gate-gap fixes (7 plugin-code voice/agent gaps, gmode).

**Records:** taxonomy + family heuristic + count-drift lessons → `../../.claude/knowledge/ref-tag-review-lessons.md`; full cycle narrative + per-family verification → the agent-repo session-log archive at `.claude/jobs/1784072334731259334/run-1/session-log-1.md`.

---Ob---

---Pl---

---Ex---

---Ve---
