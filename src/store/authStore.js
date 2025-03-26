import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { authService, userService } from "../services/api";
import { toast } from "react-toastify";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(data);
          const { token, user } = res.data;
          localStorage.setItem("token", token);
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "เข้าสู่ระบบล้มเหลว" 
          });
          return { 
            success: false, 
            message: error.response?.data?.message || "เข้าสู่ระบบล้มเหลว"
          };
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(data);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "สมัครสมาชิกล้มเหลว" 
          });
          return { 
            success: false, 
            message: error.response?.data?.message || "สมัครสมาชิกล้มเหลว"
          };
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
        
        set({ isLoading: true });
        try {
          const res = await authService.getCurrentUser();
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          localStorage.removeItem("token");
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const res = await userService.getProfile();
          set({ user: res.data.user, isLoading: false });
          return res.data.user;
        } catch (error) {
          set({ isLoading: false });
          return null;
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const res = await userService.updateProfile(data);
          set({ user: res.data.user, isLoading: false });
          toast.success("อัพเดทโปรไฟล์สำเร็จ");
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      updatePassword: async (data) => {
        set({ isLoading: true });
        try {
          await userService.updatePassword(data);
          set({ isLoading: false });
          toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
          return true;
        } catch (error) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || "เปลี่ยนรหัสผ่านล้มเหลว");
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;