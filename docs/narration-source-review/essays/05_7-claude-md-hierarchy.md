# Essay 5.7 review: The CLAUDE.md Hierarchy

## TLDR

This mature article received a bounded obvious-error pass. Its hierarchy,
working-memory, deflation, and portability arc remains intact. The article
moves from 2,760 to 2,744 visible words. It now begins with the generic pattern
of scoped project instructions, presents `CLAUDE.md` as one historical Claude
implementation, reflects current Claude Code loading behavior, and resolves
the contradiction between “empty footers” and deferred fragments.

## Substantive changes

1. The generic instruction hierarchy leads; the named Claude hierarchy is the
   historical reference implementation rather than the universal pattern.
2. Claude Code loading, `/memory`, nested instruction reload, and `/compact`
   wording were corrected against current public documentation.
3. “Plugins work in parallel” was replaced because plugins attach to different
   events and may cooperate without executing simultaneously.
4. The footer section now agrees with its own deflation rule: consumed material
   is removed, while genuinely deferred fragments may remain for a later cycle.
5. Caption grammar and the inaccurate “four-state lifecycle” phrase were fixed.
6. A private repository tree was replaced with a generic workspace example.
7. Plugin-state behavior is explicitly scoped to the historical reference
   architecture, and an unpublished exact instruction-file count was removed.
8. All twenty-three ref tags and rendered tooltips use generalized private
   verification. Current provider behavior links to public documentation.
9. Metadata records the May 18 publication date and September 11 review. The
   transcript is non-final and the stale audio player is hidden.

## Removal and replacement ledger

- The Claude-first universal framing was replaced with the portable scoped-
  instruction principle.
- “Plugins work in parallel” was removed because event attachment and
  cooperation do not imply simultaneous execution.
- The claim that footers end empty was replaced because deferred fragments can
  remain under the article's stated lifecycle.
- The private tree and unpublished exact file count were removed because they
  were unnecessary to teach the hierarchy.
- No narrative section, analogy, working-memory example, or portable principle
  was removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.5.0`
- Source SHA-256: `1a92facddae3380dc6196e77768d9bf558200c0e1aa686c7854944b0f933d748`
- Published-page SHA-256: `9f1de9c55bd11e0729893b77e53184168fec8766811e1ab7fa6a519857735197`
- Visible words: 2,760 to 2,744; net `-16`.
- Markdown/HTML parity, metadata, transcript state, links, site validators, and
  `git diff --check`: passed.
- Detailed historical slot and phase behavior was preserved under the requested
  obvious-error pass. Cross-writing consistency remains provisional; Hadi's
  content lock remains pending.
