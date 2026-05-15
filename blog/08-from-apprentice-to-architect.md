---
title: "From Apprentice to Architect"
date: "May 2026"
slug: "from-apprentice-to-architect"
read_time: "27 min"
tags: [Architecture, Seed Agent, Maturation, Jobs, Knowledge]
status: draft
version: v0.12.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/from-apprentice-to-architect.png"
---

# From Apprentice to Architect

*Essay 8 of 8 in the Hadosh Academy series on agent architecture.*

---

The previous three essays gave you the parts.

[Essay 5](05-the-always-on-digital-cortex.html) named the always-on layer and the CLAUDE.md bus it runs alongside. [Essay 6](06-the-markov-phasic-brain.html) named the phases that fill those compartments. [Essay 7](07-the-plugin-kit.html) named the cell template that lets new plugins be born.

This essay is about what happens when those parts are in *your* hands.

The seed agent is not a product. It is not a thing that gets installed and works. It is a thing that gets installed, and then *grows*, cycle by cycle, under the operator's care. A new seed in week one looks different from the same seed in month three. The architecture is identical. What has changed is the brain — what it has learned, what it has codified, what has fossilized into permanent enforcement, and what is still being shaped by hand.

This essay traces that arc through one specific lens: how the *jobs* you give your seed mature over time, and how the seed itself matures alongside them. You start as the seed's apprentice. Over many cycles, the seed becomes yours. By the time you are done, you are not its operator anymore. You are its architect.

---

## The Four Stages of Job Maturation

Every job your seed agent does passes through up to four stages of maturation. Most jobs never reach the fourth. Some never leave the first. The progression is not automatic — each stage requires a specific kind of evidence before the seed promotes a job into the next shape.

### Stage 1 — Deep Single-Cycle OPEVC

This is where every new job begins. The user gives the seed a prompt; the seed treats the prompt as a single OPEVC cycle. The seed is in *learning mode*: it asks questions, takes its time, builds experiential data from the conversation. Backward edges and loops happen *inside* the cycle — not across cycles — because the cycle is the entire job's runway. *[ref: stage-1-job-default-schema | .claude/plugins/job_core/scripts/job.sh:177,232 | Active-job schema set when a new job is created: `'.jobs += [{id:$id, name:$name, objective:"", status:"pending", focused:false, user_interactions:[], completion_requirements:{user_approval:false, depends_on:[]}, plan_state:"none", created_at:$now, updated_at:$now}]'`. Top-level job creation (L232) sets `status:"active", focused:true, user_interactions:[$prompt]` — capturing the operator's prompt as the seed cycle-1 interaction. `plan_state:"none"` is the stage-1 signal; the field flips only when set-plan-file runs.]*

The seed agent does not rush through this stage. Its goal is to understand what the user wants the completed work to *look like*, what files are involved, what edits feel right, what failure modes the user wants to avoid. The seed asks clarifying questions through structured prefixed asks; it captures every Q+A into the focused job's `user_interactions` array; over many turns, the array becomes the agent's cumulative mega-prompt — the whole history of intent the seed re-reads as its instruction set.

Take a blog-writing job as a concrete example. Cycle 1 starts when the user prompts "let's write a new blog post." OBSERVE asks about the topic, the audience, the existing voice constants, the file inventory the post will produce (.md + .html + transcript + audio + images + ref tags). PLAN sketches an outline; the user redirects; the outline is rewritten. EXECUTE drafts paragraphs; backward edges fire when the user pushes back on a section. VERIFY runs the user's own approval cycle (which sections feel right, which need rework). CONDENSE absorbs the cycle's four footer-marker sections (`---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` from [Essay 5](05-the-always-on-digital-cortex.html)) and consumes the cycle's inline markers (`[PENDING-JOB]`, `[VOICE-UPDATE]`, `[AGENT-UPDATE]`, `[KNOWLEDGE]` — the inter-phase protocol from [Essay 7](07-the-plugin-kit.html)) into the knowledge layer alongside the operator's preferences, which files mattered, and what discipline emerged.

Different users have different jobs. A chemist running a technoeconomic-analysis job at this stage will follow a very different conversation than the website manager at this stage running a blog-writing job. The seed adapts to each user's specific work because the stage-1 OPEVC cycle is *collaborative* — the user shapes the work while the seed records the shaping. The result is that the operator's own seed becomes one that knows how *this* operator wants this kind of job done.

The cycle ends with a deep CONDENSE. The seed absorbs the cycle's interaction history, the file artifacts produced, the user's preferences, the patterns that worked, into the knowledge directory and into the relevant plugin's `evolution.md` files. The next job of the same shape will start from a much richer base.

### Stage 2 — Multi-Cycle With a Markdown Plan

After one or several stage-1 runs of the same kind of job, the seed has accumulated enough experiential data to *write the plan in advance*. The job graduates from a single deep cycle into a multi-cycle job with a persistent `.md` plan document.

The graduation is concrete: in PLAN of cycle 1, the seed calls `plan.sh set-plan-file plan_<slug>.md` instead of leaving the field `false`. From that moment, the plan document lives at `.claude/knowledge/plans/`, EXECUTE authors the initial draft in cycle 1, VERIFY edits it across every subsequent cycle, and the orchestrator's plan-state machine carries the job forward through `drafting → md_approved → yaml_drafting → yaml_ready → sealed`. *[ref: plan-state-machine-via-set-plan-file | .claude/plugins/phase_plan/scripts/plan.sh:334-376 | L334 names the subcommand: `# #### set-plan-file`. L353 the false-branch: `(.plan_file = false | .plan_state = "none")`. L358-360 documents the extension-based plan_state assignment: ".md → plan_state = drafting (md-job authoring the prose plan); .yaml → plan_state = yaml_drafting (dep yaml-job authoring the per-cycle yaml)." L373: `new_state="yaml_drafting"`. The plan_state field lives on the job object in data.json and walks the documented graduation arc as `approve-md`, `approve-yaml`, `seal-plan` fire.]*

