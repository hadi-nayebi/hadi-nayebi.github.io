/* ============================================================================
 * condense-waterfall.cards.js — CONTENT for the "CONDENSE waterfall" deck.
 * Teaches: the seven operations are a CATALOG, not an execution order — the
 * three gated phases (ADDRESS → ARCHIVE → DEFLATE) set the order, and the
 * macro-order is hard-gated: preservation precedes removal.
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section), never line numbers, per
 * the glossary term-anatomy rule (Rule 20). Sources:
 *   .claude/plugins/phase_condense/scripts/condense-commit.sh (deflation +
 *     terminal-state + consumption + JOB-COMPLETE gates, lock-forward, --add-cycle),
 *   .../scripts/condense.sh (deflation-pct arm), .../scripts/session-log.sh (ARCHIVE),
 *   .../hooks/condense-dispatch-guard.sh + condense-run-exit-gate.sh + note-binding.sh
 *     (the two-sided marked-note gate), .../hooks/condense-guard.sh (removal-lock),
 *   .../agents/condense-{job-creator,voice-updater,agent-updater,knowledge-extractor,
 *     claude-md-mover}.md, .../hooks/voice.xml (entry + waterfall-step-1..7 voices),
 *   + .claude/context/opevc-condense.md (design ground truth).
 * The marked-note lifecycle (3-phase gated condense, terminal states, session-log,
 * shape-guard + run-exit, removal-lock) is BUILT in live code ("WAVE-4"), so it is
 * taught here as live — no honesty badge. (Spec still labels it Ship:design — a stale
 * flag flagged to the glossary owner; the code is built.)
 * ============================================================================ */
window.DECK_META = { page: 'condense-waterfall', seqLabel: 'preservation precedes removal' };

