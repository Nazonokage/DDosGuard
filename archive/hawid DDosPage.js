import React, { useState, useContext, useEffect } from 'react';
import { SimulationContext } from '../SimulationPage';
import { Chart } from 'react-google-charts';
import '../../styles/SimulationPage.css';

const DDosPage = () => {
  const {
    setTerminalLogs,
    setTerminalCode,
    setStatus,
    setRequestsReceived,
    setResponseTime,
  } = useContext(SimulationContext);

  const [isNormalRunning, setIsNormalRunning] = useState(false);
  const [isDosRunning, setIsDosRunning] = useState(false);
  const [isDdosRunning, setIsDdosRunning] = useState(false);
  const [chartData, setChartData] = useState([
    ['Time', 'Requests', 'Response Time (ms)'],
    [0, 0, 100], // Initial data point
  ]);
  const [attackIntensity, setAttackIntensity] = useState('medium');

  // Function to add logs to the terminal
  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Function to update the chart data
  const updateChart = (time, requests, responseTime) => {
    setChartData((prevData) => [...prevData, [time, requests, responseTime]]);
  };

  // Send chart data to response panel
  useEffect(() => {
    const chartComponent = (
      <Chart
        width={'100%'}
        height={'300px'}
        chartType="LineChart"
        loader={<div>Loading Chart...</div>}
        data={chartData}
        options={{
          title: 'Server Performance Metrics',
          curveType: 'function',
          legend: { position: 'bottom' },
          hAxis: { title: 'Time (seconds)' },
          vAxis: { title: 'Value', minValue: 0 },
          series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 }
          },
          vAxes: {
            0: { title: 'Requests' },
            1: { title: 'Response Time (ms)' }
          },
          colors: ['#4285F4', '#DB4437'],
        }}
      />
    );
    
    // We're not actually setting this as it's not part of the interface
    // This would require modifying the SimulationContext to include a setChartComponent
    // setChartComponent(chartComponent);
  }, [chartData]);

  // Function to simulate normal traffic
  const simulateNormalTraffic = () => {
    setIsNormalRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal Traffic');
    setRequestsReceived(0);
    setChartData([['Time', 'Requests', 'Response Time (ms)'], [0, 0, 100]]); // Reset chart data
    addLog('Starting Normal Traffic Simulation...');
    addLog('[SYSTEM] Server listening on port 80');
    addLog('[INFO] Load balancer ready');
    addLog('[INFO] 2 server instances active');

    let time = 0;
    let requests = 0;
    let responseTime = 100;
    
    const interval = setInterval(() => {
      time += 1;
      const newRequests = Math.floor(Math.random() * 5) + 1; // Simulate random requests
      requests += newRequests;
      
      // Slight variation in response time to make it realistic
      responseTime = Math.max(95, Math.min(110, responseTime + (Math.random() * 10 - 5)));
      
      setResponseTime(Math.round(responseTime));
      setRequestsReceived(requests);
      updateChart(time, requests, responseTime);

      for (let i = 0; i < newRequests; i++) {
        const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const urls = ['/index.html', '/about', '/products', '/contact', '/login'];
        const url = urls[Math.floor(Math.random() * urls.length)];
        const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        
        addLog(`[${new Date().toISOString().slice(11, 19)}] ${ip} - GET ${url} 200 OK (${Math.round(responseTime)}ms) [${browser}]`);
      }

      if (time >= 15) {
        clearInterval(interval);
        setStatus('Normal Traffic Ended');
        setIsNormalRunning(false);
        addLog('[SYSTEM] Normal Traffic Simulation Ended.');
        addLog('[INFO] Total requests processed: ' + requests);
        addLog('[INFO] Average response time: ' + Math.round(responseTime) + 'ms');
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Function to simulate a DoS attack
  const simulateDosAttack = () => {
    setIsDosRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Under DoS Attack...');
    setRequestsReceived(0);
    setChartData([['Time', 'Requests', 'Response Time (ms)'], [0, 0, 100]]); // Reset chart data
    
    addLog('[SYSTEM] Starting DoS Attack Simulation...');
    addLog('[SYSTEM] Server listening on port 80');
    addLog('[INFO] Load balancer ready');
    addLog('[INFO] 2 server instances active');
    addLog('[SECURITY] Traffic monitoring active');

    let time = 0;
    let requests = 0;
    let responseTime = 100;
    
    // Calculate requests per second based on attack intensity
    let requestsPerSecond = 20;
    if (attackIntensity === 'low') requestsPerSecond = 10;
    if (attackIntensity === 'high') requestsPerSecond = 30;
    
    const attackerIP = `104.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    const interval = setInterval(() => {
      time += 1;
      requests += requestsPerSecond;
      
      // Response time increases more dramatically in a DoS attack
      responseTime = responseTime + (time * 30);
      
      setResponseTime(Math.round(responseTime));
      setRequestsReceived(requests);
      updateChart(time, requests, responseTime);

      // Log every 5th request to keep the terminal readable
      for (let i = 0; i < Math.min(5, requestsPerSecond); i++) {
        const urls = ['/login', '/admin', '/api/user', '/api/data', '/search'];
        const url = urls[Math.floor(Math.random() * urls.length)];
        
        addLog(`[${new Date().toISOString().slice(11, 19)}] ${attackerIP} - GET ${url} 200 OK (${Math.round(responseTime)}ms)`);
      }
      
      // Add warning logs as attack progresses
      if (time === 3) {
        addLog('[WARNING] Unusual traffic detected from IP: ' + attackerIP);
      }
      
      if (time === 6) {
        addLog('[WARNING] Possible DoS attack in progress');
        addLog('[INFO] CPU usage increased to 65%');
        addLog('[INFO] Memory usage increased to 72%');
      }
      
      if (time === 9) {
        addLog('[ALERT] Server response time degrading');
        addLog('[INFO] CPU usage critical: 89%');
      }

      if (time >= 15) {
        clearInterval(interval);
        setStatus('DoS Attack Mitigated');
        setIsDosRunning(false);
        addLog('[SECURITY] Attack source identified: ' + attackerIP);
        addLog('[SECURITY] IP address ' + attackerIP + ' has been blocked');
        addLog('[SYSTEM] DoS Attack Simulation Ended.');
        addLog('[RECOVERY] Server resources returning to normal');
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Function to simulate a DDoS attack
  const simulateDdosAttack = () => {
    setIsDdosRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Under DDoS Attack...');
    setRequestsReceived(0);
    setChartData([['Time', 'Requests', 'Response Time (ms)'], [0, 0, 100]]); // Reset chart data
    
    addLog('[SYSTEM] Starting DDoS Attack Simulation...');
    addLog('[SYSTEM] Server listening on port 80');
    addLog('[INFO] Load balancer ready');
    addLog('[INFO] 4 server instances active');
    addLog('[SECURITY] Traffic monitoring active');
    addLog('[SECURITY] DDoS protection enabled');

    let time = 0;
    let requests = 0;
    let responseTime = 100;
    
    // Calculate requests per second based on attack intensity
    let requestsPerSecond = 50;
    if (attackIntensity === 'low') requestsPerSecond = 30;
    if (attackIntensity === 'high') requestsPerSecond = 80;
    
    const interval = setInterval(() => {
      time += 1;
      requests += requestsPerSecond;
      
      // Response time increases exponentially in a DDoS attack
      responseTime = responseTime + (time * time * 15);
      
      setResponseTime(Math.min(10000, Math.round(responseTime))); // Cap at 10 seconds for display
      setRequestsReceived(requests);
      updateChart(time, requests, Math.min(2000, responseTime)); // Cap chart value for better visualization
      
      // Generate botnet IPs and log requests
      for (let i = 0; i < Math.min(5, requestsPerSecond/10); i++) {
        const botIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const urls = ['/login', '/admin', '/api/user', '/api/data', '/search'];
        const url = urls[Math.floor(Math.random() * urls.length)];
        
        addLog(`[${new Date().toISOString().slice(11, 19)}] ${botIP} - GET ${url} ${responseTime > 5000 ? '504 Gateway Timeout' : '200 OK'} (${Math.round(responseTime)}ms)`);
      }
      
      // Add warning logs as attack progresses
      if (time === 2) {
        addLog('[WARNING] Multiple connection attempts detected from different IPs');
      }
      
      if (time === 4) {
        addLog('[ALERT] DDoS attack pattern identified');
        addLog('[INFO] Activating additional defense mechanisms');
        addLog('[INFO] CPU usage increased to 78%');
        addLog('[INFO] Memory usage increased to 85%');
        addLog('[SECURITY] Traffic from suspicious IPs being rate-limited');
      }
      
      if (time === 6) {
        addLog('[CRITICAL] Server resources under heavy strain');
        addLog('[INFO] CPU usage critical: 95%');
        addLog('[INFO] Available memory: 8%');
        addLog('[SECURITY] Enabling emergency mitigation measures');
      }
      
      if (time === 8) {
        addLog('[CRITICAL] Some services becoming unresponsive');
        addLog('[SECURITY] Contacting upstream provider for traffic scrubbing');
        addLog('[SYSTEM] Scaling up server resources');
      }
      
      if (time === 10) {
        addLog('[ALERT] Database connection pool exhausted');
        addLog('[SYSTEM] Some requests are being dropped');
        addLog('[504] Gateway timeout errors increasing');
      }

      if (time >= 15) {
        clearInterval(interval);
        
        if (attackIntensity === 'high') {
          setStatus('Server Crashed');
          addLog('[CRITICAL] Server unresponsive');
          addLog('[SYSTEM] Emergency restart initiated');
        } else {
          setStatus('DDoS Attack Ongoing');
          addLog('[INFO] Traffic filtering partially effective');
          addLog('[SECURITY] Attack traffic reduced by 40%');
        }
        
        setIsDdosRunning(false);
        addLog('[SYSTEM] DDoS Attack Simulation Ended.');
        addLog('[INFO] Total malicious requests: ' + requests);
        addLog('[LESSON] In a real-world scenario, this attack would require:');
        addLog('  - CDN-based DDoS protection');
        addLog('  - Traffic scrubbing services');
        addLog('  - Geographic-based access rules');
        addLog('  - Advanced rate limiting and bot detection');
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">DDoS Simulation</h2>
      
      {/* Educational Introduction */}
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-md mb-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Understanding DoS & DDoS Attacks</h3>
        <p className="mb-3">
          DoS (Denial of Service) and DDoS (Distributed Denial of Service) attacks are malicious attempts to 
          disrupt the normal traffic of a targeted server, service, or network by overwhelming it with 
          a flood of Internet traffic.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#121826] p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2 text-yellow-400">DoS Attack</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Uses a <span className="text-yellow-300">single source</span> (one computer)</li>
              <li>Easier to trace and block</li>
              <li>Limited by the bandwidth of the attacker</li>
              <li>Common techniques: SYN flood, HTTP flood</li>
            </ul>
          </div>
          <div className="bg-[#121826] p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2 text-red-400">DDoS Attack</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Uses <span className="text-red-300">multiple sources</span> (botnet of infected computers)</li>
              <li>Difficult to trace and block (multiple IPs)</li>
              <li>Can generate massive traffic (terabits per second)</li>
              <li>Types: Volumetric, Protocol, Application Layer</li>
            </ul>
          </div>
        </div>
        <p className="text-sm italic text-gray-400">These simulations demonstrate how these attacks work and their impact on server performance.</p>
      </div>

      {/* Attack Intensity Selector */}
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-md mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Attack Intensity</h3>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              attackIntensity === 'low' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setAttackIntensity('low')}
          >
            Low
          </button>
          <button
            className={`px-4 py-2 rounded ${
              attackIntensity === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setAttackIntensity('medium')}
          >
            Medium
          </button>
          <button
            className={`px-4 py-2 rounded ${
              attackIntensity === 'high' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setAttackIntensity('high')}
          >
            High
          </button>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Normal Traffic Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Normal Traffic</h3>
          </div>
          <p className="mb-4 text-sm">
            Regular user traffic accessing the server with reasonable intervals between requests.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Multiple unique IP addresses</li>
            <li>Various browser signatures</li>
            <li>Natural access patterns</li>
            <li>Low server resource usage</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isNormalRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateNormalTraffic();
            }}
            disabled={isNormalRunning || isDosRunning || isDdosRunning}
          >
            {isNormalRunning ? 'Running...' : 'Start Normal Traffic'}
          </button>
        </div>

        {/* DoS Attack Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <h3 className="text-xl font-semibold">DoS Attack</h3>
          </div>
          <p className="mb-4 text-sm">
            Attack from a single source sending rapidly repeated requests to overwhelm the server.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Single source IP address</li>
            <li>High frequency of requests</li>
            <li>Minimal variation in request patterns</li>
            <li>Growing server response time</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isDosRunning ? 'bg-gray-600' : 'bg-yellow-600 hover:bg-yellow-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateDosAttack();
            }}
            disabled={isNormalRunning || isDosRunning || isDdosRunning}
          >
            {isDosRunning ? 'Running...' : 'Start DoS Attack'}
          </button>
        </div>

        {/* DDoS Attack Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <h3 className="text-xl font-semibold">DDoS Attack</h3>
          </div>
          <p className="mb-4 text-sm">
            Coordinated attack from multiple sources (botnet) that quickly overwhelms server resources.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Multiple attacking IP addresses</li>
            <li>Massive request volume</li>
            <li>Distributed geographic origins</li>
            <li>Rapid server resource exhaustion</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isDdosRunning ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateDdosAttack();
            }}
            disabled={isNormalRunning || isDosRunning || isDdosRunning}
          >
            {isDdosRunning ? 'Running...' : 'Start DDoS Attack'}
          </button>
        </div>
      </div>
      
      {/* Mitigation Strategies Section */}
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-md mt-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Mitigation Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#121826] p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-green-400">Prevention</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Traffic analysis and filtering</li>
              <li>Rate limiting per IP address</li>
              <li>CAPTCHA for suspicious traffic</li>
              <li>Web Application Firewall (WAF)</li>
              <li>Geolocation filtering</li>
            </ul>
          </div>
          <div className="bg-[#121826] p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-400">Response</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Traffic scrubbing services</li>
              <li>CDN to absorb traffic</li>
              <li>Auto-scaling server resources</li>
              <li>IP blocking and blacklisting</li>
              <li>Traffic diversion (black hole routing)</li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-4">
          <p className="mb-2">Try our other simulations to learn more about these protection mechanisms:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rate Limiting: Controls the number of requests from a single source</li>
            <li>CAPTCHA: Distinguishes between human and automated traffic</li>
            <li>Web Application Firewall: Filters malicious traffic patterns</li>
            <li>Tor Blocking: Prevents anonymous access that might be used for attacks</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DDosPage;

























// import React, { useState, useContext, useEffect } from 'react';
// import { SimulationContext } from '../SimulationPage';
// import { Chart } from 'react-google-charts';

// const DDosPage = () => {
//   const {
//     setTerminalLogs,
//     setTerminalCode,
//     setStatus,
//     setRequestsReceived,
//     setResponseTime,
//   } = useContext(SimulationContext);

//   const [isNormalRunning, setIsNormalRunning] = useState(false);
//   const [isDosRunning, setIsDosRunning] = useState(false);
//   const [isDdosRunning, setIsDdosRunning] = useState(false);
//   const [chartData, setChartData] = useState([
//     ['Time', 'Requests'],
//     [0, 0], // Initial data point
//   ]);

//   // Reset chart when component unmounts
//   useEffect(() => {
//     return () => {
//       setChartData([['Time', 'Requests'], [0, 0]]);
//       setTerminalLogs([]);
//       setStatus('Normal');
//       setRequestsReceived(0);
//       setResponseTime(100);
//     };
//   }, [setRequestsReceived, setResponseTime, setStatus, setTerminalLogs]);

//   // Function to add logs to the terminal (without showing the code)
//   const addLog = (message) => {
//     setTerminalLogs((prevLogs) => [...prevLogs, message]);
//   };

//   // Function to update the chart data
//   const updateChart = (time, requests) => {
//     setChartData((prevData) => [...prevData, [time, requests]]);
//   };

//   // Function to simulate normal traffic
//   const simulateNormalTraffic = () => {
//     setIsNormalRunning(true);
//     setTerminalLogs([]); // Clear the terminal logs
//     setStatus('Normal Traffic');
//     setRequestsReceived(0);
//     setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
//     addLog('Starting Normal Traffic Simulation...');

//     let time = 0;
//     let requests = 0;
//     const interval = setInterval(() => {
//       time += 1;
//       requests += Math.floor(Math.random() * 5) + 1; // Simulate random requests
//       setResponseTime(100); // Normal response time
//       setRequestsReceived(requests);
//       updateChart(time, requests);

//       if (time >= 10) {
//         clearInterval(interval);
//         setStatus('Normal Traffic Ended');
//         setIsNormalRunning(false);
//         addLog('Normal Traffic Simulation Ended.');
//       } else {
//         addLog(`Request ${requests}: Status 200 OK (${Math.floor(Math.random() * 50) + 80}ms)`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   };

//   // Function to simulate a DoS attack
//   const simulateDosAttack = () => {
//     setIsDosRunning(true);
//     setTerminalLogs([]); // Clear the terminal logs
//     setStatus('Under DoS Attack...');
//     setRequestsReceived(0);
//     setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
//     addLog('Starting DoS Attack Simulation...');

//     let time = 0;
//     let requests = 0;
//     const interval = setInterval(() => {
//       time += 1;
//       const newRequests = Math.floor(Math.random() * 10) + 15; // 15-25 new requests per second
//       requests += newRequests;
//       const responseTime = 100 + time * 50; // Increasing response time
//       setResponseTime(responseTime);
//       setRequestsReceived(requests);
//       updateChart(time, requests);

//       if (time >= 10) {
//         clearInterval(interval);
//         setStatus('DoS Attack Stopped');
//         setIsDosRunning(false);
//         addLog('DoS Attack Simulation Ended.');
//         addLog('Server performance degraded but recovered.');
//       } else {
//         addLog(`Received ${newRequests} requests from IP 192.168.1.${Math.floor(Math.random() * 10) + 1}`);
//         addLog(`Current response time: ${responseTime}ms`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   };

//   // Function to simulate a DDoS attack
//   const simulateDdosAttack = () => {
//     setIsDdosRunning(true);
//     setTerminalLogs([]); // Clear the terminal logs
//     setStatus('Under DDoS Attack...');
//     setRequestsReceived(0);
//     setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
//     addLog('Starting DDoS Attack Simulation...');
//     addLog('Multiple IPs detected sending high volume traffic...');

//     let time = 0;
//     let requests = 0;
//     const interval = setInterval(() => {
//       time += 1;
//       const newRequests = Math.floor(Math.random() * 30) + 40; // 40-70 new requests per second
//       requests += newRequests;
//       const responseTime = 100 + Math.min(time * 100, 1000); // Rapidly increasing response time, capped at 1100ms
//       setResponseTime(responseTime);
//       setRequestsReceived(requests);
//       updateChart(time, requests);

//       if (time >= 10) {
//         clearInterval(interval);
//         setStatus('Server Overloaded');
//         setIsDdosRunning(false);
//         addLog('DDoS Attack Overwhelmed the Server.');
//         addLog('Service unavailable to legitimate users.');
//         addLog('ERROR: Connection timeout for new requests.');
//       } else {
//         // Generate 3 random IPs to simulate distributed attack
//         for (let i = 0; i < 3; i++) {
//           const ip1 = Math.floor(Math.random() * 255);
//           const ip2 = Math.floor(Math.random() * 255);
//           addLog(`Received ${Math.floor(newRequests/3)} requests from IP ${ip1}.${ip2}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
//         }
//         addLog(`Current response time: ${responseTime}ms`);
//         if (time > 5) {
//           addLog('WARNING: Server resources reaching critical levels');
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   };

//   // Sample code for normal traffic simulation
//   const normalCode = `import requests
// import time
// import random

// URL = "https://example.com"  # Target website URL
// REQUESTS = 10  # Total number of requests to send

// print("Starting normal web traffic simulation...")

// for i in range(REQUESTS):
//     try:
//         # Send a GET request to the target URL
//         response = requests.get(URL)
        
//         # Print the status code and response time
//         print(f"Request {i+1}: Status {response.status_code}, Time: {response.elapsed.total_seconds()*1000:.2f}ms")
        
//         # Simulate realistic user behavior with random delays between 1-3 seconds
//         delay = random.uniform(1, 3)
//         time.sleep(delay)
        
//     except Exception as e:
//         print(f"Error making request: {e}")

// print("Normal traffic simulation complete.")`;

//   // Sample code for DoS attack simulation
//   const dosCode = `import requests
// import threading
// import time

// TARGET_URL = "https://example.com"  # Target website URL
// THREADS = 5      # Number of concurrent threads
// REQUESTS_PER_THREAD = 50  # Requests per thread
// REQUEST_TIMEOUT = 2  # Timeout for each request (seconds)

// def send_requests():
//     """Function to send multiple requests from a single thread"""
//     thread_name = threading.current_thread().name
//     print(f"{thread_name} started sending requests")
    
//     success_count = 0
//     failed_count = 0
    
//     for i in range(REQUESTS_PER_THREAD):
//         try:
//             # Send GET request with timeout
//             start_time = time.time()
//             response = requests.get(TARGET_URL, timeout=REQUEST_TIMEOUT)
//             elapsed = (time.time() - start_time) * 1000  # Convert to milliseconds
            
//             print(f"{thread_name}: Request {i+1} - Status {response.status_code}, Time: {elapsed:.2f}ms")
//             success_count += 1
            
//         except requests.exceptions.Timeout:
//             print(f"{thread_name}: Request {i+1} - TIMEOUT")
//             failed_count += 1
//         except Exception as e:
//             print(f"{thread_name}: Request {i+1} - ERROR: {str(e)}")
//             failed_count += 1
    
//     print(f"{thread_name} completed. Success: {success_count}, Failed: {failed_count}")

// print("Starting DoS simulation...")
// print(f"Target: {TARGET_URL}")
// print(f"Creating {THREADS} threads with {REQUESTS_PER_THREAD} requests each")

// # Create and start multiple threads
// threads = []
// for i in range(THREADS):
//     thread = threading.Thread(target=send_requests, name=f"Thread-{i+1}")
//     thread.start()
//     threads.append(thread)
//     print(f"Thread-{i+1} started")

// # Wait for all threads to complete
// for thread in threads:
//     thread.join()

// print("DoS simulation completed")`;

//   // Sample code for DDoS attack simulation
//   const ddosCode = `import asyncio
// import aiohttp
// import time
// import random

// # Configuration
// TARGET_URL = "https://example.com"  # Target website
// TOTAL_REQUESTS = 500  # Total number of requests to send
// MAX_CONCURRENT = 100  # Maximum number of concurrent requests
// IP_COUNT = 25         # Number of different IPs to simulate

// # Generate random IP addresses to simulate distributed attack
// def get_random_ip():
//     return f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"

// # Create a list of simulated IP addresses
// botnet_ips = [get_random_ip() for _ in range(IP_COUNT)]

// # Sample user agents to make requests look more legitimate
// user_agents = [
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
//     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
//     "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
//     "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)",
// ]

// async def send_request(session, request_id):
//     # Select a random IP and user agent for this request
//     ip = random.choice(botnet_ips)
//     user_agent = random.choice(user_agents)
    
//     # Set headers to simulate the request coming from different sources
//     headers = {
//         "User-Agent": user_agent,
//         "X-Forwarded-For": ip,
//         "Cache-Control": "no-cache"
//     }
    
//     start_time = time.time()
    
//     try:
//         async with session.get(TARGET_URL, headers=headers, timeout=5) as response:
//             elapsed = (time.time() - start_time) * 1000  # Convert to ms
//             print(f"Request {request_id+1} from {ip}: Status {response.status}, Time: {elapsed:.2f}ms")
//             return True
//     except asyncio.TimeoutError:
//         print(f"Request {request_id+1} from {ip}: TIMEOUT")
//         return False
//     except Exception as e:
//         print(f"Request {request_id+1} from {ip}: ERROR - {str(e)}")
//         return False

// async def main():
//     print(f"Starting DDoS simulation against {TARGET_URL}")
//     print(f"Sending {TOTAL_REQUESTS} requests from {IP_COUNT} different IPs")
    
//     # Create a ClientSession to reuse connections
//     async with aiohttp.ClientSession() as session:
//         # Create tasks for all requests
//         tasks = [send_request(session, i) for i in range(TOTAL_REQUESTS)]
        
//         # Process requests in chunks to avoid overwhelming the machine running the script
//         successes = 0
//         failures = 0
        
//         for i in range(0, len(tasks), MAX_CONCURRENT):
//             chunk = tasks[i:i+MAX_CONCURRENT]
//             results = await asyncio.gather(*chunk)
            
//             successes += sum(results)
//             failures += len(results) - sum(results)
            
//             print(f"Progress: {i+len(chunk)}/{TOTAL_REQUESTS} requests processed")
            
//             # Small delay between chunks to allow for console output
//             await asyncio.sleep(0.1)
    
//     print("DDoS simulation completed")
//     print(f"Results: {successes} successful requests, {failures} failed requests")

// # Run the async event loop
// if __name__ == "__main__":
//     asyncio.run(main())`;

//   return (
//     <div className="p-4 md:p-8">
//       <h2 className="text-2xl font-bold mb-4">DDoS Attack Simulation</h2>
//       <p className="mb-6 text-gray-300">
//         This simulation demonstrates the behavior of web servers under various traffic conditions,
//         from normal traffic to DoS and DDoS attacks. Click the buttons below to run different simulations
//         and observe the impact on server response time and request handling capacity.
//       </p>

//       {/* Google Chart for Visualization */}
//       <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
//         <Chart
//           width={'100%'}
//           height={'300px'}
//           chartType="LineChart"
//           loader={<div className="text-center py-8">Loading Chart...</div>}
//           data={chartData}
//           options={{
//             title: 'Requests Over Time',
//             titleTextStyle: { color: '#e2e8f0' },
//             backgroundColor: '#1f2937',
//             colors: ['#3b82f6'],
//             curveType: 'function',
//             legend: { position: 'bottom', textStyle: { color: '#e2e8f0' } },
//             hAxis: { 
//               title: 'Time (seconds)', 
//               titleTextStyle: { color: '#e2e8f0' },
//               textStyle: { color: '#e2e8f0' }
//             },
//             vAxis: { 
//               title: 'Requests', 
//               titleTextStyle: { color: '#e2e8f0' },
//               textStyle: { color: '#e2e8f0' }
//             },
//             chartArea: { width: '80%', height: '70%' }
//           }}
//         />
//       </div>

//       {/* Simulation Buttons Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <button
//           className={`px-4 py-3 rounded-lg text-white font-medium transition ${
//             isNormalRunning ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
//           }`}
//           onClick={() => {
//             setTerminalCode(''); // Don't show code in terminal
//             simulateNormalTraffic();
//           }}
//           disabled={isNormalRunning || isDosRunning || isDdosRunning}
//         >
//           {isNormalRunning ? 'Running Normal Traffic...' : 'Run Normal Traffic'}
//         </button>
        
//         <button
//           className={`px-4 py-3 rounded-lg text-white font-medium transition ${
//             isDosRunning ? 'bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'
//           }`}
//           onClick={() => {
//             setTerminalCode(''); // Don't show code in terminal
//             simulateDosAttack();
//           }}
//           disabled={isNormalRunning || isDosRunning || isDdosRunning}
//         >
//           {isDosRunning ? 'Running DoS Attack...' : 'Run DoS Attack'}
//         </button>
        
//         <button
//           className={`px-4 py-3 rounded-lg text-white font-medium transition ${
//             isDdosRunning ? 'bg-gray-600' : 'bg-red-500 hover:bg-red-600'
//           }`}
//           onClick={() => {
//             setTerminalCode(''); // Don't show code in terminal
//             simulateDdosAttack();
//           }}
//           disabled={isNormalRunning || isDosRunning || isDdosRunning}
//         >
//           {isDdosRunning ? 'Running DDoS Attack...' : 'Run DDoS Attack'}
//         </button>
//       </div>

//       {/* Normal Traffic Section */}
//       <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
//         <h3 className="text-xl font-semibold mb-4">Normal Traffic</h3>
//         <p className="mb-4 text-gray-300">
//           This simulates normal user traffic. The server handles requests efficiently with consistent, low response times.
//           In normal traffic conditions, a server typically processes a small number of requests per second from different
//           users, with minimal impact on performance.
//         </p>
//         <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
//           <pre className="whitespace-pre-wrap">{normalCode}</pre>
//         </div>
//       </div>

//       {/* DoS Attack Section */}
//       <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
//         <h3 className="text-xl font-semibold mb-4">DoS Attack</h3>
//         <p className="mb-4 text-gray-300">
//           This simulates a Denial of Service (DoS) attack from a single source. The server's response time increases as it gets 
//           overwhelmed with requests. A DoS attack is characterized by a high volume of requests from a single source, aiming 
//           to exhaust server resources and make the service unavailable to legitimate users.
//         </p>
//         <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
//           <pre className="whitespace-pre-wrap">{dosCode}</pre>
//         </div>
//       </div>

//       {/* DDoS Attack Section */}
//       <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
//         <h3 className="text-xl font-semibold mb-4">DDoS Attack</h3>
//         <p className="mb-4 text-gray-300">
//           This simulates a Distributed Denial of Service (DDoS) attack using a botnet. The server is overwhelmed by requests 
//           from multiple sources simultaneously. Unlike a DoS attack, a DDoS attack originates from many different IP addresses,
//           making it much harder to mitigate and significantly more dangerous to server infrastructure.
//         </p>
//         <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
//           <pre className="whitespace-pre-wrap">{ddosCode}</pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DDosPage;