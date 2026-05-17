---
title: "What Lives in the Brain After Three Months"
date: "May 2026"
slug: "brain-after-three-months"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Knowledge]
status: draft
version: v0.1.0
audience: "Power Users & Architects"
og_image: "assets/images/blog/b4/agent-anatomy-b4-1.png"
---

# What Lives in the Brain After Three Months

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

---

[Essay 8.2](08_2-job-maturation-stages.html) closed the job-maturation arc — Stage 1 deep single-cycle through Stage 4 plugin form, plus sibling and dependent job patterns. The arc describes *how* a job grows. This sub-essay opens the *outcome*: a precise inventory of what the prototype's brain holds today, after three months of cycles running through that arc.

The prototype today is a useful ground-truth case. A precise inventory of what its brain holds reveals the shape every mature seed converges toward.

---

A research lab running experiment-protocol jobs through the same maturation arc will see its knowledge layer fill with protocol-specific topic dirs and its memory layer fill with lab-specific operating rules. The *shape* — small brain, large knowledge layer, narrow memory — transfers. The *substance* differs per operator's domain. The numbers below are the prototype's; the proportions hold across any seed running this architecture long enough.

---

**The active knowledge layer is the largest persistent store** (currently roughly 250k words across ~18 topic silos in the prototype, configurable as the seed adds new plugins or cross-cutting topics; plus an archive at ~170k words that the seed treats as historical reference rather than live recall). This is by far the largest component of the seed's persistent memory. The directories are organized by topic, not by chronology — each topic accumulates findings over many cycles and stays legible because the topic name doesn't change as the seed learns. The mature topic silos carry version numbers, use a strict three-layer audience model (newcomer / practitioner / maintainer), and end every topic file with concrete *Decay & Refresh* triggers expressed as executable shell commands. *[ref: knowledge-layer-250k-eighteen-silos | .claude/knowledge/ + .claude/knowledge/CLAUDE.md | `find .claude/knowledge -name "*.md" -not -path "*/.archived/*" -print0 \| xargs -0 wc -w` returns 250,308 total words across 220 active files. `find .claude/knowledge -maxdepth 1 -type d` returns 18 active topic silos: one per plugin (currently 11 in the prototype) + 7 cross-cutting topics (opevc, migration, plans, self-reviews, session, git-hygiene, upstream-reporting). `.archived/` adds 168k words / 182 files — historical reference, not part of active recall. Captured 2026-05-13.]*

**The largest single subdirectory in the prototype's knowledge layer is the session archive, at roughly 65k words in this prototype.** This is, in `phase_condense`'s design, the *fallback tier* — the destination of last resort for content that did not route to any earlier waterfall step. A session archive growing this large is an honest signal that earlier routing under-fired; mature seeds will compress this number as their condense subagents learn to route more aggressively into topic-organized files instead. *[ref: session-archive-fallback-tier-size | .claude/knowledge/session/ + .claude/plugins/phase_condense/docs/principles.md "session as last resort" principle | `find .claude/knowledge/session -name "*.md" \| xargs wc -w` returns 65,252 total — the single largest subdirectory of the knowledge layer. The phase_condense design principle places `session/` at step 7 (last-resort fallback), NOT as a peer of topic dirs. Size signals under-firing of earlier steps (step 1 absorb-footer, step 2 cross-file migration, step 6 knowledge routing).]*

**The memory layer typically stays narrow** (around twenty entries in this operator's current state, in the home directory — Claude Code's native user-level surface that the operator carries between projects). Most are feedback rules — operator-given operating directives the brain should carry across sessions. A few are project memories. One is the index. The memory layer is not organized by plugin; it is organized by the *kind* of guidance it captures. The brain keeps memory narrow because feedback rules are *meta-instructions*, not data; if there were a hundred of them, the operator would lose track. *[ref: memory-twenty-entries-feedback-heavy | ~/.claude/projects/<encoded>/memory/ | `ls ~/.claude/projects/-home-hadinayebi-CodingProjects-hadosh-academy-hadi-nayebi-github-io/memory/ \| wc -l` returns 20 entries: 15 feedback_*.md files (operator-given operating rules), 3 project_*.md files (active job + cross-blog series context), 1 MEMORY.md index, 1 jobs.md tracker. Captured 2026-05-13 during B8 ref-tag pass. The narrow-by-design contrasts with the wide knowledge layer.]*

**Each plugin's `docs/evolution.md` is capped at the prototype's current limit** (currently 2000 words, configurable via plugin_integrity's `config.conf`). Older sections migrate into sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) as the narrative grows. The cap is the only hard-enforced size limit in the prototype — every other limit is soft, enforced by CONDENSE discipline rather than a code gate. *[ref: evolution-md-only-hard-cap | .claude/plugins/plugin_integrity/hooks/evolution-cap.sh | The cap sets MAX_EVOLUTION_WORDS default 2000. Scope restriction to ONE file: "Only police evolution.md — other docs/*.md files are uncapped per user directive" with the corresponding exit guard. BLOCK message names the overflow targets: "consolidate older dated sections (1-line summaries OR archive verbatim into docs/decisions.md / docs/lessons.md / docs/lessons-<topic>.md)." This is the only file with a PreToolUse word-count gate in the entire plugin tree; every other documented cap (root brain / subdir CLAUDE.md / plans / memory / skills) is enforced by CONDENSE discipline, not code.]*

The shape is consistent: a small brain, a large knowledge layer, a narrow memory. The compression is structural — caps plus the CONDENSE waterfall plus soft thresholds — and the result is a seed whose persistent memory grows where it should grow (knowledge) and stays narrow where narrowness matters (memory, root brain). [Essay 1](01-llms-are-not-the-agents.html) said the filesystem is the agent. The numbers say what *filesystem* means in practice after a few months of accumulation: a knowledge directory thick with operational understanding, a brain just big enough to read in one sitting, and a memory file that captures the operator's hard-won rules in one short list. The limit on every number above is honest: caps and discipline are friction, not impossibility — a careless operator could bloat any layer; the architecture's design choice is to make the bloat visibly costly rather than to prevent it.

<!-- IMAGE PLACEHOLDER:
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
      Right: "archived when sealed"
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
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "chat session", "dies at compaction", "working CLAUDE.md", "deflates each cycle", "plan files", "archived when sealed", "plugin evolution.md", "capped 2000w, narrated", ".claude/knowledge/", "topic silos, grows monotonically", "memory/", "cross-project, your home dir", "durability", plus the caption below. No other words, file names, folders, or lifespan descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 8.2. Transient layers above. Durable substrate below. The seed's long-term store is the bottom of the stack."
-->

---

A small brain, a large knowledge layer, a narrow memory — these are the *outcomes* of three months of cycles. The mechanism that produces those outcomes is the soft-to-hard control migration, where behavioral patterns travel from coaching voice to hardened code. That migration is the next sub-essay.

---

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

*Previous: [Essay 8.2 — The Four Stages of Job Maturation](08_2-job-maturation-stages.html) — Stage 1 deep cycle through Stage 4 plugin form, plus sibling and dependent jobs.*
*Next: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
