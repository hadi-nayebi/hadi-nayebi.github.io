---
title: "PLAN — Decide, Then Lock"
date: "May 2026"
slug: "plan"
read_time: "10 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, Plan]
status: draft
version: v0.4.0
audience: "Tier 2"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# PLAN — Decide, Then Lock

*Essay 6.4 — The Markov Phasic Brain, Part 4 of 10.*

---

[Essay 6.3](06_3-observe.html) closed with OBSERVE handing forward — the working CLAUDE.md filled with what the cycle needs to know, the orchestrator advancing the job. PLAN is what receives it.

PLAN is the compartment where observations become a binding contract. Where OBSERVE answered "what is the current situation," PLAN answers "what will we do about it" — and writes the answer down with enough specificity that EXECUTE can build against it without inventing on the fly. The cognitive failure PLAN prevents is the *rationalized plan* — the after-the-fact narrative an agent writes once it has already committed code, where every decision looks justified because it has already been made. A separate planning phase, with no write access to project files, forces the decisions to land before the work starts.

PLAN reads three kinds of sources. It reads back the CLAUDE.md files OBSERVE just populated, because those carry the cycle's current understanding. It reads the existing plan document if the job already has one — multi-cycle work inherits a `.md` plan that earlier cycles drafted, and PLAN's first move on cycle 2 and beyond is to re-read that file as the long-term contract the cycle inherits. And it reads the seed agent's `.claude/knowledge/` directory the same way OBSERVE does, for patterns that survived past cycles. Like every other phase, PLAN can dispatch its own family of subagents — plan-step-breaker, plan-criteria-writer, plan-scope-analyzer, plan-risk-assessor among them — and like every other phase, it carries a direct-action budget that pushes the main session toward delegation.

The write side mirrors OBSERVE's compartmentalization. PLAN is read-only against project files.

