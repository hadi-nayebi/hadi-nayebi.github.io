/* ============================================================================
 * phase-advance.cards.js — CONTENT for the "Inside a Phase" concept-deck.
 * Teaches: how ONE OPEVC phase runs (operational entry → metacognitive exit) and
 * the THREE-FAMILY EXIT GATE that is every phase’s advance condition.
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the engine,
 * which reads window.DECK_INFO + window.DECK_CARDS.
 *
 * Every hood fact verified against the LIVE prototype 2026-06-17 (own-grep, Rule 3).
 * Source pointers use STABLE anchors (file · function/config-key/section), never line
 * numbers, per the glossary term-anatomy rule. Design ground truth:
 *   .claude/context/opevc-metacog.md (three-family exit gate · per-phase accrue ·
 *     metacognition commands) + opevc-rhythm.md (min-max gate) + opevc-phases.md.
 * Implementation: .claude/plugins/phase_observe/{config.conf, scripts/observe-commit.sh,
 *   scripts/observe.sh, hooks/observe-tracker.sh, hooks/voice.xml, agents/} (canonical;
 *   the four sibling phase plugins mirror the shape) + phase_condense/{config.conf,
 *   scripts/condense-commit.sh, agents/condense-promotion-scan.md}.
 * ============================================================================ */
window.DECK_META = { page: 'phase-advance', seqLabel: 'one phase, entry → advance' };

