import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const library = JSON.parse(fs.readFileSync('data/abstraction-library.json', 'utf8'));
const routes = [
  { name: 'agents', path: '/agents.html' },
  { name: 'library', path: '/agents/abstractions/' },
  ...library.terms.map(term => ({ name: `term-${term.slug}`, path: `/agents/abstractions/terms/${term.slug}.html` }))
];
const viewports = [
  { name: 'phone-small', width: 360, height: 800 },
  { name: 'phone-large', width: 412, height: 915 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
const screenshots = new Set([
  'agents:phone-small',
  'agents:desktop',
  'library:phone-small',
  'library:desktop',
  'term-harness:phone-small'
]);
const artifactDir = path.resolve('artifacts/responsive-layout');
fs.mkdirSync(artifactDir, { recursive: true });
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  for (const route of routes) {
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, requestRoute => requestRoute.abort());
    await page.goto(baseUrl + route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);

    const issues = await page.evaluate(() => {
      const problems = [];
      const visible = element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 1 && rect.height > 1;
      };
      const overlaps = (a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return Math.min(ar.right, br.right) - Math.max(ar.left, br.left) > 1 &&
          Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top) > 1;
      };
      const label = element => {
        const id = element.id ? '#' + element.id : '';
        const cls = typeof element.className === 'string' && element.className.trim()
          ? '.' + element.className.trim().split(/\s+/).join('.')
          : '';
        return element.tagName.toLowerCase() + id + cls;
      };

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        problems.push(`horizontal overflow: document ${document.documentElement.scrollWidth}px > viewport ${window.innerWidth}px`);
      }

      const header = document.querySelector('#site-header');
      const firstHeading = document.querySelector('main h1');
      if (header && firstHeading && visible(header) && visible(firstHeading)) {
        const headerBottom = header.getBoundingClientRect().bottom;
        const headingTop = firstHeading.getBoundingClientRect().top;
        if (headingTop < headerBottom - 1) problems.push(`first heading begins under fixed header: ${headingTop}px < ${headerBottom}px`);
      }

      for (const selector of ['.abstraction-entry-cloud', '.abstraction-cloud', '.abstraction-actions', '.term-sequence']) {
        document.querySelectorAll(selector).forEach(element => {
          const style = getComputedStyle(element);
          if (element.scrollHeight > element.clientHeight + 2 && !['auto', 'scroll'].includes(style.overflowY)) {
            problems.push(`${selector} clips or overflows vertically: ${element.scrollHeight}px > ${element.clientHeight}px`);
          }
        });
      }

      const pairGroups = [
        ['.abstraction-entry-cloud a', '.abstraction-actions a'],
        ['.abstraction-cloud a', '.abstraction-actions a']
      ];
      for (const [leftSelector, rightSelector] of pairGroups) {
        const left = [...document.querySelectorAll(leftSelector)].filter(visible);
        const right = [...document.querySelectorAll(rightSelector)].filter(visible);
        for (const a of left) for (const b of right) {
          if (overlaps(a, b)) problems.push(`overlap: ${label(a)} with ${label(b)}`);
        }
      }

      for (const selector of ['.abstraction-entry-cloud a', '.abstraction-cloud a', '.abstraction-actions .btn', '.term-card', '.term-sequence a']) {
        const elements = [...document.querySelectorAll(selector)].filter(visible);
        for (let i = 0; i < elements.length; i += 1) {
          const rect = elements[i].getBoundingClientRect();
          if (rect.left < -1 || rect.right > window.innerWidth + 1) {
            problems.push(`${label(elements[i])} leaves viewport horizontally: ${rect.left}px..${rect.right}px`);
          }
          for (let j = i + 1; j < elements.length; j += 1) {
            if (overlaps(elements[i], elements[j])) problems.push(`sibling overlap in ${selector}: ${i + 1} with ${j + 1}`);
          }
        }
      }
      return [...new Set(problems)];
    });

    const key = `${route.name}:${viewport.name}`;
    if (issues.length || screenshots.has(key)) {
      await page.screenshot({
        path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}.png`),
        fullPage: true
      });
    }
    for (const issue of issues) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: ${issue}`);
    await page.close();
  }
  await context.close();
}
await browser.close();

if (failures.length) {
  console.error('Responsive layout validation FAILED:');
  failures.forEach(failure => console.error('  - ' + failure));
  process.exit(1);
}
console.log(`Responsive layout validation passed: ${routes.length} pages across ${viewports.length} viewports; review screenshots in ${path.relative(process.cwd(), artifactDir)}.`);
