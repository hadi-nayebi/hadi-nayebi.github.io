---
title: "The Plan File — Long-Horizon Memory"
date: "May 15, 2026"
slug: "long-horizon-memory"
read_time: "10 min"
tags: [Architecture, Seed Agent, OPEVC, Plan File, Long-Horizon]
status: published
version: v0.2.0
audience: "Tier 3"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# The Plan File — Long-Horizon Memory

*Essay 6.10b — The Markov Phasic Brain, Part 13 of 13.*

---

[Essay 6.10](06_10-plan-state-machine.html) mapped the plan file's skeleton — what it owns, the three plan-file Stages, the plugin-form extension beyond them, how a multi-cycle job knows it is done, and where the file lives on disk. That gave us the structure. This essay turns to what makes the structure *long-horizon memory*: the `.yaml` that injects itself at every phase entry, the loop that lets a repeating job get smarter over time, and the customization the whole pattern opens up.

The concrete injection, validation, and reactivation mechanics below come from one historical Claude-based reference architecture. The portable idea is broader: a harness can combine a durable plan with phase-aware runtime injection so work survives sessions without depending on chat history alone.

The plan file is what turns the markov brain from single-session cognition into something that can hold a plan in its head for weeks. *[ref: plan-file-is-long-horizon-substrate | private historical prototype | Claim checked against a private historical prototype.]*

This essay is for you — especially when your work takes longer than one sitting and the plan needs to outlive any single cycle.

---

## How `.yaml` injection turns the brain long-horizon

Both plan files belong to the agent. What changes between them is injection control: the `.md` is loaded by recall or read whole; the `.yaml` is dripped in per phase, granular and consistent.

Once a Stage-3 job is running — its `plan_file` ends in `.yaml` — the phasic system's entry hook reads the `.yaml` on every phase transition and writes the phase-specific field-map to a cache file. The shared voice helper reads that cache when it fires any voice during the new phase, and yaml field-map entries augment the relevant voices — turning a job's structured long-horizon context into a stream of injections that show up automatically wherever the agent is reading guidance. *[ref: phase-init-yaml-injection-on-transition | private historical prototype | Claim checked against a private historical prototype.]*

