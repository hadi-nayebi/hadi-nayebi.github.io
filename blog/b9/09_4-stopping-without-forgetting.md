---
title: "Stopping Without Forgetting"
date: "September 4, 2026"
slug: "stopping-without-forgetting"
read_time: "9 min"
tags: [Continuation, Recovery, Hooks, Origin]
status: published
version: v0.3.0
audience: "Power Users & Architects"
og_image: "assets/images/digital-cortex-2-og.jpg"
---

# Stopping Without Forgetting

*Essay 9.4 — The Visible Harness, Part 4.*

Language models naturally stop after producing a response. Agent responsibilities do not naturally end at the same boundary.

A tool may still be running. A second comment may be waiting behind the current task. The agent may have changed files but not verified them. Verification may be complete while the user has not reviewed the result. A question may make further progress impossible for now. The user may simply want one communication channel to pause.

If all of those situations are represented by silence, the harness cannot distinguish completion from interruption, waiting, abandonment, or human control.

Stopping without forgetting requires explicit state.

## Response Completion Is Not Responsibility Completion

The end of a model turn is a property of the conversation runtime. The end of a responsibility is a claim about durable work.

Confusing them produces a common failure: the agent writes a plausible closing paragraph while actionable work still exists. The session feels finished because the language is finished.

Origin 1.0 places one Stop hook for each installed engagement channel at that boundary. A hook does not ask whether the last response sounded complete. It reads the clone-local continuation state owned by its channel and decides whether that channel still has runnable responsibility. Any active channel blocks Stop; a passive channel abstains and cannot overrule another active vote.

Each channel state has four modes: `active`, `waiting`, `paused`, and `idle`. They are not four writing styles. They describe four different relationships between responsibility, progress, and authority.

## Active Means Useful Progress Exists

`active` means at least one responsibility in that channel is runnable. Codex may be implementing, inspecting, verifying, recovering, or moving the next ordered item into focus. That channel's Stop hook blocks completion because another response boundary is not evidence that the work disappeared.

The block should not create a loop. Its voice names the current evidence, owning reference, and next valid boundary. The agent retrieves the record through its owning plugin, continues the bounded objective, leaves inspectable progress, asks a recorded question when a real decision is missing, or moves verified work to user review.

Active state is not an instruction to generate indefinitely. It is a refusal to confuse available progress with legitimate stopping.

## Waiting Is a Recorded Dependency

`waiting` means every remaining responsibility in that channel is blocked on a specific user answer, permission, or external condition. Continued generation would create motion without authority or evidence.

Waiting must be earned. One blocked thread does not make its channel waiting when another open thread there can progress. Each engagement plugin scans its complete queue and reconciles its own state. The whole agent relationship may stop only when no installed channel reports runnable work.

This prevents two opposite failures. The agent cannot use waiting as a convenient exit while useful work remains. It also cannot fill uncertainty with guesses merely to remain active.

Stopping is allowed in waiting, but the work is not complete. The recorded question and thread survive. When the answer arrives, one journal event stores the answer and makes the responsibility runnable. Origin then records a durable wake for the same interactive session.

## Paused Is Human Interruption

`paused` belongs to the user and to one selected channel.

A pause may occur while the queue is active, waiting, or empty. It does not resolve, dismiss, or verify anything. It says that human control outranks the harness’s preference to continue.

New input can arrive during a pause. Validated reconciliation updates the selected channel's preserved resume state without overriding the pause itself. The other channel continues independently. When the user resumes, Origin derives current state from everything that changed during the interruption rather than restoring a stale snapshot.

Pause is therefore not a frozen lie about the queue. It is a durable authority layer over a queue that may continue to receive evidence.

## Idle Is Derived, Not Declared

`idle` means one owning plugin reports no runnable responsibility and no recorded wait or review condition that requires Codex to remain active for that channel.

The agent should not set idle because it wants to stop. Each engagement service derives the appropriate continuation state from its authoritative journal. Dashboard and Telegram state remain separate, while neutral lifecycle code enforces the shared state contract without inventing plugin-specific meaning.

This division matters as more cognition is added. A future job plugin, scheduler, or recovery organ may also have runnable responsibility. Stopping should be the composition of every owning source, not the confidence of whichever component spoke last.

Origin 1.0 demonstrates the pattern with two independently removable engagement queues and OR-composed Stop hooks. It does not claim the general coordinator that later kinds of cognition may require.

## Review Is Still Unfinished Work

An agent may implement and verify a change, then mark its feedback `ready_for_review`. At that point, no further implementation may be appropriate until the user judges the outcome.

The system can legitimately wait, but it cannot call the thread resolved. For actionable work, acceptance is the owner's merge of the thread's exact linked pull request through the dashboard or paired Telegram. If the owner rejects the work, the thread reopens, prior history remains, and active responsibility returns. Only after GitHub confirms the merge does the plugin resolve the thread and scan for the next runnable item before allowing idle.

This creates an important distinction: stopping may be valid before completion, and completion may require someone other than the agent.

## Restart Is Part of Stopping

Stopping is safe only if resumption is real.

Each Origin engagement plugin stores conversation in an append-only, sequence-numbered journal with hashes, maintains backups, keeps channel continuation state under the local `.origin/` directory, and records pending wake delivery in its durable outbox. Origin saves the thread and its wake intent before attempting terminal delivery. On startup, missing wake records for actionable journal revisions are reconstructed and pending delivery resumes.

If a fresh Codex session opens while runnable feedback exists but no wake is pending, Origin creates a session-resume orientation. The voice points the agent back to the current thread and ordered queue. The new context window does not become permission to reconstruct responsibility from memory.

This is why recovery is not a separate convenience added after Stop. Recovery is what makes stopping honest.

## Corrupt State Fails Closed

Missing or corrupt continuation state creates uncertainty about whether work remains. The owning channel's Stop hook therefore fails closed rather than assuming idle.

The combined launcher initializes installed channel state before opening Codex, and each engagement plugin can reconcile its state from durable thread evidence. The valid recovery path is to inspect and repair state through owned interfaces—not delete `.origin/`, force an idle value, or let the model talk past the boundary.

Failing closed can be inconvenient. Silently discarding user responsibility is worse.

## The Boundary Is Behavioral, Not Absolute Security

Origin’s components run under one trusted local operating-system user. A sufficiently malicious local process could edit files or bypass ordinary interfaces. Neither the Stop hooks nor the owner-authority PreToolUse hook is a sandbox against that attacker. The latter deterministically denies supported agent merge and protected-base paths after the user trusts it; GitHub branch protection is the stronger remote enforcement layer.

It is a deterministic behavioral boundary for the intended agent relationship. It makes incomplete continuation visible, blocks the ordinary stop path while any channel is active, records why waiting is legitimate, preserves explicit human pause per channel, and requires idle to be derived from owned state.

Accurate claims about this boundary matter. Calling it perfect security would be false. Calling it merely a reminder would ignore the nonzero hook exit and tested state contract.

## A Good Stop Preserves the Next Beginning

The goal is not to keep an agent alive forever. The goal is to stop at a boundary that the user and the future agent can understand.

Active preserves progress. Waiting preserves the missing condition. Paused preserves human control. Idle preserves the fact that an owning channel's queue was actually exhausted. The journals, outboxes, and resume voices preserve the paths back.

The harness can then let the model stop without allowing responsibility to evaporate with the response.

---

*Essay 9.4 — The Visible Harness, Part 4 of 4. Previous: [Essay 9.3 — Internal Voices Are Reorientation, Not Notifications](09_3-internal-voices-reorientation.html). This essay closes the series.*
