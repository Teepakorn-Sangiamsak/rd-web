import { create } from "zustand";
import { challengeService } from "../services/api";
import { toast } from "react-toastify";

const useChallengeStore = create((set, get) => ({
  // สถานะข้อมูล
  challenges: [],
  userChallenges: [],
  userCreatedChallenges: [],
  isLoading: false,
  error: null,
  
  // สำหรับการแสดงผลหน้าเพิ่ม challenge
  showCreateModal: false,

  // ดึงชาเลนจ์ทั้งหมด (public)
  fetchChallenges: async () => {
    set({ isLoading: true });
    try {
      const response = await challengeService.getAllChallenges();
      set({ challenges: response.data.challenges, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลชาเลนจ์" 
      });
    }
  },

  // ดึงชาเลนจ์ที่ผู้ใช้เข้าร่วม
  fetchUserChallenges: async () => {
    set({ isLoading: true });
    try {
      const response = await challengeService.getUserChallenges();
      set({ userChallenges: response.data.userChallenges, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลชาเลนจ์ของผู้ใช้" 
      });
    }
  },

  // ดึงชาเลนจ์ที่ผู้ใช้สร้าง
  fetchUserCreatedChallenges: async () => {
    set({ isLoading: true });
    try {
      const response = await challengeService.getUserCreatedChallenges();
      set({ userCreatedChallenges: response.data.challenges, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลชาเลนจ์ที่สร้าง" 
      });
    }
  },

  // สร้างชาเลนจ์ใหม่
  createChallenge: async (data) => {
    set({ isLoading: true });
    try {
      const response = await challengeService.createChallenge(data);
      
      // อัพเดตสถานะและเก็บข้อมูลใหม่
      const newChallenge = response.data.challenge;
      set((state) => ({ 
        challenges: [...state.challenges, newChallenge],
        userCreatedChallenges: [...state.userCreatedChallenges, newChallenge],
        isLoading: false,
        showCreateModal: false
      }));
      
      toast.success("สร้างชาเลนจ์สำเร็จ");
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "สร้างชาเลนจ์ไม่สำเร็จ");
      return false;
    }
  },

  // เข้าร่วมชาเลนจ์
  joinChallenge: async (challengeId) => {
    try {
      await challengeService.joinChallenge(challengeId);
      
      // ดึงข้อมูลใหม่เพื่ออัพเดตสถานะ
      get().fetchUserChallenges();
      
      toast.success("เข้าร่วมชาเลนจ์สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "เข้าร่วมชาเลนจ์ไม่สำเร็จ");
      return false;
    }
  },

  // ส่งหลักฐานชาเลนจ์
  submitProof: async (challengeId, formData) => {
    set({ isLoading: true });
    try {
      await challengeService.submitProof(challengeId, formData);
      set({ isLoading: false });
      toast.success("ส่งหลักฐานสำเร็จ");
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || "ส่งหลักฐานไม่สำเร็จ");
      return false;
    }
  },

  // ลบชาเลนจ์
  deleteChallenge: async (challengeId) => {
    try {
      await challengeService.deleteChallenge(challengeId);
      
      // อัพเดตสถานะ
      set((state) => ({
        challenges: state.challenges.filter(challenge => challenge.id !== challengeId),
        userCreatedChallenges: state.userCreatedChallenges.filter(
          challenge => challenge.id !== challengeId
        )
      }));
      
      toast.success("ลบชาเลนจ์สำเร็จ");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "ลบชาเลนจ์ไม่สำเร็จ");
      return false;
    }
  },
  
  // สลับสถานะ modal
  toggleCreateModal: () => {
    set((state) => ({ showCreateModal: !state.showCreateModal }));
  }
}));

export default useChallengeStore;