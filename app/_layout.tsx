import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./components/OnboardingScreen";
import CustomSplashScreen from "./components/SplashScreen";
import { Provider } from "react-redux";
import { store } from "./store";
import { initializeAuth, loadSavedUsers } from "./store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks/redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Keys for AsyncStorage
const HAS_SEEN_ONBOARDING = "has_seen_onboarding";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      try {
        const { TempoDevtools } = require("tempo-devtools");
        TempoDevtools.init();
      } catch (error) {
        console.error("Failed to initialize TempoDevtools:", error);
      }
    }
  }, []);

  // Check if user has seen onboarding
  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          // Check if user has seen onboarding
          const hasSeenOnboarding =
            await AsyncStorage.getItem(HAS_SEEN_ONBOARDING);
          setShowOnboarding(hasSeenOnboarding !== "true");

          // Hide the native splash screen
          await SplashScreen.hideAsync();

          // App is ready to show our custom splash or onboarding
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn("Error preparing app:", e);
        // Default to showing onboarding if there's an error
        setShowOnboarding(true);
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, [loaded]);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(HAS_SEEN_ONBOARDING, "true");
      setShowOnboarding(false);
      // Navigate to login after onboarding
      router.replace("/login");
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!appIsReady || !loaded) {
    return null;
  }

  // Show custom splash screen first
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Normal app flow
  return (
    <Provider store={store}>
      <AppContent
        appIsReady={appIsReady}
        showSplash={showSplash}
        handleSplashFinish={handleSplashFinish}
      />
    </Provider>
  );
}

function AppContent({
  appIsReady,
  showSplash,
  handleSplashFinish,
}: {
  appIsReady: boolean;
  showSplash: boolean;
  handleSplashFinish: () => void;
}) {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state and load saved users
    dispatch(loadSavedUsers());
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!appIsReady) {
    return null;
  }

  // Show custom splash screen first
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="workout-details" options={{ headerShown: false }} />
        <Stack.Screen name="nutrition-info" options={{ headerShown: false }} />
        <Stack.Screen name="historical-data" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
