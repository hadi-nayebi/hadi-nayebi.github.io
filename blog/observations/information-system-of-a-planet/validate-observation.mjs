import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const fail = (message) => {
  console.error(`Observation validation failed: ${message}`);
  process.exit(1);
};

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.relative(root, file)} is not valid JSON: ${error.message}`);
  }
};

const seriesPath = path.join(root, 'series.json');
if (!fs.existsSync(seriesPath)) fail('series.json is missing');
const series = readJson(seriesPath);

if (series.id !== 'observation-1-information-system-of-a-planet') fail('unexpected series id');
if (series.observation_number !== 1) fail('observation_number must be 1');
if (!series.title || !series.series_objective) fail('series title/objective missing');
if (!Array.isArray(series.episode_index)) fail('episode_index must be an array');

const visualCategories = new Set(['I90-A10', 'I70-A30', 'I50-A50', 'I30-A70', 'I10-A90']);
const seenNumbers = new Set();
let expectedNumber = 1;

for (const item of series.episode_index) {
  if (!Number.isInteger(item.number) || item.number < 1) fail('episode index number must be a positive integer');
  if (item.number !== expectedNumber) fail(`episode index must be sequential; expected ${expectedNumber}, found ${item.number}`);
  expectedNumber += 1;
  if (seenNumbers.has(item.number)) fail(`duplicate episode number ${item.number}`);
  seenNumbers.add(item.number);
  if (!item.slug || !item.path || !item.title) fail(`episode ${item.number} index entry is incomplete`);

  const episodePath = path.join(root, item.path);
  if (!fs.existsSync(episodePath)) fail(`episode ${item.number} file is missing: ${item.path}`);
  const episode = readJson(episodePath);

  if (episode.number !== item.number) fail(`episode ${item.number} number does not match index`);
  if (episode.slug !== item.slug) fail(`episode ${item.number} slug does not match index`);
  if (episode.title !== item.title) fail(`episode ${item.number} title does not match index`);
  if (!episode.objective || typeof episode.objective !== 'string') fail(`episode ${item.number} objective missing`);
  if (!Array.isArray(episode.learning_outcomes) || episode.learning_outcomes.length < 2 || episode.learning_outcomes.length > 5) {
    fail(`episode ${item.number} must have 2–5 learning outcomes`);
  }
  if (!episode.continuity || typeof episode.continuity !== 'string') fail(`episode ${item.number} continuity note missing`);
  if (!episode.discussion_term || typeof episode.discussion_term !== 'string') fail(`episode ${item.number} discussion_term missing`);
  if (!Array.isArray(episode.slides) || episode.slides.length === 0) fail(`episode ${item.number} has no slides`);

  const seenSlideIds = new Set();
  for (const slide of episode.slides) {
    if (!slide.id || seenSlideIds.has(slide.id)) fail(`episode ${item.number} has missing/duplicate slide id`);
    seenSlideIds.add(slide.id);
    if (!slide.title || typeof slide.title !== 'string') fail(`episode ${item.number} slide ${slide.id} title missing`);
    if (typeof slide.read_minutes !== 'number' || slide.read_minutes < 1 || slide.read_minutes > 5) {
      fail(`episode ${item.number} slide ${slide.id} read_minutes must be between 1 and 5`);
    }
    if (!Array.isArray(slide.paragraphs) || slide.paragraphs.length === 0 || slide.paragraphs.some((p) => typeof p !== 'string' || !p.trim())) {
      fail(`episode ${item.number} slide ${slide.id} needs non-empty narration paragraphs`);
    }
    if (!slide.image || !slide.image.src || !slide.image.alt || !visualCategories.has(slide.image.category)) {
      fail(`episode ${item.number} slide ${slide.id} image metadata is incomplete`);
    }
    const imagePath = path.join(root, slide.image.src);
    if (!fs.existsSync(imagePath)) fail(`episode ${item.number} slide ${slide.id} image file is missing: ${slide.image.src}`);
    if (!slide.audio || !slide.audio.src || !['placeholder', 'available'].includes(slide.audio.status)) {
      fail(`episode ${item.number} slide ${slide.id} audio metadata is incomplete`);
    }
    if (slide.audio.status === 'available' && !fs.existsSync(path.join(root, slide.audio.src))) {
      fail(`episode ${item.number} slide ${slide.id} audio marked available but file is missing`);
    }
    if (!Array.isArray(slide.sources) || slide.sources.length === 0) {
      fail(`episode ${item.number} slide ${slide.id} needs at least one source`);
    }
    for (const source of slide.sources) {
      if (!source.label || !source.url || !/^https?:\/\//.test(source.url)) {
        fail(`episode ${item.number} slide ${slide.id} has an invalid source`);
      }
    }
  }
}

console.log(`Observation validation passed: ${series.episode_index.length} episode(s).`);
