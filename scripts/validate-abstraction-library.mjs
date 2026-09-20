import fs from "node:fs";
import {spawnSync} from "node:child_process";

const library = JSON.parse(fs.readFileSync("data/abstraction-library.json", "utf8"));
const errors = [];
const allowedTopLevel = new Set(["schemaVersion", "title", "purpose", "updated", "definitionStates", "terms"]);
const allowedTermFields = new Set(["name", "slug", "status", "definition", "openQuestions"]);

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

for (const field of Object.keys(library)) {
  if (!allowedTopLevel.has(field)) errors.push(`unexpected library field: ${field}`);
}
if (library.schemaVersion !== 2) errors.push("schemaVersion must be 2");
if (!library.purpose?.trim()) errors.push("library purpose is required");
if (Object.keys(library.definitionStates || {}).sort().join(",") !== "consolidated,draft") {
  errors.push("definition states must be exactly draft and consolidated");
}

unique(library.terms.map(term => term.slug), "term slug");
unique(library.terms.map(term => term.name), "term name");

for (const term of library.terms) {
  for (const field of Object.keys(term)) {
    if (!allowedTermFields.has(field)) errors.push(`${term.slug}: unexpected field ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(term.slug)) errors.push(`${term.slug}: invalid slug`);
  if (!["draft", "consolidated"].includes(term.status)) errors.push(`${term.slug}: invalid status`);
  if (!term.definition?.trim()) errors.push(`${term.slug}: definition is required`);
  const words = term.definition.trim().split(/\s+/).filter(Boolean).length;
  if (words > 500) errors.push(`${term.slug}: definition is ${words} words (limit 500)`);
  if (!Array.isArray(term.openQuestions)) errors.push(`${term.slug}: openQuestions must be an array`);
  if (term.status === "draft" && !term.openQuestions?.length) errors.push(`${term.slug}: draft requires open questions`);
  if (term.status === "consolidated" && term.openQuestions?.length) errors.push(`${term.slug}: consolidated term cannot retain open questions`);
  for (const question of term.openQuestions || []) {
    if (typeof question !== "string" || !question.trim()) errors.push(`${term.slug}: every open question must be text`);
  }
}

if (errors.length) {
  console.error("Abstraction-library validation FAILED:\n" + errors.map(error => "  - " + error).join("\n"));
  process.exit(1);
}

const rendered = spawnSync(process.execPath, ["scripts/render-abstraction-library.mjs", "--check"], {stdio: "inherit"});
if (rendered.status !== 0) process.exit(rendered.status || 1);
console.log(`Abstraction-library validation passed: ${library.terms.length} terms, two definition states, one canonical context block per term.`);
