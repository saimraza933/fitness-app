import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../common";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to catch 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // await store.dispatch(logout());
      // router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    role: string;
    name: string;
    age: string;
    height: string;
    weight: string;
    goal: string;
  }) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await api.post("/auth/reset-password", { email });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData: {
    name: string;
    age: string;
    weight: string;
    height: string;
    goal: string;
    notification_time: string;
    notifications_enabled: boolean;
    profile_picture?: string | null;
  }) => {
    // Ensure notifications_enabled is always set to true as it's required and must be a boolean
    const updatedData = {
      ...profileData,
      notifications_enabled: true,
    };
    const response = await api.put("/profile", updatedData);
    return response.data;
  },

  updateProfilePicture: async (imageObj: any) => {
    // Create form data for image upload
    const formData = new FormData();

    // Get filename from URI
    // const uriParts = imageUri.split("/");
    // const fileName = uriParts[uriParts.length - 1];

    // Append the image to form data
    // @ts-ignore - FormData expects specific types
    // formData.append("profile_picture", {
    //   uri: imageUri,
    //   name: fileName,
    //   type: "image/jpeg", // Assuming JPEG format, adjust if needed
    // });
    formData.append("profile_picture", imageObj);

    const response = await api.put("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  removeProfilePicture: async () => {
    const response = await api.put("/profile", { profile_picture: null });
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete("/profile");
    return response.data;
  },
};

export const clientApi = {
  savedailyWeightsLogs: async (trainerId: number, weight: number, date: any, clientId: number) => {
    const response = await api.post(`/clients/${clientId}/weight-logs`, { trainerId, weight, date });
    return response.data;
  },

  markExerciseComplete: async (workoutPlanId: number, exerciseId: number, completed: any) => {
    const response = await api.put(`/exercises/toggle-status/${workoutPlanId}/${exerciseId}?status=${completed}`);
    return response.data;
  },

  markWorkoutComplete: async (clientId: number, assignmentId: number, exerciseId: number, completed: boolean) => {

    const response = await api.put(`/clients/${clientId}/workout-assignments/${assignmentId}/exercises/${exerciseId}`, { completed });
    return response.data;
  },

  markMealComplete: async (clientId: number, assignmentId: number, mealId: number, completed: boolean) => {
    const response = await api.put(`/clients/${clientId}/diet-assignments/${assignmentId}/meals/${mealId}`, { completed });
    // console.log(response.data)
    return response.data;
  },

  getClientWorkoutCompletionLogs: async (clientId: number, fromDate?: string, toDate?: string) => {
    let url = `/clients/${clientId}/workout-assignments/logs?`
    if (fromDate) {
      url += `&fromDate=${fromDate}`
    }
    if (toDate) {
      url += `&toDate=${toDate}`
    }
    const response = await api.get(url);
    return response.data;
  },

  getClientWorkoutsAssignmentsWithExercises: async (clientId: number, fromDate?: string,) => {
    let url = `/clients/${clientId}/workout-assignments?`
    if (fromDate) {
      url += `&fromDate=${fromDate}`
    }
    const response = await api.get(url);
    return response.data;
  },

  getClientsDietPlans: async (clientId: number, fromDate?: string) => {
    let url = `/diet-plans/client/${clientId}?`
    if (fromDate) {
      url += `&fromDate=${fromDate}`
    }
    const response = await api.get(url);
    return response.data;
  },
};

