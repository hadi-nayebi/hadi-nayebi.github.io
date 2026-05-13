---
title: "The Plugin Kit"
date: "May 2026"
slug: "the-plugin-kit"
read_time: "TBD"
tags: [Architecture, Seed Agent, Plugins, Hooks, Voices, Subagents]
status: draft
version: v0.13.1
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/plugin-kit.png"
---

# The Plugin Kit

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

---

A plugin is a cell.

The metaphor isn't decorative. The cell is what the previous two essays have been pointing at. [Essay 5](05-the-always-on-digital-cortex.html) made the case that the always-on layer is several small organisms, each owning one concern, each communicating through the bus. [Essay 6](06-the-markov-phasic-brain.html) made the case that the phasic layer is more of the same — each phase is its own plugin, and even the orchestrator is one. Everything that runs inside the seed agent runs as a plugin.

Which means the plugin is the *unit* of the brain.

This essay opens that unit. It takes a plugin apart, names every cognitive organ inside it, and shows the discipline that lets the brain create new ones safely. It is the densest essay in the series, because the kit is what makes everything else possible.

The vocabulary from [Essay 4](04-the-language-of-agents.html) — hooks, voices, agents — gets its mechanical meaning here. The single-concern principle from [Essay 5](05-the-always-on-digital-cortex.html) gets its anatomy. The phases from [Essay 6](06-the-markov-phasic-brain.html) reveal themselves as instances of the same template.

---

## Plugin = Cell with Cognitive Organs

A plugin is a directory.

It lives at `.claude/plugins/<plugin_name>/`, and every plugin in the seed has the same set of files in the same places — the standard layout is born from a shared template at `.claude/plugins/plugin_integrity/template/` and enforced by `plugin_integrity` itself. A plugin missing the standard cognitive organs cannot be activated.

Here is the standard kit:

```
.claude/plugins/<plugin_name>/
├── CLAUDE.md                 ← the plugin's brain
├── hooks/
│   └── *.sh                  ← reflexes — fired by Claude Code events
├── scripts/
│   └── *.sh                  ← internal tools the plugin uses on itself
├── tests/
│   └── test-*.sh             ← the plugin's self-test suite
├── agents/
│   └── *.md                  ← subagent definitions owned by the plugin
├── voice.xml                 ← coaching strings (sometimes two of these)
├── evolution.md              ← 2000-word narrative of the plugin's history
├── data.json                 ← hidden runtime state (gitignored)
└── settings.local.json       ← hook registrations
```

Each file plays a distinct role. None of them is optional in a mature plugin.

**`CLAUDE.md`** is the plugin's working memory and self-description. It declares what the plugin owns, what its hooks do, what its size limits are, what its current version is. This is what the agent reads when it wants to understand the plugin from the inside.

**`hooks/`** holds the reflexes — small shell scripts that fire on Claude Code events: `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`. Hooks are how the plugin reaches out and touches the cognitive process from the outside. They are pure shell, with no shared runtime, executing in milliseconds.

**`scripts/`** holds the plugin's internal tooling — the CLI commands the plugin issues against itself. `phase.sh advance`, `observe.sh set-multiplier`, `drift-check.sh`, `safe-lock.sh`. Scripts are how the plugin lets the agent (or another plugin) talk to it through a stable interface.

**`tests/`** holds the self-tests. Every plugin has its own test suite covering its hooks, scripts, and any edge cases it has learned to handle. Tests are why the plugin can be edited safely — every commit runs them, and a failing run reverts the commit.

**`agents/`** holds subagent definitions specific to this plugin: `historian-*` agents for evolution narration, `verify-*` auditors for verification phase, `condense-*` routers for the waterfall, `observe-*` researchers for context gathering. Each is a Markdown file declaring tools, prompt, and dispatch rules.

**`voice.xml`** holds coaching voices and structured blocks. Many plugins have two of these — one for hooks-context strings and one for scripts-context strings. We come back to dual voices below.

