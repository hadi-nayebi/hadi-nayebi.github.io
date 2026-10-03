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

    function makeFigure(src, alt, caption, extraClass, styleCode) {
        var figure = document.createElement('figure');
        figure.className = 'story-visual blog-image' + (extraClass ? ' ' + extraClass : '');
        if (styleCode) {
            var weights = styleCode.match(/^I(\d+)-A(\d+)$/);
            figure.setAttribute('data-visual-style', styleCode);
            figure.setAttribute('data-visual-role', 'storytelling');
            if (weights) {
                figure.setAttribute('data-information-weight', weights[1]);
                figure.setAttribute('data-artistic-weight', weights[2]);
            }
        }
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
        after(hero, makeFigure('/assets/images/story/home-engine-harness-hybrid-v3.jpg',
            'Three interchangeable intelligence engines connect to one user-owned harness whose memory, rules, jobs, and knowledge compound into work, learning, and ownership.',
            'Intelligence engines can change. The user-owned harness keeps the memory, rules, jobs, and knowledge that compound through use.',
            'is-wide', 'I50-A50'));
    }

    function installStartHere() {
        var hero = document.querySelector('.start-here-hero');
        after(hero, makeFigure('/assets/images/story/start-here-cli-learning-hybrid-v3.jpg',
            'A learner follows four connected chalk scenes: pointing interchangeable CLI agents at a local folder, learning the architecture, building one behavior with an agent, and growing a user-owned harness containing memory, jobs, tools, and verification.',
            'Point your CLI here, learn the ideas together, build one repeated behavior, and let that owned structure grow into a harness.',
            'is-wide', 'I70-A30'));
    }

    function installAgents() {
        var hero = document.querySelector('main .hero');
        after(hero, makeFigure('/assets/images/story/seed-architecture-pattern-sources-v3.jpg',
            'A chalkboard map separates framework-agnostic Academy writings, private Claude Seed evidence, and the Seed Agent and Q-Seed public pattern repositories, then shows three users and agents growing visibly different local harnesses from different selections.',
            'Three sources, many distinct harnesses. Each user and agent can choose patterns, adapt components, or build from scratch.',
            'is-wide', 'I90-A10'));
    }

    function installProjectsIndex() {
        var hero = document.querySelector('.projects-overview-hero, .project-index-hero, main > section');
        after(hero, makeFigure('/assets/images/story/projects-scale-human-hybrid-v3.jpg',
            'Four connected chalk scenes show an individual with personal context, a group sharing work, a family sharing a private world, and a collective participating publicly, all connected to one user-owned harness foundation.',
            'One user-owned harness pattern can support personal context, shared work, a persistent family world, or public participation at collective scale.',
            'is-wide', 'I50-A50'));
    }

    function installSeedAgent() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/seed-agent-layered-ownership-hybrid-v2.jpg',
            'A chalkboard stack showing a changeable runtime layer, a user-owned Seed cognition layer, and the user-specific world of jobs, knowledge, history and preferences.',
            'The runtime can change. The durable cognition and accumulated experience are the layers the user keeps.',
            'is-medium', 'I50-A50'));
    }

    function installQSeed() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/q-seed-depth-of-ownership-educational-v2.jpg',
            'A chalkboard comparison between Codex Seed, where the runtime is external, and Q-Seed, where the framework can also be user-controlled beneath the cognitive layer.',
            'Q-Seed explores a deeper ownership boundary: the cognitive harness and the open CLI framework can both evolve under user control.',
            'is-medium', 'I90-A10'));
    }

    function installTeamHarnesses() {
        var opening = document.querySelector('.project-opening');
        after(opening, makeFigure('/assets/images/story/team-harnesses-shared-office-hybrid-v2.jpg',
            'Several team members each use a local CLI agent while all connect to one private shared repository and dashboard; personal context remains near each member.',
            'Many local agents, one team-owned substrate. The dashboard and terminals are different doors into the same shared cortex.',
            'is-wide', 'I50-A50'));
    }

    function installFamilyGames() {
        var existing = document.querySelector('.family-hero-figure');
        if (existing) {
            existing.classList.add('blog-image');
            existing.setAttribute('data-visual-style', 'I10-A90');
            existing.setAttribute('data-information-weight', '10');
            existing.setAttribute('data-artistic-weight', '90');
            existing.setAttribute('data-visual-role', 'storytelling');
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
                'is-wide', 'I10-A90'));
        }
    }

    function installPortfolio() {
        var thesis = sectionByHeading('The LLM Is the Engine');
        after(thesis, makeFigure('/assets/images/story/portfolio-human-digital-cortex-hybrid-v2.jpg',
            'A chalkboard cycle where human ideas and judgment enter the digital cortex as jobs and behaviors, execution happens there, results return to the human, and learning improves the harness.',
            'The human steers; the cortex carries execution, state, memory, and repeatable cognition; the results come back for judgment.',
            'is-wide', 'I50-A50'));
        var upward = sectionByHeading('When Execution Moves Outward');
        after(upward, makeFigure('/assets/images/story/portfolio-execution-ladder-hybrid-v3.jpg',
            'A chalk illustration shows repeatable tasks and methods moving into a user-owned harness while a human climbs toward comparison, judgment, improvement, and creating new context.',
            'Known execution moves into the harness; human attention moves toward judgment, comparison, and invention.',
            'is-wide', 'I70-A30'));
    }

    function installBlogIndex() {
        var header = document.querySelector('.blog-index-header');
        after(header, makeFigure('/assets/images/story/blog-learning-journey-hybrid-v3.jpg',
            'An illustrated chalk path moves through five learning environments: engine versus agent, digital cortex, organs and phases, jobs memory and plugins, then operator ownership.',
            'The essays are one guided journey—from separating engine and agent to understanding the cortex and ultimately building a harness you own.',
            'is-wide', 'I70-A30'));
    }

    function run() {
        loadStyles();
        var path = window.location.pathname.replace(/\/+$/, '') || '/';
        if (path === '/' || path === '/index.html') return installHome();
        if (path === '/content.html') return installBlogIndex();
        if (path === '/start-here.html') return installStartHere();
        if (path === '/agents.html') return installAgents();
        if (path === '/projects' || path === '/projects/index.html') return installProjectsIndex();
        if (path === '/projects/seed-agent.html') return installSeedAgent();
        if (path === '/projects/q-seed.html') return installQSeed();
        if (path === '/projects/team-harnesses.html') return installTeamHarnesses();
        if (path === '/projects/family-games.html') return installFamilyGames();
        if (path === '/portfolio.html') return installPortfolio();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
