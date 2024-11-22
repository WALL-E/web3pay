#!/usr/bin/env python3

import sqlite3

# Database initialization
DB_PATH = 'wallet.db'

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS wallet (
            owner TEXT NOT NULL PRIMARY KEY,
            publicKey TEXT NOT NULL,
            secretKey TEXT NOT NULL,
            createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        conn.commit()

if __name__ == '__main__':
    init_db()
