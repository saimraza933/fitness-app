import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
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
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setCurrentDietPlan } from "../store/slices/userSlice";

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

const mockWorkoutData = [
  {
    "id": 7,
    "clientId": 4,
    "workoutPlanId": 14,
    "assignedBy": 5,
    "scheduledDate": "2025-05-18",
    "completed": 0,
    "workoutPlan": {
      "id": 14,
      "name": "Test Workout Plan",
      "description": "This is test plan",
      "difficulty": "Intermediate",
      "durationMinutes": 30,
      "caloriesBurned": 300,
      "createdBy": 5,
      "exercises": [
        {
          "id": 38,
          "workoutPlanId": 14,
          "exerciseId": 7,
          "exercise": {
            "id": 7,
            "name": "Legs Press",
            "description": "Exercie for legs",
            "imageUrl": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
            "instructions": "This is for legs",
            "created_by": 0,
            "createdAt": "2025-05-07T06:50:28.000Z",
            "updatedAt": "2025-05-07T06:53:16.000Z"
          },
          "sets": 3,
          "reps": 10,
          "exerciseOrder": 1,
          "createdAt": "2025-05-18T12:29:28.000Z",
          "updatedAt": "2025-05-18T12:29:28.000Z"
        }
      ],
      "createdAt": "2025-05-18T05:36:38.000Z",
      "updatedAt": "2025-05-18T05:44:13.000Z"
    },
    "createdAt": "2025-05-18T09:27:15.000Z",
    "updatedAt": "2025-05-18T09:27:15.000Z"
  },
  {
    "id": 8,
    "clientId": 4,
    "workoutPlanId": 16,
    "assignedBy": 5,
    "scheduledDate": "2025-05-19",
    "completed": 0,
    "workoutPlan": {
      "id": 16,
      "name": "Full  Body Workout Plan",
      "description": "This is test plan",
      "difficulty": "Intermediate",
      "durationMinutes": 45,
      "caloriesBurned": 300,
      "createdBy": 5,
      "exercises": [
        {
          "id": 30,
          "workoutPlanId": 16,
          "exerciseId": 5,
          "exercise": {
            "id": 5,
            "name": "Squats",
            "description": "Breif Description",
            "imageUrl": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
            "instructions": "step by step implmetation",
            "created_by": 0,
            "createdAt": "2025-05-07T06:32:08.000Z",
            "updatedAt": "2025-05-07T06:36:39.000Z"
          },
          "sets": 3,
          "reps": 10,
          "exerciseOrder": 1,
          "createdAt": "2025-05-18T05:40:42.000Z",
          "updatedAt": "2025-05-18T05:40:42.000Z"
        }
      ],
      "createdAt": "2025-05-18T05:40:42.000Z",
      "updatedAt": "2025-05-18T05:40:42.000Z"
    },
    "createdAt": "2025-05-19T11:45:19.000Z",
    "updatedAt": "2025-05-19T11:45:19.000Z"
  },
  {
    "id": 9,
    "clientId": 4,
    "workoutPlanId": 17,
    "assignedBy": 5,
    "scheduledDate": "2025-05-19",
    "completed": 0,
    "workoutPlan": {
      "id": 17,
      "name": "Test plan 2",
      "description": "Test",
      "difficulty": "Beginner",
      "durationMinutes": 30,
      "caloriesBurned": 200,
      "createdBy": 5,
      "exercises": [
        {
          "id": 33,
          "workoutPlanId": 17,
          "exerciseId": 10,
          "exercise": {
            "id": 10,
            "name": "Test exercise ",
            "description": "test description ",
            "imageUrl": "https://picsum.photos/200/300?grayscale",
            "instructions": "Test instructions ",
            "created_by": 5,
            "createdAt": "2025-05-18T11:43:43.000Z",
            "updatedAt": "2025-05-18T12:31:21.000Z"
          },
          "sets": 3,
          "reps": 10,
          "exerciseOrder": 1,
          "createdAt": "2025-05-18T12:21:26.000Z",
          "updatedAt": "2025-05-18T12:21:26.000Z"
        }
      ],
      "createdAt": "2025-05-18T12:21:26.000Z",
      "updatedAt": "2025-05-18T12:21:26.000Z"
    },
    "createdAt": "2025-05-19T11:45:50.000Z",
    "updatedAt": "2025-05-19T11:45:50.000Z"
  }
]
// Workout details data
const mockWorkoutDetails = {
  title: "Full Body Strength",
  duration: "45 min",
  calories: "320",
  difficulty: "Intermediate",
  description:
    "This full-body workout focuses on building strength and endurance with a mix of compound exercises.",
  // exercises: workouts,
};
const mockMealData = [
  {
    "id": 5,
    "name": "Plan 3",
    "description": "Test hai ye",
    "totalCalories": 30,
    "proteinPercentage": "60.00",
    "carbsPercentage": "20.00",
    "fatPercentage": "50.00",
    "createdAt": "2025-05-20T16:38:10.000Z",
    "meals": [
      {
        "id": 5,
        "name": "Test Meal ",
        "time": "22:09:42",
        "description": "Test description ",
        "calories": 30,
        "protein": "80.00",
        "carbs": "50.00",
        "fat": "30.00",
        "fiber": "20.00",
        "imageUrl": "https://picsum.photos/200/300",
        "completion": {
          "id": 3,
          "clientDietAssignmentId": 3,
          "mealId": 5,
          "completed": 0,
          "completedAt": null,
          "createdAt": "2025-05-20T17:33:25.000Z",
          "updatedAt": "2025-05-20T17:33:25.000Z",
          "meal": {
            "id": 5,
            "dietPlanId": 5,
            "name": "Test Meal ",
            "time": "22:09:42",
            "description": "Test description ",
            "calories": 30,
            "protein": "80.00",
            "carbs": "50.00",
            "fat": "30.00",
            "fiber": "20.00",
            "imageUrl": "https://picsum.photos/200/300",
            "createdAt": "2025-05-20T17:10:35.000Z",
            "updatedAt": "2025-05-20T17:25:51.000Z"
          }
        },
        "ingredients": [
          {
            "name": "Egs",
            "quantity": "2"
          }
        ]
      },
      {
        "id": 6,
        "name": "Meal plan 2",
        "time": "22:26:41",
        "description": "Meal plan 2",
        "calories": 20,
        "protein": "30.00",
        "carbs": "20.00",
        "fat": "38.00",
        "fiber": "25.00",
        "imageUrl": "https://picsum.photos/200/300",
        "completion": {
          "id": 4,
          "clientDietAssignmentId": 3,
          "mealId": 6,
          "completed": 0,
          "completedAt": null,
          "createdAt": "2025-05-20T17:33:25.000Z",
          "updatedAt": "2025-05-20T17:33:25.000Z",
          "meal": {
            "id": 6,
            "dietPlanId": 5,
            "name": "Meal plan 2",
            "time": "22:26:41",
            "description": "Meal plan 2",
            "calories": 20,
            "protein": "30.00",
            "carbs": "20.00",
            "fat": "38.00",
            "fiber": "25.00",
            "imageUrl": "https://picsum.photos/200/300",
            "createdAt": "2025-05-20T17:27:27.000Z",
            "updatedAt": "2025-05-20T17:27:27.000Z"
          }
        },
        "ingredients": [
          {
            "name": "Potato ",
            "quantity": "2"
          }
        ]
      }
    ]
  }
]

