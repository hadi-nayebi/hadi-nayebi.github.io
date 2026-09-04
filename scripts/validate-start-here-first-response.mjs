#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const retiredModeQuestion =
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

function forbidText(relativePath, source, text) {
  if (source.includes(text)) errors.push(`${relativePath}: contains retired ${JSON.stringify(text)}`);
}

const syllabus = read('start-here-agent.md');
const page = read('start-here.html');

requireText('start-here-agent.md', syllabus, 'Syllabus version: 2026-09-04.1');
requireText('start-here-agent.md', syllabus, '## First response — recall the user and establish the path');
requireText('start-here-agent.md', syllabus, 'recall all reliable context available to you');
requireText('start-here-agent.md', syllabus, 'Conversation is the default');
requireText('start-here-agent.md', syllabus, '## Two-context synthesis across the entire journey');
requireText('start-here-agent.md', syllabus, 'The output must be a bridge between them');
requireText('start-here-agent.md', syllabus, 'The nine phases are a recommended developmental scaffold, not a rigid script');
requireText('start-here-agent.md', syllabus, 'structured form, not generic content and never a replication of the website');
requireText('start-here-agent.md', syllabus, 'Do not invent familiarity');
forbidText('start-here-agent.md', syllabus, retiredModeQuestion);

const contextualHeading = syllabus.indexOf('## First response — recall the user and establish the path');
const orientationHeading = syllabus.indexOf('## Zero-context orientation');
const synthesisHeading = syllabus.indexOf('## Two-context synthesis across the entire journey');
if (
  contextualHeading < 0 ||
  orientationHeading < 0 ||
  synthesisHeading < 0 ||
  contextualHeading > orientationHeading ||
  orientationHeading > synthesisHeading
) {
  errors.push('start-here-agent.md: contextual start and two-context synthesis must precede the remaining syllabus');
}

requireText('start-here.html', page, 'data-agent-phase="contextual-start"');
requireText('start-here.html', page, 'Recall the user, then establish a personalized path');
requireText('start-here.html', page, 'Conversation is the default');
requireText('start-here.html', page, 'combine two living contexts');
requireText('start-here.html', page, 'never a generic replication of the website');
requireText('start-here.html', page, 'Treat the nine phases as a recommended developmental scaffold');
requireText('start-here.html', page, 'briefly reflect only the relevant high-confidence context');
forbidText('start-here.html', page, retiredModeQuestion);
forbidText('start-here.html', page, 'data-agent-phase="interaction-mode"');

const contextualRule = page.indexOf('data-agent-phase="contextual-start"');
const tempoRule = page.indexOf('data-agent-phase="tempo"');
const starterPrompt = page.indexOf('<pre id="start-core-prompt">');
if (contextualRule < 0 || tempoRule < 0 || contextualRule > tempoRule) {
  errors.push('start-here.html: contextual-start rule must be the first visible agent operating rule');
}
if (
  starterPrompt < 0 ||
  page.indexOf('briefly reflect only the relevant high-confidence context', starterPrompt) < 0 ||
  page.indexOf('Every explanation, question, example, and artifact must be a personalized bridge', starterPrompt) < 0
) {
  errors.push('start-here.html: copied starter instruction must enforce contextual synthesis');
}

if (errors.length) {
  console.error('\nStart Here first-response validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Start Here first-response validation passed: user context and Hadosh context produce a personalized path.');
