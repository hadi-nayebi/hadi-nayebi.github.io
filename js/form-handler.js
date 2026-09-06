(function() {
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const status = document.getElementById('contact-form-status');
    if (!form || !submitButton || !status) return;

    function setStatus(message, state) {
        status.textContent = message;
        if (state) status.setAttribute('data-state', state);
        else status.removeAttribute('data-state');
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
        const templateParams = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            newcomer: formData.get('newcomer') ? 'Yes' : 'No'
        };

        const serviceID = 'service_chq4jnq';
        const notificationTemplateID = 'template_5he0blr';
        const welcomeTemplateID = 'template_wq2dosk';

        const emailRequests = [
            function() {
                return emailjs.send(serviceID, notificationTemplateID, templateParams);
            }
        ];
        if (formData.get('newcomer')) {
            emailRequests.push(function() {
                return emailjs.send(serviceID, welcomeTemplateID, templateParams);
            });
        }

        Promise.all(emailRequests.map(function(send) {
            return Promise.resolve().then(send);
        }))
            .then(function(responses) {
                console.log('SUCCESS!', responses);
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
        emailjs.init('UrA0snZAj1om7ilbd');
        submitButton.disabled = false;
    } catch (error) {
        console.log('FAILED TO INITIALIZE EMAIL DELIVERY...', error);
        setStatus('The contact form is temporarily unavailable. Please try again later.', 'error');
    }
})();
