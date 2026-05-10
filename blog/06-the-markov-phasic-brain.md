---
title: "The Markov Phasic Brain"
date: "May 2026"
slug: "the-markov-phasic-brain"
read_time: "30 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, CONDENSE]
status: drafting
version: v0.11.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# The Markov Phasic Brain

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

---

Now we open the cycle.

The bus from [the previous essay](05-the-always-on-digital-cortex.html) is substrate — a hierarchy of CLAUDE.md files, a knowledge directory, a memory layer. The always-on plugins protect it. They don't fill it.

This essay is about what fills it, and how.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely.

The current prototype runs five phases plus one cognitive organ: **observe, plan, execute, verify, and condense** — OPEVC for short, "Oh Pee Ee Vee See", the name the brain calls its own cycle. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The five-phase shape is the prototype. The discipline of compartmentalized phasing is the architecture.

This essay opens that discipline compartment by compartment.

<!-- IMAGE PLACEHOLDER:
  Concept: The OPEVC cycle wheel. Five phase wedges (OBSERVE, PLAN, EXECUTE, VERIFY) circling
  a central CONDENSE organ that sits inside the wheel — not on the rim. Forward arrows around
  the rim (idle → observe → plan → execute → verify → condense → idle). Faded backward arrows
  (verify → execute, verify → plan, verify → observe). CONDENSE has only an inbound arrow
  (verify → condense → idle); no backward edge.
  Visual style: dark glassy panel, indigo/violet palette, clean geometric forms.
  Caption: "The phasic cycle. Forward edges advance automatically; backward edges are explicit."
-->


---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression.

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another.

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

---

## The Discipline Is the Tool Restrictions

A phase is not just a label. It is a different *write scope*.

OBSERVE and PLAN are read-only. The agent can read any file it likes, but the only files it can write are CLAUDE.md files. Code, scripts, configuration, project content — none of it is editable in those phases.

EXECUTE has full write access, scoped to a list of directories the plan declared up front.

VERIFY has scripts-only access. The agent can run tests, run scripts, run validators. It cannot edit code. It can write pass/fail results back into CLAUDE.md and into a designated plan file.

CONDENSE has the most permissive *but most restricted* scope: it can write almost anywhere inside `.claude/`, including across plugins, but it cannot touch project files at all.

Forbidding tools is not a limitation. It is the pedagogy. Call this **tool restriction as pedagogy** — the discipline doesn't come from telling the agent what to do; it comes from making the wrong move impossible.

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

## OBSERVE — Read Wide, Write Once

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context.

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation.

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content. That single restriction, more than anything else, is what forces observation to actually happen. There is no escape into action.

OBSERVE is also where two of the most distinctive seed-agent mechanisms live. We meet them here, and they will return throughout the rest of the essay.

The first is the **multiplier sentinel**. Every phase, on entry, has a multiplier that is initially zero. Tools are locked until the agent sets it. The setter is a small CLI call that the agent must make as its very first action — picking a value from a fixed range between 0.5 and 3.0. Once set, the multiplier cannot be changed for that phase entry. The same pattern applies to every other phase. We come back to what the multiplier *means* in the tier-3 close — it is more interesting than it looks.

The second is the **point-budget gate**. Inside the phase, every tool call earns points on a fixed schedule that biases toward synthesis. Writing into CLAUDE.md earns the most; launching a research subagent earns next-most; reading and listing earn modestly; the cheapest tools earn a single point. The schedule is what tells the system "enough observation has happened to justify advancing to plan."

The schedule isn't just an exit threshold. Two intermediate gates fire inside the phase. A *minimum-synthesis* gate blocks any write into CLAUDE.md until the agent has read enough to have something worth writing — you have to read before you can write. A *maximum-accumulation* gate blocks further reading once the agent has accumulated context without writing, forcing it to synthesize before continuing to gather. The phase cannot be exited until a fixed total has been crossed.

OBSERVE also dispatches its share of subagents. A typical OBSERVE phase will fan out two to four research subagents in parallel, each pursuing a different question, each returning a structured synthesis. The main session orchestrates; the subagents investigate. The roster of specialized observe subagents (read-only researchers, comparison agents, web-fetchers, and so on) is currently around a dozen. The 80/20 split between main-session orchestration and subagent execution — and why the architecture insists on it — is the subject of [Essay 7](07-the-plugin-kit.html).

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent.

---

## PLAN — Decide, Then Lock

