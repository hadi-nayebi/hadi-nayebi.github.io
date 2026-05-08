---
title: "The Single-Concern Digital Cortex"
date: "May 2026"
slug: "the-single-concern-digital-cortex"
read_time: "TBD"
tags: [Architecture, Seed Agent, Plugins, Information Bus]
status: draft
version: v0.15.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/single-concern-digital-cortex.png"
---

# The Single-Concern Digital Cortex

*Essay 5 of 8 in the Hadosh Academy series on agent architecture. Part 2 — the technical arc — opens here.*

---

Now we open `.claude/`.

In [the interlude](03_1-the-folder-is-alive.html), I claimed that any folder in your computer with a `.claude/` becomes a seed agent — the brain in `.claude/`, the work in sibling directories. The inside of that folder is *compartmentalized*: every concern, every form of memory, every behavior lives in its own place with its own files. Compartmentalized information is what lets a seed agent stay consistent as it grows.

Another core principle: the chat is volatile and cannot be the primary home for a seed agent's memory. The memory lives in the compartmentalized brain inside `.claude/` instead. Long before the underlying model would otherwise run out of room in its context window, the seed agent forces a *self-compaction* — the conversation is summarized, most of it discarded, the rest rebuilt from a smaller context. The files inside `.claude/` are unaffected by that compaction; they sit on disk and remain available to the new context as soon as it starts.

Memory of the seed agent lives in several compartments, organized by the form of the memory. The working memory of what the seed agent is currently doing or experiencing lives on a *memory bus* — a hierarchy of plain Markdown files at known locations on disk. Long-term memory that requires active recall lives in `.claude/knowledge/`. Long-term memory with automatic recall lives in files called `voice.xml`. Procedural memory lives as logical code in bash scripts and other code files. Memory that protects the seed agent against code regression over time lives in test files. There are more forms still — we will meet them across these essays.

To manage all of those, the seed agent defines cognitive units called *plugins*: directories where logic, memory, and the various mechanisms organized around a single concern live together. The plugins inside `.claude/plugins/` split into two categories. The always-on plugins are active all the time, shaping how the seed agent operates no matter what it is currently doing. The phasic plugins manage what we will call the *markov brain* — they actively control the seed agent's behavior while it is operating inside a particular phase. We open the markov brain in [Essay 6](06-the-markov-phasic-brain.html). This essay is about the always-on plugins.

---

## Two Categories, One Substrate

The **always-on layer** is active all the time and runs on every prompt, every tool call, every session start, regardless of which job the seed agent is currently working on. This layer owns infrastructure: locking plugins for updates, context budgets, job structure, conversation discipline. The current prototype ships five always-on plugins (`plugin_integrity`, `brain_guard`, `job_core`, `interaction_summary`, `question_discipline`). The category is the load-bearing thing — not the count. A custom seed could add a sixth or a seventh and the architecture wouldn't shift.

The **phasic layer** activates one plugin at a time, dictated by which phase the active job is in. It currently implements a five-phase cognitive cycle called OPEVC — observe, plan, execute, verify, condense — plus an orchestrator (`phasic_system`) that tracks where each job sits in that cycle (can be expanded as new users customize their seed agent and grow it markov brain). Each phase makes a different set of tools available to the seed agent: OBSERVE and PLAN are read-only against project files, EXECUTE writes inside a fenced scope, VERIFY runs scripts only, CONDENSE writes inside `.claude/` only absorbing the recent experiential data from previous phases. We open the phasic layer in [Essay 6](06-the-markov-phasic-brain.html).

Underneath both layers sits the substrate that the previous section listed — the working-memory bus on the CLAUDE.md hierarchy, the knowledge directory, the voice.xml files, the bash scripts, the test files. The two plugin layers play different roles against this substrate. The always-on layer enforces the rules that protect it: locking plugins during edits, watching the context budget, capturing jobs and interactions, gating questions through registered prefixes. The phasic layer fills the working-memory bus during each cycle, then absorbs the durable parts back into longer-term memory at the end.

