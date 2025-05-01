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
} from "react-native";
import { Eye, EyeOff, ArrowRight } from "lucide-react-native";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignUp?: () => void;
}

const LoginForm = ({ onLogin, onSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-pink-50"
    >
      <View className="flex-1 p-6 justify-center">
        {/* Logo and Header */}
        <View className="items-center mb-10">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-20 h-20 mb-4"
          />
          <Text className="text-3xl font-bold text-pink-800">FitHer</Text>
          <Text className="text-gray-500 text-center mt-2">
            Your personal fitness journey starts here
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
          <Text className="text-gray-700 mb-2 font-medium">Email</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800"
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
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
          <TouchableOpacity className="self-end mt-2">
            <Text className="text-pink-600 font-medium">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-pink-600 py-4 rounded-xl items-center mb-4 flex-row justify-center ${isLoading ? "opacity-70" : ""}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg mr-2">
            {isLoading ? "Signing In..." : "Sign In"}
          </Text>
          {!isLoading && <ArrowRight size={20} color="white" />}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text className="text-pink-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Login Credentials Help */}
        <View className="mt-8 p-4 bg-gray-100 rounded-lg">
          <Text className="text-gray-600 text-center font-medium mb-2">
            Demo Credentials
          </Text>
          <Text className="text-gray-600 text-center">
            Client: client@example.com / client123
          </Text>
          <Text className="text-gray-600 text-center">
            Trainer: trainer@example.com / trainer123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
