import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import {
  ArrowLeft,
  User,
  ChevronDown,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Circle,
  Edit2,
  Save,
} from "lucide-react-native";

interface ClientDetailsProps {
  client?: {
    id: string;
    name: string;
    age: string;
    weight: string;
    height: string;
    goal: string;
    email: string;
    phone: string;
    joinDate: string;
    profilePicture?: string;
  };
  onBack: () => void;
}

const ClientDetails = ({ client, onBack }: ClientDetailsProps) => {
  const [selectedPlan, setSelectedPlan] = useState("Full Body Strength");
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [notes, setNotes] = useState(
    "Client is making good progress. Focus on improving squat form.",
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Mock data for the client if not provided
  const clientData = client || {
    id: "1",
    name: "Sarah Johnson",
    age: "28",
    weight: "145",
    height: "5'6\"",
    goal: "Lose 10 pounds and improve overall fitness",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    joinDate: "May 15, 2023",
    profilePicture:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf",
  };

  // Mock workout plans
  const workoutPlans = [
    "Full Body Strength",
    "Weight Loss Program",
    "Cardio Focus",
    "Muscle Building",
    "Flexibility & Toning",
  ];

  // Mock progress logs
  const progressLogs = [
    {
      date: "Jun 12, 2023",
      weight: "145 lbs",
      workoutsCompleted: "4/5",
      notes: "Completed all exercises except cardio",
    },
    {
      date: "Jun 5, 2023",
      weight: "146 lbs",
      workoutsCompleted: "5/5",
      notes: "Great week, hit all targets",
    },
    {
      date: "May 29, 2023",
      weight: "147 lbs",
      workoutsCompleted: "3/5",
      notes: "Missed two workouts due to travel",
    },
    {
      date: "May 22, 2023",
      weight: "148 lbs",
      workoutsCompleted: "4/5",
      notes: "Good progress on strength exercises",
    },
    {
      date: "May 15, 2023",
      weight: "150 lbs",
      workoutsCompleted: "5/5",
      notes: "First week completed successfully",
    },
  ];

  // Mock weekly goals
  const weeklyGoals = [
    { id: "1", title: "Workout 4 times", completed: true },
    { id: "2", title: "Track all meals", completed: true },
    { id: "3", title: "Drink 2L water daily", completed: false },
    { id: "4", title: "Sleep 7+ hours", completed: false },
  ];

  const toggleGoalCompletion = (id: string) => {
    // In a real app, this would update the state
    console.log(`Toggling goal completion for ${id}`);
  };

  const assignPlan = () => {
    // In a real app, this would save the selected plan to the backend
    console.log(`Assigning plan: ${selectedPlan}`);
    setShowPlanDropdown(false);
  };

  const saveNotes = () => {
    // In a real app, this would save the notes to the backend
    console.log(`Saving notes: ${notes}`);
    setIsEditingNotes(false);
  };

  return (
    <ScrollView className="flex-1 bg-pink-50">
      {/* Header */}
      <View className="bg-pink-800 pt-6 pb-4 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={onBack}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white ml-4">
            Client Details
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-pink-200 overflow-hidden border-2 border-white">
            <Image
              source={{ uri: clientData.profilePicture }}
              className="w-full h-full"
            />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-white">
              {clientData.name}
            </Text>
            <Text className="text-pink-200">
              Member since {clientData.joinDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Client Info */}
      <View className="p-4">
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <User size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Personal Information
            </Text>
          </View>

          <View className="flex-row mb-2">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Age</Text>
              <Text className="font-medium">{clientData.age} years</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Weight</Text>
              <Text className="font-medium">{clientData.weight} lbs</Text>
            </View>
          </View>

          <View className="flex-row mb-2">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Height</Text>
              <Text className="font-medium">{clientData.height}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="font-medium">{clientData.email}</Text>
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-gray-500 text-sm">Phone</Text>
            <Text className="font-medium">{clientData.phone}</Text>
          </View>

          <View>
            <Text className="text-gray-500 text-sm">Goal</Text>
            <Text className="font-medium">{clientData.goal}</Text>
          </View>
        </View>

        {/* Assign Plan */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-pink-800 mb-3">
            Assign Workout Plan
          </Text>

          <View className="relative">
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"
              onPress={() => setShowPlanDropdown(!showPlanDropdown)}
            >
              <Text className="text-gray-800">{selectedPlan}</Text>
              <ChevronDown size={20} color="#9ca3af" />
            </TouchableOpacity>

            {showPlanDropdown && (
              <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-md">
                {workoutPlans.map((plan) => (
                  <TouchableOpacity
                    key={plan}
                    className={`p-3 border-b border-gray-100 ${plan === selectedPlan ? "bg-pink-50" : ""}`}
                    onPress={() => {
                      setSelectedPlan(plan);
                      setShowPlanDropdown(false);
                    }}
                  >
                    <Text
                      className={`${plan === selectedPlan ? "text-pink-600 font-medium" : "text-gray-800"}`}
                    >
                      {plan}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            className="bg-pink-600 py-2 rounded-lg items-center mt-3"
            onPress={assignPlan}
          >
            <Text className="text-white font-medium">Assign Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Trainer Notes */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-pink-800">
              Trainer Notes
            </Text>
            {isEditingNotes ? (
              <TouchableOpacity
                onPress={saveNotes}
                className="flex-row items-center"
              >
                <Save size={18} color="#be185d" />
                <Text className="text-pink-600 font-medium ml-1">Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditingNotes(true)}
                className="flex-row items-center"
              >
                <Edit2 size={18} color="#be185d" />
                <Text className="text-pink-600 font-medium ml-1">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingNotes ? (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-800 min-h-[100px]"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          ) : (
            <Text className="text-gray-700">{notes}</Text>
          )}
        </View>

        {/* Weekly Goals */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Weekly Goals
            </Text>
          </View>

          {weeklyGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => toggleGoalCompletion(goal.id)}
            >
              <Text className="font-medium text-gray-800">{goal.title}</Text>
              {goal.completed ? (
                <CheckCircle size={24} color="#be185d" />
              ) : (
                <Circle size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Logs */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <TrendingUp size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Progress Logs
            </Text>
          </View>

          {progressLogs.map((log, index) => (
            <View
              key={index}
              className="py-3 border-b border-gray-100 last:border-b-0"
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-medium text-gray-800">{log.date}</Text>
                <View className="flex-row items-center">
                  <Clock size={14} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {log.workoutsCompleted} workouts
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-600">Weight: {log.weight}</Text>
              </View>
              <Text className="text-gray-600 text-sm">{log.notes}</Text>
            </View>
          ))}
        </View>

        {/* Message Client Button */}
        <TouchableOpacity className="bg-pink-600 py-3 rounded-lg items-center mb-8">
          <Text className="text-white font-semibold">Message Client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ClientDetails;
