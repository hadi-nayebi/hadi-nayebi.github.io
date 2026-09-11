---
title: "The Historian Ratchet"
date: "May 18, 2026"
slug: "historian-ratchet"
read_time: "10 min"
tags: [Architecture, Seed Agent, Plugins, Composed Ceremony]
status: published
version: v0.4.0
audience: "Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The Historian Ratchet

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

---

In the historical Claude-based reference architecture traced in this series, [Essay 5.7](05_7-claude-md-hierarchy.html) built the working-memory form — a hierarchy of project instruction files with its four-footer protocol and altered-list gate. This part closes the essay's deep-dive set with one example of what the always-on layer can *do* when its single-concern plugins compose: several narrow plugins participate in one protected editing ceremony, without any one of them owning the whole ceremony.

---

## Per-plugin living history

For the architects in the audience: the historian ratchet we sketched earlier is worth examining in detail, because it captures the discipline of the whole always-on layer. *[ref: historian-ratchet-captures-discipline | private historical prototype | Claim checked against a private historical prototype.]*

In that prototype, every plugin has a file called `evolution.md`. It is a word-capped narrative (the prototype caps it at a few thousand words; your seed can tune the cap) of how the plugin got to its current state — what was added, what was rejected, what was learned during which cycle. It is auto-injected into the agent's context whenever the plugin is unlocked for editing. Think of it as the per-plugin counterpart to a durable conversation summary. The conversation summary carries the user-agent exchange across compactions; `evolution.md` carries the summary of the plugin's own life across cycles. Where `git log` keeps the mechanical record, `evolution.md` keeps the narrative one. *[ref: every-plugin-has-evolution-md | private historical prototype | Claim checked against a private historical prototype.]*

The naive version of this would be: "documentation that updates itself when the plugin changes."

The seed agent's version is sharper.

## The drift counter and the block

When the agent attempts to unlock a plugin for editing — by issuing a question with the prefix `[PLUGIN-LOCK] <plugin_name>` — the lock manager runs a small drift-check against the target plugin. The check is a single git command that counts how many commits have touched the plugin since the last time its evolution narrative was synced. The result is the *drift count*: the number of commits the plugin has accumulated since its history was last narrated. If that count meets or exceeds a configurable threshold (currently ten in the prototype), the unlock is *blocked* and the agent is told to dispatch the plugin's historian subagent first. *[ref: plugin-lock-prefix-runs-drift-check | private historical prototype | Claim checked against a private historical prototype.]*

Each plugin has its own dedicated historian, so the narrative voice for each plugin stays consistent across its lifetime. The prototype generates these historians from a shared template while keeping each historian's scope tied to one plugin. *[ref: historians-named-and-centrally-located | private historical prototype | Claim checked against a private historical prototype.]*

When dispatched, the plugin's historian reads the drift log, synthesizes what changed since the last sync, and edits `evolution.md` under the word cap enforced by a dedicated hook that blocks any edit which would push the file past it. When the cap fires, the block does more than refuse — it coaches the historian to retry with a tighter narrative and to migrate any overflow into sibling documents (per-cycle deep-dives, a decisions log, technical appendices), with `evolution.md` becoming an executive summary that references those siblings rather than absorbing them. *[ref: historians-live-centrally-template | private historical prototype | Claim checked against a private historical prototype.]*

The historian's last mandatory step is to commit. That commit touches `evolution.md`, which becomes the new sync point, which means the drift counter resets to zero — and the next set of edits will eventually push it back up, and the cycle repeats. *[ref: commit-resets-sync-point-to-zero | private historical prototype | Claim checked against a private historical prototype.]*

This is the **ratchet pattern**. A plugin cannot be edited indefinitely without periodically forcing the historian to re-narrate its evolution. Several mechanisms enforce it together: the drift counter that measures elapsed commits, the block that refuses unlock at the threshold, and the historian's own commit that resets the counter — without that reset, the next `[PLUGIN-LOCK]` deadlocks. *[ref: this-is-the-ratchet-pattern | private historical prototype | Claim checked against a private historical prototype.]*

The pattern is portable. Anywhere a system needs to enforce a discipline-that-must-be-done-eventually, the same shape works: a counter that climbs with normal work, a block that fires when the counter crosses a threshold, and a corrective action whose own completion resets the counter. A consulting practice could install the same ratchet on client-deliverable templates: a counter climbs with every template edit, blocks the next checkout at a threshold, and only the practice lead's narrative re-sync (what changed, why, what's still open) resets it. The discipline becomes mechanically inescapable.

The lesson is small: **read the work before changing it**.

