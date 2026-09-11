---
title: "The Customization Guardrail"
date: "May 18, 2026"
slug: "customization-guardrail"
read_time: "10 min"
tags: [Architecture, Seed Agent, Plugins, Customization, PLUGIN-LOCK]
status: published
version: v0.7.0
audience: "Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The Customization Guardrail

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

---

[Essay 5.8](05_8-historian-ratchet.html) showed how one integrity plugin owns the historian ratchet while several single-concern plugins compose the broader protected editing ceremony. This final essay examines the authorization pattern that precedes plugin-code editing or plugin creation. In the historical Claude-based reference architecture used here, that pattern is implemented through a `[PLUGIN-LOCK]` request. Editing an existing plugin's logical surface, or creating a new plugin from scratch, both start by asking that question. The outer gate admits the request in only two specific contexts, helping keep the substrate intact. *[ref: plugin-lock-gates-all-plugin-work | private historical prototype | Claim checked against a private historical prototype.]*

The historian ratchet asks: have you re-read the plugin's life before editing it? The customization guardrail asks something prior: are you in a context where any plugin-code work (editing OR creating) is even allowed?

For the architects in the audience. Especially the ones who plan to customize their own seed.

---

## What it owns

As a general pattern, a customization guardrail separates ordinary project work from changes to the agent machinery that governs future work. In the historical prototype, the guardrail owns the gate on **`[PLUGIN-LOCK]` admission**. Two operations route through it:

- **Editing an existing plugin's code surface** — executable hooks and scripts, configuration, and protected tests. Hidden state continues to mutate only through plugin-owned interfaces.
- **Creating a new plugin** — the lock request triggers a controlled birth path: template creation, historian generation, and a baseline commit. Same gate; same admission requirement.

*[ref: customization-guardrail-owns-plugin-lock-admission | private historical prototype | Claim checked against a private historical prototype.]*

The prototype's gate does not cover the plugin's softer learning surfaces — project instructions, documentation, voice catalogues, and subagent definitions. Those files can shape behavior, but they are not the executable logic surface this lock protects. They remain governed by phase discipline: CONDENSE owns them as part of its meta-cognition step, tuning voice injections from phase-footer notes, refreshing historian definitions, and refining working-memory instructions. *[ref: free-surface-condense-owned | private historical prototype | Claim checked against a private historical prototype.]*

The decision rests on one fact: editing existing plugin code (or creating a new plugin that will start running code immediately) alters the substrate form that polices every other plugin's discipline. One quiet regression deep inside a plugin's hook can poison every dispatched subagent, every phase gate, every voice fire across the session. The gate's role is to ensure plugin-code work only happens in contexts where the operator is *deliberately* doing code-level substrate work — not as a side effect of normal cycle activity. *[ref: editing-plugin-code-alters-substrate | private historical prototype | Claim checked against a private historical prototype.]*

## How it works — the OR-gate

The gate admits `[PLUGIN-LOCK]` on **either** of two conditions:

1. **`current_phase == "gmode"`** — the agent's focused job is currently in gmode, the operator's deliberate maintenance lane. The operator entered gmode via `[GMODE]` with a ≥100-word justification naming the work to be done. *[ref: gmode-arm-of-or-gate | private historical prototype | Claim checked against a private historical prototype.]*

2. **The focused job has `plugin_lock_approval == true`** — a top-level boolean on the job object, set either when the operator approves a new customization job or when the operator grants plugin access to the focused job already in flight. *[ref: plugin-lock-approval-top-level-field | private historical prototype | Claim checked against a private historical prototype.]*

