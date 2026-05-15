---
title: "GMODE — The Off-Cycle Lane"
date: "May 2026"
slug: "gmode"
read_time: "8 min"
tags: [Architecture, Seed Agent, OPEVC, GMODE]
status: draft
version: v0.1.0
audience: "Tier 2 → Tier 3"
og_image: "assets/images/blog/markov-phasic-brain.png"
---

# GMODE — The Off-Cycle Lane

*Essay 6.9 of 10 — The Markov Phasic Brain.*

---

[Essay 6.8](06_8-backward-multiplier.html) covered the multiplier dial — the meta-cognition the seed agent is forced through *before* any phase begins, so a phase's tool budget reflects an honest forecast of the work ahead. This sub-essay turns to the opposite case: the work that doesn't fit any phase's compartment at all. The off-cycle lane.

Every phase, including idle, carries one extra edge that loops back to itself through gmode — short for *generic mode*. Gmode is the freestyle side-channel: a deliberately unconstrained state used for work the seed agent needs to do *now*, but for which the OPEVC ceremony would be overhead rather than discipline.

For the architects in the audience. Especially the ones who will need to do ad-hoc maintenance on a running seed.

---

## What it owns

Gmode owns the **off-cycle state** of a focused job. When the focused job's `current_phase == "gmode"`, every phase guard sees a phase name that isn't its own and steps aside. The phase plugins' tool restrictions silently switch off; the seed agent regains full write access without entering any specific phase. *[ref: phase-guards-step-aside-in-gmode | .claude/plugins/phase_verify/hooks/verify-guard.sh:87-88 | The VERIFY guard reads `current_phase=$(bash "$PHASE_SH" current "$focused_id" 2>/dev/null)` and exits 0 immediately on the next line: `[[ "$current_phase" != "verify" ]] && exit 0`. The same pattern lives in `phase_observe/hooks/observe-guard.sh:96-97` (`!= "observe"`) and `phase_execute/hooks/execute-guard.sh:240-241` (`!= "execute"`). When `current_phase == "gmode"` none of these equality checks succeed, so every per-phase guard short-circuits and the agent operates without phase-scoped tool restrictions.]*

The architectural reason gmode is one edge on *every* phase — not a separate state machine — is that gmode entry must work from wherever the agent currently is. A deadlock surfaces during PLAN; a plugin needs a one-line fix during VERIFY; a registry entry is missing during idle. The off-cycle lane has to be reachable from every node in the OPEVC graph. Making it a self-loop on each phase keeps the cycle counter and the home phase intact while the side-work happens.

## How it works — the 100-word entry, atomic stash, clean-git exit

Entry happens through three stages, each enforced by a different mechanism.

**The 100-word floor.** The seed agent enters gmode by asking the user an `AskUserQuestion` whose body is prefixed `[GMODE]` and whose total word count meets a configurable minimum — 100 words in the prototype. Anything shorter is rejected before the question ever reaches the user. The floor exists to force the agent to articulate, in prose, *what* the issue is, *what* was tried, and *why* the OPEVC compartment won't fit. The justification is the cost of the bypass. *[ref: gmode-100-word-floor | .claude/plugins/phasic_system/hooks/gmode-gate.sh:66-82 | The PreToolUse hook anchors on `^\[GMODE\]` (line 66), extracts the reason via `sed -n 's/^\[GMODE\] \(.\+\)$/\1/p'` (line 69), and counts words with `wc -w` (line 77). If `q_word_count -lt "${GMODE_WORD_MIN:-100}"` the hook prints "BLOCKED: [GMODE] question must be ≥${GMODE_WORD_MIN:-100} words" and exits 2 (lines 78-82). The floor is sourced from `config.conf` — tunable per seed.]*

**The atomic stash.** When the user confirms entry, the orchestrator runs a single `jq` update that does two things at once: it copies the current phase into a hidden field called `pre_gmode_phase`, and it overwrites `current_phase` with the literal string `gmode`. The pair is atomic — the home phase is captured in the same write that turns the phase guards off. There's no window where the agent is in gmode but the orchestrator has forgotten where it came from. *[ref: atomic-pre-gmode-stash | .claude/plugins/phasic_system/scripts/phase.sh:360-363 | The `enter-gmode` branch runs `jq --arg id "$local_id" --arg prev "$current" '(.jobs[] | select(.id==$id)) |= (.pre_gmode_phase = $prev | .current_phase = "gmode")' "$DATA_FILE" > "$DATA_TMP_FILE"` (lines 360-362), then `safe_write` commits the file (line 363). One pipe expression sets both fields in the same write — the home phase cannot drift from the gmode state.]*

