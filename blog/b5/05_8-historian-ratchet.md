---
title: "The Historian Ratchet"
date: "May 2026"
slug: "historian-ratchet"
read_time: "7 min"
tags: [Architecture, Seed Agent, Plugins, Composed Ceremony]
status: draft
version: v0.4.0
audience: "Tier 3"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# The Historian Ratchet

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

---

[Essay 5.7](05_7-claude-md-hierarchy.html) described a visible working-memory hierarchy. This part examines a different kind of memory: the bounded history that is required before a frequently changed plugin can be unlocked again.

This essay describes an earlier private Claude Code prototype. Its historian is a local maintenance mechanism, not a native Claude Code feature.

---

## Mechanical history and narrated history

Git already records what changed: commits, authors, timestamps, and diffs. That record is precise but does not automatically explain which architectural lesson should guide the next edit.

Participating plugins in this prototype therefore maintain `docs/evolution.md`. The file gives a concise account of the plugin's origin, milestones, lessons, invariants, and current state. When an existing plugin is unlocked, `plugin_integrity` injects that living history along with the recent unsummarized commit log. The next editor receives both the narrative and a path back to the underlying evidence. *[ref: living-history-injection | .claude/plugins/plugin_integrity/hooks/lock-manager.sh, existing-plugin unlock context; .claude/plugins/plugin_integrity/template/_historian.md | The unlock response includes `docs/evolution.md` and recent commits; historian instructions keep the plugin as protagonist and preserve commit-backed history.]*

The distinction matters. Git is the source record. `evolution.md` is an interpretation built from it. The narrative can accelerate orientation, but it can also be incomplete or wrong; commit references and archived detail keep it auditable.

## Counting drift

When the agent proposes `[PLUGIN-LOCK] <name>`, the lock manager runs `drift-check.sh` for the target plugin. The script finds the most recent commit that touched that plugin's `docs/evolution.md`, then counts later commits that touched the plugin directory.

The current default threshold is ten commits. When drift is below ten, the remaining lock checks can continue. At ten or more, the pre-tool hook blocks the unlock and names the plugin's historian. It also shows a bounded list of recent commits that have not yet been condensed into the living history. *[ref: drift-gate | .claude/plugins/plugin_integrity/scripts/drift-check.sh; .claude/plugins/plugin_integrity/config.conf, DRIFT_THRESHOLD; .claude/plugins/plugin_integrity/hooks/lock-manager.sh, Evolution gate | Drift is commit-based, defaults to ten, and blocks the proposed unlock at or above the threshold.]*

This is a periodic debt mechanism:

1. normal plugin commits accumulate;
2. the drift count reaches its threshold;
3. the next unlock is denied;
4. the historian updates and commits the plugin's documentation;
5. that commit becomes the new synchronization point.

Because the count starts after the last commit that touched `evolution.md`, a successful historian commit returns the immediate count to zero. Editing the file without committing does not pay the debt. The gauge follows Git history, not modification time. *[ref: reset-semantics | .claude/plugins/plugin_integrity/scripts/drift-check.sh; .claude/plugins/plugin_integrity/template/_historian.md, mandatory auto-commit | The last evolution commit defines the exclusive range used for the next drift count.]*

## What the historian must produce

New plugins receive a historian definition from the `plugin_integrity` template. The historian may edit documentation under the target plugin, but not its hooks, scripts, tests, state, voices, or instruction file.

On a first backfill it reconstructs the plugin's history from Git. On an incremental run it reads the existing evolution narrative and the later diffs, then appends a dated synthesis and updates Things To Remember. The plugin remains the subject: the prose records what the plugin learned and how its architecture changed, rather than narrating the historian's activity.

`evolution.md` has a hard default ceiling of 2,000 words. The cap is enforced on projected Edit, Write, and MultiEdit operations, blocks shell write paths that cannot be projected safely, and checks the actual file again after writes. When the file approaches the ceiling, the historian can compress older entries or move detail into uncapped sibling documents such as decisions or topical lessons. *[ref: historian-scope-and-cap | .claude/plugins/plugin_integrity/template/_historian.md; .claude/plugins/plugin_integrity/hooks/evolution-cap.sh; .claude/plugins/plugin_integrity/config.conf, MAX_EVOLUTION_WORDS | Historian edits are documentation-scoped; the primary narrative is capped at 2,000 words with archive paths for detail.]*

The cap keeps the auto-injected narrative useful. Without it, a mechanism intended to speed orientation would eventually consume increasing context on every unlock.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/historian-ratchet-b5-8.png
  STATUS: Existing diagram remains accurate at concept level; diagram redesign is outside this editorial pass.
  Concept: Plugin commits increase drift; the threshold blocks the next unlock; a historian updates and commits docs/evolution.md; the synchronization point resets.
  Caption: "Image 5.8.1. Commit drift creates documentation debt, and a committed historian update pays it before the next plugin unlock."
