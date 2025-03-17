import React, { useState, useContext } from 'react';
import { SimulationContext } from '../SimulationPage';

const CaptchaPage = () => {
  const { setTerminalLogs, setStatus } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Simulate CAPTCHA blocking a bot
  const simulateCaptchaBlock = () => {
    setIsRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal');
    addLog('Starting CAPTCHA Simulation...');

    setTimeout(() => {
      addLog('CAPTCHA Detected: Bot Attempting to Submit Form');
      setStatus('Bot Blocked (403 Forbidden)');
      addLog('CAPTCHA successfully blocked the bot!');
      setIsRunning(false);
    }, 3000);
  };

  // Sample code for CAPTCHA implementation
  const sampleCode = `from flask import Flask, render_template, request
from flask_recaptcha import ReCaptcha

app = Flask(__name__)
app.config['RECAPTCHA_SITE_KEY'] = 'your_site_key'
app.config['RECAPTCHA_SECRET_KEY'] = 'your_secret_key'
recaptcha = ReCaptcha(app)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        if not recaptcha.verify():
            return "CAPTCHA verification failed!", 403
        return "Form submitted successfully!"
    return render_template('submit.html')

if __name__ == '__main__':
    app.run(debug=True)`;

  // Sample HTML form with CAPTCHA
  const sampleHTMLForm = `<form action="/submit" method="POST">
  <div class="g-recaptcha" data-sitekey="your_site_key"></div>
  <button type="submit">Submit</button>
</form>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>`;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">CAPTCHA Simulation</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">How CAPTCHA Works</h3>
        <p className="text-gray-700">
          <strong>CAPTCHA</strong> prevents automated bots from performing actions like form submissions or login attempts. It requires users to complete a challenge (e.g., identifying objects or solving puzzles) to prove they are human.
        </p>
        <p className="text-gray-700 mt-4">
          In the sample code, we use <code>Flask-ReCaptcha</code> to integrate Google reCAPTCHA. If the CAPTCHA verification fails, the request is blocked with a <code>403 Forbidden</code> response.
        </p>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">CAPTCHA Implementation</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap">{sampleCode}</pre>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold mb-2">Sample HTML Form with CAPTCHA</h4>
          <pre className="whitespace-pre-wrap">{sampleHTMLForm}</pre>
        </div>
        <button
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={simulateCaptchaBlock}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Try It'}
        </button>
      </div>
    </div>
  );
};

export default CaptchaPage;