---
final: false
source_md: 06_7-condense.md
generated_at: 2026-06-10T18:10:40+00:00
---

CONDENSE — The Cognitive Organ

Essay 6.6 closed the audit chamber. VERIFY ran the scripts, flagged what was wrong, sent the agent back if it had to, and committed the cycle's verdict. The cycle's work-on-the-project phases are now behind us. What is left is the cycle's metabolism — the step where the cycle's experiential data gets turned into durable memory.

This is CONDENSE. It is not a fifth work-on-the-project phase. It is a different kind of phase entirely.

This essay is for you — especially when you find yourself thinking about how the brain ends up shaped after dozens of cycles.

The phase that acts on the brain

CONDENSE plays a different role from the work-on-project phases. Where they act on artifacts, CONDENSE acts on the brain itself — the cycle's cognitive metabolism organ, turning the experiential data from the prior phases into durable memory.

The other phases produce work on the project. CONDENSE produces work on the brain. Its write scope is .claude/ plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced — the gathered context, the plan document, the execution notes, the verification results — and route the durable parts to where they will be useful in the next cycle.

That routing is structured as a strict ordered waterfall (currently seven steps in the prototype; extensible per the Stage-3 Distributed Job Extension pattern). The order matters; each step's output feeds the next.

The waterfall, step by step

1. Same-file footer-to-body absorption. Every CLAUDE.md the cycle touched has a footer with the cycle's phase markers (the OBSERVE footer, the PLAN footer, the EXECUTE footer, the VERIFY footer) from Essay 5.7. The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step — a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call.

   The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this step alone, the bulk of the cycle's noise gone in one absorption pass.

2. Cross-file CLAUDE.md migration. Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away.

3. Pending-job markers. During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker.

4. Voice-update markers. A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker.

5. Agent-update markers. Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker.

6. Knowledge markers. This is the most important step. A phase may have written a knowledge marker into a footer — backticks and brackets deliberate, so the marker has a unique grep signature — to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line.

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed — the subagent has to see its own work on disk before it can call the marker consumed.

   CONDENSE carries its own write permission for .md files anywhere inside .claude/, including knowledge directories the earlier phases never touched — it is the only phase allowed to create durable knowledge files outside the altered list, precisely because routing into a fresh knowledge subtree is its job. This is how the brain grows — cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it.

7. Session archive. Whatever did not fit into the earlier steps gets dropped into a per-job session archive file under .claude/knowledge/session/. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy.

   The earlier steps leave trace-links behind as they route — short pointers naming where each piece of footer content went. The final sweep is what clears the footers for good: it takes the unrouted remainder together with those accumulated processing trace-links, moves the whole batch into the session file, and leaves a single trace-link behind for the entire archive. One pointer for one archive, rather than a litter of dead pointers below the markers.

The deflation gate

After the waterfall's steps, CONDENSE checks a deflation gate. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first phase marker — and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against the deflation threshold.

The threshold is the same for every job: eighty percent of the footer words must be absorbed before the cycle can close, whether the job runs once or across many cycles. The cycle is a discrete event; working memory compresses hard before the agent returns to idle, and real cycles routinely overshoot the target when there is little worth keeping.

A multi-cycle job gets no lighter target, and the reason is worth stating plainly. The instinct is that some planning context needs to survive into the next cycle's PLAN, so the footers should be spared — but that handoff does not live in the footers. It lives in the plan file, the durable cross-cycle vessel. CONDENSE does not write that vessel: the plan file's only post-creation editor is VERIFY — and only in cycle 1, the plan's editing window — which sharpens it there, so by the time CONDENSE runs the handoff is already in place. Leaving a second copy below a footer marker would double-budget the same handoff — once in the plan file, once in the footer — so the eighty-percent gate holds for every Stage.

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more — because CONDENSE is lock-forward only. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense.

Fix-in-cycle, and other phases' job markers

CONDENSE is lock-forward only on its own transitions. The cycle as a whole has one more escape hatch — a backward route to EXECUTE that fires before the waterfall even reaches step 4.

