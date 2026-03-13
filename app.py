import os
from flask import Flask, render_template_string, jsonify
from flask_cors import CORS
from config import Config
from database import db
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.feedback import feedback_bp

PAGE = """
<!DOCTYPE html>
<html>
<head><title>DDoSGuard API</title></head>
<body style="margin:0;background:#0f172a;color:#e2e8f0;font-family:monospace;
             display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center">
    <h1 style="color:#60a5fa;font-size:2rem;margin-bottom:.5rem">DDoSGuard API</h1>
    <p style="font-size:1.1rem;margin:.4rem 0">
      DB: <span style="color:{{ 'lime' if ok else 'tomato' }}">{{ status }}</span>
    </p>
    <p style="color:#94a3b8;font-size:.8rem;margin:.4rem 0">{{ detail }}</p>
    <hr style="border-color:#1e293b;margin:1.5rem auto;width:80%">
    <p style="color:#475569;font-size:.75rem;line-height:1.8rem">
      POST /api/auth/register<br>
      POST /api/auth/login<br>
      GET &nbsp;/api/auth/me<br>
      GET &nbsp;/api/profile/ &nbsp;|&nbsp; PUT /api/profile/<br>
      GET &nbsp;/api/feedback/ &nbsp;|&nbsp; POST /api/feedback/<br>
      PUT &nbsp;/api/feedback/&lt;id&gt; &nbsp;|&nbsp; DELETE /api/feedback/&lt;id&gt;
    </p>
  </div>
</body>
</html>
"""


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": Config.ALLOWED_ORIGINS}})

    db.init_app(app)

    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(profile_bp,  url_prefix="/api/profile")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")

    with app.app_context():
        try:
            db.create_all()
            print("✓ DB tables ready")
        except Exception as e:
            print(f"✗ DB error on startup: {e}")

    # Global error handler — returns JSON instead of HTML for API errors
    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500

    @app.route("/")
    def index():
        try:
            db.session.execute(db.text("SELECT 1"))
            db_info = app.config["SQLALCHEMY_DATABASE_URI"].split("@")[-1]
            return render_template_string(PAGE, ok=True,
                                          status="Connected ✓", detail=db_info)
        except Exception as e:
            return render_template_string(PAGE, ok=False,
                                          status="Not connected ✗", detail=str(e))

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
