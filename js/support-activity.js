(function () {
    'use strict';

    var activity = document.getElementById('support-activity');
    if (!activity) return;

    function renderDots(target, count, previousCount) {
        target.textContent = '';
        if (count === 0) {
            var empty = document.createElement('span');
            empty.className = 'support-dot support-dot-empty';
            empty.setAttribute('aria-hidden', 'true');
            target.appendChild(empty);
            return;
        }

        for (var i = 0; i < count; i += 1) {
            var dot = document.createElement('span');
            dot.className = 'support-dot' + (i >= previousCount ? ' support-dot-new' : '');
            dot.setAttribute('aria-hidden', 'true');
            target.appendChild(dot);
        }
    }

    fetch('data/support-activity.json')
        .then(function (response) {
            if (!response.ok) throw new Error('Support activity unavailable');
            return response.json();
        })
        .then(function (data) {
            var snapshots = data.snapshots || [];
            var current = snapshots[snapshots.length - 1];
            var previous = snapshots[snapshots.length - 2];
            if (!current || !current.tiers) throw new Error('No support snapshot');

            var targets = document.querySelectorAll('[data-support-tier]');
            targets.forEach(function (target) {
                var tier = target.getAttribute('data-support-tier');
                var count = Number(current.tiers[tier] || 0);
                var previousCount = previous && previous.tiers ? Number(previous.tiers[tier] || 0) : 0;
                renderDots(target, count, previousCount);
                target.setAttribute('aria-label', tier + ' tier: approximately ' + count + ' recent contributions');
            });

            var label = activity.querySelector('[data-support-activity-label]');
            if (label) label.textContent = current.label + ' · July 2026';
            activity.classList.add('support-activity-ready');
        })
        .catch(function () {
            activity.classList.add('support-activity-unavailable');
            var note = activity.querySelector('[data-support-activity-label]');
            if (note) note.textContent = 'The recent-support snapshot is being updated.';
        });
})();
