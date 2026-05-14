---
title: "The Markov Phasic Brain"
date: "May 2026"
slug: "the-markov-phasic-brain"
read_time: "40 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, CONDENSE]
status: drafting
version: v0.26.1
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# The Markov Phasic Brain

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

---

Now we open the cycle.

[Essay 5](05-the-always-on-digital-cortex.html) introduced two pieces of the seed agent's foundation, side by side. The **always-on plugins** are the agent's reflexes — each one owns a concern that fires regardless of which phase the agent is in or whether a phase is even active: plugin edit safety, context window discipline, job lifecycle, interaction legibility, structured questioning. They run continuously, each in its own lane, with its own state. The **CLAUDE.md layer** is the substrate the agent's structured cognitive work writes into — a hierarchy of CLAUDE.md files, a knowledge directory, a memory layer that survives across phases and sessions. *[ref: always-on-fires-no-phase-guard | settings.json.template:17-47 | The PreToolUse block registers plugin_integrity and job_core hooks on tool matchers with no phase filtering; phasic_system's phase-gate registers alongside them, plumbing phase enforcement separately.]*

This essay is about the system that does the structured work — the phasic system — and how it uses the CLAUDE.md layer to think ahead, gather experiential data, and process that data into the agent's longer-term memory forms.

The seed agent's cognitive work happens in **phases**. A phase is a temporary mode of operation, scoped to one job, with a strictly defined purpose, a strictly defined set of allowed tools, and a strictly defined kind of output. One phase is active at a time. Phases progress in a fixed order. The agent cannot skip a phase, cannot blend two phases, cannot stay inside a phase indefinitely. *[ref: phase-order-fixed-by-map | phasic_system/scripts/phase.sh:133-136 | FORWARD_MAP and BACKWARD_MAP define the only allowed phase transitions; arbitrary jumps and blended states are absent from the schema and rejected downstream by the advance command.]*

The current prototype runs five phases: *observe, plan, execute, verify, and condense*. OPEVC is the acronym, the name the brain calls its own cycle. The fifth phase, CONDENSE, plays a different role from the other four. The first four do work *on the project*; CONDENSE does work *on the brain*. We call CONDENSE the cycle's cognitive organ for that reason. Still, it is one of the five phases, not a sixth thing. The architecture supports adding more. A custom seed could introduce a `research` phase between observe and plan, or split execute into `execute` and `integrate`. The five-phase shape is the prototype. The discipline of compartmentalized phasing is the architecture. *[ref: condense-blocks-project-file-writes | phase_condense/hooks/condense-guard.sh:243-275 | CONDENSE's guard restricts Edit/Write/MultiEdit to .md files and voice.xml; any other path is blocked with condense.guard.project-edit. Memory files are always allowed; project files cannot pass.]*

Two states travelled with us across the previous essay without being named: *idle* and *gmode*. We left them out of Essay 5 to keep the substrate description clean. They come back now, because the full Markov brain does not run without them. *[ref: idle-is-default-current-phase | phasic_system/scripts/phase.sh:155-161 | Job initialization writes current_phase: idle into the orchestrator's data.json; idle is the resting state between cycles. Gmode is the other off-cycle state — handlers further down the same file treat it as a peer current_phase value.]*

What we are about to open is what [Essay 3.1](03_1-the-folder-is-alive.html) called the agent's *cognitive metabolism* — the rhythm of breathing in context, working on it, breathing out memory. The phasic layer is that metabolism made mechanical. *[ref: condense-advances-back-to-idle | phase_condense/scripts/condense-commit.sh:264 | After CONDENSE commits the cycle, the script calls `phase.sh --hook advance` (L264) which moves current_phase from condense back to idle — the exhale that closes the metabolism loop and lets the next cycle begin. The script's --force mode is the only path that fires this advance; intermediate mode stays in CONDENSE.]*

This essay opens that discipline compartment by compartment.

---

## From Action Space to Markov Brain

In [Essay 1](01-llms-are-not-the-agents.html) we drew the seed agent's starting condition as an **action space** — the set of moves a CLI agent can pick at any given moment. Use deep reasoning. Use tools — read, write, edit, run. Ask for permission. Delegate to another agent. Stop. Each step the LLM samples from those moves probabilistically. The next step samples again. The result, without further structure, is what that essay called a **random walk** — a Markov chain where every path is equally likely, and the same prompt twice can produce two different journeys. *[ref: action-space-tool-filter | phasic_system/hooks/phase-gate.sh:45-48 | The orchestrator's tool filter enumerates the seed agent's intercepted action space: Edit, Write, MultiEdit, Read, Glob, Grep, Bash, WebSearch, WebFetch. Other tools pass through unguarded.]*

Then we added the first layer of structure: hooks. Hooks fire on every tool call, every stop, every prompt. They can block an action, modify it, or trigger another. In Essay 1's framing, hooks turn the **probabilistic chain into a deterministic pipeline**. The LLM still proposes the next move; the hooks decide whether the move is allowed. *[ref: hooks-block-via-exit-two | phasic_system/hooks/phase-gate.sh:68-71 | phase-gate intercepts Read/Glob/Grep tool calls during idle, emits a stderr message, and exits with code 2 — the canonical block pattern that converts a proposed move into a refusal.]*

The phasic layer takes that idea one fractal step further.

A phase is a flavor of the action space. Inside OBSERVE, the action space is narrowed — write tools to project files are gone, only the read-and-synthesize moves are available. Inside EXECUTE, the action space widens for the altered list and tightens elsewhere. Each phase is a *customized Markov chain* — its own restricted action space, its own hook-enforced rules, its own bias toward the kind of move that phase wants to encourage. *[ref: observe-blocks-non-claude-writes | phase_observe/hooks/observe-guard.sh:274-324 | OBSERVE's Edit|Write case arm allows memory and CLAUDE.md edits with conditions but blocks every other path with tool-restriction-non-claude — the asymmetric write scope that narrows OBSERVE's action space to synthesis only.]*

The cycle on top is itself a Markov chain — but its "actions" are not individual tool calls. Its actions are the phases. The agent moves between phases. Each move from one phase to the next obeys gates and edges declared by the orchestrator plugin. **A Markov brain whose moves are themselves Markov chains.** Fractal, by design. *[ref: phase-transition-points-gate | phase_verify/scripts/verify-commit.sh:150-157 | Each phase commit script gates the forward edge on a point threshold (VERIFY requires ≥100 PHASE_TRANSITION_POINTS); falling short emits a block voice and exits without calling phase.sh advance.]*

This is what the title points at. The phasic brain is Markov on two levels. Inside any phase, the agent's tool calls are a constrained action-space chain. Across the cycle, the phases themselves are a state machine with declared edges and no hidden continuation.

![The OPEVC cycle. Forward edges (white) advance automatically. Backward edges (brown) are explicit choices. Idle holds the agent between cycles; condense returns to idle.](../assets/images/blog/opevc-cycle-blackboard.png)

---

## Why Phases

The naive version of agent cognition is: "read the prompt, do the thing." A user asks for a feature; the agent goes off and implements it. Whatever observation, planning, building, and checking happens, happens in one undifferentiated stream of tool calls.

This breaks for the same reason a one-line safety script breaks. There are several different *kinds* of cognitive work, each with different needs, and mixing them produces sloppy work in all of them.

Observation needs breadth. Planning needs alternatives. Execution needs speed. Verification needs independence from execution. Each one favors a different mental posture, and each one favors a different set of tools. The default agent runs all four kinds of work through the same mode, and the result is what every operator who has tried to drive an agent through a non-trivial task has seen: the agent jumps to implementation before it has read enough; it improvises mid-execute and rationalizes the improvisation as the plan; it self-verifies, sees the work as correct because it was the one who built it, and ships a regression. *[ref: per-phase-tool-allowances-table | phasic_system/CLAUDE.md:254-260 | Side-by-side table of each phase's distinct concerns: OBSERVE checks CLAUDE.md-only edits; PLAN forbids bash/web; EXECUTE allows altered-dir writes; VERIFY allows scripts and plan-file edits; CONDENSE writes .md only.]*

Phases force separation. The kind of cognition the agent is doing is announced. The tools it has access to match the kind. The output it produces is tagged with which phase it came from. When the agent transitions, the system commits the prior phase's work as an episodic memory before unlocking the next phase. There is no quietly drifting from one mode into another. *[ref: commit-precedes-phase-advance | phase_observe/scripts/observe-commit.sh:279-288 | Records each phase's work as a git commit with phase prefix and footer; on commit failure exits 1, blocking the downstream phase.sh advance that would otherwise unlock the next phase.]*

The mechanism is mechanical. The justification is cognitive: separated kinds of thinking produce better thinking.

That justification is the load-bearing claim of the phasic layer.

---

## The Full Transition Map

The rim of the cycle has more edges than Essay 5 needed to show. Here is the complete map the orchestrator enforces.

