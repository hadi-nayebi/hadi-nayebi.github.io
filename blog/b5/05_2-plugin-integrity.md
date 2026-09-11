---
title: "Plugin Edit Safety — plugin_integrity"
date: "May 2026"
slug: "plugin-integrity"
read_time: "7 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.8.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Plugin Edit Safety — `plugin_integrity`

*Essay 5.2 — The Always-On Digital Cortex, Part 2 of 9.*

---

[Essay 5.1](05_1-the-two-layer-foundation.html) introduced two behavioral plugin groups inside an earlier Claude-based prototype. The phase-independent group stays available across the work cycle, but each plugin attaches to particular runtime events rather than every plugin firing on every prompt and tool call. Essays 5.2 through 5.6 inspect those controls one at a time. Treat each deep-dive as a case study: the concern is portable; the mechanism is this prototype's answer. *[ref: phase-independent-plugin-group | .claude/settings.local.json | The prototype registers plugin_integrity on selected PreToolUse, PostToolUse, and AskUserQuestion events, independent of the focused job's phase.]*

We open with the control that protects changes to the plugin layer itself. In this prototype, `plugin_integrity` is the floor.

---

## What it owns

`plugin_integrity` exists to keep a plugin edit from silently regressing established behavior. It combines a user-gated unlock, a git checkpoint, plugin-scoped tests, a one-plugin-at-a-time boundary, and a deliberate closeout.

The first gate is admission. A `[PLUGIN-LOCK]` request must name one plugin, provide a structured justification of at least one hundred words, and run inside either gmode or a focused job for which the user has approved plugin-layer work. The same admission rule governs a new plugin's birth. Once admitted, the mechanism records the current commit as a checkpoint and marks that plugin as the only unlocked plugin. *[ref: plugin-lock-admission | .claude/plugins/plugin_integrity/hooks/lock-manager.sh [PLUGIN-LOCK] handler | The handler enforces the request shape and word floor, admits only gmode or a focused job with plugin_lock_approval, records HEAD, and unlocks one named plugin.]*

The lock protects the plugin's executable and machine-managed surfaces: hooks, scripts, existing shell tests, `config.conf`, and direct access to `data.json`. Some narrative and coaching surfaces are exempt from the plugin lock — a plugin's `CLAUDE.md`, Markdown under `docs/`, `voice.xml`, and Markdown agent definitions — because the prototype updates them through other governed flows. They are not globally writable: phase guards and other checks still decide when those edits are allowed. Shared utilities under `plugins/lib/` also follow their own boundary. *[ref: protected-and-exempt-surfaces | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh documentation exemption, data.json guard, and lib exemption | The guard distinguishes plugin code and hidden state from narrative, coaching, agent-definition, and shared-library surfaces while leaving phase enforcement in place.]*

The preferred closeout is explicit. Before switching plugins or making most phase transitions, the agent runs `lock-cmd.sh`. That script runs every shell test directly inside the unlocked plugin's `tests/` directory. If they pass, it commits any plugin-directory changes and clears the lock. If they fail, it keeps both the working tree and the lock intact so the agent can repair the failure and try again. A plugin with no shell tests can still close, but the script warns that it is locking without verification. *[ref: active-lock-closeout | .claude/plugins/plugin_integrity/scripts/lock-cmd.sh | The preferred path runs tests; PASS commits and clears lock state, FAIL preserves work and the active lock, and the no-tests path closes with a warning.]*

That distinction matters because the prototype also has an automatic fallback. When an eligible outside-plugin edit encounters an open lock, `safe-lock.sh` runs the tests. A pass commits and closes the lock. A failure first attempts a quarantine commit so the work remains recoverable in Git, then restores the plugin directory to the captured checkpoint and records the failed tests and reverted files. Auto-revert is the catch-all backstop, not the normal closeout path. *[ref: safe-lock-fallback | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh auto-lock branches + .claude/plugins/plugin_integrity/scripts/safe-lock.sh | Applicable outside-plugin edits can invoke safe-lock; its failure branch quarantines recoverable work, restores the checkpoint, and writes a structured revert record.]*

