import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../js/theme-manager.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function render(random) {
  const heading = { innerHTML: '' };
  const description = { textContent: '' };
  const document = {
    currentScript: null,
    documentElement: { style: { setProperty() {} } },
    getElementById: () => null,
    querySelector: selector => selector.endsWith(' h1') ? heading :
      selector.endsWith(' .hero-description') ? description :
      selector === 'script[data-story-visuals]' ? {} : null
  };
  const context = vm.createContext({
    document, window: { location: { pathname: '/' } },
    Math: Object.assign(Object.create(Math), { random: () => random })
  });
  vm.runInContext(source, context);
  return { context, heading, description };
}

test('every random bucket selects its complete hero pair at startup', () => {
  const { context } = render(0);
  const messages = vm.runInContext('heroMessages', context);
  assert.equal(messages.length, 13);
  const headings = new Set();
  for (let index = 0; index < messages.length; index++) {
    const actual = render((index + 0.5) / messages.length);
    const expected = messages[index];
    assert.equal(actual.heading.innerHTML, expected.line1 + ' <br><span>' + expected.line2 + '</span>');
    assert.equal(actual.description.textContent, expected.description);
    headings.add(actual.heading.innerHTML);
  }
  assert.equal(headings.size, messages.length);
  assert.equal(render(0).heading.innerHTML, render(Number.EPSILON).heading.innerHTML);
  assert.equal(render(1 - Number.EPSILON).description.textContent, messages.at(-1).description);
});

test('static fallback and search/social titles center human agency', () => {
  assert.match(html, /<h1>Expand Your Agency\./);
  for (const title of [
    '<title>Hadosh Academy | Expand Your Agency</title>',
    'property="og:title" content="Hadosh Academy | Expand Your Agency"',
    'name="twitter:title" content="Hadosh Academy | Expand Your Agency"'
  ]) assert.ok(html.includes(title));
  assert.doesNotMatch(html + source, /engineer agents/i);
  assert.match(html, /theme-manager\.js\?v=20261029-agency-1/);
});
