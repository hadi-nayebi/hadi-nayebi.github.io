---
title: "CONDENSE — The Cognitive Organ"
date: "May 2026"
slug: "condense"
read_time: "11 min"
tags: [Architecture, Seed Agent, OPEVC, CONDENSE]
status: draft
version: v0.2.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# CONDENSE — The Cognitive Organ

*Essay 6.7 &mdash; The Markov Phasic Brain, Part 7 of 10.*

---

[Essay 6.6](06_6-verify.html) closed the audit chamber. VERIFY ran the scripts, flagged what was wrong, sent the agent back if it had to, and committed the cycle's verdict. Four phases of work-on-the-project are now behind us. What is left is the cycle's metabolism &mdash; the step where the cycle's experiential data gets turned into durable memory.

This is CONDENSE. It is not a fifth work-on-the-project phase. It is a different kind of phase entirely.

This sub-essay is for you — especially when you find yourself thinking about how the brain ends up shaped after dozens of cycles.

---

## The phase that acts on the brain

CONDENSE plays a different role from the four work-on-project phases. Where they act on artifacts, CONDENSE acts on the brain itself &mdash; the cycle's metabolism organ, turning the experiential data from the previous four phases into durable memory.

The other phases produce work *on the project*. CONDENSE produces work *on the brain*. Its write scope is `.claude/` plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced &mdash; the gathered context, the plan document, the execution notes, the verification results &mdash; and route the durable parts to where they will be useful in the next cycle. *[ref: condense-is-consolidation-break | .claude/plugins/phase_condense/docs/principles.md "What Condense Is" section | CONDENSE is defined as a "consolidation break" between successful chunks of work — not sleep, not routing, but active content movement that takes the altered CLAUDE.md list (frozen at entry) and moves bottom-section words to durable destinations.]*

That routing is structured as a **strict ordered waterfall** (currently seven steps in the prototype; extensible per the Stage-3 Distributed Job Extension pattern). The order matters; each step's output feeds the next. *[ref: condense-7-step-waterfall-strict-ordered | .claude/plugins/phase_condense/docs/principles.md Core Principles section → 8. 7-Step Waterfall as Processing Order subsection | CONDENSE Principle 8: a strict ordered sequence of 7 steps — footer-to-body, cross-file migration, pending jobs, voice updates, agent updates, knowledge routing, session archive fallback. Processing order is deterministic.]*

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

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the cycle's phase markers (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) from [Essay 5.7](05_7-claude-md-hierarchy.html). The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step &mdash; a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this step alone, the bulk of the cycle's noise gone in one absorption pass. *[ref: condense-step-1-footer-to-body-graduated | .claude/plugins/phase_condense/docs/decisions.md "D20: Step 1 Enforcement — Graduated (Voice → Measure → Harden)" section | Decision D20: CONDENSE Step 1 (footer-to-body absorption) enforced via graduated discipline — entry voice teaches "absorb footer-to-body first," a body-vs-footer tracker metric measures success, hard gate added only if data warrants.]*

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away. *[ref: condense-claude-md-mover-cross-file | .claude/plugins/phase_condense/agents/condense-claude-md-mover.md agent definition header + intro | Step 2 dispatches condense-claude-md-mover: a Read/Edit/Write subagent that moves CLAUDE.md content sideways or upward to the destination most natural for the subject — rejects duplicates rather than adding noise.]*

3. **Pending-job markers.** During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker. *[ref: condense-job-creator-pending | .claude/plugins/phase_condense/agents/condense-job-creator.md agent definition header + intro | Step 3 dispatches condense-job-creator: converts action items and improvement ideas from CLAUDE.md bottom sections into pending jobs via job.sh create; checks for overlap before creating.]*

4. **Voice-update markers.** A phase may have noticed that a coaching voice &mdash; the soft, LLM-interpreted guidance one of the plugins issues &mdash; is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker. *[ref: condense-voice-updater-step-four | .claude/plugins/phase_condense/agents/condense-voice-updater.md agent definition header + intro | Step 4 dispatches condense-voice-updater: finds the right plugin's voice.xml, identifies the relevant voice element, and updates its text to capture the lesson — the agent's soft memory layer gets refreshed.]*

