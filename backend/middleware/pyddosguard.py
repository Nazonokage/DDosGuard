# pyddosguard.py
import secrets
import redis
import json
import time
import logging
import requests
import re
from flask import request, abort, session
from functools import wraps

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

class PyDDoSGuard:
    def __init__(
        self,
        limit=15,  # Requests per interval
        interval=10,  # Time window in seconds
        block_time=300,  # Blacklist duration in seconds
        enable_tor_check=True,  # Enable Tor blocking
        trusted_proxies=0,  # Number of trusted proxies
        honeypot_paths=None,  # Custom honeypot paths
        redis_host="localhost",  # Redis host
        redis_port=6379,  # Redis port
        redis_db=0,  # Redis database
        debug_logging=True,  # Enable debug logging
    ):
        """
        Initialize PyDDoSGuard with customizable settings.
        """
        self.limit = limit
        self.interval = interval
        self.block_time = block_time
        self.enable_tor_check = enable_tor_check
        self.trusted_proxies = trusted_proxies
        self.honeypot_paths = honeypot_paths or ["/admin", "/wp-admin", "/login"]
        self.redis_client = redis.StrictRedis(
            host=redis_host, port=redis_port, db=redis_db, decode_responses=True
        )
        self.debug_logging = debug_logging  # Enable/disable debug logging

    def _log_debug(self, message):
        """Log debug messages if debug_logging is enabled."""
        if self.debug_logging:
            logging.warning(f"🔍 DEBUG: {message}")

    def get_ip(self):
        """
        Retrieve the client IP address, accounting for trusted proxies.
        """
        if self.trusted_proxies > 0 and "X-Forwarded-For" in request.headers:
            ips = request.headers["X-Forwarded-For"].split(",")
            if len(ips) > self.trusted_proxies:
                return ips[-self.trusted_proxies - 1].strip()

        # Fallback to remote address
        ip = request.remote_addr
        if ip.startswith("127.") or ip == "localhost":
            return "127.0.0.1"  # Default to loopback for local testing
        return ip

    def is_ip_blacklisted(self, ip):
        """Check if an IP is blacklisted."""
        self._log_debug(f"Checking if IP is blacklisted: {ip}")
        return self.redis_client.exists(f"blacklist:{ip}")

    def blacklist_ip(self, ip):
        """Blacklist an IP for a specified duration."""
        self.redis_client.setex(f"blacklist:{ip}", self.block_time, "BLOCKED")
        logging.warning(f"🚨 IP Blacklisted: {ip}")
        self._log_debug(f"Blacklisted IP: {ip} for {self.block_time} seconds")

    def log_attack(self, ip, attack_type, details):
        """Log an attack attempt with details."""
        log_entry = {
            "ip": ip,
            "attack_type": attack_type,
            "details": details,
            "timestamp": time.time(),
            "path": request.path,
            "user_agent": request.headers.get("User-Agent", ""),
        }
        self.redis_client.rpush("attack_logs", json.dumps(log_entry))
        self.redis_client.expire("attack_logs", 86400)  # Auto-delete after 24 hours
        logging.warning(f"🚨 Attack Logged: {log_entry}")
        self._log_debug(f"Logged attack: {log_entry}")

    def rate_limit(self):
        """Enforce rate limiting with sliding window."""
        ip = self.get_ip()
        self._log_debug(f"Rate limiting check for IP: {ip}")

        if self.is_ip_blacklisted(ip):
            abort(403, "🚨 IP blocked due to suspicious activity!")

        key = f"rate:{ip}"
        now = time.time()
        pipeline = self.redis_client.pipeline()
        pipeline.zremrangebyscore(key, 0, now - self.interval)  # Remove old entries
        pipeline.zadd(key, {now: now})  # Add current timestamp
        pipeline.expire(key, self.interval)
        pipeline.zcard(key)  # Get current count
        _, _, _, requests_count = pipeline.execute()

        if requests_count > self.limit:
            violation_count = self.redis_client.incr(f"violations:{ip}")
            if violation_count >= 3:  # Auto-blacklist after 3 violations
                self.blacklist_ip(ip)
            self.log_attack(ip, "DDoS Attempt", "Rate limit exceeded")
            abort(429, "🚨 Too many requests! Slow down.")

    def waf(self):
        """Basic Web Application Firewall (WAF) with regex patterns."""
        ip = self.get_ip()
        self._log_debug(f"WAF check for IP: {ip}")

        bad_patterns = [
            r"(\bUNION\b.*\bSELECT\b)",  # SQL Injection
            r"(<script>|alert\(|onerror=)",  # XSS
            r"(\.\./|\.\.\\|/etc/passwd)",  # Path Traversal
        ]
        request_data = request.data.decode("utf-8").lower()
        for pattern in bad_patterns:
            if re.search(pattern, request.url.lower()) or re.search(pattern, request_data):
                self.log_attack(ip, "WAF Block", f"Malicious pattern detected: {pattern}")
                abort(403, "🚨 Potential attack detected!")

    def csrf_protect(self, regenerate_token=True):
        """Enhanced CSRF protection with cookie binding."""
        self._log_debug("CSRF protection check triggered")

        if request.method not in ("POST", "PUT", "DELETE"):
            return True  # CSRF checks apply only for unsafe methods

        form_token = request.form.get("csrf_token")
        header_token = request.headers.get("X-CSRF-Token")
        session_token = session.get("csrf_token")
        expiry = session.get("csrf_token_expiry")

        if not session_token or not expiry or time.time() > expiry:
            session.pop("csrf_token", None)
            session.pop("csrf_token_expiry", None)
            abort(403, "🚨 CSRF token expired or missing! Please refresh the page.")

        if form_token != session_token and header_token != session_token:
            abort(403, "🚨 Invalid CSRF token!")

        # Rotate CSRF token after successful validation (if enabled)
        if regenerate_token:
            self.generate_csrf_token()

        return True

    def generate_csrf_token(self):
        """Generate a secure CSRF token."""
        token = secrets.token_hex(32)
        session["csrf_token"] = token
        session["csrf_token_expiry"] = time.time() + 3600  # 1-hour expiry
        self._log_debug(f"Generated CSRF token: {token}")
        return token

    def honeypot(self):
        """Honeypot to catch attackers."""
        ip = self.get_ip()
        self._log_debug(f"Honeypot check for IP: {ip}")

        if request.path in self.honeypot_paths:
            self.log_attack(ip, "Honeypot Triggered", f"Attempted access to {request.path}")
            abort(403, "🚨 This page is restricted!")

    def tor_block(self):
        """Block Tor users if enabled."""
        if self.enable_tor_check:
            ip = self.get_ip()
            self._log_debug(f"Tor check for IP: {ip}")

            if not ip:
                return  # Skip if IP couldn't be retrieved

            try:
                response = requests.get("https://check.torproject.org/exit-addresses", timeout=5)
                response.raise_for_status()
                tor_exit_list = {line.strip() for line in response.text.split("\n") if line and not line.startswith("#")}

                if ip in tor_exit_list:
                    self.log_attack(ip, "Tor Access Attempt", "IP matches Tor exit node")
                    abort(403, "🚨 Tor users are not allowed!")
            except requests.RequestException as e:
                logging.error(f"Failed to fetch Tor exit node list: {e}")

    def middleware_flask(self):
        """Flask middleware to apply all protections."""
        self._log_debug("Middleware triggered")
        self.rate_limit()
        self.tor_block()
        self.waf()
        self.csrf_protect(regenerate_token=False)  # Disable token regeneration in middleware
        self.honeypot()

    def middleware_django(self, get_response):
        """Django middleware to apply all protections."""
        def middleware(request):
            self.rate_limit()
            self.tor_block()
            self.waf()
            self.csrf_protect()
            self.honeypot()
            return get_response(request)
        return middleware

    def check_redis_keys(self, pattern="*"):
        """
        Inspect Redis keys matching a pattern.
        :param pattern: Redis key pattern to search (default: all keys)
        :return: Dictionary of matching keys and their values
        """
        self._log_debug(f"Checking Redis keys with pattern: {pattern}")
        keys = self.redis_client.keys(pattern)
        redis_keys_info = {}

        for key in keys:
            key_type = self.redis_client.type(key)

            if key_type == "string":
                redis_keys_info[key] = self.redis_client.get(key)
            elif key_type == "list":
                redis_keys_info[key] = self.redis_client.lrange(key, 0, -1)
            elif key_type == "hash":
                redis_keys_info[key] = self.redis_client.hgetall(key)
            elif key_type == "set":
                redis_keys_info[key] = list(self.redis_client.smembers(key))

        self._log_debug(f"Redis keys info: {redis_keys_info}")
        return redis_keys_info