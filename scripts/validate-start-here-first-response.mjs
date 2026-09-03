#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const exactQuestion =
  'Before we begin, would you like to continue conversationally—with me learning about you and explaining the ideas through a natural back-and-forth—or would you like to view the default Phase 0 presentation first?';

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath}: missing required onboarding surface`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(relativePath, source, text) {
  if (!source.includes(text)) errors.push(`${relativePath}: missing ${JSON.stringify(text)}`);
}

const syllabus = read('start-here-agent.md');
const page = read('start-here.html');

requireText('start-here-agent.md', syllabus, 'Syllabus version: 2026-09-03.4');
requireText('start-here-agent.md', syllabus, '## First response — choose the interaction mode');
requireText('start-here-agent.md', syllabus, exactQuestion);
requireText('start-here-agent.md', syllabus, 'Your first user-visible response must ask only this question');
requireText('start-here-agent.md', syllabus, 'Do not deliver the default Phase 0 material as an article');
requireText('start-here-agent.md', syllabus, 'Conversational mode changes the presentation, not the substance or gate');

const modeHeading = syllabus.indexOf('## First response — choose the interaction mode');
const orientationHeading = syllabus.indexOf('## Zero-context orientation');
if (modeHeading < 0 || orientationHeading < 0 || modeHeading > orientationHeading) {
  errors.push('start-here-agent.md: interaction-mode gate must precede zero-context orientation');
}

requireText('start-here.html', page, 'data-agent-phase="interaction-mode"');
requireText('start-here.html', page, exactQuestion);
requireText('start-here.html', page, 'Your first response must contain no Phase 0 explanation');
requireText('start-here.html', page, 'without turning it into an article or lecture');

const modeRule = page.indexOf('data-agent-phase="interaction-mode"');
const tempoRule = page.indexOf('data-agent-phase="tempo"');
const starterPrompt = page.indexOf('<pre id="start-core-prompt">');
if (modeRule < 0 || tempoRule < 0 || modeRule > tempoRule) {
  errors.push('start-here.html: interaction-mode rule must be the first visible agent operating rule');
}
if (starterPrompt < 0 || page.indexOf('Your first response must contain no Phase 0 explanation', starterPrompt) < 0) {
  errors.push('start-here.html: copied starter instruction must enforce the first-response gate');
}

if (errors.length) {
  console.error('\nStart Here first-response validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Start Here first-response validation passed: mode question precedes Phase 0 presentation.');
