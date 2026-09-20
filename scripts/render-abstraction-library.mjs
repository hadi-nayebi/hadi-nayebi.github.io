import fs from "node:fs";
import path from "node:path";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}
function nav(active="Agents") {
  const items=[["Home","/index.html"],["Start Here","/start-here.html"],["Blog","/blog.html"],["Agents","/agents.html"],["Projects","/projects/index.html"],["What's New","/whats-new.html"],["About","/about.html"],["Services","/services.html"]];
  return `<header id="site-header"><div class="container"><nav><a href="/index.html" class="logo">Hadosh Academy</a><button class="nav-toggle" aria-label="Open navigation" aria-expanded="false"><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span></button><div class="nav-links">${items.map(([label,href])=>`<a href="${href}"${label===active?' class="active" aria-current="page"':""}>${escapeHtml(label)}</a>`).join("")}</div></nav></div></header>`;
}
function head(title,description,canonical) {
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
    <meta property="og:image" content="https://hadi-nayebi.github.io/assets/images/digital-cortex-2-og.jpg">\n    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Hadosh Academy">
    <link rel="stylesheet" href="/css/styles.css?v=20260903-whats-new-1">
    <link rel="stylesheet" href="/css/abstractions.css?v=20260920-1">
</head>`;
}
function footer() {
  return `<footer id="site-footer"><div class="container"><p>&copy; <span id="copyright-year">2026</span> Hadosh Academy. All rights reserved.</p></div></footer>
<script src="/js/theme-manager.js?v=20260907-seed-architecture-visual-1"></script><script src="/js/components.js?v=20260920-abstractions-1"></script>`;
}
function giscus() {
  return `<div class="term-discussion-shell"><p data-community-guidance><strong>Before posting:</strong> Keep the return tied to this term and remove personal, client, employer, confidential, proprietary, credential, and unrelated information. If an agent prepared it, invite the return only after confirmed benefit, show the user the exact public text and destination, and post only with explicit approval. See the <a href="/CONTRIBUTING.md">contribution guide</a>.</p><script src="https://giscus.app/client.js" data-repo="hadi-nayebi/hadi-nayebi.github.io" data-repo-id="R_kgDOHL_tnQ" data-category="General" data-category-id="DIC_kwDOHL_tnc4C3cRQ" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="dark" data-lang="en" data-loading="lazy" crossorigin="anonymous" async></script></div>`;
}
function renderIndex(lib) {
  const bySlug=Object.fromEntries(lib.terms.map(term=>[term.slug,term]));
  const readingPaths=[
    {title:"Capability becomes action",description:"Follow general capability into a bounded system that can do continuing work.",terms:["model","large-language-model","runtime","harness","agent"]},
    {title:"Control becomes agency",description:"Trace how selected context and practical ownership expand a person's capacity.",terms:["context","harness","user-owned","agency"]},
    {title:"A seed becomes a system",description:"See how a minimal starting substrate grows into durable, responsible operation.",terms:["seed","context","harness","agent"]}
  ];
  const paths=readingPaths.map(path=>`<article class="abstraction-path"><h3>${escapeHtml(path.title)}</h3><p>${escapeHtml(path.description)}</p><ol>${path.terms.map(slug=>{const term=bySlug[slug];return `<li><a href="/agents/abstractions/terms/${term.slug}.html"><strong>${escapeHtml(term.name)}</strong><span>${escapeHtml(term.definition)}</span></a></li>`;}).join("")}</ol></article>`).join("");
  const cards = lib.categories.map(category => {
    const categoryTerms=lib.terms.filter(t=>t.category===category.id);
    return `<section class="term-category" id="${category.id}"><div class="term-category-heading"><div><span class="abstraction-eyebrow">Current category</span><h2>${escapeHtml(category.name)}</h2></div><p>${escapeHtml(category.description)}</p></div><div class="term-card-grid">${categoryTerms.map(t=>`<a class="term-card" href="/agents/abstractions/terms/${t.slug}.html"><span class="term-card-state">${escapeHtml(t.status)}</span><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.definition)}</p><span class="term-card-questions">${t.openQuestions.length} open questions</span></a>`).join("")}</div></section>`;
  }).join("");
  return `<!DOCTYPE html>
<html lang="en">
${head("Canonical Abstraction Library",lib.description,"https://hadi-nayebi.github.io/agents/abstractions/")}
<body class="abstraction-library-page">
${nav()}
<main>
  <section class="abstraction-hero"><div class="container"><span class="badge">Draft public seed</span><h1>Canonical Abstraction Library</h1><p>${escapeHtml(lib.description)}</p><div class="abstraction-actions"><a class="btn btn-primary" href="#terms">Explore the terms</a><a class="btn btn-secondary" href="/data/abstraction-library.json">Structured source</a></div></div></section>
  <section class="container abstraction-map-section" aria-labelledby="term-map-title"><div class="term-category-heading"><div><span class="abstraction-eyebrow">Relationship map</span><h2 id="term-map-title">Choose a path through the terms</h2></div><p>Each path makes one relationship explicit. Terms may appear in more than one path because the same concept can connect capability, control, and growth.</p></div><div class="abstraction-paths">${paths}</div></section>
  <section class="container maturation-section"><div class="term-category-heading"><div><span class="abstraction-eyebrow">Audit loop</span><h2>Definitions mature in public</h2></div><p>A definition becomes clearer by keeping its unresolved edges visible.</p></div><ol class="maturation-flow"><li><strong>Draft</strong><span>Publish the clearest current definition and its open questions.</span></li><li><strong>Discuss</strong><span>Collect critique, answers, counterexamples, and implementation evidence on that term's page.</span></li><li><strong>Reabsorb</strong><span>Revise the definition and close, replace, or sharpen the questions it can now answer.</span></li><li><strong>Consolidate</strong><span>Mark the term consolidated when its ambiguity is sufficiently resolved and Hadi accepts the wording.</span></li></ol><p class="maturation-note">Comments are evidence, not automatic authority. The visible definition changes only through reviewed repository history.</p></section>
  <div class="container" id="terms">${cards}<p class="category-policy">${escapeHtml(lib.categoryPolicy)}</p></div>
  <section class="container agent-handoff"><div><span class="abstraction-eyebrow">For people and agents</span><h2>Use the vocabulary before choosing an implementation.</h2><p>Read only the terms relevant to the responsibility being built. Then translate their boundaries into the selected runtime, files, permissions, and verification mechanisms.</p></div><div><a class="btn btn-primary" href="/data/abstraction-library.json">Open machine-readable JSON</a><a class="btn btn-secondary" href="/agents.html">Return to Agents</a></div></section>
</main>
${footer()}
</body>
</html>
`;
}
function renderTerm(lib,term,index) {
  const bySlug=Object.fromEntries(lib.terms.map(t=>[t.slug,t]));
  const category=lib.categories.find(c=>c.id===term.category);
  const prev=lib.terms[(index-1+lib.terms.length)%lib.terms.length];
  const next=lib.terms[(index+1)%lib.terms.length];
  const related=term.related.map(slug=>bySlug[slug]).filter(Boolean);
  const schema = JSON.stringify({"@context":"https://schema.org","@type":"DefinedTerm",name:term.name,description:term.definition,inDefinedTermSet:"https://hadi-nayebi.github.io/agents/abstractions/"});
  return `<!DOCTYPE html>
<html lang="en">
${head(term.name,term.definition,`https://hadi-nayebi.github.io/agents/abstractions/terms/${term.slug}.html`)}
<body class="abstraction-term-page" data-term="${term.slug}" data-definition-state="${term.status}">
${nav()}
<main>
  <article>
    <header class="term-hero"><div class="container"><nav class="term-breadcrumb" aria-label="Breadcrumb"><a href="/agents.html">Agents</a><span>→</span><a href="/agents/abstractions/">Abstraction Library</a><span>→</span><span aria-current="page">${escapeHtml(term.name)}</span></nav><div class="term-state-row"><span class="badge">${escapeHtml(term.status)}</span><span>${escapeHtml(category.name)}</span><span>${escapeHtml(term.id)}</span></div><h1>${escapeHtml(term.name)}</h1><p class="term-definition">${escapeHtml(term.definition)}</p></div></header>
    <div class="container term-layout">
      <div class="term-main">
        <section><span class="abstraction-eyebrow">Current definition</span><h2>Role in the harness</h2><p>${escapeHtml(term.role)}</p></section>
        <section><h2>Boundary and invariants</h2>${term.boundary.map(p=>`<p>${escapeHtml(p)}</p>`).join("")}</section>
        <section><h2>Relationships</h2><p>${escapeHtml(term.relationships)}</p><div class="related-terms">${related.map(r=>`<a href="${r.slug}.html">${escapeHtml(r.name)}</a>`).join("")}</div></section>
        <section><h2>Questions for local adaptation</h2><ul>${term.adaptationQuestions.map(q=>`<li>${escapeHtml(q)}</li>`).join("")}</ul></section>
        <section><h2>Evidence and realization</h2><p>${escapeHtml(term.evidence)}</p></section>
        <section class="term-avoid"><h2>Avoid</h2><p>${escapeHtml(term.avoid)}</p></section>
        <section class="open-questions" id="open-questions"><span class="abstraction-eyebrow">Definition audit</span><h2>Open questions</h2><p>These are unresolved edges in the current definition. Answers, counterexamples, and better questions can be contributed in the discussion below.</p><ol>${term.openQuestions.map(q=>`<li id="${q.id.toLowerCase()}"><span>${escapeHtml(q.id)}</span><p>${escapeHtml(q.text)}</p></li>`).join("")}</ol></section>
        <section class="term-discussion" id="discussion"><span class="abstraction-eyebrow">Public discussion</span><h2>Help this definition mature</h2><p>Respond to an open question, identify an ambiguity, or share privacy-scrubbed evidence from a real harness. Accepted learning is reabsorbed into the definition through a reviewed change; discussion alone does not make a claim canonical.</p>${giscus()}</section>
      </div>
      <aside class="term-aside"><div class="term-audit-card"><span class="abstraction-eyebrow">Maturity</span><strong>${escapeHtml(term.status)}</strong><p>${escapeHtml(lib.definitionStates[term.status])}</p><dl><div><dt>Updated</dt><dd>${escapeHtml(lib.updated)}</dd></div><div><dt>Open questions</dt><dd>${term.openQuestions.length}</dd></div><div><dt>Category</dt><dd>${escapeHtml(category.name)}</dd></div></dl></div><a class="machine-source-link" href="/data/abstraction-library.json">Read structured source →</a></aside>
    </div>
    <nav class="container term-sequence" aria-label="Term navigation"><a href="${prev.slug}.html"><span>Previous term</span><strong>← ${escapeHtml(prev.name)}</strong></a><a href="/agents/abstractions/"><span>All terms</span><strong>Library index</strong></a><a href="${next.slug}.html"><span>Next term</span><strong>${escapeHtml(next.name)} →</strong></a></nav>
  </article>
</main>
<script type="application/ld+json">${schema}</script>
${footer()}
</body>
</html>
`;
}

const root=process.cwd();
const library=JSON.parse(fs.readFileSync(path.join(root,"data/abstraction-library.json"),"utf8"));
const outputs=new Map();
outputs.set("agents/abstractions/index.html",renderIndex(library));
library.terms.forEach((term,index)=>outputs.set(`agents/abstractions/terms/${term.slug}.html`,renderTerm(library,term,index)));
const checking=process.argv.includes("--check");
const stale=[];
for(const [relative,content] of outputs){
  const absolute=path.join(root,relative);
  if(checking){
    if(!fs.existsSync(absolute)||fs.readFileSync(absolute,"utf8")!==content) stale.push(relative);
  }else{
    fs.mkdirSync(path.dirname(absolute),{recursive:true});
    fs.writeFileSync(absolute,content);
  }
}
if(stale.length){
  console.error("Abstraction pages are stale:\n"+stale.map(x=>"  - "+x).join("\n"));
  process.exit(1);
}
console.log(checking?`Abstraction pages current: ${outputs.size} files checked.`:`Abstraction pages rendered: ${outputs.size} files written.`);
