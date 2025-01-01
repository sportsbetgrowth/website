from flask import Blueprint, jsonify, request
import json

# Create a Blueprint for blogs
blogs_bp = Blueprint('blogs', __name__)

# Helper functions to load and save blogs
def load_blogs():
    with open('blogs.json', 'r') as f:
        return json.load(f)

def save_blogs(blogs):
    with open('blogs.json', 'w') as f:
        json.dump(blogs, f, indent=4)

# Route to fetch all blogs
@blogs_bp.route('/blogs', methods=['GET'])
def get_blogs():
    return jsonify(load_blogs())

# Route to add a new blog
@blogs_bp.route('/blogs', methods=['POST'])
def add_blog():
    blogs = load_blogs()
    new_blog = request.json
    new_blog['id'] = max([b['id'] for b in blogs], default=0) + 1
    blogs.append(new_blog)
    save_blogs(blogs)
    return jsonify(new_blog), 201

# Route to delete a blog
@blogs_bp.route('/blogs/<int:id>', methods=['DELETE'])
def delete_blog(id):
    blogs = load_blogs()
    blogs = [blog for blog in blogs if blog['id'] != id]
    save_blogs(blogs)
    return {"message": "Blog deleted"}, 200
