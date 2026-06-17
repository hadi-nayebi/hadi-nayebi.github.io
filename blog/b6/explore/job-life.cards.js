/* ============================================================================
 * job-life.cards.js — CONTENT for the "Life of a Job" concept-deck (data only).
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the
 * engine, which reads window.DECK_INFO + window.DECK_CARDS.
 * Every hood fact was verified against the live prototype (see deck-engine.js
 * header + .claude/knowledge/diagrams/consolidated-mechanisms-diagram-guide.md).
 * ============================================================================ */
window.DECK_META = { page: 'job-life', seqLabel: 'the job\'s life', capstoneLabel: 'The big picture — how the whole job fits together' };

window.DECK_INFO = {
        /* ---------------- CARD A : A job is born ---------------- */
        'a-idle': {
            title: 'Seed idle', tag: 'state',
            what: 'The seed agent is asleep. There is no job it is working on — no "focused" job at all.',
            why: 'This is the resting state: the very first run, or the moment every earlier job has been completed. Nothing is in motion until someone speaks to it.',
            hood: 'A job is "focused" when its record has <code>focused:true</code>. At rest, no record carries that flag, so every phase gate and voice has nothing to key on.'
        },
        'a-prompt': {
            title: 'Your first prompt', tag: 'context',
            what: 'The prompt you send is the ONLY context the new job starts with — its entire world is your words.',
            why: 'An idle seed has no job to feed. So your prompt does double duty: a reflex catches it and, finding nothing running, turns it INTO a job. Speaking to a sleeping seed IS starting a job — the "first-prompt effect". You never have to ask it to start.',
            hood: 'Caught by <code>job_core/hooks/prompt-handler.sh</code> on the <code>UserPromptSubmit</code> event. It counts active jobs (<code>active_count = jobs where status=="active"</code>); when that is <code>0</code> it bootstraps a brand-new job — see the "creates it" arrow.'
        },
        'a-record': {
            title: 'A new job — born empty', tag: 'object',
            what: 'The job now exists as one JSON object — created, live, and focused — but almost completely blank.',
            why: 'Here is the key surprise: the job does NOT yet know its own name or what it is for. The only real content it holds is your prompt, sitting in its interaction trail. Everything else is empty, waiting to be discovered — which is exactly why OBSERVE comes next.',
            hood: 'Born in a SINGLE jq write by <code>job.sh --hook create-active</code> (the only auto-create path, HOOK_MODE-gated). The record: <code>name:""</code>, <code>objective:""</code>, <code>status:"active"</code>, <code>focused:true</code>, <code>user_interactions:["&lt;your prompt&gt;"]</code>, <code>depends_on:[]</code>, <code>user_approval:false</code>, timestamps. Name and objective are literally empty strings at birth.'
        },
        'a-enter-observe': {
            title: 'OBSERVE — cycle 1', tag: 'phase',
            what: 'The job is initialised into the phase machine and takes its first step: into OBSERVE.',
            why: 'OBSERVE is where the empty job starts to fill itself in — reading your prompt and its context to work out who it is. That is the next card.',
            hood: 'Birth also calls <code>phase.sh --hook init &lt;id&gt;</code>, which writes the phase mirror <code>{current_phase:"idle", cycle:0}</code>. The job is locked in IDLE; the agent runs <code>phase.sh advance</code> to make the first transition <code>idle→observe</code>.'
        },

        /* ---------------- CARD B : OBSERVE ---------------- */
        'b-read': {
            title: 'Read · ask · gather', tag: 'action',
            what: 'In OBSERVE the job gathers: it re-reads your prompt, asks you follow-up questions, and pulls in surrounding context.',
            why: 'A newborn job knows almost nothing about itself. OBSERVE is read-wide time — the gathering that has to happen before the job can describe its own purpose in its own words.',
            hood: 'OBSERVE is a read-only phase: its guard blocks writes to project files and only lets the agent write into CLAUDE.md working memory. Gathering happens here; building is forbidden until EXECUTE.'
        },
        'b-grow': {
            title: 'The job keeps growing', tag: 'context',
            what: 'During OBSERVE the job is NOT static — it accumulates. Your prompt, your answers to its follow-up questions, and any later prompts all append to its interaction trail. Everything it reads and works out piles into working memory.',
            why: 'A newborn job is almost empty (you saw it born blank on the previous card). It cannot define itself out of thin air — it has to GROW first. The bigger its interaction trail and working memory get, the more it actually knows about what it is for. This growth IS the work of OBSERVE.',
            hood: 'New prompts and Q&amp;A append to <code>user_interactions[]</code> on the job_core record — the same array that started life holding only your first prompt. Findings are written into the CLAUDE.md working-memory files OBSERVE is permitted to touch. Both keep growing across the phase, before <code>name</code> and <code>objective</code> are committed.'
        },
        'b-name': {
            title: 'name — the job names itself', tag: 'object',
            what: 'Out of everything it has gathered, the job settles on a name — a short handle for this unit of work.',
            why: 'A nameless job is just "the thing the seed is doing." Naming is the first commitment: it turns the growing pile of context into a thing you can point at, track, and reason about.',
            hood: 'Set via <code>job.sh update name "&lt;name&gt;"</code> (focused-only — no id arg; the first positional is the FIELD), filling the <code>name</code> field that was born as <code>""</code>. The gate refuses to advance while name is still empty.'
        },
        'b-objective': {
            title: 'objective — a written brief, not a sentence', tag: 'object',
            what: 'The job writes down what "done" will mean — and not in one line. In cycle 1 it must grow the goal into a full 300–500 word brief.',
            why: 'A single sentence cannot be planned or verified against. The expanded brief is the compass every later phase — and every future re-run of a repeating job — reads. It is the single heaviest piece of OBSERVE.',
            hood: 'Set via <code>job.sh update objective</code> (focused-only — no id arg); the cycle-1 custom gate enforces the expansion floor <code>OBJECTIVE_EXPANSION_WORD_MIN=300</code> (under 300 words BLOCKS the advance; over 500 only coaches). Per the creation naming contract: deliberate CONDENSE-created jobs are born with a 100–150 word starter objective; the prompt-born bootstrap job (the one on this card) is the lone exception — born <code>objective:""</code> EMPTY, then named + expanded in its own cycle-1 OBSERVE (empty → ≥300 words).'
        },
        'b-gate': {
            title: 'Gate to PLAN', tag: 'gate',
            what: 'A checkpoint with a concrete SHAPE: four checks, every one of which must say YES before the job is allowed into PLAN.',
            why: 'This is what stops a barely-grown job from slipping forward. The job has to PROVE it named itself, wrote a real objective, did enough observing, and recorded what it learned — not just glance at the prompt and rush on.',
            hood: 'Enforced by <code>observe-commit.sh</code> on a forced advance, all four required: <code>name</code> non-empty AND (cycle 1) <code>objective ≥ 300 words</code> AND the <strong>three-family exit gate</strong> (metacognition commands ran + marked notes added + ≥1 reflector subagent ran) AND <code>≥ 1 CLAUDE.md update</code>. Miss any one → <code>REJECTED / BLOCKED</code>, stay in OBSERVE and keep growing. The up-close, per-check view is the detail card directly below.'
        },

        /* (CARD A2 "Active + focused" detail removed — its content already lives on
           card 0,0's record box; the down-slot under 0,0 is now the routes card.) */

        /* ---------------- CARD B2 : The gate to PLAN ---------------- */
        'b2-name': {
            title: 'name filled?', tag: 'gate',
            what: 'First check: has the job written a non-empty name?',
            why: 'No name means the job never defined what it is. The gate refuses — back to OBSERVE.',
            hood: '<code>observe-commit.sh</code>: if <code>name</code> is empty → <code>REJECTED: Job has no name</code>.'
        },
        'b2-objective': {
            title: 'objective expanded?', tag: 'gate',
            what: 'Second check: in cycle 1, has the one-line goal grown into a full 300–500 word objective?',
            why: 'A single sentence is not enough to plan or verify against. Cycle-1 OBSERVE must expand the objective into a real brief the rest of the cycles (and any future re-run) will read.',
            hood: '<code>observe-commit.sh</code> cycle-1 gate: the objective must reach the expansion floor — under 300 words <code>BLOCKS</code> (<code>OBJECTIVE_EXPANSION_WORD_MIN=300</code>); over 500 only coaches. (Cycles 2+ skip this — expansion is once per activation.)'
        },
        'b2-points': {
            title: 'Three-family exit gate?', tag: 'gate',
            what: 'Third check: did the job actually reflect on its own work this phase? The three-family gate requires that the CORE metacognition commands ran, new marked notes were added, and at least one reflector subagent ran.',
            why: 'This stops the job from glancing at the prompt and rushing onward — but via evidence of reflection, not a numeric score. Three distinct kinds of evidence must exist before PLAN unlocks.',
            hood: '<code>observe-commit.sh</code> enforces the three-family exit gate: (a) reflection commands ran — the 2 CORE ops [hard constitutive floor] PLUS a per-entry drawn minimum of nuanced lenses (from <code>METACOG_FAMILYA_SET</code> {1,2,3}) [hard]; (b) marked-note adds meet the per-entry target drawn from <code>METACOG_FAMILYB_SET</code> [soft by default]; (c) ≥1 of the phase\'s available reflector subagents (<code>METACOG_FAMILYC_REFLECTORS</code>) ran [hard]. No point currency or numeric score exists.'
        },
        'b2-claude': {
            title: '≥ 1 CLAUDE.md update?', tag: 'gate',
            what: 'Fourth check: has the job written its findings into working memory at least once?',
            why: 'OBSERVE\'s whole job is to gather and synthesise. If nothing was written down, nothing was learned.',
            hood: '<code>observe-commit.sh</code>: needs <code>updates ≥ 1</code> CLAUDE.md update, else <code>BLOCKED: Need at least one CLAUDE.md update</code>.'
        },
        'b2-unlock': {
            title: 'PLAN unlocks', tag: 'phase',
            what: 'All four checks pass → the job is allowed into PLAN.',
            why: 'Only a job that knows its name, its goal, and has done real observation gets to start planning. No empty jobs get through.',
            hood: 'With name + objective non-empty AND the three-family exit gate satisfied AND ≥ 1 CLAUDE.md update, <code>observe-commit.sh</code> permits the <code>observe→plan</code> forward transition. The intra-phase min-max gate paces the work independently; the three-family gate is the advance condition.'
        },

        /* ---------------- CARD PLAN : choose the Stage ---------------- */
        'p-null': {
            title: 'plan_file: null', tag: 'object',
            what: 'When the job first enters PLAN, one field — <code>plan_file</code> — is initialized as <code>null</code> (it is not a creation field). Null means "the Stage has not been chosen yet."',
            why: 'A job\'s Stage is not decided when it is created. It is decided here, in PLAN, once the job actually understands its own work. Until then, the field honestly says "undecided".',
            hood: 'Born <code>null</code> at first PLAN-entry — <code>plan.sh init</code> creates the phase_plan extension entry (via <code>create_plan_job_with_entry</code>) with <code>plan_file: null</code> — not the <code>job_core</code> create path. <code>null</code> is the set-once sentinel — distinct from <code>false</code> (a real, chosen Stage): the cycle-1 PLAN→EXECUTE advance is BLOCKED while it stays null, so even a Stage-1 job must call <code>set-plan-file false</code> on purpose. Nothing auto-defaults.'
        },
        'p-decide': {
            title: 'set-plan-file — choose once', tag: 'action',
            what: 'In cycle-1 PLAN the job calls <code>set-plan-file</code> exactly once, committing its Stage by the value it writes.',
            why: 'This is the single most defining choice a job makes: what shape its work takes. It is deliberately irreversible — the job picks a Stage and lives with it, rather than drifting between shapes.',
            hood: 'Three accepted values: <code>false</code> (Stage 1), <code>plan_x.md</code> (Stage 2), <code>plan_x.yaml</code> (Stage 3). Set-once with a cycle-1 relaxation: a change is refused only when <code>plan_file</code> is non-null AND <code>cycle &gt; 1</code> — <code>plan.sh</code> dies "Plan file already set… Set-once is relaxed only at cycle 1." At cycle 1 (fresh run or reactivation) a re-call is allowed by design. The PLAN→EXECUTE advance is BLOCKED while the value is still <code>null</code> (<code>plan-commit.sh</code>), so even a Stage-1 job must call <code>set-plan-file false</code> on purpose. Nothing auto-defaults.'
        },
        'p-s1': {
            title: 'false → Stage 1', tag: 'object',
            what: 'Choosing <code>false</code> makes this a Stage-1 job: a single collaborative cycle, with no separate plan file.',
            why: 'Stage 1 is for one-off work — a single fix, a teaching session, a quick exploration. There is nothing to carry across runs, so it never writes a plan file.',
            hood: '<code>plan_file: false</code>. No multiplier exists. Each phase is paced by the count-based min-max gate (per-activity-class counters, one reset event — a CLAUDE.md update resets all class counters); entry is coached, not gated. Completion is eligible at every CONDENSE while <code>plan_file == false</code>.'
        },
        'p-s2': {
            title: 'plan_x.md → Stage 2', tag: 'object',
            what: 'Choosing a <code>.md</code> filename makes this a Stage-2 job: repeatable, multi-cycle work with a prose plan file.',
            why: 'Stage 2 is for structured work that benefits from an accumulating, human-readable plan — one that gets smarter every run. The plan file is the memory that survives across activations.',
            hood: '<code>plan_file: plan_&lt;name&gt;.md</code>. The plan file itself is created in cycle-1 EXECUTE (next card) — not at Stage choice. No multiplier exists; there is no RAPID mode. Each phase is paced identically: count-based min-max gate, coached entry, three-family exit gate as the advance condition. PLAN reads the <code>.md</code> at the start of every later cycle.'
        },
        'p-s3': {
            title: 'plan_x.yaml → Stage 3', tag: 'object',
            what: 'Choosing a <code>.yaml</code> filename makes this a Stage-3 job: same as Stage 2, but the plan file is structured YAML.',
            why: 'Stage 3 is for work that wants per-cycle context injected automatically at each phase. Completion behaves identically to Stage 2 — only the plan file\'s FORMAT differs.',
            hood: '<code>plan_file: plan_&lt;name&gt;.yaml</code>. Like Stage 2, no multiplier and no RAPID mode — the same count-based pacing applies. The YAML\'s <code>cycles:</code> list declares per-cycle entries; at phase entry it modifies EXISTING voices by voice-id (append / replace / prepend), injecting tailored context. Completion semantics are identical to Stage 2.'
        },

        /* ---------------- CARD EXECUTE : build, in scope ---------------- */
        'e-build': {
            title: 'Build in scope', tag: 'action',
            what: 'EXECUTE is the phase where the job actually makes things — writes files, edits code, produces the deliverable.',
            why: 'It is the ONLY phase with full write access. Every other phase is read-only or scripts-only on purpose, so building happens in one focused place, against a plan that is already decided.',
            hood: 'The execute-guard allows Write/Edit/MultiEdit, but only inside the job\'s declared scope — the "altered list" of directories the job named in OBSERVE/PLAN. Writes outside that scope, to the root brain, or to <code>knowledge/</code> (except the plan file) are blocked. Glob/Grep/Web are blocked too; gathering was OBSERVE\'s job.'
        },
        'e-perm': {
            title: 'write-permission check', tag: 'gate',
            what: 'Writing the plan file passes a small three-part permission check first: right scope, cycle 1, and the file does not already exist.',
            why: 'The plan file is precious — it is the job\'s cross-cycle memory. The check makes sure it is created exactly once, by the right job, at the right moment, and never silently overwritten.',
            hood: 'In <code>execute-guard.sh</code>: the write to the declared plan file is granted only when the path matches the canonical <code>.claude/jobs/&lt;id&gt;/plan_*.{md,yaml}</code> (legacy <code>.claude/knowledge/plans/</code> is a read-fallback) AND <code>cycle == 1</code> AND the file is non-existent → exit 0 (permission granted). This is a TOOL-access check, not a phase-advance gate.'
        },
        'e-planfile': {
            title: 'the plan file is born', tag: 'object',
            what: 'On a Stage-2 or Stage-3 job, the plan file itself is created here — in cycle-1 EXECUTE — not when the job was created, and not in PLAN.',
            why: 'PLAN only chose the Stage (the filename). EXECUTE is where building happens, so the plan file is built like any other artifact — then it persists across every future cycle and activation, getting smarter each run.',
            hood: 'The file is written with YAML frontmatter (<code>total_cycles:</code> for <code>.md</code>, a <code>cycles:</code> list for <code>.yaml</code>). After cycle 1, EXECUTE can no longer touch it. VERIFY is the plan file\'s ONLY post-creation editor — within cycle-1\'s editing window (any run); from cycle 2 the file is FROZEN. PLAN reads it but never writes it (PLAN\'s write surface is CLAUDE.md only).'
        },
        'e-advance': {
            title: 'Three-family gate + plan-file → advance', tag: 'gate',
            what: 'Moving on from EXECUTE is gated by the three-family exit gate (reflection evidence), the commit shape, and — on a Stage-2 or Stage-3 cycle-1 job — a Plan-File-Exists Gate: the plan file must actually be on disk before the phase advances.',
            why: 'There ARE two distinct gates here, but neither is a point check. The write-permission gate (in <code>execute-guard.sh</code>) decides whether the agent CAN write the plan file — scope + cycle + non-existence. The Plan-File-Exists Gate (in <code>execute-commit.sh</code>) decides whether the phase CAN ADVANCE — the file must actually exist. Stage 1 has no plan file, so that gate does not apply; for Stage 2/3 cycle 1 it does.',
            hood: '<code>execute-commit.sh --force</code> enforces the three-family exit gate (the advance condition, armed unconditionally) + commit shape + word floor. <strong>Custom gate (Stage 2/3, cycle 1 only):</strong> if <code>plan_file</code> is a real filename (not null/false/empty) AND cycle ≤ 1, it checks the file exists at <code>.claude/jobs/&lt;id&gt;/&lt;plan_file&gt;</code> (legacy <code>.claude/knowledge/plans/</code> also checked) — absent → <code>BLOCKED: cycle-1 EXECUTE declared plan file … but it does not exist on disk</code>. There is no 100-point check anywhere in this file.'
        },

        /* ---------------- CARD VERIFY : check, and maybe retreat ---------------- */
        'v-check': {
            title: 'Run the checks', tag: 'action',
            what: 'VERIFY runs verification — scripts and read-only inspection — to confirm the work actually meets the job\'s goal. It builds nothing new.',
            why: 'A separate honesty phase exists because the builder is biased: whoever just wrote the work tends to see it as correct. VERIFY checks it with fresh, independent eyes and tools.',
            hood: 'The verify-guard is scripts-only / read-only: it permits Bash (running test + check scripts) and reading, but blocks Write/Edit to project files. New implementation is not allowed here (<code>verify-guard.sh</code>).'
        },
        'v-fork': {
            title: 'Did VERIFY touch the plan?', tag: 'gate',
            what: 'Before VERIFY can move forward, one thing is checked: did this phase end up editing the plan file?',
            why: 'If VERIFY had to change the plan, then the plan that EXECUTE built against was wrong — so the work can\'t be trusted as-is. The fork decides: retreat and re-plan, or proceed.',
            hood: '<code>verify-commit.sh</code> counts <code>plan_edits</code>. If <code>plan_edits ≥ 1</code>, the forward advance to CONDENSE is BLOCKED and the job is required to take a <code>--backward</code> transition to PLAN instead.'
        },
        'v-back': {
            title: 'Forced back', tag: 'phase',
            what: 'When either VERIFY gate trips — a plan edit, or leftover Outstanding Items — the job is sent BACKWARD instead of forward, to re-plan or finish the work.',
            why: 'This is the cycle\'s self-correction. VERIFY is the only phase that can be FORCED backward — other phases CAN step back, but only by the agent\'s choice; VERIFY is compelled. Discovering the plan was wrong, or that work remains, is not a failure — it routes the job to fix things properly.',
            hood: 'Two explicit <code>--backward</code> transitions: a plan edit (the plan-file-edit must-backward gate in <code>verify-commit.sh</code>) forces back to PLAN; a non-empty <code>## Outstanding Items</code> section (the <code>verify-commit.sh</code> shape gate) forces back to PLAN or EXECUTE. Forward to CONDENSE stays blocked until a verify passes both.'
        },
        'v-clean': {
            title: 'All clear → CONDENSE', tag: 'gate',
            what: 'If neither gate trips — the plan was untouched AND no Outstanding Items remain — and the usual phase requirements are met, the job advances to CONDENSE. That move is one-way.',
            why: 'A clean verify means the work stands as planned with nothing left open. Moving into CONDENSE is deliberately irreversible: once you start consolidating, you don\'t un-verify and go back. The cycle commits to closing out.',
            hood: 'With no plan edits, an EMPTY Outstanding Items section, the three-family exit gate satisfied, and ≥ 1 CLAUDE.md update, <code>verify-commit.sh</code> permits the <code>verify→condense</code> forward transition — and there is no backward path out of CONDENSE.'
        },
        'v-outst': {
            title: 'Outstanding items left?', tag: 'gate',
            what: 'The second thing VERIFY checks before it can advance: is the "Outstanding Items" list empty? Any leftover per-cycle work blocks the forward move.',
            why: 'A cycle is not done while work remains open. Like the plan-edit check, a non-empty list forces the job BACKWARD — to PLAN or EXECUTE — to finish it, rather than carrying unfinished work into CONDENSE.',
            hood: 'A real VERIFY gate (the Outstanding-Items gate; <code>.claude/context/opevc-phases.md</code>): <code>verify-commit.sh</code> requires the <code>## Outstanding Items</code> section be EMPTY; any non-whitespace content BLOCKS forward-advance and directs a <code>--backward</code> move to PLAN or EXECUTE. A second, whole-job Outstanding-Items check ALSO runs later at CONDENSE\'s <code>[JOB-COMPLETE]</code> question — the two granularities (per-cycle here, whole-job there) work together.'
        },

        /* ---------------- CARD CONDENSE : the growth organ ---------------- */
        'c-water': {
            title: 'The 7-step waterfall', tag: 'action',
            what: 'CONDENSE runs a fixed seven-step routine that takes the cycle\'s scattered findings and routes each to a lasting home.',
            why: 'Without this, everything learned in a cycle would live only in throwaway working memory and vanish. The waterfall is how the brain actually GROWS — turning one cycle\'s notes into durable knowledge.',
            hood: 'The seven steps, in order (<code>phase_condense/docs/principles.md</code> · the 7-step waterfall): (1) footer→body absorption, (2) cross-file CLAUDE.md migration, (3) <code>[PENDING-JOB]</code> → new jobs, (4) <code>[VOICE-UPDATE]</code>, (5) <code>[AGENT-UPDATE]</code>, (6) <code>[KNOWLEDGE]</code> routing, (7) session-archive (last resort). Markers are removed as each is consumed — the next cycle starts clean.'
        },
        'c-deflate': {
            title: '≥ 80% deflation', tag: 'gate',
            what: 'To leave CONDENSE, the job must shrink its working memory by at least 80% — squeezing the cycle\'s bottom-section notes down to essentials.',
            why: 'Working memory has to return to a near-empty resting state so the next cycle can think fresh, not drown in last cycle\'s clutter. The deflation gate forces that compression to actually happen.',
            hood: 'One uniform threshold across all Job Stages: <code>CONDENSE_DEF_THRESHOLD = 80</code> (in <code>phase_condense/config.conf</code>), enforced by <code>condense-commit.sh</code>\'s deflation block. Below 80% deflation → the advance to idle is blocked.'
        },
        'c-pending': {
            title: '[PENDING-JOB] → spawn a job', tag: 'action',
            what: 'If the cycle left a <code>[PENDING-JOB]</code> note in a phase footer, step 3 of the waterfall turns it into a brand-new job.',
            why: 'Work discovered mid-cycle shouldn\'t be lost or jammed into the current job. CONDENSE is the one place allowed to spawn follow-up jobs — so new work becomes its own properly-tracked unit.',
            hood: 'Step 3 hands the marker to <code>condense-job-creator</code>, which calls <code>job.sh create</code> (standalone follow-up) or <code>job.sh create-dependent</code> (when the work blocks the focused parent — the link is automatic), chosen by the note\'s scope classification. Job creation is CONDENSE-owned — EXECUTE and VERIFY block it and coach the agent to defer to here.'
        },
        'c-complete': {
            title: '[JOB-COMPLETE]?', tag: 'gate',
            what: 'CONDENSE is where a job can actually END. It asks the completion question — and only here is that question eligible to fire.',
            why: 'Ending a job is a deliberate, single-place decision, not something any phase can do whenever. Tying it to CONDENSE means a job only closes after its findings are safely routed and memory is deflated.',
            hood: 'The <code>[JOB-COMPLETE]</code> eligibility check (in <code>question-capture.sh</code>) fires CONDENSE-only: Stage 1 (<code>plan_file == false</code>) at every CONDENSE; Stage 2/3 when <code>current_cycle ≥ effective_last_cycle</code>. If outstanding work remains, the job self-corrects by adding a cycle instead of completing.'
        },

        /* ---------------- CARD ROUTES : the four creation paths (mini-diagrams) ---------------- */
        /* Route A — prompt bootstrap */
        'rA-idle': {
            title: 'Seed idle', tag: 'state',
            what: 'No job is active — the seed is at rest.',
            why: 'A prompt only BOOTSTRAPS a job when nothing is already running: the first run, or the moment after every earlier job has finished.',
            hood: 'The prompt hook counts <code>active_count = jobs where status=="active"</code>; this route fires only when that count is <code>0</code>.'
        },
        'rA-prompt': {
            title: 'Your prompt', tag: 'context',
            what: 'You send a prompt to the idle seed.',
            why: 'Speaking to a sleeping seed IS starting a job — you never have to ask it to begin.',
            hood: 'Arrives on the <code>UserPromptSubmit</code> event, caught by <code>job_core/hooks/prompt-handler.sh</code>.'
        },
        'rA-hook': {
            title: 'Prompt hook bootstraps', tag: 'action',
            what: 'A reflex catches the prompt, sees no active job, and turns the prompt INTO a job.',
            why: 'This is the only creation route that happens OUTSIDE the phase machine — no OBSERVE or PLAN around it. It runs before any phase begins.',
            hood: '<code>job.sh --hook create-active</code> (HOOK_MODE-gated; the agent cannot call it itself). One single jq write.'
        },
        'rA-job': {
            title: 'New job — active + focused', tag: 'object',
            what: 'One live job appears, focused, holding only your prompt — its name and objective still empty.',
            why: 'It does not yet know what it is for. Working that out is its first OBSERVE\'s job (the route the main sequence walks).',
            hood: 'Born <code>status:"active"</code>, <code>focused:true</code>, <code>name:""</code>, <code>objective:""</code>, <code>user_interactions:["&lt;prompt&gt;"]</code>. The prompt-born bootstrap is the lone nameless birth — per the creation naming contract, deliberate (CONDENSE-created) jobs arrive with a name + 100–150w objective; only this bootstrap path is born empty, then named + expanded in its own cycle-1 OBSERVE.'
        },
        /* Route B — CONDENSE standalone */
        'rB-marker': {
            title: '[PENDING-JOB] note', tag: 'action',
            what: 'Mid-cycle, the agent drops a note in a CLAUDE.md footer: "this deserves its own job later."',
            why: 'Follow-up work found mid-cycle should not be lost or jammed into the current job. The note defers it cleanly.',
            hood: 'A <code>[PENDING-JOB]</code> marker in a phase footer; it is NOT acted on until CONDENSE.'
        },
        'rB-condense': {
            title: 'CONDENSE · step 3', tag: 'phase',
            what: 'Job creation happens at CONDENSE — the one phase with cycle-wide context to judge what follow-up work is really needed.',
            why: 'EXECUTE and VERIFY block job creation and coach the agent to defer it here, so new work becomes its own properly-tracked unit.',
            hood: 'CONDENSE step 3 of the waterfall hands the marker to <code>condense-job-creator</code>, which checks for an overlapping pending job (via <code>job.sh list</code>) and rejects duplicates — soft coaching plus subagent judgment, not a hard gate. There is no <code>_is_in_scope_job</code> helper or <code>--out-of-scope</code> flag; overlap handling is the subagent\'s explore-first check.'
        },
        'rB-creator': {
            title: 'condense-job-creator', tag: 'action',
            what: 'A subagent reads the marker and creates a fresh, independent job.',
            why: 'Standalone means it is in no other job\'s dependency list — it can complete on its own.',
            hood: '<code>job.sh create</code>. Born <code>status:"pending"</code>, <code>focused:false</code>, name = a slug, objective = a 100–150 word starter intent.'
        },
        'rB-job': {
            title: 'New job — pending', tag: 'object',
            what: 'A new standalone job, waiting its turn. No user was involved.',
            why: 'Its real detail is deferred to ITS OWN first OBSERVE when it later activates — just like the bootstrap job, only born pending instead of active.',
            hood: '<code>status:"pending"</code>, <code>focused:false</code>, <code>depends_on:[]</code>.'
        },
        /* Route C — CONDENSE dependent */
        'rC-marker': {
            title: '[PENDING-JOB] · blocking', tag: 'action',
            what: 'Same as route B — a note left mid-cycle — but for work that must finish BEFORE the current job.',
            why: 'Some follow-up work blocks the parent; it must be modelled as a dependency, not a standalone.',
            hood: 'The same <code>[PENDING-JOB]</code> marker; the dependency intent is realised at CONDENSE.'
        },
        'rC-condense': {
            title: 'CONDENSE · step 3', tag: 'phase',
            what: 'Again CONDENSE — the phase that owns graph additions.',
            why: 'Adding a dependency needs cycle-wide context; CONDENSE has it.',
            hood: 'Dependency creation is CONDENSE-gated (<code>condense-guard.sh</code>).'
        },
        'rC-creator': {
            title: 'create-dependent', tag: 'action',
            what: 'Creates the new job AND links it as a dependency of the focused job in one step.',
            why: 'The link is what makes the parent wait.',
            hood: '<code>job.sh create-dependent</code>: creates the job (pending) and appends its id to the focused job\'s <code>depends_on[]</code>.'
        },
        'rC-dep': {
            title: 'New dep job — pending', tag: 'object',
            what: 'The new job, born pending, that must finish first.',
            why: 'Same birth shape as a standalone job; only its membership in a parent\'s depends_on[] differs.',
            hood: '<code>status:"pending"</code>; its id now sits in the parent\'s <code>depends_on[]</code>.'
        },
        'rC-parent': {
            title: 'Focused job waits', tag: 'object',
            what: 'The current focused job now lists the new job as a dependency and cannot complete until it is done.',
            why: 'Adding a dependency is a CONDENSE act; REMOVING one is a VERIFY act. This is the <b>lifecycle-symmetry principle</b>: the phase with the right context owns each operation. CONDENSE holds the cycle-wide synthesis context where new or blocking follow-up work is recognised — so graph ADDITIONS (and all job creation) belong there. VERIFY audits the focused job\'s actual work — so it is the natural place to discover that a declared dependency turned out to be unneeded, and REMOVE it.',
            hood: 'Verified in the live seed (not a hallucinated feature): <code>condense-guard.sh</code> allows <code>add-dependency</code> + <code>create-dependent</code>; <code>verify-guard.sh</code> allows ONLY <code>remove-dependency</code> and explicitly blocks adds (routing them to a <code>[PENDING-JOB]</code> marker for CONDENSE). The stop gate then refuses to complete a job while any id in its <code>depends_on[]</code> is still unfinished.'
        },
        /* Route D — plugin-touch (user-approved) */
        'rD-need': {
            title: 'Work touches plugins', tag: 'action',
            what: 'CONDENSE finds that the follow-up work will edit the seed\'s own plugin layer.',
            why: 'Editing plugins is privileged — it can only happen inside a user-approved job, so an ordinary create is not allowed.',
            hood: 'The plugin layer is guarded by PLUGIN-LOCK; touching it requires the <code>plugin_lock_approval</code> signal on the job.'
        },
        'rD-q': {
            title: '[JOB-APPROVE-CREATION]', tag: 'gate',
            what: 'The seed asks and YOU confirm — minting a NEW job that is born cleared for plugin work.',
            why: 'The agent can never grant itself the right to touch plugins; a human says yes. This is the CREATION route. A job ALREADY in flight can get the same right raised mid-life by its sibling question <code>[JOB-APPROVE-PLUGIN]</code> (any active phase, on the focused job, also user-confirmed) — so this is the creation-time route, not the only user-confirmed one.',
            hood: 'A registered CONDENSE-only prefixed question. On confirm the post-handler runs <code>job.sh create</code> then <code>approve-plugin-lock</code>. Its mid-life sibling <code>[JOB-APPROVE-PLUGIN]</code> reuses the same <code>approve-plugin-lock</code> writer on the focused job.'
        },
        'rD-create': {
            title: 'create + approve-plugin-lock', tag: 'action',
            what: 'On your yes, the job is created and immediately marked as allowed to touch plugins.',
            why: 'Two effects in one confirmed step: a new job, and the plugin-permission flag raised on it.',
            hood: '<code>job.sh create</code> then <code>job.sh --hook approve-plugin-lock</code> → <code>plugin_lock_approval:true</code>.'
        },
        'rD-job': {
            title: 'New job — plugin-approved', tag: 'object',
            what: 'A new job carrying the rare plugin_lock_approval flag.',
            why: 'That flag is the "allowed to touch plugins" signal the lock-manager reads; it is what sets this route apart from the others.',
            hood: '<code>plugin_lock_approval:true</code> (job-identity-level — never reset on reactivation). It grants the RIGHT; an actual edit still needs a separate <code>[PLUGIN-LOCK]</code> unlock.'
        },

        /* ---------------- CARD STAGES-LOOP : the three job formats ---------------- */
        's1-lab': {
            title: 'Stage 1 — single cycle', tag: 'object',
            what: 'Stage 1 runs the OPEVC cycle exactly once — OBSERVE → PLAN → EXECUTE → VERIFY → CONDENSE — then it ends.',
            why: 'For one-off work that needs no repeat: a single fix, a quick exploration, a teaching session. Nothing has to carry across runs.',
            hood: '<code>plan_file == false</code>. No plan file persists; <code>[JOB-COMPLETE]</code> is eligible at its single CONDENSE. (It can still emit a <code>[PENDING-JOB]</code> note to propose a repeatable Stage-2 version.)'
        },
        's2-lab': {
            title: 'Stage 2 — looping, .md plan', tag: 'object',
            what: 'Stage 2 runs the cycle many times — cycle 1, 2, … N. Each cycle ends in its own CONDENSE, which either starts the next cycle or, at the last, completes the job.',
            why: 'For repeatable, structured work that benefits from an accumulating plan that gets smarter each run.',
            hood: '<code>plan_file == plan_&lt;name&gt;.md</code> with <code>total_cycles: N</code>. Cycle 1 creates the plan; cycles 2..N work against it. Completion eligible when <code>current_cycle &gt;= effective_last_cycle</code>. The .md is READ each cycle but does NOT inject.'
        },
        's3-lab': {
            title: 'Stage 3 — looping, .yaml injects', tag: 'object',
            what: 'Stage 3 loops exactly like Stage 2, with identical completion. The difference is the plan FORMAT: a .yaml that injects tailored context into each phase, every cycle.',
            why: 'When each cycle wants its own per-phase guidance — e.g. point OBSERVE at specific sources for cycle 3. A .md plan cannot do this. That injection is the ONLY difference between Stage 2 and Stage 3.',
            hood: '<code>plan_file == plan_&lt;name&gt;.yaml</code>. Its <code>cycles:</code> list declares per-cycle entries; at phase entry it modifies EXISTING voices by voice-id (append / replace / prepend). Completion semantics identical to Stage 2.'
        },

        /* ---------------- CAPSTONE : one job, many lanes ---------------- */
        'cap-id': {
            title: 'One job = one ID', tag: 'object',
            what: 'A job is, at heart, a single timestamp identifier. Everything else about it is stored in pieces, elsewhere.',
            why: 'This is the structural surprise of the whole system. You picture "a job" as one file — but there is no such file. There is just an ID, and a set of plugins that each remember their own slice of it.',
            hood: 'The id is a creation-time timestamp string. Each plugin keys its own <code>data.json</code> records by this same id — that shared key is the only thing tying the lanes together into "one job".'
        },
        'cap-core': {
            title: 'job_core lane', tag: 'object',
            what: 'The job_core plugin owns the job\'s identity slice: its name, objective, status, focus flag, and interaction trail.',
            why: 'This is the lane you met at birth — the "what am I and what am I for" record. It is the base record every other lane hangs off.',
            hood: '<code>job_core/data.json</code> holds the record with <code>name</code>, <code>objective</code>, <code>status</code>, <code>focused</code>, <code>user_interactions</code>, <code>depends_on</code>, timestamps — created in the single jq write at birth.'
        },
        'cap-phasic': {
            title: 'phasic lane', tag: 'object',
            what: 'The phasic system owns a separate small record: which phase the job is in, and which cycle.',
            why: 'The job\'s "where am I in the OPEVC walk" is tracked apart from its identity — a different plugin, a different file, same id. Same job, split by concern.',
            hood: 'The phasic plugin appends <code>{id, current_phase, cycle}</code> to its own data file via <code>phase.sh --hook init</code>, then moves it with <code>phase.sh advance</code>.'
        },
        'cap-track': {
            title: 'plan · verify · condense lanes', tag: 'object',
            what: 'Each phase plugin keeps its own tally for the job — action counts per activity class, edits made, gate state — in its own file.',
            why: 'Every phase you walked through (PLAN, EXECUTE, VERIFY, CONDENSE) was enforced by a different plugin, and each remembers only what it needs about this job. The job\'s full state is the sum of all these lanes.',
            hood: 'Each OPEVC phase plugin (phase_observe, phase_plan, phase_execute, phase_verify, phase_condense) maintains per-job tracker entries (per-class action counts, plan_edits, deflation, three-family gate state, etc.) keyed by the job id — lit up only once the job first reaches that phase.'
        },
        'cap-sum': {
            title: 'interaction_summary lane', tag: 'object',
            what: 'The interaction_summary plugin keeps a durable, rolling summary of the job\'s conversation so it survives across sessions.',
            why: 'When context resets, the job shouldn\'t forget itself. This lane is the cross-session memory — the slice that lets a job be picked up later and still know what it was doing.',
            hood: '<code>interaction_summary</code> maintains a <code>summary_chain</code> in its own data file, submitted on a token-gate trigger. Another lane, same id.'
        },
        'cap-repeat': {
            title: 'Repeat: complete → wait → wake again', tag: 'action',
            what: 'A repeating job doesn\'t end for good when it completes. It completes, waits a set interval, and then wakes itself back up to run again.',
            why: 'This is what makes the seed a standing worker rather than a one-shot tool. A maintenance job — "check the shared folder for new contracts every morning" — completes, sleeps, and re-activates on its own, no prompt required.',
            hood: 'On completion, <code>last_completed_at</code> is stamped (epoch). A job is "due" when <code>status==completed</code>, <code>repeating_interval > 0</code>, and <code>last_completed_at + interval*3600 < now</code>. Two heartbeats catch it: one while the seed is working (<code>self-compact.sh</code> scan), one while it is stopped (the <code>quiescent-heartbeat</code> daemon). Reactivation resets the cycle counters and flips <code>completed → pending</code>, preserving the plan file. All of this is BUILT.'
        }
    };

