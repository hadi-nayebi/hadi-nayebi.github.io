// Version: v0.1.0
/**
 * Hadosh Academy Theme Manager
 * Handles random color themes and profile picture selection.
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

// Apply immediately to avoid flash
applyRandomTheme();

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
