// Version: v0.2.0
document.addEventListener('DOMContentLoaded', () => {
    // Inject 3 random CTAs into hooks array
    const randomCTAs = window.getRandomCTAPhrases ? window.getRandomCTAPhrases(3) : [];

    const hooks = [
        ...randomCTAs,
        // Blog articles
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
        { text: "Self-Healing Code", link: "blog.html" },
        // Contact / agents / about / Skool — contextual phrases
        { text: "Want to Build Your Own Agent?", link: "contact.html" },
        { text: "Meet the Agents", link: "agents.html" },
        { text: "Who Is Behind Hadosh?", link: "about.html" },
        { text: "Join Agent Engineers on Skool", link: "https://www.skool.com/claude-agents-engineering-4513" },
        { text: "Get in Touch", link: "contact.html" },
        { text: "About the Academy", link: "about.html" },
        { text: "See the Agent Catalog", link: "agents.html" }
    ];

    const ring = document.getElementById('orbitRing');
    const container = document.querySelector('.orbit-container');
    if (!ring || !container) return;

    const mql = window.matchMedia('(max-width: 768px)');
    let activeMode = null; // 'desktop' | 'mobile'
    let cleanupFn = null;  // teardown for current mode

    function switchMode() {
        // Teardown previous mode
        if (cleanupFn) {
            cleanupFn();
            cleanupFn = null;
        }
        // Clear existing items
        ring.innerHTML = '';
        ring.removeAttribute('style');

        if (mql.matches) {
            activeMode = 'mobile';
            cleanupFn = initMobileCarousel(hooks, ring, container);
        } else {
            activeMode = 'desktop';
            cleanupFn = initDesktopOrbit(hooks, ring, container);
        }
    }

    mql.addEventListener('change', switchMode);
    switchMode();
});

// ─── Desktop Orbit ───────────────────────────────────────────────
function initDesktopOrbit(hooks, ring, container) {
    const radius = 950;
    const totalItems = hooks.length;
    const stepAngle = 360 / totalItems;

    let currentRotation = 0;
    let targetRotation = 0;
    let isHovering = false;
    let lastScrollTime = 0;
    let rafId = null;

    // Create items
    hooks.forEach((hook, index) => {
        const angle = (index / totalItems) * 2 * Math.PI;
        const item = document.createElement('div');
        item.className = 'orbit-item';

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
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

    const hero = document.querySelector('.hero');

    function onMouseMove(e) {
        const rect = hero.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const screenWidth = window.innerWidth;
        const activeZoneStartX = screenWidth * 0.55;
        const activeZoneStartY = rect.height * 0.25;
        const activeZoneEndY = rect.height * 0.75;

        if (e.clientX > activeZoneStartX && relativeY > activeZoneStartY && relativeY < activeZoneEndY) {
            if (!isHovering) {
                isHovering = true;
                targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
            }
        } else {
            isHovering = false;
        }
    }

    function onMouseLeave() {
        isHovering = false;
    }

    function onWheel(e) {
        if (!isHovering) return;
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime > 60) {
            const direction = e.deltaY > 0 ? -1 : 1;
            targetRotation += direction * stepAngle;
            lastScrollTime = now;
        }
    }

    if (hero) {
        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);
        hero.addEventListener('wheel', onWheel, { passive: false });
    }

    function animate() {
        if (isHovering) {
            currentRotation += (targetRotation - currentRotation) * 0.35;
        } else {
            currentRotation += 0.02;
        }
        ring.style.transform = `rotate(${currentRotation}deg)`;
        updateFocus();
        rafId = requestAnimationFrame(animate);
    }

    function updateFocus() {
        const items = ring.querySelectorAll('.orbit-item');
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;
            const dx = itemX - centerX;
            const dy = itemY - centerY;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            let diff = Math.abs(angle);
            if (diff > 180) diff = 360 - diff;

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
                item.style.pointerEvents = 'auto';
            } else {
                text.style.color = 'var(--text-muted)';
                text.style.textShadow = 'none';
                item.style.zIndex = 1;
                item.style.pointerEvents = 'none';
            }
        });
    }

    rafId = requestAnimationFrame(animate);

    // Return cleanup function
    return function cleanup() {
        cancelAnimationFrame(rafId);
        if (hero) {
            hero.removeEventListener('mousemove', onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
            hero.removeEventListener('wheel', onWheel);
        }
    };
}

