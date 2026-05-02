import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "codefolio_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me", { token });
        if (mounted) setUser(data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (mounted) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, [token]);

  const signIn = async (email, password) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signUp = async (name, email, password) => {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, signIn, signUp, signOut, isAuthenticated: Boolean(user) }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
