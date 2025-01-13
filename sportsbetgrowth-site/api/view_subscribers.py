import sqlite3

# Connect to the database
conn = sqlite3.connect('subscribers.db')
cursor = conn.cursor()

# Fetch all subscribers
cursor.execute('SELECT * FROM subscribers')
subscribers = cursor.fetchall()

# Print the subscribers
for subscriber in subscribers:
    print(subscriber)

# Close the connection
conn.close()
