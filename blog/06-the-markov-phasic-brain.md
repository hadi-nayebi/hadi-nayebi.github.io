---
title: "The Markov Phasic Brain"
date: "May 2026"
slug: "the-markov-phasic-brain"
read_time: "40 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, CONDENSE]
status: drafting
version: v0.21.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# The Markov Phasic Brain

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

---

Now we open the cycle.

[Essay 5](05-the-always-on-digital-cortex.html) introduced two pieces of the seed agent's foundation, side by side. The **always-on plugins** are the agent's reflexes — each one owns a concern that fires regardless of which phase the agent is in or whether a phase is even active: plugin edit safety, context window discipline, job lifecycle, interaction legibility, structured questioning. They run continuously, each in its own lane, with its own state. The **CLAUDE.md layer** is the substrate the agent's structured cognitive work writes into — a hierarchy of CLAUDE.md files, a knowledge directory, a memory layer that survives across phases and sessions.

This essay is about the system that does the structured work — the phasic system — and how it uses the CLAUDE.md layer to think ahead, gather experiential data, and process that data into the agent's longer-term memory forms.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely.

The current prototype runs five phases: *observe, plan, execute, verify, and condense*. OPEVC is the acronym, the name the brain calls its own cycle. The fifth phase, CONDENSE, plays a different role from the other four. The first four do work *on the project*; CONDENSE does work *on the brain*. We call CONDENSE the cycle's cognitive organ for that reason. Still, it is one of the five phases, not a sixth thing. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The five-phase shape is the prototype. The discipline of compartmentalized phasing is the architecture.

Two states travelled with us across the previous essay without being named: *idle* and *gmode*. We left them out of Essay 5 to keep the substrate description clean. They come back now, because the full Markov brain does not run without them.

What we are about to open is what [Essay 3.1](03_1-the-folder-is-alive.html) called the agent's *cognitive metabolism* — the rhythm of breathing in context, working on it, breathing out memory. The phasic layer is that metabolism made mechanical.

This essay opens that discipline compartment by compartment.

---

## From Action Space to Markov Brain

In [Essay 1](01-llms-are-not-the-agents.html) we drew the seed agent's starting condition as an **action space** — the set of moves a CLI agent can pick at any given moment. Use deep reasoning. Use tools — read, write, edit, run. Ask for permission. Delegate to another agent. Stop. Each step the LLM samples from those moves probabilistically. The next step samples again. The result, without further structure, is what that essay called a **random walk** — a Markov chain where every path is equally likely, and the same prompt twice can produce two different journeys.

Then we added the first layer of structure: hooks. Hooks fire on every tool call, every stop, every prompt. They can block an action, modify it, or trigger another. In Essay 1's framing, hooks turn the **probabilistic chain into a deterministic pipeline**. The LLM still proposes the next move; the hooks decide whether the move is allowed.

The phasic layer takes that idea one fractal step further.

A phase is a flavor of the action space. Inside OBSERVE, the action space is narrowed — write tools to project files are gone, only the read-and-synthesize moves are available. Inside EXECUTE, the action space widens for the altered list and tightens elsewhere. Each phase is a *customized Markov chain* — its own restricted action space, its own hook-enforced rules, its own bias toward the kind of move that phase wants to encourage.

The cycle on top is itself a Markov chain — but its "actions" are not individual tool calls. Its actions are the phases. The agent moves between phases. Each move from one phase to the next obeys gates and edges declared by the orchestrator plugin. **A Markov brain whose moves are themselves Markov chains.** Fractal, by design.

This is what the title points at. The phasic brain is Markov on two levels. Inside any phase, the agent's tool calls are a constrained action-space chain. Across the cycle, the phases themselves are a state machine with declared edges and no hidden continuation.

![The OPEVC cycle. Forward edges (white) advance automatically. Backward edges (brown) are explicit choices. Idle holds the agent between cycles; condense returns to idle.](../assets/images/blog/opevc-cycle-blackboard.png)

---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression.

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another.

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

---

## The Full Transition Map

