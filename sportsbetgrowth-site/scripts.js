// scripts.js

// Navigation Menu Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for Anchor Links Only
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Apply smooth scrolling only if the link is an anchor within the current page
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Button Interaction for Image Section
const imageSectionButton = document.querySelector('.image-section .cta-button');
if (imageSectionButton) {
    imageSectionButton.addEventListener('click', () => {
        imageSectionButton.classList.add('clicked');
        setTimeout(() => {
            imageSectionButton.classList.remove('clicked');
        }, 200);
    });
}

// Ensure all DOM elements are loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }
});

// Google Analytics Initialization
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR_TRACKING_ID');

// Function to send email using EmailJS
let emailCooldown = false;

function sendEmail() {
    if (emailCooldown) {
        alert('Please wait 60 seconds before sending another message.');
        return;
    }

    const contactForm = document.getElementById('contact-form');
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Check if all fields are filled
    if (!name || !email || !message) {
        alert('Please fill in all fields before sending the message.');
        return;
    }

    emailjs.send("service_dbir5n9", "template_xgdhzf6", {
        from_name: name,
        message: message,
        reply_to: email,
    })
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        // Display a nicely formatted alert
        showAlert('Message sent successfully! Thank you for contacting us.', 'success');
        // Clear the form fields
        contactForm.reset();
        // Start cooldown
        emailCooldown = true;
        setTimeout(() => {
            emailCooldown = false;
        }, 60000); // 60 seconds cooldown
    }, (error) => {
        console.error('FAILED...', error);
        showAlert('There was an error sending your message. Please try again later.', 'error');
    });
}

// Function to show custom alert messages with better formatting
function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}