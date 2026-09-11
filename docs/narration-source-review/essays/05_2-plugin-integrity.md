# Essay 5.2 review: Plugin Edit Safety

## TLDR

The untouched 1,455-word article is now 1,888 visible words. No section,
professional example, image concept, or central principle was removed. The
existing arc remains: define what `plugin_integrity` owns, explain friction
calibrated by danger, show the unlock briefing, describe what fails without the
gate, and identify what an architect can customize.

The revision makes the mechanism accurate. It separates admission, editing,
active close-out, and defensive recovery; explains that existing shell tests
have a second lock while new tests can be added; removes an unsupported
coverage percentage; and states the trust boundary of hook enforcement. The
portable principle becomes clearer: controls that govern other controls need a
named scope, user authority, proportionate evidence, and recoverable failure.

## Reviewed revision

- Canonical source: `blog/b5/05_2-plugin-integrity.md`
- Review baseline: `6e0214ff113c8888a16222bc9c111e9049cbfacb`
- Source version: `v0.8.0` (previously `v0.7.0`)
- Source SHA-256: `9f1a283c2a085cbeee9c991f30b82e46f603438385339480dacdb7e833f1afe3`
- Published page: `blog/b5/05_2-plugin-integrity.html`
- Published-page SHA-256: `8a1850d46909b12fc9e7738b3ad7e53b1f392bfedb59f8900245841c7343a89a`
- Hadi's narration-source approval remains pending.

## Changes made

1. **Aligned the opening with Essay 5.1.** “Always-on” now means
   phase-independent. Plugins remain relevant across the cycle while attaching
   only to the lifecycle events that serve their concerns.
2. **Added the admission boundary.** A shaped one-hundred-word request names
   the plugin, changes, reason, and tests. Existing edits and new-plugin births
   require either gmode or a focused job with user-approved plugin work.
3. **Separated protected and exempt surfaces.** Executable logic,
   configuration, guarded state, and existing shell tests are protected.
   Narrative and coaching files plus shared utilities do not require the
   plugin lock, though phase rules still govern them.
4. **Located the enforcement boundary.** The guard watches relevant Claude
   Code tool calls and transition commands. Subagents skip automatic close-out
   while still respecting scope, hidden-state, test-file, anchor, and path
   protection. Operator filesystem and Git access remain outside the promise.
5. **Explained deliberate close-out.** `lock-cmd.sh` runs all declared shell
   tests, commits and clears on pass, warns when a plugin has no tests, and
   preserves failed work and the active lock for repair.
6. **Explained defensive recovery.** `safe-lock.sh` handles out-of-scope edits.
   On red tests it attempts a quarantine commit, restores the checkpoint,
   preserves ignored state, records recovery evidence, and clears the lock.
7. **Strengthened the portable contract.** Other architects can replace the
   shell implementation while preserving named scope, user authority,
   verification, and recovery.
8. **Corrected test-lock scope.** The second lock protects one existing shell
   test by name. A new shell test can be created without rewriting an
   established test; later edits to that new file become protected.
9. **Removed unsupported coverage math.** Test and suite counts do not prove
   an eighty-percent coverage level or show that every behavior has a test.
   The replacement asks for proportionate regression evidence.
10. **Corrected gmode.** Gmode suspends ordinary phase controls after a shaped
    justification but does not remove plugin locking. The flow combines
    deliberative ceremony with hook enforcement on routed tools.
11. **Preserved the unlock briefing.** The living-history, recent-commits,
    objective-alignment, deeper-reference, and commit-boundary explanation
    remains because it matches the inspected unlock handler and advances the
    article's cognitive purpose.
12. **Bounded blast-radius claims.** A broken shared guard or gateway can
    affect many consumers, but the local gate does not prove the whole harness
    correct. It narrows, records, and makes the substrate change recoverable.
13. **Updated customization guidance.** The article now distinguishes the
    enduring integrity contract from its implementation; includes the no-test
    warning and possible local-versus-CI tiers; treats the prefix registry as a
    cross-plugin contract; describes current revert fields before proposing
    extensions; and proposes meaningful higher-risk gates.
