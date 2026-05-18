---
title: "Job Lifecycle — job_core"
date: "May 2026"
slug: "job-core"
read_time: "7 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.3.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Job Lifecycle — `job_core`

*Essay 5.4 — The Always-On Digital Cortex, Part 4 of 9.*

---

[Essay 5.3](05_3-brain-guard.html) covered the ceiling — keeping the agent under the model's reasoning curve. This part covers the spine: the always-on plugin that gives the seed agent a notion of *what work it is doing*.

---

## What it owns

`job_core` exists to compartmentalize the seed agent's *work*. The unit of compartmentalization is the *job* — a container for everything the agent does between the moment a piece of work begins and the moment it is complete. Every prompt, every reasoning cycle, every action belongs to one. The plugin works by routing each user prompt into a job (creating a new one if none is focused, attaching as an interaction if one is) and by refusing to let the agent stop while any job remains active. It applies on every prompt the user submits, every Stop event the agent triggers, and every `[JOB-COMPLETE]` claim the agent makes. *[ref: job-core-exists-to-compartmentalize | .claude/plugins/job_core/hooks/prompt-handler.sh:49-74 | UserPromptSubmit routing: `if [[ "$active_count" -eq 0 ]]` (line 49) → `bash "$JOB_SH" --hook create-active "$PROMPT"` (line 52); `else` → look up focused job and `--hook append-interaction "$focused_id" "$PROMPT"` (line 74). Create-or-attach in exact prototype form.]*

## The cumulative mega-prompt

A user-prompt hook intercepts every user prompt and either creates a new active job or appends the prompt as an interaction on the currently focused one. The interaction field of a job is what the seed agent treats as its *dynamic mega-prompt*. In most agent designs, "the prompt" is a one-off — text handed to the model at the start of the exchange and rarely revisited. Here, the prompt is cumulative: the first user message in a session seeds a new job, every later prompt and every Q&A appends into the same job's interaction list, and the *whole list* is what the agent reads as its instruction set going forward. The next plugin in this layer — `interaction_summary` — keeps that mega-prompt legible as it grows. *[ref: a-user-prompt-hook-intercepts | .claude/plugins/job_core/scripts/job.sh:467-475 | `append-interaction` handler around L468 with the update_job call at L474: `update_job "$local_id" --arg t "$local_text" '.user_interactions += [$t]'`. Each prompt pushes onto the job's `user_interactions` array — the cumulative mega-prompt the agent re-reads each turn.]*

## The shared key

The interaction list is just one form of state attached to a job. When a job is created it is assigned a unique ID — a timestamp from the moment of creation — and the *base* job object (name, status, interaction list, dependencies, completion fields) lives in `job_core`'s own hidden state. Other plugins that need to carry context about that job *extend* the same job object under the same ID inside their own hidden state. `interaction_summary` does exactly this — when a job's interactions cross the summarization threshold, the plugin creates a mirror entry under the job's ID and starts appending summary blocks there. *[ref: base-job-object-schema | .claude/plugins/job_core/scripts/job.sh:223-236 | `create-active` handler mints the base job object: `local_id=$(gen_id)` produces the timestamp ID; a single jq line appends `{id, name, objective, status:"active", focused:true, user_interactions:[$prompt], completion_requirements, plan_state:"none", created_at, updated_at}` to job_core's own data.json. This is the shared-key origin every other plugin keys their own per-job entries against.]*

The phase plugins ([Essay 6](../06_1-phasic-foundation.html)) do it on a larger scale: each phase plugin keeps its own per-job bookkeeping — scope multipliers, point ledgers, plan-file pointers, footer markers — keyed by the same ID. No plugin reads another's hidden state directly, but the shared key lets each plugin's view of the job line up with every other plugin's view without runtime coordination. That consistency is what makes the job a true cross-plugin compartment. *[ref: interaction-list-just-one-form | .claude/plugins/job_core/scripts/job.sh:223-236 | `create-active` handler: `local_id=$(gen_id)` mints a timestamp ID; jq writes base job object `{id, name, objective, status, focused, user_interactions, completion_requirements: {user_approval, plugin_lock_approval, depends_on}, plan_state, created_at, updated_at}` to job_core's own data.json. Other plugins extend by keying entries on the same `id`.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/job-core-b5-4.png
  Concept: Chalk-on-blackboard cross-section — a single focused job drawn as a central chalk box keyed by a timestamp ID, with the cumulative interaction list growing inside it and satellite plugin boxes extending the same ID from outside their own hidden state.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the central job object, green for the user_interactions list cells, orange for the extending plugin satellites, pink for the shared-key arrows, magenta for the plugin labels);
  white chalk for ALL labels, IDs, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Center — a large chalk box (cyan fill) labeled IN WHITE CHALK exactly: "job". Above its top edge, a small white-chalk tag with the literal text "id: 1778080980191719121" (the shared key). Inside the central box, a vertical stack of small chalk cells (green fill) labeled top-to-bottom exactly: "prompt 1", "prompt 2", "prompt 3", "...". A white-chalk caption beside the stack reads exactly: "user_interactions".
  Around the central job, three satellite chalk boxes (orange fill) drawn at upper-left, upper-right, and lower-right, each labeled IN WHITE CHALK exactly: "interaction_summary", "phase_observe", "phase_plan". A pink-chalk arrow runs from each satellite back to the central job's id tag, showing each satellite keying its own entry by the same ID.
  Below the central job, a small dashed white-chalk box labeled exactly: "data.json (hidden)" — drawn so the central job sits visually inside it; the three satellites sit OUTSIDE this dashed box (each satellite has its own hidden state, unshown).
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "job", "id: 1778080980191719121", "user_interactions", "prompt 1", "prompt 2", "prompt 3", "...", "interaction_summary", "phase_observe", "phase_plan", "data.json (hidden)", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.4. One job, one shared key — the cumulative mega-prompt lives inside; other plugins extend the same ID from outside their own hidden state."
-->

