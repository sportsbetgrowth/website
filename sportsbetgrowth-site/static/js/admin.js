// admin.js

// Main function to initialize the CMS
function initializeCMS() {
    setupEventListeners();
    fetchBlogs();
}

// Setup event listeners for buttons and forms
function setupEventListeners() {
    document.querySelector('#add-blog-btn').addEventListener('click', showBlogForm);
    document.querySelector('#cancel-btn').addEventListener('click', hideBlogForm);
    document.querySelector('#blog-form').addEventListener('submit', handleFormSubmit);

    const contentField = document.querySelector('#content');
    if (contentField) {
        contentField.addEventListener('input', updateWordCount);
    }
}

// Fetch and display blogs
async function fetchBlogs() {
    try {
        const response = await fetch('/blogs');
        const blogs = await response.json();
        const blogTable = document.querySelector('#blog-table tbody');
        blogTable.innerHTML = blogs.map(createBlogRow).join('');
        setupEditAndDeleteButtons();
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
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
    blogForm.reset();
    document.querySelector('#blog-form-section').style.display = 'block';
}

// Hide the blog form
function hideBlogForm() {
    document.querySelector('#blog-form-section').style.display = 'none';
}

// Update word count in the blog form
function updateWordCount() {
    const contentField = document.querySelector('#content');
    const wordCounter = document.getElementById('word-counter');
    const words = contentField.value.trim().split(/\s+/).filter(Boolean).length;
    wordCounter.textContent = `${words} words`;
}

// Handle form submission for adding or updating a blog
async function handleFormSubmit(event) {
    event.preventDefault();

    const blogForm = document.querySelector('#blog-form');
    const blogData = {
        title: document.querySelector('#title').value,
        slug: generateSlug(document.querySelector('#title').value),
        author: document.querySelector('#author').value,
        date: document.querySelector('#date').value,
        content: document.querySelector('#content').value,
        blog_image: document.querySelector('#blog-image').value || '',
        author_image: document.querySelector('#author-image').value || ''
    };

    const method = blogForm.dataset.id ? 'PUT' : 'POST';
    const endpoint = blogForm.dataset.id ? `/blogs/${blogForm.dataset.id}` : '/blogs';

    try {
        await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData)
        });
        document.querySelector('#blog-form-section').style.display = 'none';
        blogForm.removeAttribute('data-id');
        fetchBlogs();
    } catch (error) {
        console.error(`Error ${method === 'PUT' ? 'updating' : 'adding'} blog:`, error);
    }
}

// Generate a slug from the title
function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Edit a blog
async function editBlog(id) {
    try {
        const response = await fetch(`/blogs/${id}`);
        const blog = await response.json();

        if (!blog || blog.error) {
            console.error('Blog not found');
            return;
        }

        const blogForm = document.querySelector('#blog-form');
        blogForm.querySelector('#title').value = blog.title || '';
        blogForm.querySelector('#author').value = blog.author || '';
        blogForm.querySelector('#date').value = blog.date || '';
        blogForm.querySelector('#content').value = blog.content || '';
        blogForm.querySelector('#blog-image').value = blog.blog_image || '';
        blogForm.querySelector('#author-image').value = blog.author_image || '';

        document.querySelector('#blog-form-section').style.display = 'block';
        blogForm.setAttribute('data-id', id);

        updateWordCount();
    } catch (error) {
        console.error('Error fetching blog:', error);
    }
}

// Delete a blog
async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
        await fetch(`/blogs/${id}`, { method: 'DELETE' });
        fetchBlogs();
    } catch (error) {
        console.error('Error deleting blog:', error);
    }
}

// Initialize the CMS on page load
document.addEventListener('DOMContentLoaded', initializeCMS);
