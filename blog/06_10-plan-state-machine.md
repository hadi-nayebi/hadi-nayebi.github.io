---
title: "The Plan-State Machine — Long-Horizon Memory"
date: "May 2026"
slug: "plan-state-machine"
read_time: "8 min"
tags: [Architecture, Seed Agent, OPEVC, Plan File, Long-Horizon]
status: draft
version: v0.1.0
audience: "Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# The Plan-State Machine — Long-Horizon Memory

*Essay 6.10 of 10 — The Markov Phasic Brain.*

---

[Essay 6.9](06_9-gmode.html) opened the off-cycle lane — the deliberate maintenance side-quest where the phase gates are dropped so the operator can do work that doesn't fit the standard OPEVC shape. Gmode covers a *short* horizon: hours, one sitting, one ceremony. This final sub-essay covers the opposite horizon — work that doesn't fit inside a single cycle and shouldn't. Work that needs to remember itself across days and dozens of cycles.

The mechanism is small. Two fields on the job object, a five-state machine, two approval gates. The discipline it produces is what turns the markov brain from a single-session cognition into something that can hold a plan in its head for weeks.

For the architects in the audience. Especially the ones who plan to run jobs that take longer than one sitting.

---

## What it owns

The plan-state machine owns the long-horizon memory of a job. Two fields on the job object inside `data.json` carry the state: `plan_file` names the working `.md` document on disk (or holds the literal `false` when the job has no plan), and `plan_state` tracks where the document is in its lifecycle. *[ref: plan-fields-on-job-object | .claude/plugins/job_core/scripts/job.sh:177 | job_core's create handler initializes every new job with the literal shape `plan_state:"none"` alongside `completion_requirements`, `user_interactions`, and the other job-level fields. The plan_file field is added later by `plan.sh set-plan-file` in PLAN of cycle 1; until then the job carries no plan. Both fields live on the job object — never in plan-file frontmatter — so the lifecycle state spans the .md and .yaml documents as one job-scoped fact.]*

The `plan_state` field has five values, each naming a stage of the plan's life: `drafting` (a working `.md` plan is accumulating refinement across cycles), `md_approved` (the `.md` has passed user judgment and the next cycle is dedicated to creating a `.yaml`), `yaml_drafting` (a parseable `.yaml` companion is being authored alongside the `.md`), `yaml_ready` (the `.yaml` has passed approval and now injects itself into every subsequent cycle's phase entry), and `sealed` (the optional terminal state where the pair is archived). A sixth value, `none`, is the default for jobs that never get a plan file at all.

What lives where matters. Job-scoped facts live on the job object; file-scoped facts live in the file. Plan files themselves carry a small identification frontmatter — a `job:` line and a `plan_file:` line — declaring which job they belong to, and nothing more. The lifecycle state is intentionally not in the file. It is in `data.json` because the state describes the *whole plan lifecycle* that spans both documents; the files are the artifacts, the state describes the pair.

## The three job forms

The state machine produces three job forms, each fitting a different shape of work. OBSERVE in cycle 1 classifies the job into one of them. The classification decides whether a plan file will ever exist, and which lifecycle the plan will follow. *[ref: three-job-forms-canonical | CLAUDE.md "Job Forms (OBSERVE cycle 1 classifies)" section | Root brain canonically names the three forms: (1) Single-cycle deep, plan_file=false, freestyle and collaborative, backward edges and loops inside one cycle; (2) Multi-cycle with .md plan, plan_file=<name>.md and plan_state=drafting, .md accumulates refinement across cycles; (3) Multi-cycle with .yaml plan, plan_state ∈ {yaml_drafting, yaml_ready}, .yaml exists alongside .md and injects context at every phase entry. The section also lists decision rules — generic conversational request → form 1; big project spanning multiple phases → form 2; form 3 evolves from form 2 via the approval gate, not chosen up front.]*

**Form 1 — single-cycle deep.** The job sets `plan_file = false`. There is no document on disk; the entire OPEVC pass holds the work in working memory and commits the artifacts directly. Single bug fixes, single feature adds, single doc updates, freestyle teaching conversations — anything that closes in one cycle. Backward edges happen *inside* the cycle, between phases, not across cycles. The job completes and the memory of it lives only in git history and the `knowledge/` files CONDENSE produces.

