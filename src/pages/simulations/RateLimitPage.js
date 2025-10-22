import React, { useState, useContext, useEffect } from 'react';
import { SimulationContext } from '../SimulationPage';
import { Chart } from 'react-google-charts';
import '../../styles/SimulationPage.css';

const RateLimitPage = () => {
  const { setTerminalLogs, setStatus, setRequestsReceived, setResponseTime } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);
  const [isAttackRunning, setIsAttackRunning] = useState(false);
  const [isDefenseRunning, setIsDefenseRunning] = useState(false);
  const [rateLimit, setRateLimit] = useState(100);
  const [timeWindow, setTimeWindow] = useState(60);
  const [blockedRequests, setBlockedRequests] = useState(0);
  const [allowedRequests, setAllowedRequests] = useState(0);
  const [chartData, setChartData] = useState([
    ['Time', 'Allowed Requests', 'Blocked Requests', 'Rate Limit'],
    [0, 0, 0, 100]
  ]);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Reset chart when component unmounts
  useEffect(() => {
    return () => {
      setChartData([['Time', 'Allowed Requests', 'Blocked Requests', 'Rate Limit'], [0, 0, 0, 100]]);
      setTerminalLogs([]);
      setStatus('Normal');
      setRequestsReceived(0);
      setResponseTime(100);
    };
  }, [setRequestsReceived, setResponseTime, setStatus, setTerminalLogs]);

  // Function to update the chart data
  const updateChart = (time, allowed, blocked, limit) => {
    setChartData((prevData) => [...prevData, [time, allowed, blocked, limit]]);
  };

  // Simulate rate limiting defense
  const simulateRateLimitDefense = () => {
    setIsDefenseRunning(true);
    setTerminalLogs([]);
    setStatus('Rate Limiting Active');
    addLog('🛡️ Rate Limiting Defense Activated...');
    addLog(`⚡ Rate Limit: ${rateLimit} requests per ${timeWindow} seconds`);
    addLog('🔍 Monitoring incoming requests...');
    
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      
      if (time >= 10) {
        clearInterval(interval);
        setIsDefenseRunning(false);
        setStatus('Rate Limiting Ready');
        addLog('✅ Rate limiting defense system ready');
      } else {
        addLog(`📊 Rate Limiting Status: Monitoring requests (${time}/10)`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Simulate a DDoS attack with rate limiting defense
  const simulateRateLimitAttack = () => {
    setIsAttackRunning(true);
    setTerminalLogs([]);
    setStatus('Under Attack - Rate Limiting Active');
    setRequestsReceived(0);
    setBlockedRequests(0);
    setAllowedRequests(0);
    setChartData([['Time', 'Allowed Requests', 'Blocked Requests', 'Rate Limit'], [0, 0, 0, rateLimit]]);
    addLog('🚨 DDoS Attack Simulation Started...');
    addLog(`🎯 Target: Rate limit of ${rateLimit} requests per ${timeWindow} seconds`);

    let time = 0;
    let totalRequests = 0;
    let allowed = 0;
    let blocked = 0;
    
    const interval = setInterval(() => {
      time += 1;
      
      // Simulate attack traffic (high volume)
      const attackRequests = Math.floor(Math.random() * 50) + 20; // 20-70 requests per second
      totalRequests += attackRequests;
      
      // Rate limiting logic
      const currentAllowed = Math.min(attackRequests, Math.max(0, rateLimit - allowed));
      const currentBlocked = attackRequests - currentAllowed;
      
      allowed += currentAllowed;
      blocked += currentBlocked;
      
      setRequestsReceived(totalRequests);
      setAllowedRequests(allowed);
      setBlockedRequests(blocked);
      setResponseTime(100 + (blocked > 0 ? 50 : 0));
      updateChart(time, allowed, blocked, rateLimit);

      if (time >= 15) {
        clearInterval(interval);
        setIsAttackRunning(false);
        setStatus('Attack Mitigated by Rate Limiting');
        addLog('✅ Rate limiting successfully mitigated the attack!');
        addLog(`📊 Final Stats: ${allowed} allowed, ${blocked} blocked`);
      } else {
        if (currentBlocked > 0) {
          addLog(`🚫 Blocked ${currentBlocked} requests (Rate limit exceeded)`);
        }
        addLog(`📈 Time ${time}s: ${currentAllowed} allowed, ${currentBlocked} blocked`);
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
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">⚡ Rate Limiting Simulation</h2>
        
        {/* Introduction */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ How Rate Limiting Prevents DDoS/DoS Attacks</h3>
          <p className="text-gray-300 mb-4">
            <strong>Rate limiting</strong> restricts the number of requests a client can make within a specific time frame. This is crucial for mitigating <i>DDoS/DoS attacks</i>, where attackers flood the server with excessive requests to overwhelm it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🤖</span>
              <h4 className="font-semibold text-red-400">Attack Source</h4>
              <p className="text-sm text-gray-300">Botnet sending high volume requests</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">⚡</span>
              <h4 className="font-semibold text-yellow-400">Rate Limiter</h4>
              <p className="text-sm text-gray-300">Filtering and blocking excess requests</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🖥️</span>
              <h4 className="font-semibold text-green-400">Protected Server</h4>
              <p className="text-sm text-gray-300">Only legitimate requests processed</p>
            </div>
          </div>
        </div>

        {/* Real-time Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">📊 Real-Time Rate Limiting Analysis</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div className="text-center py-8">Loading Chart...</div>}
            data={chartData}
            options={{
              title: 'Rate Limiting Performance Over Time',
              titleTextStyle: { color: '#e2e8f0' },
              backgroundColor: '#1f2937',
              colors: ['#10b981', '#ef4444', '#3b82f6'],
              curveType: 'function',
              legend: { position: 'bottom', textStyle: { color: '#e2e8f0' } },
              hAxis: { 
                title: 'Time (seconds)', 
                titleTextStyle: { color: '#e2e8f0' },
                textStyle: { color: '#e2e8f0' }
              },
              vAxis: { 
                title: 'Requests per Second', 
                titleTextStyle: { color: '#e2e8f0' },
                textStyle: { color: '#e2e8f0' }
              },
              chartArea: { width: '80%', height: '70%' }
            }}
          />
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-blue-400">Rate Limit</h4>
            <p className="text-2xl font-bold text-white">{rateLimit}</p>
            <p className="text-sm text-gray-400">requests per {timeWindow}s</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-green-400">Allowed</h4>
            <p className="text-2xl font-bold text-green-400">{allowedRequests}</p>
            <p className="text-sm text-gray-400">requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-red-400">Blocked</h4>
            <p className="text-2xl font-bold text-red-400">{blockedRequests}</p>
            <p className="text-sm text-gray-400">requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-yellow-400">Efficiency</h4>
            <p className="text-2xl font-bold text-yellow-400">
              {allowedRequests + blockedRequests > 0 ? 
                Math.round((blockedRequests / (allowedRequests + blockedRequests)) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-400">blocked</p>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">⚙️ Rate Limiting Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rate Limit (requests per time window)
              </label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                min="1"
                max="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Window (seconds)
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value={60}>60 seconds</option>
                <option value={300}>5 minutes</option>
                <option value={3600}>1 hour</option>
                <option value={86400}>24 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ Defense System</h3>
            <p className="text-gray-300 mb-4">
              Activate rate limiting defense mechanisms to protect against DDoS attacks.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isDefenseRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              } text-white font-semibold`}
              onClick={simulateRateLimitDefense}
              disabled={isDefenseRunning || isAttackRunning}
            >
              {isDefenseRunning ? 'Activating...' : 'Activate Rate Limiting'}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-400">🚨 Attack Simulation</h3>
            <p className="text-gray-300 mb-4">
              Simulate a DDoS attack to test rate limiting effectiveness.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isAttackRunning ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              } text-white font-semibold`}
              onClick={simulateRateLimitAttack}
              disabled={isAttackRunning || isDefenseRunning}
            >
              {isAttackRunning ? 'Attacking...' : 'Simulate DDoS Attack'}
            </button>
          </div>
        </div>

        {/* Implementation Code */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">💻 Rate Limiting Implementation</h3>
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{sampleCode}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-semibold mb-2 text-yellow-400">Advanced Rate Limiting with Redis</h4>
            <pre className="whitespace-pre-wrap">{`from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis

app = Flask(__name__)

# Redis for distributed rate limiting
redis_client = redis.Redis(host='localhost', port=6379, db=0)

limiter = Limiter(
    app,
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379",
    default_limits=["100 per minute", "1000 per hour"]
)

@app.route('/api/data')
@limiter.limit("10 per second")
def get_data():
    return {"data": "sensitive information"}

@app.route('/api/upload')
@limiter.limit("5 per minute")
def upload_file():
    return {"status": "upload successful"}

if __name__ == '__main__':
    app.run(debug=True)`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitPage;