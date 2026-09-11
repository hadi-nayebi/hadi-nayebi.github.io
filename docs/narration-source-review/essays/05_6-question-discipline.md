# Essay 5.6 review: Structured Questions

## TLDR

This bounded pass preserves the complete structured-question argument and all
examples. The article moves from 2,084 to 2,034 visible words. It now leads
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
7. The consecutive series read removed one paragraph that repeated the
   immediately preceding prefix-coverage conclusion without adding a new step.

## Removal and replacement ledger

- The answer-capture explanation was replaced because it assigned admission
  and state mutation to the wrong side of the protocol.
- The universal prefix statement was narrowed because one registered prefix
  deliberately follows a different route.
- The unsupported size superlative was removed without changing the claim that
  a small mechanism can impose a strong interaction contract.
- The repeated coverage conclusion was removed so the article moves directly
  from prefix-wide body shapes into job-specific extended shapes.
- No narrative section, question example, analogy, or core principle was
  removed.

## Review record

- Baseline: `ed70bb941467ce90dc4febd18501efead53217eb`
- Version: `v0.5.0`
- Source SHA-256: `99875b9fca03ef6ae89b3a5a5950dd5babc6743fd6e2eb0b87cd161ff97a8f65`
- Published-page SHA-256: `27e314eecfb3cd16b60df859157564d8d4eafe7e775256e8df7b16126dd735e4`
- Visible words: 2,084 to 2,034; net `-50`.
- Markdown/HTML parity, metadata, transcript state, site validators, and
  `git diff --check`: passed.
- Detailed historical prefix and phase mechanics were preserved under the
  requested obvious-error pass. Cross-writing consistency remains provisional;
  Hadi's content lock remains pending.
