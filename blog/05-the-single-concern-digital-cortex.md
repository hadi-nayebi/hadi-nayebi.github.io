---
title: "The Single-Concern Digital Cortex"
date: "May 2026"
slug: "the-single-concern-digital-cortex"
read_time: "TBD"
tags: [Architecture, Seed Agent, Plugins, Information Bus]
status: draft
version: v0.24.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/single-concern-digital-cortex.png"
---

# The Single-Concern Digital Cortex

*Essay 5 of 8 in the Hadosh Academy series on agent architecture. Part 2 — the technical arc — opens here.*

---

Now we open `.claude/`.

In [the interlude](03_1-the-folder-is-alive.html), I claimed that any folder on your computer with a `.claude/` becomes a seed agent — the brain in `.claude/`, the work in sibling directories. The inside of that folder is *compartmentalized*: every concern, every form of memory, every behavior lives in its own place with its own files. Compartmentalized information is what lets a seed agent stay coherent as it grows.

Another core principle: the chat is volatile and cannot be the primary home for a seed agent's memory. The memory lives in the compartmentalized brain inside `.claude/` instead. Long before the underlying model would otherwise run out of room in its context window, the seed agent forces a *self-compaction* — the conversation is summarized, most of it discarded, the rest rebuilt from a smaller context. The files inside `.claude/` are unaffected by that compaction; they sit on disk and remain available to the new context as soon as it starts.

Memory of the seed agent lives in several compartments, organized by the form of the memory. The working memory of what the seed agent is currently doing or experiencing lives on a *memory bus* — a hierarchy of plain Markdown files at known locations on disk. Long-term memory that requires active recall lives in `.claude/knowledge/`. Long-term memory with automatic recall lives in files called `voice.xml`. Procedural memory lives as logical code in bash scripts and other code files. Memory that protects the seed agent against code regression over time lives in test files. There are more forms still — we will meet them across these essays.

To manage all of those, the seed agent defines cognitive units called *plugins*: directories where the logic, memory, and mechanisms for a single concern live together. The plugins inside `.claude/plugins/` split into two categories. The always-on plugins are active all the time, shaping how the seed agent operates no matter what it is currently doing. The phasic plugins manage what we will call the *markov brain* — they actively control the seed agent's behavior while it is operating inside a particular phase. We open the markov brain in [Essay 6](06-the-markov-phasic-brain.html). This essay is about the always-on plugins.

---

## Two Categories, One Substrate

The **always-on layer** is active all the time and runs on every prompt, every tool call, every session start, regardless of which job the seed agent is currently working on. This layer owns infrastructure: locking plugins for updates, context budgets, job structure, conversation discipline. The current prototype ships five always-on plugins (`plugin_integrity`, `brain_guard`, `job_core`, `interaction_summary`, `question_discipline`). The category is the load-bearing thing — not the count. A custom seed could add a sixth or a seventh and the architecture wouldn't shift.

The **phasic layer** activates one plugin at a time, dictated by which phase the active job is in. It currently implements a five-phase cognitive cycle called OPEVC — observe, plan, execute, verify, condense — plus an orchestrator (`phasic_system`) that tracks where each job sits in that cycle. The cycle can be extended as users customize their seed agent and grow its markov brain. Each phase makes a different set of tools available to the seed agent: OBSERVE and PLAN are read-only against project files, EXECUTE writes inside a fenced scope, VERIFY runs scripts only, and CONDENSE writes inside `.claude/` only, absorbing the recent experiential data from previous phases. We open the phasic layer in [Essay 6](06-the-markov-phasic-brain.html).

Underneath both layers sits the substrate that the previous section listed — the working-memory bus on the CLAUDE.md hierarchy, the knowledge directory, the voice.xml files, the bash scripts, the test files. The two plugin layers play different roles against this substrate. The always-on layer enforces the rules that protect it: locking plugins during edits, watching the context budget, capturing jobs and interactions, gating questions through registered prefixes. The phasic layer fills the working-memory bus during each cycle, then absorbs the durable parts back into longer-term memory at the end.

---

## Why "Single Concern" Matters

Each always-on plugin owns exactly one thing.

