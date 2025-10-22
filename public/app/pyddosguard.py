"""
PyDDoSGuard - A comprehensive DDoS protection library for Python web applications
Author: DDoSGuard Team
Version: 1.0.0
License: MIT
"""

import time
import hashlib
import hmac
import random
import string
import requests
from collections import defaultdict, deque
from typing import Dict, List, Optional, Callable
import logging

class PyDDoSGuard:
    """
    A comprehensive DDoS protection middleware for Python web applications.
    Provides rate limiting, WAF, CSRF protection, honeypot, and Tor blocking.
    """
    
    def __init__(self, 
                 limit: int = 15, 
                 interval: int = 60, 
                 block_time: int = 300,
                 secret_key: str = None,
                 honeypot_paths: List[str] = None,
                 debug_logging: bool = False):
        """
        Initialize PyDDoSGuard with configuration parameters.
        
        Args:
            limit: Maximum requests per interval per IP
            interval: Time window in seconds for rate limiting
            block_time: Duration to block IPs in seconds
            secret_key: Secret key for CSRF token generation
            honeypot_paths: List of paths to use as honeypots
            debug_logging: Enable debug logging
        """
        self.limit = limit
        self.interval = interval
        self.block_time = block_time
        self.secret_key = secret_key or self._generate_secret_key()
        self.honeypot_paths = honeypot_paths or ["/admin", "/wp-admin", "/phpmyadmin"]
        self.debug_logging = debug_logging
        
        # In-memory storage for rate limiting (use Redis in production)
        self.request_counts: Dict[str, deque] = defaultdict(lambda: deque())
        self.blocked_ips: Dict[str, float] = {}
        
        # WAF patterns
        self.malicious_patterns = [
            r'<script.*?>.*?</script>',  # XSS
            r'union.*select',  # SQL injection
            r'drop.*table',  # SQL injection
            r'exec\s*\(',  # Command injection
            r'eval\s*\(',  # Code injection
            r'\.\./',  # Path traversal
            r'<iframe.*?>',  # Iframe injection
        ]
        
        # Setup logging
        if debug_logging:
            logging.basicConfig(level=logging.DEBUG)
            self.logger = logging.getLogger(__name__)
        else:
            self.logger = logging.getLogger(__name__)
            self.logger.setLevel(logging.WARNING)
    
    def _generate_secret_key(self) -> str:
        """Generate a random secret key for CSRF protection."""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    
    def _get_client_ip(self, request) -> str:
        """Extract client IP from request object."""
        # Try different headers for IP detection
        ip_headers = ['X-Forwarded-For', 'X-Real-IP', 'CF-Connecting-IP', 'X-Client-IP']
        
        for header in ip_headers:
            if hasattr(request, 'headers') and header in request.headers:
                ip = request.headers[header].split(',')[0].strip()
                if ip and ip != 'unknown':
                    return ip
        
        # Fallback to remote address
        if hasattr(request, 'remote_addr'):
            return request.remote_addr
        elif hasattr(request, 'environ'):
            return request.environ.get('REMOTE_ADDR', '127.0.0.1')
        
        return '127.0.0.1'
    
    def _is_ip_blocked(self, ip: str) -> bool:
        """Check if IP is currently blocked."""
        if ip in self.blocked_ips:
            if time.time() - self.blocked_ips[ip] < self.block_time:
                return True
            else:
                # Remove expired block
                del self.blocked_ips[ip]
        return False
    
    def _block_ip(self, ip: str) -> None:
        """Block an IP address."""
        self.blocked_ips[ip] = time.time()
        self.logger.warning(f"IP {ip} blocked for {self.block_time} seconds")
    
    def rate_limit(self, request) -> bool:
        """
        Apply rate limiting to the request.
        
        Args:
            request: Web framework request object
            
        Returns:
            True if request is allowed, False if rate limited
        """
        ip = self._get_client_ip(request)
        current_time = time.time()
        
        # Check if IP is blocked
        if self._is_ip_blocked(ip):
            self.logger.warning(f"Blocked IP {ip} attempted to access")
            return False
        
        # Clean old requests outside the interval
        while (self.request_counts[ip] and 
               current_time - self.request_counts[ip][0] > self.interval):
            self.request_counts[ip].popleft()
        
        # Check if limit exceeded
        if len(self.request_counts[ip]) >= self.limit:
            self._block_ip(ip)
            return False
        
        # Add current request
        self.request_counts[ip].append(current_time)
        return True
    
    def waf(self, request) -> bool:
        """
        Web Application Firewall - check for malicious patterns.
        
        Args:
            request: Web framework request object
            
        Returns:
            True if request is safe, False if malicious
        """
        import re
        
        # Get request data
        url = getattr(request, 'url', '') or getattr(request, 'path', '')
        data = getattr(request, 'data', '') or getattr(request, 'form', '') or ''
        headers = getattr(request, 'headers', {}) or {}
        
        # Combine all data for pattern matching
        request_data = f"{url} {data} {str(headers)}".lower()
        
        # Check against malicious patterns
        for pattern in self.malicious_patterns:
            if re.search(pattern, request_data, re.IGNORECASE):
                self.logger.warning(f"WAF blocked malicious request: {pattern}")
                return False
        
        return True
    
    def generate_csrf_token(self) -> str:
        """Generate a CSRF token."""
        timestamp = str(int(time.time()))
        token_data = f"{timestamp}:{self.secret_key}"
        token = hashlib.sha256(token_data.encode()).hexdigest()
        return token
    
    def csrf_protect(self, request, token: str = None) -> bool:
        """
        CSRF protection - validate CSRF token.
        
        Args:
            request: Web framework request object
            token: CSRF token to validate
            
        Returns:
            True if token is valid, False otherwise
        """
        if not token:
            # Try to get token from request
            if hasattr(request, 'form') and 'csrf_token' in request.form:
                token = request.form['csrf_token']
            elif hasattr(request, 'headers') and 'X-CSRF-Token' in request.headers:
                token = request.headers['X-CSRF-Token']
            else:
                return False
        
        # Validate token
        try:
            timestamp = str(int(time.time()))
            expected_token = self.generate_csrf_token()
            
            # Allow tokens from the last 5 minutes
            for i in range(300):
                test_time = str(int(time.time()) - i)
                test_data = f"{test_time}:{self.secret_key}"
                test_token = hashlib.sha256(test_data.encode()).hexdigest()
                
                if hmac.compare_digest(token, test_token):
                    return True
            
            return False
        except:
            return False
    
    def honeypot(self, request) -> bool:
        """
        Honeypot detection - check if request is accessing honeypot paths.
        
        Args:
            request: Web framework request object
            
        Returns:
            True if request is legitimate, False if honeypot accessed
        """
        url = getattr(request, 'url', '') or getattr(request, 'path', '')
        
        for honeypot_path in self.honeypot_paths:
            if honeypot_path in url:
                self.logger.warning(f"Honeypot accessed: {url}")
                return False
        
        return True
    
    def tor_block(self, request) -> bool:
        """
        Block requests from Tor exit nodes.
        
        Args:
            request: Web framework request object
            
        Returns:
            True if request is allowed, False if from Tor
        """
        ip = self._get_client_ip(request)
        
        # Check if IP is a known Tor exit node
        # In production, use a proper Tor exit node list
        try:
            response = requests.get(f"https://check.torproject.org/api/ip", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get('IsTor', False):
                    self.logger.warning(f"Tor exit node blocked: {ip}")
                    return False
        except:
            # If Tor check fails, allow the request
            pass
        
        return True
    
    def blacklist_ip(self, ip: str) -> None:
        """Add IP to blacklist."""
        self._block_ip(ip)
    
    def whitelist_ip(self, ip: str) -> None:
        """Remove IP from blacklist."""
        if ip in self.blocked_ips:
            del self.blocked_ips[ip]
    
    def middleware_flask(self, request):
        """Flask middleware integration."""
        ip = self._get_client_ip(request)
        
        # Apply all protection measures
        if not self.rate_limit(request):
            from flask import abort
            abort(429, "Too Many Requests")
        
        if not self.waf(request):
            from flask import abort
            abort(403, "Forbidden")
        
        if not self.honeypot(request):
            from flask import abort
            abort(404, "Not Found")
        
        if not self.tor_block(request):
            from flask import abort
            abort(403, "Forbidden")
    
    def get_stats(self) -> Dict:
        """Get protection statistics."""
        current_time = time.time()
        
        # Clean up old data
        for ip in list(self.request_counts.keys()):
            while (self.request_counts[ip] and 
                   current_time - self.request_counts[ip][0] > self.interval):
                self.request_counts[ip].popleft()
            
            if not self.request_counts[ip]:
                del self.request_counts[ip]
        
        return {
            'active_ips': len(self.request_counts),
            'blocked_ips': len(self.blocked_ips),
            'total_requests': sum(len(requests) for requests in self.request_counts.values()),
            'config': {
                'limit': self.limit,
                'interval': self.interval,
                'block_time': self.block_time
            }
        }


# Example usage
if __name__ == "__main__":
    # Example Flask integration
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    app.secret_key = "your_secret_key_here"
    
    # Initialize PyDDoSGuard
    ddos_guard = PyDDoSGuard(
        limit=10,
        interval=60,
        block_time=300,
        debug_logging=True
    )
    
    @app.before_request
    def apply_ddos_protection():
        ddos_guard.middleware_flask(request)
    
    @app.route('/')
    def home():
        csrf_token = ddos_guard.generate_csrf_token()
        return f"Welcome! CSRF Token: {csrf_token}"
    
    @app.route('/stats')
    def stats():
        return jsonify(ddos_guard.get_stats())
    
    if __name__ == '__main__':
        app.run(debug=True)