---
title: "The Dual Voice Architecture"
date: "May 2026"
slug: "dual-voice-architecture"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Voice]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/agent-anatomy.png"
---

# The Dual Voice Architecture

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

---

[Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html) opened the universal skeleton — CLAUDE.md, hooks, scripts — and named the PLUGIN-LOCK ceremony that gates every edit to them. This sub-essay opens the organ that almost every plugin doubles: `voice.xml`. Two voice surfaces in the current prototype — same XML schema, different audiences. Getting them confused is the most common new-user error in plugin authoring.

---

## `voice.xml` × Two — The Dual Surface

This is the organ that confuses new users most, and the one where the relational anatomy matters most.

**The two voice surfaces are different files with different audiences.** `hooks/voice.xml` and `scripts/voice.xml` look nearly identical structurally (both XML, both with `<coaching>`, `<block>`, `<info>`, `<entry>` elements identified by `id`), but they serve different consumers. *[ref: dual-voice-surfaces-share-schema | .claude/plugins/plugin_integrity/hooks/voice.xml + .claude/plugins/plugin_integrity/scripts/voice.xml | `ls .claude/plugins/*/{hooks,scripts}/voice.xml` shows ten plugins shipping BOTH surfaces (brain_guard, interaction_summary, job_core, phasic_system, plugin_integrity, and all five phase plugins); question_discipline ships only `hooks/voice.xml` because it has no `scripts/` CLI (cf. B7 §scripts paragraph). Both files use the same XML schema family — agent-facing `<coaching id="…">`, `<block id="…">`, `<info id="…">`, `<entry id="…">`, plus utility `<error id="…">` and `<warning id="…">` for fallback paths — confirmed by grep counts (plugin_integrity/hooks/voice.xml: 3 coaching + 29 block + 15 info + 2 entry + 3 error = 52 elements total).]*

### `hooks/voice.xml` — The Agent-Facing Surface

**What it is.** Strings the plugin emits at hook fire-time. Coaching voices that nudge the agent at a specific moment (entering a phase, crossing a context tier, having just dispatched a subagent). Blocks that refuse the agent when a guard fires.

**Who reads it.** The LLM agent. Voices delivered via hooks land in the agent's context window — either as soft injections via `additionalContext` JSON (coaching) or as exit-2 stderr refusals (blocks). The LLM sees the string mid-turn and reacts.

**Who writes it.** Mostly CONDENSE step 4 (which consumes `[VOICE-UPDATE]` markers other phases emit). The historian subagent also updates voice files when the plugin's evolution requires new coaching. PLUGIN-LOCK is the underlying gate for any edit. *[ref: condense-step-4-voice-update-owner | .claude/plugins/phase_condense/agents/condense-voice-updater.md + .claude/plugins/plugin_integrity/agents/historian-*.md | The condense-voice-updater agent definition exists at the cited path (it is the subagent CONDENSE step 4 dispatches for `[VOICE-UPDATE]` marker consumption). historian-phase-*.md, historian-plugin-integrity.md, historian-brain-guard.md, historian-job-core.md, historian-interaction-summary.md, historian-question-discipline.md, historian-phasic-system.md all exist under plugin_integrity/agents/ — each plugin's historian re-narrates its evolution.md AND can update its voice.xml when the plugin's evolution requires new coaching.]*

