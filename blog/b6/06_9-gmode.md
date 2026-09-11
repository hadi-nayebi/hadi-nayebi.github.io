---
title: "GMODE — The Off-Cycle Lane"
date: "May 15, 2026"
slug: "gmode"
read_time: "8 min"
tags: [Architecture, Seed Agent, OPEVC, GMODE]
status: published
version: v0.3.0
audience: "Tier 2 → Tier 3"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# GMODE — The Off-Cycle Lane

*Essay 6.9 — The Markov Phasic Brain, Part 11 of 13.*

---

[Essay 6.8](06_8-inverse-multiplier.html) covered the rhythm of work inside a phase — the paired gates that pace it from within, and the reflection-keyed exit gate that opens each boundary. This essay turns to the opposite case: the work that doesn't fit any phase's compartment at all. The off-cycle lane.

Every phase, including idle, carries one extra edge that loops back to itself through gmode — short for *generic mode*. Gmode is the freestyle side-channel: a deliberately unconstrained state used for work the seed agent needs to do *now*, but for which the OPEVC ceremony would be overhead rather than discipline. *[ref: every-phase-carries-gmode-edge | private historical prototype | Claim checked against a private historical prototype.]*

The implementation details below describe one historical Claude-based reference architecture. The broader harness pattern is a named maintenance lane with explicit entry authority, durable return state, and a verified exit back to the interrupted workflow.

This essay is for you — especially when you are doing ad-hoc maintenance on your own running seed.

---

## What it owns

Gmode owns the **off-cycle state** of a focused job. When the focused job's `current_phase == "gmode"`, every phase guard sees a phase name that isn't its own and steps aside. The phase plugins' tool restrictions silently switch off; the seed agent regains full write access without entering any specific phase. *[ref: phase-guards-step-aside-in-gmode | private historical prototype | Claim checked against a private historical prototype.]*

The architectural reason gmode is one edge on *every* phase — not a separate state machine — is that gmode entry must work from wherever the agent currently is. A deadlock surfaces during PLAN; a plugin needs a one-line fix during VERIFY; a registry entry is missing during idle. The off-cycle lane has to be reachable from every node in the OPEVC graph. Making it a self-loop on each phase keeps the cycle counter and the home phase intact while the side-work happens. *[ref: gmode-self-loop-via-guard-check | private historical prototype | Claim checked against a private historical prototype.]*

## How it works — readiness, justification, atomic stash, verified exit

Entry and exit happen through a sequence of mechanisms. The job is first made recoverable. A justification then reaches the user for approval. On entry, the home phase is stashed atomically. On exit, the harness requires a clean working tree and a new root-cause note, restores the home phase, and clears and reinjects the paused job's cognition. The sections below unpack that sequence; the readiness gate appears in its own section because it protects the job before the bypass request can even be asked.

**The justification floor.** The seed agent enters gmode by asking the user an `AskUserQuestion` whose body is prefixed `[GMODE]` and whose total word count meets a configurable minimum — currently a word-count floor in the prototype (set to 100 in `config.conf`, tunable per seed). Anything shorter is rejected before the question ever reaches the user. The floor exists to force the agent to articulate, in prose, *what* the issue is, *what* was tried, and *why* the OPEVC compartment won't fit. The justification is the cost of the bypass. *[ref: gmode-100-word-floor | private historical prototype | Claim checked against a private historical prototype.]*

**The atomic stash.** When the user confirms entry, the orchestrator runs a single `jq` update that does several things at once: it copies the current phase into a hidden field called `pre_gmode_phase`, it stashes the entry's return note and a snapshot of the open root-cause-note count, and it overwrites `current_phase` with the literal string `gmode`. The write is atomic — the home phase is captured in the same write that turns the phase guards off. There's no window where the agent is in gmode but the orchestrator has forgotten where it came from. *[ref: atomic-pre-gmode-stash | private historical prototype | Claim checked against a private historical prototype.]*

**The two-part exit gate.** When the agent calls `phase.sh exit-gmode`, the orchestrator checks two things. First, the working tree: if `git diff` or `git diff --cached` reports anything uncommitted, exit dies with a structured error and the agent stays in gmode until it commits or stashes. Second, the root-cause commitment: the agent must have emitted a *new* `[PENDING-JOB]` note during this gmode — a note whose objective is the independent root-cause investigation of whatever forced the gmode. Only when the tree is clean *and* a new root-cause note exists does the orchestrator read `pre_gmode_phase` and atomically restore the home phase. *[ref: gmode-exit-clean-git-then-restore | private historical prototype | Claim checked against a private historical prototype.]*

