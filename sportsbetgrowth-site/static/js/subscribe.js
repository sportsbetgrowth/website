document.getElementById('newsletter-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const form = document.getElementById('newsletter-form');
    let feedback = document.getElementById('form-feedback');

    if (!feedback) {
        feedback = document.createElement('p');
        feedback.id = 'form-feedback';
        form.appendChild(feedback);
    }

    feedback.className = '';
    feedback.textContent = '';

    // Real-time validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(emailInput.value)) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.className = 'form-feedback error';
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: emailInput.value }),
        });

        const result = await response.json();
        feedback.textContent = result.message;
        feedback.className = result.success ? 'form-feedback success' : 'form-feedback error';

        if (result.success) {
            emailInput.value = '';
        }

        submitButton.disabled = false;
        submitButton.textContent = 'Join Our Newsletter';

        // Auto-hide feedback after 5 seconds
        setTimeout(() => {
            feedback.remove();
        }, 5000);
    } catch (error) {
        feedback.textContent = 'An error occurred. Please try again later.';
        feedback.className = 'form-feedback error';

        submitButton.disabled = false;
        submitButton.textContent = 'Join Our Newsletter';
    }
});
