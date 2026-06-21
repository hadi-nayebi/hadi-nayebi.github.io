---
title: "The Phase Map — A Tour Before the Deep-Dives"
date: "May 2026"
slug: "the-phase-map"
read_time: "5 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: draft
version: v0.1.0
audience: "Tier 2/3"
og_image: "blog/b6/images/markov-phasic-brain-b6.png"
---

# The Phase Map — A Tour Before the Deep-Dives

*Essay 6.2b — The Markov Phasic Brain, Part 3 of 13.*

---

[Essay 6.2](06_2-discipline-and-map.html) drew the full transition map and named the tool-restriction discipline that makes each phase distinct — the rules of the cycle. Before we open each compartment one at a time, here is the whole set at a glance. Each line below names the phase, its essence, and what it is on the hook to produce — a quick tour to hold in your head before the per-phase deep-dives begin, starting with OBSERVE in the next essay.

---

## The Phases at a Glance

**IDLE** — the meta-state between cycles. Lifecycle management only — a narrow allowlist opens, and everything else stays shut. *[ref: idle-as-meta-state-between-cycles | .claude/plugins/phasic_system/hooks/phase-gate.sh IDLE case-arm + .claude/plugins/job_core/hooks/prompt-handler.sh active-job-zero branch | IDLE's guard blocks Edit/Write outside memory paths, blocks Reads, narrows Bash to a small named-script allowlist, and blocks WebSearch/WebFetch. Top-level jobs are auto-created by prompt-handler.sh — when the active-job count is zero, the user's prompt itself invokes job.sh --hook create-active and then phase.sh --hook init to lock the new job into IDLE. The agent never calls job.sh create directly.]*
- Unlock the job-management CLI — the lifecycle surface (`show`, `focused`, `list`, `update`, `activate`, `focus`, `pause`, `complete`, `approve`). Creation and graph mutations live elsewhere.
- Unlock the phase CLI (`advance`, `current`, `cycle`, `exit-gmode`) — agent-callable `advance` only goes idle → observe
- Keep the always-on infrastructure running: memory-file edits, plus a small named-script allowlist on the IDLE Bash gate — `interaction_summary/scripts/summary.sh` for cross-conversation summaries, `brain_guard/scripts/self-compact.sh` for context-window compaction, and `plugin_integrity/scripts/lock-cmd.sh` for the universal active-lock close-out. Every other shell command exits blocked. *[ref: idle-bash-allowlist-named-scripts | .claude/plugins/phasic_system/hooks/phase-gate.sh:82-104 | IDLE's Bash whitelist is enumerated explicitly: summary.sh, self-compact.sh, lock-cmd.sh, phase.sh restricted to (advance|current|cycle|exit-gmode), job.sh restricted to (show|focused|list|update|activate|focus|pause|complete|approve). Default-block on everything else.]*
- Block reads, project edits, CLAUDE.md edits, web access, general shell
- *Job creation happens automatically: top-level via `prompt-handler.sh` (the user's prompt itself creates the job when none is focused); dependent jobs via CONDENSE step 3 consuming `[PENDING-JOB]` markers. The agent does not call `job.sh create` itself.*

**OBSERVE** — gather context before any plan can form. *[ref: observe-cycle-1-expands-objective | .claude/context/job-completion-reactivation.md "Objective expansion" section + "Job Stage" section | Objective expansion is OBSERVE's cycle-1 custom force-advance gate: it grows the job's initial objective into a fuller statement as the agent loads context. The Stage itself is decided in cycle-1 PLAN (an explicit `set-plan-file` call — `false` for a single-cycle Stage-1 job, a `.md` or `.yaml` name for the multi-cycle Stages), NOT in OBSERVE — OBSERVE feeds the decision with context; PLAN makes it.]*
- On cycle 1, expand the job's objective from its short creation stub into a full statement of intent — OBSERVE's distinctive cycle-1 work; the Stage decision (the `set-plan-file` call PLAN must make) comes next, in PLAN
- Populate the working-memory CLAUDE.md files with relevant context
- Dispatch parallel research subagents and synthesize their returns
- Refuse code edits — the only allowed write target is CLAUDE.md
- Cross the exit threshold only after enough investigation has happened

**PLAN** — turn observations into a binding contract. *[ref: plan-names-file-claude-md-only | .claude/plugins/phase_plan/scripts/plan.sh:335-385 set-plan-file + .claude/plugins/phase_plan/hooks/plan-guard.sh "Edit|Write" case-arm | The public set-plan-file subcommand accepts false (single-cycle) or plan_<name>.md|.yaml (multi-cycle), records the plan_file value atomically into data.json, and rejects any second call ("Plan file already set"). The plan-guard's Edit|Write case-arm only allows CLAUDE.md writes (with section enforcement to ---Pl---) and blocks every other project path — PLAN cannot author the plan file it just named; EXECUTE creates the draft.]*
- Record the Stage decision in cycle 1 via an explicit `set-plan-file` call — `false` for a single-cycle job, a `.md`/`.yaml` name for a multi-cycle one; PLAN itself never writes the plan file — EXECUTE creates it
- Declare the *altered list* — the set of dirs whose CLAUDE.md the agent edited during OBSERVE or PLAN; EXECUTE will be allowed to write project files inside each of those dirs exactly (no ancestor or nested dirs)
- Write acceptance criteria VERIFY will check against
- Refuse code edits — the contract is what gets written, not the work

**EXECUTE** — build what the plan declared, in checkpoints. *[ref: execute-creates-plan-file-cycle-1 | .claude/plugins/phase_execute/hooks/execute-guard.sh:740-764 | EXECUTE's "Plan File: Create (Cycle 1 Only) — Then Blocked Forever" block enforces a triple-check before allowing the plan-file Write: scope (target path must equal the focused job's declared plan_file), cycle (current_cycle must equal 1), and existence (Write only, file must not yet exist). After cycle 1 EXECUTE cannot read or touch the file again — PLAN owns reading on cycle 2+; VERIFY owns editing.]*
- Edit project files, but only inside the altered list — the merged set of CLAUDE.md files OBSERVE and PLAN together declared, frozen at execute entry
- Materialize every artifact the seed agent produces — code, the `.md` plan in cycle 1 of a Stage-2 job, the `.yaml` plan in cycle 1 of a Stage-3 job, anything else with a path; EXECUTE is the universal file-creator
- Favor small, focused checkpoint commits over one long uncommitted run; the intermediate-commit mode keeps checkpoints cheap, so the pattern costs nothing
- Capture *execution notes* in the working CLAUDE.md so the cycle stays narratable
- Delegate file work to execute subagents (sequential by default, a small in-flight ceiling); keep the main session on the spine

**VERIFY** — judge prior work with independent eyes. *[ref: verify-refines-plan-forces-backward | .claude/plugins/phase_verify/hooks/verify-guard.sh Edit|Write|MultiEdit case-arm "Plan files" section (plan-file write allowed + block-forward-on-edit) + Bash case-arm "VERIFY owns the two removal commands" (remove-dependency|void-dependency allowlist + explicit BLOCK on create|create-dependent|add-dependency) + .claude/context/opevc-phases.md "Plan-verify backward loop" section | The verify-guard's Edit|Write case-arm allows writes to the focused job's declared plan_file (.md or .yaml) and blocks every other /knowledge/ path with `verify.guard.knowledge`. Editing the plan file blocks forward-advance — the agent commits --backward plan and PLAN re-cognizes; VERIFY has no approval or seal step (completion is CONDENSE's). The Bash case-arm whitelists job.sh remove-dependency AND void-dependency (the two VERIFY-owned removal moves — the lifecycle-symmetry partner to CONDENSE's add-dependency) and blocks create/create-dependent/add-dependency, steering those to a [PENDING-JOB] marker for CONDENSE step 3.]*
- Run scripts and validators; refuse all code edits in this phase
- Dispatch auditor subagents to read the executed work without bias
- Write pass/fail results into CLAUDE.md and the plan file
- Refine the focused job's plan file (`.md` or `.yaml`) — but editing it blocks forward-advance and forces a backward step to PLAN; the plan is refined in place and persists, nothing is approved or sealed
- Hand completion to CONDENSE — VERIFY has no job-completion authority; `[JOB-COMPLETE]` is a CONDENSE-only ceremony, a phase away
- Review the focused job's open dependencies and, when the audit reveals one is no longer needed, either unlink it but keep the work (`job.sh remove-dependency` — the child survives as standalone work) or unlink and abandon it (`job.sh void-dependency` — the child is marked `voided`, a terminal-abandon state) — the lifecycle-symmetry partner of CONDENSE's `add-dependency`
- Route the cycle forward to CONDENSE, or backward to whichever prior phase the failure points at

**CONDENSE** — consolidate the cycle's learnings into the brain. *[ref: condense-7-step-waterfall-owns-job-creation | .claude/plugins/phase_condense/hooks/condense-guard.sh Bash case-arm | The condense-guard's Bash case-arm whitelists job.sh add-dependency alongside show/focused/list/complete/update (the condense-specific lifecycle operations), and allows job.sh create / create-dependent unconditionally — CONDENSE is lock-forward and owns the additive job-graph mutations. Leftover in-scope work rides the cycle's carry-over headroom or an --add-cycle extension, never a backward step. CONDENSE is the only phase with cycle-wide context for graph mutations — VERIFY can remove dependencies, but additions belong here.]*
- Walk a strict staged waterfall that routes content to its durable home
- Consume marker types the prior phases dropped into footers
- Compress the working CLAUDE.md back to a clean state
- Own all job creation (`create`, `create-dependent`) and dependency additions (`add-dependency`) — the phase with the right cycle-wide context for graph mutations
- Lock forward to idle; no escape hatch back to verify

**GMODE** — the freestyle side-channel from any phase. *[ref: gmode-as-off-cycle-lane | .claude/plugins/phasic_system/hooks/gmode-gate.sh word-count gate + .claude/plugins/phasic_system/hooks/gmode-hook.sh enter-gmode dispatch + .claude/plugins/phasic_system/config.conf GMODE_WORD_MIN | The gmode-gate validates the [GMODE] question shape: prefix anchor at start of question, non-empty reason, and word count ≥ GMODE_WORD_MIN (default 100, range 50-200, set in config.conf). On the user's "Enter gmode" answer the gmode-hook calls phase.sh --hook enter-gmode, which stashes the prior phase as pre_gmode_phase. Every phase guard self-exits when current_phase != its own phase — in gmode the equality fails for all five, so none enforce.]*
- Enter via a `[GMODE]` user question with a substantive reason (currently a roughly 100-word floor in the prototype)
- Run unconstrained work — no OPEVC tool-restriction guards apply
- Exit explicitly with a clean git tree; the home phase resumes atomically
- Host work that doesn't fit the OPEVC ceremony — deadlock fixes, plugin maintenance, custom workflows

That is the operational shape — and every edge, every locked tool, every gated boundary exists for one payoff: the agent can no longer skip the thinking a phase was built to force. The rest of this essay series opens each compartment one at a time to show exactly how that discipline does its work.

---

## What you would customize

The discipline is the architecture; the specific edges and the specific allow-lists are this prototype's calibration. Several surfaces are open to the next architect.

The architect would tune the *backward map*. The prototype lets verify roll back to several destinations — execute, plan, or observe — picked by the failure shape. A seed that runs short, surgical cycles might collapse the menu to one (always observe; let the next cycle re-plan from scratch). A seed running long structural sweeps might widen the menu to include condense for re-routing learnings without re-executing. *[ref: verify-backward-three-destinations | .claude/plugins/phasic_system/scripts/phase.sh BACKWARD_MAP | BACKWARD_MAP declares `verify:execute`, `verify:plan`, `verify:observe` — the three destinations the body names. Architects tuning the backward map edit this associative-array literal: collapse the trio to a single entry for surgical seeds; add `verify:condense` to admit re-routing learnings without re-execution. The map is plain data, not branching code.]*

The architect would tune the *gmode usage policy*. Gmode is the freestyle escape hatch; the prototype reserved it for plugin maintenance because the prototype was building the seed agent itself. A user-facing seed might keep almost all work inside OPEVC and never enter gmode. A research-heavy seed might push routine literature scans through gmode rather than inflating every cycle's observe phase. *[ref: gmode-policy-tunable-not-code-fixed | .claude/plugins/phasic_system/hooks/gmode-gate.sh + .claude/plugins/phasic_system/hooks/gmode-hook.sh + .claude/plugins/phasic_system/scripts/phase.sh enter-gmode handler | gmode-gate.sh enforces format + word-count gates on `[GMODE]` prefix only (no subject-matter check); gmode-hook.sh dispatches the answer; phase.sh enter-gmode handler stashes `pre_gmode_phase` and writes `current_phase: gmode`. The architect chooses what counts as legitimate gmode work by what they write into the justification — code permits any reason that clears the word floor, so policy is editorial discipline.]*

The architect would tune the *per-phase tool allow-lists*. The current cuts — read-only in observe and plan, scripts-only in verify, full-write-inside-scope in execute, brain-only in condense — encode this prototype's notion of cognitive separation. A seed wanting a stricter observe could ban the web entirely. A seed wanting a looser verify could allow targeted code edits inside named directories. The guards are code; the cuts are decisions. *[ref: per-phase-allow-lists-edit-the-case-arms | .claude/plugins/phase_observe/hooks/observe-guard.sh + .claude/plugins/phase_plan/hooks/plan-guard.sh + .claude/plugins/phase_execute/hooks/execute-guard.sh + .claude/plugins/phase_verify/hooks/verify-guard.sh + .claude/plugins/phase_condense/hooks/condense-guard.sh | Each phase guard's Edit|Write|MultiEdit case-arm IS the per-phase allow-list as code: change the bash regex or the allow/block branches and the cut moves. The prototype's specific cuts (CLAUDE.md-only read-write phases / scripts-only verify / altered-list execute / .md+voice.xml condense) are five editable bash files, one per phase plugin — not hardcoded constants buried in the orchestrator.]*

The architect would tune the *metacog menu* — how much reflection each phase owes before it may advance. The exit gate asks for a minimum number of reflection ops per phase, and that minimum is a dial, not a constant. A seed running fast, low-stakes work might require a single reflection op at each boundary. A seed doing careful, high-consequence work might demand several — a first-principles pass in OBSERVE, a second-order-effects pass in PLAN, an inversion check before building. A consulting practice could require a premortem lens before any client deliverable enters its build phase — the gate ensures the plan was stress-tested before a single hour is billed. The reflection lenses themselves come in two tiers: a small core that every phase must run, plus richer mental-model lenses the architect can switch on phase by phase. The knob decides how much of the agent's compute goes to *examining* the work versus *doing* it. *[ref: metacog-menu-knob | .claude/context/opevc-metacog.md "Metacognition commands" (two tiers, variable minimum) | Two tiers, kept separate (option B, the biochemical pattern): the 2 CORE ops are a constitutive baseline — always-on, mandatory in every phase, NOT subject to the variable draw and never counted toward it (phase-quality self-assessment + voice-update-candidate scan). The variable minimum sits ON TOP, drawn from the NUANCED mental-model lenses (first-principles in OBSERVE, second-order effects in PLAN, inversion, etc.) — its count drawn from a set per phase entry via the same random-from-pool selector the coaching voices use, so the regulated friction varies and cannot be gamed to a constant. Advancing requires the constitutive floor (CORE ran) PLUS the regulated minimum (≥ the drawn count of nuanced reflections). The knob that tunes how much compute goes to optimizing the work vs doing it.]*

What the architect would **not** customize is the rule that each phase publishes its allow-list and the guard enforces it against every tool call. The principle is the floor: a phase whose restrictions are advisory is not a phase. *[ref: per-phase-guard-is-the-architectural-floor | .claude/plugins/phasic_system/hooks/phase-gate.sh + per-phase guards all registered as PreToolUse hooks in .claude/settings.local.json | The phase-gate hook + five per-phase guards are PreToolUse hooks — they fire BEFORE each tool call regardless of agent intent. The architecture mandates the guard layer; what each guard's case-arm allows is the architect's call (per the prior paragraph), but THAT each phase has a guard publishing its restrictions is the floor that defines "phase" in this prototype.]*

The shape lifts off the prototype into work that has nothing to do with seed agents. A patent attorney shaping a prior-art-review seed could compartment the work into `pull-references`, `extract-claim`, `cross-check`, and `draft-opinion` phases — each with its own tool fence, each with its own write scope — and the transition map would refuse a `draft-opinion → pull-references` slide that smuggles unverified prior art into the brief.

The discipline here is friction, not mathematical enforcement: every guard depends on the agent reading and obeying the injected voice, and the slow-downs (the rhythm gates, the commit shapes, the substantive-reason floor) buy the operator the time to intervene before a bypass admits. [Gmode](06_9-gmode.html) is the documented escape hatch — the seed agent can route around the OPEVC ceremony when the work genuinely needs it, and the cost is the long-form justification that surfaces the bypass to the operator.

---

You now have the whole map in your head: seven states, each with its essence and its output, and the customization knobs that let a different architect re-cut them. The rest of the series opens each compartment one at a time. The next essay opens the first one — OBSERVE, the read-wide-write-once entry phase that decides what the rest of the cycle will work on.

---

*Essay 6.2b — The Markov Phasic Brain, Part 3 of 13.*

*Previous: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition map and the tool-restriction discipline that makes each phase distinct.*
*Next: [Essay 6.3 — OBSERVE — Read Wide, Write Once](06_3-observe.html) — the entry phase, its wide sources, and the read-before-write rhythm.*
