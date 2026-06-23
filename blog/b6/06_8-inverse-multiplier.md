---
title: "The Rhythm of Work"
date: "May 2026"
slug: "inverse-multiplier"
read_time: "11 min"
tags: [Architecture, Seed Agent, OPEVC, Rhythm]
status: draft
version: v0.4.1
audience: "Tier 2 → Tier 3"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# The Rhythm of Work

*Essay 6.8 — The Markov Phasic Brain, Part 10 of 13.*

---

[Essay 6.7](06_7-condense.html) closed the cycle. The cycle's phases (currently five in the prototype) plus the cognitive metabolism organ — the seed agent now has the compartmentalized cognition the rest of the series has been building toward. What is left is the mechanism that lives *inside* every phase and paces the work itself.

This is where the phasic layer earns its keep — and where you, designing your own seed, will spend the most time tuning. The mechanism is small. The discipline it produces is large. And it carries no score, no dial, no number for the agent to chase. The seed's pacing is built from tool-call counts and structural gates: *some activities require another activity*. That is the whole arithmetic.

---

## The Ralph loop and the per-phase echo

Start with the **Ralph loop**. The pattern is familiar to anyone who has tried to keep a CLI agent on task: an agent finishes a few moves, decides it is done, calls `Stop`, and quits — even though the work is not actually finished. The fix that emerged in the broader agent community is to refuse the stop. The agent calls `Stop`; the system intercepts; the agent is returned to the prompt and told to keep working. The loop runs until the work is genuinely done.

The seed agent adopts the Ralph loop through the job system. Every job carries a `status`. The always-on layer's stop-gate hook reads it on every `Stop` attempt; while any job is `active` or still `pending`, the stop is refused and the agent is returned to the prompt with a message explaining what is still in flight. Stop, refused. Stop, refused. The agent learns to keep working until the job formally completes. *[ref: job-status-state-machine-stop-blocking | .claude/plugins/job_core/CLAUDE.md ## State Machine | job_core's state machine: the three working states pending↔active↔completed plus the terminal-abandon voided (stop-exempt — the gate counts only active+pending); ANY pending or active job blocks Stop. The seed agent's Ralph loop adoption — Stop is refused until every job is completed or voided (none active/pending).]*

The transitions are explicit. Top-level jobs are born `active` and `focused` the moment the user's prompt fires `prompt-handler.sh` — `job.sh create-active` is the hook-only entry point that bypasses normal creation gates. Dependent jobs are born `pending` via the CONDENSE-only `job.sh create` / `create-dependent`, and move to `active` only when the operator runs `job.sh activate` to switch focus. A job can be `pause`d back to `pending` (loses focus) and re-`activate`d later. *[ref: top-level-vs-dependent-birth-paths | .claude/plugins/job_core/scripts/job.sh `create-active` subcommand + `create` / `create-dependent` subcommands | Birth-path split is enforced by command-level gates: `create-active` is hook-only (fires from prompt-handler.sh, born status:"active" + focused:true); `create` and `create-dependent` are CONDENSE-only (born status:"pending", focused:false). `activate` / `pause` flip the focused-and-active pair; the always-on layer never bypasses these gates.]*

The terminal move — `active` to `completed` — is gated: every `depends_on` ID on the focused active job must itself be `completed`, plus any required user and plugin-lock approvals, and the operator runs `job.sh complete`. The job's status field cycles through the three working states — `active`, `pending`, `completed` — and the transitions are exactly what the Ralph loop needs to refuse `Stop`. There is one more status off to the side: `voided`, the terminal off-ramp for work that gets *abandoned* without ever being completed. It is not part of the working cycle — a voided job is kept on disk for its history but is finished with, so the Stop gate stops counting it. *[ref: job-status-four-states-incl-voided | .claude/plugins/job_core/scripts/job.sh `complete` arm (status→completed) + `void-dependency` arm (status→voided) + .claude/plugins/job_core/hooks/stop-gate.sh | The job status has four values: the three working states `pending`/`active`/`completed` plus `voided`, a terminal-abandon state set by the `void-dependency` arm (a dependency VERIFY concludes is dead work). The Stop gate counts only `active`+`pending`, so a voided job is exempt — uncounted, with no gate change. `voided` is distinct from completion: the objective was never met, so `completed` would be false; the job is parked on disk rather than deleted.]*

