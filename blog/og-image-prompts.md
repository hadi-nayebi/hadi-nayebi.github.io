# OG Image Prompts — 5 Missing Files

Five `og:image` paths are cited in the HTML headers of 21 essays but the
files don't exist on disk. Social-share cards (Twitter, LinkedIn, Slack,
Discord) currently fail or fall through to a 404 image for these essays.

This file lists the target path, citing essays, and a chalk-on-blackboard
prompt for each missing image. Generate the PNG, save it at the target
path with the exact filename, then delete this file.

**Style anchor:** all five must match `opevc-cycle-blackboard.png` —
dark slate chalkboard background, hand-drawn chalk lines and rectangles,
pastel chalk fills, white chalk for ALL labels, slightly imperfect lines
(never ruler-straight), chalk sticks resting along the bottom edge.

---

## 1 — B5 Series Banner

**Target path:** `blog/b5/images/always-on-digital-cortex-b5.png`
**Cited by:** 8 essays (05_2, 05_3, 05_4, 05_5, 05_6, 05_7, 05_8, 05_9)
**Purpose:** The Always-On Digital Cortex series banner — the shared
social-card image when any sub-essay is shared on social media.

**Concept.** Chalk-on-blackboard cross-section of a Claude Code session
with six always-on plugins drawn as a rim of cells around a central core
labeled "session." Each cell carries a single plugin name. The rim
visually wraps the core, signaling "always present" — none of the cells
is highlighted; the design emphasizes their collective ever-online
presence.

**Layout.** Center two-thirds — a single core circle (slate fill, white
chalk outline) labeled IN WHITE CHALK exactly: "Claude Code session".
Around it, six chalk cells arranged in a hexagonal rim, each a small
rounded rectangle labeled IN WHITE CHALK exactly with the literal plugin
name: "plugin_integrity" (cyan fill), "brain_guard" (green fill),
"job_core" (orange fill), "interaction_summary" (pink fill),
"question_discipline" (magenta fill), "CLAUDE.md hierarchy" (yellow fill).
Thin white-chalk arrows connect each cell back to the central core. A
small white-chalk label above the diagram reads exactly: "always-on layer".
A chalk caption below reads exactly: "The Always-On Digital Cortex".

**Strict name whitelist** — only these literal text strings as labels:
"Claude Code session", "plugin_integrity", "brain_guard", "job_core",
"interaction_summary", "question_discipline", "CLAUDE.md hierarchy",
"always-on layer", "The Always-On Digital Cortex".

---

## 2 — B6 Series Banner

**Target path:** `assets/images/blog/b6/markov-phasic-brain-b6.png`
**Cited by:** all 10 B6 essays (06_1 through 06_10)
**Purpose:** The Markov Phasic Brain series banner — shared social card.

**Concept.** Chalk-on-blackboard horizontal flow of the five phases plus
one cognitive organ, drawn as nested compartments with arrows pointing
forward through the cycle. A backward arrow loops from CONDENSE back to
OBSERVE, showing the cycle's restart.

**Layout.** A horizontal chalk strip running across the board. Five
chalk boxes in a row labeled IN WHITE CHALK exactly: "OBSERVE" (cyan
fill), "PLAN" (green fill), "EXECUTE" (orange fill), "VERIFY" (yellow
fill), with a chalk arrow between each pair pointing right. To the
right of VERIFY, a slightly larger compartment (pink fill) labeled IN
WHITE CHALK exactly: "CONDENSE — cognitive organ". A long curved
white-chalk arrow loops back from CONDENSE underneath the row, arriving
at OBSERVE — labeled "next cycle" on the arrow. Above the row, a chalk
caption reads exactly: "The Markov Phasic Brain — OPEVC".

**Strict name whitelist** — only these literal text strings as labels:
"OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE — cognitive organ",
"next cycle", "The Markov Phasic Brain — OPEVC".

---

## 3 — B7.1 Plugin Cell Anatomy

**Target path:** `assets/images/blog/b7/plugin-cell-anatomy-b7-1.png`
**Cited by:** 1 essay (07_1)
**Purpose:** Essay 7.1 opens the Plugin Kit series; this image shows
the plugin as a cell with internal organs.

