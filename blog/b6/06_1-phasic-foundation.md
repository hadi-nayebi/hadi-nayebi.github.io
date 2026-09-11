---
title: "Phasic Foundation"
date: "May 15, 2026"
slug: "phasic-foundation"
read_time: "10 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: published
version: v0.3.0
audience: "Tier 2"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# Phasic Foundation

*Essay 6.1 — The Markov Phasic Brain, Part 1 of 13. Essay 6 opens here; Parts 2 through 13 follow.*

---

Now we open the cycle.

[Essay 5](../b5/05_1-the-two-layer-foundation.html) introduced two pieces of the seed agent's foundation, side by side. The **always-on plugins** are the agent's reflexes — each one owns a concern that fires regardless of which phase the agent is in or whether a phase is even active: plugin edit safety, context window discipline, job lifecycle, interaction legibility, structured questioning. They run continuously, each in its own lane, with its own state. The **project-instruction layer** is the substrate the agent's structured cognitive work writes into — a hierarchy of instruction files, a knowledge directory, a memory layer that survives across phases and sessions. In the historical reference architecture, those instruction files are `CLAUDE.md`; other CLI-agent harnesses use their own conventions. *[ref: always-on-fires-no-phase-guard | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

This essay opens the system that does the structured work — the phasic system — and how it uses the project-instruction layer to think ahead, gather experiential data, and process that data into the agent's longer-term memory forms.

Before we take the cycle apart phase by phase, here is the whole thing in motion.

<!-- RAW_HTML -->
<figure style="margin: 2.25rem auto; text-align: center;">
  <video class="seed-video" controls preload="none" poster="../../assets/video/seed-explainer-poster.jpg?v=20260707">
    <source src="../../assets/video/seed-explainer.mp4?v=20260707" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="margin: 0.85rem auto 0; max-width: 760px; font-size: 0.9em; line-height: 1.55; color: rgba(255,255,255,0.75); font-style: italic;">Nine minutes, narrated by the seed in the first person &mdash; what it is, why the harness is yours while the model is rented, and one job walked start to finish through the OPEVC cycle.</figcaption>