`plugin_integrity` owns plugin edit safety. `brain_guard` owns self-compaction. `job_core` owns the job lifecycle. `interaction_summary` keeps a focused job's mega-prompt legible as it grows. `question_discipline` owns the asking gate. Each plugin lives in its own folder under `.claude/plugins/<name>/` with its own hooks, scripts, hidden `data.json`, tests, and `voice.xml`. Naming the concern is easy because each plugin only has one to name.

The single-concern principle is a *minimize* rule, not an *eliminate* rule. Pure isolation is what a traditional library aims for — clean modules with no shared state, talking to nothing they don't import. The seed agent is a complex cognitive system, and a small amount of structured coupling between plugins is what lets the parts compose into ceremonies larger than any one plugin. The historian ratchet inside `plugin_integrity` is a clean example. It blocks plugin editing when the plugin's evolution narrative has fallen behind, and to do that it depends on `question_discipline` registering the `[PLUGIN-LOCK]` prefix, on `job_core` capturing the user's approval answer, and on the safe-lock cycle protecting the plugin during the edit. Three plugins compose into one ceremony, each contributing what it owns.

The discipline is in *how* the coupling happens. When plugins talk to each other, they talk through public, stable interfaces — the script CLIs each plugin exposes (`job.sh focused`, `phase.sh current`, `summary.sh status`), the registered-prefix system, the `voice.xml` id handles, the footer marker protocol. A plugin reads from another plugin's published interface; it never opens another plugin's `data.json` directly. Each plugin's internal state stays private; only the interface is shared.

The shape buys three concrete things. Plugins evolve independently — a change inside `interaction_summary` cannot break `job_core` as long as the read-only `job.sh` API stays the same. Plugins are testable in isolation — each `tests/` directory exercises one plugin's behavior without standing up the entire seed. Plugins are addable — a sixth always-on plugin slots into the architecture by exposing its own public commands, not by rewiring anyone else's.

Single-responsibility is one of the oldest disciplines in software. What the seed agent adds, on top of the principle, is a careful description of which couplings are allowed to exist and how those couplings are mediated. Most plugins decoupled. A few composing through narrow public interfaces. None silently entangled.

---

## The Always-On Plugins

Below is the current prototype's always-on layer. For each plugin: what it owns, what would break without it, and how it works.

**`plugin_integrity`** — exists to prevent accidental edits from regressing a plugin's established logic. It does this by leveraging git checkpoints and the plugin's own test suite. The lock applies when a plugin's code files need updating — documentation files inside a plugin (`.md`, `voice.xml`) move under their own rules, with a few caveats.

To begin a code edit, the seed agent asks the user to unlock the target plugin through a structured question. From that moment the plugin's hidden `data.json` carries the state of the edit session — which plugin is currently unlocked, the git checkpoint SHA captured at unlock time. The lock closes the moment one of three things happens: an edit lands outside the unlocked plugin, a different plugin is unlocked, or the agent explicitly calls safe-lock. At that moment the plugin's full test suite runs. Tests pass and the change commits. Tests fail and the working tree rolls back to the captured checkpoint, the plugin's `data.json` records a structured revert entry (timestamp, failed tests, files restored, pre-revert SHA, trigger reason), and a voice line writes to stderr so the operator cannot miss what happened.

The fuller ceremony — the prefix-required unlock question, the user-approval branch, the historian-ratchet check that refuses unlock when the plugin's evolution narrative has fallen behind, and the caveats around documentation-file editing — is deconstructed in [Essay 7](07-the-plugin-kit.html). The role to remember here is the always-on one: every plugin code change passes through a test gate, and a failed gate undoes the change.

**`brain_guard`** — manages **self-compaction** before the conversation reaches the model's default cutoff. It works by watching context usage on every tool call and progressively tightening the agent's grip on tools as the window fills. The whole mechanism fires well before Claude Code's default auto-compact at 100%, and reduces the need for manual compaction by the user — which is what makes the seed agent more independent when the user is away from the terminal.

A `PreToolUse` sensor (`context-sensor.sh`) reads the running token count on every call. At roughly 20% of the window, the plugin injects a coaching voice prompting the agent to draft a structured `/compact` instruction — the design rests on a working assumption that Opus 4.7's effective reasoning begins to soften somewhere around 30% of a 1M-token window, so 20% is the moment to act with headroom still available. If the agent ignores the prompt, at 25% the plugin starts blocking `Read` tool calls. At 30%, it adds `Edit` and `Write` to the block list. The progressive squeeze is deliberate: rather than letting the agent drift toward a hard wall, `brain_guard` removes one tool at a time until the only graceful move left is to compact.

