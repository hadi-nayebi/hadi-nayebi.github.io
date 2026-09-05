# AGENTS.md — The Information System of a Planet

## Scope

These instructions apply to this directory and every descendant. The repository-root `AGENTS.md` still applies. If the two conflict, stop and surface the conflict to Hadi.

## Purpose

This directory owns **Observation 1 — The Information System of a Planet**, a long-running, non-technical Hadosh Academy visual narrative. It is a parallel **Observations** stream, not another numbered technical essay and not a replacement for Essays 1–9.

The page teaches one big intuition: life first accumulated information biologically; nervous systems, social learning, language, external memory, copying, institutions, scientific methods, machines, and communication networks progressively changed how information could be stored, transmitted, compared, selected, and embodied on Earth. The story should help a reader see where humanity came from, how each information-layer change expanded what groups of humans could do, and eventually where the reader may fit in the next stage.

The long-term destination is the Hadosh Academy idea of a user-owned **digital cortex**: a durable external cognitive layer that grows with a person and accumulates experience around them. Do not rush there. Hadi intends to add more framing when the narrative reaches the twentieth-century threshold. **Do not create episodes that enter modern computation, the internet, LLMs, or the AI/digital-cortex stage until Hadi explicitly authorizes that transition.**

## Substrate continuity principle

The story is not a sequence in which storage, communication, sensing, memory, or coordination suddenly appears for the first time at each new stage. Molecular life already performs all of those functions in limited forms: hereditary molecules preserve patterns, cells detect changing conditions, bacteria exchange chemical signals within and between species, molecular states can retain traces of prior conditions, and communities coordinate behavior.

Each later information layer should therefore be framed as an **expansion through a new substrate**, not the invention of information itself. A substrate develops many ways to store, transmit, interpret, remember, and act, while its physical form limits the speed, range, capacity, durability, and variety available to it. New substrates extend some of those limits while retaining older layers underneath. Nervous systems still depend on molecular signaling; language still depends on nervous systems and bodies; external memory will still depend on material carriers.

Do not make these transitions teleological or inevitable. Evolution is not trying to reach nervous systems, humans, writing, or a digital cortex. Multicellularity and centralization are branches rather than universal destinations, and older substrates remain successful after newer ones appear. Use the recurring substrate pattern to create continuity without turning biological or cultural history into a ladder of progress.

## Narrator and voice

Write in the conceptual voice of the first four Hadosh Academy essays and *The Folder Is Alive*: direct, visual, curious, occasionally irreverent, and understandable without technical prerequisites.

The implicit narrator observes humanity from slightly outside it, as if an informed long-lived visitor were studying Earth while living among humans. Never announce or role-play "I am an alien." Let the distance appear through scale and phrasing: an animal, a species, a city, a planet, a network, a memory system.

Use memorable metaphors, but mark the boundary between metaphor and fact. "Planetary hard drive," "processors," "software layer," "debugging," and "information species" are lenses, not literal scientific classifications. Do not turn a good metaphor into false causality.

Prefer concrete scenes and plain language before technical vocabulary. Zoom between the individual brain, a group, institutions, civilization, and the planet. Preserve Hadi's willingness to use humor and surprising analogies when they clarify rather than merely decorate.

## Historical and scientific discipline

This is narrative nonfiction grounded in current evidence.

- Research every episode from fresh public sources. Prefer peer-reviewed papers, scholarly reviews, archaeological publications, major academic presses, museums, universities, and primary historical sources when practical.
- Distinguish evidence, scholarly interpretation, uncertainty, and the narrator's analogy.
- Avoid single-cause stories for large historical transitions. Show feedback loops among communication, population, institutions, trade, war, disease, craft, science, energy, and technology when the evidence requires them.
- Do not imply that pre-literate societies were stagnant, that animals have no culture, that writing single-handedly created cities or metallurgy, that printing began with Gutenberg, or that disease simply caused the Enlightenment.
- Do not invent exact dates for poorly preserved transitions such as the origin of language.
- When scholarship is contested, either describe the uncertainty in the narration or choose wording narrow enough to remain accurate.
- Sources support the story; they do not dictate the story's prose rhythm. Keep citations and deeper links in each slide's source drawer rather than cluttering narration.

## Incremental episode rule

Create **one episode at a time**. Do not pre-write or lock a complete episode roadmap.

Before proposing the next episode:

1. Read the current `series.json`, every published episode, the latest applicable Hadi decisions/review comments, and any open PR touching this series.
2. State the learning gap left by the previous published episode.
3. Define one episode objective and 2–5 learning outcomes that naturally continue the story.
4. Research enough history/science to decide the episode's actual scope.
5. Only then choose the slide sequence.

A loose future direction is allowed for continuity, but it is not a commitment. The next episode should emerge from what the existing story now needs.

If the previous episode PR is still open, do not stack a dependent new episode on top of it. Incorporate Hadi's review when appropriate or wait for the next run.

## Episode contract

Every episode is one self-contained slideshow block on the same canonical page.

Episode metadata must include:

- sequential episode number and stable slug;
- title and publication/status fields;
- one clear `objective`;
- 2–5 `learning_outcomes`;
- a short `continuity` note explaining what the prior episode established and what this episode advances;
- an optional `future_pressure` note that records the unanswered question created by the episode without committing the next episode;
- a stable discussion term for the episode comment thread.

The objective is editorial control metadata. The narration should teach it naturally rather than displaying a classroom-style list of objectives to the reader.

## Slide contract

A slide is one narrative beat: **a persistent image beside independently scrolling complete narration on desktop**, stacked within the viewport on narrow screens.

