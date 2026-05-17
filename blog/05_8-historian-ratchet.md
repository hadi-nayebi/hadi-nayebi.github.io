---
title: "The Historian Ratchet"
date: "May 2026"
slug: "historian-ratchet"
read_time: "10 min"
tags: [Architecture, Seed Agent, Plugins, Composed Ceremony]
status: draft
version: v0.3.0
audience: "Tier 3"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# The Historian Ratchet

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

---

[Essay 5.7](05_7-claude-md-hierarchy.html) built the working-memory form — the CLAUDE.md hierarchy with its four-footer protocol and altered-list gate. This part closes the essay's deep-dive set with one example of what the always-on layer can *do* when its single-concern plugins compose. Three plugins, one ceremony, no plugin owning the whole thing.

For the architects in the audience.

---

## Per-plugin living history

For the architects in the audience: the historian ratchet we sketched earlier is worth examining in detail, because it captures the discipline of the whole always-on layer. *[ref: historian-ratchet-captures-discipline | .claude/plugins/plugin_integrity/CLAUDE.md:99-109 | plugin_integrity "Historian Mechanism" section: drift gate (`drift-check.sh`) + word cap (`evolution-cap.sh`) + 13 historian agents on disk (11 attached to active plugins + 2 reserved for the unimplemented `job_archiver` / `job_blocker` plugin designs). "The ratchet: every historian commit increments its own plugin's drift counter, so a future lock will eventually demand a re-sync."]*

Every plugin has a file called `evolution.md`. It is a word-capped narrative (currently 2000 words) of how the plugin got to its current state — what was added, what was rejected, what was learned during which cycle. It is auto-injected into the agent's context whenever the plugin is unlocked for editing. Think of it as the per-plugin counterpart to `interaction_summary`'s durable conversation memory. `interaction_summary` carries the summary of the user-agent conversation across compactions; `evolution.md` carries the summary of the plugin's own life across cycles. Where `git log` keeps the mechanical record, `evolution.md` keeps the narrative one. *[ref: every-plugin-has-evolution-md | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:351-378 | Lock unlock builds `[LIVING HISTORY (evolution.md)]` (the `evo_section` assembly at L356-360) from the evolution.md path under each plugin's `docs/`, with a no-evolution.md fallback. Injected via `hookSpecificOutput.additionalContext` at L378's jq emit. Word cap at `evolution-cap.sh:37 — MAX_EVOLUTION_WORDS=2000`.]*

The naive version of this would be: "documentation that updates itself when the plugin changes."

The seed agent's version is sharper.

## The drift counter and the block

When the agent attempts to unlock a plugin for editing — by issuing a question with the prefix `[PLUGIN-LOCK] <plugin_name>` — the lock manager runs a small drift-check against the target plugin. The check is a single git command that counts how many commits have touched the plugin since the last time its evolution narrative was synced. The result is the *drift count*: the number of commits the plugin has accumulated since its history was last narrated. If that count meets or exceeds a configurable threshold (default ten), the unlock is *blocked* and the agent is told to dispatch the plugin's historian subagent first. *[ref: plugin-lock-prefix-runs-drift-check | .claude/plugins/plugin_integrity/scripts/drift-check.sh:46 | Single git command: `git rev-list --count "${LAST_SYNC_COMMIT}..HEAD" -- "$PLUGIN_DIR"` counts commits to the plugin since the last `evolution.md` sync. `config.conf:23 DRIFT_THRESHOLD=10` is the block threshold.]*

