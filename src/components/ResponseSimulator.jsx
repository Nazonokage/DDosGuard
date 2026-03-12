import React, { useState, useEffect } from 'react';
import './ResponseSimulator.css'; // Optional: for styling the response simulator

const ResponseSimulator = () => {
  const [status, setStatus] = useState('Normal');
  const [requests, setRequests] = useState(0);
  const [responseTime, setResponseTime] = useState(100); // in milliseconds

  useEffect(() => {
    // Simulate the effect of a DDoS attack
    const simulateAttack = () => {
      setStatus('Under Attack...');
      let requestCount = 0;
      let time = 100;

      const interval = setInterval(() => {
        requestCount += 1000; // Simulate 1000 requests per interval
        time += 50; // Increase response time as the attack progresses

        setRequests(requestCount);
        setResponseTime(time);

        if (time >= 1000) {
          clearInterval(interval);
          setStatus('Server Overloaded');
        }
      }, 1000); // Update every second

      return () => clearInterval(interval);
    };

    simulateAttack();
  }, []);

  return (
    <div className="response-simulator">
      <h3>Website Response Simulator</h3>
      <div className="status">
        <strong>Status:</strong> {status}
      </div>
      <div className="metrics">
        <div>
          <strong>Requests Received:</strong> {requests.toLocaleString()}
        </div>
        <div>
          <strong>Response Time:</strong> {responseTime} ms
        </div>
      </div>
      <div className="visualization">
        <div
          className="bar"
          style={{ width: `${Math.min(responseTime / 10, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ResponseSimulator;