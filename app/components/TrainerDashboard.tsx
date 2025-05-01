import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Search,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react-native";

interface Client {
  id: string;
  name: string;
  status: "active" | "pending" | "inactive";
  lastActive: string;
  progress: number;
  nextWorkout: string;
}

const TrainerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      status: "active",
      lastActive: "Today",
      progress: 85,
      nextWorkout: "Today",
    },
    {
      id: "2",
      name: "Emily Davis",
      status: "active",
      lastActive: "Yesterday",
      progress: 70,
      nextWorkout: "Tomorrow",
    },
    {
      id: "3",
      name: "Jessica Wilson",
      status: "pending",
      lastActive: "3 days ago",
      progress: 50,
      nextWorkout: "Today",
    },
    {
      id: "4",
      name: "Amanda Brown",
      status: "inactive",
      lastActive: "1 week ago",
      progress: 30,
      nextWorkout: "Not scheduled",
    },
    {
      id: "5",
      name: "Michelle Lee",
      status: "active",
      lastActive: "Today",
      progress: 90,
      nextWorkout: "Tomorrow",
    },
    {
      id: "6",
      name: "Rachel Taylor",
      status: "active",
      lastActive: "Today",
      progress: 75,
      nextWorkout: "Today",
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
            className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm flex-row justify-between items-center"
          >
            <View className="flex-1">
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

              <Text className="text-sm mt-2 text-pink-700">
                Next workout: {client.nextWorkout}
              </Text>
            </View>

            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Client Button */}
      <View className="p-4">
        <TouchableOpacity className="bg-pink-600 py-3 rounded-lg items-center">
          <Text className="text-white font-semibold">Add New Client</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrainerDashboard;
