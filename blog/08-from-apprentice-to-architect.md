---
title: "From Apprentice to Architect"
date: "May 2026"
slug: "from-apprentice-to-architect"
read_time: "TBD"
tags: [Architecture, Seed Agent, Maturation, Jobs, Knowledge]
status: draft
version: v0.11.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/from-apprentice-to-architect.png"
---

# From Apprentice to Architect

*Essay 8 of 8 in the Hadosh Academy series on agent architecture.*

---

The previous three essays gave you the parts.

[Essay 5](05-the-always-on-digital-cortex.html) named the always-on layer and the CLAUDE.md bus it runs alongside. [Essay 6](06-the-markov-phasic-brain.html) named the phases that fill those compartments. [Essay 7](07-the-plugin-kit.html) named the cell template that lets new plugins be born.

This essay is about what happens when those parts are in *your* hands.

The seed agent is not a product. It is not a thing that gets installed and works. It is a thing that gets installed, and then *grows*, cycle by cycle, under the operator's care. A new seed in week one looks different from the same seed in month three. The architecture is identical. What has changed is the brain — what it has learned, what it has codified, what has fossilized into permanent enforcement, and what is still being shaped by hand.

This essay traces that arc. It is the operator's part of the story. You start as the seed's apprentice. Over time, the seed becomes yours. By the time you are done, you are not its operator anymore. You are its architect.

---

## The Job System — Three Forms and Two Creation Patterns

Every move the seed agent makes happens inside a *job*. The current prototype's job system has two axes the operator should know: the **plan-evolution form** a job is classified into at OBSERVE cycle 1, and the **creation pattern** used to spawn the job alongside other jobs. Together they describe how the seed's work is organized.

**A single-cycle DEEP job** is one OPEVC pass on a contained problem. PLAN sets `plan_file` to the literal `false` to declare there is no persistent plan document. The cycle observes, plans, executes, verifies, and condenses once and closes. Most early jobs run this format: a feature, a bug fix, a refactor, an investigation. The format teaches the agent — and you — what one full OPEVC rotation feels like under real load. Almost everything in week one runs through this format.

**A multi-cycle job with a markdown plan** spans several OPEVC passes against a persistent plan document. In cycle 1, PLAN calls `plan.sh set-plan-file plan_<slug>.md`. The plan document lives at `.claude/knowledge/plans/`, is authored by EXECUTE in cycle 1, edited by VERIFY as the work progresses, and serves as the long-term contract across all subsequent cycles. The deflation gate is gentler in multi-cycle (around fifty percent, not eighty) because some of the cycle's working memory legitimately needs to survive into the next cycle. Multi-cycle jobs teach coherence across context boundaries: cycle 2's OBSERVE has to read the plan, not just the project.

**A multi-cycle job whose `.md` plan has graduated to `.yaml`** is the long-form companion. The plan moves through a `plan_state` machine — `drafting` while the .md still refines; `md_approved` after VERIFY asks the user via AskUserQuestion and the user approves; `yaml_drafting` when the next cycle creates the .yaml from the approved .md; `yaml_ready` after a second approval. From `yaml_ready` onward, the orchestrator injects the .yaml at phase entry on every cycle — a stream of plan-specific context poured into the agent's working memory at the start of each phase. Honest framing: the .yaml form is wired in code today, but the actual phase-entry injection path inside `phase.sh` is debt the prototype has not yet invoked. The form exists; the routing hasn't connected.

Alongside those three forms, two **creation patterns** describe how a job comes into existence beside other jobs.

**A sibling job** is created in parallel with the currently focused job, with no link to it. The same `job.sh create <name>` command. The new pending job enters the queue and waits its turn. Sibling creation is how the cycle says: *I noticed something else worth doing, but it doesn't belong inside this cycle*. Siblings teach the agent to recognize scope creep — to flag work without absorbing it.

