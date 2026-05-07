---
title: "The Markov Phasic Brain"
date: "May 2026"
slug: "the-markov-phasic-brain"
read_time: "TBD"
tags: [Architecture, Seed Agent, OPEVC, Phases, CONDENSE]
status: draft
version: v0.10.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# The Markov Phasic Brain

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

---

The bus from [Essay 5](05-the-single-concern-digital-cortex.html) is substrate. A hierarchy of CLAUDE.md files plus a knowledge directory plus a memory layer. The always-on plugins protect it. They don't fill it.

This essay is about what fills it — and how.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. Only one phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely.

The current prototype implements five phases plus one cognitive organ: **observe, plan, execute, verify, and condense**. The acronym, OPEVC, is what the brain calls the cycle. The architecture supports adding more — a custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The five-phase shape is the prototype, not the law. The discipline of compartmentalized phasing is the law.

This essay opens that compartment by compartment.

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

Forbidding tools is not a limitation. It is the pedagogy.

When OBSERVE is read-only, the agent is forced to gather context before it can act. There is no escape into "let me just patch this real quick" — the patch tool isn't available. When PLAN is read-only, the plan must commit fully to a written contract before EXECUTE can begin; the alternative isn't there. When VERIFY can only run scripts, self-verification through "the code looks fine to me" is impossible — only what the scripts say counts. When CONDENSE can only touch `.claude/`, project work is structurally fenced off; the agent can't sneak a feature in under the cover of consolidation.

Enforcement is layered. A global `phase-gate.sh` registered by `phasic_system` fires on every `PreToolUse` and refuses to let the agent mutate anything while the job is in idle — that is the only thing the global gate does. Once a phase is active, the global gate exits silently and each per-phase guard takes over: `observe-guard.sh`, `plan-guard.sh`, `execute-guard.sh`, `verify-guard.sh`, `condense-guard.sh`. Every guard is registered unconditionally and self-exits in milliseconds if the focused job's current phase doesn't match its own; only the guard for the active phase does real work. Each guard inspects every `Edit`, `Write`, and `MultiEdit` call against an allowlist, and on top of that consults a shared `section-check.sh` library to ensure the edit doesn't cross a phase-section boundary inside any CLAUDE.md — `---Ob---` is a physical barrier the EXECUTE guard refuses to overwrite, and the OBSERVE guard refuses to write past `---Ex---`. The markers are not decoration; they are the structural manifestation of compartmentalization. The agent can lose the argument with the user, or with itself, but it can't lose it with the guard — the guard is code.

The result is that each phase produces its own kind of artifact. OBSERVE produces working memory. PLAN produces a plan document. EXECUTE produces code changes (and execution notes in CLAUDE.md). VERIFY produces pass/fail results. CONDENSE produces a clean working memory and durable knowledge files.

Every phase has its own plugin. The current prototype runs `phase_observe`, `phase_plan`, `phase_execute`, `phase_verify`, and `phase_condense`, plus a separate `phasic_system` plugin that orchestrates which phase is currently active for which job. Six plugins total, in this prototype. As with the always-on layer, the count is the prototype, not the architecture. A custom seed adding a sixth phase would add a seventh plugin alongside the orchestrator.

---

## OBSERVE — Read Wide, Write Once

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context.

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation.

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content. That single restriction, more than anything else, is what forces observation to actually happen — there is no escape into action.

OBSERVE is also where two of the most distinctive seed-agent mechanisms live.

The first is the **multiplier sentinel**. Every phase, on entry, has a *multiplier* that is initially zero. Tools are locked until the agent sets it. The setter is a small CLI command — for OBSERVE, `observe.sh set-multiplier <job-id> <value>` — where the value is one of `0.5`, `1`, `1.5`, `2`, `2.5`, `3`. Once set, the multiplier cannot be changed for that phase entry. The same pattern applies to every other phase (`plan.sh set-multiplier`, `execute.sh set-multiplier`, and so on). We come back to what the multiplier *means* in the tier-3 close — it is more interesting than it looks.

The second is the **point system**. Inside the phase, every tool call earns points on a fixed schedule. In OBSERVE, a CLAUDE.md edit earns ten points (synthesis is the most valuable action), launching a research subagent earns seven, an `AskUserQuestion` earns five, a `WebSearch` or `WebFetch` earns four, a file read earns three, a `Glob` earns one. Two intermediate gates fire inside the phase: a *minimum-synthesis* gate that blocks CLAUDE.md edits until the agent has earned at least five points (you have to read before you can write), and a *maximum-accumulation* gate that blocks point-earning tools at twenty-five accumulated points and forces the agent to synthesize before continuing to gather. The phase cannot be exited until a hundred total points have been crossed. The points are what tell the system "enough observation has happened to justify advancing to plan."

