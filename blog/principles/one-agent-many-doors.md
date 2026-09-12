---
title: "One Agent, Many Doors"
date: "September 2026"
slug: "one-agent-many-doors"
read_time: "11 min"
tags: [Agents, Interfaces, Reliability, Origin]
audience: professionals
og_image: "assets/images/digital-cortex-2-og.jpg"
series: "Hadosh Academy – Principles & Perspectives"
version: v1.0.0
status: published
---

# One Agent, Many Doors

Most agent interfaces quietly make the same architectural mistake: they confuse a new doorway with a new relationship.

Open a terminal and you meet one agent. Open a dashboard and you meet another. Send a message through a bot and a third process answers without knowing what happened in either of the first two places. The interfaces may share a model name, but the user experiences fragmentation: repeated context, conflicting answers, invisible queues, and no reliable way to know which request still matters.

The better goal is simple to state:

> **One user should have one continuing relationship with the agent, even when that relationship can be reached through several doors.**

That is the direction behind [Origin](../../projects/origin.html). The terminal remains the direct conversational surface. The dashboard adds contextual feedback attached to the visible object the user is shaping. Telegram can add a remote text surface before any speech system is installed; local transcription and cloned-voice rendering are optional additions. These are not three agents. They are three ways to reach one agent relationship.

But “one relationship” does not mean putting every message into one undifferentiated queue. Continuity and independence have to coexist.

---

## A Relationship Is Larger Than a Chat Window

When people say they want to continue a conversation, they rarely mean only that they want the transcript restored. They want the working relationship restored.

The agent should return to the same repository, instructions, tools, permissions, durable records, and unresolved responsibilities. It should know what it was doing, what the user accepted, what remains blocked, and which items are ready to continue. The conversation history matters, but it is only one part of that operational continuity.

This is why startup behavior matters. A single launch command should start the local server, open the dashboard in the user's browser, and return the terminal to the latest Codex session when one exists. A first-time user should get a fresh session automatically. The user can then speak directly in the terminal exactly as they would when starting Codex alone.

The dashboard does not replace that conversation. It adds context the terminal does not naturally possess.

If the user is looking at a particular card, draft, chart, or page region, a feedback control can preserve where the request came from. “Add a comparison here” becomes more useful when *here* has a durable route and object identity. The feedback thread can keep the user's original words separate from the agent's interpretation, questions, progress, verification evidence, linked pull request, and the owner's final merge decision.

Telegram adds a different kind of context: reach. The user may be away from the computer but still needs to capture a request, answer a question, or receive a result. The remote surface should join the same relationship without pretending that it has the same delivery conditions or privacy boundary as the local dashboard.

The interfaces differ. The relationship continues.

## Independent Channels Are a Safety Property

Once several channels reach one agent, there is a temptation to create a single global state called `busy`, `waiting`, or `done`. That makes the implementation look tidy and the user's work behave badly.

Consider two dashboard threads. One is waiting for the user to choose between two layouts. The other is ready for the agent to fix a broken link. If the first thread marks the entire system as waiting, the second request is starved. If the second marks the whole system as active, the first thread's need for a decision disappears from view.

Each channel therefore needs to own its own records and continuation state:

- Contextual feedback owns its raw input, route context, thread history, questions, work state, verification, and review state.
- Telegram owns its inbound update identity, message history, authorization decision, outbound delivery state, text response, and voice-rendering result.
- Direct terminal conversation remains native to the interactive Codex session rather than being copied into either plugin's database.

Independence is not duplication. Both plugins can use the same neutral runtime to locate the active terminal session and request attention. Neither plugin should own the terminal transport itself. The runtime moves an event; the plugin owns what that event means.

This separation gives each channel room to evolve. Dashboard feedback may later grow richer page anchors or become part of a job. Telegram may add a different authentication flow or audio provider. Those changes should not rewrite the other channel's history or permission model.

## Stop Is Composed, Not Declared

The agent needs one answer to a practical question: may this session stop?

No single plugin can answer for the whole system. The answer has to be composed from all participating channels. Conceptually, each channel publishes one of a small number of states:

| State | Meaning |
| --- | --- |
| `active` | Runnable work exists now. |
| `waiting` | Nothing can continue until the user or an external dependency responds. |
| `paused` | The user deliberately suspended this channel. |
| `idle` | This channel has no unresolved responsibility. |

The aggregate rule is conservative: if any enabled channel has runnable work, the agent remains active. Waiting is appropriate only when no channel can progress and at least one unresolved item is genuinely blocked. Paused work remains visible but does not silently masquerade as finished. The session becomes idle only when every enabled channel has reached a state that permits rest.

This is an OR-composition rule for responsibility. One active channel is enough to keep the relationship awake.

It also prevents a subtle failure: a blocked request in one doorway cannot make the agent ignore actionable work that arrived through another.

## Delivery Is a State Machine, Not a Function Call

Moving a request into an interactive terminal looks deceptively simple. Paste some text. Press Enter. Continue.

In reality, the sender can fail before the paste, after the paste but before submission, after submission but before confirmation, or while saving the delivery receipt. A process restart can occur between any two steps. If the system records only “success” or “failure,” it eventually either loses work or submits the same request twice.

