import { ChevronDown, Save, Scroll, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, findNodeHandle, UIManager, ScrollView, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { trainerApi } from '../services/api';

interface DietPlanModalProps {
  visible: boolean;
  onClose: () => void;
  fetchPlans: () => void;
  plantoEdit?: any | null;
}

const mockMealData = [
  {
    "id": 1,
    "name": "Protein Pancakes",
    "time": "08:00:00",
    "description": "Whey-based pancakes",
    "calories": 550,
    "protein": 45.00,
    "carbs": 40.00,
    "fat": 15.00,
    "fiber": 5.00,
    "imageUrl": "/uploads/meals/pancakes.png",
    "ingredients": [
      { "name": "Whey Powder", "quantity": "30 g" },
      { "name": "Oats", "quantity": "50 g" }
    ]
  },
  {
    "id": 2,
    "name": "Test Meal",
    "time": "08:00:00",
    "description": "Whey-based pancakes",
    "calories": 550,
    "protein": 45.00,
    "carbs": 40.00,
    "fat": 15.00,
    "fiber": 5.00,
    "imageUrl": "/uploads/meals/pancakes.png",
    "ingredients": [
      { "name": "Whey Powder", "quantity": "30 g" },
      { "name": "Oats", "quantity": "50 g" }
    ]
  }
]

const Label = ({ label, required = false }: { label: string, required?: boolean }) => {
  const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <Text className="text-gray-700 mb-1 font-medium">
      {capitalizeFirst(label)} {required && <Text className="text-red-500">*</Text>}
    </Text>
  );
};

