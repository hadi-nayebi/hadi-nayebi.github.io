# Essay 5.6 review: Structured Questions

## TLDR

This bounded pass preserves the complete structured-question argument and all
examples. The article grows from 2,084 to 2,116 visible words. It now leads
with the framework-generic need for explicit question protocols, labels the
named Claude implementation historically, correctly assigns answer capture to
the owning handler, and accounts for the command-approval exception.

## Substantive changes

1. The opening and tool surface are framework-generic before describing the
   historical `question_discipline` implementation.
2. Answer capture is no longer described as question-side admission. The
   protocol validates the question shape; the owning handler consumes the
   answer and performs its state transition.
3. “Every prefix” became “nearly every prefix” because command approval is an
   explicit exception to the usual answer-capture route.
4. “Smallest plugin” became “small code footprint”; repository inspection did
   not support the superlative.
5. All sixteen ref tags and rendered tooltips use generalized private
   historical verification without identifying evidence.
6. Metadata records the May 18 publication date and September 11 review. The
   old transcript is non-final and its stale audio player is hidden.

## Removal and replacement ledger

- The answer-capture explanation was replaced because it assigned admission
  and state mutation to the wrong side of the protocol.
- The universal prefix statement was narrowed because one registered prefix
  deliberately follows a different route.
- The unsupported size superlative was removed without changing the claim that
  a small mechanism can impose a strong interaction contract.
- No narrative section, question example, analogy, or core principle was
  removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.5.0`
- Source SHA-256: `23e5e6a865a17f46fd5940c7eb8348c8dbf5c88e19bbf0ef02062a5df9c51165`
- Published-page SHA-256: `0fa2a5bf3f53ac7e78b3d818840551422011fad8956b6a32e1e4d867a265c0b2`
- Visible words: 2,084 to 2,116; net `+32`.
- Markdown/HTML parity, metadata, transcript state, site validators, and
  `git diff --check`: passed.
- Detailed historical prefix and phase mechanics were preserved under the
  requested obvious-error pass. Cross-writing consistency remains provisional;
  Hadi's content lock remains pending.
