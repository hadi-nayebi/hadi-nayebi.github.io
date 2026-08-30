// Version: v0.9.0
// Shared site components: canonical navigation, responsive support, blog series navigation,
// footer, lightbox, blog filters, and audio controls.

(function () {
    'use strict';

    var NAV_ITEMS = [
        { label: 'Home', href: '/index.html' },
        { label: 'Start Here', href: '/start-here.html' },
        { label: 'Blog', href: '/blog.html' },
        { label: 'Agents', href: '/agents.html' },
        { label: 'Projects', href: '/projects/index.html' },
        { label: 'About', href: '/about.html' },
        { label: 'Contact', href: '/contact.html' }
    ];

    function currentSection() {
        var path = window.location.pathname.replace(/\/+$/, '') || '/';
        if (path === '/' || path === '/index.html') return 'Home';
        if (path === '/start-here.html') return 'Start Here';
        if (path === '/blog.html' || path.indexOf('/blog/') === 0) return 'Blog';
        if (path === '/agents.html') return 'Agents';
        if (path === '/projects' || path === '/projects/index.html' || path.indexOf('/projects/') === 0) return 'Projects';
        if (path === '/about.html') return 'About';
        if (path === '/contact.html') return 'Contact';
        return '';
    }

    function injectStabilityStyles() {
        if (document.querySelector('link[data-site-stability]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/site-stability.css?v=20260830-1';
        link.setAttribute('data-site-stability', 'true');
        document.head.appendChild(link);
    }

    function enhanceHeader() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var navLinks = header.querySelector('.nav-links');
        var toggle = header.querySelector('.nav-toggle');
        if (!navLinks || !toggle) return;

        // The static HTML remains a no-JS fallback. At runtime, normalize every page
        // to one canonical navigation order using root-relative links, so nested blog
        // paths cannot generate broken ../ links.
        navLinks.innerHTML = '';
        var active = currentSection();
        NAV_ITEMS.forEach(function (item) {
            var anchor = document.createElement('a');
            anchor.href = item.href;
            anchor.textContent = item.label;
            if (item.label === active) {
                anchor.classList.add('active');
                anchor.setAttribute('aria-current', 'page');
            }
            navLinks.appendChild(anchor);
        });

        function closeMenu() {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('is-active');
            navLinks.classList.remove('is-open');
            document.body.classList.remove('nav-open');
        }

        toggle.addEventListener('click', function () {
            var opening = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(opening));
            toggle.classList.toggle('is-active', opening);
            navLinks.classList.toggle('is-open', opening);
            document.body.classList.toggle('nav-open', opening);
        });

        navLinks.addEventListener('click', function (event) {
            if (event.target.closest('a')) closeMenu();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeMenu();
        });
    }

    function enhanceFooter() {
        var yearSpan = document.getElementById('copyright-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        var footer = document.getElementById('site-footer');
        if (!footer) return;
        var inner = footer.querySelector('.container');
        if (!inner || inner.querySelector('.footer-links')) return;

        var tagline = document.createElement('div');
        tagline.className = 'footer-tagline';
        tagline.textContent = 'LEARN. BUILD. OWN.';
        inner.insertBefore(tagline, inner.firstChild);

        var links = document.createElement('div');
        links.className = 'footer-links';

        var projects = document.createElement('a');
        projects.href = '/projects/index.html';
        projects.className = 'footer-link';
        projects.textContent = 'Projects';
        links.appendChild(projects);

        var support = document.createElement('a');
        support.href = '/support.html';
        support.className = 'footer-link footer-link-support';
        support.textContent = 'Support the Project';
        links.appendChild(support);

        var copyright = inner.querySelector('p');
        if (copyright) inner.insertBefore(links, copyright);
        else inner.appendChild(links);
    }

    function injectFeedbackWidget() {
        var host = window.location.hostname;
        if (host !== 'localhost' && host !== '127.0.0.1') return;
        var script = document.createElement('script');
        script.src = '/js/feedback.js';
        document.body.appendChild(script);
    }

    function initLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML =
            '<button class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
            '<img src="" alt="">' +
            '<span class="lightbox-caption"></span>' +
            '<a class="lightbox-explore" href="#" style="display:none">' +
            '<span aria-hidden="true">&#8599;</span> Explore the interactive version</a>';
        document.body.appendChild(overlay);

        var img = overlay.querySelector('img');
        var caption = overlay.querySelector('.lightbox-caption');
        var explore = overlay.querySelector('.lightbox-explore');

        function open(src, alt, captionText, exploreHref) {
            img.src = src;
            img.alt = alt;
            caption.textContent = captionText || '';
            caption.style.display = captionText ? '' : 'none';
            if (exploreHref) {
                explore.setAttribute('href', exploreHref);
                explore.style.display = '';
            } else {
                explore.style.display = 'none';
            }
            overlay.classList.add('active');
            document.body.classList.add('lightbox-open');
        }

        function close() {
            overlay.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }

        document.addEventListener('click', function (event) {
            var target = event.target;
            if (target.matches('.blog-image img')) {
                var figure = target.closest('.blog-image');
                var figureCaption = figure ? figure.querySelector('figcaption') : null;
                var exploreHref = figure ? figure.getAttribute('data-explore') : null;
                open(target.src, target.alt, figureCaption ? figureCaption.textContent : '', exploreHref);
            }
        });

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay || event.target.classList.contains('lightbox-close')) close();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && overlay.classList.contains('active')) close();
        });
    }

    function findSeriesLinks(articleBody) {
        var result = { previous: null, next: null };
        if (!articleBody) return result;
        Array.prototype.forEach.call(articleBody.querySelectorAll('a'), function (anchor) {
            var parentText = (anchor.parentElement && anchor.parentElement.textContent || '').trim();
            if (!result.previous && /^Previous:/i.test(parentText)) result.previous = anchor;
            if (!result.next && /^Next:/i.test(parentText)) result.next = anchor;
        });
        return result;
    }

    function buildSeriesCard(kind, link, currentTitle) {
        if (kind !== 'current' && !link) return null;
        var wrapper = kind === 'current' ? document.createElement('div') : document.createElement('a');
        if (kind !== 'current') {
            wrapper.href = link.href;
            wrapper.className = 'article-card-link';
        }
        var card = document.createElement('div');
        card.className = 'article-card' + (kind === 'current' ? ' active' : '');

        var position = document.createElement('div');
        position.className = 'sidebar-card-position';
        position.textContent = kind === 'previous' ? '← Previous in series' : kind === 'next' ? 'Next in series →' : 'You are here';
        card.appendChild(position);

        var title = document.createElement('h3');
        title.textContent = kind === 'current' ? currentTitle : link.textContent.trim();
        card.appendChild(title);
        wrapper.appendChild(card);
        return wrapper;
    }

    function initBlogSeriesNavigation() {
        var layout = document.querySelector('.blog-layout');
        var article = layout && layout.querySelector('.article-content');
        var sidebar = layout && layout.querySelector('.sidebar');
        if (!article || !sidebar) return;

        var articleBody = article.querySelector('.article-body');
        var links = findSeriesLinks(articleBody);
        var heading = article.querySelector('h1');
        var currentTitle = heading ? heading.textContent.trim() : document.title.replace(/\s*\|.*$/, '');

        sidebar.innerHTML = '';
        sidebar.setAttribute('aria-label', 'Article series navigation');
        var title = document.createElement('div');
        title.className = 'sidebar-title';
        title.textContent = 'In This Series';
        sidebar.appendChild(title);

        var list = document.createElement('div');
        var previous = buildSeriesCard('previous', links.previous, currentTitle);
        var current = buildSeriesCard('current', null, currentTitle);
        var next = buildSeriesCard('next', links.next, currentTitle);
        if (previous) list.appendChild(previous);
        list.appendChild(current);
        if (next) list.appendChild(next);

        var all = document.createElement('a');
        all.href = '/blog.html';
        all.className = 'article-card-link sidebar-all-essays-link';
        all.innerHTML = '<div class="article-card sidebar-all-essays"><h3>All essays →</h3><div class="date">Browse the full series</div></div>';
        list.appendChild(all);
        sidebar.appendChild(list);

        var backLink = article.querySelector('.blog-back-link');
        if (!backLink || article.querySelector('.blog-series-mobile-nav')) return;
        var mobile = document.createElement('nav');
        mobile.className = 'blog-series-mobile-nav';
        mobile.setAttribute('aria-label', 'Article series navigation');
        if (links.previous) {
            var prev = document.createElement('a');
            prev.href = links.previous.href;
            prev.textContent = '← Previous';
            mobile.appendChild(prev);
        }
        var allMobile = document.createElement('a');
        allMobile.href = '/blog.html';
        allMobile.textContent = 'All essays';
        mobile.appendChild(allMobile);
        if (links.next) {
            var nxt = document.createElement('a');
            nxt.href = links.next.href;
            nxt.textContent = 'Next →';
            mobile.appendChild(nxt);
        }
        backLink.insertAdjacentElement('afterend', mobile);
    }

    function initBlogFilters() {
        var container = document.querySelector('.blog-index-cards');
        if (!container) return;
        var cards = container.querySelectorAll('.blog-index-card');
        if (!cards.length || container.querySelector('.blog-filter-bar')) return;

        var AUDIENCE_TOOLTIPS = {
            'professionals': 'For lawyers, consultants, PMs, researchers — no coding required',
            'power-users': 'For professionals ready for deeper technical understanding',
            'architects': 'For technical builders creating novel agent architectures'
        };
        var AUDIENCE_LABELS = {
            'professionals': 'Professionals',
            'power-users': 'Power Users',
            'architects': 'Architects'
        };
        var audiences = [];
        var topics = [];
        cards.forEach(function (card) {
            var audience = card.getAttribute('data-audience');
            if (audience && audiences.indexOf(audience) === -1) audiences.push(audience);
            (card.getAttribute('data-tags') || '').split(',').forEach(function (tag) {
                tag = tag.trim();
                if (tag && topics.indexOf(tag) === -1) topics.push(tag);
            });
        });

        var bar = document.createElement('div');
        bar.className = 'blog-filter-bar';
        bar.setAttribute('aria-label', 'Filter essays');

        function makeButton(label, attribute, value, title) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'tag tag-sm';
            button.textContent = label;
            if (title) button.title = title;
            button.setAttribute(attribute, value);
            button.setAttribute('aria-pressed', 'false');
            return button;
        }

        var allButton = makeButton('All', 'data-filter', 'all');
        allButton.classList.add('active');
        allButton.setAttribute('aria-pressed', 'true');
        bar.appendChild(allButton);

        audiences.forEach(function (audience) {
            var button = makeButton(AUDIENCE_LABELS[audience] || audience, 'data-filter-audience', audience, AUDIENCE_TOOLTIPS[audience] || '');
            button.classList.add('tag-audience');
            bar.appendChild(button);
        });

        var divider = document.createElement('span');
        divider.className = 'blog-filter-divider';
        divider.setAttribute('aria-hidden', 'true');
        bar.appendChild(divider);

        topics.forEach(function (topic) {
            var label = topic.split('-').map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join(' ');
            bar.appendChild(makeButton(label, 'data-filter-tag', topic));
        });

        var header = container.querySelector('.blog-index-header');
        if (header && header.nextSibling) container.insertBefore(bar, header.nextSibling);
        else container.insertBefore(bar, container.firstChild);

        function setPressed(button, active) {
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        }

        function applyFilters() {
            var activeAudiences = [];
            var activeTags = [];
            bar.querySelectorAll('[data-filter-audience].active').forEach(function (element) {
                activeAudiences.push(element.getAttribute('data-filter-audience'));
            });
            bar.querySelectorAll('[data-filter-tag].active').forEach(function (element) {
                activeTags.push(element.getAttribute('data-filter-tag'));
            });
            var showAll = allButton.classList.contains('active');
            cards.forEach(function (card) {
                if (showAll) {
                    card.classList.remove('filter-hidden');
                    return;
                }
                var cardAudience = card.getAttribute('data-audience');
                var cardTags = (card.getAttribute('data-tags') || '').split(',').map(function (tag) { return tag.trim(); });
                var matchAudience = activeAudiences.length > 0 && activeAudiences.indexOf(cardAudience) !== -1;
                var matchTag = activeTags.length > 0 && activeTags.some(function (tag) { return cardTags.indexOf(tag) !== -1; });
                card.classList.toggle('filter-hidden', !(matchAudience || matchTag));
            });
        }

        bar.addEventListener('click', function (event) {
            var button = event.target.closest('button.tag');
            if (!button) return;
            if (button === allButton) {
                bar.querySelectorAll('button.tag').forEach(function (item) { setPressed(item, false); });
                setPressed(allButton, true);
            } else {
                setPressed(button, !button.classList.contains('active'));
                setPressed(allButton, false);
                if (!bar.querySelector('[data-filter-audience].active, [data-filter-tag].active')) setPressed(allButton, true);
            }
            applyFilters();
        });
    }

    function enhanceAudioPlayer() {
        var containers = document.querySelectorAll('.article-audio');
        if (!containers.length) return;
        containers.forEach(function (container) {
            var audio = container.querySelector('audio');
            if (!audio || container.querySelector('.audio-controls')) return;
            container.setAttribute('tabindex', '0');

            var controls = document.createElement('div');
            controls.className = 'audio-controls';
            var skipBack = document.createElement('button');
            skipBack.className = 'audio-btn audio-skip';
            skipBack.textContent = '−15s';
            skipBack.title = 'Skip back 15 seconds (←)';
            skipBack.setAttribute('aria-label', 'Skip back 15 seconds');
            var skipForward = document.createElement('button');
            skipForward.className = 'audio-btn audio-skip';
            skipForward.textContent = '+15s';
            skipForward.title = 'Skip forward 15 seconds (→)';
            skipForward.setAttribute('aria-label', 'Skip forward 15 seconds');
            var speedGroup = document.createElement('div');
            speedGroup.className = 'audio-speed-group';
            [1, 1.5, 2].forEach(function (rate) {
                var button = document.createElement('button');
                button.className = 'audio-btn audio-speed' + (rate === 1 ? ' active' : '');
                button.textContent = rate + 'x';
                button.setAttribute('data-speed', rate);
                button.title = 'Play at ' + rate + 'x speed';
                speedGroup.appendChild(button);
            });
            controls.appendChild(skipBack);
            controls.appendChild(skipForward);
            controls.appendChild(speedGroup);
            container.appendChild(controls);

            skipBack.addEventListener('click', function () { audio.currentTime = Math.max(0, audio.currentTime - 15); });
            skipForward.addEventListener('click', function () { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
            speedGroup.addEventListener('click', function (event) {
                var button = event.target.closest('.audio-speed');
                if (!button) return;
                audio.playbackRate = parseFloat(button.getAttribute('data-speed'));
                speedGroup.querySelectorAll('.audio-speed').forEach(function (item) { item.classList.remove('active'); });
                button.classList.add('active');
            });
            container.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    audio.currentTime = Math.max(0, audio.currentTime - 15);
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
                } else if (event.key === ' ') {
                    event.preventDefault();
                    if (audio.paused) audio.play(); else audio.pause();
                }
            });
        });
    }

    function init() {
        injectStabilityStyles();
        enhanceHeader();
        enhanceFooter();
        injectFeedbackWidget();
        initLightbox();
        initBlogSeriesNavigation();
        initBlogFilters();
        enhanceAudioPlayer();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
