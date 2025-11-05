import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: `${base_url}/api`,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// A separate, standard axios instance for the refresh token call. 
// Must include withCredentials to send the HTTP-only cookie.
const refreshInstance = axios.create({
    baseURL: base_url,
    withCredentials: true, 
    headers: { "Content-Type": "application/json" }
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
  async (error) => {
    const originalRequest = error.config;

    // 1. Check for 401 status and ensure it's not a retry of a failed request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      console.warn("Access token expired. Attempting refresh...");

      // Set the flag to true to prevent infinite loops if the retry fails immediately
      originalRequest._retry = true; 

      try {
        // 2. Call the refresh token endpoint
        // This relies on the HTTP-only refresh token cookie being sent.
        const response = await refreshInstance.post('/api/auth/refresh-token'); 
        
        const { accessToken } = response.data; 

        // 3. Update tokens
        localStorage.setItem("accessToken", accessToken);

        // 4. Update the headers for the original failed request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // 5. Retry the original request with the new token
        // By returning the promise of the retried request, we resolve the interceptor chain
        return api(originalRequest);
        
      } catch (refreshError) {
        // 6. Handle failed refresh (e.g., refresh token expired/invalid)
        console.error("Token refresh failed. Redirecting to login.");
        localStorage.removeItem("accessToken");

        if (typeof window !== "undefined") {
            window.location.href = '/login'; 
        }

        // Return a rejection to stop the chain
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (including non-401 or a 401 on the retried request), return the error
    return Promise.reject(error);
  }
);

export default api;