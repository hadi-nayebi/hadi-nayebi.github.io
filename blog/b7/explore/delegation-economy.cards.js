/* ============================================================================
 * delegation-economy.cards.js — CONTENT for the "80/20 Delegation Economy" deck.
 * Teaches the DELEGATION cluster (opevc-delegation.md): the labour split; the
 * direct-action budget that mechanizes it; the subagent gate exemption (selective
 * freedom); the per-plugin pools + namespace-prefix scoping; the per-phase rosters
 * (operational workers + one metacog reflector); the two shared-lib wiring hooks
 * (agent-symlink = discovery, agent-tracker = accounting); and the richer optional
 * form — the Workflow execution layer (design, post-oss) + the built, instruction-
 * borne fractal inner-OPEVC. Paired with the shared deck-engine.js + .css (in
 * b6/explore — referenced cross-dir from the loader). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section/key), never line numbers
 * (Rule 20). Rot-prone counts (test totals) are NOT pinned; the roster sizes are
 * ls-verified live and framed as "currently".
 * Ground truth: the [consolidated] cluster .claude/context/opevc-delegation.md.
 * Sources (all own-grep verified live):
 *   phase_{observe,plan,execute,verify,condense}/config.conf — AGENT_BUDGET_GRANT=3
 *     in all five; BUDGET_STARTING=5 (observe + execute); READ_BUDGET_COST=1 (observe)
 *     / EDIT_BUDGET_COST=1 (execute + condense); plus the coaching BUDGET_TOTAL=100.
 *   phase_observe/hooks/observe-guard.sh — AGENT_TYPE from `.agent_type // "main"`;
 *     the pacing logic gates behind == "main", subagents (!= "main") fall through.
 *   lib/agent-registry/agent-symlink.sh — "PostToolUse:Write hook (shared utility,
 *     all plugins)"; symlinks a newly-authored agents/<prefix>-<name>.md into
 *     .claude/agents/ (symlink not copy; restart to discover).
 *   lib/agent-registry/agent-tracker.sh — "SubagentStart (shared utility)"; resolves
 *     the phase gateway and calls track-agent on a current-phase prefix match.
 *   phase_<p>/agents/ — ls-verified rosters: observe 12 op + blindspot-finder; plan 8 op
 *     + premortem; execute 3 op + drift-auditor; verify 5 op + meta-audit; condense 7
 *     op + promotion-scan; historian 12 (plugin_integrity) + 1 (question_discipline).
 *   + .claude/context/opevc-delegation.md (design ground truth, [consolidated]);
 *     Workflow + Phase-to-workflow contract carry **Ship: design — post-oss adoption**
 *     (taught here as design-layer, NOT live); fractal OPEVC is **built** (entry notes).
 * ============================================================================ */
window.DECK_META = { page: 'delegation-economy', seqLabel: 'the 80/20 delegation economy' };

