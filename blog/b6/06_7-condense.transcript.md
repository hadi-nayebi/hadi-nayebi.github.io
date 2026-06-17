---
final: false
source_md: 06_7-condense.md
generated_at: 2026-06-17T07:52:14+00:00
---

CONDENSE — The Cognitive Organ

Essay 6.6 closed the audit chamber. VERIFY ran the scripts, flagged what was wrong, sent the agent back if it had to, and committed the cycle's verdict. The cycle's work-on-the-project phases are now behind us. What is left is the cycle's metabolism — the step where the cycle's experiential data gets turned into durable memory.

This is CONDENSE. It is not a fifth work-on-the-project phase. It is a different kind of phase entirely.

This essay is for you — especially when you find yourself thinking about how the brain ends up shaped after dozens of cycles.

The phase that acts on the brain

CONDENSE plays a different role from the work-on-project phases. Where they act on artifacts, CONDENSE acts on the brain itself — the cycle's cognitive metabolism organ, turning the experiential data from the prior phases into durable memory.

The other phases produce work on the project. CONDENSE produces work on the brain. Its write scope is the seed's memory layer — the CLAUDE.md footers it drains and the durable memory forms it feeds: knowledge files, coaching voices, subagent definitions. Those forms are not confined to .claude/ — a project subdirectory's CLAUDE.md is memory too, and CONDENSE may write it. The boundary is memory-forms-anywhere versus the project's deliverable files: CONDENSE may write the former, never the latter. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced — the gathered context, the plan document, the execution notes, the verification results — and route the durable parts to where they will be useful in the next cycle.

That routing draws on a catalog of seven operations (extensible per the Stage-3 Distributed Job Extension pattern). But the seven numbers are a catalog, not a running order — they name the operations, they do not sequence them. The actual execution order is three gated phases: ADDRESS the marked notes, then ARCHIVE the footer, then DEFLATE it. The three-phase order is what is fixed and hard-gated; the step numbering is just an index into the operations.

The seven operations

The catalog the three phases draw from:

1. Same-file footer-to-body absorption. Every CLAUDE.md the cycle touched has a footer with the cycle's phase notes, opened by the anchors (the OBSERVE footer, the PLAN footer, the EXECUTE footer, the VERIFY footer) from Essay 5.7. The phases write into those footers as the work happens. This operation walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can bias it with bare routing tags — a paragraph tagged durable is absorbed up by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call.

   The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this operation alone.

2. Cross-file CLAUDE.md migration. Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. A mover subagent walks the touched files and routes content sideways or upward. Its destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away.

3. Pending-job notes. During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. A job-creator subagent reads those notes and creates the jobs — but only after exploring each one.

4. Voice-update notes. A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. A voice-updater subagent edits the relevant voice file. It only touches existing voice IDs; a brand-new voice is born in a plugin-touching job, not here.

5. Agent-update notes. Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. An agent-updater subagent edits the named definition.

6. Knowledge notes. A phase may have written a knowledge note into a footer — backticks and brackets deliberate, so the note has a unique grep signature — to flag a finding that should be promoted to long-term memory. An extractor subagent reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, and re-reads the file to verify the write actually landed before reporting success.

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale notes accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed — the subagent has to see its own work on disk before it can report a note handled.

   CONDENSE carries its own write permission for .md files anywhere across the memory layer, including knowledge directories the earlier phases never touched — it is the only phase allowed to create durable knowledge files outside the altered list, precisely because routing into a fresh knowledge subtree is its job. This is how the brain grows — cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it.

7. Session archive. The full footer of every altered CLAUDE.md is captured as a snapshot — a complete raw record of the cycle's working memory — written into a per-job session file by a dedicated command. This is the preservation step that lets the seed safely deflate. It is not a last-resort dustbin and a long archive is not a failure: it is a full-footer snapshot by design, large is normal. What stays disciplined is that durable knowledge lands in the discoverable layers — the body and knowledge/ — with the archive as the raw backup behind them, the least discoverable layer, reached only by a trace-link.

