(function () {
    'use strict';

    var form = document.getElementById('seed-access-form');
    var submit = document.getElementById('seed-access-submit');
    var status = document.getElementById('seed-access-status');
    if (!form || !submit || !status) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (typeof emailjs === 'undefined') {
            status.setAttribute('data-state', 'error');
            status.textContent = 'The request form is temporarily unavailable. Please try again later.';
            return;
        }

        submit.disabled = true;
        submit.textContent = 'Sending...';
        status.removeAttribute('data-state');
        status.textContent = '';

        var data = new FormData(form);
        var message = [
            'Seed Agent early-access request',
            '',
            'Experience: ' + data.get('experience'),
            'Tools/frameworks: ' + (data.get('tools') || 'Not provided'),
            '',
            'What they want to study or build:',
            data.get('goal'),
            '',
            'Experimental-access acknowledgment: Yes'
        ].join('\n');

        Promise.resolve().then(function () {
            return emailjs.send('service_chq4jnq', 'template_5he0blr', {
                name: data.get('name'),
                email: data.get('email'),
                message: message,
                newcomer: 'Seed access request'
            });
        }).then(function () {
            form.reset();
            status.setAttribute('data-state', 'success');
            status.textContent = 'Request sent. A reply will follow by email.';
            submit.textContent = 'Request Sent';
        }, function () {
            status.setAttribute('data-state', 'error');
            status.textContent = 'The request could not be sent. Please try again or use the general contact page.';
            submit.disabled = false;
            submit.textContent = 'Send Access Request';
        });
    });

    if (typeof emailjs === 'undefined') {
        status.setAttribute('data-state', 'error');
        status.textContent = 'The request form is temporarily unavailable. Please try again later.';
        return;
    }

    try {
        emailjs.init('UrA0snZAj1om7ilbd');
        submit.disabled = false;
    } catch (error) {
        console.log('FAILED TO INITIALIZE EMAIL DELIVERY...', error);
        status.setAttribute('data-state', 'error');
        status.textContent = 'The request form is temporarily unavailable. Please try again later.';
    }
})();