// ─── Mobile Vertical Carousel ────────────────────────────────────
function initMobileCarousel(hooks, ring, container) {
    const itemSpacing = 52;
    const totalItems = hooks.length;
    const totalHeight = totalItems * itemSpacing;

    let scrollOffset = 0;
    let velocity = 0;
    let isDragging = false;
    let touchStartY = 0;
    let touchStartOffset = 0;
    let lastTouchY = 0;
    let lastTouchTime = 0;
    let rafId = null;

    // Create items
    hooks.forEach(hook => {
        const item = document.createElement('div');
        item.className = 'orbit-item';

        const link = document.createElement('a');
        link.href = hook.link;
        link.className = 'orbit-text';
        link.textContent = hook.text;
        link.style.textDecoration = 'none';

        item.appendChild(link);
        ring.appendChild(item);
    });

    const items = ring.querySelectorAll('.orbit-item');
    const ringHeight = ring.offsetHeight;
    const centerY = ringHeight / 2;

    // Gaussian sigma — controls how many items are in the clarity zone
    const sigma = itemSpacing * 2;

    function onTouchStart(e) {
        const touch = e.touches[0];
        isDragging = true;
        velocity = 0;
        touchStartY = touch.clientY;
        touchStartOffset = scrollOffset;
        lastTouchY = touch.clientY;
        lastTouchTime = Date.now();
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartY;
        scrollOffset = touchStartOffset - deltaY;

        // Track velocity
        const now = Date.now();
        const dt = now - lastTouchTime;
        if (dt > 0) {
            velocity = (lastTouchY - touch.clientY) / dt * 16; // normalize to ~frame
        }
        lastTouchY = touch.clientY;
        lastTouchTime = now;

        e.preventDefault();
    }

    function onTouchEnd() {
        isDragging = false;
        // velocity is already set from touchmove
    }

    ring.addEventListener('touchstart', onTouchStart, { passive: true });
    ring.addEventListener('touchmove', onTouchMove, { passive: false });
    ring.addEventListener('touchend', onTouchEnd, { passive: true });

    function animate() {
        if (!isDragging) {
            if (Math.abs(velocity) > 0.1) {
                // Inertia
                scrollOffset += velocity;
                velocity *= 0.95; // friction decay
            } else {
                // Auto-drift upward
                scrollOffset += 0.5;
                velocity = 0;
            }
        }

        // Wrap scrollOffset into [0, totalHeight)
        scrollOffset = ((scrollOffset % totalHeight) + totalHeight) % totalHeight;

        // Position each item
        items.forEach((item, i) => {
            // Raw Y position relative to ring center
            let rawY = (i * itemSpacing) - scrollOffset;

            // Wrap into [-totalHeight/2, totalHeight/2)
            rawY = ((rawY % totalHeight) + totalHeight + totalHeight / 2) % totalHeight - totalHeight / 2;

            // Distance from center for Gaussian
            const dist = Math.abs(rawY);

            // Only process items within visible range (perf)
            if (dist > itemSpacing * 5) {
                item.style.display = 'none';
                return;
            }
            item.style.display = '';

            // Gaussian intensity
            const intensity = Math.exp(-(dist * dist) / (2 * sigma * sigma));

            const opacity = 0.15 + (0.85 * intensity);
            const blur = 6 * (1 - intensity);
            const scale = 0.85 + (0.15 * intensity);

            item.style.transform = `translate(-50%, -50%) translateY(${rawY}px) scale(${scale})`;
            item.style.top = '50%';
            item.style.left = '50%';

            const text = item.querySelector('.orbit-text');
            text.style.opacity = opacity;
            text.style.filter = `blur(${blur}px)`;

            if (intensity > 0.7) {
                text.style.color = '#fff';
                text.style.textShadow = `0 0 ${14 * intensity}px var(--primary)`;
                item.style.zIndex = 100;
                item.style.pointerEvents = 'auto';
            } else {
                text.style.color = 'var(--text-muted)';
                text.style.textShadow = 'none';
                item.style.zIndex = 1;
                item.style.pointerEvents = 'none';
            }
        });

        rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    // Return cleanup function
    return function cleanup() {
        cancelAnimationFrame(rafId);
        ring.removeEventListener('touchstart', onTouchStart);
        ring.removeEventListener('touchmove', onTouchMove);
        ring.removeEventListener('touchend', onTouchEnd);
    };
}
