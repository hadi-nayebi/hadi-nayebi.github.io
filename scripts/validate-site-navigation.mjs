#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set(['.git', 'node_modules']);
const errors = [];
const warnings = [];

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

function isRedirectPage(html) {
  return /http-equiv=["']refresh["']/i.test(html) && /canonical/i.test(html);
}

function extractAttributes(html, attribute) {
  const values = [];
  const regex = new RegExp(`\\b${attribute}\\s*=\\s*["']([^"']+)["']`, 'gi');
  let match;
  while ((match = regex.exec(html))) values.push(match[1]);
  return values;
}

function localTarget(fromFile, raw) {
  if (!raw || raw.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(raw)) return null;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (clean.startsWith('/')) return path.join(root, clean.replace(/^\/+/, ''));
  return path.resolve(path.dirname(fromFile), clean);
}

function targetExists(target) {
  if (!target) return true;
  if (fs.existsSync(target)) return true;
  if (!path.extname(target) && fs.existsSync(target + '.html')) return true;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory() && fs.existsSync(path.join(target, 'index.html'))) return true;
  return false;
}

function validateDynamicRootLinks(scriptRel) {
  const file = path.join(root, scriptRel);
  if (!fs.existsSync(file)) {
    errors.push(`${scriptRel}: missing dynamic navigation script`);
    return;
  }
  const source = fs.readFileSync(file, 'utf8');
  const regex = /["'`](\/(?!\/)[^"'`\n]+)["'`]/g;
  let match;
  const seen = new Set();
  while ((match = regex.exec(source))) {
    const value = match[1];
    if (seen.has(value)) continue;
    seen.add(value);
    const target = localTarget(path.join(root, 'index.html'), value);
    if (target && !targetExists(target)) {
      errors.push(`${scriptRel}: broken dynamic link="${value}"`);
    }
  }
}

const allFiles = walk(root);
const htmlFiles = allFiles.filter(file => file.endsWith('.html'));
const publicHtml = htmlFiles.filter(file => !rel(file).startsWith('.claude/'));

for (const file of publicHtml) {
  const html = fs.readFileSync(file, 'utf8');
  const fileRel = rel(file);
  const redirect = isRedirectPage(html);
  const explorable = fileRel.startsWith('blog/') && fileRel.includes('/explore/');

  if (!redirect && !explorable && !/components\.js(?:\?[^"']*)?["']/i.test(html)) {
    errors.push(`${fileRel}: missing shared components.js`);
  }

  if (!redirect && !explorable && /id=["']site-header["']/i.test(html) && !/href=["'][^"']*whats-new\.html/i.test(html)) {
    errors.push(`${fileRel}: static navigation is missing What's New`);
  }

  if (explorable) {
    const hasBackControl = /class=["'][^"']*(?:chrome-back|explore-back|back-to-essay)[^"']*["']/i.test(html) || /Back to (?:Essay|Blog|Article)/i.test(html);
    if (!hasBackControl) errors.push(`${fileRel}: full-screen explorable missing a back-to-essay control`);
  }

  for (const attribute of ['href', 'src']) {
    for (const value of extractAttributes(html, attribute)) {
      const target = localTarget(file, value);
      if (target && !targetExists(target)) {
        errors.push(`${fileRel}: broken ${attribute}="${value}"`);
      }
    }
  }

  if (fileRel.startsWith('blog/') && !explorable && !redirect) {
    if (!/class=["'][^"']*article-content/i.test(html)) {
      warnings.push(`${fileRel}: blog HTML is not an article layout; article-series checks skipped`);
      continue;
    }
    if (!/class=["'][^"']*blog-back-link/i.test(html)) {
      errors.push(`${fileRel}: missing Back to Blog link`);
    }
    if (!/class=["'][^"']*sidebar/i.test(html)) {
      errors.push(`${fileRel}: missing article sidebar fallback`);
    }
    const bodyMatch = html.match(/<div class=["']article-body["'][^>]*>([\s\S]*?)<\/div>\s*(?:<!-- Comments|<div class=["']article-comments)/i);
    if (bodyMatch) {
      const footer = bodyMatch[1];
      const hasPrev = /Previous:/i.test(footer);
      const hasNext = /Next:/i.test(footer);
      if (!hasPrev && !hasNext) warnings.push(`${fileRel}: no Previous/Next footer link detected`);
    }
  }
}

// Validate dynamic navigation surfaces that are populated in JavaScript rather
// than declared directly in HTML.
validateDynamicRootLinks('js/wheel.js');
validateDynamicRootLinks('js/start-here.js');

const canonicalPages = [
  'index.html', 'start-here.html', 'agents.html', 'whats-new.html', 'about.html', 'portfolio.html', 'explore.html',
  'contact.html', 'support.html', 'seed-access.html', 'seed-agent.html', 'q-seed.html', 'thanks.html',
  'thanks-support.html', '404.html', 'projects/index.html', 'projects/seed-agent.html',
  'projects/q-seed.html', 'projects/team-harnesses.html', 'projects/family-games.html',
  'projects/crime-cartography.html', 'blog.html'
];
for (const expected of canonicalPages) {
  if (!fs.existsSync(path.join(root, expected))) errors.push(`missing canonical page: ${expected}`);
}

if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(item => console.log(`  - ${item}`));
}

if (errors.length) {
  console.error('\nSite navigation validation FAILED:');
  errors.forEach(item => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Site navigation validation passed: ${publicHtml.length} HTML files plus dynamic navigation maps checked.`);
