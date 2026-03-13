import axios from 'axios';

const axiosInstance = axios.create({
  // ── PRODUCTION (Render) ────────────────────────────────────────────────────
  baseURL: 'https://ddosguard-7zrx.onrender.com',

  // ── LOCAL (Flask running on XAMPP) ── uncomment when developing locally ────
  // baseURL: 'http://localhost:5000',

  withCredentials: false,
});

// Attach JWT token automatically to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
