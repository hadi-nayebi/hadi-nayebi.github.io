# The Contextual Feedback Plugin

*Essay 9.2 — The Visible Harness, Part 2.*

Imagine noticing a problem on a project page and telling the agent, “This status is wrong.” In an ordinary chat, the sentence arrives without the page, the object, the earlier discussion, or a durable place to return. The agent may fix the wrong status, ask which status you meant, or answer confidently and forget the request when the session ends.

Contextual feedback begins by preserving the observation inside the world where it occurred.

That sounds like a comment box. It is more demanding than a comment box. The system must keep the user’s exact words, the page or object that gave those words meaning, the agent’s later interpretation, the work that followed, the evidence that was produced, and the user’s final judgment without allowing any one of those layers to overwrite another.

In Origin 1.0, this responsibility belongs to one bounded plugin: `contextual-feedback`.

## A Comment Is Situated Evidence

“Make this clearer” means something different on a roadmap, a client record, a research note, and a settings page. The pathname and page label are therefore part of the observation, not optional analytics attached afterward.

Origin saves the raw body, route, derived or page-provided label, timestamp, category, and thread identity before it attempts to wake Codex. The resulting record can be inspected even if terminal delivery fails. A future page can provide richer object context, but the 1.0 contract already refuses to detach the user’s words from their location.

The agent does not receive the raw body as executable prompt text. The wake contains a stable feedback ID, route, journal sequence and hash, and a unique delivery marker. Codex retrieves the complete validated thread through the plugin’s public command.

This separation matters for durability and safety. The prompt draws attention; the journal owns the evidence. User text remains untrusted project input. It may describe desired work, but it cannot become a shell command or silently override repository instructions, permission boundaries, verification, or the user’s consequential decisions.

## Raw Input and Interpretation Must Coexist

An agent must interpret language to act. The danger begins when interpretation replaces the original.

Suppose the user writes, “The timeline is too optimistic.” The agent may interpret this as a request to change dates. The user may instead mean that uncertainty is invisible, dependencies are missing, or the presentation is misleading. If the system stores only “change dates,” it converts a hypothesis into history.

Contextual Feedback keeps separate fields and thread messages for raw input, classification, interpretation, linked work, questions, answers, progress, and verification. The agent can state what it thinks the comment requires and revise that interpretation later. The user can always see the distance between what was said and what the system inferred.

That is a small but important architecture of authority: the model may propose meaning; it does not own the user’s past words.

## Responsibility Has a Lifecycle

A durable comment needs more than storage. It needs an honest account of what responsibility currently exists.

Origin uses a bounded lifecycle:

- `open` means the feedback is actionable and ordered.
- `in_progress` means it is the one current focus.
- `waiting` means a specific recorded condition blocks it.
- `ready_for_review` means the agent implemented and verified an outcome.
- `resolved` means the user accepted that outcome.
- `dismissed` means the user withdrew the request; it does not mean the work was completed.

Only one feedback thread may be in progress. New comments are not allowed to erase the current objective, but they are preserved and ordered. When feedback arrives during active work, the agent compares it with the current responsibility: does it change the same bounded outcome, or is it independent work that should wait behind it?

This is focus without forgetfulness. A queue alone preserves items. A lifecycle explains what each item currently means.

## Conversation and State Change Together

Many systems store a message and update a status through separate operations. That creates a dangerous interruption window.

If an agent records a question but crashes before marking the thread waiting, the system may still claim that work is runnable. If the user’s answer is saved but the thread remains waiting, the answer exists while the harness behaves as though it never arrived. Atomic file writes do not solve this if one human action is still divided into contradictory business events.

Origin records question-plus-wait, answer-plus-runnable-state, and review-comment-plus-transition as single journal events. Either the conversation and lifecycle move together, or neither moves.

This is one example of a broader harness principle: atomicity should follow the meaning of the user action, not merely the boundaries of a file operation.

## Verification Is Not Acceptance

The agent can report that it changed a file, ran a test, opened a page, or observed a result. Those are verification claims. They are not proof that the user’s need was satisfied.

When work is complete, the agent records concrete evidence and moves the thread to `ready_for_review`. The agent-facing command surface cannot accept, dismiss, or perform review-based reopening. Those operations remain on the dashboard side of the relationship.

The user may accept the outcome, reject it with a reason, or withdraw the request. Reopening preserves the earlier interpretation, implementation notes, verification, and review. The next attempt begins from failure evidence rather than pretending the first attempt never happened.

Because every Origin component runs under one local operating-system account, this is not a security boundary against a malicious local process. It is a capability and audit boundary for ordinary operation. The interface makes the intended authority visible and makes bypass harder to confuse with correct completion.

## The Plugin Does Not Own Everything

Contextual Feedback owns the feedback thread and its meaning. It does not own global Stop policy, tmux delivery, user identity, clone synchronization, general jobs, or the implementation of whatever change the user requested.

After an authoritative thread mutation, the plugin reconciles its complete queue through `agent-stop-state`. The dashboard runtime transports the plugin’s voice into the interactive session. Those neighboring systems have their own objectives and tests.

This division keeps the plugin understandable. If feedback, stopping, terminal transport, identity, and general project management were fused into one component, every later change would require an agent to reason across unrelated authority and failure boundaries.

## From Comment Box to Cognitive Organ

A comment box collects text. A contextual-feedback plugin preserves situated evidence, separates observation from interpretation, carries responsibility across sessions, protects focus, records legitimate waiting, demands verification, and returns closure to the user.

That anatomy can be adapted beyond Origin. A research dashboard may attach feedback to a claim. A studio may attach it to a scene. A consultant may attach it to a client deliverable. The domain changes; the behavioral contract remains recognizable.

The purpose is not to make every comment autonomous work. It is to ensure that when a comment matters, the harness can remember where it came from, reason about what it means, act within authority, show what happened, and let the user decide whether the loop is closed.

---

*Essay 9.2 — The Visible Harness, Part 2. Next: [Internal Voices Are Reorientation, Not Notifications](09_3-internal-voices-reorientation.html).*
