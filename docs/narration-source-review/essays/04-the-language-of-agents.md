# Essay 4 review: The Language of Agents

## TLDR

The jargon-wall opening, engine-to-agent progression, desk-and-filing-cabinet
metaphor, hooks as reflexes, plugins as organs, seed-agent growth, and closing
invitation to build remain the narrative. This essay received Hadi's explicit
terminology exception: unlike the other principle writings, it could be
expanded beyond the usual preservation threshold because its older vocabulary
did not explain the harness. The revision grows from about 3,320 to 4,830
words and has 49.9 percent strict token-sequence similarity to the approved
source.

The central addition is one connected anatomy: the model supplies generative
intelligence; the framework and runtime operate the loop; files carry
inspectable cognition and state; tools act; permissions and authority bound
action; hooks meet runtime events; jobs preserve lived work; verification and
recovery make completion credible; and the full composition is the harness.

## Reviewed revision

- Canonical source: `blog/b4/04-the-language-of-agents.md`
- Source version: `v1.2.0` (previously `v1.0.1`)
- Source SHA-256: `302d3dddc0de2feff69775f6aa70a2ff4face966580ebbfed86f623f971a79ef`
- Published page: `blog/b4/04-the-language-of-agents.html`
- Published-page SHA-256: `7b5c7d7511c6db3109a13a74825b073010e7d8effcf125646b91b18646dc5241`
- Hadi's narration-source approval remains pending.

## Changes made

1. **Corrected the model history.** The three phases are now overlapping
   teaching milestones rather than a universal linear history. Instruction
   tuning, tool-request protocols, token generation, and host execution are
   separated.
2. **Added the missing harness map.** Model, framework, runtime, cognitive
   layer, job layer, filesystem, compartment, harness, and agent now have
   distinct roles and a coherent relationship.
3. **Kept the filesystem thesis as an ownership claim.** The text explains
   that files hold much of the durable, inspectable agent while the runtime
   supplies motion and the model supplies generative energy.
4. **Made local control precise.** A CLI program may run locally while model
   inference remains remote. File access depends on permission, and providers,
   operating systems, and connected services retain boundaries.
5. **Separated instructions, context, memory, state, and persona.** Project
   files no longer masquerade as the provider's system message. Stored memory
   matters only when the harness selects and reloads it.
6. **Expanded context engineering.** It now includes context selection,
   retrieval, memory routing, exclusion, and deletion rather than assuming all
   processed tokens should become permanent memory.
7. **Added tools, permissions, authority, and guardrails.** The revision
   distinguishes the ability to perform an action from the right to decide it
   and separates soft model guidance from hard runtime enforcement.
8. **Corrected hooks.** Events belong to the runtime; hooks are configured
   handlers whose observable and blocking power varies by platform and event.
   Plain-language generation does not remove the need to review and test them.
9. **Completed the capability vocabulary.** Skills, commands, scripts,
   sub-agents, MCP servers, connectors, adapters, and plugins now describe
   different mechanisms instead of a false universal hierarchy.
10. **Bounded durable work.** Jobs and obligations need external state,
    ownership, triggers, completion criteria, and recovery. OPEVC is identified
    as the Hadosh rhythm rather than an industry-wide standard.
11. **Added proof and failure handling.** Verification, validation, and
    recovery complete the agent loop; a model's declaration of completion is
    treated as a claim requiring evidence.
12. **Explained growth through composition.** A seed agent begins sparsely,
    and useful behavior can emerge from interactions among memory, jobs,
    permissions, hooks, and validation.
13. **Rebuilt the final synthesis.** The closing now walks one job through the
    complete vocabulary and returns to the essay's engine, body, mind, locks,
    and harness metaphors.
14. **Corrected publication metadata.** Git history and the RSS record confirm
    publication on March 2, 2026. The page now records that date, a September
    10 modification date, a 22-minute reading time, and a specific description
    across page, index, RSS, and adjacent-series cards. The companion-paper link
    now resolves to the repository's owned PDF.
15. **Made the visual canonical and removed stale narration.** The existing
    anatomy figure now belongs to Markdown, and the old MP3 player is hidden
    because it predates version 1.2.0.

## Evidence and review state

The technical definitions were checked against the public Q-Seed harness-layer
contract at revision `291f59c29d38d0339dc39fa4f0cb62cb71961c65`, current
official Claude Code documentation for instruction memory and hooks, current
official Qwen Code documentation for skills and hooks, the latest official
Model Context Protocol architecture, and primary research on instruction
tuning and tool use:

- [Q-Seed harness layers](https://github.com/hadi-nayebi/q-seed/blob/291f59c29d38d0339dc39fa4f0cb62cb71961c65/.qwen/context/harness-layers.md)
- [Claude Code project memory](https://code.claude.com/docs/en/memory)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks-guide)
- [Qwen Code skills](https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/)
- [Qwen Code hooks](https://qwenlm.github.io/qwen-code-docs/en/users/features/hooks/)
- [Model Context Protocol architecture](https://modelcontextprotocol.io/specification/latest/architecture)
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional until
the technical series is reviewed. Hadi's content lock remains pending.

## Validation

- Explicit 2026-09-10 terminology exception recorded in `blog/AGENTS.md`.
- Vocabulary coverage: 43 of 43 planned terms present.
- Approved-source retention: 49.9 percent strict token-sequence similarity;
  the normal 90 percent warning threshold is intentionally waived for this
  essay only.
- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication date traced to commit `4ac1e64e362f946255df90fa3b760e4ef9b5d87a`.
- Narration corpus and relevant repository validators: passed.
- `git diff --check`: passed.
