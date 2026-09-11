---
title: "The Two-Layer Foundation"
date: "May 14, 2026"
slug: "the-two-layer-foundation"
read_time: "8 min"
tags: [Architecture, Seed Agent, Plugins, Information Bus]
status: published
version: v0.6.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-plugins-b5-1.png"
---

# The Two-Layer Foundation

*Essay 5.1 — The Always-On Digital Cortex, Part 1 of 9. Essay 5 opens here; Parts 2 through 9 follow.*

---

For four essays we have circled the claim that the agent is its filesystem. Now we open one working filesystem and examine how its parts cooperate.

[Essay 4](../b4/04-the-language-of-agents.html) introduced project instructions — including `CLAUDE.md` — as one part of an agent's harness. Claude Code natively loads project instructions from either `./CLAUDE.md` or `./.claude/CLAUDE.md`; it also uses `.claude/` for project configuration such as hooks, agents, skills, and rules. It does **not** automatically treat every file below `.claude/` as instructions. The harness must connect those other files to runtime behavior. The historical Claude-based reference architecture behind this series makes that connection and fills the directory like this: *[ref: claude-code-project-instructions-and-prototype-boundary | https://code.claude.com/docs/en/memory plus private historical prototype review | Official Claude Code documentation supports the project-instruction locations and loading behavior. The additional architecture claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

