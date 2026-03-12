---
title: "The Language of Agents"
date: "March 2026"
slug: "the-language-of-agents"
read_time: "18 min"
tags: [Agents, AI, Vocabulary, Beginner]
audience: professionals
og_image: "assets/images/blog/agent-anatomy.png"
series: "Hadosh Academy – Agents"
companion_paper: "the-primitives-of-agent-architecture"
version: v1.0.0
status: published
---

# The Language of Agents

> **Every industry builds a wall of jargon. AI built one faster than any industry in history. This post hands you the keys.**

You already use AI. You open ChatGPT, or Claude, or Gemini in your browser. You type something. It types back. You have been doing this for a year, maybe two. You are not new here.

But then someone starts talking about LLMs and context windows, hooks and MCPs, prompt engineering and seed agents. The words stack up fast. Nobody stops to explain them. That is not your fault — the industry moves faster than its own vocabulary can settle.

This post fixes that. One read. Every word that matters. By the end, you will not just understand these terms — you will see how they connect into a single, coherent picture. No prerequisites. No code.

The first three essays made the case — why the model is not the agent, why architecture matters more than scale, why your brain needs a digital extension. Now we arm you with the vocabulary. Once you have the words, we start building.

---

## The Engine: What an LLM Actually Is

Start with what you already know. When you type a question into ChatGPT or Claude, something generates the response. That something is a **Large Language Model** — an LLM.

An LLM is a program that produces text. That is it. It does not think. It predicts what should come next, one piece at a time.

Those pieces are called **tokens**. A token is roughly a word — sometimes a whole word, sometimes part of one. When you see the response appearing word by word on your screen, you are watching the LLM produce tokens one after another.

Here is the part most people miss: **the LLM did not arrive in its current form.** It evolved through distinct phases, and each phase changed what AI could do.

### Phase One: The Autocomplete Machine

The earliest LLMs were trained on massive amounts of internet text. Their job was simple: given some text, predict what comes next. Think of it as autocomplete scaled to the size of the internet. You type "the cat sat on the" and the model predicts "mat." Impressive at scale. Useless for conversation.

### Phase Two: The Conversation Machine

Researchers figured out how to train these autocomplete engines to take turns. One turn for you, one turn for the AI. User and assistant, back and forth. This was the **instruction phase** — the LLM went from replicating text found on the internet to generating text that looks like a conversation.

This is when chatbots became useful. ChatGPT launched. Millions of people started typing questions and getting answers. The AI felt like it was talking to you.

It was not. It was generating tokens that pattern-matched conversations from its training data. But the result was close enough to be transformative.

### Phase Three: The Tool-Using Machine

Then the vocabulary expanded.

Researchers introduced special tokens — internal markers the LLM learned to produce at the right moments. Tokens like `<thinking>` that told the system to reason before answering. Tokens like `<tool_call>` that told the system to use an external tool — search the web, read a file, run a calculation.

The output stopped being just conversation. It became a mix of words, reasoning, and instructions to external systems. The LLM was no longer just talking. It was **acting**.

This is where we are now. Some tokens are words you read. Some are commands you never see. All of them are text.

### The Context Window

One more engine concept. Every LLM has a limit on how much text it can see at once. That limit is the **context window** — measured in tokens.

Think of the context window as a desk. Everything the AI knows right now is spread across that desk. Your question, the system's instructions, previous conversation, file contents, tool results — all of it competes for space on the same desk.

When the desk fills up, old information falls off. The AI forgets.

This is why raw LLMs — no matter how powerful — have limits. A bigger desk helps. But a bigger desk is not the same as a filing cabinet. The desk is temporary. The filing cabinet is permanent. That distinction matters enormously, and we will come back to it.

---

## From Browser to Desktop: CLI Agents

Now the important part.

The AI you use in your browser — ChatGPT, Claude, Gemini — runs on someone else's servers. You visit a website. You type. It responds. These tools are good. They remember conversations now. They learn your preferences over time.

But here is the catch: **you do not control how any of that works.** The company decides what gets remembered, how the AI behaves, what it can and cannot do. You are a guest in their house — their rules, their design, their boundaries.

Every one of those companies also offers the **same AI as a tool that runs on your computer**. Same models. Same intelligence. Same subscription plans. But instead of living in a browser tab, it lives on your machine.

That tool is a **CLI agent**.

