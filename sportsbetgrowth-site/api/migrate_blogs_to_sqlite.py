import json
import sqlite3

# Load the blogs.json file
with open('blogs.json', 'r') as f:
    blogs = json.load(f)

# Connect to the SQLite database
conn = sqlite3.connect('blogs.db')
cursor = conn.cursor()

# Create the blogs table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL,
    date TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    media TEXT,
    author_image TEXT,
    blog_image TEXT
)
''')

# Check for existing slugs before inserting
existing_slugs = set(row[0] for row in cursor.execute('SELECT slug FROM blogs'))

# Insert data from blogs.json into the blogs table
for blog in blogs:
    print(f"Inserting: {blog['slug']}, {blog.get('author-image', '')}, {blog.get('blog-image', '')}")
    if blog['slug'] not in existing_slugs:
        cursor.execute('''
        INSERT INTO blogs (title, slug, author, date, content, tags, media, author_image, blog_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            blog.get('title'),
            blog.get('slug'),
            blog.get('author'),
            blog.get('date'),
            blog.get('content'),
            ','.join(blog.get('tags', [])),
            json.dumps(blog.get('media', [])),
            blog.get('author-image', ''),  # Default to empty string if missing
            blog.get('blog-image', '')  # Default to empty string if missing
        ))

# Commit the changes and close the connection
conn.commit()
conn.close()

print('Migration completed!')
