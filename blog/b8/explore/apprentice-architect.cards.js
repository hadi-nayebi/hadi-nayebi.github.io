/* ============================================================================
 * apprentice-architect.cards.js — CONTENT for the "From Apprentice to Architect"
 * deck. Teaches the IDENTITY & MATURATION skeleton (identity.md P+Q clusters):
 * the five identity facts; the customization guardrail OR-gate (Fact 2's runtime);
 * the propose-and-confirm flow (Fact 3's mechanism); the five customization layers
 * (the altitude gradient); the Brain Maturation Model (young ↔ mature); the cost
 * ladder (Voice → Hook → Plugin → Template); and the operator's Apprentice →
 * Journeyman → Architect arc. Paired with the shared deck-engine.js + .css (in
 * b6/explore — referenced cross-dir from the loader). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/section/field), never line numbers
 * (Rule 20). Rot-prone counts (test totals, plugin tallies) are NOT pinned here.
 * Ground truth: the [consolidated] cluster .claude/context/identity.md.
 * Sources (all own-grep verified live):
 *   plugin_integrity/hooks/lock-manager.sh — the "### Gmode-OR-plugin_lock_approval
 *     gate": admits [PLUGIN-LOCK] iff current_phase=="gmode" OR the focused job's
 *     plugin_lock_approval==true; blocks only when BOTH arms fail
 *     (the `if [[ -n "$current_phase" && "$gmode_active" != "true" &&
 *      "$plugin_lock_approval" != "true" ]]` check),
 *   job_core/hooks/question-capture-hook.sh — the [JOB-APPROVE-CREATION]
 *     post-handler (job.sh create → job.sh --hook approve-plugin-lock flips
 *     plugin_lock_approval=true) + the [JOB-APPROVE-PLUGIN] mid-life sibling,
 *   job_core/hooks/question-capture.sh — the [JOB-APPROVE-CREATION] phase-of-firing
 *     gate (current_phase != "condense" → voice job-approve-creation-condense-only,
 *     exit 2),
 *   phase_condense/docs/principles.md — Principle #10 "Voice-First Discipline +
 *     Over-Engineering Veto" ("Measurement precedes hardening"; Source: Lock 9 + 13),
 *   brain_guard/hooks/context-gate.sh — the "GRADUATED ENFORCEMENT" comment
 *     ("escalate consequences as the danger rises, instead of one binary on/off"),
 *   plugin_integrity/hooks/anchor-bootstrap.sh — the PostToolUse:Write birth net
 *     that healed the four-anchor discipline into the plugin template (cost-ladder
 *     Template-tier worked instance),
 *   root CLAUDE.md "Identity" / "Brain Maturation Model" — the five facts + the
 *     canonical young→mature flow; website brain .claude/CLAUDE.md Rule 38 — the
 *     5-layer order (1 phasic substrate · 2 hard controls · 3 soft voices · 4
 *     per-job yaml · 5 per-job plugins),
 *   + .claude/context/identity.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'apprentice-architect', seqLabel: 'from apprentice to architect' };

window.DECK_INFO = {
    /* ---- Card 1: the five identity facts ---- */
    'fact-extendable': {
        title: 'Fact 1 — extendable', tag: 'context',
        what: 'The plugin layer is a starting kit, not a closed form. New plugins can be added, existing ones customized, and new memory forms invented. The compartments are this prototype’s answer to one operator’s work, not law.',
        why: 'It frames the whole architecture as a substrate the operator shapes, not a fixed product. Without this fact the seed would treat its own kit as untouchable and could never grow into a different operator’s tool.',
        hood: 'Open surfaces: plugin count, memory forms (<code>knowledge/</code>, plugin state, <code>voice.xml</code>, <code>evolution.md</code>), the job-form taxonomy. Invariant floor: the test gate, the phase compartments, single-concern. Extensibility is gated, never self-authorised — it routes through the customization guardrail. Source: <code>identity.md</code> · "The five identity facts".'
    },
    'fact-privileged': {
        title: 'Fact 2 — PLUGIN-LOCK is privileged', tag: 'context',
        what: 'Edits to the plugin layer are admitted only in two protected contexts: the gmode maintenance lane, or a user-approved job. Everywhere else, plugin-code edits are blocked by default.',
        why: 'The plugin substrate enforces every other discipline, so changing it casually would let the agent quietly disarm its own safety floor. The privilege keeps self-modification deliberate.',
        hood: 'The runtime realisation is the customization guardrail OR-gate in <code>plugin_integrity/hooks/lock-manager.sh</code>; the question itself is the job-system prefix <code>[PLUGIN-LOCK]</code>. Walk right to see the gate. Source: <code>identity.md</code> · "Customization guardrail".'
    },
    'fact-confirmed': {
        title: 'Fact 3 — user-confirmed', tag: 'context',
        what: 'The seed cannot self-authorise plugin work. It proposes; the user confirms. Two routes raise the approval flag, and the seed can never set it itself.',
        why: 'It keeps a human in the loop for exactly the edits that change the agent’s own enforcement. The seed surfaces the need and the rationale, but the decision to arm plugin work stays the operator’s.',
        hood: 'Realised by the propose-and-confirm flow: a <code>[JOB-APPROVE-CREATION]</code> (or mid-life <code>[JOB-APPROVE-PLUGIN]</code>) question, answered by the user, flips <code>plugin_lock_approval=true</code> via <code>job.sh --hook approve-plugin-lock</code>. Walk right twice for the full flow. Source: <code>identity.md</code> · "Propose-and-confirm flow".'
    },
    'fact-sources': {
        title: 'Fact 4 — the blogs are a source', tag: 'context',
        what: 'The seed has two canonical sources of self-knowledge: the website blogs for the why, and its local knowledge directory for the what and how. OBSERVE may web-fetch the blogs to ground a claim about its own design.',
        why: 'It forces the agent to ground self-claims in a durable surface rather than assumption or stale chat. Design rationale lives in the essays; code paths and file locations live in knowledge files; the agent reads both.',
        hood: 'The blogs (<code>blog/b5/05_1</code>…<code>b8/08_9</code>) carry the rationale; <code>.claude/knowledge/</code> carries code paths and voice IDs. OBSERVE may <code>WebFetch</code> the blogs (allowed in the observe guard); <code>OBSERVE.recall</code> reads <code>knowledge/</code>. Source: <code>identity.md</code> · "The five identity facts".'
    },
    'fact-triangle': {
        title: 'Fact 5 — the triangle collapses to two', tag: 'context',
        what: 'Most software is a three-role triangle of agent, developer, and user. The seed collapses it to agent and user: a non-developer operator becomes the architect of their own seed without writing the machinery.',
        why: 'It is the whole point of the project. Customization happens through registered ceremonies — prefixes, hooks, phases, lock patterns — so the operator directs the seed without ever editing the underlying code.',
        hood: 'The machinery IS code — the operator just does not write it; the agent does, behind gates. Root <code>CLAUDE.md</code> names the "PowerPoint of seed agents" framing (Essay 8.9). Source: <code>identity.md</code> · "The five identity facts" + blog <code>08_9</code>.'
    },

    /* ---- Card 2: the customization guardrail (OR-gate) ---- */
    'plugin-lock-q': {
        title: '[PLUGIN-LOCK] request', tag: 'action',
        what: 'A request to edit or create plugin code. Both editing an existing plugin and birthing a new one route through the same admission gate, which blocks by default.',
        why: 'Routing both kinds of plugin work through one gate means there is exactly one place that decides whether the substrate may change — no second door, no special case for new plugins.',
        hood: 'The question is the registered prefix <code>[PLUGIN-LOCK]</code>; the gate that admits or blocks it is the OR-gate in <code>plugin_integrity/hooks/lock-manager.sh</code> (the "### Gmode-OR-plugin_lock_approval gate"). Source: <code>identity.md</code> · "Customization guardrail".'
    },
    'gmode-arm': {
        title: 'arm 1 — gmode', tag: 'gate',
        what: 'The operator’s deliberate maintenance lane. When the current phase is gmode, the lock is admitted. This is the operator-noticed route: the operator is the trigger.',
        why: 'Some plugin repairs are noticed ad-hoc by the operator, outside any planned job. Gmode is the explicit, entered-on-purpose lane for exactly that — a deliberate context, never an accident.',
        hood: 'The first arm of the OR: <code>current_phase == "gmode"</code> (read via <code>phase.sh current</code>). Entered via the <code>[GMODE]</code> prefix with a ≥100-word justification. Source: <code>lock-manager.sh</code> · the gmode arm.'
    },
    'approval-arm': {
        title: 'arm 2 — plugin_lock_approval', tag: 'gate',
        what: 'The focused job’s approval flag. When the focused job carries plugin_lock_approval set to true, the lock is admitted. This is the agent-noticed route: a user-approved job.',
        why: 'Planned plugin work belongs to a job the user explicitly approved. The flag rides on that job, so the lock opens only inside the approved work and only because the user said yes.',
        hood: 'The second arm of the OR: the focused job’s <code>plugin_lock_approval == true</code>, read from <code>job_core/data.json</code> via <code>jq ‘.jobs[] | select(.focused==true)’</code>. The seed can never set this flag itself. Source: <code>lock-manager.sh</code> · the plugin_lock_approval arm.'
    },
    'both-fail-block': {
        title: 'block when BOTH fail', tag: 'gate',
        what: 'The default. The gate blocks a plugin-code edit only when neither arm is open — not gmode and no approved job. Admission is an OR; only the block needs both arms to fail.',
        why: 'Default-deny on the substrate is the safety floor. Two independent arms can each open the lock, but if neither is satisfied the edit is refused, so plugin work never happens by accident.',
        hood: 'The block fires on <code>[[ -n "$current_phase" &amp;&amp; "$gmode_active" != "true" &amp;&amp; "$plugin_lock_approval" != "true" ]]</code> in <code>lock-manager.sh</code> — both arms false. Source: <code>identity.md</code> · "Customization guardrail".'
    },
    'free-surface': {
        title: 'the free surface', tag: 'object',
        what: 'Not everything is locked. CLAUDE.md files, docs, voice.xml, and agent definitions are exempt from the guardrail and edited directly by CONDENSE. Only plugin CODE is gated.',
        why: 'Locking the documentation and coaching surfaces would freeze the brain’s everyday learning. The guardrail guards the enforcement substrate specifically, leaving the soft, learnable surfaces open.',
        hood: 'Exempt surfaces: <code>CLAUDE.md</code>, <code>docs/*.md</code>, <code>voice.xml</code>, <code>agents/*.md</code> — written directly in CONDENSE. The lock guards plugin code (hooks, scripts, tests). Source: <code>identity.md</code> · "Customization guardrail".'
    },

    /* ---- Card 3: propose-and-confirm flow ---- */
    'notice-need': {
        title: 'any phase NOTICES', tag: 'action',
        what: 'Any working phase can notice that a fix belongs in the plugin layer. It does not act on that — it drops a pending-job marker and rationale in its CLAUDE.md footer for CONDENSE to pick up.',
        why: 'Noticing is distributed because the need can surface anywhere — a PLAN deciding among fix surfaces, an EXECUTE hitting a wall. But noticing is not the same as proposing; the working phase only records the need.',
        hood: 'A <code>[PENDING-JOB]</code> marker (or free-form rationale) in the live phase footer. The phase-of-firing gate blocks <code>[JOB-APPROVE-CREATION]</code> outside CONDENSE and teaches the agent to drop this note instead. Source: <code>identity.md</code> · "Propose-and-confirm flow".'
    },
    'condense-proposes': {
        title: 'CONDENSE proposes', tag: 'action',
        what: 'Only CONDENSE may propose a new job. It consumes the pending-job note and raises the proposal, naming the objective, the plugins touched, and the rationale.',
        why: 'Job creation belongs to the cycle-wide synthesis phase, where the agent has full context for what follow-up work is actually needed. Distributed noticing plus centralized proposing keeps creation deliberate.',
        hood: 'The <code>[JOB-APPROVE-CREATION]</code> prefix, admitted only when <code>current_phase == "condense"</code> (else <code>question-capture.sh</code> fires the <code>job-approve-creation-condense-only</code> voice and <code>exit 2</code>). Consumed at CONDENSE waterfall step 3. Source: <code>identity.md</code> · "Propose-and-confirm flow".'
    },
    'user-judges': {
        title: 'the user judges', tag: 'gate',
        what: 'The user decides: approve, redirect, or reject. This is the human gate that Fact 3 guarantees — the seed proposed, but it cannot proceed until the operator confirms.',
        why: 'The whole point of the flow is that arming plugin work is the user’s call. The agent surfaces the need with full rationale; the operator weighs it and chooses.',
        hood: 'An AskUserQuestion with the three judgments. Only the "Approve job creation" answer triggers the post-handler. Source: <code>identity.md</code> · "Propose-and-confirm flow".'
    },
    'flip-flag': {
        title: 'flip the approval flag', tag: 'action',
        what: 'On approval, a post-handler creates the job and flips its plugin_lock_approval flag to true. The agent never sets this flag itself — it is raised by the hook on the user’s confirmed answer.',
        why: 'Tying the flag to the user’s answer is what makes the approval un-spoofable. The flag exists only because a human said yes, so the lock’s second arm reflects a real authorization.',
        hood: '<code>question-capture-hook.sh</code> runs <code>job.sh create</code> then <code>job.sh --hook approve-plugin-lock</code> on the new job. The mid-life sibling <code>[JOB-APPROVE-PLUGIN]</code> raises the same flag on an already-focused job. Source: <code>question-capture-hook.sh</code> · the JOB-APPROVE-CREATION handler.'
    },
    'focus-activate': {
        title: 'focus + activate', tag: 'action',
        what: 'The agent focuses and activates the approved job. Inside it, the approval arm is open, so [PLUGIN-LOCK] now admits — for both editing an existing plugin and birthing a new one.',
        why: 'Only now, inside the user-approved job, does plugin work become possible. The flag plus the focus together open the second arm of the guardrail for the duration of that job.',
        hood: 'Focus + activate via <code>job.sh focus</code> + <code>job.sh activate</code>; the lock-manager then reads <code>plugin_lock_approval==true</code> on the focused job and admits. Source: <code>identity.md</code> · "Propose-and-confirm flow".'
    },

    /* ---- Card 4: the five customization layers ---- */
    'layer-substrate': {
        title: 'Layer 1 — phasic substrate', tag: 'object',
        what: 'The deepest, hardest layer: the cycle shape itself. The number of phases, the OPEVC acronym, and the forward and backward transition maps. Changing it reshapes the whole rhythm.',
        why: 'A custom seed could add a research phase between observe and plan, or rename the acronym — these are data, not hardwiring. But it is the deepest change, with the largest blast radius.',
        hood: 'The two transition maps are space-separated <code>from:to</code> strings in <code>phasic_system/scripts/phase.sh</code> (<code>FORWARD_MAP</code> / <code>BACKWARD_MAP</code>). Adding a phase = edit the map string + add a <code>phase_&lt;name&gt;</code> guard. Source: <code>identity.md</code> · "Phase-count and OPEVC-acronym as customization surfaces".'
    },
    'layer-hard': {
        title: 'Layer 2 — hard controls', tag: 'gate',
        what: 'Code-level gates: the phase guards and their exit-2 blocks. A deterministic refusal while a phase is active. Editing one is a code change, with real blast radius.',
        why: 'Hard controls are where a behavior becomes non-bypassable. Reaching for this layer means a soft nudge was not enough and the behavior must be enforced, not coached.',
        hood: 'The per-phase PreToolUse guards (e.g. <code>phase_observe/hooks/observe-guard.sh</code>) that <code>exit 2</code> to refuse an off-phase tool. Source: <code>identity.md</code> · "Five customization layers".'
    },
    'layer-voices': {
        title: 'Layer 3 — soft voices', tag: 'object',
        what: 'The voice.xml catalog: coaching and block voices. Probabilistic, LLM-interpreted guidance the agent chooses to follow. Editing a voice is a low-friction, no-code change.',
        why: 'Most discipline is soft by design. A misfiring nudge is fixed here — a layer-3 voice edit — not by climbing to a layer-2 code gate. Shallower is cheaper.',
        hood: 'Each plugin’s <code>voice.xml</code> catalog; a soft <code>&lt;coaching&gt;</code> and a hard <code>&lt;block&gt;</code> can share one id namespace, so soft→hard migration happens in place. Source: <code>identity.md</code> · "Five customization layers".'
    },
    'layer-yaml': {
        title: 'Layer 4 — per-job yaml', tag: 'object',
        what: 'A single job tailoring soft controls at phase entry, without touching code. The Stage-3 yaml plan injects per-phase context by modifying existing voices — append, replace, or prepend.',
        why: 'It lets one job shape the seed’s coaching for the duration of that job, leaving every other job untouched. Customization scoped to a single run, no permanent edit.',
        hood: 'A Stage-3 <code>.yaml</code> plan file whose per-phase blocks modify EXISTING voices keyed by voice-id (it does not add new voices). Source: <code>identity.md</code> · "Five customization layers" + blog <code>06_10</code>.'
    },
    'layer-plugins': {
        title: 'Layer 5 — per-job plugins', tag: 'object',
        what: 'The shallowest-named but most aspirational layer: a job that ships its own gates and voices. This is Job Stage 4 — a plugin-form job. It is design-only today, flagged inline.',
        why: 'It is the far end of the gradient: a job carrying a whole micro-plugin. Naming it keeps the ladder honest about where customization could eventually reach, even before the code exists.',
        hood: 'Job Stage 4, the "plugin form of a job" — aspirational, no code referent yet (carried as a Rule-40 design flag). Source: <code>identity.md</code> · "Five customization layers" · layer 5.'
    },

    /* ---- Card 5: the Brain Maturation Model ---- */
    'young-pole': {
        title: 'young agent', tag: 'state',
        what: 'Large brain, few hooks. The seed learns by guidance, and most controls are probabilistic. The early phase is loud: voices and blocks fire constantly while the brain teaches.',
        why: 'A young seed must stay flexible because its patterns are not yet proven. Soft, LLM-interpreted controls are correct for this phase — not a flaw, but the right shape for an unproven brain.',
        hood: 'Visible in the live kit as young plugins (low version, modest test suites). The brain grows by accretion across three sites: <code>knowledge/</code>, the memory layer, per-plugin <code>docs/evolution.md</code>. Source: root <code>CLAUDE.md</code> · "Brain Maturation Model".'
    },
    'the-flow': {
        title: 'the canonical flow', tag: 'action',
        what: 'The one-way sequence a proven pattern walks: experience, notice the pattern, add it to the brain, watch it prove reliable, migrate it to a hook, then remove it from the brain.',
        why: 'This is how the brain stays lean while still learning. A pattern earns its way into deterministic code by proving itself first; once it is a hook, the prose version is deleted.',
        hood: 'Canonical, DO NOT REORDER: <code>Experience → notice pattern → add to brain → proves reliable → migrate to hook → remove from brain</code> (root <code>CLAUDE.md</code> + Growth Rule 6). Source: root <code>CLAUDE.md</code> · "Brain Maturation Model".'
    },
    'mature-pole': {
        title: 'mature agent', tag: 'state',
        what: 'Lean brain, many hooks. The seed operates by enforcement, and proven patterns are deterministic. The voices speak less because their content has been absorbed into code.',
        why: 'Maturity is not being smarter — it is being leaner and more deterministic. Capability has migrated from flexible prose into reliable hooks, so the brain carries less and refuses more precisely.',
        hood: 'Visible as mature plugins (high version, large suites). Not everything migrates: judgment-based controls stay soft forever — only mechanical, deterministic patterns belong in hooks. Source: root <code>CLAUDE.md</code> · "Brain Maturation Model".'
    },
    'two-ceilings': {
        title: 'size limits force it', tag: 'context',
        what: 'The brain has a word-size ceiling while learning never stops. When it fills, the oldest proven patterns are the best candidates for extraction into hooks, and overflow lands in the knowledge layer.',
        why: 'The size limit is not a nuisance — it is the forcing function. It makes the seed extract proven patterns out to hooks or knowledge files rather than letting the brain pile up indefinitely.',
        hood: 'The brain’s soft word-cap forces extraction ("When the brain hits its word limit, the oldest proven patterns are the best candidates for hook extraction"); durable overflow goes to the <code>knowledge/</code> layer. Source: root <code>CLAUDE.md</code> · "Brain Maturation Model".'
    },

    /* ---- Card 6: the cost ladder ---- */
    'tier-voice': {
        title: 'Voice', tag: 'object',
        what: 'The cheapest tier. Every new behavioral concern starts as a voice: soft, probabilistic, ignorable coaching. No code, no friction — just guidance the agent may follow.',
        why: 'Starting at voice means no concern pays the cost of code before it has earned it. Most behaviors never need to climb higher; soft coaching is enough.',
        hood: 'A coaching entry in a plugin’s <code>voice.xml</code>. The first tier of the per-control escalation. Source: blog <code>b8/08_4</code> · "The Cost Ladder".'
    },
    'tier-hook': {
        title: 'Hook', tag: 'object',
        what: 'The next tier. If measurement shows a voice failing to hold, the concern climbs to a hook inside an existing plugin — a PreToolUse guard in the plugin whose concern it belongs to.',
        why: 'A hook is deterministic where a voice is probabilistic. The climb is justified only by evidence: the soft form was measured insufficient, so the behavior earns enforcement.',
        hood: 'A <code>PreToolUse</code> guard added to an existing plugin. The climb is gated by the over-engineering veto — measurement first, then friction. Source: blog <code>b8/08_4</code> · "The Cost Ladder".'
    },
    'tier-plugin': {
        title: 'Plugin', tag: 'object',
        what: 'A deeper tier. When a pattern needs its own state, or crosses an existing plugin’s boundary, it earns a whole new plugin of its own — single-concern, self-protecting, test-verified.',
        why: 'A new plugin is real cost: its own hooks, tests, and self-protection. It is justified only when the concern cannot live inside an existing plugin without breaking single-concern.',
        hood: 'A new single-concern plugin under <code>.claude/plugins/</code>, born through the plugin birth ceremony with its own tests. Source: blog <code>b8/08_4</code> · "The Cost Ladder".'
    },
    'tier-template': {
        title: 'Template', tag: 'object',
        what: 'The deepest tier. A meta-pattern fossilizes into the template the kit itself ships, so every new plugin inherits it automatically. The discipline stops being a choice and becomes the default.',
        why: 'When a pattern is universal enough that every plugin should carry it, baking it into the template means no future plugin can forget it. The cost is highest, the reach is total.',
        hood: 'Worked instance: the four CLAUDE.md anchors — born as coached convention, hardened into the <code>plugin_integrity/hooks/anchor-bootstrap.sh</code> birth net, then fossilized into the plugin template every new plugin inherits. Source: blog <code>b8/08_4</code> · "The Cost Ladder".'
    },

    /* ---- Card 7: the operator's maturation arc ---- */
    'stage-apprentice': {
        title: 'Apprentice (~week 1)', tag: 'state',
        what: 'Supervising. The operator is learning the shape of OPEVC: when to advance, when to bail back, how to declare a phase’s depth honestly. Most cycles end in some intervention.',
        why: 'Early on the brain is busy teaching, so voices and blocks fire constantly — the loud phase. Almost every job is a deep single-cycle Stage-1, and the operator is still building the mental model.',
        hood: 'Heuristic stage, not a gate — the timelines are soft. Almost all jobs are Stage-1; the brain grows by accretion across <code>knowledge/</code>, the memory layer, and per-plugin <code>docs/evolution.md</code>. Source: blog <code>b8/08_6</code>.'
    },
    'stage-journeyman': {
        title: 'Journeyman (~weeks 4–12)', tag: 'state',
        what: 'Directing and customizing. Cycles are smoother, OPEVC discipline is internalized, and entry-depth forecasts land accurately. Work settles into repeatable shapes.',
        why: 'As patterns stabilize, Stage-1 jobs re-run as user-discussed Stage-2, long-firing voices become hook candidates, and the CLAUDE.md hierarchy starts shrinking as findings migrate into behavior.',
        hood: 'Stage-1 jobs mature into Stage-2 (a stable pattern may justify Stage-3 yaml); coaching voices the operator and seed promote together become hooks. Source: blog <code>b8/08_6</code>.'
    },
    'stage-architect': {
        title: 'Architect (~month 3+)', tag: 'state',
        what: 'Composing. Most cycles complete without intervention on the basics; the voices speak less because their content has been absorbed into hooks or knowledge. New-plugin creation is routine.',
        why: 'The operator now directs the seed at higher-leverage problems — composing with a cognitive instrument, not supervising a chatbot. Stage-3 yaml jobs appear and Stage-4 plugin-form jobs begin to form.',
        hood: 'The END-USER’s mature stage with their own seed (not the Layer-2 architect role). The seed’s parallel poles are young/mature. Source: blog <code>b8/08_6</code> + <code>identity.md</code> · "The maturation arc".'
    },

    /* ============================ DETAIL BOXES ============================ */
    /* ---- 0,1: Fact 1 — what extends vs the floor ---- */
    'open-surfaces': {
        title: 'what extends', tag: 'context',
        what: 'The surfaces a custom seed may change: the plugin count, the memory forms, and the job-form taxonomy. These are the starting kit, open to being added to and reshaped.',
        why: 'Naming the open surfaces tells an operator exactly where customization is invited — the menu of things this prototype answered one way but another operator can answer differently.',
        hood: 'Open: plugin count; memory forms (<code>knowledge/</code>, plugin state, <code>voice.xml</code>, <code>evolution.md</code>); the job-form taxonomy. Source: <code>identity.md</code> · "The five identity facts" · Fact 1.'
    },
    'invariant-floor': {
        title: 'what never moves', tag: 'gate',
        what: 'The invariant floor that is NOT on the customization menu: the test gate, the phase compartments, and single-concern with careful coupling. Removing these makes the architecture less safe, not more.',
        why: 'Extensibility without a floor is foot-gun territory. These few surfaces are the universal safety floor every operator inherits intact rather than replaces — the boundary that keeps Fact 1 from becoming dangerous.',
        hood: 'Invariant: the test gate, the phase compartments, single-concern + careful-coupling. The customization guardrail and the single-unlocked-plugin invariant are the companion inherited floors. Source: <code>identity.md</code> · "Customization guardrail" · inherit-not-rewrite.'
    },
    'gated-extension': {
        title: 'gated, not free', tag: 'action',
        what: 'Extensibility is never self-authorised. Even adding a plugin routes through the customization guardrail, so the seed proposes the extension and the user confirms it.',
        why: 'Fact 1 and Fact 3 are two sides of one coin: the seed can grow, but it cannot grow itself unilaterally. Every extension passes through the same human-confirmed gate.',
        hood: 'New-plugin work routes through the guardrail OR-gate (gmode or an approved job) just like editing — birth and edit share the one gate. Source: <code>identity.md</code> · "Customization guardrail".'
    },

    /* ---- 1,1: two arms = two natural triggers ---- */
    'operator-noticed': {
        title: 'operator-noticed', tag: 'action',
        what: 'Ad-hoc repair the operator spots directly. The gmode lane handles it: the operator IS the trigger, entering a deliberate maintenance context to make the fix.',
        why: 'Some plugin problems are caught by the human, not the agent, outside any planned work. Gmode is the explicit lane for that — deliberate, justified, never an accidental edit.',
        hood: 'The gmode arm of the OR-gate; entered via <code>[GMODE]</code> with a ≥100-word justification. Source: <code>identity.md</code> · "Customization guardrail" · two arms.'
    },
    'agent-noticed': {
        title: 'agent-noticed', tag: 'action',
        what: 'Planned work the agent surfaces. A user-approved job carries the approval flag, opening the second arm. The agent noticed the need and proposed; the user approved the job.',
        why: 'This is the route for work the agent foresees and structures as a job. It pairs distributed noticing with the user’s explicit approval before any plugin code is touched.',
        hood: 'The plugin_lock_approval arm; the flag is raised by the propose-and-confirm flow on a user-approved job. Source: <code>identity.md</code> · "Customization guardrail" · two arms.'
    },
    'mid-life-raise': {
        title: 'the mid-life raise', tag: 'action',
        what: 'A second proposal route. When the focused job itself discovers mid-flight that its fix lands in the plugin layer, it does not need a new job — it raises approval on the job already in flight.',
        why: 'Sometimes a PLAN deciding among fix surfaces realizes only inside the work that the answer is a plugin edit. The mid-life raise handles that without spawning a whole new job, same propose-confirm shape.',
        hood: 'The <code>[JOB-APPROVE-PLUGIN]</code> prefix — askable from ANY active phase — raises <code>plugin_lock_approval</code> on the FOCUSED job via the same <code>approve-plugin-lock</code> hook. Source: <code>identity.md</code> · "Propose-and-confirm flow" · the mid-life raise.'
    },
    'condense-only': {
        title: 'only CONDENSE creates', tag: 'gate',
        what: 'The split: any phase may notice a need, but only CONDENSE may propose a NEW job. The phase-of-firing gate blocks new-job proposals outside CONDENSE.',
        why: 'Centralizing job creation in the cycle-wide synthesis phase keeps it deliberate — the agent has full context there for what follow-up work is needed. Noticing is distributed; proposing a new job is not.',
        hood: '<code>question-capture.sh</code> blocks <code>[JOB-APPROVE-CREATION]</code> when <code>current_phase != "condense"</code> (voice <code>job-approve-creation-condense-only</code>, <code>exit 2</code>) — scoped to job CREATION; the mid-life raise is exempt. Source: <code>identity.md</code> · "Propose-and-confirm flow" · the split.'
    },

    /* ---- 3,1: where the layers live + workflow shape ---- */
    'layer-locus': {
        title: 'where the order is declared', tag: 'context',
        what: 'The five-layer order is canonical and declared in the brain. Reordering it is real drift. Friction and blast-radius rise as you go deeper, so the operator picks the shallowest layer that solves the problem.',
        why: 'The order is not decorative — it is the decision rule. Before any prototype fix, the operator asks at what layer the change belongs, and the canonical numbering answers it.',
        hood: 'Declared in root <code>CLAUDE.md</code> Rule-38 lineage + the website brain (Rule 38: "1 phasic substrate · 2 hard controls · 3 soft voices · 4 per-job yaml · 5 per-job plugins"); blog <code>06_10</code> names layers 4 and 5. Source: <code>identity.md</code> · "Five customization layers".'
    },
    'workflow-shape': {
        title: 'workflow shape', tag: 'object',
        what: 'A per-phase workflow’s structure treated as a tunable surface — a learnable weight the seed refines run over run. It is NOT a sixth layer; the altitude ladder stays five.',
        why: 'It is a new dial the existing layers expose, not a new altitude. How many agents a phase fans out, pipeline versus parallel — that shape is learned from lived runs, not pre-designed.',
        hood: 'A learnable surface alongside <code>voice.xml</code>, per-job yaml, agent-defs, and <code>knowledge/</code>. Design-only: no persisted workflow-shape store is wired into live phase labor yet (Rule-40 flag). Source: <code>identity.md</code> · "Workflow shape (learnable surface)".'
    },
    'learnable-surfaces': {
        title: 'the learnable surfaces', tag: 'context',
        what: 'Orthogonal to the altitude ladder sit the surfaces the seed tunes over runs: the voice catalog, per-job yaml, agent definitions, and the knowledge directory. The layers say where; these are what gets tuned.',
        why: 'The five layers answer where a change belongs; the learnable surfaces are the dials those layers expose, refined run over run as the seed learns its own best shape.',
        hood: 'Learnable surfaces: <code>voice.xml</code> (layer 3), per-job yaml (layer 4), agent-defs, <code>knowledge/</code> — plus the workflow shape as a new such surface. Source: <code>identity.md</code> · "Five customization layers" · learnable surfaces.'
    },

    /* ---- 5,1: control types + the over-engineering veto ---- */
    'hard-control': {
        title: 'hard control', tag: 'gate',
        what: 'A hook that blocks with exit 2. Stop-gate, job-guard, plugin-guard. A deterministic refusal while the phase is active — it cannot be bypassed.',
        why: 'Hard controls are for behaviors that must be enforced, not coached. When correctness cannot depend on the agent choosing well, a hard gate catches the wrong move at the boundary.',
        hood: 'Hooks that <code>exit 2</code> to refuse a tool call. Declared in <code>.claude/plugins/CLAUDE.md</code> "Control Types in Plugins". Source: <code>identity.md</code> · "Control types (hard, soft, structural)".'
    },
    'soft-control': {
        title: 'soft control', tag: 'object',
        what: 'An injection that guides via voice: warnings, info, context. The agent chooses whether to follow. Probabilistic and LLM-interpreted, this is most of the seed’s discipline by design.',
        why: 'Soft controls keep the brain flexible and the friction low. Most behavior should be coached, not enforced — a soft voice is the default, and only a measured failure justifies hardening it.',
        hood: 'Voice injections from <code>voice.xml</code>. Soft is the default form per the over-engineering veto. Source: <code>identity.md</code> · "Control types (hard, soft, structural)".'
    },
    'structural-control': {
        title: 'structural control', tag: 'gate',
        what: 'A design choice that makes a bypass impossible: the hook-flag plus guard, data.json as a single source, question-only completion approval. The wrong move is made unrepresentable, not just caught.',
        why: 'Where a hard control catches a bad move at the gate, a structural control means the bad move cannot be expressed at all. The compartment shape itself forecloses it.',
        hood: 'Structural examples: the <code>--hook</code> flag + guard, <code>data.json</code> as single source of truth, question-only completion approval. Source: <code>identity.md</code> · "Control types (hard, soft, structural)".'
    },
    'oe-veto': {
        title: 'the over-engineering veto', tag: 'gate',
        what: 'The brake on premature hardening: no control becomes a hard gate until measurement proves the soft form is failing. Measurement precedes hardening; the default answer to may this harden yet is not yet.',
        why: 'It keeps the brain lean by refusing to build hooks for behaviors a voice already handles. Every climb up the cost ladder is gated by it — evidence first, then friction.',
        hood: 'Principle #10 "Voice-First Discipline + Over-Engineering Veto" in <code>phase_condense/docs/principles.md</code> ("Measurement precedes hardening"; the Lock 13 name, Source: Lock 9 + 13). Source: <code>identity.md</code> · "Over-engineering veto (Lock 13)".'
    },

    /* ---- 6,1: three axes, one shape ---- */
    'axis-controls': {
        title: 'controls migrate inward', tag: 'object',
        what: 'Axis one: a single control walks the cost ladder from voice to hook to plugin to template. Capability migrates inward, from flexible prose toward deterministic code.',
        why: 'It is the seed’s control-maturation axis. As a behavior proves itself, its enforcement moves deeper into the machinery — the per-control mechanism behind the whole-brain young-to-mature flow.',
        hood: 'The cost ladder (Voice → Hook → Plugin → Template), each climb evidence-gated by the over-engineering veto. Source: <code>identity.md</code> · "The maturation arc" · same shape as the other axes.'
    },
    'axis-jobs': {
        title: 'jobs mature upward', tag: 'object',
        what: 'Axis two: a job matures up the Job Stages, from a single-cycle Stage-1 to a repeatable Stage-2, a per-cycle Stage-3 yaml, and eventually a Stage-4 plugin-form job.',
        why: 'It is the work-maturation axis. As a kind of work proves repeatable, its job form gets a more structured plan — trading inspectability for structure, the same voluntary climb.',
        hood: 'The Job Stages (1 single-cycle → 2 .md → 3 .yaml → 4 plugin-form, aspirational). Source: <code>identity.md</code> · "The maturation arc" + job-system Job Stage.'
    },
    'axis-operator': {
        title: 'the operator grows', tag: 'state',
        what: 'Axis three: the operator walks Apprentice to Journeyman to Architect, shifting from supervising to directing to composing. The human path that runs parallel to the seed’s.',
        why: 'Every other axis describes the seed’s maturation; this one describes the operator’s. The seed and the user grow together, and where the operator stands calibrates what the seed should expect.',
        hood: 'The operator arc (Apprentice → Journeyman → Architect) — friction, not enforcement; no mechanism advances it. Source: <code>identity.md</code> · "The maturation arc".'
    },
    'same-shape': {
        title: 'same shape, correlated', tag: 'context',
        what: 'All three axes share one shape: a voluntary, evidence-gated escalation where every step trades inspectability for friction. And they correlate — apprentices mostly run Stage-1 jobs; architects mostly Stage-3 and up.',
        why: 'Recognizing the single shape underneath is what makes the model teachable. The seed grows, the work grows, the operator grows — three axes, one escalation pattern, moving together.',
        hood: 'Jobs mature upward; controls migrate inward; the operator shifts from supervising to composing — all voluntary, evidence-gated, correlated. Source: <code>identity.md</code> · "The maturation arc" · same shape as the other axes.'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQUENCE ROW ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'who the seed is',
        title: 'Five facts it carries from session start',
        sub: 'Before any job runs, the seed reasons from five commitments: it is extendable, plugin-edits are privileged, those edits are user-confirmed, the blogs are a source of self-knowledge, and the developer role collapses away.',
        boxes: [
            { id: 'fact-extendable', x: 30, y: 175, w: 168, h: 150, tag: 'context', t: 'Fact 1', s: 'extendable' },
            { id: 'fact-privileged', x: 220, y: 175, w: 168, h: 150, tag: 'context', t: 'Fact 2', s: 'PLUGIN-LOCK privileged' },
            { id: 'fact-confirmed', x: 410, y: 175, w: 168, h: 150, tag: 'context', t: 'Fact 3', s: 'user-confirmed' },
            { id: 'fact-sources', x: 600, y: 175, w: 168, h: 150, tag: 'context', t: 'Fact 4', s: 'blogs are a source' },
            { id: 'fact-triangle', x: 790, y: 175, w: 168, h: 150, tag: 'context', t: 'Fact 5', s: 'triangle → two' }
        ],
        edges: [
            { from: 'fact-extendable', to: 'fact-privileged', kind: 'soft', label: 'but gated' },
            { from: 'fact-privileged', to: 'fact-confirmed', kind: 'soft', label: 'so user confirms' }
        ],
        stickies: [
            { x: 300, y: 70, text: 'These five survive the migration to the public seed — the generic core every operator inherits.', aha: true,
              ref: { url: '../08_1-apprentice-to-architect-foundation.html', section: 'Apprentice to Architect', blurb: 'The B8 series opens on the three growth axes these facts ground.' } }
        ],
        navHints: { right: 'the customization guardrail', down: 'what extends vs the floor' }
    },
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'when plugin work is admitted',
        title: 'The customization guardrail',
        sub: 'One OR-gate decides every plugin-code edit. Either arm opens the lock — the gmode lane, or a user-approved job. Only when BOTH fail does the gate block.',
        boxes: [
            { id: 'plugin-lock-q', x: 30, y: 180, w: 230, h: 120, tag: 'action', t: '[PLUGIN-LOCK]', s: 'edit OR birth plugin code' },
            { id: 'gmode-arm', x: 320, y: 75, w: 270, h: 110, tag: 'gate', t: 'arm 1 · gmode', s: 'operator’s lane' },
            { id: 'approval-arm', x: 320, y: 255, w: 270, h: 110, tag: 'gate', t: 'arm 2 · approval flag', s: 'approved job' },
            { id: 'both-fail-block', x: 650, y: 75, w: 300, h: 110, tag: 'gate', t: 'block when BOTH fail', s: 'default-deny' },
            { id: 'free-surface', x: 650, y: 255, w: 300, h: 110, tag: 'object', t: 'the free surface', s: 'docs / voices / agents' }
        ],
        edges: [
            { from: 'plugin-lock-q', to: 'gmode-arm', kind: 'soft', label: 'OR' },
            { from: 'plugin-lock-q', to: 'approval-arm', kind: 'soft', label: 'OR' },
            { from: 'plugin-lock-q', to: 'both-fail-block', kind: 'hard', label: 'blocks if both fail' }
        ],
        stickies: [
            { x: 660, y: 400, text: 'Admission is OR — either arm opens the lock. Only the BLOCK needs both arms to fail.' }
        ],
        navHints: { left: 'the five facts', right: 'propose & confirm', down: 'two arms, two triggers' }
    },
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'how a need becomes a job',
        title: 'Propose, then confirm',
        sub: 'The seed cannot self-authorise plugin work. Any phase notices; CONDENSE proposes; the user judges; on approval a hook flips the flag; the agent focuses the approved job.',
        boxes: [
            { id: 'notice-need', x: 28, y: 195, w: 174, h: 100, tag: 'action', t: 'any phase NOTICES', s: 'drops a note' },
            { id: 'condense-proposes', x: 222, y: 195, w: 174, h: 100, tag: 'action', t: 'CONDENSE proposes', s: 'names objective' },
            { id: 'user-judges', x: 416, y: 195, w: 174, h: 100, tag: 'gate', t: 'the user judges', s: 'approve / redirect / reject' },
            { id: 'flip-flag', x: 610, y: 195, w: 174, h: 100, tag: 'action', t: 'flip the flag', s: 'hook, on approve' },
            { id: 'focus-activate', x: 804, y: 195, w: 154, h: 100, tag: 'action', t: 'focus + activate', s: 'lock now admits' }
        ],
        edges: [
            { from: 'notice-need', to: 'condense-proposes', kind: 'hard' },
            { from: 'condense-proposes', to: 'user-judges', kind: 'hard' },
            { from: 'user-judges', to: 'flip-flag', kind: 'hard', label: 'on approve' },
            { from: 'flip-flag', to: 'focus-activate', kind: 'hard' }
        ],
        stickies: [
            { x: 330, y: 360, text: 'The seed proposes; the user confirms. Fact 3: no self-authorised plugin work — the flag is raised by a hook, never by the agent.', aha: true }
        ],
        navHints: { left: 'the guardrail', right: 'the five layers' }
    },
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'where a change belongs',
        title: 'Five customization layers',
        sub: 'An altitude ladder, deepest to shallowest: the phasic substrate, hard controls, soft voices, per-job yaml, and per-job plugins. Friction rises as you go deeper.',
        boxes: [
            { id: 'layer-substrate', x: 30, y: 170, w: 168, h: 150, tag: 'object', t: 'Layer 1', s: 'phasic substrate' },
            { id: 'layer-hard', x: 220, y: 170, w: 168, h: 150, tag: 'gate', t: 'Layer 2', s: 'hard controls' },
            { id: 'layer-voices', x: 410, y: 170, w: 168, h: 150, tag: 'object', t: 'Layer 3', s: 'soft voices' },
            { id: 'layer-yaml', x: 600, y: 170, w: 168, h: 150, tag: 'object', t: 'Layer 4', s: 'per-job yaml' },
            { id: 'layer-plugins', x: 790, y: 170, w: 168, h: 150, tag: 'object', t: 'Layer 5', s: 'per-job plugins' }
        ],
        edges: [
            { from: 'layer-substrate', to: 'layer-hard', kind: 'soft' },
            { from: 'layer-hard', to: 'layer-voices', kind: 'soft' },
            { from: 'layer-voices', to: 'layer-yaml', kind: 'soft' },
            { from: 'layer-yaml', to: 'layer-plugins', kind: 'soft', label: 'less friction →' }
        ],
        stickies: [
            { x: 300, y: 70, text: 'Pick the SHALLOWEST layer that solves the problem — a misfiring nudge is a layer-3 voice edit, not a layer-2 code change.', aha: true,
              ref: { url: '../../b6/06_10-plan-state-machine.html', section: 'The Plan File — Long-Horizon Memory', blurb: 'Where the per-job yaml plan (Layer 4) and Layer 5 are named.' } }
        ],
        navHints: { left: 'propose & confirm', right: 'the brain, young vs mature', down: 'where each layer lives' }
    },
    '4,0': {
        kind: 'seq', step: 5, eyebrow: 'how the brain changes shape',
        title: 'Young brain, mature brain',
        sub: 'A young seed is a large brain with few hooks, learning by guidance. A mature seed is lean with many hooks, operating by enforcement. One canonical flow moves a pattern between them.',
        boxes: [
            { id: 'young-pole', x: 40, y: 110, w: 250, h: 140, tag: 'state', t: 'young agent', s: 'large brain, few hooks' },
            { id: 'the-flow', x: 365, y: 110, w: 250, h: 140, tag: 'action', t: 'the canonical flow', s: 'notice → prove → migrate' },
            { id: 'mature-pole', x: 690, y: 110, w: 250, h: 140, tag: 'state', t: 'mature agent', s: 'lean brain, many hooks' },
            { id: 'two-ceilings', x: 365, y: 300, w: 250, h: 120, tag: 'context', t: 'size limits force it', s: 'extract or overflow' }
        ],
        edges: [
            { from: 'young-pole', to: 'the-flow', kind: 'soft', label: 'notice pattern' },
            { from: 'the-flow', to: 'mature-pole', kind: 'soft', label: 'migrate to hook' },
            { from: 'the-flow', to: 'two-ceilings', kind: 'soft', label: 'forced by' }
        ],
        stickies: [
            { x: 690, y: 320, text: 'The brain gets LEANER, not bigger — proven patterns migrate out to hooks. It does not pile up.' }
        ],
        navHints: { left: 'the five layers', right: 'the cost ladder' }
    },
    '5,0': {
        kind: 'seq', step: 6, eyebrow: 'how one control matures',
        title: 'The cost ladder',
        sub: 'For one behavioral concern: Voice, then Hook, then Plugin, then Template. Each tier costs more than the last, and each is entered only when evidence justifies the climb.',
        boxes: [
            { id: 'tier-voice', x: 30, y: 190, w: 200, h: 110, tag: 'object', t: 'Voice', s: 'soft, ignorable' },
            { id: 'tier-hook', x: 255, y: 190, w: 200, h: 110, tag: 'object', t: 'Hook', s: 'in an existing plugin' },
            { id: 'tier-plugin', x: 480, y: 190, w: 200, h: 110, tag: 'object', t: 'Plugin', s: 'its own state' },
            { id: 'tier-template', x: 705, y: 190, w: 245, h: 110, tag: 'object', t: 'Template', s: 'the kit ships it' }
        ],
        edges: [
            { from: 'tier-voice', to: 'tier-hook', kind: 'soft', label: 'if measured failing' },
            { from: 'tier-hook', to: 'tier-plugin', kind: 'soft', label: 'needs own state' },
            { from: 'tier-plugin', to: 'tier-template', kind: 'soft', label: 'fossilizes' }
        ],
        stickies: [
            { x: 300, y: 360, text: 'Each climb is gated by the over-engineering veto: measurement first, then friction. The order is a default, not a mandate.', aha: true,
              ref: { url: '../08_4-soft-hard-migration.html', section: 'The Cost Ladder', blurb: 'Voice → Hook → Plugin → Template, and the two-axes framing.' } },
            { x: 30, y: 360, text: 'The climb begins at the soft voice surface.',
              ref: { kind: 'deck', url: '../../b7/explore/voice-surface.html', section: 'The Voice Surface', blurb: 'voice.xml — where the soft→hard climb begins.' } },
            { x: 705, y: 360, text: 'A proven pattern hardens into a plugin organ.',
              ref: { kind: 'deck', url: '../../b7/explore/plugin-substrate.html', section: 'Inside a Plugin', blurb: 'The plugin form a hardened pattern fossilizes into.' } }
        ],
        navHints: { left: 'brain maturation', right: 'the operator arc', down: 'control types & the veto' }
    },
    '6,0': {
        kind: 'seq', step: 7, eyebrow: 'how the operator grows',
        title: 'Apprentice to architect',
        sub: 'While the seed matures, the operator walks a parallel arc: Apprentice supervising, Journeyman directing, Architect composing. The stages are soft and the timelines heuristic.',
        boxes: [
            { id: 'stage-apprentice', x: 40, y: 185, w: 270, h: 130, tag: 'state', t: 'Apprentice', s: '~week 1 · supervising' },
            { id: 'stage-journeyman', x: 355, y: 185, w: 270, h: 130, tag: 'state', t: 'Journeyman', s: '~weeks 4–12 · directing' },
            { id: 'stage-architect', x: 670, y: 185, w: 270, h: 130, tag: 'state', t: 'Architect', s: '~month 3+ · composing' }
        ],
        edges: [
            { from: 'stage-apprentice', to: 'stage-journeyman', kind: 'soft' },
            { from: 'stage-journeyman', to: 'stage-architect', kind: 'soft', label: 'friction, not enforcement' }
        ],
        stickies: [
            { x: 330, y: 365, text: 'Nothing GATES the arc — an operator can stay an apprentice forever, or skip ahead. The seed makes the patient path easier, not mandatory.', aha: true,
              ref: { url: '../08_6-apprentice-journeyman-architect.html', section: 'Apprentice, Journeyman, Architect', blurb: 'The three operator stages and how they correlate with Job Stages.' } }
        ],
        navHints: { left: 'the cost ladder', down: 'three axes, one shape' }
    },

    /* ============================ DETAIL ROW ============================ */
    '0,1': {
        kind: 'detail', eyebrow: 'Fact 1, under the hood',
        title: 'What extends — and the floor that does not',
        sub: 'Extensibility names what an operator may change, and an invariant floor names what stays. Even adding a plugin is gated, never self-authorised.',
        boxes: [
            { id: 'open-surfaces', x: 40, y: 120, w: 270, h: 150, tag: 'context', t: 'what extends', s: 'plugins · memory forms · jobs' },
            { id: 'invariant-floor', x: 360, y: 120, w: 270, h: 150, tag: 'gate', t: 'what never moves', s: 'test gate · phases · single-concern' },
            { id: 'gated-extension', x: 680, y: 120, w: 260, h: 150, tag: 'action', t: 'gated, not free', s: 'routes through the guardrail' }
        ],
        edges: [
            { from: 'open-surfaces', to: 'gated-extension', kind: 'soft', label: 'every extension' }
        ],
        stickies: [
            { x: 360, y: 320, text: 'Extensibility without a floor is foot-gun territory — the safety surfaces are not on the customization menu.' }
        ],
        navHints: { up: 'the five facts' }
    },
    '1,1': {
        kind: 'detail', eyebrow: 'the guardrail, under the hood',
        title: 'Two arms, two natural triggers',
        sub: 'The two routes match the two ways plugin-work arises: operator-noticed ad-hoc repair (gmode) and agent-noticed planned work (an approved job), plus the mid-life raise.',
        boxes: [
            { id: 'operator-noticed', x: 40, y: 95, w: 270, h: 135, tag: 'action', t: 'operator-noticed', s: 'gmode · operator is the trigger' },
            { id: 'agent-noticed', x: 360, y: 95, w: 270, h: 135, tag: 'action', t: 'agent-noticed', s: 'a user-approved job' },
            { id: 'mid-life-raise', x: 680, y: 95, w: 260, h: 135, tag: 'action', t: 'the mid-life raise', s: 'flag the focused job' },
            { id: 'condense-only', x: 360, y: 280, w: 270, h: 120, tag: 'gate', t: 'only CONDENSE creates', s: 'new-job proposals' }
        ],
        edges: [
            { from: 'agent-noticed', to: 'condense-only', kind: 'soft', label: 'creation is phase-gated' }
        ],
        stickies: [
            { x: 690, y: 300, text: 'Any phase NOTICES; only CONDENSE proposes a NEW job. The mid-life raise is the exception — askable from any active phase.' }
        ],
        navHints: { up: 'the guardrail' }
    },
    '3,1': {
        kind: 'detail', eyebrow: 'the layers, under the hood',
        title: 'Where the order lives — and what it is not',
        sub: 'The five-layer order is canonical and declared in the brain. Orthogonal to it sit the learnable surfaces, including the workflow shape — a tunable surface, not a sixth layer.',
        boxes: [
            { id: 'layer-locus', x: 40, y: 130, w: 270, h: 160, tag: 'context', t: 'the canonical order', s: 'root CLAUDE.md Rule 38' },
            { id: 'workflow-shape', x: 360, y: 130, w: 270, h: 160, tag: 'object', t: 'workflow shape', s: 'a learnable surface' },
            { id: 'learnable-surfaces', x: 680, y: 130, w: 260, h: 160, tag: 'context', t: 'learnable surfaces', s: 'voices · yaml · agents · knowledge' }
        ],
        edges: [
            { from: 'workflow-shape', to: 'learnable-surfaces', kind: 'soft', label: 'sits among' }
        ],
        stickies: [
            { x: 360, y: 330, text: 'The layers say WHERE a change belongs; the learnable surfaces are the dials those layers expose. The ladder stays five.' }
        ],
        navHints: { up: 'the five layers' }
    },
    '5,1': {
        kind: 'detail', eyebrow: 'the cost ladder, under the hood',
        title: 'Three control types, one brake',
        sub: 'Every plugin mixes hard, soft, and structural controls — the static vocabulary the cost ladder walks between. The over-engineering veto gates every climb.',
        boxes: [
            { id: 'hard-control', x: 30, y: 110, w: 222, h: 135, tag: 'gate', t: 'hard control', s: 'blocks (exit 2)' },
            { id: 'soft-control', x: 270, y: 110, w: 222, h: 135, tag: 'object', t: 'soft control', s: 'voice · agent chooses' },
            { id: 'structural-control', x: 510, y: 110, w: 222, h: 135, tag: 'gate', t: 'structural control', s: 'bypass impossible' },
            { id: 'oe-veto', x: 270, y: 285, w: 462, h: 120, tag: 'gate', t: 'the over-engineering veto', s: 'measurement precedes hardening' }
        ],
        edges: [
            { from: 'soft-control', to: 'hard-control', kind: 'soft', label: 'soft → hard' },
            { from: 'oe-veto', to: 'hard-control', kind: 'soft', label: 'gates the climb' }
        ],
        stickies: [
            { x: 760, y: 130, text: 'Hard catches the wrong move at the gate; structural makes it unrepresentable; soft coaches. A plugin needs all three.' }
        ],
        navHints: { up: 'the cost ladder' }
    },
    '6,1': {
        kind: 'detail', eyebrow: 'the arc, under the hood',
        title: 'Three axes, one shape',
        sub: 'Controls migrate inward, jobs mature upward, the operator grows from supervising to composing. Three axes, one voluntary evidence-gated escalation — and they correlate.',
        boxes: [
            { id: 'axis-controls', x: 40, y: 95, w: 280, h: 130, tag: 'object', t: 'controls migrate inward', s: 'the cost ladder' },
            { id: 'axis-jobs', x: 40, y: 280, w: 280, h: 130, tag: 'object', t: 'jobs mature upward', s: 'the Job Stages' },
            { id: 'axis-operator', x: 370, y: 185, w: 260, h: 130, tag: 'state', t: 'the operator grows', s: 'Apprentice → Architect' },
            { id: 'same-shape', x: 680, y: 185, w: 260, h: 130, tag: 'context', t: 'same shape', s: 'voluntary · evidence-gated' }
        ],
        edges: [
            { from: 'axis-controls', to: 'same-shape', kind: 'soft' },
            { from: 'axis-jobs', to: 'same-shape', kind: 'soft' },
            { from: 'axis-operator', to: 'same-shape', kind: 'soft', label: 'all three' }
        ],
        stickies: [
            { x: 370, y: 360, text: 'The seed grows, the work grows, the operator grows — three axes, one escalation pattern, moving together.' }
        ],
        navHints: { up: 'the operator arc' }
    }
};