The mechanism makes the lesson non-negotiable. The agent is not *suggested* to re-read the plugin's history before editing — a suggestion would be ignored under deadline pressure. The lock blocks. The historian runs. Only then can the work proceed. There is no quiet way around it. `GMODE` — the operator's deliberate maintenance lane, entered only by writing a long `[GMODE]` justification (the prototype sets a word floor; your seed can tune it) — lifts the OPEVC *phase* controls but not the always-on layer beneath them. `plugin_integrity` keeps enforcing in gmode, so a `[PLUGIN-LOCK]` there still hits the drift gate and the historian still has to run before the plugin unlocks. The ratchet is part of the substrate the maintenance lane rests on, not something the lane steps over. *[ref: lock-blocks-historian-runs | private historical prototype | Claim checked against a private historical prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/historian-ratchet-b5-8.png
  Concept: Chalk-on-blackboard wheel — plugin_integrity's historian ratchet: drift counter climbs with commits, blocks at threshold, historian subagent re-narrates, counter resets.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk circles and arrows;
  pastel chalk for the four step nodes (cyan = Step 1, green = Step 2, orange = Step 3, pink = Step 4);
  white chalk for ALL labels, counter values, and arrows; chalk sticks at the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent other plugin names, file names, threshold values, or captions.
  Layout: Four pastel chalk circles arranged in a wheel (top → right → bottom → left), connected clockwise by short curving white-chalk arrows.
    Step 1 circle (top, cyan fill): inside or beside it draw a small stack of chalk commit-square icons growing upward, plus a chalk counter labeled in white chalk exactly "drift_count = 1, 2, 3, ..." — caption above the circle in white chalk reads exactly "Step 1: plugin commits accumulate".
    Step 2 circle (right, green fill): inside or beside it draw the counter redrawn in pink chalk reading exactly "drift_count ≥ DRIFT_THRESHOLD (default 10)", plus a small chalk barrier in front of a chalk tag labeled in white chalk exactly "[PLUGIN-LOCK]" — caption above the circle in white chalk reads exactly "Step 2: drift threshold crossed, unlock blocked".
    Step 3 circle (bottom, orange fill): inside or beside it draw a small chalk figure reading a chalk commit log and writing into a chalk file labeled in white chalk exactly "docs/evolution.md"; next to the file a vertical chalk fill-bar marked exactly "MAX_EVOLUTION_WORDS = 2000" — caption above the circle in white chalk reads exactly "Step 3: historian-${plugin_name} subagent dispatched".
    Step 4 circle (left, pink fill): inside or beside it draw the counter snapping back, labeled in white chalk exactly "drift_count = 0", and the chalk barrier dissolving — caption above the circle in white chalk reads exactly "Step 4: historian commits, drift resets".
  At the center of the wheel, a small white-chalk caption reads exactly: "work cannot proceed without periodic narration".
  Keep all arrows slightly curved and hand-drawn, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "Step 1: plugin commits accumulate", "Step 2: drift threshold crossed, unlock blocked", "Step 3: historian-${plugin_name} subagent dispatched", "Step 4: historian commits, drift resets", "drift_count = 1, 2, 3, ...", "drift_count ≥ DRIFT_THRESHOLD (default 10)", "drift_count = 0", "[PLUGIN-LOCK]", "docs/evolution.md", "MAX_EVOLUTION_WORDS = 2000", "work cannot proceed without periodic narration". No other words, plugin names, or file names may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.8.1. Drift climbs with every commit, blocks the next unlock at the threshold, and resets only when the historian re-narrates the plugin's evolution."
-->

## Composed ceremony from single-concern plugins

The full lock-and-edit ceremony looks like one mechanism, but it is actually a small ring of single-concern plugins working together. Recall the plugin sketch from earlier — here it is in full.

The agent must be able to ask a `[PLUGIN-LOCK]` question. That depends on `question_discipline` recognizing the prefix and letting the question through; without that registration, the call is blocked before the user even sees it. The user's answer must then be captured and routed to the lock manager. That depends on `job_core`'s split pre-call/post-call pair, which validates the question, captures the approval, and hands the result over. Finally, the edit must close cleanly under test. That depends on `plugin_integrity`'s own safe-lock cycle, which runs the plugin's test suite when the lock closes and reverts the working tree if the tests fail. *[ref: agent-must-ask-plugin-lock-question | private historical prototype | Claim checked against a private historical prototype.]*

The integrity plugin owns the historian ratchet itself: the drift check, the block, and the reset. The broader protected editing ceremony composes several single-concern plugins — one opens the asking surface, one carries the answer, and the integrity plugin protects the edit. Each plugin owns its own narrow concern. The full ceremony emerges from the way they fit together. The [Essay 7 series](../b7/07_1-plugin-kit-foundation.html) takes the integrity plugin apart on its own terms — the lock-and-historian mechanism as a single plugin's anatomy. *[ref: no-single-plugin-enforces-ratchet | private historical prototype | Claim checked against a private historical prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/historian-ratchet-b5-8b.png
  Concept: Chalk-on-blackboard composition — three single-concern plugins fitting together into the broader protected editing ceremony, each contributing its own narrow concern.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk tiles and a connecting arc;
  pastel chalk for each plugin tile (cyan = Tile 1, green = Tile 2, orange = Tile 3);
  white chalk for ALL labels, the arc, and the substrate slab; chalk sticks at the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Plugin names use UNDERSCORES, not hyphens. Do not invent other plugin names or substrate labels.
  Layout: Three pastel chalk tiles arranged left to right, side by side on the board.
    Tile 1 (cyan fill): plugin-name label in white chalk reads exactly "question_discipline"; inside the tile, draw a small chalk tag labeled exactly "[PLUGIN-LOCK]" passing through a chalk gate; caption below the tile in white chalk reads exactly "opens the asking surface".
    Tile 2 (green fill): plugin-name label in white chalk reads exactly "job_core"; inside the tile, draw a chalk question-and-answer pair being captured into a chalk container labeled exactly "job"; caption below the tile in white chalk reads exactly "carries the answer".
    Tile 3 (orange fill): plugin-name label in white chalk reads exactly "plugin_integrity"; inside the tile, draw a chalk shield around a chalk folder labeled exactly "plugins/<name>/" plus a chalk checkpoint marker labeled exactly "git checkpoint"; caption below the tile in white chalk reads exactly "protects the edit".
  Above the three tiles, a curving white-chalk arc labeled in white chalk exactly "protected plugin-edit ceremony" connects them, suggesting emergence from composition.
  Below all three tiles, a long horizontal chalk slab labeled in white chalk exactly "the agent substrate" sits as the shared substrate.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "question_discipline", "job_core", "plugin_integrity", "[PLUGIN-LOCK]", "job", "plugins/<name>/", "git checkpoint", "opens the asking surface", "carries the answer", "protects the edit", "protected plugin-edit ceremony", "the agent substrate". No other plugin names or labels may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.8.2. One plugin owns the historian ratchet; three single-concern plugins compose the broader protected editing ceremony."
-->

Call this **composed ceremony**: narrow parts, structured interfaces, emergent rituals — the same shape as the compaction file's five sections, the same shape as the ratchet itself. Narrow constraints composing into behaviors larger than any single constraint. *[ref: composed-ceremony-narrow-parts | private historical prototype | Claim checked against a private historical prototype.]*

The always-on layer is not a stack of independent guardrails sitting in parallel. It is a small, deliberate ring of single-concern guardrails composing into ceremonies none of them could enforce alone. Your next always-on plugin will join the ring — and the ring's shape, not its current membership, is what carries forward into your own seed. *[ref: small-deliberate-ring-guardrails | private historical prototype | Claim checked against a private historical prototype.]*

That's the always-on layer in microcosm. Each plugin a small lesson. Each lesson backed by mechanical enforcement. Discipline the filesystem itself preserves.

---

## The bus is just one form of substrate

The bus we built across the project-instruction hierarchy is one form in the historical reference architecture — the working-memory form, the one the phasic layer writes through. The hierarchy itself, the always-on layer, the durable knowledge store, the per-plugin hidden state, the voice catalogues, and the subagent definitions together form the multi-form *digital cortex* the seed agent rests on. They keep state, enforce work structure, and discipline conversation, all without doing any of the actual cognitive work. *[ref: bus-is-substrate-digital-cortex | private historical prototype | Claim checked against a private historical prototype.]*

The actual work happens in the phasic layer. Compartmentalized phases (currently five in the prototype). One cognitive organ called CONDENSE. Tools forbidden in each phase that force the agent to think before acting. *[ref: actual-work-in-phasic-layer | private historical prototype | Claim checked against a private historical prototype.]*

The substrate is what makes the architecture *teachable*. A non-developer with enough high-level architectural understanding can customize a seed agent the way someone with the right training can author a complex artifact — without writing the underlying machinery. The destination this series carries you toward is an agent-developer-user triangle that collapses to agent-user, because the architecture is portable enough that the user can be the architect.

But a bus is just substrate. What USES it intelligently — that's the phasic brain.

Next.

---

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

*Previous: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — substrate, four-footer protocol, altered-list gate.*
*Next: [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the gate that decides when substrate edits are admitted at all.*
