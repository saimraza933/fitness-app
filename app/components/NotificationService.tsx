import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  // Only gets a token for iOS and Android
  if (Platform.OS === "android" || Platform.OS === "ios") {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

export async function scheduleWorkoutNotification(
  hour: number,
  minute: number,
) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to workout! 💪",
      body: "Your scheduled workout is waiting for you.",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}

export async function scheduleMealNotification(
  hour: number,
  minute: number,
  mealName: string,
) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `${mealName} time! 🍽️`,
      body: `It's time for your scheduled ${mealName.toLowerCase()}. Stay on track with your nutrition goals!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}

export async function scheduleWeightReminderNotification(
  hour: number,
  minute: number,
) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Weight tracking reminder ⚖️",
      body: "Don't forget to log your weight today to track your progress!",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
