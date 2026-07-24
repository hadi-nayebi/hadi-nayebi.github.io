#!/usr/bin/env node

import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mapsRoot = resolve(
  process.env.CRIME_CARTOGRAPHY_REPO ||
  join(websiteRoot, "..", "..", "maps"),
);
const map = JSON.parse(
  await readFile(join(mapsRoot, "context/WEBSITE-CONTENT-MAP.json"), "utf8"),
);

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

const pages = [
  await readFile(join(websiteRoot, "projects/crime-cartography.html"), "utf8"),
  await readFile(join(websiteRoot, "projects/index.html"), "utf8"),
];
const subscriptionScript = await readFile(
  join(websiteRoot, "js/project-subscribe.js"),
  "utf8",
);
const html = pages.join("\n");

const declaredBlocks = [...html.matchAll(
  /data-content-id="([^"]+)"\s+data-project-source="([^"]+)"/g,
)].map((match) => ({
  id: match[1],
  sources: match[2].split(",").map((value) => value.trim()),
}));

assert.deepEqual(
  declaredBlocks.map(({id}) => id).sort(),
  Object.keys(map.blocks).sort(),
  "website block ids must exactly match the canonical content map",
);

for (const block of declaredBlocks) {
  assert.deepEqual(
    block.sources,
    map.blocks[block.id].sources,
    `${block.id} must declare its canonical sources in canonical order`,
  );
  for (const source of block.sources) {
    await access(join(mapsRoot, source));
  }
}

const projectPage = pages[0];
assert.match(
  projectPage,
  /<main[^>]+data-content-id="crime-page"[^>]+data-project-source="[^"]+"/,
  "the complete project-page main region must declare canonical sources",
);
assert.match(
  projectPage,
  /<nav[^>]+class="project-mobile-actions"[^>]+data-content-id="crime-mobile-actions"[^>]+data-project-source="[^"]+"/,
  "the project-specific mobile action rail must declare canonical sources",
);
const storySections = [...projectPage.matchAll(
  /<section[^>]+id="(understand|define|join)"[^>]*>/g,
)];
assert.equal(storySections.length, 3, "project page must have exactly three story sections");

const threeNav = projectPage.match(
  /<nav class="project-jump-nav project-three-nav"[\s\S]*?<\/nav>/,
)?.[0] ?? "";
assert.equal(
  (threeNav.match(/<a /g) ?? []).length,
  3,
  "project navigation must expose exactly three choices",
);

const discussionNumbers = new Set(
  [...projectPage.matchAll(/crime-cartography\/discussions\/(\d+)/g)]
    .map((match) => match[1]),
);
for (const number of discussionNumbers) {
  const source = map.discussion_sources[number];
  assert.ok(source, `Discussion #${number} needs a canonical source body`);
  await access(join(mapsRoot, source));
}

const repositoryLinks = [
  ...projectPage.matchAll(
    /github\.com\/hadi-nayebi\/crime-cartography\/blob\/main\/([^"#?]+)/g,
  ),
].map((match) => decodeURIComponent(match[1]));
for (const source of repositoryLinks) {
  await access(join(mapsRoot, source));
}

assert.doesNotMatch(projectPage, /Hadosh Video Studio|private human review studio/i);
assert.doesNotMatch(projectPage, /A real contribution/i);
assert.match(projectPage, /name="website"[^>]+tabindex="-1"/);
assert.match(projectPage, /name="name"[^>]+maxlength="80"/);
assert.match(projectPage, /name="email"[^>]+maxlength="254"/);
assert.match(subscriptionScript, /blockHeadless:\s*true/);
assert.match(subscriptionScript, /limitRate:\s*\{/);
assert.match(subscriptionScript, /MIN_FORM_AGE_MS\s*=\s*4000/);
assert.match(subscriptionScript, /SUCCESS_COOLDOWN_MS\s*=\s*15\s*\*\s*60\s*\*\s*1000/);

assert.deepEqual(
  await readJson(join(websiteRoot, "data/crime-cartography-status.json")),
  await readJson(join(mapsRoot, "public/project-status.json")),
  "website project-status fallback must be an exact projection from maps",
);
assert.deepEqual(
  await readJson(join(websiteRoot, "data/crime-cartography-discussions.json")),
  await readJson(join(mapsRoot, "public/discussion-status.json")),
  "website Discussion fallback must be an exact projection from maps",
);

process.stdout.write(
  `PASS ${declaredBlocks.length} source-backed blocks, 3 story sections, ` +
  `${discussionNumbers.size} canonical Discussion routes, exact fallback projections\n`,
);
