---
title: "Job Lifecycle — job_core"
date: "May 2026"
slug: "job-core"
read_time: "8 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.4.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Job Lifecycle — `job_core`

*Essay 5.4 — The Always-On Digital Cortex, Part 4 of 9.*

---

[Essay 5.3](05_3-brain-guard.html) covered the ceiling: keeping the agent under the model's reasoning curve. This part covers the spine: the always-on plugin that gives the seed agent a durable answer to *what work am I doing?*

This essay describes an earlier private Claude Code prototype. The architecture is useful as a case study; its commands and thresholds are not a universal agent standard.

---

## The atom of work

`job_core` compartmentalizes work into *jobs*. A job carries the base identity and lifecycle of a piece of work: its name and objective, current status, focused state, user interactions, dependencies, completion approval, and plugin-edit approval. The prototype treats this record as the atom to which the rest of the system attaches. *[ref: job-core-ownership | .claude/plugins/job_core/CLAUDE.md, Objective and Design Principle; .claude/context/job-system.md, Job creation paths and Focus lifecycle | `job_core` owns lifecycle, creation, status, focus, completion, stop behavior, and interaction capture.]*

That ownership has a boundary. `job_core` does not own the OPEVC phases, the job's plan, or the working memory written inside a phase. Those belong to other plugins. Its role is narrower and more foundational: create the compartment, keep its identity stable, and control the transitions that make it pending, active, completed, or voided.

This distinction matters because “a job contains the work” is an architectural statement, not a claim that one plugin stores every artifact. The base record is the spine. Other plugins add specialized state around the same job.

## Four ways a job begins

The prototype has four creation paths.

1. A direct standalone job can be created during CONDENSE.
2. A direct dependent job can be created during CONDENSE and attached to the focused parent.
3. The prompt hook creates an active, focused job when a prompt arrives and no active job exists.
4. A structured `[JOB-APPROVE-CREATION]` request can create a job already approved to edit the plugin layer.

The first three paths begin with `plugin_lock_approval: false`. The fourth is a user-gated exception for work that is known, at creation time, to require changes inside the cognitive substrate. An ordinary focused job can also request that approval later through `[JOB-APPROVE-PLUGIN]`; the permission belongs to the job identity and survives reactivation. *[ref: creation-and-plugin-approval | .claude/context/job-system.md, Job creation paths; .claude/context/prefixed-questions.md, JOB-APPROVE-CREATION and JOB-APPROVE-PLUGIN | Direct creation is CONDENSE-only; prompt bootstrap handles the no-active-job case; plugin access may be approved at birth or later on the focused job.]*

Direct dependencies are intentionally shallow. A dependent job is recorded in its parent's `depends_on` list, and the parent cannot complete while that dependency remains unfinished. The prototype can remove or promote a dependency during VERIFY, or void work that should no longer block the queue. Voided records remain as history but are exempt from the stop gate. *[ref: dependency-lifecycle | .claude/context/job-system.md, Dependency rules and status lifecycle | Dependencies are created one level deep; unfinished dependencies block completion; voided jobs remain recorded and stop-exempt.]*

Creation also leaves some decisions for later. A new job receives a starter objective and base lifecycle fields, but `plan_file` is not a `job_core` creation field. The `phase_plan` extension introduces it as `null` when the job first enters PLAN. That first PLAN then records `false` for a single-cycle job, a Markdown plan for a flexible multi-cycle job, or a YAML plan for a more structured one. The system decides the shape of the plan after it has observed the work, rather than guessing at birth. *[ref: plan-ownership | .claude/context/job-stages-plans.md, Plan file lifecycle; .claude/context/job-system.md, Universal starter shape | `plan_file` belongs to the phase extension, begins undecided at first PLAN, and is set explicitly during cycle one.]*

## Prompts become job context

The prompt hook has two branches. With no active job, the first prompt bootstraps a new active, focused job. With an active job, each later prompt is appended to the focused job's `user_interactions` array. A prompt that introduces separate work can be marked for later job creation rather than silently splitting the current compartment. *[ref: prompt-routing | .claude/plugins/job_core/hooks/prompt-handler.sh; .claude/context/job-system.md, Job creation path 3 | The hook chooses between `create-active` and `append-interaction`; mid-session prompts normally remain with the focused job.]*

This gives the work a durable interaction history. It does not mean the model must reread an ever-growing raw array as one enormous instruction on every turn. The neighboring `interaction_summary` plugin exists to keep that history usable as it grows. The important design choice is that user direction is attached to the work unit instead of disappearing with the current turn.

The difference is subtle but consequential. A chat transcript answers, “What was said?” A job context also answers, “Which continuing piece of work did this instruction modify?” That second question is what lets later hooks, phases, summaries, and approvals coordinate around the same intent.

## One key across many plugins

Every job receives a unique ID. `job_core` stores the base record under that ID in its own hidden state. Other plugins maintain their own state and key their job-specific entries with the same ID. `interaction_summary` can store compressed interaction blocks; phase plugins can store phase progress; planning can store its plan pointer. Each plugin uses its own gateway and remains responsible for its own schema. *[ref: shared-key-compartment | .claude/plugins/job_core/scripts/job.sh, create and create-active handlers; .claude/context/job-system.md, Job object and plugin-extension rules | The timestamp-derived ID originates in the base job record and coordinates plugin-owned extensions without making `job_core` own their data.]*

