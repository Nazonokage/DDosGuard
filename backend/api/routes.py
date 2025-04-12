# routes.py - General API routes for React integration
from flask import Blueprint, request, jsonify, json, session
from api.models import db, User, Feedback
from middleware.pyddosguard import PyDDoSGuard
from flask import send_file
import os

routes_bp = Blueprint("routes", __name__, url_prefix="/ddosguard/api")
ddos_guard = PyDDoSGuard()

@routes_bp.route("/download-pyddosguard", methods=["GET"])
def download_pyddosguard():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "middleware", "pyddosguard.py")
    print("File Path:", file_path)  # Debugging
    return send_file(file_path, as_attachment=True, download_name="pyddosguard.py")

@routes_bp.route("/status")
def status():
    return jsonify({"message": "DDoSGuard API is running."})

@routes_bp.route("/logs")
def attack_logs():
    logs = ddos_guard.redis_client.lrange("attack_logs", 0, -1)
    return jsonify({"logs": [json.loads(log) for log in logs]})

@routes_bp.route("/feedback", methods=["POST"])
def submit_feedback():
    ddos_guard.rate_limit()
    ddos_guard.waf()

    data = request.json
    user_id = session.get("user_id")  # Get the current user's ID from the session
    if not user_id:
        return jsonify({"error": "User not authenticated"}), 401

    feedback = Feedback(user_id=user_id, message=data.get("message"))
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted successfully"})

@routes_bp.route("/feedback", methods=["GET"])
def get_feedback():
    user_id = session.get("user_id")  # Get the current user's ID from the session
    if not user_id:
        return jsonify({"error": "User not authenticated"}), 401

    feedback_list = Feedback.query.filter_by(user_id=user_id).all()
    return jsonify([{ "fb_id": f.fb_id, "user_id": f.user_id, "message": f.message } for f in feedback_list])

@routes_bp.route("/feedback/<int:feedback_id>", methods=["DELETE"])
def delete_feedback(feedback_id):
    ddos_guard.rate_limit()
    ddos_guard.waf()

    user_id = session.get("user_id")  # Get the current user's ID from the session
    if not user_id:
        return jsonify({"error": "User not authenticated"}), 401

    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404

    if feedback.user_id != user_id:
        return jsonify({"error": "Unauthorized to delete this feedback"}), 403

    db.session.delete(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback deleted successfully"})

@routes_bp.route("/feedback/<int:feedback_id>", methods=["PUT"])
def update_feedback(feedback_id):
    ddos_guard.rate_limit()
    ddos_guard.waf()

    user_id = session.get("user_id")  # Get the current user's ID from the session
    if not user_id:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.json
    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404

    if feedback.user_id != user_id:
        return jsonify({"error": "Unauthorized to update this feedback"}), 403

    feedback.message = data.get("message", feedback.message)
    db.session.commit()
    return jsonify({"message": "Feedback updated successfully"})

@routes_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    ddos_guard.rate_limit()
    ddos_guard.waf()
    ddos_guard.csrf_protect()

    data = request.get_json()
    user_id = data.get('userId')
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    # Check if user is authenticated
    if 'user_id' not in session or session['user_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # Update profile fields
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.address = data.get('address', user.address)
        user.work = data.get('work', user.work)
        user.company = data.get('company', user.company)

        # Handle password change if requested
        if new_password:
            if not current_password or not user.check_password(current_password):
                return jsonify({'error': 'Current password is incorrect'}), 400
            user.set_password(new_password)

        db.session.commit()
        
        # Update session if name changed
        if 'name' in data:
            session['user_name'] = data['name']
            
        return jsonify({'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Update failed'}), 500
    

@routes_bp.route('/user-profile', methods=['GET'])
def get_user_profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'name': user.name,
        'email': user.email,
        'address': user.address,
        'work': user.work,
        'company': user.company
    })