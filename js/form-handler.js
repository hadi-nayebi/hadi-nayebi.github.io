(function() {
    // Initialize EmailJS with your Public Key
    emailjs.init('UrA0snZAj1om7ilbd');

    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Change button text to indicate sending
        submitButton.innerText = 'Sending...';
        submitButton.disabled = true;

        // Collect form data
        const formData = new FormData(form);
        const templateParams = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            newcomer: formData.get('newcomer') ? 'Yes' : 'No'
        };

        // Define Service and Template IDs
        const serviceID = 'service_chq4jnq';
        const notificationTemplateID = 'template_5he0blr';
        const welcomeTemplateID = 'template_wq2dosk';

        // --- All promises array ---
        const emailPromises = [];

        // 1. Always send the notification email to the site owner
        emailPromises.push(emailjs.send(serviceID, notificationTemplateID, templateParams));

        // 2. If the newcomer checkbox is checked, send the welcome email to the user
        if (formData.get('newcomer')) {
            emailPromises.push(emailjs.send(serviceID, welcomeTemplateID, templateParams));
        }

        // --- Execute all promises ---
        Promise.all(emailPromises)
            .then(function(responses) {
                console.log('SUCCESS!', responses);
                // On success, redirect to the thank you page
                window.location.href = 'thanks.html';
            }, function(error) {
                console.log('FAILED...', error);
                // On failure, alert the user and re-enable the button
                alert('Sorry, there was an error sending your message. Please try again.');
                submitButton.innerText = 'Send Message';
                submitButton.disabled = false;
            });
    });
})();
