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

function walkHtml(directory) {
  const pages = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ['.git', '.claude', 'node_modules'].includes(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) pages.push(...walkHtml(absolutePath));
    else if (entry.name.endsWith('.html')) pages.push(absolutePath);
  }
  return pages;
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
  ['blog/b9/09_1-dashboard-and-harness.html', 'data-contribution-surface="essay-b9-1"', '../../CONTRIBUTING.md'],
  ['blog/b9/09_2-contextual-feedback-plugin.html', 'data-contribution-surface="essay-b9-2"', '../../CONTRIBUTING.md'],
  ['blog/b9/09_3-internal-voices-reorientation.html', 'data-contribution-surface="essay-b9-3"', '../../CONTRIBUTING.md'],
  ['blog/b9/09_4-stopping-without-forgetting.html', 'data-contribution-surface="essay-b9-4"', '../../CONTRIBUTING.md']
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

const discussionPages = walkHtml(root)
  .map(absolutePath => ({
    relativePath: path.relative(root, absolutePath).split(path.sep).join('/'),
    source: fs.readFileSync(absolutePath, 'utf8')
  }))
  .filter(page => page.source.includes('https://giscus.app/client.js'));

for (const { relativePath, source } of discussionPages) {
  requireTokens(relativePath, source, giscusTokens);
  const guideIndex = source.indexOf('CONTRIBUTING.md');
  const commentsIndex = source.indexOf('https://giscus.app/client.js');
  if (guideIndex < 0 || guideIndex > commentsIndex) {
    errors.push(`${relativePath}: contribution guide must be visible before the comment client`);
  }
  const guidance = source.slice(0, commentsIndex);
  if (!/explicit approval/i.test(guidance)) {
    errors.push(`${relativePath}: comment guidance must require explicit approval`);
  }
  if (!/(personal|private|protected|proprietary)/i.test(guidance)) {
    errors.push(`${relativePath}: comment guidance must include a privacy boundary`);
  }
}

const readme = read('README.md');
requireTokens('README.md', readme, ['[contribution guide](CONTRIBUTING.md)']);

if (errors.length) {
  console.error('\nContribution-surface validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Contribution-surface validation passed: canonical guide, agent protocol, and ${discussionPages.length} comment surfaces checked.`);
