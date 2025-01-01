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
            blog.update(updated_blog)
            save_blogs(blogs)
            return jsonify(blog), 200
    return jsonify({"error": "Blog not found"}), 404