const DietPlanModal = ({ visible, onClose, fetchPlans, plantoEdit }: DietPlanModalProps) => {
  const isEditing = !!plantoEdit
  const dropDownButtonRef = useRef(null);
  const { userId } = useAppSelector(state => state.auth)
  // const [name, setName] = useState(plantoEdit?.name || '');
  // const [description, setDescription] = useState(plantoEdit?.description || '');
  // const [totalCalories, setTotalCalories] = useState(plantoEdit?.totalCalories?.toString() || '');
  // const [proteinPercentage, setProteinPercentage] = useState(plantoEdit?.proteinPercentage?.toString() || '');
  // const [carbsPercentage, setCarbsPercentage] = useState(plantoEdit?.carbsPercentage?.toString() || '');
  // const [fatPercentage, setFatPercentage] = useState(plantoEdit?.fatPercentage?.toString() || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalCalories, setTotalCalories] = useState('');
  const [proteinPercentage, setProteinPercentage] = useState('');
  const [carbsPercentage, setCarbsPercentage] = useState('');
  const [fatPercentage, setFatPercentage] = useState('');
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [mealsList, setMealsList] = useState(mockMealData)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [showDropDown, setShowDropDown] = useState(false)
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [selectedMealsList, setSelectedMealsList] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      setName(plantoEdit?.name)
      setDescription(plantoEdit?.description)
      setTotalCalories(plantoEdit?.totalCalories?.toString())
      setProteinPercentage(plantoEdit?.proteinPercentage?.toString())
      setCarbsPercentage(plantoEdit?.carbsPercentage?.toString())
      setFatPercentage(plantoEdit?.fatPercentage?.toString())
    }
  }, [visible, plantoEdit])

  const handleSave = async () => {
    let errors: string[] = [];

    if (!name || name === undefined) {
      errors.push("Name is required.");
    }

    const total = Number(totalCalories);
    const protein = Number(proteinPercentage);
    const carbs = Number(carbsPercentage);
    const fat = Number(fatPercentage);

    if (totalCalories === "" || isNaN(total) || total <= 0) {
      errors.push("Total calories must be a number greater than 0.");
    }

    if (proteinPercentage === "" || isNaN(protein) || protein < 0) {
      errors.push("Protein must be a non-negative number.");
    }

    if (carbsPercentage === "" || isNaN(carbs) || carbs < 0) {
      errors.push("Carbs must be a non-negative number.");
    }

    if (fatPercentage === "" || isNaN(fat) || fat < 0) {
      errors.push("Fat must be a non-negative number.");
    }


    if (errors.length > 0) {
      Alert.alert("Errors", errors.join("\n"));
      return;
    }

    setIsSaving(true)
    try {
      const data = {
        name: name,
        description: description,
        totalCalories: total,
        proteinPercentage: protein,
        carbsPercentage: carbs,
        fatPercentage: fat,
        createdBy: Number(userId)
      }
      if (isEditing) {
        await trainerApi.updateDietPlan(Number(plantoEdit?.id), data)
      } else {
        await trainerApi.createDietPlan(data)
      }
      // console.log(data)
      onClose()
      Alert.alert('Success', `${isEditing ? 'Diet Plan updated successfully' : 'Diet Plan saved successfully'}`);
      fetchPlans()
    } catch (error) {
      Alert.alert('Error', `${isEditing ? 'Error updating plan.' : "Error creating plan."} `)
    } finally {
      setIsSaving(false)
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    // style={{ justifyContent: 'center', margin: 0 }}
    >
      <View
        className="flex-1 justify-center items-center bg-black/40"
      >
        <View
          className='bg-white w-[90%] max-h-[90%] rounded-xl p-4'
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-pink-800">
              {isEditing ? "Update Diet Plan" : "Create Diet Plan"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
            <Label label='Name' required />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="High-Protein Power"
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />

            <Label label='Calories' required />
            <TextInput
              value={totalCalories}
              onChangeText={setTotalCalories}
              keyboardType="numeric"
              placeholder="2200"
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />
            <Label label='Protein' required />
            <TextInput
              value={proteinPercentage}
              onChangeText={setProteinPercentage}
              keyboardType="numeric"
              placeholder="40"
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />

            <Label label='Carbs' required />
            <TextInput
              value={carbsPercentage}
              onChangeText={setCarbsPercentage}
              keyboardType="numeric"
              placeholder="30"
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />
            <Label label='Fat' required />
            <TextInput
              value={fatPercentage}
              onChangeText={setFatPercentage}
              keyboardType="numeric"
              placeholder="30"
              className="border border-gray-300 rounded-lg p-2 mb-3"
            />
            <Label label='Description' />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Boost muscle recovery"
              className="border border-gray-300 rounded-lg p-2 mb-3"
              multiline
            />
            {/* Meal Dropdown */}
            {/* <View className="mb-3">
              <Label label='Select Meal' required />
              <TouchableOpacity
                ref={dropDownButtonRef}
                className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-white"

                onPress={() => {
                  const handle = findNodeHandle(dropDownButtonRef.current);
                  if (handle) {
                    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                      setDropdownPosition({
                        top: pageY + height,
                        left: pageX,
                        width: width,
                      });
                      setShowDropDown(true);
                    });
                  }
                }}
              >
                <Text className="text-gray-800">
                  {selectedMeal
                    ? selectedMeal.name
                    : "Select an Meal"}
                </Text>
                <ChevronDown size={20} color="#9ca3af" />
              </TouchableOpacity>

              <Modal
                visible={showDropDown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDropDown(false)}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={() => setShowDropDown(false)}
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
                    {loadingMeals ? (
                      <View className="p-3 items-center">
                        <ActivityIndicator size="small" color="#be185d" />
                        <Text className="text-gray-500 mt-1">
                          Loading meals...
                        </Text>
                      </View>
                    ) : (
                      mealsList.map((meal: any) => (
                        <TouchableOpacity
                          key={meal.id}
                          className={`p-3 border-b border-gray-100 ${selectedMeal?.id === meal.id ? "bg-pink-50" : ""}`}
                          onPress={() => {
                            setShowDropDown(false);
                            setSelectedMealsList(prev => {
                              const isAlreadySelected = prev.some(m => m.id === meal.id);
                              if (isAlreadySelected) {
                                return prev.filter(m => m.id !== meal.id);
                              } else {
                                setSelectedMeal(null);
                                return [...prev, meal];
                              }
                            });
                          }}


                        >
                          <Text
                            className={`${selectedMeal?.id === meal.id ? "text-pink-600 font-medium" : "text-gray-800"}`}
                          >
                            {meal.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </TouchableOpacity>
              </Modal>

              {selectedMealsList.length > 0 && (
                <View className="mt-2">
                  <Text className="font-medium text-gray-700 mb-1">Selected Meals:</Text>
                  {selectedMealsList.map(meal => (
                    <View key={meal.id} className="flex-row justify-between items-center p-2 bg-gray-100 rounded mb-1">
                      <Text className="text-gray-800">{meal.name}</Text>
                      <TouchableOpacity onPress={() => setSelectedMealsList(prev => prev.filter(m => m.id !== meal.id))}>
                        <X size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

            </View> */}

          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 py-2 px-4 rounded-lg flex-1 mr-2"
              disabled={isSaving}
            >
              <Text className="text-center text-gray-800 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className={`bg-pink-600 py-2 px-4 flex-row items-center justify-center rounded-lg flex-1 ml-2 ${isSaving ? "opacity-70" : ""}`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-medium ml-2">
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </Text>
                </>
              ) : (
                <>
                  <Save size={16} color="white" />
                  <Text className="text-white font-medium ml-1">
                    {isEditing ? 'Update Plan' : 'Save Plan'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 px-5 py-3 rounded-md"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-pink-600 px-5 py-3 rounded-md"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </Modal>
  );
};

export default DietPlanModal;
