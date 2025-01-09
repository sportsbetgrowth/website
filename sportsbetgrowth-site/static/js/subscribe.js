document.getElementById('newsletter-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const form = document.getElementById('newsletter-form');
    const feedback = document.createElement('p');
    feedback.id = 'form-feedback';
    feedback.style.marginTop = '10px';
    feedback.style.fontSize = '14px';

    // Remove any existing feedback
    const existingFeedback = document.getElementById('form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Simple email format validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(emailInput.value)) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = '#FF5733';
        form.appendChild(feedback);
        return;
    }

    // Show loading indicator
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

        // Display feedback to the user
        feedback.textContent = result.message;
        feedback.style.color = result.success ? '#00CC99' : '#FF5733'; // Green for success, Orange for errors
        form.appendChild(feedback);

        // Reset the form and button state
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
        feedback.style.color = '#FF5733';
        form.appendChild(feedback);

        submitButton.disabled = false;
        submitButton.textContent = 'Join Our Newsletter';
    }
});