Why force a root-cause note even when the gmode fix was complete? Because the thing that *forced* a gmode deserves an investigation independent of the patch — the root cause may be wider than what the gmode touched. A gmode that believes it closed the issue still emits the note; the independent investigation, run later, judges whether the class is actually closed. The note rides the existing marker pipeline into a real job at the next CONDENSE, where job creation belongs.

The cycle counter does not advance through gmode. The home phase is the home phase; gmode is a side-step that returns to it. *[ref: cycle-counter-untouched-by-gmode | private historical prototype | Claim checked against a private historical prototype.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/gmode-b6-9.png
  Concept: Chalk-on-blackboard sketch of the OPEVC cycle as a five-node ring (OBSERVE / PLAN / EXECUTE / VERIFY / CONDENSE) with an idle node sitting outside the ring. From every node — including idle — a single dashed chalk arrow loops out to a central chalk-box labeled "gmode" and a second dashed arrow loops back. A small chalk caption near each loop-pair reads "stash pre_gmode_phase" on the outgoing edge and "atomic restore" on the returning edge. A separate chalk gate icon labeled "≥100-word [GMODE] question" guards every outgoing arrow; a second chalk gate icon labeled "clean git" guards every returning arrow.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the OPEVC ring nodes, green for the idle node, orange for the central gmode box, pink for the entry-gate icons, magenta for the exit-gate icons);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Center — a single orange-fill chalk box labeled IN WHITE CHALK exactly: "gmode".
  Ring around the gmode box (clockwise from top) — five small cyan-fill chalk boxes arranged as a pentagon, labeled exactly: "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE".
  Off to the lower-left of the pentagon — a single green-fill chalk box labeled exactly: "idle".
  From each of the six perimeter nodes — a single dashed white-chalk arrow curves into the central gmode box. A second dashed white-chalk arrow curves back from gmode to the same node. Six arrow-pairs total.
  Near the outgoing arrows (between perimeter and gmode) — a small pink-fill chalk gate icon labeled exactly: "≥100-word [GMODE]". Near the returning arrows — a small magenta-fill chalk gate icon labeled exactly: "clean git".
  Between gmode and each outgoing arrow — a small white-chalk caption labeled exactly: "stash pre_gmode_phase".
  Between gmode and each returning arrow — a small white-chalk caption labeled exactly: "atomic restore".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "gmode", "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE", "idle", "≥100-word [GMODE]", "clean git", "stash pre_gmode_phase", "atomic restore".
  Caption (HTML text shown under the image, not drawn inside the image): "Image 6.9. Every phase, including idle, carries one self-loop through gmode. Entry costs a justification floor; exit requires clean git plus a new root-cause note; the home phase is restored atomically."
-->

## Readiness first — preparing the job before the lane opens

The justification floor is not the first gate. Before the `[GMODE]` question is even *allowed* to reach the user, the focused job has to be **prepped** — its cognition made safe for the detour. That readiness check sits upstream of the word-count floor, and the floor never gets a chance to fire until it passes.

Here is the worry it answers. Gmode is a maintenance detour. It can run long. It can do heavy work — its own reads, its own edits, its own thinking — and that work consumes context. The seed agent's always-on compaction discipline is still live inside gmode (it never switches off), so a long enough detour can trigger a compaction *while the agent is mid-fix*. If the job's own cognition wasn't safely written down before the detour started, that compaction could blur it. The fix should never cost the seed agent the thread of the job it stepped away from.

So the lane refuses to open until the job is recoverable. The gate is a small piece of state on the focused job's compaction file — the digital cortex file that carries the *cognition about a job* across a context boundary — a field that reads `false`, `true`, or `locked`. It starts `false` on every job, and while it is `false` the `[GMODE]` question is blocked outright. *[ref: gmode-prepped-three-state-field | private historical prototype | Claim checked against a private historical prototype.]*

**The flip costs real articulation — and real work.** The seed agent moves the field from `false` to `true` through a single shape-gated command, and the command refuses to fire on a token gesture. It asks for two things. The first is a substantive description of *what* the agent did to prep the job's cognition — what it sealed, what survives the in-gmode compaction, why the job is recoverable — held to a word-count minimum so a one-word string can't pose as preparation. The second is not a claim but a *deed*: the flip is blocked unless the agent has **actually touched the compaction file recently** — a real `metacog-reflect` update that landed within the last few bash calls, measured by the plugin's own per-window call odometer. If no such touch exists, or the last one is stale, the flip is refused and the agent is coached to run a fresh `metacog-reflect` and then re-prep. The point is deliberate: a typed number could always be optimistic, but a recent write to the file is a fact the machinery can check. A confidence percentage would have been the agent grading its own homework; a real recent touch is the homework itself. *[ref: gmode-prep-real-touch-flip-command | private historical prototype | Claim checked against a private historical prototype.]*

