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
import AsyncStorage from "@react-native-async-storage/async-storage";
import MealModal from "./MealModal";
import MealCard from "./MealCard";
import { useAppSelector } from "../hooks/redux";


const mockMeals = [
  {
    "id": 1,
    "dietPlanId": 1,
    "name": "Protein Pancakes",
    "time": "08:00:00",
    "description": "Whey-based pancakes",
    "calories": 550,
    "protein": 45.00,
    "carbs": 40.00,
    "fat": 15.00,
    "fiber": 5.00,
    "imageUrl": "https://img.freepik.com/free-psd/roasted-chicken-dinner-platter-delicious-feast_632498-25445.jpg",
    "ingredients": [
      { "name": "Whey Powder", "quantity": "30 g" },
      { "name": "Oats", "quantity": "50 g" }
    ]
  }
]

const mockPlanData = [
  {
    "id": 1,
    "name": "High-Protein Power",
    "description": "Boost muscle recovery",
    "totalCalories": 2200,
    "proteinPercentage": 40.00,
    "carbsPercentage": 30.00,
    "fatPercentage": 30.00,
  },
]

const MealsManager = () => {
  const { userId } = useAppSelector(state => state.auth)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>('');
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealsList, setMealsList] = useState<any>([])
  const [mealToEdit, setMealToEdit] = useState<any>(null)
  const [mealToDelete, setMealToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [dietPlansList, setDietPlansList] = useState<any>([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchMeals(),
        fetchDietPlans()
      ])
    })()

  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const response = await trainerApi.getTrainerMeals(Number(userId))

      if (Array.isArray(response)) {
        setMealsList(response)
        console.log(response)
      }
    } catch (error) {
      // setError('Error loading meals. Try again')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDietPlans = async () => {
    try {
      const res = await trainerApi.getTrainerDietPlans(Number(userId))
      if (Array.isArray(res)) {
        setDietPlansList(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    setMealToEdit(null)
    setShowMealModal(false)
  }

  const handleOpenModal = (meal: any) => {
    setMealToEdit(meal);
    setShowMealModal(true);
  };

  const handleShowDelete = (meal: any) => {
    setMealToDelete(meal)
    setShowDeleteConfirmation(true)
  }

  const handleCloseDelete = () => {
    setMealToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setIsDeleting(true)
      await trainerApi.deleteMeal(mealToDelete?.id)
      handleCloseDelete()
      fetchMeals()
    } catch (error) {
      Alert.alert('Error', "Error deleting meal")
    } finally {
      setIsDeleting(false)
    }
  };


  // const filteredMeals = mealsList?.filter((meal: any) =>
  //   meal?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
  // );
  // const filteredMeals = mealsList?.filter((meal: any) =>
  //   meal?.name?.toLowerCase().includes(searchQuery?.toLowerCase()),
  // );

  // const filteredMeals = [...mealsList]



  return (
    <View style={{ flex: 1 }} className="bg-pink-50">
      <View style={{ flex: 1, height: "auto" }} className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-pink-800">Meals</Text>
          <TouchableOpacity
            className="bg-pink-600 py-2 px-3 rounded-lg flex-row items-center"
            onPress={() => handleOpenModal(null)}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-1">Create Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {/* <View className="mb-4">
          <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search meals..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View> */}

        {loading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#be185d" />
            <Text className="text-gray-600 mt-2">Loading meals...</Text>
          </View>
        )}

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity
              className="self-end mt-2"
              onPress={fetchMeals}
            >
              <Text className="text-pink-700 font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        {
          mealsList?.length > 0 && (
            <ScrollView
              style={{ flex: 1, backgroundColor: "transparent" }}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={true}
              alwaysBounceVertical={true}
              scrollEnabled={true}
            >

              {
                mealsList?.map((item: any) => (
                  item.meals.map((meal: any, index: any) => (
                    <View
                      key={index}
                      className="bg-white mb-3 rounded-xl shadow-sm overflow-hidden"
                    >
                      <MealCard
                        meal={{ dietPlanId: item?.dietPlanId, ...meal }}
                      />
                      <View className="flex-row ">
                        <TouchableOpacity
                          className="flex-1 py-2 flex-row justify-center items-center"
                          onPress={() => handleOpenModal({ dietPlanId: item?.dietPlanId, ...meal })}
                        >
                          <Edit2 size={16} color="#be185d" />
                          <Text className="text-pink-800 font-medium ml-1">Edit </Text>
                        </TouchableOpacity>

                        <View className="w-px bg-gray-100" />

                        <TouchableOpacity
                          className="flex-1 py-2 flex-row justify-center items-center"
                          onPress={() => handleShowDelete({ dietPlanId: item?.dietPlanId, ...meal })}
                        >
                          <Trash2 size={16} color="#dc2626" />
                          <Text className="text-red-600 font-medium ml-1">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ))
              }

              {mealsList.length === 0 && !loading && (
                <View className="bg-white p-6 rounded-xl items-center justify-center">
                  <Dumbbell size={40} color="#d1d5db" />
                  <Text className="text-gray-500 mt-2 text-center">
                    No meals found. Create your first meal to get started.
                  </Text>
                </View>
              )}
            </ScrollView>
          )
        }


      </View>

      <MealModal
        visible={showMealModal}
        onClose={handleCloseModal}
        mealToEdit={mealToEdit}
        fetchMeals={fetchMeals}
        dietPlansList={dietPlansList}
      />

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
              Delete Meal
            </Text>
            <Text className="text-gray-700 mb-4">
              Are you sure you want to delete "{mealToDelete?.name}"? This
              action cannot be undone.
            </Text>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 py-2 px-4 rounded-lg mr-2"
                onPress={handleCloseDelete}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-red-600 py-2 px-4 rounded-lg ${isDeleting ? "opacity-70" : ""}`}
                onPress={handleDeleteConfirmation}
                disabled={isDeleting}
              >
                {isDeleting ? (
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
      {/* <Modal
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

              <View className="bg-pink-800 p-6">
                <Text className="text-2xl font-bold text-white mb-2">
                  {selectedExercise.name}
                </Text>
              </View>

        
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

              
              <View className="p-4 bg-white mb-4">
                <Text className="text-lg font-semibold text-pink-800 mb-2">
                  Description
                </Text>
                <Text className="text-gray-700">
                  {selectedExercise.description}
                </Text>
              </View>

         
              <View className="p-4 bg-white mb-8">
                <Text className="text-lg font-semibold text-pink-800 mb-2">
                  Instructions
                </Text>
                <Text className="text-gray-700">
                  {selectedExercise.instructions}
                </Text>
              </View>

             
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
      </Modal> */}
    </View>
  );
};

export default MealsManager;
