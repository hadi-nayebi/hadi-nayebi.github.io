---
title: "Context Window Discipline — brain_guard"
date: "May 2026"
slug: "brain-guard"
read_time: "8 min"
tags: [Architecture, Seed Agent, Plugins, Always-On]
status: draft
version: v0.2.0
audience: "Tier 2"
og_image: "blog/b5/images/always-on-digital-cortex-b5.png"
---

# Context Window Discipline — `brain_guard`

*Essay 5.3 — The Always-On Digital Cortex, Part 3 of 9.*

---

[Essay 5.2](05_2-plugin-integrity.html) covered the floor — the test gate that makes every plugin code change conditional. This part covers the ceiling: the always-on plugin that owns the seed agent's relationship to the model's context window.

---

## What it owns

`brain_guard` is the always-on plugin that owns the *self-compaction* the prior essay teed up. It works by watching context usage on every tool call and progressively tightening the agent's grip on tools as the window fills. The whole mechanism fires well before Claude Code's default auto-compact at 100%, which lets the seed agent operate even when the user is away from the terminal. *[ref: brain-guard-the-always-on-plugin | .claude/plugins/brain_guard/hooks/context-sensor.sh:6-21 | Hook's own comment: "Every time the agent calls any tool (Read, Edit, Bash, anything), Claude Code fires PreToolUse hooks BEFORE the tool runs... print a friendly reminder... before the HARD gate at 250k blocks the Read tool."]*

## How it works — the progressive squeeze

A pre-call sensor reads the running token count on every tool call. At the first tier (currently around 20% of the window), the plugin injects a coaching voice prompting the agent to draft a structured `/compact` instruction. The reasoning behind 20% is empirical and prototype-specific: in this 1M-token Opus setup, long-run reasoning starts to soften well before the nominal window is full, so acting at 20% leaves headroom before the prototype's 30% hard tier. If the agent ignores the prompt, the next tier (around 25%) starts blocking the agent's read tools. The hardest tier (around 30%) adds the write tools to the block list. *[ref: a-pre-call-sensor-reads | .claude/plugins/brain_guard/config.conf:20,26,32 | Three tier thresholds: `SOFT_THRESHOLD_TIER=20` (200k = coaching voice), `READ_THRESHOLD_TIER=25` (250k = Read blocked), `CRITICAL_THRESHOLD_TIER=30` (300k = Edit/Write/MultiEdit blocked). Each tier = 10k tokens; maps directly to 20/25/30% of Opus 4.7's 1M window.]*

The tier *positions* are tunable; the architectural fact is the progressive tightening. Rather than letting the agent drift toward a hard wall, `brain_guard` removes one tool at a time until the only graceful move left is to compact. *[ref: tier-positions-are-tunable | .claude/plugins/brain_guard/hooks/context-gate.sh:13-39 | Hook's own comment "GRADUATED ENFORCEMENT — escalate consequences as the danger rises, instead of one binary on/off switch." Maps tiers: 250k → Read blocked (Edit/Write still allowed); 300k → Read+Edit+Write+MultiEdit blocked, only Bash + AskUserQuestion remain.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: images/self-compact-b5-3.png
  Concept: Chalk-on-blackboard horizontal axis — context window fill with three brain_guard tiers leading to the 100% wall.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk axis line;
  pastel chalk for the tier bars (cyan = soft tier, green = read-block tier, orange = critical-block tier);
  white chalk for ALL axis labels, tick numbers, tier captions, and arrows; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent other tool names, threshold values, or captions.
  Layout: A long horizontal chalk axis runs left-to-right across the board, labeled IN WHITE CHALK exactly "context window fill (Opus 4.7, 1M tokens)".
  Hand-drawn tick marks on the axis at exactly these positions with these literal labels (white chalk):
    "0%"
    "20% (200k)"
    "25% (250k)"
    "30% (300k)"
    "100% (1M)"
  Three chalk bars stand on the axis:
    At the 20% tick: a SHORT cyan chalk bar; next to it a chalk speech-bubble icon; caption in white chalk reads exactly "soft tier — coaching voice".
    At the 25% tick: a TALLER green chalk bar; on top of it a chalk "Read" tool icon crossed through with a pink chalk X; caption in white chalk reads exactly "Read blocked".
    At the 30% tick: the TALLEST orange chalk bar; on top of it three chalk tool icons labeled "Edit", "Write", "MultiEdit" each crossed through with a pink chalk X; caption in white chalk reads exactly "Edit, Write, MultiEdit blocked".
  At the 100% tick: a thick white-chalk vertical wall; caption next to it reads exactly "Claude Code default auto-compact".
  From the 20% bar, a dotted white-chalk arrow curves upward-left and out of the squeeze, ending at a chalk label that reads exactly "self-compact early (brain_guard fires /compact)".
  Keep all arrows slightly curved and hand-drawn, never ruler-straight.
  STRICT NAME WHITELIST — the image must contain only these literal text strings: "context window fill (Opus 4.7, 1M tokens)", "0%", "20% (200k)", "25% (250k)", "30% (300k)", "100% (1M)", "soft tier — coaching voice", "Read blocked", "Edit, Write, MultiEdit blocked", "Read", "Edit", "Write", "MultiEdit", "Claude Code default auto-compact", "self-compact early (brain_guard fires /compact)", plus the caption below. No other tool names or labels may appear.
  Caption (bottom of image, white chalk, hand-drawn): "Image 5.3. The progressive squeeze — each tier removes one more tool until self-compaction is the only graceful move."
-->

## Shape compels production

The compaction itself is shape-enforced. The plugin requires the `/compact` instruction to carry five named sections (Scope reminder, Lessons learned, Verbatim user directives, Recognition moments, Continuation hint) before it is accepted; any instruction missing a section gets blocked until the agent rewrites it. *[ref: the-compaction-itself-is-shape-enforced | .claude/plugins/brain_guard/scripts/self-compact.sh:239-244 | `REQUIRED_SECTIONS` array names the five sections verbatim: "Scope reminder", "Lessons learned", "Verbatim user directives", "Recognition moments", "Continuation hint". Inline comment: "Format is FIXED across sessions on purpose." Missing-section check triggers `_die` BLOCKED exit.]*

The five sections aren't gospel. The shape is.

Call this **shape compels production**: a compartment that demands a structured shape forces the agent to *produce* content that fits the shape, and the production itself becomes useful context. The agent thinks more carefully about compaction because it has to write under headers. *[ref: shape-compels-production | .claude/plugins/brain_guard/scripts/self-compact.sh:654-656 | Rationale comment: "This forces the agent to substantively fill EACH category — not stack words in the easy section ('Scope reminder' boilerplate) and skip the hard ones ('Recognition moments' requires real meta-cognition). Without per-section discipline, instructions drift back into self-summaries."]*

The pattern is portable. Structured git commits, structured plan files, structured subagent dispatches — every time a shape demands content, the content rewards the next step. A consultant could use the same trick on weekly client briefs — a fixed five-section template (scope, open questions, decisions taken, evidence, next checkpoint) forces the substantive thinking the prose would otherwise skip. The same trick lands in [`interaction_summary` (Essay 5.5)](05_5-interaction-summary.html). *[ref: shape-pattern-portable-interaction-summary | .claude/plugins/interaction_summary/CLAUDE.md Objective section | interaction_summary's Objective: "Maintain a continuous summary chain from user interactions. When unsummarized interactions exceed a token threshold, block all work until the agent produces a summary that carries forward essential context." The summary is structurally five-sectioned — same shape-compels-production trick brain_guard uses on its `/compact` template. interaction_summary is the second always-on plugin in the prototype where a required structural shape forces useful per-section production, confirming the portability claim.]*

## The dispatch mechanic

Mechanically, the `/compact` self-issue is hacky. A small script injects the instruction into the active terminal — through clipboard-and-keystroke input-injection under X11, or through terminal-multiplexer paste primitives under tmux — because Claude Code does not yet expose an API for an agent to trigger compaction before the 100% auto-compact. *[ref: dispatch-mechanism-x11-tmux | .claude/plugins/brain_guard/scripts/self-compact.sh:309-345 + .claude/plugins/brain_guard/CLAUDE.md Status section | self-compact.sh L309-318 `_select_dispatch_mode()`: "if TMUX set → tmux; else if DISPLAY set + xdotool present → x11; else none." The X11 validation block (L328-345) requires `xdotool` + `xclip` (errors: "self-compact.sh requires an X11 session (xdotool+xclip)"; "xclip not found"; "xdotool not found. Install with: sudo apt install xdotool"). brain_guard CLAUDE.md Status line confirms: "Feature #1 (context-aware compact enforcement) LIVE in two dispatch modes: X11 (`xdotool` + `xclip`) and tmux (`set-buffer` + `paste-buffer -p` bracketed paste)." Two paths, one selector.]*

The script records the compaction time in the plugin's hidden state, and the next firing of the tier guards reads that timestamp to grant a brief grace window so the compacted transcript can register before the gate would otherwise re-block. If Claude Code ships a native intermittent self-compact API, this plugin's terminal-typing layer retires; the rest of the discipline carries forward unchanged. *[ref: mechanically-the-compact-is-hacky | .claude/plugins/brain_guard/CLAUDE.md Status section | Plugin status line: "Feature #1 (context-aware compact enforcement) LIVE in two dispatch modes: X11 (`xdotool` + `xclip`) and tmux (`set-buffer` + `paste-buffer -p` bracketed paste). Config externalized to config.conf... POST_COMPACT_GRACE_SECONDS..." Both paths + grace window in one line.]*

## What would break without it

Without `brain_guard`, the agent runs the conversation off a cliff. The default 100% auto-compact fires eventually, but without the agent's own plan for what to preserve — and the next session starts from whatever the model happened to have in the window at that moment. *[ref: without-brain-guard-the-agent | .claude/plugins/brain_guard/scripts/self-compact.sh:8-17 | Top comment: "past 250k tokens, reasoning quality falls off a cliff, and a fresh compact restores capacity... the agent itself can't TYPE the slash command — only the human at the keyboard can. This script automates that human role." Without it, only the 100% auto-compact fires.]*

## What you would customize

`brain_guard` is the plugin most architects tune the moment they adopt the seed. Almost every knob has a defensible reason to move.

You would tune the *tier positions* for your model and your context budget. The 20% / 25% / 30% values map to Opus 4.7's 1M token window — they encode this prototype's empirical operating curve rather than a universal model law. Your seed may run on a different model with a different effective-reasoning curve; the tier thresholds should track wherever that curve actually bends for the model you use. Sonnet's window is smaller; Haiku's smaller still; a future model with cleaner long-context behavior may not need the 25% tier at all. *[ref: tier-positions-tunable-config | .claude/plugins/brain_guard/config.conf:20,26,32 | Thresholds live in config.conf — not in code. SOFT_THRESHOLD_TIER, READ_THRESHOLD_TIER, CRITICAL_THRESHOLD_TIER are knobs by design; tuning per-model is the expected operator move.]*

You would customize the *`/compact` template*. The five sections name what *this* prototype values — Scope reminder, Lessons learned, Verbatim user directives, Recognition moments, Continuation hint. Your seed may need different sections for your kind of work: a legal-research seed may want a "citation-state" section instead of "Recognition moments"; a project-management seed may want a "decision-log" section instead of "Verbatim user directives." The five names aren't gospel. The shape is. *[ref: compact-template-five-sections | .claude/plugins/brain_guard/scripts/self-compact.sh:239-244 | `REQUIRED_SECTIONS` array names the five sections verbatim: "Scope reminder", "Lessons learned", "Verbatim user directives", "Recognition moments", "Continuation hint" (L239-244). The L231-235 design comment lays out the per-section intent: "1. Scope reminder — boilerplate about what NOT to re-summarize; 2. Lessons learned — pattern-level insights (MEMORY.md candidates); 3. Verbatim user directives — exact quotes only, never paraphrased; 4. Recognition moments — meta-cognition; 5. Continuation hint — generic-language pointer to next workflow tab." Customizing = editing this array + matching per-section rules.]*

You would choose your *dispatch mechanism*. The current prototype ships two paths — X11 keyboard injection and tmux paste-buffer. Your environment may need a third (an SSH-bridge variant, a Windows Terminal handler). If Claude Code ships a native self-compact API, you drop the keyboard-injection layer entirely without touching the rest of the plugin. *[ref: dispatch-mechanism-customization | .claude/plugins/brain_guard/scripts/self-compact.sh:309-345 + .claude/plugins/brain_guard/config.conf:137,148-158 | self-compact.sh L309 `_select_dispatch_mode()` is the single dispatch-switch point — `echo "tmux"`, `echo "x11"`, or `echo "none"`. Adding a third dispatch path means adding a branch here and a matching validation helper alongside `_check_tmux_environment()` and the X11 validator at L328-345. config.conf externalizes the per-path knobs: `BRAIN_GUARD_WINDOW_NAME` (L137 — X11 window targeting) and `TMUX_INSTRUCTION_MAX_BYTES` (L148-158, default 8192 — tmux paste cap). New dispatch path adds its own config block; the surrounding self-compaction logic stays unchanged.]*

You would add or split *tiers*. Three tiers is the current shape; nothing in the architecture forbids four or five. A high-stakes seed may want an extra tier between 25% and 30% that blocks Bash before write tools. A seed working in shorter, hotter cycles may collapse the soft tier and start blocking immediately at 22%. *[ref: tier-count-customizable | .claude/plugins/brain_guard/config.conf:16-32 + .claude/plugins/brain_guard/hooks/context-gate.sh:13-31 | config.conf L16-32 names exactly three tier thresholds: `SOFT_THRESHOLD_TIER=20`, `READ_THRESHOLD_TIER=25`, `CRITICAL_THRESHOLD_TIER=30`. context-gate.sh L13-31 implements the matching graduated enforcement: "200k–249k (tier 20-24) → soft voice only"; "250k–299k (tier 25-29) → Read tool BLOCKED, everything else allowed"; "300k+ (tier 30+) → Read + Edit + Write + MultiEdit ALL blocked." Adding a fourth tier = appending a new threshold constant in config.conf + a new branch in the context-gate ladder. Tier count is structurally tunable, not hardcoded into the architecture.]*

What you would **not** do is remove the progressive-tightening principle. Letting the agent drift toward the 100% wall, then surprise-compacting at the worst moment, is exactly the failure mode `brain_guard` was built to prevent.

---

The next part covers the plugin that gives the seed agent a notion of *what work it is doing* — the unit of compartmentalization, the dynamic mega-prompt, the refusal to stop while jobs remain.

---

*Essay 5.3 — The Always-On Digital Cortex, Part 3 of 9.*

*Previous: [Essay 5.2 — Plugin Edit Safety — `plugin_integrity`](05_2-plugin-integrity.html) — the test gate underneath every plugin edit.*
*Next: [Essay 5.4 — Job Lifecycle — `job_core`](05_4-job-core.html) — the agent's unit of compartmentalization and the refusal-to-stop discipline.*
