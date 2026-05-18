---
title: "The Inverse Multiplier"
date: "May 2026"
slug: "inverse-multiplier"
read_time: "11 min"
tags: [Architecture, Seed Agent, OPEVC, Multiplier]
status: draft
version: v0.2.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/b6/markov-phasic-brain-b6.png"
---

# The Inverse Multiplier

*Essay 6.8 — The Markov Phasic Brain, Part 8 of 10.*

---

[Essay 6.7](06_7-condense.html) closed the cycle. The cycle's phases (currently five in the prototype) plus the metabolism organ — the seed agent now has the compartmentalized cognition the rest of the series has been building toward. What is left is the one mechanism that sits at the entry of every phase and turns a scalar dial into an act of meta-cognition.

This is where the phasic layer earns its keep — and where you, designing your own seed, will spend the most time tuning. The mechanism is small. The discipline it produces is large.

---

## The Ralph loop and the per-phase echo

Start with the **Ralph loop**. The pattern is familiar to anyone who has tried to keep a CLI agent on task: an agent finishes a few moves, decides it is done, calls `Stop`, and quits — even though the work is not actually finished. The fix that emerged in the broader agent community is to refuse the stop. The agent calls `Stop`; the system intercepts; the agent is returned to the prompt and told to keep working. The loop runs until the work is genuinely done.

The seed agent adopts the Ralph loop through the job system. Every job carries a `status`. The always-on layer's stop-gate hook reads it on every `Stop` attempt; while any job is `active` or still `pending`, the stop is refused and the agent is returned to the prompt with a message explaining what is still in flight. Stop, refused. Stop, refused. The agent learns to keep working until the job formally completes. *[ref: job-status-state-machine-stop-blocking | .claude/plugins/job_core/CLAUDE.md ## State Machine | job_core's state machine: pending↔active↔completed; ANY pending or active job blocks Stop. The seed agent's Ralph loop adoption — Stop is refused until all jobs reach completed.]*

The transitions are explicit. Top-level jobs are born `active` and `focused` the moment the user's prompt fires `prompt-handler.sh` — `job.sh create-active` is the hook-only entry point that bypasses normal creation gates. Dependent jobs are born `pending` via the CONDENSE-only `job.sh create` / `create-dependent`, and move to `active` only when the operator runs `job.sh activate` to switch focus. A job can be `pause`d back to `pending` (loses focus) and re-`activate`d later. *[ref: top-level-vs-dependent-birth-paths | .claude/plugins/job_core/scripts/job.sh `create-active` subcommand + `create` / `create-dependent` subcommands | Birth-path split is enforced by command-level gates: `create-active` is hook-only (fires from prompt-handler.sh, born status:"active" + focused:true); `create` and `create-dependent` are CONDENSE-only (born status:"pending", focused:false). `activate` / `pause` flip the focused-and-active pair; the always-on layer never bypasses these gates.]*

