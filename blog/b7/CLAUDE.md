# CLAUDE.md — Blog 7 Mini-Series (The Plugin Kit)
**Version:** v0.1.0
**Series:** B7 — Pt 3 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture

Per-series working memory for the B7 essays (`07_1..07_9`). Populated as work happens.

Ref-tag review job 1781190945888385572 (cycle 1) fixed the `07_6` image-prompt agent-pool counts
here (synced to live totals on both `.md` and `.html`); condensed — durable record in
`.claude/knowledge/ref-tag-review/`.

---Ob---

---Pl---

## PLAN scope-declaration — ref-tag line-number sweep (job 1782320396187605322, cycle 1)

**This dir (`blog/b7/`) is activated for EXECUTE.** Strip every line number from every ref-tag (middle
pointer AND any 3rd-field echo); replace with the STABLE anchor: filename + the cited file's own
heading/section/function NAME + keywords. Edit BOTH `.md` (`*[ref:…]*`) AND `.html` (`title="…"`) —
mirror invariant, targeted hand-edit, never blind regen.

- **Per-file targets (grep -c map; EXACT tag count re-greped at fix-time): b7 = 12** —
  `07_9`:3 · `07_5`:3 · `07_7`:3 · `07_2`:2 · `07_1`:1. (#1 finding, 07_2 L33
  `new-plugin-template-claude-md-first` `:1-3`, is ONE of these 12.)
- One `execute-file-editor` dispatch per essay file (both `.md` + `.html` in the same dispatch).
- **Re-registered this PLAN pass (post-clear resume):** the altered list reset to the job dir at the
  `/clear` boundary, so this dir is re-touched HERE to re-declare `blog/b7/` editable for EXECUTE;
  the per-file map stands and EXECUTE re-greps each `07_*.md` at fix-time (census MAP, not ground
  truth — the census added `07_4`:1).

---Ex---

---Ve---