Its CLAUDE.md writes cascade downward from its own footer anchor. `---Pl---` is the primary section the phase guard nudges PLAN toward, but the same enforcement permits writes into `---Ex---` and `---Ve---`. The pattern is deliberate. PLAN is encouraged to pre-stage the EXECUTE altered-list and the VERIFY checklist as it lands its own decisions, so the next two phases inherit context already in the file rather than having to reconstruct it. *[ref: plan-anchor-cascades-downward-not-fenced | .claude/plugins/phase_plan/hooks/plan-guard.sh:269 + .claude/plugins/lib/section_guard/section-check.sh Element 5 | plan-guard calls check_section_edit "---Pl---" against every CLAUDE.md edit. Element 5 of section-check.sh enforces that the edit targets content STRICTLY BELOW the phase marker. Because the four anchors are ordered ---Ob--- < ---Pl--- < ---Ex--- < ---Ve---, PLAN can edit Pl + Ex + Ve sections. The architecture is cascading-downward soft-encouragement, not strict between-section lockout: voice injections and point gates nudge PLAN toward writing under ---Pl---, but pre-staging EXECUTE's altered list under ---Ex--- and the VERIFY checklist under ---Ve--- is explicitly permitted and encouraged.]*

The one project-file exception is the *naming* of the plan_file. PLAN runs a single cycle-1-only CLI call (`plan.sh set-plan-file`) that registers the path the rest of the cycle will execute against — but PLAN does not create the file. EXECUTE creates it. PLAN just names it.

The phase's pacing follows the cycle's shared shape.

The multiplier sentinel locks every tool at phase entry until the agent commits to a depth. The lock is structural protection against rushing PLAN without forecasting its scope — the prior `multiplier: 1` default let the agent skip the choice entirely. *[ref: plan-multiplier-sentinel-prevents-silent-skipping | .claude/plugins/phase_plan/scripts/plan.sh set-multiplier case-arm + .claude/plugins/phase_observe/hooks/observe-guard.sh:189 canonical WHY comment | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if points have already accrued (preventing reset), writes the immutable value to data.json. The WHY is identical across phases, stated canonically in observe-guard.sh:189: "structural protection against the 2-month recurring multiplier-mistake — without it, the prior multiplier: 1 default let the agent skip the choice entirely." Sentinel is the same shape every phase shares; only the subagent roster differs.]* Smaller numbers declare a deeper phase: a multiplier of 0.5 means each action awards half the base points, so more actions are needed to fill the 100-point phase-transition bucket. Larger numbers (2 to 3) award proportionally more per action, so the bucket fills with fewer actions — a faster, surface-level pass.

A pair of point gates paces the read/write rhythm against the working CLAUDE.md. A small direct-action budget grants +3 per plan-subagent dispatch and consumes 1 per direct CLAUDE.md edit outside `.claude/` — the same mechanism that pushes OBSERVE toward delegation, here pushing PLAN the same way. The mechanics mirror OBSERVE; only the subagent roster differs.

The rest of this essay opens the plan-state machine the plan_file moves through across cycles, opens the plan document's opinionated structure, and closes on the customization surfaces.

The first thing the agent does on entering PLAN — after the multiplier — is name the plan_file. The job-form classification was already made by OBSERVE in cycle 1; PLAN inherits that classification and registers the file path the rest of the cycle will execute against.

---

## Naming the contract

PLAN inherits the job-form classification from OBSERVE: single-cycle, multi-cycle with a working `.md` plan, or multi-cycle whose `.md` has graduated into a `.yaml`. When the form is multi-cycle, PLAN's first concrete act after the multiplier is to name the plan_file via `plan.sh set-plan-file` — a cycle-1-only call that locks the path for the rest of the job.

The file's lifecycle splits across phases from there. EXECUTE creates the named document in cycle 1 and writes the initial plan into it. VERIFY edits it across every cycle — appending status rows, captured lessons, completion marks as the work matures. PLAN itself never edits the file directly; from cycle 2 onward it reads the file back at phase entry, treating it as the long-term contract the cycle inherits. *[ref: set-plan-file-cycle-1-immutable | .claude/plugins/phase_plan/scripts/plan.sh set-plan-file case-arm | PLAN's set-plan-file CLI accepts false for single-cycle or plan_*.md for multi-cycle; cycle 1 only, dies on re-call, locks the form for the rest of the job.]*

The contract is not static. The plan moves through a `plan_state` machine — `drafting` while the .md still refines, `md_approved` flipping the gate that lets a later cycle create the .yaml. *[ref: plan-state-defaults-by-extension-on-set-plan-file | .claude/plugins/phase_plan/scripts/plan.sh:370-378 set-plan-file extension dispatch | set-plan-file inspects the filename extension: plan_*.md initializes plan_state="drafting"; plan_*.yaml initializes plan_state="yaml_drafting". The state at job birth is decided by which artifact the agent declared, then advances only via approve-md / approve-yaml / seal-plan.]*

---

## The state machine

The plan moves through a small set of active states — five active plan states, plus the implicit `none` start — extensible as the design matures. *[ref: plan-state-enumerated-as-named-values | .claude/plugins/phase_plan/scripts/plan.sh:646-654 plan-state subcommand | The plan-state hook-read returns one of: none | drafting | md_approved | yaml_drafting | yaml_ready | sealed. The value lives on the job object in data.json — same source as plan_file — not in plan-file frontmatter, so a single jq read returns the lifecycle stage.]*

`drafting` keeps the .md circulating — VERIFY refines it cycle after cycle, the contract sharpens. `md_approved` is the flip: VERIFY asks the user via AskUserQuestion, the user answers yes, the state lifts and the next cycle is dedicated to creating the .yaml. *[ref: plan-approve-md-flips-state-via-askuserquestion | .claude/plugins/phase_plan/scripts/plan.sh:846-863 approve-md case-arm + .claude/plugins/question_discipline/hooks/question-discipline-gate.sh PREFIX_REGISTRY [PLAN-APPROVAL] | approve-md requires plan_state==drafting, then sets plan_state=md_approved with output "Next cycle creates .yaml." The flip is triggered by VERIFY firing an AskUserQuestion with the registered [PLAN-APPROVAL] prefix — the registered prefix routes the answer through the verify-side handler, not a chat-marker scan.]*

