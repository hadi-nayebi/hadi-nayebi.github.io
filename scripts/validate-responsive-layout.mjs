import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const library = JSON.parse(fs.readFileSync('data/abstraction-library.json', 'utf8'));
const routes = [
  { name: 'guide-index', path: '/blog.html#practical-guides', kind: 'guide-index' },
  { name: 'guide-private-github-home', path: '/blog/practical-guides/03-give-your-ai-work-a-private-github-home.html', kind: 'guide' },
  { name: 'agents', path: '/agents.html', kind: 'agents' },
  { name: 'library', path: '/agents/abstractions/', kind: 'library' },
  ...library.terms.map(term => ({ name: `term-${term.slug}`, path: `/agents/abstractions/terms/${term.slug}.html`, kind: 'term' }))
];
const viewports = [
  { name: 'phone-small', width: 360, height: 800 },
  { name: 'phone-large', width: 412, height: 915 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];
const shouldCapture = (route, viewport) =>
  (route.kind === 'term' && ['phone-small', 'desktop'].includes(viewport.name)) ||
  (route.kind !== 'term' && ['phone-small', 'phone-large', 'tablet', 'desktop'].includes(viewport.name));
const artifactDir = path.resolve('artifacts/responsive-layout');
fs.mkdirSync(artifactDir, { recursive: true });
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: 'dark' });
  for (const route of routes) {
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, requestRoute => requestRoute.abort());
    await page.goto(baseUrl + route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    await page.addStyleTag({ content: '.fb-bubble, .fb-panel, .fb-toast { display: none !important; }' });

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
      const parseRgb = value => {
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        return match ? { rgb: [Number(match[1]), Number(match[2]), Number(match[3])], alpha: match[4] === undefined ? 1 : Number(match[4]) } : null;
      };
      const luminance = rgb => {
        const channels = rgb.map(channel => {
          const value = channel / 255;
          return value <= .03928 ? value / 12.92 : Math.pow((value + .055) / 1.055, 2.4);
        });
        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
      };
      const contrast = (a, b) => {
        const first = luminance(a);
        const second = luminance(b);
        return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
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

      if (header && visible(header)) {
        const topOwner = document.elementFromPoint(Math.min(40, window.innerWidth - 1), Math.min(40, window.innerHeight - 1));
        if (!topOwner || !topOwner.closest('#site-header')) problems.push(`fixed site header is visually covered by ${topOwner ? label(topOwner) : 'nothing'}`);
      }

      for (const selector of ['.abstraction-entry-cloud', '.abstraction-cloud', '.abstraction-actions', '.term-hero', '.term-discussion-shell']) {
        document.querySelectorAll(selector).forEach(element => {
          const style = getComputedStyle(element);
          if (element.scrollHeight > element.clientHeight + 2 && !['auto', 'scroll'].includes(style.overflowY)) {
            problems.push(`${selector} clips or overflows vertically: ${element.scrollHeight}px > ${element.clientHeight}px`);
          }
        });
      }

      const pairGroups = [['.abstraction-entry-cloud a', '.abstraction-actions a']];
      for (const [leftSelector, rightSelector] of pairGroups) {
        const left = [...document.querySelectorAll(leftSelector)].filter(visible);
        const right = [...document.querySelectorAll(rightSelector)].filter(visible);
        for (const a of left) for (const b of right) {
          if (a !== b && overlaps(a, b)) problems.push(`overlap: ${label(a)} with ${label(b)}`);
        }
      }

      for (const selector of ['.abstraction-entry-cloud a', '.cloud-term', '.abstraction-actions .btn', '.term-comment-link']) {
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

      const termHero = document.querySelector('.term-hero');
      const definition = document.querySelector('.canonical-definition p');
      if (termHero && definition) {
        const heroStyle = getComputedStyle(termHero);
        const definitionStyle = getComputedStyle(definition);
        const background = parseRgb(heroStyle.backgroundColor);
        const foreground = parseRgb(definitionStyle.color);
        if (!background || background.alpha !== 1) problems.push('term hero must use an opaque background color');
        if (['fixed', 'sticky'].includes(heroStyle.position)) problems.push(`term hero must participate in document flow, not use position: ${heroStyle.position}`);
        if (heroStyle.backgroundImage !== 'none') problems.push('term hero must not place a decorative image or gradient behind the definition');
        if (heroStyle.backdropFilter !== 'none' || heroStyle.webkitBackdropFilter && heroStyle.webkitBackdropFilter !== 'none') problems.push('term hero must not use backdrop blur');
        if (background && foreground && contrast(background.rgb, foreground.rgb) < 7) problems.push(`term definition contrast is ${contrast(background.rgb, foreground.rgb).toFixed(2)}:1; expected at least 7:1`);
        const rect = definition.getBoundingClientRect();
        const pointX = Math.min(window.innerWidth - 2, Math.max(1, rect.left + Math.min(rect.width / 2, 80)));
        const pointY = Math.min(window.innerHeight - 2, Math.max(1, rect.top + Math.min(rect.height / 2, 30)));
        const topElement = document.elementFromPoint(pointX, pointY);
        if (topElement && topElement !== definition && !definition.contains(topElement)) problems.push(`definition is visually covered by ${label(topElement)}`);
      }

      document.querySelectorAll('.cloud-term').forEach(element => {
        const rect = element.getBoundingClientRect();
        if (visible(element) && rect.height < 44) problems.push(`${label(element)} has a ${rect.height}px touch target; expected at least 44px`);
      });

      return [...new Set(problems)];
    });

    if (route.kind === 'library') {
      const cloudTerms = await page.locator('.cloud-term').count();
      if (cloudTerms !== library.terms.length) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: expected ${library.terms.length} direct term links, found ${cloudTerms}`);
      const excessControls = await page.locator('#term-search, .filter-button, .term-card, .cloud-legend, .maturation-flow, .agent-handoff').count();
      if (excessControls) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: removed search, filters, directory cards, legends, or workflow panels returned`);
    }

    if (route.kind === 'term') {
      const coreParts = await page.locator('.term-status-badge, .canonical-definition, .open-questions, .term-discussion').count();
      if (coreParts !== 4) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: term page does not contain exactly the four core parts`);
      const excessSections = await page.locator('#boundaries, #relationships, #adaptation, #evidence, #avoid, .term-audit-card, .term-jump-shell, .term-sequence').count();
      if (excessSections) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: removed auxiliary term sections returned`);
    }

    if (route.kind === 'guide-index') {
      const guideLinks = await page.locator('a[href="blog/practical-guides/03-give-your-ai-work-a-private-github-home.html"]').count();
      if (guideLinks < 2) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: Guide 3 is missing from the guide index or newest list`);
    }

    if (route.kind === 'guide') {
      const title = (await page.locator('main h1').textContent())?.trim();
      if (title !== 'Give Your AI Work a Private GitHub Home') failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: unexpected guide title`);
      const sectionCount = await page.locator('.article-body h2').count();
      if (sectionCount < 15) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: guide hierarchy is unexpectedly short (${sectionCount} sections)`);
      const contributionCount = await page.locator('[data-contribution-surface="practical-guide-3"]').count();
      if (contributionCount !== 1) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: contribution surface is missing or duplicated`);

      const articleIssues = await page.evaluate(() => {
        const problems = [];
        for (const element of document.querySelectorAll('.article-body pre, .article-body blockquote, .article-body table')) {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const contained = rect.left >= -1 && rect.right <= window.innerWidth + 1;
          const horizontallyScrollable = ['auto', 'scroll'].includes(style.overflowX) && element.scrollWidth >= element.clientWidth;
          if (!contained && !horizontallyScrollable) problems.push(`${element.tagName.toLowerCase()} leaves the viewport without horizontal scrolling`);
        }
        return [...new Set(problems)];
      });
      articleIssues.forEach(issue => failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: ${issue}`));

      if (viewport.width <= 412) {
        await page.locator('.nav-toggle').click();
        await page.waitForTimeout(100);
        const expanded = await page.locator('.nav-toggle').getAttribute('aria-expanded');
        const visibleLinks = await page.locator('.nav-links a:visible').count();
        if (expanded !== 'true' || visibleLinks < 5) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: mobile navigation did not open`);
        await page.screenshot({ path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}-nav.png`), fullPage: false });
        await page.locator('.nav-toggle').click();
      }
    }

    if (route.kind !== 'agents' && ['phone-small', 'desktop'].includes(viewport.name)) {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      axe.violations.filter(violation => ['serious', 'critical'].includes(violation.impact)).forEach(violation => {
        const targets = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: accessibility ${violation.id} — ${violation.help} (${targets})`);
      });
    }

    if (issues.length || shouldCapture(route, viewport)) {
      await page.screenshot({
        path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}.png`),
        fullPage: true
      });
      if (shouldCapture(route, viewport)) {
        await page.screenshot({
          path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}-fold.png`),
          fullPage: false
        });
        if (route.kind === 'library') {
          await page.locator('.abstraction-cloud').screenshot({
            path: path.join(artifactDir, `library-cloud-${viewport.width}x${viewport.height}.png`)
          });
        }
      }
    }
    for (const issue of issues) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: ${issue}`);
    await page.close();
  }
  await context.close();
}
await browser.close();

if (failures.length) {
  console.error('Responsive layout validation FAILED:');
  [...new Set(failures)].forEach(failure => console.error('  - ' + failure));
  process.exit(1);
}
console.log(`Responsive layout validation passed: ${routes.length} pages across ${viewports.length} viewports; every term was captured at phone and desktop sizes in ${path.relative(process.cwd(), artifactDir)}.`);
