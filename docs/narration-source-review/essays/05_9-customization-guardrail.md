# Essay 5.9 review: The Customization Guardrail

## TLDR

The essay keeps its central architecture: plugin-layer work requires a protected
context, a concrete user-decided lock, and a tested close path. The revision
unifies creation-time and mid-flight job approval as two setters of the same
OR-gate arm, separates context authorization from target authorization, and
states the live Boolean permission's broad scope instead of implying an
enforced plugin allowlist.

## Reviewed revision

- Canonical source: `blog/b5/05_9-customization-guardrail.md`
- Source version: `v0.7.0` (previously `v0.6.0`)
- Source SHA-256: `f36d00e4eb5bfc9914e1033eb8a356719b2e2a3870329a1385e4d3c8712af3d8`
- Published page: `blog/b5/05_9-customization-guardrail.html`
- Published-page SHA-256: `f5bb67cec75fe631bda99b2f75de7596d3b16243ac13cc0f60ad390d4e72a0a9`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located the guardrail inside the earlier private Claude Code prototype
   rather than presenting it as a native platform permission model.
2. Defined the protected logical surface, new-plugin birth path, nested test
   lock, and hidden-state gateway boundary without treating all plugin files as
   equivalent.
3. Clarified that narrative, voice, and agent-definition exemptions from
   PLUGIN-LOCK remain subject to applicable phase and file-shape controls.
4. Preserved the fail-closed OR-gate: gmode or a focused job with
   `plugin_lock_approval: true`, applied equally to an edit and a birth.
5. Separated protected-context admission from the concrete PLUGIN-LOCK question,
   user answer, drift check, cleanliness check, checkpoint, and active-lock
   state.
6. Explained why gmode and approved jobs serve different operational needs
   without framing either as an unconditional substrate bypass.
7. Consolidated creation-time and mid-flight job approval as two ways to set
   the same persistent job-level Boolean.
8. Corrected the creation-time flow as CONDENSE-only and the mid-flight flow as
   available in active OPEVC phases but blocked in idle, gmode, or after the
   right is already granted.
9. Added the live approval scope: the proposal names intended plugins, but the
   lock manager checks only the Boolean and does not enforce that name list
   against later lock targets.
10. Distinguished the durable plugin permission from run-level completion
    approval, which resets on reactivation.
11. Added the preferred checkpoint, test, commit, and recovery close path while
    keeping authorization, implementation, verification, and final acceptance
    as separate decisions.
12. Removed absolute claims of safety and inevitability. Operator control,
    lock-exempt behavioral files, incomplete tests, and coarse permission state
    remain material limits.
13. Corrected the May 14, 2026 publication date, September 10 modification
    date, eight-minute reading time, RSS summary, sitemap date,
    adjacent-series reading times, and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including the
plugin and test guards, PLUGIN-LOCK pre- and post-question path, fail-closed
protected-context gate, job approval questions and writers, reactivation
semantics, plugin birth, drift enforcement, checkpoint state, and safe-lock
close path. The private prototype was not modified.

Factual, technical, chronology, cross-writing consistency, editorial, and
source-page parity gates pass for the exact source hash. Hadi's content lock
remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Original article traced to commit
  `4c9f225c2fcb2aaaab1a9467aa2e2bf450e1ee7f` on May 14, 2026.
- Visible source reduced from about 2,759 to about 1,505 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
