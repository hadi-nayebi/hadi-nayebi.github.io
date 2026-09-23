import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const route = '/blog/practical-guides/03-give-your-ai-work-a-private-github-home.html';
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

    for (const selector of ['.article-content', 'table', 'pre']) {
      for (const element of document.querySelectorAll(selector)) {
        if (!visible(element)) continue;
        const rect = element.getBoundingClientRect();
        if (rect.left < -1 || rect.right > window.innerWidth + 1) {
          problems.push(`${label(element)} leaves viewport: ${rect.left}px..${rect.right}px`);
        }
      }
    }

    for (const table of document.querySelectorAll('table')) {
      const style = getComputedStyle(table);
      if (window.innerWidth <= 720 && !['auto', 'scroll'].includes(style.overflowX)) {
        problems.push('table does not provide horizontal scrolling on a narrow viewport');
      }
      if (table.getAttribute('tabindex') !== '0') {
        problems.push('scrollable table is missing keyboard focus');
      }
      const rect = table.getBoundingClientRect();
      if (rect.left < -1 || rect.right > window.innerWidth + 1) {
        problems.push(`table leaves viewport: ${rect.left}px..${rect.right}px`);
      }
    }

    const expectedIds = [
      'what-you-will-have-at-the-end', 'the-shortest-useful-route', 'choose-one-real-project',
      'why-a-filesystem-why-git-and-why-github', 'the-github-words-that-give-you-control',
      'part-1--create-or-secure-your-github-account', 'part-2--install-github-mobile',
      'part-3--create-one-private-repository', 'part-5--create-the-smallest-useful-context',
      'part-6--connect-chatgpt-codex-or-another-agent', 'part-7--test-the-direct-repository-connection',
      'part-8--use-issues-as-requests-from-your-phone', 'part-9--follow-the-path-your-agent-actually-supports',
      'part-10--review-on-github-mobile', 'part-11--run-the-fresh-conversation-test',
      'copy-this-guided-conversation-instruction', 'completion-check'
    ];
    for (const id of expectedIds) {
      if (!document.getElementById(id)) problems.push(`missing guide section #${id}`);
    }

    const officialLinks = document.querySelectorAll(
      'a[href^="https://docs.github.com"], a[href^="https://github.com/mobile"], a[href^="https://help.openai.com"], a[href^="https://git-scm.com"]'
    );
    if (officialLinks.length < 8) problems.push(`expected at least eight official source links, found ${officialLinks.length}`);

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
  await page.locator('table').first().screenshot({
    path: path.join(artifactDir, `guide-03-terms-table-${viewport.width}x${viewport.height}.png`)
  });
  await page.locator('table').nth(1).screenshot({
    path: path.join(artifactDir, `guide-03-capability-table-${viewport.width}x${viewport.height}.png`)
  });

  for (const [name, selector] of [
    ['connection-test', '#part-7--test-the-direct-repository-connection + p + blockquote'],
    ['agent-handoff', '#copy-this-guided-conversation-instruction + p + blockquote'],
    ['completion', '#completion-check + p + ul'],
    ['discussion', '.article-comments']
  ]) {
    await page.locator(selector).screenshot({
      path: path.join(artifactDir, `guide-03-${name}-${viewport.width}x${viewport.height}.png`)
    });
  }

  if (viewport.width <= 412) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    await page.addStyleTag({ content: '.fb-bubble, .fb-panel, .fb-toast { display: none !important; }' });
    await page.locator('.nav-toggle').click();
    await page.waitForTimeout(100);
    const expanded = await page.locator('.nav-toggle').getAttribute('aria-expanded');
    const visibleLinks = await page.locator('.nav-links a:visible').count();
    if (expanded !== 'true' || visibleLinks < 5) {
      failures.push(`${viewport.width}x${viewport.height}: mobile navigation did not open`);
    }
    await page.screenshot({
      path: path.join(artifactDir, `guide-03-mobile-nav-${viewport.width}x${viewport.height}.png`),
      fullPage: false
    });
  }

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