## The refusal to stop

The job structure is also what keeps the agent working: the same shared key that lets every plugin reach the focused job is what lets `job_core` enforce a single continuous work loop. A turn-end hook refuses to let the agent stop whenever any active or pending job remains. The refusal message is phase-aware — every OPEVC phase gets its own reminder set (observation phases get prompts to check CLAUDE.md before synthesizing, execution phases get prompts to keep edits inside the altered-list, and the others carry phase-specific reminders of the same kind). *[ref: phase-aware-refusal-branching | .claude/plugins/job_core/hooks/stop-gate.sh:83-93 | Work-phase branch: `if [[ -n "$current_phase" && "$current_phase" != "idle" ]]` emits a phase-header voice (`stop-gate-phase-header` with `phase`/`cycle`/`job_id`/`job_name` interpolations) THEN a `case "$current_phase" in observe|plan|execute|verify|condense)` switch picks the phase-specific reminder. The structure proves the refusal is not a single flat message — it splits per phase by design.]*

The refusal functions as a *re-orientation*, not a flat no: when the seed agent tries to stop prematurely, the message reminds it of what its current phase still expects before stopping is even on the table. The agent cannot stop while any job is active, and pending jobs scheduled ahead extend the loop across whatever queue the operator — or the seed agent itself, when it queues follow-up work — has set up. The seed agent runs continuously until every active and pending job has been completed, which is what makes long-running, hands-off operation possible. The refusal is friction, not mathematical enforcement: the stop-gate is a voice the agent reads and re-orients on. A determined operator can disable the hook outright; an agent ignoring the voice can still mis-handle the signal. The friction is enough to make hands-off operation work in practice — not enough to guarantee correctness against an actively misbehaving agent. *[ref: turn-end-hook-refuses-stop | .claude/plugins/job_core/hooks/stop-gate.sh:83-93 | Phase-aware refusal: `case "$current_phase" in observe|plan|execute|verify|condense)` picks `phase_voice_id="stop-gate-${current_phase}-reminders"`. Each phase gets its own voice (e.g., `stop-gate-observe-reminders` for CLAUDE.md, `stop-gate-execute-reminders` for altered-list) before refusing stop.]*

## Staged completion

Completion is staged. The current prototype runs the gate in stages — a pre-call hook validates that any `[JOB-COMPLETE]` question contains the focused job's name, requires a substantial review block (the prototype sets a word floor; your seed can tune it), and presents *exactly* the "Review" and "Approve completion" options; then a follow-up post-call hook walks the focused job's dependency list, refuses approval if any dependency is still unfinished, and only then records the user's approval. The architectural fact is the staging itself: completion does not collapse into a single moment. Future seed-agent generations can graduate to automated criteria, verifier subagents, or multi-stage approval chains. *[ref: completion-is-staged-two-stages | .claude/plugins/job_core/hooks/question-capture-hook.sh:89-108 | Stage 2 post-call: detects `[JOB-COMPLETE]` + "Approve completion", walks `.completion_requirements.depends_on` (line 93), refuses with unmet list (101-104) OR calls `bash "$JOB_SH" --hook approve` (106). Stage 1 pre-call gate in question-capture.sh validates job name + ≥100-word review + exact options.]*

## What would break without it

