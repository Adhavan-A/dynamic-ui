import sqlite3

# Connect to the database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Get all templates
cursor.execute("SELECT id, name, created_at FROM template")
rows = cursor.fetchall()

print("--- SAVED TEMPLATES ---")
for row in rows:
    print(f"ID: {row[0]} | Name: {row[1]} | Created: {row[2]}")

print(f"\nTotal templates: {len(rows)}")
conn.close()