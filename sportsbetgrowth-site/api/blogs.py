from flask import Blueprint, jsonify, request
import json

# Blueprint for blogs
blogs_bp = Blueprint('blogs', __name__)

# Helper functions to load and save blogs
def load_blogs():
    with open('blogs.json', 'r') as f:
        return json.load(f)

def save_blogs(blogs):
    with open('blogs.json', 'w') as f:
        json.dump(blogs, f, indent=4)

# Fetch all blogs
@blogs_bp.route('/blogs', methods=['GET'])
def get_blogs():
    return jsonify(load_blogs())

# Add a new blog
@blogs_bp.route('/blogs', methods=['POST'])
def add_blog():
    blogs = load_blogs()
    new_blog = request.json
    new_blog['id'] = max([blog['id'] for blog in blogs], default=0) + 1
    new_blog['author-image'] = new_blog.get('author-image', new_blog.get('image', ''))
    new_blog['blog-image'] = new_blog.get('blog-image', new_blog.get('image', ''))
    blogs.append(new_blog)
    save_blogs(blogs)
    return jsonify(new_blog), 201

# Edit an existing blog
@blogs_bp.route('/blogs/<int:id>', methods=['PUT'])
def edit_blog(id):
    blogs = load_blogs()
    updated_blog = request.json
    for blog in blogs:
        if blog['id'] == id:
            blog.update({
                "author-image": updated_blog.get('author-image', blog.get('author-image', blog['image'])),
                "blog-image": updated_blog.get('blog-image', blog.get('blog-image', blog['image']))
            })
            blog.update(updated_blog)
            save_blogs(blogs)
            return jsonify(blog), 200
    return jsonify({"error": "Blog not found"}), 404

# Get blogs with pagination
@blogs_bp.route('/blogs/paginated', methods=['GET'])
def get_paginated_blogs():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 6))

    blogs = load_blogs()
    start = (page - 1) * per_page
    end = start + per_page
    paginated_blogs = blogs[start:end]

    return jsonify({
        "blogs": paginated_blogs,
        "total": len(blogs),
        "page": page,
        "per_page": per_page
    })
