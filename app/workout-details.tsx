import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Dumbbell, Clock, Flame, Play } from "lucide-react-native";

export default function WorkoutDetailsScreen() {
  const router = useRouter();

  const workoutDetails = {
    title: "Full Body Strength",
    duration: "45 min",
    calories: "320",
    difficulty: "Intermediate",
    description:
      "This full-body workout focuses on building strength and endurance with a mix of compound exercises.",
    exercises: [
      {
        name: "Squats",
        sets: 3,
        reps: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
        instructions:
          "Stand with feet shoulder-width apart. Lower your body as if sitting in a chair. Keep your back straight and knees over toes. Return to standing position.",
      },
      {
        name: "Push-ups",
        sets: 3,
        reps: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
        instructions:
          "Start in plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the floor. Push back up to starting position.",
      },
      {
        name: "Lunges",
        sets: 3,
        reps: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
        instructions:
          "Stand tall with feet hip-width apart. Take a step forward with right leg and lower body until both knees form 90-degree angles. Push back to starting position and repeat with left leg.",
      },
      {
        name: "Plank",
        sets: 3,
        reps: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1566351557863-467d204a9f8f?w=400&q=80",
        instructions:
          "Start in forearm plank position with elbows directly beneath shoulders. Keep body in straight line from head to heels. Hold position while engaging core muscles.",
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
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
          <Text className="text-gray-700">{workoutDetails.description}</Text>
        </View>

        {/* Exercise List */}
        <View className="p-4">
          <Text className="text-xl font-bold text-pink-800 mb-4">
            Exercises
          </Text>

          {workoutDetails.exercises.map((exercise, index) => (
            <View
              key={index}
              className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
            >
              <Image
                source={{ uri: exercise.imageUrl }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {exercise.name}
                </Text>
                <Text className="text-pink-600 font-medium mb-2">
                  {exercise.sets} sets × {exercise.reps}{" "}
                  {exercise.reps > 1 ? "reps" : "rep"}
                </Text>
                <Text className="text-gray-600">{exercise.instructions}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start Workout Button */}
        <View className="p-4 mb-8">
          <TouchableOpacity className="bg-pink-600 py-4 rounded-xl flex-row justify-center items-center">
            <Play size={20} color="white" fill="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
