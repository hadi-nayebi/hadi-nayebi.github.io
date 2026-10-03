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
const browser = await chromium.launch({ headless: true });
for (const width of [360, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 360 ? 800 : 900 } });
  for (const route of routes) {
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, request => request.abort());
    await page.goto(base + route, { waitUntil: 'load' });
    const findings = await page.evaluate(() => {
      const visible = e => { const r=e.getBoundingClientRect(),s=getComputedStyle(e); return r.width>1 && r.height>1 && s.display!=='none' && s.visibility!=='hidden'; };
      const label = e => e.tagName.toLowerCase() + (e.id ? '#'+e.id : '') + (typeof e.className==='string' && e.className ? '.'+e.className.trim().split(/\s+/).join('.') : '');
      const items=[];
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
    // Capture actual defects for diagnosis, not as an automatic universal spacing rule.
    if(findings.some(x=>x.type==='reading-gap') || route==='/start-here.html') {
      await page.screenshot({path:path.join(output,route.slice(1).replace(/\//g,'_')+`-${width}-full.png`),fullPage:true});
      await page.screenshot({path:path.join(output,route.slice(1).replace(/\//g,'_')+`-${width}-fold.png`)});
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2));
console.log(`Spacing inventory: ${routes.length} HTML routes at phone and desktop widths; audit saved.`);
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
