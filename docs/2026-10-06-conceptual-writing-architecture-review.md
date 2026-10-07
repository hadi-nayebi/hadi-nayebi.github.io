# Conceptual writing architecture review — October 6, 2026

## Decision

Public conceptual writing no longer uses one global numbered sequence.

The reader-facing architecture is:

1. **Foundational Trilogy**
   - *LLMs Are Not the Agents*
   - *We Could Have Had AGI By Now*
   - *Your Brain Was Never Built for This*
2. **Vocabulary & Reference**
   - *The Language of Agents* as the human-readable bridge
   - Canonical Abstraction Library as the current definition source
3. **Conceptual Branches**
   - *The Folder Is Alive*
   - *The AI That Grows With You*
   - *One Agent, Many Doors*
   - future reviewed principle essays attach by question/relationship rather than global number
4. **Technical Architecture**
   - B5–B9 retain local numbering because ordered sequence still supports technical study

Existing B1–B4 paths remain unchanged for compatibility.

## Version-history boundary

The revised foundational trilogy continues to link its earlier Markdown manuscripts from each article footer. Those historical sources remain public evidence of the Academy's evolving context; this PR does not remove or rewrite them.

## Narration boundary

The revised trilogy has no visible audio player. Legacy transcripts remain `final: false` archival artifacts, and no current MP3 exists at the trilogy publication paths. New narration must be generated only after the revised canonical sources are approved and source-locked.

## Discovery surfaces updated

- `content.html#principles` now contains a four-part conceptual reading map.
- About removes the stale public 01–04 conceptual numbering without performing the larger About-page reframing owned separately.
- *The Folder Is Alive* is labeled as a conceptual branch rather than “3.1.”
- *The Language of Agents* is labeled as the vocabulary bridge and points to the Canonical Abstraction Library.
- README describes the conceptual layer as a knowledge graph.
- Feed descriptions reflect the revised trilogy framing.
- Sitemap keeps all stable URLs and refreshes last-modified metadata for the affected public surfaces.
- `blog/AGENTS.md` instructs future writing work not to recreate the retired global conceptual numbering.

## Publication boundary

*The Model Is Just a Model* remains a draft on website PR #204 and is not added to the public index, feed, or sitemap by this PR. Its private companion drafts remain undiscoverable until separately reviewed and authorized.

## Merge dependency

This PR describes the final revised trilogy and should therefore merge after:
1. website PR #201;
2. website PR #202;
3. website PR #203.

After those land, refresh this branch against main, resolve any generated/discovery drift, rerun validation, inspect rendered phone/desktop evidence, then merge this PR.

## Distribution follow-up

Departments PR #301 owns the LinkedIn launch of the Foundational Trilogy. Its final CTA depends on the public conceptual reading map being live.