**`evolution.md`** is the historian-narrated story of how the plugin got to its current state, capped at 2000 words. Auto-injected when the plugin is unlocked for editing.

**`data.json`** is the plugin's private runtime state — gitignored (along with its `.tmp` and `.lock` siblings), lives only on the operator's machine. The active focused job, the tier counter, the summary chain, the lock manifest. Concurrent access is guarded by `flock` on a per-plugin lockfile under `/tmp/`, and every write follows the same atomic discipline: read under lock, transform with `jq` into a temp file, validate the temp with `jq empty`, then `mv` over the live file. The reader never sees a partial state. Most plugins commit to a fixed schema once and never revisit it. `brain_guard` is the exception: its `data.json` carries a `schema_version` field, and the plugin's gateway script ships with idempotent `_ensure_*_field` helpers that quietly add new fields when the schema bumps. Corruption is handled fail-safe rather than fail-open or fail-closed — if `data.json` parses as invalid JSON, the gateway rebuilds it from defaults rather than blocking the agent. This is where the always-on plugins keep their state, and one of the structural reasons they don't write to CLAUDE.md as a primary store.

**`settings.local.json`** is the wiring file. It is a small JSON document that pairs Claude Code event names with hook script paths — `{"PreToolUse": [{"hooks": [{"command": ".claude/plugins/<plugin>/hooks/<name>.sh"}]}]}` — and Claude Code reads it on session start to decide which hooks fire on which events. Without registration here, even a perfectly written hook is dead code.

The kit is a *cell wall*. Outside the wall, the plugin's only contact with the world is through hook events, scripts, and the bus. Inside the wall, the plugin owns its own cognitive organs. This is why the always-on plugins from Essay 5 don't share state — the wall doesn't let them. This is why the phasic plugins from Essay 6 can be added or removed without rippling through the rest of the brain — the wall isolates them.

A plugin is the smallest unit of brain that the architecture lets you reason about as a whole.

---

## The Lock Ceremony

Plugin code does not get edited the way ordinary files do. Each plugin's hooks, scripts, and tests have earned their current shape — the test suite enshrines that shape — and any change has to pay the cost of opening the plugin, editing inside it, and re-passing the tests before the change commits. The ceremony has four parts: a `PLUGIN-LOCK` question that opens the edit session, a separate `TEST-LOCK` question for editing the test files themselves, the safe-lock close-out that re-runs tests at the lock boundary, and the historian ratchet that can refuse to open the lock at all if the plugin's evolution narrative has fallen behind.

**`PLUGIN-LOCK`** opens the session. The agent issues a structured question prefixed `[PLUGIN-LOCK] <plugin_name>`. A `PostToolUse:AskUserQuestion` hook (`lock-manager.sh`) watches for that prefix and the user's answer. When the user approves, `lock-manager.sh` runs `git rev-parse HEAD`, captures the resulting SHA as a `checkpoint_ref`, and writes both the SHA and the plugin name (`unlocked_plugin`) into `plugin_integrity`'s hidden `data.json`. A separate `PreToolUse:Edit|Write|MultiEdit` guard (`plugin-guard.sh`) consults `data.json` on every tool call: edits inside the unlocked plugin proceed; edits anywhere else under `.claude/plugins/` are rejected. Only one plugin is editable at a time.

The constraint exists because plugin edits cascade. Touching two plugins in the same cognitive breath — fixing a hook in one, adjusting a script in another — almost always means the operator is missing the connection between them. Serialization forces the connection to surface. Edit one plugin completely, commit it, hand back the lock, and only then unlock another. The `[PLUGIN-LOCK]` question is itself one of the prefixes the always-on `question_discipline` plugin enforces; the system will not let the agent ask the question without the right prefix, and will not let the agent edit a plugin without the right answer. Three always-on plugins compose into the lock ceremony — `question_discipline` gates the asking side, `job_core` captures the user's answer into the focused job's interaction list, and `plugin_integrity` reads that answer to decide whether to open the lock. Each contributes what it owns; none reaches into another's `data.json`.

