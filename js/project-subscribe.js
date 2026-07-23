(function () {
    'use strict';

    var CONSENT_VERSION = 'crime-cartography-public-design-v0.9';
    var PROJECT_ID = 'crime-cartography';
    var PROTOCOL_MARKER = 'CRIME_CARTOGRAPHY_SUBSCRIPTION_V1:';

    function base64UrlJson(value) {
        var bytes = new TextEncoder().encode(JSON.stringify(value));
        var binary = '';
        bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }

    function selectedInterests(form) {
        return Array.prototype.slice.call(form.querySelectorAll('input[name="interests"]:checked'))
            .map(function (input) { return input.value; });
    }

    function setStatus(message, state) {
        var status = document.getElementById('project-subscribe-status');
        if (!status) return;
        status.textContent = message;
        status.setAttribute('data-state', state || '');
    }

    function initialize() {
        var form = document.getElementById('project-subscribe-form');
        var submit = document.getElementById('project-subscribe-submit');
        if (!form || !submit) return;

        if (!window.emailjs) {
            submit.disabled = true;
            setStatus('Email subscription is temporarily unavailable. You can still comment through GitHub.', 'error');
            return;
        }

        window.emailjs.init('UrA0snZAj1om7ilbd');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var formData = new FormData(form);
            var consent = formData.get('consent');
            if (!consent) {
                setStatus('Please confirm the project-email and data-processing notice.', 'error');
                return;
            }

            var interests = selectedInterests(form);
            var requestedAt = new Date().toISOString();
            var subscription = {
                schema_version: '1.0.0',
                action: 'subscribe',
                project_id: PROJECT_ID,
                name: String(formData.get('name') || '').trim() || null,
                email: String(formData.get('email') || '').trim().toLowerCase(),
                interests: interests,
                consent_version: CONSENT_VERSION,
                requested_at: requestedAt
            };
            submit.disabled = true;
            submit.textContent = 'Sending request…';
            setStatus('', '');

            var message = [
                'Project subscription request',
                'project_id: ' + PROJECT_ID,
                'consent_version: ' + CONSENT_VERSION,
                'interests: ' + (interests.length ? interests.join(', ') : 'general project updates'),
                'requested_at: ' + requestedAt,
                '',
                'The subscriber requested project updates and invitations to participate in pre-publication editorial review.',
                '',
                PROTOCOL_MARKER + base64UrlJson(subscription)
            ].join('\n');

            window.emailjs.send('service_chq4jnq', 'template_5he0blr', {
                name: formData.get('name') || 'Project subscriber',
                email: formData.get('email'),
                newcomer: 'Crime Cartography Project Subscriber',
                message: message
            }).then(function () {
                form.reset();
                setStatus('Request received. We will confirm the project subscription by email.', 'success');
            }).catch(function () {
                setStatus('The request could not be sent. Please try again or use the GitHub feedback link.', 'error');
            }).finally(function () {
                submit.disabled = false;
                submit.textContent = 'Subscribe to this project';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
