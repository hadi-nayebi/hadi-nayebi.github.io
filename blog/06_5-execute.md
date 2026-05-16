---
title: "EXECUTE — Build, in Scope, in Steps"
date: "May 2026"
slug: "execute"
read_time: "8 min"
tags: [Architecture, Seed Agent, OPEVC, Phases, Execute]
status: draft
version: v0.2.0
audience: "Tier 2"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# EXECUTE — Build, in Scope, in Steps

*Essay 6.5 — The Markov Phasic Brain, Part 5 of 10.*

---

EXECUTE is where code gets written. The write-tool guard is gentler here, but only inside the altered list. Every other path is blocked.

---

## The universal file-creator

EXECUTE doesn't just write code — it writes everything. The principle is universal: every file the seed agent materializes on disk is brought into existence by EXECUTE. Project source, scripts, configuration, the .md plan, the .yaml plan, anything else with a path — all of it is EXECUTE's deliverable.

OBSERVE and PLAN do their thinking inside CLAUDE.md working memory; VERIFY refines what EXECUTE produced; CONDENSE routes content into durable layers. EXECUTE is the only phase that turns analysis into artifact. *[ref: execute-only-phase-allowed-to-write-plan-file | .claude/plugins/phase_plan/hooks/plan-guard.sh:253-289 | plan-guard blocks any Write/Edit under .claude/knowledge/ from PLAN, including the plan file PLAN itself just named — the file's creation is reserved for EXECUTE, the same rule that applies to every other artifact the seed agent produces.]*

The `.yaml` is not a transcription of the `.md` — it is its own cycle of work. Cycle 1's EXECUTE materializes the `.md` for the first time, and the plan enters its `drafting` state. The `.yaml` does not arrive then. It arrives only after the user approves the `.md` and the state flips to `md_approved` — and the cycle that follows is a whole new OPEVC pass dedicated to the `.yaml`: OBSERVE re-reads the approved `.md`, PLAN designs the YAML structure inside CLAUDE.md analysis, EXECUTE writes the `.yaml` file for the first time, VERIFY refines it. Same phase, same compartmentalization rule, different trigger: cycle 1 for the `.md`, a post-approval cycle for the `.yaml` — which takes the approved `.md` as input and produces a context-injection target as output.

---

## The frozen fence

The altered list is a frozen snapshot of directories, captured from OBSERVE and PLAN at phase entry. A guard inspects every write call against that snapshot before the call lands. A path inside the snapshot proceeds. A path outside is rejected, and the agent has to either roll back to PLAN to amend the contract or accept the fence. *[ref: set-altered-list-stores-snapshot | .claude/plugins/phase_execute/scripts/execute.sh:505-516 | set-altered-list builds a normalized JSON array from paths and writes altered_claude_md = ($arr | unique) into data.json — the canonical storage point of the frozen snapshot the guard reads.]*

A second guard inside the same hook protects the phase-section markers — the footer anchors from the previous essay (currently one per OPEVC phase) — so that EXECUTE writes execution notes inside its own footer section but cannot overwrite what the prior phases wrote. The compartmentalization holds even within a single CLAUDE.md. *[ref: execute-guard-section-enforcement-call | .claude/plugins/phase_execute/hooks/execute-guard.sh:856-879 | Inside execute-guard's CLAUDE.md branch, the section-enforcement sub-block dispatches the shared check_section_edit("---Ex---", ...) library call; cross-section edits are rejected with section-enforcement block detail.]*

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard sketch — EXECUTE's two nested fences. An outer path-scope fence drawn from the altered list, and an inner section-marker fence inside each CLAUDE.md.
  Style: Match `opevc-cycle-blackboard.png` exactly. Dark slate chalkboard; hand-drawn chalk lines;
  pastel chalk (cyan, green, orange, pink, magenta — same palette as the cycle image) for the fence borders and the CLAUDE.md tile;
  white chalk for labels and arrows; chalk sticks at the bottom edge; faint chalk dust at the edges.
  IMPORTANT: Use only the literal names listed below. Do not invent or substitute any other names, labels, or fence descriptors.
  Layout: Two nested chalk rectangles arranged concentrically on the board.
    Outer rectangle (cyan border, large): labeled at the top edge "altered list", with three small chalk file icons inside labeled "dir A", "dir B", "dir C" — these are the allowed directories.
    A short white chalk arrow enters the outer rectangle from the left labeled "write call"; a second white chalk arrow attempts to enter from outside the outer rectangle and is blocked by a chalk X mark, labeled "out of scope".
    Inner rectangle (orange border, smaller, drawn inside dir B): represents a single CLAUDE.md, labeled at the top edge "CLAUDE.md".
    Inside the inner rectangle, four horizontal chalk bands stacked vertically, each labeled with a pastel-chalk anchor name: top band cyan labeled "---Ob---", second band green labeled "---Pl---", third band orange labeled "---Ex---" (highlighted with a small white chalk check mark in the margin), fourth band pink labeled "---Ve---".
    A white chalk arrow enters the inner rectangle from outside and lands cleanly inside the third band (---Ex---).
    A second white chalk arrow attempts to land in the first band (---Ob---) and is blocked by a chalk X, labeled "wrong section".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "altered list", "dir A", "dir B", "dir C", "write call", "out of scope", "CLAUDE.md", "---Ob---", "---Pl---", "---Ex---", "---Ve---", "wrong section", plus the caption below. No other words, file names, folders, or fence descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.5. EXECUTE's two fences. Path scope outside, section scope inside."
-->

---

## Checkpoints over runs

The phase is structured around *checkpoints* — short, focused commits that finish one piece of the plan before starting the next. The pattern is deliberate. A long uncommitted run inside EXECUTE has the same problem as a long run anywhere else: drift accumulates, and a failure halfway through erases everything.

Checkpointing forces small wins. It also gives the agent a clean place to pause and notice when the plan is wrong, before sinking another ten tool calls into the wrong direction. *[ref: execute-checkpoint-vs-forward-commit | .claude/plugins/phase_execute/scripts/execute-commit.sh:390-397 | Without --force, the commit prefix becomes "execute: [intermediate]" and the script stays in EXECUTE for more work; with --force the prefix is "execute:" and the script proceeds to phase advance.]*

EXECUTE writes two things: the code, and *execution notes* in the working CLAUDE.md. The notes are short — what surprised the agent, what decisions the agent made when the plan left a judgment call open, what the next phase should know. The notes are what turn a sequence of commits into a coherent narrative. They will be one of the things CONDENSE absorbs. *[ref: execute-tools-table-claude-md-as-notes | .claude/plugins/phase_execute/CLAUDE.md Tools section | EXECUTE's tool table labels project-file edits (5 pts) and CLAUDE.md edits (10 pts, "Execution notes — resets synthesis counter") as the phase's two write activities, with notes earning the highest reward among edits.]*

---

## The delegation bias

EXECUTE is also where subagent dispatch shows up most heavily, and the point schedule encodes that explicitly. Every execute subagent the main session launches grants the session a small *direct-action budget* — a handful of extra writes the main session is allowed to make on its own. Every project file the main session edits itself spends some of that budget back.

Reading project files does not consume budget; only edits and writes outside `.claude/` do. The arithmetic is small but the bias is intentional: the main session is incentivized to delegate the implementation to execute subagents rather than do the file work itself. A typical execute phase will spawn one or two execute subagents on file edits while the main session works on the spine of the change. *[ref: execute-subagent-grants-direct-action-budget | .claude/plugins/phase_execute/scripts/execute.sh:765-795 | grant-direct-action-budget adds +3 budget per execute-subagent dispatch; consume-direct-action-budget deducts 1 per project edit and dies on insufficient — structural enforcement of 80/20 delegation bias.]*

The discipline favors sequential dispatch — one execute subagent at a time, with the main session orchestrating between checkpoints. When fan-out is genuinely useful, the operational ceiling is two-in-flight; the cap was set after a cycle in which three concurrent subagents pushed the context window past a safe tier and triggered cascading compaction. We will come back to the discipline of subagent dispatch in [Essay 7](07-the-plugin-kit.html).

## The comment-density drift gate

EXECUTE carries one gate that no other phase has — a *comment-density drift gate* on code edits, enforced inside the same execute-guard hook that polices the altered list.

The rule is drift-only: an edit cannot lose comments relative to the file's prior state. There is no absolute floor; a sparsely-commented file does not trigger the gate, only an edit that strips reasoning from the file. Several distinct block verdicts cover the failure modes — code-added-without-comments, comments-stripped, comment-loss-disproportionate, docstring-stripped, new-file-no-docstring — each with its own block voice. A coaching tier (`thin-comments`) fires below the block threshold and lets the edit through with a stderr nudge. *[ref: comment-density-drift-gate | .claude/plugins/phase_execute/hooks/execute-guard.sh Comment-Density Gate section (delta-based 9-case dispatch) + .claude/plugins/phase_execute/scripts/comment-density.sh density_check | The gate fires on Write/Edit of .sh/.py/.js/.css/.html files (main session only — subagents bulk-edit and are exempt). Structural pre-checks (docstring-stripped, new-file-no-docstring) run first as binary gates; the delta-based 9-case dispatch via density_check follows. Block verdicts (currently five in the prototype) have distinct voice IDs; the coaching tier prints to stderr without blocking. The arithmetic is pure-integer delta on (old_string, new_string, ext); no file scans.]*

The gate matters because the most common LLM failure mode on code edits is the silent comment-strip. An LLM optimizing for terseness will happily delete the `# why this exists` line as "cleanup." The reasoning is gone before any human reviews the diff. By forcing comment-loss to be visible at the moment of the edit — and by blocking the worst categories outright — the architecture protects the codebase's reasoning trail from the very tool writing it.

A worked example lands here. Cycle 3 of the migration job has reached EXECUTE. The altered list is set; the marker-schema revert has been planned. The agent dispatches one execute-* subagent to revert cycle 2's marker code, then turns to write a single hook update itself. The Write tool fires; the comment-density gate inspects the delta. The old `script.sh` carried a six-line header docstring; the new version has it intact but stripped two inline `# the reason this branch exists` comments from the body. The disproportionate-loss verdict fires. The edit is blocked. The agent reads the block message, restores the comments, re-submits. The check passes. Reasoning preserved; commit landed.

## What you would customize

EXECUTE is where most architects will tune the most knobs, because it is where the seed agent's velocity actually shows.

The architect would tune the *execute subagent roster*. The current roster covers code edits, test runs (deferred to VERIFY), and bulk refactors. A seed working in a content-heavy domain — legal drafting, market research write-ups — would want subagents specialized for prose generation and citation insertion, with their own scope guards. The roster is the surface; the entries are yours.

The architect would tune the *direct-action budget arithmetic*. The current grant is +3 per execute-subagent dispatch; the consumption is -1 per project edit. Your seed might want a higher delegation bias (+5 grant, -2 consumption) or a lower one. The arithmetic is small; the bias it encodes is large.

The architect would tune the *comment-density verdicts*. The current five block-categories and one coach-category were calibrated against the prototype's own cycles. A seed working in a heavily-commented domain might block on thinner deltas; one working with a generated-code intermediate stage might exempt specific paths from the gate entirely. The verdicts are the mechanism; the thresholds are yours.

What the architect would **not** customize is the altered-list fence itself. The fence is the floor: an execute phase that lets the agent write outside the plan's declared scope is not an execute phase.

The deepest payoff of EXECUTE is the cognitive failure mode it prevents: the cleanup that erases reasoning. An LLM finishing a job will, given freedom, polish its output by removing things it judges decorative — comments, docstrings, the careful `# why` lines that future-readers depend on. The comment-density gate is the architecture's structural answer. Combined with the altered-list fence and the checkpoint cadence, EXECUTE is the phase that lets the agent build fast without letting it build fast in ways the next architect (or the next-cycle agent) will silently inherit and curse.

When EXECUTE believes the plan is implemented, it commits the final checkpoint and the orchestrator advances the job to VERIFY.

---

*Essay 6.5 — The Markov Phasic Brain, Part 5 of 10.*

*Previous: [Essay 6.4 — PLAN: Decide, Then Lock](06_4-plan.html) — naming the contract, the plan_state machine.*
*Next: [Essay 6.6 — VERIFY: Independent Eyes](06_6-verify.html) — scripts-only, auditor subagents, approval authority.*