The three phases: address, archive, deflate

The catalog above is what CONDENSE can do. The order it does them in is three phases, each gating the next, built around one rule: the footer is never shrunk before it is preserved.

Phase A — ADDRESS. Footer content-deletion is locked. The agent may add its own cognition freely, but it may not remove anything yet. This is where the marked notes get consumed — operations three through six from the catalog. For each marked note, the agent dispatches the note's consuming subagent, and that subagent does one of two things: it resolves the note itself, or it hands the note back. A note is not "done" because a subagent ran on it — it is done only when it reaches a terminal state.

A marked note is written in a parsable form — [NOTETYPE]{content}, the braces a delimiter so a single pattern reads every note. There are exactly two terminal states. [RESOLVED:NOTETYPE]{breadcrumb} means the note is done, and the breadcrumb is a verifiable work-reference: the git commit of a voice edit, a created job's id, the path of a new knowledge file. [CARRIED:NOTETYPE:n]{content}{why} means a note the agent genuinely could not resolve this cycle — deferred, visible, and counted, where n is the carry-count.

The carry-count is the pressure. Each cycle a note survives unresolved, the next CONDENSE detects the existing [CARRIED:…:n] and re-hands it as n+1. There is no hard cap — an immortal note simply becomes impossible to ignore as its n climbs, and the extension cycle can force it to a head. The counter is the cap.

Two small guards keep this honest, and they bracket every note-consuming subagent. To start, the subagent's dispatch prompt must quote the live note verbatim — one note per dispatch, so every resolution traces to a specific, real note rather than a vague instruction. To end, the subagent's run cannot complete until that same quoted note has changed — to a resolved form, or to a hand-back (the note left with its original tag but an extra brace of context appended, which is how the agent later finds the notes handed back to it). Quote the note to begin; modify the note to finish. A dispatched subagent can never silently no-op.

One pair of tags sits outside all of this. durable and ephemeral are bare tags — no braces, no consuming subagent. They are routing bias for the absorb step, consumed by their effect, never needing a terminal rewrite.

Phase B — ARCHIVE. Once every marked note is terminal and no condense work is left on the footer, a session-log command captures the footers of all the altered CLAUDE.md files into a single per-cycle session file. Its precondition is that Phase A is clear — archiving only after addressing is what makes the snapshot a faithful record of finished thinking rather than a photograph of half-worked notes. Deletion stays locked until the archive is verified to have happened — a preservation check, that the footer was non-emptily captured, not a precise word count.

Phase C — DEFLATE. Only now is deletion permitted. The agent finishes the reduction: durable findings absorb up into the body (the lasting trace, roughly one breadcrumb per worked section), the cross-file moves complete, the archived remainder is deleted from the footer, and a single pointer to the session file is left behind. The [CARRIED:] notes are not swept — they survive live in the footer into the next cycle, their counters climbing. The deflation gate is the size control here: it opens only when the footer is under twenty percent of its size at phase entry. Resolve, then archive, then deflate — that sequence is what makes the shrink legitimate rather than mere deletion.

The deflation gate

The deflation gate sits at the close of Phase C. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first phase anchor — and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against the threshold.

The threshold is the same for every job: eighty percent of the footer words must be absorbed before the cycle can close, whether the job runs once or across many cycles. The cycle is a discrete event; working memory compresses hard before the agent returns to idle, and real cycles routinely overshoot the target when there is little worth keeping.

A multi-cycle job gets no lighter target, and the reason is worth stating plainly. The instinct is that some planning context needs to survive into the next cycle's PLAN, so the footers should be spared — but that handoff does not live in the footers. It lives in the plan file, the durable cross-cycle vessel. CONDENSE does not write that vessel: the plan file's only post-creation editor is VERIFY — and only in cycle 1, the plan's editing window — which sharpens it there, so by the time CONDENSE runs the handoff is already in place. Leaving a second copy below a footer anchor would double-budget the same handoff — once in the plan file, once in the footer — so the eighty-percent gate holds for every Stage.

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more — because CONDENSE is lock-forward only. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense. Outstanding work opens a new cycle through the extension valve, never a backward step.