**`TEST-LOCK`** is finer-grained, and necessary because tests are part of the plugin too. By default, the unlocked plugin's `tests/` directory is *also* frozen — even while the plugin itself is unlocked. To edit an individual `test-*.sh` file, the agent has to issue a separate `[TEST-LOCK]` question naming the specific test. The reason is the same one that makes test-driven development hard: it is too easy to "fix" a test that is correctly failing. Test edits demand explicit, named permission, distinct from the plugin edit, and `data.json` carries the unlocked test name in its own field (`unlocked_test`) until the test edit closes.

**Safe-lock close-out** runs the test suite at the lock boundary. There are two ways the close-out fires. The clean way is `lock-cmd.sh`: the agent invokes it explicitly when the edits are done; the script runs the full plugin test suite; on pass it commits the change and clears `unlocked_plugin` from `data.json`; on failure it stops and leaves the working tree intact so the agent can fix the test and retry. The defensive way is automatic: if `plugin-guard.sh` notices the agent attempting to edit outside the unlocked plugin (or another `[PLUGIN-LOCK]` is approved before the current one closed), `safe-lock.sh` triggers the test run anyway, and on failure rolls the working tree back to the captured `checkpoint_ref`. Each defensive revert appends a structured entry to a 20-deep FIFO revert log inside `data.json` — timestamp, list of failed tests, list of files restored, pre-revert SHA, trigger reason — and emits an `auto-revert-fired` voice line to stderr so the operator cannot miss what happened. Either path, the agent does not get to ship a plugin change that breaks the plugin's own self-test. There is no override.

**The historian ratchet** can refuse to open the lock at all. Each plugin keeps a 2000-word-capped narrative at `docs/evolution.md`, and a small script called `drift-check.sh` counts how many commits have landed against the plugin since `evolution.md` was last touched. If that drift count exceeds a threshold, `lock-manager.sh` rejects the `[PLUGIN-LOCK]` approval and tells the agent to dispatch the plugin's historian subagent first. The historian re-narrates the cycles since the last sync, commits the refreshed `evolution.md`, and the drift counter resets. Only then does the lock open. A plugin cannot be edited indefinitely without periodically forcing its own history to be re-told.

What about the documentation files inside a plugin? The `[PLUGIN-LOCK]` mechanism applies to *code* — hooks, scripts, tests. Documentation files (`CLAUDE.md`, `voice.xml`, `docs/evolution.md`) move under their own rules. `evolution.md` is hard-capped at 2000 words by `evolution-cap.sh`, which blocks any edit that would push the file past the cap; overflow content has to migrate into a sibling like `docs/decisions.md`. `voice.xml` text bodies are editable freely, but the voice id attribute is treated as immutable — CONDENSE step 4 only edits the text body, never the id, because every hook in the codebase references voices by id. `CLAUDE.md` files have section markers (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) that a section-boundary guard enforces with a single rule: a phase cannot edit *above* its own anchor. So a later phase can never rewrite what an earlier phase wrote into the bus, while an earlier phase can leave forward-looking notes in any section below its anchor for later phases to find. None of these doc-edit rules are exemptions from discipline; they are different shapes of it.

The four parts together — lock, test-lock, safe-lock, ratchet — form a closed loop where the only way to evolve a plugin is to have already understood it. The discipline applies recursively: `plugin_integrity` itself follows the same ceremony when its own hooks are edited. The plugin that polices every other plugin polices itself by the same gate. There is no privileged path.

---

## Markers as Inter-Phase Protocol

Phases write into the bus. The previous essay covered the four footer markers — `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` — that designate which phase wrote which content into a CLAUDE.md.

There is a second class of markers, finer-grained, that ride inside those footer sections. They are the *protocol* the phases use to talk to each other across cycles.

There are five inline markers in the current prototype:

