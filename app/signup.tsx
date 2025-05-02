import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, Text } from "react-native";
import SignupForm from "./components/SignupForm";
import { useRouter } from "expo-router";
import { useAuth } from "./components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  const { login, isLoggedIn } = useAuth();
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

  const handleSignup = async (
    email: string,
    password: string,
    role: "client" | "trainer",
  ) => {
    try {
      // In a real app, you would make an API call to create the user
      // For this demo, we'll simulate adding the user to our mock database
      // and then log them in

      // Get existing users from AuthContext
      const usersString = await AsyncStorage.getItem("mock_users");
      let users = usersString ? JSON.parse(usersString) : [];

      // Check if email already exists
      const emailExists = users.some(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
      if (emailExists) {
        Alert.alert("Error", "Email already in use");
        return false;
      }

      // Add new user
      const newUser = {
        email,
        password,
        role,
      };

      users.push(newUser);
      await AsyncStorage.setItem("mock_users", JSON.stringify(users));

      // Log in the user
      const success = await login(email, password);

      if (success) {
        Alert.alert("Success", "Account created successfully!");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 800);
      }

      return success;
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
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
