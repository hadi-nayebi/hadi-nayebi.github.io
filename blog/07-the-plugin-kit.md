---
title: "The Plugin Kit"
date: "May 2026"
slug: "the-plugin-kit"
read_time: "TBD"
tags: [Architecture, Seed Agent, Plugins, Hooks, Voices, Subagents]
status: draft
version: v0.14.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/plugin-kit.png"
---

# The Plugin Kit

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

---

A plugin is a cell.

[Essay 5](05-the-always-on-digital-cortex.html) named the always-on layer and the CLAUDE.md bus surrounding it. [Essay 6](06-the-markov-phasic-brain.html) named the phases that fill those compartments. This essay opens the cell — the unit the seed agent is built out of.

The prototype currently runs eleven plugins. Five always-on, six phasic. The eleven are not a fixed list; they are an instance of a template — a structured cell wall every plugin obeys, plus a smaller set of cognitive organs each plugin chooses or skips based on what its concern demands. The thing worth studying is the template, because the template is what lets a twelfth plugin or a twentieth slot into the architecture without breaking it.

This essay names the cognitive organs every plugin has, the organs most plugins have, and the organs only a few specialists carry. It explains why each one is its own file rather than blended with its neighbors. And it distills the rules every prototype plugin already obeys, into a stable anatomy you can use to think about what to include when you grow a new one.

---

## The Universal Skeleton

Across all eleven plugins in the current prototype, six things are universal. Strip away every specialty, and these six are still there. Together they form the minimum-viable plugin — the smallest shape the architecture recognizes as a living cell.

**`CLAUDE.md`** is the plugin's working memory and self-description. It declares what the plugin owns, what its hooks fire on, what its size limits are, what its current version is. The agent reads it both when working inside the plugin and when reasoning about the plugin from outside. Every plugin in the prototype carries one, even the smallest.

**`hooks/`** holds the reflexes — short shell scripts fired by Claude Code events: `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`. Hooks are how the plugin reaches the cognitive process from outside the LLM. They are pure shell, executing in milliseconds, returning exit codes that decide whether the cognitive call proceeds. Every plugin ships at least one.

**`tests/`** holds the plugin's self-tests. Every plugin carries its own suite covering its hooks, its scripts, and the edge cases it has learned to handle. The size varies — single-digit assertions in a young plugin, hundreds in a mature one — but the discipline is universal: a plugin without tests cannot be edited safely, because the safe-lock cycle that gates every edit reads from this directory.

**`docs/`** holds the plugin's narrated knowledge. Two files live here in every prototype plugin without exception. `docs/evolution.md` is the plugin's 2000-word-capped historical narrative — the story of how the plugin got to its current state, narrated by the plugin's historian subagent. A sibling file (named `docs/principles.md` or `docs/decisions.md` depending on the plugin) captures the architectural rationale behind specific design choices. Both are read by the agent when the plugin is unlocked for editing, so whoever is touching the code inherits the plugin's reasoning before changing anything.

**`hooks/voice.xml`** holds the plugin's strings — coaching voices that nudge the agent at the right moment, and structured blocks that refuse the agent when a guard fires. Voices delivered via hooks are injected into the LLM's context window; this file is the LLM-facing voice surface.

The six together form the cell wall. Outside the wall, the only contact the plugin has with the world is through hook events. Inside, the plugin owns its own cognitive organs, its own state, its own history. If a directory at `.claude/plugins/<name>/` is missing any of these six, `plugin_integrity` refuses to activate it.

This is the skeleton. Most plugins add more.

---

## The Conditional Organs

Five further cognitive organs appear in most plugins but not all. Their presence or absence is itself a signal about what kind of plugin you are reading.

**`scripts/`** holds the plugin's internal CLI — the verbs the plugin publishes for the agent (or another plugin) to call. `phase.sh advance`, `observe.sh set-multiplier`, `safe-lock.sh`, `drift-check.sh`. Ten of the eleven prototype plugins carry a `scripts/` directory. The exception is `question_discipline`, which publishes no CLI at all — its job is purely to refuse malformed questions at the gate. A plugin without `scripts/` is announcing: *I don't expose verbs, I only enforce*.