OBSERVE also dispatches its share of subagents. A typical OBSERVE phase will fan out two to four research subagents in parallel, each pursuing a different question, each returning a structured synthesis. The main session orchestrates; the subagents investigate. (The 80/20 split between main-session and subagents — and why the architecture insists on it — is the subject of [Essay 7](07-the-plugin-kit.html).)

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent.

---

## PLAN — Decide, Then Lock

PLAN is also read-only against project files. The agent can still read whatever it needs, but writes are still confined to CLAUDE.md, plus one optional new file: the plan document itself.

The first thing the agent does on entering PLAN, after the multiplier, is decide whether the job needs a plan file at all. The CLI command is `plan.sh set-plan-file <job-id> <value>` and the value is either `false` (this is a single-cycle job, no plan document, the contract lives in the working CLAUDE.md), or a name like `plan_<slug>.md` (this is a multi-cycle job, EXECUTE will create the document, VERIFY will edit it, and future PLAN cycles will read it back as a long-term contract). The decision is made once, in cycle 1, and locks for the remainder of the job. Plan documents live at a known path inside `.claude/knowledge/plans/`. Their structure is opinionated: a stated goal, a list of acceptance criteria, a list of directories that EXECUTE will be allowed to touch (the *altered list*), and an explicit set of judgment-call criteria — points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe.

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE.

This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check. If EXECUTE wants to touch a file the plan didn't list, the request is blocked — and the agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

The reason the plan is locked is the reason every project rationalizes mid-execution. Plans written *during* execution are not plans; they are post-hoc explanations for whatever the executor felt like doing. By forcing the plan to be authored before any code is touched, the seed agent forecloses that drift. The plan can be wrong — that is what VERIFY is for, and that is what backward transitions are for — but it cannot be silently rewritten.

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate.

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

## EXECUTE — Build, in Scope, in Steps

EXECUTE is where code gets written. The write-tool guard is gentler here, but only inside the altered list. Every other path is blocked.

The altered list is a frozen snapshot of directories, captured from OBSERVE and PLAN at phase entry. A `PreToolUse` guard (`execute-guard.sh`) inspects every `Edit`, `Write`, and `MultiEdit` call against that snapshot before the call lands. A path inside the snapshot proceeds. A path outside is rejected, and the agent has to either roll back to PLAN to amend the contract or accept the fence. There is a second guard inside the same hook that protects the four section markers in any CLAUDE.md — `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` — so that EXECUTE writes execution notes inside its own footer section but cannot overwrite what the prior phases wrote.

The phase is structured around *checkpoints* — short, focused commits that finish one piece of the plan before starting the next. The pattern is deliberate. A long uncommitted run inside EXECUTE has the same problem as a long run anywhere else: drift accumulates, and a failure halfway through erases everything. Checkpointing forces small wins. It also gives the agent a clean place to pause and notice when the plan is wrong, before sinking another ten tool calls into the wrong direction.

EXECUTE writes two things: the code, and *execution notes* in the working CLAUDE.md. The notes are short — what surprised the agent, what decisions the agent made when the plan left a judgment call open, what the next phase should know. The notes are what turn a sequence of commits into a coherent narrative. They will be one of the things CONDENSE absorbs.

EXECUTE is also where subagent dispatch shows up most heavily, and the point schedule encodes that explicitly. Each execute-* subagent the main session launches grants the session three extra points of *direct-action budget*; each non-`.claude/` file the main session reads consumes one. The arithmetic is small but the bias is intentional: the main session is incentivized to delegate parallel implementation to subagents and to keep its own context window clean, rather than reading every file itself. A typical execute phase will spawn one or two execute-* subagents on file edits while the main session works on the spine of the change.

When EXECUTE believes the plan is implemented, it commits the final checkpoint and the orchestrator advances the job to VERIFY.

---

## VERIFY — Independent Eyes

VERIFY is scripts-only.

The agent cannot edit code in VERIFY. It can read anything (the broadest read scope of any phase, by design). It can run tests. It can run validators. It can dispatch *auditor* subagents — `verify-*` subagents whose entire job is to read the executed work and report whether each acceptance criterion holds. The current prototype ships five of them, each scoped to one slice of the cycle. `verify-observe-auditor` re-walks the working memory the OBSERVE phase produced and asks whether the planning was actually grounded in it. `verify-plan-auditor` reads the plan against the executed change and asks whether each acceptance criterion was met. `verify-execute-auditor` reads the diff and asks whether the change is internally consistent. `verify-git-historian` walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. `verify-code-evolution-tracker` looks at how files changed over the cycle and surfaces patterns the executor may not have noticed. Every auditor is read-only. None of them are allowed to fix what they find — they only report.

