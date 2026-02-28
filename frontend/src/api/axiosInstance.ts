import axios from 'axios';

// Use relative URL so Vite's proxy forwards requests to backend (avoids CORS)
const API = axios.create({ baseURL: '/' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('procurementToken');
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('procurementToken');
      localStorage.removeItem('procurementRoles');
      localStorage.removeItem('procurementUser');
      localStorage.removeItem('procurementUserId');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