Most of what was *backward edges* inside the stage-1 cycle becomes *cycle transitions* in stage 2. Where the user previously pushed back mid-cycle and the seed iterated within OPEVC, now the seed completes a clean cycle, presents results in VERIFY, and the user approves or sends back. CONDENSE absorbs between cycles, the next cycle's OBSERVE recalls the prior cycle's lessons, and the work compounds. The deflation gate at cycle close is gentler in stage-2 jobs (~50% absorption rather than ~80%) because some of the planning context legitimately needs to survive into the next cycle. *[ref: deflation-gate-stage-aware-thresholds | .claude/plugins/phase_condense/scripts/condense-commit.sh:115-127 | L115-116 documents the policy: "WHY Stage-aware targets: Stage 1 (cycle-1 jobs, plan_file=false) must reach 80% because working memory is single-cycle. Stage 2 (multi-cycle jobs, plan_file=<filename>) use 50% because plan-handoff context legitimately stays in footers across cycles." L122 + L125 compute the absorption thresholds via awk against `CONDENSE_DEF_THRESHOLD_STAGE2` (default 50) and `CONDENSE_DEF_THRESHOLD_STAGE1` (default 80). The gate fires at commit-time (not edit-time), refusing to advance until the absorbed-words ratio crosses the threshold.]*

