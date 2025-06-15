import axios from "axios";
import { useAuthStore } from "@/store/authStore.ts";

const API_BASE_URL = import.meta.env.VITE_BE_URL || "http://localhost:5002/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, login, logout } = useAuthStore.getState();

    if (
      error.response.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        const user = useAuthStore.getState().user;
        if (user) {
          login(user, newAccessToken, newRefreshToken);
        } else {
          logout();
          return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Unable to refresh token. Logging out.", refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response.status === 403) {
      console.error("Forbidden. Logging out.");
      logout();
    }

    return Promise.reject(error);
  },
);

export default api;
