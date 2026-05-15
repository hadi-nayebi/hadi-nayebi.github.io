---
title: "Phasic Foundation"
date: "May 2026"
slug: "phasic-foundation"
read_time: "7 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# Phasic Foundation

*Essay 6.1 of 10 — The Markov Phasic Brain. Essay 6 opens here; Essays 6.2 through 6.10 follow.*

---

Now we open the cycle.

[Essay 5](05_1-the-two-layer-foundation.html) introduced two pieces of the seed agent's foundation, side by side. The **always-on plugins** are the agent's reflexes — each one owns a concern that fires regardless of which phase the agent is in or whether a phase is even active: plugin edit safety, context window discipline, job lifecycle, interaction legibility, structured questioning. They run continuously, each in its own lane, with its own state. The **CLAUDE.md layer** is the substrate the agent's structured cognitive work writes into — a hierarchy of CLAUDE.md files, a knowledge directory, a memory layer that survives across phases and sessions. *[ref: always-on-fires-no-phase-guard | settings.json.template:17-47 | The PreToolUse block registers plugin_integrity and job_core hooks on tool matchers with no phase filtering; phasic_system's phase-gate registers alongside them, plumbing phase enforcement separately.]*

This essay opens the system that does the structured work — the phasic system — and how it uses the CLAUDE.md layer to think ahead, gather experiential data, and process that data into the agent's longer-term memory forms.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely. *[ref: phase-order-fixed-by-map | phasic_system/scripts/phase.sh:133-136 | FORWARD_MAP and BACKWARD_MAP define the only allowed phase transitions; arbitrary jumps and blended states are absent from the schema and rejected downstream by the advance command.]*

The current prototype runs five OPEVC phases: *observe, plan, execute, verify, and condense*. OPEVC is the acronym, the name the brain calls its own cycle. The final phase, CONDENSE, plays a different role from the other four. The first four do work *on the project*; CONDENSE does work *on the brain*. We call CONDENSE the cycle's cognitive organ for that reason. Still, it sits inside the OPEVC ring, not outside it. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The current phase count is the prototype's answer; the discipline of compartmentalized phasing is the architecture.

