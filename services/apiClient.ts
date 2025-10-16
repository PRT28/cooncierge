import axios from "axios";
import { clearAuthStorage, getAuthToken } from "@/services/storage/authStorage";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.karvaann.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    const bearerToken = token.startsWith("Bearer") ? token : `Bearer ${token}`;
    config.headers = config.headers ?? {};
    config.headers['x-access-token'] = bearerToken;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // clearAuthStorage();
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
