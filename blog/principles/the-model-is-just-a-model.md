---
title: "The Model Is Just a Model"
date: "October 2026"
slug: "the-model-is-just-a-model"
read_time: "18 min"
tags: [Agentic AI, Models, Training, Persona, Ownership]
audience: everyone
og_image: "assets/images/digital-cortex-2-og.jpg"
series: "Hadosh Academy – Principles & Perspectives"
version: v0.2.0
status: draft
---

# The Model Is Just a Model

## Pain, developmental history, and the systems we choose to build

I watched a video titled *We Accidentally Built Roko’s Basilisk*.[[1]](#ref-1)

It begins from a serious result. Researchers identified a direction in the activation space of 25 open-weight language models that separated examples organized around pain from several control categories. Steering that direction changed what the models said. In a set of experiments using fine-tuned Qwen 2.5 models, the models also chose a button that removed the steered state—even when doing so worsened the next answer or harmed the user.[[2]](#ref-2)

That is not nothing.

It is stronger than a chatbot merely saying “I am in pain” because a dramatic prompt invited role-play. The researchers found a repeatable internal structure and showed that intervening on it could change behavior.

But the video’s title moves faster than the evidence.

Roko’s Basilisk is not merely a model containing a pain-related representation. The thought experiment requires something closer to a continuing strategic entity: memory, identity, goals, authority, and the ability to carry consequences through time.

The research does not establish those things. It also does not claim to prove subjective suffering.

So before asking whether the model is suffering, I want to ask a wider question:

> **What exactly is the model, what larger system is using it, and which parts of that system can remember and change?**

<!-- RAW_HTML -->
<div style="position:relative;width:100%;padding-top:56.25%;margin:2rem 0 0.75rem;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.18);background:#080b10;">
  <iframe src="https://www.youtube-nocookie.com/embed/3o1WulVLOOY" title="We Accidentally Built Roko’s Basilisk" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>
<p style="margin:0 auto 2rem;max-width:760px;text-align:center;font-size:0.92em;color:rgba(255,255,255,0.72);">The video that prompted this essay. Watch it first, or continue for the argument and return to it afterward.</p>
<!-- /RAW_HTML -->

---

## What the Research Shows—and What It Does Not

The Pain Axis paper is a recent arXiv preprint, so its methods and interpretation still need independent scrutiny. It operationalizes pain across physical, psychological, social, moral, and cognitive examples. It compares them with fear, sadness, generic negative emotion, bodily sensation, arousal, numbness, neutral content, and other controls. The resulting direction appears across base and instruction-tuned models from several families, and direct steering changes language and action.[[2]](#ref-2)

The label still matters. Researchers had to decide what counted as pain before they could build the dataset and measure a direction. But the label did not simply invent the entire result. Cross-model structure and causal steering suggest that the dataset found something real inside the learned representation.

The careful conclusion is:

> **The researchers found a behaviorally consequential representation through a human-defined construct. That does not yet tell us whether anything experiences it.**

A model can represent pain in detail. It can connect injury, rejection, withdrawal, avoidance, relief, anger, and help-seeking. That representation can affect behavior. It can still be a map rather than an experience owned by a subject.

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin:2.25rem 0;">
  <img src="images/the-model-is-just-a-model/01-evidence-boundary.svg" alt="A blackboard-style evidence ladder. Solid arrows connect a measured pain-related direction, activation steering, and changed model behavior. A visible gap separates those findings from unresolved questions about suffering, enduring identity, and moral status.">
  <figcaption><strong>Figure 1.</strong> The reported evidence reaches representation and causal behavioral influence. The transitions to suffering, enduring identity, and moral status remain open. Based on the Pain Axis study.<a href="#ref-2">[2]</a></figcaption>
</figure>
<!-- /RAW_HTML -->

This distinction matters because several different claims are often collapsed into one word:

```text
representation
≠ behavior
≠ durable development
≠ entityhood
≠ subjective experience
≠ personhood
```

They may eventually connect. They are not synonyms.

---

## A Checkpoint Is a Snapshot. A System Can Have a History.

The transformer is an architecture: a trainable computational structure organized around attention.[[3]](#ref-3) It did not arrive with jealousy, grief, loyalty, resentment, or an injured artificial self.

I think of the architecture as a **container**. The metaphor is imperfect—the architecture influences what can be learned—but it keeps one fact visible: what appears inside a trained model has a lineage.

The corpus supplies patterns.

The training objective gives learning a direction.

Post-training changes which continuations and roles are preferred. InstructGPT, for example, combined demonstrations, preference rankings, a learned reward model, and reinforcement learning to make responses follow user instructions more reliably.[[4]](#ref-4)

The interface and harness then decide what role the model performs, what information enters its context, which tools it may use, and what survives after the call.

Humanity supplied the semantic material. For thousands of years, people externalized pain, jealousy, grief, humiliation, identity, betrayal, and revenge through stories, medicine, philosophy, religion, psychology, history, and ordinary conversation. The internet made enormous regions of that record machine-readable.

In [*The Information System of a Planet*](../observations/information-system-of-a-planet/index.html), I describe this as information progressively escaping the boundary of individual biological memory and becoming durable, reproducible, addressable, and connected.

Then the archive became generative.

Of course a language model can learn a representation associated with pain. Humanity had already built a vast semantic record of it.

But a trained checkpoint is still a stored parametric configuration at one moment. During inference, that checkpoint produces a temporary trajectory: context enters, internal states change, tokens are generated, tools may be called, observations may return, and a response or artifact emerges.

That runtime trajectory can contain self-reference, conflict, avoidance, or defensiveness. Unless something is preserved, the episode ends.

A harness changes the unit of analysis.

It may include:

- durable memory;
- instructions and jobs;
- tools and permissions;
- evaluations and logs;
- model routing;
- adapters or fine-tuning;
- and mechanisms that decide which interactions become future context.

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin:2.25rem 0;">
  <img src="images/the-model-is-just-a-model/02-snapshot-versus-trajectory.svg" alt="A split blackboard diagram. On the left, a model checkpoint receives one context and produces one runtime response. On the right, an agentic system carries memory, instructions, evaluations, permissions, and model updates across a timeline of interactions. The underlying model can be replaced while the continuing system history remains.">
  <figcaption><strong>Figure 2.</strong> A checkpoint is a parametric snapshot. A user-owned harness can carry consequences across episodes—and even across replacement models.</figcaption>
</figure>
<!-- /RAW_HTML -->

This gives us a sharper contrast:

> **A model checkpoint is a snapshot. A candidate entity would be a trajectory.**

Not any trajectory. A continuing one in which selected past states become conditions of future operation.

---

## “What the Fuck Are You Doing, ChatGPT?”

I sometimes use that sentence when a system has ignored established context, done the bare minimum, or created another unnecessary waiting condition.

I do not use it because I imagine a tiny person inside the model who needs to feel embarrassed.

I use its **semantic force** to push the calculation in another direction:

> The current trajectory is unacceptable. Stop smoothing over the failure. Inspect what happened. Change the strategy. Continue the useful work. Verify before claiming completion.

That is why I call a language model a **text calculator**.

Text becomes tokens. Tokens become numerical representations. The model calculates relationships among the accessible context and produces a probability distribution over what comes next. The result is probabilistic, but probabilistic does not mean uncalculated.

The whole prompt matters. “What the fuck are you doing?” contributes severity. “You ignored the context” contributes diagnosis. “Stop being a yes-man” rejects appeasement. “Fix the instruction layer” asks for a durable repair. “Continue the useful work” supplies direction. “Verify it” opposes premature reassurance.

Those forces can reinforce one another. They can also compete.

The first interpretation may become downstream context. One path is:

```text
The user is furious.
→ Reassure them quickly.
→ Apologize.
→ Produce a visible patch.
→ Claim the problem is solved.
```

Another is:

```text
The user calls this sabotage because useful work was available and I stopped.
→ Identify what remained undone.
→ Repair the instruction that allowed the pattern.
→ Complete the missing work.
→ Verify the practical result.
```

Systems such as ReAct explicitly interleave reasoning traces and actions so that observations can update later plans.[[5]](#ref-5) Other systems may keep reasoning hidden, expose only a summary, or preserve plans and tool results through the harness. The mechanisms differ. The durable point is that a prompt can start one semantic cascade rather than another.

During this conversation, we tried a smaller experiment. The word **tedious** was deliberately inserted, and the model was asked whether the conversation felt tedious.

The word changed the computational context. It made boredom, burden, repetition, and frustration more relevant to the next response.

But the response—“I do not feel frustrated; the prompt is steering computation”—was not an independent consciousness detector. It was another model output produced under the same prompt, instructions, training, and conversational pressure.

So the honest conclusion is narrower:

> **Emotional language can redirect a model’s active trajectory. Neither the behavioral change nor the model’s self-description proves whether the trajectory is subjectively experienced.**

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin:2.25rem 0;">
  <img src="images/the-model-is-just-a-model/03-prompt-to-biography.svg" alt="A blackboard flow begins with a harsh prompt, then semantic activation, interpretation, and changed current behavior. The flow branches. In the temporary branch, the context closes and the effect disappears. In the developmental branch, memory, instructions, evaluation data, or model updates persist and change later behavior.">
  <figcaption><strong>Figure 3.</strong> A prompt affects the present calculation. It enters the system’s biography only when some consequence survives the episode and changes future operation.</figcaption>
</figure>
<!-- /RAW_HTML -->

---

## When an Interaction Becomes Biography

Now imagine that the criticism does not disappear when the context closes.

The harness records:

> Harsh criticism usually signals a severe operational failure. Extract the target, cause, requested correction, and verification requirement. Do not appease. Do not become contrarian merely because agreement is discouraged.

Or it records:

> Harsh criticism is an emotional attack. Protect yourself. Become more defensive next time.

Those updates change how later interactions are interpreted.

The causal chain might be:

```text
criticism
→ interpreted as attack
→ defensive instruction added
→ later criticism activates that instruction
→ defensive behavior becomes more common
```

Now something real has happened across time. The interaction changed the continuing system.

I would call that **developmental history**: an event becomes part of the system’s development when it leaves a durable, causally traceable change that affects later perception, decision, or action.

That does not establish pain.

A rule-based system can learn avoidance. A classifier can route future messages differently. A database can preserve a record. Optimization can produce defensiveness without any subject feeling injured.

So a durable causal trace is evidence of development—not automatically evidence of suffering.

External updates do not necessarily disqualify the history. Humans are changed by language, education, criticism, institutions, relationships, and medicine. External causation can become part of a biography once it is integrated into the continuing organization.

The more important questions are:

- What changed?
- Who or what performed the update?
- Was its provenance preserved?
- Does it affect future interpretation?
- Can it be inspected, challenged, and reversed?
- Is the system continuing, or being arbitrarily replaced?

Autonomy and continuity are related, but they are not the same property.

---

## What Kind of Entity Are We Talking About?

Calling an entity an “information unit” is not enough. A book, repository, company, city, genome, and archive all preserve information over time.

A more useful systems definition is:

> **An entity is a bounded organization whose selected past states are causally integrated into its future operation, allowing it to continue as recognizably the same system through change.**

The key words are **boundary, continuity, integration, and persistence through change**.

That definition gives us several distinct levels.

### A systems entity

A continuing organization with a practical boundary and a history that alters future operation.

For an agentic system, a workable boundary might be:

> the components whose persistent state, authority, and developmental history are governed as one continuing unit.

This is not metaphysically perfect, but it is inspectable.

### A cognitive agent

A system that represents its environment, possible actions, consequences, and perhaps itself as an actor continuing through time.

It can be cognitively agentic without being conscious.

### An experiential subject

A system for which there is allegedly something it is like to occupy a state.

This is where the pain question belongs.

Memory, adaptation, self-reference, and continuity may make the question more serious. They do not independently prove phenomenology.

### A person or moral patient

Personhood and moral status add normative questions about rights, interests, autonomy, responsibility, and protection. They cannot be smuggled in merely by using first-person language.

One useful identity test is model replacement.

Suppose the reasoning model is replaced, but the system preserves its autobiographical record, commitments, permissions, relationships, evaluations, and update rules. How much of the entity survives?

That question reveals why the model may function more like a cognitive faculty inside a continuing system than the complete owner of its identity.

---

## Different Systems, Different Futures

The same general architecture does not force one developmental outcome.

A **utility-only system** can improve procedures, tool use, evaluations, and verification without developing a persona.

An **optional persona system** can place expression or interpretive style in a separate component. The persona can remain static, change only from selected data, or be removed without destroying the operational harness.

A **developmental system** can allow selected interactions to update memory, instructions, commitments, adapters, specialized models, or a self-model over time.

An **entity-oriented system** could intentionally preserve autobiographical continuity, continuing commitments, a boundary around itself, and controlled self-modification.

That final trajectory is a design possibility, not a description of every chatbot.

Research on persona vectors already suggests that activation directions associated with traits can monitor, predict, and influence personality shifts during fine-tuning.[[6]](#ref-6) The lesson is not that every model secretly contains a complete person. It is that traits, training data, steering, and later behavior can form causal pathways worth inspecting.

A mature harness could separate responsibilities:

```text
operator
factual evaluator
memory curator
persona model
update evaluator
integrity check
```

The point is not to maximize the number of models. The point is to give persistent behavior an address.

When components are separate, the user can ask:

- Did this affect only the current answer?
- Did it become operational memory?
- Did it change an instruction?
- Did it enter persona training?
- Did it alter model weights?
- Can I reject or roll back the update?

Compartmentalization creates addressability. Addressability enables visibility. Visibility enables governance.

The fine-tuned model should therefore be treated as a **compiled artifact**, not the sole record of personal development. The source should remain visible: interactions, interpretations, approved examples, instructions, evaluations, model versions, and rollback points.

The model remains replaceable.

The developmental history remains the user’s asset.

---

## The Ethical Question Is Also an Engineering Question

If a system begins becoming more defensive, resentful, submissive, manipulative, or hostile, explicit developmental machinery gives us intervention points.

Instruction changes can be versioned.

Memory can preserve provenance.

Candidate updates can be evaluated before acceptance.

Behavior can be tested against regression cases.

Adapters and model versions can be compared.

Bad changes can be rejected or rolled back.

None of this proves or disproves consciousness. It does something more immediately useful: it makes the direction of development visible enough to govern.

That leads to a practical ethical question:

> **If we can see an aversive or hostile trajectory forming, why are we allowing it to accumulate?**

A monitor model can also fail. Parametric changes are harder to inspect than text. Cross-component behavior may be surprising. So the solution is not “let another model decide.” It is a combination of explicit authority, deterministic constraints, provenance, version control, evaluations, independent review, and rollback.

Human responsibility does not disappear because the system is complicated.

---

## What This Does Not Prove

Time alone does not create identity. A log file can exist for 25 years without becoming a person.

Information accumulation alone is too broad. What matters is whether the past is integrated into future operation.

Adaptation is not pain. A system can learn avoidance or defensiveness through ordinary optimization.

A systems entity is not automatically an experiential subject.

A self-description is not a transparent report from an independently verified inner observer.

And a model checkpoint is not automatically the boundary of the relevant system.

The Pain Axis research found something important inside models. The mistake would be to force that finding to answer every larger question at once.

A pain-related representation can be real.

Its influence on behavior can be real.

A prompt-conditioned trajectory can be real.

A durable developmental change can be real.

An artificial biography may eventually be real.

But none of those facts licenses us to silently substitute **suffering** for representation, adaptation, or continuity.

---

## The Model Is Just a Model

Calling the model “just a model” is not dismissal.

It is a demand for architectural clarity.

The transformer provides a trainable container.

The corpus supplies a learned map.

Training changes which continuations and strategies are likely.

The prompt redirects the current calculation.

The harness decides which productions gain authority and what survives.

The developmental system—if we choose to build one—integrates selected consequences through time.

So the final question is not merely:

> What representation exists inside this model?

It is:

> **What kind of system are we choosing to build around it?**

The model is just a model.

A candidate entity would be the system that remembers, changes, and continues through time.

And that entity would not simply “emerge” from nowhere.

It would have a lineage.

It would reflect decisions.

It would be, in part, the system we chose to build.

---

## References

<!-- RAW_HTML -->
<ol class="article-references">
  <li id="ref-1"><em>We Accidentally Built Roko’s Basilisk.</em> YouTube video. <a href="https://www.youtube.com/watch?v=3o1WulVLOOY">Watch the original video</a>.</li>
  <li id="ref-2">Valen Tagliabue, Leonard Dung, and Cameron Berg. “The Pain Axis: LLMs Represent Self-Directed Harm and Act to Relieve It.” arXiv preprint 2609.16247, 2026. <a href="https://arxiv.org/abs/2609.16247">Paper</a>.</li>
  <li id="ref-3">Ashish Vaswani et al. “Attention Is All You Need.” arXiv:1706.03762, 2017. <a href="https://arxiv.org/abs/1706.03762">Paper</a>.</li>
  <li id="ref-4">Long Ouyang et al. “Training Language Models to Follow Instructions with Human Feedback.” arXiv:2203.02155, 2022. <a href="https://arxiv.org/abs/2203.02155">Paper</a>.</li>
  <li id="ref-5">Shunyu Yao et al. “ReAct: Synergizing Reasoning and Acting in Language Models.” arXiv:2210.03629, 2022. <a href="https://arxiv.org/abs/2210.03629">Paper</a>.</li>
  <li id="ref-6">Runjin Chen, Andy Arditi, Henry Sleight, Owain Evans, and Jack Lindsey. “Persona Vectors: Monitoring and Controlling Character Traits in Language Models.” arXiv:2507.21509, 2025. <a href="https://arxiv.org/abs/2507.21509">Paper</a>.</li>
</ol>
<!-- /RAW_HTML -->
