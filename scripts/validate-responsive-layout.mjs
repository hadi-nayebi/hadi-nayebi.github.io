import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const library = JSON.parse(fs.readFileSync('data/abstraction-library.json', 'utf8'));
const routes = [
  { name: 'cartography', path: '/projects/cartography.html', kind: 'copy' },
  { name: 'projects', path: '/projects/index.html', kind: 'copy' },
  { name: 'home', path: '/index.html', kind: 'copy' },
  { name: 'home-open-architecture', path: '/index.html', kind: 'copy' },
  { name: 'home-digital-cortex', path: '/index.html', kind: 'copy' },
  { name: 'about', path: '/about.html', kind: 'copy' },
  { name: 'content', path: '/content.html', kind: 'copy' },
  { name: 'essay1', path: '/blog/b1/01-llms-are-not-the-agents.html', kind: 'essay' },
  { name: 'essay2', path: '/blog/b2/02-we-could-have-had-agi.html', kind: 'essay' },
  { name: 'essay3', path: '/blog/b3/03-your-brain-was-never-built-for-this.html', kind: 'essay' },
  { name: 'diagrams', path: '/explore.html', kind: 'copy' },
  { name: 'services', path: '/services.html', kind: 'copy' },
  { name: 'agents', path: '/agents.html', kind: 'agents' },
  { name: 'start-here', path: '/start-here.html', kind: 'start' },
  { name: 'job-core', path: '/blog/b5/05_4-job-core.html', kind: 'copy' },
  { name: 'map-territory', path: '/blog/observations/hadosh-through-mental-models/02-map-is-not-territory.html', kind: 'copy' },
  { name: 'circle-of-competence', path: '/blog/observations/hadosh-through-mental-models/03-circle-of-competence.html', kind: 'story' },
  { name: 'ai-that-grows-with-you', path: '/blog/principles/the-ai-that-grows-with-you.html', kind: 'copy' },
  { name: 'ai-use-map', path: '/blog/practical-guides/02-audit-ai-harness-portability.html', kind: 'guide' },
  { name: 'whats-new', path: '/whats-new.html', kind: 'whats-new' },
  { name: 'private-github-home', path: '/blog/practical-guides/03-give-your-ai-work-a-private-github-home.html', kind: 'guide' },
  { name: 'library', path: '/agents/abstractions/', kind: 'library' },
  ...library.terms.map(term => ({ name: `term-${term.slug}`, path: `/agents/abstractions/terms/${term.slug}.html`, kind: 'term' }))
];
const selectedRoutes = process.env.LAYOUT_ROUTES ? routes.filter(route => process.env.LAYOUT_ROUTES.split(',').includes(route.name)) : routes;
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
const maxReliableScreenshotHeight = 14000;
const screenshotSegmentOverlap = 120;

