/* ============================================================================
 * completion-events.cards.js — CONTENT for the "Completion events + focus" deck.
 * Teaches: completion ≠ unfocus — the three independent events conflated into one word.
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the engine.
 *
 * Every hood fact re-verified against the LIVE prototype 2026-06-17. Source pointers use
 * STABLE anchors (file · arm/section), never line numbers, per the glossary term-anatomy
 * rule. The retired "points" advance model was corrected to the three-family exit gate.
 * Sources: job_core/scripts/job.sh, job_core/hooks/question-capture.sh +
 * question-capture-hook.sh, job_core/hooks/stop-gate.sh, job_core/hooks/job-guard.sh,
 * phase_condense/scripts/condense-commit.sh, + .claude/context/ (job-system.md +
 * opevc-metacog.md three-family exit gate + opevc-condense.md — design ground truth).
 * ⚠ = where a published essay differs from the built code (the honesty badge).
 * ============================================================================ */
window.DECK_META = { page: 'completion-events', seqLabel: 'completion ≠ unfocus' };

window.DECK_INFO = {
    /* ---- Card 1: three events ---- */
    'ce-confuse': {
        title: '"Completion" — one word, three meanings', tag: 'gate',
        what: 'The word "completion" gets used for three different things that happen at three different moments. Conflating them is the root of a lot of confusion.',
        why: 'A job\'s record, the phase machine, and the cycle counter are separate systems. Each has its own "done" — and treating them as one event is exactly what created the old completion deadlock.',
        hood: 'There is no single "complete the job" operation. Three independent code paths fire at three boundaries: <code>job.sh complete)</code> (the record), <code>condense-commit.sh</code>\'s advance (the phase), and <code>phase.sh</code>\'s idle→observe (the counter).'
    },
    'ce-e1': {
        title: 'Event 1 — job completion', tag: 'object',
        what: 'The job\'s status flips from active to completed. That is all this event does to the record.',
        why: 'It marks the work approved and done — but it is purely a record change. It does NOT end the phase cycle and does NOT release focus.',
        hood: 'The <code>complete)</code> arm in <code>job.sh</code> (hook-only — guarded at arm entry) sets <code>.status="completed" | .last_completed_at</code> via its <code>update_job</code> call and nothing else — <code>focused</code> is untouched.'
    },
    'ce-e2': {
        title: 'Event 2 — condense→idle advance', tag: 'phase',
        what: 'The phase machine advances the job out of CONDENSE back to idle. THIS is where the job actually loses focus.',
        why: 'Leaving the job is a phase-transition concern, not a record concern. Putting the unfocus here (not inside completion) is what dissolves the deadlock.',
        hood: '<code>condense-commit.sh</code>\'s Advance-to-idle step (after the seal-evidence gate) runs <code>phase.sh --hook advance</code>; then its <code>Relocated unfocus (completion Event 2)</code> section checks <code>status=="completed"</code> and calls <code>job.sh --hook clear-focus</code> (the <code>clear-focus)</code> arm).'
    },
    'ce-e3': {
        title: 'Event 3 — cycle closure', tag: 'state',
        what: 'The cycle counter increments by one — but not yet. It bumps on the job\'s NEXT idle→observe move, not on this condense→idle edge.',
        why: 'The cycle integer measures laps actually started, so it advances when the next lap begins — keeping "cycle N" honest.',
        hood: '<code>phase.sh</code>\'s <code>advance</code> arm increments <code>cycle += 1</code> on the <code>idle→observe</code> branch only. The condense→idle edge announces "cycle N complete" but does not bump the counter.'
    },
    /* ---- Card 2: Event 1 keeps focus ---- */
    'ce-jc': {
        title: '[JOB-COMPLETE] — "Approve completion"', tag: 'action',
        what: 'At the final CONDENSE the agent asks the user a [JOB-COMPLETE] question; the user picking "Approve completion" is what starts Event 1.',
        why: 'Completion is a user decision, not a self-call. The structured question is the ratchet that forces an honest "is this really done?" self-assessment first.',
        hood: 'The pre-hook (<code>question-capture.sh</code>, the <code>[JOB-COMPLETE]</code> section) only allows the question in CONDENSE (its phase-of-firing gate) and enforces the job name + "Review"/"Approve completion" labels + ≥100 words. On "Approve completion" the post-hook (<code>question-capture-hook.sh</code>) runs.'
    },
    'ce-approve': {
        title: 'user_approval = true', tag: 'gate',
        what: 'Before the status can flip, a separate approval flag must be set — and only the user\'s answer can set it.',
        why: 'It is a consent gate. The seed can never mark its own work approved; the flag records that a human signed off.',
        hood: 'Set ONLY by <code>job.sh --hook approve</code> (the <code>approve)</code> arm), which is hook-gated and reached only from the [JOB-COMPLETE] post-handler (<code>question-capture-hook.sh</code>\'s "Approve completion" branch). Reset to false only by <code>reactivate</code>.'
    },
    'ce-complete': {
        title: '--hook complete (CONDENSE-only)', tag: 'gate',
        what: 'The gated executor that performs the flip — only callable by a hook, only when the job is in CONDENSE, and only once every other gate passes.',
        why: 'Locking completion to CONDENSE + hooks means a job can only be declared done from inside its own closing phase, never improvised mid-work.',
        hood: '<code>job.sh</code>\'s <code>complete)</code> arm dies unless <code>HOOK_MODE</code> and <code>current_phase=="condense"</code>; it also checks name, objective ≤500w, <code>user_approval==true</code>, and all <code>depends_on</code> completed.'
    },
    'ce-flip': {
        title: 'status → completed', tag: 'object',
        what: 'The actual record change: status becomes completed and a completion timestamp is stamped. This is the entire footprint of Event 1.',
        why: 'A small, surgical write. Everything else people associate with "completion" (leaving the job, closing the cycle) happens elsewhere, later.',
        hood: 'The <code>complete)</code> arm\'s <code>update_job</code> call — <code>.status="completed" | .last_completed_at=$_lca</code> (epoch seconds). No other field changes.'
    },
    'ce-focus': {
        title: 'focused STAYS true', tag: 'state',
        what: 'Crucially, completion does NOT unfocus the job. A just-completed job is still the focused job.',
        why: 'This is the deliberate decoupling. Keeping focus gives the seed a window to finish condensing the now-completed job before it lets go.',
        hood: 'The <code>complete)</code> arm never writes <code>focused</code>. A job can be <code>status=completed</code> AND <code>focused=true</code> at once — by design.'
    },
    /* ---- Card 3: cleanup window ---- */
    'ce-cwf': {
        title: 'completed + focused — the cleanup window', tag: 'state',
        what: 'The deliberate in-between state: the job is done (completed) but still the centre of attention (focused). It lasts through the rest of the final CONDENSE.',
        why: 'Without it, a job that completed AND unfocused at the same instant would have no tools left to finish condensing — and would strand the seed (the old deadlock).',
        hood: 'Made possible because the <code>complete)</code> arm leaves <code>focused</code> alone. The window closes only at the condense→idle advance (Event 2).'
    },
    'ce-guard': {
        title: 'the phase guard keys on FOCUS, not status', tag: 'gate',
        what: 'The phase guard lets the focused job keep its tools based on focus being present — regardless of whether the job is active or completed.',
        why: 'Because the allow rule reads focus (not status), a completed-but-focused job keeps full access — which is exactly what lets it finish the cycle.',
        hood: '<code>job-guard.sh</code>\'s Focus-Required Enforcement section grants the allow on focus PRESENCE (any status). A completed+focused job in CONDENSE therefore keeps tools + altered-list scope.'
    },
    'ce-tools': {
        title: 'tools + scope still keyed to the job', tag: 'context',
        what: 'Through the window, the seed\'s tool access and write-scope are still pointed at the (now completed) focused job.',
        why: 'So the agent can keep doing CONDENSE work — routing findings, deflating footers — on a job it just marked done.',
        hood: 'Write-scope + the phase guards resolve against the focused job id; focus has not moved yet, so nothing changes until Event 2.'
    },
    'ce-points': {
        title: 'finish CONDENSE → earn the advance', tag: 'action',
        what: 'Inside the window the seed completes the CONDENSE work and earns the advance out of the phase.',
        why: 'The advance (the three-family exit gate + 80% deflation) is what triggers Event 2 — so the cleanup window is the bridge from "record done" to "actually leave".',
        hood: 'The <code>condense-commit.sh --force</code> advance requires the three-family exit gate — for CONDENSE: (a) reflection commands ran + (c) ≥1 reflector subagent ran (family-b is NOT required — CONDENSE consumes marks, so its marker-side gate runs in the consumption direction instead) — plus the 80% deflation gate; meeting them fires the phase hop that hosts the relocated unfocus. There is no point total.'
    },
    /* ---- Card 4: Event 2 relocated unfocus ---- */
    'ce-cc': {
        title: 'condense-commit --force', tag: 'action',
        what: 'The cycle\'s closing commit. Once its gates pass, it advances the phase — and that advance is where the unfocus has been relocated to.',
        why: 'Leaving the job rides along with the phase transition, not the record change. One place, one moment, clearly a phase event.',
        hood: '<code>condense-commit.sh --force</code> runs the advance (the Advance-to-idle step (after the seal-evidence gate) calling <code>phase.sh --hook advance</code>) after its gates pass.'
    },
    'ce-gates': {
        title: 'three-family gate · 80% deflation', tag: 'gate',
        what: 'The universal CONDENSE gates that must pass before the advance fires.',
        why: 'They make sure the consolidation work actually happened — reflection ran and the footers shrank — before the job is allowed to leave.',
        hood: 'The three-family exit gate — for CONDENSE: (a) reflection commands ran + (c) ≥1 available reflector subagent ran. Family-b (new marked notes) is NOT required here — CONDENSE consumes marks rather than producing them, so its marker-side gate runs in the CONSUMPTION direction instead (the consumption gate: per class, a dedicated-subagent run per marked note). Plus <code>CONDENSE_DEF_THRESHOLD=80</code> (deflation of altered CLAUDE.md footers), checked in <code>condense-commit.sh</code> before the advance. No point total exists — the condition is evidence of reflection plus absorption.'
    },
    'ce-adv': {
        title: 'advance → idle', tag: 'phase',
        what: 'The job moves out of CONDENSE back to idle. The lap is structurally over.',
        why: 'idle only flows forward to OBSERVE, so the returning job can\'t silently resume mid-cycle — it must start a fresh lap.',
        hood: '<code>condense-commit.sh</code>\'s Advance-to-idle step (after the seal-evidence gate) calls <code>phase.sh --hook advance</code>; CONDENSE is lock-forward, so the only exit is forward to idle.'
    },
    'ce-chk': {
        title: 'status == completed?', tag: 'gate',
        what: 'Right after the advance, the engine checks whether the job that just hit idle is a completed one.',
        why: 'Only a completed job should be released; a still-active multi-cycle job must stay focused so it keeps running its remaining cycles.',
        hood: '<code>condense-commit.sh</code>\'s Relocated unfocus section reads the focused job\'s status; the unfocus only fires when it is <code>"completed"</code>.'
    },
    'ce-cf': {
        title: 'clear-focus → unfocused', tag: 'action',
        what: 'For a completed job, focus is finally cleared. The job lands in idle, unfocused, and the seed moves to next-job-selection.',
        why: 'This is the real "leaving" — and it is unmistakably a phase-boundary action, not part of marking the record done.',
        hood: '<code>condense-commit.sh</code>\'s Relocated unfocus section → <code>job.sh --hook clear-focus</code> (the <code>clear-focus)</code> arm, hook-gated) sets <code>focused=false</code>. A still-active job skips this and stays focused across the lap.'
    },
    /* ---- Card 5: Event 3 + stop gate ---- */
    'ce-idle2': {
        title: 'idle — unfocused, ready', tag: 'state',
        what: 'The job sits in idle with no focus. From here two different things can happen depending on whether more work remains.',
        why: 'idle is the hinge: it either flows into a new OBSERVE (the cycle bumps) or, if nothing is left to do, lets the Stop gate release.',
        hood: 'idle is a non-OPEVC resting state; it flows forward only to OBSERVE. Next-job-selection picks what (if anything) becomes focused next.'
    },
    'ce-bump': {
        title: 'next idle→observe: cycle += 1', tag: 'phase',
        what: 'When a job next starts a lap (idle→observe), the cycle counter increments. This — not the condense→idle edge — is Event 3.',
        why: 'The counter measures laps begun, so it bumps as the new lap starts. It is why "cycle N complete" at CONDENSE doesn\'t change the number yet.',
        hood: '<code>phase.sh</code>\'s <code>advance</code> arm bumps <code>cycle += 1</code> on the <code>idle→observe</code> branch only.'
    },
    'ce-stop': {
        title: 'active + pending == 0?', tag: 'gate',
        what: 'The Stop gate asks: is there any active or pending job left? Only if the answer is zero may the seed actually stop.',
        why: 'It is the seed\'s "all work done" check. As long as any job is active or pending, the seed refuses to go quiet.',
        hood: '<code>stop-gate.sh</code> sums active+pending; its SUCCESS branch guards on <code>total -eq 0</code>. Event 1\'s status→completed is what can make that total reach 0 — the release is a consequence, not part of completion.'
    },
    'ce-rest': {
        title: 'quiescent stop', tag: 'state',
        what: 'With no jobs left, the seed is allowed to stop — and on the way out it launches the quiescent heartbeat daemon that can wake it later.',
        why: 'Stopping isn\'t death: a detached timer (heartbeat-2) keeps watch so a repeating job can re-fire while the seed is at rest.',
        hood: '<code>stop-gate.sh</code>\'s SUCCESS branch launches <code>quiescent-heartbeat.sh</code> (setsid/nohup, PID-singleton) then exits 0.'
    },
    'ce-more': {
        title: 'jobs remain → Stop BLOCKS', tag: 'state',
        what: 'If any active or pending job remains, the Stop gate blocks — the seed is not allowed to stop and keeps working.',
        why: 'This is what makes the seed a standing worker: it won\'t go idle-forever while there is still work on its plate.',
        hood: 'When <code>total > 0</code>, <code>stop-gate.sh</code> does not take the success branch; the stop is refused and the seed continues.'
    }
};

