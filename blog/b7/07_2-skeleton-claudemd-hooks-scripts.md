---
title: "Skeleton: CLAUDE.md, Hooks, and Scripts"
date: "May 2026"
slug: "skeleton-claudemd-hooks-scripts"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Hooks, Scripts]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# Skeleton: CLAUDE.md, Hooks, and Scripts

*Essay 7.2 — The Plugin Kit, Part 2 of 9.*

---

[Essay 7.1](07_1-plugin-kit-foundation.html) framed the plugin as a cell — a system of cognitive organs that read each other, write to each other, and depend on each other through declared channels. Every organ carries the same three properties: *who reads it*, *who writes it*, *what it depends on*. This sub-essay opens the universal-skeleton organs every plugin in the prototype must have and names those properties at each step.

---

## `CLAUDE.md` — The Plugin's Brain Surface

**What it is.** A markdown file at the root of every plugin directory — the plugin's primary memory surface, declaring what the plugin owns, what its hooks fire on, what its size limits are, what its current version is. Every plugin carries one — there is no exception. The file is the agent's primary read at session start and at every moment the plugin becomes relevant to the work. *[ref: every-plugin-carries-claude-md | .claude/plugins/CLAUDE.md | Plugin Structure Convention section shows "CLAUDE.md # Working memory — objective, state, maintenance rules" as the FIRST entry under every plugin; the section's closing Minimum Plugin Shape note confirms "Minimal plugin: just CLAUDE.md" — the no-exception baseline. Together these establish CLAUDE.md as the universal plugin surface.]*

**Who reads it.** The LLM, mostly. Claude Code reads CLAUDE.md files into the agent's working memory at session start. When a plugin is unlocked for editing, the unlock ceremony auto-injects the plugin's CLAUDE.md (along with `docs/evolution.md`) so the editor inherits the plugin's reasoning before changing anything. Other plugins reading this plugin's CLAUDE.md happens rarely and almost always for one-line cross-references, not deep parsing. *[ref: unlock-ceremony-auto-injects-context | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:351-380 | Unlock handler reads `docs/evolution.md` into `context_msg` (L356-358) + emits an `objective-alignment` guidance voice telling the editor to read `$target/CLAUDE.md` (L369); the combined message ships via `PostToolUse additionalContext` JSON (L380), injecting plugin reasoning before any edit lands.]*

**Who writes it.** The CONDENSE phase. By design, CLAUDE.md edits route through CONDENSE because that is the only phase whose guard permits writes to the brain layer. The operator can also touch CLAUDE.md directly via gmode for existing-plugin work — a deliberate escape hatch for fixes outside the cycle ceremony. *[ref: condense-only-md-write-allowlist | phase_condense/hooks/condense-guard.sh:249-250 | Comment on L249 ("Condense can edit .md files AND voice.xml — soft memory layer") + L250 allowlist `if [[ "$FILE_PATH" == *.md ]] || [[ "$(basename "$FILE_PATH")" == "voice.xml" ]]; then` — execute-guard.sh L728 blocks the same writes with `block "root-brain-blocked"`. CONDENSE alone permits brain-layer writes.]*

**What it depends on.** Almost nothing inside the plugin. CLAUDE.md is the surface; other organs depend on *it*, not the reverse. The single exception is the four phase-section anchors at the bottom (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) which the section-boundary guard reads to decide where each phase may write. *[ref: phase-anchor-section-boundary-parse | lib/section_guard/section-check.sh:252-260 | The `case "$phase_anchor" in` block maps the four anchors (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) to their section_line numbers, then downstream logic enforces edits land strictly below the active phase's anchor line.]*

**The new-plugin lens.** When you guide your seed agent to create a new plugin, the first artifact the seed authors is CLAUDE.md. The seed declares the plugin's single concern, names the hooks it will register, lists its size limits, and stamps version `v0.1.0`. Every other organ inside the plugin will reference choices made here. If CLAUDE.md does not name the concern clearly, the rest of the plugin drifts. New-user guidance: tell your seed to write CLAUDE.md FIRST, then the hooks, then everything else. *[ref: new-plugin-template-claude-md-first | plugin_integrity/template/CLAUDE.md:1-3 | New-plugin scaffold begins with `# {{PLUGIN_NAME}}` + `**Version:** v0.1.0` + "Plugin directory. To be defined." — the template `[PLUGIN-LOCK]` copies on plugin creation (per the Plugin Template section + its Plugin birth process subsection in `.claude/plugins/CLAUDE.md`: "the template is copied and {{PLUGIN_NAME}} + {{DATE}} are replaced... Template files copied (CLAUDE.md + docs/evolution.md)"). CLAUDE.md ships first; every other organ added afterward.]*

---

## `hooks/` — The Reflexes

**What it is.** A directory of small shell scripts that fire on Claude Code events: `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SubagentStart`, `SubagentStop`. Hooks are how the plugin reaches the agent's cognitive process from outside the LLM. They are pure shell, executing in milliseconds, returning exit codes that decide whether the call proceeds. *[ref: hooks-fire-on-claude-code-events | .claude/settings.local.json | The top-level `hooks` object groups bash commands under exactly these event keys — `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SubagentStart`, `SubagentStop` — each containing one or more `{matcher, hooks:[{type:"command", command, timeout}]}` entries. Every plugin hook and shared `lib/` utility registers under one of these seven events.]*

**The one rule every hook obeys: fail toward the safe outcome.** A hook is a guard standing in front of the agent's own tools, so a bug in the guard is a bug that could freeze the whole seed agent. The kit answers this with a four-part behavioral contract. Every hook must reach a deliberate exit code — never an accidental crash. Block messages go out on standard error, the channel the agent reads. Exit zero means allow; exit two means block. And any internal failure — a missing file, a parse error, an absent config — falls toward the safe outcome, which is almost always *allow*. A guard's own breakage can never be the thing that stalls the work. The phase guards take this so seriously that they deliberately skip strict shell mode, each carrying the header note that the hook "must always reach exit." *[ref: fail-safe-allow-hook-contract | phase_observe/hooks/observe-guard.sh, phase_plan/hooks/plan-guard.sh, phase_verify/hooks/verify-guard.sh, phase_execute/hooks/execute-guard.sh, phase_condense/hooks/condense-guard.sh + brain_guard/hooks/context-gate.sh | Each phase guard's header reads "NO set -euo pipefail — hook must always reach exit" (execute-guard's is "NO set -euo pipefail (Critical Design)"). context-gate.sh comments the default: on a measurement failure it exits 0 because "Better to over-permit than to block work we cannot justify blocking." Stderr carries block messages; exit 0 = allow, exit 2 = block.]*

**The deliberate exception.** One guard flips the default on purpose: the stop gate that decides whether the agent may finish. If its state file is corrupted, it blocks rather than allows — because letting the agent stop on top of unverifiable job state is itself the unsafe outcome, the one that quietly loses work. The rule is not "always allow." The rule is "fail toward the safe outcome," and for the stop gate, blocking is safe. *[ref: stop-gate-fail-safe-block | job_core/hooks/stop-gate.sh | Header: "FAIL-SAFE: corrupted JSON → BLOCK." On a JSON validation failure the gate emits the corrupted-data block message to stderr and `exit 2`s — the deliberate inversion of the usual fail-toward-allow default, because stopping with unverifiable job state would lose work.]*

**Who reads them.** Claude Code itself, at event time. The agent never reads its own hooks during reasoning — the hooks are invisible to the LLM unless one of them emits a voice into the context. *[ref: hooks-registered-via-settings-local | .claude/settings.local.json:5-15 | Hook registry shape: `"hooks": { "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "bash .claude/plugins/job_core/hooks/prompt-handler.sh", "timeout": 10 }] }] ... }` — Claude Code reads this file at session start, executes the matching `command` at each event. The LLM never reads it.]*

**Who writes them.** The `[PLUGIN-LOCK]` ceremony. Plugin code is not edited the way ordinary files are — every change passes through a deliberate unlock cycle, runs the plugin's test suite at the lock boundary, and reverts to a captured git checkpoint on test failure. *[ref: safe-lock-test-pass-or-revert | plugin_integrity/scripts/safe-lock.sh:3,211-222 | Header comment (L3): "Locks a plugin: run tests → pass: commit + lock / fail: revert + lock"; the body iterates the plugin's test files (L211 `all_pass=true`) and sets `all_pass=false` on any failure (L222), then branches: pass → `git commit`, fail → `git reset --hard $checkpoint`. Plugin code cannot land without this gate.]*

