

import React, { createContext, useState, useEffect, useMemo } from "react";
import API from "../utils/api.js";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User state (persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("tuser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("tuser", JSON.stringify(user));
    else localStorage.removeItem("tuser");
  }, [user]);

  // Axios interceptor to attach token
  useEffect(() => {
    const requestInterceptor = API.interceptors.request.use((config) => {
      const token = localStorage.getItem("ttoken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => API.interceptors.request.eject(requestInterceptor);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("ttoken", res.data.token);
      setUser(res.data.user);
      toast.success("Login successful!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("ttoken");
    localStorage.removeItem("tuser");
    setUser(null);
    toast.info("Logged out successfully");
  };

  // Helper to get token
  const getToken = () => localStorage.getItem("ttoken");

  // Memoize value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({ user, setUser, login, logout, loading, error, getToken }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