**`scripts/voice.xml`** holds a second voice file — the operator-facing strings the plugin's CLI prints to the terminal. The dual-voice convention is one of the most consistent patterns in the prototype. Ten plugins carry both `hooks/voice.xml` (LLM-context-injected) and `scripts/voice.xml` (terminal-printed). The wording often differs between the two: the LLM gets a structured paragraph it should internalize; the operator gets a short status line. Same intent, different audience. Auditor scripts that grep voice ids have to look in both files — auditing only one will false-positive every id that lives in the other.

**`config.conf`** is the operator's tuning surface — environment-style `KEY=value` lines for thresholds the plugin exposes for adjustment. `SOFT_THRESHOLD_TIER=20`, `MAX_EVOLUTION_WORDS=2000`, `DRIFT_THRESHOLD=10`. Ten plugins carry one. Values are deliberately not hard-coded into the hooks: an operator can raise `brain_guard`'s tier thresholds without editing code, and the plugin reads the new value the next time it fires. Configuration lives separately from code because it changes on different timescales.

**`data.json`** is the plugin's hidden runtime state — the bookkeeping a long-running plugin accumulates across cycles. The active focused job, the tier counter, the summary chain, the lock manifest. Ten plugins carry one. It is gitignored, lives only on the operator's machine, and is `flock`-protected so concurrent calls don't corrupt it. The write protocol is uniform across every plugin that uses it — read under lock, transform with `jq` into a temp file, validate the temp with `jq empty`, then `mv` over the live file. The reader never sees a partial state. If the file is corrupt at parse time, the gateway script rebuilds it from defaults rather than blocking the agent. Fail-safe, not fail-closed.

**`agents/`** holds subagent definitions the plugin owns — `historian-*` for evolution narration, `verify-*` for auditing, `condense-*` for waterfall routing, `observe-*` for research, `plan-*` for analysis, `execute-*` for parallel file work. Nine of the eleven plugins carry an `agents/` directory. The two exceptions are `job_core` and `interaction_summary`, neither of which delegates investigative work — their concerns are local state machines, not research surfaces. A plugin without `agents/` is announcing: *my concern doesn't need delegated investigation*.

The pattern across the conditional organs is consistent: missing an organ is an *honest signal*, not a deficiency. Each absence says something true about what the plugin owns.

---

## Specialist Appendages

Three further cognitive organs appear in only some plugins, and what their presence signifies is even more specific.

**`template/`** appears in six plugins — `plugin_integrity` and the five phase plugins. A `template/` directory holds the cell template the plugin uses to *birth* something. `plugin_integrity/template/` is the master plugin template every new plugin is stamped from. The phase plugins each carry their own `template/` holding the entry templates for new phase-cycle artifacts. A plugin carrying `template/` is announcing it has the authority to create new instances of something.

**`e2e/`** appears in exactly one plugin — `phasic_system`. End-to-end tests that exercise the full OPEVC orchestration across multiple phases and cycles. Because no other plugin sees the cycle in its entirety, no other plugin needs `e2e/`.

