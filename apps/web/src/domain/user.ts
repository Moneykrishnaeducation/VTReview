export type UserRole = "anonymous" | "registered" | "verified_trader" | "moderator" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  country: string;
  role: UserRole;
  isEmailVerified: boolean;
  hasVerifiedTradeHistory: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
}