**What they depend on.** A small set of sibling organs: `scripts/` (when a hook needs to invoke the plugin's own CLI for state mutation), `hooks/voice.xml` (for every message the hook emits to the agent's context), `data.json` (for state, but only read-mediated through the plugin's own scripts — never directly), and a shared helper at `.claude/plugins/lib/voice-helper/` (the `get_voice` substitution function). *[ref: plugin-structure-convention-organ-tree | .claude/plugins/CLAUDE.md | The Plugin Structure Convention section lists each organ with its role: `hooks/` "(registered in settings.local.json)", `scripts/` "Internal scripts called by hooks", `data.json` "Runtime state (protected from direct edits)". Voice-helper lives at `.claude/plugins/lib/voice-helper/voice-helper.sh` (lib/CLAUDE.md L15: `get_voice <id>` reads voice from XML, used by "Any hook/script with voice.xml").]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/skeleton-and-wiring-b7-2.png
  Concept: Chalk-on-blackboard sketch — a plugin "cell" showing the universal skeleton inside the cell wall, conditional cognitive organs in a secondary tier, and the brain-root wiring file labeled outside the cell.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for organ fills (cyan, green, orange, pink, magenta — same palette as the cycle image, with darker variants used as a second tier);
  white chalk for ALL labels, arrows, and the cell-wall outline; faint chalk dust at the edges; a couple of chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal file and folder names listed below. Do not invent or substitute any other names, paths, or organ descriptors.
  Layout: One large hand-drawn chalk circle takes up most of the board — the "cell wall". Above the circle, a white-chalk header reads exactly ".claude/plugins/<plugin_name>/" (treat the angle brackets as literal text). Inside the circle, eleven small chalk shapes arranged around the interior, each labeled IN WHITE CHALK with its exact file or folder name. Six of them are drawn with a SOLID chalk border (universal skeleton); five are drawn with a DASHED chalk border (conditional organs):
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
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.2. Universal skeleton (solid border) plus conditional organs (dashed). The wiring file lives at brain root, outside the cell."
-->

**The new-plugin lens.** When you guide your seed to create a plugin, the seed decides which Claude Code events the plugin needs to fire on, and authors one hook per event. A plugin with no hooks is dead — every active plugin has at least one. The final activation step is operator-controlled registration in the brain-root `settings.local.json` (covered in [Essay 7.7](07_7-smaller-organs-and-wiring.html)); the seed can assist, but the plugin does not self-register. Without registration, the file is just a shell script on disk that nothing invokes. A research lab could install a `[PROTOCOL-CHECK]` plugin whose hooks/ fires on every `[IRB-RELEVANT]` question; scripts/ exposes `protocol.sh validate` for downstream auditors. Same skeleton, same edit-gate; different concern. *[ref: hook-registration-required-for-fire | .claude/plugins/CLAUDE.md | Plugin Structure Convention section annotates `hooks/` with "Hook scripts (registered in settings.local.json)" — the registry at `.claude/settings.local.json` is the only path from shell script on disk to event-time invocation. A hook file with no matching registry entry never runs.]*

---

## `scripts/` — The Verbs

**What it is.** A directory of internal CLI scripts the plugin publishes for the agent (or another plugin) to call. `phase.sh advance`. `plan.sh set-plan-file`. `safe-lock.sh`. `drift-check.sh`. Scripts are how the plugin lets the agent or other plugins talk to it through a stable interface. *[ref: plugin-cli-scripts-exist | .claude/plugins/CLAUDE.md | Plugin State Model section names four call modes (Public read, Public write, Hook read, Hook write) — public arms the agent calls directly (e.g. `observe.sh altered-list`) and `--hook` arms reserved for other scripts — confirming `<plugin>/scripts/*.sh` is the stable CLI interface. The cited scripts (phase.sh, plan.sh, safe-lock.sh, drift-check.sh) all exist at their plugin's `scripts/`.]*

**Who reads them.** The agent, when it invokes a command. Other plugins, when they query this plugin's state via its published read-only commands. The hooks of *this* plugin, when they need to mutate `data.json` (the only path to mutation is the plugin's own scripts). *[ref: data-json-only-via-scripts | .claude/plugins/CLAUDE.md | Plugin State Model section states the hidden-state principle ("data.json is hidden internal state. The agent cannot read or edit it directly. All access through the plugin's own scripts"), and its enforcement subsection adds: "Direct edits blocked by plugin_integrity (Edit/Write/MultiEdit on data.json)", "Direct reads blocked by plugin_integrity (Read tool + Bash cat/jq/head/grep on data.json)". Mutation only via the plugin's own scripts.]*

**Who writes them.** Same `[PLUGIN-LOCK]` ceremony as hooks. Scripts and hooks share the same edit gate because both are code. *[ref: plugin-lock-covers-all-code-organs | .claude/plugins/plugin_integrity/scripts/lock-cmd.sh + plugin_integrity/CLAUDE.md "How to Use" section | The lock-cmd.sh handler toggles `unlocked_plugin` in `data.json` regardless of which code subdirectory inside that plugin is being edited — `hooks/` and `scripts/` are both governed by the same lock-state. The How-to-Use section explicitly enumerates the edit ceremony covering both: open-lock → edit any code file → safe-lock runs tests → commit-or-revert. There is no per-subdirectory granularity in the gate.]*

**What they depend on.** `data.json` (the script either reads it or atomically mutates it via the read-under-flock + jq-transform + temp-validate + atomic-mv protocol). `voice.xml` (for messages to whoever called the script). `config.conf` (for operator-tunable thresholds). The `lib/voice-helper/` shared helper. *[ref: data-json-atomic-write-protocol | phasic_system/scripts/phase.sh:70-81,116 | The `safe_write` function (L116) implements the atomic mutation pattern: jq writes to `$DATA_TMP_FILE` (`$DATA_FILE.tmp`) → `jq empty` validates JSON shape (L77) → if valid, `mv "$DATA_TMP_FILE" "$DATA_FILE"` atomically replaces (L81); on validation fail, the temp file is removed (L78). Every plugin's data.json mutator uses this same pattern.]*

**The Distributed Job Extension pattern.** Other plugins reach into this plugin only through these scripts — never through the raw `data.json`. The plugin's public read-only commands (`job.sh focused`, `phase.sh current`) are the entire cross-plugin contract. Direct `cat data.json` from outside the owning plugin is forbidden discipline. New-user guidance: when you guide your seed to write a plugin that wants to know about another plugin's state, tell the seed to call the other plugin's `*.sh` command, not to peek at its files. The seed's own knowledge layer reinforces this — every plugin's knowledge dir names its public-API commands explicitly so future cycles can find them. *[ref: distributed-job-extension-cross-plugin | .claude/plugins/CLAUDE.md | Plugin State Model section's enforcement subsection states: "Direct reads blocked by plugin_integrity (Read tool + Bash cat/jq/head/grep on data.json)"; its design-principle subsection adds: "Plugins are organs with hidden state. The agent queries the organ through defined commands. Some fields have no public read command at all — completely hidden from the agent." Cross-plugin contract is the published `*.sh` commands only.]*

**The minimum-viable plugin shape.** Not every plugin needs `scripts/`. `question_discipline` ships none — it is a pure-gate plugin that does not publish CLI verbs. A plugin without `scripts/` is announcing: *I do not expose verbs; I only enforce.* The absence is itself information. *[ref: question-discipline-no-scripts-dir | .claude/plugins/question_discipline/ | The plugin directory contains `hooks/` (the AskUserQuestion gate) + `tests/` + `CLAUDE.md` + `docs/` — but no `scripts/` subdirectory. Plain `ls` of the plugin proves the absence. The Minimum Plugin Shape note at the close of Plugin Structure Convention in `.claude/plugins/CLAUDE.md` confirms: "Not all directories required. Minimal plugin: just CLAUDE.md."]*

---

The skeleton organs share one edit gate. CLAUDE.md is the brain surface; hooks are the reflexes; scripts are the verbs when a plugin exposes verbs. The core skeleton ships together, while organs like `scripts/` can be intentionally absent for pure-gate plugins. Edits to the plugin substrate still pass through the same PLUGIN-LOCK ceremony. The gate is friction — gmode bypasses it deliberately, and coverage gaps in the plugin's own tests let bad edits through. *[ref: shared-edit-gate-friction-not-math | plugin_integrity/scripts/lock-cmd.sh + plugin_integrity/scripts/safe-lock.sh + phasic_system/hooks/gmode-gate.sh | PLUGIN-LOCK serializes every code-organ edit through `lock-cmd.sh`'s state toggle (one unlocked plugin at a time per plugin_integrity); `safe-lock.sh:3` headers the test-pass-or-revert wrap ("Locks a plugin: run tests → pass: commit + lock / fail: revert + lock"); gmode-gate.sh:66-82 admits the deliberate bypass when the operator types `[GMODE]` with a sufficient justification body. Coverage gaps are honest: if the plugin's tests don't catch a regression, safe-lock cannot revert it.]* The next sub-essay opens the organ that almost every plugin doubles — `voice.xml`, once for the LLM and once for the operator.

---

*Essay 7.2 — The Plugin Kit, Part 2 of 9.*

*Previous: [Essay 7.1 — Plugin Kit Foundation](07_1-plugin-kit-foundation.html) — cell-as-system frame and the mini-series roadmap.*
*Next: [Essay 7.3 — The Dual Voice Architecture](07_3-dual-voice-architecture.html) — two voice.xml files, one for the LLM and one for the operator.*