**The clean-git exit.** When the agent calls `phase.sh exit-gmode`, the orchestrator first checks the working tree. If `git diff` or `git diff --cached` reports anything uncommitted, exit dies with a structured error and the agent stays in gmode until it commits or stashes. Only when the tree is clean does the orchestrator read `pre_gmode_phase` and atomically restore the home phase. *[ref: gmode-exit-clean-git-then-restore | .claude/plugins/phasic_system/scripts/phase.sh:389-404 | The `exit-gmode` branch runs `git -C "$ROOT_DIR" diff --ignore-submodules --quiet` and `git -C "$ROOT_DIR" diff --cached --ignore-submodules --quiet` (lines 390-391). If either reports changes, the orchestrator calls `die` with `"[phasic_system] BLOCKED: Git not clean. Commit your gmode changes before exiting"` (line 393). Only after the working-tree check passes does the script read `pre_gmode_phase` (line 396) and run the atomic restore `jq ... '(.jobs[] | select(.id==$id)) |= (.current_phase = $p | .pre_gmode_phase = null)'` (lines 401-403). The same git-cleanliness discipline that gates every phase transition gates this exit.]*

The cycle counter does not advance through gmode. The home phase is the home phase; gmode is a side-step that returns to it. *[ref: cycle-counter-untouched-by-gmode | .claude/plugins/phasic_system/scripts/phase.sh:341-407 | The full `enter-gmode` and `exit-gmode` branches (lines 341-407) contain no calls to the cycle-increment logic that lives elsewhere in the same script (the `idle → observe` transition at line 249 increments cycle; nothing in gmode handlers does). The home phase resumes on the same cycle number the agent left.]*

<!-- IMAGE PLACEHOLDER:
  ASSET: ../assets/images/blog/gmode-b6-9.png
  Concept: Chalk-on-blackboard sketch of the OPEVC cycle as a five-node ring (OBSERVE / PLAN / EXECUTE / VERIFY / CONDENSE) with an idle node sitting outside the ring. From every node — including idle — a single dashed chalk arrow loops out to a central chalk-box labeled "gmode" and a second dashed arrow loops back. A small chalk caption near each loop-pair reads "stash pre_gmode_phase" on the outgoing edge and "atomic restore" on the returning edge. A separate chalk gate icon labeled "≥100-word [GMODE] question" guards every outgoing arrow; a second chalk gate icon labeled "clean git" guards every returning arrow.
  Style: Match opevc-cycle-blackboard.png exactly. Dark slate chalkboard; hand-drawn chalk lines and rectangles;
  pastel chalk fills (cyan for the OPEVC ring nodes, green for the idle node, orange for the central gmode box, pink for the entry-gate icons, magenta for the exit-gate icons);
  white chalk for ALL labels, arrows, and captions; chalk sticks resting along the bottom edge.
  IMPORTANT: Use only the literal labels listed below. Do not invent additional file names, prefixes, or paths.
  Layout: Center — a single orange-fill chalk box labeled IN WHITE CHALK exactly: "gmode".
  Ring around the gmode box (clockwise from top) — five small cyan-fill chalk boxes arranged as a pentagon, labeled exactly: "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE".
  Off to the lower-left of the pentagon — a single green-fill chalk box labeled exactly: "idle".
  From each of the six perimeter nodes — a single dashed white-chalk arrow curves into the central gmode box. A second dashed white-chalk arrow curves back from gmode to the same node. Six arrow-pairs total.
  Near the outgoing arrows (between perimeter and gmode) — a small pink-fill chalk gate icon labeled exactly: "≥100-word [GMODE]". Near the returning arrows — a small magenta-fill chalk gate icon labeled exactly: "clean git".
  Between gmode and each returning arrow — a small white-chalk caption labeled exactly: "atomic restore".
  Keep every line hand-drawn and slightly imperfect, never ruler-straight.
  STRICT NAME WHITELIST — only these literal text strings as labels: "gmode", "OBSERVE", "PLAN", "EXECUTE", "VERIFY", "CONDENSE", "idle", "≥100-word [GMODE]", "clean git", "atomic restore", plus the caption below.
  Caption (bottom of image, white chalk, hand-drawn): "Image 6.9. Every phase, including idle, carries one self-loop through gmode. Entry costs a 100-word justification; exit requires a clean working tree; the home phase is restored atomically."
