import React, { useState, useContext } from 'react';
import { SimulationContext } from '../SimulationPage';
import '../../styles/SimulationPage.css';

const RateLimitPage = () => {
  const { setTerminalLogs, setStatus, setRequestsReceived } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Simulate a DDoS attack and rate limiting defense
  const simulateRateLimit = () => {
    setIsRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal');
    setRequestsReceived(0);
    addLog('Starting DDoS Attack Simulation...');

    let requests = 0;
    const interval = setInterval(() => {
      requests += 100; // Simulate 100 requests per second (DDoS attack)
      setRequestsReceived(requests);

      if (requests >= 1000) {
        clearInterval(interval);
        setStatus('Rate Limit Exceeded (429 Too Many Requests)');
        addLog('Rate limiting blocked the DDoS attack!');
        setIsRunning(false);
      } else {
        setStatus('Normal');
        addLog(`Request ${requests}: Status 200 OK`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Sample code for rate limiting
  const sampleCode = `from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,  // Rate limit by client IP
    default_limits=["100 per minute"]  // Allow 100 requests per minute
)

@app.route('/')
@limiter.limit("10 per second")  // Further limit to 10 requests per second
def home():
    return "Welcome to the site!"

if __name__ == '__main__':
    app.run(debug=True)`;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Rate Limiting Simulation</h2>

      {/* Visuals: Botnet Icons and Chart */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">How Rate Limiting Prevents DDoS/DoS Attacks</h3>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-center">
            <span role="img" aria-label="Botnet" className="text-4xl">🤖</span>
            <p className="text-sm">Botnet</p>
          </div>
          <div className="text-center">
            <span role="img" aria-label="Server" className="text-4xl">🖥️</span>
            <p className="text-sm">Server</p>
          </div>
        </div>
        <p className="text-gray-700">
          <strong>Rate limiting</strong> restricts the number of requests a client can make within a specific time frame. This is crucial for mitigating <i>DDoS/DoS attacks</i>, where attackers flood the server with excessive requests to overwhelm it.
        </p>
        <p className="text-gray-700 mt-4">
          In the sample code, we use <code>Flask-Limiter</code> to limit requests to <strong>100 per minute</strong> per IP address. If a client exceeds this limit, the server responds with a <code>429 Too Many Requests</code> status, effectively blocking the attack.
        </p>
      </div>

      {/* Rate Limiting Implementation */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Rate Limiting Implementation</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap">{sampleCode}</pre>
        </div>
        <button
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={simulateRateLimit}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Try It'}
        </button>
      </div>
    </div>
  );
};

export default RateLimitPage;