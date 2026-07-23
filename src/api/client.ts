import axios from "axios";
import { API_BASE_URL } from "./config";
import { tokenStorage } from "./tokenStorage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach the access token to every request.
api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If we get a 401, try to refresh the access token once and retry the request.
// If refresh also fails, clear tokens so the app routes back to Login.
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the in-flight refresh to finish, then retry.
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        return api(originalRequest);
      }

      isRefreshing = true;
      try {
        const refresh = await tokenStorage.getRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_BASE_URL}/login/refresh/`, {
          refresh,
        });
        await tokenStorage.setAccessToken(data.access);

        pendingQueue.forEach((resolve) => resolve());
        pendingQueue = [];
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        pendingQueue = [];
        isRefreshing = false;
        await tokenStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
