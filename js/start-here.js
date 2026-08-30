// Start Here profession lenses.
// The common harness model stays stable; this file changes examples, priorities,
// and recommended reading so visitors can see the architecture through their work.

(function () {
    'use strict';

    const roles = {
        general: {
            eyebrow: 'Any profession',
            title: 'Start with the judgment you repeat most often.',
            intro: 'A useful harness grows out of work you already understand. Look for repeated context, repeated decisions, repeated checks, and repeated handoffs. Those are the places where a CLI agent can begin carrying more of the structure around your work.',
            carry: [
                'Long-running jobs and the context needed to resume them',
                'Reusable working methods and decision criteria',
                'Quality checks, verification rules, and escalation points',
                'Persistent project knowledge and interaction history'
            ],
            behaviors: [
                'A consistency check you currently perform manually',
                'A repeated research or information-gathering routine',
                'A job template that should survive across sessions',
                'A verification step that should happen before work is considered complete'
            ],
            judgment: [
                'Defining what good work means in your domain',
                'Approving consequential decisions and exceptions',
                'Changing the harness when the old method no longer fits',
                'Deciding which repeated behavior deserves to become more automatic'
            ],
            links: [
                ['LLMs Are Not the Agents', '/blog/b1/01-llms-are-not-the-agents.html'],
                ['The Language of Agents', '/blog/b4/04-the-language-of-agents.html'],
                ['Seed Agent — Codex', '/projects/seed-agent.html']
            ],
            prompt: 'Read https://hadi-nayebi.github.io/start-here.html and the linked Hadosh Academy material. Learn how jobs, plugins, phases, memory, authority, and verification are used. Then study this project and identify one repeated behavior worth externalizing. Explain it in plain language first, map it to the harness vocabulary second, and only then propose the smallest useful implementation.'
        },
        lawyer: {
            eyebrow: 'Legal work',
            title: 'Turn matter context and repeated legal working methods into durable structure.',
            intro: 'Legal work accumulates context across matters, documents, deadlines, research, drafting, client communication, and review. A harness can keep those layers organized around each job while making your own standards for evidence, citation, drafting, and escalation explicit.',
            carry: [
                'Matter-specific context, chronology, documents, and unresolved questions',
                'Research standards, citation expectations, and source provenance',
                'Client onboarding information and recurring communication patterns',
                'Drafting conventions, review checklists, deadlines, and approval points'
            ],
            behaviors: [
                'Check a draft for missing citations, unsupported claims, or inconsistent defined terms',
                'Maintain a matter chronology as new documents and interactions arrive',
                'Standardize client onboarding and the questions that must be answered before work begins',
                'Turn a recurring case-research method into a reusable job or plugin'
            ],
            judgment: [
                'Legal strategy and interpretation',
                'Client advice and consequential decisions',
                'Privilege, confidentiality, and what information can enter a shared context',
                'Exceptions where the standard workflow should deliberately be broken'
            ],
            links: [
                ['The Language of Agents', '/blog/b4/04-the-language-of-agents.html'],
                ['Persistent Jobs', '/blog/b5/05_4-job-core.html'],
                ['Verification', '/blog/b6/06_6-verify.html'],
                ['Plugin Kit', '/blog/b7/07_1-plugin-kit-foundation.html']
            ],
            prompt: 'Use Hadosh Academy as a design reference for a legal-work harness. Study the project files and identify one repeated legal working method I already perform—such as matter chronology, research review, client onboarding, drafting consistency, or evidence checking. Teach me how jobs, memory, plugins, phases, authority, and verification would apply. Keep legal judgment and consequential client decisions with me. Propose the architecture before touching files.'
        },
        researcher: {
            eyebrow: 'Research work',
            title: 'Make the research process persistent, comparable, and easier to audit.',
            intro: 'Research rarely happens in one session. Questions evolve, sources accumulate, competing explanations emerge, and earlier assumptions need to be revisited. A harness can make that process durable so the agent carries the state of inquiry rather than repeatedly starting from a blank prompt.',
            carry: [
                'Research questions, subquestions, hypotheses, and unresolved contradictions',
                'Source provenance, notes, evidence quality, and citation trails',
                'Search strategies and the criteria used to include or reject evidence',
                'Comparative analyses that need to be updated as new information arrives'
            ],
            behaviors: [
                'Maintain a source ledger with claims, evidence, and uncertainty',
                'Run several analytical lenses over the same evidence and compare their conclusions',
                'Keep a long-running literature or market-research job current over time',
                'Verify that a synthesis distinguishes evidence from inference'
            ],
            judgment: [
                'Choosing the important research question',
                'Deciding what counts as persuasive evidence',
                'Interpreting conflicting findings',
                'Recognizing when the method itself needs to change'
            ],
            links: [
                ['Your Brain Was Never Built for This', '/blog/b3/03-your-brain-was-never-built-for-this.html'],
                ['Long-Horizon Memory', '/blog/b6/06_10b-long-horizon-memory.html'],
                ['Verify', '/blog/b6/06_6-verify.html'],
                ['Technical Portfolio', '/portfolio.html']
            ],
            prompt: 'Use the Hadosh Academy material to help me build a research harness around this project. First map my current research process: questions, sources, evidence standards, synthesis, verification, and unresolved uncertainty. Then identify one behavior that should become durable—for example source provenance, research-plan state, claim/evidence checking, or recurring synthesis. Explain the architecture and acceptance criteria before implementing it.'
        },
        scientist: {
            eyebrow: 'Scientific work',
            title: 'Let the harness carry experimental memory while you keep scientific judgment.',
            intro: 'Scientific work moves between literature, hypotheses, protocols, experiments, data, interpretation, and new questions. A harness can make those transitions explicit and persistent, preserving why a decision was made and what evidence should be checked before the next step.',
            carry: [
                'Hypotheses, experimental plans, protocol versions, and assumptions',
                'Literature context and evidence linked to experimental decisions',
                'Results, anomalies, negative findings, and unresolved interpretation',
                'Quality-control checks and the reasoning behind protocol changes'
            ],
            behaviors: [
                'Keep an experiment plan synchronized with new evidence and results',
                'Check whether conclusions are supported by the recorded observations',
                'Track protocol changes and why each change was introduced',
                'Generate the next literature or analysis job from an unresolved experimental question'
            ],
            judgment: [
                'Forming meaningful hypotheses',
                'Choosing experimental controls and acceptable evidence',
                'Interpreting ambiguous or contradictory results',
                'Deciding when a result changes the scientific model rather than only the procedure'
            ],
            links: [
                ['Observe', '/blog/b6/06_3-observe.html'],
                ['Plan', '/blog/b6/06_4-plan.html'],
                ['Verify', '/blog/b6/06_6-verify.html'],
                ['Condense', '/blog/b6/06_7-condense.html']
            ],
            prompt: 'Study Hadosh Academy and use its harness vocabulary to examine this scientific project. Map the current cycle from literature and hypothesis to plan, execution, verification, and learning. Identify one repeated scientific behavior that should become persistent—such as protocol-state tracking, evidence checks, experiment planning, or result-to-next-question handoff. Keep scientific interpretation and consequential experimental decisions with me. Propose before implementing.'
        },
        pm: {
            eyebrow: 'Project management',
            title: 'Turn the project itself into a persistent cognitive workspace.',
            intro: 'A project manager already thinks in jobs, dependencies, state, risk, handoffs, decisions, and completion criteria. Harness concepts map naturally onto that work. The opportunity is to make the project state legible to both humans and agents instead of leaving it fragmented across meetings, chats, and task tools.',
            carry: [
                'Goals, milestones, dependencies, risks, decisions, and unresolved blockers',
                'Meeting context and the actions that should survive the meeting',
                'Ownership, approval boundaries, and project-specific definitions of done',
                'Reusable operating methods for planning, review, reporting, and handoff'
            ],
            behaviors: [
                'Convert meeting outcomes into durable jobs and decision records',
                'Track dependencies and surface blockers before work silently stalls',
                'Maintain a project dashboard over the same repository the agents use',
                'Verify completion against explicit acceptance criteria before closing work'
            ],
            judgment: [
                'Priority tradeoffs and sequencing',
                'Stakeholder alignment and organizational context',
                'Risk acceptance and escalation',
                'Changing the operating model when the project changes shape'
            ],
            links: [
                ['Persistent Jobs', '/blog/b5/05_4-job-core.html'],
                ['Plan State Machine', '/blog/b6/06_10-plan-state-machine.html'],
                ['Team Harnesses', '/projects/team-harnesses.html'],
                ['Long-Horizon Memory', '/blog/b6/06_10b-long-horizon-memory.html']
            ],
            prompt: 'Use Hadosh Academy to help turn this project repository into a persistent project-management harness. Study the current files, meetings, plans, dependencies, decisions, and handoffs. Identify one behavior that should become durable—such as meeting-to-job capture, dependency tracking, completion verification, or a shared dashboard surface. Explain how it maps to jobs, memory, plugins, phases, authority, and verification before implementation.'
        },
        founder: {
            eyebrow: 'Founder / CEO',
            title: 'Give the company a memory and operating cortex that grows with it.',
            intro: 'Founders continuously move between product, market, hiring, customers, fundraising, operations, and strategy. A harness can preserve the decisions and working methods that connect those domains so important company context does not disappear into individual chats or one person’s memory.',
            carry: [
                'Company context, strategic decisions, assumptions, and unresolved questions',
                'Market, customer, competitor, hiring, and vendor research jobs',
                'Decision records and the evidence or constraints behind them',
                'Operating methods that should become repeatable as the team grows'
            ],
            behaviors: [
                'Maintain a living market or customer-research job',
                'Capture decisions together with assumptions and later evidence',
                'Turn recurring founder reviews into reusable analytical plugins or jobs',
                'Build a shared dashboard that exposes the company state without exposing the whole harness internals'
            ],
            judgment: [
                'Company direction and risk appetite',
                'Hiring, capital, and consequential resource allocation',
                'When a repeated method should become company-wide policy',
                'Which context belongs to the company versus an individual member'
            ],
            links: [
                ['Team Harnesses', '/projects/team-harnesses.html'],
                ['Persistent Jobs', '/blog/b5/05_4-job-core.html'],
                ['Plugin Kit', '/blog/b7/07_1-plugin-kit-foundation.html'],
                ['Technical Portfolio', '/portfolio.html']
            ],
            prompt: 'Use Hadosh Academy as a design reference for a founder/company harness. Study this repository and identify the company context, recurring decisions, research loops, and operating methods that are repeatedly reconstructed. Choose one high-value behavior to externalize first. Explain what should be shared, what should remain member-local, which authority belongs to me or the team, and how the behavior should be verified before implementation.'
        },
        consultant: {
            eyebrow: 'Consulting and analysis',
            title: 'Make your analytical methods reusable without flattening client context.',
            intro: 'Consulting work often repeats a method across very different clients. A harness can separate the reusable analytical behavior from the client-specific evidence, decisions, and deliverables, allowing the method to improve while each engagement keeps its own context.',
            carry: [
                'Client objectives, constraints, source material, decisions, and deliverable state',
                'Reusable research and analysis methods that should work across engagements',
                'Quality checks for evidence, logic, assumptions, and presentation',
                'Lessons that should improve the method after an engagement closes'
            ],
            behaviors: [
                'Run a consistent research or due-diligence method on new client evidence',
                'Check a deliverable for unsupported conclusions and missing assumptions',
                'Maintain separate client jobs while reusing the same analytical plugin',
                'Condense useful engagement lessons into the reusable method without mixing client data'
            ],
            judgment: [
                'Framing the actual client problem',
                'Choosing the analytical lens and interpreting tradeoffs',
                'Deciding which lessons generalize beyond one engagement',
                'Client-facing recommendations and relationship decisions'
            ],
            links: [
                ['Plugin Kit', '/blog/b7/07_1-plugin-kit-foundation.html'],
                ['Condense', '/blog/b6/06_7-condense.html'],
                ['Safe Self-Modification', '/blog/b8/08_8-safe-self-modification.html'],
                ['Seed Agent — Codex', '/projects/seed-agent.html']
            ],
            prompt: 'Use Hadosh Academy to help me separate reusable consulting cognition from client-specific context. Study this project and identify one repeated analytical method that appears across engagements. Map its objective, inputs, state, interfaces, verification, and what must remain client-local. Propose a small reusable harness behavior or job pattern before changing files.'
        },
        creator: {
            eyebrow: 'Creative and media work',
            title: 'Let the harness carry production memory so creative judgment can stay human.',
            intro: 'Creative work has structure even when the output should not feel formulaic. Research, story development, assets, drafts, feedback, production stages, publishing, and audience learning can all persist in the harness while taste and final editorial judgment stay with the creator.',
            carry: [
                'Research, references, source material, story ideas, drafts, and asset state',
                'Editorial decisions and the reasons behind major changes',
                'Production stages, review loops, publishing tasks, and recurring checklists',
                'Audience feedback that should inform later work without dictating it'
            ],
            behaviors: [
                'Turn research notes into a persistent story-development job',
                'Track a video or article from concept through review and publication',
                'Maintain asset organization and production-state checks',
                'Create an editorial verification pass for factual claims, continuity, or source use'
            ],
            judgment: [
                'Taste, voice, story, and what is worth making',
                'Which feedback should influence the work',
                'When a recurring production rule helps versus constrains creativity',
                'Final editorial and publishing decisions'
            ],
            links: [
                ['Your Brain Was Never Built for This', '/blog/b3/03-your-brain-was-never-built-for-this.html'],
                ['The Folder Is Alive', '/blog/b3/03_1-the-folder-is-alive.html'],
                ['Crime Cartography', '/projects/crime-cartography.html'],
                ['Family Games', '/projects/family-games.html']
            ],
            prompt: 'Use Hadosh Academy to help me build a creator/media harness around this project. Study the current research, drafts, assets, feedback, production stages, and publishing flow. Identify one repeated behavior worth externalizing while keeping taste and final editorial judgment with me. Explain the job, memory, plugin, phase, and verification design first, then propose the smallest useful implementation.'
        }
    };

    const tabs = Array.from(document.querySelectorAll('.start-role-tab'));
    const panel = document.getElementById('start-role-panel');
    if (!tabs.length || !panel) return;

    const query = selector => panel.querySelector(selector);

    function renderList(target, items) {
        target.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            target.appendChild(li);
        });
    }

    function renderLinks(target, links) {
        target.innerHTML = '';
        links.forEach(([label, href]) => {
            const a = document.createElement('a');
            a.href = href;
            a.className = 'card-link';
            a.textContent = label + ' →';
            target.appendChild(a);
        });
    }

    function selectRole(roleName, updateHash) {
        const role = roles[roleName] || roles.general;
        tabs.forEach(tab => {
            const active = tab.dataset.role === roleName;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });

        query('[data-role-eyebrow]').textContent = role.eyebrow;
        query('[data-role-title]').textContent = role.title;
        query('[data-role-intro]').textContent = role.intro;
        renderList(query('[data-role-carry]'), role.carry);
        renderList(query('[data-role-behaviors]'), role.behaviors);
        renderList(query('[data-role-judgment]'), role.judgment);
        renderLinks(query('[data-role-links]'), role.links);
        query('[data-role-prompt]').textContent = role.prompt;
        query('[data-role-prompt-label]').textContent = roleName === 'general' ? 'Prompt for your CLI agent' : role.eyebrow + ' starter prompt';

        if (updateHash && history.replaceState) history.replaceState(null, '', '#role-' + roleName);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectRole(tab.dataset.role, true));
        tab.addEventListener('keydown', event => {
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = tabs.length - 1;
            tabs[nextIndex].focus();
            selectRole(tabs[nextIndex].dataset.role, true);
        });
    });

    document.querySelectorAll('.start-copy-button').forEach(button => {
        button.addEventListener('click', async () => {
            const target = document.getElementById(button.dataset.copyTarget);
            if (!target) return;
            try {
                await navigator.clipboard.writeText(target.textContent.trim());
                const original = button.textContent;
                button.textContent = 'Copied';
                setTimeout(() => { button.textContent = original; }, 1400);
            } catch (error) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(target);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    });

    const hashRole = window.location.hash.match(/^#role-([a-z]+)$/);
    selectRole(hashRole && roles[hashRole[1]] ? hashRole[1] : 'general', false);
})();
