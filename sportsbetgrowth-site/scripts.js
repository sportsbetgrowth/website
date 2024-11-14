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

// Hamburger Menu Toggle
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinksContainer = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
});

// Close Menu When Link is Clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
    });
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollToTopBtn';
scrollToTopBtn.innerText = '↑';
scrollToTopBtn.classList.add('scrollToTop');
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
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

// Update Testimonials Section to Match Blog Teasers on Mobile
const testimonialsSection = document.querySelector('.testimonials');
const testimonialsCards = document.querySelectorAll('.testimonial');

if (window.innerWidth <= 768) {
    testimonialsCards.forEach(card => {
        card.style.display = 'inline-block';
        card.style.backgroundColor = '#f4f4f4';
        card.style.padding = '20px';
        card.style.margin = '20px';
        card.style.borderRadius = '8px';
        card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
}




