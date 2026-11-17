import axios from "axios";
import { getAccessToken } from "../utils/tokenStore";

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
      `%c🚀 [API REQUEST] ${config.method?.toUpperCase()} -> ${config.url}`,
      "color: #4e5f41; font-weight: bold;",
      config.data || ""
    );

    return config;
  },
  (error) => {
    console.error("❌ [API REQUEST SETUP ERROR]:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Log response data & friendly errors
api.interceptors.response.use(
  (response) => {
    console.log(
      `%c✅ [API RESPONSE] ${response.status} from ${response.config.url}`,
      "color: #2b7a0b; font-weight: bold;",
      response.data
    );
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error(
      `%c❌ [API ERROR] ${error.response?.status || 'Network'} from ${error.config?.url}:`,
      "color: #d32f2f; font-weight: bold;",
      message
    );

    return Promise.reject(error);
  }
);

export default api;