`yaml_drafting` is the parallel arc — EXECUTE writes the .yaml; VERIFY refines it across however many cycles it takes, with backward to PLAN allowed when the analysis underneath needs revisiting. `yaml_ready` is a second user-gated flip, and from that point the .yaml is injected at phase entry on every cycle that follows — the plan is now actively shaping the agent's context. *[ref: plan-approve-yaml-and-yaml-injection-at-phase-entry | .claude/plugins/phase_plan/scripts/plan.sh:865-879 approve-yaml + .claude/plugins/phasic_system/hooks/phase-init.sh write_yaml_cache | approve-yaml requires plan_state==yaml_drafting, then sets plan_state=yaml_ready. From that flip on, phase-init.sh's write_yaml_cache runs at every phase transition: reads phase.sh --hook read-yaml for the current cycle+phase, writes the JSON field-map to the yaml-injection cache that voice-helper auto-appends to every matching voice id.]*

`sealed` is optional and terminal; `seal-plan` is the only command that archives the pair to `completed_plan[]`. Approval is a state flip, not a retirement — the plan keeps working until it is explicitly sealed. *[ref: plan-seal-plan-archives-to-completed-plan | .claude/plugins/phase_plan/scripts/plan.sh:881-898 seal-plan case-arm | seal-plan is the terminal command: requires plan_state==yaml_ready, sets completed_plan[] += plan_file, then plan_file=false + plan_state=sealed. approve-md and approve-yaml are state flips; only seal-plan archives.]*

The full mechanism — including how the `.yaml` injects into every phase entry — is the subject of [Essay 6.10](06_10-plan-state-machine.html).

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plan-state-machine-b6-4.png
  Concept: Chalk-on-blackboard diagram — the plan-state machine. Five named states plus the implicit `none` start, connected by labeled transitions.
  Style: Match `opevc-cycle-blackboard.png` exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the state circles;
  white chalk for labels, transition arrows, and self-loop labels; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other state names, transition labels, or descriptors.
  Layout: A horizontal chain of state circles across the board, left to right, with two self-loops and one optional terminal branch.
    Circle 1 (small, dim white border, leftmost): labeled "none".
    Circle 2 (cyan border): labeled "drafting", with a small curved chalk self-loop above it labeled "verify refines .md".
    Circle 3 (green border): labeled "md approved".
    Circle 4 (orange border): labeled "yaml drafting", with a small curved chalk self-loop above it labeled "verify refines .yaml".
    Circle 5 (pink border): labeled "yaml ready".
    Circle 6 (magenta border, drawn smaller and slightly off-axis to mark it as optional terminal): labeled "sealed".
    White chalk arrows connect them in order: none → drafting → md approved → yaml drafting → yaml ready → sealed.
    Above the arrow from drafting to md approved, a white chalk note: "approve-md".
    Above the arrow from yaml drafting to yaml ready, a white chalk note: "approve-yaml".
    Above the arrow from yaml ready to sealed, a white chalk note: "seal-plan (optional)".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "none", "drafting", "md approved", "yaml drafting", "yaml ready", "sealed", "verify refines .md", "verify refines .yaml", "approve-md", "approve-yaml", "seal-plan (optional)", plus the caption below. No other words, file names, folders, or state descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.4. The plan-state machine. Approval is a state flip; only seal-plan retires the pair."
-->

---

## Inside the plan document

Plan documents live at a known path inside the agent's knowledge directory. Their structure is opinionated.

