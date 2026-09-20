(function () {
    'use strict';

    var explorer = document.querySelector('[data-library-explorer]');
    if (!explorer) return;

    var search = document.getElementById('term-search');
    var count = document.getElementById('library-result-count');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-button'));
    var cloudItems = Array.prototype.slice.call(document.querySelectorAll('[data-term-item]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-term-card]'));
    var cloudEmpty = document.querySelector('[data-cloud-empty]');
    var directoryEmpty = document.querySelector('[data-directory-empty]');
    var active = { category: 'all', status: 'all' };

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function matches(element, query) {
        var categoryMatch = active.category === 'all' || element.dataset.category === active.category;
        var statusMatch = active.status === 'all' || element.dataset.status === active.status;
        var searchMatch = !query || normalize(element.dataset.search).indexOf(query) !== -1;
        return categoryMatch && statusMatch && searchMatch;
    }

    function applyFilters() {
        var query = normalize(search.value);
        var visibleCount = 0;

        cloudItems.forEach(function (item) {
            var visible = matches(item, query);
            item.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        cards.forEach(function (card) {
            card.hidden = !matches(card, query);
        });

        count.textContent = visibleCount === 1 ? '1 term shown' : visibleCount + ' terms shown';
        cloudEmpty.classList.toggle('is-visible', visibleCount === 0);
        directoryEmpty.classList.toggle('is-visible', visibleCount === 0);
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var group = button.dataset.filterGroup;
            active[group] = button.dataset.filter;
            buttons.filter(function (candidate) {
                return candidate.dataset.filterGroup === group;
            }).forEach(function (candidate) {
                candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
            });
            applyFilters();
        });
    });

    search.addEventListener('input', applyFilters);
})();
