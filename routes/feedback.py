from flask import Blueprint, request, jsonify
from database import db
from models import Feedback
from auth_utils import login_required

feedback_bp = Blueprint("feedback", __name__)


@feedback_bp.route("/", methods=["GET"])
@login_required
def list_feedback():
    items = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return jsonify([f.to_dict() for f in items])


@feedback_bp.route("/", methods=["POST"])
@login_required
def create_feedback():
    data    = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message required"}), 400
    fb = Feedback(user_id=request.user_id, message=message)
    db.session.add(fb)
    db.session.commit()
    return jsonify({"message": "Created", "id": fb.id}), 201


@feedback_bp.route("/<int:feedback_id>", methods=["PUT"])
@login_required
def update_feedback(feedback_id):
    fb = Feedback.query.filter_by(id=feedback_id, user_id=request.user_id).first()
    if not fb:
        return jsonify({"error": "Not found or not yours"}), 404
    data    = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message required"}), 400
    fb.message = message
    db.session.commit()
    return jsonify({"message": "Updated"})


@feedback_bp.route("/<int:feedback_id>", methods=["DELETE"])
@login_required
def delete_feedback(feedback_id):
    fb = Feedback.query.filter_by(id=feedback_id, user_id=request.user_id).first()
    if not fb:
        return jsonify({"error": "Not found or not yours"}), 404
    db.session.delete(fb)
    db.session.commit()
    return jsonify({"message": "Deleted"})
