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

function validateEmailForm(htmlRel, formId, submitId, statusId) {
  const htmlPath = path.join(root, htmlRel);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const formPattern = new RegExp(
    `<form\\b(?=[^>]*\\bid=["']${formId}["'])(?=[^>]*\\bmethod=["']post["'])(?=[^>]*\\baction=["'][^"']+["'])[^>]*>`,
    'i'
  );
  if (!formPattern.test(html)) {
    errors.push(`${htmlRel}: ${formId} must declare a POST fallback action`);
  }
  const submitPattern = new RegExp(
    `<button\\b(?=[^>]*\\bid=["']${submitId}["'])(?=[^>]*\\bdisabled(?:\\s|=|>))[^>]*>`,
    'i'
  );
  if (!submitPattern.test(html)) {
    errors.push(`${htmlRel}: ${submitId} must remain disabled until email delivery initializes`);
  }
  const statusPattern = new RegExp(
    `<[^>]+(?=[^>]*\\bid=["']${statusId}["'])(?=[^>]*\\brole=["']status["'])(?=[^>]*\\baria-live=["']polite["'])[^>]*>`,
    'i'
  );
  if (!statusPattern.test(html)) {
    errors.push(`${htmlRel}: ${statusId} must expose an accessible delivery status`);
  }
}

const allFiles = walk(root);
const htmlFiles = allFiles.filter(file => file.endsWith('.html'));
const publicHtml = htmlFiles.filter(file => !rel(file).startsWith('.claude/'));
const practicalGuidePages = publicHtml.filter(file => /^blog\/practical-guides\/[^/]+\.html$/.test(rel(file)));

