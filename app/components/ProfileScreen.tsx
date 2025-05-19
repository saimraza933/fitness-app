import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import Popover from "react-native-popover-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { logout, changePassword } from "../store/slices/authSlice";
import {
  loadUserProfile,
  saveUserProfile,
  updateProfilePicture,
  deleteUserProfile,
} from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileApi } from "../services/api";
import {
  Camera,
  Edit2,
  Save,
  Bell,
  Trash2,
  Lock,
  LogOut,
  AlertTriangle,
  Clock,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../common";
import * as Notifications from 'expo-notifications';

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

const capitalizeFirstLetter = (str: any) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};


const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { userRole, userId } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.user);

  const router = useRouter();
  const [isProfileUpdating, setIsProfileUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageMenuAnchor, setImageMenuAnchor] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)
  // Local state to track profile data while editing
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    age: '',
    weight: "",
    height: "",
    goal: "",
    notificationsEnabled: true,
    notificationTime: "08:00",
    profilePicture: null,
    password: "password123", // Mock password for demo purposes
  });

  useEffect(() => {
    dispatch(loadUserProfile());
  }, [dispatch]);

  // useEffect(() => {
  //   if (userRole === "client" && profileData?.notificationTime) {
  //     scheduleDailyReminder(profileData.notificationTime);
  //   }
  // }, [profileData?.notificationTime]);


  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      const profilePicture = profile?.profilePicture ? `${API_BASE_URL}${profile?.profilePicture}` :
        `https://picsum.photos/id/${userId}/200/200`
      setProfileData({ ...profile, profilePicture, age: String(profile?.age), notificationsEnabled: profile?.notificationsEnabled });
    }
  }, [profile]);

  const saveProfileData = async () => {
    setIsProfileUpdating(true)
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
        // Don't include profile_picture here as we're not changing it
      };

      // try {
      //   // Update profile via API directly
      //   await profileApi.updateProfile(apiProfileData);
      // } catch (apiError) {
      //   console.log("API error when saving profile", apiError);
      //   // Continue with local update even if API fails
      // }

      // Update Redux state
      await dispatch(saveUserProfile(apiProfileData));
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile data:", error);
      Alert.alert("Error", "Failed to save profile data");
    } finally {
      setIsProfileUpdating(false)
    }
  };

  const toggleNotifications = () => {
    setProfileData({
      ...profileData,
      notificationsEnabled: !profileData.notificationsEnabled,
    });
  };

  const pickImage = async () => {
    try {
      // Request permission to access the photo library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos",
        );
        return;
      }

      setIsUploading(true);

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Update profile data with the selected image URI
        const imageUri = result.assets[0].uri;

        try {
          // Update Redux state - this will call the API with form data
          const updatedImageUrl = await dispatch(
            updateProfilePicture(imageUri),
          ).unwrap();

          // Update local state with the returned URL or the local URI if no URL returned
          setProfileData({
            ...profileData,
            profilePicture: updatedImageUrl || imageUri,
          });
        } catch (error) {
          console.error("Error updating profile picture:", error);
          Alert.alert("Error", "Failed to upload image to server");

          // Still update local state with the local URI
          setProfileData({
            ...profileData,
            profilePicture: imageUri,
          });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      // Update profile data to remove the profile picture
      const updatedProfile = {
        ...profileData,
        profilePicture: null,
      };

      // Update local state
      setProfileData(updatedProfile);

      try {
        // Call the API to remove profile picture
        await profileApi.removeProfilePicture();

        // Update Redux state
        await dispatch(saveUserProfile(updatedProfile));
        Alert.alert("Success", "Profile picture removed");
      } catch (apiError) {
        console.error("API error removing profile picture:", apiError);

        // Still update Redux state locally
        await dispatch(saveUserProfile(updatedProfile));
        Alert.alert(
          "Warning",
          "Profile picture removed locally but server update failed",
        );
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      Alert.alert("Error", "Failed to remove profile picture");
    }
  };

  const requestNotificationPermission = () => {
    Alert.alert(
      "Enable Notifications",
      "FitHer would like to send you workout and meal reminders",
      [
        {
          text: "Don't Allow",
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: toggleNotifications,
        },
      ],
    );
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    // Validate new password
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    setIsPasswordUpdating(true)
    try {
      // Call the API to change password
      const resultAction = await dispatch(
        changePassword({ oldPassword, newPassword }),
      );

      if (changePassword.fulfilled.match(resultAction)) {
        // Reset fields and close modal
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);

        // Show success message
        Alert.alert("Success", "Password changed successfully");
      } else {
        // If change password failed, get the error message
        if (resultAction.payload) {
          setPasswordError(resultAction.payload as string);
        } else {
          setPasswordError("Failed to change password. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      setPasswordError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsPasswordUpdating(true)
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      Alert.alert("Error", "Please type DELETE to confirm account deletion");
      return;
    }

    try {
      // Delete user profile
      const resultAction = await dispatch(deleteUserProfile());

      if (deleteUserProfile.fulfilled.match(resultAction)) {
        // Logout after successful profile deletion
        await dispatch(logout());

        // Close modal
        setShowDeleteAccountModal(false);
        setDeleteConfirmText("");

        // Navigate to login screen
        setTimeout(() => {
          router.replace("/login");
        }, 100);
      } else {
        Alert.alert("Error", "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account");
    }
  };

  // const scheduleDailyReminder = async (notificationTime: any) => {
  //   if (userRole !== 'client' || !notificationTime) return;

  //   const [hour, minute] = notificationTime.split(":").map(Number);
  //   console.log(hour, minute)
  //   await Notifications.cancelAllScheduledNotificationsAsync();

  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "💪 Workout Reminder",
  //       body: "Don’t forget to complete your workout!",
  //     },
  //     trigger: {
  //       hour,
  //       minute,
  //       repeats: true, // daily reminder
  //     },
  //   });
  // };

  return (
    <ScrollView className="flex-1 bg-pink-50">
      <View className="bg-pink-800 pt-12 pb-6 px-4 items-center">
        <View className="relative">
          <View className="w-24 h-24 rounded-full bg-pink-200 overflow-hidden border-4 border-white">
            {isUploading ? (
              <View className="w-full h-full items-center justify-center bg-gray-100">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) : (
              // 'https://fitness.pixelgateltd.com/' + 
              <Image
                source={{
                  uri:
                    profileData.profilePicture ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
                }}
                className="w-full h-full"
              />
            )}
          </View>
          <View className="flex-row absolute bottom-0 right-0">
            <TouchableOpacity
              className="bg-pink-600 p-2 rounded-full"
              onPress={(event) => {
                setImageMenuAnchor(event.currentTarget);
                setShowImageOptions(true);
              }}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>

            <Popover
              isVisible={showImageOptions}
              onRequestClose={() => setShowImageOptions(false)}
              from={imageMenuAnchor}
              backgroundStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <View className="bg-white rounded-lg p-2 w-40">
                <TouchableOpacity
                  className="flex-row items-center p-3"
                  onPress={() => {
                    setShowImageOptions(false);
                    pickImage();
                  }}
                >
                  <Camera size={18} color="#be185d" />
                  <Text className="ml-2 text-gray-800">Upload Image</Text>
                </TouchableOpacity>

                {profileData.profilePicture && (
                  <TouchableOpacity
                    className="flex-row items-center p-3"
                    onPress={() => {
                      setShowImageOptions(false);
                      removeProfilePicture();
                    }}
                  >
                    <Trash2 size={18} color="#dc2626" />
                    <Text className="ml-2 text-gray-800">Remove Image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Popover>
          </View>
        </View>
        <Text className="text-2xl font-bold text-white mt-3">
          {profileData.name}
        </Text>
        <Text className="text-pink-200">{capitalizeFirstLetter(userRole)} Account</Text>
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">
            Profile Details
          </Text>
          {isEditing ? (
            <TouchableOpacity
              disabled={isProfileUpdating}
              onPress={saveProfileData}
              className={`bg-pink-600 px-3 py-2  rounded-lg flex-row items-center ${isProfileUpdating ? "opacity-70" : ""}`}
            // className={!isProfileUpdating ? `flex-row items-center bg-slate-500  px-3 py-2 rounded-lg` : `flex-row items-center bg-pink-600  px-3 py-2 rounded-lg`}

            >
              {
                isProfileUpdating ? <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-medium ml-2">
                    Saving...
                  </Text>
                </> : <>
                  <Save size={16} color="white" />
                  <Text className="text-white ml-1 font-medium">
                    Save
                  </Text>
                </>
              }

            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="flex-row items-center bg-pink-600 px-3 py-2 rounded-lg"
            >
              <Edit2 size={16} color="white" />
              <Text className="text-white ml-1 font-medium">Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="mb-4">
            <Text className="text-gray-500 mb-1">Full Name</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg p-2 text-gray-800"
                value={profileData.name}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, name: text })
                }
              />
            ) : (
              <Text className="text-gray-800 font-medium">
                {profileData.name}
              </Text>
            )}
          </View>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-500 mb-1">Age</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={profileData.age}
                  // keyboardType="numeric"
                  onChangeText={(text) => {
                    console.log('age', text)
                    setProfileData({ ...profileData, age: text })
                  }}
                />
              ) : (
                <Text className="text-gray-800 font-medium">
                  {profileData.age} years
                </Text>
              )}
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-500 mb-1">Height</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={profileData.height}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, height: text })
                  }
                />
              ) : (
                <Text className="text-gray-800 font-medium">
                  {profileData.height}
                </Text>
              )}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-500 mb-1">Current Weight</Text>
            {isEditing ? (
              <TextInput
                className="border border-gray-300 rounded-lg p-2 text-gray-800"
                value={profileData.weight}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setProfileData({ ...profileData, weight: text })
                }
              />
            ) : (
              <Text className="text-gray-800 font-medium">
                {profileData.weight} lbs
              </Text>
            )}
          </View>

          {userRole !== "trainer" && (
            <View className="mb-2">
              <Text className="text-gray-500 mb-1">Fitness Goal</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={profileData.goal}
                  multiline
                  numberOfLines={3}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, goal: text })
                  }
                />
              ) : (
                <Text className="text-gray-800 font-medium">
                  {profileData.goal}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Notification Settings - Only shown for clients */}
        {userRole !== "trainer" && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Bell size={20} color="#be185d" />
                <Text className="text-lg font-semibold text-pink-800 ml-2">
                  Notifications
                </Text>
              </View>
              <TouchableOpacity
                onPress={requestNotificationPermission}
                className={`w-12 h-6 rounded-full ${profileData.notificationsEnabled ? "bg-pink-600" : "bg-gray-300"} justify-center`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white shadow-sm ${profileData.notificationsEnabled ? "ml-7" : "ml-1"}`}
                />
              </TouchableOpacity>
            </View>

            {profileData.notificationsEnabled && (
              <View>
                <Text className="text-gray-500 mb-2">Daily Reminder Time</Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text className="text-gray-800">
                    {profileData.notificationTime}
                  </Text>
                  <Clock size={16} color="#9ca3af" />
                </TouchableOpacity>

                {showTimePicker && (
                  <Modal
                    transparent
                    animationType="fade"
                    visible={showTimePicker}
                    onRequestClose={() => setShowTimePicker(false)}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                      activeOpacity={1}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          padding: 16,
                          width: "83%",
                          maxWidth: 400,
                          elevation: 5,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#9d174d", textAlign: "center", marginBottom: 16 }}>
                          Select Time
                        </Text>

                        <DateTimePicker
                          testID="dateTimePicker"
                          value={(() => {
                            const now = new Date();
                            const [h, m] = profileData?.notificationTime?.split(":").map(Number) ?? [now.getHours(), now.getMinutes()];
                            now.setHours(h);
                            now.setMinutes(m);
                            now.setSeconds(0);
                            return now;
                          })()}
                          mode="time"
                          is24Hour={false}
                          display={Platform.OS === "ios" ? "spinner" : "clock"}
                          onChange={(event, selectedDate) => {
                            if (Platform.OS === "ios") {
                              if (selectedDate) {
                                const hours = selectedDate.getHours().toString().padStart(2, "0");
                                const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
                                setProfileData({
                                  ...profileData,
                                  notificationTime: `${hours}:${minutes}`,
                                });
                              }
                            } else {
                              if (event.type === "set" && selectedDate) {
                                const hours = selectedDate.getHours().toString().padStart(2, "0");
                                const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
                                setProfileData({
                                  ...profileData,
                                  notificationTime: `${hours}:${minutes}`,
                                });
                                setShowTimePicker(false);
                              } else if (event.type === "dismissed") {
                                setShowTimePicker(false);
                              }
                            }
                          }}
                        />

                        {Platform.OS === "ios" && (
                          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: "#db2777",
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 8,
                              }}
                              onPress={() => setShowTimePicker(false)}
                            >
                              <Text style={{ color: "white", fontWeight: "500" }}>Done</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Modal>
                )}

                <Text className="text-xs text-gray-500 mt-1">
                  You'll receive daily reminders for your workouts and meals
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Security Settings */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <Lock size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Security Settings
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() => setShowPasswordModal(true)}
          >
            <Text className="text-gray-800 font-medium">Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() => setShowDeleteAccountModal(true)}
          >
            <Text className="text-red-600 font-medium">Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={async () => {
              await dispatch(logout());
              router.replace("/login");
            }}
          >
            <View className="flex-row items-center">
              <LogOut size={18} color="#be185d" className="mr-2" />
              <Text className="text-pink-800 font-medium ml-1">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-5/6 rounded-xl p-6">
            <Text className="text-xl font-bold text-pink-800 mb-4">
              Change Password
            </Text>

            {passwordError ? (
              <View className="bg-red-100 p-2 rounded-lg mb-4">
                <Text className="text-red-600">{passwordError}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Current Password
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                placeholder="••••••••"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                New Password
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                placeholder="••••••••"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-1 font-medium">
                Confirm New Password
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => {
                  setShowPasswordModal(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                disabled={isPasswordUpdating}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-pink-600 py-2 px-4 rounded-lg flex-row items-center ${isPasswordUpdating ? "opacity-70" : ""}`}
                // className="bg-pink-600 py-2 px-4 rounded-lg"
                onPress={handleChangePassword}
                disabled={isPasswordUpdating}
              >
                {isPasswordUpdating && <ActivityIndicator size="small" color="white" />}

                <Text className="text-white font-medium"> {isPasswordUpdating ? "Updating..." : "Update Password"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteAccountModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeleteAccountModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-5/6 rounded-xl p-6">
            <View className="flex-row items-center mb-2">
              <AlertTriangle size={24} color="#dc2626" />
              <Text className="text-xl font-bold text-red-600 ml-2">
                Delete Account
              </Text>
            </View>

            <Text className="text-gray-700 mb-4">
              This action cannot be undone. All your data will be permanently
              deleted.
            </Text>

            <View className="bg-red-50 p-3 rounded-lg mb-4">
              <Text className="text-red-600 font-medium mb-2">
                To confirm, type "DELETE" below:
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-3 text-gray-800"
                value={deleteConfirmText}
                onChangeText={setDeleteConfirmText}
                autoCapitalize="characters"
              />
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText("");
                }}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded-lg"
                onPress={handleDeleteAccount}
              >
                <Text className="text-white font-medium">Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