window.DECK_INFO = {
    /* ---------------- Card 1 : a phase begins ---------------- */
    'pa-entry': {
        title: 'The entry voice — coaching, not a gate', tag: 'action',
        what: 'When a phase begins, an entry voice coaches HOW to do this phase\'s work — which subagents to dispatch, what good looks like here. It asks nothing of you; it orients you.',
        why: 'Phase entry is deliberately frictionless. There is no act to perform to enter, no value to set first. All the friction lives at the EXIT — so the work starts immediately and the reflection is demanded only when you try to leave.',
        hood: 'The entry voice is the <code>entry-advance</code> block in <code>phase_observe/hooks/voice.xml</code> (each phase plugin carries its own). It introduces the phase\'s operational subagents — the "do the work" half of the per-phase accrue design. Nothing about entry is gate-checked.'
    },
    'pa-draw': {
        title: 'Thresholds drawn at entry', tag: 'object',
        what: 'As the phase opens, it rolls its own difficulty: how many reflective "lenses" and how many new marked notes it will demand before it can advance — picked fresh from small sets each time.',
        why: 'Variable thresholds can\'t be gamed to a constant. A phase never knows in advance whether it will need 1 lens or 3, so the seed has to actually reflect rather than hit a memorised number.',
        hood: '<code>observe.sh</code>\'s <code>render_observe_entry</code> draws <code>familya_target</code> from <code>METACOG_FAMILYA_SET</code> (<code>"1 2 3"</code>) and <code>familyb_target</code> from <code>METACOG_FAMILYB_SET</code> (<code>"3 5 7"</code>) — the same random-from-pool pick the coaching voices use — and stores both on the phase entry, where the exit gate re-reads them.'
    },
    'pa-work': {
        title: 'Do the phase\'s work', tag: 'phase',
        what: 'The phase does its actual job — OBSERVE gathers, PLAN decides, EXECUTE builds, VERIFY checks, CONDENSE consolidates — mostly through delegated subagents.',
        why: 'This is the "operational" half of the phase. The metacognition that the exit gate checks is ABOUT this work, so the work has to happen first.',
        hood: 'Each phase guard restricts which tools are live here (OBSERVE/PLAN read-only, EXECUTE full write within the altered list, etc.). The work is paced from inside by the min-max gate — the next card.'
    },
    /* ---------------- Card 2 : min-max gate ---------------- */
    'pa-subagents': {
        title: 'Operational subagents (80/20)', tag: 'action',
        what: 'Most of the phase\'s real work is done by dispatched subagents; the main session mostly orchestrates and synthesises.',
        why: 'Delegation keeps the main context lean and turns one phase into many parallel investigations — the 80/20 split the whole seed runs on.',
        hood: 'The phase\'s roster (<code>phase_observe/agents/</code>) holds BOTH its operational subagents AND its one metacog reflector — distinguished by role, not separate pools (the subagent role-model taxonomy).'
    },
    'pa-min': {
        title: 'min side — earn each synthesis', tag: 'gate',
        what: 'The min side asks for enough investigative actions (reads, subagent runs, greps) behind every synthesis write — you have to look before you write down a conclusion.',
        why: 'It stops the seed from "synthesising" out of thin air. A conclusion has to be paid for with investigation first.',
        hood: 'Counted per ACTIVITY CLASS as tool-call counts in the phase’s own tracker (<code>&lt;phase&gt;-tracker.sh</code> — each phase has its own: <code>observe-tracker.sh</code>, <code>plan-tracker.sh</code>, <code>execute-tracker.sh</code>, <code>verify-tracker.sh</code>, <code>condense-tracker.sh</code>); thresholds tune per phase via <code>config.conf</code>. The canonical rule is the min-max gate (<code>.claude/context/opevc-rhythm.md</code>).'
    },
    'pa-max': {
        title: 'max side — synthesise before more', tag: 'gate',
        what: 'The max side blocks the investigative tools once ANY activity class hits its ceiling without a synthesis — forcing you to write down what you found before gathering more.',
        why: 'Read-read-read-forever is the failure it prevents. The ceiling makes the seed stop and consolidate so working memory keeps up with the gathering.',
        hood: 'When a class\'s unsynthesised count crosses its ceiling, the guard blocks that class\'s tools until a CLAUDE.md update lands. Per-class counters, one reset event — content is never parsed.'
    },
    'pa-reset': {
        title: 'a CLAUDE.md update resets ALL classes', tag: 'context',
        what: 'Writing into working memory (a CLAUDE.md update) is the single event that clears every activity-class counter at once. That write IS the synthesis.',
        why: 'One clean reset event keeps the rule simple and ungameable: the seed can\'t dodge it by mixing classes, because any one synthesis write zeroes them all.',
        hood: 'The composition rule: per-class counters, ONE reset — a CLAUDE.md update resets ALL class counters. This min-max gate paces intra-phase work INDEPENDENTLY of the advance gate (the next cards).'
    },
    /* ---------------- Card 3 : the advance boundary ---------------- */
    'pa-try': {
        title: 'phase-commit --force', tag: 'action',
        what: 'When the seed thinks the phase is finished, it runs the phase\'s force-advance commit to move to the next phase.',
        why: 'This is the only forward door. Forward is a gated --force commit; there is no way to slip into the next phase without passing through here.',
        hood: 'e.g. <code>observe-commit.sh --force</code>. Forward = gated commit (shape + the three-family exit gate + per-phase custom gates); backward recovery is free. The force path is where the exit voice and the three-family check live.'
    },
    'pa-exitvoice': {
        title: 'The exit voice — a mindset shift', tag: 'action',
        what: 'If the phase has not reflected enough yet, the exit voice fires a deliberate mindset shift: stop DOING the phase, start EXAMINING your own cognition — here is the gap, fill it, then advance.',
        why: 'Same phase, two voices. Entry coaches the work; exit flips the seed from operator to self-auditor. This is what accrues the per-job compaction file, phase by phase.',
        hood: 'The exit/metacog voice (e.g. <code>observe.block.metacog-mindset-shift</code> in <code>phase_observe/scripts/voice.xml</code>) fires at the advance boundary when the three-family gate is not yet satisfied — sitting on top of the per-requirement block messages.'
    },
    'pa-gate-ahead': {
        title: 'The three-family exit gate', tag: 'gate',
        what: 'The advance condition itself: three families of evidence that the phase actually reflected on its own work. Step right to open each one.',
        why: 'It gates advance on EVIDENCE OF REFLECTION — targeted friction aimed at real metacognition, not a score to farm.',
        hood: 'Checked inside the force-advance path of every <code>&lt;phase&gt;-commit.sh</code>. Three families, each a different kind of "the phase reflected": (a) reflection commands, (b) new marked notes, (c) a reflector ran. Armed unconditionally in all five phases (no master flag).'
    },
    /* ---------------- Card 4 : the three families ---------------- */
    'pa-fa': {
        title: '(a) reflection commands ran', tag: 'gate',
        what: 'Did the seed run its in-session reflection ops this phase? Two CORE ops always, plus a drawn number of deeper mental-model lenses.',
        why: 'These need the live reasoning trace, so they are commands, not subagents. They force the seed to spend compute reflecting on HOW it worked, and route that into the compaction file.',
        hood: 'HARD. <code>&lt;phase&gt;-commit.sh</code>\'s force path checks the 2 CORE ops (<code>METACOG_CORE_LENSES="quality-self-assessment voice-update-scan"</code>) PLUS a nuanced minimum equal to the entry\'s <code>familya_target</code> (drawn from <code>METACOG_FAMILYA_SET</code>). The CORE floor sits BENEATH the variable layer — it is not counted toward it. Open the down-card for the two CORE ops.'
    },
    'pa-fb': {
        title: '(b) new marked notes added', tag: 'gate',
        what: 'Did the phase leave behind genuinely-new marked notes (a [PENDING-JOB], [KNOWLEDGE], [VOICE-UPDATE]…) in working memory?',
        why: 'A reflecting phase produces durable breadcrumbs for CONDENSE to metabolise. Counting only NEW notes makes it ungameable.',
        hood: 'SOFT while <code>METACOG_MARKS_HARD=false</code> (coaches, does not block). The detector in <code>observe-tracker.sh</code> is ACTION-AWARE — it diffs the edit\'s old vs new marker lines (<code>added = markers(new) − markers(old)</code>), handles Edit / MultiEdit / Write, and counts all seven marker types. The minimum is the entry\'s <code>familyb_target</code> (from <code>METACOG_FAMILYB_SET</code>).'
    },
    'pa-fc': {
        title: '(c) a reflector ran', tag: 'gate',
        what: 'Did at least one of THIS phase\'s available reflector subagents run — the firewalled, file-only reviewer that hunts the phase\'s failure modes?',
        why: 'The reflector is the file-based half of metacognition (no session access). Requiring ≥1 guarantees an outside-the-trace check on the work.',
        hood: 'HARD. Reads the per-entry <code>agent_launches</code> record (no new counter); passes if any reflector in <code>METACOG_FAMILYC_REFLECTORS</code> appears. The set is USER-EXTENSIBLE — "≥1 of the AVAILABLE reflectors," never one pinned name. Open the down-cards for the five reflectors.'
    },
    'pa-verdict': {
        title: 'all required families YES → advance', tag: 'object',
        what: 'The gate passes when the required families are satisfied: (a) and (c) are hard, (b) is soft by default. Then — and only then — the phase may advance.',
        why: 'Three KINDS of evidence, not a numeric threshold. There is no point total to reach; the question is whether each kind of reflection actually happened.',
        hood: 'The three-family check is the advance sub-check inside the force path. It does NOT replace the other --force requirements (commit-shape, the CLAUDE.md-update floor, message-length) — it is an ADD on top of them. No point currency exists anywhere in the design.'
    },
    /* ---------------- Card 4-down-1 : family-a detail ---------------- */
    'pa-floor': {
        title: 'the constitutive floor — 2 CORE ops', tag: 'gate',
        what: 'Two reflection ops run in EVERY phase, always — the hard housekeeping floor that never drops to zero and is never part of the variable draw.',
        why: 'Keeping a constant floor separate from the variable layer is what makes the metacognition both robust (the floor never skips) and evolvable (the layer above is the tunable part) — the constitutive-plus-regulated pattern biochemistry uses.',
        hood: '<code>METACOG_CORE_LENSES="quality-self-assessment voice-update-scan"</code> in <code>config.conf</code>, uniform across all phases. Mandatory every phase; explicitly NOT counted toward family-a\'s drawn minimum.'
    },
    'pa-core1': {
        title: 'CORE op 1 — phase-quality self-assessment', tag: 'action',
        what: 'The seed rates its OWN work this phase — quality, and how faithfully it followed the phase\'s rules — and writes the finding where it survives the session.',
        why: 'A phase that never grades itself drifts. This op makes the phase audit how well it actually worked.',
        hood: 'Routes its finding to the compaction file\'s Process-Insight section (the compaction file is command-only — direct edit is guard-blocked in every phase, so this MUST run as an in-session command).'
    },
    'pa-core2': {
        title: 'CORE op 2 — voice-update-candidate scan', tag: 'action',
        what: 'The seed surfaces tweaks to its own coaching voices that would make THIS phase work better next time, and emits them as a marked note.',
        why: 'It closes a self-tuning loop: each phase doesn\'t just do the work, it proposes how its own coaching could do the work better.',
        hood: 'Emits a <code>[VOICE-UPDATE]</code> marked note for CONDENSE step 4 to metabolise. (The post-commit JOB.judgment reflection folds INTO this menu — one metacognition surface per phase, not two.)'
    },
    'pa-nuanced': {
        title: 'the regulated layer — nuanced lenses', tag: 'gate',
        what: 'On top of the floor sits a drawn number of deeper mental-model lenses — first-principles in OBSERVE, second-order effects in PLAN, inversion, and so on. The gate\'s variable minimum is of THESE.',
        why: 'The lenses are the knob that tunes how much compute a phase spends optimising the work versus doing it — the operator\'s tunable, extensible layer.',
        hood: 'The minimum is the entry\'s <code>familya_target</code>, drawn from <code>METACOG_FAMILYA_SET="1 2 3"</code> per phase entry. Advancing needs the floor (CORE ran) PLUS ≥ the drawn count of nuanced reflections — never one collapsed into the other.'
    },
    /* ---------------- Card 4-down-2 : the five reflectors ---------------- */
    'pa-r-obs': {
        title: 'OBSERVE · blindspot-finder', tag: 'action',
        what: 'Reads the gathered CLAUDE.md context and the dispatch objective, then asks: what did this OBSERVE miss?',
        why: 'OBSERVE\'s failure mode is an incomplete picture; its reflector hunts exactly that.',
        hood: '<code>phase_observe/agents/observe-blindspot-finder.md</code>. The default value of <code>METACOG_FAMILYC_REFLECTORS</code> for this phase.'
    },
    'pa-r-plan': {
        title: 'PLAN · premortem', tag: 'action',
        what: 'Assumes the plan already failed and works backward to why — the plan-risk-assessor repurposed as a premortem lens.',
        why: 'PLAN\'s failure mode is a confident-but-wrong plan; a premortem surfaces the risk before EXECUTE pays for it.',
        hood: '<code>phase_plan/agents/plan-premortem.md</code>. Family-c\'s available reflector for PLAN.'
    },
    'pa-r-exec': {
        title: 'EXECUTE · drift-auditor', tag: 'action',
        what: 'Compares what was built against the plan: what is missing, what is extra, what deviated.',
        why: 'EXECUTE\'s failure mode is silent scope drift; the auditor catches the gap between plan and product.',
        hood: '<code>phase_execute/agents/execute-drift-auditor.md</code>. Family-c\'s available reflector for EXECUTE.'
    },
    'pa-r-verify': {
        title: 'VERIFY · meta-audit', tag: 'action',
        what: 'Asks the adversarial question VERIFY can\'t ask of itself: what did verification ITSELF miss?',
        why: 'VERIFY\'s failure mode is a blind spot in its own checks; a meta-audit attacks the verification, not just the work.',
        hood: '<code>phase_verify/agents/verify-meta-audit.md</code>. Family-c\'s available reflector for VERIFY.'
    },
    'pa-r-cond': {
        title: 'CONDENSE · promotion-scan', tag: 'action',
        what: 'Scans the whole cycle for knowledge worth promoting into durable layers, and updates the cycle-lessons / Prior Summary.',
        why: 'CONDENSE\'s accrue is special — it reflects on the quality of its own LEARNING, not just its work.',
        hood: '<code>phase_condense/agents/condense-promotion-scan.md</code>. Family-c\'s available reflector for CONDENSE. (Its [KNOWLEDGE]/[VOICE-UPDATE] emissions do NOT gate CONDENSE\'s advance — see the CONDENSE card.)'
    },
    /* ---------------- Card 5 : pass / miss ---------------- */
    'pa-pass': {
        title: 'gate satisfied', tag: 'gate',
        what: 'The required families are all YES. The phase has both done its work and proven it reflected on it.',
        why: 'This is the whole point: a phase advances on evidence of reflection, so the next phase inherits a self-audited handoff.',
        hood: 'The three-family check returns clear inside the force path; the commit proceeds to the other --force gates.'
    },
    'pa-advance': {
        title: 'forward advance → next phase', tag: 'phase',
        what: 'The phase commits forward to the next phase in the OPEVC cycle (OBSERVE→PLAN→…→CONDENSE→idle).',
        why: 'Forward is the gated direction; passing the gate is what earns the hop.',
        hood: 'The <code>--force</code> advance runs <code>phase.sh</code>\'s forward transition. plan→verify is the one non-adjacent forward jump (re-test without re-execution); everything else is adjacent.'
    },
    'pa-rides': {
        title: 'rides on top of the other gates', tag: 'gate',
        what: 'The three-family gate is an ADD, not a replacement. The same commit still has to satisfy the commit-shape sections, the CLAUDE.md-update floor, and the message-length minimum.',
        why: 'Reflection is one requirement among several. Passing it doesn\'t waive the structural gates — they all fire together.',
        hood: 'In <code>observe-commit.sh</code>\'s force path the three-family branch sits alongside the commit-shape check, the <code>MIN_CLAUDE_MD_UPDATES</code> floor, and the message-length minimum. The min-max gate paced the WORK; these gate the ADVANCE.'
    },
    'pa-blocked': {
        title: 'miss any required family → blocked', tag: 'state',
        what: 'If a hard family is unmet, the advance is refused. The phase stays put; the exit voice names the gap; the seed satisfies it and retries.',
        why: 'The block is the friction that makes reflection non-optional — you can\'t leave a phase you didn\'t reflect on.',
        hood: 'The force commit exits non-zero with the specific unmet-family message; the phase does not transition. Fix the gap (run the lens / the reflector), re-commit.'
    },
    'pa-backward': {
        title: 'backward recovery is free', tag: 'action',
        what: 'Moving BACKWARD to an earlier phase has no cognitive gates at all — only a clean git tree. Recovery is always available.',
        why: 'The friction is one-directional: forward demands reflection; backward is a no-questions escape so the seed can always re-gather or re-plan.',
        hood: 'Backward = <code>&lt;phase&gt;-commit.sh --backward &lt;dest&gt;</code> — no three-family check, no shape gate, just a clean tree. Forward is gated; backward is a free recovery transition.'
    },
    /* ---------------- Card 6 : CONDENSE is special ---------------- */
    'pa-cond-tf': {
        title: 'CONDENSE keeps (a) + (c)', tag: 'gate',
        what: 'CONDENSE uses the same three-family gate — but only families (a) reflection commands and (c) a reflector ran. It is NOT gated on family (b).',
        why: 'CONDENSE\'s job is to CONSUME marked notes, so requiring it to also PRODUCE new ones would fight its own purpose.',
        hood: '<code>condense-commit.sh</code> applies families (a)+(c) and deliberately omits (b) (its code comment: "CONDENSE consumes marks rather than producing them"). Its promotion-scan MAY still emit [KNOWLEDGE]/[VOICE-UPDATE] — they just don\'t gate the advance.'
    },
    'pa-cond-defl': {
        title: '+ its own 80% deflation gate', tag: 'gate',
        what: 'On top of the three-family check, CONDENSE must shrink the cycle\'s working-memory footers by at least 80% before it can advance to idle.',
        why: 'CONDENSE is the most-gated phase on purpose: it advances on the reflection that judges HOW WELL it condensed, plus proof the footers actually deflated.',
        hood: '<code>CONDENSE_DEF_THRESHOLD=80</code> in <code>phase_condense/config.conf</code>, checked in <code>condense-commit.sh</code> before the advance — a single 80% rule across every Job Stage.'
    },
    'pa-cond-consume': {
        title: 'family-b runs in REVERSE — the consumption gate', tag: 'action',
        what: 'CONDENSE\'s marker-side check runs in the consumption direction: per marker class, it must dispatch a dedicated subagent run for each marked note — and drive every note to a terminal state.',
        why: 'Work phases gate on note CREATION; CONDENSE gates on note FEEDING. The notes the cycle produced have to actually be metabolised, not just glanced at.',
        hood: 'The CONDENSE consumption gate (<code>condense-commit.sh</code>): per class, dedicated-subagent runs ≥ marked notes of that class (the ENGAGEMENT half), and the Marked-note lifecycle requires every note end <code>[RESOLVED:]</code> or <code>[CARRIED:]</code> (a run is necessary but no longer sufficient).'
    }
};

