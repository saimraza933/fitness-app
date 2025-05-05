import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "./hooks/redux";

export default function HomeScreen() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only navigate if component is mounted
    if (isMounted) {
      // Use setTimeout to ensure navigation happens after layout is complete
      const timer = setTimeout(() => {
        if (isLoggedIn) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isMounted, router]);

  // This is just a loading screen while redirecting
  return (
    <View className="flex-1 bg-pink-50 justify-center items-center">
      <Text className="text-pink-800 text-lg">Loading...</Text>
    </View>
  );
}