The phasic layer does the same thing one fractal level down — inside a single phase.

Every phase's advance is gated. Try to cross a boundary before the phase has done its work and the commit script refuses, returning the agent with a message about what kind of work is still missing — a required commit section left empty, a reflection that has not run. Try to call `Stop` mid-phase and the same refusal fires. The gates are friction-by-design — a refusal layer that makes the seed agent slow down and do the work the phase exists to do, instead of rushing through phases to get to the next move. What those gates actually check is the subject of this essay: a rhythm that paces the work from inside the phase, and an exit gate that opens the boundary at the end. *[ref: phase-advance-gates-refuse-early-commit | .claude/context/opevc-phases.md "Phase commit shape" | Every phase's `--force` advance commit carries a required structure of named `## ` sections, validated before the advance fires; per-phase custom gates (objective expansion at OBSERVE cycle 1, the plan-file decision at PLAN cycle 1, the empty Outstanding-Items check at VERIFY) layer on top. Only the `--force` commit fires the advance gates; intermediate commits pass through — concentrating the cognitive load on boundary decisions.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/inverse-multiplier-b6-8.png
  Concept: Chalk-on-blackboard loop — the min-max rhythm inside a phase.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines; pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image); white chalk for ALL labels and arrows; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal labels listed below. Do not invent other words, numbers, tool names, or descriptors.
  Layout: A circular chalk loop drawn clockwise with three stations:
    Station 1 (top, cyan box): labeled IN WHITE CHALK exactly "investigate" — three small chalk tally marks drawn beside it.
    Station 2 (right, green box): labeled IN WHITE CHALK exactly "write to CLAUDE.md".
    Station 3 (bottom, magenta box): labeled IN WHITE CHALK exactly "all counters reset".
    A white chalk arrow runs from Station 1 to Station 2, labeled IN WHITE CHALK exactly "max gate: synthesize before reading more".
    A second white chalk arrow runs backward from Station 2 toward Station 1 with a small chalk X on it, labeled IN WHITE CHALK exactly "min gate: read before you write".
    A third white chalk arrow runs from Station 2 to Station 3, and a fourth from Station 3 back up to Station 1, closing the loop.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "investigate", "write to CLAUDE.md", "all counters reset", "max gate: synthesize before reading more", "min gate: read before you write". No other words, file names, tool names, or descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 6.8. The min-max rhythm — accrue, write, reset."
-->

## The min-max rhythm

How does a phase keep its work honest from the inside? Not through a score. Through a pair of paired gates — the **min-max gate** — that force a read-and-write rhythm against the working CLAUDE.md.

The **min-gate** blocks a CLAUDE.md write until enough investigative actions have accrued since the last synthesis. *Read before you write* — no synthesis lands without evidence behind it.

The **max-gate** blocks further investigative tools — reads, searches, web fetches, subagent dispatches — once too many actions have accrued without a write. *Synthesize before you read more* — no runaway reading without writing anything down.

Together they bracket the agent into a cycle: accrue from zero up to the ceiling, write — which resets the count — then accrue again. The min-gate forbids premature synthesis; the max-gate forbids investigation sprawl. *[ref: min-max-gate-paired-brackets | .claude/context/opevc-rhythm.md "Min-max gate" | The pair of intra-phase gates enforced by the phase guard on the actions-since-synthesis counter: the min-gate blocks a CLAUDE.md write until enough investigative actions have accrued since the last synthesis; the max-gate blocks further investigative tools (Read / Grep / Glob / Web / Bash / Agent) once the counter reaches the ceiling. The counting is per activity class; a CLAUDE.md edit resets ALL class counters at once — accrue, write, accrue again.]*

