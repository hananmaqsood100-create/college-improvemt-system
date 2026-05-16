from flask import Flask
from flask_cors import CORS
from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

from routes import *

with app.app_context():
    # db.create_all()
    print("✅ Database tables ban gayi!")

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')

from flask import Flask, send_from_directory
import os

@app.route('/')
def index():
    return send_from_directory('..', 'fyp.html')

@app.route('/<path:filename>')
def serve_frontend(filename):
    return send_from_directory('..', filename)