A durable transport needs explicit delivery states. The exact vocabulary can vary, but the distinctions should not:

- `pending`: authoritative input exists; no delivery attempt has begun.
- `retrying`: a prior attempt failed before a side effect could have occurred.
- `delivering`: one worker has claimed the attempt and is performing it.
- `indeterminate`: a side effect may have occurred, but confirmation was lost.
- `delivered`: the terminal accepted a uniquely identified event and evidence was recorded.

The system persists the request *before* trying to wake the agent. It gives every delivery a stable identifier. It records enough evidence to distinguish a safe retry from an ambiguous one. It expires abandoned worker claims so a crashed helper cannot wedge the queue forever. When an attempt is indeterminate, it stops guessing and exposes the condition for reconciliation.

This is less dramatic than a new interface. It is also what makes the interface trustworthy.

## Questions Must Return Through the Door That Owns Them

A dashboard request can begin a thread of its own. The agent may need clarification before it can act. That question belongs in the same thread, beside the same route and original wording, because that is where the user can understand what decision is being requested.

The same rule applies to Telegram. A question raised from an authorized Telegram request should return through Telegram and be recorded in Telegram's own history. The exact written message is authoritative. A cloned-voice message may accompany it for warmth and accessibility, but audio should not replace the readable record.

This distinction matters for both reliability and consent. Text can be inspected, searched, quoted, and compared with what the agent intended to send. Voice can be convenient and personal, but it introduces an additional provider, credential, rendering step, and possibility of ambiguity. Treating audio as a derived companion keeps the durable meaning visible.

## Agent Completion Is Not Owner Acceptance

An agent can modify a page, run the entire automated suite, and explain what changed. It still cannot decide that the user's need has been satisfied.

The dashboard should therefore separate agent verification from owner closure. In Origin, an actionable parent thread becomes one isolated worktree and one linked GitHub pull request. The agent can implement on that branch, verify the result, and move the thread to `ready_for_review`. The owner can merge that exact PR, reopen the thread with a reason, withdraw it, or pause the channel. Reopening should preserve the thread rather than creating a disconnected complaint about the previous attempt.

The merge is more than a convenient button. It gives acceptance a concrete repository event. The dashboard or paired Telegram command asks an owner-facing broker to inspect the current thread version, repository, branch, and pull-request state. Resolution is recorded only after GitHub confirms the merge. A trusted pre-tool hook blocks the supported agent merge paths while still allowing the agent to push its feature branch and open the PR.

That hook is a deterministic boundary inside the trusted agent tool path, not an operating-system sandbox against malicious code already using the owner's account. When stronger remote enforcement is needed, branch protection belongs on GitHub. Honest authority design says both what is prevented and where the guarantee ends.

Telegram needs the same intellectual honesty even when its interaction design differs. A delivered reply proves delivery, not satisfaction. A completed automation proves a technical result, not that the result served the user.

The rule is broader than Origin:

> **The agent may report completion. The owner decides whether its pull request becomes accepted history.**

## What Can Be Proven Before the Owner Opens a Laptop

A serious open-source project should automate nearly everything that does not require the owner's identity, credentials, hearing, or device-specific judgment.

Tests can cover schemas, state transitions, API contracts, authorization rejection, queue ordering, retry recovery, Stop composition, route context, browser builds, accessibility structure, disabled-feature behavior, and mocked Telegram and voice-provider responses. They can start the server, drive the interface, terminate workers, restore state, and verify that a fresh repository behaves predictably.

Those tests are necessary. They are not the final proof of every claim.

A maintainer still has to distinguish three evidence levels:

- **Automated:** repeatable in the repository without private credentials.
- **Integration preview:** exercised against a real Codex installation, bot, or voice provider in a controlled environment.
- **Owner acceptance:** experienced on the owner's actual laptop, account, browser, microphone, speakers, and network.

Until the third level is complete across the promised platforms, the honest label is preview, not generally available. Linux behavior does not automatically prove WSL2 behavior. A mocked Telegram response does not prove that the intended bot received a message. A generated audio file does not prove that the cloned voice sounds acceptable to its owner.

Clear evidence labels do not weaken a release. They tell contributors exactly what is known and what still needs to be learned.

## The Product Is the Continuity

The visible feature is a floating input button. Or a terminal. Or a Telegram chat.

The deeper product is the continuity behind them: one inspectable relationship, several independently owned channels, durable responsibility, conservative delivery, explicit stopping, and closure that returns to the owner.

That structure lets a person begin with a guided but domain-empty local dashboard and shape it by using it. A comment can become a thread. A thread can become an isolated branch and a reviewable PR. The owner's merge can make it accepted history. Repeated work can later become a job or a new plugin. The shared runtime absorbs the repetitive machinery, while each person's pages and practices grow differently.

One agent, many doors. The doors should remain distinct. The relationship should not have to start over each time one opens.

---

*Previous: [The AI That Grows With You](the-ai-that-grows-with-you.html), the case for a user-owned personal harness.*

*Next: [The Visible Harness](../b9/09_1-dashboard-and-harness.html), the four-part technical series grounded in Origin's implementation. You can also inspect the [public Origin repository](https://github.com/hadi-nayebi/origin).*