**A dependent job** is a sibling with a `depends_on` link. The command is different — `job.sh create-dependent <name>` writes the new job's id into the focused job's `depends_on` array. The dependent stays pending until every entry in its `depends_on` reaches `completed`. A `[JOB-COMPLETE]` approval naming a parent with unfinished dependents is rejected before it lands. Dependent jobs teach the agent to think about work as a directed graph, not a stream. They require the parent to be multi-cycle — creating a dependent on a single-cycle parent deadlocks both, which the cycle-1 brain_guard discipline `no-dep-jobs-in-single-cycle` codifies as a permanent operating rule.

In your first weeks running a seed, almost every job is single-cycle DEEP. Multi-cycle jobs appear once a feature crosses a CLAUDE.md size limit and the brain forces the work to be broken across cycles. Sibling and dependent patterns follow when you're confident enough to plan ahead.

The progression of *which forms and patterns you reach for* is itself a visible marker of the maturation arc.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard taxonomy — five job-system facets shown as side-by-side cards, three forms on the left and two creation patterns on the right with a visible divider.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk cards
  and lines; pastel chalk fills for each card (cyan, green, orange, pink, magenta — same palette as the cycle image);
  white chalk for ALL labels, gate text, and lesson text; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other job names, gate names, command names, or lesson descriptors.
  Layout: A single horizontal row of five hand-drawn rectangular chalk cards arranged left to right, equal size. A short vertical chalk divider line runs between Card 3 and Card 4 to separate the two axes. Above the divider, two short white-chalk axis labels:
    Above Cards 1–3:  "form (plan-evolution)"
    Above Cards 4–5:  "creation pattern"
  Each card has three sections stacked top to bottom: (a) name as the header IN WHITE CHALK, (b) the identifying gate or command IN WHITE CHALK, (c) the lesson it teaches IN WHITE CHALK.
    Card 1 (cyan fill, leftmost):
      Header: "single-cycle DEEP"
      Gate:   "plan_file = false"
      Lesson: "what one OPEVC rotation feels like"
    Card 2 (green fill):
      Header: "multi-cycle .md"
      Gate:   "plan_state = drafting"
      Lesson: "coherence across context boundaries"
    Card 3 (orange fill):
      Header: "multi-cycle .yaml"
      Gate:   "plan_state = yaml_drafting"
      Lesson: "plan as injected context at phase entry"
    Card 4 (pink fill):
      Header: "sibling"
      Gate:   "job.sh create <name>"
      Lesson: "flag work without absorbing it"
    Card 5 (magenta fill, rightmost):
      Header: "dependent"
      Gate:   "job.sh create-dependent <name>"
      Lesson: "work as a directed graph"
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "form (plan-evolution)", "creation pattern", "single-cycle DEEP", "plan_file = false", "what one OPEVC rotation feels like", "multi-cycle .md", "plan_state = drafting", "coherence across context boundaries", "multi-cycle .yaml", "plan_state = yaml_drafting", "plan as injected context at phase entry", "sibling", "job.sh create <name>", "flag work without absorbing it", "dependent", "job.sh create-dependent <name>", "work as a directed graph", plus the caption below. No other words, file names, folders, or job-format descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Two axes: how the plan evolves, and how the job is created. Five facets the operator chooses among."
-->

---

## What Actually Lives in the Brain After Three Months

The prototype today is a useful ground-truth case. A precise inventory of what its brain holds reveals the shape every mature seed converges toward.

**The knowledge layer holds roughly four hundred and fifty thousand words across thirteen topic silos.** This is by far the largest component of the seed's persistent memory. The directories are organized by topic, not by chronology — each topic accumulates findings over many cycles and stays legible because the topic name doesn't change as the seed learns. The mature topic silos carry version numbers like `v0.10.0` or `v2.0.0`, use a strict three-layer audience model (newcomer / practitioner / maintainer), and end every topic file with concrete *Decay & Refresh* triggers expressed as executable shell commands. The seedling silos sit at `v0.1.0` with one or two files and no decay section yet. The variance across the directory is itself information about which parts of the seed have matured.