export const trainerApi = {
  // Get all trainers
  getTrainers: async () => {
    const response = await api.get("/trainers");
    return response.data;
  },

  // Get all clients for a trainer
  getClients: async () => {
    const response = await api.get("/clients");
    return response.data;
  },

  getClientsByTrainer: async (trainerId: number) => {
    console.log(trainerId)
    const response = await api.get(`/getClientsByTrainer/${trainerId}`);
    return response.data;
  },

  getNotAssignedClients: async () => {
    const response = await api.get(`/getClientsByWithoutTrainer`);
    return response.data;
  },


  // Get all available clients (not assigned to this trainer)
  getAvailableClients: async () => {
    try {
      const response = await api.get("/clients?available=true");
      return response.data;
    } catch (error) {
      console.error("Error fetching available clients:", error);
      throw error;
    }
  },

  // Get details for a specific client
  getClientDetails: async (clientId: number | string) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },

  getClientsWeeklyGoals: async (clientId: number) => {
    const response = await api.get(`/clients/${clientId}/weekly-goals`);
    return response.data;
  },

  getClientsWeightsLogs: async (clientId: number, startDate?: string, endDate?: string) => {
    let url = `/clients/${clientId}/weight-logs?`
    if (startDate) {
      url += `&startDate=${startDate}`
    }
    if (endDate) {
      url += `&endDate=${endDate}`
    }
    const response = await api.get(url);
    return response.data;
  },

  deleteDietPlan: async (planId: number) => {
    const response = await api.delete(`/diet-plans/${planId}`);
    return response.data;
  },
  getTrainerDietPlans: async (trainerId: number) => {
    const response = await api.get(`/diet-plans/trainer/${trainerId}`);
    return response.data;
  },

  createDietPlan: async (data: any) => {
    const response = await api.post(`/diet-plans`, data);
    return response.data;
  },

  updateDietPlan: async (planId: any, data: any) => {
    const response = await api.put(`/diet-plans/${planId}`, data);
    return response.data;
  },

  getTrainerMeals: async (trainerId: number) => {
    const response = await api.get(`/diet-plans/meal/trainer/${trainerId}`);
    return response.data;
  },

  createMeal: async (data: any) => {
    const response = await api.post(`/diet-plans/meal`, data);
    return response.data;
  },

  updateMeal: async (mealId: any, data: any) => {
    const response = await api.put(`/diet-plans/meal/${mealId}`, data);
    return response.data;
  },

  assignDietPlanToClient: async (clientId: number, data: any) => {
    const response = await api.post(`/clients/${clientId}/diet-assignments`, data);
    return response.data;
  },


  deleteMeal: async (mealId: number) => {
    const response = await api.delete(`/diet-plans/meal/${mealId}`);
    return response.data;
  },



  // Update client notes
  updateClientNotes: async (clientId: number | string, notes: string) => {
    const response = await api.put(`/clients/${clientId}/notes`, { notes });
    return response.data;
  },

  // Assign client to trainer
  assignClientToTrainer: async (
    clientId: number | string,
    trainerId: number | string,
    status: string
  ) => {
    console.log("Sending POST request to /client-trainer-relationships with:", {
      client_id: clientId,
      trainer_id: trainerId,
    });

    try {
      const response = await api.post("/client-trainer-relationships", {
        client_id: clientId,
        trainer_id: trainerId,
      });

      console.log("Response from server:", response.status, response.data);
      return response.data;
    } catch (error: any) {
      console.error("API call failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    }
  },

  // Assign workout plan to client with scheduled date
  assignClientWorkout: async (
    clientId: number | string,
    workoutPlanId: number | string,
    scheduledDate: string,
    assignedBy: number,
  ) => {
    try {
      const response = await api.post(
        `/clients/${clientId}/workout-assignments`,
        {
          workoutPlanId,
          scheduledDate,
          assignedBy
        },
      );
      console.log('assign daata of api', response?.data)
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  assignClientWeeklyGoal: async (
    client_id: number,
    created_by: any,
    title: string,
    week_start_date: any
  ) => {
    try {
      const response = await api.post(
        `/clients/${client_id}/weekly-goals`,
        {
          created_by,
          title,
          week_start_date
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error assigning weekly goal to client:", error);
      if (error?.response) {
        console.error("Response data:", error?.response.data);
        console.error("Response status:", error?.response.status);
      }
      throw error;
    }
  },

  updateClientWeeklyGoal: async ({ id, ...data }: any) => {
    try {
      const response = await api.put(
        `/clients/${data?.client_id}/weekly-goals/${id}`,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating weekly goal to client:", error);
      if (error?.response) {
        console.error("Response data:", error?.response.data);
        console.error("Response status:", error?.response.status);
      }
      throw error;
    }
  },

  // Update client-trainer relationship status
  updateClientTrainerRelationship: async (
    relationshipId: number | string,
    status: string,
  ) => {
    const response = await api.put(
      `/client-trainer-relationships/${relationshipId}`,
      { status },
    );
    return response.data;
  },

  // Workout Plan APIs
  getWorkoutPlans: async () => {
    const response = await api.get("/workout-plans");
    return response.data;
  },

  getWorkoutPlansByTrainer: async (trainerId: number) => {
    const response = await api.get(`/workout-plans/trainer/${trainerId}`);
    return response.data;
  },

  getWorkoutPlan: async (planId: number | string) => {
    const response = await api.get(`/workout-plans/${planId}`);
    return response.data;
  },

  createWorkoutPlan: async (planData: {
    name: string;
    description: string;
    difficulty: string;
    durationMinutes: number;
    caloriesBurned: number;
    exercises: Array<{ id: number | string; sets: number; reps: number }>;
  }) => {
    const response = await api.post("/workout-plans", planData);
    return response.data;
  },

  updateWorkoutPlan: async (
    planId: number | string,
    planData: {
      name: string;
      description: string;
      difficulty: string;
      durationMinutes: number;
      caloriesBurned: number;
      exercises: Array<{ id: number | string; sets: number; reps: number }>;
    },
  ) => {
    const response = await api.put(`/workout-plans/${planId}`, planData);
    return response.data;
  },

  deleteWorkoutPlan: async (planId: number | string) => {
    const response = await api.delete(`/workout-plans/${planId}`);
    return response.data;
  },

  // Exercise APIs
  getExercises: async () => {
    const response = await api.get("/exercises");
    return response.data;
  },

  // Exercise APIs
  getExercisesByTrainer: async (trainerId: number) => {
    const response = await api.get(`/exercises/getExerciseByTrainer/${trainerId}`);
    return response.data;
  },



  getExercise: async (exerciseId: number | string) => {
    const response = await api.get(`/exercises/${exerciseId}`);
    return response.data;
  },

  createExercise: async (exerciseData: {
    name: string;
    description: string;
    imageUrl?: string;
    instructions: string;
    created_by: number
  }) => {
    const response = await api.post("/exercises", exerciseData);
    return response.data;
  },

  updateExercise: async (
    exerciseId: number | string,
    exerciseData: {
      name: string;
      description: string;
      imageUrl?: string;
      instructions: string;
      created_by: number
    },
  ) => {
    const response = await api.put(`/exercises/${exerciseId}`, exerciseData);
    return response.data;
  },

  deleteExercise: async (exerciseId: number | string) => {
    const response = await api.delete(`/exercises/${exerciseId}`);
    return response.data;
  },
};

export default api;