**Forward edges** fire automatically when the phase-commit script's gate passes: *[ref: plan-gate-passes-before-advance | phase_plan/scripts/plan-commit.sh:124-131 | PLAN's commit script gates the forward edge identically to every other phase: under --force mode it checks total_points against PHASE_TRANSITION_POINTS (default 100) and blocks-then-exits on insufficient; same pattern repeats in every phase commit script.]*

- `idle → observe` (start a new cycle)
- `observe → plan`
- `plan → execute`
- `execute → verify`
- `verify → condense`
- `condense → idle` (close the cycle)

**Backward edges** are explicit — the agent chooses where to roll back to: *[ref: agent-picks-backward-destination | phasic_system/scripts/phase.sh:304-310 | The back command accepts an explicit destination from the caller; the system validates the choice against BACKWARD_MAP and dies if the edge is not declared.]*

- `observe → idle` (bail — the cycle is preserved, no new cycle is consumed on re-entry)
- `plan → observe`
- `execute → observe` or `execute → plan`
- `verify → execute`, `verify → plan`, or `verify → observe` (the three-destination routing — minor fix, design flaw, or context gap)

No backward edge from condense. Once the cycle reaches CONDENSE, the only exit is forward to idle. The brain refuses to un-consolidate. We come back to *why* in the CONDENSE section. *[ref: condense-lock-forward-no-backward | phasic_system/scripts/phase.sh:311-322 | When phase.sh back runs without an explicit destination, it loops over BACKWARD_MAP looking for current_phase; condense has no entry in the map, so prev stays empty and die fires — structurally preventing any backward edge from condense.]*

**The gmode side-channel** — every phase, including idle, has one extra edge that loops back to itself through gmode. Gmode is short for *generic mode*. It is the freestyle phase: a deliberately unconstrained mode where none of the OPEVC tool-restriction guards apply, used for work that doesn't fit the OPEVC ceremony. *[ref: gmode-self-exits-phase-guards | phase_verify/hooks/verify-guard.sh:84-88 | Every phase guard reads the focused job's current_phase and exits 0 when it doesn't match its own phase name; in gmode the equality fails for all five phase guards, so none enforce restrictions.]*

Entry is the same regardless of which phase you came from. The agent writes a `[GMODE]` prefixed question to the user with a substantive reason — at least a hundred words explaining why the work needs to happen outside the current phase's compartment. The orchestrator stashes the current phase, the agent enters gmode, and the per-phase guards step aside. *[ref: orchestrator-stashes-pre-gmode-phase | phasic_system/scripts/phase.sh:359-362 | Atomic jq update stashes the prior phase as pre_gmode_phase while setting current_phase to gmode; on exit the orchestrator reads back pre_gmode_phase to restore.]*

Inside gmode the agent can do real work for as long as it needs. Fix a deadlock. Make a small plugin edit that doesn't merit a full OPEVC cycle. Run a plugin-lock ceremony. The mode is intentionally unopinionated. Exit is explicit (the agent calls a small CLI to leave gmode) and requires a clean git working tree — the same discipline that gates every phase boundary. The home phase is restored atomically; the cycle counter does not advance. *[ref: gmode-exit-clean-git-atomic-restore | phasic_system/scripts/phase.sh:388-403 | Gmode exit requires a clean git working tree (dies if dirty); reads pre_gmode_phase and atomically restores current_phase while clearing the stash. No cycle counter mutation.]*

How gmode is used is a customization choice. The prototype was built running every job through OPEVC because the work was building the seed agent itself. Once the seed agent ships open-source, users will run their project work through OPEVC and may push routine plugin maintenance through gmode. Or define new phases. Or split phase plugins by job type. Gmode is the general-purpose escape hatch from the prototype's current ceremony, and the seed-cultivator decides what flows through it.

Counting it all together, the prototype's full state set is `idle, observe, plan, execute, verify, condense, gmode` — five OPEVC phases, one meta-state, and one freestyle side-channel. The rest of the essay opens the OPEVC compartments. Idle and gmode are the bookends.

---

## The Discipline Is the Tool Restrictions

A phase is not just a label. It is a different *write scope*.

