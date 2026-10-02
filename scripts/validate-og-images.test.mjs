#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const validator = path.join(path.dirname(fileURLToPath(import.meta.url)), 'validate-og-images.mjs');

const validMarkup = `<!doctype html>
<meta property="og:image" content="https://hadi-nayebi.github.io/assets/images/card.png">
<meta content="/assets/images/card.png" name="twitter:image">
`;

function fixture({ image = true, stale = false, markup = validMarkup } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'og-image-validator-'));
  fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
  fs.mkdirSync(path.join(root, 'assets/images'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), markup);
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

const empty = run(fixture({
  markup: '<!doctype html>\n<meta property="og:image" content="">\n'
}));
assert.equal(empty.status, 1);
assert.match(empty.stderr, /requires a non-empty content value/);

const malformed = run(fixture({
  markup: '<!doctype html>\n<meta property="og:image" content="https://hadi-nayebi.github.io/%E0%A4%A">\n'
}));
assert.equal(malformed.status, 1);
assert.match(malformed.stderr, /malformed percent-encoding/);

console.log('Local social-card validator tests passed: 1 positive, 4 negative controls.');
