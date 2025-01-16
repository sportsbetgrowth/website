from flask import Flask, Blueprint, jsonify, request
import sqlite3, json

# Blueprint for blogs
blogs_bp = Blueprint('blogs', __name__)

# Function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('blogs.db')
    conn.row_factory = sqlite3.Row
    return conn

# Fetch all blogs
@blogs_bp.route('/blogs', methods=['GET'])
def get_blogs():
    conn = get_db_connection()
    blogs = conn.execute('SELECT * FROM blogs').fetchall()
    conn.close()
    return jsonify([dict(blog) for blog in blogs])

# Fetch a single blog by ID or slug
@blogs_bp.route('/blogs/<identifier>', methods=['GET'])
def get_blog(identifier):
    conn = get_db_connection()

    # Check if the identifier is an integer (ID) or a string (slug)
    if identifier.isdigit():
        blog = conn.execute('SELECT * FROM blogs WHERE id = ?', (int(identifier),)).fetchone()
    else:
        blog = conn.execute('SELECT * FROM blogs WHERE slug = ?', (identifier,)).fetchone()

    conn.close()

    if blog is None:
        return jsonify({'error': 'Blog not found'}), 404

    return jsonify(dict(blog))

# Add a new blog
@blogs_bp.route('/blogs', methods=['POST'])
def add_blog():
    new_blog = request.json
    conn = get_db_connection()
    conn.execute('''
    INSERT INTO blogs (title, slug, author, date, content, blog_image, author_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
    new_blog['title'],
    new_blog['slug'],
    new_blog['author'],
    new_blog['date'],
    new_blog['content'],
    new_blog.get('blog_image', ''),
    new_blog.get('author_image', '')
    ))
    conn.commit()
    conn.close()
    return jsonify(new_blog), 201

# Edit an existing blog
@blogs_bp.route('/blogs/<int:id>', methods=['PUT'])
def edit_blog(id):
    updated_blog = request.json
    conn = get_db_connection()
    conn.execute('''
    UPDATE blogs
    SET title = ?, slug = ?, author = ?, date = ?, content = ?, blog_image = ?, author_image = ?
    WHERE id = ?
    ''', (
    updated_blog['title'],
    updated_blog['slug'],
    updated_blog['author'],
    updated_blog['date'],
    updated_blog['content'],
    updated_blog.get('blog_image', ''),
    updated_blog.get('author_image', ''),
    id
    ))
    conn.commit()
    conn.close()
    return jsonify(updated_blog), 200

# Get blogs with pagination
@blogs_bp.route('/blogs/paginated', methods=['GET'])
def get_paginated_blogs():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 6))

    conn = get_db_connection()
    blogs = conn.execute('SELECT * FROM blogs').fetchall()
    conn.close()

    start = (page - 1) * per_page
    end = start + per_page
    paginated_blogs = blogs[start:end]

    return jsonify({
        "blogs": [dict(blog) for blog in paginated_blogs],
        "total": len(blogs),
        "page": page,
        "per_page": per_page
    })

@blogs_bp.route('/blogs/<int:id>', methods=['DELETE'])
def delete_blog(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM blogs WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return '', 204