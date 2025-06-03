import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { useRouter } from "expo-router";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store