PLAN is also read-only against project files. The agent can still read whatever it needs, but writes are still confined to CLAUDE.md plus one optional new file: the plan document itself.

The first thing the agent does on entering PLAN, after the multiplier, is decide whether the job needs a plan file at all.

The decision is binary. Either this is a single-cycle job — no plan document, the contract lives in the working CLAUDE.md and dissolves with the cycle — or this is a multi-cycle job, in which case the agent declares a plan-file name. EXECUTE will create the named document. VERIFY will edit it. Future PLAN cycles will read it back as a long-term contract that survives across cycles. The decision is made once, in cycle 1, and locks for the remainder of the job.

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

EXECUTE is also where subagent dispatch shows up most heavily, and the point schedule encodes that explicitly. Every execute subagent the main session launches grants the session a small *direct-action budget* — a handful of extra writes the main session is allowed to make on its own. Every project file the main session opens itself spends some of that budget back. The arithmetic is small but the bias is intentional: the main session is incentivized to delegate parallel implementation to its execute subagents and to keep its own context window clean, rather than reading every file itself. A typical execute phase will spawn one or two execute subagents on file edits while the main session works on the spine of the change.

The cap on parallel execute subagents is two-in-flight, not unbounded. Heavier fan-out risks the same file being touched twice and a merge collision the agent then has to spend a checkpoint cleaning up. Two-in-flight is enough for genuine parallelism on independent files, narrow enough to keep the agent's context coherent. We will come back to the discipline of subagent dispatch in [Essay 7](07-the-plugin-kit.html).

When EXECUTE believes the plan is implemented, it commits the final checkpoint and the orchestrator advances the job to VERIFY.

---

## VERIFY — Independent Eyes

VERIFY is scripts-only.

The agent cannot edit code in VERIFY. It can read anything — the broadest read scope of any phase, by design. It can run tests. It can run validators. It can dispatch *auditor* subagents — read-only researchers whose entire job is to read the executed work and report whether each acceptance criterion holds.

The auditors are deliberately heterogeneous. One re-walks the working memory the OBSERVE phase produced and asks whether the planning was actually grounded in it. One reads the plan against the executed change and asks whether each acceptance criterion was met. One walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. The roster (currently around five auditors, one per cycle slice) is composed so that no single perspective dominates. Every auditor is read-only. None of them are allowed to fix what they find — they only report.

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

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the four phase markers from [the previous essay](05-the-always-on-digital-cortex.html). The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step — a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: in one of the prototype's cycles, a single plugin's working CLAUDE.md shrank from over two thousand footer words to roughly five hundred in this step alone — a seventy-eight percent absorption in one move.

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away.

3. **Pending-job markers.** During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker.

4. **Voice-update markers.** A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker.

5. **Agent-update markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker.

6. **Knowledge markers.** This is the most important step. A phase may have written a knowledge marker into a footer — backticks and brackets deliberate, so the marker has a unique grep signature — to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line.

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed — the subagent has to see its own work on disk before it can call the marker consumed.

   There is also a pre-flight gate. The plan that authorized the cycle must already include the target knowledge directory in its altered list, otherwise the EXECUTE-phase guard would have rejected the write before it could land. The plan must already be expecting the knowledge file. Discipline propagates upstream. This is how the brain *grows* — cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it.

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a dated session archive. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy.

After all seven steps, CONDENSE checks a **deflation gate**. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first phase marker — and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against a stage-aware threshold.

Single-cycle jobs default to eighty percent absorption. The cycle is final; working memory must compress hard before the agent returns to idle.

Multi-cycle jobs default to fifty percent. Some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are tunable. Real cycles routinely overshoot — one of the prototype's recent single-cycle jobs ran the deflation from a six-thousand-word baseline down to under three hundred, well past the target.

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more — because CONDENSE is **lock-forward only**. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense.

CONDENSE is also the only phase that is allowed to edit the brain itself — the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices, the subagent definitions. Everywhere else, those files are protected. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified.

The cycle then returns to idle. The next prompt starts a new cycle, and the new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed.

---

## Tier-3 Close: The Multiplier Is Backward

For the architects in the audience: there is one detail in the phasic layer that quietly carries more weight than the rest of the design. It is the **multiplier sentinel**.

Recall the setup. On entry to a phase, the agent must set a multiplier between 0.5 and 3.0. Tools are locked until it is set. Once set, it cannot be changed.

