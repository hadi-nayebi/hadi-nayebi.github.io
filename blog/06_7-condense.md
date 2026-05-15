---
title: "CONDENSE: The Cognitive Organ"
date: "May 2026"
slug: "condense"
read_time: "11 min"
tags: [Architecture, Seed Agent, OPEVC, CONDENSE]
status: draft
version: v0.1.0
audience: "Tier 2 to Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# CONDENSE: The Cognitive Organ

*Essay 6.7 of 10 &mdash; The Markov Phasic Brain.*

---

[Essay 6.6](06_6-verify.html) closed the audit chamber. VERIFY ran the scripts, flagged what was wrong, sent the agent back if it had to, and committed the cycle's verdict. Four phases of work-on-the-project are now behind us. What is left is the cycle's metabolism &mdash; the step where the cycle's experiential data gets turned into durable memory.

This is CONDENSE. It is not a fifth work-on-the-project phase. It is a different kind of phase entirely.

For the architects in the audience.

---

## The phase that acts on the brain

CONDENSE plays a different role from the four work-on-project phases. Where they act on artifacts, CONDENSE acts on the brain itself &mdash; the cycle's metabolism organ, turning the experiential data from the previous four phases into durable memory.

The other phases produce work *on the project*. CONDENSE produces work *on the brain*. Its write scope is `.claude/` plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced &mdash; the gathered context, the plan document, the execution notes, the verification results &mdash; and route the durable parts to where they will be useful in the next cycle. *[ref: condense-is-consolidation-break | phase_condense/docs/principles.md "What Condense Is" section | CONDENSE is defined as a "consolidation break" between successful chunks of work — not sleep, not routing, but active content movement that takes the altered CLAUDE.md list (frozen at entry) and moves bottom-section words to durable destinations.]*

