---
title: "The Plugin Kit"
date: "May 2026"
slug: "the-plugin-kit"
read_time: "TBD"
tags: [Architecture, Seed Agent, Plugins, Hooks, Voices, Subagents]
status: draft
version: v0.15.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/plugin-kit.png"
---

# The Plugin Kit

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

---

A plugin is a cell.

[Essay 5](05-the-always-on-digital-cortex.html) named the always-on layer and the CLAUDE.md bus surrounding it. [Essay 6](06-the-markov-phasic-brain.html) named the phases that fill those compartments. This essay opens the cell — and not as an inventory. The kit is a *system* of cognitive organs that read each other, write to each other, and depend on each other in disciplined ways. The architecture is the cross-organ traffic, not the directory listing.

This essay teaches that system. By the end, a new user reading it should be able to guide their own seed agent through the work of *acquiring* an existing plugin from the public repo OR *creating* a new one from scratch — because every organ described here is also described in the public seed agent's own knowledge layer in the same shape, and the seed will recall what it reads here when an OBSERVE phase asks "what does a plugin need?"

---

## The Cell as a System

Every cognitive organ inside a plugin has the same three properties, and the architecture is built around those properties holding consistently.

**Who reads it** — which subsystem (the LLM, Claude Code itself, another plugin, the human operator) consumes the contents at runtime.

**Who writes it** — which ceremony or phase is allowed to mutate it. Most organs have exactly one writer; the security model rests on that exclusivity.

**What it depends on** — which other organs must already be in place for this organ to function correctly.

These three properties are how the cell wall stays porous (organs talk to each other through declared channels) and rigid (organs never reach into each other through undeclared channels). The next several sections walk one organ at a time, naming the three properties explicitly. When you guide your seed agent to add a new plugin, the seed asks itself the same three questions for every file the new plugin will carry — because that is how the public seed agent's own knowledge layer teaches it to think about plugins.

---

## `CLAUDE.md` — The Plugin's Brain Surface

**What it is.** A markdown file at the root of every plugin directory. It declares what the plugin owns, what its hooks fire on, what its size limits are, what its current version is. Every plugin carries one — there is no exception. The file is the agent's primary read at session start and at every moment the plugin becomes relevant to the work. *[ref: every-plugin-carries-claude-md | .claude/plugins/CLAUDE.md:107,119 | Plugin Structure Convention tree shows "CLAUDE.md # Working memory — objective, state, maintenance rules" as the FIRST entry under every plugin (line 107); line 119 confirms "Minimal plugin: just CLAUDE.md" — the no-exception baseline. Together these establish CLAUDE.md as the universal plugin surface.]*

**Who reads it.** The LLM, mostly. Claude Code reads CLAUDE.md files into the agent's working memory at session start. When a plugin is unlocked for editing, the unlock ceremony auto-injects the plugin's CLAUDE.md (along with `docs/evolution.md`) so the editor inherits the plugin's reasoning before changing anything. Other plugins reading this plugin's CLAUDE.md happens rarely and almost always for one-line cross-references, not deep parsing. *[ref: unlock-ceremony-auto-injects-context | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:340-362 | Unlock handler reads `docs/evolution.md` into `context_msg` (L340-345) + emits a `objective-alignment` guidance voice telling the editor to read `$target/CLAUDE.md` (L354); the combined message ships via `PostToolUse additionalContext` JSON (L362), injecting plugin reasoning before any edit lands.]*

**Who writes it.** The CONDENSE phase. By design, CLAUDE.md edits route through CONDENSE because that is the only phase whose guard permits writes to the brain layer. The operator can also touch CLAUDE.md directly via gmode for existing-plugin work — a deliberate escape hatch for fixes outside the cycle ceremony. *[ref: condense-only-md-write-allowlist | phase_condense/hooks/condense-guard.sh:249-250 | Comment on L249 ("Condense can edit .md files AND voice.xml — soft memory layer") + L250 allowlist `if [[ "$FILE_PATH" == *.md ]] || [[ "$(basename "$FILE_PATH")" == "voice.xml" ]]; then` — execute-guard.sh L728 blocks the same writes with `block "root-brain-blocked"`. CONDENSE alone permits brain-layer writes.]*

**What it depends on.** Almost nothing inside the plugin. CLAUDE.md is the surface; other organs depend on *it*, not the reverse. The single exception is the four phase-section markers at the bottom (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) which the section-boundary guard reads to decide where each phase may write. *[ref: phase-marker-section-boundary-parse | lib/section_guard/section-check.sh:252-260 | The `case "$phase_marker" in` block maps the four markers (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) to their section_line numbers, then downstream logic enforces edits land strictly below the active phase's marker line.]*

**The new-plugin lens.** When you guide your seed agent to create a new plugin, the first artifact the seed authors is CLAUDE.md. The seed declares the plugin's single concern, names the hooks it will register, lists its size limits, and stamps version `v0.1.0`. Every other organ inside the plugin will reference choices made here. If CLAUDE.md does not name the concern clearly, the rest of the plugin drifts. New-user guidance: tell your seed to write CLAUDE.md FIRST, then the hooks, then everything else. *[ref: new-plugin-template-claude-md-first | plugin_integrity/template/CLAUDE.md:1-3 | New-plugin scaffold begins with `# {{PLUGIN_NAME}}` + `**Version:** v0.1.0` + "Plugin directory. To be defined." — the template `[PLUGIN-LOCK]` copies on plugin creation (per `.claude/plugins/CLAUDE.md:93,96`: "the template is copied and {{PLUGIN_NAME}} + {{DATE}} are replaced... Template files copied (CLAUDE.md + docs/evolution.md)"). CLAUDE.md ships first; every other organ added afterward.]*

---

## `hooks/` — The Reflexes

**What it is.** A directory of small shell scripts that fire on Claude Code events: `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`. Hooks are how the plugin reaches the agent's cognitive process from outside the LLM. They are pure shell, executing in milliseconds, returning exit codes that decide whether the call proceeds. *[ref: hooks-fire-on-claude-code-events | .claude/settings.local.json | The top-level `hooks` object groups bash commands under exactly these event keys — `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart` — each containing one or more `{matcher, hooks:[{type:"command", command, timeout}]}` entries. Every plugin hook in the prototype registers under one of these five events.]*

**Who reads them.** Claude Code itself, at event time. The agent never reads its own hooks during reasoning — the hooks are invisible to the LLM unless one of them emits a voice into the context. *[ref: hooks-registered-via-settings-local | .claude/settings.local.json:5-15 | Hook registry shape: `"hooks": { "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "bash .claude/plugins/job_core/hooks/prompt-handler.sh", "timeout": 10 }] }] ... }` — Claude Code reads this file at session start, executes the matching `command` at each event. The LLM never reads it.]*

**Who writes them.** The `[PLUGIN-LOCK]` ceremony. Plugin code is not edited the way ordinary files are — every change passes through a deliberate unlock cycle, runs the plugin's test suite at the lock boundary, and reverts to a captured git checkpoint on test failure. *[ref: safe-lock-test-pass-or-revert | plugin_integrity/scripts/safe-lock.sh:3,211-222 | Header comment (L3): "Locks a plugin: run tests → pass: commit + lock / fail: revert + lock"; the body iterates the plugin's test files (L211 `all_pass=true`) and sets `all_pass=false` on any failure (L222), then branches: pass → `git commit`, fail → `git reset --hard $checkpoint`. Plugin code cannot land without this gate.]*

