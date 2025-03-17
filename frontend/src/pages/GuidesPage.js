import React from "react";

const GuidesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">DDoSGuard Guides</h1>
      
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
      </div>
      
      {/* External Resources */}
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-md mt-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Recommended DDoS Protection Services</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
              Cloudflare - DDoS Protection and Web Security
            </a>
          </li>
          <li>
            <a href="https://www.imperva.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
              Imperva - Advanced Threat Protection
            </a>
          </li>
          <li>
            <a href="https://aws.amazon.com/shield/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
              AWS Shield - Managed DDoS Protection
            </a>
          </li>
          <li>
            <a href="https://www.akamai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
              Akamai - Intelligent Edge Security
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GuidesPage;
