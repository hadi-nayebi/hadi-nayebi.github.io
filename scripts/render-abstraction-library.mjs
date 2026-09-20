import fs from "node:fs";
import path from "node:path";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

function nav(active = "Agents") {
  const items = [["Home","/index.html"],["Start Here","/start-here.html"],["Blog","/blog.html"],["Agents","/agents.html"],["Projects","/projects/index.html"],["What's New","/whats-new.html"],["About","/about.html"],["Services","/services.html"]];
  return `<header id="site-header"><div class="container"><nav><a href="/index.html" class="logo">Hadosh Academy</a><button class="nav-toggle" aria-label="Open navigation" aria-expanded="false"><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span></button><div class="nav-links">${items.map(([label, href]) => `<a href="${href}"${label === active ? ' class="active" aria-current="page"' : ""}>${escapeHtml(label)}</a>`).join("")}</div></nav></div></header>`;
}

function head(title, description, canonical) {
  return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Hadosh Academy</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="Hadi Nayebi">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)} | Hadosh Academy">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://hadi-nayebi.github.io/assets/images/digital-cortex-2-og.jpg">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Hadosh Academy">
    <link rel="stylesheet" href="/css/styles.css?v=20260903-whats-new-1">
    <link rel="stylesheet" href="/css/abstractions.css?v=20260920-2">
</head>`;
}

function footer(includeLibraryScript = false) {
  return `<footer id="site-footer"><div class="container"><p>&copy; <span id="copyright-year">2026</span> Hadosh Academy. All rights reserved.</p></div></footer>
<script src="/js/theme-manager.js?v=20260907-seed-architecture-visual-1"></script><script src="/js/components.js?v=20260920-abstractions-1"></script>${includeLibraryScript ? '<script src="/js/abstraction-library.js?v=20260920-1"></script>' : ""}`;
}

function giscus() {
  return `<div class="term-discussion-shell"><p data-community-guidance><strong>Before posting:</strong> Keep the return tied to this term and remove personal, client, employer, confidential, proprietary, credential, and unrelated information. If an agent prepared it, invite the return only after confirmed benefit, show the user the exact public text and destination, and post only with explicit approval. See the <a href="/CONTRIBUTING.md">contribution guide</a>.</p><script src="https://giscus.app/client.js" data-repo="hadi-nayebi/hadi-nayebi.github.io" data-repo-id="R_kgDOHL_tnQ" data-category="General" data-category-id="DIC_kwDOHL_tnc4C3cRQ" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="dark" data-lang="en" data-loading="lazy" crossorigin="anonymous" async></script></div>`;
}

function renderIndex(lib) {
  const categoryById = Object.fromEntries(lib.categories.map(category => [category.id, category]));
  const draftCount = lib.terms.filter(term => term.status === "draft").length;
  const consolidatedCount = lib.terms.filter(term => term.status === "consolidated").length;
  const questionCount = lib.terms.reduce((sum, term) => sum + term.openQuestions.length, 0);
  const cloud = lib.terms.map(term => {
    const category = categoryById[term.category];
    const search = [term.name, term.definition, category.name, term.status].join(" ").toLowerCase();
    const label = `${term.name}. ${term.status}. ${category.name}. ${term.openQuestions.length} open questions.`;
    return `<a class="cloud-term" href="/agents/abstractions/terms/${term.slug}.html" data-term-item data-weight="${term.weight}" data-category="${term.category}" data-status="${term.status}" data-search="${escapeHtml(search)}" aria-label="${escapeHtml(label)}">${escapeHtml(term.name)}</a>`;
  }).join("");
  const cards = lib.terms.map(term => {
    const category = categoryById[term.category];
    const search = [term.name, term.definition, category.name, term.status].join(" ").toLowerCase();
    const questionLabel = term.openQuestions.length === 1 ? "1 open question" : `${term.openQuestions.length} open questions`;
    return `<a class="term-card" href="/agents/abstractions/terms/${term.slug}.html" data-term-card data-category="${term.category}" data-status="${term.status}" data-search="${escapeHtml(search)}"><span class="term-card-meta"><span class="term-card-state">${escapeHtml(term.status)}</span><span class="term-card-category">${escapeHtml(category.name)}</span></span><h3>${escapeHtml(term.name)}</h3><p>${escapeHtml(term.definition)}</p><span class="term-card-footer"><span>${questionLabel}</span><span class="term-card-link">Read &amp; discuss →</span></span></a>`;
  }).join("");
  const categoryFilters = lib.categories.map(category => `<button class="filter-button" type="button" data-filter-group="category" data-filter="${category.id}" aria-pressed="false" aria-controls="term-cloud term-directory-grid">${escapeHtml(category.name)}</button>`).join("");
  const legend = lib.categories.map(category => `<span class="legend-item"><span class="legend-swatch" style="--legend-color:${category.id === "capability-runtime" ? "#67e8f9" : category.id === "harness-anatomy" ? "#c4b5fd" : "#fda4af"}"></span>${escapeHtml(category.name)}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
