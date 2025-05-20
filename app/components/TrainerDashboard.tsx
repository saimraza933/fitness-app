import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import WorkoutPlanManager from "./WorkoutPlanManager";
import ExerciseManager from "./ExerciseManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Search,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Scale,
  Dumbbell,
  Barbell,
} from "lucide-react-native";
import { trainerApi } from "../services/api";
import { API_BASE_URL } from "../common";
import MealsManager from "./MealsManager";
import DietPlanManager from "./DietPlanManager";

interface Client {
  id: number | string;
  name: string;
  status: "active" | "pending" | "inactive";
  last_active?: string;
  lastActive?: string;
  progress: number;
  nextWorkout?: string;
  weight?: string;
  plan?: string;
  profile_picture?: string | null;
  profilePicture?: string;
}

interface TrainerDashboardProps {
  onClientSelect?: (client: any) => void;
}

const tabs = [
  { key: 'clients', label: 'Clients' },
  { key: 'workouts', label: 'Workout Plans' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'diet', label: 'Diet Plans' },
  { key: 'meal', label: 'Meal' },
] as const;

const TrainerDashboard = ({ onClientSelect }: TrainerDashboardProps) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [availableClients, setAvailableClients] = useState<
    { id: string | number; name: string }[]
  >([]);

  const [selectedClientId, setSelectedClientId] = useState<
    string | number | null
  >(null);
  const [isAssigning, setIsAssigning] = useState(false);
  type TabKey = (typeof tabs)[number]['key'];
  const [activeTab, setActiveTab] = React.useState<TabKey>('clients');

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch available clients when modal opens
  useEffect(() => {
    if (showAddClientModal) {
      fetchAvailableClients();
    }
  }, [showAddClientModal]);


  const fetchAvailableClients = async () => {
    try {
      setIsAssigning(false);
      setSelectedClientId(null);
      // Fetch all available clients that aren't already assigned to this trainer
      const response = await trainerApi.getNotAssignedClients();
      // If API call fails, use mock data
      if (!response || !Array.isArray(response)) {
        setAvailableClients(
          response.map((client: any) => ({
            id: client?.client?.profile?.id,
            name: client?.client?.profile?.name,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching available clients:", err);
      // Fallback to mock data
      setAvailableClients([
        { id: "101", name: "Emma Wilson" },
        { id: "102", name: "Olivia Martinez" },
        { id: "103", name: "Sophia Thompson" },
        { id: "104", name: "Isabella Garcia" },
        { id: "105", name: "Mia Rodriguez" },
      ]);
    }
  };

  const assignClient = async () => {

    if (!selectedClientId) {
      console.log("No client selected");
      Alert.alert("Error", "Please select a client to assign");
      return;
    }

    try {
      setIsAssigning(true);

      // Get the logged-in trainer's ID (in a real app, this would come from auth context/redux)
      const trainerId = (await AsyncStorage.getItem("user_id")) || "2"; // Default to "2" if not found

      // Call the API to create the relationship
      console.log("About to call API with:", {
        clientId: selectedClientId,
        trainerId,
        status: 'assigned'
      });
      const response = await trainerApi.assignClientToTrainer(
        selectedClientId,
        trainerId,
        'assigned'
      );

      // Close modal and refresh client list
      setShowAddClientModal(false);
      setSelectedClientId(null);
      Alert.alert("Success", "Client assigned successfully");
      fetchClients(); // Refresh the client list
    } catch (err) {
      console.error("Error assigning client:", err);
      Alert.alert("Error", "Failed to assign client. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const trainerId = await AsyncStorage.getItem('user_id');

      if (trainerId === null) {
        throw new Error('Trainer ID not found in storage');
      }

      const parsedTrainerId = parseInt(trainerId, 10);
      const clientsData = await trainerApi.getClientsByTrainer(parsedTrainerId);

      const formattedClients = clientsData?.map((client: any) => {
        const clientObj = client?.client

        const profilePicture = clientObj?.profile?.profile_picture_url ? `${API_BASE_URL}${clientObj?.profile?.profile_picture_url}` :
          `https://picsum.photos/id/${clientObj?.id}/200/200`
        return {
          id: clientObj?.id,
          name: clientObj?.profile?.name,
          status: client?.status || "active",
          lastActive: formatDate(clientObj?.last_login) || "Today",
          progress: client?.progress || 0,
          nextWorkout: "Today",
          weight: clientObj?.profile?.weight ? `${clientObj?.profile?.weight} lbs` : "Not recorded",
          plan: clientObj?.plan || "Not assigned",
          profilePicture: profilePicture,
        }
      })
      // console.log(formattedClients)
      setClients(formattedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
      // Fallback to mock data if API fails
      setClients([
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
    } finally {
      setLoading(false);
    }
  };

  // const formatDate = (dateString: string | undefined) => {
  //   if (!dateString) return "Unknown";

  //   try {
  //     const date = new Date(dateString);
  //     const now = new Date();

  //     // Check if date is today
  //     if (date.toDateString() === now.toDateString()) {
  //       return "Today";
  //     }

  //     // Check if date is yesterday
  //     const yesterday = new Date(now);
  //     yesterday.setDate(now.getDate() - 1);
  //     if (date.toDateString() === yesterday.toDateString()) {
  //       return "Yesterday";
  //     }

  //     // Check if date is within the last week
  //     const oneWeekAgo = new Date(now);
  //     oneWeekAgo.setDate(now.getDate() - 7);
  //     if (date > oneWeekAgo) {
  //       const daysAgo = Math.floor(
  //         (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  //       );
  //       return `${daysAgo} days ago`;
  //     }

  //     // Otherwise return formatted date
  //     return date.toLocaleDateString();
  //   } catch (e) {
  //     return "Unknown date";
  //   }
  // };

  const formatDate = (input: Date): string => {
    if (!input) return ""; // or return 'Invalid Date'

    const date: any = new Date(input);

    if (isNaN(date)) return "Invalid Date";
    return date?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredClients = clients?.filter((client) =>
    client?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
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

  const handleClientPress = async (client: Client) => {
    if (onClientSelect) {
      try {
        // Fetch detailed client information from API
        const clientDetails = await trainerApi.getClientDetails(client.id);

        // Transform API response to match expected format
        const clientWithDetails = {
          ...client,
          id: clientDetails?.id,
          name: clientDetails?.name,
          age: clientDetails?.age?.toString() || "Unknown",
          weight: clientDetails?.weight ? `${clientDetails?.weight}` : "Unknown",
          height: clientDetails?.height || "Unknown",
          goal: clientDetails?.goal || "No goal set",
          email:
            clientDetails?.email ||
            `${client?.name?.toLowerCase().replace(" ", ".")}@example.com`,
          phone: clientDetails?.phone || "Not provided",
          joinDate: formatDate(clientDetails?.join_date) || "Unknown",
          profilePicture:
            clientDetails?.profile_picture || client?.profilePicture,
          notes: clientDetails?.notes,
          assignedPlan: clientDetails?.assigned_plan,
        };

        onClientSelect(clientWithDetails);
      } catch (err) {
        console.error("Error fetching client details:", err);
        // Fallback to basic info if API call fails
        const clientWithDetails = {
          ...client,
          age: "Unknown",
          height: "Unknown",
          goal: "Unknown",
          email: `${client?.name?.toLowerCase().replace(" ", ".")}@example.com`,
          phone: "Not available",
          joinDate: "Unknown",
        };
        onClientSelect(clientWithDetails);
      }
    }
  };



  return (
    <View className="flex-1 bg-pink-50 ">
      <View className="p-4 bg-pink-800">
        <Text className="text-2xl font-bold text-white mb-2">
          Trainer Dashboard
        </Text>
        <Text className="text-pink-200">
          Manage your clients and workout plans
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 0,
            minHeight: 36,
          }}
          style={{ minHeight: 36 }}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 16,
                height: 36,
                justifyContent: 'center',
                borderBottomWidth: activeTab === tab.key ? 2 : 0,
                borderBottomColor: activeTab === tab.key ? '#db2777' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  color: activeTab === tab.key ? '#9d174d' : '#6b7280',
                  textAlign: 'center',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>




      {activeTab === "clients" ? (
        <>
          {loading && (
            <View className="absolute inset-0 items-center justify-center bg-black/20 z-10">
              <ActivityIndicator size="large" color="#be185d" />
            </View>
          )}

          {error && (
            <View className="m-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <Text className="text-red-700">{error}</Text>
              <TouchableOpacity
                className="mt-2 self-end"
                onPress={fetchClients}
              >
                <Text className="text-pink-700 font-medium">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

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
                {/* {clients.filter((c) => c.status === "inactive").length} */}
                {clients.filter((c) => c.status === "pending").length}
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
            {filteredClients.map((client, index) => (
              <TouchableOpacity
                key={index}
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

                    {/* <View className="mt-2">
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
                    </View> */}

                    <View className="flex-row justify-between mt-3">
                      <View className="flex-row items-center">
                        <Scale size={14} color="#be185d" />
                        <Text className="text-sm ml-1 text-gray-700">
                          {client.weight}
                        </Text>
                      </View>

                      {/* <View className="flex-row items-center">
                        <Dumbbell size={14} color="#be185d" />
                        <Text className="text-sm ml-1 text-gray-700">
                          {client.plan}
                        </Text>
                      </View> */}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Add Client Button */}
            <TouchableOpacity
              className="bg-pink-600 mx-4 py-3 rounded-lg items-center mb-8"
              onPress={() => setShowAddClientModal(true)}
            >
              <Text className="text-white font-semibold">Add New Client</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : activeTab === "workouts" ? (
        <WorkoutPlanManager />
      ) : activeTab === "exercises" ? (
        <ExerciseManager />
      ) : activeTab === "meal" ? (
        <MealsManager />
      ) : activeTab === "diet" ? (
        <DietPlanManager />
      ) : <Text >No tab content found</Text>
      }

      {/* Add Client Modal */}
      <Modal
        visible={showAddClientModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddClientModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-5/6 rounded-xl p-6">
            <Text className="text-xl font-bold text-pink-800 mb-4">
              Add New Client
            </Text>

            <Text className="text-gray-700 mb-2 font-medium">
              Select Client
            </Text>
            <View className="border border-gray-300 rounded-lg mb-4">
              {availableClients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  className={`p-3 border-b border-gray-100 ${client.id === selectedClientId ? "bg-pink-50" : ""}`}
                  onPress={() => setSelectedClientId(client.id)}
                >
                  <Text
                    className={`${client.id === selectedClientId ? "text-pink-600 font-medium" : "text-gray-800"}`}
                  >
                    {client.name}
                  </Text>
                </TouchableOpacity>
              ))}

              {availableClients.length === 0 && (
                <View className="p-3">
                  <Text className="text-gray-500 italic">
                    No available clients found
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => setShowAddClientModal(false)}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-pink-600 py-2 px-4 rounded-lg ${isAssigning ? "opacity-70" : ""}`}
                onPress={() => {
                  console.log("Assign Client button pressed");
                  console.log("Selected client ID:", selectedClientId);
                  assignClient();
                }}
                disabled={isAssigning || !selectedClientId}
              >
                {isAssigning ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-medium ml-2">
                      Assigning...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-medium">Assign Client</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TrainerDashboard;
