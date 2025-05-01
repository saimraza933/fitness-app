import React from "react";
import { View, Text } from "react-native";
import { Home, ChartLineUp, User, Calendar } from "lucide-react-native";

const MockBottomTabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fdf2f8" }}>
        <Text style={{ padding: 20, fontSize: 18, color: "#be185d" }}>
          Tab Content Area
        </Text>
      </View>

      {/* Mock Tab Bar */}
      <View
        style={{
          height: 60,
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Home size={24} color="#be185d" />
          <Text style={{ fontSize: 12, color: "#be185d", marginTop: 2 }}>
            Home
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Calendar size={24} color="#9ca3af" />
          <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            My Plan
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <ChartLineUp size={24} color="#9ca3af" />
          <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            Progress
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <View style={{ position: "relative" }}>
            <User size={24} color="#9ca3af" />
            <View
              style={{
                position: "absolute",
                right: -4,
                top: -4,
                width: 12,
                height: 12,
                backgroundColor: "#ec4899",
                borderRadius: 6,
                borderWidth: 1,
                borderColor: "white",
              }}
            />
          </View>
          <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MockBottomTabNavigator;
