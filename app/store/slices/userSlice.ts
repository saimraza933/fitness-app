import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileApi } from "../../services/api";
import { API_BASE_URL } from "@/app/common";

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
  currentDietPlan: any
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  currentDietPlan: null
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

      try {
        // Try to get profile from API
        const profileData = await profileApi.getProfile();

        // Transform API response to match our ProfileData structure
        const formattedProfile: ProfileData = {
          name: profileData.name,
          age: profileData.age,
          weight: profileData.weight,
          height: profileData.height,
          goal: profileData.goal || "",
          notificationsEnabled: profileData.notifications_enabled,
          notificationTime: profileData.notification_time,
          profilePicture: profileData.profile_picture_url,
        };

        return formattedProfile;
      } catch (apiError) {
        console.log("API error, falling back to local storage", apiError);

        // Fall back to local storage if API fails
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
      }
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

      try {
        // Format data for API
        const apiProfileData = {
          name: profileData.name,
          age: profileData.age,
          weight: profileData.weight,
          height: profileData.height,
          goal: profileData.goal,
          notification_time: profileData.notificationTime,
          notifications_enabled: profileData.notificationsEnabled,
          profile_picture: profileData.profilePicture,
        };

        // Update profile via API
        await profileApi.updateProfile(apiProfileData);
      } catch (apiError) {
        console.log("API error, falling back to local storage", apiError);
      }

      // Always save to local storage as backup
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
  async (imageObj: any, { getState, dispatch }) => {
    try {
      // @ts-ignore - We know the state has user
      const currentProfile = getState().user.profile;

      if (!currentProfile) {
        throw new Error("Profile not loaded");
      }

      const updatedData = await profileApi.updateProfilePicture(imageObj);
      const profilePictureUrl = `${API_BASE_URL}${updatedData?.profile_picture_url}` || imageObj?.uri;
      const updatedProfile = {
        ...currentProfile,
        profilePicture: profilePictureUrl,
      };
      // profile()
      // @ts-ignore - We know the state has auth
      const userRole = getState().auth.userRole;
      const storageKey =
        userRole === "trainer" ? "trainer_profile" : "user_profile";
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedProfile));

      return profilePictureUrl;
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

      try {
        // Delete profile via API
        await profileApi.deleteProfile();
      } catch (apiError) {
        console.log("API error when deleting profile", apiError);
        // Continue with local deletion even if API fails
      }

      // Always remove from local storage
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
  reducers: {
    setCurrentDietPlan: (state, action) => {
      state.currentDietPlan = action.payload
    }
  },
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
export const { setCurrentDietPlan } = userSlice.actions;
export default userSlice.reducer;