**What it depends on.** The shared `lib/voice-helper/` helper (the `get_voice` function that loads voice.xml entries and substitutes `{{var}}` placeholders). *[ref: voice-helper-get-voice-var-substitution | .claude/plugins/lib/voice-helper/voice-helper.sh:60,113-122 | The `get_voice` function header comment (L60): "var=value — Optional pairs. Replaces {{var}} placeholders in the extracted text." The substitution block (L113-122): "--- Variable substitution: replace {{var}} placeholders --- Caller passes key=value pairs. Each {{key}} in the text is replaced with value." Every plugin's hook scripts source this single shared helper for voice rendering.]*

### `scripts/voice.xml` — The Operator-Facing Surface

**What it is.** Strings the plugin's CLI prints to the operator's terminal. When `safe-lock.sh` reverts a test failure, the operator sees a short status line in their terminal. The text is what the operator's eyes read in the shell. *[ref: scripts-voice-cli-operator-surface | .claude/plugins/plugin_integrity/scripts/voice.xml | grep counts in plugin_integrity/scripts/voice.xml: 14 total elements (6 info + 7 error + 1 warning; vs 52 in hooks/voice.xml of the same plugin) — the operator-facing surface is intentionally sparser because operator messages are status lines, not coaching paragraphs. Every plugin shipping a `scripts/` dir also ships `scripts/voice.xml` so CLI verbs (`safe-lock.sh`, `drift-check.sh`, etc.) print human-readable status without hard-coding strings into the scripts.]*

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
  Caption (bottom of image, white chalk, hand-drawn): "Image 7.3. Soft layer coaches. Hard layer refuses. Patterns migrate left to right when data warrants."
-->

**Soft vs hard at the element level.** Inside each voice.xml, the `<coaching>` element produces a context injection — probabilistic, the LLM may absorb or ignore it. The `<block>` element produces a refusal — exit-2 stderr that fails the agent's tool call. The two element types coexist in the same file. The Lock-13 over-engineering veto says: new behavioral controls start as coaching; only when measurement shows coaching consistently fails does the control harden into a block. *[ref: lock-13-over-engineering-veto-coaching-before-block | .claude/plugins/phase_condense/docs/principles.md + .claude/plugins/phase_condense/docs/architecture-pattern.md | The Lock 13 over-engineering veto section in principles.md (under "Core Principles → Voice-First Discipline + Over-Engineering Veto") anchors the policy; the Brain-maturation soft-vs-hard pattern section in architecture-pattern.md (within condense-tracker.sh's Body-vs-Footer Metric writeup) restates it operationally: "if body_edits / (body_edits + footer_edits) is consistently low across cycles, future condense rounds may harden a Step 1 gate blocking `--force` when body-absorption is insufficient. Voice-first precedence — Lock 13 prohibits premature hardening." Plugin-wide brain-maturation policy: coaching first, hard block only after measurement justifies it.]*

**The yaml-injection pairing.** When a job reaches stage 3 of maturation (multi-cycle with `.yaml` plan, covered in [Essay 8](08_1-apprentice-to-architect-foundation.html)), the `.yaml` file's per-phase fields pair with voice ids by convention. The yaml field name maps to a voice id directly; voice-helper appends the matched value to the rendered voice text at phase entry. New yaml fields require no parser change — just add the matching voice id to the plugin's `hooks/voice.xml` and the seed agent picks up the new pairing on the next phase entry. *[ref: yaml-cognition-v2-path-c-auto-couples | .claude/knowledge/phasic_system/yaml-cognition-v2-architecture.md | Contract + Yaml plan file format + plan-sensor.sh subsections (under "v2 Design Lock — Path C") state: "voice-helper.sh auto-couples yaml augmentation at render time. Plugins stay naive; yaml mentions voice ids directly; voice-helper appends yaml content to rendered voice text when the cache has a pairing." / "If a pairing exists, APPEND its value to the rendered text with a blank-line separator." / plan-sensor "calls get_voice(...) — those calls go through voice-helper which auto-appends yaml augmentation transparently. Plan-sensor doesn't see or know about yaml. Path C transparency." Confirms the contract: yaml keys ARE voice ids (no transformation), voice-helper does the coupling, plugin voices stay naive.]*

**The new-plugin lens.** When you guide your seed to add coaching for a new behavior, the seed writes the coaching string to `hooks/voice.xml` first (cheap, soft). If the operator later observes the coaching consistently fails to hold, the seed authors a `<block>` element in the same file for the hard variant — same id namespace, harder enforcement. The seed never invents a third voice surface. The split between LLM-facing and operator-facing voice surfaces is structural.

A consulting firm's seed agent could carry the same dual-voice split: `hooks/voice.xml` coaches the agent on deliverable-checklist enforcement; `scripts/voice.xml` prints terminal status to the consultant when `deliverable.sh validate` runs. Same schema, two audiences, one ceremony.

---

Two voice surfaces, one shared schema, two audiences. The LLM consumes one; the operator consumes the other. The next sub-essay opens the organ that almost every plugin needs but that no plugin lets anyone else touch — the private `data.json` state.

---

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

*Previous: [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the universal organs governed by PLUGIN-LOCK.*
*Next: [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — per-plugin private state, script-mediated.*
