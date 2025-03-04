# routes.py - General API routes for React integration
from flask import Blueprint, request, jsonify , json
from api.models import db, User, Feedback
from middleware.pyddosguard import PyDDoSGuard

routes_bp = Blueprint("routes", __name__, url_prefix="/ddosguard/api")
ddos_guard = PyDDoSGuard()

@routes_bp.route("/status")
def status():
    return jsonify({"message": "DDoSGuard API is running."})

@routes_bp.route("/logs")
def attack_logs():
    logs = ddos_guard.redis_client.lrange("attack_logs", 0, -1)
    return jsonify({"logs": [json.loads(log) for log in logs]})

@routes_bp.route("/register", methods=["POST"])
def register():
    ddos_guard.rate_limit()
    ddos_guard.waf()

    data = request.json
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if not email or not name or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        name=name,
        email=email,
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@routes_bp.route("/feedback", methods=["POST"])
def submit_feedback():
    ddos_guard.rate_limit()
    ddos_guard.waf()

    data = request.json
    feedback = Feedback(user_id=data.get("user_id"), message=data.get("message"))
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted successfully"})

@routes_bp.route("/feedback", methods=["GET"])
def get_feedback():
    feedback_list = Feedback.query.all()
    return jsonify([{ "id": f.id, "user_id": f.user_id, "message": f.message } for f in feedback_list])