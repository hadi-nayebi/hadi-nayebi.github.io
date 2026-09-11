---
title: "The Stages of Job Maturation"
date: "May 17, 2026"
slug: "job-maturation-stages"
read_time: "10 min"
tags: [Architecture, Seed Agent, Maturation, Jobs, Plan File]
status: published
version: v0.2.0
audience: "Power Users & Architects"
og_image: "blog/b8/images/four-stages-b8-2.png"
---

# The Stages of Job Maturation

*Essay 8.2 — From Apprentice to Architect, Part 2 of 9.*

---

[Essay 8.1](08_1-apprentice-to-architect-foundation.html) framed the three growth axes: jobs mature upward, controls migrate inward, the operator shifts from supervising to composing. This essay opens the first axis — the *job-maturation arc* — through one earlier Claude-based reference architecture. Its job system names four forms, from a deep single cycle to a job-specific plugin. A job can begin in any form the work already justifies; many never need the fourth. Moving recurring work into a richer form is a decision the operator and the seed make together, never a flip the seed performs on its own. *[ref: stage-decided-cycle-1-plan | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A consulting practice's seed runs client-intake jobs that look nothing like a research lab's experiment-protocol jobs. Both can use the same underlying progression from exploratory work to repeatable structure, while the *substance* they accumulate differs. The progression is transferable; its exact stages, gates, and artifacts belong to the harness that implements it.

---

## Stage 1 — Deep Single-Cycle OPEVC

This is where an unfamiliar or still-forming job usually begins. The user gives the seed a prompt; the seed treats the prompt as a single OPEVC cycle. The seed is in *learning mode*: it asks questions, takes its time, builds experiential data from the conversation. Backward edges and loops happen *inside* the cycle — not across cycles — because the cycle is the entire job's runway. *[ref: stage-1-signal-plan-file-false | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The seed agent does not rush through this stage. Its goal is to understand what the user wants the completed work to *look like*, what files are involved, what edits feel right, what failure modes the user wants to avoid. The seed asks clarifying questions through structured prefixed asks; it captures every Q+A into the focused job's `user_interactions` array; over many turns, the array becomes the agent's cumulative mega-prompt — the whole history of intent the seed re-reads as its instruction set. *[ref: prefixed-asks-capture-into-user-interactions | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Take a blog-writing job as a concrete example. Cycle 1 starts when the user prompts "let's write a new blog post." OBSERVE asks about the topic, the audience, the existing voice constants, the file inventory the post will produce (.md + .html + transcript + audio + images + ref tags). PLAN sketches an outline; the user redirects; the outline is rewritten. EXECUTE drafts paragraphs; backward edges fire when the user pushes back on a section. VERIFY runs the user's own approval cycle — which sections feel right, which need rework.

CONDENSE then closes the cycle by metabolising what it produced: the four phase footers (OBSERVE, PLAN, EXECUTE, VERIFY from [Essay 5.7](../b5/05_7-claude-md-hierarchy.html)) plus the cycle's marked notes — pending-job, voice-update, agent-update, knowledge, and the durable/ephemeral routing tags, the five note classes from the [CONDENSE essay](../b6/06_7-condense.html). The durable content lands in the knowledge layer alongside the operator's preferences, the files that mattered, and the discipline that emerged. *[ref: condense-absorbs-footers-and-markers | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Different users have different jobs. A chemist running a technoeconomic-analysis job at this stage will follow a very different conversation than the website manager at this stage running a blog-writing job. The seed adapts to each user's specific work because the early-stage OPEVC cycle is *collaborative* — the user shapes the work while the seed records the shaping. The result is that the operator's own seed becomes one that knows how *this* operator wants this kind of job done.

The cycle ends with a deep CONDENSE. The seed absorbs the cycle's interaction history, the file artifacts produced, the user's preferences, the patterns that worked, into the knowledge directory and into the relevant plugin's `evolution.md` files. The next job of the same shape will start from a much richer base. The limit here is friction, not enforcement: a seed can technically advance phases without learning anything, but the deflation gates and the historian's drift counter make doing so visibly costly. *[ref: condense-deep-absorption-evolution-and-historian | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

## Stage 2 — Multi-Cycle With a Markdown Plan

Stage 2 is a valid *starting* format — a job can be born Stage 2, decided in its own cycle-1 PLAN, without any prior stage-1 run of the same work. A common path that leads here is when the seed has run stage-1 versions of a repeating job type and accumulated enough experiential data to *write the plan in advance* — but that is one reason to choose Stage 2, not a requirement. Either way, the work is set up as a multi-cycle job with a persistent `.md` plan document.

The decision is concrete: in PLAN of cycle 1, the seed calls `plan.sh set-plan-file plan_<slug>.md` — the same set-once decision a Stage-1 job makes by calling `set-plan-file <id> false`, only here it names a `.md` document instead of declining one. The plan document lives at the job's run-aware directory. For a fresh job, cycle-1 EXECUTE authors the initial draft. During cycle 1 of each run, VERIFY may refine it; any edit blocks forward advance and routes the cycle back to PLAN to confirm the change. From cycle 2 onward the plan is frozen for that run — a plan problem routes through `## Outstanding Items` or an extension cycle, never an edit. The plan file is the job's long-horizon memory: it persists across runs, and each reactivation can refine it during that run's cycle-1 establishment window. Its identity is set once, and there is no separate approval state or sealing step. *[ref: plan-file-persists-no-sealing | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Most of what was *backward edges* inside the stage-1 cycle becomes *cycle transitions* in stage 2. Where the user previously pushed back mid-cycle and the seed iterated within OPEVC, now the seed completes a clean cycle, presents results in VERIFY, and the user approves or sends back. CONDENSE absorbs between cycles, the next cycle's OBSERVE recalls the prior cycle's lessons, and the work compounds. The deflation gate at cycle close is the same for every job — eighty percent of the footer words must be absorbed before the cycle can advance, whether the job runs once or across many cycles — because the cross-cycle handoff lives in the plan file, not in the footers. *[ref: deflation-single-80-uniform | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A stage-2 blog-writing job is one where the writing arc is well-understood. The plan document, authored in cycle 1, declares how many cycles the job runs and what each one advances (cycle 1 outline; cycle 2 first draft; cycle 3 ref tags; cycle 4 transcript + audio; cycle 5 cross-blog consistency). The job completes when it reaches its declared last cycle: that final cycle's VERIFY makes `[JOB-COMPLETE]` eligible through the cycle-count formula, and that cycle's CONDENSE asks it. There is no separate approval step — completion is the cycle-count formula, asked once at the end. *[ref: job-complete-cycle-formula | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

## Stage 3 — Multi-Cycle With a YAML Plan

Stage 3 is a multi-cycle job that, like any Stage, is a valid *starting* format — a job can be born Stage 3, decided in cycle-1 PLAN, rather than "graduating" there from a Stage-2 job once its plan settles. The completion semantics are *identical* to Stage 2 — same cycle-count formula, same `[JOB-COMPLETE]` gate, same persistent plan file that accumulates across runs. The single difference is the plan file's *format*: a `.yaml` document instead of a `.md` one, chosen when the operator wants richer, structured, per-phase context. It is not a state-flip on a Stage-2 job, and it is not a dependent of it — a Stage-3 job is its own repeatable job whose cycle-1 PLAN names a `.yaml` plan file, in practice authored once the matching `.md` pattern has been run enough times to be worth hardening into parseable structure. *[ref: stage-3-graduation-not-dependent | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Concretely: a Stage-3 job's cycle-1 PLAN calls `set-plan-file plan_<slug>.yaml`; cycle-1 EXECUTE creates the `.yaml`, whose `cycles:` list declares the per-cycle entries; cycle-1 VERIFY refines until it is good — each refinement routing back through PLAN to confirm, since an edited plan file cannot pass VERIFY forward. From cycle 2 onward the job does its real operational work, and the orchestrator reads the `.yaml` at every phase entry to inject job-specific context into the agent's voice stream. The plan file persists and the job is reactivatable, exactly like a Stage-2 `.md` job — only the format, and the per-phase injection it unlocks, set it apart. *[ref: stage-3-yaml-identical-except-format | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The `.yaml` is not a translation of the `.md` — it is an *injection target*. The orchestrator reads the `.yaml` at every phase entry of the Stage-3 job (and any future re-activation of it) and augments the agent's voices with job-specific context. *[ref: orchestrator-reads-yaml-at-phase-entry | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Today the prototype's `.yaml` plan carries any keyed value per phase: the keys ARE voice ids directly, and the orchestrator augments each value's matching rendered voice when the phase opens. The yaml field name doesn't transform — it pairs by literal id match.

Adding a new injection target requires only adding the matching voice id to the relevant plugin's `voice.xml` (or reusing an existing id) and writing the yaml entry. The voice-helper iterates the cached field map, finds matching ids, and **augments** each value into the rendered text in one of three modes — bare-string yaml entries append (the back-compat default); structured entries of the form `{mode: replace, text: "..."}` replace the rendered voice text entirely; `{mode: prepend, text: "..."}` entries stamp the yaml content above the standard guidance. Variable substitution flows from the underlying voice's args into the yaml text unchanged, so `{{job_id}}` and the rest substitute symmetrically across both surfaces. Plugin voices stay completely naive about yaml; no code changes per new field. *[ref: voice-helper-three-mode-augmentation | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The yaml key IS the voice id directly — no transform, no naming convention — which makes the **callable voice catalog** the contract surface for stage-3 customization. A yaml plan can only target voices that some hook or script actually fires; defining a voice without a callsite produces an orphan that never injects into context, and an invisible trap for yaml authors who target it and watch nothing happen. A catalog tool builds the contract surface by scanning every plugin's `voice.xml` for definitions and every non-test source file for quoted references; the yaml loader rejects keys outside the callable set at validate-yaml-format time with `did you mean` suggestions drawn from the closest matches. This catches the most common yaml authoring error — typing a voice id that no longer exists or never did — before the cycle runs. *[ref: callable-voice-catalog-as-contract-surface | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A planned job carries its scope-thinking in the plan itself. Phase entry is coached, never gated — there is no forecast ceremony for any job — and for a Stage-2 or Stage-3 job the coaching arrives pre-loaded: the plan file already declares the cycle's work, and the `.yaml` form injects per-phase context straight into the entry voice, so the agent enters each phase oriented by the document instead of re-deriving the scope from scratch. *[ref: planned-jobs-entry-orientation-from-plan | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

What this means in practice: a stage-3 blog-writing job's `.yaml` carries not just the per-phase objective but also per-phase reading lists (which knowledge files OBSERVE should pull first), per-phase tools-focus hints (which subagents PLAN should dispatch most), per-phase exit signals (what VERIFY should specifically check). Every field pairs with a voice id from `phase_observe/hooks/voice.xml` or the equivalent. The seed agent doing the job receives the job-specific context as part of its normal phase entry — same delivery mechanism as the universal voices, just more of them, all framed for this job's specific shape.

Stage 3 completes the same way Stage 2 does — through the cycle-count formula, not a separate approval step. The `.yaml` injects from the first cycle it exists, and it keeps injecting on every reactivation. What earns a job the extra structure is not a new gate but the leverage of that injection: the same job, run again, arrives at each phase already briefed on what this specific work needs. *[ref: stage-3-completes-like-stage-2 | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

## Stage 4 — Plugin Form of a Job

The final stage is the deepest customization layer. A Stage-3 `.yaml` job tailors only the *soft* controls — the voice injections a phase already carries. A plugin form of a job reaches the *hard* layer: it can extend or limit a phase's guards, or introduce entirely new phases. It is the shape reserved for jobs whose phase cognition needs customization *beyond* what voice injection can deliver. *[ref: stage-4-plugin-form | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Some jobs require specific tools allowed only during certain phases. Some require the OBSERVE phase to read a specific set of sources before any tool fires. Some require the EXECUTE phase to enforce a specific pattern on writes. Voice injection cannot deliver this; the discipline has to be *structural*. That is when the operator and the seed decide the work has earned its own plugin.

A plugin form of a job can extend the relevant phases with job-specific rules. In the historical implementation, the plugin lives beside the other plugins, with the minimal skeleton stamped first and then whichever hooks, scripts, tests, voices, agents, and knowledge files the job type actually earns. Its hooks attach to OPEVC events, recognize when the focused job matches this plugin's job type, and apply the added constraints. Outside that job type, those hooks pass through. *[ref: plugin-template-as-job-form-skeleton | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

This stage is the bridge between the seed agent's plugin kit ([Essay 7.1](../b7/07_1-plugin-kit-foundation.html)) and the operator's own work. New plugins do not have to come from upstream; they can be born from your own jobs reaching maturity. The operator's seed, by month three or six, may carry plugins that exist nowhere else — plugins shaped by exactly the kind of work this operator does, encoded into the seed's substrate. The limit here is the same as everywhere in the kit: enforcement runs only where the plugin's own hooks fire; a hook absent or mis-registered enforces nothing.

## How Jobs Spawn Alongside Each Other — Standalone and Dependent

Across the maturation arc, jobs do not run in isolation. The job system also tracks *relationships* between jobs through creation patterns; the current prototype exposes two — *standalone* and *dependent* — and the same lifecycle could add more. *[ref: two-creation-patterns | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A **standalone job** is one the focused job spawns to do parallel work that does not block. `job.sh create <name>` while a parent is focused creates a pending job with no link to the parent — an empty `depends_on` array. The standalone job waits its turn in the queue. Standalone creation is how the focused cycle says: *I noticed something else worth doing, but it does not belong inside this cycle.* *[ref: standalone-job-no-parent-link | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

A **dependent job** is one the focused job spawns that must finish before the focused job itself can complete. `job.sh create-dependent <name>` writes the new job's id into the focused job's `depends_on` array, and the focused job's job-complete approval will be refused until every entry in `depends_on` reaches `completed`. Dependent jobs let the operator declare ordering: *this fix must finish before this feature can ship.* The completion gate enforces the relationship structurally — the agent and the user can both want to approve the parent, but the gate refuses until the dependencies clear. *[ref: dependent-job-completion-gate | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

These patterns work across every step of the maturation arc. A stage-1 deep job can spawn standalone jobs. A stage-3 yaml job can spawn dependents. The discipline is consistent: jobs are created during CONDENSE (when the cycle's wider context surfaces follow-up work), not in IDLE or mid-execute. *[ref: jobs-created-during-condense-only | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard ladder — four ascending stages of job maturation, with a small horizontal strip below showing the two creation patterns (standalone / dependent) that apply across all stages.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk steps
  and labels; pastel chalk fills for each stage (cyan = stage 1, green = stage 2, orange = stage 3, magenta = stage 4 — drawn from the cycle image palette);
  white chalk for ALL labels, gate text, and lesson text; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, gate names, or descriptors.
  Layout: Four hand-drawn rectangular chalk steps ascending diagonally from lower-left to upper-right across the top two-thirds of the board, like a chalk staircase. Each step is wider than tall. From low to high:
    Step 1 (cyan fill, lowest-left). Three lines of label centered on the step IN WHITE CHALK:
      Top line:    "Stage 1: Deep single-cycle"
      Middle line: "plan_file = false"
      Bottom line: "seed in learning mode"
    Step 2 (green fill). Three lines of label:
      Top line:    "Stage 2: Multi-cycle .md plan"
      Middle line: "plan_file = .md, persists"
      Bottom line: "chosen in cycle 1 PLAN"
    Step 3 (orange fill). Three lines of label:
      Top line:    "Stage 3: Multi-cycle .yaml plan"
      Middle line: "same as Stage 2, .yaml format"
      Bottom line: "voice-paired injections per phase"
    Step 4 (magenta fill, highest-right). Three lines of label:
      Top line:    "Stage 4: Plugin form of job"
      Middle line: "phase-cognition customization"
      Bottom line: "ships its own plugin"
  Below the staircase, draw a horizontal chalk strip across the board's lower third with header IN WHITE CHALK exactly "Creation patterns (apply across all stages)". Inside the strip, two small chalk pills side by side, each labeled IN WHITE CHALK with TWO lines:
    Pill 1 (pink fill): top line "standalone" / bottom line "job.sh create <name>"
    Pill 2 (cyan darker fill): top line "dependent" / bottom line "job.sh create-dependent <name>"
  Above the staircase, draw a single curving chalk arrow running left-to-right along the climb with one short caption riding its curve IN WHITE CHALK exactly: "richer forms require evidence".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "Stage 1: Deep single-cycle", "plan_file = false", "seed in learning mode", "Stage 2: Multi-cycle .md plan", "plan_file = .md, persists", "chosen in cycle 1 PLAN", "Stage 3: Multi-cycle .yaml plan", "same as Stage 2, .yaml format", "voice-paired injections per phase", "Stage 4: Plugin form of job", "phase-cognition customization", "ships its own plugin", "Creation patterns (apply across all stages)", "standalone", "job.sh create <name>", "dependent", "job.sh create-dependent <name>", "richer forms require evidence". No other words, file names, folders, or stage descriptors may appear.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 8.2. Four stages of job maturation. Most jobs never reach stage 4. Some never leave stage 1."
  ASSET: images/four-stages-b8-2.png
-->

---

The maturation arc climbs on the upward axis, creation patterns sideways — and every move to a richer form is evidence-based, not automatic. The next essay opens a historical snapshot of one seed's brain after three months of accumulation, so the *outcome* of these forms is visible in concrete numbers.

---

*Essay 8.2 — From Apprentice to Architect, Part 2 of 9.*

*Previous: [Essay 8.1 — Apprentice to Architect Foundation](08_1-apprentice-to-architect-foundation.html) — the three growth axes and the series roadmap.*
*Next: [Essay 8.3 — What Lives in the Brain After Three Months](08_3-brain-after-three-months.html) — a historical three-month inventory.*
