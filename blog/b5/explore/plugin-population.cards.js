/* ============================================================================
 * plugin-population.cards.js — CONTENT for the "Plugin Population" deck.
 * Teaches: the seed's plugin layer as a POPULATION of named entities — the two
 * LAYERS as categories (always-on fires on every event; phasic mode-switches
 * per phase), the live roster (active set + unimplemented designs + the shared
 * lib tier), and the two always-on plugins drawn in depth: interaction_summary
 * (mega-prompt compression) and question_discipline (the AskUserQuestion prefix
 * gate). Paired with the shared deck-engine.js + deck-engine.css (b6/explore,
 * referenced cross-dir). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section), never line numbers,
 * per the glossary term-anatomy rule (Rule 20). Counts that rot weekly
 * (per-plugin test counts, voice-element totals) are deliberately NOT pinned.
 * Sources:
 *   .claude/settings.local.json (the brain-root registry: 5 always-on + 6 phasic
 *     plugins carry hook registrations; job_archiver/job_blocker carry zero),
 *   .claude/plugins/ (14 dirs = 11 active + 2 unimplemented + lib/),
 *   interaction_summary/config.conf (TOKEN_THRESHOLD=500, TOKEN_WORD_RATIO 13/10,
 *     SUMMARY_MIN/MAX 200/1000, MIN_TOKENS_PER_SECTION=50),
 *   interaction_summary/hooks/token-counter.sh (PostToolUse detect, summary_needed flip),
 *   interaction_summary/hooks/summary-guard.sh (PreToolUse enforce, exit 2, submit escape),
 *   interaction_summary/scripts/summary.sh (REQUIRED_SECTIONS — the 5 sections, summary_chain),
 *   question_discipline/hooks/question-discipline-gate.sh (readonly PREFIX_REGISTRY = 9
 *     entries, CLAUDE_SUBAGENT bypass, tool gate, first-token match, batch-cascade exit 2),
 *   phasic_system/hooks/gmode-*.sh + scripts/phase.sh (FORWARD_MAP/BACKWARD_MAP, idle/gmode),
 *   + .claude/context/plugins-entities.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'plugin-population', seqLabel: 'two layers, one roster' };

window.DECK_INFO = {
    /* ---- Card 1: the two layers ---- */
    'two-layers-seed': {
        title: 'the seed’s plugin substrate', tag: 'context',
        what: 'Every behavioral control the seed runs lives in one of two plugin layers. The split is by WHEN a plugin fires, not by what it does.',
        why: 'Naming the two layers first gives every later plugin a home: you always know whether a control is underneath everything (always-on) or swapped in for the current phase (phasic).',
        hood: 'The substrate is <code>.claude/plugins/</code> — 14 directories, each a single-concern organ. Which ones are live is a code fact: a plugin is active only if its hooks are registered in <code>.claude/settings.local.json</code>. Source: <code>plugins-entities.md</code> · "Active plugin inventory".'
    },
    'ao-layer': {
        title: 'the always-on layer', tag: 'context',
        what: 'The infrastructure that fires on every prompt, every tool call, every session start — independent of which job is focused or which phase it is in.',
        why: 'These are the controls that must never sleep: edit-safety, job lifecycle, prompt compression, context hygiene, question discipline. They surround everything else, which is why the canonical narrative tour starts here.',
        hood: 'Five plugins, each registering its hooks in <code>settings.local.json</code>. The defining property is phase-INDEPENDENT firing on every event — not "running in the background". Source: <code>plugins-entities.md</code> · "Always-on layer".'
    },
    'ph-layer': {
        title: 'the phasic layer', tag: 'context',
        what: 'The layer that activates one phasic mode at a time, dictated by which phase the focused job is in, while the always-on plugins keep running underneath.',
        why: 'This is what makes the seed operate differently in each compartment — read-only in OBSERVE/PLAN, fenced-write in EXECUTE, scripts-only in VERIFY, brain-only in CONDENSE. The per-phase tool law is enforced in code, not by convention.',
        hood: 'An orchestrator (<code>phasic_system</code>) plus five phase plugins (<code>phase_observe</code>…<code>phase_condense</code>). The always-on layer runs UNDERNEATH the active phasic mode, concurrently — it does not get replaced per phase. Source: <code>plugins-entities.md</code> · "Phasic layer".'
    },

    /* ---- Card 2: the always-on five ---- */
    'ao-fires': {
        title: 'fires on every event', tag: 'action',
        what: 'Each always-on plugin attaches reflexes to Claude Code events — prompt submit, tool calls, session start — so they run no matter what the seed is doing.',
        why: 'Phase-independent firing is the whole point: edit-safety and context hygiene cannot take a phase off. The contrast partner is the phasic layer, which only fires the mode for the current phase.',
        hood: 'Registration is per-event in <code>settings.local.json</code> (<code>UserPromptSubmit</code> / <code>PreToolUse</code> / <code>PostToolUse</code> / <code>Stop</code> / <code>SessionStart</code>). Membership is grep-able — five plugins carry these registrations. Source: <code>plugins-entities.md</code> · "Always-on layer" storage note.'
    },
    'pi': {
        title: 'plugin_integrity', tag: 'object',
        what: 'Owns plugin edit-safety: the single-plugin lock, the test-or-revert safe-lock cycle, and the drift gate. The foundational layer every other plugin depends on.',
        why: 'Editing the substrate that enforces every plugin’s discipline is the most dangerous act in the seed — so it gets the heaviest gate. This is the plugin the whole plugin kit rests on.',
        hood: 'Deep home: <code>plugins-substrate.md</code> (the cell / lock / safe-lock / birth ceremonies). Its anatomy is drawn in the companion "Plugin Cell &amp; Lock Ceremony" deck. Source: <code>plugins-entities.md</code> · always-on table.'
    },
    'jc': {
        title: 'job_core', tag: 'object',
        what: 'Owns the job lifecycle and the stop gate — focused-job management, dependent-job creation, the multi-cycle plan-file lifecycle, and the immutable record of user interactions.',
        why: 'Everything the seed does is job-framed; job_core is the always-on plugin that holds that frame. It is also half of the cumulative mega-prompt pair (the immutable RECORD).',
        hood: 'Deep home: <code>job-system.md</code> (job graph, Stage, completion, stop gate). Its <code>user_interactions[]</code> is the RECORD half of the mega-prompt; interaction_summary holds the VIEW half. Source: <code>plugins-entities.md</code> · always-on table.'
    },
    'is': {
        title: 'interaction_summary', tag: 'object',
        what: 'Owns mega-prompt compression: it watches the focused job’s growing prompt and, past a token threshold, forces a structured summary before work continues. Drawn deep in step 5.',
        why: 'A focused job’s prompt grows every turn; left alone it would bloat. interaction_summary keeps it legible by condensing it into a durable summary chain — the living prompt the job thinks against.',
        hood: 'Two hooks (detect + enforce) over a mirror <code>data.json</code> keyed by the same job id. Walk into step 5 for the full mechanism. Source: <code>plugins-entities.md</code> · "interaction_summary".'
    },
    'bg': {
        title: 'brain_guard', tag: 'object',
        what: 'Owns context-window hygiene: it watches how full the context is and drives the self-compact that carries cognition across session boundaries without losing the thread.',
        why: 'The window is finite; brain_guard is the always-on plugin that keeps it healthy, replacing native compaction with a per-job compaction file the seed builds and re-injects.',
        hood: 'Deep home: <code>brain-memory.md</code> (the compaction file / file-size ramp / clear+inject chain). Distinct surface from interaction_summary — that compresses the JOB’s prompt; brain_guard manages the CONTEXT WINDOW. Source: <code>plugins-entities.md</code> · always-on table.'
    },
    'qd': {
        title: 'question_discipline', tag: 'object',
        what: 'Owns the AskUserQuestion prefix gate: it blocks any question that does not start with a registered prefix, forcing every interactive ask through a named ceremony. Drawn deep in step 6.',
        why: 'It is the smallest plugin but the most catalytic — every new ceremony anywhere in the seed needs an entry in its one registry first, so that registry is where the seed’s whole ceremony surface is visible at a glance.',
        hood: 'One hook, one hardcoded array, no <code>data.json</code> state. Walk into step 6 for the full mechanism. Source: <code>plugins-entities.md</code> · "question_discipline".'
    },
    'settings': {
        title: '.claude/settings.local.json', tag: 'state',
        what: 'The brain-root registry that pairs Claude Code event names with hook script paths. A plugin is "active" only if its hooks are listed here; nothing self-registers.',
        why: 'Membership in the always-on layer is not a label — it is the presence of registrations in this one file. The brain registers plugins; plugins do not register themselves.',
        hood: 'All five always-on plugins carry grep-able registrations here (e.g. <code>interaction_summary/hooks/summary-guard.sh</code>, <code>question_discipline/hooks/question-discipline-gate.sh</code>). Source: <code>plugins-entities.md</code> · "Always-on layer" storage + locus.'
    },

    /* ---- Card 3: the phasic layer ---- */
    'phasic-system': {
        title: 'phasic_system — the orchestrator', tag: 'object',
        what: 'The conductor: it owns idle-enforcement and the phase-transition state machine and the per-job phase/cycle state. It does NOT itself enforce per-phase tool restrictions — it delegates that to the five phase plugins.',
        why: 'Compartmentalization prevents a monolith: the orchestrator routes transitions, and each phase plugin owns its own tool law. That separation is why the phase substrate is safe to lean on.',
        hood: 'Owns <code>FORWARD_MAP</code> / <code>BACKWARD_MAP</code> (<code>scripts/phase.sh</code>) and the non-OPEVC modes idle + gmode (<code>hooks/gmode-*.sh</code>). Classified in the phasic layer by CONCERN, even though it fires continuously — see the detail card below. Source: <code>plugins-entities.md</code> · "Phasic layer".'
    },
    'phase5': {
        title: 'the five phase plugins', tag: 'object',
        what: 'phase_observe, phase_plan, phase_execute, phase_verify, phase_condense — one per OPEVC phase. Each enforces that phase’s tool law and exit gate.',
        why: 'Their semantics (what each phase does) live in the OPEVC context files; what this cluster names is their ENTITY status — five members of the phasic layer, one active at a time.',
        hood: 'Each registers a phase guard in <code>settings.local.json</code>: OBSERVE/PLAN read-only against project files · EXECUTE fenced-write · VERIFY scripts-only · CONDENSE brain-only. Enforced in code by each phase guard, not by convention. Source: <code>plugins-entities.md</code> · "Phasic layer" membership.'
    },
    'active-mode': {
        title: 'one mode active at a time', tag: 'state',
        what: 'Which phasic mode is live is dictated by the focused job’s current phase. Switch phase, and a different phase plugin’s tool law takes over.',
        why: 'This is the mode-switching that makes the seed behave differently in each compartment — the cognitive discipline of doing one kind of work at a time, enforced rather than trusted.',
        hood: 'The focused job’s <code>phase</code> field (job_core state, read by every phase guard) selects which guard enforces. The always-on five keep firing underneath the whole time. Source: <code>plugins-entities.md</code> · "Phasic layer".'
    },
    'maps': {
        title: 'the transition maps', tag: 'state',
        what: 'The legal phase moves: FORWARD_MAP (gated advances, idle→observe→…→condense→idle, plus the one plan→verify jump) and BACKWARD_MAP (free recovery).',
        why: 'The orchestrator routes every transition through these maps, so the phase machine is one auditable place — not logic scattered across the phase plugins.',
        hood: 'Both maps live in <code>phasic_system/scripts/phase.sh</code>. Forward advances are gated <code>--force</code> commits; backward transitions are free (clean git only). Source: <code>opevc-phases.md</code> · "FORWARD_MAP" / "BACKWARD_MAP".'
    },

    /* ---- Card 4: the roster ---- */
    'plugins-dir': {
        title: '.claude/plugins/ — 14 dirs', tag: 'context',
        what: 'The directory that holds the whole population: the active enforcement plugins, the unimplemented design placeholders, and one shared-helper tier that is not a plugin.',
        why: 'A roster of roles, not a status board — it tells you what entities exist and which are real, without pinning volatile per-plugin versions or test counts.',
        hood: 'Fourteen directories total. "Active" = has registered hooks in <code>settings.local.json</code>; "unimplemented" = a <code>CLAUDE.md</code> objective but zero registrations. Source: <code>plugins-entities.md</code> · "Active plugin inventory".'
    },
    'active-11': {
        title: '11 active plugins', tag: 'object',
        what: 'The plugins actually running full OPEVC: the five always-on plus the phasic orchestrator and its five phase plugins.',
        why: 'Eleven single-concern organs — the architecture’s value is not any one of them, but the ceremonies they compose into that no plugin performs alone.',
        hood: 'plugin_integrity, job_core, interaction_summary, brain_guard, question_discipline (always-on) + phasic_system, phase_observe, phase_plan, phase_execute, phase_verify, phase_condense (phasic, counting the orchestrator). Source: <code>plugins-entities.md</code> · "Active plugin inventory".'
    },
    'unimpl-2': {
        title: '2 unimplemented designs', tag: 'state',
        what: 'job_archiver and job_blocker — design placeholders with a written objective but no activated code. Real designs, not yet built.',
        why: 'The roster is honest about what is design-only: counting them among the active set would overstate the seed. They carry zero registrations, so nothing of theirs fires.',
        hood: 'Each has a <code>CLAUDE.md</code> objective but zero hooks in <code>settings.local.json</code> (a grep for either name in the registry returns nothing). job_archiver’s two design terms — the mirror data.json and write-once-lazy discipline — are post-open-source add-ons. Source: <code>plugins-entities.md</code> · "Active plugin inventory" + "Mirror data.json".'
    },
    'lib-tier': {
        title: 'lib/ — the shared tier', tag: 'object',
        what: 'A shared-helper directory (voice rendering, section guards, question-shape checks, yaml cognition, the agent registry) used by many plugins. Not itself a plugin.',
        why: 'It owns no concern and registers no hooks, so it is not a member of either layer — but it is where cross-plugin primitives live, so naming it keeps the roster count honest.',
        hood: 'Holds <code>voice-helper/</code>, <code>section_guard/</code>, <code>question_shape/</code>, <code>yaml-cognition/</code>, <code>agent-registry/</code>, … — primitives sourced by plugins, never fired directly. Source: <code>plugins-entities.md</code> · "lib is a shared helper tier".'
    },

    /* ---- Card 5: interaction_summary deep ---- */
    'is-center': {
        title: 'interaction_summary', tag: 'object',
        what: 'The always-on plugin that keeps a focused job’s growing prompt legible: it counts tokens after each interaction and, past a threshold, blocks productive tools until a structured summary carries the context forward.',
        why: 'Its role in cognition is capturing the user’s input and building a dynamic prompt — the chain of summaries IS the evolving prompt the job thinks against. Short jobs that never cross the threshold never see it engage.',
        hood: 'Mirror <code>data.json</code> keyed by the same job id job_core minted: <code>{id, last_summarized_index, summary_needed, summary_chain[]}</code> (a Distributed Job Extension — summary state lives beside, never inside, the core job record). Source: <code>plugins-entities.md</code> · "interaction_summary".'
    },
    'is-detect': {
        title: 'token-counter.sh — detect', tag: 'action',
        what: 'A PostToolUse hook that approximates the unsummarized tail in tokens and, on crossing the threshold, silently flips the summary flag and injects the backlog. The agent usually complies on its own.',
        why: 'The soft half of soft-before-hard: it measures and nudges without interrupting, so the block is only ever the fallback.',
        hood: 'Approximates tokens as <code>word_count × TOKEN_WORD_RATIO_NUM / DEN</code> (default 13/10 ≈ 1.3 words/token), zero API calls. At <code>token_count ≥ TOKEN_THRESHOLD</code> (default 500) it ensures the mirror exists, sets <code>summary_needed=true</code>, injects the text. Source: <code>interaction_summary/hooks/token-counter.sh</code>; <code>config.conf</code>.'
    },
    'is-block': {
        title: 'summary-guard.sh — enforce', tag: 'gate',
        what: 'A PreToolUse hook that, while the summary flag is set, hard-blocks every productive tool on the next call. The only way out is to submit the summary.',
        why: 'The hard half: work physically cannot continue until the conversation history is condensed. The escape path is the remedy itself.',
        hood: 'Fires on <code>Edit|Write|MultiEdit|Read|Bash|AskUserQuestion</code>; while <code>summary_needed==true</code> it exits 2 (block) except for two whitelisted commands: <code>bash summary.sh submit</code> and read-only <code>job.sh (focused|show|list)</code>. Subagents bypass. Source: <code>interaction_summary/hooks/summary-guard.sh</code>.'
    },
    'is-5sec': {
        title: 'the 5-section summary', tag: 'state',
        what: 'A valid summary must carry exactly five sections, sit inside a length band, and put real content in each section. The five sections are not gospel for every seed — but the SHAPE is.',
        why: 'The shape forces decisions and corrections into durable memory, not just narrative — it shapes WHAT survives a conversation boundary.',
        hood: 'Required headers User Requests · Questions &amp; Decisions · Design Choices · Corrections &amp; Feedback · Current State (<code>summary.sh</code> · <code>REQUIRED_SECTIONS</code>); length band 200–1000 tokens (<code>SUMMARY_MIN/MAX_TOKENS</code>), each section ≥50 (<code>MIN_TOKENS_PER_SECTION</code>). Source: <code>interaction_summary/scripts/summary.sh</code>; <code>config.conf</code>.'
    },
    'is-chain': {
        title: 'summary_chain — append-only', tag: 'state',
        what: 'The accepted summaries, stored in order and never rewritten. A submit appends a new entry and advances the marker for what is already summarized.',
        why: 'The chain is the living mega-prompt: the durable narrative that carries job context across conversation boundaries, each entry owning a disjoint slice of history so nothing is re-summarized.',
        hood: 'Each entry <code>{timestamp, covers_up_to_index, summary, token_count}</code>; <code>last_summarized_index</code> is the high-water mark bounding "unsummarized". A valid submit appends, advances the index, clears <code>summary_needed=false</code>. Source: <code>interaction_summary/scripts/summary.sh</code> · submit arm.'
    },

    /* ---- Card 6: question_discipline deep ---- */
    'qd-gate': {
        title: 'question-discipline-gate.sh', tag: 'gate',
        what: 'A PreToolUse hook on AskUserQuestion: it blocks any question whose first token is not a registered prefix, forcing every interactive ask through the named-ceremony system.',
        why: 'Casual proceed/pause prompts are banned — every user-facing question is forced into a named category, so the user always knows what KIND of decision is being asked.',
        hood: 'Subagents bypass first (<code>CLAUDE_SUBAGENT==true → exit 0</code>); non-AskUserQuestion calls exit 0; then a first-token starts-with check <code>[[ "$qtext" == "$prefix"* ]]</code> against the registry. Source: <code>question_discipline/hooks/question-discipline-gate.sh</code>.'
    },
    'qd-registry': {
        title: 'PREFIX_REGISTRY', tag: 'state',
        what: 'A hardcoded, read-only list of the allowed question prefixes. It is a structural list, not a tunable number, so it lives in the hook itself rather than a config file.',
        why: 'This one array is where the seed’s entire ceremony surface is visible at a glance — the seed cannot invent a new ceremony prefix without a plugin edit.',
        hood: 'A <code>readonly</code> bash array of nine entries; match iterates ALL questions in a batched call. question_discipline carries NO <code>config.conf</code> and NO <code>data.json</code> — it is a pure gate. Source: <code>question_discipline/hooks/question-discipline-gate.sh</code> · <code>PREFIX_REGISTRY</code>.'
    },
    'qd-9': {
        title: 'the nine ceremonies', tag: 'state',
        what: 'The registered prefixes naming every interactive ceremony: plugin and test locks, operator maintenance, job completion and approval, the generic waiting ask, upstream reporting, and repeat-job.',
        why: 'Each prefix promotes one kind of decision to the user under a recognizable name — substrate edits, unrestricted mode, job closure, plugin-edit authority all announce themselves as such.',
        hood: 'Exactly nine: <code>[PLUGIN-LOCK]</code>, <code>[TEST-LOCK]</code>, <code>[GMODE]</code>, <code>[JOB-COMPLETE]</code>, <code>[WAITING]</code>, <code>[REPORT-TO-UPSTREAM]</code>, <code>[JOB-APPROVE-CREATION]</code>, <code>[JOB-APPROVE-PLUGIN]</code>, <code>[REPEAT-JOB]</code>. The canonical per-prefix definitions live in <code>job-system.md</code> · "prefixed questions". Source: same gate file.'
    },
    'qd-shape': {
        title: 'optional shape gate', tag: 'gate',
        what: 'After admission, the gate can also check that a question’s body carries the named sections its prefix requires — but only for prefixes that registered a shape. The rest pass through.',
        why: 'This upgrades discipline from "right label" to "right thinking": filling each named section IS the cognition the agent must have done before asking.',
        hood: 'Sources <code>lib/question_shape/check-sections.sh</code> against <code>lib/question_shape/prefix-shapes.conf</code>; prefixes without an entry are not enforced (opt-in). The per-prefix BUSINESS logic runs in each prefix’s OWNER plugin, not here. Source: <code>plugins-entities.md</code> · "question_shape body-shape enforcement".'
    },

    /* ---- Card 7: what they compose into ---- */
    'compose-organs': {
        title: 'single-concern organs', tag: 'object',
        what: 'Each plugin owns exactly one concern — edit-safety, job lifecycle, prompt compression, context hygiene, question discipline, phase orchestration, one phase each.',
        why: 'One concern per plugin is what keeps each one legible and independently testable — and what lets them be composed without a monolith.',
        hood: 'They are cognitive organs, not modules or services — the difference is that organs COMPOSE into ceremonies. Source: <code>plugins-entities.md</code> · "Active plugin inventory" Avoid-line.'
    },
    'compose-ceremony': {
        title: 'ceremonies no plugin performs alone', tag: 'action',
        what: 'The architecture’s real value is what the single-concern organs compose into — multi-plugin ceremonies like the historian ratchet and the lock-and-test cycle.',
        why: 'No single plugin performs these; they emerge from the organs cooperating. That is why the population matters more than any one member.',
        hood: 'The historian-ratchet and the safe-lock cycle are drawn in the companion "Plugin Cell &amp; Lock Ceremony" deck; the prefix gate that opens them is question_discipline. Source: <code>plugins-entities.md</code> · "Active plugin inventory".'
    },

    /* ---- Detail 0,1: phasic_system nuance ---- */
    'ps-fires': {
        title: 'fires continuously', tag: 'action',
        what: 'phasic_system has an always-on firing pattern — it conducts every phase transition, so something of it runs on essentially every cycle event.',
        why: 'This is the trap: by firing pattern it looks always-on. But a plugin’s layer is decided by its CONCERN, not by how often it fires.',
        hood: 'It registers transition + init hooks that fire across the cycle, but it calls only <code>job.sh</code> — a leaf in the dependency tree, so its failures cannot cascade. Source: <code>plugins-entities.md</code> · "Phasic layer" nuance; <code>phasic_system</code> leaf-topology.'
    },
    'ps-concern': {
        title: 'concern = phase orchestration', tag: 'context',
        what: 'Its job is conducting the phase machine — which is a phasic concern. That is why the canonical narrative places it in the phasic layer, not among the always-on five.',
        why: 'Classifying by concern keeps the always-on five a clean set (edit-safety, jobs, compression, context, questions) and names phasic_system as the conductor it is.',
        hood: 'It does NOT enforce per-phase tool restrictions — it delegates that to the five phase plugins (compartmentalization prevents a monolith). Source: <code>plugins-entities.md</code> · "Phasic layer".'
    },
    'ps-idle': {
        title: 'idle — the resting mode', tag: 'state',
        what: 'The non-OPEVC resting state between cycles. It is active only between jobs, not running underneath every phase the way the always-on five do.',
        why: 'Another reason phasic_system is not fully always-on even by behaviour: idle is a mode it owns that is active only in its own situation.',
        hood: 'idle blocks arbitrary work — only job/phase-management scripts run — until a prompt bootstraps a job. Owned by phasic_system, not a phase plugin. Source: <code>plugins-entities.md</code> · "Phasic layer" nuance.'
    },
    'ps-gmode': {
        title: 'gmode — operator maintenance', tag: 'state',
        what: 'The deliberate maintenance lane for substrate edits, active only when the operator enters it. The other non-OPEVC mode phasic_system owns.',
        why: 'Like idle, gmode is mode-switched — active only in its own situation — so neither of phasic_system’s special modes is always-on. Concern AND behaviour both place it in the phasic layer.',
        hood: 'Entered via the <code>[GMODE]</code> ceremony; owned by <code>phasic_system/hooks/gmode-*.sh</code> (gmode-hook / gmode-gate / gmode-return). Source: <code>plugins-entities.md</code> · "Phasic layer" nuance.'
    },

    /* ---- Detail 4,1: the mega-prompt pair ---- */
    'mp-record': {
        title: 'user_interactions[] — the RECORD', tag: 'state',
        what: 'job_core’s immutable log of what the user actually said, in order. The append-only ground truth half of the cumulative mega-prompt.',
        why: 'The record never changes, so there is always a faithful original to re-summarize against — the VIEW can be rebuilt, the RECORD cannot be corrupted.',
        hood: 'Lives in job_core’s <code>data.json</code> job object; written as interactions arrive. Pairs with interaction_summary’s chain. Source: <code>plugins-entities.md</code> · "interaction_summary" (mega-prompt pair); <code>job-system.md</code> · "cumulative mega-prompt".'
    },
    'mp-view': {
        title: 'summary_chain — the VIEW', tag: 'state',
        what: 'interaction_summary’s mutable, condensed view of that same history. Append-only, but each entry is a compression of the record up to a point.',
        why: 'The VIEW is what the job actually thinks against day to day — the dynamic prompt that stays legible as the RECORD grows without bound.',
        hood: 'Mirror-by-shared-id of job_core’s job; each chain entry covers a disjoint slice of <code>user_interactions[]</code>. Source: <code>interaction_summary/scripts/summary.sh</code>; <code>plugins-entities.md</code> · "interaction_summary".'
    },
    'mp-pair': {
        title: 'together = the mega-prompt', tag: 'context',
        what: 'The immutable RECORD and the mutable VIEW together are the cumulative mega-prompt — the full, legible context a focused job carries forward.',
        why: 'Splitting record from view is what lets the prompt be both faithful (RECORD) and compact (VIEW) at once — neither plugin owns both halves.',
        hood: 'Two plugins, one shared job id: job_core owns the RECORD, interaction_summary owns the VIEW. Source: <code>job-system.md</code> · "The cumulative mega-prompt".'
    },

    /* ---- Detail 5,1: question_discipline lifecycle ---- */
    'qdl-bypass': {
        title: '1 · subagent bypass', tag: 'action',
        what: 'The first check: if the caller is a subagent, the gate exits clean. A subagent investigates; it never becomes a second user-facing question surface.',
        why: 'Blocking a subagent’s tool calls would cascade failures without disciplining anyone — the gate is for the main session’s asks, not background work.',
        hood: '<code>CLAUDE_SUBAGENT==true → exit 0</code> — the same behavioral bypass interaction_summary’s guard uses. Source: <code>question_discipline/hooks/question-discipline-gate.sh</code> · subagent bypass.'
    },
    'qdl-tool': {
        title: '2 · tool filter', tag: 'gate',
        what: 'The second check: only AskUserQuestion calls are inspected. Every other tool call passes through untouched.',
        why: 'The gate has one job — disciplining questions — so it gets out of the way of all other work immediately.',
        hood: 'Non-<code>AskUserQuestion</code> tool → <code>exit 0</code>; a malformed/absent tool field also exits 0 silently (fail-open on the filter). Source: same gate file · tool gate.'
    },
    'qdl-cascade': {
        title: '3 · batch cascade', tag: 'gate',
        what: 'The core check: every question in a batched call must carry a registered prefix. One unprefixed question rejects the whole batch.',
        why: 'Strictness by design — there is no "mostly disciplined" batch. One casual question forces a rewrite of all, so the habit never slips.',
        hood: '<code>all_ok=1</code>; any question failing the first-token match sets <code>all_ok=0</code> → <code>exit 2</code> for the batch. Empty question arrays are also denied. Source: same gate file · all_ok loop.'
    },
    'qdl-shape': {
        title: '4 · optional shape', tag: 'gate',
        what: 'The last, opt-in check: for prefixes that registered a body shape, the gate verifies the named sections are present and substantial. Others pass.',
        why: 'Where a ceremony needs the agent to have thought through specific things, the shape makes that thinking mandatory — the right label plus the right content.',
        hood: 'Sources <code>lib/question_shape/check-sections.sh</code> vs <code>prefix-shapes.conf</code>; absent lib or no shape entry → pass. The per-prefix Post-handler logic lives in the OWNER plugin. Source: <code>plugins-entities.md</code> · question_discipline lifecycle.'
    },
    'qdl-catalytic': {
        title: 'smallest, most catalytic', tag: 'context',
        what: 'One hook, one array, no state — yet every new ceremony anywhere in the seed must add an entry here first. The least code, the most leverage.',
        why: 'That is why the registry is the one place the seed’s whole ceremony surface is legible: nothing interactive can exist without passing through this gate.',
        hood: 'No <code>config.conf</code>, no <code>data.json</code> — a pure behavioral gate. Adding a ceremony = adding a prefix here + (optionally) a shape in the shared lib. Source: <code>plugins-entities.md</code> · "question_discipline".'
    }
};

