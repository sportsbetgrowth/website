document.addEventListener('DOMContentLoaded', () => {
    const blogTable = document.querySelector('#blog-table tbody');
    const addBlogBtn = document.querySelector('#add-blog-btn');
    const blogFormSection = document.querySelector('#blog-form-section');
    const blogForm = document.querySelector('#blog-form');
    const cancelBtn = document.querySelector('#cancel-btn');

    if (addBlogBtn && blogTable && blogFormSection && blogForm && cancelBtn) {
        console.log('Admin page detected. Initializing blog management.');

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

        // Initial blog fetch
        fetchBlogs();
    } else {
        console.warn('Admin elements not found. Skipping admin-specific logic.');
    }
});
