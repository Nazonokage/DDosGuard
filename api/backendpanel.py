# backendpanel.py - Secure system panel routes with PyDDoSGuard protection
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from api.models import db, User, Feedback, IPTracking
from middleware.pyddosguard import PyDDoSGuard

ddos_guard = PyDDoSGuard(debug_logging=True)  # Enable debug logging
panel_bp = Blueprint("panel", __name__, url_prefix="/ddosguard/panel")

@panel_bp.before_request
def secure_admin():
    """
    Ensure only authenticated admins can access the panel.
    Skip security checks for the login page to avoid recursion.
    """
    # Skip security checks for the login page
    if request.endpoint == "panel.login":
        return

    # Apply DDoS Guard middleware
    ddos_guard.middleware_flask()

    # Redirect to login if user is not authenticated
    if "user_id" not in session:
        return redirect(url_for("panel.login"))

    # Fetch user from the database
    user = User.query.get(session["user_id"])
    if not user or user.account_type != "Admin":
        session.clear()  # Clear session for non-admin users
        return redirect("http://localhost:3080/ddosguard")  # Redirect to React frontend

@panel_bp.route("/")
def index():
    """
    Default route redirects to the login page.
    """
    return redirect(url_for("panel.login"))

@panel_bp.route("/feedback")
def feedback():
    """
    Render the feedback panel inside base.html.
    """
    ddos_guard.rate_limit()
    feedback_list = Feedback.query.all()
    return render_template("content/feedback.html", feedback=feedback_list, user_name=session.get("user_name"))

@panel_bp.route("/ip-tracking")
def ip_tracking():
    """
    Render the IP tracking panel inside base.html.
    """
    ddos_guard.rate_limit()
    ip_list = IPTracking.query.all()
    return render_template("content/ip_tracking.html", ip_list=ip_list, user_name=session.get("user_name"))

@panel_bp.route("/users")
def users():
    """
    Render the users panel inside base.html.
    """
    ddos_guard.rate_limit()
    user_list = User.query.all()
    return render_template("content/users.html", users=user_list, user_name=session.get("user_name"))

@panel_bp.route("/login", methods=["GET", "POST"])
def login():
    """
    Render the login page and handle authentication.
    """
    if request.method == "GET":
        # Generate a new CSRF token for the login form
         print("Rendering login.html")  # Debug statement
         csrf_token = ddos_guard.generate_csrf_token()
         return render_template("content/login.html", csrf_token=csrf_token)

    # Security checks for POST requests
    ddos_guard.rate_limit()
    ddos_guard.waf()

    # CSRF protection (skip token regeneration during POST)
    if not ddos_guard.csrf_protect(regenerate_token=False):
        flash("Invalid CSRF token. Please try again.", "danger")
        return redirect(url_for("panel.login"))

    # Handle login form submission
    data = request.form
    user = User.query.filter_by(email=data.get("email")).first()

    if user and user.check_password(data.get("password")):
        # Set session variables
        session["user_id"] = user.uid  # Use 'uid' instead of 'id'
        session["user_name"] = user.name
        session["is_admin"] = user.account_type == "Admin"
        flash("Login successful", "success")
        return redirect(url_for("panel.feedback"))  # Redirect to feedback panel after login

    # Log failed login attempts
    ddos_guard.log_attack(ddos_guard.get_ip(), "Failed Login", "Invalid credentials")
    flash("Invalid credentials", "danger")
    return redirect(url_for("panel.login"))

@panel_bp.route("/logout", methods=["GET", "POST"])
def logout():
    """
    Log out the user and redirect to the login page.
    """
    # Clear session and log out
    session.clear()
    flash("Logged out successfully", "info")
    return redirect(url_for("panel.login"))