from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample blog data
blogs = [
    {"id": 1, "title": "SportsBetGrowth Site Launch", "author": "Author 1", "date": "2024-12-20", "content": "Welcome to SportsBetGrowth!", "image": "blog1.jpg"},
    {"id": 2, "title": "What to Expect in Coming Days & Weeks", "author": "Author 2", "date": "2024-12-25", "content": "Future updates on the site.", "image": "blog2.jpg"},
]

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
    app.run(debug=True)