async function captureFullPageEvidence(page, route, viewport) {
  const pageHeight = await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';
    return Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight || 0
    );
  });
  if (!['essay2', 'essay3'].includes(route.name) || pageHeight <= maxReliableScreenshotHeight) {
    await page.screenshot({
      path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}.png`),
      fullPage: true
    });
    return;
  }

  const maxScroll = Math.max(0, pageHeight - viewport.height);
  const step = Math.max(1, viewport.height - screenshotSegmentOverlap);
  const positions = [];
  for (let y = 0; y < maxScroll; y += step) positions.push(y);
  if (positions.at(-1) !== maxScroll) positions.push(maxScroll);

  let part = 1;
  for (const y of positions) {
    await page.evaluate(scrollY => window.scrollTo({ left: 0, top: scrollY, behavior: 'instant' }), y);
    await page.waitForTimeout(40);
    const actualScroll = await page.evaluate(() => window.scrollY);
    if (Math.abs(actualScroll - y) > 2) {
      throw new Error(`Unable to capture ${route.name} at ${viewport.width}x${viewport.height}: requested scroll ${y}, reached ${actualScroll}`);
    }
    await page.screenshot({
      path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}-full-${String(part).padStart(2, '0')}.png`),
      fullPage: false
    });
    part += 1;
  }

  await page.evaluate(() => window.scrollTo({ left: 0, top: 0, behavior: 'instant' }));
  await page.waitForTimeout(40);
  const resetScroll = await page.evaluate(() => window.scrollY);
  if (resetScroll !== 0) {
    throw new Error(`Unable to reset ${route.name} to the top before the fold screenshot`);
  }
}
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: 'dark' });
  for (const route of selectedRoutes) {
    const page = await context.newPage();
    if (route.name === 'home') await page.addInitScript(() => { Math.random = () => 0; });
    if (route.name === 'home-open-architecture') await page.addInitScript(() => { Math.random = () => 0.28; });
    if (route.name === 'home-digital-cortex') await page.addInitScript(() => { Math.random = () => 0.2; });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, requestRoute => requestRoute.abort());
    await page.goto(baseUrl + route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    await page.addStyleTag({ content: '.fb-bubble, .fb-panel, .fb-toast { display: none !important; }' });

    if (route.name === 'home') {
      const heroCopy = await page.locator('.hero-description').innerText();
      const heroHeading = await page.locator('.central-circle-content h1').innerText();
      if (!heroHeading.includes('See the System.') || !heroHeading.includes('Make It Yours.')) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: approved homepage heading was replaced at runtime`);
      if (!heroCopy.startsWith('Your AI agent already has a system around it.')) {
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: approved hero wording was replaced at runtime`);
      }
    }
    if (route.name === 'home-open-architecture') {
      const heroCopy = await page.locator('.hero-description').innerText();
      if (!heroCopy.startsWith('A public pattern should show what it does')) {
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: approved Open Architecture wording was replaced at runtime`);
      }
    }

    if (route.name === 'home-digital-cortex') {
      const heroCopy = await page.locator('.hero-description').innerText();
      if (!heroCopy.startsWith('Where does a correction go after you make it?')) {
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: approved Digital Cortex wording was replaced at runtime`);
      }
    }

    if (route.name === 'essay1') {
      if (await page.locator('.essay-abstract').count() !== 1) failures.push(`${route.path}: abstract missing`);
      const expectedEssayVisuals = [
        'images/llm-engine-agent-directory-b1-1.png',
        'images/action-space-markov-chain-b1-2.png',
        'images/hooks-and-action-space-b1-4.png'
      ];
      const essayVisuals = await page.locator('.article-body figure img').evaluateAll(images =>
        images.map(image => image.getAttribute('src'))
      );
      for (const src of expectedEssayVisuals) {
        if (!essayVisuals.includes(src)) failures.push(`${route.path}: expected teaching visual ${src}`);
      }
      if (essayVisuals.length !== expectedEssayVisuals.length) {
        failures.push(`${route.path}: expected ${expectedEssayVisuals.length} teaching visuals, found ${essayVisuals.length}`);
      }
      if (await page.locator('.article-audio').count()) failures.push(`${route.path}: old narration player returned`);
      if (await page.locator('.article-body a[href*="/original-llms-are-not-the-agents-v1.3.0.md"]').count() !== 1) failures.push(`${route.path}: original Markdown reference missing`);
      if ((await page.locator('.article-authors').innerText()).trim() !== 'By Hadi Nayebi & GPT-6 Sol') failures.push(`${route.path}: current co-author byline missing`);
      const tagOverflow = await page.locator('.article-meta-tags .tag').evaluateAll(elements =>
        elements.some(element => element.getBoundingClientRect().right > window.innerWidth + 1)
      );
      if (tagOverflow) failures.push(`${route.path} @ ${viewport.width}px: article tags leave the viewport`);
    }

    if (route.name === 'essay2') {
      if (await page.locator('.essay-abstract').count() !== 1) failures.push(`${route.path}: abstract missing`);
      if (await page.locator('.article-body figure').count() !== 3) failures.push(`${route.path}: expected all three teaching visuals`);
      if (await page.locator('.article-audio').count()) failures.push(`${route.path}: stale narration player returned`);
      if (await page.locator('.article-body a[href$="original-we-could-have-had-agi-v1.2.0.md"]').count() !== 1) failures.push(`${route.path}: original Markdown reference missing`);
      if ((await page.locator('.article-authors').innerText()).trim() !== 'By Hadi Nayebi & Claude Opus 4.8') failures.push(`${route.path}: current co-author byline missing`);
      const tagOverflow = await page.locator('.article-meta-tags .tag').evaluateAll(elements =>
        elements.some(element => element.getBoundingClientRect().right > window.innerWidth + 1)
      );
      if (tagOverflow) failures.push(`${route.path} @ ${viewport.width}px: article tags leave the viewport`);
    }


    if (route.name === 'essay3') {
      if (await page.locator('.essay-abstract').count() !== 1) failures.push(`${route.path}: abstract missing`);
      if (await page.locator('.article-body figure').count() !== 3) failures.push(`${route.path}: expected all three trilogy visuals`);
      if (await page.locator('.article-audio').count()) failures.push(`${route.path}: stale narration player returned`);
      if (await page.locator('.article-body a[href$="original-your-brain-was-never-built-for-this-v0.2.0.md"]').count() !== 1) failures.push(`${route.path}: original Markdown reference missing`);
      if (await page.locator('.article-body a[href$="02-we-could-have-had-agi.html"]').count() !== 1) failures.push(`${route.path}: previous essay link missing`);
      if (await page.locator('.article-body a[href$="03_1-the-folder-is-alive.html"]').count() !== 1) failures.push(`${route.path}: next essay link missing`);
      if (await page.locator('.blog-series-mobile-nav a').count() !== 3) failures.push(`${route.path}: complete mobile series navigation missing`);
      if ((await page.locator('.article-authors').innerText()).trim() !== 'By Hadi Nayebi & Claude Opus 4.8') failures.push(`${route.path}: current co-author byline missing`);
      const tagOverflow = await page.locator('.article-meta-tags .tag').evaluateAll(elements =>
        elements.some(element => element.getBoundingClientRect().right > window.innerWidth + 1)
      );
      if (tagOverflow) failures.push(`${route.path} @ ${viewport.width}px: article tags leave the viewport`);
    }


    if (['essay1', 'essay2', 'essay3'].includes(route.name)) {
      const abstract = page.locator('.essay-abstract');
      if (await abstract.count() !== 1) {
        failures.push(`${route.path}: expected exactly one essay abstract`);
      } else {
        const abstractState = await abstract.evaluate(element => {
          const style = getComputedStyle(element);
          const label = element.querySelector('.essay-abstract-label');
          return {
            background: style.backgroundColor,
            borderLeftWidth: parseFloat(style.borderLeftWidth || '0'),
            paddingTop: parseFloat(style.paddingTop || '0'),
            rawMarkdown: element.innerHTML.includes('**'),
            labelText: label?.textContent?.trim() || ''
          };
        });
        if (abstractState.background === 'rgba(0, 0, 0, 0)' || abstractState.borderLeftWidth < 3 || abstractState.paddingTop < 10) {
          failures.push(`${route.path}: abstract panel styling is missing`);
        }
        if (abstractState.rawMarkdown) failures.push(`${route.path}: raw Markdown emphasis leaked into abstract HTML`);
        if (abstractState.labelText !== 'Abstract') failures.push(`${route.path}: abstract label missing`);
      }
    }

    if (route.kind === 'essay' && viewport.width <= 720) {
      const mobileSeriesNavOverflows = await page.locator('.blog-series-mobile-nav').evaluate(nav => {
        const linksLeaveViewport = [...nav.querySelectorAll('a')].some(link => {
          const rect = link.getBoundingClientRect();
          return rect.left < -1 || rect.right > window.innerWidth + 1;
        });
        return linksLeaveViewport || nav.scrollWidth > nav.clientWidth + 1;
      });
      if (mobileSeriesNavOverflows) failures.push(`${route.path} @ ${viewport.width}px: series navigation actions are not fully visible`);
    }

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

    if (route.name === 'home') {
      const communityCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Join the Conversation', exact: true }) });
      const cardCount = await communityCard.count();
      if (cardCount !== 1) {
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: expected one Join the Conversation card, found ${cardCount}`);
      } else {
        const link = communityCard.getByRole('link', { name: 'Choose how to participate →', exact: true });
        if (await link.count() !== 1) {
          failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: participation CTA is missing or duplicated`);
        } else {
          const href = await link.getAttribute('href');
          if (href !== 'start-here.html#community-return') {
            failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: participation CTA points to ${href}`);
          }
        }
        const cardIssues = await communityCard.evaluate(card => {
          const problems = [];
          const rect = card.getBoundingClientRect();
          if (rect.left < -1 || rect.right > window.innerWidth + 1) {
            problems.push(`community card leaves viewport: ${rect.left}px..${rect.right}px`);
          }
          const link = card.querySelector('a');
          if (link && link.getBoundingClientRect().height < 44) {
            problems.push(`community CTA has a ${link.getBoundingClientRect().height}px touch target`);
          }
          return problems;
        });
        cardIssues.forEach(problem => failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: ${problem}`));
      }
    }

    if (route.kind === 'library') {
      const cloudTerms = await page.locator('.cloud-term').count();
      if (cloudTerms !== library.terms.length) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: expected ${library.terms.length} direct term links, found ${cloudTerms}`);
      const excessControls = await page.locator('#term-search, .filter-button, .term-card, .cloud-legend, .maturation-flow, .agent-handoff').count();
      if (excessControls) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: removed search, filters, directory cards, legends, or workflow panels returned`);
    }

    if (route.kind === 'start') {
      const cards = await page.locator('#practical-guides a').evaluateAll(elements =>
        elements.map(element => {
          const rect = element.getBoundingClientRect();
          return { href: element.getAttribute('href'), left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        })
      );
      const expected = [
        'blog/practical-guides/02-audit-ai-harness-portability.html',
        'blog/practical-guides/01-build-your-own-space-on-the-web.html',
        'blog/practical-guides/03-give-your-ai-work-a-private-github-home.html'
      ];
      if (cards.length !== 3 || cards.some((card, index) => card.href !== expected[index])) {
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: practical-guide chooser does not contain three correct destinations`);
      }
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].left < -1 || cards[i].right > viewport.width + 1) {
          failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: guide card ${i + 1} leaves viewport`);
        }
        for (let j = i + 1; j < cards.length; j++) {
          if (Math.min(cards[i].right, cards[j].right) - Math.max(cards[i].left, cards[j].left) > 1 &&
              Math.min(cards[i].bottom, cards[j].bottom) - Math.max(cards[i].top, cards[j].top) > 1) {
            failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: practical-guide cards overlap`);
          }
        }
      }
    }

    if (route.kind === 'whats-new') {
      const cards = await page.locator('.update-card').count();
      if (!cards) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: weekly summary did not render`);
      const firstType = cards ? await page.locator('.update-card .update-type').first().innerText() : '';
      if (firstType !== 'Weekly public summary') failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: first entry is not the weekly public summary`);
      const engagementRoutes = await page.locator('.update-card a[href="/start-here.html#community-return"]').count();
      if (!engagementRoutes) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: public engagement route is missing`);
    }

    if (route.kind === 'term') {
      const coreParts = await page.locator('.term-status-badge, .canonical-definition, .open-questions, .term-discussion').count();
      if (coreParts !== 4) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: term page does not contain exactly the four core parts`);
      const excessSections = await page.locator('#boundaries, #relationships, #adaptation, #evidence, #avoid, .term-audit-card, .term-jump-shell, .term-sequence').count();
      if (excessSections) failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: removed auxiliary term sections returned`);
    }

    if (route.name === 'cartography') {
      const body = await page.locator('main').innerText();
      if (/Crime Cartography|channel stays focused on crime|inherited reference cuts|dedicated remakes/i.test(body)) failures.push('Cartography: obsolete identity or production bookkeeping returned');
      const commentKey = await page.locator('script[src="https://giscus.app/client.js"]').getAttribute('data-term');
      if (commentKey !== 'projects/crime-cartography') failures.push('Cartography: existing comment mapping changed');
      for (const target of ['understand', 'define', 'join', 'project-comments']) {
        if (await page.locator('#' + target).count() !== 1) failures.push('Cartography: missing anchor ' + target);
      }
      const redirect = await context.newPage();
      await redirect.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, requestRoute => requestRoute.abort());
      await redirect.goto(baseUrl + '/projects/crime-cartography.html?source=legacy#understand');
      await redirect.waitForURL('**/cartography.html?source=legacy#understand');
      await redirect.close();
    }

    if (route.kind !== 'agents' && ['phone-small', 'desktop'].includes(viewport.name)) {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      axe.violations.filter(violation => ['serious', 'critical'].includes(violation.impact)).forEach(violation => {
        const targets = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
        failures.push(`${route.path} @ ${viewport.width}x${viewport.height}: accessibility ${violation.id} — ${violation.help} (${targets})`);
      });
    }

    if (issues.length || shouldCapture(route, viewport)) {
      await captureFullPageEvidence(page, route, viewport);
      if (shouldCapture(route, viewport)) {
        await page.screenshot({
          path: path.join(artifactDir, `${route.name}-${viewport.width}x${viewport.height}-fold.png`),
          fullPage: false
        });
        if (route.name === 'home') {
          const communityCard = page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Join the Conversation', exact: true }) });
          if (await communityCard.count() === 1) {
            await communityCard.screenshot({
              path: path.join(artifactDir, `homepage-community-${viewport.width}x${viewport.height}.png`)
            });
          }
        }
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
console.log(`Responsive layout validation passed: ${selectedRoutes.length} pages across ${viewports.length} viewports; every term was captured at phone and desktop sizes in ${path.relative(process.cwd(), artifactDir)}.`);
