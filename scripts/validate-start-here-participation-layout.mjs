import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const viewports = [
  { name: 'phone-small', width: 360, height: 800 },
  { name: 'phone-large', width: 412, height: 915 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
const artifactDir = path.resolve('artifacts/start-here-participation');
fs.mkdirSync(artifactDir, { recursive: true });
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.abort());
  await page.goto(baseUrl + '/start-here.html#community-return', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const section = document.querySelector('#community-return');
    const header = document.querySelector('#site-header');
    if (!section || !header) return false;
    const sectionTop = section.getBoundingClientRect().top;
    const headerBottom = header.getBoundingClientRect().bottom;
    return sectionTop >= headerBottom + 8 && sectionTop <= headerBottom + 80;
  }, { timeout: 5000 });
  await page.addStyleTag({ content: '.fb-bubble, .fb-panel, .fb-toast { display: none !important; }' });

  const result = await page.evaluate(() => {
    const section = document.querySelector('#community-return');
    if (!section) return { problems: ['missing #community-return'], actions: [] };

    const problems = [];
    const actions = [...section.querySelectorAll('.start-agent-entry-actions a')];
    const overlaps = (a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return Math.min(ar.right, br.right) - Math.max(ar.left, br.left) > 1 &&
        Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top) > 1;
    };

    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      problems.push(`horizontal overflow: document ${document.documentElement.scrollWidth}px > viewport ${window.innerWidth}px`);
    }

    for (let index = 0; index < actions.length; index += 1) {
      const rect = actions[index].getBoundingClientRect();
      if (rect.left < -1 || rect.right > window.innerWidth + 1) {
        problems.push(`action ${index + 1} leaves viewport: ${rect.left}px..${rect.right}px`);
      }
      if (rect.height < 44) problems.push(`action ${index + 1} has a ${rect.height}px touch target`);
      for (let other = index + 1; other < actions.length; other += 1) {
        if (overlaps(actions[index], actions[other])) {
          problems.push(`participation actions ${index + 1} and ${other + 1} overlap`);
        }
      }
    }

    return {
      problems,
      actions: actions.map(action => ({
        text: action.textContent.trim(),
        href: action.getAttribute('href')
      }))
    };
  });

  const expected = [
    { text: 'Read the contribution guide', href: 'CONTRIBUTING.md' },
    { text: 'Browse public discussions', href: 'https://github.com/hadi-nayebi/hadi-nayebi.github.io/discussions' },
    { text: 'Ask Hadi privately', href: 'contact.html' }
  ];
  if (JSON.stringify(result.actions) !== JSON.stringify(expected)) {
    failures.push(`start-here participation actions differ at ${viewport.width}x${viewport.height}: ${JSON.stringify(result.actions)}`);
  }
  result.problems.forEach(problem => failures.push(`start-here @ ${viewport.width}x${viewport.height}: ${problem}`));

  if (['phone-small', 'desktop'].includes(viewport.name)) {
    const axe = await new AxeBuilder({ page })
      .include('#community-return')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    axe.violations
      .filter(violation => ['serious', 'critical'].includes(violation.impact))
      .forEach(violation => failures.push(
        `start-here @ ${viewport.width}x${viewport.height}: accessibility ${violation.id} — ${violation.help}`
      ));
  }

  await page.screenshot({
    path: path.join(artifactDir, `start-here-${viewport.width}x${viewport.height}-fold.png`),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(artifactDir, `start-here-${viewport.width}x${viewport.height}-full.png`),
    fullPage: true
  });
  await page.locator('#community-return').screenshot({
    path: path.join(artifactDir, `start-here-community-return-${viewport.width}x${viewport.height}.png`)
  });

  await page.close();
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error('Start Here participation layout validation FAILED:');
  [...new Set(failures)].forEach(failure => console.error('  - ' + failure));
  process.exit(1);
}

console.log(`Start Here participation layout validation passed across ${viewports.length} viewports; fold, full-page, and focused section screenshots saved to ${path.relative(process.cwd(), artifactDir)}.`);