The augmentation supports append, replace, and prepend modes. A bare-string yaml entry **appends** its text to the rendered voice after a blank line — the back-compat default. A structured entry of the form `{mode: replace, text: "..."}` **replaces** the rendered voice text entirely with the yaml content (useful when the job's context-specific voice should override the universal one). A `{mode: prepend, text: "..."}` entry **prepends** the yaml content before the rendered voice (useful for stamping a job-specific banner above the standard guidance). All three modes apply the same variable substitution as the underlying voice — `{{job_id}}`, `{{focused_name}}`, and the rest substitute identically into the yaml text. *[ref: voice-helper-three-mode-augmentation | private historical prototype | Claim checked against a private historical prototype.]*

The yaml key IS the voice id directly — no transform, no naming convention. That makes the **callable voice catalog** the contract surface for layer-4 customization: a yaml plan can only target voices that some hook or script actually fires. A new helper builds the catalog by scanning every plugin's `voice.xml` for `id="..."` definitions and every non-test `.sh` / `.py` for quoted references. A defined voice with no callsite is an **orphan** — useless, because it never injects into context, and an invisible trap for yaml authors who target it and watch nothing happen. A recurring orphan-cleanup job is planned — once the yaml-job substrate is stable, it will consume the orphan list and either link or remove each one over time. *[ref: voice-catalog-and-orphan-discipline | private historical prototype | Claim checked against a private historical prototype.]*

The yaml plan loader enforces the contract at validation time. When the agent writes a new or edited `.yaml` in EXECUTE — where cycle-1 creates the Stage-3 plan file — the execute guard invokes the plan-owned validators on that write event, and the schema check is followed by a key-vs-catalog check: every key under the phases map must match a callable voice id, otherwise the plan is rejected with a `did you mean` suggestion drawn from the closest matches. This catches the most common yaml authoring error — typing a voice id that no longer exists, or never did — before the job ever runs the cycle. *[ref: yaml-key-validator-rejects-uncallable-ids | private historical prototype | Claim checked against a private historical prototype.]*

A planned job carries its scope-thinking in the plan itself. Phase entry is coached, never gated — there is no ceremony to repeat — and for a Stage-2 or Stage-3 job the coaching arrives pre-loaded: the plan file declares the cycle's work, and the `.yaml` form injects per-phase context straight into the entry voice, so the agent enters each phase already oriented by the document instead of re-deriving the scope from scratch. *[ref: planned-jobs-entry-orientation-from-plan | private historical prototype | Claim checked against a private historical prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/yaml-injection-b6-10.png
  Concept: Chalk-on-blackboard sketch — the .md and .yaml side by side, with the .yaml's phase-entry injection feeding into the OPEVC cycle. The dual-document layout makes "flexible recall" (the .md) vs "per-phase injection" (the .yaml) legible at a glance — both the agent's plan, differing in how their content reaches each phase.
  Style: Chalk-on-blackboard. Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the document tiles and the phase ring;
  white chalk for ALL labels, arrows, and field names; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, field names, or descriptors.
  Layout: Two chalk-drawn document tiles side by side on the left half of the board; a chalk-drawn ring of one circle per phase on the right half. A single arrow stream connects the two halves.
    Left tile (cyan border, drawn as a tall rectangle with horizontal chalk ruling to suggest prose lines): labeled at the top "plan.md", with a smaller white chalk note beneath it "loaded by recall".
    Right tile (orange border, drawn as a tall rectangle with chalk indentation lines to suggest structured fields): labeled at the top "plan.yaml", with a smaller white chalk note beneath it "injected per phase". Inside the .yaml tile, small white chalk field labels stacked vertically, one per phase: "observe:", "plan:", "execute:", "verify:", "condense:".
    A short white chalk double-headed arrow between the two tiles, labeled "same basename".
    On the right half of the board, one circle per phase arranged in a ring: cyan circle labeled "observe", green circle labeled "plan", orange circle labeled "execute", pink circle labeled "verify", magenta circle labeled "condense". Small white chalk arrows connect them clockwise.
    From the .yaml tile, a curved white chalk arrow exits the right edge and fans out into thin chalk lines, each landing on one phase circle. Above the fan, a white chalk note: "injects at phase entry".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "plan.md", "plan.yaml", "loaded by recall", "injected per phase", "observe:", "plan:", "execute:", "verify:", "condense:", "same basename", "observe", "plan", "execute", "verify", "condense", "injects at phase entry". No other words, file names, folders, or descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 6.10. Both are the agent's plan; the .md is loaded by recall, the .yaml is injected per phase. Same basename, different surface."
-->

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>Interactive diagram.</strong> Trace a single job from birth through its phases and Stages to the events that finally close it &mdash; every field, flag, and gate is clickable, with the live code behind each one.</span>
  <a href="explore/job-life.html" title="Open the interactive job-life walkthrough" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Explore a job&rsquo;s life</a>
</aside>
<!-- /RAW_HTML -->

This is the long-horizon mechanism. Without it, every cycle would start cold — the agent would have to re-read the plan and re-derive what each phase should know. With it, the agent's context grows back the long-form structure of the job automatically, each cycle, at every phase boundary. The brain doesn't have to remember to remember. *[ref: phase-entry-is-injection-moment | private historical prototype | Claim checked against a private historical prototype.]*

The `.md` and `.yaml` are not redundant — they are different surfaces of the same agent-facing plan. The `.md` is a flexible prose plan the agent works from by recall, suited to a job still maturing. The `.yaml` is the more controlled form: a structured plan the agent injects into context per phase, consistently, at every boundary. They share a basename so the agent knows they belong together, but they differ in injection granularity. *[ref: md-yaml-coexist-different-surfaces | private historical prototype | Claim checked against a private historical prototype.]*

## The learning loop

A plan file that persists across completions is a plan file that can learn.

When a repeatable job finishes, it does not vanish. Its plan file stays on disk, and the job can be re-activated later — manually, or automatically on a repeating interval when the seed agent compacts and scans for due jobs. On re-activation the cycle counter resets to zero and the run starts fresh, but the plan file survives, and so does one quieter record: the job's `extension_contexts` — the running log of every time a past run had to add a cycle because the declared plan came up short. *[ref: extension-contexts-history-mode | private historical prototype | Claim checked against a private historical prototype.]*

That automatic re-activation is built, and it is worth being precise about how it works — because the answer is deliberately small. While the seed agent is working, there is no separate scheduler. It already compacts its own context on a rhythm; the design couples a scan to that same moment. Every time the agent self-compacts, it walks its completed jobs and, for each one whose repeating interval has elapsed since it last finished, flips exactly that job back to life — one atomic re-activation per due job, no batch command. The flip resets what a fresh run needs reset (the cycle counter, the approval flag, the per-run extension counter) and preserves what carries the job's identity forward (the plan file, the extension history, any plugin-edit approval the job earned). While the seed agent is working, its own rhythm *is* the schedule. *[ref: self-compact-reactivation-rhythm-is-the-schedule | private historical prototype | Claim checked against a private historical prototype.]*

There is one deliberate exception, and it lives at the other edge of the seed agent's life. When no active or pending work remains and the seed goes fully idle, the working rhythm is gone — there is nothing left to ride a scan on. So the stop boundary launches a separate mechanism to carry reactivation while the seed is stopped: a small, single-instance timer-daemon that watches the same completed jobs and wakes the seed when one comes due. It is the one place the architecture admits a timer, by design — a stopped seed has no rhythm of its own, so the quiescent phase gets one.

When the daemon finds due jobs, it reactivates every one of them to pending, equally — no priority, no urgency ranking. Then it does exactly as much as the situation requires, and no more. If a single job came due, there is no decision to make about what to work on next, so the daemon activates and focuses that job itself and wakes the seed straight into it. If several came due, the choice of what to work first belongs to the seed, not the daemon — so the daemon leaves them all pending and just wakes the seed to survey and choose.

Either way the wake is a prompt carrying a reserved `[WAKE]` marker, and that marker is load-bearing: a wake arrives at an idle seed with no active job, which is exactly the condition that would otherwise make the agent bootstrap a brand-new job out of the prompt. The marker tells that bootstrap to stand down — this is a wake into existing work, not a new request. *[ref: quiescent-phase-heartbeat-timer-daemon | private historical prototype | Claim checked against a private historical prototype.]*

Cycle 1 of the new run reads that record. The OBSERVE entry voice surfaces it directly: prior runs added these late extensions; consider whether your refined plan should absorb them upfront. PLAN records the requested refinement, and VERIFY applies it inside the cycle-1 editing window — adjusting `total_cycles` or rewriting a cycle's entry — so the next run plans for what the last run only discovered halfway through. *[ref: cycle-1-observe-reads-extension-history | private historical prototype | Claim checked against a private historical prototype.]*

Over many runs the job converges toward needing no extensions at all. The plan stops being a guess and becomes an accurate forecast of the work, because each run wrote its surprises back into it. The learning is structural, not memorized — a future run reads the better plan directly, the same way it would read any other plan. This is what makes a repeating job get *smarter*, not just *repeat*. *[ref: learning-over-time-structural | private historical prototype | Claim checked against a private historical prototype.]*

## What would break without it

Take the plan file out. Now every multi-cycle job has to hold its own plan in working memory or re-derive it each session. The agent can still attempt long-horizon work, but each cycle starts cold — re-reading whatever notes survive in `knowledge/`, rebuilding intuition the previous cycle already had. Long jobs drift. A late cycle of a migration contradicts an early one because it never read the earlier plan. *[ref: plan-file-is-cross-cycle-memory | private historical prototype | Claim checked against a private historical prototype.]*

Take the `.yaml` injection out. Now the long-horizon context is a document the agent has to *remember* to re-read every cycle. Sometimes it does. Sometimes it doesn't. Injection at phase entry is the discipline that turns "should re-read the plan" into "the plan re-reads itself into the context, every phase, every cycle." *[ref: injection-is-the-discipline | private historical prototype | Claim checked against a private historical prototype.]*

Take the persistence out — null the plan file when the job completes. Now the learning loop dies. Every re-activation starts from a blank plan; the run repeats the same mistakes the last run already paid for. The plan can never become a forecast because nothing carries forward to forecast from. *[ref: persistence-enables-learning | private historical prototype | Claim checked against a private historical prototype.]*

Each layer closes one failure mode of long-horizon work that ordinary chat-history-based agents fail at.

## What you would customize

The seed gives you an ordered ladder of places to make a change, deepest and hardest first: the **phasic substrate** (the cycle shape itself — how many phases, what they are, how they connect), the **hard controls** (the code-level gates that block a tool call outright), the **soft voices** (the coaching and warning messages injected at each phase), the **per-job `.yaml` plan** (a single job tailoring those soft voices at entry, no code touched), and — still on the horizon — a **per-job plugin** (a job that ships its own gates and voices). Friction and blast radius rise as you go down the ladder, so you reach for the shallowest layer that solves the problem. The plan file is the clearest example of the fourth rung — the place where a single job tailors the agent's behavior without touching a line of code. *[ref: plan-file-is-layer-4 | private historical prototype | Claim checked against a private historical prototype.]*

You would design the **`.yaml` schema**. What does each phase need at entry? OBSERVE may want a `recall_targets:` list; PLAN a `decisions_locked:` map; EXECUTE a `forbidden_files:` array; VERIFY an `acceptance_criteria:` list with pass/fail rows. The prototype ships a minimal injection — roughly one objective per phase. Your seed will discover what richer fields produce richer cognition for your work, and the `.yaml` is where that discovery lives. *[ref: yaml-schema-is-customizable | private historical prototype | Claim checked against a private historical prototype.]*

You would tune the **Stage decision**. The current rule lives in cycle-1 PLAN's judgment: a big project likely to span days and revisions gets a plan file; a one-off does not. If your domain has a clear threshold — every matter past a certain size goes multi-cycle — you can codify that as a hint voice that steers the classification. *[ref: stage-decision-is-judgment-shaped | private historical prototype | Claim checked against a private historical prototype.]*

You would set the **repeating interval**. A job that should re-run on a rhythm — a weekly review, a daily digest — carries an interval; when it elapses, the seed agent's self-compact scan re-activates the job automatically — or, once the seed has gone idle, the quiescent-phase daemon does — and the learning loop above kicks in run-over-run. *[ref: repeating-interval-customization | private historical prototype | Claim checked against a private historical prototype.]*

The interval is a single field — `repeating_interval`, measured in whole hours, defaulting to zero for the ordinary one-shot job. Hours is the unit on purpose: not seconds, not a cron expression, just a plain integer count of hours. You would not type the raw number, though. The promotion question offers a base unit — Hourly, Daily, or Weekly — and a value, and resolves the two into hours behind the scenes (a multiplier of one, twenty-four, or a hundred sixty-eight against your typed value). "Daily" with a value of two is forty-eight hours; "Weekly" alone is a hundred sixty-eight. The scan then reads that interval against one companion field — `last_completed_at`, the moment the job last finished — and fires when enough hours have passed. *[ref: repeating-interval-field-hours-and-base-units | private historical prototype | Claim checked against a private historical prototype.]*

`last_completed_at` earns its own dedicated field rather than reusing the job's general "last updated" timestamp, and the reason is precise: the next fire is anchored to the *completion event*, not to any incidental edit afterward. A dedicated field, written exactly once at the moment a job flips to completed, means a later metadata touch — healing a stale value, correcting a label — cannot quietly shift the next fire forward. A job that has never completed carries zero there, and the scan skips it: no prior fire, nothing to measure an interval from. *[ref: last-completed-at-dedicated-anchor | private historical prototype | Claim checked against a private historical prototype.]*

You would decide how a job becomes repeating in the first place — through the **`[REPEAT-JOB]` promotion**. It is a prefixed question the agent raises at the end of a cycle, mirroring the same ceremony that already gates the creation of a plugin-touching job: a phase-restricted, shape-checked question on one side and a handler that writes the interval on the other. It fires only during CONDENSE, the phase where the agent already reflects on what comes next, and a coaching voice at that phase entry nudges the agent to consider it — *if this job's work would recur on a cadence, promote it; otherwise leave it one-shot.* The promotion captures two things: the interval (base unit and value) and whether the re-fire should land the job straight into active work or queue it behind whatever is already running — an urgent hourly health-check wants the former, a quiet weekly review the latter. One-shot stays the default; the promotion is the deliberate exception. *[ref: repeat-job-promotion-ceremony | private historical prototype | Claim checked against a private historical prototype.]*

What you would NOT do is remove the plan file. Take it out and the brain reverts to single-session cognition. The whole markov phasic discipline — the cycle, the cognitive metabolism organ, the rhythm, gmode — is built on the assumption that some jobs deserve to be remembered across cycles. The plan file is what makes that remembering deterministic instead of accidental.

Lift the pattern out of the seed agent and into a law practice. A partner running a long matter carries the plan file the same way: the prose plan accumulates across weekly client-review cycles in `matter.md`. Once that pattern is mature, a later matter can begin with a `matter.yaml` whose structured fields — scope, fee structure, retention terms, conflict-check results — inject at every revision phase, so each follow-up cycle inherits the matter's structure automatically instead of re-reading the prose. Run the same kind of matter again next quarter, and last quarter's surprises are already written into the plan. *[ref: pattern-lifts-to-professional-long-horizon | private historical prototype | Claim checked against a private historical prototype.]*

The plan file is friction, not a wall. An operator in [gmode](06_9-gmode.html) can edit it directly with any editor. The injection assumes the phasic system fires on every phase entry; the counting rule assumes the agent honors the `[JOB-COMPLETE]` ceremony at the right cycle. The architecture is the ceremony; the discipline rests on the agent honoring it, not on the gate being unbreakable. *[ref: ceremony-not-tamperproof-barrier | private historical prototype | Claim checked against a private historical prototype.]*

---

## What the plan file teaches

Long-horizon memory is the final mechanism of the markov phasic brain. The discipline and map from [Essay 6.2](06_2-discipline-and-map.html) gave the brain its phase cycle. CONDENSE from [Essay 6.7](06_7-condense.html) gave it metabolism. The rhythm from [Essay 6.8](06_8-inverse-multiplier.html) gave it honest pacing. Gmode from [Essay 6.9](06_9-gmode.html) gave it an off-cycle lane. The plan file gives it a *horizon* — the capacity to hold the same plan across days, weeks, dozens of cycles, with its structured form re-injecting the plan at every phase boundary so the brain never forgets where the work has reached.

That is what makes the markov brain a brain, not a loop. A loop reacts. A brain remembers. The plan file is the substrate of that remembering, and the `.yaml` injection is the reflex that fires it back into the present every time the agent crosses a phase.

The cycle, the organ, the rhythm, gmode, the plan file — each of these is a mechanism. None of them is the *thing they run inside*. Phases are plugins. CONDENSE is a plugin. Gmode rides on a plugin. The plan-file lifecycle is split between `phase_plan` and `job_core`. Everything in this essay series is built on a standardized way of packaging cognitive mechanisms — the plugin kit. That is the subject of the next essay. *[ref: lifecycle-spans-two-plugins | private historical prototype | Claim checked against a private historical prototype.]*

This is the architect's pivot point. Everything from [Essay 5.1's two-layer foundation](../b5/05_1-the-two-layer-foundation.html) through the markov phasic brain we have just finished mapping — was the seed agent's anatomy. You have seen the always-on cortex, the CLAUDE.md hierarchy, the phases, the cognitive metabolism organ, the rhythm of work, gmode's off-cycle lane, the plan file's long-horizon memory. You have seen *how the seed agent thinks*. What you have not yet seen is how a new piece of that cognition gets *built*.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design? How do you grow a new always-on plugin without breaking the substrate? How do you author your own marker, your own coaching voice, your own subagent definition, and have the rest of the architecture accept them as natively as the prototype's own?

[Essay 7 — The Plugin Kit](../b7/07_1-plugin-kit-foundation.html) is the answer. The brain is built. The kit is what lets you grow new pieces of it safely.

Next.

---

*Essay 6.10b — The Markov Phasic Brain, Part 13 of 13.*

*Previous: [Essay 6.10 — The Plan File — Stages and Completion](06_10-plan-state-machine.html) — what the plan file owns, the three Stages, the completion counting rule, and where the file lives.*
*Next: [Essay 7 — The Plugin Kit](../b7/07_1-plugin-kit-foundation.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*
