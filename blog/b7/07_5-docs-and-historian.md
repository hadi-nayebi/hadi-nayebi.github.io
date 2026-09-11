---
title: "docs/ and the Historian"
date: "May 17, 2026"
slug: "docs-and-historian"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, Historian, Evolution]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# `docs/` and the Historian

*Essay 7.5 — The Plugin Kit, Part 5 of 9.*

---

[Essay 7.4](07_4-data-json-hidden-state.html) opened the data organ — private, script-mediated, mutation-serialized. This sub-essay opens the *documentation* organ — the surface where the plugin carries its own narrated history, what it learned across cycles, why it was shaped the way it was. The hidden state is what the plugin knows about itself *right now*; `docs/` is what it remembers about *how it got here*. The concrete file names come from one historical Claude-based reference architecture; other CLI-agent harnesses can carry the same roles under their own project-instruction conventions.

---

## `docs/` — The Documentation Layer + The Historian

**What it is.** A directory carrying the plugin's narrated knowledge. In the historical reference architecture, these files appear across nearly every plugin:

- a scoped project-instruction file — the directory's own descriptor, naming the conventions its documentation follows (`docs/CLAUDE.md` in the historical Claude implementation; another harness may use `AGENTS.md`, `QWEN.md`, or its own convention).
- `docs/evolution.md` — the plugin's auto-narrated history. Capped at 2,000 words by default, configurable through the plugin's settings, and protected by a pre-edit hook. The historian subagent writes this; the operator typically does not.
- `docs/principles.md` or `docs/decisions.md`, depending on the plugin — overflow surfaces for design rationale that does not fit in `evolution.md`. *[ref: evolution-md-universal-across-plugins | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who reads them.** The agent, especially at plugin unlock — the lock manager injects `docs/evolution.md` into context whenever the operator authorizes an editing session. This is how the editor inherits the plugin's reasoning before touching code. The historian subagent reads `evolution.md` when re-narrating new commits. New users read these files to understand a plugin's lived history before customizing it. *[ref: evolution-md-auto-injected-on-unlock | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who writes them.** The historian subagent writes `docs/evolution.md` when dispatched by the drift-counter ratchet. The operator writes the sibling files (`docs/principles.md`, `docs/decisions.md`) through the harness's authorized edit mode; those surfaces are not under the same auto-narration discipline. *[ref: historian-drift-counter-ratchet | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**What they depend on.** The scoped project-instruction file that names the documentation conventions, the plugin's drift counter inside `data.json`, and the hard-cap hook that blocks an edit when `evolution.md` would exceed its configured limit. *[ref: evolution-cap-2000-word-pretooluse-block | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The relationship between `evolution.md` and its siblings is the architectural heart of the documentation layer.** `evolution.md` is the bounded summary; when the historian's narrative needs more depth, the cap forces overflow into a sibling file — `docs/principles.md` for architectural rationale, `docs/decisions.md` for specific design choices, `docs/lessons.md` for hard-won cycle lessons. The historian decides at narration time where each overflow chunk belongs, and `evolution.md` becomes an index pointing at the siblings. This is the canonical example of soft-versus-hard discipline at the size-cap level: only `docs/evolution.md` carries a hard cap; the siblings absorb the overflow under the historian's judgment. *[ref: evolution-block-message-names-overflow-siblings | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

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

**The new-plugin lens.** When you guide your seed to create a plugin, the seed authors the initial `docs/evolution.md` by hand — a short narrative of the plugin's birth, what concern it owns, what it does not own. The historian subagent takes over after birth, re-narrating later commits into `evolution.md` until it hits the cap. From there, overflow goes into `docs/principles.md` or whichever sibling the plugin's scoped project instructions establish. Tell your seed: *every plugin gets a historian by birth.* Without one, the plugin's memory dies with the operator's session.

A consulting practice's seed could carry the same shape — every plugin (intake, engagement, deliverable QA) ships a `docs/evolution.md` capped narration of how its standards drifted across client cycles, with the historian dispatching after every N engagement-close commits.

**The ratchet fires at the seam.** Drift accumulates silently between unlocks; the next unlock attempt is the seam where the historian-injection voice fires, instructing the agent to invoke the per-plugin historian before proceeding. *[ref: drift-injection-on-unlock-block | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

Documentation is auto-narrated, word-capped, and overflow-routed. The historian writes; the operator reviews; the cap forces compression that protects the per-unlock context budget. The next sub-essay opens the organ where the plugin's *delegated investigation* lives — `agents/`, the per-plugin subagent pool, plus the 80/20 dispatch budget that mechanizes how much direct action the main session is allowed before it must delegate again.

---

*Essay 7.5 — The Plugin Kit, Part 5 of 9.*

*Previous: [Essay 7.4 — `data.json` — The Hidden State](07_4-data-json-hidden-state.html) — private state, script-mediated, atomic mutation.*
*Next: [Essay 7.6 — `agents/` and the 80/20 Dispatch Budget](07_6-agents-and-80-20-budget.html) — per-plugin subagent pools + the budget the main session must earn.*
