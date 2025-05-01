import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import {
  Search,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Scale,
  Dumbbell,
} from "lucide-react-native";

interface Client {
  id: string;
  name: string;
  status: "active" | "pending" | "inactive";
  lastActive: string;
  progress: number;
  nextWorkout: string;
  weight?: string;
  plan?: string;
  profilePicture?: string;
}

interface TrainerDashboardProps {
  onClientSelect?: (client: any) => void;
}

const TrainerDashboard = ({ onClientSelect }: TrainerDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      status: "active",
      lastActive: "Today",
      progress: 85,
      nextWorkout: "Today",
      weight: "145 lbs",
      plan: "Full Body Strength",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
    },
    {
      id: "2",
      name: "Emily Davis",
      status: "active",
      lastActive: "Yesterday",
      progress: 70,
      nextWorkout: "Tomorrow",
      weight: "132 lbs",
      plan: "Weight Loss Program",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
    },
    {
      id: "3",
      name: "Jessica Wilson",
      status: "pending",
      lastActive: "3 days ago",
      progress: 50,
      nextWorkout: "Today",
      weight: "158 lbs",
      plan: "Cardio Focus",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffdfbf",
    },
    {
      id: "4",
      name: "Amanda Brown",
      status: "inactive",
      lastActive: "1 week ago",
      progress: 30,
      nextWorkout: "Not scheduled",
      weight: "140 lbs",
      plan: "Not assigned",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&backgroundColor=ffdfbf",
    },
    {
      id: "5",
      name: "Michelle Lee",
      status: "active",
      lastActive: "Today",
      progress: 90,
      nextWorkout: "Tomorrow",
      weight: "125 lbs",
      plan: "Flexibility & Toning",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle&backgroundColor=ffdfbf",
    },
    {
      id: "6",
      name: "Rachel Taylor",
      status: "active",
      lastActive: "Today",
      progress: 75,
      nextWorkout: "Today",
      weight: "138 lbs",
      plan: "Muscle Building",
      profilePicture:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel&backgroundColor=ffdfbf",
    },
  ]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} color="#16a34a" />;
      case "pending":
        return <Clock size={16} color="#ca8a04" />;
      case "inactive":
        return <AlertCircle size={16} color="#dc2626" />;
      default:
        return null;
    }
  };

  const handleClientPress = (client: Client) => {
    if (onClientSelect) {
      // Add additional client details for the detail view
      const clientWithDetails = {
        ...client,
        age: "28",
        height: "5'6\"",
        goal: "Lose 10 pounds and improve overall fitness",
        email: `${client.name.toLowerCase().replace(" ", ".")}@example.com`,
        phone: "(555) 123-4567",
        joinDate: "May 15, 2023",
      };
      onClientSelect(clientWithDetails);
    }
  };

  return (
    <View className="flex-1 bg-pink-50">
      <View className="p-4 bg-pink-800">
        <Text className="text-2xl font-bold text-white mb-2">
          Trainer Dashboard
        </Text>
        <Text className="text-pink-200">
          Manage your clients and their progress
        </Text>
      </View>

      {/* Search Bar */}
      <View className="p-4">
        <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Client Stats */}
      <View className="flex-row justify-between px-4 mb-4">
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 mr-2 items-center">
          <Text className="text-gray-500 text-sm">Total Clients</Text>
          <Text className="text-2xl font-bold text-pink-800">
            {clients.length}
          </Text>
        </View>
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 mx-2 items-center">
          <Text className="text-gray-500 text-sm">Active</Text>
          <Text className="text-2xl font-bold text-green-600">
            {clients.filter((c) => c.status === "active").length}
          </Text>
        </View>
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 ml-2 items-center">
          <Text className="text-gray-500 text-sm">Inactive</Text>
          <Text className="text-2xl font-bold text-red-600">
            {clients.filter((c) => c.status === "inactive").length}
          </Text>
        </View>
      </View>

      {/* Client List */}
      <View className="px-4 mb-2">
        <View className="flex-row items-center">
          <Users size={20} color="#be185d" />
          <Text className="text-lg font-semibold text-pink-800 ml-2">
            Your Clients
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {filteredClients.map((client) => (
          <TouchableOpacity
            key={client.id}
            className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm"
            onPress={() => handleClientPress(client)}
          >
            <View className="flex-row">
              {/* Client Avatar */}
              <View className="mr-3">
                <View className="w-14 h-14 rounded-full overflow-hidden bg-pink-100">
                  {client.profilePicture && (
                    <Image
                      source={{ uri: client.profilePicture }}
                      className="w-full h-full"
                    />
                  )}
                </View>
              </View>

              {/* Client Info */}
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="font-semibold text-gray-800 text-lg">
                      {client.name}
                    </Text>
                    <View className="ml-2 flex-row items-center">
                      {getStatusIcon(client.status)}
                      <Text className="ml-1 text-xs text-gray-500">
                        {client.status}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>

                <Text className="text-gray-500 text-sm">
                  Last active: {client.lastActive}
                </Text>

                <View className="mt-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-500">Progress</Text>
                    <Text className="text-xs font-medium">
                      {client.progress}%
                    </Text>
                  </View>
                  <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <View
                      className="bg-pink-600 h-full rounded-full"
                      style={{ width: `${client.progress}%` }}
                    />
                  </View>
                </View>

                <View className="flex-row justify-between mt-3">
                  <View className="flex-row items-center">
                    <Scale size={14} color="#be185d" />
                    <Text className="text-sm ml-1 text-gray-700">
                      {client.weight}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Dumbbell size={14} color="#be185d" />
                    <Text className="text-sm ml-1 text-gray-700">
                      {client.plan}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add Client Button */}
        <TouchableOpacity className="bg-pink-600 mx-4 py-3 rounded-lg items-center mb-8">
          <Text className="text-white font-semibold">Add New Client</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TrainerDashboard;