Each one carries a stated goal, an acceptance-criteria list, the *altered list* — the dirs whose CLAUDE.md the agent edited during OBSERVE or PLAN, each one scoped exactly (no walking up to parents, no descent into nested dirs), [introduced in Essay 5.7](../b5/05_7-claude-md-hierarchy.html) as the mechanism that lets PLAN scope EXECUTE's reach — and an explicit set of judgment-call criteria. The judgment-call criteria are the points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe. *[ref: plan-subagents-encode-structure | .claude/plugins/phase_plan/agents/CLAUDE.md Agent Inventory section | PLAN's specialized subagents (currently six in the prototype) encode the plan-document's opinionated structure: plan-step-breaker decomposes steps, plan-criteria-writer authors acceptance criteria, plan-scope-analyzer maps altered-list directories, plan-risk-assessor names judgment calls.]*

The `.md` and the `.yaml` live side-by-side once both exist, and they are not the same artifact wearing different masks. The `.md` is the human-readable accumulating prose; the `.yaml` is the parseable injection target the orchestrator reads at phase entry to pour context-specific content into the working session. *[ref: yaml-injection-cache-populated-at-phase-entry | .claude/plugins/phasic_system/hooks/phase-init.sh write_yaml_cache function | At every phase transition, write_yaml_cache reads the .yaml's current cycle+phase field-map via phase.sh --hook read-yaml and writes it as JSON to YAML_INJECTION_CACHE. voice-helper.sh consumes the cache jq-lookup-per-voice: any voice id matching a yaml key gets its value appended at fire time. The yaml is per-cycle-per-phase context dripped into the agent's working voice stream.]*

Both files carry a small identification frontmatter at the top — a `job:` line and a `plan_file:` line — declaring which job they belong to and nothing more. The lifecycle *state* — where the plan sits in its drafting and approval arc — does not live in either file. It lives on the job object inside `data.json`, alongside every other job-level field, because the state describes the whole plan lifecycle that spans the pair; the files are the artifacts, the state describes the pair. *[ref: yaml-identification-frontmatter | .claude/knowledge/plans/plan_phasic_and_phase_plugins_coverage.yaml:1,3 | The identification frontmatter at the top of a real .yaml plan file: line 1 `job: <id>`, line 3 `plan_file: <name>.md` (with line 2 `job_name:` between them). Every plan file carries this convention.]*

---

## The contract handoff

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE. This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check. *[ref: altered-list-frozen-at-execute-entry | .claude/plugins/phase_execute/hooks/execute-sensor.sh:158-172 | execute-sensor.sh merges OBSERVE and PLAN altered lists at execute entry, then calls execute.sh set-altered-list to snapshot the merged scope into execute's data.json — the freeze that fences EXECUTE to PLAN's contract.]*

If EXECUTE wants to touch a file the plan didn't list, the request is blocked. *[ref: execute-altered-list-exact-match-block | .claude/plugins/phase_execute/hooks/execute-guard.sh:826-902 altered-list scope check | execute-guard reads the merged altered-list (observe + plan altered_claude_md snapshots) at every Edit/Write, normalizes the file path against project root, then runs grep -qxF for exact match. Any CLAUDE.md not in the list triggers "BLOCKED: This CLAUDE.md is not in altered list." Walking up to a parent CLAUDE.md to silently expand scope is what the exact-match check prevents.]* The agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

---

## Same gate, same forecast

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate. *[ref: plan-set-multiplier-validates-range | .claude/plugins/phase_plan/scripts/plan.sh:309-325 | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if the entry already has points (preventing reset), then writes the immutable value to data.json.]*

## What PLAN cannot do

The discipline of PLAN is in what its guard refuses. PLAN's Read tool is *not* unrestricted — the same hook that lets OBSERVE freely (within budget) walk the codebase blocks PLAN from opening any file outside `.claude/`. The agent can read CLAUDE.md files, memory files, and exactly one project artifact: the focused job's own plan file. Every other path is rejected at the tool boundary. *[ref: plan-read-restriction-claude-md-only | .claude/plugins/phase_plan/hooks/plan-guard.sh:294-307 | The Read branch allows CLAUDE.md, memory files under `.claude/projects/.../memory/`, and the named plan_file from the focused job; every other path falls through to a tool-restriction block. The structural rule: PLAN cannot self-observe.]*

