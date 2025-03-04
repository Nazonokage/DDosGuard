from flask import Blueprint, request, session, jsonify
from api.models import User, db
from middleware.pyddosguard import PyDDoSGuard
import hashlib
import time

auth_bp = Blueprint("auth", __name__, url_prefix="/ddosguard/auth")
ddos_guard = PyDDoSGuard()

@auth_bp.route('/get-csrf-token', methods=['GET'])
def get_csrf_token():
    """Generate and return CSRF token for React frontend"""
    token = ddos_guard.generate_csrf_token()
    return jsonify({'csrf_token': token})

@auth_bp.route('/register', methods=['POST'])
def register():
    # Apply security middleware
    ddos_guard.rate_limit()
    ddos_guard.waf()
    ddos_guard.csrf_protect()

    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    # Validation
    if not all([email, name, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409

    try:
        new_user = User(
            name=name,
            email=email,
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        db.session.rollback()
        ddos_guard.log_attack(request.remote_addr, "Registration Attempt", str(e))
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    ddos_guard.rate_limit()
    ddos_guard.waf()
    ddos_guard.csrf_protect()

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        session['user_id'] = user.uid
        session['user_name'] = user.name
        session['account_type'] = user.account_type
        return jsonify({
            'message': 'Login successful',
            'user': {
                'name': user.name,
                'email': user.email
            }
        })
    
    ddos_guard.log_attack(request.remote_addr, "Failed Login", "Invalid credentials")
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'user': {
                'id': session['user_id'],
                'name': session['user_name'],
                'type': session['account_type']
            }
        })
    return jsonify({'logged_in': False})