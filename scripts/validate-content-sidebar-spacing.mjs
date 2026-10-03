import fs from 'node:fs';
import { chromium } from 'playwright';
const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';
const output = 'artifacts/content-sidebar';
fs.mkdirSync(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const results=[];
const failures=[];
async function inspect(page) {
  return page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.blog-sidebar-newest .article-card')];
    const gaps=cards.slice(1).map((card,i)=>card.getBoundingClientRect().top-cards[i].getBoundingClientRect().bottom);
    return {count:cards.length,gaps,overflow:document.documentElement.scrollWidth>innerWidth+1,
      display:getComputedStyle(document.querySelector('.blog-sidebar-newest')).display};
  });
}
for(const width of [360,412,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
  await page.goto(base+'/content.html',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready});
  const result=await inspect(page);
  if(result.count!==5 || result.gaps.some(gap=>gap<15.5) || result.overflow) failures.push({width,...result});
  results.push({width,...result});
  await page.screenshot({path:output+'/content-'+width+'-fold.png'});
  await page.screenshot({path:output+'/content-'+width+'-full.png',fullPage:true});
  await page.locator('.blog-index-sidebar').screenshot({path:output+'/sidebar-'+width+'.png'});
  await page.close();
}
// Prove the regression detects the original zero-gap layout when only the repair stylesheet is absent.
const baseline=await browser.newPage({viewport:{width:1440,height:900}});
await baseline.route('**/css/content.css*',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
await baseline.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/,route=>route.abort());
await baseline.goto(base+'/content.html',{waitUntil:'networkidle'});
const oldLayout=await inspect(baseline);
if(oldLayout.count!==5 || !oldLayout.gaps.some(gap=>gap<1)) failures.push({baseline:'missing repair did not reproduce touching cards',...oldLayout});
await baseline.screenshot({path:output+'/baseline-zero-gap.png'});
await browser.close();
fs.writeFileSync(output+'/results.json',JSON.stringify({results,baseline:oldLayout,failures},null,2));
console.log(JSON.stringify({results,baseline:oldLayout,failures}));
if(failures.length) process.exit(1);
