"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, getCurrentUser, signIn, signUp, signOut } from "../../lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing auth...");
        const { user, error } = await getCurrentUser();
        console.log("Initial user state:", { user, error });
        if (error) {
          console.error("Error getting current user:", error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    console.log("Handling sign in...");
    const { user: newUser, error } = await signIn(email, password);
    console.log("Sign in result:", { newUser, error });
    if (newUser) {
      setUser(newUser);
    }
    return { user: newUser, error };
  };

  const handleSignUp = async (email: string, password: string) => {
    const { user: newUser, error } = await signUp(email, password);
    if (newUser) {
      setUser(newUser);
    }
    return { user: newUser, error };
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
