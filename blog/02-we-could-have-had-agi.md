---
title: "We Could Have Had AGI By Now"
date: "February 2026"
slug: "we-could-have-had-agi"
read_time: "15 min"
tags: [Agents, AI, Architecture, AGI]
og_image: "assets/images/hadosh-logo-dark.png"
series: "Hadosh Academy – Agents"
companion_paper: "why-scaling-models-is-not-enough"
---

# We Could Have Had AGI By Now

We could have had AGI by now.

Not the sci-fi kind. Not a god in a box. The practical kind — a system that learns a profession, keeps working for weeks, gets better from experience, and does not need someone watching it every thirty minutes. Not an engineered artifact with a fixed design, but a **complex system** — one where intelligence emerges from primitives interacting, the way a living organism emerges from cells, not from a blueprint.

The building blocks have been available for months. None of them are exotic. None of them required a breakthrough. What they required was a different bet: **scale the architecture, not just the model.**

## LLMs are electricity. Agents are toasters. (Again.)

If you read the first essay, you already know: [LLMs](https://en.wikipedia.org/wiki/Large_language_model "Large Language Model — AI software like ChatGPT or Claude that generates text") are electricity. Agents are toasters. The structure turns raw power into repeatable work.

This essay extends that idea to a harder question: **what would actual AGI look like, and why does scaling the electricity feel like the wrong path?**

Scaling the electricity will not build the toaster. It will build a brighter arc.

## A lawyer is not one giant thought

People overestimate how much a profession is raw IQ and underestimate how much it is disciplined workflow.

A competent professional is a pipeline: intake and clarification, scoping, research, synthesis, drafting, review, iteration with stakeholders, and risk management. Most of these steps are not mysterious. They are repeatable.

The hard part is not generating text. The hard part is not missing steps, not drifting off scope, not forgetting constraints, and not repeating the same mistakes. And none of that gets easier when your [tokens](https://en.wikipedia.org/wiki/Large_language_model#Tokenization "Small word-sized chunks that AI models use to process text") vanish the moment the [context window](https://en.wikipedia.org/wiki/Large_language_model#Prompt "The limited amount of text an AI can 'see' at once") fills up. We solved the generation problem. What we never solved is the preservation problem — how to keep those tokens organized, accessible, and alive past the next session. A bigger generator just produces more tokens to lose.

That is organization. Not intelligence.

If you can build that organizational pipeline — and make it persistent, inspectable, and self-improving — you have something that behaves like professional competence. Even with a smaller model as the engine.

## Where does the context come from?

Here is a diagnostic you can run on any "agent" system:

At a random moment during a long task, snapshot the full context window and ask: what fraction of this context was produced by the model in the current session? And what fraction was injected by structure — files, rules, hooks, logs, schemas, policies, memory retrieval?

If almost all of it is fresh tokens, you are still trying to get the toaster out of electricity.

If a significant fraction is injected by durable structure, you are moving toward a real agent.

A system that regenerates its entire operational state from its own token stream is a closed loop. It can be clever, but it is fragile. A system that maintains state outside the token stream has independent anchors. It can recover. It can be audited. It can be upgraded in parts.

This is the difference between a monologue and an organism.

**A practical metric**: calculate a rough "injected context ratio" — tokens inserted from files, tools, hooks, and memory divided by total context tokens. A higher ratio means the system depends on stable external anchors. Behavior becomes easier to audit and stabilize. Over time, an architecture-centric system should show more injected context from durable playbooks, less repeated re-derivation of the same constraints, and fewer failures from forgotten steps.

## Biology did not scale one molecule

Nature does not scale a single component to infinity. Nature differentiates.

Imagine discovering [mRNA](https://en.wikipedia.org/wiki/Messenger_RNA "Messenger RNA — a molecule that carries genetic instructions inside cells") — a molecule that can both hold information and perform chemistry. Now imagine deciding to scale that one molecule into a giant monolith that stores all instructions, catalyzes all reactions, and regulates itself internally. In principle, maybe it could work.

But evolution chose composition. DNA became long-term storage. Proteins became functional workhorses. Lipid membranes created boundaries. Regulatory networks added meta-control. Later, nervous systems emerged as a higher-order organizational layer that no longer operates at the molecular level at all.

The same pattern applies to the cortex. A [cortical column](https://en.wikipedia.org/wiki/Cortical_column "A small group of neurons in the brain that work together as a processing unit") is powerful — it can learn patterns and generalize. But intelligence did not emerge from one enormous super-column. It emerged from columns connecting to columns, specialized regions differentiating, and coordinated subsystems handling memory, motor planning, language, and executive control.

**When we scale only the model, we are building the giant mRNA. When we scale architecture, we are building the organism.**

Differentiation buys you local adaptation without global interference, specialization without entangling everything in one parameter space, replaceability (swap a module, keep the organism), multi-timescale learning (fast reflexes, slow remodeling), and robustness (one failure does not erase identity).

And this is why biology keeps showing up. Not as metaphor. If something like AGI ever works, it will not be an engineered artifact — not a car, not a plane, not a very sophisticated toaster. It will be a complex system. Intelligence emerging from primitives interacting, not from any single component getting bigger. Biology is not the analogy here. It is the category.

So if intelligence is a complex system, what are the primitives? You need compartmentalization. Bounded units of work that do not bleed into each other, that can be tracked, that can be managed independently.

The smallest useful primitive already exists: prevent the agent from stopping before it is done. [Ralph Loop](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) does exactly this — it hooks into the Stop signal and repeats the prompt until a completion promise is met. The simplest possible form of persistence: one hook, one looped instruction. But it proves that a single interception point can keep an agent alive indefinitely — and that insight opens an entirely new design space for controlling agent lifecycles, from simple prompt repetition to structured job systems with obligations and memory.

Now extend that idea. Give each unit a name, a state, a place on disk. Let units spawn other units. Let them carry observations that must be processed before they close. You are no longer just blocking a stop signal. You are building a job system.

## The heartbeat: where agency actually begins

Here is the smallest architectural feature that changes everything:

Define a persistent list of **jobs** on disk (not in the model). Mark jobs active or completed — or add whatever states and fields the work demands. Install a hook that intercepts "Stop" and blocks it while any job is active. Make the agent loop: keep working until the job queue is empty.

This is not fancy. It is a heartbeat.

Then you scale it. Every job carries an observation field — what happened, what was learned, what went wrong. That field must be processed into long-term memory before the job can close. The system cannot mark "done" without first digesting what it did.

You now have a system that cannot "forget" by accident. It must metabolize its stream of tokens into something durable. It must tidy its state.

If you prefer different terminology, call them behaviors, intentions, processes, or obligations. The organizational principle is the same: **persistent state plus enforcement hooks**.

This pattern is platform-agnostic. Any CLI agent with a Stop-blocking hook can run it.

## Hooks are the missing evolutionary layer

Modern [CLI](https://en.wikipedia.org/wiki/Command-line_interface "Command Line Interface — a text-based way to interact with software") agents give you something that looks small but is profound: **interception points**.

Pre-tool hooks. Post-tool hooks. Compact hooks. Stop hooks. Notification hooks. Session events.

Each one is a place where the architecture — not the model — decides what happens next. The model proposes. The structure disposes.

Hooks are the agent's sensory layer — how it perceives its own actions, reacts to events, and builds a surface where processed experience can be written back as durable knowledge. Without them, the agent acts blind. Tokens flow, but nothing sticks.

When hooks also log transactions, you get an experience stream. And that experience stream enables something crucial: learning from experience.

## Consolidation: where the system learns

Humans do not improve only while acting. They consolidate.

A long-running agent should do the same. During work: collect raw traces — tool calls, file edits, outcomes, feedback. During consolidation: analyze traces, detect patterns, propose changes.

Crucially, changes are not magic. They are edits: update an instruction file (CLAUDE.md, AGENT.md, or equivalent), refine a checklist, add a guardrail hook, create a specialized skill module, [fine-tune](https://en.wikipedia.org/wiki/Fine-tuning_%28deep_learning%29 "Further training a pre-built AI model on a specific task to make it better at that task") a small internal decision model for one narrow choice.

This is how you get professional competence without requiring the main model to internalize everything.

## The seed agent: small structure that grows

Instead of asking "how smart must the model be?", ask "what is the smallest organized structure I can plant that will grow into professional competence?"

A seed agent is not a blueprint with nine named roles. It is a minimal structure built from the primitives this essay describes: persistent state, interception hooks, compartmentalized work, and consolidation mechanism. Four capabilities. That is enough to start.

The important property is not what the seed contains on day one. It is that the seed grows. As the agent works, new patterns get codified. New operations emerge from experience. New guardrails get added after failures. The structure accumulates — but the identity holds. You can still point at it and say: this is the same agent, more experienced.

This is what makes a seed different from a prompt. A prompt resets every session. A seed compounds. Different users, same seed, different cognitive organisms — because the growth depends on the work, the domain, and the failures encountered along the way.

## Internalization is not the answer

The standard objection: give the model enough capacity and it will learn to plan, remember, verify, and regulate itself.

Two problems.

First, even if internalization is possible, it is not modular. You cannot inspect the "hook" inside the weights. You cannot swap it. You cannot patch it without touching everything else. Internalized structure is trapped in one coupled parameter space.

Second, internalization is economically brutal. You are paying model-scale costs to simulate what software can do cheaply and deterministically. A verification checklist costs almost nothing. A budgeting rule costs almost nothing. A tool permission gate costs almost nothing. If these prevent even a small fraction of failures, they dominate marginal gains from scaling in many real deployments.

## What a year of experience looks like

Imagine two systems working and learning the same profession for a year.

System 1: a monolithic model session that regenerates its own state each time. The only way it improves is through retraining — expensive [reinforcement learning](https://en.wikipedia.org/wiki/Reinforcement_learning "A training method where AI learns by trial and error with rewards and penalties") runs that require massive compute and touch every weight at once. Between those runs, it returns to baseline every session. It can be impressive, but it does not accumulate a personal history.

System 2: an architecture that logs traces, maintains job state on disk, and runs consolidation loops. After a year, it has thousands of structured case notes, a playbook of checklists and failure modes, specialized templates, a library of reusable skills, refined guardrails, and a continuously evolving internal organization of knowledge.

When you talk to System 2, you are not talking to a fresh model instance. You are talking to an organism that has a history.

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

*For the analytical companion piece — including falsifiable predictions, detailed organizational complexity frameworks, and a practical experiment you can run yourself — download the white paper: **["Why Scaling Models Is Not Enough: The Case for Organizational Depth in Agent Architecture."](../papers/why-scaling-models-is-not-enough.pdf)***

*This is the second essay in the Hadosh Academy series on agent architecture. The first essay, ["LLMs Are Not the Agents,"](llms-are-not-the-agents.html) establishes the foundation: the agent is the filesystem, not the model.*
