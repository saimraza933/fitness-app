import React, { useState, useEffect } from "react";
import Svg, { Line, Path, Circle } from 'react-native-svg';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Circle as IconCircle,
  ChevronDown,
  ChevronUp,
  Users,
  User,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "./AuthContext";
import { useAppSelector } from "../hooks/redux";
import { trainerApi } from "../services/api";
import ClientProgressSection from "./ClientProgressSection";
import { ActivityIndicator } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface Client {
  id: string;
  name: string;
  weight: string;
  progress: number;
  lastActive: string;
  profilePicture?: string;
  weightHistory?: { date: string; weight: number }[];
  workoutHistory?: { month: string; completed: number; total: number }[];
  nutritionHistory?: { month: string; adherence: number }[];
}

const mockClientData = [
  {
    id: "1",
    name: "Sarah Johnson",
    weight: "145 lbs",
    progress: 85,
    lastActive: "Today",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
    weightHistory: [
      { date: "Jan 1", weight: 150 },
      { date: "Feb 1", weight: 148 },
      { date: "Mar 1", weight: 146 },
      { date: "Apr 1", weight: 145 },
      { date: "May 1", weight: 144 },
      { date: "Jun 1", weight: 143 },
    ],
    workoutHistory: [
      { month: "January", completed: 18, total: 20 },
      { month: "February", completed: 16, total: 20 },
      { month: "March", completed: 19, total: 20 },
      { month: "April", completed: 20, total: 20 },
      { month: "May", completed: 18, total: 20 },
      { month: "June", completed: 10, total: 12 },
    ],
    nutritionHistory: [
      { month: "January", adherence: 80 },
      { month: "February", adherence: 85 },
      { month: "March", adherence: 90 },
      { month: "April", adherence: 88 },
      { month: "May", adherence: 92 },
      { month: "June", adherence: 95 },
    ],
  },
  {
    id: "2",
    name: "Emily Davis",
    weight: "132 lbs",
    progress: 70,
    lastActive: "Yesterday",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
    weightHistory: [
      { date: "Jan 1", weight: 138 },
      { date: "Feb 1", weight: 136 },
      { date: "Mar 1", weight: 135 },
      { date: "Apr 1", weight: 134 },
      { date: "May 1", weight: 133 },
      { date: "Jun 1", weight: 132 },
    ],
  },
  {
    id: "3",
    name: "Jessica Wilson",
    weight: "158 lbs",
    progress: 50,
    lastActive: "3 days ago",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffdfbf",
  },
  {
    id: "4",
    name: "Michelle Lee",
    weight: "125 lbs",
    progress: 90,
    lastActive: "Today",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle&backgroundColor=ffdfbf",
  },
  {
    id: "5",
    name: "Rachel Taylor",
    weight: "138 lbs",
    progress: 75,
    lastActive: "Today",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel&backgroundColor=ffdfbf",
  },
]

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


const ProgressSection = () => {
  const { userId } = useAppSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const clientsData = await trainerApi.getClientsByTrainer(Number(userId));
      const formattedClients = clientsData?.map((client: any) => {
        const clientObj = client?.client
        return {
          id: clientObj?.id,
          name: clientObj?.profile?.name,
          status: client?.status || "active",
          lastActive: formatDate(clientObj?.last_login) || "Today",
          progress: client?.progress || 0,
          nextWorkout: "Today",
          weight: clientObj?.profile?.weight ? `${clientObj?.profile?.weight} lbs` : "Not recorded",
          plan: clientObj?.plan || "Not assigned",
          profilePicture:
            clientObj?.profile?.profile_picture_url ||
            `https://picsum.photos/id/${clientObj?.id}/200/200`
          // `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientObj?.profile?.name}&backgroundColor=ffdfbf`,
        }
      })
      setClients(formattedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
      // setClients(mockClientData)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {
        !!selectedClient ? (
          <ClientProgressSection selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
        ) : (
          <ScrollView className="flex-1 bg-pink-50">
            <View className="p-4">
              <Text className="text-2xl font-bold text-pink-800 mb-6">
                Client Progress
              </Text>

              {isLoading ?
                <View style={{ minHeight: 400 }} className=" items-center mt-10 justify-center ">
                  <ActivityIndicator size="large" color="#be185d" />
                </View> :
                clients?.length > 0 ? clients.map((client: any) => (
                  <TouchableOpacity
                    key={client.id}
                    className="bg-white mb-4 p-4 rounded-xl shadow-sm"
                    onPress={() => setSelectedClient(client)}
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 rounded-full bg-pink-100 overflow-hidden mr-3">
                        {client.profilePicture && (
                          <Image
                            source={{ uri: client.profilePicture }}
                            className="w-full h-full"
                          />
                        )}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row justify-between items-center">
                          <Text className="font-semibold text-gray-800 text-lg">
                            {client.name}
                          </Text>
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

                        <View className="flex-row justify-between mt-2">
                          <Text className="text-sm text-pink-700">
                            Current weight: {parseFloat(client.weight)} lbs
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )) : (
                  <View style={{ minHeight: 400 }} className=" items-center mt-10 justify-center">
                    <Text className="text-center text-xl">No clients found</Text>
                  </View>
                )
              }
            </View>
          </ScrollView >
        )
      }
    </>
  );
};

export default ProgressSection;