The compaction itself is shape-enforced. The plugin requires the `/compact` instruction to carry five named sections (User Requests, Decisions, Design Choices, Corrections, Current State) before it is accepted; any instruction missing a section gets blocked until the agent rewrites it. The five-section template is not gospel — it is the current shape, and the broader idea is what matters: a compartment that demands a shape forces the agent to *produce* content that fits the shape, and the act of producing that content is itself useful context, guiding the seed agent's thinking about its own context compaction. The pattern generalizes — structured git commits, structured plan files, structured subagent dispatches all could use the same trick: the shape compels the production of the very context the next step needs, and the act of producing it guides the agent's reasoning along the way. Future seed-agent generations may evolve the compaction template, add sub-sections per use case, or define different shapes for different compaction moments.

Mechanically, the `/compact` self-issue is hacky. A script called `self-compact.sh` types the instruction into the active terminal — through `xdotool` plus `xclip` under X11, or through `tmux set-buffer` and bracketed paste under tmux — because Claude Code does not yet expose an API for an agent to trigger compaction before the 100% auto-compact. The script writes a `last_self_compact_at` timestamp into the plugin's hidden `data.json`, and the next firing of the tier guards reads that timestamp to grant a 300-second grace window so the compacted transcript can register before the gate would otherwise re-block. The community has surfaced this gap with Claude Code; if and when a native intermittent self-compact API ships, this plugin's terminal-typing layer retires and the rest of the discipline (the tier sensor, the shape-enforced instruction, the post-compact grace window) carries forward unchanged.

Without `brain_guard`, the agent runs the conversation off a cliff. The default 100% auto-compact fires eventually, but without the agent's own plan for what to preserve — and the next session starts from whatever the model happened to have in the window at that moment.

**`job_core`** — exists to compartmentalize the seed agent's *work*. The unit of compartmentalization is the *job* — a container for everything the agent does between the moment a piece of work begins and the moment it is complete. Every prompt, every reasoning cycle, every action belongs to one. The plugin works by routing each user prompt into a job (creating a new one if none is focused, attaching as an interaction if one is) and by refusing to let the agent stop while any job remains active. It applies on every prompt the user submits, every Stop event the agent triggers, and every `[JOB-COMPLETE]` claim the agent makes.

A `UserPromptSubmit` hook (`prompt-handler.sh`) intercepts every user prompt and either creates a new active job or appends the prompt as an interaction on the currently focused one. The interaction field of a job is what the seed agent treats as its *dynamic mega-prompt*. In most agent designs, "the prompt" is a one-off — text handed to the model at the start of the exchange and rarely revisited. Here, the prompt is cumulative: the first user message in a session seeds a new job, every later prompt and every Q&A appends into the same job's interaction list, and the *whole list* is what the agent reads as its instruction set going forward. The next plugin in this layer — `interaction_summary` — keeps the dynamic mega-prompt legible as it grows by generating a chained summary that carries the key context forward, and the act of regenerating that summary repeats the load-bearing facts along the work so they don't fall out of the working window.

The interaction list is just one form of state attached to a job. When a job is created it is assigned a unique ID — a timestamp from the moment of creation — and the *base* job object (name, status, interaction list, dependencies, completion fields) lives in `job_core`'s own `data.json`. Other plugins that need to carry context about that job *extend* the same job object under the same ID inside their *own* `data.json`. `interaction_summary` does exactly this — when a job's interactions cross the summarization threshold, the plugin creates a mirror entry under the job's ID in its own data file and starts appending summary blocks there. The phase plugins ([Essay 6](06-the-markov-phasic-brain.html)) do it on a larger scale: each phase plugin keeps its own per-job state — multipliers, point ledgers, plan-file pointers, footer markers — keyed by the same ID. No plugin reads another's data file directly. But the shared key lets each plugin's view of the job line up with every other plugin's view without runtime coordination. The same job ID surfaces in multiple plugin data files — `job_core`'s base object, `interaction_summary`'s mirror, each phase plugin's per-job state — and that consistency is what makes the job a true cross-plugin compartment.

