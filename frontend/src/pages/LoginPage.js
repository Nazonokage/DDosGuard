import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { fetchCsrfToken } from '../api/axiosConfig'; // Import fetchCsrfToken
import { useAuth } from '../context/AuthContext'; // Import useAuth

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Use useAuth to access setUser

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await fetchCsrfToken(); // Fetch a fresh CSRF token before login
      
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.message) {
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          type: response.data.user.type,
        });
        navigate('/guides'); // Redirect to GuidesPage after successful login
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md neumorphic">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