---

## Why "Single Concern" Matters

Each always-on plugin owns exactly one thing.

`plugin_integrity` owns plugin edit safety. `brain_guard` owns the conversation context budget. `job_core` owns the job lifecycle. `interaction_summary` is responsible for maintaining a dynamic mega-prompt drawn from every user interaction while a job is focused. `question_discipline` owns the asking gate. Each plugin lives in its own folder under `.claude/plugins/<name>/` with its own hooks, scripts, hidden `data.json`, tests, and `voice.xml`. Naming the concern is easy because each plugin only has one to name.

The single-concern principle is a *minimize* rule, not an *eliminate* rule. Pure isolation is what a traditional library aims for — clean modules with no shared state, talking to nothing they don't import. The seed agent is a complex cognitive system, and a small amount of structured coupling between plugins is what lets the parts compose into ceremonies larger than any one plugin. The historian ratchet inside `plugin_integrity` is a clean example. It blocks plugin editing when the plugin's evolution narrative has fallen behind, and to do that it depends on `question_discipline` registering the `[PLUGIN-LOCK]` prefix, on `job_core` capturing the user's approval answer, and on the safe-lock cycle protecting the plugin during the edit. Three plugins compose into one ceremony, each contributing what it owns.

The discipline is in *how* the coupling happens. When plugins talk to each other, they talk through public, stable interfaces — the script CLIs each plugin exposes (`job.sh focused`, `phase.sh current`, `summary.sh status`), the registered-prefix system, the `voice.xml` id handles, the footer marker protocol. A plugin reads from another plugin's published interface; it never opens another plugin's `data.json` directly. Each plugin's internal state stays private; only the interface is shared. If you are confused by all these terms, don't worry — as we learn about every single component of the seed agent's cognition, you will start to connect the dots.

The shape buys three concrete things. Plugins evolve independently — a change inside `interaction_summary` cannot break `job_core` as long as the read-only `job.sh` API stays the same. Plugins are testable in isolation — each `tests/` directory exercises one plugin's behavior without standing up the entire seed. Plugins are addable — a sixth always-on plugin slots into the architecture by exposing its own public commands, not by rewiring anyone else's.

Single-responsibility is one of the oldest disciplines in software. What the seed agent adds, on top of the principle, is a careful description of which couplings are allowed to exist and how those couplings are mediated. Most plugins decoupled. A few composing through narrow public interfaces. None silently entangled.

---

## The Always-On Plugins

Below is the current prototype's always-on layer. What each owns, what would break without it, and the one mechanism inside it worth knowing about.

**`plugin_integrity`** — exists to prevent accidental edits from regressing a plugin's established logic. It does this by leveraging git checkpoints and the plugin's own test suite. The lock applies when a plugin's code files need updating — documentation files inside a plugin (`.md`, `voice.xml`) move under their own rules, with a few caveats.

To begin a code edit, the seed agent asks the user to unlock the target plugin through a structured question. From that moment the plugin's hidden `data.json` carries the state of the edit session — which plugin is currently unlocked, the git checkpoint SHA captured at unlock time. The lock closes the moment one of three things happens: an edit lands outside the unlocked plugin, a different plugin is unlocked, or the agent explicitly calls safe-lock. At that moment the plugin's full test suite runs. Tests pass and the change commits. Tests fail and the working tree rolls back to the captured checkpoint, the plugin's `data.json` records a structured revert entry (timestamp, failed tests, files restored, pre-revert SHA, trigger reason), and a voice line writes to stderr so the operator cannot miss what happened.

The fuller ceremony — the prefix-required unlock question, the user-approval branch, the historian-ratchet check that refuses unlock when the plugin's evolution narrative has fallen behind, and the caveats around documentation-file editing — is deconstructed in [Essay 7](07-the-plugin-kit.html). The role to remember here is the always-on one: every plugin code change passes through a test gate, and a failed gate undoes the change.