The rim of the cycle has more edges than Essay 5 needed to show. Here is the complete map the orchestrator enforces.

**Forward edges** fire automatically when the phase-commit script's gate passes:

- `idle → observe` (start a new cycle)
- `observe → plan`
- `plan → execute`
- `execute → verify`
- `verify → condense`
- `condense → idle` (close the cycle)

**Backward edges** are explicit — the agent chooses where to roll back to:

- `observe → idle` (bail — the cycle is preserved, no new cycle is consumed on re-entry)
- `plan → observe`
- `execute → observe` or `execute → plan`
- `verify → execute`, `verify → plan`, or `verify → observe` (the three-destination routing — minor fix, design flaw, or context gap)

No backward edge from condense. Once the cycle reaches CONDENSE, the only exit is forward to idle. The brain refuses to un-consolidate. We come back to *why* in the CONDENSE section.

**The gmode side-channel** — every phase, including idle, has one extra edge that loops back to itself through gmode. Gmode is short for *generic mode*. It is the freestyle phase: a deliberately unconstrained mode where none of the OPEVC tool-restriction guards apply, used for work that doesn't fit the OPEVC ceremony.

Entry is the same regardless of which phase you came from. The agent writes a `[GMODE]` prefixed question to the user with a substantive reason — at least a hundred words explaining why the work needs to happen outside the current phase's compartment. The orchestrator stashes the current phase, the agent enters gmode, and the per-phase guards step aside.

Inside gmode the agent can do real work for as long as it needs. Fix a deadlock. Make a small plugin edit that doesn't merit a full OPEVC cycle. Run a plugin-lock ceremony. The mode is intentionally unopinionated. Exit is explicit (the agent calls a small CLI to leave gmode) and requires a clean git working tree — the same discipline that gates every phase boundary. The home phase is restored atomically; the cycle counter does not advance.

How gmode is used is a customization choice. The prototype was built running every job through OPEVC because the work was building the seed agent itself. Once the seed agent ships open-source, users will run their project work through OPEVC and may push routine plugin maintenance through gmode. Or define new phases. Or split phase plugins by job type. Gmode is the general-purpose escape hatch from the prototype's current ceremony, and the seed-cultivator decides what flows through it.

Counting it all together, the prototype's full state set is `idle, observe, plan, execute, verify, condense, gmode` — five OPEVC phases, one meta-state, and one freestyle side-channel. The rest of the essay opens the OPEVC compartments. Idle and gmode are the bookends.

---

## The Discipline Is the Tool Restrictions

A phase is not just a label. It is a different *write scope*.

OBSERVE and PLAN are read-only. The agent can read any file it likes, but the only files it can write are CLAUDE.md files. Code, scripts, configuration, project content — none of it is editable in those phases.

EXECUTE has full write access, scoped to a list of directories the plan declared up front.

VERIFY has scripts-only access. The agent can run tests, run scripts, run validators. It cannot edit code. It can write pass/fail results back into CLAUDE.md and into a designated plan file.

CONDENSE has the most permissive *but most restricted* scope: it can write almost anywhere inside `.claude/`, including across plugins, but it cannot touch project files at all.

Forbidding tools is not a limitation. It is the pedagogy. Call this *tool restriction as pedagogy* — the discipline doesn't come from telling the agent what to do; it comes from making the wrong move impossible.

When OBSERVE is read-only, the agent is forced to gather context before it can act. There is no escape into "let me just patch this real quick" — the patch tool isn't available.

When PLAN is read-only, the plan must commit fully to a written contract before EXECUTE can begin. The alternative isn't there.

When VERIFY can only run scripts, self-verification through "the code looks fine to me" is impossible. Only what the scripts say counts.

When CONDENSE can only touch `.claude/`, project work is structurally fenced off. The agent can't sneak a feature in under the cover of consolidation.

Enforcement is layered. A global guard, registered by the orchestrator plugin, fires on every tool call and refuses to let the agent mutate anything while the job is in idle — that is the only thing the global gate does. Once a phase is active, the global gate exits silently and the per-phase guard for that phase takes over.

