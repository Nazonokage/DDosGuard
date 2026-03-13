class Config:
    # ── LOCAL (XAMPP) ──────────────────────────────────────────────────────────
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:@localhost/capstone_db"
    )

    # ── PRODUCTION (freesqldatabase.com) ── uncomment when deploying ──────────
    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://sql12819820:hgkvdqk5cB@sql12.freesqldatabase.com:3306/sql12819820"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Change this to any long random string in production
    JWT_SECRET_KEY = "local-dev-secret-change-in-prod"
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours

    # ── LOCAL origins (Vite default is 5173) ───────────────────────────────────
    # ALLOWED_ORIGINS = [
    #     "http://localhost:5173",
    #     "http://localhost:3000",
    #     "http://localhost:3080",
    #     "http://127.0.0.1:5173",
    #     "http://127.0.0.1:3000",
    #     "http://127.0.0.1:3080",
    # ]

    # ── PRODUCTION origins ── uncomment and add your Vercel URL when deploying ─
    ALLOWED_ORIGINS = [
        "https://d-dos-guard.vercel.app",
        "http://localhost:5173",
    ]