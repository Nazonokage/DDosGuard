from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from database import db
from models import User
from auth_utils import generate_token, login_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data     = request.get_json(silent=True) or {}
    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip()
    password = data.get("password", "")
    address  = data.get("address", "")
    work     = data.get("work", "")
    company  = data.get("company", "")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    user = User(
        name=name, email=email,
        password=generate_password_hash(password),
        address=address, work=work, company=company
    )
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 400

    return jsonify({
        "message": "Registered",
        "user": {"id": user.id, "name": user.name, "type": user.type},
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data     = request.get_json(silent=True) or {}
    email    = data.get("email", "").strip()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Logged in",
        "token":   generate_token(user),
        "user":    {"id": user.id, "name": user.name, "type": user.type},
    })


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"logged_in": True, "user": user.to_dict()})


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # JWT is stateless — the client just drops the token
    return jsonify({"message": "Logged out"})
