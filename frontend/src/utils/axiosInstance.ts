import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BACKEND_API;

export const publicApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => privateApi(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await publicApi.post('/auth/refresh');
        processQueue(null);
        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('login');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
