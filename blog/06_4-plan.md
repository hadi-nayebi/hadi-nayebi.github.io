---
title: "PLAN — Decide, Then Lock"
date: "May 2026"
slug: "plan"
read_time: "5 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, Plan]
status: drafting
version: v0.1.0
audience: "Tier 2"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# PLAN — Decide, Then Lock

*Essay 6.4 of 10 — The Markov Phasic Brain.*

---

PLAN is also read-only against project files. The agent can still read whatever it needs, but writes are confined to CLAUDE.md. The plan document, if the job calls for one, is named in PLAN and written by EXECUTE — we come back to that below.

The first thing the agent does on entering PLAN, after the multiplier, is decide whether the job needs a plan file at all.

---

## Naming the contract

PLAN inherits the job-form classification from OBSERVE: single-cycle, multi-cycle with a working `.md` plan, or multi-cycle whose `.md` has graduated into a `.yaml`. When the form is multi-cycle, PLAN's first concrete act after the multiplier is to name the plan_file via `plan.sh set-plan-file` — a cycle-1-only call that locks the path for the rest of the job.

The file's lifecycle splits across phases from there. EXECUTE creates the named document in cycle 1 and writes the initial plan into it. VERIFY edits it across every cycle — appending status rows, captured lessons, completion marks as the work matures. PLAN itself never edits the file directly; from cycle 2 onward it reads the file back at phase entry, treating it as the long-term contract the cycle inherits. *[ref: set-plan-file-cycle-1-immutable | phase_plan/scripts/plan.sh:335-376 | PLAN's set-plan-file CLI accepts false for single-cycle or plan_*.md for multi-cycle; cycle 1 only, dies on re-call, locks the form for the rest of the job.]*

The contract is not static. The plan moves through a `plan_state` machine — `drafting` while the .md still refines, `md_approved` flipping the gate that lets a later cycle create the .yaml.

---

## The state machine

The plan moves through a small set of states (currently five in the prototype, extensible as the design matures).

`drafting` keeps the .md circulating — VERIFY refines it cycle after cycle, the contract sharpens. `md_approved` is the flip: VERIFY asks the user via AskUserQuestion, the user answers yes, the state lifts and the next cycle is dedicated to creating the .yaml.

`yaml_drafting` is the parallel arc — EXECUTE writes the .yaml; VERIFY refines it across however many cycles it takes, with backward to PLAN allowed when the analysis underneath needs revisiting. `yaml_ready` is a second user-gated flip, and from that point the .yaml is injected at phase entry on every cycle that follows — the plan is now actively shaping the agent's context.

`sealed` is optional and terminal; `seal-plan` is the only command that archives the pair to `completed_plan[]`. Approval is a state flip, not a retirement — the plan keeps working until it is explicitly sealed.

<!-- IMAGE PLACEHOLDER:
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

Each one carries a stated goal, an acceptance-criteria list, the *altered list* — a list of CLAUDE.md files whose parent directories EXECUTE will be allowed to touch, [introduced in Essay 5.7](05_7-claude-md-hierarchy.html) as the mechanism that lets PLAN scope EXECUTE's reach — and an explicit set of judgment-call criteria. The judgment-call criteria are the points where EXECUTE is expected to make a real decision rather than mechanically follow a recipe. *[ref: plan-6-subagents-encode-structure | phase_plan/agents/CLAUDE.md:17-30 | PLAN's 6 specialized subagents encode the plan-document's opinionated structure: plan-step-breaker decomposes steps, plan-criteria-writer authors acceptance criteria, plan-scope-analyzer maps altered-list directories, plan-risk-assessor names judgment calls.]*

The `.md` and the `.yaml` live side-by-side once both exist, and they are not the same artifact wearing different masks. The `.md` is the human-readable accumulating prose; the `.yaml` is the parseable injection target the orchestrator reads at phase entry to pour context-specific content into the working session.

Both files carry a small identification frontmatter at the top — a `job:` line and a `plan_file:` line — declaring which job they belong to and nothing more. The lifecycle *state* — where the plan sits in its drafting and approval arc — does not live in either file. It lives on the job object inside `data.json`, alongside every other job-level field, because the state describes the whole plan lifecycle that spans the pair; the files are the artifacts, the state describes the pair. *[ref: yaml-identification-frontmatter | .claude/knowledge/plans/plan_phasic_and_phase_plugins_coverage.yaml:1,3 | The identification frontmatter at the top of a real .yaml plan file: line 1 `job: <id>`, line 3 `plan_file: <name>.md` (with line 2 `job_name:` between them). Every plan file carries this convention.]*

---

## The contract handoff

Once PLAN exits, the contract — whether it lives in the plan file or in the working CLAUDE.md — becomes the contract for EXECUTE. This is what makes the phase boundary load-bearing. EXECUTE is fenced *to* the plan. The altered list dictates which files EXECUTE's write-tool guard will allow. The acceptance criteria dictate what VERIFY will check. *[ref: altered-list-frozen-at-execute-entry | phase_execute/hooks/execute-sensor.sh:158-172 | execute-sensor.sh merges OBSERVE and PLAN altered lists at execute entry, then calls execute.sh set-altered-list to snapshot the merged scope into execute's data.json — the freeze that fences EXECUTE to PLAN's contract.]*

If EXECUTE wants to touch a file the plan didn't list, the request is blocked. The agent has to either roll back to PLAN to amend the contract, or accept the constraint and proceed within scope.

The reason the plan is locked is the reason every project rationalizes mid-execution. Plans written *during* execution are not plans; they are post-hoc explanations for whatever the executor felt like doing. By forcing the plan to be authored before any code is touched, the seed agent forecloses that drift. The plan can be wrong — that is what VERIFY is for, and that is what backward transitions are for — but it cannot be silently rewritten.

---

## Same gate, same forecast

PLAN, like OBSERVE, requires the agent to set a multiplier on entry. Same range, same backwardness, same effect on the point gate. *[ref: plan-set-multiplier-validates-range | phase_plan/scripts/plan.sh:309-325 | PLAN's set-multiplier CLI mirrors OBSERVE's: validates the value is 0.5/1/1.5/2/2.5/3, dies if the entry already has points (preventing reset), then writes the immutable value to data.json.]*

When PLAN exits, the orchestrator advances the job to EXECUTE.

---

*Essay 6.4 of 10 — The Markov Phasic Brain — Hadosh Academy series on agent architecture.*

*Previous: [Essay 6.3 — OBSERVE: Read Wide, Write Once](06_3-observe.html) — read-only synthesis, multiplier sentinel, paired gates.*
*Next: [Essay 6.5 — EXECUTE: Build, in Scope, in Steps](06_5-execute.html) — the universal file-creator, fenced to the altered list.*




