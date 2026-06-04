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
            hood: 'Set via <code>job.sh update &lt;id&gt; name "&lt;name&gt;"</code>, filling the <code>name</code> field that was born as <code>""</code>. The gate refuses to advance while name is still empty.'
        },
        'b-objective': {
            title: 'objective — a written brief, not a sentence', tag: 'object',
            what: 'The job writes down what "done" will mean — and not in one line. In cycle 1 it must grow the goal into a full 300–500 word brief.',
            why: 'A single sentence cannot be planned or verified against. The expanded brief is the compass every later phase — and every future re-run of a repeating job — reads. It is the single heaviest piece of OBSERVE.',
            hood: 'Set via <code>job.sh update &lt;id&gt; objective</code>; the cycle-1 custom gate enforces the expansion floor <code>OBJECTIVE_EXPANSION_WORD_MIN=300</code> (under 300 words BLOCKS the advance; over 500 only coaches). <b>⚠ Surface check (code vs CONTEXT):</b> CONTEXT\'s "universal starter shape" says a job is born holding a 100–150 word objective for ALL creation paths — but a prompt-born job (the one on this card) is born with <code>objective:""</code> EMPTY. The 100–150 word starting brief is the CONDENSE-created pathway, not this one. Here OBSERVE expands from empty → ≥300 words. Flagged so the surfaces can be reconciled.'
        },
        'b-gate': {
            title: 'Gate to PLAN', tag: 'gate',
            what: 'A checkpoint with a concrete SHAPE: four checks, every one of which must say YES before the job is allowed into PLAN.',
            why: 'This is what stops a barely-grown job from slipping forward. The job has to PROVE it named itself, wrote a real objective, did enough observing, and recorded what it learned — not just glance at the prompt and rush on.',
            hood: 'Enforced by <code>observe-commit.sh</code> on a forced advance, all four required: <code>name</code> non-empty AND (cycle 1) <code>objective ≥ 300 words</code> AND <code>≥ 100 points</code> AND <code>≥ 1 CLAUDE.md update</code>. Miss any one → <code>REJECTED / BLOCKED</code>, stay in OBSERVE and keep growing. The up-close, per-check view is the detail card directly below.'
        },

        /* ---------------- CARD A2 : Active + focused ---------------- */
        'a2-active': {
            title: 'active', tag: 'state',
            what: '"Active" means this job is live — it is real work the seed has on its plate right now.',
            why: 'A job has a status. Active is the working state; later it can become completed. While any job is active, the seed will not go quietly to sleep — there is work to finish.',
            hood: 'The <code>status</code> field is set to <code>"active"</code> at birth by <code>create-active</code>. The stop gate refuses to release while any job is <code>active</code>.'
        },
        'a2-focused': {
            title: 'focused', tag: 'state',
            what: '"Focused" means this is THE one job the seed is concentrating on right now.',
            why: 'You can have several active jobs, but only one is focused. Every phase gate, every coaching voice, every write-scope keys off the single focused job. Focus is the spotlight.',
            hood: '<code>focused:true</code>. Only one record carries it at a time — focusing a different job first clears the flag everywhere else. Birth sets both <code>active</code> AND <code>focused</code> in the same jq write.'
        },
        'a2-onewrite': {
            title: 'one jq write', tag: 'action',
            what: 'Both flags — active and focused — are stamped onto the record in a single atomic write.',
            why: 'There is no in-between moment where a job is half-born. It appears already live and already in focus. Clean and atomic.',
            hood: 'A single <code>jq \'.jobs += [{... status:"active", focused:true ...}]\'</code> append. No second step sets focus — it is part of the same object literal.'
        },
        'a2-mirror': {
            title: 'phase mirror', tag: 'object',
            what: 'A second small record is created to track which phase the job is in.',
            why: 'The job\'s "what am I" lives in one place (job_core); its "where am I in the cycle" lives in another (the phasic system). Same job, split across plugins by the same ID.',
            hood: '<code>phase.sh --hook init &lt;id&gt;</code> appends <code>{id, current_phase:"idle", cycle:0}</code> to the phasic plugin\'s own data file. Then <code>phase.sh advance &lt;id&gt;</code> makes the <code>idle→observe</code> move.'
        },

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
            title: '≥ 100 points?', tag: 'gate',
            what: 'Third check: has the job done enough observing? Each phase has its own little point budget.',
            why: 'This stops the job from glancing at the prompt and rushing onward. It has to actually do the gathering work.',
            hood: '<code>observe-commit.sh</code> blocks the forced advance unless <code>total_points ≥ 100</code> (the per-phase transition threshold). Below it → <code>BLOCKED: Observation incomplete</code>.'
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
            hood: 'With name + objective non-empty AND points ≥ 100 AND ≥ 1 CLAUDE.md update, <code>observe-commit.sh</code> permits the <code>observe→plan</code> forward transition.'
        },

        /* ---------------- CARD PLAN : choose the Stage ---------------- */
        'p-null': {
            title: 'plan_file: null', tag: 'object',
            what: 'When the job is born, one field — <code>plan_file</code> — starts as <code>null</code>. Null means "the Stage has not been chosen yet."',
            why: 'A job\'s Stage is not decided when it is created. It is decided here, in PLAN, once the job actually understands its own work. Until then, the field honestly says "undecided".',
            hood: 'Set at job birth in the jq template: <code>plan_file: null</code> (<code>job_core/scripts/job.sh</code>, create path). <code>null</code> is the set-once sentinel — distinct from <code>false</code> (a real, chosen Stage).'
        },
        'p-decide': {
            title: 'set-plan-file — choose once', tag: 'action',
            what: 'In cycle-1 PLAN the job calls <code>set-plan-file</code> exactly once, committing its Stage by the value it writes.',
            why: 'This is the single most defining choice a job makes: what shape its work takes. It is deliberately irreversible — the job picks a Stage and lives with it, rather than drifting between shapes.',
            hood: 'Three accepted values: <code>false</code> (Stage 1), <code>plan_x.md</code> (Stage 2), <code>plan_x.yaml</code> (Stage 3). A SECOND call is refused — <code>plan.sh</code> checks the current value and dies "Plan file already set… Cannot change." The PLAN→EXECUTE advance is BLOCKED while the value is still <code>null</code> (<code>plan-commit.sh</code>), so even a Stage-1 job must call <code>set-plan-file false</code> on purpose. Nothing auto-defaults.'
        },
        'p-s1': {
            title: 'false → Stage 1', tag: 'object',
            what: 'Choosing <code>false</code> makes this a Stage-1 job: a single collaborative cycle, with no separate plan file.',
            why: 'Stage 1 is for one-off work — a single fix, a teaching session, a quick exploration. There is nothing to carry across runs, so it never writes a plan file.',
            hood: '<code>plan_file: false</code>. Its multiplier stays at the <code>0</code> sentinel (the job sets a real multiplier itself at each phase). Completion is eligible at every CONDENSE while <code>plan_file == false</code>.'
        },
        'p-s2': {
            title: 'plan_x.md → Stage 2', tag: 'object',
            what: 'Choosing a <code>.md</code> filename makes this a Stage-2 job: repeatable, multi-cycle work with a prose plan file.',
            why: 'Stage 2 is for structured work that benefits from an accumulating, human-readable plan — one that gets smarter every run. The plan file is the memory that survives across activations.',
            hood: '<code>plan_file: plan_&lt;name&gt;.md</code>. The plan file itself is created later, in cycle-1 EXECUTE (next card). A planned job runs RAPID by default — its multiplier auto-resolves to <code>3</code> at each phase entry (not set here at Stage choice).'
        },
        'p-s3': {
            title: 'plan_x.yaml → Stage 3', tag: 'object',
            what: 'Choosing a <code>.yaml</code> filename makes this a Stage-3 job: same as Stage 2, but the plan file is structured YAML.',
            why: 'Stage 3 is for work that wants per-cycle context injected automatically at each phase. Completion behaves identically to Stage 2 — only the plan file\'s FORMAT differs.',
            hood: '<code>plan_file: plan_&lt;name&gt;.yaml</code>. Like Stage 2, a planned job runs RAPID by default — the multiplier auto-resolves to <code>3</code> at each phase entry (<code>.md</code> and <code>.yaml</code> behave the same here). The YAML\'s <code>cycles:</code> list declares the per-cycle entries.'
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
            hood: 'In <code>execute-guard.sh</code>: the write to <code>.claude/knowledge/plans/plan_*.{md,yaml}</code> is granted only when scope == the declared <code>plan_file</code> AND <code>cycle == 1</code> AND the file is non-existent → exit 0 (permission granted). This is a TOOL-access check, not a phase-advance gate.'
        },
        'e-planfile': {
            title: 'the plan file is born', tag: 'object',
            what: 'On a Stage-2 or Stage-3 job, the plan file itself is created here — in cycle-1 EXECUTE — not when the job was created, and not in PLAN.',
            why: 'PLAN only chose the Stage (the filename). EXECUTE is where building happens, so the plan file is built like any other artifact — then it persists across every future cycle and activation, getting smarter each run.',
            hood: 'The file is written with YAML frontmatter (<code>total_cycles:</code> for <code>.md</code>, a <code>cycles:</code> list for <code>.yaml</code>). After cycle 1, EXECUTE can no longer touch it — ownership sits with PLAN, which reads it at the start of every later cycle.'
        },
        'e-advance': {
            title: '≥ 100 points → advance', tag: 'gate',
            what: 'Moving on from EXECUTE is gated by points — the job must do ≥ 100 points of building work — completely separately from the plan file.',
            why: 'This is the card\'s key surprise: write-permission and phase-advance are TWO different gates. Whether you CAN write the plan file (a tool check) has nothing to do with WHEN you may leave EXECUTE (a points check). Don\'t conflate them.',
            hood: '<code>execute-commit.sh</code> blocks the <code>--force</code> advance unless the phase has accumulated ≥ 100 points. The plan file\'s existence is not part of this check — a job can advance whether or not it wrote one.'
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
            hood: 'Two explicit <code>--backward</code> transitions: a plan edit (<code>verify-commit.sh:167–179</code>) forces back to PLAN; a non-empty <code>## Outstanding Items</code> section (<code>verify-commit.sh</code> shape gate, built 2026-06-03) forces back to PLAN or EXECUTE. Forward to CONDENSE stays blocked until a verify passes both.'
        },
        'v-clean': {
            title: 'All clear → CONDENSE', tag: 'gate',
            what: 'If neither gate trips — the plan was untouched AND no Outstanding Items remain — and the usual phase requirements are met, the job advances to CONDENSE. That move is one-way.',
            why: 'A clean verify means the work stands as planned with nothing left open. Moving into CONDENSE is deliberately irreversible: once you start consolidating, you don\'t un-verify and go back. The cycle commits to closing out.',
            hood: 'With no plan edits, an EMPTY Outstanding Items section, ≥ 100 points, and ≥ 1 CLAUDE.md update, <code>verify-commit.sh</code> permits the <code>verify→condense</code> forward transition — and there is no backward path out of CONDENSE.'
        },
        'v-outst': {
            title: 'Outstanding items left?', tag: 'gate',
            what: 'The second thing VERIFY checks before it can advance: is the "Outstanding Items" list empty? Any leftover per-cycle work blocks the forward move.',
            why: 'A cycle is not done while work remains open. Like the plan-edit check, a non-empty list forces the job BACKWARD — to PLAN or EXECUTE — to finish it, rather than carrying unfinished work into CONDENSE.',
            hood: 'A real VERIFY gate (<code>CONTEXT.opevc.md:173</code>, built 2026-06-03): <code>verify-commit.sh</code> requires the <code>## Outstanding Items</code> section be EMPTY; any non-whitespace content BLOCKS forward-advance and directs a <code>--backward</code> move to PLAN or EXECUTE. A second, whole-job Outstanding-Items check ALSO runs later at CONDENSE\'s <code>[JOB-COMPLETE]</code> question — the two granularities (per-cycle here, whole-job there) work together.'
        },

        /* ---------------- CARD CONDENSE : the growth organ ---------------- */
        'c-water': {
            title: 'The 7-step waterfall', tag: 'action',
            what: 'CONDENSE runs a fixed seven-step routine that takes the cycle\'s scattered findings and routes each to a lasting home.',
            why: 'Without this, everything learned in a cycle would live only in throwaway working memory and vanish. The waterfall is how the brain actually GROWS — turning one cycle\'s notes into durable knowledge.',
            hood: 'The seven steps, in order (<code>principles.md</code>:79–86): (1) footer→body absorption, (2) cross-file CLAUDE.md migration, (3) <code>[PENDING-JOB]</code> → new jobs, (4) <code>[VOICE-UPDATE]</code>, (5) <code>[AGENT-UPDATE]</code>, (6) <code>[KNOWLEDGE]</code> routing, (7) session-archive (last resort). Markers are removed as each is consumed — the next cycle starts clean.'
        },
        'c-deflate': {
            title: '≥ 80% deflation', tag: 'gate',
            what: 'To leave CONDENSE, the job must shrink its working memory by at least 80% — squeezing the cycle\'s bottom-section notes down to essentials.',
            why: 'Working memory has to return to a near-empty resting state so the next cycle can think fresh, not drown in last cycle\'s clutter. The deflation gate forces that compression to actually happen.',
            hood: 'One uniform threshold across all Job Stages: <code>CONDENSE_DEF_THRESHOLD = 80</code> (<code>config.conf</code>:34–40), enforced by <code>condense-commit.sh</code> (lines 121–125). Below 80% deflation → the advance to idle is blocked.'
        },
        'c-pending': {
            title: '[PENDING-JOB] → spawn a job', tag: 'action',
            what: 'If the cycle left a <code>[PENDING-JOB]</code> note in a phase footer, step 3 of the waterfall turns it into a brand-new job.',
            why: 'Work discovered mid-cycle shouldn\'t be lost or jammed into the current job. CONDENSE is the one place allowed to spawn follow-up jobs — so new work becomes its own properly-tracked unit.',
            hood: 'Step 3 hands the marker to <code>condense-job-creator</code>, which calls <code>job.sh create-dependent</code> (auto-linking the new job to the focused parent). Job creation is CONDENSE-owned — EXECUTE and VERIFY block it and coach the agent to defer to here.'
        },
        'c-complete': {
            title: '[JOB-COMPLETE]?', tag: 'gate',
            what: 'CONDENSE is where a job can actually END. It asks the completion question — and only here is that question eligible to fire.',
            why: 'Ending a job is a deliberate, single-place decision, not something any phase can do whenever. Tying it to CONDENSE means a job only closes after its findings are safely routed and memory is deflated.',
            hood: 'The <code>[JOB-COMPLETE]</code> eligibility (<code>question-capture.sh</code>:181–194) fires CONDENSE-only: Stage 1 (<code>plan_file == false</code>) at every CONDENSE; Stage 2/3 when <code>current_cycle ≥ effective_last_cycle</code>. If outstanding work remains, the job self-corrects by adding a cycle instead of completing.'
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
            what: 'Each phase plugin keeps its own tally for the job — points accumulated, edits made, gate state — in its own file.',
            why: 'Every phase you walked through (PLAN, EXECUTE, VERIFY, CONDENSE) was enforced by a different plugin, and each remembers only what it needs about this job. The job\'s full state is the sum of all these lanes.',
            hood: 'phase_plan, phase_verify, phase_execute, and phase_condense each maintain per-job tracker entries (points, plan_edits, deflation, etc.) keyed by the job id — lit up only once the job first reaches that phase.'
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
            sub: 'A single prompt hits a sleeping seed — and one live job appears, knowing almost nothing about itself.',
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
            nextnote: { x:798, y:368, text:'Follow it into OBSERVE' },
            downhint: { x:60, y:506, label:'related: Active + focused, in one write' }
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
                { id:'b-objective', x:494, y:266, w:206, h:154, tag:'object',  t:'objective', warn:true, fields:[
                    { k:'was:', v:'"" empty', state:'nul' },
                    { k:'now:', v:'a 300–500 word brief', state:'ok' },
                    { v:'what "done" means, in full', state:'grow' }
                ] },
                { id:'b-gate',      x:742, y:150, w:234, h:270, tag:'gate',    t:'Gate to PLAN', fields:[
                    { v:'✓ name — non-empty', state:'ok' },
                    { v:'✓ objective — ≥ 300 words', state:'ok' },
                    { v:'✓ observed — ≥ 100 points', state:'ok' },
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
            kind: 'detail',
            eyebrow: 'Related detail · under "A job is born"',
            title: 'Active + focused, in one write',
            sub: 'What you\'re looking at: the two flags that make a newborn job both real and the centre of attention — set atomically, then mirrored into the phase machine.',
            boxes: [
                { id:'a2-onewrite', x:380, y:60,  w:240, h:96,  tag:'action', t:'one jq write',   s:'atomic — no half-born state' },
                { id:'a2-active',   x:150, y:236, w:212, h:104, tag:'state',  t:'active',         s:'the job is live work' },
                { id:'a2-focused',  x:640, y:236, w:212, h:104, tag:'state',  t:'focused',        s:'THE one job, right now' },
                { id:'a2-mirror',   x:380, y:418, w:240, h:96,  tag:'object', t:'phase mirror',   s:'current_phase: idle · cycle: 0' }
            ],
            edges: [
                { from:'a2-onewrite', to:'a2-active',  kind:'hard', label:'sets status' },
                { from:'a2-onewrite', to:'a2-focused', kind:'hard', label:'sets focus' },
                { from:'a2-active',   to:'a2-mirror',  kind:'soft' },
                { from:'a2-focused',  to:'a2-mirror',  kind:'soft', label:'then phase.sh init' }
            ],
            stickies: [
                { x:36,  y:386, text:'Only <b>ONE</b> job is focused at a time — focusing another clears this one.' },
                { x:760, y:386, r:true, text:'Many jobs can be <b>active</b>; exactly one is <b>focused</b>.' }
            ],
            upnote: { x:380, y:524, label:'back up to: A job is born' }
        },

        '1,1': {
            kind: 'detail',
            eyebrow: 'Related detail · under "OBSERVE"',
            title: 'The gate to PLAN',
            sub: 'What you\'re looking at: the OBSERVE → PLAN checkpoint, opened up. Four boxes must all answer "yes" before PLAN unlocks.',
            boxes: [
                { id:'b2-name',      x:60,  y:60,  w:210, h:92, tag:'gate',  t:'name filled?',          s:'non-empty string' },
                { id:'b2-objective', x:60,  y:188, w:210, h:92, tag:'gate',  t:'objective expanded?',   s:'cycle 1: 300–500 words' },
                { id:'b2-points',    x:60,  y:316, w:210, h:92, tag:'gate',  t:'≥ 100 points?',         s:'enough observing' },
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
            backnote: { x:46, y:498, text:'← from OBSERVE: it now knows its name + goal' },
            nextnote: { x:626, y:500, text:'A Stage chosen → into EXECUTE' }
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
                { id:'e-advance',  x:556, y:362, w:300, h:104, tag:'gate',   t:'≥ 100 points → advance', s:'points move the phase, not the file' }
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
                { x:632, y:226, r:true, text:'Cycle 1 only — once the plan file exists, EXECUTE <b>can\'t touch it</b>. PLAN owns it.' }
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