**The largest single subdirectory in the prototype's knowledge layer is the session archive, at roughly sixty-five thousand words.** This is, in `phase_condense`'s design, the *fallback tier* — the destination of last resort for content that did not route to any earlier waterfall step. A session archive growing this large is an honest signal that earlier routing under-fired; mature seeds will compress this number as their condense subagents learn to route more aggressively into topic-organized files instead. The prototype isn't done growing yet, and the size of the session archive is the visible mark of that.

**The memory layer holds about twenty entries** in your home directory. Most are feedback rules — operator-given operating directives the brain should carry across sessions ("don't dispatch fresh subagents per iteration block," "use AskUserQuestion not chat for clarifying questions"). A few are project memories — narrative state about the current work. One is the index. The memory layer is not organized by plugin; it is organized by the *kind* of guidance it captures. The brain keeps memory narrow because feedback rules are *meta-instructions*, not data; if there were a hundred of them, the operator would lose track.

**Each plugin's `docs/evolution.md` is capped at two thousand words.** Older sections migrate into sibling files (`docs/decisions.md`, `docs/lessons.md`) as the narrative grows. The cap is the only hard-enforced size limit in the prototype today — every other limit is soft, enforced by CONDENSE discipline rather than a code gate.

The shape is consistent: a small brain, a large knowledge layer, a narrow memory. The compression is structural — caps plus the CONDENSE waterfall plus soft thresholds — and the result is a seed whose persistent memory grows where it should grow (knowledge) and stays narrow where narrowness matters (memory, root brain). [Essay 1](01-llms-are-not-the-agents.html) said the filesystem is the agent. The numbers say what *filesystem* means in practice after a few months of accumulation: a knowledge directory thick with operational understanding, a brain just big enough to read in one sitting, and a memory file that captures the operator's hard-won rules in one short list.

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
  Caption (bottom of image, white chalk, hand-drawn): "Transient layers above. Durable substrate below. The seed's long-term store is the bottom of the stack."
-->

---

## Soft → Hard Migration — The Patterns That Travel

The cleanest concrete migration in the prototype's history is the *multiplier sentinel*.

In the early cycles, every phase entry shipped a single coaching voice (`entry-set-multiplier`) asking the agent to please set the phase's multiplier before starting work. The voice fired probabilistically into the LLM's context. The agent read it and, under cognitive load, often ignored it. Several cycles in, the data was clear: the ratio of voice-fires to actual-multiplier-sets had stopped converging. The voice was not holding.

The hardening landed in `phasic_system` v0.12. Every phase's entry now initializes the multiplier to literal zero — a sentinel value. A `PreToolUse` guard reads the multiplier on every tool call; if it is zero, every tool is blocked. The agent's only available move is to call `<phase>.sh set-multiplier <job> <value>` with a value in the range from `0.5` to `3`. The coaching voice retired. In its place, two new voices took the load: `entry-set-multiplier-pre-set` informs the agent before the lock; `multiplier-zero-block` refuses tool calls when the gate fires. What was once probabilistic judgment is now mechanism. The agent's context can be full of distractions, deadlines, multi-step work — the multiplier still gets set, because nothing else can happen until it does.

A second migration ran in parallel — the *voice-id split*. Originally a single voice carried both the "please set it" intent and the "you have just set it" acknowledgment. As the lock hardened, the conflated voice's behavior under different conditions became its own bug surface. The migration split the single voice into two ids — one fires only before set, one fires only after. The two new voices made the architecture more honest about its own boundary. The pattern recurs: hardening one mechanism often surfaces an adjacent fuzziness that needed its own clarification.

The pattern beyond these two cases is the cost ladder named in [Essay 7](07-the-plugin-kit.html). New behavioral concerns start as **voice** — soft, probabilistic, ignorable. If measurement shows the voice failing to hold, the operator climbs to **hook in an existing plugin** — a `PreToolUse` guard inside the plugin whose concern the pattern belongs to. If the pattern needs its own state or crosses an existing plugin's boundary, it earns **a new plugin**. The prototype's universal discipline `Lock 13: the over-engineering veto` codifies the restraint: no new hard gate hardens before measured cycles demonstrate the soft form is failing.

