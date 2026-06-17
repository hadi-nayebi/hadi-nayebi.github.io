---
title: "What Lives in the Brain After Three Months"
date: "May 2026"
slug: "brain-after-three-months"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Knowledge]
status: draft
version: v0.1.1
audience: "Power Users & Architects"
og_image: "blog/b8/images/maturation-arc-b8-banner.png"
---

# What Lives in the Brain After Three Months

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

---

[Essay 8.2](08_2-job-maturation-stages.html) closed the job-maturation arc — Stage 1 deep single-cycle through Stage 4 plugin form, plus standalone and dependent job patterns. The arc describes *how* a job grows. This sub-essay opens the *outcome*: a precise inventory of what the prototype's brain holds today, after three months of cycles running through that arc.

The prototype today is a useful ground-truth case. A precise inventory of what its brain holds reveals the shape every mature seed converges toward.

---

A research lab running experiment-protocol jobs through the same maturation arc will see its knowledge layer fill with topic-named directories like `knowledge/protocols/` (IRB-approved procedures), `knowledge/equipment/` (instrument calibration rules), and `knowledge/datasets/` (sample-handling conventions). Its memory layer will hold rules the operator gives once and expects honored across every session — *always quote source DOIs*, *never auto-publish without PI review*. The *shape* — small brain, large knowledge layer, narrow memory — transfers. The *substance* differs per operator's domain. The numbers below are the prototype's; the proportions hold across any seed running this architecture long enough. *[ref: topic-named-directory-shape-transfers | .claude/knowledge/ + .claude/knowledge/CLAUDE.md | The prototype's `.claude/knowledge/` directory carries the same topic-named-directory pattern: one silo per plugin that has earned dedicated knowledge (e.g., `phase_observe/`, `plugin_integrity/`) plus cross-cutting silos (`identity/`, `migration/`, `opevc/`). The structural template — one directory per stable topic — is what transfers across operator domains; the topic names themselves come from each operator's work. The knowledge/CLAUDE.md "Subdirectories" roster table documents this current prototype layout.]*

---

