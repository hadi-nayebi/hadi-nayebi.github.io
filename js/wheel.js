// Version: v0.4.0
document.addEventListener('DOMContentLoaded', () => {
    const randomCTAs = window.getRandomCTAPhrases ? window.getRandomCTAPhrases(3) : [];

    // The orbit is a navigation surface, not decorative copy. Every item lands on
    // a live page where the concept is explained, implemented, or explored.
    const hooks = [
        ...randomCTAs,

        // Part 1 — conceptual foundation
        { text: 'LLMs Are Not the Agents', link: '/blog/b1/01-llms-are-not-the-agents.html' },
        { text: 'The Engine Is Not the Agent', link: '/blog/b1/01-llms-are-not-the-agents.html' },
        { text: 'Your Agent Lives in Files', link: '/blog/b1/01-llms-are-not-the-agents.html' },
        { text: 'Structure Over Scale', link: '/blog/b2/02-we-could-have-had-agi.html' },
        { text: 'Agents Are Complex Systems', link: '/blog/b2/02-we-could-have-had-agi.html' },
        { text: 'The Digital Cortex', link: '/blog/b3/03-your-brain-was-never-built-for-this.html' },
        { text: 'Cognitive Load Is Real', link: '/blog/b3/03-your-brain-was-never-built-for-this.html' },
        { text: 'The Folder Is Alive', link: '/blog/b3/03_1-the-folder-is-alive.html' },
        { text: 'A Folder Full of Specialists', link: '/blog/b3/03_1-the-folder-is-alive.html' },
        { text: 'The Language of Agents', link: '/blog/b4/04-the-language-of-agents.html' },
        { text: 'Hooks, Skills, and Plugins', link: '/blog/b4/04-the-language-of-agents.html' },
        { text: 'Beyond the Context Window', link: '/blog/b4/04-the-language-of-agents.html' },

        // Part 5 — always-on cortex
        { text: 'The Always-On Cortex', link: '/blog/b5/05_1-the-two-layer-foundation.html' },
        { text: 'Plugin Integrity', link: '/blog/b5/05_2-plugin-integrity.html' },
        { text: 'Brain Guard', link: '/blog/b5/05_3-brain-guard.html' },
        { text: 'Persistent Jobs', link: '/blog/b5/05_4-job-core.html' },
        { text: 'Interaction Memory', link: '/blog/b5/05_5-interaction-summary.html' },
        { text: 'Question Discipline', link: '/blog/b5/05_6-question-discipline.html' },
        { text: 'Context Hierarchy', link: '/blog/b5/05_7-claude-md-hierarchy.html' },
        { text: 'The Historian Ratchet', link: '/blog/b5/05_8-historian-ratchet.html' },
        { text: 'Customization Guardrails', link: '/blog/b5/05_9-customization-guardrail.html' },

        // Part 6 — phasic cognition
        { text: 'The OPEVC Loop', link: '/blog/b6/06_1-phasic-foundation.html' },
        { text: 'The Phase Map', link: '/blog/b6/06_2b-the-phase-map.html' },
        { text: 'Observe', link: '/blog/b6/06_3-observe.html' },
        { text: 'Plan', link: '/blog/b6/06_4-plan.html' },
        { text: 'Execute', link: '/blog/b6/06_5-execute.html' },
        { text: 'Verify', link: '/blog/b6/06_6-verify.html' },
        { text: 'Condense', link: '/blog/b6/06_7-condense.html' },
        { text: 'The Rhythm of Work', link: '/blog/b6/06_8-inverse-multiplier.html' },
        { text: 'G-Mode', link: '/blog/b6/06_9-gmode.html' },
        { text: 'Plan State Machine', link: '/blog/b6/06_10-plan-state-machine.html' },
        { text: 'Long-Horizon Memory', link: '/blog/b6/06_10b-long-horizon-memory.html' },

        // Part 7 — plugin anatomy
        { text: 'The Plugin Kit', link: '/blog/b7/07_1-plugin-kit-foundation.html' },
        { text: 'Plugin Skeleton', link: '/blog/b7/07_2-skeleton-claudemd-hooks-scripts.html' },
        { text: 'Dual Voice Architecture', link: '/blog/b7/07_3-dual-voice-architecture.html' },
        { text: 'Hidden State', link: '/blog/b7/07_4-data-json-hidden-state.html' },
        { text: 'Docs and Historian', link: '/blog/b7/07_5-docs-and-historian.html' },
        { text: '80/20 Delegation', link: '/blog/b7/07_6-agents-and-80-20-budget.html' },
        { text: 'Smaller Organs and Wiring', link: '/blog/b7/07_7-smaller-organs-and-wiring.html' },
        { text: 'The Lock Ceremony', link: '/blog/b7/07_8-lock-ceremony.html' },
        { text: 'Create a New Plugin', link: '/blog/b7/07_9-creating-a-new-plugin.html' },

        // Part 8 — maturation
        { text: 'Apprentice to Architect', link: '/blog/b8/08_1-apprentice-to-architect-foundation.html' },
        { text: 'Job Maturation', link: '/blog/b8/08_2-job-maturation-stages.html' },
        { text: 'A Brain After Three Months', link: '/blog/b8/08_3-brain-after-three-months.html' },
        { text: 'Soft to Hard', link: '/blog/b8/08_4-soft-hard-migration.html' },
        { text: 'Enforced vs Discipline', link: '/blog/b8/08_5-enforced-vs-discipline.html' },
        { text: 'Operator Maturation', link: '/blog/b8/08_6-apprentice-journeyman-architect.html' },
        { text: 'When the Brain Stops Growing', link: '/blog/b8/08_7-brain-stops-growing.html' },
        { text: 'Safe Self-Modification', link: '/blog/b8/08_8-safe-self-modification.html' },
        { text: 'The Seed Is Yours', link: '/blog/b8/08_9-the-seed-is-yours.html' },

        // Current program and projects
        { text: 'Start with Your CLI Agent', link: '/start-here.html' },
        { text: 'Seed Agent — Codex', link: '/projects/seed-agent.html' },
        { text: 'Q-Seed — Qwen Code', link: '/projects/q-seed.html' },
        { text: 'Team Harnesses', link: '/projects/team-harnesses.html' },
        { text: 'Family Games', link: '/projects/family-games.html' },
        { text: 'Crime Cartography', link: '/projects/crime-cartography.html' },
        { text: 'Reference Explorables', link: '/explore.html' },
        { text: 'Technical Portfolio', link: '/portfolio.html' },
        { text: 'Private Seed Reference', link: '/seed-access.html' },
        { text: 'About the Academy', link: '/about.html' },
        { text: 'Get in Touch', link: '/contact.html' },
        { text: 'Support the Open Work', link: '/support.html' }
    ];

    const ring = document.getElementById('orbitRing');
    const container = document.querySelector('.orbit-container');
    if (!ring || !container) return;

    const mql = window.matchMedia('(max-width: 768px) and (orientation: portrait)');
    let cleanupFn = null;

    function switchMode() {
        if (cleanupFn) cleanupFn();
        ring.innerHTML = '';
        ring.removeAttribute('style');
        cleanupFn = mql.matches
            ? initMobileCarousel(hooks, ring, container)
            : initDesktopOrbit(hooks, ring, container);
    }

    mql.addEventListener('change', switchMode);
    switchMode();
});

