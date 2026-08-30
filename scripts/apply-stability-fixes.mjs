#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let changed = 0;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function addProjectsFallback(html, fileRel) {
  if (fileRel.includes('/explore/')) return html;
  const navMatch = html.match(/<div class=["']nav-links["']>([\s\S]*?)<\/div>/i);
  if (!navMatch || />Projects</.test(navMatch[1])) return html;

  const depth = fileRel.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  const projects = `                    <a href="${prefix}projects/index.html">Projects</a>\n`;
  const updatedNav = navMatch[0].replace(/(\s*<a[^>]*>About<\/a>)/i, `\n${projects}$1`);
  if (updatedNav === navMatch[0]) return html;
  return html.replace(navMatch[0], updatedNav);
}

for (const file of walk(root).filter(file => file.endsWith('.html'))) {
  const fileRel = relative(file);
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  // Force the current shared navigation/responsive layer to a fresh browser URL.
  html = html.replace(/(js\/components\.js)\?v=[^"']+/g, '$1?v=20260830-2');

  if (fileRel === 'blog.html' || fileRel.startsWith('blog/')) {
    html = addProjectsFallback(html, fileRel);
  }

  // Full-screen explorables contain dormant draft narration controls whose audio
  // files were never published. Remove the dead controls while leaving the
  // diagrams and their back-to-essay navigation untouched.
  if (fileRel.startsWith('blog/') && fileRel.includes('/explore/')) {
    html = html.replace(/\s*<figure class=["']audio-guide["'][\s\S]*?<\/figure>\s*/gi, function (block) {
      return /\.draft\.mp3/i.test(block) ? '\n' : block;
    });
  }

  if (fileRel === 'blog/b4/04-the-language-of-agents.html') {
    html = html.replace('href="../papers/the-primitives-of-agent-architecture.pdf"', 'href="../../papers/the-primitives-of-agent-architecture.pdf"');
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    changed += 1;
    console.log(`updated ${fileRel}`);
  }
}

console.log(`Stability fixes applied to ${changed} HTML files.`);
