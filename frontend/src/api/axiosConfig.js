import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/ddosguard/api', // Proxy will handle the base URL
  withCredentials: true, // Include cookies for session management
});

let csrfToken = '';

// Fetch CSRF token from Flask
export const fetchCsrfToken = async () => {
  try {
    const response = await axiosInstance.get('/auth/get-csrf-token');
    csrfToken = response.data.csrf_token;
    // console.log('CSRF Token Fetched:', csrfToken); // Debugging
  } catch (error) {
    console.error('CSRF Token Fetch Error:', error);
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(config => {
  if (['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRF-Token'] = csrfToken;
    // console.log('CSRF Token Added to Request:', csrfToken); // Debugging
  }
  return config;
});

// Fetch CSRF token when the app loads
fetchCsrfToken();

export default axiosInstance;