---
title: "The Dual Voice Architecture"
date: "May 2026"
slug: "dual-voice-architecture"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Voice]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# The Dual Voice Architecture

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

---

[Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html) opened the universal skeleton — CLAUDE.md, hooks, scripts — and named the PLUGIN-LOCK ceremony that gates hard-substrate edits. This sub-essay opens the soft-memory organ that almost every plugin doubles: `voice.xml`. The hooks-side and scripts-side surfaces share one XML schema across different audiences. Getting them confused is the most common new-user error in plugin authoring.

---

## `voice.xml` × Two — The Dual Surface

This is the organ that confuses new users most, and the one where the relational anatomy matters most.

**The two voice surfaces are different files with different audiences.** `hooks/voice.xml` and `scripts/voice.xml` look nearly identical structurally (both XML, both with `<coaching>`, `<block>`, `<info>`, `<entry>` elements identified by `id`), but they serve different consumers. *[ref: dual-voice-surfaces-share-schema | .claude/plugins/plugin_integrity/hooks/voice.xml + .claude/plugins/plugin_integrity/scripts/voice.xml | `ls .claude/plugins/*/{hooks,scripts}/voice.xml` shows ten plugins shipping BOTH surfaces (brain_guard, interaction_summary, job_core, phasic_system, plugin_integrity, and all five phase plugins); question_discipline ships only `hooks/voice.xml` because it has no `scripts/` CLI (cf. B7 §scripts paragraph). Both files use the same XML schema family — agent-facing `<coaching id="…">`, `<block id="…">`, `<info id="…">`, `<entry id="…">`, plus utility `<error id="…">` and `<warning id="…">` for fallback paths — confirmed by grep counts (plugin_integrity/hooks/voice.xml: 4 coaching + 30 block + 15 info + 2 entry + 3 error = 54 elements total).]*

### `hooks/voice.xml` — The Agent-Facing Surface

