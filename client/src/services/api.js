import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercept requests to attach auth token & guest id
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scriptflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let guestId = localStorage.getItem('scriptflow_guest_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('scriptflow_guest_id', guestId);
    }
    config.headers['x-guest-id'] = guestId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for consistent error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
