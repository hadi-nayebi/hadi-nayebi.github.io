# Hadosh Academy Canonical Abstraction Library

**Status:** draft public context seed

**Audience:** people building their own harnesses and the agents helping them

**Scope:** framework-, provider-, model-, and CLI-agnostic definitions

## Purpose

The library gives people and agents one shared meaning for each concept used to understand or build a harness. It does not prescribe one implementation. A definition describes how a concept should be interpreted; each local harness decides how that meaning becomes files, software, permissions, interfaces, or behavior.

The structured source is [`data/abstraction-library.json`](../data/abstraction-library.json). The public index and individual term pages are generated from that source.

## One canonical object: a term

Every term contains only:

- a name and stable URL;
- one definition of no more than 500 words;
- one state: `draft` or `consolidated`; and
- the open questions that prevent consolidation.

The definition is the complete canonical context block. Do not divide its meaning among separate role, boundary, relationship, evidence, adaptation, or avoidance sections. If a distinction matters, state it inside the definition.

## Two states

- **Draft** means the definition is usable as a working hypothesis but remains open to revision.
- **Consolidated** means Hadi has accepted the definition as shared context for new work and no definition questions remain open.

If later evidence exposes a genuine ambiguity, a consolidated term may return to draft. Comments do not change state automatically.

## Discussion and consolidation

Each term has its own public page and pathname-mapped GitHub Discussion. The loop is:

1. publish the clearest current definition as a draft;
2. expose the questions the definition cannot yet answer;
3. collect comments, counterexamples, proposed wording, and privacy-safe implementation evidence;
4. review the contributions;
5. revise the definition and remove or sharpen resolved questions; and
6. mark the term consolidated only after Hadi accepts it and its open-question list is empty.

Discussion is evidence, not authority. Accepted learning becomes canonical only through a reviewed update to the structured source.

## Use inside a harness

An agent should load only the terms relevant to the responsibility being designed. For each term:

1. read the definition exactly as shared context;
2. check its state;
3. treat a draft definition as provisional and preserve its open questions;
4. use a consolidated definition as the Academy meaning of that concept; and
5. translate the meaning into mechanisms supported by the selected runtime and the user's decisions.

For example, the LLM definition tells a harness to treat the LLM as probabilistic, replaceable model capability rather than as the agent, durable memory, or authority. The local implementation may vary, but it should not silently collapse those distinctions.

The library is therefore a context seed: it aligns interpretation before implementation while leaving the mature harness open to the user, responsibility, and runtime.

## Editing

Update `data/abstraction-library.json`, then run:

```bash
node scripts/render-abstraction-library.mjs
node scripts/validate-abstraction-library.mjs
```

Do not hand-edit the generated HTML pages under `agents/abstractions/`.