5. **Agent-update markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker. *[ref: condense-agent-updater-step-five | .claude/plugins/phase_condense/agents/condense-agent-updater.md agent definition header + intro | Step 5 dispatches condense-agent-updater: consumes [AGENT-UPDATE] markers from phase footers and edits the named subagent's .md file — the behavioral contract that future cycles inherit.]*

6. **Knowledge markers.** This is the most important step. A phase may have written a knowledge marker into a footer &mdash; backticks and brackets deliberate, so the marker has a unique grep signature &mdash; to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line. *[ref: condense-knowledge-extractor-step-six | .claude/plugins/phase_condense/agents/condense-knowledge-extractor.md agent definition header + intro | Step 6 dispatches condense-knowledge-extractor: extracts CLAUDE.md bottom-section content into .claude/knowledge/<topic>/ files; evaluates each chunk before writing and rejects duplicates or contradictions rather than creating noise.]*

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed &mdash; the subagent has to see its own work on disk before it can call the marker consumed. *[ref: extractor-must-read-its-own-write | .claude/plugins/phase_condense/agents/condense-knowledge-extractor.md "M3. evidence-bind (per-file post-Write Read verification)" + "M4. self-consistency (read-own-work verification)" modes | The extractor must Read the file it just Wrote and confirm byte count + section headings before reporting success; reports without verified_via_read: true are treated as provisional by the main session.]*

   CONDENSE carries its own write permission for `.md` files anywhere inside `.claude/`, including knowledge directories the earlier phases never touched &mdash; it is the only phase allowed to create durable knowledge files outside the altered list, precisely because routing into a fresh knowledge subtree is its job. This is how the brain *grows* &mdash; cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it. *[ref: condense-only-creates-outside-altered-list | .claude/plugins/phase_condense/hooks/condense-guard.sh `_validate_new_claude_md_anchors` comment block | Comment block declares CONDENSE the only phase allowed to create top-level CLAUDE.md files outside the altered list — necessary because CONDENSE routes knowledge into knowledge/ directories that may not have been touched by execute.]*

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a per-job session archive file under `.claude/knowledge/session/`. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy. *[ref: condense-init-coaches-session-last-resort | .claude/plugins/phase_condense/docs/architecture-pattern.md "condense-sensor.sh — Entry Detection" section, At init step 6 | CONDENSE init emits the 7-step waterfall entry voice that names each step and coaches the session-last-resort principle — Step 7 archives are the fallback for content that didn't land in earlier steps.]*

## The deflation gate

After the waterfall's steps, CONDENSE checks a *deflation gate*. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list &mdash; everything below the first phase marker &mdash; and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against a stage-aware threshold. *[ref: condense-deflation-gate-at-commit | .claude/plugins/phase_condense/scripts/condense-commit.sh `--force` deflation-gate enforcement block | At commit time CONDENSE re-measures footer word counts, computes words_absorbed = total_baseline − current_total, and blocks with exit 1 if current_total exceeds max_remaining (the stage-aware threshold).]*

Single-cycle jobs default to eighty percent absorption. The cycle is final; working memory must compress hard before the agent returns to idle. *[ref: stage-aware-deflation-rationale | .claude/plugins/phase_condense/scripts/condense-commit.sh `--force` stage-aware-targets comment block (above the `stage=$(...)` query) | Stage-aware deflation rationale: single-cycle jobs (plan_file=false) must hit 80 percent because working memory is final; multi-cycle jobs (plan_file=name) stop at 50 percent to preserve plan-handoff context across cycles.]*

Multi-cycle jobs default to fifty percent. Some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are tunable, and real cycles routinely overshoot &mdash; single-cycle jobs in the prototype have driven the deflation well past the eighty-percent target when the cycle had less to keep than the threshold assumed. *[ref: stage-aware-threshold-branching | .claude/plugins/phase_condense/scripts/condense-commit.sh `--force` Stage-1/Stage-2 branch (`if [[ "$stage" == "2" ]]`) setting `words_to_absorb` | The branch queries job_core's stage subcommand; Stage 2 (multi-cycle) sets words_to_absorb to 50% of baseline via CONDENSE_DEF_THRESHOLD_STAGE2, Stage 1 defaults to 80% via CONDENSE_DEF_THRESHOLD_STAGE1 — both env-tunable.]*

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more &mdash; because CONDENSE is *lock-forward only*. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense. *[ref: condense-lock-forward-principle-1 | .claude/plugins/phase_condense/docs/principles.md Core Principles section → 1. Lock-Forward Only subsection | Principle 1 — Lock-Forward Only: Condense has NO backward transitions; the only exit is forward to idle via condense-commit.sh --force. Backward would create partial condensation; fixes belong in the NEXT cycle.]*

## Fix-in-cycle, and other phases' job markers

CONDENSE is lock-forward only on its *own* transitions. The cycle as a whole has one more escape hatch &mdash; a backward route to EXECUTE that fires before the waterfall even reaches step 4.

The mechanism is a scope-overlap check inside step 3. When CONDENSE consumes a `[PENDING-JOB]` marker, it does not blindly create the dependent job. It first compares the proposed job's altered list against the *current* cycle's altered list. If the two overlap &mdash; meaning the follow-up work would touch files the cycle just edited &mdash; the job creation is blocked and CONDENSE routes the agent backward to EXECUTE. The voice is direct: *fix your own bugs before closing the cycle*. A follow-up job that touches this cycle's files is not follow-up &mdash; it is unfinished work the agent tried to defer. *[ref: condense-fix-in-cycle-overlap-gate | .claude/plugins/phase_condense/hooks/condense-guard.sh `_is_in_scope_job` helper + its surrounding block | The helper compares the candidate job's altered list against the focused cycle's altered list; an overlap triggers a structured block with backward routing to EXECUTE. The gate makes the "fix it now or carry the bug to the next cycle" choice into a forced structural fork rather than an editorial decision.]*

Step 3 also lands the second deep principle of the cycle's job graph. CONDENSE is the *only* phase allowed to mutate the job graph in the additive direction &mdash; `create`, `create-dependent`, `add-dependency` all live behind a CONDENSE-only guard. The other phases drop `[PENDING-JOB]` markers into their footers as they go; the markers sit unconsumed until CONDENSE arrives, walks them in step 3, and routes them through the overlap check. The phases that need a job created never call the job-creation script themselves; they declare intent in a marker. *[ref: condense-owns-additive-job-mutations | .claude/plugins/phase_condense/hooks/condense-guard.sh CONDENSE job-creation allowlist block | The CONDENSE guard's allowlist admits `create`, `create-dependent`, and `add-dependency` for condense-job-creator + main-session-in-condense; the same operations are explicitly blocked from every other phase's guard. Lifecycle-symmetry: the additive operations are CONDENSE's; the symmetric removal operation is elsewhere.]*

The "graph" here is concrete. A *dependency* is a directed edge `job-A → job-B` stored as a list of dependent-job IDs in the parent job's `completion_requirements.depends_on` array on the job object. `add-dependency <focused> <dep>` appends an ID; `remove-dependency` filters it out; the completion gate refuses to mark a job `completed` while any ID in its `depends_on` is still in `pending` or `active`. The graph is required to be acyclic &mdash; a job cannot depend, transitively, on a job that depends on it &mdash; because cycles would deadlock the completion gate forever. CONDENSE adds edges with cycle-wide context; VERIFY removes them with audit-time context. *[ref: depends-on-list-on-job-object | .claude/plugins/job_core/scripts/job.sh:177 + :208 + :350-356 | New jobs are seeded with `completion_requirements:{depends_on:[]}` (line 177); `add-dependency` appends the dep ID via `(.jobs[] | select(.id==$fid)).completion_requirements.depends_on += [$did]` (line 208); the completion gate enumerates depends_on and refuses if any dep is not in status `completed` (lines 350-356).]*

VERIFY owns the symmetric move on the other end &mdash; `remove-dependency`. Where CONDENSE has cycle-wide context to decide what new work needs creating, VERIFY has audit-time context to discover that a declared dependency turned out unnecessary. Adding and removing are split across the two phases by which one has the right perspective to make the call. The pattern repeats across the architecture: where one phase ADDS, a different phase OWNS the REMOVAL, and the split tracks which phase has the context to judge. *[ref: verify-owns-remove-dependency | .claude/plugins/phase_verify/hooks/verify-guard.sh `remove-dependency` allowlist + explicit BLOCK on create/create-dependent/add-dependency | VERIFY's guard admits `remove-dependency` and explicitly blocks the three additive operations before its broad scripts/* regex (which used to be an escape vector). Lifecycle-symmetry locked: ADD/REMOVE different owners by design.]*

## A worked example

Pick up the multi-cycle plan-job from the previous four sub-essays. VERIFY rolled the cycle backward to PLAN; PLAN re-authored the sharpened acceptance criteria; EXECUTE landed the backward-compat work alongside the marker schema work; VERIFY ran the audit family again and this time the criteria all passed. The orchestrator advances the job to CONDENSE.

The agent enters CONDENSE. The multiplier sentinel is unset; every tool is locked. The agent forecasts a moderately deep phase &mdash; the cycle produced a lot of footer noise and at least one knowledge-worthy finding &mdash; picks 1.0 on the multiplier. The lock lifts. The condense-sensor snapshots the bottom-section word counts of every CLAUDE.md the cycle touched and stores the baseline.

**Step 1 fires first.** The agent walks the frozen altered-list snapshot. The working CLAUDE.md's footers carry several hundred words of phase notes &mdash; the OBSERVE synthesis on the marker-schema contradiction, PLAN's acceptance-criteria decisions, EXECUTE's checkpoint observations, VERIFY's auditor findings on backward-compatibility. The agent absorbs the durable findings up into the body, drops the ephemeral checkpoint chatter, and leaves the footers stripped to their markers. The sibling CLAUDE.md files take the same treatment.

**Step 2 fires next.** The condense-claude-md-mover subagent walks the cycle's findings. One paragraph &mdash; a lesson about how the marker schema interacts with cycle 2's git history &mdash; belongs better in the phase_condense plugin's CLAUDE.md than in the focused working file. The mover routes it sideways; the source paragraph is deleted, the destination receives a deduplicated addition.

**Step 3 fires now &mdash; the marker-consumption block.** The cycle's footers carry a small set of live markers. A `[PENDING-JOB]` declares a follow-up sibling job: "audit other plugins for similar marker-schema drift." A `[KNOWLEDGE] marker-schema-versioning` declares a finding worth promoting to long-term memory. A `[VOICE-UPDATE]` declares that the OBSERVE entry voice should mention marker-schema audits as a research target. The condense-job-creator runs the overlap check on the pending job &mdash; it touches *other* plugins' files, not this cycle's altered list &mdash; the overlap is clean, the job is created, the marker is removed. The condense-voice-updater finds the OBSERVE entry voice in the right `voice.xml` and tightens its text. The condense-knowledge-extractor reads the surrounding paragraph, writes a new file at `.claude/knowledge/opevc/marker-schema-versioning.md`, re-reads its own write to confirm the bytes landed, and only then replaces the source marker with a strikethrough audit line.

**Steps 4, 5, and 7** are quiet. No `[VOICE-UPDATE]` markers remain after step 4 consumed the one above; no `[AGENT-UPDATE]` markers fired in this cycle; step 7's session archive picks up two short paragraphs of cycle-narrative that did not fit any earlier step.

The deflation gate runs. The baseline footer-word count was 1,820; after the waterfall the remaining footer-word count is 312 &mdash; an 83 percent reduction. Single-cycle threshold is 80 percent; this is a multi-cycle job and the threshold is 50; the cycle passes both. The orchestrator commits the cycle and advances the job to idle. The next OBSERVE will open with the freshly-tightened voice, the new knowledge file in the recall path, and the new sibling job waiting in the queue.

The cycle's experiential data is now durable memory. The brain just learned.

## What you would customize

CONDENSE is the phase with the most opinionated default behaviors and, perhaps because of that, the richest customization surface for any architect who wants to bend the brain's metabolism to their own work.

The architect would extend the *waterfall itself*. The prototype ships seven steps in a strict order; the Stage-3 Distributed Job Extension pattern is the mechanism for adding more. A seed running large-scale research jobs might want an eighth step that archives cycle artifacts into a project-specific long-term store. A seed running collaborative work might want a step that broadcasts the cycle's findings to a peer agent. The order is the framework; the steps are yours, and downstream plugins append cleanly without rewriting the core waterfall.

The architect would tune the *deflation thresholds*. The prototype's 80 percent for single-cycle jobs and 50 percent for multi-cycle jobs were calibrated against the prototype's tempo. A seed running short, sharp jobs might tighten both numbers; a seed running long-horizon strategic work might loosen them. The thresholds live in environment-tunable variables; the gate arithmetic stays the same.

The architect would adjust the *session-archive policy*. The prototype treats step 7 as a strict last-resort &mdash; any content arriving there is a signal that earlier steps under-routed. A different seed might want session archives to be a first-class durable layer, with its own retention policy and recall hooks. The policy is the surface; the storage mechanism is in place.

The architect would change the *fix-in-cycle gate severity*. The prototype hard-blocks job creation when scope overlaps the cycle's altered list. A more permissive seed might allow the overlap but tag the new job with a "deferred-from-cycle-N" annotation. A stricter seed might widen the overlap definition to include all files touched by any subagent during the cycle, not just main-session edits. The severity is yours; the principle &mdash; that "fix it now or declare you didn't" is a forced structural fork &mdash; is the floor.

The CONDENSE pattern &mdash; a metabolism organ that consolidates the cycle's experiential data through an ordered waterfall, with a deflation gate that forces routing to happen before close &mdash; lifts off the prototype into any work where the cost of learning nothing from finished work is high. A consulting practice cultivating a delivery-engagement seed could install a step-8 that emails each cycle's findings to the engagement lead before the cycle closes &mdash; the metabolism organ now feeds an external stakeholder. A research-lab seed could route every `[KNOWLEDGE]` marker into a structured literature-review file rather than ad-hoc knowledge dirs &mdash; the same waterfall, a different durable destination. The honest limit is that the deflation gate is friction, not mathematical certainty: voice coaching plus a stage-aware word-count gate, and the agent can route to the step-7 session archive as a last resort when nothing distills cleanly. [Gmode](06_9-gmode.html) bypasses the cycle entirely, and the lock-forward-only rule below makes that a deliberate operator exit rather than an accidental drift &mdash; the mechanism slows the agent enough to force the choice, not enough to make the choice physically impossible.

What the architect would **not** remove is the lock-forward-only rule. The principle is the floor: a metabolism organ that can be backward-rolled is not a metabolism organ &mdash; it is an editing pass. The forward-only commitment is what makes condensation a discrete *event* in the cycle's life, not a cleanup the agent could revisit and undo.

The deepest payoff of CONDENSE is the cognitive failure mode it prevents: the *forgetting cycle* &mdash; the seed agent that completes the work, declares victory, and starts the next cycle as cold as the previous one, having absorbed nothing from the experience. The waterfall is the structural answer. Each step routes one specific kind of finding to one specific durable destination. The deflation gate forces the routing to happen rather than be deferred. The lock-forward rule means the routing happens *now* or the cycle does not close. The friction is the pedagogy. The phase is the metabolism.

## The only phase that edits the brain

CONDENSE is also the only phase that is allowed to edit the brain itself &mdash; the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices, the subagent definitions, the durable knowledge files. Everywhere else, those edits are protected. When an earlier phase notices a voice should change, an agent definition should tighten, or a finding should be promoted to long-term memory, it does not edit; it writes a marker in its footer. The marker stays unconsumed until CONDENSE arrives and routes it. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified. *[ref: execute-blocks-root-brain-condense-only | .claude/plugins/phase_execute/hooks/execute-guard.sh `block "root-brain-blocked" "brain_protected"` call (claude_rel == CLAUDE.md branch) + the `brain-protection\|root-brain-blocked` case in the block-message switch | EXECUTE blocks edits to root CLAUDE.md and .claude/CLAUDE.md: the guard's claude_rel branch fires `block "root-brain-blocked" "brain_protected"` when the target is root CLAUDE.md or .claude/CLAUDE.md, and the matching message text reads `[phase_execute] BLOCKED: Brain updates belong in condense.` The brain-protection/root-brain-blocked pair repeats across every phase guard, leaving CONDENSE alone able to touch the brain.]*

The cycle then returns to idle. The cycle counter does not advance on this edge &mdash; CONDENSE's exit only closes the books. The bump fires on the next `idle to observe`, when the user's next prompt drives the agent to call `phase.sh advance` and the orchestrator increments `cycle += 1` as it opens the new compartment. The new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed. *[ref: cycle-bump-on-idle-to-observe | .claude/plugins/phasic_system/scripts/phase.sh `advance` subcommand, `idle → observe` branch (the jq update with `.cycle += 1`) vs the `condense → idle` branch (info-cycle-complete print) | The idle → observe branch is the only site that mutates the cycle field; the jq update sets current_phase and increments cycle in one atomic write. The condense → idle branch prints "Cycle N complete" but does NOT touch the counter — the closing edge announces; the opening edge increments.]*

That is the cognitive organ. Four work-on-project phases produce experiential data; CONDENSE turns that data into durable memory. The brain that the next cycle's OBSERVE recalls is the brain CONDENSE just shaped. Without this step the cycle would still complete the work, but the seed agent would learn nothing from doing it.

The phases give the agent compartmentalized cognition. CONDENSE is the step that lets the compartmentalization compound.

But the phases share one more mechanism we have not named yet &mdash; the small dial each one turns at its entry. That dial is where the cycle's discipline and the agent's meta-cognition meet.

Next.

---

*Essay 6.7 &mdash; The Markov Phasic Brain, Part 7 of 10.*

*Previous: [Essay 6.6 &mdash; VERIFY: Independent Eyes](06_6-verify.html) &mdash; the audit chamber, the script-and-auditor rule, the multi-backward fan-out.*
*Next: [Essay 6.8 &mdash; The Inverse Multiplier](06_8-backward-multiplier.html) &mdash; the per-phase dial, the point system, and the smaller-number-bigger-phase punch.*










