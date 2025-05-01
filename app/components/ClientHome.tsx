import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import {
  Dumbbell,
  Utensils,
  Scale,
  CheckCircle,
  Circle,
  Trophy,
} from "lucide-react-native";

interface WorkoutItem {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
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
  const [weight, setWeight] = useState("");
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View className="bg-pink-50 p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-pink-800 mb-2">
          Welcome, Sarah!
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

        <TouchableOpacity className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start">
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

        <TouchableOpacity className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start">
          <Text className="text-pink-800 font-medium">View Nutrition Info</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="bg-pink-600 py-3 px-4 rounded-lg items-center mb-10">
        <Text className="text-white font-semibold text-lg">View Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClientHome;
