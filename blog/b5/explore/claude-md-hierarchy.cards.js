/* ============================================================================
 * claude-md-hierarchy.cards.js — CONTENT for "The CLAUDE.md Hierarchy" deck.
 * Teaches the brain & memory SUBSTRATE: the Markov self-model the seed reads at
 * session start, the CLAUDE.md working-memory BUS, the layered hierarchy (root
 * injected-always vs local append-on-read), the four-state lifecycle, the four
 * footer anchors (birth-block + self-heal), the three durable surfaces
 * (transient brain -> unbounded knowledge/ -> narrow memory/), and the soft size
 * caps + the forgetting discipline that MOVES overflow rather than dropping it.
 * Paired with the shared deck-engine.js + deck-engine.css (b6/explore, referenced
 * cross-dir). Loaded BEFORE the engine.
 *
 * Every hood fact own-grep verified against the LIVE prototype 2026-06-17 (Rule 3).
 * Source pointers use STABLE anchors (file · function/section), never line numbers
 * (Rule 20). Rot-prone counts (silo totals, memory-entry totals, test counts) are
 * deliberately NOT pinned; the five word caps ARE pinned (retunable design knobs,
 * verified live in root CLAUDE.md "Size Limits").
 * Sources (all own-grep verified):
 *   .claude/context/brain-memory.md — design ground truth ([consolidated]): Markov
 *     brain / CLAUDE.md bus / hierarchy layers / lifecycle / anchor stability /
 *     anchor self-heal / knowledge-/ / memory-/ / size limits,
 *   root CLAUDE.md — "Markov Brain" + "Growth Rules" + "CLAUDE.md Lifecycle" +
 *     "Workspace Structure" + "Size Limits" table (3500/800/2000/400/500),
 *   lib/section_guard/section-check.sh — validate_new_claude_md_anchors() (birth
 *     block) / heal_missing_anchors() + heal_claude_md_anchors_or_block() (self-heal),
 *   plugin_integrity/hooks/anchor-bootstrap.sh — PostToolUse:Write anchor net,
 *   phase_verify/hooks/verify-guard.sh — the memory-path early-exit exemption
 *     (the same scoped match in all five phase guards + idle phase-gate.sh),
 *   plugin_integrity/hooks/evolution-cap.sh — MAX_EVOLUTION_WORDS (default 2000),
 *     the sole hard word-count gate in the plugin tree.
 * ============================================================================ */
window.DECK_META = { page: 'claude-md-hierarchy', seqLabel: 'the working-memory bus' };