function initDesktopOrbit(hooks, ring, container) {
    const radius = 950;
    const totalItems = hooks.length;
    const stepAngle = 360 / totalItems;
    let currentRotation = 0;
    let targetRotation = 0;
    let isHovering = false;
    let lastScrollTime = 0;
    let rafId = null;

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
        if (hook.link.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        item.appendChild(link);
        ring.appendChild(item);
    });

    const hero = document.querySelector('.hero');

    function onMouseMove(e) {
        const rect = hero.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const activeZoneStartX = window.innerWidth * 0.55;
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

    function onMouseLeave() { isHovering = false; }

    function onWheel(e) {
        if (!isHovering) return;
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime > 60) {
            targetRotation += (e.deltaY > 0 ? -1 : 1) * stepAngle;
            lastScrollTime = now;
        }
    }

    if (hero) {
        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);
        hero.addEventListener('wheel', onWheel, { passive: false });
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
            const angle = Math.atan2(itemY - centerY, itemX - centerX) * (180 / Math.PI);
            const diff = Math.abs(angle);
            const sigma = 12;
            const intensity = Math.exp(-(diff * diff) / (2 * sigma * sigma));
            const text = item.querySelector('.orbit-text');
            text.style.opacity = 0.1 + (0.9 * intensity);
            text.style.filter = `blur(${8 * (1 - intensity)}px)`;
            text.style.transform = `scale(${1 + (0.3 * intensity)})`;

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

    function animate() {
        currentRotation += isHovering ? (targetRotation - currentRotation) * 0.35 : 0.02;
        ring.style.transform = `rotate(${currentRotation}deg)`;
        updateFocus();
        rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return function cleanup() {
        cancelAnimationFrame(rafId);
        if (hero) {
            hero.removeEventListener('mousemove', onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
            hero.removeEventListener('wheel', onWheel);
        }
    };
}

function initMobileCarousel(hooks, ring) {
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

    hooks.forEach(hook => {
        const item = document.createElement('div');
        item.className = 'orbit-item';
        Object.assign(item.style, { transition: 'none', position: 'absolute', top: '50%', left: '50%', width: '90%', textAlign: 'center' });
        const link = document.createElement('a');
        link.href = hook.link;
        link.className = 'orbit-text';
        link.textContent = hook.text;
        link.style.textDecoration = 'none';
        link.style.transition = 'none';
        if (hook.link.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        item.appendChild(link);
        ring.appendChild(item);
    });

    const items = ring.querySelectorAll('.orbit-item');
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
        scrollOffset = touchStartOffset - (touch.clientY - touchStartY);
        const now = Date.now();
        const dt = now - lastTouchTime;
        if (dt > 0) velocity = (lastTouchY - touch.clientY) / dt * 16;
        lastTouchY = touch.clientY;
        lastTouchTime = now;
        e.preventDefault();
    }

    function onTouchEnd() { isDragging = false; }

    ring.addEventListener('touchstart', onTouchStart, { passive: true });
    ring.addEventListener('touchmove', onTouchMove, { passive: false });
    ring.addEventListener('touchend', onTouchEnd, { passive: true });

    function renderItems() {
        items.forEach((item, i) => {
            let rawY = (i * itemSpacing) - scrollOffset;
            rawY = ((rawY % totalHeight) + totalHeight + totalHeight / 2) % totalHeight - totalHeight / 2;
            const dist = Math.abs(rawY);
            if (dist > itemSpacing * 5) {
                item.style.display = 'none';
                return;
            }
            item.style.display = 'block';
            const intensity = Math.exp(-(dist * dist) / (2 * sigma * sigma));
            item.style.transform = `translate(-50%, -50%) translateY(${rawY}px) scale(${0.85 + (0.15 * intensity)})`;
            const text = item.querySelector('.orbit-text');
            text.style.opacity = 0.15 + (0.85 * intensity);
            text.style.filter = `blur(${6 * (1 - intensity)}px)`;
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
    }

    function animate() {
        if (!isDragging) {
            if (Math.abs(velocity) > 0.1) {
                scrollOffset += velocity;
                velocity *= 0.95;
            } else {
                scrollOffset += 0.5;
                velocity = 0;
            }
        }
        scrollOffset = ((scrollOffset % totalHeight) + totalHeight) % totalHeight;
        renderItems();
        rafId = requestAnimationFrame(animate);
    }

    renderItems();
    rafId = requestAnimationFrame(animate);

    return function cleanup() {
        cancelAnimationFrame(rafId);
        ring.removeEventListener('touchstart', onTouchStart);
        ring.removeEventListener('touchmove', onTouchMove);
        ring.removeEventListener('touchend', onTouchEnd);
    };
}
