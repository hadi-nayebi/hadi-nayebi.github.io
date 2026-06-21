/* ============================================================================
 * transition-map.cards.js — CONTENT for the "Every legal move, and why" deck.
 * Teaches: the COMPLETE OPEVC transition map — every FORWARD hop AND every
 * BACKWARD (recovery) hop in the seed agent's Markov phasic brain, plus the
 * gmode enter/exit lane. The core interaction is hover-explained arrows: every
 * edge carries a short `label` (what the move is) and a one-sentence `meaning`
 * (why it exists). Recovery/backward edges render soft (dashed) via kind:'soft';
 * forward edges render hard (solid) via kind:'hard'. Paired with the shared
 * deck-engine.js + .css (same dir). Loaded BEFORE the engine.
 *
 * Companion to phasic-cycle.html (which shows only the forward spine). This deck
 * is the answer to the reviewer ask: show the WHOLE Markov transition graph.
 *
 * Ground truth: the [consolidated] cluster .claude/context/opevc-phases.md —
 *   FORWARD_MAP="idle:observe observe:plan plan:execute plan:verify execute:verify
 *     verify:condense condense:idle";
 *   BACKWARD_MAP="plan:observe execute:plan execute:observe verify:execute
 *     verify:plan verify:observe observe:idle";
 *   enter-gmode / exit-gmode arms in phasic_system/scripts/phase.sh.
 * Source pointers use STABLE anchors (file · arm/section/field), never line
 * numbers (Rule 20).
 * ============================================================================ */
window.DECK_META = { page: 'transition-map', seqLabel: 'every legal move, and why' };