A `Stop` hook (`stop-gate.sh`) refuses to let the agent end its turn whenever any active or pending job remains. The refusal message is phase-aware — observation phases get reminders to check CLAUDE.md before synthesizing, execution phases get reminders to keep edits inside the altered-list, and so on — and it functions as a *re-orientation*, not a flat no: when the seed agent tries to stop prematurely, the message reminds it of what its current phase still expects before stopping is even on the table. This is a deliberate generalization of an older agent-design pattern called the *Ralph-loop* — originally a single prompt re-injected at every Stop-hook block to keep the agent re-firing on the same task. In `job_core`'s version, the job's `active` flag *is* the loop signal: the agent cannot stop while any job is active, and pending jobs scheduled ahead extend the loop across whatever queue the operator — or the seed agent itself, when it queues follow-up work or schedules jobs that will become active later — has set up. The seed agent runs continuously until every active and pending job has been completed, which is what makes long-running, hands-off operation possible.

Completion is a *two-stage* gate, deliberately simple in the current prototype. A `PreToolUse:AskUserQuestion` hook (`question-capture.sh`) validates that any `[JOB-COMPLETE]` question contains the focused job's name, runs at least a hundred words of review, and presents *exactly* the "Review" and "Approve completion" options. After the user picks Approve, a separate `PostToolUse` hook (`question-capture-hook.sh`) walks the focused job's `depends_on` array, refuses approval if any of the listed dependencies are still unfinished, and only then flips `user_approval=true`. The two-hook split is itself a workaround: registering the same script for both Pre- and PostToolUse:AskUserQuestion silently kills the post handler in Claude Code, so the validation half and the approval half had to be carved into separate files. The current shape — user-approval gate plus dependency-graph check — is a foundation, not a finished design. Future seed-agent generations can graduate completion to automated criteria, verifier subagents, or multi-stage approval chains; the two-stage skeleton is what lets that evolution land without rewriting the lifecycle.

Without `job_core`, the agent has no notion of *what work am I doing*. Every prompt is a one-off, there is no thread of intent to come back to, no place for follow-up work to live, no signal that says the agent is or isn't done. The cognitive horizon collapses to the current turn — and everything the rest of the always-on layer is built to support (the bus, the locks, the summary chain, the asking gate) has nothing structural to attach to.

**`interaction_summary`** — exists to keep a job's dynamic mega-prompt legible as it grows. It works by counting tokens after every user interaction and forcing the agent to draft a structured summary the moment the unsummarized portion crosses a threshold. It applies inside any job whose interaction list grows long enough to compress — short jobs that never cross the threshold never see the plugin engage.

Enforcement runs in two phases. A `PostToolUse:AskUserQuestion` hook (`token-counter.sh`) fires right after `job_core` records each interaction, multiplies the unsummarized word count by 1.3 to approximate tokens, and trips a `summary_needed` flag when the result crosses a threshold (default 500). On the next tool call, a `PreToolUse` guard (`summary-guard.sh`) blocks `Edit`, `Write`, `MultiEdit`, `Read`, `Bash`, and `AskUserQuestion` until a structured summary lands. The submit command — `summary.sh submit <id> "<text>"` — won't accept just any text: the summary has to be between 200 and 1000 tokens and contain five named sections (User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State), each at least fifty tokens long. The block has one deliberate escape hatch — infrastructure-prefixed questions like `[PLUGIN-LOCK]` and `[JOB-COMPLETE]` are still allowed, so the agent cannot get into a deadlock where it needs to ask for permission to do the very thing the guard is asking for. The summary chain is append-only and lives entirely in the plugin's own `data.json`; older entries cannot be rewritten. The mirror object is created lazily — short jobs that never cross the threshold never appear in `interaction_summary` at all.

Without this plugin, long jobs lose narrative coherence as the interaction list bloats; the summary chain is what keeps a job legible at a glance and what survives forward when the job spans more than one OPEVC cycle.

**`question_discipline`** — exists to make every question the seed agent asks the user *structured*. It works by gating every `AskUserQuestion` call against a small list of registered prefixes — only ceremonial questions (locks, approvals, plan-complete claims) get through. It applies on every `AskUserQuestion`, with one deliberate runtime exception for dispatched subagents.

