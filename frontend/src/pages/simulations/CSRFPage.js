import React, { useState, useContext } from 'react';
import { SimulationContext } from '../SimulationPage';

const CSRFPage = () => {
  const { setTerminalLogs, setStatus } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Simulate a CSRF attack and defense
  const simulateCSRFAttack = () => {
    setIsRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal');
    addLog('Starting CSRF Attack Simulation...');

    setTimeout(() => {
      addLog('CSRF Attack: Attempting to submit a malicious form...');
      setStatus('CSRF Attack Detected (403 Forbidden)');
      addLog('CSRF protection blocked the request!');
      setIsRunning(false);
    }, 3000);
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">CSRF Protection Simulation</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">How CSRF Protection Works</h3>
        <p className="text-gray-700">
          <strong>CSRF (Cross-Site Request Forgery)</strong> attacks trick users into performing actions they didn’t intend to, such as changing account settings or making purchases. To prevent this, we use <i>CSRF tokens</i> to validate that requests originate from the same site.
        </p>
        <p className="text-gray-700 mt-4">
          In the sample code, we use <code>Flask-WTF</code> to automatically generate and validate CSRF tokens. Any request without a valid token is rejected with a <code>403 Forbidden</code> status.
        </p>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">CSRF Protection Implementation</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap">{sampleCode}</pre>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold mb-2">Sample HTML Form with CSRF Token</h4>
          <pre className="whitespace-pre-wrap">{sampleHTMLForm}</pre>
        </div>
        <button
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={simulateCSRFAttack}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Try It'}
        </button>
      </div>
    </div>
  );
};

export default CSRFPage;