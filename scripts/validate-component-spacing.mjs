import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const output = path.resolve('artifacts/component-spacing');
fs.mkdirSync(output, { recursive: true });
function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ['node_modules', 'artifacts'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}
const routes = htmlFiles(root).map(file => '/' + path.relative(root, file).split(path.sep).join('/'));
const report = [];
const failures = [];
const changedRoutes = new Set(JSON.parse(fs.readFileSync('scripts/component-spacing-routes.json', 'utf8')));
const browser = await chromium.launch({ headless: true });
for (const width of [360, 412, 768, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 360 ? 800 : 900 } });
  for (const route of routes) {
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, request => request.abort());
    await page.goto(base + route, { waitUntil: 'load' });
    await page.evaluate(async () => { if(document.fonts) await document.fonts.ready; });
    if(route === '/start-here.html') await page.waitForTimeout(1250);
    const findings = await page.evaluate(() => {
      const visible = e => { const r=e.getBoundingClientRect(),s=getComputedStyle(e); return r.width>1 && r.height>1 && s.display!=='none' && s.visibility!=='hidden'; };
      const label = e => e.tagName.toLowerCase() + (e.id ? '#'+e.id : '') + (typeof e.className==='string' && e.className ? '.'+e.className.trim().split(/\s+/).join('.') : '');
      const items=[];
      for(const labelElement of document.querySelectorAll('.seed-boundary-layer > .diagram-label, .qseed-stack-layer > .diagram-label')) {
        const heading=labelElement.nextElementSibling;
        const gap=heading.getBoundingClientRect().top-labelElement.getBoundingClientRect().bottom;
        if(gap<8) items.push({type:'reading-gap',parent:label(labelElement.parentElement),a:'layer label',b:'layer heading',gap});
      }
      const heroNote=document.querySelector('.project-hero-copy > .project-actions + p');
      if(heroNote) {
        const gap=heroNote.getBoundingClientRect().top-heroNote.previousElementSibling.getBoundingClientRect().bottom;
        if(gap<16) items.push({type:'reading-gap',parent:'project-hero-copy',a:'actions',b:'usage note',gap});
      }
      const accessActions=document.querySelector('.access-expectations > .seed-hero-actions');
      if(accessActions?.previousElementSibling) {
        const gap=accessActions.getBoundingClientRect().top-accessActions.previousElementSibling.getBoundingClientRect().bottom;
        if(gap<16) items.push({type:'reading-gap',parent:'access-expectations',a:'request note',b:'actions',gap});
      }
      for(const section of document.querySelectorAll('.page-start-here main > .academy-section')) {
        const style=getComputedStyle(section);
        for(const edge of ['Top','Bottom']) {
          const gap=parseFloat(style['padding'+edge]);
          if(gap<24) items.push({type:'section-padding',parent:label(section),a:edge,b:'content',gap});
        }
      }
      for (const parent of document.querySelectorAll('main, main section, main article, main div, main a')) {
        const children=[...parent.children].filter(visible);
        for(let i=1;i<children.length;i++) {
          const a=children[i-1],b=children[i];
          if(!a.matches('h1,h2,h3,h4,p,ul,ol,pre,blockquote') || !b.matches('h1,h2,h3,h4,p,ul,ol,pre,blockquote')) continue;
          if(getComputedStyle(a).position==='absolute' || getComputedStyle(b).position==='absolute') continue;
          const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
          const gap=br.top-ar.bottom;
          if(Math.min(ar.right,br.right)>Math.max(ar.left,br.left) && gap<8 && gap>=-1) items.push({type:'reading-gap',parent:label(parent),a:label(a),b:label(b),gap:Number(gap.toFixed(2))});
        }
      }
      // Painted sibling panels need external breathing room, not just internal padding.
      const painted = e => { const s=getComputedStyle(e); return parseFloat(s.borderTopWidth)>0 && s.backgroundColor!=='rgba(0, 0, 0, 0)'; };
      for(const parent of document.querySelectorAll('main, main section, main div')) {
        const children=[...parent.children].filter(visible);
        for(let i=1;i<children.length;i++) {
          const a=children[i-1],b=children[i];
          if(!a.matches('section,article,div,a') || !b.matches('section,article,div,a') || !painted(a) || !painted(b)) continue;
          const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),gap=br.top-ar.bottom;
          if(Math.min(ar.right,br.right)>Math.max(ar.left,br.left)+1 && gap>=-1 && gap<8) items.push({type:'painted-boundary',parent:label(parent),a:label(a),b:label(b),gap:Number(gap.toFixed(2))});
        }
      }
      const panels=[...document.querySelectorAll('main > section.start-agent-entry')];
      for(const panel of panels) {
        const next=panel.nextElementSibling;
        if(next?.matches('.start-agent-entry')) {
          const gap=next.getBoundingClientRect().top-panel.getBoundingClientRect().bottom;
          items.push({type:'panel-gap',parent:'Start Here',a:label(panel),b:label(next),gap:Number(gap.toFixed(2))});
        }
      }
      return items;
    });
    report.push({route,width,findings});
    for(const finding of findings.filter(x=>x.type==='panel-gap' && x.gap<24)) failures.push(`${route} @ ${width}: ${finding.a} to ${finding.b} gap ${finding.gap}px; expected at least 24px`);
    for(const finding of findings.filter(x=>x.type==='reading-gap')) failures.push(`${route} @ ${width}: ${finding.parent}: ${finding.a} to ${finding.b} gap ${finding.gap}px; expected at least 8px`);
    for(const finding of findings.filter(x=>x.type==='section-padding')) failures.push(`${route} @ ${width}: ${finding.parent} ${finding.a} padding ${finding.gap}px; expected at least 24px`);
    // Capture actual defects for diagnosis, not as an automatic universal spacing rule.
    if(findings.some(x=>x.type!=='panel-gap') || changedRoutes.has(route)) {
      await page.screenshot({path:path.join(output,route.slice(1).replace(/\//g,'_')+`-${width}-full.png`),fullPage:true});
      await page.screenshot({path:path.join(output,route.slice(1).replace(/\//g,'_')+`-${width}-fold.png`)});
    }
    // Inspect each repaired reading component at readable scale, beside the full-page record.
    const repairSelectors=['.article-comments','.milestone-card','.about-content','.blog-category-heading',
      '.project-three-grid','.project-principles-grid','.seed-reference-map','.seed-boundary-diagram','.qseed-stack','.project-participate',
      '.family-inspiration-text','.series-hero','.series-entry','.observation-empty',
      '.access-hero','.access-expectations','.support-activity-panel','.services-offer','.services-free-paths','.update-why'];
    if(changedRoutes.has(route)) for(const selector of repairSelectors) {
      let index=0;
      for(const component of await page.locator(selector).all()) {
        if(!await component.isVisible()) continue;
        await component.screenshot({path:path.join(output,route.slice(1).replace(/\//g,'_')+`-${selector.slice(1)}-${index++}-${width}.png`)});
      }
    }
    if(route==='/start-here.html') {
      for(const section of await page.locator('main > section').all()) {
        const id=await section.getAttribute('id') || 'hero';
        await section.screenshot({path:path.join(output,`start-section-${id}-${width}.png`)});
      }
      for(const tab of await page.locator('.start-role-tab').all()) {
        const role=await tab.getAttribute('data-role');
        await tab.click();
        if(await tab.getAttribute('aria-selected')!=='true') failures.push(`Start Here @ ${width}: ${role} tab did not activate`);
        const roleProblems=await page.locator('#start-role-panel').evaluate(panel=>{
          const problems=[];
          for(const card of panel.querySelectorAll('.start-role-card')) {
            const style=getComputedStyle(card);
            if(parseFloat(style.paddingTop)<16 || parseFloat(style.paddingBottom)<16) problems.push('role card padding under 16px');
            const heading=card.querySelector('h3'),body=heading?.nextElementSibling;
            if(heading && body && body.getBoundingClientRect().top-heading.getBoundingClientRect().bottom<8) problems.push('role heading/body gap under 8px');
          }
          if(document.documentElement.scrollWidth>innerWidth+1) problems.push('horizontal overflow');
          return problems;
        });
        failures.push(...roleProblems.map(p=>`Start Here @ ${width}, ${role}: ${p}`));
        await page.locator('#profession').screenshot({path:path.join(output,`start-role-${role}-${width}.png`)});
      }
      for(const id of ['continue-with-agent','human-guidance','community-return']) {
        await page.goto(base+route+'#'+id,{waitUntil:'load'});
        await page.waitForTimeout(1300);
        const position=await page.locator('#'+id).evaluate(e=>({top:e.getBoundingClientRect().top,header:document.querySelector('#site-header').getBoundingClientRect().bottom}));
        if(position.top<position.header+8) failures.push(`Start Here @ ${width}: #${id} hidden under navigation`);
        await page.screenshot({path:path.join(output,`start-anchor-${id}-${width}.png`)});
      }
      const toggle=page.locator('.nav-toggle');
      if(await toggle.isVisible()) {
        await toggle.click();
        if(await toggle.getAttribute('aria-expanded')!=='true') failures.push(`Start Here @ ${width}: navigation did not expand`);
        await page.screenshot({path:path.join(output,`start-nav-expanded-${width}.png`)});
        await toggle.click();
      }
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2));
console.log(`Spacing inventory: ${routes.length} HTML routes at 360, 412, 768, 1440; ${failures.length} failed reading/panel gaps. Painted-boundary candidates remain diagnostic for visual review; audit saved.`);
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
