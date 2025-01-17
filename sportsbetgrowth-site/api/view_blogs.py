import sqlite3

# Connect to the database
conn = sqlite3.connect('blogs.db')

# Create a cursor object
cursor = conn.cursor()

# View the structure of the table
cursor.execute("PRAGMA table_info(blogs)")
print("Table structure:", cursor.fetchall())

# Query all blog entries
cursor.execute("SELECT * FROM blogs")
blogs = cursor.fetchall()
print("Blogs:", blogs)

# Check the author_image field for a specific blog
cursor.execute("SELECT author_image FROM blogs WHERE id = ?", (1,))
author_image = cursor.fetchone()
print("Author image for blog ID 1:", author_image)

# Update incorrect or missing author_image fields
cursor.execute("""
    UPDATE blogs
    SET author_image = 'images/authors/default.jpg'
    WHERE author_image IS NULL OR author_image = ''
""")
conn.commit()
print("Missing author_image fields updated.")

# Close the connection
conn.close()