-->

## Why call it a ratchet?

A mechanical ratchet permits motion in one direction and prevents reversal. This software pattern is looser. An operator can change the threshold, disable the hook, rewrite history, or edit the narrative poorly. The mechanism does not make knowledge irreversible.

The useful similarity is periodic forward pressure. Ordinary work can defer narration for a bounded interval, but the next unlock eventually encounters a hard gate. Progress resumes only after a new history commit establishes a later synchronization point.

Inside the configured hook boundary, this converts “document the architecture occasionally” from advice into scheduled maintenance. It still cannot prove the quality of the resulting history. The historian's scope, word cap, evidence rules, and future review constrain that quality problem without eliminating it.

The pattern generalizes to any discipline that may be deferred briefly but should not be deferred indefinitely. A consulting practice could count revisions to a delivery template and require a short practice note before its next checkout. A data team could count schema migrations and require the runbook to be resynchronized before another change.

## Where composition actually occurs

The historian drift gate itself belongs to `plugin_integrity`. That plugin owns the drift check, historian templates, evolution cap, unlock state, and the safe-lock process that tests and either commits or recovers plugin edits.

The complete unlock ceremony still composes several owners:

- `question_discipline` admits `[PLUGIN-LOCK]` as a registered, shaped user question;
- `phasic_system` supplies whether the focused work is in gmode;
- `job_core` supplies the focused job's persistent `plugin_lock_approval`;
- `plugin_integrity` requires one of those protected contexts, checks drift, captures the lock answer, unlocks the target, and later closes the edit through its test-and-recovery path.

This corrects an earlier account in which `job_core` was said to carry the lock answer. The lock manager is registered on both sides of `AskUserQuestion` and reads that answer itself. `job_core` contributes job-level authorization state; it does not own the lock response. *[ref: composed-unlock | .claude/plugins/question_discipline/hooks/question-discipline-gate.sh; .claude/plugins/plugin_integrity/hooks/lock-manager.sh, PLUGIN-LOCK handler; .claude/plugins/job_core job state; .claude/plugins/phasic_system/scripts/phase.sh | Registry admission, protected-context state, drift enforcement, and post-answer unlocking come from distinct owned surfaces.]*

Composition is useful when the boundaries stay clear. One plugin can ask whether a question is registered without learning how plugin checkpoints work. Another can own job authorization without parsing every lock request. The ceremony is larger than each interface, while each mutation still has one owner.

<!-- IMAGE PLACEHOLDER:
  ASSET: images/historian-ratchet-b5-8b.png
  STATUS: Historical diagram retained; diagram redesign is outside this editorial pass.
  Note: The existing diagram incorrectly says job_core carries the PLUGIN-LOCK answer. The live lock-manager captures the answer; job_core contributes plugin_lock_approval state.
  Caption: "Image 5.8.2. The unlock ceremony composes question admission, phase and job authorization, and plugin_integrity's lock and historian machinery."
-->

## What would break without it

Without a drift gate, `evolution.md` can remain unchanged while the plugin moves through many revisions. The injected history then becomes actively misleading: it presents an old architecture with the authority of current onboarding material.

Removing the narrative entirely would avoid that false freshness, but the next editor would have to reconstruct intent from raw history every time. The ratchet keeps a concise interpretation while forcing it to revisit the evidence on a bounded cadence.

## What you would customize

The threshold should follow change rate and consequence. Ten commits is a local compromise, not a universal optimum. A small, stable plugin may tolerate more drift. A high-risk control may deserve a lower limit or a time-based review in addition to commit count.

The narrative schema should also follow the domain. A production service might emphasize incidents, migrations, and rollback lessons. A research pipeline might emphasize methodological changes, invalidated assumptions, and dataset lineage.

Keep the mechanical and narrative records separate. The narrative should cite the source history rather than replace it. Keep its primary form bounded, and give overflow a durable home.

The portable pattern is a counter, a gate, a scoped corrective action, and a verifiable reset. It schedules reflection without pretending to automate judgment.

---

The final part examines the authorization boundary that decides when the prototype may alter its own plugin layer.

---

*Essay 5.8 — The Always-On Digital Cortex, Part 8 of 9.*

*Previous: [Essay 5.7 — The CLAUDE.md Hierarchy](05_7-claude-md-hierarchy.html) — phased working memory built on native instruction files.*
*Next: [Essay 5.9 — The Customization Guardrail](05_9-customization-guardrail.html) — the protected contexts required for plugin-layer change.*
