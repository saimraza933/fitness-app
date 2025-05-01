import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "./AuthContext";
import ClientHome from "./ClientHome";
import ProgressSection from "./ProgressSection";
import { Home, ChartLineUp, User, Calendar } from "lucide-react-native";
import MyPlan from "./MyPlan";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // Get auth context safely with a default value
  const auth = useAuth();
  const userRole = auth?.userRole;

  // Only show for clients
  if (userRole !== "client") {
    // Return empty view if not a client
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#be185d",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={ClientHome}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="My Plan"
        component={MyPlan}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressSection}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChartLineUp size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="relative">
              <User size={size} color={color} />
              <View className="absolute -right-1 -top-1 w-3 h-3 bg-pink-500 rounded-full border border-white" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
