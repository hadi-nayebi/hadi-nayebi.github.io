---
title: "Plugin Edit Safety — plugin_integrity"
date: "May 2026"
slug: "plugin-integrity"
read_time: "6 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.2.0
audience: "Tier 2"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# Plugin Edit Safety — `plugin_integrity`

*Essay 5.2 of 9 — The Always-On Digital Cortex.*

---

[Essay 5.1](05_1-the-two-layer-foundation.html) sketched the always-on layer as one of two plugin categories — five plugins, currently, that run on every prompt and every tool call regardless of which phase the seed agent is in. Essays 5.2 through 5.6 deep-dive each one in turn. Treat each deep-dive as a template: the concern is portable; the specific mechanism is this prototype's answer; the design intent — what gate the plugin opens or closes, and why — is what you carry into your own seed.

We open with the one every other plugin depends on. `plugin_integrity` is the floor.

---

## What it owns

`plugin_integrity` exists to prevent accidental edits from regressing a plugin's established logic. It does this by leveraging git checkpoints and the plugin's own test suite. The lock applies to a plugin's executable surfaces — hooks, scripts, tests, config — when they need updating. Documentation files inside a plugin (`CLAUDE.md` and everything under `docs/`) commit freely under their own rules, with three caveats that surface elsewhere in the series: the four phase-section markers inside CLAUDE.md (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---`) stay marker-protected even when the rest of the file is free, the `evolution.md` file inside `docs/` carries its own word-cap enforced by a separate hook, and historian subagents get a narrow git-commit exemption for `docs/*.md` so they can clear the drift-gate while another plugin sits locked. *[ref: plugin-integrity-exists-to-prevent | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:562-575 | Block header: "DOCUMENTATION ALWAYS FREE: CLAUDE.md + all docs/*.md" — code files require lock; doc surfaces commit freely. Caveat 1: section-marker protection runs BEFORE the doc exemption (same file, earlier in plugin-guard). Caveat 2: word-cap enforced in `scripts/evolution-cap.sh`, not here. Caveat 3: historian git-commit exemption at plugin-guard.sh:579-616 — JSON `.agent_type` matching `historian-*` plus path-restricted git add/commit to `docs/*.md` only.]*

The always-on role to keep in mind here is the **test gate**: every plugin code change passes through it, regardless of who initiated the edit or which phase the agent is in. When an edit lands inside another plugin and the unlocked state closes, the plugin's full test suite runs — pass and the change commits, fail and the working tree rolls back to the captured checkpoint with a structured revert entry recorded in the plugin's hidden state. *[ref: every-plugin-code-change-test-gate | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh:458-472 + .claude/plugins/plugin_integrity/scripts/safe-lock.sh:283-305 | Auto-lock trigger (plugin-guard.sh:458-472): when an edit lands outside the unlocked plugin, plugin-guard fires `bash "$SAFE_LOCK_SH" "$current"` (line 468). Voice message at line 467: "AUTO-LOCK: Editing outside plugins/ — locking $current (running tests)." Test-then-commit-or-revert branch (safe-lock.sh:283-305): `if [[ "$all_pass" == "true" ]]` → `git commit` + clear lock; `else` → revert with `log_revert` entry. The gate is the always-on guarantee.]*

That gate is the most universal pattern in the seed-agent prototype. Every plugin's code is protected by it. Every architect who adopts this architecture inherits it.

The fuller ceremony — the `[PLUGIN-LOCK]` unlock question, the historian ratchet, the full lock-cmd flow — is deconstructed across two threads. [Essay 5.8](05_8-historian-ratchet.html) shows how three single-concern plugins compose into the historian ratchet, and the [Essay 7 series](07-the-plugin-kit.html) on the plugin kit (currently a monolith; we will split it into a sub-essay series the same way we split Essay 5) walks the full anatomy of every plugin. What `plugin_integrity` contributes to that ceremony is what this essay names: the always-on test gate behind every plugin edit and the auto-revert backstop when the tests fail. The rest of the ceremony belongs to other plugins that compose through it.

## Friction calibrated by danger

