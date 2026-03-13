import axios from 'axios';

const axiosInstance = axios.create({
  // ── LOCAL (Flask running on XAMPP machine) ─────────────────────────────────
  baseURL: 'http://localhost:5000',

  // ── PRODUCTION (PythonAnywhere) ── uncomment when deploying ───────────────
  // baseURL: 'https://yourusername.pythonanywhere.com',

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