window.DECK_INFO = {
    /* ---- Card 1: catalog vs order ---- */
    'cw-catalog': {
        title: 'The seven operations — a catalog, not an order', tag: 'object',
        what: 'CONDENSE has seven named operations: footer-to-body absorb, cross-file migrate, and four marker-consumption steps, plus the session archive. The numbering catalogs them — it is NOT the order they run in.',
        why: 'Reading the numbers as a sequence is the classic mistake. Step 1 (absorb) does not run first; it runs near the end. The order is set by the three gated phases, not by the catalog index.',
        hood: 'The seven operations are coached by seven voices — <code>waterfall-step-1-footer-to-body</code> through <code>waterfall-step-7-session-archive</code> in <code>phase_condense/hooks/voice.xml</code>. Within a phase the step order is content-determined (voice-coached, not hard-gated); only the three-phase macro-order is enforced.'
    },
    'cw-address': {
        title: 'ADDRESS — every marked note to a terminal state', tag: 'phase',
        what: 'The first gated phase. It runs the four marker-consumption operations (catalog steps 3–6): each marked note left by the cycle is handed to its subagent and driven to a terminal state.',
        why: 'Notes are addressed before anything is preserved or deleted, so the snapshot that follows captures resolved work — not a half-processed footer.',
        hood: 'ADDRESS runs catalog steps 3–6 (the four <code>condense-*</code> consuming subagents). Its advance condition is the terminal-state gate in <code>condense-commit.sh</code> — every marked note must read <code>[RESOLVED:…]</code> or <code>[CARRIED:…]</code>.'
    },
    'cw-archive': {
        title: 'ARCHIVE — snapshot the footer (step 7, mid-sequence)', tag: 'phase',
        what: 'The middle gated phase. It captures the full cycle footer as a snapshot before any of it is shrunk or deleted.',
        why: 'This is the preservation step. Catalog step 7 is "last" by number but runs in the MIDDLE of the execution — after addressing, before deflating — because you cannot safely delete what you have not first backed up.',
        hood: 'ARCHIVE runs catalog step 7 via <code>session-log.sh</code>, which captures the footer into the run-aware job dir. Its precondition is the A→B gate: the footer is archived only after ADDRESS clears, so the snapshot is faithful.'
    },
    'cw-deflate': {
        title: 'DEFLATE — absorb, migrate, then delete', tag: 'phase',
        what: 'The last gated phase. It pulls durable findings up (footer-to-body), routes others sideways (cross-file), then deletes the spent footer — leaving a breadcrumb behind.',
        why: 'Deflation is what readies the working memory for the next cycle. It runs LAST because it is destructive — and the destruction is locked until the archive has preserved everything.',
        hood: 'DEFLATE runs catalog steps 1–2 (absorb + migrate) plus the final deletion. Footer removal is held by the removal-lock in <code>condense-guard.sh</code> until <code>session-log.sh</code> verifies the archive; then the ≥80% deflation gate must pass.'
    },
    /* ---- Card 2: ADDRESS ---- */
    'cw-notes': {
        title: 'marked notes in the footer', tag: 'object',
        what: 'During the cycle, the work phases jotted named notes into the working CLAUDE.md footer — flags that follow-up work needs a job, a voice needs tuning, a finding should become knowledge.',
        why: 'These notes are the raw material CONDENSE feeds on. Each one is a unit of deferred cognition the cycle chose not to act on in the moment.',
        hood: 'A marked note is <code>[NOTETYPE]{content}</code> — the braces are the parse delimiter (one regex reads every note). Notes live in the footer below the <code>---Ob---/---Pl---/---Ex---/---Ve---</code> anchors; only the seed (never a subagent) writes them.'
    },
    'cw-route': {
        title: 'four routed subagents — one class each', tag: 'action',
        what: 'Four of the five marker classes each have a dedicated consuming subagent. Each note is dispatched to the subagent that owns its class, one note per dispatch.',
        why: 'Specialization keeps each consumer focused: the job-creator explores before it creates, the knowledge-extractor verifies its own write. A note never gets handled by the wrong tool.',
        hood: '<code>[PENDING-JOB]</code> → <code>condense-job-creator</code>; <code>[VOICE-UPDATE]</code> → <code>condense-voice-updater</code>; <code>[AGENT-UPDATE]</code> → <code>condense-agent-updater</code>; <code>[KNOWLEDGE]</code> → <code>condense-knowledge-extractor</code> (all in <code>phase_condense/agents/</code>).'
    },
    'cw-consume': {
        title: 'the consumption gate — a run per note, per class', tag: 'gate',
        what: 'CONDENSE\'s exit cognition is consumption. So its gate runs the other way from the work phases: per marker class, it requires at least as many subagent runs as there are notes of that class in the cycle\'s footers.',
        why: 'The work phases gate on notes CREATED; CONDENSE creates none — it feeds. The gate confirms every note was actually engaged by its consumer, not silently skipped.',
        hood: 'The consumption gate in <code>condense-commit.sh</code> counts notes from a live scan of the altered CLAUDE.md list (<code>altered-snapshot</code> via <code>condense.sh</code>) and requires runs ≥ notes per class. A run is necessary but not sufficient — the terminal-state gate is the resolution half.'
    },
    'cw-terminal': {
        title: '[RESOLVED:] / [CARRIED:] — every note terminal', tag: 'object',
        what: 'A handled note is rewritten to one of two terminal states: RESOLVED (done, carrying a breadcrumb) or CARRIED (handed forward, with the carry-count bumped). No bare note may survive.',
        why: 'Terminal states make carry-over explicit and counted instead of silent. A note that genuinely cannot be finished this cycle is CARRIED — legitimate, but visible — rather than quietly left behind.',
        hood: 'The terminal-state advance gate in <code>condense-commit.sh</code> scans the footers and blocks the condense→idle advance while any note is non-terminal — it excludes lines beginning <code>^\\[(RESOLVED|CARRIED):</code> and fails if any <code>[PENDING-JOB|VOICE-UPDATE|AGENT-UPDATE|KNOWLEDGE|DRAFT-TERM]</code> remains.'
    },
    /* ---- Card 1,1 detail: the five markers ---- */
    'cw-m-pj': {
        title: '[PENDING-JOB] → condense-job-creator', tag: 'object',
        what: 'A note flagging that follow-up work needs its own job. The job-creator explores each one before creating anything.',
        why: 'Exploration at the creation boundary is WHY the job system has no discard verb — a job that should be discarded is never born. Valid? a mistake? already covered by a repeating job? Only survivors become jobs.',
        hood: '<code>condense-job-creator</code> consumes <code>[PENDING-JOB]</code> notes via <code>job.sh create</code> after exploring each; resolves to <code>[RESOLVED:PENDING-JOB]{breadcrumb}</code>.'
    },
    'cw-m-vu': {
        title: '[VOICE-UPDATE] → condense-voice-updater', tag: 'object',
        what: 'A note that a coaching voice is worded poorly or missing. The voice-updater edits the relevant voice.xml.',
        why: 'It only touches EXISTING voice IDs — a brand-new ID would orphan (no callsite). New voices are born in a plugin-touching job, not here.',
        hood: '<code>condense-voice-updater</code> finds the right plugin\'s <code>voice.xml</code>, edits the existing element, and resolves the note to <code>[RESOLVED:VOICE-UPDATE]</code>.'
    },
    'cw-m-au': {
        title: '[AGENT-UPDATE] → condense-agent-updater', tag: 'object',
        what: 'A note that a subagent definition should be tightened. The agent-updater edits the named .md definition.',
        why: 'Same pattern as voice-update, one layer up: the behavioral contract future cycles inherit gets refined from a lesson this cycle learned.',
        hood: '<code>condense-agent-updater</code> consumes <code>[AGENT-UPDATE]</code> notes and edits the named subagent\'s <code>.md</code> file in its plugin\'s <code>agents/</code> dir.'
    },
    'cw-m-kn': {
        title: '[KNOWLEDGE] → condense-knowledge-extractor', tag: 'object',
        what: 'A note flagging a finding worth promoting to long-term memory. The extractor writes a new file under the knowledge directory — and re-reads it to confirm the write landed.',
        why: 'The re-read is hardening from a real failure: consumers once reported success while silently blocked, and stale notes piled up. Now the subagent must see its own work on disk before reporting done.',
        hood: '<code>condense-knowledge-extractor</code> writes into <code>.claude/knowledge/&lt;topic&gt;/</code>; its M3/M4 evidence-bind modes require a post-Write Read (byte count + headings) — <code>verified_via_read: true</code> is load-bearing for acceptance.'
    },
    'cw-m-de': {
        title: '[DURABLE] / [EPHEMERAL] — bare tags, gate-exempt', tag: 'state',
        what: 'The fifth class is a pair of bare durability tags. They carry no braces, no consuming subagent, and never need a terminal rewrite.',
        why: 'They are routing hints, not work items. A paragraph tagged durable is absorbed up by default; one tagged ephemeral is dropped. The gate skips them entirely.',
        hood: 'In the deflate step, the footer-to-body absorption respects <code>[DURABLE]</code>/<code>[EPHEMERAL]</code> as routing bias (default: infer). They are exempt from the terminal-state gate — bare tags consumed by their effect, not by a subagent.'
    },
    /* ---- Card 3: the note lifecycle (two-sided gate) ---- */
    'cw-sg': {
        title: 'dispatch shape-guard — quote the live note', tag: 'gate',
        what: 'A note-consuming subagent cannot be dispatched unless its prompt quotes the exact live footer note, verbatim — and exactly one note per dispatch.',
        why: 'It proves the subagent is working a real, specific note, not a vague batch. The old "work the whole batch" mode is superseded: one grounded dispatch per note, so every resolution traces to a quoted note.',
        hood: '<code>condense-dispatch-guard.sh</code> (PreToolUse:Agent) blocks the dispatch unless the prompt contains an exact live-footer substring; on match it binds that note line to the agent via <code>note-binding.sh</code>. Missing the note → BLOCKED and reoriented.'
    },
    'cw-sub': {
        title: 'the consuming subagent — works ONE note', tag: 'action',
        what: 'The dispatched subagent reads its single bound note and decides what to do with it: resolve it itself, or hand it back to the seed.',
        why: 'Giving the subagent the choice keeps quality judgments (is this really a job? is this knowledge a duplicate?) where the context is richest, while the seed keeps final authority over hand-backs.',
        hood: 'One of the four <code>condense-*</code> consumers, bound to its note by <code>note-binding.sh</code>. It writes the CLAUDE.md footer note it was dispatched on (operational subagents are otherwise blocked from CLAUDE.md edits).'
    },
    'cw-rh': {
        title: 'resolve · or hand back', tag: 'action',
        what: 'Two outcomes. The subagent either writes [RESOLVED:] with a breadcrumb, or hands the note back to the seed for a decision it should not make alone.',
        why: 'Resolution is the common path; hand-back is the escape hatch for the genuinely ambiguous. The seed then resolves every handed-back note, or CARRIES the few it truly cannot.',
        hood: 'Resolve → <code>[RESOLVED:NOTETYPE]{breadcrumb}</code>. Hand back → the note kept non-terminal with a second brace appended: <code>[NOTETYPE]{content}{handback}</code> — changed enough to pass the run-exit check, yet still blocking the advance gate.'
    },
    'cw-hb': {
        title: 'the hand-back form — non-terminal, still blocking', tag: 'object',
        what: 'A handed-back note keeps its original prefix (not RESOLVED/CARRIED) plus an appended context brace. That is exactly how the seed FINDS handed-back notes: the non-terminal ones surviving after the subagents ran.',
        why: 'It is the defined intermediate state. Line-changed satisfies the run-exit gate; non-terminal keeps blocking the advance — so the seed must come back and finish it.',
        hood: '<code>[NOTETYPE]{content}{handback-context}</code> — prefix preserved, second brace appended. The terminal-state gate in <code>condense-commit.sh</code> still counts it as non-terminal and blocks the condense→idle advance until the seed resolves or carries it.'
    },
    'cw-rx': {
        title: 'run-exit gate — modify the note to finish', tag: 'gate',
        what: 'Symmetric to the entry guard: a note-consuming subagent\'s run cannot complete until its bound note line is modified — to a terminal or a hand-back form.',
        why: 'The two halves bracket every consumer: quote the live note to START, modify that same note to END. A dispatched subagent can never silently no-op on its note.',
        hood: '<code>condense-run-exit-gate.sh</code> (SubagentStop) confirms the bound note\'s line changed; an unmodified note blocks the run\'s completion and reorients the subagent.'
    },
    /* ---- Card 4: ARCHIVE ---- */
    'cw-af': {
        title: 'the addressed footer — all notes terminal', tag: 'context',
        what: 'By the time ARCHIVE runs, every marked note in the footer is terminal (RESOLVED or CARRIED). What remains is a faithful record of the cycle\'s resolved working memory.',
        why: 'Archiving an addressed footer means the snapshot preserves resolved decisions, not a half-processed mess — which is the whole point of doing ADDRESS first.',
        hood: 'The footer is everything after the first <code>---Ob/Pl/Ex/Ve---</code> anchor in each altered CLAUDE.md. The terminal-state gate has already cleared, so no bare <code>[NOTETYPE]{}</code> survives into the snapshot.'
    },
    'cw-ab': {
        title: 'A→B gate — archive only after ADDRESS', tag: 'gate',
        what: 'The ordering rule: the session-log command may only run once the addressing phase has cleared. Preserve a resolved footer, never a raw one.',
        why: 'It guarantees the snapshot is the faithful, addressed state — the preservation the deflate step is allowed to rely on before it deletes anything.',
        hood: 'The session-log capture\'s precondition is Phase-A-clear (every note terminal). This is the first half of the hard-gated macro-order consume→archive→deflate.'
    },
    'cw-sl': {
        title: 'session-log.sh — capture the full footer', tag: 'action',
        what: 'The archive operation. It captures the entire cycle footer as a snapshot — large by design, the per-cycle raw backup that lets the seed safely deflate.',
        why: 'It is the sibling of brain_guard\'s compaction seal: snapshot-before-destroy. Durable knowledge still goes UP to the body and knowledge dir in DEFLATE — the archive is the raw backup, not where durable knowledge is found.',
        hood: '<code>session-log.sh</code> captures the footer (everything after the first anchor) and writes it into the run-aware job dir; a <code>verify</code> subcommand confirms the snapshot is non-empty before deflation may proceed.'
    },
    'cw-snap': {
        title: 'session-log-<c>.md — the run-aware snapshot', tag: 'object',
        what: 'The snapshot file, written into the job\'s current-run directory and named by cycle. The body breadcrumbs point into it; the archive breadcrumbs point back out to where work landed.',
        why: 'Keeping it run-aware and per-cycle means every lap of a repeating job has its own raw backup — reachable later by breadcrumb without bloating the working memory.',
        hood: 'Path <code>.claude/jobs/&lt;job_id&gt;/run-&lt;r&gt;/session-log-&lt;c&gt;.md</code>. New archives belong here (the legacy <code>.claude/knowledge/session/</code> path is pre-relocation).'
    },
    /* ---- Card 5: DEFLATE ---- */
    'cw-absorb': {
        title: 'footer → body (step 1, same file)', tag: 'action',
        what: 'Durable findings in each touched CLAUDE.md footer are pulled UP into that same file\'s body. The footers are scratch; the body is durable.',
        why: 'This is where a sprawling working-memory footer collapses to a tight body section — the deflation can be sharp, a whole plugin\'s footer down to a few lines.',
        hood: 'Catalog step 1, coached by <code>waterfall-step-1-footer-to-body</code>. It honours the <code>[DURABLE]</code>/<code>[EPHEMERAL]</code> routing bias; enforcement is graduated (voice + a body-vs-footer tracker), not a hard gate.'
    },
    'cw-migrate': {
        title: 'cross-file migrate (step 2, sibling/parent)', tag: 'action',
        what: 'Content that belongs elsewhere is routed sideways or upward to the CLAUDE.md whose subject matter most naturally holds it — even two directories away.',
        why: 'A finding written where it happened often belongs somewhere else. Destination is content-determined, not priority-ordered: the right file is the one the subject fits, not the nearest one.',
        hood: 'Catalog step 2 via the <code>condense-claude-md-mover</code> subagent — a Read/Edit/Write agent that moves CLAUDE.md content to the most natural destination and rejects duplicates rather than adding noise.'
    },
    'cw-lock': {
        title: 'removal-lock — unlocks only after archive', tag: 'gate',
        what: 'Footer deletion is blocked until the session-log archive is captured and verified. You cannot shrink the footer before it is preserved.',
        why: 'This is the hard guarantee behind "preservation precedes removal." It is what makes the whole waterfall safe to be destructive at the end.',
        hood: 'The removal-lock in <code>condense-guard.sh</code> blocks any net-negative CLAUDE.md edit (a removal) unless the new text carries <code>[RESOLVED:</code>/<code>[CARRIED:</code>; the lock only unlocks in DEFLATE after <code>session-log.sh verify</code> passes.'
    },
    'cw-defl': {
        title: '≥80% deflation — the size gate', tag: 'gate',
        what: 'The footer must absorb at least 80% of its content before the phase can advance — leaving ~20% headroom for what must persist into the next cycle.',
        why: 'A single, uniform target across every job stage. It forces prioritization: only the most valuable working memory survives into the next lap.',
        hood: '<code>CONDENSE_DEF_THRESHOLD=80</code> in <code>phase_condense/config.conf</code> (no stage branch); the percentage is computed in <code>condense-commit.sh</code> (words-to-absorb vs words-absorbed) and exposed by <code>condense.sh</code>\'s <code>deflation-pct</code> arm.'
    },
    'cw-crumb': {
        title: 'breadcrumb left behind', tag: 'object',
        what: 'After the footer deflates, the body keeps a short forward-reference breadcrumb a later job\'s OBSERVE can follow to build on past experience.',
        why: 'It is how the brain stays connected across cycles without carrying the bulk: the durable findings absorb up, the raw footer is archived, and a thin pointer survives to lead a future lap back to either.',
        hood: 'Durable breadcrumbs absorb UP to the body (~1 per worked section); the footer is left with the single session-log pointer. A later OBSERVE recalls them — the trace-link out of the deflated cycle.'
    },
    /* ---- Card 4,1 detail: the 7-op catalog ---- */
    'cw-op1': { title: '1 · footer → body absorb', tag: 'action', what: 'Pull durable findings up into the same file\'s body.', why: 'Runs in DEFLATE — near the END, not first, despite the index.', hood: 'Coached by <code>waterfall-step-1-footer-to-body</code>. Executes in the DEFLATE phase.' },
    'cw-op2': { title: '2 · cross-file migrate', tag: 'action', what: 'Route content to the sibling/parent CLAUDE.md it belongs in.', why: 'Also DEFLATE — destination is content-determined.', hood: '<code>condense-claude-md-mover</code> subagent. Executes in the DEFLATE phase.' },
    'cw-op3': { title: '3 · pending-job notes', tag: 'action', what: 'Turn [PENDING-JOB] notes into jobs, after exploring each.', why: 'ADDRESS — runs FIRST in execution order.', hood: '<code>condense-job-creator</code>. Executes in the ADDRESS phase.' },
    'cw-op4': { title: '4 · voice-update notes', tag: 'action', what: 'Edit existing voice.xml IDs from [VOICE-UPDATE] notes.', why: 'ADDRESS.', hood: '<code>condense-voice-updater</code>. Executes in the ADDRESS phase.' },
    'cw-op5': { title: '5 · agent-update notes', tag: 'action', what: 'Edit named subagent definitions from [AGENT-UPDATE] notes.', why: 'ADDRESS.', hood: '<code>condense-agent-updater</code>. Executes in the ADDRESS phase.' },
    'cw-op6': { title: '6 · knowledge routing', tag: 'action', what: 'Promote [KNOWLEDGE] notes into the knowledge dir, verified by re-read.', why: 'ADDRESS.', hood: '<code>condense-knowledge-extractor</code>. Executes in the ADDRESS phase.' },
    'cw-op7': { title: '7 · session archive', tag: 'action', what: 'Snapshot the full footer before any deletion.', why: 'ARCHIVE — runs in the MIDDLE, between addressing and deflating.', hood: '<code>session-log.sh</code>. Executes in the ARCHIVE phase.' },
    /* ---- Card 6: lock-forward exit ---- */
    'cw-force': {
        title: 'condense-commit --force — the closing commit', tag: 'action',
        what: 'The cycle\'s closing commit. Once its gates pass, it advances the phase out of CONDENSE.',
        why: 'It is the single exit from the learning phase — the commit that hosts every CONDENSE gate and, on success, the advance to idle.',
        hood: '<code>condense-commit.sh --force</code> runs the advance after the terminal-state, consumption, archive-verify, and ≥80% deflation gates pass.'
    },
    'cw-noback': {
        title: 'no backward edge — --backward rejected', tag: 'gate',
        what: 'CONDENSE has no backward transition. Unlike every other phase, you cannot roll it back.',
        why: 'A metabolism organ that could be rolled back would just be an editing pass. CONDENSE forces the cycles to churn forward — leftover work opens a new cycle, never a step back.',
        hood: '<code>condense-commit.sh</code> rejects <code>--backward</code> ("condense is lock-forward only"). Its only exit is forward to idle.'
    },
    'cw-idle': {
        title: 'advance → idle', tag: 'phase',
        what: 'The job moves out of CONDENSE back to idle, the lap structurally over. idle only flows forward to OBSERVE, so a returning job starts a fresh lap.',
        why: 'Closing into idle (not straight into the next phase) is what keeps cycle counting honest and gives next-job-selection a clean hinge.',
        hood: '<code>condense-commit.sh</code>\'s advance step calls <code>phase.sh --hook advance</code>; the focus clears only at the LAST condense→idle advance after job completion (intermediate cycles keep the focus).'
    },
    'cw-addcycle': {
        title: '--add-cycle — the safety valve', tag: 'action',
        what: 'If work genuinely remains, CONDENSE opens a new cycle instead of stepping back. It is a safety valve, not a planned route — leftover work should have been caught by VERIFY.',
        why: 'Forward-only churn with an escape hatch: the seed never rolls back, but it is never stuck either. Late extensions get absorbed into the plan so the job converges over runs.',
        hood: '<code>condense-commit.sh --add-cycle "&lt;text&gt;"</code> is a forward-advance variant that appends the next-objective text to <code>extension_contexts[]</code> (+1 cycle).'
    },
    'cw-jc2': {
        title: '[JOB-COMPLETE] — when eligible', tag: 'gate',
        what: 'At the final CONDENSE, if the job is eligible, the seed asks the user to approve completion. Eligibility depends on the job\'s stage and cycle count.',
        why: 'Completion is a user decision asked only from inside the closing phase — never improvised mid-work. If outstanding work remains, the seed self-corrects with --add-cycle instead.',
        hood: 'The <code>[JOB-COMPLETE]</code> eligibility check in <code>condense-commit.sh</code> fires when <code>plan_file==false</code> (Stage 1) or the cycle-count formula is met (Stage 2/3) and the Outstanding-Items section is empty.'
    }
};

