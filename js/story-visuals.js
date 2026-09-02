// Hadosh Academy visual-storytelling layer.
// Adds conceptual illustrations only where they explain a relationship or system faster than prose.
(function () {
    'use strict';

    function loadStyles() {
        if (document.querySelector('link[data-story-visuals]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/story-visuals.css?v=20260830-1';
        link.setAttribute('data-story-visuals', 'true');
        document.head.appendChild(link);
    }

    function makeFigure(src, alt, caption, extraClass) {
        var figure = document.createElement('figure');
        figure.className = 'story-visual blog-image' + (extraClass ? ' ' + extraClass : '');
        var img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        figure.appendChild(img);
        if (caption) {
            var fc = document.createElement('figcaption');
            fc.textContent = caption;
            figure.appendChild(fc);
        }
        return figure;
    }

    function after(target, node) {
        if (!target || !target.parentNode || !node) return false;
        target.insertAdjacentElement('afterend', node);
        return true;
    }

    function sectionByHeading(text) {
        var headings = Array.prototype.slice.call(document.querySelectorAll('main section h2'));
        var hit = headings.find(function (h) { return h.textContent.trim().indexOf(text) !== -1; });
        return hit ? hit.closest('section') : null;
    }

    function installHome() {
        var hero = document.querySelector('main .hero');
        after(hero, makeFigure('/assets/images/story/home-engine-harness-chalk.jpg',
            'Interchangeable intelligence engines feed a durable user-owned cortex workshop containing memory, tools, jobs, and connected working structures.',
            'The model supplies intelligence. The durable harness keeps the user’s memory, working methods, tools, jobs, and accumulated experience.',
            'is-wide'));
    }

    function installStartHere() {
        var hero = document.querySelector('.start-here-hero');
        after(hero, makeFigure('/assets/images/story/start-here-cli-path-educational-v2.jpg',
            'A chalkboard map showing Codex, Claude Code, OpenCode, Qwen Code and other CLI agents learning from Hadosh Academy, then moving from learning to understanding to building one behavior and growing a harness.',
            'The fastest entry path: point the CLI agent you already use at the Academy, learn the architecture together, then externalize one repeated behavior.',
            'is-wide'));
    }

    function installAgents() {
        var hero = document.querySelector('main .hero');
        after(hero, makeFigure('/assets/images/story/agents-lineage-educational-v2.jpg',
            'A chalkboard lineage tree with the Claude Seed reference branching into Seed Agent on Codex and Q-Seed on Qwen Code while carrying forward jobs, memory, plugins, phases, authority and verification.',
            'One technical lineage, two public implementation paths. The behaviors carry forward while each runtime is free to reshape the mechanism.',
            'is-wide'));
    }

    function installProjectsIndex() {
        var hero = document.querySelector('.projects-overview-hero, .project-index-hero, main > section');
        after(hero, makeFigure('/assets/images/story/projects-scale-educational-v2.jpg',
            'A chalkboard scale map from one person with a CLI agent, to a small team with a shared repository and dashboard, to a persistent family world, to a larger crowd-powered collective.',
            'The projects are organized by human scale. As more people share the system, the interface and governance evolve with them.',
            'is-wide'));
    }

    function installSeedAgent() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/seed-agent-layered-ownership-hybrid-v2.jpg',
            'A chalkboard stack showing a changeable runtime layer, a user-owned Seed cognition layer, and the user-specific world of jobs, knowledge, history and preferences.',
            'The runtime can change. The durable cognition and accumulated experience are the layers the user keeps.',
            'is-medium'));
    }

    function installQSeed() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/q-seed-depth-of-ownership-educational-v2.jpg',
            'A chalkboard comparison between Codex Seed, where the runtime is external, and Q-Seed, where the framework can also be user-controlled beneath the cognitive layer.',
            'Q-Seed explores a deeper ownership boundary: the cognitive harness and the open CLI framework can both evolve under user control.',
            'is-medium'));
    }

    function installTeamHarnesses() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/team-harnesses-shared-office-hybrid-v2.jpg',
            'Several team members each use a local CLI agent while all connect to one private shared repository and dashboard; personal context remains near each member.',
            'Many local agents, one team-owned substrate. The dashboard and terminals are different doors into the same shared cortex.',
            'is-wide'));
    }

    function installFamilyGames() {
        var existing = document.querySelector('.family-hero-figure');
        if (existing) {
            existing.classList.add('blog-image');
            var img = existing.querySelector('img');
            if (img) {
                img.src = '/assets/images/family-games-concept-chalk.jpg';
                img.alt = 'A chalkboard storybook of a family together tonight, children exploring between gatherings, and the same persistent world years later filled with named animals, buildings and shared memories.';
            }
            var caption = existing.querySelector('figcaption');
            if (caption) caption.textContent = 'One world across different kinds of family time: gathering, exploration, creation, and memory over years.';
        } else {
            var opening = document.querySelector('.project-opening');
            after(opening, makeFigure('/assets/images/family-games-concept-chalk.jpg',
                'A chalkboard storybook showing a family together tonight, children exploring between gatherings, and the same persistent world years later.',
                'The world persists between calls and accumulates the family’s own animals, structures, voices, rituals, and stories.',
                'is-wide'));
        }
    }

    function makeCrimeCollectiveSection() {
        var section = document.createElement('section');
        section.className = 'container project-section crime-collective-extension';
        section.innerHTML = '<div class="project-section-intro"><div><span class="eyebrow">A crowd-owned channel pattern</span><h2>Crime is the first lens. The larger idea is city data told by a harness and improved by a crowd.</h2></div><p>The project can expand from crime time series and heat maps into other city-centered signals—population, schools, libraries, churches, businesses, public infrastructure, or any dataset that becomes more useful when it is visualized over time and place.</p></div>' +
            '<div class="project-three-grid project-principles">' +
            '<article><span>1</span><h3>Harness-led production</h3><p>The harness performs the repeatable majority of the work: finding and structuring data, building visualizations, drafting the story, assembling video, and preparing the questions that deserve human review.</p></article>' +
            '<article><span>2</span><h3>Crowd editorial judgment</h3><p>Subscribers receive videos, partial cuts, visuals, or focused questions by email and can add missing context, fact checks, local knowledge, story judgment, and stylistic improvements.</p></article>' +
            '<article><span>3</span><h3>Shared value, replicable model</h3><p>The channel explores sharing created value with the contributing collective. Other groups can copy the pattern for different topics and run their own crowd-managed media channels—a possible decentralized form of gig work built around shared ownership.</p></article>' +
            '</div>';
        return section;
    }

    function installCrimeCartography() {
        var heroLede = document.querySelector('.crime-project-hero .hero-lede');
        if (heroLede) heroLede.textContent = 'Crime Cartography is the first city-data channel in a broader collective-media experiment. The harness turns long-run city data into repeatable visual stories, a distributed human crowd improves the facts, framing, taste and storyline, and the project explores sharing the value of the resulting YouTube channel with the people who help shape it.';
        var distinction = document.querySelector('.crime-project-hero .project-distinction');
        if (distinction) distinction.innerHTML = '<strong>The audience can become part of the production system.</strong> Subscribers can receive full videos, partial cuts, visualizations, or focused questions by email, then respond with corrections, missing context, local knowledge, story judgment, and stylistic improvements.';

        var opening = document.querySelector('.project-opening');
        if (opening) {
            var collective = makeCrimeCollectiveSection();
            after(opening, collective);
            after(collective, makeFigure('/assets/images/story/crime-cartography-collective-channel-hybrid-v2.jpg',
                'A chalkboard pipeline from city data through an AI production harness and a human editorial crowd into a data-story YouTube channel, with value flowing back to contributors and the model branching into future collectives.',
                'The core experiment is broader than crime: city data + repeatable AI production + human editorial judgment + a collective that can share the value it creates.',
                'is-wide'));
        }
        var understand = document.getElementById('understand');
        if (understand) {
            var intro = understand.querySelector('.project-section-intro') || understand.firstElementChild;
            after(intro, makeFigure('/assets/images/story/crime-cartography-data-to-video-educational-v2.jpg',
                'A chalkboard workflow from exploring city data to visualization, story construction, video production, and final crowd enhancement.',
                'The harness gets a draft most of the way there; the editorial crowd improves the parts where local context, taste, skepticism, and judgment matter.',
                'is-wide'));
        }
    }

    function installPortfolio() {
        var thesis = sectionByHeading('The LLM Is the Engine');
        after(thesis, makeFigure('/assets/images/story/portfolio-human-digital-cortex-hybrid-v2.jpg',
            'A chalkboard cycle where human ideas and judgment enter the digital cortex as jobs and behaviors, execution happens there, results return to the human, and learning improves the harness.',
            'The human steers; the cortex carries execution, state, memory, and repeatable cognition; the results come back for judgment.',
            'is-wide'));
        var upward = sectionByHeading('When Execution Moves Outward');
        after(upward, makeFigure('/assets/images/story/portfolio-execution-ladder-educational-v2.jpg',
            'A chalkboard staircase from doing one task to designing methods, parallel cognition, comparing methods, and creating new context, with a calculator analogy.',
            'Offloading known execution can move human attention upward—from doing one method to designing, comparing, and inventing methods.',
            'is-wide'));
    }

    function installBlogIndex() {
        var header = document.querySelector('.blog-index-header');
        after(header, makeFigure('/assets/images/story/blog-learning-journey-educational-v2.jpg',
            'A connected blackboard journey through engines, a digital cortex, cognitive organs, phases, plugins, durable jobs and memory, operator growth, and user ownership.',
            'The essays form one learning journey: distinguish the engine from the agent, understand the cortex, study its organs and rhythms, then learn how the operator and the harness mature together.',
            'is-wide'));
    }

    function run() {
        loadStyles();
        var path = window.location.pathname.replace(/\/+$/, '') || '/';
        if (path === '/' || path === '/index.html') return installHome();
        if (path === '/blog.html') return installBlogIndex();
        if (path === '/start-here.html') return installStartHere();
        if (path === '/agents.html') return installAgents();
        if (path === '/projects' || path === '/projects/index.html') return installProjectsIndex();
        if (path === '/projects/seed-agent.html') return installSeedAgent();
        if (path === '/projects/q-seed.html') return installQSeed();
        if (path === '/projects/team-harnesses.html') return installTeamHarnesses();
        if (path === '/projects/family-games.html') return installFamilyGames();
        if (path === '/projects/crime-cartography.html') return installCrimeCartography();
        if (path === '/portfolio.html') return installPortfolio();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
