import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Circle,
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

const ProgressSection = () => {
  // Mock data for charts
  const [weightData, setWeightData] = useState([
    { date: "May 1", weight: 150 },
    { date: "May 8", weight: 149 },
    { date: "May 15", weight: 148 },
    { date: "May 22", weight: 147 },
    { date: "May 29", weight: 146 },
    { date: "Jun 5", weight: 145 },
    { date: "Jun 12", weight: 144 },
  ]);

  const completionData = [
    { week: "Week 1", rate: 70 },
    { week: "Week 2", rate: 80 },
    { week: "Week 3", rate: 75 },
    { week: "Week 4", rate: 90 },
    { week: "Week 5", rate: 85 },
    { week: "Week 6", rate: 95 },
  ];

  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: "1", title: "Workout 4 times", completed: true },
    { id: "2", title: "Track all meals", completed: true },
    { id: "3", title: "Drink 2L water daily", completed: false },
    { id: "4", title: "Sleep 7+ hours", completed: false },
  ]);

  // Calculate max values for scaling
  const maxWeight = Math.max(...weightData.map((d) => d.weight));
  const minWeight = Math.min(...weightData.map((d) => d.weight)) - 1; // Subtract 1 to give some space at bottom
  const weightRange = maxWeight - minWeight;

  // Line chart points calculation
  const chartWidth = screenWidth - 60; // Accounting for padding
  const chartHeight = 180;
  const dataPointSpacing = chartWidth / (weightData.length - 1);

  // Generate SVG path for the line chart
  const generateLinePath = () => {
    let path = "";

    weightData.forEach((point, index) => {
      const x = index * dataPointSpacing;
      const normalizedWeight = (point.weight - minWeight) / weightRange;
      const y = chartHeight - normalizedWeight * chartHeight;

      if (index === 0) {
        path += `M ${x},${y} `;
      } else {
        path += `L ${x},${y} `;
      }
    });

    return path;
  };

  const toggleGoalCompletion = (id: string) => {
    setWeeklyGoals(
      weeklyGoals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal,
      ),
    );
  };

  return (
    <ScrollView className="flex-1 bg-pink-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-pink-800 mb-6">
          Your Progress
        </Text>

        {/* Weight Trend Chart - Line Chart */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <TrendingUp size={20} color="#be185d" />
              <Text className="text-lg font-semibold text-pink-800 ml-2">
                Weight Trend
              </Text>
            </View>
            <Text className="text-sm text-pink-600 font-medium">
              -6 lbs this month
            </Text>
          </View>

          <View className="h-48 mb-2">
            {/* SVG Line Chart */}
            <svg height={chartHeight} width="100%">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = (i * chartHeight) / 4;
                return (
                  <line
                    key={i}
                    x1="0"
                    y1={y}
                    x2="100%"
                    y2={y}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Line path */}
              <path
                d={generateLinePath()}
                fill="none"
                stroke="#be185d"
                strokeWidth="2"
              />

              {/* Data points */}
              {weightData.map((point, index) => {
                const x = index * dataPointSpacing;
                const normalizedWeight =
                  (point.weight - minWeight) / weightRange;
                const y = chartHeight - normalizedWeight * chartHeight;

                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke="#be185d"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </View>

          {/* X-axis labels */}
          <View className="flex-row justify-between px-2">
            {weightData.map((data, index) => (
              <Text key={index} className="text-xs text-gray-500">
                {data.date}
              </Text>
            ))}
          </View>

          {/* Y-axis labels */}
          <View className="absolute left-2 top-12 bottom-8 justify-between">
            {[maxWeight, maxWeight - weightRange / 2, minWeight].map(
              (weight, index) => (
                <Text key={index} className="text-xs text-gray-500">
                  {Math.round(weight)} lbs
                </Text>
              ),
            )}
          </View>
        </View>

        {/* Weekly Goals */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Weekly Goals
            </Text>
          </View>

          {weeklyGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
              onPress={() => toggleGoalCompletion(goal.id)}
            >
              <Text className="font-medium text-gray-800">{goal.title}</Text>
              {goal.completed ? (
                <CheckCircle size={24} color="#be185d" />
              ) : (
                <Circle size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout Completion Chart */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Workout Completion
            </Text>
          </View>

          <View className="h-40 flex-row items-end justify-between">
            {completionData.map((data, index) => (
              <View key={index} className="items-center">
                <View
                  style={{ height: `${data.rate}%` }}
                  className="w-8 bg-purple-400 rounded-t-md"
                />
                <Text className="text-xs mt-1 text-gray-600">{data.week}</Text>
                <Text className="text-xs font-medium">{data.rate}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Award size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Achievements
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {[
              {
                title: "First Week",
                desc: "Completed first week",
                unlocked: true,
              },
              { title: "Consistent", desc: "5 days streak", unlocked: true },
              { title: "Weight Goal", desc: "Lost 5 lbs", unlocked: true },
              { title: "Super User", desc: "30 days active", unlocked: false },
            ].map((achievement, index) => (
              <View
                key={index}
                className={`w-[48%] p-3 rounded-lg mb-3 ${achievement.unlocked ? "bg-pink-100" : "bg-gray-100"}`}
              >
                <Text
                  className={`font-bold ${achievement.unlocked ? "text-pink-800" : "text-gray-400"}`}
                >
                  {achievement.title}
                </Text>
                <Text
                  className={`text-xs ${achievement.unlocked ? "text-pink-600" : "text-gray-400"}`}
                >
                  {achievement.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Historical Data Button */}
        <TouchableOpacity className="bg-pink-600 py-3 px-4 rounded-lg items-center mb-6">
          <Text className="text-white font-semibold text-lg">
            View Historical Data
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProgressSection;
