import axios from 'axios';

const API_URL = 'https://mse2-fullstack-1.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Intercept requests to add the Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
