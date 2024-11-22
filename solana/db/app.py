#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import sqlite3
import os
from datetime import datetime
from dotenv import dotenv_values

app = Flask(__name__)
api = Api(app)

# Database initialization
DB_PATH = 'wallet.db'

class WalletResource(Resource):
    def post(self):
        """Insert a new wallet"""
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['owner', 'publicKey', 'secretKey']):
            return {'error': 'Missing required fields'}, 400
        
        try:
            with sqlite3.connect(DB_PATH) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO wallet (owner, publicKey, secretKey) 
                    VALUES (?, ?, ?)
                ''', (data['owner'], data['publicKey'], data['secretKey']))
                conn.commit()
            return {'message': 'Wallet created successfully'}, 201
        except sqlite3.IntegrityError:
            return {'error': 'Wallet for this owner already exists'}, 409
        except Exception as e:
            return {'error': str(e)}, 500

    def get(self):
        """Retrieve wallet details"""
        owner = request.args.get('owner')
        
        if not owner:
            return {'error': 'Owner parameter is required'}, 400
        
        try:
            with sqlite3.connect(DB_PATH) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM wallet WHERE owner = ?', (owner,))
                wallet = cursor.fetchone()
                
                if wallet:
                    return dict(wallet), 200
                else:
                    return {'error': 'Wallet not found'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

# Add resources to API
api.add_resource(WalletResource, '/wallet')

if __name__ == '__main__':
    config = dotenv_values(".env")
    app.run(debug=True, port=5000)