</figure>
<!-- /RAW_HTML -->

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Forward progress follows declared edges; backward edges make recovery explicit. The agent cannot silently skip or blend phases. *[ref: phase-order-fixed-by-map | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The current prototype runs the OPEVC cycle (currently five phases in the prototype: *observe, plan, execute, verify, and condense*). OPEVC is the acronym, the name the brain calls its own cycle. The final phase, CONDENSE, plays a different role from the others. The earlier phases do work *on the project*; CONDENSE does work *on the brain*. We call CONDENSE the cycle's cognitive organ for that reason. Still, it sits inside the OPEVC ring, not outside it. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The current phase count is the prototype's answer; the discipline of compartmentalized phasing is the architecture. *[ref: opevc-ring-and-condense-organ | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Two states travelled with us across the previous essay without being named: *idle* and *gmode*. We left them out of Essay 5 to keep the substrate description clean. They come back now, because the full Markov brain does not run without them. *[ref: idle-is-default-current-phase | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

What we are about to open is what [Essay 3.1](../b3/03_1-the-folder-is-alive.html) called the agent's *cognitive metabolism* — the rhythm of breathing in context, working on it, breathing out memory. The phasic layer is that metabolism made mechanical.

This essay opens that discipline compartment by compartment.

## The journey ahead

Essay 6 unfolds across short parts:

- **Essay 6.1 — Phasic Foundation** *(you are here)* — the cognitive cycle and why phases at all
- [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the per-phase tool restrictions
- [Essay 6.2b — The Phase Map](06_2b-the-phase-map.html) — a quick tour of all the phases before the per-phase deep-dives
- [Essay 6.3 — OBSERVE — Read Wide, Write Once](06_3-observe.html) — the read-only sweep that grounds every cycle
- [Essay 6.4 — PLAN — Decide, Then Lock](06_4-plan.html) — the analysis phase whose deliverable is a named contract
- [Essay 6.5 — EXECUTE — Build, in Scope, in Steps](06_5-execute.html) — the only phase with project-write access, fenced by the altered list
- [Essay 6.6 — VERIFY — Independent Eyes](06_6-verify.html) — scripts-only, auditor-driven, backward-routed
- [Essay 6.7 — CONDENSE — The Cognitive Organ](06_7-condense.html) — the 7-step waterfall that grows the brain
- [Essay 6.7b — CONDENSE — What It Uniquely Owns](06_7b-condense-uniquely-owns.html) — the job graph CONDENSE mutates and the reflection that closes it
- [Essay 6.8 — The Rhythm of Work](06_8-inverse-multiplier.html) — the count-based rhythm inside every phase, and the exit gate that opens each boundary
- [Essay 6.9 — GMODE — The Off-Cycle Lane](06_9-gmode.html) — the documented escape hatch
- [Essay 6.10 — The Plan File — Stages and Completion](06_10-plan-state-machine.html) — what the plan file owns, the three Stages, the completion counting rule, and where the plan lives
- [Essay 6.10b — The Plan File — Long-Horizon Memory](06_10b-long-horizon-memory.html) — `.yaml` injection, the learning loop, and the long-horizon memory that closes the series

Essay 6.2 maps the discipline; Essays 6.3 through 6.7 deep-dive each phase, one per essay. Essays 6.8 through 6.10 are for the architects in the audience — the mechanisms that let the cycle stay honest across long horizons.

---

## From Action Space to Markov Brain

In [Essay 1](../b1/01-llms-are-not-the-agents.html) we drew the seed agent's starting condition as an **action space** — the set of moves a CLI agent can pick at any given moment. Use deep reasoning. Use tools — read, write, edit, run. Ask for permission. Delegate to another agent. Stop. Each step the LLM samples from those moves probabilistically. The next step samples again. The result, without further structure, is what that essay called a **random walk** — a Markov process whose next move depends on the current state, and whose transition probabilities can send the same prompt through different journeys. *[ref: action-space-tool-filter | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Then we added the first layer of structure: hooks. A harness can register hooks around tool calls, stops, prompts, and other runtime events. They can block an action, modify it, or trigger another. In Essay 1's framing, hooks place a **deterministic control layer around the probabilistic chain**. The LLM still proposes the next move; the hooks decide whether the move is allowed. *[ref: hooks-block-via-exit-two | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The phasic layer takes that idea one fractal step further.

A phase is a flavor of the action space. Inside OBSERVE, the action space is narrowed — project-deliverable writes are gone, while reading and synthesis into working memory remain. Inside EXECUTE, the action space widens for the altered list and tightens elsewhere. Each phase is a *customized Markov chain* — its own restricted action space, its own hook-enforced rules, its own bias toward the kind of move that phase wants to encourage. *[ref: observe-blocks-non-claude-writes | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The cycle on top is itself a Markov chain — but its "actions" are not individual tool calls. Its actions are the phases. The agent moves between phases. Each move from one phase to the next obeys gates and edges declared by the orchestrator plugin. **A Markov brain whose moves are themselves Markov chains.** Fractal, by design. *[ref: phase-transition-gates | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

This is what the title points at. The phasic brain is Markov on two levels. Inside any phase, the agent's tool calls are a constrained action-space chain. Across the cycle, the phases themselves are a state machine with declared edges and no hidden continuation. *[ref: phase-state-machine-as-data | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin: 2rem 0;">
  <img src="../../assets/images/blog/opevc-cycle-blackboard.png" alt="The OPEVC cycle. Forward edges (white) advance when all phase gates clear. Backward edges (brown) are explicit recovery choices. Idle holds the agent between cycles; condense returns to idle." style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 8px;">
  <figcaption style="text-align: center; font-style: italic; margin-top: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem;">The OPEVC cycle. Forward edges (white) advance when all phase gates clear. Backward edges (brown) are explicit recovery choices. Idle holds the agent between cycles; condense returns to idle.</figcaption>
</figure>
<!-- /RAW_HTML -->

---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression. *[ref: idle-blocked-activities-as-pattern-example | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another. *[ref: commit-precedes-phase-advance | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

A handful of mechanisms inside the cycle deserve a brief mention here before the next essays open them. Inside every phase runs a paced *rhythm*: a paired min-max gate forces the agent to read before it writes, and to synthesize before it reads more — counted per activity class against the working CLAUDE.md, where a CLAUDE.md update resets the count and the rhythm begins again. There is no score and no number for the agent to chase; the pacing is tool-call counts and structural gates. *[ref: min-max-rhythm-brief | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

And the boundary out of a phase opens on *reflection*, not volume: the three-family exit gate asks for evidence the phase examined its own work — reflection commands ran, new marked notes were left for CONDENSE, a reflector subagent left its receipt — before the cycle moves on. The agent never hears about counters in any voice or injection; coaching stays qualitative, speaking the language of the work. [Essay 6.8](06_8-inverse-multiplier.html) opens both mechanisms in full. *[ref: three-family-gate-brief | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Separately, every phase carries its own *direct-action budget*, an independent meter that tracks the ratio of direct file work versus subagent delegation and uses that ratio to inject voices or block actions. *[ref: direct-action-budget-meter | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Job-graph mutations follow a *lifecycle-symmetry* rule — the phase that adds graph state is rarely the phase that removes it, because the right context for each operation lives in a different cognitive posture. *[ref: lifecycle-symmetry-add-vs-remove | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]* We name each mechanism here so the later essays can use the labels; their machinery opens one by one.

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>The whole skeleton, walkable.</strong> The cycle, the two transition maps, the conductor and its five self-guarding musicians, the rule that lets thinking grant the right to write, and the fractal Markov framing &mdash; laid out as an interactive concept-deck. Walk one idea per card; click any box for the live code behind it.</span>
  <a href="explore/phasic-cycle.html" title="Walk the phasic brain as an interactive concept-deck" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the phasic brain</a>
</aside>
<!-- /RAW_HTML -->

## What you would customize

The phasic layer is the most opinionated piece of the prototype, and almost every dimension of it is a customization surface. The architecture is the shape; the specific dials are the prototype's answers.

The architect would tune the *phase count*. The prototype's phase set — currently observe, plan, execute, verify, condense — covers the work of designing the seed agent itself. A seed working on long literature reviews might want a `research` phase between observe and plan, where deep external reading happens with a different budget arithmetic than observe's broad sweep. A seed working in regulated drafting might split execute into `execute` and `integrate`. The phase count is a knob; the discipline of compartmentalization is the floor. *[ref: phase-count-is-data-not-code | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The architect would tune the *acronym itself*. OPEVC is the prototype's name for its cycle. A custom seed could call it RUNS, OPERATE, or any other word that catches the kinds of cognitive work it values. The name shapes how the architect talks to their own seed; the talk shapes how the seed sees the work. *[ref: opevc-name-lives-in-brain-and-voices | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The architect would tune the *tool-restriction granularity*. The prototype publishes one guard per phase, each one with its own allow-and-block list of tools. The same architecture supports finer grain — per-phase block-lists scoped by subagent type, allow-lists conditioned on the focused job's form, time-of-day rules for long-running research seeds. The guards are code; the granularity is what each architect's work demands. *[ref: one-guard-per-phase-pattern | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

What the architect would **not** customize is the principle that each phase publishes its restrictions ahead of time and the guard enforces them. The principle is the floor: a phase that doesn't fence the agent in is not a phase, it is a label. *[ref: phase-restriction-published-by-guard | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The shape lifts cleanly off this prototype. A research lab's seed could run literature-review jobs through `read-source`, `extract-claim`, `cross-check`, and `synthesize` phases — each with its own tool fence, writes forbidden during `read-source`, new sources forbidden during `synthesize`. A consulting seed could split client engagements into `intake`, `match`, `scope`, `draft-deliverable`, and `review`, with the drafting phase locked out of the client-source-data tools so it cannot improvise new facts mid-prose. The phasic cycle is the architecture; the phase names and the tool fences are yours. The honest limit is that the guards stop wrong-tool calls; they cannot stop a creative operator from working around the spirit of a phase in their prose. The discipline rests on the architect reading the injected voice and choosing to obey it. [Gmode](06_9-gmode.html) is the documented escape hatch when working around the discipline is the right move. *[ref: gmode-as-documented-escape-hatch | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

The foundation is in place: a Markov brain whose moves are themselves Markov chains, phases as the structural answer to mixed-mode cognition. The next essay maps every edge of the cycle — the full transition graph, the discipline the per-phase tool restrictions enforce, and a quick map of what each phase produces before we open the compartments one at a time.

---

*Essay 6.1 — The Markov Phasic Brain, Part 1 of 13.*

*Previous: [Essay 5.9 — The Customization Guardrail](../b5/05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted.*
*Next: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the tool-restriction pedagogy.*

