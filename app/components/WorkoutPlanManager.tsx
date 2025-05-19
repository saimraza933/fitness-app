import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Dumbbell,
  Clock,
  Flame,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  ChevronDown,
  Save,
} from "lucide-react-native";
import { trainerApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Exercise {
  id: string | number;
  name: string;
  sets: number;
  reps: number;
  imageUrl?: string;
  instructions?: string;
}

interface WorkoutPlan {
  id: string | number;
  name: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises?: Exercise[];
}

const WorkoutPlanManager = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [exerciseSets, setExerciseSets] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    difficulty: string;
    durationMinutes: string;
    caloriesBurned: string;
    exercises: Exercise[];
  }>({
    name: "",
    description: "",
    difficulty: "Beginner",
    durationMinutes: "",
    caloriesBurned: "",
    exercises: [],
  });

  useEffect(() => {
    fetchWorkoutPlans();
    fetchExercises();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const trainerId = await AsyncStorage.getItem('user_id');

      if (trainerId === null) {
        throw new Error('Trainer ID not found in storage');
      }
      const parsedTrainerId = parseInt(trainerId, 10);

      const data = await trainerApi.getWorkoutPlansByTrainer(parsedTrainerId);
      setWorkoutPlans(data);
    } catch (err) {
      console.error("Error fetching workout plans:", err);
      setError("Failed to load workout plans. Please try again.");
      // Fallback to mock data if API fails
      setWorkoutPlans([
        {
          id: "1",
          name: "Full Body Strength",
          description: "A complete workout targeting all major muscle groups",
          difficulty: "Intermediate",
          durationMinutes: 45,
          caloriesBurned: 320,
        },
        {
          id: "2",
          name: "Weight Loss Program",
          description:
            "High intensity workout designed for maximum calorie burn",
          difficulty: "Advanced",
          durationMinutes: 30,
          caloriesBurned: 400,
        },
        {
          id: "3",
          name: "Cardio Focus",
          description: "Improve cardiovascular health and endurance",
          difficulty: "Beginner",
          durationMinutes: 40,
          caloriesBurned: 350,
        },
        {
          id: "4",
          name: "Muscle Building",
          description: "Heavy resistance training for muscle growth",
          difficulty: "Advanced",
          durationMinutes: 60,
          caloriesBurned: 450,
        },
        {
          id: "5",
          name: "Flexibility & Toning",
          description: "Focus on flexibility, balance and muscle toning",
          difficulty: "Beginner",
          durationMinutes: 50,
          caloriesBurned: 250,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async (planId: string | number) => {
    try {
      setLoading(true);
      const data = await trainerApi.getWorkoutPlan(planId);
      setSelectedPlan(data);
      setShowPlanDetails(true);
    } catch (err) {
      console.error("Error fetching workout plan details:", err);
      Alert.alert("Error", "Failed to load workout plan details.");
      // Fallback to mock data
      const mockExercises = [
        {
          id: "1",
          name: "Squats",
          sets: 3,
          reps: 15,
          imageUrl:
            "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
          instructions:
            "Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing.",
        },
        {
          id: "2",
          name: "Push-ups",
          sets: 3,
          reps: 10,
          imageUrl:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
          instructions:
            "Start in plank position with hands slightly wider than shoulders, lower chest to ground, then push back up.",
        },
        {
          id: "3",
          name: "Lunges",
          sets: 3,
          reps: 12,
          imageUrl:
            "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
          instructions:
            "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees, then return to standing.",
        },
        {
          id: "4",
          name: "Plank",
          sets: 3,
          reps: 30,
          imageUrl:
            "https://images.unsplash.com/photo-1566351557863-467d204a9f8f?w=400&q=80",
          instructions:
            "Hold a push-up position with your body in a straight line from head to heels for the specified time.",
        },
      ];

      const plan = workoutPlans.find((p) => p.id === planId);
      if (plan) {
        setSelectedPlan({
          ...plan,
          exercises: mockExercises,
        });
        setShowPlanDetails(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      setLoadingExercises(true);

      const trainerId = await AsyncStorage.getItem('user_id');

      if (trainerId === null) {
        throw new Error('Trainer ID not found in storage');
      }
      const parsedTrainerId = parseInt(trainerId, 10);
      console.log(parsedTrainerId)
      // Call the API to get exercises
      const data = await trainerApi.getExercisesByTrainer(parsedTrainerId);
      // Transform the data to match our Exercise interface if needed
      const formattedExercises = data?.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise?.default_sets || 3,
        reps: exercise?.default_reps || 10,
        imageUrl: exercise.imageUrl || exercise.imageUrl,
        instructions: exercise.instructions,
      }));

      setAvailableExercises(formattedExercises);
      setLoadingExercises(false);
    } catch (err) {
      console.error("Error fetching exercises:", err);

      // Fallback to mock data if API fails
      // setAvailableExercises([
      //   {
      //     id: "1",
      //     name: "Squats",
      //     sets: 3,
      //     reps: 15,
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
      //     instructions:
      //       "Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing.",
      //   },
      //   {
      //     id: "2",
      //     name: "Push-ups",
      //     sets: 3,
      //     reps: 10,
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      //     instructions:
      //       "Start in plank position with hands slightly wider than shoulders, lower chest to ground, then push back up.",
      //   },
      //   {
      //     id: "3",
      //     name: "Lunges",
      //     sets: 3,
      //     reps: 12,
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
      //     instructions:
      //       "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees, then return to standing.",
      //   },
      //   {
      //     id: "4",
      //     name: "Plank",
      //     sets: 3,
      //     reps: 30,
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1566351557863-467d204a9f8f?w=400&q=80",
      //     instructions:
      //       "Hold a push-up position with your body in a straight line from head to heels for the specified time.",
      //   },
      //   {
      //     id: "5",
      //     name: "Deadlift",
      //     sets: 3,
      //     reps: 8,
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
      //     instructions:
      //       "Stand with feet hip-width apart, bend at hips and knees to lower and grip the bar, then stand up by driving through the heels.",
      //   },
      // ]);
      setLoadingExercises(false);
    }
  };

  const handleCreatePlan = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      description: "",
      difficulty: "Beginner",
      durationMinutes: "",
      caloriesBurned: "",
      exercises: [],
    });
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setIsEditing(true);

    // Ensure exercises are properly formatted
    const formattedExercises = plan?.exercises
      ? plan.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        imageUrl: exercise.imageUrl,
        instructions: exercise.instructions,
      }))
      : [];
    setFormData({
      name: plan.name,
      description: plan.description,
      difficulty: plan.difficulty,
      durationMinutes: plan.durationMinutes.toString(),
      caloriesBurned: plan.caloriesBurned.toString(),
      exercises: formattedExercises,
    });
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleDeletePlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      setIsSaving(true);
      await trainerApi.deleteWorkoutPlan(selectedPlan.id);
      setWorkoutPlans(workoutPlans.filter((p) => p.id !== selectedPlan.id));
      setShowDeleteConfirmation(false);
      setSelectedPlan(null);
      Alert.alert("Success", "Workout plan deleted successfully");
    } catch (err) {
      console.error("Error deleting workout plan:", err);
      Alert.alert("Error", "Failed to delete workout plan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePlan = async () => {
    // Validate form with specific field validation
    const missingFields = [];

    if (!formData.name.trim()) {
      missingFields.push("Plan Name");
    }

    if (!formData.description.trim()) {
      missingFields.push("Description");
    }

    if (!formData.durationMinutes) {
      missingFields.push("Duration");
    }

    if (!formData.caloriesBurned) {
      missingFields.push("Calories Burned");
    }

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in the following required fields:\n\n${missingFields.join("\n")}`,
      );
      return;
    }

    // Validate that at least one exercise is added
    if (formData.exercises.length === 0) {
      Alert.alert(
        "No Exercises Added",
        "Your workout plan must include at least one exercise. Please add exercises using the exercise selector below.",
      );
      return;
    }
    const trainerId = await AsyncStorage.getItem('user_id');

    if (trainerId === null) {
      throw new Error('Trainer ID not found in storage');
    }
    const parsedTrainerId = parseInt(trainerId, 10);

    try {
      setIsSaving(true);
      const planData = {
        createdBy: parsedTrainerId,
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        durationMinutes: parseInt(formData.durationMinutes),
        caloriesBurned: parseInt(formData.caloriesBurned),
        exercises: formData.exercises.map((e) => ({
          id: e.id,
          sets: e.sets,
          reps: e.reps,
        })),
      };

      let response;
      if (isEditing && selectedPlan) {
        response = await trainerApi.updateWorkoutPlan(
          selectedPlan.id,
          planData,
        );

      } else {
        response = await trainerApi.createWorkoutPlan(planData);
      }

      setShowPlanModal(false);
      fetchWorkoutPlans()
      Alert.alert(
        "Success",
        `Workout plan ${isEditing ? "updated" : "created"} successfully`,
      );
    } catch (err) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} workout plan:`,
        err,
      );
      Alert.alert(
        "Error",
        `Failed to ${isEditing ? "update" : "create"} workout plan`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewPlan = (plan: WorkoutPlan) => {
    fetchPlanDetails(plan.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-600";
      case "intermediate":
        return "text-yellow-600";
      case "advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <View className="flex-1 bg-pink-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">Workout Plans</Text>
          <TouchableOpacity
            className="bg-pink-600 py-2 px-3 rounded-lg flex-row items-center"
            onPress={handleCreatePlan}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Create Plan</Text>
          </TouchableOpacity>
        </View>

        {loading &&
          !showPlanModal &&
          !showDeleteConfirmation &&
          !showPlanDetails && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#be185d" />
              <Text className="text-gray-600 mt-2">
                Loading workout plans...
              </Text>
            </View>
          )}

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity
              className="self-end mt-2"
              onPress={fetchWorkoutPlans}
            >
              <Text className="text-pink-700 font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView className="mb-4">
          {workoutPlans.map((plan) => (
            <View
              key={plan.id}
              className="bg-white mb-3 rounded-xl shadow-sm overflow-hidden"
            >
              <TouchableOpacity
                className="p-4"
                onPress={() => handleViewPlan(plan)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-gray-800">
                    {plan.name}
                  </Text>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>

                <Text className="text-gray-600 mb-2" numberOfLines={2}>
                  {plan.description}
                </Text>

                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center">
                    <Clock size={16} color="#be185d" />
                    <Text className="text-gray-700 ml-1">
                      {plan.durationMinutes} min
                    </Text>
                  </View>

                  <View className="flex-row items-center mx-2">
                    <Flame size={16} color="#be185d" />
                    <Text className="text-gray-700 ml-1">
                      {plan.caloriesBurned} cal
                    </Text>
                  </View>

                  <Text
                    className={`${getDifficultyColor(plan.difficulty)} font-medium`}
                  >
                    {plan.difficulty}
                  </Text>
                </View>
              </TouchableOpacity>

              <View className="flex-row border-t border-gray-100">
                <TouchableOpacity
                  className="flex-1 py-2 flex-row justify-center items-center"
                  onPress={() => handleEditPlan(plan)}
                >
                  <Edit2 size={16} color="#be185d" />
                  <Text className="text-pink-800 font-medium ml-1">Edit</Text>
                </TouchableOpacity>

                <View className="w-px bg-gray-100" />

                <TouchableOpacity
                  className="flex-1 py-2 flex-row justify-center items-center"
                  onPress={() => handleDeletePlan(plan)}
                >
                  <Trash2 size={16} color="#dc2626" />
                  <Text className="text-red-600 font-medium ml-1">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {workoutPlans.length === 0 && !loading && (
            <View className="bg-white p-6 rounded-xl items-center justify-center">
              <Dumbbell size={40} color="#d1d5db" />
              <Text className="text-gray-500 mt-2 text-center">
                No workout plans found. Create your first plan to get started.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Create/Edit Plan Modal */}
      <Modal
        visible={showPlanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-xl p-5 max-h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-pink-800">
                {isEditing ? "Edit Workout Plan" : "Create Workout Plan"}
              </Text>
              <TouchableOpacity onPress={() => setShowPlanModal(false)}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96">
              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Plan Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="e.g. Full Body Strength"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-gray-500 mt-1">Required</Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Description <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  placeholder="Describe the workout plan"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <Text className="text-xs text-gray-500 mt-1">Required</Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Difficulty
                </Text>
                <View className="flex-row justify-between">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`flex-1 p-2 rounded-lg mx-1 ${formData.difficulty === level ? "bg-pink-600" : "bg-gray-200"}`}
                      onPress={() =>
                        setFormData({ ...formData, difficulty: level })
                      }
                    >
                      <Text
                        className={`text-center font-medium ${formData.difficulty === level ? "text-white" : "text-gray-700"}`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-gray-700 mb-1 font-medium">
                    Duration (min)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 text-gray-800"
                    value={formData.durationMinutes}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        durationMinutes: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    placeholder="45"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text className="text-xs text-gray-500 mt-1">Required</Text>
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-700 mb-1 font-medium">
                    Calories Burned
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 text-gray-800"
                    value={formData.caloriesBurned}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        caloriesBurned: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    placeholder="300"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text className="text-xs text-gray-500 mt-1">Required</Text>
                </View>
              </View>

              {/* Exercise Selection */}
              <View className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-lg font-semibold text-pink-800">
                    Exercises
                  </Text>
                  <Text className="text-red-500 ml-1">*</Text>
                  <Text className="text-xs text-gray-500 ml-2">
                    (At least one required)
                  </Text>
                </View>

                {/* Current Exercises List */}
                {formData.exercises.length > 0 ? (
                  <View className="mb-4">
                    {formData.exercises.map((exercise, index) => (
                      <View
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg mb-2 flex-row justify-between items-center"
                      >
                        <View>
                          <Text className="font-medium text-gray-800">
                            {exercise.name}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {exercise.sets} sets × {exercise.reps} reps
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setFormData({
                              ...formData,
                              exercises: formData.exercises.filter(
                                (_, i) => i !== index,
                              ),
                            });
                          }}
                        >
                          <Trash2 size={18} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-lg mb-4 items-center">
                    <Text className="text-gray-500">
                      No exercises added yet
                    </Text>
                  </View>
                )}

                {/* Add Exercise Section */}
                <View className="bg-white border border-gray-200 rounded-lg p-4">
                  <Text className="font-medium text-gray-700 mb-3">
                    Add Exercise
                  </Text>

                  {/* Exercise Dropdown */}
                  <View className="mb-3">
                    <Text className="text-gray-600 mb-1">Select Exercise</Text>
                    <TouchableOpacity
                      className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"
                      onPress={(event) => {
                        const target = event.target as any;
                        target.measure((x, y, width, height, pageX, pageY) => {
                          setDropdownPosition({
                            top: pageY + height,
                            left: pageX,
                            width: width,
                          });
                          setShowExerciseDropdown(true);
                        });
                      }}
                    >
                      <Text className="text-gray-800">
                        {selectedExercise
                          ? selectedExercise.name
                          : "Select an exercise"}
                      </Text>
                      <ChevronDown size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <Modal
                      visible={showExerciseDropdown}
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => setShowExerciseDropdown(false)}
                    >
                      <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setShowExerciseDropdown(false)}
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
                          {loadingExercises ? (
                            <View className="p-3 items-center">
                              <ActivityIndicator size="small" color="#be185d" />
                              <Text className="text-gray-500 mt-1">
                                Loading exercises...
                              </Text>
                            </View>
                          ) : (
                            availableExercises.map((exercise) => (
                              <TouchableOpacity
                                key={exercise.id}
                                className={`p-3 border-b border-gray-100 ${selectedExercise?.id === exercise.id ? "bg-pink-50" : ""}`}
                                onPress={() => {
                                  setSelectedExercise(exercise);
                                  setExerciseSets(
                                    exercise.sets?.toString() || "3",
                                  );
                                  setExerciseReps(
                                    exercise.reps?.toString() || "10",
                                  );
                                  setShowExerciseDropdown(false);
                                }}
                              >
                                <Text
                                  className={`${selectedExercise?.id === exercise.id ? "text-pink-600 font-medium" : "text-gray-800"}`}
                                >
                                  {exercise.name}
                                </Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  </View>

                  {/* Sets and Reps Inputs */}
                  <View className="flex-row mb-3">
                    <View className="flex-1 mr-2">
                      <Text className="text-gray-600 mb-1">
                        Sets <Text className="text-red-500">*</Text>
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-2 text-gray-800"
                        value={exerciseSets}
                        onChangeText={(text) =>
                          setExerciseSets(text.replace(/[^0-9]/g, ""))
                        }
                        keyboardType="numeric"
                        placeholder="3"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-600 mb-1">
                        Reps <Text className="text-red-500">*</Text>
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-2 text-gray-800"
                        value={exerciseReps}
                        onChangeText={(text) =>
                          setExerciseReps(text.replace(/[^0-9]/g, ""))
                        }
                        keyboardType="numeric"
                        placeholder="10"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>

                  {/* Add Exercise Button */}
                  <TouchableOpacity
                    className={`bg-pink-600 py-2 rounded-lg items-center ${!selectedExercise ? "opacity-50" : ""}`}
                    disabled={!selectedExercise}
                    onPress={() => {
                      if (!selectedExercise) {
                        Alert.alert(
                          "No Exercise Selected",
                          "Please select an exercise from the dropdown first.",
                        );
                        return;
                      }

                      if (!exerciseSets || parseInt(exerciseSets) <= 0) {
                        Alert.alert(
                          "Invalid Sets",
                          "Please enter a valid number of sets (greater than 0).",
                        );
                        return;
                      }

                      if (!exerciseReps || parseInt(exerciseReps) <= 0) {
                        Alert.alert(
                          "Invalid Reps",
                          "Please enter a valid number of reps (greater than 0).",
                        );
                        return;
                      }
                      if (selectedExercise) {
                        const newExercise = {
                          id: selectedExercise.id,
                          name: selectedExercise.name,
                          sets: parseInt(exerciseSets) || 3,
                          reps: parseInt(exerciseReps) || 10,
                          imageUrl: selectedExercise.imageUrl,
                          instructions: selectedExercise.instructions,
                        };

                        setFormData({
                          ...formData,
                          exercises: [...formData.exercises, newExercise],
                        });

                        // Reset selection
                        setSelectedExercise(null);
                        setExerciseSets("");
                        setExerciseReps("");
                      }
                    }}
                  >
                    <Text className="text-white font-medium">Add Exercise</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => setShowPlanModal(false)}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-pink-600 py-2 px-4 rounded-lg flex-row items-center ${isSaving ? "opacity-70" : ""}`}
                onPress={handleSavePlan}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-medium ml-2">
                      Saving...
                    </Text>
                  </>
                ) : (
                  <>
                    <Save size={16} color="white" />
                    <Text className="text-white font-medium ml-1">
                      Save Plan
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirmation(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 rounded-xl p-5">
            <Text className="text-xl font-bold text-pink-800 mb-2">
              Delete Workout Plan
            </Text>
            <Text className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedPlan?.name}"? This
              action cannot be undone.
            </Text>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => setShowDeleteConfirmation(false)}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-red-600 py-2 px-4 rounded-lg ${isSaving ? "opacity-70" : ""}`}
                onPress={confirmDeletePlan}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Plan Details Modal */}
      <Modal
        visible={showPlanDetails}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowPlanDetails(false)}
      >
        <View className="flex-1 bg-pink-50">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowPlanDetails(false)}>
              <X size={24} color="#be185d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-pink-800 ml-4">
              Workout Plan Details
            </Text>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#be185d" />
              <Text className="text-gray-600 mt-2">
                Loading plan details...
              </Text>
            </View>
          ) : selectedPlan ? (
            <ScrollView className="flex-1">
              {/* Plan Header */}
              <View className="bg-pink-800 p-6">
                <Text className="text-2xl font-bold text-white mb-2">
                  {selectedPlan.name}
                </Text>
                <View className="flex-row mt-2">
                  <View className="flex-row items-center mr-4">
                    <Clock size={16} color="#f9a8d4" />
                    <Text className="text-pink-200 ml-1">
                      {selectedPlan.durationMinutes} min
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Flame size={16} color="#f9a8d4" />
                    <Text className="text-pink-200 ml-1">
                      {selectedPlan.caloriesBurned} cal
                    </Text>
                  </View>
                </View>
                <Text className="text-pink-200 mt-2">
                  {selectedPlan.difficulty}
                </Text>
              </View>

              {/* Plan Description */}
              <View className="p-4 bg-white mb-4">
                <Text className="text-gray-700">
                  {selectedPlan.description}
                </Text>
              </View>

              {/* Exercise List */}
              <View className="p-4">
                <Text className="text-xl font-bold text-pink-800 mb-4">
                  Exercises
                </Text>

                {selectedPlan.exercises && selectedPlan.exercises.length > 0 ? (
                  selectedPlan.exercises.map((exercise) => (
                    <View
                      key={exercise.id}
                      className="bg-white rounded-xl shadow-sm mb-4 p-4"
                    >
                      <Text className="text-lg font-bold text-gray-800 mb-1">
                        {exercise.name}
                      </Text>
                      <Text className="text-pink-600 font-medium mb-2">
                        {exercise.sets} sets × {exercise.reps}{" "}
                        {exercise.reps > 1 ? "reps" : "rep"}
                      </Text>
                      {exercise.instructions && (
                        <Text className="text-gray-600">
                          {exercise.instructions}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <View className="bg-white p-6 rounded-xl items-center justify-center">
                    <Dumbbell size={40} color="#d1d5db" />
                    <Text className="text-gray-500 mt-2 text-center">
                      No exercises found in this workout plan.
                    </Text>
                  </View>
                )}
              </View>

              {/* Edit Button */}
              <View className="p-4 mb-8">
                <TouchableOpacity
                  className="bg-pink-600 py-3 rounded-xl flex-row justify-center items-center"
                  onPress={() => {
                    setShowPlanDetails(false);
                    handleEditPlan(selectedPlan);
                  }}
                >
                  <Edit2 size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Edit Workout Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-gray-600 text-center">
                Plan details not available. Please try again.
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutPlanManager;