- `[PENDING-JOB]` — flags that follow-up work needs a separate job. Read by CONDENSE step three.
- `[VOICE-UPDATE] voice_id | why | direction` — flags that a coaching voice should be edited. Read by CONDENSE step four.
- `[AGENT-UPDATE] agent_name | why | direction` — flags that a subagent definition should be tightened. Read by CONDENSE step five.
- `[KNOWLEDGE] topic-slug` — flags that a paragraph should be promoted to long-term memory under that topic slug. Read by CONDENSE step six.
- `[DURABLE]` / `[EPHEMERAL]` — tags that bias step one (footer-to-body absorption) toward keeping or dropping a finding.

Each marker is plain text inside a Markdown file. There are no hidden fields, no databases, no metadata layers. The marker *is* the data structure. The plugins read it with `grep`. They dispatch on it with shell. They remove it after consumption — and "remove" is itself disciplined: a consumed marker is replaced with a strikethrough audit line of the form `` ~~`[VOICE-UPDATE] voice_id | why | direction` CONSUMED 2026-05-04 Step 4~~ ``, so the next cycle's grep doesn't re-fire on it but the operator can still see what was processed when. The pipe-delimited three-field syntax — `id | why | direction` — repeats across `[VOICE-UPDATE]` and `[AGENT-UPDATE]` for a reason: the same `cut -d'|'` pattern parses both, and the same dispatcher shape handles both, which is what lets a sixth marker be added by writing one new grep instead of redesigning the protocol.

This design has three properties worth naming.

**It's code-addressable.** Any tool that can read text can read the markers. Any tool that can write text can produce them. The protocol is in the open, in the same files the human operator reads.

**It's grep-dispatched.** No phase has to register handlers, subscribe to events, or import schemas. Each CONDENSE step runs its own grep, picks up its own markers, processes them, and removes them. The dispatch is `O(markers)` per step, and it composes trivially with new markers — adding a sixth marker just adds another grep.

**It's self-cleaning.** A marker is removed by the step that consumes it. The next cycle starts with clean footers. The system never accumulates stale routing instructions. If a marker is ever found that no step recognizes, it's a bug visible at a glance.

The phases write markers. CONDENSE consumes markers. Between them, the bus carries instructions across what would otherwise be a temporal gap — the OBSERVE phase that wrote `[KNOWLEDGE] some-topic` is long gone by the time CONDENSE step six picks it up, but the marker bridges them. The instruction outlives the instructor.

This is what the markers as inter-phase protocol means. The phases don't have to remember each other. The bus does.

---

## Dual Voice — Soft and Hard

A plugin's `voice.xml` holds *strings*. The strings are how the plugin speaks to the agent, and the strings come in two flavors that look similar but do very different things.

The first flavor is **coaching**. A coaching voice is a short paragraph the plugin injects into the agent's context at a specific moment — entering a phase, crossing a context tier, having just dispatched a subagent. Coaching strings are written to be read by a language model, not by a parser. They are probabilistic. They nudge. They suggest. The agent reads them, internalizes them, and behaves accordingly — most of the time.

The second flavor is **structured blocks**. A block is also a string, but it is delivered as a hard refusal. When a guard fires — a write tool aimed at a path outside the phase's scope, an `AskUserQuestion` without a registered prefix, a `/compact` instruction missing one of `brain_guard`'s required sections — the plugin returns a non-zero exit code with the block string as the explanation. The agent's tool call fails. The block is not a suggestion; it is a denial.

A particular flavor of block is worth naming separately: *shape-enforcement*. When `brain_guard` rejects a malformed `/compact`, when `phase_observe` rejects a CLAUDE.md edit that targets the body, when `question_discipline` rejects a question without a registered prefix — the block is not just refusing a bad action. It is *forcing* the agent to produce a correctly-shaped artifact instead. The act of fitting the artifact to the required shape generates content the conversation needed anyway: a structured compaction summary, a properly-routed observation, a parseable question prefix. The shape is a forcing function for context quality, not just a guard. The pattern recurs across the kit — markers, plan files, voice ids, footer sections all rely on it — and it is one of the reasons `voice.xml` carries blocks in the first place.

