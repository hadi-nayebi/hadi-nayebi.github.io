---
title: "The Stages of Job Maturation"
date: "May 2026"
slug: "job-maturation-stages"
read_time: "10 min"
tags: [Architecture, Seed Agent, Maturation, Jobs, Plan State]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# The Stages of Job Maturation

*Essay 8.2 — From Apprentice to Architect, Part 2 of 9.*

---

[Essay 8.1](08_1-apprentice-to-architect-foundation.html) framed the three growth axes: jobs mature upward, controls migrate inward, the operator shifts from supervising to composing. This sub-essay opens the first axis — the *job-maturation arc*. Every job your seed agent does passes through up to four maturation stages in the current prototype. Most jobs never reach the fourth. Some never leave the first. The progression is not automatic — each stage requires a specific kind of evidence before the seed promotes a job into the next shape.

A consulting practice's seed runs client-intake jobs that look nothing like a research lab's experiment-protocol jobs. Both pass through this maturation arc with the same gates; the *substance* the operator and seed accumulate at each stage is different. The arc is universal; the artifacts each stage produces are not.

---

## Stage 1 — Deep Single-Cycle OPEVC

This is where every new job begins. The user gives the seed a prompt; the seed treats the prompt as a single OPEVC cycle. The seed is in *learning mode*: it asks questions, takes its time, builds experiential data from the conversation. Backward edges and loops happen *inside* the cycle — not across cycles — because the cycle is the entire job's runway. *[ref: stage-1-job-default-schema | .claude/plugins/job_core/scripts/job.sh create + create-active subcommands | Active-job schema set when a new job is created carries fields `{id, name, objective:"", status:"pending", focused:false, user_interactions:[], completion_requirements:{user_approval:false, depends_on:[]}, plan_state:"none", created_at, updated_at}`. Top-level job creation sets `status:"active", focused:true, user_interactions:[$prompt]` — capturing the operator's prompt as the seed cycle-1 interaction. `plan_state:"none"` is the stage-1 signal; the field flips only when set-plan-file runs.]*

The seed agent does not rush through this stage. Its goal is to understand what the user wants the completed work to *look like*, what files are involved, what edits feel right, what failure modes the user wants to avoid. The seed asks clarifying questions through structured prefixed asks; it captures every Q+A into the focused job's `user_interactions` array; over many turns, the array becomes the agent's cumulative mega-prompt — the whole history of intent the seed re-reads as its instruction set.

Take a blog-writing job as a concrete example. Cycle 1 starts when the user prompts "let's write a new blog post." OBSERVE asks about the topic, the audience, the existing voice constants, the file inventory the post will produce (.md + .html + transcript + audio + images + ref tags). PLAN sketches an outline; the user redirects; the outline is rewritten. EXECUTE drafts paragraphs; backward edges fire when the user pushes back on a section. VERIFY runs the user's own approval cycle (which sections feel right, which need rework). CONDENSE absorbs the cycle's four footer-marker sections (the OBSERVE, PLAN, EXECUTE, VERIFY footers from [Essay 5.7](05_7-claude-md-hierarchy.html)) and consumes the cycle's inline markers (pending-job, voice-update, agent-update, knowledge — the inter-phase protocol from [Essay 7.2](07_2-skeleton-claudemd-hooks-scripts.html) and surrounding sub-essays) into the knowledge layer alongside the operator's preferences, which files mattered, and what discipline emerged.

Different users have different jobs. A chemist running a technoeconomic-analysis job at this stage will follow a very different conversation than the website manager at this stage running a blog-writing job. The seed adapts to each user's specific work because the early-stage OPEVC cycle is *collaborative* — the user shapes the work while the seed records the shaping. The result is that the operator's own seed becomes one that knows how *this* operator wants this kind of job done.

The cycle ends with a deep CONDENSE. The seed absorbs the cycle's interaction history, the file artifacts produced, the user's preferences, the patterns that worked, into the knowledge directory and into the relevant plugin's `evolution.md` files. The next job of the same shape will start from a much richer base. The limit here is friction, not enforcement: a seed can technically advance phases without learning anything, but the deflation gates and the historian's drift counter make doing so visibly costly.

## Stage 2 — Multi-Cycle With a Markdown Plan

After one or several stage-1 runs of the same kind of job, the seed has accumulated enough experiential data to *write the plan in advance*. The job graduates from a single deep cycle into a multi-cycle job with a persistent `.md` plan document.

