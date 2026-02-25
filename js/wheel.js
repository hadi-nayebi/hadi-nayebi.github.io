// Version: v0.1.0
document.addEventListener('DOMContentLoaded', () => {
    // Inject 3 random CTAs into hooks array
    const randomCTAs = window.getRandomCTAPhrases ? window.getRandomCTAPhrases(3) : [];

    const hooks = [
        ...randomCTAs, // Inject CTAs at the beginning
        { text: "LLMs Are Not the Agents", link: "blog/llms-are-not-the-agents.html" },
        { text: "The Death of the Chatbot", link: "blog.html" },
        { text: "Why Agents Need Intentions", link: "blog.html" },
        { text: "Memory Is Not Just Storage", link: "blog.html" },
        { text: "The Agentic Workforce", link: "blog.html" },
        { text: "Deterministic vs Probabilistic", link: "blog.html" },
        { text: "Building Cognitive Architectures", link: "blog.html" },
        { text: "The Three Layers of Agency", link: "blog.html" },
        { text: "From Chatbots to Colleagues", link: "blog.html" },
        { text: "The Biology of Code", link: "blog.html" },
        { text: "Architecting Intelligence", link: "blog.html" },
        { text: "The Human-in-the-Loop Pattern", link: "blog.html" },
        { text: "Scaling Cognitive Labor", link: "blog.html" },
        { text: "Beyond the Context Window", link: "blog.html" },
        { text: "The End of Prompt Engineering", link: "blog.html" },
        { text: "Structure Over Randomness", link: "blog.html" },
        { text: "The Triad Pattern", link: "blog.html" },
        { text: "Agents as Dynamic Tissue", link: "blog.html" },
        { text: "The OPEV Loop", link: "blog.html" },
        { text: "Hooks: The Rails of AI", link: "blog.html" },
        { text: "Intention Driven Design", link: "blog.html" },
        { text: "The Template Agent", link: "blog.html" },
        { text: "Democratizing Engineering", link: "blog.html" },
        { text: "The New Industrial Revolution", link: "blog.html" },
        { text: "The Agent Operating System", link: "blog.html" },
        { text: "Context Is King", link: "blog.html" },
        { text: "Vertical AI Agents", link: "blog.html" },
        { text: "The Agent Economy", link: "blog.html" },
        { text: "Building The Brain", link: "blog.html" },
        { text: "Cognitive Load Balancing", link: "blog.html" },
        { text: "The New Tech Stack", link: "blog.html" },
        { text: "Agentic Workflows", link: "blog.html" },
        { text: "The Future of Code", link: "blog.html" },
        { text: "Natural Language Programming", link: "blog.html" },
        { text: "The Rise of the MCP", link: "blog.html" },
        { text: "Self-Healing Code", link: "blog.html" }
    ];

    const ring = document.getElementById('orbitRing');
    const container = document.querySelector('.orbit-container');

    // Safety check if elements exist
    if (!ring || !container) return;

    const radius = 950;
    const totalItems = hooks.length;
    const stepAngle = 360 / totalItems; // Angle between items

    // State
    let currentRotation = 0;
    let targetRotation = 0;
    let isHovering = false;
    let lastScrollTime = 0;

    // Initialize Items
    hooks.forEach((hook, index) => {
        const angle = (index / totalItems) * 2 * Math.PI;
        const item = document.createElement('div');
        item.className = 'orbit-item';

        // Position calculation (Standard circle math)
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Rotate the item so text radiates outward
        const rotationDeg = angle * (180 / Math.PI);

        item.style.transform = `translate(${x}px, ${y}px) rotate(${rotationDeg}deg)`;

        const link = document.createElement('a');
        link.href = hook.link;
        link.className = 'orbit-text';
        link.textContent = hook.text;
        link.style.textDecoration = 'none';

        item.appendChild(link);
        ring.appendChild(item);
    });

    // Event Listeners
    const hero = document.querySelector('.hero');

    if (hero) {
        // Smart Hover: Only activate "Wheel Mode" when mouse is inside the Hero, on the right side, and in the middle vertical zone
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const screenWidth = window.innerWidth;

            // Active zone: Right 45% of width
            const activeZoneStartX = screenWidth * 0.55;

            // Vertical zone: Middle 50% of the HERO section
            const activeZoneStartY = rect.height * 0.25;
            const activeZoneEndY = rect.height * 0.75;

            if (e.clientX > activeZoneStartX && relativeY > activeZoneStartY && relativeY < activeZoneEndY) {
                if (!isHovering) {
                    isHovering = true;
                    // Snap when entering zone
                    targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
                }
            } else {
                isHovering = false;
            }
        });

        hero.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        hero.addEventListener('wheel', (e) => {
            if (!isHovering) return; // Allow default page scroll if not in active zone

            e.preventDefault(); // Block page scroll ONLY in active zone

            const now = Date.now();
            if (now - lastScrollTime > 60) { // Debounce reduced to 60ms (more responsive)
                const direction = e.deltaY > 0 ? -1 : 1; // Reversed direction
                // "Ratchet" effect: Move one full step
                targetRotation += direction * stepAngle;
                lastScrollTime = now;
            }
        }, { passive: false });
    }

    // Physics Loop
    function animate() {
        if (isHovering) {
            // Lerp to target (Snap effect)
            // Increased to 0.35 for very snappy response (aligns blur transition with scroll)
            currentRotation += (targetRotation - currentRotation) * 0.35;
        } else {
            // Passive drift
            currentRotation += 0.02; // Slow rotation
        }

        // Apply rotation to ring
        ring.style.transform = `rotate(${currentRotation}deg)`;

        updateFocus();
        requestAnimationFrame(animate);
    }

    // Focus Logic
    function updateFocus() {
        const items = document.querySelectorAll('.orbit-item');
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;

            // Calculate angle relative to center
            const dx = itemX - centerX;
            const dy = itemY - centerY;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Normalize angle
            let diff = Math.abs(angle);
            if (diff > 180) diff = 360 - diff;

            // Gaussian Falloff
            const sigma = 12;
            const intensity = Math.exp(-(diff * diff) / (2 * sigma * sigma));

            const opacity = 0.1 + (0.9 * intensity);
            const blur = 8 * (1 - intensity);
            const scale = 1.0 + (0.3 * intensity);

            const text = item.querySelector('.orbit-text');
            text.style.opacity = opacity;
            text.style.filter = `blur(${blur}px)`;
            text.style.transform = `scale(${scale})`;

            if (intensity > 0.8) {
                text.style.color = '#fff';
                text.style.textShadow = `0 0 ${20 * intensity}px var(--primary)`;
                item.style.zIndex = 100;
                item.style.pointerEvents = 'auto'; // Clickable
            } else {
                text.style.color = 'var(--text-muted)';
                text.style.textShadow = 'none';
                item.style.zIndex = 1;
                item.style.pointerEvents = 'none'; // Not clickable
            }
        });
    }

    animate();
});
