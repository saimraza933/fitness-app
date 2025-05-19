import React, { useState, useEffect } from "react";
import Svg, { Line, Path, Circle } from 'react-native-svg';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Circle as IconCircle,
  ChevronDown,
  ChevronUp,
  Users,
  User,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "./AuthContext";
import { clientApi, trainerApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../hooks/redux";
import { ActivityIndicator } from "react-native";

const goalsData = [
  { id: "1", title: "Workout 4 times", completed: true },
  { id: "2", title: "Track all meals", completed: true },
  { id: "3", title: "Drink 2L water daily", completed: false },
  { id: "4", title: "Sleep 7+ hours", completed: false },
]

const mockWeightData = [
  { date: "May 1", weight: 50 },
  { date: "May 8", weight: 48 },
  { date: "May 15", weight: 48 },
  { date: "May 22", weight: 47 },
  { date: "May 29", weight: 45 },
  { date: "Jun 5", weight: 45 },
  { date: "Jun 12", weight: 44 },
]

const mockCompletionData = [
  { week: "Week 1", rate: 70 },
  { week: "Week 2", rate: 80 },
  { week: "Week 3", rate: 75 },
  { week: "Week 4", rate: 90 },
  { week: "Week 5", rate: 85 },
  { week: "Week 6", rate: 95 },
];

// Historical data
const mockWeightHistory = [
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

const mockWorkoutHistory = [
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


function formatToMonthDay(isoDateStr: any) {
  if (!isoDateStr) return "";

  const date: any = new Date(isoDateStr);
  if (isNaN(date)) return "";

  const options = { month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}

const filterThisMonthData = (dataArray: any) => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based (May = 4)
  const currentYear = now.getFullYear();

  return dataArray.filter((item: any) => {
    const date = new Date(item.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
};

const getWeightChangeThisMonth = (thisMonthData: any) => {

  if (thisMonthData.length < 2) return "0 lbs";

  const sorted = [...thisMonthData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const startWeight = parseFloat(sorted[0].weight);
  const endWeight = parseFloat(sorted[sorted.length - 1].weight);
  const diff = endWeight - startWeight;

  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${Math.abs(diff).toFixed(1)} lbs this month`;
};

function getDateRanges() {
  const today = new Date();

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const currentMonthStart = getStartOfMonth(new Date(today));
  const currentMonthEnd = getEndOfMonth(new Date(today));

  const last3MonthsStart = getStartOfMonth(new Date(today.getFullYear(), today.getMonth() - 2));
  const last3MonthsEnd = currentMonthEnd;

  const last6MonthsStart = getStartOfMonth(new Date(today.getFullYear(), today.getMonth() - 5));
  const last6MonthsEnd = currentMonthEnd;

  const lastYearStart = getStartOfMonth(new Date(today.getFullYear() - 1, today.getMonth()));
  const lastYearEnd = currentMonthEnd;

  return {
    currentMonthStart: formatDate(currentMonthStart),
    currentMonthEnd: formatDate(currentMonthEnd),
    last3MonthsStart: formatDate(last3MonthsStart),
    last3MonthsEnd: formatDate(last3MonthsEnd),
    last6MonthsStart: formatDate(last6MonthsStart),
    last6MonthsEnd: formatDate(last6MonthsEnd),
    lastYearStart: formatDate(lastYearStart),
    lastYearEnd: formatDate(lastYearEnd),
  };
}


const { width: screenWidth } = Dimensions.get("window");

interface Client {
  id: string;
  name: string;
  weight: string;
  progress: number;
  lastActive: string;
  profilePicture?: string;
  weightHistory?: { date: string; weight: number }[];
  workoutHistory?: { month: string; completed: number; total: number }[];
  nutritionHistory?: { month: string; adherence: number }[];
}

interface ProgressSectionProps {
  onClientSelect?: (client: Client) => void;
  selectedClient?: Client | null;
  setSelectedClient?: any,
  onClientDetailsView?: (isViewing: boolean) => void;
}
// "1 Month", "3 Months", "6 Months", "1 Year"
const timePeriods = [
  {
    value: '1_month',
    name: "1 Month"
  },
  {
    value: '3_month',
    name: "3 Months"
  },
  {
    value: '6_month',
    name: "6 Months"
  },
  {
    value: 'year',
    name: "1 Year"
  }
]

const ClientProgressSection = ({
  onClientSelect,
  selectedClient,
  onClientDetailsView,
  setSelectedClient
}: ProgressSectionProps = {}) => {
  // const { userRole } = useAuth();
  const { userRole, userId } = useAppSelector(state => state.auth)
  const isTrainer = userRole === "trainer";
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1_month");
  const [expandedSection, setExpandedSection] = useState<any>("weight");
  const [goalsList, setGoalsList] = useState<any>([])
  const [isGoalLoading, setIsGoalLoading] = useState(false)
  const [isWeightTrendLoading, setIsWeightTrendLoading] = useState(false)
  const [isCompletionLoading, setIsCompletionLoading] = useState(false)
  const clientId: any = !!selectedClient ? selectedClient?.id : userId
  const [weightData, setWeightData] = useState<any>([]);
  const [weightHistory, setWeightHistory] = useState<any>([])
  const [completionData, setCompletionData] = useState<any>([])
  const [workoutHistory, setWorkoutHistory] = useState<any>([])
  const [isHistoricalDataLoading, setIsHistoricalDataLoading] = useState(false)


  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchWeeklyGoals(),
        fetchClientWeightLogs(),
        fetchWorkoutLogs()
      ])
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setIsHistoricalDataLoading(true)
      const {
        currentMonthStart,
        currentMonthEnd,
        last3MonthsStart,
        last3MonthsEnd,
        last6MonthsStart,
        last6MonthsEnd,
        lastYearStart,
        lastYearEnd, } = getDateRanges()

      const getDateRangeByPeriod = (period: string) => {
        switch (period) {
          case '1_month':
            return { startDate: currentMonthStart, endDate: currentMonthEnd };
          case '3_month':
            return { startDate: last3MonthsStart, endDate: last3MonthsEnd };
          case '6_month':
            return { startDate: last6MonthsStart, endDate: last6MonthsEnd };
          case 'year':
            return { startDate: lastYearStart, endDate: lastYearEnd };
          default:
            return { startDate: '', endDate: '' };
        }
      };

      const { startDate, endDate } = getDateRangeByPeriod(selectedPeriod);

      await Promise.all([
        fetchClientHistoricalWeightLogs(startDate, endDate),
        fetchClientHistoricalWorkoutLogs(startDate, endDate)
      ])
      setIsHistoricalDataLoading(false)
    })()

  }, [selectedPeriod, clientId])


  const fetchWeeklyGoals = async () => {
    setIsGoalLoading(true)
    try {
      const goals = await trainerApi.getClientsWeeklyGoals(clientId);
      // console.log('weekly goals', goals)
      setGoalsList(goals)
    } catch (error) {
      setGoalsList(goalsData)
    } finally {
      setIsGoalLoading(false)
    }
  };

  const fetchClientWeightLogs = async () => {
    setIsWeightTrendLoading(true)
    try {
      const weightDetails = await trainerApi.getClientsWeightsLogs(clientId);
      const formatdData = Array.isArray(filterThisMonthData(weightDetails)) && weightDetails?.map((val: any) => {
        return {
          date: formatToMonthDay(val?.date),
          weight: Number(val.weight)
        }
      })
      setWeightData(formatdData)
    } catch (error) {
      console.log(error)
      setWeightData(mockWeightData)
    } finally {
      setIsWeightTrendLoading(false)
    }
  };

  const fetchWorkoutLogs = async () => {
    try {
      setIsCompletionLoading(true)
      const workoutDetails = await clientApi.getClientWorkoutCompletionLogs(clientId)
      const formatedCompletionData = workoutDetails?.map((item: any) => {
        const [year, month] = item.month.split("-");
        const monthNames = [
          "", "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        return {
          week: `${monthNames[parseInt(month)]} ${year}`,
          rate: item.percent,
          completed: item?.completed
        };
      });

      setCompletionData(formatedCompletionData)
    } catch (error) {
      console.log(error)
      setCompletionData(mockCompletionData)
    } finally {
      setIsCompletionLoading(false)
    }
  };

  const fetchClientHistoricalWeightLogs = async (startDate: any, endDate: any) => {
    try {
      const weightDetails = await trainerApi.getClientsWeightsLogs(clientId, startDate, endDate);
      const formatdData = weightDetails?.map((val: any) => {
        return {
          date: formatToMonthDay(val?.date),
          weight: Number(val.weight)
        }
      })
      setWeightHistory(formatdData)
    } catch (error) {
      console.log(error)
      setWeightHistory(mockWeightHistory)
    }
  };

  const fetchClientHistoricalWorkoutLogs = async (startDate: any, endDate: any) => {

    try {
      const workoutDetails = await clientApi.getClientWorkoutCompletionLogs(clientId, startDate, endDate)

      const formatedData = workoutDetails?.map((item: any) => {
        const [year, monthNum] = item.month.split("-");
        const [completedStr, totalStr] = item.completed.split("/");

        const monthNames = [
          "", "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        return {
          month: monthNames[parseInt(monthNum)],
          completed: parseInt(completedStr),
          total: parseInt(totalStr)
        };
      });

      setWorkoutHistory(formatedData)
    } catch (error) {
      console.log(error)
      setWorkoutHistory(mockWorkoutHistory)
    }
  };

  // Calculate max values for scaling
  const maxWeight = Math.max(...weightData.map((d: any) => d.weight));
  const minWeight = Math.min(...weightData.map((d: any) => d.weight)) - 1; // Subtract 1 to give some space at bottom
  const weightRange = maxWeight - minWeight || 1;


  // Line chart points calculation
  const chartWidth = screenWidth - 60; // Accounting for padding
  const chartHeight = 180;
  // const dataPointSpacing = chartWidth / (weightData.length - 1);
  const dataPointSpacing =
    weightData.length > 1 ? chartWidth / (weightData.length - 1) : 0;


  // Generate SVG path for the line chart
  const generateLinePath = () => {
    let path = "";

    weightData.forEach((point: any, index: any) => {
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

  const toggleGoalCompletion = async (value: any) => {
    const data = {
      ...value,
      completed: !value?.completed,
      client_id: Number(clientId)
    }
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to mark this goal as ${!value?.completed ? 'complete' : 'incomplete'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await trainerApi?.updateClientWeeklyGoal(data)
              setGoalsList(
                goalsList.map((goal: any) =>
                  goal.id === value.id ? { ...goal, completed: !goal.completed } : goal,
                ),
              );
              Alert.alert(
                'Success',
                `${value?.title} plan has been marked as ${data?.completed ? 'completed' : 'incomplete'}.`
              );
            } catch (error) {
              console.log(error)
              Alert.alert(
                'Error',
                `Some thing went wrong.`
              );
            }
          },
        },
      ],
      { cancelable: false }
    );

  };


  // Calculate max values for scaling in historical data
  const maxHistWeight = Math.max(...weightHistory.map((d: any) => d.weight));
  const minHistWeight = Math.min(...weightHistory.map((d: any) => d.weight)) - 1;
  const histWeightRange = maxHistWeight - minHistWeight || 1;


  // Line chart points calculation for historical data
  const histChartWidth = screenWidth - 60;
  const histChartHeight = 180;
  // const histDataPointSpacing = histChartWidth / (weightHistory.length - 1);
  const histDataPointSpacing =
    weightHistory.length > 1 ? histChartWidth / (weightHistory.length - 1) : 0;

  // Generate SVG path for the historical line chart
  const generateHistLinePath = () => {
    let path = "";

    weightHistory.forEach((point: any, index: any) => {
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

  const toggleSection = (section: any) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };


  // Render client progress view (for individual client or current user)
  const renderClientProgress = (client?: any) => {
    // Notify parent component when viewing client details
    useEffect(() => {
      if (onClientDetailsView && client) {
        onClientDetailsView(true);
        return () => onClientDetailsView(false);
      }
    }, [client, onClientDetailsView]);
    return [
      // Main content view
      <View key="main-content" className="p-4">
        {client && isTrainer && (
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setSelectedClient(null)}
              className="mr-3"
            >
              <ArrowLeft size={24} color="#be185d" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-pink-100 overflow-hidden mr-2">
                {client.profilePicture && (
                  <Image
                    source={{ uri: client.profilePicture }}
                    className="w-full h-full"
                  />
                )}
              </View>
              <Text className="text-xl font-bold text-pink-800">
                {client.name}'s Progress
              </Text>
            </View>
          </View>
        )}

        {!client && (
          <Text className="text-2xl font-bold text-pink-800 mb-6">
            Your Progress
          </Text>
        )}

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
              {getWeightChangeThisMonth(weightData)}
            </Text>
          </View>
          {
            isWeightTrendLoading ? (
              <View className="items-center justify-center">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) : weightData?.length > 0 ? (
              <>
                <View className="h-48 mb-2">
                  <Svg height={chartHeight} width="100%">

                    {[0, 1, 2, 3, 4].map((i) => {
                      const y = (i * chartHeight) / 4;
                      return (
                        <Line
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

                    <Path
                      d={generateLinePath()}
                      fill="none"
                      stroke="#be185d"
                      strokeWidth="2"
                    />

                    {weightData.map((point: any, index: any) => {
                      const x = index * dataPointSpacing;
                      const normalizedWeight =
                        (point.weight - minWeight) / weightRange;
                      const y = chartHeight - normalizedWeight * chartHeight;

                      return (
                        <Circle
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
                  </Svg>
                </View>

                {/* X-axis labels */}
                <View className="flex-row justify-between px-2">
                  {weightData.map((data: any, index: any) => (
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
              </>
            ) : (
              <Text>No weight trend found</Text>
            )
          }
        </View>

        {/* Weekly Goals */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Weekly Goals
            </Text>
          </View>

          {
            isGoalLoading ?
              <View className="items-center justify-center ">
                <ActivityIndicator size="large" color="#be185d" />
              </View> :
              goalsList?.length > 0 ? goalsList?.map((goal: any) => (
                <TouchableOpacity
                  key={goal.id}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  onPress={() => toggleGoalCompletion(goal)}
                  disabled={isTrainer}
                >
                  <Text className="font-medium text-gray-800">{goal.title}</Text>
                  {goal.completed ? (
                    <CheckCircle size={24} color="#be185d" />
                  ) : (
                    <IconCircle size={24} color="#d1d5db" />
                  )}
                </TouchableOpacity>
              )) :
                <Text className="text-center">No Goals find</Text>
          }
        </View>

        {/* Workout Completion Chart */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#be185d" />
            <Text className="text-lg font-semibold text-pink-800 ml-2">
              Workout Completion
            </Text>
          </View>

          {
            isCompletionLoading ? (
              <View className="items-center justify-center ">
                <ActivityIndicator size="large" color="#be185d" />
              </View>
            ) :
              completionData?.length > 0 ?
                completionData.map((data: any, index: any) => (
                  <View className="h-40 flex-row items-end justify-between">
                    <View key={index} className="items-center">
                      <View
                        style={{ height: `${data.rate}%` }}
                        className="w-8 bg-purple-400 rounded-t-md"
                      />
                      <Text className="text-xs mt-1 text-gray-600">{data.week}</Text>
                      <Text className="text-xs font-medium">{data.rate}%</Text>
                    </View>
                  </View>
                )) : (
                  <Text>No workout completion found</Text>
                )
          }
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
              {
                title: "Super User",
                desc: "30 days active",
                unlocked: false,
              },
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
      </View>,

      // Historical Data Modal
      <Modal
        key="historical-modal"
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
                {timePeriods?.map((period: any, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`px-3 py-2 rounded-lg mb-2 flex-1 mx-1 ${selectedPeriod === period.value ? "bg-pink-600" : "bg-gray-100"}`}
                    onPress={() => setSelectedPeriod(period.value)}
                  >
                    <Text
                      className={`${selectedPeriod === period.value ? "text-white" : "text-gray-700"} font-medium text-center`}
                    >
                      {period.name}
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
                  {
                    isHistoricalDataLoading ? (
                      <View className="items-center justify-center">
                        <ActivityIndicator size="large" color="#be185d" />
                      </View>
                    ) : workoutHistory?.length > 0 ? (
                      <>
                        <View className="h-48 mb-2">
                          <Svg height={histChartHeight} width="100%">

                            {[0, 1, 2, 3, 4].map((i: any) => {
                              const y = (i * histChartHeight) / 4;
                              return (
                                <Line
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

                            <Path
                              d={generateHistLinePath()}
                              fill="none"
                              stroke="#be185d"
                              strokeWidth="2"
                            />

                            {weightHistory.map((point: any, index: any) => {
                              const x = index * histDataPointSpacing;
                              const normalizedWeight =
                                (point.weight - minHistWeight) / histWeightRange;
                              const y =
                                histChartHeight - normalizedWeight * histChartHeight;

                              return (
                                <Circle
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
                          </Svg>
                        </View>

                        <View className="flex-row justify-between px-2">
                          {weightHistory
                            .filter((_: any, i: any) => i % 2 === 0)
                            .map((data: any, index: any) => (
                              <Text key={index} className="text-xs text-gray-500">
                                {data.date}
                              </Text>
                            ))}
                        </View>


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
                          {weightHistory.map((entry: any, index: any) => (
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
                      </>
                    ) : (
                      <Text>No weight history found</Text>
                    )
                  }

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
                  {
                    isHistoricalDataLoading ? (
                      <View className="items-center justify-center ">
                        <ActivityIndicator size="large" color="#be185d" />
                      </View>
                    ) : workoutHistory.length > 0 ? (
                      <>
                        <View className="h-40 flex-row items-end justify-between mb-4">
                          {workoutHistory.map((data: any, index: any) => {
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
                          {workoutHistory.map((entry: any, index: any) => (
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
                      </>
                    ) : (
                      <Text>No workout completion found</Text>
                    )
                  }

                </View>
              )}
            </View>

            {/* Nutrition History Section */}
            {/* <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
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
            </View> */}
          </ScrollView>
        </View >
      </Modal >,
    ];
  };

  return (
    <ScrollView className="flex-1 bg-pink-50">
      {/* {isTrainer && !selectedClient
        ? renderTrainerView()
        : renderClientProgress(selectedClient)} */}
      {renderClientProgress(selectedClient)}
    </ScrollView>
  );
};

export default ClientProgressSection;
