from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory('.', filename)

# Load blogs from JSON file
def load_blogs():
    with open('blogs.json', 'r') as f:
        return json.load(f)

# Save blogs to JSON file
def save_blogs(blogs):
    with open('blogs.json', 'w') as f:
        json.dump(blogs, f, indent=4)

# Serve Frontend Pages
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/blog')
def blog():
    return send_from_directory('.', 'blog.html')

@app.route('/blog-detail')
def blog_detail():
    return send_from_directory('.', 'blog-detail.html')

# CMS Admin Page
@app.route('/admin', methods=['GET'])
def admin():
    return send_from_directory('.', 'admin.html')

# API Endpoints
@app.route('/blogs', methods=['GET'])
def get_blogs():
    return jsonify(load_blogs())

@app.route('/blogs', methods=['POST'])
def add_blog():
    blogs = load_blogs()
    new_blog = request.json
    new_blog['id'] = max([b['id'] for b in blogs], default=0) + 1
    blogs.append(new_blog)
    save_blogs(blogs)
    return jsonify(new_blog), 201

@app.route('/blogs/<int:id>', methods=['DELETE'])
def delete_blog(id):
    blogs = load_blogs()
    blogs = [blog for blog in blogs if blog['id'] != id]
    save_blogs(blogs)
    return {"message": "Blog deleted"}, 200

@app.route('/blogs/<int:id>', methods=['PUT'])
def update_blog(id):
    blogs = load_blogs()
    updated_blog = request.json
    for i, blog in enumerate(blogs):
        if blog['id'] == id:
            blogs[i].update(updated_blog)  # Update only the provided fields
            save_blogs(blogs)
            return jsonify(blogs[i]), 200
    return {"error": "Blog not found"}, 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)