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

function requireHiddenElement(relativePath, source, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const elementPattern = new RegExp(`<[^>]*\\bid\\s*=\\s*(["'])${escapedId}\\1[^>]*>`, 'i');
  const element = source.match(elementPattern)?.[0];
  if (!element) {
    errors.push(`${relativePath}: missing element with id ${JSON.stringify(id)}`);
    return;
  }
  if (!/(?:^|\s)hidden(?:\s*=\s*(?:["']hidden["']|hidden|["']["']))?(?=\s|>)/i.test(element)) {
    errors.push(`${relativePath}: ${JSON.stringify(id)} must remain hidden from the visitor flow`);
  }
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

requireText('start-here.html', page, 'id="continue-with-agent"');
requireText('start-here.html', page, 'href="start-here-agent.md"');
requireHiddenElement('start-here.html', page, 'start-core-prompt');
requireText('start-here.html', page, 'Read https://hadi-nayebi.github.io/start-here-agent.md');
forbidText('start-here.html', page, retiredModeQuestion);
forbidText('start-here.html', page, '<details class="start-agent-instruction"');
forbidText('start-here.html', page, 'data-agent-instruction');
forbidText('start-here.html', page, 'data-agent-phase=');
forbidText('start-here.html', page, 'Agent operating rule');
forbidText('start-here.html', page, '<span>Agent instruction</span>');
forbidText('start-here.html', page, '<span>Agent phase');
forbidText('start-here.html', page, '>For agents<');

const humanPath = page.indexOf('id="human-path"');
const agentHandoff = page.indexOf('id="continue-with-agent"');
if (humanPath < 0 || agentHandoff < 0 || humanPath > agentHandoff) {
  errors.push('start-here.html: the human path must precede the optional agent handoff');
}

if (errors.length) {
  console.error('\nStart Here first-response validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Start Here boundary validation passed: the page stays human-facing and the agent syllabus stays separate.');