**The active knowledge layer is the largest persistent store** (currently roughly 258k words across active topic silos — count grows as the seed adds plugins or cross-cutting topics; plus an archive of similar size that the seed treats as historical reference rather than live recall). This is by far the largest component of the seed's persistent memory. The directories are organized by topic, not by chronology — each topic accumulates findings over many cycles and stays legible because the topic name doesn't change as the seed learns. The mature topic silos carry version numbers, use a strict three-layer audience model (newcomer / practitioner / maintainer), and end every topic file with concrete *Decay & Refresh* triggers expressed as executable shell commands. *[ref: knowledge-layer-active-and-archived-silos | .claude/knowledge/ + .claude/knowledge/CLAUDE.md | Live `find` commands are authoritative (silo counts grow between cycles; `knowledge/CLAUDE.md`'s own roster table lags slightly). At 2026-05-18: `find .claude/knowledge -name "*.md" -not -path "*/.archived/*" \| xargs wc -w` returns 258,238 words across 228 active files; `find .claude/knowledge -maxdepth 1 -type d` returns 19 active topic silos (11 plugin-named — one per plugin that has earned its own silo — plus 8 cross-cutting: opevc, identity, migration, plans, self-reviews, session, git-hygiene, upstream-reporting). Archive footprint via `find .claude/knowledge -path "*/.archived/*" -name "*.md"` returns 225,051 words across 245 files. The CLAUDE.md table at L25-32 documents the same structural layout but its word/file totals may trail the live counts.]*

**The session archive is the cycle's full-footer snapshot.** Each cycle, `phase_condense` captures the entire footer — a complete raw record of the cycle's working memory — into a per-cycle session file before it deflates. That makes the archive *large by design*: a big session archive is a full snapshot, not a routing failure. What stays disciplined is where durable findings land — up in the body and the topic-organized knowledge silos, the discoverable layers — with the archive as the raw backup behind them, the least discoverable layer, reached only by a trace-link. *[ref: session-archive-full-snapshot | .claude/context/opevc-condense.md "Session archive (step 7)" | The ARCHIVE phase captures the full footer as a per-cycle snapshot via the session-log command, executed mid-sequence (after marker-consumption, before deflation). NOT where durable knowledge is found — that goes UP to body + knowledge/; the archive is the raw backup behind them, the LEAST discoverable layer (per-job, not topic-indexed), reached by breadcrumb. "Short = healthy" no longer applies — full-footer snapshot, large by design. Canonical home: the run-aware job dir `run-<r>/session-log-<c>.md`.]*

**The memory layer typically stays narrow** (a small handful of entries in this operator's current state, in the home directory where they cross project boundaries — count varies per operator; the prototype's live snapshot lives in the ref-tag below). In this prototype, most are feedback rules — operator-given operating directives the brain carries across sessions; the rest are project memories, session handoffs, operational templates, and the index. Your seed's memory layer will hold whatever guidance most often crosses your project boundaries — composition varies; narrowness does not. The memory layer is not organized by plugin; it is organized by the *kind* of guidance it captures. The brain keeps memory narrow because feedback rules are *meta-instructions*, not data; if there were a hundred of them, the operator would lose track. *[ref: memory-fifty-entries-feedback-heavy | ~/.claude/projects/<encoded>/memory/ | Live `ls` is authoritative — the entry count drifts as the operator adds rules; the structural breakdown below is the stable shape. At 2026-05-18: 55 entries — feedback_*.md files (operator-given operating rules) form the largest single category; project_*.md files capture project context; session_*.md files carry cross-session handoffs; 1 MEMORY.md index; 1 jobs.md tracker; operational templates (compact_instruction.md / goal_instruction.md); plus jobs/ (active per-job working memory) and archive/ (closed-job memory) subdirectories. The narrow-by-design contrasts with the 258k-word knowledge layer.]*

**Each plugin's `docs/evolution.md` is capped at the prototype's current limit** (2000 words in the prototype — configurable via `plugin_integrity`'s `config.conf`; tune for your seed's appetite). Older sections migrate into sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) as the narrative grows. The cap is the only hard-enforced size limit in the prototype — every other limit is soft, enforced by CONDENSE discipline rather than a code gate. *[ref: evolution-md-only-hard-cap | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh | The cap sets MAX_EVOLUTION_WORDS default 2000. Scope restriction to ONE file: "Only police evolution.md — other docs/*.md files are uncapped per user directive" with the corresponding exit guard. BLOCK message names the overflow targets: "consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md)." This is the only file with a PreToolUse word-count gate in the entire plugin tree; every other documented cap (root brain / subdir CLAUDE.md / plans / memory / skills) is enforced by CONDENSE discipline, not code.]*

The shape is consistent: a small brain, a large knowledge layer, a narrow memory. The compression is structural — caps plus the CONDENSE waterfall plus soft thresholds — and the result is a seed whose persistent memory grows where it should grow (knowledge) and stays narrow where narrowness matters (memory, root brain). [Essay 1](../b1/01-llms-are-not-the-agents.html) said the filesystem is the agent. The numbers say what *filesystem* means in practice after a few months of accumulation: a knowledge directory thick with operational understanding, a brain just big enough to read in one sitting, and a memory file that captures the operator's hard-won rules in one short list. Together with the essay series you are reading, that `.claude/knowledge/` directory is what the seed treats as its canonical context source — the essays for the *why*, the knowledge directory for the *how*. The limit on every number above is honest: caps and discipline are friction, not impossibility — a careless operator could bloat any layer; the architecture's design choice is to make the bloat visibly costly rather than to prevent it. *[ref: caps-plus-condense-discipline-not-code | CLAUDE.md "Size Limits" section + "Brain Maturation Model" section | Root CLAUDE.md's "Size Limits" section enumerates every documented cap: Root CLAUDE.md 3,500w, Subdir CLAUDE.md 800w, Plans 2,000w, MEMORY.md 400w, Skills 500w. The "Brain Maturation Model" section frames size limits as the forcing function for migration — when the brain hits its word limit, the oldest proven patterns are the best candidates for hook extraction. Only `docs/evolution.md` is code-gated (see Ref 4); every other cap is enforced by CONDENSE discipline, not by a hook.]*

The image below maps the same architecture along a different axis — by *durability*. The transient layers sit at top (the chat session that dies at compaction, the working CLAUDE.md files that deflate each cycle, the plan files that persist across a job's cycles). The durable layers sit at bottom (the knowledge silos that grow monotonically, the memory directory that crosses every project). The one hard cap (evolution.md at 2000 words) sits in the middle, the only band the architecture polices with a code gate rather than discipline. *[ref: durability-stack-three-bands | CLAUDE.md "Size Limits" section + .claude/plugins/plugin_integrity/hooks/evolution-cap.sh | Top band (transient): root + subdir CLAUDE.md cap 3,500w/800w, plans 2,000w — all deflate each CONDENSE cycle per the working-memory contract. Middle band (one hard cap): `docs/evolution.md` enforced at MAX_EVOLUTION_WORDS default 2000 via the PreToolUse evolution-cap.sh hook — the only PreToolUse word-count gate in the entire plugin tree. Bottom band (durable): knowledge silos grow monotonically (no cap in the Size Limits table — only soft CONDENSE pressure); memory directory at MEMORY.md 400w soft cap with operator-feedback dominant content. The three bands match the image's top-to-bottom durability axis.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/brain-layers-b8-3.png
  Concept: Chalk-on-blackboard layered stack — transient layers on top, durable layers on the bottom, the seed's working memory pyramid inverted.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk bands
  stacked vertically; pastel chalk fills (dim cyan = most transient, magenta = most durable, with a graded scale between);
  white chalk for ALL band labels, lifespan notes, and arrows; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other layer names, directory names, or lifespan descriptors.
  Layout: Six horizontal chalk bands stacked vertically across the board, top to bottom. The topmost band is the narrowest and dimmest; bands get wider and brighter as they go down. Each band is split into a left half (the layer's name IN WHITE CHALK) and a right half (its lifespan IN WHITE CHALK).
    Band 1 (top, dim cyan, narrowest):
      Left:  "chat session"
      Right: "dies at compaction"
    Band 2 (dim green):
      Left:  "working CLAUDE.md"
      Right: "deflates each cycle"
    Band 3 (orange):
      Left:  "plan files"
      Right: "persists across cycles"
    Band 4 (pink):
      Left:  "plugin evolution.md"
      Right: "capped 2000w, narrated"
    Band 5 (magenta):
      Left:  ".claude/knowledge/"
      Right: "topic silos, grows monotonically"
    Band 6 (bottom, magenta darker, widest):
      Left:  "memory/"
      Right: "cross-project, your home dir"
  On the left edge of the stack, draw a single vertical white-chalk arrow running BOTTOM-UP along the entire stack, with one short caption riding the arrow IN WHITE CHALK exactly: "durability".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "chat session", "dies at compaction", "working CLAUDE.md", "deflates each cycle", "plan files", "persists across cycles", "plugin evolution.md", "capped 2000w, narrated", ".claude/knowledge/", "topic silos, grows monotonically", "memory/", "cross-project, your home dir", "durability", plus the caption below. No other words, file names, folders, or lifespan descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.3. Transient layers above. Durable substrate below. The seed's long-term store is the bottom of the stack."
-->

---

A small brain, a large knowledge layer, a narrow memory — these are the *outcomes* of three months of cycles. The mechanism that produces those outcomes is the soft-to-hard control migration, where behavioral patterns travel from coaching voice to hardened code. That migration is the next sub-essay.

---

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

*Previous: [Essay 8.2 — The Stages of Job Maturation](08_2-job-maturation-stages.html) — Stage 1 deep cycle through Stage 4 plugin form, plus standalone and dependent jobs.*
*Next: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
