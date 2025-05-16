"use client";

import type { User, UserRole } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  signup: (email: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from storage
    const storedUser = localStorage.getItem("shopswift-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: UserRole) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = { id: Date.now().toString(), email, role, name: email.split('@')[0] };
      setUser(newUser);
      localStorage.setItem("shopswift-user", JSON.stringify(newUser));
      setIsLoading(false);
    }, 500);
  };

  const signup = (email: string, role: UserRole) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = { id: Date.now().toString(), email, role, name: email.split('@')[0] };
      setUser(newUser);
      localStorage.setItem("shopswift-user", JSON.stringify(newUser));
      setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shopswift-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