Either condition admits. If both fail, the gate produces a block with structured teach-text naming both admission routes. The gate's logic is short — a few lines in the lock handler — but the architectural decision behind it is deeper than the code length suggests. *[ref: or-gate-logic | private historical prototype | Claim checked against a private historical prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/customization-guardrails-b5-9.png
  Concept: Chalk-on-blackboard OR-gate diagram — two admission arms (gmode + plugin_lock_approval) converging into one PLUGIN-LOCK admission node, with the same admission covering BOTH editing an existing plugin AND creating a new plugin (no separate bypass for birth).
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the gmode arm, green for the plugin_lock_approval arm, orange for the OR-gate node, magenta for the edit-or-birth result, pink for the blocked-by-default state);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  READABILITY REQUIREMENTS: every label sits inside or directly beside its shape with clear space from arrows + other labels; the OR-gate node has at least one shape-width of empty space on every side; the result box is centered on the right with the two outcome arrows fanning out beneath it (no overlap with the OR node).
  Layout: Top-left — a small chalk box (cyan fill) labeled IN WHITE CHALK exactly: "current_phase == gmode". A white-chalk arrow exits its right edge and travels down-right toward a central node.
  Bottom-left — a small chalk box (green fill) labeled IN WHITE CHALK exactly: "plugin_lock_approval == true". A white-chalk arrow exits its right edge and travels up-right toward the same central node.
  Center — a chalk-drawn OR-gate node (orange fill, classic D-shape with curved input side and pointed output), labeled exactly: "OR". The two arrows feed into its input side.
  Right of the OR — a white-chalk arrow exits the OR's point and lands on a chalk box outlined in white chalk labeled exactly: "[PLUGIN-LOCK] request admitted".
  Beneath the admitted box, two short white-chalk arrows fan out to two small magenta-filled tags side-by-side, labeled IN WHITE CHALK exactly:
    Tag 1: "edit existing plugin"
    Tag 2: "create new plugin"
  Below the OR node — a small chalk tag (pink fill, crossed out with a white-chalk X) labeled exactly: "blocked by default", with a thin white-chalk line connecting it to the OR to show what happens when both arms fail.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "current_phase == gmode", "plugin_lock_approval == true", "OR", "[PLUGIN-LOCK] request admitted", "edit existing plugin", "create new plugin", "blocked by default".
  Caption (HTML text shown under the image, not drawn inside the image): "Image 5.9. Two arms admit a [PLUGIN-LOCK] request — gmode for ad-hoc operator work, plugin_lock_approval for user-approved customization work. The same admission rule covers both editing existing plugins and creating new ones."
-->

## Why both routes, not one

Each route covers a case the other can't reach without contortion.

**gmode** is for ad-hoc work the operator initiates. The operator notices a problem with a plugin and decides to fix it right now. There's no pre-existing job for this work; making one would be overhead for what may be a one-line fix. The operator enters gmode (a `[GMODE]` question with a ≥100-word justification), does the work, exits. The trigger is the operator's noticing. *[ref: gmode-operator-initiated-quick-fixes | private historical prototype | Claim checked against a private historical prototype.]*

**User-approved jobs** are for work the agent surfaces for approval, whether it is planned in advance or discovered inside a job already underway. Any active phase can notice that a customization to the plugin layer would help — a pattern that should harden into a plugin, a voice that keeps misfiring, a workflow the always-on layer doesn't yet support. *[ref: any-phase-notices | private historical prototype | Claim checked against a private historical prototype.]*

The noticing phase drops a note in its CLAUDE.md footer; CONDENSE's waterfall step 3 consumes the note and fires `[JOB-APPROVE-CREATION] <name>` from CONDENSE. The user confirms; the new job is created with `plugin_lock_approval=true`; `[PLUGIN-LOCK]` admits inside that job for the duration of the customization work. The trigger is the agent's noticing; the creation is CONDENSE's responsibility. *[ref: condense-only-creates-the-job | private historical prototype | Claim checked against a private historical prototype.]*

The two admission conditions match the two natural triggers (operator-noticed vs agent-noticed) without forcing every soft/meta-cognitive tuning step through the same code-lock ceremony. Within the user-approved-job arm, the agent can propose a new customization job or ask the user to raise the right on the focused job already in flight.

## The propose-and-confirm flow

The `[JOB-APPROVE-CREATION]` route is where most customization happens, because it's where the agent's noticing meets the operator's judgment. The flow:

1. **Any phase notices a need.** During OBSERVE / PLAN / EXECUTE / VERIFY, the agent identifies that a customization to the plugin layer would help — a pattern that should harden, a voice that keeps misfiring, a workflow the always-on layer doesn't yet support. The noticing phase drops a note in its CLAUDE.md footer (a `[PENDING-JOB]` marker or free-form rationale). *[ref: any-phase-notices-records-in-footer | private historical prototype | Claim checked against a private historical prototype.]*

2. **CONDENSE proposes via `[JOB-APPROVE-CREATION] <name>`.** Job creation is CONDENSE's responsibility. The question body names the proposed objective, the plugins that would be edited (or created), why now (which note from earlier phases surfaced the need, and why the work is worth a job), and the risk surface the change would touch. A phase-of-firing gate blocks the prefix outside CONDENSE — if any other phase tries to fire it, the agent gets a teach-voice pointing back to the footer-note channel. *[ref: condense-only-proposal-via-gate | private historical prototype | Claim checked against a private historical prototype.]*

