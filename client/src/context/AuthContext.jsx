import { createContext, useContext, useEffect, useState } from "react";
import { api, apiPublic } from "../axios/axios";
import { socket } from "../socket/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Socket: connect & register only when user is known ──────────────
  useEffect(() => {
    if (!user) {
      // Clean disconnect when logged out
      if (socket.connected) socket.disconnect();
      return;
    }

    // Use _id — this is what your JWT payload and /auth/me both return
    const userId = user._id ?? user.id;

    socket.connect();

    // Wait for connection before registering so the server
    // always maps this userId → socketId correctly
    const onConnect = () => {
      socket.emit("register", userId);
    };

    // If already connected (e.g. hot reload), register immediately
    if (socket.connected) {
      socket.emit("register", userId);
    } else {
      socket.on("connect", onConnect);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, [user]);

  // ── Load user on mount ───────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get("/auth/me");
        setUser(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const register = async (formData) => {
    if (formData.role === "ADMIN") {
      return apiPublic.post("/auth/register/organizer", formData);
    }
    return apiPublic.post("/auth/register/volunteer", formData);
  };

  const login = async (email, password) => {
    const data = await apiPublic.post("/auth/login", { email, password });
    if (data.status === "success") {
      setUser(data.data);
      sessionStorage.setItem("rt", data.data.refreshToken);
      sessionStorage.setItem("id", data.data.id);
      sessionStorage.setItem("at", data.data.accessToken);
      return data;
    }
    return new Error(data);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    return null;
  };

  const refreshUser = async () => {
    try {
      const data = await api.get("/auth/me");
      if (data?.data) setUser(data.data);
    } catch (_) {}
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, register, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuth = {
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  refreshUser: async () => {},
};

export const useAuth = () => useContext(AuthContext) ?? defaultAuth;
