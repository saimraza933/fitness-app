import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  findNodeHandle,
  UIManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDown, Save, X } from 'lucide-react-native';
import { Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { trainerApi } from '../services/api';

interface Ingredient {
  name: string;
  quantity: string;
}

interface FormData {
  name: string;
  time: any;
  description?: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  imageUrl: string;
  ingredients: Ingredient[];
}

const Label = ({ label, required = false }: { label: string, required?: boolean }) => {
  const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <Text className="text-gray-700 mb-1 font-medium">
      {capitalizeFirst(label)} {required && <Text className="text-red-500">*</Text>}
    </Text>
  );
};

type NutrientKey = 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber';


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


const MealModal = ({ visible, onClose, mealToEdit, fetchMeals, dietPlansList }) => {
  const isEditing = !!mealToEdit
  const dropDownButtonRef = useRef(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    time: new Date(),
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    imageUrl: '',
    ingredients: [{ name: '', quantity: '' }]
  });

  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const nutrientFields: NutrientKey[] = ['calories', 'protein', 'carbs', 'fat', 'fiber']
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    if (visible) {
      const plan = dietPlansList?.find((d: any) => d.id === mealToEdit?.dietPlanId) || null
      setFormData({
        name: mealToEdit?.name || '',
        time: mealToEdit?.time ? convertTimeStringToDate(mealToEdit?.time) : new Date(),
        description: mealToEdit?.description || '',
        calories: mealToEdit?.calories?.toString() || '',
        protein: mealToEdit?.protein?.toString() || '',
        carbs: mealToEdit?.carbs?.toString() || '',
        fat: mealToEdit?.fat?.toString() || '',
        fiber: mealToEdit?.fiber?.toString() || '',
        imageUrl: mealToEdit?.imageUrl?.toString() || '',
        ingredients: mealToEdit?.ingredients?.length > 0 ? mealToEdit?.ingredients : [{ name: '', quantity: '' }]
      })
      setSelectedPlan(plan)
    }
  }, [visible, mealToEdit])

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setFormData({ ...formData, time: selectedTime });
    }
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }]
    });
  };

  const handleChangeIngredient = (index: number, field: string, value: string | number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleDeleteIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleSave = async () => {
    const errors = [];
    const isEmpty = (val: any) => !val || val.trim() === '';
    if (isEmpty(formData.name)) {
      errors.push('Meal Name is required.');
    }

    if (!selectedPlan) {
      errors.push('Plan is required.');
    }

    if (!(formData.time instanceof Date) || isNaN(formData?.time)) {
      errors.push('Valid Time is required.');
    }

    nutrientFields?.forEach(nutrient => {
      const val = formData[nutrient];
      if (isEmpty(val)) {
        errors.push(`${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} is required.`);
      } else if (isNaN(Number(val))) {
        errors.push(`${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} must be a number.`);
      }
    });

    if (isEmpty(formData.imageUrl)) {
      errors.push('Image Url is required.');
    }

    if (!formData.ingredients.length || formData.ingredients.every(ing => isEmpty(ing.name))) {
      errors.push('At least one Ingredient with a name is required.');
    }

    if (errors.length > 0) {
      Alert.alert("Errors", 'Please fix the following errors:\n' + errors.join('\n'));
      return;
    }
    setIsSaving(true)

    try {
      const formattedData = {
        ...formData,
        time: new Date(formData.time).toLocaleTimeString('en-GB', { hour12: false }), // "HH:mm:ss"
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        fiber: Number(formData.fiber),
        dietPlanId: Number(selectedPlan?.id)
      };
      // console.log(formattedData)
      if (isEditing) {
        await trainerApi.updateMeal(Number(mealToEdit?.id), formattedData)
      } else {
        await trainerApi.createMeal(formattedData)
      }
      onClose()
      Alert.alert('Success', `${isEditing ? 'Meal updated successfully' : 'Meal saved successfully'}`);
      fetchMeals()
    } catch (error) {
      Alert.alert('Error', `${isEditing ? 'Error updating meal' : 'Error saving meal'}`)
    } finally {
      setIsSaving(false)
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white w-[90%] max-h-[90%] rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-pink-800">
              {isEditing ? "Edit Meal" : "Add Meal"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
            <Label label='Meal Name' required />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-3"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter name"
            />
            {/* Meal Dropdown */}
            <View className="mb-3">
              <Label label='Select Diet Plan' required />
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
                  {selectedPlan
                    ? selectedPlan.name
                    : "Select an Diet Plan"}
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
                    {
                      dietPlansList.map((meal: any) => (
                        <TouchableOpacity
                          key={meal.id}
                          className={`p-3 border-b border-gray-100 ${selectedPlan?.id === meal.id ? "bg-pink-50" : ""}`}
                          onPress={() => {
                            setShowDropDown(false);
                            setSelectedPlan(meal);
                          }}


                        >
                          <Text
                            className={`${selectedPlan?.id === meal.id ? "text-pink-600 font-medium" : "text-gray-800"}`}
                          >
                            {meal.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </TouchableOpacity>
              </Modal>

            </View>

            <Label label='Time' required />
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="border border-gray-300 rounded-lg p-2 mb-3"
            >
              <Text className="text-gray-800">
                {formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={formData.time}
                mode="time"
                display="default"
                is24Hour={true}
                onChange={handleTimeChange}
              />
            )}

            {/* Nutrients */}
            {nutrientFields?.map((field) => (
              <View key={field} className="mb-3">
                <Label label={field} required />
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  keyboardType="numeric"
                  value={formData[field]?.toString()}
                  onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                  placeholder={`Enter ${field}`}
                />
              </View>
            ))}

            {/* Image URL */}
            <Label label={'Image URL'} required />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-3"
              value={formData.imageUrl}
              onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
              placeholder="Enter image URL"
            />


            {/* Description */}
            <Label label='Description' />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-3"
              multiline
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter description"
            />

            {/* Ingredients */}
            <Label label={'Ingredients'} required />
            {formData.ingredients.map((ingredient, index) => (
              <View key={index} className="flex-row mb-2 items-center">
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                  value={ingredient.name}
                  onChangeText={(text) => handleChangeIngredient(index, 'name', text)}
                  placeholder="Name *"
                />
                <TextInput
                  className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                  value={ingredient?.quantity}
                  onChangeText={(text) => handleChangeIngredient(index, 'quantity', text)}
                  placeholder="Quantity"
                />

                <TouchableOpacity
                  onPress={() => handleDeleteIngredient(index)}
                  className={`bg-red-100 px-2 py-2 rounded-lg ${index === 0 ? "opacity-50" : ""}`}
                  disabled={index === 0}
                >
                  <X size={20} color="#991b1b" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              className={`bg-pink-600 py-2 px-4 rounded-lg mb-4`}
              onPress={handleAddIngredient}
            >
              <Text className="text-white font-medium text-center">+ Add Ingredient</Text>
            </TouchableOpacity>

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
                    {isEditing ? 'Updating' : ' Saving...'}
                  </Text>
                </>
              ) : (
                <>
                  <Save size={16} color="white" />
                  <Text className="text-white font-medium ml-1">
                    {isEditing ? 'Update Meal' : ' Save Meal'}
                  </Text>
                </>
              )}
              {/* <Text className="text-center text-white font-medium">Save</Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MealModal;