The job graph CONDENSE owns

CONDENSE is also the one phase allowed to grow the job graph. The other phases never call the job-creation script themselves; when they need a follow-up job, they declare intent in a pending-job note and move on. The notes sit unconsumed until CONDENSE arrives, walks them in operation three, and — after the explore-first check that decides whether each proposed job is even valid — creates the ones that survive. The additive moves (create, create-dependent, add-dependency) all live behind a CONDENSE-only guard, because CONDENSE is the phase with the cycle-wide context to judge what new work is actually needed.

The "graph" here is concrete. A dependency is a directed edge job-A → job-B stored as a list of dependent-job IDs in the parent job's top-level depends_on array on the job object. add-dependency <focused> <dep> appends an ID; remove-dependency filters it out; the completion gate refuses to mark a job completed while any ID in its depends_on is still in pending or active. The graph is required to be acyclic — a job cannot depend, transitively, on a job that depends on it — because cycles would deadlock the completion gate forever. CONDENSE adds edges with cycle-wide context; VERIFY removes them with audit-time context.

VERIFY owns the symmetric move on the other end — remove-dependency. Where CONDENSE has cycle-wide context to decide what new work needs creating, VERIFY has audit-time context to discover that a declared dependency turned out unnecessary. Adding and removing are split across phases by which one has the right perspective to make the call. The pattern repeats across the architecture: where one phase ADDS, a different phase OWNS the REMOVAL, and the split tracks which phase has the context to judge.

A worked example

Pick up the multi-cycle plan-job from the earlier essays. VERIFY rolled the cycle backward to PLAN; PLAN re-authored the sharpened acceptance criteria; EXECUTE landed the backward-compat work alongside the marker-schema work; VERIFY ran the audit family again and this time the criteria all passed. The orchestrator advances the job to CONDENSE.

The agent enters CONDENSE. The entry voice fires and orients the phase. The condense-sensor snapshots the bottom-section word counts of every CLAUDE.md the cycle touched and stores the baseline.

Phase A — ADDRESS runs first. The cycle's footers carry a small set of live marked notes. A pending-job{audit-marker-schema-drift} declares a follow-up job. A knowledge{marker-schema-versioning} flags a finding worth promoting. A voice-update{observe-entry | mention marker-schema audits | add as a research target} asks that the OBSERVE entry voice be tightened. The agent dispatches each note's subagent, one note per dispatch, each prompt quoting its live note.

The condense-job-creator explores the pending note — it touches other plugins, the proposal is valid, no existing repeating job covers it — creates the job, and rewrites the note to [RESOLVED:PENDING-JOB]{job  created}. The condense-voice-updater finds the OBSERVE entry voice, tightens it, commits, and writes [RESOLVED:VOICE-UPDATE]{<commit>}. The condense-knowledge-extractor reads the surrounding paragraph, writes a new file at .claude/knowledge/opevc/marker-schema-versioning.md, re-reads its own write to confirm the bytes landed, and rewrites the note to [RESOLVED:KNOWLEDGE]{knowledge/opevc/marker-schema-versioning.md}. No note was handed back, so the agent has nothing left to carry. Every marked note is now terminal. Deletion is still locked.

Phase B — ARCHIVE runs next. With Phase A clear, the session-log command captures the full footers of every altered CLAUDE.md — execution notes, the backward-transition story, the resolved-note breadcrumbs, everything — into the cycle's session file in the run-aware job directory. The command verifies the capture landed. Only now does deletion unlock.

Phase C — DEFLATE runs last. The agent absorbs the durable findings up into each file's body, the mover routes one cross-file paragraph to the phase_condense plugin's CLAUDE.md, the archived remainder is deleted, and a single breadcrumb pointing to the session file is left in the footer. The deflation gate runs: the baseline footer-word count was 1,820; after deflation the footer holds 312 — an 83 percent reduction, clear of the eighty-percent threshold. The orchestrator commits the cycle and advances the job to idle. The next OBSERVE will open with the freshly-tightened voice, the new knowledge file in the recall path, and the new standalone job waiting in the queue.

