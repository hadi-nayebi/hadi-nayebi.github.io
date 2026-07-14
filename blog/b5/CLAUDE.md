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

---Pl---

---Ex---

---Ve---
