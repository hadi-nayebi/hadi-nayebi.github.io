/* ============================================================================
 * voice-surface.cards.js — CONTENT for the "Voice Surface" deck.
 * Teaches: voice.xml is the plugin layer's soft-memory organ — where every
 * context-injection item is defined, split across two files by fire-site
 * (hooks/ agent-facing, scripts/ operator-facing), rendered by the get_voice
 * primitive, selected for coaching by a budget-tiered rotation pool, guarded
 * by the no-orphan invariant + catalog tooling, and tunable per-job by Stage-3
 * yaml injection (append / replace / prepend on EXISTING callable voices).
 * Paired with the shared deck-engine.js + deck-engine.css. Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · arm/function/section), never line
 * numbers, per the glossary term-anatomy rule (Rule 20). Sources:
 *   lib/voice-helper/voice-helper.sh (get_voice: sed fast-path / awk fallback,
 *     {{var}} substitution, YAML_INJECTION_CACHE resolution, append|replace|prepend
 *     case dispatch, no-op-when-VOICE_XML-unset),
 *   phase_observe/hooks/observe-tracker.sh (COACHING_IDS rotation pool, budget-tier
 *     coaching block), phase_verify/hooks/verify-tracker.sh + phase_execute/hooks/
 *     execute-tracker.sh (COACHING_IDS arrays), phase_observe/config.conf
 *     (BUDGET_TOTAL=100, BUDGET_WORK_POOL=60, BUDGET_QUALITY_POOL=20),
 *   lib/yaml-cognition/build-voice-catalog.py (rglob both voice.xml, callable /
 *     orphan_ids / missing classification, --audit/--list-callable/-orphans/-missing),
 *   lib/yaml-cognition/validate-yaml-voice-ids.py (callable-set contract, Levenshtein
 *     "did you mean" ≤3), phasic_system/hooks/phase-init.sh (write_yaml_cache, empty
 *     force-clear), plugin_integrity/scripts/health-check.sh (Check 3 COACHING_IDS sync),
 *   + .claude/context/plugins-voices.md (design ground truth, [consolidated]).
 * ============================================================================ */
window.DECK_META = { page: 'voice-surface', seqLabel: 'the soft memory the seed can tune' };

