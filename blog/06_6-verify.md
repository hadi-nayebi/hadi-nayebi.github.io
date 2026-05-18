---
title: "VERIFY — Independent Eyes"
date: "May 2026"
slug: "verify"
read_time: "7 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, Verify]
status: draft
version: v0.2.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/b6/markov-phasic-brain-b6.png"
---

# VERIFY — Independent Eyes

*Essay 6.6 — The Markov Phasic Brain, Part 6 of 10.*

---

VERIFY is scripts-only. *[ref: verify-bash-whitelist-scripts-only | .claude/plugins/phase_verify/hooks/verify-guard.sh:351-397 | VERIFY's Bash case arm allows bash invocations of tests/ scripts/ paths and git read-only commands; blocks git add, file writes (echo > / sed -i / mv / cp / rm), --hook flags, and package managers.]*

The agent cannot edit code in VERIFY. It can read any file in the cycle's scope, by design. It can run tests. It can run validators. And it can dispatch a particular class of subagent — *auditors* — whose entire job is to read the executed work and report whether each acceptance criterion holds. *[ref: verify-dispatches-auditor-subagents | .claude/plugins/phase_verify/agents/CLAUDE.md Defined Subagents section | The Defined Subagents table lists VERIFY's auditor roster: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker — each scoped to evaluate one slice of the cycle's work.]*

---

## Two coupled authorities

VERIFY carries two authorities the other phases don't, and they're tightly coupled. It is the only phase that can edit the plan files in their respective drafting stages — the .md while `plan_state` is `drafting`, the .yaml while `plan_state` is `yaml_drafting` — and it is the only phase that can ask the user to approve them. *[ref: verify-two-coupled-authorities-md-yaml | .claude/plugins/phase_verify/hooks/verify-guard.sh:257-285 + .claude/plugins/job_core/hooks/question-capture.sh:148-153 | The plan-file ALLOW branch in verify-guard lets VERIFY edit `*/plans/plan_*.md` and the parallel .yaml when `plan_state` matches the file's stage. The PLAN-APPROVAL/YAML-APPROVAL phase-of-firing gate in question-capture rejects approval prefixes outside VERIFY — only VERIFY can both refine the plan and ask for its approval.]*

The approval mechanism is mechanical: VERIFY asks via AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, and on a "yes" the phase calls `plan.sh approve-md` or `plan.sh approve-yaml`, flipping `plan_state` forward. The prefixes are phase-gated — they are rejected anywhere outside VERIFY. *[ref: verify-approval-phase-firing-gate | .claude/plugins/job_core/hooks/question-capture.sh:148-153 | The validator queries phase.sh for the focused job's current phase; if not `verify`, it emits the `plan-approval-wrong-phase` voice and exits 2. The `[PLAN-APPROVAL]` and `[YAML-APPROVAL]` prefixes can only fire from VERIFY; on the user's approve answer the matching handler calls plan.sh approve-md or approve-yaml.]*

Both authorities flow from the same role: VERIFY is the cycle's final guardrail, the phase that refines the artifact and then stands between it and the state flip that promotes it. *[ref: verify-edits-plan-md-files | .claude/plugins/phase_verify/hooks/verify-guard.sh:257-265 | verify-guard's path branch allows edits to */plans/plan_*.md — VERIFY is the only phase with write access to the drafting plan file.]*

---

## VERIFY's scoped edit authority

A common shorthand says "VERIFY cannot edit files." It is half-right. The precise rule is that VERIFY cannot edit *project source* — code, scripts, configuration, anything outside the brain. Inside the brain, VERIFY's write authority is scoped, not absent, and the scope is exactly three paths. *[ref: verify-blocks-project-source-edits | .claude/plugins/phase_verify/hooks/verify-guard.sh:338 | Verify-guard's Edit/Write/MultiEdit case arm reaches a final `block` for non-CLAUDE.md, non-plan, non-memory files: `block "verify.guard.project-edit" "scope" "[phase_verify] BLOCKED: No project file edits during verify. Go back to execute."` — project source is off-limits in this phase.]*