The mechanism is a scope-overlap check inside step 3. When CONDENSE consumes a pending-job marker, it does not blindly create the dependent job. It first compares the proposed job's altered list against the current cycle's altered list. If the two overlap — meaning the follow-up work would touch files the cycle just edited — the job creation is blocked and CONDENSE routes the agent backward to EXECUTE. The voice is direct: fix your own bugs before closing the cycle. A follow-up job that touches this cycle's files is not follow-up — it is unfinished work the agent tried to defer.

Step 3 also lands the second deep principle of the cycle's job graph. CONDENSE is the only phase allowed to mutate the job graph in the additive direction — create, create-dependent, add-dependency all live behind a CONDENSE-only guard. The other phases drop pending-job markers into their footers as they go; the markers sit unconsumed until CONDENSE arrives, walks them in step 3, and routes them through the overlap check. The phases that need a job created never call the job-creation script themselves; they declare intent in a marker.

The "graph" here is concrete. A dependency is a directed edge job-A → job-B stored as a list of dependent-job IDs in the parent job's top-level depends_on array on the job object. add-dependency <focused> <dep> appends an ID; remove-dependency filters it out; the completion gate refuses to mark a job completed while any ID in its depends_on is still in pending or active. The graph is required to be acyclic — a job cannot depend, transitively, on a job that depends on it — because cycles would deadlock the completion gate forever. CONDENSE adds edges with cycle-wide context; VERIFY removes them with audit-time context.

VERIFY owns the symmetric move on the other end — remove-dependency. Where CONDENSE has cycle-wide context to decide what new work needs creating, VERIFY has audit-time context to discover that a declared dependency turned out unnecessary. Adding and removing are split across phases by which one has the right perspective to make the call. The pattern repeats across the architecture: where one phase ADDS, a different phase OWNS the REMOVAL, and the split tracks which phase has the context to judge.

A worked example

Pick up the multi-cycle plan-job from the earlier essays. VERIFY rolled the cycle backward to PLAN; PLAN re-authored the sharpened acceptance criteria; EXECUTE landed the backward-compat work alongside the marker schema work; VERIFY ran the audit family again and this time the criteria all passed. The orchestrator advances the job to CONDENSE.

The agent enters CONDENSE. The entry voice fires and orients the phase — a moderately deep pass, because the cycle produced a lot of footer noise and at least one knowledge-worthy finding. The condense-sensor snapshots the bottom-section word counts of every CLAUDE.md the cycle touched and stores the baseline.

Step 1 fires first. The agent walks the frozen altered-list snapshot. The working CLAUDE.md's footers carry several hundred words of phase notes — the OBSERVE synthesis on the marker-schema contradiction, PLAN's acceptance-criteria decisions, EXECUTE's checkpoint observations, VERIFY's auditor findings on backward-compatibility. The agent absorbs the durable findings up into the body, drops the ephemeral checkpoint chatter, and leaves the footers stripped to their markers. The sibling CLAUDE.md files take the same treatment.

Step 2 fires next. The condense-claude-md-mover subagent walks the cycle's findings. One paragraph — a lesson about how the marker schema interacts with cycle 2's git history — belongs better in the phase_condense plugin's CLAUDE.md than in the focused working file. The mover routes it sideways; the source paragraph is deleted, the destination receives a deduplicated addition.

Step 3 fires now — the marker-consumption block. The cycle's footers carry a small set of live markers. A pending-job declares a follow-up standalone job: "audit other plugins for similar marker-schema drift." A knowledge marker-schema-versioning declares a finding worth promoting to long-term memory. A voice-update declares that the OBSERVE entry voice should mention marker-schema audits as a research target.

The condense-job-creator runs the overlap check on the pending job — it touches other plugins' files, not this cycle's altered list — the overlap is clean, the job is created, the marker is removed. The condense-voice-updater finds the OBSERVE entry voice in the right voice.xml and tightens its text. The condense-knowledge-extractor reads the surrounding paragraph, writes a new file at .claude/knowledge/opevc/marker-schema-versioning.md, re-reads its own write to confirm the bytes landed, and only then replaces the source marker with a strikethrough audit line.

