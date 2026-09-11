---
title: "Context Window Discipline — brain_guard"
date: "May 2026"
slug: "brain-guard"
read_time: "9 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.4.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Context Window Discipline — `brain_guard`

*Essay 5.3 — The Always-On Digital Cortex, Part 3 of 9.*

---

[Essay 5.2](05_2-plugin-integrity.html) covered the protected change cycle around the prototype's plugin layer. This part covers a different pressure: a language model can only see a bounded working context, and long work must cross that boundary without pretending that every detail survives.

The subject is `brain_guard`, a phase-independent plugin in the earlier private Claude prototype. Its mechanism is specific to that environment. Its architectural question is portable: what must a durable agent write down before a conversation is shortened or cleared?

---

## What it owns

`brain_guard` manages context pressure, the per-job compaction chain, the seal that checks what will carry forward, and the terminal dispatch that crosses into a fresh Claude Code session. Outside the prototype's gmode maintenance lane, its canonical operation is **finalize, then clear and inject**. Inside gmode it uses native `/compact`, because clearing would discard the live diagnostic thread. *[ref: brain-guard-scope | .claude/plugins/brain_guard/CLAUDE.md Objective and Phasic-compaction | The prototype distinguishes its finalize-to-clear-and-inject path from the gmode-only native compact path.]*

