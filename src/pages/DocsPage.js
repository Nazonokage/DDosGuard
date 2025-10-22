// DocsPage.js - DDoS Simulation Documentation

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaBars } from "react-icons/fa"; // For the mobile menu icon


const DocsPage = () => {
  const [activeTab, setActiveTab] = useState("flask");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar on mobile

  const sidebarItems = [
    { id: "introduction", label: "Introduction" },
    { id: "features", label: "Features" },
    { id: "installation", label: "Installation" },
    { id: "integration", label: "Integration" },
    { id: "usage", label: "Usage Examples" },
    { id: "configuration", label: "Configuration" },
    { id: "security", label: "Security Considerations" },
    { id: "license", label: "License" },
    { type: "separator" }, // Add a separator
    { id: "monitoring-intro", label: "Monitoring System" },
    { id: "monitoring-features", label: "Monitoring Features" },
    { id: "monitoring-install", label: "Monitoring Installation" },
    { id: "monitoring-usage", label: "Monitoring Usage" }
  ];

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setIsSidebarOpen(false); // Close the sidebar after clicking a link on mobile
  };

  const handleDownload = () => {
    // Download the actual PyDDoSGuard.py file
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/app/pyddosguard.py`;
    link.setAttribute("download", "pyddosguard.py");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMonitoring = () => {
    // Download the MonitoringV5.exe from GitHub release
    const link = document.createElement("a");
    link.href = "https://github.com//Nazonokage/ddos_monitoring/releases/download/v3.0.1/MonitoringV5_v5.1.exe";
    link.setAttribute("download", "DDoS-MonitoringV5.exe");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Mobile Hamburger Menu */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="text-2xl text-blue-400" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed h-screen w-64 bg-gray-800 p-4 overflow-y-auto transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0`}
      >
        <h2 className="text-xl font-bold text-blue-400 mb-4">PyDDoSGuard 🛡️</h2>
        <ul>
          {sidebarItems.map((item) => (
            item.type === "separator" ? (
              <hr key="separator" className="border-gray-700 my-4" />
            ) : (
              <li
                key={item.id}
                className="mb-2 cursor-pointer hover:text-blue-300"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto lg:ml-64">
        {/* Introduction */}
        <section id="introduction" className="mb-8">
          <h1 className="text-4xl font-bold text-blue-400">PyDDoSGuard 🛡️</h1>
          <p className="mt-2 text-lg">
            Your Ultimate Python Defense Against DDoS Attacks, Hackers, and Script Kiddies!
          </p>
          <p className="mt-4">
            PyDDoSGuard is a lightweight, reusable, and <strong>free</strong> middleware library designed to
            protect Python web applications from DDoS attacks, SQL injection, XSS, CSRF, and more.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🚀 Features</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Rate Limiting</li>
            <li>Web Application Firewall (WAF)</li>
            <li>CSRF Protection</li>
            <li>Honeypot</li>
            <li>Tor Blocking</li>
            <li>Redis Integration</li>
            <li>Framework Agnostic</li>
            <li>Debug Logging</li>
          </ul>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">⚙️ Installation</h2>
          <SyntaxHighlighter language="bash" style={dracula}>
            {`pip install redis requests`}
          </SyntaxHighlighter>

          {/* Download Button */}
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Download PyDDoSGuard.py
            </button>
          </div>
        </section>

        {/* Integration */}
        <section id="integration" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🚀 Integration</h2>
          <div className="mt-4">
            <div className="flex space-x-4 border-b border-gray-700">
              <button
                className={`px-4 py-2 ${
                  activeTab === "flask" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveTab("flask")}
              >
                Flask
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "django" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setActiveTab("django")}
              >
                Django
              </button>
            </div>
            <div className="mt-4">
              {activeTab === "flask" && (
                <SyntaxHighlighter language="python" style={dracula}>
                  {`from flask import Flask, session
from pyddosguard import PyDDoSGuard

app = Flask(__name__)
app.secret_key = "supersecretkey"

ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600, debug_logging=True)

@app.before_request
def apply_ddos_protection():
    ddos_guard.middleware_flask()

@app.route("/")
def home():
    csrf_token = ddos_guard.generate_csrf_token()
    return f"Welcome to the protected site! CSRF Token: {csrf_token}"

if __name__ == "__main__":
    app.run()`}
                </SyntaxHighlighter>
              )}
              {activeTab === "django" && (
                <SyntaxHighlighter language="python" style={dracula}>
                  {`from django.http import HttpResponse
from pyddosguard import PyDDoSGuard

ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600)

class DDoSGuardMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        ddos_guard.generate_csrf_token()

    def __call__(self, request):
        ddos_guard.csrf_protect()
        return get_response(request)

MIDDLEWARE = [
    'path.to.DDoSGuardMiddleware',
]`}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section id="usage" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🛠️ Usage Examples</h2>
          <h3 className="text-xl font-semibold mt-4 text-blue-200">Rate Limiting</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`ddos_guard = PyDDoSGuard(limit=10, interval=5, block_time=600)
ddos_guard.rate_limit()`}
          </SyntaxHighlighter>

          <h3 className="text-xl font-semibold mt-4 text-blue-200">Web Application Firewall (WAF)</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`ddos_guard.waf()`}
          </SyntaxHighlighter>

          <h3 className="text-xl font-semibold mt-4 text-blue-200">CSRF Protection</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`csrf_token = ddos_guard.generate_csrf_token()
ddos_guard.csrf_protect()`}
          </SyntaxHighlighter>

          <h3 className="text-xl font-semibold mt-4 text-blue-200">Honeypot</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`ddos_guard = PyDDoSGuard(honeypot_paths=["/admin", "/wp-admin"])
ddos_guard.honeypot()`}
          </SyntaxHighlighter>

          <h3 className="text-xl font-semibold mt-4 text-blue-200">Tor Blocking</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`ddos_guard.tor_block()`}
          </SyntaxHighlighter>

          <h3 className="text-xl font-semibold mt-4 text-blue-200">Blacklisting IPs</h3>
          <SyntaxHighlighter language="python" style={dracula}>
            {`ddos_guard.blacklist_ip("192.168.1.1")`}
          </SyntaxHighlighter>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-8">
          <h2 className="text-2xl font-bold text-blue-300">Configuration ⚙️</h2>
          <table className="w-full border-collapse border border-gray-700 mt-4">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2">Parameter</th>
                <th className="border border-gray-700 p-2">Default</th>
                <th className="border border-gray-700 p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-700 p-2">limit</td>
                <td className="border border-gray-700 p-2">15</td>
                <td className="border border-gray-700 p-2">Max requests per interval</td>
              </tr>
              <tr>
                <td className="border border-gray-700 p-2">block_time</td>
                <td className="border border-gray-700 p-2">300</td>
                <td className="border border-gray-700 p-2">Blacklist duration (seconds)</td>
              </tr>
              <tr>
                <td className="border border-gray-700 p-2">debug_logging</td>
                <td className="border border-gray-700 p-2">False</td>
                <td className="border border-gray-700 p-2">Enable debugging logs</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Security Considerations */}
        <section id="security" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🔒 Security Considerations</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Ensure your Redis instance is not exposed to the internet.</li>
            <li>Always use a strong, unique secret key for your application.</li>
            <li>Regularly review attack logs and adjust configurations.</li>
          </ul>
        </section>

        {/* License */}
        <section id="license" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">📜 License</h2>
          <p>MIT License. Use it, share it, hack it (but only for good)!</p>
        </section>
              <hr/>
        {/* Monitoring System Introduction */}
        <section id="monitoring-intro" className="mb-8 pt-12">
          <h1 className="text-4xl font-bold text-blue-400">DDoS Monitoring System 📊</h1>
          <p className="mt-4">
            A real-time DDoS/DoS detection system with web interface, providing network monitoring, 
            anomaly detection, and alerting capabilities.
          </p>
          
          <div className="mt-4">
            <button
              onClick={handleDownloadMonitoring}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Download Monitoring App
            </button>
          </div>
        </section>

        {/* Monitoring Features */}
        <section id="monitoring-features" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">✨ Monitoring Features</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Real-time network connection tracking</li>
            <li>Traffic rate analysis (incoming/outgoing)</li>
            <li>Process-level connection breakdown</li>
            <li>Threshold-based alerts</li>
            <li>Connection spike detection</li>
            <li>Traffic volume anomalies detection</li>
            <li>Interactive dashboard with historical data</li>
            <li>System resource monitoring (CPU, memory)</li>
          </ul>
        </section>

        {/* Monitoring Installation */}
        <section id="monitoring-install" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🛠️ Monitoring Installation</h2>
          <SyntaxHighlighter language="bash" style={dracula}>
            {`# Clone the repository
git clone https://github.com/Nazonokage/ddos_monitoring.git
cd ddos_monitoring

# Install dependencies
pip install -r requirements.txt`}
          </SyntaxHighlighter>
        </section>

        {/* Monitoring Usage */}
        <section id="monitoring-usage" className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-300">🚀 Monitoring Usage</h2>
          <SyntaxHighlighter language="bash" style={dracula}>
            {`# Run the monitoring system
python run.py

# Access the web interface at:
http://localhost:8060`}
          </SyntaxHighlighter>
          <h3 className="text-xl font-semibold mt-4 text-blue-200">Dashboard Features</h3>
          <ul className="list-disc list-inside mt-2">
            <li>Start/Stop monitoring with button controls</li>
            <li>Real-time connection count vs. threshold</li>
            <li>Network traffic rate visualization</li>
            <li>Top processes making connections</li>
            <li>System resource usage monitoring</li>
            <li>Alert history and notifications</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DocsPage;