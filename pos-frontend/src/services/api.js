import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:1337'
    : 'https://api.hgtpos.es',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; 