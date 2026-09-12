#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const blogRoot = path.join(root, 'blog');
const reviewRecordsDir = path.join(root, 'docs', 'narration-source-review', 'reviews');

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const rel = (file) => path.relative(root, file).split(path.sep).join('/');
const natural = new Intl.Collator('en', { numeric: true }).compare;
const words = (text) => (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function loadReviewIndex() {
  const essays = {};
  if (!fs.existsSync(reviewRecordsDir)) return { essays };
  const names = fs.readdirSync(reviewRecordsDir).filter((name) => name.endsWith('.json')).sort(natural);
  for (const name of names) {
    const file = path.join(reviewRecordsDir, name);
    const record = JSON.parse(read(file));
    if (record.schema_version !== 1 || typeof record.path !== 'string' || typeof record.review !== 'object' || record.review === null) {
      throw new Error(`invalid narration review record: ${rel(file)}`);
    }
    if (essays[record.path]) throw new Error(`duplicate narration review record for ${record.path}`);
    essays[record.path] = record;
  }
  return { essays };
}

const reviewIndex = loadReviewIndex();
const pendingEssayReview = () => ({
  factual: 'pending',
  technical_or_historical: 'pending',
  chronology_and_maturity: 'pending',
  cross_writing_consistency: 'pending',
  editorial: 'pending',
  source_page_parity: 'pending',
  hadi_content_lock: 'pending',
});

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return {};
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!item) continue;
    values[item[1]] = item[2].replace(/^['"]|['"]$/g, '');
  }
  return values;
}