The lock is not one stage; it is two. `[PLUGIN-LOCK]` opens a plugin's code surfaces for editing. Inside that already-unlocked plugin, the **test files** sit behind a second lock — `[TEST-LOCK]` — that has to be opened by name, one test file at a time. Two ceremonies to edit a test; one to edit a script; zero to write into `CLAUDE.md`. *[ref: test-lock-second-stage | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:390-440 + .claude/plugins/plugin_integrity/hooks/voice.xml:101-130 | `[TEST-LOCK]` handler at lock-manager.sh:390 — strict format `[TEST-LOCK] <filename.sh>`, 100-word body floor mirroring `[PLUGIN-LOCK]`, must include option label `Unlock test <file>`. Stores target in `data.json.unlocked_test`. Voice id `test-lock-short-description` (voice.xml:108) carries the WHY: "test files are the safety net — unlocking one without prior thought risks accidental coverage loss or regression-test corruption." The two-stage gate is the explicit mechanism.]*

This is deliberate. The test suite IS the safety net under every plugin edit; unlocking a test file accidentally would silently degrade the very gate the rest of the plugin trusts. The norm the prototype operates under is roughly **80% coverage** on each plugin — every established behavior carries a test, every test carries a `[TEST-LOCK]`-gated edit ceremony, every ceremony forces the seed agent to articulate *which* behavior is being added or fixed, *which* fixtures move, and what the suite asserts before-and-after. The friction is the point.

The shape generalizes beyond this prototype. **Friction tracks danger.** Reading any file passes freely. Editing a plugin's code passes through one ceremony. Editing a plugin's test passes through two. Bypassing the safety net via gmode requires a hundred-word justification the architect (you) types. The seed agent is not slow at every step; it is slow at the steps where slow is safer than fast. Your customization door is here: as you cultivate your own seed, you choose where the gates sit and how steep each one is.

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/plugin-integrity-b5-2.png
  Concept: Chalk-on-blackboard cross-section — a single plugin's directory drawn as nested boxes, with two distinct chalk gates stacked outside-in: an outer `[PLUGIN-LOCK]` gate over the plugin's code files (hooks/, scripts/, config), and a second inner `[TEST-LOCK]` gate over the tests/ subdirectory. Outside both gates, a third chalk lane shows documentation surfaces (CLAUDE.md, docs/) flowing through with no gate. A small "auto-revert circuit" sketched at the bottom edge: test run → pass arrow commits, fail arrow reverts to a chalk-marked git checkpoint.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and nested rectangles;
  pastel chalk fills (cyan for the plugin envelope, green for code files, orange for the test files inner box, pink for the auto-revert circuit, magenta for the documentation lane);
  white chalk for ALL labels, gate names, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Left two-thirds — a single nested-box plugin sketch:
    Outermost dashed chalk box (cyan fill) labeled IN WHITE CHALK exactly: "plugins/<your_plugin>/"
    Inside it, an UNLOCKED chalk gate drawn as a small white-chalk gateway with the label "[PLUGIN-LOCK]" written ABOVE it. To the right of the gate, three small chalk cells (green fill) labeled exactly: "hooks/", "scripts/", "config".
    Below those, a SECOND nested box (orange fill) labeled IN WHITE CHALK exactly: "tests/". A second chalk gateway labeled "[TEST-LOCK]" guards the entry to this inner box.
    BELOW everything, a separate chalk lane (magenta fill) labeled IN WHITE CHALK exactly: "CLAUDE.md + docs/ — free". A straight white-chalk arrow points from outside the plugin directly into this lane, bypassing both gates.
  Right one-third — a small pink-fill chalk circle labeled "auto-revert" containing the literal text "tests → pass / fail" and two outgoing arrows: a pass arrow leading to the literal label "commit", a fail arrow leading to the literal label "revert to checkpoint".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "plugins/<your_plugin>/", "[PLUGIN-LOCK]", "[TEST-LOCK]", "hooks/", "scripts/", "config", "tests/", "CLAUDE.md + docs/ — free", "auto-revert", "tests → pass / fail", "commit", "revert to checkpoint", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.2. Two stages of unlock, one auto-revert circuit — friction calibrated by danger. Plugin code passes one gate; test files pass two; documentation flows through with none."
-->

## What would break without it