A single `PreToolUse:AskUserQuestion` hook (`question-discipline-gate.sh`) walks every question in the call and matches its first token, case-sensitive and anchored to position zero, against a `readonly PREFIX_REGISTRY` bash array hardcoded in the script. The registry currently holds seven entries — `[PLUGIN-LOCK]`, `[TEST-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, `[PLAN-COMPLETE]`, `[POINT-BOOST]`, `[WAITING]`. Six of those name very specific ceremonies — unlocking a plugin, approving a job, claiming a plan is complete, and so on. `[WAITING]` is the deliberate generic — a catch-all for the cases where the seed agent legitimately needs input from the user and the situation does not fit one of the structured ceremonies. The prefixes cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no `data.json`; the registry is its only state and it cannot be mutated at runtime. The lone runtime exception is dispatched subagents, which set `CLAUDE_SUBAGENT=true` and bypass the gate so they can ask their own internal questions without the user-facing prefix overhead.

Without `question_discipline`, every `AskUserQuestion` is fair game — the agent's asking surface bloats with low-value confirmations, and the structured ceremonies (locks, approvals, plan-complete claims) lose the prefix scaffolding the rest of the always-on layer uses to dispatch on.

Five concerns, in this prototype. Five separate folders under `.claude/plugins/`. None of them reach into another's private state. When they compose, they compose through public interfaces — registered prefixes, script CLIs, voice ids, the shared job ID. The CLAUDE.md hierarchy underneath them all is what we open next.

---

## The CLAUDE.md Hierarchy as Information Bus (aka Working Memory)

Drop a file named `CLAUDE.md` into a project, and the standard Claude Code CLI agent reads it. Drop one into `.claude/`, and it gets read too. Nest more of them inside subdirectories, and Claude Code surfaces each one when the agent works near it. Other agentic CLI agents run the same pattern in their own ecosystems — Codex and opencode read `AGENTS.md`, Gemini CLI reads `GEMINI.md`. The shared move: a plain Markdown file at a known location, automatically appended to the model's context whenever the agent reads or edits files in that directory. This is most obviously useful for code, where each `CLAUDE.md` doubles as meta-information about how to manage future edits to particular files — and most agentic CLI agents were originally built for software work. But as [the first essay](01-llms-are-not-the-agents.html) argued, the CLI form factor extends to any work whose product lives in files: research, legal analysis, business operations, consulting work, and beyond.

The native loading is layered. The [Claude Code memory documentation](https://docs.claude.com/en/docs/claude-code/memory) recognizes two locations for project-level instructions — `./CLAUDE.md` and `./.claude/CLAUDE.md` — and both load at session start. The seed agent uses both: a high-level `CLAUDE.md` at the workspace root for identity and operating rules, and a brain index inside `.claude/` cataloging plugins and active jobs. Run `/memory` inside Claude Code and you will see them both listed alongside any user-level CLAUDE.md files. After a `/compact`, Claude re-reads the project-root file from disk and re-injects it. Every other `CLAUDE.md` further down the tree loads on demand: per the docs, *"they are included when Claude reads files in those subdirectories."* 

This is already a powerful primitive to build a complex system, and every Claude Code user gets it for free. What the seed agent does on top is *partition* each `CLAUDE.md` into compartments.

The body of the file — everything above the four anchors below — keeps the standard Claude Code semantics: identity, rules, structure, the things the agent should remember about this directory at all times. Below the body, every `CLAUDE.md` inside the seed agent's brain carries four anchored sections:

```
---Ob---

(observation content goes here)

---Pl---

(plan content goes here)

---Ex---

(execution content goes here)

---Ve---

