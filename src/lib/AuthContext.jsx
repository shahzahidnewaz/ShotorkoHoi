import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authClient from "./authClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await authClient.me();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (credentials) => {
    const u = await authClient.login(credentials);
    setUser(u);
    return u;
  }, []);

  const register = useCallback((details) => authClient.register(details), []);

  const logout = useCallback(async () => {
    await authClient.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (changes) => {
    const u = await authClient.updateProfile(changes);
    setUser(u);
    return u;
  }, []);

  const value = { user, loading, login, register, logout, refresh, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