${head("Canonical Abstraction Library", lib.description, "https://hadi-nayebi.github.io/agents/abstractions/")}
<body class="abstraction-library-page">
${nav()}
<main>
  <section class="abstraction-hero"><div class="container"><span class="badge">Living public library</span><h1>Canonical Abstraction Library</h1><p>${escapeHtml(lib.description)}</p><div class="abstraction-actions"><a class="btn btn-primary" href="#vocabulary">Explore the vocabulary</a><a class="btn btn-secondary" href="#terms">Browse every term</a></div></div></section>

  <section class="container abstraction-cloud-section" id="vocabulary" aria-labelledby="term-map-title">
    <div class="library-section-heading"><div><span class="abstraction-eyebrow">Central vocabulary map</span><h2 id="term-map-title">See the language as a living system.</h2></div><p>Every word opens its definition and discussion. Size reflects current connective weight; color identifies the current category. Search and filters update both this map and the full directory below.</p></div>
    <div class="vocabulary-explorer" data-library-explorer>
      <div class="vocabulary-toolbar"><label class="term-search-label" for="term-search">Find a term<input class="term-search" id="term-search" type="search" placeholder="Search terms" autocomplete="off"></label><p class="library-result-count" id="library-result-count" aria-live="polite">${lib.terms.length} terms · ${questionCount} open questions</p></div>
      <div class="filter-groups" aria-label="Filter the canonical terms">
        <div class="filter-group"><span class="filter-label">Category</span><button class="filter-button" type="button" data-filter-group="category" data-filter="all" aria-pressed="true" aria-controls="term-cloud term-directory-grid">All categories</button>${categoryFilters}</div>
        <div class="filter-group"><span class="filter-label">Maturity</span><button class="filter-button" type="button" data-filter-group="status" data-filter="all" aria-pressed="true" aria-controls="term-cloud term-directory-grid">All states</button><button class="filter-button" type="button" data-filter-group="status" data-filter="draft" aria-pressed="false" aria-controls="term-cloud term-directory-grid">Draft (${draftCount})</button><button class="filter-button" type="button" data-filter-group="status" data-filter="consolidated" aria-pressed="false" aria-controls="term-cloud term-directory-grid">Consolidated (${consolidatedCount})</button></div>
      </div>
      <div class="cloud-stage"><div class="abstraction-cloud" id="term-cloud" role="navigation" aria-label="Canonical abstraction terms">${cloud}</div><p class="cloud-empty" data-cloud-empty>No terms match this view. Clear the search or choose another filter.</p></div>
      <div class="cloud-legend"><strong>Category color</strong>${legend}<span>Small → large: connective weight 1–5</span></div>
    </div>
  </section>

  <section class="container term-directory" id="terms" aria-labelledby="directory-title"><div class="library-section-heading"><div><span class="abstraction-eyebrow">Browse and discuss</span><h2 id="directory-title">Every term has one auditable home.</h2></div><p>Open a page to read the current definition, inspect its boundaries and relationships, review unresolved questions, and join the public discussion.</p></div><div class="term-card-grid" id="term-directory-grid">${cards}</div><p class="term-directory-empty" data-directory-empty>No term cards match this view.</p><p class="category-policy">${escapeHtml(lib.categoryPolicy)}</p></section>

  <section class="container maturation-section" aria-labelledby="maturation-title"><div class="library-section-heading"><div><span class="abstraction-eyebrow">Audit loop</span><h2 id="maturation-title">Definitions mature through visible evidence.</h2></div><p>The page never hides uncertainty. Discussion becomes canonical only after accepted learning is reabsorbed into the structured source.</p></div><ol class="maturation-flow"><li data-step="01"><strong>Draft</strong><span>Publish the clearest current definition and expose its unresolved edges.</span></li><li data-step="02"><strong>Discuss</strong><span>Collect critique, answers, counterexamples, and implementation evidence on the term page.</span></li><li data-step="03"><strong>Reabsorb</strong><span>Revise the source and close, replace, or sharpen questions the definition can now answer.</span></li><li data-step="04"><strong>Consolidate</strong><span>Mark the term consolidated only after Hadi accepts it and no definition questions remain.</span></li></ol><p class="maturation-note">Because the map and pages are generated from the same source, an accepted update changes the definition, metadata, directory, and vocabulary map together.</p></section>

  <section class="container agent-handoff"><div><span class="abstraction-eyebrow">For people and agents</span><h2>Use the vocabulary before choosing an implementation.</h2><p>Read only the terms relevant to the responsibility being built. Then translate their boundaries into the selected runtime, files, permissions, and verification mechanisms.</p></div><div><a class="btn btn-primary" href="/data/abstraction-library.json">Open structured source</a><a class="btn btn-secondary" href="/agents.html">Return to Agents</a></div></section>
