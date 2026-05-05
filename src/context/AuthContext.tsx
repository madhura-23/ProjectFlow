"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser, signOut as cognitoSignOut } from "@/lib/auth";

interface AuthUser { email: string; name: string; }
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => { setUser(u); setLoading(false); });
  }, []);

  const logout = () => { cognitoSignOut(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
