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
  Image,
} from "react-native";
import {
  Dumbbell,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
  ChevronRight,
  ImageIcon,
} from "lucide-react-native";
import { trainerApi } from "../services/api";

interface Exercise {
  id: string | number;
  name: string;
  description: string;
  imageUrl?: string;
  instructions: string;
}

const ExerciseManager = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    imageUrl: string;
    instructions: string;
  }>({
    name: "",
    description: "",
    imageUrl: "",
    instructions: "",
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the API to get exercises
      const data = await trainerApi.getExercises();
      setExercises(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setError("Failed to load exercises. Please try again.");

      // Fallback to mock data if API fails
      setExercises([
        {
          id: "1",
          name: "Squats",
          description:
            "Lower body compound exercise targeting quadriceps, hamstrings, and glutes",
          imageUrl:
            "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&q=80",
          instructions:
            "Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing.",
        },
        {
          id: "2",
          name: "Push-ups",
          description:
            "Upper body exercise that works the chest, shoulders, and triceps",
          imageUrl:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
          instructions:
            "Start in plank position with hands slightly wider than shoulders, lower chest to ground, then push back up.",
        },
        {
          id: "3",
          name: "Lunges",
          description:
            "Lower body exercise that targets the quadriceps, hamstrings, and glutes",
          imageUrl:
            "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
          instructions:
            "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees, then return to standing.",
        },
        {
          id: "4",
          name: "Plank",
          description:
            "Core exercise that strengthens the abdominals, back, and shoulders",
          imageUrl:
            "https://images.unsplash.com/photo-1566351557863-467d204a9f8f?w=400&q=80",
          instructions:
            "Hold a push-up position with your body in a straight line from head to heels for the specified time.",
        },
        {
          id: "5",
          name: "Deadlift",
          description:
            "Compound exercise that works the entire posterior chain",
          imageUrl:
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
          instructions:
            "Stand with feet hip-width apart, bend at hips and knees to lower and grip the bar, then stand up by driving through the heels.",
        },
      ]);
      setLoading(false);
    }
  };

  const handleCreateExercise = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      instructions: "",
    });
    setShowExerciseModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setIsEditing(true);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      imageUrl: exercise.imageUrl || "",
      instructions: exercise.instructions,
    });
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteExercise = async () => {
    if (!selectedExercise) return;

    try {
      setIsSaving(true);
      // Call the API to delete the exercise
      await trainerApi.deleteExercise(selectedExercise.id);

      // Update local state after successful deletion
      setExercises(exercises.filter((e) => e.id !== selectedExercise.id));
      setShowDeleteConfirmation(false);
      setSelectedExercise(null);
      Alert.alert("Success", "Exercise deleted successfully");
    } catch (err) {
      console.error("Error deleting exercise:", err);
      Alert.alert("Error", "Failed to delete exercise");

      // If API fails but we want to update UI anyway (optimistic update)
      setExercises(exercises.filter((e) => e.id !== selectedExercise.id));
      setShowDeleteConfirmation(false);
      setSelectedExercise(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExercise = async () => {
    // Validate form
    if (!formData.name || !formData.description || !formData.instructions) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);

      let response;
      if (isEditing && selectedExercise) {
        // Update existing exercise
        response = await trainerApi.updateExercise(
          selectedExercise.id,
          formData,
        );
        setExercises(
          exercises.map((e) => (e.id === selectedExercise.id ? response : e)),
        );
      } else {
        // Create new exercise
        response = await trainerApi.createExercise(formData);
        setExercises([...exercises, response]);
      }

      setShowExerciseModal(false);
      Alert.alert(
        "Success",
        `Exercise ${isEditing ? "updated" : "created"} successfully`,
      );
    } catch (err) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} exercise:`,
        err,
      );
      Alert.alert(
        "Error",
        `Failed to ${isEditing ? "update" : "create"} exercise`,
      );

      // Fallback to local update if API fails
      try {
        if (isEditing && selectedExercise) {
          setExercises(
            exercises.map((e) =>
              e.id === selectedExercise.id
                ? { ...formData, id: selectedExercise.id }
                : e,
            ),
          );
        } else {
          const newExercise = {
            ...formData,
            id: Date.now().toString(),
          };
          setExercises([...exercises, newExercise]);
        }
        setShowExerciseModal(false);
      } catch (localError) {
        console.error("Error updating local state:", localError);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewExercise = async (exercise: Exercise) => {
    try {
      setLoading(true);
      // Get detailed exercise information from API
      const detailedExercise = await trainerApi.getExercise(exercise.id);
      setSelectedExercise(detailedExercise);
      setShowExerciseDetails(true);
    } catch (err) {
      console.error("Error fetching exercise details:", err);
      // Fallback to using the exercise data we already have
      setSelectedExercise(exercise);
      setShowExerciseDetails(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }} className="bg-pink-50">
      <View style={{ flex: 1, height: "auto" }} className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">Exercises</Text>
          <TouchableOpacity
            className="bg-pink-600 py-2 px-3 rounded-lg flex-row items-center"
            onPress={handleCreateExercise}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Create Exercise</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>

        {loading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#be185d" />
            <Text className="text-gray-600 mt-2">Loading exercises...</Text>
          </View>
        )}

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity
              className="self-end mt-2"
              onPress={fetchExercises}
            >
              <Text className="text-pink-700 font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={true}
          scrollEnabled={true}
        >
          {filteredExercises.map((exercise) => (
            <View
              key={exercise.id}
              className="bg-white mb-3 rounded-xl shadow-sm overflow-hidden"
            >
              <TouchableOpacity
                className="p-4"
                onPress={() => handleViewExercise(exercise)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-gray-800">
                    {exercise.name}
                  </Text>
                  <ChevronRight size={20} color="#9ca3af" />
                </View>

                <Text className="text-gray-600 mb-2" numberOfLines={2}>
                  {exercise.description}
                </Text>

                {exercise.imageUrl && (
                  <View className="h-40 rounded-lg overflow-hidden mb-2">
                    <Image
                      source={{ uri: exercise.imageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View className="flex-row border-t border-gray-100">
                <TouchableOpacity
                  className="flex-1 py-2 flex-row justify-center items-center"
                  onPress={() => handleEditExercise(exercise)}
                >
                  <Edit2 size={16} color="#be185d" />
                  <Text className="text-pink-800 font-medium ml-1">Edit</Text>
                </TouchableOpacity>

                <View className="w-px bg-gray-100" />

                <TouchableOpacity
                  className="flex-1 py-2 flex-row justify-center items-center"
                  onPress={() => handleDeleteExercise(exercise)}
                >
                  <Trash2 size={16} color="#dc2626" />
                  <Text className="text-red-600 font-medium ml-1">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredExercises.length === 0 && !loading && (
            <View className="bg-white p-6 rounded-xl items-center justify-center">
              <Dumbbell size={40} color="#d1d5db" />
              <Text className="text-gray-500 mt-2 text-center">
                No exercises found. Create your first exercise to get started.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Create/Edit Exercise Modal */}
      <Modal
        visible={showExerciseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-xl p-5 max-h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-pink-800">
                {isEditing ? "Edit Exercise" : "Create Exercise"}
              </Text>
              <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96">
              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Exercise Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="e.g. Squats"
                />
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
                  placeholder="Brief description of the exercise"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Image URL
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={formData.imageUrl}
                  onChangeText={(text) =>
                    setFormData({ ...formData, imageUrl: text })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Instructions <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 text-gray-800"
                  value={formData.instructions}
                  onChangeText={(text) =>
                    setFormData({ ...formData, instructions: text })
                  }
                  placeholder="Step-by-step instructions for performing the exercise"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={() => setShowExerciseModal(false)}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-pink-600 py-2 px-4 rounded-lg flex-row items-center ${isSaving ? "opacity-70" : ""}`}
                onPress={handleSaveExercise}
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
                      Save Exercise
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
              Delete Exercise
            </Text>
            <Text className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedExercise?.name}"? This
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
                onPress={confirmDeleteExercise}
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

      {/* Exercise Details Modal */}
      <Modal
        visible={showExerciseDetails}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowExerciseDetails(false)}
      >
        <View className="flex-1 bg-pink-50">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowExerciseDetails(false)}>
              <X size={24} color="#be185d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-pink-800 ml-4">
              Exercise Details
            </Text>
          </View>

          {selectedExercise && (
            <ScrollView className="flex-1">
              {/* Exercise Header */}
              <View className="bg-pink-800 p-6">
                <Text className="text-2xl font-bold text-white mb-2">
                  {selectedExercise.name}
                </Text>
              </View>

              {/* Exercise Image */}
              {selectedExercise.imageUrl ? (
                <View className="h-64 bg-gray-200">
                  <Image
                    source={{ uri: selectedExercise.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="h-64 bg-gray-200 items-center justify-center">
                  <ImageIcon size={64} color="#d1d5db" />
                  <Text className="text-gray-500 mt-2">No image available</Text>
                </View>
              )}

              {/* Exercise Description */}
              <View className="p-4 bg-white mb-4">
                <Text className="text-lg font-semibold text-pink-800 mb-2">
                  Description
                </Text>
                <Text className="text-gray-700">
                  {selectedExercise.description}
                </Text>
              </View>

              {/* Exercise Instructions */}
              <View className="p-4 bg-white mb-8">
                <Text className="text-lg font-semibold text-pink-800 mb-2">
                  Instructions
                </Text>
                <Text className="text-gray-700">
                  {selectedExercise.instructions}
                </Text>
              </View>

              {/* Edit Button */}
              <View className="p-4 mb-8">
                <TouchableOpacity
                  className="bg-pink-600 py-3 rounded-xl flex-row justify-center items-center"
                  onPress={() => {
                    setShowExerciseDetails(false);
                    handleEditExercise(selectedExercise);
                  }}
                >
                  <Edit2 size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Edit Exercise
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ExerciseManager;
