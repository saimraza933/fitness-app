import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API base URL
const API_BASE_URL = "https://fitness.pixelgateltd.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    role: string;
    name: string;
    age: string;
    height: string;
    weight: string;
    goal: string;
  }) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export default api;
