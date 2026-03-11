// Version: v0.6.0
// Shared components — enhances static nav/footer markup, plus lightbox and blog filters.

(function () {
    'use strict';

    /**
     * Enhance the static header: wire up hamburger toggle.
     * Static nav HTML is already in every page — no innerHTML injection.
     */
    function enhanceHeader() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var toggle = header.querySelector('.nav-toggle');
        var navLinks = header.querySelector('.nav-links');
        if (toggle && navLinks) {
            toggle.addEventListener('click', function () {
                var expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                toggle.classList.toggle('is-active');
                navLinks.classList.toggle('is-open');
            });
        }
    }

    /**
     * Enhance the static footer: update copyright year dynamically.
     */
    function enhanceFooter() {
        var yearSpan = document.getElementById('copyright-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    /**
     * Detect if the page is inside a subdirectory (e.g. blog/).
     * Returns the prefix needed to reach the site root (e.g. "../" or "").
     */
    function getPathPrefix() {
        var path = window.location.pathname;
        var subdirs = ['/blog/'];
        for (var i = 0; i < subdirs.length; i++) {
            if (path.indexOf(subdirs[i]) !== -1) {
                return '../';
            }
        }
        return '';
    }

    /**
     * Inject dev-only feedback widget on localhost.
     */
    function injectFeedbackWidget() {
        var host = window.location.hostname;
        if (host !== 'localhost' && host !== '127.0.0.1') return;

        var prefix = getPathPrefix();
        var script = document.createElement('script');
        script.src = prefix + 'js/feedback.js';
        document.body.appendChild(script);
    }

    /**
     * Image lightbox — click blog images to view full-size in overlay.
     */
    function initLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML =
            '<button class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
            '<img src="" alt="">' +
            '<span class="lightbox-caption"></span>';
        document.body.appendChild(overlay);

        var img = overlay.querySelector('img');
        var caption = overlay.querySelector('.lightbox-caption');

        function open(src, alt, captionText) {
            img.src = src;
            img.alt = alt;
            caption.textContent = captionText || '';
            caption.style.display = captionText ? '' : 'none';
            overlay.classList.add('active');
            document.body.classList.add('lightbox-open');
        }

        function close() {
            overlay.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }

        document.addEventListener('click', function (e) {
            var target = e.target;
            if (target.matches('.blog-image img')) {
                var fig = target.closest('.blog-image');
                var fc = fig ? fig.querySelector('figcaption') : null;
                open(target.src, target.alt, fc ? fc.textContent : '');
            }
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
                close();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                close();
            }
        });
    }

    /**
     * Blog filter bar — filter index cards by audience tier and topic tags.
     * Only runs on pages with .blog-index-cards (blog.html).
     */
    function initBlogFilters() {
        var container = document.querySelector('.blog-index-cards');
        if (!container) return;

        var cards = container.querySelectorAll('.blog-index-card');
        if (!cards.length) return;

        var AUDIENCE_TOOLTIPS = {
            'professionals': 'For lawyers, consultants, PMs, researchers \u2014 no coding required',
            'power-users': 'For professionals ready for deeper technical understanding',
            'architects': 'For technical builders creating novel agent architectures'
        };
        var AUDIENCE_LABELS = {
            'professionals': 'Professionals',
            'power-users': 'Power Users',
            'architects': 'Architects'
        };

        // Collect unique audiences and tags from cards
        var audiences = [];
        var topics = [];
        cards.forEach(function (card) {
            var aud = card.getAttribute('data-audience');
            if (aud && audiences.indexOf(aud) === -1) audiences.push(aud);
            var tags = (card.getAttribute('data-tags') || '').split(',');
            tags.forEach(function (t) {
                t = t.trim();
                if (t && topics.indexOf(t) === -1) topics.push(t);
            });
        });

        // Build filter bar
        var bar = document.createElement('div');
        bar.className = 'blog-filter-bar';

        // "All" chip
        var allChip = document.createElement('span');
        allChip.className = 'tag tag-sm active';
        allChip.textContent = 'All';
        allChip.setAttribute('data-filter', 'all');
        bar.appendChild(allChip);

        // Audience chips
        audiences.forEach(function (aud) {
            var chip = document.createElement('span');
            chip.className = 'tag tag-sm tag-audience';
            chip.textContent = AUDIENCE_LABELS[aud] || aud;
            chip.title = AUDIENCE_TOOLTIPS[aud] || '';
            chip.setAttribute('data-filter-audience', aud);
            bar.appendChild(chip);
        });

        // Divider
        var divider = document.createElement('span');
        divider.className = 'blog-filter-divider';
        bar.appendChild(divider);

        // Topic chips
        topics.forEach(function (topic) {
            var chip = document.createElement('span');
            chip.className = 'tag tag-sm';
            chip.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
            chip.setAttribute('data-filter-tag', topic);
            bar.appendChild(chip);
        });

        // Insert after blog-index-header
        var header = container.querySelector('.blog-index-header');
        if (header && header.nextSibling) {
            container.insertBefore(bar, header.nextSibling);
        } else {
            container.insertBefore(bar, container.firstChild);
        }

        // Filter logic
        function applyFilters() {
            var activeAudiences = [];
            var activeTags = [];
            bar.querySelectorAll('[data-filter-audience].active').forEach(function (el) {
                activeAudiences.push(el.getAttribute('data-filter-audience'));
            });
            bar.querySelectorAll('[data-filter-tag].active').forEach(function (el) {
                activeTags.push(el.getAttribute('data-filter-tag'));
            });

            var showAll = allChip.classList.contains('active');

            cards.forEach(function (card) {
                if (showAll) {
                    card.classList.remove('filter-hidden');
                    return;
                }
                var cardAud = card.getAttribute('data-audience');
                var cardTags = (card.getAttribute('data-tags') || '').split(',').map(function (t) { return t.trim(); });

                var matchAud = activeAudiences.length > 0 && activeAudiences.indexOf(cardAud) !== -1;
                var matchTag = activeTags.length > 0 && activeTags.some(function (t) { return cardTags.indexOf(t) !== -1; });
                var noFilters = activeAudiences.length === 0 && activeTags.length === 0;

                if (noFilters || matchAud || matchTag) {
                    card.classList.remove('filter-hidden');
                } else {
                    card.classList.add('filter-hidden');
                }
            });
        }

        bar.addEventListener('click', function (e) {
            var chip = e.target.closest('.tag');
            if (!chip) return;

            if (chip.getAttribute('data-filter') === 'all') {
                // Activate All, deactivate everything else
                bar.querySelectorAll('.tag').forEach(function (el) { el.classList.remove('active'); });
                allChip.classList.add('active');
            } else {
                // Toggle this chip
                chip.classList.toggle('active');
                // Deactivate All
                allChip.classList.remove('active');
                // If nothing active, reactivate All
                var anyActive = bar.querySelector('[data-filter-audience].active, [data-filter-tag].active');
                if (!anyActive) {
                    allChip.classList.add('active');
                }
            }

            applyFilters();
        });
    }

    /**
     * Enhance audio player — add speed controls, skip buttons, keyboard shortcuts.
     * Progressively enhances existing <audio controls> inside .article-audio.
     */
    function enhanceAudioPlayer() {
        var containers = document.querySelectorAll('.article-audio');
        if (!containers.length) return;

        containers.forEach(function (container) {
            var audio = container.querySelector('audio');
            if (!audio) return;

            // Make container focusable for keyboard shortcuts
            container.setAttribute('tabindex', '0');

            // Create controls wrapper
            var controls = document.createElement('div');
            controls.className = 'audio-controls';

            // Skip back button
            var skipBack = document.createElement('button');
            skipBack.className = 'audio-btn audio-skip';
            skipBack.innerHTML = '−15s';
            skipBack.title = 'Skip back 15 seconds (←)';
            skipBack.setAttribute('aria-label', 'Skip back 15 seconds');

            // Skip forward button
            var skipFwd = document.createElement('button');
            skipFwd.className = 'audio-btn audio-skip';
            skipFwd.innerHTML = '+15s';
            skipFwd.title = 'Skip forward 15 seconds (→)';
            skipFwd.setAttribute('aria-label', 'Skip forward 15 seconds');

            // Speed buttons
            var speeds = [1, 1.5, 2];
            var speedBtns = [];
            var speedGroup = document.createElement('div');
            speedGroup.className = 'audio-speed-group';

            speeds.forEach(function (rate) {
                var btn = document.createElement('button');
                btn.className = 'audio-btn audio-speed' + (rate === 1 ? ' active' : '');
                btn.textContent = rate + 'x';
                btn.title = 'Play at ' + rate + 'x speed';
                btn.setAttribute('data-speed', rate);
                speedBtns.push(btn);
                speedGroup.appendChild(btn);
            });

            controls.appendChild(skipBack);
            controls.appendChild(skipFwd);
            controls.appendChild(speedGroup);
            container.appendChild(controls);

            // Skip handlers
            skipBack.addEventListener('click', function () {
                audio.currentTime = Math.max(0, audio.currentTime - 15);
            });
            skipFwd.addEventListener('click', function () {
                audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
            });

            // Speed handlers
            speedGroup.addEventListener('click', function (e) {
                var btn = e.target.closest('.audio-speed');
                if (!btn) return;
                var rate = parseFloat(btn.getAttribute('data-speed'));
                audio.playbackRate = rate;
                speedBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });

            // Keyboard shortcuts (when container or audio focused)
            container.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    audio.currentTime = Math.max(0, audio.currentTime - 15);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
                } else if (e.key === ' ') {
                    e.preventDefault();
                    if (audio.paused) { audio.play(); } else { audio.pause(); }
                }
            });
        });
    }

    function init() {
        enhanceHeader();
        enhanceFooter();
        injectFeedbackWidget();
        initLightbox();
        initBlogFilters();
        enhanceAudioPlayer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();
