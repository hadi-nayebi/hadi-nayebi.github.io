#!/usr/bin/env node
// Browser regressions for the existing contact and service journeys.
// npm install --no-save --package-lock=false playwright@1.62.1
// npx playwright install chromium
// node --test scripts/test-form-behavior.cjs
// EmailJS is replaced locally; these tests never send email or contact a provider.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
let browser, server, base;
before(async () => {
    server = http.createServer((request, response) => {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            response.writeHead(404).end();
            return;
        }
        const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }[path.extname(file)];
        if (type) response.setHeader('Content-Type', type);
        fs.createReadStream(file).pipe(response);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE || undefined });
});
after(async () => {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
});

async function pageFor(t, pathname, viewport = { width: 1280, height: 900 }) {
    const context = await browser.newContext({ viewport });
    t.after(() => context.close());
    await context.addInitScript(() => {
        window.mailTest = { calls: [], mode: 'pending', elapsed: 0 };
        const now = Date.now;
        Date.now = () => now() + window.mailTest.elapsed;
    });
    await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === base) return route.continue();
        if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('@emailjs/browser')) {
            return route.fulfill({ contentType: 'text/javascript', body: `
                window.emailjs = {
                    init() {},
                    send(service, template, params) {
                        const state = window.mailTest;
                        state.calls.push({ service, template, params });
                        if (state.mode === 'throw') throw new Error('Synchronous delivery failure');
                        if (state.mode === 'reject') return Promise.reject(new Error('Delivery rejected'));
                        if (state.mode === 'welcome-fails' && template === 'template_wq2dosk') return Promise.reject(new Error('Welcome rejected'));
                        if (state.mode === 'pending') return new Promise(() => {});
                        return Promise.resolve({ status: 200 });
                    }
                };` });
        }
        return route.abort();
    });
    const page = await context.newPage();
    await page.goto(base + pathname);
    return page;
}

async function contact(page) {
    await page.locator('#name').fill('Test Visitor');
    await page.locator('#email').fill('test@example.invalid');
    await page.locator('#message').fill('A local regression test, never sent.');
    await page.locator('#contact-consent').check();
}

test('contact cooldown remains retryable and duplicate submits produce one delivery', async t => {
    const page = await pageFor(t, '/contact.html');
    await contact(page);
    await page.evaluate(() => localStorage.setItem('hadosh-contact-last-success', String(Date.now())));
    await page.locator('#submit-button').click();
    assert.match(await page.locator('#contact-form-status').innerText(), /already accepted/);
    assert.equal(await page.locator('#submit-button').isEnabled(), true);
    assert.equal(await page.locator('#submit-button').innerText(), 'Send Message');
    await page.evaluate(() => { window.mailTest.elapsed = 61000; });
    await page.locator('#submit-button').click();
    await page.waitForFunction(() => window.mailTest.calls.length === 1);
    await page.locator('#contact-form').dispatchEvent('submit');
    assert.equal(await page.evaluate(() => window.mailTest.calls.length), 1);
});

test('contact failures preserve input and permit a successful retry', async t => {
    const page = await pageFor(t, '/contact.html');
    await contact(page);
    for (const mode of ['reject', 'throw']) {
        await page.evaluate(mode => { window.mailTest.mode = mode; }, mode);
        await page.locator('#submit-button').click();
        await page.waitForFunction(() => !document.getElementById('submit-button').disabled);
        assert.match(await page.locator('#contact-form-status').innerText(), /could not be sent/);
        assert.equal(await page.locator('#message').inputValue(), 'A local regression test, never sent.');
    }
    await page.evaluate(() => { window.mailTest.mode = 'success'; });
    await page.locator('#submit-button').click();
    await page.waitForURL(base + '/thanks.html');
});

async function services(page, short = false) {
    const next = page.locator('#services-next');
    await next.click();
    await page.locator('[name="experience"][value="New to the concepts"]').check();
    await next.click();
    await page.locator('[name="client_type"][value="Individual"]').check();
    await next.click();
    await page.locator('[name="current_system"][value="Nothing yet"]').check();
    await next.click();
    await page.locator(`[name="desired_help"][value="${short ? 'Learn the foundations' : 'Build an initial harness'}"]`).check();
    await next.click();
    if (!short) {
        await page.locator('#ownership-outcome').fill('Keep a durable research workflow I can maintain.');
        await next.click();
        await page.locator('[name="participation"][value="Active co-builder"]').check();
        await next.click();
        await page.locator('#timeframe').selectOption({ label: 'Not sure' });
        await page.locator('#sensitivity').selectOption({ label: 'Public or non-sensitive' });
        await page.locator('#budget').selectOption({ label: 'Under $500' });
        await next.click();
        assert.match(await page.locator('.services-recommendation.is-primary').innerText(), /Free Initial Guidance/);
    }
    await page.locator('[name="preferred_path"][value="Still deciding"]').check();
    await next.click();
    await page.locator('#services-name').fill('Test Visitor');
    await page.locator('#services-email').fill('test@example.invalid');
    await page.locator('[name="consent"]').check();
    await page.locator('#services-send-welcome').uncheck();
    await page.evaluate(() => { window.mailTest.elapsed = 6000; });
}

test('service delivery recovers from a synchronous SDK failure without losing the reviewed request', async t => {
    const page = await pageFor(t, '/services.html');
    await services(page);
    await page.evaluate(() => { window.mailTest.mode = 'throw'; });
    await page.locator('#services-submit').click();
    await page.waitForFunction(() => !document.getElementById('services-submit').disabled);
    assert.match(await page.locator('#services-intake-status').innerText(), /could not be sent/);
    assert.equal(await page.locator('#services-name').inputValue(), 'Test Visitor');
    await page.evaluate(() => { window.mailTest.mode = 'success'; });
    await page.locator('#services-submit').click();
    await page.locator('#services-success').waitFor({ state: 'visible' });
    const calls = await page.evaluate(() => window.mailTest.calls);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].params.preferred_path, 'Still deciding');
    assert.match(calls[1].params.message, /Keep a durable research workflow/);
    assert.equal(await page.locator('#services-intake-form').isVisible(), false);
});

test('short mobile intake omits skipped answers and distinguishes welcome failure from request success', async t => {
    const page = await pageFor(t, '/services.html', { width: 390, height: 844 });
    await services(page, true);
    assert.equal(await page.locator('#services-step-total').innerText(), '6');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('#services-send-welcome').check();
    await page.evaluate(() => { window.mailTest.mode = 'welcome-fails'; });
    await page.locator('#services-submit').click();
    await page.locator('#services-success').waitFor({ state: 'visible' });
    assert.match(await page.locator('#services-success-welcome').innerText(), /request was received.*guide could not be sent/);
    const calls = await page.evaluate(() => window.mailTest.calls);
    assert.equal(calls.length, 2);
    const encoded = calls[0].params.message.split('HADOSH_SERVICES_INTAKE_V1:')[1];
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    assert.equal(payload.project.ownership_outcome, '');
    assert.equal(payload.project.participation, '');
    assert.equal(payload.contact.newcomer_guide_requested, true);
});
