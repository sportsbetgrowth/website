document.addEventListener('DOMContentLoaded', () => {
    const blogTable = document.querySelector('#blog-table tbody');
    const addBlogBtn = document.querySelector('#add-blog-btn');
    const blogFormSection = document.querySelector('#blog-form-section');
    const blogForm = document.querySelector('#blog-form');
    const cancelBtn = document.querySelector('#cancel-btn');
    const contentField = document.querySelector('#content');
    const wordCounter = document.getElementById('word-counter'); // Add a word counter element in your HTML

    let editingBlogId = null;

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
                            <button data-id="${blog.id}" class="edit-btn">Edit</button>
                            <button data-id="${blog.id}" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                `).join('');

                // Attach event listeners for edit and delete buttons
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', () => editBlog(button.dataset.id));
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', () => deleteBlog(button.dataset.id));
                });
            })
            .catch(error => console.error('Error loading blogs:', error));
    }

    // Show blog form
    addBlogBtn.addEventListener('click', () => {
        editingBlogId = null; // Clear editing state
        blogForm.reset();
        blogFormSection.style.display = 'block';
    });

    // Hide blog form
    cancelBtn.addEventListener('click', () => {
        blogFormSection.style.display = 'none';
    });

    // Word counter for blog content
    if (contentField && wordCounter) {
        contentField.addEventListener('input', () => {
            const words = contentField.value.trim().split(/\s+/).filter(Boolean).length;
            wordCounter.textContent = `${words} words`;
        });
    } else {
        console.warn('Content field or word counter not found.');
    }

    function editBlog(id) {
        fetch(`/blogs`)
            .then(response => response.json())
            .then(blogs => {
                const blog = blogs.find(b => b.id == id);
                if (blog) {
                    editingBlogId = id;
                    document.querySelector('#title').value = blog.title;
                    document.querySelector('#author').value = blog.author;
                    document.querySelector('#date').value = blog.date;
                    document.querySelector('#content').value = blog.content;
                    document.querySelector('#image').value = blog.image;
                    blogFormSection.style.display = 'block';
    
                    // Update word counter when editing a blog
                    const words = blog.content.trim().split(/\s+/).filter(Boolean).length;
                    wordCounter.textContent = `${words} words`;
                }
            })
            .catch(error => console.error('Error fetching blog:', error));
    }

    // Submit the blog form
    blogForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const blogData = {
            title: document.querySelector('#title').value,
            author: document.querySelector('#author').value,
            date: document.querySelector('#date').value,
            content: document.querySelector('#content').value,
            image: document.querySelector('#image').value,
        };

        const method = editingBlogId ? 'PUT' : 'POST';
        const endpoint = editingBlogId ? `/blogs/${editingBlogId}` : '/blogs';

        fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData),
        })
            .then(() => {
                blogFormSection.style.display = 'none';
                editingBlogId = null; // Clear editing state
                fetchBlogs(); // Reload blogs
            })
            .catch(error => console.error(`Error ${editingBlogId ? 'updating' : 'adding'} blog:`, error));
    });

    // Fetch initial blogs
    fetchBlogs();
});

