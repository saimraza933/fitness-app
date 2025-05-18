import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../services/api";

type UserRole = "client" | "trainer" | null;

interface AuthState {
  userId: string | null;
  email: string | null;
  userRole: UserRole;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  userRole: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// Initialize auth state from AsyncStorage
export const initializeAuth = createAsyncThunk("auth/initialize", async () => {
  try {
    // Check login status
    const token = await AsyncStorage.getItem("auth_token");
    const userId = await AsyncStorage.getItem("user_id");
    const email = await AsyncStorage.getItem("user_email");
    const userRole = await AsyncStorage.getItem("user_role");
    const isLoggedIn = await AsyncStorage.getItem("is_logged_in");

    console.log(
      "AuthSlice init - stored role:",
      userRole,
      "logged in:",
      isLoggedIn,
    );

    if (token && userId && email && userRole && isLoggedIn === "true") {
      console.log("Setting user role from storage to:", userRole);
      return {
        userId,
        email,
        userRole: userRole as UserRole,
        token,
        isLoggedIn: true,
      };
    }
    return {
      userId: null,
      email: null,
      userRole: null as UserRole,
      token: null,
      isLoggedIn: false,
    };
  } catch (error) {
    console.error("Error initializing auth:", error);
    return {
      userId: null,
      email: null,
      userRole: null as UserRole,
      token: null,
      isLoggedIn: false,
    };
  }
});

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      console.log("Login attempt with email:", email);

      // Call the API
      const response = await authApi.login(email, password);
      console.log("response", response);

      // Store auth data in AsyncStorage
      await AsyncStorage.setItem("auth_token", response.token);
      await AsyncStorage.setItem("user_id", String(response.id));
      await AsyncStorage.setItem("user_email", response.email);
      await AsyncStorage.setItem("user_role", response.role);
      await AsyncStorage.setItem("is_logged_in", "true");

      console.log("Login successful, user role set to:", response.role);

      return {
        userId: response.id,
        email: response.email,
        userRole: response.role as UserRole,
        token: response.token,
        isLoggedIn: true,
      };
    } catch (error: any) {
      console.error("Error during login:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    // Clear auth data from AsyncStorage
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem("user_email");
    await AsyncStorage.removeItem("user_role");
    await AsyncStorage.setItem("is_logged_in", "false");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
});

// Reset password thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("Password reset attempt for email:", email);

      // Call the API
      const response = await authApi.resetPassword(email);
      return response.success;
    } catch (error: any) {
      console.error("Error during password reset:", error);
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);

// Signup thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    userData: {
      email: string;
      password: string;
      role: UserRole;
      name: string;
      age: string;
      height: string;
      weight: string;
      goal: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // Call the API
      const response = await authApi.register(userData);

      // Store auth data in AsyncStorage
      await AsyncStorage.setItem("auth_token", response.token);
      await AsyncStorage.setItem("user_id", String(response.id));
      await AsyncStorage.setItem("user_email", response.email);
      await AsyncStorage.setItem("user_role", response.role);
      await AsyncStorage.setItem("is_logged_in", "true");

      return {
        userId: response.id,
        email: response.email,
        userRole: response.role as UserRole,
        token: response.token,
        isLoggedIn: true,
      };
    } catch (error: any) {
      console.error("Error during signup:", error);
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

// Change password thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      // Call the API
      const response = await authApi.changePassword(oldPassword, newPassword);
      return response.success;
    } catch (error: any) {
      console.error("Error changing password:", error);
      return rejectWithValue(
        error.response?.data?.message || "Password change failed",
      );
    }
  },
);

// For backward compatibility - will be removed in future
export const loadSavedUsers = createAsyncThunk(
  "auth/loadSavedUsers",
  async () => {
    return [];
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userId = null;
        state.email = null;
        state.userRole = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
