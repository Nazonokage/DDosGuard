// src\pages\home.js
import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
      {/* Left: Moving Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={`${process.env.PUBLIC_URL}/img/mapache-pedro.gif`}
          alt="DDoS Simulation"
          className="w-64 md:w-96 animate-bounce"
        />
      </div>

      {/* Right: Introductory Text */}
      <div className="md:w-1/2 text-center md:text-left space-y-4 neumorphic">
        <h1 className="text-3xl font-bold">Welcome to PyDDoSGuard! 🛡️</h1>
        <p className="text-lg">
          The <strong>ultimate shield</strong> for developers against cyber threats!
          Learn how to <strong>protect</strong> your websites with real-world defense techniques.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>🔐 Learn <strong>rate limiting, WAF, honeypots</strong>, and more.</li>
          <li>⚡ Get hands-on experience with <strong>security best practices</strong>.</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