The fuller ceremony extends beyond this one plugin. [Essay 5.8](05_8-historian-ratchet.html) shows how the question registry, historian, job state, and integrity gate compose. The [Essay 7 series](../b7/07_1-plugin-kit-foundation.html) opens the reusable plugin anatomy. Here the central idea is smaller: changes to the controls that govern work deserve their own protected change cycle.

## Friction calibrated by danger

The lock is a gradient, not a single switch. `[PLUGIN-LOCK]` opens one plugin. Inside it, an existing shell test sits behind a second named gate, `[TEST-LOCK]`. The request must explain why the test changes, which groups or fixtures move, and what the suite asserts before and after. Only one existing test file is unlocked at a time. Creating a new test file is allowed without that second unlock, so the added safety net does not begin behind the gate it is meant to strengthen. *[ref: test-lock-gradient | .claude/plugins/plugin_integrity/hooks/lock-manager.sh [TEST-LOCK] handler + .claude/plugins/plugin_integrity/hooks/plugin-guard.sh test-file lock | Existing tests require a named, one-hundred-word test unlock; the guard permits creation of a previously absent test file.]*

This is deliberate. Tests are part of the safety mechanism, so weakening an established assertion deserves more friction than editing ordinary plugin code. The prototype has extensive shell suites, but a count of test cases is not a coverage percentage and cannot prove that every behavior is tested. The defensible rule is simpler: preserve regression tests for established behavior, add tests for new behavior, and make the closing gate run what the plugin declares.

The shape generalizes beyond this prototype. **Friction tracks danger.** Routine inspection should be cheap. A change to behavior should require a scoped checkpoint and proof. A change to the proof should require a more explicit rationale. In this prototype, the hooks enforce that gradient for tool calls routed through Claude Code. Gmode suspends phase controls but still requires the plugin unlock ceremony. A person with sufficient operating-system access can bypass hook-level policy, so the operator and repository protections remain part of the trust boundary. *[ref: enforcement-boundary | .claude/plugins/phasic_system/scripts/phase.sh enter-gmode + .claude/plugins/plugin_integrity/hooks/lock-manager.sh admission gate | Gmode is a protected maintenance lane that satisfies one admission arm; it does not remove the plugin lock, while enforcement is bounded by the hooked runtime.]*

A lawyer cultivating a brief-template seed could put the heaviest gate over precedent-citation rules. A researcher could place it over data-cleaning scripts. The mechanism can change. The principle is to slow the system at the surfaces where a quiet error would damage every later result.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plugin-integrity-b5-2.png
  Concept: Chalk-on-blackboard cross-section — a single plugin directory drawn as nested boxes, with `[PLUGIN-LOCK]` over code files and `[TEST-LOCK]` over existing tests. A separate lane shows CLAUDE.md and docs flowing without the plugin lock. On the right, label the pass/commit and auto-revert fallback paths clearly; the fallback is not the preferred active closeout.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard, hand-drawn chalk lines, pastel chalk fills, white labels, and chalk sticks along the bottom edge.
  STRICT NAME WHITELIST — only these literal text strings as labels: "plugins/<your_plugin>/", "[PLUGIN-LOCK]", "[TEST-LOCK]", "hooks/", "scripts/", "config", "tests/", "CLAUDE.md + docs/ — free", "auto-revert", "tests → pass / fail", "commit", "revert to checkpoint".
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.2. Two stages of unlock and an auto-revert fallback — friction calibrated by danger. Plugin code passes one gate; existing test files pass two; documentation follows its separate governed path."
-->

## The unlock briefing

