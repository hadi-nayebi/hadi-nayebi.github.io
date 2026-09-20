import fs from "node:fs";
import {spawnSync} from "node:child_process";
const library=JSON.parse(fs.readFileSync("data/abstraction-library.json","utf8"));
const errors=[];
const unique=(values,label)=>{const seen=new Set();for(const value of values){if(seen.has(value))errors.push(`duplicate ${label}: ${value}`);seen.add(value);}};
unique(library.categories.map(x=>x.id),"category");
unique(library.terms.map(x=>x.id),"term id");
unique(library.terms.map(x=>x.slug),"term slug");
unique(library.terms.map(x=>x.name),"term name");
const categories=new Set(library.categories.map(x=>x.id));
const slugs=new Set(library.terms.map(x=>x.slug));
for(const term of library.terms){
  if(!categories.has(term.category))errors.push(`${term.slug}: unknown category`);
  if(!["draft","consolidated"].includes(term.status))errors.push(`${term.slug}: invalid status`);
  if(term.status==="draft"&&!term.openQuestions.length)errors.push(`${term.slug}: draft requires open questions`);
  if(term.status==="consolidated"&&term.openQuestions.length)errors.push(`${term.slug}: consolidated term cannot retain open questions`);
  const words=[term.definition,term.role,...term.boundary,term.relationships,term.evidence,term.avoid].join(" ").trim().split(/\s+/).filter(Boolean).length;
  if(words>500)errors.push(`${term.slug}: definition body is ${words} words (limit 500)`);
  for(const related of term.related)if(!slugs.has(related))errors.push(`${term.slug}: unknown related term ${related}`);
}
if(errors.length){console.error("Abstraction-library validation FAILED:\n"+errors.map(x=>"  - "+x).join("\n"));process.exit(1);}
const rendered=spawnSync(process.execPath,["scripts/render-abstraction-library.mjs","--check"],{stdio:"inherit"});
if(rendered.status!==0)process.exit(rendered.status||1);
console.log(`Abstraction-library validation passed: ${library.terms.length} terms across ${library.categories.length} open categories.`);
