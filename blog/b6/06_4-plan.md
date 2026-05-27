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

PLAN is the compartment where observations become a binding contract. Where OBSERVE answered "what is the current situation," PLAN answers "what will we do about it" — and writes the answer down with enough specificity that EXECUTE can build against it without inventing on the fly. The cognitive failure PLAN prevents is the *rationalized plan* — the after-the-fact narrative an agent writes once it has already committed code, where every decision looks justified because it has already been made. A separate planning phase, with no write access to project files, forces the decisions to land before the work starts. *[ref: plan-read-only-against-project-files | .claude/plugins/phase_plan/hooks/plan-guard.sh Edit|Write branch (L234-291) | PLAN's Edit/Write branch allows only CLAUDE.md files (section-bounded to `---Pl---` and below) and memory files; every non-CLAUDE.md project path falls through to a block ("Non-CLAUDE.md files — blocked" at L291). The read-only-against-project-files posture is structural — PLAN cannot write code, only plan into CLAUDE.md.]*

PLAN reads three kinds of sources. It reads back the CLAUDE.md files OBSERVE just populated, because those carry the cycle's current understanding. It reads the existing plan document if the job already has one — multi-cycle work inherits a `.md` plan that earlier cycles drafted, and PLAN's first move on cycle 2 and beyond is to re-read that file as the long-term contract the cycle inherits. And it reads the seed agent's memory files — the cross-session notes that persist between conversations, where earlier runs recorded the user's preferences and the durable decisions that outlive any single cycle. *[ref: plan-reads-three-source-types | .claude/plugins/phase_plan/hooks/plan-guard.sh Read branch (L294-307) | PLAN's Read branch allows exactly three source types: CLAUDE.md files (exit 0 at L297), the focused job's own plan_file (resolved via `plan.sh --hook plan-file`), and memory files; every other path is blocked. Those three are the only sources the phase reads back — PLAN cannot self-observe project source.]*

The write side mirrors OBSERVE's compartmentalization. PLAN is read-only against project files.

Its CLAUDE.md writes cascade downward from its own footer anchor. `---Pl---` is the primary section the phase guard nudges PLAN toward, but the same enforcement permits writes into `---Ex---` and `---Ve---`. The pattern is deliberate. PLAN is encouraged to pre-stage the EXECUTE altered-list — the set of directories EXECUTE will be cleared to write into — and the VERIFY checklist as it lands its own decisions, so the next two phases inherit context already in the file rather than having to reconstruct it. *[ref: plan-anchor-cascades-downward-not-fenced | .claude/plugins/phase_plan/hooks/plan-guard.sh:269 + .claude/plugins/lib/section_guard/section-check.sh Element 5 | plan-guard calls check_section_edit "---Pl---" against every CLAUDE.md edit. Element 5 of section-check.sh enforces that the edit targets content STRICTLY BELOW the phase marker. Because the four anchors are ordered ---Ob--- < ---Pl--- < ---Ex--- < ---Ve---, PLAN can edit Pl + Ex + Ve sections. The architecture is cascading-downward soft-encouragement, not strict between-section lockout: voice injections and point gates nudge PLAN toward writing under ---Pl---, but pre-staging EXECUTE's altered list under ---Ex--- and the VERIFY checklist under ---Ve--- is explicitly permitted and encouraged.]*

The one project-file exception is the *naming* of the plan_file. PLAN runs a single cycle-1-only CLI call (`plan.sh set-plan-file`) that registers the path the rest of the cycle will execute against — but PLAN does not create the file. EXECUTE creates it. PLAN just names it. *[ref: plan-names-but-cannot-create-plan-file | .claude/plugins/phase_plan/hooks/plan-guard.sh:287-288 knowledge-protection block | PLAN's Write/Edit on any `.claude/knowledge/` non-CLAUDE.md path — including `knowledge/plans/<name>.md` and the `.yaml` form (blocked one branch earlier at L282) — is rejected with "knowledge-protection". PLAN names the plan_file via the cycle-1 set-plan-file call but cannot write the document itself; EXECUTE creates it.]*

The phase's pacing follows the cycle's shared shape.

The multiplier sentinel locks every tool at phase entry until the agent commits to a depth. The lock is structural protection against rushing PLAN without forecasting its scope — the prior `multiplier: 1` default let the agent skip the choice entirely. *[ref: plan-multiplier-sentinel-prevents-silent-skipping | .claude/plugins/phase_plan/scripts/plan.sh set-multiplier case-arm + .claude/plugins/phase_observe/hooks/observe-guard.sh:189 canonical WHY comment | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if points have already accrued (preventing reset), writes the immutable value to data.json. The WHY is identical across phases, stated canonically in observe-guard.sh:189: "structural protection against the 2-month recurring multiplier-mistake — without it, the prior multiplier: 1 default let the agent skip the choice entirely." Sentinel is the same shape every phase shares; only the subagent roster differs.]* Smaller numbers declare a deeper phase: a multiplier of 0.5 means each action awards half the base points, so more actions are needed to fill the phase-transition point bucket. Larger numbers (2 to 3) award proportionally more per action, so the bucket fills with fewer actions — a faster, surface-level pass.

A pair of point gates paces the read/write rhythm against the working CLAUDE.md. A small direct-action budget grants +3 per plan-subagent dispatch and consumes 1 per direct CLAUDE.md edit outside `.claude/` — the same mechanism that pushes OBSERVE toward delegation, here pushing PLAN the same way. The mechanics mirror OBSERVE; only the subagent roster differs. *[ref: plan-direct-action-budget-grant-and-consume | .claude/plugins/phase_plan/scripts/plan.sh:831 grant-direct-action-budget + :845 consume-direct-action-budget | grant-direct-action-budget adds +3 to the plan-entry's direct_action_budget (default `${2:-3}`) per plan-subagent dispatch and bumps subagent_unlock_grants by 1; consume-direct-action-budget deducts 1 (default `${2:-1}`) per direct CLAUDE.md edit. Both are hook-only system commands, not public CLI.]*

The rest of this essay covers the Stage decision the plan_file records, the plan document's opinionated structure, and the customization surfaces.

The first thing the agent does on entering PLAN — after the multiplier — is decide the job's Stage. That decision is PLAN's to make, in cycle 1: whether this job runs as a single collaborative cycle, or graduates to multi-cycle work carried by a plan document on disk. PLAN records the choice by calling — or pointedly not calling — `set-plan-file`.

---

## Naming the contract

A job's Stage is its classification by plan-file shape, and PLAN decides it in cycle 1 — not at job creation, where every job is born `plan_file = false`. Stage 1 is a single collaborative cycle: PLAN never calls `set-plan-file`, and `plan_file` stays `false`. Stage 2 is repeatable work carried by a prose `.md` plan. Stage 3 is the same work carried by a structured `.yaml`. For Stage 2 or Stage 3, PLAN's first concrete act after the multiplier is to name the plan_file via `plan.sh set-plan-file` — a cycle-1-only call that locks the path for the rest of the job. *[ref: stage-decided-in-cycle-1-plan | CONTEXT.md "Job Stage" section | Stage is decided in cycle 1 PLAN of the new job, NOT at creation. Every pending job is born `plan_file = false` per the Universal starter shape; the cycle 1 PLAN phase's `set-plan-file` call (or non-call) picks the Stage. Stage 1: no call, plan_file stays false. Stage 2: `set-plan-file <name>.md`. Stage 3: `set-plan-file <name>.yaml`.]*

The file's lifecycle splits across phases from there. EXECUTE creates the named document in cycle 1 and writes the initial plan into it. VERIFY refines it across cycles — sharpening acceptance criteria or dropping ones that prove untestable as the work matures. PLAN itself never edits the file directly; from cycle 2 onward it reads the file back at phase entry, treating it as the long-term contract the cycle inherits. *[ref: set-plan-file-cycle-1-immutable | .claude/plugins/phase_plan/scripts/plan.sh set-plan-file case-arm | PLAN's set-plan-file CLI accepts false for single-cycle or a plan_*.md / plan_*.yaml name for multi-cycle; cycle 1 only, dies on re-call, locks the Stage for the rest of the job.]*

There is no state machine walking the plan through named approval stages. The `plan_file` value itself — `false`, an `.md` name, or a `.yaml` name — is all the system tracks about where the plan stands. How a multi-cycle job then knows when its work is *done* — the counting rule over cycles — and how a `.yaml` plan injects itself into every phase entry, are the subject of [Essay 6.10](06_10-plan-state-machine.html). *[ref: plan-file-value-is-only-state-tracked | CONTEXT.md "Plan file lifecycle" section | There is no separate lifecycle-state field on the job; the `plan_file` value (`false`, an `.md` name, or a `.yaml` name) is the entire record of where the plan stands. The lifecycle is governed by the job's cycle counter and the plan's declared cycle count — not by a separate state machine.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/plan-stage-decision-b6-4.png
  Concept: Chalk-on-blackboard diagram — the cycle-1 PLAN Stage decision. A single decision point forks into three Stages depending on whether PLAN calls set-plan-file and with what filename.
  Style: Match `opevc-cycle-blackboard.png` exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the three Stage boxes;
  white chalk for ALL labels, arrows, and branch notes; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other labels or descriptors.
  Layout: A single starting box at the top-center, one decision label below it, and three branches fanning downward to three Stage boxes.
    Top box (dim white border): labeled "cycle 1 PLAN".
    Directly below it, a white-chalk decision label: "set-plan-file?".
    Three white chalk arrows fan downward from the decision label to three boxes in a row:
    Left box (cyan border): labeled "Stage 1", with a smaller line beneath inside the box: "plan_file = false". Its incoming arrow carries the white-chalk note "(no call)".
    Middle box (green border): labeled "Stage 2", with a smaller line beneath inside the box: "plan_file = .md". Its incoming arrow carries the white-chalk note "repeatable".
    Right box (orange border): labeled "Stage 3", with a smaller line beneath inside the box: "plan_file = .yaml". Its incoming arrow carries the white-chalk note "repeatable".
    Below the Stage 1 box, a small white-chalk note: "single cycle".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "cycle 1 PLAN", "set-plan-file?", "Stage 1", "Stage 2", "Stage 3", "plan_file = false", "plan_file = .md", "plan_file = .yaml", "(no call)", "repeatable", "single cycle", plus the caption below. No other words, file names, folders, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.4. PLAN decides the Stage in cycle 1: call set-plan-file, or not."
-->

---

## Inside the plan document

Plan documents live at a known path inside the agent's knowledge directory. Their structure is opinionated. *[ref: plan-documents-live-in-knowledge-plans-dir | .claude/knowledge/plans/ directory | Plan files live at the fixed path `.claude/knowledge/plans/` — the same `.claude/knowledge/` tree PLAN's knowledge-protection block fences against direct writes, and the only place EXECUTE is permitted to create a plan file. Real `.md` and `.yaml` plans sit side-by-side there by basename convention.]*

Each one carries a stated goal, an acceptance-criteria list, the *altered list* — the dirs whose CLAUDE.md the agent edited during OBSERVE or PLAN, each one scoped exactly (no walking up to parents, no descent into nested dirs), [introduced in Essay 5.7](../b5/05_7-claude-md-hierarchy.html) as the mechanism that lets PLAN scope EXECUTE's reach, the structural guardrail that keeps a build from silently widening past the directories the cycle agreed to touch — and an explicit set of judgment-call criteria. The judgment-call criteria are the points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe. *[ref: plan-subagents-encode-structure | .claude/plugins/phase_plan/agents/CLAUDE.md Agent Inventory section | PLAN's specialized subagents (currently six in the prototype) encode the plan-document's opinionated structure: plan-step-breaker decomposes steps, plan-criteria-writer authors acceptance criteria, plan-scope-analyzer maps altered-list directories, plan-risk-assessor names judgment calls.]*

A Stage-2 `.md` and a Stage-3 `.yaml` are different surfaces, not the same artifact wearing different masks. The `.md` is the human-readable accumulating prose; the `.yaml` is the parseable injection target the orchestrator reads at phase entry to pour context-specific content into the working session. *[ref: yaml-injection-cache-populated-at-phase-entry | .claude/plugins/phasic_system/hooks/phase-init.sh write_yaml_cache function | At every phase transition, write_yaml_cache reads the .yaml's current cycle+phase field-map via phase.sh --hook read-yaml and writes it as JSON to YAML_INJECTION_CACHE. voice-helper.sh consumes the cache jq-lookup-per-voice: any voice id matching a yaml key gets its value augmented into the rendered text at fire time — appended (the back-compat default), replaced, or prepended depending on the yaml entry's mode. The yaml is per-cycle-per-phase context dripped into the agent's working voice stream.]* When an `.md` plan has been run enough times to earn the richer structure, a new Stage-3 job can carry the same work forward in `.yaml` form of the same basename — the format graduates, not the job. The `.yaml` job is neither a dependent spawned off the `.md` nor the `.md` job mutating into a new shape; it is a fresh job, inspired by the mature `.md` and identical to it in everything but plan-file format. *[ref: stage-3-is-a-fresh-job-not-a-state-flip | CONTEXT.md "Job Stage" section | Stage 3 (`.yaml` plan) is IDENTICAL to Stage 2 in completion semantics; the ONLY difference is plan-file format. A Stage-3 job is typically inspired by a mature Stage-2 job repeated many times — NOT a state-flip on the Stage-2 job itself, and NOT a dependent spawned off its `.md`. The plan format graduates to a parseable shape; the job that carries it is a separate job.]*

Both files carry a small identification frontmatter at the top — a `job:` line and a `plan_file:` line — declaring which job they belong to and nothing more. There is no separate lifecycle-state field on the job: the `plan_file` value (`false`, an `.md`, or a `.yaml`) is all the system tracks about the plan, read straight off the job object in `data.json` alongside the cycle counter that decides when the work is done. The files are the artifacts; the field is the pointer. *[ref: yaml-identification-frontmatter | .claude/knowledge/plans/plan_phasic_and_phase_plugins_coverage.yaml:1,3 | The identification frontmatter at the top of a real .yaml plan file: line 1 `job: <id>`, line 3 `plan_file: <name>.md` (with line 2 `job_name:` between them). Every plan file carries this convention.]*

---

## The contract handoff

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE. This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check. *[ref: altered-list-frozen-at-execute-entry | .claude/plugins/phase_execute/hooks/execute-sensor.sh:158-172 | execute-sensor.sh merges OBSERVE and PLAN altered lists at execute entry, then calls execute.sh set-altered-list to snapshot the merged scope into execute's data.json — the freeze that fences EXECUTE to PLAN's contract.]*

If EXECUTE wants to touch a file the plan didn't list, the request is blocked. *[ref: execute-altered-list-exact-match-block | .claude/plugins/phase_execute/hooks/execute-guard.sh:826-902 altered-list scope check | execute-guard reads the merged altered-list (observe + plan altered_claude_md snapshots) at every Edit/Write, normalizes the file path against project root, then runs grep -qxF for exact match. Any CLAUDE.md not in the list triggers "BLOCKED: This CLAUDE.md is not in altered list." Walking up to a parent CLAUDE.md to silently expand scope is what the exact-match check prevents.]* The agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

---

## Same gate, same forecast

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate. *[ref: plan-set-multiplier-validates-range | .claude/plugins/phase_plan/scripts/plan.sh:309-325 | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if the entry already has points (preventing reset), then writes the immutable value to data.json.]*

## What PLAN cannot do

The discipline of PLAN is in what its guard refuses. PLAN's Read tool is *not* unrestricted — the same hook that lets OBSERVE freely (within budget) walk the project source blocks PLAN from opening any file outside `.claude/`. The agent can read CLAUDE.md files, memory files, and exactly one project artifact: the focused job's own plan file. Every other path is rejected at the tool boundary. *[ref: plan-read-restriction-claude-md-only | .claude/plugins/phase_plan/hooks/plan-guard.sh:294-307 | The Read branch allows CLAUDE.md, memory files under `.claude/projects/.../memory/`, and the named plan_file from the focused job; every other path falls through to a tool-restriction block. The structural rule: PLAN cannot self-observe.]*

The rule is intentional. PLAN that can re-read project source mid-plan is no longer planning; it is doing piecemeal observation, drifting back into context-gathering with no commit, no synthesis-into-CLAUDE.md, no accountability for the decision-making the phase exists to do. If PLAN realizes it needs more context, the only honest move is backward to OBSERVE — explicit, committed, recorded in cycle history. *[ref: plan-backward-to-observe-is-the-honest-move | .claude/plugins/phasic_system/scripts/phase.sh:137 BACKWARD_MAP | BACKWARD_MAP declares `plan:observe` as a permitted backward transition — PLAN can return to OBSERVE when it needs more context. The move is explicit and committed through a backward force-commit, not a silent re-read: the Read restriction routes the agent through the recorded transition rather than letting it quietly re-observe inside PLAN.]* The fence is what keeps the phase boundary load-bearing.

Bash falls the same way. Read-only git inspections pass — `git log`, `git diff`, `git show` — but any write-shaped command is blocked, and the only `job_core` operations admitted are read-only `show`, `focused`, `list`. PLAN reads the world it inherited from OBSERVE; it does not extend it. *[ref: plan-bash-narrow-allowlist-git-readonly | .claude/plugins/phase_plan/hooks/plan-guard.sh:314-344 Bash case-arm | The Bash branch allows git log|blame|diff|show|shortlog|rev-parse|status|branch as read-only inspection, plus job.sh show|focused|list and a handful of phase-progress scripts (plan-commit.sh, phase.sh current); everything else falls through to "tool-restriction-git-write" or "tool-restriction-bash" blocks.]*

## A worked example

The multi-cycle plan-job from the previous essay enters its third cycle's PLAN phase. The orchestrator has already injected the .yaml at phase entry, OBSERVE has handed forward a synthesis that flagged the marker-schema contradiction from cycle 2, and the architect's `[WAITING]` answer routed the work toward "revert cycle 2's code and re-author the .yaml entry." *[ref: waiting-routes-to-architect-not-cycle-stop | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh PREFIX_REGISTRY [WAITING] entry | The [WAITING] prefix is registered in question-discipline-gate.sh's PREFIX_REGISTRY readonly array. An AskUserQuestion with [WAITING] routes the question to the architect for steering rather than tripping the cycle-stop hook — the agent pauses, then resumes with the answer in hand.]*

The agent picks the multiplier — toward the higher end of the range, a tighter phase than OBSERVE because the decisions are narrower. The lock lifts. The agent re-reads the `.yaml` plan file (allowed — it is this job's focused plan_file), re-reads the OBSERVE synthesis in the working CLAUDE.md, and walks the cycle-2 entry in that plan side-by-side.

PLAN's deliverable is decisions inside CLAUDE.md, written below `---Pl---`: the *altered list* gets one new directory added — the public seed repo's marker schema directory — declaring it editable by EXECUTE. The acceptance criteria gain a clause: "cycle-3 .yaml entry passes the new marker schema round-trip." A judgment-call criterion is named explicitly — "if revert breaks downstream cycle-2 work, EXECUTE pauses and routes a `[PENDING-JOB]` for CONDENSE." *[ref: pending-job-marker-consumed-by-condense-step3 | .claude/plugins/phase_condense/agents/condense-job-creator.md + .claude/plugins/phase_condense/hooks/voice.xml waterfall-step-3-pending-jobs | CONDENSE step 3 of the 7-step waterfall greps every altered CLAUDE.md's ---Ex--- / ---Ve--- footers for [PENDING-JOB] markers and dispatches condense-job-creator. The subagent calls job.sh create-dependent to file each out-of-scope item as a follow-up job before knowledge routing runs.]*

PLAN does not touch the plan file. It does not write to the public seed repo. It writes the new acceptance criteria into CLAUDE.md, names the altered-list expansion, and commits. EXECUTE inherits a fully scoped contract. *[ref: plan-write-output-is-claude-md-only | .claude/plugins/phase_plan/hooks/plan-guard.sh:287-288 knowledge-protection + Edit|Write branch L234-291 | In the worked example PLAN's only writes are CLAUDE.md edits: the knowledge-protection block stops PLAN touching the plan file, and the non-CLAUDE.md block (L291) stops it writing the public seed repo or any project source. PLAN's deliverable is CLAUDE.md decisions plus the commit — nothing more.]*

## What you would customize

Two surfaces are where most architects will adjust PLAN.

The first is the *plan-document structure*. The prototype's plan documents are opinionated — goal, acceptance criteria, altered list, judgment-call criteria — encoded in the plan-* subagent roster (currently six in the prototype). A seed working on long research engagements might want hypotheses-and-evidence as the primary structure. A seed operating in regulatory contexts might want a compliance-checklist section as a first-class block. The subagent roster is the surface; the structure they enforce is yours. *[ref: plan-subagent-roster-as-customization-surface | .claude/plugins/phase_plan/agents/ directory listing | The prototype's plan subagents currently ship as plan-context-evaluator, plan-criteria-writer, plan-dependency-checker, plan-risk-assessor, plan-scope-analyzer, plan-step-breaker — each one owns a slice of the plan-document structure. Adding a new section type to your seed's plans means adding a peer subagent that authors it.]*

The second is the *altered-list discipline*. The current rule is binary — a directory is in the list or it is not; if it is, EXECUTE can edit any CLAUDE.md-declared directory within it. Your seed might want a finer-grained scope: read-allowed but write-disallowed; write-allowed but only for files matching a pattern; per-subagent overrides. The altered list is the load-bearing contract output of PLAN, and every refinement of it tightens what EXECUTE can do without rolling backward. *[ref: altered-list-binary-in-or-out | .claude/plugins/phase_execute/hooks/execute-guard.sh:826-902 altered-list scope check | EXECUTE's guard runs `grep -qxF` for an exact match of the file's directory against the merged altered list — a binary in-or-out test with no partial or pattern-based scoping. Finer-grained rules (write-disallowed-but-readable, pattern-matched files, per-subagent overrides) are not implemented; the exact-match check is what the prototype ships.]*

The PLAN-as-binding-contract pattern lifts off the prototype into any work where scope creep is the slow killer. A consulting practice cultivating a delivery-engagement seed could use the same discipline for client work: an engagement-scoping associate runs the seed through a cycle-1 PLAN that names the engagement plan file via `set-plan-file`, the plan file carries the contract across cycles as the team negotiates with the client, the altered list scopes which deliverables the next cycle is allowed to draft. Mid-engagement scope creep then requires an explicit backward step — PLAN re-opens, the altered list grows, the contract changes on the record — not a silent edit in someone's inbox.

The honest limit is that the contract-lock is friction, not mathematical enforcement: voice injections, the cycle-1 immutability ceremony, the counter on plan-file edits. *[ref: inc-plan-file-read-counter-tracks-recall | .claude/plugins/phase_plan/scripts/plan.sh:638-648 inc-plan-file-read + L650-657 plan-file-reads | The counter is per-plan-entry; plan-tracker.sh increments on PostToolUse:Read of the focused job's plan_file path. plan-commit.sh's cycle-2+ force-advance check blocks until the counter is at least 1, so the agent cannot advance without recalling the plan file at least once per cycle.]*

A determined operator can still edit the .md outside VERIFY through [gmode](06_9-gmode.html), the named off-cycle lane detailed in Essay 6.9, and pay the deliberate-bypass tax of composing the justification. *[ref: gmode-justification-floor-deliberate-bypass-tax | .claude/plugins/phasic_system/hooks/gmode-gate.sh:79 word-count check + [GMODE] in PREFIX_REGISTRY | gmode-gate.sh enforces GMODE_WORD_MIN (default 100) on the [GMODE] question body; less than the floor blocks with the deficit count surfaced as "need N more." The justification cost is the friction that makes the bypass deliberate — the gate measures word count, not intent.]* The mechanism slows the agent enough that the operator can intervene; it does not make the edit physically impossible.

The one boundary worth keeping is the prohibition against PLAN reading project source. The read-fence can be widened like any guard — but a planning phase that re-observes project source has stopped planning. That line is definitional, not a dial the architect should reach for.

The deepest payoff of PLAN is the cognitive failure mode it prevents: the post-hoc rationalization. Plans written *during* execution are not plans; they are explanations the executor gives itself for whatever it just did. By forcing the contract to be authored before any code is touched — and by refusing the agent the tools to re-observe halfway through — the seed agent forecloses that drift structurally. The plan can be wrong; that is what VERIFY is for, and what backward transitions are for. What it cannot be is silently rewritten.

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

*Essay 6.4 — The Markov Phasic Brain, Part 4 of 10.*

*Previous: [Essay 6.3 — OBSERVE — Read Wide, Write Once](06_3-observe.html) — project-read-only synthesis, multiplier sentinel, paired gates.*
*Next: [Essay 6.5 — EXECUTE — Build, in Scope, in Steps](06_5-execute.html) — the universal file-creator, fenced to the altered list.*