const convertTimeStringToDate = (timeString: any) => {

  if (!timeString || typeof timeString !== 'string') return new Date();

  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  // fallback to current date with time if parsing fails
  if (
    isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
    hours > 23 || minutes > 59 || seconds > 59
  ) return new Date();

  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
};

const ClientHome = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { userId } = useAppSelector(state => state.auth)
  const [weight, setWeight] = useState("");
  const [weightSaved, setWeightSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [workoutDetails, setWorkoutDetails] = useState<any>(null)
  const [mealsHistory, setMealsHistory] = useState(null)
  const [weightHistory, setWeightHistory] = useState<
    { date: string; weight: string }[]
  >([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  const [meals, setMeals] = useState<any>(
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await Promise.all([
        fetchTodayWorkouts(),
        fetchTodayDietPlans()
      ])
      setIsLoading(false)
    })()

  }, [])

  const fetchTodayWorkouts = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    try {
      const response = await clientApi.getClientWorkoutsAssignmentsWithExercises(Number(userId), formattedDate)
      setWorkouts(response)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTodayDietPlans = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    try {
      const response = await clientApi.getClientsDietPlans(Number(userId), formattedDate)
      console.log(response)
      setMeals(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowDetails = (workout: any) => {
    setWorkoutDetails(workout)
    setShowWorkoutDetails(true)
  }

  const handleShowNutritionDeatails = (plan: any) => {
    setMealsHistory(plan)
    // setShowWorkoutDetails(true)
  }

  const toggleWorkoutCompletion = async (workoutPlanId: any, exerciseId: any, completed: any) => {

    Alert.alert(
      'Confirm Action',
      `Are you sure you want to mark this workout as ${completed ? 'incomplete' : 'complete'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const status = completed === 0 ? 1 : 0
              await clientApi.markExerciseComplete(Number(workoutPlanId), exerciseId, status)
              fetchTodayWorkouts()
            } catch (error) {
              console.log(error)
              Alert.alert('Error', 'Something went wrong.')
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleMeal = async (assignmentId: any, mealId: any, completed: any) => {
    // console.log(assignmentId, mealId)
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to mark this meal as ${completed ? 'incomplete' : 'complete'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const status = completed === 0 ? true : false
              await clientApi.markMealComplete(Number(userId), assignmentId, mealId, status)
              fetchTodayDietPlans()
            } catch (error) {
              console.log(error)
              Alert.alert('Error', 'Something went wrong.')
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleMealCompletion = (id: string) => {
    setMeals(
      meals.map((meal: any) =>
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
    const today = new Date().toISOString().split("T")[0];
    setRefreshing(true);

    try {
      await clientApi.savedailyWeightsLogs(0, Number(weight), today, Number(userId));
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



  return (
    <View className="bg-pink-50 p-4 flex-1">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-pink-800 mb-2">
          Welcome
        </Text>
        <Text className="text-gray-600">Let's crush your goals today!</Text>
      </View>

      {/* Daily Stats */}
      {/* <View className="flex-row justify-between mb-6">
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
      </View> */}
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
            {/* <View className="flex-row items-center">
              <Trophy size={16} color="#be185d" />
              <Text className="text-sm font-medium text-pink-800 ml-1">
                75% done
              </Text>
            </View> */}
          </View>

          {/* {workouts.map((workout, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => toggleWorkoutCompletion(workout.id)}
            >
              <View className="flex-row items-center">
                {workout?.imageUrl && (
                  <Image
                    source={{ uri: workout.imageUrl }}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                )}
                <View>
                  <Text className="font-medium text-gray-800">
                    {workout?.name}
                  </Text>
                  <Text className="text-gray-500">
                    {workout?.sets} sets × {workout?.reps} reps
                  </Text>
                </View>
              </View>
              {workout?.completed ? (
                <CheckCircle size={24} color="#be185d" />
              ) : (
                <Circle size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))} */}

          {
            isLoading ? (
              <View className="items-center justify-center">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) :
              workouts?.length > 0 ?
                workouts.map((workout, index) => (
                  <View key={index} className="mb-3">
                    <Text className="text-base font-semibold text-pink-800">
                      {workout?.workoutPlan?.name}
                    </Text>

                    {workout?.workoutPlan?.exercises?.map((item: any, subIndex: any) => {
                      const exercise = item?.exercise;
                      return (
                        <TouchableOpacity
                          key={subIndex}
                          className="flex-row items-center justify-between py-3 border-b border-gray-100"
                          onPress={() => toggleWorkoutCompletion(item?.workoutPlanId, item?.exerciseId, item?.completed)}
                        >
                          <View className="flex-row items-center">
                            {exercise?.imageUrl && (
                              <Image
                                source={{ uri: exercise.imageUrl }}
                                className="w-12 h-12 rounded-lg mr-3"
                              />
                            )}
                            <View>
                              <Text className="font-medium text-gray-800">
                                {exercise?.name}
                              </Text>
                              <Text className="text-gray-500">
                                {item.sets} sets × {item.reps} reps
                              </Text>
                            </View>
                          </View>
                          {item?.completed == 1 ? (
                            <CheckCircle size={24} color="#be185d" />
                          ) : (
                            <Circle size={24} color="#d1d5db" />
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    <TouchableOpacity
                      className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
                      onPress={() => handleShowDetails(workout)}
                    >
                      <Text className="text-pink-800 font-medium">View Details</Text>
                    </TouchableOpacity>
                  </View>
                )) : (
                  <Text className="text-center">No workout found. Ask your trainer to assign today's workout.</Text>
                )
          }

        </View>

        {/* Diet Recommendations */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Utensils size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Diet Plan
            </Text>
          </View>

          {/* {meals.map((meal) => (
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
          ))} */}

          {
            isLoading ? (
              <View className="items-center justify-center">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) :
              meals?.length > 0 ?
                meals.map((plan, index) => (
                  <View key={index} className="mb-3">
                    <Text className="text-base font-semibold text-pink-800">
                      {plan?.name}
                    </Text>

                    {plan?.meals?.map((item: any, subIndex: any) => {

                      return (
                        <TouchableOpacity
                          key={subIndex}
                          className="flex-row items-center justify-between py-3 border-b border-gray-100"
                          onPress={() => {
                            if (item?.completion) {
                              toggleMeal(
                                item.completion.clientDietAssignmentId,
                                item.completion.mealId,
                                item.completion.completed
                              );
                            } else {
                              alert("No completion object for this meal");
                            }
                          }}
                        >
                          <View className="flex-row items-center">
                            {item?.imageUrl && (
                              <Image
                                source={{ uri: item.imageUrl }}
                                className="w-12 h-12 rounded-lg mr-3"
                              />
                            )}
                            <View>
                              <Text className="font-medium text-gray-800">
                                {item?.name}- {convertTimeStringToDate(item.time).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Text>
                              <Text className="text-gray-500">
                                {item?.description}
                              </Text>
                            </View>
                          </View>
                          {item?.completion?.completed == 1 ? (
                            <CheckCircle size={24} color="#be185d" />
                          ) : (
                            <Circle size={24} color="#d1d5db" />
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    <TouchableOpacity
                      className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
                      onPress={() => {
                        dispatch(setCurrentDietPlan(plan))
                        router.push({
                          pathname: "/nutrition-info",
                        })
                      }}
                    >
                      <Text className="text-pink-800 font-medium">View Nutrition Info</Text>
                    </TouchableOpacity>
                  </View>
                )) : (
                  <Text className="text-center">No meals found. Ask your trainer to assign today's meals.</Text>
                )
          }

          {/* <TouchableOpacity
            className="mt-4 bg-pink-100 py-2 px-4 rounded-lg self-start"
            onPress={() => router.push({
              pathname: "/nutrition-info",
              params: {
                plan: plan
              }
            })}

          >
            <Text className="text-pink-800 font-medium">View Nutrition Info</Text>
          </TouchableOpacity> */}

        </View>

        {/* <TouchableOpacity
          className="bg-pink-600 py-3 px-4 rounded-lg items-center mb-10"
          onPress={() => router.push("/dashboard", { screen: "Progress" })}
        >
          <Text className="text-white font-semibold text-lg">View Progress</Text>
        </TouchableOpacity> */}
      </ScrollView >
      {/* Workout Details Modal */}
      <Modal Modal
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
                {workoutDetails?.workoutPlan?.name}
              </Text>
              <View className="flex-row mt-2">
                <View className="flex-row items-center mr-4">
                  <Clock size={16} color="#f9a8d4" />
                  <Text className="text-pink-200 ml-1">
                    {workoutDetails?.workoutPlan?.durationMinutes}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Flame size={16} color="#f9a8d4" />
                  <Text className="text-pink-200 ml-1">
                    {workoutDetails?.workoutPlan?.caloriesBurned} cal
                  </Text>
                </View>
              </View>
              <Text className="text-pink-200 mt-2">
                {workoutDetails?.workoutPlan?.difficulty}
              </Text>
            </View>

            {/* Workout Description */}
            <View className="p-4 bg-white mb-4">
              <Text className="text-gray-700">
                {workoutDetails?.workoutPlan?.description}
              </Text>
            </View>

            {/* Exercise List */}
            <View className="p-4">
              <Text className="text-xl font-bold text-pink-800 mb-4">
                Exercises
              </Text>

              {workoutDetails?.workoutPlan?.exercises.map((item: any, subIndex: any) => {
                const exercise = item?.exercise
                return (
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
                        {item.sets} sets × {item.reps}{" "}
                        {item.reps > 1 ? "reps" : "rep"}
                      </Text>
                      <Text className="text-gray-600">
                        Perform {item.sets} sets of {item.reps}{" "}
                        repetitions with proper form.
                      </Text>
                    </View>
                  </View>
                )
              })}
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
      </Modal >
    </View >
  );
};

export default ClientHome;
