---
title: "VERIFY — Independent Eyes"
date: "May 2026"
slug: "verify"
read_time: "7 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, Verify]
status: drafting
version: v0.1.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# VERIFY — Independent Eyes

*Essay 6.6 of 10 — The Markov Phasic Brain.*

---

VERIFY is scripts-only. *[ref: verify-bash-whitelist-scripts-only | phase_verify/hooks/verify-guard.sh:349-365 | VERIFY's Bash case arm allows bash invocations of tests/ scripts/ paths and git read-only commands; blocks git add, file writes (echo > / sed -i / mv / cp / rm), --hook flags, and package managers.]*

The agent cannot edit code in VERIFY. It can read any file in the cycle's scope, by design. It can run tests. It can run validators. And it can dispatch a particular class of subagent — *auditors* — whose entire job is to read the executed work and report whether each acceptance criterion holds. *[ref: verify-dispatches-auditor-subagents | phase_verify/agents/CLAUDE.md:8-16 | The Defined Subagents table lists VERIFY's auditor roster: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker — each scoped to evaluate one slice of the cycle's work.]*

---

## Two coupled authorities

VERIFY carries two authorities the other phases don't, and they're tightly coupled. It is the only phase that can edit the plan files in their respective drafting stages — the .md while `plan_state` is `drafting`, the .yaml while `plan_state` is `yaml_drafting` — and it is the only phase that can ask the user to approve them.

The approval mechanism is mechanical: VERIFY asks via AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, and on a "yes" the phase calls `plan.sh approve-md` or `plan.sh approve-yaml`, flipping `plan_state` forward. The prefixes are phase-gated — they are rejected anywhere outside VERIFY.

Both authorities flow from the same role: VERIFY is the cycle's final guardrail, the phase that refines the artifact and then stands between it and the state flip that promotes it. *[ref: verify-edits-plan-md-files | phase_verify/hooks/verify-guard.sh:257-265 | verify-guard's path branch allows edits to */plans/plan_*.md — VERIFY is the only phase with write access to the drafting plan file.]*

---

## The auditor family

Auditor subagents are read-only researchers, scoped narrowly to one slice of the cycle. The prototype ships an initial set — one per cycle slice — and the set grows as new perspectives prove worth auditing.

One re-walks the working memory the OBSERVE phase produced and asks whether it gave PLAN enough to work with. One judges the plan itself — were the items specific enough to implement without guessing, were the acceptance criteria testable, would another agent have reached the same implementation from these instructions, or did the plan leave gaps that forced EXECUTE to improvise.

One walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. One compares what was built against what the plan specified — flagging over-engineering, missed items, and silent deviations. One assesses the quality of the change itself: scope discipline, edit patterns, structural consistency.

A family of perspectives, deliberately composed so that no single one dominates the verdict. None of them are allowed to fix what they find — they only report. *[ref: verify-entry-voice-lists-auditors | phase_verify/hooks/verify-sensor.sh:125-129 | VERIFY's entry voice fires on phase entry and names the verify-* auditors the agent should launch: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker.]*

The reason VERIFY is its own phase is the same reason a compiler is not the same process as the programmer. Self-verification is biased. The hand that built the code wants to see the code as correct. A separate phase, with separate tools, run by a separate cognitive posture — and frequently delegated to subagents for independence — gives the verification an honest chance to catch what execution missed.

---

## The outcomes

VERIFY produces a structured pass/fail report against the plan's acceptance criteria. The report goes into the plan document and into the working CLAUDE.md.

Four outcomes are possible. Three of them route the cycle — forward to CONDENSE, backward for a small fix, backward for a deeper reset. The fourth is different in kind: a state flip on the plan itself, requested from the user and recorded on the job. The flip is not the end of the plan; it just promotes its stage. The plan's actual ending is a separate signal — `seal-plan` — fired later, when the plan has nothing left to teach.

If everything passes, the orchestrator advances the job to CONDENSE.

If something minor fails — a typo, a missed import, a comment that wasn't updated — VERIFY transitions backward to EXECUTE, which gets a chance to fix the small thing and re-checkpoint. The plan is not amended; only the implementation is corrected. *[ref: verify-backward-default-routes-to-execute | phase_verify/scripts/verify-commit.sh:67-81 | verify-commit's --backward flag accepts execute/plan/observe as destination; when no destination is given, BACKWARD_DEST defaults to execute — the minor-fix route preserves the plan, retries the implementation.]*

If something major fails — an acceptance criterion that the plan can't meet, a discovery that the observation was incomplete — VERIFY transitions backward all the way to OBSERVE or PLAN. The orchestrator records the rollback as part of the job's history. The cycle restarts with the lesson learned. *[ref: back-command-persists-rollback-state | phasic_system/scripts/phase.sh:325-336 | phase.sh back writes the rollback to data.json via jq, setting current_phase to the new destination (and optionally suppress_next_cycle_increment) — the rollback persists in the job's state history.]*

If the plan is mature, VERIFY asks the user — AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, gated to fire only from this phase. On a "yes," VERIFY calls `plan.sh approve-md` or `plan.sh approve-yaml`, `plan_state` flips forward, and the cycle advances to CONDENSE the same way a clean pass does. The state change is recorded on the plan, not on the cycle's verdict — the plan stays alive, promoted to its next stage. Only `seal-plan`, fired later when the plan has nothing left to teach, actually retires it. *[ref: legacy-plan-complete-validator | job_core/hooks/question-capture.sh:133-149 | The current prototype routes plan approval through a [PLAN-COMPLETE] validator in job_core that fires in any phase; the design intent renames to [PLAN-APPROVAL]/[YAML-APPROVAL] and moves the handler into phase_verify with a phase-of-firing gate.]*

---

## Situational edges and the Markov property

The backward edges are situational rather than a fixed menu — VERIFY rolls back to whichever prior phase the failure actually points at, and the approval-flip outcome is not a routing at all but a state change on the plan — and it is this discipline of choosing where to go, edge by edge, that gives the phasic layer its name.

**Forward transitions are automatic** when the gate criteria are met; **backward transitions are explicit** and the agent has to choose where to roll back to. The state of the cycle is fully captured in the orchestrator's data file — current phase, cycle number, multiplier, point counter, and a few transition flags (pre-gmode stash, suppress-increment, forwarded). No hidden continuation.

Any phase can be re-entered, but only by rolling back along defined edges. This is the Markov property the title leans on: the cycle's next move is a function of its present state, not of the path that got it there. *[ref: phasic-state-minimal-no-hidden-history | phasic_system/docs/README.md:102-123 | phasic_system's data model is intentionally minimal: jobs carry only id, current_phase, cycle, and a suppress flag — phase history is NOT stored; git commits with phase prefixes ARE the audit trail.]*

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
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.2. Backward transitions are explicit choices, not automatic fallbacks."
-->

When VERIFY passes, the orchestrator advances the job to CONDENSE.

---

*Essay 6.6 of 10 — The Markov Phasic Brain.*

*Previous: [Essay 6.5 — EXECUTE: Build, in Scope, in Steps](06_5-execute.html) — the universal file-creator, checkpoints, delegation bias.*
*Next: [Essay 6.7 — CONDENSE: The Cognitive Organ](06_7-condense.html) — the seven-step waterfall, the cycle's metabolism.*




