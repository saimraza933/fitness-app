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
import { ArrowLeft, Utensils, Clock, PieChart } from "lucide-react-native";

export default function NutritionInfoScreen() {
  const router = useRouter();

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

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
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
              <Text className="mt-2 font-medium text-gray-700">Protein</Text>
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

                <Text className="text-gray-700 mb-3">{meal.description}</Text>
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
                    <Text className="font-medium">{meal.nutrients.carbs}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-gray-500">Fat</Text>
                    <Text className="font-medium">{meal.nutrients.fat}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-xs text-gray-500">Fiber</Text>
                    <Text className="font-medium">{meal.nutrients.fiber}</Text>
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
        {/* <View className="p-4 mb-8">
          <TouchableOpacity className="bg-pink-600 py-4 rounded-xl flex-row justify-center items-center">
            <Text className="text-white font-bold text-lg">
              Download Meal Plan
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
