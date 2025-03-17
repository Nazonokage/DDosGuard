import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios, { fetchCsrfToken } from '../api/axiosConfig';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetchCsrfToken();
      await axios.post('/auth/logout');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-[#0f172a] text-[#e0e0e0] fixed top-0 left-0 w-full py-4 px-6 shadow-lg z-50 border-b border-gray-700 z-70">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors neumorphic">DDoSGuard</Link>
        
        <ul className="flex space-x-6">
          {user ? (
            <>
              <li><Link to="/simulations/introduction" className="hover:text-blue-400 transition-colors">Simulations</Link></li>
              <li><Link to="/guides" className="hover:text-blue-400 transition-colors">Guides</Link></li>
              <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Docs</Link></li>
              <li ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hover:text-blue-400 transition-colors"
                >
                  {user.name} ▼
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-md shadow-lg">
                    <Link to="/account-settings" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Edit Profile</Link>
                    <Link to="/feedback" className="block px-4 py-2 hover:bg-gray-700 transition-colors">Feedback</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;