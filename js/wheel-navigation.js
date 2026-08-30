// Version: v1.0.0
// Keeps the original rotating wheel interaction while making every visible keyword
// a current, meaningful navigation entry point into the Hadosh Academy site.
(function () {
    'use strict';

    var destinations = {
        'LLMs Are Not the Agents': ['/blog/b1/01-llms-are-not-the-agents.html'],
        'We Could Have Had AGI By Now': ['/blog/b2/02-we-could-have-had-agi.html'],
        'Your Brain Was Never Built for This': ['/blog/b3/03-your-brain-was-never-built-for-this.html'],
        'The Folder Is Alive': ['/blog/b3/03_1-the-folder-is-alive.html'],
        'The Language of Agents': ['/blog/b4/04-the-language-of-agents.html'],

        'The Engine Is Not the Agent': ['/blog/b1/01-llms-are-not-the-agents.html'],
        'Your Agent Lives in Files': ['/blog/b1/01-llms-are-not-the-agents.html'],
        'From Chatbots to Colleagues': ['/blog/b1/01-llms-are-not-the-agents.html'],
        'Build the Toaster': ['/blog/b1/01-llms-are-not-the-agents.html'],

        'Structure Over Scale': ['/blog/b2/02-we-could-have-had-agi.html'],
        'Agents Are Complex Systems': ['/blog/b2/02-we-could-have-had-agi.html'],
        'Building Cognitive Architectures': ['/portfolio.html#architecture'],
        'The Seed Agent Pattern': ['/agents.html'],

        'Your Biology Has Limits': ['/blog/b3/03-your-brain-was-never-built-for-this.html'],
        'The Digital Cortex': ['/portfolio.html'],
        'Scaling Cognitive Labor': ['/portfolio.html'],
        'Cognitive Load Is Real': ['/blog/b3/03-your-brain-was-never-built-for-this.html'],

        'A Folder Full of Specialists': ['/blog/b3/03_1-the-folder-is-alive.html'],
        'Cognitive Metabolism': ['/blog/b3/03_1-the-folder-is-alive.html'],
        'Your Personal Cognitive Workforce': ['/blog/b3/03_1-the-folder-is-alive.html', 'Personal Digital Cortex'],
        'Your Liver, But for Paperwork': ['/blog/b3/03_1-the-folder-is-alive.html'],
        'Plant the Seed': ['/start-here.html#start-with-your-cli'],

        'Hooks, Skills, and Plugins': ['/blog/b4/04-the-language-of-agents.html'],
        'Beyond the Context Window': ['/blog/b6/06_10b-long-horizon-memory.html'],
        'From Prompts to Context Engineering': ['/blog/b4/04-the-language-of-agents.html'],
        'The Rise of the MCP': ['/blog/b4/04-the-language-of-agents.html'],

        'Meet the Seed Agent': ['/projects/seed-agent.html'],
        'Engineer Agents, Not Chatbots': ['/start-here.html'],
        'Private Seed. Public Q-Seed Build.': ['/agents.html', 'Reference Seed, Public Generations'],
        'One Mind, Many Domains': ['/portfolio.html'],

        'Every Agent Needs a Skeleton': ['/blog/b7/07_2-skeleton-claudemd-hooks-scripts.html'],
        'The OPEVC Loop': ['/blog/b6/06_1-phasic-foundation.html'],
        'Why Agents Need Intentions': ['/blog/b5/05_4-job-core.html'],
        'Memory Is Not Just Storage': ['/blog/b6/06_10b-long-horizon-memory.html'],
        'The Agent Operating System': ['/blog/b5/05_1-the-two-layer-foundation.html', 'The Always-On Digital Cortex'],
        'The Human-in-the-Loop Pattern': ['/portfolio.html'],
        'Vertical AI Agents': ['/projects/team-harnesses.html', 'Shared Team Cognition'],
        'Democratizing Engineering': ['/start-here.html', 'Architectural Literacy'],
        'Natural Language Programming': ['/start-here.html#start-with-your-cli', 'Build Through Conversation'],

        'Want to Build Your Own Agent?': ['/start-here.html#start-with-your-cli', 'Start With Your CLI Agent'],
        'Meet the Agents': ['/agents.html', 'Seed Implementations'],
        'Who Is Behind Hadosh?': ['/about.html'],
        'Join Agent Engineers on Skool': ['/projects/index.html', 'Join the Project Discussions'],
        'Get in Touch': ['/contact.html'],
        'About the Academy': ['/about.html'],
        'See the Agent Catalog': ['/agents.html', 'Seed Implementations'],
        'Support the Public Build': ['/support.html', 'Support the Open Work'],

        'Start Here': ['/start-here.html'],
        'Explore the Projects': ['/projects/index.html'],
        'Read the Technical Writing': ['/blog.html'],
        'See the Seed Implementations': ['/agents.html'],
        'Open the Technical Portfolio': ['/portfolio.html'],
        'Explore Interactive Diagrams': ['/explore.html'],
        'About Hadosh Academy': ['/about.html']
    };

    function normalize(anchor) {
        var entry = destinations[anchor.textContent.trim()];
        if (!entry) return;
        anchor.href = entry[0];
        if (entry[1]) anchor.textContent = entry[1];
        anchor.removeAttribute('target');
        anchor.removeAttribute('rel');
        anchor.setAttribute('aria-label', anchor.textContent.trim() + ' — open related Hadosh Academy page');
    }

    function updateWheel() {
        document.querySelectorAll('#orbitRing a.orbit-text').forEach(normalize);
    }

    var ring = document.getElementById('orbitRing');
    if (!ring) return;
    updateWheel();
    new MutationObserver(updateWheel).observe(ring, { childList: true, subtree: true });
})();
