#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordPath = path.join(root, 'data', 'whats-new.json');
const pagePath = path.join(root, 'whats-new.html');
const homepagePath = path.join(root, 'index.html');
const componentsPath = path.join(root, 'js', 'components.js');
const requiredFields = [
  'id', 'date', 'type', 'title', 'summary', 'why_it_matters', 'affected',
  'maturity', 'intended_for', 'sources', 'adoption_notes', 'recommended_action'
];
const errors = [];

function localTarget(raw) {
  const clean = raw.split('#')[0].split('?')[0].replace(/^\/+/, '');
  return path.join(root, clean);
}

if (!fs.existsSync(recordPath)) errors.push('missing data/whats-new.json');
if (!fs.existsSync(pagePath)) errors.push('missing whats-new.html');

let record;
try {
  record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
} catch (error) {
  errors.push(`invalid JSON: ${error.message}`);
}

if (record) {
  if (record.version !== 1) errors.push('record version must be 1');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.updated || '')) errors.push('updated must use YYYY-MM-DD');
  if (!Array.isArray(record.entries) || !record.entries.length) errors.push('entries must be a non-empty array');

  const ids = new Set();
  let previousDate = '9999-99-99';
  for (const [index, entry] of (record.entries || []).entries()) {
    for (const field of requiredFields) {
      if (!(field in entry) || entry[field] === '' || entry[field] == null) {
        errors.push(`entry ${index + 1}: missing ${field}`);
      }
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')) errors.push(`${entry.id || index}: invalid date`);
    if (entry.date > previousDate) errors.push(`${entry.id}: entries are not newest-first`);
    previousDate = entry.date;
    if (ids.has(entry.id)) errors.push(`${entry.id}: duplicate id`);
    ids.add(entry.id);

    for (const field of ['affected', 'intended_for', 'sources']) {
      if (!Array.isArray(entry[field]) || !entry[field].length) errors.push(`${entry.id}: ${field} must be a non-empty array`);
    }

    for (const source of entry.sources || []) {
      if (!source.label || !source.url) errors.push(`${entry.id}: every source needs label and url`);
      if (source.url && source.url.startsWith('/') && !fs.existsSync(localTarget(source.url))) {
        errors.push(`${entry.id}: missing local source ${source.url}`);
      }
      if (source.url && !source.url.startsWith('/') && !/^https:\/\//.test(source.url)) {
        errors.push(`${entry.id}: source must be root-relative or HTTPS: ${source.url}`);
      }
    }
  }
}

for (const [file, pattern, label] of [
  [pagePath, /data-whats-new-list/, "What's New page render target"],
  [pagePath, /data\/whats-new\.json/, 'structured-source link'],
  [homepagePath, /data-whats-new-list[^>]*data-compact[^>]*data-limit=["']3["']/, 'three-entry homepage preview'],
  [componentsPath, /What's New[^\n]+whats-new\.html/, "What's New navigation item"]
]) {
  const source = fs.readFileSync(file, 'utf8');
  if (!pattern.test(source)) errors.push(`missing ${label} in ${path.relative(root, file)}`);
}

if (errors.length) {
  console.error('\nWhat\'s New validation FAILED:');
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`What's New validation passed: ${record.entries.length} complete, ordered entries.`);
