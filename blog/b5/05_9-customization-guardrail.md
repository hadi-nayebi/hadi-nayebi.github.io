---
title: "The Customization Guardrail"
date: "May 2026"
slug: "customization-guardrail"
read_time: "8 min"
tags: [Architecture, Seed Agent, Plugins, Customization, PLUGIN-LOCK]
status: draft
version: v0.7.0
audience: "Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The Customization Guardrail

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

---

[Essay 5.8](05_8-historian-ratchet.html) covered the history debt checked during a plugin unlock. This final part asks the prior question: when may the prototype request `[PLUGIN-LOCK]` at all?

This essay describes an earlier private Claude Code prototype. The guardrail protects that prototype's plugin layer; it is not a native Claude Code permission model.

---

## The surface being protected

`[PLUGIN-LOCK]` is the entry ceremony for editing an existing plugin's protected logical surface or creating a new plugin from the template. Existing test files require a nested `[TEST-LOCK]` after their plugin is unlocked. Plugin state such as `data.json` remains behind plugin-owned gateways. *[ref: protected-surface | .claude/plugins/plugin_integrity/hooks/lock-manager.sh, PLUGIN-LOCK and plugin-birth paths; .claude/plugins/plugin_integrity/hooks/plugin-guard.sh | Existing logical edits and new-plugin birth share the lock admission path; protected tests add a separate gate; hidden state is not a direct edit surface.]*

The mechanism deliberately exempts some narrative and coaching files from `[PLUGIN-LOCK]`: plugin `CLAUDE.md` files, documentation, voice catalogs, and agent definitions. Those files remain subject to their applicable phase and file-shape controls. Exemption from this lock is not exemption from every rule. *[ref: exempt-surfaces | .claude/plugins/plugin_integrity/hooks/plugin-guard.sh, documentation, voice, and agent exemptions; phase guards | Narrative and coaching surfaces can evolve without a code lock while other ownership and phase boundaries still apply.]*

The distinction reflects consequence. A hook or gateway change can alter what the harness blocks, permits, or records. A narrative edit can also influence behavior, but it does not run as the same testable control surface. The prototype gives those categories different maintenance paths.

## The OR-gate

The lock manager admits a `[PLUGIN-LOCK]` question only when at least one of two conditions is true:

1. the focused work is currently in `gmode`; or
2. the focused job has `plugin_lock_approval: true`.

