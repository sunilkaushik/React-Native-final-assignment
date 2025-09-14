import React, { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginRequest } from "../services/authApi";
import { getToken, saveToken, removeToken } from "../utils/secureStorage";

type AuthContextType = {
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const bootstrap = useCallback(async () => {
    try {
      const existing = await getToken();
      setToken(existing);
    } catch (e) {
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginRequest(email, password);
      await saveToken(res.token);
      setToken(res.token);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await removeToken();
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
