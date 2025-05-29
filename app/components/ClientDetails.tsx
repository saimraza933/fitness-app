import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  CalendarDays,
  X,
} from "lucide-react-native";
import { trainerApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../hooks/redux";

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

// Mock weekly goals
const weeklyGoals = [
  { id: "1", title: "Workout 4 times", completed: true },
  { id: "2", title: "Track all meals", completed: true },
  { id: "3", title: "Drink 2L water daily", completed: false },
  { id: "4", title: "Sleep 7+ hours", completed: false },
];

const mockPlans = [
  {
    "id": 1,
    "name": "High-Protein Power",
    "description": "Boost muscle recovery",
    "totalCalories": 2200,
    "proteinPercentage": 40.00,
    "carbsPercentage": 30.00,
    "fatPercentage": 30.00,
  }
]
// Mock progress logs
const progressLogs = [
  {
    date: "2025-05-03T04:00:00.000Z",
    weight: "145 lbs",
    workoutsCompleted: "4/5",
    notes: "Completed all exercises except cardio",
  },
  {
    date: "2025-06-03T04:00:00.000Z",
    weight: "146 lbs",
    workoutsCompleted: "5/5",
    notes: "Great week, hit all targets",
  },
  {
    date: "2025-07-03T04:00:00.000Z",
    weight: "147 lbs",
    workoutsCompleted: "3/5",
    notes: "Missed two workouts due to travel",
  },
  {
    date: "2025-08-03T04:00:00.000Z",
    weight: "148 lbs",
    workoutsCompleted: "4/5",
    notes: "Good progress on strength exercises",
  },
  {
    date: "2025-09-03T04:00:00.000Z",
    weight: "150 lbs",
    workoutsCompleted: "5/5",
    notes: "First week completed successfully",
  },
];

const ClientDetails = ({ client, onBack }: ClientDetailsProps) => {
  const { userId } = useAppSelector(state => state.auth)
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | number | null>(
    null,
  );
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [workoutPlans, setWorkoutPlans] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [notes, setNotes] = useState(
    "Client is making good progress. Focus on improving squat form.",
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Date picker states
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const [showGoalDatePicker, setShowGoalDatePicker] = useState(false)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalStartDate, setGoalStartDate] = useState<Date>(new Date());
  const [isAssigningGoal, setIsAssigningGoal] = useState(false)
  const [goalsList, setGoalsList] = useState<any>([])
  const [clientWeightsLogs, setClientWeightsLogs] = useState<any>([])
  const [dietPlansList, setDietPlansList] = useState<any>([])
  const [loading, setLoading] = useState(false);
  const [showDietPlanDatePicker, setShowDietPlanDatePicker] = useState(false)
  const [selectedDietPlan, setSelectedDietPlan] = useState(null)
  const [dietPlanScheduledDate, setDietPlanScheduledDate] = useState(new Date())
  const [showDietDropdown, setShowDietDropdown] = useState(false)
  const [isAssigningDiet, setIsAssigningDiet] = useState(false)
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

  // Fetch workout plans
  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchWorkoutPlans(),
        fetchWeeklyGoals(),
        fetchClientWeightLogs(),
        fetchDietPlans()
      ])
    })()

  }, [client]);

  const fetchWeeklyGoals = async () => {
    try {
      const goals = await trainerApi.getClientsWeeklyGoals(Number(client?.id));
      setGoalsList(goals)
    } catch (error) {
      setGoalsList(weeklyGoals)
    }
  };

  const fetchClientWeightLogs = async () => {
    try {
      const weightDetails = await trainerApi.getClientsWeightsLogs(Number(client?.id));
      console.log(weightDetails)
      setClientWeightsLogs(weightDetails)
    } catch (error) {
      setClientWeightsLogs(progressLogs)
    }
  };

  const fetchWorkoutPlans = async () => {
    try {
      setLoadingPlans(true);
      const data = await trainerApi.getWorkoutPlansByTrainer(Number(userId));
      setWorkoutPlans(data)
    } catch (error) {
      console.error("Error fetching workout plans:", error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      const res = await trainerApi.getTrainerDietPlans(Number(userId))
      if (Array.isArray(res)) {
        setDietPlansList(res)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  const toggleGoalCompletion = (id: string) => {
    // In a real app, this would update the state
    console.log(`Toggling goal completion for ${id}`);
  };

  // Format date for display
  const formatDate = (input: Date): string => {
    if (!input) return ""; // or return 'Invalid Date'

    const date = new Date(input);

    if (isNaN(date)) return "Invalid Date";
    return date?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateForWeightLogs = (input: Date): string => {
    if (!input) return ""; // or return 'Invalid Date'

    const date = new Date(input);

    if (isNaN(date)) return "Invalid Date";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduledDate;
    setShowDatePicker(Platform.OS === "ios");
    setScheduledDate(currentDate);
  };

  const onDietPlanDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dietPlanScheduledDate;
    setShowDietPlanDatePicker(Platform.OS === "ios");
    setDietPlanScheduledDate(currentDate);
  };

  const onGoalStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || goalStartDate;
    setShowGoalDatePicker(Platform.OS === "ios");
    setGoalStartDate(currentDate);
  };

  // Format date for API
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const assignPlan = async () => {
    try {
      if (!selectedPlanId) {
        Alert.alert("Error", "Please select a workout plan first.");
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        Alert.alert("Error", "Please select a date today or in the future.");
        return;
      }

      setIsAssigning(true);
      const formattedDate = formatDateForApi(scheduledDate);

      try {
        const response = await trainerApi.assignClientWorkout(
          clientData.id,
          selectedPlanId,
          formattedDate,
          Number(userId)
        );

        console.log("Assignment successful:", response);

        setShowPlanDropdown(false);
        Alert.alert(
          "Success",
          `${selectedPlan} has been scheduled for ${clientData.name} on ${formatDate(scheduledDate)}`,
        );
      } catch (apiError) {
        Alert.alert(
          "Error",
          "Failed to assign workout plan. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to assign workout plan. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const assignDietPlan = async () => {
    try {
      if (!selectedDietPlan) {
        Alert.alert("Error", "Please select a diet plan first.");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dietPlanScheduledDate < today) {
        Alert.alert("Error", "Please select a date today or in the future.");
        return;
      }

      setIsAssigningDiet(true);
      const formattedDate = formatDateForApi(dietPlanScheduledDate);
      try {
        const data = {
          dietPlanId: selectedDietPlan?.id,
          scheduledDate: formattedDate,
          assignedBy: Number(userId)
        }

        await trainerApi.assignDietPlanToClient(Number(client?.id), data)
        setShowDietDropdown(false);
        setSelectedDietPlan(null)
        setDietPlanScheduledDate(new Date())
        Alert.alert(
          "Success",
          `${selectedDietPlan?.name} has been scheduled for ${client?.name} on ${formatDate(dietPlanScheduledDate)}`,
        );
      } catch (apiError) {
        Alert.alert(
          "Error",
          "Failed to assign Diet plan. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to assign diet plan. Please try again.");
    } finally {
      setIsAssigningDiet(false);
    }
  }

  const handleAssignGoal = async () => {
    if (!goalTitle?.trim()) {
      Alert.alert("Error", "Please select a Goal Name.");
      return;
    }
    if (!goalStartDate) {
      Alert.alert("Error", "Please select a Goal Start Date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (goalStartDate < today) {
      Alert.alert("Error", "Please select a date today or in the future.");
      return;
    }
    const formattedDate = formatDateForApi(goalStartDate);
    const trainerId = await AsyncStorage.getItem('user_id');

    if (trainerId === null) {
      throw new Error('Trainer ID not found in storage');
    }
    const parsedTrainerId = parseInt(trainerId, 10);

    try {
      setIsAssigningGoal(true);
      const response = await trainerApi.assignClientWeeklyGoal(
        Number(clientData.id),
        parsedTrainerId,
        goalTitle,
        formattedDate
      );
      console.log(response)
      setGoalTitle('')
      setGoalStartDate(new Date())
      setShowGoalModal(false)
      Alert.alert(
        "Success",
        `${goalTitle} has been assigned to ${clientData?.name} on ${formatDate(goalStartDate)}.`
      );
      fetchWeeklyGoals()
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to assign weekly goal. Please try again.",
      );
    } finally {
      setIsAssigningGoal(false);
    }

  }

  const saveNotes = async () => {
    try {
      // Show loading indicator or disable the button here if needed
      console.log(`Saving notes: ${notes} for client ID: ${clientData.id}`);

      // Call the API to update client notes
      await trainerApi.updateClientNotes(clientData.id, notes);

      // Update successful
      setIsEditingNotes(false);
      Alert.alert("Success", "Client notes updated successfully");
    } catch (error) {
      console.error("Error saving notes:", error);
      Alert.alert("Error", "Failed to update client notes. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-pink-50">
      <ScrollView className="flex-1">
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

          {/* Assign workout Plan */}
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-lg font-semibold text-pink-800 mb-3">
              Assign Workout Plan
            </Text>

            <View>
              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white mb-3"
                onPress={(event) => {
                  const target = event.target as any;
                  target.measure((x, y, width, height, pageX, pageY) => {
                    setDropdownPosition({
                      top: pageY + height,
                      left: pageX,
                      width: width,
                    });
                    setShowPlanDropdown(true);
                  });
                }}
              >
                <Text className="text-gray-800">
                  {loadingPlans
                    ? "Loading plans..."
                    : selectedPlan || "Select a workout plan"}
                </Text>
                <ChevronDown size={20} color="#9ca3af" />
              </TouchableOpacity>

              {/* Schedule Date Selector */}
              <View className="mb-3">
                <Text className="text-gray-700 mb-2 font-medium">
                  Schedule Date
                </Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-800">
                    {formatDate(scheduledDate)}
                  </Text>
                  <CalendarDays size={20} color="#9ca3af" />
                </TouchableOpacity>

                {showDatePicker && (
                  <View className="bg-white p-2 rounded-lg mt-2">
                    <DateTimePicker
                      value={scheduledDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={onDateChange}
                      minimumDate={new Date()}
                    />
                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        className="bg-pink-600 py-2 px-4 rounded-lg self-end mt-2"
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text className="text-white font-medium">Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <Modal
                visible={showPlanDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPlanDropdown(false)}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={() => setShowPlanDropdown(false)}
                >
                  <View
                    className="bg-white border border-gray-300 rounded-lg shadow-md"
                    style={{
                      position: "absolute",
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                      zIndex: 9999,
                      elevation: 5,
                    }}
                  >
                    {loadingPlans ? (
                      <View className="p-3 items-center">
                        <ActivityIndicator size="small" color="#be185d" />
                        <Text className="text-gray-500 mt-1">
                          Loading plans...
                        </Text>
                      </View>
                    ) : (
                      workoutPlans.map((plan) => (
                        <TouchableOpacity
                          key={plan.id}
                          className={`p-3 border-b border-gray-100 ${plan.name === selectedPlan ? "bg-pink-50" : ""}`}
                          onPress={() => {
                            setSelectedPlan(plan.name);
                            setSelectedPlanId(plan.id);
                            setShowPlanDropdown(false);
                          }}
                        >
                          <Text
                            className={`${plan.name === selectedPlan ? "text-pink-600 font-medium" : "text-gray-800"}`}
                          >
                            {plan.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            <TouchableOpacity
              className={`bg-pink-600 py-2 rounded-lg items-center mt-3 ${!selectedPlan || loadingPlans || isAssigning ? "opacity-50" : ""}`}
              onPress={assignPlan}
              disabled={!selectedPlan || loadingPlans || isAssigning}
            >
              <Text className="text-white font-medium">
                {loadingPlans
                  ? "Loading..."
                  : isAssigning
                    ? "Assigning..."
                    : "Assign Workout"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Assign Diet Plan */}
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-lg font-semibold text-pink-800 mb-3">
              Assign Diet Plan
            </Text>

            <View>
              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white mb-3"
                onPress={(event) => {
                  const target = event.target as any;
                  target.measure((x, y, width, height, pageX, pageY) => {
                    setDropdownPosition({
                      top: pageY + height,
                      left: pageX,
                      width: width,
                    });
                    setShowDietDropdown(true);
                  });
                }}
              >
                <Text className="text-gray-800">
                  {loading
                    ? "Loading diet plans..."
                    : selectedDietPlan?.name || "Select a diet plan"}
                </Text>
                <ChevronDown size={20} color="#9ca3af" />
              </TouchableOpacity>

              {/* Schedule Date Selector */}
              <View className="mb-3">
                <Text className="text-gray-700 mb-2 font-medium">
                  Schedule Date
                </Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"
                  onPress={() => setShowDietPlanDatePicker(true)}
                >
                  <Text className="text-gray-800">
                    {formatDate(dietPlanScheduledDate)}
                  </Text>
                  <CalendarDays size={20} color="#9ca3af" />
                </TouchableOpacity>

                {showDietPlanDatePicker && (
                  <View className="bg-white p-2 rounded-lg mt-2">
                    <DateTimePicker
                      value={dietPlanScheduledDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={onDietPlanDateChange}
                      minimumDate={new Date()}
                    />
                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        className="bg-pink-600 py-2 px-4 rounded-lg self-end mt-2"
                        onPress={() => setShowDietPlanDatePicker(false)}
                      >
                        <Text className="text-white font-medium">Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <Modal
                visible={showDietDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDietDropdown(false)}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={() => setShowDietDropdown(false)}
                >
                  <View
                    className="bg-white border border-gray-300 rounded-lg shadow-md"
                    style={{
                      position: "absolute",
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                      zIndex: 9999,
                      elevation: 5,
                    }}
                  >
                    {loading ? (
                      <View className="p-3 items-center">
                        <ActivityIndicator size="small" color="#be185d" />
                        <Text className="text-gray-500 mt-1">
                          Loading plans...
                        </Text>
                      </View>
                    ) : (
                      dietPlansList.map((plan: any) => (
                        <TouchableOpacity
                          key={plan.id}
                          className={`p-3 border-b border-gray-100 ${plan.id === selectedDietPlan?.id ? "bg-pink-50" : ""}`}
                          onPress={() => {
                            setSelectedDietPlan(plan);
                            setShowDietDropdown(false);
                          }}
                        >
                          <Text
                            className={`${plan.id === selectedDietPlan?.id ? "text-pink-600 font-medium" : "text-gray-800"}`}
                          >
                            {plan.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            <TouchableOpacity
              className={`bg-pink-600 py-2 rounded-lg items-center mt-3 ${!selectedDietPlan?.id || loading || isAssigningDiet ? "opacity-50" : ""}`}
              onPress={assignDietPlan}
              disabled={!selectedDietPlan?.id || isAssigningDiet}
            >
              <Text className="text-white font-medium">
                {loading
                  ? "Loading..."
                  : isAssigningDiet
                    ? "Assigning..."
                    : "Assign Diet"}
              </Text>
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

            <View className="flex flex-row items-center justify-between">
              <View className="flex-row items-center mb-4">
                <Calendar size={20} color="#be185d" />
                <Text className="text-lg font-semibold text-pink-800 ml-2">
                  Weekly Goals
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowGoalModal(true)}
                className="flex-row items-center"
              >
                <Save size={18} color="#be185d" />
                <Text className="text-pink-600 font-medium ml-1">Add Goal</Text>
              </TouchableOpacity>
            </View>

            {goalsList?.map((goal) => (
              <View
                key={goal.id}
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              // onPress={() => toggleGoalCompletion(goal.id)}
              >
                <Text className="font-medium text-gray-800">{goal.title}</Text>
                {goal.completed ? (
                  <CheckCircle size={24} color="#be185d" />
                ) : (
                  <Circle size={24} color="#d1d5db" />
                )}
              </View>
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

            {clientWeightsLogs?.map((log, index) => (
              <View
                key={index}
                className="py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-medium text-gray-800">{formatDate(log.date)}</Text>
                  {/* <View className="flex-row items-center">
                    <Clock size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-500 ml-1">
                      {log.workoutsCompleted} workouts
                    </Text>
                  </View> */}
                </View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-gray-600">Weight: {log.weight} lbs</Text>
                </View>
                <Text className="text-gray-600 text-sm">{log.notes}</Text>
              </View>
            ))}
          </View>

          {/* Message Client Button */}
          {/* <TouchableOpacity className="bg-pink-600 py-3 rounded-lg items-center mb-8">
            <Text className="text-white font-semibold">Message Client</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-xl p-5 max-h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-pink-800">
                Assign Weekly Goal
                {/* {isEditing ? "Edit Workout Plan" : "Create Workout Plan"} */}
              </Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 text-gray-800"
                value={goalTitle}
                onChangeText={(text) =>
                  setGoalTitle(text)
                }
                placeholder="e.g. Full Body Strength"
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500 mt-1">Required</Text>
            </View>

            {/* Schedule Date Selector */}
            <View className="mb-3">
              <Text className="text-gray-700 mb-2 font-medium">
                Start Date
              </Text>
              <TouchableOpacity
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"
                onPress={() => setShowGoalDatePicker(true)}
              >
                <Text className="text-gray-800">
                  {formatDate(goalStartDate)}
                </Text>
                <CalendarDays size={20} color="#9ca3af" />
              </TouchableOpacity>

              {showGoalDatePicker && (
                <View className="bg-white p-2 rounded-lg mt-2">
                  <DateTimePicker
                    value={goalStartDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onGoalStartDateChange}
                    minimumDate={new Date()}
                  />
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      className="bg-pink-600 py-2 px-4 rounded-lg self-end mt-2"
                      onPress={() => setShowGoalDatePicker(false)}
                    >
                      <Text className="text-white font-medium">Done</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>


            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => setShowGoalModal(false)}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-pink-600 py-2 px-4 rounded-lg flex-row items-center ${isAssigningGoal ? "opacity-70" : ""}`}
                onPress={handleAssignGoal}
                disabled={isAssigningGoal}
              >
                {isAssigningGoal ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-medium ml-2">
                      Assigning...
                    </Text>
                  </>
                ) : (
                  <>
                    <Save size={16} color="white" />
                    <Text className="text-white font-medium ml-1">
                      Assign Goal
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View >
      </Modal >

    </View >
  );
};

export default ClientDetails;