window.DECK_INFO = {
    /* ---- Card 1: the Markov self-model ---- */
    'mb-catalog': {
        title: 'the operation catalog', tag: 'object',
        what: 'The seed agent’s self-model: every cognitive move it can make, written down as a named operation. The five phases plus specialized moves like commit, dispatch, and skill calls.',
        why: 'Before any phase runs, the brain must know its own shape. This catalog is the frame the seed reads at session start — the most basic decision in the whole architecture is which moves exist.',
        hood: 'Enumerated in root <code>CLAUDE.md</code> · "Markov Brain" — OPEVC phases + <code>GIT.*</code>/<code>SKILL.*</code>/<code>JOB.*</code>. Each operation carries a definition AND ≥1 transition map. Source: <code>brain-memory.md</code> · "The Markov brain".'
    },
    'mb-maps': {
        title: 'the transition maps', tag: 'object',
        what: 'For each operation, the declaration of which operations may follow it. The catalog is the set of moves; the maps are the rules of which move may come next.',
        why: 'A freestyling model mixes the stages of a piece of work. The maps are what create phases at all — they keep observe from sliding into execute, and make each transition a deliberate, improvable step.',
        hood: 'The prose maps ("Standard task workflow", "Failure recovery") are the soft, human-readable layer; the hard enforced edge-set for the phase ring is the <code>FORWARD_MAP</code>/<code>BACKWARD_MAP</code> in <code>phase.sh</code>. Source: <code>brain-memory.md</code> · "The Markov brain" (catalog + edges).'
    },
    'mb-navigate': {
        title: 'navigate the brain', tag: 'action',
        what: 'The seed agent works by moving through this catalog — picking the next legal operation, running it, then choosing again. Its whole behaviour is a walk across the named moves.',
        why: 'Framing cognition as a walk across a self-model is what makes the model improvable: each node is a plugin carrying its own controls, so the seed can sharpen one compartment without touching the others.',
        hood: 'It is a Markov <em>brain</em>, not a plain state machine — the action space is narrowed and hook-enforced per node, the probabilistic framing blog <code>06_1</code> calls "From Action Space to Markov Brain". Source: <code>brain-memory.md</code> · "The Markov brain" (relation to phase theory).'
    },
    'mb-grow': {
        title: 'grow by recurrence', tag: 'action',
        what: 'The brain is not fixed. A pattern seen more than twice gets named and added; a new operation needs a definition plus a place in some map; an operation over fifty words is extracted to a skill file so the brain stays lean.',
        why: 'This is active learning of the agent’s own shape. CONDENSE is where the brain grows most, but plugin-unlocking jobs and gmode also edit it — over time proven patterns harden into hooks and leave the brain leaner than they found it.',
        hood: 'The discipline is root <code>CLAUDE.md</code> · "Growth Rules" + "Brain Maturation Model". The brain holds at an equilibrium ceiling (soft word caps) while <code>knowledge/</code> grows unbounded below it. Source: <code>brain-memory.md</code> · "The Markov brain" (grows by codifying recurrence).'
    },

    /* ---- Card 2: the working-memory bus ---- */
    'bus-claudemd': {
        title: 'CLAUDE.md', tag: 'object',
        what: 'A file literally named CLAUDE.md, placed at known disk locations. It is not a notes store — it IS the agent’s working memory, the native Markdown primitive the whole design rests on.',
        why: 'Chat is the one place the seed’s memory does NOT live — it is capped and lost at compaction. The bus replaces the transient prompt with an addressable, durable surface the seed and its helpers can both read.',
        hood: 'Root + <code>.claude/CLAUDE.md</code> auto-load at session start; subdir files surface on demand when the seed accesses that directory. Blog <code>05_7</code> calls it "the working-memory form the phasic layer writes through". Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)".'
    },
    'bus-bridge': {
        title: 'bridge across the boundaries', tag: 'action',
        what: 'The bus carries context across three gaps at once: between phases of one job, between sessions, and between the main session and the subagents it dispatches.',
        why: 'Each of those three would otherwise lose state. Because every agent in a directory reads the same CLAUDE.md, what one writes there is visible to all — it is the shared memory bus, not a private scratchpad.',
        hood: 'The states the bus passes through cycle-to-cycle are the <code>CLAUDE.md lifecycle</code>; the channel that inflates and deflates it is the four-footer protocol gated by the deflation gate. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)" (native + layered loading).'
    },
    'bus-declare': {
        title: 'declare intended work', tag: 'action',
        what: 'Updating a directory’s CLAUDE.md during OBSERVE or PLAN is how the seed declares it intends to work there. That declaration is what gives the bus teeth.',
        why: 'It is not just documentation. The CLAUDE.md you update is the altered list — it authorises EXECUTE to write that directory. No declaration, no write access. Working memory and write-scope are the same act.',
        hood: 'The altered list keys on the updated CLAUDE.md (<code>phase_observe</code> · <code>add-altered</code> arm); <code>execute-guard.sh</code> enforces the exact-directory scope. Walk into the detail card. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)" (declaration with teeth).'
    },
    'bus-forsubagents': {
        title: 'for the subagents', tag: 'context',
        what: 'Subagents carry no session context of their own. In a real sense the CLAUDE.md content is written for them — it gives each dispatched helper the best possible context to do its slice of the work.',
        why: 'The deepest framing of the bus: it controls the sequence of information entering the context that produces the next content. Writing well there helps the main session think AND provisions the eighty percent of labour that runs in subagents.',
        hood: 'The 80/20 split (main orchestrates, subagents carry the bulk) reads its context from the bus. The forms a subagent cannot see — chat history — are exactly the ones the bus exists to replace. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)" (the deepest framing).'
    },

    /* ---- detail 1,1: why the bus has teeth ---- */
    'd-altered': {
        title: 'the altered list', tag: 'gate',
        what: 'The set of directories the seed has declared it will work in this cycle, built from the CLAUDE.md files it updated in OBSERVE and PLAN. EXECUTE may write only inside that list.',
        why: 'It fuses memory and permission. You cannot edit a directory you did not first think about on paper — which forces the seed to plan a change before making it, and keeps execute from sprawling.',
        hood: 'Built by <code>phase_observe</code>’s <code>add-altered</code> arm (stores <code>altered_claude_md</code>); <code>execute-guard.sh</code> matches the exact dirname of the CLAUDE.md, with no parent-directory walk. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)" + the Altered list term.'
    },
    'd-nocontext': {
        title: 'subagents carry no context', tag: 'context',
        what: 'A dispatched subagent starts blank. It does not see the main session’s chat, only the files it is pointed at — and the CLAUDE.md in its working directory is the richest of those.',
        why: 'This is why the bus content is "for the subagents". The quality of what one writes to CLAUDE.md directly sets the quality of the eighty percent of work that runs in helpers with no other memory.',
        hood: 'Subagent calls are governed by the same phase guards (the probe finding: <code>agent_type</code> present for sub/workflow agents, ABSENT for main). The bus is their shared read surface. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)".'
    },
    'd-sequence': {
        title: 'controls the information sequence', tag: 'action',
        what: 'The bus decides the order in which information enters the context that produces the next piece of content. Each phase writes what the next phase — or the next subagent — will read first.',
        why: 'Sequencing context is the real lever on output quality. The bus is the seed’s tool for staging what its future self and its helpers encounter, instead of hoping the right facts are still in a crowded chat window.',
        hood: 'The four footer anchors partition the file so each phase appends to its own section; CONDENSE later routes that content up and out. The ordering is the design, not an accident. Source: <code>brain-memory.md</code> · "CLAUDE.md (working-memory bus)" (the deepest framing).'
    },
    'd-notchat': {
        title: 'chat is not a memory form', tag: 'state',
        what: 'The chat session is deliberately NOT one of the seed’s memory surfaces. It is transient and lossy at compaction — present for the turn, gone after the window fills.',
        why: 'The whole point of the bus is to move state OFF the chat onto addressable, durable layers. Treating chat as memory is the failure mode the CLAUDE.md primitive exists to prevent.',
        hood: 'Chat being capped and lossy is precisely why <code>brain_guard</code> exists (it compacts before the window saturates). The durable surfaces are the bus, <code>knowledge/</code>, and <code>memory/</code>. Source: <code>brain-memory.md</code> · "knowledge/ durable layer" (one form among plural).'
    },

    /* ---- Card 3: the hierarchy ---- */
    'hier-root': {
        title: 'root files — injected always', tag: 'context',
        what: 'The top of the stack — root CLAUDE.md plus the brain index at .claude/CLAUDE.md — is loaded in every phase. It carries the seed’s core self-understanding so it never works without knowing its own cognition.',
        why: 'Like working in a room while knowing the whole house. Identity, the OPEVC cycle, the growth rules, and the size limits are always in context, so every local decision is made against the whole design.',
        hood: 'Root <code>CLAUDE.md</code> (identity + OPEVC + growth + size limits) auto-loads first; <code>.claude/CLAUDE.md</code> (plugin catalog + knowledge roster + maturation) second. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers" (the two-way split).'
    },
    'hier-local': {
        title: 'local memory — append on read', tag: 'state',
        what: 'Everything below the root is local working memory, surfaced only when the seed enters that directory. A per-plugin or per-project CLAUDE.md appears on demand, not at startup.',
        why: 'It keeps the always-on context small while making deep local detail available exactly when work moves into a directory — the room you walk into, loaded as you enter it.',
        hood: 'Per-plugin <code>.claude/plugins/&lt;name&gt;/CLAUDE.md</code> and per-working-directory CLAUDE.md files load on access. Walk into the detail card for the full stack. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers".'
    },
    'hier-universal': {
        title: 'a CLAUDE.md wherever work happens', tag: 'gate',
        what: 'The universal rule: anywhere the seed does any form of work, a CLAUDE.md must exist there — both to capture the memory of that work and to let the work advance through OPEVC.',
        why: 'Two jobs in one rule. The file is the memory of the directory AND the key the altered list turns to grant EXECUTE access — so a missing CLAUDE.md means the seed cannot legally work there at all.',
        hood: 'The Altered list keys on it; the four anchors make it a valid working-memory file. Birth (creating the first one) is allowed in OBSERVE/PLAN but blocked without all four anchors. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers" (the universal rule).'
    },
    'hier-upward': {
        title: 'content flows up at CONDENSE', tag: 'action',
        what: 'Information moves upward through the layers — never down by inheritance. At CONDENSE, durable findings rise from a local CLAUDE.md into the brain index and into the knowledge floor.',
        why: 'Lower layers do not inherit from upper ones; each owns a distinct role. The only cross-layer motion is condensation pushing what is worth keeping up toward more permanent, more widely-loaded homes.',
        hood: 'CONDENSE absorbs footers into the body (same file) then migrates content to sibling/parent CLAUDE.md and into <code>.claude/knowledge/</code>. Not an include directive, not inheritance. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers".'
    },

    /* ---- detail 2,1: the layers + asymmetry ---- */
    'l-rootbrain': {
        title: 'root + brain index', tag: 'object',
        what: 'The two auto-loaded files at the top: root CLAUDE.md (identity, OPEVC, growth rules, size limits) and .claude/CLAUDE.md (the plugin catalog, knowledge roster, and maturation model).',
        why: 'These carry the parts of the self-model that must be present for every decision. They are the "whole house" the seed holds in mind while it works in any one room.',
        hood: 'Both auto-load at session start (root first, brain index second). Their size is bounded by the soft word caps; overflow routes to skill files and the plugin <code>knowledge/</code> silos. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers" (the layers list).'
    },
    'l-perplugin': {
        title: 'per-plugin CLAUDE.md', tag: 'object',
        what: 'Each plugin directory carries its own CLAUDE.md holding that plugin’s concern, version, test count, and OPEVC footers — surfaced when work moves into that plugin.',
        why: 'It keeps each plugin’s local detail next to the plugin, out of the always-on context, available the moment the seed opens that directory to work on it.',
        hood: 'Lives at <code>.claude/plugins/&lt;name&gt;/CLAUDE.md</code>; loads on demand. The phasic plugins write footers into theirs each cycle; CONDENSE absorbs and routes the content. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers".'
    },
    'l-perdir': {
        title: 'per-working-directory CLAUDE.md', tag: 'object',
        what: 'The working-memory file for whatever directory is being worked — including project directories outside .claude/, like the website. It holds project-local context for that exact place.',
        why: 'The hierarchy extends identically into project trees: anchors, scope-declaration, and deflation all work the same outside .claude/ as inside it. There is no reason to treat project sections differently.',
        hood: 'Same four anchors, same altered-list role as any brain CLAUDE.md. The blog’s own working-memory files are instances of this layer. Source: <code>brain-memory.md</code> · "Anchor stability" (the layer extends into projects).'
    },
    'l-asymmetry': {
        title: 'the plugin–hierarchy asymmetry', tag: 'context',
        what: 'Phasic plugins actively USE the hierarchy — they write footers each cycle and CONDENSE absorbs them. The always-on plugins operate mostly orthogonal to it, carrying their own hidden data.json state and touching CLAUDE.md minimally.',
        why: 'The phasic layer is the substrate’s user; the always-on layer is the enforcer. Seeing which plugins write the bus and which mind their own files keeps the two roles from blurring together.',
        hood: 'Always-on plugins (<code>plugin_integrity</code>, <code>brain_guard</code>, <code>job_core</code>, <code>interaction_summary</code>, <code>question_discipline</code>) key on their own <code>data.json</code>; the phase plugins write the footers. Source: <code>brain-memory.md</code> · "CLAUDE.md hierarchy layers" (plugin–hierarchy asymmetry).'
    },

    /* ---- Card 4: the lifecycle ---- */
    'lc-proactive': {
        title: 'proactive', tag: 'state',
        what: 'The first state: a CLAUDE.md created BEFORE work begins in a directory, holding the initial context and the intent for what is about to happen there.',
        why: 'Writing intent down first is what lets OBSERVE and PLAN reason on paper before any change. A directory’s memory starts before its work does.',
        hood: 'Named in root <code>CLAUDE.md</code> · "CLAUDE.md Lifecycle" (state 1 of 4). Creation is gated: the file must carry all four anchors or birth is blocked. Source: <code>brain-memory.md</code> · "CLAUDE.md lifecycle".'
    },
    'lc-active': {
        title: 'active', tag: 'state',
        what: 'The working state: updated in every phase as understanding evolves, always reflecting the current picture of the work.',
        why: 'This is the bus doing its job mid-cycle — each phase appends what the next phase, or the next subagent, needs to read. The file is never stale while work is live.',
        hood: 'Each phase writes its own footer section (the four anchors partition the file); the min-max gate paces investigate-then-synthesize writes. Source: <code>brain-memory.md</code> · "CLAUDE.md lifecycle" (state 2 of 4).'
    },
    'lc-retroactive': {
        title: 'retroactive', tag: 'state',
        what: 'The after-work state: updated once execution completes with results, lessons, and the decisions that were actually made — including VERIFY’s post-EXECUTE findings.',
        why: 'It captures what was learned while the memory is fresh, so the cycle’s real outcomes — not just its plan — survive into condensation.',
        hood: 'VERIFY forward-appends findings; the file now holds plan, work, and outcome together heading into CONDENSE. Source: <code>brain-memory.md</code> · "CLAUDE.md lifecycle" (state 3 of 4).'
    },
    'lc-condensed': {
        title: 'condensed', tag: 'state',
        what: 'The closing state: after a full OPEVC cycle the file is distilled to essentials, its reusable knowledge migrated to .claude/knowledge/, and its working memory returned to minimal — ready for the next cycle.',
        why: 'This is the deflate half of the rhythm. The footers inflate across the cycle, then CONDENSE absorbs them back to a clean body, so the file never grows without bound and the next cycle starts fresh.',
        hood: 'Condensed is NOT archived — the file stays live with an enriched body. The ≥80% footer-to-body absorption is the deflation gate, code-checked at the CONDENSE commit. Source: <code>brain-memory.md</code> · "CLAUDE.md lifecycle" (state 4 of 4, cyclic).'
    },

    /* ---- Card 5: the anchors ---- */
    'anc-four': {
        title: 'the four footer anchors', tag: 'object',
        what: 'Every CLAUDE.md anywhere — inside .claude/ and out in project trees — carries the four ordered footer anchors that mark the OBSERVE, PLAN, EXECUTE, and VERIFY sections.',
        why: 'They are the universal structure that makes a file a valid working-memory file. The invariant holds everywhere: project working memory is the same memory form as the brain’s, so it gets the same anchors.',
        hood: 'The anchors are <code>---Ob---</code> / <code>---Pl---</code> / <code>---Ex---</code> / <code>---Ve---</code>, ordered. Validated by the shared <code>section_guard</code> lib. Source: <code>brain-memory.md</code> · "Anchor stability".'
    },
    'anc-loadbearing': {
        title: 'load-bearing, not decorative', tag: 'context',
        what: 'The anchors carry weight. Phase guards route writes by them, updating a CLAUDE.md declares its directory editable in EXECUTE, and CONDENSE measures deflation against them.',
        why: 'Because three separate mechanisms depend on the anchors, a file without them is unreachable — the exact failure that once hard-locked the seed out of its own planned fix in a live job test.',
        hood: 'Guards partition writes by anchor; the altered list and the deflation gate both read them. This is why removal is blocked and absence is healed rather than tolerated. Source: <code>brain-memory.md</code> · "Anchor stability".'
    },
    'anc-birthblock': {
        title: 'birth blocks anchorless', tag: 'gate',
        what: 'OBSERVE and PLAN may create the first CLAUDE.md in a new directory, but creation is blocked unless the new content carries all four anchors. The author must produce the right shape.',
        why: 'It stops a malformed working-memory file from ever being born — the structure is required at creation, not bolted on later, so no directory gets an unreachable memory file in the first place.',
        hood: '<code>validate_new_claude_md_anchors()</code> in <code>lib/section_guard/section-check.sh</code> is the pattern-matcher gate that rejects anchorless creation. Source: <code>brain-memory.md</code> · "Anchor stability" (defended in depth, birth).'
    },
    'anc-heal': {
        title: 'self-heal on edit or read', tag: 'action',
        what: 'A CLAUDE.md the seed MEETS — targeted for edit, or even just read — that is missing anchors gets them added, then work proceeds. The guard heals rather than blocks.',
        why: 'The anchors are a derivable structural fact, not user state, so the right move is to restore them, not refuse the file. The seed never runs on an anchorless file — it fixes the structure first.',
        hood: '<code>heal_missing_anchors()</code> (canonical-position insertion, body byte-preserved, snapshot + one loud stderr line), wired at all five phase guards’ edit/read paths via <code>heal_claude_md_anchors_or_block()</code>. Walk into the detail card. Source: <code>brain-memory.md</code> · "Anchor self-heal".'
    },

    /* ---- detail 4,1: birth-block vs self-heal ---- */
    'h-birthvalidate': {
        title: 'make → validate (block)', tag: 'gate',
        what: 'When the seed MAKES a new CLAUDE.md, the content is validated: without all four anchors the creation is rejected outright. The author is forced to produce the correct shape.',
        why: 'A file you are writing fresh should simply be written correctly. Blocking at creation keeps a broken memory file from ever entering the tree, where it would silently erode phase discipline.',
        hood: '<code>validate_new_claude_md_anchors()</code> · <code>section-check.sh</code> — the pattern-matcher gate on creation. This is REJECT, not heal. Source: <code>brain-memory.md</code> · "Anchor self-heal" (block vs heal distinction).'
    },
    'h-heal': {
        title: 'meet → heal (add)', tag: 'action',
        what: 'When the seed MEETS an existing CLAUDE.md that lacks anchors at the edit or read path, the missing anchors are inserted at their canonical positions, the body preserved byte-for-byte, and work continues.',
        why: 'Files the seed encounters may predate the rule or come from elsewhere. Healing them in place — rather than refusing — keeps the seed working while still guaranteeing the structure it depends on.',
        hood: '<code>heal_missing_anchors()</code> + the guard wrapper <code>heal_claude_md_anchors_or_block()</code> in the shared <code>section_guard</code> lib; condense was the last engagement path wired in. Snapshots before every heal. Source: <code>brain-memory.md</code> · "Anchor self-heal".'
    },
    'h-bootstrap': {
        title: 'the PostToolUse net', tag: 'object',
        what: 'A second safety net: a plugin_integrity hook that fires after any in-seed Write and appends missing anchors — catching CONDENSE, gmode, and subagent writes the phase guards might not sit on.',
        why: 'It closes the gap for write paths that do not pass through a phase guard, so the anchor invariant holds even for files created by the most permissive contexts.',
        hood: '<code>plugin_integrity/hooks/anchor-bootstrap.sh</code> (PostToolUse:Write) inserts each missing anchor at its canonical position before the first present successor — never a blind end-of-file append. Source: <code>brain-memory.md</code> · "Anchor stability" (the birth net).'
    },
    'h-outoforder': {
        title: 'out-of-order → block + escalate', tag: 'gate',
        what: 'Healing only ADDS missing anchors. Anchors that are present but out of order, or duplicated, are not silently reordered — they block and escalate instead.',
        why: 'Reordering moves real content between sections and is destructive. Adding what is absent is safe; rearranging what is present is not, so the seed refuses rather than risk corrupting the file.',
        hood: 'The heal path inserts missing anchors only; duplicate/out-of-order triggers a hard block with a loud escalation line. Source: <code>brain-memory.md</code> · "Anchor stability" (auto-reorder is banned).'
    },

    /* ---- Card 6: three durable surfaces ---- */
    'surf-brain': {
        title: 'the brain — transient', tag: 'state',
        what: 'The first surface: the CLAUDE.md hierarchy itself. It is working memory — it inflates across a cycle and deflates back to a minimal body at CONDENSE, holding at an equilibrium ceiling.',
        why: 'The brain is meant to forget. It carries the live working set, not the permanent record, so it must shed content each cycle to stay legible. What is worth keeping moves down to the durable floors.',
        hood: 'Bounded by the soft word caps; deflated ≥80% at each CONDENSE commit. The brain is bounded by discipline while <code>knowledge/</code> grows unbounded below it. Source: <code>brain-memory.md</code> · "The Markov brain" + "knowledge/ durable layer".'
    },
    'surf-condense': {
        title: 'condense upward', tag: 'action',
        what: 'At cycle close, durable findings are routed off the transient brain and UP into the permanent surfaces — knowledge by topic, memory by guidance-kind.',
        why: 'Condensation is the bridge between the forgetting brain and the remembering floors. Without it, knowledge would live only in chat and die at the session’s end.',
        hood: 'CONDENSE step 6 consumes the <code>[KNOWLEDGE] topic-slug</code> marker (emitted by earlier phases into the CLAUDE.md footer) and routes the finding into a silo; OBSERVE later reads it back. Source: <code>brain-memory.md</code> · "knowledge/ durable layer" (written by CONDENSE, read by OBSERVE).'
    },
    'surf-knowledge': {
        title: 'knowledge/ — durable, unbounded', tag: 'object',
        what: 'The second surface: .claude/knowledge/, the seed’s long-term store, organized as topic-named silos. By far the largest persistent store, kept legible by topic rather than chronology.',
        why: 'It is the only layer with NO word cap — just soft CONDENSE pressure — so it grows monotonically as findings accumulate, the durable cognition the next OBSERVE recalls from.',
        hood: 'Silos under <code>.claude/knowledge/</code>, each a mature dir with an <code>INDEX.md</code> + topic files on a three-layer audience model + concrete decay-and-refresh triggers. Counts rot — not pinned. Source: <code>brain-memory.md</code> · "knowledge/ durable layer".'
    },
    'surf-memory': {
        title: 'memory/ — durable, narrow', tag: 'object',
        what: 'The third surface: the user-side store under ~/.claude/projects/.../memory/ that crosses project boundaries. It holds operator feedback rules, project memories, handoffs, and the MEMORY.md index.',
        why: 'It is kept deliberately narrow — feedback rules are meta-instructions about how the seed should behave, and a hundred of them would be unmanageable. The durability stack is brain → knowledge → memory.',
        hood: 'Lives in the home dir, not the repo (so it crosses projects). It is Claude’s native memory tool kept working under the seed — which is why it is editable in any phase. Walk into the detail card. Source: <code>brain-memory.md</code> · "memory/ layer".'
    },

    /* ---- detail 5,1: the multi-form substrate ---- */
    'mf-plural': {
        title: '.claude/ ships plural forms', tag: 'context',
        what: 'The brain does not store memory in one place. .claude/ ships several distinct memory forms on purpose, because no single form serves every kind of memory.',
        why: 'Topical recall needs different machinery than a procedural reflex or a coaching nuance. Forcing all of them into one store would serve none of them well — so the substrate is deliberately heterogeneous.',
        hood: 'The principle blog <code>05_1</code> names: plural cognition-shaped forms, not just files on disk. Source: <code>brain-memory.md</code> · "knowledge/ durable layer" (one form among plural).'
    },
    'mf-forms': {
        title: 'the forms', tag: 'object',
        what: 'The memory forms: the knowledge/ silos, each plugin’s data.json plus voice.xml plus docs/evolution.md, the agents/ definition files, settings.local.json, and the CLAUDE.md hierarchy itself.',
        why: 'Each form is shaped for one kind of memory — durable cognition, hidden state, coaching nuance, dispatch instructions, registration. Together they are the multi-form digital cortex the seed rests on.',
        hood: 'Each is read at the moment its kind of memory is needed (voice at fire-time, knowledge at OBSERVE, data.json at the gateway). The CLAUDE.md hierarchy is the working-memory form among them. Source: <code>brain-memory.md</code> · "knowledge/ durable layer" (the other forms).'
    },
    'mf-notchat': {
        title: 'except the chat session', tag: 'state',
        what: 'The one place memory does NOT live by design is the chat session — capped by the model’s window and lossy at compaction. It is the surface all the other forms exist to replace.',
        why: 'Naming chat as a non-form is the whole motivation for the durable surfaces. If the seed trusted chat as memory it would lose state at every compaction; instead it offloads to addressable files.',
        hood: 'Chat being capped and lossy is precisely why <code>brain_guard</code> watches the window and compacts early. Source: <code>brain-memory.md</code> · "knowledge/ durable layer" (the one place memory does not live).'
    },
    'mf-phaseexempt': {
        title: 'memory/ is phase-exempt', tag: 'gate',
        what: 'The memory/ surface is editable in ANY phase — including VERIFY and idle, which otherwise forbid most writes — because it is Claude’s native memory tool kept working underneath the seed.',
        why: 'The seed’s cognition is an addition to the base harness, never a replacement, so no phase guard may block the native memory tool. The exemption targets the native path, not any directory named memory.',
        hood: 'Every phase guard carries an early-exit: <code>[[ "$FILE_PATH" == *"/.claude/projects/"*"/memory/"* ]] && exit 0</code> (canonical in <code>verify-guard.sh</code>; same match in all five guards + the idle <code>phase-gate.sh</code>). Source: <code>brain-memory.md</code> · "memory/ layer" (phase-exempt editability).'
    },

    /* ---- Card 7: size limits + the forgetting discipline ---- */
    'sz-caps': {
        title: 'five soft word caps', tag: 'gate',
        what: 'Five documented per-file word caps bound the brain and working-memory layers: root CLAUDE.md 3,500 · subdir CLAUDE.md 800 · plans 2,000 · MEMORY.md 400 · skills 500.',
        why: 'File size is a forcing function for compartmentalization. A file approaching its cap must be split, extracted, or migrated — so huge unmanageable files never form in the first place.',
        hood: 'Listed in root <code>CLAUDE.md</code> · "Size Limits" and restated inline in <code>CONDENSE.compress</code>. The numbers are a reasonable starting set, adjustable as experience accumulates. The <code>knowledge/</code> layer carries no cap. Source: <code>brain-memory.md</code> · "Size limits (soft word caps)".'
    },
    'sz-discipline': {
        title: 'discipline, not code', tag: 'context',
        what: 'Every cap in the table is enforced by CONDENSE.compress discipline — the seed re-routes content during the cycle — NOT by a code gate. A grossly oversized draft would sail through until tested.',
        why: 'This is the honest accounting: calling soft caps "enforced" is exactly the drift the design warns against. The caps are prioritisation pressure the operator answers, not a wall the code raises.',
        hood: 'No code gate measures these caps; the agent routes overflow during the cycle and CONDENSE enforces deflation at commit. Source: <code>brain-memory.md</code> · "Size limits (soft word caps)" (they are discipline, not code).'
    },
    'sz-evolutioncap': {
        title: 'evolution-cap — the one hard gate', tag: 'gate',
        what: 'The sole hard, code-gated word limit in the whole plugin tree: docs/evolution.md’s 2,000-word cap. Every other cap is soft discipline; this one a hook actually blocks on.',
        why: 'evolution.md is auto-injected on every plugin unlock, so keeping it lean directly protects the per-unlock context budget. That single, concrete cost is what earned it a real code gate where the others stayed soft.',
        hood: 'PreToolUse hook <code>plugin_integrity/hooks/evolution-cap.sh</code> blocks when an edit would push the file past <code>MAX_EVOLUTION_WORDS</code> (default 2000). The only word-count gate in the plugin tree. Source: <code>brain-memory.md</code> · "Size limits" (the sole hard exception).'
    },
    'sz-move': {
        title: 'overflow is MOVED, not deleted', tag: 'action',
        what: 'When a cap is approached, content is moved to a durable home — never dropped. The seed forgets the right things by re-routing them out of the brain, not by discarding them.',
        why: 'Forgetting here is a discipline of relocation. The brain shrinks to stay legible while the knowledge it sheds lands somewhere permanent — growth by pruning, with nothing actually lost.',
        hood: 'Named routes: root-brain → skill files; plugin CLAUDE.md → that plugin’s <code>knowledge/</code> slice; working CLAUDE.md → the deflation gate; memory file → split entries; homeless findings → a hook. Walk into the detail card. Source: <code>brain-memory.md</code> · "Size limits" (the forgetting discipline).'
    },

    /* ---- detail 6,1: forgetting routes + two axes ---- */
    'f-routes': {
        title: 'the named routes', tag: 'action',
        what: 'Where overflow goes, by source: root-brain overflow to focused skill files (with a one-line pointer left behind); plugin CLAUDE.md to that plugin’s knowledge/ slice; memory-file overflow split into narrow entries; a finding that fits no CLAUDE.md hardened into a hook.',
        why: 'Each kind of content has a right home. Routing by source keeps the move principled — content lands where its kind belongs, not wherever there is room, so the durable layers stay coherent.',
        hood: 'Destinations are content-determined, not a priority ladder (the same D2 principle as the CONDENSE waterfall). Working-CLAUDE.md overflow is handled at cycle close by the deflation gate. Source: <code>brain-memory.md</code> · "Size limits" (the named routes).'
    },
    'f-during': {
        title: 'routing runs during the cycle', tag: 'context',
        what: 'The forgetting runs DURING the cycle — the operator routes as work proceeds, and CONDENSE enforces at commit. It never reaches back to retroactively shrink brain history.',
        why: 'An operator who edits the brain carelessly in gmode without re-routing CAN grow it past a cap, and CONDENSE will not retroactively fix it. The discipline is live-cycle hygiene, not a background collector.',
        hood: 'No automatic reclaim — routing is operator plus cycle ceremony. The vR.F.D version header is a separate axis, named only so the two are not conflated. Source: <code>brain-memory.md</code> · "Size limits" (routing runs during the cycle).'
    },
    'f-deflation': {
        title: 'deflation gate — the ratio axis', tag: 'gate',
        what: 'The one hard cap on the working-memory cycle: at the CONDENSE commit, the bottom-section content must be absorbed by at least eighty percent. It measures a deflation RATIO, not a word count.',
        why: 'It guarantees the footers actually shrink back into the body each cycle, so the bus deflates and the next cycle starts clean — the enforced half of the inflate-then-deflate rhythm.',
        hood: 'A single ≥80% rule on every CONDENSE advance, regardless of Job Stage, code-gated at the condense commit. Source: <code>brain-memory.md</code> · "Size limits" (two hard gates, two axes) + the Deflation gate term.'
    },
    'f-evolution': {
        title: 'evolution-cap — the word-count axis', tag: 'gate',
        what: 'The other hard gate measures a different thing: an absolute word count on docs/evolution.md. The deflation gate caps a ratio; evolution-cap caps a number — two axes, no contradiction.',
        why: 'Calling each "the one hard cap" is true because they measure different quantities. Holding the two apart keeps the honest accounting straight: one ratio gate on the cycle, one absolute-count gate on a single file.',
        hood: '<code>evolution-cap.sh</code> blocks at <code>MAX_EVOLUTION_WORDS</code> (2000); the deflation gate blocks below 80% absorption. Ratio axis vs word-count axis. Source: <code>brain-memory.md</code> · "Size limits" (two hard gates, two different axes).'
    }
};