The reason VERIFY is its own phase is the same reason a compiler is not the same process as the programmer. Self-verification is biased. The hand that built the code wants to see the code as correct. A separate phase, with separate tools, run by a separate cognitive posture (and frequently delegated to subagents for independence), gives the verification an honest chance to catch what execution missed.

VERIFY produces a structured pass/fail report against the plan's acceptance criteria. The report goes into the plan document and into the working CLAUDE.md. Three outcomes are possible.

If everything passes, the orchestrator advances the job to CONDENSE.

If something minor fails — a typo, a missed import, a comment that wasn't updated — VERIFY can transition backward to EXECUTE, which gets a chance to fix the small thing and re-checkpoint. The plan is not amended; only the implementation is corrected.

If something major fails — an acceptance criterion that the plan can't meet, a discovery that the observation was incomplete — VERIFY transitions backward all the way to OBSERVE or PLAN. The orchestrator records the rollback as part of the job's history. The cycle restarts with the lesson learned.

This is why the phasic layer is a *Markov* brain. Forward transitions are automatic when the gate criteria are met; backward transitions are explicit. The state of the cycle is fully determined by the current phase, the multiplier set on entry, and the point counter. There is no hidden continuation. Any phase can be re-entered, but only by rolling back along defined edges.

When VERIFY passes, the orchestrator advances the job to CONDENSE.

---

## CONDENSE — The Cognitive Organ

CONDENSE is not a peer of the other phases. It is a different kind of thing.

The other phases produce work *on the project*. CONDENSE produces work *on the brain*. Its write scope is `.claude/` plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced — the gathered context, the plan document, the execution notes, the verification results — and route the durable parts to where they will be useful in the next cycle.

That routing is structured as a strict seven-step waterfall.

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the four phase markers — `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`. The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the *frozen* altered-list snapshot captured at phase entry and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step — a paragraph tagged `[DURABLE]` is absorbed into the body by default, a paragraph tagged `[EPHEMERAL]` is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: in one of the prototype's cycles, a single plugin's `tests/CLAUDE.md` shrank from 2318 footer words to 521 in this step alone, a 78% absorption.

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a `condense-claude-md-mover` subagent — armed with `Read`, `Edit`, and `Write` but deliberately denied `Bash` and knowledge-creation tools — to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away.

3. **`[PENDING-JOB]` markers.** During the cycle, a phase may have written `` `[PENDING-JOB]` `` into a footer to flag that follow-up work needs a separate job. Step three reads those markers and creates the dependent jobs, then removes the marker.

4. **`[VOICE-UPDATE]` markers.** A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. Step four edits `voice.xml` accordingly and removes the marker.

5. **`[AGENT-UPDATE]` markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker.

6. **`[KNOWLEDGE]` markers.** This is the most important step. A phase may have written `` `[KNOWLEDGE] topic/slug` `` (backticks deliberate, so `grep` can find the marker without false positives from prose) to flag a finding that should be promoted to long-term memory. Step six dispatches a `condense-knowledge-extractor` subagent — running on a small fast model with only `Read`, `Write`, and `Edit` available — that reads the surrounding paragraph, writes `.claude/knowledge/<topic>/<slug>.md` with a version header, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line: `` ~~`[KNOWLEDGE] topic/slug` CONSUMED <date> Step 6 → <path>~~ ``. The "verify by re-reading" requirement is hardening from a real failure mode the prototype hit: in earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. There is also a pre-flight gate: the plan that authorizes the cycle must include the target `<topic>/CLAUDE.md` in its altered list, otherwise the EXECUTE-phase guard rejects the Write before it can land. The plan must already be expecting the knowledge file. Discipline propagates upstream. This is how the brain *grows*. Cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it.

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a dated session archive. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy.

After all seven steps, CONDENSE checks a *deflation gate*. At condense entry, a sensor hook snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first `---Ob---`/`---Pl---`/`---Ex---`/`---Ve---` anchor — and stores it as the cycle's baseline. At commit time, `condense-commit.sh` re-scans the same files from disk, computes `words_absorbed = baseline − current`, queries `job.sh --hook stage` (which delegates to `plan.sh`'s `plan-file` query) to determine whether the job is single-cycle or multi-cycle, and compares against the appropriate threshold. Single-cycle jobs default to eighty percent absorption (`CONDENSE_DEF_THRESHOLD_STAGE1=80`) — the cycle is final, working memory must compress hard. Multi-cycle jobs default to fifty percent (`CONDENSE_DEF_THRESHOLD_STAGE2=50`) — some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are environment-overridable. Real cycles routinely overshoot: one of the prototype's recent single-cycle jobs ran the deflation from a 6114-word baseline down to 294 words, a 95.2% absorption against an 80% target. If the gate passes, the orchestrator commits the cycle and advances the job to idle. If it fails, the script exits 1 with a coaching voice and CONDENSE has to keep working — the only options are to absorb, route, or compress more, because CONDENSE is *lock-forward only*: there is no backward edge from condense to verify, and no escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense.

