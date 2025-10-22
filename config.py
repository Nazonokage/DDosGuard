
# config.py - Configuration file
import os
class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "supersecretkey"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/ddos_simulation"
    SQLALCHEMY_TRACK_MODIFICATIONS = False