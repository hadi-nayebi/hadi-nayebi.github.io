import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const route = '/blog/observations/information-system-of-a-planet/';
const series = JSON.parse(fs.readFileSync('blog/observations/information-system-of-a-planet/series.json', 'utf8'));
const selected = process.env.OBSERVATION_EPISODES?.split(',').filter(Boolean).map(Number);
const targets = series.episode_index.filter(item => selected?.length ? selected.includes(item.number) : true);
assert(targets.length, 'No Observation episode is selected');
const output = 'artifacts/observation-rendering';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const errors = [];
try {
  for (const width of [360, 412, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + route + '#episode-' + targets[0].number + '-slide-1');
    await page.waitForSelector('#episode-' + targets[0].number + ':not([hidden]) .slide-copy');
    await page.evaluate(() => document.fonts.ready);
    for (const item of targets) {
      const episode = JSON.parse(fs.readFileSync(path.join('blog/observations/information-system-of-a-planet', item.path), 'utf8'));
      for (let index = 0; index < episode.slides.length; index += 1) {
        const hash = '#episode-' + item.number + '-slide-' + (index + 1);
        await page.evaluate(hash => { location.hash = hash; }, hash);
        const section = page.locator('#episode-' + item.number + ':not([hidden])');
        const title = episode.slides[index].title;
        await section.locator('.slide-copy h3').filter({ hasText: title }).waitFor();
        const image = section.locator('.slide-image-button img');
        await image.evaluate(img => img.decode());
        assert.equal(await image.getAttribute('alt'), episode.slides[index].image.alt);
        const metrics = await section.evaluate(section => {
          const rect = selector => { const r = section.querySelector(selector).getBoundingClientRect(); return { top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height }; };
          const copy = section.querySelector('.slide-copy');
          return { image:rect('.slide-visual'), copy:rect('.slide-copy'),
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            paragraphs: Array.from(copy.querySelectorAll('p')).map(p => p.textContent),
            bodyHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight };
        });
        assert(!metrics.overflow, 'Horizontal overflow: ' + hash + ' at ' + width);
        for (const rect of [metrics.image, metrics.copy]) {
          assert(rect.width > 0 && rect.height > 0, 'Missing visible panel');
          assert(rect.left >= -1 && rect.right <= width + 1, 'Panel clipped horizontally');
          assert(rect.top >= 0 && rect.bottom <= 901, 'Panel clipped vertically');
        }
        const narration = await section.locator('.slide-paragraphs').textContent();
        for (const paragraph of episode.slides[index].paragraphs) assert(narration.includes(paragraph), 'Narration parity mismatch: ' + hash);
        const stem = output + '/episode-' + item.number + '-slide-' + (index + 1) + '-' + width;
        await page.screenshot({ path: stem + '-viewport.png' });
        await page.screenshot({ path: stem + '-full.png', fullPage: true });
        await section.locator('.slide-copy').evaluate(el => { el.scrollTop = el.scrollHeight; });
        await section.locator('.slide-sources summary').click();
        assert(await section.locator('.slide-sources a').first().isVisible(), 'Source drawer failed');
        await section.locator('.slide-sources summary').click();
        await section.locator('.slide-image-button').click();
        assert(await page.locator('#observation-lightbox').evaluate(el => el.open), 'Fullscreen did not open');
        await page.keyboard.press('Escape');
        assert(!(await page.locator('#observation-lightbox').evaluate(el => el.open)), 'Escape did not close fullscreen');
        if (index === 0) {
          const axe = await new AxeBuilder({ page }).include('#site-header').include('#episode-' + item.number).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
          const violations = axe.violations.filter(v => ['serious','critical'].includes(v.impact));
          assert.deepEqual(violations.map(v => v.id), [], 'Accessibility failures');
          if (width <= 768) {
            await page.locator('.nav-toggle').click();
            assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
            await page.screenshot({ path: stem + '-menu.png' });
            await page.locator('.nav-toggle').click();
          }
        }
        results.push({ episode:item.number, slide:index+1, width, title, metrics, sourceCount:episode.slides[index].sources.length });
      }
      // Keyboard navigation must select the adjacent slide and preserve its hash.
      await page.evaluate(number => { location.hash = '#episode-' + number + '-slide-1'; }, item.number);
      await page.locator('#episode-' + item.number + ':not([hidden]) .slide-copy').focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(number => location.hash === '#episode-' + number + '-slide-2', item.number);
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(number => location.hash === '#episode-' + number + '-slide-1', item.number);
      const active = page.locator('#episode-' + item.number + ':not([hidden])');
      await active.locator('.slide-next').click();
      await page.waitForFunction(number => location.hash === '#episode-' + number + '-slide-2', item.number);
      await active.locator('.slide-prev').click();
      await page.waitForFunction(number => location.hash === '#episode-' + number + '-slide-1', item.number);
      if (width > 760) {
        await active.locator('.slide-dot').nth(2).click();
        await page.waitForFunction(number => location.hash === '#episode-' + number + '-slide-3', item.number);
      }
      await active.locator('.episode-select').selectOption('10');
      await page.waitForSelector('#episode-10:not([hidden])');
      await page.locator('#episode-10:not([hidden]) .episode-select').selectOption(String(item.number));
      await page.waitForSelector('#episode-' + item.number + ':not([hidden])');
    }
    await context.close();
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
} finally {
  fs.writeFileSync(output + '/report.json', JSON.stringify({ results, errors }, null, 2) + '\n');
  await browser.close();
}
console.log('Verified ' + results.length + ' Observation slide/width states with image loading, narration parity, sources, lightbox, keyboard, menu and accessibility checks.');
