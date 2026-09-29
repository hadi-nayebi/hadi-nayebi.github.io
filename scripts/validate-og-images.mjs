#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SITE_ORIGIN = 'https://hadi-nayebi.github.io';
const root = path.resolve(process.argv[2] || process.cwd());
const ignoredDirs = new Set(['.git', '.claude', 'node_modules']);
const errors = [];
const references = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function metaAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\b([:\w-]+)\s*=\s*["']([^"']*)["']/g)]
      .map((match) => [match[1].toLowerCase(), match[2]])
  );
}

function localSocialImage(value) {
  if (!value) return null;
  let pathname;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return null;
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  const target = path.resolve(root, pathname.replace(/^\/+/, ''));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null;
  return target;
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = metaAttributes(tag);
    const key = (attrs.property || attrs.name || '').toLowerCase();
    if (!['og:image', 'twitter:image'].includes(key)) continue;
    const target = localSocialImage(attrs.content);
    if (!target) continue;
    references.push({ page: rel(file), key, target: rel(target) });
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      errors.push(`${rel(file)}: ${key} points to missing local file ${rel(target)}`);
    }
  }
}

const legacyPrompt = path.join(root, 'blog/og-image-prompts.md');
if (fs.existsSync(legacyPrompt)) {
  const source = fs.readFileSync(legacyPrompt, 'utf8');
  if (/5 Missing Files|files don't exist on disk|currently fail or fall through to a 404 image/i.test(source)) {
    errors.push('blog/og-image-prompts.md: stale missing-card claim returned');
  }
}

if (errors.length) {
  console.error('Local social-card validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const uniqueAssets = new Set(references.map((item) => item.target));
console.log(`Local social-card validation passed: ${references.length} references across ${htmlFiles.length} HTML files; ${uniqueAssets.size} unique assets exist.`);

