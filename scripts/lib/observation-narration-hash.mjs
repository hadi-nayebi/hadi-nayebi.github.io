import crypto from 'node:crypto';

export const NARRATION_SCHEMA = 'observation-narration-v1';

export function artifactSha256(source) {
  if (typeof source !== 'string' && !Buffer.isBuffer(source)) {
    throw new TypeError('artifact source must be a string or Buffer');
  }
  return crypto.createHash('sha256').update(source).digest('hex');
}

export function canonicalNarrationPayload(episode) {
  if (!episode || !Array.isArray(episode.slides) || episode.slides.length === 0) {
    throw new Error('episode requires a non-empty slides array');
  }

  const ids = new Set();
  const slides = episode.slides.map((slide, index) => {
    if (!slide || typeof slide.id !== 'string' || slide.id.length === 0) {
      throw new Error(`slide ${index + 1} requires a non-empty id`);
    }
    if (ids.has(slide.id)) throw new Error(`duplicate slide id: ${slide.id}`);
    ids.add(slide.id);
    if (typeof slide.title !== 'string' || slide.title.length === 0) {
      throw new Error(`slide ${slide.id} requires a non-empty title`);
    }
    if (!Array.isArray(slide.paragraphs) || slide.paragraphs.length === 0) {
      throw new Error(`slide ${slide.id} requires a non-empty paragraphs array`);
    }
    if (slide.paragraphs.some((paragraph) => typeof paragraph !== 'string' || paragraph.length === 0)) {
      throw new Error(`slide ${slide.id} paragraphs must be non-empty strings`);
    }
    return { id: slide.id, title: slide.title, paragraphs: slide.paragraphs };
  });

  return { schema: NARRATION_SCHEMA, slides };
}

export function canonicalNarrationJson(episode) {
  return JSON.stringify(canonicalNarrationPayload(episode));
}

export function narrationSha256(episode) {
  return artifactSha256(canonicalNarrationJson(episode));
}