If phase state cannot be resolved and no approved focused job can be found, the gate fails closed. The same check applies whether the target plugin already exists or will be created. A new plugin does not receive a birth-time bypass. *[ref: or-gate | .claude/plugins/plugin_integrity/hooks/lock-manager.sh, Gmode-OR-plugin_lock_approval gate | The handler reads current phase and the focused job's top-level approval Boolean, blocks unless either arm is true, and applies the decision to edit and birth targets.]*

Passing this gate does not silently unlock anything. The question still needs the registered `[PLUGIN-LOCK]` shape, the expected option, and the user's answer. The lock manager then checks drift, repository cleanliness, current lock state, and the target before establishing a checkpoint and unlocking the plugin. *[ref: lock-admission-sequence | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh; .claude/plugins/plugin_integrity/hooks/lock-manager.sh, PLUGIN-LOCK handler | Protected context is one precondition among question shape, drift, clean-state, active-lock, option-label, and answer checks.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/customization-guardrails-b5-9.png
  STATUS: Existing diagram remains accurate at concept level; diagram redesign is outside this editorial pass.
  Concept: gmode or a focused job's plugin_lock_approval admits the PLUGIN-LOCK question for an existing edit or a new-plugin birth.
  Caption: "Image 5.9. Two protected contexts admit the lock ceremony; the user still decides whether the specific plugin is unlocked."
-->

## Why there are two contexts

`gmode` is the maintenance lane for work the operator wants to address outside the ordinary OPEVC progression. Entering it is itself a shaped, user-decided ceremony. It offers broad maintenance access, but it does not disable the always-on plugin integrity layer: the specific plugin still needs `[PLUGIN-LOCK]`, drift can still require a historian, and closing the lock still runs its tests.

The approved-job lane keeps planned or discovered plugin work inside a durable job. It retains an objective, interactions, dependencies, cycles, and completion review around the substrate change. This is a better fit when customization is substantial enough to deserve its own work history or is already part of an active job.

These routes answer different operational needs. Gmode creates an explicit maintenance context. Job approval attaches a durable right to a tracked unit of work.

## Two ways a job receives the right

The second OR-gate arm can be set in two ways.

### Create a pre-approved job

During ordinary work, any phase can notice that a plugin change may be useful and record that finding for CONDENSE. From CONDENSE, the agent may ask `[JOB-APPROVE-CREATION] <name>` with four required sections: Proposed Objective, Plugins to Touch, Why Now, and Risk Surface.

If the user chooses the exact approval option, the post-hook creates a pending job and calls the hook-only writer that sets `plugin_lock_approval` on that new job. The job must later be activated and focused before its approval satisfies the lock manager. `[JOB-APPROVE-CREATION]` is blocked outside CONDENSE, including gmode. *[ref: creation-time-approval | .claude/plugins/job_core/hooks/question-capture.sh and question-capture-hook.sh, JOB-APPROVE-CREATION; .claude/context/prefixed-questions.md | The pre-hook enforces CONDENSE and shape; the post-hook creates the job and raises the right after the approved answer.]*

The separation is useful. A phase records the need where it is discovered; CONDENSE decides whether it deserves a separate job; the user decides whether that job may enter the plugin layer.

### Raise the right on the focused job

Sometimes an ordinary job discovers mid-flight that the accurate fix belongs in plugin code. `[JOB-APPROVE-PLUGIN]` requests the same Boolean for the already-focused job. Its shape names the focused job, the plugins involved, and why the implementation layer is necessary.

This request is allowed in OBSERVE, PLAN, EXECUTE, VERIFY, or CONDENSE. It is blocked in idle, blocked in gmode because gmode already satisfies the OR-gate, and blocked when the right is already true. On approval, the post-hook calls the same `approve-plugin-lock` writer without creating or refocusing a job. *[ref: mid-flight-approval | .claude/plugins/job_core/hooks/question-capture.sh and question-capture-hook.sh, JOB-APPROVE-PLUGIN | The pre-hook requires a focused job and active OPEVC phase; the post-hook raises the existing job's approval with the shared writer.]*

Creation-time and mid-flight approval therefore differ in timing and target, not in the stored right. Both still require a later `[PLUGIN-LOCK]` question for the specific unlock.

## The approval's real scope

`plugin_lock_approval` is a top-level job Boolean. It belongs to the job identity, survives completion and reactivation, and does not reset with the run-level `user_approval` flag.

That durability avoids asking the same repeating job to regain its architectural right every run. It also broadens the permission. Although the approval question names the intended plugins, the live lock manager checks only whether the Boolean is true. It does not compare the later `[PLUGIN-LOCK]` target with the proposal's “Plugins to Touch” section. *[ref: approval-scope | .claude/plugins/job_core/scripts/job.sh, approve-plugin-lock and reactivate handlers; .claude/plugins/plugin_integrity/hooks/lock-manager.sh, approval arm | The approval is persistent job-level state; lock admission reads the Boolean and target independently, without an enforced plugin allowlist.]*

This is an important limit, not a reason to hide the design. The user still approves each concrete lock question, and the lock machinery still applies drift, cleanliness, checkpoint, test, and recovery gates. But the job-level approval means “this job may request plugin locks,” not “this job may request only the exact plugin names written in the earlier proposal.”

A stricter future design could store an approved plugin set or capability object and require every lock target to match it. That would improve least privilege at the cost of schema, migration, and amendment complexity.

## What happens after admission

Once the user approves the concrete lock, `plugin_integrity` records the target and a Git checkpoint. The main agent can edit the protected surface of that plugin, with existing tests still separately guarded. Switching to another plugin requires closing the active lock first.

The preferred close path runs the plugin's existing tests. A pass commits the coherent plugin change and clears the lock. A failure preserves or recovers work according to the safe-lock path and records evidence rather than pretending the edit succeeded. The lock ceremony reduces risk; it does not prove that the test suite is complete or that the architectural decision was good.

That last distinction keeps authorization, implementation, and verification separate:

- protected context authorizes the kind of work;
- the concrete lock question authorizes the target;
- the checkpoint and test path control the edit lifecycle;
- user review and broader evidence determine whether the result should survive.

## What would break without it

Without a protected-context gate, normal work could drift into rewriting the hooks and gateways that govern all later work. A local mistake could change global behavior, and the job carrying the original objective might have no explicit authorization for that escalation.

The guardrail introduces a deliberate break in that path. The agent can notice and propose a substrate change, but it cannot turn that proposal into a plugin unlock without a recognized context and a user answer.

The mechanism is bounded. The operator controls the repository and runtime. Narrative surfaces remain influential even when lock-exempt. Tests can miss defects. A Boolean permission is coarse. The guardrail makes self-modification inspectable and interruptible; it does not make it infallible.

## What you would customize

The strongest customization is permission granularity. A small personal seed may accept one durable job-level Boolean. A larger or multi-user environment may need approved plugin names, allowed operation classes, expiration, run-scoped grants, or separate approvers.

The gmode route may also need tighter scope. A production system could require a maintenance job even for urgent fixes, or allow gmode only for recovery commands. The choice depends on how costly delay is and how much authority one operator should hold.

Question names and coaching language can follow the operator's vocabulary, but rename them as a protocol: registry entry, shape catalog, pre-hook, post-hook, tests, and any transport mapping must change together.

The portable principle is that a system capable of changing its own control layer should distinguish noticing a need, authorizing the work context, approving a concrete target, performing the edit, and accepting the result.

---

The B5 series has now mapped the earlier prototype's always-on layer: protected plugin edits, context handoffs, durable jobs, interaction summaries, structured questions, working-memory files, living history, and the authorization boundary around customization.

---

*Essay 5.9 — The Always-On Digital Cortex, Part 9 of 9.*

*Previous: [Essay 5.8 — The Historian Ratchet](05_8-historian-ratchet.html) — commit drift as bounded documentation debt.*
*Next: [Essay 6.1 — Phasic Foundation](../b6/06_1-phasic-foundation.html) — the opening of the prototype's phase architecture.*
