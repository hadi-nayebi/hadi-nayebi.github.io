# The Dashboard and the Harness Are One System

*Essay 9.1 — The Visible Harness, Part 1.*

---

Imagine leaving a note on a workshop door: “Add a place where I can see every blocked project.” You return tomorrow. The note is gone. The carpenter remembers that you wanted *something*, but not where you wanted it, why it mattered, whether work began, or who decides when it is finished.

That is what a dashboard becomes when it is separated from its harness: a polished door covered in disposable notes.

A dashboard is usually described as the visual layer. The harness is described as the machinery behind it: state, instructions, tools, permissions, jobs, verification, and memory. The distinction is useful for discussing parts. It becomes dangerous when the parts are built as strangers.

The dashboard and the harness are two surfaces of one operational system. The user sees and directs the world through the dashboard. The agent interprets and changes that world through the harness. Durable state is the meeting place.

## One World, Two Surfaces

In [Origin 1.0](../../projects/origin.html), the page begins almost empty. A Wiki control sits on one side. A Feedback control sits on the other. The emptiness is not the product. It is room for the user’s own operational world to appear.

The user may also be speaking directly to Codex in the terminal. These are not two agents and not two separate conversations that occasionally synchronize. The dashboard sends events into the same foreground interactive Codex session the user can see and address. Terminal dialogue and dashboard activity meet one continuing relationship.

This choice matters. A hidden headless worker can process a queue, but it creates a second agent relationship beside the one the user already inhabits. The interactive-session design keeps the agent legible: the user can watch it wake, talk to it directly, interrupt it, inspect what it is doing, and see dashboard events arrive with an explicit source.

The transport is tmux, a terminal multiplexer that can keep a named terminal session alive and accept bounded input. But tmux is plumbing, not cognition. It carries a wake event. It does not decide what feedback means, whether work is authorized, or when responsibility is complete.

## Save Before Wake

The most important moment occurs before the agent sees a prompt.

The system first saves the user’s original words, route, timestamp, and thread state. Only after that durable write succeeds does it create a wake event. The injected message carries a stable feedback identifier, the route, and a unique delivery marker. It does not use the transient terminal prompt as the authoritative copy of the request.

This reverses the fragile pattern used by many chat interfaces. In the fragile pattern, the prompt is primary and persistence is optional. If delivery fails, the request may disappear. In the durable pattern, state is primary and delivery is a recoverable attempt to draw the agent’s attention to it.

If Codex is idle, the event is submitted. If Codex is already working, the event waits in an outbox rather than interrupting a tool call or displacing the current objective. A later delivery still points to the same authoritative record. Restarting the harness does not require the user to remember which comments were lost because unresolved state can be reconciled at startup.

The principle is simple: **attention may be transient; responsibility cannot be.**

## The Voice Reorients

A wake message that says “new feedback received” is technically accurate and cognitively weak. It announces an event without restoring the agent’s purpose.

A useful internal voice answers five questions. Why did this event fire? Which plugin objective is being protected? Where does authoritative context live? What kind of cognitive work is required now? What evidence or user action opens the next boundary?

When new feedback arrives during active work, the voice should not blindly demand an immediate context switch. It should tell the agent to inspect whether the new item changes the current objective, can be resolved with it, or belongs behind it in the durable queue. The probabilistic agent chooses how to reason about the relationship. Deterministic state ensures neither item disappears.

This is the division between soft orientation and hard control. A voice explains the situation. Schemas, services, hooks, and tests preserve the invariant when the voice is misunderstood or ignored. The voice is not a decorative notification, and it is not the enforcement mechanism.

## Two Plugins, One Runtime

It would be easy to call everything “the feedback plugin.” That would be convenient today and expensive tomorrow.

Origin separates two cognitive concerns. The contextual-feedback plugin owns the thread: original input, interpretation, messages, questions, work state, verification, user review, reopening, event voices, and the commands and tests that protect those contracts.

The agent-stop-state plugin owns a different question: may the interactive agent stop? It tracks whether the harness is idle, active, waiting, or paused. Runnable feedback keeps the system active. One blocked thread does not justify waiting when another thread can progress. Pausing is an explicit user control, not a disguised completion state.

The runtime owns neither concern. It starts the local server, opens the browser, creates or reuses the repository-scoped tmux session, launches Codex, queues wake events, verifies paste and submission evidence, and recovers pending delivery. This is [plugin anatomy](../b7/07_1-plugin-kit-foundation.html) applied through compartmentalization: cognition belongs to bounded organs; transport belongs to infrastructure.

## Completion Returns to the User

The agent can implement a page and run every relevant test. It still cannot know that the user’s need has been satisfied.

Origin therefore splits verification from acceptance. The agent records what changed and how it was checked, then moves the thread to `ready_for_review`. The dashboard user can accept it, reopen it with a reason, or dismiss it. The agent-facing command surface does not expose those review actions.

This is not a security boundary against a malicious process running under the same operating-system account. It is a capability and audit boundary inside one trusted local relationship. Its purpose is to keep the ordinary workflow honest: implementation is the agent’s claim; closure is the user’s judgment.

When the user reopens a thread, the prior history remains. A new wake event returns the same agent to the same durable conversation. Rejection does not erase work, and acceptance does not retroactively convert every earlier interpretation into the user’s words.

## What the Foundation Does Not Pretend

Origin 1.0 does not contain a general job system. Feedback records are its first durable queue. A later dashboard may promote substantial feedback into jobs that coordinate several threads, survive multiple cycles, or carry their own plans. Calling feedback a job before that machinery exists would make the documentation sound mature while making the implementation harder to inspect.

It also does not ship an OPEVC engine, accounts, remote access, synchronization, or team authority. The Wiki explains how those layers can grow; it does not turn future architecture into present capability.

The same honesty applies to evidence. Automated tests can prove state transitions, schemas, hooks, adapter commands, APIs, interface behavior, and recovery logic. They cannot prove that a particular person’s authenticated Codex session opened correctly inside tmux on a particular laptop. That requires a separate local acceptance run.

## The Empty Page Is a Beginning

A user should not clone the dashboard and spend a week admiring its emptiness.

By the time Start Here introduces Origin, the helping agent should already have an Asset Charter, a verified handoff, and enough context to propose the smallest useful pages in the user’s language. The shared substrate saves that agent from rebuilding installation checks, session ownership, feedback persistence, stopping, recovery, and review. The saved effort goes into differentiation.

Then the user begins shaping the system from inside the system. “Add a client timeline here.” “This status name makes no sense to me.” “Show the unanswered research question beside the draft.” Each comment lands in context. Each unresolved responsibility survives the session. Each proposed completion returns for judgment.

The dashboard becomes the user’s visible world. The harness becomes the durable structure that keeps that world coherent. They grow together because they were one system from the first saved comment.

---

*Essay 9.1 — The Visible Harness, Part 1. Next: [The Contextual Feedback Plugin](09_2-contextual-feedback-plugin.html).*
