// scripts.js

// Navigation Menu Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    } else {
        console.warn('Navbar element not found. Scroll effect skipped.');
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
    loadHTML('header', 'header-footer/header.html', () => {
        const hamburger = document.querySelector('.hamburger');
        const navLinksContainer = document.querySelector('.nav-links-container');
        const navLinks = document.querySelectorAll('.nav-links a');
        const body = document.body;

        if (hamburger && navLinksContainer) {
            // Toggle menu visibility and body scroll
            hamburger.addEventListener('click', () => {
                navLinksContainer.classList.toggle('active');
                if (navLinksContainer.classList.contains('active')) {
                    hamburger.innerHTML = '&times;'; // Change to 'X'
                    body.classList.add('no-scroll'); // Disable scrolling
                } else {
                    hamburger.innerHTML = '&#9776;'; // Change back to Hamburger
                    body.classList.remove('no-scroll'); // Enable scrolling
                }
            });

            // Close menu when a link is clicked
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksContainer.classList.remove('active');
                    hamburger.innerHTML = '&#9776;';
                    body.classList.remove('no-scroll'); // Enable scrolling
                });
            });
        } else {
            console.error('Hamburger or nav-links-container not found.');
        }
    });

    loadHTML('footer', 'header-footer/footer.html'); // Load footer if needed
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

