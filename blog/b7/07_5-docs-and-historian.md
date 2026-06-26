---
title: "docs/ and the Historian"
date: "May 2026"
slug: "docs-and-historian"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Historian, Evolution]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# `docs/` and the Historian

*Essay 7.5 — The Plugin Kit, Part 5 of 9.*

---

[Essay 7.4](07_4-data-json-hidden-state.html) opened the data organ — private, script-mediated, mutation-serialized. This sub-essay opens the *documentation* organ — the surface where the plugin carries its own narrated history, what it learned across cycles, why it was shaped the way it was. The hidden state is what the plugin knows about itself *right now*; `docs/` is what it remembers about *how it got here*.

---

## `docs/` — The Documentation Layer + The Historian

**What it is.** A directory carrying the plugin's narrated knowledge. These files are common across nearly every plugin:

- `docs/CLAUDE.md` — the docs/ directory's own descriptor; names the conventions docs/ files follow.
- `docs/evolution.md` — the plugin's auto-narrated history. Capped (currently 2000 words in the prototype, configurable via `config.conf`) by a hard-enforced `PreToolUse` hook. The historian subagent writes this; the operator typically does not.
- `docs/principles.md` OR `docs/decisions.md` (depending on the plugin) — the overflow surface for design rationale that doesn't fit in evolution.md. *[ref: evolution-md-universal-across-plugins | .claude/plugins/*/docs/evolution.md | `find .claude/plugins -name evolution.md -path "*/docs/*"` returns 14 hits — one per plugin (brain_guard, interaction_summary, job_archiver, job_blocker, job_core, phase_condense, phase_execute, phase_observe, phase_plan, phase_verify, phasic_system, plugin_integrity, question_discipline) PLUS the template at `plugin_integrity/template/docs/evolution.md` so newly-stamped plugins inherit the file at birth. The discipline is universal: no plugin ships without one.]*

**Who reads them.** The agent, especially at plugin unlock — the lock-manager auto-injects `docs/evolution.md` into the agent's context every time PLUGIN-LOCK is approved. This is how the editor inherits the plugin's reasoning before touching code. The historian subagent reads evolution.md when re-narrating new commits. New users read these to understand a plugin's lived history before customizing. *[ref: evolution-md-auto-injected-on-unlock | .claude/plugins/plugin_integrity/hooks/lock-manager.sh (PostToolUse unlock branch — the D44-fix `evo_section` emit) | On a PLUGIN-LOCK unlock the hook reads the plugin's `docs/evolution.md` into an `evo_section`, folds it into a `context_msg` block, and delivers it to the agent via `hookSpecificOutput.additionalContext` JSON on stdout. (PostToolUse stderr from an exit-0 hook is silently dropped by Claude Code, so `additionalContext` is the only channel that reaches the agent's context.) That emit IS the auto-injection. A sibling cap in `evolution-cap.sh` bounds the file's word count precisely because it is dumped into context on every unlock — keeping it lean preserves the per-unlock context budget.]*

**Who writes them.** The historian subagent writes `docs/evolution.md` when dispatched by the drift-counter ratchet. The operator writes the sibling files (`docs/principles.md`, `docs/decisions.md`) through gmode — these surfaces are not under the same auto-narration discipline. *[ref: historian-drift-counter-ratchet | .claude/plugins/plugin_integrity/scripts/drift-check.sh — header contract | The drift-check script's header contract: "every N git commits to the plugin, the historian must update [evolution.md] — no insertion thresholds — the historian is mandated to update on schedule." The historian-* subagents (13 total — one per plugin): twelve live centralized in `plugin_integrity/agents/` (historian-brain-guard, historian-interaction-summary, historian-job-archiver, historian-job-blocker, historian-job-core, historian-phase-condense, historian-phase-execute, historian-phase-observe, historian-phase-plan, historian-phase-verify, historian-phasic-system, historian-plugin-integrity); `question_discipline` owns its own at `question_discipline/agents/historian-question-discipline.md`. Each is dispatched when its plugin's drift count crosses DRIFT_THRESHOLD (default 10, configurable via config.conf).]*

**What they depend on.** `docs/CLAUDE.md` (the descriptor that names the documentation conventions). The plugin's drift counter inside `data.json` (which fires the historian when drift exceeds threshold). The hard-cap hook (`evolution-cap.sh` inside plugin_integrity, which blocks any edit pushing evolution.md past the configured cap). *[ref: evolution-cap-2000-word-pretooluse-block | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh — # Source config section (MAX_EVOLUTION_WORDS) + # Only police evolution.md guard + # If the edit would push past the cap, block section | The # Source config section sets the cap: `MAX_EVOLUTION_WORDS="${MAX_EVOLUTION_WORDS:-2000}"` (configurable but default 2000). The # Only police evolution.md guard restricts the gate to ONE file: "Only police evolution.md — other docs/*.md files are uncapped per user directive" + `[[ "$FILE_PATH" != */docs/evolution.md ]] && exit 0`. The # If the edit would push past the cap, block section emits the BLOCK message via voice (`evolution-word-cap`) when an edit would push the word count over the cap. This is the canonical soft-vs-hard pairing: evolution.md hard-capped (PreToolUse exit 2); sibling docs uncapped (operator + historian judgment).]*