window.DECK_CARDS = {
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'CONDENSE waterfall · step 1',
        title: 'A catalog of seven — ordered by three phases',
        sub: 'What you\'re looking at: why the seven operations are NOT a sequence — the three gated phases set the real order.',
        boxes: [
            { id:'cw-address', x:300, y:120, w:192, h:100, tag:'phase', t:'ADDRESS', s:'notes → terminal state' },
            { id:'cw-archive', x:528, y:120, w:192, h:100, tag:'phase', t:'ARCHIVE', s:'snapshot the footer' },
            { id:'cw-deflate', x:756, y:120, w:184, h:100, tag:'phase', t:'DEFLATE', s:'absorb + delete' },
            { id:'cw-catalog', x:330, y:328, w:330, h:112, tag:'object', t:'the 7 operations', s:'a catalog, not an order' }
        ],
        edges: [
            { from:'cw-catalog', to:'cw-address', kind:'soft', label:'phases draw from it' },
            { from:'cw-address', to:'cw-archive', kind:'hard', label:'then' },
            { from:'cw-archive', to:'cw-deflate', kind:'hard', label:'then' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'The seven operations are a <b>catalog</b>; the three gated phases set the order. <b>Preservation precedes removal.</b>',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · the three gated phases', blurb:'06_7 teaches ADDRESS→ARCHIVE→DEFLATE as the execution order over the 7-op catalog. This deck draws the macro-order and its gates.' } }
        ],
        navHints: { right: 'ADDRESS — the notes' }
    },
    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'CONDENSE waterfall · step 2',
        title: 'ADDRESS — every marked note to a terminal state',
        sub: 'What you\'re looking at: the cycle\'s notes routed to their subagents, gated until each one is resolved or carried.',
        boxes: [
            { id:'cw-notes', x:44, y:196, w:196, h:116, tag:'object', t:'marked notes', s:'left in the footer' },
            { id:'cw-route', x:312, y:120, w:300, h:96, tag:'action', t:'four routed subagents', s:'one class each' },
            { id:'cw-consume', x:312, y:300, w:300, h:96, tag:'gate', t:'consumption gate', s:'a run per note, per class' },
            { id:'cw-terminal', x:684, y:196, w:236, h:116, tag:'object', t:'[RESOLVED:] / [CARRIED:]', s:'every note terminal' }
        ],
        edges: [
            { from:'cw-notes', to:'cw-route', kind:'hard', label:'one per dispatch' },
            { from:'cw-route', to:'cw-consume', kind:'hard', label:'counted' },
            { from:'cw-consume', to:'cw-terminal', kind:'hard', label:'until terminal' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'CONDENSE\'s gate runs in the <b>consumption</b> direction — the work phases gate on notes <b>created</b>; CONDENSE gates on notes <b>fed</b>.' }
        ],
        navHints: { down: 'the five markers', right: 'the note\'s lifecycle' }
    },
    '1,1': {
        kind: 'detail',
        eyebrow: 'CONDENSE waterfall · ADDRESS detail',
        title: 'The five markers',
        sub: 'What you\'re looking at: four named notes that route to four subagents, plus the two bare durability tags.',
        boxes: [
            { id:'cw-m-pj', x:64, y:118, w:380, h:80, tag:'object', t:'[PENDING-JOB]', s:'→ condense-job-creator' },
            { id:'cw-m-vu', x:64, y:212, w:380, h:80, tag:'object', t:'[VOICE-UPDATE]', s:'→ condense-voice-updater' },
            { id:'cw-m-au', x:516, y:118, w:404, h:80, tag:'object', t:'[AGENT-UPDATE]', s:'→ condense-agent-updater' },
            { id:'cw-m-kn', x:516, y:212, w:404, h:80, tag:'object', t:'[KNOWLEDGE]', s:'→ condense-knowledge-extractor' },
            { id:'cw-m-de', x:240, y:336, w:500, h:88, tag:'state', t:'[DURABLE] / [EPHEMERAL]', s:'bare tags · gate-exempt' }
        ],
        edges: [],
        stickies: [
            { x:300, y:30, text:'Four named notes route to four subagents. The two bare durability tags are consumed by their <b>routing bias</b> in DEFLATE — no subagent, no terminal rewrite.' }
        ],
        navHints: { up: 'back to ADDRESS' }
    },
    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'CONDENSE waterfall · step 3',
        title: 'The note lifecycle — quote in, modify out',
        sub: 'What you\'re looking at: the two-sided gate that brackets every note-consuming subagent.',
        boxes: [
            { id:'cw-sg', x:44, y:200, w:190, h:104, tag:'gate', t:'dispatch shape-guard', s:'quote the live note' },
            { id:'cw-sub', x:288, y:200, w:190, h:104, tag:'action', t:'the consuming subagent', s:'works ONE note' },
            { id:'cw-rh', x:532, y:118, w:230, h:90, tag:'action', t:'resolve · or hand back', s:'the subagent decides' },
            { id:'cw-hb', x:532, y:300, w:230, h:90, tag:'object', t:'hand-back form', s:'non-terminal, still blocks' },
            { id:'cw-rx', x:800, y:200, w:140, h:104, tag:'gate', t:'run-exit gate', s:'modify the note to finish' }
        ],
        edges: [
            { from:'cw-sg', to:'cw-sub', kind:'hard', label:'one note' },
            { from:'cw-sub', to:'cw-rh', kind:'hard', label:'decides' },
            { from:'cw-rh', to:'cw-rx', kind:'hard', label:'resolve →' },
            { from:'cw-rh', to:'cw-hb', kind:'soft', label:'or hand back' },
            { from:'cw-hb', to:'cw-rx', kind:'soft', label:'line changed' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'<b>Quote the live note to START, modify that same note to END</b> — a dispatched subagent can never silently no-op on its note.' }
        ],
        navHints: { left: 'back to ADDRESS', right: 'ARCHIVE — snapshot first' }
    },
    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'CONDENSE waterfall · step 4',
        title: 'ARCHIVE — snapshot before you shrink',
        sub: 'What you\'re looking at: the preservation step that runs in the MIDDLE, so deflation has something safe to delete from.',
        boxes: [
            { id:'cw-af', x:44, y:200, w:200, h:110, tag:'context', t:'the addressed footer', s:'all notes terminal' },
            { id:'cw-ab', x:300, y:200, w:200, h:110, tag:'gate', t:'A→B gate', s:'archive after ADDRESS' },
            { id:'cw-sl', x:556, y:200, w:184, h:110, tag:'action', t:'session-log.sh', s:'capture the full footer' },
            { id:'cw-snap', x:792, y:200, w:148, h:110, tag:'object', t:'session-log-<c>.md', s:'run-aware job dir' }
        ],
        edges: [
            { from:'cw-af', to:'cw-ab', kind:'hard', label:'Phase A clear' },
            { from:'cw-ab', to:'cw-sl', kind:'hard', label:'then' },
            { from:'cw-sl', to:'cw-snap', kind:'hard', label:'writes' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'The archive is the per-cycle <b>raw backup</b> — NOT where durable knowledge is found. It is the preservation that lets the seed safely deflate.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · the session archive', blurb:'06_7 names the session archive as the per-cycle snapshot; durable knowledge goes UP to the body + knowledge dir, not here.' } }
        ],
        navHints: { left: 'the note lifecycle', right: 'DEFLATE — absorb + delete' }
    },
    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'CONDENSE waterfall · step 5',
        title: 'DEFLATE — absorb, migrate, then delete',
        sub: 'What you\'re looking at: the destructive step, locked until the archive verified, gated at ≥80%.',
        boxes: [
            { id:'cw-absorb', x:44, y:116, w:230, h:92, tag:'action', t:'footer → body', s:'step 1 · same file' },
            { id:'cw-migrate', x:44, y:240, w:230, h:92, tag:'action', t:'cross-file migrate', s:'step 2 · sibling/parent' },
            { id:'cw-lock', x:330, y:178, w:210, h:100, tag:'gate', t:'removal-lock', s:'unlocks after archive' },
            { id:'cw-defl', x:586, y:178, w:184, h:100, tag:'gate', t:'≥80% deflation', s:'CONDENSE_DEF_THRESHOLD' },
            { id:'cw-crumb', x:806, y:178, w:134, h:100, tag:'object', t:'breadcrumb', s:'a later OBSERVE follows it' }
        ],
        edges: [
            { from:'cw-absorb', to:'cw-lock', kind:'soft', label:'then delete' },
            { from:'cw-migrate', to:'cw-lock', kind:'soft', label:'' },
            { from:'cw-lock', to:'cw-defl', kind:'hard', label:'shrink' },
            { from:'cw-defl', to:'cw-crumb', kind:'soft', label:'leaves' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'Deletion is locked until the archive verifies — and <b>[CARRIED:] notes survive</b> into the next cycle\'s 20% headroom.' }
        ],
        navHints: { down: 'the 7 operations', left: 'ARCHIVE', right: 'the lock-forward exit' }
    },
    '4,1': {
        kind: 'detail',
        eyebrow: 'CONDENSE waterfall · DEFLATE detail',
        title: 'The seven operations (the catalog)',
        sub: 'What you\'re looking at: all seven named operations and which phase actually runs each — the numbering is not the order.',
        boxes: [
            { id:'cw-op1', x:56, y:108, w:404, h:60, tag:'action', t:'1 · footer → body', s:'DEFLATE' },
            { id:'cw-op2', x:56, y:180, w:404, h:60, tag:'action', t:'2 · cross-file migrate', s:'DEFLATE' },
            { id:'cw-op3', x:56, y:252, w:404, h:60, tag:'action', t:'3 · pending-job', s:'ADDRESS' },
            { id:'cw-op4', x:56, y:324, w:404, h:60, tag:'action', t:'4 · voice-update', s:'ADDRESS' },
            { id:'cw-op5', x:500, y:108, w:420, h:60, tag:'action', t:'5 · agent-update', s:'ADDRESS' },
            { id:'cw-op6', x:500, y:180, w:420, h:60, tag:'action', t:'6 · knowledge routing', s:'ADDRESS' },
            { id:'cw-op7', x:500, y:252, w:420, h:60, tag:'action', t:'7 · session archive', s:'ARCHIVE' }
        ],
        edges: [],
        stickies: [
            { x:500, y:340, text:'Catalog numbering &ne; execution order: steps <b>3–6 run first</b> (ADDRESS), step <b>7 next</b> (ARCHIVE), steps <b>1–2 last</b> (DEFLATE).' }
        ],
        navHints: { up: 'back to DEFLATE' }
    },
    '5,0': {
        kind: 'seq', step: 6,
        eyebrow: 'CONDENSE waterfall · step 6',
        title: 'Lock-forward — the only exit is onward',
        sub: 'What you\'re looking at: why CONDENSE never rolls back, and how leftover work opens a new lap instead.',
        boxes: [
            { id:'cw-force', x:44, y:198, w:210, h:110, tag:'action', t:'condense-commit --force', s:'the closing commit' },
            { id:'cw-noback', x:312, y:96, w:240, h:92, tag:'gate', t:'no backward edge', s:'--backward rejected' },
            { id:'cw-idle', x:312, y:300, w:240, h:92, tag:'phase', t:'advance → idle', s:'lock-forward' },
            { id:'cw-jc2', x:604, y:96, w:240, h:92, tag:'gate', t:'[JOB-COMPLETE]', s:'when eligible' },
            { id:'cw-addcycle', x:604, y:300, w:240, h:92, tag:'action', t:'--add-cycle', s:'safety valve · +1 cycle' }
        ],
        edges: [
            { from:'cw-force', to:'cw-noback', kind:'soft', label:'rejects' },
            { from:'cw-force', to:'cw-idle', kind:'hard', label:'advances' },
            { from:'cw-force', to:'cw-jc2', kind:'soft', label:'if eligible' },
            { from:'cw-idle', to:'cw-addcycle', kind:'soft', label:'work left?' }
        ],
        stickies: [
            { x:300, y:24, aha:true, text:'A metabolism organ that could roll back would just be an <b>editing pass</b>. CONDENSE forces the cycles to churn forward.',
              ref: { url:'../06_7-condense.html', section:'Blog 6.7 · lock-forward', blurb:'06_7 teaches CONDENSE as lock-forward — outstanding work opens a new cycle via --add-cycle, never a backward step.' } }
        ],
        navHints: { left: 'back to DEFLATE' }
    }
};
