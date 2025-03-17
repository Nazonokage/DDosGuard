import React from 'react';
import { Link } from 'react-router-dom';


const IntroductionPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Introduction to Simulations</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Welcome to the Simulation Platform</h3>
        <p className="mb-4 text-gray-700">
          This platform allows you to simulate various types of attacks and defenses to understand how they work and how to protect against them.
        </p>
        <p className="mb-4 text-gray-700">
          You can navigate through different simulations using the sidebar on the left. Each simulation will provide you with a hands-on experience and code examples to help you understand the concepts better.
        </p>
        <p className="mb-4 text-gray-700">
          Feel free to explore and experiment with the simulations. If you have any questions or feedback, please visit the{' '}
          <Link to="/feedback" className="text-blue-500 hover:underline">
            Feedback
          </Link>{' '}
          page.
        </p>
      </div>
    </div>
  );
};

export default IntroductionPage;