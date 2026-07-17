# CLAUDE.md — Blog 7 Mini-Series (The Plugin Kit)
**Version:** v0.1.0
**Series:** B7 — Pt 3 of the Part-2 (How) arc of the Hadosh Academy series on agent architecture

Per-series working memory for the B7 essays (`07_1..07_9`). Populated as work happens.

Ref-tag review job 1781190945888385572 (cycle 1) fixed the `07_6` image-prompt agent-pool counts
here (synced to live totals on both `.md` and `.html`); condensed — durable record in
`.claude/knowledge/ref-tag-review/`.

---Ob---

**Ref-tag sync job `1784255953475439806` (Stage-1) — B7 in EXECUTE scope.** Corpus hub: `../CLAUDE.md` `---Ob---`.

B7 = *The Plugin Kit* (07_1..07_9): teaches the 11 plugins. Its ref-tags cite plugin names, hooks, ceremony mechanics, and **test counts + plugin version numbers** — the highest stale-risk class here, because those numbers drift every time a plugin evolves (per `.claude/plugins/CLAUDE.md`: "this memory file goes stale fast on these numbers"). Prior run fixed the `07_6` image-prompt agent-pool counts. Durable record was cited at `.claude/knowledge/ref-tag-review/` but that pointer is BROKEN at root — recaller is locating the real path.

Scan lens = 9-pt `blog-ref-tag-auditor` frame; R2 (file exists) / R3 (content-match) / R4 (no line numbers) / R9 (stale count/version) are the binary drift signals. b7 slugs pending from recaller; series findings recorded here as the scan lands.

---Pl---

**Ref-tag sync job `1784255953475439806` (Stage-1, plan_file=false) — B7 in EXECUTE scope; re-activated 2026-07-17.** Full plan: `../CLAUDE.md` `---Pl---` footer. EXECUTE edits here (edit `.md` → regen `.html`, mirror invariant; ground-truth MAIN-SESSION):
- **B-LINE (07_1 / 07_4 / 07_5 / 07_7 / 07_9):** live-census confirm-empty — grep each ref-tag middle-field for `:NNN`; strip any survivor → stable section-name anchor (NEVER re-point); >5 in one essay → PAUSE + show user. Expected EMPTY (user spot-check + 06_9 both clean).
- **B-STUB (07_3 / 07_5 / 07_6):** reconcile plugin-count base to context ("11 active + 2 unimplemented", `plugins-entities.md` `[consolidated]`); banned `grep -i '13 plugins|thirteen plugins'` = 0; add uniform "(2 unimplemented)" caveat BOTH surfaces.
- **B-B7V:** locate the b7 essay(s) citing voice counts; verify count == live voice.xml SUM (hooks/ + scripts/); fix both surfaces if drifted, else record verified.

---Ex---

**EXECUTE cycle 1 (2026-07-17) — start notes.**
- **Recon-subagent path-blindness (KEY):** `execute-file-editor` has NO Glob/Bash, so it cannot LIST a dir to discover essay slugs — both the b7 (B-STUB/B-B7V) and b8 recon dispatches GUESSED short paths (`07_3.md`, `08_1.md`) that don't exist and returned "file not found". FIX: discover exact essay filenames MAIN-SESSION (`git -C hadi-nayebi.github.io ls-files blog/bN`), hand subagents EXACT paths. Re-dispatch pending.
- **Census → VERIFY, not EXECUTE:** execute-guard blocks bash `grep` ("run scripts in verify phase"). So the B-LINE / banned-13-plugins / b8 deterministic censuses run as the VERIFY acceptance greps (G1). EXECUTE applies the KNOWN edits (B-STUB caveat, `.gitignore`, any confirmed b8/B-B7V fix).
- **Essay `.md` are TRACKED** (not gitignored) — only `*.transcript.md` + `blog/09-*`/`draft-*` ignored → the Grep tool works on essay `.md`.
- **E4 `.gitignore`:** `*.anchor-heals` NOT present in `hadi-nayebi.github.io/.gitignore` — add it (recurrence fix, user already removed the orphan).

**EXECUTE recon results (2026-07-17) — B-STUB refined + b8 clean (both recons ran with EXACT paths).**
- **b8 fast-census (E5): CLEAN — no edits.** Censused all 8 essays (08_1/08_2/08_4-08_9) = 65 ref-tags, ZERO drift flags, circuit-breaker NOT tripped. 08_3 re-confirm: B-PRIN session-archive tag points to `.claude/context/opevc-condense.md "Session archive (step 7)"` (already-correct, NOT principles.md); B-CNT dated snapshot ("258,238 words / 228 files / 21 silos @ 2026-05-18") PRESERVED per user. → VERIFY greps b8 for line-#/13-plugins = 0 (D2 ground-truth of the subagent claim).
- **B-STUB refined — 07_3 is a FALSE POSITIVE, dropped.** 07_3's "ten plugins shipping BOTH voice surfaces (+question_discipline hooks-only)" counts the 11 ACTIVE plugins' voice.xml surfaces — does NOT lump job_archiver/job_blocker, no banned literal. No caveat needed. (Premortem base-first guard caught this.)
- **B-STUB real targets = 07_5 + 07_6** (both surfaces, via regen):
  - 07_5: ref-tag "find … evolution.md … returns 14 hits — one per plugin (13 incl job_archiver, job_blocker) PLUS the template" — lumps the 2 unimplemented, no caveat.
  - 07_6: ref-tag "find … agents -type d returns 11 dirs (… job_archiver + job_blocker)" — lumps the 2 unimplemented, no caveat.
  - Neither uses the banned prose literal "13 plugins"; counts are file-accurate but blur active-vs-unimplemented. Awaiting exact ref-tag+body text (recon follow-up) to place the "(2 unimplemented)" caveat on the right surface(s).
