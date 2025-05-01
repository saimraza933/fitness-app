import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "client" | "trainer" | null;

interface AuthContextType {
  userRole: UserRole;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userRole: null,
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock user database
  const users = [
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
  ];

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("user_role");
        const loggedIn = await AsyncStorage.getItem("is_logged_in");

        if (storedRole && loggedIn === "true") {
          setUserRole(storedRole as UserRole);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user in our mock database
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (user) {
      try {
        // Store user role and login status
        await AsyncStorage.setItem("user_role", user.role);
        await AsyncStorage.setItem("is_logged_in", "true");

        setUserRole(user.role);
        setIsLoggedIn(true);
        return true;
      } catch (error) {
        console.error("Error storing auth data:", error);
        return false;
      }
    }
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

  return (
    <AuthContext.Provider value={{ userRole, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
