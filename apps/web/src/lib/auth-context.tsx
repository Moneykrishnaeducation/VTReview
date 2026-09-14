import React, { createContext, useContext, useState, type ReactNode } from "react";
import { type UserProfile, type UserRole, type AuthSession } from "@/domain/user";

interface AuthContextType {
  session: AuthSession;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  canSubmitReview: () => boolean;
  canSubmitDispute: () => boolean;
  canModerate: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string, role: UserRole = "registered") => {
    setUser({
      id: `usr-${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      country: "United Kingdom",
      role,
      isEmailVerified: true,
      hasVerifiedTradeHistory: role === "verified_trader",
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  const session: AuthSession = {
    user,
    isAuthenticated: user !== null,
  };

  const canSubmitReview = () => {
    // Both registered and anonymous can initiate, but registered gets verified trader badge if proof provided
    return true;
  };

  const canSubmitDispute = () => {
    return user !== null;
  };

  const canModerate = () => {
    return user?.role === "moderator" || user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        canSubmitReview,
        canSubmitDispute,
        canModerate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