window.DECK_CARDS = {
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'Completion ≠ unfocus · step 1',
        title: 'Three things people call "completion"',
        sub: 'What you\'re looking at: one overloaded word, split into the three independent events it actually names.',
        boxes: [
            { id:'ce-confuse', x:64,  y:222, w:216, h:116, tag:'gate',   t:'"completion"', s:'one word, three meanings' },
            { id:'ce-e1', x:556, y:90,  w:368, h:92, tag:'object', t:'Event 1 · job completion', s:'status → completed' },
            { id:'ce-e2', x:556, y:230, w:368, h:92, tag:'phase',  t:'Event 2 · condense→idle advance', s:'where the unfocus lives' },
            { id:'ce-e3', x:556, y:370, w:368, h:92, tag:'state',  t:'Event 3 · cycle closure', s:'cycle += 1' }
        ],
        edges: [
            { from:'ce-confuse', to:'ce-e1', kind:'soft', label:'the record' },
            { from:'ce-confuse', to:'ce-e2', kind:'soft', label:'a phase hop' },
            { from:'ce-confuse', to:'ce-e3', kind:'soft', label:'a counter' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'Completing the cycle is <b>not</b> completing the job — three events, three actors, three boundaries.',
              ref: { url:'../../b5/05_4-job-core.html', section:'Blog 5.4 · the three completion events', blurb:'The job_core essay names the same three events; this deck draws their actors and boundaries.' } },
            { x:64, y:30, text:'These events close out a job\'s whole lifecycle.',
              ref: { kind: 'deck', url: 'job-life.html', section: 'The Life of a Job', blurb: 'The full job lifecycle from birth to completion.' } }
        ],
        nextnote: { x:606, y:496, text:'Follow Event 1 →' },
        downhint: null,
        navHints: { down: 'why split into three? — the deadlock story' }
    },
    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'Completion ≠ unfocus · step 2',
        title: 'Event 1 — completion KEEPS focus',
        sub: 'What you\'re looking at: the [JOB-COMPLETE] → status flip, and the one thing it deliberately does NOT touch.',
        boxes: [
            { id:'ce-jc', x:44,  y:128, w:204, h:100, tag:'action', t:'[JOB-COMPLETE]', s:'"Approve completion"' },
            { id:'ce-approve', x:300, y:128, w:216, h:100, tag:'gate', t:'user_approval = true', s:'hook-gated · user only' },
            { id:'ce-complete', x:572, y:128, w:336, h:100, tag:'gate', t:'--hook complete', s:'CONDENSE-only · sets status' },
            { id:'ce-flip', x:300, y:322, w:216, h:100, tag:'object', t:'status → completed', s:'+ last_completed_at' },
            { id:'ce-focus', x:572, y:322, w:336, h:100, tag:'state', t:'focused STAYS true', s:'completion does not touch it' }
        ],
        edges: [
            { from:'ce-jc', to:'ce-approve', kind:'hard', label:'you answer' },
            { from:'ce-approve', to:'ce-complete', kind:'hard', label:'then' },
            { from:'ce-complete', to:'ce-flip', kind:'hard', label:'sets' },
            { from:'ce-complete', to:'ce-focus', kind:'soft', label:'leaves alone' }
        ],
        stickies: [
            { x:40, y:30, aha:true, text:'Completion is a <b>job-record</b> event — it sets <b>status</b> only. Focus is deliberately left alone.',
              ref: { url:'../../b5/05_4-job-core.html', section:'Blog 5.4 · the two-hook completion split', blurb:'job_core splits completion across a pre-hook (the gate) and a post-hook (approve then complete); user_approval is hook-gated.' } }
        ],
        backnote: { x:46, y:486, text:'← three events, one word' },
        nextnote: { x:560, y:486, text:'But it stays focused — why? →' },
        navHints: { down: 'the five gate checks before the flip' }
    },
    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'Completion ≠ unfocus · step 3',
        title: 'The cleanup window (completed AND focused)',
        sub: 'What you\'re looking at: why a job stays focused after it is done — and how that dissolves the old deadlock.',
        boxes: [
            { id:'ce-cwf', x:60, y:222, w:240, h:116, tag:'state', t:'completed + focused', s:'the cleanup window' },
            { id:'ce-guard', x:392, y:96, w:300, h:92, tag:'gate', t:'the guard keys on FOCUS', s:'presence, any status' },
            { id:'ce-tools', x:392, y:234, w:300, h:92, tag:'context', t:'tools + scope still keyed', s:'to the focused job' },
            { id:'ce-points', x:392, y:372, w:300, h:92, tag:'action', t:'finish CONDENSE', s:'earn the advance' }
        ],
        edges: [
            { from:'ce-guard', to:'ce-cwf', kind:'hard', label:'allows' },
            { from:'ce-cwf', to:'ce-tools', kind:'hard', label:'keeps' },
            { from:'ce-tools', to:'ce-points', kind:'hard', label:'so it can' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'Keeping focus through completion gives the seed a <b>window to finish condensing</b> — and dissolves the deadlock.' }
        ],
        backnote: { x:46, y:486, text:'← completion kept focus' },
        nextnote: { x:560, y:486, text:'So when does it leave? →' },
        navHints: { down: 'why focus gates, not status' }
    },
    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'Completion ≠ unfocus · step 4',
        title: 'Event 2 — the relocated unfocus',
        sub: 'What you\'re looking at: where leaving the job actually happens — at the phase boundary, not inside completion.',
        boxes: [
            { id:'ce-cc', x:44,  y:130, w:200, h:96, tag:'action', t:'condense-commit --force', s:'the cycle\'s last commit' },
            { id:'ce-gates', x:292, y:130, w:208, h:96, tag:'gate', t:'three-family · 80% deflation', s:'the universal gates' },
            { id:'ce-adv', x:548, y:130, w:248, h:96, tag:'phase', t:'advance → idle', s:'lock-forward exit' },
            { id:'ce-chk', x:292, y:322, w:208, h:96, tag:'gate', t:'status == completed?', s:'checked at the advance' },
            { id:'ce-cf', x:548, y:322, w:248, h:96, tag:'action', t:'clear-focus → unfocused', s:'clear-focus) arm' }
        ],
        edges: [
            { from:'ce-cc', to:'ce-gates', kind:'hard', label:'pass' },
            { from:'ce-gates', to:'ce-adv', kind:'hard', label:'then' },
            { from:'ce-adv', to:'ce-chk', kind:'hard', label:'at idle' },
            { from:'ce-chk', to:'ce-cf', kind:'hard', label:'completed → leave' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'Unfocus is a <b>phase-transition</b> event — it lives at the condense→idle boundary, NOT inside complete.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · the advance out of CONDENSE', blurb:'06_7 teaches the condense→idle advance (the deflation gate). This deck adds the relocated unfocus that rides on that same advance.' } },
            { x:548, y:436, text:'Still <b>active</b> (multi-cycle)? It stays focused across the lap — only a <b>completed</b> job is unfocused here.' },
            { x:44, y:36, text:'The final CONDENSE clears the three-family gate first.',
              ref: { kind: 'deck', url: 'phase-advance.html', section: 'How a Phase Earns its Advance', blurb: 'The three-family exit gate, including CONDENSE\'s consumption-direction form.' } }
        ],
        backnote: { x:46, y:486, text:'← the cleanup window closes' },
        nextnote: { x:560, y:486, text:'Then the cycle + the rest →' },
        navHints: { down: 'the status check: completed leaves, active stays' }
    },
    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'Completion ≠ unfocus · step 5',
        title: 'Event 3 + the Stop gate release',
        sub: 'What you\'re looking at: when the cycle counter actually bumps, and when the seed is finally allowed to rest.',
        boxes: [
            { id:'ce-idle2', x:44,  y:222, w:184, h:110, tag:'state', t:'idle', s:'unfocused, ready' },
            { id:'ce-bump', x:300, y:96, w:330, h:92, tag:'phase', t:'next idle→observe: cycle += 1', s:'NOT on condense→idle' },
            { id:'ce-stop', x:300, y:234, w:330, h:92, tag:'gate', t:'active + pending == 0?', s:'the Stop gate' },
            { id:'ce-more', x:300, y:372, w:330, h:92, tag:'state', t:'jobs remain → Stop BLOCKS', s:'the seed keeps working' },
            { id:'ce-rest', x:702, y:234, w:214, h:92, tag:'state', t:'quiescent stop', s:'heartbeat-2 can wake it' }
        ],
        edges: [
            { from:'ce-idle2', to:'ce-bump', kind:'soft', label:'next prompt' },
            { from:'ce-idle2', to:'ce-stop', kind:'hard', label:'ready to rest?' },
            { from:'ce-stop', to:'ce-rest', kind:'hard', label:'== 0 → rest' },
            { from:'ce-stop', to:'ce-more', kind:'soft', label:'> 0 → blocked' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'The cycle bump waits for the <b>next OBSERVE</b>. The Stop gate releases only when <b>no job remains</b>.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · the cycle bumps on idle→observe', blurb:'The cycle counter increments when the next lap begins (idle→observe), not on the condense→idle edge that closes the previous one.' } }
        ],
        backnote: { x:46, y:486, text:'← the job left at the advance' },
        navHints: { down: 'the Stop gate and the two heartbeats' }
    },
    /* ===== DETAIL CARDS (row 1) ===== */
    '0,1': {
        kind: 'detail',
        eyebrow: 'Completion events · step 1 detail',
        title: 'The deadlock this split dissolves',
        sub: 'What you\'re looking at: the old coupled design that caused a deadlock, and the fix — separate the record event from the phase event.',
        boxes: [
            { id:'dl-old',      x:64,  y:118, w:380, h:88, tag:'object', t:'the old complete)', s:'flipped status AND unfocused in one call' },
            { id:'dl-strand',   x:64,  y:242, w:380, h:88, tag:'state',  t:'stranded mid-CONDENSE', s:'no tools left to finish condensing' },
            { id:'dl-relocate', x:64,  y:366, w:380, h:88, tag:'action', t:'relocate the unfocus', s:'to the condense→idle advance' },
            { id:'dl-record',   x:516, y:242, w:404, h:80, tag:'object', t:'record event', s:'status→completed (job.sh)' },
            { id:'dl-phase',    x:516, y:340, w:404, h:80, tag:'phase',  t:'phase event', s:'unfocus (condense-commit)' }
        ],
        edges: [
            { from:'dl-old',      to:'dl-strand',   kind:'hard', label:'coupled→' },
            { from:'dl-strand',   to:'dl-relocate', kind:'soft', label:'fix' },
            { from:'dl-relocate', to:'dl-record',   kind:'hard', label:'splits into' },
            { from:'dl-relocate', to:'dl-phase',    kind:'hard', label:'and' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'A deadlock means an operation is in the <b>wrong place</b> — relocate it, don\'t loosen the gate.' }
        ],
        navHints: { up: 'back to the three events' }
    },
    '1,1': {
        kind: 'detail',
        eyebrow: 'Completion events · Event 1 detail',
        title: 'The --hook complete gate stack',
        sub: 'What you\'re looking at: every check the complete) arm runs before it flips the status — five gates in sequence.',
        boxes: [
            { id:'gc-hook',  x:64,  y:108, w:380, h:84, tag:'gate',   t:'HOOK_MODE', s:'only a hook may call it' },
            { id:'gc-phase', x:64,  y:206, w:380, h:84, tag:'gate',   t:'current_phase==condense', s:'CONDENSE-only' },
            { id:'gc-name',  x:64,  y:304, w:380, h:84, tag:'gate',   t:'name + objective ≤500w', s:'shape checks' },
            { id:'gc-appr',  x:516, y:108, w:404, h:84, tag:'gate',   t:'user_approval==true', s:'consent gate' },
            { id:'gc-deps',  x:516, y:206, w:404, h:84, tag:'gate',   t:'all depends_on completed', s:'dep-walk' },
            { id:'gc-flip',  x:516, y:304, w:404, h:84, tag:'object', t:'status → completed', s:'the surgical write' }
        ],
        edges: [
            { from:'gc-hook',  to:'gc-phase', kind:'hard', label:'and' },
            { from:'gc-phase', to:'gc-name',  kind:'hard', label:'and' },
            { from:'gc-name',  to:'gc-appr',  kind:'hard', label:'and' },
            { from:'gc-appr',  to:'gc-deps',  kind:'hard', label:'and' },
            { from:'gc-deps',  to:'gc-flip',  kind:'hard', label:'all pass →' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'Completion is locked to <b>CONDENSE + hooks + user consent</b> — it can never be improvised mid-work.' }
        ],
        navHints: { up: 'back to Event 1' }
    },
    '2,1': {
        kind: 'detail',
        eyebrow: 'Completion events · cleanup window detail',
        title: 'The guard keys on FOCUS, not status',
        sub: 'What you\'re looking at: why a completed job keeps full tool access — the allow rule reads focus presence, not the status field.',
        boxes: [
            { id:'cw-guard2', x:64,  y:118, w:380, h:96, tag:'gate',    t:'Focus-Required Enforcement', s:'job-guard.sh allows on focus PRESENCE' },
            { id:'cw-any',    x:64,  y:250, w:380, h:88, tag:'state',   t:'any status', s:'active OR completed' },
            { id:'cw-tools2', x:516, y:118, w:404, h:96, tag:'context', t:'tools + altered-list scope', s:'stay keyed to the job' },
            { id:'cw-finish2',x:516, y:250, w:404, h:88, tag:'action',  t:'finish CONDENSE', s:'route findings, deflate footers' }
        ],
        edges: [
            { from:'cw-guard2', to:'cw-any',     kind:'hard', label:'reads' },
            { from:'cw-any',    to:'cw-tools2',  kind:'hard', label:'so it keeps' },
            { from:'cw-tools2', to:'cw-finish2', kind:'hard', label:'to' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'Because the allow rule reads <b>focus</b> (not status), a completed-but-focused job keeps full access.' }
        ],
        navHints: { up: 'back to the cleanup window' }
    },
    '3,1': {
        kind: 'detail',
        eyebrow: 'Completion events · Event 2 detail',
        title: 'Completed leaves, active stays',
        sub: 'What you\'re looking at: the two-way branch at the condense→idle advance — only a completed job is unfocused here.',
        boxes: [
            { id:'ru-adv',       x:64,  y:182, w:260, h:96, tag:'phase',  t:'advance → idle', s:'lock-forward exit' },
            { id:'ru-chk',       x:388, y:182, w:264, h:96, tag:'gate',   t:'status == completed?', s:'checked right after' },
            { id:'ru-completed', x:708, y:100, w:192, h:96, tag:'action', t:'completed → clear-focus', s:'the job leaves' },
            { id:'ru-active',    x:708, y:282, w:192, h:96, tag:'state',  t:'active → stays focused', s:'runs its remaining cycles' }
        ],
        edges: [
            { from:'ru-adv',  to:'ru-chk',       kind:'hard', label:'at idle' },
            { from:'ru-chk',  to:'ru-completed',  kind:'hard', label:'yes' },
            { from:'ru-chk',  to:'ru-active',     kind:'soft', label:'no' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'A multi-cycle job that isn\'t done yet <b>keeps focus across the lap</b> — only a completed job is unfocused here.' }
        ],
        navHints: { up: 'back to Event 2' }
    },
    '4,1': {
        kind: 'detail',
        eyebrow: 'Completion events · Event 3 detail',
        title: 'The Stop gate and the two heartbeats',
        sub: 'What you\'re looking at: what happens after the seed rests — the gate, the daemon, and the repeating-job wake.',
        boxes: [
            { id:'sg-sum',   x:64,  y:162, w:368, h:96, tag:'gate',   t:'active + pending == 0?', s:'stop-gate.sh sums them' },
            { id:'sg-block', x:64,  y:314, w:368, h:88, tag:'state',  t:'> 0 → Stop BLOCKS', s:'the seed keeps working' },
            { id:'sg-rest',  x:512, y:100, w:388, h:88, tag:'state',  t:'== 0 → quiescent stop', s:'allowed to rest' },
            { id:'sg-h2',    x:512, y:222, w:388, h:88, tag:'action', t:'heartbeat-2 daemon', s:'quiescent-heartbeat.sh (setsid)' },
            { id:'sg-wake',  x:512, y:344, w:388, h:88, tag:'phase',  t:'[WAKE] re-fire', s:'a repeating job reactivates' }
        ],
        edges: [
            { from:'sg-sum',  to:'sg-block', kind:'soft', label:'>0' },
            { from:'sg-sum',  to:'sg-rest',  kind:'hard', label:'==0' },
            { from:'sg-rest', to:'sg-h2',    kind:'hard', label:'launches' },
            { from:'sg-h2',   to:'sg-wake',  kind:'soft', label:'later' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'Stopping isn\'t death — a <b>detached timer</b> keeps watch so a repeating job can re-fire while the seed is at rest.',
              ref: { url:'../06_10-plan-state-machine.html', section:'Blog 6.10 · the two-heartbeat reactivation model', blurb:'06_10 teaches Heartbeat-1 (self-compact rhythm while working) and Heartbeat-2 (quiescent-heartbeat.sh daemon while resting).' } }
        ],
        navHints: { up: 'back to Event 3 + Stop gate' }
    }
};
