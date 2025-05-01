import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
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
      // Use setTimeout to ensure navigation happens after layout is complete
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isMounted, router]);

  const handleLogin = async (email: string, password: string) => {
    // Use the login function from AuthContext
    return await login(email, password);
  };

  const handleSignUp = () => {
    // In a real app, you would navigate to a sign-up screen
    console.log("Navigate to sign up");
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
    </SafeAreaView>
  );
}
