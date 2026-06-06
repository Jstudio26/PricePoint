"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // 1. Lazy Initializer: Mengambil token saat state pertama kali dibuat
  // Ini mencegah render ganda (cascading renders)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Hanya gunakan useEffect untuk menandai bahwa Client sudah siap (Hydration)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  }, []);

  const login = useCallback(
    (newToken: string) => {
      localStorage.setItem("token", newToken);
      document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
      setToken(newToken);
      router.push("/");
    },
    [router],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setToken(null);
    router.push("/login");
  }, [router]);

  const authValue = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isInitialized,
    }),
    [token, isInitialized, login, logout],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
