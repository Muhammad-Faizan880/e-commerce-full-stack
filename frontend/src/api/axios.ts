import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken, clearAccessToken } from "../utils/tokenStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Automatically attach access token & log request for easy debugging
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `%c [API REQUEST] ${config.method?.toUpperCase()} -> ${config.url}`,
      "color: #4e5f41; font-weight: bold;",
      config.data || ""
    );

    return config;
  },
  (error) => {
    console.error(" [API REQUEST SETUP ERROR]:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Log response data & friendly errors
api.interceptors.response.use(
  (response) => {
    console.log(
      `%c [API RESPONSE] ${response.status} from ${response.config.url}`,
      "color: #2b7a0b; font-weight: bold;",
      response.data
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // SILENT AUTO-REFRESH: When 401 occurs and request hasn't been retried yet
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        console.log("[AUTO_REFRESH: START] Access token expired. Requesting fresh token silently...");

        const refreshToken = getRefreshToken();
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log("[AUTO_REFRESH: SUCCESS] Re-executing original request with fresh token.");

          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.warn("[AUTO_REFRESH: FAILED] Session expired or invalid. Clearing tokens:", refreshErr);
        clearAccessToken();
      }
    }

    console.error(
      `%c [API ERROR] ${error.response?.status || 'Network'} from ${error.config?.url}:`,
      "color: #d32f2f; font-weight: bold;",
      message
    );

    return Promise.reject(error);
  }
);

export default api;

