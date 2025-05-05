import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  notificationsEnabled: boolean;
  notificationTime: string;
  profilePicture?: string | null;
  password?: string;
}

interface UserState {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Default profiles for demo purposes
const defaultProfiles = {
  client: {
    name: "Sarah Johnson",
    age: "28",
    weight: "145",
    height: "5'6\"",
    goal: "Lose 10 pounds and improve overall fitness",
    notificationsEnabled: true,
    notificationTime: "08:00",
    profilePicture: null,
    password: "client123",
  },
  trainer: {
    name: "John Smith",
    age: "35",
    weight: "180",
    height: "6'1\"",
    goal: "Help clients achieve their fitness goals",
    notificationsEnabled: true,
    notificationTime: "08:00",
    profilePicture: null,
    password: "trainer123",
  },
};

// Load user profile
export const loadUserProfile = createAsyncThunk(
  "user/loadProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore - We know the state has auth
      const userRole = getState().auth.userRole;

      if (!userRole) {
        return rejectWithValue("User not logged in");
      }

      const storageKey =
        userRole === "trainer" ? "trainer_profile" : "user_profile";
      const savedProfile = await AsyncStorage.getItem(storageKey);

      if (savedProfile) {
        return JSON.parse(savedProfile) as ProfileData;
      }

      // Return default profile if none exists
      return userRole === "trainer"
        ? defaultProfiles.trainer
        : defaultProfiles.client;
    } catch (error) {
      console.error("Error loading profile:", error);
      return rejectWithValue("Failed to load profile");
    }
  },
);

// Save user profile
export const saveUserProfile = createAsyncThunk(
  "user/saveProfile",
  async (profileData: ProfileData, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore - We know the state has auth
      const userRole = getState().auth.userRole;

      if (!userRole) {
        return rejectWithValue("User not logged in");
      }

      const storageKey =
        userRole === "trainer" ? "trainer_profile" : "user_profile";
      await AsyncStorage.setItem(storageKey, JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.error("Error saving profile:", error);
      return rejectWithValue("Failed to save profile");
    }
  },
);

// Update profile picture
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (imageUri: string, { getState, dispatch }) => {
    try {
      // @ts-ignore - We know the state has user
      const currentProfile = getState().user.profile;

      if (!currentProfile) {
        throw new Error("Profile not loaded");
      }

      const updatedProfile = {
        ...currentProfile,
        profilePicture: imageUri,
      };

      // Save the updated profile
      await dispatch(saveUserProfile(updatedProfile));

      return imageUri;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  },
);

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore - We know the state has auth
      const userRole = getState().auth.userRole;

      if (!userRole) {
        return rejectWithValue("User not logged in");
      }

      const storageKey =
        userRole === "trainer" ? "trainer_profile" : "user_profile";
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error("Error deleting profile:", error);
      return rejectWithValue("Failed to delete profile");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load profile
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save profile
      .addCase(saveUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile picture
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profilePicture = action.payload;
        }
      })
      // Delete profile
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.profile = null;
      });
  },
});

export default userSlice.reducer;