The rule is intentional. PLAN that can re-read project source mid-plan is no longer planning; it is doing piecemeal observation, drifting back into context-gathering with no commit, no synthesis-into-CLAUDE.md, no accountability for the decision-making the phase exists to do. If PLAN realizes it needs more context, the only honest move is backward to OBSERVE — explicit, committed, recorded in cycle history. The fence is what keeps the phase boundary load-bearing.

Bash falls the same way. Read-only git inspections pass — `git log`, `git diff`, `git show` — but any write-shaped command is blocked, and the only `job_core` operations admitted are read-only `show`, `focused`, `list`. PLAN reads the world it inherited from OBSERVE; it does not extend it. *[ref: plan-bash-narrow-allowlist-git-readonly | .claude/plugins/phase_plan/hooks/plan-guard.sh:314-344 Bash case-arm | The Bash branch allows git log|blame|diff|show|shortlog|rev-parse|status|branch as read-only inspection, plus job.sh show|focused|list and a handful of phase-progress scripts (plan-commit.sh, phase.sh current); everything else falls through to "tool-restriction-git-write" or "tool-restriction-bash" blocks.]*

## A worked example

The multi-cycle plan-job from the previous essay enters its third cycle's PLAN phase. The orchestrator has already injected the .yaml at phase entry, OBSERVE has handed forward a synthesis that flagged the marker-schema contradiction from cycle 2, and the architect's `[WAITING]` answer routed the work toward "revert cycle 2's code and re-author the .yaml entry." *[ref: waiting-routes-to-architect-not-cycle-stop | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh PREFIX_REGISTRY [WAITING] entry | The [WAITING] prefix is registered in question-discipline-gate.sh's PREFIX_REGISTRY readonly array. An AskUserQuestion with [WAITING] routes the question to the architect for steering rather than tripping the cycle-stop hook — the agent pauses without burning the cycle's points, then resumes with the answer in hand.]*

