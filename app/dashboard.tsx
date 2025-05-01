import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./components/AuthContext";
import TrainerDashboard from "./components/TrainerDashboard";
import { LogOut } from "lucide-react-native";
import MockBottomTabNavigator from "./components/MockBottomTabNavigator";

export default function DashboardScreen() {
  const { userRole, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only navigate if component is mounted and user is not logged in
    if (isMounted && !isLoggedIn) {
      // Use setTimeout to ensure navigation happens after layout is complete
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isMounted, router]);

  const handleLogout = async () => {
    await logout();
    // Use setTimeout to ensure navigation happens after state update
    setTimeout(() => {
      router.replace("/login");
    }, 100);
  };

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center">
        <Text className="text-pink-800 text-lg">Loading...</Text>
      </View>
    );
  }

  // For trainer role, show the original dashboard
  if (userRole === "trainer") {
    return (
      <SafeAreaView className="flex-1 bg-pink-50">
        {/* Header with logout button */}
        <View className="flex-row justify-between items-center p-4 bg-pink-800">
          <Text className="text-xl font-bold text-white">
            Trainer Dashboard
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-pink-700 px-3 py-2 rounded-lg"
          >
            <LogOut size={18} color="white" />
            <Text className="text-white ml-1 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <TrainerDashboard />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // For client role, show the mock bottom tab navigator instead of the real one
  // This avoids navigation container issues
  return (
    <ScrollView className="flex-1 bg-pink-50">
      <View className="flex-row justify-between items-center p-4 bg-pink-800">
        <Text className="text-xl font-bold text-white">Client Dashboard</Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-pink-700 px-3 py-2 rounded-lg"
        >
          <LogOut size={18} color="white" />
          <Text className="text-white ml-1 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <ClientHome />
      </ScrollView>
    </ScrollView>
  );
}

// Import ClientHome directly to avoid navigation issues
import ClientHome from "./components/ClientHome";