window.DECK_INFO = {
    /* ---- Card 0,0: the labour split ---- */
    'main-orchestrates': {
        title: 'Main session — the 20%', tag: 'state',
        what: 'The orchestrator holds the cross-cutting view: high-level judgment, synthesis across findings, and the decision of what to dispatch. This share is irreducible — it cannot be handed to a subagent.',
        why: 'Some work needs the whole job in one head at once. Keeping that in the main session is what lets the bulk be pushed out safely; the orchestrator is the one context that sees how the pieces fit.',
        hood: 'The root brain states it flat: "Main session (20%) = orchestration + memory. Subagents (80%) = execution" (root <code>CLAUDE.md</code> · "80/20 Rule"). It is 20% of the direct DOING, but 100% of judgment. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'subagents-bulk': {
        title: 'Subagents — the 80%', tag: 'object',
        what: 'The bulk of cognitive labour runs in dispatched subagents: parallel investigation and execution whose findings return condensed. Work that does not need the orchestrator’s combined view is pushed out to fresh contexts.',
        why: 'One context window cannot hold a large job. Fanning work into fresh subagent contexts is how the seed scales past what a single window could carry, with each subagent returning only what matters.',
        hood: 'In OBSERVE the body says it plainly — "the main session orchestrates, the subagents investigate". Each subagent is a dispatched Claude Code instance, scoped tighter than the main session. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'one-context': {
        title: 'The hard constraint', tag: 'context',
        what: 'One context window cannot hold a large job. That single limit is the reason the architecture splits labour at all — the delegation economy exists to answer it, not as a style preference.',
        why: 'Naming the constraint keeps the split honest. The 80/20 is not advice about good habits; it is the seed’s mechanical answer to a real ceiling, so it is enforced as a budget rather than coached as a guideline.',
        hood: 'The blog hardens the slogan into a mechanism: "the prototype targets roughly 80/20 … not a guideline; it is a budget the main session must earn through dispatch" (<code>07_6</code>). Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'the-budget': {
        title: 'The meter that enforces it', tag: 'gate',
        what: 'A per-phase budget mechanizes the split: it decides when the main session may act on files directly versus must delegate. The meter is live from the first action, paired with the gate exemption that lets fan-out run unthrottled.',
        why: 'A slogan drifts; a meter does not. By making the split a counted resource the main session spends and re-earns, the architecture turns "delegate more" from advice into a condition the work must satisfy.',
        hood: 'The comment states the intent: "Budget system mechanizes the 80/20 subagent delegation rule" (<code>observe-guard.sh</code> · "Direct-Action Budget System" header). Walk right for grant / consume / block. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },

    /* ---- Card 1,0: the direct-action budget ---- */
    'starting-balance': {
        title: 'Start with five', tag: 'state',
        what: 'Every phase entry seeds the budget with a starting balance of five direct actions. The seed can begin working directly, and as it spends the balance it learns that subagents are how the budget replenishes.',
        why: 'The starting balance is a teaching device. It keeps the main session free for some direct work while making the lesson unavoidable: once the five are spent, the only way forward is to delegate.',
        hood: '<code>BUDGET_STARTING=5</code> (phase_observe + phase_execute <code>config.conf</code>) seeds the meter at entry — the earlier opt-in form ("inactive until the first grant") is retired. Walk down for the per-phase arithmetic. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'consume-direct': {
        title: 'Consume per direct action', tag: 'action',
        what: 'A direct project action draws against the balance. The trigger differs by phase: OBSERVE, PLAN, and VERIFY charge per direct read; EXECUTE and CONDENSE charge per file edit. Working directly costs budget.',
        why: 'Charging the direct path is what makes delegation the cheaper route over time. The seed feels the cost of doing everything itself, which nudges the bulk of labour outward where it belongs.',
        hood: 'OBSERVE/PLAN/VERIFY charge <code>READ_BUDGET_COST=1</code> per non-CLAUDE.md read; EXECUTE/CONDENSE charge <code>EDIT_BUDGET_COST=1</code> per edit (<code>config.conf</code> + the consume call in each <code>*-tracker.sh</code>). Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'grant-dispatch': {
        title: 'Grant per dispatch', tag: 'action',
        what: 'Launching a phase-matched subagent grants budget back — three units per launch. Dispatch is the replenishment mechanism; the more the seed delegates, the more direct headroom it earns.',
        why: 'This closes the loop. Direct work spends; delegation earns. The arithmetic makes the 80/20 split self-correcting — a session that never delegates simply runs out of room to act directly.',
        hood: '<code>AGENT_BUDGET_GRANT=3</code> is declared in all five phase <code>config.conf</code>s; the grant arm in <code>observe.sh</code> also bumps <code>subagent_unlock_grants</code>. The grant keys on the launch, tracked by <code>agent-tracker.sh</code>. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'block-zero': {
        title: 'Block at zero', tag: 'gate',
        what: 'When the balance reaches zero, the phase guard blocks the next direct action with a voice recommending dispatch. The only way forward is to launch another subagent and earn more budget.',
        why: 'The block is where the meter has teeth. Up to zero the seed works freely; at zero the architecture forces the delegation it has been nudging toward, without ever pausing the orchestrator’s judgment.',
        hood: 'The EXECUTE guard hard-blocks further edits via the <code>direct-action-budget-blocked</code> voice; the same arm exists in observe / plan / verify / condense guards. <code>07_6</code>: "the EXECUTE guard hard-blocks further edits". Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },

    /* ---- Card 2,0: the gate exemption ---- */
    'agent-type-flag': {
        title: 'The discriminator', tag: 'state',
        what: 'One flag decides whether the pacing gates apply: the agent type. The main session reads as "main"; every dispatched subagent reads as something else. That single difference is what the exemption keys on.',
        why: 'The pacing gates are designed to slow one orchestrator down so it synthesises. A subagent is not the orchestrator, so the same gates would only deadlock it. The flag is how the seed tells them apart.',
        hood: '<code>AGENT_TYPE</code> comes from the hook stdin <code>.agent_type // "main"</code> (read in <code>observe-guard.sh</code>); sensors/trackers early-exit on <code>!= "main"</code>. <code>CLAUDE_SUBAGENT</code> is a vestigial env var — retired as the phase-guard/subagent-gate discriminator (unset for Task + Workflow agents at the hook layer); one narrow historic use remains inside <code>plugin_integrity/hooks/plugin-guard.sh</code> only. Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'bypass-pacing': {
        title: 'Bypass the pacing', tag: 'gate',
        what: 'Dispatched subagents skip the behavioural pacing gates: the min-max rhythm, the comment-density gate, budget consumption, and the question-discipline gate. Without this, three subagents launched at once would each trip the rhythm and deadlock.',
        why: 'Parallel fan-out is the whole point of delegation. Gating each subagent on a rhythm meant to pace a single orchestrator would throttle exactly the parallelism the economy depends on.',
        hood: 'The observe pool states it: subagents are "exempt from: the min synthesis floor and the per-class max accumulation ceilings" (<code>phase_observe/agents/CLAUDE.md</code> · Rhythm Gate Exemption). The min-max gate applies to the MAIN session only. Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'keep-structure': {
        title: 'Keep the structure', tag: 'object',
        what: 'What the exemption does NOT touch: path scope and the lock boundary. But these are relocated — a subagent’s edit surface is bounded by its own agent-definition tool access, not the main guard’s altered list.',
        why: 'The bypass is a selective freedom, never an absence of control. Each subagent must have exactly the controls it needs — read-only auditors cannot write at all, historians write only their docs, execute workers touch project files.',
        hood: 'The structural block: "Subagents are NOT exempt from: tool restrictions and CLAUDE.md-only edits" (<code>phase_observe/agents/CLAUDE.md</code>); the <code>## Subagent Exemption (Structural)</code> block in <code>execute-guard.sh</code> relocates scope to the agent definition. Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'workflow-inherits': {
        title: 'Workflows inherit it', tag: 'object',
        what: 'Because the exemption keys on the agent type being non-main, a workflow agent gets it for free. A generic workflow agent reads as a workflow subagent; a typed one reads as its name — either way, not main.',
        why: 'It means the seed can orchestrate the same subagents inside a workflow with no special casing. The control layer already governs workflow agents through the same discriminator — there is no enforcement hole.',
        hood: 'A generic workflow agent presents <code>agent_type=workflow-subagent</code>; a typed one (<code>agentType:X</code>) presents <code>X</code> — both <code>!= "main"</code> (empirically probed). A typed agent named for a phase roster also inherits that prefix’s scope. Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },

    /* ---- Card 3,0: the pools ---- */
    'agents-pool': {
        title: 'agents/ — the pool', tag: 'object',
        what: 'A directory of subagent definitions a plugin owns: the organ through which that plugin delegates investigation. The definitions are markdown files; the running subagent is a dispatched instance, not stored here.',
        why: 'Pools are per-plugin, never one global pool. A plugin that delegates research grows its pool over time; the directory is where a concern’s delegation depth is customised, one definition at a time.',
        hood: 'Nine active plugins ship <code>agents/</code> — the five phase plugins plus <code>phasic_system</code>, <code>plugin_integrity</code>, <code>brain_guard</code>, and <code>question_discipline</code>. The two job plugins (<code>job_archiver</code>, <code>job_blocker</code>) are unimplemented designs — no registered hooks or functional agents/. Discovery is wired by <code>agent-symlink.sh</code>. Source: <code>opevc-delegation.md</code> · "agents/ (per-plugin subagent pool)".'
    },
    'prefix-marker': {
        title: 'The prefix is the boundary', tag: 'state',
        what: 'Every subagent’s name is prefixed by its concern: observe, plan, execute, verify, condense, historian. The prefix is the lock-boundary marker and the routing key in one — it names the concern, and the owning plugin follows.',
        why: 'Scoping is a consequence of the lock contract, not an arbitrary taxonomy. The prefix makes a subagent’s surface match exactly the one plugin it is allowed to edit.',
        hood: 'Each phase guard whitelists its own <code>&lt;phase&gt;-*</code> agents plus the universal <code>historian-*</code> / <code>post-compact-*</code> and blocks the rest (the wrong-prefix block in each <code>&lt;phase&gt;-guard.sh</code>). The rule is organic — cross-phase callability is a case-by-case design choice. Source: <code>opevc-delegation.md</code> · "namespace-prefix and per-plugin scoping".'
    },
    'lock-boundary': {
        title: 'Why not one global pool', tag: 'gate',
        what: 'Only one plugin may be unlocked at a time. A subagent that ranged across plugins would have to coordinate locks across every directory it touched, defeating the unlock discipline. Per-plugin scoping makes the surface match the lock boundary.',
        why: 'The single-unlocked-plugin invariant is the safety floor for plugin edits. Tying each subagent to one plugin’s boundary keeps that invariant intact even while many subagents run in parallel.',
        hood: 'The invariant lives in <code>plugin_integrity/hooks/lock-manager.sh</code> (the single-unlocked-plugin guard); <code>07_6</code>: "Per-plugin scoping makes the subagent’s surface match the lock boundary exactly". Source: <code>opevc-delegation.md</code> · "namespace-prefix and per-plugin scoping".'
    },
    'stateful-skip': {
        title: 'Stateful plugins skip it', tag: 'context',
        what: 'Not every plugin has a pool. The only question that decides is whether the concern delegates research. A pool appears where the concern investigates, and is absent where the concern is local state mutation.',
        why: 'It keeps the kit honest about what an organ is for. A job-lifecycle or summary concern is a local state machine, not a research surface — giving it a pool would be ceremony with nothing to dispatch.',
        hood: 'The two stateful plugins — <code>job_core</code> and <code>interaction_summary</code> — ship <code>hooks/</code>, <code>scripts/</code>, <code>docs/</code>, <code>tests/</code> but no <code>agents/</code> (<code>07_6</code>: "their concerns are local state machines, not research surfaces"). Source: <code>opevc-delegation.md</code> · "agents/ (per-plugin subagent pool)".'
    },

    /* ---- Card 4,0: the rosters ---- */
    'operational-tier': {
        title: 'The operational tier', tag: 'object',
        what: 'Each phase ships a curated set of subagents that do its actual labour — investigators, workers, and auditors sized to that phase. OBSERVE fields the most; EXECUTE the fewest; each shaped to its phase’s work.',
        why: 'The roster is the primary customization surface for delegation depth. An architect tunes how deeply a phase delegates by adding, removing, or reshaping the subagents in its pool.',
        hood: 'Currently (ls-verified live): observe 12 operational investigators, plan 8 analysts, execute 3 workers, verify 5 auditors, condense 7 waterfall + audit workers, plus 13 <code>historian-*</code> across plugins. Counts grow as concerns earn agents. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'reflector-member': {
        title: 'Plus one reflector', tag: 'object',
        what: 'Every roster also holds one metacognitive reflector — dispatched DURING the phase to reflect on the work and feed the compaction file. The exit voice fires separately at the advance boundary and does NOT launch the reflector; it is the phase’s additional, mandatory-at-exit roster member.',
        why: 'Operational subagents do the work; the reflector judges how the work went. Pairing both in one roster is what makes reflection a first-class, tunable part of each phase rather than an afterthought.',
        hood: 'The five reflectors, one per phase: OBSERVE <code>blindspot-finder</code>, PLAN <code>premortem</code>, EXECUTE <code>drift-auditor</code>, VERIFY <code>meta-audit</code>, CONDENSE <code>promotion-scan</code> (all ls-verified live). Running one satisfies family-c of the three-family exit gate. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'the-roster': {
        title: 'The customization surface', tag: 'object',
        what: 'The roster is the single home for both classes — operational workers and the reflector. Tuning the roster tunes both flat dispatch and any future per-phase workflow, since a workflow orchestrates these same agents.',
        why: 'One surface, two payoffs. Because workflows call the roster by name rather than inventing new agents, the roster is the one place an architect shapes delegation for every dispatch style at once.',
        hood: 'A workflow step naming <code>agentType: "execute-file-editor"</code> dispatches that exact roster agent (empirically probed). "The architect would tune the subagent roster" (<code>06_3</code>). Walk down for the shared agent shape. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'drop-an-md': {
        title: 'Customize by dropping a file', tag: 'action',
        what: 'An architect customizes a phase’s delegation by dropping a new prefixed markdown file into that phase’s agents directory. The wiring hooks pick it up; no central registration step is edited by hand.',
        why: 'It keeps extension low-ceremony. Adding delegation capacity to a phase is authoring one file in the right place — the discovery and accounting plumbing is shared and automatic.',
        hood: 'A new <code>&lt;phase&gt;-&lt;name&gt;.md</code> in the phase’s <code>agents/</code> is auto-symlinked into <code>.claude/agents/</code> by <code>agent-symlink.sh</code> (a session restart makes it discoverable). Walk right for the two wiring hooks. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },

    /* ---- Card 5,0: the two wiring hooks ---- */
    'agent-symlink': {
        title: 'Symlink — discovery', tag: 'action',
        what: 'When a write lands on a plugin’s agents directory, a shared hook auto-creates a symlink in the flat directory Claude Code scans for subagents. It is the bridge from the per-plugin pool to discovery, with no manual registration.',
        why: 'The canonical definition stays inside its owning plugin; discovery is a symlink, not a copy. Editing the canonical file updates discovery instantly with no drift between two copies.',
        hood: '<code>lib/agent-registry/agent-symlink.sh</code> — "PostToolUse:Write hook (shared utility, all plugins)". Fires only on Write, filters to the dash-pattern name, idempotent, symlink-not-copy. New agents need a session restart to be discovered. Source: <code>opevc-delegation.md</code> · "agent-symlink.sh".'
    },
    'agent-tracker': {
        title: 'Track — accounting', tag: 'action',
        what: 'On every subagent launch, a second shared hook asks whether the agent belongs to the current phase, and if so tells that phase’s gateway it happened. It is the accounting counterpart to the discovery symlink.',
        why: 'The launch record is what the mechanical cognition runs on: it feeds the budget grant, the family-c reflector check, and the per-entry launch history. Tracking is how a dispatch turns into earned budget and a satisfied gate.',
        hood: '<code>lib/agent-registry/agent-tracker.sh</code> — "SubagentStart (shared utility)". Early-exits on idle/gmode, requires a prefix match (<code>"$AGENT_TYPE" != "${current_phase}-"*</code> exits), then calls the gateway’s <code>track-agent</code> arm. Source: <code>opevc-delegation.md</code> · "agent-tracker.sh".'
    },
    'discovery-dir': {
        title: 'The flat scan directory', tag: 'object',
        what: 'Claude Code looks for subagents in one flat directory. The symlink hook populates it from the scattered per-plugin pools, so the canonical definitions can stay organised by plugin while discovery stays simple.',
        why: 'Two needs, one resolution: humans want definitions filed by owning plugin; the platform wants a flat lookup. The symlink layer lets both be true at once, with a single source of truth.',
        hood: 'Symlinks live in <code>.claude/agents/</code> (where Claude Code scans); the canonical <code>.md</code> stays in <code>plugins/&lt;plugin&gt;/agents/</code>. The hook is registered under the <code>PostToolUse</code> <code>Write</code> matcher in <code>settings.local.json</code>. Source: <code>opevc-delegation.md</code> · "agent-symlink.sh".'
    },
    'feeds-cognition': {
        title: 'The launch record', tag: 'state',
        what: 'A tracked launch is more than a log line. The same record drives the budget grant, the reflector check at phase exit, and the per-entry launch history the gates read. Subagent calls are tracked to drive mechanical cognition.',
        why: 'It is why the delegation economy holds together: a dispatch simultaneously earns budget, advances the exit gate, and leaves an audit trail — all from one tracked event rather than three separate bookkeeping steps.',
        hood: 'The gateway’s <code>track-agent</code> arm increments the per-entry <code>agent_launches</code> record; family-c of the three-family exit gate reads it; the budget grant keys on the same launch. All five phase gateways implement <code>track-agent</code>. Source: <code>opevc-delegation.md</code> · "agent-tracker.sh".'
    },

    /* ---- Card 6,0: the richer form ---- */
    'workflow-tool': {
        title: 'Workflow — the richer form', tag: 'object',
        what: 'The Workflow utility is the seed’s optional, richer form of the eighty-percent delegated labour: deterministic code that fans out subagents to do a phase’s work. It is the soft-to-hard maturation of ad-hoc dispatch into a codified, learnable shape.',
        why: 'Dispatch judged case-by-case becomes a parameterized pipeline a phase can reuse. It does not replace direct dispatch — it is the richer option the seed reaches for where structure helps.',
        hood: 'Carries <strong>Ship: design — post-oss adoption</strong> (subagent-first for v1). No <code>workflow.sh</code> exists; it is a Claude Code tool. Adoption needs no control-layer change — the guards already govern workflow agents. Source: <code>opevc-delegation.md</code> · "Workflow (execution layer)".'
    },
    'same-rosters': {
        title: 'It orchestrates the rosters', tag: 'object',
        what: 'A workflow invents no new agents. It drives the same per-phase rosters by name, so a workflow step is just another way to call the subagents the seed already owns — under the same scope and the same gate exemption.',
        why: 'This is what keeps the workflow from being a new primitive. It is a disposable sub-orchestrator of the same agentic substrate, which is why tuning a roster also tunes what any per-phase workflow can call.',
        hood: 'A step naming <code>agentType: "execute-file-editor"</code> dispatches that exact roster agent, which hits the live phase guard and inherits its scope + exemption (empirically probed). A step with no <code>agentType</code> runs as the generic <code>workflow-subagent</code>. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'fractal-inner': {
        title: 'The fractal inner cycle', tag: 'context',
        what: 'Each outer phase’s labour itself follows an implicit mini-cycle: look for the files, decide what to engage, do the reading or building, check what came back, and write into the CLAUDE.md layer. Writing into CLAUDE.md is the inner condense.',
        why: 'It is a template the work naturally follows, not a mandate. Nothing enforces the inner cycle — the entry voice coaches it, degenerate sub-moves collapse, and the outer hard guard caps whatever the inner soft-cycle tries.',
        hood: 'Carries <strong>Ship: built</strong> — instruction-borne via the phase entry notes (the Workflow realisation is the post-oss form). An inner "execute" that writes during an outer OBSERVE is blocked by the read-only observe guard. Source: <code>opevc-delegation.md</code> · "Fractal OPEVC (inner implicit cycle)".'
    },
    'case-by-case': {
        title: 'The seed picks per phase', tag: 'state',
        what: 'How a phase does its labour — direct work, flat subagent calls, or a future workflow — is the seed’s case-by-case combo, not a budget distinction. The implicit cycle runs through all three; the choice is the generic flow, not a fixed mode.',
        why: 'Flexibility is the point. The budget meters direct-doing versus delegation; which delegation shape to use is a judgment the seed makes per phase, reaching for the form that fits the work in front of it.',
        hood: 'The grant/consume arithmetic does not change with the form: a workflow’s agents earn the same grant as a flat dispatch. Workflow nesting is platform-bounded at 2-deep; only the outer CONDENSE persists. Source: <code>opevc-delegation.md</code> · "Fractal OPEVC (inner implicit cycle)".'
    },

    /* ---- Detail 1,1: the per-phase arithmetic ---- */
    'grant-3': {
        title: 'Grant +3, everywhere', tag: 'action',
        what: 'The grant is the same in every phase: three budget units per phase-matched subagent launch. All five phases carry identical replenishment arithmetic, read from one config key.',
        why: 'Uniformity makes the rule legible. The seed does not relearn the economy per phase — the same earn-by-dispatch contract holds whether it is observing, planning, executing, verifying, or condensing.',
        hood: '<code>AGENT_BUDGET_GRANT=3</code> appears in all five phase <code>config.conf</code>s; the grant handler defaults to 3 and also increments <code>subagent_unlock_grants</code> (the grant arm in <code>observe.sh</code>). Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'consume-read': {
        title: 'Consume per read (O/P/V)', tag: 'action',
        what: 'In OBSERVE, PLAN, and VERIFY the budget is charged per direct read of a non-working-memory file. These are the read-heavy phases, so the cost lands on reading project files directly instead of delegating the investigation.',
        why: 'The consume trigger matches each phase’s real work. OBSERVE/PLAN/VERIFY mostly read, so the meter charges reads — the action whose volume the delegation economy most wants pushed out to subagents.',
        hood: '<code>READ_BUDGET_COST=1</code> (phase_observe <code>config.conf</code>); the <code>consume-direct-action-budget</code> call sits in <code>observe-tracker.sh</code>’s Read arm, blocked by the <code>direct-action-budget-blocked</code> voice. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'consume-edit': {
        title: 'Consume per edit (E/C)', tag: 'action',
        what: 'In EXECUTE and CONDENSE the budget is charged per file edit instead — every non-plugin file edit in EXECUTE, every synthesis edit in CONDENSE. The key is the edit cost, never the read cost, because these phases produce changes.',
        why: 'The write-heavy phases consume on the action they actually take. Charging edits is what makes a long EXECUTE earn its direct work through dispatch rather than editing unmetered.',
        hood: '<code>EDIT_BUDGET_COST=1</code> (phase_execute + phase_condense <code>config.conf</code>); the consume sits in each <code>*-tracker.sh</code> edit arm. In CONDENSE <code>voice.xml</code> edits are exempt by design. Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },
    'starting-5': {
        title: 'Not the coaching budget', tag: 'state',
        what: 'Two things are named budget; only one gates direct action. OBSERVE also declares a coaching total of one hundred with work and quality pools, but that meter only picks which coaching voice fires — it never gates dispatch.',
        why: 'Keeping them distinct prevents a real confusion. The gate starts at the five-action balance; the hundred is an unrelated coaching meter, and conflating them would misread how the delegation economy actually works.',
        hood: '<code>BUDGET_STARTING=5</code> is the gate; <code>BUDGET_TOTAL=100</code> with <code>BUDGET_WORK_POOL=60</code> / <code>BUDGET_QUALITY_POOL=20</code> (phase_observe <code>config.conf</code>) is the coaching-pool selector. Banned: "the budget starts at 100". Source: <code>opevc-delegation.md</code> · "Direct-action budget".'
    },

    /* ---- Detail 2,1: bypassed vs kept + counterweights ---- */
    'bypassed-set': {
        title: 'What is bypassed', tag: 'gate',
        what: 'The behavioural gates a subagent skips: the min-max pacing rhythm, the comment-density gate, budget consumption, and the question-discipline gate. All four pace a single orchestrator and would only deadlock parallel fan-out.',
        why: 'These gates matter — the bypass is about WHO they pace, not whether they count. They exist to slow the main session into synthesis; a subagent is not the thing that needs slowing.',
        hood: 'Gating subagents on the synthesis rhythm "would deadlock parallel dispatch — the min-max gate applies to the MAIN-session orchestrator only". The question gate (live form): <code>agent_type=$(jq -r \'.agent_type // "main"\'); [[ "$agent_type" != "main" ]] && exit 0</code>. Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'kept-relocated': {
        title: 'What is kept, relocated', tag: 'object',
        what: 'Path scope and the lock boundary stay — but moved. A subagent’s edit surface is bounded by its own agent-definition tool access, not the main guard’s altered list. Read-only auditors cannot write at all.',
        why: 'The structural controls are non-negotiable; only their enforcement point moves. Each subagent is tool-scoped tighter than the main session, so the freedom is selective, never a blank cheque.',
        hood: 'The <code>## Subagent Exemption (Structural)</code> block in <code>execute-guard.sh</code>: historians write only <code>docs/*.md</code>, execute-* may touch project files, read-only auditors cannot write. Banned: "subagents bypass all gates". Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'two-in-flight': {
        title: 'The two-in-flight ceiling', tag: 'gate',
        what: 'The exemption invites unlimited parallelism, so the economy pairs it with a soft discipline: keep concurrent execute dispatches low, currently two in flight. A burst of fan-out cannot spike the context window past a safe tier.',
        why: 'It is a coached number, not code — a judgment recommendation set after a parallel dispatch once pushed context past a safe tier. The hard backstop, if ignored, is brain_guard’s graduated context gate.',
        hood: 'Not code-enforced — surfaced by <code>plan-risk-assessor</code> on a context spike; <code>06_5</code>: "the operational ceiling … currently held at two-in-flight". The structural floor is brain_guard’s graduated hard gate. Banned: "two-in-flight is enforced". Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },
    'd2-spotcheck': {
        title: 'The spot-check tax', tag: 'gate',
        what: 'Parallel speed is bought, and a discipline pays for it: when a subagent reports counts or ratios that drive a downstream action, spot-check at least one target before acting. Delegation is only as good as its verification.',
        why: 'It is calibrated, not paranoid. Full re-verification would erase the eighty-twenty gain, so the rule is a standing spot-check of one — triggered specifically by numbers that drive a decision.',
        hood: 'brain_guard cycle-1 discipline <strong>D2</strong> (root <code>CLAUDE.md</code> · "Durable disciplines from Brain_guard cycle 1"; detail in <code>.claude/knowledge/opevc/subagent-report-spot-check-required.md</code>). Banned: "verify everything a subagent says". Source: <code>opevc-delegation.md</code> · "Subagent gate exemption".'
    },

    /* ---- Detail 4,1: the shared agent shape ---- */
    'six-modes': {
        title: 'One shape, six modes', tag: 'object',
        what: 'Every roster agent opens with the same six-mode shape: receive the dispatch and gate task quality, investigate, bind evidence, self-check for consistency, emit a verdict, and request its own improvement. Only one mode varies per agent.',
        why: 'A shared spine makes rosters legible and teachable. An architect reading any agent already knows five of its six modes; only the specialty changes, so authoring a new one is filling a single slot.',
        hood: 'The <code>## Markov Brain</code> section: M1 receive + task-quality gate, M2 specialty investigation, M3 evidence-bind, M4 self-consistency, M5 emit-verdict, M6 self-improve-request. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'm2-specialty': {
        title: 'Only M2 varies', tag: 'state',
        what: 'The second mode is the only one that differs between agents — the specialty investigation that makes a codebase-explorer different from a security-auditor. Everything around it is shared boilerplate.',
        why: 'Concentrating the difference in one mode is what lets the roster scale. Delegation depth grows by adding specialties, not by re-deriving the receive-verify-improve scaffold each time.',
        hood: 'An architect customizes by "dropping a new prefixed <code>.md</code> into the phase’s <code>agents/</code>" — authoring M2, inheriting M1/M3–M6. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'verdict-scale': {
        title: 'The canonical verdict scale', tag: 'context',
        what: 'Mode five emits on one fixed scale across every roster agent: accept, accept with a carried finding, reject, or unverified. A subagent never returns free prose as its verdict — it returns one of these four.',
        why: 'A shared scale is what lets the orchestrator metabolise many subagents’ outputs uniformly. The verdict is structured so the main session can route it, not re-read and re-interpret it each time.',
        hood: 'The M5 scale: <code>ACCEPT / ACCEPT-WITH-CARRIED-FINDING / REJECT / UNVERIFIED</code>. The carried-finding verdict is how a subagent hands a non-blocking issue up without failing its whole task. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },
    'the-five-reflectors': {
        title: 'The five reflectors', tag: 'object',
        what: 'The metacog tier is one reflector per phase, distinguished from operational agents by role, not by living in a separate pool. They reflect on the work and write the compaction file at phase exit.',
        why: 'Reflection is delegated like any other labour, but its product is cognition about the job rather than the job itself. Housing it in the same roster keeps it tunable alongside the workers it observes.',
        hood: 'OBSERVE <code>blindspot-finder</code>, PLAN <code>premortem</code>, EXECUTE <code>drift-auditor</code>, VERIFY <code>meta-audit</code>, CONDENSE <code>promotion-scan</code> (ls-verified live). Running one is family-c of the three-family exit gate. Source: <code>opevc-delegation.md</code> · "Per-phase subagent rosters".'
    },

    /* ---- Detail 6,1: the phase↔workflow contract ---- */
    'down-objective': {
        title: 'Down: the objective', tag: 'action',
        what: 'What descends into a workflow is the operational objective plus the relevant footer and knowledge context plus the phase’s own tool-scope. The descending objective names the work — never the scope, which the guard already holds.',
        why: 'Handing down only the objective keeps prompts lean and the boundary clean. The phase decides what work to delegate; how that work is bounded is the platform’s job, not the prompt’s.',
        hood: 'Down: objective + footer/knowledge context + the phase <code>per-phase write-scope</code>. The contract carries <strong>Ship: design — post-oss</strong>; what it leans on (markers, footer, guards) is built. Source: <code>opevc-delegation.md</code> · "Phase-to-workflow contract".'
    },
    'enforce-automatic': {
        title: 'Enforcement is automatic', tag: 'gate',
        what: 'Scope down is not pushed into prompts. Because every workflow agent hits the live phase guard, an execute workflow agent is altered-list-bound exactly the way a direct execute write is. The hook enforces scope, not prompt text.',
        why: 'It removes a whole class of error. The descending objective need never restate the scope, because the same guard that bounds a direct write bounds a workflow agent — there is no second place for scope to drift.',
        hood: 'Every workflow agent hits the live <code>phase guard</code> (empirically probed): an EXECUTE workflow agent is bound by <code>execute-guard.sh</code> like any direct write. Banned: "push scope into every subagent prompt". Source: <code>opevc-delegation.md</code> · "Phase-to-workflow contract".'
    },
    'up-deltas': {
        title: 'Up: marker deltas', tag: 'action',
        what: 'What returns is structured deltas the seed absorbs, expressed in the existing CONDENSE marker vocabulary — pending jobs, voice updates, agent updates, knowledge, durability notes — never prose. A workflow packages deltas; it invents no new format.',
        why: 'Reusing the marker vocabulary means CONDENSE metabolises a workflow’s output with machinery it already has. The disposable workflow packages the deltas; the seed’s real condense does the durable absorption.',
        hood: 'The up-side reuses the five CONDENSE markers (<code>[PENDING-JOB]</code> / <code>[VOICE-UPDATE]</code> / <code>[AGENT-UPDATE]</code> / <code>[KNOWLEDGE]</code> / durability notes). Banned: "prose hand-back". Source: <code>opevc-delegation.md</code> · "Phase-to-workflow contract".'
    },
    'outer-persists': {
        title: 'Only outer CONDENSE persists', tag: 'context',
        what: 'The inner workflow’s condense is a hand-up only — it packages structured deltas, it never durably absorbs. The seed’s outer CONDENSE is the one that persists cognition into long-term memory.',
        why: 'It keeps the durability boundary single and clear. A disposable sub-orchestrator should not be writing the seed’s lasting memory; that authority stays with the outer cycle that owns the whole job.',
        hood: 'The user-decided inner-CONDENSE = HAND-UP rule: the seed (main session) does most CLAUDE.md updates; the workflow only packages deltas up. Workflow nesting is platform-bounded at 2-deep. Source: <code>opevc-delegation.md</code> · "Fractal OPEVC (inner implicit cycle)".'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQUENCE ROW ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'the labour split',
        title: 'Main orchestrates; subagents do the bulk',
        sub: 'The seed divides cognitive labour roughly eighty-twenty: the main session keeps the cross-cutting judgment, and dispatched subagents carry the parallel investigation and execution. One constraint forces the split, and one meter enforces it.',
        boxes: [
            { id: 'main-orchestrates', x: 35, y: 180, w: 200, h: 150, tag: 'state', t: 'main session', s: 'the 20% — judgment' },
            { id: 'subagents-bulk', x: 273, y: 180, w: 200, h: 150, tag: 'object', t: 'subagents', s: 'the 80% — the bulk' },
            { id: 'one-context', x: 511, y: 180, w: 200, h: 150, tag: 'context', t: 'one context window', s: 'the hard constraint' },
            { id: 'the-budget', x: 749, y: 180, w: 200, h: 150, tag: 'gate', t: 'direct-action budget', s: 'the meter' }
        ],
        edges: [
            { from: 'main-orchestrates', to: 'subagents-bulk', kind: 'soft', label: 'delegates to' },
            { from: 'one-context', to: 'the-budget', kind: 'hard', label: 'forces the meter' }
        ],
        stickies: [
            { x: 300, y: 70, text: 'The eighty-twenty is not advice. It is a counted resource the main session must keep earning through dispatch.', aha: true,
              ref: { url: '../07_6-agents-and-80-20-budget.html', section: 'agents/ and the 80/20 Dispatch Budget', blurb: 'The essay this deck walks: the pool plus the budget that mechanizes the split.' } }
        ],
        navHints: { right: 'the budget arithmetic' }
    },
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'the meter',
        title: 'Earn direct action through dispatch',
        sub: 'The budget runs a simple loop: each phase starts with five direct actions, every direct action spends one, every subagent launch grants three back, and at zero the only way forward is to delegate.',
        boxes: [
            { id: 'starting-balance', x: 35, y: 185, w: 205, h: 140, tag: 'state', t: 'start with 5', s: 'seeded at entry' },
            { id: 'consume-direct', x: 278, y: 185, w: 205, h: 140, tag: 'action', t: 'consume −1', s: 'per direct action' },
            { id: 'grant-dispatch', x: 521, y: 185, w: 205, h: 140, tag: 'action', t: 'grant +3', s: 'per dispatch' },
            { id: 'block-zero', x: 764, y: 185, w: 185, h: 140, tag: 'gate', t: 'block at zero', s: 'dispatch or stop' }
        ],
        edges: [
            { from: 'starting-balance', to: 'consume-direct', kind: 'soft', label: 'spend' },
            { from: 'consume-direct', to: 'block-zero', kind: 'hard', label: 'down to 0' },
            { from: 'grant-dispatch', to: 'starting-balance', kind: 'soft', label: 'refill' }
        ],
        stickies: [
            { x: 40, y: 60, text: 'The starting balance is the teaching device: spend it down and learn that dispatch is how it refills.' }
        ],
        navHints: { left: 'the labour split', right: 'why fan-out isn’t throttled', down: 'the per-phase arithmetic' }
    },
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'why fan-out isn’t throttled',
        title: 'Subagents bypass pacing, keep structure',
        sub: 'A dispatched subagent is not the orchestrator, so the pacing gates that slow the main session would only deadlock it. One flag tells them apart: subagents skip the behavioural gates but keep their structural scope.',
        boxes: [
            { id: 'agent-type-flag', x: 35, y: 185, w: 210, h: 140, tag: 'state', t: 'agent type ≠ main', s: 'the discriminator' },
            { id: 'bypass-pacing', x: 290, y: 90, w: 300, h: 110, tag: 'gate', t: 'bypass pacing', s: 'min-max · budget · question' },
            { id: 'keep-structure', x: 290, y: 270, w: 300, h: 110, tag: 'object', t: 'keep structure', s: 'tool-scope, relocated' },
            { id: 'workflow-inherits', x: 650, y: 180, w: 300, h: 120, tag: 'object', t: 'workflows inherit it', s: 'free, by the same flag' }
        ],
        edges: [
            { from: 'agent-type-flag', to: 'bypass-pacing', kind: 'soft', label: 'skips' },
            { from: 'agent-type-flag', to: 'keep-structure', kind: 'hard', label: 'still bound' },
            { from: 'bypass-pacing', to: 'workflow-inherits', kind: 'soft', label: 'also' }
        ],
        stickies: [
            { x: 650, y: 350, text: 'A selective freedom, never an absence of control — each subagent is scoped tighter than the main session.' }
        ],
        navHints: { left: 'the budget', right: 'where labour lives', down: 'bypassed vs kept' }
    },
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'where labour lives',
        title: 'Per-plugin pools, scoped to the lock',
        sub: 'Subagent definitions live in per-plugin pools, never one global directory. Each name is prefixed to its concern, and the prefix ties the subagent to exactly one plugin’s lock boundary.',
        boxes: [
            { id: 'agents-pool', x: 35, y: 185, w: 205, h: 140, tag: 'object', t: 'agents/', s: 'a plugin’s pool' },
            { id: 'prefix-marker', x: 278, y: 185, w: 205, h: 140, tag: 'state', t: 'the prefix', s: 'lock-boundary marker' },
            { id: 'lock-boundary', x: 521, y: 185, w: 205, h: 140, tag: 'gate', t: 'one unlock at a time', s: 'why not global' },
            { id: 'stateful-skip', x: 764, y: 185, w: 185, h: 140, tag: 'context', t: 'stateful plugins skip', s: 'no research surface' }
        ],
        edges: [
            { from: 'agents-pool', to: 'prefix-marker', kind: 'soft', label: 'named by' },
            { from: 'prefix-marker', to: 'lock-boundary', kind: 'hard', label: 'matches' }
        ],
        stickies: [
            { x: 40, y: 60, text: 'Scoping is a consequence of the lock contract, not an arbitrary taxonomy — the surface matches the boundary.' },
            { x: 600, y: 395, text: 'Each subagent is owned by one plugin.',
              ref: { kind: 'deck', url: 'plugin-substrate.html', section: 'Inside a Plugin', blurb: 'The plugin that owns each subagent via its lock boundary.' } }
        ],
        navHints: { left: 'the exemption', right: 'the rosters' }
    },
    '4,0': {
        kind: 'seq', step: 5, eyebrow: 'the customization surface',
        title: 'Each phase ships a roster',
        sub: 'A roster holds two classes of agent: the operational tier that does the phase’s labour, and one metacognitive reflector that judges how it went. The roster is the primary surface an architect tunes for delegation depth.',
        boxes: [
            { id: 'operational-tier', x: 35, y: 185, w: 205, h: 140, tag: 'object', t: 'operational tier', s: 'the workers' },
            { id: 'reflector-member', x: 278, y: 185, w: 205, h: 140, tag: 'object', t: 'one reflector', s: 'the phase-exit metacog reflector (dispatched during the phase)' },
            { id: 'the-roster', x: 521, y: 185, w: 205, h: 140, tag: 'object', t: 'the roster', s: 'home for both' },
            { id: 'drop-an-md', x: 764, y: 185, w: 185, h: 140, tag: 'action', t: 'drop an .md', s: 'how you customize' }
        ],
        edges: [
            { from: 'operational-tier', to: 'the-roster', kind: 'soft', label: 'plus' },
            { from: 'reflector-member', to: 'the-roster', kind: 'soft', label: 'plus' },
            { from: 'the-roster', to: 'drop-an-md', kind: 'soft', label: 'tuned by' }
        ],
        stickies: [
            { x: 300, y: 60, text: 'Tuning the roster tunes both flat dispatch and any future workflow — a workflow calls these same agents by name.' },
            { x: 764, y: 390, text: 'Each phase dispatches its own subagents.',
              ref: { kind: 'deck', url: '../../b6/explore/phasic-cycle.html', section: 'The Full OPEVC Cycle', blurb: 'The phases that dispatch these per-phase subagents.' } }
        ],
        navHints: { left: 'the pools', right: 'discovery + accounting', down: 'the shared agent shape' }
    },
    '5,0': {
        kind: 'seq', step: 6, eyebrow: 'discovery + accounting',
        title: 'Symlink to discover, track to account',
        sub: 'Two shared hooks wire the pools into the live system. One symlinks a newly-authored agent into the flat directory Claude Code scans; the other routes each launch to its phase gateway for accounting.',
        boxes: [
            { id: 'agent-symlink', x: 35, y: 185, w: 210, h: 140, tag: 'action', t: 'agent-symlink.sh', s: 'PostToolUse:Write' },
            { id: 'discovery-dir', x: 290, y: 185, w: 200, h: 140, tag: 'object', t: '.claude/agents/', s: 'the flat scan dir' },
            { id: 'agent-tracker', x: 535, y: 185, w: 210, h: 140, tag: 'action', t: 'agent-tracker.sh', s: 'SubagentStart' },
            { id: 'feeds-cognition', x: 790, y: 185, w: 160, h: 140, tag: 'state', t: 'the launch record', s: 'drives cognition' }
        ],
        edges: [
            { from: 'agent-symlink', to: 'discovery-dir', kind: 'hard', label: 'populates' },
            { from: 'agent-tracker', to: 'feeds-cognition', kind: 'hard', label: 'writes' }
        ],
        stickies: [
            { x: 40, y: 60, text: 'Symlink, not copy — the canonical definition stays in its plugin; discovery updates with no drift.' }
        ],
        navHints: { left: 'the rosters', right: 'the richer form' }
    },
    '6,0': {
        kind: 'seq', step: 7, eyebrow: 'the optional richer form',
        title: 'Workflow: the maturation of dispatch',
        sub: 'The richest form of the eighty-percent labour is a Workflow — codified code that fans out the same rosters. It is design-stage, post-open-source; what is built today is the instruction-borne fractal inner cycle every phase already follows.',
        boxes: [
            { id: 'workflow-tool', x: 35, y: 185, w: 210, h: 140, tag: 'object', t: 'Workflow', s: 'design · post-oss' },
            { id: 'same-rosters', x: 278, y: 185, w: 205, h: 140, tag: 'object', t: 'same rosters', s: 'orchestrated by name' },
            { id: 'fractal-inner', x: 521, y: 185, w: 205, h: 140, tag: 'context', t: 'fractal inner cycle', s: 'built · instruction-borne' },
            { id: 'case-by-case', x: 764, y: 185, w: 185, h: 140, tag: 'state', t: 'seed picks per phase', s: 'direct / dispatch / flow' }
        ],
        edges: [
            { from: 'workflow-tool', to: 'same-rosters', kind: 'soft', label: 'orchestrates' },
            { from: 'fractal-inner', to: 'case-by-case', kind: 'soft', label: 'runs through' }
        ],
        stickies: [
            { x: 300, y: 60, text: 'The workflow is design-stage; subagent-first is v1. Its agents are the same substrate, just driven by deterministic code.', aha: true,
              ref: { url: '../07_6-agents-and-80-20-budget.html', section: 'agents/ and the 80/20 Dispatch Budget', blurb: 'Back to the essay: per-plugin pools and the budget that earns direct action.' } }
        ],
        navHints: { left: 'the wiring hooks', down: 'the phase↔workflow contract' }
    },

    /* ============================ DETAIL ROW ============================ */
    '1,1': {
        kind: 'detail', eyebrow: 'inside the meter',
        title: 'The same +3 / −1 in every phase',
        sub: 'All five phases carry identical budget arithmetic; only the consume trigger differs. Read-heavy phases charge per read, write-heavy phases charge per edit — and one similarly-named coaching meter is not the gate at all.',
        boxes: [
            { id: 'grant-3', x: 35, y: 185, w: 205, h: 140, tag: 'action', t: 'grant +3', s: 'all five phases' },
            { id: 'consume-read', x: 278, y: 185, w: 205, h: 140, tag: 'action', t: 'read −1', s: 'OBSERVE / PLAN / VERIFY' },
            { id: 'consume-edit', x: 521, y: 185, w: 205, h: 140, tag: 'action', t: 'edit −1', s: 'EXECUTE / CONDENSE' },
            { id: 'starting-5', x: 764, y: 185, w: 185, h: 140, tag: 'state', t: 'not the 100', s: 'coaching ≠ gate' }
        ],
        edges: [],
        stickies: [
            { x: 300, y: 65, text: 'Two things are named “budget”; only the five-action meter gates direct action. The 100 picks a coaching voice.' }
        ],
        navHints: { up: 'the budget loop' }
    },
    '2,1': {
        kind: 'detail', eyebrow: 'selective freedom',
        title: 'Bypassed, kept, and paid for',
        sub: 'The exemption skips the behavioural gates and keeps the structural ones, relocated to each agent’s definition. Two counterweights hold it in check: a soft concurrency ceiling, and a standing spot-check on any numbers that drive a decision.',
        boxes: [
            { id: 'bypassed-set', x: 35, y: 185, w: 210, h: 140, tag: 'gate', t: 'bypassed', s: 'behavioural pacing' },
            { id: 'kept-relocated', x: 290, y: 185, w: 205, h: 140, tag: 'object', t: 'kept, relocated', s: 'tool-scope per agent' },
            { id: 'two-in-flight', x: 533, y: 185, w: 205, h: 140, tag: 'gate', t: 'two-in-flight', s: 'soft ceiling' },
            { id: 'd2-spotcheck', x: 776, y: 185, w: 173, h: 140, tag: 'gate', t: 'D2 spot-check', s: 'the trust tax' }
        ],
        edges: [
            { from: 'bypassed-set', to: 'kept-relocated', kind: 'soft', label: 'but' }
        ],
        stickies: [
            { x: 40, y: 65, text: 'The ceiling is a coached number on a hard floor: brain_guard’s graduated context gate is the only enforcement.' }
        ],
        navHints: { up: 'the exemption' }
    },
    '4,1': {
        kind: 'detail', eyebrow: 'one shape, many agents',
        title: 'Six modes, only M2 varies',
        sub: 'Every roster agent shares a six-mode Markov-brain shape; only the specialty mode differs. Verdicts come back on one fixed scale, and the metacog tier is one reflector per phase — distinguished by role, not by a separate pool.',
        boxes: [
            { id: 'six-modes', x: 35, y: 185, w: 210, h: 140, tag: 'object', t: 'six modes', s: 'M1 receive → M6 improve' },
            { id: 'm2-specialty', x: 290, y: 185, w: 200, h: 140, tag: 'state', t: 'only M2 varies', s: 'the specialty' },
            { id: 'verdict-scale', x: 535, y: 185, w: 205, h: 140, tag: 'context', t: 'the verdict scale', s: 'accept / reject / …' },
            { id: 'the-five-reflectors', x: 785, y: 185, w: 164, h: 140, tag: 'object', t: 'five reflectors', s: 'one per phase' }
        ],
        edges: [
            { from: 'six-modes', to: 'm2-specialty', kind: 'soft', label: 'differs at' },
            { from: 'six-modes', to: 'verdict-scale', kind: 'hard', label: 'emits on' }
        ],
        stickies: [
            { x: 300, y: 65, text: 'Author a new agent by filling one slot: write M2, inherit the receive-verify-improve scaffold.' }
        ],
        navHints: { up: 'the rosters' }
    },
    '6,1': {
        kind: 'detail', eyebrow: 'across the boundary',
        title: 'Down: objective. Up: marker deltas.',
        sub: 'The phase-to-workflow contract is design-stage, but its pieces are built. What descends is the objective; scope is enforced by the live guard, not the prompt. What returns is structured deltas in the marker vocabulary — and only the outer CONDENSE persists.',
        boxes: [
            { id: 'down-objective', x: 35, y: 185, w: 210, h: 140, tag: 'action', t: 'down: objective', s: 'names the work' },
            { id: 'enforce-automatic', x: 290, y: 185, w: 205, h: 140, tag: 'gate', t: 'guard enforces scope', s: 'not the prompt' },
            { id: 'up-deltas', x: 533, y: 185, w: 205, h: 140, tag: 'action', t: 'up: marker deltas', s: 'not prose' },
            { id: 'outer-persists', x: 776, y: 185, w: 173, h: 140, tag: 'context', t: 'outer persists', s: 'inner hands up' }
        ],
        edges: [
            { from: 'down-objective', to: 'enforce-automatic', kind: 'hard', label: 'bounded by' },
            { from: 'up-deltas', to: 'outer-persists', kind: 'soft', label: 'absorbed by' }
        ],
        stickies: [
            { x: 40, y: 65, text: 'A workflow invents no new hand-back format — it reuses the five CONDENSE markers the seed already metabolizes.' }
        ],
        navHints: { up: 'the richer form' }
    }
};
