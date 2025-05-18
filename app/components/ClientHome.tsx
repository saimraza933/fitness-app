import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Dumbbell,
  Clock,
  Flame,
  Play,
  Utensils,
  Scale,
  CheckCircle,
  Circle,
  Trophy,
  Scroll,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clientApi } from "../services/api";

interface WorkoutItem {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  inProgress?: boolean;
  imageUrl?: string;
}

interface MealItem {
  id: string;
  name: string;
  time: string;
  description: string;
  completed: boolean;
  imageUrl?: string;
}

const ClientHome = () => {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [weightSaved, setWeightSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [weightHistory, setWeightHistory] = useState<
    { date: string; weight: string }[]
  >([]);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([
    {
      id: "1",
      name: "Squats",
      sets: 3,
      reps: 15,
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
    },
    {
      id: "2",
      name: "Push-ups",
      sets: 3,
      reps: 10,
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    },
    {
      id: "3",
      name: "Lunges",
      sets: 3,
      reps: 12,
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
    },
    {
      id: "4",
      name: "Plank",
      sets: 3,
      reps: 30,
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1566351557863-467d204a9f8f?w=400&q=80",
    },
  ]);

  const [meals, setMeals] = useState<MealItem[]>([
    {
      id: "1",
      name: "Breakfast",
      time: "8:00 AM",
      description: "Oatmeal with berries and nuts",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
    },
    {
      id: "2",
      name: "Snack",
      time: "10:30 AM",
      description: "Greek yogurt with honey",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    },
    {
      id: "3",
      name: "Lunch",
      time: "1:00 PM",
      description: "Grilled chicken salad with avocado",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    },
    {
      id: "4",
      name: "Snack",
      time: "4:00 PM",
      description: "Apple with almond butter",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1568093858174-0f391ea21c45?w=400&q=80",
    },
    {
      id: "5",
      name: "Dinner",
      time: "7:00 PM",
      description: "Salmon with roasted vegetables",
      completed: false,
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    },
  ]);

  const toggleWorkoutCompletion = (id: string) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === id
          ? { ...workout, completed: !workout.completed }
          : workout,
      ),
    );
  };

  const toggleMealCompletion = (id: string) => {
    setMeals(
      meals.map((meal) =>
        meal.id === id ? { ...meal, completed: !meal.completed } : meal,
      ),
    );
  };

  // Mock API call to save weight
  const saveWeight = async () => {
    if (!weight) {
      Alert.alert("Error", "Please enter your weight");
      return;
    }
    const clientId = await AsyncStorage.getItem('user_id');

    if (clientId === null) {
      throw new Error('Trainer ID not found in storage');
    }
    const parsedClientId = parseInt(clientId, 10);
    const today = new Date().toISOString().split("T")[0];
    setRefreshing(true);

    try {
      await clientApi.savedailyWeightsLogs(0, Number(weight), today, parsedClientId);
      Alert.alert("Success", "Weight saved successfully");
      setWeight('')
    } catch (error) {
      Alert.alert("Error", "Soemthing went wrong");
    } finally {
      setRefreshing(false)
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Workout details data
  const workoutDetails = {
    title: "Full Body Strength",
    duration: "45 min",
    calories: "320",
    difficulty: "Intermediate",
    description:
      "This full-body workout focuses on building strength and endurance with a mix of compound exercises.",
    exercises: workouts,
  };

  return (
    <View className="bg-pink-50 p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-pink-800 mb-2">
          Welcome
        </Text>
        <Text className="text-gray-600">Let's crush your goals today!</Text>
      </View>

      {/* Daily Stats */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 mr-2 items-center">
          <Text className="text-gray-500 text-sm">Calories</Text>
          <Text className="text-xl font-bold text-pink-800">1,450</Text>
          <Text className="text-xs text-green-600">-350 today</Text>
        </View>
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 mx-2 items-center">
          <Text className="text-gray-500 text-sm">Water</Text>
          <Text className="text-xl font-bold text-pink-800">4/8</Text>
          <Text className="text-xs text-pink-600">glasses</Text>
        </View>
        <View className="bg-white p-3 rounded-xl shadow-sm flex-1 ml-2 items-center">
          <Text className="text-gray-500 text-sm">Steps</Text>
          <Text className="text-xl font-bold text-pink-800">6,240</Text>
          <Text className="text-xs text-gray-500">goal: 10,000</Text>
        </View>
      </View>
      <ScrollView>


        {/* Weight Tracking */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-2">
            <Scale size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Weight Tracking
            </Text>
          </View>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
              placeholder="Enter today's weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TouchableOpacity
              className={`${refreshing ? "opacity-70" : ""} bg-pink-600 py-2 px-4 rounded-lg`}
              onPress={saveWeight}
              disabled={refreshing}
            >
              <Text className="text-white font-semibold">
                {refreshing ? "Save..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Workout */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Dumbbell size={20} color="#be185d" />
              <Text className="text-lg font-semibold text-pink-800 ml-2">
                Today's Workout
              </Text>
            </View>
            <View className="flex-row items-center">
              <Trophy size={16} color="#be185d" />
              <Text className="text-sm font-medium text-pink-800 ml-1">
                75% done
              </Text>
            </View>
          </View>

          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => toggleWorkoutCompletion(workout.id)}
            >
              <View className="flex-row items-center">
                {workout.imageUrl && (
                  <Image
                    source={{ uri: workout.imageUrl }}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                )}
                <View>
                  <Text className="font-medium text-gray-800">
                    {workout.name}
                  </Text>
                  <Text className="text-gray-500">
                    {workout.sets} sets × {workout.reps} reps
                  </Text>
                </View>
              </View>
              {workout.completed ? (
                <CheckCircle size={24} color="#be185d" />
              ) : (
                <Circle size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
            onPress={() => setShowWorkoutDetails(true)}
          >
            <Text className="text-pink-800 font-medium">View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Diet Recommendations */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Utensils size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Diet Plan
            </Text>
          </View>

          {meals.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => toggleMealCompletion(meal.id)}
            >
              <View className="flex-row items-center">
                {meal.imageUrl && (
                  <Image
                    source={{ uri: meal.imageUrl }}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                )}
                <View>
                  <Text className="font-medium text-gray-800">
                    {meal.name} - {meal.time}
                  </Text>
                  <Text className="text-gray-500">{meal.description}</Text>
                </View>
              </View>
              {meal.completed ? (
                <CheckCircle size={24} color="#be185d" />
              ) : (
                <Circle size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
            onPress={() => router.push("/nutrition-info")}
          >
            <Text className="text-pink-800 font-medium">View Nutrition Info</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-pink-600 py-3 px-4 rounded-lg items-center mb-10"
          onPress={() => router.push("/dashboard", { screen: "Progress" })}
        >
          <Text className="text-white font-semibold text-lg">View Progress</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Workout Details Modal */}
      <Modal
        visible={showWorkoutDetails}
        animationType="slide"
        onRequestClose={() => setShowWorkoutDetails(false)}
      >
        <View className="flex-1 bg-pink-50">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowWorkoutDetails(false)}>
              <ArrowLeft size={24} color="#be185d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-pink-800 ml-4">
              Workout Details
            </Text>
          </View>

          <ScrollView className="flex-1">
            {/* Workout Header */}
            <View className="bg-pink-800 p-6">
              <Text className="text-2xl font-bold text-white mb-2">
                {workoutDetails.title}
              </Text>
              <View className="flex-row mt-2">
                <View className="flex-row items-center mr-4">
                  <Clock size={16} color="#f9a8d4" />
                  <Text className="text-pink-200 ml-1">
                    {workoutDetails.duration}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Flame size={16} color="#f9a8d4" />
                  <Text className="text-pink-200 ml-1">
                    {workoutDetails.calories} cal
                  </Text>
                </View>
              </View>
              <Text className="text-pink-200 mt-2">
                {workoutDetails.difficulty}
              </Text>
            </View>

            {/* Workout Description */}
            <View className="p-4 bg-white mb-4">
              <Text className="text-gray-700">
                {workoutDetails.description}
              </Text>
            </View>

            {/* Exercise List */}
            <View className="p-4">
              <Text className="text-xl font-bold text-pink-800 mb-4">
                Exercises
              </Text>

              {workoutDetails.exercises.map((exercise) => (
                <View
                  key={exercise.id}
                  className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                >
                  {exercise.imageUrl && (
                    <Image
                      source={{ uri: exercise.imageUrl }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  )}
                  <View className="p-4">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      {exercise.name}
                    </Text>
                    <Text className="text-pink-600 font-medium mb-2">
                      {exercise.sets} sets × {exercise.reps}{" "}
                      {exercise.reps > 1 ? "reps" : "rep"}
                    </Text>
                    <Text className="text-gray-600">
                      Perform {exercise.sets} sets of {exercise.reps}{" "}
                      repetitions with proper form.
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Start Workout Button */}
            {/* <View className="p-4 mb-8">
              <TouchableOpacity
                className="bg-pink-600 py-4 rounded-xl flex-row justify-center items-center"
                onPress={() => {
                  // Mark all workouts as in progress
                  setWorkouts(
                    workouts.map((workout) => ({
                      ...workout,
                      inProgress: true,
                    })),
                  );
                  // Close the modal immediately
                  setShowWorkoutDetails(false);
                  // Show feedback to the user
                  Alert.alert(
                    "Workout Started",
                    "Your workout timer has begun. Good luck!",
                  );
                }}
              >
                <Play size={20} color="white" fill="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Start Workout
                </Text>
              </TouchableOpacity>
            </View> */}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ClientHome;