3. **The user judges.** Standard AskUserQuestion options: `Approve job creation` confirms; `Redirect` lets the user adjust scope before approval; `Reject` drops the proposal. The user holds the architectural decision; the agent holds the operational details. *[ref: standard-approve-job-creation-options | private historical prototype | Claim checked against a private historical prototype.]*

4. **On approval, the Post handler creates the new job and flips its `plugin_lock_approval` flag.** *[ref: post-handler-create-then-approve | private historical prototype | Claim checked against a private historical prototype.]*

5. **The agent focuses and activates the new job** when ready to begin substrate work. The pending job sits in durable job state until the agent (or operator) decides to switch contexts. Inside the activated approved job, `plugin_lock_approval=true` satisfies the outer context gate. The agent still issues the final `[PLUGIN-LOCK]` request, and the user still confirms the actual unlock for editing an existing plugin or creating a new one. *[ref: pending-job-then-focus-activate | private historical prototype | Claim checked against a private historical prototype.]*

## The second proposal route — raising the right mid-flight

The flow above mints a *new* job that starts life already cleared. But customization needs don't always announce themselves before the work begins. More often the seed agent is already deep inside an ordinary job — drafting a glossary term, rewriting a paragraph, tracing a bug — when it discovers the real fix lands in the plugin layer. That job was born for ordinary work; its `plugin_lock_approval` is `false`. Minting a fresh pre-cleared job and migrating the context across would be the same overhead gmode exists to avoid.

So there is a second way to reach the same right: ask the user to raise `plugin_lock_approval` on the job *already in flight*. The prefix is `[JOB-APPROVE-PLUGIN]`, and it is the mid-life sibling of `[JOB-APPROVE-CREATION]` — creation-time approval clears a brand-new job; this clears the *focused* one. The two prefixes are the flag's two setters, and they pour into the exact same writer: `job.sh --hook approve-plugin-lock`. The only difference is the target job and the timing. *[ref: job-approve-plugin-mid-life-sibling | private historical prototype | Claim checked against a private historical prototype.]*

This route has a deliberately different phase rule. `[JOB-APPROVE-CREATION]` is CONDENSE-only, because creating a job is cycle-wide synthesis work. But `[JOB-APPROVE-PLUGIN]` admits in **any active phase** — OBSERVE, PLAN, EXECUTE, VERIFY, CONDENSE — because the need is engaged exactly where it is *discovered*: typically in PLAN, when the agent is deciding which surface a fix lands on; sometimes in EXECUTE, when the agent hits the lock mid-edit. Deferring that ask to a later CONDENSE would waste the very cycle whose work is the fix. The pre-arm still guards the obvious mistakes: there must be a focused job to raise the right on, the ask is blocked in idle and gmode (no working phase is deciding a fix-surface there, and gmode already admits `[PLUGIN-LOCK]` directly), and a job whose right is already `true` cannot re-ask — that would be noise. *[ref: job-approve-plugin-any-active-phase | private historical prototype | Claim checked against a private historical prototype.]*

So plugin access has two agent-initiated shapes: propose a new job pre-cleared for the work, or raise the right on the job you are already running. Same right, same writer, same final `[PLUGIN-LOCK]` ask to actually unlock a plugin — the user confirms either way. Which one fits depends only on whether the plugin work is foreseen before the job starts or discovered once it is underway.

## What would break without it

Without the customization guardrail, plugin code edits and births would be admitted in any cycle, in any phase, by any job. That isn't paranoia — it's the failure mode of every agent design where the agent can rewrite the rules that constrain it without ceremony. A buggy hook can poison every subsequent tool call. A regressed test guard can let broken plugins through. A misnamed voice id can silently fail to coach the agent through a critical moment. A spurious new plugin can hijack hook events the operator didn't authorize. The substrate's integrity is what makes the rest of the always-on layer trustworthy; without the gate, that integrity dissolves whenever the agent is mid-cycle with broad write access. *[ref: substrate-corruption-failure-modes | private historical prototype | Claim checked against a private historical prototype.]*

Worse: without a structured gate on code-level customization, substrate-code decisions get made ad-hoc, in the middle of work, under deadline pressure — exactly the situation where careful architectural judgment is hardest. The guardrail forces the customization decision into a deliberate authorization moment: the operator enters gmode with a justification, the user approves a new customization job, or the user raises the right on a focused job already in flight. Each route slows the agent down, on purpose. Slowness is the point. *[ref: two-deliberate-moments-friction-by-design | private historical prototype | Claim checked against a private historical prototype.]*

