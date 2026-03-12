import axios from 'axios';

// Point React directly at the hosted backend.
// All calls like axios.get('/api/auth.php?...') become:
//   https://ddosguardbackendapi.free.nf/api/auth.php?...
// We do NOT send credentials so that CORS can stay simple (Access-Control-Allow-Origin: *).
const axiosInstance = axios.create({
  baseURL: 'https://ddosguardbackendapi.free.nf',
  withCredentials: false,
});

export default axiosInstance;
