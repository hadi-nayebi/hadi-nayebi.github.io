# Essay 1 review: LLMs Are Not the Agents

## TLDR

The electricity-and-toaster argument, “the agent is the filesystem,” the
random-walk problem, OPEVC, hooks, portability, compartmentalization, and the
closing call to build the toaster remain the essay's narrative. The revision
retains 91.5 percent token-sequence similarity to the approved source and adds
only the scope needed to keep concrete product claims from misleading readers.

## Reviewed revision

- Canonical source: `blog/b1/01-llms-are-not-the-agents.md`
- Source version: `v1.3.0` (previously `v1.2.0`)
- Source SHA-256: `5bc8a932516581fc1282aa7ea6eea71fd26173016888a85b22c4f54170007771`
- Published page: `blog/b1/01-llms-are-not-the-agents.html`
- Published-page SHA-256: `a203a737d1034197d32ac3d18e0c9b43092220081921d76144987bdb13f776a1`
- Hadi's narration-source approval remains pending.

## Changes made

1. **Scoped the thesis without weakening it.** The essay now says “in this
   series” before defining an agent as an engine plus a local brain. “The agent
   is the filesystem” remains unchanged as the philosophical frame for a
   durable, user-shaped project agent.
2. **Separated model limits from product memory.** A model has no durable
   project memory or growth on its own; a surrounding product may supply chat
   history or memory, and a deployed model does not update its weights after a
   user's task.
3. **Preserved user ownership.** The Seed offers shared principles and building
   blocks while each user controls its composition and authorizes growth.
4. **Removed one unstable price claim.** Frontier training remains contrasted
   with the much more accessible act of building around an existing model,
   without assigning a fixed hundreds-of-millions figure.
5. **Qualified transparency.** Files make the user-designed durable layer
   inspectable; they do not expose model weights or every internal inference.
6. **Clarified the empty-folder example.** A CLI still brings its platform and
   built-in tools, but it lacks the local project brain meant by “agent” in
   this essay.
7. **Repaired two concrete mechanics.** A `CLAUDE.md` file supplies scoped
   project context rather than the agent's entire context, and OPEVC's dynamic
   working-memory behavior is identified as the reference system used by this
   series.
8. **Kept the hook metaphor while narrowing its guarantee.** Configured hooks
   fire only at supported events, their powers vary, and selected records can
   support later review. They guard a probabilistic process rather than making
   the whole system deterministic. The nonexistent generic OpenCode `stop`
   event was removed.
9. **Made portability architectural rather than automatic.** The durable
   identity can remain in portable files, while instructions, permissions, and
   event mechanisms still need platform adapters.
10. **Kept conversational construction under user control.** The agent can help
    write and organize its file-backed brain; structural reflexes do not force
    self-modification without the user.
11. **Removed stale narration.** The old MP3 predates version 1.3.0 and remains
    hidden until the writing and later narration gates pass.

## Evidence and review state

Concrete product mechanics were checked against the owning documentation for
[Claude Code memory](https://code.claude.com/docs/en/memory), [Claude Code
hooks](https://code.claude.com/docs/en/hooks), [Gemini CLI
hooks](https://geminicli.com/docs/hooks/reference/), and [OpenCode
plugins](https://opencode.ai/docs/plugins/).

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional, and
Hadi's content lock remains pending. The metaphors and prospective claims are
preserved as the essay's argument rather than treated as literal one-to-one
engineering descriptions. Diagram redesign remains outside this round.

## Validation

- Approved-source retention: 91.5 percent token-sequence similarity.
- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Narration corpus and relevant repository validators: passed.
- `git diff --check`: passed.
