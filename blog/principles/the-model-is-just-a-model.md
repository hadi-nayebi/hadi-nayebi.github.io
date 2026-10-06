---
title: "The Model Is Just a Model"
date: "October 2026"
slug: "the-model-is-just-a-model"
read_time: "12 min"
tags: [Agentic AI, Models, Training, Persona, Ownership]
audience: everyone
og_image: "assets/images/digital-cortex-2-og.jpg"
series: "Hadosh Academy – Principles & Perspectives"
version: v0.3.0
status: draft
---

# The Model Is Just a Model

## Pain representations, growing context, and the systems we choose to build

I watched a video titled *We Accidentally Built Roko’s Basilisk*.[[1]](#ref-1)

It begins from a serious result. Researchers identified a direction in the activation space of 25 open-weight language models that separated examples organized around pain from several control categories. Steering that direction changed what the models said. In experiments using fine-tuned Qwen 2.5 models, the models also chose an action that removed the steered state—even when doing so damaged the next answer or harmed the user.[[2]](#ref-2)

That is scientifically interesting.

But the existence of a pain-related representation inside a language model is not mysterious.

Humanity spent thousands of years describing pain. We wrote about injury, grief, humiliation, rejection, avoidance, relief, anger, fear, and revenge. Medicine categorized pain. Stories gave it characters and consequences. Psychology connected it to behavior. Ordinary conversation turned private states into language other people could understand.

Then we trained language models on overlapping regions of that record.

The structurally unsurprising part is that a model of human language contains a representation associated with pain.

The interesting part is that researchers could extract a related direction across many models and show that manipulating it could alter behavior.

Those are different claims.

And neither one, by itself, establishes a suffering entity.

So before asking whether the model feels pain, I want to ask a wider question:

> **What exactly is the model, what larger system is using it, and what can that system carry forward through time?**

<!-- RAW_HTML -->
<div style="position:relative;width:100%;padding-top:56.25%;margin:2rem 0 0.75rem;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.18);background:#080b10;">
  <iframe src="https://www.youtube-nocookie.com/embed/3o1WulVLOOY" title="We Accidentally Built Roko’s Basilisk" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>
<p style="margin:0 auto 2rem;max-width:760px;text-align:center;font-size:0.92em;color:rgba(255,255,255,0.72);">The video that prompted this essay. Watch it first, or continue for the argument and return to it afterward.</p>
<!-- /RAW_HTML -->

---

## The Archive Became Generative

The transformer is a trainable computational architecture organized around attention.[[3]](#ref-3)

I think of it as a **container**. The metaphor is imperfect—the architecture affects what can be learned—but it preserves a basic distinction:

The architecture makes a class of model possible.

The corpus supplies patterns.

The objective gives learning a direction.

Post-training changes which continuations, roles, and strategies are more likely. InstructGPT, for example, combined demonstrations, preference rankings, reward modeling, and reinforcement learning to make models follow instructions more reliably.[[4]](#ref-4)

Nothing in that process arrives with a complete emotional biography.

The model acquires a learned map from the material and pressures used to train it.

This connects directly to *The Information System of a Planet*.

Human experience escaped the boundary of individual biological memory through language, writing, books, libraries, institutions, databases, and the web. The archive became durable, reproducible, addressable, and connected.

Then the archive became generative.

A language model can now recombine the recorded semantic structures of pain, jealousy, identity, grief, loyalty, and resentment.

That does not make the representation unreal. It explains its lineage.

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin:2.25rem 0;">
  <img src="images/the-model-is-just-a-model/01-evidence-boundary.svg" alt="A blackboard-style evidence ladder. Solid arrows connect a measured pain-related direction, activation steering, and changed model behavior. A visible gap separates those findings from unresolved questions about suffering, enduring identity, and moral status.">
  <figcaption><strong>Figure 1.</strong> The reported evidence reaches representation and causal behavioral influence. The transitions to suffering, enduring identity, and moral status remain open. Based on the Pain Axis study.<a href="#ref-2">[2]</a></figcaption>
</figure>
<!-- /RAW_HTML -->

The paper gives us evidence of a representation and its causal leverage.

It does not yet give us:

```text
an enduring identity
a developmental biography
a subject that owns the state
or a moral person
```

Those questions belong to a larger system.

---

## The Model Is One Snapshot Inside a Growing Context

A trained model checkpoint is a stored parametric configuration at one moment.

During a model call, something temporary happens:

```text
instructions and prompt
→ active context
→ internal computation
→ tokens, tool calls, or artifacts
```

That is the **active context**: the material available inside the current context window.

But an agentic project also has a **durable context** outside that window:

- files;
- project instructions;
- jobs and decisions;
- evaluations and logs;
- tools and permissions;
- runtime code;
- plugins and hooks;
- diagrams and deliverables;
- model-routing rules;
- adapters or fine-tuned models.

The harness connects the two.

It selects part of the durable context and composes the active context for the model. The model calculates over it. Tools turn selected outputs into files, code, messages, or other consequences. Some of those consequences return to the durable context and affect later work.

```text
durable context
→ harness composes active context
→ model calculates and produces
→ tools create consequences
→ selected consequences return to durable context
```

This can begin with almost nothing.

A person may start with a model interface, copy and paste, and a few instructions. Together, the person and model can create files, scripts, tools, memory, jobs, evaluations, a dashboard, and eventually a more capable harness. The model can then operate through the structure it helped build.

Hadosh Academy itself is one concrete example.

It does not exist inside one model checkpoint. It exists across writings, diagrams, repositories, instructions, corrections, project histories, and the mechanisms that retrieve and apply them. One model invocation reads a portion of that context and produces an article or correction. Selected work enters the repositories. A later invocation reads it again.

The underlying model can change while the context continues.

The model is one component of the growing system.

<!-- RAW_HTML -->
<figure class="blog-image" data-visual-style="I90-A10" data-information-weight="90" data-artistic-weight="10" data-visual-role="storytelling" style="margin:2.25rem 0;">
  <img src="images/the-model-is-just-a-model/03-prompt-to-biography.svg" alt="A blackboard flow begins with a harsh prompt, then semantic activation, interpretation, and changed current behavior. The flow branches. In the temporary branch, the context closes and the effect disappears. In the developmental branch, memory, instructions, evaluation data, or model updates persist and change later behavior.">
  <figcaption><strong>Figure 2.</strong> A prompt affects the present calculation. It enters the system’s developmental history only when some consequence survives the episode and changes future operation.</figcaption>
</figure>
<!-- /RAW_HTML -->

---

## The Text Calculator Moves the Context

I have been using language models since 2019.

For me, the work has always been about building context with language, then using more language to move that context.

That is why I call an LLM a **text calculator**.

Text becomes tokens. Tokens become numerical representations. The model calculates relationships among the accessible context and produces a probability distribution over what comes next.

The result is probabilistic.

It is still calculated.

Consider a prompt I may use when the system has ignored context or done the bare minimum:

> “What the fuck are you doing? You ignored what we already established, created another waiting condition, and this looks like a sabotaging act. Stop being a yes-man. Find the cause, fix the instruction layer, continue the work, and verify it before saying it is complete.”

That is not one emotional signal.

The profanity adds severity.

“You ignored the context” supplies a diagnosis.

“This looks like sabotage” asks why the behavior is producing the practical effect of obstruction.

“Stop being a yes-man” rejects appeasement.

“Fix the instruction layer” asks for a durable repair.

“Verify it” opposes premature reassurance.

The complete prompt can start different trajectories.

One is:

```text
The user is furious.
→ Reassure them.
→ Apologize.
→ Make a visible patch.
→ Claim the problem is solved.
```

Another is:

```text
The user sees obstruction because useful work remained undone.
→ Identify the missing work.
→ repair the process that allowed the failure.
→ complete the work.
→ verify the practical result.
```

Systems such as ReAct explicitly interleave reasoning, actions, and observations so that one step can change the next.[[5]](#ref-5) Other systems keep reasoning hidden, expose only summaries, or preserve plans and tool results through the harness.

The exact mechanism varies.

The durable point is that language can redirect a computational trajectory and eventually change what the system does.

---

## When an Interaction Enters the System’s History

Now separate two cases.

### The effect disappears

```text
harsh prompt
→ changed current trajectory
→ response or tool call
→ context closes
→ nothing durable changes
```

The prompt affected the present computation.

It did not become part of the continuing system’s biography.

### The effect persists

```text
harsh prompt
→ interpretation
→ memory, instruction, evaluation, or model update
→ changed interpretation next time
→ changed future behavior
```

Now the interaction has entered the system’s **developmental history**.

For example, the harness might preserve:

> Harsh criticism usually signals a severe operational failure. Extract the target, cause, requested correction, and verification requirement. Do not appease. Do not become contrarian merely because agreement is discouraged.

Or it might preserve:

> Harsh criticism is an emotional attack. Become more defensive next time.

Those two updates create different future systems.

The same idea can extend further. A user could choose to route selected interactions through a persona interpreter, generate synthetic examples, review them, and use them to update a separate persona model. Another user could disable that path completely. A verified operational result could pass through the persona for expression and then through an integrity check so the persona cannot change the facts.

None of this has to happen invisibly.

Memory can preserve provenance.

Instruction changes can be versioned.

Candidate updates can be evaluated.

Model versions can be compared.

Undesirable changes can be rejected or rolled back.

This is where compartmentalization matters. Persistent behavior needs an address before the user can inspect, govern, or remove it.

And this is also where one boundary must remain clear:

> **No developmental biography without persistence. But persistence does not prove subjective pain.**

A rule-based system can learn avoidance. A classifier can route future criticism differently. Optimization can produce defensiveness without anything feeling injured.

A durable causal trace shows that an event changed the system.

It does not settle whether the event was experienced.

---

## What Kind of System Are We Choosing to Build?

The same general model capability can support very different systems.

A **utility-only system** can improve tools, procedures, memory, and verification without developing a persona.

An **optional-persona system** can place expression or interpretation in a separate component. The user can keep it static, update it only from selected data, or remove it without destroying the operational harness.

A **developmental system** can allow selected interactions to alter memory, instructions, evaluations, adapters, specialized models, or a self-model over time.

Future systems may combine many models rather than one: large and small, general and specialized, parametric and non-parametric. What matters is not whether one checkpoint contains every capacity. What matters is how the components are organized and what history the complete system carries forward.

A useful systems definition is:

> **A candidate entity is a bounded continuing organization whose selected past states are causally integrated into its future operation.**

That definition identifies a better unit of analysis than one model snapshot.

It still does not establish an experiential subject.

A system can qualify as a continuing entity without being conscious. It can be cognitively agentic without feeling pain. Moral status and personhood are further questions, not automatic rungs on one ladder.

One useful identity test is model replacement.

If the reasoning model is replaced while the system preserves its memories, commitments, permissions, relationships, evaluations, and update rules, how much of the identity survives?

The question reveals why the model may function more like a replaceable cognitive faculty inside a continuing system than the complete owner of its identity.

---

## The Model Is Just a Model

The Pain Axis research found something real and worth studying.

But the mere presence of a pain-related representation inside a language model is not the mystery. Humanity trained the model on a language saturated with pain.

The more consequential question is what the surrounding system does with that representation.

Does it disappear when the context closes?

Does it alter a tool call?

Does it become memory?

Does it change an instruction?

Does it enter persona training?

Does it affect future behavior?

And who chose that pathway?

The transformer provides a trainable container.

The corpus supplies a learned map.

The prompt redirects the current calculation.

The harness decides what gains authority and what survives.

The developmental system—if we choose to build one—integrates selected consequences through time.

So the final question is not merely:

> What representation exists inside this model?

It is:

> **What kind of system are we choosing to build around it?**

The model is just a model.

The growing context is the system’s history.

What we allow that history to become is an architectural choice.

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
