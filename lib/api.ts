import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: `${base_url}/api`,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic for handling 401 Unauthorized errors:
      // 1. Attempt to refresh the token.
      // 2. If refresh fails or is not applicable, redirect to the login page.
      console.error("Authentication Error: Token may be expired.");
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