The deepest migration is the *meta-pattern fossilizing into the kit itself*. The multiplier sentinel didn't just become a hook in `phasic_system`; it became part of the template every new phase plugin inherits. Brain_guard's cycle-1 universal disciplines (`verify-100-percent-before-bonus`, `subagent-spot-check`, `condense-not-deletion`, `no-dep-jobs-in-single-cycle`) made the same trip — from one cycle's lesson to a rule every cycle now obeys, codified into `.claude/knowledge/opevc/` and inherited by every new job. The architecture stops *remembering* the lesson because the architecture *is* the lesson.

You will not see this in week one. You will start to see it in month three, and by then it will feel inevitable.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard horizontal pipeline — a behavioral pattern moving left to right through five stages of hardening, from coaching voice to fossilized template.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk stages
  and arrows; pastel chalk fills for the five stages (cyan, green, orange, pink, magenta — same palette as the cycle image, in left-to-right order);
  white chalk for ALL labels, arrows, and stage text; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, file names, or descriptors.
  Layout: Five hand-drawn rectangular chalk stages arranged horizontally across the board, left to right, equal size. White-chalk arrows connect each stage to the next (four arrows total). Each stage is labeled IN WHITE CHALK with TWO lines of text — the stage name on top, a short mechanism note below:
    Stage 1 (cyan fill, leftmost):
      Top:    "coaching voice"
      Bottom: "voice.xml — probabilistic"
    Stage 2 (green fill):
      Top:    "measurement"
      Bottom: "data.json counters"
    Stage 3 (orange fill):
      Top:    "hook block"
      Bottom: "PreToolUse — deterministic"
    Stage 4 (pink fill):
      Top:    "plugin tests"
      Bottom: "tests/ — protects the gate"
    Stage 5 (magenta fill, rightmost):
      Top:    "kit template"
      Bottom: "fossilized — every new plugin inherits"
  Above the five-stage pipeline, draw a single curving white-chalk arrow that arcs from Stage 1 over to Stage 5, with one short caption riding the arrow's curve IN WHITE CHALK exactly: "soft → hard → out of brain".
  Below the pipeline, a horizontal white-chalk note reads exactly: "Lock 13: data must show soft failed before hard lands".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "coaching voice", "voice.xml — probabilistic", "measurement", "data.json counters", "hook block", "PreToolUse — deterministic", "plugin tests", "tests/ — protects the gate", "kit template", "fossilized — every new plugin inherits", "soft → hard → out of brain", "Lock 13: data must show soft failed before hard lands", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Patterns travel left to right. The brain shrinks; the kit grows."
-->

---

## What's Enforced vs What's Discipline

A documented size limit and an enforced size limit are not the same thing. The prototype today is honest about the difference.

**Root brain: 3,500 words. Subdirectory CLAUDE.md: 800 words. Plan files: 2,000 words. Memory entries: 400 words each. Skill files: 500 words.** Five caps in the documentation table — all of them soft. None are policed by a code hook today. The brain stays within these caps because the CONDENSE phase compresses each layer cycle after cycle, not because a `PreToolUse` guard refuses an edit.

**`docs/evolution.md`: 2,000 words. Hard.** A `PreToolUse` hook (`evolution-cap.sh` inside `plugin_integrity`) intercepts every edit to a plugin's `docs/evolution.md`, counts the post-edit word count, and refuses the edit if it would push the file past the cap. The voice that fires names the cap, names the current count, and points the agent at the sibling files (`docs/decisions.md`, `docs/lessons.md`) where older content should migrate.