Two states travelled with us across the previous essay without being named: *idle* and *gmode*. We left them out of Essay 5 to keep the substrate description clean. They come back now, because the full Markov brain does not run without them. *[ref: idle-is-default-current-phase | phasic_system/scripts/phase.sh:155-161 | Job initialization writes current_phase: idle into the orchestrator's data.json; idle is the resting state between cycles. Gmode is the other off-cycle state — handlers further down the same file treat it as a peer current_phase value.]*

What we are about to open is what [Essay 3.1](03_1-the-folder-is-alive.html) called the agent's *cognitive metabolism* — the rhythm of breathing in context, working on it, breathing out memory. The phasic layer is that metabolism made mechanical.

This essay opens that discipline compartment by compartment.

---

## From Action Space to Markov Brain

In [Essay 1](01-llms-are-not-the-agents.html) we drew the seed agent's starting condition as an **action space** — the set of moves a CLI agent can pick at any given moment. Use deep reasoning. Use tools — read, write, edit, run. Ask for permission. Delegate to another agent. Stop. Each step the LLM samples from those moves probabilistically. The next step samples again. The result, without further structure, is what that essay called a **random walk** — a Markov chain where every path is equally likely, and the same prompt twice can produce two different journeys. *[ref: action-space-tool-filter | phasic_system/hooks/phase-gate.sh:45-48 | The orchestrator's tool filter enumerates the seed agent's intercepted action space: Edit, Write, MultiEdit, Read, Glob, Grep, Bash, WebSearch, WebFetch. Other tools pass through unguarded.]*

Then we added the first layer of structure: hooks. Hooks fire on every tool call, every stop, every prompt. They can block an action, modify it, or trigger another. In Essay 1's framing, hooks turn the **probabilistic chain into a deterministic pipeline**. The LLM still proposes the next move; the hooks decide whether the move is allowed. *[ref: hooks-block-via-exit-two | phasic_system/hooks/phase-gate.sh:68-71 | phase-gate intercepts Read/Glob/Grep tool calls during idle, emits a stderr message, and exits with code 2 — the canonical block pattern that converts a proposed move into a refusal.]*

The phasic layer takes that idea one fractal step further.

A phase is a flavor of the action space. Inside OBSERVE, the action space is narrowed — write tools to project files are gone, only the read-and-synthesize moves are available. Inside EXECUTE, the action space widens for the altered list and tightens elsewhere. Each phase is a *customized Markov chain* — its own restricted action space, its own hook-enforced rules, its own bias toward the kind of move that phase wants to encourage. *[ref: observe-blocks-non-claude-writes | phase_observe/hooks/observe-guard.sh:274-324 | OBSERVE's Edit|Write case arm allows memory and CLAUDE.md edits with conditions but blocks every other path with tool-restriction-non-claude — the asymmetric write scope that narrows OBSERVE's action space to synthesis only.]*

The cycle on top is itself a Markov chain — but its "actions" are not individual tool calls. Its actions are the phases. The agent moves between phases. Each move from one phase to the next obeys gates and edges declared by the orchestrator plugin. **A Markov brain whose moves are themselves Markov chains.** Fractal, by design. *[ref: phase-transition-points-gate | phase_verify/scripts/verify-commit.sh:150-157 | Each phase commit script gates the forward edge on a point threshold (VERIFY requires ≥100 PHASE_TRANSITION_POINTS); falling short emits a block voice and exits without calling phase.sh advance.]*

This is what the title points at. The phasic brain is Markov on two levels. Inside any phase, the agent's tool calls are a constrained action-space chain. Across the cycle, the phases themselves are a state machine with declared edges and no hidden continuation.

![The OPEVC cycle. Forward edges (white) advance automatically. Backward edges (brown) are explicit choices. Idle holds the agent between cycles; condense returns to idle.](../assets/images/blog/opevc-cycle-blackboard.png)

---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression. *[ref: per-phase-tool-allowances-table | phasic_system/CLAUDE.md:254-260 | Side-by-side table of each phase's distinct concerns: OBSERVE checks CLAUDE.md-only edits; PLAN forbids bash/web; EXECUTE allows altered-dir writes; VERIFY allows scripts and plan-file edits; CONDENSE writes .md only.]*

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another. *[ref: commit-precedes-phase-advance | phase_observe/scripts/observe-commit.sh:279-288 | Records each phase's work as a git commit with phase prefix and footer; on commit failure exits 1, blocking the downstream phase.sh advance that would otherwise unlock the next phase.]*

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

A handful of mechanisms inside the cycle deserve a single sentence here before the next sub-essays open them. Every phase entry locks every tool until the agent sets a *multiplier* — a backward-counted scalar that captures the agent's scope forecast for the phase. Every phase carries its own *direct-action budget*, a small pool that meters how much file work the main session does directly versus how much it delegates to subagents. CONDENSE carries a *fix-in-cycle* gate that refuses to close the cycle until bugs introduced in this very cycle are repaired first. Job-graph mutations follow a *lifecycle-symmetry* rule — the phase that adds graph state is rarely the phase that removes it, because the right context for each operation lives in a different cognitive posture. We name each mechanism here so the sub-essays can use the labels; their machinery opens one by one.

## What you would customize

The phasic layer is the most opinionated piece of the prototype, and almost every dimension of it is a customization surface. The architecture is the shape; the specific dials are the prototype's answers.

The architect would tune the *phase count*. The current five (observe, plan, execute, verify, condense) cover the prototype's own work — designing the seed agent itself. A seed working on long literature reviews might want a `research` phase between observe and plan, where deep external reading happens with a different budget arithmetic than observe's broad sweep. A seed working in regulated drafting might split execute into `execute` and `integrate`. The phase count is a knob; the discipline of compartmentalization is the floor.

The architect would tune the *acronym itself*. OPEVC is the prototype's name for its cycle. A custom seed could call it RUNS, OPERATE, or any other word that catches the kinds of cognitive work it values. The name shapes how the architect talks to their own seed; the talk shapes how the seed sees the work.

The architect would tune the *tool-restriction granularity*. The prototype publishes one guard per phase, each one with its own allow-and-block list of tools. The same architecture supports finer grain — per-phase block-lists scoped by subagent type, allow-lists conditioned on the focused job's form, time-of-day rules for long-running research seeds. The guards are code; the granularity is what each architect's work demands.

What the architect would **not** customize is the principle that each phase publishes its restrictions ahead of time and the guard enforces them. The principle is the floor: a phase that doesn't fence the agent in is not a phase, it is a label.

---

The foundation is in place: a Markov brain whose moves are themselves Markov chains, phases as the structural answer to mixed-mode cognition. The next sub-essay maps every edge of the cycle — the full transition graph, the discipline the per-phase tool restrictions enforce, and a quick map of what each phase produces before we open the compartments one at a time.

---

*Essay 6.1 of 10 — The Markov Phasic Brain.*

*Previous: [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted.*
*Next: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the tool-restriction pedagogy.*