Many plugins have *both* kinds of strings, in the same `voice.xml`, organized by id. The two flavors are distinguished structurally — the XML element tag itself encodes the semantic. `<block id="...">` is delivered as a stderr refusal with exit 2; `<coaching id="...">` is injected into the LLM's context as a soft nudge; `<entry>`, `<info>`, `<error>`, and `<warning>` carve out the rest of the surface area. Hooks call a shared `get_voice` helper at `.claude/plugins/lib/voice-helper/voice-helper.sh`, which extracts the text body for a given id and substitutes `{{var}}` template placeholders the caller passes in. The helper is engineered to fail soft: if `voice.xml` is unreachable (e.g., a test sandbox without it), `get_voice` becomes a no-op returning empty string, and the calling hook uses an inline fallback like `echo "${msg:-[plugin_name] BLOCKED: ...}"` so the block still lands in plain English. Many plugins also keep *two* `voice.xml` files — one in `hooks/` for strings that get injected into the LLM's context window from `PreToolUse` blocks, one in `scripts/` for strings that get printed to the operator's terminal as part of CLI output. The wording is often slightly different between the two. Same intent, different audience. The orphan-id audit scripts have to grep *both* files when checking that every `get_voice "id"` call in code corresponds to a real entry — auditing only `hooks/voice.xml` will false-positive every script-only id as missing.

The dual structure matters because the plugin is teaching the agent in two different modes at once.

Coaching is the *soft* layer. It is how the plugin shapes behavior probabilistically — by being present in context at the right moment. Coaching can be ignored. The agent might choose to ignore it. The plugin learns from that. Over many cycles, if the coaching is consistently ignored on a particular pattern, that pattern becomes a candidate for promotion to a hard block.

Blocks are the *hard* layer. They are how the plugin enforces deterministically. Blocks can't be ignored — they're refusals. But blocks are also expensive: every block adds friction to the agent's work, and a brain made entirely of blocks would be unusable. The art is to keep coaching where coaching is enough, and to escalate to blocks only when the data shows coaching has failed.

This soft-to-hard migration is the *brain maturation pattern*. New behavioral controls start as voice. The operator runs cycles. If the voice consistently fires and the behavior consistently still drifts — observed across multiple cycles, not just one bad day — the operator decides the soft control is insufficient and authors a hook. The architecture documents this restraint as Lock 13, the *over-engineering veto*: a new hard gate cannot land before measured cycles demonstrate the soft form is failing. In practice, the measurement is informal: the operator reads the cycle's interaction summaries, sees the same mistake recurring, and concludes. The prototype's clearest example is the multiplier sentinel itself — for the first six cycles of the system it lived as a coaching voice asking the agent to please set a value, the agent kept missing it under load, and v0.12 hardened the soft voice into a `multiplier-zero-block` that locks every tool at phase entry until `set-multiplier` runs. The voice retired into a paired pre-set/post-set entry pair. Once a hook holds for long enough across enough plugins, the *pattern* itself fossilizes — into the plugin template, into the kit, into the standard files every new plugin inherits. The brain doesn't really shrink in absolute words; what happens is more interesting. The plugin CLAUDE.md files compress as their lessons become hooks, the root brain stays stable, and the knowledge directory grows monotonically because every fossilized pattern leaves behind its own narrated record of how it got there.

[Essay 8](08-from-apprentice-to-architect.html) returns to this maturation arc as the spine of how a seed grows. Here, what matters is that *every plugin* has both layers at its disposal, and the plugin author's job is to choose the right layer for each lesson.

---

## Subagents — Why 80/20

