import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Utensils,
  CheckCircle,
  Circle,
} from "lucide-react-native";

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  imageUrl: string;
}

interface MealPlan {
  id: string;
  name: string;
  time: string;
  description: string;
  completed: boolean;
  imageUrl: string;
}

const MyPlan = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<WorkoutExercise[]>([
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

  const [meals, setMeals] = useState<MealPlan[]>([
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

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <ScrollView className="flex-1 bg-pink-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-pink-800 mb-2">
          My Daily Plan
        </Text>

        {/* Date Selector */}
        <View className="flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-6">
          <TouchableOpacity onPress={() => changeDate(-1)}>
            <ChevronLeft size={24} color="#be185d" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              {formatDate(currentDate)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => changeDate(1)}>
            <ChevronRight size={24} color="#be185d" />
          </TouchableOpacity>
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
              <View className="flex-row items-center">
                <Image
                  source={{ uri: workout.imageUrl }}
                  className="w-12 h-12 rounded-lg mr-3"
                />
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
            onPress={() => {
              try {
                router.push("/workout-details");
              } catch (error) {
                console.log("Navigation error:", error);
                Alert.alert(
                  "Workout Details",
                  "This would navigate to workout details in the full app.",
                );
              }
            }}
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
                <Image
                  source={{ uri: meal.imageUrl }}
                  className="w-12 h-12 rounded-lg mr-3"
                />
                <View>
                  <View className="flex-row items-center">
                    <Text className="font-medium text-gray-800">
                      {meal.name}
                    </Text>
                    <View className="flex-row items-center ml-2">
                      <Clock size={12} color="#9ca3af" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {meal.time}
                      </Text>
                    </View>
                  </View>
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
            <Text className="text-pink-800 font-medium">
              View Nutrition Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyPlan;
