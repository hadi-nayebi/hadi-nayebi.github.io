#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'data/participation-surfaces.json');
const errors = [];

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}

function digest(record) {
  const { record_digest: _ignored, ...payload } = record;
  return crypto.createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex');
}

function requireFields(record, fields) {
  for (const field of fields) {
    if (!(field in record)) errors.push(`${record.surface_id ?? '<unknown>'}: missing ${field}`);
  }
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (data.schemaVersion !== 'hadosh-participation/v0.1') errors.push('unsupported schemaVersion');
if (data.trustedSource?.repository !== 'hadi-nayebi/hadi-nayebi.github.io') errors.push('trusted source repository mismatch');
if (data.trustedSource?.path !== 'data/participation-surfaces.json') errors.push('trusted source path mismatch');
if (!Array.isArray(data.records) || data.records.length < 4) errors.push('expected at least four participation records');

const ids = new Set();
const required = ['schema_version', 'surface_id', 'surface_kind', 'canonical_url', 'destination', 'accepted_returns', 'required_fields', 'privacy_profile', 'authority_profile', 'maturation_path', 'owner', 'verification', 'record_digest'];
const forbiddenAuthority = /auto(?:matic)?[-_ ]?(?:post|submit|approve)|standing[-_ ]?permission/i;

for (const record of data.records ?? []) {
  requireFields(record, required);
  if (ids.has(record.surface_id)) errors.push(`${record.surface_id}: duplicate surface_id`);
  ids.add(record.surface_id);
  if (record.schema_version !== data.schemaVersion) errors.push(`${record.surface_id}: schema version mismatch`);
  if (record.record_digest !== digest(record)) errors.push(`${record.surface_id}: record digest mismatch`);
  if (forbiddenAuthority.test(JSON.stringify(record))) errors.push(`${record.surface_id}: metadata must not grant posting authority`);
  if (!['verified', 'unverified', 'stale'].includes(record.verification?.status)) errors.push(`${record.surface_id}: invalid verification status`);

  if (record.verification?.status !== 'verified') {
    if (record.destination?.route) errors.push(`${record.surface_id}: unverified destination must not expose an actionable route`);
    continue;
  }

  if (!record.source_path || !record.verification.checked_at || !record.verification.evidence_ref) {
    errors.push(`${record.surface_id}: verified record lacks evidence`);
    continue;
  }

  const source = fs.readFileSync(path.join(root, record.source_path), 'utf8');
  const tokens = record.destination?.kind === 'giscus-discussion' ? [
    `data-repo="${record.destination.repository}"`,
    `data-repo-id="${record.destination.repository_id}"`,
    `data-category="${record.destination.category}"`,
    `data-category-id="${record.destination.category_id}"`,
    `data-mapping="${record.destination.mapping}"`,
    ...(record.source_markers ?? [])
  ] : [];
  for (const token of tokens) {
    if (!source.includes(token)) errors.push(`${record.surface_id}: ${record.source_path} missing ${JSON.stringify(token)}`);
  }
}

if (errors.length) {
  console.error('\nParticipation-surface validation FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const verified = data.records.filter(record => record.verification.status === 'verified').length;
const stopped = data.records.length - verified;
console.log(`Participation-surface validation passed: ${verified} verified routes and ${stopped} fail-closed records checked.`);