**Concept.** Chalk-on-blackboard cross-section of a single plugin
directory drawn as a cell with seven internal organs, each a small
rounded rectangle labeled with the literal file or directory name.

**Layout.** Center — a large cyan-filled rounded rectangle labeled IN
WHITE CHALK exactly: "plugins/<your_plugin>/". Inside it, seven smaller
chalk organs arranged in two rows: top row — "CLAUDE.md" (green fill),
"hooks/" (orange fill), "scripts/" (yellow fill); bottom row —
"data.json" (pink fill), "docs/" (magenta fill), "agents/" (cyan fill),
"voice.xml × 2" (red fill). A thin white-chalk arrow from outside the
cell points at "hooks/" labeled "events fire here". A second arrow from
outside points at "scripts/" labeled "hooks call". A chalk caption below
reads exactly: "A plugin is a cell with internal organs".

**Strict name whitelist** — only these literal text strings as labels:
"plugins/<your_plugin>/", "CLAUDE.md", "hooks/", "scripts/", "data.json",
"docs/", "agents/", "voice.xml × 2", "events fire here", "hooks call",
"A plugin is a cell with internal organs".

---

## 4 — B8.1 Three Growth Axes

**Target path:** `assets/images/blog/b8/three-growth-axes-b8-1.png`
**Cited by:** 1 essay (08_1)
**Purpose:** Essay 8.1 opens the Apprentice to Architect series. This
image shows the three axes a seed agent grows along over months of work.

**Concept.** Chalk-on-blackboard 3D axis diagram with three labeled
axes radiating from a central origin. Each axis shows tick marks for
the growth stages or maturity levels along that dimension.

**Layout.** Center — a chalk origin dot labeled IN WHITE CHALK exactly:
"seed install". Three axes radiate out at roughly 120° from each other:
- Upper axis (green chalk) labeled "jobs" — three tick marks along it
  labeled "single-cycle", ".md plan", ".yaml plan".
- Lower-right axis (orange chalk) labeled "operator" — three tick
  marks labeled "apprentice", "journeyman", "architect".
- Lower-left axis (cyan chalk) labeled "brain" — three tick marks
  labeled "voice", "hook", "plugin".
At the far end of each axis, a small chalk star marks "architect work".
A chalk caption below reads exactly: "Three growth axes over months of
work".

**Strict name whitelist** — only these literal text strings as labels:
"seed install", "jobs", "single-cycle", ".md plan", ".yaml plan",
"operator", "apprentice", "journeyman", "architect", "brain", "voice",
"hook", "plugin", "architect work", "Three growth axes over months of
work".

---

## 5 — B8.2 Four Stages of Job Maturation

**Target path:** `assets/images/blog/b8/four-stages-b8-2.png`
**Cited by:** 1 essay (08_2)
**Purpose:** Essay 8.2 details the four stages a job moves through as
the seed learns its shape.

**Concept.** Chalk-on-blackboard horizontal staircase of four steps,
each step a labeled chalk box with a small descriptor below it.

**Layout.** Four chalk step-boxes in ascending diagonal arrangement
(left = lowest, right = highest). Each step labeled IN WHITE CHALK
exactly with the stage name + a short descriptor underneath:
- Step 1 (cyan fill) — title "Stage 1", descriptor "single-cycle OPEVC".
- Step 2 (green fill) — title "Stage 2", descriptor "multi-cycle .md plan".
- Step 3 (orange fill) — title "Stage 3", descriptor "multi-cycle .yaml plan".
- Step 4 (pink fill) — title "Stage 4", descriptor "plugin form of job".
A white-chalk arrow runs along the top of all four steps, pointing
right, labeled "maturation". A small chalk note in the corner reads
exactly: "Stage is decided in cycle-1 PLAN, not at creation". A chalk
caption below reads exactly: "Four stages of job maturation".

**Strict name whitelist** — only these literal text strings as labels:
"Stage 1", "single-cycle OPEVC", "Stage 2", "multi-cycle .md plan",
"Stage 3", "multi-cycle .yaml plan", "Stage 4", "plugin form of job", "maturation",
"Stage is decided in cycle-1 PLAN, not at creation", "Four stages of job
maturation".