Unlocking is more than flipping a state field. The agent receives a bounded briefing: the plugin's `evolution.md` under a `[LIVING HISTORY]` label, a `[RECENT COMMITS]` block for work since the last history sync, and guidance to align the edit with the plugin's declared objective, follow relevant links into uncapped decision and lesson files, and close the plugin before outside work. The injected evolution narrative is capped at two thousand words; deeper sibling documents remain on disk and load when relevant. *[ref: unlock-briefing | .claude/plugins/plugin_integrity/hooks/lock-manager.sh unlock-success branch + .claude/plugins/plugin_integrity/config.conf | The handler assembles living history, recent commits, and three guidance messages; MAX_EVOLUTION_WORDS bounds the evolution file.]*

That briefing has a purpose. A checkpoint can preserve code, and a test can detect known regressions, but neither tells the agent why an odd constraint exists. The living history reconnects the mechanical gate to prior design decisions before the system edits its own controls. Other seeds can use the same shape at their own decision-rich moments: a consulting seed at the start of a client engagement, or a research seed at the start of a literature review.

## What would break without it

Without `plugin_integrity`, the prototype would rely on the agent remembering a sequence: isolate one plugin, obtain authorization, preserve a checkpoint, avoid changing locked tests, run the correct suites, inspect failures, and commit a recoverable result. Language-model guidance can encourage that sequence, but the hook and script layer makes failures visible and blocks several unsafe transitions.

The consequence of a quiet regression can spread. Plugins call shared utilities and each other's published commands; hooks can sit on common runtime events. A broken guard or state transition can therefore affect work far beyond the file that changed. Tests cannot prove the whole system safe, but a protected, repeatable closeout catches known failures before the new plugin state becomes the next baseline.

## What you would customize

The portable floor is a protected change cycle, not this exact Bash implementation. An architect can preserve the same discipline with different repository controls, CI checks, review rules, or runtime hooks.

You would tune the *test runner*. The current prototype executes every `tests/*.sh` file with a per-test timeout and treats any nonzero result as failure. A larger plugin may use smoke and full-suite tiers, or run slow checks in CI. A non-deterministic test needs an explicit reliability policy; silently ignoring flakes would weaken the gate.

You would coordinate changes to the *question protocol*. The live registry contains ten prefixes, including `[COMMAND-APPROVE]`. The registry belongs to `question_discipline`, while the `[PLUGIN-LOCK]` and `[TEST-LOCK]` handlers belong here. Adding a ceremony therefore requires a cross-plugin contract change: registry entry, shape or option validation, owning handler, voice, and tests. *[ref: prefix-protocol | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh PREFIX_REGISTRY + .claude/context/prefixed-questions.md | The current registry has ten entries; question_discipline admits prefixes and each owning plugin implements its specific effect.]*

You would extend the *revert record* only when recovery needs more evidence. The current record already includes timestamp, plugin, structured failed-test context, the count and paths of reverted files, the pre-revert commit, and a bounded trigger reason. A different seed might add the test environment, tool versions, or the later recovery outcome. *[ref: revert-record | .claude/plugins/plugin_integrity/scripts/safe-lock.sh log_revert | Schema v3 writes seven recovery fields and caps the retained log at twenty entries.]*

You could extend the *friction gradient*. Cross-plugin contract changes or hooks with external side effects might deserve an additional review gate. Each added stage should correspond to a real increase in consequence and should be enforced by the runtime, not merely named in prose.

What you should preserve is the safety function: controlled admission, isolated scope, relevant tests, recoverable failure, and an explicit closeout.

---

The next part covers the second phase-independent plugin — the one that manages the prototype's relationship to the model's context window.

---

*Essay 5.2 — The Always-On Digital Cortex, Part 2 of 9.*

*Previous: [Essay 5.1 — The Two-Layer Foundation](05_1-the-two-layer-foundation.html) — two behavioral plugin groups inside an earlier prototype's cognitive layer.*
*Next: [Essay 5.3 — Context Window Discipline — `brain_guard`](05_3-brain-guard.html) — the self-compaction tiers and the architectural fact behind them.*