A subagent is, mechanically, just an instance of the same model running with a different system prompt and a curated set of tools. The seed agent uses subagents heavily — a typical OBSERVE phase will fan out two to four research subagents in parallel, EXECUTE phases dispatch implementer subagents for parallel file work, VERIFY phases dispatch auditor subagents for independent checking, CONDENSE phases dispatch routers for waterfall steps.

The architecture insists on a roughly 80/20 split. The main session orchestrates — picks the questions, fans out the work, integrates the results. Roughly 20% of the cognitive work happens in the main session. The remaining 80% happens in subagents.

This is not a performance optimization. It is a *context discipline* — and EXECUTE actually mechanizes it. Inside `phase_execute`, every launch of an execute-* subagent grants the main session three units of *direct-action budget*; every non-`.claude/` file edit the main session performs consumes one. Internal `.claude/` edits are exempt because they are bookkeeping, not building. The arithmetic creates a structural pull: if the main session wants to write project code, it has to first delegate enough subagent work to afford the writes. The 80/20 isn't a guideline. It's a budget.

Every tool call the main session makes lands in the main session's context window. A 30-tool-call investigation, run in the main session, fills the window with raw search results, file reads, and intermediate outputs. By the time the investigation is done, the context is too full to plan well.

Run that same investigation as a subagent dispatch, and the subagent's tool calls land in the *subagent's* context window. The subagent does its work, synthesizes its findings, and returns a structured paragraph or two. The main session's context absorbs only the synthesis, not the raw work. The window stays clean. The plan that follows is built on a working memory that didn't have to swallow the investigation's exhaust.

Subagents are how the seed agent stays cognitively coherent across long jobs.

Each plugin owns its own subagents inside `agents/`. The historians, the auditors, the routers, the researchers — they are not a global pool. The current prototype carries roughly fifty subagent definitions across the seed: a dozen `historian-*` agents under `plugin_integrity` (one per other plugin), a dozen `observe-*` researchers, six `plan-*` helpers, three `execute-*` implementers, five `verify-*` auditors, seven `condense-*` waterfall routers, and a handful of specialized agents for archiving and unblocking. Each one is a Markdown file with frontmatter declaring its name, a curated tool list, and a model assignment — and every one of them runs on the smallest available fast model so dispatch stays cheap.

The reason for plugin-scoped subagents is the same reason for plugin-scoped tests: locality of reasoning. A subagent's prompt and tool list should evolve with the plugin that uses it. There's also a hard mechanical reason: the safe-lock cycle requires that only one plugin be unlocked at a time, so a subagent that ranges across multiple plugins would need to coordinate locks across every directory it touches. An early prototype cycle proved this the painful way — a multi-plugin batch broke a test in one plugin, the auto-revert undid work in another, and the operator spent the next session reconstructing what had been lost. Per-plugin scoping is the lesson written into the kit.

---

## Tier-3 Close: Building a New Phase Plugin

For the architects in the audience, here is what creating a new phase plugin actually looks like. Imagine you decide your seed needs a `RESEARCH` phase between `OBSERVE` and `PLAN` — a phase whose job is to do deeper external investigation when a job's working memory has gaps that internal observation cannot fill.

The recipe is straightforward, because the kit makes it straightforward.

You ask `[PLUGIN-LOCK] phase_research`. The user approves the lock. `lock-manager.sh` notices that no `phase_research/` directory exists yet, copies the template at `.claude/plugins/plugin_integrity/template/` into place, substitutes the plugin name into the placeholders, generates a `historian-phase-research.md` from `template/_historian.md` so the plugin already has its narrator, auto-commits the birth so drift-check has a baseline, and only then writes the unlock state. The plugin is born.

You now have the empty kit — a `CLAUDE.md`, `hooks/`, `scripts/`, `tests/`, `agents/`, `voice.xml`, `evolution.md`, `data.json`, `settings.local.json`. The cell wall is in place. Your job is to fill the cognitive organs.