function fetchBlogs(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Logic for index.html - Populate Latest Blogs
    const latestBlogsContainer = document.querySelector('.latest-blogs .blogs-grid');
    if (latestBlogsContainer) {
        fetch('/blogs')
        .then(response => response.json())
        .then(blogs => {
            const latestBlogs = blogs.slice(0, 3); // Display only the first 3 blogs
            latestBlogsContainer.innerHTML = latestBlogs.map(blog => `
                <div class="blog-item">
                    <img src="${blog.image}" alt="${blog.title}" class="blog-author-img">
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-summary">${blog.content.substring(0, 100)}...</p>
                    <p class="blog-meta">By <span class="blog-author">${blog.author}</span> | <span class="blog-date">${blog.date}</span></p>
                    <a href="/blog-detail?id=${blog.id}" class="read-more">Read More</a>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching blogs:', error);
            latestBlogsContainer.innerHTML = '<p>Failed to load blogs. Please try again later.</p>';
        });
    }

    // Logic for blog.html - Populate All Blogs
    const blogsContainer = document.getElementById('blogs-container');
    if (blogsContainer) {
        fetch('/blogs')
            .then(response => response.json())
            .then(blogs => {
                blogsContainer.innerHTML = blogs.map(blog => `
                    <div class="blog-item">
                        <img src="${blog.image}" alt="${blog.title}" class="blog-banner-img">
                        <h2 class="blog-title">${blog.title}</h2>
                        <p class="blog-summary">${blog.content.substring(0, 200)}...</p>
                        <p class="blog-meta">By <span class="blog-author">${blog.author}</span> | <span class="blog-date">${blog.date}</span></p>
                        <a href="/blog-detail?id=${blog.id}" class="read-more">Read More</a>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                blogsContainer.innerHTML = '<p>Failed to load blogs. Please try again later.</p>';
            });
    }

    // Logic for blog-detail.html - Populate Blog Details
    if (window.location.pathname.includes('blog-detail')) {
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = parseInt(urlParams.get('id'), 10); // Extract the blog ID from the URL
    
        console.log('Blog ID from URL:', blogId); // Debugging log
    
        if (blogId) {
            fetch('/blogs')
                .then(response => {
                    if (!response.ok) throw new Error(`Error fetching blogs: ${response.status}`);
                    return response.json();
                })
                .then(blogs => {
                    console.log('Fetched blogs:', blogs); // Debugging log
                    const currentBlog = blogs.find(blog => blog.id === blogId);
                    if (!currentBlog) {
                        throw new Error('Blog not found.');
                    }
    
                    // Populate the blog content
                    document.querySelector('.blog-banner-img').src = currentBlog.image;
                    document.querySelector('.blog-title').textContent = currentBlog.title;
                    document.querySelector('.blog-author').textContent = currentBlog.author;
                    document.querySelector('.blog-date').textContent = currentBlog.date;
                    document.querySelector('.blog-content').innerHTML = `<p>${currentBlog.content}</p>`;
    
                    // Populate Previous Post
                    const currentIndex = blogs.findIndex(blog => blog.id === blogId);
                    const prevPostLink = document.querySelector('.prev-post');
                    if (currentIndex > 0) {
                        const prevBlog = blogs[currentIndex - 1];
                        prevPostLink.href = `/blog-detail?id=${prevBlog.id}`;
                        prevPostLink.textContent = `← ${prevBlog.title}`;
                    } else {
                        prevPostLink.style.display = 'none';
                    }
    
                    // Populate Next Post
                    const nextPostLink = document.querySelector('.next-post');
                    if (currentIndex < blogs.length - 1) {
                        const nextBlog = blogs[currentIndex + 1];
                        nextPostLink.href = `/blog-detail?id=${nextBlog.id}`;
                        nextPostLink.textContent = `${nextBlog.title} →`;
                    } else {
                        nextPostLink.style.display = 'none';
                    }
    
                    // Populate Related Posts
                    const relatedGrid = document.querySelector('.related-grid');
                    if (relatedGrid) {
                        const relatedBlogs = blogs.filter(blog => blog.id !== blogId).slice(0, 2);
                        relatedGrid.innerHTML = relatedBlogs.map(blog => `
                            <div class="related-item">
                                <h3>${blog.title}</h3>
                                <a href="/blog-detail?id=${blog.id}" class="read-more">Read More</a>
                            </div>
                        `).join('');
                    }
                })
                .catch(error => {
                    console.error('Error loading blog:', error);
                    document.body.innerHTML = '<p>Failed to load blog content. Please try again later.</p>';
                });
        } else {
            console.error('No blog ID provided in the URL.');
            document.body.innerHTML = '<p>No blog ID provided in the URL.</p>';
        }
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const blogTable = document.querySelector('#blog-table tbody');
    const addBlogBtn = document.querySelector('#add-blog-btn');
    const blogFormSection = document.querySelector('#blog-form-section');
    const blogForm = document.querySelector('#blog-form');
    const saveBtn = document.querySelector('#save-btn');
    const cancelBtn = document.querySelector('#cancel-btn');

    // Fetch and display blogs
    function fetchBlogs() {
        fetch('/blogs')
            .then(response => response.json())
            .then(data => {
                blogTable.innerHTML = data.map(blog => `
                    <tr>
                        <td>${blog.id}</td>
                        <td>${blog.title}</td>
                        <td>${blog.author}</td>
                        <td>${blog.date}</td>
                        <td>
                            <button data-id="${blog.id}" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => console.error('Error loading blogs:', error));
    }

    // Show blog form
    addBlogBtn.addEventListener('click', () => {
        blogForm.reset();
        blogFormSection.style.display = 'block';
    });

    // Hide blog form
    cancelBtn.addEventListener('click', () => {
        blogFormSection.style.display = 'none';
    });

    // Add a new blog
    blogForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const blogData = {
            title: document.querySelector('#title').value,
            author: document.querySelector('#author').value,
            date: document.querySelector('#date').value,
            content: document.querySelector('#content').value,
            image: document.querySelector('#image').value,
        };

        fetch('/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData),
        })
            .then(() => {
                blogFormSection.style.display = 'none';
                fetchBlogs(); // Reload blogs
            })
            .catch(error => console.error('Error adding blog:', error));
    });

    // Delete a blog
    blogTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const blogId = event.target.getAttribute('data-id');
            fetch(`/blogs/${blogId}`, { method: 'DELETE' })
                .then(() => fetchBlogs()) // Reload blogs
                .catch(error => console.error('Error deleting blog:', error));
        }
    });

    // Initial fetch
    fetchBlogs();
});
 
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    if (testimonials.length > 0 && indicators.length > 0 && prevBtn && nextBtn) {
        function updateTestimonials(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonials(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonials(currentIndex);
        });

        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                currentIndex = parseInt(indicator.dataset.index, 10);
                updateTestimonials(currentIndex);
            });
        });

        // Initialize first testimonial
        updateTestimonials(currentIndex);
    } else {
        console.warn('Testimonial section not found. Skipping testimonial functionality.');
    }
}

// Call the function
initializeTestimonials();