**Form 2 — multi-cycle with `.md` plan.** The job sets `plan_file = <descriptive_name>.md` and `plan_state = drafting`. The document becomes the long-horizon memory: PLAN names it in cycle 1, EXECUTE creates the first draft, VERIFY edits it each cycle to record where the work has reached. From cycle 2 onward, PLAN re-reads it at phase entry so the cycle inherits the contract the previous cycles wrote. This is what carries a long job's understanding across days when chat history has long since rolled off.

**Form 3 — multi-cycle with `.yaml` plan.** Form 3 is not chosen up front. It evolves from form 2 once the operator approves the `.md` and the agent enters a dedicated cycle to derive the parseable `.yaml` companion. From `yaml_drafting` onward, the `.yaml` injects itself at every phase entry — see below — and the job's long-horizon context becomes a stream of structured memories that show up automatically each cycle, not a document the agent has to remember to re-read.

## The state machine

The transitions are deterministic. Each one is owned by exactly one phase, and each one is triggered by one specific event.

```
none → drafting → drafting (loop) → md_approved → yaml_drafting → yaml_drafting (loop) → yaml_ready → (optional) sealed
```

**`none → drafting`.** PLAN, in cycle 1, calls `plan.sh set-plan-file <name>.md`. The extension drives the state: `.md` lands in `drafting`. EXECUTE creates the first draft of the file during the same cycle.

**`drafting → drafting`.** Subsequent cycles. VERIFY refines the `.md` — appending status rows, captured lessons, completion marks. PLAN reads it at phase entry. The loop can run for as many cycles as the work needs. Many jobs never leave this state; the `.md` is enough.

**`drafting → md_approved`.** VERIFY, when satisfied with the plan, asks the user via `[PLAN-APPROVAL]` with an "Approve .md plan" option. On approval, VERIFY calls `plan.sh approve-md`, which flips `plan_state` from `drafting` to `md_approved`. *[ref: approve-md-state-flip | .claude/plugins/phase_plan/scripts/plan.sh approve-md command | The approve-md handler reads the current plan_state, dies if it is not "drafting", and writes a single jq update flipping the field to "md_approved". No archive, no file motion — approval is a state flip, not a retirement. The handler is reserved for hook mode (HOOK_MODE=true) so only the question-capture flow can invoke it; the agent cannot self-approve. The corresponding approve-yaml command mirrors the same shape for the yaml stage; seal-plan is the only command that archives the plan file.]*

**`md_approved → yaml_drafting`.** The next cycle is dedicated to `.yaml` creation. OBSERVE and PLAN analyze the approved `.md`, EXECUTE creates the `.yaml` alongside it (same basename, side-by-side), and the entry into EXECUTE flips `plan_state` to `yaml_drafting`. The `.yaml` is now the active draft; the `.md` is preserved unchanged.

**`yaml_drafting → yaml_drafting`.** Refinement cycles. VERIFY edits the `.yaml` — adding phase entries, sharpening field-maps — and can backward to PLAN for re-analysis when the structure isn't right yet. The loop runs until the `.yaml` captures what each phase of the long-horizon job should be told at entry.

**`yaml_drafting → yaml_ready`.** VERIFY asks via `[YAML-APPROVAL]` with an "Approve .yaml plan" option. The validator gate forces the question into the right shape: only the VERIFY phase may ask, the question must carry the plan file name in its text, both an approve option and a Review option must be present, and the question must run at least 100 words. *[ref: yaml-approval-validator-gate | .claude/plugins/job_core/hooks/question-capture.sh:137-203 | The validator branches on the prefix kind (`[PLAN-APPROVAL]` expects plan_state=drafting and approve label "Approve .md plan"; `[YAML-APPROVAL]` expects plan_state=yaml_drafting and approve label "Approve .yaml plan"). It then enforces five conditions: A7 phase-of-firing gate (block unless current_phase == verify), plan_file must be set, plan_state must match the expected stage, the question must include the plan_basename or its .yaml companion, and word count ≥ COMPLETION_QUESTION_WORD_MIN (default 100). Each failure exits with a distinct voice id (plan-approval-wrong-phase, plan-approval-no-file, plan-approval-state-mismatch, plan-approval-filename-required, plan-approval-word-count) for clean teach-text.]* On approval, VERIFY calls `plan.sh approve-yaml`, flipping the state.

**`yaml_ready → sealed` (optional).** When the long-horizon work is truly done, VERIFY may call `plan.sh seal-plan`. This is the only command that archives: the `plan_file` is pushed onto a `completed_plan[]` list on the job, `plan_file` flips back to `false`, and `plan_state` lands on `sealed`. Approval was a state flip; sealing is a retirement. The distinction matters — many `yaml_ready` jobs run for cycles after approval, with the `.yaml` injecting its context each time. Sealing closes that loop on purpose.

