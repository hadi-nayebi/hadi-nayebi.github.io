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
| `06_6-verify` | VERIFY — Independent Eyes | 9 min | — | corrected v0.3.0 |
| `06_7-condense` | CONDENSE — The Cognitive Organ | 11 min | 32 | published (+dependency-removal lifecycle 2026-06-19) |
| `06_7b-condense-uniquely-owns` | CONDENSE — What It Uniquely Owns | 6 min | 20 | new (split off 06_7) |
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

- **Build:** `python3 tools/generate_blog_html.py blog/b6/<slug>.md blog/b6/<slug>.html --version 20260518` — the generator's `SLUG_SUBDIR_PREFIXES` map includes `"06_": "b6"`; it autodetects subdir from the output path and switches to depth-aware mode (`../../` site-nav, subdir canonical URL, subdir `audio/` path).
- **Transcript:** `python3 tools/generate_blog_transcript.py blog/b6/<slug>.md blog/b6/<slug>.transcript.md` (always resets `final: false`).
- **Audio:** `python3 tools/generate_blog_audio.py blog/b6/<slug>.transcript.md blog/b6/audio/<slug>.mp3` (refuses unless `final: true`; ~$0.75/essay on tts-1-hd; USER-GATED).

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

**Ref-tag sync job `1784255953475439806` (Stage-1) active — this dir is in EXECUTE scope.** Corpus hub: `../CLAUDE.md` `---Ob---`. Prior B6 line-number sweep state (INACTIVE) + banked findings: `../../.claude/knowledge/b6-reftag-sweep-job-state.md`. Series-specific ref-tag findings recorded here as the scan lands.

**SCAN FINDING — `06_10` (plan-state-machine) reads CLEAN** (main-session read 2026-07-16): current vocabulary (no `seal`/`Form 1/2/3`); all ~14 ref-tags use section-name pointers (R4-clean, no line numbers); tags cite `.claude/context/job-stages-plans.md` + `job-completion-reactivation.md` + `opevc-phases.md` + `brain-memory.md` + `job-system.md` by section; prose even self-corrects the old `.yaml`-as-dependent-job model. Implies b6's Stage/plan essays were recently swept → **LOW drift here**. Redirect the top-5 hunt toward **b8/`08_3`** (pre-identified IRR-4/IRR-5), **b7 plugin test-counts/versions**, and any un-swept essays. STILL TODO (scanner R2/R3): confirm those cited context section-names actually resolve.

---Pl---

---Ex---

---Ve---
