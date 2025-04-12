---

# **PyDDoSGuard** 🛡️

**Your Ultimate Python Defense Against DDoS Attacks, Hackers, and Script Kiddies!**

PyDDoSGuard is a lightweight, reusable, and **free** middleware library designed to protect your Python web applications from DDoS attacks, SQL injection, XSS, CSRF, and more. Whether you're building a Flask app, a Django project, or any other Python web framework, PyDDoSGuard has got your back!

---

## **Features** 🚀

- **Rate Limiting**: Sliding window-based rate limiting to stop DDoS attacks.
- **Web Application Firewall (WAF)**: Blocks SQL injection, XSS, and path traversal attempts.
- **CSRF Protection**: Secure, session-bound CSRF tokens with cookie binding.
- **Honeypot**: Fake admin pages to catch attackers red-handed.
- **Tor Blocking**: Automatically blocks Tor exit nodes.
- **Redis Integration**: Efficient logging and blacklisting with Redis.
- **Framework Agnostic**: Works seamlessly with Flask, Django, and more.
- **Debug Logging**: Optional detailed logging for troubleshooting.

---

## **Installation** ⚙️

```bash
pip install redis requests
```

---

## **Quick Start** 🚀

### **1. Flask Integration**

```python
from flask import Flask, session
from pyddosguard import PyDDoSGuard

app = Flask(__name__)
app.secret_key = "supersecretkey"

# Initialize PyDDoSGuard
ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600, debug_logging=True)

# Apply middleware
@app.before_request
def apply_ddos_protection():
    ddos_guard.middleware_flask()

@app.route("/")
def home():
    # Generate CSRF token for the session
    csrf_token = ddos_guard.generate_csrf_token()
    return f"Welcome to the protected site! CSRF Token: {csrf_token}"

if __name__ == "__main__":
    app.run()
```

### **2. Django Integration**

```python
from django.http import HttpResponse
from pyddosguard import PyDDoSGuard

# Initialize PyDDoSGuard
ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600)

class DDoSGuardMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Generate initial CSRF token for the application
        ddos_guard.generate_csrf_token()

    def __call__(self, request):
        # Apply CSRF protection
        ddos_guard.csrf_protect()
        return self.get_response(request)

# Add middleware to your Django settings
MIDDLEWARE = [
    # Other middleware
    'path.to.DDoSGuardMiddleware',
]
```

---

## **Usage Examples** 🛠️

### **1. Rate Limiting**
Automatically blocks IPs that exceed the request limit.

```python
ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600)
ddos_guard.rate_limit()  # Call this in your middleware
```

### **2. Web Application Firewall (WAF)**
Blocks malicious patterns like SQL injection and XSS.

```python
ddos_guard.waf()  # Call this in your middleware
```

### **3. CSRF Protection**
Generates and validates CSRF tokens for secure forms.

```python
# Generate a CSRF token
csrf_token = ddos_guard.generate_csrf_token()

# Protect a route
ddos_guard.csrf_protect()  # Call this in your middleware
```

### **4. Honeypot**
Catches attackers trying to access fake admin pages.

```python
ddos_guard = PyDDoSGuard(honeypot_paths=["/admin", "/wp-admin"])
ddos_guard.honeypot()  # Call this in your middleware
```

### **5. Tor Blocking**
Blocks requests from Tor exit nodes.

```python
ddos_guard.tor_block()  # Call this in your middleware
```

### **6. Logging Attacks**
Logs all attack attempts for later analysis.

```python
# Log an attack
ddos_guard.log_attack("192.168.1.1", "SQL Injection", "Malicious pattern detected")

# Retrieve attack logs
import json
attack_logs = ddos_guard.redis_client.lrange("attack_logs", 0, -1)
for log in attack_logs:
    print(json.loads(log))
```

### **7. Blacklisting IPs**
Manually blacklist an IP.

```python
ddos_guard.blacklist_ip("192.168.1.1")
```

### **8. Debugging and Diagnostics**
Check Redis keys and enable debug logging.

```python
# Enable debug logging
ddos_guard = PyDDoSGuard(debug_logging=True)

# Inspect Redis keys
redis_keys = ddos_guard.check_redis_keys()
print(redis_keys)  # Prints all Redis keys and their values
```

---

## **Configuration** ⚙️

| Parameter          | Default Value       | Description                                                                |
|--------------------|---------------------|----------------------------------------------------------------------------|
| `limit`            | `15`                | Maximum number of requests allowed per interval.                           |
| `interval`         | `10`                | Time window (in seconds) for rate limiting.                                |
| `block_time`       | `300`               | Duration (in seconds) to blacklist an IP.                                  |
| `enable_tor_check` | `True`              | Enable or disable Tor blocking.                                            |
| `trusted_proxies`  | `0`                 | Number of trusted proxies (for `X-Forwarded-For` parsing).                 |
| `honeypot_paths`   | `["/admin", ...]`   | Custom paths to use as honeypots.                                          |
| `redis_host`       | `"localhost"`       | Redis server host.                                                         |
| `redis_port`       | `6379`              | Redis server port.                                                         |
| `redis_db`         | `0`                 | Redis database number.                                                     |
| `debug_logging`    | `False`             | Enable or disable debug logging for troubleshooting.                       |

---

## **Security Considerations** 🔒

- **Redis Security**: Ensure your Redis instance is not exposed to the internet.
- **Secret Key**: Always use a strong, unique secret key for your application.
- **Continuous Monitoring**: Regularly review attack logs and adjust configurations.

---

## **Why PyDDoSGuard?** 🤔

- **No Paid APIs**: Completely free and open-source.
- **Easy to Use**: Just plug it into your middleware and go.
- **Highly Customizable**: Tailor it to your application's needs.
- **Battle-Tested**: Designed to handle real-world attacks.

---

## **Contributing** 🛠️

Found a bug? Have a feature request? Open an issue or submit a pull request! Let's make PyDDoSGuard even better together.

---

## **License** 📜

MIT License. Use it, share it, hack it (but only for good)!

---

## **Happy Coding!** 🎉

Protect your apps, stop the bots, and keep the script kiddies at bay with **PyDDoSGuard**! 🛡️

---