Without `job_core`, the agent has no notion of *what work am I doing*. Every prompt is a one-off, there is no thread of intent to come back to, no place for follow-up work to live, no signal that says the agent is or isn't done. The cognitive horizon collapses to the current turn — and everything the rest of the always-on layer is built to support has nothing structural to attach to. *[ref: without-job-core-the-agent | .claude/plugins/job_core/CLAUDE.md Objective + Design Principle sections | Objective: "Manage job lifecycle... The agent's work loop — if jobs exist, the agent works until they're done." Design Principle: "Jobs are the atom of work. Everything the agent does happens inside a job."]*

## What you would customize

`job_core`'s architecture is portable; its specifics are tunable.

You would re-shape the *unit of compartmentalization*. The current prototype calls it "a job" — a generic noun that fits software work. Your seed may want a richer noun for your domain: a research seed might call the unit an "investigation"; a consulting seed might call it a "client engagement"; a legal-research seed might call it a "matter." The schema doesn't care what you call it; the mental model and the voices do. Renaming the unit shifts the operator's framing. *[ref: unit-of-compartmentalization-naming | .claude/plugins/job_core/scripts/job.sh:189-337 + .claude/plugins/job_core/CLAUDE.md Design Principle section | The schema field is literally `name` (six `get_field … "name"` call sites between L189 and L337, using `$local_fid`, `$focused_id`, `$local_id` variants). The Design Principle reads "Jobs are the atom of work. Everything the agent does happens inside a job." — generic noun, generic field name. Renaming the unit in voices and CLAUDE.md docs is a vocabulary swap, not a schema redesign.]*

You would extend the *stop-gate refusal voices*. The current prototype ships one per OPEVC phase. If your seed adds new phases (a `phase_research` between OBSERVE and PLAN, say), each new phase gets its own stop-gate voice reminding the agent what *that* phase still expects. The voice library grows with your phase library. *[ref: stop-gate-phase-voices | .claude/plugins/job_core/hooks/stop-gate.sh:83-93 | `phase_voice_id="stop-gate-${current_phase}-reminders"` — the phase suffix is dynamic. Adding a new phase means adding a new entry to the voice catalog; the lookup machinery handles the rest.]*

You would deepen the *completion staging*. The current shape is name-validation followed by dependency-walk. A larger system may want more: a verifier-subagent stage that runs acceptance checks, a peer-review stage where a second agent audits the work, a delay-gate stage that forces a cool-down before approval lands. A consulting practice could install the same dependency-walk pattern for client deliverable QA — the agent cannot mark a deliverable "done" until every checklist item the operator declared (sign-off received, references verified, deliverable filed) is satisfied; the stages become the firm's review protocol expressed as hooks. The hook architecture supports staging by composition; each new stage is its own pre/post hook. *[ref: staging-by-composition | .claude/plugins/job_core/hooks/question-capture.sh + .claude/plugins/job_core/hooks/question-capture-hook.sh | The two stages live in two separate hook files: `question-capture.sh` is the PreToolUse validator (Stage 1 — name-in-text, Approve label, ≥100-word body); `question-capture-hook.sh` is the PostToolUse handler (Stage 2 — dep-walk, refuses if any dep unfinished, else calls `--hook approve`). The split is forced by a Claude Code limitation (same script registered on both Pre+PostToolUse:AskUserQuestion causes PostToolUse to never fire) — and demonstrates the composition pattern: each new stage adds its own pre/post hook pair.]*

You would tune the *mega-prompt strategy*. The current cumulative-list approach treats every interaction as load-bearing. Your seed may want a sliding window (last N interactions), topic-filtered slices (interactions matching a domain tag), or domain-specific summarization (research seeds compress citations differently from consulting seeds compress decisions). The `user_interactions` array is one shape — the mega-prompt could read from any structured field that survives across the session. *[ref: user-interactions-array-shape | .claude/plugins/job_core/scripts/job.sh:474 | The append shape is one jq line: `update_job "$local_id" --arg t "$local_text" '.user_interactions += [$t]'` — append-only array of strings. A sliding-window or topic-filtered variant swaps the jq expression (`.user_interactions = (.user_interactions + [$t] | .[-N:])` for windowed; `.user_interactions[$tag] += [$t]` for tagged) without changing the hook contract; the mega-prompt could read from any structured field the job object carries.]*

What you would **not** do is collapse the job into the current turn. The whole always-on layer attaches to the job structurally; without the compartment, the rest of the layer has nothing to hang on.

---

The next part covers the plugin that keeps the cumulative mega-prompt legible as it grows past hundreds of interactions.

---

*Essay 5.4 — The Always-On Digital Cortex, Part 4 of 9.*

*Previous: [Essay 5.3 — Context Window Discipline (`brain_guard`)](05_3-brain-guard.html) — the progressive squeeze that keeps reasoning sharp.*
*Next: [Essay 5.5 — Mega-Prompt Compression (`interaction_summary`)](05_5-interaction-summary.html) — shape-compels-production applied to the mega-prompt.*