The naive expectation is that the multiplier is a *throttle* — higher numbers mean more work, lower numbers mean less. That intuition is exactly backward.

The multiplier multiplies points earned per tool call. The phase's exit gate is a fixed point threshold. Combine those two facts.

<!-- IMAGE PLACEHOLDER:
  Concept: The multiplier dial. A horizontal slider with five tick marks: 3.0, 2.0, 1.5, 1.0, 0.5.
  Below each tick, a small icon and a phrase: 3.0 = "surgical / ~12 actions" (small dot icon),
  1.5 = "targeted / ~17", 1.0 = "default / ~30", 0.5 = "deep / ~67 actions" (large blob icon).
  An arrow labeled "smaller number, bigger phase" runs from right to left across the dial,
  visualizing the inverted semantics.
  Visual style: dark glassy slider, indigo gradient from right (small) to left (deep), violet ticks.
  Caption: "The multiplier is backward. A smaller number declares a deeper phase."
-->

A multiplier of 3.0 means each tool call earns three times as many points. The exit gate is reached fast — in practice, around eleven or twelve tool calls. This is *surgical* work. A narrow, targeted edit. A small typo fix, a lookup-and-edit, a minor refactor. Setting the multiplier to 3.0 declares: "this phase is small. I'm in and out."

A multiplier of 1.0 is the default pace, around thirty actions. A 1.5 lands closer to seventeen.

A multiplier of 0.5 means each tool call earns half as many points; the exit gate takes far longer to reach, somewhere around sixty-seven actions. This is *deep* work — broad observation, careful planning, sweeping execution. A complex feature, a research-heavy investigation, a multi-file refactor. Setting the multiplier to 0.5 declares: "this phase is large. I'm settling in."

The lock is structural. Every phase entry initializes the multiplier to zero, and the per-phase guard refuses to let the agent run any tool while the multiplier is zero — the lone exception is the shell call that sets it. Once the multiplier is set and the first real action lands, the points counter goes positive, and the guard refuses to set the multiplier again. The error message is small: *Multiplier can only be set at phase start.* No second chances, no override.

The multiplier, in other words, is the agent's honest forecast of the phase's scope, expressed as a constraint on its own freedom to leave.

This matters because forecast accuracy has real cost in both directions. Forecasting too small — a high multiplier on what turns out to be deep work — means the gate fires before the work is done, and the agent has to re-enter the phase to finish, wasting the original commit and producing a fragmented record. Forecasting too large — a low multiplier on what turns out to be surgical work — means the agent does more reading and dispatching than the work merited, burning context and tool budget on padding.

The architecture deliberately makes both directions of error cost something. There is no safe choice. The discipline is to read the job at phase entry — what does the working memory currently show me about scope — and pick the multiplier that matches *this* phase's actual size. Not the cycle's size. Not the job's size. *This phase's* size.

The discipline goes further. The agent is explicitly forbidden from pattern-matching from past phases — "verify is usually short, observe is usually deep" — because pattern recall is precisely the bias that has burned the prototype before. One real cycle in the prototype's history saw the agent choose 0.5 for a phase that was actually surgical; the exit gate refused to fire eight times before the agent gave up, rolled the phase back, and restarted at 1.5. There is now a documented catalog of multiplier anti-patterns the system explicitly avoids — leaning words in the entry voice, translation rules like "many means low, few means high", phase metaphors that pre-encode scope. The voice is engineered to leave the forecast unmade until the agent makes it, on this phase's evidence alone.

The multiplier is therefore the smallest possible commitment device, and the most honest. The agent is not being asked to estimate hours or files or tokens. It is being asked to declare, in a single number, how heavy this phase will be. And then to live with that declaration — not because someone is grading it, but because the gate timing depends on it.

This is the part of the seed agent's design I find most quietly elegant. A scalar between 0.5 and 3 carries the weight of forecast discipline that most agent architectures don't even attempt to enforce.

---

## What Comes Next

Phases give the agent compartmentalized cognition. The bus from [the previous essay](05-the-always-on-digital-cortex.html) gives the agent durable substrate. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

This is what [Essay 1](01-llms-are-not-the-agents.html) was reaching toward when it claimed the agent is the filesystem. The filesystem holds memory. The phases discipline what the agent does with it. The two ideas only fully resolve when you see them together.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design?

Next.

---

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Always-On Digital Cortex](05-the-always-on-digital-cortex.html) — the always-on plugins and the CLAUDE.md hierarchy as information bus.*
*Next: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*