(verification content goes here)
```

Each footer section corresponds to one phase of the OPEVC cycle. The guard hooks inside each phase plugin enforce a single rule: a phase cannot edit *above* its own anchor. During OBSERVE, the agent can write into `---Ob---` and into any of the three sections below it. During PLAN, into `---Pl---` and below. During EXECUTE, into `---Ex---` and `---Ve---`. During VERIFY, only into `---Ve---`. The body — everything above the first anchor — is off-limits to all four phases. Only the CONDENSE phase is allowed to absorb content upward into the body, and only when closing the cycle.

The asymmetry is intentional. Earlier phases can leave forward-looking notes for later phases — OBSERVE can sketch an early plan or seed a verify checklist if it spots one; PLAN can pre-stage verification criteria for the work it is about to dispatch — but no phase can rewrite what an earlier phase has already committed. Information flows *downward* through the cycle. The full per-phase semantics — what each phase is encouraged to write where, how subagents feed OBSERVE from the knowledge directory, and how all four phases can drop prefixed markers for CONDENSE to consume — is the subject of [Essay 6](06-the-markov-phasic-brain.html). For now, the load-bearing fact is that the footer is a structured, append-forward, multi-author region.

The footers are why the seed agent does not need to rely on the chat to hold its working memory. As a job moves through OBSERVE → PLAN → EXECUTE → VERIFY, each phase writes its experiential output — what was gathered, what was decided, what was built, what was checked — into its own footer slot in whichever `CLAUDE.md` is closest to where the work is happening. The footers *inflate* across the cycle. By the time the job reaches the end of VERIFY, the four sections together can hold thousands of words of fresh, cycle-specific memory.

CONDENSE deflates them. CONDENSE is the cognitive organ that closes each OPEVC cycle — its waterfall pulls durable findings from the four footer sections up into the body of the same `CLAUDE.md` (so they survive the next cycle), routes topic-specific knowledge into `.claude/knowledge/`, and migrates anything that belongs higher up the tree into a parent `CLAUDE.md` or into the root brain. When CONDENSE finishes, the footers are empty again. The next cycle of OPEVC starts with a clean working memory and a slightly enriched body. The hierarchy as a whole grows smarter with each pass.

There is a second consequence of CLAUDE.md edits during a cycle, and it is what gives the bus teeth. EXECUTE — the only phase that may touch project files outside `.claude/` — is fenced to the *altered list*: the set of directories whose `CLAUDE.md` the agent edited during OBSERVE or PLAN. Every `CLAUDE.md` updated while gathering context or drafting a plan adds its directory to the list. EXECUTE inherits the list and may only modify files inside those directories. If a directory's `CLAUDE.md` was never touched during the read-only phases, EXECUTE cannot make project changes there in this cycle, however clearly the work seems to call for them.

The bus is not only where the agent stores experiential notes — it is where the agent *declares* the work it intends to do. Editing a `CLAUDE.md` during OBSERVE or PLAN is a commitment that scopes what EXECUTE will be allowed to attempt. The deeper mechanics — how the altered list is checked, what file types EXECUTE may write inside an altered-list directory, how multi-commit checkpoints land — are the subject of [Essay 6](06-the-markov-phasic-brain.html). For the bus story, the structural fact is enough: `CLAUDE.md` edits gate execution.

This is the bus.

The seed agent doesn't have one `CLAUDE.md`. It has a hierarchy of them.

```
hadosh_academy/
├── CLAUDE.md                              ← root brain
├── .claude/
│   ├── CLAUDE.md                          ← brain index
│   ├── plugins/
│   │   ├── plugin_integrity/CLAUDE.md     ← plugin brain
│   │   ├── brain_guard/CLAUDE.md          ← plugin brain
│   │   └── ...                            ← one per plugin
│   └── knowledge/
│       ├── plugin_integrity/              ← durable, per-topic
│       ├── brain_guard/
│       └── ...
└── hadi-nayebi.github.io/
    └── CLAUDE.md                          ← project working memory
