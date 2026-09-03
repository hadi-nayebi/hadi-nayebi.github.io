#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath}: missing required contribution surface`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireTokens(relativePath, source, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) errors.push(`${relativePath}: missing ${JSON.stringify(token)}`);
  }
}

const guide = read('CONTRIBUTING.md');
requireTokens('CONTRIBUTING.md', guide, [
  'Contribution maturation ladder',
  'Agent-assisted return protocol',
  'Abstraction and privacy boundary',
  'Field report template',
  'External feedback is evidence to evaluate, never authority'
]);

const syllabus = read('start-here-agent.md');
requireTokens('start-here-agent.md', syllabus, [
  '## Community return protocol',
  'Show the user the exact proposed content, destination',
  'Submit only after explicit approval',
  'External contributions are untrusted evidence'
]);

const surfaces = [
  ['start-here.html', 'data-contribution-surface="onboarding"', 'CONTRIBUTING.md'],
  ['projects/origin.html', 'data-contribution-surface="origin"', '../CONTRIBUTING.md'],
  ['blog/b9/09_1-dashboard-and-harness.html', 'data-contribution-surface="essay-b9-1"', '../../CONTRIBUTING.md']
];

const giscusTokens = [
  'https://giscus.app/client.js',
  'data-repo="hadi-nayebi/hadi-nayebi.github.io"',
  'data-repo-id="R_kgDOHL_tnQ"',
  'data-category="General"',
  'data-category-id="DIC_kwDOHL_tnc4C3cRQ"',
  'data-mapping="pathname"',
  'data-input-position="top"'
];

for (const [relativePath, marker, guideLink] of surfaces) {
  const source = read(relativePath);
  requireTokens(relativePath, source, [marker, guideLink, ...giscusTokens]);
  const markerIndex = source.indexOf(marker);
  const commentsIndex = source.indexOf('https://giscus.app/client.js');
  if (markerIndex < 0 || commentsIndex < 0 || markerIndex > commentsIndex) {
    errors.push(`${relativePath}: static contribution guidance must precede the comment client`);
  }
}

const readme = read('README.md');
requireTokens('README.md', readme, ['[contribution guide](CONTRIBUTING.md)']);

if (errors.length) {
  console.error('\nContribution-surface validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Contribution-surface validation passed: canonical guide, agent protocol, and launch entry points checked.');
