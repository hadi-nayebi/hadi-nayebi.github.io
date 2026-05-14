---
title: "Plugin Edit Safety — plugin_integrity"
date: "May 2026"
slug: "plugin-integrity"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# Plugin Edit Safety — `plugin_integrity`

*Part 2 of Essay 5 (8 parts) — The Always-On Digital Cortex.*

---

[Part 1](05_1-the-two-layer-foundation.html) sketched the always-on layer as one of two plugin categories — five plugins, currently, that run on every prompt and every tool call regardless of which phase the seed agent is in. The next five parts of this essay tour those plugins, one paragraph each. Treat each tour as a template: the concern is portable; the specific mechanism is this prototype's answer.

We open with the one every other plugin depends on. `plugin_integrity` is the floor.

---

## What it owns

`plugin_integrity` exists to prevent accidental edits from regressing a plugin's established logic. It does this by leveraging git checkpoints and the plugin's own test suite. The lock applies when a plugin's code files need updating — documentation files inside a plugin (`CLAUDE.md` and `docs/*.md`) move under their own rules, with a few caveats. *[ref: plugin-integrity-exists-to-prevent | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:562 | Inline comment "DOCUMENTATION ALWAYS FREE: CLAUDE.md + all docs/*.md" — code files require lock; these two doc surfaces commit freely. Lock + safe-lock + revert use git checkpoints and the plugin's test suite; full ceremony deconstructed in Essay 7.]*

The always-on role to keep in mind here is the **test gate**: every plugin code change passes through it, regardless of who initiated the edit or which phase the agent is in. When an edit lands inside a plugin and the unlocked state closes, the plugin's full test suite runs — pass and the change commits, fail and the working tree rolls back to the captured checkpoint with a structured revert entry recorded in the plugin's hidden state. *[ref: every-plugin-code-change-test-gate | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:458-472 + .claude/plugins/plugin_integrity/scripts/safe-lock.sh:283-305 | Auto-lock trigger (plugin-guard.sh:458-472): when an edit lands outside the unlocked plugin, plugin-guard fires `bash "$SAFE_LOCK_SH" "$current"` (line 468). Voice message at line 467: "AUTO-LOCK: Editing outside plugins/ — locking $current (running tests)." Test-then-commit-or-revert branch (safe-lock.sh:283-305): `if [[ "$all_pass" == "true" ]]` → `git commit` + clear lock; `else` → revert with `log_revert` entry. The gate is the always-on guarantee.]*

That gate is the most universal pattern in the seed-agent prototype. Every plugin's code is protected by it. Every architect who adopts this architecture inherits it.

The fuller ceremony — the `[PLUGIN-LOCK]` unlock question, the historian ratchet, the documentation-edit caveats, the full lock-cmd flow — is deconstructed in [Essay 7](07-the-plugin-kit.html). For now, the always-on fact is enough: behind every plugin edit sits a test pass or a revert.

## What would break without it

Without `plugin_integrity`, every plugin edit is a hope. Run a change, hope the change works, hope you remembered to run the tests, hope you didn't forget to commit, hope the next session inherits a working codebase. Sloppy edits inside one plugin corrupt the discipline of every other plugin that depends on it, because plugins compose — they call each other's public surfaces, share marker protocols, lift each other's prefixes. One quiet regression deep inside a plugin's hooks can poison every dispatched subagent, every phase gate, every voice fire across the session. The always-on test gate is what makes a complex composing-plugin architecture safely modifiable in the first place. *[ref: without-plugin-integrity-every-edit | .claude/plugins/plugin_integrity/CLAUDE.md:4-8 | Objective: "Prevent accidental edits from regressing a plugin's established logic. Git checkpoints + the plugin's own test suite are the safety net. Lock + safe-lock + revert keep every plugin code change conditional on tests passing." The plugin's own framing of why the gate exists.]*

## What you would customize

`plugin_integrity` is the rare always-on plugin most architects **inherit, not rewrite**. The test gate is the universal floor — every plugin code change should pass through it, no matter what the plugin does. Replacing it makes the architecture less safe, not more. But the inside of the gate has knobs.

You would tune the *threshold* — what counts as "test pass." The current prototype runs every test in the plugin's `tests/` directory and treats them uniformly. A larger plugin with hundreds of tests may want fast-and-slow tiers (smoke tests block the unlock; full suite runs in CI). A plugin generating non-deterministic output may need flake tolerance encoded in the gate. *[ref: plugin-integrity-test-runner | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:184-227 | Loop iterates every `tests/test-*.sh`, captures PASS/FAIL per file (line 218), aggregates `all_pass` (line 222). Single tier; equal weight. Threshold customization would slot here.]*

You would tune the *prefix registry* used by the unlock ceremony. The current registry holds nine entries; your seed will hold more. Each registered prefix carries its own word floor, its own format, its own Post handler. Adding a ceremony means adding to the registry, writing the handler, wiring the voice. The registry is the surface; the entries are yours.

You would extend the *revert log* schema. The current entries record what was reverted, by whom, when, with which checkpoint SHA. Your seed may want to record which test failed (the exact assertion), which file the regression lived in, which prior cycle introduced the dependency that the failing test was checking. Richer revert logs make debugging in CONDENSE — the phase that absorbs experiential data — substantially faster. *[ref: revert-log-schema | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:246-272 | `log_revert()` writes a JSON entry to `data.json.revert_log` (capped at 20 — line 269 trim). Current fields: timestamp, plugin, sha_before, sha_after, reverted_files. Schema is extensible — adding new fields requires only a schema-version bump and a corresponding reader.]*

What you would **not** do is remove the safety net itself. The test gate is the floor; the floor stays.

---

The next part covers the second always-on plugin — the one that owns the seed agent's relationship to the model's context window.

---

*Part 2 of Essay 5 (8 parts) — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [The Two-Layer Foundation](05_1-the-two-layer-foundation.html) — two plugin categories above one substrate.*
*Next: [Context Window Discipline — `brain_guard`](05_3-brain-guard.html) — the self-compaction tiers and the architectural fact behind them.*