Every phase publishes its own guard. Every guard is registered unconditionally and self-exits in milliseconds if the focused job's phase doesn't match its own; only the guard for the active phase does real work. Each guard inspects every write call against an allowlist, then consults a shared section-check library to ensure the edit doesn't cross a phase-section boundary inside any CLAUDE.md.

The footer markers from [the previous essay](05-the-always-on-digital-cortex.html) — `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` — are physical barriers. The EXECUTE guard refuses to overwrite the OBSERVE block. The OBSERVE guard refuses to write past EXECUTE. The markers are not decoration; they are the structural manifestation of compartmentalization. The agent can lose the argument with the user, or with itself, but it can't lose it with the guard. The guard is code.

The result: each phase produces its own kind of artifact. OBSERVE produces working memory. PLAN produces a plan document. EXECUTE produces code changes plus execution notes. VERIFY produces pass/fail results. CONDENSE produces a clean working memory and durable knowledge files.

Every phase has its own plugin. The phasic plugins (currently six in the prototype — one per phase, plus a separate orchestrator that tracks which phase is active for which job) are themselves single-concern packages, each one owning the rules for one mode of cognition. As with the always-on layer, the count is the prototype, not the architecture. A custom seed adding a sixth phase would add a seventh plugin alongside the orchestrator. The shape is what generalizes.

<!-- IMAGE PLACEHOLDER:
  Concept: Tool-restriction matrix per phase. Vertical: phases (OBSERVE / PLAN / EXECUTE / VERIFY / CONDENSE).
  Horizontal: action categories (Read / Write project files / Write CLAUDE.md / Write plan file / Run scripts / Write .claude/).
  Cells: green check (allowed) or red X (blocked) — the visual reveals that each phase has a unique allow-pattern,
  and the diagonal of "what each phase uniquely produces" emerges naturally.
  Visual style: dark glassy table, indigo/violet accents on allowed cells.
  Caption: "Each phase is defined by what it cannot do."
-->


---

## A Quick Map Before We Dive In

Before opening each phase compartment, here is the operational map at a glance. Each line below names the phase, its essence, and what it is on the hook to produce.

**IDLE** — the meta-state between cycles.
- Hold the agent until the next prompt activates a job
- Refuse all project-file writes; only the orchestrator's own CLI is unlocked
- Let the agent read freely, but commit nothing until OBSERVE begins

**OBSERVE** — gather context before any plan can form.
- Populate the working-memory CLAUDE.md files with relevant context
- Dispatch parallel research subagents and synthesize their returns
- Refuse code edits — the only allowed write is into CLAUDE.md
- Cross the exit threshold only after enough investigation has happened

**PLAN** — turn observations into a binding contract.
- Decide single-cycle versus multi-cycle and lock the choice for the rest of the job
- Declare the *altered list* — the directories EXECUTE will be allowed to touch
- Write acceptance criteria VERIFY will check against
- Refuse code edits — the contract is what gets written, not the work

**EXECUTE** — build what the plan declared, in checkpoints.
- Edit project files, but only inside the altered list the plan locked
- Commit small, focused checkpoints; never one long uncommitted run
- Capture *execution notes* in the working CLAUDE.md so the cycle stays narratable
- Delegate parallel file work to execute subagents; keep the main session on the spine

**VERIFY** — judge prior work with independent eyes.
- Run scripts and validators; refuse all code edits in this phase
- Dispatch auditor subagents to read the executed work without bias
- Route the cycle: forward to CONDENSE, backward to EXECUTE/PLAN/OBSERVE
- Record the rollback choice as part of the job's history

**CONDENSE** — consolidate the cycle's learnings into the brain.
- Walk a strict seven-step waterfall that routes content to its durable home
- Consume marker types the prior phases dropped into footers
- Compress the working CLAUDE.md back to a clean state
- Lock forward to idle; no escape hatch back to verify

**GMODE** — the freestyle side-channel from any phase.
- Enter via a `[GMODE]` user question with a substantive reason (≥100 words)
- Run unconstrained work — no OPEVC tool-restriction guards apply
- Exit explicitly with a clean git tree; the home phase resumes atomically
- Host work that doesn't fit the OPEVC ceremony — deadlock fixes, plugin maintenance, custom workflows