The cycle's experiential data is now durable memory. The brain just learned.

The reflection that closes the phase

Everything above is CONDENSE's operational half — the three phases, the note consumption, the deflation gate that forces the footers to compress. The phase has a second half, and it opens only at the exit. Before CONDENSE may advance, a reflection pass runs: a promotion-scan sweeps the whole cycle for knowledge candidates the explicit knowledge notes missed, and updates the rolling cycle-lessons and the Prior Summary — the running capsule of the job's cognition that seeds the next session — so the reflection carries forward across a context reset. Its answer is written into CONDENSE's slice of the cycle's compaction file — the cross-session memory introduced in the always-on cortex.

The knowledge operation routed the findings the earlier phases flagged by hand; the promotion-scan is the second-order sweep for what no note caught — and unlike the footers, the compaction file is the one thing CONDENSE never deflates, because it carries exactly what must survive the reset.

This is why CONDENSE is the most-gated phase of all. Like every phase its boundary opens on the three-family exit gate — and CONDENSE keeps its eighty-percent deflation gate on top, so it advances only when the footers have compressed and the reflection has run. And because CONDENSE consumes the cycle's notes rather than leaving new ones, the new-notes family does not apply here; what it must show instead is that its metacognition ran and judged how well it condensed — the seed's learning phase auditing its own learning. Essay 6.2 maps the cycle's full transition structure across all five phases; the gate's own anatomy is the subject of the next essay.

The note side of the gate is where CONDENSE inverts the work phases most sharply. A work phase is measured on the notes it creates; CONDENSE creates none — its job is to feed on them. So its note gate runs the other way: per note class, the cycle must run that class's dedicated subagent as many times as there are marked notes of that class in the footers — one condense-job-creator run per pending-job, one condense-voice-updater run per voice-update, and so on. But running the subagent is necessary, not sufficient. The note must reach a terminal state — resolved, or explicitly carried. A run that simply concluded "I looked at it" and left the note bare no longer counts; the gate confirms the note actually landed somewhere. Carry-over stays legitimate — that is what [CARRIED:] is for, and it is why the twenty percent of footer content that survives a healthy deflation, and the extension cycle that re-examines unresolved work, both stay intact — but now it is explicit and counted, not silent.

The note classes are open, not fixed. The five generics fire in every job, but a particular kind of job can teach its own note class — declared by the job's prompt, not baked into the universal phase voices. The first such job-custom note is draft-term: when a vocabulary-touching job meets a term the project's shared-language files do not yet define, any phase can drop a draft-term{...} note naming the gap, and CONDENSE later runs it through its own consuming subagent, which deposits a flagged-draft vocabulary stub for a human to confirm or correct and resolves the note to [RESOLVED:DRAFT-TERM]. The five generics are the floor; a job class adds the notes its own work needs.

What you would customize

CONDENSE is the phase with the most opinionated default behaviors and, perhaps because of that, the richest customization surface for any architect who wants to bend the brain's metabolism to their own work.

The architect would extend the operation catalog. The prototype ships seven operations; the Stage-3 Distributed Job Extension pattern is the mechanism for adding more. A seed running large-scale research jobs might want an eighth operation that archives cycle artifacts into a project-specific long-term store. A seed running collaborative work might want one that broadcasts the cycle's findings to a peer agent. The three-phase order is the framework; the operations are yours, and downstream plugins append cleanly without rewriting the core.

The architect would tune the deflation threshold. The prototype's eighty percent was calibrated against its own tempo. A seed running short, sharp jobs might tighten it; a seed running long-horizon strategic work might loosen it. The threshold lives in an environment-tunable variable; the gate arithmetic stays the same.