The counting is *per activity class*. Bare tool-call counts replace any notion of a score, but the rhythm is class-aware: each kind of activity carries its own update-requirement — every so-many reads call for a CLAUDE.md update; every subagent run calls for its own. The composition rule keeps it simple: per-class counters, **one reset event**. A CLAUDE.md update resets every class counter at once — the write *is* the synthesis moment. Whichever class hits its threshold first forces the write, and the write clears the whole board, so mixed action sequences compose naturally with no special cases. *[ref: min-max-counted-per-activity-class | .claude/context/opevc-rhythm.md "Min-max gate" (per-activity-class paragraph) | Bare counts, class-aware: each activity class carries its own update-requirement, composing dynamically as the seed mixes actions. Composition rule: per-class counters, ONE reset event — a CLAUDE.md update resets ALL class counters at once; whichever class hits its threshold first forces the write, and the write clears the whole board.]*

Each phase tunes the rhythm to its own dominant work. Every phase enforces both gates — the anti-dodge property is that there is no phase *without* the rhythm — but the class thresholds differ per phase, so each phase's dominant activities are the ones that drive its CLAUDE.md updates: OBSERVE's reading, EXECUTE's building, CONDENSE's routing. The floor sits lower in OBSERVE, where discovery is cheap and broad reading before the first note is encouraged. And the gates fire for the main session only — a dispatched subagent can bulk-read without tripping the rhythm, which is exactly what keeps the delegation economy of [Essay 7.6](../b7/07_6-agents-and-80-20-budget.html) viable. *[ref: min-max-per-phase-tuning | .claude/context/opevc-rhythm.md "Min-max gate" (thresholds paragraph) | Every phase enforces both gates, but the class thresholds are tuned per phase so each phase's dominant activities drive its updates; the min floor is lower in OBSERVE (discovery is cheap). Both gates fire main-session only — a dispatched agent can bulk-read without tripping the rhythm. All values config-tunable in each phase plugin's config.conf.]*

The agent never hears about counters. The coaching voices speak the language of the work — read before writing, synthesize what you have gathered — and the block message, when a gate fires, names the *kind* of work the phase still wants. The arithmetic belongs to the orchestrator; the experience is just the friction.

## Entry: coached, not gated

A phase's entry carries no ceremony. There is no dial to set, no declaration to file, no act the machinery checks before the tools open. The seed enters a phase already carrying its context — the working CLAUDE.md layer, or the just-injected compaction file from [the always-on cortex](../b5/05_3-brain-guard.html) — and the **entry voice** orients it: stay focused on this phase's kind of work, produce the shapes the gates will ask for, orchestrate the phase's subagents.

Thinking about the phase's expected depth — how heavy will this be, how many subagents, how much reading — is part of that coached orientation. It is useful cognition the voice prompts, not a step the machinery verifies. The depth intuition also informally sizes how much of the phase's work gets delegated. *[ref: entry-scope-thinking-coached | .claude/context/opevc-rhythm.md "Entry coached, exit gated" | Scope-thinking at phase entry is COACHED, never required: no entry act, no declaration gate, nothing to set. The seed enters carrying its context and the entry voice guides it; thinking about the phase's expected depth is part of that coached orientation — useful cognition the voice can prompt, not a step the machinery checks. The phase's real friction sits at the EXIT.]*

The real friction sits at the exit.

## The exit gate

The condition that opens a phase boundary is the **three-family exit gate** — evidence the phase reflected on its own work, checked at the force-advance commit. [Essay 6.2](06_2-discipline-and-map.html) drew it across all five phases; here is the shape once more, because it is the door every rhythm in this essay leads to.

