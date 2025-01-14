from flask import Flask, render_template, send_from_directory
from api.blogs import blogs_bp
from api.subscriptions import subscriptions_bp
import sqlite3

app = Flask(__name__, static_folder='static', template_folder='templates')

# Register the blogs Blueprint
app.register_blueprint(blogs_bp)
app.register_blueprint(subscriptions_bp)

# Function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('blogs.db')
    conn.row_factory = sqlite3.Row
    return conn

# Serve the main templates
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/blog-detail/<slug>')
def blog_detail(slug):
    conn = get_db_connection()
    blog = conn.execute('SELECT * FROM blogs WHERE slug = ?', (slug,)).fetchone()
    conn.close()
    if not blog:
        return "Blog not found", 404
    return render_template('blog-detail.html', blog=dict(blog))

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

# Serve static files (CSS, JS, images)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Serve header and footer dynamically
@app.route('/header-footer/<path:filename>')
def header_footer(filename):
    return send_from_directory('header-footer', filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