window.DECK_CARDS = {
        '0,0': {
            kind: 'seq', step: 1,
            eyebrow: 'The job\'s life · step 1',
            title: 'A job is born',
            sub: 'A prompt hits a sleeping seed — its very first run, or the moment after every earlier job is done — and one live, focused job appears, knowing almost nothing about itself. This is just ONE of four ways a job starts (press ↓).',
            boxes: [
                { id:'a-idle',          x:40,  y:238, w:182, h:106, tag:'state',   t:'Seed idle',         s:'no job — asleep' },
                { id:'a-prompt',        x:300, y:238, w:182, h:106, tag:'context', t:'Your first prompt', s:'the only context it gets' },
                { id:'a-record',        x:560, y:166, w:216, h:230, tag:'object',  t:'A new job — born empty', record:true },
                { id:'a-enter-observe', x:852, y:238, w:128, h:106, tag:'phase',   t:'OBSERVE',           s:'cycle 1 · figure out what it is' }
            ],
            edges: [
                { from:'a-idle',   to:'a-prompt',        kind:'soft', label:'a prompt' },
                { from:'a-prompt', to:'a-record',        kind:'hard', label:'creates it' },
                { from:'a-record', to:'a-enter-observe', kind:'hard', label:'now observe' }
            ],
            stickies: [
                { x:22,  y:104, text:'First run, or every earlier job is done — the seed is asleep with <b>no focused job</b>.' },
                { x:360, y:64,  text:'<b>active + focused</b> in a SINGLE write — the first-prompt effect.' },
                { x:548, y:408, aha:true, text:'Born EMPTY — the job does <b>not yet know</b> its own name or goal. That is what OBSERVE is for.',
                  ref: { url:'../../b5/05_4-job-core.html', section:'Blog 5.4 · job_core — the job record', blurb:'A job is born as a small JSON record — created, made active, and focused in one write — with its name and goal still empty.' } }
            ],
            navHints: { down: 'see other places jobs are created' }
        },

        '1,0': {
            kind: 'seq', step: 2,
            eyebrow: 'The job\'s life · step 2',
            title: 'OBSERVE — the job grows into itself',
            sub: 'What you\'re looking at: the newborn job is almost empty. In OBSERVE it GROWS — its interaction trail and working memory fill up — until it can name itself and write a real objective. Only a job that has actually done this clears the four-check gate.',
            boxes: [
                { id:'b-read',      x:30,  y:250, w:152, h:92,  tag:'action',  t:'Read · ask · gather', s:'OBSERVE is read-wide time' },
                { id:'b-grow',      x:212, y:120, w:240, h:300, tag:'context', t:'the job keeps growing', fields:[
                    { k:'user_interactions:', v:'' },
                    { v:'[ your first prompt ]' },
                    { v:'+ your answers to its Qs', state:'grow' },
                    { v:'+ any later prompts', state:'grow' },
                    '—',
                    { k:'working memory:', v:'' },
                    { v:'+ findings, into CLAUDE.md', state:'grow' }
                ] },
                { id:'b-name',      x:494, y:150, w:206, h:74,  tag:'object',  t:'name', s:'a short handle — was "" empty' },
                { id:'b-objective', x:494, y:266, w:206, h:154, tag:'object',  t:'objective', fields:[
                    { k:'was:', v:'"" empty', state:'nul' },
                    { k:'now:', v:'a 300–500 word brief', state:'ok' },
                    { v:'what "done" means, in full', state:'grow' }
                ] },
                { id:'b-gate',      x:742, y:150, w:234, h:270, tag:'gate',    t:'Gate to PLAN', fields:[
                    { v:'✓ name — non-empty', state:'ok' },
                    { v:'✓ objective — ≥ 300 words', state:'ok' },
                    { v:'✓ three-family gate — reflect + mark + reflector', state:'ok' },
                    { v:'✓ CLAUDE.md — ≥ 1 update', state:'ok' },
                    '—',
                    { v:'all four YES → PLAN unlocks', state:'grow' },
                    { v:'any NO → stay in OBSERVE', state:'nul' }
                ] }
            ],
            edges: [
                { from:'b-read',      to:'b-grow',      kind:'soft', label:'gather · accumulate' },
                { from:'b-grow',      to:'b-name',      kind:'hard', label:'name it' },
                { from:'b-grow',      to:'b-objective', kind:'hard', label:'define the goal' },
                { from:'b-name',      to:'b-gate',      kind:'hard' },
                { from:'b-objective', to:'b-gate',      kind:'hard' }
            ],
            stickies: [
                { x:206, y:54,  text:'OBSERVE is <b>growth</b> time. Every new prompt and every Q&amp;A appends to the interaction trail; findings pile into working memory. The job literally gets <b>bigger</b> before it can define itself.',
                  ref: { url:'../06_3-observe.html', section:'Blog 6.3 · OBSERVE', blurb:'OBSERVE reads the prompt and context, accumulating into the job\'s interaction trail and working memory, then names the job and expands its objective. It cannot reach PLAN until the gate\'s checks pass.' } },
                { x:730, y:436, r:true, aha:true, text:'The gate has a <b>shape</b> — four concrete checks, not a vibe. Miss one and the job stays in OBSERVE and keeps growing.' }
            ],
            navHints: { down: 'detail: the four-check gate, up close' }
        },

        '0,1': {
            kind: 'routes',
            eyebrow: 'Related · under "A job is born"',
            title: 'Where jobs come from — the four creation routes',
            sub: '"A job is born" walked through ONE way a job starts: your prompt to an idle seed. There are four routes in all. Compare them at a glance, or open each one.',
            routes: [
                {
                    key: 'A', name: 'Prompt bootstrap',
                    boxes: [
                        { id:'rA-idle',   x:40,  y:228, w:172, h:104, tag:'state',   t:'Seed idle',   s:'no active job' },
                        { id:'rA-prompt', x:268, y:228, w:180, h:104, tag:'context', t:'your prompt', s:'arrives at the seed' },
                        { id:'rA-hook',   x:504, y:218, w:202, h:124, tag:'action',  t:'prompt hook', s:'active == 0 → bootstrap' },
                        { id:'rA-job',    x:762, y:150, w:208, h:262, tag:'object',  t:'new job', fields:[
                            { k:'status:', v:'active', state:'ok' },
                            { k:'focused:', v:'true', state:'ok' },
                            { k:'name:', v:'""', state:'nul' },
                            { k:'objective:', v:'""', state:'nul' },
                            '—',
                            { k:'user_interactions:', v:'' },
                            { v:'[ your prompt ]' }
                        ] }
                    ],
                    edges: [
                        { from:'rA-idle',   to:'rA-prompt', kind:'soft', label:'a prompt' },
                        { from:'rA-prompt', to:'rA-hook',   kind:'hard', label:'caught' },
                        { from:'rA-hook',   to:'rA-job',    kind:'hard', label:'creates' }
                    ],
                    stickies: [
                        { x:498, y:54, aha:true, text:'Fires <b>outside the phase machine</b> — born <b>active + focused</b>, holding only your prompt.' }
                    ]
                },
                {
                    key: 'B', name: 'CONDENSE standalone',
                    boxes: [
                        { id:'rB-marker',   x:40,  y:228, w:200, h:104, tag:'action', t:'[PENDING-JOB]', s:'a note in a footer' },
                        { id:'rB-condense', x:298, y:218, w:168, h:124, tag:'phase',  t:'CONDENSE', s:'step 3' },
                        { id:'rB-creator',  x:524, y:228, w:196, h:104, tag:'action', t:'job-creator', s:'job.sh create' },
                        { id:'rB-job',      x:776, y:190, w:194, h:180, tag:'object', t:'new job', fields:[
                            { k:'status:', v:'pending', state:'nul' },
                            { k:'focused:', v:'false' },
                            { k:'name:', v:'a slug', state:'ok' },
                            { k:'depends_on:', v:'[]' }
                        ] }
                    ],
                    edges: [
                        { from:'rB-marker',   to:'rB-condense', kind:'soft', label:'noticed this cycle' },
                        { from:'rB-condense', to:'rB-creator',  kind:'hard', label:'step 3' },
                        { from:'rB-creator',  to:'rB-job',      kind:'hard', label:'creates' }
                    ],
                    stickies: [
                        { x:286, y:54, aha:true, text:'Creation waits for <b>CONDENSE</b> — the phase with the cycle-wide context to judge follow-up work.' }
                    ]
                },
                {
                    key: 'C', name: 'CONDENSE dependent',
                    boxes: [
                        { id:'rC-marker',   x:24,  y:236, w:172, h:104, tag:'action', t:'[PENDING-JOB]', s:'blocking work' },
                        { id:'rC-condense', x:244, y:228, w:150, h:120, tag:'phase',  t:'CONDENSE', s:'step 3' },
                        { id:'rC-creator',  x:436, y:236, w:190, h:104, tag:'action', t:'create-dependent', s:'links the two' },
                        { id:'rC-dep',      x:680, y:104, w:188, h:124, tag:'object', t:'new dep job', s:'pending · finishes first' },
                        { id:'rC-parent',   x:680, y:332, w:188, h:124, tag:'object', t:'focused job', s:'depends_on += new' }
                    ],
                    edges: [
                        { from:'rC-marker',   to:'rC-condense', kind:'soft' },
                        { from:'rC-condense', to:'rC-creator',  kind:'hard', label:'step 3' },
                        { from:'rC-creator',  to:'rC-dep',      kind:'hard', label:'creates' },
                        { from:'rC-dep',      to:'rC-parent',   kind:'soft', label:'must finish first' }
                    ],
                    stickies: [
                        { x:24, y:60, text:'Adding a dependency is a <b>CONDENSE</b> act; <b>removing</b> one is a <b>VERIFY</b> act.' }
                    ]
                },
                {
                    key: 'D', name: 'Plugin-touch (user-approved)',
                    boxes: [
                        { id:'rD-need',   x:40,  y:230, w:190, h:112, tag:'action', t:'work touches plugins', s:'privileged' },
                        { id:'rD-q',      x:286, y:218, w:204, h:136, tag:'gate',   t:'[JOB-APPROVE-CREATION]', s:'you confirm' },
                        { id:'rD-create', x:548, y:230, w:180, h:112, tag:'action', t:'create + approve', s:'job.sh create' },
                        { id:'rD-job',    x:768, y:198, w:204, h:166, tag:'object', t:'new job', fields:[
                            { k:'plugin_lock_', v:'' },
                            { k:'  approval:', v:'true', state:'ok' },
                            '—',
                            { k:'status:', v:'pending', state:'nul' }
                        ] }
                    ],
                    edges: [
                        { from:'rD-need',   to:'rD-q',      kind:'hard', label:'needs approval' },
                        { from:'rD-q',      to:'rD-create', kind:'hard', label:'user says yes' },
                        { from:'rD-create', to:'rD-job',    kind:'hard', label:'creates' }
                    ],
                    stickies: [
                        { x:282, y:52, aha:true, text:'The creation route a user confirms. Its mid-life sibling <b>[JOB-APPROVE-PLUGIN]</b> raises the same right on a job already running — so a job can be cleared at birth OR later.' }
                    ]
                }
            ],
            compare: {
                cols: ['', 'A · Prompt bootstrap', 'B · CONDENSE standalone', 'C · CONDENSE dependent', 'D · Plugin-touch'],
                rows: [
                    { label: 'what triggers it', cells: [
                        'a prompt arrives while no job is active (first run, or idle after all done)',
                        'a [PENDING-JOB] note left in a footer this cycle',
                        'same — a [PENDING-JOB] note, for blocking follow-up work',
                        'CONDENSE finds follow-up work that will touch the plugin layer'
                    ] },
                    { label: 'which phase creates it', cells: [
                        'none — outside the phase machine (the always-on prompt hook)',
                        'CONDENSE (step 3)', 'CONDENSE (step 3)', 'CONDENSE (question handler)'
                    ] },
                    { label: 'command', cells: [
                        { v: 'job.sh --hook create-active', code: true },
                        { v: 'job.sh create', code: true },
                        { v: 'job.sh create-dependent', code: true },
                        { v: '[JOB-APPROVE-CREATION] → create', code: true }
                    ] },
                    { label: 'status · focus at birth', cells: [
                        'active · focused', 'pending · not focused', 'pending · not focused', 'pending · not focused'
                    ] },
                    { label: 'name · objective at birth', cells: [
                        { v: 'both "" — bootstrap only' },
                        'name = slug · objective 100-150w intent',
                        'name = slug · objective 100-150w intent',
                        'name = slug · objective 100-150w intent'
                    ] },
                    { label: 'user involved?', cells: [
                        'their prompt triggers it (no question)', 'no', 'no', 'YES — confirms the question'
                    ] },
                    { label: 'depends_on', cells: [
                        '[]', '[] (standalone)', "added to the FOCUSED job's depends_on[]", '[]'
                    ] },
                    { label: 'plugin_lock_approval', cells: [
                        'false', 'false', 'false', { v: 'TRUE — the distinguishing mark' }
                    ] },
                    { label: 'when full detail fills', cells: [
                        'cycle-1 OBSERVE (name + objective)', 'its own cycle-1 OBSERVE', 'its own cycle-1 OBSERVE', 'its own cycle-1 OBSERVE'
                    ] }
                ],
                note: '<span class="rt-warn-dot">&#9888;</span> <b>One divergence to consolidate:</b> Essay 06_7 teaches that CONDENSE hard-blocks scope-overlapping job creation (an <code>_is_in_scope_job</code> helper + an <code>--out-of-scope</code> flag); the live code has neither — overlap is soft coaching only. Open route B for detail.'
            },
            navHints: { up: 'up: A job is born' }
        },

        '1,1': {
            kind: 'detail',
            eyebrow: 'Related detail · under "OBSERVE"',
            title: 'The gate to PLAN',
            sub: 'What you\'re looking at: the OBSERVE → PLAN checkpoint, opened up. Four boxes must all answer "yes" before PLAN unlocks.',
            boxes: [
                { id:'b2-name',      x:60,  y:60,  w:210, h:92, tag:'gate',  t:'name filled?',          s:'non-empty string' },
                { id:'b2-objective', x:60,  y:188, w:210, h:92, tag:'gate',  t:'objective expanded?',   s:'cycle 1: 300–500 words' },
                { id:'b2-points',    x:60,  y:316, w:210, h:92, tag:'gate',  t:'Three-family gate?',     s:'reflect + mark + reflector' },
                { id:'b2-claude',    x:60,  y:444, w:210, h:92, tag:'gate',  t:'≥ 1 CLAUDE.md update?', s:'findings written down' },
                { id:'b2-unlock',    x:660, y:230, w:268, h:120, tag:'phase', t:'PLAN unlocks',         s:'all four say YES' }
            ],
            edges: [
                { from:'b2-name',      to:'b2-unlock', kind:'hard' },
                { from:'b2-objective', to:'b2-unlock', kind:'hard' },
                { from:'b2-points',    to:'b2-unlock', kind:'hard' },
                { from:'b2-claude',    to:'b2-unlock', kind:'hard' }
            ],
            stickies: [
                { x:360, y:64,  text:'<b>No empty jobs get to PLAN.</b> All four checks live in observe-commit.sh.' },
                { x:660, y:372, r:true, aha:true, text:'Any single NO → <b>REJECTED</b>, stay in OBSERVE and keep working.' }
            ],
            upnote: { x:660, y:64, label:'back up to: OBSERVE' }
        },

        '2,0': {
            kind: 'seq', step: 3,
            eyebrow: 'The job\'s life · step 3',
            title: 'PLAN — choose the Stage',
            sub: 'What you\'re looking at: the job makes one lasting choice — what SHAPE of work it is. That choice is a single field, set exactly once.',
            boxes: [
                { id:'p-null',   x:44,  y:230, w:198, h:100, tag:'object', t:'plan_file: null', s:'undecided — the set-once sentinel' },
                { id:'p-decide', x:330, y:230, w:188, h:100, tag:'action', t:'set-plan-file',   s:'cycle-1 PLAN · choose ONCE' },
                { id:'p-s1',     x:606, y:84,  w:248, h:80,  tag:'object', t:'false → Stage 1',        s:'single cycle · no plan file' },
                { id:'p-s2',     x:606, y:230, w:248, h:80,  tag:'object', t:'plan_x.md → Stage 2',    s:'a prose plan file' },
                { id:'p-s3',     x:606, y:376, w:248, h:80,  tag:'object', t:'plan_x.yaml → Stage 3',  s:'a YAML plan file' }
            ],
            edges: [
                { from:'p-null',   to:'p-decide', kind:'hard', label:'choose, once' },
                { from:'p-decide', to:'p-s1',     kind:'hard' },
                { from:'p-decide', to:'p-s2',     kind:'hard' },
                { from:'p-decide', to:'p-s3',     kind:'hard' }
            ],
            stickies: [
                { x:36,  y:96,  text:'Born <b>undecided</b>. PLAN\'s one move: commit the Stage — once, for keeps.' },
                { x:592, y:54,  aha:true, text:'Same job, <b>three shapes</b>. The plan file\'s FORMAT <i>is</i> the Stage.',
                  ref: { url:'../06_10-plan-state-machine.html', section:'Blog 6.10 · the plan-file state machine', blurb:'PLAN commits the job\'s Stage exactly once via set-plan-file — false (Stage 1), a .md (Stage 2), or a .yaml (Stage 3). plan_file is born null.' } },
                { x:36,  y:358, text:'Until a Stage is set, a gate <b>blocks EXECUTE</b> — even Stage 1 must choose <code>false</code>.' }
            ],
            navHints: { down: 'see the three job formats & how they loop' }
        },

        '2,1': {
            kind: 'detail',
            eyebrow: 'Related detail · under "PLAN — choose the Stage"',
            title: 'The three job formats — and how each loops',
            sub: 'What you\'re looking at: the five phases — O·P·E·V·C — run as one cycle. Stage 1 runs it once. Stage 2 and Stage 3 LOOP it (the ↻ arc below each). Their only difference: the .yaml injects context into each phase; the .md does not.',
            boxes: [
                /* Stage 1 — run the OPEVC cycle once */
                { id:'s1-lab',  x:22,  y:52, w:150, h:58, tag:'object', t:'Stage 1', s:'run the cycle once' },
                { id:'s1-O', mini:true, x:196, y:54, w:54, h:54, tag:'phase', t:'O', title:'OBSERVE' },
                { id:'s1-P', mini:true, x:268, y:54, w:54, h:54, tag:'phase', t:'P', title:'PLAN' },
                { id:'s1-E', mini:true, x:340, y:54, w:54, h:54, tag:'phase', t:'E', title:'EXECUTE' },
                { id:'s1-V', mini:true, x:412, y:54, w:54, h:54, tag:'phase', t:'V', title:'VERIFY' },
                { id:'s1-C', mini:true, x:484, y:54, w:54, h:54, tag:'phase', t:'C', title:'CONDENSE' },
                { id:'s1-done', mini:true, x:576, y:50, w:118, h:62, tag:'state', t:'done', title:'Ends after one CONDENSE — no plan file persists' },
                /* Stage 2 — loop the cycle, .md plan */
                { id:'s2-lab',  x:22,  y:230, w:150, h:58, tag:'object', t:'Stage 2', s:'loops · .md plan' },
                { id:'s2-O', mini:true, x:196, y:232, w:54, h:54, tag:'phase', t:'O', title:'OBSERVE' },
                { id:'s2-P', mini:true, x:268, y:232, w:54, h:54, tag:'phase', t:'P', title:'PLAN' },
                { id:'s2-E', mini:true, x:340, y:232, w:54, h:54, tag:'phase', t:'E', title:'EXECUTE' },
                { id:'s2-V', mini:true, x:412, y:232, w:54, h:54, tag:'phase', t:'V', title:'VERIFY' },
                { id:'s2-C', mini:true, x:484, y:232, w:54, h:54, tag:'phase', t:'C', title:'CONDENSE' },
                { id:'s2-done', mini:true, x:576, y:228, w:118, h:62, tag:'state', t:'complete', title:'Completes only at the last cycle' },
                /* Stage 3 — loop the cycle, .yaml injects each phase */
                { id:'s3-lab',  x:22,  y:408, w:150, h:58, tag:'object', t:'Stage 3', s:'loops · .yaml injects' },
                { id:'s3-yaml', mini:true, x:196, y:360, w:342, h:36, tag:'action', t:'.yaml ↓ injects each phase ↓', title:'The .yaml plan injects tailored context into each phase, every cycle' },
                { id:'s3-O', mini:true, x:196, y:410, w:54, h:54, tag:'phase', t:'O', title:'OBSERVE' },
                { id:'s3-P', mini:true, x:268, y:410, w:54, h:54, tag:'phase', t:'P', title:'PLAN' },
                { id:'s3-E', mini:true, x:340, y:410, w:54, h:54, tag:'phase', t:'E', title:'EXECUTE' },
                { id:'s3-V', mini:true, x:412, y:410, w:54, h:54, tag:'phase', t:'V', title:'VERIFY' },
                { id:'s3-C', mini:true, x:484, y:410, w:54, h:54, tag:'phase', t:'C', title:'CONDENSE' },
                { id:'s3-done', mini:true, x:576, y:406, w:118, h:62, tag:'state', t:'complete', title:'Completes at the last cycle — same as Stage 2' }
            ],
            edges: [
                /* Stage 1 — linear, no loop */
                { from:'s1-O', to:'s1-P', kind:'hard' }, { from:'s1-P', to:'s1-E', kind:'hard' },
                { from:'s1-E', to:'s1-V', kind:'hard' }, { from:'s1-V', to:'s1-C', kind:'hard' },
                { from:'s1-C', to:'s1-done', kind:'hard', label:'ends', keepLabel:true },
                /* Stage 2 — loop C back to O */
                { from:'s2-O', to:'s2-P', kind:'hard' }, { from:'s2-P', to:'s2-E', kind:'hard' },
                { from:'s2-E', to:'s2-V', kind:'hard' }, { from:'s2-V', to:'s2-C', kind:'hard' },
                { from:'s2-C', to:'s2-done', kind:'hard', label:'last cycle', keepLabel:true },
                { from:'s2-C', to:'s2-O', loop:true, label:'↻ ×N' },
                /* Stage 3 — loop + the .yaml injection above */
                { from:'s3-O', to:'s3-P', kind:'hard' }, { from:'s3-P', to:'s3-E', kind:'hard' },
                { from:'s3-E', to:'s3-V', kind:'hard' }, { from:'s3-V', to:'s3-C', kind:'hard' },
                { from:'s3-C', to:'s3-done', kind:'hard', label:'last cycle', keepLabel:true },
                { from:'s3-C', to:'s3-O', loop:true, label:'↻ ×N' }
            ],
            stickies: [
                { x:712, y:54, text:'<b>O·P·E·V·C</b> — the five phases, in order each cycle: OBSERVE → PLAN → EXECUTE → VERIFY → CONDENSE.' },
                { x:712, y:300, r:true, aha:true, text:'<b>Stage 1</b> runs the loop once. <b>Stage 2</b> &amp; <b>3</b> repeat it — the <b>↻</b> arc below each. Only <b>Stage 3</b>\'s <b>.yaml</b> injects context into each phase; Stage 2\'s <b>.md</b> does not.',
                  ref: { url:'../06_10-plan-state-machine.html', section:'Blog 6.10 · the plan-file state machine', blurb:'Stage 1 is single-cycle (plan_file false); Stage 2 (.md) and Stage 3 (.yaml) repeat across cycles. The .yaml additionally injects per-cycle, per-phase context at phase entry; the .md does not.' } }
            ],
            navHints: { up: 'up: PLAN — choose the Stage' }
        },

        '3,0': {
            kind: 'seq', step: 4,
            eyebrow: 'The job\'s life · step 4',
            title: 'EXECUTE — build, in scope',
            sub: 'What you\'re looking at: the one phase that can actually write things. It builds the work — and, on a planned job, this is where the plan file is born.',
            boxes: [
                { id:'e-build',    x:44,  y:214, w:208, h:116, tag:'action', t:'Build in scope',   s:'the only phase with full write' },
                { id:'e-perm',     x:336, y:100, w:228, h:100, tag:'gate',   t:'write-permission?', s:'scope + cycle 1 + not-yet-there' },
                { id:'e-planfile', x:648, y:100, w:248, h:100, tag:'object', t:'the plan file is born', s:'Stage 2/3 · written in cycle 1' },
                { id:'e-advance',  x:556, y:362, w:300, h:104, tag:'gate',   t:'three-family gate → advance', s:'+ plan-file exists (Stage 2/3 c1)' }
            ],
            edges: [
                { from:'e-build', to:'e-perm',     kind:'soft', label:'write it?' },
                { from:'e-perm',  to:'e-planfile', kind:'hard', label:'cycle 1 only' },
                { from:'e-build', to:'e-advance',  kind:'hard', label:'to move on' }
            ],
            stickies: [
                { x:44,  y:32,  aha:true, text:'Two different gates: <b>writing the plan file</b> ≠ <b>advancing the phase</b>.',
                  ref: { url:'../06_5-execute.html', section:'Blog 6.5 · EXECUTE', blurb:'EXECUTE is the one phase with full write access. On a planned job, this is where the plan file is actually written to disk.' } },
                { x:44,  y:372, text:'EXECUTE is the <b>only</b> phase with full write — but only inside the job\'s declared <b>scope</b>.' },
                { x:632, y:226, r:true, text:'Cycle 1 only — once the plan file exists, EXECUTE <b>can\'t touch it</b>. VERIFY is its only editor.' }
            ],
            backnote: { x:46, y:500, text:'← from PLAN: the Stage is locked in' },
            nextnote: { x:646, y:500, text:'Built → into VERIFY' }
        },

        '4,0': {
            kind: 'seq', step: 5,
            eyebrow: 'The job\'s life · step 5',
            title: 'VERIFY — check, and maybe retreat',
            sub: 'What you\'re looking at: the honesty phase. It runs checks only — and it is the one phase that can send the job BACKWARD instead of forward.',
            boxes: [
                { id:'v-check',  x:44,  y:230, w:188, h:100, tag:'action', t:'Run the checks', s:'scripts + read only · no new building' },
                { id:'v-fork',   x:286, y:120, w:196, h:96,  tag:'gate',   t:'Plan file touched?', s:'did VERIFY edit the plan?' },
                { id:'v-back',   x:600, y:96,  w:276, h:96,  tag:'phase',  t:'Forced back', s:'plan edit → PLAN · open item → PLAN/EXECUTE' },
                { id:'v-outst',  x:286, y:340, w:196, h:96,  tag:'gate',   t:'Outstanding items left?', s:'must be empty to advance' },
                { id:'v-clean',  x:600, y:340, w:276, h:96,  tag:'gate',   t:'All clear → CONDENSE', s:'a one-way door · no going back' }
            ],
            edges: [
                { from:'v-check', to:'v-fork',  kind:'hard', label:'then verify' },
                { from:'v-fork',  to:'v-back',  kind:'hard', label:'plan edited' },
                { from:'v-fork',  to:'v-outst', kind:'hard', label:'untouched' },
                { from:'v-outst', to:'v-back',  kind:'hard', label:'items remain', labelY:250 },
                { from:'v-outst', to:'v-clean', kind:'hard', label:'empty' }
            ],
            stickies: [
                { x:300, y:30,  aha:true, text:'Most phases can step <b>back</b> by choice. Only <b>VERIFY</b> is <b>forced</b> back — a plan edit or an open item blocks it from advancing.',
                  ref: { url:'../06_6-verify.html', section:'Blog 6.6 · Situational edges & the Markov property', blurb:'Forward transitions fire automatically; backward ones are explicit — the agent chooses where to roll back. A VERIFY plan-edit forces the one mandatory step back to PLAN.' } },
                { x:36,  y:372, text:'If VERIFY had to fix the plan, the work isn\'t trusted — it\'s sent <b>back to PLAN</b> to re-plan.' }
            ],
            backnote: { x:46, y:498, text:'← from EXECUTE: the work is built' },
            nextnote: { x:604, y:494, text:'All clear → into CONDENSE' }
        },

        '5,0': {
            kind: 'seq', step: 6,
            eyebrow: 'The job\'s life · step 6',
            title: 'CONDENSE — the growth organ',
            sub: 'What you\'re looking at: where the brain actually grows. The cycle\'s findings get routed to lasting homes, working memory is shrunk, and the job either ends or loops.',
            boxes: [
                { id:'c-pending',x:44,  y:40,  w:264, h:104, tag:'action', t:'[PENDING-JOB] → spawn a job', s:'step 3 can create new work' },
                { id:'c-water',  x:44,  y:228, w:248, h:124, tag:'action', t:'The 7-step waterfall', s:'route findings → lasting homes' },
                { id:'c-deflate',x:360, y:228, w:224, h:124, tag:'gate',   t:'≥ 80% deflation', s:'shrink working memory to advance' },
                { id:'c-complete',x:660,y:230, w:300, h:124, tag:'gate',   t:'[JOB-COMPLETE]?', s:'this is where a job can END' }
            ],
            edges: [
                { from:'c-water',   to:'c-deflate',  kind:'hard', label:'then shrink' },
                { from:'c-deflate', to:'c-complete', kind:'hard', label:'cleared' },
                { from:'c-water',   to:'c-pending',  kind:'soft', label:'a note → work' }
            ],
            stickies: [
                { x:392, y:36,  aha:true, text:'CONDENSE is the <b>only</b> phase that grows the brain — and the only place a job ends or spawns another.',
                  ref: { url:'../06_7-condense.html', section:'Blog 6.7 · CONDENSE', blurb:'CONDENSE deflates the cycle\'s footers through a 7-step waterfall, routing findings to lasting homes; an 80% deflation gate must pass to finish.' } },
                { x:360, y:402, text:'Working memory must shrink <b>≥80%</b> — making room for the next cycle to think fresh.' }
            ],
            backnote: { x:46, y:500, text:'← from VERIFY: the work checks out' },
            nextnote: { x:606, y:500, text:'Done → back to idle, or next cycle →' }
        },

        '6,0': {
            kind: 'capstone',
            eyebrow: 'The big picture',
            title: 'One job, many lanes',
            sub: 'Step back: there is no single "job" file. A job is ONE id, scattered across every plugin that touches it — each lane filling in lazily as the work moves.',
            boxes: [
                { id:'cap-id',     x:44,  y:198, w:250, h:122, tag:'object', t:'One job = one ID', s:'a single timestamp identifier' },
                { id:'cap-core',   x:560, y:48,  w:400, h:64, tag:'object', t:'job_core lane', s:'name · objective · status · focused' },
                { id:'cap-phasic', x:560, y:140, w:400, h:64, tag:'object', t:'phasic lane', s:'current_phase · cycle' },
                { id:'cap-track',  x:560, y:232, w:400, h:64, tag:'object', t:'plan · verify · condense lanes', s:'each phase keeps its own tally' },
                { id:'cap-sum',    x:560, y:324, w:400, h:64, tag:'object', t:'interaction_summary lane', s:'the durable cross-session summary' },
                { id:'cap-repeat', x:44,  y:432, w:486, h:96, tag:'action', t:'Repeat: complete → wait → wake again', s:'a repeating job never truly dies' }
            ],
            edges: [
                { from:'cap-id', to:'cap-core',   kind:'soft', label:'same ID' },
                { from:'cap-id', to:'cap-phasic', kind:'soft' },
                { from:'cap-id', to:'cap-track',  kind:'soft' },
                { from:'cap-id', to:'cap-sum',    kind:'soft' },
                { from:'cap-id', to:'cap-repeat', kind:'hard', label:'and when done…' }
            ],
            stickies: [
                { x:300, y:24,  aha:true, text:'Each lane lights up <b>lazily</b> — a plugin only writes its slice when the job first reaches it.',
                  ref: { url:'../../b5/05_4-job-core.html', section:'Blog 5.4 · job_core — one id, many lanes', blurb:'There is no single "job" file — a job is one timestamp id, and each plugin that touches it writes its own slice into its own data.json under that id.' } },
                { x:556, y:436, text:'A repeating job <b>completes</b>, waits its interval, then <b>wakes itself</b> — no prompt needed.' }
            ],
            backnote: { x:46, y:498, text:'← the whole journey, in one place' }
        }
    };