**What they depend on.** Three other organs. `scripts/` (when a hook needs to invoke the plugin's own CLI for state mutation). `hooks/voice.xml` (for every message the hook emits to the agent's context). `data.json` (for state, but only read-mediated through the plugin's own scripts — never directly). And a shared helper at `.claude/plugins/lib/voice-helper/` (the `get_voice` substitution function). *[ref: plugin-structure-convention-organ-tree | .claude/plugins/CLAUDE.md:105-117 | The Plugin Structure Convention tree lists each organ with its role: `hooks/` "(registered in settings.local.json)", `scripts/` "Internal scripts called by hooks", `data.json` "Runtime state (protected from direct edits)". Voice-helper lives at `.claude/plugins/lib/voice-helper/voice-helper.sh` (lib/CLAUDE.md L11-12: "hooks/*.sh → source this lib, call get_voice() for coaching/block/entry voices").]*

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

**The new-plugin lens.** When you guide your seed to create a plugin, the seed decides which Claude Code events the plugin needs to fire on, and authors one hook per event. A plugin with no hooks is dead — every active plugin has at least one. The seed also adds the hook registration to the brain-root `settings.local.json` (covered below); without registration, the file is just a shell script on disk that nothing invokes. *[ref: hook-registration-required-for-fire | .claude/plugins/CLAUDE.md:109 | Plugin Structure Convention annotates `hooks/` with "Hook scripts (registered in settings.local.json)" — the registry at `.claude/settings.local.json` is the only path from shell script on disk to event-time invocation. A hook file with no matching registry entry never runs.]*

---

## `scripts/` — The Verbs

**What it is.** A directory of internal CLI scripts the plugin publishes for the agent (or another plugin) to call. `phase.sh advance`. `observe.sh set-multiplier`. `safe-lock.sh`. `drift-check.sh`. Scripts are how the plugin lets the agent or other plugins talk to it through a stable interface. *[ref: plugin-cli-scripts-exist | .claude/plugins/CLAUDE.md:131-136 | Plugin State Model table names four call modes (Public read, Public write, Hook read, Hook write) with examples `observe.sh altered-list`, `observe.sh set-multiplier`, `observe.sh --hook points`, `observe.sh --hook add-points` — confirming `<plugin>/scripts/*.sh` is the stable CLI interface. The cited scripts (phase.sh, observe.sh, safe-lock.sh, drift-check.sh) all exist at their plugin's `scripts/`.]*

**Who reads them.** The agent, when it invokes a command. Other plugins, when they query this plugin's state via its published read-only commands. The hooks of *this* plugin, when they need to mutate `data.json` (the only path to mutation is the plugin's own scripts). *[ref: data-json-only-via-scripts | .claude/plugins/CLAUDE.md:123,138-140 | "data.json is hidden internal state. The agent cannot read or edit it directly. All access through the plugin's own scripts" (L123) — plus enforcement section (L138-140): "Direct edits blocked by plugin_integrity (Edit/Write/MultiEdit on data.json)", "Direct reads blocked by plugin_integrity (Read tool + Bash cat/jq/head/grep on data.json)". Mutation only via the plugin's own scripts.]*

**Who writes them.** Same `[PLUGIN-LOCK]` ceremony as hooks. Scripts and hooks share the same edit gate because both are code.

**What they depend on.** `data.json` (the script either reads it or atomically mutates it via the read-under-flock + jq-transform + temp-validate + atomic-mv protocol). `voice.xml` (for messages to whoever called the script). `config.conf` (for operator-tunable thresholds). The `lib/voice-helper/` shared helper. *[ref: data-json-atomic-write-protocol | phasic_system/scripts/phase.sh:70-81,116 | The `safe_write` function (L116) implements the atomic mutation pattern: jq writes to `$DATA_TMP_FILE` (`$DATA_FILE.tmp`) → `jq empty` validates JSON shape (L77) → if valid, `mv "$DATA_TMP_FILE" "$DATA_FILE"` atomically replaces (L81); on validation fail, the temp file is removed (L78). Every plugin's data.json mutator uses this same pattern.]*

**The Distributed Job Extension pattern.** Other plugins reach into this plugin only through these scripts — never through the raw `data.json`. The plugin's public read-only commands (`job.sh focused`, `phase.sh current`) are the entire cross-plugin contract. Direct `cat data.json` from outside the owning plugin is forbidden discipline. New-user guidance: when you guide your seed to write a plugin that wants to know about another plugin's state, tell the seed to call the other plugin's `*.sh` command, not to peek at its files. The seed's own knowledge layer reinforces this — every plugin's knowledge dir names its public-API commands explicitly so future cycles can find them. *[ref: distributed-job-extension-cross-plugin | .claude/plugins/CLAUDE.md:139,142 | Enforcement (L139): "Direct reads blocked by plugin_integrity (Read tool + Bash cat/jq/head/grep on data.json)"; design principle (L142): "Plugins are organs with hidden state. The agent queries the organ through defined commands. Some fields have no public read command at all — completely hidden from the agent." Cross-plugin contract is the published `*.sh` commands only.]*

**The minimum-viable plugin shape.** Not every plugin needs `scripts/`. `question_discipline` ships none — it is a pure-gate plugin that does not publish CLI verbs. A plugin without `scripts/` is announcing: *I do not expose verbs; I only enforce.* The absence is itself information. *[ref: question-discipline-no-scripts-dir | .claude/plugins/question_discipline/ | The plugin directory contains `hooks/` (the AskUserQuestion gate) + `tests/` + `CLAUDE.md` + `docs/` — but no `scripts/` subdirectory. Plain `ls` of the plugin proves the absence. `.claude/plugins/CLAUDE.md:119` confirms "Not all directories required. Minimal plugin: just CLAUDE.md."]*

---

## `voice.xml` × Two — The Dual Surface

This is the organ that confuses new users most, and the one where the relational anatomy matters most.

**The two voice surfaces are different files with different audiences.** `hooks/voice.xml` and `scripts/voice.xml` look nearly identical structurally (both XML, both with `<coaching>`, `<block>`, `<info>`, `<entry>` elements identified by `id`), but they serve different consumers. *[ref: dual-voice-surfaces-share-schema | .claude/plugins/plugin_integrity/hooks/voice.xml + .claude/plugins/plugin_integrity/scripts/voice.xml | `ls .claude/plugins/*/{hooks,scripts}/voice.xml` shows ten plugins shipping BOTH surfaces (brain_guard, interaction_summary, job_core, phasic_system, plugin_integrity, and all five phase plugins); question_discipline ships only `hooks/voice.xml` because it has no `scripts/` CLI (cf. B7 §scripts paragraph). Both files use the same XML schema — `<coaching id="…">`, `<block id="…">`, `<info id="…">`, `<entry id="…">` — confirmed by grep counts (plugin_integrity/hooks/voice.xml: 3 coaching + 29 block + 15 info + 2 entry = 49 elements).]*

### `hooks/voice.xml` — The Agent-Facing Surface

**What it is.** Strings the plugin emits at hook fire-time. Coaching voices that nudge the agent at a specific moment (entering a phase, crossing a context tier, having just dispatched a subagent). Blocks that refuse the agent when a guard fires.

**Who reads it.** The LLM agent. Voices delivered via hooks land in the agent's context window — either as soft injections via `additionalContext` JSON (coaching) or as exit-2 stderr refusals (blocks). The LLM sees the string mid-turn and reacts. *[ref: coaching-additionalcontext-vs-block-exit2 | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:336-362 + .claude/plugins/phase_observe/hooks/observe-guard.sh:141-142 | lock-manager.sh L336-337 comments the contract: "via hookSpecificOutput.additionalContext JSON on stdout. PostToolUse stderr from exit-0 hooks is silently dropped by Claude Code; only additionalContext" — followed by L362 emitting `jq -n --arg m "$context_msg" '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":$m}}'`. observe-guard.sh L141-142 shows the block path: `echo "$msg" >&2` then `exit 2`. Coaching = additionalContext JSON envelope; block = exit-2 stderr.]*

**Who writes it.** Mostly CONDENSE step 4 (which consumes `[VOICE-UPDATE]` markers other phases emit). The historian subagent also updates voice files when the plugin's evolution requires new coaching. PLUGIN-LOCK is the underlying gate for any edit. *[ref: condense-step-4-voice-update-owner | .claude/plugins/phase_condense/agents/condense-voice-updater.md + .claude/plugins/plugin_integrity/agents/historian-*.md | The condense-voice-updater agent definition exists at the cited path (it is the subagent CONDENSE step 4 dispatches for `[VOICE-UPDATE]` marker consumption). historian-phase-*.md, historian-plugin-integrity.md, historian-brain-guard.md, historian-job-core.md, historian-interaction-summary.md, historian-question-discipline.md, historian-phasic-system.md all exist under plugin_integrity/agents/ — each plugin's historian re-narrates its evolution.md AND can update its voice.xml when the plugin's evolution requires new coaching.]*

**What it depends on.** The shared `lib/voice-helper/` helper (the `get_voice` function that loads voice.xml entries and substitutes `{{var}}` placeholders). *[ref: voice-helper-get-voice-var-substitution | .claude/plugins/lib/voice-helper/voice-helper.sh:60,113-122 | The `get_voice` function header comment (L60): "var=value — Optional pairs. Replaces {{var}} placeholders in the extracted text." The substitution block (L113-122): "--- Variable substitution: replace {{var}} placeholders --- Caller passes key=value pairs. Each {{key}} in the text is replaced with value." Every plugin's hook scripts source this single shared helper for voice rendering.]*

### `scripts/voice.xml` — The Operator-Facing Surface

**What it is.** Strings the plugin's CLI prints to the operator's terminal. When `safe-lock.sh` reverts a test failure, the operator sees a short status line in their terminal. The text is what the operator's eyes read in the shell. *[ref: scripts-voice-cli-operator-surface | .claude/plugins/plugin_integrity/scripts/voice.xml | grep counts in plugin_integrity/scripts/voice.xml: 6 total elements (vs 49 in hooks/voice.xml of the same plugin) — the operator-facing surface is intentionally sparser because operator messages are status lines, not coaching paragraphs. Every plugin shipping a `scripts/` dir also ships `scripts/voice.xml` so CLI verbs (`safe-lock.sh`, `drift-check.sh`, etc.) print human-readable status without hard-coding strings into the scripts.]*

**Who reads it.** The human operator. Terminal output. Not injected into the LLM's context — printed to stderr or stdout of the shell, visible only to the person at the keyboard.

**Who writes it.** Same ceremony as hooks/voice.xml.

**What it depends on.** Same voice-helper.

### Why the split matters

Same intent — both surfaces carry the plugin's voice. Different audiences — the LLM consumes structured paragraphs that frame the situation and propose action; the human consumes status lines that flag what happened. Wording often differs between the two for the same conceptual event. Auditor scripts that grep voice ids have to look in both files; auditing only one false-positives every id that lives in the other. *[ref: voice-orphan-audit-must-grep-both-surfaces | .claude/plugins/plugin_integrity/tests/test-voice-orphan-audit.sh:14-15,32 | The audit declares both surfaces explicitly: `HOOKS_VOICE="$PLUGIN_DIR/hooks/voice.xml"` (L14) + `SCRIPTS_VOICE="$PLUGIN_DIR/scripts/voice.xml"` (L15), then the comment at L32 says "Extract all element IDs from both voice.xml files using broader pattern." The auditor unions ids from both surfaces; auditing only one yields false-positives for ids that live in the other. The shared root-brain guidance in `.claude/CLAUDE.md` ("Voice Architecture" section) reinforces: "voice audits MUST grep BOTH hooks/voice.xml + scripts/voice.xml" — universal across the 10 plugins with dual surfaces.]*

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

**Soft vs hard at the element level.** Inside each voice.xml, the `<coaching>` element produces a context injection — probabilistic, the LLM may absorb or ignore it. The `<block>` element produces a refusal — exit-2 stderr that fails the agent's tool call. The two element types coexist in the same file. The Lock-13 over-engineering veto says: new behavioral controls start as coaching; only when measurement shows coaching consistently fails does the control harden into a block. *[ref: lock-13-over-engineering-veto-coaching-before-block | .claude/plugins/phase_condense/docs/principles.md:112 + .claude/plugins/phase_condense/docs/architecture-pattern.md:108,110 | architecture-pattern.md L108 states the principle: "if body_edits / (body_edits + footer_edits) is consistently low across cycles, future condense rounds may harden a Step 1 gate blocking `--force` when body-absorption is insufficient. Voice-first precedence — Lock 13 prohibits premature hardening." L110: "Cite: plan_condense_redesign.md Lock 9 + Lock 13." principles.md L112 anchors the same source. The pattern is plugin-wide brain-maturation policy: coaching first, hard block only after measurement justifies it.]*

**The yaml-injection pairing.** When a job reaches stage 3 of maturation (multi-cycle with `.yaml` plan, covered in [Essay 8](08-from-apprentice-to-architect.html)), the `.yaml` file's per-phase fields pair with voice ids by convention. The yaml field name maps to a voice id directly; voice-helper appends the matched value to the rendered voice text at phase entry. New yaml fields require no parser change — just add the matching voice id to the plugin's `hooks/voice.xml` and the seed agent picks up the new pairing on the next phase entry. *[ref: yaml-cognition-v2-path-c-auto-couples | .claude/knowledge/phasic_system/yaml-cognition-v2-architecture.md:29,51,83 | L29: "voice-helper.sh auto-couples yaml augmentation at render time. Plugins stay naive; yaml mentions voice ids directly; voice-helper appends yaml content to rendered voice text when the cache has a pairing." L51: "If a pairing exists, APPEND its value to the rendered text with a blank-line separator." L83: plan-sensor "calls get_voice(...) — those calls go through voice-helper which auto-appends yaml augmentation transparently. Plan-sensor doesn't see or know about yaml. Path C transparency." Confirms the contract: yaml keys ARE voice ids (no transformation), voice-helper does the coupling, plugin voices stay naive.]*

**The new-plugin lens.** When you guide your seed to add coaching for a new behavior, the seed writes the coaching string to `hooks/voice.xml` first (cheap, soft). If the operator later observes the coaching consistently fails to hold, the seed authors a `<block>` element in the same file for the hard variant — same id namespace, harder enforcement. The seed never invents a third voice surface. The two-file split is structural.

---

## `data.json` — The Hidden State

**What it is.** The plugin's private runtime state. The active focused job, the tier counter, the summary chain, the lock manifest. JSON-encoded, written atomically, lives only on the operator's machine, gitignored. *[ref: data-json-gitignored-per-machine | .claude/plugins/.gitignore:10-12 | The `.claude/plugins/.gitignore` file contains three lines: `**/data.json`, `**/data.json.lock`, `**/data.json.tmp` — gitignoring not only the state file itself but also its lockfile and temp file. The state is per-machine and never enters the repo; this is enforced at the plugin-tree level, not per-plugin, so every plugin inherits the discipline automatically.]*

**Who reads it.** ONLY the plugin's own scripts. No other plugin reaches into this file. The discipline is structural: cross-plugin queries route through the plugin's published read-only commands (`job.sh focused`, `phase.sh current`), never through `cat data.json` from outside.

**Who writes it.** ONLY the plugin's own scripts. Direct file-system writes are forbidden. Every mutation follows the same protocol: `flock` on a `/tmp/`-located lockfile (to handle concurrent access across hook fires) → read current state → transform with `jq` into a temp file → validate the temp with `jq empty` → atomic `mv` over the live file. The reader never sees a partial state. If parsing fails at read time, the gateway script rebuilds the file from defaults rather than blocking the agent. *[ref: data-json-flock-tmp-lockfile | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:39-44,81-83 | L39-43 comment: "Lockfile lives in /tmp/ to avoid polluting the repo's git status. Path-hashed from $DATA_FILE so each project gets a unique lock; flock is per-machine advisory so this is the correct scope." L44 defines the path: `LOCKFILE="/tmp/plugin-integrity${DATA_FILE//\//-}.lock"`. L81-83 declares the `flock_data` helper opening fd 9 on $LOCKFILE with `flock -w 5 9` (5-second timeout). On timeout, emits a `lock-acquisition-timeout` voice and exits 1.]*

**What it depends on.** The plugin's scripts (which mediate every read and write). The shared `lib/voice-helper/` (for error messages when validation or atomicity fails).

**Why the mandatory script-mediation.** Multiple subsystems may fire hooks against the same `data.json` within milliseconds of each other (e.g., two PreToolUse hooks from the same plugin both reading state). If both write directly to the file, one overwrites the other's update. The `flock` discipline serializes all mutations through the script gateway. Reads also go through scripts so corruption is handled fail-safe: when `data.json` is malformed, the script rebuilds rather than crashing the agent. *[ref: data-json-fail-safe-rebuild-on-malformed | .claude/plugins/phasic_system/scripts/phase.sh:85,92-94 | L85: `printf '%s\n' '{"jobs":[]}' > "$DATA_TMP_FILE"` — the default state. L92 emits the warning voice: "[phasic_system] WARNING: data.json was missing or corrupt — rebuilding state." L94 escalates to ERROR only if the rebuild itself fails: "[phasic_system] ERROR: failed to rebuild $DATA_FILE." The script chooses fail-safe-rebuild over fail-crash; the agent never gets blocked by a corrupt JSON state.]*

**The new-plugin lens.** When you guide your seed to add a plugin that needs state, the seed designs the state's *interface* first: what read commands does this plugin publish for other plugins (and the agent) to use? What mutation commands does this plugin publish for its own hooks to use? Then `data.json` becomes the cache the scripts operate on. Tell your seed: *if you cannot enumerate what reads each field and what writes each field, the design is not done yet.*

**The minimum-viable plugin shape.** A plugin without `data.json` is stateless — it carries no runtime bookkeeping. `question_discipline` is again the example: pure gate, no state, no `data.json`. The absence signals stateless enforcement. *[ref: question-discipline-fully-stateless | .claude/plugins/question_discipline/ | `ls .claude/plugins/question_discipline/` returns exactly: agents/, CLAUDE.md, docs/, hooks/, LICENSE, README.md, tests/ — NO scripts/, NO data.json, NO config.conf. The plugin is a pure PreToolUse gate on AskUserQuestion; it carries no state, exposes no CLI verbs, and tunes no thresholds. Pure-gate plugin shape is structural.]*

---

## `docs/` — The Documentation Layer + The Historian

**What it is.** A directory carrying the plugin's narrated knowledge. Three files are common across nearly every plugin:

- `docs/CLAUDE.md` — the docs/ directory's own descriptor; names the conventions docs/ files follow.
- `docs/evolution.md` — the plugin's auto-narrated history. Capped at 2000 words by a hard-enforced `PreToolUse` hook. The historian subagent writes this; the operator typically does not.
- `docs/principles.md` OR `docs/decisions.md` (depending on the plugin) — the overflow surface for design rationale that doesn't fit in evolution.md.

*[ref: evolution-md-universal-across-plugins | .claude/plugins/*/docs/evolution.md | `find .claude/plugins -name evolution.md -path "*/docs/*"` returns 14 hits — one per plugin (brain_guard, interaction_summary, job_archiver, job_blocker, job_core, phase_condense, phase_execute, phase_observe, phase_plan, phase_verify, phasic_system, plugin_integrity, question_discipline) PLUS the template at `plugin_integrity/template/docs/evolution.md` so newly-stamped plugins inherit the file at birth. The discipline is universal: no plugin ships without one.]*

**Who reads them.** The agent, especially at plugin unlock — the lock-manager auto-injects `docs/evolution.md` into the agent's context every time PLUGIN-LOCK is approved. This is how the editor inherits the plugin's reasoning before touching code. The historian subagent reads evolution.md when re-narrating new commits. New users read these to understand a plugin's lived history before customizing. *[ref: evolution-md-auto-injected-on-unlock | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh:6-9 | The hook's header docstring states the contract explicitly: "Blocks edits to docs/evolution.md that would push word count above MAX_EVOLUTION_WORDS (default 2000, configurable via plugin_integrity/config.conf). WHY: evolution.md is auto-injected to stderr on every plugin unlock. Unbounded [growth would exhaust the per-unlock context budget]." The cap exists BECAUSE the file is auto-dumped into the agent's context on every PLUGIN-LOCK approval — keeping the file lean preserves context budget per-unlock.]*

**Who writes them.** The historian subagent writes `docs/evolution.md` when dispatched by the drift-counter ratchet. The operator writes the sibling files (`docs/principles.md`, `docs/decisions.md`) through gmode — these surfaces are not under the same auto-narration discipline. *[ref: historian-drift-counter-ratchet | .claude/plugins/plugin_integrity/scripts/drift-check.sh:9-11 | The drift-check script's header contract: "every N git commits to the plugin, the historian must update [evolution.md] — no insertion thresholds — the historian is mandated to update on schedule." The historian-* subagents (one per plugin: historian-plugin-integrity.md, historian-brain-guard.md, historian-job-core.md, historian-interaction-summary.md, historian-question-discipline.md, historian-phasic-system.md, historian-phase-*.md) are dispatched when the per-plugin drift count crosses DRIFT_THRESHOLD (default 5, configurable via config.conf).]*

**What they depend on.** `docs/CLAUDE.md` (the descriptor that names the documentation conventions). The plugin's drift counter inside `data.json` (which fires the historian when drift exceeds threshold). The hard-cap hook (`evolution-cap.sh` inside plugin_integrity, which blocks any edit pushing evolution.md past 2000 words). *[ref: evolution-cap-2000-word-pretooluse-block | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh:37,58-59,108-110 | L37 sets the cap: `MAX_EVOLUTION_WORDS="${MAX_EVOLUTION_WORDS:-2000}"` (configurable but default 2000). L58-59 restricts the gate to ONE file: "Only police evolution.md — other docs/*.md files are uncapped per user directive" + `[[ "$FILE_PATH" != */docs/evolution.md ]] && exit 0`. L108-110 emit the BLOCK message via voice (`evolution-word-cap`) when an edit would push the word count over the cap. This is the canonical soft-vs-hard pairing: evolution.md hard-capped (PreToolUse exit 2); sibling docs uncapped (operator + historian judgment).]*

**The relationship between evolution.md and its siblings is the architectural heart of the documentation layer.** Evolution.md is the 2000-word summary; when the historian's narrative needs more depth, the cap forces overflow into a sibling file — `docs/principles.md` for architectural rationale, `docs/decisions.md` for specific design choices, `docs/lessons.md` for hard-won cycle lessons. The historian decides at narration time which sibling file each overflow chunk belongs in, and evolution.md becomes an index pointing at the siblings. This is the canonical example of soft-versus-hard discipline at the size-cap level: only `docs/evolution.md` carries a hard cap; the siblings absorb the overflow under the historian's judgment. *[ref: evolution-block-message-names-overflow-siblings | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh:110 | The BLOCK message itself NAMES the overflow surfaces: "consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md), THEN add your new entry." When the cap fires, the hook tells the editor exactly which sibling files to overflow into. The cap's behavior is the documentation contract.]*

**The new-plugin lens.** When you guide your seed to create a plugin, the seed authors the cycle-1 `docs/evolution.md` by hand — a short narrative of the plugin's birth, what concern it owns, what it doesn't own. The historian subagent takes over from cycle 2 onward, re-narrating each cycle's commits into evolution.md until it hits the cap. From there, overflow goes into `docs/principles.md` (or whichever sibling the plugin's docs/CLAUDE.md establishes). Tell your seed: *every plugin gets a historian by birth.* Without one, the plugin's memory dies with the operator's session.

---

## `agents/` — The Subagent Pool

**What it is.** A directory of subagent definitions the plugin owns. `historian-*` for evolution narration. `verify-*` for auditing. `condense-*` for waterfall routing. `observe-*` for research. Per-plugin scoping — every plugin owns the subagents it dispatches. *[ref: agents-dir-per-plugin-scoping | .claude/plugins/*/agents/ | `find .claude/plugins -name agents -type d` returns 11 dirs (5 phase plugins + phasic_system + plugin_integrity + brain_guard + question_discipline + job_archiver + job_blocker) — NOT every plugin, only those that delegate investigation. Each agents/ dir contains the plugin's owned subagents: phase_observe/agents/ has observe-codebase-explorer, observe-contradiction-finder, observe-dependency-mapper, observe-file-comparer, etc. plugin_integrity/agents/ has 12 historian-* subagents. Subagent names are name-spaced to their plugin (e.g., `observe-*`, `condense-*`, `historian-*`).]*

**Who reads them.** Claude Code, when the agent invokes a subagent by name. The agent itself reads only the subagent's frontmatter (description + tools) when deciding whether to dispatch.

**Who writes them.** CONDENSE step 5 (which consumes `[AGENT-UPDATE]` markers). PLUGIN-LOCK as the underlying gate. *[ref: condense-step-5-agent-update-marker | .claude/plugins/phase_condense/agents/CLAUDE.md:10,44,54 + .claude/plugins/phase_condense/scripts/voice.xml:12 | agents/CLAUDE.md L10 names the worker: "**condense-agent-updater** | Use when: applying [AGENT-UPDATE] markers from..." L44 specifies the protocol: "parse `[AGENT-UPDATE]` marker → Glob + realpath symlink resolve → Edit correct section." L54 establishes the cycle: "CONDENSE step 5 (condense-agent-updater) reads these blocks and applies updates to the agent .md file in a subsequent cycle. The agent does not edit its own definition — that loop is gated by CONDENSE's waterfall." condense voice.xml L12 confirms the marker class in operator-facing coaching: "[AGENT-UPDATE] harden the subagent def."]*

**What they depend on.** The plugin's own `scripts/` (for tools the subagent calls). The plugin's `lib/` if it ships one. The agents in this directory are NOT cross-plugin — each subagent is scoped to its owning plugin's surface.

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

**Why per-plugin scoping.** The safe-lock cycle inside `plugin_integrity` requires that only one plugin be unlocked at a time. A subagent that ranged across multiple plugins would need to coordinate locks across every directory it touches, defeating the unlock discipline. Per-plugin scoping makes the subagent's surface match the lock boundary exactly.

**The 80/20 dispatch budget.** The architecture insists on roughly 80% of cognitive work happening in subagents and 20% in the main session. Inside EXECUTE phase, this is mechanized: every `execute-*` subagent dispatch grants the main session three units of direct-action budget; every non-`.claude/` file edit consumes one. The 80/20 is not a guideline; it is a budget the main session must earn. *[ref: execute-direct-action-budget-3-per-dispatch | .claude/plugins/phase_execute/hooks/execute-tracker.sh:29,358,365 + .claude/plugins/phase_execute/scripts/voice.xml:45 | execute-tracker.sh L29 documents the contract: "Budget Grant Model: Launched execute-* subagents earn +3 direct-action budget grants." L358: "for execute phase) get +3 direct-action budget grants. Grants are the ONLY way to [earn project-file edit budget]." L365: "Budget: grant +3 direct actions per execute-* subagent launch." scripts/voice.xml L45 surfaces the rule in coaching: "Each execute-* subagent launch grants +3 direct-action budget for file edits. Budget consumed -1 per non-claude/ edit. Stay aware: you're trading budget for execution surface." execute-guard.sh L387 emits the BLOCK voice when budget exhausted: "Direct action budget exhausted. Launch an execute-* subagent to earn +3 budget."]*

**The new-plugin lens.** When you guide your seed to add a plugin that needs delegated investigation, the seed authors subagent definitions inside the plugin's own `agents/` directory. Not in a global pool. Tell your seed: *a subagent that lives outside its owning plugin breaks the lock discipline; keep it local.* A plugin that does not delegate investigation skips `agents/` entirely — `job_core` and `interaction_summary` both ship without one because their concerns are local state machines, not research surfaces. *[ref: agents-dir-skipped-by-stateful-plugins | .claude/plugins/job_core/ + .claude/plugins/interaction_summary/ | `find .claude/plugins -name agents -type d` confirms job_core and interaction_summary are absent from the result set; both plugins ship hooks/, scripts/, docs/, tests/ but NO agents/ dir because their concerns (job lifecycle state, summary chain) are mutations on local data.json, not research surfaces requiring delegated investigation. The absence is structural: plugins that DO delegate research (phase_observe, phase_verify, plugin_integrity historians) ship agents/; plugins that mutate state in place do not.]*

---

## The Smaller Organs

A few smaller organs round out the kit. They carry less load but are still load-bearing for specific plugins.

**`config.conf`** — the operator's tuning surface. Environment-style `KEY=value` lines for thresholds the plugin exposes for adjustment. `SOFT_THRESHOLD_TIER=20`, `MAX_EVOLUTION_WORDS=2000`, `DRIFT_THRESHOLD=10`. Read by scripts and hooks at fire time. Written by the operator (sometimes through gmode, sometimes directly). Most plugins carry one; `question_discipline` does not because it has no tunable thresholds.

**`tests/`** — the plugin's self-test suite. Read by the safe-lock cycle at the lock boundary; written through the `[TEST-LOCK]` ceremony, a finer-grained gate distinct from `[PLUGIN-LOCK]`. Every plugin ships tests; a plugin without them cannot survive the safe-lock cycle's commit-or-revert discipline.

**`template/`** — the plugin's birthing surface. Only six plugins carry one (`plugin_integrity` plus the five phase plugins) because those are the plugins that *create* new instances of something. Read by `lock-manager.sh` at plugin-birth time when stamping a new plugin from the template.

**`e2e/`** — only `phasic_system` carries this. End-to-end tests that exercise the full OPEVC cycle across multiple phases. Because no other plugin sees the cycle in its entirety, no other plugin needs `e2e/`.

**`LICENSE` + `README.md`** — open-source migration-readiness signals. Plugins carrying both are ready for the public seed agent; plugins not yet carrying them are still maturing in the prototype.

---

## `.claude/settings.local.json` — The Brain-Root Wiring

**What it is.** A single JSON file at the brain root (`.claude/settings.local.json`) that pairs Claude Code event names with hook script paths across every plugin. The wiring file is NOT inside any plugin — it lives outside.

**Who reads it.** Claude Code, at session start. Claude Code uses this file to decide which hooks fire on which events for the whole brain.

**Who writes it.** The operator, when installing or removing a plugin. The seed agent itself, when CONDENSE step 3 creates a new plugin via the birth ceremony (which adds the new plugin's hook registrations as part of the stamp).

**What it depends on.** Each plugin's `hooks/*.sh` paths. If a plugin's hook script exists at the right path but `settings.local.json` does not list it, the hook is dead code.

**The architectural rule.** The brain registers plugins; plugins do not self-register. This is what makes the cell wall meaningful: the brain decides what's active, the plugins fill in what they own. New-plugin lens: when you guide your seed to add a new plugin, the *last* step before the plugin is alive is updating `settings.local.json` to register the new hooks. The plugin can be perfectly authored — every organ in place, every test green — and still inactive if the brain has not wired it in.

---

## The Lock Ceremony — How Plugins Stay Safe

Plugin code does not get edited the way ordinary files do. Each plugin's hooks, scripts, tests, and code-bearing files have earned their current shape; the test suite enshrines that shape; any change pays the cost of opening the plugin, editing inside it, and re-passing the tests before the change commits.

**The ceremony has four parts.**

**`[PLUGIN-LOCK]`** opens an edit session. The agent issues a structured `AskUserQuestion` prefixed `[PLUGIN-LOCK] <plugin_name>` with a 100-word body explaining what flaw is being fixed, what files will be touched, and what the plugin's behavior will look like before vs after the edit. The operator approves; `lock-manager.sh` captures a `git rev-parse HEAD` SHA as `checkpoint_ref` and writes the unlocked plugin name into `plugin_integrity`'s hidden `data.json`. From that moment, edits inside the unlocked plugin proceed; edits anywhere else under `.claude/plugins/` are rejected.

**`[TEST-LOCK]`** opens a finer-grained sub-session inside an already-unlocked plugin. By default, the unlocked plugin's `tests/` directory is also frozen. To edit a specific `test-*.sh` file, the agent issues `[TEST-LOCK] <test_file>`. The reason: it is too easy to silently rewrite a correctly-failing test to make a broken change look passing. Test edits demand explicit, named permission.

**Safe-lock close-out** runs the test suite at the lock boundary. The agent invokes `lock-cmd.sh` when edits are done; the full plugin test suite runs; on PASS the change commits and the lock clears; on FAIL the working tree rolls back to the captured `checkpoint_ref`, the plugin's hidden state records a structured revert entry, and a voice line writes to the operator's terminal. The agent does not get to ship a plugin change that breaks the plugin's own self-test.

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

**The historian ratchet** can refuse the lock entirely. Each plugin keeps the 2000-word-capped `docs/evolution.md` narrative discussed above; `drift-check.sh` counts commits landed against the plugin since evolution.md was last touched. If drift exceeds threshold, `lock-manager.sh` rejects the `[PLUGIN-LOCK]` approval and tells the agent to dispatch the plugin's historian subagent first. The historian re-narrates the cycles since last sync, commits the refreshed evolution.md, and the drift counter resets. Only then does the lock open. A plugin cannot be edited indefinitely without periodically forcing its own history to be re-told.

**Gmode-only for existing plugins.** Editing an existing plugin requires the operator to enter gmode first (`[GMODE]` with a 100-word justification). New plugin creation is different — that is a full multi-cycle OPEVC job with its own cycle-1 PLUGIN-LOCK. The asymmetry codifies a real distinction: editing existing plugin code alters the agent's own enforcement substrate, which is meta-cognitive work that belongs outside normal OPEVC cycles. Creating a new plugin fits inside an OPEVC cycle because the new plugin's code is being authored, not modified.

**The four parts form a closed loop where the only way to evolve a plugin is to have already understood it.** PLUGIN-LOCK forces the operator-approved entry. TEST-LOCK forces deliberate test edits. Safe-lock forces test-passing or revert. The historian ratchet forces narrative sync. Plugin_integrity itself follows the same ceremony when its own hooks are edited — there is no privileged path.

---

## Tier-3 Close: How a New User Guides Their Seed to Create a Plugin

This is the section new users come back to.

When you install the public seed agent on your laptop and start running it, every job you point it at is a single-cycle OPEVC job at first ([Essay 8](08-from-apprentice-to-architect.html) covers the four maturation stages). The seed is in *learning mode* — it asks questions, takes its time, builds experiential data from your work. When a job recurs and the seed has learned its shape, the job graduates to multi-cycle. When the multi-cycle plan stabilizes, the job graduates to a `.yaml` plan that injects job-specific context at every phase entry. And eventually — for jobs whose phase cognition needs customization beyond context injection — the job *itself* becomes a plugin.

That is one path to a new plugin: a job that has matured through all three earlier stages and now needs phase-cognition customization the voice injection cannot deliver.

The other path is direct: you notice a gap in the seed's substrate and tell the seed to fix it. The seed treats this as a single-cycle DEEP job at first: OBSERVE asks you questions about the gap, PLAN designs the new plugin's concern and organ list, EXECUTE stamps the template and fills in the substance, VERIFY runs the new plugin's test suite, CONDENSE absorbs the lessons into the knowledge layer. The seed performs the PLUGIN-LOCK ceremony at the moment EXECUTE needs to begin writing code; once approved, the lock-manager stamps the universal template at `.claude/plugins/<new_name>/`, substitutes the plugin name into the placeholders, generates the plugin's `historian-<name>` subagent definition, and auto-commits the birth as the drift baseline.

**The substance the seed fills in** follows the organ-by-organ shape covered earlier. CLAUDE.md first (the concern declaration). Hooks second (the reflexes). Scripts if the plugin publishes a CLI. Tests covering each hook and script. Voice files for the messages. `docs/evolution.md` for cycle-1 narration. The seed asks you to confirm at each step because in this stage of maturation, the seed is still learning your design preferences.

**The two-lock pattern for phase plugins.** If the new plugin extends the phase system (e.g., a new `phase_research` between OBSERVE and PLAN), one lock builds the cell, and a *second* lock on `phasic_system` updates the orchestrator's forward and backward edge maps so the new phase routes correctly. Adding a cognitive organ takes two ceremonies: one to author the organ, one to wire it into the body. New users should not be surprised by this — most plugin systems make wiring invisible; this architecture makes wiring explicit.

**The knowledge dir is the part most plugin tutorials skip.** When the seed authors a new plugin, the seed *also* authors the plugin's knowledge directory at `.claude/knowledge/<plugin_name>/`. This is where the plugin's deep self-knowledge lives — the architectural rationale, the operating patterns, the lessons captured across cycles. The public seed agent ships every active plugin's knowledge directory along with the plugin code, so every operator's seed has the same depth of recall. Future OBSERVE phases will recall these knowledge files when the agent encounters work touching this plugin. **Tell your seed: every new plugin gets a knowledge directory by birth, not as an afterthought.** Without it, the plugin migrates to the public repo as code without context; with it, the public seed agent can teach new operators how to think about that plugin's concern.

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

**Once the lock closes, the plugin is born — but not yet alive.** The brain has to register the hooks via `settings.local.json` (covered above). Inside the same EXECUTE phase the seed updates the settings file. Once the brain rereads on the next session start, the new plugin's reflexes fire. CONDENSE then absorbs the cycle's lessons, the historian writes the cycle-1 evolution.md, and the plugin enters its life.

**The honest framing.** This is not a couple of editing sessions. A real new phase plugin is closer to a multi-cycle deep job: several editing sessions for the guard logic, more for the tracker and sensor, a hundred-plus lines of voice across hooks/ and scripts/, twenty to thirty test assertions across half a dozen test files, plus the orchestrator update for the two-lock pattern. The kit's gift is that the work is *bounded*, not that the work is small. Every file has a purpose, every purpose is named, and the safe-lock cycle keeps every step honest.

What makes the work feel different from a from-scratch build is that the operator and seed are not inventing the structure. The cell template knows what cognitive organs every plugin needs. The operator's seed is filling each organ with the substance for *this* plugin's concern. New users guide that filling-in through conversation; the seed records the conversation, learns the operator's preferences, and over time, the operator's seed becomes one that knows *how the operator wants plugins shaped*.

---

## What Comes Next

The kit gives the brain the *capacity* to grow. The phases give the brain compartmentalized cognition. The bus gives the brain durable substrate.

Three essays in, what we have is a working seed agent: not a finished product, but a living architecture that knows how to evolve itself.

The kit is in your hands. What does growth LOOK like when you use it over time? Next.

---

*Essay 7 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
*Next: [From Apprentice to Architect](08-from-apprentice-to-architect.html) — job formats, the maturation arc, and the seed's hand-off.*