The agent picks the multiplier — toward the higher end of the range, a tighter phase than OBSERVE because the decisions are narrower. The lock lifts. The agent re-reads the .md plan file (allowed — it is this job's focused plan_file), re-reads the OBSERVE synthesis in the working CLAUDE.md, and walks the cycle-2 entry in the .yaml side-by-side.

PLAN's deliverable is decisions inside CLAUDE.md, written below the `---Pl---` marker: the *altered list* gets one new directory added — the public seed repo's marker schema directory — declaring it editable by EXECUTE. The acceptance criteria gain a clause: "cycle-3 .yaml entry passes the new marker schema round-trip." A judgment-call criterion is named explicitly — "if revert breaks downstream cycle-2 work, EXECUTE pauses and routes a `[PENDING-JOB]` for CONDENSE." *[ref: pending-job-marker-consumed-by-condense-step3 | .claude/plugins/phase_condense/agents/condense-job-creator.md + .claude/plugins/phase_condense/hooks/voice.xml waterfall-step-3-pending-jobs | CONDENSE step 3 of the 7-step waterfall greps every altered CLAUDE.md's ---Ex--- / ---Ve--- footers for [PENDING-JOB] markers and dispatches condense-job-creator. The subagent calls job.sh create-dependent to file each out-of-scope item as a follow-up job before knowledge routing runs.]*

PLAN does not touch the .yaml file. It does not touch the .md plan. It does not write to the public seed repo. It writes the new acceptance criteria into CLAUDE.md, names the altered-list expansion, and commits. EXECUTE inherits a fully scoped contract.

## What you would customize

Two surfaces are where most architects will adjust PLAN.

The first is the *plan-document structure*. The prototype's plan documents are opinionated — goal, acceptance criteria, altered list, judgment-call criteria — encoded in the plan-* subagent roster (currently six in the prototype). A seed working on long research engagements might want hypotheses-and-evidence as the primary structure. A seed operating in regulatory contexts might want a compliance-checklist section as a first-class block. The subagent roster is the surface; the structure they enforce is yours. *[ref: plan-subagent-roster-as-customization-surface | .claude/plugins/phase_plan/agents/ directory listing | The prototype's plan subagents currently ship as plan-context-evaluator, plan-criteria-writer, plan-dependency-checker, plan-risk-assessor, plan-scope-analyzer, plan-step-breaker — each one owns a slice of the plan-document structure. Adding a new section type to your seed's plans means adding a sibling subagent that authors it.]*

The second is the *altered-list discipline*. The current rule is binary — a directory is in the list or it is not; if it is, EXECUTE can edit any CLAUDE.md-declared directory within it. Your seed might want a finer-grained scope: read-allowed but write-disallowed; write-allowed but only for files matching a pattern; per-subagent overrides. The altered list is the load-bearing contract output of PLAN, and every refinement of it tightens what EXECUTE can do without rolling backward.

The PLAN-as-binding-contract pattern lifts off the prototype into any work where scope creep is the slow killer. A consulting practice cultivating a delivery-engagement seed could use the same discipline for client work: an engagement-scoping associate runs the seed through a cycle-1 PLAN that names the engagement plan file via `set-plan-file`, the plan_state machine carries the contract through `drafting` as the team negotiates with the client, the altered list scopes which deliverables the next cycle is allowed to draft. Mid-engagement scope creep then requires an explicit backward step — PLAN re-opens, the altered list grows, the contract changes on the record — not a silent edit in someone's inbox.

The honest limit is that the contract-lock is friction, not mathematical enforcement: voice injections, the cycle-1 immutability ceremony, the counter on plan-file edits. *[ref: inc-plan-file-read-counter-tracks-recall | .claude/plugins/phase_plan/scripts/plan.sh:597-606 inc-plan-file-read + L608-615 plan-file-reads | The counter is per-plan-entry; plan-tracker.sh increments on PostToolUse:Read of the focused job's plan_file path. plan-commit.sh's cycle-2+ force-advance check blocks until the counter is at least 1, so the agent cannot advance without recalling the plan file at least once per cycle.]*

A determined operator can still edit the .md outside VERIFY through [gmode](06_9-gmode.html), the named off-cycle lane, and pay the deliberate-bypass tax of composing the justification. *[ref: gmode-justification-floor-deliberate-bypass-tax | .claude/plugins/phasic_system/hooks/gmode-gate.sh:79 word-count check + [GMODE] in PREFIX_REGISTRY | gmode-gate.sh enforces GMODE_WORD_MIN (default 100) on the [GMODE] question body; less than the floor blocks with the deficit count surfaced as "need N more." The justification cost is the friction that makes the bypass deliberate — the gate measures word count, not intent.]* The mechanism slows the agent enough that the operator can intervene; it does not make the edit physically impossible.

What the architect would **not** customize is the prohibition against PLAN reading project source. The principle is the floor: a planning phase that lets the agent re-observe is not a planning phase.

The deepest payoff of PLAN is the cognitive failure mode it prevents: the post-hoc rationalization. Plans written *during* execution are not plans; they are explanations the executor gives itself for whatever it just did. By forcing the contract to be authored before any code is touched — and by refusing the agent the tools to re-observe halfway through — the seed agent forecloses that drift structurally. The plan can be wrong; that is what VERIFY is for, and what backward transitions are for. What it cannot be is silently rewritten.

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

*Essay 6.4 — The Markov Phasic Brain, Part 4 of 10.*

*Previous: [Essay 6.3 — OBSERVE — Read Wide, Write Once](06_3-observe.html) — project-read-only synthesis, multiplier sentinel, paired gates.*
*Next: [Essay 6.5 — EXECUTE — Build, in Scope, in Steps](06_5-execute.html) — the universal file-creator, fenced to the altered list.*