**The prepped state is deliberately fragile.** Once the field reads `true`, it means one thing: *ask the `[GMODE]` question right now.* It is not a durable "ready" badge to hold while doing other work. A reflex hook watches the `true` state, and only the gmode question itself may legitimately follow a flip. If the question is asked and accepted, the field moves `true → locked` and gmode begins. If the question is declined, it falls back to `false` — prep again. And if the agent reaches for *any other tool* while the field is `true` — a read, an edit, anything but the gmode question — the hook resets it to `false` and warns: the prepped state is spent; you must ask the gmode question as your very next action, because only the question locks it. *[ref: gmode-prepped-transient-watch-hook | private historical prototype | Claim checked against a private historical prototype.]*

This is why the prep is mandatory but the rest of the entry is the agent's judgment. The readiness — having a recoverable job file before stepping away — has to hold *every time*, so it is baked into a gate. Whether to fully compact the live session on the way in, or carry the live context into gmode and let the in-gmode compaction handle it, is a case-by-case call the agent makes once the job is already safe. *[ref: gmode-arc-mandatory-prep-optional-entry | private historical prototype | Claim checked against a private historical prototype.]*

Inside the lane the discipline keeps running. If a long detour does trip the compaction trigger, gmode uses the older summarize-in-place compaction rather than the seed agent's normal clear-and-reinject — because clearing mid-fix would throw away the live diagnostic state the detour is built on. The job's cognition is safe on disk regardless; this in-place form is the one place in the design where the legacy compaction still earns its keep. *[ref: gmode-interior-native-compact | private historical prototype | Claim checked against a private historical prototype.]*

And the exit pays the matching cost. Alongside the clean-git check and the root-cause note, leaving gmode *requires* the seed agent to fold any job-relevant lessons from the detour back into the compaction file, then run a full clear-and-reinject that **restores the paused job** — pulling the original cognition back into a fresh session so the home phase resumes with its thread intact, not the gmode mission. The prepped field resets to `false` on the way out, so the next detour has to earn a fresh prep. *[ref: gmode-exit-mandatory-restore-reinject | private historical prototype | Claim checked against a private historical prototype.]*

## What would break without it

Without the off-cycle lane, two failure modes would alternate.

The first failure mode is **ceremony overhead.** Every ad-hoc fix — a deadlock, a missing registry entry, a one-line documentation correction surfaced mid-cycle — would force a full OPEVC pass to land. OBSERVE the situation, PLAN the fix, EXECUTE one line, VERIFY a script, CONDENSE the result. A full OPEVC ceremony for sub-minute editing. Most seed agents in that situation would learn to avoid noticing problems mid-cycle, which is the opposite of the discipline OPEVC exists to build. *[ref: ceremony-overhead-without-bypass | private historical prototype | Claim checked against a private historical prototype.]*

The second failure mode is **substrate-integrity loss.** The alternative to ceremony is the agent quietly fudging a phase guard — patching the tool restriction so the small edit lands without changing phase. That route corrupts the substrate: the next subagent dispatched in the same phase inherits the loosened guard, the next test run inherits the loosened guard, and the always-on layer's promise that "every phase has a known write scope" is no longer true. One quiet bypass and the architecture is one step less trustworthy. *[ref: phase-guards-as-substrate-integrity | private historical prototype | Claim checked against a private historical prototype.]*

Gmode is the explicit third option. The bypass is named, gated, and structurally separate from the OPEVC graph. The agent's velocity drops at the entry (the articulation cost), the working tree is forced clean at the exit, and the home phase returns intact. The bypass exists *because* the alternative — fudging guards in place — is the worse failure. *[ref: gmode-as-architectural-third-option | private historical prototype | Claim checked against a private historical prototype.]*

## A worked example

Pick up the multi-cycle migration job one phase before the EXECUTE we walked through in [Essay 6.5](06_5-execute.html). The agent has just entered EXECUTE on cycle 3. The altered list is set. The first tool call is a Read of `phase_condense/hooks/condense-guard.sh` — the plan calls for adding a marker case to the guard's Bash allowlist, and the agent reads the existing case-arm before writing. The Read returns. The agent notices something the plan never anticipated — one of the guard's `BLOCKED:` messages has *drifted* from the canonical `[phase_<name>] BLOCKED: <reason>` phrasing every other phase guard uses. Cosmetic drift. The kind of drift that survives because nobody phase-guards the phase-guards. *[ref: condense-guard-block-message-pattern | private historical prototype | Claim checked against a private historical prototype.]*

