import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Dumbbell,
  Utensils,
  Scale,
  CheckCircle,
  Circle,
} from "lucide-react-native";

interface WorkoutItem {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

interface MealItem {
  id: string;
  name: string;
  time: string;
  description: string;
  completed: boolean;
}

const ClientHome = () => {
  const [weight, setWeight] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([
    { id: "1", name: "Squats", sets: 3, reps: 15, completed: false },
    { id: "2", name: "Push-ups", sets: 3, reps: 10, completed: false },
    { id: "3", name: "Lunges", sets: 3, reps: 12, completed: false },
    { id: "4", name: "Plank", sets: 3, reps: 30, completed: false },
  ]);

  const [meals, setMeals] = useState<MealItem[]>([
    {
      id: "1",
      name: "Breakfast",
      time: "8:00 AM",
      description: "Oatmeal with berries and nuts",
      completed: false,
    },
    {
      id: "2",
      name: "Snack",
      time: "10:30 AM",
      description: "Greek yogurt with honey",
      completed: false,
    },
    {
      id: "3",
      name: "Lunch",
      time: "1:00 PM",
      description: "Grilled chicken salad with avocado",
      completed: false,
    },
    {
      id: "4",
      name: "Snack",
      time: "4:00 PM",
      description: "Apple with almond butter",
      completed: false,
    },
    {
      id: "5",
      name: "Dinner",
      time: "7:00 PM",
      description: "Salmon with roasted vegetables",
      completed: false,
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

  return (
    <View className="flex-1 p-4 bg-pink-50">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-pink-800 mb-2">
          Welcome, Sarah!
        </Text>
        <Text className="text-gray-600">Let's crush your goals today!</Text>
      </View>

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
          <TouchableOpacity className="bg-pink-600 py-2 px-4 rounded-lg">
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Workout */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <View className="flex-row items-center mb-4">
          <Dumbbell size={20} color="#be185d" />
          <Text className="text-lg font-semibold text-pink-800 ml-2">
            Today's Workout
          </Text>
        </View>

        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
            onPress={() => toggleWorkoutCompletion(workout.id)}
          >
            <View>
              <Text className="font-medium text-gray-800">{workout.name}</Text>
              <Text className="text-gray-500">
                {workout.sets} sets × {workout.reps} reps
              </Text>
            </View>
            {workout.completed ? (
              <CheckCircle size={24} color="#be185d" />
            ) : (
              <Circle size={24} color="#d1d5db" />
            )}
          </TouchableOpacity>
        ))}
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
            <View>
              <Text className="font-medium text-gray-800">
                {meal.name} - {meal.time}
              </Text>
              <Text className="text-gray-500">{meal.description}</Text>
            </View>
            {meal.completed ? (
              <CheckCircle size={24} color="#be185d" />
            ) : (
              <Circle size={24} color="#d1d5db" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity className="bg-pink-600 py-3 px-4 rounded-lg items-center">
        <Text className="text-white font-semibold text-lg">View Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClientHome;