That is the operational shape. The rest of this essay opens each phase one at a time and explains what makes its compartment work.

---

## OBSERVE — Read Wide, Write Once

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context.

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation.

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content. That single restriction, more than anything else, is what forces observation to actually happen. There is no escape into action.

OBSERVE is also where the most distinctive seed-agent mechanism lives. We meet it here, and it will return through every phase that follows.

The mechanism is what the prototype calls the **multiplier sentinel**: a per-phase scalar that starts at zero and locks every tool until the agent sets a real value. The setter is a small CLI call the agent must make as its very first action — picking a value from a fixed range between 0.5 and 3.0. Once set, the value cannot be changed for that phase entry. The same pattern applies to every other phase. We come back to what the value *means* — and why a smaller number declares a larger phase — at the close of this essay. It is more interesting than it looks.

OBSERVE also has two intermediate gates that shape the rhythm of the phase from the inside. The first is a *minimum-synthesis* gate: the agent has to read enough before any write into CLAUDE.md is allowed. The block message the agent sees is plain — "you have to read before you can write." The second is a *maximum-accumulation* gate: once the agent has read for a while without synthesizing, further reading is blocked until it puts something into CLAUDE.md. The block message is similarly plain — "you have read enough; synthesize before continuing." The arithmetic underneath those gates is hidden from the agent; only the block messages surface, and only when a gate fires.

OBSERVE also dispatches its share of subagents. A typical OBSERVE phase will fan out two to four research subagents in parallel, each pursuing a different question, each returning a structured synthesis. The main session orchestrates; the subagents investigate. The roster of specialized observe subagents (read-only researchers, comparison agents, web-fetchers, and so on) is currently around a dozen. The 80/20 split between main-session orchestration and subagent execution — and why the architecture insists on it — is the subject of [Essay 7](07-the-plugin-kit.html).

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent.

---

## PLAN — Decide, Then Lock

PLAN is also read-only against project files. The agent can still read whatever it needs, but writes are still confined to CLAUDE.md plus one optional new file: the plan document itself.

The first thing the agent does on entering PLAN, after the multiplier, is decide whether the job needs a plan file at all.

The decision is binary. Either this is a single-cycle job — no plan document, the contract lives in the working CLAUDE.md and dissolves with the cycle — or this is a multi-cycle job, in which case the agent declares a plan-file name. EXECUTE will create the named document and write to it. VERIFY will record verification results into CLAUDE.md and stage the plan file as part of its commit, but it does not modify the plan's content directly. Future PLAN cycles will read the plan file back as a long-term contract that survives across cycles. The decision is made once, in cycle 1, and locks for the remainder of the job.

Plan documents live at a known path inside the agent's knowledge directory. Their structure is opinionated. Each one carries a stated goal, an acceptance-criteria list, the *altered list* — the directories EXECUTE will be allowed to touch, [introduced in the previous essay](05-the-always-on-digital-cortex.html) as the mechanism that lets PLAN scope EXECUTE's reach — and an explicit set of judgment-call criteria. The judgment-call criteria are the points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe.

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE. This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check.

If EXECUTE wants to touch a file the plan didn't list, the request is blocked. The agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

The reason the plan is locked is the reason every project rationalizes mid-execution. Plans written *during* execution are not plans; they are post-hoc explanations for whatever the executor felt like doing. By forcing the plan to be authored before any code is touched, the seed agent forecloses that drift. The plan can be wrong — that is what VERIFY is for, and that is what backward transitions are for — but it cannot be silently rewritten.

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate.

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

## EXECUTE — Build, in Scope, in Steps

EXECUTE is where code gets written. The write-tool guard is gentler here, but only inside the altered list. Every other path is blocked.

The altered list is a frozen snapshot of directories, captured from OBSERVE and PLAN at phase entry. A guard inspects every write call against that snapshot before the call lands. A path inside the snapshot proceeds. A path outside is rejected, and the agent has to either roll back to PLAN to amend the contract or accept the fence.

