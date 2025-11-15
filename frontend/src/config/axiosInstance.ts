import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      auth.signOut();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