That routing is structured as a **strict ordered waterfall** (currently seven steps in the prototype; extensible per the Stage-3 Distributed Job Extension pattern). The order matters; each step's output feeds the next. *[ref: condense-7-step-waterfall-strict-ordered | phase_condense/docs/principles.md "Principle 8 — 7-Step Waterfall as Processing Order" section | CONDENSE Principle 8: a strict ordered sequence of 7 steps — footer-to-body, cross-file migration, pending jobs, voice updates, agent updates, knowledge routing, session archive fallback. Processing order is deterministic.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard cascade — the CONDENSE seven-step waterfall.
  Style: Match opevc-cycle-blackboard.png. Dark slate chalkboard; hand-drawn chalk tiles and arrow streams;
  pastel chalk for the tile borders (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for step numbers, labels, and arrows; chalk sticks resting along the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, step titles, or labels.
  Layout: Seven chalk tiles stacked vertically down the center of the board, each labeled IN WHITE CHALK with its number and short name (lowercase, EXACTLY as written below — do NOT invent new terms):
    Tile 1 (cyan border): "1. footer to body"
    Tile 2 (green border): "2. cross-file move"
    Tile 3 (orange border): "3. pending job"
    Tile 4 (pink border): "4. voice update"
    Tile 5 (magenta border): "5. agent update"
    Tile 6 (cyan border): "6. knowledge"
    Tile 7 (dim white border): "7. session archive" — drawn smaller, fainter, slightly off-axis to mark it as last-resort
  Short white-chalk arrows feed each tile into the next (1→2→3→4→5→6→7).
  Below all seven tiles, a horizontal chalk bar drawn across the board's width, labeled IN WHITE CHALK exactly "deflation gate", with one chalk exit arrow attempting to pass through it.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "1. footer to body", "2. cross-file move", "3. pending job", "4. voice update", "5. agent update", "6. knowledge", "7. session archive", "deflation gate", plus the caption below. No other words, file names, folders, or step descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.7.1. Each step's output feeds the next. Step 7 is the fallback, not a peer."
-->

## The waterfall, step by step

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the four phase markers from [Essay 5.7](05_7-claude-md-hierarchy.html). The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step &mdash; a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this step alone, the bulk of the cycle's noise gone in one absorption pass. *[ref: condense-step-1-footer-to-body-graduated | phase_condense/docs/decisions.md "D20: Step 1 Enforcement — Graduated (Voice → Measure → Harden)" section | Decision D20: CONDENSE Step 1 (footer-to-body absorption) enforced via graduated discipline — entry voice teaches "absorb footer-to-body first," a body-vs-footer tracker metric measures success, hard gate added only if data warrants.]*

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away. *[ref: condense-claude-md-mover-cross-file | phase_condense/agents/condense-claude-md-mover.md agent definition header + intro | Step 2 dispatches condense-claude-md-mover: a Read/Edit/Write subagent that moves CLAUDE.md content sideways or upward to the destination most natural for the subject — rejects duplicates rather than adding noise.]*

3. **Pending-job markers.** During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker. *[ref: condense-job-creator-pending | phase_condense/agents/condense-job-creator.md agent definition header + intro | Step 3 dispatches condense-job-creator: converts action items and improvement ideas from CLAUDE.md bottom sections into pending jobs via job.sh create; checks for overlap before creating.]*

4. **Voice-update markers.** A phase may have noticed that a coaching voice &mdash; the soft, LLM-interpreted guidance one of the plugins issues &mdash; is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker. *[ref: condense-voice-updater-step-four | phase_condense/agents/condense-voice-updater.md agent definition header + intro | Step 4 dispatches condense-voice-updater: finds the right plugin's voice.xml, identifies the relevant voice element, and updates its text to capture the lesson — the agent's soft memory layer gets refreshed.]*

5. **Agent-update markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker. *[ref: condense-agent-updater-step-five | phase_condense/agents/condense-agent-updater.md agent definition header + intro | Step 5 dispatches condense-agent-updater: consumes [AGENT-UPDATE] markers from phase footers and edits the named subagent's .md file — the behavioral contract that future cycles inherit.]*

6. **Knowledge markers.** This is the most important step. A phase may have written a knowledge marker into a footer &mdash; backticks and brackets deliberate, so the marker has a unique grep signature &mdash; to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line. *[ref: condense-knowledge-extractor-step-six | phase_condense/agents/condense-knowledge-extractor.md agent definition header + intro | Step 6 dispatches condense-knowledge-extractor: extracts CLAUDE.md bottom-section content into .claude/knowledge/<topic>/ files; evaluates each chunk before writing and rejects duplicates or contradictions rather than creating noise.]*

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed &mdash; the subagent has to see its own work on disk before it can call the marker consumed. *[ref: extractor-must-read-its-own-write | phase_condense/agents/condense-knowledge-extractor.md "M3. evidence-bind" + "M4. self-consistency" modes | The extractor must Read the file it just Wrote and confirm byte count + section headings before reporting success; reports without verified_via_read: true are treated as provisional by the main session.]*

   CONDENSE carries its own write permission for `.md` files anywhere inside `.claude/`, including knowledge directories the earlier phases never touched &mdash; it is the only phase allowed to create durable knowledge files outside the altered list, precisely because routing into a fresh knowledge subtree is its job. This is how the brain *grows* &mdash; cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it. *[ref: condense-only-creates-outside-altered-list | phase_condense/hooks/condense-guard.sh `_validate_new_claude_md_anchors` comment block | Comment block declares CONDENSE the only phase allowed to create top-level CLAUDE.md files outside the altered list — necessary because CONDENSE routes knowledge into knowledge/ directories that may not have been touched by execute.]*

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a per-job session archive file under `.claude/knowledge/session/`. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy. *[ref: condense-init-coaches-session-last-resort | phase_condense/docs/architecture-pattern.md "condense-sensor.sh — Entry Detection" section, At init step 6 | CONDENSE init emits the 7-step waterfall entry voice that names each step and coaches the session-last-resort principle — Step 7 archives are the fallback for content that didn't land in earlier steps.]*

## The deflation gate

After all seven steps, CONDENSE checks a *deflation gate*. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list &mdash; everything below the first phase marker &mdash; and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against a stage-aware threshold. *[ref: condense-deflation-gate-at-commit | phase_condense/scripts/condense-commit.sh `--force` deflation-gate enforcement block | At commit time CONDENSE re-measures footer word counts, computes words_absorbed = total_baseline − current_total, and blocks with exit 1 if current_total exceeds max_remaining (the stage-aware threshold).]*

Single-cycle jobs default to eighty percent absorption. The cycle is final; working memory must compress hard before the agent returns to idle. *[ref: stage-aware-deflation-rationale | phase_condense/scripts/condense-commit.sh `--force` stage-aware-targets comment block (above the `stage=$(...)` query) | Stage-aware deflation rationale: single-cycle jobs (plan_file=false) must hit 80 percent because working memory is final; multi-cycle jobs (plan_file=name) stop at 50 percent to preserve plan-handoff context across cycles.]*

Multi-cycle jobs default to fifty percent. Some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are tunable, and real cycles routinely overshoot &mdash; single-cycle jobs in the prototype have driven the deflation well past the eighty-percent target when the cycle had less to keep than the threshold assumed. *[ref: stage-aware-threshold-branching | phase_condense/scripts/condense-commit.sh `--force` Stage-1/Stage-2 branch (`if [[ "$stage" == "2" ]]`) setting `words_to_absorb` | The branch queries job_core's stage subcommand; Stage 2 (multi-cycle) sets words_to_absorb to 50% of baseline via CONDENSE_DEF_THRESHOLD_STAGE2, Stage 1 defaults to 80% via CONDENSE_DEF_THRESHOLD_STAGE1 — both env-tunable.]*

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more &mdash; because CONDENSE is *lock-forward only*. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense. *[ref: condense-lock-forward-principle-1 | phase_condense/docs/principles.md "Principle 1 — Lock-Forward Only" section | Principle 1 — Lock-Forward Only: Condense has NO backward transitions; the only exit is forward to idle via condense-commit.sh --force. Backward would create partial condensation; fixes belong in the NEXT cycle.]*

## The only phase that edits the brain

CONDENSE is also the only phase that is allowed to edit the brain itself &mdash; the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices, the subagent definitions, the durable knowledge files. Everywhere else, those edits are protected. When an earlier phase notices a voice should change, an agent definition should tighten, or a finding should be promoted to long-term memory, it does not edit; it writes a marker in its footer. The marker stays unconsumed until CONDENSE arrives and routes it. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified. *[ref: execute-blocks-root-brain-condense-only | phase_execute/hooks/execute-guard.sh `block "root-brain-blocked" "brain_protected"` call (claude_rel == CLAUDE.md branch) + the `brain-protection\|root-brain-blocked` case in the block-message switch | EXECUTE blocks edits to root CLAUDE.md and .claude/CLAUDE.md: the guard's claude_rel branch fires `block "root-brain-blocked" "brain_protected"` when the target is root CLAUDE.md or .claude/CLAUDE.md, and the matching message text reads `[phase_execute] BLOCKED: Brain updates belong in condense.` The brain-protection/root-brain-blocked pair repeats across every phase guard, leaving CONDENSE alone able to touch the brain.]*

The cycle then returns to idle. The cycle counter does not advance on this edge &mdash; CONDENSE's exit only closes the books. The bump fires on the next `idle to observe`, when the user's next prompt drives the agent to call `phase.sh advance` and the orchestrator increments `cycle += 1` as it opens the new compartment. The new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed. *[ref: cycle-bump-on-idle-to-observe | phasic_system/scripts/phase.sh `advance` subcommand, `idle → observe` branch (the jq update with `.cycle += 1`) vs the `condense → idle` branch (info-cycle-complete print) | The idle → observe branch is the only site that mutates the cycle field; the jq update sets current_phase and increments cycle in one atomic write. The condense → idle branch prints "Cycle N complete" but does NOT touch the counter — the closing edge announces; the opening edge increments.]*

That is the cognitive organ. Four work-on-project phases produce experiential data; CONDENSE turns that data into durable memory. The brain that the next cycle's OBSERVE recalls is the brain CONDENSE just shaped. Without this step the cycle would still complete the work, but the seed agent would learn nothing from doing it.

The phases give the agent compartmentalized cognition. CONDENSE is the step that lets the compartmentalization compound.

But the phases share one more mechanism we have not named yet &mdash; the small dial each one turns at its entry. That dial is where the cycle's discipline and the agent's meta-cognition meet.

Next.

---

*Essay 6.7 of 10 &mdash; The Markov Phasic Brain &mdash; Hadosh Academy series on agent architecture.*

*Previous: [Essay 6.6 &mdash; VERIFY: Independent Eyes](06_6-verify.html) &mdash; the audit chamber, the script-and-auditor rule, the multi-backward fan-out.*
*Next: [Essay 6.8 &mdash; The Backward Multiplier](06_8-backward-multiplier.html) &mdash; the per-phase dial, the point system, and the smaller-number-bigger-phase punch.*