window.DECK_INFO = {
    /* ---- Card 1: the soft-memory organ ---- */
    'vx-organ': {
        title: 'voice.xml — the soft-memory organ', tag: 'object',
        what: 'Where every message a plugin can inject is defined. An open, growing surface, not a fixed schema: each message carries a voice id, and a yaml plan can later overwrite or modify it.',
        why: 'Voices are the plugin layer’s memory of HOW to coach and refuse — the cheapest customization surface, tuned without touching code. The mechanism is injection + friction, not a sandbox.',
        hood: 'Root element <code>&lt;voice plugin="…" component="hooks|scripts"&gt;</code>; each message has an <code>id</code> and optional <code>vars="a,b"</code> driving <code>{{a}}</code> substitution. Soft (<code>coaching</code>/<code>info</code>/<code>warning</code>/<code>entry</code>) and hard (<code>block</code>/<code>error</code>) voices coexist in one file. Source: <code>plugins-voices.md</code> · "voice.xml".'
    },
    'vx-voiceid': {
        title: 'every item carries a voice id', tag: 'state',
        what: 'The handle a hook fires by, an audit checks for, and a yaml plan targets. No id, no way to inject, audit, or tune the message.',
        why: 'The id is the contract surface across the whole voice system — get_voice looks it up, the orphan audit verifies it has a callsite, and Stage-3 yaml pairs to it by literal match.',
        hood: 'Message text carries a <code>[plugin_id]</code> prefix; hard refusals add a <code>BLOCKED:</code> / <code>CRITICAL BLOCK:</code> keyword. The id is interpolated directly into the extraction pattern, so voice text may contain no literal <code>&lt;</code>/<code>&gt;</code>. Source: <code>plugins-voices.md</code> · "voice.xml".'
    },
    'vx-soft': {
        title: 'soft voices nudge', tag: 'object',
        what: 'Coaching, info, warning, and entry voices. They inject as additionalContext and the model may absorb or ignore them — guidance, never a refusal.',
        why: 'Soft is the cheap default: a phase coaches toward better behavior without ever failing a tool call. The soft/hard split is at the ELEMENT level, not the file level.',
        hood: 'Fired into context via <code>additionalContext</code>. <code>&lt;entry&gt;</code> is multi-paragraph phase-entry priming (fires on phase entry + backward transitions). Source: <code>plugins-voices.md</code> · "voice.xml" element table.'
    },
    'vx-hard': {
        title: 'hard voices refuse', tag: 'gate',
        what: 'Block and error voices. They fire as a deterministic exit-2 stderr refusal that fails the agent’s tool call — the enforcement end of the same file.',
        why: 'A hard voice is the teeth behind a gate. The same file holds both the nudge and the refusal; the ELEMENT TYPE, not the file, decides which fires.',
        hood: 'Every <code>&lt;block&gt;</code>/<code>&lt;error&gt;</code> must teach three things (the 3-part rubric): WHY it fired, WHAT TO DO, and the EXPECTED STATE on retry. A block that only says "denied" is non-actionable. Source: <code>plugins-voices.md</code> · "3-part teach rubric".'
    },
    'vx-cheap': {
        title: 'the cheapest learning surface', tag: 'action',
        what: 'CONDENSE re-words a voice without a lock ceremony — voice.xml, agent defs, and CLAUDE.md docs are exempt from the code-surface edit gates.',
        why: 'Re-wording a gate’s block message is routine meta-cognition, not privileged plugin work. Hardening a soft voice INTO a new hard gate is the expensive direction, governed by the over-engineering veto.',
        hood: 'CONDENSE tunes voices via the <code>[VOICE-UPDATE]</code> marker (step 4). The exemption lives in <code>plugin_integrity/hooks/plugin-guard.sh</code> · "DOCUMENTATION + VOICE + AGENTS ALWAYS FREE". Source: <code>plugins-voices.md</code> · "The cheapest learning surface".'
    },
    /* ---- Detail 0,1: the six element types + teach rubric ---- */
    'vx-coaching': {
        title: 'coaching — probabilistic', tag: 'object',
        what: 'A soft guidance voice selected from a rotation pool after a question, then absorbed or ignored by the model. The only element type that fires by chance.',
        why: 'Coaching is how a phase steers behavior without commanding it — a gentle, deniable nudge that varies turn to turn so it never reads as a script.',
        hood: 'A <code>&lt;coaching&gt;</code> voice fires only if its id is in the phase’s <code>COACHING_IDS</code> rotation pool (the no-orphan rule). Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    'vx-info': {
        title: 'info / warning — status', tag: 'object',
        what: 'Soft acknowledgment or caution voices. Info confirms a state with no block; warning cautions without refusing.',
        why: 'These carry status the agent benefits from seeing but never need to halt on — the lightest touch on the surface.',
        hood: 'Both soft. <code>&lt;warning&gt;</code> is near-vestigial today — the element set describes current forms and can expand as new injection kinds earn a place. Source: <code>plugins-voices.md</code> · "voice.xml".'
    },
    'vx-entry': {
        title: 'entry — phase priming', tag: 'object',
        what: 'Multi-paragraph teaching fired on phase entry and backward transitions. It orients the agent to the phase it just entered — no block.',
        why: 'Entry voices are how a phase introduces its own discipline: the operational subagents on the way in, the metacognitive reflectors on the way out.',
        hood: 'Priming kind — longer than a one-line nudge, fired at the phase boundary. Source: <code>plugins-voices.md</code> · "voice.xml" element table.'
    },
    'vx-block': {
        title: 'block / error — the refusal', tag: 'gate',
        what: 'The two hard element types. Block is a deterministic refusal; error is the critical tier. Both fail the tool call.',
        why: 'These are deterministic by construction — a gate cannot be probabilistic. They are the only element types that change what the agent is allowed to do.',
        hood: 'Both render an <code>exit 2</code> stderr refusal. <code>&lt;error&gt;</code> is the critical tier (e.g. brain_guard’s context-tier blocks). Source: <code>plugins-voices.md</code> · "voice.xml".'
    },
    'vx-rubric': {
        title: 'the 3-part teach rubric', tag: 'gate',
        what: 'Every hard voice must teach WHY it fired, WHAT TO DO, and the EXPECTED STATE on retry. A refusal that only says "denied" is non-actionable.',
        why: 'The rubric makes refusals teach instead of just block — it is what keeps the hard layer from feeling like an arbitrary wall. It is pinned mechanically by a test.',
        hood: 'Pinned by <code>plugin_integrity/tests/test-injection-maturity.sh</code> · V8: each block/error must carry ≥1 keyword from each of the WHY / WHAT-TO-DO / STATE columns. Source: <code>plugins-voices.md</code> · "V8 3-part teach rubric".'
    },
    /* ---- Card 2: dual voice.xml ---- */
    'df-hooks': {
        title: 'hooks/voice.xml — agent-facing', tag: 'object',
        what: 'The voices the agent experiences. Fired in PreToolUse, PostToolUse, and SessionStart hook contexts and injected into the model’s context.',
        why: 'This is the surface that shapes the agent’s behavior — coaching it absorbs, blocks it hits. Every rotation pool draws only from here.',
        hood: 'Coaching injects via <code>additionalContext</code>, blocks via <code>exit 2</code> stderr. 11 of the 11 active plugins carry <code>hooks/voice.xml</code>. Source: <code>plugins-voices.md</code> · "Dual voice.xml".'
    },
    'df-scripts': {
        title: 'scripts/voice.xml — operator-facing', tag: 'object',
        what: 'Status lines a plugin’s CLI prints to the human operator’s terminal. Never injected into the model’s context.',
        why: 'These talk to the person running a command, not the agent reasoning in a phase — a different audience, so a different file.',
        hood: 'Printed to the operator’s stderr. 10 of 11 plugins carry it; <code>question_discipline</code> is hooks-only (pure agent-side enforcement, no operator CLI). Source: <code>plugins-voices.md</code> · "Dual voice.xml".'
    },
    'df-firesite': {
        title: 'split by fire-site, not topic', tag: 'context',
        what: 'The two files divide by WHERE a voice fires — agent-context versus operator-terminal — not by subject matter. Both are voice strings; the difference is audience.',
        why: 'Naming the axis correctly prevents the wrong mental model: it is not "hooks = code, scripts = config." Both hold voices; one reaches the agent, one reaches the human.',
        hood: 'The split is by lifecycle origin. <code>scripts/voice.xml</code> also carries <code>coaching</code> elements (job_core setup nudges, checkpoint-recall coaches) firing at FIXED deterministic callsites, not via a pool. Source: <code>plugins-voices.md</code> · "Dual voice.xml".'
    },
    'df-audit': {
        title: 'the orphan audit greps BOTH', tag: 'gate',
        what: 'Any tool checking voice ids must sweep both files. Auditing only one false-positives every id that lives in the other.',
        why: 'The dual-file split is exactly why the catalog walks every subdirectory — a one-file audit would call half the corpus orphaned.',
        hood: 'The catalog sweeps via <code>plugins_root.rglob("voice.xml")</code>, hitting both <code>hooks/</code> and <code>scripts/</code> under every plugin. Source: <code>plugins-voices.md</code> · "Dual voice.xml" → orphan audit.'
    },
    /* ---- Card 3: get_voice ---- */
    'gv-helper': {
        title: 'get_voice — lookup + substitute', tag: 'action',
        what: 'The shared primitive every hook and script sources to render one voice message by id. The caller sets the voice file path, then calls it with the id and optional variables.',
        why: 'One primitive renders the whole surface, so every plugin gets identical extraction, substitution, and fail-safe behavior for free.',
        hood: 'Signature <code>get_voice &lt;id&gt; [var=value …]</code>; caller sets <code>VOICE_XML</code> before sourcing. Lives in the shared lock-exempt <code>lib/</code> tier: <code>plugins/lib/voice-helper/voice-helper.sh</code>. Source: <code>plugins-voices.md</code> · "voice-helper (get_voice)".'
    },
    'gv-extract': {
        title: 'two-tier extraction, no xmllint', tag: 'action',
        what: 'A fast path pulls single-line voices; a fallback handles multi-line ones. The file is never parsed as XML — it is text-extracted by id.',
        why: 'Skipping a real XML parser keeps the helper dependency-free and fast, at the cost of one rule: voice text may contain no literal angle brackets.',
        hood: 'A <code>sed</code> fast-path for single-line voices, an <code>awk</code> state-machine fallback for multi-line. The <code>$id</code> is interpolated into the pattern, so no regex metacharacters in ids. Source: <code>plugins-voices.md</code> · "voice-helper" mechanics.'
    },
    'gv-subst': {
        title: '{{var}} live-number substitution', tag: 'action',
        what: 'Placeholders in the voice text are replaced with values the caller passes, so a block can show the actual deficit instead of a generic complaint.',
        why: 'Voices teach with live numbers — a gate message reading "need 100, have 60" is actionable in a way "do more" never is.',
        hood: 'Bash string replacement (<code>${text//\\{\\{$key\\}\\}/$val}</code>), not sed/awk, with <code>&amp;</code> and <code>\\</code> pre-escaped. The same <code>KV_ARGS</code> apply to the base text AND any yaml augmentation. Source: <code>plugins-voices.md</code> · "voice-helper" → substitution.'
    },
    'gv-failsafe': {
        title: 'silent-failure resilient', tag: 'gate',
        what: 'A missing id or missing voice file yields the empty string, never a crash. Every guard then falls back to a hardcoded literal, so refusals still fire.',
        why: 'This resilience is what lets the fail-safe-allow hook contract hold: a voice-system failure can never crash a guard or leave the agent undefined.',
        hood: '<code>get_voice</code> always returns exit 0; if <code>VOICE_XML</code> is unset it is defined as a no-op returning "". Callers use <code>msg=$(get_voice id) || true</code> then a literal fallback — which tests still grep. Source: <code>plugins-voices.md</code> · "voice-helper" resilience.'
    },
    /* ---- Card 4: coaching rotation ---- */
    'cr-pool': {
        title: 'COACHING_IDS — the rotation pool', tag: 'state',
        what: 'A hardcoded array in each phase tracker listing which coaching voices that phase may select among. It is the sole source of truth for fireable coaching.',
        why: 'A coaching voice not listed here can never be selected — it is an orphan. The array, not the element, decides what actually rotates.',
        hood: 'Trackers live in <code>hooks/</code>: <code>phase_observe/hooks/observe-tracker.sh</code>, <code>verify-tracker.sh</code>, <code>execute-tracker.sh</code> each hold a <code>COACHING_IDS</code> array. Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    'cr-waiting': {
        title: 'fires after a question', tag: 'action',
        what: 'Coaching is selected when the agent asks a waiting question — not on every tool call. The rotation only turns at those moments.',
        why: 'Tying coaching to question-points means it lands when the agent is pausing to think, the moment a nudge is most likely to be read.',
        hood: 'Selection runs in the tracker’s coaching-tier block, keyed off the <code>[WAITING]</code> question event. Source: <code>plugins-voices.md</code> · "Coaching rotation" → selection.'
    },
    'cr-tier': {
        title: 'budget-tiered, then random', tag: 'gate',
        what: 'The tracker computes how much budget remains, picks a pool by tier, then picks one voice at random from it. As a phase fills, its coaching drifts from investigate to synthesize to finish.',
        why: 'The tier makes coaching phase-aware: early it pushes investigation, late it pushes wrapping up — the nudge tracks where the phase is in its arc.',
        hood: 'remaining > <code>BUDGET_WORK_POOL</code> (60) → work pool; > <code>BUDGET_QUALITY_POOL</code> (20) → quality pool; ≤ 20 → finishing pool. <code>BUDGET_TOTAL=100</code>. Config: <code>phase_observe/config.conf</code>. Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    'cr-random': {
        title: 'RANDOM, not a counter', tag: 'action',
        what: 'Within the chosen tier, one voice is picked at random. It is not a sequential modulo counter stepping through the list in order.',
        why: 'Randomness keeps coaching from feeling scripted — the same situation can draw different nudges, so the agent never pattern-matches a fixed sequence.',
        hood: 'Selection is <code>idx=$(( RANDOM % ${#POOL[@]} ))</code> within a budget tier — never a <code>% N</code> sequential counter. Source: <code>plugins-voices.md</code> · "Coaching rotation" → Avoid "modulo rotation".'
    },
    /* ---- Detail 3,1: rotation pipeline + plugin_integrity ---- */
    'cr-truth': {
        title: 'the array is the source of truth', tag: 'state',
        what: 'A coaching voice fires only if it is in COACHING_IDS. The element existing in voice.xml is not enough — it must also be registered in the array.',
        why: 'Two places must agree for one voice to fire. That double-entry is the lockstep hazard the next box names.',
        hood: 'A <code>&lt;coaching&gt;</code> voice absent from <code>COACHING_IDS</code> can never be selected — the orphan-via-(b) case. Source: <code>plugins-voices.md</code> · "Orphan voice".'
    },
    'cr-lockstep': {
        title: 'the lockstep hazard', tag: 'gate',
        what: 'Adding a coaching voice means editing BOTH voice.xml AND the COACHING_IDS array (and the tier pool). Drift between them is silent.',
        why: 'Nothing forces the two edits to happen together, so a half-done addition simply never fires — the classic dead-code trap the catalog exists to catch.',
        hood: 'The only backstop is <code>plugin_integrity/scripts/health-check.sh</code> · Check 3: every <code>COACHING_IDS</code> entry must exist in voice.xml (it does NOT verify the reverse). Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    'cr-pi': {
        title: 'plugin_integrity: no pool, real coaching', tag: 'context',
        what: 'The foundational protection plugin carries NO rotation array — yet it still has coaching voices. They fire deterministically at fixed callsites, not by chance.',
        why: 'A protection layer wants deterministic voices, so it skips the random pool. This is the distinction that resolves the apparent "plugin_integrity has no coaching" puzzle: no POOL, but real coaching ELEMENTS.',
        hood: 'No <code>COACHING_IDS</code> array, but 4 <code>&lt;coaching&gt;</code> elements (<code>objective-alignment</code>, <code>evolution-follow-references</code>, <code>commit-before-outside</code>, <code>test-scope-alignment</code>) fire at the <code>[PLUGIN-LOCK]</code> unlock briefing. Rotation is just ONE way to use the files. Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    'cr-healthcheck': {
        title: 'one-directional backstop', tag: 'gate',
        what: 'The health check catches a registered id with no matching voice, but not a voice.xml coaching id missing from the array. The reverse drift stays silent.',
        why: 'Knowing the backstop is one-directional tells an author where the real risk is: adding a coaching voice and forgetting the array is the failure no check catches.',
        hood: '<code>health-check.sh</code> Check 3 verifies <code>COACHING_IDS</code> → voice.xml, not voice.xml → <code>COACHING_IDS</code>. The full reverse sweep is the catalog’s job. Source: <code>plugins-voices.md</code> · "Coaching rotation".'
    },
    /* ---- Card 5: orphan voice ---- */
    'ov-orphan': {
        title: 'an orphan voice', tag: 'state',
        what: 'A voice id defined in voice.xml but fired by no hook or script. It never injects — dead code that looks alive.',
        why: 'An orphan is worse than unused: it is a silent trap. A yaml author can target it and watch nothing happen, with no error to explain why.',
        hood: 'Computed as <code>orphan_ids = sorted(defined_set - callable_set)</code> in <code>build-voice-catalog.py</code>. Source: <code>plugins-voices.md</code> · "Orphan voice".'
    },
    'ov-silent': {
        title: 'the silent no-op trap', tag: 'context',
        what: 'Targeting an orphan produces no error and no injection — just silence. The danger is the quietness, not mere disuse.',
        why: 'Silent failures are the hardest to debug, so the project treats an orphan as a defect to remove, not a harmless leftover.',
        hood: 'A Stage-3 yaml author can pair a plan key to an orphan id and the augmentation never fires. The yaml validator exists to prevent exactly this. Source: <code>plugins-voices.md</code> · "Orphan voice".'
    },
    'ov-invariant': {
        title: 'every id has a callsite, or goes', tag: 'gate',
        what: 'The orphan invariant: every defined voice id must be referenced by some hook or script, or be removed. No defined-but-dead voices.',
        why: 'The invariant keeps the surface honest — what is defined is what can fire, so the file never accumulates phantom capability.',
        hood: 'Enforced by <code>plugin_integrity/scripts/health-check.sh</code> · <code>check_orphaned_voices()</code> and the structural test <code>test-voice-orphan-audit.sh</code>. Source: <code>plugins-voices.md</code> · "Orphan voice".'
    },
    'ov-twoways': {
        title: 'two ways to orphan a voice', tag: 'object',
        what: 'Either add a voice to voice.xml and never reference it, or add a coaching voice and forget to list it in COACHING_IDS. Both leave a defined voice that cannot fire.',
        why: 'Naming both paths tells an author the two edits that must each be completed — the reference AND, for coaching, the array entry.',
        hood: '(a) defined but never referenced — caught by the catalog. (b) <code>&lt;coaching&gt;</code> not appended to <code>COACHING_IDS</code> — caught (one-way) by health-check Check 3. CONDENSE may only ADD an id inside a gmode fix that also wires its callsite. Source: <code>plugins-voices.md</code> · "Orphan voice".'
    },
    /* ---- Card 6: voice catalog + audit ---- */
    'vc-catalog': {
        title: 'build-voice-catalog.py', tag: 'action',
        what: 'The tool that scans every voice.xml for defined ids and every plugin source for references, then classifies each id. It is computed fresh on each run, not a stored registry.',
        why: 'A computed catalog can never go stale against the files — it reflects exactly what is defined and referenced right now.',
        hood: 'Scans via <code>plugins_root.rglob("voice.xml")</code> (both files) and <code>rglob("*")</code> for quoted references. Modes: <code>--audit</code>, <code>--list-callable</code>, <code>--list-orphans</code>, <code>--list-missing</code>. Lives in <code>lib/yaml-cognition/</code>. Source: <code>plugins-voices.md</code> · "Voice catalog and orphan audit".'
    },
    'vc-callable': {
        title: 'callable = defined ∩ referenced', tag: 'state',
        what: 'An id that is both defined in a voice.xml and quoted as a reference in some non-test source. The set of voices that actually fire.',
        why: 'Callable is the contract surface — the one set a yaml plan is allowed to target, because only callable voices carry real injected cognition.',
        hood: '<code>callable = defined_set ∩ referenced</code>; <code>--list-callable</code> emits it. An id is callable if it appears as a quoted string in any comment-stripped, non-test source. Source: <code>plugins-voices.md</code> · "Voice catalog" → callable.'
    },
    'vc-orphanmissing': {
        title: 'orphan vs missing', tag: 'state',
        what: 'Orphan = defined but never referenced. Missing = referenced via get_voice but never defined. The two failure directions the catalog separates.',
        why: 'They need different fixes: an orphan is dead weight to remove or wire; a missing id is a callsite pointing at nothing, which renders empty at runtime.',
        hood: '<code>orphan_ids = defined_set - callable_set</code>; missing = referenced but undefined. Surfaced by <code>--list-orphans</code> / <code>--list-missing</code>. Source: <code>plugins-voices.md</code> · "Voice catalog and orphan audit".'
    },
    'vc-yamlvalidator': {
        title: 'the yaml validator gate', tag: 'gate',
        what: 'At plan validation, every per-phase key in a yaml plan must match a callable voice id, or the plan is rejected with a "did you mean" suggestion.',
        why: 'The catalog IS the contract: a yaml author can only target voices that actually fire, so a typo or an orphan is caught before the job ever runs.',
        hood: '<code>validate-yaml-voice-ids.py</code> checks each key against the <code>--list-callable</code> set; a non-callable key is rejected with the closest callable ids by Levenshtein distance (≤3 edits). Source: <code>plugins-voices.md</code> · "Voice catalog and orphan audit".'
    },
    /* ---- Card 7: Stage-3 yaml injection ---- */
    'yi-keys': {
        title: 'yaml keys ARE voice ids', tag: 'object',
        what: 'In a Stage-3 yaml plan, the per-phase keys are voice ids directly — no transform, no naming convention. A plan pairs to a voice by literal id match.',
        why: 'This is the cleanest possible coupling: a plan customizes existing voices by name, and the plugins never need to know plans exist.',
        hood: 'A key must be a callable id (enforced by the yaml validator). The Stage-3 <code>.yaml</code> is the per-job customization layer for the voice surface. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection".'
    },
    'yi-dispatch': {
        title: 'append / replace / prepend', tag: 'action',
        what: 'After rendering the base voice, get_voice reads the yaml value and augments by its shape: a bare string appends, a mode object replaces or prepends.',
        why: 'Three modes cover the real needs — add to a voice, swap it wholesale, or banner it — all without the plugin author writing any per-job branches.',
        hood: 'The <code>case "$yaml_mode" in</code> dispatch in <code>voice-helper.sh</code>: bare string → <code>append|*)</code>; <code>{mode: replace, text}</code> → <code>replace)</code>; <code>{mode: prepend, text}</code> → <code>prepend)</code>; unknown → append. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection".'
    },
    'yi-cache': {
        title: 'yaml-injection-cache.json', tag: 'state',
        what: 'The cross-process cache mapping voice id to a yaml value. The producer/consumer contract between the hooks that write it and get_voice that reads it.',
        why: 'A file-backed cache lets a hook compute the per-phase injection once on transition, and every later voice render couple to it without re-parsing the plan.',
        hood: 'Lives at <code>.claude/.tmp/yaml-injection-cache.json</code> (env-overridable via <code>YAML_INJECTION_CACHE</code>). Refreshed race-safely by <code>plan_sensor.sh</code> on entry. Source: <code>plugins-voices.md</code> · "yaml-injection-cache.json".'
    },
    'yi-existing': {
        title: 'modifies existing voices only', tag: 'gate',
        what: 'Yaml augments callable voices that already fire — it can never mint a new fireable voice. Minting one still requires wiring a callsite.',
        why: 'This is the safety boundary of the soft per-job layer: a plan tunes how a voice reads for one job, but cannot invent capability or create an orphan.',
        hood: 'It can only MODIFY callable ids; a new voice still needs a wired callsite (see orphan voice). "yaml defines voices" is banned framing — it AUGMENTS. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection".'
    },
    /* ---- Detail 6,1: the yaml pipeline ---- */
    'yi-parse': {
        title: 'parse-yaml-fields.py', tag: 'action',
        what: 'Produces a flat id-to-value map for the current cycle and phase from the yaml plan. The first step of the read-cache-augment pipeline.',
        why: 'Flattening the plan to a simple map is what lets a shell hook write the cache and get_voice read it with no yaml knowledge of its own.',
        hood: 'Invoked via <code>phase.sh --hook read-yaml</code>; accepts the wrapper <code>cycles[n].phases.&lt;phase&gt;</code> and legacy <code>cycles[n].&lt;phase&gt;</code> shapes (wrapper wins). Source: <code>plugins-voices.md</code> · Catalog → parse-yaml-fields.'
    },
    'yi-write': {
        title: 'write_yaml_cache()', tag: 'action',
        what: 'The hook writer that persists the field map to the cache on each phase transition — or writes an empty object to clear it.',
        why: 'Writing on transition is what makes plan-objective injection a reflex of job activation, not a step the agent must remember.',
        hood: '<code>phasic_system/hooks/phase-init.sh</code> · <code>write_yaml_cache()</code> calls <code>phase.sh --hook read-yaml</code> then persists the map; an <code>empty</code> arg force-clears (gmode side-quest). Source: <code>plugins-voices.md</code> · "write_yaml_cache()".'
    },
    'yi-augment': {
        title: 'get_voice augments at fire-time', tag: 'action',
        what: 'When a voice renders, get_voice reads the cache and augments the matching id by value shape. The agent sees the tuned voice, never the wiring.',
        why: 'Coupling at fire-time means the same base voice reads differently for one job, controlled phase-by-phase, with no plugin edit and no lock.',
        hood: 'The same <code>KV_ARGS</code> substitute <code>{{var}}</code> placeholders in the yaml text as in the host voice, so a yaml author can reference the voice’s runtime variables. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection" → pipeline.'
    },
    'yi-gmode': {
        title: 'cleared on gmode entry', tag: 'context',
        what: 'Entering gmode empties the cache, so a side-quest never inherits the job’s yaml injections. The job’s voices return when gmode exits.',
        why: 'A gmode side-quest is its own context; leaking the job’s per-phase injections into it would mis-coach work that has nothing to do with the plan.',
        hood: 'The gmode-on arm calls <code>write_yaml_cache "$target_id" empty</code>; <code>gmode-return-hook.sh</code> re-injects on <code>exit-gmode</code>. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection" → pipeline.'
    },
    'yi-validate': {
        title: 'validated at the EXECUTE write', tag: 'gate',
        what: 'The yaml voice-id validators are owned by the plan plugin but fire when the yaml plan file is WRITTEN in cycle-1 EXECUTE — not during PLAN.',
        why: 'The plan file does not exist yet during PLAN, so validation rides the EXECUTE write event instead. "Validated at PLAN time" is the imprecise framing this corrects.',
        hood: '<code>execute-guard.sh</code> invokes the plan-owned <code>validate-yaml-voice-ids.py</code> on the Write event; during PLAN <code>plan-guard.sh</code> BLOCKS any plan-file yaml write. A semantic <code>plan-yaml-validator</code> subagent reviews mode/surface choices. Source: <code>plugins-voices.md</code> · "Stage-3 yaml voice injection".'
    }
};

