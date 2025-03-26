import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (data) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: res.data.user, isAuthenticated: true });
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
      }
    }
  },
}));

export default useAuthStore;