Claude Code already compacts automatically as a session approaches its configured capacity, and `/compact` can summarize on demand. Its project-root instructions and auto memory reload after compaction, while parts of the conversation and some path-scoped context may be summarized away. `brain_guard` is an experimental layer above that native behavior. It crosses earlier and gives the agent an inspectable file to author before the boundary. [Official Claude Code documentation](https://code.claude.com/docs/en/context-window "Claude Code context-window and compaction behavior") describes what native compaction keeps and reloads.

## The compaction file — what crosses the boundary

Conversation history is working context, not a durable ledger. Clearing it starts a fresh context; compacting it replaces earlier messages with a summary. Neither operation can guarantee that every open thread, assumption, or correction will remain salient.

The prototype therefore maintains a **compaction file** for each job, run, and compaction sequence. The file records the cognition needed to resume: the exact next move, unresolved threads, assumptions and risks, process lessons, a rolling summary of earlier sequences, commit messages, and settled decisions. Project files still hold the work itself; the compaction chain holds the resume map around that work. *[ref: compaction-file-location | .claude/plugins/brain_guard/scripts/compaction-io.sh template and path commands | Files live below .claude/jobs/<job>/run-<n>/compaction-<seq>.md and carry seven fixed sections plus sequence metadata.]*

The seven sections have different ownership:

- **Forward State, Open Threads, Assumptions & Risks, and Process Insight** are the four work sections the agent updates through phase-specific reflection.
- **Git Commit Messages** is fed by the phase commit machinery.
- **Prior Summary** is the bounded cross-session index, with references back to earlier sealed files.
- **Settled Decisions** is an append-only ledger carried across the chain so an accepted decision is not casually re-derived.

The five sections required for every seal are the four work sections plus Prior Summary. Their names remain fixed, while the prompts for the work sections can change with the phase. The shape asks the next session for different kinds of information instead of accepting one undifferentiated recap.

The file is built during the work rather than composed only at the final second. Phase reflection writes into it at transitions, and a separate heartbeat can require mid-phase updates as context accrues. At a compaction boundary, the current file is checked, sealed, and frozen. The chain then opens a new sequence carrying the rolling summary and a back-reference to the sealed one. Calling this file “never condensed” was inaccurate: the live file can be folded, and the rolling summary is deliberately bounded. *[ref: compaction-chain | .claude/plugins/brain_guard/scripts/compaction-io.sh seal, chain-step, and call-counter | The current file can be folded and sealed; the next sequence carries a summary index and references to prior sealed files.]*

## How it works — the progressive squeeze

The context ramp uses the **current total context as a percentage of the configured model window**. It does not subtract a session baseline. The sensor reads usage from the Claude Code transcript on selected pre-tool events, while the gate blocks only the tool classes registered for enforcement. That difference matters: observation may be broad, but enforcement is attached to explicit runtime events and matchers. *[ref: context-measurement | .claude/plugins/brain_guard/hooks/context-sensor.sh + hooks/context-gate.sh + .claude/settings.local.json | The sensor computes current total divided by MAX_CONTEXT_TOKENS; the gate is registered on Read, Edit, Write, and MultiEdit.]*

The checked-in prototype currently uses an experimental **31 / 39 / 42 percent** configuration:

1. At 31 percent, coaching begins on later ten-thousand-token tier crossings.
2. At 39 percent, ordinary `Read` calls are blocked while the system still leaves a path to finish and prepare the boundary.
3. At 42 percent, ordinary `Edit`, `Write`, and `MultiEdit` calls join the block. The focused compaction file and other protected cognition paths retain narrow carve-outs.

`Bash` and `AskUserQuestion` remain outside the context gate so the agent can invoke the owned compaction path and surface a blocker. These numbers are a temporary live override; the underlying defaults are 20 / 25 / 30. The current illustration shows those original defaults, so it should be read as a conceptual ramp rather than the live configuration. *[ref: live-context-thresholds | .claude/plugins/brain_guard/config.conf | The checked-in override is 31, 39, and 42 percent; comments retain 20, 25, and 30 as defaults.]*

The denominator must match the active model. The prototype assumes one million tokens and requires an explicit acknowledgement when configured for another real window. Current Claude Code can use different effective windows: official documentation describes 200K standard and 1M extended-context calculations, along with environment variables that affect auto-compaction. A hard-coded million-token assumption is therefore a prototype policy, not a universal fact. [Claude Code environment-variable documentation](https://code.claude.com/docs/en/env-vars "Claude Code auto-compaction window configuration") provides the current native boundary.

A second, accrual-based mechanism runs beside the percentage ramp. The heartbeat measures context added since the session baseline and expects compaction-file updates as the session grows. The live floor is two successful reflection updates per ten thousand accrued tokens, with three recommended and a bounded maximum debt. This does not contradict the percentage ramp: one decides when the window is crowded; the other asks whether the resume file has been maintained along the way. *[ref: heartbeat-cadence | .claude/plugins/brain_guard/hooks/heartbeat-sensor.sh + hooks/heartbeat-counter.sh + config.conf | The heartbeat uses self-accrual and successful metacog-reflect executions, with a two-call floor and three-call recommendation per ten-thousand-token tier.]*

There is also a **file-size ramp** for the compaction file itself. With the current two-thousand-word target, 70 percent coaches, 80 percent warns and blocks growth, 85 percent blocks reads of other files, and 100 percent collapses the allowed surface to the compaction path. Shrinking edits and reads of the current compaction file remain possible. The Prior Summary has its own budget and is excluded from the work-section count. The hook does not trigger compaction by itself; it narrows the available moves until the agent folds or seals the file. *[ref: file-size-ramp | .claude/plugins/brain_guard/config.conf + hooks/filesize-gate.sh | THETA_LC and its coach, warn, block, seal, and Prior Summary percentages govern a second graduated gate.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/self-compact-b5-3.png
  Concept: Historical chalk-on-blackboard illustration of the progressive context ramp using the prototype's original default 20 / 25 / 30 thresholds. The live checked-in override is now 31 / 39 / 42, so this asset is conceptual rather than a configuration display.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard, hand-drawn chalk axis, pastel stage bars, white labels, and chalk sticks along the bottom edge.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.3. The progressive-squeeze concept at the prototype's original default thresholds. The live checked-in experiment now uses 31 / 39 / 42 percent; native Claude Code auto-compaction approaches configured capacity rather than a literal 100-percent wall."
-->

## Shape compels production

The section titles are not decoration. Forward State asks for the resume coordinate. Open Threads asks what remains unknown. Assumptions & Risks asks what the current conclusion depends on. Process Insight asks what should change in the next cycle. Prior Summary asks what must survive from earlier sequences.

Call this **shape compels production**: a useful template prompts distinct kinds of thinking and makes omissions visible. The seal enforces a minimum version of that claim by refusing to proceed when any of the five required sections is empty. It does not prove that the prose is insightful. A model can fill a field with weak text, so review, specificity, and evidence still matter. *[ref: seal-shape | .claude/plugins/brain_guard/scripts/compaction-io.sh seal | The no-empty gate checks five required sections and emits section-specific prompts; other lint and decision checks add bounded structural safeguards.]*

The pattern travels well. A consultant's handoff might require scope, evidence, decisions, risks, and the next checkpoint. A research seed might require sources checked, competing explanations, uncertainty, and the next experiment. The durable value comes from choosing sections that change the quality of the next action.

## Clear and inject

The standard boundary begins with a finalization pass. It validates the required sections, folds exact duplication where it can, applies size and decision checks, stamps the current file, and advances the chain. This is a quality gate, not an independent author: it cannot invent the missing judgment the agent failed to record.

`self-compact.sh` then uses one of two local terminal carriers. Under X11 it uses clipboard and keyboard automation; under tmux it uses pane and paste-buffer operations. The dispatcher first escapes the active turn, verifies readiness where the environment permits, submits `/clear`, waits for evidence of a fresh session, and only then submits a wake prompt. These are local automation paths with bounded retries, not a native Claude Code session API. *[ref: clear-dispatch | .claude/plugins/brain_guard/scripts/self-compact.sh | The X11 and tmux paths use escape-first, clear verification, and follow-up delivery checks around the locally controlled terminal.]*

At `SessionStart(source=clear)`, the wake hook resets the context tier and active phase rhythm counter, reconstructs an orientation digest from job and phase state, loads the current compaction-chain file, loads an applicable Markdown plan, and replays the phase-entry guidance. The follow-up prompt starts the first model turn; the hook itself can supply context but cannot make the model speak. *[ref: clear-wake | .claude/plugins/brain_guard/hooks/compact-wake.sh | The clear-source path performs tier reset, phase reset, orientation, phase guidance, chain load, and plan load.]*

The result is a fresh Claude Code context grounded in durable files, not an empty mind and not a perfect continuation. The rolling summary is intentionally lossy, while references to sealed files preserve a route back to details. This gives the next session a bounded starting package and an inspectable recovery path.

Job completion uses a related `--wrap` path that seals the final file and injects a transition note based on Prior Summary. Gmode is the deliberate exception: it uses native `/compact` in place so a maintenance investigation is summarized without crossing the clear boundary.

## What would break without it

Without a maintained handoff, long work depends on whatever native summarization happens to retain. Open questions can disappear, assumptions can harden into unexplained facts, and a later session can repeat a failed route. Native compaction remains useful; the problem is relying on conversation history as the only place where project-specific continuation state exists.

`brain_guard` does not solve loss completely. Its thresholds depend on accurate usage and window configuration. Its seal mostly validates shape and boundedness. Its terminal injection can fail. Its summary can omit nuance. The design improves observability and recovery because the handoff, sealed history, state, and dispatch evidence remain inspectable.

## What you would customize

You would tune the *window denominator and percentages* for the actual model and cost profile. The current 31 / 39 / 42 experiment is one local choice, not a generally recommended threshold set.

You would tune the *compaction schema*. Different work needs different resume questions. Keep each section tied to a decision the next session must make, and remove fields that produce ritual filler.

You would tune the *file-size and summary budgets*. A larger file preserves more immediate detail but consumes more of the fresh context. A smaller file forces harder prioritization and increases dependence on back-references.

You would tune the *heartbeat*. More required reflections spend more compute maintaining the handoff; fewer reduce overhead but increase the chance that a sudden boundary catches the file stale.

You would replace the *terminal carrier* when the host offers a safer session-control API. The durable file, seal, wake context, and recovery evidence can survive that implementation change.

What should remain is the discipline: measure pressure, prepare continuity early, validate the handoff, cross the boundary deliberately, and re-ground from owned state.

---

The next part covers the plugin that gives the prototype a notion of what work it is doing — the job record, lifecycle, and unresolved obligations.

---

*Essay 5.3 — The Always-On Digital Cortex, Part 3 of 9.*

*Previous: [Essay 5.2 — Plugin Edit Safety — `plugin_integrity`](05_2-plugin-integrity.html) — a user-gated, tested, and recoverable plugin change cycle.*
*Next: [Essay 5.4 — Job Lifecycle — `job_core`](05_4-job-core.html) — the prototype's unit of work and its refusal-to-stop discipline.*