CONDENSE is also the only phase that is allowed to edit the brain itself — the root CLAUDE.md, plugin CLAUDE.mds, voice files, subagent definitions. Everywhere else, those files are protected. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified.

The cycle then returns to idle. The next prompt starts a new cycle, and the new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed.

---

## Tier-3 Close: The Multiplier Is Backward

For the architects in the audience: there is one detail in the phasic layer that quietly carries more weight than the rest of the design, and it is the multiplier sentinel.

Recall the setup. On entry to a phase, the agent must set a multiplier between 0.5 and 3.0. Tools are locked until it is set. Once set, it cannot be changed.

The naive expectation is that the multiplier is a *throttle* — higher numbers mean more work, lower numbers mean less. That intuition is exactly backward.

The multiplier multiplies points earned per tool call. The phase's exit gate is a fixed point threshold. Combine those two facts.

The point formula is direct: `adjusted_points = base_points × multiplier`. Each tool call's base reward (a Read earns three, a CLAUDE.md edit ten, an `AskUserQuestion` five, and so on) gets scaled by whatever the agent locked in. The exit gate stays fixed at one hundred points.

A multiplier of `3.0` means each tool call earns three times as many points. The exit gate is reached fast — in practice, around eleven or twelve tool calls. This is *surgical* work — narrow, targeted, fast. A small typo fix, a minor refactor, a lookup-and-edit. Setting the multiplier to 3 declares: "this phase is small. I'm in and out."

A multiplier of `1.0` is the default pace, around thirty actions. A `1.5` lands closer to seventeen. A `0.5` means each tool call earns half as many points; the exit gate takes far longer to reach, somewhere around sixty-seven actions. This is *deep* work — broad observation, careful planning, sweeping execution. A complex feature, a research-heavy investigation, a multi-file refactor. Setting the multiplier to `0.5` declares: "this phase is large. I'm settling in."

The lock is structural. At phase entry, every entry skeleton initializes `multiplier: 0`, and the per-phase guard refuses to let the agent run any tool while the multiplier is zero — the lone exception is a `Bash` call invoking `<phase>.sh set-multiplier` itself. Once the multiplier is set and the first action lands, the entry's points counter goes positive, and the guard refuses to set the multiplier again. The error message is small: *Multiplier can only be set at phase start.* No second chances, no override.

The multiplier, in other words, is the agent's honest forecast of the phase's scope, expressed as a constraint on its own freedom to leave.

This matters because forecast accuracy has real cost in both directions. Forecasting too small (a high multiplier on what turns out to be deep work) means the gate fires before the work is done, and the agent has to re-enter the phase to finish — wasting the original phase commit and producing a fragmented record. Forecasting too large (a low multiplier on what turns out to be surgical work) means the agent does more reading and dispatching than the work merited, burning context and tool budget on padding.

The architecture deliberately makes both directions of error cost something. There is no safe choice. The discipline is to read the job at phase entry — what does the working memory currently show me about scope — and pick the multiplier that matches *this* phase's actual size. Not the cycle's size. Not the job's size. *This phase's* size. The discipline goes further still: the agent is explicitly forbidden from pattern-matching from past phases ("verify is short, observe is deep") because pattern recall is precisely the bias that has burned the prototype before. One real cycle in the prototype's history saw the agent choose `0.5` for a phase that was actually surgical; the exit gate refused to fire eight times before the agent gave up, rolled the phase back, and restarted with `1.5`. There is now a documented catalog of twenty multiplier-related anti-patterns the system explicitly avoids — leaning words in the entry voice, translation rules like "many → low, few → high", phase metaphors that pre-encode scope. The voice is engineered to leave the forecast unmade until the agent makes it.

The multiplier is therefore the smallest possible commitment device, and the most honest. The agent is not being asked to estimate hours or files or tokens. It is being asked to declare, in a single number, how heavy this phase will be. And then to live with that declaration — not because someone is grading it, but because the gate timing depends on it.

This is the part of the seed agent's design that I find most quietly elegant. A scalar between 0.5 and 3 carries the weight of forecast discipline that most agent architectures don't even attempt to enforce.

---

## What Comes Next

Phases give the agent compartmentalized cognition. The bus from the previous essay gives the agent durable substrate. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How the agent grows new mechanisms — that is what comes apart in the next essay.

The kit, next.

---

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Single-Concern Digital Cortex](05-the-single-concern-digital-cortex.html) — the always-on plugins and the CLAUDE.md hierarchy as information bus.*
*Next: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*
