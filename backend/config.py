import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///campus.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'campus-secret-key-2024'
ALLOWED_EMAIL_DOMAIN = '@pgcmuridke.edu.pk'