window.DECK_CARDS = {
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'Inside a phase · step 1',
        title: 'A phase begins — coached, not gated',
        sub: 'What you\'re looking at: how one OPEVC phase opens. The entry voice coaches the work and the phase quietly rolls its own difficulty — but nothing is required to ENTER. All the friction is saved for the exit.',
        boxes: [
            { id:'pa-entry', x:44,  y:206, w:236, h:128, tag:'action', t:'the entry voice', s:'coaches HOW to work' },
            { id:'pa-draw',  x:356, y:104, w:286, h:150, tag:'object', t:'thresholds drawn', fields:[
                { k:'familya_target:', v:'∈ {1,2,3}', state:'ok' },
                { k:'familyb_target:', v:'∈ {3,5,7}', state:'ok' },
                '—',
                { v:'stored on the phase entry', state:'grow' },
                { v:'re-read by the exit gate', state:'grow' }
            ] },
            { id:'pa-work',  x:728, y:206, w:208, h:128, tag:'phase',  t:'do the phase\'s work', s:'mostly via subagents' }
        ],
        edges: [
            { from:'pa-entry', to:'pa-draw', kind:'soft', label:'rolls its difficulty' },
            { from:'pa-entry', to:'pa-work', kind:'soft', label:'coaches' },
            { from:'pa-draw',  to:'pa-work', kind:'soft', label:'saved for the exit' }
        ],
        stickies: [
            { x:330, y:36, aha:true, text:'Entry has <b>no required act</b> — no value to set, no gate to pass. The friction is all at the <b>exit</b>.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · entry coached, exit gated', blurb:'Phase entry coaches scope-thinking with no checked step; the friction sits at the exit (the three-family gate + shape + custom gates).' } },
            { x:700, y:36, text:'This gate guards every forward hop in the cycle.',
              ref: { kind: 'deck', url: 'phasic-cycle.html', section: 'The Full OPEVC Cycle', blurb: 'See the five-phase cycle this exit gate governs.' } }
        ],
        navHints: { down: 'detail: where the thresholds come from' }
    },

    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'Inside a phase · step 2',
        title: 'Doing the work — paced by the min-max gate',
        sub: 'What you\'re looking at: the operational half of the phase. Subagents do most of the work, and a second rhythm — the min-max gate — paces it from inside, INDEPENDENTLY of the advance gate you\'ll meet next.',
        boxes: [
            { id:'pa-subagents', x:44,  y:206, w:208, h:128, tag:'action',  t:'operational subagents', s:'80 / 20 — delegate' },
            { id:'pa-min',   x:320, y:104, w:300, h:96,  tag:'gate',    t:'min · earn each synthesis', s:'look before you conclude' },
            { id:'pa-max',   x:320, y:240, w:300, h:96,  tag:'gate',    t:'max · synthesise before more', s:'a class ceiling locks tools' },
            { id:'pa-reset', x:688, y:170, w:248, h:128, tag:'context', t:'a CLAUDE.md update', s:'resets ALL class counters' }
        ],
        edges: [
            { from:'pa-subagents', to:'pa-min', kind:'soft', label:'min side' },
            { from:'pa-subagents', to:'pa-max', kind:'soft', label:'max side' },
            { from:'pa-max',   to:'pa-reset', kind:'hard', label:'write to clear' },
            { from:'pa-reset', to:'pa-min',   kind:'soft', label:'counters zeroed' }
        ],
        stickies: [
            { x:300, y:34, aha:true, text:'The min-max gate paces work <b>inside</b> the phase — per-activity-class counts, one reset. It is <b>separate</b> from the advance gate.',
              ref: { url:'../06_8-inverse-multiplier.html', section:'Blog 6.8 · the rhythm of work', blurb:'The count-based min-max gate paces each phase (per-activity-class counters, one reset event); the three-family exit gate is the advance condition.' } }
        ],
        navHints: { down: 'detail: the min-max rhythm up close' }
    },

    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'Inside a phase · step 3',
        title: 'The advance boundary — a mindset shift',
        sub: 'What you\'re looking at: the moment the seed tries to leave. The same phase that had an entry voice now gets an EXIT voice — flipping it from "do the work" to "examine your own cognition."',
        boxes: [
            { id:'pa-try',       x:44,  y:200, w:228, h:120, tag:'action', t:'phase-commit --force', s:'the only forward door' },
            { id:'pa-exitvoice', x:360, y:200, w:268, h:120, tag:'action', t:'the exit voice', s:'stop doing · start reflecting' },
            { id:'pa-gate-ahead',x:716, y:200, w:220, h:120, tag:'gate',   t:'three-family exit gate', s:'the advance condition' }
        ],
        edges: [
            { from:'pa-try',       to:'pa-exitvoice',  kind:'soft', label:'gate not satisfied yet' },
            { from:'pa-exitvoice', to:'pa-gate-ahead', kind:'hard', label:'go satisfy it' }
        ],
        stickies: [
            { x:300, y:40, aha:true, text:'Same phase, <b>two voices</b>: entry = DO the work, exit = REFLECT on it. The exit voice is what accrues the compaction file, phase by phase.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · the per-phase accrue design', blurb:'Every OPEVC phase is an operational→metacognitive flow: the entry voice introduces operational subagents; the exit voice fires the metacog mindset-shift at the advance boundary.' } }
        ],
        navHints: { down: null }
    },

    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'Inside a phase · step 4',
        title: 'The three-family exit gate',
        sub: 'What you\'re looking at: the advance condition itself — three families of EVIDENCE that the phase reflected. (a) and (c) are hard; (b) is soft by default. Click each, or press ↓ for the CORE ops and the reflectors.',
        boxes: [
            { id:'pa-fa', x:44,  y:96,  w:300, h:96, tag:'gate',   t:'(a) reflection commands ran', s:'CORE ops + nuanced lenses · HARD' },
            { id:'pa-fb', x:44,  y:236, w:300, h:96, tag:'gate',   t:'(b) new marked notes added', s:'counted by diff · SOFT' },
            { id:'pa-fc', x:44,  y:376, w:300, h:96, tag:'gate',   t:'(c) a reflector ran', s:'≥1 available · HARD' },
            { id:'pa-verdict', x:560, y:236, w:376, h:96, tag:'object', t:'all required families YES → advance', s:'evidence, not a score' }
        ],
        edges: [
            { from:'pa-fa', to:'pa-verdict', kind:'hard', label:'ran ✓' },
            { from:'pa-fb', to:'pa-verdict', kind:'soft', label:'soft by default' },
            { from:'pa-fc', to:'pa-verdict', kind:'hard', label:'ran ✓' }
        ],
        stickies: [
            { x:372, y:392, aha:true, text:'Three <b>KINDS</b> of evidence the phase reflected — never a numeric score. No point total exists in the design.',
              ref: { url:'../06_8-inverse-multiplier.html', section:'Blog 6.8 · the three-family exit gate', blurb:'The per-phase advance condition: (a) reflection commands ran, (b) new marked notes added, (c) ≥1 available reflector ran. Variable minimums drawn per entry; no point system.' } }
        ],
        navHints: { down: 'detail: inside family-a — the CORE ops' }
    },

    '3,1': {
        kind: 'detail',
        eyebrow: 'Related · inside the three-family gate',
        title: 'Family-a — a constitutive floor + a regulated layer',
        sub: 'Family-a is two-tier. A hard FLOOR of CORE ops runs every phase, always. On top sits a REGULATED layer of deeper lenses — and the gate\'s variable minimum is of those. The floor is never counted toward it.',
        boxes: [
            { id:'pa-floor', x:44,  y:120, w:248, h:160, tag:'gate',   t:'the constitutive floor', s:'2 CORE ops · every phase' },
            { id:'pa-core1', x:344, y:108, w:300, h:84,  tag:'action', t:'CORE 1 · quality self-assessment', s:'→ compaction file' },
            { id:'pa-core2', x:344, y:212, w:300, h:84,  tag:'action', t:'CORE 2 · voice-update scan', s:'→ emits [VOICE-UPDATE]' },
            { id:'pa-nuanced', x:692, y:120, w:244, h:160, tag:'gate', t:'the regulated layer', s:'nuanced lenses · drawn {1,2,3}' }
        ],
        edges: [
            { from:'pa-floor', to:'pa-core1', kind:'hard', label:'op 1' },
            { from:'pa-floor', to:'pa-core2', kind:'hard', label:'op 2' },
            { from:'pa-floor', to:'pa-nuanced', kind:'soft', label:'+ a drawn minimum' }
        ],
        stickies: [
            { x:330, y:34, aha:true, text:'Floor + layer, kept separate: the CORE ops never skip (robust); the nuanced layer is the tunable, extensible knob (evolvable).',
              ref: { url:'../06_8-inverse-multiplier.html', section:'Blog 6.8 · metacognition commands', blurb:'Two CORE ops run every phase (constitutive baseline); on top, NUANCED mental-model lenses are the tunable layer. Commands, not subagents — they need the live trace.' } }
        ],
        navHints: { down: 'the five reflectors (family-c)' }
    },

    '3,2': {
        kind: 'detail',
        eyebrow: 'Related · inside the three-family gate',
        title: 'The reflectors — one per phase (family-c)',
        sub: 'Family-c asks that ≥1 of the phase\'s AVAILABLE reflector subagents ran. Each phase ships one by default, each tuned to that phase\'s failure mode. The set is user-extensible — never one pinned name.',
        boxes: [
            { id:'pa-r-obs',    x:150, y:64,  w:684, h:60, tag:'action', t:'OBSERVE', s:'observe-blindspot-finder — what did we miss?' },
            { id:'pa-r-plan',   x:150, y:142, w:684, h:60, tag:'action', t:'PLAN', s:'plan-premortem — assume it failed, why?' },
            { id:'pa-r-exec',   x:150, y:220, w:684, h:60, tag:'action', t:'EXECUTE', s:'execute-drift-auditor — missing / extra / deviated?' },
            { id:'pa-r-verify', x:150, y:298, w:684, h:60, tag:'action', t:'VERIFY', s:'verify-meta-audit — what did verification miss?' },
            { id:'pa-r-cond',   x:150, y:376, w:684, h:60, tag:'action', t:'CONDENSE', s:'condense-promotion-scan — what to keep?' }
        ],
        edges: [],
        stickies: [
            { x:150, y:18, text:'Each phase\'s roster holds BOTH its operational subagents AND its reflector — one design, distinguished by role, not separate pools.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · the metacog reflector per phase', blurb:'OBSERVE blindspot-finder · PLAN premortem · EXECUTE drift-auditor · VERIFY meta-audit · CONDENSE promotion-scan — the family-c reflector each phase runs.' } }
        ],
        navHints: { up: 'back to family-a' }
    },

    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'Inside a phase · step 5',
        title: 'Pass → advance · miss → keep reflecting',
        sub: 'What you\'re looking at: both outcomes. Satisfy the gate and the phase advances — but only on TOP of the other commit gates. Miss a hard family and it blocks. And backward recovery is always free.',
        boxes: [
            { id:'pa-pass',     x:44,  y:96,  w:224, h:100, tag:'gate',   t:'gate satisfied', s:'(a) + (c) · (b) soft' },
            { id:'pa-advance',  x:316, y:96,  w:288, h:100, tag:'phase',  t:'forward advance', s:'→ next phase' },
            { id:'pa-rides',    x:652, y:96,  w:284, h:100, tag:'gate',   t:'+ shape · CLAUDE.md · msg-len', s:'an ADD, not a replace' },
            { id:'pa-blocked',  x:230, y:300, w:300, h:100, tag:'state',  t:'miss any hard family → blocked', s:'stay · fix the gap · retry' },
            { id:'pa-backward', x:600, y:300, w:336, h:100, tag:'action', t:'backward recovery is free', s:'no cognitive gates · clean git' }
        ],
        edges: [
            { from:'pa-pass',    to:'pa-advance', kind:'hard', label:'→' },
            { from:'pa-advance', to:'pa-rides',   kind:'soft', label:'rides on top of' },
            { from:'pa-pass',    to:'pa-blocked', kind:'soft', label:'or miss → blocked' },
            { from:'pa-blocked', to:'pa-backward',kind:'soft', label:'or recover' }
        ],
        stickies: [
            { x:300, y:36, aha:true, text:'The three-family gate <b>ADDS</b> to the other --force checks; it never replaces them. Forward is gated; <b>backward is free recovery</b>.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · forward gated, backward free', blurb:'Forward = a gated --force commit (shape + three-family gate + custom gates); backward recovery has no cognitive gates, only a clean git tree.' } }
        ],
        navHints: { down: null }
    },

    '5,0': {
        kind: 'seq', step: 6,
        eyebrow: 'Inside a phase · step 6',
        title: 'CONDENSE — the most-gated phase',
        sub: 'What you\'re looking at: the one phase that bends the gate. CONDENSE keeps families (a)+(c), adds its own 80% deflation gate, and runs family-b in REVERSE — because its job is to consume marked notes, not produce them.',
        boxes: [
            { id:'pa-cond-tf',      x:44,  y:128, w:288, h:120, tag:'gate',   t:'keeps (a) + (c)', s:'NOT gated on (b)' },
            { id:'pa-cond-defl',    x:372, y:128, w:240, h:120, tag:'gate',   t:'+ 80% deflation', s:'CONDENSE_DEF_THRESHOLD=80' },
            { id:'pa-cond-consume', x:652, y:128, w:284, h:120, tag:'action', t:'family-b in REVERSE', s:'the consumption gate' }
        ],
        edges: [
            { from:'pa-cond-tf',   to:'pa-cond-defl',    kind:'soft', label:'and' },
            { from:'pa-cond-defl', to:'pa-cond-consume', kind:'soft', label:'instead of (b)' }
        ],
        stickies: [
            { x:300, y:36, aha:true, text:'Every phase uses this gate. CONDENSE is the <b>most-gated</b>: reflection + 80% deflation, and it <b>consumes</b> marks rather than producing them.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · CONDENSE, the cognitive organ', blurb:'CONDENSE advances on the three-family gate (a+c) plus its own 80% deflation gate; its marker-side runs in the consumption direction (per-class subagent runs ≥ marked notes, every note terminal).' } },
            { x:700, y:36, text:'CONDENSE runs the same gate in the consume direction.',
              ref: { kind: 'deck', url: 'condense-waterfall.html', section: 'The CONDENSE Waterfall', blurb: 'CONDENSE\'s consumption-direction gate metabolizes the cycle\'s notes.' } }
        ],
        navHints: { down: 'CONDENSE-only extra gates' }
    },

    '0,1': {
        kind: 'detail',
        eyebrow: 'Inside a phase · step 1 detail',
        title: 'Entry coaches, exit gates',
        sub: 'What you\'re looking at: how the phase begins (coaching only) and where the friction lives (entirely at the exit). Phase entry has no required act — the gates are all at the advance boundary.',
        boxes: [
            { id:'en-voice',   x:64,  y:118, w:380, h:88, tag:'context', t:'entry voice',   s:'introduces the operational subagents' },
            { id:'en-noact',   x:64,  y:230, w:380, h:88, tag:'state',   t:'no required act', s:'depth forecasting is coaching, never checked' },
            { id:'en-friction',x:504, y:118, w:360, h:88, tag:'gate',    t:'friction sits at EXIT', s:'three-family + shape + custom gates' },
            { id:'en-floor',   x:504, y:230, w:360, h:88, tag:'context', t:'every gate is a FLOOR', s:'keep working past it whenever the work needs more' }
        ],
        edges: [
            { from:'en-voice',    to:'en-noact',    kind:'hard', label:'so' },
            { from:'en-noact',    to:'en-friction', kind:'soft', label:'instead' },
            { from:'en-friction', to:'en-floor',    kind:'hard', label:'and it is' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'Phase entry has no required act — the friction is all at the exit, and the exit gate is a <b>floor</b>, not a target.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · entry coached, exit gated', blurb:'The ENTRY voice coaches how to work; the EXIT voice fires when the advance is blocked and delivers a mindset shift. Entry has no required act; the gates live entirely at the advance boundary.' } }
        ],
        navHints: { up: 'back to step 1' }
    },

    '1,1': {
        kind: 'detail',
        eyebrow: 'Inside a phase · step 2 detail',
        title: 'The min-max gate, up close',
        sub: 'What you\'re looking at: the per-activity-class rhythm that paces intra-phase work. One reset event clears every class counter at once — the CLAUDE.md write IS the synthesis moment.',
        boxes: [
            { id:'mm-class',   x:380, y:118, w:200, h:88, tag:'object', t:'per activity class', s:'reads / agent / grep / glob / web / bash' },
            { id:'mm-min',     x:64,  y:230, w:270, h:88, tag:'gate',   t:'min side', s:'enough investigation behind each synthesis write' },
            { id:'mm-max',     x:600, y:230, w:270, h:88, tag:'gate',   t:'max side', s:'blocks investigative tools once ANY class hits its ceiling' },
            { id:'mm-reset',   x:380, y:340, w:200, h:88, tag:'action', t:'ONE reset event', s:'a CLAUDE.md update resets ALL class counters' },
            { id:'mm-content', x:64,  y:340, w:270, h:88, tag:'state',  t:'content never parsed', s:'counts only, not what you wrote' }
        ],
        edges: [
            { from:'mm-class',  to:'mm-min',     kind:'hard', label:'feeds' },
            { from:'mm-class',  to:'mm-max',     kind:'hard', label:'feeds' },
            { from:'mm-min',    to:'mm-reset',   kind:'soft', label:'satisfied by' },
            { from:'mm-max',    to:'mm-reset',   kind:'soft', label:'cleared by' },
            { from:'mm-reset',  to:'mm-content', kind:'hard', label:'by count' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'Per-class counters, ONE reset event — a single CLAUDE.md update resets every class at once; <b>content is never read</b>.',
              ref: { url:'../06_2-discipline-and-map.html', section:'Blog 6.2 · min-max gate', blurb:'Per-class counters, ONE reset event: a CLAUDE.md update resets ALL class counters at once (the write IS the synthesis moment; what it documents is coached, never content-parsed).' } }
        ],
        navHints: { up: 'back to step 2' }
    },

    '5,1': {
        kind: 'detail',
        eyebrow: 'Inside a phase · step 6 detail',
        title: 'CONDENSE\'s extra gates',
        sub: 'What you\'re looking at: the three gates unique to CONDENSE on top of the universal three-family gate. The marker gate runs in the consumption direction — CONDENSE metabolizes notes instead of creating them.',
        boxes: [
            { id:'cd-80',      x:64,  y:118, w:280, h:88, tag:'gate',  t:'80% deflation gate', s:'footers absorb up' },
            { id:'cd-consume', x:600, y:118, w:300, h:88, tag:'gate',  t:'consumption-direction marker gate', s:'per class, a subagent run per marked note' },
            { id:'cd-nofamb',  x:600, y:230, w:300, h:88, tag:'state', t:'family-b NOT required', s:'CONDENSE consumes marks, doesn\'t produce' },
            { id:'cd-seal',    x:64,  y:230, w:280, h:88, tag:'gate',  t:'seal-evidence gate', s:'compaction file last_finalized >= last_completed_at' }
        ],
        edges: [
            { from:'cd-consume', to:'cd-nofamb', kind:'soft', label:'so' },
            { from:'cd-80',      to:'cd-seal',   kind:'hard', label:'and' },
            { from:'cd-consume', to:'cd-seal',   kind:'hard', label:'and' }
        ],
        stickies: [
            { x:300, y:30, aha:true, text:'CONDENSE\'s marker gate runs in the <b>consumption direction</b> — it metabolizes notes instead of creating them.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · three-family exit gate', blurb:'CONDENSE is not gated on family-b (it consumes marks, not gated on creating them). Its marker-side gate runs in the CONSUMPTION direction: per marker class, a dedicated-subagent run per marked note. Additionally: 80% deflation gate + seal-evidence gate (last_finalized >= last_completed_at).' } }
        ],
        navHints: { up: 'back to step 6' }
    }
};