14. **Corrected metadata and narration state.** Git history fixes publication
    to May 14, 2026; the page records the September 10 revision and an
    eight-minute read. The RSS description now distinguishes active repair from
    defensive rollback. The stale audio player is hidden and its transcript is
    non-final.

## Removal and replacement ledger

There are no standalone visible-paragraph deletions. Every substantive removal
inside a retained part of the arc is accounted for below:

- **“Every prompt and every tool call” was removed.** The hook registry is
  event-specific. The replacement preserves phase independence without
  claiming continuous execution.
- **The single undifferentiated lock description was replaced.** The article
  now separates admission, protected scope, deliberate close-out, and automatic
  recovery so the reader can understand where each guarantee begins.
- **“Session end closes the lock” was removed.** The inspected registry does
  not install a general session-end safe-lock. Phase transitions, plugin
  switches, completion questions, and out-of-scope guarded actions provide the
  actual boundaries.
- **“Pass commits, fail reverts” was removed as a universal flow.** It described
  only the defensive path. Active failure preserves the work and lock so the
  agent can diagnose and fix it.
- **The universal-adoption claim was replaced.** The mechanism is one
  historical reference architecture's answer; the portable contract is the
  reason an architect should
  retain an equivalent boundary.
- **The claim that every test requires `[TEST-LOCK]` was narrowed.** Existing
  shell tests require it; new shell test creation is admitted and becomes
  protected afterward.
- **The eighty-percent coverage statement and “every behavior has a test” were
  removed.** Repository test counts cannot prove either claim. The replacement
  keeps the important demand for regression evidence.
- **“Friction is ceremony, not enforcement” was replaced.** The shaped
  explanation is ceremony, and hook rejection is enforcement for routed tool
  calls. Neither removes operator-level access.
- **The claim that one regression poisons every action was narrowed.** Shared
  dependencies can amplify failures, but impact follows actual consumers and
  events rather than every subagent, phase, and voice universally.
- **“Inherit, not rewrite” was replaced with “preserve the contract.”** An
  architect can improve or replace the shell implementation without weakening
  integrity if scope, authority, evidence, and recovery remain.
- **The flat pass-threshold description was replaced.** The current runner
  includes per-test timeouts and a no-tests warning; proposed tiers now build
  from those facts.
- **The prefix registry was removed from `plugin_integrity`'s sole ownership.**
  It is shared with `question_discipline`; adding a ceremony changes validation,
  the owner handler, tests, and voice together.
- **Proposed revert-log fields that already existed were replaced.** Failed
  tests, file paths, and a recovery SHA are current facts. Environment,
  artifact links, job/cycle ownership, and recovery outcome are real extension
  opportunities.
- **A proposed third lock for direct `data.json` editing was replaced.** Direct
  state access is already prohibited. A reviewed schema-migration ceremony is
  a useful higher-risk extension.
- **Private evidence locators were removed from ref tags.** The public markers
  retain paragraph-level traceability and say that the claim was checked
  against a private historical prototype, without exposing its repository,
  revision, paths, or unpublished evidence details.
- **The public audio player was removed from this revision.** Its MP3 narrates
  the superseded source. The asset remains available for comparison and later
  replacement after Hadi approves the writing.

## Evidence and review state

Implementation-specific claims were checked read-only against a private
historical prototype. Its repository identity, revision, source paths, and
unpublished evidence details are intentionally omitted from this public
record.

Factual, technical, chronology, editorial, metadata, and source-page parity
gates pass for the exact source hash. Cross-writing consistency remains
provisional until the remaining technical series is reviewed. Hadi's content
lock remains pending.

## Validation

- Visible words: 1,455 at baseline; 1,888 after review; net `+433` (`+29.8%`).
- Canonical Markdown and published article body: in sync.
- Existing transcript: explicitly non-final; stale player hidden.
- Publication origin: commit
  `7728f576436d634eaf091f69e7a22513bc042ac6`, May 14, 2026.
- Relevant repository validators and `git diff --check`: passed.
