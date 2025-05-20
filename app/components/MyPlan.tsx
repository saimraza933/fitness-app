import React, { useEffect, useState } from "react";
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
import { clientApi } from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ActivityIndicator } from "react-native";
import { setCurrentDietPlan } from "../store/slices/userSlice";

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

function formatDateToYYYYMMDD(isoDateString: any) {
  if (!isoDateString) return "";

  try {
    const date = new Date(isoDateString);
    return date.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
  } catch (error) {
    console.error("Invalid date string:", isoDateString);
    return "";
  }
}

const MyPlan = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { userId } = useAppSelector(state => state.auth)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [workoutDetails, setWorkoutDetails] = useState<any>(null)
  const [isMealLoading, setisMealLoading] = useState(false)
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchWorkouts(currentDate),
        fetchTodayDietPlans(currentDate)
      ])
    })()
  }, [])


  const fetchWorkouts = async (date?: any) => {
    const newdate: any = date ? date : new Date();
    const formattedDate = formatDateToYYYYMMDD(newdate)
    setIsLoading(true)
    try {
      const response = await clientApi.getClientWorkoutsAssignmentsWithExercises(Number(userId), formattedDate)
      setWorkouts(response)
    } catch (error) {
      console.error(error)
      setWorkouts(mockWorkoutData)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTodayDietPlans = async (date: any) => {
    setisMealLoading(true)
    const newdate: any = date ? date : new Date();
    const formattedDate = formatDateToYYYYMMDD(newdate)
    try {
      const response = await clientApi.getClientsDietPlans(Number(userId), formattedDate)
      setMeals(response)
    } catch (error) {
      console.log(error)
    } finally {
      setisMealLoading(false)
    }
  }

  const handleShowDetails = (workout: any) => {
    setWorkoutDetails(workout)
    setShowWorkoutDetails(true)
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
              fetchWorkouts()
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

  // Workout details data
  const mockworkoutDetails = {
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
    return date?.toLocaleDateString(undefined, options);
  };

  const changeDate = async (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    await Promise.all([fetchWorkouts(newDate), fetchTodayDietPlans(newDate)])
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
              fetchTodayDietPlans(currentDate)
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
              {formatDate(currentDate)} Workout's
            </Text>
          </View>

          {/* {workouts.map((workout) => (
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
          </TouchableOpacity> */}

          {
            isLoading ? (
              <View className="items-center justify-center">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) :
              workouts?.length > 0 ?
                workouts.map((workout: any, index) => (
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
                          {item?.completed ? (
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
                  <Text className="text-center">No workout found. Ask your trainer to assign workout.</Text>
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

          {
            isMealLoading ? (
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
                            console.log(item)
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
            onPress={() => setShowNutritionInfo(true)}
          >
            <Text className="text-pink-800 font-medium">
              View Nutrition Info
            </Text>
          </TouchableOpacity> */}
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
