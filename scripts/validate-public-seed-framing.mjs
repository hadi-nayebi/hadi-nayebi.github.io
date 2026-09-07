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
  ['about.html', read('about.html')],
  ['contact.html', read('contact.html')],
  ['support.html', read('support.html')],
  ['thanks-support.html', read('thanks-support.html')],
  ['seed-access.html', read('seed-access.html')],
  ['agents.html', read('agents.html')],
  ['projects/index.html', read('projects/index.html')],
  ['projects/seed-agent.html', read('projects/seed-agent.html')],
  ['projects/q-seed.html', read('projects/q-seed.html')],
  ['CONTRIBUTING.md', read('CONTRIBUTING.md')],
  ['blog/b8/08_9-the-seed-is-yours.md', read('blog/b8/08_9-the-seed-is-yours.md')],
  ['blog/b8/08_9-the-seed-is-yours.html', read('blog/b8/08_9-the-seed-is-yours.html')],
  ['js/story-visuals.js', read('js/story-visuals.js')],
  ['js/theme-manager.js', read('js/theme-manager.js')]
]);

requireText('index.html', surfaces.get('index.html'), 'Seed Agent and Q-Seed are framework-specific places where selected foundations can accumulate');
requireText('index.html', surfaces.get('index.html'), 'public Seed pattern repositories');
requireText('about.html', surfaces.get('about.html'), 'The technical writings are the shared, framework-agnostic layer');
requireText('support.html', surfaces.get('support.html'), 'accumulate framework-specific patterns');
requireText('seed-access.html', surfaces.get('seed-access.html'), 'preserved as evidence, not as a product base or public release candidate');
requireText('js/theme-manager.js', surfaces.get('js/theme-manager.js'), 'Follow public Seed pattern repositories');
requireText('agents.html', surfaces.get('agents.html'), 'Shared principles, different accumulation surfaces');
requireText('projects/index.html', surfaces.get('projects/index.html'), 'Pattern accumulation');
requireText('projects/seed-agent.html', surfaces.get('projects/seed-agent.html'), 'Codex pattern accumulation');
requireText('projects/q-seed.html', surfaces.get('projects/q-seed.html'), 'Qwen Code-specific pattern-accumulation surface');
requireText('CONTRIBUTING.md', surfaces.get('CONTRIBUTING.md'), 'public pattern-accumulation');
requireText('blog/b8/08_9-the-seed-is-yours.md', surfaces.get('blog/b8/08_9-the-seed-is-yours.md'), 'technical writings are the primary framework-agnostic source');
requireText('blog/b8/08_9-the-seed-is-yours.html', surfaces.get('blog/b8/08_9-the-seed-is-yours.html'), 'technical writings are the primary framework-agnostic source');
requireText('js/story-visuals.js', surfaces.get('js/story-visuals.js'), 'Three sources, many distinct harnesses.');
forbidText('js/story-visuals.js', surfaces.get('js/story-visuals.js'), 'agents-lineage-educational-v2.jpg');
forbidText('seed-access.html', surfaces.get('seed-access.html'), 'public Seed is reimplemented on Codex');
forbidText('seed-access.html', surfaces.get('seed-access.html'), 'public Codex reimplementation');
forbidText('seed-access.html', surfaces.get('seed-access.html'), 'Codex Seed Project');

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
  'not ready',
  'The architectures are the same',
  'clone, install, and run your first stage-1 cycle',
  'At 1,000 subscribers, the plan is to graduate',
  'Public CLI Seeds',
  'public CLI Seeds',
  'public Seed implementations',
  'open-source Seed implementations',
  'Seed Implementations',
  'Seed implementations',
  'Some will clone a mature Seed',
  'Start from a mature public Seed',
  'one reference implementation and two public reimplementation paths',
  'One technical lineage, two public implementation paths',
  'primary public implementation'
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
