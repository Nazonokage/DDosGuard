# simulations.py - Attack & Defense Simulation API
from flask import Blueprint, jsonify
from middleware.pyddosguard import PyDDoSGuard

simulations_bp = Blueprint("simulations", __name__, url_prefix="/ddosguard/api/simulations")
ddos_guard = PyDDoSGuard()

@simulations_bp.route("/attack-test", methods=["GET"])
def simulate_attack():
    return jsonify({"message": "Simulated attack triggered. No real backend impact."})

@simulations_bp.route("/defense-test", methods=["GET"])
def simulate_defense():
    return jsonify({"message": "Defense mechanisms are simulated here."})

@simulations_bp.route("/rate-limit-test", methods=["GET"])
def rate_limit_test():
    ddos_guard.rate_limit()
    return jsonify({"message": "Rate limiting test triggered. Safe simulation."})

@simulations_bp.route("/csrf-test", methods=["GET"])
def csrf_test():
    return jsonify({"message": "CSRF protection simulation activated."})

@simulations_bp.route("/waf-test", methods=["GET"])
def waf_test():
    return jsonify({"message": "WAF test completed. Simulated security check."})