A stage-2 blog-writing job is one where the writing arc is well-understood. The plan document captures the outline-then-drafts-then-polish-then-ref-tags arc. Each cycle of the multi-cycle job advances one piece (cycle 1 outline; cycle 2 first draft; cycle 3 ref tags; cycle 4 transcript + audio; cycle 5 cross-blog consistency). When VERIFY judges the plan mature, it asks the user `[PLAN-APPROVAL]` and the plan_state flips to `md_approved`. *[ref: plan-approval-flips-state | .claude/plugins/phase_plan/scripts/plan.sh:846-857 | L846-847: `# #### approve-md`. L855 guard: `[[ "$current_pf" == "null" || "$current_pf" == "false" ]] && die "Cannot approve-md: plan_file is $current_pf (no .md plan to approve)."` L857: `[[ "$current_ps" != "drafting" ]] && die "Cannot approve-md: plan_state is $current_ps (expected drafting)."` Approval flips `plan_state: drafting → md_approved`. The approve-md command is HOOK_MODE-only — meaning it fires only via the question-capture handler after VERIFY's [PLAN-APPROVAL] gets a "yes" answer; the agent cannot call it directly.]*

### Stage 3 — Multi-Cycle With a YAML Plan

When a `.md` plan has been refined to perfection across many runs of the same job, the seed graduates the plan into a `.yaml` form. The `.yaml` is not a translation of the `.md` — it is an *injection target*. The orchestrator reads the `.yaml` at every phase entry and injects job-specific context into the agent's working memory alongside the universal phase entry voices.

Today the prototype's `.yaml` plan carries any keyed value per phase: the keys ARE voice ids directly, and the orchestrator appends each value to its matching rendered voice when the phase opens. The yaml field name doesn't transform — it pairs by literal id match. Adding a new injection target requires only adding the matching voice id to the relevant plugin's `hooks/voice.xml` (or reusing an existing id) and writing the yaml entry. The voice-helper iterates the cached field map, finds matching ids, and APPENDS each value to the rendered text with a blank-line separator. Plugin voices stay completely naive about yaml; no code changes per new field. *[ref: yaml-cognition-v2-path-c-injection | .claude/knowledge/phasic_system/yaml-cognition-v2-architecture.md:29,51 + .claude/plugins/phasic_system/hooks/phase-init.sh (write_yaml_cache) | The v2 Path C architecture (landed 2026-05-13) replaces the v1 single-objective injection. Yaml plans now name voice ids directly; phase-init.sh writes the JSON field-map to `$ROOT_DIR/.claude/.tmp/yaml-injection-cache.json` at phase entry; `lib/voice-helper/voice-helper.sh` v2.0.0 reads the cache during every `get_voice(id)` call and appends matching values with a blank-line separator. Knowledge file L29: "voice-helper.sh auto-couples yaml augmentation at render time. Plugins stay naive." L51: "If a pairing exists, APPEND its value to the rendered text with a blank-line separator."]*

What this means in practice: a stage-3 blog-writing job's `.yaml` carries not just the per-phase objective but also per-phase reading lists (which knowledge files OBSERVE should pull first), per-phase tools-focus hints (which subagents PLAN should dispatch most), per-phase exit signals (what VERIFY should specifically check). Every field pairs with a voice id from `phase_observe/hooks/voice.xml` or the equivalent. The seed agent doing the job receives the job-specific context as part of its normal phase entry — same delivery mechanism as the universal voices, just more of them, all framed for this job's specific shape.

The graduation gate is the second user approval: VERIFY asks `[YAML-APPROVAL]` after the `.yaml` is mature, the user approves, and the plan_state flips to `yaml_ready`. From that point on, every cycle of the job inherits the job-specific injection stream. *[ref: yaml-approval-flips-state | .claude/plugins/phase_plan/scripts/plan.sh:865-870 | L865-867: `# #### approve-yaml` subcommand. L868: "Command 'approve-yaml' is reserved for system automation" (HOOK_MODE-only, fires from question-capture). The approval flips `plan_state: yaml_drafting → yaml_ready`. The same VERIFY-only gate-of-firing applies — [YAML-APPROVAL] prefixed questions only resolve through approve-yaml when current phase is VERIFY.]*

### Stage 4 — Plugin Form of a Job

The final stage is rare. It is reserved for jobs whose phase cognition needs customization *beyond* what context injection can deliver.

Some jobs require specific tools allowed only during certain phases. Some require the OBSERVE phase to read a specific set of sources before any tool fires. Some require the EXECUTE phase to enforce a specific pattern on writes. Voice injection cannot deliver this; the discipline has to be *structural*. The job graduates into a plugin.

A plugin form of a job extends each phase's guard with job-specific rules. The plugin lives at `.claude/plugins/<job_name>/` like any other plugin — with hooks, scripts, tests, voices, agents, knowledge dir — but its hooks attach to the standard OPEVC events with logic that recognizes when the focused job matches this plugin's job-type and applies extra constraints. Outside that job-type, the plugin's hooks are pass-through.

This stage is the bridge between *the seed agent's plugin kit* (Essay 7) and *the operator's own work*. New plugins do not have to come from upstream; they can be born from your own jobs reaching maturity. The operator's seed, by month three or six, may carry plugins that exist nowhere else — plugins shaped by exactly the kind of work this operator does, encoded into the seed's substrate.

### How Jobs Spawn Alongside Each Other — Sibling and Dependent

Across all four stages, jobs do not run in isolation. The job system also tracks *relationships* between jobs through two creation patterns.

A **sibling job** is one the focused job spawns to do parallel work that does not block. `job.sh create <name>` while a parent is focused creates a pending job with no link to the parent. The sibling waits its turn in the queue. Sibling creation is how the focused cycle says: *I noticed something else worth doing, but it does not belong inside this cycle.* *[ref: sibling-job-no-parent-link | .claude/plugins/job_core/scripts/job.sh:177 | The `create` subcommand schema inserts: `'.jobs += [{id:$id, name:$name, objective:"", status:"pending", focused:false, user_interactions:[], completion_requirements:{user_approval:false, depends_on:[]}, plan_state:"none", created_at:$now, updated_at:$now}]'`. Sibling = empty `depends_on` array, no write to parent's depends_on, no link in either direction. The sibling simply enters the pending queue.]*

A **dependent job** is a sibling with a `depends_on` link to the parent. `job.sh create-dependent <name>` writes the new job's id into the focused job's `depends_on` array, and the focused job's `[JOB-COMPLETE]` approval will be refused until every entry in `depends_on` reaches `completed`. Dependent jobs let the operator declare ordering: *this fix must finish before this feature can ship.* The completion gate enforces the relationship structurally — the agent and the user can both want to approve the parent, but the gate refuses until the dependencies clear. *[ref: dependent-job-completion-gate | .claude/plugins/job_core/scripts/job.sh:195-208,346-355,478 | L195-208: `create-dependent` requires a focused active parent, then writes `'(.jobs[] | select(.id==$fid)).completion_requirements.depends_on += [$did]'` (atomic jq update to parent's depends_on array). L349-355 the completion gate: for each entry in depends_on, look up the dep's status; if any is not `completed`, append a failure: `failures="$failures\n  - depends_on: $dep_id ($dep_name) is $dep_status (must be completed)"`. L478 reinforces the [JOB-COMPLETE] discipline: "Command 'approve' is reserved for system automation. Use '[JOB-COMPLETE]' in your response to approve a job completion." The agent cannot bypass the gate.]*

These patterns work across all four maturation stages. A stage-1 deep job can spawn siblings. A stage-3 yaml job can spawn dependents. The discipline is consistent: jobs are created during CONDENSE (when the cycle's wider context surfaces follow-up work), not in IDLE or mid-execute. *[ref: jobs-created-during-condense-only | .claude/plugins/phasic_system/hooks/phase-gate.sh + .claude/plugins/phase_condense/hooks/condense-guard.sh | Phase-gate allowlists (per Blog 6 manifest verified 2026-05-12) place `job.sh create` + `job.sh create-dependent` ONLY in the CONDENSE allowlist. IDLE dropped them in commit 2026-05-12 (D4 lesson — single-cycle parents create deadlock if they spawn `create-dependent` siblings). EXECUTE rejects job creation. The phase-gate hook lives in `phasic_system/hooks/`, not in per-phase plugins — phasic_system is the orchestrator that owns the global tool-allowlist gate. The discipline lives in code, not just policy.]*

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

## What Actually Lives in the Brain After Three Months

The prototype today is a useful ground-truth case. A precise inventory of what its brain holds reveals the shape every mature seed converges toward.

**The active knowledge layer holds roughly two hundred and fifty thousand words across eighteen topic silos** (plus an archive at ~170k words that the seed treats as historical reference rather than live recall). This is by far the largest component of the seed's persistent memory. The directories are organized by topic, not by chronology — each topic accumulates findings over many cycles and stays legible because the topic name doesn't change as the seed learns. The mature topic silos carry version numbers like `v0.10.0` or `v2.0.0`, use a strict three-layer audience model (newcomer / practitioner / maintainer), and end every topic file with concrete *Decay & Refresh* triggers expressed as executable shell commands. *[ref: knowledge-layer-250k-eighteen-silos | .claude/knowledge/ + .claude/knowledge/CLAUDE.md | `find .claude/knowledge -name "*.md" -not -path "*/.archived/*" -print0 \| xargs -0 wc -w` returns 250,308 total words across 220 active files. `find .claude/knowledge -maxdepth 1 -type d` returns 18 active topic silos: one per plugin (11 — plugin_integrity, brain_guard, job_core, interaction_summary, question_discipline, phasic_system, phase_observe, phase_plan, phase_execute, phase_verify, phase_condense) + 7 cross-cutting topics (opevc, migration, plans, self-reviews, session, git-hygiene, upstream-reporting). `.archived/` adds 168k words / 182 files — historical reference, not part of active recall. Captured 2026-05-13 (drift-corrected from initial 475k-incl-archived claim).]*

**The largest single subdirectory in the prototype's knowledge layer is the session archive, at roughly sixty-five thousand words.** This is, in `phase_condense`'s design, the *fallback tier* — the destination of last resort for content that did not route to any earlier waterfall step. A session archive growing this large is an honest signal that earlier routing under-fired; mature seeds will compress this number as their condense subagents learn to route more aggressively into topic-organized files instead. *[ref: session-archive-fallback-tier-size | .claude/knowledge/session/ + .claude/plugins/phase_condense/docs/principles.md ("session as last resort") | `find .claude/knowledge/session -name "*.md" \| xargs wc -w` returns 65,252 total — the single largest subdirectory of the knowledge layer. phase_condense design principle places `session/` at step 7 (last-resort fallback), NOT as a peer of topic dirs. Size signals under-firing of earlier steps (step 1 absorb-footer, step 2 cross-file migration, step 6 knowledge routing).]*

**The memory layer holds about twenty entries** in your home directory. Most are feedback rules — operator-given operating directives the brain should carry across sessions. A few are project memories. One is the index. The memory layer is not organized by plugin; it is organized by the *kind* of guidance it captures. The brain keeps memory narrow because feedback rules are *meta-instructions*, not data; if there were a hundred of them, the operator would lose track. *[ref: memory-twenty-entries-feedback-heavy | ~/.claude/projects/<encoded>/memory/ | `ls ~/.claude/projects/-home-hadinayebi-CodingProjects-hadosh-academy-hadi-nayebi-github-io/memory/ \| wc -l` returns 20 entries: 15 feedback_*.md files (operator-given operating rules), 3 project_*.md files (active job + cross-blog series context), 1 MEMORY.md index, 1 jobs.md tracker. Captured 2026-05-13 during B8 ref-tag pass. The narrow-by-design contrasts with the wide knowledge layer.]*

**Each plugin's `docs/evolution.md` is capped at two thousand words.** Older sections migrate into sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) as the narrative grows. The cap is the only hard-enforced size limit in the prototype today — every other limit is soft, enforced by CONDENSE discipline rather than a code gate. *[ref: evolution-md-only-hard-cap | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh:37,58-59,110 | L37 sets the cap: `MAX_EVOLUTION_WORDS="${MAX_EVOLUTION_WORDS:-2000}"`. L58-59 restricts scope to ONE file: "Only police evolution.md — other docs/*.md files are uncapped per user directive" + `[[ "$FILE_PATH" != */docs/evolution.md ]] && exit 0`. L110 BLOCK message names the overflow targets: "consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md)." This is the only file with a PreToolUse word-count gate in the entire plugin tree; every other documented cap (root brain 3,500 / subdir CLAUDE.md 800 / plans 2,000 / memory 400 / skills 500) is enforced by CONDENSE discipline, not code.]*

The shape is consistent: a small brain, a large knowledge layer, a narrow memory. The compression is structural — caps plus the CONDENSE waterfall plus soft thresholds — and the result is a seed whose persistent memory grows where it should grow (knowledge) and stays narrow where narrowness matters (memory, root brain). [Essay 1](01-llms-are-not-the-agents.html) said the filesystem is the agent. The numbers say what *filesystem* means in practice after a few months of accumulation: a knowledge directory thick with operational understanding, a brain just big enough to read in one sitting, and a memory file that captures the operator's hard-won rules in one short list.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard layered stack — transient layers on top, durable layers on the bottom, the seed's working memory pyramid inverted.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk bands
  stacked vertically; pastel chalk fills (dim cyan = most transient, magenta = most durable, with a graded scale between);
  white chalk for ALL band labels, lifespan notes, and arrows; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other layer names, directory names, or lifespan descriptors.
  Layout: Six horizontal chalk bands stacked vertically across the board, top to bottom. The topmost band is the narrowest and dimmest; bands get wider and brighter as they go down. Each band is split into a left half (the layer's name IN WHITE CHALK) and a right half (its lifespan IN WHITE CHALK).
    Band 1 (top, dim cyan, narrowest):
      Left:  "chat session"
      Right: "dies at compaction"
    Band 2 (dim green):
      Left:  "working CLAUDE.md"
      Right: "deflates each cycle"
    Band 3 (orange):
      Left:  "plan files"
      Right: "archived when sealed"
    Band 4 (pink):
      Left:  "plugin evolution.md"
      Right: "capped 2000w, narrated"
    Band 5 (magenta):
      Left:  ".claude/knowledge/"
      Right: "topic silos, grows monotonically"
    Band 6 (bottom, magenta darker, widest):
      Left:  "memory/"
      Right: "cross-project, your home dir"
  On the left edge of the stack, draw a single vertical white-chalk arrow running BOTTOM-UP along the entire stack, with one short caption riding the arrow IN WHITE CHALK exactly: "durability".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "chat session", "dies at compaction", "working CLAUDE.md", "deflates each cycle", "plan files", "archived when sealed", "plugin evolution.md", "capped 2000w, narrated", ".claude/knowledge/", "topic silos, grows monotonically", "memory/", "cross-project, your home dir", "durability", plus the caption below. No other words, file names, folders, or lifespan descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.2. Transient layers above. Durable substrate below. The seed's long-term store is the bottom of the stack."
-->

---

## Soft → Hard Migration — The Patterns That Travel

The graduation from stage 1 to stage 2 to stage 3 is *only one* of the patterns by which the seed agent grows. The other — equally important — is the migration of behavioral controls from soft form to hard form within the plugins themselves.

The cleanest concrete migration in the prototype's history is the *multiplier sentinel*.

In the early cycles, every phase entry shipped a single coaching voice (`entry-set-multiplier`) asking the agent to please set the phase's multiplier before starting work. The voice fired probabilistically into the LLM's context. The agent read it and, under cognitive load, often ignored it. Several cycles in, the data was clear: the ratio of voice-fires to actual-multiplier-sets had stopped converging. The voice was not holding.

The hardening landed in the 2026-05-04 multiplier-fix gmode work. Every phase's entry now initializes the multiplier to literal zero — a sentinel value. A `PreToolUse` guard reads the multiplier on every tool call; if it is zero, every tool is blocked. The agent's only available move is to call `<phase>.sh set-multiplier <job> <value>` with a value in the range from `0.5` to `3`. The coaching voice retired. In its place, two new voices took the load: `entry-set-multiplier-pre-set` informs the agent before the lock; `multiplier-zero-block` refuses tool calls when the gate fires. What was once probabilistic judgment is now mechanism. *[ref: multiplier-sentinel-pretooluse-zero-block | .claude/plugins/phase_observe/hooks/observe-guard.sh:185 + .claude/plugins/phase_observe/hooks/observe-tracker.sh:104-110 + .claude/plugins/phase_observe/scripts/observe.sh:347,354-357 | observe-guard.sh L185: "Sentinel-Lock Gate (v0.12 — multiplier-fix gmode 2026-05-04)" — the PreToolUse block. observe-tracker.sh L104-110: "Sentinel-Lock defense-in-depth (v0.12 — multiplier-fix gmode 2026-05-04). observe-guard.sh blocks tools at multiplier=0, but if any tool slips through [...] exiting here keeps state simple and surfaces the sentinel as a structural lock." observe.sh L347 enforces the range: `Usage: observe.sh set-multiplier [id] <0.5|1|1.5|2|2.5|3>`. L356-357 validates: any other value dies with "Invalid multiplier: $local_val. Must be: 0.5, 1, 1.5, 2, 2.5, or 3." The sentinel pattern replicates across all 5 phase plugins.]*

The pattern beyond this case is the cost ladder named in [Essay 7](07-the-plugin-kit.html). New behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. The prototype's universal discipline `Lock 13: the over-engineering veto` codifies the restraint: no new hard gate hardens before measured cycles demonstrate the soft form is failing.

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The multiplier sentinel didn't just become a hook in `phasic_system`; it became part of the template every new phase plugin inherits. Brain_guard's cycle-1 universal disciplines (`verify-100-percent-before-bonus`, `subagent-spot-check`, `condense-not-deletion`, `no-dep-jobs-in-single-cycle`) made the same trip — from one cycle's lesson to a rule every cycle now obeys, codified into `.claude/knowledge/opevc/` and inherited by every new job. *[ref: brain-guard-c1-four-disciplines-codified | ../CLAUDE.md:464-467 + .claude/knowledge/opevc/subagent-report-spot-check-required.md + ~/.claude/projects/<encoded>/memory/feedback_verify_100_percent_before_bonus.md + ~/memory/feedback_no_dep_jobs_in_single_cycle.md | Root CLAUDE.md "## Brain Growth — Brain_guard Cycle 1" section (L464-467) names the four disciplines explicitly: "D1 verify-100%-before-bonus", "D2 subagent-spot-check", "D3 condense-not-deletion", "D4 job.sh create-only in multi-cycle". Each has a knowledge file or memory entry. The pattern: a single cycle's hard-learned lesson promoted to a permanent operating rule, inherited by every subsequent cycle through brain-root injection at session start.]*

This soft-to-hard migration *mirrors* the job-maturation arc one level up. A stage-1 job's collaborative learning is the same shape as a coaching voice's probabilistic guidance — soft, contextual, frequent. A stage-2 job's `.md` plan is the same shape as a measured hook — structured, repeatable, gated. A stage-3 job's `.yaml` injection is the same shape as a fossilized template-default — automatic, baseline, no longer needing operator attention. A stage-4 plugin form is the same shape as a hardened plugin in the kit — structural, code-level, enforced. The brain grows along both axes simultaneously: jobs mature upward; controls migrate inward.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard horizontal pipeline — a behavioral pattern moving left to right through five stages of hardening, from coaching voice to fossilized template.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk stages
  and arrows; pastel chalk fills for the five stages (cyan, green, orange, pink, magenta — same palette as the cycle image, in left-to-right order);
  white chalk for ALL labels, arrows, and stage text; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, file names, or descriptors.
  Layout: Five hand-drawn rectangular chalk stages arranged horizontally across the board, left to right, equal size. White-chalk arrows connect each stage to the next (four arrows total). Each stage is labeled IN WHITE CHALK with TWO lines of text — the stage name on top, a short mechanism note below:
    Stage 1 (cyan fill, leftmost):
      Top:    "coaching voice"
      Bottom: "voice.xml — probabilistic"
    Stage 2 (green fill):
      Top:    "measurement"
      Bottom: "data.json counters"
    Stage 3 (orange fill):
      Top:    "hook block"
      Bottom: "PreToolUse — deterministic"
    Stage 4 (pink fill):
      Top:    "plugin tests"
      Bottom: "tests/ — protects the gate"
    Stage 5 (magenta fill, rightmost):
      Top:    "kit template"
      Bottom: "fossilized — every new plugin inherits"
  Above the five-stage pipeline, draw a single curving white-chalk arrow that arcs from Stage 1 over to Stage 5, with one short caption riding the arrow's curve IN WHITE CHALK exactly: "soft → hard → out of brain".
  Below the pipeline, a horizontal white-chalk note reads exactly: "Lock 13: data must show soft failed before hard lands".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching voice", "voice.xml — probabilistic", "measurement", "data.json counters", "hook block", "PreToolUse — deterministic", "plugin tests", "tests/ — protects the gate", "kit template", "fossilized — every new plugin inherits", "soft → hard → out of brain", "Lock 13: data must show soft failed before hard lands", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.3. Patterns travel left to right. The brain shrinks; the kit grows."
-->

---

## What's Enforced vs What's Discipline

A documented size limit and an enforced size limit are not the same thing. The prototype today is honest about the difference.

**Root brain: 3,500 words. Subdirectory CLAUDE.md: 800 words. Plan files: 2,000 words. Memory entries: 400 words each. Skill files: 500 words.** Five caps in the documentation table — all of them soft. None are policed by a code hook today. The brain stays within these caps because the CONDENSE phase compresses each layer cycle after cycle, not because a `PreToolUse` guard refuses an edit. *[ref: five-soft-size-caps-no-code-gate | ../CLAUDE.md ("### Size Limits" section) | Root CLAUDE.md "Size Limits" table lists: Root CLAUDE.md 3,500 / Subdir CLAUDE.md 800 / Plans 2,000 / MEMORY.md 400 / Skills 500. Grep confirms only `evolution-cap.sh` registers a PreToolUse word-count gate; every other limit relies on CONDENSE.compress discipline (called explicitly by phase_condense docs). The honest design choice: data must justify a hard gate (Lock 13 over-engineering veto) before code lands.]*

**`docs/evolution.md`: 2,000 words. Hard.** A `PreToolUse` hook (`evolution-cap.sh` inside `plugin_integrity`) intercepts every edit to a plugin's `docs/evolution.md`, counts the post-edit word count, and refuses the edit if it would push the file past the cap. The voice that fires names the cap, names the current count, and points the agent at the sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) where older content should migrate. The historian subagent reads that voice and uses the overflow rule to populate the sibling files as the plugin's narrative grows.

One hard limit out of six. The pattern is consistent with the cost ladder. `docs/evolution.md` got the hard gate because the historian subagent re-narrates the file on every drift trip, the result is auto-injected into the agent's context at every plugin unlock, and a bloated evolution.md would inflate the per-unlock context budget across the entire system. The cost of letting it grow was concrete; the gate paid for itself.

The other size limits are soft because the *measurement* has not yet shown the soft control failing. Root brain stays at its cap because CONDENSE compresses it. Subdirectory CLAUDE.md stays at its cap because CONDENSE migrates content out to knowledge files. Memory entries stay short because operators write feedback rules tersely. Skills stay small because operations exceeding fifty words get extracted to their own skill file. None of this needs a hook today. The honest claim: it might tomorrow. The cost ladder will decide.

A second enforcement runs at a different boundary — the *deflation gate* inside `phase_condense`. At condense entry, a sensor snapshots the total bottom-section word count across every CLAUDE.md the cycle touched. At commit time, the script re-measures and refuses to advance unless the absorbed-words ratio crosses a stage-aware threshold (single-cycle jobs default to eighty percent, multi-cycle to roughly fifty). The gate fires at commit, not at edit — which is the right boundary, because the question isn't *did this individual edit fit* but *did the cycle, taken as a whole, compress enough to graduate*.

The pattern reads cleanly: hard limits cost something to maintain (every gate adds friction, every gate adds tests), and the architecture won't pay that cost until the soft form has demonstrably failed. The discipline isn't *more* enforcement; it is enforcement *where it pays for itself*.

---

## The Maturation Arc — Apprentice / Journeyman / Architect

The four job-maturation stages above describe the *jobs*. The three operator-relationship stages here describe the *operator*. The two arcs run in parallel — most apprentice operators are mostly running stage-1 jobs; most architects are mostly running stage-3+ jobs.

**Apprentice.** Week one. You are figuring out the shape of OPEVC — when to advance phases, when to bail back, what the multiplier means in practice. Most cycles end in some form of intervention. The agent gets stuck on a phase gate, and you tell it what to do. It misreads scope, and you correct the multiplier. It writes prose into the wrong CLAUDE.md, and you point it at the right one. The voices speak to the agent constantly because the patterns are not yet ingrained.

This is the loud phase of cognitive growth — hooks firing on every tool call, voices coaching at every phase entry, blocks landing whenever the agent reaches for a tool the current phase forbids. Most of what you read in chat is the brain talking to the agent about the brain. The signal-to-noise ratio is bad on purpose — every misfire is a teachable moment, and the brain is busy teaching. Almost every job at this stage is stage-1 deep single-cycle. The seed is in learning mode; you are in teaching mode. Together you build the experiential data the seed will compress into its knowledge layer at cycle close.

The lessons are accumulating in three places: the knowledge directory under `.claude/knowledge/<topic>/`, the memory layer in your home directory, and each plugin's `docs/evolution.md`. The brain is bigger at the end of week one than it was at the start — apprenticeship grows by accretion.

**Journeyman.** Weeks four through twelve, roughly. Cycles are smoother. The agent has internalized OPEVC discipline. Multipliers tend to land in the right range. Phase advances happen automatically when the gate criteria are met. Bail-backs still happen, but they are typically real — the plan was wrong, not that the agent forgot to plan.

This is when jobs start *graduating*. A blog-writing job that was stage-1 in week two becomes a stage-2 multi-cycle job in week six because the seed has run it enough times to write the plan in advance. A research workflow that was stage-1 becomes stage-2 the same way. The patterns are also *migrating* — a coaching voice that has been firing in every cycle for six weeks becomes a candidate for hardening into a hook. The operator and the seed work together on these promotions, recognizing the pattern, writing the hook, watching the voice retire.

The CLAUDE.md hierarchy starts shrinking as findings that were durable last month migrate into plugin behavior or compress into knowledge files. The knowledge directory keeps growing; the brain itself reaches equilibrium.

**Architect.** Month three onward. Most cycles complete without you intervening on basics. The voices speak less, because most of what they used to say has been absorbed into hooks or moved to the knowledge layer. New plugin creation feels routine — the kit ceremony from [Essay 7](07-the-plugin-kit.html) is no longer ceremonial; it is the natural rhythm of how you respond to a new pattern. Stage-3 yaml jobs start appearing, and a few stage-4 plugin-form jobs begin to form. The operator's role has shifted from supervising the agent's cognition to directing it at higher-leverage problems.

What you have now is not a chatbot that you talk to. It is a cognitive instrument that you compose with. The composition still requires intent — the seed does not decide what to work on; you do — but the cognition itself runs on rails the seed enforces.

The prototype's plugin-version spread shows this arc directly. `job_core` carries `v0.2.0` with 172 tests — a young plugin, foundational, polished but not yet stress-tested across many cycles. `plugin_integrity` is at `v0.10.1` with 604 tests across 20 suites — the most mature plugin in the brain, because it polices every other plugin's edits and has been re-edited many times under its own gate. The phase plugins have converged at `v2.0.0`–`v2.4.0` with 118 to 376 tests each. Roughly twenty-six hundred tests across all eleven plugins as of today. The number itself isn't the point; the *spread* is. Mature plugins look different from young plugins, and the difference is visible in the test counts, in the version numbers, and in the depth of their `docs/evolution.md` narratives. *[ref: plugin-version-and-test-spread | ../CLAUDE.md ("Active enforcement (11 active plugins)" line) | Root CLAUDE.md drift-corrected 2026-05-13 lists: plugin_integrity v0.10.1 / 604 tests / 20 suites (post-A11.6.v2 upstream-reporter addition); job_core v0.2.0 / 172 tests; interaction_summary v1.1.0 / 83 tests; brain_guard v1.1.0 / 162 tests (NOT a phase plugin — always-on); question_discipline v1.0.0 / 36 tests; phasic_system v0.5.0 / 118 tests (lowest phase-plugin count; bumped from v0.4.0/101 during A11.8 yaml v2 Path C work); phase_observe v2.0.0 / 271; phase_plan v2.0.0 / 298; phase_verify v2.0.0 / 204; phase_execute v2.0.0 / 376 (highest); phase_condense v2.4.0 / ~288. Sum = 2,612 tests across 11 active plugins. The version range v2.0.0–v2.4.0 reflects independent versioning per phase plugin.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard staircase — three ascending stages showing the operator's relationship with the seed, with visible markers per stage.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk steps
  and labels; pastel chalk fills for each stage (cyan = apprentice, green = journeyman, magenta = architect — drawn from the cycle image palette);
  white chalk for ALL labels and stage markers; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, time-range labels, or marker descriptors.
  Layout: Three hand-drawn rectangular chalk steps ascending diagonally from lower-left to upper-right across the board, like a chalk staircase. Each step is wider than tall. From low to high:
    Step 1 (cyan fill, lowest-left). Two lines of label centered on the step IN WHITE CHALK:
      Top line:    "apprentice"
      Bottom line: "week 1"
      Below the step (outside the staircase), three short white-chalk markers stacked vertically:
        "voices fire constantly"
        "multipliers land wrong"
        "bail-backs are corrections, not real"
    Step 2 (green fill, middle). Two lines of label:
      Top line:    "journeyman"
      Bottom line: "weeks 4–12"
      Below the step, three short white-chalk markers:
        "patterns migrate"
        "hooks harden"
        "CLAUDE.md shrinks"
    Step 3 (magenta fill, highest-right). Two lines of label:
      Top line:    "architect"
      Bottom line: "month 3+"
      Below the step, three short white-chalk markers:
        "kit ceremonies routine"
        "compose with the seed"
        "direct higher leverage"
  Above the entire staircase, a single curving chalk arrow runs left-to-right along the climb with one short caption riding its curve IN WHITE CHALK exactly: "from supervising to composing".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "apprentice", "week 1", "voices fire constantly", "multipliers land wrong", "bail-backs are corrections, not real", "journeyman", "weeks 4–12", "patterns migrate", "hooks harden", "CLAUDE.md shrinks", "architect", "month 3+", "kit ceremonies routine", "compose with the seed", "direct higher leverage", "from supervising to composing", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.4. Three rough stages. Soft boundaries. The shape is real."
-->

---

## The Brain Stops Growing in Size

A brain that grows without bound becomes its own problem. Every CLAUDE.md the agent reads at session start is a tax on the context window. A ten-thousand-word root brain plus six three-thousand-word plugin brains plus four five-thousand-word working CLAUDE.md files is half the agent's working memory before any prompt is processed. The brain would drown the cognition.

The size caps force the brain to do what your own brain does: forget the right things. Or more precisely, *move* the right things.

Root-brain overflow distills into focused skill files (under `.claude/skills/` in the seed-agent's brain root, or — in the prototype today — at the operator's user-side memory dir), with a one-line pointer left behind in the brain. Plugin CLAUDE.md overflow routes into that plugin's slice of the knowledge directory, the body kept lean enough to read in one sitting. Working CLAUDE.md overflow gets handled at cycle close by the deflation gate from [Essay 6](06-the-markov-phasic-brain.html), walking the file's footer-to-body absorption and refusing to advance until enough has compressed. Memory-file overflow splits into multiple narrowly-scoped entries. Findings that don't belong in any CLAUDE.md belong in plugin behavior — hardened into a hook — or in a session archive as a last resort. *[ref: skills-overflow-prototype-vs-public | ../CLAUDE.md "Size Limits" + ~/.claude/projects/<encoded>/skills/ | The "Size Limits" table names Skills as a layer with a 500-word cap. In the prototype today, skill files (blog_update.md, plugin_evolve.md, spec_code_align.md) live at the Layer-2 architect's user-side memory path; the public seed-agent migration moves them into the seed's brain at `.claude/skills/`. Same overflow pattern, two homes during the migration phase.]*

The result is a brain that reaches a ceiling and stays there — even though the seed is learning constantly. The new learning is being *placed* in compartments outside the brain: the knowledge directory keeps growing, each plugin's `docs/evolution.md` keeps narrating, the hooks keep hardening. The brain itself — the small set of files the agent reads at session start — finds an equilibrium and stays close to it.

This is what I mean when I say the brain stops growing in size but never stops learning. The compression isn't a limitation. It is the discipline by which the seed remains coherent across long timescales.

A mature seed is a small brain over a large knowledge layer.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard graph — two curves over time. A flat ceiling line for the brain's size; a rising monotonic curve for the knowledge directory.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk axes
  and curves; pastel chalk for the curves (cyan = knowledge growing, magenta = brain at ceiling, green = plugin evolution stepwise);
  white chalk for ALL axis labels, ceiling lines, and word-count numbers; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal numbers and labels listed below. Do not invent or substitute any other word-count caps, axis labels, or curve descriptors.
  Layout: A hand-drawn chalk coordinate axes. Horizontal X-axis labeled IN WHITE CHALK exactly "cycles", with a small "→" arrow at its right end. Vertical Y-axis labeled IN WHITE CHALK exactly "words". Three curves drawn over the axes, each labeled in white chalk at the curve's right end:
    Curve A (cyan, rising monotonically from lower-left to upper-right, gently curved, growing without bound):
      Label at right end: "knowledge/"
    Curve B (green, climbing in small stepwise jumps, leveling off near 2000):
      Label at right end: "plugin evolution.md"
    Curve C (magenta, climbs steeply at first, then flattens into a horizontal line that runs along a dashed ceiling):
      Label at right end: "root brain"
  Four dashed horizontal white-chalk ceiling lines drawn across the chart at the levels Curve C flattens and Curve B levels off, each labeled at the right with its EXACT word-count cap:
    "3,500" (highest dashed line — root CLAUDE.md cap)
    "2,000" (next — plan + evolution.md cap)
    "800"   (subdir CLAUDE.md cap)
    "500"   (skill files cap)
    "400"   (memory entries cap)
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "cycles", "words", "knowledge/", "plugin evolution.md", "root brain", "3,500", "2,000", "800", "500", "400", plus the caption below. No other words, file names, folders, or curve descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.5. The brain reaches a ceiling. The knowledge layer never does."
-->

---

## Tier-3 Close: A System That Safely Modifies Itself

The plugins enforce the work. The phases produce the work. CONDENSE absorbs the work into the brain. The lock ceremony lets the brain edit itself. The historian narrates the edits. The drift counter ratchets the historian. The safe-lock cycle reverts on test failure. The knowledge layer accumulates what the brain itself has compressed away. The maturation arc fossilizes patterns into the kit.

The recursion is real, not metaphorical. The prototype recently needed to fix a concurrency race in `plugin_integrity`'s own guard hook — the exact code that polices every other plugin's edits. The fix required the agent to issue `[PLUGIN-LOCK] plugin_integrity`, run `plugin_integrity`'s own test suite, pass it, and let `plugin_integrity` lock itself before the change was committed. The guard did not exempt itself. The lock that closed that cycle is the same lock that opens the next. The historian subagent attached to `plugin_integrity` narrated the cycle's commits into the plugin's own `docs/evolution.md`. And during CONDENSE, the agent edited the root brain itself — `.claude/CLAUDE.md` — but only because it was in CONDENSE, the only phase whose guard permits writes to the brain.

Every layer is reachable. Every reach is gated by the same gates the rest of the system runs on.

Every part of the loop has a guard. Every part has a self-test. Every part has a coaching voice and a structured block. The architecture does not trust the operator to remember the rules. It does not trust the agent to remember the rules. It encodes the rules into the parts that touch the work, and lets the parts enforce themselves on each other.

The reason this matters is the reason agent reliability has been hard. A reliable agent is one whose behavior you can predict from cycle to cycle, not a clever one whose tricks impress in a single session. Predictability across time requires that the agent's *substrate* — its rules, its hooks, its phase boundaries — outlive any single session and any single LLM context. The seed agent is built so that the substrate does outlive those things. The chat dies. The model rolls forward. The operator forgets. The brain remembers, because the brain is on the filesystem, protected by guards that the filesystem itself enforces.

The deepest of those guards is the test-pass-or-revert cycle. Every plugin edit in the prototype passes through `safe-lock.sh`. If every test passes, the change commits and the lock closes. If any test fails, the working tree is rolled back to a captured `checkpoint_ref` and a structured entry lands in `plugin_integrity`'s revert log — timestamp, list of failed tests, list of files restored, the SHA before the revert. The log is not aspirational; it is forensic. One real entry from May 2026 shows a multi-file edit during tmux-dispatch + window-pin work that failed the brain_guard test suite; the safe-lock cycle reverted all seventeen touched files in one atomic operation at SHA `0be87eb4`, and the operator went looking for the actual bug. The brain did not absorb a broken state. The test suite said no, and the substrate stayed coherent. *[ref: safe-lock-revert-log-forensic | .claude/plugins/plugin_integrity/scripts/safe-lock.sh:113,137,152 + .claude/plugins/plugin_integrity/scripts/voice.xml:31 + plugin_integrity/data.json revert_log (local, gitignored) | safe-lock.sh L113: guard validates `((.revert_log == null) or (.revert_log | type == "array"))`. L137 initializes the schema: `'{"unlocked_plugin":"","checkpoint_ref":"","unlocked_test":"","revert_log":[]}'`. L152 appends to the log on revert: `.revert_log = (.revert_log // [])`. The `auto-revert-fired` voice (scripts/voice.xml L31) instructs the operator: "Recover uncommitted work via: git checkout {{pre_sha}} -- .claude/plugins/{{plugin}}/ ... Check .claude/plugins/plugin_integrity/data.json .revert_log[-1] for reverted_files + pre_revert_sha + trigger_reason." A live revert_log entry on 2026-05-03 09:21 captures 17 files reverted + many failed tests + pre-revert SHA 0be87eb4 — the exact incident shape the blog describes.]*

*That* is the durability guarantee that travels — not careful authorship, not clever prompts, not the discipline of any individual cycle. Code does not land if it breaks. The default is rollback. A system that safely modifies itself, under your direction, in your filesystem.

That is the seed agent.

---

## The Seed Is Yours

The Hadosh Academy seed agent is open source. MIT licensed. Free to use, free to fork, free to extend. There is no SaaS layer between you and your seed. No server holds your knowledge directory. No company controls your brain.

When you install a seed on your laptop, it becomes yours. The architecture is the architecture I have described across these eight essays. But the cycles are yours. The patterns it codifies, the voices it speaks, the hooks it hardens — they will be the patterns your work surfaces, the voices your judgment shapes, the hooks your edge cases call into existence. Your first jobs will be stage 1 — collaborative, learning-mode, slow on purpose. Some of those jobs will mature into stage 2, then stage 3, and a few — for the work shapes that need real customization — into stage 4 plugins that exist nowhere else but in your seed.

Two operators with two seeds, six months in, will have brains that are visibly different. The architectures are the same. The lived seeds are not. That is the design.

This is what changes when the architecture itself is teachable. The agent-developer-user triangle most software defaults to — where one role builds, another configures, a third uses — collapses to two: the agent and you. The substrate is portable enough that the user can be the architect. Call it the **PowerPoint of seed agents**: a complex artifact made authorable by enough high-level structural understanding, without anyone having to write the underlying machinery. [Essay 5](05_1-the-two-layer-foundation.html) gave you the substrate. [Essay 6](06-the-markov-phasic-brain.html) gave you the cognitive cycle that uses it. [Essay 7](07-the-plugin-kit.html) gave you the template for growing it. This essay closes the loop: the maturation arc that takes a stage-1 conversation into a stage-4 plugin is what makes your seed *yours*. The seed is the architecture; you are the architect.

The Academy exists because growing a seed well is a craft, and craft benefits from community. Other operators are growing their own seeds. They are running into patterns you will recognize and patterns you have not seen yet. The knowledge they are accumulating is not interchangeable with yours — but the *recipes* for accumulating it well are shareable, and that is what we are gathered to share. When your seed fixes a bug in one of the shipped plugins, the seed asks you `[REPORT-TO-UPSTREAM]` and prepares a structured report for you to push back to the public repo. The shared substrate stays alive because every operator's seed contributes back through that same channel. *[ref: report-to-upstream-handler | .claude/plugins/plugin_integrity/hooks/upstream-reporter-hook.sh:5,14,20,54-55 | L5 docstring: "Captures the user's answer to a [REPORT-TO-UPSTREAM] question and, on [yes], builds a structured report." L14: "user via [REPORT-TO-UPSTREAM] <plugin> <description>; the user [approves the report]." L20: documented question shape "[REPORT-TO-UPSTREAM] <plugin_name> <one-line-description>". L54-55: prefix gate `echo "$QUESTION" | grep -q '^\[REPORT-TO-UPSTREAM\]' || exit 0`. Built 2026-05-13 in A11.6 as part of the alpha-release migration prep.]*

Your brain was never built for the pace this work moves at. You knew that from [Essay 3](03-your-brain-was-never-built-for-this.html). What you have now is something built *for* that pace, designed to grow with you, encoded into a folder you control, governed by disciplines that hold across time and across sessions and across the model rolling forward.

The seed is yours. The Academy is here.

Build the brain.

---

*Essay 8 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*

*The series ends here. The seed begins where you start it.*
