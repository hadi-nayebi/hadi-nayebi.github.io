#!/usr/bin/env node

import assert from 'node:assert/strict';
import {
  artifactSha256,
  canonicalNarrationJson,
  narrationSha256,
} from './lib/observation-narration-hash.mjs';

const episode = {
  number: 1,
  state_change: 'metadata',
  slides: [
    { id: '01', title: 'First', paragraphs: ['One.', 'Two.'], image: { src: 'one.jpg' } },
    { id: '02', title: 'Second', paragraphs: ['Three.'], sources: [] },
  ],
};

const source = `${JSON.stringify(episode, null, 2)}\n`;
assert.equal(artifactSha256(source), artifactSha256(source));
assert.equal(narrationSha256(episode), narrationSha256(structuredClone(episode)));
assert.equal(
  canonicalNarrationJson(episode),
  '{"schema":"observation-narration-v1","slides":[{"id":"01","title":"First","paragraphs":["One.","Two."]},{"id":"02","title":"Second","paragraphs":["Three."]}]}',
);

const metadataOnly = structuredClone(episode);
metadataOnly.state_change = 'new metadata';
const metadataSource = `${JSON.stringify(metadataOnly, null, 2)}\n`;
assert.notEqual(artifactSha256(source), artifactSha256(metadataSource));
assert.equal(narrationSha256(episode), narrationSha256(metadataOnly));

for (const mutate of [
  (copy) => { copy.slides[0].paragraphs[0] = 'Changed.'; },
  (copy) => { copy.slides[0].title = 'Changed'; },
  (copy) => { copy.slides.reverse(); },
]) {
  const copy = structuredClone(episode);
  mutate(copy);
  assert.notEqual(narrationSha256(episode), narrationSha256(copy));
}

for (const invalid of [
  { slides: [{ id: '01', title: 'First' }] },
  { slides: [{ id: '01', title: '', paragraphs: ['One.'] }] },
  { slides: [{ id: '01', title: 'First', paragraphs: ['One.'] }, { id: '01', title: 'Again', paragraphs: ['Two.'] }] },
]) {
  assert.throws(() => narrationSha256(invalid));
}

console.log('Observation narration hash contract: 8 cases passed');
