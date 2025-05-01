import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
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
  ArrowLeft,
  Flame,
  Play,
  PieChart,
} from "lucide-react-native";

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  inProgress?: boolean;
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
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
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

  // Nutrition plan data
  const nutritionPlan = {
    title: "Balanced Diet Plan",
    totalCalories: "1,800",
    macros: {
      protein: 30,
      carbs: 45,
      fat: 25,
    },
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        description: "Oatmeal with berries and nuts",
        calories: 350,
        imageUrl:
          "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
        nutrients: {
          protein: "15g",
          carbs: "45g",
          fat: "12g",
          fiber: "8g",
        },
        ingredients: [
          "1/2 cup rolled oats",
          "1 cup almond milk",
          "1/4 cup mixed berries",
          "1 tbsp chia seeds",
          "1 tbsp honey",
          "1 tbsp chopped nuts",
        ],
      },
      {
        name: "Snack",
        time: "10:30 AM",
        description: "Greek yogurt with honey",
        calories: 180,
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
        nutrients: {
          protein: "18g",
          carbs: "12g",
          fat: "5g",
          fiber: "0g",
        },
        ingredients: ["1 cup Greek yogurt", "1 tbsp honey", "1/2 tsp cinnamon"],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        description: "Grilled chicken salad with avocado",
        calories: 450,
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        nutrients: {
          protein: "35g",
          carbs: "20g",
          fat: "25g",
          fiber: "8g",
        },
        ingredients: [
          "4 oz grilled chicken breast",
          "2 cups mixed greens",
          "1/2 avocado",
          "1/4 cup cherry tomatoes",
          "1/4 cup cucumber",
          "2 tbsp olive oil and lemon dressing",
        ],
      },
      {
        name: "Snack",
        time: "4:00 PM",
        description: "Apple with almond butter",
        calories: 200,
        imageUrl:
          "https://images.unsplash.com/photo-1568093858174-0f391ea21c45?w=400&q=80",
        nutrients: {
          protein: "5g",
          carbs: "25g",
          fat: "10g",
          fiber: "5g",
        },
        ingredients: ["1 medium apple", "1 tbsp almond butter"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        description: "Salmon with roasted vegetables",
        calories: 520,
        imageUrl:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
        nutrients: {
          protein: "30g",
          carbs: "30g",
          fat: "28g",
          fiber: "6g",
        },
        ingredients: [
          "5 oz salmon fillet",
          "1 cup roasted brussels sprouts",
          "1/2 cup roasted sweet potatoes",
          "1 tbsp olive oil",
          "1 tsp herbs and spices",
        ],
      },
    ],
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

          <TouchableOpacity
            className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
            onPress={() => setShowNutritionInfo(true)}
          >
            <Text className="text-pink-800 font-medium">
              View Nutrition Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <View className="p-4 mb-8">
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
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Nutrition Info Modal */}
      <Modal
        visible={showNutritionInfo}
        animationType="slide"
        onRequestClose={() => setShowNutritionInfo(false)}
      >
        <View className="flex-1 bg-pink-50">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowNutritionInfo(false)}>
              <ArrowLeft size={24} color="#be185d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-pink-800 ml-4">
              Nutrition Information
            </Text>
          </View>

          <ScrollView className="flex-1">
            {/* Nutrition Plan Header */}
            <View className="bg-pink-800 p-6">
              <Text className="text-2xl font-bold text-white mb-2">
                {nutritionPlan.title}
              </Text>
              <Text className="text-pink-200">
                {nutritionPlan.totalCalories} calories per day
              </Text>
            </View>

            {/* Macros Distribution */}
            <View className="p-4 bg-white mb-4">
              <View className="flex-row items-center mb-2">
                <PieChart size={20} color="#be185d" />
                <Text className="text-lg font-semibold text-pink-800 ml-2">
                  Macronutrient Distribution
                </Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-pink-600 items-center justify-center">
                    <Text className="text-white font-bold">
                      {nutritionPlan.macros.protein}%
                    </Text>
                  </View>
                  <Text className="mt-2 font-medium text-gray-700">
                    Protein
                  </Text>
                </View>

                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-purple-500 items-center justify-center">
                    <Text className="text-white font-bold">
                      {nutritionPlan.macros.carbs}%
                    </Text>
                  </View>
                  <Text className="mt-2 font-medium text-gray-700">Carbs</Text>
                </View>

                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center">
                    <Text className="text-white font-bold">
                      {nutritionPlan.macros.fat}%
                    </Text>
                  </View>
                  <Text className="mt-2 font-medium text-gray-700">Fat</Text>
                </View>
              </View>
            </View>

            {/* Meal List */}
            <View className="p-4">
              <Text className="text-xl font-bold text-pink-800 mb-4">
                Daily Meals
              </Text>

              {nutritionPlan.meals.map((meal, index) => (
                <View
                  key={index}
                  className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                >
                  <Image
                    source={{ uri: meal.imageUrl }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-lg font-bold text-gray-800">
                        {meal.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Clock size={14} color="#9ca3af" />
                        <Text className="text-gray-500 ml-1">{meal.time}</Text>
                      </View>
                    </View>

                    <Text className="text-gray-700 mb-3">
                      {meal.description}
                    </Text>
                    <Text className="text-pink-600 font-medium mb-2">
                      {meal.calories} calories
                    </Text>

                    {/* Nutrients */}
                    <View className="flex-row justify-between mb-3 bg-gray-50 p-2 rounded-lg">
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">Protein</Text>
                        <Text className="font-medium">
                          {meal.nutrients.protein}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">Carbs</Text>
                        <Text className="font-medium">
                          {meal.nutrients.carbs}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">Fat</Text>
                        <Text className="font-medium">
                          {meal.nutrients.fat}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">Fiber</Text>
                        <Text className="font-medium">
                          {meal.nutrients.fiber}
                        </Text>
                      </View>
                    </View>

                    {/* Ingredients */}
                    <Text className="font-medium text-gray-800 mb-1">
                      Ingredients:
                    </Text>
                    <View>
                      {meal.ingredients.map((ingredient, idx) => (
                        <Text key={idx} className="text-gray-600 text-sm">
                          • {ingredient}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Download Button */}
            <View className="p-4 mb-8">
              <TouchableOpacity
                className="bg-pink-600 py-4 rounded-xl flex-row justify-center items-center"
                onPress={() => {
                  setShowNutritionInfo(false);
                  setTimeout(() => {
                    Alert.alert(
                      "Download Complete",
                      "Your meal plan has been downloaded successfully and is available in your downloads folder.",
                    );
                  }, 500);
                }}
              >
                <Text className="text-white font-bold text-lg">
                  Download Meal Plan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MyPlan;
