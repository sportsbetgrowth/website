from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('blogs.json') as f:
    blogs = json.load(f)

@app.route('/blogs', methods=['GET'])
def get_blogs():
    return jsonify(blogs)

@app.route('/blogs/<int:id>', methods=['GET'])
def get_blog(id):
    blog = next((b for b in blogs if b["id"] == id), None)
    if blog:
        return jsonify(blog)
    return {"error": "Blog not found"}, 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    