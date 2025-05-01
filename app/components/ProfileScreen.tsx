import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, Edit2, Save, Bell } from "lucide-react-native";

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  notificationsEnabled: boolean;
  notificationTime: string;
}

const ProfileScreen = () => {
  const { userRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Sarah Johnson",
    age: "28",
    weight: "145",
    height: "5'6\"",
    goal: "Lose 10 pounds and improve overall fitness",
    notificationsEnabled: true,
    notificationTime: "08:00",
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem("user_profile");
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem("user_profile", JSON.stringify(profileData));
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile data:", error);
      Alert.alert("Error", "Failed to save profile data");
    }
  };

  const toggleNotifications = () => {
    setProfileData({
      ...profileData,
      notificationsEnabled: !profileData.notificationsEnabled,
    });
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

  return (
    <ScrollView className="flex-1 bg-pink-50">
      <View className="bg-pink-800 pt-12 pb-6 px-4 items-center">
        <View className="relative">
          <View className="w-24 h-24 rounded-full bg-pink-200 overflow-hidden border-4 border-white">
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
              }}
              className="w-full h-full"
            />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full">
            <Camera size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-white mt-3">
          {profileData.name}
        </Text>
        <Text className="text-pink-200">{userRole} account</Text>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">
            Profile Details
          </Text>
          {isEditing ? (
            <TouchableOpacity
              onPress={saveProfileData}
              className="flex-row items-center bg-pink-600 px-3 py-2 rounded-lg"
            >
              <Save size={16} color="white" />
              <Text className="text-white ml-1 font-medium">Save</Text>
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
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, age: text })
                  }
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
        </View>

        {/* Notification Settings */}
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
              <TextInput
                className="border border-gray-300 rounded-lg p-2 text-gray-800"
                value={profileData.notificationTime}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, notificationTime: text })
                }
                placeholder="08:00"
              />
              <Text className="text-xs text-gray-500 mt-1">
                You'll receive daily reminders for your workouts and meals
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
