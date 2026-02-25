// Version: v0.1.0
// Shared nav/header and footer components — injected into placeholder elements.

(function () {
    'use strict';

    /**
     * Navigation items definition.
     * Each entry: { label, href }
     */
    var NAV_ITEMS = [
        { label: 'Home', href: 'index.html' },
        { label: 'Blog', href: 'blog.html' },
        { label: 'Agents', href: 'agents.html' },
        { label: 'About', href: 'about.html' },
        { label: 'Contact', href: 'contact.html' }
    ];

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

        // Build nav links HTML
        var linksHtml = NAV_ITEMS.map(function (item) {
            var activeClass = (currentPage === item.href) ? ' class="active"' : '';
            return '<a href="' + item.href + '"' + activeClass + '>' + item.label + '</a>';
        }).join('\n                    ');

        header.innerHTML =
            '<div class="container">\n' +
            '            <nav>\n' +
            '                <a href="index.html" class="logo">Hadosh Academy</a>\n' +
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
    function init() {
        injectHeader();
        injectFooter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();
