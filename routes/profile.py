from flask import Blueprint, request, jsonify
from database import db
from models import User
from auth_utils import login_required

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/", methods=["GET"])
@login_required
def get_profile():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


@profile_bp.route("/", methods=["PUT"])
@login_required
def update_profile():
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in ["name", "email", "address", "work", "company"]:
        if field in data:
            setattr(user, field, str(data[field]).strip())

    db.session.commit()
    return jsonify({"message": "Updated"})
