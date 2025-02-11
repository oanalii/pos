import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:1337'
  : 'https://api.hgtpos.es';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,  // Add timeout
});

// Add a request interceptor to add the token to all requests
API.interceptors.request.use((config) => {
  // For admin routes, use adminToken
  if (config.url.includes('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // For regular routes, use jwtToken
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API; 