Family one: the phase's *reflection commands* ran — named in-session operations that write the phase's slice of the cycle's compaction file. Family two: *new marked notes* were left in the working CLAUDE.md for CONDENSE to harvest later — a soft nudge, not a hard block. Family three: at least one of the phase's *reflector subagents* actually ran and left a receipt. *[ref: three-family-exit-gate | .claude/context/opevc-metacog.md "Three-family exit gate" | The per-phase advance filter — targeted friction: (a) reflection commands updated the compaction file via metacognition commands; (b) NEW marked notes of any type added to the working CLAUDE.md, counted by the existing real-time marker tracker (soft); (c) ≥1 of the phase's AVAILABLE reflector subagents ran this phase, read from the per-entry agent_launches record — user-extensible set, never one pinned name. Gates advance on evidence the phase reflected.]*

The minimums are deliberately *variable*. Each phase entry draws its required counts from a small set — the same random-from-pool selection the coaching voices already use — so the friction cannot be gamed to a constant, and the operator can observe its impact. The reflection commands themselves come in two tiers: a constitutive CORE pair that runs in every phase (a quality self-assessment, and a scan for coaching the phase's own voices could do better), plus a regulated layer of mental-model lenses the variable minimum draws against. *[ref: metacognition-commands | .claude/context/opevc-metacog.md "Metacognition commands" | The in-session named operations a phase must run before it can advance. Two tiers: a constitutive CORE baseline mandatory in every phase (phase-quality self-assessment + voice-update-candidate scan) plus a regulated layer of NUANCED mental-model lenses whose variable minimum is drawn from a set per phase entry. Commands, not subagents, because they need the live session context — the seed's own reasoning trace.]*

CONDENSE is the most-gated phase of all — fitting, because it is the brain's learning phase. It clears the exit gate *and* keeps its own eighty-percent deflation target from [the CONDENSE essay](06_7-condense.html). And because CONDENSE consumes the cycle's marks rather than leaving new ones, the new-notes family does not gate it — its marker-side discipline runs in the consumption direction instead.

## The gate is a floor

Every gate in this essay is a **floor, not a target**. The agent satisfies a gate through the phase's real work, and it is meant to keep working past the floor whenever the work still needs more. The upper side is deliberately unguarded — no over-work penalty, no waste in doing more than the minimum, because no minimum was ever the thing being chased. *[ref: advance-gate-is-a-floor | .claude/context/opevc-rhythm.md "Advance gate is a floor" | Every phase-advance gate is a FLOOR, not a target: the agent satisfies the gate through the phase's real work and keeps working past it whenever the work needs more — the upper side is deliberately unguarded (no over-work penalty; finishing early on an honest declaration is fine).]*

The anti-rush pressure never comes from a number. It comes from coaching that speaks the language of the work — observe more, hunt the blindspots, analyze deeper, change your lens, double-check the claim. The voices and injections never mention counters or thresholds directly. The agent never hears "you are short on a count." It hears what kind of work the phase still wants — so phases advance with completed work, not satisfied numbers. *[ref: coaching-never-names-counters | .claude/context/opevc-rhythm.md "Advance gate is a floor" (anti-rush paragraph) | Anti-rush comes from coaching, not gate talk: voices and injections never mention counters or thresholds directly — they remind the agent what each phase must do (more observing, blindspots, more planning and analysis, lens changes, double-checking) so phases advance with completed work, not satisfied numbers.]*