window.DECK_INFO = {
    /* ---- the seven phase boxes (shared across cards) ---- */
    'idle': {
        title: 'idle', tag: 'context',
        what: 'The resting state between cycles. No phase work, all tools available, no phase-specific gate active. It is where the seed switches which job is focused and opens or closes a lap. The cycle counter ticks plus-one only when a focused job leaves idle for OBSERVE.',
        why: 'A minimal, deliberately-sparse compartment so job-work never leaks into the place where focus shifts. idle is the only state both ends of the ring touch — the cycle starts and ends here.',
        hood: 'A non-OPEVC state the conductor owns directly: <code>phasic_system/hooks/phase-gate.sh</code> ("IDLE ENFORCEMENT ONLY") admits only the job-management subset. Two outbound edges only: <code>idle:observe</code> (forward) is the lone way INTO a cycle. Source: <code>opevc-phases.md</code> · "FORWARD_MAP".'
    },
    'observe': {
        title: 'OBSERVE (O)', tag: 'object',
        what: 'The gathering phase: read code, query knowledge, web-fetch, dispatch observe subagents, interview the user. It has the richest transition fan-in of any work phase — every other work phase can recover back to it.',
        why: 'OBSERVE is where new context legitimately enters the cycle, so it is the natural recovery target: any phase that discovers a context gap routes back here. It also holds the single mid-cycle bail edge to idle.',
        hood: 'Forward out: <code>observe:plan</code>. Backward in: <code>plan:observe</code> / <code>execute:observe</code> / <code>verify:observe</code>. Backward out: <code>observe:idle</code> (the urgent bail). Self-enforced by <code>phase_observe/hooks/observe-guard.sh</code>. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'plan': {
        title: 'PLAN (P)', tag: 'object',
        what: 'Transform observations into an approach. It is the unskippable hub — OBSERVE can reach the building phases ONLY through PLAN. It also owns the one non-adjacent forward jump, straight to VERIFY.',
        why: 'Making plan cognition mandatory between gathering and building is the one structural invariant the map enforces: the seed must always settle on an approach before it builds or tests.',
        hood: 'Forward out: <code>plan:execute</code> (default) and <code>plan:verify</code> (re-test). Backward out: <code>plan:observe</code>. Backward in: <code>execute:plan</code> / <code>verify:plan</code>. Source: <code>opevc-phases.md</code> · "FORWARD_MAP" (PLAN-HUB rule).'
    },
    'execute': {
        title: 'EXECUTE (E)', tag: 'object',
        what: 'Implement the plan. The only phase with full project-file writes, bounded to the altered list. It has two recovery exits — back to PLAN to re-decide, or back to OBSERVE to gather a missing piece of context.',
        why: 'Building is where a wrong plan or a context gap most often surfaces. Two backward edges let EXECUTE return to whichever earlier phase owns the fix, rather than barrelling forward.',
        hood: 'Forward out: <code>execute:verify</code>. Forward in: <code>plan:execute</code>. Backward out: <code>execute:plan</code> / <code>execute:observe</code>. Gated by <code>phase_execute/hooks/execute-guard.sh</code>. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'verify': {
        title: 'VERIFY (V)', tag: 'object',
        what: 'Check the executed work against the plan acceptance criteria. It reports and ROUTES rather than patching its own work — and it has the richest backward fan-out of any phase: three recovery destinations.',
        why: 'A phase that judges the work must not quietly fix what it finds wrong. VERIFY routes the failure to the phase that owns it — EXECUTE for a build issue, PLAN for a wrong approach, OBSERVE for missing context.',
        hood: 'Forward out: <code>verify:condense</code>. Forward in: <code>execute:verify</code> and <code>plan:verify</code>. Backward out: <code>verify:execute</code> / <code>verify:plan</code> / <code>verify:observe</code> (three destinations). Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'condense': {
        title: 'CONDENSE (C)', tag: 'object',
        what: 'Distill working memory back into durable form. It is the one phase with NO backward edge — its only exit is forward to idle, closing the lap. Outstanding work opens a NEW cycle instead of backing up.',
        why: 'Learning is not something you undo. Forcing CONDENSE forward keeps the consolidation it just did intact; leftover work routes into an explicit extension cycle, never a backward hop.',
        hood: 'Forward out: <code>condense:idle</code> (the only outbound edge). Forward in: <code>verify:condense</code>. No backward edge exists. Extension via <code>condense-commit.sh --force --add-cycle</code>. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP" (CONDENSE is one-way).'
    },
    'gmode': {
        title: 'gmode (the off-cycle lane)', tag: 'context',
        what: 'The maintenance lane where the OPEVC phases go inactive — a sibling of idle, not a phase in the cycle. Any phase can enter it; it returns to the EXACT phase it interrupted. Entered with a substantial justification when a phase needs to touch the substrate its own gates run on.',
        why: 'Some fixes touch the substrate the phases run on; doing that inside a phase would fight the phase own gates. gmode is the deliberate, user-gated lane for it — and it remembers where it came from so the interrupted cycle resumes intact.',
        hood: 'Entered via the <code>enter-gmode</code> arm in <code>phase.sh</code> (stashes <code>pre_gmode_phase</code>); left via <code>exit-gmode</code> (restores it, gated by the root-cause note). Every always-on plugin keeps enforcing while only the OPEVC controls rest. Source: <code>opevc-phases.md</code> · "Phase" (gmode).'
    },

    /* ---- forward-transition concept boxes (card 1,0) ---- */
    'three-family-gate': {
        title: 'the three-family exit gate', tag: 'gate',
        what: 'The advance condition every forward hop must clear before it commits: reflection commands ran, new marked notes were added, and at least one of the phase reflector subagents ran. Forward movement is EARNED, not free.',
        why: 'A forward hop means "this phase finished its kind of work well enough to hand off." The gate is what makes that claim checkable instead of a self-assessment the model can wave through under pressure.',
        hood: 'Armed unconditionally across all five phases; families (a)/(c) are hard, (b) is soft. Checked at every <code>&lt;phase&gt;-commit.sh --force</code>. Source: <code>opevc-phases.md</code> · "Three-family exit gate".'
    },

    /* ---- recovery-transition concept boxes (card 2,0) ---- */
    'free-recovery': {
        title: 'recovery is FREE', tag: 'context',
        what: 'Every backward hop is a free recovery transition: no shape gate, no metacog gate, no custom gate — only clean git, the one requirement every hop shares. Cheap to back up, expensive to barrel forward.',
        why: 'If backing out of a bad plan cost as much as advancing, the seed would push forward through mistakes to avoid the toll. Making recovery free is what makes honest backtracking the path of least resistance.',
        hood: 'Backward hops are driven by the hook-only <code>phase.sh back</code>, read against <code>BACKWARD_MAP</code>. No exit gate fires on a backward commit; clean working tree is still required. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },

    /* ---- gmode + specials concept boxes (card 3,0) ---- */
    'pv-jump': {
        title: 'plan→verify (the one non-adjacent jump)', tag: 'action',
        what: 'The single forward hop that skips a phase: PLAN advances straight to VERIFY when a plan needs re-testing without re-execution. Most common after VERIFY bounced a plan-file edit back to PLAN.',
        why: 'Post-creation plan-file edits belong to VERIFY, so a refinement lap routes its change-requests through the CLAUDE.md layer and forwards directly to VERIFY — no wasted EXECUTE pass.',
        hood: 'The <code>plan:verify</code> entry sits AFTER <code>plan:execute</code> (so the default advance stays plan→execute); <code>plan-commit.sh --force --to verify</code> requires a <code>## Why No Execute</code> section. Source: <code>opevc-phases.md</code> · "plan→verify forward transition".'
    },
    'urgent-bail': {
        title: 'OBSERVE→idle (the urgent bail)', tag: 'action',
        what: 'The single mid-cycle escape to idle. A focused phase backs one hop to OBSERVE, and OBSERVE then bails to idle — so a job can yield focus urgently. The cycle counter is NOT spent on the abandoned lap.',
        why: 'A job normal exit is forward through CONDENSE; the cycle is closed, never abandoned mid-stream. The bail is the one deliberate exception, routed through OBSERVE so a returning job cannot resume on stale context.',
        hood: 'The lone <code>observe:idle</code> entry in <code>BACKWARD_MAP</code>; <code>suppress_next_cycle_increment</code> preserves the counter. There is no direct <code>plan:idle</code> / <code>execute:idle</code> / <code>verify:idle</code> edge. Source: <code>opevc-phases.md</code> · "BACKWARD_MAP".'
    },
    'root-cause-gate': {
        title: 'the root-cause exit gate', tag: 'gate',
        what: 'Before exit-gmode is allowed, the seed must have emitted a NEW pending-job marked note this gmode — a commitment to investigate the root cause independently of the patch it just applied.',
        why: 'Anything that forced a gmode deserves an investigation wider than the visible fix. One live test entered gmode four times on faces of ONE root class because each fix only addressed the symptom in front of it.',
        hood: 'A count-diff vs the <code>gmode_pending_job_snapshot</code> taken at entry (exit needs count &gt; snapshot). Source: <code>opevc-phases.md</code> · "Gmode root-cause exit gate".'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQUENCE ROW ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'the complete Markov map',
        title: 'Every legal move',
        sub: 'A focused job laps idle → OBSERVE → PLAN → EXECUTE → VERIFY → CONDENSE → idle. But the cycle also backs up — every recovery hop is here too. Hover any arrow to see what that transition is for.',
        boxes: [
            { id: 'idle',     x: 40,  y: 240, w: 120, h: 76, tag: 'context', t: 'idle',     s: 'rest' },
            { id: 'observe',  x: 195, y: 240, w: 120, h: 76, tag: 'object',  t: 'OBSERVE',  s: 'gather' },
            { id: 'plan',     x: 350, y: 240, w: 120, h: 76, tag: 'object',  t: 'PLAN',     s: 'decide' },
            { id: 'execute',  x: 505, y: 240, w: 120, h: 76, tag: 'object',  t: 'EXECUTE',  s: 'build' },
            { id: 'verify',   x: 660, y: 240, w: 120, h: 76, tag: 'object',  t: 'VERIFY',   s: 'check' },
            { id: 'condense', x: 815, y: 240, w: 130, h: 76, tag: 'object',  t: 'CONDENSE', s: 'learn' }
        ],
        edges: [
            /* forward spine (hard) */
            { from: 'idle',     to: 'observe',  kind: 'hard', label: '+1 cycle',          meaning: 'A focused job starts work; the cycle counter ticks +1 at this idle->observe entry.' },
            { from: 'observe',  to: 'plan',     kind: 'hard', label: 'observed enough',   meaning: 'Observation is sufficient; move from gathering to designing the approach. Gated by the three-family exit gate.' },
            { from: 'plan',     to: 'execute',  kind: 'hard', label: 'plan set',          meaning: 'The plan is committed; build it. This is the default forward advance.' },
            { from: 'execute',  to: 'verify',   kind: 'hard', label: 'built',             meaning: 'The work is built; hand it to independent checking.' },
            { from: 'verify',   to: 'condense', kind: 'hard', label: 'criteria pass',     meaning: 'Acceptance criteria pass; consolidate the cycle into durable memory.' },
            { from: 'condense', to: 'idle',     kind: 'hard', label: 'lessons banked',    meaning: 'The learning is banked and working memory deflated; return to rest. CONDENSE is forward-only and never steps back.' },
            /* the non-adjacent forward jump (hard) */
            { from: 'plan',     to: 'verify',   kind: 'hard', label: 're-test, no rebuild', meaning: 'The one non-adjacent jump: re-test an existing plan without re-executing. Requires the "Why No Execute" shape section.' },
            /* recovery hops (soft) */
            { from: 'plan',     to: 'observe',  kind: 'soft', label: 'need more context',  meaning: 'Recovery: the plan needs more context. A free recovery transition — no shape or metacog gate, only clean git.' },
            { from: 'execute',  to: 'plan',     kind: 'soft', label: 'rethink the plan',   meaning: 'Recovery: building revealed the plan was wrong; re-decide the approach.' },
            { from: 'execute',  to: 'observe',  kind: 'soft', label: 'context gap',        meaning: 'Recovery: execution exposed a missing piece of context; gather more before re-planning.' },
            { from: 'verify',   to: 'execute',  kind: 'soft', label: 'fixable build issue', meaning: 'Recovery: a criterion failed on a fixable implementation issue; go fix the build.' },
            { from: 'verify',   to: 'plan',     kind: 'soft', label: 'wrong approach',     meaning: 'Recovery: verification shows the approach itself was wrong; re-plan. Also the plan-verify backward loop after a cycle-1 plan-file edit.' },
            { from: 'verify',   to: 'observe',  kind: 'soft', label: 'missing context',    meaning: 'Recovery: verification reveals missing context. VERIFY has the richest backward fan-out — three destinations.' },
            { from: 'observe',  to: 'idle',     kind: 'soft', label: 'urgent bail',        meaning: 'The urgent bail: abandon back to idle WITHOUT losing the cycle counter (suppress_next_cycle_increment).' }
        ],
        stickies: [
            { x: 360, y: 70, text: 'Hover ANY arrow to see what that transition is for. Solid = forward (gated). Dashed = recovery (free).', aha: true,
              ref: { url: '../06_1-phasic-foundation.html', section: 'Phasic Foundation', blurb: 'The Markov-brain framing the whole map is built on.' } },
            { x: 360, y: 430, text: 'The same two phases can connect both ways: forward (advance) and backward (recover). The map names every legal move.' }
        ],
        navHints: { right: 'forward only' }
    },
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'the gated spine',
        title: 'Forward only',
        sub: 'The seven forward transitions, isolated. Each is gated by the three-family exit gate — a phase must finish its kind of work well before it may hand off. Hover each arrow.',
        boxes: [
            { id: 'idle',     x: 40,  y: 250, w: 120, h: 76, tag: 'context', t: 'idle',     s: 'rest' },
            { id: 'observe',  x: 195, y: 250, w: 120, h: 76, tag: 'object',  t: 'OBSERVE',  s: 'gather' },
            { id: 'plan',     x: 350, y: 250, w: 120, h: 76, tag: 'object',  t: 'PLAN',     s: 'decide' },
            { id: 'execute',  x: 505, y: 250, w: 120, h: 76, tag: 'object',  t: 'EXECUTE',  s: 'build' },
            { id: 'verify',   x: 660, y: 250, w: 120, h: 76, tag: 'object',  t: 'VERIFY',   s: 'check' },
            { id: 'condense', x: 815, y: 250, w: 130, h: 76, tag: 'object',  t: 'CONDENSE', s: 'learn' },
            { id: 'three-family-gate', x: 350, y: 410, w: 280, h: 90, tag: 'gate', t: 'the three-family exit gate', s: 'every forward hop must pass' }
        ],
        edges: [
            { from: 'idle',     to: 'observe',  kind: 'hard', label: '+1 cycle',            meaning: 'A focused job starts work; the cycle counter ticks +1 at this idle->observe entry.' },
            { from: 'observe',  to: 'plan',     kind: 'hard', label: 'observed enough',     meaning: 'Observation is sufficient; move from gathering to designing the approach. Gated by the three-family exit gate.' },
            { from: 'plan',     to: 'execute',  kind: 'hard', label: 'plan set',            meaning: 'The plan is committed; build it. This is the default forward advance.' },
            { from: 'plan',     to: 'verify',   kind: 'hard', label: 're-test, no rebuild', meaning: 'The one non-adjacent jump: re-test an existing plan without re-executing. Requires the "Why No Execute" shape section.' },
            { from: 'execute',  to: 'verify',   kind: 'hard', label: 'built',               meaning: 'The work is built; hand it to independent checking.' },
            { from: 'verify',   to: 'condense', kind: 'hard', label: 'criteria pass',       meaning: 'Acceptance criteria pass; consolidate the cycle into durable memory.' },
            { from: 'condense', to: 'idle',     kind: 'hard', label: 'lessons banked',      meaning: 'The learning is banked and working memory deflated; return to rest. CONDENSE is forward-only and never steps back.' }
        ],
        stickies: [
            { x: 690, y: 410, text: 'PLAN is the hub: there is no observe→execute and no observe→verify edge. Building is reached only THROUGH plan.', aha: true }
        ],
        navHints: { left: 'every legal move', right: 'recovery only', down: 'the three families up close' }
    },
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'the recovery topology',
        title: 'Recovery only',
        sub: 'The seven backward hops, isolated. Each is a FREE recovery transition — no cognitive gate, clean git only. Cheap backtracking is what stops the seed barrelling forward through a bad plan. Hover each arrow.',
        boxes: [
            { id: 'idle',     x: 40,  y: 250, w: 120, h: 76, tag: 'context', t: 'idle',     s: 'rest' },
            { id: 'observe',  x: 195, y: 250, w: 120, h: 76, tag: 'object',  t: 'OBSERVE',  s: 'gather' },
            { id: 'plan',     x: 350, y: 250, w: 120, h: 76, tag: 'object',  t: 'PLAN',     s: 'decide' },
            { id: 'execute',  x: 505, y: 250, w: 120, h: 76, tag: 'object',  t: 'EXECUTE',  s: 'build' },
            { id: 'verify',   x: 660, y: 250, w: 120, h: 76, tag: 'object',  t: 'VERIFY',   s: 'check' },
            { id: 'free-recovery', x: 350, y: 410, w: 280, h: 90, tag: 'context', t: 'recovery is FREE', s: 'no cognitive gate, clean git only' }
        ],
        edges: [
            { from: 'plan',     to: 'observe',  kind: 'soft', label: 'need more context',   meaning: 'Recovery: the plan needs more context. A free recovery transition — no shape or metacog gate, only clean git.' },
            { from: 'execute',  to: 'plan',     kind: 'soft', label: 'rethink the plan',    meaning: 'Recovery: building revealed the plan was wrong; re-decide the approach.' },
            { from: 'execute',  to: 'observe',  kind: 'soft', label: 'context gap',         meaning: 'Recovery: execution exposed a missing piece of context; gather more before re-planning.' },
            { from: 'verify',   to: 'execute',  kind: 'soft', label: 'fixable build issue', meaning: 'Recovery: a criterion failed on a fixable implementation issue; go fix the build.' },
            { from: 'verify',   to: 'plan',     kind: 'soft', label: 'wrong approach',      meaning: 'Recovery: verification shows the approach itself was wrong; re-plan. Also the plan-verify backward loop after a cycle-1 plan-file edit.' },
            { from: 'verify',   to: 'observe',  kind: 'soft', label: 'missing context',     meaning: 'Recovery: verification reveals missing context. VERIFY has the richest backward fan-out — three destinations.' },
            { from: 'observe',  to: 'idle',     kind: 'soft', label: 'urgent bail',         meaning: 'The urgent bail: abandon back to idle WITHOUT losing the cycle counter (suppress_next_cycle_increment).' }
        ],
        stickies: [
            { x: 690, y: 410, text: 'VERIFY has the richest fan-out — three backward destinations. CONDENSE has none: it never steps back.', aha: true }
        ],
        navHints: { left: 'forward only', right: 'gmode + the specials', down: 'free, but never dirty' }
    },
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'the off-cycle lane + the two specials',
        title: 'gmode, and the moves that break the ring',
        sub: 'gmode is enterable from ANY phase and returns to the EXACT phase it interrupted. Two forward/backward moves also break the plain ring: the plan→verify jump and the OBSERVE→idle bail. Hover each arrow.',
        boxes: [
            { id: 'observe',  x: 60,  y: 90,  w: 120, h: 72, tag: 'object',  t: 'OBSERVE',  s: 'gather' },
            { id: 'plan',     x: 60,  y: 200, w: 120, h: 72, tag: 'object',  t: 'PLAN',     s: 'decide' },
            { id: 'execute',  x: 60,  y: 310, w: 120, h: 72, tag: 'object',  t: 'EXECUTE',  s: 'build' },
            { id: 'gmode',    x: 360, y: 200, w: 220, h: 100, tag: 'context', t: 'gmode', s: 'the off-cycle lane' },
            { id: 'pv-jump',     x: 690, y: 90,  w: 250, h: 100, tag: 'action', t: 'plan→verify', s: 'the one non-adjacent jump' },
            { id: 'urgent-bail', x: 690, y: 230, w: 250, h: 100, tag: 'action', t: 'OBSERVE→idle', s: 'the urgent bail' },
            { id: 'root-cause-gate', x: 360, y: 360, w: 220, h: 96, tag: 'gate', t: 'root-cause exit gate', s: 'a NEW pending-job note' }
        ],
        edges: [
            { from: 'observe', to: 'gmode', kind: 'hard', label: 'enter gmode', meaning: 'The off-cycle maintenance lane: bypass the phase guards for substrate work, gated by a >=100-word [GMODE] justification. Remembers the phase it interrupted.' },
            { from: 'plan',    to: 'gmode', kind: 'hard', label: 'enter gmode', meaning: 'The off-cycle maintenance lane: bypass the phase guards for substrate work, gated by a >=100-word [GMODE] justification. Remembers the phase it interrupted.' },
            { from: 'execute', to: 'gmode', kind: 'hard', label: 'enter gmode', meaning: 'The off-cycle maintenance lane: bypass the phase guards for substrate work, gated by a >=100-word [GMODE] justification. Remembers the phase it interrupted.' },
            { from: 'gmode', to: 'plan',    kind: 'soft', label: 'exit gmode', meaning: 'Return to the exact phase gmode interrupted. The root-cause exit gate requires a new [PENDING-JOB] root-cause note before leaving.' },
            { from: 'gmode', to: 'root-cause-gate', kind: 'hard', label: 'must pass', meaning: 'exit-gmode is blocked until a NEW pending-job root-cause note has been added this gmode.' }
        ],
        stickies: [
            { x: 360, y: 470, text: '"any phase → gmode → that same phase" is shown here with PLAN as the example; the same enter/exit holds for every phase.' }
        ],
        navHints: { left: 'recovery only', down: 'the gmode arc in detail' }
    },

    /* ============================ DETAIL ROW ============================ */
    '1,1': {
        kind: 'detail',
        eyebrow: 'Transition map \xb7 forward detail',
        title: 'What a forward hop must earn',
        sub: 'What you\'re looking at: the three families every forward hop clears before <phase>-commit.sh --force may advance. Fresh boxes, geared toward every hop rather than any single phase.',
        boxes: [
            { id: 'fg-a',     x: 64,  y: 118, w: 380, h: 88, tag: 'gate',   t: 'family-a', s: 'CORE ops + a drawn min of nuanced lenses [hard]' },
            { id: 'fg-b',     x: 64,  y: 230, w: 380, h: 88, tag: 'gate',   t: 'family-b', s: 'new marked notes added [soft]' },
            { id: 'fg-c',     x: 64,  y: 342, w: 380, h: 88, tag: 'gate',   t: 'family-c', s: '≥1 reflector subagent ran [hard]' },
            { id: 'fg-shape', x: 516, y: 118, w: 380, h: 88, tag: 'gate',   t: '+ commit shape', s: 'named ## sections + empty ## Outstanding Items' },
            { id: 'fg-adv',   x: 516, y: 270, w: 380, h: 100, tag: 'action', t: 'advance commits', s: '<phase>-commit.sh --force' }
        ],
        edges: [
            { from: 'fg-a',     to: 'fg-adv', kind: 'hard', label: 'must pass' },
            { from: 'fg-b',     to: 'fg-adv', kind: 'hard', label: 'must pass' },
            { from: 'fg-c',     to: 'fg-adv', kind: 'hard', label: 'must pass' },
            { from: 'fg-shape', to: 'fg-adv', kind: 'hard', label: 'and' }
        ],
        stickies: [
            { x: 300, y: 30, aha: true, text: '<b>Forward movement is EARNED — recovery is free.</b> Cheap backtracking beats barrelling forward through a mistake.' }
        ],
        navHints: { up: 'back to the map' }
    },
    '2,1': {
        kind: 'detail',
        eyebrow: 'Transition map \xb7 recovery detail',
        title: 'Free, but never dirty',
        sub: 'What you\'re looking at: what every recovery hop skips, what every hop still shares, and the one exception that has no backward edge at all.',
        boxes: [
            { id: 'rc-free',  x: 64,  y: 118, w: 360, h: 100, tag: 'context', t: 'no cognitive gate', s: 'no shape, no metacog, no custom gate' },
            { id: 'rc-git',   x: 64,  y: 254, w: 360, h: 100, tag: 'gate',    t: 'clean git required', s: 'forward AND backward' },
            { id: 'rc-back',  x: 516, y: 118, w: 360, h: 100, tag: 'action',  t: 'phase.sh back', s: 'hook-only, reads BACKWARD_MAP' },
            { id: 'rc-cond',  x: 516, y: 254, w: 360, h: 100, tag: 'object',  t: 'CONDENSE: no backward', s: 'rollback would make it a mere editing pass' }
        ],
        edges: [
            { from: 'rc-free', to: 'rc-back', kind: 'hard', label: 'drives' },
            { from: 'rc-git',  to: 'rc-back', kind: 'hard', label: 'gates' },
            { from: 'rc-back', to: 'rc-cond', kind: 'soft', label: 'except' }
        ],
        stickies: [
            { x: 300, y: 30, aha: true, text: '<b>Backward hops skip every cognitive gate — but clean git gates EVERY transition, forward or back.</b>' }
        ],
        navHints: { up: 'back to recovery' }
    },
    '3,1': {
        kind: 'detail',
        eyebrow: 'Transition map \xb7 gmode detail',
        title: 'The gmode arc — stash, fix, restore',
        sub: 'What you\'re looking at: how gmode enters, what it guards while inside, and the two gates that release it back to the exact phase it interrupted.',
        boxes: [
            { id: 'gm-just',  x: 64,  y: 118, w: 340, h: 100, tag: 'gate',    t: '≥100-word [GMODE]', s: 'user-gated justification' },
            { id: 'gm-enter', x: 64,  y: 254, w: 340, h: 100, tag: 'action',  t: 'enter-gmode', s: 'stashes pre_gmode_phase + a snapshot' },
            { id: 'gm-work',  x: 484, y: 118, w: 380, h: 100, tag: 'context', t: 'substrate work', s: 'OPEVC guards rest; always-on keeps enforcing' },
            { id: 'gm-rc',    x: 484, y: 254, w: 380, h: 100, tag: 'gate',    t: 'root-cause exit gate', s: 'a NEW [PENDING-JOB] note this gmode' },
            { id: 'gm-exit',  x: 280, y: 380, w: 340, h: 100, tag: 'action',  t: 'exit-gmode', s: 'restores the exact interrupted phase' }
        ],
        edges: [
            { from: 'gm-just',  to: 'gm-enter', kind: 'hard', label: 'admits' },
            { from: 'gm-enter', to: 'gm-work',  kind: 'hard', label: 'then' },
            { from: 'gm-work',  to: 'gm-rc',    kind: 'hard', label: 'before leaving' },
            { from: 'gm-rc',    to: 'gm-exit',  kind: 'hard', label: 'pass →' }
        ],
        stickies: [
            { x: 300, y: 30, aha: true, text: '<b>Anything that forced a gmode deserves an investigation wider than the visible fix</b> — so exit demands a root-cause note.' }
        ],
        navHints: { up: 'back to gmode' }
    }
};