A second guard inside the same hook protects the phase-section markers — the four footer anchors from the previous essay — so that EXECUTE writes execution notes inside its own footer section but cannot overwrite what the prior phases wrote. The compartmentalization holds even within a single CLAUDE.md.

The phase is structured around *checkpoints* — short, focused commits that finish one piece of the plan before starting the next. The pattern is deliberate. A long uncommitted run inside EXECUTE has the same problem as a long run anywhere else: drift accumulates, and a failure halfway through erases everything. Checkpointing forces small wins. It also gives the agent a clean place to pause and notice when the plan is wrong, before sinking another ten tool calls into the wrong direction.

EXECUTE writes two things: the code, and *execution notes* in the working CLAUDE.md. The notes are short — what surprised the agent, what decisions the agent made when the plan left a judgment call open, what the next phase should know. The notes are what turn a sequence of commits into a coherent narrative. They will be one of the things CONDENSE absorbs.

EXECUTE is also where subagent dispatch shows up most heavily, and the point schedule encodes that explicitly. Every execute subagent the main session launches grants the session a small *direct-action budget* — a handful of extra writes the main session is allowed to make on its own. Every project file the main session edits itself spends some of that budget back. Reading project files does not consume budget; only edits and writes outside `.claude/` do. The arithmetic is small but the bias is intentional: the main session is incentivized to delegate parallel implementation to its execute subagents rather than do the file work itself. A typical execute phase will spawn one or two execute subagents on file edits while the main session works on the spine of the change.

The cap on parallel execute subagents is two-in-flight, not unbounded. Heavier fan-out risks the same file being touched twice and a merge collision the agent then has to spend a checkpoint cleaning up. Two-in-flight is enough for genuine parallelism on independent files, narrow enough to keep the agent's context coherent. We will come back to the discipline of subagent dispatch in [Essay 7](07-the-plugin-kit.html).

When EXECUTE believes the plan is implemented, it commits the final checkpoint and the orchestrator advances the job to VERIFY.

---

## VERIFY — Independent Eyes

VERIFY is scripts-only.

The agent cannot edit code in VERIFY. It can read anything — the broadest read scope of any phase, by design. It can run tests. It can run validators. And it can dispatch a particular class of subagent — *auditors* — whose entire job is to read the executed work and report whether each acceptance criterion holds.

Auditor subagents are read-only researchers, scoped narrowly to one slice of the cycle. The prototype ships five of them. One re-walks the working memory the OBSERVE phase produced and asks whether the planning was actually grounded in it. One reads the plan against the executed change and asks whether each acceptance criterion was met. One walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. One compares what was built against what the plan specified — flagging over-engineering, missed items, and silent deviations. One assesses the quality of the change itself: scope discipline, edit patterns, structural consistency. Five auditors, five perspectives, deliberately composed so that no single one dominates the verdict. None of them are allowed to fix what they find — they only report.

The reason VERIFY is its own phase is the same reason a compiler is not the same process as the programmer. Self-verification is biased. The hand that built the code wants to see the code as correct. A separate phase, with separate tools, run by a separate cognitive posture — and frequently delegated to subagents for independence — gives the verification an honest chance to catch what execution missed.

VERIFY produces a structured pass/fail report against the plan's acceptance criteria. The report goes into the plan document and into the working CLAUDE.md. Three outcomes are possible.

If everything passes, the orchestrator advances the job to CONDENSE.

If something minor fails — a typo, a missed import, a comment that wasn't updated — VERIFY transitions backward to EXECUTE, which gets a chance to fix the small thing and re-checkpoint. The plan is not amended; only the implementation is corrected.

If something major fails — an acceptance criterion that the plan can't meet, a discovery that the observation was incomplete — VERIFY transitions backward all the way to OBSERVE or PLAN. The orchestrator records the rollback as part of the job's history. The cycle restarts with the lesson learned.

