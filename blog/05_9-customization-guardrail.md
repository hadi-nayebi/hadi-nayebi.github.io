---
title: "The Customization Guardrail"
date: "May 2026"
slug: "customization-guardrail"
read_time: "10 min"
tags: [Architecture, Seed Agent, Plugins, Customization, PLUGIN-LOCK]
status: draft
version: v0.1.0
audience: "Tier 3"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# The Customization Guardrail

*Essay 5.9 of 9 — The Always-On Digital Cortex.*

---

[Essay 5.8](05_8-historian-ratchet.html) showed three single-concern plugins composing into the historian ratchet — the ceremony that forces re-narration before substrate edits. This final sub-essay covers the ceremony that determines **whether substrate edits are admitted at all**.

The historian ratchet asks: have you re-read the plugin's life before editing it? The customization guardrail asks something prior: are you in a context where editing this plugin is even allowed?

For the architects in the audience. Especially the ones who plan to customize their own seed.

---

## What it owns

The customization guardrail owns the gate on **PLUGIN-LOCK admission for existing plugins**. Editing any plugin's code surface — hooks, scripts, voice files, tests, configuration — first requires the agent to issue `[PLUGIN-LOCK] <plugin_name>` and have that question pass through the gate. The gate's job is to decide: should this `[PLUGIN-LOCK]` admit, or should it block?

The decision rests on one fact: editing existing plugin code alters the substrate that polices every other plugin's discipline. One quiet regression deep inside a plugin's hooks can poison every dispatched subagent, every phase gate, every voice fire across the session. The gate's role is to ensure plugin edits only happen in contexts where the operator is *deliberately* doing substrate work — not as a side effect of normal cycle activity.

