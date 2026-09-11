---
title: "The Dual Voice Architecture"
date: "May 17, 2026"
slug: "dual-voice-architecture"
read_time: "5 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Voice]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# The Dual Voice Architecture

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

---

[Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html) opened the Claude prototype's load-bearing skeleton — CLAUDE.md, hooks, scripts — and named the PLUGIN-LOCK ceremony that gates hard-substrate edits. This sub-essay opens the soft-memory organ that most plugins in that architecture double: `voice.xml`. The hooks-side and scripts-side surfaces share one XML schema family across different audiences. Getting them confused is the most common new-user error in plugin authoring.

**Runtime boundary.** The two-file voice architecture below is specific to the original Claude Code Seed. The transferable behavioral distinction is between agent-facing guidance or refusal and operator-facing status, with explicit audience, delivery, authority, and verification. Other runtimes may express those channels with a root voice file, schemas, libraries, hooks or equivalent lifecycle controls, and need not use two `voice.xml` files.

---

## `voice.xml` × Two — The Dual Surface

This is the organ that confuses new users most, and the one where the relational anatomy matters most.

**The two voice surfaces are different files with different audiences.** `hooks/voice.xml` and `scripts/voice.xml` share an XML schema family and identify entries by `id`, but they do not need to contain the same element types. Hooks-side files commonly carry coaching and block messages; scripts-side files commonly carry status, warning, and error messages. Their consumers, rather than matching tag inventories, define the split. *[ref: dual-voice-surfaces-share-schema | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

### `hooks/voice.xml` — The Agent-Facing Surface

**What it is.** Strings the plugin emits at hook fire-time: coaching messages that nudge the agent at a specific moment (entering a phase, crossing a context tier, having just dispatched a subagent), and block messages used by guards that refuse an action. *[ref: hook-fire-emits-coaching-or-block | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who reads it.** The LLM agent. Voices delivered via hooks land in the agent's context window — either as soft context injections or as refusal reasons from blocking hooks. The callsite and hook result determine the delivery behavior; the XML tag alone does not. *[ref: hooks-deliver-via-additional-context-or-exit-2 | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who writes it.** Mostly CONDENSE step 4, which consumes `[VOICE-UPDATE]` markers emitted by other phases. The historian subagent also updates voice files when the plugin's evolution requires new coaching. In the historical prototype, `voice.xml` is treated as a soft-memory surface rather than PLUGIN-LOCK-only code. *[ref: condense-step-4-voice-update-owner | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**What it depends on.** The shared voice helper: its `get_voice` function loads entries and substitutes `{{var}}` placeholders. *[ref: voice-helper-get-voice-var-substitution | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

### `scripts/voice.xml` — The Operator-Facing Surface

**What it is.** Strings the plugin's CLI prints to the operator's terminal. When `safe-lock.sh` restores a checkpoint after a test failure, the operator sees a short status line in the terminal. *[ref: scripts-voice-cli-operator-surface | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who reads it.** The primary audience is the human operator. This is terminal output printed to standard output or standard error, rather than context deliberately injected by a lifecycle hook. When the agent invokes the command through a tool, that output may also return in the tool result. *[ref: scripts-cli-prints-status-to-operator-shell | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who writes it.** Same ownership pattern as hooks/voice.xml: CONDENSE and the historian repair wording as soft memory, while the scripts that consume those strings remain hard-substrate code.

**What it depends on.** Same voice-helper.

### Why the split matters

Same intent — both surfaces carry the plugin's voice. Different delivery channels and primary audiences — the LLM receives structured paragraphs that frame a lifecycle event or refusal; the human reads CLI status lines that flag what happened. Wording often differs between the two for the same conceptual event. Auditor scripts that check voice ids have to inspect both files; auditing only one can report valid ids from the other as orphaned. *[ref: voice-orphan-audit-must-grep-both-surfaces | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

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
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching — soft layer", "<coaching id=...>", "injected into LLM context", "probabilistic — can be ignored", "LLM-interpreted", "block — hard layer", "<block id=...>", "stderr refusal", "exit 2 — deterministic", "agent's tool call fails", "measurement → harden", "Lock 13: over-engineering veto — soft must measurably fail before hard lands". No other words, file names, voice ids, or descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.3. Soft layer coaches. Hard layer refuses. Patterns migrate left to right when data warrants."
-->

**Soft vs hard at the delivery boundary.** A `<coaching>` entry carries language intended for a soft context injection; a `<block>` entry carries language intended to explain a refusal. The tag records intent. The hook callsite supplies enforcement by choosing the output path and, for a blocking command hook, the blocking exit result. The Lock-13 over-engineering veto says: new behavioral controls start as coaching; only when measurement shows coaching consistently fails does the design add the hard callsite that enforces a block. *[ref: lock-13-over-engineering-veto-coaching-before-block | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The YAML-injection pairing.** Stage 3 of the maturation arc (covered in [Essay 8](../b8/08_1-apprentice-to-architect-foundation.html)) is a job whose `plan_file` is a `.yaml` — a Stage-3 job, chosen at cycle-1 PLAN like any other Stage, whose `.yaml` plan injects job-specific context at each phase entry. Stage 3 is identical to Stage 2 in completion semantics; only the plan-file format differs. A Stage-3 job's `.yaml` per-phase fields pair with voice ids by convention. The YAML field name maps to a voice id directly; voice-helper augments the rendered voice text at phase entry — appending the YAML value by default, or replacing or prepending it when the YAML entry specifies a mode (the three modes are detailed in [Essay 6.10b](../b6/06_10b-long-horizon-memory.html) and [Essay 8.2](../b8/08_2-job-maturation-stages.html)). The pairing has a contract surface: a YAML key must match a voice id that some hook or script actually calls, otherwise the plan loader rejects the YAML at validate-format time with a `did you mean` suggestion. New YAML fields require no parser change — add the voice id to the plugin's `voice.xml` and wire a `get_voice` callsite in a hook or script (making it callable — orphan ids are rejected by the YAML validator), and the seed agent picks up the new pairing on the next phase entry. *[ref: voice-helper-mode-aware-augmentation-and-callable-catalog | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The new-plugin lens.** When you guide your seed to add coaching for a new behavior, the seed writes the coaching string to `hooks/voice.xml` first (cheap, soft). If the operator later observes that coaching consistently fails to hold, the seed adds the hard variant and wires the guard to return a blocking result. The voice entry explains the refusal; the callsite enforces it. The seed never invents a third voice surface. The split between LLM-facing and operator-facing voice surfaces is structural. *[ref: brain-maturation-coaching-graduates-to-block | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A consulting firm's Claude-based Seed could carry the prototype's dual-file voice split: `hooks/voice.xml` coaches the agent on deliverable-checklist enforcement; `scripts/voice.xml` prints terminal status to the consultant when `deliverable.sh validate` runs. Within that runtime, the same schema serves separate agent-facing and operator-facing surfaces under one ceremony. *[ref: dual-voice-pattern-transfers-to-domain-plugins | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>Interactive diagram.</strong> Walk the whole voice surface as a deck &mdash; soft nudges and hard refusals in one file, the <code>hooks/</code> vs <code>scripts/</code> split by fire-site, the <code>get_voice</code> render primitive, the budget-tiered coaching rotation, the no-orphan invariant and its catalog, and how a Stage-3 <code>.yaml</code> tunes existing voices per job. Click any box for the live code behind it.</span>
  <a href="explore/voice-surface.html" title="Open the interactive voice-surface walkthrough" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the voice surface</a>
</aside>
<!-- /RAW_HTML -->

---

In this Claude implementation, the hooks-side and scripts-side surfaces share one schema family. The hooks-side surface deliberately enters the agent's lifecycle context; the CLI-facing surface primarily serves the operator through terminal status. The next sub-essay opens the organ that almost every plugin needs but that no plugin lets anyone else touch — the private `data.json` state.

---

*Essay 7.3 — The Plugin Kit, Part 3 of 9.*

*Previous: [Essay 7.2 — Skeleton: CLAUDE.md, Hooks, and Scripts](07_2-skeleton-claudemd-hooks-scripts.html) — the Claude prototype organs governed by PLUGIN-LOCK.*
*Next: [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — per-plugin private state, script-mediated.*
