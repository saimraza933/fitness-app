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
  Soup,
  CupSoda,
  Gauge,
  Drumstick,
} from "lucide-react-native";
import { trainerApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DietPlanModal from "./DietPlanModal";
import { useAppSelector } from "../hooks/redux";

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

const mockPlans = [
  {
    "id": 1,
    "name": "High-Protein Power",
    "description": "Boost muscle recovery",
    "totalCalories": 2200,
    "proteinPercentage": 40.00,
    "carbsPercentage": 30.00,
    "fatPercentage": 30.00,
  }
]

const DietPlanManager = () => {
  const { userId } = useAppSelector(state => state.auth)
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<any>(null)
  const [planToEdit, setPlanToEdit] = useState(null)
  const [dietPlansList, setDietPlansList] = useState([])
  const [error, setError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchDietPlans()
  }, []);


  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      // console.log(userId)
      const res = await trainerApi.getTrainerDietPlans(Number(userId))
      // console.log(res)
      if (Array.isArray(res)) {
        setDietPlansList(res)
      }
    } catch (error) {
      setError('Error fetching diet plans.')
    } finally {
      setLoading(false);
    }
  }


  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    setIsSaving(true)
    try {
      await trainerApi.deleteDietPlan(Number(planToDelete?.id))
      handleCloseDeleteDialog()
      fetchDietPlans()
      Alert.alert("Success", "Diet plan deleted successfully");
    } catch (err) {
      Alert.alert("Error", "Error deleting diet plan.");
    } finally {
      setIsSaving(false)
    }
  };


  const handleOpenDialog = (plan: any) => {
    setPlanToEdit(plan)
    setOpenModal(true)
  }

  const handleCloseDialog = () => {
    setPlanToEdit(null)
    setOpenModal(false)
  }

  const handleOpenDeleteDialog = (plan: any) => {
    setPlanToDelete(plan)
    setShowDeleteConfirmation(true)
  }

  const handleCloseDeleteDialog = () => {
    setPlanToDelete(null)
    setShowDeleteConfirmation(false)
  }

  return (
    <View className="flex-1 bg-pink-50">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">Diet Plans</Text>
          <TouchableOpacity
            className="bg-pink-600 py-2 px-3 rounded-lg flex-row items-center"
            onPress={() => handleOpenDialog(null)}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Create Plan</Text>
          </TouchableOpacity>
        </View>

        {loading &&
          !showDeleteConfirmation && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#be185d" />
              <Text className="text-gray-600 mt-2">
                Loading diet plans...
              </Text>
            </View>
          )}

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity
              className="self-end mt-2"
              onPress={fetchDietPlans}
            >
              <Text className="text-pink-700 font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {
          dietPlansList?.length > 0 && (
            <ScrollView className="mb-4">
              {dietPlansList.map((plan: any) => (
                <View
                  key={plan.id}
                  className="bg-white mb-3 rounded-xl shadow-sm overflow-hidden"
                >
                  <View
                    className="p-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-lg font-semibold text-gray-800">
                        {plan.name}
                      </Text>
                    </View>

                    <Text className="text-gray-600 mb-2" numberOfLines={2}>
                      {plan.description}
                    </Text>

                    <View className="flex-row justify-between mt-2">
                      {/* Protein */}
                      <View className="flex-row items-center">
                        <Drumstick size={16} color="#be185d" />
                        <Text className="text-gray-700 ml-1">
                          {plan.proteinPercentage} %
                        </Text>
                      </View>

                      {/* Calories */}
                      <View className="flex-row items-center mx-2">
                        <Gauge size={16} color="#be185d" />
                        <Text className="text-gray-700 ml-1">
                          {plan.totalCalories} kcal
                        </Text>
                      </View>

                      {/* Carbs */}
                      <View className="flex-row items-center mx-2">
                        <CupSoda size={16} color="#be185d" />
                        <Text className="text-gray-700 ml-1">
                          {plan.carbsPercentage} %
                        </Text>
                      </View>

                      {/* Fats */}
                      <View className="flex-row items-center mx-2">
                        <Soup size={16} color="#be185d" />
                        <Text className="text-gray-700 ml-1">
                          {plan.fatPercentage} %
                        </Text>
                      </View>
                    </View>

                  </View>

                  <View className="flex-row border-t border-gray-100">
                    <TouchableOpacity
                      className="flex-1 py-2 flex-row justify-center items-center"
                      onPress={() => handleOpenDialog(plan)}
                    >
                      <Edit2 size={16} color="#be185d" />
                      <Text className="text-pink-800 font-medium ml-1">Edit</Text>
                    </TouchableOpacity>

                    <View className="w-px bg-gray-100" />

                    <TouchableOpacity
                      className="flex-1 py-2 flex-row justify-center items-center"
                      onPress={() => handleOpenDeleteDialog(plan)}
                    >
                      <Trash2 size={16} color="#dc2626" />
                      <Text className="text-red-600 font-medium ml-1">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}


            </ScrollView>
          )
        }
        {dietPlansList.length === 0 && !loading && (
          <View className="bg-white p-6 rounded-xl items-center justify-center">
            <Dumbbell size={40} color="#d1d5db" />
            <Text className="text-gray-500 mt-2 text-center">
              No diet plans found. Create your first plan to get started.
            </Text>
          </View>
        )}
      </View>


      <DietPlanModal
        visible={openModal}
        onClose={handleCloseDialog}
        fetchPlans={fetchDietPlans}
        plantoEdit={planToEdit}
      />
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDeleteDialog}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 rounded-xl p-5">
            <Text className="text-xl font-bold text-pink-800 mb-2">
              Delete diet Plan
            </Text>
            <Text className="text-gray-700 mb-4">
              Are you sure you want to delete "{planToDelete?.name}"? This
              action cannot be undone.
            </Text>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={handleCloseDeleteDialog}
                disabled={isSaving}
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

    </View>
  );
};

export default DietPlanManager;