**`LICENSE` + `README.md`** at the plugin root appear in the four always-on plugins that are migration-ready for open-source distribution. The phasic plugins, still maturing, will pick these up as they cross the migration threshold. The presence of these two files at the plugin root is a maturity tell.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — a plugin "cell" showing the universal skeleton inside the cell wall, conditional cognitive organs in a secondary tier, and the brain-root wiring file labeled outside the cell.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for organ fills (cyan, green, orange, pink, magenta — same palette as the cycle image, with darker variants used as a second tier);
  white chalk for ALL labels, arrows, and the cell-wall outline; faint chalk dust at the edges; a couple of chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal file and folder names listed below. Do not invent or substitute any other names, paths, or organ descriptors.
  Layout: One large hand-drawn chalk circle takes up most of the board — the "cell wall". Above the circle, a white-chalk header reads exactly ".claude/plugins/<plugin_name>/" (treat the angle brackets as literal text). Inside the circle, ten small chalk shapes arranged around the interior, each labeled IN WHITE CHALK with its exact file or folder name. Six of them are drawn with a SOLID chalk border (universal skeleton); four are drawn with a DASHED chalk border (conditional organs):
    Shape 1 (cyan fill, SOLID border, top-center): "CLAUDE.md"
    Shape 2 (green fill, SOLID border): "hooks/"
    Shape 3 (pink fill, SOLID border): "tests/"
    Shape 4 (orange fill, SOLID border): "docs/"
    Shape 5 (cyan fill darker, SOLID border, drawn small INSIDE the docs/ shape): "docs/evolution.md"
    Shape 6 (cyan fill darker, SOLID border, drawn small INSIDE the hooks/ shape): "hooks/voice.xml"
    Shape 7 (green fill darker, DASHED border): "scripts/"
    Shape 8 (orange fill darker, DASHED border, drawn small INSIDE the scripts/ shape): "scripts/voice.xml"
    Shape 9 (magenta fill, DASHED border): "config.conf"
    Shape 10 (pink fill darker, DASHED border): "data.json"
    Shape 11 (magenta fill darker, DASHED border): "agents/"
  No arrows between the organs inside the cell — they are independent compartments inside the same cell wall.
  Outside the cell wall, three small chalk arrows point INTO the wall from outside, each labeled IN WHITE CHALK with one literal event name (these are the only external touches):
    arrow 1: "UserPromptSubmit"
    arrow 2: "PreToolUse"
    arrow 3: "Stop"
  In the upper-right of the board, OUTSIDE the cell wall entirely, draw a single small white-chalk box labeled IN WHITE CHALK exactly ".claude/settings.local.json" with a short white-chalk arrow pointing from the box DOWN to the cell wall, labeled IN WHITE CHALK exactly "registers".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: ".claude/plugins/<plugin_name>/", "CLAUDE.md", "hooks/", "tests/", "docs/", "docs/evolution.md", "hooks/voice.xml", "scripts/", "scripts/voice.xml", "config.conf", "data.json", "agents/", "UserPromptSubmit", "PreToolUse", "Stop", ".claude/settings.local.json", "registers", plus the caption below. No other words, file names, folders, plugin names, or organ descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Universal skeleton (solid border) plus conditional organs (dashed). The wiring file lives at brain root, outside the cell."
-->

---

## What Lives Outside the Plugin

One file the current architecture deliberately keeps OUTSIDE the plugin is worth naming, because plugin tutorials in many systems get it wrong.

`settings.local.json` does not live inside each plugin. It lives at `.claude/settings.local.json` — the brain root. This is the wiring file: a single JSON document that pairs Claude Code event names with hook script paths across every plugin. Claude Code reads it on session start and decides which hooks fire on which events for the whole brain.

The placement is intentional. A plugin cannot self-register. The brain registers the plugin. If a plugin's hook script existed at the right path but the brain's `settings.local.json` didn't list it, the hook would be dead code. The wiring is brain-scoped because the brain is what activates plugins, not the other way around.

This makes the brain's `settings.local.json` the one file an operator must edit when installing or removing a plugin. The plugin can be perfectly authored — every organ in place, every test green — and still inactive if the wiring isn't there.

---

## Compartmentalization Inside the Cell

The reason every organ is its own file rather than blended with its neighbors is the load-bearing claim of this essay.

Each cognitive organ has a *distinct audience*, a *distinct lifecycle*, and a *distinct failure mode*. Mixing them mixes the failure modes — which is the version of the problem that has historically made plugin architectures decay into pasta.

