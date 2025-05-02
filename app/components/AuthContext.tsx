import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "client" | "trainer" | null;

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
  resetPassword: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock user database - will be supplemented with users from AsyncStorage
  const [users, setUsers] = useState([
    {
      email: "client@example.com",
      password: "client123",
      role: "client" as const,
    },
    {
      email: "trainer@example.com",
      password: "trainer123",
      role: "trainer" as const,
    },
  ]);

  useEffect(() => {
    // Check if user is already logged in and load any saved users
    const initializeAuth = async () => {
      try {
        // Check login status
        const storedRole = await AsyncStorage.getItem("user_role");
        const loggedIn = await AsyncStorage.getItem("is_logged_in");

        console.log(
          "AuthContext init - stored role:",
          storedRole,
          "logged in:",
          loggedIn,
        );

        if (storedRole && loggedIn === "true") {
          console.log("Setting user role from storage to:", storedRole);
          setUserRole(storedRole as UserRole);
          setIsLoggedIn(true);
        }

        // Load any saved users
        const savedUsers = await AsyncStorage.getItem("mock_users");
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          // Merge default users with saved users, avoiding duplicates
          const defaultEmails = users.map((u) => u.email.toLowerCase());
          const newUsers = [
            ...users,
            ...parsedUsers.filter(
              (u) => !defaultEmails.includes(u.email.toLowerCase()),
            ),
          ];
          setUsers(newUsers);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt with email:", email);

    // Find user in our mock database
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (user) {
      try {
        console.log("User found, role:", user.role);

        // First update the state
        setUserRole(user.role);
        setIsLoggedIn(true);

        // Then store in AsyncStorage
        await AsyncStorage.setItem("user_role", user.role);
        await AsyncStorage.setItem("is_logged_in", "true");

        console.log("Login successful, user role set to:", user.role);

        // Double check that the state was updated
        setTimeout(() => {
          console.log("After login, current userRole state:", user.role);
        }, 100);

        return true;
      } catch (error) {
        console.error("Error storing auth data:", error);
        return false;
      }
    }
    console.log("User not found with email:", email);
    return false;
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("user_role");
      await AsyncStorage.setItem("is_logged_in", "false");

      setUserRole(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    console.log("Password reset attempt for email:", email);

    // Check if the email exists in our mock database
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      // In a real app, this would send an email with a reset link
      console.log("Password reset email sent to:", email);
      return true;
    }

    console.log("Email not found for password reset:", email);
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isLoggedIn, login, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