This three-destination backward routing is what gives the phasic layer its name. **Forward transitions are automatic** when the gate criteria are met; **backward transitions are explicit** and the agent has to choose where to roll back to. The state of the cycle is fully determined by the current phase, the multiplier set on entry, and the point counter. No hidden continuation. Any phase can be re-entered, but only by rolling back along defined edges. This is the Markov property the title leans on: the cycle's next move is a function of its present state, not of the path that got it there.

<!-- IMAGE PLACEHOLDER:
  Concept: VERIFY's three-destination backward routing. Center node: VERIFY. Three explicit
  backward arrows fanning out: one short arrow back to EXECUTE (labeled "minor — fix the implementation"),
  one mid-length arrow back to PLAN (labeled "design flaw — amend the contract"), one long arrow
  back to OBSERVE (labeled "context was incomplete — re-gather"). One forward arrow to CONDENSE
  (labeled "pass — advance"). Each backward arrow has a small icon showing what gets reset versus
  preserved (multiplier preserved, target-phase counters reset).
  Visual style: dark glassy node graph, indigo for forward, violet for backward, fading intensity
  by distance.
  Caption: "Backward transitions are explicit choices, not automatic fallbacks."
-->


When VERIFY passes, the orchestrator advances the job to CONDENSE.

---

## CONDENSE — The Cognitive Organ

CONDENSE is not a peer of the other phases. It is a different kind of thing.

The other phases produce work *on the project*. CONDENSE produces work *on the brain*. Its write scope is `.claude/` plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced — the gathered context, the plan document, the execution notes, the verification results — and route the durable parts to where they will be useful in the next cycle.

That routing is structured as a strict **seven-step waterfall**. The order matters; each step's output feeds the next.

<!-- IMAGE PLACEHOLDER:
  Concept: The CONDENSE 7-step waterfall as a vertical cascade. Each step is a labeled tile,
  with content "falling" downward from one to the next. Steps 1-2 are local routing (footer-to-body,
  cross-file). Steps 3-6 are marker consumption (PENDING-JOB, VOICE-UPDATE, AGENT-UPDATE, KNOWLEDGE) —
  show each step has a small subagent icon next to it. Step 7 (session archive) is visually smaller,
  greyer, labeled "last resort". A side annotation: "deflation gate" sits below all seven steps,
  blocking the exit arrow if the absorption percentage hasn't been reached.
  Visual style: dark glassy cascade, indigo flow lines, violet markers.
  Caption: "Each step's output feeds the next. Step 7 is the fallback, not a peer."
-->

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the four phase markers from [the previous essay](05-the-always-on-digital-cortex.html). The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step — a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this step alone, the bulk of the cycle's noise gone in one absorption pass.

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away.

3. **Pending-job markers.** During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker.

4. **Voice-update markers.** A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker.

5. **Agent-update markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker.

6. **Knowledge markers.** This is the most important step. A phase may have written a knowledge marker into a footer — backticks and brackets deliberate, so the marker has a unique grep signature — to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line.

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed — the subagent has to see its own work on disk before it can call the marker consumed.

   There is also a pre-flight gate. The plan that authorized the cycle must already include the target knowledge directory in its altered list, otherwise the EXECUTE-phase guard would have rejected the write before it could land. The plan must already be expecting the knowledge file. Discipline propagates upstream. This is how the brain *grows* — cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it.

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a dated session archive. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy.

After all seven steps, CONDENSE checks a *deflation gate*. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first phase marker — and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against a stage-aware threshold.

Single-cycle jobs default to eighty percent absorption. The cycle is final; working memory must compress hard before the agent returns to idle.

Multi-cycle jobs default to fifty percent. Some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are tunable, and real cycles routinely overshoot — single-cycle jobs in the prototype have driven the deflation well past the eighty-percent target when the cycle had less to keep than the threshold assumed.

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more — because CONDENSE is *lock-forward only*. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense.

CONDENSE is also the only phase that is allowed to edit the brain itself — the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices, the subagent definitions. Everywhere else, those files are protected. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified.

The cycle then returns to idle. The next prompt starts a new cycle, and the new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed.

---

