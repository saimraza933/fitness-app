import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

const ProgressSection = () => {
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("3 Months");
  const [expandedSection, setExpandedSection] = useState("weight");
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

  // Historical data
  const weightHistory = [
    { date: "Jan 1", weight: 150 },
    { date: "Jan 15", weight: 149 },
    { date: "Feb 1", weight: 148 },
    { date: "Feb 15", weight: 147 },
    { date: "Mar 1", weight: 146 },
    { date: "Mar 15", weight: 145 },
    { date: "Apr 1", weight: 144 },
    { date: "Apr 15", weight: 143 },
    { date: "May 1", weight: 142 },
    { date: "May 15", weight: 141 },
    { date: "Jun 1", weight: 140 },
  ];

  const workoutHistory = [
    { month: "January", completed: 15, total: 20 },
    { month: "February", completed: 18, total: 20 },
    { month: "March", completed: 16, total: 20 },
    { month: "April", completed: 19, total: 20 },
    { month: "May", completed: 20, total: 20 },
    { month: "June", completed: 10, total: 12 },
  ];

  const nutritionHistory = [
    { month: "January", adherence: 75 },
    { month: "February", adherence: 80 },
    { month: "March", adherence: 85 },
    { month: "April", adherence: 90 },
    { month: "May", adherence: 88 },
    { month: "June", adherence: 92 },
  ];

  // Calculate max values for scaling in historical data
  const maxHistWeight = Math.max(...weightHistory.map((d) => d.weight));
  const minHistWeight = Math.min(...weightHistory.map((d) => d.weight)) - 1;
  const histWeightRange = maxHistWeight - minHistWeight;

  // Line chart points calculation for historical data
  const histChartWidth = screenWidth - 60;
  const histChartHeight = 180;
  const histDataPointSpacing = histChartWidth / (weightHistory.length - 1);

  // Generate SVG path for the historical line chart
  const generateHistLinePath = () => {
    let path = "";

    weightHistory.forEach((point, index) => {
      const x = index * histDataPointSpacing;
      const normalizedWeight = (point.weight - minHistWeight) / histWeightRange;
      const y = histChartHeight - normalizedWeight * histChartHeight;

      if (index === 0) {
        path += `M ${x},${y} `;
      } else {
        path += `L ${x},${y} `;
      }
    });

    return path;
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
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
        <TouchableOpacity
          className="bg-pink-600 py-3 px-4 rounded-lg items-center mb-6"
          onPress={() => setShowHistoricalData(true)}
        >
          <Text className="text-white font-semibold text-lg">
            View Historical Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* Historical Data Modal */}
      <Modal
        visible={showHistoricalData}
        animationType="slide"
        onRequestClose={() => setShowHistoricalData(false)}
      >
        <View className="flex-1 bg-pink-50">
          <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowHistoricalData(false)}>
              <ArrowLeft size={24} color="#be185d" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-pink-800 ml-4">
              Historical Data
            </Text>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Time Period Selector */}
            <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <Text className="text-gray-700 font-medium mb-3">
                Time Period:
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {["1 Month", "3 Months", "6 Months", "1 Year"].map((period) => (
                  <TouchableOpacity
                    key={period}
                    className={`px-3 py-2 rounded-lg mb-2 flex-1 mx-1 ${selectedPeriod === period ? "bg-pink-600" : "bg-gray-100"}`}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text
                      className={`${selectedPeriod === period ? "text-white" : "text-gray-700"} font-medium text-center`}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Weight History Section */}
            <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 border-b border-gray-100"
                onPress={() => toggleSection("weight")}
              >
                <View className="flex-row items-center">
                  <TrendingUp size={20} color="#be185d" />
                  <Text className="text-lg font-semibold text-pink-800 ml-2">
                    Weight History
                  </Text>
                </View>
                {expandedSection === "weight" ? (
                  <ChevronUp size={20} color="#be185d" />
                ) : (
                  <ChevronDown size={20} color="#be185d" />
                )}
              </TouchableOpacity>

              {expandedSection === "weight" && (
                <View className="p-4">
                  <View className="h-48 mb-2">
                    {/* SVG Line Chart */}
                    <svg height={histChartHeight} width="100%">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = (i * histChartHeight) / 4;
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
                        d={generateHistLinePath()}
                        fill="none"
                        stroke="#be185d"
                        strokeWidth="2"
                      />

                      {/* Data points */}
                      {weightHistory.map((point, index) => {
                        const x = index * histDataPointSpacing;
                        const normalizedWeight =
                          (point.weight - minHistWeight) / histWeightRange;
                        const y =
                          histChartHeight - normalizedWeight * histChartHeight;

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
                    {weightHistory
                      .filter((_, i) => i % 2 === 0)
                      .map((data, index) => (
                        <Text key={index} className="text-xs text-gray-500">
                          {data.date}
                        </Text>
                      ))}
                  </View>

                  {/* Y-axis labels */}
                  <View className="absolute left-2 top-12 bottom-8 justify-between">
                    {[
                      maxHistWeight,
                      maxHistWeight - histWeightRange / 2,
                      minHistWeight,
                    ].map((weight, index) => (
                      <Text key={index} className="text-xs text-gray-500">
                        {Math.round(weight)} lbs
                      </Text>
                    ))}
                  </View>

                  {/* Weight log table */}
                  <View className="mt-6 border-t border-gray-100 pt-4">
                    <Text className="font-medium text-gray-800 mb-2">
                      Weight Log
                    </Text>
                    <View className="flex-row justify-between bg-gray-50 p-2 rounded-t-lg">
                      <Text className="font-medium text-gray-600 flex-1">
                        Date
                      </Text>
                      <Text className="font-medium text-gray-600 flex-1 text-right">
                        Weight
                      </Text>
                    </View>
                    {weightHistory.map((entry, index) => (
                      <View
                        key={index}
                        className={`flex-row justify-between p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <Text className="text-gray-700 flex-1">
                          {entry.date}
                        </Text>
                        <Text className="text-gray-700 flex-1 text-right">
                          {entry.weight} lbs
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Workout History Section */}
            <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 border-b border-gray-100"
                onPress={() => toggleSection("workout")}
              >
                <View className="flex-row items-center">
                  <Calendar size={20} color="#be185d" />
                  <Text className="text-lg font-semibold text-pink-800 ml-2">
                    Workout History
                  </Text>
                </View>
                {expandedSection === "workout" ? (
                  <ChevronUp size={20} color="#be185d" />
                ) : (
                  <ChevronDown size={20} color="#be185d" />
                )}
              </TouchableOpacity>

              {expandedSection === "workout" && (
                <View className="p-4">
                  <View className="h-40 flex-row items-end justify-between mb-4">
                    {workoutHistory.map((data, index) => {
                      const completionRate =
                        (data.completed / data.total) * 100;
                      return (
                        <View key={index} className="items-center">
                          <View
                            style={{ height: `${completionRate}%` }}
                            className="w-8 bg-purple-400 rounded-t-md"
                          />
                          <Text className="text-xs mt-1 text-gray-600">
                            {data.month.substring(0, 3)}
                          </Text>
                          <Text className="text-xs font-medium">
                            {Math.round(completionRate)}%
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Workout log table */}
                  <View className="mt-2 border-t border-gray-100 pt-4">
                    <Text className="font-medium text-gray-800 mb-2">
                      Workout Completion
                    </Text>
                    <View className="flex-row justify-between bg-gray-50 p-2 rounded-t-lg">
                      <Text className="font-medium text-gray-600 flex-1">
                        Month
                      </Text>
                      <Text className="font-medium text-gray-600 flex-1 text-center">
                        Completed
                      </Text>
                      <Text className="font-medium text-gray-600 flex-1 text-right">
                        Rate
                      </Text>
                    </View>
                    {workoutHistory.map((entry, index) => (
                      <View
                        key={index}
                        className={`flex-row justify-between p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <Text className="text-gray-700 flex-1">
                          {entry.month}
                        </Text>
                        <Text className="text-gray-700 flex-1 text-center">
                          {entry.completed}/{entry.total}
                        </Text>
                        <Text className="text-gray-700 flex-1 text-right">
                          {Math.round((entry.completed / entry.total) * 100)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Nutrition History Section */}
            <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <TouchableOpacity
                className="flex-row justify-between items-center p-4 border-b border-gray-100"
                onPress={() => toggleSection("nutrition")}
              >
                <View className="flex-row items-center">
                  <Calendar size={20} color="#be185d" />
                  <Text className="text-lg font-semibold text-pink-800 ml-2">
                    Nutrition History
                  </Text>
                </View>
                {expandedSection === "nutrition" ? (
                  <ChevronUp size={20} color="#be185d" />
                ) : (
                  <ChevronDown size={20} color="#be185d" />
                )}
              </TouchableOpacity>

              {expandedSection === "nutrition" && (
                <View className="p-4">
                  <View className="h-40 flex-row items-end justify-between mb-4">
                    {nutritionHistory.map((data, index) => (
                      <View key={index} className="items-center">
                        <View
                          style={{ height: `${data.adherence}%` }}
                          className="w-8 bg-pink-400 rounded-t-md"
                        />
                        <Text className="text-xs mt-1 text-gray-600">
                          {data.month.substring(0, 3)}
                        </Text>
                        <Text className="text-xs font-medium">
                          {data.adherence}%
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Nutrition log table */}
                  <View className="mt-2 border-t border-gray-100 pt-4">
                    <Text className="font-medium text-gray-800 mb-2">
                      Diet Plan Adherence
                    </Text>
                    <View className="flex-row justify-between bg-gray-50 p-2 rounded-t-lg">
                      <Text className="font-medium text-gray-600 flex-1">
                        Month
                      </Text>
                      <Text className="font-medium text-gray-600 flex-1 text-right">
                        Adherence Rate
                      </Text>
                    </View>
                    {nutritionHistory.map((entry, index) => (
                      <View
                        key={index}
                        className={`flex-row justify-between p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <Text className="text-gray-700 flex-1">
                          {entry.month}
                        </Text>
                        <Text className="text-gray-700 flex-1 text-right">
                          {entry.adherence}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProgressSection;