**What it is.** Strings the plugin emits at hook fire-time. Coaching voices that nudge the agent at a specific moment (entering a phase, crossing a context tier, having just dispatched a subagent). Blocks that refuse the agent when a guard fires. *[ref: hook-fire-emits-coaching-or-block | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:191-199,228-230,252-256 | At hook fire-time the same plugin emits both shapes. L191 calls `get_voice "plugin-lock-short-description"` with current word-count + min threshold, falls through to `exit 2` at L193 (hard block when the operator's PLUGIN-LOCK question is too short). L228 calls `get_voice "plugin-lock-requires-gmode-or-approved-job"` with plugin name + phase context, exits 2 at L230 (hard block when the unlock context is wrong). L252 calls `get_voice "plugin-evolution-stale"` with drift count + subagent name, exits 2 at L256 (hard block when `evolution.md` is behind). Coaching nudges injected via `additionalContext` JSON share the same `get_voice` helper — the difference is the exit code, not the loader.]*

**Who reads it.** The LLM agent. Voices delivered via hooks land in the agent's context window — either as soft injections via `additionalContext` JSON (coaching) or as exit-2 stderr refusals (blocks). The LLM sees the string mid-turn and reacts. *[ref: hooks-deliver-via-additional-context-or-exit-2 | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:193,230,256,380 | Two delivery paths for hook-emitted voice. Soft: L380 emits a JSON payload carrying the voice text under the `additionalContext` key on the `PostToolUse` path — Claude Code surfaces this in the agent's next-turn context without failing the tool call. Hard: L193 / L230 / L256 each follow a `get_voice(...)` call with `exit 2` — the agent's pending tool call fails, the voice text writes to stderr, the LLM sees the refusal and adjusts. Same loader on both paths; exit-code routing decides whether the LLM receives a nudge or a refusal.]*

**Who writes it.** Mostly CONDENSE step 4 (which consumes `[VOICE-UPDATE]` markers other phases emit). The historian subagent also updates voice files when the plugin's evolution requires new coaching. In the current prototype, `voice.xml` is treated as a soft-memory/configuration surface, not a PLUGIN-LOCK-only code surface. *[ref: condense-step-4-voice-update-owner | .claude/plugins/phase_condense/agents/condense-voice-updater.md + .claude/plugins/plugin_integrity/agents/historian-*.md + .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:567-588 | The condense-voice-updater agent definition exists at the cited path (it is the subagent CONDENSE step 4 dispatches for `[VOICE-UPDATE]` marker consumption). historian-phase-*.md, historian-plugin-integrity.md, historian-brain-guard.md, historian-job-core.md, historian-interaction-summary.md, historian-phasic-system.md, historian-job-archiver.md, historian-job-blocker.md all exist under plugin_integrity/agents/ — each plugin's historian re-narrates its evolution.md AND can update its voice.xml when the plugin's evolution requires new coaching. plugin-guard.sh:567-588 explicitly exempts `voice.xml` alongside CLAUDE.md, docs/*.md, and agents/*.md as a configuration/soft-memory surface.]*

**What it depends on.** The shared `lib/voice-helper/` helper (the `get_voice` function that loads voice.xml entries and substitutes `{{var}}` placeholders). *[ref: voice-helper-get-voice-var-substitution | .claude/plugins/lib/voice-helper/voice-helper.sh:60,113-122 | The `get_voice` function header comment (L60): "var=value — Optional pairs. Replaces {{var}} placeholders in the extracted text." The substitution block (L113-122): "--- Variable substitution: replace {{var}} placeholders --- Caller passes key=value pairs. Each {{key}} in the text is replaced with value." Every plugin's hook scripts source this single shared helper for voice rendering.]*

### `scripts/voice.xml` — The Operator-Facing Surface

**What it is.** Strings the plugin's CLI prints to the operator's terminal. When `safe-lock.sh` reverts a test failure, the operator sees a short status line in their terminal. The text is what the operator's eyes read in the shell. *[ref: scripts-voice-cli-operator-surface | .claude/plugins/plugin_integrity/scripts/voice.xml | grep counts in plugin_integrity/scripts/voice.xml: 14 total elements (6 info + 7 error + 1 warning; vs 54 in hooks/voice.xml of the same plugin) — the operator-facing surface is intentionally sparser because operator messages are status lines, not coaching paragraphs. Every plugin shipping a `scripts/` dir also ships `scripts/voice.xml` so CLI verbs (`safe-lock.sh`, `drift-check.sh`, etc.) print human-readable status without hard-coding strings into the scripts.]*

**Who reads it.** The human operator. Terminal output. Not injected into the LLM's context — printed to stderr or stdout of the shell, visible only to the person at the keyboard. *[ref: scripts-cli-prints-status-to-operator-shell | .claude/plugins/plugin_integrity/scripts/lock-cmd.sh:122,177,275 | The CLI verbs call `get_voice` and print to the operator's terminal directly. L122 emits `lock-cmd-no-plugin-unlocked` when the operator runs status with no plugin locked. L177 emits `lock-cmd-passed` when the test-pass path completes (operator sees the green-light status line). L275 emits `lock-cmd-failed-no-revert` when tests failed but the revert path was suppressed (operator sees the red-light status + remediation). None of these strings is injected into the LLM's context — they print to the operator's terminal stdout/stderr only.]*

**Who writes it.** Same ownership pattern as hooks/voice.xml: CONDENSE and the historian repair wording as soft memory/configuration, while the scripts that consume those strings remain hard-substrate code.

**What it depends on.** Same voice-helper.

### Why the split matters

Same intent — both surfaces carry the plugin's voice. Different audiences — the LLM consumes structured paragraphs that frame the situation and propose action; the human consumes status lines that flag what happened. Wording often differs between the two for the same conceptual event. Auditor scripts that grep voice ids have to look in both files; auditing only one false-positives every id that lives in the other. *[ref: voice-orphan-audit-must-grep-both-surfaces | .claude/plugins/plugin_integrity/tests/test-voice-orphan-audit.sh:14-15,32 | The audit declares both surfaces explicitly: `HOOKS_VOICE="$PLUGIN_DIR/hooks/voice.xml"` (L14) + `SCRIPTS_VOICE="$PLUGIN_DIR/scripts/voice.xml"` (L15), then the comment at L32 says "Extract all element IDs from both voice.xml files using broader pattern." The auditor unions ids from both surfaces; auditing only one yields false-positives for ids that live in the other. The shared root-brain guidance in `.claude/CLAUDE.md` ("Voice Architecture" section) reinforces: "voice audits MUST grep BOTH hooks/voice.xml + scripts/voice.xml" — universal across the 10 plugins with dual surfaces.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/dual-voice-b7-3.png
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

**The yaml-injection pairing.** Stage 3 of the maturation arc (covered in [Essay 8](../b8/08_1-apprentice-to-architect-foundation.html)) is a job whose `plan_file` is a `.yaml` — a Stage-3 job, chosen at cycle-1 PLAN like any other Stage, whose `.yaml` plan injects job-specific context at each phase entry. Stage 3 is identical to Stage 2 in completion semantics; only the plan-file format differs. A Stage-3 job's `.yaml` per-phase fields pair with voice ids by convention. The yaml field name maps to a voice id directly; voice-helper augments the rendered voice text at phase entry — appending the yaml value by default, or replacing/prepending it when the yaml entry specifies a mode (the three modes are detailed in [Essay 6.10](../b6/06_10-plan-state-machine.html) and [Essay 8.2](../b8/08_2-job-maturation-stages.html)). The pairing has a contract surface: a yaml key must match a voice id that some hook or script actually calls, otherwise the plan loader rejects the yaml at validate-format time with a `did you mean` suggestion. New yaml fields require no parser change — just add the matching voice id to the plugin's `voice.xml` and the seed agent picks up the new pairing on the next phase entry. *[ref: voice-helper-mode-aware-augmentation-and-callable-catalog | .claude/plugins/lib/voice-helper/voice-helper.sh yaml-cognition block + .claude/plugins/lib/yaml-cognition/build-voice-catalog.py + validate-yaml-voice-ids.py | The helper inspects the cache entry's JSON type per voice id: bare string → APPEND (back-compat); object `{mode, text}` → switch on `mode` between `append` / `replace` / `prepend`. The catalog tool enumerates the contract surface — defined ids across all `voice.xml` files plus quoted references in non-test plugin source — and the validator rejects yaml keys outside the callable set at plan.sh's `validate-yaml-format` handler (with `difflib.get_close_matches` suggestions). Plugins stay naive about yaml; voice-helper does the coupling; the catalog + validator make the contract explicit.]*

**The new-plugin lens.** When you guide your seed to add coaching for a new behavior, the seed writes the coaching string to `hooks/voice.xml` first (cheap, soft). If the operator later observes the coaching consistently fails to hold, the seed authors a `<block>` element in the same file for the hard variant — same id namespace, harder enforcement. The seed never invents a third voice surface. The split between LLM-facing and operator-facing voice surfaces is structural. *[ref: brain-maturation-coaching-graduates-to-block | CLAUDE.md "Brain Maturation Model" section | The Brain Maturation Model section frames the maturation flow: "Young agent: Large brain, few hooks. Learns by guidance. Most controls are probabilistic. → Mature agent: Lean brain, many hooks. Operates by enforcement. Proven patterns are deterministic." The flow named: "Experience → notice pattern → add to brain → pattern proves reliable → migrate to hook → remove from brain." Coaching is the probabilistic-brain entry point; block is the deterministic-hook landing point. Same `id` namespace lets the migration happen in-place inside the same plugin's `voice.xml` — no new surface invented when a soft-to-hard transition occurs.]*

A consulting firm's seed agent could carry the same dual-voice split: `hooks/voice.xml` coaches the agent on deliverable-checklist enforcement; `scripts/voice.xml` prints terminal status to the consultant when `deliverable.sh validate` runs. Same schema, the agent-facing and operator-facing surfaces, one ceremony. *[ref: dual-voice-pattern-transfers-to-domain-plugins | .claude/plugins/CLAUDE.md "Plugin Structure Convention" section | The plugin convention names `CLAUDE.md`, `data.json`, `hooks/`, `scripts/`, `tests/`, `docs/` as standard organ directories. `voice.xml` lives inside both `hooks/` and `scripts/` as the canonical doubled-organ pattern across the plugin set (visible via `ls .claude/plugins/*/{hooks,scripts}/voice.xml`). No part of the convention is `plugin_integrity`-specific — any plugin a seed agent grows (a consulting `deliverable_pipeline` plugin, a research-lab `protocol_check` plugin, a law-firm `engagement_letter` plugin) inherits the dual-voice split because it inherits the same convention. The pattern transfers because the schema and ceremony are universal to the kit, not specific to the prototype's plugin set.]*

---

The hooks-side and scripts-side surfaces share one schema. The LLM consumes the agent-facing surface; the operator consumes the CLI-facing surface. The next sub-essay opens the organ that almost every plugin needs but that no plugin lets anyone else touch — the private `data.json` state.

---

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

*Previous: [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the universal organs governed by PLUGIN-LOCK.*
*Next: [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — per-plugin private state, script-mediated.*
