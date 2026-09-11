---
title: "LLMs Are Not the Agents"
date: "February 2026"
slug: "llms-are-not-the-agents"
read_time: "17 min"
tags: [Agents, AI, Fundamentals]
audience: professionals
og_image: "blog/b1/images/llm-engine-agent-directory-b1-1.png"
series: "Hadosh Academy – Agents"
version: v1.3.0
status: published
---


> **LLMs are electricity. Agents are toasters.**

Electricity is raw power. It can heat a room, run a hospital, or power a city. But plug it into nothing and it just arcs. It needs a **structure** to become useful.

A toaster is a simple structure. It takes raw electrical energy and channels it into a **specific, repeatable outcome** — toast, every time. Not because electricity "decided" to make toast. Because the wires, the timer, and the slots shaped the energy into a predictable result.

This is the relationship between an [LLM](https://en.wikipedia.org/wiki/Large_language_model "Large Language Model — AI software like ChatGPT or Claude that generates text") and an agent.

The LLM provides **raw reasoning power**. It can write, analyze, plan, and create. But without structure, the token stream it produces can flow in any direction. The agent provides the structure. It channels that stream into **consistent, reliable behavior**.

Most people building with AI today are staring at the electricity and wondering why it does not make toast on its own.



## The Misunderstanding

When people say "AI agent," they almost always mean the model. Claude, GPT, Gemini — pick your favorite. They point at the LLM and say: *"That is my agent."*

**That is the root misunderstanding.**

The model is not the agent. The model is the **engine** — a [token generator](https://en.wikipedia.org/wiki/Language_model "A system that produces text one piece at a time based on statistical patterns learned during training") that produces text one piece at a time based on patterns in its training data. It can reason, analyze, and create. But on its own, a token generator does not form memories, build identity, learn from experience, or maintain consistency across sessions. Those require something outside the model.

A jet engine sitting on the ground is incredibly powerful — but it is not an airplane.

Here is what happens when you treat the LLM as the agent:

- **No durable project memory on its own.** The model forgets the conversation unless the surrounding system supplies history, saved memory, or files.
- **No consistent behavior.** The same prompt can produce different results on different days. There are no habits, only probabilities.
- **No identity.** The model does not know who "it" is in the context of your project. It adapts to whatever you tell it in the moment.
- **No growth on its own.** A deployed model does not update its weights after your task. A surrounding system must preserve and reuse what was learned.

If your "agent" loses everything when you close the chat session, **you do not have an agent**. You have a very expensive autocomplete.

The real agent is something else entirely.



## What Is an Agent, Really?

In this series, an agent is the engine **plus a local brain**: the durable, user-shaped system around the model.

The most direct way to build that brain today is with a [CLI agent](https://en.wikipedia.org/wiki/Command-line_interface "Command Line Interface — a text-based way to interact with software") — a program that sits in a folder on your computer, reads and writes files in that folder, and can be controlled by the content of those files. Think of it as a general-purpose file manager powered by an LLM.

Current tools — Claude Code, OpenCode, Gemini CLI — are marketed toward technical users. The names suggest it: Claude *Code*, Open*Code*. But what these tools actually do is manipulate files and respond to file content. That capability extends far beyond writing code.

We will explore what CLI agents make possible in a later essay.

In a CLI agent, the brain is not abstract or metaphorical. It is **literal**. It is a collection of files and directories on your local disk.

**The agent is the filesystem.**

And here is the key insight: because a CLI agent can generate text and use tools to create and modify files, it can help build the brain itself. Give it a well-designed seed — a filesystem with a basic cognitive architecture already defined — and the agent can read its own structure, understand it, and extend it.

You describe what you need through conversation. The agent builds. The same seed can offer shared principles and building blocks, but what it grows into depends on you. You control the composition and authorize its growth. We will dive deep into what makes a seed agent work in the second half of this series.

This is good news. Training a frontier LLM requires budgets and specialized hardware most people will never touch. Building an agent around an existing hosted or open-weight model is far more accessible. You describe what you need through conversation. The LLM builds the filesystem. No training run. Just files.

As the agent takes on more work, it may consume more LLM calls — you might move up a subscription tier. But the total cost is a utility bill, not a research budget.

You are not creating intelligence — that already exists. You are organizing files that shape existing intelligence into reliable behavior.

And because its durable layer is made of files, much of it is transparent. You can open a folder and inspect the external memory and rules you designed. You can audit it. You can move it to another machine. You can hand it to a colleague. The model's internal inference remains a black box; your own structure does not have to be.

That filesystem gives rise to capabilities the LLM cannot achieve on its own:

- **Memory** — knowledge files, past decisions, learned patterns
- **Structure** — operational phases, rules, workflows
- **Reflexes** — automatic actions that trigger at specific moments
- **Identity** — who the agent is, how it behaves, what it prioritizes
- **Continuity** — persistent state that survives across sessions

![Diagram comparing LLM as engine (reasoning, probabilistic, no persistent memory) versus Agent as directory brain (memory on disk, hooks and rules, intentions). Swapping the engine gives faster or smarter. Swapping the directory gives a different agent.](images/llm-engine-agent-directory-b1-1.png)
*The LLM is the engine. The directory is the agent. Swap the engine and you get a faster model. Swap the directory and you get a different agent entirely.*

When you open one of these CLI agents in an **empty directory**, you have the platform agent and its built-in tools — but none of the durable project brain defined here. There is no local memory of yesterday. No rules it has learned from this project. No project identity it maintains.

**By the definition used in this series, this is not yet the agent.** It is an engine and platform with no local car built around them.

But when you add project instructions and a durable brain directory (`AGENTS.md` in Codex, `CLAUDE.md` and `.claude/` in Claude Code, `QWEN.md` in Qwen Code, or the equivalent in OpenCode and Gemini CLI) — with knowledge files, operational rules, memory structures, and workflow definitions — something fundamental changes. Those files become the inspectable **brain** of your agent. The brain tells the runtime and model **how to behave** in this project.

Without the LLM, this brain is just files on disk — sleeping. Nothing reads them, nothing acts on them. The moment you add the LLM, the filesystem **comes alive**. The agent reads its own instructions, follows its own rules, and writes back what it learns. Neither piece is the agent on its own. The agent is what emerges when the two meet.



## The Default State: The Random Walk Problem

To understand why structure matters, look at what happens **without** it.

A CLI agent in an empty folder has an **action space** — the set of things it can do at any given moment:

![Markov chain diagram showing Claude Code's action space as probabilistic state transitions. Multiple states like PLAN, EXECUTE, OBSERVE connected by arrows representing probabilistic choices.](images/action-space-markov-chain-b1-2.png)
*A simplified view of the raw action space. Without project structure, the LLM moves probabilistically among possible actions, with the available context shaping which paths are likely.*

- Respond in chat
- Use deep reasoning mode
- Use tools (read, write, edit, run, search)
- Ask for permission
- Delegate work to other agents
- Manage its working memory
- Stop

At each step, the LLM picks one of these actions based on probabilities. Then it picks again. And again. This creates a **probabilistic action chain** — a sequence of decisions where each step depends on the current state of the conversation.

The problem? **Small changes in context lead to completely different paths.** Rephrase your prompt slightly and you get a different sequence of actions. Run the same task twice and you might get two different approaches. The chain is inherently unstable.

This is why working with a bare LLM can feel like a **random walk**. It is intelligent, but it is not reliable. It might solve your problem beautifully today and stumble on the same problem tomorrow. A raw LLM agent behaves like a brilliant mind with no executive function. Full of potential, but scattered and inconsistent — unable to stay on track without external structure holding it accountable.

> Intelligence alone is not reliability. **Structure is.**



## Structure Changes Everything

Now watch what happens when you add structure.

The first and most fundamental piece of structure is a **project-instruction file**. Codex calls it `AGENTS.md`; Claude Code uses `CLAUDE.md`; Qwen Code uses `QWEN.md`. It is plain-text project context loaded according to the runtime's scope rules. Along with the current conversation and other runtime context, it helps shape what the agent prioritizes and which rules it follows.

One file at the project root is just the beginning. Instruction files can exist at multiple levels of the directory tree — each one scoped to its location, each one adding local context as the runtime discovers it. Together, they form a **layer of working context** spread across the filesystem. We will see this layer's full architecture in the compartmentalization section below.

What makes this layer powerful is that it does not just hold static information. It can define a **workflow** — a sequence of phases the agent moves through as it works. The workflow we use is called **OPEVC**: **Observe, Plan, Execute, Verify, Condense.**

![Circular diagram showing the Living Brain dynamic working memory cycle: 1. OBSERVE (absorb context), 2. PLAN (write detailed steps), 3. EXECUTE (perform tasks and log), 4. CONDENSE (clean and refine info), all revolving around a central Local CLAUDE.md file that serves as dynamic working memory.](images/claude-md-working-memory-b1-3.png)
*The OPEVC cycle. The agent moves through five phases — Observe, Plan, Execute, Verify, Condense — with CLAUDE.md files at the center, updated throughout. Each phase produces different work and different updates to working memory.*

In the reference system explored later, an agent following OPEVC is constantly moving information. During **Observe**, it gathers context—from local files, the web, and the user—and records findings in local working memory. During **Plan**, it writes the steps it intends to take. During **Execute**, it acts and captures implementation lessons. During **Verify**, it records what passed, what failed, and what to watch next time. Finally, during **Condense**, it cleans temporary notes, routes durable lessons to the right files, creates pending jobs for work outside the current scope, and returns the system to a clean state.

In the historical OPEVC implementation explored later, every phase reads applicable project instructions and writes to controlled working-memory surfaces. These files are not static documents. The working layer inflates as the agent works and contracts as it absorbs what it learned. The principle does not depend on one platform's filename.

This is not something the LLM invented on its own. It is a structure you define in the filesystem. The LLM follows it because the instruction files tell it to. Remove those files and the LLM goes back to random-walking through its action space. We will return to these phases in detail as we build the seed agent in later essays.

But defining a workflow in instruction files does not guarantee the agent will respect it. Instruction files guide. They shape context. They do not enforce. To make certain behaviors **mandatory**, you need something stronger: [**hooks**](https://en.wikipedia.org/wiki/Hooking "Trigger points where custom rules automatically run when an event happens").

Modern CLI agents support **hook systems** — events that fire at specific points in the agent's lifecycle.

<!-- RAW_HTML -->
<figure class="blog-image" data-explore="explore/hook-flow.html" style="margin: 2rem 0; text-align: center;">
  <span style="position: relative; display: inline-block; max-width: 800px; width: 100%;">
    <img src="images/hooks-and-action-space-b1-4.png" alt="Flow diagram of Claude Code Agent showing the full hook system: User Prompt flows through UPS Hook, then branches into Response, Thinking with PreToolUse and PostToolUse Hooks around tool use, Notification Hook, SubagentStop Hook, PreCompact Hook, and Stop Hook. Each hook is an interception point where deterministic rules can override probabilistic behavior." style="width: 100%; height: auto; display: block; border-radius: 8px;">
    <a href="explore/hook-flow.html" aria-label="Explore the interactive version of this diagram" title="Open the interactive hook map" style="position: absolute; top: 12px; right: 12px; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.4rem 0.78rem; font-size: 0.82rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5); transition: transform 0.18s ease, box-shadow 0.18s ease;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 7px 22px rgba(139,92,246,0.65)';" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(99,102,241,0.5)';">&#8599; Explore the map</a>
  </span>
  <figcaption style="text-align: center; font-style: italic; margin-top: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem;">The hook system in Claude Code. Every arrow is a moment where you can intervene. Every hook is a checkpoint where your rules control what happens next.</figcaption>
</figure>
<!-- /RAW_HTML -->

At supported lifecycle events, a configured **hook can fire**. Depending on the event and platform, that hook can:

- **Block** the action entirely
- **Modify** the action before it executes
- **Trigger** additional behaviors
- **Log** what happened for future reference

This is how you put a **guarded pipeline** around a probabilistic chain. The LLM still does the thinking. Hooks define guardrails, checkpoints, reflexes, and places where selected behavior can be recorded. Later, the agent can review those recordings, see what worked, and propose better controls under your authority. The LLM proposes. The structure disposes.

Two layers of structure inside the broader harness. **Instruction files and memory** shape behavior through what the runtime places in context — phases, rules, knowledge, and history. **Hooks and events** enforce supported boundaries through what the runtime can block, trigger, or record. The model proposes; the runtime carries context, tools, and permissions; the cognitive layer supplies durable direction; the job layer carries objective and lived state. Together, they transform a probabilistic token generator into a reliable cognitive system.

The structure does not replace intelligence. It **channels** it. The same way a toaster does not generate electricity — it shapes electricity into toast.



## The Platform Does Not Matter

If the agent is the filesystem, then **the platform is just the adapter**.

Right now, multiple CLI agent platforms support hook and event systems:

- **Claude Code** — [hooks](https://code.claude.com/docs/en/hooks "Claude Code hooks documentation — shell commands, HTTP endpoints, and LLM prompts triggered by agent events") via `.claude/settings.json` (PreToolUse, PostToolUse, Stop, Notification, etc.)
- **Gemini CLI** — [hooks](https://geminicli.com/docs/hooks/ "Gemini CLI hooks documentation — event-driven shell commands modeled after Claude Code's design") shipped January 2026 (BeforeTool, AfterTool, BeforeAgent, AfterAgent, etc.)
- **OpenCode** — hooks via [plugin system](https://opencode.ai/docs/plugins/ "OpenCode plugin system — JS/TS modules that subscribe to agent events") (`tool.execute.before`, `tool.execute.after`, `session.idle`)

As of early 2026, all three shipped hook systems within months of each other — confirmation that interception points are becoming a standard primitive in agent infrastructure.

The syntax and powers differ, but the underlying pattern is similar. Each platform provides **interception points** where your rules can influence or block supported behavior.

Think of it this way: `hook.sh` in Claude Code and `plugin.ts` in OpenCode are **adapters**. They translate platform-specific events into your agent's decision system. The hook mechanism is an interchangeable sensory layer — like swapping out ears for antennae. The brain behind them stays the same.

This means much of your agent's core identity — its **knowledge, behaviors, rules, memory structures, and workflows** — can remain in portable files. Platform-specific instructions, permissions, and events still need adapters. The filesystem IS the durable identity.

Swap the LLM? The agent still knows who it is. Swap the platform? The agent adapts through a new adapter layer. **Swap the filesystem?** Now you have a completely different agent.

![Hand-drawn sketch titled 'One Brain, Many Engines' showing an Agent Directory (.claude/) containing Knowledge, Rules, and Memory Files at center. Adapter Layers connect it to three interchangeable platforms: Claude Code, OpenCode, and Gemini CLI.](images/one-brain-many-engines-b1-5.jpg)
*One brain, many engines. The same agent directory — with its knowledge, rules, and memory — connects to different platforms through thin adapter layers. Swap the engine; the agent stays the same.*




## The Core Principle: Compartmentalization

If the agent is the filesystem, then the quality of the agent depends on **how well that filesystem is organized**.

This is where **compartmentalization** becomes the core principle.

Compartmentalization means: **every piece of knowledge has a home**. Every behavior has a boundary. Every context is scoped to where it is needed.

![Four-level hierarchy of CLAUDE.md files: Level 1 at ~/.claude/CLAUDE.md for Global User Context, Level 2 at ./CLAUDE.md for Agent Identity, Level 3 at ./.claude/CLAUDE.md for the Brain Manual, and Level 4 at ./**/CLAUDE.md for Local Working Memory in subdirectories. A tree diagram on the right shows how these nest within the filesystem.](images/claude-md-hierarchy-b1-6.jpg)
*The four levels of compartmentalized memory. Global context at the top, local working memory at the bottom. Each file scoped to exactly where it is needed.*

Look at the hierarchy above. Information is not dumped into one giant instruction file. Instead:

- **Global context** lives at the user level — preferences, conventions, stable patterns
- **Agent identity** lives at the project root — who the agent is, its operational phases, its personality
- **Brain documentation** lives in the agent's brain directory — how the brain works, its growth rules, its structure
- **Local working memory** lives in each subdirectory — task-specific context, scoped to exactly where it is needed. Think of it like the body's circulatory system: blood flows where it is needed most — to the digestive system after eating, to the muscles during a workout. Working memory inflates in the directory where the agent is active and contracts when attention moves elsewhere.

Without compartmentalization, you get **"prompt soup"** — every piece of context dumped into a single undifferentiated blob. The LLM drowns in noise. Behavior becomes unpredictable. The agent loses coherence.

With compartmentalization, you get **bounded contexts**. The agent loads only the information relevant to its current task. Knowledge is discoverable but not overwhelming. The agent can grow without collapsing under its own weight.

This is also what gives the agent **identity over time**. When the filesystem is well-compartmentalized, the agent's "personality" — its rules, its preferences, its memory — persists across sessions, across context compactions, even across LLM swaps. The compartmentalized information *is* the agent's identity.



## What This Means for You

If the vocabulary in this essay felt unfamiliar, that is normal. Learning agent concepts is like learning any professional tool — the way you once learned to think in slides and templates when you picked up PowerPoint, or in cells and formulas when you first opened a spreadsheet. The concepts are not hard. They just need exposure and repetition. This series will build them up, one essay at a time.

If you are building with AI agents — or want to start — here is the shift in thinking:

1. **Stop obsessing over which model to use.** New LLMs are being trained constantly. New forms of token generators will arrive. The engine keeps getting better — that was never the bottleneck.

2. **Give your agent a brain.** Create a dedicated directory with structure, knowledge files, operational rules, and memory. This is not configuration — this is the agent itself. Without it, the engine has nothing to build on — no memory to consult, no rules to follow, no identity to maintain.

3. **Write the habits down.** Consistency comes from structure, not from intelligence. Define phases. Define workflows. Define what the agent should do at each event. If it is not written in a file, it does not exist.

4. **Design for portability.** Your agent's brain should not be locked to one platform or one model. Keep the core identity in plain files — markdown, JSON, scripts. Let the platform-specific hooks be thin adapters, not the whole system.

5. **Think in compartments.** Scope knowledge to the directory that needs it. Bound behaviors to the phase they belong in. The better you compartmentalize, the more reliably your agent behaves — and the more gracefully it grows. And here is the most important part: you do not have to write every file yourself. A well-defined agent architecture can help build its own brain through conversation, then organize and update it under your control.

The electricity keeps getting stronger. That has never been the bottleneck.

**Build the toaster.**

---

*Essay 1 of 8 in the Hadosh Academy series on agent architecture.*

*Next: ["We Could Have Had AGI By Now"](../b2/02-we-could-have-had-agi.html) — what happens when you scale architecture instead of the model.*
