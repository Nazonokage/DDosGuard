import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation links for simulation app
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/simulations/introduction", label: "Simulations" },
    { to: "/guides", label: "Guides" },
    { to: "/docs", label: "Docs" }
  ];

  return (
    <nav className="bg-[#0f172a] text-[#e0e0e0] fixed w-full shadow-md z-50 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-all duration-200 flex items-center gap-2">
              <span className="bg-blue-500 rounded-md p-1 text-white">DDoS</span>Guard
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="hover:text-blue-400 transition-all duration-200 font-medium relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1e293b] border-t border-gray-700">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 hover:text-white transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;