```

Each layer plays a different role on the bus.

The **root CLAUDE.md** declares the agent's identity and operating rules — what phases exist, what the size limits are, how the brain is allowed to grow. It is the top of the bus, and one of the two project-level CLAUDE.md files Claude Code loads at session start.

The **brain index** at `.claude/CLAUDE.md` is the other one. It catalogs the plugins, points to the knowledge directory, and tracks active jobs and recently completed ones.

The **plugin CLAUDE.md files** declare what each plugin owns. They are how a plugin tells the rest of the system "I am responsible for X, here is how I work, here are my tests, here is my current version." When a plugin is being edited, that plugin's CLAUDE.md is the agent's working memory for the edit, and its footer is where the cycle's experiential data accumulates until CONDENSE absorbs it.

The **working-directory CLAUDE.md files** are local. The website project has one. So does the blog folder. So does — when work is happening there — any directory deep in the tree where the focus currently sits. These are the files whose footers most often inflate during the OPEVC cycle and deflate during CONDENSE.

The **knowledge directory** is the durable layer. When something has been learned that is worth keeping past the current cycle, CONDENSE routes it into `.claude/knowledge/<topic>/` as a real Markdown file with its own structure. The current prototype carries thirteen topic silos under `.claude/knowledge/` — one per major plugin (`brain_guard/`, `phase_observe/`, `phase_condense/`, and so on) plus a cross-cutting `opevc/` directory that holds dozens of operational recipes mined from cycles across the system. Each topic dir tends to grow an `INDEX.md` plus a handful of focused topic files, refined cycle after cycle. OBSERVE phases recall from the directory; CONDENSE phases extend it; subagents are dispatched against it for parallel research. Knowledge files are how the agent remembers things across sessions, across cycles, across months.

**Memory files** sit a layer beyond that — cross-session preferences and feedback that should outlive any individual project. This layer is managed by Claude Code itself, not by the seed agent: the CLI maintains them in the user's home directory under `~/.claude/projects/<encoded-path>/memory/`, with a small `MEMORY.md` index loaded on every session start. Each entry is a typed file (`feedback_*.md`, `user_*.md`, `project_*.md`, `reference_*.md`) the agent can grep by category when a session starts cold. The current seed-agent prototype does not extend this layer — it inherits Claude Code's native memory behavior unmodified. A future plugin could hook into it deliberately, using the entries as a source of context injections at session start, but no such plugin exists yet.

Every plugin in the system, in some way, depends on the bus. But not every plugin writes to it.

The **always-on plugins** keep their own state in `data.json` files inside their plugin directories — files the seed agent itself cannot read or edit directly. The agent has no `Read` or `Edit` permission on a plugin's `data.json`; both are blocked at the guard level. Every state mutation goes through a plugin-owned script — typically `<plugin>.sh` in the plugin's `scripts/` directory — which exposes a controlled surface to the rest of the system. Some commands on that surface are public, callable by the agent as part of its workflow (`job.sh focused`, `summary.sh status`). Others carry a `--hook` flag and are restricted to internal callers — other scripts and hooks within the seed — and the agent cannot reach them at all. So when `job_core` tracks the active focused job, when `interaction_summary` accumulates a summary chain, when `brain_guard` records its context-tier history, the agent's only path to that state is the CLI the plugin chose to expose. None of these plugins treat `CLAUDE.md` as their primary write target. What they *read* from the bus is the rules: the size limits declared in the root brain, the registered question prefixes, the operating thresholds for compaction, the phase definitions. They protect the bus's integrity by enforcing those rules. They do not generate its content.

The **phasic plugins** generate the bus's content. As described above, each primary phase writes into its own footer section, and CONDENSE absorbs the four sections, lifts durable findings up the hierarchy, routes content into the knowledge directory, and resets the working memory for the next cycle. That choreography — and the strict per-phase tool restrictions that shape what each phase can produce — is the subject of Essay 6.

The relationship reduces cleanly. The always-on layer protects the bus. The phasic layer fills it and absorbs it. Every plugin, eventually, reads it. In the current prototype, well over a hundred `CLAUDE.md` files across the brain and the project carry the four phase footers — the rest are knowledge indices and archived references that opted out by design. The footer convention is the protocol.

In [Essay 1](01-llms-are-not-the-agents.html), I claimed that *the agent is the filesystem*. This is what that meant, mechanically. The filesystem is not a passive store. It is an active bus, with a hierarchy, with rules about what reads where and what writes where, with phases that inflate and condense it across a cognitive cycle. The always-on layer is what keeps the bus healthy while everything else is happening.

---

## The Historian Ratchet

For the architects in the audience: there is one mechanism inside `plugin_integrity` worth examining in detail, because it captures the discipline of the whole always-on layer.

The setup. Every plugin has a file called `evolution.md`. It is a 2000-word-capped narrative of how the plugin got to its current state — what was added, what was rejected, what was learned during which cycle. It is auto-injected into the agent's context whenever the plugin is unlocked for editing.

The naive version of this would be: "documentation that updates itself when the plugin changes."

The seed agent's version is sharper.

When the agent attempts to unlock a plugin for editing — by issuing a question with the prefix `[PLUGIN-LOCK] <plugin_name>` — `lock-manager.sh` runs a small script called `drift-check.sh` against the target plugin. The check is a single git command: `git rev-list --count LAST_SYNC_COMMIT..HEAD -- <plugin_dir>`, where `LAST_SYNC_COMMIT` is the most recent commit that touched the plugin's `docs/evolution.md`. The result is the *drift count*: the number of commits the plugin has accumulated since its history was last narrated. If that count meets or exceeds a configurable threshold (default five), the unlock is *blocked* with exit 2 and the agent is told to dispatch the plugin's historian subagent first.

The historians live centrally, not per-plugin. Inside `.claude/plugins/plugin_integrity/agents/`, every plugin in the prototype has a corresponding `historian-<plugin>.md` — a dozen of them today, plus a `template/_historian.md` that new plugins clone from when they are born. When dispatched, the historian reads the drift log, synthesizes what changed since the last sync, and edits `docs/evolution.md` under a 2000-word cap enforced by yet another hook (`evolution-cap.sh`, which blocks any Edit or Write that would push the file past `MAX_EVOLUTION_WORDS`). When the cap fires, the block does more than refuse — it coaches the historian to retry with a tighter narrative and to migrate any overflow into sibling files inside `docs/` (per-cycle deep-dives, a decisions log, technical appendices), with `evolution.md` becoming an executive summary that references those siblings rather than absorbing them. The historian's last mandatory step is to commit. That commit touches `evolution.md`, which means it becomes the new `LAST_SYNC_COMMIT`, which means the drift counter resets to zero — and the next set of edits will eventually push it back up, and the cycle repeats.

This is a ratchet. A plugin cannot be edited indefinitely without periodically forcing the historian to re-narrate its evolution. The drift counter ensures it. The block ensures it. The fact that the historian's own work resets the counter — and that without that reset the next `[PLUGIN-LOCK]` deadlocks — ensures it.

The lesson is small: **read the work before changing it**.

The mechanism makes the lesson non-negotiable. The agent is not *suggested* to re-read the plugin's history before editing — a suggestion would be ignored under deadline pressure. The lock blocks. The historian runs. Only then can the work proceed.

The ratchet looks like one mechanism, but it is actually three plugins working together. Walk through what has to be in place for it to fire at all.

The agent must be able to ask a `[PLUGIN-LOCK]` question. That depends on `question_discipline` recognizing the prefix and letting the question through; without that registration, the call is blocked before the user even sees it. The user's answer must then be captured and routed to `lock-manager.sh`. That depends on `job_core`'s split Pre/PostToolUse pair, which validates the question, captures the approval, and hands the result to the lock manager. Finally, the edit must close cleanly under test. That depends on `plugin_integrity`'s own safe-lock cycle, which runs the plugin's test suite when the lock closes and reverts the working tree if the tests fail.

No single plugin enforces the historian ratchet. Three plugins compose to make it possible — `question_discipline` opens the asking surface, `job_core` carries the answer, `plugin_integrity` protects the edit. Each plugin owns its own narrow concern. The ceremony emerges from the way they fit together. The always-on layer is not a stack of independent guardrails sitting in parallel. It is a small, deliberate ring of single-concern guardrails composing into ceremonies none of them could enforce alone.

That's the always-on layer in microcosm. Each plugin a small lesson. Each lesson backed by mechanical enforcement. Hygiene as code.

---

## What Comes Next

The bus is substrate. The CLAUDE.md hierarchy plus the always-on layer plus the durable knowledge directory and many more mechanisms that can be added or customized or extended — together they form the *digital cortex* the seed agent rests on. They keep state, enforce work structure, and discipline conversation, all without doing any of the actual cognitive work.

The actual work happens in the phasic layer. Five phases. One cognitive organ called CONDENSE. Tools forbidden in each phase that force the agent to think before acting.

But a bus is just substrate. What USES it intelligently — that's the phasic brain.

Next.

---

*Essay 5 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Folder Is Alive](03_1-the-folder-is-alive.html) — `.claude/` turns any folder into an agent; cognitive metabolism brings it to life.*
*Next: [The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