## The Backward Multiplier

For the architects in the audience, this is where the phasic layer earns its keep. The mechanism is small. The discipline it produces is large.

Start with the **Ralph loop**. The pattern is familiar to anyone who has tried to keep a CLI agent on task: an agent finishes a few moves, decides it is done, calls `Stop`, and quits — even though the work is not actually finished. The fix that emerged in the broader agent community is to refuse the stop. The agent calls `Stop`; the system intercepts; the agent is returned to the prompt and told to keep working. The loop runs until the work is genuinely done.

The seed agent adopts the Ralph loop through the job system. Every job carries an `active` field. The always-on layer's stop-gate hook reads that field on every `Stop` attempt; while any job is `active`, the stop is refused and the agent is returned to the prompt with a message explaining what is still in flight. Stop, refused. Stop, refused. The agent learns to keep working until the job formally completes.

The phasic layer does the same thing one fractal level down — inside a single phase.

Every phase has a fixed point threshold the agent must cross before it is allowed to commit and advance. Cross the threshold and the commit script accepts the move forward. Try to commit before crossing it and the script refuses, returning the agent with a message about what kind of work is still missing. Try to call `Stop` mid-phase and the same refusal fires. The threshold is friction-by-design — a refusal layer that makes the seed agent slow down and do the work the phase exists to do, instead of rushing through phases to get to the next move.

<!-- IMAGE PLACEHOLDER:
  Concept: The multiplier dial. A horizontal slider with six tick marks: 3.0, 2.5, 2.0, 1.5, 1.0, 0.5.
  Below each tick, a small icon and a phrase: 3.0 = "surgical / ~12 actions" (small dot icon),
  2.0 = "tight / ~17", 1.5 = "targeted / ~22", 1.0 = "standard / ~34", 0.5 = "deep / ~67 actions" (large blob icon).
  An arrow labeled "smaller number, bigger phase" runs from right to left across the dial,
  visualizing the inverted semantics.
  Visual style: dark glassy slider, indigo gradient from right (small) to left (deep), violet ticks.
  Caption: "The multiplier is backward. A smaller number declares a deeper phase."
-->

How does the phase know what counts as enough work? Through a per-phase point system.

Each phase has its own point schedule. Actions the phase wants to encourage earn the most; actions it wants to discourage earn less or nothing. OBSERVE rewards synthesis writes into CLAUDE.md and parallel research subagent dispatches above any other action. EXECUTE rewards code edits inside the altered list and execute subagent dispatches. VERIFY rewards script runs and auditor subagent dispatches. CONDENSE rewards routing content into the brain's durable layers — knowledge files, voice files, plugin CLAUDE.mds. The schedules differ on purpose: each phase shapes the kind of work it considers progress.

The point system is *invisible to the seed agent*. No instruction file mentions points. No coaching voice cites a number. No subagent prompt rewards points. The agent never sees its current score and never sees the threshold. What the agent sees, when a gate fires, is the *kind* of work it needs more of — "you have to read before you can write" or "you have read enough; synthesize before continuing." The arithmetic is the orchestrator's; the experience is just the friction. Hiding the score is deliberate. A scoreboard the agent could see would create point-chasing — the model is good at optimizing what it can measure. The seed agent is not allowed to optimize this one. It can only do the work, and the work earns points the agent never counts.

Now bring in the multiplier.

On entry to every phase, the agent must set a multiplier — chosen from a fixed dial at `0.5, 1, 1.5, 2, 2.5, 3`. Tools are locked until the choice is made. Once made, it cannot be changed for the entry. The multiplier scales how many points each action in the phase's schedule is worth. A high multiplier weights every action up; fewer actions clear the threshold. A low multiplier weights every action down; more actions are needed.

The naive read is that multiplier scales workload up. The intuition is exactly backward. **A smaller multiplier declares a larger phase.**

A `3.0` multiplier means each action is worth three times the base points. The threshold is reached fast — in practice, around twelve actions. The agent has declared: "this phase is small. I am in and out." A surgical bug fix. A typo. A targeted lookup-and-edit.

