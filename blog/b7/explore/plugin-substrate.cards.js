/* ============================================================================
 * plugin-substrate.cards.js — CONTENT for the "Plugin Cell & Lock Ceremony" deck.
 * Teaches: a plugin is a single-concern cognitive cell; editing the substrate is
 * gated by a lock ceremony (one-unlocked invariant → [PLUGIN-LOCK] unlock →
 * lock-cmd PRESERVE or safe-lock AUTO-REVERT → nested [TEST-LOCK]) and a new
 * plugin is BORN from a 3-file template floor with its history machinery wired.
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/function/section), never line
 * numbers, per the glossary term-anatomy rule (Rule 20). Sources (plugin_integrity):
 *   hooks/plugin-guard.sh (### CHECK 1 plugin lock, ### CHECK 2 test-file lock,
 *     data.json hidden-state arm, lock exemptions), hooks/lock-manager.sh
 *     (PLUGIN-LOCK admission gate, word-floor gate, dirty-tree block, drift-gate,
 *     evolution.md auto-inject, write_unlock_state, plugin-birth arm),
 *   scripts/safe-lock.sh (PASS/FAIL/quarantine/no-tests branches, log_revert),
 *   scripts/lock-cmd.sh (all_pass branch, clear_lock_state — PRESERVE on FAIL),
 *   scripts/drift-check.sh (commit count since evolution.md, HIGH_DRIFT_VALUE),
 *   config.conf (DRIFT_THRESHOLD=10, MAX_EVOLUTION_WORDS=2000, PLUGIN_LOCK_WORD_MIN=100,
 *     LOCK_TEST_TIMEOUT=30), template/ (3-file floor: CLAUDE.md, docs/evolution.md,
 *     _historian.md), agents/historian-*.md (generated central historians),
 *   + .claude/context/plugins-substrate.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'plugin-substrate', seqLabel: 'editing the substrate, safely' };

window.DECK_INFO = {
    /* ---- Card 1: the cell ---- */
    'ps-cell': {
        title: 'A plugin — a cognitive cell', tag: 'object',
        what: 'The architectural unit of the seed: a boundary-defended directory at .claude/plugins/name/ owning exactly one concern, managing its own hidden state, and exposing a small published command surface.',
        why: 'A plugin is a collection of controls, voices, state, scripts, hooks, and docs whose presence makes the seed BEHAVE in alignment with the plugin’s objective — a seed carrying plugin_integrity is less likely to introduce bugs into its own system. The mechanism is friction + injection + sensing, not a sandbox.',
        hood: 'Each plugin owns one narrow concern (<code>plugin_integrity</code> = edit safety, <code>job_core</code> = lifecycle, <code>brain_guard</code> = context discipline). No plugin reaches into another’s hidden <code>data.json</code>; composition happens only through published read-only commands (<code>job.sh focused</code>, <code>phase.sh current</code>). Source: <code>.claude/context/plugins-substrate.md</code> · "Plugin (as a cognitive cell)".'
    },
    'ps-one-concern': {
        title: 'one concern, never a tangle', tag: 'object',
        what: 'Each capability is a cell, not a tangle — so one can evolve, be tested, and be reverted without touching the others.',
        why: 'Single-concern is the whole partition principle. A plugin that owned several concerns could not be reverted cleanly — a revert would need an unambiguous, isolated target.',
        hood: 'This is minimize-not-eliminate — the single-scope-with-couplers shape: plugins compose through published commands, never shared state. Source: <code>plugins-substrate.md</code> · "Single-concern + careful coupling".'
    },
    'ps-commands': {
        title: 'published read-only commands', tag: 'action',
        what: 'The only way one plugin learns another’s state: small published verbs like job.sh focused, phase.sh current, observe.sh altered-list — never direct state access.',
        why: 'Coordination by published command keeps every plugin’s internals behind its boundary. The owning plugin controls exactly what it exposes; cross-plugin reads can never see private fields.',
        hood: 'Cross-plugin queries route through these read-only commands; <code>plugin-guard.sh</code>’s data.json arm blocks any direct read of another plugin’s hidden state. Source: <code>plugins-substrate.md</code> · "The read / write / depend-on triple".'
    },
    'ps-substrate-cost': {
        title: 'the gate is heavier than a project edit', tag: 'gate',
        what: 'The ceremony guarding a plugin is heavier than any project edit — because a regression in plugin CODE is substrate-wide.',
        why: 'A bad plugin edit can poison every subsequent tool call, subagent, and voice for the rest of the session. A project edit is local; substrate damage is not. Friction tracks danger.',
        hood: '<code>plugin_integrity</code>’s own code passes through the SAME guard arms — there is no <code>target=="plugin_integrity"</code> exception; it obeys the recursive lock ceremony it enforces. Source: <code>plugins-substrate.md</code> · "No privileged path".'
    },
    /* ---- Detail 0,1: the read/write/depend triple ---- */
    'ps-reads': {
        title: 'who READS it', tag: 'state',
        what: 'The first property of every organ: which actors are allowed to read it. Most organs are read through a published command, not directly.',
        why: 'Naming the readers makes the boundary explicit — a reader outside the published surface is a leak to close.',
        hood: 'The triple (read · write · depend-on) is declared per-organ in <code>b7/07_2</code> and enforced by the per-phase guards’ write-allowlists + <code>plugin-guard.sh</code>. Source: <code>plugins-substrate.md</code> · "The read / write / depend-on triple".'
    },
    'ps-writes': {
        title: 'who WRITES it — usually exactly one', tag: 'state',
        what: 'The security model rests on writer-exclusivity: usually exactly one gated writer per organ. data.json is written only by its own plugin’s scripts; plugin CODE only under [PLUGIN-LOCK].',
        why: 'One writer per organ means a revert always has an unambiguous target and no two actors can race a mutation. Writer-exclusivity IS the security model.',
        hood: 'Per organ: <code>data.json</code> ← its own plugin’s scripts; <code>CLAUDE.md</code> footer regions ← the phase that owns the anchor; <code>hooks/scripts/tests</code> ← [PLUGIN-LOCK]; <code>tests/*.sh</code> ← nested [TEST-LOCK]. Source: <code>plugins-substrate.md</code> · writer-exclusivity.'
    },
    'ps-depends': {
        title: 'what it DEPENDS on', tag: 'state',
        what: 'The third property: the organs and shared-lib units this one relies on. The anatomy is linked, not independent — a state file arrives WITH the gateway script that owns it; a voice.xml with the hooks that call its IDs.',
        why: 'Describing each dependency is what makes plugins customizable — the better the anatomy is described, the easier it is to evolve an existing plugin without breaking a hidden coupling.',
        hood: 'Dependencies: <code>data.json</code> arrives with its gateway script; <code>voice.xml</code> with the hooks/scripts that call its IDs; <code>tests/</code> exist because the lock cycle runs them. Source: <code>plugins-substrate.md</code> · "Components are linked, not independent".'
    },
    'ps-writer-excl': {
        title: 'writer-exclusivity', tag: 'gate',
        what: 'The invariant under the whole triple: for most organs, exactly one gated writer. A revert therefore always has a single, unambiguous target.',
        why: 'Without writer-exclusivity, "who changed this and can it be rolled back" has no clean answer. With it, every organ’s history is a single writer’s trail.',
        hood: 'Enforced by the per-phase guard write-allowlists + <code>plugin-guard.sh</code> (plugin code) + the section_guard lib (CLAUDE.md anchors). Source: <code>plugins-substrate.md</code> · "writer-exclusivity".'
    },
    /* ---- Card 2: the anatomy ---- */
    'ps-claudemd': {
        title: 'CLAUDE.md — the brain surface', tag: 'object',
        what: 'The plugin’s working-memory surface, read at session start and at every unlock. One of the universal skeleton trio every functional plugin carries.',
        why: 'A plugin without a CLAUDE.md has no brain surface — nothing the seed reads to know what the plugin is for. It is the one organ even the minimal-viable plugin keeps.',
        hood: 'The canonical floor is "minimal plugin: just CLAUDE.md; tests needed for revert protection". Source: <code>plugins-substrate.md</code> · "Universal skeleton trio" / "Minimum-viable shape".'
    },
    'ps-hooks': {
        title: 'hooks/ — the reflexes', tag: 'object',
        what: 'Event-fired reflex scripts registered in settings.local.json. They fire on Claude Code’s hook events and return an exit code that decides whether the action proceeds.',
        why: 'Hooks are where deterministic code gets to inspect and gate the LLM’s otherwise-probabilistic moves — the enforcement primitive of the whole hard layer.',
        hood: 'A hook on disk but absent from <code>settings.local.json</code> NEVER fires — Claude Code does not auto-discover hooks. Registration is the brain’s job; plugins never self-register. Source: <code>plugins-substrate.md</code> · "settings.local.json registration".'
    },
    'ps-scripts': {
        title: 'scripts/ — the verbs', tag: 'object',
        what: 'The operator/agent verbs — a plugin’s published command surface (and its internal --hook gateway). The third of the universal skeleton trio.',
        why: 'Scripts are how the plugin exposes capability without exposing state. Absence of <code>scripts/</code> announces "I only enforce, I expose no verbs" (e.g. question_discipline).',
        hood: 'The state gateway is a script invoked with <code>--hook</code>; <code>plugin-guard.sh</code> globally blocks the agent from calling any script with <code>--hook</code>, so mutations originate only from framework-fired hooks. Source: <code>plugins-substrate.md</code> · "State gateway".'
    },
    'ps-tests': {
        title: 'tests/ — the safety net', tag: 'object',
        what: 'The self-test suite the lock cycle runs at the close boundary. A plugin without tests cannot survive commit-or-revert discipline.',
        why: 'Tests are the verifier of everything else — which is why their <code>.sh</code> files are frozen harder than the code beneath them (a separate [TEST-LOCK]).',
        hood: 'The ~80% coverage norm is a design discipline operationalized by the [TEST-LOCK] ceremony, NOT a script-measured gate. <code>safe-lock.sh</code>/<code>lock-cmd.sh</code> run every file in <code>tests/</code>. Source: <code>plugins-substrate.md</code> · "Test-file protection".'
    },
    'ps-docs': {
        title: 'docs/ — incl. evolution.md', tag: 'object',
        what: 'The plugin’s living-history narrative (evolution.md) plus uncapped sibling docs (decisions.md, lessons.md, principles.md).',
        why: 'A plugin’s "why it is the way it is" travels with it, is read before it is changed, and stays bounded — so every future unlock continues the same decisions and standards.',
        hood: '<code>evolution.md</code> is auto-injected at every unlock and hard-capped at <code>MAX_EVOLUTION_WORDS</code> (2000) by <code>evolution-cap.sh</code> — the ONLY code-enforced size limit in the prototype. Source: <code>plugins-substrate.md</code> · "docs/evolution.md + evolution-cap".'
    },
    'ps-datajson': {
        title: 'data.json — hidden state', tag: 'state',
        what: 'Per-plugin hidden runtime state — unreadable and uneditable directly by the agent; the only access path is the plugin’s own gateway script.',
        why: 'State mutations are serialized, validated, and auditable, and a plugin’s internals never leak across its boundary. (Distinct from <code>config.conf</code>, the operator-tuning surface.)',
        hood: '<code>plugin-guard.sh</code> refuses Read on any <code>plugins/*/data.json</code> and refuses Edit/Write/Bash <code>cat/grep/jq</code> touches (exit 2); only scripts inside <code>plugins/*/hooks|scripts/</code> may touch it. A repo <code>.gitignore</code> globs <code>**/data.json</code> — never committed. Source: <code>plugins-substrate.md</code> · "data.json hidden state".'
    },
    'ps-optional': {
        title: 'optional organs — absence is information', tag: 'context',
        what: 'Layered atop the six-directory core: template/ (creator plugins only), agents/ (per-plugin subagents), config.conf (operator tuning), the dual voice.xml, e2e/ (phasic_system only), LICENSE/README.md.',
        why: 'A plugin is defined as much by what it omits: no <code>config.conf</code> means "no operator-tunable thresholds"; no <code>agents/</code> means "I delegate no research". Absence is intentional signal.',
        hood: '10 of the 11 active plugins carry a <code>config.conf</code>; <code>question_discipline</code> carries none. Phase plugins specialize the skeleton into a four-part shape: Gate + Sensor + Tracker + Gateway/Commit. Source: <code>plugins-substrate.md</code> · "Plugin directory anatomy".'
    },
    /* ---- Card 3: the invariant ---- */
    'ps-unlocked': {
        title: 'unlocked_plugin — one name, or empty', tag: 'state',
        what: 'The runtime guarantee that at most one plugin is editable at any moment: plugin_integrity’s data.json holds either one plugin name or the empty string (= locked).',
        why: 'Serialize plugin edits to one writer at a time, so a revert always has an unambiguous target. One-at-a-time is the current design — a future variation may admit more if it earns real value.',
        hood: '<code>unlocked_plugin</code> is hook-written ONLY, via the answered [PLUGIN-LOCK] question — the agent never sets it directly. Source: <code>plugins-substrate.md</code> · "Single-unlocked-plugin invariant".'
    },
    'ps-check1': {
        title: 'CHECK 1 — plugin lock', tag: 'gate',
        what: 'On every Edit/Write/MultiEdit, plugin-guard.sh reads unlocked_plugin and blocks any edit that does not target it.',
        why: 'This is the always-on reflex that makes the lock ceremony non-optional — the invariant is checked at the moment of every write, not just at unlock.',
        hood: 'The <code>### CHECK 1: plugin lock</code> arm in <code>plugin-guard.sh</code>. An edit landing OUTSIDE the unlocked plugin doesn’t just block — the <code>_should_autolock()</code> branch fires the safe-lock cycle on the prior plugin (self-healing). Source: <code>plugins-substrate.md</code> · "Mechanics — three gates".'
    },
    'ps-switch-block': {
        title: 'plugin-switch BLOCK', tag: 'gate',
        what: 'Unlocking plugin B while A is still unlocked is refused — even on a clean tree. The agent is told to close A via lock-cmd.sh first.',
        why: 'A silent switch would expose A’s uncommitted work to a safe-lock revert. Making close-out a deliberate act protects work-in-flight. (Re-unlocking the SAME plugin is idempotent.)',
        hood: 'The plugin-switch check in <code>lock-manager.sh</code>, voice <code>plugin-switch-blocked-active</code>. Source: <code>plugins-substrate.md</code> · "Mechanics — three gates".'
    },
    'ps-dirty': {
        title: 'dirty-tree block', tag: 'gate',
        what: 'Any uncommitted change anywhere in the repo (git status --short) blocks a new unlock.',
        why: 'So the captured <code>checkpoint_ref</code> is a clean rollback point — every lock cycle starts from a clean episodic baseline, and unrelated work can never be swept into a revert.',
        hood: 'The repo-wide dirty-tree check in <code>lock-manager.sh</code> (the dirty-tree block arm). Source: <code>plugins-substrate.md</code> · "Dirty-tree block".'
    },
    /* ---- Detail 2,1: data.json hidden state ---- */
    'ps-hidden': {
        title: 'data.json is hidden state', tag: 'state',
        what: 'Every plugin’s data.json is hidden — the agent cannot read or edit it directly. The sole access path is the plugin’s own gateway script.',
        why: 'Friction, not elimination: the agent could find an unprotected path, but none is trivial — and every block is a chance to inject the gateway route at exactly the moment the agent reached for the wrong one.',
        hood: 'Direct Read → exit 2 ("data.json is hidden state — use the plugin script commands"); Edit/Write/MultiEdit + Bash <code>cat/grep/jq</code> touches also refused. Source: <code>plugin-guard.sh</code> data.json protection arm.'
    },
    'ps-gateway': {
        title: 'the --hook gateway', tag: 'action',
        what: 'The only mutation route is the plugin’s gateway script invoked with the --hook flag — and that flag is globally blocked in the agent’s own Bash.',
        why: 'So state changes originate ONLY from framework-fired hooks, never agent free-hand. The public/internal API split is preserved — the agent cannot impersonate the hook machinery.',
        hood: 'The hook-flag arm in <code>plugin-guard.sh</code> blocks any agent Bash containing <code>--hook</code> (after quote-stripping). Writes use an atomic protocol: <code>flock</code> → <code>jq</code>-transform to <code>.tmp</code> → <code>jq empty</code> validate → atomic <code>mv</code>. Source: <code>plugins-substrate.md</code> · "State gateway".'
    },
    'ps-blocked': {
        title: 'direct access blocked, exit 2', tag: 'gate',
        what: 'Reads AND writes to any plugin’s data.json are blocked; only scripts running inside plugins/*/hooks|scripts/ have internal access.',
        why: 'Hidden state stays hidden — the agent reasons about plugin state only through gateway commands, never raw inspection. Some fields (<code>checkpoint_ref</code>, <code>unlocked_plugin</code>) have no public read at all.',
        hood: 'The data.json protection arm in <code>plugin-guard.sh</code>; cross-plugin queries route through published read-only commands the owning plugin controls. Source: <code>plugins-substrate.md</code> · "Direct access is blocked, exit 2".'
    },
    'ps-gitignore': {
        title: 'per-machine, never committed', tag: 'context',
        what: 'A repo-level .gitignore globs **/data.json, **/data.json.lock, **/data.json.tmp — hidden state, its lockfile, and its atomic-write temp never enter git.',
        why: '<code>data.json</code> is per-machine runtime state, inherited automatically by every plugin — no per-plugin <code>.gitignore</code> needed.',
        hood: 'Fail-safe stance is concern-specific: on corruption, <code>brain_guard</code> REBUILDS from defaults (zero-downtime), while <code>job_core</code>’s stop-gate BLOCKS (losing job state is the unsafe outcome). Source: <code>plugins-substrate.md</code> · "Per-machine" / "Fail-safe stance".'
    },
    /* ---- Card 4: unlock ([PLUGIN-LOCK]) ---- */
    'ps-pluginlock': {
        title: '[PLUGIN-LOCK] — the unlock question', tag: 'action',
        what: 'The prefixed AskUserQuestion that opens a plugin for editing. It is the doorway through which plugin-substrate editing permission is granted — user-confirmed, never self-authorized.',
        why: 'Editing the plugin layer alters the substrate that polices every other plugin. That work can only happen in one of two protected contexts (Identity Fact 2).',
        hood: 'Handled by the <code>lock-manager.sh</code> PLUGIN-LOCK arm (a Pre+PostToolUse:AskUserQuestion hook). It runs the gates below, then <code>write_unlock_state()</code> atomically sets <code>unlocked_plugin</code> + <code>checkpoint_ref</code>. Source: <code>plugins-substrate.md</code> · "Single-unlocked-plugin invariant".'
    },
    'ps-admission': {
        title: 'admission — gmode OR approval', tag: 'gate',
        what: 'A [PLUGIN-LOCK] (edits AND new-plugin births) admits only when current_phase == gmode OR the focused job’s plugin_lock_approval == true.',
        why: 'The agent cannot self-authorize substrate work. The two routes are: ask [GMODE] with a 100+ word justification, or get a [JOB-APPROVE-CREATION] job whose approval flag is user-set. Either way the flag is user-confirmed.',
        hood: 'The Gmode-OR-plugin_lock_approval gate in <code>lock-manager.sh</code> (the admission arm reads the focused job’s <code>plugin_lock_approval</code> from <code>job_core/data.json</code>); the block message names both routes. Source: <code>plugins-substrate.md</code> · "PLUGIN-LOCK admission gate".'
    },
    'ps-wordfloor': {
        title: 'word floor — ≥100 words', tag: 'gate',
        what: 'The [PLUGIN-LOCK] question body must be at least PLUGIN_LOCK_WORD_MIN (100) words — checked BEFORE format parsing.',
        why: 'Forced thinking: a short lock request hides the cognitive work that should precede every unlock. The order matters for teaching — a too-short body gets the real "justify more" message, not a misleading format error.',
        hood: 'The word-floor check at the TOP of the <code>lock-manager.sh</code> PLUGIN-LOCK handler (<code>wc -w</code> vs <code>PLUGIN_LOCK_WORD_MIN</code> from <code>config.conf</code>, default 100), voice <code>plugin-lock-short-description</code>. Source: <code>plugins-substrate.md</code> · catalog B / <code>config.conf</code>.'
    },
    'ps-driftgate': {
        title: 'drift-gate', tag: 'gate',
        what: 'The unlock is blocked when the plugin’s evolution.md has gone stale — commits-since-last-narration ≥ DRIFT_THRESHOLD (10).',
        why: 'Knowledge debt cannot accumulate silently — a plugin that changed a lot without its lived-history re-narrated must be re-narrated before it can change more.',
        hood: '<code>drift-check.sh</code> counts <code>git rev-list --count &lt;LAST_SYNC&gt;..HEAD -- &lt;plugin_dir&gt;</code>; <code>lock-manager.sh</code> blocks (exit 2) when <code>drift_count ≥ DRIFT_THRESHOLD</code>, naming <code>historian-&lt;plugin&gt;</code>. Two numbers: config sets 10; the script’s <code>${DRIFT_THRESHOLD:-5}</code> fallback is the deliberate stricter safe-mode default. Source: <code>plugins-substrate.md</code> · "Drift-gate".'
    },
    'ps-evoinject': {
        title: 'evolution.md injected', tag: 'action',
        what: 'On a successful unlock, the plugin’s living-history narrative is read into context — the unlocking agent is briefed with the plugin’s accumulated memory at the exact moment editing opens.',
        why: 'So the edit continues the same decisions, standards, and discipline the plugin already established — history is read before code is changed.',
        hood: '<code>lock-manager.sh</code> emits the <code>evo_section</code> via <code>hookSpecificOutput.additionalContext</code> (PostToolUse stderr from exit-0 hooks is dropped by Claude Code, so it must ride additionalContext). Source: <code>plugins-substrate.md</code> · "Auto-injection at unlock".'
    },
    'ps-checkpoint': {
        title: 'checkpoint_ref captured', tag: 'state',
        what: 'The git HEAD SHA recorded into data.json at unlock — the rollback anchor. There is never an unlocked plugin without a checkpoint.',
        why: 'It binds the permission grant and its rollback target in one atomic write, so every self-modification is reversible by construction. safe-lock reverts the plugin to exactly this state on test failure.',
        hood: '<code>write_unlock_state()</code> in <code>lock-manager.sh</code> sets <code>unlocked_plugin</code> + <code>checkpoint_ref</code> (current HEAD) atomically and clears <code>unlocked_test</code>. Source: <code>plugins-substrate.md</code> · "checkpoint_ref".'
    },
    /* ---- Detail 3,1: drift-gate + historian-ratchet wheel ---- */
    'ps-drift-count': {
        title: 'Step 1 — drift counter climbs', tag: 'state',
        what: 'Plugin commits accumulate; the drift counter climbs — it counts commits touching the plugin since evolution.md was last committed.',
        why: 'Drift counts COMMITS, not mtime — so an uncommitted sync to <code>evolution.md</code> wouldn’t reset it. The historian must auto-commit its narration.',
        hood: '<code>drift-check.sh</code>: <code>LAST_SYNC = git log -1 --format=%H -- evolution.md</code>; count = <code>git rev-list --count &lt;LAST_SYNC&gt;..HEAD -- &lt;plugin_dir&gt;</code>. If git history is unavailable it returns the sentinel 999 (<code>HIGH_DRIFT_VALUE</code>). Source: <code>plugins-substrate.md</code> · "Historian-ratchet steps".'
    },
    'ps-threshold': {
        title: 'Step 2 — ≥ DRIFT_THRESHOLD blocks unlock', tag: 'gate',
        what: 'When drift_count ≥ DRIFT_THRESHOLD (default 10), the next [PLUGIN-LOCK] unlock is blocked until the history is re-narrated.',
        why: 'The gate blocks the UNLOCK question — not edits within an already-open unlock. It forces narrative memory to keep pace with code.',
        hood: 'The drift-gate check in <code>lock-manager.sh</code> reads <code>DRIFT_THRESHOLD</code> from <code>config.conf</code> and emits the <code>plugin-evolution-stale</code> voice, dumping the un-narrated commits. Source: <code>plugins-substrate.md</code> · "Drift-gate".'
    },
    'ps-historian': {
        title: 'Step 3 — historian re-narrates', tag: 'action',
        what: 'The matching historian-plugin subagent is dispatched to re-narrate the plugin’s evolution.md from its git log — under the word cap.',
        why: 'The historian turns raw commits into recallable narrative. There are 13 system-wide (12 centralized in <code>plugin_integrity/agents/</code> plus question_discipline’s own).',
        hood: 'The historian auto-commit exemption in <code>plugin-guard.sh</code> lets <code>historian-*</code> subagents <code>git commit</code> <code>docs/*.md</code> without an unlocked plugin (gated to a <code>historian:</code> commit-message prefix) — breaking the drift-gate deadlock. Source: <code>plugins-substrate.md</code> · "Who writes it — the historian".'
    },
    'ps-reset': {
        title: 'Step 4 — counter resets to zero', tag: 'state',
        what: 'The historian commits to evolution.md; that commit becomes the new LAST_SYNC, so the next drift-check counts 0 — unlock can proceed.',
        why: 'The ratchet reset. The four positions of the wheel keep every plugin’s lived-history periodically re-narrated as it evolves.',
        hood: 'Because <code>LAST_SYNC</code> is the historian’s commit SHA, the count window restarts at it. Source: <code>plugins-substrate.md</code> · "Historian-ratchet steps" · Step 4.'
    },
    /* ---- Card 5: the two closes ---- */
    'ps-lockcmd': {
        title: 'lock-cmd.sh — the preferred close', tag: 'action',
        what: 'The deliberate, agent-initiated way to close an unlocked plugin: the agent runs bash lock-cmd.sh, the test suite runs at the boundary, and on FAIL the working tree is PRESERVED (no revert).',
        why: 'Reach for it when done and confident. On FAIL you keep your edits and fix them — done work is never lost to a premature auto-revert.',
        hood: '<code>lock-cmd.sh</code>: PASS (the <code>all_pass</code> branch) → commits "plugin &lt;p&gt;: locked via lock-cmd.sh (tests passed)" + <code>clear_lock_state()</code>; FAIL → emits <code>lock-cmd-failed-no-revert</code>, leaves tree AND <code>unlocked_plugin</code> UNCHANGED, exit 1. No force-commit override. Source: <code>plugins-substrate.md</code> · "lock-cmd close-out".'
    },
    'ps-preserve': {
        title: 'PASS → commit · FAIL → PRESERVE', tag: 'object',
        what: 'lock-cmd’s outcome pair: tests pass → the plugin’s changes are staged and committed and the lock clears; tests fail → the tree is preserved, the agent fixes and re-runs.',
        why: 'This is the half people forget: a red test under lock-cmd does NOT roll back your work. The instruction layer keeps this explicit so the seed never loses done work.',
        hood: 'The <code>lock-cmd-failed-no-revert</code> voice states "Working tree PRESERVED, NO REVERT." Empty <code>unlocked_plugin</code> is idempotent exit 0 (<code>read_unlocked_plugin()</code>). Source: <code>plugins-substrate.md</code> · "The contrast that matters".'
    },
    'ps-safelock': {
        title: 'safe-lock — the defensive backstop', tag: 'action',
        what: 'The automatic close that fires when the agent moves off an unlocked plugin without running lock-cmd — a phase transition, an edit landing outside it, session end.',
        why: 'It catches the edits the agent forgot to close. A bad plugin edit can never silently reach a commit — if the tests aren’t passing, the edits cannot become final.',
        hood: '<code>safe-lock.sh</code> reads <code>checkpoint_ref</code> and runs every file in <code>tests/</code> (per-test <code>LOCK_TEST_TIMEOUT</code>): PASS → commit "locked (tests passed)" + clear lock; No tests → warn + lock (no checkpoint, no revert). Source: <code>plugins-substrate.md</code> · "Safe-lock cycle".'
    },
    'ps-quarantine': {
        title: 'FAIL → quarantine + auto-revert', tag: 'object',
        what: 'safe-lock’s FAIL branch: quarantine-before-revert. It first commits uncommitted work to a "quarantine before revert" commit so it survives in git log, captures pre_revert_sha, then checks out checkpoint_ref and locks.',
        why: 'The revert is destructive to the working tree but never to memory — failed work stays recoverable from git log for diagnosis and retry. There is no "commit anyway" path.',
        hood: '<code>safe-lock.sh</code> FAIL branch + <code>log_revert()</code> append a schema-v3 revert_log entry: exactly 7 fields <code>{timestamp, plugin, failed_tests, files_reverted, reverted_files, pre_revert_sha, trigger_reason}</code>, FIFO-capped at 20; recovery path printed (<code>git checkout &lt;pre_revert_sha&gt; -- &lt;plugin_dir&gt;/</code>). Source: <code>plugins-substrate.md</code> · "Mechanics (safe-lock.sh)".'
    },
    /* ---- Card 6: test-file protection ---- */
    'ps-check2': {
        title: 'CHECK 2 — tests/*.sh frozen', tag: 'gate',
        what: 'Even inside an unlocked plugin, tests/*.sh files are frozen by default — the safety net is harder to lift than the code beneath it.',
        why: 'Weakening the tests is always a separate, deliberate act — never a side effect of unlocking the plugin. The tests are the verifier of everything else.',
        hood: 'The <code>### CHECK 2: test file lock</code> arm in <code>plugin-guard.sh</code> freezes ONLY <code>.sh</code> files in <code>tests/</code> (<code>CLAUDE.md</code>/non-<code>.sh</code> stay free). CHECK 2 is subordinate — it runs only if the plugin is already unlocked. Source: <code>plugins-substrate.md</code> · "Test-file protection".'
    },
    'ps-testlock': {
        title: '[TEST-LOCK] <file.sh>', tag: 'action',
        what: 'The nested, finer question that unlocks one named test file — inside an already-unlocked plugin. It carries its own 100-word floor.',
        why: 'Test edits are intentional and accidental edits minimized. The target test must belong to the currently-unlocked plugin (blocks cross-plugin stub leakage).',
        hood: 'The TEST-LOCK handler in <code>lock-manager.sh</code> validates plugin-already-unlocked + word floor + format, verifies ownership, creates a stub if missing, then <code>write_unlocked_test()</code>. Source: <code>plugins-substrate.md</code> · catalog C / job-system "[TEST-LOCK]".'
    },
    'ps-unlockedtest': {
        title: 'unlocked_test — one .sh file', tag: 'state',
        what: 'The second lock-state field: the single test file currently editable. Decoupled from unlocked_plugin so the two granularities toggle independently.',
        why: 'An <code>.sh</code> test edit is admitted only when its filename equals <code>unlocked_test</code> — the test surface opens one file at a time.',
        hood: 'The two-field schema (<code>unlocked_plugin</code> AND <code>unlocked_test</code>) in <code>plugin_integrity/data.json</code>; <code>write_unlock_state()</code> clears <code>unlocked_test</code> at every plugin unlock. Source: <code>plugins-substrate.md</code> · "Mechanics — the two-field schema".'
    },
    'ps-shonly': {
        title: '.sh only — docs stay free', tag: 'context',
        what: 'CHECK 2 freezes only .sh files in tests/. A CLAUDE.md or non-.sh file in tests/ stays freely editable.',
        why: 'Friction tracks danger: the executable verifier is what must be protected, not the test directory’s prose. <code>e2e/</code> tests sit in the execution whitelist but NOT under test-lock.',
        hood: 'The <code>plugins/&lt;unlocked&gt;/tests/.*\\.sh$</code> match in <code>plugin-guard.sh</code> CHECK 2. Source: <code>plugins-substrate.md</code> · "Test-file protection" Avoid-line.'
    },
    /* ---- Card 7: birth ---- */
    'ps-newtarget': {
        title: '[PLUGIN-LOCK] a non-existent plugin', tag: 'action',
        what: 'When a [PLUGIN-LOCK] targets a plugin that does not yet exist, the birth ceremony fires — the same admission gate (gmode OR approval) applies to births as to edits.',
        why: 'A new plugin starts from a consistent minimal floor with its lived-history machinery already wired — no hand-assembly, no missing baseline.',
        hood: 'The plugin-birth arm in <code>lock-manager.sh</code> (prior behavior bypassed birth; the admission gate now covers BOTH edits and births). Source: <code>plugins-substrate.md</code> · "Plugin birth ceremony".'
    },
    'ps-template': {
        title: 'stamp the template', tag: 'object',
        what: 'The ceremony copies the universal template tree, then sed-substitutes {{PLUGIN_NAME}} / {{DATE}} in the copied files.',
        why: 'Every new organ starts with the same skeleton and discipline — the anatomy is standardized at birth, not improvised later.',
        hood: 'The <code>lock-manager.sh</code> birth arm does <code>mkdir</code> + <code>cp -r</code> the template, then <code>sed</code>-substitutes placeholders. Source: <code>plugins-substrate.md</code> · "Mechanics (lock-manager.sh plugin-birth arm)".'
    },
    'ps-floor': {
        title: 'the 3-file floor', tag: 'object',
        what: 'The minimal floor is exactly 3 files: CLAUDE.md, docs/evolution.md, and _historian.md. hooks/scripts/tests/voice.xml/data.json/agents are NOT stamped — the seed authors them during EXECUTE on top of the floor.',
        why: 'Birth stamps a floor, not a full plugin. The plugin matures afterward: idea/docs → structure/hooks → behavior/scripts+data.json → verification/tests → maturity/agents.',
        hood: 'Verified <code>template/</code> contents: <code>CLAUDE.md</code>, <code>docs/evolution.md</code>, <code>_historian.md</code>. The <code>_</code> prefix means "creator raw material" — the copy step EXCLUDES <code>_</code>-prefixed files; the historian is generated separately. Source: <code>plugins-substrate.md</code> · "the minimal floor is exactly 3 files".'
    },
    'ps-historian-gen': {
        title: 'historian generated', tag: 'action',
        what: 'The birth generates historian-dashed-name.md from _historian.md (substituting {{PLUGIN_NAME}} / {{PLUGIN_DASHED}}) — into plugin_integrity/agents/, centrally.',
        why: 'Every plugin is born with its own historian — narrative memory is part of the anatomy, not an add-on. Historians live centrally (question_discipline’s own is the sole standing exception).',
        hood: 'The historian-generation step in the <code>lock-manager.sh</code> birth arm. Source: <code>plugins-substrate.md</code> · "Plugin birth ceremony".'
    },
    'ps-birthcommit': {
        title: 'birth commit = drift baseline', tag: 'state',
        what: 'The ceremony ends by auto-committing the birth: git commit "birth: target plugin initialized from template".',
        why: 'The birth commit gives <code>drift-check</code> a clean baseline, so the first unlock isn’t blocked by the 999 sentinel. Birth does NOT touch <code>settings.local.json</code> — registering the new hooks is the operator’s separate, deliberate step.',
        hood: 'The birth-commit step in <code>lock-manager.sh</code>. Adding a plugin = a new directory + appended hook entries in <code>settings.local.json</code> — no central registry, no inheritance. Source: <code>plugins-substrate.md</code> · "Extensibility — no central coupling".'
    }
};