**`brain_guard`** — manages **self-compaction** before the conversation reaches the model's default cutoff. It works by watching context usage on every tool call and progressively tightening the agent's grip on tools as the window fills. The whole mechanism fires well before Claude Code's default auto-compact at 100%, and minimizes the need for manual compact by the user, if user is not present at the TUI amking the seed agent more independent.

A `PreToolUse` sensor (`context-sensor.sh`) reads the running token count on every call. At roughly 20% of the window, the plugin injects a coaching voice prompting the agent to draft a structured `/compact` instruction — the design rests on a working assumption that Opus 4.7's effective reasoning begins to soften somewhere around 30% of a 1M-token window, so 20% is the moment to act with headroom still available. If the agent ignores the prompt, at 25% the plugin starts blocking `Read` tool calls. At 30%, it adds `Edit` and `Write` to the block list. The progressive squeeze is deliberate: rather than letting the agent drift toward a hard wall, `brain_guard` removes one tool at a time until the only graceful move left is to compact.

The compaction itself is shape-enforced. The plugin requires the `/compact` instruction to carry five named sections (User Requests, Decisions, Design Choices, Corrections, Current State) before it is accepted; any instruction missing a section gets blocked until the agent rewrites it. The five-section template is not gospel — it is the current shape, and the broader idea is what matters: a compartment that demands a shape forces the agent to *produce* content that fits the shape, and the act of producing that content is itself useful context as it guides the seed agent thinking about its own context compaction. The pattern generalizes — structured git commits, structured plan files, structured subagent dispatches all could use the same trick: the shape compels the production of the very context and guides its thinking and reasoning. Future seed-agent generations may evolve the compaction template, add sub-sections per use case, or define different shapes for different compaction moments.

Mechanically, the `/compact` self-issue is hacky. A script called `self-compact.sh` types the instruction into the active terminal — through `xdotool` plus `xclip` under X11, or through `tmux set-buffer` and bracketed paste under tmux — because Claude Code does not yet expose an API for an agent to compact itself before the 100% limit (the default auto-compact). The script writes a `last_self_compact_at` timestamp into the plugin's hidden `data.json`, and the next firing of the tier guards reads that timestamp to grant a 300-second grace window so the compacted transcript can register before the gate would otherwise re-block. The community has surfaced this gap with Claude Code; if and when a native intermittent self-compact API ships, this plugin's terminal-typing layer retires and the rest of the discipline (the tier sensor, the shape-enforced instruction, the post-compact grace window) carries forward unchanged.

Without `brain_guard`, the agent runs the conversation off a cliff. The default 100% auto-compact fires eventually, but without the agent's own plan for what to preserve — and the next session starts from whatever the model happened to have in the window at that moment.

**`job_core`** — owns the job lifecycle. A `UserPromptSubmit` hook (`prompt-handler.sh`) intercepts every user prompt and either creates a new active job or appends the prompt as an interaction on the currently focused one. A `Stop` hook (`stop-gate.sh`) refuses to let the agent end its turn whenever any active or pending job remains, and the refusal message is phase-aware — observation phases get reminders to check CLAUDE.md before synthesizing, execution phases get reminders to keep edits inside the altered-list, and so on. Completion is a *two-stage* gate. A `PreToolUse:AskUserQuestion` hook (`question-capture.sh`) validates that any `[JOB-COMPLETE]` question contains the focused job's name, runs at least a hundred words of review, and presents *exactly* the "Review" and "Approve completion" options. After the user picks Approve, a separate `PostToolUse` hook (`question-capture-hook.sh`) walks the focused job's `depends_on` array, refuses approval if any parent job is still unfinished, and only then flips `user_approval=true`. The two-hook split is itself a workaround: registering the same script for both Pre- and PostToolUse:AskUserQuestion silently kills the post handler in Claude Code, so the validation half and the approval half had to be carved into separate files. Without `job_core`, the agent has no notion of "what work am I doing" — every prompt is a one-off, and there is no thread of intent to come back to.