- **B-B7V:** only 07_3 cites voice counts — plugin_integrity/hooks/voice.xml = 57 elements (4 coaching+29 block+19 info+2 entry+3 error), scripts/voice.xml = 14. → VERIFY greps live voice.xml element counts (BOTH surfaces); fix only if drifted.
- **B-LINE:** deferred to VERIFY grep (expected zero, per user spot-check + 06_9). No EXECUTE edit unless a survivor surfaces.

**EXECUTE done — edits applied (D2 git-diff clean, only the 3 caveat lines changed):** 07_5 sites 1+2 + 07_6 site 1 caveats in `.md`; `.gitignore` += `*.anchor-heals`. 07_3 dropped (false positive). `.html` regen is VERIFY work (execute-guard forbids scripts).

**VERIFY handoff (all MAIN-SESSION; VERIFY allows scripts/bash):**
- **Regen** (approved cmd; stamp `20260704` = current, avoids version churn; run from root CWD):
  `python3 hadi-nayebi.github.io/.claude/tools/generate_blog_html.py blog/b7/07_5-docs-and-historian.md blog/b7/07_5-docs-and-historian.html --version 20260704` (same for 07_6-agents-and-80-20-budget).
- **G1 grep-zero:** b6/b7/b8 `.md`+`.html` line-# middle-fields (`\.(sh|md|py|yaml|yml|json|xml|conf|txt):[0-9]`, `:NN-NN`, `#LNNN`) = 0; `grep -i '13 plugins|thirteen plugins'` = 0. NOTE: "13 total historian-*" / "13th" are FINE — only "13 plugins" is banned.
- **G2 mirror+idempotence:** per edited essay `.md` ref-tag count == `.html` ref-marker count; regen TWICE → 2nd diff empty; `.html` diff = only the 3 caveat titles.
- **G3 ground-truth counts (D2):** `find .claude/plugins -name evolution.md -path '*/docs/*' | wc -l` == 14; `find .claude/plugins -name agents -type d | wc -l` == 11; `find .claude/plugins -path '*/agents/historian-*.md' | wc -l` == 13; confirm job_archiver+job_blocker present in each roster. B-B7V: element counts in plugin_integrity/hooks/voice.xml (claim 57) + scripts/voice.xml (claim 14) vs 07_3 — fix 07_3 only if drifted.
- **G4 scope:** exactly ONE `[PENDING-JOB]{substrate…}`; `.gitignore` has `*.anchor-heals`; backlog-status.md tracker updated (CONDENSE C3).
- **b8 D2:** grep b8 `.md` for line-# / "13 plugins" = 0 (confirm the subagent zero-flag claim).

[KNOWLEDGE]{ref-tag-job-phase-constraint-map — in a website ref-tag-sync job the OPEVC guards force a fixed division of labour: OBSERVE/PLAN = read-only, no bash; EXECUTE = edit `.md` source + non-script files (`.gitignore`) ONLY — bash `grep`, scripts, AND the `generate_blog_html.py` `.html`-regen are ALL blocked here ("run scripts in verify phase"); so the deterministic census greps + the regen + the count ground-truth ALL belong to VERIFY (bash/scripts allowed there). Corollary: `execute-*` recon subagents have NO Glob/Bash, so they cannot discover essay slugs — the dispatcher MUST `git ls-files` main-session first and hand each subagent EXACT full paths (a bare slug/number makes it guess a wrong filename and return file-not-found). Captured 2026-07-17, cycle 1.}

**EXECUTE re-entry (session 3, 2026-07-17) — MIS-ROUTE correction, no edits remain.** VERIFY (this session) confirmed the SOLE open gap is the 07_5/07_6 `.html` regen (G2 mirror: caveats live in `.md`, absent from `.html`). I routed backward verify→execute to do it — a MIS-ROUTE: the approved `generate_blog_html.py` regen is a VERIFY action (execute-guard re-blocked it live this visit: "run scripts in verify phase"), and the `.md` caveats + `.gitignore` already landed in commit 9e5e6cb last session. So EXECUTE has ZERO new edits. Returning to VERIFY to run the approved regen + idempotence check + commit the `.html` there. All other gates already PASS (B-LINE=0, banned-13=0, B-B7V 57/14 exact, b8 clean incl B-PRIN, substrate=1).

[KNOWLEDGE]{mirror-gap-fix-is-in-verify-not-a-backward-to-execute — when VERIFY finds a `.md`/`.html` mirror desync in a ref-tag job, the FIX (rerun the approved `generate_blog_html.py`) is a VERIFY-phase action because the COMMAND-APPROVE'd regen script runs in verify (execute-guard blocks ALL scripts, approved or not). Do NOT route backward-to-execute to "regen" — regen + commit the `.html` from within VERIFY via the approved command + verify-commit. Backward-to-execute is only for `.md`-source or non-script edits. Cost of the 2026-07-17 mis-route: one wasted verify→execute→verify round-trip.}

---Ve---
