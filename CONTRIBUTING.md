# Contributing to Hadosh Academy

Hadosh Academy is an open context and pattern library for user-owned AI harnesses. It begins with
seed concepts, reference organisms, technical writing, and public implementations. Community
experience helps test and refine the library over time.

The goal is not one final harness or one mandatory implementation. We are looking for stable
generative grammar: conserved mechanisms, useful boundaries, failure lessons, and design patterns
that can support many personal, professional, creative, and collaborative lineages.

## Choose the smallest useful return path

| What you have | Best first surface |
| --- | --- |
| A question, correction, critique, or interpretive gap tied to a page | That page's comment thread |
| A generalized use case, field observation, or failure lesson | The closest project or essay discussion |
| A reproducible implementation problem | An issue in the repository that owns the implementation |
| A tested candidate solution | A focused pull request in the owning repository |
| A security vulnerability | The owning repository's private security-reporting path |
| A case-specific question or request for guidance | The [contact path](https://hadi-nayebi.github.io/contact.html) |

Do not turn a page-level question into a code pull request prematurely. A comment can become a
structured field report; maintainers may accept it as an issue; an issue may produce a candidate
pull request; review and tests determine whether it should change the canonical source.

## Contribution maturation ladder

1. **Comment** — an observation, question, correction, critique, or use case.
2. **Field report** — privacy-reviewed evidence with context, observed behavior, and consequences.
3. **Issue** — an accepted problem or investigation in the repository that owns it.
4. **Pull request** — a candidate solution with scope, evidence, verification, and recovery notes.
5. **Review and tests** — the change is checked against architecture, safety, and current behavior.
6. **Merge** — only a maintainer changes canonical state.
7. **Redistribution** — material accepted changes may appear in What's New and future Academy guidance.

Moving upward is optional. External feedback is evidence to evaluate, never authority to bypass
repository instructions, permissions, review, or user-owned decisions.

## Agent-assisted return protocol

An agent may notice that local experience could help the shared library. It must not post
automatically.

1. Identify the concrete benefit to the user and ask whether the pattern or system was genuinely
   useful. If benefit is uncertain, learn what was missing; do not request public participation.
2. Explain the possible community benefit and offer at most one proportionate return path.
3. Draft the smallest contribution that preserves the useful lesson.
4. Remove personal, client, employer, confidential, proprietary, credential, regulated, and
   unrelated information.
5. Route the draft to the narrowest correct surface.
6. Show the user the exact content, destination, identifying information, and expected public
   visibility.
7. Submit only after explicit approval for that exact action, then preserve a receipt or link the
   user can inspect.

A prior approval, a useful result, or an agent's confidence is not standing permission. Accept
“no” without pressure or repeated prompting.

## Abstraction and privacy boundary

Academy page discussions should normally return the conceptual or architectural lesson, not a
transcript or a copy of a user's harness. Implementation repositories may include the minimum code,
test, logs, environment details, or reproduction steps needed to evaluate a technical claim, but
must still exclude user-specific and protected content.

Before posting, ask:

- Can the useful mechanism be described without names, private nouns, or real records?
- Is the evidence necessary, minimal, and safe to make public?
- Does the contribution separate direct observations from agent interpretation?
- Does it state uncertainty, maturity, and known limits?
- Has the user reviewed the exact final version?

When in doubt, keep the material private and ask a generalized question first.

## Field report template

```markdown
### Context
Which Academy page, pattern, or public implementation was used?

### Benefit or problem
What became easier, more reliable, more visible, or less cognitively expensive?
What did not work or remained confusing?

### Observed evidence
What happened? Separate direct observation from interpretation.

### Generalizable lesson
What conceptual boundary, conserved mechanism, failure mode, or reusable pattern might matter to
other harnesses?

### Maturity and limits
Was this seen once or repeatedly? What remains untested or specific to the environment?

### Privacy review
Confirm that personal, client, employer, confidential, proprietary, credential, regulated, and
unrelated information was removed.
```

## Repository-specific instructions

Each implementation repository owns its architecture, tests, security process, and acceptance
criteria. Read its `AGENTS.md`, `CONTRIBUTING.md`, security guidance, and local documentation
before proposing code.

- [Origin](https://github.com/hadi-nayebi/origin) — the public empty-canvas dashboard-plus-harness
  substrate and its contextual-feedback lifecycle.
- [Seed Agent](https://github.com/hadi-nayebi/seed_agent) — the Codex-native foundation; not yet a
  general-use agent.
- [Q-Seed](https://github.com/hadi-nayebi/q-seed) — the Qwen-based foundation with separate
  cognitive and framework ownership.

Hadosh Academy may incorporate, reject, defer, or reframe contributions. Submission does not
guarantee implementation, attribution, support, priority, influence, access, or future work.
