# __init__.py - Initialize Flask app
from flask import Flask, render_template
from flask_cors import CORS  # Import CORS
from config import Config
from middleware.pyddosguard import PyDDoSGuard
from api.auth import auth_bp
from api.backendpanel import panel_bp  # Renamed correctly to match Blueprint
from api.routes import routes_bp
from api.simulations import simulations_bp
from api.models import db  # Ensure models are initialized correctly

# Initialize PyDDoSGuard middleware
ddos_guard = PyDDoSGuard()

def create_app():
    app = Flask(
        __name__, 
        template_folder="../templates",  # Ensure correct template path
        static_folder="../static"         # Ensure correct static path
    )
    app.config.from_object(Config)
    db.init_app(app)

    # Enable CORS for specific origin (React frontend)
    # CORS(app, origins=["http://localhost:3080/ddosguard","http://192.168.1.8:3080/ddosguard"])  # Restrict to React frontend

    @app.before_request
    def apply_security():
        """Apply DDoS Guard security middleware before handling any request."""
        ddos_guard.middleware_flask()

    # Register blueprints with /ddosguard prefix
    app.register_blueprint(auth_bp, url_prefix="/ddosguard/api/auth")
    app.register_blueprint(panel_bp, url_prefix="/ddosguard/panel")
    app.register_blueprint(routes_bp, url_prefix="/ddosguard/api/routes")
    app.register_blueprint(simulations_bp, url_prefix="/ddosguard/api/simulations")

    # Default route for handling 404 errors (optional)
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    return app