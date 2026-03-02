// Version: v0.2.0
/**
 * Hadosh Academy Theme Manager
 * Handles random color themes, profile picture selection, and hero message rotation.
 */

const themes = [
    {
        name: 'purple',
        primary: '#6366f1', // Indigo 500
        primaryGlow: 'rgba(99, 102, 241, 0.4)',
        accent: '#8b5cf6'   // Violet 500
    },
    {
        name: 'green',
        primary: '#10b981', // Emerald 500
        primaryGlow: 'rgba(16, 185, 129, 0.4)',
        accent: '#34d399'   // Emerald 400
    },
    {
        name: 'yellow',
        primary: '#eab308', // Yellow 500
        primaryGlow: 'rgba(234, 179, 8, 0.4)',
        accent: '#facc15'   // Yellow 400
    },
    {
        name: 'orange',
        primary: '#f97316', // Orange 500
        primaryGlow: 'rgba(249, 115, 22, 0.4)',
        accent: '#fb923c'   // Orange 400
    },
    {
        name: 'blue',
        primary: '#3b82f6', // Blue 500
        primaryGlow: 'rgba(59, 130, 246, 0.4)',
        accent: '#60a5fa'   // Blue 400
    }
];

const profilePics = [
    'assets/images/profile-pic1.png',
    'assets/images/profile-pic2.png'
];

function applyRandomTheme() {
    // 1. Select Random Theme
    // Use session storage to persist theme across navigation if desired, 
    // but user asked for "randomly choose one... overtime I want to see which fits better", 
    // implying potentially different on reload. 
    // "randomly choose one at every visit" -> usually means per session or per load.
    // Let's do per load for now as requested.

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const root = document.documentElement;

    root.style.setProperty('--primary', randomTheme.primary);
    root.style.setProperty('--primary-glow', randomTheme.primaryGlow);
    root.style.setProperty('--accent', randomTheme.accent);

    // 2. Select Random Profile Pic (Only if element exists)
    const profileImg = document.getElementById('profile-image');
    if (profileImg) {
        const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];
        profileImg.src = randomPic;
    }
}

// 2b. Hero Message Rotation
const heroMessages = [
    {
        line1: "Engineer Agents,",
        line2: "Not Chatbots",
        description: "Customize reliable seed agents through conversation. Scale your professional skills with a personalized agentic workforce."
    },
    {
        line1: "Your Brain Needs",
        line2: "A Few More Organs",
        description: "CLI agents are digital cognitive organs — memory, reflexes, and skills your organic brain was never built to handle alone."
    },
    {
        line1: "The Architecture",
        line2: "Is the Agent",
        description: "The model is the engine, not the agent. The filesystem — memory, hooks, skills — is what makes it yours."
    },
    {
        line1: "Grow Your",
        line2: "Digital Cortex",
        description: "Build cognitive organs that persist, learn, and compound — session after session, project after project."
    },
    {
        line1: "Scale Yourself,",
        line2: "Not Your Hours",
        description: "From a job to micro-businesses — each one managed by cognitive organs you designed, powered by your judgment and taste."
    }
];

function applyRandomHero() {
    const h1 = document.querySelector('.central-circle-content h1');
    const desc = document.querySelector('.hero-description');
    if (!h1 || !desc) return;

    const msg = heroMessages[Math.floor(Math.random() * heroMessages.length)];
    h1.innerHTML = msg.line1 + ' <br><span>' + msg.line2 + '</span>';
    desc.textContent = msg.description;
}

// Apply immediately (script loads after hero HTML, so DOM is ready)
applyRandomTheme();
applyRandomHero();

// 3. Landing Page Dynamic CTAs
// Inject random actionable phrases into the wheel
const ctaPhrases = [
    { text: "Join the Community", link: "https://www.skool.com/claude-agents-engineering-4513" },
    { text: "Contact Us Today", link: "contact.html" },
    { text: "Explore the Academy", link: "about.html" },
    { text: "Read the Blog", link: "blog.html" },
    { text: "See Custom Agents", link: "agents.html" },
    { text: "Start Your Journey", link: "about.html" },
    { text: "Build Your Workforce", link: "https://www.skool.com/claude-agents-engineering-4513" },
    { text: "Learn the Framework", link: "blog.html" }
];

// Export for use in index.html
window.getRandomCTAPhrases = function (count = 3) {
    const shuffled = [...ctaPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