The agent has a choice. EXECUTE's altered list does not include the phase_condense plugin tree. The plan was about marker schemas, not block-message drift. Trying to edit the file from inside EXECUTE would trip the altered-list fence and the edit would be blocked. Trying to add the directory to the altered list mid-phase is not allowed either — altered lists are PLAN's output, frozen at phase entry. A backward to PLAN would be theatrical for a string fix of this scope. *[ref: altered-list-frozen-at-phase-entry | private historical prototype | Claim checked against a private historical prototype.]*

The agent reaches for gmode. Before it can ask, it reflects the migration job's current cognition into its compaction file and runs the prep command, making the interrupted job recoverable. The transient prepped state means the gmode question must be its next action.

It composes a `[GMODE]` question. The body articulates the bypass — *what* is the drift (the exact drifted strings quoted), *what* was tried (EXECUTE altered list, blocked by fence), *why* OPEVC won't fit (a fresh PLAN cycle to authorize a cosmetic string fix is ceremony overhead), and *what* will happen on entry (edit `condense-guard.sh`, run the plugin's test suite, commit, exit). The floor is met; the question reaches the architect. The architect reads, sees the scope is genuinely small, approves. *[ref: gmode-question-composition-pattern | private historical prototype | Claim checked against a private historical prototype.]*

Entry fires. The orchestrator runs the atomic `jq` update. `pre_gmode_phase` records `execute`; the return note and the open-note-count snapshot are stashed; `current_phase` flips to `gmode` in the same write. Every phase guard in the seed agent now sees a `current_phase` value that isn't its own, and every guard short-circuits. The agent's tool palette opens. It edits `condense-guard.sh`, runs the plugin's test suite, the full suite passes, commits with the message `gmode: fix condense-guard block-message drift`. It also records a new `[PENDING-JOB]` note — *investigate why the condense-guard block message drifted from the canonical wording* — capturing the root-cause question from live context. The working tree is clean. *[ref: atomic-stash-worked-example-fire | private historical prototype | Claim checked against a private historical prototype.]*

The agent calls `phase.sh exit-gmode`. The orchestrator runs `git diff --quiet` and `git diff --cached --quiet`. Both pass. It recounts the open `[PENDING-JOB]` notes; the count now exceeds the entry snapshot, so the root-cause gate passes too. The orchestrator reads `pre_gmode_phase`, restores `current_phase` to `execute`, and nulls the three stashed fields. The agent then folds any job-relevant lesson from the detour into the compaction file and completes the required clear-and-reinject, restoring the paused migration job rather than the gmode mission. The phase guards re-engage on EXECUTE's rules. The cycle counter never moved. *[ref: exit-gmode-worked-example-fire | private historical prototype | Claim checked against a private historical prototype.]*

The agent picks up the original EXECUTE work from where it left off. Cycle 3's EXECUTE proceeds exactly as [Essay 6.5](06_5-execute.html) describes — the comment-density gate, the dispatch, the commit. The drift fix never touches the migration cycle's bookkeeping: it landed in its own gmode commit, on a file outside this cycle's altered list, and the cycle counter never moved. When the cycle reaches CONDENSE there is nothing to reconcile — the fix is already committed history, not a loose end the synthesis has to account for. The drift fix landed on its own phase, and the migration cycle continues uncorrupted. *[ref: gmode-fix-isolated-from-cycle-bookkeeping | private historical prototype | Claim checked against a private historical prototype.]*

That is the off-cycle lane working as designed. The bypass was named. The cost was paid. The substrate stayed intact.

## What you would customize

Gmode is one of the more architecturally opinionated surfaces in the prototype. Most of the opinion lives in *defaults*, not invariants — the architect's customization door opens on several distinct knobs.

You would tune the **justification floor.** The prototype's word-count minimum is calibrated for an architect operator who occasionally needs ad-hoc work; a more experimental seed may lower it; a more cautious one may raise it. The number lives in `config.conf` and is read by the gate hook on every fire — no code change required. *[ref: gmode-word-min-in-config-conf | private historical prototype | Claim checked against a private historical prototype.]* Lowering the floor lowers the cost of entry; raising it raises the bar at which gmode is the right choice rather than a fresh job.