**The relationship between evolution.md and its siblings is the architectural heart of the documentation layer.** Evolution.md is the 2000-word summary; when the historian's narrative needs more depth, the cap forces overflow into a sibling file — `docs/principles.md` for architectural rationale, `docs/decisions.md` for specific design choices, `docs/lessons.md` for hard-won cycle lessons. The historian decides at narration time which sibling file each overflow chunk belongs in, and evolution.md becomes an index pointing at the siblings. This is the canonical example of soft-versus-hard discipline at the size-cap level: only `docs/evolution.md` carries a hard cap; the siblings absorb the overflow under the historian's judgment. *[ref: evolution-block-message-names-overflow-siblings | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh — # If the edit would push past the cap, block section | The BLOCK message itself NAMES the overflow surfaces: "consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md), THEN add your new entry." When the cap fires, the hook tells the editor exactly which sibling files to overflow into. The cap's behavior is the documentation contract.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/historian-overflow-b7-5.png
  Concept: Chalk-on-blackboard sketch — the word-cap meter on docs/evolution.md (capped) on the left, the historian subagent depicted as an arrow that re-narrates new commits into evolution.md, and the overflow routing to uncapped sibling files on the right when the meter fills up.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the file boxes and the meter (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, the meter outline, and the cap line; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names or labels.
  Layout: Left half of the board — one pastel chalk file-box (cyan fill) labeled IN WHITE CHALK exactly "docs/evolution.md". Below the box, draw a horizontal white-chalk meter (a rectangle outline divided into segments, mostly filled with chalk shading). To the right of the meter, a short white-chalk label reads exactly "2000-word cap (configurable)". Above the meter, a small white-chalk arrow enters from the top-left labeled IN WHITE CHALK exactly "historian writes" with a small chalk subagent-icon (a tiny stick figure or chalk node) at the arrow's origin.
  Center — when the meter fills past the cap line (drawn as a vertical white-chalk dashed line near the right end of the meter), a single white-chalk arrow exits the right end of the meter and points right toward the overflow column, labeled IN WHITE CHALK exactly "overflow".
  Right half of the board — three pastel chalk file-boxes stacked vertically, each labeled IN WHITE CHALK with its exact name:
    Box 1 (green fill): "docs/principles.md"
    Box 2 (orange fill): "docs/decisions.md"
    Box 3 (pink fill): "docs/lessons.md"
  The overflow arrow fans out into three smaller white-chalk arrows, one pointing at each sibling box.
  Below the three sibling boxes, a small white-chalk note reads exactly "uncapped — historian judgment".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "docs/evolution.md", "2000-word cap (configurable)", "historian writes", "overflow", "docs/principles.md", "docs/decisions.md", "docs/lessons.md", "uncapped — historian judgment". No other words, file names, folders, or descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.5. The hard cap forces overflow. Siblings absorb depth under the historian's judgment."
-->

Target asset: assets/images/blog/b7/evolution-cap-overflow-b7-5.png

**The new-plugin lens.** When you guide your seed to create a plugin, the seed authors the cycle-1 `docs/evolution.md` by hand — a short narrative of the plugin's birth, what concern it owns, what it doesn't own. The historian subagent takes over from cycle 2 onward, re-narrating each cycle's commits into evolution.md until it hits the cap. From there, overflow goes into `docs/principles.md` (or whichever sibling the plugin's docs/CLAUDE.md establishes). Tell your seed: *every plugin gets a historian by birth.* Without one, the plugin's memory dies with the operator's session.

A consulting practice's seed could carry the same shape — every plugin (intake, engagement, deliverable QA) ships a `docs/evolution.md` capped narration of how its standards drifted across client cycles, with the historian dispatching after every N engagement-close commits.

**The ratchet fires at the seam.** Drift accumulates silently between unlocks; the next unlock attempt is the seam where the historian-injection voice fires, instructing the agent to invoke the per-plugin historian before proceeding. *[ref: drift-injection-on-unlock-block | .claude/plugins/plugin_integrity/hooks/lock-manager.sh — # Distinguish "existing plugin edit" vs "new plugin birth" block + # Calculate drift for the target plugin block | At PLUGIN-LOCK approval (PreToolUse on AskUserQuestion), the hook computes drift_count via drift-check.sh (# Calculate drift for the target plugin block). If drift_count ≥ DRIFT_THRESHOLD, the script emits the `plugin-evolution-stale` voice naming the per-plugin historian (`historian-${target//_/-}`) and exits 2 — hard-blocks the unlock until the agent invokes the historian. The narration commit resets drift to 0; the next unlock proceeds. The ratchet is enforced at the seam, not silently in the background.]*

---

Documentation is auto-narrated, word-capped, and overflow-routed. The historian writes; the operator reviews; the cap forces compression that protects the per-unlock context budget. The next sub-essay opens the organ where the plugin's *delegated investigation* lives — `agents/`, the per-plugin subagent pool, plus the 80/20 dispatch budget that mechanizes how much direct action the main session is allowed before it must delegate again.

---

*Essay 7.5 — The Plugin Kit, Part 5 of 9.*

*Previous: [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — private state, script-mediated, atomic mutation.*
*Next: [Essay 7.6 — `agents/` and the 80/20 Dispatch Budget](07_6-agents-and-80-20-budget.html) — per-plugin subagent pools + the budget the main session must earn.*