Each slide must contain:

- stable slide ID and title;
- one image with meaningful alt text and the site's storytelling visual category;
- `read_minutes` representing the intended spoken/read duration;
- the complete narration as paragraph blocks — this same text becomes the future audio script;
- factual/source links sufficient to audit important claims and let curious readers dig deeper;
- an audio path and status, initially `placeholder` until Hadi adds narration audio.

### Reading duration and rhythm

Slides do not need equal length. The default range is **1–5 minutes of narration** per slide, roughly 140–750 spoken words depending on cadence. Prefer about 1.5–3 minutes for most slides. A visually dense or conceptually layered image can support 3–5 minutes; a simple emotional or transitional image should usually stay near 1–2 minutes. Never pad a slide merely to hit a number.

Use variation deliberately. Alternate scene-setting, mechanism, consequence, reflection, and transition beats so the episode breathes. A slide should exist because it changes the reader's mental model, not because the episode needs a quota.

There is no fixed slide count. Use the smallest sequence that fully satisfies the episode objective; roughly 5–10 is often useful, but evidence and rhythm decide.

## Visual contract

The image and narration must tell the same beat. Do not create decorative stock-like images that could accompany any paragraph.

This Observation should use more artistic/hybrid storytelling than the technical essays. Vary across the site's five visual categories. Favor `I50-A50`, `I30-A70`, and `I10-A90` for scenes and emotional scale; use `I70-A30` or `I90-A10` when a mechanism genuinely benefits from a diagram.

- No active storytelling SVGs.
- Avoid long body text inside generated images. Short labels are acceptable when the visual is explanatory.
- Preserve fullscreen/lightbox behavior and accessibility.
- Record every displayed image in the canonical storytelling visual inventory when an episode is added.
- Generate a coherent visual family within an episode, but allow style shifts between scene, mechanism, and reflection slides.
- Do not use a web image merely because it is historically literal if a generated explanatory scene can communicate the idea more clearly. When a historical artifact/image is necessary, verify rights and provenance before publication.

## Audio contract

Every slide reserves a predictable audio path from its first publication. Hadi will create narration audio separately from his laptop.

- `placeholder`: path is reserved; no audio file is required.
- `available`: the referenced audio file must exist and match the published narration semantically.

The page supports manual slide playback and an episode-play mode that may auto-advance **only after the reader initiates playback**. Never force autoplay on page load.

## Sources and comments

Every slide exposes a compact Sources / Go deeper drawer beneath the narration. Prefer a few strong sources over a link dump.

Each episode owns its own discussion surface. Keep contribution guidance visible: comments should stay tied to the episode, remove private/confidential material, and treat community feedback as evidence rather than authority. Never auto-post a comment or create a discussion on Hadi's behalf.

## Page architecture

- `index.html` is the stable public shell.
- `series.json` is the ordered series manifest and canonical episode index.
- `episodes/episode-NN-<slug>.json` stores one episode's metadata and slides.
- `images/episode-NN/` owns that episode's displayed visual assets.
- `audio/episode-NN/` owns narration files when Hadi adds them.
- `observation.js` renders episodes, navigation, audio controls, source drawers, fullscreen images, URL hashes, and episode discussions.
- `observation.css` owns this page's presentation.
- `validate-observation.mjs` checks the local content contract.

Keep content in episode data rather than hard-coding new episodes into the shell. Do not change the renderer merely to accommodate one episode unless the format itself has genuinely evolved.

## Reader experience

The canonical page is a fixed-viewport story reader, with one active episode and one active slide. Keep the website navigation above the workspace and persistent slide/episode navigation below it. The image remains visible while only the narration panel scrolls; do not restore whole-page scrolling or a large introduction above the workspace. Keep the series introduction accessible inside the narration panel.

Support:

- previous/next slide controls;
- slide count and direct dots/steps;
- keyboard left/right navigation when focus is inside the episode;
- stable hashes such as `#episode-2-slide-4`;
- image fullscreen viewing;
- per-slide audio when available;
- episode playback that advances after audio ends;
- one comment/discussion block per episode.

Do not auto-advance text-only slides. The reader controls pacing.

## Publication and PR discipline

For a daily episode run:

- start from current `main` and read all applicable `AGENTS.md` files;
- inspect open PRs first;
- create at most one new episode PR;
- generate/research the complete episode, including images, narration, source links, metadata, audio placeholders, and discussion identity;
- update `series.json` and any directly affected discovery/metadata surfaces required by the live site;
- run `node validate-observation.mjs` plus the repository validators applicable to navigation, contributions, storytelling visuals, and other changed surfaces;
- run syntax checks and `git diff --check` when a local worktree is available;
- inspect the complete diff;
- open a narrow reviewable PR against `main`;
- never merge, auto-merge, publish outside the PR, or delete branches.

Do not create an episode merely to satisfy the daily cadence. If evidence, continuity, an open dependency, or Hadi's pending twentieth-century guidance blocks a responsible next episode, report the blocker and create no PR.

## Instruction learning

At the end of every episode run, review whether this production contract caused avoidable friction, weak sourcing, repetitive rhythm, inconsistent objectives, image/text mismatch, excessive slide length, or review churn.

Distinguish a job-instruction defect from a one-off writing mistake or Hadi's editorial preference. Preserve the invariants above. A narrow non-consequential clarification may be proposed or, where the scheduled job explicitly authorizes it, applied to the job's own prompt. Consequential changes to voice, historical boundary, series destination, public/private policy, visual identity, episode cadence, authority, or page architecture require Hadi's explicit approval.
