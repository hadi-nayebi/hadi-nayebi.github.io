// Version: v0.4.5
/**
 * Hadosh Academy theme + lightweight shared presentation behavior.
 * The homepage keeps its institutional framing stable while the visual theme,
 * profile image, and wheel emphasis can vary on refresh.
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

// The homepage's organizing promise is deliberate public positioning, not rotating copy.
const homepageHero = {
    line1: 'Understand It.',
    line2: 'Build It. Live Through It.',
    description: 'Learn what Agentic AI is made of. Build with open primitives. Turn those ideas into user-owned projects and a harness that grows around your work—visible, changeable, and yours to keep.'
};

function applyHomepageHero() {
    const h1 = document.querySelector('.central-circle-content h1');
    const desc = document.querySelector('.central-circle-content .hero-description');
    if (!h1 || !desc) return;
    h1.innerHTML = homepageHero.line1 + ' <br><span>' + homepageHero.line2 + '</span>';
    desc.textContent = homepageHero.description;
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
applyHomepageHero();
ensureCoreNavigation();
loadStoryVisuals();

const ctaPhrases = [
    { text: 'Start Here', link: '/start-here.html' },
    { text: 'Explore the Projects', link: '/projects/index.html' },
    { text: 'Explore Academy Content', link: '/content.html' },
    { text: 'Explore Seed Architecture', link: '/agents.html' },
    { text: 'Open the Technical Portfolio', link: '/portfolio.html' },
    { text: 'Explore Interactive Diagrams', link: '/explore.html' },
    { text: 'About Hadosh Academy', link: '/about.html' },
    { text: 'Get in Touch', link: '/contact.html' }
];

window.getRandomCTAPhrases = function (count = 3) {
    const shuffled = [...ctaPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