## How `.yaml` injection turns the brain long-horizon

The `.md` is for humans. The `.yaml` is for the brain.

Once a job's `plan_state` is `yaml_drafting`, `yaml_ready`, or `sealed`, the phasic system's entry hook reads the `.yaml` on every phase transition and writes the phase-specific field-map to a cache file. The shared voice helper reads that cache when it fires any voice during the new phase, and yaml field-map entries auto-append to the relevant voices — turning a job's structured long-horizon context into a stream of injections that show up automatically wherever the agent is reading guidance. *[ref: phase-init-yaml-injection-on-transition | .claude/plugins/phasic_system/hooks/phase-init.sh write_yaml_cache + phase-transition branch | The write_yaml_cache helper resolves `$ROOT_DIR/.claude/.tmp/yaml-injection-cache.json` and writes the field-map for the focused job's current phase by calling `bash "$PHASE_SH" --hook read-yaml`. The phase-transition branch of phase-init.sh calls write_yaml_cache after every advance, back, or commit-transition event so the freshly entered phase's yaml content immediately augments downstream voices. Gmode enter clears the cache (side-quest isolation); gmode exit restores it. New jobs and focus events also refresh. Net result: phase entry is the injection moment; the .yaml plays back the job's long-horizon memory each time the agent crosses a phase boundary.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — the .md and .yaml side by side, with the .yaml's phase-entry injection feeding into the OPEVC cycle. The dual-document layout makes "what is for the human" vs "what is for the brain" legible at a glance.
  Style: Match `opevc-cycle-blackboard.png` exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the document tiles and the phase ring;
  white chalk for labels, arrows, and field names; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, field names, or descriptors.
  Layout: Two chalk-drawn document tiles side by side on the left half of the board; a chalk-drawn ring of four phase circles on the right half. A single arrow stream connects the two halves.
    Left tile (cyan border, drawn as a tall rectangle with horizontal chalk ruling to suggest prose lines): labeled at the top "plan.md", with a smaller white chalk note beneath it "for the human".
    Right tile (orange border, drawn as a tall rectangle with chalk indentation lines to suggest structured fields): labeled at the top "plan.yaml", with a smaller white chalk note beneath it "for the brain". Inside the .yaml tile, four small white chalk field labels stacked vertically: "observe:", "plan:", "execute:", "verify:".
    A short white chalk double-headed arrow between the two tiles, labeled "same basename".
    On the right half of the board, four phase circles arranged in a ring: cyan circle labeled "observe", green circle labeled "plan", orange circle labeled "execute", pink circle labeled "verify". Small white chalk arrows connect them clockwise.
    From the .yaml tile, a curved white chalk arrow exits the right edge and fans out into four thin chalk lines, each landing on one phase circle. Above the fan, a white chalk note: "injects at phase entry".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "plan.md", "plan.yaml", "for the human", "for the brain", "observe:", "plan:", "execute:", "verify:", "same basename", "observe", "plan", "execute", "verify", "injects at phase entry", plus the caption below. No other words, file names, folders, or descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.10. The .md is for the human; the .yaml is for the brain. Same basename, different surface."
-->

This is the long-horizon mechanism. Without it, every cycle would start cold — the agent would have to re-read the `.md` and re-derive what each phase should know. With it, the agent's context grows back the long-form structure of the job automatically, each cycle, at every phase boundary. The brain doesn't have to remember to remember.

The `.md` and `.yaml` are not redundant — they are different surfaces. The `.md` is a prose document a human can scan to follow the arc of a long job. The `.yaml` is a parseable structure the brain can inject at exactly the right moment. They coexist; neither replaces the other.

## What would break without it

Take the state machine out. Now every multi-cycle job has to hold its own plan in working memory or re-derive it each session. The seed agent can still attempt long-horizon work, but each cycle starts from scratch — re-reading whatever notes happen to survive in `knowledge/`, re-building intuition that the previous cycle already had. Long jobs drift. Cycle 7 of an eight-cycle migration contradicts cycle 3 because cycle 7 never read cycle 3's plan.

Take the approval gates out. Now the `.md` and the `.yaml` exist but the operator never gets to say "this plan is right." The agent can rewrite the plan freely each cycle; the long-horizon "memory" becomes whatever the agent last decided to write. The user's architectural judgment — the thing that makes the seed safely modifiable by the operator instead of by the developer — is removed from the long-horizon loop.