const blogIndexPath = path.join(root, 'blog.html');
if (fs.existsSync(blogIndexPath)) {
  const blogIndexHtml = fs.readFileSync(blogIndexPath, 'utf8');
  if (/<nav\b[^>]*class=["'][^"']*\bblog-category-nav\b/i.test(blogIndexHtml)) {
    errors.push('blog.html: blog-category-nav must not use a nav element because the global header-nav layout constrains its height');
  }
  if (!/<div\b(?=[^>]*class=["'][^"']*\bblog-category-nav\b)(?=[^>]*role=["']navigation["'])(?=[^>]*aria-label=["'][^"']+["'])[^>]*>/i.test(blogIndexHtml)) {
    errors.push('blog.html: blog-category-nav must remain an explicitly labelled navigation region');
  }
}

for (const file of publicHtml) {
  const html = fs.readFileSync(file, 'utf8');
  const fileRel = rel(file);
  const redirect = isRedirectPage(html);
  const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const explorable = fileRel.startsWith('blog/') && fileRel.includes('/explore/');
  const observationApp = /^blog\/observations\/[^/]+\/index\.html$/.test(fileRel);

  if (!redirect && !noindex) {
    const requiredMetadata = [
      ['description', /<meta\s+name=["']description["']/i],
      ['canonical URL', /<link\s+rel=["']canonical["']/i],
      ['Open Graph title', /<meta\s+property=["']og:title["']/i],
      ['Open Graph description', /<meta\s+property=["']og:description["']/i],
      ['Open Graph URL', /<meta\s+property=["']og:url["']/i],
      ['Open Graph type', /<meta\s+property=["']og:type["']/i],
      ['Open Graph image', /<meta\s+property=["']og:image["']/i],
      ['Open Graph site name', /<meta\s+property=["']og:site_name["']/i],
    ];
    for (const [label, pattern] of requiredMetadata) {
      if (!pattern.test(html)) errors.push(`${fileRel}: missing ${label}`);
    }
  }

  if (!redirect && !explorable && !/components\.js(?:\?[^"']*)?["']/i.test(html)) {
    errors.push(`${fileRel}: missing shared components.js`);
  }

  if (!redirect && !explorable && /id=["']site-header["']/i.test(html) && !/href=["'][^"']*whats-new\.html/i.test(html)) {
    errors.push(`${fileRel}: static navigation is missing What's New`);
  }

  if (!redirect && !explorable && /id=["']site-header["']/i.test(html) && !/href=["'][^"']*services\.html/i.test(html)) {
    errors.push(`${fileRel}: static navigation is missing Services`);
  }

  const headerMatch = html.match(/<header\b[^>]*id=["']site-header["'][^>]*>[\s\S]*?<\/header>/i);
  if (!redirect && !explorable && headerMatch && /href=["'][^"']*contact\.html/i.test(headerMatch[0])) {
    errors.push(`${fileRel}: Contact must remain outside the primary header navigation`);
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

  if (fileRel.startsWith('blog/') && !explorable && !observationApp && !redirect) {
    if (/^blog\/(?:b\d+|practical-guides)\/[^/]+\.html$/.test(fileRel)) {
      const markdownSource = file.slice(0, -'.html'.length) + '.md';
      if (!fs.existsSync(markdownSource)) {
        errors.push(`${fileRel}: missing canonical Markdown source ${rel(markdownSource)}`);
      }
    }
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
      const onlyPracticalGuide = fileRel.startsWith('blog/practical-guides/') && practicalGuidePages.length === 1;
      if (!hasPrev && !hasNext && !onlyPracticalGuide) warnings.push(`${fileRel}: no Previous/Next footer link detected`);
    }
  }
}

// Validate dynamic navigation surfaces that are populated in JavaScript rather
// than declared directly in HTML.
validateDynamicRootLinks('js/wheel.js');
validateDynamicRootLinks('js/start-here.js');
validateEmailForm('contact.html', 'contact-form', 'submit-button', 'contact-form-status');
validateEmailForm('services.html', 'services-intake-form', 'services-submit', 'services-intake-status');
validateEmailForm('seed-access.html', 'seed-access-form', 'seed-access-submit', 'seed-access-status');
validateEmailForm('projects/crime-cartography.html', 'project-subscribe-form', 'project-subscribe-submit', 'project-subscribe-status');

const servicesPath = path.join(root, 'services.html');
if (fs.existsSync(servicesPath)) {
  const servicesHtml = fs.readFileSync(servicesPath, 'utf8');
  const servicesSteps = [...servicesHtml.matchAll(/\bdata-step=["']([^"']+)["']/gi)].map(match => match[1]);
  const expectedSteps = ['orientation', 'background', 'context', 'current-system', 'desired-help', 'ownership', 'participation', 'practical-fit', 'recommendation', 'contact-review'];
  if (servicesSteps.join('|') !== expectedSteps.join('|')) {
    errors.push(`services.html: guided step order changed: ${servicesSteps.join(', ')}`);
  }
  const progressListMatch = servicesHtml.match(/<ol\b[^>]*class=["'][^"']*services-progress-list[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i);
  const progressItems = progressListMatch ? (progressListMatch[1].match(/<li(?:\s|>)/gi) || []).length : 0;
  if (progressItems !== 9 || !/class=["']services-rail["'][^>]*\bhidden\b/i.test(servicesHtml)) {
    errors.push('services.html: orientation must remain outside the nine-step progress count');
  }
  if (!/<details\b[^>]*class=["'][^"']*services-catalog/i.test(servicesHtml)) {
    errors.push('services.html: full services catalog must remain progressively disclosed');
  }
  if (/<details\b(?=[^>]*class=["'][^"']*services-catalog)[^>]*\bopen\b/i.test(servicesHtml)) {
    errors.push('services.html: full services catalog must not be open by default');
  }
  if (!/<html\b[^>]*class=["'][^"']*\bno-js\b/i.test(servicesHtml) || !/<noscript>[\s\S]*guided intake needs JavaScript/i.test(servicesHtml)) {
    errors.push('services.html: missing explicit no-JavaScript intake fallback');
  }
  if (!/href=["']\/support\.html["']/i.test(servicesHtml)) {
    errors.push('services.html: missing quiet support path');
  }
  if (!/blog\/practical-guides\/01-build-your-own-space-on-the-web\.html/i.test(servicesHtml)) {
    errors.push('services.html: missing free personal-website guide path');
  }
  if (!/@emailjs\/browser@4\/dist\/email\.min\.js/i.test(servicesHtml)) {
    errors.push('services.html: services intake must use the current EmailJS browser SDK');
  }
  if (/type=["'](?:submit|button)["'][^>]*(?:pay|checkout)|(?:pay|checkout)[^<]*<button/i.test(servicesHtml)) {
    errors.push('services.html: intake must not introduce a payment or checkout control');
  }

  const servicesScript = fs.readFileSync(path.join(root, 'js/services-intake.js'), 'utf8');
  if (!/foundationsGuide[\s\S]*href:\s*["']\/start-here\.html["']/.test(servicesScript)) {
    errors.push('js/services-intake.js: missing free Start Here recommendation');
  }
  if (!/budget === ["']Free resources only["'][\s\S]*foundationsGuide/.test(servicesScript)) {
    errors.push('js/services-intake.js: free-only budget must produce a free recommendation path');
  }
  if (/!preferred\s*&&\s*index\s*===\s*0/.test(servicesScript)) {
    errors.push('js/services-intake.js: recommendations must require an explicit visitor choice');
  }
  if (/history\.pushState/.test(servicesScript)) {
    errors.push('js/services-intake.js: wizard steps must not create stale browser-history entries');
  }
  if (!/routePosition\s*<\s*0\s*\|\|\s*routePosition\s*>=\s*route\.length\s*-\s*1/.test(servicesScript)) {
    errors.push('js/services-intake.js: Continue must not advance beyond the final routed step');
  }
  if (!/currentIndex\s*!==\s*route\[route\.length\s*-\s*1\]/.test(servicesScript)) {
    errors.push('js/services-intake.js: submission must be restricted to the final routed step');
  }
  if (!/services-review-summary["']\)\.textContent\s*=\s*["']{2}/.test(servicesScript)) {
    errors.push('js/services-intake.js: successful submission must clear the rendered review summary');
  }
  if (!/name=["']send_welcome["']/i.test(servicesHtml) ||
      !/EMAILJS_WELCOME_TEMPLATE_ID\s*=\s*["']template_wq2dosk["']/.test(servicesScript) ||
      !/newcomerGuideRecommended\(\)[\s\S]*New to the concepts[\s\S]*Learn the foundations/.test(servicesScript)) {
    errors.push('services intake: missing explicit, recommended newcomer-guide choice using the existing welcome template');
  }
  if (/name=["'](?:current_system_notes|final_note)["']/i.test(servicesHtml)) {
    errors.push('services.html: redundant open-ended intake fields were reintroduced');
  }
  if (!/name=["']consent["'][^>]*value=["']services-intake-v1\.1["']/i.test(servicesHtml)) {
    errors.push('services.html: consent copy/version must cover the optional one-time newcomer email');
  }

  const servicesCss = fs.readFileSync(path.join(root, 'css/services.css'), 'utf8');
  if (!/\.page-services\s+\[hidden\]\s*\{[^}]*display:\s*none\s*!important;?[^}]*\}/.test(servicesCss)) {
    errors.push('css/services.css: all hidden wizard elements must remain visually hidden');
  }
}

const baseCss = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');
if (!/select\.form-control\s*\{[^}]*color-scheme:\s*dark;?[^}]*\}/.test(baseCss) ||
    !/select\.form-control\s+option\s*\{[^}]*background-color:[^}]*color:[^}]*\}/.test(baseCss)) {
  errors.push('css/styles.css: dark form selects must define legible native option colors');
}

const componentsScript = fs.readFileSync(path.join(root, 'js/components.js'), 'utf8');
const navItemsMatch = componentsScript.match(/var NAV_ITEMS\s*=\s*\[([\s\S]*?)\];/);
if (!navItemsMatch || !/href:\s*["']\/services\.html["']/.test(navItemsMatch[1]) || /href:\s*["']\/contact\.html["']/.test(navItemsMatch[1])) {
  errors.push('js/components.js: primary navigation must include Services and keep Contact in secondary surfaces');
}
if (!/contact\.href\s*=\s*["']\/contact\.html["']/.test(componentsScript)) {
  errors.push('js/components.js: footer must retain the standalone Contact page');
}

const emailPages = ['contact.html', 'services.html', 'seed-access.html', 'projects/crime-cartography.html'];
for (const page of emailPages) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  if (!/@emailjs\/browser@4\/dist\/email\.min\.js/i.test(source)) {
    errors.push(`${page}: email form must use EmailJS browser SDK v4`);
  }
}

const emailScripts = ['js/form-handler.js', 'js/services-intake.js', 'js/seed-access.js', 'js/project-subscribe.js']
  .map(file => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');
const templateIds = new Set([...emailScripts.matchAll(/["'](template_[a-z0-9]+)["']/gi)].map(match => match[1]));
const expectedTemplateIds = ['template_5he0blr', 'template_wq2dosk'];
if ([...templateIds].sort().join('|') !== expectedTemplateIds.sort().join('|')) {
  errors.push(`EmailJS integration must stay within the two-template free-plan limit; found: ${[...templateIds].join(', ')}`);
}
if ((emailScripts.match(/request_type\s*:/g) || []).length < 4) {
  errors.push('EmailJS notification calls must identify all four website request types');
}

const feedPath = path.join(root, 'feed.xml');
if (!fs.existsSync(feedPath)) {
  errors.push('feed.xml: missing RSS feed');
} else {
  const feed = fs.readFileSync(feedPath, 'utf8');
  const buildDateMatch = feed.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/i);
  const publicationDates = [...feed.matchAll(/<pubDate>([^<]+)<\/pubDate>/gi)]
    .map(match => Date.parse(match[1]));
  const buildDate = buildDateMatch ? Date.parse(buildDateMatch[1]) : Number.NaN;
  if (!buildDateMatch || Number.isNaN(buildDate)) {
    errors.push('feed.xml: missing or invalid lastBuildDate');
  }
  if (publicationDates.some(Number.isNaN)) {
    errors.push('feed.xml: contains an invalid pubDate');
  } else if (!Number.isNaN(buildDate) && publicationDates.some(date => date > buildDate)) {
    errors.push('feed.xml: lastBuildDate is older than the newest item pubDate');
  }
}

const canonicalPages = [
  'index.html', 'start-here.html', 'agents.html', 'whats-new.html', 'about.html', 'portfolio.html', 'explore.html',
  'contact.html', 'services.html', 'support.html', 'seed-access.html', 'seed-agent.html', 'q-seed.html', 'thanks.html',
  'thanks-support.html', '404.html', 'projects/index.html', 'projects/origin.html',
  'projects/seed-agent.html',
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
