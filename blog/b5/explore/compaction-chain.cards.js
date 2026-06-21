/* ============================================================================
 * compaction-chain.cards.js — CONTENT for the "How the Seed Compacts Itself" deck.
 * Teaches: brain_guard's compaction chain — the TWO parallel ramps (context-window
 * + compaction-file size) that share one ceiling, the per-job compaction FILE that
 * carries cognition (not work) across a /clear, the finalization SEAL, the
 * clear+inject session boundary, the wake reflex that re-grounds the fresh session,
 * and the two-tier Prior Summary chain that carries a job's cognition across an
 * unbounded number of sessions at fixed cost. Paired with the shared deck-engine.js
 * + deck-engine.css (b6/explore, referenced cross-dir). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section/field), never line numbers,
 * per the glossary term-anatomy rule (Rule 20). Config NUMBERS are pinned because
 * they are the retunable knobs the design teaches (and are verified live); rot-prone
 * counts (test totals, voice-element totals) are deliberately NOT pinned.
 * Sources (all own-grep verified):
 *   brain_guard/config.conf — TOKENS_PER_TIER=10000; SOFT/READ/CRITICAL_THRESHOLD_TIER
 *     =20/25/30; MAX_CONTEXT_TOKENS=1000000; POST_COMPACT_GRACE_SECONDS=300;
 *     THETA_LC=2000; THETA_LC_COACH_PCT=70 / _BLOCK_PCT=85 / _SEAL_PCT=80;
 *     TMUX_INSTRUCTION_MAX_BYTES=8192,
 *   brain_guard/hooks/context-sensor.sh (soft gate, fire-once-per-tier),
 *   brain_guard/hooks/context-gate.sh (hard gate, exit 2; grace bypass),
 *   brain_guard/scripts/compaction-io.sh — arms init / append-section / read /
 *     prior-summary / seal; _SECTIONS=("Forward State" "Open Threads"
 *     "Assumptions & Risks" "Process Insight" "Git Commit Messages" "Prior Summary"),
 *   brain_guard/scripts/self-compact.sh — _select_dispatch_mode / _dispatch_x11 /
 *     _dispatch_tmux,
 *   brain_guard/hooks/session-init.sh (source=startup|resume: clear-pin-wid,
 *     set-last-tier 0, derive pin_pane),
 *   brain_guard/hooks/compact-wake.sh (source=clear re-ground),
 *   brain_guard/scripts/brain_guard.sh (--hook get/set gateway; schema v6 .jobs map),
 *   + .claude/context/brain-memory.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'compaction-chain', seqLabel: 'the modern compact' };

window.DECK_INFO = {
    /* ---- Card 1: two ramps, one ceiling ---- */
    'ctx-window': {
        title: 'the context window', tag: 'state',
        what: 'The model’s finite conversation buffer. It fills every turn, and past a few hundred thousand tokens the seed’s reasoning quality starts to drop.',
        why: 'Chat is the one place the seed’s memory does NOT live by design — it is capped and lossy at compaction. Watching how full it is, and acting early, is the whole reason brain_guard exists.',
        hood: 'Measured by the shared <code>plugins/lib/context-helper/context-helper.sh</code> (<code>compute_context_size</code> reads the transcript’s last <code>.message.usage</code>). The 1M ceiling is <code>MAX_CONTEXT_TOKENS</code> in <code>config.conf</code> — display only; the gates compare tiers. Source: <code>brain-memory.md</code> · "context-helper.sh".'
    },
    'compaction-file': {
        title: 'the compaction file', tag: 'object',
        what: 'A per-job, per-session file that carries the COGNITION about a job across a clear — open threads, assumptions, loops it got stuck in, blind spots, plus a slice of top facts. Not the work itself.',
        why: 'It lets the next session resume THINKING, not just facts. It is a third memory surface separated by flavour: working memory holds the work, this holds how-the-work-is-going and what-must-survive-a-clear.',
        hood: 'Lives at <code>.claude/jobs/&lt;id&gt;/run-&lt;r&gt;/compaction-&lt;seq&gt;.md</code>; I/O via <code>compaction-io.sh</code> (<code>init</code> / <code>append-section</code> / <code>read</code> / <code>seal</code> arms). The one managed file CONDENSE never metabolizes. Source: <code>brain-memory.md</code> · "Compaction file".'
    },
    'ctx-ramp': {
        title: 'the context ramp', tag: 'context',
        what: 'A graduated escalation keyed on how full the context window is. As tokens climb, it tightens the seed’s grip on tools one step at a time rather than flipping one switch.',
        why: 'It fires WELL before Claude Code’s default 100% auto-compact — which is what lets the seed run unattended and compact on its own terms, instead of crashing into the wall at the worst moment.',
        hood: 'Two hooks: <code>context-sensor.sh</code> (soft, coaches) + <code>context-gate.sh</code> (hard, <code>exit 2</code>). Thresholds in <code>config.conf</code> as TIERS (<code>SOFT/READ/CRITICAL_THRESHOLD_TIER</code>). Walk into step 1. Source: <code>brain-memory.md</code> · "Progressive squeeze".'
    },
    'fs-ramp': {
        title: 'the file-size ramp (θ_lc)', tag: 'context',
        what: 'A second graduated escalation, parallel to the context ramp, keyed on the SIZE of the compaction file rather than the context window. It pushes the seed to seal-and-clear when its cognition file grows too large.',
        why: 'The cognition file can grow large even when the context window is not full. A separate trigger keeps that file legible independent of how full the model’s buffer happens to be.',
        hood: '<code>θ_lc</code> ("theta-lc") is the file’s word ceiling — <code>THETA_LC=2000</code> in <code>config.conf</code>, a knob. Bands <code>THETA_LC_COACH_PCT=70</code> / <code>_BLOCK_PCT=85</code> / 100% ceiling. Walk into the detail card. Source: <code>brain-memory.md</code> · "File-size ramp (θ_lc)".'
    },
    'ceiling-op': {
        title: 'one ceiling, one compact', tag: 'gate',
        what: 'Either ramp reaching its ceiling collapses the toolset to the same small set and fires the same modern compact. The two triggers share one operation.',
        why: 'Two independent danger signals — a full window OR a bloated cognition file — converge on one graceful exit, so there is no asymmetry between them and no second code path to keep in sync.',
        hood: 'At the ceiling the toolset collapses to { direct compaction-file edit, summary-append, the self-compact clear+inject command } — Agent/Task dispatch and the phase-exit metacog commands are blocked too. Source: <code>brain-memory.md</code> · "File-size ramp" ceiling clause.'
    },

    /* ---- Card 2: the context ramp (detail of three tiers) ---- */
    'ctx-tier': {
        title: 'the context tier', tag: 'state',
        what: 'The unit brain_guard reasons in: the token total floored into 10k buckets, so a milestone fires once per crossing instead of continuously.',
        why: 'Collapsing a large noisy token count into a small integer makes the threshold comparisons clean — and makes the whole system retunable by editing a handful of numbers.',
        hood: '<code>tier = floor(total_tokens / TOKENS_PER_TIER)</code>, <code>TOKENS_PER_TIER=10000</code> (<code>config.conf</code>); computed by <code>context_tier()</code> in <code>plugins/lib/context-helper/context-helper.sh</code>. 200k → tier 20. Source: <code>brain-memory.md</code> · "Context tier".'
    },
    'soft-gate': {
        title: 'soft gate — coach (tier 20)', tag: 'action',
        what: 'At 200k tokens the sensor injects one coaching voice per tier crossing, nudging the seed to prep a compact. It never blocks a tool.',
        why: 'A gentle early reminder, deduped to one voice per crossing, gives the seed room to finish cleanly and compact on its own before any tool is taken away.',
        hood: '<code>context-sensor.sh</code> (PreToolUse, always <code>exit 0</code>); fires above <code>SOFT_THRESHOLD_TIER=20</code>, deduped by the <code>last_seen_tier</code> high-water mark. Source: <code>brain-memory.md</code> · "Soft gate (context-sensor)".'
    },
    'hard-gate': {
        title: 'hard gate — block Read (tier 25)', tag: 'gate',
        what: 'At 250k tokens the gate blocks the Read tool — the context firehose — while leaving Edit, Write, and Bash free so the seed can finish its thought and commit.',
        why: 'Read is what pours new tokens in. Cutting it first stops the bleeding while still letting the seed wrap up the current work and reach a clean compact point.',
        hood: '<code>context-gate.sh</code> (PreToolUse, <code>exit 2</code> blocks); <code>READ_THRESHOLD_TIER=25</code> (<code>config.conf</code>). Matcher is <code>Read|Edit|Write|MultiEdit</code>; fail-safe-allow on a measurement failure. Source: <code>brain-memory.md</code> · "Graduated hard gate".'
    },
    'critical-gate': {
        title: 'critical — block writes (tier 30)', tag: 'gate',
        what: 'At 300k tokens the gate blocks Read, Edit, Write, and MultiEdit, leaving only shell calls and questions — the only safe moves left.',
        why: 'By now self-compaction is the only graceful exit. Removing the write tools makes that explicit: each tier removes one more capability until compacting is the obvious next act.',
        hood: 'Same <code>context-gate.sh</code>, critical-tier branch; <code>CRITICAL_THRESHOLD_TIER=30</code> (<code>config.conf</code>). The block message tells the seed to run <code>self-compact.sh</code>. Source: <code>brain-memory.md</code> · "Progressive squeeze" three tiers.'
    },
    'grace-bypass': {
        title: 'post-compact grace', tag: 'gate',
        what: 'A short window after a self-compact during which the hard gate stops itself from falsely blocking the first Read — because a clear does not rewrite the stale token reading.',
        why: 'A /clear shrinks the real context but the transcript’s last usage record still shows the old large value until the next turn writes a fresh one. Without the grace, the fresh session would block its own first Read.',
        hood: '<code>self-compact.sh</code> stamps <code>last_self_compact_at</code>; <code>context-gate.sh</code> reads it first and allows within <code>POST_COMPACT_GRACE_SECONDS=300</code> (<code>config.conf</code>). Source: <code>brain-memory.md</code> · "Post-compact grace bypass".'
    },

    /* ---- Card 3: the compaction file (detail) ---- */
    'run-dir': {
        title: 'the run-aware job directory', tag: 'object',
        what: 'Each job owns a directory, and each run of that job owns a sub-directory, where its compaction files for that run live in sequence.',
        why: 'Keying the file system by job-id and run means WHICH compaction file is live is simply whichever job is focused — no pointer to track, and unfocusing destroys nothing.',
        hood: 'Path <code>.claude/jobs/&lt;job_id&gt;/run-&lt;r&gt;/compaction-&lt;seq&gt;.md</code>; the per-job run/seq state lives in brain_guard’s schema-v6 <code>.jobs</code> map (<code>data.json</code>, gateway-only). Source: <code>brain-memory.md</code> · "brain_guard data.json (schema v6)".'
    },
    'focus-birth': {
        title: 'born at focus', tag: 'action',
        what: 'The directory and an empty template file are created the moment a job becomes focused — so a writable compaction file always exists before any phase runs.',
        why: 'Focusing a job is itself a session boundary. A job with an existing file gets it re-injected (reload); a job with no file yet gets a fresh template — a clean cognitive start per job, shedding the prior job’s residue.',
        hood: 'Created at focus via <code>compaction-io.sh init</code>; a lazy create-on-first-write remains only as a self-healing backstop. Idle-unfocused has no live file and needs none. Source: <code>brain-memory.md</code> · "Born at focus; built during phases".'
    },
    'phase-exit-write': {
        title: 'built at phase exits', tag: 'action',
        what: 'The file grows as each phase ends: the phase-exit metacognition commands append their reflections into its sections. It is never condensed away.',
        why: 'Its deeper purpose is to make the seed spend compute not just DOING the job but reflecting on how its instructing layer steered the work — so a later run can re-tune its own voices.',
        hood: 'Phase-exit metacog commands route notes via <code>compaction-io.sh append-section</code>. Held stable by the θ_lc ramp + a fixed-% Prior Summary, never by CONDENSE deflation. Source: <code>brain-memory.md</code> · "Compaction file" / "Compaction-file sections".'
    },
    'six-sections': {
        title: 'the six sections', tag: 'context',
        what: 'Five authored sections — Forward State, Open Threads, Assumptions and Risks, Process Insight, Prior Summary — plus one auto-fed section that absorbs every phase commit message verbatim.',
        why: 'A compartment that DEMANDS a structured shape forces the seed to produce cognition that fills it. The section names are customizable; the shape is the invariant.',
        hood: '<code>_SECTIONS</code> in <code>compaction-io.sh</code> = Forward State / Open Threads / Assumptions &amp; Risks / Process Insight / Git Commit Messages / Prior Summary. The auto-fed Git Commit Messages section is exempt from the no-empty-section seal gate. Source: <code>brain-memory.md</code> · "Compaction-file sections".'
    },
    'no-marked-notes': {
        title: 'no "marked notes" section', tag: 'context',
        what: 'There is deliberately no section for per-phase marked notes. Those stay in the working-memory footers where CONDENSE metabolizes them.',
        why: 'The compaction file carries only what must survive a clear. Marked notes have their own home and their own consumer — duplicating them here would blur the two surfaces.',
        hood: 'Marked notes (<code>[PENDING-JOB]</code>, <code>[VOICE-UPDATE]</code>, …) live in CLAUDE.md footers; CONDENSE consumes them. The compaction file holds cognition, not the note queue. Source: <code>brain-memory.md</code> · "Compaction-file sections" no-Marked-Notes clause.'
    },
    'six-sections-auto': {
        title: 'Git Commit Messages (auto-fed)', tag: 'state',
        what: 'The sixth section: every phase commit message is appended into it verbatim and automatically by the commit script — raw material the seal later metabolizes like everything else.',
        why: 'The commit message already carries a rich account of what changed and why. Absorbing it as source material means the file gets that cognition for free, and every commit becomes a metacognition-reminder moment.',
        hood: 'Auto-fed per-commit; the auto-fed section is EXEMPT from the no-empty-section seal gate (a from-scratch seal must not deadlock on it) and sits just before Prior Summary. Gmode commits are excluded. Source: <code>brain-memory.md</code> · "Compaction-file sections" sixth-section clause.'
    },

    /* ---- Card 4: the finalization seal ---- */
    'finalization': {
        title: 'the finalization pass', tag: 'action',
        what: 'An ordered, inspectable quality pass that seals the compaction file before the boundary: it dedups, folds, populates any empty section from the live session, polish-shrinks, then stamps and seals.',
        why: 'It guarantees the file is complete, deduplicated, and small enough before the clear — so whatever comes next inherits clean cognition. It is a quality gate, not a summarizer; it invents nothing new.',
        hood: 'Runs inside <code>compaction-io.sh seal</code>: dedup/fold → populate-or-fold each section → organize → bump <code>version</code>, stamp <code>last_finalized</code> / <code>phase_at_seal</code>, write Prior Summary. Source: <code>brain-memory.md</code> · "Finalization pass".'
    },
    'populate': {
        title: 'populate ≡ polish', tag: 'action',
        what: 'For each section: if a phase exit already wrote it, fold and polish it; if it is empty, fill it from the current session’s cognition. The pass can write the whole file from scratch out of live context.',
        why: 'A ceiling can hit mid-phase, before any phase exit wrote anything. The populate step means the file is never injected empty — even an early-in-phase compact is fully covered.',
        hood: 'The still-allowed { compaction-file edit, summary-append } toolset fills empty sections. No empty section can pass the seal — it hard-blocks, naming each empty section with populate instructions. Source: <code>brain-memory.md</code> · "Finalization pass" ordered steps.'
    },
    'polish-shrink': {
        title: 'fold below the band', tag: 'gate',
        what: 'The seal aims to fold the body below a soft target, and FAILS only if the body lands at or above the higher block band. A sealed file is therefore never born inside the band that would block the next session’s first Read.',
        why: 'This is the deadlock fix: a file sealed inside the block band would strand the fresh session — unable to Read the file and unable to run the seal. Sealing below the band guarantees the next session can always Read.',
        hood: 'Seal target <code>THETA_LC_SEAL_PCT=80</code> (soft fold aim) sits strictly below block band <code>THETA_LC_BLOCK_PCT=85</code> (the FAIL boundary); a below-band file passes (waived / met / above-margin-safe). All <code>config.conf</code>. Source: <code>brain-memory.md</code> · "Finalization pass" below-band clause.'
    },
    'seal-stamp': {
        title: 'the seal stamp', tag: 'state',
        what: 'Sealing bumps the file version and records when it was sealed and which phase it was sealed in — the evidence that the quality pass actually ran.',
        why: 'Downstream gates read these stamps off disk, not the session. A completed job’s advance even requires the seal stamp to be later than the completion time — proof the wrap ran.',
        hood: 'Front-matter keys <code>version</code> (bump), <code>last_finalized</code> (stamp), <code>phase_at_seal</code> (stamp), written by <code>compaction-io.sh seal</code>; Prior Summary is validated non-empty before the stamp lands. Source: <code>brain-memory.md</code> · "Finalization pass".'
    },

    /* ---- Card 4-detail: two triggers, one seal ---- */
    'trig-ceiling': {
        title: 'trigger A — a ramp ceiling', tag: 'action',
        what: 'Either ramp hitting its ceiling is a session boundary that can fall anywhere. It seals whatever job is focused and then clears.',
        why: 'The ceiling is orthogonal to job boundaries — it cannot be scheduled. The seal handles it the same way regardless of where in the work it lands.',
        hood: 'Context ramp (<code>context-gate.sh</code> critical tier) OR file-size ramp (θ_lc 100%) collapses the toolset; the seed itself issues the clear+inject. Source: <code>brain-memory.md</code> · "Finalization pass" trigger (a).'
    },
    'trig-wrap': {
        title: 'trigger B — the completion wrap', tag: 'action',
        what: 'When a job completes, a required self-compact fires the same seal between the approved completion and the final advance to idle — wrapping the finished job’s cognition into its run directory.',
        why: 'A job must never end with an unsealed compaction file. The wrap guarantees the finished job’s cognition is captured before the seed moves on.',
        hood: 'Between approved <code>[JOB-COMPLETE]</code> and the condense→idle advance; the advance requires seal evidence (<code>last_finalized</code> after the completion timestamp). Source: <code>brain-memory.md</code> · "Finalization pass" trigger (b) the wrap.'
    },
    'wrap-note': {
        title: 'inject only the transition note', tag: 'context',
        what: 'After a completion wrap the boundary clears and injects only the sealed file’s Prior Summary as a transition note — never the full old file, never a fresh template.',
        why: 'The next job is not focused yet, so there is no compaction file to inject — that file is created at the next job’s own focus. Only a short hand-off of what just finished crosses the boundary.',
        hood: 'The wrap’s clear+inject carries the sealed Prior Summary section only. The next job defines its file at ITS focus. Source: <code>brain-memory.md</code> · "Finalization pass" wrap + "Cross-job continuity injection".'
    },
    'one-seal': {
        title: 'one operation, two moments', tag: 'gate',
        what: 'The ceiling trigger and the completion trigger run the exact same sealing operation. If the ceiling fires inside the completion window, one stamp satisfies both.',
        why: 'A single seal operation with two trigger moments means there is no second code path — the same quality guarantees hold whether the seal was forced by size or by completion.',
        hood: 'Finalization is phase-indifferent — it seals whatever cognition the file holds and never checks the phase-advance three-family gate (a separate phase-exit event). Source: <code>brain-memory.md</code> · "Finalization pass" phase-indifferent clause.'
    },

    /* ---- Card 5: clear + inject ---- */
    'clear-inject': {
        title: 'clear + inject', tag: 'action',
        what: 'The session-boundary operation: end the saturated session and start a fresh one carrying exactly the sealed cognition — nothing more, nothing lost. The command is escape, then clear, then the new-session instruction plus the compaction file.',
        why: 'This is the seed’s one and only way to compact — it replaces native /compact entirely. The seed’s mind lives on disk, so the clear sheds only the conversation trace, not the cognition.',
        hood: 'Command: <code>esc + /clear + &lt;new-session instruction&gt; + &lt;compaction file&gt; + Enter</code>. Inject is state-keyed — SUPPRESSED in gmode (the gmode arc). Source: <code>brain-memory.md</code> · "Clear + inject".'
    },
    'dispatch-mode': {
        title: 'dual dispatch (X11 / tmux)', tag: 'object',
        what: 'Claude Code exposes no injection API, so self-compact types the clear+inject into the terminal — picking a tmux path or an X11 path by environment, behind one selector.',
        why: 'Matching the injection primitive to the environment, behind a single selector, keeps one mechanism working across setups. The keystroke layer is acknowledged hacky and retires the day a native API ships.',
        hood: '<code>_select_dispatch_mode()</code> in <code>self-compact.sh</code>: <code>$TMUX</code> → tmux (<code>paste-buffer -p</code> bracketed paste); else <code>$DISPLAY</code> + xdotool → x11; else none. <code>TMUX_INSTRUCTION_MAX_BYTES=8192</code> guards truncation. Source: <code>brain-memory.md</code> · "Dual dispatch modes".'
    },
    'window-pin': {
        title: 'window-pin (derive-don’t-pin)', tag: 'state',
        what: 'How self-compact authoritatively identifies the target terminal. In tmux the session’s own hook derives its pane automatically; only bare X11 needs a one-time human click.',
        why: 'Wherever the environment can tell the seed its own address, the seed derives it — zero ceremony. The human click exists only where the environment genuinely cannot distinguish one terminal from another.',
        hood: 'tmux: <code>session-init.sh</code> self-derives <code>pin_pane</code> via <code>tmux display-message -p</code>. X11: <code>window-pin.sh</code> uses <code>xdotool selectwindow</code> → <code>pin_wid</code>. Both via the <code>brain_guard.sh</code> gateway. Source: <code>brain-memory.md</code> · "Window-pin (pin_wid and pin_pane)".'
    },
    'ladder': {
        title: 'never-guess targeting', tag: 'gate',
        what: 'In X11 mode a seven-step ladder decides which window to fire into — and a stale or missing pin BLOCKS rather than firing blind into the wrong terminal.',
        why: 'Two early wrong-terminal fires hardened this into a never-guess invariant: the design prefers blocking and asking the user to re-pin over risking keystrokes in the wrong window.',
        hood: 'Strategies in <code>self-compact.sh</code>: env override → pinned WID (the everyday path) → single-match title search → PID-ancestry → <code>$WINDOWID</code> → getactivewindow → hard fail. Source: <code>brain-memory.md</code> · "7-strategy target-window resolution ladder".'
    },

    /* ---- Card 5-detail: the gmode arc ---- */
    'gm-entry': {
        title: 'gmode entry — seal the job', tag: 'action',
        what: 'When gmode is granted, the seed’s required first act is a modern compact. The context is still pure job context, so the seal captures the JOB cognition and stamps the paused phase.',
        why: 'Because the job is sealed at entry, a gmode detour that dies mid-way loses nothing of the job. The maintenance lane opens on a clean context carrying only the maintenance brief.',
        hood: 'Seal stamps <code>phase_at_seal</code> = the paused phase (<code>pre_gmode_phase</code>); the inject is SUPPRESSED, the clear-note carries the gmode mission instead. Source: <code>brain-memory.md</code> · "The gmode arc" ENTRY.'
    },
    'gm-suppress': {
        title: 'inject suppressed in gmode', tag: 'gate',
        what: 'The clear runs at gmode entry, but the inject is suppressed — gmode opens carrying the maintenance brief, not the job. This is the one place inject does not fire.',
        why: 'Maintenance work is not job cognition worth carrying in the structured file. Keeping the job out of the gmode lane keeps the lane uncluttered and the job crash-safe on disk.',
        hood: 'Inject is state-keyed off the phase; the clear-note leans into Blocker / Fix / Exit Criterion + the on-disk pointer to the sealed file (reading it is always allowed). Source: <code>brain-memory.md</code> · "Clear + inject" state-keyed clause.'
    },
    'gm-interior': {
        title: 'interior — the legacy compact', tag: 'context',
        what: 'A context trigger INSIDE gmode fires the legacy native /compact — the single legacy residue in the whole system, callable only in gmode.',
        why: 'Everywhere else the modern compact is the only path. Inside gmode the native compact is acceptable because gmode work is not job cognition worth carrying in the structured file — and it stays rare because entry already cleared.',
        hood: 'Native <code>/compact</code> is callable ONLY while the phase is gmode; entry already cleared, so gmode starts low and rarely re-triggers. Source: <code>brain-memory.md</code> · "The gmode arc" INTERIOR.'
    },
    'gm-exit': {
        title: 'exit — re-inject the job', tag: 'action',
        what: 'After exit flips the phase back, the first act is a modern compact again — job-relevant gmode learnings are written in first, then seal and clear, and this time the inject FIRES.',
        why: 'The seed resumes the paused phase with its job cognition restored pure, plus any maintenance learnings deliberately folded in. The bubble was intentional, not lossy.',
        hood: 'gmode learnings appended via the normal <code>compaction-io.sh append-section</code> arms before the seal; exit inject fires + re-injects the Return Note. Source: <code>brain-memory.md</code> · "The gmode arc" EXIT.'
    },

    /* ---- Card 6: the wake reflex ---- */
    'wake-reflex': {
        title: 'the compact-wake reflex', tag: 'action',
        what: 'The moment a clear+inject births the fresh session, a hook deterministically re-grounds the seed in what it was doing — exploiting that the seed’s mind lives on disk.',
        why: 'A SessionStart hook can inject context but cannot start a turn — so the reflex makes orientation DETERMINISTIC even if the follow-up paste mis-fires: the next prompt of any kind arrives into an already-grounded session.',
        hood: '<code>compact-wake.sh</code> on <code>SessionStart(source=clear)</code>; distinct from <code>session-init.sh</code> (which handles <code>source=startup|resume</code>). Source: <code>brain-memory.md</code> · "Compact-wake reflex".'
    },
    'wake-tier': {
        title: 'tier reset', tag: 'state',
        what: 'The context genuinely shrank, so the soft-warning high-water mark restarts its climb from zero.',
        why: 'Without the reset, a stale high-water would silence the soft gate for the whole fresh session — the seed would lose its early-warning nudge right after compacting.',
        hood: '<code>set-last-tier 0</code> via the <code>brain_guard.sh</code> gateway. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 1.'
    },
    'wake-digest': {
        title: 'orientation digest', tag: 'context',
        what: 'The reflex injects the focused job — id, name, objective gist — plus the current phase and cycle, read live from disk state.',
        why: 'The fresh session needs to know, immediately and without a turn, which job it is on and where in the cycle it sits. Idle gets orientation only.',
        hood: 'Read live from the job/phasic state (job_core + phasic_system); injected as the wake digest. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 2.'
    },
    'wake-phase-voice': {
        title: 'phase re-entry voice', tag: 'action',
        what: 'The entry voice of the phase the seed was IN is re-injected — so the wake is a genuine re-entry into the phase with the same coaching it got at phase entry, not just a location stamp.',
        why: 'Resuming the phase means resuming its duties, its allowed surface, its depth forecast. Re-playing the entry voice puts the seed back into the phase mindset, not merely back at a coordinate.',
        hood: 'Re-injects the paused phase’s ENTRY voice (the phasic entry-advance voice). Idle → orientation only, no phase voice. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 3.'
    },
    'wake-rhythm-reset': {
        title: 'phase rhythm-counter reset', tag: 'state',
        what: 'The phase’s intra-phase action counter — <code>actions_since_synthesis</code> — is zeroed so a mid-phase wake is not born with an already-tripped max-gate.',
        why: 'A compact can fire mid-phase, leaving the counter at whatever value the interrupted phase had accumulated. Without a reset, the fresh session would immediately hit the max-gate and be unable to proceed — a phantom block on work that has not yet happened.',
        hood: '<code>reset-synthesis</code> arm of the phase gateway; approved fix 2026-06-12. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 1b.'
    },
    'wake-pin-derive': {
        title: 'pin_pane re-derive', tag: 'state',
        what: 'The tmux pane address used by self-compact is re-derived from the live environment so it targets the correct terminal after the clear.',
        why: 'A /clear creates a fresh session in the same pane, but the stored <code>pin_pane</code> value could be stale. Re-deriving it ensures the next self-compact dispatch fires into the right pane without needing any human re-pin.',
        hood: '<code>session-init.sh</code> <code>derive pin_pane</code> via <code>tmux display-message -p</code> at each SessionStart; the compact-wake reflex triggers this step. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 4.'
    },
    'wake-chain': {
        title: 'chain-load', tag: 'object',
        what: 'The focused job’s sealed compaction file — the recent session body plus the rolling Prior Summary — is read off disk and injected, so the fresh session resumes the job’s cognition, not just its facts.',
        why: 'This is what makes the wake carry THINKING across the boundary: the seed re-enters the job with its open threads, assumptions, and lessons intact.',
        hood: 'Read non-mutating via <code>compaction-io.sh read</code>; injects the recent file + the rolling Prior Summary section. Source: <code>brain-memory.md</code> · "Compact-wake reflex" step 5 chain-load.'
    },

    /* ---- Card 6-detail: optional deepening ---- */
    'refresher': {
        title: 'the post-compact refresher', tag: 'action',
        what: 'An OPTIONAL re-grounding dispatch the seed can run after a compact when it suspects the injected cognition left gaps — never mandatory.',
        why: 'The deterministic reflex is the cheap floor. The refresher pays a deeper cost only when the digest is not enough — so a clean wake never pays for re-grounding it did not need.',
        hood: 'The inject note carries an INVITATION; the seed decides. Phase-aware — keyed to <code>phase_at_seal</code> (an EXECUTE refresh re-reads the work files; an OBSERVE refresh re-grounds the sources). Source: <code>brain-memory.md</code> · "The post-compact refresher".'
    },
    'cross-job': {
        title: 'cross-job continuity', tag: 'context',
        what: 'After a job completes and the session clears into idle, a voice module injects the LAST completed job’s Prior Summary — what just finished, what it learned, what it left pending.',
        why: 'It is the deliberate small overlap: enough continuity to inform the next-job choice, small enough not to drag the dead job’s context into the new one. Silent when no sealed file exists.',
        hood: '<code>phasic_system/hooks/phase-init.sh</code> <code>emit_cross_job_continuity()</code> reads the last completed job’s summary via <code>compaction-io.sh prior-summary</code>; only the Prior Summary crosses the boundary. Source: <code>brain-memory.md</code> · "Cross-job continuity injection".'
    },

    /* ---- Card 7: the two-tier chain ---- */
    'prior-summary': {
        title: 'the Prior Summary', tag: 'object',
        what: 'The last section of the compaction file — a single rolling summary of everything before the recent session. It is required non-empty, and is the only place historical compression accumulates.',
        why: 'It lets a job’s entire cognitive history stay available at a FIXED cost: session 30 still knows what session 2 learned, without injecting thirty files.',
        hood: 'The last <code>_SECTIONS</code> entry in <code>compaction-io.sh</code>; sized ~20% of <code>θ_lc</code> excluding itself; the <code>prior-summary</code> arm reads it. An empty Prior Summary FAILS the seal. Source: <code>brain-memory.md</code> · "Two-tier chain / Prior Summary".'
    },
    'tier1': {
        title: 'session 1 — template only', tag: 'state',
        what: 'The job’s first session opens with just the template and its instructions. There is no prior cognition yet to carry.',
        why: 'Every job’s cognition chain has to start somewhere. Session one is the clean slate the rest of the chain builds on.',
        hood: '<code>seq=1</code>: the template + instructions only (no prior file injected). Source: <code>brain-memory.md</code> · "Two-tier chain" three tiers.'
    },
    'tier2': {
        title: 'session 2 — last file', tag: 'state',
        what: 'The second session injects the last session’s sealed compaction file in full — the recent cognition carried forward intact.',
        why: 'With only one prior session, the whole sealed file fits — no summarization needed yet. The rolling summary starts accumulating from here.',
        hood: '<code>seq=2</code>: injects the last sealed file. Source: <code>brain-memory.md</code> · "Two-tier chain" three tiers.'
    },
    'tier3': {
        title: 'session 3+ — file + rolling summary', tag: 'state',
        what: 'From the third session on, each session injects the last sealed file PLUS a rolling summary of all prior sessions — updated at every boundary with the same last-summary-plus-new pattern.',
        why: 'This is what holds the cost fixed forever: the main sections always describe the current session, while the single rolling summary absorbs the entire archive behind it.',
        hood: 'Updated each boundary using the same last-summary-plus-new pattern <code>interaction_summary</code> uses; held at a fixed % of <code>θ_lc</code>. Source: <code>brain-memory.md</code> · "Two-tier chain / Prior Summary".'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQ 0 — two ramps, one ceiling ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'the modern compact',
        title: 'Two ramps, one ceiling',
        sub: 'brain_guard watches two things at once — how full the context window is, and how big the job’s cognition file has grown. Either one, at its ceiling, fires the same compact.',
        boxes: [
            { id: 'ctx-window', x: 70, y: 70, w: 250, h: 84, tag: 'state', t: 'the context window', s: 'fills every turn · lossy at the wall' },
            { id: 'compaction-file', x: 70, y: 300, w: 250, h: 84, tag: 'object', t: 'the compaction file', s: 'per-job COGNITION · not the work' },
            { id: 'ctx-ramp', x: 410, y: 70, w: 220, h: 84, tag: 'context', t: 'the context ramp', s: 'graduated · keyed on tokens' },
            { id: 'fs-ramp', x: 410, y: 300, w: 220, h: 84, tag: 'context', t: 'file-size ramp (θ_lc)', s: 'graduated · keyed on file words' },
            { id: 'ceiling-op', x: 720, y: 185, w: 210, h: 96, tag: 'gate', t: 'one ceiling, one compact', s: 'either ramp → same modern compact' }
        ],
        edges: [
            { from: 'ctx-window', to: 'ctx-ramp', kind: 'hard', label: 'measures' },
            { from: 'compaction-file', to: 'fs-ramp', kind: 'hard', label: 'measures' },
            { from: 'ctx-ramp', to: 'ceiling-op', kind: 'hard', label: 'ceiling' },
            { from: 'fs-ramp', to: 'ceiling-op', kind: 'hard', label: 'ceiling' }
        ],
        stickies: [
            { x: 690, y: 320, text: 'Two independent danger signals, ONE graceful exit — no asymmetry, no second code path.', aha: true,
              ref: { url: '../05_3-brain-guard.html', section: 'brain_guard — Context Window Discipline', blurb: 'Essay 5.3 — the always-on plugin that keeps the context window healthy.' } }
        ],
        navHints: { right: 'the context ramp', down: 'the θ_lc file-size ramp' }
    },

    /* ---- detail 0,1 — the θ_lc ramp ---- */
    '0,1': {
        kind: 'detail', step: null, eyebrow: 'detail · the file-size trigger',
        title: 'The θ_lc file-size ramp',
        sub: 'The sibling trigger. It mirrors the context ramp’s graduated shape, but measures the compaction file’s word count instead of the context window.',
        boxes: [
            { id: 'fs-ramp', x: 60, y: 180, w: 220, h: 100, tag: 'context', t: 'file-size ramp (θ_lc)', s: 'θ_lc = 2000w ceiling · a knob' },
            { id: 'soft-gate', x: 370, y: 60, w: 230, h: 78, tag: 'action', t: 'coach — 70%', s: 'THETA_LC_COACH_PCT' },
            { id: 'hard-gate', x: 370, y: 195, w: 230, h: 78, tag: 'gate', t: 'block growth — 85%', s: 'THETA_LC_BLOCK_PCT' },
            { id: 'ceiling-op', x: 370, y: 330, w: 230, h: 78, tag: 'gate', t: 'ceiling — 100%', s: 'collapse the toolset' },
            { id: 'populate', x: 690, y: 195, w: 230, h: 100, tag: 'action', t: 'collapsed toolset', s: 'edit file · summary-append · clear+inject' }
        ],
        edges: [
            { from: 'fs-ramp', to: 'soft-gate', kind: 'soft', label: '70%' },
            { from: 'fs-ramp', to: 'hard-gate', kind: 'hard', label: '85%' },
            { from: 'fs-ramp', to: 'ceiling-op', kind: 'hard', label: '100%' },
            { from: 'ceiling-op', to: 'populate', kind: 'hard', label: 'leaves only' }
        ],
        stickies: [
            { x: 660, y: 70, text: '100% of θ_lc is symmetric with context’s 20/25/30 tiers — both ramps share one ceiling op.' }
        ],
        navHints: { up: 'two ramps, one ceiling' }
    },

    /* ============================ SEQ 1 — the context ramp ============================ */
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'the modern compact',
        title: 'The context ramp — squeeze, don’t slam',
        sub: 'As tokens climb, the ramp removes one tool per tier until self-compaction is the only graceful move left. It fires long before the default 100% auto-compact.',
        boxes: [
            { id: 'ctx-tier', x: 60, y: 195, w: 210, h: 96, tag: 'state', t: 'the context tier', s: 'floor(tokens / 10k)' },
            { id: 'soft-gate', x: 340, y: 50, w: 250, h: 84, tag: 'action', t: 'soft — coach (tier 20)', s: '200k · one voice/crossing · no block' },
            { id: 'hard-gate', x: 340, y: 195, w: 250, h: 84, tag: 'gate', t: 'hard — block Read (tier 25)', s: '250k · firehose off · finish + commit' },
            { id: 'critical-gate', x: 340, y: 340, w: 250, h: 84, tag: 'gate', t: 'critical — block writes (tier 30)', s: '300k · only Bash + questions' },
            { id: 'grace-bypass', x: 690, y: 195, w: 230, h: 96, tag: 'gate', t: 'post-compact grace', s: '300s · don’t block the first Read' }
        ],
        edges: [
            { from: 'ctx-tier', to: 'soft-gate', kind: 'soft', label: '20' },
            { from: 'ctx-tier', to: 'hard-gate', kind: 'hard', label: '25' },
            { from: 'ctx-tier', to: 'critical-gate', kind: 'hard', label: '30' },
            { from: 'critical-gate', to: 'grace-bypass', kind: 'soft', label: 'after compact' }
        ],
        stickies: [
            { x: 640, y: 330, text: 'Each tier removes ONE more tool — the values are tunable, the graduated shape is the invariant.', aha: true }
        ],
        navHints: { left: 'two ramps, one ceiling', right: 'the compaction file', down: 'three tiers, graduated' }
    },

    /* ---- detail 1,1 — graduated enforcement ---- */
    '1,1': {
        kind: 'detail',
        eyebrow: 'detail · the graduated shape',
        title: 'Three tiers, graduated',
        sub: 'What you\'re looking at: the three operating tiers of the context ramp — the seed\'s own self-compact trigger bands — showing how consequences escalate progressively instead of flipping one switch.',
        boxes: [
            { id: 'cr-soft', x: 340, y: 60, w: 230, h: 96, tag: 'gate', t: 'soft tier', s: 'first nudge to compact' },
            { id: 'cr-hard', x: 340, y: 200, w: 230, h: 96, tag: 'gate', t: 'hard tier', s: 'stronger pressure — Read blocked' },
            { id: 'cr-crit', x: 340, y: 340, w: 230, h: 96, tag: 'gate', t: 'critical tier', s: 'compact now — writes blocked too' },
            { id: 'cr-grad', x: 680, y: 200, w: 240, h: 96, tag: 'context', t: 'graduated enforcement', s: 'escalate progressively, not one binary switch' }
        ],
        edges: [
            { from: 'cr-soft', to: 'cr-hard', kind: 'hard', label: '→' },
            { from: 'cr-hard', to: 'cr-crit', kind: 'hard', label: '→' },
            { from: 'cr-grad', to: 'cr-soft', kind: 'soft', label: 'the principle' }
        ],
        stickies: [
            { x: 50, y: 200, text: 'Consequences escalate as danger rises — not one on/off switch. Tier positions are tunable; the graduated SHAPE is the invariant.', aha: true }
        ],
        navHints: { up: 'the context ramp' }
    },

    /* ============================ SEQ 2 — the compaction file ============================ */
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'the modern compact',
        title: 'The compaction file — cognition, not work',
        sub: 'A per-job file that carries how-the-work-is-going across a clear. Born when the job is focused, grown at every phase exit, and never condensed away.',
        boxes: [
            { id: 'focus-birth', x: 60, y: 70, w: 230, h: 84, tag: 'action', t: 'born at focus', s: 'empty template before any phase' },
            { id: 'run-dir', x: 60, y: 300, w: 230, h: 84, tag: 'object', t: 'run-aware job dir', s: 'jobs/<id>/run-<r>/' },
            { id: 'compaction-file', x: 380, y: 185, w: 230, h: 100, tag: 'object', t: 'the compaction file', s: 'open threads · assumptions · loops' },
            { id: 'phase-exit-write', x: 700, y: 70, w: 230, h: 84, tag: 'action', t: 'built at phase exits', s: 'metacog commands append' },
            { id: 'six-sections', x: 700, y: 300, w: 230, h: 84, tag: 'context', t: 'the six sections', s: '5 authored + 1 auto-fed' }
        ],
        edges: [
            { from: 'focus-birth', to: 'compaction-file', kind: 'hard', label: 'creates' },
            { from: 'run-dir', to: 'compaction-file', kind: 'hard', label: 'holds' },
            { from: 'compaction-file', to: 'phase-exit-write', kind: 'soft', label: 'grows' },
            { from: 'compaction-file', to: 'six-sections', kind: 'hard', label: 'shaped by' }
        ],
        stickies: [
            { x: 360, y: 330, text: 'Working memory holds the WORK; this file holds how-the-work-is-going + what-must-survive-a-clear.', aha: true },
            { x: 60, y: 470, text: 'The file accrues at each phase exit in the cycle.',
              ref: { kind: 'deck', url: '../../b6/explore/phasic-cycle.html', section: 'The Full OPEVC Cycle', blurb: 'The phase exits where the compaction file accrues its cognition.' } },
            { x: 680, y: 390, text: 'The compaction file belongs to one job\'s life.',
              ref: { kind: 'deck', url: '../../b6/explore/job-life.html', section: 'The Life of a Job', blurb: 'The job whose cognition this compaction file carries.' } }
        ],
        navHints: { left: 'the context ramp', right: 'the finalization seal', down: 'the six-section shape' }
    },

    /* ---- detail 2,1 — sections shape ---- */
    '2,1': {
        kind: 'detail', step: null, eyebrow: 'detail · why a fixed shape',
        title: 'Six sections — shape compels production',
        sub: 'A compartment that demands a structured shape forces the seed to produce cognition that fills it. The names are customizable; the shape is the invariant.',
        boxes: [
            { id: 'six-sections', x: 60, y: 185, w: 230, h: 100, tag: 'context', t: 'the six sections', s: 'routing destinations' },
            { id: 'phase-exit-write', x: 380, y: 60, w: 250, h: 84, tag: 'action', t: '5 authored sections', s: 'Forward State · Open Threads · …' },
            { id: 'no-marked-notes', x: 380, y: 330, w: 250, h: 84, tag: 'context', t: 'NO marked-notes section', s: 'marks stay in CLAUDE.md footers' },
            { id: 'prior-summary', x: 700, y: 60, w: 230, h: 84, tag: 'object', t: 'Prior Summary (last)', s: 'required non-empty' },
            { id: 'six-sections-auto', x: 700, y: 200, w: 230, h: 84, tag: 'state', t: 'Git Commit Messages', s: 'auto-fed · seal-gate exempt' }
        ],
        edges: [
            { from: 'six-sections', to: 'phase-exit-write', kind: 'hard', label: 'authored' },
            { from: 'six-sections', to: 'six-sections-auto', kind: 'soft', label: 'auto-fed' },
            { from: 'six-sections', to: 'no-marked-notes', kind: 'soft', label: 'NOT here' },
            { from: 'phase-exit-write', to: 'prior-summary', kind: 'soft', label: 'ends with' }
        ],
        stickies: [
            { x: 690, y: 320, text: 'Each commit message is absorbed verbatim — the file metabolizes the raw section like everything else.' }
        ],
        navHints: { up: 'the compaction file' }
    },

    /* ============================ SEQ 3 — the finalization seal ============================ */
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'the modern compact',
        title: 'The finalization seal',
        sub: 'Before the boundary, an ordered quality pass dedups, fills any empty section from the live session, folds the file small, then stamps it. No empty section can ever pass.',
        boxes: [
            { id: 'finalization', x: 60, y: 185, w: 220, h: 100, tag: 'action', t: 'finalization pass', s: 'an inspectable quality pass' },
            { id: 'populate', x: 350, y: 55, w: 240, h: 84, tag: 'action', t: 'populate ≡ polish', s: 'fill empties from live context' },
            { id: 'polish-shrink', x: 350, y: 195, w: 240, h: 84, tag: 'gate', t: 'fold below the band', s: 'seal 80% < block 85%' },
            { id: 'seal-stamp', x: 350, y: 335, w: 240, h: 84, tag: 'state', t: 'the seal stamp', s: 'version · last_finalized · phase' },
            { id: 'prior-summary', x: 700, y: 195, w: 230, h: 100, tag: 'object', t: 'Prior Summary', s: 'written + validated non-empty' }
        ],
        edges: [
            { from: 'finalization', to: 'populate', kind: 'hard', label: 'step 2' },
            { from: 'finalization', to: 'polish-shrink', kind: 'hard', label: 'aim' },
            { from: 'finalization', to: 'seal-stamp', kind: 'hard', label: 'step 4' },
            { from: 'seal-stamp', to: 'prior-summary', kind: 'hard', label: 'requires' }
        ],
        stickies: [
            { x: 640, y: 330, text: 'Sealed BELOW the block band — so the fresh session that injects it can always Read. (The deadlock fix.)', aha: true }
        ],
        navHints: { left: 'the compaction file', right: 'clear + inject', down: 'two triggers, one seal' }
    },

    /* ---- detail 3,1 — two triggers ---- */
    '3,1': {
        kind: 'detail', step: null, eyebrow: 'detail · when the seal fires',
        title: 'Two triggers, one seal',
        sub: 'The same sealing operation runs at two moments: a ramp ceiling that can fall anywhere, and the required wrap when a job completes.',
        boxes: [
            { id: 'trig-ceiling', x: 60, y: 60, w: 250, h: 84, tag: 'action', t: 'trigger A — a ramp ceiling', s: 'orthogonal · falls anywhere' },
            { id: 'trig-wrap', x: 60, y: 320, w: 250, h: 84, tag: 'action', t: 'trigger B — completion wrap', s: 'required at job completion' },
            { id: 'one-seal', x: 400, y: 190, w: 200, h: 100, tag: 'gate', t: 'one seal operation', s: 'phase-indifferent' },
            { id: 'wrap-note', x: 690, y: 320, w: 240, h: 84, tag: 'context', t: 'inject only the note', s: 'sealed Prior Summary · not the file' },
            { id: 'seal-stamp', x: 690, y: 60, w: 240, h: 84, tag: 'state', t: 'seal evidence', s: 'last_finalized > completed_at' }
        ],
        edges: [
            { from: 'trig-ceiling', to: 'one-seal', kind: 'hard', label: 'fires' },
            { from: 'trig-wrap', to: 'one-seal', kind: 'hard', label: 'fires' },
            { from: 'one-seal', to: 'seal-stamp', kind: 'hard', label: 'stamps' },
            { from: 'trig-wrap', to: 'wrap-note', kind: 'soft', label: 'injects' }
        ],
        stickies: [
            { x: 360, y: 320, text: 'A job NEVER ends with an unsealed compaction file — the advance requires the seal stamp to prove the wrap ran.' }
        ],
        navHints: { up: 'the finalization seal' }
    },

    /* ============================ SEQ 4 — clear + inject ============================ */
    '4,0': {
        kind: 'seq', step: 5, eyebrow: 'the modern compact',
        title: 'Clear + inject — the session boundary',
        sub: 'End the saturated session, start a fresh one carrying exactly the sealed cognition. The seed cannot type a slash command, so it drives the keyboard itself.',
        boxes: [
            { id: 'clear-inject', x: 60, y: 185, w: 240, h: 100, tag: 'action', t: 'clear + inject', s: 'esc · /clear · instruction · file' },
            { id: 'dispatch-mode', x: 370, y: 70, w: 240, h: 84, tag: 'object', t: 'dual dispatch', s: 'tmux paste · or X11 xdotool' },
            { id: 'window-pin', x: 370, y: 300, w: 240, h: 84, tag: 'state', t: 'window-pin', s: 'derive-don’t-pin' },
            { id: 'ladder', x: 700, y: 185, w: 230, h: 100, tag: 'gate', t: 'never-guess targeting', s: 'stale pin BLOCKS, never guesses' }
        ],
        edges: [
            { from: 'clear-inject', to: 'dispatch-mode', kind: 'hard', label: 'types via' },
            { from: 'dispatch-mode', to: 'window-pin', kind: 'hard', label: 'targets' },
            { from: 'window-pin', to: 'ladder', kind: 'hard', label: 'resolved by' }
        ],
        stickies: [
            { x: 350, y: 195, text: 'This replaces native /compact ENTIRELY — the seed’s one and only way to compact.', aha: true }
        ],
        navHints: { left: 'the finalization seal', right: 'the wake reflex', down: 'the gmode arc' }
    },

    /* ---- detail 4,1 — gmode arc ---- */
    '4,1': {
        kind: 'detail', step: null, eyebrow: 'detail · the maintenance detour',
        title: 'The gmode arc — seal, suppress, re-inject',
        sub: 'gmode is a maintenance lane that may itself saturate context. The arc protects the job’s cognition across the detour while keeping the lane uncluttered.',
        boxes: [
            { id: 'gm-entry', x: 60, y: 60, w: 230, h: 84, tag: 'action', t: 'entry — seal the job', s: 'required first act' },
            { id: 'gm-suppress', x: 360, y: 60, w: 230, h: 84, tag: 'gate', t: 'inject SUPPRESSED', s: 'clear-note = mission' },
            { id: 'gm-interior', x: 360, y: 300, w: 230, h: 84, tag: 'context', t: 'interior — legacy /compact', s: 'the one residue · gmode-only' },
            { id: 'gm-exit', x: 690, y: 185, w: 240, h: 100, tag: 'action', t: 'exit — re-inject the job', s: 'fold learnings · inject FIRES' }
        ],
        edges: [
            { from: 'gm-entry', to: 'gm-suppress', kind: 'hard', label: 'clears' },
            { from: 'gm-suppress', to: 'gm-interior', kind: 'soft', label: 'if it fills' },
            { from: 'gm-interior', to: 'gm-exit', kind: 'hard', label: 'exit-gmode' }
        ],
        stickies: [
            { x: 60, y: 300, text: 'Sealed at entry → a gmode that dies mid-detour loses NOTHING of the job.', aha: true }
        ],
        navHints: { up: 'clear + inject' }
    },

    /* ============================ SEQ 5 — the wake reflex ============================ */
    '5,0': {
        kind: 'seq', step: 6, eyebrow: 'the modern compact',
        title: 'The wake reflex — re-ground on arrival',
        sub: 'A hook cannot start a turn, but it can inject context the instant the fresh session is born. So orientation is deterministic even if the follow-up paste mis-fires.',
        boxes: [
            { id: 'wake-reflex', x: 60, y: 240, w: 220, h: 100, tag: 'action', t: 'compact-wake reflex', s: 'SessionStart(source=clear)' },
            { id: 'wake-tier', x: 350, y: 30, w: 240, h: 65, tag: 'state', t: 'tier reset', s: 'set-last-tier 0' },
            { id: 'wake-rhythm-reset', x: 350, y: 110, w: 240, h: 65, tag: 'state', t: 'rhythm-counter reset', s: 'actions_since_synthesis → 0' },
            { id: 'wake-digest', x: 350, y: 190, w: 240, h: 65, tag: 'context', t: 'orientation digest', s: 'focused job · phase · cycle' },
            { id: 'wake-phase-voice', x: 350, y: 270, w: 240, h: 65, tag: 'action', t: 'phase re-entry voice', s: 're-enter, not a stamp' },
            { id: 'wake-pin-derive', x: 350, y: 350, w: 240, h: 65, tag: 'state', t: 'pin_pane re-derive', s: 'target the correct terminal' },
            { id: 'wake-chain', x: 350, y: 430, w: 240, h: 65, tag: 'object', t: 'chain-load', s: 'read the sealed file off disk' },
            { id: 'prior-summary', x: 700, y: 220, w: 230, h: 100, tag: 'object', t: 'the Prior Summary', s: 'cognition, not just facts' }
        ],
        edges: [
            { from: 'wake-reflex', to: 'wake-tier', kind: 'hard', label: '1' },
            { from: 'wake-reflex', to: 'wake-rhythm-reset', kind: 'hard', label: '1b' },
            { from: 'wake-reflex', to: 'wake-digest', kind: 'hard', label: '2' },
            { from: 'wake-reflex', to: 'wake-phase-voice', kind: 'hard', label: '3' },
            { from: 'wake-reflex', to: 'wake-pin-derive', kind: 'hard', label: '4' },
            { from: 'wake-reflex', to: 'wake-chain', kind: 'hard', label: '5' },
            { from: 'wake-chain', to: 'prior-summary', kind: 'hard', label: 'loads' }
        ],
        stickies: [
            { x: 640, y: 360, text: 'The seed’s mind lives ON DISK — the clear sheds only the conversation trace, never the cognition.', aha: true }
        ],
        navHints: { left: 'clear + inject', right: 'the two-tier chain', down: 'optional deepening' }
    },

    /* ---- detail 5,1 — optional deepening ---- */
    '5,1': {
        kind: 'detail', step: null, eyebrow: 'detail · beyond the floor',
        title: 'Optional deepening',
        sub: 'The reflex is the deterministic floor. Two optional surfaces add more continuity only when it is worth the cost.',
        boxes: [
            { id: 'wake-reflex', x: 60, y: 185, w: 220, h: 100, tag: 'action', t: 'compact-wake reflex', s: 'the deterministic FLOOR' },
            { id: 'refresher', x: 380, y: 60, w: 250, h: 100, tag: 'action', t: 'post-compact refresher', s: 'invited · phase-aware · opt-in' },
            { id: 'cross-job', x: 380, y: 300, w: 250, h: 100, tag: 'context', t: 'cross-job continuity', s: 'last job’s Prior Summary into idle' }
        ],
        edges: [
            { from: 'wake-reflex', to: 'refresher', kind: 'soft', label: 'may invite' },
            { from: 'wake-reflex', to: 'cross-job', kind: 'soft', label: 'at idle' }
        ],
        stickies: [
            { x: 680, y: 195, text: 'The small overlap: enough to inform the NEXT job choice, small enough not to drag the dead job in.' }
        ],
        navHints: { up: 'the wake reflex' }
    },

    /* ============================ SEQ 6 — the two-tier chain ============================ */
    '6,0': {
        kind: 'seq', step: 7, eyebrow: 'the modern compact',
        title: 'The two-tier chain — fixed cost, forever',
        sub: 'A job can run across an unbounded number of sessions. One rolling Prior Summary keeps its entire cognitive history available at a fixed cost.',
        boxes: [
            { id: 'tier1', x: 60, y: 70, w: 250, h: 84, tag: 'state', t: 'session 1 — template only', s: 'no prior cognition yet' },
            { id: 'tier2', x: 60, y: 195, w: 250, h: 84, tag: 'state', t: 'session 2 — last file', s: 'whole sealed file carried' },
            { id: 'tier3', x: 60, y: 320, w: 250, h: 84, tag: 'state', t: 'session 3+ — file + summary', s: 'rolling summary of all prior' },
            { id: 'prior-summary', x: 470, y: 195, w: 230, h: 100, tag: 'object', t: 'the Prior Summary', s: '~20% of θ_lc · required' },
            { id: 'compaction-file', x: 760, y: 195, w: 180, h: 100, tag: 'object', t: 'fixed cost', s: 'session 30 knows session 2' }
        ],
        edges: [
            { from: 'tier1', to: 'tier2', kind: 'soft', label: 'next' },
            { from: 'tier2', to: 'tier3', kind: 'soft', label: 'next' },
            { from: 'tier3', to: 'prior-summary', kind: 'hard', label: 'rolls into' },
            { from: 'prior-summary', to: 'compaction-file', kind: 'hard', label: 'holds cost' }
        ],
        stickies: [
            { x: 440, y: 330, text: 'The main sections always describe the CURRENT session; the single rolling summary absorbs the whole archive.', aha: true,
              ref: { url: '../05_3-brain-guard.html', section: 'brain_guard — Context Window Discipline', blurb: 'Essay 5.3 — context-window discipline, end to end.' } }
        ],
        navHints: { left: 'the wake reflex', down: 'the Prior Summary carries cognition' }
    },

    /* ---- detail 6,1 — two-tier chain / Prior Summary ---- */
    '6,1': {
        kind: 'detail',
        eyebrow: 'detail · fixed cost, forever',
        title: 'The Prior Summary carries cognition',
        sub: 'What you\'re looking at: how the two-tier chain carries a job\'s entire cognitive history across unbounded sessions at a fixed, bounded cost.',
        boxes: [
            { id: 'pc-seal', x: 50, y: 185, w: 230, h: 96, tag: 'object', t: 'sealed compaction file', s: 'this session\'s cognition' },
            { id: 'pc-prior', x: 370, y: 185, w: 230, h: 96, tag: 'object', t: 'Prior Summary', s: 'a fold of all earlier sessions' },
            { id: 'pc-inject', x: 680, y: 60, w: 230, h: 96, tag: 'action', t: 'clear + inject', s: 'carried across `/clear`' },
            { id: 'pc-fixed', x: 680, y: 320, w: 230, h: 96, tag: 'state', t: 'fixed cost', s: 'the chain never grows unbounded' }
        ],
        edges: [
            { from: 'pc-seal', to: 'pc-prior', kind: 'hard', label: 'folds into' },
            { from: 'pc-prior', to: 'pc-inject', kind: 'hard', label: 'carried by' },
            { from: 'pc-inject', to: 'pc-fixed', kind: 'soft', label: 'at' }
        ],
        stickies: [
            { x: 300, y: 350, text: 'The two-tier chain carries cognition across unbounded sessions at a fixed, bounded cost.', aha: true }
        ],
        navHints: { up: 'the two-tier chain' }
    }
};