The terminal move — `pending`/`active` to `completed` — is gated: the focused active job's `completion_requirements` must be satisfied (every `depends_on` ID is itself `completed`, plus any required user or plugin-lock approvals), and the operator runs `job.sh complete`. The job's status field cycles through a few states — `active`, `pending`, `completed` — and the transitions are exactly what the Ralph loop needs to refuse `Stop`. *[ref: job-status-transitions-explicit | .claude/plugins/job_core/CLAUDE.md ## State Machine + .claude/plugins/job_core/scripts/job.sh create_active + complete | State diagram in job_core/CLAUDE.md ## State Machine: pending↔active↔completed with focused boolean tracking the one job in flight. job.sh's create-active handler shows top-level creation (status:"active", focused:true) vs CONDENSE's `create`/`create-dependent` (status:"pending", focused:false). The `complete` handler enforces the depends_on completion check and the approval flags before flipping status to "completed".]*

The phasic layer does the same thing one fractal level down — inside a single phase.

Every phase has a fixed point threshold the agent must cross before it is allowed to commit and advance. Cross the threshold and the commit script accepts the move forward. Try to commit before crossing it and the script refuses, returning the agent with a message about what kind of work is still missing. Try to call `Stop` mid-phase and the same refusal fires. The threshold is friction-by-design — a refusal layer that makes the seed agent slow down and do the work the phase exists to do, instead of rushing through phases to get to the next move. *[ref: phase-transition-points-env-tunable-threshold | .claude/plugins/phase_observe/scripts/observe-commit.sh L173-L187 force-mode check | Each phase's commit script enforces `${PHASE_TRANSITION_POINTS:-100}` points + `${MIN_CLAUDE_MD_UPDATES:-1}` CLAUDE.md update before allowing forward advance. The env-var defaults to 100; under-threshold force-commit attempts exit with a coaching voice explaining what kind of work is still missing. The same gate also gives the stop-blocker its refusal signal.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard dial — the multiplier choice.
  Style: Match opevc-cycle-blackboard.png. Dark slate chalkboard; hand-drawn horizontal chalk line for the dial
  with six chalk tick marks; pastel chalk labels (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for the dial line, tick numbers, and action-count strings; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal labels listed below. Do not invent other tick values, action counts, or descriptor words.
  Layout: A horizontal chalk line drawn across the board with six tick marks evenly spaced, left to right, each tick number IN WHITE CHALK:
    "0.5", "1", "1.5", "2", "2.5", "3"
  Below each tick, draw the action-count IN WHITE CHALK; four of the six ticks (the named anchors) also get a pastel chalk descriptor (one word) above the action-count. The two intermediate ticks at "2" and "2.5" get action-counts only — they fill the gradient without their own descriptor word:
    - below "0.5":  cyan descriptor "deep"      / white-chalk "~67 actions"
    - below "1":    green descriptor "standard" / white-chalk "~34 actions"
    - below "1.5":  orange descriptor "targeted"/ white-chalk "~22 actions"
    - below "2":    (no descriptor)            / white-chalk "~17 actions"
    - below "2.5":  (no descriptor)            / white-chalk "~13 actions"
    - below "3":    magenta descriptor "surgical" / white-chalk "~12 actions"
  Above the dial, draw a single curving chalk arrow that runs RIGHT to LEFT (from the "3" tick toward the "0.5" tick) with one short chalk caption riding along the arrow's curve: "smaller number, bigger phase".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "0.5", "1", "1.5", "2", "2.5", "3", "deep", "standard", "targeted", "surgical", "~67 actions", "~34 actions", "~22 actions", "~17 actions", "~13 actions", "~12 actions", "smaller number, bigger phase", plus the caption below. No other words, file names, tool names, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.8. The multiplier is inverse. A smaller number declares a deeper phase."
-->

## The point system underneath

How does the phase know what counts as enough work? Through a per-phase point system.

Each phase has its own point schedule. Actions the phase wants to encourage earn the most; actions it wants to discourage earn less or nothing. OBSERVE rewards synthesis writes into CLAUDE.md and parallel research subagent dispatches above any other action. EXECUTE rewards code edits inside the altered list and execute subagent dispatches. VERIFY rewards script runs and auditor subagent dispatches. CONDENSE rewards routing content into the brain's durable layers — knowledge files, voice files, plugin CLAUDE.mds. The schedules differ on purpose: each phase shapes the kind of work it considers progress. *[ref: verify-point-schedule-shapes-progress | .claude/plugins/phase_verify/CLAUDE.md ## Tools + Points | VERIFY's point table: Read 2pts (primary activity), Bash test 5pts, Agent dispatch 7pts (per-phase auditors), Edit CLAUDE.md 5pts, Edit plan file 3pts; each phase rewards a different mix of moves.]*

The actual numbers, in case the architect needs them:

- **OBSERVE** — CLAUDE.md edit 10, Agent dispatch 7, AskUser 5, Web fetch 4, Read 3, Job-update 3, Grep 2, whitelisted Bash 2, Glob 1.
- **PLAN** — same shape: CLAUDE.md edit 10, Agent 7, AskUser 5, Web 4, Read 3, Grep 2, whitelisted Bash 2, Glob 1.
- **EXECUTE** — MultiEdit 10 (or 5 for partial-replace), Agent 7, Edit 5, Write 5, Read 3, Bash 2.
- **VERIFY** — CLAUDE.md edit 10, Agent 7, AskUser 5, Edit (project file) 5, MultiEdit 5, test-Bash 5, Web 3, plan-file Edit 3, Read 2-3, Grep 2, whitelisted Bash 2, Glob 1.
- **CONDENSE** — Agent 7, root-CLAUDE.md edit 5, AskUser-`[WAITING]` 5, knowledge-file edit 4, voice.xml edit 4, other-md edit 4, memory-file edit 3, job-creating Bash 3, AskUser-other 2, Read 2, other Bash 1.

*[ref: per-phase-config-points-keys | .claude/plugins/phase_verify/config.conf L20-L53 POINTS_VERIFY_* + .claude/plugins/phase_observe/config.conf L20-L61 POINTS_* + .claude/plugins/phase_execute/hooks/execute-tracker.sh hardcoded values | Each phase's POINTS_* values are exported from `config.conf` and sourced by the tracker hook (sample: POINTS_VERIFY_CLAUDE_MD_EDIT=10, POINTS_VERIFY_AGENT=7, POINTS_VERIFY_ASK_USER=5, POINTS_VERIFY_READ=3; POINTS_CLAUDE_MD_EDIT=10, POINTS_AGENT=7, POINTS_READ=3 for OBSERVE/PLAN). EXECUTE is the only phase that hardcodes values in execute-tracker.sh instead of config.conf — a deliberate inconsistency the architect can normalize by lifting EXECUTE's values to a config.conf as well.]*

The shape of each table is the phase's pedagogy: phases producing synthesis (OBSERVE/PLAN/VERIFY) peak at the CLAUDE.md edit (synthesis = decision = the phase's deliverable); EXECUTE peaks at MultiEdit (the heaviest file edit); CONDENSE has no single peak because every routing target is a durable layer the brain wants reached. The numbers are tunable via each phase's `config.conf`; the *ranking* is the design intent. *[ref: per-phase-point-schedules-config-conf | .claude/plugins/phase_observe/config.conf + .claude/plugins/phase_plan/config.conf + .claude/plugins/phase_execute/hooks/execute-tracker.sh + .claude/plugins/phase_verify/config.conf + .claude/plugins/phase_condense/config.conf | OBSERVE/PLAN/VERIFY/CONDENSE expose POINTS_* values via config.conf (sourced by tracker hooks). EXECUTE hardcodes its values directly in execute-tracker.sh (Read 3, Edit 5, Write 5, MultiEdit 10/5, Bash 2, Agent 7). All five tables share the convention "highest reward = phase's pedagogical core."]*

The point system is *invisible to the seed agent*. No instruction file mentions points. No coaching voice cites a number. No subagent prompt rewards points. The agent never sees its current score and never sees the threshold. What the agent sees, when a gate fires, is the *kind* of work it needs more of — the coaching voice tells it to read before writing, or to synthesize before reading more. The arithmetic is the orchestrator's; the experience is just the friction. *[ref: coaching-voice-is-the-experience-not-the-number | .claude/plugins/phase_observe/hooks/voice.xml coaching voices + observe-tracker.sh tier-distance dispatch | The tracker dispatches coaching voices based on how far the agent is from the gate, not on the number itself. The voice teaches "read before writing" / "synthesize what you've gathered"; the underlying point-distance is invisible. The friction the agent feels is qualitative coaching, not a visible score.]*

Hiding the score is deliberate. A scoreboard the agent could see would create point-chasing — the model is good at optimizing what it can measure. The seed agent is not allowed to optimize this one. It can only do the work, and the work earns points the agent never counts. *[ref: points-invisible-prevents-gaming | .claude/plugins/phase_observe/docs/principles.md ## 7. Points are invisible during work | Principle 7: agent never sees point count mid-work; points surface only in min/max gate blocks and commit rejection. Rationale: scoreboard visibility converts behavioral shaping into a gamification target.]*

## The dial

Now bring in the multiplier.

On entry to every phase, the agent must set a multiplier — chosen from a fixed dial at `0.5, 1, 1.5, 2, 2.5, 3`. Tools are locked until the choice is made. Once made, it cannot be changed for the entry. The multiplier scales how many points each action in the phase's schedule is worth. A high multiplier weights every action up; fewer actions clear the threshold. A low multiplier weights every action down; more actions are needed. *[ref: multiplier-scales-points-in-jq | .claude/plugins/phase_observe/scripts/observe.sh:243-258 | OBSERVE's add-points command multiplies action points by the entry's multiplier value (line 253 — $p * $e.multiplier) before adding to the points counter; the multiplier scales each action's reward in jq directly.]*

The naive read is that multiplier scales workload up. The intuition is exactly backward. **A smaller multiplier declares a larger phase.**

A `3.0` multiplier means each action is worth three times the base points. The gate opens fast — in practice, around twelve actions (at the prototype's current calibration). The agent has declared: "this phase is small. Twelve focused actions and I expect to have done what the phase requires." A surgical bug fix. A typo. A targeted lookup-and-edit. *[ref: dial-three-multiplier-surgical-pace | .claude/plugins/phase_observe/scripts/observe.sh L243-L258 multiplier-scaling jq + .claude/plugins/phase_observe/scripts/observe-commit.sh L173 threshold | At 3.0 the jq triples each action's base points before the threshold compare; with the default 100-point gate and the OBSERVE schedule's roughly three-point average per action, the gate clears in about twelve actions. Declaring 3.0 is declaring "I forecast this phase is small" — the dial's surgical setting.]*

A `1.0` multiplier is the standard pace — about thirty-four actions to cross the threshold (at the prototype's current calibration). *[ref: dial-one-multiplier-default-pace | .claude/plugins/phase_observe/scripts/observe.sh L243-L258 jq identity-scaling + .claude/plugins/phase_observe/config.conf POINTS_* values | At 1.0 the jq scaling is identity — base points apply unchanged. The 100-point default threshold against the OBSERVE schedule's average action weight lands the gate at roughly thirty-four actions. The dial's center: no scope opinion declared, the agent paces the phase under standard friction.]*

A `0.5` multiplier means each action is worth half the base points. The gate takes around sixty-seven actions to open (at the prototype's current calibration). The agent has declared: "this phase is large. I am settling in for deep work and will not be ready to advance until at least sixty-seven actions in." A research-heavy investigation. A multi-file refactor. A complex feature. *[ref: multiplier-divides-action-budget-arithmetic | .claude/plugins/phase_observe/scripts/observe.sh L243-L258 multiplier-scaling jq + observe-commit.sh L173 `${PHASE_TRANSITION_POINTS:-100}` | The arithmetic: 100-point default threshold ÷ (multiplier × average-action-points ~3) ≈ action count. At 3.0 multiplier: 100 / 9 ≈ 12 actions. At 1.0: 100 / 3 ≈ 33-34. At 0.5: 100 / 1.5 ≈ 67. The "at the prototype's current calibration" rescue names both surfaces the architect can swap — the threshold env var and the per-phase point schedule.]*

The intermediate values fill the dial. `1.5` lands around twenty-two actions, `2.0` around seventeen, `2.5` around thirteen (at that same calibration) — each tick shapes the phase further toward surgical. *[ref: dial-intermediate-values-jq-uniformity | .claude/plugins/phase_observe/scripts/observe.sh L243-L258 multiplier-scaling jq + L356-L357 dial validator allow-list | At 1.5 multiplier: 100 ÷ (1.5 × ~3) ≈ 22 actions; 2.0 ≈ 17; 2.5 ≈ 13. The jq is one scaling expression that handles all six dial ticks uniformly — the validator allow-list enumerates the six values, the arithmetic does not branch per tick.]*

## Both directions of error cost

Pick the multiplier wrong in either direction and there is a real cost. Forecast too small (high multiplier on what turns out to be deep work) and the gate opens after only a handful of actions — long before the phase's work is actually done. The agent could advance forward with the work half-finished. If it does, a later phase (verify especially) catches the gap and forces a backward transition; the under-served phase re-enters and finishes what should have been done the first time. Forecast too large (low multiplier on what turns out to be surgical work) and the agent must pile on actions the phase did not actually need to clear the gate — wasted reads, padded subagent dispatches, context-window inflation for nothing. *[ref: voice-both-error-directions-cost | .claude/plugins/phase_observe/scripts/voice.xml voice-id observe.info.multiplier-set | The observe.info.multiplier-set voice fires when the agent sets a multiplier and explicitly tells the agent: "Both error directions cost — under-forecast tightens the gate and forces re-entry; over-forecast leaves capacity unused."]*

The architecture deliberately makes both directions of error cost something. The point of the dial is not to find the safe choice — there is no safe choice. The point is to force a real act of meta-cognition before the phase begins.

This is the deeper move. The multiplier choice forces the agent to *anticipate the phase*. Before the agent picks a value, it has to read the working memory and ask itself: how heavy is this phase actually going to be? What will I be doing? How many subagents will I need? How many CLAUDE.md edits? The answer is encoded in the multiplier value. And once the multiplier is set, the agent's natural next move is to write a todo list that matches it — twelve focused steps for a `3.0`, sixty-seven slower steps for a `0.5`, with the rhythm planned in advance. The dial is a single scalar; what it produces is structured anticipation. *[ref: entry-voice-forecast-phase-from-context | .claude/plugins/phase_observe/hooks/voice.xml voice-ids entry-set-multiplier-pre-set + entry-set-multiplier-post-set | OBSERVE entry voice fires on phase entry: tools are locked until multiplier is set; forecast this phase from session context (not patterns from earlier cycles); lock with observe.sh set-multiplier when the forecast is computed.]*

## Persistence across rollbacks

The point counter behaves a level below this in a way the architects should know about. *Backward transitions preserve points; only successful forward advances reset them.* If the agent enters VERIFY, collects fifty points of audit work, then rolls backward to EXECUTE to fix a small thing, the verify entry's fifty points are preserved. When the agent advances forward again — execute back into verify — VERIFY resumes from where it was, the audit work already earned, the remaining gap unchanged. *[ref: forwarded-flag-survives-rollback-resumption | .claude/plugins/phase_execute/hooks/execute-sensor.sh:137-148 forwarded-flag check + phase.sh `advance` cycle-counter logic | The forwarded-flag mechanism survives the rollback: the orchestrator sets `forwarded:true` only on successful forward advance, so a backward transition leaves the entry unfinalized; the next forward re-entry reads the same entry and inherits its point counter unchanged.]*

Only a successful forward advance out of a phase finalizes its entry and resets the counter for the next time the phase is entered fresh. The architecture rewards persistence across rollbacks. The agent does not lose work to the rollback; it loses only the time spent fixing what made the rollback necessary. *[ref: forwarded-false-resumes-with-preserved-points | .claude/plugins/phase_execute/hooks/execute-sensor.sh:137-148 | On phase re-entry, the sensor checks the last entry's forwarded flag: false (not yet finalized by a forward advance) means reuse with preserved points; true or absent means initialize a fresh entry with cleared points.]*

Pattern-matching from past phases is also explicitly forbidden. "Verify is usually short" or "observe is usually deep" are exactly the wrong heuristics — they short-circuit the meta-cognition the multiplier exists to force. The coaching voices are deliberately engineered to avoid known multiplier anti-patterns: leading words, translation tables (multiplier to action-count), phase metaphors that pre-encode scope. Earlier drafts of those voices were pruned of each pattern as it surfaced, with the removal noted in-line. The voice is engineered to leave the forecast unmade until the agent makes it, on *this* phase's evidence alone. *[ref: anti-pattern-catalog-removed-translation-table | .claude/plugins/phase_observe/scripts/voice.xml comment block above voice-id observe.info.multiplier-set | XML comment documents removal of approx_actions translation table per anti-pattern catalog #5/#9; multiplier value is the operative output, the agent already forecasted from session context — voice avoids prescribing the forecast.]*

## What a scalar between 0.5 and 3 carries

A scalar between `0.5` and `3` carries the weight of all of this. The Ralph loop refuses the stop. The point threshold creates the friction. The point schedule defines what work counts. The point system stays invisible so the agent does not learn to game it. The multiplier dial forces an act of forecasting, and the forecast in turn forces a structured plan of attack for the phase. Simple jobs find a high multiplier and the gate opens early. Complex jobs find a low multiplier and the gate stays shut until the agent has put in the work the phase actually needs. Every phase begins with a real moment of meta-cognition — and the rest of the phase is the agent living up to it.

This is the part of the seed agent's design I find most quietly elegant.

## A worked example

Picture the same multi-cycle plan-job we have been tracking — the migration of a large body of work from one repo to another — entering two different phases at two different moments. The job is the same. The dial is the same. The multiplier choices are different, and the difference is the meta-cognition.

**Cycle 1, OBSERVE.** The agent enters OBSERVE on the first cycle of the migration. Working memory is nearly empty. The injected context is a one-line objective. The agent has never touched the target repo. The forecast is honest: this phase is broad — map the codebase, find the contradictions, walk the prior cycles' knowledge, dispatch parallel research subagents, interview the architect on routing decisions. The agent picks `0.5`. *[ref: observe-low-multiplier-investigation-pool | .claude/plugins/phase_observe/hooks/observe-tracker.sh L225-L233 distance-tier pool definitions | The OBSERVE tracker dispatches coaching from the investigation-oriented "work" pool when remaining budget exceeds 60 points — exactly the regime a 0.5 multiplier creates by widening the gate. The pool ordering shapes the rhythm of a deep phase: investigation-pool early, synthesis-pool middle, finishing-pool late.]*

The threshold expands to roughly sixty-seven actions. The agent settles in for deep reading, three observe-subagent dispatches in the first hour, two `[WAITING]` questions for the architect, and seven CLAUDE.md synthesis writes before the gate opens — and the agent advances when the synthesis is actually complete, which on this kind of broad phase usually lands within a handful of actions of the gate opening. *[ref: observe-action-mix-at-low-multiplier | .claude/plugins/phase_observe/config.conf POINTS_AGENT=7 + POINTS_CLAUDE_MD_EDIT=10 + POINTS_ASK_USER=5 | At 0.5 multiplier each action scales to half base points: 3 Agent dispatches × 7 × 0.5 = 10.5pts; 2 `[WAITING]` × 5 × 0.5 = 5pts; 7 synthesis writes × 10 × 0.5 = 35pts. The mix lands around 50pts plus reads + greps before the 100-point gate opens — the action-count narrative ("around sixty-seven actions") follows from the OBSERVE point schedule, not an arbitrary number.]*

**Cycle 3, EXECUTE.** Three cycles later, the same job enters EXECUTE for a surgical task. The plan named one altered-list directory and a single hook update. The judgment-call criteria are sharp. The agent has every piece of context the plan inherited. The forecast is honest: this phase is small — revert one block of code, edit one hook, run no scripts. The agent picks `2.5`. The threshold compresses to roughly fifteen actions (at the prototype's current calibration). The agent dispatches one execute-subagent for the revert, writes the hook update, commits at the checkpoint, the gate opens, the agent confirms the planned work is done, and advances. *[ref: execute-high-multiplier-multiedit-pedagogy | .claude/plugins/phase_execute/hooks/execute-tracker.sh point-table (MultiEdit 10, Edit 5, Write 5, Agent 7) | EXECUTE rewards heavy file edits the most (MultiEdit 10pts > Edit/Write 5pts > Read 3pts > Bash 2pts) so a high-multiplier surgical phase clears the gate with a small number of targeted operations — one MultiEdit + one Agent dispatch = 17 base points, scaled 2.5x = 42.5 toward the 100-point threshold.]*

Same job. Same dial. One forecast says "I am settling in"; the other says "I am in and out." The arithmetic is invisible — the agent never sees a number. What the agent does see is the felt size of the phase, before it starts the work. The multiplier is the act of declaring that size out loud, in a single scalar, before any tool unlocks.

## What you would customize

The multiplier is one of the architectural surfaces with the *most* room for an architect's opinion. The mechanism is small enough that the customizations are pointed.

The architect would tune the *dial range and granularity*. The prototype's `0.5, 1, 1.5, 2, 2.5, 3` lands in the middle of the design space — wide enough to express real variation, narrow enough that every tick is meaningful. A seed running tighter, more rhythmic work might want a coarser dial (`0.5, 1, 2, 3`); a seed running highly variable workloads might want a finer dial covering `0.25` through `5`. The range encodes the architect's belief about how much variation in phase size the work actually produces. The wider the dial, the more meta-cognition the agent has to do at entry. *[ref: dial-validator-locked-to-six-values | .claude/plugins/phase_observe/scripts/observe.sh L356-L357 set-multiplier case arm | The dial allow-list `0.5|1|1.0|1.5|2|2.0|2.5|3|3.0` is enforced by a case-arm validator; anything else rejected with "Invalid multiplier: must be 0.5, 1, 1.5, 2, 2.5, or 3." The validator is the customization surface — swap the case-arm to add `0.25` or `5` ticks and the dial widens without touching the scaling arithmetic.]*

The architect would tune the *per-phase point thresholds*. The prototype lands around thirty-four actions at `1.0` multiplier for most phases — calibrated against the prototype's own work at the current setting. A seed doing legal research, where each "action" is a long reading task, might set the OBSERVE threshold higher; a seed doing rapid code patches might set EXECUTE lower. The thresholds are environment-tunable; the schedules that feed them are per-plugin. *[ref: threshold-and-schedule-customization-surface | .claude/plugins/phase_observe/scripts/observe-commit.sh L173 `${PHASE_TRANSITION_POINTS:-100}` + .claude/plugins/phase_observe/config.conf MIN_* values | The per-phase threshold is the env var `PHASE_TRANSITION_POINTS` (default 100); the per-phase point schedule lives in `config.conf` as POINTS_* values (overrideable). Two surfaces, two customization handles — bump the threshold to slow a phase down, edit the point schedule to change what kind of work counts.]*

The architect would adjust the *multiplier-rollback interaction*. The prototype preserves points across backward transitions — rollbacks do not destroy progress. A stricter seed might decide that re-entering a phase resets a fraction of the accumulated points to force a re-affirmation of the work. A more permissive seed might preserve points even across cross-cycle backward edges, treating phase identity as the only thing that matters for the counter. The rule lives in one branch of the sensor; the consequences ripple through every long-running job. *[ref: rollback-rule-lives-in-sensor-branch | .claude/plugins/phase_execute/hooks/execute-sensor.sh L137-L148 forwarded-flag re-entry branch | The rollback-preservation rule is one sensor branch: if the last phase entry has `forwarded:false`, the sensor reuses the entry and inherits its point counter; if `forwarded:true` or missing, the sensor initializes a fresh entry with cleared points. Swap the branch's reuse-policy (partial decay, full preservation across cycles, cross-cycle phase-identity binding) and the rollback economics change without touching the scoring code.]*

The inverse-multiplier pattern — an inverse-direction scalar set at entry, forecast before the work begins, scoring an invisible point system against a hidden threshold — lifts off the prototype into any work where a misforecast of scope is expensive. A consulting practice cultivating an engagement-delivery seed could install a per-engagement scope dial — *surgical*, *standard*, *deep* — that forces the partner to forecast scope before the billable work begins, with the agent's actions silently scored against a hidden threshold the partner never sees. A misforecast in either direction costs: too small and the engagement reopens to finish, fragmenting the client record; too large and the engagement pads, and the agent does more discovery than the brief merited.

The honest design-limit is worth naming: the dial is friction, not mathematics — a voice injection at phase entry plus a counter checked at commit. A determined operator can enter [gmode](06_9-gmode.html), the named off-cycle lane, to step outside the phasic system entirely and pay the deliberate-bypass tax of composing the justification; the discipline lives in the architect's willingness to honor the dial rather than game it. *[ref: dial-is-friction-not-mathematics-gmode-bypass | .claude/plugins/phasic_system/hooks/gmode-gate.sh L77-L81 ≥100-word [GMODE] justification + .claude/plugins/phase_observe/docs/principles.md Principle 7 invisible-points | The honest limit: the dial enforces nothing physically. Voice + threshold are friction, and the gmode escape hatch is named and documented (≥100-word justification floor) precisely so a bypass is deliberate operator work, not accidental drift. The "discipline lives in honoring rather than gaming" framing IS the architecture — it cannot be enforced mathematically without breaking the invisible-points principle.]*

What the architect would **not** customize is the *invisibility of points*. The principle is the floor: an agent that can see its score will optimize for the score. The whole point of the dial is to surface the only number the agent needs — the multiplier — and force the meta-cognition that produces it. Showing the score would short-circuit the very discipline the architecture exists to create. *[ref: invisible-points-not-a-customization-surface | .claude/plugins/phase_observe/docs/principles.md ## 7. Points are invisible during work | Principle 7 is explicit that the agent NEVER sees the running point count mid-work; it surfaces only at gate-block or commit-rejection moments. The rationale text names the failure mode this principle prevents: "scoreboard visibility converts behavioral shaping into a gamification target." The principle is the architectural floor — every other dial-related knob in the customization section sits above it.]*

The deepest payoff of the multiplier is the cognitive failure mode it prevents: the *unforced phase*. An agent that enters a phase without a felt size for it falls back on whatever the previous phase looked like, or whatever the last cycle's phase looked like, or whatever the prompt seemed to want. None of those is the *current phase's* honest scope. The dial forces the agent to put a number on the felt size before the tools unlock. The number is wrong sometimes; that is the point. Both directions of error cost something. The friction is the pedagogy. The dial is the compartment.

---

## What comes next

Phases give the agent compartmentalized cognition. The CLAUDE.md layer from the [Essay 5 series](b5/05_1-the-two-layer-foundation.html) is the working-memory form they write that cognition into — the surface where each cycle's tokens land before CONDENSE absorbs them into longer-term memory. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

This is what [Essay 1](01-llms-are-not-the-agents.html) was reaching toward when it claimed the agent is the filesystem. The filesystem holds memory. The phases discipline what the agent does with it. The two ideas only fully resolve when you see them together.

Stretch one cycle into many, chained, and you get the long-horizon discipline [Essay 8](08_1-apprentice-to-architect-foundation.html) is about — multi-cycle jobs where the multiplier sentinel, the plan-file contract, and the seven-step waterfall keep the agent honest across days, not just minutes. The mechanisms in this essay are designed to scale up that way without losing their grip.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design?

Next.

---

*Essay 6.8 — The Markov Phasic Brain, Part 8 of 10.*

*Previous: [Essay 6.7 — CONDENSE — The Cognitive Organ](06_7-condense.html) — the seven-step waterfall, the deflation gate, the only phase that edits the brain.*
*Next: [Essay 6.9 — GMODE — The Off-Cycle Lane](06_9-gmode.html) — the operator's deliberate maintenance lane that lives outside the OPEVC cycle.*










