document.getElementById('newsletter-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const form = document.getElementById('newsletter-form');
    const honeypot = form.querySelector('input[name="honeypot"]');

    // Reset form styles
    form.classList.remove('success', 'error');
    emailInput.placeholder = 'Your email address here';

    // 🛠 Honeypot Spam Protection
    if (honeypot && honeypot.value) {
        return; // If the honeypot is filled, likely a bot, so do nothing
    }

    // 🛠 Prevent Empty Email Submission
    if (emailInput.value.trim() === '') {
        form.classList.add('error');
        emailInput.placeholder = 'Please enter your email address.';
        return;
    }

    // 🛠 Handle Offline Submissions
    if (!navigator.onLine) {
        form.classList.add('error');
        emailInput.value = '';
        emailInput.placeholder = 'You appear to be offline. Please check your connection.';
        return;
    }

    try {
        // Show loading state (optional)
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: emailInput.value }),
        });

        const result = await response.json();

        // 🛠 Success Feedback
        if (result.success) {
            form.classList.add('success');
            emailInput.value = '';
            emailInput.placeholder = "You're all signed up!";
        } else {
            // 🛠 Error Feedback
            form.classList.add('error');
            emailInput.value = '';
            emailInput.placeholder = result.message || "You're already subscribed!";
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

