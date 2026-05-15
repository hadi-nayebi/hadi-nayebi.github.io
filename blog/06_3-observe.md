---
title: "OBSERVE — Read Wide, Write Once"
date: "May 2026"
slug: "observe"
read_time: "8 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: draft
version: v0.2.0
audience: "Tier 2"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# OBSERVE — Read Wide, Write Once

*Essay 6.3 — The Markov Phasic Brain, Part 3 of 10.*

---

[Essay 6.2](06_2-discipline-and-map.html) drew the full transition graph and named the tool-restriction discipline that makes each phase distinct. Now we open the first compartment — the entry phase that decides what the rest of the cycle will work on.

---

## What OBSERVE does

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context. *[ref: agent-advance-only-idle-to-observe | phasic_system/scripts/phase.sh:215-221 | The agent-callable advance branch dies unless current_phase is idle and hardcodes the next phase as observe; OBSERVE is structurally the only entry phase the agent can initiate.]*

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation. *[ref: observe-gathers-context-into-claude-md | phase_observe/CLAUDE.md:20-22 | OBSERVE's stated objective: gather needed context into CLAUDE.md files so plan/execute/verify have the information they need. Each CLAUDE.md update declares a directory as editable in execute.]*

OBSERVE cycle 1 carries one decision that shapes everything downstream: which form the job takes. The agent classifies into one of three — a single-cycle deep job that runs freestyle and dissolves with its cycle, a multi-cycle job with an `.md` plan that refines across cycles, or a multi-cycle job that has already earned a parseable `.yaml` plan injected at every phase entry. The third form evolves out of the second through an approval gate; it is not chosen up front. PLAN inherits the classification and names the `plan_file` accordingly — `false` for single-cycle, a path for multi-cycle — but the framing happens here, in OBSERVE, before the first acceptance criterion is written. *[ref: plan-file-named-once-in-plan | phase_plan/scripts/plan.sh:335-376 | set-plan-file is PLAN's cycle-1-only public command; it accepts false for single-cycle or a plan_*.md path for multi-cycle, dies on any later re-call, and locks the form OBSERVE classified into for the rest of the job.]*

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content, and only inside its own footer section. The restriction is what forces observation to actually happen — there is no escape into action. *[ref: observe-claude-md-only-staging-principle | phase_observe/docs/principles.md:48-54 | Principle 6 of OBSERVE's design docs: observe-commit.sh stages only CLAUDE.md files; non-CLAUDE.md staged files trigger anomaly warnings. Rationale: observe is read-only for project files, no silent fix.]*

OBSERVE is also where the most distinctive seed-agent mechanism lives — the **multiplier sentinel**, a per-phase scalar that starts at zero and locks every tool until the agent sets a real value in 0.5–3.0. Once set, the value cannot be changed for that phase entry. The same pattern applies to every other phase. We come back to what that *means* — and why a smaller number declares a larger phase — at the close of this essay series. *[ref: multiplier-sentinel-locks-all-tools | phase_observe/hooks/observe-guard.sh:185-202 | Sentinel-lock gate: every tool except the observe.sh set-multiplier Bash invocation is blocked until the agent picks a value in 0.5-3.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — OBSERVE's three internal locks that shape the phase from the inside.
  Style: Match `opevc-cycle-blackboard.png` exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the gate boxes;
  white chalk for labels and arrows; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, or gate descriptors.
  Layout: A horizontal flow across the board, left to right, showing the OBSERVE phase as a chalk-drawn corridor with three sequential gates.
    Gate 1 (cyan box, leftmost, at the phase entry): labeled "multiplier sentinel" with a small "0" inside a chalk circle above it, and a white chalk note "all tools locked" beneath.
    Gate 2 (green box, middle-left): labeled "min synthesis" with a white chalk note "read before write" beneath.
    Gate 3 (orange box, middle-right): labeled "max accumulation" with a white chalk note "synthesize before reading more" beneath.
    Between Gate 1 and Gate 2, a chalk arrow with a small pink label "set 0.5 to 3" above it.
    Between Gate 2 and Gate 3, a curved chalk loop arrow looping back on itself, labeled "read / write rhythm" in white chalk.
    To the right of Gate 3, a final white chalk arrow exits the corridor, labeled "commit" pointing to a small magenta circle labeled "plan".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "multiplier sentinel", "0", "all tools locked", "min synthesis", "read before write", "max accumulation", "synthesize before reading more", "set 0.5 to 3", "read / write rhythm", "commit", "plan", plus the caption below. No other words, file names, folders, or gate descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.3. OBSERVE's three gates — the sentinel locks entry, the paired gates shape the rhythm."
-->

Two intermediate gates shape the rhythm of the phase from inside. A *minimum-synthesis* gate makes the agent read enough before any write into CLAUDE.md is allowed. A *maximum-accumulation* gate blocks further reading once the agent has read for a while without synthesizing. The arithmetic underneath is hidden from the agent; only the block messages surface, and only when a gate fires. *[ref: min-gate-max-gate-paired | phase_observe/hooks/observe-guard.sh:211-259 | Max-accumulation gate blocks Read/Edit/Bash/Web/Agent once points_since hits MAX_ACCUMULATION_POINTS (default 25); the paired min-synthesis gate at line 285 blocks CLAUDE.md edits below MIN_SYNTHESIS_POINTS (default 3).]*

OBSERVE also dispatches its share of subagents. A typical phase fans out two to four research subagents in parallel — the main session orchestrates, the subagents investigate. The 80/20 split is the subject of [Essay 7](07-the-plugin-kit.html). *[ref: observe-12-subagents-80-20 | phase_observe/agents/CLAUDE.md:1-19 | Observe workforce: 12 specialized agents (codebase-explorer, contradiction-finder, web-researcher, etc.); main session orchestrates 20 percent, subagents do 80 percent; subagents are exempt from point gates.]*

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent. *[ref: observe-commit-then-advance-to-plan | phase_observe/scripts/observe-commit.sh:371-382 | After the git commit succeeds, the script calls phase.sh --hook advance to move OBSERVE→PLAN; if advance fails, it logs a warning rather than silently dropping the move.]*

## The friction it enforces

The tool restrictions in OBSERVE are not a polite suggestion. A guard hook intercepts every tool call and rejects the ones outside the phase's allowlist.

Read passes for project files, but only when the direct-action budget allows it. Every project-file read outside `.claude/` consumes a point from a small pool; the pool is empty by default and refills only when the main session dispatches an observe subagent. The architecture builds the 80/20 split into the gate itself — the main session that tries to read everything by hand hits the budget floor and is forced to delegate. *[ref: direct-action-budget-grant-on-subagent | phase_observe/hooks/observe-guard.sh:106-127 + phase_observe/hooks/observe-guard.sh:372-379 | direct_action_budget_remaining and has_direct_action_budget gate Read on non-CLAUDE.md non-memory files; +3 per observe-* subagent dispatch, -1 per direct read. Fresh entries hold zero grants — the gate is inactive until the first subagent fires, then activates and enforces 80/20.]*

The same direct-action budget machinery is wired into every other phase too. PLAN, EXECUTE, VERIFY, and CONDENSE each carry their own +3-grant / -1-consume arithmetic, calibrated to that phase's own subagent roster (PLAN dispatches plan-* analyzers, EXECUTE dispatches execute-* workers, VERIFY dispatches verify-* auditors, CONDENSE dispatches condense-* extractors). The 80/20 enforcement is universal across the cycle; OBSERVE is shown here because it is where the main session usually first hits the gate, but the same shape repeats four more times. *[ref: direct-action-budget-universal-across-phases | phase_observe + phase_plan + phase_execute + phase_verify + phase_condense — each plugin's hooks/<phase>-guard.sh + hooks/<phase>-tracker.sh | All five phase plugins implement direct_action_budget identically: a per-phase pool seeded at zero, granted +3 per phase-specific subagent dispatch (matched on AGENT_NAME prefix), consumed -1 per direct Read/Write outside the .claude/ + memory whitelist. The 80/20 thesis is enforced structurally five times over, not just here.]*

Write is the tighter cut. The only file the agent edits in OBSERVE is a CLAUDE.md, and the edit has to land *below* OBSERVE's own footer marker. The other phases' footers — `---Pl---`, `---Ex---`, `---Ve---` — are read-only to OBSERVE. The user's mental model that "OBSERVE writes to CLAUDE.md" is right; the precise rule is sharper. Each phase writes strictly to its own footer section; the section guard rejects any edit that touches another phase's anchor. Compartmentalization is enforced down to the byte. *[ref: observe-edits-below-own-marker | phase_observe/hooks/observe-guard.sh:285-310 | The CLAUDE.md edit branch invokes the shared check_section_edit("---Ob---", FILE, OLD, NEW) helper; cross-section edits are blocked. The same helper backs PLAN, EXECUTE, and VERIFY — one library, four markers.]*

Questions are the third surface. When OBSERVE genuinely needs the architect, the agent uses a registered prefix — `[WAITING]` for generic clarification, `[POINT-BOOST]` when the budget gate has tightened past useful work. A bare clarifying question with no prefix is rejected by the question-discipline gate before the architect ever sees it.

## A worked example

Picture a multi-cycle plan-job on its third cycle. The `.md` plan has been approved; a `.yaml` was authored on cycle 2; the orchestrator injects the .yaml's current objective into OBSERVE at phase entry.

The agent enters OBSERVE. The multiplier sentinel is unset; every tool is locked. The agent reads the injected objective, forecasts the scope of this cycle's observation work, picks 1.5 on the multiplier. The lock lifts.

The agent reads the injected .yaml back, reads the working CLAUDE.md for cycle 2's execution notes, walks `.claude/knowledge/` for prior lessons. It dispatches two observe-* subagents in parallel — one to map the target repo's current state, one to look for contradictions between the .yaml objective and what cycle 2 actually shipped. Each dispatch grants +3 to the direct-action budget, so the main session keeps headroom for its own targeted reads.

A contradiction surfaces — the .yaml describes a marker schema that no longer matches cycle 2's code. The agent does not silently choose; it asks the architect via `[WAITING]` for a routing decision. The architect answers. The agent writes a synthesis paragraph into the working CLAUDE.md — beneath the `---Ob---` marker, never above it — and commits. PLAN inherits.

## Backward edges

OBSERVE is the phase agents re-enter when things go wrong. A failed VERIFY routes back here. So does an EXECUTE that runs into a path the plan didn't list. Re-entry is allowed; what is not allowed is silent re-entry — every backward edge commits an explicit "backward to OBSERVE" record so the cycle history reads honestly.

OBSERVE itself only routes forward — to PLAN. The agent cannot self-advance to EXECUTE; the orchestrator hardcodes the next phase. That single rule preserves the OPEVC discipline against an agent that "knows what it wants to build" and would otherwise skip the plan-authoring step.

## What you would customize

OBSERVE is the most customization-friendly phase in the architecture, because what counts as "enough context" is exactly where your seed differs from the next architect's.

The architect would tune the *subagent roster*. The current dozen observe subagents — codebase explorers, contradiction finders, web researchers — are calibrated to the prototype's own work. A legal-research seed would swap in case-law searchers; a finance-research seed would swap in filings parsers and time-series analysts. The roster is the surface; the entries are yours.

The architect would tune the *gate thresholds*. The defaults — three points to write, twenty-five to be forced to write — were calibrated against the prototype's tempo. Sharper jobs want lower numbers; long structural sweeps want higher ones.

The architect would tune the *question registry*. Your seed may need a `[STAKEHOLDER-CHECK]` prefix for a domain where decisions require named approval, or a `[CITATION-NEEDED]` prefix that routes through a different downstream handler. The registry is short by design — short enough that every prefix is meaningful — and extensible.

What the architect would **not** customize is the read-before-write principle itself. The principle is the floor: an observation phase that lets the agent write before reading is not an observation phase.

The deepest payoff of OBSERVE is the cognitive failure mode it prevents: the assumption-driven plan. An agent that skips observation does not skip having a model of the world — it just relies on the model it already had, which was shaped by the prompt and the LLM's prior, neither of which has read the codebase or the architect's actual situation. The structural insistence on observation before action is the prototype's answer to LLM-mediated assumption drift. The friction is the pedagogy. The phase is the compartment.

---

OBSERVE writes once, into the working memory, and hands the result forward. The next sub-essay opens PLAN — the phase that turns observations into a binding contract before any code is written.

---

*Essay 6.3 — The Markov Phasic Brain, Part 3 of 10.*

*Previous: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the tool-restriction pedagogy.*
*Next: [Essay 6.4 — PLAN: Decide, Then Lock](06_4-plan.html) — turning observation into a binding contract.*