The first is the *plan files* in their respective drafting stages, just covered — the .md while `plan_state` is `drafting`, the .yaml while `plan_state` is `yaml_drafting`, each scoped to the focused job's declared `plan_file`. Edits to any other plan, or to a plan in any other state, are rejected at the tool boundary. *[ref: verify-plan-edit-scoped-to-focused-job | .claude/plugins/phase_verify/hooks/verify-guard.sh Plan-files ALLOW branch (A5 + A9 alpha-migration 2026-05-12) | The plan-file edit branch resolves the focused job's plan_file, allows edits only to that basename or the parallel .yaml, and refuses .yaml edits unless plan_state is yaml_drafting — three nested scopes on a single edit path.]*

The second is the *altered-list CLAUDE.md files* — the same scope EXECUTE just finished writing into, inherited by VERIFY at phase entry. The agent appends its pass/fail findings to those CLAUDE.md files, but the edit lands strictly below `---Ve---`. Cross-section edits — attempts to amend OBSERVE's or PLAN's or EXECUTE's footer record — are rejected by the same shared section-check library every phase guard uses. VERIFY cannot rewrite history; it can only file its report under its own anchor. *[ref: verify-claude-md-edit-section-bounded | .claude/plugins/phase_verify/hooks/verify-guard.sh:289-334 | The CLAUDE.md edit branch confirms the file is in the altered list, blocks Write on existing files (Edit only), then runs check_section_edit with "---Ve---" — the same library backing every phase's section enforcement.]*

