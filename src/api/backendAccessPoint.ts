import axios from 'axios';

// TODO: Replace with actual backend URL from environment variables
const BACKEND_URL = 'http://localhost:5104';

export const backendAccessPoint = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});
