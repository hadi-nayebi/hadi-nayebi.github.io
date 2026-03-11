---
title: "LLMs Are Not the Agents"
date: "February 2026"
slug: "llms-are-not-the-agents"
read_time: "12 min"
tags: [Agents, AI, Fundamentals]
og_image: "assets/images/blog/llm-engine-agent-directory.png"
---

<!-- ======== 1. HOOK ======== -->

> **LLMs are electricity. Agents are toasters.**

Electricity is one of the most powerful forces on the planet. It can heat a room, run a hospital, or power a city. But plug it into nothing and it just arcs. It needs a **structure** to become useful.

A toaster is a simple structure. It takes raw electrical energy and channels it into a **specific, repeatable outcome** — toast, every time. Not because electricity "decided" to make toast. Because the wires, the timer, and the slots shaped the energy into a predictable result.

This is the relationship between an [LLM](https://en.wikipedia.org/wiki/Large_language_model "Large Language Model — AI software like ChatGPT or Claude that generates text") and an agent.

The LLM provides **raw reasoning power**. It can write, analyze, plan, and create. But without structure, that power goes in a different direction every time. The agent provides the structure. It channels the LLM's intelligence into **consistent, reliable behavior**.

Most people building with AI today are staring at the electricity and wondering why it does not make toast on its own.

<!-- ======== 2. THE MISUNDERSTANDING ======== -->

## The Misunderstanding

When people say "AI agent," they almost always mean the model. Claude, GPT, Gemini — pick your favorite. They point at the LLM and say: *"That is my agent."*

**That is the root misunderstanding.**

The model is not the agent. The model is the **engine**. It is the part that thinks, generates, and reasons. But thinking alone does not make an agent. A jet engine sitting on the ground is incredibly powerful — but it is not an airplane.

Here is what happens when you treat the LLM as the agent:

- **No memory between sessions.** The model forgets everything when the conversation ends. Every session starts from zero.
- **No consistent behavior.** The same prompt can produce different results on different days. There are no habits, only probabilities.
- **No identity.** The model does not know who "it" is in the context of your project. It adapts to whatever you tell it in the moment.
- **No growth.** The model cannot learn from its own experience. It cannot refine itself over time. It cannot get better at *your* specific tasks.

If your "agent" loses everything when you close the terminal, **you do not have an agent**. You have a very expensive autocomplete.

The real agent is something else entirely.

<!-- ======== 3. WHAT IS AN AGENT, REALLY? ======== -->

## What Is an Agent, Really?

An agent is the engine **plus a local brain**.

In [CLI](https://en.wikipedia.org/wiki/Command-line_interface "Command Line Interface — a text-based way to interact with software")-based agents — tools like Claude Code, OpenCode, or Gemini CLI — that brain is not abstract or metaphorical. It is **literal**. It is a collection of files and directories on your local disk.

**The agent is the filesystem.**

This is good news. Training an LLM costs hundreds of millions of dollars and requires specialized hardware most people will never touch. Building an agent costs nothing beyond the tools you already have. You are not creating intelligence — that already exists. You are organizing files that shape existing intelligence into reliable behavior.

That filesystem gives the LLM everything it cannot provide on its own:

- **Memory** — knowledge files, past decisions, learned patterns
- **Structure** — operational phases, rules, workflows
- **Reflexes** — hooks and event handlers that fire automatically
- **Identity** — who the agent is, how it behaves, what it prioritizes
- **Continuity** — persistent state that survives across sessions

![Diagram comparing LLM as engine (reasoning, probabilistic, no persistent memory) versus Agent as directory brain (memory on disk, hooks and rules, intentions). Swapping the engine gives faster or smarter. Swapping the directory gives a different agent.](../assets/images/blog/llm-engine-agent-directory.png)
*The LLM is the engine. The directory is the agent. Swap the engine and you get a faster model. Swap the directory and you get a different agent entirely.*

When you spin up Claude Code in an **empty directory**, you are giving an LLM access to a workspace. The LLM has capabilities — it can think, respond, use tools, delegate, ask permission, compact context, and stop. But all of those decisions are purely probabilistic. The LLM decides everything based on its training and the current conversation.

**This is not yet an agent.** This is a raw engine running with no car around it.

But when you add a `.claude/` directory (or `.opencode/` in OpenCode, or any equivalent brain directory) — with knowledge files, operational rules, memory structures, and workflow definitions — something fundamental changes. That directory becomes the **brain** of your agent. The brain is the collection of files that tell the LLM **how to behave**.

<!-- ======== 4. THE DEFAULT STATE ======== -->

## The Default State: A Probabilistic Random Walk

To understand why structure matters, look at what happens **without** it.

A CLI agent in an empty folder has an **action space** — the set of things it can do at any given moment:

- Respond in chat
- Use deep reasoning mode
- Use tools (read, write, edit, run, search)
- Ask for permission
- Delegate to sub-agents
- Compact context
- Stop

At each step, the LLM picks one of these actions based on probabilities. Then it picks again. And again. This creates a **probabilistic action chain** — a sequence of decisions where each step depends on the current state of the conversation.

The problem? **Small changes in context lead to completely different paths.** Rephrase your prompt slightly and you get a different sequence of actions. Run the same task twice and you might get two different approaches. The chain is inherently unstable.

This is why working with a bare LLM can feel like a **random walk**. It is intelligent, but it is not reliable. It might solve your problem beautifully today and stumble on the same problem tomorrow. Without structure to absorb and organize the tokens it generates, a raw LLM agent shows **ADHD-like symptoms**. Brilliant, full of potential, but scattered and inconsistent — unable to stay on track without external structure holding it accountable.

![Markov chain diagram showing Claude Code's action space as probabilistic state transitions. Multiple states like PLAN, EXECUTE, OBSERVE connected by arrows representing probabilistic choices.](../assets/images/blog/action-space-markov-chain.png)
*The raw action space of a CLI agent. Without structure, the LLM bounces between states based on probabilities — a [Markov chain](https://en.wikipedia.org/wiki/Markov_chain "A system where the next step depends only on the current state, not the full history") where every path is equally likely.*

> Intelligence alone is not reliability. **Structure is.**

<!-- ======== 5. STRUCTURE CHANGES EVERYTHING ======== -->

## Structure Changes Everything

Now watch what happens when you add structure.

Modern CLI agents support [**hook systems**](https://en.wikipedia.org/wiki/Hooking "Trigger points where custom rules automatically run when an event happens") — events that fire at specific points in the agent's lifecycle. These are not optional plugins. They are the mechanism that transforms a raw LLM into a structured agent.

![Flow diagram of Claude Code Agent showing the full hook system: User Prompt flows through UPS Hook, then branches into Response, Thinking with PreToolUse and PostToolUse Hooks around tool use, Notification Hook, SubagentStop Hook, PreCompact Hook, and Stop Hook. Each hook is an interception point where deterministic rules can override probabilistic behavior.](../assets/images/blog/hooks-and-action-space.png)
*The hook system in Claude Code. Every arrow is an event. Every hook is an interception point where your rules — not the LLM's probabilities — control what happens next.*

Look at the diagram above. Every time the agent is about to take an action — use a tool, respond, compact context, stop — a **hook fires**. That hook can:

- **Block** the action entirely
- **Modify** the action before it executes
- **Trigger** additional behaviors
- **Log** what happened for future reference

This is how you turn a probabilistic chain into a **deterministic pipeline**. The LLM still does the thinking. But the hooks define the guardrails, the checkpoints, the reflexes — and most importantly, the **learning surface**. Every hook is a place where the agent can observe its own behavior, log what happened, and improve next time. The LLM proposes. The structure disposes.

Beyond hooks, the **instruction files** shape behavior even more fundamentally. A `CLAUDE.md` file (or `AGENT.md` in platform-agnostic setups) acts as **dynamic working memory**. It tells the LLM what phase it is in, what it should focus on, what decisions have already been made, and how to approach the current task.

![Circular diagram showing the Living Brain dynamic working memory cycle: 1. OBSERVE (absorb context), 2. PLAN (write detailed steps), 3. EXECUTE (perform tasks and log), 4. CONDENSE (clean and refine info), all revolving around a central Local CLAUDE.md file that serves as dynamic working memory.](../assets/images/blog/claude-md-working-memory.png)
*The working memory cycle. Information flows through five phases: context is absorbed during Observe, transformed into steps during Plan, updated with lessons during Execute, validated during Verify, and properly reabsorbed during Condense. An instruction file sits at the center, updated throughout.*

This cycle — **Observe, Plan, Execute, Verify, Condense** — is not something the LLM invented on its own. It is a structure defined in the filesystem. The LLM follows it because the instruction files tell it to. Remove those files and the LLM goes back to random-walking through its action space. We will return to these phases in detail as we build the seed agent in later essays. For now, what matters is that the cycle exists — and that the filesystem defines it.

The structure does not replace intelligence. It **channels** it. The same way a toaster does not generate electricity — it shapes electricity into toast.

<!-- ======== 6. PLATFORM DOESN'T MATTER ======== -->

## The Platform Does Not Matter

Here is where it gets really interesting.

If the agent is the filesystem, then **the platform is just the adapter**.

Right now, multiple CLI agent platforms support hook and event systems:

- **Claude Code** — hooks via `.claude/settings.json` (PreToolUse, PostToolUse, Stop, Notification, etc.)
- **Gemini CLI** — hook events shipped January 2026 (BeforeTool, AfterTool, BeforeAgent, AfterAgent, etc.)
- **OpenCode** — event hooks via plugin system (`tool.execute.before`, `tool.execute.after`, `session.idle`, `stop`)

As of early 2026, all three shipped hook systems within months of each other — confirmation that interception points are becoming a standard primitive in agent infrastructure.

The syntax differs. The concepts are identical. Each platform provides **interception points** where your rules can override the LLM's default behavior.

Think of it this way: `hook.sh` in Claude Code and `plugin.ts` in OpenCode are **adapters**. They translate platform-specific events into your agent's rule evaluation pipeline. The hook mechanism is an interchangeable sensory layer — like swapping out ears for antennae. The brain behind them stays the same.

This means your agent's core identity — its **knowledge, behaviors, rules, memory structures, and workflows** — is platform-agnostic. Those files do not care which LLM reads them. They do not care which CLI runs them. The filesystem IS the identity.

Swap the LLM? The agent still knows who it is. Swap the platform? The agent adapts through a new adapter layer. **Swap the filesystem?** Now you have a completely different agent.

![Hand-drawn sketch titled 'One Brain, Many Engines' showing an Agent Directory (.claude/) containing Knowledge, Rules, and Memory Files at center. Adapter Layers connect it to three interchangeable platforms: Claude Code, OpenCode, and Gemini CLI.](../assets/images/blog/one-brain-many-engines.jpg)
*One brain, many engines. The same agent directory — with its knowledge, rules, and memory — connects to different platforms through thin adapter layers. Swap the engine; the agent stays the same.*


<!-- ======== 7. COMPARTMENTALIZATION ======== -->

## The Core Principle: Compartmentalization

If the agent is the filesystem, then the quality of the agent depends on **how well that filesystem is organized**.

This is where **compartmentalization** becomes the core principle.

Compartmentalization means: **every piece of knowledge has a home**. Every behavior has a boundary. Every context is scoped to where it is needed.

![Four-level hierarchy of CLAUDE.md files: Level 1 at ~/.claude/CLAUDE.md for Global User Context, Level 2 at ./CLAUDE.md for Agent Identity, Level 3 at ./.claude/CLAUDE.md for the Brain Manual, and Level 4 at ./**/CLAUDE.md for Local Working Memory in subdirectories. A tree diagram on the right shows how these nest within the filesystem.](../assets/images/blog/CLAUDE-md-hierarchy.jpg)
*The four levels of compartmentalized memory. Global context at the top, local working memory at the bottom. Each file scoped to exactly where it is needed.*

Look at the hierarchy above. Information is not dumped into one giant prompt. Instead:

- **Global context** lives at the user level — preferences, conventions, stable patterns
- **Agent identity** lives at the project root — who the agent is, its operational phases, its personality
- **Brain documentation** lives in the agent's brain directory — how the brain works, its growth rules, its structure
- **Local working memory** lives in each subdirectory — task-specific context, scoped to exactly where it is needed. Think of it like the body's circulatory system: blood flows where it is needed most — to the digestive system after eating, to the muscles during a workout. Working memory inflates in the directory where the agent is active and contracts when attention moves elsewhere.

Without compartmentalization, you get **"prompt soup"** — every piece of context dumped into a single undifferentiated blob. The LLM drowns in noise. Behavior becomes unpredictable. The agent loses coherence.

With compartmentalization, you get **bounded contexts**. The agent loads only the information relevant to its current task. Knowledge is discoverable but not overwhelming. The agent can grow without collapsing under its own weight.

This is also what gives the agent **identity over time**. When the filesystem is well-compartmentalized, the agent's "personality" — its rules, its preferences, its memory — persists across sessions, across context compactions, even across LLM swaps. The compartmentalized information *is* the agent's identity.

<!-- ======== 8. WHAT THIS MEANS FOR YOU ======== -->

## What This Means for You

If you are building with AI agents — or want to start — here is the shift in thinking:

1. **Stop obsessing over which model to use.** Building an agent does not require a research lab or a training budget. The engine improves on its own every quarter. The structure you build around it is what makes it yours.

2. **Give your agent a brain.** Create a dedicated directory with structure, knowledge files, operational rules, and memory. This is not configuration — this is the agent itself. Without it, you just have a smart engine with nowhere to go.

3. **Write the habits down.** Consistency comes from structure, not from intelligence. Define phases. Define workflows. Define what the agent should do at each event. If it is not written in a file, it does not exist.

4. **Design for portability.** Your agent's brain should not be locked to one platform or one model. Keep the core identity in plain files — markdown, JSON, scripts. Let the platform-specific hooks be thin adapters, not the whole system.

5. **Think in compartments.** Scope knowledge to the directory that needs it. Bound behaviors to the phase they belong in. The better you compartmentalize, the more reliably your agent behaves — and the more gracefully it grows.

The electricity keeps getting stronger. That has never been the bottleneck.

**Build the toaster.**

---

*This essay establishes a foundation: the agent is the filesystem, not the model. The next essay takes this further — if the building blocks for durable, self-improving agents have been available for months, why are we still scaling only the engine? Read **["We Could Have Had AGI By Now"](we-could-have-had-agi.html)** to explore what happens when you scale architecture instead of scaling the model.*
