import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";
import ClientHome from "./ClientHome";
import ProgressSection from "./ProgressSection";
import { Home, User, Calendar, Users } from "lucide-react-native";
import { LineChart } from "lucide-react-native";
import MyPlan from "./MyPlan";
import ProfileScreen from "./ProfileScreen";
import TrainerDashboard from "./TrainerDashboard";
import ClientDetails from "./ClientDetails";

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
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProgressClient, setSelectedProgressClient] = useState(null);
  const [localUserRole, setLocalUserRole] = useState<string | null>(null);

  // Use effect to capture the userRole when it changes
  useEffect(() => {
    if (userRole) {
      console.log("BottomTabNavigator: userRole changed to", userRole);
      setLocalUserRole(userRole);
    }
  }, [userRole]);

  console.log(
    "Current user role:",
    userRole,
    "Local user role:",
    localUserRole,
  ); // Debug log

  // Render the active component based on the selected tab and user role
  const renderContent = () => {
    // Use localUserRole if available, otherwise fall back to userRole from context
    const effectiveRole = localUserRole || userRole;

    console.log(
      "Rendering content for role:",
      effectiveRole,
      "active tab:",
      activeTab,
    );

    // For client role
    if (effectiveRole === "client") {
      switch (activeTab) {
        case "Home":
          return <ClientHome />;
        case "My Plan":
          return <MyPlan />;
        case "Progress":
          return (
            <ProgressSection
              onClientSelect={setSelectedProgressClient}
              selectedClient={selectedProgressClient}
            />
          );
        case "Profile":
          return <ProfileScreen />;
        default:
          return <ClientHome />;
      }
    }
    // For trainer role
    else if (effectiveRole === "trainer") {
      console.log("Rendering trainer interface");

      if (selectedClient) {
        return (
          <ClientDetails
            client={selectedClient}
            onBack={() => setSelectedClient(null)}
          />
        );
      }

      switch (activeTab) {
        case "Home":
          return <TrainerDashboard onClientSelect={setSelectedClient} />;
        case "Progress":
          return (
            <ProgressSection
              onClientSelect={setSelectedProgressClient}
              selectedClient={selectedProgressClient}
            />
          );
        case "Profile":
          return <ProfileScreen />;
        default:
          return <TrainerDashboard onClientSelect={setSelectedClient} />;
      }
    }

    // If we're still here and no role is detected, force trainer view for testing
    console.log("No user role detected, forcing trainer view");
    return <TrainerDashboard onClientSelect={setSelectedClient} />;
  };

  // Get tab configuration based on user role
  const getTabConfig = () => {
    // Use localUserRole if available, otherwise fall back to userRole from context
    const effectiveRole = localUserRole || userRole;

    console.log("Getting tab config for role:", effectiveRole);

    const commonTabs = [
      {
        name: "Progress",
        icon: (
          <LineChart
            size={24}
            color={activeTab === "Progress" ? "#be185d" : "#9ca3af"}
          />
        ),
        isActive: activeTab === "Progress",
      },
      {
        name: "Profile",
        icon: (
          <User
            size={24}
            color={activeTab === "Profile" ? "#be185d" : "#9ca3af"}
          />
        ),
        hasNotification: true,
        isActive: activeTab === "Profile",
      },
    ];

    if (effectiveRole === "client") {
      return [
        {
          name: "Home",
          icon: (
            <Home
              size={24}
              color={activeTab === "Home" ? "#be185d" : "#9ca3af"}
            />
          ),
          isActive: activeTab === "Home",
        },
        {
          name: "My Plan",
          icon: (
            <Calendar
              size={24}
              color={activeTab === "My Plan" ? "#be185d" : "#9ca3af"}
            />
          ),
          isActive: activeTab === "My Plan",
        },
        ...commonTabs,
      ];
    } else if (effectiveRole === "trainer") {
      return [
        {
          name: "Clients",
          icon: (
            <Users
              size={24}
              color={activeTab === "Home" ? "#be185d" : "#9ca3af"}
            />
          ),
          isActive: activeTab === "Home",
        },
        ...commonTabs,
      ];
    }

    // If no role is detected, default to trainer tabs for testing
    console.log("No role detected, defaulting to trainer tabs");
    return [
      {
        name: "Clients",
        icon: (
          <Users
            size={24}
            color={activeTab === "Home" ? "#be185d" : "#9ca3af"}
          />
        ),
        isActive: activeTab === "Home",
      },
      ...commonTabs,
    ];
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
        {getTabConfig().map((tab, index) => (
          <TabItem
            key={index}
            name={tab.name}
            icon={tab.icon}
            hasNotification={tab.hasNotification}
            isActive={tab.isActive}
            onPress={() =>
              setActiveTab(tab.name === "Clients" ? "Home" : tab.name)
            }
          />
        ))}
      </View>
    </View>
  );
};

export default BottomTabNavigator;
