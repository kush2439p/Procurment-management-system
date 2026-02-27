import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8082' });

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
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