The architect would adjust the session-archive policy. The prototype captures the full footer as a per-cycle snapshot — a complete raw record, large by design, the safety layer behind the discoverable knowledge. A different seed might want to archive only an unrouted remainder, or promote the archive to a first-class durable layer with its own retention policy and recall hooks. The three-phase order is the framework; the archive policy is the architect's.

The CONDENSE pattern — a cognitive metabolism organ that consolidates the cycle's experiential data through a gated three-phase sequence, preserving the footer before it deflates it — lifts off the prototype into any work where the cost of learning nothing from finished work is high. A consulting practice cultivating a delivery-engagement seed could install an eighth operation that emails each cycle's findings to the engagement lead before the cycle closes — the cognitive metabolism organ now feeds an external stakeholder. A research-lab seed could route every knowledge note into a structured literature-review file rather than ad-hoc knowledge dirs — the same phases, a different durable destination.

The honest limit is that the deflation gate is friction, not mathematical certainty: voice coaching plus a single word-count gate, and the agent retains discretion over what distills cleanly and what gets carried. Gmode bypasses the cycle entirely, and the lock-forward-only rule makes that a deliberate operator exit rather than an accidental drift — the mechanism slows the agent enough to force the choice, not enough to make the choice physically impossible.

What the architect would not remove is the lock-forward-only rule, nor the preserve-before-delete ordering. A cognitive metabolism organ that can be backward-rolled is not a metabolism organ — it is an editing pass. A metabolism organ that deletes before it preserves is not safe — it loses what it was supposed to digest. The forward-only commitment is what makes condensation a discrete event in the cycle's life; the three-phase order is what makes it a safe one.

The deepest payoff of CONDENSE is the cognitive failure mode it prevents: the forgetting cycle — the seed agent that completes the work, declares victory, and starts the next cycle as cold as the previous one, having absorbed nothing from the experience. The three phases are the structural answer. ADDRESS routes each finding to a durable destination and forces every note to a terminal state. ARCHIVE preserves the whole footer before anything is lost. DEFLATE forces the compression to actually happen. The lock-forward rule means it happens now or the cycle does not close. The friction is the pedagogy. The phase is the metabolism.

Where the brain grows most

CONDENSE is the phase where the soft brain grows most — the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices in voice.xml, the markdown subagent definitions, the durable knowledge files. It is not the only path into the memory layer: a plugin-unlocking job (PLUGIN-LOCK on an approved job) and the operator's off-cycle gmode lane both edit the substrate too. What CONDENSE owns is the normal-cycle path — and during the work-on-project phases, the brain is held closed: EXECUTE hard-blocks edits to the root brain so consolidation can't be smuggled into the build. CONDENSE owns consolidation, not arbitrary substrate surgery; hard plugin code stays behind the PLUGIN-LOCK/gmode/approved-job boundary from Essay 5. When an earlier phase notices a voice should change, an agent definition should tighten, or a finding should be promoted to long-term memory, it does not edit; it writes a note in its footer. The note stays unconsumed until CONDENSE arrives and routes it. This makes CONDENSE the lever by which the brain rewrites itself in the ordinary cycle — at known moments, at the end of a cycle, only after the cycle's work has been verified.

The cycle then returns to idle. The cycle counter does not advance on this edge — CONDENSE's exit only closes the books. The bump fires on the next idle to observe, when the user's next prompt drives the agent to call phase.sh advance and the orchestrator increments cycle += 1 as it opens the new compartment. The new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed.

That is the cognitive organ. The work-on-project phases produce experiential data; CONDENSE turns that data into durable memory. The brain that the next cycle's OBSERVE recalls is the brain CONDENSE just shaped. Without this step the cycle would still complete the work, but the seed agent would learn nothing from doing it.

The phases give the agent compartmentalized cognition. CONDENSE is the step that lets the compartmentalization compound.

But the phases share one more mechanism we have not named yet — the small dial each one turns at its entry. That dial is where the cycle's discipline and the agent's meta-cognition meet.

Next.
