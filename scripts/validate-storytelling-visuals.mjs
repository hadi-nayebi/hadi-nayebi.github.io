import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const inventoryPath = path.join(root, 'docs/storytelling-visual-inventory.md');
const inventory = fs.readFileSync(inventoryPath, 'utf8');
const storyVisuals = fs.readFileSync(path.join(root, 'js/story-visuals.js'), 'utf8');
const components = fs.readFileSync(path.join(root, 'js/components.js'), 'utf8');
const observationRendererPath = path.join(root, 'blog/observations/information-system-of-a-planet/observation.js');
const observationRenderer = fs.existsSync(observationRendererPath) ? fs.readFileSync(observationRendererPath, 'utf8') : '';
const rows = [];

for (const line of inventory.split('\n')) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \| (I(10|30|50|70|90)-A(10|30|50|70|90)) \| (HTML|Injected|EpisodeJSON) \| (Yes|No) \|$/);
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
const expectedCount = 81;

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

    if (row.source === 'HTML') {
        const pageSource = fs.readFileSync(pagePath, 'utf8');
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
    } else if (row.source === 'Injected') {
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
    } else {
        const episodeDir = path.join(path.dirname(pagePath), 'episodes');
        const episodeFiles = fs.existsSync(episodeDir)
            ? fs.readdirSync(episodeDir).filter((name) => name.endsWith('.json'))
            : [];
        let found = null;
        for (const name of episodeFiles) {
            const episode = JSON.parse(fs.readFileSync(path.join(episodeDir, name), 'utf8'));
            for (const slide of episode.slides || []) {
                if (slide.image?.src === row.asset) {
                    found = slide.image;
                    break;
                }
            }
            if (found) break;
        }
        if (!found) {
            failures.push(`${row.page}: EpisodeJSON asset reference is missing: ${row.asset}`);
            continue;
        }
        if (found.category !== row.style) {
            failures.push(`${row.page}: EpisodeJSON asset ${row.asset} uses ${found.category}; expected ${row.style}`);
        }
        const relativeAsset = path.normalize(path.join(path.dirname(row.page), row.asset));
        if (!fs.existsSync(path.join(root, relativeAsset))) {
            failures.push(`${row.page}: EpisodeJSON asset file is missing: ${relativeAsset}`);
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

if (rows.some((row) => row.source === 'EpisodeJSON')) {
    if (!observationRenderer.includes('slide-image-button')) failures.push('Observation fullscreen image button is missing');
    if (!observationRenderer.includes('openLightbox')) failures.push('Observation fullscreen lightbox behavior is missing');
    for (const token of ['data-visual-style=', 'data-information-weight=', 'data-artistic-weight=', 'data-visual-role="storytelling"']) {
        if (!observationRenderer.includes(token)) failures.push(`Observation renderer is missing ${token}`);
    }
}

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
console.log('All inventoried assets exist, carry five-category metadata, avoid SVG, and use a fullscreen lightbox.');
