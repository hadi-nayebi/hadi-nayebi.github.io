import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const route = '/blog/practical-guides/03-build-a-github-home-for-your-agent.html';
const viewports = [
  { name: 'phone-small', width: 360, height: 800 },
  { name: 'phone-large', width: 412, height: 915 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
const artifactDir = path.resolve('artifacts/practical-guide-layout');
fs.mkdirSync(artifactDir, { recursive: true });
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, requestRoute => requestRoute.abort());
  await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(150);
  await page.addStyleTag({ content: '.fb-bubble, .fb-panel, .fb-toast { display: none !important; }' });

  const issues = await page.evaluate(() => {
    const problems = [];
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' &&
        Number(style.opacity) !== 0 && rect.width > 1 && rect.height > 1;
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
    const heading = document.querySelector('main h1');
    if (!header || !visible(header)) problems.push('site header is not visible');
    if (!heading || !visible(heading)) problems.push('main heading is not visible');
    if (header && heading && visible(header) && visible(heading) &&
        heading.getBoundingClientRect().top < header.getBoundingClientRect().bottom - 1) {
      problems.push('main heading begins beneath the site header');
    }

    for (const selector of ['.article-content', '.guide-prompt', '.guide-callout', '.control-ladder', 'pre']) {
      for (const element of document.querySelectorAll(selector)) {
        if (!visible(element)) continue;
        const rect = element.getBoundingClientRect();
        if (rect.left < -1 || rect.right > window.innerWidth + 1) {
          problems.push(`${label(element)} leaves viewport: ${rect.left}px..${rect.right}px`);
        }
      }
    }

    for (const table of document.querySelectorAll('table')) {
      const wrapper = table.parentElement;
      if (!wrapper || !/guide-table-wrap/.test(wrapper.className)) {
        problems.push('table is missing its responsive guide-table-wrap');
        continue;
      }
      if (!['auto', 'scroll'].includes(getComputedStyle(wrapper).overflowX)) {
        problems.push('table wrapper does not provide horizontal scrolling');
      }
      const rect = wrapper.getBoundingClientRect();
      if (rect.left < -1 || rect.right > window.innerWidth + 1) {
        problems.push(`table wrapper leaves viewport: ${rect.left}px..${rect.right}px`);
      }
    }

    const expectedIds = [
      'start-with-your-agent', 'what-you-will-build', 'choose-project', 'account-mobile',
      'create-repository', 'learn-pieces', 'seed-repository', 'connect-agent', 'read-back',
      'issue', 'reviewable-change', 'corrections', 'fresh-context', 'mobile-loop',
      'failure-recovery', 'completion', 'sources', 'continue'
    ];
    for (const id of expectedIds) {
      if (!document.getElementById(id)) problems.push(`missing guide section #${id}`);
    }

    const ladder = [...document.querySelectorAll('.control-step')].filter(visible);
    if (ladder.length !== 4) problems.push(`expected four visible capability steps, found ${ladder.length}`);
    for (const step of ladder) {
      const rect = step.getBoundingClientRect();
      if (rect.width < 120) problems.push(`${label(step)} is too narrow to read comfortably: ${rect.width}px`);
    }

    const sourceLinks = document.querySelectorAll('#sources + p + ul a, #sources ~ ul a');
    if (sourceLinks.length < 9) problems.push(`expected at least nine official source links, found ${sourceLinks.length}`);

    return [...new Set(problems)];
  });

  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  axe.violations
    .filter(violation => ['serious', 'critical'].includes(violation.impact))
    .forEach(violation => {
      const targets = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
      failures.push(`${viewport.width}x${viewport.height}: accessibility ${violation.id} — ${violation.help} (${targets})`);
    });

  await page.screenshot({
    path: path.join(artifactDir, `guide-03-${viewport.width}x${viewport.height}-fold.png`),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(artifactDir, `guide-03-${viewport.width}x${viewport.height}-full.png`),
    fullPage: true
  });
  await page.locator('.control-ladder').screenshot({
    path: path.join(artifactDir, `guide-03-control-ladder-${viewport.width}x${viewport.height}.png`)
  });

  for (const issue of issues) failures.push(`${viewport.width}x${viewport.height}: ${issue}`);
  await page.close();
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error('Practical Guide responsive validation FAILED:');
  [...new Set(failures)].forEach(failure => console.error('  - ' + failure));
  process.exit(1);
}
console.log(`Practical Guide responsive validation passed at ${viewports.map(item => item.width).join(', ')}px; screenshots saved in ${path.relative(process.cwd(), artifactDir)}.`);
