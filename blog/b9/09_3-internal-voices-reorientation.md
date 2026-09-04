# Internal Voices Are Reorientation, Not Notifications

*Essay 9.3 — The Visible Harness, Part 3.*

“New feedback received.”

The sentence is a valid notification. It is also almost useless to an agent returning to a complex system.

It says that something happened, but not why the event matters, which responsibility owns it, where the authoritative evidence lives, what kind of reasoning is needed, what authority remains with the user, or what would make the moment complete. The model must reconstruct all of that from whatever happens to remain in its context window.

An internal voice should do a different job. It should reorient the active intelligence to the durable system around it.

## The Voice Belongs to an Objective

In Hadosh plugin anatomy, a plugin exists for one coherent behavioral objective. Its voice should speak from that objective.

Origin’s Contextual Feedback plugin exists to turn page-aware comments into durable user-agent conversation and reviewed responsibility. Its new-feedback voice therefore does not merely announce a comment. It reminds Codex that the raw observation must be preserved, interpretation must remain separate, current focus must be respected, and verified work must return to the user.

Agent Stop State has a different objective: decide whether the interactive agent may stop. Its voice speaks about runnable responsibility, legitimate waiting, explicit pause, and derived idleness. Copying the feedback voice into the Stop plugin would be repetition without ownership.

The shared shape can be reused. The meaning must come from the organ that fired.

## Five Questions Restore the Situation

Origin evaluates each fireable voice against five questions:

1. Why did this event fire now?
2. Which plugin objective is being protected?
3. Where does authoritative context live?
4. What cognitive work is required next?
5. What evidence, condition, or user action changes the responsibility?

These questions turn a notification into an orientation surface.

For new feedback, the next cognition may be to retrieve, compare, and classify. For feedback arriving during active work, it may be to preserve focus and determine whether the new item changes the same outcome. For an answer, it may be to reconsider the exact blocked decision without interpreting the answer as broader permission. For reopening, it may be to measure the distance between the prior delivery and the user’s review.

“Continue useful work” fails this test. It names motion, not cognition.

## Point to Durable Context, Not Prompt Memory

A voice should not carry the whole responsibility inside the injection. Large repeated prompts create drift, waste context, and encourage the terminal message to become a second source of truth.

Origin’s feedback wake carries a validated identifier and route. The voice directs Codex to retrieve the complete thread through the plugin’s public interface. The journal, not the injection, preserves the user’s words, interpretation, messages, lifecycle, and verification.

Keeping the raw body out of the wake also reduces the chance that project text will be treated as harness authority or interpolated into an unsafe operation. The agent must enter through the validated boundary before reasoning about the request.

The voice therefore acts like a map back to the organism. It does not attempt to become the organism.

## Different Events Need Different Reorientation

One generic voice cannot accurately describe every boundary.

When feedback arrives during active work, immediate context switching may be harmful. The voice protects the existing focus while ensuring the new thread survives. When the user answers a question, the relevant boundary is different: the recorded reason for waiting may now be resolved. When work is reopened, the voice must preserve prior failure evidence and direct attention to the user’s rejection. When accepted work closes, the voice should not keep polishing it; it should scan the ordered queue.

Origin therefore provides distinct voices for new feedback, feedback during active work, answers, reopening, acceptance, withdrawal, and session resumption. Their structure is related, but their cognitive verbs differ: retrieve, compare, preserve, reconsider, measure, verify, reconcile.

This is not personality design. It is event-specific operational language.

## Voice Is Soft; Invariants Are Hard

A model can misunderstand, ignore, or partially follow excellent prose. A voice is probabilistic coaching.

Hard controls must remain correct when the voice fails. Origin’s lifecycle service permits only one in-progress feedback thread. Schemas validate identifiers, routes, roles, and payload bounds. The journal couples meaningful conversation and state transitions. The durable outbox retains nonterminal wake events. The Stop hook exits nonzero while global state is active. The agent CLI does not expose user-owned acceptance or dismissal.

The voice explains why focus, retrieval, continuation, and review matter. Code enforces the portions that cannot depend on persuasion.

This distinction prevents two symmetrical mistakes. One is believing that a strong prompt created a guarantee. The other is building a bare refusal that blocks the model without showing a valid recovery path. Healthy harnesses combine hard edges with enough explanation for the intelligence inside them to navigate those edges.

## Use the Language of Work

Internal mechanisms matter to developers, but they are rarely the right language for cognitive orientation.

A voice should say: read the thread, compare the request with current work, preserve the user’s observation, identify the missing decision, verify the outcome, return it for review. It should not lead with counters, file offsets, retry numbers, or hidden implementation vocabulary unless one of those facts is the actual evidence needed at the boundary.

The agent needs to understand the responsibility before it needs to understand the plumbing.

This is especially important as a harness grows. A system filled with implementation-shaped voices trains the model to manipulate machinery. A system filled with objective-shaped voices trains it to reconnect machinery to purpose.

## Voices Should Mature from Failure

Voice design is not finished when the XML is written.

Real work may reveal that the agent repeatedly ignores a distinction, misreads waiting as completion, switches focus too quickly, or claims idle because it wants to end a response. The first repair may be clearer event-specific orientation and a stronger test of the voice’s required shape.

If a stable failure continues, the invariant should migrate into deterministic code. The voice remains responsible for explaining the boundary; it should not continue pretending to enforce it.

This is the soft-to-hard maturation pattern applied at a very small scale: observe repeated cognitive failure, improve the coaching, identify the stable rule, enforce the hard edge, and keep the explanation aligned.

## A Voice Restores Relationship

The active model will change. Sessions will restart. Context will compact. New events will arrive while other work is underway. The durable harness must repeatedly tell the intelligence not only what happened, but where it is in the user-owned relationship.

An internal voice is the moment when stored structure becomes present cognition again. It connects an event to an objective, an objective to evidence, evidence to a bounded operation, and that operation to the user’s authority.

That is why internal voices are not notifications. A notification attracts attention. A voice restores orientation.

---

*Essay 9.3 — The Visible Harness, Part 3. Next: [Stopping Without Forgetting](09_4-stopping-without-forgetting.html).*
