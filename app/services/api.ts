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

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData: {
    name: string;
    age: string;
    weight: string;
    height: string;
    goal: string;
    notification_time: string;
    notifications_enabled: boolean;
    profile_picture?: string | null;
  }) => {
    // Ensure notifications_enabled is always set to true as it's required and must be a boolean
    const updatedData = {
      ...profileData,
      notifications_enabled: true,
    };
    const response = await api.put("/profile", updatedData);
    return response.data;
  },

  updateProfilePicture: async (imageUri: string) => {
    // Create form data for image upload
    const formData = new FormData();

    // Get filename from URI
    const uriParts = imageUri.split("/");
    const fileName = uriParts[uriParts.length - 1];

    // Append the image to form data
    // @ts-ignore - FormData expects specific types
    formData.append("profile_picture", {
      uri: imageUri,
      name: fileName,
      type: "image/jpeg", // Assuming JPEG format, adjust if needed
    });

    const response = await api.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  removeProfilePicture: async () => {
    const response = await api.put("/profile", { profile_picture: null });
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete("/profile");
    return response.data;
  },
};

export default api;
