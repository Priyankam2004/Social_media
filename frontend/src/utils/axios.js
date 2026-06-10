import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (redux-persist stores it there)
    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        const authState = JSON.parse(parsedState.auth || '{}');
        if (authState.token) {
          config.headers.Authorization = `Bearer ${authState.token}`;
        }
      }
    } catch (e) {
      // Silently fail if parsing fails
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem('persist:root');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