That distinction matters. This essay describes two behavioral groups inside an earlier Claude-based reference architecture. It is a concrete architecture we can inspect, not a claim that every agent has exactly these two layers, and not a specification of the current public Q-Seed. The durable principle is broader: give each form of cognition and control a suitable home, then define the interfaces through which those homes cooperate. *[ref: implementation-maturity-boundary | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

```
your-project/
├── CLAUDE.md                ← project instructions: identity and operating rules
└── .claude/                 ← Claude Code project configuration + reference brain
    ├── CLAUDE.md            ← project instructions and brain index
    ├── context/             ← canonical vocabulary: the design's ground-truth glossary
    ├── knowledge/           ← long-term memory, organized by topic
    ├── plugins/             ← the agent's reflexes and disciplines
    ├── agents/              ← specialist sub-agents
    ├── jobs/                ← per-job run history (compaction files, session logs, plans)
    └── settings.local.json  ← Claude Code's hook registry
```

That tree is the substrate. Plural forms — folders, files, scripts, narratives — because no single form serves every role in cognition and control. Topical recall needs different machinery than a procedural reflex. Human-readable knowledge can live in Markdown; machine state can live in guarded JSON; deterministic reactions can live in hooks and scripts. A mature plugin may also carry a `voice.xml` of contextual coaching and an `evolution.md` narrative of how the plugin grew. These are related forms, but they are not interchangeable and they do not all enter the model's context in the same way. *[ref: prototype-uses-distinct-cognitive-forms | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The deeper move is representing different forms of cognition in forms suited to their jobs, so the seed agent can bring the right context and controls to the work it is currently doing. As you customize your own seed agent, you will invent compartments that fit your work, your roles, and your professional context. A lawyer's durable matter history, a researcher's source ledger, and a developer's test gate do not need the same storage shape merely because all three contribute to thinking. *[ref: cognition-uses-multiple-forms | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The chat session still matters: its context window is the model's immediate working field. But the reference architecture does not use that window as the canonical home for anything that must survive reliably. Context is finite, and compaction turns earlier conversation into a summary. Durable knowledge, decisions, job state, and recovery pointers live on disk; `brain_guard` manages the handoff by sealing a structured compaction file before clearing and rebuilding the session. The distinction is between *working context* and *durable source of truth*, not between useful memory and no memory. *[ref: working-context-versus-durable-state | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

**Within this reference architecture, two plugin groups run above this substrate.** They sit inside the broader cognitive layer described in Essay 4; they do not replace the model, runtime, tools, or job layer around them.

The **always-on layer** owns phase-independent infrastructure. “Always-on” means its responsibilities remain active across the job cycle, not that every plugin fires on every event. The hook registry attaches each control where it belongs: job handling to prompts and stop attempts, edit safety to relevant tool calls, context protection to selected tool and session events, interaction summaries to their thresholds, and question discipline to question events. Together they lock the substrate for safe edits, manage the context window, structure jobs, summarize long conversations, and gate how the agent asks questions. *[ref: phase-independent-hooks-are-event-specific | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The **phasic layer** activates one operating mode at a time, dictated by the focused job's phase, while the phase-independent controls continue underneath. The reference architecture's cycle is called OPEVC — observe, plan, execute, verify, condense — and its guards give each phase a different working boundary. OBSERVE and PLAN investigate and shape phase-scoped working memory without implementing the project. EXECUTE changes an approved set of project paths. VERIFY reads and runs approved checks while recording findings, sending defects backward instead of repairing them in place. CONDENSE absorbs durable lessons into controlled `.claude/` surfaces and closes the cycle. Each phase has narrow exceptions for its own memory and transition machinery, which [Essay 6](../b6/06_1-phasic-foundation.html) opens in detail. *[ref: opevc-boundaries-and-exceptions | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

Both groups are built from smaller plugins, each organized around one primary concern. The architecture's value is what those focused plugins **compose** into — ceremonies no plugin could perform alone. A plugin can have several supporting functions without losing its focus; the test is whether those functions serve one responsibility or quietly create a second center of authority. *[ref: plugins-have-one-primary-concern | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

We tour the always-on layer first because it surrounds everything else.

![Image 5.1. Two plugin layers, one multi-form substrate — the phasic layer writes through the CLAUDE.md hierarchy and absorbs at cycle close; the always-on layer runs alongside, phase-independent.](images/always-on-plugins-b5-1.png)

<!-- RAW_HTML -->
<aside class="explore-callout" style="margin: 2rem 0; padding: 1.1rem 1.3rem; border-radius: 10px; background: linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10)); border: 1px solid rgba(139,92,246,0.30); display: flex; flex-wrap: wrap; align-items: center; gap: 0.9rem; justify-content: space-between;">
  <span style="font-size: 0.92rem; line-height: 1.5; color: rgba(255,255,255,0.82);"><strong>Interactive diagram.</strong> Walk the plugin population as a deck &mdash; the two layers split by <em>when</em> they fire, the live roster (active plugins, unimplemented designs, the shared <code>lib/</code> tier), and the two always-on plugins drawn deep: <code>interaction_summary</code> (mega-prompt compression) and <code>question_discipline</code> (the prefix gate). Click any box for the live code behind it.</span>
  <a href="explore/plugin-population.html" title="Open the interactive plugin-population walkthrough" style="flex: none; display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.5rem 0.9rem; font-size: 0.85rem; font-weight: 700; line-height: 1; color: #ffffff; text-decoration: none; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6)); border: 1px solid rgba(255,255,255,0.35); border-radius: 8px; box-shadow: 0 4px 16px rgba(99,102,241,0.5);">&#8599; Walk the plugin population</a>
</aside>
<!-- /RAW_HTML -->

## The journey ahead

Essay 5 splits into nine short sub-essays:

- **Essay 5.1 — The Two-Layer Foundation** *(you are here)* — the substrate + the two layers + this map
- [Essay 5.2 — Plugin Edit Safety — `plugin_integrity`](05_2-plugin-integrity.html) — the test gate
- [Essay 5.3 — Context Window Discipline — `brain_guard`](05_3-brain-guard.html) — the progressive squeeze
- [Essay 5.4 — Job Lifecycle — `job_core`](05_4-job-core.html) — the unit of compartmentalization
- [Essay 5.5 — Mega-Prompt Compression — `interaction_summary`](05_5-interaction-summary.html) — keeps the dynamic mega-prompt legible
- [Essay 5.6 — Structured Questions — `question_discipline`](05_6-question-discipline.html) — the prefix registry
- [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — the working-memory substrate form the phasic layer writes through
- [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — three single-concern plugins composed into one ceremony
- [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the gate that decides when plugin-code edits and new-plugin births are admitted at all

Essays 5.2 through 5.6 deep-dive the always-on plugins, one each. Essay 5.7 covers the substrate form the phasic layer USES. Essays 5.8 and 5.9 are for the architects in the audience — how single-concern plugins compose into emergent ceremonies, and how the operator gates substrate edits.

The phasic plugins get their own series in [Essay 6](../b6/06_1-phasic-foundation.html). The cell template that lets new plugins be born safely is [Essay 7](../b7/07_1-plugin-kit-foundation.html). The four-stage arc from your first job to your first custom plugin is [Essay 8](../b8/08_1-apprentice-to-architect-foundation.html).

---

## Why "Single Concern" Matters

Each phase-independent plugin owns one primary concern. That phrase is architectural discipline, not a claim that the implementation contains only one function. *[ref: phase-independent-plugin-objectives | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

`plugin_integrity` owns plugin edit safety. Its preferred close-out command runs the plugin's tests: a pass commits and closes the lock; a failure preserves the working tree so the agent can repair it. Its defensive `safe-lock` path is different: when an out-of-scope action trips the backstop, failed tests restore the protected checkpoint and record the revert. The same plugin also gates *whether* plugin-code edits and new-plugin births may begin, a responsibility opened in [Essay 5.9](05_9-customization-guardrail.html). *[ref: plugin-integrity-has-active-and-defensive-closeout | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

`brain_guard` owns context-window protection. It monitors several pressure signals and, at the relevant boundary, seals a structured compaction file before a clear-and-inject wake so the next session can rebuild from durable state rather than depend on a lossy conversational tail. `job_core` owns the job lifecycle — what the agent is working on, which phase that work is in, and whether outstanding obligations block stopping. `interaction_summary` maintains a cumulative summary chain for the focused job when unsummarized interactions cross its threshold. `question_discipline` owns the asking gate — every structured question the reference architecture sends through `AskUserQuestion` must use a registered prefix and the required fields for that question type. *[ref: five-phase-independent-plugin-responsibilities | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]* Different concerns, one shared discipline: each plugin stays inside its scope and uses published gateways rather than directly reading or editing another plugin's guarded state.

Each plugin lives in its own folder under `.claude/plugins/<name>/`. A mature cell can carry its own instructions, hooks, scripts, guarded state, tests, documentation, and voice files; a smaller plugin need not fill every slot before it is useful. Naming the concern remains easy because the cell has one primary responsibility to name. *[ref: plugin-cell-convention | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The single-concern principle is a *minimize* rule, not an *eliminate* rule. Pure isolation is what a traditional library aims for — clean modules with no shared state, talking to nothing they don't import. The seed agent is a complex cognitive system, and a small amount of structured coupling between plugins is what lets the parts compose into ceremonies larger than any one plugin. Call this **single-concern + careful coupling**: each part stays narrow; the composition is what makes the ceremony possible. *[ref: single-concern-principle-minimize-rule | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The historian ratchet inside `plugin_integrity` is a clean example. `question_discipline` recognizes the `[PLUGIN-LOCK]` question shape. `job_core` can supply durable job-level authorization for plugin work. The lock manager owns the concrete unlock answer, checks whether the target's evolution narrative has fallen behind, and, when needed, requires the plugin's historian before opening the cell. The active-lock and safe-lock paths then protect the edit through its test boundary. Single-concern plugins compose into one ceremony, each contributing what it owns. We deconstruct this composition in [Essay 5.8](05_8-historian-ratchet.html); the cell-anatomy view that lets new plugins compose this way is in [Essay 7](../b7/07_1-plugin-kit-foundation.html). *[ref: historian-ratchet-composition | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The shape is not unique to software. A real-estate transaction closes the same way — the buyer's agent, the listing agent, the escrow officer, the title underwriter, the lender, and the inspector each own one narrow concern, never reach into each other's files, and coordinate strictly through published documents (purchase agreement, title commitment, loan estimate) on a shared timeline; the closing is a ceremony none of them could perform alone, made possible by exactly the same single-concern + careful coupling pattern.

The discipline is in *how* the coupling happens. When plugins talk to each other, they use published interfaces — small command-line gateways (`job.sh focused` is the canonical read-only example), a shared registry of question prefixes, named voice handles, and the four-footer protocol that organizes the working-memory bus. The runtime guards block the agent's direct reads and edits of guarded `data.json` files, making the gateway the normal route. That is practical isolation, not a mathematical sandbox: a plugin author with operating-system access can still write code that reaches across the boundary. The architecture reduces accidental coupling and makes deliberate coupling reviewable; it cannot replace the author's responsibility to respect the contract. *[ref: coupling-through-gateways-and-guarded-state | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

The shape buys three concrete things. First, plugins can evolve with a smaller blast radius: if `interaction_summary` depends on the published `job.sh` interface rather than `job_core` internals, most changes inside `job_core` remain irrelevant to it. Stable interfaces reduce breakage; they do not eliminate the need for integration checks. Second, plugins are testable in focused isolation because their test suites can substitute narrow dependencies instead of standing up the whole seed. Third, plugins are addable: a sixth phase-independent plugin can publish its own gateway and register the hook events or shared prefixes it needs without rewriting another plugin's private implementation. *[ref: smaller-blast-radius-focused-tests-and-registration | private historical prototype review | The claim was checked against a private historical prototype; identifying repository, revision, source paths, and unpublished evidence details are omitted from this public record.]*

This is why the essay revisits the filesystem after naming its parts. The folders are not valuable because there are many of them. They are valuable because each preserves a boundary the reader can reason about: working context versus durable truth, state versus instruction, primary responsibility versus composition, public interface versus private implementation. The two plugin groups are the first map through this reference architecture. The deeper architecture is the set of boundaries that lets the map change without turning the whole system into one inseparable mechanism.

---

We start with `plugin_integrity`.

---

*Essay 5.1 — The Always-On Digital Cortex, Part 1 of 9.*

*Previous: [Essay 4 — The Language of Agents](../b4/04-the-language-of-agents.html) — vocabulary that prepares the architecture.*
*Next: [Essay 5.2 — Plugin Edit Safety — `plugin_integrity`](05_2-plugin-integrity.html) — first of the always-on plugin deep-dives.*
