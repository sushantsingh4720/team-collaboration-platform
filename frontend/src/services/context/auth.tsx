import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextType, BackendRegisterData, User } from "@/types";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/config/firebase";
import { authAPI } from "../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Get user profile from backend
            const response = await authAPI.getProfile();
            setUser(response.data.user);
          } catch (error) {
            console.error("Failed to get user profile:", error);
            // If backend profile doesn't exist, redirect to complete registration
            // if ((error as any).response?.status === 404) {
            //   window.location.href = "/complete-registration";
            // }
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);

    // Backend login is handled via token in interceptor
    const response = await authAPI.getProfile();
    setUser(response.data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    // First create Firebase user
    await createUserWithEmailAndPassword(auth, email, password);

    await authAPI.register({ email, name });
    const response = await authAPI.getProfile();
    setUser(response.data.user);
    // // Store user data for backend registration
    // localStorage.setItem(
    //   "pendingRegistration",
    //   JSON.stringify({ email, name })
    // );

    // // Redirect to complete registration (for team selection, etc.)
    // window.location.href = "/complete-registration";
  };

  const backendRegister = async (userData: BackendRegisterData) => {
    const response = await authAPI.register(userData);
    setUser(response.data.user);
    // localStorage.removeItem("pendingRegistration");
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    backendRegister,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
