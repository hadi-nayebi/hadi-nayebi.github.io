---
title: "OBSERVE — Read Wide, Write Once"
date: "May 2026"
slug: "observe"
read_time: "5 min"
tags: [Architecture, Seed Agent, OPEVC, Phases]
status: draft
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# OBSERVE — Read Wide, Write Once

*Essay 6.3 of 8 — The Markov Phasic Brain.*

---

[Essay 6.2](06_2-discipline-and-map.html) drew the full transition graph and named the tool-restriction discipline that makes each phase distinct. Now we open the first compartment — the entry phase that decides what the rest of the cycle will work on.

---

## OBSERVE — Read Wide, Write Once

OBSERVE is the entry phase. Most jobs start here. It's also the phase that gets re-entered after a verification failure, when the agent has discovered the plan was wrong and needs to re-gather context. *[ref: agent-advance-only-idle-to-observe | phasic_system/scripts/phase.sh:215-221 | The agent-callable advance branch dies unless current_phase is idle and hardcodes the next phase as observe; OBSERVE is structurally the only entry phase the agent can initiate.]*

The job of OBSERVE is to populate the working memory — the relevant CLAUDE.md files — with enough context that PLAN can produce a real plan. Reading the codebase. Reading the agent's own knowledge directory. Asking the user clarifying questions. Pulling in external documentation. *[ref: observe-gathers-context-into-claude-md | phase_observe/CLAUDE.md:20-22 | OBSERVE's stated objective: gather needed context into CLAUDE.md files so plan/execute/verify have the information they need. Each CLAUDE.md update declares a directory as editable in execute.]*

OBSERVE cycle 1 carries one decision that shapes everything downstream: which form the job takes. The agent classifies into one of three — a single-cycle deep job that runs freestyle and dissolves with its cycle, a multi-cycle job with an `.md` plan that refines across cycles, or a multi-cycle job that has already earned a parseable `.yaml` plan injected at every phase entry. The third form evolves out of the second through an approval gate; it is not chosen up front. PLAN inherits the classification and names the `plan_file` accordingly — `false` for single-cycle, a path for multi-cycle — but the framing happens here, in OBSERVE, before the first acceptance criterion is written. *[ref: plan-file-named-once-in-plan | phase_plan/scripts/plan.sh:335-376 | set-plan-file is PLAN's cycle-1-only public command; it accepts false for single-cycle or a plan_*.md path for multi-cycle, dies on any later re-call, and locks the form OBSERVE classified into for the rest of the job.]*

The only thing the agent is allowed to write in OBSERVE is CLAUDE.md content. That single restriction, more than anything else, is what forces observation to actually happen. There is no escape into action. *[ref: observe-claude-md-only-staging-principle | phase_observe/docs/principles.md:48-54 | Principle 6 of OBSERVE's design docs: observe-commit.sh stages only CLAUDE.md files; non-CLAUDE.md staged files trigger anomaly warnings. Rationale: observe is read-only for project files, no silent fix.]*

OBSERVE is also where the most distinctive seed-agent mechanism lives. We meet it here, and it will return through every phase that follows.

The mechanism is what the prototype calls the **multiplier sentinel**: a per-phase scalar that starts at zero and locks every tool until the agent sets a real value. The setter is a small CLI call the agent must make as its very first action — picking a value from a fixed range between 0.5 and 3.0. Once set, the value cannot be changed for that phase entry. The same pattern applies to every other phase. The value scales how much each action in this phase counts — picking high makes each action count for more, picking low makes each action count for less. We come back to what that *means* — and why a smaller number declares a larger phase — at the close of this essay series. It is more interesting than it looks. *[ref: multiplier-sentinel-locks-all-tools | phase_observe/hooks/observe-guard.sh:185-202 | Sentinel-lock gate: when the main session enters OBSERVE the multiplier is zero; every tool except the observe.sh set-multiplier Bash invocation is blocked until the agent picks a value in 0.5-3.]*

OBSERVE also has two intermediate gates that shape the rhythm of the phase from the inside. The first is a *minimum-synthesis* gate: the agent has to read enough before any write into CLAUDE.md is allowed. The block message the agent sees is plain — "you have to read before you can write." The second is a *maximum-accumulation* gate: once the agent has read for a while without synthesizing, further reading is blocked until it puts something into CLAUDE.md. The block message is similarly plain — "you have read enough; synthesize before continuing." The arithmetic underneath those gates is hidden from the agent; only the block messages surface, and only when a gate fires. *[ref: min-gate-max-gate-paired | phase_observe/hooks/observe-guard.sh:211-259 | Max-accumulation gate blocks Read/Edit/Bash/Web/Agent once points_since hits MAX_ACCUMULATION_POINTS (default 25); the paired min-synthesis gate at line 285 blocks CLAUDE.md edits below MIN_SYNTHESIS_POINTS (default 3).]*

OBSERVE also dispatches its share of subagents. A typical OBSERVE phase will fan out two to four research subagents in parallel, each pursuing a different question, each returning a structured synthesis. The main session orchestrates; the subagents investigate. The roster of specialized observe subagents (read-only researchers, comparison agents, web-fetchers, and so on) is currently around a dozen. The 80/20 split between main-session orchestration and subagent execution — and why the architecture insists on it — is the subject of [Essay 7](07-the-plugin-kit.html). *[ref: observe-12-subagents-80-20 | phase_observe/agents/CLAUDE.md:1-19 | Observe workforce: 12 specialized agents (codebase-explorer, contradiction-finder, web-researcher, etc.) with 80/20 architecture — main session orchestrates 20 percent, subagents do 80 percent; subagents are exempt from point gates.]*

When OBSERVE believes it has enough, it commits. The commit is the phase's exit ritual. After the commit, the orchestrator advances the job to PLAN. There is no skipping back through OBSERVE without rolling the job backward — and rolling backward is allowed, but it is explicit, not silent. *[ref: observe-commit-then-advance-to-plan | phase_observe/scripts/observe-commit.sh:371-382 | After the git commit succeeds, the script calls phase.sh --hook advance to move OBSERVE→PLAN; if advance fails, it logs a warning rather than silently dropping the move.]*

---

OBSERVE writes once, into the working memory, and hands the result forward. The next sub-essay opens PLAN — the phase that turns observations into a binding contract before any code is written.

---

*Essay 6.3 of 8 — The Markov Phasic Brain — Hadosh Academy series on agent architecture.*

*Previous: [Essay 6.2 — The Discipline and the Map](06_2-discipline-and-map.html) — the full transition graph and the tool-restriction pedagogy.*
*Next: [Essay 6.4 — PLAN: Decide, Then Lock](06_4-plan.html) — turning observation into a binding contract.*

---Ob---

---Pl---

---Ex---

---Ve---