The graduation is concrete: in PLAN of cycle 1, the seed calls `plan.sh set-plan-file plan_<slug>.md` instead of leaving the field `false`. From that moment, the plan document lives at `.claude/knowledge/plans/`, EXECUTE authors the initial draft in cycle 1, VERIFY edits it across every subsequent cycle, and the orchestrator's plan-state machine carries the job forward through `drafting → md_approved → yaml_drafting → yaml_ready → sealed`. *[ref: plan-state-machine-via-set-plan-file | .claude/plugins/phase_plan/scripts/plan.sh set-plan-file subcommand | The set-plan-file subcommand documents extension-based plan_state assignment: ".md → plan_state = drafting (md-job authoring the prose plan); .yaml → plan_state = yaml_drafting (dep yaml-job authoring the per-cycle yaml)." False branch sets `plan_file=false, plan_state=none`. The plan_state field lives on the job object in data.json and walks the documented graduation arc as `approve-md`, `approve-yaml`, `seal-plan` fire.]*

Most of what was *backward edges* inside the stage-1 cycle becomes *cycle transitions* in stage 2. Where the user previously pushed back mid-cycle and the seed iterated within OPEVC, now the seed completes a clean cycle, presents results in VERIFY, and the user approves or sends back. CONDENSE absorbs between cycles, the next cycle's OBSERVE recalls the prior cycle's lessons, and the work compounds. The deflation gate at cycle close is gentler in stage-2 jobs (the prototype currently sets it near half-absorption rather than the stage-1 ratio near four-fifths) because some of the planning context legitimately needs to survive into the next cycle. *[ref: deflation-gate-stage-aware-thresholds | .claude/plugins/phase_condense/scripts/condense-commit.sh stage-aware-policy block | Policy comment: "Stage-aware targets: Stage 1 (cycle-1 jobs, plan_file=false) must reach 80% because working memory is single-cycle. Stage 2 (multi-cycle jobs, plan_file=<filename>) use 50% because plan-handoff context legitimately stays in footers across cycles." Thresholds compute via awk against `CONDENSE_DEF_THRESHOLD_STAGE2` (default 50) and `CONDENSE_DEF_THRESHOLD_STAGE1` (default 80). The gate fires at commit-time (not edit-time), refusing to advance until the absorbed-words ratio crosses the threshold.]*