**CLI** stands for Command Line Interface. It is the text-based program on your computer — the [terminal](https://en.wikipedia.org/wiki/Terminal_emulator "A program that provides a text-based interface to your computer"). You open it, you type, the AI responds. No buttons. No menus. Just text.

It sounds less fancy than a browser interface. The browser version and the CLI version run the same intelligence. The difference is not power. The difference is **control.**

A CLI agent is yours to customize in any direction you want. You decide how it remembers. You decide what it can access. You decide its personality, its rules, its boundaries. You can even add a graphical interface on top if you prefer one. The point is not the interface — the point is who is in charge.

And because a CLI agent lives on your machine, it can **see your files**. It can read documents, write new ones, search through folders, edit code, and organize your work. It is sitting inside your computer, looking at what you are working on.

And here is the key: **every folder on your computer can become a unique agent.**

Open a terminal in your legal case folder — the agent becomes your legal assistant, with access to every document in that case. Open a terminal in your marketing folder — same AI, completely different context, different personality, different memory.

The AI in your browser is a service you use. A CLI agent is a tool you own.

That is the shift. From using an assistant the company designed for everyone, to owning one you design for yourself. Same intelligence underneath. Completely different level of control on top. This is the idea from the [first essay](01-llms-are-not-the-agents.html): the agent is the filesystem, not the model. Now you have the word for the form factor that makes it real.

## The Briefing: System Messages and Persona

So you have a CLI agent on your machine. What makes it *yours*?

Before you type your first word, the AI receives a set of instructions. This is the **system message** (sometimes called a **system prompt**). You never see it, but it shapes everything the AI says and does.

In a browser, the system message is written by the company. It says things like "You are Claude, a helpful assistant made by Anthropic. Be safe, be helpful." You cannot change it.

In a CLI agent, **you write the system message.** It lives in a file — usually called `CLAUDE.md` or `AGENT.md` — right there in your project folder, where you can read and edit it.

That file is the agent's **persona**. Not just a name. Its role, its rules, its memory, its priorities. A lawyer's agent might have a persona that says: "You are a legal research assistant. Always cite sources. Never give legal advice directly — present findings and let the human decide."
And as your agent grows, its identity spreads beyond a single file. Instructions, memory, and personality naturally expand across multiple files and mechanisms — the way a person's character is not stored in one place but expressed through habits, knowledge, and experience built up over time.

One engine. A thousand possible agents.

## The Craft: From Prompt Engineering to Context Engineering

You have probably heard the term **prompt engineering**. It means carefully crafting what you type to get better results from the AI.

Prompt engineering works. It matters. But it put the burden on **you**. Learn the right phrasing. Structure your request just so. Add the right context manually. The better you get at prompting, the better your results. That kept AI useful mostly for developers and tech-savvy people — the ones willing to learn a new way of talking to a machine.

The field is moving toward something broader: **context engineering**. Instead of expecting the user to craft the perfect prompt, you design the entire information environment so the AI performs well **regardless of how the user asks**.

Context engineering does two things prompt engineering alone never did. First, it **internalizes** the prompting layer. The careful phrasing, the structured instructions, the right context — all of that gets built into the architecture itself. Internal LLM calls inside a complex system still use prompt engineering, but the *user* does not have to. You just ask. The system handles the rest.

Second, it expands the focus beyond just *talking to* the LLM. Think of it as a metabolism. Everything that flows through the AI — your prompts, its own reasoning, results from tools it uses — all of it is information that gets processed. Good context engineering means those tokens are absorbed into the agent's long-term memory and recalled when they are needed. The token generator has been invented. The real work now is building the rest of the system so those tokens are **metabolized**.

What files does the agent see? What instructions does it receive at startup? What tools can it use? What rules does it follow? What memory does it carry from previous sessions?

Prompt engineering is choosing your words carefully. Context engineering is designing the room so that a simple request is enough — the desk, the filing cabinets, the rulebooks on the shelf, the locks on the doors. The prompting still happens. It just happens inside the architecture, not inside your head. In the [second essay](02-we-could-have-had-agi.html#where-does-the-context-come-from), we called this balanced **context composition** — making sure every compartment that should influence the agent's thinking has a pathway in.

For a non-technical professional, context engineering might sound intimidating. It is not. It starts with a single text file — the system message. You describe who the agent is and how it should behave. Everything else grows from there, naturally, through conversation.

---

## The Reflexes: Hooks

When you drive a car, you do not think about checking your mirrors. You just do it. It is a reflex — an automatic action triggered by a specific moment.

**Hooks** are an agent's reflexes.

A hook is a rule that fires automatically at a specific moment in the agent's workflow. Before the agent edits a file — a hook can check if that file is allowed to be changed. A signed contract from a client? The hook blocks the edit, every time, no exceptions. After the agent finishes a task — a hook can log what happened. When the agent tries to stop working — a hook can say "not yet, you still have unfinished work."

In a well-designed seed agent, you do not code hooks — you describe them. "Before any file is deleted, ask me for confirmation." "After every task, save a summary to the log." The agent understands its own architecture well enough to extend itself — creating the right files, following its own structural rules — so your words become working reflexes without you touching code.

A good practice: after you describe a new hook, test it. Ask the agent to try the action the hook should catch, and verify it fires correctly. Think of it like hiring a new assistant — you give them an instruction, then you watch them handle it a few times until you trust the process. These systems are very good, but not perfect. A quick test builds confidence.

Hooks are what turn a reactive chatbot into a disciplined professional. Without hooks, the AI does whatever seems right in the moment. With hooks, it follows a process. Every time.

## The Skill Set: Skills, Commands, and Sub-agents

Think of it like an office.

A **skill** is a set of instructions the agent has learned — like a recipe card in a chef's kitchen. When the agent recognizes that a skill is relevant, it loads those instructions into its working memory and follows them. You do not have to tell the agent to use a skill. It notices when one applies.

A **command** is a button you press. You type a short name — like `/review` or `/commit` — and the agent runs a specific workflow. Commands are explicit. You trigger them on purpose, and they do exactly one thing.

A **sub-agent** is a specialist. When the main agent faces a task that needs focused attention — deep research, complex analysis, parallel work — it can spin up a sub-agent. The sub-agent works independently, finishes the job, and reports back. Like sending an associate to the library while you stay at your desk.

Skills are what the agent knows. Commands are what you tell it to do. Sub-agents are who it delegates to.

## The Connections: MCPs

Your agent sits on your computer. But the world does not live on your computer.

**MCP** stands for Model Context Protocol. It is a standard way for your agent to connect to external tools and services — your email, your Google Drive, your calendar, your Instagram feed, your phone's data, your company's internal systems.

Think of an MCP as a power adapter. Your agent speaks one language. The external service speaks another. The MCP translates between them, so your agent can read from a database, post to a project management tool, or pull data from a spreadsheet — without you manually copying and pasting.

MCPs are what turn a local agent into a connected one. The agent stays on your machine, under your control. But it can reach out and interact with the tools you already use.

## The Extensions: Plugins

A **plugin** is a container. It bundles tools, hooks, instructions, skills, and even sub-agents into a single package you can add to your agent. Think of it as a cognitive organ transplant — not a single capability, but an entire system of connected parts that integrates with everything already there.

One plugin might bundle professional skills together with guardrail hooks that prevent mistakes. Another might add cognitive memory tissue — persistence files, consolidation rules, and the hooks that trigger them — letting the agent keep working across sessions without forgetting where it left off.

Plugins are how agents grow without mixing new behaviors into existing ones. You do not rebuild the agent to add a capability. You install a plugin, and the agent absorbs it — new skills, new reflexes, new knowledge, all compartmentalized within the plugin's boundaries.

---

## The Memory: Seed Agents and Agentic Workforces

Two more terms, and these matter more than any of the technical ones.

A **seed agent** is a starting template — a [complex system](02-we-could-have-had-agi.html#the-seed-agent-small-structure-that-grows) designed to grow. It comes with a basic structure — some skills, some rules, a persona outline — and you customize it through conversation. You do not build an agent from scratch. You start with a seed and grow it into the [digital cortex](03-your-brain-was-never-built-for-this.html#the-digital-cortex) your organic brain needs.

Think of it like buying a house versus building one from lumber. The seed is the house. You move in and make it yours. Different furniture, different paint, different rules about shoes at the door. Same foundation, uniquely yours.

An **agentic workforce** is what happens when you grow multiple seed agents, each one specialized for a different part of your professional life. One handles legal research. One manages client communication. One runs your billing. One organizes your knowledge base.

You did not code any of them. You talked to them. You said "here is how I want this to work" and they adapted.

That is the endgame. Not one AI assistant. A workforce of specialized agents, each one customized to your work, running on your computer, under your control.

---

## The Big Picture

Picture all of this running at once. You open a terminal in your project folder. The **seed agent** wakes up, reads its **persona** and **context** from the files you have shaped over weeks of conversation. A **hook** fires — checking whether anything changed since your last session. The agent loads the right **skills**, reaches out through an **MCP** to pull your latest calendar, and a **sub-agent** spins up to handle a research task in the background. The **LLM** underneath produces tokens. Your architecture on top decides what those tokens mean.

None of this required code. You described what you needed. The system built itself around your words.

## Why This Vocabulary Matters

Every profession has its language. Lawyers have torts and depositions. Doctors have diagnoses and prognoses. Accountants have amortization and accruals.

None of those words exist to exclude you. They exist because precision matters. When a lawyer says "deposition," every other lawyer knows exactly what that means. No ambiguity. No wasted explanation.

The same is true here. When you say "hook," everyone in the ecosystem knows you mean an automatic reflex that fires at a specific moment. When you say "seed agent," they know you mean a customizable starting template. These words are not barriers. They are handles — grip them and the technology moves with you.

The industry built the jargon wall fast. You just walked through it.

---

*Essay 4 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: ["Your Brain Was Never Built for This"](03-your-brain-was-never-built-for-this.html) — why your organic brain needs a digital cortex.*
*Next: ["Every Agent Needs a Skeleton"](05-every-agent-needs-a-skeleton.html) — we start building. The skeleton.*

*Companion: ["The Primitives of Agent Architecture"](../papers/the-primitives-of-agent-architecture.pdf) (reference guide)*
