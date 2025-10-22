import React, { useState, useContext, useEffect } from 'react';
import { SimulationContext } from '../SimulationPage';
import { Chart } from 'react-google-charts';

const WAFPage = () => {
  const { setTerminalLogs, setStatus, setRequestsReceived, setResponseTime } = useContext(SimulationContext);
  const [isAttackRunning, setIsAttackRunning] = useState(false);
  const [isDefenseRunning, setIsDefenseRunning] = useState(false);
  const [blockedRequests, setBlockedRequests] = useState(0);
  const [allowedRequests, setAllowedRequests] = useState(0);
  const [threatsDetected, setThreatsDetected] = useState(0);
  const [chartData, setChartData] = useState([
    ['Time', 'Allowed Requests', 'Blocked Requests', 'Threats Detected'],
    [0, 0, 0, 0]
  ]);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Reset chart when component unmounts
  useEffect(() => {
    return () => {
      setChartData([['Time', 'Allowed Requests', 'Blocked Requests', 'Threats Detected'], [0, 0, 0, 0]]);
      setTerminalLogs([]);
      setStatus('Normal');
      setRequestsReceived(0);
      setResponseTime(100);
    };
  }, [setRequestsReceived, setResponseTime, setStatus, setTerminalLogs]);

  // Function to update the chart data
  const updateChart = (time, allowed, blocked, threats) => {
    setChartData((prevData) => [...prevData, [time, allowed, blocked, threats]]);
  };

  // Simulate WAF defense activation
  const simulateWAFDefense = () => {
    setIsDefenseRunning(true);
    setTerminalLogs([]);
    setStatus('WAF Active');
    addLog('🛡️ Web Application Firewall Activated...');
    addLog('🔍 Scanning for malicious patterns...');
    addLog('📊 Analyzing HTTP headers and payloads...');
    addLog('🚫 Blocking known attack signatures...');
    addLog('✅ WAF rules loaded and active');
    
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      
      if (time >= 8) {
        clearInterval(interval);
        setIsDefenseRunning(false);
        setStatus('WAF Ready');
        addLog('✅ WAF defense system fully operational');
      } else {
        addLog(`🔍 WAF Status: Scanning traffic patterns (${time}/8)`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Simulate WAF blocking various attacks
  const simulateWAFAttack = () => {
    setIsAttackRunning(true);
    setTerminalLogs([]);
    setStatus('Under Attack - WAF Active');
    setRequestsReceived(0);
    setBlockedRequests(0);
    setAllowedRequests(0);
    setThreatsDetected(0);
    setChartData([['Time', 'Allowed Requests', 'Blocked Requests', 'Threats Detected'], [0, 0, 0, 0]]);
    addLog('🚨 Multi-Vector Attack Simulation Started...');
    addLog('🎯 Testing WAF against various attack patterns...');

    const attackPatterns = [
      'SQL Injection attempt',
      'XSS payload detected',
      'DDoS flood pattern',
      'Malicious file upload',
      'Brute force login attempt',
      'Directory traversal attack',
      'Command injection attempt',
      'CSRF token missing'
    ];

    let time = 0;
    let totalRequests = 0;
    let allowed = 0;
    let blocked = 0;
    let threats = 0;
    
    const interval = setInterval(() => {
      time += 1;
      
      // Simulate mixed traffic
      const normalRequests = Math.floor(Math.random() * 5) + 2;
      const attackRequests = Math.floor(Math.random() * 8) + 3;
      const total = normalRequests + attackRequests;
      
      totalRequests += total;
      
      // WAF filtering logic
      const currentAllowed = normalRequests + Math.floor(attackRequests * 0.2); // 20% of attacks get through
      const currentBlocked = attackRequests - (attackRequests - currentAllowed);
      const currentThreats = Math.floor(Math.random() * 3) + 1;
      
      allowed += currentAllowed;
      blocked += currentBlocked;
      threats += currentThreats;
      
      setRequestsReceived(totalRequests);
      setAllowedRequests(allowed);
      setBlockedRequests(blocked);
      setThreatsDetected(threats);
      setResponseTime(100 + (blocked > 0 ? 30 : 0));
      updateChart(time, allowed, blocked, threats);

      if (time >= 12) {
        clearInterval(interval);
        setIsAttackRunning(false);
        setStatus('Attack Mitigated by WAF');
        addLog('✅ WAF successfully mitigated the multi-vector attack!');
        addLog(`📊 Final Stats: ${allowed} allowed, ${blocked} blocked, ${threats} threats detected`);
      } else {
        if (currentBlocked > 0) {
          const pattern = attackPatterns[Math.floor(Math.random() * attackPatterns.length)];
          addLog(`🚫 WAF Blocked: ${pattern}`);
        }
        addLog(`📈 Time ${time}s: ${currentAllowed} allowed, ${currentBlocked} blocked, ${currentThreats} threats`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Sample code for WAF implementation
  const sampleCode = `from flask import Flask, request, jsonify
from flask_waf import WAF
import re

app = Flask(__name__)
waf = WAF(app)

# Custom WAF rules
@waf.rule('sql_injection')
def detect_sql_injection(request):
    sql_patterns = [
        r"union\\s+select", r"drop\\s+table", r"insert\\s+into",
        r"delete\\s+from", r"update\\s+set", r"or\\s+1=1"
    ]
    for pattern in sql_patterns:
        if re.search(pattern, request.data.decode().lower()):
            return True
    return False

@waf.rule('xss_attack')
def detect_xss(request):
    xss_patterns = [
        r"<script[^>]*>.*?</script>", r"javascript:", 
        r"on\\w+\\s*=", r"<iframe[^>]*>"
    ]
    for pattern in xss_patterns:
        if re.search(pattern, request.data.decode().lower()):
            return True
    return False

@waf.rule('rate_limit')
def rate_limit(request):
    # Implement rate limiting logic
    client_ip = request.remote_addr
    # Check against rate limit store
    return False

@app.route('/api/data', methods=['GET', 'POST'])
@waf.protect(['sql_injection', 'xss_attack', 'rate_limit'])
def get_data():
    return jsonify({"data": "protected information"})

if __name__ == '__main__':
    app.run(debug=True)`;



  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">🛡️ Web Application Firewall (WAF) Simulation</h2>
        
        {/* Introduction */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">🔍 How WAF Prevents Multi-Vector Attacks</h3>
          <p className="text-gray-300 mb-4">
            A <strong>Web Application Firewall (WAF)</strong> filters and blocks malicious traffic by analyzing HTTP requests, headers, and payloads. It can detect and block patterns commonly used in <i>DDoS/DoS attacks</i>, <i>SQL injection</i>, <i>XSS attacks</i>, and other web-based threats.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🔍</span>
              <h4 className="font-semibold text-blue-400">Pattern Detection</h4>
              <p className="text-sm text-gray-300">Analyzes request patterns and signatures</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🚫</span>
              <h4 className="font-semibold text-red-400">Threat Blocking</h4>
              <p className="text-sm text-gray-300">Blocks malicious requests in real-time</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">📊</span>
              <h4 className="font-semibold text-yellow-400">Traffic Analysis</h4>
              <p className="text-sm text-gray-300">Monitors and analyzes web traffic</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">⚡</span>
              <h4 className="font-semibold text-green-400">Real-time Protection</h4>
              <p className="text-sm text-gray-300">Instant threat detection and response</p>
            </div>
          </div>
        </div>

        {/* Real-time Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">📊 Real-Time WAF Analysis</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div className="text-center py-8">Loading Chart...</div>}
            data={chartData}
            options={{
              title: 'WAF Performance Over Time',
              titleTextStyle: { color: '#e2e8f0' },
              backgroundColor: '#1f2937',
              colors: ['#10b981', '#ef4444', '#f59e0b'],
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
            <h4 className="text-lg font-semibold text-green-400">Allowed</h4>
            <p className="text-2xl font-bold text-green-400">{allowedRequests}</p>
            <p className="text-sm text-gray-400">legitimate requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-red-400">Blocked</h4>
            <p className="text-2xl font-bold text-red-400">{blockedRequests}</p>
            <p className="text-sm text-gray-400">malicious requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-yellow-400">Threats</h4>
            <p className="text-2xl font-bold text-yellow-400">{threatsDetected}</p>
            <p className="text-sm text-gray-400">threats detected</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-blue-400">Efficiency</h4>
            <p className="text-2xl font-bold text-blue-400">
              {allowedRequests + blockedRequests > 0 ? 
                Math.round((blockedRequests / (allowedRequests + blockedRequests)) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-400">blocked</p>
          </div>
        </div>

        {/* Attack Types */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">🎯 WAF Protection Against Various Attacks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">SQL Injection</h4>
              <p className="text-sm text-gray-300">Detects and blocks SQL injection attempts in form data and URLs</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">XSS Attacks</h4>
              <p className="text-sm text-gray-300">Prevents cross-site scripting by filtering malicious scripts</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">DDoS Protection</h4>
              <p className="text-sm text-gray-300">Rate limiting and pattern detection for flood attacks</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">File Upload Attacks</h4>
              <p className="text-sm text-gray-300">Scans and blocks malicious file uploads</p>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ Defense System</h3>
            <p className="text-gray-300 mb-4">
              Activate WAF defense mechanisms to protect against various web attacks.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isDefenseRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              } text-white font-semibold`}
              onClick={simulateWAFDefense}
              disabled={isDefenseRunning || isAttackRunning}
            >
              {isDefenseRunning ? 'Activating...' : 'Activate WAF'}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-400">🚨 Attack Simulation</h3>
            <p className="text-gray-300 mb-4">
              Simulate multi-vector attacks to test WAF effectiveness.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isAttackRunning ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              } text-white font-semibold`}
              onClick={simulateWAFAttack}
              disabled={isAttackRunning || isDefenseRunning}
            >
              {isAttackRunning ? 'Attacking...' : 'Simulate Multi-Vector Attack'}
            </button>
          </div>
        </div>

        {/* Implementation Code */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">💻 WAF Implementation</h3>
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{sampleCode}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-semibold mb-2 text-yellow-400">Advanced WAF with Machine Learning</h4>
            <pre className="whitespace-pre-wrap">{`from flask import Flask, request, jsonify
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

# Load pre-trained ML model
waf_model = joblib.load('waf_model.pkl')

def extract_features(request):
    """Extract features from HTTP request for ML analysis"""
    features = [
        len(request.data),
        len(request.headers),
        request.method == 'POST',
        'application/json' in request.content_type,
        len(request.args),
        len(request.form)
    ]
    return np.array(features).reshape(1, -1)

@app.before_request
def waf_protection():
    """WAF protection using machine learning"""
    features = extract_features(request)
    is_anomaly = waf_model.predict(features)[0] == -1
    
    if is_anomaly:
        return jsonify({"error": "Request blocked by WAF"}), 403

@app.route('/api/data')
def get_data():
    return jsonify({"data": "protected information"})

if __name__ == '__main__':
    app.run(debug=True)`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WAFPage;