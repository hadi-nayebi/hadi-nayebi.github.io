// Version: v0.4.0
// Shared nav/header and footer components — injected into placeholder elements.

(function () {
    'use strict';

    /**
     * Navigation items definition.
     * Each entry: { label, href }
     * href values are relative to the site root.
     */
    var NAV_ITEMS = [
        { label: 'Home', href: 'index.html' },
        { label: 'Blog', href: 'blog.html' },
        { label: 'Agents', href: 'agents.html' },
        { label: 'About', href: 'about.html' },
        { label: 'Contact', href: 'contact.html' }
    ];

    /**
     * Detect if the page is inside a subdirectory (e.g. blog/).
     * Returns the prefix needed to reach the site root (e.g. "../" or "").
     */
    function getPathPrefix() {
        var path = window.location.pathname;
        // Known subdirectories that contain pages
        var subdirs = ['/blog/'];
        for (var i = 0; i < subdirs.length; i++) {
            if (path.indexOf(subdirs[i]) !== -1) {
                return '../';
            }
        }
        return '';
    }

    /**
     * Determine the current page filename from the URL pathname.
     * Returns the filename (e.g. "about.html") or "index.html" for root paths.
     */
    function getCurrentPage() {
        var path = window.location.pathname;
        // Strip trailing slash
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        var segments = path.split('/');
        var last = segments[segments.length - 1];
        // Root or empty means index
        if (!last || last === '') {
            return 'index.html';
        }
        return last;
    }

    /**
     * Build and inject the site header/nav into #site-header.
     */
    function injectHeader() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var currentPage = getCurrentPage();
        var prefix = getPathPrefix();

        // Build nav links HTML
        var linksHtml = NAV_ITEMS.map(function (item) {
            var isActive = (currentPage === item.href);
            var attrs = isActive ? ' class="active" aria-current="page"' : '';
            return '<a href="' + prefix + item.href + '"' + attrs + '>' + item.label + '</a>';
        }).join('\n                    ');

        header.innerHTML =
            '<div class="container">\n' +
            '            <nav>\n' +
            '                <a href="' + prefix + 'index.html" class="logo">Hadosh Academy</a>\n' +
            '\n' +
            '                <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">\n' +
            '                    <span class="nav-toggle-bar"></span>\n' +
            '                    <span class="nav-toggle-bar"></span>\n' +
            '                    <span class="nav-toggle-bar"></span>\n' +
            '                </button>\n' +
            '\n' +
            '                <div class="nav-links">\n' +
            '                    ' + linksHtml + '\n' +
            '                </div>\n' +
            '            </nav>\n' +
            '        </div>';

        // Wire up hamburger toggle
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
     * Build and inject the site footer into #site-footer.
     */
    function injectFooter() {
        var footer = document.getElementById('site-footer');
        if (!footer) return;

        var year = new Date().getFullYear();

        footer.innerHTML =
            '<div class="container">\n' +
            '            <p>&copy; ' + year + ' Hadosh Academy. All rights reserved.</p>\n' +
            '        </div>';
    }

    /**
     * Initialize components when DOM is ready.
     */
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

                var matchAud = activeAudiences.length === 0 || activeAudiences.indexOf(cardAud) !== -1;
                var matchTag = activeTags.length === 0 || activeTags.some(function (t) { return cardTags.indexOf(t) !== -1; });

                if (matchAud && matchTag) {
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

    function init() {
        injectHeader();
        injectFooter();
        injectFeedbackWidget();
        initLightbox();
        initBlogFilters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();
