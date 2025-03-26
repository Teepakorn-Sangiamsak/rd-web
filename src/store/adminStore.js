import { create } from "zustand";
import { adminService } from "../services/api";
import { toast } from "react-toastify";

const useAdminStore = create((set) => ({
  users: [],
  categories: [],
  challengeProofs: [],
  isLoading: false,
  error: null,

  // ดึงรายชื่อผู้ใช้ทั้งหมด
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await adminService.getUsers();
      set({ users: response.data.users, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" 
      });
    }
  },

  // แบนผู้ใช้
  banUser: async (userId) => {
    try {
      await adminService.banUser(userId);
      
      // อัพเดตสถานะ
      set((state) => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, bannedUser: { id: userId, reason: "ถูกแบนโดยผู้ดูแลระบบ" } } : user
        )
      }));
      
      toast.success("แบนผู้ใช้สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "แบนผู้ใช้ไม่สำเร็จ");
      return false;
    }
  },

  // ปลดแบนผู้ใช้
  unbanUser: async (userId) => {
    try {
      await adminService.unbanUser(userId);
      
      // อัพเดตสถานะ
      set((state) => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, bannedUser: null } : user
        )
      }));
      
      toast.success("ปลดแบนผู้ใช้สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ปลดแบนผู้ใช้ไม่สำเร็จ");
      return false;
    }
  },

  // ตรวจสอบหลักฐาน
  checkProof: async (challengeId, proofId, status) => {
    try {
      await adminService.checkProof(challengeId, proofId, status);
      
      // อัพเดตสถานะ
      set((state) => ({
        challengeProofs: state.challengeProofs.map(proof => 
          proof.id === proofId ? { ...proof, status } : proof
        )
      }));
      
      toast.success(`ตรวจสอบหลักฐานแล้ว: ${status === "APPROVED" ? "อนุมัติ" : "ปฏิเสธ"}`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ตรวจสอบหลักฐานไม่สำเร็จ");
      return false;
    }
  },

  // สร้างหมวดหมู่
  createCategory: async (data) => {
    try {
      const response = await adminService.createCategory(data);
      
      // อัพเดตสถานะ
      set((state) => ({
        categories: [...state.categories, response.data.category]
      }));
      
      toast.success("สร้างหมวดหมู่สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "สร้างหมวดหมู่ไม่สำเร็จ");
      return false;
    }
  },

  // อัพเดตหมวดหมู่
  updateCategory: async (id, data) => {
    try {
      const response = await adminService.updateCategory(id, data);
      
      // อัพเดตสถานะ
      set((state) => ({
        categories: state.categories.map(category => 
          category.id === id ? response.data.category : category
        )
      }));
      
      toast.success("อัพเดตหมวดหมู่สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "อัพเดตหมวดหมู่ไม่สำเร็จ");
      return false;
    }
  },

  // ลบหมวดหมู่
  deleteCategory: async (id) => {
    try {
      await adminService.deleteCategory(id);
      
      // อัพเดตสถานะ
      set((state) => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
      
      toast.success("ลบหมวดหมู่สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ลบหมวดหมู่ไม่สำเร็จ");
      return false;
    }
  }
}));

export default useAdminStore;