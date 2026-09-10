(function() {
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const status = document.getElementById('contact-form-status');
    const SUCCESS_COOLDOWN_MS = 60000;
    const SUCCESS_STORAGE_KEY = 'hadosh-contact-last-success';
    if (!form || !submitButton || !status) return;

    function setStatus(message, state) {
        status.textContent = message;
        if (state) status.setAttribute('data-state', state);
        else status.removeAttribute('data-state');
    }

    function storageTimestamp() {
        try { return Number(window.localStorage.getItem(SUCCESS_STORAGE_KEY) || 0); }
        catch (_error) { return 0; }
    }

    function rememberSuccess(timestamp) {
        try { window.localStorage.setItem(SUCCESS_STORAGE_KEY, String(timestamp)); }
        catch (_error) { /* Storage may be unavailable in strict privacy modes. */ }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (typeof emailjs === 'undefined') {
            setStatus('The contact form is temporarily unavailable. Please try again later.', 'error');
            return;
        }

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        setStatus('', '');

        const formData = new FormData(form);
        if (String(formData.get('website') || '').trim()) {
            form.reset();
            setStatus('Message received.', 'success');
            return;
        }
        const previous = storageTimestamp();
        if (previous && Date.now() - previous < SUCCESS_COOLDOWN_MS) {
            setStatus('A message was already accepted from this browser recently. Please wait before trying again.', 'error');
            return;
        }
        const isNewcomer = Boolean(formData.get('newcomer'));
        const templateParams = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            newcomer: isNewcomer ? 'Yes' : 'No',
            request_type: isNewcomer ? 'General contact · newcomer' : 'General contact'
        };

        const serviceID = 'service_chq4jnq';
        const notificationTemplateID = 'template_5he0blr';
        const welcomeTemplateID = 'template_wq2dosk';

        Promise.resolve()
            .then(function() {
                return emailjs.send(serviceID, notificationTemplateID, templateParams);
            })
            .then(function(response) {
                rememberSuccess(Date.now());
                if (!isNewcomer) return response;
                return new Promise(function(resolve) { window.setTimeout(resolve, 1100); })
                    .then(function() { return emailjs.send(serviceID, welcomeTemplateID, templateParams); })
                    .catch(function(error) {
                        console.log('WELCOME EMAIL FAILED...', error);
                        return response;
                    });
            })
            .then(function() {
                window.location.href = '/thanks.html';
            }, function(error) {
                console.log('FAILED...', error);
                setStatus('The message could not be sent. Please try again later.', 'error');
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            });
    });

    if (typeof emailjs === 'undefined') {
        setStatus('The contact form is temporarily unavailable. Please try again later.', 'error');
        return;
    }

    try {
        emailjs.init({
            publicKey: 'UrA0snZAj1om7ilbd',
            blockHeadless: true
        });
        submitButton.disabled = false;
    } catch (error) {
        console.log('FAILED TO INITIALIZE EMAIL DELIVERY...', error);
        setStatus('The contact form is temporarily unavailable. Please try again later.', 'error');
    }
})();
