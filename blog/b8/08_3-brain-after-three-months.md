---
title: "What Lives in the Brain After Three Months"
date: "May 17, 2026"
slug: "brain-after-three-months"
read_time: "6 min"
tags: [Architecture, Seed Agent, Maturation, Knowledge]
status: published
version: v0.2.0
audience: "Power Users & Architects"
og_image: "blog/b8/images/maturation-arc-b8-banner.png"
---

# What Lives in the Brain After Three Months

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

---

[Essay 8.2](08_2-job-maturation-stages.html) closed the job-maturation arc — Stage 1 deep single-cycle through proposed Stage 4 plugin form, plus standalone and dependent job patterns. The arc describes *how* a job grows. This sub-essay opens the *outcome*: a May 2026 snapshot of what one earlier Claude-based reference architecture held after three months of cycles.

That historical snapshot is a useful case study. Its inventory reveals one mature shape: a small working brain, a large knowledge layer, and narrow cross-project memory.

---

A research lab running experiment-protocol jobs through the same maturation arc will see its knowledge layer fill with topic-named directories like `knowledge/protocols/` (IRB-approved procedures), `knowledge/equipment/` (instrument calibration rules), and `knowledge/datasets/` (sample-handling conventions). Its memory layer will hold rules the operator gives once and expects honored across every session — *always quote source DOIs*, *never auto-publish without PI review*. The *shape* — small brain, large knowledge layer, narrow memory — transfers. The *substance* differs per operator's domain. The numbers below belong to one historical implementation; they illustrate the proportions this architecture produced, not a universal invariant. *[ref: topic-named-directory-shape-transfers | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

---

**The active knowledge layer was the largest persistent store** in that May 2026 snapshot: roughly 258,000 words across active topic silos, plus an archive of similar size treated as historical reference rather than live recall. The count grows as a seed adds plugins or cross-cutting topics, so it is evidence of that moment rather than a current total. The directories are organized by topic, not by chronology — each topic accumulates findings over many cycles and stays legible because the topic name doesn't change as the seed learns. The mature topic silos carry version numbers, use a strict three-layer audience model (newcomer / practitioner / maintainer), and end every topic file with concrete *Decay & Refresh* triggers expressed as executable shell commands. *[ref: knowledge-layer-active-and-archived-silos | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The session archive is the cycle's full-footer snapshot.** Each cycle, CONDENSE captures the entire footer — a complete raw record of the cycle's working memory — into a per-cycle session file before it deflates. That makes the archive *large by design*: a big session archive is a full snapshot, not a routing failure. What stays disciplined is where durable findings land — up in the body and the topic-organized knowledge silos, the discoverable layers — with the archive as the raw backup behind them, the least discoverable layer, reached only by a trace-link. *[ref: session-archive-full-snapshot | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**The cross-project memory layer stayed narrow** in the historical snapshot: a small set of entries carrying guidance across projects, with the exact count varying by operator and date. Most were feedback rules — operator-given operating directives the brain carried across sessions; the rest were project memories, session handoffs, operational templates, and an index. Your seed's memory layer will hold whatever guidance most often crosses your project boundaries — composition varies; narrowness is the design pressure. This layer is organized by the *kind* of guidance it captures rather than by plugin. Feedback rules are *meta-instructions*, not data; if they multiply without discipline, the operator loses track of the rules steering the system. *[ref: memory-fifty-entries-feedback-heavy | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

**Each plugin's `docs/evolution.md` is capped at the historical implementation's current limit** (2000 words there, configurable for a seed's appetite). Older sections migrate into sibling files (`docs/decisions.md`, `docs/lessons.md`, `docs/principles.md`) as the narrative grows. That cap is one of two hard-enforced size-limit families in the documented snapshot. The other protects local project-instruction files against growth beyond its threshold; the remaining size targets are soft and depend on CONDENSE discipline rather than their own word-count gates. *[ref: evolution-md-only-hard-cap | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

The shape is consistent: a small brain, a large knowledge layer, a narrow memory. The compression is structural — caps plus the CONDENSE waterfall plus soft thresholds — and the result is a seed whose persistent memory grows where it should grow (knowledge) and stays narrow where narrowness matters (memory, root brain). [Essay 1](../b1/01-llms-are-not-the-agents.html) said the filesystem is the agent. This historical snapshot shows what *filesystem* can mean after a few months of accumulation: a knowledge directory thick with operational understanding, a brain just small enough to read in one sitting, and a memory layer that captures the operator's hard-won rules in a short list. In the earlier Claude-based implementation, the essays supplied the *why* and the knowledge directory supplied the *how*. The limit on every number above is honest: caps and discipline are friction, not impossibility — a careless operator could bloat any layer; the architecture's design choice is to make the bloat visibly costly rather than to prevent it. *[ref: caps-plus-condense-discipline-not-code | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

Viewed along a different axis — *durability* — the transient layers sit at top (active chat context resets at compaction, the footer sections of project-instruction files touched during the cycle deflate at cycle close, and plan files persist across a job's cycles). The durable layers sit at bottom (knowledge silos grow over time, while a narrow memory layer crosses projects). The evolution-record cap sits in the middle as one of two hard-cap families in this historical implementation; the other is the growth-only protection for local project-instruction files described in Essay 8.5. *[ref: durability-stack-three-bands | private historical prototype | Checked against a private historical prototype; identifying repository, revision, source paths, and unpublished implementation details are omitted.]*

<!-- IMAGE PLACEHOLDER:
  STATUS: The existing asset is stale and hidden. Regenerate only in the later diagram round.
  ASSET: images/brain-layers-b8-3.png
  Replacement requirements: Show a durability stack with active session context at the top; working instructions and touched footers that deflate during cycle close; plans persisting across cycles; and durable evolution records, knowledge, and cross-project memory below. Keep the historical snapshot framing and do not present every project instruction as cycle-deflated.
  Caption (HTML text shown under the image, not drawn inside the image): "Image 8.3. Transient context above; durable knowledge below."
-->

---

A small brain, a large knowledge layer, a narrow memory — these are the *outcomes* of three months of cycles. One mechanism that helps produce those outcomes is soft-to-hard control migration, where behavioral patterns travel from coaching voice to hardened code. That migration is the next sub-essay.

---

*Essay 8.3 — From Apprentice to Architect, Part 3 of 9.*

*Previous: [Essay 8.2 — The Stages of Job Maturation](08_2-job-maturation-stages.html) — Stage 1 deep cycle through proposed Stage 4 plugin form, plus standalone and dependent jobs.*
*Next: [Essay 8.4 — Soft → Hard Migration](08_4-soft-hard-migration.html) — how a behavioral control travels from coaching voice to hook to template.*
