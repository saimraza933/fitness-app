import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { ArrowRight, Check } from "lucide-react-native";

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any; // In a real app, you'd use a more specific type
}

const { width } = Dimensions.get("window");

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to FitHer",
    description:
      "Your personal fitness companion designed specifically for women's health and wellness.",
    image: {
      uri: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    },
  },
  {
    id: "2",
    title: "Personalized Workouts",
    description:
      "Get customized workout plans tailored to your fitness level and goals.",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
  },
  {
    id: "3",
    title: "Track Your Progress",
    description:
      "Monitor your fitness journey with detailed charts and achievements.",
    image: {
      uri: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    },
  },
  {
    id: "4",
    title: "Connect with Trainers",
    description:
      "Get professional guidance from certified trainers who care about your success.",
    image: {
      uri: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80",
    },
  },
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View className="flex-1 bg-pink-50">
      <View className="flex-1">
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <View style={{ width }} className="items-center justify-center p-8">
              <View className="bg-white rounded-3xl p-2 items-center shadow-sm mb-8 w-72 h-72 justify-center overflow-hidden">
                <Image
                  source={item.image}
                  className="w-full h-full"
                  style={{ borderRadius: 16 }}
                  resizeMode="cover"
                />
              </View>
              <Text className="text-3xl font-bold text-pink-800 mb-4 text-center">
                {item.title}
              </Text>
              <Text className="text-gray-600 text-center text-lg px-4">
                {item.description}
              </Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View className="p-8">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                className="h-2 rounded-full bg-pink-600 mx-1"
                style={{ width: dotWidth, opacity }}
              />
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-pink-600 py-4 rounded-xl items-center flex-row justify-center shadow-lg"
          onPress={nextSlide}
          style={{ elevation: 4 }}
        >
          <Text className="text-white font-bold text-lg mr-2">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          {currentIndex === slides.length - 1 ? (
            <Check size={20} color="white" />
          ) : (
            <ArrowRight size={20} color="white" />
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            className="mt-4 items-center py-2"
            onPress={onComplete}
          >
            <Text className="text-pink-600 font-medium">Skip to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;