A `1.0` multiplier is the standard pace — about thirty-four actions to cross the threshold.

A `0.5` multiplier means each action is worth half the base points. The threshold takes around sixty-seven actions to clear. The agent has declared: "this phase is large. I am settling in for deep work." A research-heavy investigation. A multi-file refactor. A complex feature.

The intermediate values fill the dial. `1.5` lands around twenty-two actions. `2.0` and `2.5` shape the phase further toward surgical.

Pick the multiplier wrong in either direction and there is a real cost. Forecast too small (high multiplier on what turns out to be deep work) and the threshold fires before the work is done; the agent has to re-enter the phase to finish, fragmenting the cycle's record. Forecast too large (low multiplier on what turns out to be surgical work) and the phase pads out, the agent does more reading than the work merited, the context window inflates for nothing.

The architecture deliberately makes both directions of error cost something. The point of the dial is not to find the safe choice — there is no safe choice. The point is to force a real act of meta-cognition before the phase begins.

This is the deeper move. The multiplier choice forces the agent to *anticipate the phase*. Before the agent picks a value, it has to read the working memory and ask itself: how heavy is this phase actually going to be? What will I be doing? How many subagents will I need? How many CLAUDE.md edits? The answer is encoded in the multiplier value. And once the multiplier is set, the agent's natural next move is to write a todo list that matches it — twelve focused steps for a `3.0`, sixty-seven slower steps for a `0.5`, with the rhythm planned in advance. The dial is a single scalar; what it produces is structured anticipation.

The point counter behaves a level below this in a way the architects should know about. *Backward transitions preserve points; only successful forward advances reset them.* If the agent enters VERIFY, collects fifty points of audit work, then rolls backward to EXECUTE to fix a small thing, the verify entry's fifty points are preserved. When the agent advances forward again — execute → verify — VERIFY resumes from where it was, fifty points already earned, only fifty more to clear the threshold. Only a successful forward advance out of a phase finalizes its entry and resets the counter for the next time the phase is entered fresh. The architecture rewards persistence across rollbacks. The agent does not lose work to the rollback; it loses only the time spent fixing what made the rollback necessary.

Pattern-matching from past phases is also explicitly forbidden. "Verify is usually short" or "observe is usually deep" are exactly the wrong heuristics — they short-circuit the meta-cognition the multiplier exists to force. There is now a catalog of multiplier anti-patterns the system actively avoids in its coaching voices: leading words, translation rules, phase metaphors that pre-encode scope. The voice is engineered to leave the forecast unmade until the agent makes it, on *this* phase's evidence alone.

A scalar between `0.5` and `3` carries the weight of all of this. The Ralph loop refuses the stop. The point threshold creates the friction. The point schedule defines what work counts. The point system stays invisible so the agent does not learn to game it. The multiplier dial forces an act of forecasting, and the forecast in turn forces a structured plan of attack for the phase. Simple jobs find a high multiplier and move fast. Complex jobs find a low multiplier and breathe. Every phase begins with a real moment of meta-cognition — and the rest of the phase is the agent living up to it.

This is the part of the seed agent's design I find most quietly elegant.

---

## What Comes Next

Phases give the agent compartmentalized cognition. The CLAUDE.md layer from [the previous essay](05-the-always-on-digital-cortex.html) gives them somewhere to write that cognition down. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

This is what [Essay 1](01-llms-are-not-the-agents.html) was reaching toward when it claimed the agent is the filesystem. The filesystem holds memory. The phases discipline what the agent does with it. The two ideas only fully resolve when you see them together.

Stretch one cycle into many, chained, and you get the long-horizon discipline [Essay 8](08-from-apprentice-to-architect.html) is about — multi-cycle jobs where the multiplier sentinel, the plan-file contract, and the seven-step waterfall keep the agent honest across days, not just minutes. The mechanisms in this essay are designed to scale up that way without losing their grip.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design?

Next.

---

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Always-On Digital Cortex](05-the-always-on-digital-cortex.html) — the always-on plugins and the CLAUDE.md hierarchy as information bus.*
*Next: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*
