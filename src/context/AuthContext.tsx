import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenStorage } from "../api/tokenStorage";
import * as authApi from "../api/auth";
import jwtDecode from "../utils/jwtDecode";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: number | null;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const access = await tokenStorage.getAccessToken();
      if (access) {
        setIsAuthenticated(true);
        setUserId(extractUserId(access));
      }
      setIsLoading(false);
    })();
  }, []);

  function extractUserId(accessToken: string): number | null {
    try {
      const decoded = jwtDecode<{ user_id?: number }>(accessToken);
      return decoded.user_id ?? null;
    } catch {
      return null;
    }
  }

  async function login(username: string, password: string) {
    const tokens = await authApi.login(username, password);
    await tokenStorage.setTokens(tokens.access, tokens.refresh);
    setUserId(extractUserId(tokens.access));
    setIsAuthenticated(true);
  }

  async function register(payload: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) {
    await authApi.register(payload);
    // Auto-login right after registration.
    await login(payload.username, payload.password);
  }

  async function logout() {
    await tokenStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
  }

  return (
    <AuthContext.Provider
      value={{ isLoading, isAuthenticated, userId, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
