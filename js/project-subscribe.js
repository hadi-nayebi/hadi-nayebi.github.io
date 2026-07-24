(function () {
    'use strict';

    var CONSENT_VERSION = 'crime-cartography-public-design-v1.0';
    var PROJECT_ID = 'crime-cartography';
    var PROTOCOL_MARKER = 'CRIME_CARTOGRAPHY_SUBSCRIPTION_V1:';
    var MIN_FORM_AGE_MS = 4000;
    var SEND_THROTTLE_MS = 60000;
    var SUCCESS_COOLDOWN_MS = 15 * 60 * 1000;
    var SUCCESS_STORAGE_KEY = 'crime-cartography-subscribe-last-success';

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

    function lastSuccessfulRequest() {
        try {
            return Number(window.localStorage.getItem(SUCCESS_STORAGE_KEY) || 0);
        } catch (_error) {
            return 0;
        }
    }

    function rememberSuccessfulRequest(timestamp) {
        try {
            window.localStorage.setItem(SUCCESS_STORAGE_KEY, String(timestamp));
        } catch (_error) {
            // Storage can be unavailable in strict privacy modes. Provider-side
            // controls remain the authoritative abuse boundary.
        }
    }

    function initialize() {
        var form = document.getElementById('project-subscribe-form');
        var submit = document.getElementById('project-subscribe-submit');
        if (!form || !submit) return;
        var mountedAt = Date.now();
        var sending = false;

        if (!window.emailjs) {
            submit.disabled = true;
            setStatus('Email subscription is temporarily unavailable. You can still comment through GitHub.', 'error');
            return;
        }

        window.emailjs.init({
            publicKey: 'UrA0snZAj1om7ilbd',
            blockHeadless: true,
            limitRate: {
                id: 'crime-cartography-subscribe',
                throttle: SEND_THROTTLE_MS
            }
        });
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (sending) return;
            var formData = new FormData(form);
            if (String(formData.get('website') || '').trim()) {
                form.reset();
                setStatus('Request received.', 'success');
                return;
            }
            if (Date.now() - mountedAt < MIN_FORM_AGE_MS) {
                setStatus('Please take a moment to review the form before sending.', 'error');
                return;
            }
            var previousSuccess = lastSuccessfulRequest();
            if (previousSuccess && Date.now() - previousSuccess < SUCCESS_COOLDOWN_MS) {
                setStatus('A request was already accepted from this browser recently. Please wait before trying again.', 'error');
                return;
            }
            var consent = formData.get('consent');
            if (!consent) {
                setStatus('Please confirm the project-email and data-processing notice.', 'error');
                return;
            }

            var interests = selectedInterests(form);
            var name = String(formData.get('name') || '').trim();
            var email = String(formData.get('email') || '').trim().toLowerCase();
            if (name.length > 80 || email.length > 254 || interests.length > 3) {
                setStatus('The request contains an invalid or oversized field.', 'error');
                return;
            }
            if (!form.reportValidity()) return;
            var requestedAt = new Date().toISOString();
            var subscription = {
                schema_version: '1.0.0',
                action: 'subscribe',
                project_id: PROJECT_ID,
                name: name || null,
                email: email,
                interests: interests,
                consent_version: CONSENT_VERSION,
                requested_at: requestedAt
            };
            sending = true;
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
                email: email,
                newcomer: 'Crime Cartography Project Subscriber',
                message: message
            }).then(function () {
                rememberSuccessfulRequest(Date.now());
                form.reset();
                setStatus('EmailJS accepted the request. The address is still unconfirmed; confirmation will arrive only after that workflow is active.', 'success');
            }).catch(function (error) {
                if (error && error.status === 429) {
                    setStatus('Too many requests were attempted. Please wait before trying again.', 'error');
                    return;
                }
                setStatus('The request could not be sent. Please try again later or use the GitHub feedback link.', 'error');
            }).finally(function () {
                sending = false;
                submit.disabled = false;
                submit.textContent = 'Send project-email request';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