You write the `CLAUDE.md` first. This declares what the phase owns: write scope (read-only, plus the working CLAUDE.md), exit gate (point threshold), allowed tools (Read, WebFetch, WebSearch, Bash for grep), forbidden tools (everything that writes outside the working CLAUDE.md). The brain index will eventually pick this up and recognize the plugin as a phase.

You add hooks under `hooks/`. A `PreToolUse` hook that consults the active phase from the orchestrator and, if the active phase is `research`, validates the tool against the allowlist. A `Stop` hook that tracks point accumulation and fires the exit gate at threshold. These are the reflexes that keep the phase honest.

You add scripts under `scripts/`. `research.sh advance` to enter the phase, `research.sh set-multiplier` to declare scope on entry, `research.sh commit` to exit and hand off to the next phase. These are the verbs the orchestrator and the agent use to drive the phase from the outside.

You add tests under `tests/`. One test per hook, one test per script, plus integration tests for the full enter/work/exit cycle. The safe-lock cycle requires these to pass before any commit lands.

You author the agents under `agents/`. A `research-investigator` for parallel external investigation. A `research-synthesizer` for collapsing findings into a structured paragraph that returns to the main session. Each one is a Markdown file with a tool list and a prompt, scoped to the plugin.

You write the `voice.xml`. Coaching voices for phase entry, multiplier nudges, mid-phase encouragement to dispatch subagents rather than read alone. Hard blocks for forbidden-tool attempts. Two flavors of each, structured by id.

You initialize `evolution.md` with cycle 1 — the cycle in which the plugin was born. The historian subagent will narrate later cycles automatically, but cycle 1 needs the operator's hand.

You register the hooks in `settings.local.json` so they actually fire — both the `PreToolUse` guard and any `PostToolUse` sensor the phase needs.

You hand back the lock for `phase_research`. The safe-lock cycle runs the new test suite. If it passes, the plugin commits.

Then comes the part most plugin tutorials skip: the orchestrator does not yet know about the new phase. Closing the `phase_research` lock makes the cell wall live, but the `FORWARD_MAP` and `BACKWARD_MAP` strings inside `phasic_system/scripts/phase.sh` still read the original sequence. To insert RESEARCH between OBSERVE and PLAN, you open a *second* `[PLUGIN-LOCK]` — this time on `phasic_system` itself — and edit both maps so the orchestrator knows `observe → research → plan` is the new shape and so backward transitions from later phases can land in research as well as in observe and plan. New tests cover the new edges. Safe-lock validates. The lock closes. Only now will the orchestrator route a job through the research phase. Adding a cognitive organ takes two locks: one to build the cell, one to wire it into the body.

The whole ceremony is not, in honest terms, "a couple of editing sessions." A real new phase plugin is closer to a multi-cycle deep job — several editing sessions for the guard, more for the tracker and sensor, a hundred-plus lines of voice, twenty to thirty test assertions across half a dozen test files, plus the orchestrator update. The kit's gift is not that the work is small. The kit's gift is that the work is *bounded* — every file has a purpose, every purpose is named, and the safe-lock cycle keeps every step honest.

What makes that bounded work feel different from a from-scratch build is that you are not inventing the structure; you are filling a structure the kit already specified. The cell template knows what cognitive organs the cell needs. You are the one filling them with the substance for *this* organism.

This is what a maturing seed looks like. Every cycle, you notice a pattern the brain isn't enforcing and decide whether it deserves a new plugin, a new hook in an existing plugin, a new voice line, or no enforcement at all. The kit makes that decision tractable, because the cost of trying — building the plugin, running it for a few cycles, deciding to keep or discard it — is bounded.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

Three essays in, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? What does an operator's day look like at week one, week six, month three? How does the seed mature from apprentice to architect — and what does it mean for the brain to *finish* growing in size while continuing to learn?

Next.

---

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
*Next: [From Apprentice to Architect](08-from-apprentice-to-architect.html) — job formats, the maturation arc, and the seed's hand-off.*
