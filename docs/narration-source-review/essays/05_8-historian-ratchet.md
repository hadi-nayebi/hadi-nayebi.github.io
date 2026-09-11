# Essay 5.8 review: The Historian Ratchet

## TLDR

The essay keeps its central pattern: ordinary change accumulates documentation
debt, a threshold blocks the next edit ceremony, and a committed history update
resets the gauge. The revision preserves the live ten-commit threshold and
2,000-word cap, separates Git evidence from narrated interpretation, and
corrects which plugins actually own the composed unlock path.

## Reviewed revision

- Canonical source: `blog/b5/05_8-historian-ratchet.md`
- Source version: `v0.4.0` (previously `v0.3.0`)
- Source SHA-256: `c71a50f1328a2e748bc57ecdda95cf8c9ce79b935ba2ab403da5b90ffea79e00`
- Published page: `blog/b5/05_8-historian-ratchet.html`
- Published-page SHA-256: `f9c887a2f99977528798f424b240471789442a788b5998fa22f2b4b2a904b35f`
- Hadi's narration-source approval remains pending.

## Changes made

1. Located the historian mechanism inside the earlier private Claude Code
   prototype rather than presenting it as a native platform feature.
2. Distinguished Git's precise mechanical record from `evolution.md`'s
   concise and fallible interpretation of that evidence.
3. Narrowed “every plugin” to participating plugins and preserved unlock-time
   injection of the living history plus recent unsummarized commits.
4. Preserved the live drift calculation: commits after the most recent
   `evolution.md` commit, with a default threshold of ten.
5. Clarified that a historian edit must be committed because file modification
   time does not affect the counter.
6. Corrected historian scope to plugin documentation and retained the mandated
   protagonist voice, first-backfill path, and incremental path.
7. Expanded the live 2,000-word cap accurately across projected file edits,
   blocked shell-write paths, and the post-write backstop.
8. Added the distinction between the bounded, auto-injected evolution narrative
   and uncapped sibling decision or lesson archives.
9. Qualified the ratchet metaphor. The mechanism creates periodic forward
   pressure inside a hook boundary; it does not make knowledge irreversible or
   guarantee a good historical synthesis.
10. Corrected the composed ceremony. `plugin_integrity` captures the lock
    answer; `job_core` contributes persistent plugin approval state rather
    than carrying that answer.
11. Mapped the full composition to question admission, phase and job
    authorization, and `plugin_integrity` drift, unlock, test, and recovery
    ownership.
12. Marked the second diagram historical because its “job_core carries the
    answer” label does not match the live handler ownership.
13. Corrected the May 14, 2026 publication date, September 10 modification
    date, seven-minute reading time, RSS summary, sitemap date,
    adjacent-series reading times, and stale audio player.

## Evidence and review state

Prototype claims were checked against the private Claude reference at parent
revision `3395d2d048f44435546ab055d0c2f4c32a34fd25`, including
`drift-check.sh`, the historian template and live agents, `evolution-cap.sh`,
the plugin integrity configuration, the lock manager's pre- and post-question
paths, protected-context admission, and safe-lock ownership. The private
prototype was not modified.

Factual, technical, chronology, editorial, and source-page parity gates pass
for the exact source hash. Cross-writing consistency remains provisional until
the B5 series is reviewed. Hadi's content lock remains pending.

## Validation

- Safe Markdown-body synchronization and unlocked-narration check: passed.
- Publication traced to commit
  `f947ff528a4e296e889ff6524a3715b0d7867993` on May 14, 2026.
- Visible source reduced from about 2,290 to about 1,367 words.
- Narration corpus focused audit: passed.
- `git diff --check`: passed.