Take the file-based companions out (the `.md`-only world). Now the long-horizon context is a prose document the agent has to remember to re-read every cycle. Sometimes it does. Sometimes it doesn't. Injection at phase entry is the discipline that turns "should re-read the plan" into "the plan re-reads itself into the context, every phase, every cycle."

Each layer of the machine — the state field, the approval gates, the parseable injection target — closes one failure mode of long-horizon work that ordinary chat-history-based agents fail at.

## What you would customize

The plan-state machine is the rare mechanism where the design assumes most architects will *extend it, not replace it*. The state field is extensible, the prefixes are renamable, the `.yaml` schema is yours to design.

You would extend the **`plan_state` values themselves**. The current prototype ships five active states plus `none`. Your seed may want intermediate stages — a `peer-review` state between `drafting` and `md_approved` for jobs that pass through a second human; a `paused` state for long jobs the operator wants to suspend without sealing; an `archived-but-active` state for plans that inject `.yaml` even after the work is done because the long-horizon context is reusable. Adding a state is a schema extension plus a handler command on `plan.sh`.

You would rename the **approval prefixes** to match your operator vocabulary. The current `[PLAN-APPROVAL]` and `[YAML-APPROVAL]` are descriptive but generic; a legal-domain seed might prefer `[ENGAGEMENT-APPROVED]` and `[MEMO-LOCKED]`, a research seed might use `[PROTOCOL-APPROVED]` and `[DATASET-LOCKED]`. The prefixes are registered in one place; the validator branches on the prefix kind to set expected states and approve labels; renaming is a one-line change plus a voice-text update.

You would design the **`.yaml` schema**. What fields does each phase need at entry? OBSERVE may want a `recall_targets:` list; PLAN may want a `decisions_locked:` map; EXECUTE may want a `forbidden_files:` array; VERIFY may want a `acceptance_criteria:` list with pass/fail rows. The current prototype ships a minimal injection — one objective per phase. Your seed will discover what richer fields produce richer cognition for your work, and the `.yaml` is where that discovery lives.

You would tune the **seal-plan timing**. The current rule is "seal after work is truly done." Your seed may want automatic sealing when a `completion_requirements` flag flips, or operator-only sealing through a ceremony question, or never-seal (keep injecting the `.yaml` forever as durable institutional memory). The mechanism is one command; the policy is yours.

You would adjust the **multi-cycle threshold**. The current decision rule lives in OBSERVE cycle 1's narrative judgment: "big project + likely review-and-revision cycles → form 2." That is operator-judgment-shaped; if your seed runs in a domain with a clear count threshold (say, every job over four phases goes multi-cycle), you can codify it as a hint voice or a hard gate in OBSERVE.

What you would NOT do is remove the machine. Take it out and the brain reverts to single-session cognition. The whole markov phasic discipline — the cycle, the metabolism organ, the multiplier, gmode — is built on the assumption that some jobs deserve to be remembered across cycles. The plan-state machine is what makes that remembering deterministic instead of accidental.

---

## What the machine teaches

The plan-state machine is the final mechanism of the markov phasic brain. The cycle from [Essay 6.2](06_2-discipline-and-map.html) gave the brain phases. CONDENSE from [Essay 6.7](06_7-condense.html) gave it metabolism. The multiplier from [Essay 6.8](06_8-backward-multiplier.html) gave it honest scope. Gmode from [Essay 6.9](06_9-gmode.html) gave it an off-cycle lane. The plan-state machine gives it a *horizon* — the capacity to hold the same plan across days, weeks, dozens of cycles, with the plan re-injecting itself at every phase boundary so the brain never forgets where the work has reached.

That is what makes the markov brain a brain, not a loop. A loop reacts. A brain remembers. The state machine is the substrate of that remembering, and the `.yaml` injection is the reflex that fires it back into the present every time the agent crosses a phase.

The cycle, the organ, the multiplier, gmode, the plan-state machine — each of these is a mechanism. None of them is the *thing they run inside*. Phases are plugins. CONDENSE is a plugin. Gmode rides on a plugin. The plan-state machine itself is split across two plugins. Everything in this essay series is built on a standardized way of packaging cognitive mechanisms — the plugin kit. That is the subject of the next essay.

The brain is built. The kit is what lets you grow new pieces of it safely.

Next.

---

*Essay 6.10 of 10 — The Markov Phasic Brain.*

*Previous: [Essay 6.9 — Gmode](06_9-gmode.html) — the off-cycle lane that drops the phase gates for deliberate maintenance work.*
*Next: [Essay 7 — The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*