window.DECK_CARDS = {
    /* ====================== Card 1: the soft-memory organ ====================== */
    '0,0': {
        kind: 'seq', step: 1,
        eyebrow: 'voice surface · step 1',
        title: 'voice.xml — the plugin’s soft memory',
        sub: 'What you’re looking at: where every message a plugin can inject lives — one open, growing file, with soft nudges and hard refusals side by side.',
        boxes: [
            { id:'vx-organ', x:70, y:155, w:230, h:140, tag:'object', t:'voice.xml', s:'the soft-memory organ' },
            { id:'vx-voiceid', x:370, y:60, w:200, h:90, tag:'state', t:'each item', s:'carries a voice id' },
            { id:'vx-soft', x:370, y:185, w:200, h:90, tag:'object', t:'soft voices', s:'nudge — may ignore' },
            { id:'vx-hard', x:370, y:310, w:200, h:90, tag:'gate', t:'hard voices', s:'refuse — exit 2' },
            { id:'vx-cheap', x:660, y:185, w:250, h:120, tag:'action', t:'cheapest surface', s:'CONDENSE tunes, no lock' }
        ],
        edges: [
            { from:'vx-organ', to:'vx-voiceid', kind:'hard', label:'every item' },
            { from:'vx-organ', to:'vx-soft', kind:'soft', label:'nudges' },
            { from:'vx-organ', to:'vx-hard', kind:'hard', label:'refuses' },
            { from:'vx-soft', to:'vx-cheap', kind:'soft', label:'re-worded freely' }
        ],
        stickies: [
            { x:70, y:24, aha:true, text:'voice.xml is the <b>soft-memory organ</b> of the plugin layer — the cheapest place to customize the seed. <b>Soft and hard voices coexist in one file</b>; the element type, not the file, decides whether a fired voice nudges or refuses.',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · the dual voice architecture', blurb:'07_3 introduces the voice surface and the two files it splits across. This deck draws the whole surface — elements, the get_voice primitive, coaching rotation, the orphan audit, and Stage-3 yaml injection.' } },
            { x:660, y:360, text:'voice.xml is one organ inside the plugin.',
              ref: { kind: 'deck', url: 'plugin-substrate.html', section: 'Inside a Plugin', blurb: 'Where voice.xml sits among the plugin\'s organs.' } }
        ],
        navHints: { right: 'the two files', down: 'the six element types' }
    },
    /* ---- Detail 0,1: the six element types + teach rubric ---- */
    '0,1': {
        kind: 'detail', step: 1,
        eyebrow: 'voice surface · detail',
        title: 'Six element types — soft and hard',
        sub: 'How one file holds both a nudge and a refusal: the element TYPE classifies each voice, and every hard voice must teach three things.',
        boxes: [
            { id:'vx-coaching', x:70, y:135, w:195, h:95, tag:'object', t:'coaching', s:'soft · probabilistic' },
            { id:'vx-info', x:285, y:135, w:195, h:95, tag:'object', t:'info / warning', s:'soft · status' },
            { id:'vx-entry', x:500, y:135, w:195, h:95, tag:'object', t:'entry', s:'soft · phase priming' },
            { id:'vx-block', x:715, y:135, w:195, h:95, tag:'gate', t:'block / error', s:'hard · exit 2' },
            { id:'vx-rubric', x:355, y:320, w:270, h:100, tag:'gate', t:'3-part teach rubric', s:'WHY · WHAT · STATE' }
        ],
        edges: [
            { from:'vx-block', to:'vx-rubric', kind:'hard', label:'must teach' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'The <b>soft/hard split is at the element level</b> — coaching/info/warning/entry nudge, block/error refuse. Every hard voice must teach <b>WHY it fired, WHAT to do, and the EXPECTED STATE</b> on retry, pinned by a test.' },
            { x:500, y:450, text:'Soft voices harden into hooks up the cost ladder.',
              ref: { kind: 'deck', url: '../../b8/explore/apprentice-architect.html', section: 'Apprentice to Architect', blurb: 'The maturation arc and the soft→hard cost ladder.' } }
        ],
        navHints: { up: 'back to the organ' }
    },
    /* ====================== Card 2: dual voice.xml ====================== */
    '1,0': {
        kind: 'seq', step: 2,
        eyebrow: 'voice surface · step 2',
        title: 'Two files, split by who hears them',
        sub: 'What you’re looking at: every plugin carries two voice.xml files — one the agent experiences, one the operator reads — divided by fire-site, not topic.',
        boxes: [
            { id:'df-hooks', x:70, y:150, w:235, h:120, tag:'object', t:'hooks/voice.xml', s:'agent-facing · injected' },
            { id:'df-scripts', x:70, y:300, w:235, h:110, tag:'object', t:'scripts/voice.xml', s:'operator-facing · terminal' },
            { id:'df-firesite', x:395, y:215, w:230, h:120, tag:'context', t:'split by fire-site', s:'audience, not topic' },
            { id:'df-audit', x:710, y:215, w:210, h:120, tag:'gate', t:'orphan audit', s:'must grep BOTH' }
        ],
        edges: [
            { from:'df-hooks', to:'df-firesite', kind:'soft', label:'where it fires' },
            { from:'df-scripts', to:'df-firesite', kind:'soft', label:'where it fires' },
            { from:'df-firesite', to:'df-audit', kind:'hard', label:'so audit both' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'The split is <b>by fire-site</b>: <b>hooks/</b> reaches the agent’s context, <b>scripts/</b> reaches the operator’s terminal. 11 plugins carry hooks/, 10 carry scripts/ (question_discipline is hooks-only) — so any voice audit must sweep BOTH files.',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · why the split matters', blurb:'07_3 walks the hooks/ vs scripts/ split and why the audience boundary, not the topic, defines the two files.' } }
        ],
        navHints: { left: 'the organ', right: 'how a voice renders', down: 'fire-site split + exception' }
    },
    /* ---- Detail 1,1: dual voice.xml fire-site split ---- */
    '1,1': {
        kind: 'detail',
        eyebrow: 'voice surface · dual-file detail',
        title: 'Dual voice.xml — fire-site, not topic',
        sub: 'What you\'re looking at: why every plugin carries two voice.xml files, which one is the exception, and why any voice audit must grep both.',
        boxes: [
            { id:'dv-hooks', x:70, y:100, w:250, h:100, tag:'object', t:'hooks/voice.xml', s:'agent-facing — injected into LLM context' },
            { id:'dv-scripts', x:70, y:260, w:250, h:100, tag:'object', t:'scripts/voice.xml', s:'operator-facing — printed to terminal, never injected' },
            { id:'dv-grep', x:440, y:160, w:300, h:100, tag:'gate', t:'orphan audit greps BOTH', s:'10 of 11 plugins carry both' },
            { id:'dv-exc', x:740, y:285, w:175, h:90, tag:'state', t:'question_discipline', s:'hooks-only exception' }
        ],
        edges: [
            { from:'dv-hooks', to:'dv-grep', kind:'soft', label:'audited' },
            { from:'dv-scripts', to:'dv-grep', kind:'soft', label:'audited' },
            { from:'dv-scripts', to:'dv-exc', kind:'soft', label:'except' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'Split by <b>FIRE-SITE</b> (where it fires), not by topic — <b>hooks/</b> injects into the agent\'s context; <b>scripts/</b> prints to the operator\'s terminal. The orphan audit must grep <b>both</b> files. <b>question_discipline</b> is the one hooks-only exception: pure agent-side enforcement, no operator CLI.' }
        ],
        navHints: { up: 'back to the two files' }
    },
    /* ====================== Card 3: get_voice ====================== */
    '2,0': {
        kind: 'seq', step: 3,
        eyebrow: 'voice surface · step 3',
        title: 'get_voice — the render primitive',
        sub: 'What you’re looking at: the one shared function that turns a voice id into rendered text — extract, substitute, and fail safe.',
        boxes: [
            { id:'gv-helper', x:70, y:175, w:225, h:130, tag:'action', t:'get_voice', s:'lookup + substitute' },
            { id:'gv-extract', x:360, y:95, w:215, h:95, tag:'action', t:'extract by id', s:'sed / awk, no xmllint' },
            { id:'gv-subst', x:360, y:235, w:215, h:95, tag:'action', t:'{{var}} substitution', s:'live numbers' },
            { id:'gv-failsafe', x:660, y:175, w:250, h:130, tag:'gate', t:'fail-safe', s:'missing id → "" → fallback' }
        ],
        edges: [
            { from:'gv-helper', to:'gv-extract', kind:'hard', label:'first' },
            { from:'gv-helper', to:'gv-subst', kind:'hard', label:'then' },
            { from:'gv-helper', to:'gv-failsafe', kind:'soft', label:'always exit 0' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'<b>get_voice</b> extracts one message by id (sed fast-path / awk fallback — <b>never xmllint</b>), substitutes <b>{{var}}</b> live numbers, and <b>always returns exit 0</b>. A missing id yields "" so a guard falls back to a hardcoded literal — the fail-safe-allow contract.',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · rendering a voice', blurb:'07_3 covers how a voice id becomes injected text. This card draws the shared get_voice primitive every hook and script sources.' } }
        ],
        navHints: { left: 'the two files', right: 'choosing a coaching voice', down: 'extract → substitute → fail-safe' }
    },
    /* ---- Detail 2,1: get_voice render pipeline ---- */
    '2,1': {
        kind: 'detail',
        eyebrow: 'voice surface · get_voice detail',
        title: 'extract → substitute → fail-safe',
        sub: 'What you\'re looking at: the three steps get_voice runs on every call — and how Stage-3 yaml augmentation couples in after substitution.',
        boxes: [
            { id:'gv-extract', x:70, y:155, w:200, h:100, tag:'action', t:'extract by id', s:'find the message in voice.xml' },
            { id:'gv-sub', x:330, y:155, w:210, h:100, tag:'action', t:'substitute placeholders', s:'fill {{plugin_name}} etc.' },
            { id:'gv-yaml', x:590, y:155, w:220, h:100, tag:'context', t:'Stage-3 yaml augmentation', s:'voice-helper appends from the cache' },
            { id:'gv-fail', x:730, y:315, w:180, h:90, tag:'gate', t:'fail-safe', s:'missing id → no crash, degrade gracefully' }
        ],
        edges: [
            { from:'gv-extract', to:'gv-sub', kind:'hard', label:'→' },
            { from:'gv-sub', to:'gv-yaml', kind:'soft', label:'+' },
            { from:'gv-extract', to:'gv-fail', kind:'soft', label:'or' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'<b>get_voice</b> is the one primitive every voice call routes through — and it <b>fails safe, never crashes the hook</b>. After extraction + substitution, Stage-3 yaml augmentation appends (or replaces/prepends) from the injection cache — the plugin never needs to know a plan exists.' }
        ],
        navHints: { up: 'back to the render primitive' }
    },
    /* ====================== Card 4: coaching rotation ====================== */
    '3,0': {
        kind: 'seq', step: 4,
        eyebrow: 'voice surface · step 4',
        title: 'Coaching rotation — which nudge fires',
        sub: 'What you’re looking at: how a phase picks ONE coaching voice — from a registered pool, by budget tier, then at random.',
        boxes: [
            { id:'cr-pool', x:70, y:175, w:225, h:130, tag:'state', t:'COACHING_IDS', s:'the rotation pool' },
            { id:'cr-waiting', x:360, y:95, w:215, h:95, tag:'action', t:'after a question', s:'fires on [WAITING]' },
            { id:'cr-tier', x:360, y:235, w:215, h:95, tag:'gate', t:'budget tier', s:'work / quality / finish' },
            { id:'cr-random', x:660, y:175, w:250, h:130, tag:'action', t:'RANDOM in tier', s:'not a % counter' }
        ],
        edges: [
            { from:'cr-pool', to:'cr-waiting', kind:'soft', label:'selects when' },
            { from:'cr-waiting', to:'cr-tier', kind:'hard', label:'pick a pool' },
            { from:'cr-tier', to:'cr-random', kind:'hard', label:'pick one' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'Coaching fires <b>after a [WAITING] question</b>. The tracker computes remaining budget, picks a pool by tier (<b>work &gt;60 → quality &gt;20 → finishing ≤20</b>), then picks <b>one voice at random</b> — so coaching drifts investigate → synthesize → finish, never a fixed sequence.',
              ref: { url:'../07_6-agents-and-80-20-budget.html', section:'Blog 7.6 · the 80/20 budget', blurb:'07_6 covers the per-phase budget the coaching tiers read. The pool a phase draws from shifts as that budget drains.' } }
        ],
        navHints: { left: 'rendering a voice', right: 'the no-orphan rule', down: 'the rotation pipeline' }
    },
    /* ---- Detail 3,1: rotation pipeline + plugin_integrity ---- */
    '3,1': {
        kind: 'detail', step: 4,
        eyebrow: 'voice surface · detail',
        title: 'Two edits per voice — the lockstep',
        sub: 'How a coaching voice actually fires: it must be in the array AND in voice.xml — and one plugin shows the rule’s exception.',
        boxes: [
            { id:'cr-truth', x:70, y:150, w:215, h:110, tag:'state', t:'array = truth', s:'element alone ≠ fires' },
            { id:'cr-lockstep', x:375, y:150, w:215, h:110, tag:'gate', t:'lockstep hazard', s:'edit BOTH, silent drift' },
            { id:'cr-healthcheck', x:680, y:150, w:230, h:110, tag:'gate', t:'one-way backstop', s:'array → xml only' },
            { id:'cr-pi', x:340, y:315, w:285, h:110, tag:'context', t:'plugin_integrity', s:'no pool, 4 fixed coaches' }
        ],
        edges: [
            { from:'cr-truth', to:'cr-lockstep', kind:'hard', label:'two places agree' },
            { from:'cr-lockstep', to:'cr-healthcheck', kind:'soft', label:'partly caught' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'Adding a coaching voice means editing <b>BOTH voice.xml AND COACHING_IDS</b> — drift is silent, caught only one-way by health-check. <b>plugin_integrity carries no pool</b> yet has 4 coaching elements firing deterministically: rotation is just ONE way to use the files.' }
        ],
        navHints: { up: 'back to rotation' }
    },
    /* ====================== Card 5: orphan voice ====================== */
    '4,0': {
        kind: 'seq', step: 5,
        eyebrow: 'voice surface · step 5',
        title: 'The orphan — a voice that can’t fire',
        sub: 'What you’re looking at: a voice defined but never wired — the silent trap the whole audit layer exists to prevent.',
        boxes: [
            { id:'ov-orphan', x:70, y:170, w:225, h:135, tag:'state', t:'orphan voice', s:'defined, no callsite' },
            { id:'ov-silent', x:360, y:95, w:215, h:95, tag:'context', t:'silent no-op', s:'no error, no inject' },
            { id:'ov-twoways', x:360, y:235, w:215, h:95, tag:'object', t:'two ways to orphan', s:'unreferenced / unlisted' },
            { id:'ov-invariant', x:660, y:170, w:250, h:135, tag:'gate', t:'the invariant', s:'callsite, or removed' }
        ],
        edges: [
            { from:'ov-orphan', to:'ov-silent', kind:'soft', label:'the danger' },
            { from:'ov-orphan', to:'ov-twoways', kind:'soft', label:'how it happens' },
            { from:'ov-twoways', to:'ov-invariant', kind:'hard', label:'closed by' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'An <b>orphan</b> is a voice id defined but fired by nothing — a <b>silent no-op</b>: a yaml plan can target it and watch nothing happen. The invariant: <b>every defined id has a callsite, or is removed</b>. Two ways to orphan: never referenced, or coaching missing from COACHING_IDS.',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · keeping voices honest', blurb:'The no-orphan-voices invariant keeps the surface honest — what is defined is what can fire.' } }
        ],
        navHints: { left: 'choosing a coaching voice', right: 'the catalog that enforces it' }
    },
    /* ====================== Card 6: voice catalog + audit ====================== */
    '5,0': {
        kind: 'seq', step: 6,
        eyebrow: 'voice surface · step 6',
        title: 'The catalog — computed, not stored',
        sub: 'What you’re looking at: the tool that enforces the orphan invariant and the yaml contract by re-deriving the truth on every run.',
        boxes: [
            { id:'vc-catalog', x:70, y:175, w:225, h:130, tag:'action', t:'build-voice-catalog', s:'rglob both files' },
            { id:'vc-callable', x:360, y:95, w:215, h:95, tag:'state', t:'callable', s:'defined ∩ referenced' },
            { id:'vc-orphanmissing', x:360, y:235, w:215, h:95, tag:'state', t:'orphan / missing', s:'the two failures' },
            { id:'vc-yamlvalidator', x:660, y:175, w:250, h:130, tag:'gate', t:'yaml validator', s:'keys must be callable' }
        ],
        edges: [
            { from:'vc-catalog', to:'vc-callable', kind:'hard', label:'classifies' },
            { from:'vc-catalog', to:'vc-orphanmissing', kind:'hard', label:'classifies' },
            { from:'vc-callable', to:'vc-yamlvalidator', kind:'hard', label:'the contract set' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'<b>build-voice-catalog.py</b> scans both voice.xml files + all source, classifying every id <b>callable</b> (defined ∩ referenced), <b>orphan</b>, or <b>missing</b> — computed fresh, never stored. <b>callable</b> is the contract: a yaml plan key must match one, or the validator rejects the plan with a "did you mean".',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · the voice catalog', blurb:'The catalog is the contract surface — the set a Stage-3 yaml plan is allowed to target.' } }
        ],
        navHints: { left: 'the orphan rule', right: 'tuning voices per-job' }
    },
    /* ====================== Card 7: Stage-3 yaml injection ====================== */
    '6,0': {
        kind: 'seq', step: 7,
        eyebrow: 'voice surface · step 7',
        title: 'Stage-3 yaml — tuning a voice per job',
        sub: 'What you’re looking at: the softest end of the customization gradient — a yaml plan re-words existing voices, phase by phase, with no code edit.',
        boxes: [
            { id:'yi-keys', x:70, y:175, w:225, h:130, tag:'object', t:'yaml keys', s:'ARE voice ids' },
            { id:'yi-dispatch', x:360, y:95, w:215, h:95, tag:'action', t:'augment by shape', s:'append / replace / prepend' },
            { id:'yi-cache', x:360, y:235, w:215, h:95, tag:'state', t:'injection cache', s:'producer / consumer' },
            { id:'yi-existing', x:660, y:175, w:250, h:130, tag:'gate', t:'existing voices only', s:'cannot mint new' }
        ],
        edges: [
            { from:'yi-keys', to:'yi-dispatch', kind:'hard', label:'matched at fire-time' },
            { from:'yi-dispatch', to:'yi-cache', kind:'soft', label:'read from' },
            { from:'yi-keys', to:'yi-existing', kind:'hard', label:'bounded by' }
        ],
        stickies: [
            { x:70, y:28, aha:true, text:'A Stage-3 <b>yaml plan key IS a voice id directly</b> — no transform. get_voice augments the matched voice by value shape: bare string <b>appends</b>, {mode} <b>replaces or prepends</b>. It can only modify <b>callable</b> voices — never mint a fireable one (that still needs a wired callsite).',
              ref: { url:'../07_3-dual-voice-architecture.html', section:'Blog 7.3 · per-job voice tuning', blurb:'Stage-3 yaml is the per-job end of the customization gradient — a plan tunes how existing phase voices read, for that job only.' } }
        ],
        navHints: { left: 'the catalog', down: 'the read → cache → augment pipeline' }
    },
    /* ---- Detail 6,1: the yaml pipeline ---- */
    '6,1': {
        kind: 'detail', step: 7,
        eyebrow: 'voice surface · detail',
        title: 'read → cache → augment',
        sub: 'How a yaml plan reaches a rendered voice without any plugin knowing plans exist — and where it is validated.',
        boxes: [
            { id:'yi-parse', x:60, y:155, w:190, h:100, tag:'action', t:'parse-yaml-fields', s:'flat id→value map' },
            { id:'yi-write', x:290, y:155, w:190, h:100, tag:'action', t:'write_yaml_cache', s:'on transition' },
            { id:'yi-augment', x:520, y:155, w:190, h:100, tag:'action', t:'get_voice augments', s:'at fire-time' },
            { id:'yi-gmode', x:750, y:155, w:175, h:100, tag:'context', t:'cleared on gmode', s:'side-quest safe' },
            { id:'yi-validate', x:340, y:315, w:290, h:100, tag:'gate', t:'validated at EXECUTE write', s:'not during PLAN' }
        ],
        edges: [
            { from:'yi-parse', to:'yi-write', kind:'hard', label:'→' },
            { from:'yi-write', to:'yi-augment', kind:'hard', label:'→' },
            { from:'yi-write', to:'yi-validate', kind:'soft', label:'authored in EXECUTE' }
        ],
        stickies: [
            { x:60, y:28, aha:true, text:'<b>parse-yaml-fields → write_yaml_cache → get_voice augments</b> at fire-time — plugins stay naive. The cache is <b>emptied on gmode entry</b> so a side-quest never inherits the job’s injections. The voice-id validators are plan-owned but fire on the <b>cycle-1 EXECUTE write</b>, not during PLAN.' }
        ],
        navHints: { up: 'back to Stage-3 yaml' }
    }
};
