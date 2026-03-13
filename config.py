import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://sql12819820:hgkvdqk5cB@sql12.freesqldatabase.com:3306/sql12819820"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,       # test connection before using it
        "pool_recycle": 280,         # recycle connections every 280s (freesqldatabase timeout is ~300s)
        "connect_args": {
            "connect_timeout": 10,
        }
    }

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "local-dev-secret-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours

    ALLOWED_ORIGINS = os.environ.get(
        "ALLOWED_ORIGINS",
        "https://d-dos-guard.vercel.app,http://localhost:5173,http://localhost:3000"
    ).split(",")
