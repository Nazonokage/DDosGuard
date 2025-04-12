# run.py - Entry point for Flask app
import os
import socket
from api import create_app

app = create_app()
PORT = int(os.getenv("PORT", 5050))

# Get the local network IP
hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

if __name__ == "__main__":
    print(f"🚀 System panel is now active at: http://127.0.0.1:{PORT}/ddosguard/panel")
    print(f"🌐 Accessible on your network at: http://{local_ip}:{PORT}/ddosguard/panel")
    app.run(debug=True, host='0.0.0.0', port=PORT)