-->

## What would break without it

Without the off-cycle lane, two failure modes would alternate.

The first failure mode is **ceremony overhead.** Every ad-hoc fix — a deadlock, a missing registry entry, a one-line documentation correction surfaced mid-cycle — would force a full OPEVC pass to land. OBSERVE the situation, PLAN the fix, EXECUTE one line, VERIFY a script, CONDENSE the result. Five phases of ceremony for ninety seconds of editing. Most seed agents in that situation would learn to avoid noticing problems mid-cycle, which is the opposite of the discipline OPEVC exists to build.

The second failure mode is **substrate-integrity loss.** The alternative to ceremony is the agent quietly fudging a phase guard — patching the tool restriction so the small edit lands without changing phase. That route corrupts the substrate: the next subagent dispatched in the same phase inherits the loosened guard, the next test run inherits the loosened guard, and the always-on layer's promise that "every phase has a known write scope" is no longer true. One quiet bypass and the architecture is one step less trustworthy.

Gmode is the explicit third option. The bypass is named, gated, and structurally separate from the OPEVC graph. The agent's velocity drops at the entry (a hundred words of articulation), the working tree is forced clean at the exit, and the home phase returns intact. The bypass exists *because* the alternative — fudging guards in place — is the worse failure.

## What you would customize

Gmode is one of the more architecturally opinionated surfaces in the prototype. Most of the opinion lives in *defaults*, not invariants — the architect's customization door opens on several distinct knobs.

You would tune the **100-word floor.** The prototype's 100 is calibrated for an architect operator who occasionally needs ad-hoc work; a more experimental seed may want 50, a more cautious one may want 250. The number lives in `config.conf` and is read by the gate hook on every fire — no code change required. Lowering the floor lowers the cost of entry; raising it raises the bar at which gmode is the right choice rather than a fresh job.

You would relax the **clean-git exit requirement.** The prototype requires the working tree to be fully committed before the home phase is restored. A seed that does heavy experimental work — long-running gmode sessions that span multiple work blocks — may want to allow exit with a structured stash, or with a directory-scoped clean check rather than a global one. The trade-off is substrate integrity: a relaxed exit means the home phase resumes on a working tree it didn't produce, which the next phase's altered-list discipline will have to handle.

You would decide **what flows through gmode versus OPEVC versus new phases.** The prototype was built running every job through OPEVC because the work was building the seed agent itself; routine plugin maintenance has gone through gmode by exception. Once a seed ships and starts being used for project work, the proportion shifts. Some seeds will route nearly all maintenance through gmode; others will split phase plugins by job type and keep gmode for genuine emergencies. The off-cycle lane is the architect's pressure valve — how often it opens is your call.

You would change the **cycle-counter rule.** The prototype treats gmode as a side-step that doesn't consume cycle budget. A seed that wants stronger accounting may decide every gmode entry costs a fraction of a cycle, or that gmode time after the third entry in a cycle counts as a full new cycle. The home phase still restores; only the bookkeeping moves.

What you would **not** do is remove the entry gate. A seed agent that admits unconstrained tool access without justification is a seed agent that will eventually rewrite its own discipline mid-cycle and corrupt the layers below it. The gate's friction is the architecture; the specific word count, the specific cleanliness check, the specific cycle rule are the surface.

---

## Two ways to leave OPEVC

The off-cycle lane covers one kind of work that doesn't fit the phasic ceremony: **ad-hoc**, **fast**, **bypass-justified**. The next sub-essay covers the other: **planned**, **long-horizon**, **carried across cycles** — the plan-state machine that the seed agent reaches for when the work is too large for a single OPEVC pass.

Gmode is the side-channel; the plan-state machine is the long-channel. Both exist outside the per-cycle compartmentalization OPEVC enforces. Both are deliberate exits — one for the work that's too small for ceremony, one for the work that's too large.

---

*Essay 6.9 of 10 — The Markov Phasic Brain.*

*Previous: [Essay 6.8 — The Backward Multiplier](06_8-backward-multiplier.html) — the meta-cognition dial that calibrates each phase's tool budget before entry.*
*Next: [Essay 6.10 — The Plan-State Machine](06_10-plan-state-machine.html) — multi-cycle plans, the .md → .yaml lifecycle, and the long-horizon work the phasic brain carries across cycles.*