One hard limit out of six. The pattern is consistent with the cost ladder. `docs/evolution.md` got the hard gate because the historian subagent re-narrates the file on every drift trip, the result is auto-injected into the agent's context at every plugin unlock, and a bloated evolution.md would inflate the per-unlock context budget across the entire system. The cost of letting it grow was concrete; the gate paid for itself.

The other size limits are soft because the *measurement* has not yet shown the soft control failing. Root brain stays at its cap because CONDENSE compresses it. Subdirectory CLAUDE.md stays at its cap because CONDENSE migrates content out to knowledge files. Memory entries stay short because operators write feedback rules tersely. Skills stay small because operations exceeding fifty words get extracted to their own skill file. None of this needs a hook today. The honest claim: it might tomorrow. The cost ladder will decide.

A second enforcement runs at a different boundary — the *deflation gate* inside `phase_condense`. At condense entry, a sensor snapshots the total bottom-section word count across every CLAUDE.md the cycle touched. At commit time, the script re-measures and refuses to advance unless the absorbed-words ratio crosses a stage-aware threshold (single-cycle jobs default to eighty percent, multi-cycle to roughly fifty). The gate fires at commit, not at edit — which is the right boundary, because the question isn't *did this individual edit fit* but *did the cycle, taken as a whole, compress enough to graduate*.

The pattern reads cleanly: hard limits cost something to maintain (every gate adds friction, every gate adds tests), and the architecture won't pay that cost until the soft form has demonstrably failed. The discipline isn't *more* enforcement; it is enforcement *where it pays for itself*.

---

## The Maturation Arc — Apprentice / Journeyman / Architect

Three rough stages describe the operator's relationship with the seed. The boundaries are soft; the shape is real.

**Apprentice.** Week one. You are figuring out the shape of OPEVC — when to advance phases, when to bail back, what the multiplier means in practice. Most cycles end in some form of intervention. The agent gets stuck on a phase gate, and you tell it what to do. It misreads scope, and you correct the multiplier. It writes prose into the wrong CLAUDE.md, and you point it at the right one. The voices speak to the agent constantly because the patterns are not yet ingrained.

This is the loud phase of cognitive growth. Hooks fire. Voices coach. Blocks land. The `multiplier-zero-block` fires every time the agent tries to use a tool before setting the phase's multiplier. The `min-synthesis-block` fires whenever the agent tries to write to CLAUDE.md before reading enough to earn five points. The `summary-required-block` fires when interactions overflow before a summary is filed. Most of what you read in chat is the brain talking to the agent about the brain. The signal-to-noise ratio is bad on purpose — every misfire is a teachable moment, and the brain is busy teaching.

The lessons are accumulating in three places: the knowledge directory under `.claude/knowledge/<topic>/`, the memory layer in your home directory, and each plugin's `docs/evolution.md`. The brain is bigger at the end of week one than it was at the start. That is correct. Apprenticeship grows by accretion.

**Journeyman.** Weeks four through twelve, roughly. Cycles are smoother. The agent has internalized OPEVC discipline. Multipliers tend to land in the right range. Phase advances happen automatically when the gate criteria are met. Bail-backs still happen, but they are typically real — the plan was wrong, not that the agent forgot to plan.

This is when patterns start *migrating*. A coaching voice that has been firing in every cycle for six weeks, almost always with the same content, becomes a candidate for hardening into a hook. The operator and the seed work together — recognizing the pattern, writing the hook, registering it, watching the voice retire. The CLAUDE.md hierarchy starts shrinking. Findings that were durable last month are now embedded in plugin behavior. The knowledge directory keeps growing. The brain itself stops.

**Architect.** Month three onward — and to be honest, the current prototype is still climbing toward this stage rather than living in it. What follows is the shape the architecture is reaching for. Most cycles complete without the operator intervening on basics. The voices speak less, because most of what they used to say has been absorbed into hooks or moved to the knowledge layer. New plugin creation feels routine — the kit ceremony from [Essay 7](07-the-plugin-kit.html) is no longer ceremonial; it is the natural rhythm of how you respond to a new pattern. The operator's role has shifted from supervising the agent's cognition to directing it at higher-leverage problems.

