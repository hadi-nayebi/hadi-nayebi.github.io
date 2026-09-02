// Version: v0.4.3
/**
 * Hadosh Academy theme + lightweight shared presentation behavior.
 * The homepage intentionally changes on refresh: visual theme, hero language,
 * profile image, and wheel emphasis vary while the underlying mission stays stable.
 */

const themes = [
    { name: 'purple', primary: '#6366f1', primaryGlow: 'rgba(99, 102, 241, 0.4)', accent: '#8b5cf6' },
    { name: 'green', primary: '#10b981', primaryGlow: 'rgba(16, 185, 129, 0.4)', accent: '#34d399' },
    { name: 'yellow', primary: '#eab308', primaryGlow: 'rgba(234, 179, 8, 0.4)', accent: '#facc15' },
    { name: 'orange', primary: '#f97316', primaryGlow: 'rgba(249, 115, 22, 0.4)', accent: '#fb923c' },
    { name: 'blue', primary: '#3b82f6', primaryGlow: 'rgba(59, 130, 246, 0.4)', accent: '#60a5fa' },
    { name: 'cyan', primary: '#06b6d4', primaryGlow: 'rgba(6, 182, 212, 0.4)', accent: '#22d3ee' },
    { name: 'rose', primary: '#e11d48', primaryGlow: 'rgba(225, 29, 72, 0.38)', accent: '#fb7185' },
    { name: 'lime', primary: '#65a30d', primaryGlow: 'rgba(101, 163, 13, 0.38)', accent: '#a3e635' }
];

const themeManagerScript = document.currentScript;

const profilePics = ['assets/images/profile-pic1.png', 'assets/images/profile-pic2.png'];

function getSitePrefix() {
    return window.location.pathname.indexOf('/projects/') !== -1 || window.location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
}

function applyRandomTheme() {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const root = document.documentElement;
    root.style.setProperty('--primary', randomTheme.primary);
    root.style.setProperty('--primary-glow', randomTheme.primaryGlow);
    root.style.setProperty('--accent', randomTheme.accent);

    const profileImg = document.getElementById('profile-image');
    if (profileImg) {
        const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];
        profileImg.src = getSitePrefix() + randomPic;
    }
}

// Each refresh can tell the same mission from a different angle.
const heroMessages = [
    {
        line1: 'Engineer Agents,',
        line2: 'Not Chatbots',
        description: 'Build and understand user-owned harnesses that give LLMs persistent memory, jobs, behavior, and experience.'
    },
    {
        line1: 'Own the Harness,',
        line2: 'Change the Model',
        description: 'Explore a portable cognition layer that can outlive one model session, provider, or CLI runtime.'
    },
    {
        line1: 'Build a Digital Cortex',
        line2: 'You Can Inspect',
        description: 'Learn how jobs, memory, plugins, phases, authority, and verification turn general models into durable agent systems.'
    },
    {
        line1: 'Open Architecture,',
        line2: 'Real Experiments',
        description: 'Follow public Seed implementations and shared-cognition projects while the architecture is developed in the open.'
    },
    {
        line1: 'Your AI Can Change.',
        line2: 'Your Cortex Can Stay.',
        description: 'Keep the durable personalization layer in files and structures you can inspect, version, move, and keep evolving.'
    },
    {
        line1: 'Turn General Intelligence',
        line2: 'Into Your System',
        description: 'Use an LLM as the engine while your own harness carries the memory, behavior, authority, and working methods.'
    },
    {
        line1: 'Teach the Harness',
        line2: 'How You Work',
        description: 'Externalize repeatable judgment into jobs, plugins, phases, memory, and interfaces that improve through use.'
    },
    {
        line1: 'Build Once.',
        line2: 'Keep the Cognition.',
        description: 'Let the model provider change while the architecture you cultivated around your work remains your asset.'
    },
    {
        line1: 'From Empty CLI',
        line2: 'To Personal Cortex',
        description: 'Start with Codex, Claude Code, OpenCode, Qwen Code, or another CLI agent and grow the harness around your work.'
    },
    {
        line1: 'Make Agent Behavior',
        line2: 'Inspectable',
        description: 'Move important cognition out of invisible prompt residue and into durable jobs, state, interfaces, rules, and tests.'
    },
    {
        line1: 'Learn the Architecture.',
        line2: 'Let the Agent Build It.',
        description: 'Use a small shared vocabulary to guide your CLI agent while the implementation burden stays increasingly machine-side.'
    },
    {
        line1: 'One Harness Idea,',
        line2: 'Many Human Scales',
        description: 'Explore personal Seeds, team cortices, family worlds, and collective systems built around user-owned cognition.'
    }
];

function applyRandomHero() {
    const h1 = document.querySelector('.central-circle-content h1');
    const desc = document.querySelector('.central-circle-content .hero-description');
    if (!h1 || !desc) return;
    const msg = heroMessages[Math.floor(Math.random() * heroMessages.length)];
    h1.innerHTML = msg.line1 + ' <br><span>' + msg.line2 + '</span>';
    desc.textContent = msg.description;
}

function ensureCoreNavigation() {
    const nav = document.querySelector('#site-header .nav-links');
    if (!nav) return;
    const prefix = getSitePrefix();
    const links = Array.from(nav.querySelectorAll('a'));
    const labels = links.map(link => link.textContent.trim());

    if (labels.indexOf('Projects') === -1) {
        const projects = document.createElement('a');
        projects.href = prefix + 'projects/index.html';
        projects.textContent = 'Projects';
        const about = links.find(link => link.textContent.trim() === 'About');
        nav.insertBefore(projects, about || null);
    }

    if (labels.indexOf('Contact') === -1) {
        const contact = document.createElement('a');
        contact.href = prefix + 'contact.html';
        contact.textContent = 'Contact';
        nav.appendChild(contact);
    }
}

function loadStoryVisuals() {
    if (document.querySelector('script[data-story-visuals]')) return;
    const script = document.createElement('script');
    const managerUrl = themeManagerScript ? new URL(themeManagerScript.src, window.location.href) : null;
    const version = managerUrl ? managerUrl.searchParams.get('v') : null;
    script.src = '/js/story-visuals.js?v=' + encodeURIComponent(version || '20260902-r1');
    script.async = false;
    script.setAttribute('data-story-visuals', 'true');
    document.head.appendChild(script);
}

applyRandomTheme();
applyRandomHero();
ensureCoreNavigation();
loadStoryVisuals();

const ctaPhrases = [
    { text: 'Start Here', link: '/start-here.html' },
    { text: 'Explore the Projects', link: '/projects/index.html' },
    { text: 'Read the Technical Writing', link: '/blog.html' },
    { text: 'See the Seed Implementations', link: '/agents.html' },
    { text: 'Open the Technical Portfolio', link: '/portfolio.html' },
    { text: 'Explore Interactive Diagrams', link: '/explore.html' },
    { text: 'About Hadosh Academy', link: '/about.html' },
    { text: 'Get in Touch', link: '/contact.html' }
];

window.getRandomCTAPhrases = function (count = 3) {
    const shuffled = [...ctaPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