**`interaction_summary`** — owns the budget *inside* a job. Enforcement runs in two phases. A `PostToolUse:AskUserQuestion` hook (`token-counter.sh`) fires right after `job_core` records each interaction, multiplies the unsummarized word count by 1.3 to approximate tokens, and trips a `summary_needed` flag when the result crosses a threshold (default 500). On the next tool call, a `PreToolUse` guard (`summary-guard.sh`) blocks `Edit`, `Write`, `MultiEdit`, `Read`, `Bash`, and `AskUserQuestion` until a structured summary lands. The submit command — `summary.sh submit <id> "<text>"` — won't accept just any text: the summary has to be between 200 and 1000 tokens and contain five named sections (User Requests, Questions & Decisions, Design Choices, Corrections & Feedback, Current State), each at least fifty tokens long. The block has one deliberate escape hatch — infrastructure-prefixed questions like `[PLUGIN-LOCK]` and `[JOB-COMPLETE]` are still allowed, so the agent cannot get into a deadlock where it needs to ask for permission to do the very thing the guard is asking for. The summary chain is append-only and lives entirely in the plugin's own `data.json`; older entries cannot be rewritten. The mirror object is created lazily — short jobs that never cross the threshold never appear in `interaction_summary` at all. Without this plugin, long jobs lose narrative coherence as the interaction list bloats; the summary chain is what keeps a job legible at a glance and what survives forward when the job spans more than one OPEVC cycle.

