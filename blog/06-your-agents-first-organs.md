---
title: "Your Agent's First Organs"
date: "March 2026"
slug: "06-your-agents-first-organs"
read_time: "TBD"
tags: [Professionals, Agents, AI, Architecture, Jobs]
audience: "professionals"
series: "Hadosh Academy – Agents"
version: "v0.2.0"
status: "draft"
---

# Your Agent's First Organs

> **A skeleton without organs is a museum exhibit. Interesting to look at — not particularly useful.** {comment: what benefits give us punching down on museum, don't use useless analogies}

In the last essay, we introduced the skeleton — {comment: are we 100% sure that last essay has all we need for this essey to land perfectly, if not talk to me in the main session} the job system that gives your agent persistence, structure, and the discipline to manage work rather than just do tasks. Clean architecture. Necessary foundation. But a foundation by itself does nothing.

This essay puts cognitive organs onto that skeleton. Six specific jobs that ship with the seed agent, what each one does, why it exists, and what pattern it represents that you will use over and over again as you build your own.

Six jobs. Two categories. One working agent.

## Two Kinds of Work

Your agent does two kinds of work, and they operate by different rules.

**Background work** runs without being asked. The agent does it the way your heart beats — automatically, continuously, without your awareness. You do not start these jobs. You do not stop them. You barely notice them until one breaks, {comment: why would it break? why design it in a way that break? this feels like that these jobs can break, and my take is why don't we design it so that it does not break, you are punching down on our own design by claiming it can break. change the language or try being less poetic for the sake of writing something without considering how it describes our agent. why not use all we have access, instructions, hooks, etc. so it does not break!!} and then everything else starts failing.

**Focused work** is the work you engage with directly. You start it, collaborate on it, and approve the results {comment: do you approve its result of we did use a verification script as a gate for completion, you emphasize too much on poetic writing which you miss the main points we are trying to make, the first job is auto managed, it has objectives like every job (maybe talk about what thery are simialr at, and what are their differences) but objectives have clear hook to validate them and hence deactivate the job (can have one or more deliverables) -- the second set of jobs is more flexible, can set any arbitrary validation script, of course with confirmtion from teh user, also can be fouced unlike the provious job and you can have limited ability to update and manage the job object. again your writing is more poetic and less accurate.}. It has phases, deliverables, and a beginning and an end.

This distinction is not something we invented. It is how [complex systems](https://en.wikipedia.org/wiki/Complex_system "A system composed of many interacting parts whose collective behavior is difficult to predict from individual parts") organize themselves. Your body has processes you do not control — heartbeat, digestion, immune response — and processes you direct — walking, writing, deciding what to eat. Remove the first set and the second set becomes impossible. {comment: can you prove it will be impossible or you just saying since it ryhms well? I asked for less sensational language}

The same holds for your agent. Without background jobs keeping memory alive and context fresh, focused work falls apart. The agent forgets what you said. It loses track of where files are. It repeats work it already did.

We start with these two categories because they emerge naturally from how autonomous systems relate to their environments. As we explore further in future essays, finer distinctions may appear within each. But this framework carries us a long way.

## Your Second Technical Look: How Changes Become Memories

In the last essay, we looked at [JSON](https://en.wikipedia.org/wiki/JSON "A lightweight, human-readable format for storing and exchanging structured data") — the shape of data inside your agent. Now we take a second step into technical territory. Again, not programming. Just a concept worth understanding because your agent depends on it.

The concept is [Git](https://en.wikipedia.org/wiki/Git "A distributed version control system for tracking changes in files").

Git is a program that programmers built to solve a practical problem: dozens of people editing the same code files, and nobody knowing who changed what, when, or why. Git tracks every change to every file in a project. Each time someone bundles their changes and saves them with a label, that bundle is called a [commit](https://en.wikipedia.org/wiki/Commit_(version_control) "A snapshot of changes saved to the project history with a descriptive message").

Ignore the programming origins. What matters is this: git gives you a permanent, ordered history of every change ever made, each one labeled with a message explaining what happened. {comment: you can bring it the distinction, as previously git helped multiple people working simulatnously on text files, our seed agent uses the same facility even though it is the only entity changing the files}

Here is what a commit message looks like:

```
EXECUTE: Draft client onboarding checklist based on interview answers
```

That is it. A label and a description. The commit stores the actual file changes alongside it — what was added, removed, or modified. It is a free, open-source program used by millions of projects worldwide.

Why does this matter to you?

Because **we use git commits as your agent's [episodic memory](https://en.wikipedia.org/wiki/Episodic_memory "Memory of specific events and experiences, tied to time and context").** Every time the agent bundles its file changes and writes a commit message, it is forming a memory — a timestamped, labeled record of what it did and what phase it was in. Those memories persist permanently. The next session finds them. The session after that finds them too.

Get comfortable with the word **commit**. You will encounter it often. When we say "the agent commits its changes," we mean it creates an episodic memory — a labeled snapshot of work, preserved in the project's history.

You do not need to learn git. Your agent handles it. But knowing that commits equal memories will help you understand everything that follows.

## The Jobs That Keep the Lights On

These are the background jobs — the [autonomic nervous system](https://en.wikipedia.org/wiki/Autonomic_nervous_system "The part of your nervous system that controls automatic functions like heartbeat and digestion") of your agent. They activate on their own, run without being asked, and serve whatever focused work is happening at the same time.

Two jobs. Two different patterns. Both always on.

### Job One: Episodic Memory

Every time your agent changes a file, that change is a potential memory. Without this job, those memories vanish. The agent finishes a session, and the next one starts from zero. No continuity. No learning curve.

Here is how it works.

Your agent has a local [working memory](https://en.wikipedia.org/wiki/Working_memory "The system that actively holds information in mind for processing and decision-making") — a file called `CLAUDE.md` {comment: mention that this is true for claude code cli agent and other cli agent may call it differnetly} that lives in the project directory. When the agent observes something useful during your work — a pattern in your contracts, a decision about file structure, a note about what to do next — it writes that observation into `CLAUDE.md`. That file change is real. It exists on disk.

The episodic memory job senses that change {comment: not just this change but also any other change, the reason we have this is that some phases like observe don't create file changes if agent only reads files, so with this every phase, would lead to some file changes, eitehr actuall work files or working memory files --which again would be helpful if the reader already knows about OPEVC flow, we have to think how to introduce prerequisit terms liek CLAUDE.md files as local working memory with auto-append on read actions, and OPEVC flow so these ideas we describe in first job land, or use this job to introduce them in more concrete way rather than on passing. This essay is not very clear, either we need more useful context before this, or think deeply about how our readers can follow and understand this only based on what came before}. Uncommitted work has accumulated. The agent needs to form a memory.

What happens next is a gradual escalation. First, a gentle reminder — the job injects a note into the agent's context suggesting it commit its work. If the agent keeps working without committing, the pressure increases with stronger instructions. If uncommitted changes continue to pile up, the job blocks further file changes entirely. The agent cannot create new work until it commits what it has.

Think of this as **commit debt.** Like any debt, a small amount is fine. But let it accumulate and it becomes paralyzing. The episodic memory job enforces a healthy rhythm: work, commit, work, commit. {comment: balance is the key, usually commits are not a single file change and so the agent must learn to bundle relevant changes into one commit/episodic memory}

When the agent does commit, the message carries a phase label. {comment: you describe the content of the commit message as it is fixed, but we must be careful to indicate that message can be anything but since we want our agent to follow phases of work like OPEVC, we can enforce it to match what we like and this is where different agent can start to diverge and evovle new forms of episodic memories} Was the agent observing? Planning? Executing? Verifying? Consolidating? {comment: we say condensing for phase C in OPEVC, please don't invent a ne term and cause confusion} These five phases — observe, plan, execute, verify, consolidate {comment: condense, also you must introduce teh OPEVC before so this lands} — form a workflow that guides the agent through structured work. We will explore this workflow in depth in the next essay. For now, what matters is that every memory is labeled with the phase that produced it.

A commit message might look like:

```
OBSERVE: Identified 3 contracts missing renewal clauses in Q1 batch
```

or:

```
PLAN: Outlined review checklist for remaining contracts
```

Each commit is a snapshot — phase-labeled, timestamped, permanent. Together, they form a searchable timeline of everything your agent has done across every session.

One more important detail. When all changes are committed and the working directory is clean, the job deactivates itself. It goes quiet until new changes appear. And the agent cannot end a session with uncommitted work — the job blocks the exit. No memory left behind.

**The pattern:** sense changes, escalate pressure to record them, enforce structure on what gets recorded. This sensing-pressuring-structuring pattern is the template for any background job you might create later. A compliance monitor that senses policy violations and escalates until they are addressed. A quality checker that flags inconsistencies. Same pattern, different domain.

### Job Two: Neighborhood Awareness

Your agent works across dozens of directories. Each directory is a neighborhood — it has files, relationships between those files, and local rules about what belongs and what does not. Without this job, the agent treats every directory like unfamiliar territory. {comment: also mention that this helps to keep a clean work space, no messy directories, gaurantee for no file duplication, etc.}

The neighborhood awareness job maintains a small commentary file — called `DC.md` — in every directory the agent touches. The commentary describes what is in the directory, what the local conventions are, and what neighboring directories contain. When the agent reads any file, the `DC.md` files in the surrounding directories automatically inform its context. The agent always knows where it is and what the local rules are. {comment: we can use a simialr visuals we had before that shows the nested design of CLAUDE.md but now with DC.md added to it. }

Here is what a `DC.md` might contain for a directory holding client contracts:

``` {comment: our design is a xml file with file and subdir items, and a rule section, why are not shwoing that and showing something different, we can show xml as it is very plain text and easy to see. in its captino you can mention that xml files are structured text, knowing about the shape of key text files is useful}
# /documents/contracts/
Contains active client contracts (PDF and Word).
Naming: YYYY-MM-ClientName-Type.pdf
Related: ../templates/ has contract templates, ../archive/ has expired.
Local rule: never delete originals — move to archive.
```

This is the [spatial memory](https://en.wikipedia.org/wiki/Spatial_memory "The ability to remember the layout and content of locations") of your agent. Not one centralized map, but a distributed network of local knowledge — every directory aware of itself and its neighbors.

The job responds to filesystem changes with concrete cause-and-effect. When a file is created in a directory, the `DC.md` for that directory is flagged as stale — the agent updates it before stopping. When the agent reads a file, the nesting of `DC.md` files up the directory tree provides layered context — project rules, folder rules, local rules, all at once. When a `DC.md` grows too large, the job pressures the agent to reorganize: split the directory, archive old files, update descriptions. Healthy growth, not unbounded sprawl.

**The pattern:** sense filesystem changes, maintain distributed context, prevent disorganization. Contrast this with episodic memory. Episodic memory is centralized — one git history, one timeline of events. Neighborhood awareness is distributed — one file per directory, no single point of failure.

Memory over time versus memory over space. {comment: this is a very strong lens, and I would like other aspect that I don't like to be defined simialrly, bit don't overdo it. you must remember to never over do any particlualr langiage or tone, don;t over do punchy language, don't over do strong wording, don't over do smooth and weak and soft language for non-techncial compfrot, don't over do technical jargon and descriptions, etc.}

### What They Do for Your Focused Work

These background jobs do not just serve themselves. When you sit down with your agent to work on a focused task, both are active participants.

Episodic memory tracks every phase of your project through labeled commits. If a session ends unexpectedly, the commit history preserves exactly where the work was when it stopped. Neighborhood awareness provides navigation — when your project touches directories the agent has not visited recently, the `DC.md` files provide instant context without re-exploration.

Together, they are the infrastructure your focused work runs on.

## The Jobs You Work With {comment:  we must spend this blog on the forst category, and expand on faithfully introduce CLAUDE.md layer as an existing feature of claude code as a generic cli agent, introducing OPEVC as a foundamental flow that we want our jobs to obey, or since OPEVC is for focused work, we can omit it here and don't mention phase and inside content of the episodic memory here, and in the next blog introduce OPEVC for a focused and long work operations, and say that we enforce it via episodic memory content and how it can be forced to align with a pattern, showing how background work can also help focused work??! and since we are using CLAUDE.md layer in the observe plan, execute, verify and condense and in general the OPEVC is tightly bound to the CLAUDE.md files, we can move them both to the other blog, and describe the jobs purely at what they do and in the next blog make the connection. or next several blogs.}

These are the focused jobs. They activate when you or the agent decides to start something. They move through phases — observe, plan, execute, verify, consolidate. They produce deliverables. And they have completion criteria that must be met before the job can close — not because the agent decides it is done, but because a [validation script](https://en.wikipedia.org/wiki/Test_automation "Software that automatically checks whether work meets predefined criteria") confirms it.

Four jobs. Each with a different deliverable, a different relationship between you and the agent, and a different pattern you will reuse.

### The Spectrum

Not all focused jobs work the same way. Some need you at the center — your knowledge, your preferences, your judgment. Others let the agent work independently while you review results. This is a spectrum, not a binary.

On one end: **you are the primary source.** The agent interviews you, captures your input, and produces something that could not exist without your direct participation.

On the other end: **the agent is the primary worker.** You hand it a plan or specification, and it builds. You review results, but the agent provides the labor.

Most jobs fall somewhere between. Understanding where a job sits on this spectrum changes how you interact with it.

### Job Three: Design a Job

You tell your agent: "I want a job that handles client onboarding for my law practice." The agent does not start building. It starts asking.

What does onboarding involve? What documents are collected? When is the process complete? How do you know a good onboarding from a bad one?

The agent interviews you, one question at a time. Your answers accumulate in the job's records — a durable file that survives long past the conversation that produced it. When the agent has enough understanding, it drafts a plan. You review it. You approve it. The deliverable is a set of text files that capture your intent precisely enough for another job to build from.

This job sits at the **collaborative end** of the spectrum. You are the source. The agent is the synthesizer.

**The pattern:** interview the user, accumulate understanding, produce text deliverables. The completion gate is a validation script — not "does the agent think it is done" but "does the plan meet measurable criteria." This pattern extends to any work where understanding comes before action: requirements gathering, research synthesis, strategic planning.

### Job Four: Brainstorm

Similar to designing a job, but the deliverable is different. You are not planning what to build — you are exploring what to think.

"I want to start my own brand of canned drink." The agent helps you explore. What flavors? What market? What distribution channels? Who are the competitors?

The deliverable is not a construction plan. It is organized research, structured thinking, captured ideas. The difference from Design is scope and completion criteria. A design plan is complete when it has enough specificity to build from. A brainstorming output is complete when it has enough breadth to decide from. Different metrics, same underlying pattern.

### Job Five: Build a Plugin

Now the spectrum shifts. This job takes a completed plan from Design and builds it. The agent writes code, creates hooks, assembles configuration, and tests the result.

You do not code. You probably never will. But your agent does. And this job is where it works most independently. You provided the plan. The agent provides the labor.

Here is what matters to you as a non-technical user: the validation script is your safety net. You do not need to read the code. You need the tests to pass. The agent cannot declare the job complete until the script agrees.

And notice the chain. Design produces a plan. Build consumes that plan. When Design completes, Build can activate automatically — [chained activation](https://en.wikipedia.org/wiki/Pipeline_(computing) "A set of processing elements where the output of one becomes the input of the next"). Design flows into build without you manually starting the next step.

**The pattern:** take a plan, produce complex artifacts, validate with automated tests. This pattern extends to building anything with a verifiable output.

### Job Six: Self-Improvement

This job breaks a rule. Every other focused job runs once and completes. This one comes back.

The self-improvement job reads the agent's own experience data — transaction logs, observations, patterns noticed during other jobs — and proposes improvements to existing components. Not new features. Improvements to what already works. Tighter rules. Better hooks. Cleaner structure.

It is [recurring](https://en.wikipedia.org/wiki/Cron "A time-based job scheduler that runs tasks at specified intervals"). When it completes, it returns to standby instead of closing permanently. It reactivates when enough new experience has accumulated.

And it has a mechanism no other job uses: **scheduling ahead.** When the agent finishes any focused job and enters the consolidation phase, it processes what it learned. Some learning is urgent — absorb it immediately. Some is complex — it needs dedicated work. For the complex stuff, the agent activates a self-improvement job with a specific objective. Not "improve everything." Improve *this specific thing*, based on *this specific experience*.

Here is the enforcement. The agent finishes your brainstorming session. You approve the deliverables. The agent tries to stop. But a self-improvement job is active — activated during consolidation. The stop-blocking mechanism kicks in. The agent cannot stop until it completes the improvement work.

Learning is not optional. It is structurally enforced. The agent improves because the system will not let it stop without improving.

**The pattern:** read experience data, propose improvements, reactivate periodically. And the scheduling-ahead mechanism — where consolidation activates improvement — is available to any job that needs it.

## Why Six Is Enough

| Job | Category | You vs Agent | Deliverable | Activation |
|-----|----------|-------------|-------------|------------|
| Episodic Memory | Background | Invisible | Commits | Auto — senses file changes |
| Neighborhood Awareness | Background | Invisible | DC.md files | Auto — senses filesystem changes |
| Design a Job | Focused | You drive | Text / plans | You start it |
| Brainstorm | Focused | You drive | Text / knowledge | You start it |
| Build a Plugin | Focused | Agent drives | Code / artifacts | Chained from Design |
| Self-Improvement | Focused | Agent drives | Improved components | Recurring / scheduled |

Two background patterns. Four focused patterns across the collaboration spectrum. Three activation types — automatic, user-triggered, and chained or recurring.

"But what about my specific use case? I need a client onboarding job. A case review job. A billing reconciliation job."

You build them. That is the point.

The seed agent does not ship with your jobs. It ships with the jobs that *create* your jobs. Design a Job is how you define what you need. Build a Plugin takes that definition and constructs it. The seed provides mechanisms, not domain knowledge. Your expertise fills in the rest.

Six is enough because these jobs cover every *pattern*. Any future job you create will be an instance of one of these patterns, a combination, or a slight variation. The patterns are the vocabulary. Your jobs are the sentences.

And as you create custom jobs and use them, they generate experience data. The self-improvement job reads that data and proposes improvements. Your custom jobs get better. Better jobs generate better data. The agent learns from what it learned.

The seed agent is not finished software. It is a starting point that improves the more you use it.

## The Shape of What Comes Next

We introduced a skeleton — the structural framework that manages work. Now we have six cognitive organs — jobs that give your agent memory, spatial awareness, the ability to understand your intent, build what you need, and improve itself over time.

But we have only hinted at the most important part. Every focused job moves through phases: observe, plan, execute, verify, consolidate. These are not decorative labels. They are a workflow engine that guides the agent through structured, verifiable work.

The next essay opens that engine. How does an agent move through phases? What prevents it from skipping steps? What happens when a phase fails? And why does the order matter more than most people expect?

We gave the agent a skeleton. We gave it organs. Next, we teach it how to think.

---

## Hadosh Academy — Agents Series

**Essay 1:** [LLMs Are Not the Agents](01-llms-are-not-the-agents.html)
**Essay 2:** [We Could Have Had AGI By Now](02-we-could-have-had-agi.html)
**Essay 3:** [Your Brain Was Never Built for This](03-your-brain-was-never-built-for-this.html)
**Essay 4:** [The Language of Agents](04-the-language-of-agents.html)
**Essay 5:** [Every Agent Needs a Skeleton](05-every-agent-needs-a-skeleton.html)
**Essay 6:** Your Agent's First Organs (this post)

**Resources:**
[hadi-nayebi.github.io](https://hadi-nayebi.github.io)
[skool.com/claude-agents-engineering](https://www.skool.com/claude-agents-engineering-4513)