The gate does not apply to plugin BIRTH (creating a new plugin that doesn't yet exist on disk). New plugins enter the system through a separate path that runs inside a normal OPEVC cycle. The gate's scope is edits to existing code. *[ref: gate-scope-existing-not-birth | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:209 | The gate fires only when the condition `[[ -d "$PLUGINS_ROOT/$target" ]]` is true — i.e., the target plugin already exists on disk. New plugin creation (target dir absent) admits in any phase via the same `[PLUGIN-LOCK] <new_name>` ceremony, which lock-manager.sh routes to its birth branch starting around line 297.]*

## How it works — the OR-gate

The gate admits on **either** of two conditions:

1. **`current_phase == "gmode"`** — the agent's focused job is currently in gmode, the operator's deliberate maintenance lane. The operator entered gmode via `[GMODE]` with a ≥100-word justification naming the work to be done.
2. **`focused_job.plugin_lock_approval == true`** — the agent's focused job has the `plugin_lock_approval` flag set on its `completion_requirements`. The flag was set when the operator answered `Approve job creation` to a `[JOB-APPROVE-CREATION]` question proposed by the agent.

Either condition admits. Both failing produces a block with structured teach-text naming both admission routes. The gate's logic is short — a few lines of bash in `lock-manager.sh` — but the architectural decision behind it is deeper than the code length suggests. *[ref: or-gate-logic | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:202-235 | The gate computes `gmode_active="false"; [[ "$current_phase" == "gmode" ]] && gmode_active="true"` and `plugin_lock_approval=$(jq -r '.jobs[] | select(.focused==true) | .completion_requirements.plugin_lock_approval // false' "$JOB_DATA")`. Block fires iff both arms fail: `if [[ -n "$current_phase" && "$gmode_active" != "true" && "$plugin_lock_approval" != "true" ]]; then exit 2`. Block voice: `plugin-lock-requires-gmode-or-approved-job` — names both admission paths in its teach-text.]*

## Why both routes, not one

Each route covers a case the other can't reach without contortion.

**gmode** is for ad-hoc work the operator initiates. The operator notices a problem with a plugin and decides to fix it right now. There's no pre-existing job for this work; making one would be overhead. The operator enters gmode, writes their justification, does the work, exits. The trigger is the operator's noticing.

**User-approved jobs** are for planned work the agent initiates. The agent notices, during OBSERVE or CONDENSE, that a customization to the plugin layer would help — adding a new plugin, modifying an existing one, extending a registry. The agent proposes via `[JOB-APPROVE-CREATION] <name>`; the user confirms; the new job is created with `plugin_lock_approval=true`; PLUGIN-LOCK admits inside that job for the duration of the customization work. The trigger is the agent's noticing.

Conflating the two routes would either force every planned customization through the heavy gmode ceremony (overhead) or open every routine job to substrate edits (loss of substrate integrity). The two-route design lets each kind of work flow through its natural ceremony. *[ref: two-route-design-rationale | .claude/knowledge/identity/plugin-lock-privilege.md | Identity-deep-dive on PLUGIN-LOCK's privileged status. "Each context covers a case the other doesn't... gmode is for ad-hoc work the operator initiates... user-approved-job is for planned work the agent initiates... Conflating them would either force every plugin edit through the heavy gmode ceremony (overhead for planned customization) or open every job to PLUGIN-LOCK (loss of substrate integrity)."]*

## The propose-and-confirm flow

The `[JOB-APPROVE-CREATION]` route is where most customization happens, because it's where the agent's noticing meets the operator's judgment. The flow:

1. **The agent notices a need.** During OBSERVE or CONDENSE, the agent identifies that a customization would help. Examples of triggers: a repeated pattern crosses ~3 occurrences and should harden into a plugin (the soft → hard migration pattern from [Essay 8](08-from-apprentice-to-architect.html)); a voice keeps failing to fire because it's not in the COACHING_IDS pool; the user describes a workflow the current always-on layer doesn't support.

2. **The agent proposes via `[JOB-APPROVE-CREATION] <name>`.** The question body names the proposed objective, the plugins that would be edited, the rationale (which OBSERVE finding or recurring pattern surfaced the need), and the expected scope (single-cycle DEEP, multi-cycle, approximate effort).

3. **The user judges.** Standard AskUserQuestion options: `Approve job creation` confirms; `Redirect` lets the user adjust scope before approval; `Reject` drops the proposal. The user holds the architectural decision; the agent holds the operational details.

4. **On approval, the Post handler creates the job.** `job_core/hooks/question-capture-hook.sh` extracts the proposed name from the question text, calls `job.sh create <name>` (creates a pending job), then `job.sh --hook approve-plugin-lock <new_id>` (flips `plugin_lock_approval=true`). The new job exists in the standard `data.json` structure, distinguishable from typical jobs only by this flag. *[ref: post-handler-create-then-approve | .claude/plugins/job_core/hooks/question-capture-hook.sh | The `[JOB-APPROVE-CREATION]` branch extracts the name via `sed -E 's/^[[:space:]]*\[JOB-APPROVE-CREATION\][[:space:]]*//' | awk '{print $1}'`, calls `bash "$JOB_SH" create "$new_name"` to capture the new job id, then `bash "$JOB_SH" --hook approve-plugin-lock "$new_id"` to flip the flag. The voice `job-approve-creation-result` confirms with `new_id` + `new_name` substituted, and reminds the agent to focus + activate the new job when ready.]*

5. **The agent focuses and activates the new job** when ready to begin substrate work. The pending job sits in the data.json until the agent (or operator) decides to switch contexts. Inside the activated approved job, `[PLUGIN-LOCK]` admits without further questioning — the gate sees `plugin_lock_approval=true` on the focused job and skips the block.

## What would break without it

Without the customization guardrail, plugin edits would be admitted in any cycle, in any phase, by any job. That isn't paranoia — it's the failure mode of every agent design where the agent can rewrite the rules that constrain it without ceremony. A buggy hook can poison every subsequent tool call. A regressed test guard can let broken plugins through. A misnamed voice id can silently fail to coach the agent through a critical moment. The substrate's integrity is what makes the rest of the always-on layer trustworthy; without the gate, that integrity dissolves whenever the agent is mid-cycle with broad write access.

Worse: without a structured gate, customization decisions get made ad-hoc, in the middle of work, under deadline pressure — exactly the situation where careful architectural judgment is hardest. The gate forces the customization decision into one of two deliberate moments: the operator entering gmode with a justification, or the user judging a `[JOB-APPROVE-CREATION]` proposal. Both moments slow the agent down, on purpose. Slowness is the point.

## What you would customize

The customization guardrail is the rare plugin-layer surface where the design assumes most architects will *inherit, not rewrite*. The two-route architecture is the architectural decision; the specific prefix names and voice wording are the surface knobs.

You would tune the **proposal threshold**. The current prototype waits for the agent's own noticing — a pattern recurs, a voice keeps misfiring. Your seed may want a more aggressive proposer (every cycle, list candidate plugin-improvements; reduce to one and propose) or a more conservative one (only propose after the user has expressed friction). The thresholds live in plugin code; the architectural fact (proposals come from agent noticing + user judging) doesn't move.

You would rename the **`[JOB-APPROVE-CREATION]` prefix** if your operator vocabulary uses different words. The prefix is registered in `question_discipline`'s PREFIX_REGISTRY at one line; the Post handler in `job_core` reads the same string. A consulting seed might prefer `[ENGAGEMENT-AUTHORIZED]`; a research seed might use `[INVESTIGATION-PROTOCOL]`. The mechanism is the architecture; the words are yours.

You would rewrite the **gate's block voice** to match your operator's reading level. The current voice has a 3-part teach: WHY (substrate edits matter) + WHAT TO DO (the two routes) + EXPECTED STATE. Your seed may want a shorter voice for an architect-level operator who already knows the why, or a longer one for a new operator still learning the surface. The voice lives in `voice.xml`; rewriting it is a single edit.

You would extend the **approval-flag granularity**. The current design has one flag (`plugin_lock_approval`). Your seed may want finer granularity — a flag per concern, or per plugin family. The `completion_requirements` object is already extensible; adding a flag is a schema extension + a new `--hook approve-X` command.

What you would NOT do is remove the gate. The gate is what makes the architecture safely modifiable. A seed that admits PLUGIN-LOCK in any context is a seed that will eventually corrupt its own substrate, usually under deadline pressure when the architect's judgment is weakest.

---

## What the gate teaches

The customization guardrail is the architectural conclusion of these eight prior sub-essays. The always-on plugin layer holds the agent's reflexes; the substrate holds its working memory; the historian ratchet forces re-narration before edits; the gate forces deliberate context before any substrate edit happens at all. Each layer adds a discipline; the gate is the one that turns the system into something safely modifiable *by you* — not by the original developer, by you, the operator who installed the seed last week or last month or last year.

That is the [agent-developer-user → agent-user collapse](08-from-apprentice-to-architect.html) made operational. The agent proposes customization. You judge it. The substrate enforces the discipline that keeps your judgment safe. No developer in the loop. The PowerPoint of seed agents lives here.

---

*Essay 5.9 of 9 — The Always-On Digital Cortex — Hadosh Academy series on agent architecture.*

*Previous: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
*Next: [Essay 6 — The Markov Phasic Brain](06-the-markov-phasic-brain.html) — five phases, one cognitive organ, and why forbidding tools is the pedagogy.*