Each plugin has its own dedicated historian — `historian-brain-guard`, `historian-phasic-system`, `historian-job-core`, and so on (thirteen in the prototype, twelve of which live centrally inside `plugin_integrity`'s own folder, with `historian-question-discipline` living alongside its own plugin) — so the narrative voice for each plugin stays consistent across its lifetime. The template that new plugins clone from when they are born lives in `plugin_integrity/template/_historian.md`. When dispatched, the plugin's historian reads the drift log, synthesizes what changed since the last sync, and edits `evolution.md` under a 2000-word cap enforced by a dedicated hook that blocks any edit which would push the file past the cap. When the cap fires, the block does more than refuse — it coaches the historian to retry with a tighter narrative and to migrate any overflow into sibling documents (per-cycle deep-dives, a decisions log, technical appendices), with `evolution.md` becoming an executive summary that references those siblings rather than absorbing them. The historian's last mandatory step is to commit. That commit touches `evolution.md`, which becomes the new sync point, which means the drift counter resets to zero — and the next set of edits will eventually push it back up, and the cycle repeats. *[ref: historians-live-centrally-template | .claude/plugins/plugin_integrity/template/_historian.md:1-25 | Historian template with `{{PLUGIN_DASHED}}`/`{{PLUGIN_NAME}}` substitution — every plugin clones this on birth. Lines 17-19 define EDIT scope, 2000-word cap on `evolution.md`, overflow archives (`docs/decisions.md`, `docs/lessons.md`). 12 of 13 historians live centrally in `plugin_integrity/agents/`; `historian-question-discipline.md` lives in `question_discipline/agents/` alongside its plugin (`find .claude/plugins -name "historian-*.md"` returns 13 total).]*

This is the **ratchet pattern**. A plugin cannot be edited indefinitely without periodically forcing the historian to re-narrate its evolution. Three mechanisms enforce it together: the drift counter that measures elapsed commits, the block that refuses unlock at the threshold, and the historian's own commit that resets the counter — without that reset, the next `[PLUGIN-LOCK]` deadlocks. *[ref: this-is-the-ratchet-pattern | .claude/plugins/plugin_integrity/hooks/voice.xml:154 | Canonical voice `plugin-evolution-stale`: "BLOCKED: {{plugin}} evolution.md is outdated ({{drift}} commits since last update)... drift gate keeps the per-plugin living history fresh... EXPECTED STATE on historian commit: drift resets to 0, [PLUGIN-LOCK] {{plugin}} succeeds."]*

The pattern is portable. Anywhere a system needs to enforce a discipline-that-must-be-done-eventually, the same shape works: a counter that climbs with normal work, a block that fires when the counter crosses a threshold, and a corrective action whose own completion resets the counter. The discipline becomes mechanically inescapable.

The lesson is small: **read the work before changing it**.

The mechanism makes the lesson non-negotiable. The agent is not *suggested* to re-read the plugin's history before editing — a suggestion would be ignored under deadline pressure. The lock blocks. The historian runs. Only then can the work proceed.

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/historian-ratchet-b5-4.png
  Concept: Chalk-on-blackboard wheel — plugin_integrity's historian ratchet: drift counter climbs with commits, blocks at threshold, historian subagent re-narrates, counter resets.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk circles and arrows;
  pastel chalk for the four stage nodes (cyan = Stage 1, green = Stage 2, orange = Stage 3, pink = Stage 4);
  white chalk for ALL labels, counter values, and arrows; chalk sticks at the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent other plugin names, file names, threshold values, or captions.
  Layout: Four pastel chalk circles arranged in a wheel (top → right → bottom → left), connected clockwise by short curving white-chalk arrows.
    Stage 1 circle (top, cyan fill): inside or beside it draw a small stack of chalk commit-square icons growing upward, plus a chalk counter labeled in white chalk exactly "drift_count = 1, 2, 3, ..." — caption above the circle in white chalk reads exactly "Stage 1: plugin commits accumulate".
    Stage 2 circle (right, green fill): inside or beside it draw the counter redrawn in pink chalk reading exactly "drift_count ≥ DRIFT_THRESHOLD (default 10)", plus a small chalk barrier in front of a chalk tag labeled in white chalk exactly "[PLUGIN-LOCK]" — caption above the circle in white chalk reads exactly "Stage 2: drift threshold crossed, unlock blocked".
    Stage 3 circle (bottom, orange fill): inside or beside it draw a small chalk figure reading a chalk commit log and writing into a chalk file labeled in white chalk exactly "docs/evolution.md"; next to the file a vertical chalk fill-bar marked exactly "MAX_EVOLUTION_WORDS = 2000" — caption above the circle in white chalk reads exactly "Stage 3: historian-${plugin_name} subagent dispatched".
    Stage 4 circle (left, pink fill): inside or beside it draw the counter snapping back, labeled in white chalk exactly "drift_count = 0", and the chalk barrier dissolving — caption above the circle in white chalk reads exactly "Stage 4: historian commits, drift resets".
  At the center of the wheel, a small white-chalk caption reads exactly: "work cannot proceed without periodic narration".
  Keep all arrows slightly curved and hand-drawn, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "Stage 1: plugin commits accumulate", "Stage 2: drift threshold crossed, unlock blocked", "Stage 3: historian-${plugin_name} subagent dispatched", "Stage 4: historian commits, drift resets", "drift_count = 1, 2, 3, ...", "drift_count ≥ DRIFT_THRESHOLD (default 10)", "drift_count = 0", "[PLUGIN-LOCK]", "docs/evolution.md", "MAX_EVOLUTION_WORDS = 2000", "work cannot proceed without periodic narration", plus the caption below. No other words, plugin names, or file names may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.8.1. Drift climbs with every commit, blocks the next unlock at the threshold, and resets only when the historian re-narrates the plugin's evolution."
-->

## Three plugins, one ceremony

The ratchet looks like one mechanism, but it is actually three plugins working together. Recall the three-plugin sketch from earlier — here it is in full.

The agent must be able to ask a `[PLUGIN-LOCK]` question. That depends on `question_discipline` recognizing the prefix and letting the question through; without that registration, the call is blocked before the user even sees it. The user's answer must then be captured and routed to the lock manager. That depends on `job_core`'s split pre-call/post-call pair, which validates the question, captures the approval, and hands the result over. Finally, the edit must close cleanly under test. That depends on `plugin_integrity`'s own safe-lock cycle, which runs the plugin's test suite when the lock closes and reverts the working tree if the tests fail. *[ref: agent-must-ask-plugin-lock-question | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:376-382 | Revert execution when tests fail: `find "$plugin_dir" -mindepth 1 -delete` + `git checkout "$checkpoint" -- "$plugin_dir/"` + `git reset HEAD`. The working tree returns to the pre-unlock checkpoint. No partial edits survive a failed test run.]*

No single plugin enforces the historian ratchet. Three plugins compose to make it possible — `question_discipline` opens the asking surface, `job_core` carries the answer, `plugin_integrity` protects the edit. Each plugin owns its own narrow concern. The ceremony emerges from the way they fit together. The [Essay 7 series](07_1-plugin-kit-foundation.html) takes `plugin_integrity` apart on its own terms — the lock-and-historian ceremony as a single plugin's anatomy. *[ref: no-single-plugin-enforces-ratchet | .claude/plugins/CLAUDE.md:158-159 | Plugin Building Lessons: "Plugins own their own controls — don't extend another plugin's guard for your concerns" + "Soft controls belong inside plugins". Single-concern boundary that lets ceremonies compose from narrow parts.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/historian-ratchet-b5-5.png
  Concept: Chalk-on-blackboard composition — three single-concern plugins fitting together into the historian-ratchet ceremony.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk tiles and a connecting arc;
  pastel chalk for each plugin tile (cyan = Tile 1, green = Tile 2, orange = Tile 3);
  white chalk for ALL labels, the arc, and the substrate slab; chalk sticks at the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Plugin names use UNDERSCORES, not hyphens. Do not invent other plugin names or substrate labels.
  Layout: Three pastel chalk tiles arranged left to right, side by side on the board.
    Tile 1 (cyan fill): plugin-name label in white chalk reads exactly "question_discipline"; inside the tile, draw a small chalk tag labeled exactly "[PLUGIN-LOCK]" passing through a chalk gate; caption below the tile in white chalk reads exactly "opens the asking surface".
    Tile 2 (green fill): plugin-name label in white chalk reads exactly "job_core"; inside the tile, draw a chalk question-and-answer pair being captured into a chalk container labeled exactly "job"; caption below the tile in white chalk reads exactly "carries the answer".
    Tile 3 (orange fill): plugin-name label in white chalk reads exactly "plugin_integrity"; inside the tile, draw a chalk shield around a chalk folder labeled exactly "plugins/<name>/" plus a chalk checkpoint marker labeled exactly "git checkpoint"; caption below the tile in white chalk reads exactly "protects the edit".
  Above the three tiles, a curving white-chalk arc labeled in white chalk exactly "historian ratchet ceremony" connects them, suggesting emergence from composition.
  Below all three tiles, a long horizontal chalk slab labeled in white chalk exactly "the .claude/ substrate (multi-form: CLAUDE.md hierarchy + plugin data.json + voice.xml + agents/ + knowledge/)" sits as the shared substrate.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "question_discipline", "job_core", "plugin_integrity", "[PLUGIN-LOCK]", "job", "plugins/<name>/", "git checkpoint", "opens the asking surface", "carries the answer", "protects the edit", "historian ratchet ceremony", "the .claude/ substrate (multi-form: CLAUDE.md hierarchy + plugin data.json + voice.xml + agents/ + knowledge/)", plus the caption below. No other plugin names or labels may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.8.2. No single plugin enforces the ratchet — three single-concern plugins compose the ceremony, each contributing what it owns."
-->

Call this **composed ceremony**: narrow parts, structured interfaces, emergent rituals — the same shape as the `/compact` five-section template, the same shape as the ratchet itself. Narrow constraints composing into behaviors larger than any single constraint. *[ref: composed-ceremony-narrow-parts | .claude/plugins/CLAUDE.md:170-176 | Control Types in Plugins: "Hard controls — hooks that block (exit 2)" + "Soft controls — injections that guide via voice" + "Structural controls — design choices that make bypass impossible". Each plugin mixes all three; emergent behavior from narrow control forms.]*

The always-on layer is not a stack of independent guardrails sitting in parallel. It is a small, deliberate ring of single-concern guardrails composing into ceremonies none of them could enforce alone. Your fourth plugin will join the ring — and the ring's shape, not its current membership, is what carries forward into your own seed. *[ref: small-deliberate-ring-guardrails | .claude/plugins/CLAUDE.md:160 | Plugin Building Lesson: "Verify problems exist before creating jobs... Example: 'session awareness' was already solved by stop-gate + UPS composing into a closed system." Two single-concern plugins compose into emergent system behavior.]*

That's the always-on layer in microcosm. Each plugin a small lesson. Each lesson backed by mechanical enforcement. Discipline the filesystem itself preserves.

---

## The bus is just one form of substrate

The bus we built up across the CLAUDE.md hierarchy is one form within `.claude/` — the working-memory form, the one the phasic layer writes through. The hierarchy itself, the always-on layer, the durable knowledge directory, the per-plugin hidden state, the voice files, the subagent definitions — together they form the multi-form *digital cortex* the seed agent rests on. They keep state, enforce work structure, and discipline conversation, all without doing any of the actual cognitive work. *[ref: bus-is-substrate-digital-cortex | CLAUDE.md "Spatial level:" bullets under "Core Principle: Compartmentalization" | Spatial-level Compartmentalization names three axes: "Brain vs Project — agent thinking stays in `.claude/`, published content in the website repo"; "Knowledge vs Working Memory — long-term storage in `knowledge/`, current context in CLAUDE.md"; "Depth placement — information goes in the CLAUDE.md closest to where it's needed." The 3-layer substrate.]*

The actual work happens in the phasic layer. Five phases. One cognitive organ called CONDENSE. Tools forbidden in each phase that force the agent to think before acting. *[ref: actual-work-in-phasic-layer | CLAUDE.md "JOB.phase" operation under "Specialized Operations" | JOB.phase operation states: "Phase-locked tool access enforces compartmentalization (observe/plan = read-only, execute = full, verify = scripts only, condense = `.claude/` only)." Five phases + CONDENSE organ, tools restricted per phase to force thought before action.]*

The substrate is what makes the architecture *teachable*. A non-developer with enough high-level architectural understanding can customize a seed agent the way someone with the right training can author a complex artifact — without writing the underlying machinery. The destination this series carries you toward is an agent-developer-user triangle that collapses to agent-user, because the architecture is portable enough that the user can be the architect.

But a bus is just substrate. What USES it intelligently — that's the phasic brain.

Next.

---

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

*Previous: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — substrate, four-footer protocol, altered-list gate.*
*Next: [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted at all.*
