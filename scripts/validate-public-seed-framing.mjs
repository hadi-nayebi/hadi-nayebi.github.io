#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath}: missing public Seed surface`);
    return null;
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(relativePath, source, text) {
  if (source === null) return;
  if (!source.includes(text)) errors.push(`${relativePath}: missing ${JSON.stringify(text)}`);
}

function forbidText(relativePath, source, text) {
  if (source === null) return;
  if (source.includes(text)) errors.push(`${relativePath}: contains retired product framing ${JSON.stringify(text)}`);
}

const surfaces = new Map([
  ['index.html', read('index.html')],
  ['agents.html', read('agents.html')],
  ['projects/index.html', read('projects/index.html')],
  ['projects/seed-agent.html', read('projects/seed-agent.html')],
  ['projects/q-seed.html', read('projects/q-seed.html')]
]);

requireText('index.html', surfaces.get('index.html'), 'Seed Agent and Q-Seed are framework-specific places where selected foundations can accumulate');
requireText('agents.html', surfaces.get('agents.html'), 'Shared principles, different accumulation surfaces');
requireText('projects/index.html', surfaces.get('projects/index.html'), 'Pattern accumulation');
requireText('projects/seed-agent.html', surfaces.get('projects/seed-agent.html'), 'Codex pattern accumulation');
requireText('projects/q-seed.html', surfaces.get('projects/q-seed.html'), 'Qwen Code-specific pattern-accumulation surface');

const retiredPhrases = [
  'Seed Agent and Q-Seed as CLI-centered harnesses',
  'Seed Agent carries that architecture into Codex',
  'open-framework version on Qwen Code',
  'Codex Generation',
  'Codex generation',
  'The Codex and Qwen versions',
  'giving the Codex version',
  'How far can a mature Seed go above the runtime?',
  'foundation only',
  'not installable',
  'not ready'
];

for (const [relativePath, source] of surfaces) {
  for (const phrase of retiredPhrases) forbidText(relativePath, source, phrase);
}

if (errors.length) {
  console.error('\nPublic Seed framing validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Public Seed framing validation passed: writings, private evidence, pattern accumulation, and user-specific harnesses remain distinct.');