Without `plugin_integrity`, every plugin edit is a hope. Run a change, hope the change works, hope you remembered to run the tests, hope you didn't forget to commit, hope the next session inherits a working codebase. Sloppy edits inside one plugin corrupt the discipline of every other plugin that depends on it, because plugins compose — they call each other's public surfaces, share marker protocols, lift each other's prefixes. One quiet regression deep inside a plugin's hooks can poison every dispatched subagent, every phase gate, every voice fire across the session. The always-on test gate is what makes a complex composing-plugin architecture safely modifiable in the first place. *[ref: without-plugin-integrity-every-edit | .claude/plugins/plugin_integrity/CLAUDE.md:6 | Objective verbatim: "No plugin can be silently broken. Every change is isolated (one plugin), approved (user gate), and verified (tests gate). The safety net itself (test files) is also protected. data.json is hidden state — unreadable and uneditable directly. Phase transitions and plugin switches require an active lock close-out — auto-revert is the catch-all backstop, not the primary path." The plugin's own framing of why the gate exists.]*

## What you would customize

`plugin_integrity` is the rare always-on plugin most architects **inherit, not rewrite**. The test gate is the universal floor — every plugin code change should pass through it, no matter what the plugin does. Replacing it makes the architecture less safe, not more. But the inside of the gate has knobs.

You would tune the *threshold* — what counts as "test pass." The current prototype runs every test in the plugin's `tests/` directory and treats them uniformly. A larger plugin with hundreds of tests may want fast-and-slow tiers (smoke tests block the unlock; full suite runs in CI). A plugin generating non-deterministic output may need flake tolerance encoded in the gate. *[ref: plugin-integrity-test-runner | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:200-225 | Loop iterates every `tests/test-*.sh`, captures PASS/FAIL per file, aggregates `all_pass` (line 222: `all_pass=false` on any fail). Single tier; equal weight. Threshold customization would slot here.]*

You would tune the *prefix registry* used by the unlock ceremony. The current registry holds ten entries; your seed will hold more. Each registered prefix carries its own word floor, its own format, its own Post handler. Adding a ceremony means adding to the registry, writing the handler, wiring the voice. The registry is the surface; the entries are yours. *[ref: prefix-registry-current-entries | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:66-77 | `readonly PREFIX_REGISTRY` bash array — ten entries as of 2026-05-14: `[PLUGIN-LOCK]`, `[TEST-LOCK]`, `[GMODE]`, `[JOB-COMPLETE]`, `[PLAN-APPROVAL]`, `[YAML-APPROVAL]`, `[POINT-BOOST]`, `[WAITING]`, `[REPORT-TO-UPSTREAM]`, `[JOB-APPROVE-CREATION]`. Adding a prefix = editing this array + adding the Post handler in the owning plugin + wiring the voice (per `question_discipline/CLAUDE.md` Maintenance Rules).]*

You would extend the *revert log* schema. The current entries record what was reverted, by whom, when, with which checkpoint SHA. Your seed may want to record which test failed (the exact assertion), which file the regression lived in, which prior cycle introduced the dependency that the failing test was checking. Richer revert logs make debugging in CONDENSE — the phase that absorbs experiential data — substantially faster. *[ref: revert-log-schema | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:246-272 | `log_revert()` writes a JSON entry to `data.json.revert_log` (capped at 20 — line 269 trim). Current fields: timestamp, plugin, sha_before, sha_after, reverted_files. Schema is extensible — adding new fields requires only a schema-version bump and a corresponding reader.]*

You would extend the *friction gradient* itself. The prototype has two unlock stages (plugin code, then test files); your seed may add more — a third stage for hidden state files (`data.json`), a fourth for hooks that hold global side effects, a separate ceremony for cross-plugin contract changes. Each stage you add is a place where the seed agent's velocity drops on purpose, because the work at that stage is more dangerous than the work one stage above it. The principle stays: routine reads pass freely, dangerous edits pass slowly, and how slowly is calibrated by you.

What you would **not** do is remove the safety net itself. The test gate is the floor; the floor stays.

---

The next part covers the second always-on plugin — the one that owns the seed agent's relationship to the model's context window.

---

*Essay 5.2 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.1 — The Two-Layer Foundation](05_1-the-two-layer-foundation.html) — two plugin categories above one substrate.*
*Next: [Essay 5.3 — Context Window Discipline (`brain_guard`)](05_3-brain-guard.html) — the self-compaction tiers and the architectural fact behind them.*
