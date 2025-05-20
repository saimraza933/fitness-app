import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { Clock } from 'lucide-react-native'

const MealCard = ({ meal }: any) => {

  function convertTo12HourFormat(time24: any) {
    const [hour, minute] = time24.split(':');
    const h = parseInt(hour);
    const m = minute;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:${m} ${period}`;
  }

  return (
    <View
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
    >
      <Image
        source={{ uri: meal?.imageUrl }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-800">
            {meal?.name}
          </Text>
          <View className="flex-row items-center">
            <Clock size={14} color="#9ca3af" />
            <Text className="text-gray-500 ml-1">{convertTo12HourFormat(meal?.time)}</Text>
          </View>
        </View>

        <Text className="text-gray-700 mb-3">{meal?.description}</Text>

        {/* Nutrients */}
        <View className="flex-row justify-between mb-3 bg-gray-50 p-2 rounded-lg">
          <View className="items-center">
            <Text className="text-xs text-gray-500">Calories</Text>
            <Text className="font-medium">
              {meal?.calories}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Protein</Text>
            <Text className="font-medium">
              {meal?.protein}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Carbs</Text>
            <Text className="font-medium">{meal?.carbs}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Fat</Text>
            <Text className="font-medium">{meal?.fat}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Fiber</Text>
            <Text className="font-medium">{meal?.fiber}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text className="font-medium text-gray-800 mb-1">
          Ingredients:
        </Text>
        <View>
          {meal.ingredients.map((ingredient: any, idx: any) => (
            <Text key={idx} className="text-gray-600 text-sm">
              • {ingredient?.quantity} {ingredient?.name}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}

export default MealCard

const styles = StyleSheet.create({})