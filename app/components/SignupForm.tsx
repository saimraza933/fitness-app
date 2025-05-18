import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Eye, EyeOff, ArrowRight, Dumbbell } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SignupFormProps {
  onSignup: (userData: {
    email: string;
    password: string;
    role: "client" | "trainer";
    name: string;
    age: string;
    height: string;
    weight: string;
    goal: string;
  }) => Promise<boolean>;
  onLogin?: () => void;
}

const SignupForm = ({ onSignup, onLogin }: SignupFormProps) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<"client" | "trainer">(
    "client",
  );

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const userData = {
        email,
        password,
        role: selectedRole,
        name,
        age: age || "25", // Default values if not provided
        height: height || "5'8\"",
        weight: weight || "150",
        goal:
          goal ||
          (selectedRole === "client"
            ? "Improve fitness"
            : "Help clients achieve their goals"),
      };

      const success = await onSignup(userData);
      if (!success) {
        setErrorMessage(
          "Failed to create account. Email may already be in use.",
        );
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during signup");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#9d174d" />
      <KeyboardAvoidingView
        style={{ marginTop: insets?.top }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-pink-50"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 p-6 justify-center">
            {/* Logo and Header */}
            <View className="items-center mb-10">
              <View className="bg-pink-100 p-5 rounded-full mb-4">
                <Dumbbell size={40} color="#be185d" />
              </View>
              <Text className="text-3xl font-bold text-pink-800">FitHer</Text>
              <Text className="text-gray-500 text-center mt-2">
                Create your account to start your fitness journey
              </Text>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View className="mb-4 p-3 bg-red-100 rounded-lg">
                <Text className="text-red-600 text-center">{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Full Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Email <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Password <Text className="text-red-500">*</Text>
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl p-4 pr-12 text-gray-800"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9ca3af" />
                  ) : (
                    <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Confirm Password <Text className="text-red-500">*</Text>
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl p-4 pr-12 text-gray-800"
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9ca3af" />
                  ) : (
                    <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Profile Fields */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Age</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                placeholder="25"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>

            <View className="flex-row mb-6">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-2 font-medium">Height</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                  placeholder="5'8&quot;"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-700 mb-2 font-medium">
                  Weight (lbs)
                </Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                  placeholder="150"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Fitness Goal</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
                placeholder={
                  selectedRole === "client"
                    ? "Improve fitness"
                    : "Help clients achieve their goals"
                }
                multiline
                numberOfLines={2}
                value={goal}
                onChangeText={setGoal}
              />
            </View>

            {/* Role Selection */}
            <View className="mb-8">
              <Text className="text-gray-700 mb-2 font-medium">
                I am a: <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl mr-2 ${selectedRole === "client" ? "bg-pink-600" : "bg-white border border-gray-200"}`}
                  onPress={() => setSelectedRole("client")}
                >
                  <Text
                    className={`text-center font-medium ${selectedRole === "client" ? "text-white" : "text-gray-800"}`}
                  >
                    Client
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-xl ml-2 ${selectedRole === "trainer" ? "bg-pink-600" : "bg-white border border-gray-200"}`}
                  onPress={() => setSelectedRole("trainer")}
                >
                  <Text
                    className={`text-center font-medium ${selectedRole === "trainer" ? "text-white" : "text-gray-800"}`}
                  >
                    Trainer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              className={`bg-pink-600 py-4 rounded-xl items-center mb-4 flex-row justify-center ${isLoading ? "opacity-70" : ""}`}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-lg mr-2">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
              {!isLoading && <ArrowRight size={20} color="white" />}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={onLogin} accessibilityRole="button">
                <Text className="text-pink-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignupForm;
