import React, { useState, createContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// Create a context for sharing state
export const SimulationContext = createContext();

const SimulationPage = () => {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [terminalCode, setTerminalCode] = useState('');
  const [status, setStatus] = useState('Normal');
  const [requestsReceived, setRequestsReceived] = useState(0);
  const [responseTime, setResponseTime] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  const location = useLocation();
  const isIntroductionPage = location.pathname === '/simulations' || location.pathname === '/simulations/introduction';

  return (
    <SimulationContext.Provider
      value={{
        terminalLogs,
        setTerminalLogs,
        terminalCode,
        setTerminalCode,
        status,
        setStatus,
        requestsReceived,
        setRequestsReceived,
        responseTime,
        setResponseTime,
      }}
    >
      <div className="flex h-screen bg-[#121826] text-gray-200">
        {/* Burger Button for Mobile View */}
        <button
          className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-[#1e293b] rounded-full text-white focus:outline-none shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Sidebar (Left) - Hidden on mobile, shown on desktop */}
        <div
          className={`w-64 bg-[#1e293b] text-white p-6 shadow-lg fixed h-full overflow-y-auto border-r border-gray-700 transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0  z-50`}
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Simulations</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/simulations/introduction" className="hover:text-blue-300 transition-colors">
                Introduction
              </Link>
            </li>
            <li>
              <Link to="/simulations/ddos" className="hover:text-blue-300 transition-colors">
                DDoS Simulation
              </Link>
            </li>
            <li>
              <Link to="/simulations/rate-limit" className="hover:text-blue-300 transition-colors">
                Rate Limiting
              </Link>
            </li>
            <li>
              <Link to="/simulations/csrf" className="hover:text-blue-300 transition-colors">
                CSRF Protection
              </Link>
            </li>
            <li>
              <Link to="/simulations/captcha" className="hover:text-blue-300 transition-colors">
                CAPTCHA
              </Link>
            </li>
            <li>
              <Link to="/simulations/waf" className="hover:text-blue-300 transition-colors">
                Web Application Firewall
              </Link>
            </li>
            <li>
              <Link to="/simulations/tor-block" className="hover:text-blue-300 transition-colors">
                Tor Blocking
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content (Middle) */}
        <div className={`flex-1 ml-0 md:ml-64 p-8 overflow-y-auto ${isIntroductionPage ? 'mr-0' : 'mr-0 md:mr-96'} text-gray-300`}>
          {/* Terminal and Response Section (Above on Mobile) */}
          {!isIntroductionPage && (
            <div className="md:hidden bg-[#1e293b] p-6 rounded-lg shadow-md mb-6 border border-gray-700">
              <div className="bg-[#334155] p-4 rounded-lg mb-6 text-blue-300">
                <h3 className="text-lg font-semibold mb-4">Response</h3>
                <div className="space-y-2">
                  <div>
                    <strong>Status:</strong> {status}
                  </div>
                  <div>
                    <strong>Requests Received:</strong> {requestsReceived}
                  </div>
                  <div>
                    <strong>Response Time:</strong> {responseTime} ms
                  </div>
                </div>
              </div>
              <div className="bg-[#0f172a] text-green-400 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Terminal</h3>
                <pre className="whitespace-pre-wrap text-green-300">{terminalCode}</pre>
                <pre className="whitespace-pre-wrap text-gray-300">{terminalLogs.join('\n')}</pre>
              </div>
            </div>
          )}

          {/* Outlet for rendering child routes */}
          <Outlet />
        </div>

        {/* Terminal and Response Section (Right) - Hidden on mobile, shown on desktop */}
        {!isIntroductionPage && (
          <div className="hidden md:block w-96 bg-[#1e293b] p-6 shadow-lg fixed right-0 h-full overflow-y-auto border-l border-gray-700">
            <div className="bg-[#334155] p-4 rounded-lg mb-6 text-blue-300">
              <h3 className="text-lg font-semibold mb-4">Response</h3>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong> {status}
                </div>
                <div>
                  <strong>Requests Received:</strong> {requestsReceived}
                </div>
                <div>
                  <strong>Response Time:</strong> {responseTime} ms
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] text-green-400 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Terminal</h3>
              <pre className="whitespace-pre-wrap text-green-300">{terminalCode}</pre>
              <pre className="whitespace-pre-wrap text-gray-300">{terminalLogs.join('\n')}</pre>
            </div>
          </div>
        )}
      </div>
    </SimulationContext.Provider>
  );
};

export default SimulationPage;