// Version: v1.0.0
// Renders the human-facing What's New record and the homepage preview from
// data/whats-new.json, which remains the agent-readable source of record.

(function () {
    'use strict';

    var DATA_URL = '/data/whats-new.json';

    function element(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (typeof text === 'string') node.textContent = text;
        return node;
    }

    function safeHref(value) {
        if (typeof value !== 'string') return '#';
        if (value.charAt(0) === '/') return value;
        try {
            var url = new URL(value);
            return url.protocol === 'https:' ? value : '#';
        } catch (error) {
            return '#';
        }
    }

    function readableDate(value) {
        var parts = value.split('-').map(Number);
        var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        return new Intl.DateTimeFormat('en-US', {
            month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'
        }).format(date);
    }

    function addList(parent, label, items) {
        var row = element('div', 'update-detail-row');
        row.appendChild(element('dt', '', label));
        var value = element('dd');
        value.textContent = items.join(' · ');
        row.appendChild(value);
        parent.appendChild(row);
    }

    function entryCard(entry, compact) {
        var article = element('article', compact ? 'update-card update-card-compact' : 'update-card');
        article.setAttribute('data-update-type', entry.type.toLowerCase());

        var top = element('div', 'update-card-top');
        var date = element('time', 'update-date', readableDate(entry.date));
        date.setAttribute('datetime', entry.date);
        top.appendChild(date);
        top.appendChild(element('span', 'update-type', entry.type));
        top.appendChild(element('span', 'update-maturity', entry.maturity));
        article.appendChild(top);

        article.appendChild(element('h2', '', entry.title));
        article.appendChild(element('p', 'update-summary', entry.summary));

        if (compact) {
            var compactLink = element('a', 'card-link', 'Read the update →');
            compactLink.href = '/whats-new.html#' + entry.id;
            article.appendChild(compactLink);
            return article;
        }

        article.id = entry.id;
        var why = element('div', 'update-why');
        why.appendChild(element('h3', '', 'Why it matters'));
        why.appendChild(element('p', '', entry.why_it_matters));
        article.appendChild(why);

        var details = element('dl', 'update-details');
        addList(details, 'Affected', entry.affected);
        addList(details, 'Intended for', entry.intended_for);

        var adoptionRow = element('div', 'update-detail-row');
        adoptionRow.appendChild(element('dt', '', 'Adoption note'));
        adoptionRow.appendChild(element('dd', '', entry.adoption_notes));
        details.appendChild(adoptionRow);

        var actionRow = element('div', 'update-detail-row update-action-row');
        actionRow.appendChild(element('dt', '', 'Recommended action'));
        actionRow.appendChild(element('dd', '', entry.recommended_action));
        details.appendChild(actionRow);
        article.appendChild(details);

        var sources = element('div', 'update-sources');
        sources.appendChild(element('span', '', 'Evidence'));
        entry.sources.forEach(function (source) {
            var link = element('a', '', source.label + ' ↗');
            link.href = safeHref(source.url);
            if (link.href.indexOf(window.location.origin) !== 0) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
            sources.appendChild(link);
        });
        article.appendChild(sources);
        return article;
    }

    function renderList(host, entries) {
        var limit = Number(host.getAttribute('data-limit')) || entries.length;
        entries.slice(0, limit).forEach(function (entry) {
            host.appendChild(entryCard(entry, host.hasAttribute('data-compact')));
        });
        host.classList.remove('updates-loading');
    }

    function setUpdatedDate(value) {
        document.querySelectorAll('[data-whats-new-updated]').forEach(function (node) {
            node.textContent = readableDate(value);
            if (node.tagName === 'TIME') node.setAttribute('datetime', value);
        });
    }

    function showFailure(host) {
        host.classList.remove('updates-loading');
        host.appendChild(element('p', 'updates-error', 'The update record could not be loaded. You can read the structured JSON source directly.'));
    }

    function init() {
        var hosts = document.querySelectorAll('[data-whats-new-list]');
        if (!hosts.length) return;

        fetch(DATA_URL)
            .then(function (response) {
                if (!response.ok) throw new Error('Update source returned ' + response.status);
                return response.json();
            })
            .then(function (data) {
                setUpdatedDate(data.updated);
                hosts.forEach(function (host) { renderList(host, data.entries); });
            })
            .catch(function () {
                hosts.forEach(showFailure);
            });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
