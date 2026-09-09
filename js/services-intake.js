(function () {
    'use strict';

    var CONSENT_VERSION = 'services-intake-v1.0';
    var PROTOCOL_MARKER = 'HADOSH_SERVICES_INTAKE_V1:';
    var MIN_FORM_AGE_MS = 5000;
    var SEND_THROTTLE_MS = 60000;
    var SUCCESS_COOLDOWN_MS = 15 * 60 * 1000;
    var SUCCESS_STORAGE_KEY = 'hadosh-services-last-success';

    // First-PR delivery route. These three values are intentionally isolated so a
    // dedicated EmailJS services template can replace the generic contact route.
    var EMAILJS_PUBLIC_KEY = 'UrA0snZAj1om7ilbd';
    var EMAILJS_SERVICE_ID = 'service_chq4jnq';
    var EMAILJS_TEMPLATE_ID = 'template_5he0blr';

    var OFFERINGS = {
        discovery: {
            title: 'Free Initial Guidance Conversation',
            price: 'Free · 30 minutes',
            description: 'Clarify the situation, compare routes, and decide whether paid work is warranted.'
        },
        individualReview: {
            title: 'Individual Harness Review',
            price: '$300 · scope adjustable',
            description: 'A focused review of your current structure, failure points, and next improvements.'
        },
        teamReview: {
            title: 'Team / Startup Harness Review',
            price: '$650 · scope adjustable',
            description: 'Review shared architecture, ownership, coordination, and operating practices.'
        },
        training: {
            title: 'Guided Harness Training',
            price: '$1,200 · four sessions over one month',
            description: 'Build skill through guided sessions and practical work inside your own system.'
        },
        initialBuild: {
            title: 'Initial Harness Build + Training',
            price: 'From $2,400 · scope adjustable',
            description: 'Build the first durable version together, with training and a path for continued cultivation.'
        },
        startupPilot: {
            title: 'Startup Dashboard + Harness Pilot',
            price: 'From $4,500 · scope adjustable',
            description: 'Create a working dashboard connected to a maintainable, team-owned harness.'
        },
        workshop: {
            title: 'Private Team Workshop',
            price: '$1,250 · scope adjustable',
            description: 'A practical workshop aligned to your team’s work, language, and immediate decisions.'
        },
        continuingIndividual: {
            title: 'Continuing Individual Guidance',
            price: '$95/month',
            description: 'Lightweight recurring guidance as your personal harness continues to change.'
        },
        continuingTeam: {
            title: 'Continuing Team Guidance',
            price: '$350/month',
            description: 'Recurring guidance for the people responsible for a changing shared harness.'
        },
        websiteGuide: {
            title: 'Build Your Own Space on the Web',
            price: 'Free practical guide',
            description: 'Publish a static personal website with GitHub Pages and learn to maintain it yourself.',
            href: '/blog/practical-guides/01-build-your-own-space-on-the-web.html',
            linkLabel: 'Open the free guide'
        },
        websiteGuided: {
            title: 'Guided Personal Website Launch',
            price: '$300 · two sessions',
            description: 'Publish your first user-owned website with guidance, while learning the whole path.'
        },
        websiteWorkspace: {
            title: 'Personal Website + Agent Workspace',
            price: 'From $650 · scope adjustable',
            description: 'Use the website as the first public surface of a user-owned agent workspace.'
        },
        support: {
            title: 'Support the Open-Source Work',
            price: 'Free to explore · optional support',
            description: 'Use the public repositories and writing, then support continued development if they help.',
            href: '/support.html',
            linkLabel: 'View support options'
        }
    };

    function values(form, name) {
        return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]:checked:not(:disabled)'))
            .map(function (input) { return input.value; });
    }

    function value(form, name) {
        var checked = form.querySelector('[name="' + name + '"]:checked:not(:disabled)');
        if (checked) return String(checked.value || '').trim();
        var field = form.querySelector('[name="' + name + '"]:not(:disabled)');
        if (!field || field.type === 'radio' || field.type === 'checkbox') return '';
        return String(field.value || '').trim();
    }

    function storageTimestamp() {
        try { return Number(window.localStorage.getItem(SUCCESS_STORAGE_KEY) || 0); }
        catch (_error) { return 0; }
    }

    function rememberSuccess(timestamp) {
        try { window.localStorage.setItem(SUCCESS_STORAGE_KEY, String(timestamp)); }
        catch (_error) { /* Storage may be unavailable in strict privacy modes. */ }
    }

    function encodePayload(payload) {
        var bytes = new TextEncoder().encode(JSON.stringify(payload));
        var binary = '';
        bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
        return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function initialize() {
        var form = document.getElementById('services-intake-form');
        if (!form) return;

        var steps = Array.prototype.slice.call(form.querySelectorAll('.services-step'));
        var nextButton = document.getElementById('services-next');
        var backButton = document.getElementById('services-back');
        var submitButton = document.getElementById('services-submit');
        var progress = document.getElementById('services-progress');
        var stepNumber = document.getElementById('services-step-number');
        var stepTotal = document.getElementById('services-step-total');
        var progressItems = Array.prototype.slice.call(document.querySelectorAll('.services-progress-list li'));
        var status = document.getElementById('services-intake-status');
        var mountedAt = Date.now();
        var currentIndex = 0;
        var sending = false;
        var emailReady = false;

        function activeRoute() {
            var primary = value(form, 'primary_help');
            var shortPath = primary === 'Support the open-source work' ||
                primary === 'Learn the foundations' ||
                primary === 'Not sure';
            return shortPath ? [0, 1, 2, 3, 4, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        }

        function applyRouteState(route) {
            steps.forEach(function (step, stepIndex) {
                var skipped = route.indexOf(stepIndex) === -1;
                step.querySelectorAll('input, select, textarea, button').forEach(function (field) {
                    if (skipped && !field.disabled) {
                        field.disabled = true;
                        field.setAttribute('data-route-disabled', 'true');
                    } else if (!skipped && field.getAttribute('data-route-disabled') === 'true') {
                        field.disabled = false;
                        field.removeAttribute('data-route-disabled');
                    }
                });
            });
        }

        function setStatus(message, state) {
            status.textContent = message;
            status.setAttribute('data-state', state || '');
        }

        function focusStep() {
            var heading = steps[currentIndex].querySelector('h2, legend');
            if (heading) window.setTimeout(function () { heading.focus(); }, 0);
        }

        function setStep(index, options) {
            var settings = options || {};
            currentIndex = Math.max(0, Math.min(index, steps.length - 1));
            var route = activeRoute();
            if (route.indexOf(currentIndex) === -1) currentIndex = route[0];
            applyRouteState(route);
            steps.forEach(function (step, stepIndex) { step.hidden = stepIndex !== currentIndex; });
            var routePosition = route.indexOf(currentIndex);
            progress.max = route.length;
            progress.value = routePosition + 1;
            progress.textContent = 'Step ' + (routePosition + 1) + ' of ' + route.length;
            stepNumber.textContent = String(routePosition + 1);
            stepTotal.textContent = String(route.length);
            progressItems.forEach(function (item, itemIndex) {
                var itemPosition = route.indexOf(itemIndex);
                item.hidden = itemPosition === -1;
                item.classList.toggle('is-current', itemIndex === currentIndex);
                item.classList.toggle('is-complete', itemPosition !== -1 && itemPosition < routePosition);
            });
            backButton.hidden = routePosition === 0;
            nextButton.hidden = routePosition === route.length - 1;
            submitButton.hidden = routePosition !== route.length - 1;
            nextButton.textContent = currentIndex === 0 ? 'Begin' : 'Continue';
            setStatus('', '');

            if (steps[currentIndex].dataset.step === 'recommendation') renderRecommendations();
            if (steps[currentIndex].dataset.step === 'contact-review') renderReview();
            if (steps[currentIndex].dataset.step === 'contact-review' && !emailReady) {
                setStatus('Email delivery is temporarily unavailable. Your answers remain in this browser while you review them.', 'error');
            }

            var hash = '#step-' + steps[currentIndex].dataset.step;
            if (settings.history !== false && window.location.hash !== hash) {
                window.history.pushState({ servicesStep: currentIndex }, '', hash);
            }
            if (settings.focus !== false) focusStep();
        }

        function checkGroup(group) {
            var checked = group.querySelectorAll('input[type="checkbox"]:checked');
            var first = group.querySelector('input[type="checkbox"]');
            var max = Number(group.dataset.max || 0);
            if (group.dataset.requiredGroup === 'true' && checked.length === 0) {
                first.setCustomValidity('Choose at least one option.');
                first.reportValidity();
                return false;
            }
            if (max && checked.length > max) {
                first.setCustomValidity('Choose no more than ' + max + ' options.');
                first.reportValidity();
                return false;
            }
            first.setCustomValidity('');
            return true;
        }

        function validateCurrentStep() {
            var step = steps[currentIndex];
            var groups = Array.prototype.slice.call(step.querySelectorAll('[data-checkbox-group]'));
            if (!groups.every(checkGroup)) return false;

            var fields = Array.prototype.slice.call(step.querySelectorAll('input, select, textarea'))
                .filter(function (field) { return !field.disabled && field.type !== 'hidden'; });
            for (var i = 0; i < fields.length; i += 1) {
                if (!fields[i].checkValidity()) {
                    fields[i].reportValidity();
                    return false;
                }
            }
            return true;
        }

        function updatePrimaryHelp() {
            var choices = values(form, 'desired_help');
            var select = document.getElementById('primary-help');
            var wrapper = document.getElementById('services-primary-choice');
            var previous = select.value;
            select.innerHTML = '<option value="">Select your priority</option>';
            choices.forEach(function (choice) {
                var option = document.createElement('option');
                option.value = choice;
                option.textContent = choice;
                select.appendChild(option);
            });
            wrapper.hidden = choices.length === 0;
            select.disabled = choices.length === 0;
            if (choices.indexOf(previous) !== -1) select.value = previous;
            else if (choices.length === 1) select.value = choices[0];
            document.getElementById('ownership-outcome').required = select.value !== 'Support the open-source work';
            if (currentIndex === 4) setStep(currentIndex, { history: false, focus: false });
        }

        function recommendationKeys() {
            var primary = value(form, 'primary_help');
            var clientType = value(form, 'client_type');
            var budget = value(form, 'budget');
            var selected = values(form, 'desired_help');
            var keys = [];

            if (primary === 'Support the open-source work') keys.push('support', 'discovery');
            else if (primary === 'Launch a personal website') {
                if (budget === 'Free resources only') keys.push('websiteGuide', 'websiteGuided');
                else if (selected.indexOf('Build an initial harness') !== -1) keys.push('websiteWorkspace', 'websiteGuided', 'websiteGuide');
                else keys.push('websiteGuided', 'websiteGuide', 'websiteWorkspace');
            } else if (primary === 'Build a startup dashboard and harness') keys.push('startupPilot', 'teamReview', 'discovery');
            else if (primary === 'Review an existing harness') keys.push(clientType === 'Individual' ? 'individualReview' : 'teamReview', clientType === 'Individual' ? 'continuingIndividual' : 'continuingTeam', 'discovery');
            else if (primary === 'Train through guided sessions') keys.push(clientType === 'Individual' ? 'training' : 'workshop', clientType === 'Individual' ? 'individualReview' : 'teamReview', 'discovery');
            else if (primary === 'Run a team workshop') keys.push('workshop', 'teamReview', 'discovery');
            else if (primary === 'Build an initial harness') keys.push('initialBuild', clientType === 'Individual' ? 'training' : 'teamReview', 'discovery');
            else if (primary === 'Learn the foundations') keys.push('discovery', 'websiteGuide', clientType === 'Individual' ? 'training' : 'workshop');
            else keys.push('discovery', clientType === 'Individual' ? 'individualReview' : 'teamReview');

            return keys.filter(function (key, index) { return keys.indexOf(key) === index; }).slice(0, 3);
        }

        function renderRecommendations() {
            var container = document.getElementById('services-recommendations');
            var preferred = value(form, 'preferred_path');
            container.innerHTML = '';
            recommendationKeys().forEach(function (key, index) {
                var offer = OFFERINGS[key];
                var item = document.createElement('div');
                item.className = 'services-recommendation-item';
                var label = document.createElement('label');
                label.className = 'services-choice services-recommendation' + (index === 0 ? ' is-primary' : '');
                var input = document.createElement('input');
                input.type = 'radio';
                input.name = 'preferred_path';
                input.value = offer.title;
                input.required = true;
                if (preferred === offer.title || (!preferred && index === 0)) input.checked = true;
                var content = document.createElement('span');
                var title = document.createElement('strong');
                title.textContent = offer.title;
                var description = document.createElement('small');
                description.textContent = offer.description;
                var price = document.createElement('span');
                price.className = 'services-rec-price';
                price.textContent = offer.price;
                content.appendChild(title);
                content.appendChild(description);
                content.appendChild(price);
                label.appendChild(input);
                label.appendChild(content);
                item.appendChild(label);
                if (offer.href) {
                    var link = document.createElement('a');
                    link.className = 'services-recommendation-link';
                    link.href = offer.href;
                    link.textContent = offer.linkLabel;
                    item.appendChild(link);
                }
                container.appendChild(item);
            });
        }

        function reviewRows() {
            var experience = value(form, 'experience');
            if (experience === 'Other') experience = value(form, 'experience_other') || 'Other';
            return [
                ['Background', experience],
                ['Context', [value(form, 'client_type'), value(form, 'role'), value(form, 'organization'), value(form, 'team_size') ? 'team size ' + value(form, 'team_size') : ''].filter(Boolean).join(' · ')],
                ['Current system', values(form, 'current_system').join(', ')],
                ['Desired help', values(form, 'desired_help').join(', ')],
                ['Priority', value(form, 'primary_help')],
                ['Desired ownership', value(form, 'ownership_outcome') || 'Not provided'],
                ['Participation', value(form, 'participation')],
                ['Practical fit', [value(form, 'timeframe'), value(form, 'sensitivity'), value(form, 'budget'), values(form, 'tools').join(', ')].filter(Boolean).join(' · ')],
                ['Suggested path', value(form, 'preferred_path')]
            ];
        }

        function renderReview() {
            var list = document.getElementById('services-review-summary');
            list.innerHTML = '';
            reviewRows().forEach(function (row) {
                var term = document.createElement('dt');
                var detail = document.createElement('dd');
                term.textContent = row[0];
                detail.textContent = row[1] || 'Not provided';
                list.appendChild(term);
                list.appendChild(detail);
            });
        }

        function payloadFromForm(formData) {
            return {
                schema_version: '1.0.0',
                action: 'request_discovery',
                consent_version: CONSENT_VERSION,
                requested_at: new Date().toISOString(),
                contact: {
                    name: String(formData.get('name') || '').trim(),
                    email: String(formData.get('email') || '').trim().toLowerCase(),
                    timezone: String(formData.get('timezone') || '').trim(),
                    availability: formData.getAll('availability')
                },
                background: {
                    experience: String(formData.get('experience') || ''),
                    experience_other: String(formData.get('experience_other') || '').trim(),
                    client_type: String(formData.get('client_type') || ''),
                    role: String(formData.get('role') || '').trim(),
                    organization: String(formData.get('organization') || '').trim(),
                    team_size: String(formData.get('team_size') || '')
                },
                project: {
                    current_system: formData.getAll('current_system'),
                    current_system_notes: String(formData.get('current_system_notes') || '').trim(),
                    desired_help: formData.getAll('desired_help'),
                    primary_help: String(formData.get('primary_help') || ''),
                    ownership_outcome: String(formData.get('ownership_outcome') || '').trim(),
                    participation: String(formData.get('participation') || ''),
                    tools: formData.getAll('tools'),
                    tools_other: String(formData.get('tools_other') || '').trim(),
                    timeframe: String(formData.get('timeframe') || ''),
                    sensitivity: String(formData.get('sensitivity') || ''),
                    budget: String(formData.get('budget') || ''),
                    preferred_path: String(formData.get('preferred_path') || ''),
                    final_note: String(formData.get('final_note') || '').trim()
                }
            };
        }

        function readableMessage(payload) {
            return [
                'Hadosh Academy services discovery request',
                'requested_at: ' + payload.requested_at,
                'preferred_path: ' + payload.project.preferred_path,
                'primary_help: ' + payload.project.primary_help,
                'client_type: ' + payload.background.client_type,
                'organization: ' + (payload.background.organization || 'not provided'),
                'role: ' + (payload.background.role || 'not provided'),
                'experience: ' + payload.background.experience + (payload.background.experience_other ? ' — ' + payload.background.experience_other : ''),
                'current_system: ' + (payload.project.current_system.join(', ') || 'not provided'),
                'current_system_notes: ' + (payload.project.current_system_notes || 'not provided'),
                'desired_help: ' + payload.project.desired_help.join(', '),
                'ownership_outcome: ' + (payload.project.ownership_outcome || 'not provided'),
                'participation: ' + payload.project.participation,
                'tools: ' + (payload.project.tools.join(', ') || 'not provided'),
                'tools_other: ' + (payload.project.tools_other || 'not provided'),
                'timeframe: ' + payload.project.timeframe,
                'sensitivity: ' + payload.project.sensitivity,
                'budget: ' + (payload.project.budget || 'not provided'),
                'timezone: ' + (payload.contact.timezone || 'not provided'),
                'availability: ' + (payload.contact.availability.join(', ') || 'not provided'),
                'final_note: ' + (payload.project.final_note || 'not provided'),
                'consent_version: ' + payload.consent_version,
                '',
                PROTOCOL_MARKER + encodePayload(payload)
            ].join('\n');
        }

        form.addEventListener('change', function (event) {
            var field = event.target;
            if (field.matches('input[name="experience"]')) {
                var other = document.getElementById('experience-other');
                var otherInput = document.getElementById('experience-other-input');
                other.hidden = field.value !== 'Other';
                otherInput.required = field.value === 'Other';
                if (field.value !== 'Other') otherInput.value = '';
            }

            if (field.matches('input[name="client_type"]')) {
                var groupContext = field.value !== 'Individual';
                document.getElementById('organization-field').hidden = !groupContext;
                document.getElementById('team-size-field').hidden = !groupContext;
                if (!groupContext) {
                    document.getElementById('organization').value = '';
                    document.getElementById('team-size').value = '';
                }
            }

            if (field.name === 'tools' && field.value === 'Other') {
                document.getElementById('tools-other-field').hidden = !field.checked;
                document.getElementById('tools-other').required = field.checked;
                if (!field.checked) document.getElementById('tools-other').value = '';
            }

            if (field.name === 'sensitivity') {
                document.getElementById('services-sensitivity-warning').hidden = field.value !== 'Potentially regulated or highly sensitive';
            }

            if (field.matches('[data-exclusive]') && field.checked) {
                field.closest('[data-checkbox-group]').querySelectorAll('input[type="checkbox"]:not([data-exclusive])')
                    .forEach(function (input) { input.checked = false; });
            } else if (field.type === 'checkbox' && field.checked) {
                var group = field.closest('[data-checkbox-group]');
                if (group) group.querySelectorAll('[data-exclusive]').forEach(function (input) { input.checked = false; });
            }

            if (field.name === 'desired_help') {
                var selected = values(form, 'desired_help');
                var maxStatus = document.getElementById('desired-help-status');
                if (selected.length > 3) {
                    field.checked = false;
                    maxStatus.textContent = 'Choose up to three options.';
                    maxStatus.setAttribute('data-state', 'error');
                } else {
                    maxStatus.textContent = selected.length ? selected.length + ' of 3 selected.' : '';
                    maxStatus.setAttribute('data-state', '');
                }
                updatePrimaryHelp();
            }

            if (field.name === 'primary_help') {
                var outcome = document.getElementById('ownership-outcome');
                outcome.required = field.value !== 'Support the open-source work';
                setStep(currentIndex, { history: false, focus: false });
            }

            if (currentIndex === steps.length - 1) renderReview();
        });

        var ownership = document.getElementById('ownership-outcome');
        ownership.addEventListener('input', function () {
            document.getElementById('ownership-count').textContent = String(ownership.value.length);
        });

        nextButton.addEventListener('click', function () {
            if (!validateCurrentStep()) return;
            var route = activeRoute();
            var routePosition = route.indexOf(currentIndex);
            setStep(route[routePosition + 1]);
        });

        backButton.addEventListener('click', function () { window.history.back(); });
        form.querySelector('[data-edit-step]').addEventListener('click', function () { setStep(1); });

        window.addEventListener('popstate', function () {
            var hashStep = window.location.hash.replace(/^#step-/, '');
            var index = steps.findIndex(function (step) { return step.dataset.step === hashStep; });
            setStep(index !== -1 ? index : 0, { history: false });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (sending) return;
            if (!validateCurrentStep() || !form.reportValidity()) return;
            if (!emailReady) {
                setStatus('Email delivery is temporarily unavailable. Your answers remain here; please try again later.', 'error');
                return;
            }
            var formData = new FormData(form);
            if (String(formData.get('website') || '').trim()) {
                form.reset();
                setStatus('Request received.', 'success');
                return;
            }
            if (Date.now() - mountedAt < MIN_FORM_AGE_MS) {
                setStatus('Please take a moment to review your answers before sending.', 'error');
                return;
            }
            var previous = storageTimestamp();
            if (previous && Date.now() - previous < SUCCESS_COOLDOWN_MS) {
                setStatus('A request was already accepted from this browser recently. Please wait before trying again.', 'error');
                return;
            }

            var payload = payloadFromForm(formData);
            if (!payload.contact.name || !payload.contact.email || payload.project.desired_help.length > 3) {
                setStatus('Please review the required fields and try again.', 'error');
                return;
            }

            sending = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending request…';
            setStatus('', '');

            window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                name: payload.contact.name,
                email: payload.contact.email,
                newcomer: 'Services discovery request',
                preferred_path: payload.project.preferred_path,
                primary_help: payload.project.primary_help,
                client_type: payload.background.client_type,
                requested_at: payload.requested_at,
                message: readableMessage(payload)
            }).then(function () {
                rememberSuccess(Date.now());
                form.reset();
                form.hidden = true;
                document.querySelector('.services-rail').hidden = true;
                document.querySelector('.services-workspace').classList.add('is-complete');
                var success = document.getElementById('services-success');
                success.hidden = false;
                success.focus();
                window.history.replaceState({}, '', '#request-received');
            }).catch(function (error) {
                if (error && error.status === 429) setStatus('Too many requests were attempted. Please wait before trying again.', 'error');
                else setStatus('The request could not be sent. Your answers remain here; please try again later.', 'error');
            }).finally(function () {
                sending = false;
                submitButton.disabled = !emailReady;
                submitButton.textContent = 'Request a discovery conversation';
            });
        });

        if (window.emailjs) {
            try {
                window.emailjs.init({
                    publicKey: EMAILJS_PUBLIC_KEY,
                    blockHeadless: true,
                    limitRate: { id: 'hadosh-services-intake', throttle: SEND_THROTTLE_MS }
                });
                emailReady = true;
                submitButton.disabled = false;
            } catch (error) {
                console.log('FAILED TO INITIALIZE SERVICES EMAIL DELIVERY...', error);
            }
        }

        var initialHash = window.location.hash.replace(/^#step-/, '');
        var initialIndex = steps.findIndex(function (step) { return step.dataset.step === initialHash; });
        setStep(initialIndex > 0 ? initialIndex : 0, { history: false, focus: false });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
    else initialize();
})();
