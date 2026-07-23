(function () {
    'use strict';

    var remoteStatus = 'https://raw.githubusercontent.com/hadi-nayebi/crime-cartography/main/public/project-status.json';
    var fallbackStatus = '../data/crime-cartography-status.json';

    function setText(id, value) {
        var element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function renderStatus(status) {
        var production = status.production || {};
        setText('project-stage', status.current_milestone && status.current_milestone.label || 'Public design');
        setText('project-next-stage', status.current_milestone && status.current_milestone.next || 'Editorial beta');
        setText('status-total', production.videos_total == null ? '—' : production.videos_total);
        setText('status-rendered', production.rendered == null ? '—' : production.rendered);
        setText('status-review', production.awaiting_editorial_review == null ? '—' : production.awaiting_editorial_review);
        setText('status-approved', production.approved_for_release == null ? '—' : production.approved_for_release);

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStatus);
    } else {
        loadStatus();
    }
})();