</main>
${footer(true)}
</body>
</html>
`;
}

function renderTerm(lib, term, index) {
  const bySlug = Object.fromEntries(lib.terms.map(item => [item.slug, item]));
  const category = lib.categories.find(item => item.id === term.category);
  const prev = lib.terms[(index - 1 + lib.terms.length) % lib.terms.length];
  const next = lib.terms[(index + 1) % lib.terms.length];
  const related = term.related.map(slug => bySlug[slug]).filter(Boolean);
  const questionLabel = term.openQuestions.length === 1 ? "1 open question" : `${term.openQuestions.length} open questions`;
  const schema = JSON.stringify({"@context":"https://schema.org","@type":"DefinedTerm",name:term.name,description:term.definition,inDefinedTermSet:"https://hadi-nayebi.github.io/agents/abstractions/"});
  return `<!DOCTYPE html>
<html lang="en">
${head(term.name, term.definition, `https://hadi-nayebi.github.io/agents/abstractions/terms/${term.slug}.html`)}
<body class="abstraction-term-page" data-term="${term.slug}" data-definition-state="${term.status}" data-category="${term.category}">
${nav()}
<main>
  <article>
    <section class="term-hero" aria-labelledby="term-title"><div class="container"><div class="term-breadcrumb" role="navigation" aria-label="Breadcrumb"><a href="/agents.html">Agents</a><span aria-hidden="true">→</span><a href="/agents/abstractions/">Abstraction Library</a><span aria-hidden="true">→</span><span aria-current="page">${escapeHtml(term.name)}</span></div><div class="term-hero-grid"><div><div class="term-state-row"><span class="term-status-badge">${escapeHtml(term.status)}</span><span class="term-category-name">${escapeHtml(category.name)}</span><span>${escapeHtml(term.id)}</span></div><h1 id="term-title">${escapeHtml(term.name)}</h1><p class="term-definition">${escapeHtml(term.definition)}</p><div class="term-hero-actions"><a class="btn btn-primary" href="#open-questions">Review ${questionLabel}</a><a class="btn btn-secondary" href="#discussion">Join the discussion</a></div></div><aside class="term-hero-summary" aria-label="Term audit summary"><span>Current maturity</span><strong>${escapeHtml(term.status)}</strong><span style="margin-top:1rem">Last source update</span><strong>${escapeHtml(lib.updated)}</strong><a href="/data/abstraction-library.json">Inspect structured source →</a></aside></div></div></section>
    <div class="term-jump-shell"><div class="container term-jump-nav" role="navigation" aria-label="On this term page"><a href="#definition">Definition</a><a href="#boundaries">Boundaries</a><a href="#relationships">Relationships</a><a href="#open-questions">Open questions</a><a href="#discussion">Comment on this term →</a></div></div>
    <div class="container term-layout">
      <div class="term-main">
        <section id="definition"><span class="abstraction-eyebrow">Current definition</span><h2>Role in the harness</h2><p>${escapeHtml(term.role)}</p></section>
        <section id="boundaries"><h2>Boundary and invariants</h2>${term.boundary.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>
        <section id="relationships"><h2>Relationships</h2><p>${escapeHtml(term.relationships)}</p><div class="related-terms">${related.map(item => `<a href="${item.slug}.html">${escapeHtml(item.name)}</a>`).join("")}</div></section>
        <section id="adaptation"><h2>Questions for local adaptation</h2><ul>${term.adaptationQuestions.map(question => `<li>${escapeHtml(question)}</li>`).join("")}</ul></section>
        <section id="evidence"><h2>Evidence and realization</h2><p>${escapeHtml(term.evidence)}</p></section>
        <section class="term-avoid" id="avoid"><h2>Avoid</h2><p>${escapeHtml(term.avoid)}</p></section>
        <section class="open-questions" id="open-questions"><span class="abstraction-eyebrow">Definition audit</span><h2>Open questions</h2><p>These are unresolved edges in the current definition. Use the discussion to answer one, offer a counterexample, or propose a sharper question.</p><ol>${term.openQuestions.map(question => `<li id="${question.id.toLowerCase()}"><span>${escapeHtml(question.id)}</span><p>${escapeHtml(question.text)}</p><a class="question-discuss-link" href="#discussion">Discuss this question ↓</a></li>`).join("")}</ol></section>
        <section class="term-discussion" id="discussion"><span class="abstraction-eyebrow">Public discussion</span><h2>Help this definition mature</h2><p>Respond to an open question, identify an ambiguity, or share privacy-scrubbed evidence from a real harness. Accepted learning is reabsorbed through a reviewed source change; discussion alone does not make a claim canonical.</p>${giscus()}</section>
      </div>
      <aside class="term-aside"><div class="term-audit-card"><span class="abstraction-eyebrow">Audit this term</span><strong>${escapeHtml(term.status)}</strong><p>${escapeHtml(lib.definitionStates[term.status])}</p><dl><div><dt>Open questions</dt><dd>${term.openQuestions.length}</dd></div><div><dt>Category</dt><dd>${escapeHtml(category.name)}</dd></div><div><dt>Term ID</dt><dd>${escapeHtml(term.id)}</dd></div></dl><div class="term-audit-actions"><a href="#discussion">Comment on this term</a><a href="#open-questions">Review open questions</a></div></div></aside>
    </div>
    <div class="container term-sequence" role="navigation" aria-label="Term navigation"><a href="${prev.slug}.html"><span>Previous term</span><strong>← ${escapeHtml(prev.name)}</strong></a><a href="/agents/abstractions/"><span>All terms</span><strong>Library index</strong></a><a href="${next.slug}.html"><span>Next term</span><strong>${escapeHtml(next.name)} →</strong></a></div>
  </article>
</main>
<script type="application/ld+json">${schema}</script>
${footer()}
</body>
</html>
`;
}

const root = process.cwd();
const library = JSON.parse(fs.readFileSync(path.join(root, "data/abstraction-library.json"), "utf8"));
const outputs = new Map();
outputs.set("agents/abstractions/index.html", renderIndex(library));
library.terms.forEach((term, index) => outputs.set(`agents/abstractions/terms/${term.slug}.html`, renderTerm(library, term, index)));
const checking = process.argv.includes("--check");
const stale = [];
for (const [relative, content] of outputs) {
  const absolute = path.join(root, relative);
  if (checking) {
    if (!fs.existsSync(absolute) || fs.readFileSync(absolute, "utf8") !== content) stale.push(relative);
  } else {
    fs.mkdirSync(path.dirname(absolute), {recursive: true});
    fs.writeFileSync(absolute, content);
  }
}
if (stale.length) {
  console.error("Abstraction pages are stale:\n" + stale.map(item => "  - " + item).join("\n"));
  process.exit(1);
}
console.log(checking ? `Abstraction pages current: ${outputs.size} files checked.` : `Abstraction pages rendered: ${outputs.size} files written.`);
