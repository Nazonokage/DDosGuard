import React, { useState, useContext } from 'react';
import { SimulationContext } from '../SimulationPage';

const TorBlockPage = () => {
  const { setTerminalLogs, setStatus } = useContext(SimulationContext);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Simulate Tor blocking in a DDoS attack
  const simulateTorBlock = () => {
    setIsRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal');
    addLog('Starting DDoS Attack Simulation...');

    setTimeout(() => {
      addLog('Tor Blocking: Detected Request from Tor Network');
      setStatus('Tor Blocked (403 Forbidden)');
      addLog('Tor request successfully blocked!');
      setIsRunning(false);
    }, 3000);
  };

  // Sample code for Tor blocking
  const sampleCode = `from flask import Flask
from tor_block import TorBlock

app = Flask(__name__)
tor_block = TorBlock(app)

@app.route('/')
def home():
    if tor_block.is_tor(request):
        return "Access from Tor network is blocked!", 403
    return "Welcome to the site!"

if __name__ == '__main__':
    app.run(debug=True)`;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Tor Blocking Simulation</h2>

      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">How Tor Blocking Prevents DDoS/DoS Attacks</h3>
        <p className="text-gray-100">
          <strong>Tor Blocking</strong> prevents requests from the Tor network, which is often used to anonymize <i>DDoS/DoS attacks</i>. By blocking Tor exit nodes, you can reduce the risk of abuse.
        </p>
        <p className="text-gray-700 mt-4">
          In the sample code, we use a custom <code>TorBlock</code> middleware to detect and block requests from Tor exit nodes. If a Tor request is detected, it returns a <code>403 Forbidden</code> response.
        </p>
      </div>

      <div className="mt-8 bg-gray-700 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Tor Blocking Implementation</h3>
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap">{sampleCode}</pre>
        </div>
        <button
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={simulateTorBlock}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Try It'}
        </button>
      </div>
    </div>
  );
};

export default TorBlockPage;