A stage-2 blog-writing job is one where the writing arc is well-understood. The plan document captures the outline-then-drafts-then-polish-then-ref-tags arc. Each cycle of the multi-cycle job advances one piece (cycle 1 outline; cycle 2 first draft; cycle 3 ref tags; cycle 4 transcript + audio; cycle 5 cross-blog consistency). When VERIFY judges the plan mature, it asks the user via a plan-approval prompt and the plan_state flips to `md_approved`. *[ref: plan-approval-flips-state | .claude/plugins/phase_plan/scripts/plan.sh approve-md subcommand | The approve-md subcommand guards that `plan_file` is not null/false ("Cannot approve-md: plan_file is $current_pf (no .md plan to approve)") and that `plan_state == drafting` ("Cannot approve-md: plan_state is $current_ps (expected drafting)"). Approval flips `plan_state: drafting → md_approved`. The command is HOOK_MODE-only — meaning it fires only via the question-capture handler after VERIFY's plan-approval prompt gets a "yes" answer; the agent cannot call it directly.]*

## Stage 3 — Multi-Cycle With a YAML Plan

When a `.md` plan has been refined to perfection across many runs of the same job, the seed graduates the plan into a `.yaml` form. The `.yaml` is not a translation of the `.md` — it is an *injection target*. The orchestrator reads the `.yaml` at every phase entry and injects job-specific context into the agent's working memory alongside the universal phase entry voices.

Today the prototype's `.yaml` plan carries any keyed value per phase: the keys ARE voice ids directly, and the orchestrator appends each value to its matching rendered voice when the phase opens. The yaml field name doesn't transform — it pairs by literal id match. Adding a new injection target requires only adding the matching voice id to the relevant plugin's `hooks/voice.xml` (or reusing an existing id) and writing the yaml entry. The voice-helper iterates the cached field map, finds matching ids, and APPENDS each value to the rendered text with a blank-line separator. Plugin voices stay completely naive about yaml; no code changes per new field. *[ref: yaml-cognition-v2-path-c-injection | .claude/knowledge/phasic_system/yaml-cognition-v2-architecture.md Path C section + .claude/plugins/phasic_system/hooks/phase-init.sh write_yaml_cache function | The v2 Path C architecture (landed 2026-05-13) replaces the v1 single-objective injection. Yaml plans now name voice ids directly; phase-init.sh writes the JSON field-map to `$ROOT_DIR/.claude/.tmp/yaml-injection-cache.json` at phase entry; `lib/voice-helper/voice-helper.sh` v2.0.0 reads the cache during every `get_voice(id)` call and appends matching values with a blank-line separator. Knowledge file: "voice-helper.sh auto-couples yaml augmentation at render time. Plugins stay naive." And: "If a pairing exists, APPEND its value to the rendered text with a blank-line separator."]*

What this means in practice: a stage-3 blog-writing job's `.yaml` carries not just the per-phase objective but also per-phase reading lists (which knowledge files OBSERVE should pull first), per-phase tools-focus hints (which subagents PLAN should dispatch most), per-phase exit signals (what VERIFY should specifically check). Every field pairs with a voice id from `phase_observe/hooks/voice.xml` or the equivalent. The seed agent doing the job receives the job-specific context as part of its normal phase entry — same delivery mechanism as the universal voices, just more of them, all framed for this job's specific shape.

The graduation gate is the second user approval: VERIFY asks via a yaml-approval prompt after the `.yaml` is mature, the user approves, and the plan_state flips to `yaml_ready`. From that point on, every cycle of the job inherits the job-specific injection stream. *[ref: yaml-approval-flips-state | .claude/plugins/phase_plan/scripts/plan.sh approve-yaml subcommand | The approve-yaml subcommand is reserved for system automation (HOOK_MODE-only, fires from question-capture). The approval flips `plan_state: yaml_drafting → yaml_ready`. The same VERIFY-only gate-of-firing applies — yaml-approval prefixed questions only resolve through approve-yaml when current phase is VERIFY.]*

## Stage 4 — Plugin Form of a Job

The final stage is rare. It is reserved for jobs whose phase cognition needs customization *beyond* what context injection can deliver.

Some jobs require specific tools allowed only during certain phases. Some require the OBSERVE phase to read a specific set of sources before any tool fires. Some require the EXECUTE phase to enforce a specific pattern on writes. Voice injection cannot deliver this; the discipline has to be *structural*. The job graduates into a plugin.

A plugin form of a job extends each phase's guard with job-specific rules. The plugin lives at `.claude/plugins/<job_name>/` like any other plugin — with hooks, scripts, tests, voices, agents, knowledge dir — but its hooks attach to the standard OPEVC events with logic that recognizes when the focused job matches this plugin's job-type and applies extra constraints. Outside that job-type, the plugin's hooks are pass-through.

This stage is the bridge between the seed agent's plugin kit ([Essay 7.1](07_1-plugin-kit-foundation.html)) and the operator's own work. New plugins do not have to come from upstream; they can be born from your own jobs reaching maturity. The operator's seed, by month three or six, may carry plugins that exist nowhere else — plugins shaped by exactly the kind of work this operator does, encoded into the seed's substrate. The limit here is the same as everywhere in the kit: enforcement runs only where the plugin's own hooks fire; a hook absent or mis-registered enforces nothing.

## How Jobs Spawn Alongside Each Other — Sibling and Dependent

Across the maturation arc, jobs do not run in isolation. The job system also tracks *relationships* between jobs through two creation patterns.

A **sibling job** is one the focused job spawns to do parallel work that does not block. `job.sh create <name>` while a parent is focused creates a pending job with no link to the parent. The sibling waits its turn in the queue. Sibling creation is how the focused cycle says: *I noticed something else worth doing, but it does not belong inside this cycle.* *[ref: sibling-job-no-parent-link | .claude/plugins/job_core/scripts/job.sh create subcommand | The `create` subcommand schema inserts a fresh job with `completion_requirements: {user_approval:false, depends_on:[]}`. Sibling = empty `depends_on` array, no write to parent's depends_on, no link in either direction. The sibling simply enters the pending queue.]*

A **dependent job** is a sibling with a `depends_on` link to the parent. `job.sh create-dependent <name>` writes the new job's id into the focused job's `depends_on` array, and the focused job's job-complete approval will be refused until every entry in `depends_on` reaches `completed`. Dependent jobs let the operator declare ordering: *this fix must finish before this feature can ship.* The completion gate enforces the relationship structurally — the agent and the user can both want to approve the parent, but the gate refuses until the dependencies clear. *[ref: dependent-job-completion-gate | .claude/plugins/job_core/scripts/job.sh create-dependent + completion-gate blocks | `create-dependent` requires a focused active parent, then writes the new job's id into the parent's depends_on array via atomic jq update. The completion gate iterates each entry in depends_on, looks up the dep's status; if any is not `completed`, appends a failure naming the dep id, name, and current status. The job-complete reminder reinforces the discipline: "Command 'approve' is reserved for system automation. Use the job-complete prefix in your response to approve a job completion." The agent cannot bypass the gate.]*

These patterns work across every step of the maturation arc. A stage-1 deep job can spawn siblings. A stage-3 yaml job can spawn dependents. The discipline is consistent: jobs are created during CONDENSE (when the cycle's wider context surfaces follow-up work), not in IDLE or mid-execute. *[ref: jobs-created-during-condense-only | .claude/plugins/phasic_system/hooks/phase-gate.sh CONDENSE allowlist + .claude/plugins/phase_condense/hooks/condense-guard.sh | Phase-gate allowlists place `job.sh create` + `job.sh create-dependent` ONLY in the CONDENSE allowlist. IDLE dropped them in the 2026-05-12 commit (D4 lesson — single-cycle parents create deadlock if they spawn `create-dependent` siblings). EXECUTE rejects job creation. The phase-gate hook lives in `phasic_system/hooks/`, not in per-phase plugins — phasic_system is the orchestrator that owns the global tool-allowlist gate. The discipline lives in code, not just policy.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard ladder — four ascending stages of job maturation, with a small horizontal strip below showing the two creation patterns (sibling / dependent) that apply across all stages.
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
      Middle line: "plan_state = drafting"
      Bottom line: "chunked from stage 1"
    Step 3 (orange fill). Three lines of label:
      Top line:    "Stage 3: Multi-cycle .yaml plan"
      Middle line: "plan_state = yaml_drafting"
      Bottom line: "voice-paired injections per phase"
    Step 4 (magenta fill, highest-right). Three lines of label:
      Top line:    "Stage 4: Plugin form of job"
      Middle line: "phase-cognition customization"
      Bottom line: "extends phase guards"
  Below the staircase, draw a horizontal chalk strip across the board's lower third with header IN WHITE CHALK exactly "Creation patterns (apply across all stages)". Inside the strip, two small chalk pills side by side, each labeled IN WHITE CHALK with TWO lines:
    Pill 1 (pink fill): top line "sibling" / bottom line "job.sh create <name>"
    Pill 2 (cyan darker fill): top line "dependent" / bottom line "job.sh create-dependent <name>"
  Above the staircase, draw a single curving chalk arrow running left-to-right along the climb with one short caption riding its curve IN WHITE CHALK exactly: "graduation requires evidence, never automatic".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "Stage 1: Deep single-cycle", "plan_file = false", "seed in learning mode", "Stage 2: Multi-cycle .md plan", "plan_state = drafting", "chunked from stage 1", "Stage 3: Multi-cycle .yaml plan", "plan_state = yaml_drafting", "voice-paired injections per phase", "Stage 4: Plugin form of job", "phase-cognition customization", "extends phase guards", "Creation patterns (apply across all stages)", "sibling", "job.sh create <name>", "dependent", "job.sh create-dependent <name>", "graduation requires evidence, never automatic", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.1. Four stages of job maturation. Most jobs never reach stage 4. Some never leave stage 1."
-->

---

The maturation arc climbs on the upward axis, two creation patterns on the sideways one — and every gate between them is evidence-based, not automatic. The next sub-essay opens a snapshot of the prototype's brain after three months of accumulation, so the *outcome* of these stages is visible in concrete numbers.

---

*Essay 8.2 — From Apprentice to Architect, Part 2 of 9.*

*Previous: [Essay 8.1 — Apprentice to Architect Foundation](08_1-apprentice-to-architect-foundation.html) — the three growth axes and the mini-series roadmap.*
*Next: [Essay 8.3 — What Lives in the Brain After Three Months](08_3-brain-after-three-months.html) — the prototype as ground-truth inventory.*
