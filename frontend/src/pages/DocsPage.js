import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaBars } from "react-icons/fa"; // For the mobile menu icon
import axiosInstance from "../api/axiosConfig"; // Import axiosInstance


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
  ];

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setIsSidebarOpen(false); // Close the sidebar after clicking a link on mobile
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get("routes/download-pyddosguard", {
        responseType: "blob", // Important for file downloads
      });

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pyddosguard.py"); // Set the file name
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
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
            <li
              key={item.id}
              className="mb-2 cursor-pointer hover:text-blue-300"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </li>
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

          <img
            src={`${process.env.PUBLIC_URL}/img/mapache-pedro.gif`}
            alt="DDoS Simulation"
            className="w-64 md:w-96 rounded-lg shadow-lg"
            />

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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
      </div>
    </div>
  );
};

export default DocsPage;

// http://192.168.1.3:3080/ddosguard