window.DECK_CARDS = {
    /* ===================== SEQUENCE ===================== */
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'The population',
        title: 'Two layers, split by WHEN they fire',
        sub: 'Every control the seed runs lives in one of two plugin layers — and the line between them is timing, not topic.',
        boxes: [
            { id: 'two-layers-seed', x: 380, y: 70, w: 220, h: 64, tag: 'context', t: 'the seed’s plugin substrate', s: '.claude/plugins/ — 14 organs' },
            { id: 'ao-layer', x: 130, y: 280, w: 290, h: 96, tag: 'context', t: 'always-on layer', s: 'fires on EVERY event' },
            { id: 'ph-layer', x: 560, y: 280, w: 290, h: 96, tag: 'context', t: 'phasic layer', s: 'one mode per PHASE' }
        ],
        edges: [
            { from: 'two-layers-seed', to: 'ao-layer', kind: 'hard', label: 'fires on every prompt / tool / session start' },
            { from: 'two-layers-seed', to: 'ph-layer', kind: 'hard', label: 'mode-switches per phase' }
        ],
        stickies: [
            { x: 360, y: 410, aha: true, text: 'Same substrate, two firing patterns: one underneath everything, one swapped in for the current phase.',
              ref: { url: '../05_1-the-two-layer-foundation.html', section: 'Essay 5.1 — The Two-Layer Foundation', blurb: 'The narrative home of the always-on / phasic split.' } }
        ],
        navHints: { right: '1,0', down: '0,1' }
    },

    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'Layer one',
        title: 'The always-on five never sleep',
        sub: 'Five single-concern plugins fire on every event, independent of job or phase — the infrastructure that surrounds everything else.',
        boxes: [
            { id: 'ao-fires', x: 380, y: 56, w: 220, h: 52, tag: 'action', t: 'fires on every event', s: 'phase-independent' },
            { id: 'pi', x: 24, y: 196, w: 170, h: 72, tag: 'object', t: 'plugin_integrity', s: 'edit-safety' },
            { id: 'jc', x: 214, y: 196, w: 170, h: 72, tag: 'object', t: 'job_core', s: 'job lifecycle' },
            { id: 'is', x: 404, y: 196, w: 170, h: 72, tag: 'object', t: 'interaction_summary', s: 'prompt compression' },
            { id: 'bg', x: 594, y: 196, w: 170, h: 72, tag: 'object', t: 'brain_guard', s: 'context hygiene' },
            { id: 'qd', x: 784, y: 196, w: 170, h: 72, tag: 'object', t: 'question_discipline', s: 'prefix gate' },
            { id: 'settings', x: 330, y: 372, w: 320, h: 60, tag: 'state', t: '.claude/settings.local.json', s: 'the brain-root registry' }
        ],
        edges: [
            { from: 'ao-fires', to: 'pi', kind: 'soft', label: '' },
            { from: 'ao-fires', to: 'jc', kind: 'soft', label: '' },
            { from: 'ao-fires', to: 'is', kind: 'soft', label: '' },
            { from: 'ao-fires', to: 'bg', kind: 'soft', label: '' },
            { from: 'ao-fires', to: 'qd', kind: 'soft', label: '' },
            { from: 'is', to: 'settings', kind: 'hard', label: 'each registers its hooks here' }
        ],
        stickies: [
            { x: 36, y: 320, text: 'Membership is a code fact — "active" means hooks registered in settings.local.json, not a label.' }
        ],
        navHints: { left: '0,0', right: '2,0' }
    },

    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'Layer two',
        title: 'The phasic layer swaps modes per phase',
        sub: 'An orchestrator conducts the phase machine; five phase plugins each enforce one phase’s tool law — one active at a time.',
        boxes: [
            { id: 'phasic-system', x: 370, y: 64, w: 240, h: 64, tag: 'object', t: 'phasic_system', s: 'the orchestrator' },
            { id: 'active-mode', x: 40, y: 210, w: 240, h: 72, tag: 'state', t: 'one mode active', s: 'set by the focused phase' },
            { id: 'phase5', x: 330, y: 210, w: 320, h: 72, tag: 'object', t: 'the five phase plugins', s: 'observe · plan · execute · verify · condense' },
            { id: 'maps', x: 700, y: 210, w: 240, h: 72, tag: 'state', t: 'FORWARD / BACKWARD maps', s: 'the legal transitions' }
        ],
        edges: [
            { from: 'phasic-system', to: 'phase5', kind: 'hard', label: 'delegates the per-phase tool law' },
            { from: 'phasic-system', to: 'maps', kind: 'hard', label: 'owns the transitions' },
            { from: 'phase5', to: 'active-mode', kind: 'soft', label: 'one active at a time' }
        ],
        stickies: [
            { x: 360, y: 360, aha: true, text: 'The always-on five keep running UNDERNEATH the active phasic mode — the phasic layer never replaces them.' }
        ],
        navHints: { left: '1,0', right: '3,0' }
    },

    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'The roster',
        title: '11 active, 2 designs, 1 shared tier',
        sub: 'The whole population, counted honestly — what runs, what is design-only, and the helper tier that belongs to no layer.',
        boxes: [
            { id: 'plugins-dir', x: 360, y: 44, w: 260, h: 56, tag: 'context', t: '.claude/plugins/', s: '14 directories' },
            { id: 'active-11', x: 60, y: 168, w: 270, h: 116, tag: 'object', t: '11 active plugins', s: '5 always-on + 6 phasic' },
            { id: 'unimpl-2', x: 370, y: 168, w: 240, h: 116, tag: 'state', t: '2 unimplemented', s: 'job_archiver · job_blocker' },
            { id: 'lib-tier', x: 650, y: 168, w: 270, h: 116, tag: 'object', t: 'lib/', s: 'shared helper tier — not a plugin' }
        ],
        edges: [
            { from: 'plugins-dir', to: 'active-11', kind: 'soft', label: 'registered' },
            { from: 'plugins-dir', to: 'unimpl-2', kind: 'soft', label: 'zero registrations' },
            { from: 'plugins-dir', to: 'lib-tier', kind: 'soft', label: 'owns no concern' }
        ],
        stickies: [
            { x: 60, y: 320, text: 'A roster of ROLES, not a status board — volatile per-plugin versions and test counts are deliberately left out.' }
        ],
        navHints: { left: '2,0', right: '4,0' }
    },

    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'Always-on, drawn deep',
        title: 'interaction_summary keeps the prompt legible',
        sub: 'It counts tokens after each turn and, past a threshold, blocks work until a structured summary carries the context forward.',
        boxes: [
            { id: 'is-detect', x: 50, y: 80, w: 250, h: 76, tag: 'action', t: 'token-counter.sh', s: 'detect (PostToolUse)' },
            { id: 'is-center', x: 380, y: 190, w: 220, h: 84, tag: 'object', t: 'interaction_summary', s: 'mega-prompt compressor' },
            { id: 'is-block', x: 50, y: 300, w: 250, h: 76, tag: 'gate', t: 'summary-guard.sh', s: 'enforce (PreToolUse, exit 2)' },
            { id: 'is-5sec', x: 680, y: 300, w: 250, h: 76, tag: 'state', t: 'the 5-section summary', s: 'required shape + length band' },
            { id: 'is-chain', x: 680, y: 80, w: 250, h: 76, tag: 'state', t: 'summary_chain', s: 'append-only, the living prompt' }
        ],
        edges: [
            { from: 'is-detect', to: 'is-center', kind: 'soft', label: 'token_count ≥ 500 → flag' },
            { from: 'is-center', to: 'is-block', kind: 'hard', label: 'blocks all tools until submit' },
            { from: 'is-block', to: 'is-5sec', kind: 'soft', label: 'escape = submit a summary' },
            { from: 'is-5sec', to: 'is-chain', kind: 'hard', label: 'appends + advances the marker' }
        ],
        stickies: [
            { x: 350, y: 412, text: 'Soft-before-hard: detect nudges silently first; the block is the fallback only when the nudge does not land.',
              ref: { url: '../05_5-interaction-summary.html', section: 'Essay 5.5 — Mega-Prompt Compression', blurb: 'interaction_summary in full.' } }
        ],
        navHints: { left: '3,0', right: '5,0', down: '4,1' }
    },

    '5,0': {
        kind: 'seq', step: 6,
        eyebrow: 'Always-on, drawn deep',
        title: 'question_discipline gates every ask',
        sub: 'The smallest plugin, the most catalytic: no question reaches the user unless its first token is a registered ceremony prefix.',
        boxes: [
            { id: 'qd-gate', x: 370, y: 72, w: 240, h: 64, tag: 'gate', t: 'question-discipline-gate.sh', s: 'PreToolUse:AskUserQuestion' },
            { id: 'qd-9', x: 50, y: 214, w: 260, h: 72, tag: 'state', t: 'the nine ceremonies', s: 'PLUGIN-LOCK … REPEAT-JOB' },
            { id: 'qd-registry', x: 370, y: 214, w: 240, h: 72, tag: 'state', t: 'PREFIX_REGISTRY', s: 'hardcoded readonly array' },
            { id: 'qd-shape', x: 670, y: 214, w: 260, h: 72, tag: 'gate', t: 'optional shape gate', s: 'opt-in body sections' }
        ],
        edges: [
            { from: 'qd-gate', to: 'qd-registry', kind: 'hard', label: 'first token must match' },
            { from: 'qd-registry', to: 'qd-9', kind: 'soft', label: 'exactly 9 entries' },
            { from: 'qd-gate', to: 'qd-shape', kind: 'soft', label: 'then, if registered, check the body' }
        ],
        stickies: [
            { x: 360, y: 360, aha: true, text: 'One array is where the seed’s whole ceremony surface is visible — no new ceremony without an entry here first.',
              ref: { url: '../05_6-question-discipline.html', section: 'Essay 5.6 — Structured Questions', blurb: 'question_discipline in full.' } }
        ],
        navHints: { left: '4,0', right: '6,0', down: '5,1' }
    },

    '6,0': {
        kind: 'seq', step: 7,
        eyebrow: 'Why the population matters',
        title: 'Single-concern organs compose into ceremonies',
        sub: 'No plugin is impressive alone. The architecture’s value is what these single-concern organs build together.',
        boxes: [
            { id: 'compose-organs', x: 80, y: 170, w: 290, h: 110, tag: 'object', t: 'single-concern organs', s: 'one concern each' },
            { id: 'compose-ceremony', x: 610, y: 170, w: 300, h: 110, tag: 'action', t: 'ceremonies no plugin performs alone', s: 'historian ratchet · lock cycle' }
        ],
        edges: [
            { from: 'compose-organs', to: 'compose-ceremony', kind: 'hard', label: 'compose into' }
        ],
        stickies: [
            { x: 330, y: 350, text: 'Organs, not modules — the difference is that organs COMPOSE. The population is the point, not any one member.' }
        ],
        navHints: { left: '5,0' }
    },

    /* ===================== DETAIL ===================== */
    '0,1': {
        kind: 'detail', step: 1,
        eyebrow: 'Detail · the orchestrator’s classification',
        title: 'Why phasic_system is NOT always-on',
        sub: 'It fires continuously, yet it lives in the phasic layer — because a plugin is classified by its concern, and even its behaviour is mode-switched.',
        boxes: [
            { id: 'ps-fires', x: 60, y: 90, w: 270, h: 76, tag: 'action', t: 'fires continuously', s: 'conducts every transition' },
            { id: 'ps-concern', x: 400, y: 90, w: 290, h: 76, tag: 'context', t: 'concern = phase orchestration', s: 'classified by concern' },
            { id: 'ps-idle', x: 120, y: 280, w: 250, h: 76, tag: 'state', t: 'idle', s: 'resting mode (non-OPEVC)' },
            { id: 'ps-gmode', x: 560, y: 280, w: 250, h: 76, tag: 'state', t: 'gmode', s: 'operator maintenance (non-OPEVC)' }
        ],
        edges: [
            { from: 'ps-fires', to: 'ps-concern', kind: 'soft', label: 'but layer follows concern' },
            { from: 'ps-concern', to: 'ps-idle', kind: 'soft', label: 'owns the resting mode' },
            { from: 'ps-concern', to: 'ps-gmode', kind: 'soft', label: 'owns the maintenance lane' }
        ],
        stickies: [
            { x: 330, y: 392, text: 'idle and gmode are active only in their own situations — so phasic_system is not fully always-on by behaviour either.' }
        ],
        navHints: { up: '0,0' }
    },

    '4,1': {
        kind: 'detail', step: 5,
        eyebrow: 'Detail · the cumulative mega-prompt',
        title: 'Two halves: the RECORD and the VIEW',
        sub: 'interaction_summary owns only half the mega-prompt. job_core owns the immutable other half — and the split is what makes the prompt both faithful and compact.',
        boxes: [
            { id: 'mp-record', x: 80, y: 120, w: 300, h: 104, tag: 'state', t: 'user_interactions[]', s: 'job_core · immutable RECORD' },
            { id: 'mp-view', x: 600, y: 120, w: 300, h: 104, tag: 'state', t: 'summary_chain', s: 'interaction_summary · mutable VIEW' },
            { id: 'mp-pair', x: 360, y: 300, w: 260, h: 76, tag: 'context', t: 'the cumulative mega-prompt', s: 'RECORD + VIEW together' }
        ],
        edges: [
            { from: 'mp-record', to: 'mp-pair', kind: 'soft', label: 'faithful original' },
            { from: 'mp-view', to: 'mp-pair', kind: 'soft', label: 'compact, re-buildable' }
        ],
        stickies: [
            { x: 330, y: 400, text: 'Same job id, two plugins: the RECORD can’t be corrupted, the VIEW can be rebuilt from it. Neither owns both.' }
        ],
        navHints: { up: '4,0' }
    },

    '5,1': {
        kind: 'detail', step: 6,
        eyebrow: 'Detail · the gate, step by step',
        title: 'Four checks before a question reaches the user',
        sub: 'bypass subagents · ignore non-questions · require a prefix on every question in the batch · optionally check the body shape.',
        boxes: [
            { id: 'qdl-bypass', x: 36, y: 120, w: 210, h: 84, tag: 'action', t: '1 · subagent bypass', s: 'CLAUDE_SUBAGENT → exit 0' },
            { id: 'qdl-tool', x: 270, y: 120, w: 210, h: 84, tag: 'gate', t: '2 · tool filter', s: 'AskUserQuestion only' },
            { id: 'qdl-cascade', x: 504, y: 120, w: 210, h: 84, tag: 'gate', t: '3 · batch cascade', s: 'all must be prefixed' },
            { id: 'qdl-shape', x: 738, y: 120, w: 210, h: 84, tag: 'gate', t: '4 · optional shape', s: 'opt-in sections' },
            { id: 'qdl-catalytic', x: 290, y: 300, w: 400, h: 72, tag: 'context', t: 'smallest, most catalytic', s: 'one hook · one array · no state' }
        ],
        edges: [
            { from: 'qdl-bypass', to: 'qdl-tool', kind: 'hard', label: '' },
            { from: 'qdl-tool', to: 'qdl-cascade', kind: 'hard', label: '' },
            { from: 'qdl-cascade', to: 'qdl-shape', kind: 'hard', label: '' }
        ],
        stickies: [
            { x: 300, y: 396, text: 'One unprefixed question in a batched call rejects the WHOLE batch — discipline never half-applies.' }
        ],
        navHints: { up: '5,0' }
    }
};