The shared key creates a cross-plugin compartment without a shared mutable object that every plugin edits directly. Coordination still requires runtime conventions and plugin-owned commands. The ID makes the records line up; the gateways preserve ownership.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/job-core-b5-4.png
  STATUS: Historical concept retained; diagram redesign is outside this editorial pass.
  Concept: A central job record keyed by one ID, with user interactions inside it and plugin-owned extensions around it using the same key.
  Caption: "Image 5.4. One job, one shared key: job_core owns the base record while other plugins extend the compartment through their own state."
-->

## Refusing a premature stop

A stop hook counts active and pending jobs. If either count is nonzero, it blocks the runtime's Stop event and returns guidance shaped for the current phase. OBSERVE, PLAN, EXECUTE, VERIFY, and CONDENSE each have their own reminder. When the queue becomes quiescent, the hook allows Stop and launches the prototype's heartbeat path. *[ref: stop-gate | .claude/plugins/job_core/hooks/stop-gate.sh; .claude/plugins/job_core/CLAUDE.md, Stop gate | The hook checks active and pending counts, emits phase-aware guidance while work remains, and releases when the managed queue is empty.]*

This is stronger than a polite message. Inside the configured Claude Code runtime, the hook returns a blocking result. It is still a boundary, not a proof that work is correct or an operating-system guarantee: the operator controls the runtime and can remove the hook. What the mechanism enforces is narrower and useful—while this harness is active, a managed queue cannot disappear merely because the model attempted to end a turn.

The phase-aware response also does more than say “continue.” It tells the agent what kind of unfinished work to reconsider. That turns a lifecycle gate into a reorientation point.

## Completion is a protocol

The prototype splits `[JOB-COMPLETE]` across a pre-question hook and a post-question hook.

The pre-hook admits the question only during CONDENSE and only when the job is eligible to finish. It validates a structured review: the job name, the required review content, and the expected “Review” and “Approve completion” choices. For planned work, eligibility follows the effective last-cycle calculation; if whole-job work remains, CONDENSE can add an extension cycle rather than pretending the original plan was complete. *[ref: completion-pre-hook | .claude/plugins/job_core/hooks/question-capture.sh; .claude/context/job-completion-reactivation.md, JOB-COMPLETE completion hooks and Extension cycle | Phase, eligibility, and question shape are checked before the approval request reaches the user.]*

The post-hook interprets the user's choice. “Review” returns guidance to the agent. “Approve completion” first checks the dependency list, then sets `user_approval` and runs the completion transition. The completion command itself refuses to change an active job to completed without that approval. When a repeating job is reactivated, `user_approval` resets to false, so a past approval does not authorize a future run. Its plugin-edit approval, by contrast, remains attached to the continuing job identity. *[ref: completion-post-hook | .claude/plugins/job_core/hooks/question-capture-hook.sh; .claude/context/job-completion-reactivation.md, User approval and Reactivation | The post-handler owns the approval-and-complete path; dependencies are checked first; reactivation resets run-level completion approval.]*

This arrangement makes completion a protocol rather than an assertion. The agent proposes closure with evidence; the harness checks eligibility and shape; the user chooses; the state transition verifies the approval bit.

## Three events called “done”

The prototype distinguishes three events that can occur close together:

- **Job completion** changes the job from active to completed and records its completion time.
- **CONDENSE completion** advances the phase to idle and clears the focus after final cleanup.
- **Cycle closure** advances the job's cycle accounting.

They are related, but they are not the same state change. A job can close several cycles before the job itself is complete. Even on the final cycle, job completion occurs first so CONDENSE can finish its cleanup against the still-focused record; the later phase transition clears focus. *[ref: three-completion-events | .claude/context/job-completion-reactivation.md, The three completion events and Focus lifecycle | Job status, phase state, and cycle accounting have different actors and side effects; completion deliberately keeps focus until CONDENSE reaches idle.]*

This precision prevents a common category error. “The cycle ended” says that one pass through the work rhythm closed. “The job completed” says the whole compartment satisfied its closure protocol.

## What the architecture buys

Without a persistent work unit, prompts remain a sequence of turns. There is no stable place to attach dependencies, phase state, completion approval, summaries, or permission to alter the harness. `job_core` supplies that place.

The portable idea is not the prototype's exact schema or vocabulary. A consulting system might call the unit an engagement; a legal system might call it a matter; a research system might call it an investigation. Each could add domain-specific completion evidence, review hooks, dependency types, or interaction summaries.

What should survive those changes is the separation of concerns:

- one base owner for identity and lifecycle;
- plugin-owned extensions joined by a stable key;
- explicit transitions for activation, focus, completion, and reactivation;
- a stop gate that reads lifecycle state;
- and a completion protocol that distinguishes an agent's claim from an approved state change.

That is why the job is the spine of this cortex. It gives every other cognitive mechanism a durable piece of work to belong to.

---

The next part covers the plugin that keeps accumulated user direction legible as a job grows.

---

*Essay 5.4 — The Always-On Digital Cortex, Part 4 of 9.*

*Previous: [Essay 5.3 — Context Window Discipline — `brain_guard`](05_3-brain-guard.html) — the progressive squeeze that keeps reasoning sharp.*
*Next: [Essay 5.5 — Mega-Prompt Compression — `interaction_summary`](05_5-interaction-summary.html) — structured compression for a growing interaction history.*
