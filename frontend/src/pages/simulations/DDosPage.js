import React, { useState, useContext, useEffect } from 'react';
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
  const [chartData, setChartData] = useState([
    ['Time', 'Requests'],
    [0, 0], // Initial data point
  ]);

  // Reset chart when component unmounts
  useEffect(() => {
    return () => {
      setChartData([['Time', 'Requests'], [0, 0]]);
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
  const updateChart = (time, requests) => {
    setChartData((prevData) => [...prevData, [time, requests]]);
  };

  // Function to simulate normal traffic
  const simulateNormalTraffic = () => {
    setIsNormalRunning(true);
    setTerminalLogs([]); // Clear the terminal logs
    setStatus('Normal Traffic');
    setRequestsReceived(0);
    setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
    addLog('Starting Normal Traffic Simulation...');

    let time = 0;
    let requests = 0;
    const interval = setInterval(() => {
      time += 1;
      requests += Math.floor(Math.random() * 5) + 1; // Simulate random requests
      setResponseTime(100); // Normal response time
      setRequestsReceived(requests);
      updateChart(time, requests);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('Normal Traffic Ended');
        setIsNormalRunning(false);
        addLog('Normal Traffic Simulation Ended.');
      } else {
        addLog(`Request ${requests}: Status 200 OK (${Math.floor(Math.random() * 50) + 80}ms)`);
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
    setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
    addLog('Starting DoS Attack Simulation...');

    let time = 0;
    let requests = 0;
    const interval = setInterval(() => {
      time += 1;
      const newRequests = Math.floor(Math.random() * 10) + 15; // 15-25 new requests per second
      requests += newRequests;
      const responseTime = 100 + time * 50; // Increasing response time
      setResponseTime(responseTime);
      setRequestsReceived(requests);
      updateChart(time, requests);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('DoS Attack Stopped');
        setIsDosRunning(false);
        addLog('DoS Attack Simulation Ended.');
        addLog('Server performance degraded but recovered.');
      } else {
        addLog(`Received ${newRequests} requests from IP 192.168.1.${Math.floor(Math.random() * 10) + 1}`);
        addLog(`Current response time: ${responseTime}ms`);
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
    setChartData([['Time', 'Requests'], [0, 0]]); // Reset chart data
    addLog('Starting DDoS Attack Simulation...');
    addLog('Multiple IPs detected sending high volume traffic...');

    let time = 0;
    let requests = 0;
    const interval = setInterval(() => {
      time += 1;
      const newRequests = Math.floor(Math.random() * 30) + 40; // 40-70 new requests per second
      requests += newRequests;
      const responseTime = 100 + Math.min(time * 100, 1000); // Rapidly increasing response time, capped at 1100ms
      setResponseTime(responseTime);
      setRequestsReceived(requests);
      updateChart(time, requests);

      if (time >= 10) {
        clearInterval(interval);
        setStatus('Server Overloaded');
        setIsDdosRunning(false);
        addLog('DDoS Attack Overwhelmed the Server.');
        addLog('Service unavailable to legitimate users.');
        addLog('ERROR: Connection timeout for new requests.');
      } else {
        // Generate 3 random IPs to simulate distributed attack
        for (let i = 0; i < 3; i++) {
          const ip1 = Math.floor(Math.random() * 255);
          const ip2 = Math.floor(Math.random() * 255);
          addLog(`Received ${Math.floor(newRequests/3)} requests from IP ${ip1}.${ip2}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
        }
        addLog(`Current response time: ${responseTime}ms`);
        if (time > 5) {
          addLog('WARNING: Server resources reaching critical levels');
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

      {/* Google Chart for Visualization */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6 ">
        <Chart
          width={'100%'}
          height={'300px'}
          chartType="LineChart"
          loader={<div className="text-center py-8">Loading Chart...</div>}
          data={chartData}
          options={{
            title: 'Requests Over Time',
            titleTextStyle: { color: '#e2e8f0' },
            backgroundColor: '#1f2937',
            colors: ['#3b82f6'],
            curveType: 'function',
            legend: { position: 'bottom', textStyle: { color: '#e2e8f0' } },
            hAxis: { 
              title: 'Time (seconds)', 
              titleTextStyle: { color: '#e2e8f0' },
              textStyle: { color: '#e2e8f0' }
            },
            vAxis: { 
              title: 'Requests', 
              titleTextStyle: { color: '#e2e8f0' },
              textStyle: { color: '#e2e8f0' }
            },
            chartArea: { width: '80%', height: '70%' }
          }}
        />
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
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
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

       {/* Attack Comparison Table */}
       <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Attack Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Feature</th>
                <th className="py-2 px-4 border">Normal Traffic</th>
                <th className="py-2 px-4 border">DoS Attack</th>
                <th className="py-2 px-4 border">DDoS Attack</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border font-medium">Source</td>
                <td className="py-2 px-4 border">Multiple legitimate users</td>
                <td className="py-2 px-4 border">Single attacker</td>
                <td className="py-2 px-4 border">Multiple attackers (botnet)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border font-medium">Traffic Volume</td>
                <td className="py-2 px-4 border">Low to moderate</td>
                <td className="py-2 px-4 border">High</td>
                <td className="py-2 px-4 border">Very high</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border font-medium">IP Addresses</td>
                <td className="py-2 px-4 border">Various unique IPs</td>
                <td className="py-2 px-4 border">Single IP address</td>
                <td className="py-2 px-4 border">Multiple IP addresses</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border font-medium">Mitigation</td>
                <td className="py-2 px-4 border">No action needed</td>
                <td className="py-2 px-4 border">IP blocking, rate limiting</td>
                <td className="py-2 px-4 border">Traffic analysis, CDN, WAF</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border font-medium">Detection</td>
                <td className="py-2 px-4 border">Normal patterns</td>
                <td className="py-2 px-4 border">Easy to detect</td>
                <td className="py-2 px-4 border">Complex to detect</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DDosPage;