You are not finished. The seed is not finished. But you have crossed into a relationship where the seed's growth is driven by your architectural judgment, not by repeated correction of basic mistakes.

The prototype's plugin-version spread shows this arc directly. `job_core` carries `v0.2.0` with 172 tests — a young plugin, foundational, polished but not yet stress-tested across many cycles. `plugin_integrity` is at `v0.10.1` with 597 tests across 19 suites — the most mature plugin in the brain, because it polices every other plugin's edits and has been re-edited many times under its own gate. The phase plugins have converged at `v2.0.0`–`v2.4.0` with 162 to 376 tests each. Roughly twenty-eight hundred tests across all eleven plugins as of today. The number itself isn't the point; the *spread* is. Mature plugins look different from young plugins, and the difference is visible in the test counts, in the version numbers, and in the depth of their `docs/evolution.md` narratives.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard staircase — three ascending stages showing the operator's relationship with the seed, with visible markers per stage.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk steps
  and labels; pastel chalk fills for each stage (cyan = apprentice, green = journeyman, magenta = architect — drawn from the cycle image palette);
  white chalk for ALL labels and stage markers; faint chalk dust at the edges; chalk sticks resting along the bottom.
  IMPORTANT: Use only the literal text strings listed below. Do not invent or substitute any other stage names, time-range labels, or marker descriptors.
  Layout: Three hand-drawn rectangular chalk steps ascending diagonally from lower-left to upper-right across the board, like a chalk staircase. Each step is wider than tall. From low to high:
    Step 1 (cyan fill, lowest-left). Two lines of label centered on the step IN WHITE CHALK:
      Top line:    "apprentice"
      Bottom line: "week 1"
      Below the step (outside the staircase), three short white-chalk markers stacked vertically:
        "voices fire constantly"
        "multipliers land wrong"
        "bail-backs are corrections, not real"
    Step 2 (green fill, middle). Two lines of label:
      Top line:    "journeyman"
      Bottom line: "weeks 4–12"
      Below the step, three short white-chalk markers:
        "patterns migrate"
        "hooks harden"
        "CLAUDE.md shrinks"
    Step 3 (magenta fill, highest-right). Two lines of label:
      Top line:    "architect"
      Bottom line: "month 3+"
      Below the step, three short white-chalk markers:
        "kit ceremonies routine"
        "compose with the seed"
        "direct higher leverage"
  Above the entire staircase, a single curving chalk arrow runs left-to-right along the climb with one short caption riding its curve IN WHITE CHALK exactly: "from supervising to composing".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "apprentice", "week 1", "voices fire constantly", "multipliers land wrong", "bail-backs are corrections, not real", "journeyman", "weeks 4–12", "patterns migrate", "hooks harden", "CLAUDE.md shrinks", "architect", "month 3+", "kit ceremonies routine", "compose with the seed", "direct higher leverage", "from supervising to composing", plus the caption below. No other words, file names, folders, or stage descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Three rough stages. Soft boundaries. The shape is real."
-->

---

## The Brain Stops Growing in Size

A brain that grows without bound becomes its own problem. Every CLAUDE.md the agent reads at session start is a tax on the context window. A ten-thousand-word root brain plus six three-thousand-word plugin brains plus four five-thousand-word working CLAUDE.md files is half the agent's working memory before any prompt is processed. The brain would drown the cognition.

The size caps force the brain to do what your own brain does: forget the right things. Or more precisely, *move* the right things.

Root-brain overflow distills into focused skill files under `.claude/skills/`, with a one-line pointer left behind in the brain. Plugin CLAUDE.md overflow routes into that plugin's slice of the knowledge directory, the body kept lean enough to read in one sitting. Working CLAUDE.md overflow gets handled at cycle close by the deflation gate from [Essay 6](06-the-markov-phasic-brain.html), walking the file's footer-to-body absorption and refusing to advance until enough has compressed. Memory-file overflow splits into multiple narrowly-scoped entries. Findings that don't belong in any CLAUDE.md belong in plugin behavior — hardened into a hook — or in a session archive as a last resort.