Put the pieces together and the phase has two bookends. The entry voice opens the phase operationally — here is your kind of work, here are your subagents. The exit gate closes it metacognitively — show me you reflected before the boundary opens. The stretch between is the rhythm: accrue, write, reset, with the floor underneath and the coaching overhead. *[ref: per-phase-accrue | .claude/context/opevc-metacog.md "Per-phase accrue design" | Every OPEVC phase runs an operational→metacognitive flow carried by its two voices: the ENTRY voice fires on phase entry and coaches how to do the phase's work (introduces the operational subagents); the EXIT voice fires at the advance boundary and delivers a mindset shift — stop doing the phase, start examining your own cognition. This is what accrues the compaction file across the cycle, phase by phase.]*

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>Interactive diagram.</strong> Walk one phase end to end &mdash; the coached entry, the min-max rhythm that paces the work, and the three-family exit gate that has to see evidence of reflection before the boundary opens. Click any box for the code-accurate detail.</span>
  <a href="explore/phase-advance.html" title="Open the interactive phase-advance walkthrough" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk one phase</a>
</aside>
<!-- /RAW_HTML -->

## Persistence across rollbacks

The rhythm's bookkeeping behaves a level below all this in a way architects should know about. *Backward transitions preserve recorded work; only a completed forward advance closes a phase's entry.* Each phase entry carries a `forwarded` flag, flipped true only by the force-commit handshake at a successful forward advance. A backward transition never flips it. *[ref: forwarded-flag-set-by-force-commit | .claude/context/opevc-rhythm.md "Forwarded flag" | The boolean on each phase entry that records whether the entry was completed via a forward advance. Set by the force-commit handshake: the commit script flips the flag true BEFORE the advance, so the next phase's sensor sees a properly-closed entry. A backward transition does NOT mark the entry forwarded.]*

So when the agent enters VERIFY, does half its audit work, then rolls backward to EXECUTE to fix a small thing — the VERIFY entry was never closed. When the cycle flows forward again, the phase resumes that same entry, its recorded state intact, the remaining gap unchanged. Only revising *completed* work — backing into a phase whose entry was already closed by a forward advance — appends a fresh entry. The agent does not lose work to a rollback; it loses only the time spent fixing what made the rollback necessary. *[ref: forwarded-flag-reuse-vs-fresh | .claude/context/opevc-rhythm.md "Forwarded flag" (the two re-entry cases) | On entering a phase the sensor reads the last entry's forwarded flag: false (active, unfinalized) + forward re-entry → REUSE the entry, state preserved — the plan-retry path; true (completed) → FRESH entry, state reset — the backward-from-verify path, because revising completed work is new work. Prior entries stay in the array as an audit trail of the phase's visits.]*

## A worked example

Picture the same multi-cycle plan-job we have been tracking — the migration of a large body of work from one repo to another — at two different moments. The job is the same. The rhythm is the same machinery. What differs is the shape of the work, and the rhythm bends to it.

**Cycle 1, OBSERVE.** Working memory is nearly empty. The injected context is a one-line objective. The agent has never touched the target repo. The entry voice orients it toward breadth: map the project, find the contradictions, walk the prior knowledge, dispatch parallel research subagents. The agent fans out two observe-subagents and starts reading. A dozen reads in, the max-gate fires: *synthesize before reading more.* The agent writes what it has learned into the working CLAUDE.md — the write resets every counter — and goes back to reading. Accrue, write, reset, for as long as the investigation genuinely runs. When the phase finally reaches for the boundary, the exit gate asks for its evidence: the reflection commands run, the blindspot reflector leaves its receipt, the marked notes are staged for CONDENSE.

**Cycle 3, EXECUTE.** Three cycles later, the same job enters EXECUTE for a surgical task. The plan named one altered-list directory and a single hook update. The agent makes the edit, records the execution note, commits at the checkpoint. A handful of actions, one synthesis write, done — the rhythm never even approaches its ceiling, and nothing penalizes finishing early on honest work. But the exit gate does not shrink with the task: before the boundary opens, the drift-auditor reflector still reads what was actually changed against what the plan declared, and the reflection still lands in the compaction file. *[ref: execute-reflector-drift-auditor | .claude/context/opevc-metacog.md "Per-phase accrue design" (the metacog reflector per phase) | Each phase has its reflector: OBSERVE's blindspot-finder, PLAN's premortem lens, EXECUTE's drift-auditor (changed-vs-plan: missing / extra / deviated), VERIFY's meta-audit, CONDENSE's promotion-scan. Each phase's roster holds both its operational subagents and its reflector.]*

Same job. Same machinery. A deep phase fills through real volume; a surgical phase finishes early and clean. In both, the boundary opens the same way — on evidence of reflection, never on volume alone.

## What you would customize

The rhythm is one of the architectural surfaces with the *most* room for an architect's opinion. The mechanism is small enough that the customizations are pointed.

The architect would tune the *per-class thresholds, per phase*. The prototype calibrates them against its own tempo — a lower read-floor in OBSERVE, heavier write-classes in EXECUTE. A seed doing legal research, where each "read" is a long document, would raise OBSERVE's read-class threshold so the rhythm asks for synthesis less often; a seed doing rapid code patches would tighten EXECUTE's. The thresholds live in each phase plugin's `config.conf`; the discipline holds while the numbers move. *[ref: rhythm-thresholds-config-tunable | .claude/context/opevc-rhythm.md "Min-max gate" (mechanics pointer) | The min/max blocks live in each phase guard; the counter resets via the tracker's reset-synthesis arm; the class thresholds live in each phase_*/config.conf — the architect's tuning surface, per the config-sourcing invariant.]*

The architect would tune *which activities dominate which phase*. The composition rule — per-class counters, one reset event — is the invariant; which classes a phase weights heavily is the opinion. A consulting seed might decide that in its intake phase, every client document reviewed calls for a note in the engagement file, while subagent dispatches run looser. The rhythm bends per domain; the write-as-reset moment does not.

The architect would extend the *reflector roster*. Family three of the exit gate asks only that some available reflector ran — the set is user-extensible, never one pinned name. A research seed adds a citation-checker reflector to VERIFY; a real-estate seed adds a comparables-sanity reflector to PLAN. Each one is another lens the exit gate can accept as evidence of reflection. *[ref: reflector-set-user-extensible | .claude/context/opevc-metacog.md "Three-family exit gate" (family-c) | Family-c asks only that ≥1 of the phase's AVAILABLE reflectors ran this phase, read from the existing per-entry agent_launches record. The set is user-extensible — never one pinned name.]*

What the architect would **not** do is surface the counters to the agent, or talk about the gates in the coaching. A visible count becomes a target; a target gets optimized; and the agent starts finishing gates instead of finishing work. The voices speak work-language on purpose — that choice is load-bearing, and every other knob in this section sits above it.

The honest design-limit is worth naming: the rhythm is friction, not mathematics — counters checked by hooks, voices injected at the block. A determined operator can enter [gmode](06_9-gmode.html), the named off-cycle lane, to step outside the phasic system entirely and pay the deliberate-bypass tax of composing the justification; the discipline lives in the architect's willingness to honor the rhythm rather than route around it.

The deepest payoff of the rhythm is the cognitive failure mode it prevents: the *unpaced phase*. An agent left unpaced either writes conclusions before it has read anything, or reads forever and writes nothing down — both are real failure shapes, and both die at the same pair of gates. The rhythm makes the read-write alternation structural; the exit gate makes the reflection structural; the floor-not-target principle keeps all of it pointed at the work instead of the numbers. The friction is the pedagogy. The rhythm is the compartment.

---

## What comes next

Phases give the agent compartmentalized cognition. The CLAUDE.md layer from the [Essay 5 series](../b5/05_1-the-two-layer-foundation.html) is the working-memory form they write that cognition into — the surface where each cycle's tokens land before CONDENSE absorbs them into longer-term memory. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

This is what [Essay 1](../b1/01-llms-are-not-the-agents.html) was reaching toward when it claimed the agent is the filesystem. The filesystem holds memory. The phases discipline what the agent does with it. The two ideas only fully resolve when you see them together.

Stretch one cycle into many, chained, and you get the long-horizon discipline [Essay 8](../b8/08_1-apprentice-to-architect-foundation.html) is about — multi-cycle jobs where the rhythm gates, the plan-file contract, and the seven-step waterfall keep the agent honest across days, not just minutes. The mechanisms in this essay are designed to scale up that way without losing their grip.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design?

Next.

---

*Essay 6.8 — The Markov Phasic Brain, Part 10 of 13.*

*Previous: [Essay 6.7b — CONDENSE — What It Uniquely Owns](06_7b-condense-uniquely-owns.html) — the job graph CONDENSE mutates, the dependency-removal moves, and the reflection that closes the phase.*
*Next: [Essay 6.9 — GMODE — The Off-Cycle Lane](06_9-gmode.html) — the operator's deliberate maintenance lane that lives outside the OPEVC cycle.*