**`hooks/` vs `scripts/` — different callers.** Hook scripts are called *from outside* the agent, by Claude Code firing events. Script CLIs are called *from inside*, by the agent itself or by another plugin. The caller difference matters: a hook that takes too long blocks every tool call; a script that takes too long blocks only the one operation it was running. They have different latency budgets, different debugging surfaces, different error semantics. Putting them in the same directory would hide that.

**`voice.xml` vs `CLAUDE.md` — runtime strings vs cognition.** Voice files are consumed at runtime by hooks and scripts — extracted by id, templated with variables, returned as stdout or stderr. The LLM sees the string only at the moment the hook fires. `CLAUDE.md` is read into the LLM's context window at session start and stays there for the duration. Different consumption moments. Different update cadences. Different size budgets. Blending them would mean every voice tweak rewrote the agent's working memory.

**`data.json` vs `config.conf` — runtime state vs operator-tunable thresholds.** State changes during a cycle and is meaningless to a different operator. Thresholds change rarely and are part of the plugin's operating contract. Putting them in the same file would either gitignore the thresholds (losing them across machines) or commit the state (corrupting it across operators). Two files because two lifecycles.

**`tests/` per-plugin, not a global pool.** The safe-lock cycle inside `plugin_integrity` requires that only one plugin be unlocked at a time. A test suite ranging across multiple plugins would need to coordinate locks across every directory it touches. Per-plugin scoping makes the test boundary match the lock boundary.

**`docs/evolution.md` capped at 2000 words.** The cap forces the narrative to surface what's essential. Plugins that exceed the cap have to migrate older content into a sibling like `docs/decisions.md`. The compression is the discipline — bounded cognitive tissue stays legible across many cycles of accumulation.

The high-stakes plugins reveal this compartmentalization-inside discipline in their *comment density*. `brain_guard`'s `self-compact.sh` is over half comments — every block of logic in the file is annotated with the why. `phase_execute`'s `execute.sh` carries roughly a third comments. `question_discipline`'s gate hook carries around forty percent. The pattern: when a plugin's concern is high-stakes (self-compaction, write-scope enforcement, asking discipline), the in-code annotation density rises to match. The comments aren't there for the next human reader; they are there for the historian subagent that will eventually narrate the file's evolution. The plugin documents itself for its own future re-telling.

The cell wall isn't just protection from the outside. It is the structural enforcement of internal compartmentalization.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard two-column sketch — coaching (soft, probabilistic) on the left, block (hard, deterministic) on the right, with a curving migration arrow between them.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the two column panels (cyan = coaching/soft, magenta = block/hard);
  white chalk for ALL labels, XML tag text, arrows, and the migration caption; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other XML tag names, voice names, or descriptors. Treat angle brackets in XML tags as literal text.
  Layout: Two vertical chalk panels side by side across the board.
    Left panel (cyan border, header IN WHITE CHALK reads exactly "coaching — soft layer"). Inside the panel, four short white-chalk lines stacked top to bottom:
      Line 1 (drawn as a small chalk XML element): "<coaching id=...>"
      Line 2: "injected into LLM context"
      Line 3: "probabilistic — can be ignored"
      Line 4: "LLM-interpreted"
    Below the four lines, draw a small chalk speech-bubble icon (the soft-nudge symbol).
    Right panel (magenta border, header IN WHITE CHALK reads exactly "block — hard layer"). Inside the panel, four short white-chalk lines stacked top to bottom:
      Line 1 (drawn as a small chalk XML element): "<block id=...>"
      Line 2: "stderr refusal"
      Line 3: "exit 2 — deterministic"
      Line 4: "agent's tool call fails"
    Below the four lines, draw a small chalk X-over-toolbox icon (the refusal symbol).
    Between the two panels, draw a single curving white-chalk arrow that arcs from the bottom of the left panel UP and OVER to the top of the right panel, with one short caption riding along the arrow's curve: "measurement → harden".
  Below both panels, a horizontal chalk note IN WHITE CHALK reads exactly: "Lock 13: over-engineering veto — soft must measurably fail before hard lands".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching — soft layer", "<coaching id=...>", "injected into LLM context", "probabilistic — can be ignored", "LLM-interpreted", "block — hard layer", "<block id=...>", "stderr refusal", "exit 2 — deterministic", "agent's tool call fails", "measurement → harden", "Lock 13: over-engineering veto — soft must measurably fail before hard lands", plus the caption below. No other words, file names, voice ids, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Soft layer coaches. Hard layer refuses. Patterns migrate left to right when data warrants."