The result is a brain that reaches a ceiling and stays there. Not because nothing new is happening — the seed is learning constantly — but because the new learning is being *placed* somewhere that doesn't need to be in the brain. The knowledge directory keeps growing. Each plugin's `docs/evolution.md` keeps narrating. The hooks keep hardening. The brain itself, the small set of files the agent reads at session start, finds an equilibrium and stays close to it.

This is what I mean when I say the brain stops growing in size but never stops learning. The compression isn't a limitation. It is the discipline by which the seed remains coherent across long timescales.

A mature seed is a small brain over a large knowledge layer.

<!-- IMAGE PLACEHOLDER:
  Concept: Chalk-on-blackboard graph — two curves over time. A flat ceiling line for the brain's size; a rising monotonic curve for the knowledge directory.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard background; hand-drawn chalk axes
  and curves; pastel chalk for the curves (cyan = knowledge growing, magenta = brain at ceiling, green = plugin evolution stepwise);
  white chalk for ALL axis labels, ceiling lines, and word-count numbers; faint chalk dust at the edges; chalk sticks along the bottom.
  IMPORTANT: Use only the literal numbers and labels listed below. Do not invent or substitute any other word-count caps, axis labels, or curve descriptors.
  Layout: A hand-drawn chalk coordinate axes. Horizontal X-axis labeled IN WHITE CHALK exactly "cycles", with a small "→" arrow at its right end. Vertical Y-axis labeled IN WHITE CHALK exactly "words". Three curves drawn over the axes, each labeled in white chalk at the curve's right end:
    Curve A (cyan, rising monotonically from lower-left to upper-right, gently curved, growing without bound):
      Label at right end: "knowledge/"
    Curve B (green, climbing in small stepwise jumps, leveling off near 2000):
      Label at right end: "plugin evolution.md"
    Curve C (magenta, climbs steeply at first, then flattens into a horizontal line that runs along a dashed ceiling):
      Label at right end: "root brain"
  Four dashed horizontal white-chalk ceiling lines drawn across the chart at the levels Curve C flattens and Curve B levels off, each labeled at the right with its EXACT word-count cap:
    "3,500" (highest dashed line — root CLAUDE.md cap)
    "2,000" (next — plan + evolution.md cap)
    "800"   (subdir CLAUDE.md cap)
    "500"   (skill files cap)
    "400"   (memory entries cap)
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings as labels: "cycles", "words", "knowledge/", "plugin evolution.md", "root brain", "3,500", "2,000", "800", "500", "400", plus the caption below. No other words, file names, folders, or curve descriptors may appear.
  Caption (bottom of image, white chalk, hand-drawn): "The brain reaches a ceiling. The knowledge layer never does."
-->

---

## Tier-3 Close: A System That Safely Modifies Itself

The plugins enforce the work. The phases produce the work. CONDENSE absorbs the work into the brain. The lock ceremony lets the brain edit itself. The historian narrates the edits. The drift counter ratchets the historian. The safe-lock cycle reverts on test failure. The knowledge layer accumulates what the brain itself has compressed away. The maturation arc fossilizes patterns into the kit.

The recursion is real, not metaphorical. The prototype recently needed to fix a concurrency race in `plugin_integrity`'s own guard hook — the exact code that polices every other plugin's edits. The fix required the agent to issue `[PLUGIN-LOCK] plugin_integrity`, run `plugin_integrity`'s own test suite, pass it, and let `plugin_integrity` lock itself before the change was committed. The guard did not exempt itself. The lock that closed that cycle is the same lock that opens the next. The historian subagent attached to `plugin_integrity` narrated the cycle's commits into the plugin's own `docs/evolution.md`. And during CONDENSE, the agent edited the root brain itself — `.claude/CLAUDE.md` — but only because it was in CONDENSE, the only phase whose guard permits writes to the brain.

