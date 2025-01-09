from flask import Blueprint, request, jsonify
import sqlite3
import re

# Create a Blueprint for subscription-related routes
subscriptions_bp = Blueprint('subscriptions', __name__)

# Function to validate email format
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email)

# Initialize the SQLite database
def init_db():
    conn = sqlite3.connect('subscribers.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Route to handle email subscriptions
@subscriptions_bp.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    if not is_valid_email(email):
        return jsonify({'success': False, 'message': 'Invalid email format'}), 400

    try:
        # Insert the email into the database
        conn = sqlite3.connect('subscribers.db')
        c = conn.cursor()
        c.execute('INSERT INTO subscribers (email) VALUES (?)', (email,))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Thank you for subscribing!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Email already subscribed'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': 'Could not save email'}), 500

@subscriptions_bp.route('/subscribers', methods=['GET'])
def get_subscribers():
    # Simple security check using an API key
    api_key = request.args.get('api_key')
    if api_key != 'BOSE_123_BHT':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    try:
        # Connect to the database
        conn = sqlite3.connect('subscribers.db')
        conn.row_factory = sqlite3.Row  # To return rows as dictionaries
        c = conn.cursor()
        c.execute('SELECT id, email, subscribed_at FROM subscribers')
        subscribers = [dict(row) for row in c.fetchall()]  # Convert rows to dictionaries
        conn.close()

        return jsonify({'success': True, 'subscribers': subscribers})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Could not fetch subscribers: {str(e)}'}), 500


# Script to initialize the database if run directly
if __name__ == '__main__':
    init_db()
    print("Database initialized.")
