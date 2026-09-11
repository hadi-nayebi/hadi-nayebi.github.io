# Essay 07.4 review: data.json — The Hidden State

## TLDR

This mature article received a bounded obvious-error pass. Its hidden-state boundary, serialized mutation protocol, schema evolution, and interface-first design remain intact. The corrections distinguish migration from corruption recovery and remove a universal rebuild claim that would be unsafe for valuable state.

## Substantive changes

1. The file layout is identified as one historical Claude-based reference architecture; the portable rule keeps component-owned state behind a stable interface.
2. Exact private commands and component names were replaced with public-facing descriptions of the state interface.
3. Recovery now depends on the value of the state: cheap state may rebuild, while valuable job state may block for repair.
4. Valid older-state migration is explicitly separated from malformed-state recovery.
5. The injection timing is corrected from before every edit to before an authorized editing session.
6. The canonical image instruction uses a machine-local lockfile and a recovery policy rather than a private path and universal rebuild.
7. All eight ref tags retain their IDs and use generalized private verification.

## Removal and replacement ledger

- The universal rebuild path was replaced because valuable job state must not be silently erased.
- Exact private commands, paths, plugin names, migration internals, and evidence payloads were removed from the public surface.
- No section, example, protocol step, image instruction, or narrative beat was removed.

## Review record

- Baseline: `2664c97e80c73943a217715b88abfac36e19935a`
- Version: `v0.2.0`
- Source SHA-256: `24a34739957892c2281588258c991bcb088068ec5b14c477aa8dc15fb4e7bcd4`
- Published-page SHA-256: `e34efccca127b7aae9f4178f38eaf9bdbb8094ba0a16a56a44eced9f7ecb623d`
- Recorded source words: 1,327 to 1,335; net `+8`.
- Metadata uses the repository introduction date and records the September 11 review. The transcript is non-final and the stale audio player is hidden.
- Cross-writing consistency passed the complete narration-source continuity review. Hadi's content lock remains pending.
