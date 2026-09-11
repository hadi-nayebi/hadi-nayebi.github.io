# Essay 5.2 review: Plugin Edit Safety

## TLDR

The essay keeps its central teaching arc: controls that govern other controls
need a protected change cycle, and friction should rise with the consequence of
an edit. The revision replaces the simplified "pass commits, fail reverts"
story with the prototype's two actual paths. The preferred active closeout
preserves failed work for repair; automatic safe-lock is a fallback that first
quarantines recoverable work and then restores the checkpoint.

## Reviewed revision

- Canonical source: `blog/b5/05_2-plugin-integrity.md`
- Source version: `v0.9.0` (review began at `v0.7.0`)
- Source SHA-256: `f848a8f89cf515ae38366ad23e7f06a2fc604d0c17824cff92792d458ceac878`
- Published page: `blog/b5/05_2-plugin-integrity.html`
- Published-page SHA-256: `95c878f2b2007a19c5644b85c21a388ce62a2ebf2f550415e7b448aacec40cc3`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located `plugin_integrity` inside the older private Claude prototype and
   removed the claim that every phase-independent plugin fires on every prompt
   and tool call.
2. Added the actual admission boundary: one-hundred-word shaped request, one
   named plugin, and either gmode or a focused job with user-approved plugin
   work. New-plugin birth uses the same gate.
3. Distinguished protected code and hidden state from lock-exempt narrative,
   coaching, agent-definition, and shared-library surfaces. Phase controls
   still govern the exempt surfaces.
4. Corrected the preferred `lock-cmd.sh` path: all declared shell tests run;
   pass commits and closes; failure preserves the working tree and active lock;
   a plugin with no tests can close only with an explicit warning.
5. Corrected `safe-lock.sh` as the automatic fallback. Failure attempts a
   quarantine commit before restoring the checkpoint and recording recovery
   evidence.
6. Corrected `[TEST-LOCK]`: it protects one existing shell test at a time, while
   a new test file can be created without that second unlock.
7. Removed the unsupported eighty-percent-coverage claim. Test counts do not
   establish coverage or prove that every behavior has a regression test.
8. Clarified enforcement: hooks block routed Claude Code tool calls; gmode
   suspends phase controls but still uses the plugin lock; operating-system and
   repository access remain part of the trust boundary.
9. Updated the live prefix registry to ten entries including
   `[COMMAND-APPROVE]`, and described registry changes as a cross-plugin
   contract owned jointly with `question_discipline`.
10. Corrected the revert-log description to match its existing seven fields,
    including structured failed-test context and reverted file paths.
11. Replaced seventeen oversized legacy evidence annotations with ten concise
    references to the exact current mechanisms.
12. Corrected the May 14, 2026 publication date, September 10 modification
    date, seven-minute reading time, RSS summary, adjacent-series descriptions,
    and stale audio player.
13. Replaced the closing B5.3 preview's obsolete "tiers" language with the
    reviewed essay's actual subject: preparing an inspectable handoff before a
    context boundary.

## Evidence and review state

Claims were checked against the private Claude prototype at parent revision
`3395d2d048f44435546ab055d0c2f4c32a34fd25`, especially
`plugin_integrity`'s lock manager, guard, active closeout, safe-lock fallback,
configuration, state schema, and tests, plus the live question registry. The
private prototype was read as evidence and was not modified.

Factual, technical, chronology, cross-writing consistency, editorial, and
source-page parity gates pass for the exact source hash. Hadi's content lock
remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit `7728f576436d634eaf091f69e7a22513bc042ac6`.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
