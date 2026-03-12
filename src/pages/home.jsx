// src\pages\home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
      {/* Left: Moving Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/img/logo.png"
          alt="DDoS Simulation"
          className="w-64 md:w-96 animatefloat" //animate-bounce
        />
      </div>

      {/* Right: Introductory Text */}
      <div className="md:w-1/2 text-center md:text-left space-y-4 neumorphic">
        <h1 className="text-3xl font-bold text-blue-400">Welcome to DDoSGuard! 🛡️</h1>
        <p className="text-lg">
          The <strong>ultimate simulation platform</strong> for learning cyber security!
          Learn how to <strong>protect</strong> your websites with real-world defense techniques through interactive simulations.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>🔐 Learn <strong>rate limiting, WAF, honeypots</strong>, and more.</li>
          <li>⚡ Get hands-on experience with <strong>security best practices</strong>.</li>
          <li>🎮 Interactive simulations for <strong>DDoS, CSRF, CAPTCHA</strong> and more.</li>
        </ul>
        <Link 
          to="/simulations/introduction" 
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