Steps 4, 5, and 7 are quiet. No voice-update markers remain after step 4 consumed the one above; no agent-update markers fired in this cycle; step 7's session archive picks up two short paragraphs of cycle-narrative that did not fit any earlier step.

The deflation gate runs. The baseline footer-word count was 1,820; after the waterfall the remaining footer-word count is 312 — an 83 percent reduction. The threshold is eighty percent for every job, and this multi-cycle cycle clears it. The orchestrator commits the cycle and advances the job to idle. The next OBSERVE will open with the freshly-tightened voice, the new knowledge file in the recall path, and the new standalone job waiting in the queue.

The cycle's experiential data is now durable memory. The brain just learned.

The reflection that closes the phase

Everything above is CONDENSE's operational half — the waterfall, the marker consumption, the deflation gate that forces the footers to compress. The phase has a second half, and it opens only at the exit. Before CONDENSE may advance, a reflection pass runs: a promotion-scan sweeps the whole cycle for knowledge candidates the explicit knowledge markers missed, and updates the rolling cycle-lessons and the Prior Summary — the running capsule of the job's cognition that seeds the next session — so the reflection carries forward across a context reset. Its answer is written into CONDENSE's slice of the cycle's compaction file — the cross-session memory introduced in the always-on cortex.

Step six routed the findings the earlier phases flagged by hand; the promotion-scan is the second-order sweep for what no marker caught — and unlike the footers, the compaction file is the one thing CONDENSE never deflates, because it carries exactly what must survive the reset.

This is why CONDENSE is the most-gated phase of all. Like every phase its boundary opens on the three-family exit gate — and CONDENSE keeps its eighty-percent deflation gate on top, so it advances only when the footers have compressed and the reflection has run. And because CONDENSE consumes the cycle's marks rather than leaving new ones, the new-notes family does not apply here; what it must show instead is that its metacognition ran and judged how well it condensed — the seed's learning phase auditing its own learning. Essay 6.2 draws this gate in full across all five phases.

The marker side of the gate is where CONDENSE inverts the work phases most sharply. A work phase is measured on the notes it creates; CONDENSE creates none — its job is to feed on them. So its marker gate runs the other way: per marker class, the cycle must run that class's dedicated subagent as many times as there are marked notes of that class in the footers — one condense-job-creator run per pending-job, one condense-voice-updater run per voice-update, and so on. The gate confirms the per-note cognition actually ran; it does not force the note to be resolved. A run can legitimately conclude "carry this one over" — which is why the twenty percent of footer content that survives a healthy deflation, and the extension cycle that re-examines unresolved work, both stay intact. Engagement is the bar, not forced resolution.

The class list is open, not fixed. The marker classes above fire in every job, but a particular kind of job can teach its own marker — declared by the job's prompt, not baked into the universal phase voices. The first such job-custom marker is draft-term: when a vocabulary-touching job meets a term the project's shared-language files do not yet define, any phase can drop a draft-term note naming the gap, and CONDENSE later deposits it as a flagged-draft vocabulary stub for a human to confirm or correct. The five generics are the floor; a job class adds the markers its own work needs.

What you would customize

CONDENSE is the phase with the most opinionated default behaviors and, perhaps because of that, the richest customization surface for any architect who wants to bend the brain's metabolism to their own work.

The architect would extend the waterfall itself. The prototype ships seven steps in a strict order; the Stage-3 Distributed Job Extension pattern is the mechanism for adding more. A seed running large-scale research jobs might want an eighth step that archives cycle artifacts into a project-specific long-term store. A seed running collaborative work might want a step that broadcasts the cycle's findings to a peer agent. The order is the framework; the steps are yours, and downstream plugins append cleanly without rewriting the core waterfall.