The third is the *memory files* — the user-side persistence layer under `.claude/projects/.../memory/`. Memory edits land in any phase, including VERIFY, because the memory layer is the always-on persistence the seed agent uses for cross-cycle and cross-session learning; the phase-specific guards explicitly exempt memory paths from their scope checks. *[ref: verify-memory-edits-always-allowed | .claude/plugins/phase_verify/hooks/verify-guard.sh:249-250 | Inside verify-guard's Edit|Write|MultiEdit case arm, the very first line short-circuits with exit 0 for any path matching `/.claude/projects/.../memory/` — memory edits are always allowed, irrespective of altered list or section.]*

The right shorthand, then: VERIFY's edit authority is scoped. It can refine the plan, file its findings under its own footer, and update the memory layer. It cannot touch project source, cannot create new CLAUDE.md files, and cannot rewrite the prior phases' footer records. The scope is what makes VERIFY's verdict structurally trustworthy — VERIFY cannot quietly fix what it found wrong; it can only report and route.

---

## The auditor family

Auditor subagents are read-only researchers, scoped narrowly to one slice of the cycle. The prototype ships an initial set — one per cycle slice — and the set grows as new perspectives prove worth auditing. *[ref: verify-auditor-roster-five-members | .claude/plugins/phase_verify/agents/ | The agents/ directory ships five auditor definitions: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker. All are read-only-in-effect (none has Edit or Write access; tools vary across Read, Read+Glob+Grep, Read+Bash, Read+Glob+Grep+Bash) and carry Markov-brain modes (M1 receive-dispatch through M5 emit-verdict).]*

One re-walks the working memory the OBSERVE phase produced and asks whether it gave PLAN enough to work with. One judges the plan itself — were the items specific enough to implement without guessing, were the acceptance criteria testable, would another agent have reached the same implementation from these instructions, or did the plan leave gaps that forced EXECUTE to improvise. *[ref: verify-observe-and-plan-auditor-roles | .claude/plugins/phase_verify/agents/verify-observe-auditor.md + verify-plan-auditor.md | The observe-auditor evaluates whether OBSERVE gathered enough context for PLAN, scoped to CLAUDE.md Observe Actions and altered-list integrity. The plan-auditor's M2 scoped-investigate mode tests four properties: every plan item has a clear implementation target, acceptance criteria are testable, instruction clarity is sufficient for a different agent to converge to the same implementation, and plan scope matches the altered list.]*

One walks the cycle's commit graph and asks whether the checkpoints tell a coherent story. One compares what was built against what the plan specified — flagging over-engineering, missed items, and silent deviations. One assesses the quality of the change itself: scope discipline, edit patterns, structural consistency. *[ref: verify-execute-historian-evolution-auditor-roles | .claude/plugins/phase_verify/agents/verify-execute-auditor.md + verify-git-historian.md + verify-code-evolution-tracker.md | The execute-auditor evaluates implementation fidelity against the plan (items completed, gaps, over-engineering). The git-historian evaluates commit cadence and message quality as episodic memory. The code-evolution-tracker evaluates change quality: scope discipline, structural consistency, intentional vs accidental change.]*

A family of perspectives, deliberately composed so that no single one dominates the verdict. None of them are allowed to fix what they find — they only report. *[ref: verify-entry-voice-lists-auditors | .claude/plugins/phase_verify/hooks/verify-sensor.sh:125-129 | VERIFY's entry voice fires on phase entry and names the verify-* auditors the agent should launch: verify-observe-auditor, verify-plan-auditor, verify-execute-auditor, verify-git-historian, verify-code-evolution-tracker.]*

The reason VERIFY is its own phase is the same reason a compiler is not the same process as the programmer. Self-verification is biased. The hand that built the code wants to see the code as correct. A separate phase, with separate tools, run by a separate cognitive posture — and frequently delegated to subagents for independence — gives the verification an honest chance to catch what execution missed.

---

## The outcomes

VERIFY produces a structured pass/fail report against the plan's acceptance criteria. The report goes into the plan document and into the working CLAUDE.md. *[ref: verify-records-findings-in-plan-and-claude-md | .claude/plugins/phase_verify/hooks/verify-guard.sh:257-265 + verify-guard.sh:289-334 | Verify-guard allows edits along two file paths: the plan files in their drafting stages (scoped to the focused job's declared plan_file) and the altered-list CLAUDE.md files (Edit-only on existing files, section-bounded to `---Ve---`). VERIFY's pass/fail report lands in both — the plan document by refinement, the working CLAUDE.md by appending findings below its own anchor.]*

The outcomes split into two kinds: routing outcomes (forward to CONDENSE; backward to a prior phase for a small fix or a deeper reset) and the plan-state-flip outcome — a state change on the plan itself, requested from the user and recorded on the job. The flip is not the end of the plan; it just promotes its stage. The plan's actual ending is a separate signal — `seal-plan` — fired later, when the plan has nothing left to teach. *[ref: verify-outcomes-routing-vs-state-flip | .claude/plugins/phase_verify/scripts/verify-commit.sh:67-81 + .claude/plugins/phase_plan/scripts/plan.sh:846-862 | verify-commit.sh parses `--backward [execute|plan|observe]`, defaulting to execute when no destination is given — that is the routing outcome. plan.sh approve-md flips `plan_state` drafting → md_approved without archiving the plan file — that is the state-flip outcome. Only `seal-plan` archives the plan to completed_plan[].]*

If everything passes, the orchestrator advances the job to CONDENSE.

If something minor fails — a typo, a missed import, a comment that wasn't updated — VERIFY transitions backward to EXECUTE, which gets a chance to fix the small thing and re-checkpoint. The plan is not amended; only the implementation is corrected. *[ref: verify-backward-default-routes-to-execute | .claude/plugins/phase_verify/scripts/verify-commit.sh:67-81 | verify-commit's --backward flag accepts execute/plan/observe as destination; when no destination is given, BACKWARD_DEST defaults to execute — the minor-fix route preserves the plan, retries the implementation.]*

If something major fails — an acceptance criterion that the plan can't meet, a discovery that the observation was incomplete — VERIFY transitions backward all the way to OBSERVE or PLAN. The orchestrator records the rollback as part of the job's history. The cycle restarts with the lesson learned. *[ref: back-command-persists-rollback-state | .claude/plugins/phasic_system/scripts/phase.sh `back` case arm (hook-only, called by commit scripts with --backward) | phase.sh's `back` case arm writes the rollback to data.json via jq, setting current_phase to the new destination (and optionally suppress_next_cycle_increment via the suppress_flag branch) — the rollback persists in the job's state history.]*

If the plan is mature, VERIFY asks the user — AskUserQuestion with a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` prefix, gated to fire only from this phase. On a "yes," VERIFY calls `plan.sh approve-md` or `plan.sh approve-yaml`, `plan_state` flips forward, and the cycle advances to CONDENSE the same way a clean pass does. The state change is recorded on the plan, not on the cycle's verdict — the plan stays alive, promoted to its next stage. Only `seal-plan`, fired later when the plan has nothing left to teach, actually retires it. *[ref: plan-approval-validator-current | .claude/plugins/job_core/hooks/question-capture.sh PLAN-APPROVAL/YAML-APPROVAL validator (lines 128-149) + question-capture-hook.sh handler (lines 132-138) | The prototype routes plan approval through a `[PLAN-APPROVAL]` or `[YAML-APPROVAL]` validator — renamed from the legacy single-prefix form in the alpha-migration 2026-05-12. The current validator enforces a phase-of-firing gate that rejects these prefixes outside VERIFY; on the user's approve answer, the handler calls `plan.sh approve-md` or `plan.sh approve-yaml` to flip `plan_state` without archiving the plan file.]*

---

## Situational edges and the Markov property

The backward edges are situational rather than a fixed menu — VERIFY rolls back to whichever prior phase the failure actually points at, and the approval-flip outcome is not a routing at all but a state change on the plan — and it is this discipline of choosing where to go, edge by edge, that gives the phasic layer its name.

**Forward transitions are automatic** when the gate criteria are met; **backward transitions are explicit** and the agent has to choose where to roll back to. The state of the cycle is fully captured in the orchestrator's data file — current phase, cycle number, multiplier, point counter, and a few transition flags (pre-gmode stash, suppress-increment, forwarded). No hidden continuation. *[ref: phasic-data-file-schema-minimal | .claude/plugins/phasic_system/scripts/phase.sh L159 init + L228 suppress_next_cycle_increment + L361 pre_gmode_phase | The data.json job object initializes via phase.sh init with `{id, current_phase: "idle", cycle: 0}` and grows with phase-specific fields the orchestrator writes: current_phase per advance/back, cycle counter incremented at idle→observe, plus transition flags suppress_next_cycle_increment and pre_gmode_phase. No history list; phase changes overwrite current_phase in place.]*

Any phase can be re-entered, but only by rolling back along defined edges. This is the Markov property the title leans on: the cycle's next move is a function of its present state, not of the path that got it there. *[ref: phasic-state-minimal-no-hidden-history | .claude/plugins/phasic_system/docs/README.md Data Model section | phasic_system's data model is intentionally minimal: jobs carry only id, current_phase, cycle, and a suppress flag — phase history is NOT stored; git commits with phase prefixes ARE the audit trail.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — VERIFY's three backward edges and one forward edge.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the phase-node circles;
  white chalk for ALL labels and arrows; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, edge descriptors, or phase descriptors.
  Layout: One central pink chalk circle in the middle of the board labeled "verify". To the left of verify,
  three chalk arrows fan outward and land on three target circles:
    - short backward arrow → orange circle labeled "execute", small chalk note above the arrow: "minor fix"
    - mid-length backward arrow → green circle labeled "plan", chalk note above the arrow: "design flaw"
    - long backward arrow → cyan circle labeled "observe", chalk note above the arrow: "context gap"
  To the right of verify, one forward arrow → magenta circle labeled "condense", chalk note above the arrow: "pass".
  All four arrows are white chalk, slightly curved.
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "verify", "execute", "plan", "observe", "condense", "minor fix", "design flaw", "context gap", "pass", plus the caption below. No other words, file names, folders, or phase descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.6. Backward transitions are explicit choices, not automatic fallbacks."
-->

When VERIFY passes, the orchestrator advances the job to CONDENSE.

---

## A worked example

The multi-cycle plan-job from the prior sub-essays reaches its third cycle's VERIFY phase. The agent has revert-and-reauthored the marker schema in EXECUTE; the checkpoint commits are clean; the orchestrator advances the job to VERIFY.

The agent enters VERIFY. The multiplier sentinel is unset; every tool is locked. The agent forecasts a tighter phase than EXECUTE because the work is read-and-judge rather than write — picks 2.5 on the multiplier. The lock lifts. *[ref: verify-multiplier-sentinel-locks-tools-until-set | .claude/plugins/phase_verify/hooks/verify-guard.sh:169-186 | Verify-guard's Sentinel-Lock Gate fires when `current_mult == 0` (the fresh phase-entry state the tracker initializes): every productive tool blocks via the `multiplier-zero-block` voice, with one allowance — the Bash command running `verify.sh set-multiplier`. The lock lifts the moment the agent sets a value in 0.5-3, forcing an explicit scope forecast at entry.]*

The agent dispatches the auditor family in parallel. The verify-execute-auditor reads the cycle's commit graph and the altered-list diff. The verify-plan-auditor re-reads the .md plan and compares its acceptance criteria against the actual code change. The verify-observe-auditor walks the OBSERVE synthesis the cycle inherited from cycle 3's observation. The verify-git-historian audits the checkpoint cadence. None of them is allowed to fix what they find. *[ref: auditors-dispatch-parallel-read-only-effect | .claude/plugins/phase_verify/agents/ five auditor .md files | The five auditor agent definitions in phase_verify/agents/ each declare a tools field that excludes Edit, Write, and MultiEdit (verify-plan-auditor: Read; verify-execute-auditor and verify-observe-auditor: Read+Glob+Grep; verify-git-historian: Read+Bash; verify-code-evolution-tracker: Read+Glob+Grep+Bash). They are dispatched concurrently via the Agent tool and report verdicts; none can act on what it finds.]*

The verify-plan-auditor surfaces a gap. The cycle's acceptance criteria, written by PLAN, list a round-trip check for the new marker schema. The agent ran that check and it passed. But the auditor also notices the .md plan never declared the criterion for *backward-compatibility with cycle-2 cycle records* — code already on disk, marker schema is now the new shape, the old records can no longer be parsed. The acceptance criteria the cycle inherited were under-specified. Execution did exactly what was asked; the asking was incomplete. *[ref: verify-plan-auditor-tests-criteria-quality | .claude/plugins/phase_verify/agents/verify-plan-auditor.md M2 scoped-investigate mode | The plan-auditor's M2 mode reads the plan file plus all Plan Actions sections in CLAUDE.md and tests four properties: (a) every plan item has a clear implementation target, (b) acceptance criteria are testable, (c) instruction clarity sufficient that a different agent would converge to the same implementation, (d) plan scope matches the altered list.]*

The agent has a decision. The judgment-call criterion PLAN named — "if revert breaks downstream cycle-2 work, route a `[PENDING-JOB]` for CONDENSE" — partially covers this, but the under-specification is upstream of execute: PLAN missed it, not EXECUTE. The agent picks the major-fix path. It writes the auditor's finding into the working CLAUDE.md, below `---Ve---`; it edits the .md plan to add the backward-compat criterion (allowed — `plan_state` is `drafting`, file is the focused plan_file); it commits the verify checkpoint with `--backward plan`; the orchestrator routes the cycle back to PLAN. *[ref: verify-commit-backward-plan-destination | .claude/plugins/phase_verify/scripts/verify-commit.sh:67-81 | verify-commit's argument parser accepts `--backward` followed by an optional destination matching `^(execute|plan|observe)$`; the parser stores the match in BACKWARD_DEST and defaults to execute when none is given. The script then calls phase.sh back with the chosen destination, which rewrites current_phase in data.json.]*

The cycle does not lose its history. The rollback is recorded. PLAN inherits the sharpened criteria; the agent re-plans the backward-compat work alongside the marker schema work; the cycle continues with a tighter contract.

---

## What you would customize

VERIFY is the cycle's last word, and the architect has surfaces to bend.

The architect would tune the *auditor roster*. The prototype ships an initial set — observe-auditor, plan-auditor, execute-auditor, git-historian, code-evolution-tracker — calibrated to seed-agent work where the artifacts are code and plans. A legal-research seed would swap in citation-checkers and precedent-comparison auditors. A finance-analysis seed would swap in number-reconciliation and filing-cross-check auditors. The auditor family is the surface; the perspectives it composes are yours. *[ref: verify-auditor-roster-as-customization-surface | .claude/plugins/phase_verify/agents/ | Adding a new auditor is dropping a Markdown agent definition into phase_verify/agents/ — Read tool only by convention, with a description that gates dispatch. The seed's auditor roster is the customization surface for domain change; verify-guard's scope rules stay invariant across swaps.]*

The architect would tune the *approval-question wording*. `[PLAN-APPROVAL]` and `[YAML-APPROVAL]` are the prototype's gates because the prototype's plans go through a two-stage .md-then-.yaml lifecycle. A simpler seed might collapse approval to a single prefix; a richer one might add `[DRAFT-APPROVAL]`, `[REVIEW-APPROVAL]`, and `[RELEASE-APPROVAL]` for staged sign-offs. The question-discipline registry takes the new prefixes; the verify-side handler maps them to the right `plan_state` transition. *[ref: plan-approval-prefixes-as-customization-surface | .claude/plugins/lib/prefix-registry.conf + .claude/plugins/phase_plan/scripts/plan.sh:849-880 | The PLAN-APPROVAL and YAML-APPROVAL prefixes are entries in the shared prefix-registry (BYPASS_PREFIXES + ZERO_POINT_PREFIXES); the matching handlers call plan.sh approve-md and approve-yaml. Adding new approval prefixes (DRAFT-APPROVAL, RELEASE-APPROVAL) means registering them and mapping each to the right plan_state transition in plan.sh.]*

The architect would tune the *plan-edit scope rules*. The current scope is tight — VERIFY can only edit the focused job's `plan_file` and only when its state allows. A seed wanting looser refinement could widen the scope to any plan in `drafting`. A seed wanting tighter discipline could add per-section locks (acceptance criteria are append-only; goal is immutable once cycle 1 commits). *[ref: verify-plan-edit-scope-as-customization-surface | .claude/plugins/phase_verify/hooks/verify-guard.sh:262-285 | The plan-files ALLOW branch resolves the focused job's plan_file via plan.sh --hook plan-file and accepts edits only to that basename or its parallel .yaml, refusing .yaml edits unless plan_state is yaml_drafting. The scope is three nested checks on a single edit path; a seed could widen it (any plan in drafting) or tighten it (per-section locks).]*

What the architect would **not** customize is the inability to edit project source. The principle is the floor: a verification phase that lets the hand that built the code also rewrite it is not verification, it is hand-washing.

A consulting practice could install the same separation. The engagement-review agent reads the deliverable, scores it against the proposal's acceptance criteria, asks the partner for sign-off via a structured question — but cannot edit the deliverable itself. Only the build-side agent can act on the review. The honest design-limit is worth naming: the auditor's verdict is LLM-interpreted judgment, not mathematics. Backward-versus-forward routing depends on the agent honestly classifying severity; the user-approval gate depends on the user actually reading. The structural separation is the enforcement substrate, not a certainty guarantee — and [gmode](06_9-gmode.html) is the documented operator escape when the right move is to skip the gate. The phase makes self-validation harder; the human is still on the hook for what gets shipped. *[ref: gmode-as-documented-escape-from-verify-gate | .claude/plugins/phasic_system/hooks/gmode-gate.sh:77-81 | The gmode-gate enforces a ≥100-word justification floor on the `[GMODE]` AskUserQuestion (blocking with the word-count voice on insufficient text); when accepted, current_phase flips to "gmode" and every phase guard's `[[ "$current_phase" != "<my_phase>" ]] && exit 0` filter short-circuits, letting the agent bypass VERIFY's scope rules at the explicit cost of an audited escape.]*

The deepest payoff of VERIFY is the cognitive failure mode it prevents: the *self-validating delivery* — the agent that ships work it just built, declares it correct because it has read the diff, and the read-of-its-own-output is the same cognitive posture as the write-of-the-output. Same LLM, same prior, same blind spots. The structural separation — a phase with different tools, a different scope, frequently delegated to subagents with no execution history — gives the verdict an honest chance to be wrong about itself. The friction is the pedagogy. The phase is the compartment.

VERIFY's verdict closes the work-on-the-project arc. What CONDENSE does next is different in kind — work on the brain itself. Next.

---

*Essay 6.6 — The Markov Phasic Brain, Part 6 of 10.*

*Previous: [Essay 6.5 — EXECUTE: Build, in Scope, in Steps](06_5-execute.html) — the universal file-creator, checkpoints, delegation bias.*
*Next: [Essay 6.7 — CONDENSE — The Cognitive Organ](06_7-condense.html) — the seven-step waterfall, the cycle's metabolism.*