## What you would customize

The customization guardrail is the rare plugin-layer surface where the design assumes most architects will *inherit, not rewrite*. The two-condition admission architecture is the architectural decision; the specific prefix names and voice wording are the surface knobs.

You would tune the **proposal threshold**. The current prototype waits for the agent's own noticing — a pattern recurs, a voice keeps misfiring. Your seed may want a more aggressive proposer (every CONDENSE, list candidate plugin-improvements; reduce to one and propose) or a more conservative one (only propose after the user has expressed friction). The thresholds live in plugin code; the architectural fact (proposals come from agent noticing + user judging, with CONDENSE doing the asking) doesn't move. *[ref: proposal-threshold-customization-knob | private historical prototype | Claim checked against a private historical prototype.]*

You would rename the **`[JOB-APPROVE-CREATION]` prefix** if your operator vocabulary uses different words. Because the prefix is a literal protocol token, a rename must update its registry, phase gate, approval handler, question-shape rule, remote-reply mapping, and acceptance test in lockstep. Miss one consumer and the renamed prefix may lose validation or routing. A consulting seed might prefer `[ENGAGEMENT-AUTHORIZED]` — every client engagement proposal stays structurally approved by a human before the agent begins scope-altering customization work, mirroring the firm's existing engagement-letter discipline. A research seed might use `[INVESTIGATION-PROTOCOL]` — the lab director signs off on each new line of inquiry before the seed begins building its instrumentation. The mechanism is the architecture; the words are yours. *[ref: prefix-registry-rename-touch-points | private historical prototype | Claim checked against a private historical prototype.]*

Voice is the cheapest surface to tune. You would rewrite the **gate's block voice** to match your operator's reading level. The current voice has a 3-part teach: WHY (substrate edits matter) + WHAT TO DO (the two routes) + EXPECTED STATE. Your seed may want a shorter voice for an architect-level operator who already knows the why, or a longer one for a new operator still learning the surface. The voice lives in `voice.xml` — and editing `voice.xml` doesn't require `[PLUGIN-LOCK]` itself, because voice is a soft learning surface and CONDENSE owns voice tuning as a routine meta-cognition step. *[ref: gate-block-voice-3-part-structure | private historical prototype | Claim checked against a private historical prototype.]*

You would extend the **approval-flag granularity**. The current design has one top-level flag (`plugin_lock_approval`). Your seed may want finer granularity — a flag per concern, or per plugin family. The schema is flat and extensible: adding a flag is a schema extension + a new `--hook approve-X` command. *[ref: approval-flag-granularity-extension-pattern | private historical prototype | Claim checked against a private historical prototype.]*

What you would NOT do is remove the gate. The gate is what makes the architecture safely modifiable. A seed that admits PLUGIN-LOCK in any context is a seed that will eventually corrupt its own substrate, usually under deadline pressure when the architect's judgment is weakest. *[ref: gate-removal-breaks-substrate-safety | private historical prototype | Claim checked against a private historical prototype.]*

---

## What the gate teaches

The customization guardrail is the architectural conclusion of the prior essays in this series. The always-on plugin layer holds the agent's reflexes; the substrate holds its working memory; the historian ratchet forces re-narration before edits; the gate forces deliberate context before any plugin-code edit (or new-plugin birth) happens at all. Each layer adds a discipline; the gate is the one that turns the system into something safely modifiable *by you* — not by the original developer, by you, the operator who installed the seed last week or last month or last year. *[ref: layered-discipline-safely-modifiable-by-operator | private historical prototype | Claim checked against a private historical prototype.]*

That is the [agent-developer-user → agent-user collapse](../b8/08_1-apprentice-to-architect-foundation.html) made operational. The agent proposes customization. You judge it. The substrate enforces the discipline that keeps your judgment safe. No developer in the loop. And the canonical reference the seed itself consults when reasoning about its own design is this nine-essay series — plus [Essay 6](../b6/06_1-phasic-foundation.html), [7](../b7/07_1-plugin-kit-foundation.html), [8](../b8/08_1-apprentice-to-architect-foundation.html), and the durable topic files you cultivate as you customize. The PowerPoint of seed agents lives here.

---

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

*Previous: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
*Next: [Essay 6.1 — Phasic Foundation](../b6/06_1-phasic-foundation.html) — opens The Markov Phasic Brain (10-part series): action space → Markov brain, why phases.*
