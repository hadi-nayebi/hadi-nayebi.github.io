---
title: "Phasic Foundation"
date: "May 2026"
slug: "phasic-foundation"
read_time: "10 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: draft
version: v0.2.2
audience: "Tier 2"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# Phasic Foundation

*Essay 6.1 — The Markov Phasic Brain, Part 1 of 10. Essay 6 opens here; Parts 2 through 10 follow.*

---

Now we open the cycle.

[Essay 5](../b5/05_1-the-two-layer-foundation.html) introduced two pieces of the seed agent's foundation, side by side. The **always-on plugins** are the agent's reflexes — each one owns a concern that fires regardless of which phase the agent is in or whether a phase is even active: plugin edit safety, context window discipline, job lifecycle, interaction legibility, structured questioning. They run continuously, each in its own lane, with its own state. The **CLAUDE.md layer** is the substrate the agent's structured cognitive work writes into — a hierarchy of CLAUDE.md files, a knowledge directory, a memory layer that survives across phases and sessions. *[ref: always-on-fires-no-phase-guard | .claude/settings.local.json PreToolUse block registering plugin_integrity, job_core, interaction_summary, phasic_system hooks | The PreToolUse block registers always-on plugin hooks (plugin_integrity, job_core, interaction_summary) on tool matchers with no phase filtering; phasic_system's phase-gate registers alongside them, plumbing phase enforcement separately.]*

This essay opens the system that does the structured work — the phasic system — and how it uses the CLAUDE.md layer to think ahead, gather experiential data, and process that data into the agent's longer-term memory forms.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely. *[ref: phase-order-fixed-by-map | .claude/plugins/phasic_system/scripts/phase.sh FORWARD_MAP/BACKWARD_MAP declarations | FORWARD_MAP and BACKWARD_MAP define the only allowed phase transitions as plain associative-array data; arbitrary jumps and blended states are absent from the schema and rejected downstream by the advance command.]*

The current prototype runs the OPEVC cycle (currently five phases in the prototype: *observe, plan, execute, verify, and condense*). OPEVC is the acronym, the name the brain calls its own cycle. The final phase, CONDENSE, plays a different role from the others. The earlier phases do work *on the project*; CONDENSE does work *on the brain*. We call CONDENSE the cycle's cognitive organ for that reason. Still, it sits inside the OPEVC ring, not outside it. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The current phase count is the prototype's answer; the discipline of compartmentalized phasing is the architecture. *[ref: opevc-ring-and-condense-organ | .claude/plugins/phasic_system/scripts/phase.sh FORWARD_MAP + root CLAUDE.md "Core Phases (OPEVC)" section | FORWARD_MAP encodes the ring `idle:observe observe:plan plan:execute plan:verify execute:verify verify:condense condense:idle` as plain data — the cycle is one config line, swappable per seed. The root CLAUDE.md "Core Phases (OPEVC)" section names CONDENSE as the "OPEVC organ" that does work on the brain rather than on the project.]*

