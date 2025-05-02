import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import LoginForm from "./components/LoginForm";
import { useRouter } from "expo-router";
import { useAuth } from "./components/AuthContext";

export default function LoginScreen() {
  const { login, isLoggedIn, userRole } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only navigate if component is mounted and user is logged in
    if (isMounted && isLoggedIn) {
      console.log(
        "Login screen detected logged in state, navigating to dashboard with role:",
        userRole,
      );
      // Use setTimeout to ensure navigation happens after layout is complete
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 500); // Increased timeout for state to fully update
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isMounted, router, userRole]);

  const handleLogin = async (email: string, password: string) => {
    try {
      // Use the login function from AuthContext
      const success = await login(email, password);

      if (success) {
        console.log("Login successful in LoginScreen, role:", userRole);
        // Manual navigation after successful login
        setTimeout(() => {
          router.replace("/dashboard");
        }, 800);
      }

      return success;
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to log in. Please try again.");
      return false;
    }
  };

  const handleSignUp = () => {
    console.log("Navigating to signup screen");
    // Use replace instead of push to avoid navigation stack issues
    router.replace("/signup");
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
    </SafeAreaView>
  );
}
