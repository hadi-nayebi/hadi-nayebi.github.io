(function () {
    'use strict';

    var form = document.getElementById('seed-access-form');
    var submit = document.getElementById('seed-access-submit');
    var status = document.getElementById('seed-access-status');
    if (!form || !submit || !status || typeof emailjs === 'undefined') return;

    emailjs.init('UrA0snZAj1om7ilbd');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submit.disabled = true;
        submit.textContent = 'Sending...';
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

        emailjs.send('service_chq4jnq', 'template_5he0blr', {
            name: data.get('name'),
            email: data.get('email'),
            message: message,
            newcomer: 'Seed access request'
        }).then(function () {
            form.reset();
            status.textContent = 'Request sent. Hadi will follow up by email.';
            submit.textContent = 'Request Sent';
        }, function () {
            status.textContent = 'The request could not be sent. Please try again or use the general contact page.';
            submit.disabled = false;
            submit.textContent = 'Send Access Request';
        });
    });
})();