You would relax the **clean-git exit requirement.** The prototype requires the working tree to be fully committed before the home phase is restored. A seed that does heavy experimental work — long-running gmode sessions that span multiple work blocks — may want to allow exit with a structured stash, or with a directory-scoped clean check rather than a global one. The trade-off is substrate integrity: a relaxed exit means the home phase resumes on a working tree it didn't produce, which the next phase's altered-list discipline will have to handle. *[ref: clean-git-exit-tunability | private historical prototype | Claim checked against a private historical prototype.]*

You would decide **what flows through gmode versus OPEVC versus new phases.** The prototype defaults to routing every job through OPEVC because foundational architectural work demands the discipline; routine plugin maintenance has gone through gmode by exception. Once a seed ships and starts being used for project work, the proportion shifts. Some seeds will route nearly all maintenance through gmode; others will split phase plugins by job type and keep gmode for genuine emergencies. The off-cycle lane is the architect's pressure valve — how often it opens is your call. *[ref: gmode-vs-opevc-routing-default | private historical prototype | Claim checked against a private historical prototype.]*

You would change the **cycle-counter rule.** The prototype treats gmode as a side-step that doesn't consume cycle budget. A seed that wants stronger accounting may decide every gmode entry costs a fraction of a cycle, or that gmode time after the third entry in a cycle counts as a full new cycle. The home phase still restores; only the bookkeeping moves. *[ref: cycle-counter-rule-customization | private historical prototype | Claim checked against a private historical prototype.]*

What you would **not** do is remove the entry gate. A seed agent that admits unconstrained tool access without justification is a seed agent that will eventually rewrite its own discipline mid-cycle and corrupt the layers below it. The gate's friction is the architecture; the specific word count, the specific cleanliness check, the specific cycle rule are the surface. *[ref: entry-gate-is-the-architecture | private historical prototype | Claim checked against a private historical prototype.]*

The pattern lifts cleanly off the prototype. A lawyer's seed could install the same off-cycle lane for emergency client requests that don't fit the matter's billing-phase ceremony — entry costs a `[BILLING-OVERRIDE]` justification of comparable weight (whatever the firm decides is enough articulation to prevent reflexive bypass), exit requires the time entry to be logged before the matter's normal phase resumes. A researcher's seed running long literature-review cycles could install one for ad-hoc methodology questions that surface mid-cycle and would otherwise corrupt the review's scope. *[ref: lane-shape-transfers-across-domains | private historical prototype | Claim checked against a private historical prototype.]*

The architecture is the *bypass-as-deliberate-cost-paid* mechanism: a named lane, a friction gate at entry, a cleanliness check at exit, atomic restore to the home phase. The specific prefix, the specific weight, the specific cleanliness check are the prototype's calibration. The lane shape transfers. *[ref: bypass-as-deliberate-cost-paid-mechanism | private historical prototype | Claim checked against a private historical prototype.]*

The architecture also admits its own honest limits, and naming them is part of the design. The justification floor is friction, not proof — an agent could draft a body that meets the word count without saying anything load-bearing, and the gate would accept it. The user-approval step depends on the user actually reading the body; a habituated rubber-stamp defeats the gate. The clean-git exit can be defeated by an empty `gmode: noop` commit that satisfies the working-tree check without recording real work. None of these are sealed. *[ref: gmode-gate-known-imperfections | private historical prototype | Claim checked against a private historical prototype.]*

The architecture accepts them because the alternative — letting the agent quietly fudge phase guards in place — leaves no trace at all. A bypass that is named, gated, and logged is structurally safer than a bypass that is invisible, even when the named bypass is imperfect. *[ref: bypass-named-vs-bypass-invisible | private historical prototype | Claim checked against a private historical prototype.]*

---

## Two ways to leave OPEVC

The off-cycle lane covers one kind of work that doesn't fit the phasic ceremony: **ad-hoc**, **fast**, **bypass-justified**. The next essay covers the other: **planned**, **long-horizon**, **carried across cycles** — the plan file the seed agent reaches for when the work is too large for a single OPEVC pass.

Gmode is the side-channel; the plan file is the long-channel. Both exist outside the per-cycle compartmentalization OPEVC enforces. Both are deliberate exits — one for the work that's too small for ceremony, one for the work that's too large.

---

*Essay 6.9 — The Markov Phasic Brain, Part 11 of 13.*

*Previous: [Essay 6.8 — The Rhythm of Work](06_8-inverse-multiplier.html) — the min-max rhythm inside every phase and the exit gate that opens each boundary.*
*Next: [Essay 6.10 — The Plan File — Stages and Completion](06_10-plan-state-machine.html) — what the plan file owns, the three Stages, the counting rule that closes a multi-cycle job, and where the plan lives on disk.*