-->

---

## Plugin-Specific Behavioral Anchors

Each plugin's name points at the one concern it owns. Naming the concern is easy because each only has one. Below is what each plugin in the current prototype would lose if it were merged with another — the behavioral anchor that justifies its existence as a separate cell.

**`plugin_integrity`** owns the lock ceremony and the historian system. The lock ceremony has four parts — a `[PLUGIN-LOCK]` question that opens an edit session; a finer-grained `[TEST-LOCK]` question for editing test files within an already-unlocked plugin; a safe-lock close-out that runs the plugin's full test suite at the lock boundary and reverts the working tree to a captured git checkpoint if any test fails; and a drift-counter ratchet that refuses to open the lock when the plugin's evolution narrative has fallen behind. The plugin polices every other plugin's edits, and it polices itself by the same gate. The auto-revert is forensic: every revert appends a structured entry to a 20-deep FIFO revert log carrying the failed tests, the files restored, the trigger reason, and a timestamp. There is no override. The historian system is the other half — each plugin has its own `historian-<plugin>.md` subagent that re-narrates the plugin's evolution when the drift counter trips, refreshing `docs/evolution.md` before the next edit can land.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard flowchart — the safe-lock cycle's pass-or-revert branch.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk boxes
  and arrows; pastel chalk for box fills (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels and arrows; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other state names, command names, or descriptors.
  Layout: Five hand-drawn chalk boxes arranged in a vertical flow down the center of the board, each labeled IN WHITE CHALK with its exact text:
    Box 1 (cyan fill, top): "[PLUGIN-LOCK] <name> approved"
    Box 2 (green fill): "edits inside unlocked plugin only"
    Box 3 (orange fill): "lock-cmd.sh OR safe-lock.sh fires"
    Box 4 (pink fill): "run plugin test suite"
    Box 5 (no fill, decision diamond drawn as a chalk rhombus): "all tests pass?"
  Single white-chalk arrows connect Box 1 → Box 2 → Box 3 → Box 4 → Box 5.
  From Box 5, two arrows fan out to two terminal boxes side-by-side at the bottom:
    Left arrow labeled IN WHITE CHALK exactly "yes" → magenta box labeled "commit + clear unlocked_plugin"
    Right arrow labeled IN WHITE CHALK exactly "no" → orange box (warmer chalk) labeled "revert to checkpoint_ref + log revert"
  Below the two terminal boxes, draw a small chalk note IN WHITE CHALK reading exactly: "no override".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "[PLUGIN-LOCK] <name> approved", "edits inside unlocked plugin only", "lock-cmd.sh OR safe-lock.sh fires", "run plugin test suite", "all tests pass?", "yes", "no", "commit + clear unlocked_plugin", "revert to checkpoint_ref + log revert", "no override", plus the caption below. No other words, file names, folders, or state descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Test pass-or-revert. Every plugin edit passes through the same gate."
-->

**`brain_guard`** owns context-window self-compaction. A pre-call sensor reads the running token count on every tool call. Below a soft threshold around twenty percent of the window, a coaching voice prompts the agent to draft a structured `/compact` instruction. Above the read threshold around twenty-five percent, the read tools are blocked. Above the critical threshold around thirty percent, the write tools are added to the block list. The progressive squeeze fires well before Claude Code's default auto-compact at the full window, which lets the agent operate even when the operator is away. The plugin also shape-enforces the `/compact` instruction itself — five named sections required before it accepts the call. The thresholds are not constants in the hook code; they live in `brain_guard/config.conf`, so an operator running a longer cycle can raise them without touching scripts.

**`job_core`** owns the focused-job lifecycle. A user-prompt hook routes every prompt into a job — creating a new active job if none is focused, appending the prompt as an interaction on the focused one if one is. A stop-gate hook refuses every `Stop` call while any job is active or pending, implementing the Ralph-loop pattern at the always-on level. The job's `user_interactions` array becomes the agent's cumulative mega-prompt — the whole list is what the agent re-reads as its instruction set, not just the latest message. The plugin carries no `agents/` directory, by design: its concern is local state management, not delegated research.

**`interaction_summary`** owns the threshold-driven summary chain. After each user interaction is captured by `job_core`, this plugin counts the unsummarized tokens. Once the count crosses a threshold around five hundred tokens, the plugin blocks the agent's next move with a structured request to file a summary. The interaction list, which otherwise grows without bound, stays legible because each summary captures the older interactions into a compressed paragraph and the unsummarized portion resets to zero. Like `job_core`, this plugin carries no `agents/` — same reason.

**`question_discipline`** owns the asking gate. Every `AskUserQuestion` call must begin with a registered prefix — `[PLUGIN-LOCK]`, `[JOB-COMPLETE]`, `[GMODE]`, `[PLAN-APPROVAL]`, and the rest of the catalog. Without the prefix, the gate refuses the call. This is the plugin without `scripts/`, without `scripts/voice.xml`, without `config.conf`, without `data.json` — pure enforcement. The minimum-viable plugin in the current prototype, by structural choice. Every absent organ is a deliberate signal: no CLI to publish, no operator threshold to tune, no runtime state to carry — just the gate.

**`phasic_system`** owns OPEVC orchestration. The cycle counter, the phase pointer, the multiplier sentinel that locks every tool at phase entry until the agent sets a value, the forward and backward edge maps that decide where the cycle goes next. The orchestrator is itself a plugin, not a privileged subsystem — which is why it carries an `e2e/` directory full of end-to-end tests that no individual phase plugin needs, but the orchestrator does.

**Each `phase_*`** — five plugins, one per phase — owns its phase's guard, tracker, sensor, and commit script. Each plugin enforces the write-scope rule for its own phase, tracks the point counter that gates the phase's exit, and emits the per-phase coaching voices that shape what kind of work the phase rewards. The phases are themselves cells; the orchestrator coordinates them. Each phase plugin also carries its own `agents/` directory holding the subagents that phase dispatches — observe-side researchers, plan-side analysts, execute-side implementers, verify-side auditors, condense-side waterfall routers. The architecture's roughly eighty-percent subagent / twenty-percent main-session split lives mostly here, in the per-phase agent pools, not in a global pool. Locality of reasoning plus the safe-lock single-plugin-unlock constraint together make per-plugin scoping the correct choice.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard hub-and-spoke — small main-session circle at the center orchestrating; larger plugin-scoped subagent pools fanning out around it.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk circles
  and arrows; pastel chalk for the subagent pools (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, and the main-session circle; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other subagent names, plugin names, or descriptors. Use only the counts listed.
  Layout: One small white-chalk circle at the dead center of the board, labeled IN WHITE CHALK exactly "main session (20%)". Around it, six larger pastel chalk circles fanning out in a hexagonal arrangement, each labeled IN WHITE CHALK with its exact text:
    Circle 1 (cyan, top): "observe-* (12)"
    Circle 2 (green, upper right): "plan-* (6)"
    Circle 3 (orange, lower right): "execute-* (3)"
    Circle 4 (pink, bottom): "verify-* (5)"
    Circle 5 (magenta, lower left): "condense-* (7)"
    Circle 6 (cyan, darker, upper left): "historian-* (12)"
  From the central main-session circle, a single white-chalk arrow goes OUT to each of the six surrounding pools (six arrows total, all radial). Each arrow is labeled with the same single word IN WHITE CHALK exactly: "dispatch".
  In a chalk box at the bottom-right corner of the board, draw a small "budget panel" with header IN WHITE CHALK reading exactly "direct-action budget", and two short white-chalk lines stacked:
    Line 1: "+3 grants per execute-* dispatch"
    Line 2: "-1 per project file edit"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "main session (20%)", "observe-* (12)", "plan-* (6)", "execute-* (3)", "verify-* (5)", "condense-* (7)", "historian-* (12)", "dispatch", "direct-action budget", "+3 grants per execute-* dispatch", "-1 per project file edit", plus the caption below. No other words, file names, plugin names, or subagent names may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Main session orchestrates. Subagents fan out. The 80/20 split is a context-discipline budget, not a guideline."
-->

The seed agent's behavior is the sum of these eleven anchors. Each one is small. Together they compose the brain.

---

## When Does Something Deserve a New Plugin?

The kit is generative — adding a twelfth plugin is supposed to be tractable. But not every new pattern deserves one. A cost ladder applies.

**Voice** is the cheapest enforcement. A new coaching string in an existing plugin's `voice.xml` costs one file edit, one test if you add one, and the seed agent's behavior shifts probabilistically the next time the relevant hook fires. Most new patterns start here.

**Hook in an existing plugin** is the next step up. If a coaching voice has fired across many cycles and the data shows the agent ignoring it, the operator hardens the soft control into a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. New tests cover the new gate. The voice retires into a softer pre-block warning, or out entirely.

**A new plugin** is the most expensive step. It is warranted when a pattern crosses an existing plugin's boundary cleanly, when it introduces a new always-on concern, when it introduces a new phase, or when it carries enough state to need its own `data.json`. The minimum-viable plugin starts with the six skeleton organs and adds conditional organs only as the concern demands them — no `scripts/` if you publish no CLI, no `agents/` if you delegate no work, no `config.conf` if there is nothing for an operator to tune, no `data.json` if the plugin is stateless across calls.

A discipline the prototype names *Lock 13: the over-engineering veto* applies to every step on the ladder: no new hard gate hardens before measured cycles demonstrate the soft form is failing. The architecture documents this restraint because the failure mode it prevents is real — brains overfit to controls that never had to fire become brittle and unreadable, and the cycle that creates them is exactly the kind of cycle that feels productive at the time.

The cost ladder is what makes the eleven plugins a *current* prototype, not a final architecture. A future seed cultivator running into a recurring pattern that no existing plugin's concern owns will climb the ladder one rung at a time. Most patterns stop at voice. Some reach hook. A few earn a plugin.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard horizontal flow — phase footer carrying inline markers, CONDENSE grep-dispatches each to its handler, consumed markers become strikethrough audit lines.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for marker pills and step badges (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, and section markers; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other marker names, step names, or descriptors. Triple-dash phase-section markers must be written EXACTLY as shown (three dashes, abbreviation, three dashes).
  Layout: Three horizontal chalk panels arranged left-to-right across the board, joined by white-chalk arrows.
    Left panel — vertical white-chalk header above reads exactly "phase footer". Inside, four phase-section markers drawn as horizontal white-chalk lines, top to bottom: "---Ob---", "---Pl---", "---Ex---", "---Ve---". Inside three of those sections, draw small pastel chalk pills labeled IN WHITE CHALK with example inline markers, one pill per section:
      under "---Ob---" (cyan pill): "[KNOWLEDGE] topic-slug"
      under "---Pl---" (green pill): "[PENDING-JOB]"
      under "---Ex---" (orange pill): "[VOICE-UPDATE] id | why | direction"
    A single white-chalk arrow leaves the left panel and points right, labeled IN WHITE CHALK exactly "grep + dispatch".
    Middle panel — vertical white-chalk header reads exactly "CONDENSE waterfall". Inside, five small chalk step-badges stacked top to bottom, each labeled IN WHITE CHALK with its number and short name:
      Badge 1 (cyan): "step 3: pending job"
      Badge 2 (green): "step 4: voice update"
      Badge 3 (orange): "step 5: agent update"
      Badge 4 (pink): "step 6: knowledge"
      Badge 5 (magenta, smaller, fainter): "step 1: durable / ephemeral tags"
    A single white-chalk arrow leaves the middle panel and points right, labeled IN WHITE CHALK exactly "consumed".
    Right panel — vertical white-chalk header reads exactly "next cycle reads". Inside, a single strikethrough chalk line (drawn with a horizontal slash through the text) reading EXACTLY: "[VOICE-UPDATE] id | why | direction CONSUMED 2026 Step 4". The text is struck through but legible.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "phase footer", "---Ob---", "---Pl---", "---Ex---", "---Ve---", "[KNOWLEDGE] topic-slug", "[PENDING-JOB]", "[VOICE-UPDATE] id | why | direction", "grep + dispatch", "CONDENSE waterfall", "step 3: pending job", "step 4: voice update", "step 5: agent update", "step 6: knowledge", "step 1: durable / ephemeral tags", "consumed", "next cycle reads", "[VOICE-UPDATE] id | why | direction CONSUMED 2026 Step 4", plus the caption below. No other words, file names, folders, marker names, or step descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Markers are plain text. CONDENSE consumes them, strikethrough audits the consumption."
-->

---

## Tier-3 Close: Plugin Birth via `template/`

For the architects in the audience, here is what creating a new plugin actually looks like. Imagine you decide your seed needs a `research` phase between `observe` and `plan` — a phase whose job is deeper external investigation when working memory has gaps internal observation cannot fill.

You ask `[PLUGIN-LOCK] phase_research`. The user approves the lock. `lock-manager.sh` notices that no `phase_research/` directory exists yet, so it copies `plugin_integrity/template/` into place — the universal cell template — and substitutes the plugin name into the file placeholders. Phase-specific entry templates inherit further structure from one of the existing phase plugins' `template/` directories, whichever the operator points the birth at. A `historian-phase-research.md` is generated from `template/_historian.md` so the plugin already has its narrator. The birth itself auto-commits so the drift counter has a baseline. Only then does the unlock state get written. The plugin is born.

You now have the empty kit — the universal-skeleton organs in place, the conditional organs available to fill in. Your job is the substance.

You write the `CLAUDE.md` first — what the phase owns, allowed tools, forbidden tools, exit gate. You add hooks under `hooks/` for the `PreToolUse` guard and the `Stop` sensor. You add scripts under `scripts/` if you publish CLI verbs the orchestrator needs to call. You add tests under `tests/` covering each hook and script. You author subagents under `agents/` if your phase delegates investigation. You write the voice files — `hooks/voice.xml` always, `scripts/voice.xml` if your CLI prints to the terminal. You add `config.conf` if the phase exposes any operator-tunable threshold. You initialize `docs/evolution.md` with cycle one, the cycle in which the plugin was born.

You hand back the lock. The safe-lock cycle runs the new test suite. If it passes, the plugin commits. If it fails, the working tree reverts and the operator looks at the failed tests.

The plugin is not yet active. Closing the lock makes the cell wall live, but the orchestrator does not yet know about the new phase. The forward and backward edge maps inside `phasic_system/scripts/phase.sh` still read the original sequence. To insert `research` between `observe` and `plan`, you open a second `[PLUGIN-LOCK]` — this time on `phasic_system` itself — and edit both maps. New tests cover the new edges. Safe-lock validates. The lock closes. The brain's `settings.local.json` at the brain root picks up the new plugin's hook registrations. Only now does a job route through `research`.

Adding a cognitive organ takes two locks: one to build the cell, one to wire it into the body. The kit's gift is not that the work is small — a real phase plugin is closer to a multi-cycle deep job — but that the work is *bounded*. Every file has a purpose. Every purpose is named. The safe-lock cycle keeps every step honest.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

Three essays in, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? Next.

---

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
*Next: [From Apprentice to Architect](08-from-apprentice-to-architect.html) — job formats, the maturation arc, and the seed's hand-off.*
