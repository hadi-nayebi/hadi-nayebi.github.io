#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const validator = path.join(path.dirname(fileURLToPath(import.meta.url)), 'validate-og-images.mjs');

function fixture({ image = true, stale = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'og-image-validator-'));
  fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
  fs.mkdirSync(path.join(root, 'assets/images'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html>\n<meta property="og:image" content="https://hadi-nayebi.github.io/assets/images/card.png">\n<meta content="/assets/images/card.png" name="twitter:image">\n`);
  fs.writeFileSync(path.join(root, 'blog/og-image-prompts.md'), stale ? '# OG Image Prompts — 5 Missing Files\nfiles don\'t exist on disk' : '# OG Image Asset Record — Resolved\n');
  if (image) fs.writeFileSync(path.join(root, 'assets/images/card.png'), 'png');
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [validator, root], { encoding: 'utf8' });
}

const valid = run(fixture());
assert.equal(valid.status, 0, valid.stderr);
assert.match(valid.stdout, /2 references/);

const missing = run(fixture({ image: false }));
assert.equal(missing.status, 1);
assert.match(missing.stderr, /missing local file/);

const stale = run(fixture({ stale: true }));
assert.equal(stale.status, 1);
assert.match(stale.stderr, /stale missing-card claim returned/);

console.log('Local social-card validator tests passed: 1 positive, 2 negative controls.');
