# One Agent, Many Doors — implementation-alignment review

- **Public baseline:** website PR #137, original head `781bfed41daf91866d1c7c9a1f69e2fd12cd1dc3`
- **Scope:** principle essay Markdown and its published HTML body
- **Evidence:** public Origin repository PRs #9–#12 and their executable documentation
- **Narration status:** this standalone essay is outside the current approved narration-source corpus

## Issues found

The first draft correctly described one relationship across independent channels, durable delivery,
and user-owned acceptance. The implementation then made that last boundary more concrete: Telegram
became text-first with optional speech, each actionable parent thread became one managed worktree and
one linked GitHub PR, and owner merge became the only normal resolution path. The draft did not yet
describe those implemented constraints or the local-hook versus remote-branch-protection boundary.

## Changes made

The revision separates Telegram text from optional transcription and cloned voice, adds the
thread/worktree/PR unit, explains GitHub-confirmed owner merge and reopening, and states what the
trusted PreToolUse hook can and cannot guarantee. The closing image now follows a request through
thread, branch, PR, and accepted history.

## Remaining uncertainty

The Origin PR stack is reviewable but not yet merged, and authenticated owner-machine GitHub,
dashboard, Telegram, and cross-platform acceptance remains outstanding. The essay therefore presents
the mechanism as Origin's implemented direction and preserves its explicit evidence levels rather
than claiming general availability.

## Validation

Markdown and HTML body parity, site navigation, contribution surfaces, Start Here separation,
storytelling visuals, What's New ordering, XML parsing, and whitespace checks must pass on the final
PR head.
