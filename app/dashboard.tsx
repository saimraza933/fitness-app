import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./components/AuthContext";
import BottomTabNavigator from "./components/BottomTabNavigator";

export default function DashboardScreen() {
  const { isLoggedIn, userRole } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  console.log(
    "Dashboard screen - user role:",
    userRole,
    "isLoggedIn:",
    isLoggedIn,
  );

  // Force a re-render after component mounts to ensure we have the latest userRole
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRender((prev) => prev + 1);
      console.log("Forced re-render, current userRole:", userRole);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center">
        <Text className="text-pink-800 text-lg">Loading...</Text>
      </View>
    );
  }

  // Use BottomTabNavigator for both client and trainer roles
  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <BottomTabNavigator />
    </SafeAreaView>
  );
}

// Import ClientHome directly to avoid navigation issues
import ClientHome from "./components/ClientHome";