function externalUrls(text) {
  return [...new Set((text.match(/https?:\/\/[^\s)>"']+/g) || []).map((url) => url.replace(/[.,;:]$/, '')))];
}

function essayFiles() {
  const files = [];
  for (let series = 1; series <= 9; series += 1) {
    const dir = path.join(blogRoot, `b${series}`);
    for (const name of fs.readdirSync(dir)) {
      if (/^\d.*\.md$/.test(name) && !name.endsWith('.transcript.md')) files.push(path.join(dir, name));
    }
  }
  return files.sort((a, b) => natural(rel(a), rel(b)));
}

const conceptualPaths = new Set([
  'blog/b1/01-llms-are-not-the-agents.md',
  'blog/b2/02-we-could-have-had-agi.md',
  'blog/b3/03-your-brain-was-never-built-for-this.md',
  'blog/b3/03_1-the-folder-is-alive.md',
  'blog/b4/04-the-language-of-agents.md',
]);

function inspectEssay(file) {
  const source = read(file);
  const sourcePath = rel(file);
  const sourceHash = sha256(source);
  const metadata = frontmatter(source);
  const refTags = [...source.matchAll(/\*\[ref:\s*([\s\S]*?)\]\*/g)].map((match) => match[1]);
  const longRefTags = refTags.filter((tag) => {
    const fields = tag.split('|');
    return fields.length >= 3 && words(fields.slice(2).join('|')) > 120;
  }).length;
  const html = file.replace(/\.md$/, '.html');
  const transcript = file.replace(/\.md$/, '.transcript.yaml');
  const publishedPage = fs.existsSync(html) ? read(html) : '';
  const transcriptSource = fs.existsSync(transcript) ? read(transcript) : '';
  const transcriptFinalMatch = transcriptSource.match(/^final:\s*(true|false)\b/m);
  const transcriptFinal = transcriptFinalMatch ? transcriptFinalMatch[1] === 'true' : null;
  const issues = [];
  if (!fs.existsSync(html)) issues.push('missing-published-html');
  if (!metadata.status) issues.push('missing-source-status');
  if (metadata.status === 'draft') issues.push('source-marked-draft');
  if (longRefTags) issues.push(`${longRefTags}-overlong-evidence-annotations`);
  const recorded = reviewIndex.essays[sourcePath] || null;
  let review = pendingEssayReview();
  let reviewRecord = null;
  if (recorded) {
    reviewRecord = recorded.report || null;
    if (recorded.source_sha256 === sourceHash) {
      review = { ...review, ...recorded.review };
    } else {
      review = Object.fromEntries(Object.keys(review).map((gate) => [gate, 'stale']));
      issues.push('stale-review-record');
    }
  }
  if (recorded && review.hadi_content_lock !== 'passed' && /class="article-audio"/.test(publishedPage)) {
    issues.push('unlocked-narration-exposed');
  }
  if (transcriptFinal && review.hadi_content_lock !== 'passed') {
    issues.push('transcript-final-without-current-content-lock');
  }
  return {
    path: sourcePath,
    class: conceptualPaths.has(sourcePath) ? 'principle-writing' : 'technical-writing',
    source_sha256: sourceHash,
    words: words(source.replace(/\*\[ref:[\s\S]*?\]\*/g, '')),
    source_status: metadata.status || null,
    version: metadata.version || null,
    evidence_annotations: refTags.length,
    external_sources: externalUrls(source).length,
    published_html: fs.existsSync(html) ? rel(html) : null,
    transcript_yaml: fs.existsSync(transcript) ? rel(transcript) : null,
    transcript_final: transcriptFinal,
    review_record: reviewRecord,
    review,
    issues,
  };
}

function inspectObservation() {
  const dir = path.join(blogRoot, 'observations', 'information-system-of-a-planet');
  const manifest = JSON.parse(read(path.join(dir, 'series.json')));
  const episodes = manifest.episode_index.map((entry) => {
    const file = path.join(dir, entry.path);
    const episode = JSON.parse(read(file));
    const sourcePath = rel(file);
    const sourceHash = sha256(read(file));
    const issues = [];
    const recorded = reviewIndex.essays[sourcePath] || null;
    const pendingReview = {
      factual: 'pending',
      historical: 'pending',
      source_support: 'pending',
      narrative_continuity: 'pending',
      editorial: 'pending',
      hadi_content_lock: 'pending',
    };
    let review = pendingReview;
    if (recorded) {
      if (recorded.source_sha256 === sourceHash) {
        review = { ...pendingReview, ...recorded.review };
      } else {
        review = Object.fromEntries(Object.keys(pendingReview).map((gate) => [gate, 'stale']));
        issues.push('stale-review-record');
      }
    }
    const slides = episode.slides.map((slide) => {
      const prose = slide.paragraphs.join('\n\n');
      return {
        id: slide.id,
        title: slide.title,
        source_sha256: sha256(prose),
        words: words(prose),
        sources: slide.sources?.length || 0,
        audio_status: slide.audio?.status || null,
      };
    });
    if (review.hadi_content_lock !== 'passed' && slides.some((slide) => slide.audio_status === 'available')) {
      issues.push('unlocked-narration-exposed');
    }
    return {
      path: sourcePath,
      number: episode.number,
      title: episode.title,
      source_sha256: sourceHash,
      slides,
      review_record: recorded?.report || null,
      review,
      issues,
    };
  });
  return {
    series: manifest.title,
    series_path: rel(path.join(dir, 'series.json')),
    episodes,
  };
}

function inspectGuide() {
  const file = path.join(blogRoot, 'practical-guides', '01-build-your-own-space-on-the-web.md');
  const source = read(file);
  const html = file.replace(/\.md$/, '.html');
  const sourcePath = rel(file);
  const sourceHash = sha256(source);
  const issues = [];
  const recorded = reviewIndex.essays[sourcePath] || null;
  const pendingReview = {
    factual: 'pending',
    procedural_reproduction: 'pending',
    safety_and_privacy: 'pending',
    editorial: 'pending',
    source_page_parity: 'pending',
    hadi_content_lock: 'pending',
  };
  let review = pendingReview;
  if (recorded) {
    if (recorded.source_sha256 === sourceHash) {
      review = { ...pendingReview, ...recorded.review };
    } else {
      review = Object.fromEntries(Object.keys(pendingReview).map((gate) => [gate, 'stale']));
      issues.push('stale-review-record');
    }
  }
  return {
    path: sourcePath,
    source_sha256: sourceHash,
    words: words(source),
    external_sources: externalUrls(source).length,
    published_html: fs.existsSync(html) ? rel(html) : null,
    review_record: recorded?.report || null,
    review,
    issues,
  };
}

const essays = essayFiles().map(inspectEssay);
const observation = inspectObservation();
const guide = inspectGuide();
const structuralErrors = [];
if (essays.length !== 49) structuralErrors.push(`expected 49 numbered essays, found ${essays.length}`);
if (essays.filter((item) => item.class === 'principle-writing').length !== 5) structuralErrors.push('expected 5 Part 1 principle writings');
if (observation.episodes.length !== 6) structuralErrors.push(`expected 6 published Observation episodes, found ${observation.episodes.length}`);
const unlockedFinalTranscripts = essays.filter((item) =>
  item.issues.includes('transcript-final-without-current-content-lock'),
);
if (unlockedFinalTranscripts.length) {
  structuralErrors.push(
    `${unlockedFinalTranscripts.length} structured transcripts are marked final without a current Hadi content lock`,
  );
}

const report = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  repository_revision: process.env.GITHUB_SHA || null,
  policy: {
    audio_phase: 'blocked-until-written-content-lock',
    principle_writings: 'minimal-corrections-preserve-approved-voice',
    technical_writings: 'substantive-corrections-allowed-for-accuracy',
    excluded: ['owner-excluded unpublished writing', 'Explore pages', 'diagram narration', 'portfolio and project pages', 'all other website pages'],
  },
  totals: {
    numbered_essays: essays.length,
    principle_writings: essays.filter((item) => item.class === 'principle-writing').length,
    technical_writings: essays.filter((item) => item.class === 'technical-writing').length,
    observation_episodes: observation.episodes.length,
    observation_slides: observation.episodes.reduce((sum, episode) => sum + episode.slides.length, 0),
    practical_guides: 1,
  },
  structural_errors: structuralErrors,
  essays,
  observation,
  practical_guides: [guide],
};

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log('Narration source corpus');
  console.log(`  Numbered essays: ${report.totals.numbered_essays} (${report.totals.principle_writings} principle, ${report.totals.technical_writings} technical)`);
  console.log(`  Observation: ${report.totals.observation_episodes} episodes / ${report.totals.observation_slides} slides`);
  console.log(`  Practical guides: ${report.totals.practical_guides}`);
  console.log(`  Essay sources marked draft: ${essays.filter((item) => item.issues.includes('source-marked-draft')).length}`);
  console.log(`  Essay sources missing status: ${essays.filter((item) => item.issues.includes('missing-source-status')).length}`);
  console.log(`  Evidence annotations: ${essays.reduce((sum, item) => sum + item.evidence_annotations, 0)}`);
  console.log(`  Overlong evidence annotations: ${essays.reduce((sum, item) => sum + item.issues.filter((issue) => issue.endsWith('overlong-evidence-annotations')).reduce((n, issue) => n + Number.parseInt(issue, 10), 0), 0)}`);
  console.log(`  Final transcripts without current content lock: ${unlockedFinalTranscripts.length}`);
  if (structuralErrors.length) {
    for (const error of structuralErrors) console.error(`  ERROR: ${error}`);
  }
}

process.exitCode = structuralErrors.length ? 1 : 0;
