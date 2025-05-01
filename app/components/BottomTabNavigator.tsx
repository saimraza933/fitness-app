import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";
import ClientHome from "./ClientHome";
import ProgressSection from "./ProgressSection";
import { Home, User, Calendar } from "lucide-react-native";
import { LineChart } from "lucide-react-native";
import MyPlan from "./MyPlan";
import ProfileScreen from "./ProfileScreen";

// Tab item component defined outside the main component
interface TabItemProps {
  name: string;
  icon: React.ReactNode;
  hasNotification?: boolean;
  isActive: boolean;
  onPress: () => void;
}

const TabItem = ({
  name,
  icon,
  hasNotification = false,
  isActive,
  onPress,
}: TabItemProps) => {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center"
      onPress={onPress}
    >
      <View className="relative">
        {icon}
        {hasNotification && (
          <View className="absolute -right-1 -top-1 w-3 h-3 bg-pink-500 rounded-full border border-white" />
        )}
      </View>
      <Text
        className={`text-xs mt-1 font-medium ${isActive ? "text-pink-700" : "text-gray-500"}`}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const BottomTabNavigator = () => {
  // Get auth context safely with a default value
  const auth = useAuth();
  const userRole = auth?.userRole;
  const [activeTab, setActiveTab] = useState("Home");

  // Only show for clients
  if (userRole !== "client") {
    // Return empty view if not a client
    return <View style={{ flex: 1 }} />;
  }

  // Render the active component based on the selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <ClientHome />;
      case "My Plan":
        return <MyPlan />;
      case "Progress":
        return <ProgressSection />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <ClientHome />;
    }
  };

  return (
    <View className="flex-1">
      {/* Content Area */}
      <View className="flex-1">{renderContent()}</View>

      {/* Bottom Tab Bar */}
      <View
        className="flex-row bg-white h-16 items-center border-t border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        }}
      >
        <TabItem
          name="Home"
          icon={
            <Home
              size={24}
              color={activeTab === "Home" ? "#be185d" : "#9ca3af"}
            />
          }
          isActive={activeTab === "Home"}
          onPress={() => setActiveTab("Home")}
        />
        <TabItem
          name="My Plan"
          icon={
            <Calendar
              size={24}
              color={activeTab === "My Plan" ? "#be185d" : "#9ca3af"}
            />
          }
          isActive={activeTab === "My Plan"}
          onPress={() => setActiveTab("My Plan")}
        />
        <TabItem
          name="Progress"
          icon={
            <LineChart
              size={24}
              color={activeTab === "Progress" ? "#be185d" : "#9ca3af"}
            />
          }
          isActive={activeTab === "Progress"}
          onPress={() => setActiveTab("Progress")}
        />
        <TabItem
          name="Profile"
          icon={
            <User
              size={24}
              color={activeTab === "Profile" ? "#be185d" : "#9ca3af"}
            />
          }
          hasNotification={true}
          isActive={activeTab === "Profile"}
          onPress={() => setActiveTab("Profile")}
        />
      </View>
    </View>
  );
};

export default BottomTabNavigator;