The architect would tune the deflation threshold. The prototype's eighty percent was calibrated against its own tempo. A seed running short, sharp jobs might tighten it; a seed running long-horizon strategic work might loosen it. The threshold lives in an environment-tunable variable; the gate arithmetic stays the same.

The architect would adjust the session-archive policy. The prototype treats step 7 as a strict last-resort — any content arriving there is a signal that earlier steps under-routed. A different seed might want session archives to be a first-class durable layer, with its own retention policy and recall hooks. The policy is the surface; the storage mechanism is in place.

The architect would change the fix-in-cycle gate severity. The prototype hard-blocks job creation when scope overlaps the cycle's altered list. A more permissive seed might allow the overlap but tag the new job with a "deferred-from-cycle-N" annotation. A stricter seed might widen the overlap definition to include all files touched by any subagent during the cycle, not just main-session edits. The severity is yours; the principle — that "fix it now or declare you didn't" is a forced structural fork — is the floor.

The CONDENSE pattern — a cognitive metabolism organ that consolidates the cycle's experiential data through an ordered waterfall, with a deflation gate that forces routing to happen before close — lifts off the prototype into any work where the cost of learning nothing from finished work is high. A consulting practice cultivating a delivery-engagement seed could install a step-8 that emails each cycle's findings to the engagement lead before the cycle closes — the cognitive metabolism organ now feeds an external stakeholder. A research-lab seed could route every knowledge marker into a structured literature-review file rather than ad-hoc knowledge dirs — the same waterfall, a different durable destination.

The honest limit is that the deflation gate is friction, not mathematical certainty: voice coaching plus a single word-count gate, and the agent can route to the step-7 session archive as a last resort when nothing distills cleanly. Gmode bypasses the cycle entirely, and the lock-forward-only rule below makes that a deliberate operator exit rather than an accidental drift — the mechanism slows the agent enough to force the choice, not enough to make the choice physically impossible.

What the architect would not remove is the lock-forward-only rule. The principle is the floor: a cognitive metabolism organ that can be backward-rolled is not a cognitive metabolism organ — it is an editing pass. The forward-only commitment is what makes condensation a discrete event in the cycle's life, not a cleanup the agent could revisit and undo.

The deepest payoff of CONDENSE is the cognitive failure mode it prevents: the forgetting cycle — the seed agent that completes the work, declares victory, and starts the next cycle as cold as the previous one, having absorbed nothing from the experience. The waterfall is the structural answer. Each step routes one specific kind of finding to one specific durable destination. The deflation gate forces the routing to happen rather than be deferred. The lock-forward rule means the routing happens now or the cycle does not close. The friction is the pedagogy. The phase is the metabolism.

The only phase that edits the brain

CONDENSE is also the only phase that is allowed to edit the soft brain itself — the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices in voice.xml, the markdown subagent definitions, the durable knowledge files. Hard plugin code is still protected by the PLUGIN-LOCK/gmode/approved-job boundary from Essay 5; CONDENSE owns consolidation, not arbitrary substrate surgery. When an earlier phase notices a voice should change, an agent definition should tighten, or a finding should be promoted to long-term memory, it does not edit; it writes a marker in its footer. The marker stays unconsumed until CONDENSE arrives and routes it. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified.

The cycle then returns to idle. The cycle counter does not advance on this edge — CONDENSE's exit only closes the books. The bump fires on the next idle to observe, when the user's next prompt drives the agent to call phase.sh advance and the orchestrator increments cycle += 1 as it opens the new compartment. The new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed.

That is the cognitive organ. The work-on-project phases produce experiential data; CONDENSE turns that data into durable memory. The brain that the next cycle's OBSERVE recalls is the brain CONDENSE just shaped. Without this step the cycle would still complete the work, but the seed agent would learn nothing from doing it.

The phases give the agent compartmentalized cognition. CONDENSE is the step that lets the compartmentalization compound.

But the phases share one more mechanism we have not named yet — the small dial each one turns at its entry. That dial is where the cycle's discipline and the agent's meta-cognition meet.

Next.