window.DECK_CARDS = {
    /* ====================== Card 1: the cell ====================== */
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'plugin substrate · step 1',
        title: 'A plugin is a cognitive cell',
        sub: 'What you\'re looking at: the architectural unit of the seed — one concern, a published surface, and a gate heavier than any project edit.',
        boxes: [
            { id:'ps-cell', x:80, y:160, w:210, h:130, tag:'object', t:'a plugin', s:'a cognitive cell' },
            { id:'ps-one-concern', x:360, y:95, w:210, h:95, tag:'object', t:'one concern', s:'never a tangle' },
            { id:'ps-commands', x:360, y:235, w:210, h:95, tag:'action', t:'published commands', s:'read-only, cross-plugin' },
            { id:'ps-substrate-cost', x:660, y:160, w:250, h:130, tag:'gate', t:'substrate-wide cost', s:'so its gate is heavier' }
        ],
        edges: [
            { from:'ps-cell', to:'ps-one-concern', kind:'hard', label:'owns' },
            { from:'ps-cell', to:'ps-commands', kind:'soft', label:'exposes' },
            { from:'ps-cell', to:'ps-substrate-cost', kind:'soft', label:'heavier gate' }
        ],
        stickies: [
            { x:80, y:28, aha:true, text:'A plugin is a <b>single-concern cognitive cell</b> — evolved, tested, and reverted on its own. Its gate is heavier than a project edit because a code regression is <b>substrate-wide</b>.',
              ref: { url:'../07_1-plugin-kit-foundation.html', section:'Blog 7.1 · the plugin as the unit', blurb:'07_1 introduces the plugin as the architectural unit of the hard layer. This deck draws the cell, its anatomy, and the lock ceremony that keeps self-modification safe.' } },
            { x:660, y:310, text:'These organs make up the always-on plugins.',
              ref: { kind: 'deck', url: '../../b5/explore/plugin-population.html', section: 'The Always-On Plugins', blurb: 'The always-on layer these plugin organs live inside.' } }
        ],
        navHints: { right: 'the anatomy', down: 'who reads / writes / depends' }
    },
    /* ---- Detail 0,1: the read/write/depend triple ---- */
    '0,1': {
        kind: 'detail', step: 1,
        eyebrow: 'plugin substrate · detail',
        title: 'Every organ: read · write · depend-on',
        sub: 'How a single-concern cell stays safe to revert: each organ is described by three properties, and the security model is writer-exclusivity.',
        boxes: [
            { id:'ps-reads', x:90, y:150, w:210, h:105, tag:'state', t:'who READS', s:'via published command' },
            { id:'ps-writes', x:385, y:150, w:210, h:105, tag:'state', t:'who WRITES', s:'usually exactly one' },
            { id:'ps-depends', x:680, y:150, w:210, h:105, tag:'state', t:'what it DEPENDS on', s:'linked, not independent' },
            { id:'ps-writer-excl', x:385, y:320, w:210, h:95, tag:'gate', t:'writer-exclusivity', s:'one gated writer' }
        ],
        edges: [
            { from:'ps-writes', to:'ps-writer-excl', kind:'hard', label:'the security model' }
        ],
        stickies: [
            { x:90, y:30, aha:true, text:'<b>Writer-exclusivity</b> is the security model: usually exactly one gated writer per organ, so a revert always has an unambiguous target.' }
        ],
        navHints: { up: 'back to the cell' }
    },
    /* ====================== Card 2: the anatomy ====================== */
    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'plugin substrate · step 2',
        title: 'The anatomy — a six-organ skeleton',
        sub: 'What you\'re looking at: the core skeleton every functional plugin carries, plus optional organs layered atop. Absence is information.',
        boxes: [
            { id:'ps-claudemd', x:80, y:110, w:185, h:80, tag:'object', t:'CLAUDE.md', s:'brain surface' },
            { id:'ps-hooks', x:290, y:110, w:185, h:80, tag:'object', t:'hooks/', s:'reflexes' },
            { id:'ps-scripts', x:500, y:110, w:185, h:80, tag:'object', t:'scripts/', s:'verbs' },
            { id:'ps-tests', x:80, y:225, w:185, h:80, tag:'object', t:'tests/', s:'safety net' },
            { id:'ps-docs', x:290, y:225, w:185, h:80, tag:'object', t:'docs/', s:'evolution.md' },
            { id:'ps-datajson', x:500, y:225, w:185, h:80, tag:'state', t:'data.json', s:'hidden state' },
            { id:'ps-optional', x:715, y:150, w:205, h:135, tag:'context', t:'optional organs', s:'template / agents / config / voice' }
        ],
        edges: [],
        stickies: [
            { x:80, y:28, aha:true, text:'The <b>skeleton trio</b> — CLAUDE.md, hooks/, scripts/ — plus tests/ docs/ data.json. Optional organs are layered atop: <b>their absence is intentional signal</b>.',
              ref: { url:'../07_2-skeleton-claudemd-hooks-scripts.html', section:'Blog 7.2 · the skeleton', blurb:'07_2 walks the CLAUDE.md / hooks / scripts skeleton and the read/write/depend triple per organ.' } },
            { x:500, y:340, text:'The dual voice.xml is the softest customization layer.',
              ref: { kind: 'deck', url: 'voice-surface.html', section: 'The Voice Surface', blurb: 'voice.xml — the softest, cheapest customization layer.' } },
            { x:715, y:340, text:'The agents/ organ runs the 80/20 dispatch economy.',
              ref: { kind: 'deck', url: 'delegation-economy.html', section: 'The Delegation Economy', blurb: 'The agents/ organ and the 80/20 dispatch budget.' } }
        ],
        navHints: { left: 'the cell', right: 'one at a time' }
    },
    /* ====================== Card 3: the invariant ====================== */
    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'plugin substrate · step 3',
        title: 'At most one plugin unlocked',
        sub: 'What you\'re looking at: the runtime invariant — one editable plugin at a time — and the three checks that hold it.',
        boxes: [
            { id:'ps-unlocked', x:90, y:165, w:235, h:120, tag:'state', t:'unlocked_plugin', s:'one name, or empty' },
            { id:'ps-check1', x:415, y:95, w:215, h:95, tag:'gate', t:'CHECK 1', s:'plugin lock' },
            { id:'ps-switch-block', x:415, y:215, w:215, h:95, tag:'gate', t:'plugin-switch BLOCK', s:'close A first' },
            { id:'ps-dirty', x:700, y:165, w:210, h:120, tag:'gate', t:'dirty-tree block', s:'clean checkpoint' }
        ],
        edges: [
            { from:'ps-check1', to:'ps-unlocked', kind:'hard', label:'reads on every edit' },
            { from:'ps-switch-block', to:'ps-unlocked', kind:'soft', label:'guards switches' },
            { from:'ps-dirty', to:'ps-unlocked', kind:'soft', label:'before unlock' }
        ],
        stickies: [
            { x:90, y:30, aha:true, text:'<code>unlocked_plugin</code> holds <b>one name or the empty string</b>. It is hook-written only — the agent never sets it directly; the answered [PLUGIN-LOCK] does.',
              ref: { url:'../07_8-lock-ceremony.html', section:'Blog 7.8 · the lock ceremony', blurb:'07_8 is the home essay for this deck — the single-unlocked invariant and the lock ceremony in full.' } }
        ],
        navHints: { left: 'anatomy', right: 'the unlock', down: 'data.json is hidden' }
    },
    /* ---- Detail 2,1: data.json hidden state ---- */
    '2,1': {
        kind: 'detail', step: 3,
        eyebrow: 'plugin substrate · detail',
        title: 'data.json — hidden state',
        sub: 'How the invariant’s state stays trustworthy: the agent can never read or write it directly — only the plugin’s gateway can.',
        boxes: [
            { id:'ps-hidden', x:95, y:160, w:215, h:115, tag:'state', t:'data.json', s:'hidden — no direct read' },
            { id:'ps-gateway', x:385, y:95, w:225, h:95, tag:'action', t:'the --hook gateway', s:'framework-fired only' },
            { id:'ps-blocked', x:385, y:230, w:225, h:95, tag:'gate', t:'direct access blocked', s:'exit 2' },
            { id:'ps-gitignore', x:690, y:160, w:215, h:115, tag:'context', t:'never committed', s:'per-machine' }
        ],
        edges: [
            { from:'ps-gateway', to:'ps-hidden', kind:'hard', label:'sole writer' },
            { from:'ps-blocked', to:'ps-hidden', kind:'hard', label:'guards it' }
        ],
        stickies: [
            { x:95, y:30, aha:true, text:'<b>Friction, not elimination</b> — a direct touch is blocked (exit 2) and every block injects the gateway route at the moment the agent reached for the wrong one.' }
        ],
        navHints: { up: 'the invariant' }
    },
    /* ====================== Card 4: unlock ([PLUGIN-LOCK]) ====================== */
    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'plugin substrate · step 4',
        title: 'Unlock — the [PLUGIN-LOCK] ceremony',
        sub: 'What you\'re looking at: the heavy gate that opens a plugin — user-confirmed admission, a word floor, the drift-gate, a history briefing, and a captured rollback point.',
        boxes: [
            { id:'ps-pluginlock', x:70, y:175, w:175, h:115, tag:'action', t:'[PLUGIN-LOCK]', s:'the unlock question' },
            { id:'ps-admission', x:275, y:90, w:200, h:80, tag:'gate', t:'admission', s:'gmode OR approval' },
            { id:'ps-wordfloor', x:275, y:188, w:200, h:80, tag:'gate', t:'word floor', s:'≥100 words' },
            { id:'ps-driftgate', x:275, y:286, w:200, h:80, tag:'gate', t:'drift-gate', s:'history not stale' },
            { id:'ps-evoinject', x:510, y:140, w:195, h:95, tag:'action', t:'evolution.md', s:'injected at unlock' },
            { id:'ps-checkpoint', x:740, y:175, w:185, h:115, tag:'state', t:'checkpoint_ref', s:'captured (rollback)' }
        ],
        edges: [
            { from:'ps-pluginlock', to:'ps-admission', kind:'hard', label:'must pass' },
            { from:'ps-pluginlock', to:'ps-wordfloor', kind:'hard', label:'≥100w' },
            { from:'ps-pluginlock', to:'ps-driftgate', kind:'hard', label:'not stale' },
            { from:'ps-driftgate', to:'ps-evoinject', kind:'soft', label:'then brief' },
            { from:'ps-evoinject', to:'ps-checkpoint', kind:'hard', label:'unlock + capture' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'The agent <b>cannot self-authorize</b> substrate work — admission needs gmode OR a user-approved job. The unlock captures <code>checkpoint_ref</code>: there is never an unlocked plugin without a rollback point.' }
        ],
        navHints: { left: 'invariant', right: 'the two closes', down: 'drift-gate & historian' }
    },
    /* ---- Detail 3,1: drift-gate + historian-ratchet ---- */
    '3,1': {
        kind: 'detail', step: 4,
        eyebrow: 'plugin substrate · detail',
        title: 'The historian-ratchet — four positions',
        sub: 'How knowledge debt can’t accumulate silently: a four-step wheel that re-narrates a plugin’s history before it can change more.',
        boxes: [
            { id:'ps-drift-count', x:110, y:120, w:215, h:95, tag:'state', t:'1 · counter climbs', s:'commits since narration' },
            { id:'ps-threshold', x:430, y:120, w:230, h:95, tag:'gate', t:'2 · ≥ DRIFT_THRESHOLD', s:'blocks the unlock' },
            { id:'ps-historian', x:430, y:285, w:230, h:95, tag:'action', t:'3 · historian re-narrates', s:'evolution.md' },
            { id:'ps-reset', x:110, y:285, w:215, h:95, tag:'state', t:'4 · counter resets', s:'→ 0, unlock proceeds' }
        ],
        edges: [
            { from:'ps-drift-count', to:'ps-threshold', kind:'hard', label:'climbs to' },
            { from:'ps-threshold', to:'ps-historian', kind:'hard', label:'dispatch' },
            { from:'ps-historian', to:'ps-reset', kind:'hard', label:'commit' },
            { from:'ps-reset', to:'ps-drift-count', kind:'soft', label:'ratchet' }
        ],
        stickies: [
            { x:110, y:28, aha:true, text:'Drift counts <b>commits</b>, not mtime — so the historian must <b>auto-commit</b> its narration to reset the wheel. The default trip-point is <code>DRIFT_THRESHOLD</code> = 10.' }
        ],
        navHints: { up: 'the unlock' }
    },
    /* ====================== Card 5: the two closes ====================== */
    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'plugin substrate · step 5',
        title: 'Two ways to close — preserve, or revert',
        sub: 'What you\'re looking at: same trigger (tests run at the close), opposite failure behaviour. lock-cmd PRESERVES; safe-lock REVERTS.',
        boxes: [
            { id:'ps-lockcmd', x:80, y:110, w:240, h:90, tag:'action', t:'lock-cmd.sh', s:'preferred, agent-run' },
            { id:'ps-preserve', x:80, y:235, w:240, h:90, tag:'object', t:'PASS→commit / FAIL→PRESERVE', s:'keep edits, fix, re-run' },
            { id:'ps-safelock', x:430, y:110, w:240, h:90, tag:'action', t:'safe-lock', s:'defensive backstop' },
            { id:'ps-quarantine', x:430, y:235, w:240, h:90, tag:'object', t:'FAIL→quarantine + revert', s:'recoverable from git log' },
            { id:'ps-checkpoint', x:720, y:170, w:195, h:120, tag:'state', t:'checkpoint_ref', s:'the revert target' }
        ],
        edges: [
            { from:'ps-lockcmd', to:'ps-preserve', kind:'hard', label:'on fail' },
            { from:'ps-safelock', to:'ps-quarantine', kind:'hard', label:'on fail' },
            { from:'ps-quarantine', to:'ps-checkpoint', kind:'hard', label:'reverts to' }
        ],
        stickies: [
            { x:80, y:28, aha:true, text:'The split people forget: <b>lock-cmd preserves</b> your work on a red test (fix &amp; re-run); <b>safe-lock auto-reverts</b> to the checkpoint. Reach for lock-cmd when done &amp; confident.' }
        ],
        navHints: { left: 'the unlock', right: 'test-file protection', down: 'lock-cmd vs safe-lock' }
    },
    /* ---- Detail 4,1: lock-cmd vs safe-lock ---- */
    '4,1': {
        kind: 'detail', step: 5,
        eyebrow: 'plugin substrate · detail',
        title: 'lock-cmd vs safe-lock',
        sub: 'What you\'re looking at: two close paths, same trigger (tests run at the boundary), opposite failure behaviour — lock-cmd preserves your work; safe-lock auto-reverts to the checkpoint.',
        boxes: [
            { id:'cl-cmd', x:100, y:130, w:230, h:95, tag:'action', t:'lock-cmd.sh', s:'agent-run, preferred close' },
            { id:'cl-safe', x:100, y:265, w:230, h:95, tag:'action', t:'safe-lock.sh', s:'defensive backstop' },
            { id:'cl-pass', x:430, y:90, w:210, h:85, tag:'state', t:'tests PASS', s:'both commit + clear lock' },
            { id:'cl-fail', x:430, y:235, w:210, h:85, tag:'state', t:'tests FAIL', s:'lock-cmd keeps · safe-lock reverts' },
            { id:'cl-chk', x:710, y:235, w:185, h:90, tag:'state', t:'checkpoint_ref', s:'the revert target' }
        ],
        edges: [
            { from:'cl-cmd', to:'cl-pass', kind:'hard', label:'on pass' },
            { from:'cl-safe', to:'cl-pass', kind:'hard', label:'on pass' },
            { from:'cl-cmd', to:'cl-fail', kind:'soft', label:'PRESERVES' },
            { from:'cl-safe', to:'cl-fail', kind:'soft', label:'REVERTS' },
            { from:'cl-safe', to:'cl-chk', kind:'hard', label:'reverts to' }
        ],
        stickies: [
            { x:100, y:30, aha:true, text:'<b>lock-cmd preserves</b> your work on a red test — fix and re-run. <b>safe-lock auto-reverts</b> to the checkpoint — quarantine commit first so nothing is lost from git log. Reach for lock-cmd when done and confident.' }
        ],
        navHints: { up: 'the two closes' }
    },
    /* ====================== Card 6: test-file protection ====================== */
    '5,0': {
        kind: 'seq', step: 6,
        eyebrow: 'plugin substrate · step 6',
        title: 'The safety net is locked harder than the code',
        sub: 'What you\'re looking at: why test .sh files stay frozen even inside an unlocked plugin — and the nested [TEST-LOCK] that thaws exactly one.',
        boxes: [
            { id:'ps-check2', x:100, y:165, w:215, h:120, tag:'gate', t:'CHECK 2', s:'tests/*.sh frozen' },
            { id:'ps-testlock', x:400, y:95, w:215, h:95, tag:'action', t:'[TEST-LOCK] <file.sh>', s:'one named file' },
            { id:'ps-unlockedtest', x:400, y:215, w:215, h:95, tag:'state', t:'unlocked_test', s:'the second field' },
            { id:'ps-shonly', x:690, y:165, w:210, h:120, tag:'context', t:'.sh only', s:'docs stay free' }
        ],
        edges: [
            { from:'ps-testlock', to:'ps-unlockedtest', kind:'hard', label:'sets' },
            { from:'ps-unlockedtest', to:'ps-check2', kind:'soft', label:'thaws one' }
        ],
        stickies: [
            { x:100, y:30, aha:true, text:'Weakening the tests is <b>always a separate, deliberate act</b> — a nested [TEST-LOCK] inside the already-open plugin lock. The tests verify everything else, so they are guarded hardest.' }
        ],
        navHints: { left: 'the two closes', right: 'birth', down: 'TEST-LOCK — net inside the net' }
    },
    /* ---- Detail 5,1: TEST-LOCK — net inside the net ---- */
    '5,1': {
        kind: 'detail', step: 6,
        eyebrow: 'plugin substrate · detail',
        title: 'TEST-LOCK — the net inside the net',
        sub: 'What you\'re looking at: why test .sh files stay frozen even inside an unlocked plugin, and the nested ceremony that thaws exactly one.',
        boxes: [
            { id:'tn-default', x:100, y:140, w:230, h:95, tag:'gate', t:'tests frozen by default', s:'CHECK 2 — even inside unlock' },
            { id:'tn-handler', x:420, y:95, w:225, h:95, tag:'action', t:'TEST-LOCK handler', s:'plugin must already be unlocked' },
            { id:'tn-field', x:420, y:235, w:225, h:95, tag:'state', t:'unlocked_test', s:'one named .sh file' },
            { id:'tn-why', x:710, y:165, w:195, h:105, tag:'context', t:'why the extra gate', s:'a weakened test can\'t catch broken code' }
        ],
        edges: [
            { from:'tn-default', to:'tn-handler', kind:'hard', label:'released only via' },
            { from:'tn-handler', to:'tn-field', kind:'hard', label:'sets' },
            { from:'tn-field', to:'tn-default', kind:'soft', label:'thaws one .sh' },
            { from:'tn-handler', to:'tn-why', kind:'soft', label:'because' }
        ],
        stickies: [
            { x:100, y:30, aha:true, text:'The tests are the verifier of everything else — so they are guarded <b>harder than the code beneath them</b>. A `[TEST-LOCK]` is nested inside an already-open `[PLUGIN-LOCK]`, unlocking one named .sh file at a time.' }
        ],
        navHints: { up: 'safety net locked harder' }
    },
    /* ====================== Card 7: birth ====================== */
    '6,0': {
        kind: 'seq', step: 7,
        eyebrow: 'plugin substrate · step 7',
        title: 'Birth — a new cell from a 3-file floor',
        sub: 'What you\'re looking at: what happens when [PLUGIN-LOCK] targets a plugin that doesn’t exist yet — stamped from a template, history wired, baseline committed.',
        boxes: [
            { id:'ps-newtarget', x:60, y:175, w:185, h:115, tag:'action', t:'[PLUGIN-LOCK] new', s:'non-existent target' },
            { id:'ps-template', x:285, y:175, w:175, h:115, tag:'object', t:'stamp template', s:'sed placeholders' },
            { id:'ps-floor', x:495, y:95, w:200, h:90, tag:'object', t:'the 3-file floor', s:'CLAUDE / evolution / _historian' },
            { id:'ps-historian-gen', x:495, y:235, w:200, h:90, tag:'action', t:'historian generated', s:'into agents/, central' },
            { id:'ps-birthcommit', x:725, y:175, w:195, h:115, tag:'state', t:'birth commit', s:'= drift baseline' }
        ],
        edges: [
            { from:'ps-newtarget', to:'ps-template', kind:'hard', label:'fires' },
            { from:'ps-template', to:'ps-floor', kind:'hard', label:'stamps' },
            { from:'ps-template', to:'ps-historian-gen', kind:'hard', label:'generates' },
            { from:'ps-floor', to:'ps-birthcommit', kind:'soft', label:'commit' },
            { from:'ps-historian-gen', to:'ps-birthcommit', kind:'soft', label:'commit' }
        ],
        stickies: [
            { x:60, y:28, aha:true, text:'Birth stamps a <b>3-file floor</b>, not a full plugin — code is authored afterward. The birth commit gives drift-check a clean baseline; it does <b>NOT</b> touch <code>settings.local.json</code> — registration is the operator’s separate step.',
              ref: { url:'../07_9-creating-a-new-plugin.html', section:'Blog 7.9 · creating a new plugin', blurb:'07_9 walks the birth-to-maturity arc: floor → hooks → scripts+data.json → tests → agents.' } }
        ],
        navHints: { left: 'test protection', down: 'birth ceremony + anchor-bootstrap' }
    },
    /* ---- Detail 6,1: birth ceremony + anchor-bootstrap ---- */
    '6,1': {
        kind: 'detail', step: 7,
        eyebrow: 'plugin substrate · detail',
        title: 'The birth ceremony + anchor-bootstrap',
        sub: 'What you\'re looking at: what birth does and does NOT do — template stamp, historian generation, baseline commit — and the anchor-bootstrap net that heals any CLAUDE.md missing its footer anchors.',
        boxes: [
            { id:'bc-stamp', x:80, y:135, w:205, h:90, tag:'action', t:'stamp the template', s:'copy + sed placeholders' },
            { id:'bc-hist', x:80, y:270, w:205, h:90, tag:'action', t:'generate historian', s:'centrally into plugin_integrity/agents/' },
            { id:'bc-noreg', x:350, y:135, w:230, h:90, tag:'state', t:'does NOT touch settings.local.json', s:'registration is an operator step' },
            { id:'bc-commit', x:350, y:270, w:230, h:90, tag:'state', t:'birth commit', s:'= drift baseline' },
            { id:'bc-anchor', x:655, y:190, w:240, h:105, tag:'gate', t:'anchor-bootstrap net', s:'inserts missing anchors at canonical position' }
        ],
        edges: [
            { from:'bc-stamp', to:'bc-noreg', kind:'soft', label:'but' },
            { from:'bc-stamp', to:'bc-hist', kind:'hard', label:'then' },
            { from:'bc-hist', to:'bc-commit', kind:'hard', label:'auto-commit' },
            { from:'bc-stamp', to:'bc-anchor', kind:'soft', label:'guarded by' }
        ],
        stickies: [
            { x:80, y:30, aha:true, text:'Birth stamps a <b>3-file floor</b> + commits the baseline — but <b>does NOT register hooks</b> in <code>settings.local.json</code> (an operator step, by design). The anchor-bootstrap net catches any CLAUDE.md that comes out of birth without its four footer anchors and heals it in order.' }
        ],
        navHints: { up: 'birth from 3-file floor' }
    }
};
