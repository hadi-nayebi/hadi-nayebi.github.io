/* ============================================================================
 * phasic-cycle.cards.js — CONTENT for the "One Cycle, Five Compartments" deck.
 * Teaches: the SKELETON of the phasic brain (opevc-phases cluster) — the OPEVC
 * cycle (idle → O → P → E → V → C → idle) plus the two non-OPEVC states (idle,
 * gmode); the FORWARD_MAP / BACKWARD_MAP transition topology + the PLAN-HUB rule;
 * the conductor/musicians division of enforcement; the self-exempt, fail-safe
 * phase guard; the altered list (CLAUDE.md edits scope EXECUTE); section-anchor
 * write authority (cascading-downward, forward-write-only); the gmode arc; and the
 * fractal Markov-brain framing. Paired with the shared deck-engine.js + .css
 * (same dir). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section/field), never line numbers
 * (Rule 20). Rot-prone counts are NOT pinned. Ground truth: the [consolidated]
 * cluster .claude/context/opevc-phases.md.
 * Sources (all own-grep verified live):
 *   phasic_system/scripts/phase.sh — FORWARD_MAP="idle:observe observe:plan
 *     plan:execute plan:verify execute:verify verify:condense condense:idle";
 *     BACKWARD_MAP="plan:observe execute:plan execute:observe verify:execute
 *     verify:plan verify:observe observe:idle"; the enter-gmode arm (atomic jq:
 *     pre_gmode_phase + gmode_return_note + gmode_pending_job_snapshot +
 *     current_phase="gmode") + the exit-gmode arm (reads pre_gmode_phase, clears),
 *   phasic_system/hooks/phase-gate.sh — "IDLE ENFORCEMENT ONLY"; idle job.sh
 *     whitelist (show|focused|list|activate|focus|pause); CLAUDE_SUBAGENT early-exit,
 *   phase_observe/hooks/observe-guard.sh — self-exempt head (job.sh focused →
 *     current_phase → != "observe" exit 0); read-only git whitelist (log|blame|
 *     diff|show|…); NO set -euo pipefail (fail-safe-allow),
 *   phase_observe/scripts/observe.sh — the add-altered arm + altered_claude_md
 *     field + the reset_altered=true entry param,
 *   phase_execute/hooks/execute-guard.sh — exact dirname/CLAUDE.md match (no
 *     wildcard, no parent walk),
 *   lib/section_guard/section-check.sh — check_section_edit (four-anchor
 *     present/unique/in-order validation),
 *   phase_observe/scripts/observe-commit.sh — "Three-family exit gate: THE advance
 *     condition (ARMED unconditionally)",
 *   phasic_system/hooks/gmode-return-hook.sh — detects exit-gmode, re-injects the
 *     resumed phase's plan objective,
 *   + .claude/context/opevc-phases.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'phasic-cycle', seqLabel: 'one cycle, five compartments' };

window.DECK_INFO = {
    /* ---- Card 1: the OPEVC cycle ---- */
    'idle': {
        title: 'idle', tag: 'context',
        what: 'The resting state between cycles. No phase work, all tools available, no phase-specific gate active. It is where the seed switches which job is focused and opens or closes a lap.',
        why: 'A minimal, deliberately-sparse compartment so job-work never leaks into the place where focus shifts. You cannot healthily switch jobs mid-EXECUTE without shattering the compartmentalization — idle is where that move lives instead.',
        hood: 'A non-OPEVC state the conductor owns directly: <code>phasic_system/hooks/phase-gate.sh</code> ("IDLE ENFORCEMENT ONLY") admits only the job-management subset (<code>show|focused|list|activate|focus|pause</code>). Walk down to its two sub-states. Source: <code>opevc-phases.md</code> · "Phase".'
    },
    'observe': {
        title: 'OBSERVE (O)', tag: 'object',
        what: 'The gathering phase: read code, query knowledge, web-fetch, dispatch observe subagents, interview the user. No project-file writes — only the CLAUDE.md footer fills with what PLAN will need.',
        why: 'It prevents assumption-driven plans. No approach can form until the context is actually on the page, so the seed cannot free-style past the reading into a bad plan.',
        hood: 'Read-only on project files; free Glob/Grep/WebSearch/WebFetch (it is the only gathering phase). Self-enforced by <code>phase_observe/hooks/observe-guard.sh</code>. Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },
    'plan': {
        title: 'PLAN (P)', tag: 'object',
        what: 'Transform observations into an approach. For repeatable jobs cycle 1 also picks the plan shape; cycles 2+ plan the current slice. No project-file writes, and no web — planning is pure synthesis of what OBSERVE already gathered.',
        why: 'It prevents rationalized, post-hoc plans. The approach is committed before any code is written, not narrated after the fact — and PLAN is the unskippable hinge every cycle must pass through.',
        hood: 'No web by design (observe’s domain). The PLAN-HUB rule: there is no <code>observe:execute</code> / <code>observe:verify</code> edge — OBSERVE reaches building only THROUGH plan. Source: <code>opevc-phases.md</code> · "FORWARD_MAP".'
    },
    'execute': {
        title: 'EXECUTE (E)', tag: 'object',
        what: 'Implement the plan. The only phase with full project-file writes — but bounded to the altered list (the directories OBSERVE/PLAN declared by editing their CLAUDE.md). Cycle 1 of a repeatable job creates the plan file.',
        why: 'It prevents unstructured building that drifts from intent and is lost on failure. The plan is the contract EXECUTE fulfils, and the altered list keeps the writes inside the surface the thinking phases already reasoned about.',
        hood: 'Project writes gated by <code>phase_execute/hooks/execute-guard.sh</code> against <code>altered_claude_md</code> (exact-directory match, no parent walk). Walk to the altered-list card. Source: <code>opevc-phases.md</code> · "Altered list".'
    },
    'verify': {
        title: 'VERIFY (V)', tag: 'object',
        what: 'Check the executed work against the plan’s acceptance criteria. Project-file reads only (it may write CLAUDE.md and the plan file). It reports and ROUTES — backward to OBSERVE, PLAN, or EXECUTE, forward to CONDENSE — rather than patching its own work.',
        why: 'It prevents self-verification bias. With no project-file writes, the phase that judges the work is structurally unable to quietly fix what it just found wrong.',
        hood: 'Richest backward fan-out (three destinations: <code>verify:execute</code> / <code>verify:plan</code> / <code>verify:observe</code>). May reach the web only to CHECK findings, never to gather. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'condense': {
        title: 'CONDENSE (C)', tag: 'object',
        what: 'Distill working memory back into durable form: consume the cycle’s marked notes, snapshot the footer, then absorb and migrate it into the body and knowledge files. Job creation and the job-complete question happen here.',
        why: 'It prevents the forgetting cycle — the seed that finishes the work but learns nothing, starting the next cycle as cold as the last. CONDENSE is where the brain grows.',
        hood: 'One-way: there is NO backward edge out of CONDENSE; outstanding work is handled by <code>condense-commit.sh --force --add-cycle</code>, never by backing up. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP" (CONDENSE is one-way).'
    },

    /* ---- Card 1 detail (0,1): idle’s two sub-states + the cycle counter ---- */
    'idle-focused': {
        title: 'idle WITH a focused job', tag: 'state',
        what: 'A multi-cycle job sitting between laps stays focused. This is the continue-or-switch moment: advance to OBSERVE for the next cycle, switch focus to another job, pause this one, or (operator only) enter gmode.',
        why: 'Between-cycle is a real decision point, not dead air. Keeping it a distinct sub-state lets a dedicated voice coach the choice rather than rushing straight back into work.',
        hood: 'Keyed on whether a job is focused (<code>job.sh focused</code>). The idle entry voice splits to match — <code>phasic_system/hooks/voice.xml</code> · <code>entry-idle-focused</code>. Source: <code>opevc-phases.md</code> · "Phase" (idle sub-states).'
    },
    'idle-unfocused': {
        title: 'idle WITHOUT a focused job', tag: 'state',
        what: 'The seed just unfocused a completed job, or paused the focused one. A distinct cognitive state — next-job-selection: survey pending and active jobs, compare urgency, pick the next to focus, or reach a clean stop if none remain.',
        why: 'Choosing the next job is its own kind of work — surveying and comparing, not doing. No phase work is even possible here: idle→observe requires a focused job first.',
        hood: 'Voice <code>entry-idle-unfocused</code> (survey → compare → pick), fed by the <code>job.sh</code> survey commands. The cross-job continuity injection reads the last job’s sealed Prior Summary. Source: <code>opevc-phases.md</code> · "Phase".'
    },
    'gmode-rest': {
        title: 'gmode (the sibling state)', tag: 'context',
        what: 'The maintenance mode where the OPEVC phases go inactive — a sibling of idle, not a phase in the cycle. Entered with a substantial justification when a phase’s own controls legitimately deadlock progress.',
        why: 'Some fixes touch the substrate the phases run on; doing that work inside a phase would fight the phase’s own gates. gmode is the deliberate, user-gated lane for it — and only the OPEVC controls rest; every always-on plugin keeps enforcing.',
        hood: 'A non-OPEVC state the conductor owns. Walk the conductor card for the enforcement split, or the gmode-arc detail for its entry/exit. Source: <code>opevc-phases.md</code> · "Phase" (gmode).'
    },
    'cycle-counter': {
        title: 'the cycle counter', tag: 'state',
        what: 'Ticks plus-one at each idle→observe entry — the re-entry into focused-job cognition — and NOT at condense→idle. Returning to the inter-job pivot is not a new lap; starting fresh work is.',
        why: 'Anchoring the count to the start of real cognition keeps "how many laps has this job run" honest, which the completion math downstream depends on.',
        hood: '<code>cycle</code> lives in <code>data.json</code>, owned by <code>phase.sh</code>; monotonic-increment-only (preserves on focus-switch/pause). Source: <code>job-system.md</code> · "Cycle counter behavior".'
    },

    /* ---- Card 2: the two maps ---- */
    'forward-map': {
        title: 'FORWARD_MAP', tag: 'gate',
        what: 'The static list of permitted forward hops. Any transition not in the list is rejected. It is the complete forward topology of the cycle — adding a new forward move means appending one pair to this list.',
        why: 'Permission is STRUCTURAL (in the list or not), never state-conditional. The map has no opinion about WHEN to use a hop — that is the seed’s cognitive choice, judged at commit time, not by the graph.',
        hood: '<code>FORWARD_MAP="idle:observe observe:plan plan:execute plan:verify execute:verify verify:condense condense:idle"</code> in <code>phasic_system/scripts/phase.sh</code>, read by <code>phase.sh advance</code>. Source: <code>opevc-phases.md</code> · "FORWARD_MAP".'
    },
    'backward-map': {
        title: 'BACKWARD_MAP', tag: 'gate',
        what: 'The companion list of permitted backward (recovery) hops. VERIFY has the richest fan-out — three destinations; OBSERVE has the bail-out exit to idle. This is the complete backward topology.',
        why: 'Backward transitions are FREE — no shape gate, no metacog gate, no custom gate (only clean git, like every hop). Cheap recovery encourages the seed to back-track out of a bad plan rather than barrel forward through it.',
        hood: '<code>BACKWARD_MAP="plan:observe execute:plan execute:observe verify:execute verify:plan verify:observe observe:idle"</code> in <code>phase.sh</code>, read by the hook-only <code>phase.sh back</code>. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'plan-hub': {
        title: 'the PLAN-HUB rule', tag: 'context',
        what: 'PLAN is mandatory between OBSERVE and the building phases. There is no observe-to-execute and no observe-to-verify edge, and there never will be. OBSERVE reaches building only through PLAN.',
        why: 'It makes plan cognition the unskippable hinge of every cycle. The seed must always settle on an approach before it builds or tests — the one structural invariant the map enforces.',
        hood: 'Enforced by absence: no <code>observe:execute</code> / <code>observe:verify</code> pair exists in FORWARD_MAP. Source: <code>opevc-phases.md</code> · "FORWARD_MAP" (PLAN-HUB rule).'
    },
    'pv-jump': {
        title: 'plan→verify (the one non-adjacent jump)', tag: 'action',
        what: 'The single forward hop that skips a phase: PLAN advances straight to VERIFY when a plan needs re-testing without re-execution. Most common after VERIFY bounced a plan-file edit back to PLAN.',
        why: 'Post-creation plan-file edits belong to VERIFY, so a refinement lap routes its change-requests through the CLAUDE.md layer and forwards directly to VERIFY — no wasted EXECUTE pass.',
        hood: 'The <code>plan:verify</code> entry sits AFTER <code>plan:execute</code> (default first-match stays plan→execute); <code>plan-commit.sh --force --to verify</code> requires a <code>## Why No Execute</code> section. Source: <code>opevc-phases.md</code> · "plan→verify forward transition".'
    },

    /* ---- Card 2 detail (1,1): backward topology + the urgent bail ---- */
    'urgent-bail': {
        title: 'the very-urgent bail', tag: 'action',
        what: 'The single mid-cycle escape. A focused phase backs one hop to OBSERVE, and OBSERVE then bails to idle — so a job can yield focus urgently without a clean CONDENSE close.',
        why: 'A job’s only NORMAL exit is forward through CONDENSE; the cycle is closed, never abandoned mid-stream. The bail is the one deliberate exception, and it is routed, not direct.',
        hood: 'Uses existing edges: <code>plan:observe</code> / <code>execute:observe</code> / <code>verify:observe</code>, then <code>observe:idle</code>. The bail is a backward transition (<code>observe:idle</code> entry in <code>BACKWARD_MAP</code>); <code>suppress_next_cycle_increment</code> preserves the cycle counter so the bail does NOT lose a cycle. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'bail-through-observe': {
        title: 'routed through OBSERVE (no direct →idle)', tag: 'gate',
        what: 'There is intentionally no plan→idle, execute→idle, or verify→idle edge. The escape is forced through OBSERVE because idle only flows forward into OBSERVE — a returning job cannot silently resume on stale context.',
        why: 'Half-finished work resuming on a cold buffer is exactly the failure the routing prevents. The returning job is forced through a fresh OBSERVE before it can build again.',
        hood: 'Absent edges are the mechanism: no <code>*:idle</code> pairs except <code>observe:idle</code> and <code>condense:idle</code>. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP" (no →idle from P/E/V).'
    },
    'condense-oneway': {
        title: 'CONDENSE is one-way', tag: 'gate',
        what: 'No backward edge leaves CONDENSE. Its forward-only exit drives the cycle counter and marks the compartment boundary. Outstanding work found here opens a NEW cycle instead of backing up.',
        why: 'Learning is not something you undo. Forcing CONDENSE forward keeps the consolidation it just did intact and routes any leftover work into an explicit extension.',
        hood: 'Extension via <code>condense-commit.sh --force --add-cycle "&lt;text&gt;"</code> (appends to <code>extension_contexts[]</code>). Source: <code>opevc-phases.md</code> · "BACKWARD_MAP" (CONDENSE is one-way).'
    },
    'pv-backward-loop': {
        title: 'the plan-verify backward loop', tag: 'action',
        what: 'When VERIFY edits the plan file, its gate blocks forward-advance and sends the seed back to PLAN. PLAN re-thinks, then forwards straight to VERIFY again. The loop ends when a VERIFY pass makes no plan edit.',
        why: 'It is the cognitive bridge between "create the plan" and "use the plan": VERIFY is the gate that ensures the plan is actually executable and verifiable before operational work begins.',
        hood: 'Reuses the <code>verify:plan</code> backward edge; <code>verify-commit.sh</code> blocks when the entry’s <code>plan_edits</code> count is ≥ 1, voice <code>block-plan-file-edited</code>. Source: <code>opevc-phases.md</code> · "Plan-verify backward loop".'
    },

    /* ---- Card 3: conductor + musicians ---- */
    'phasic-system': {
        title: 'phasic_system (the conductor)', tag: 'object',
        what: 'The orchestrator plugin. It owns the cross-cycle state for every job, holds the phasic-layer voices, and directly enforces only the two minimal phases — idle and gmode — plus the gmode entry/return machinery.',
        why: 'Centralizing all phase enforcement in one mega-hook would fuse every phase’s rules into one failure surface. Keeping the conductor small lets each work-phase be authored, tested, and locked in isolation.',
        hood: '<code>phasic_system/scripts/phase.sh</code> owns <code>current_phase</code> + <code>cycle</code> in <code>data.json</code> and holds the only transition authority (the two maps). Source: <code>opevc-phases.md</code> · "Conductor/musicians model".'
    },
    'current-phase': {
        title: 'current_phase', tag: 'state',
        what: 'The single field that records WHERE the focused job is in the cycle. The conductor writes it; every phase guard reads it to decide whether it is the one that should be awake right now.',
        why: 'The conductor DESCRIBES where a job is; the musicians DECIDE what that means. One readable field is all the coordination the split needs.',
        hood: 'Held in <code>data.json</code> by <code>phase.sh</code>; flipped by <code>advance</code> / <code>back</code> / <code>set-phase</code> / <code>enter-gmode</code> / <code>exit-gmode</code>. Source: <code>opevc-phases.md</code> · "Conductor/musicians model".'
    },
    'five-guards': {
        title: 'the five work-phase guards (musicians)', tag: 'object',
        what: 'Each OPEVC work-phase is its own plugin with its own PreToolUse guard. They self-enforce their compartment, querying the conductor only to learn whether their phase is the focused job’s current one.',
        why: 'Self-contained plugins make adding, removing, or re-shaping a phase a local edit instead of surgery on a shared mega-hook. The same describe-vs-enforce separation the seed applies everywhere.',
        hood: '<code>observe-guard.sh</code> / <code>plan-guard.sh</code> / <code>execute-guard.sh</code> / <code>verify-guard.sh</code> / <code>condense-guard.sh</code>, one per phase plugin. Walk to the guard card. Source: <code>opevc-phases.md</code> · "Phase guard".'
    },
    'self-select': {
        title: 'exactly one guard live', tag: 'gate',
        what: 'On every tool call all five guards fire, but each immediately checks whether its phase matches current_phase and exits if not. So at any moment exactly one guard is actually enforcing.',
        why: 'No dispatcher routes calls to a phase; each guard self-selects. That is what makes the compartments real without a central traffic cop that could become the single failure surface.',
        hood: 'The self-exempt head: <code>focused_id=$(job.sh focused); [[ -z … ]] &amp;&amp; exit 0; [[ current_phase != own ]] &amp;&amp; exit 0</code> — byte-identical in all five. Source: <code>opevc-phases.md</code> · "Phase guard" (self-exempt pattern).'
    },

    /* ---- Card 3 detail (2,1): the gmode arc ---- */
    'enter-gmode': {
        title: 'enter-gmode (hook-only)', tag: 'action',
        what: 'The agent cannot self-enter gmode. It is REQUESTED via a justified prefixed question; a hook then performs the entry. Entry and the flip to current_phase=gmode happen in one atomic mutation.',
        why: 'gmode is a privileged maintenance lane. Gating entry behind a user-approved request keeps the seed from quietly dropping out of phase discipline to touch its own substrate.',
        hood: 'The <code>enter-gmode</code> arm in <code>phase.sh</code> (a hook-only command): one <code>jq</code> sets <code>pre_gmode_phase</code> + <code>gmode_return_note</code> + <code>gmode_pending_job_snapshot</code> + <code>current_phase="gmode"</code> together. Source: <code>opevc-phases.md</code> · "pre_gmode_phase field".'
    },
    'pre-gmode-phase': {
        title: 'pre_gmode_phase', tag: 'state',
        what: 'The hidden slot that stashes the home phase on entry, so the suspended phase can be restored on exit. A single slot, not a stack — one gmode at a time.',
        why: 'The atomic pair guarantees the seed can never observe current_phase=gmode without a recoverable home phase to return to.',
        hood: 'Set in the same <code>enter-gmode</code> jq; read back and cleared by <code>exit-gmode</code> (a missing stash is a "Corrupted state" error). Source: <code>opevc-phases.md</code> · "pre_gmode_phase field".'
    },
    'exit-gmode': {
        title: 'exit-gmode (agent-callable)', tag: 'action',
        what: 'The agent decides when its side-quest is done and leaves gmode on its own — but the exit is gate-checked: clean working tree first, then the resumed phase’s plan objective is re-injected for continuity.',
        why: 'Asymmetry by design: entry is gated (user-approved), exit is agent-timed but checked. The seed owns the WHEN; the gates own the WHETHER.',
        hood: '<code>gmode-return-hook.sh</code> (PostToolUse:Bash) detects the <code>phase.sh exit-gmode</code> call and re-injects the plan objective. Source: <code>opevc-phases.md</code> · "pre_gmode_phase field".'
    },
    'root-cause-gate': {
        title: 'the root-cause exit gate', tag: 'gate',
        what: 'Before exit-gmode is allowed, the seed must have emitted a NEW pending-job marked note this gmode — a commitment to investigate the root cause independently of the patch it just applied.',
        why: 'Anything that forced a gmode deserves an investigation wider than the visible fix. One live test entered gmode four times on faces of ONE root class because each fix only addressed the symptom in front of it.',
        hood: 'A count-diff vs the <code>gmode_pending_job_snapshot</code> taken at entry (exit needs count > snapshot). The note rides the marker pipeline into a real job at the next CONDENSE. Source: <code>opevc-phases.md</code> · "Gmode root-cause exit gate".'
    },

    /* ---- Card 4: the phase guard ---- */
    'phase-guard': {
        title: 'the phase guard', tag: 'gate',
        what: 'The per-phase PreToolUse hook that turns "this phase is read-only / fenced / scripts-only" from prose into refusal. One per work-phase plugin; it enforces the write-scope compartment, the pacing rhythm, and anchor authority.',
        why: 'It is the deterministic primitive underneath the whole phasic brain. Without it, every compartment rule would be a suggestion the model could ignore under pressure.',
        hood: 'Returns <code>0</code> = allow, <code>2</code> = block (the <code>block()</code> helper emits a voice to stderr then exits 2). Source: <code>opevc-phases.md</code> · "Phase guard".'
    },
    'self-exempt': {
        title: 'the self-exempt pattern', tag: 'gate',
        what: 'Each guard’s first action resolves the focused job and its current_phase; if there is no focused job, or the phase is not its own, the guard exits 0 as a no-op. The structural keystone of the whole design.',
        why: 'It is what makes "exactly one guard live" true, and it is also why gmode suspension is emergent — no special case needed.',
        hood: 'Byte-identical head across <code>observe/plan/execute/verify/condense-guard.sh</code>. Source: <code>opevc-phases.md</code> · "Phase guard" (self-exempt pattern).'
    },
    'fail-safe': {
        title: 'fail-safe-allow', tag: 'context',
        what: 'The guards deliberately do NOT use strict bash error-exit. A mid-script command failure can never leave the agent wedged in an undefined state — the hook always reaches an explicit allow-or-block exit.',
        why: 'A guard that crashes-closed would freeze the seed; a guard that crashes-open would lose enforcement. Reaching an explicit exit every time is how it stays safe under failure.',
        hood: 'Header note "NO set -euo pipefail — hook must always reach exit" (<code>observe-guard.sh</code> / <code>execute-guard.sh</code> "Critical Design"). Exit <code>1</code> reserved for hook errors. Source: <code>opevc-phases.md</code> · "Phase guard" (fail-safe-allow).'
    },
    'scope-compartment': {
        title: 'the restriction IS the pedagogy', tag: 'context',
        what: 'The compartments are deliberately asymmetric so a phase can only make the KIND of move its cognition requires. A phase cannot skip its work because the tools to skip it are simply blocked.',
        why: 'Forbidding tools is the teaching. OBSERVE has no project writes so it must read first; EXECUTE has no fresh web so it must build from the plan, not investigate.',
        hood: 'Each <code>&lt;phase&gt;-guard.sh</code> enforces a different surface; walk the write-scope detail card for the full table. Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },

    /* ---- Card 4 detail (3,1): per-phase write scope + gmode suspension ---- */
    'observe-scope': {
        title: 'OBSERVE scope', tag: 'context',
        what: 'Project files read-only; free Glob, Grep, and web; CLAUDE.md edits below its own anchor and the three below it. The gathering phase, opened wide for input.',
        why: 'OBSERVE is where new information legitimately enters the cycle, so it is the one phase with free search and web.',
        hood: '<code>observe-guard.sh</code>: Read free, project writes blocked, WebSearch/WebFetch allowed. Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },
    'plan-scope': {
        title: 'PLAN scope', tag: 'context',
        what: 'Project files read-only; Glob, Grep, and web all BLOCKED; CLAUDE.md below its own anchor, plus its own plan file. Pure synthesis of what OBSERVE gathered.',
        why: 'No new input may enter at PLAN — planning is reasoning over the already-gathered context, not a second gathering pass.',
        hood: '<code>plan-guard.sh</code>: web blocked (observe’s domain); <code>set-plan-file</code> is PLAN’s alone. Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },
    'execute-scope': {
        title: 'EXECUTE scope', tag: 'context',
        what: 'The only phase with full project-file writes — bounded to the altered list. Glob, Grep, and web blocked. It produces; it does not investigate.',
        why: 'Building is the move; searching and gathering belong to earlier phases. The altered list keeps the writes inside the declared surface.',
        hood: '<code>execute-guard.sh</code> checks targets against <code>altered_claude_md</code> with an exact-directory match. Source: <code>opevc-phases.md</code> · "Altered list".'
    },
    'verify-scope': {
        title: 'VERIFY scope', tag: 'context',
        what: 'Project files read-only; may run tests and scripts; Glob, Grep, and web allowed — but web only to CHECK findings against external reality, never to gather fresh scope. Writes CLAUDE.md and the plan file.',
        why: 'VERIFY works several surfaces to judge the work, but never patches the project itself — it routes backward instead.',
        hood: '<code>verify-guard.sh</code>: <code>bash …/tests/</code> and <code>…/scripts/</code> allowed; the plan-file editor role. Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },
    'condense-scope': {
        title: 'CONDENSE scope', tag: 'context',
        what: 'No project files; any .md and any voice.xml with NO section restriction; search blocked. The most permissive memory surface, and the only phase that may write the durable body above the OBSERVE anchor.',
        why: 'Consolidation has to reach every memory form to route knowledge into its durable home — so its write surface is the widest, and it is the only phase trusted with the body.',
        hood: '<code>condense-guard.sh</code> may <code>git add</code> directly (the one phase that can). Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },
    'gmode-suspend': {
        title: 'gmode suspension (emergent)', tag: 'gate',
        what: 'When current_phase is gmode, every work-phase guard’s "is this my phase" test is false, so all five exit 0. No work-phase guard fires — and there is no gmode branch anywhere in them. Suspension just falls out of the self-exempt pattern.',
        why: 'No special-casing means no second code path to keep in sync. gmode is not unguarded, though — the conductor’s gmode gate enforces the compartment in their place.',
        hood: 'There is NO <code>current_phase == gmode</code> branch in any work-phase guard; <code>gmode-gate.sh</code> holds the gmode compartment. Source: <code>opevc-phases.md</code> · "Phase guard" (gmode suspension is emergent).'
    },

    /* ---- Card 5: the altered list ---- */
    'altered-list': {
        title: 'the altered list', tag: 'state',
        what: 'The field that records which directories EXECUTE may write to. Editing a directory’s CLAUDE.md during OBSERVE or PLAN is what authorizes EXECUTE to touch project files there — the bus has teeth.',
        why: 'It ties write authority to thinking: a directory becomes editable only because a thinking phase reasoned about it on the page first. Scope is exact, never recursive.',
        hood: 'Lives in <code>altered_claude_md</code> on the job’s phasic state. Source: <code>opevc-phases.md</code> · "Altered list".'
    },
    'md-edit-declares': {
        title: 'editing CLAUDE.md = declaring scope', tag: 'action',
        what: 'The list is BUILT by editing, not configured. Every CLAUDE.md Edit/Write during OBSERVE or PLAN appends that directory to the list. OBSERVE and PLAN keep separate lists, merged at EXECUTE entry.',
        why: 'The same act that records your thinking about a directory also grants the right to change it. You cannot get write authority you did not reason about.',
        hood: 'The <code>add-altered</code> arm in <code>observe.sh</code> / <code>plan.sh</code> (PostToolUse trackers normalize + dedupe the path). Source: <code>opevc-phases.md</code> · "Altered list".'
    },
    'build-freeze-enforce': {
        title: 'build → freeze → enforce', tag: 'gate',
        what: 'Three steps: OBSERVE/PLAN BUILD the list in real time; EXECUTE entry FREEZES a merged snapshot; every EXECUTE write is ENFORCED against that frozen snapshot. The list resets at the start of each cycle.',
        why: 'Freezing at entry means EXECUTE writes against a stable, declared surface — not one that shifts mid-phase. Per-cycle reset forces every cycle to re-declare its own editable surface from scratch.',
        hood: 'Freeze: <code>execute-sensor.sh</code> → <code>execute.sh --hook set-altered-list</code> (jq unique). Reset: the <code>idle→observe</code> entry passes <code>reset_altered=true</code>. Source: <code>opevc-phases.md</code> · "Altered list".'
    },
    'exact-dir': {
        title: 'exact-directory match', tag: 'gate',
        what: 'Enforcement is an exact directory match — no parent-directory walking, no wildcards. Declaring a directory does not authorize its subdirectories. If a directory was never declared, the write is blocked.',
        why: 'Exact matching keeps the grant precise: a sweeping edit in a parent cannot silently reach unreviewed children.',
        hood: '<code>execute-guard.sh</code> uses <code>grep -qxF</code> against the list; the non-CLAUDE.md check requires the file’s <code>dirname/CLAUDE.md</code> to be present. Source: <code>opevc-phases.md</code> · "Altered list".'
    },

    /* ---- Card 6: section-anchor write authority ---- */
    'four-anchors': {
        title: 'the four footer anchors', tag: 'object',
        what: 'The four phase-section anchors — OBSERVE / PLAN / EXECUTE / VERIFY — that partition every CLAUDE.md into a durable body above and four phase footers below. A shared guard keeps them present, unique, and in order.',
        why: 'The anchors are the addressable structure that makes per-phase write authority enforceable — and an edit can never corrupt them.',
        hood: '<code>lib/section_guard/section-check.sh</code> <code>check_section_edit()</code> validates all four present/unique/in-order; partial anchors are blocked. Source: <code>opevc-phases.md</code> · "Section-anchor write authority".'
    },
    'cascading-down': {
        title: 'cascading-downward authority', tag: 'context',
        what: 'Write authority shrinks from the top as the cycle advances. OBSERVE writes its footer and the three below it; PLAN writes its own and below; EXECUTE its own and below; VERIFY writes only its own.',
        why: 'It lets an earlier phase pre-stage notes for a later one — OBSERVE can seed the verification checklist VERIFY will later mark off — turning the write rule into the engine of cross-phase hand-off.',
        hood: 'Each guard passes only its own anchor and below. Source: <code>opevc-phases.md</code> · "Section-anchor write authority" (cascading-downward asymmetry).'
    },
    'forward-write': {
        title: 'forward-write-only', tag: 'gate',
        what: 'Information flows downward and forward — an earlier phase leaves notes for a later one — but no phase can reach back UP, neither to rewrite an earlier footer nor into the durable body.',
        why: 'A coherent cognition trace needs single-direction authorship: a later phase cannot quietly rewrite what an earlier phase recorded, so the footer history stays honest.',
        hood: 'An edit at or above a guard’s own anchor is blocked. Source: <code>opevc-phases.md</code> · "Section-anchor write authority" (forward-write asymmetry).'
    },
    'condense-body': {
        title: 'the body is CONDENSE-only', tag: 'state',
        what: 'The durable region above the OBSERVE anchor can be written by no work-phase — only CONDENSE absorbs footer content up into it. That is where the cycle’s learning lands permanently.',
        why: 'Keeping the durable body off-limits to the work phases is what separates "scratch working memory" from "what the seed actually learned and kept".',
        hood: 'CONDENSE’s scope is the only one with no section restriction (the durable-body writer). Source: <code>opevc-phases.md</code> · "Per-phase write scope".'
    },

    /* ---- Card 7: a fractal Markov brain ---- */
    'action-space': {
        title: 'the action space', tag: 'context',
        what: 'The seed’s raw starting condition: the set of moves a CLI agent can sample each step. With no further structure, that sampling is a random walk — the same prompt twice can take two different journeys.',
        why: 'Naming the raw material this way is what lets the phases be understood as SHAPING it, rather than as red tape laid over an agent that already knows what to do.',
        hood: 'The unstructured baseline a phase narrows. Source: <code>opevc-phases.md</code> · "Phase as a customized Markov chain".'
    },
    'narrowed-space': {
        title: 'a phase = a narrowed action space', tag: 'object',
        what: 'A phase is a flavor of that action space: a hook-enforced space biased toward one KIND of move. OBSERVE removes project-write moves; EXECUTE widens writes for the altered list and tightens elsewhere.',
        why: 'A phase is not a UI mode — it is a customized action-space chain that also learns. The guard is what narrows the space from prose into enforcement.',
        hood: 'Every <code>&lt;phase&gt;-guard.sh</code> is the narrowing primitive. Source: <code>opevc-phases.md</code> · "Phase as a customized Markov chain".'
    },
    'fractal': {
        title: 'fractal, by design', tag: 'context',
        what: 'The structure repeats at two scales: INSIDE a phase the tool calls are a constrained action-space chain; ACROSS the cycle the phases themselves are a Markov chain whose moves are phases, not tool calls.',
        why: 'A Markov brain whose moves are themselves Markov chains. The same compartmentalization principle holds at both scales — that is what makes the design coherent rather than two unrelated layers.',
        hood: 'Edges across the outer chain are the FORWARD_MAP / BACKWARD_MAP. Source: <code>opevc-phases.md</code> · "Phase as a customized Markov chain".'
    },
    'custom-surface': {
        title: 'the phase-set is a customization surface', tag: 'state',
        what: 'A phase is a CATEGORY, not a frozen step. idle can gain responsibilities, new phases can be added, existing ones re-shaped. OPEVC is THIS prototype’s starting answer, not the law.',
        why: 'The phase-SET is mutable; the PRINCIPLE — Markov-brain cognition plus compartmentalization — is the invariant that stays as the set grows. A months-old seed may run a brain richer than OPEVC.',
        hood: 'Each phase is also a learning surface (voices tune it; yaml refines it per job). Source: <code>opevc-phases.md</code> · "OPEVC cycle" + "Phase as a customized Markov chain".'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQUENCE ROW ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'the shape of the work',
        title: 'One cycle, five compartments',
        sub: 'A focused job laps idle → OBSERVE → PLAN → EXECUTE → VERIFY → CONDENSE → idle. Each phase holds ONE kind of work.',
        boxes: [
            { id: 'idle', x: 40, y: 200, w: 130, h: 80, tag: 'context', t: 'idle', s: 'resting state' },
            { id: 'observe', x: 195, y: 200, w: 130, h: 80, tag: 'object', t: 'OBSERVE', s: 'gather' },
            { id: 'plan', x: 350, y: 200, w: 130, h: 80, tag: 'object', t: 'PLAN', s: 'decide' },
            { id: 'execute', x: 505, y: 200, w: 130, h: 80, tag: 'object', t: 'EXECUTE', s: 'build' },
            { id: 'verify', x: 660, y: 200, w: 130, h: 80, tag: 'object', t: 'VERIFY', s: 'check' },
            { id: 'condense', x: 815, y: 200, w: 130, h: 80, tag: 'object', t: 'CONDENSE', s: 'learn' }
        ],
        edges: [
            { from: 'idle', to: 'observe', kind: 'hard', label: '+1 cycle' },
            { from: 'observe', to: 'plan', kind: 'hard' },
            { from: 'plan', to: 'execute', kind: 'hard' },
            { from: 'execute', to: 'verify', kind: 'hard' },
            { from: 'verify', to: 'condense', kind: 'hard' },
            { from: 'condense', to: 'idle', kind: 'hard', label: 'back to idle' }
        ],
        stickies: [
            { x: 360, y: 360, text: 'One KIND of work per phase. Forbidding the other tools IS the pedagogy.', aha: true,
              ref: { url: '../06_2-discipline-and-map.html', section: 'The Discipline and the Map', blurb: 'Why the cycle is five compartments, not one free-for-all.' } },
            { x: 815, y: 330, text: 'CONDENSE runs a 7-step waterfall of its own.',
              ref: { kind: 'deck', url: 'condense-waterfall.html', section: 'The CONDENSE Waterfall', blurb: 'Step through how CONDENSE metabolizes a cycle’s notes into durable memory.' } }
        ],
        navHints: { right: 'the two maps', down: 'idle’s two sub-states' }
    },
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'what hops are legal',
        title: 'Two maps, one hinge',
        sub: 'A static FORWARD_MAP and BACKWARD_MAP define every legal transition. PLAN is the unskippable hub; plan→verify is the one non-adjacent jump.',
        boxes: [
            { id: 'forward-map', x: 40, y: 90, w: 250, h: 110, tag: 'gate', t: 'FORWARD_MAP', s: 'permitted forward hops' },
            { id: 'backward-map', x: 40, y: 270, w: 250, h: 110, tag: 'gate', t: 'BACKWARD_MAP', s: 'free recovery hops' },
            { id: 'plan-hub', x: 380, y: 90, w: 250, h: 110, tag: 'context', t: 'the PLAN-HUB rule', s: 'no observe→build edge' },
            { id: 'pv-jump', x: 380, y: 270, w: 250, h: 110, tag: 'action', t: 'plan→verify', s: 'the one non-adjacent jump' }
        ],
        edges: [
            { from: 'forward-map', to: 'plan-hub', kind: 'hard', label: 'enforces' },
            { from: 'forward-map', to: 'pv-jump', kind: 'soft', label: 'contains' }
        ],
        stickies: [
            { x: 690, y: 200, text: 'Permission is STRUCTURAL — in the list or not. The map never decides WHEN; the seed does, judged at commit.', aha: true },
            { x: 690, y: 330, text: 'The map says WHICH hops are legal; a separate exit gate decides WHEN a phase may advance.',
              ref: { kind: 'deck', url: 'phase-advance.html', section: 'How a Phase Earns its Advance', blurb: 'The three-family exit gate every forward hop must clear before it commits.' } },
            { x: 690, y: 450, text: 'See every legal transition drawn out — forward AND recovery, each arrow explained.',
              ref: { kind: 'deck', url: 'transition-map.html', section: 'The Full Transition Map', blurb: 'Every forward and backward (recovery) hop on one map — hover any arrow for what that transition is for.' } }
        ],
        navHints: { left: 'the cycle', right: 'conductor + musicians', down: 'recovery + the urgent bail' }
    },
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'who enforces what',
        title: 'A conductor and five musicians',
        sub: 'phasic_system tracks where each job is and enforces only the two minimal phases. The five work-phases each guard themselves.',
        boxes: [
            { id: 'phasic-system', x: 40, y: 180, w: 250, h: 120, tag: 'object', t: 'phasic_system', s: 'the conductor' },
            { id: 'current-phase', x: 365, y: 90, w: 240, h: 110, tag: 'state', t: 'current_phase', s: 'where the job is' },
            { id: 'five-guards', x: 365, y: 270, w: 240, h: 110, tag: 'object', t: 'five work-phase guards', s: 'the musicians' },
            { id: 'self-select', x: 690, y: 180, w: 250, h: 120, tag: 'gate', t: 'exactly one live', s: 'each guard self-selects' }
        ],
        edges: [
            { from: 'phasic-system', to: 'current-phase', kind: 'hard', label: 'writes' },
            { from: 'current-phase', to: 'five-guards', kind: 'soft', label: 'each reads' },
            { from: 'five-guards', to: 'self-select', kind: 'hard' }
        ],
        stickies: [
            { x: 690, y: 350, text: 'The conductor DESCRIBES where a job is; the musicians DECIDE what that means.' }
        ],
        navHints: { left: 'the two maps', right: 'the phase guard', down: 'the gmode arc' }
    },
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'the deterministic primitive',
        title: 'The phase guard',
        sub: 'A PreToolUse hook per phase. It self-exempts unless its phase is live, fails safe, and turns each compartment from prose into refusal.',
        boxes: [
            { id: 'phase-guard', x: 40, y: 180, w: 250, h: 120, tag: 'gate', t: 'the phase guard', s: 'allow=0 / block=2' },
            { id: 'self-exempt', x: 365, y: 90, w: 240, h: 110, tag: 'gate', t: 'self-exempt', s: 'not my phase → exit 0' },
            { id: 'fail-safe', x: 365, y: 270, w: 240, h: 110, tag: 'context', t: 'fail-safe-allow', s: 'always reach an exit' },
            { id: 'scope-compartment', x: 690, y: 180, w: 250, h: 120, tag: 'context', t: 'the restriction IS the pedagogy', s: 'tools to skip are blocked' }
        ],
        edges: [
            { from: 'self-exempt', to: 'phase-guard', kind: 'hard' },
            { from: 'fail-safe', to: 'phase-guard', kind: 'soft' },
            { from: 'phase-guard', to: 'scope-compartment', kind: 'hard', label: 'enforces' }
        ],
        stickies: [
            { x: 360, y: 410, text: 'All five fire on every tool call — but only the one matching current_phase does anything.' }
        ],
        navHints: { left: 'conductor + musicians', right: 'the altered list', down: 'per-phase write scope' }
    },
    '4,0': {
        kind: 'seq', step: 5, eyebrow: 'thinking grants writing',
        title: 'The altered list',
        sub: 'Editing a directory’s CLAUDE.md in OBSERVE or PLAN is what authorizes EXECUTE to write there. The bus has teeth.',
        boxes: [
            { id: 'altered-list', x: 40, y: 180, w: 230, h: 120, tag: 'state', t: 'altered_claude_md', s: 'the editable surface' },
            { id: 'md-edit-declares', x: 300, y: 90, w: 250, h: 110, tag: 'action', t: 'edit CLAUDE.md = declare', s: 'built, not configured' },
            { id: 'build-freeze-enforce', x: 300, y: 270, w: 250, h: 110, tag: 'gate', t: 'build → freeze → enforce', s: 'per-cycle reset' },
            { id: 'exact-dir', x: 600, y: 180, w: 250, h: 120, tag: 'gate', t: 'exact-directory match', s: 'no parent walk, no wildcard' }
        ],
        edges: [
            { from: 'md-edit-declares', to: 'altered-list', kind: 'hard', label: 'appends' },
            { from: 'altered-list', to: 'build-freeze-enforce', kind: 'soft' },
            { from: 'build-freeze-enforce', to: 'exact-dir', kind: 'hard' }
        ],
        stickies: [
            { x: 600, y: 350, text: 'Scope is EXACT — declaring a/ does not authorize a/b/. Every cycle re-declares from scratch.' }
        ],
        navHints: { left: 'the phase guard', right: 'anchor write authority', down: 'how the altered list is built and frozen' }
    },
    '4,1': {
        kind: 'detail', eyebrow: 'inside the altered list', title: 'Build, freeze, then enforce',
        sub: 'What you\'re looking at: how OBSERVE and PLAN together BUILD the editable surface, EXECUTE entry FREEZES a snapshot of it, and every write is ENFORCED against that frozen record.',
        boxes: [
            { id: 'al-observe-edit', x: 44, y: 60, w: 220, h: 90, tag: 'action', t: 'OBSERVE edits CLAUDE.md', s: 'appends dir to observe list' },
            { id: 'al-plan-edit',   x: 44, y: 200, w: 220, h: 90, tag: 'action', t: 'PLAN edits CLAUDE.md',   s: 'appends dir to plan list' },
            { id: 'al-merge',       x: 320, y: 130, w: 220, h: 90, tag: 'gate',   t: 'EXECUTE entry: merge + freeze', s: 'one snapshot in altered_claude_md' },
            { id: 'al-reset',       x: 320, y: 280, w: 220, h: 90, tag: 'state',  t: 'per-cycle reset',              s: 'idle→observe clears the list' },
            { id: 'al-enforce',     x: 600, y: 130, w: 240, h: 90, tag: 'gate',   t: 'execute-guard enforces',      s: 'exact-dir match; no wildcard' }
        ],
        edges: [
            { from: 'al-observe-edit', to: 'al-merge', kind: 'hard', label: 'observe list' },
            { from: 'al-plan-edit',    to: 'al-merge', kind: 'hard', label: 'plan list' },
            { from: 'al-merge',        to: 'al-enforce', kind: 'hard', label: 'frozen snapshot' },
            { from: 'al-reset',        to: 'al-merge',   kind: 'soft', label: 'next cycle wipes slate' }
        ],
        stickies: [
            { x: 590, y: 260, aha: true, text: 'The list is BUILT by editing, not configured. Thinking about a directory — on the page — is what grants the right to change it.' }
        ],
        navHints: { up: 'the altered list' }
    },
    '5,0': {
        kind: 'seq', step: 6, eyebrow: 'where in the file you may write',
        title: 'Section-anchor write authority',
        sub: 'Four anchors split every CLAUDE.md into a durable body and four footers. A phase may write at or below its own anchor — never above.',
        boxes: [
            { id: 'four-anchors', x: 40, y: 180, w: 230, h: 120, tag: 'object', t: 'the four anchors', s: 'body + four footers' },
            { id: 'cascading-down', x: 300, y: 90, w: 250, h: 110, tag: 'context', t: 'cascading-downward', s: 'authority shrinks per phase' },
            { id: 'forward-write', x: 300, y: 270, w: 250, h: 110, tag: 'gate', t: 'forward-write-only', s: 'no reaching back up' },
            { id: 'condense-body', x: 600, y: 180, w: 250, h: 120, tag: 'state', t: 'the body is CONDENSE-only', s: 'where learning lands' }
        ],
        edges: [
            { from: 'four-anchors', to: 'cascading-down', kind: 'hard' },
            { from: 'cascading-down', to: 'forward-write', kind: 'soft' },
            { from: 'forward-write', to: 'condense-body', kind: 'hard' }
        ],
        stickies: [
            { x: 600, y: 350, text: 'OBSERVE can pre-stage VERIFY’s checklist. The write rule IS the cross-phase hand-off engine.', aha: true }
        ],
        navHints: { left: 'the altered list', right: 'a fractal Markov brain', down: 'WHERE and WHO writes a CLAUDE.md footer' }
    },
    '5,1': {
        kind: 'detail', eyebrow: 'inside section-anchor authority', title: 'Write below your anchor, never above',
        sub: 'What you\'re looking at: WHERE in a CLAUDE.md each phase may write (cascading-downward) and WHO may touch the CLAUDE.md layer at all (main session only, in OPEVC phases).',
        boxes: [
            { id: 'sa-where',  x: 44,  y: 80,  w: 250, h: 100, tag: 'gate',    t: 'WHERE: at or below own footer', s: 'cascading-downward' },
            { id: 'sa-ob',     x: 44,  y: 240, w: 250, h: 100, tag: 'state',   t: 'e.g. OBSERVE writes all four', s: 'VERIFY writes ---Ve--- only' },
            { id: 'sa-body',   x: 360, y: 80,  w: 250, h: 100, tag: 'context', t: 'body above ---Ob---',           s: 'CONDENSE-only; work phases blocked' },
            { id: 'sa-who',    x: 360, y: 240, w: 250, h: 100, tag: 'gate',    t: 'WHO: main session only',        s: 'subagents blocked (O/P/E/V phases)' }
        ],
        edges: [
            { from: 'sa-where', to: 'sa-ob',   kind: 'hard', label: 'e.g.' },
            { from: 'sa-where', to: 'sa-body',  kind: 'soft', label: 'and' },
            { from: 'sa-who',   to: 'sa-ob',    kind: 'soft', label: 'by' }
        ],
        stickies: [
            { x: 670, y: 160, aha: true, text: 'Notes flow <b>downward and forward</b>, never reaching back up — the forward-write asymmetry. OBSERVE can pre-stage VERIFY\'s checklist; VERIFY cannot rewrite OBSERVE\'s notes.' }
        ],
        navHints: { up: 'section-anchor write authority' }
    },
    '6,0': {
        kind: 'seq', step: 7, eyebrow: 'why it is shaped this way',
        title: 'A fractal Markov brain',
        sub: 'A phase is a narrowed action space. Inside a phase, tool calls are a chain; across the cycle, the phases are a chain. Fractal, by design.',
        boxes: [
            { id: 'action-space', x: 40, y: 180, w: 230, h: 120, tag: 'context', t: 'the action space', s: 'raw random walk' },
            { id: 'narrowed-space', x: 300, y: 90, w: 250, h: 110, tag: 'object', t: 'phase = narrowed space', s: 'biased to one KIND' },
            { id: 'fractal', x: 300, y: 270, w: 250, h: 110, tag: 'context', t: 'fractal', s: 'chains within a chain' },
            { id: 'custom-surface', x: 600, y: 180, w: 250, h: 120, tag: 'state', t: 'a customization surface', s: 'OPEVC is one answer' }
        ],
        edges: [
            { from: 'action-space', to: 'narrowed-space', kind: 'hard', label: 'a guard narrows' },
            { from: 'narrowed-space', to: 'fractal', kind: 'soft' },
            { from: 'fractal', to: 'custom-surface', kind: 'soft' }
        ],
        stickies: [
            { x: 600, y: 350, text: 'The phase-SET is mutable; the PRINCIPLE — Markov cognition + compartmentalization — is the invariant.', aha: true,
              ref: { url: '../06_1-phasic-foundation.html', section: 'Phasic Foundation', blurb: 'The Markov-brain framing the whole series builds on.' } }
        ],
        navHints: { left: 'anchor write authority' }
    },

    /* ============================ DETAIL CARDS ============================ */
    '0,1': {
        kind: 'detail', eyebrow: 'inside idle', title: 'Two sub-states, one pivot',
        sub: 'idle is keyed on whether a job is focused. Each sub-state is a distinct cognitive moment — and gmode is its non-OPEVC sibling.',
        boxes: [
            { id: 'idle-focused', x: 40, y: 90, w: 270, h: 110, tag: 'state', t: 'idle WITH focus', s: 'continue or switch' },
            { id: 'idle-unfocused', x: 40, y: 270, w: 270, h: 110, tag: 'state', t: 'idle WITHOUT focus', s: 'next-job-selection' },
            { id: 'gmode-rest', x: 380, y: 90, w: 250, h: 110, tag: 'context', t: 'gmode', s: 'the sibling state' },
            { id: 'cycle-counter', x: 380, y: 270, w: 250, h: 110, tag: 'state', t: 'the cycle counter', s: '+1 at idle→observe' }
        ],
        edges: [
            { from: 'idle-focused', to: 'idle-unfocused', kind: 'soft', label: 'pause / complete' }
        ],
        stickies: [
            { x: 690, y: 200, text: 'No phase work is possible until a job is focused — idle→observe requires one.' }
        ],
        navHints: { up: 'the cycle' }
    },
    '1,1': {
        kind: 'detail', eyebrow: 'recovery topology', title: 'Backing up, and the one escape',
        sub: 'Backward hops are free recovery. There is no direct →idle from P/E/V; the urgent bail routes through OBSERVE, and CONDENSE never backs up.',
        boxes: [
            { id: 'urgent-bail', x: 40, y: 90, w: 250, h: 110, tag: 'action', t: 'the very-urgent bail', s: 'mid-cycle yield' },
            { id: 'bail-through-observe', x: 40, y: 270, w: 250, h: 110, tag: 'gate', t: 'routed through OBSERVE', s: 'no direct →idle' },
            { id: 'condense-oneway', x: 380, y: 90, w: 250, h: 110, tag: 'gate', t: 'CONDENSE is one-way', s: '--add-cycle, not back' },
            { id: 'pv-backward-loop', x: 380, y: 270, w: 250, h: 110, tag: 'action', t: 'the plan-verify loop', s: 'VERIFY edits → back to PLAN' }
        ],
        edges: [
            { from: 'urgent-bail', to: 'bail-through-observe', kind: 'hard' }
        ],
        stickies: [
            { x: 690, y: 200, text: 'A job’s only NORMAL exit is forward through CONDENSE. The bail is the single deliberate exception.' }
        ],
        navHints: { up: 'the two maps' }
    },
    '2,1': {
        kind: 'detail', eyebrow: 'the maintenance lane', title: 'The gmode arc',
        sub: 'Entry is gated and hook-only; exit is agent-timed but checked. The home phase is stashed, and the exit demands a root-cause note.',
        boxes: [
            { id: 'enter-gmode', x: 40, y: 90, w: 250, h: 110, tag: 'action', t: 'enter-gmode', s: 'hook-only, requested' },
            { id: 'pre-gmode-phase', x: 40, y: 270, w: 250, h: 110, tag: 'state', t: 'pre_gmode_phase', s: 'one slot, not a stack' },
            { id: 'exit-gmode', x: 380, y: 90, w: 250, h: 110, tag: 'action', t: 'exit-gmode', s: 'agent-callable, gate-checked' },
            { id: 'root-cause-gate', x: 380, y: 270, w: 250, h: 110, tag: 'gate', t: 'root-cause exit gate', s: 'a NEW pending-job note' }
        ],
        edges: [
            { from: 'enter-gmode', to: 'pre-gmode-phase', kind: 'hard', label: 'stashes' },
            { from: 'exit-gmode', to: 'pre-gmode-phase', kind: 'soft', label: 'restores' },
            { from: 'exit-gmode', to: 'root-cause-gate', kind: 'hard', label: 'must pass' }
        ],
        stickies: [
            { x: 690, y: 200, text: 'Entry gated, exit agent-timed but checked: the seed owns the WHEN; the gates own the WHETHER.', aha: true }
        ],
        navHints: { up: 'conductor + musicians' }
    },
    '3,1': {
        kind: 'detail', eyebrow: 'what each phase may touch', title: 'Per-phase write scope',
        sub: 'The compartments are deliberately asymmetric — each phase gets only the tools its KIND of move needs. gmode suspension falls out of the same pattern.',
        boxes: [
            { id: 'observe-scope', x: 40, y: 90, w: 270, h: 100, tag: 'context', t: 'OBSERVE', s: 'read + free web' },
            { id: 'plan-scope', x: 355, y: 90, w: 270, h: 100, tag: 'context', t: 'PLAN', s: 'read, no web' },
            { id: 'execute-scope', x: 670, y: 90, w: 270, h: 100, tag: 'context', t: 'EXECUTE', s: 'write (altered list)' },
            { id: 'verify-scope', x: 40, y: 250, w: 270, h: 100, tag: 'context', t: 'VERIFY', s: 'read + tests + plan file' },
            { id: 'condense-scope', x: 355, y: 250, w: 270, h: 100, tag: 'context', t: 'CONDENSE', s: 'any .md, the body' },
            { id: 'gmode-suspend', x: 670, y: 250, w: 270, h: 100, tag: 'gate', t: 'gmode suspension', s: 'all five exit 0' }
        ],
        edges: [],
        stickies: [
            { x: 360, y: 380, text: 'No current_phase==gmode branch exists anywhere — suspension is emergent from self-exempt.' }
        ],
        navHints: { up: 'the phase guard' }
    }
};