Every layer is reachable. Every reach is gated by the same gates the rest of the system runs on.

Every part of the loop has a guard. Every part has a self-test. Every part has a coaching voice and a structured block. The architecture does not trust the operator to remember the rules. It does not trust the agent to remember the rules. It encodes the rules into the parts that touch the work, and lets the parts enforce themselves on each other.

The reason this matters is the reason agent reliability has been hard. A reliable agent is one whose behavior you can predict from cycle to cycle, not a clever one whose tricks impress in a single session. Predictability across time requires that the agent's *substrate* — its rules, its hooks, its phase boundaries — outlive any single session and any single LLM context. The seed agent is built so that the substrate does outlive those things. The chat dies. The model rolls forward. The operator forgets. The brain remembers, because the brain is on the filesystem, protected by guards that the filesystem itself enforces.

The deepest of those guards is the test-pass-or-revert cycle. Every plugin edit in the prototype passes through `safe-lock.sh`. If every test passes, the change commits and the lock closes. If any test fails, the working tree is rolled back to a captured `checkpoint_ref` and a structured entry lands in `plugin_integrity`'s revert log — timestamp, list of failed tests, list of files restored, the SHA before the revert. The log is not aspirational; it is forensic. One real entry from May 2026 shows a `brain_guard` edit that failed seventeen tests across tmux dispatch and window-pin code; the safe-lock cycle reverted all seventeen files in one atomic operation, and the operator went looking for the actual bug. The brain did not absorb a broken state. The test suite said no, and the substrate stayed coherent.

*That* is the durability guarantee that travels — not careful authorship, not clever prompts, not the discipline of any individual cycle. Code does not land if it breaks. The default is rollback. A system that safely modifies itself, under your direction, in your filesystem.

That is the seed agent.

---

## The Seed Is Yours

The Hadosh Academy seed agent is open source. MIT licensed. Free to use, free to fork, free to extend. There is no SaaS layer between you and your seed. No server holds your knowledge directory. No company controls your brain.

A note on honesty: at the moment these essays are being published, the public `seed_agent` repository contains the architecture — the install script, the root brain skeleton, the OPEVC philosophy, the migration plan, the MIT license. The plugin directories themselves are not yet there. The `.claude/plugins/` folder in the public repo is currently a single `CLAUDE.md` placeholder; the actual plugin code is still in the prototype, being prepared for migration. If you clone today, you will see the shape of the system and the path of the work to come. If you clone in a few weeks, more of the cell wall will be live. Either way, the substrate is being moved in, one cleaned-up and version-locked plugin at a time.

When you install a seed on your laptop, it becomes yours. The architecture is the architecture I have described across these eight essays — but the cycles are yours. The patterns it codifies, the voices it speaks, the hooks it hardens — they will be the patterns your work surfaces, the voices your judgment shapes, the hooks your edge cases call into existence.

Two operators with two seeds, six months in, will have brains that are visibly different. The architectures are the same. The lived seeds are not. That is the design.

The Academy exists because growing a seed well is a craft, and craft benefits from community. Other operators are growing their own seeds. They are running into patterns you will recognize and patterns you have not seen yet. The knowledge they are accumulating is not interchangeable with yours — but the *recipes* for accumulating it well are shareable, and that is what we are gathered to share.

Your brain was never built for the pace this work moves at. You knew that from [Essay 3](03-your-brain-was-never-built-for-this.html). What you have now is something built *for* that pace, designed to grow with you, encoded into a folder you control, governed by disciplines that hold across time and across sessions and across the model rolling forward.

The seed is yours. The Academy is here.

Build the brain.

---

*Essay 8 of 8 in the Hadosh Academy series on agent architecture.*

*Previous: [The Plugin Kit](07-the-plugin-kit.html) — the anatomy of a plugin, and the discipline that lets the brain grow new ones safely.*

*The series ends here. The seed begins where you start it.*