OBSERVE and PLAN are read-only. The agent can read any file it likes, but the only files it can write are CLAUDE.md files. Code, scripts, configuration, project content — none of it is editable in those phases. *[ref: plan-blocks-non-claude-writes | phase_plan/hooks/plan-guard.sh:234-293 | PLAN's Edit|Write case arm mirrors OBSERVE: memory and CLAUDE.md edits allowed with section enforcement and min-synthesis gate; knowledge files and all other project paths blocked with tool-restriction-non-claude.]*

EXECUTE has full write access, scoped to a list of directories the plan declared up front. *[ref: execute-altered-list-scope-check | phase_execute/hooks/execute-guard.sh:821-898 | EXECUTE retrieves the altered-list snapshot frozen at phase entry; every Edit/Write must match a CLAUDE.md path in the list, or have an ancestor CLAUDE.md in the list — otherwise blocked.]*

VERIFY has scripts-only access. The agent can run tests, run scripts, run validators. It cannot edit code. It can write pass/fail results back into CLAUDE.md and into a designated plan file. *[ref: verify-allows-claude-and-plan-blocks-project | phase_verify/hooks/verify-guard.sh:248-317 | VERIFY's Edit|Write|MultiEdit case arm exits 0 for plan files at line 263, allows CLAUDE.md edits within the altered list, and blocks all other project files at line 316.]*

CONDENSE has the most permissive *but most restricted* scope: it can write almost anywhere inside `.claude/`, including across plugins, but it cannot touch project files at all.

Forbidding tools is not a limitation. It is the pedagogy. Call this *tool restriction as pedagogy* — the discipline doesn't come from telling the agent what to do; it comes from making the wrong move impossible.

When OBSERVE is read-only, the agent is forced to gather context before it can act. There is no escape into "let me just patch this real quick" — the patch tool isn't available.

When PLAN is read-only, the plan must commit fully to a written contract before EXECUTE can begin. The alternative isn't there.

When VERIFY can only run scripts, self-verification through "the code looks fine to me" is impossible. Only what the scripts say counts.

When CONDENSE can only touch `.claude/`, project work is structurally fenced off. The agent can't sneak a feature in under the cover of consolidation.

Enforcement is layered. A global guard, registered by the orchestrator plugin, fires on every productive tool call (file edits, reads, shell, web fetches). While the focused job is idle, the gate blocks essentially everything — reads, writes, web fetches, general shell — and unlocks only a small allowlist: the job-management CLI, the phase-advancement CLI, the always-on infrastructure scripts that need to keep running, and memory-file edits. Once a phase activates, the global gate exits silently and the per-phase guard for that phase takes over. *[ref: idle-gate-bash-allowlist-narrow | phasic_system/hooks/phase-gate.sh:82-104 | IDLE's Bash whitelist allows only the job, phase, summary, self-compact, and lock CLIs; every other shell command exits 2 with a block message steering the agent to advance into observe.]*

Every phase publishes its own guard. Every guard is registered unconditionally and self-exits in milliseconds if the focused job's phase doesn't match its own; only the guard for the active phase does real work. Each guard inspects every write call against an allowlist, then consults a shared section-check library to ensure the edit doesn't cross a phase-section boundary inside any CLAUDE.md. *[ref: shared-section-check-library | lib/section_guard/section-check.sh:25-50 | Shared library sourced by every phase guard; check_section_edit takes a phase_marker plus file_path plus old/new strings, validates the CLAUDE.md has all four section anchors, and rejects edits crossing the phase-section boundary.]*

The footer markers from [the previous essay](05-the-always-on-digital-cortex.html) — `---Ob---`, `---Pl---`, `---Ex---`, `---Ve---` — are physical barriers. Each phase's guard enforces one rule: writes must land strictly below that phase's own marker. The constraint is asymmetric. OBSERVE can write anywhere below `---Ob---` — into any of the four footer blocks. PLAN can no longer write into `---Ob---` and writes below `---Pl---`. EXECUTE loses two more blocks and writes below `---Ex---`. VERIFY can only write below `---Ve---`. As the cycle progresses, the editable region shrinks from above; each completed phase becomes part of the locked upstream record. The body above all four markers is reserved for CONDENSE; none of the four work-on-project phases can touch it. In practice each phase's work lands in its own block, but the mechanical rule is the floor — "strictly below my marker" — and that is what produces the forward-pressure. The markers are not decoration; they are the structural manifestation of compartmentalization. The agent can lose the argument with the user, or with itself, but it can't lose it with the guard. The guard is code. *[ref: strictly-below-phase-marker-enforced | lib/section_guard/section-check.sh:240-283 | Element 5 maps each phase marker to its line number and rejects edits whose anchor text appears only at-or-above that line; only edits whose anchor appears strictly below the phase's own marker are allowed.]*

The result: each phase produces its own kind of artifact. OBSERVE produces working memory. PLAN produces a plan document. EXECUTE produces code changes plus execution notes. VERIFY produces pass/fail results. CONDENSE produces a clean working memory and durable knowledge files.

Every phase has its own plugin. The phasic plugins (currently six in the prototype — one per phase, plus a separate orchestrator that tracks which phase is active for which job) are themselves single-concern packages, each one owning the rules for one mode of cognition. As with the always-on layer, the count is the prototype, not the architecture. A custom seed adding a sixth phase would add a seventh plugin alongside the orchestrator. The shape is what generalizes. *[ref: phasic-conductor-coordinates-5-phase-plugins | phasic_system/docs/README.md:4-8 | phasic_system is the OPEVC conductor — tracks where each job is in its lifecycle and coordinates 5 phase plugins (observe, plan, execute, verify, condense); total = 6 phasic packages.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard table — write rules per phase.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk lines;
  pastel chalk colors for row labels (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for headers and cell marks; faint chalk dust at the edges; a couple of chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, paths, or phase descriptors.
  Layout: 5 rows × 5 columns grid drawn in chalk.
    Row labels (left, each in its own pastel chalk circle like the cycle image, lowercase, in this top-to-bottom order):
      Row 1 (cyan fill): "observe"
      Row 2 (green fill): "plan"
      Row 3 (orange fill): "execute"
      Row 4 (pink fill): "verify"
      Row 5 (magenta fill): "condense"
    Column headers (top, white chalk, lowercase, in this left-to-right order):
      "read project", "edit project", "edit own footer", "edit plan file", "edit .claude/"
    Cells: hand-drawn white chalk checkmark (✓) for allowed; white chalk X for blocked. No words inside cells.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "observe", "plan", "execute", "verify", "condense", "read project", "edit project", "edit own footer", "edit plan file", "edit .claude/", plus the caption below. No other words, file names, folders, or phase descriptors may appear. Cells contain only ✓ or X glyphs, no text.
  Caption (bottom of image, white chalk, hand-drawn): "Each phase is defined by what it cannot do."
-->


---

## A Quick Map Before We Dive In

Before opening each phase compartment, here is the operational map at a glance. Each line below names the phase, its essence, and what it is on the hook to produce.

**IDLE** — the meta-state between cycles. Lifecycle management only.
- Unlock the job-management CLI — the lifecycle surface (`show`, `focused`, `list`, `update`, `activate`, `focus`, `pause`, `complete`, `approve`). Creation and graph mutations live elsewhere.
- Unlock the phase CLI (`advance`, `current`, `cycle`, `exit-gmode`) — agent-callable `advance` only goes idle → observe
- Keep the always-on infrastructure running: memory edits, summary, compact, lock
- Block reads, project edits, CLAUDE.md edits, web access, general shell
- *Job creation happens automatically: top-level via `prompt-handler.sh` (the user's prompt itself creates the job when none is focused); dependent jobs via CONDENSE step 3 consuming `[PENDING-JOB]` markers. The agent does not call `job.sh create` itself.*

**OBSERVE** — gather context before any plan can form.
- On cycle 1, classify the job's form (single-cycle deep / multi-cycle with `.md` plan / multi-cycle with `.yaml` plan); the form decides whether PLAN will name a plan_file
- Populate the working-memory CLAUDE.md files with relevant context
- Dispatch parallel research subagents and synthesize their returns
- Refuse code edits — the only allowed write target is CLAUDE.md
- Cross the exit threshold only after enough investigation has happened

**PLAN** — turn observations into a binding contract.
- Name the `plan_file` in cycle 1 (multi-cycle jobs only); PLAN itself never writes the file — EXECUTE creates it
- Declare the *altered list* — the CLAUDE.md files whose parent directories EXECUTE will be allowed to touch
- Write acceptance criteria VERIFY will check against
- Refuse code edits — the contract is what gets written, not the work

**EXECUTE** — build what the plan declared, in checkpoints.
- Edit project files, but only inside the altered list — the merged set of CLAUDE.md files OBSERVE and PLAN together declared, frozen at execute entry
- Materialize every artifact the seed agent produces — code, the `.md` plan in cycle 1, the `.yaml` plan in the post-approval cycle, anything else with a path; EXECUTE is the universal file-creator
- Favor small, focused checkpoint commits over one long uncommitted run; the point schedule and intermediate-commit mode incentivize the checkpoint pattern
- Capture *execution notes* in the working CLAUDE.md so the cycle stays narratable
- Delegate file work to execute subagents (sequential by default, two-in-flight ceiling); keep the main session on the spine

**VERIFY** — judge prior work with independent eyes.
- Run scripts and validators; refuse all code edits in this phase
- Dispatch auditor subagents to read the executed work without bias
- Write pass/fail results into CLAUDE.md and the plan file
- Edit the active plan file: the `.md` while `plan_state` is `drafting`, the `.yaml` while `plan_state` is `yaml_drafting`
- Ask the user via AskUserQuestion (`[PLAN-APPROVAL]` or `[YAML-APPROVAL]`); on yes, flip `plan_state` (`approve-md` / `approve-yaml`); `seal-plan` is the separate, optional terminal step
- Remove a dependency from the focused job's `depends_on` (`job.sh remove-dependency`) when the audit reveals the dep is no longer needed — the lifecycle-symmetry partner of CONDENSE's `add-dependency`
- Route the cycle forward to CONDENSE, or backward to whichever prior phase the failure points at

**CONDENSE** — consolidate the cycle's learnings into the brain.
- Walk a strict seven-step waterfall that routes content to its durable home
- Consume marker types the prior phases dropped into footers
- Compress the working CLAUDE.md back to a clean state
- Own all job creation (`create`, `create-dependent`) and dependency additions (`add-dependency`) — the phase with the right cycle-wide context for graph mutations
- Lock forward to idle; no escape hatch back to verify

**GMODE** — the freestyle side-channel from any phase.
- Enter via a `[GMODE]` user question with a substantive reason (≥100 words)
- Run unconstrained work — no OPEVC tool-restriction guards apply
- Exit explicitly with a clean git tree; the home phase resumes atomically
- Host work that doesn't fit the OPEVC ceremony — deadlock fixes, plugin maintenance, custom workflows

That is the operational shape. The rest of this essay opens each phase one at a time and explains what makes its compartment work.

---

## OBSERVE — Read Wide, Write Once

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context. *[ref: agent-advance-only-idle-to-observe | phasic_system/scripts/phase.sh:215-221 | The agent-callable advance branch dies unless current_phase is idle and hardcodes the next phase as observe; OBSERVE is structurally the only entry phase the agent can initiate.]*

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation. *[ref: observe-gathers-context-into-claude-md | phase_observe/CLAUDE.md:20-22 | OBSERVE's stated objective: gather needed context into CLAUDE.md files so plan/execute/verify have the information they need. Each CLAUDE.md update declares a directory as editable in execute.]*

OBSERVE cycle 1 carries one decision that shapes everything downstream: which form the job takes. The agent classifies into one of three — a single-cycle deep job that runs freestyle and dissolves with its cycle, a multi-cycle job with an `.md` plan that refines across cycles, or a multi-cycle job that has already earned a parseable `.yaml` plan injected at every phase entry. The third form evolves out of the second through an approval gate; it is not chosen up front. PLAN inherits the classification and names the `plan_file` accordingly — `false` for single-cycle, a path for multi-cycle — but the framing happens here, in OBSERVE, before the first acceptance criterion is written. *[ref: plan-file-named-once-in-plan | phase_plan/scripts/plan.sh:335-376 | set-plan-file is PLAN's cycle-1-only public command; it accepts false for single-cycle or a plan_*.md path for multi-cycle, dies on any later re-call, and locks the form OBSERVE classified into for the rest of the job.]*

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content. That single restriction, more than anything else, is what forces observation to actually happen. There is no escape into action. *[ref: observe-claude-md-only-staging-principle | phase_observe/docs/principles.md:48-54 | Principle 6 of OBSERVE's design docs: observe-commit.sh stages only CLAUDE.md files; non-CLAUDE.md staged files trigger anomaly warnings. Rationale: observe is read-only for project files, no silent fix.]*

OBSERVE is also where the most distinctive seed-agent mechanism lives. We meet it here, and it will return through every phase that follows.

The mechanism is what the prototype calls the **multiplier sentinel**: a per-phase scalar that starts at zero and locks every tool until the agent sets a real value. The setter is a small CLI call the agent must make as its very first action — picking a value from a fixed range between 0.5 and 3.0. Once set, the value cannot be changed for that phase entry. The same pattern applies to every other phase. The value scales how much each action in this phase counts — picking high makes each action count for more, picking low makes each action count for less. We come back to what that *means* — and why a smaller number declares a larger phase — at the close of this essay. It is more interesting than it looks. *[ref: multiplier-sentinel-locks-all-tools | phase_observe/hooks/observe-guard.sh:185-202 | Sentinel-lock gate: when the main session enters OBSERVE the multiplier is zero; every tool except the observe.sh set-multiplier Bash invocation is blocked until the agent picks a value in 0.5-3.]*

OBSERVE also has two intermediate gates that shape the rhythm of the phase from the inside. The first is a *minimum-synthesis* gate: the agent has to read enough before any write into CLAUDE.md is allowed. The block message the agent sees is plain — "you have to read before you can write." The second is a *maximum-accumulation* gate: once the agent has read for a while without synthesizing, further reading is blocked until it puts something into CLAUDE.md. The block message is similarly plain — "you have read enough; synthesize before continuing." The arithmetic underneath those gates is hidden from the agent; only the block messages surface, and only when a gate fires. *[ref: min-gate-max-gate-paired | phase_observe/hooks/observe-guard.sh:211-259 | Max-accumulation gate blocks Read/Edit/Bash/Web/Agent once points_since hits MAX_ACCUMULATION_POINTS (default 25); the paired min-synthesis gate at line 285 blocks CLAUDE.md edits below MIN_SYNTHESIS_POINTS (default 3).]*

OBSERVE also dispatches its share of subagents. A typical OBSERVE phase will fan out two to four research subagents in parallel, each pursuing a different question, each returning a structured synthesis. The main session orchestrates; the subagents investigate. The roster of specialized observe subagents (read-only researchers, comparison agents, web-fetchers, and so on) is currently around a dozen. The 80/20 split between main-session orchestration and subagent execution — and why the architecture insists on it — is the subject of [Essay 7](07-the-plugin-kit.html). *[ref: observe-12-subagents-80-20 | phase_observe/agents/CLAUDE.md:1-19 | Observe workforce: 12 specialized agents (codebase-explorer, contradiction-finder, web-researcher, etc.) with 80/20 architecture — main session orchestrates 20 percent, subagents do 80 percent; subagents are exempt from point gates.]*

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent. *[ref: observe-commit-then-advance-to-plan | phase_observe/scripts/observe-commit.sh:371-382 | After the git commit succeeds, the script calls phase.sh --hook advance to move OBSERVE→PLAN; if advance fails, it logs a warning rather than silently dropping the move.]*

---

## PLAN — Decide, Then Lock

PLAN is also read-only against project files. The agent can still read whatever it needs, but writes are confined to CLAUDE.md. The plan document, if the job calls for one, is named in PLAN and written by EXECUTE — we come back to that below.

The first thing the agent does on entering PLAN, after the multiplier, is decide whether the job needs a plan file at all.

PLAN inherits the job-form classification from OBSERVE: single-cycle, multi-cycle with a working `.md` plan, or multi-cycle whose `.md` has graduated into a `.yaml`. When the form is multi-cycle, PLAN's first concrete act after the multiplier is to name the plan_file via `plan.sh set-plan-file` — a cycle-1-only call that locks the path for the rest of the job. The file's lifecycle splits across phases from there. EXECUTE creates the named document in cycle 1 and writes the initial plan into it. VERIFY edits it across every cycle — appending status rows, captured lessons, completion marks as the work matures. PLAN itself never edits the file directly; from cycle 2 onward it reads the file back at phase entry, treating it as the long-term contract the cycle inherits. And the contract is not static — the plan moves through a `plan_state` machine, `drafting` while the .md still refines, with `md_approved` flipping the gate that lets a later cycle create the .yaml. *[ref: set-plan-file-cycle-1-immutable | phase_plan/scripts/plan.sh:335-376 | PLAN's set-plan-file CLI accepts false for single-cycle or plan_*.md for multi-cycle; cycle 1 only, dies on re-call, locks the form for the rest of the job.]*

The plan moves through five states. `drafting` keeps the .md circulating — VERIFY refines it cycle after cycle, the contract sharpens. `md_approved` is the flip: VERIFY asks the user via AskUserQuestion, the user answers yes, the state lifts and the next cycle is dedicated to creating the .yaml. `yaml_drafting` is the parallel arc — EXECUTE writes the .yaml; VERIFY refines it across however many cycles it takes, with backward to PLAN allowed when the analysis underneath needs revisiting. `yaml_ready` is a second user-gated flip, and from that point the .yaml is injected at phase entry on every cycle that follows — the plan is now actively shaping the agent's context. `sealed` is optional and terminal; `seal-plan` is the only command that archives the pair to `completed_plan[]`. Approval is a state flip, not a retirement — the plan keeps working until it is explicitly sealed.

Plan documents live at a known path inside the agent's knowledge directory. Their structure is opinionated. Each one carries a stated goal, an acceptance-criteria list, the *altered list* — a list of CLAUDE.md files whose parent directories EXECUTE will be allowed to touch, [introduced in the previous essay](05-the-always-on-digital-cortex.html) as the mechanism that lets PLAN scope EXECUTE's reach — and an explicit set of judgment-call criteria. The judgment-call criteria are the points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe. *[ref: plan-6-subagents-encode-structure | phase_plan/agents/CLAUDE.md:17-30 | PLAN's 6 specialized subagents encode the plan-document's opinionated structure: plan-step-breaker decomposes steps, plan-criteria-writer authors acceptance criteria, plan-scope-analyzer maps altered-list directories, plan-risk-assessor names judgment calls.]*

The `.md` and the `.yaml` live side-by-side once both exist, and they are not the same artifact wearing different masks. The `.md` is the human-readable accumulating prose; the `.yaml` is the parseable injection target the orchestrator reads at phase entry to pour context-specific content into the working session. Both files carry a small identification frontmatter at the top — a `job:` line and a `plan_file:` line — declaring which job they belong to and nothing more. The lifecycle *state* — where the plan sits in its drafting and approval arc — does not live in either file. It lives on the job object inside `data.json`, alongside every other job-level field, because the state describes the whole plan lifecycle that spans the pair; the files are the artifacts, the state describes the pair. *[ref: yaml-identification-frontmatter | .claude/knowledge/plans/plan_phasic_and_phase_plugins_coverage.yaml:1,3 | The identification frontmatter at the top of a real .yaml plan file: line 1 `job: <id>`, line 3 `plan_file: <name>.md` (with line 2 `job_name:` between them). Every plan file carries this convention.]*

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE. This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check. *[ref: altered-list-frozen-at-execute-entry | phase_execute/hooks/execute-sensor.sh:158-172 | execute-sensor.sh merges OBSERVE and PLAN altered lists at execute entry, then calls execute.sh set-altered-list to snapshot the merged scope into execute's data.json — the freeze that fences EXECUTE to PLAN's contract.]*

If EXECUTE wants to touch a file the plan didn't list, the request is blocked. The agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

The reason the plan is locked is the reason every project rationalizes mid-execution. Plans written *during* execution are not plans; they are post-hoc explanations for whatever the executor felt like doing. By forcing the plan to be authored before any code is touched, the seed agent forecloses that drift. The plan can be wrong — that is what VERIFY is for, and that is what backward transitions are for — but it cannot be silently rewritten.

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate. *[ref: plan-set-multiplier-validates-range | phase_plan/scripts/plan.sh:309-325 | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if the entry already has points (preventing reset), then writes the immutable value to data.json.]*

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

## EXECUTE — Build, in Scope, in Steps

EXECUTE is where code gets written. The write-tool guard is gentler here, but only inside the altered list. Every other path is blocked.

EXECUTE doesn't just write code — it writes everything. The principle is universal: every file the seed agent materializes on disk is brought into existence by EXECUTE. Project source, scripts, configuration, the .md plan, the .yaml plan, anything else with a path — all of it is EXECUTE's deliverable. OBSERVE and PLAN do their thinking inside CLAUDE.md working memory; VERIFY refines what EXECUTE produced; CONDENSE routes content into durable layers. EXECUTE is the only phase that turns analysis into artifact. *[ref: execute-only-phase-allowed-to-write-plan-file | phase_plan/hooks/plan-guard.sh:253-289 | plan-guard blocks any Write/Edit under .claude/knowledge/ from PLAN, including the plan file PLAN itself just named — the file's creation is reserved for EXECUTE, the same rule that applies to every other artifact the seed agent produces.]*

The `.yaml` is not a transcription of the `.md` — it is its own cycle of work. Cycle 1's EXECUTE materializes the `.md` for the first time, and the plan enters its `drafting` state. The `.yaml` does not arrive then. It arrives only after the user approves the `.md` and the state flips to `md_approved` — and the cycle that follows is a whole new OPEVC pass dedicated to the `.yaml`: OBSERVE re-reads the approved `.md`, PLAN designs the YAML structure inside CLAUDE.md analysis, EXECUTE writes the `.yaml` file for the first time, VERIFY refines it. Same phase, same compartmentalization rule, different trigger: cycle 1 for the `.md`, a post-approval cycle for the `.yaml` — which takes the approved `.md` as input and produces a context-injection target as output.

The altered list is a frozen snapshot of directories, captured from OBSERVE and PLAN at phase entry. A guard inspects every write call against that snapshot before the call lands. A path inside the snapshot proceeds. A path outside is rejected, and the agent has to either roll back to PLAN to amend the contract or accept the fence. *[ref: set-altered-list-stores-snapshot | phase_execute/scripts/execute.sh:505-516 | set-altered-list builds a normalized JSON array from paths and writes altered_claude_md = ($arr | unique) into data.json — the canonical storage point of the frozen snapshot the guard reads.]*

A second guard inside the same hook protects the phase-section markers — the four footer anchors from the previous essay — so that EXECUTE writes execution notes inside its own footer section but cannot overwrite what the prior phases wrote. The compartmentalization holds even within a single CLAUDE.md. *[ref: execute-guard-section-enforcement-call | phase_execute/hooks/execute-guard.sh:856-879 | Inside execute-guard's CLAUDE.md branch, the section-enforcement sub-block dispatches the shared check_section_edit("---Ex---", ...) library call; cross-section edits are rejected with section-enforcement block detail.]*

The phase is structured around *checkpoints* — short, focused commits that finish one piece of the plan before starting the next. The pattern is deliberate. A long uncommitted run inside EXECUTE has the same problem as a long run anywhere else: drift accumulates, and a failure halfway through erases everything. Checkpointing forces small wins. It also gives the agent a clean place to pause and notice when the plan is wrong, before sinking another ten tool calls into the wrong direction. *[ref: execute-checkpoint-vs-forward-commit | phase_execute/scripts/execute-commit.sh:390-397 | Without --force, the commit prefix becomes "execute: [intermediate]" and the script stays in EXECUTE for more work; with --force the prefix is "execute:" and the script proceeds to phase advance.]*

EXECUTE writes two things: the code, and *execution notes* in the working CLAUDE.md. The notes are short — what surprised the agent, what decisions the agent made when the plan left a judgment call open, what the next phase should know. The notes are what turn a sequence of commits into a coherent narrative. They will be one of the things CONDENSE absorbs. *[ref: execute-tools-table-claude-md-as-notes | phase_execute/CLAUDE.md:64-68 | EXECUTE's tool table labels project-file edits (5 pts) and CLAUDE.md edits (10 pts, "Execution notes — resets synthesis counter") as the phase's two write activities, with notes earning the highest reward among edits.]*

EXECUTE is also where subagent dispatch shows up most heavily, and the point schedule encodes that explicitly. Every execute subagent the main session launches grants the session a small *direct-action budget* — a handful of extra writes the main session is allowed to make on its own. Every project file the main session edits itself spends some of that budget back. Reading project files does not consume budget; only edits and writes outside `.claude/` do. The arithmetic is small but the bias is intentional: the main session is incentivized to delegate the implementation to execute subagents rather than do the file work itself. A typical execute phase will spawn one or two execute subagents on file edits while the main session works on the spine of the change. *[ref: execute-subagent-grants-direct-action-budget | phase_execute/scripts/execute.sh:765-795 | grant-direct-action-budget adds +3 budget per execute-subagent dispatch; consume-direct-action-budget deducts 1 per project edit and dies on insufficient — structural enforcement of 80/20 delegation bias.]*

The discipline favors sequential dispatch — one execute subagent at a time, with the main session orchestrating between checkpoints. When fan-out is genuinely useful, the operational ceiling is two-in-flight; the cap was set after a cycle in which three concurrent subagents pushed the context window past a safe tier and triggered cascading compaction. Two-in-flight stays under that ceiling and is enough for genuine parallelism on independent files, narrow enough to keep the agent's context coherent. We will come back to the discipline of subagent dispatch in [Essay 7](07-the-plugin-kit.html).

When EXECUTE believes the plan is implemented, it commits the final checkpoint and the orchestrator advances the job to VERIFY.

---

## VERIFY — Independent Eyes

VERIFY is scripts-only. *[ref: verify-bash-whitelist-scripts-only | phase_verify/hooks/verify-guard.sh:349-365 | VERIFY's Bash case arm allows bash invocations of tests/ scripts/ paths and git read-only commands; blocks git add, file writes (echo > / sed -i / mv / cp / rm), --hook flags, and package managers.]*

The agent cannot edit code in VERIFY. It can read any file in the cycle's scope, by design. It can run tests. It can run validators. And it can dispatch a particular class of subagent — *auditors* — whose entire job is to read the executed work and report whether each acceptance criterion holds. *[ref: verify-dispatches-auditor-subagents | phase_verify/agents/CLAUDE.md:8-16 | The Defined Subagents table lists VERIFY's auditor roster: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker — each scoped to evaluate one slice of the cycle's work.]*

VERIFY carries two authorities the other phases don't, and they're tightly coupled. It is the only phase that can edit the plan files in their respective drafting stages — the .md while `plan_state` is `drafting`, the .yaml while `plan_state` is `yaml_drafting` — and it is the only phase that can ask the user to approve them. The approval mechanism is mechanical: VERIFY asks via AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, and on a "yes" the phase calls `plan.sh approve-md` or `plan.sh approve-yaml`, flipping `plan_state` forward. The prefixes are phase-gated — they are rejected anywhere outside VERIFY. Both authorities flow from the same role: VERIFY is the cycle's final guardrail, the phase that refines the artifact and then stands between it and the state flip that promotes it. *[ref: verify-edits-plan-md-files | phase_verify/hooks/verify-guard.sh:257-265 | verify-guard's path branch allows edits to */plans/plan_*.md — VERIFY is the only phase with write access to the drafting plan file.]*

Auditor subagents are read-only researchers, scoped narrowly to one slice of the cycle. The prototype ships an initial set — one per cycle slice — and the set grows as new perspectives prove worth auditing. One re-walks the working memory the OBSERVE phase produced and asks whether it gave PLAN enough to work with. One judges the plan itself — were the items specific enough to implement without guessing, were the acceptance criteria testable, would another agent have reached the same implementation from these instructions, or did the plan leave gaps that forced EXECUTE to improvise. One walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. One compares what was built against what the plan specified — flagging over-engineering, missed items, and silent deviations. One assesses the quality of the change itself: scope discipline, edit patterns, structural consistency. A family of perspectives, deliberately composed so that no single one dominates the verdict. None of them are allowed to fix what they find — they only report. *[ref: verify-entry-voice-lists-auditors | phase_verify/hooks/verify-sensor.sh:125-129 | VERIFY's entry voice fires on phase entry and names the verify-* auditors the agent should launch: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker.]*

The reason VERIFY is its own phase is the same reason a compiler is not the same process as the programmer. Self-verification is biased. The hand that built the code wants to see the code as correct. A separate phase, with separate tools, run by a separate cognitive posture — and frequently delegated to subagents for independence — gives the verification an honest chance to catch what execution missed.

VERIFY produces a structured pass/fail report against the plan's acceptance criteria. The report goes into the plan document and into the working CLAUDE.md. Four outcomes are possible — three of them route the cycle (forward to CONDENSE, backward for a small fix, backward for a deeper reset), and the fourth is different in kind: a state flip on the plan itself, requested from the user and recorded on the job. The flip is not the end of the plan; it just promotes its stage. The plan's actual ending is a separate signal — `seal-plan` — fired later, when the plan has nothing left to teach.

If everything passes, the orchestrator advances the job to CONDENSE.

If something minor fails — a typo, a missed import, a comment that wasn't updated — VERIFY transitions backward to EXECUTE, which gets a chance to fix the small thing and re-checkpoint. The plan is not amended; only the implementation is corrected. *[ref: verify-backward-default-routes-to-execute | phase_verify/scripts/verify-commit.sh:67-81 | verify-commit's --backward flag accepts execute/plan/observe as destination; when no destination is given, BACKWARD_DEST defaults to execute — the minor-fix route preserves the plan, retries the implementation.]*

If something major fails — an acceptance criterion that the plan can't meet, a discovery that the observation was incomplete — VERIFY transitions backward all the way to OBSERVE or PLAN. The orchestrator records the rollback as part of the job's history. The cycle restarts with the lesson learned. *[ref: back-command-persists-rollback-state | phasic_system/scripts/phase.sh:325-336 | phase.sh back writes the rollback to data.json via jq, setting current_phase to the new destination (and optionally suppress_next_cycle_increment) — the rollback persists in the job's state history.]*

If the plan is mature, VERIFY asks the user — AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, gated to fire only from this phase. On a "yes," VERIFY calls `plan.sh approve-md` or `plan.sh approve-yaml`, `plan_state` flips forward, and the cycle advances to CONDENSE the same way a clean pass does. The state change is recorded on the plan, not on the cycle's verdict — the plan stays alive, promoted to its next stage. Only `seal-plan`, fired later when the plan has nothing left to teach, actually retires it. *[ref: legacy-plan-complete-validator | job_core/hooks/question-capture.sh:133-149 | The current prototype routes plan approval through a [PLAN-COMPLETE] validator in job_core that fires in any phase; the design intent renames to [PLAN-APPROVAL]/[YAML-APPROVAL] and moves the handler into phase_verify with a phase-of-firing gate.]*

The backward edges are situational rather than a fixed menu — VERIFY rolls back to whichever prior phase the failure actually points at, and the approval-flip outcome is not a routing at all but a state change on the plan — and it is this discipline of choosing where to go, edge by edge, that gives the phasic layer its name. **Forward transitions are automatic** when the gate criteria are met; **backward transitions are explicit** and the agent has to choose where to roll back to. The state of the cycle is fully captured in the orchestrator's data file — current phase, cycle number, multiplier, point counter, and a few transition flags (pre-gmode stash, suppress-increment, forwarded). No hidden continuation. Any phase can be re-entered, but only by rolling back along defined edges. This is the Markov property the title leans on: the cycle's next move is a function of its present state, not of the path that got it there. *[ref: phasic-state-minimal-no-hidden-history | phasic_system/docs/README.md:102-123 | phasic_system's data model is intentionally minimal: jobs carry only id, current_phase, cycle, and a suppress flag — phase history is NOT stored; git commits with phase prefixes ARE the audit trail.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — VERIFY's three backward edges and one forward edge.
  Style: Match opevc-cycle-blackboard.png. Dark slate chalkboard; hand-drawn pastel chalk circles
  for each node (cyan, green, orange, pink, magenta — same palette as the cycle image); white chalk
  arrows; lowercase phase names inside the circles; chalk sticks along the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, edge descriptors, or phase descriptors.
  Layout: One central pink chalk circle in the middle of the board labeled "verify". To the left of verify,
  three chalk arrows fan outward and land on three target circles:
    - short backward arrow → orange circle labeled "execute", small chalk note above the arrow: "minor fix"
    - mid-length backward arrow → green circle labeled "plan", chalk note above the arrow: "design flaw"
    - long backward arrow → cyan circle labeled "observe", chalk note above the arrow: "context gap"
  To the right of verify, one forward arrow → magenta circle labeled "condense", chalk note above the arrow: "pass".
  The three backward arrows are drawn in warmer pastel chalk (orange / pink / magenta); the forward
  arrow is white chalk. Keep all arrows slightly curved and hand-drawn, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "verify", "execute", "plan", "observe", "condense", "minor fix", "design flaw", "context gap", "pass", plus the caption below. No other words, file names, folders, or phase descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Backward transitions are explicit choices, not automatic fallbacks."
-->


When VERIFY passes, the orchestrator advances the job to CONDENSE.

---

## CONDENSE — The Cognitive Organ

CONDENSE is not a peer of the other phases. It is a different kind of thing.

The other phases produce work *on the project*. CONDENSE produces work *on the brain*. Its write scope is `.claude/` plus the CLAUDE.md hierarchy. It cannot touch project files. It cannot add features. It cannot fix bugs. What it does is consolidate everything the cycle just produced — the gathered context, the plan document, the execution notes, the verification results — and route the durable parts to where they will be useful in the next cycle. *[ref: condense-is-consolidation-break | phase_condense/docs/principles.md:4-6 | CONDENSE is defined as a "consolidation break" between successful chunks of work — not sleep, not routing, but active content movement that takes the altered CLAUDE.md list (frozen at entry) and moves bottom-section words to durable destinations.]*

That routing is structured as a strict **seven-step waterfall**. The order matters; each step's output feeds the next. *[ref: condense-7-step-waterfall-strict-ordered | phase_condense/docs/principles.md:79-83 | CONDENSE Principle 8: a strict ordered sequence of 7 steps — footer-to-body, cross-file migration, pending jobs, voice updates, agent updates, knowledge routing, session archive fallback. Processing order is deterministic.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard cascade — the CONDENSE seven-step waterfall.
  Style: Match opevc-cycle-blackboard.png. Dark slate chalkboard; hand-drawn chalk tiles and arrow streams;
  pastel chalk for the tile borders (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for step numbers, labels, and arrows; chalk sticks resting along the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, step titles, or labels.
  Layout: Seven chalk tiles stacked vertically down the center of the board, each labeled IN WHITE CHALK with its number and short name (lowercase, EXACTLY as written below — do NOT invent new terms):
    Tile 1 (cyan border): "1. footer to body"
    Tile 2 (green border): "2. cross-file move"
    Tile 3 (orange border): "3. pending job"
    Tile 4 (pink border): "4. voice update"
    Tile 5 (magenta border): "5. agent update"
    Tile 6 (cyan border): "6. knowledge"
    Tile 7 (dim white border): "7. session archive" — drawn smaller, fainter, slightly off-axis to mark it as last-resort
  Short white-chalk arrows feed each tile into the next (1→2→3→4→5→6→7).
  Below all seven tiles, a horizontal chalk bar drawn across the board's width, labeled IN WHITE CHALK exactly "deflation gate", with one chalk exit arrow attempting to pass through it.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "1. footer to body", "2. cross-file move", "3. pending job", "4. voice update", "5. agent update", "6. knowledge", "7. session archive", "deflation gate", plus the caption below. No other words, file names, folders, or step descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Each step's output feeds the next. Step 7 is the fallback, not a peer."
-->

1. **Same-file footer-to-body absorption.** Every CLAUDE.md the cycle touched has a footer with the four phase markers from [the previous essay](05-the-always-on-digital-cortex.html). The phases write into those footers as the work happens. CONDENSE's first step is main-session work, not subagent-delegated: the agent walks the frozen altered-list snapshot and pulls durable findings from the footers up into each file's body. The phases can mark their own contributions to bias this step — a paragraph tagged durable is absorbed into the body by default, a paragraph tagged ephemeral is dropped, and untagged content gets a judgment call. The footers are scratch; the body is durable. The deflation can be sharp: a single plugin's working CLAUDE.md routinely shrinks from a sprawling footer down to a tight body section in this step alone, the bulk of the cycle's noise gone in one absorption pass. *[ref: condense-step-1-footer-to-body-graduated | phase_condense/docs/decisions.md:213-221 | Decision D20: CONDENSE Step 1 (footer-to-body absorption) enforced via graduated discipline — entry voice teaches "absorb footer-to-body first," a body-vs-footer tracker metric measures success, hard gate added only if data warrants.]*

2. **Cross-file CLAUDE.md migration.** Some content does not belong in the file where it was written. A discovery about how the website's CSS works belongs in the website project's CLAUDE.md, not in the brain's root. A pattern the agent learned about its own behavior belongs in a plugin's CLAUDE.md, not in a working directory. Step two dispatches a small mover subagent to walk the touched files and route content sideways or upward. The subagent's destination logic is content-determined, not priority-ordered: the right CLAUDE.md is the one whose subject matter most naturally holds the finding, even if it sits two directories away. *[ref: condense-claude-md-mover-cross-file | phase_condense/agents/condense-claude-md-mover.md:1-11 | Step 2 dispatches condense-claude-md-mover: a Read/Edit/Write subagent that moves CLAUDE.md content sideways or upward to the destination most natural for the subject — rejects duplicates rather than adding noise.]*

3. **Pending-job markers.** During the cycle, a phase may have flagged in its footer that follow-up work needs a separate job. Step three reads those markers, creates the dependent jobs, and removes the marker. *[ref: condense-job-creator-pending | phase_condense/agents/condense-job-creator.md:1-12 | Step 3 dispatches condense-job-creator: converts action items and improvement ideas from CLAUDE.md bottom sections into pending jobs via job.sh create; checks for overlap before creating.]*

4. **Voice-update markers.** A phase may have noticed that a coaching voice — the soft, LLM-interpreted guidance one of the plugins issues — is worded poorly or missing. Step four edits the relevant voice file accordingly and removes the marker. *[ref: condense-voice-updater-step-four | phase_condense/agents/condense-voice-updater.md:1-11 | Step 4 dispatches condense-voice-updater: finds the right plugin's voice.xml, identifies the relevant voice element, and updates its text to capture the lesson — the agent's soft memory layer gets refreshed.]*

5. **Agent-update markers.** Same pattern, but for subagent definitions. A phase may have noticed an instruction for a research subagent should be tightened. Step five updates the agent definition and removes the marker. *[ref: condense-agent-updater-step-five | phase_condense/agents/condense-agent-updater.md:1-11 | Step 5 dispatches condense-agent-updater: consumes [AGENT-UPDATE] markers from phase footers and edits the named subagent's .md file — the behavioral contract that future cycles inherit.]*

6. **Knowledge markers.** This is the most important step. A phase may have written a knowledge marker into a footer — backticks and brackets deliberate, so the marker has a unique grep signature — to flag a finding that should be promoted to long-term memory. Step six dispatches a small extractor subagent that reads the surrounding paragraph, writes a new file at the right path inside the knowledge directory, re-reads the file to verify the write actually landed, and only then replaces the source marker with a strikethrough audit line. *[ref: condense-knowledge-extractor-step-six | phase_condense/agents/condense-knowledge-extractor.md:1-11 | Step 6 dispatches condense-knowledge-extractor: extracts CLAUDE.md bottom-section content into .claude/knowledge/<topic>/ files; evaluates each chunk before writing and rejects duplicates or contradictions rather than creating noise.]*

   The "verify by re-reading" requirement is hardening from a real failure mode. In earlier cycles, multiple consumption subagents reported success but had silently been blocked by an upstream guard, and stale markers accumulated in footers across cycles before anyone noticed. The fix was to require explicit confirmation that the write landed — the subagent has to see its own work on disk before it can call the marker consumed. *[ref: extractor-must-read-its-own-write | phase_condense/agents/condense-knowledge-extractor.md:44-54 | The extractor must Read the file it just Wrote and confirm byte count + section headings before reporting success; reports without verified_via_read: true are treated as provisional by the main session.]*

   CONDENSE carries its own write permission for `.md` files anywhere inside `.claude/`, including knowledge directories the earlier phases never touched — it is the only phase allowed to create durable knowledge files outside the altered list, precisely because routing into a fresh knowledge subtree is its job. This is how the brain *grows* — cycle after cycle, knowledge accumulates in topic-organized layers, and future OBSERVE phases can recall it. *[ref: condense-only-creates-outside-altered-list | phase_condense/hooks/condense-guard.sh:64-68 | Comment block declares CONDENSE the only phase allowed to create top-level CLAUDE.md files outside the altered list — necessary because CONDENSE routes knowledge into knowledge/ directories that may not have been touched by execute.]*

7. **Session archive.** Whatever did not fit into the earlier steps gets dropped into a per-job session archive file under `.claude/knowledge/session/`. This step is intentionally last and intentionally last-resort. A long session archive is a sign that earlier steps under-routed. A short session archive is healthy. *[ref: condense-init-coaches-session-last-resort | phase_condense/docs/architecture-pattern.md:53-59 | CONDENSE init emits the 7-step waterfall entry voice that names each step and coaches the session-last-resort principle — Step 7 archives are the fallback for content that didn't land in earlier steps.]*

After all seven steps, CONDENSE checks a *deflation gate*. At condense entry, a sensor snapshots the total bottom-section word count of every CLAUDE.md in the altered list — everything below the first phase marker — and stores it as the cycle's baseline. At commit time, the gate re-scans the same files from disk, computes how many words were absorbed away from the footers, and compares against a stage-aware threshold. *[ref: condense-deflation-gate-at-commit | phase_condense/scripts/condense-commit.sh:147-160 | At commit time CONDENSE re-measures footer word counts, computes words_absorbed = total_baseline − current_total, and blocks with exit 1 if current_total exceeds max_remaining (the stage-aware threshold).]*

Single-cycle jobs default to eighty percent absorption. The cycle is final; working memory must compress hard before the agent returns to idle. *[ref: stage-aware-deflation-rationale | phase_condense/scripts/condense-commit.sh:115-118 | Stage-aware deflation rationale: single-cycle jobs (plan_file=false) must hit 80 percent because working memory is final; multi-cycle jobs (plan_file=name) stop at 50 percent to preserve plan-handoff context across cycles.]*

Multi-cycle jobs default to fifty percent. Some of the cycle's planning context legitimately needs to survive into the next cycle's PLAN, and forcing eighty-percent compression would erase that handoff. Both thresholds are tunable, and real cycles routinely overshoot — single-cycle jobs in the prototype have driven the deflation well past the eighty-percent target when the cycle had less to keep than the threshold assumed. *[ref: stage-aware-threshold-branching | phase_condense/scripts/condense-commit.sh:119-126 | The branch queries job_core's stage subcommand; Stage 2 (multi-cycle) sets words_to_absorb to 50% of baseline via CONDENSE_DEF_THRESHOLD_STAGE2, Stage 1 defaults to 80% via CONDENSE_DEF_THRESHOLD_STAGE1 — both env-tunable.]*

If the gate passes, the orchestrator commits the cycle and advances the job to idle.

If it fails, the script exits with a coaching voice, and CONDENSE has to keep working. The only options are to absorb more, route more, or compress more — because CONDENSE is *lock-forward only*. No backward edge from condense to verify. No escape hatch back to execute. The cycle either condenses enough to close, or it stays in condense. *[ref: condense-lock-forward-principle-1 | phase_condense/docs/principles.md:12-18 | Principle 1 — Lock-Forward Only: Condense has NO backward transitions; the only exit is forward to idle via condense-commit.sh --force. Backward would create partial condensation; fixes belong in the NEXT cycle.]*

CONDENSE is also the only phase that is allowed to edit the brain itself — the root CLAUDE.md, the plugin-level CLAUDE.md files, the coaching voices, the subagent definitions, the durable knowledge files. Everywhere else, those edits are protected. When an earlier phase notices a voice should change, an agent definition should tighten, or a finding should be promoted to long-term memory, it does not edit; it writes a marker in its footer. The marker stays unconsumed until CONDENSE arrives and routes it. This makes CONDENSE the lever by which the brain can rewrite itself, but only at known moments, only at the end of a cycle, only after the cycle's work has been verified. *[ref: execute-blocks-root-brain-condense-only | phase_execute/hooks/execute-guard.sh:381,727-729 | EXECUTE blocks edits to root CLAUDE.md and .claude/CLAUDE.md: the block call fires at L727-729 (`if [[ "$claude_rel" == "CLAUDE.md" ]] || [[ "$claude_rel" == ".claude/CLAUDE.md" ]]; then block "root-brain-blocked" "brain_protected"`), and the matching message text lives at L381 (`brain-protection|root-brain-blocked) msg="[phase_execute] BLOCKED: Brain updates belong in condense."`). The brain-protection/root-brain-blocked pair repeats across every phase guard, leaving CONDENSE alone able to touch the brain.]*

The cycle then returns to idle. The cycle counter does not advance on this edge — CONDENSE's exit only closes the books. The bump fires on the next `idle → observe`, when the user's next prompt drives the agent to call `phase.sh advance` and the orchestrator increments `cycle += 1` as it opens the new compartment. The new cycle's OBSERVE phase reads the brain that CONDENSE just edited. The loop is closed. *[ref: cycle-bump-on-idle-to-observe | phasic_system/scripts/phase.sh:249-256 | The idle → observe branch is the only site that mutates the cycle field; the jq update sets current_phase and increments cycle in one atomic write. CONDENSE → idle (lines 266-269) prints "Cycle N complete" but does NOT touch the counter — the closing edge announces; the opening edge increments.]*

---

## The Backward Multiplier

For the architects in the audience, this is where the phasic layer earns its keep. The mechanism is small. The discipline it produces is large.

Start with the **Ralph loop**. The pattern is familiar to anyone who has tried to keep a CLI agent on task: an agent finishes a few moves, decides it is done, calls `Stop`, and quits — even though the work is not actually finished. The fix that emerged in the broader agent community is to refuse the stop. The agent calls `Stop`; the system intercepts; the agent is returned to the prompt and told to keep working. The loop runs until the work is genuinely done.

The seed agent adopts the Ralph loop through the job system. Every job carries a `status`. The always-on layer's stop-gate hook reads it on every `Stop` attempt; while any job is `active` or still `pending`, the stop is refused and the agent is returned to the prompt with a message explaining what is still in flight. Stop, refused. Stop, refused. The agent learns to keep working until the job formally completes. *[ref: job-status-state-machine-stop-blocking | job_core/CLAUDE.md:14-37 | job_core's state machine: pending↔active↔completed; ANY pending or active job blocks Stop. The seed agent's Ralph loop adoption — Stop is refused until all jobs reach completed.]*

The phasic layer does the same thing one fractal level down — inside a single phase.

Every phase has a fixed point threshold the agent must cross before it is allowed to commit and advance. Cross the threshold and the commit script accepts the move forward. Try to commit before crossing it and the script refuses, returning the agent with a message about what kind of work is still missing. Try to call `Stop` mid-phase and the same refusal fires. The threshold is friction-by-design — a refusal layer that makes the seed agent slow down and do the work the phase exists to do, instead of rushing through phases to get to the next move.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard dial — the multiplier choice.
  Style: Match opevc-cycle-blackboard.png. Dark slate chalkboard; hand-drawn horizontal chalk line for the dial
  with six chalk tick marks; pastel chalk labels (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for the dial line, tick numbers, and action-count strings; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal labels listed below. Do not invent other tick values, action counts, or descriptor words.
  Layout: A horizontal chalk line drawn across the board with six tick marks evenly spaced, left to right, each tick number IN WHITE CHALK:
    "0.5", "1", "1.5", "2", "2.5", "3"
  Below four of the ticks, draw a short pastel chalk descriptor (one word) and the action-count IN WHITE CHALK:
    - below "0.5":  cyan descriptor "deep"      / white-chalk "~67 actions"
    - below "1":    green descriptor "standard" / white-chalk "~34 actions"
    - below "1.5":  orange descriptor "targeted"/ white-chalk "~22 actions"
    - below "3":    magenta descriptor "surgical" / white-chalk "~12 actions"
  Leave the ticks at "2" and "2.5" UNLABELED — no descriptors, no action-counts, no extra words.
  Above the dial, draw a single curving chalk arrow that runs RIGHT to LEFT (from the "3" tick toward the "0.5" tick) with one short chalk caption riding along the arrow's curve: "smaller number, bigger phase".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "0.5", "1", "1.5", "2", "2.5", "3", "deep", "standard", "targeted", "surgical", "~67 actions", "~34 actions", "~22 actions", "~12 actions", "smaller number, bigger phase", plus the caption below. No other words, file names, tool names, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "The multiplier is backward. A smaller number declares a deeper phase."
-->

How does the phase know what counts as enough work? Through a per-phase point system.

Each phase has its own point schedule. Actions the phase wants to encourage earn the most; actions it wants to discourage earn less or nothing. OBSERVE rewards synthesis writes into CLAUDE.md and parallel research subagent dispatches above any other action. EXECUTE rewards code edits inside the altered list and execute subagent dispatches. VERIFY rewards script runs and auditor subagent dispatches. CONDENSE rewards routing content into the brain's durable layers — knowledge files, voice files, plugin CLAUDE.mds. The schedules differ on purpose: each phase shapes the kind of work it considers progress. *[ref: verify-point-schedule-shapes-progress | phase_verify/CLAUDE.md:53-66 | VERIFY's point table: Read 2pts (primary activity), Bash test 5pts, Agent dispatch 7pts (per-phase auditors), Edit CLAUDE.md 5pts, Edit plan file 3pts; each phase rewards a different mix of moves.]*

The point system is *invisible to the seed agent*. No instruction file mentions points. No coaching voice cites a number. No subagent prompt rewards points. The agent never sees its current score and never sees the threshold. What the agent sees, when a gate fires, is the *kind* of work it needs more of — "you have to read before you can write" or "you have read enough; synthesize before continuing." The arithmetic is the orchestrator's; the experience is just the friction. Hiding the score is deliberate. A scoreboard the agent could see would create point-chasing — the model is good at optimizing what it can measure. The seed agent is not allowed to optimize this one. It can only do the work, and the work earns points the agent never counts. *[ref: points-invisible-prevents-gaming | phase_observe/docs/principles.md:56-62 | Principle 7: agent never sees point count mid-work; points surface only in min/max gate blocks and commit rejection. Rationale: scoreboard visibility converts behavioral shaping into a gamification target.]*

Now bring in the multiplier.

On entry to every phase, the agent must set a multiplier — chosen from a fixed dial at `0.5, 1, 1.5, 2, 2.5, 3`. Tools are locked until the choice is made. Once made, it cannot be changed for the entry. The multiplier scales how many points each action in the phase's schedule is worth. A high multiplier weights every action up; fewer actions clear the threshold. A low multiplier weights every action down; more actions are needed. *[ref: multiplier-scales-points-in-jq | phase_observe/scripts/observe.sh:243-258 | OBSERVE's add-points command multiplies action points by the entry's multiplier value (line 253 — $p * $e.multiplier) before adding to the points counter; the multiplier scales each action's reward in jq directly.]*

The naive read is that multiplier scales workload up. The intuition is exactly backward. **A smaller multiplier declares a larger phase.**

A `3.0` multiplier means each action is worth three times the base points. The threshold is reached fast — in practice, around twelve actions. The agent has declared: "this phase is small. I am in and out." A surgical bug fix. A typo. A targeted lookup-and-edit.

A `1.0` multiplier is the standard pace — about thirty-four actions to cross the threshold.

A `0.5` multiplier means each action is worth half the base points. The threshold takes around sixty-seven actions to clear. The agent has declared: "this phase is large. I am settling in for deep work." A research-heavy investigation. A multi-file refactor. A complex feature.

The intermediate values fill the dial. `1.5` lands around twenty-two actions. `2.0` and `2.5` shape the phase further toward surgical.

Pick the multiplier wrong in either direction and there is a real cost. Forecast too small (high multiplier on what turns out to be deep work) and the threshold fires before the work is done; the agent has to re-enter the phase to finish, fragmenting the cycle's record. Forecast too large (low multiplier on what turns out to be surgical work) and the phase pads out, the agent does more reading than the work merited, the context window inflates for nothing. *[ref: voice-both-error-directions-cost | phase_observe/scripts/voice.xml:39 | The observe.info.multiplier-set voice fires when the agent sets a multiplier and explicitly tells the agent: "Both error directions cost — under-forecast tightens the gate and forces re-entry; over-forecast leaves capacity unused."]*

The architecture deliberately makes both directions of error cost something. The point of the dial is not to find the safe choice — there is no safe choice. The point is to force a real act of meta-cognition before the phase begins.

This is the deeper move. The multiplier choice forces the agent to *anticipate the phase*. Before the agent picks a value, it has to read the working memory and ask itself: how heavy is this phase actually going to be? What will I be doing? How many subagents will I need? How many CLAUDE.md edits? The answer is encoded in the multiplier value. And once the multiplier is set, the agent's natural next move is to write a todo list that matches it — twelve focused steps for a `3.0`, sixty-seven slower steps for a `0.5`, with the rhythm planned in advance. The dial is a single scalar; what it produces is structured anticipation. *[ref: entry-voice-forecast-phase-from-context | phase_observe/hooks/voice.xml:22-28 | OBSERVE entry voice fires on phase entry: tools are locked until multiplier is set; forecast this phase from session context (not patterns from earlier cycles); lock with observe.sh set-multiplier when the forecast is computed.]*

The point counter behaves a level below this in a way the architects should know about. *Backward transitions preserve points; only successful forward advances reset them.* If the agent enters VERIFY, collects fifty points of audit work, then rolls backward to EXECUTE to fix a small thing, the verify entry's fifty points are preserved. When the agent advances forward again — execute → verify — VERIFY resumes from where it was, fifty points already earned, only fifty more to clear the threshold. Only a successful forward advance out of a phase finalizes its entry and resets the counter for the next time the phase is entered fresh. The architecture rewards persistence across rollbacks. The agent does not lose work to the rollback; it loses only the time spent fixing what made the rollback necessary. *[ref: forwarded-false-resumes-with-preserved-points | phase_execute/hooks/execute-sensor.sh:137-148 | On phase re-entry, the sensor checks the last entry's forwarded flag: false (not yet finalized by a forward advance) means reuse with preserved points; true or absent means initialize a fresh entry with cleared points.]*

Pattern-matching from past phases is also explicitly forbidden. "Verify is usually short" or "observe is usually deep" are exactly the wrong heuristics — they short-circuit the meta-cognition the multiplier exists to force. The coaching voices are deliberately engineered to avoid known multiplier anti-patterns: leading words, translation tables (multiplier → action-count), phase metaphors that pre-encode scope. Earlier drafts of those voices were pruned of each pattern as it surfaced, with the removal noted in-line. The voice is engineered to leave the forecast unmade until the agent makes it, on *this* phase's evidence alone. *[ref: anti-pattern-catalog-removed-translation-table | phase_observe/scripts/voice.xml:36-38 | XML comment documents removal of approx_actions translation table per anti-pattern catalog #5/#9; multiplier value is the operative output, the agent already forecasted from session context — voice avoids prescribing the forecast.]*

A scalar between `0.5` and `3` carries the weight of all of this. The Ralph loop refuses the stop. The point threshold creates the friction. The point schedule defines what work counts. The point system stays invisible so the agent does not learn to game it. The multiplier dial forces an act of forecasting, and the forecast in turn forces a structured plan of attack for the phase. Simple jobs find a high multiplier and move fast. Complex jobs find a low multiplier and breathe. Every phase begins with a real moment of meta-cognition — and the rest of the phase is the agent living up to it.

This is the part of the seed agent's design I find most quietly elegant.

---

## What Comes Next

Phases give the agent compartmentalized cognition. The CLAUDE.md layer from [the previous essay](05-the-always-on-digital-cortex.html) gives them somewhere to write that cognition down. Together they form a working brain — one that observes before it plans, plans before it builds, verifies before it consolidates, and consolidates before it forgets.

This is what [Essay 1](01-llms-are-not-the-agents.html) was reaching toward when it claimed the agent is the filesystem. The filesystem holds memory. The phases discipline what the agent does with it. The two ideas only fully resolve when you see them together.

Stretch one cycle into many, chained, and you get the long-horizon discipline [Essay 8](08-from-apprentice-to-architect.html) is about — multi-cycle jobs where the multiplier sentinel, the plan-file contract, and the seven-step waterfall keep the agent honest across days, not just minutes. The mechanisms in this essay are designed to scale up that way without losing their grip.

But a phase is itself a plugin. So is the orchestrator. So is everything that runs in the always-on layer. The brain's growth — the brain's *capacity* to grow — depends on a standardized way of building, packaging, and evolving plugins.

The phases and the waterfall are mechanisms. How do you BUILD a new phase that fits this design?

Next.

---

*Essay 6 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Always-On Digital Cortex](05-the-always-on-digital-cortex.html) — the always-on plugins and the CLAUDE.md hierarchy as information bus.*
*Next: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*
