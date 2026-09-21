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
    <link rel="alternate" type="application/json" title="Canonical abstraction data" href="/data/abstraction-library.json">
    <meta property="og:title" content="${escapeHtml(title)} | Hadosh Academy">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://hadi-nayebi.github.io/assets/images/digital-cortex-2-og.jpg">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Hadosh Academy">
    <link rel="stylesheet" href="/css/styles.css?v=20260903-whats-new-1">
    <link rel="stylesheet" href="/css/abstractions.css?v=20260920-3">
</head>`;
}

function footer() {
  return `<footer id="site-footer"><div class="container"><p>&copy; <span id="copyright-year">2026</span> Hadosh Academy. All rights reserved.</p></div></footer>
<script src="/js/theme-manager.js?v=20260907-seed-architecture-visual-1"></script><script src="/js/components.js?v=20260920-abstractions-1"></script>`;
}

function giscus() {
  return `<div class="term-discussion-shell"><p><strong>Before posting:</strong> Keep your comment about this term and remove private or identifying information. If an agent drafted it, post only with your explicit approval of the exact text and destination. See the <a href="/CONTRIBUTING.md">contribution guide</a>.</p><script src="https://giscus.app/client.js" data-repo="hadi-nayebi/hadi-nayebi.github.io" data-repo-id="R_kgDOHL_tnQ" data-category="General" data-category-id="DIC_kwDOHL_tnc4C3cRQ" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="dark" data-lang="en" data-loading="lazy" crossorigin="anonymous" async></script></div>`;
}

function renderIndex(lib) {
  const palette = ["cyan", "violet", "rose", "amber", "blue", "mint"];
  const cloud = lib.terms.map((term, index) => {
    const questionLabel = term.openQuestions.length === 1 ? "1 open question" : `${term.openQuestions.length} open questions`;
    const opticalSize = term.name.length > 18 ? 1 : term.name.length > 10 ? 2 : 3;
    return `<a class="cloud-term cloud-term-${opticalSize} cloud-color-${palette[index % palette.length]}" href="/agents/abstractions/terms/${term.slug}.html" aria-label="${escapeHtml(`${term.name}. ${term.status}. ${questionLabel}.`)}"><span>${escapeHtml(term.name)}</span></a>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
${head("Canonical Abstraction Library", lib.purpose, "https://hadi-nayebi.github.io/agents/abstractions/")}
<body class="abstraction-library-page">
${nav()}
<main>
  <section class="library-intro"><div class="container"><span class="abstraction-eyebrow">Shared context for human-owned harnesses</span><h1>Canonical Abstraction Library</h1><p>${escapeHtml(lib.purpose)}</p><p class="definition-state-note"><strong>Draft</strong> terms are open to revision. <strong>Consolidated</strong> terms are ready to guide new harness work.</p></div></section>
  <section class="container abstraction-cloud-section" aria-labelledby="term-map-title">
    <div class="library-section-heading"><h2 id="term-map-title">Choose a term</h2><p>Open its current definition, examine what remains unresolved, and add to the discussion.</p></div>
    <div class="abstraction-cloud" role="navigation" aria-label="Canonical abstraction terms">${cloud}</div>
  </section>
</main>
${footer()}
</body>
</html>
`;
}

function renderQuestions(term) {
  if (!term.openQuestions.length) {
    return `<p class="no-open-questions">No unresolved definition questions remain. If you find a new ambiguity, raise it in the discussion.</p>`;
  }
  return `<ol>${term.openQuestions.map(question => `<li><p>${escapeHtml(question)}</p></li>`).join("")}</ol>`;
}

function renderTerm(lib, term) {
  const questionLabel = term.openQuestions.length === 1 ? "1 open question" : `${term.openQuestions.length} open questions`;
  const questionIntroduction = term.openQuestions.length
    ? `<p>These are the parts of the definition that still need clarification.</p>`
    : "";
  const schema = JSON.stringify({"@context":"https://schema.org","@type":"DefinedTerm",name:term.name,description:term.definition,inDefinedTermSet:"https://hadi-nayebi.github.io/agents/abstractions/"});
  return `<!DOCTYPE html>
<html lang="en">
${head(term.name, term.definition, `https://hadi-nayebi.github.io/agents/abstractions/terms/${term.slug}.html`)}
<body class="abstraction-term-page" data-term="${term.slug}" data-definition-state="${term.status}">
${nav()}
<main>
  <article>
    <section class="term-hero" aria-labelledby="term-title"><div class="container term-reading-width"><a class="back-to-library" href="/agents/abstractions/">← All terms</a><div class="term-state-row"><span class="term-status-badge">${escapeHtml(term.status)}</span><span>${escapeHtml(lib.definitionStates[term.status])}</span></div><h1 id="term-title">${escapeHtml(term.name)}</h1><div class="canonical-definition"><span class="abstraction-eyebrow">Current definition</span><p>${escapeHtml(term.definition)}</p></div><a class="term-comment-link" href="#discussion">Comment on this term</a></div></section>
    <div class="container term-reading-width term-content">
      <section class="open-questions" id="open-questions"><span class="abstraction-eyebrow">${escapeHtml(questionLabel)}</span><h2>Open questions</h2>${questionIntroduction}${renderQuestions(term)}</section>
      <section class="term-discussion" id="discussion"><span class="abstraction-eyebrow">Public discussion</span><h2>Discuss this term</h2><p>Identify an ambiguity, propose clearer wording, or answer an open question. Accepted contributions are reviewed and folded back into the definition.</p>${giscus()}</section>
      <a class="back-to-library back-to-library-bottom" href="/agents/abstractions/">← Return to all terms</a>
    </div>
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
library.terms.forEach(term => outputs.set(`agents/abstractions/terms/${term.slug}.html`, renderTerm(library, term)));
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
