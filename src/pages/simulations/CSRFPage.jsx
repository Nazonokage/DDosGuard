import React, { useState, useContext, useEffect } from 'react';
import { SimulationContext } from '../SimulationPage';
import { Chart } from 'react-google-charts';

const CSRFPage = () => {
  const { setTerminalLogs, setStatus, setRequestsReceived, setResponseTime } = useContext(SimulationContext);
  const [isAttackRunning, setIsAttackRunning] = useState(false);
  const [isDefenseRunning, setIsDefenseRunning] = useState(false);
  const [blockedRequests, setBlockedRequests] = useState(0);
  const [allowedRequests, setAllowedRequests] = useState(0);
  const [csrfTokens, setCsrfTokens] = useState(0);
  const [chartData, setChartData] = useState([
    ['Time', 'Valid Requests', 'Blocked Requests', 'CSRF Tokens Generated'],
    [0, 0, 0, 0]
  ]);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Reset chart when component unmounts
  useEffect(() => {
    return () => {
      setChartData([['Time', 'Valid Requests', 'Blocked Requests', 'CSRF Tokens Generated'], [0, 0, 0, 0]]);
      setTerminalLogs([]);
      setStatus('Normal');
      setRequestsReceived(0);
      setResponseTime(100);
    };
  }, [setRequestsReceived, setResponseTime, setStatus, setTerminalLogs]);

  // Function to update the chart data
  const updateChart = (time, valid, blocked, tokens) => {
    setChartData((prevData) => [...prevData, [time, valid, blocked, tokens]]);
  };

  // Simulate CSRF defense activation
  const simulateCSRFDefense = () => {
    setIsDefenseRunning(true);
    setTerminalLogs([]);
    setStatus('CSRF Protection Active');
    addLog('🛡️ CSRF Protection Activated...');
    addLog('🔑 Generating CSRF tokens...');
    addLog('🔍 Validating request origins...');
    addLog('📊 Monitoring form submissions...');
    addLog('✅ CSRF protection ready');
    
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      
      if (time >= 6) {
        clearInterval(interval);
        setIsDefenseRunning(false);
        setStatus('CSRF Protection Ready');
        addLog('✅ CSRF defense system fully operational');
      } else {
        addLog(`🔍 CSRF Status: Validating tokens (${time}/6)`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Simulate CSRF attack and defense
  const simulateCSRFAttack = () => {
    setIsAttackRunning(true);
    setTerminalLogs([]);
    setStatus('Under CSRF Attack - Protection Active');
    setRequestsReceived(0);
    setBlockedRequests(0);
    setAllowedRequests(0);
    setCsrfTokens(0);
    setChartData([['Time', 'Valid Requests', 'Blocked Requests', 'CSRF Tokens Generated'], [0, 0, 0, 0]]);
    addLog('🚨 CSRF Attack Simulation Started...');
    addLog('🎯 Testing CSRF protection against malicious requests...');

    const attackScenarios = [
      'Malicious form submission without token',
      'Cross-site request from external site',
      'Forged request with invalid token',
      'Session hijacking attempt',
      'Clickjacking attack simulation',
      'Form submission from iframe'
    ];

    let time = 0;
    let totalRequests = 0;
    let valid = 0;
    let blocked = 0;
    let tokens = 0;
    
    const interval = setInterval(() => {
      time += 1;
      
      // Simulate mixed traffic
      const validRequests = Math.floor(Math.random() * 3) + 1;
      const attackRequests = Math.floor(Math.random() * 4) + 2;
      const total = validRequests + attackRequests;
      
      totalRequests += total;
      
      // CSRF protection logic
      const currentValid = validRequests;
      const currentBlocked = attackRequests;
      const currentTokens = Math.floor(Math.random() * 2) + 1;
      
      valid += currentValid;
      blocked += currentBlocked;
      tokens += currentTokens;
      
      setRequestsReceived(totalRequests);
      setAllowedRequests(valid);
      setBlockedRequests(blocked);
      setCsrfTokens(tokens);
      setResponseTime(100 + (blocked > 0 ? 20 : 0));
      updateChart(time, valid, blocked, tokens);

      if (time >= 10) {
        clearInterval(interval);
        setIsAttackRunning(false);
        setStatus('CSRF Attack Mitigated');
        addLog('✅ CSRF protection successfully blocked all malicious requests!');
        addLog(`📊 Final Stats: ${valid} valid, ${blocked} blocked, ${tokens} tokens generated`);
      } else {
        if (currentBlocked > 0) {
          const scenario = attackScenarios[Math.floor(Math.random() * attackScenarios.length)];
          addLog(`🚫 CSRF Blocked: ${scenario}`);
        }
        addLog(`📈 Time ${time}s: ${currentValid} valid, ${currentBlocked} blocked, ${currentTokens} tokens`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Sample code for CSRF protection
  const sampleCode = `from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.secret_key = 'your_secret_key'
csrf = CSRFProtect(app)

@app.route('/change-email', methods=['GET', 'POST'])
def change_email():
    if request.method == 'POST':
        # CSRF token is automatically validated by Flask-WTF
        new_email = request.form['email']
        return f"Email changed to {new_email}"
    return render_template('change_email.html')

if __name__ == '__main__':
    app.run(debug=True)`;

  // Sample HTML form with CSRF token
  const sampleHTMLForm = `<form action="/change-email" method="POST">
  <input type="hidden" name="csrf_token" value="{{ csrf_token() }}">
  <label for="email">New Email:</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Change Email</button>
</form>`;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">🔐 CSRF Protection Simulation</h2>
        
        {/* Introduction */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ How CSRF Protection Works</h3>
          <p className="text-gray-300 mb-4">
            <strong>CSRF (Cross-Site Request Forgery)</strong> attacks trick users into performing actions they didn't intend to, such as changing account settings or making purchases. To prevent this, we use <i>CSRF tokens</i> to validate that requests originate from the same site.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🔑</span>
              <h4 className="font-semibold text-blue-400">Token Generation</h4>
              <p className="text-sm text-gray-300">Unique tokens for each session</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🔍</span>
              <h4 className="font-semibold text-yellow-400">Token Validation</h4>
              <p className="text-sm text-gray-300">Verifying request authenticity</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <span className="text-4xl mb-2 block">🚫</span>
              <h4 className="font-semibold text-red-400">Attack Blocking</h4>
              <p className="text-sm text-gray-300">Blocking malicious requests</p>
            </div>
          </div>
        </div>

        {/* Real-time Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">📊 Real-Time CSRF Protection Analysis</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div className="text-center py-8">Loading Chart...</div>}
            data={chartData}
            options={{
              title: 'CSRF Protection Performance Over Time',
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
            <h4 className="text-lg font-semibold text-green-400">Valid</h4>
            <p className="text-2xl font-bold text-green-400">{allowedRequests}</p>
            <p className="text-sm text-gray-400">valid requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-red-400">Blocked</h4>
            <p className="text-2xl font-bold text-red-400">{blockedRequests}</p>
            <p className="text-sm text-gray-400">malicious requests</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-lg font-semibold text-blue-400">Tokens</h4>
            <p className="text-2xl font-bold text-blue-400">{csrfTokens}</p>
            <p className="text-sm text-gray-400">tokens generated</p>
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

        {/* Attack Scenarios */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">🎯 CSRF Attack Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Form Submission Without Token</h4>
              <p className="text-sm text-gray-300">Malicious forms submitted without valid CSRF tokens</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Cross-Site Requests</h4>
              <p className="text-sm text-gray-300">Requests originating from external malicious sites</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Session Hijacking</h4>
              <p className="text-sm text-gray-300">Attempts to use stolen session information</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Clickjacking</h4>
              <p className="text-sm text-gray-300">Hidden iframe attacks tricking users</p>
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ Defense System</h3>
            <p className="text-gray-300 mb-4">
              Activate CSRF protection mechanisms to prevent cross-site request forgery attacks.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isDefenseRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              } text-white font-semibold`}
              onClick={simulateCSRFDefense}
              disabled={isDefenseRunning || isAttackRunning}
            >
              {isDefenseRunning ? 'Activating...' : 'Activate CSRF Protection'}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-400">🚨 Attack Simulation</h3>
            <p className="text-gray-300 mb-4">
              Simulate CSRF attacks to test protection effectiveness.
            </p>
            <button
              className={`w-full px-4 py-2 rounded ${
                isAttackRunning ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              } text-white font-semibold`}
              onClick={simulateCSRFAttack}
              disabled={isAttackRunning || isDefenseRunning}
            >
              {isAttackRunning ? 'Attacking...' : 'Simulate CSRF Attack'}
            </button>
          </div>
        </div>

        {/* Implementation Code */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">💻 CSRF Protection Implementation</h3>
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{sampleCode}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4">
            <h4 className="text-lg font-semibold mb-2 text-yellow-400">Sample HTML Form with CSRF Token</h4>
            <pre className="whitespace-pre-wrap">{sampleHTMLForm}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-yellow-400">Advanced CSRF Protection with Double Submit Cookie</h4>
            <pre className="whitespace-pre-wrap">{`from flask import Flask, request, jsonify, make_response
import secrets
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key'

def generate_csrf_token():
    """Generate a secure CSRF token"""
    return secrets.token_urlsafe(32)

def verify_csrf_token(token, cookie_token):
    """Verify CSRF token using double submit cookie pattern"""
    if not token or not cookie_token:
        return False
    return token == cookie_token

@app.route('/api/csrf-token')
def get_csrf_token():
    """Generate and return CSRF token"""
    token = generate_csrf_token()
    response = make_response(jsonify({"csrf_token": token}))
    response.set_cookie('csrf_token', token, httponly=True, secure=True, samesite='Strict')
    return response

@app.route('/api/transfer', methods=['POST'])
def transfer_money():
    """Protected endpoint requiring CSRF token"""
    csrf_token = request.headers.get('X-CSRF-Token')
    cookie_token = request.cookies.get('csrf_token')
    
    if not verify_csrf_token(csrf_token, cookie_token):
        return jsonify({"error": "CSRF token validation failed"}), 403
    
    # Process the transfer
    return jsonify({"status": "Transfer successful"})

if __name__ == '__main__':
    app.run(debug=True)`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRFPage;