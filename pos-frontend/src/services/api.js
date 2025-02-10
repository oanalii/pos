import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  }
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