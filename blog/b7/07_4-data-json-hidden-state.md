---
title: "data.json — The Hidden State"
date: "May 17, 2026"
slug: "data-json-hidden-state"
read_time: "4 min"
tags: [Architecture, Seed Agent, Plugins, Plugin Kit, State]
status: published
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b7/images/plugin-kit-b7-banner.png"
---

# `data.json` — The Hidden State

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

---

[Essay 7.3](07_3-dual-voice-architecture.html) opened the two voice surfaces — one for the LLM, one for the operator — and named Lock 13 as the policy that governs when soft coaching hardens into a deterministic block. This sub-essay opens the organ that carries the plugin's *state* — and the discipline that keeps it from being corrupted by concurrent reads, partial writes, or cross-plugin reach-arounds. The file names describe one historical Claude-based reference architecture; the broader pattern applies to any CLI-agent harness that keeps plugin-owned state behind a stable interface.

---

## `data.json` — The Hidden State

**What it is.** The plugin's private runtime state. The active focused job, the tier counter, the summary chain, the lock manifest. JSON-encoded, written atomically, lives only on the operator's machine, gitignored. *[ref: data-json-gitignored-per-machine | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who reads it.** ONLY the plugin's own scripts. No other plugin reaches into this file. The discipline is structural: cross-plugin queries route through published read-only commands for facts such as the focused job or current phase, never through a raw read of another plugin's `data.json`. *[ref: published-read-only-commands | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Who writes it.** ONLY the plugin's own scripts. Direct file-system writes are forbidden. Every mutation follows the same protocol: `flock` on a machine-local lockfile serializes concurrent hook fires. Inside the lock, the script reads current state, transforms it through `jq` into a temp file, validates with `jq empty`, then atomically `mv`s over the live file. The reader never sees a partial state. If parsing fails at read time, the gateway script rebuilds cheap state from defaults rather than blocking the agent. *[ref: data-json-flock-tmp-lockfile | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**What it depends on.** The plugin's scripts, which mediate every read and write, plus a shared voice helper for operator-facing errors when validation or atomicity fails. *[ref: voice-helper-sourced-by-lock-manager | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Why the mandatory script-mediation.** Multiple subsystems may fire hooks against the same `data.json` within milliseconds of each other (for example, two pre-tool hooks from the same plugin reading state around one mutation). If both write directly to the file, one can overwrite the other's update. The `flock` discipline serializes all mutations through the script gateway. Reads also go through scripts so each plugin can apply the recovery policy its state requires. *[ref: data-json-fail-safe-rebuild-on-malformed | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**But "fail-safe" is not the same answer everywhere.** Rebuilding is the right move when the lost state is cheap — a tier counter or a phase marker reconstructs from defaults with no harm done. Where the state is *not* cheap, the same corruption demands the opposite reflex. The job-lifecycle stop gate refuses to release the agent while it cannot read the job records: a malformed `data.json` there means the gate fails toward *blocking*, not allowing. Silently resetting job state to a clean slate would erase work the agent has not finished — so the safe outcome is to halt and force a repair, not to wave the agent through on an empty rebuild. Forgiving where loss is cheap; refusing where loss is not. *[ref: data-json-fail-safe-block-on-corrupt-job-state | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The boundary is structural, not OS-level.** An operator who edits `data.json` directly bypasses the protocol entirely. The discipline holds because every harness component treats the owning plugin's script CLI as the only state interface — a publishable-interface contract, not a kernel lock.

**The state schema upgrades itself.** A plugin's state grows new fields over time. In the historical reference architecture, versioned `data.json` files upgrade through a short stack of idempotent helpers. Each helper does the same small thing: check whether its field is present, add a default if it is missing, and no-op if it is already there. The plugin's command router runs the stack before it touches a subcommand, so an old but valid file reaches the current shape on first touch. That is distinct from corruption recovery: migration adds fields to valid older state; recovery decides what to do when the file cannot be parsed at all. *[ref: data-json-schema-version-idempotent-migrations | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/data-json-flow-b7-4.png
  Concept: Chalk-on-blackboard flow diagram — concurrent hook fires queue at the lockfile, the script gateway serializes a single mutation through a jq transform into a temp file, validates, then atomically replaces the live data.json. The reader never sees a partial state.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk for the step badges (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, arrows, file boxes, and the lockfile icon; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other file names, command names, or protocol descriptors.
  Layout: Left column — three small white-chalk arrows entering from the left edge, each labeled IN WHITE CHALK exactly "hook fire" (three identical labels, one per arrow), all three pointing at a single pastel chalk lock-icon (cyan fill) labeled IN WHITE CHALK exactly "machine-local lockfile".
  From the lockfile, a single white-chalk arrow points right into a horizontal flow of four pastel chalk step-badges arranged left-to-right, each labeled IN WHITE CHALK with its exact text:
    Badge 1 (green fill): "read data.json"
    Badge 2 (orange fill): "jq transform → data.json.tmp"
    Badge 3 (pink fill): "jq empty (validate)"
    Badge 4 (magenta fill): "atomic mv → data.json"
  Single white-chalk arrows connect Badge 1 → Badge 2 → Badge 3 → Badge 4.
  Below Badge 3, a small white-chalk side-arrow points DOWN to a small chalk box labeled IN WHITE CHALK exactly "validation fail → apply recovery policy".
  To the far right, after Badge 4, draw a small chalk file-icon (cyan fill) labeled IN WHITE CHALK exactly "data.json" with a short white-chalk arrow above it labeled IN WHITE CHALK exactly "reader sees whole state".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "hook fire", "machine-local lockfile", "read data.json", "jq transform → data.json.tmp", "jq empty (validate)", "atomic mv → data.json", "validation fail → apply recovery policy", "data.json", "reader sees whole state". No other words, file names, folders, or step descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 7.4. Concurrent fires queue at the lockfile. One mutation at a time. Atomic mv flips the file; readers never catch a partial state."
-->

Target asset: assets/images/blog/b7/data-json-atomic-protocol-b7-4.png

**The new-plugin lens.** When you guide your seed to add a plugin that needs state, the seed designs the state's *interface* first: what read commands does this plugin publish for other plugins (and the agent) to use? What mutation commands does this plugin publish for its own hooks to use? Then `data.json` becomes the cache the scripts operate on. Tell your seed: *if you cannot enumerate what reads each field and what writes each field, the design is not done yet.* A real-estate broker's seed could carry an open-listings manifest the same way; only the listings plugin's scripts mutate it, and concurrent showings-update hooks serialize through the same `flock` protocol.

**The minimum-viable plugin shape.** A plugin without `data.json` is stateless — it carries no runtime bookkeeping. A pure question gate is the example: it evaluates one interaction and returns, with no state file to maintain. The absence signals stateless enforcement. *[ref: question-discipline-no-data-json-stateless | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

State is private. Mutation is serialized. Cross-plugin queries route through the script CLI, never through the raw file. The next sub-essay opens the organ where the plugin's *narrated knowledge* lives — `docs/`, including the word-capped `evolution.md` and the historian ratchet that injects it before an authorized editing session.

---

*Essay 7.4 — The Plugin Kit, Part 4 of 9.*

*Previous: [Essay 7.3 — The Dual Voice Architecture](07_3-dual-voice-architecture.html) — two voice.xml files, one for the LLM and one for the operator.*
*Next: [Essay 7.5 — `docs/` and the Historian](07_5-docs-and-historian.html) — `evolution.md` word-capped + the historian ratchet.*
