import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, Text } from "react-native";
import SignupForm from "./components/SignupForm";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { signup } from "./store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, error } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only navigate if component is mounted and user is logged in
    if (isMounted && isLoggedIn) {
      // Use setTimeout to ensure navigation happens after layout is complete
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isMounted, router]);

  const handleSignup = async (userData: {
    email: string;
    password: string;
    role: "client" | "trainer";
    name: string;
    age: string;
    height: string;
    weight: string;
    goal: string;
  }) => {
    try {
      // Use the signup action from Redux
      const resultAction = await dispatch(signup(userData));

      if (signup.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Account created successfully!");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 800);
        return true;
      } else {
        // If signup failed, get the error message
        if (resultAction.payload) {
          Alert.alert("Signup Failed", resultAction.payload as string);
        } else {
          Alert.alert("Error", "Failed to create account. Please try again.");
        }
        return false;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again.",
      );
      return false;
    }
  };

  const navigateToLogin = () => {
    console.log("Navigating back to login screen");
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <Text className="p-4 text-pink-800 text-lg">Create your account</Text>
      <SignupForm onSignup={handleSignup} onLogin={navigateToLogin} />
    </SafeAreaView>
  );
}
