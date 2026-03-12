import React from 'react';
import { Link } from 'react-router-dom';

const GuidesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg shadow-lg p-8 mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">DDoS Protection Guides</h1>
        <p className="text-xl text-blue-100">Defend your systems with industry-leading strategies and tools.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Understanding DDoS Attacks</h2>
          <p className="text-gray-300 mb-4">
            DDoS (Distributed Denial of Service) attacks overwhelm servers with massive traffic from multiple sources,
            causing service disruption or complete outages. Unlike regular DoS attacks from a single source,
            DDoS attacks utilize botnets—networks of compromised computers—to amplify attack power.
          </p>
          <p className="text-gray-300 mb-4">
            These attacks target various system layers:
          </p>
          <ul className="list-disc pl-5 text-gray-300 mb-4">
            <li>Network layer (Layer 3/4): SYN floods, UDP floods</li>
            <li>Application layer (Layer 7): HTTP floods, Slowloris</li>
            <li>Volumetric attacks: Amplification techniques using DNS or NTP</li>
          </ul>
          <p className="text-gray-300">
            Modern DDoS attacks can reach over 1 Tbps, overwhelming even enterprise-grade infrastructure.
          </p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">How DDoS Disrupts Websites</h2>
          <p className="text-gray-300 mb-4">
            DDoS attacks create devastating impact through:
          </p>
          <ul className="list-disc pl-5 text-gray-300 mb-6">
            <li><span className="font-semibold text-blue-300">Resource exhaustion:</span> Server CPU, memory, and bandwidth become depleted</li>
            <li><span className="font-semibold text-blue-300">Connection saturation:</span> Maximum connections filled with malicious requests</li>
            <li><span className="font-semibold text-blue-300">Service timeouts:</span> Database connections and API endpoints timeout</li>
            <li><span className="font-semibold text-blue-300">Financial impact:</span> Business disruption costing thousands per minute</li>
          </ul>
          <p className="text-gray-300">
            The average DDoS attack costs businesses $20,000 to $40,000 per hour in lost revenue, according to industry reports.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-blue-400 mb-6">Protection Strategies</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Rate Limiting</h3>
          <p className="text-gray-300 mb-3">
            Restricts request frequency from IP addresses, preventing attackers from overwhelming resources with rapid requests.
          </p>
          <Link to="/simulations/rate-limit" className="text-blue-400 hover:text-blue-300">Learn more →</Link>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Web Application Firewall</h3>
          <p className="text-gray-300 mb-3">
            Filters and monitors HTTP traffic, blocking suspicious activity before it reaches your application servers.
          </p>
          <Link to="/simulations/waf" className="text-blue-400 hover:text-blue-300">Learn more →</Link>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">CAPTCHA Implementation</h3>
          <p className="text-gray-300 mb-3">
            Distinguishes between human users and bots, adding friction for automated attacks while minimizing impact on legitimate users.
          </p>
          <Link to="/simulations/captcha" className="text-blue-400 hover:text-blue-300">Learn more →</Link>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Traffic Analysis</h3>
          <p className="text-gray-300 mb-3">
            Behavioral analytics detect abnormal traffic patterns and automatically trigger mitigation strategies during attacks.
          </p>
          <Link to="/simulations/ddos" className="text-blue-400 hover:text-blue-300">Learn more →</Link>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Anycast Network</h3>
          <p className="text-gray-300 mb-3">
            Distributes traffic across multiple global data centers, absorbing attack traffic and reducing impact on individual servers.
          </p>
          <a href="/" className="text-blue-400 hover:text-blue-300">Coming soon →</a>
        </div>
        
        <div className="bg-[#1e293b] p-5 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition-all duration-300">
          <h3 className="text-xl font-bold text-blue-300 mb-3">Tor Exit Node Blocking</h3>
          <p className="text-gray-300 mb-3">
            Identifies and restricts access from known Tor exit nodes often used in DDoS attacks while maintaining legitimate access.
          </p>
          <Link to="/simulations/tor-block" className="text-blue-400 hover:text-blue-300">Learn more →</Link>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-blue-400 mb-6">Recommended Protection Services</h2>
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-md border border-gray-700 mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Enterprise Solutions",
                services: [
                  { name: "Cloudflare DDoS Protection", url: "https://www.cloudflare.com/ddos/", description: "Enterprise-grade protection with automatic mitigation and 100 Tbps network capacity." },
                  { name: "Akamai Prolexic", url: "https://www.akamai.com/products/cloud-security/prolexic", description: "Specialized in protecting against large-scale, complex DDoS attacks with 24/7 security operations." },
                  { name: "AWS Shield Advanced", url: "https://aws.amazon.com/shield/", description: "Integrated DDoS protection for applications running on AWS with cost protection and WAF integration." }
                ]
              },
              {
                title: "SMB Solutions",
                services: [
                  { name: "Cloudflare Pro", url: "https://www.cloudflare.com/plans/", description: "Affordable protection with basic DDoS mitigation suitable for small-to-medium websites." },
                  { name: "Sucuri", url: "https://sucuri.net/", description: "Website security platform with built-in DDoS protection and malware removal." },
                  { name: "Google Cloud Armor", url: "https://cloud.google.com/armor", description: "Layer 7 DDoS protection with predefined rules for common attacks." }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-blue-300 mb-3">{section.title}</h3>
                <ul className="space-y-3 text-gray-300">
                  {section.services.map((service, idx) => (
                    <li key={idx}>
                      <a href={service.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">
                        {service.name}:
                      </a> {service.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Protection?</h2>
        <p className="text-xl text-blue-100 mb-6">Try our interactive simulations to see how different protection strategies work in action.</p>
        <Link 
          to="/simulations/introduction" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Start Simulations
        </Link>
      </div>
    </div>
  );
};

export default GuidesPage;