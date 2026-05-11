import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
        'mysql+pymysql://root:Hanan%4056@localhost/campus_feedback'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'campus-secret-key-2024'
ALLOWED_EMAIL_DOMAIN = '@pgcmuridke.edu.pk'