window.DECK_CARDS = {
    /* ============================ SEQ 0 — the Markov self-model ============================ */
    '0,0': {
        kind: 'seq', step: 1, eyebrow: 'the working-memory bus',
        title: 'The brain reads its own shape',
        sub: 'Before any phase runs, the seed reads its self-model: a catalog of named moves and the maps saying which move may follow which. It works by navigating that catalog — and improves it as it goes.',
        boxes: [
            { id: 'mb-catalog', x: 55, y: 80, w: 250, h: 92, tag: 'object', t: 'the operation catalog', s: 'every named cognitive move' },
            { id: 'mb-maps', x: 55, y: 300, w: 250, h: 92, tag: 'object', t: 'the transition maps', s: 'which move may follow which' },
            { id: 'mb-navigate', x: 375, y: 190, w: 240, h: 92, tag: 'action', t: 'navigate the brain', s: 'work = a walk across the moves' },
            { id: 'mb-grow', x: 685, y: 190, w: 240, h: 92, tag: 'action', t: 'grow by recurrence', s: '>2x → name it · >50w → skill file' }
        ],
        edges: [
            { from: 'mb-catalog', to: 'mb-maps', kind: 'hard', label: 'each carries ≥1' },
            { from: 'mb-maps', to: 'mb-navigate', kind: 'soft', label: 'the edges' },
            { from: 'mb-navigate', to: 'mb-grow', kind: 'soft', label: 'active learning' }
        ],
        stickies: [
            { x: 360, y: 320, text: 'It is a Markov BRAIN, not a plain state machine — a narrowed, hook-enforced action space per node.', aha: true,
              ref: { url: '../../b6/06_1-phasic-foundation.html', section: 'From Action Space to Markov Brain', blurb: 'Essay 6.1 — why each phase is a narrowed action space, and the brain that holds them.' } }
        ],
        navHints: { right: 'the working-memory bus' }
    },

    /* ============================ SEQ 1 — the working-memory bus ============================ */
    '1,0': {
        kind: 'seq', step: 2, eyebrow: 'the working-memory bus',
        title: 'CLAUDE.md IS the working memory',
        sub: 'Not a notes file — the native, auto-loaded primitive that bridges context across phases, sessions, and subagents. Updating it declares intended work, and what is written there is, in a real sense, for the subagents.',
        boxes: [
            { id: 'bus-claudemd', x: 55, y: 190, w: 230, h: 100, tag: 'object', t: 'CLAUDE.md', s: 'native · auto-loaded · IS working memory' },
            { id: 'bus-bridge', x: 350, y: 80, w: 250, h: 84, tag: 'action', t: 'bridge the boundaries', s: 'phases · sessions · subagents' },
            { id: 'bus-declare', x: 350, y: 300, w: 250, h: 84, tag: 'action', t: 'declare intended work', s: 'updating it scopes EXECUTE' },
            { id: 'bus-forsubagents', x: 665, y: 190, w: 260, h: 100, tag: 'context', t: 'for the subagents', s: 'they carry no session context' }
        ],
        edges: [
            { from: 'bus-claudemd', to: 'bus-bridge', kind: 'soft', label: 'spans' },
            { from: 'bus-claudemd', to: 'bus-declare', kind: 'hard', label: 'gives teeth' },
            { from: 'bus-declare', to: 'bus-forsubagents', kind: 'soft', label: 'provisions' }
        ],
        stickies: [
            { x: 360, y: 200, text: 'The deepest framing: the bus controls the SEQUENCE of information entering the context that produces the next content.', aha: true,
              ref: { url: '../05_7-claude-md-hierarchy.html', section: 'The CLAUDE.md Hierarchy', blurb: 'Essay 5.7 — the working-memory form the phasic layer writes through.' } }
        ],
        navHints: { left: 'the Markov self-model', right: 'the hierarchy', down: 'why the bus has teeth' }
    },

    /* ---- detail 1,1 — why the bus has teeth ---- */
    '1,1': {
        kind: 'detail', step: null, eyebrow: 'detail · the bus has teeth',
        title: 'Memory and permission, one act',
        sub: 'Why updating a CLAUDE.md is more than note-taking: it builds the altered list that authorises EXECUTE, it provisions context-less subagents, and it stages the order of what gets read next.',
        boxes: [
            { id: 'd-altered', x: 55, y: 80, w: 260, h: 92, tag: 'gate', t: 'the altered list', s: 'declared dirs EXECUTE may write' },
            { id: 'd-nocontext', x: 55, y: 300, w: 260, h: 92, tag: 'context', t: 'subagents carry no context', s: 'the bus is their read surface' },
            { id: 'd-sequence', x: 375, y: 190, w: 240, h: 100, tag: 'action', t: 'controls the sequence', s: 'stages what is read next' },
            { id: 'd-notchat', x: 685, y: 190, w: 240, h: 100, tag: 'state', t: 'chat is not a memory form', s: 'transient · lossy at compaction' }
        ],
        edges: [
            { from: 'd-altered', to: 'd-sequence', kind: 'soft', label: 'scopes' },
            { from: 'd-nocontext', to: 'd-sequence', kind: 'soft', label: 'feeds' },
            { from: 'd-sequence', to: 'd-notchat', kind: 'soft', label: 'replaces chat' }
        ],
        stickies: [
            { x: 660, y: 70, text: 'You cannot edit a directory you did not first think about on paper — memory and write-scope are the same act.' }
        ],
        navHints: { up: 'the working-memory bus' }
    },

    /* ============================ SEQ 2 — the hierarchy ============================ */
    '2,0': {
        kind: 'seq', step: 3, eyebrow: 'the working-memory bus',
        title: 'A two-way split: always-on vs append-on-read',
        sub: 'The root files inject in every phase — the seed works in a room while knowing the whole house. Everything below is local memory surfaced on demand, and content flows UP at CONDENSE, never down by inheritance.',
        boxes: [
            { id: 'hier-root', x: 55, y: 80, w: 270, h: 86, tag: 'context', t: 'root files — injected always', s: 'identity · OPEVC · growth · caps' },
            { id: 'hier-local', x: 55, y: 300, w: 270, h: 86, tag: 'state', t: 'local — append on read', s: 'surfaced when you enter the dir' },
            { id: 'hier-universal', x: 390, y: 190, w: 230, h: 100, tag: 'gate', t: 'a CLAUDE.md wherever work happens', s: 'memory + the key to EXECUTE' },
            { id: 'hier-upward', x: 690, y: 190, w: 235, h: 100, tag: 'action', t: 'content flows UP at CONDENSE', s: 'never down by inheritance' }
        ],
        edges: [
            { from: 'hier-root', to: 'hier-local', kind: 'soft', label: 'the split' },
            { from: 'hier-local', to: 'hier-universal', kind: 'soft', label: 'the rule' },
            { from: 'hier-universal', to: 'hier-upward', kind: 'hard', label: 'at cycle close' }
        ],
        stickies: [
            { x: 350, y: 70, text: 'Like working in a room while knowing the whole house — the root self-model is always in context.', aha: true,
              ref: { url: '../05_7-claude-md-hierarchy.html', section: 'The CLAUDE.md Hierarchy', blurb: 'Essay 5.7 — the layered stack and how information rises through it.' } }
        ],
        navHints: { left: 'the working-memory bus', right: 'the lifecycle', down: 'the layers + asymmetry' }
    },

    /* ---- detail 2,1 — the layers + asymmetry ---- */
    '2,1': {
        kind: 'detail', step: null, eyebrow: 'detail · the layered stack',
        title: 'The stack, and who uses it',
        sub: 'Root + brain index auto-load; per-plugin and per-directory files surface on demand — including project trees outside .claude/. And the layer has an asymmetry: phasic plugins use it, always-on plugins mostly do not.',
        boxes: [
            { id: 'l-rootbrain', x: 50, y: 70, w: 310, h: 80, tag: 'object', t: 'root + brain index', s: 'auto-loaded · the whole house' },
            { id: 'l-perplugin', x: 50, y: 190, w: 310, h: 80, tag: 'object', t: 'per-plugin CLAUDE.md', s: 'concern · version · footers' },
            { id: 'l-perdir', x: 50, y: 310, w: 310, h: 80, tag: 'object', t: 'per-working-dir CLAUDE.md', s: 'project-local · same anchors' },
            { id: 'l-asymmetry', x: 470, y: 175, w: 400, h: 120, tag: 'context', t: 'the plugin–hierarchy asymmetry', s: 'phasic plugins USE it · always-on orthogonal' }
        ],
        edges: [
            { from: 'l-rootbrain', to: 'l-perplugin', kind: 'soft', label: 'below' },
            { from: 'l-perplugin', to: 'l-perdir', kind: 'soft', label: 'below' },
            { from: 'l-perdir', to: 'l-asymmetry', kind: 'soft', label: 'who writes it' }
        ],
        stickies: [
            { x: 470, y: 320, text: 'The phasic layer is the substrate’s user; the always-on layer is the enforcer (it keys on its own data.json).' }
        ],
        navHints: { up: 'the hierarchy' }
    },

    /* ============================ SEQ 3 — the lifecycle ============================ */
    '3,0': {
        kind: 'seq', step: 4, eyebrow: 'the working-memory bus',
        title: 'Four states: inflate, then deflate',
        sub: 'A single working-memory file cycles through four cognitive states — born before the work, kept current through it, enriched after it, then distilled at CONDENSE back to a clean body for the next cycle.',
        boxes: [
            { id: 'lc-proactive', x: 50, y: 170, w: 200, h: 96, tag: 'state', t: 'proactive', s: 'created BEFORE work' },
            { id: 'lc-active', x: 285, y: 170, w: 200, h: 96, tag: 'state', t: 'active', s: 'updated EVERY phase' },
            { id: 'lc-retroactive', x: 520, y: 170, w: 200, h: 96, tag: 'state', t: 'retroactive', s: 'updated AFTER work' },
            { id: 'lc-condensed', x: 755, y: 170, w: 175, h: 96, tag: 'state', t: 'condensed', s: 'distilled · knowledge migrates up' }
        ],
        edges: [
            { from: 'lc-proactive', to: 'lc-active', kind: 'hard', label: 'work begins' },
            { from: 'lc-active', to: 'lc-retroactive', kind: 'hard', label: 'work ends' },
            { from: 'lc-retroactive', to: 'lc-condensed', kind: 'hard', label: 'cycle close' },
            { from: 'lc-condensed', to: 'lc-proactive', kind: 'soft', label: 'next cycle' }
        ],
        stickies: [
            { x: 300, y: 320, text: 'Condensed is NOT archived — the file stays live with an enriched body. The footers inflate, then deflate back.', aha: true,
              ref: { url: '../../b6/06_7-condense.html', section: 'CONDENSE — The Cognitive Organ', blurb: 'Essay 6.7 — the phase that deflates the bus and routes its findings to durable homes.' } }
        ],
        navHints: { left: 'the hierarchy', right: 'the anchors' }
    },

    /* ============================ SEQ 4 — the anchors ============================ */
    '4,0': {
        kind: 'seq', step: 5, eyebrow: 'the working-memory bus',
        title: 'The four anchors hold it together',
        sub: 'Every CLAUDE.md anywhere carries the four ordered footer anchors. They are load-bearing — guards route writes by them — so the seed blocks anchorless creation and heals anchorless files it meets, never running on a broken one.',
        boxes: [
            { id: 'anc-four', x: 55, y: 190, w: 240, h: 100, tag: 'object', t: 'the four footer anchors', s: '---Ob--- ---Pl--- ---Ex--- ---Ve---' },
            { id: 'anc-loadbearing', x: 370, y: 80, w: 250, h: 84, tag: 'context', t: 'load-bearing', s: 'guards route writes by them' },
            { id: 'anc-birthblock', x: 370, y: 300, w: 250, h: 84, tag: 'gate', t: 'birth blocks anchorless', s: 'creation needs all four' },
            { id: 'anc-heal', x: 685, y: 190, w: 240, h: 100, tag: 'action', t: 'self-heal on edit or read', s: 'a met file gets them added' }
        ],
        edges: [
            { from: 'anc-four', to: 'anc-loadbearing', kind: 'hard', label: 'three mechanisms' },
            { from: 'anc-loadbearing', to: 'anc-birthblock', kind: 'soft', label: 'so creation' },
            { from: 'anc-four', to: 'anc-heal', kind: 'soft', label: 'a met file' }
        ],
        stickies: [
            { x: 660, y: 70, text: 'An anchorless file is unreachable — the failure that once hard-locked the seed out of its own planned fix.', aha: true,
              ref: { url: '../05_7-claude-md-hierarchy.html', section: 'The CLAUDE.md Hierarchy', blurb: 'Essay 5.7 — the anchors and why the seed defends them in depth.' } }
        ],
        navHints: { left: 'the lifecycle', right: 'three durable surfaces', down: 'birth-block vs self-heal' }
    },

    /* ---- detail 4,1 — birth-block vs self-heal ---- */
    '4,1': {
        kind: 'detail', step: null, eyebrow: 'detail · make vs meet',
        title: 'Block what you make, heal what you meet',
        sub: 'The anchor invariant is defended at two moments. A file the seed MAKES without anchors is rejected; a file it MEETS without anchors is healed in place — but anchors out of order block rather than reorder.',
        boxes: [
            { id: 'h-birthvalidate', x: 55, y: 90, w: 250, h: 92, tag: 'gate', t: 'make → validate (block)', s: 'creation without four = rejected' },
            { id: 'h-heal', x: 370, y: 190, w: 240, h: 100, tag: 'action', t: 'meet → heal (add)', s: 'canonical-position insertion' },
            { id: 'h-bootstrap', x: 685, y: 80, w: 240, h: 92, tag: 'object', t: 'the PostToolUse net', s: 'catches condense/gmode/subagent' },
            { id: 'h-outoforder', x: 685, y: 300, w: 240, h: 92, tag: 'gate', t: 'out-of-order → block', s: 'reorder is destructive' }
        ],
        edges: [
            { from: 'h-birthvalidate', to: 'h-heal', kind: 'soft', label: 'make vs meet' },
            { from: 'h-heal', to: 'h-bootstrap', kind: 'soft', label: '+ write net' },
            { from: 'h-heal', to: 'h-outoforder', kind: 'soft', label: 'but never reorder' }
        ],
        stickies: [
            { x: 360, y: 330, text: 'The anchors are a derivable structural fact, not user state — so the guard restores them rather than refusing the file.' }
        ],
        navHints: { up: 'the anchors' }
    },

    /* ============================ SEQ 5 — three durable surfaces ============================ */
    '5,0': {
        kind: 'seq', step: 6, eyebrow: 'the working-memory bus',
        title: 'Three durable surfaces',
        sub: 'The transient brain deflates each cycle and routes what is worth keeping up into two permanent stores: knowledge/, the unbounded topic-siloed cognition, and memory/, the narrow cross-project store of operator rules.',
        boxes: [
            { id: 'surf-brain', x: 55, y: 190, w: 230, h: 96, tag: 'state', t: 'the brain — transient', s: 'deflates each cycle · bounded' },
            { id: 'surf-condense', x: 360, y: 190, w: 220, h: 96, tag: 'action', t: 'condense upward', s: 'route findings to durable homes' },
            { id: 'surf-knowledge', x: 685, y: 75, w: 240, h: 90, tag: 'object', t: 'knowledge/ — unbounded', s: 'topic silos · no word cap' },
            { id: 'surf-memory', x: 685, y: 305, w: 240, h: 90, tag: 'object', t: 'memory/ — narrow', s: 'home-dir · crosses projects' }
        ],
        edges: [
            { from: 'surf-brain', to: 'surf-condense', kind: 'soft', label: 'deflates' },
            { from: 'surf-condense', to: 'surf-knowledge', kind: 'hard', label: 'by topic' },
            { from: 'surf-condense', to: 'surf-memory', kind: 'hard', label: 'by guidance-kind' }
        ],
        stickies: [
            { x: 360, y: 320, text: 'The durability stack: brain (deflates each cycle) → knowledge (grows monotonically) → memory (narrow by design).', aha: true,
              ref: { url: '../../b8/08_3-brain-after-three-months.html', section: 'What Lives in the Brain After Three Months', blurb: 'Essay 8.3 — what accumulates across the three durable layers over many cycles.' } }
        ],
        navHints: { left: 'the anchors', right: 'size limits + forgetting', down: 'the multi-form substrate' }
    },

    /* ---- detail 5,1 — the multi-form substrate ---- */
    '5,1': {
        kind: 'detail', step: null, eyebrow: 'detail · plural forms',
        title: 'No single form serves every memory',
        sub: '.claude/ ships several distinct memory forms on purpose — knowledge, hidden state, voices, agent defs, registration, the CLAUDE.md hierarchy. The one place memory does not live is chat. And memory/ is editable in any phase.',
        boxes: [
            { id: 'mf-plural', x: 55, y: 190, w: 235, h: 100, tag: 'context', t: '.claude/ ships plural forms', s: 'no one form fits every kind' },
            { id: 'mf-forms', x: 360, y: 75, w: 290, h: 86, tag: 'object', t: 'the forms', s: 'knowledge · data.json · voice.xml · agents/' },
            { id: 'mf-notchat', x: 360, y: 305, w: 290, h: 86, tag: 'state', t: 'except the chat session', s: 'capped · lossy → why brain_guard exists' },
            { id: 'mf-phaseexempt', x: 710, y: 190, w: 215, h: 100, tag: 'gate', t: 'memory/ is phase-exempt', s: 'native tool kept working' }
        ],
        edges: [
            { from: 'mf-plural', to: 'mf-forms', kind: 'hard', label: 'the forms' },
            { from: 'mf-plural', to: 'mf-notchat', kind: 'soft', label: 'except' },
            { from: 'mf-forms', to: 'mf-phaseexempt', kind: 'soft', label: 'memory/' }
        ],
        stickies: [
            { x: 690, y: 75, text: 'The seed’s cognition is an ADDITION to the base harness, never a replacement — so no phase guard may block the native memory tool.' }
        ],
        navHints: { up: 'three durable surfaces' }
    },

    /* ============================ SEQ 6 — size limits + forgetting ============================ */
    '6,0': {
        kind: 'seq', step: 7, eyebrow: 'the working-memory bus',
        title: 'Size caps, and the forgetting discipline',
        sub: 'Five soft word caps make file size a forcing function for reorganization — discipline, not code, with one hard-gated exception. When a cap is approached, overflow is MOVED to a durable home, never deleted.',
        boxes: [
            { id: 'sz-caps', x: 55, y: 190, w: 230, h: 100, tag: 'gate', t: 'five soft word caps', s: '3500 · 800 · 2000 · 400 · 500' },
            { id: 'sz-discipline', x: 350, y: 80, w: 250, h: 84, tag: 'context', t: 'discipline, not code', s: 'CONDENSE.compress re-routes' },
            { id: 'sz-evolutioncap', x: 665, y: 80, w: 260, h: 84, tag: 'gate', t: 'evolution-cap — one hard gate', s: '2000w · the sole code-gated cap' },
            { id: 'sz-move', x: 350, y: 300, w: 250, h: 84, tag: 'action', t: 'overflow is MOVED', s: 'forget by relocating, not dropping' }
        ],
        edges: [
            { from: 'sz-caps', to: 'sz-discipline', kind: 'soft', label: 'enforced by' },
            { from: 'sz-discipline', to: 'sz-move', kind: 'soft', label: 're-routes' },
            { from: 'sz-caps', to: 'sz-evolutioncap', kind: 'soft', label: 'one exception' }
        ],
        stickies: [
            { x: 640, y: 300, text: 'The brain shrinks to stay legible while the knowledge it sheds lands somewhere permanent — growth by pruning, nothing lost.', aha: true,
              ref: { url: '../../b8/08_7-brain-stops-growing.html', section: 'The Brain Stops Growing in Size', blurb: 'Essay 8.7 — the forgetting discipline: move the right things, do not discard them.' } }
        ],
        navHints: { left: 'three durable surfaces', down: 'routes + two axes' }
    },

    /* ---- detail 6,1 — forgetting routes + two axes ---- */
    '6,1': {
        kind: 'detail', step: null, eyebrow: 'detail · routes + two axes',
        title: 'Where overflow goes, and the two hard gates',
        sub: 'Each kind of overflow has a named home, and the routing runs during the cycle — never retroactively. Two hard gates guard two different axes: a deflation RATIO and an absolute WORD count. Both true, no contradiction.',
        boxes: [
            { id: 'f-routes', x: 55, y: 90, w: 260, h: 92, tag: 'action', t: 'the named routes', s: 'root→skills · plugin→knowledge · finding→hook' },
            { id: 'f-during', x: 375, y: 190, w: 230, h: 100, tag: 'context', t: 'runs during the cycle', s: 'operator routes · never retroactive' },
            { id: 'f-deflation', x: 685, y: 80, w: 240, h: 92, tag: 'gate', t: 'deflation gate — ratio axis', s: '≥80% absorption at commit' },
            { id: 'f-evolution', x: 685, y: 300, w: 240, h: 92, tag: 'gate', t: 'evolution-cap — count axis', s: '2000w absolute' }
        ],
        edges: [
            { from: 'f-routes', to: 'f-during', kind: 'soft', label: 'when' },
            { from: 'f-deflation', to: 'f-during', kind: 'soft', label: 'enforced at commit' },
            { from: 'f-deflation', to: 'f-evolution', kind: 'soft', label: 'two axes' }
        ],
        stickies: [
            { x: 55, y: 300, text: 'Destinations are content-determined, not a priority ladder — the same D2 principle as the CONDENSE waterfall.' }
        ],
        navHints: { up: 'size limits + forgetting' }
    }
};
