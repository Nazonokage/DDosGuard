import React, { useState, useContext } from 'react';
import { SimulationContext } from '../SimulationPage';

const WAFPage = () => {
  const { setTerminalLogs, setStatus } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Simulate a WAF blocking a DDoS attack
  const simulateWAFBlock = () => {
    setIsRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal');
    addLog('Starting DDoS Attack Simulation...');

    setTimeout(() => {
      addLog('WAF Detected: Malicious Traffic from DDoS Attack');
      setStatus('Attack Blocked (403 Forbidden)');
      addLog('WAF successfully blocked the DDoS attack!');
      setIsRunning(false);
    }, 3000);
  };

  // Sample code for WAF implementation
  const sampleCode = `from flask import Flask
from flask_waf import WAF

app = Flask(__name__)
waf = WAF(app)

@app.route('/')
def home():
    return "Welcome to the site!"

if __name__ == '__main__':
    app.run(debug=True)`;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">WAF Simulation</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">How WAF Prevents DDoS/DoS Attacks</h3>
        <p className="text-gray-700">
          A <strong>Web Application Firewall (WAF)</strong> filters and blocks malicious traffic by analyzing HTTP requests. It can detect and block patterns commonly used in <i>DDoS/DoS attacks</i>, such as excessive requests or malformed packets.
        </p>
        <p className="text-gray-700 mt-4">
          In the sample code, we use a simple WAF to detect and block malicious traffic. If a DDoS attack is detected, the WAF returns a <code>403 Forbidden</code> response, preventing the server from being overwhelmed.
        </p>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">WAF Implementation</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap">{sampleCode}</pre>
        </div>
        <button
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={simulateWAFBlock}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Try It'}
        </button>
      </div>
    </div>
  );
};

export default WAFPage;