(function () {
    'use strict';

    var remoteStatus = 'https://raw.githubusercontent.com/hadi-nayebi/crime-cartography/main/public/project-status.json';
    var fallbackStatus = '../data/crime-cartography-status.json';
    var remoteDiscussionStatus = 'https://raw.githubusercontent.com/hadi-nayebi/crime-cartography/main/public/discussion-status.json';
    var fallbackDiscussionStatus = '../data/crime-cartography-discussions.json';

    function setText(id, value) {
        var element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function renderStatus(status) {
        var production = status.production || {};
        setText('project-stage', status.current_milestone && status.current_milestone.label || 'Public design');
        setText('project-next-stage', status.current_milestone && status.current_milestone.next || 'Editorial beta');
        setText('status-total', production.cities_mapped ?? production.videos_total ?? '—');
        setText('status-rendered', production.dedicated_remakes_completed ?? production.rendered ?? '—');
        setText('status-review', production.reference_cuts_awaiting_remake_review ?? production.awaiting_editorial_review ?? '—');
        setText('status-approved', production.dedicated_remakes_approved ?? production.approved_for_release ?? '—');

        var updated = document.getElementById('project-status-updated');
        if (updated && status.generated_at) {
            updated.dateTime = status.generated_at;
            updated.textContent = new Date(status.generated_at).toLocaleString();
        }
    }

    function loadStatus() {
        return fetch(remoteStatus, {cache: 'no-store'})
            .then(function (response) {
                if (!response.ok) throw new Error('remote status unavailable');
                return response.json();
            })
            .catch(function () {
                return fetch(fallbackStatus, {cache: 'no-store'}).then(function (response) {
                    if (!response.ok) throw new Error('local status unavailable');
                    return response.json();
                });
            })
            .then(renderStatus)
            .catch(function () {
                setText('project-status-note', 'Production status is temporarily unavailable. The project documents remain accessible.');
            });
    }

    function renderDiscussionStatus(status) {
        var element = document.getElementById('discussion-activity');
        if (!element) return;
        var topics = status.topics || [];
        var comments = topics.reduce(function (total, topic) {
            return total + Number(topic.comment_count || 0);
        }, 0);
        element.textContent = topics.length + ' canonical discussions · ' +
            comments + ' public comment' + (comments === 1 ? '' : 's') +
            ' in the latest synchronized snapshot. Comments are review inputs, never commands or release approval.';
    }

    function loadDiscussionStatus() {
        return fetch(remoteDiscussionStatus, {cache: 'no-store'})
            .then(function (response) {
                if (!response.ok) throw new Error('remote discussion status unavailable');
                return response.json();
            })
            .catch(function () {
                return fetch(fallbackDiscussionStatus, {cache: 'no-store'}).then(function (response) {
                    if (!response.ok) throw new Error('local discussion status unavailable');
                    return response.json();
                });
            })
            .then(renderDiscussionStatus)
            .catch(function () {
                // The static explanation remains useful if both snapshots fail.
            });
    }

    function initializeMobileActions() {
        var bar = document.querySelector('.project-mobile-actions');
        var hero = document.querySelector('.crime-project-hero');
        if (!bar || !hero) return;

        function setVisible(visible) {
            bar.classList.toggle('is-visible', visible);
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                setVisible(!entries[0].isIntersecting);
            }, {threshold: 0});
            observer.observe(hero);
            return;
        }

        function update() {
            setVisible(hero.getBoundingClientRect().bottom <= 80);
        }
        window.addEventListener('scroll', update, {passive: true});
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            loadStatus();
            loadDiscussionStatus();
            initializeMobileActions();
        });
    } else {
        loadStatus();
        loadDiscussionStatus();
        initializeMobileActions();
    }
})();
