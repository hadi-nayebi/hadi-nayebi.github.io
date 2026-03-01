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

    function init() {
        injectHeader();
        injectFooter();
        injectFeedbackWidget();
        initLightbox();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();
