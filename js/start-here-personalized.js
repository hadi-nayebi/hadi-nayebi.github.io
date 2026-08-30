// Version: v1.0.0
(function () {
    'use strict';

    var paths = {
        general: {
            label: 'General',
            eyebrow: 'Any profession',
            title: 'Start by teaching your CLI agent how Hadosh thinks about harnesses.',
            intro: 'You do not need to wait for a finished Seed to begin. If you already use a CLI agent, the website itself can be your design library. Let your agent study the public essays and project pages, translate the concepts into your own work, and then propose the first behaviors worth making durable.',
            opportunities: [
                'Turn repeated instructions into durable behaviors instead of re-prompting every session.',
                'Turn meaningful work into persistent jobs with objectives, state, history, and completion paths.',
                'Keep important memory, rules, and decisions outside one model session.',
                'Add verification and authority boundaries where mistakes or silent changes would matter.'
            ],
            firstBuilds: [
                'A job pattern for one recurring piece of work you already do.',
                'A memory rule for context your agent repeatedly needs.',
                'A bounded behavior that checks one important consistency before work is considered complete.'
            ],
            readings: [
                ['/blog/b1/01-llms-are-not-the-agents.html', 'Essay 1 — LLMs Are Not the Agents'],
                ['/blog/b4/04-the-language-of-agents.html', 'Essay 4 — The Language of Agents'],
                ['/projects/seed-agent.html', 'Seed Agent — Codex project'],
                ['/portfolio.html', 'Technical portfolio — harness abstractions']
            ],
            promptRole: 'my work'
        },
        lawyer: {
            label: 'Lawyer / Legal',
            eyebrow: 'Legal work',
            title: 'Build a legal working system that remembers your standards, not just your last prompt.',
            intro: 'A legal harness can make repeatable judgment visible and consistent across matters while keeping consequential decisions with the lawyer. The useful starting point is usually not a giant “legal AI.” It is a few bounded behaviors around the work you already repeat: case research, matter intake, evidence organization, client communication, drafting checks, and knowledge that should carry from one job to the next.',
            opportunities: [
                'Create durable matter or case jobs so research, decisions, open questions, and source history persist.',
                'Build consistency checks for citations, unsupported claims, deadlines, required sections, or house style.',
                'Structure client onboarding and recurring document-intake routines without losing human approval points.',
                'Maintain newsletter, case-law, or regulatory research as recurring jobs with explicit source and verification rules.'
            ],
            firstBuilds: [
                'A case-research job that records the question, sources, unresolved issues, and final attorney ruling.',
                'A pre-delivery review behavior that checks citations, evidence, and missing caveats.',
                'A client-onboarding workflow that knows what information to gather and when to ask the lawyer.'
            ],
            readings: [
                ['/blog/b4/04-the-language-of-agents.html', 'Essay 4 — vocabulary for controlling the harness'],
                ['/blog/b5/05_4-job-core.html', 'B5.4 — persistent jobs'],
                ['/blog/b6/06_6-verify.html', 'B6.6 — VERIFY'],
                ['/projects/seed-agent.html', 'Seed Agent — build the personal layer']
            ],
            promptRole: 'legal work'
        },
        scientist: {
            label: 'Scientist / Researcher',
            eyebrow: 'Research and science',
            title: 'Externalize the research process without externalizing scientific judgment.',
            intro: 'A research harness can preserve hypotheses, plans, evidence, literature context, failed paths, and verification across long projects. The point is not to automate science into one answer. It is to make the surrounding cognitive process durable enough that your agent can carry more of the search, organization, comparison, and execution while you stay responsible for scientific interpretation.',
            opportunities: [
                'Keep literature reviews as evolving jobs with source provenance, open questions, and contradiction tracking.',
                'Turn research plans into persistent state that can be revised as evidence changes.',
                'Separate observation, planning, execution, and verification so premature conclusions are easier to catch.',
                'Build recurring market, patent, or technical-landscape research with reusable comparison methods.'
            ],
            firstBuilds: [
                'A literature-review job that keeps claims linked to sources and tracks unresolved evidence.',
                'A research-plan behavior that records hypotheses, planned tests, expected evidence, and revision history.',
                'A verification behavior that forces the agent to distinguish observation, inference, and speculation.'
            ],
            readings: [
                ['/blog/b3/03-your-brain-was-never-built-for-this.html', 'Essay 3 — cognitive bandwidth'],
                ['/blog/b6/06_1-phasic-foundation.html', 'B6.1 — cognitive phases'],
                ['/blog/b6/06_6-verify.html', 'B6.6 — VERIFY'],
                ['/portfolio.html', 'Portfolio — worked research and patent examples']
            ],
            promptRole: 'scientific and research work'
        },
        founder: {
            label: 'Founder / CEO',
            eyebrow: 'Company building',
            title: 'Turn company context into an operating cortex instead of a pile of disconnected chats.',
            intro: 'A founder or CEO usually crosses markets, product, hiring, customers, fundraising, research, and operations in the same week. A harness can keep those threads durable and give different jobs their own state while still preserving the decisions and principles that belong at the company level.',
            opportunities: [
                'Maintain market and competitor research as recurring jobs rather than one-off searches.',
                'Keep decisions, assumptions, risks, and follow-ups visible across long-running company initiatives.',
                'Build a lightweight project or company dashboard on top of the same local harness when a visual surface helps.',
                'Create recurring review behaviors for claims, metrics, customer feedback, or strategic assumptions.'
            ],
            firstBuilds: [
                'A market-research job with repeatable comparison criteria and a record of what changed since the last pass.',
                'A decision-memory behavior that captures important rulings and the evidence behind them.',
                'A weekly operating review that pulls from active jobs and surfaces only decisions that need founder judgment.'
            ],
            readings: [
                ['/blog/b5/05_4-job-core.html', 'B5.4 — jobs as durable work'],
                ['/blog/b6/06_10b-long-horizon-memory.html', 'B6.10b — long-horizon memory'],
                ['/projects/team-harnesses.html', 'Team Harnesses — when the company becomes shared cognition'],
                ['/portfolio.html', 'Portfolio — higher-order cognitive work']
            ],
            promptRole: 'company-building and executive work'
        },
        pm: {
            label: 'Project Manager',
            eyebrow: 'Projects and coordination',
            title: 'Make project continuity part of the harness instead of reconstructing it from meetings.',
            intro: 'Project management is full of state that should survive people, meetings, and model sessions: decisions, dependencies, owners, risks, open questions, changed plans, and completion criteria. A harness can make those objects durable and let a dashboard become an optional visual surface over the same underlying state.',
            opportunities: [
                'Keep each meaningful initiative as a job with objective, status, dependencies, history, and completion evidence.',
                'Generate status views from durable project state rather than manually rewriting the same summary every week.',
                'Build review gates for handoffs, missing owners, unresolved blockers, and incomplete acceptance criteria.',
                'Use a local dashboard when the team benefits from a visual view over jobs, feedback, questions, and workflows.'
            ],
            firstBuilds: [
                'A project job schema for objective, owner, dependencies, current decision, and next review point.',
                'A weekly status synthesis that reads project state and asks only for missing human judgment.',
                'A completion check that distinguishes “work stopped” from “work actually met its criteria.”'
            ],
            readings: [
                ['/blog/b5/05_4-job-core.html', 'B5.4 — Job Core'],
                ['/blog/b6/06_2-discipline-and-map.html', 'B6.2 — discipline and phase map'],
                ['/projects/team-harnesses.html', 'Team Harnesses — shared dashboard and local agents'],
                ['/start-here.html#shared-concepts', 'Shared vocabulary on this page']
            ],
            promptRole: 'project-management work'
        },
        consultant: {
            label: 'Consultant / Analyst',
            eyebrow: 'Client and analytical work',
            title: 'Turn your repeatable analytical method into something your agent can execute and improve.',
            intro: 'Consulting and analytical work often has a hidden internal method: how you frame a question, gather evidence, compare alternatives, challenge weak assumptions, structure deliverables, and decide when the analysis is good enough. A harness gives those methods durable form while allowing each client job to keep its own context.',
            opportunities: [
                'Create reusable analysis behaviors while keeping client-specific evidence and decisions inside separate jobs.',
                'Build client-onboarding and discovery routines that collect context consistently.',
                'Run multiple analytical lenses in parallel and reserve synthesis or recommendation for human judgment.',
                'Add evidence, uncertainty, and deliverable-quality checks before work is presented.'
            ],
            firstBuilds: [
                'A repeatable research job with your preferred framing, source, comparison, and output structure.',
                'A client-intake behavior that identifies missing context before analysis begins.',
                'A pre-delivery review that checks evidence, assumptions, uncertainty, and required sections.'
            ],
            readings: [
                ['/portfolio.html#architecture', 'Portfolio — architectural literacy'],
                ['/blog/b6/06_4-plan.html', 'B6.4 — PLAN'],
                ['/blog/b6/06_6-verify.html', 'B6.6 — VERIFY'],
                ['/blog/b7/07_1-plugin-kit-foundation.html', 'B7.1 — reusable behavioral plugins']
            ],
            promptRole: 'consulting and analytical work'
        },
        creator: {
            label: 'Filmmaker / Creator',
            eyebrow: 'Creative production',
            title: 'Use the harness to preserve creative process, not to flatten creative judgment.',
            intro: 'A creative harness can carry research, story ideas, scripts, production state, editorial feedback, asset organization, and recurring publishing work without pretending that the system should make the final artistic choices. The useful behaviors are the ones that remove coordination and repetition so the creator has more attention for taste and direction.',
            opportunities: [
                'Keep each video, film, or content piece as a durable job from research through publishing.',
                'Capture story structure, references, feedback, unresolved creative choices, and production decisions in one place.',
                'Build recurring production checklists and handoff behaviors for research, scripting, assets, editing, and review.',
                'Maintain a publishing or channel workflow while keeping final editorial judgment human.'
            ],
            firstBuilds: [
                'A content job that persists research, story question, script state, assets, feedback, and next editorial decision.',
                'A review behavior that asks whether the opening, middle, ending, evidence, and intended audience are actually aligned.',
                'A recurring publishing workflow that tracks what is waiting on research, production, review, or release.'
            ],
            readings: [
                ['/blog/b3/03_1-the-folder-is-alive.html', 'Essay 3.1 — the folder as an active environment'],
                ['/blog/b5/05_4-job-core.html', 'B5.4 — persistent jobs'],
                ['/projects/crime-cartography.html', 'Crime Cartography — media production at collective scale'],
                ['/portfolio.html', 'Portfolio — human judgment and delegated execution']
            ],
            promptRole: 'creative and media-production work'
        },
        educator: {
            label: 'Educator / Journalist',
            eyebrow: 'Teaching, research, and publishing',
            title: 'Build a system that remembers sources, standards, audiences, and recurring editorial work.',
            intro: 'Teaching and journalism both combine research, audience judgment, source handling, recurring production, and feedback. A harness can keep those processes persistent and inspectable while leaving interpretation, pedagogy, editorial judgment, and publication authority with the person responsible for the work.',
            opportunities: [
                'Maintain source-backed research jobs with explicit provenance and unresolved questions.',
                'Build lesson, article, or series workflows that preserve audience, objective, structure, and revision history.',
                'Add source-verification and claim-checking behaviors before material is published or taught.',
                'Keep a recurring editorial or teaching calendar as durable jobs rather than disconnected reminders.'
            ],
            firstBuilds: [
                'A research job that keeps claims linked to sources and separates fact, interpretation, and open questions.',
                'A publication or lesson workflow with objective, audience, draft state, review, and completion criteria.',
                'A verification behavior for unsupported claims, missing sources, or material that needs human review.'
            ],
            readings: [
                ['/blog/b4/04-the-language-of-agents.html', 'Essay 4 — shared language'],
                ['/blog/b6/06_6-verify.html', 'B6.6 — VERIFY'],
                ['/projects/crime-cartography.html', 'Crime Cartography — distributed editorial judgment'],
                ['/projects/seed-agent.html', 'Seed Agent — personal harness architecture']
            ],
            promptRole: 'teaching, journalism, and publishing work'
        }
    };

    var tabs = document.querySelectorAll('[data-profession-tab]');
    var panel = document.getElementById('profession-panel');
    if (!tabs.length || !panel) return;

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
        });
    }

    function promptFor(path) {
        return 'Study https://hadi-nayebi.github.io/start-here.html and the relevant Hadosh Academy pages it links to. I use a CLI agent for ' + path.promptRole + '. First teach me the harness concepts in language related to my work. Then inspect this project directory and propose 2–3 small behaviors or persistent jobs that would improve how I work. For each proposal, state: the objective, what it needs to remember, when it should activate, what authority stays with me, and how we would verify that it works. Do not implement anything until I approve the architecture.';
    }

    function render(key, focus) {
        var path = paths[key] || paths.general;
        tabs.forEach(function (tab) {
            var selected = tab.getAttribute('data-profession-tab') === key;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });

        var opportunities = path.opportunities.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('');
        var builds = path.firstBuilds.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('');
        var readings = path.readings.map(function (item) {
            return '<a href="' + esc(item[0]) + '">' + esc(item[1]) + ' →</a>';
        }).join('');
        var prompt = promptFor(path);

        panel.innerHTML = '' +
            '<div class="profession-panel-hero">' +
                '<span class="badge">' + esc(path.eyebrow) + '</span>' +
                '<h2>' + esc(path.title) + '</h2>' +
                '<p>' + esc(path.intro) + '</p>' +
            '</div>' +
            '<div class="profession-grid">' +
                '<section class="profession-block"><h3>Where a harness can help</h3><ul>' + opportunities + '</ul></section>' +
                '<section class="profession-block"><h3>Good first behaviors to build</h3><ul>' + builds + '</ul></section>' +
                '<section class="profession-block"><h3>Suggested reading path</h3><div class="profession-reading">' + readings + '</div></section>' +
                '<section class="profession-block"><h3>Two ways to proceed</h3><p><strong>Build from scratch now:</strong> let your existing CLI agent study the site and build small behaviors with you.</p><p><strong>Start from a Seed:</strong> follow the public Codex and Qwen implementations and clone a mature base when that route fits your work.</p></section>' +
                '<section class="profession-block profession-agent-prompt"><h3>Give this to your CLI agent</h3><div class="start-prompt-box" data-profession-prompt>' + esc(prompt) + '</div><button type="button" class="btn btn-secondary start-copy-button" data-copy-profession>Copy instruction</button></section>' +
            '</div>';

        var copy = panel.querySelector('[data-copy-profession]');
        if (copy) {
            copy.addEventListener('click', function () {
                var text = panel.querySelector('[data-profession-prompt]').textContent;
                if (!navigator.clipboard) return;
                navigator.clipboard.writeText(text).then(function () {
                    copy.textContent = 'Copied';
                    window.setTimeout(function () { copy.textContent = 'Copy instruction'; }, 1600);
                });
            });
        }
        if (focus) panel.focus({ preventScroll: true });
        window.history.replaceState(null, '', key === 'general' ? '#choose-your-path' : '#path-' + key);
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { render(tab.getAttribute('data-profession-tab'), true); });
        tab.addEventListener('keydown', function (event) {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            var next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
            tabs[next].focus();
            render(tabs[next].getAttribute('data-profession-tab'), false);
        });
    });

    var cliCopy = document.querySelector('[data-copy-cli-prompt]');
    if (cliCopy) {
        cliCopy.addEventListener('click', function () {
            var box = document.querySelector('[data-cli-prompt]');
            if (!box || !navigator.clipboard) return;
            navigator.clipboard.writeText(box.textContent).then(function () {
                cliCopy.textContent = 'Copied';
                window.setTimeout(function () { cliCopy.textContent = 'Copy instruction'; }, 1600);
            });
        });
    }

    var hash = window.location.hash.replace('#path-', '');
    render(paths[hash] ? hash : 'general', false);
})();