Two states travelled with us across the previous essay without being named: *idle* and *gmode*. We left them out of Essay 5 to keep the substrate description clean. They come back now, because the full Markov brain does not run without them. *[ref: idle-is-default-current-phase | .claude/plugins/phasic_system/scripts/phase.sh job-init handler (current_phase=idle write) | Job initialization writes current_phase: idle into the orchestrator's data.json; idle is the resting state between cycles. Gmode is the other off-cycle state — handlers further down the same file treat it as a peer current_phase value.]*

What we are about to open is what [Essay 3.1](../b3/03_1-the-folder-is-alive.html) called the agent's *cognitive metabolism* — the rhythm of breathing in context, working on it, breathing out memory. The phasic layer is that metabolism made mechanical.

This essay opens that discipline compartment by compartment.

## The journey ahead

Essay 6 unfolds across short parts:

- **Essay 6.1 — Phasic Foundation** *(you are here)* — the cognitive cycle and why phases at all
- [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the per-phase tool restrictions
- [Essay 6.3 — OBSERVE — Read Wide, Write Once](06_3-observe.html) — the read-only sweep that grounds every cycle
- [Essay 6.4 — PLAN — Decide, Then Lock](06_4-plan.html) — the analysis phase whose deliverable is a named contract
- [Essay 6.5 — EXECUTE — Build, in Scope, in Steps](06_5-execute.html) — the only phase with project-write access, fenced by the altered list
- [Essay 6.6 — VERIFY — Independent Eyes](06_6-verify.html) — scripts-only, auditor-driven, backward-routed
- [Essay 6.7 — CONDENSE — The Cognitive Organ](06_7-condense.html) — the 7-step waterfall that grows the brain
- [Essay 6.8 — The Rhythm of Work](06_8-inverse-multiplier.html) — the count-based rhythm inside every phase, and the exit gate that opens each boundary
- [Essay 6.9 — GMODE — The Off-Cycle Lane](06_9-gmode.html) — the documented escape hatch
- [Essay 6.10 — The Plan File — Long-Horizon Memory](06_10-plan-state-machine.html) — how multi-cycle jobs accumulate plan + .yaml memory over time

Essay 6.2 maps the discipline; Essays 6.3 through 6.7 deep-dive each phase, one per essay. Essays 6.8 through 6.10 are for the architects in the audience — the mechanisms that let the cycle stay honest across long horizons.

---

## From Action Space to Markov Brain

In [Essay 1](../b1/01-llms-are-not-the-agents.html) we drew the seed agent's starting condition as an **action space** — the set of moves a CLI agent can pick at any given moment. Use deep reasoning. Use tools — read, write, edit, run. Ask for permission. Delegate to another agent. Stop. Each step the LLM samples from those moves probabilistically. The next step samples again. The result, without further structure, is what that essay called a **random walk** — a Markov chain where every path is equally likely, and the same prompt twice can produce two different journeys. *[ref: action-space-tool-filter | .claude/plugins/phasic_system/hooks/phase-gate.sh "Tool Filter" section | The orchestrator's tool filter enumerates the seed agent's intercepted action space: Edit, Write, MultiEdit, Read, Glob, Grep, Bash, WebSearch, WebFetch. Other tools pass through unguarded.]*

Then we added the first layer of structure: hooks. Hooks fire on every tool call, every stop, every prompt. They can block an action, modify it, or trigger another. In Essay 1's framing, hooks turn the **probabilistic chain into a deterministic pipeline**. The LLM still proposes the next move; the hooks decide whether the move is allowed. *[ref: hooks-block-via-exit-two | .claude/plugins/phasic_system/hooks/phase-gate.sh "IDLE Enforcement" → "Read Block" | phase-gate intercepts Read/Glob/Grep tool calls during idle, emits a stderr message, and exits with code 2 — the canonical block pattern that converts a proposed move into a refusal.]*

The phasic layer takes that idea one fractal step further.

A phase is a flavor of the action space. Inside OBSERVE, the action space is narrowed — write tools to project files are gone, only the read-and-synthesize moves are available. Inside EXECUTE, the action space widens for the altered list and tightens elsewhere. Each phase is a *customized Markov chain* — its own restricted action space, its own hook-enforced rules, its own bias toward the kind of move that phase wants to encourage. *[ref: observe-blocks-non-claude-writes | .claude/plugins/phase_observe/hooks/observe-guard.sh — the Edit|Write arm that calls block "tool-restriction-non-claude" | OBSERVE's Edit|Write case arm allows memory and CLAUDE.md edits with conditions but blocks every other path with tool-restriction-non-claude — the asymmetric write scope that narrows OBSERVE's action space to synthesis only.]*

The cycle on top is itself a Markov chain — but its "actions" are not individual tool calls. Its actions are the phases. The agent moves between phases. Each move from one phase to the next obeys gates and edges declared by the orchestrator plugin. **A Markov brain whose moves are themselves Markov chains.** Fractal, by design. *[ref: phase-transition-gates | .claude/context/opevc-phases.md "FORWARD_MAP" + "Phase commit shape" | Forward hops are validated against the FORWARD_MAP declaration in phase.sh — any transition not in the map is rejected. Each phase's `--force` advance commit is gated by its required `## `-section shape, the three-family exit gate (reflection commands, new marked notes, a reflector receipt), and per-phase custom gates; falling short blocks the advance with a coaching voice naming the gap.]*

This is what the title points at. The phasic brain is Markov on two levels. Inside any phase, the agent's tool calls are a constrained action-space chain. Across the cycle, the phases themselves are a state machine with declared edges and no hidden continuation. *[ref: phase-state-machine-as-data | .claude/plugins/phasic_system/scripts/phase.sh FORWARD_MAP + BACKWARD_MAP variable declarations | The two map strings enumerate the entire state machine — forward edges (`idle:observe`, `observe:plan`, ...) and the backward edges allowed from each non-idle phase. No edge outside the maps is reachable; the cycle is a data declaration, not a flow scattered across handlers.]*

![The OPEVC cycle. Forward edges (white) advance when all phase gates clear. Backward edges (brown) are explicit recovery choices. Idle holds the agent between cycles; condense returns to idle.](../assets/images/blog/opevc-cycle-blackboard.png)

---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression. *[ref: idle-blocked-activities-as-pattern-example | .claude/plugins/phasic_system/CLAUDE.md, "Idle — Blocked Activities" section | The "Idle — Blocked Activities" table in phasic_system/CLAUDE.md illustrates the per-phase tool-restriction pattern via the idle case — Read/Glob/Grep, Edit/Write, Bash, Agent, WebSearch rows specify which tools idle blocks. The same per-phase block/allow pattern is implemented in code across the 5 phase-guard scripts (observe-guard.sh, plan-guard.sh, execute-guard.sh, verify-guard.sh, condense-guard.sh) — each guard's tool-restriction block is the per-phase instance of this pattern.]*

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another. *[ref: commit-precedes-phase-advance | .claude/plugins/phase_observe/scripts/observe-commit.sh "Commit Execution and Metadata" section | Records each phase's work as a git commit with phase prefix and footer; on commit failure exits 1, blocking the downstream phase.sh advance that would otherwise unlock the next phase.]*

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

A handful of mechanisms inside the cycle deserve a brief mention here before the next essays open them. Inside every phase runs a paced *rhythm*: a paired min-max gate forces the agent to read before it writes, and to synthesize before it reads more — counted per activity class against the working CLAUDE.md, where a CLAUDE.md update resets the count and the rhythm begins again. There is no score and no number for the agent to chase; the pacing is tool-call counts and structural gates. *[ref: min-max-rhythm-brief | .claude/context/opevc-rhythm.md "Min-max gate" | The pair of intra-phase gates enforced by the phase guard on the actions-since-synthesis counter: the min-gate blocks a CLAUDE.md write until enough investigative actions accrue; the max-gate blocks further investigative tools at the ceiling. Counted per activity class with ONE reset event — a CLAUDE.md update clears all class counters at once. No point currency, no score; the rhythm counts tool calls.]*

And the boundary out of a phase opens on *reflection*, not volume: the three-family exit gate asks for evidence the phase examined its own work — reflection commands ran, new marked notes were left for CONDENSE, a reflector subagent left its receipt — before the cycle moves on. The agent never hears about counters in any voice or injection; coaching stays qualitative, speaking the language of the work. [Essay 6.8](06_8-inverse-multiplier.html) opens both mechanisms in full. *[ref: three-family-gate-brief | .claude/context/opevc-metacog.md "Three-family exit gate" | The per-phase advance filter: (a) reflection commands updated the compaction file, (b) NEW marked notes added to the working CLAUDE.md (soft), (c) ≥1 of the phase's available reflector subagents ran. Minimums are variable, drawn from a set per phase entry via the same random-from-pool selection the coaching voices use.]*

Separately, every phase carries its own *direct-action budget*, an independent meter that tracks the ratio of direct file work versus subagent delegation and uses that ratio to inject voices or block actions. *[ref: direct-action-budget-meter | .claude/plugins/phase_observe/hooks/observe-guard.sh `direct_action_budget_remaining` + `has_direct_action_budget` helpers + observe-tracker.sh grant-on-subagent-dispatch arm | The guard's `has_direct_action_budget` helper short-circuits direct Reads when the per-job remaining budget hits zero (`block "direct-action-budget-blocked"`). The tracker grants +N budget per observe-* subagent launch — mechanizing the 80/20 delegation rule as a meter rather than a coaching nudge.]*

Job-graph mutations follow a *lifecycle-symmetry* rule — the phase that adds graph state is rarely the phase that removes it, because the right context for each operation lives in a different cognitive posture. *[ref: lifecycle-symmetry-add-vs-remove | .claude/plugins/phase_condense/hooks/condense-guard.sh "Tool Enforcement" section allows `add-dependency` + .claude/plugins/phase_verify/hooks/verify-guard.sh "Tool Enforcement" section allows `remove-dependency` only | CONDENSE owns `add-dependency` (cycle-wide synthesis context for what follow-ups matter); VERIFY owns `remove-dependency` (audit context for whether a declared dep turned out unnecessary). The verify-guard explicitly blocks `create / create-dependent / add-dependency` to seal the asymmetry.]* We name each mechanism here so the later essays can use the labels; their machinery opens one by one.

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>The whole skeleton, walkable.</strong> The cycle, the two transition maps, the conductor and its five self-guarding musicians, the rule that lets thinking grant the right to write, and the fractal Markov framing &mdash; laid out as an interactive concept-deck. Walk one idea per card; click any box for the live code behind it.</span>
  <a href="explore/phasic-cycle.html" title="Walk the phasic brain as an interactive concept-deck" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the phasic brain</a>
</aside>
<!-- /RAW_HTML -->

## What you would customize

The phasic layer is the most opinionated piece of the prototype, and almost every dimension of it is a customization surface. The architecture is the shape; the specific dials are the prototype's answers.

The architect would tune the *phase count*. The prototype's phase set — currently observe, plan, execute, verify, condense — covers the work of designing the seed agent itself. A seed working on long literature reviews might want a `research` phase between observe and plan, where deep external reading happens with a different budget arithmetic than observe's broad sweep. A seed working in regulated drafting might split execute into `execute` and `integrate`. The phase count is a knob; the discipline of compartmentalization is the floor. *[ref: phase-count-is-data-not-code | .claude/plugins/phasic_system/scripts/phase.sh FORWARD_MAP + BACKWARD_MAP variable declarations | The cycle is declared as two space-separated strings of `from:to` pairs; adding a phase means editing the string and adding the matching guard script. Nothing in the orchestrator is wired to a fixed phase count.]*

The architect would tune the *acronym itself*. OPEVC is the prototype's name for its cycle. A custom seed could call it RUNS, OPERATE, or any other word that catches the kinds of cognitive work it values. The name shapes how the architect talks to their own seed; the talk shapes how the seed sees the work. *[ref: opevc-name-lives-in-brain-and-voices | root CLAUDE.md "Core Phases (OPEVC)" section + per-phase voice.xml `phase_<name>.*` voice IDs | The OPEVC acronym appears in the brain (root CLAUDE.md section headings + identity files) and as the `[phase_<name>]` prefix on every coaching voice. Renaming the cycle means a brain-doc rewrite plus a voice-ID sweep — surfaces, not deep wiring.]*

The architect would tune the *tool-restriction granularity*. The prototype publishes one guard per phase, each one with its own allow-and-block list of tools. The same architecture supports finer grain — per-phase block-lists scoped by subagent type, allow-lists conditioned on the focused job's form, time-of-day rules for long-running research seeds. The guards are code; the granularity is what each architect's work demands. *[ref: one-guard-per-phase-pattern | .claude/plugins/phase_observe/hooks/observe-guard.sh + plan-guard.sh + execute-guard.sh + verify-guard.sh + condense-guard.sh | The repository ships a guard script per phase, each owning its own allow/block case statement over tool names. Adding finer dispatch (subagent-type, job-form, time-of-day) means extending the case arms inside the guard — the per-phase script is the customization surface.]*

What the architect would **not** customize is the principle that each phase publishes its restrictions ahead of time and the guard enforces them. The principle is the floor: a phase that doesn't fence the agent in is not a phase, it is a label. *[ref: phase-restriction-published-by-guard | .claude/plugins/phasic_system/hooks/phase-gate.sh "Tool Filter" section + the per-phase guards (observe-guard.sh / plan-guard.sh / execute-guard.sh / verify-guard.sh / condense-guard.sh) | The orchestrator's phase-gate intercepts the productive-tool set and exits with code 2 (the canonical block pattern) when the current phase's guard refuses. The per-phase guard files declare what each phase allows; together they make the restriction set publicly inspectable rather than buried in handler logic.]*

The shape lifts cleanly off this prototype. A research lab's seed could run literature-review jobs through `read-source`, `extract-claim`, `cross-check`, and `synthesize` phases — each with its own tool fence, writes forbidden during `read-source`, new sources forbidden during `synthesize`. A consulting seed could split client engagements into `intake`, `match`, `scope`, `draft-deliverable`, and `review`, with the drafting phase locked out of the client-source-data tools so it cannot improvise new facts mid-prose. The phasic cycle is the architecture; the phase names and the tool fences are yours. The honest limit is that the guards stop wrong-tool calls; they cannot stop a creative operator from working around the spirit of a phase in their prose. The discipline rests on the architect reading the injected voice and choosing to obey it. [Gmode](06_9-gmode.html) is the documented escape hatch when working around the discipline is the right move. *[ref: gmode-as-documented-escape-hatch | .claude/plugins/phasic_system/hooks/gmode-hook.sh `[GMODE]` filter + root CLAUDE.md "Identity" section fact #2 | The gmode hook accepts `[GMODE] <reason>` AskUserQuestion submissions and, on user approval, calls `phase.sh enter-gmode` — switching `current_phase` to `gmode`, the one state where per-phase guards short-circuit out. Root CLAUDE.md names this as the deliberate maintenance lane requiring a ≥100-word justification.]*

---

The foundation is in place: a Markov brain whose moves are themselves Markov chains, phases as the structural answer to mixed-mode cognition. The next essay maps every edge of the cycle — the full transition graph, the discipline the per-phase tool restrictions enforce, and a quick map of what each phase produces before we open the compartments one at a time.

---

*Essay 6.1 — The Markov Phasic Brain, Part 1 of 10.*

*Previous: [Essay 5.9 — The Customization Guardrail](../b5/05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted.*
*Next: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the tool-restriction pedagogy.*




