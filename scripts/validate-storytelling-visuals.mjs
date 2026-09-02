import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const inventoryPath = path.join(root, 'docs/storytelling-visual-inventory.md');
const inventory = fs.readFileSync(inventoryPath, 'utf8');
const storyVisuals = fs.readFileSync(path.join(root, 'js/story-visuals.js'), 'utf8');
const components = fs.readFileSync(path.join(root, 'js/components.js'), 'utf8');
const rows = [];

for (const line of inventory.split('\n')) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \| (I(10|30|50|70|90)-A(10|30|50|70|90)) \| (HTML|Injected) \| (Yes|No) \|$/);
    if (!match) continue;
    rows.push({
        page: match[1],
        asset: match[2],
        style: match[3],
        information: match[4],
        artistic: match[5],
        source: match[6],
        fullscreen: match[7]
    });
}

const failures = [];
const expectedCount = 74;

if (rows.length !== expectedCount) {
    failures.push(`inventory contains ${rows.length} rows; expected ${expectedCount}`);
}

for (const row of rows) {
    if (Number(row.information) + Number(row.artistic) !== 100) {
        failures.push(`${row.page}: ${row.style} does not total 100`);
    }
    if (row.fullscreen !== 'Yes') {
        failures.push(`${row.page}: ${row.asset} is not marked for fullscreen`);
    }
    if (/\.svg(?:$|[?#])/i.test(row.asset)) {
        failures.push(`${row.page}: storytelling asset still references SVG: ${row.asset}`);
    }

    const pagePath = path.join(root, row.page);
    if (!fs.existsSync(pagePath)) {
        failures.push(`${row.page}: page file is missing`);
        continue;
    }

    const pageSource = fs.readFileSync(pagePath, 'utf8');
    if (row.source === 'HTML') {
        const assetIndex = pageSource.indexOf(`src="${row.asset}"`);
        if (assetIndex === -1) {
            failures.push(`${row.page}: HTML asset reference is missing: ${row.asset}`);
            continue;
        }
        const nearby = pageSource.slice(Math.max(0, assetIndex - 1000), assetIndex + row.asset.length);
        for (const token of [
            `data-visual-style="${row.style}"`,
            `data-information-weight="${row.information}"`,
            `data-artistic-weight="${row.artistic}"`,
            'data-visual-role="storytelling"'
        ]) {
            if (!nearby.includes(token)) failures.push(`${row.page}: ${row.asset} is missing ${token}`);
        }

        const relativeAsset = row.asset.startsWith('/')
            ? row.asset.slice(1)
            : path.normalize(path.join(path.dirname(row.page), row.asset));
        if (!fs.existsSync(path.join(root, relativeAsset))) {
            failures.push(`${row.page}: asset file is missing: ${relativeAsset}`);
        }
    } else {
        const assetIndex = storyVisuals.indexOf(row.asset);
        if (assetIndex === -1) {
            failures.push(`${row.page}: injected asset is missing from story-visuals.js: ${row.asset}`);
            continue;
        }
        const nearby = storyVisuals.slice(assetIndex, assetIndex + 1000);
        if (!nearby.includes(`'${row.style}'`)) {
            failures.push(`${row.page}: injected asset ${row.asset} is missing style ${row.style}`);
        }
        const relativeAsset = row.asset.replace(/^\//, '');
        if (!fs.existsSync(path.join(root, relativeAsset))) {
            failures.push(`${row.page}: injected asset file is missing: ${relativeAsset}`);
        }
    }
}

for (const selector of [
    '.blog-image img',
    '.story-visual img',
    '.family-hero-figure img',
    '.about-section-img',
    '.cortex-feature-img',
    '.home-cortex-img'
]) {
    if (!components.includes(selector)) failures.push(`lightbox selector is missing: ${selector}`);
}

if (!components.includes("event.key === 'Escape'")) failures.push('Escape-to-close lightbox behavior is missing');
if (!components.includes("event.target === overlay")) failures.push('backdrop-to-close lightbox behavior is missing');
if (!components.includes("event.target.classList.contains('lightbox-close')")) failures.push('close-button lightbox behavior is missing');

if (failures.length) {
    console.error('Storytelling visual validation failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
}

const distribution = rows.reduce((counts, row) => {
    counts[row.style] = (counts[row.style] || 0) + 1;
    return counts;
}, {});

console.log(`Validated ${rows.length} storytelling image slots.`);
console.log(`Distribution: ${Object.entries(distribution).sort().map(([style, count]) => `${style}=${count}`).join(', ')}`);
console.log('All inventoried assets exist, carry five-category metadata, avoid SVG, and use the shared fullscreen lightbox.');
