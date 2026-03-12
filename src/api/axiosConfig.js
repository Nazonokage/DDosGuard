import axios from 'axios';

// Use relative /api URLs and let the React dev server proxy
// to the PHP backend at http://localhost/capstonebackend via package.json "proxy".
const axiosInstance = axios.create({
  // baseURL intentionally left default (same origin)
  withCredentials: true,
});

export default axiosInstance;
