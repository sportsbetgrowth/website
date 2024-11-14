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

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinksContainer) {
        hamburgerMenu.addEventListener('click', () => {
            // Toggle the 'open' class to show or hide the nav-links
            navLinksContainer.classList.toggle('open');
            if (navLinksContainer.classList.contains('open')) {
                navLinksContainer.style.display = 'flex';
            } else {
                navLinksContainer.style.display = 'none';
            }
        });

        // Close the menu when a link is clicked
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
                navLinksContainer.style.display = 'none';
            });
        });
    }
});




