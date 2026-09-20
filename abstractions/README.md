# Hadosh Academy Canonical Abstraction Library

**Status:** [draft] public seed  
**Audience:** people building their own harnesses and the agents helping them  
**Scope:** framework-, provider-, model-, and CLI-agnostic architectural context

## Purpose

This library defines the shared language and reusable behavioral contracts for building local, inspectable, recoverable, user-owned AI harnesses.

It is not a complete harness, an installer, or a universal repository layout. It is an agent-readable design layer. An agent combines this context with:

- the user's work, language, judgment, risk, and authority;
- the capabilities and constraints of the selected runtime;
- evidence from the user's existing tools and files; and
- the smallest useful behavior the user wants to make durable.

The resulting harness belongs to that user and may differ substantially from every public Hadosh Academy project.

## The seed model

The Academy supplies a seed of shared context. The seed names stable distinctions, defines behavioral objectives, and shows how components can compose. It becomes specific only through local work.

A normal development path is:

1. read the smallest relevant canonical terms;
2. select one behavioral pattern;
3. translate it into the user's runtime and vocabulary;
4. implement the smallest inspectable realization;
5. test it through real work;
6. preserve corrections and evidence locally;
7. generalize only privacy-safe lessons that survive comparison.

A seed can mature into instructions, files, jobs, tests, hooks, plugins, interfaces, services, or other software forms. The mature form is not prescribed in advance.

## Two kinds of canonical objects

### Terms

A term establishes shared meaning. It explains what an architectural concept is, the role it plays, its boundaries, and its relationship to other concepts.

Terms should normally remain under 500 words. The limit forces semantic precision and keeps them usable inside agent context. A term that needs extensive operational logic should link to one or more behavioral patterns rather than absorb them.

### Behavioral patterns

A pattern defines reusable logic for a bounded behavior. It states the objective, state, decisions, authority, failure handling, recovery, and verification without prescribing one runtime mechanism.

The same pattern may be realized through a job rule, instruction, hook, plugin, service, state machine, protected branch, dashboard control, or another mechanism. A runtime-specific implementation is evidence and an adapter—not the canonical pattern itself.

## Definition states

- **[draft]** — a candidate meaning or pattern under discussion. Agents may use it as a hypothesis but must not present it as settled Academy context.
- **[consolidated]** — explicitly aligned with Hadi and canonical until a later ruling changes it.

Definition state is separate from evidence and implementation state. A consolidated concept can describe a target architecture that has not yet been built. A demonstrated mechanism can also expose a term that remains conceptually unsettled.

## Evidence and realization labels

Each canonical object should identify relevant labels without collapsing them into the definition state:

- **conceptual** — reasoned architectural claim;
- **observed** — seen in one implementation or use case;
- **compared** — examined across more than one independent realization;
- **demonstrated** — verified in a named implementation;
- **reusable** — supported strongly enough to guide new adaptations;
- **current / target / research** — whether a named realization exists now, is an accepted design direction, or remains investigational.

## Minimum term anatomy

Every substantial term should contain:

1. **Definition** — the shortest precise meaning.
2. **Role in the harness** — why the distinction matters.
3. **Boundary and invariants** — what the term includes, excludes, and must not silently absorb.
4. **Relationships** — links to the canonical terms and patterns it composes with.
5. **Adaptation questions** — what an agent must learn from the user or runtime.
6. **Evidence and realization** — what supports the definition and what remains unimplemented.
7. **Avoid** — misleading aliases, collapsed distinctions, and common overclaims.

Each canonical fact has one home. Other pages link to it instead of restating competing definitions.

## Minimum behavioral-pattern anatomy

Every pattern should contain:

1. behavioral objective and user value;
2. problem and triggering conditions;
3. inputs and outputs;
4. owned state and source of truth;
5. decisions, transitions, and termination conditions;
6. authority, permissions, and protected actions;
7. soft guidance versus deterministic enforcement;
8. dependencies, incompatibilities, and composition interfaces;
9. failure modes, recovery, and rollback;
10. verification and acceptance evidence;
11. adaptation questions for the user and runtime;
12. known implementations, counterexamples, and maturity.

See [the pattern contract](pattern-contract.md).

## Canonical clusters

The initial library is expected to grow through coherent clusters rather than one enormous glossary:

- foundations: model, LLM, runtime, harness, agent, agency, local, user-owned, context, seed;
- state and cognition: instruction, memory, working memory, durable knowledge, state, job, objective, decision, evidence;
- authority and safety: capability, permission, authority, protected action, verification, recovery, privacy, provenance;
- mechanisms: tool, interface, dashboard, plugin, lifecycle control, event, trigger, gate, guard, state transition;
- composition: compartment, boundary, dependency, invariant, interface contract, adapter, implementation;
- maturation: pattern, component, crystallization, consolidation, lineage, field evidence, deprecation.

A cluster is created only when there is enough evidence and discussion to justify a coherent vocabulary. Empty taxonomy is not progress.

## Translation into a local harness

An agent using this library should:

1. identify the user's actual responsibility and desired outcome;
2. retrieve only the terms and patterns relevant to that responsibility;
3. explain the intended behavior in the user's language;
4. inspect the target runtime before choosing mechanisms;
5. propose a small composition with explicit authority and recovery;
6. wait for approval before consequential changes;
7. implement and verify locally;
8. record how the canonical pattern was adapted and where it intentionally differs.

The library defines the logic. Runtime projects such as Origin, Seed Agent, and Q-Seed provide evidence and possible adapters. None is the mandatory final form.

## Human legibility

This context is written primarily so agents can build more reliably, but the architecture must remain explainable to a nontechnical user. An agent should translate a term into the user's own work, show where it exists in the local harness, and make the user's intervention points visible.

Technical implementation may be delegated. Architectural authority may not be hidden.

## Privacy and contribution

Local experience does not automatically become public context. Before returning a lesson to the Academy, separate the reusable pattern from personal, employer, client, proprietary, regulated, credential, and third-party material. External contributions are evidence, not authority. Consolidation remains a reviewed decision.


## Public term pages and discussion loop

The public library lives above the runtime-specific agents at [`/agents/abstractions/`](../agents/abstractions/). Every term has its own generated page and pathname-mapped GitHub Discussion.

The canonical structured source is `data/abstraction-library.json`. Public HTML pages are generated from it so the human definition, agent-readable data, open questions, and maturity state cannot drift into competing sources.

The maturation loop is:

1. publish the clearest current definition as `draft`;
2. expose genuine unresolved questions on that term's page;
3. collect privacy-scrubbed critique, answers, counterexamples, and implementation evidence;
4. reabsorb accepted learning through a reviewed source change;
5. remove or replace questions the definition can now answer; and
6. mark the term `consolidated` only after Hadi accepts it and no definition questions remain open.

Comments are evidence, not automatic authority. Categories organize discovery but remain open to addition, splitting, merging, and renaming.
