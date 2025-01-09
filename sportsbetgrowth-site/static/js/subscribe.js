document.getElementById('newsletter-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const form = document.getElementById('newsletter-form');

    // Reset form styles
    form.classList.remove('success', 'error');
    emailInput.placeholder = 'Your email address here';

    try {
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: emailInput.value }),
        });

        const result = await response.json();

        if (result.success) {
            // Success feedback
            form.classList.add('success');
            emailInput.value = '';
            emailInput.placeholder = "You're all signed up!";
        } else {
            // Error feedback
            form.classList.add('error');
            emailInput.value = '';
            emailInput.placeholder = "You're already subscribed!";
        }

        // Reset form styles after 5 seconds
        setTimeout(() => {
            form.classList.remove('success', 'error');
            emailInput.placeholder = 'Your email address here';
        }, 5000);
    } catch (error) {
        form.classList.add('error');
        emailInput.value = '';
        emailInput.placeholder = 'An error occurred. Please try again.';
    }
});