**`question_discipline`** — owns the asking gate. A single `PreToolUse:AskUserQuestion` hook (`question-discipline-gate.sh`) walks every question in the call and matches its first token, case-sensitive and anchored to position zero, against a `readonly PREFIX_REGISTRY` bash array hardcoded in the script. The registry currently holds seven entries — `[PLUGIN-LOCK]`, `[TEST-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, `[PLAN-COMPLETE]`, `[POINT-BOOST]`, `[WAITING]` — and they cascade: when the agent batches multiple questions in one call, *every* question must carry a registered prefix, or the entire batch is rejected and the agent has to rewrite. The plugin owns no `data.json`; the registry is its only state and it cannot be mutated at runtime. The plugin is also a deliberate design statement about when to skip the soft layer entirely. The plugin's own CLAUDE.md puts it bluntly: *trivial detectable rules go straight to hard control. Soft + voice channels are reserved for COMPLEX semantic guidance.* A missing prefix is mechanically detectable with no judgment-call edge cases, so there is no coaching voice and no measurement period — the gate is hard from cycle one. The lone runtime exception is dispatched subagents, which set `CLAUDE_SUBAGENT=true` and bypass the gate so they can ask their own internal questions without the user-facing prefix overhead. Without `question_discipline`, the agent spirals into "should I continue?" / "is this what you want?" prompts that create cognitive drag without advancing the work — and worse, asks structured ceremonial questions (locks, approvals) without the prefix scaffolding the rest of the system depends on.

Five concerns, in this prototype. Five separate folders under `.claude/plugins/`. None of them call each other. They communicate, when they need to, through the bus.

That's the next section.

---

## The CLAUDE.md Hierarchy as Information Bus

Pick any directory on the machine and ask what it remembers.

The answer is: nothing. The directory is a list of files. The files have content but no awareness of each other. There is no place where the directory can write down "here is what is being worked on" or "here is what was learned last time."

Now drop a `CLAUDE.md` in there. Suddenly the directory has a place to remember.

This is not a metaphor. CLAUDE.md is a real Markdown file that the seed agent reads at session start, reads again during work, and writes to during work. The agent doesn't remember things in the chat. It writes them down in CLAUDE.md, and the CLAUDE.md gets read back later — sometimes minutes later, sometimes sessions later.

The seed agent doesn't have one CLAUDE.md. It has a hierarchy of them.

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

Each CLAUDE.md serves a different purpose.

The **root CLAUDE.md** declares the agent's identity and operating rules — what phases exist, what the size limits are, how the brain is allowed to grow. It's the top of the bus. Every session starts by reading it.

The **plugin CLAUDE.md files** declare what each plugin owns. They're how a plugin tells the rest of the system "I am responsible for X, here's how I work, here are my tests, here's my current version." When a plugin is being edited, that plugin's CLAUDE.md is the agent's working memory for the edit.

The **working-directory CLAUDE.md files** are local. The website project has one. So does the blog folder. So does — when work is happening there — any directory deep in the tree where the focus currently sits. These hold the *current* context: what's in flight, what got noticed, what got decided. They inflate during a cycle as the agent gathers and edits, then deflate at the end of the cycle when the CONDENSE phase pulls durable findings up to the brain or out to the knowledge directory. (Phases — and exactly how they inflate and deflate this layer — are the subject of [Essay 6](06-the-markov-phasic-brain.html).)

The **knowledge directory** is the durable layer. When something has been learned that's worth keeping past the current cycle, it gets routed to `.claude/knowledge/<topic>/` as a real Markdown file with its own structure. The current prototype carries thirteen topic silos under `.claude/knowledge/` — one per major plugin (`brain_guard/`, `phase_observe/`, `phase_condense/`, and so on) plus a cross-cutting `opevc/` directory that holds dozens of operational recipes mined from cycles across the system. Each topic dir tends to grow an `INDEX.md` plus a handful of focused topic files, refined cycle after cycle. OBSERVE phases recall from the directory; CONDENSE phases extend it; subagents are dispatched against it for parallel research. Knowledge files are how the agent remembers things across sessions, across cycles, across months.

**Memory files** are a layer beyond that — cross-session preferences and feedback that should outlive any individual project. They live outside the project, in the agent's home directory under `~/.claude/projects/<encoded-path>/memory/`, indexed by a small `MEMORY.md` file the agent loads on every session start. Each memory entry is its own file, named by type (`feedback_*.md`, `user_*.md`, `project_*.md`, `reference_*.md`) so the agent can grep into them by category when a session starts cold.

This is the bus.

It's not a database. It's not a vector store. It's a hierarchy of plain Markdown files at known locations. Every plugin, in some way, depends on it. But not every plugin writes to it.

This is the part that's easy to get wrong, and worth being precise about.

The **always-on plugins** keep their own state in hidden data files (`data.json` per plugin) inside their plugin directories. `job_core` tracks the active focused job there. `interaction_summary` keeps its summary chain there. `brain_guard` reads its context-tier configuration from its own files. None of them treat CLAUDE.md as their primary write target. What they read from the bus is the rules: the size limits declared in the root brain, the registered question prefixes, the operating thresholds for compaction, the phase definitions. They protect the bus's integrity by enforcing those rules. They do not generate its content.

The **phasic plugins** are the ones that fill the bus. Each phase plugin writes into a designated section of the active CLAUDE.md — the OBSERVE phase appends what was gathered, the PLAN phase appends decisions, the EXECUTE phase appends notes worth remembering, the VERIFY phase appends pass/fail results. The CONDENSE phase then absorbs those sections, lifts durable findings up the hierarchy, routes content into the knowledge directory, and resets the working memory for the next cycle. That choreography is the subject of Essay 6.

The relationship reduces cleanly: the always-on layer protects the bus, the phasic layer writes into it, and every plugin in the system, eventually, reads it. In the current prototype, well over a hundred of the active CLAUDE.md files across the brain and the project carry the four phase footers — the rest are knowledge indices and archived references that opted out by design. The footer convention is the protocol.

The thing the bus enforces, by simply existing, is that the agent cannot rely on the chat to hold its state. The chat is too short, and `brain_guard` will compact it long before it would otherwise overflow. The bus is the chat's backup, its index, and its replacement when the conversation has to be rebuilt.

In [Essay 1](01-llms-are-not-the-agents.html), I claimed that *the agent is the filesystem*. This is what that meant, mechanically. The filesystem is not a passive store. It's an active bus, with a hierarchy, with rules about what reads where and what writes where, with phases that inflate and condense it across a cognitive cycle. The always-on layer is what keeps the bus healthy while everything else is happening.

---

## The Historian Ratchet

For the architects in the audience: there is one mechanism inside `plugin_integrity` worth examining in detail, because it captures the discipline of the whole always-on layer.

The setup. Every plugin has a file called `evolution.md`. It is a 2000-word-capped narrative of how the plugin got to its current state — what was added, what was rejected, what was learned during which cycle. It is auto-injected into the agent's context whenever the plugin is unlocked for editing.

The naive version of this would be: "documentation that updates itself when the plugin changes."

The seed agent's version is sharper.

When the agent attempts to unlock a plugin for editing — by issuing a question with the prefix `[PLUGIN-LOCK] <plugin_name>` — `lock-manager.sh` runs a small script called `drift-check.sh` against the target plugin. The check is a single git command: `git rev-list --count LAST_SYNC_COMMIT..HEAD -- <plugin_dir>`, where `LAST_SYNC_COMMIT` is the most recent commit that touched the plugin's `docs/evolution.md`. The result is the *drift count*: the number of commits the plugin has accumulated since its history was last narrated. If that count meets or exceeds a configurable threshold (default five), the unlock is *blocked* with exit 2 and the agent is told to dispatch the plugin's historian subagent first.

The historians live centrally, not per-plugin. Inside `.claude/plugins/plugin_integrity/agents/`, every plugin in the prototype has a corresponding `historian-<plugin>.md` — a dozen of them today, plus a `template/_historian.md` that new plugins clone from when they are born. When dispatched, the historian reads the drift log, synthesizes what changed since the last sync, and edits `docs/evolution.md` under a 2000-word cap enforced by yet another hook (`evolution-cap.sh`, which blocks any Edit or Write that would push the file past `MAX_EVOLUTION_WORDS`). The historian's last mandatory step is to commit. That commit touches `evolution.md`, which means it becomes the new `LAST_SYNC_COMMIT`, which means the drift counter resets to zero — and the next set of edits will eventually push it back up, and the cycle repeats.

This is a ratchet. A plugin cannot be edited indefinitely without periodically forcing the historian to re-narrate its evolution. The drift counter ensures it. The block ensures it. The fact that the historian's own work resets the counter — and that without that reset the next `[PLUGIN-LOCK]` deadlocks — ensures it.

The lesson is small: **read the work before changing it**.

The mechanism makes the lesson non-negotiable. The agent is not *suggested* to re-read the plugin's history before editing — a suggestion would be ignored under deadline pressure. The lock blocks. The historian runs. Only then can the work proceed.

Notice what the ratchet quietly depends on. The `[PLUGIN-LOCK]` question is only askable because `question_discipline` registers the prefix in its `PREFIX_REGISTRY` and blocks the call otherwise. The user's approval is only catchable because `job_core`'s split Pre/PostToolUse pair captures the answer and enforces the option-format that `lock-manager.sh` then reads. The plugin survives the edit only because `safe-lock.sh` runs the test suite at lock-close time and reverts to a captured `checkpoint_ref` if the suite fails. Each plugin owns one concern, but the concerns compose. The always-on layer is not five independent guardrails. It is five guardrails in a small, deliberate ring, holding the bus while everything else does the work.

That's the always-on layer in microcosm. Each plugin a small lesson. Each lesson backed by mechanical enforcement. Hygiene as code.

---

## What Comes Next

The bus is substrate. The CLAUDE.md hierarchy plus the always-on layer plus the durable knowledge directory — together they form the *digital cortex* this essay is named after. They keep state, enforce work structure, and discipline conversation, all without doing any of the actual cognitive work.

The actual work happens in the phasic layer. Five phases. One cognitive organ called CONDENSE. Tools forbidden in each phase that force the agent to think before acting.

But a bus is just substrate. What USES it intelligently — that's the phasic brain.

Next.

---

*Essay 5 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Folder Is Alive](03_1-the-folder-is-alive.html) — `.claude/` turns any folder into an agent; cognitive metabolism brings it to life.*
*Next: [The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
