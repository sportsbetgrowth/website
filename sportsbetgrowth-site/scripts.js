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

// Load the header and footer dynamically
function loadHTML(selector, filePath, callback = null) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            if (callback) callback(); // Execute the callback if provided
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Ensure all DOM elements are loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically load the header and footer
    loadHTML('header', 'header.html', () => {
        // Add event listeners for the header after it's loaded
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
        } else {
            console.error('Hamburger or nav-links-container not found.');
        }
    });

    loadHTML('footer', 'footer.html'); // Load footer if needed
});

// Google Analytics Initialization
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR_TRACKING_ID');

// Function to send email using EmailJS with improvements
let emailCooldown = false;

function sendEmail() {
    if (emailCooldown) {
        showAlert('Please wait 60 seconds before sending another message.', 'warning');
        return;
    }

    const contactForm = document.getElementById('contact-form');
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Check if all fields are filled
    if (!name || !email || !message) {
        showAlert('Please fill in all fields before sending the message.', 'info');
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
        
        // Add user contact to Google Sheets
        addToGoogleSheet(name, email, message);
    }, (error) => {
        console.error('FAILED...', error);
        showAlert('There was an error sending your message. Please try again later.', 'error');
    });
}

// Function to show custom alert messages with better formatting
let alertActive = false; // Track if an alert is currently visible

function showAlert(message, type = 'error') {
    if (alertActive) {
        return; // Exit if an alert is already active
    }

    // Set the alert as active
    alertActive = true;

    // Locate the contact section and the "Contact Us" heading
    const contactSection = document.querySelector('.contact-section');
    const contactHeading = contactSection.querySelector('h2'); // The "Contact Us" heading

    // Create the alert element
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`; // Add specific class (e.g., error, success)
    alertBox.textContent = message;

    // Insert the alert box just above the "Contact Us" heading
    contactSection.insertBefore(alertBox, contactHeading);

    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
        alertBox.remove();
        alertActive = false; // Reset the alert state
    }, 5000);
}

// Function to add user contacts to Google Sheets
function addToGoogleSheet(name, email, message) {
    // Replace with your actual Google Apps Script Web App URL
    const googleScriptURL = "https://script.google.com/macros/s/AKfycbzYDoxKbsFyqDr1RntWwJHjwciMLYpSplWoWohVxHUZVEcQu32hwElIKWHi0Tt1vUeo/exec";

    // Make a POST request to the Google Apps Script
    fetch(googleScriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        }),
        mode: 'no-cors' // Add this line to disable CORS check
    })
    .then(response => {
        console.log('Request sent. Response status is opaque due to no-cors mode.');
    })
    .catch(error => {
        console.error('Error adding to Google Sheets:', error);
    });    
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});