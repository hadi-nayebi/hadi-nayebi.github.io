---
title: "The Customization Guardrail"
date: "May 2026"
slug: "customization-guardrail"
read_time: "10 min"
tags: [Architecture, Seed Agent, Plugins, Customization, PLUGIN-LOCK]
status: draft
version: v0.5.0
audience: "Tier 3"
og_image: "assets/images/blog/always-on-digital-cortex.png"
---

# The Customization Guardrail

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

---

[Essay 5.8](05_8-historian-ratchet.html) showed three single-concern plugins composing into the historian ratchet — the ceremony that forces re-narration before plugin edits. This final sub-essay covers the ceremony that determines **whether plugin edits are admitted at all**. Plugin code is one form within the multi-form `.claude/` substrate (per [Essay 5.7](05_7-claude-md-hierarchy.html)), but it is the form whose edits alter how every *other* plugin's discipline runs — which is why this gate exists.

The historian ratchet asks: have you re-read the plugin's life before editing it? The customization guardrail asks something prior: are you in a context where editing this plugin is even allowed?

For the architects in the audience. Especially the ones who plan to customize their own seed.

---

## What it owns

The customization guardrail owns the gate on **PLUGIN-LOCK admission for existing plugins**. Editing any plugin's code surface — hooks, scripts, voice files, tests, configuration — first requires the agent to issue `[PLUGIN-LOCK] <plugin_name>` and have that question pass through the gate. The gate's job is to decide: should this `[PLUGIN-LOCK]` admit, or should it block? *[ref: customization-guardrail-owns-plugin-lock-admission | .claude/plugins/plugin_integrity/hooks/lock-manager.sh | The "Lock acquire / unlock gate" sits in the PreToolUse path of lock-manager.sh: when AskUserQuestion fires the `[PLUGIN-LOCK] <target>` prefix, the hook parses the target name via a sed expression, then dirty-checks the repo, runs `lock-cmd.sh` on any prior unlocked plugin (auto-commit-on-test-pass / safe-lock-revert-on-test-fail), and finally rewrites `data.json` to set `unlocked_plugin` to the target name. Edits inside `plugins/<target>/hooks/, scripts/, voice.xml, config.conf, tests/, agents/, data.json` are then admitted; edits anywhere else trigger auto-lock. The gate's scope (hooks, scripts, voice, tests, config) is mechanically enforced.]*

The decision rests on one fact: editing existing plugin code alters the substrate form that polices every other plugin's discipline. One quiet regression deep inside a plugin's hooks can poison every dispatched subagent, every phase gate, every voice fire across the session. The gate's role is to ensure plugin edits only happen in contexts where the operator is *deliberately* doing plugin-layer work — not as a side effect of normal cycle activity.

The gate does not apply to plugin BIRTH (creating a new plugin that doesn't yet exist on disk). New plugins enter the system through a separate path that runs inside a normal OPEVC cycle. The gate's scope is edits to existing code. *[ref: gate-scope-existing-not-birth | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:215 | The gate fires only when the condition `[[ -d "$PLUGINS_ROOT/$target" ]]` is true — i.e., the target plugin already exists on disk. New plugin creation (target dir absent) admits in any phase via the same `[PLUGIN-LOCK] <new_name>` ceremony, which lock-manager.sh routes to its birth branch starting around line 313.]*

## How it works — the OR-gate

The gate admits on **either** of two conditions:

1. **`current_phase == "gmode"`** — the agent's focused job is currently in gmode, the operator's deliberate maintenance lane. The operator entered gmode via `[GMODE]` with a ≥100-word justification naming the work to be done.
2. **`focused_job.plugin_lock_approval == true`** — the agent's focused job has the `plugin_lock_approval` flag set on its `completion_requirements`. The flag was set when the operator answered `Approve job creation` to a `[JOB-APPROVE-CREATION]` question proposed by the agent.

Either condition admits. Both failing produces a block with structured teach-text naming both admission routes. The gate's logic is short — a few lines of bash in `lock-manager.sh` — but the architectural decision behind it is deeper than the code length suggests. *[ref: or-gate-logic | .claude/plugins/plugin_integrity/hooks/lock-manager.sh:202-235 | The gate computes `gmode_active="false"; [[ "$current_phase" == "gmode" ]] && gmode_active="true"` and `plugin_lock_approval=$(jq -r '.jobs[] | select(.focused==true) | .completion_requirements.plugin_lock_approval // false' "$JOB_DATA")`. Block fires iff both arms fail: `if [[ -n "$current_phase" && "$gmode_active" != "true" && "$plugin_lock_approval" != "true" ]]; then exit 2`. Block voice: `plugin-lock-requires-gmode-or-approved-job` — names both admission paths in its teach-text.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/customization-guardrails-b5-9.png
  Concept: Chalk-on-blackboard OR-gate — two admission arms (gmode + plugin_lock_approval) converging into PLUGIN-LOCK admission for existing plugins, with a separate bypass path for plugin birth.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the gmode arm, green for the plugin_lock_approval arm, orange for the OR-gate node, pink for the blocked-by-default state, magenta for the plugin-birth bypass arrow);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Top-left — a small chalk box (cyan fill) labeled IN WHITE CHALK exactly: "current_phase == gmode". A white-chalk arrow exits its right edge and travels down-right toward a central node.
  Bottom-left — a small chalk box (green fill) labeled IN WHITE CHALK exactly: "plugin_lock_approval == true". A white-chalk arrow exits its right edge and travels up-right toward the same central node.
  Center — a chalk-drawn OR-gate node (orange fill, classic D-shape with curved input side and pointed output), labeled exactly: "OR". The two arrows feed into its input side.
  Right of the OR — a white-chalk arrow exits the OR's point and lands on a chalk box outlined in white chalk labeled exactly: "[PLUGIN-LOCK] admitted".
  Below the OR node — a small chalk tag (pink fill, crossed out with a white-chalk X) labeled exactly: "blocked by default", with a thin white-chalk line connecting it to the OR to show what happens when both arms fail.
  Far-right bypass arrow — a single white-chalk arrow (magenta-tinted) flows from a small chalk tag at top-right labeled exactly: "plugin birth" AROUND the OR-gate node and lands directly on "[PLUGIN-LOCK] admitted", showing creation of a new plugin bypasses both arms.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "current_phase == gmode", "plugin_lock_approval == true", "OR", "[PLUGIN-LOCK] admitted", "blocked by default", "plugin birth", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.9. Two arms admit edits to existing plugins — gmode for ad-hoc operator work, plugin_lock_approval for agent-proposed customization jobs. Plugin birth bypasses both."
-->

## Why both routes, not one

Each route covers a case the other can't reach without contortion.

**gmode** is for ad-hoc work the operator initiates. The operator notices a problem with a plugin and decides to fix it right now. There's no pre-existing job for this work; making one would be overhead. The operator enters gmode, writes their justification, does the work, exits. The trigger is the operator's noticing. *[ref: gmode-operator-initiated-ceremony | .claude/knowledge/identity/plugin-lock-privilege.md "Why both, not one" section | The identity deep-dive frames gmode as "for ad-hoc work the operator initiates" with the verbatim example "I need to fix a bug in `plugin_integrity` itself — no pre-existing job, just enter gmode, do the work, exit. The operator IS the trigger." Entry cost: "the operator must justify (in ≥100 words) why this edit needs to happen outside normal cycles. gmode bypasses ALL phase guards — sentinel locks, point budgets, altered-list scoping." gmode is the deliberate maintenance lane for substrate work that doesn't fit normal OPEVC cycles.]*

**User-approved jobs** are for planned work the agent initiates. The agent notices, during OBSERVE or CONDENSE, that a customization to the plugin layer would help — adding a new plugin, modifying an existing one, extending a registry. The agent proposes via `[JOB-APPROVE-CREATION] <name>`; the user confirms; the new job is created with `plugin_lock_approval=true`; PLUGIN-LOCK admits inside that job for the duration of the customization work. The trigger is the agent's noticing.

Conflating the two routes would either force every planned customization through the heavy gmode ceremony (overhead) or open every routine job to substrate edits (loss of substrate integrity). The two-route design lets each kind of work flow through its natural ceremony. *[ref: two-route-design-rationale | .claude/knowledge/identity/plugin-lock-privilege.md | Identity-deep-dive on PLUGIN-LOCK's privileged status. "Each context covers a case the other doesn't... gmode is for ad-hoc work the operator initiates... user-approved-job is for planned work the agent initiates... Conflating them would either force every plugin edit through the heavy gmode ceremony (overhead for planned customization) or open every job to PLUGIN-LOCK (loss of substrate integrity)."]*

## The propose-and-confirm flow

The `[JOB-APPROVE-CREATION]` route is where most customization happens, because it's where the agent's noticing meets the operator's judgment. The flow:

1. **The agent notices a need.** During OBSERVE or CONDENSE, the agent identifies that a customization to the plugin layer would help — a pattern that should harden, a voice that keeps misfiring, a workflow the always-on layer doesn't yet support. *[ref: customization-trigger-patterns | .claude/knowledge/identity/plugin-lock-privilege.md "Why both, not one" section | The identity deep-dive frames the user-approved-job route as "for planned work the agent initiates" — illustrated with "I notice the always-on layer is missing a `secrets_guard` plugin — should I build one?" The agent proposes, the user confirms, the job carries `plugin_lock_approval=true` for its lifetime. Specific noticing thresholds (how many occurrences, which voice signals) live in plugin code; the architectural fact (proposals come from agent noticing + user judging) doesn't move.]*

2. **The agent proposes via `[JOB-APPROVE-CREATION] <name>`.** The question body names the proposed objective, the plugins that would be edited, the rationale (which OBSERVE finding or recurring pattern surfaced the need), and the expected scope (single-cycle DEEP, multi-cycle, approximate effort). *[ref: job-approve-creation-prefix-registered | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:76 | `[JOB-APPROVE-CREATION]` is registered in `question_discipline`'s `PREFIX_REGISTRY` array (sorted by frequency-of-use; ten entries total). Registration means the gate admits the question rather than blocking it as "unprefixed casual ask." The block voice `prefix-required` (voice.xml) lists the WHY: "prefixes route asks through deliberate gates (gmode-gate, lock-manager, point-boost, question-capture)." The body shape (objective + plugins + rationale + scope) is editorial convention rather than mechanically enforced; the prefix's job is to route the answer to `job_core`'s Post handler.]*

3. **The user judges.** Standard AskUserQuestion options: `Approve job creation` confirms; `Redirect` lets the user adjust scope before approval; `Reject` drops the proposal. The user holds the architectural decision; the agent holds the operational details.

4. **On approval, the Post handler creates the new job and flips its `plugin_lock_approval` flag.** *[ref: post-handler-create-then-approve | .claude/plugins/job_core/hooks/question-capture-hook.sh:172-194 | The `[JOB-APPROVE-CREATION]` branch extracts the proposed name from the question text (strips the prefix, reads the first whitespace-delimited token via sed + awk), calls `bash "$JOB_SH" create "$new_name"` to capture the new job id, then `bash "$JOB_SH" --hook approve-plugin-lock "$new_id"` to flip the flag. The new job lives in the standard `data.json` jobs array, distinguishable from typical jobs only by `completion_requirements.plugin_lock_approval == true`. Voice `job-approve-creation-result` confirms with `new_id` + `new_name` substituted and reminds the agent to focus + activate the new job when ready.]*

5. **The agent focuses and activates the new job** when ready to begin substrate work. The pending job sits in the data.json until the agent (or operator) decides to switch contexts. Inside the activated approved job, `[PLUGIN-LOCK]` admits without further questioning — the gate sees `plugin_lock_approval=true` on the focused job and skips the block. *[ref: pending-job-then-focus-activate | .claude/plugins/job_core/scripts/job.sh focus + activate subcommands + .claude/plugins/plugin_integrity/hooks/lock-manager.sh OR-gate | The newly approved job is created `status:"pending", focused:false` with `completion_requirements.plugin_lock_approval=true` already set (via the `--hook approve-plugin-lock` call inside the Post handler). The agent later runs `job.sh activate <new_id>` (flips status to active; clears `plugin_lock_approval=false` if reactivating a completed job — stale approvals don't leak through reactivation) then `job.sh focus <new_id>` (clears focus on all other jobs; sets focused=true on the new one). Once focused, lock-manager.sh reads `jq -r '.jobs[] | select(.focused==true) | .completion_requirements.plugin_lock_approval // false' "$JOB_DATA"` — the second arm of the OR-gate — and admits PLUGIN-LOCK inside the job for the duration of the customization work.]*

## What would break without it

Without the customization guardrail, plugin edits would be admitted in any cycle, in any phase, by any job. That isn't paranoia — it's the failure mode of every agent design where the agent can rewrite the rules that constrain it without ceremony. A buggy hook can poison every subsequent tool call. A regressed test guard can let broken plugins through. A misnamed voice id can silently fail to coach the agent through a critical moment. The substrate's integrity is what makes the rest of the always-on layer trustworthy; without the gate, that integrity dissolves whenever the agent is mid-cycle with broad write access.

Worse: without a structured gate, customization decisions get made ad-hoc, in the middle of work, under deadline pressure — exactly the situation where careful architectural judgment is hardest. The gate forces the customization decision into one of two deliberate moments: the operator entering gmode with a justification, or the user judging a `[JOB-APPROVE-CREATION]` proposal. Both moments slow the agent down, on purpose. Slowness is the point.

## What you would customize

The customization guardrail is the rare plugin-layer surface where the design assumes most architects will *inherit, not rewrite*. The two-route architecture is the architectural decision; the specific prefix names and voice wording are the surface knobs.

You would tune the **proposal threshold**. The current prototype waits for the agent's own noticing — a pattern recurs, a voice keeps misfiring. Your seed may want a more aggressive proposer (every cycle, list candidate plugin-improvements; reduce to one and propose) or a more conservative one (only propose after the user has expressed friction). The thresholds live in plugin code; the architectural fact (proposals come from agent noticing + user judging) doesn't move. *[ref: proposal-threshold-customization-knob | .claude/knowledge/identity/plugin-lock-privilege.md "Why both, not one" section | The identity file frames the user-approved-job route as "for planned work the agent initiates" — the agent's noticing IS the trigger ("I notice the always-on layer is missing a `secrets_guard` plugin — should I build one?"). The specific noticing thresholds (how aggressive, which signals count as "the agent noticed") are not codified as named parameters in the current prototype; the architectural fact (proposals come from agent noticing + user judging) is what doesn't move. A customizer's seed can encode its own threshold by adding noticing logic to a phasic hook (OBSERVE or CONDENSE).]*

You would rename the **`[JOB-APPROVE-CREATION]` prefix** if your operator vocabulary uses different words. The prefix is registered in `question_discipline`'s PREFIX_REGISTRY as a single literal; the Post handler in `job_core` greps for the same string. A consulting seed might prefer `[ENGAGEMENT-AUTHORIZED]`; a research seed might use `[INVESTIGATION-PROTOCOL]`. The mechanism is the architecture; the words are yours. *[ref: prefix-registry-rename-touch-points | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh:66-77 + .claude/plugins/job_core/hooks/question-capture-hook.sh:172-175 | The `PREFIX_REGISTRY` bash array in `question-discipline-gate.sh` holds ten entries; renaming `[JOB-APPROVE-CREATION]` is a one-line edit to that array (the registration side). The handling side lives in `job_core`'s `question-capture-hook.sh`: a grep-E pattern matches the prefix literal to detect the question, then a sed-E expression strips the prefix to extract the proposed name. A rename touches both files — registration (1 line) + handler grep+sed (2 lines). The comment block above the registry names the three steps explicitly: "Append literal here. Add accept test. Wire per-prefix Post handler in the owning plugin."]*

You would rewrite the **gate's block voice** to match your operator's reading level. The current voice has a 3-part teach: WHY (substrate edits matter) + WHAT TO DO (the two routes) + EXPECTED STATE. Your seed may want a shorter voice for an architect-level operator who already knows the why, or a longer one for a new operator still learning the surface. The voice lives in `voice.xml`; rewriting it is a single edit. *[ref: gate-block-voice-3-part-structure | .claude/plugins/plugin_integrity/hooks/voice.xml `plugin-lock-requires-gmode-or-approved-job` block | The block voice's text follows a literal three-part structure: "WHY: edits to existing plugin code alter the agent's own enforcement substrate — that work belongs in one of two protected contexts: (a) gmode, the operator's deliberate maintenance lane; (b) a user-approved job whose creation the operator confirmed via [JOB-APPROVE-CREATION]." Then "WHAT TO DO: pick ONE — (A) ask [GMODE] with a ≥100-word justification naming the flaw + the file you'll touch; OR (B) propose [JOB-APPROVE-CREATION] <name> with the proposed objective, the plugins you'll edit, and the rationale." Then "EXPECTED STATE on retry: current_phase == gmode OR focused job's plugin_lock_approval == true, [PLUGIN-LOCK] {{plugin}} succeeds." The three-part shape (WHY + WHAT TO DO + EXPECTED STATE) is the seed-wide voice convention; rewriting the voice means editing one `<block>` element in voice.xml.]*

You would extend the **approval-flag granularity**. The current design has one flag (`plugin_lock_approval`). Your seed may want finer granularity — a flag per concern, or per plugin family. The `completion_requirements` object is already extensible; adding a flag is a schema extension + a new `--hook approve-X` command. *[ref: approval-flag-granularity-extension-pattern | .claude/plugins/job_core/scripts/job.sh `--hook approve-plugin-lock` subcommand (around line 486-500) | New jobs are created with `completion_requirements:{user_approval:false, plugin_lock_approval:false, depends_on:[]}` — the object is an extensible record. The `approve-plugin-lock` subcommand is gated `[[ "$HOOK_MODE" != "true" ]] && die "Command 'approve-plugin-lock' is reserved for system automation"` (only the Post handler can call it) and runs `update_job "$local_id" '.completion_requirements.plugin_lock_approval=true'`. Adding a new approval concern (e.g., `secrets_approval` for a `secrets_guard` plugin) means three edits: extend the `completion_requirements` literal in the `create` subcommand to include the new field, add a parallel `--hook approve-secrets` subcommand, and wire a Post handler in the owning plugin to flip it on the user's "Approve" answer.]*

What you would NOT do is remove the gate. The gate is what makes the architecture safely modifiable. A seed that admits PLUGIN-LOCK in any context is a seed that will eventually corrupt its own substrate, usually under deadline pressure when the architect's judgment is weakest.

---

## What the gate teaches

The customization guardrail is the architectural conclusion of these eight prior sub-essays. The always-on plugin layer holds the agent's reflexes; the substrate holds its working memory; the historian ratchet forces re-narration before edits; the gate forces deliberate context before any substrate edit happens at all. Each layer adds a discipline; the gate is the one that turns the system into something safely modifiable *by you* — not by the original developer, by you, the operator who installed the seed last week or last month or last year.

That is the [agent-developer-user → agent-user collapse](08-from-apprentice-to-architect.html) made operational. The agent proposes customization. You judge it. The substrate enforces the discipline that keeps your judgment safe. No developer in the loop. And the canonical reference the seed itself consults when reasoning about its own design is this nine-essay series — plus [Essay 6](06_1-phasic-foundation.html), [7](07_1-plugin-kit-foundation.html), [8](08-from-apprentice-to-architect.html) and the `.claude/knowledge/` topic files you cultivate as you customize. The PowerPoint of seed agents lives here.

---

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

*Previous: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — composed ceremony from three single-concern plugins.*
*Next: [Essay 6.1 — Phasic Foundation](06_1-phasic-foundation.html) — opens The Markov Phasic Brain (10-part series): action space → Markov brain, why phases.*
