// admin.js

// Main function to initialize the CMS
function initializeCMS() {
    setupEventListeners();
    fetchBlogs();
}

// Setup event listeners for buttons and forms
function setupEventListeners() {
    const addBlogBtn = document.querySelector('#add-blog-btn');
    const cancelBtn = document.querySelector('#cancel-btn');
    const blogForm = document.querySelector('#blog-form');

    addBlogBtn.addEventListener('click', showBlogForm);
    cancelBtn.addEventListener('click', hideBlogForm);
    blogForm.addEventListener('submit', handleFormSubmit);

    const contentField = document.querySelector('#content');
    const wordCounter = document.getElementById('word-counter');
    if (contentField && wordCounter) {
        contentField.addEventListener('input', updateWordCount);
    }
}

// Fetch and display blogs
function fetchBlogs() {
    const blogTable = document.querySelector('#blog-table tbody');
    fetch('/blogs')
        .then(response => response.json())
        .then(data => {
            blogTable.innerHTML = data.map(blog => createBlogRow(blog)).join('');
            setupEditAndDeleteButtons();
        })
        .catch(error => console.error('Error loading blogs:', error));
}

// Create a table row for a blog
function createBlogRow(blog) {
    return `
        <tr>
            <td>${blog.id}</td>
            <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${blog.date}</td>
            <td>
                <button data-id="${blog.id}" class="edit-btn">Edit</button>
                <button data-id="${blog.id}" class="delete-btn">Delete</button>
            </td>
        </tr>
    `;
}

// Setup edit and delete button event listeners
function setupEditAndDeleteButtons() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editBlog(button.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteBlog(button.dataset.id));
    });
}

// Show the blog form for adding or editing a blog
function showBlogForm() {
    const blogForm = document.querySelector('#blog-form');
    const blogFormSection = document.querySelector('#blog-form-section');
    blogForm.reset();
    blogFormSection.style.display = 'block';
}

// Hide the blog form
function hideBlogForm() {
    const blogFormSection = document.querySelector('#blog-form-section');
    blogFormSection.style.display = 'none';
}

// Update word count in the blog form
function updateWordCount() {
    const contentField = document.querySelector('#content');
    const wordCounter = document.getElementById('word-counter');
    const words = contentField.value.trim().split(/\s+/).filter(Boolean).length;
    wordCounter.textContent = `${words} words`;
}

// Handle form submission for adding or updating a blog
function handleFormSubmit(event) {
    event.preventDefault();

    const blogForm = document.querySelector('#blog-form');
    const blogFormSection = document.querySelector('#blog-form-section');

    const title = document.querySelector('#title').value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const blogData = {
        title: title,
        slug: slug,
        author: document.querySelector('#author').value,
        date: document.querySelector('#date').value,
        content: document.querySelector('#content').value,
        author_image: document.querySelector('#author-image').value || null,
        blog_image: document.querySelector('#blog-image').value || null
    };

    const method = blogForm.dataset.id ? 'PUT' : 'POST';
    const endpoint = blogForm.dataset.id ? `/blogs/${blogForm.dataset.id}` : '/blogs';

    fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
    })
        .then(() => {
            blogFormSection.style.display = 'none';
            blogForm.removeAttribute('data-id');
            fetchBlogs();
        })
        .catch(error => console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} blog:`, error));
}

// Edit a blog
function editBlog(id) {
    fetch(`/blogs/${id}`)
        .then(response => response.json())
        .then(blog => {
            if (!blog || blog.error) {
                console.error('Blog not found');
                return;
            }

            const blogForm = document.querySelector('#blog-form');
            const blogFormSection = document.querySelector('#blog-form-section');

            // Populate form fields with the retrieved blog data
            blogForm.querySelector('#title').value = blog.title || '';
            blogForm.querySelector('#author').value = blog.author || '';
            blogForm.querySelector('#date').value = blog.date || '';
            blogForm.querySelector('#content').value = blog.content || '';
            blogForm.querySelector('#author-image').value = blog.author_image || '';
            blogForm.querySelector('#blog-image').value = blog.blog_image || '';

            blogFormSection.style.display = 'block';
            blogForm.setAttribute('data-id', id);

            updateWordCount();
        })
        .catch(error => console.error('Error fetching blog:', error));
}

// Delete a blog
function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    fetch(`/blogs/${id}`, { method: 'DELETE' })
        .then(() => fetchBlogs())
        .catch(error => console.error('Error deleting blog:', error));
}

// Initialize the CMS on page load
document.addEventListener('DOMContentLoaded', initializeCMS);
