---
title: "We Could Have Had AGI By Now"
date: "February 2026"
slug: "we-could-have-had-agi"
read_time: "18 min"
tags: [Agents, AI, Architecture, AGI]
audience: professionals
og_image: "assets/images/blog/seed-agent-growth.png"
series: "Hadosh Academy – Agents"
companion_paper: "why-scaling-models-is-not-enough"
version: v1.0.0
status: published
---

# We Could Have Had AGI By Now

We could have had AGI by now.

Not the sci-fi kind. Not a god in a box. The practical kind — a system that learns a profession, keeps working for weeks, gets better from experience, and does not need someone watching it every thirty minutes. The kind you run on your own computer for less than a hundred dollars a month. Not an engineered artifact with a fixed design, but a **complex system** — one where intelligence emerges from primitives interacting, the way a living organism emerges from cells, not from a blueprint.

The building blocks have been available for months. None of them are exotic. None of them required a breakthrough. What they required was a different bet: **scale the architecture, not just the model.**

## LLMs are electricity. Agents are toasters. (Again.)

If you read the first essay, you already know: [LLMs](https://en.wikipedia.org/wiki/Large_language_model "Large Language Model — AI software like ChatGPT or Claude that generates text") are electricity. Agents are toasters. The structure turns raw power into repeatable work.

This essay extends that idea to a harder question: **what would actual AGI look like, and why does scaling the electricity feel like the wrong path?**

Scaling the electricity will not build the toaster. It will build a brighter arc.

But here is the thing: **do not build a toaster.** A toaster is an engineered artifact. Fixed wires, fixed outcome. No matter how much toast it makes, it never becomes a television. It cannot grow new capabilities from experience. That is the nature of engineered things — they do exactly what they were designed to do, nothing more. Electricity can do far more than make toast. If something like AGI emerges from a token generator, it will not be because someone engineered a better appliance. It will be because someone grew a **complex system** — one that rewires itself through use.

## A lawyer is not one giant thought

People overestimate how much a profession is raw IQ and underestimate how much it is disciplined workflow.

A competent professional is a pipeline: intake and clarification, scoping, research, synthesis, drafting, review, iteration with stakeholders, and risk management. Most of these steps are not mysterious. They are repeatable.

The hard part is not generating text. The hard part is staying on every step, holding scope, remembering constraints, and avoiding the same mistakes twice. And none of that gets easier when your [tokens](https://en.wikipedia.org/wiki/Large_language_model#Tokenization "Small word-sized chunks that AI models use to process text") vanish the moment the [context window](https://en.wikipedia.org/wiki/Large_language_model#Prompt "The limited amount of text an AI can 'see' at once") fills up. We solved the generation problem. What we never solved is the preservation problem — how to keep those tokens organized, accessible, and alive past the next session. A bigger generator just produces more tokens to lose.

That is organization. Not intelligence.

If you can build that organizational pipeline — and make it persistent, inspectable, and self-improving — you have something that behaves like professional competence. Even with a smaller model as the engine.

## Where does the context come from?

Here is a diagnostic you can run on any "agent" system:

At a random moment during a long task, snapshot the full context window and ask: where did all of this come from?

Some of it is fresh — tokens the model just generated. Some came through tools — the model read a file, searched the web, ran a command. But in a well-structured agent, there is a third layer: context that arrived without the model asking. Instruction files loaded automatically when it entered a directory. Hooks that injected rules before a tool ran. Memory retrieved because a policy required it. This is how compartmentalized knowledge finds its way into the conversation — not through the model's choices, but through pathways the architecture guarantees.

If almost all of it is fresh tokens, you are still trying to get the toaster out of electricity.

If a significant fraction is injected by durable structure, you are moving toward a real agent.

A system that regenerates its entire operational state from its own token stream is a closed loop. It can be clever, but it is fragile. A system that maintains state outside the token stream has independent anchors. It can recover. It can be audited. It can be upgraded in parts.

This is the difference between a monologue and an organism.

**Think about context composition** — not just how much the model generates on its own, but where the rest comes from. In a well-structured agent, context flows in from multiple compartments: instruction files, knowledge stores, memory, hooks, tool results. Balanced composition means every compartment that should influence the agent's thinking has a pathway into the context. That balance is what turns a token stream into situated awareness.

## Biology did not scale one molecule

Nature does not scale a single component to infinity. Nature differentiates.

Imagine nature stumbling upon [mRNA](https://en.wikipedia.org/wiki/Messenger_RNA "Messenger RNA — a molecule that carries genetic instructions inside cells") — a molecule that can both hold information and perform chemistry. Now imagine evolution trying to scale that one molecule into a giant monolith that stores all instructions, catalyzes all reactions, and regulates itself internally. In principle, maybe it could work.

But evolution favored composition over scale. The path to greater reliability was not a bigger molecule — it was more specialized parts working together. DNA became long-term storage. Proteins became functional workhorses. Lipid membranes created boundaries. Regulatory networks added meta-control. Later, nervous systems emerged as a higher-order organizational layer that no longer operates at the molecular level at all.

Now think about another complex system: the brain. In [*A Thousand Brains*](https://en.wikipedia.org/wiki/A_Thousand_Brains "Jeff Hawkins' 2021 book proposing that intelligence emerges from thousands of small brain units working together"), Jeff Hawkins describes each [cortical column](https://en.wikipedia.org/wiki/Cortical_column "A small group of neurons in the brain that work together as a processing unit") as an association engine — it maps sensory inputs to predictions, much the way an LLM maps one semantic pattern to the next. A single cortical column is powerful. It can learn, generalize, and predict. But intelligence did not emerge from one enormous super-column. It emerged from thousands of columns connecting, specialized regions differentiating, and coordinated subsystems handling memory, motor planning, language, and executive control.

**When we scale only the model, we are building the giant mRNA. When we scale architecture, we are building the organism.**

What does differentiation buy you? Each part adapts locally without breaking the whole. Parts specialize without tangling into one giant parameter space. You can swap a module and keep the organism. Fast reflexes and slow remodeling happen on different timescales. And when one part fails, the identity survives.

And that replaceability is not theoretical. New kinds of token generators are already emerging — joint models that combine multiple architectures, distributed systems that split reasoning across machines, multimodal generators that produce far more than text. The agent does not care which engine powers it. It metabolizes tokens regardless of their source. When the next engine arrives, the organism absorbs it. The structure persists. The growth continues.

And this is why biology keeps showing up. Not as metaphor. If something like AGI ever works, it will not be an engineered artifact — not a car, not a plane, not a very sophisticated toaster. It will be a complex system. Intelligence emerging from primitives interacting, not from any single component getting bigger. Biology is not the analogy here. It is the category.

And that category comes with a powerful toolkit. Once you see the agent as a complex system, you inherit design principles that have been studied for decades: think in primitives, expect emergence, design for growth, anticipate cascading effects. Every complex system that already exists — biology, cities, economies, ecosystems — becomes a source of design patterns for your agent. Shane Parrish's [*The Great Mental Models*](https://fs.blog/tgmm/ "The Great Mental Models — a book series on thinking tools that help you understand how the world works") series is a good place to start — mental models like [feedback loops](https://en.wikipedia.org/wiki/Feedback "A process where outputs circle back to influence inputs"), [second-order effects](https://en.wikipedia.org/wiki/Unintended_consequences "Consequences of consequences — the indirect results of a decision"), and [emergence](https://en.wikipedia.org/wiki/Emergence "Complex behavior arising from simple rules interacting") map directly onto the design decisions you will face when building agents.

So if intelligence is a complex system, what are the primitives? In the [previous essay](01-llms-are-not-the-agents.html), we identified compartmentalization as the core principle — every piece of knowledge has a home, every behavior has a boundary. That principle becomes the foundation for the primitives we need: bounded units of work that do not bleed into each other, that can be tracked, that can be managed independently.

Some primitives are obvious — files, directories, instruction files that load automatically when the agent enters a folder. These have existed since the first CLI agents shipped. But one primitive is not obvious at all, and it changes everything: prevent the agent from stopping before it is done. [Ralph Loop](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) does exactly this — it hooks into the Stop signal and repeats the prompt until a completion promise is met. The simplest possible form of persistence: one hook, one looped instruction. But it proves that a single interception point can keep an agent alive indefinitely — and that insight opens an entirely new design space for controlling agent lifecycles, from simple prompt repetition to structured job systems with obligations and memory.

Now extend that idea. Give each unit a name, a state, a place on disk. Let units spawn other units. Let them carry observations that must be processed before they close. You are no longer just blocking a stop signal. You are building a job system.

## The heartbeat: where agency actually begins

Here is the smallest architectural feature that changes everything:

Define a persistent list of **jobs** on disk (not in the model). Mark jobs active or completed — or add whatever states and fields the work demands. Install a hook that intercepts "Stop" and blocks it while any job is active. Make the agent loop: keep working until the job queue is empty.

This is not fancy. It is a heartbeat.

Then you scale it. Every job carries an observation field — what happened, what was learned, what went wrong. That field must be processed into long-term memory before the job can close. The system cannot mark "done" without first digesting what it did.

You now have a system that cannot "forget" by accident. It must metabolize its stream of tokens into something durable. It must tidy its state.

If you prefer different terminology, call them behaviors, intentions, processes, or obligations. The organizational principle is the same: **persistent state plus enforcement hooks**.

This pattern is platform-agnostic. Any CLI agent with a Stop-blocking hook can run it. We will take this heartbeat apart — the job objects, the states, the observation fields — when we build the seed agent's skeleton in a later essay.

## Hooks are the missing evolutionary layer

Modern [CLI](https://en.wikipedia.org/wiki/Command-line_interface "Command Line Interface — a text-based way to interact with software") agents give you something that looks small but is profound: **interception points**.

Pre-tool hooks. Post-tool hooks. Compact hooks. Stop hooks. Notification hooks. Session events.

Each one is a place where the architecture — not the model — decides what happens next. The model proposes. The structure disposes.

Hooks are the agent's sensory layer — how it perceives its own actions, reacts to events, and builds a surface where processed experience can be written back as durable knowledge. Without them, the agent acts blind. Tokens flow, but nothing sticks.

When hooks also log transactions, you get a continuous record of what the agent did and why. That record enables something crucial: learning from what actually happened.

## Consolidation: where the system learns

Humans do not improve only while acting. They consolidate.

A long-running agent should do the same. During work: collect raw traces — tool calls, file edits, outcomes, feedback. During consolidation: analyze traces, detect patterns, propose changes.

Crucially, changes are not magic. They are edits: update an instruction file (CLAUDE.md, AGENT.md, or equivalent), refine a checklist, add a guardrail hook, create a specialized skill module, [fine-tune](https://en.wikipedia.org/wiki/Fine-tuning_%28deep_learning%29 "Further training a pre-built AI model on a specific task to make it better at that task") a small internal decision model for one narrow choice.

This is how you get professional competence without requiring the main model to internalize everything.

## The seed agent: small structure that grows

Instead of asking "how smart must the model be?", ask "what is the smallest organized structure I can plant that will grow into professional competence?"

A seed agent is not a blueprint with nine named roles. It is a minimal structure built from the primitives this essay describes: persistent state, interception hooks, compartmentalized work, and consolidation mechanism. Four capabilities. That is enough to start.

The important property is not what the seed contains on day one. It is that the seed grows. As the agent works, new patterns get codified. New operations emerge from experience. New guardrails get added after failures. The structure accumulates — but the identity holds. You can still point at it and say: this is the same agent, more experienced.

This is what makes a seed different from a prompt. A prompt resets every session. A seed compounds. The seed carries enough cognitive architecture to keep extending itself for any user — staying true to its design principles while adapting to whatever profession, domain, or workflow it encounters. Different users, same seed, different cognitive organisms. We will build one of these seeds — piece by piece — in the essays that follow.

Think about your own work. What you do as a professional is also a complex system — a web of primitives you perform every day: research, review, draft, delegate, consult, negotiate. Your professional competence is not one giant skill. It [emerges](02-we-could-have-had-agi.html#biology-did-not-scale-one-molecule) from these primitives interacting in ways that years of experience have refined. Remember — [a lawyer is not one giant thought](02-we-could-have-had-agi.html#a-lawyer-is-not-one-giant-thought). Describe a job to your seed agent — what it involves, what it produces, what it must check — and the agent incorporates that job into its cognitive architecture. All through conversation. The more jobs you describe, the more capable the organism becomes.

## Internalization is not the answer

The standard objection: give the model enough capacity and it will learn to plan, remember, verify, and regulate itself.

Two problems.

First, even if internalization is possible, it is not modular. You cannot inspect the "hook" inside the weights. You cannot swap it. You cannot patch it without touching everything else. Internalized structure is trapped in one coupled parameter space.

Second, internalization is economically brutal. You are paying model-scale costs to simulate what software can do cheaply and deterministically. A verification checklist costs almost nothing. A budgeting rule costs almost nothing. A tool permission gate costs almost nothing. If these prevent even a small fraction of failures, they dominate marginal gains from scaling in many real deployments.

## What a year of experience looks like

Imagine two copies of the same model, given the same profession, running for a year.

One has no architecture around it. Every session resets to zero. It improves only when someone retrains it — expensive [reinforcement learning](https://en.wikipedia.org/wiki/Reinforcement_learning "A training method where AI learns by trial and error with rewards and penalties") runs that touch every weight at once. Between runs, it returns to baseline. Impressive in any given conversation. Amnesiac across all of them.

The other sits inside a filesystem brain. It logs what it does. It digests what it learned before closing each job. After a year, it has accumulated thousands of case notes, a playbook of failure modes, specialized templates, refined guardrails, and an evolving internal organization of knowledge.

Same engine. Same electricity. One forgot everything. The other became a professional.

## The practical roadmap

If you want to build toward AGI-like autonomy now, do not wait for the next model. Build these four layers:

**1) A filesystem brain with compartmentalized memory.** Persistent state with clear boundaries — knowledge files, job ledgers, memory stores, and instruction files (CLAUDE.md, AGENT.md) scoped to where they are needed.

**2) A hook system that enforces phases and permissions.** Interception points where deterministic rules override probabilistic behavior.

**3) A job system that keeps the agent alive until obligations are met.** Persistent jobs as structured objects. Stop-blocking hooks that prevent premature exit. Observation fields that must be processed before completion. And not just professional tasks — the agent also spends compute on its own maintenance: managing memory, refining instructions, consolidating experience. Like a cell that does not just process nutrients but also repairs itself, manages waste, and maintains its own membrane.

**4) A consolidation loop that converts traces into durable upgrades.** Consolidation phases where logged experience is analyzed, distilled, and written back as improved instructions, refined checklists, and new skills.

## Why I say "we could have had it by now"

Because none of the architecture described in this essay required a research breakthrough. Every primitive — persistence, hooks, jobs, consolidation — is standard software. The only thing missing was the bet.

Previous attempts at agent autonomy — AutoGPT, BabyAGI, and their descendants — were still **engineered systems**. They defined the agent directly: rigid pipelines, fixed roles, specific task flows. When the plan did not fit reality, the agent broke. They proved that top-down engineering cannot produce durable autonomy.

What we needed was **complex system design** — not defining the agent directly, but defining primitives and letting the agent **emerge** from their interaction. Hooks arrived in CLI frameworks recently. They are a qualitatively different design. If the research effort that went into squeezing marginal gains out of prompt-following had gone into these long-horizon complex-system experiments, we would already have more systems that keep working for weeks, learn workflows, accumulate real project memory, and behave consistently for a given user.

That is the kind of "AGI" most teams actually want: a durable collaborator that gets better.

## Closing

The industry keeps asking: "When will the model become AGI?"

The model was never going to become AGI. The organism was.

We have the primitives. We have had them for months.

**Build the organism.**

---

*Essay 2 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: ["LLMs Are Not the Agents"](01-llms-are-not-the-agents.html) — the agent is the filesystem, not the model.*
*Next: ["Your Brain Was Never Built for This"](03-your-brain-was-never-built-for-this.html) — what happens when you extend your brain with a digital cortex.*

*Companion: ["Why Scaling Models Is Not Enough"](../papers/why-scaling-models-is-not-enough.pdf) (white paper)*
