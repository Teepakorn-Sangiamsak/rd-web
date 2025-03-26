import axios from 'axios';
import { toast } from 'react-toastify';

// สร้าง axios instance พร้อมการตั้งค่าพื้นฐาน
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม interceptor สำหรับ request
api.interceptors.request.use(
  (config) => {
    // ใส่ token ทุกครั้งที่มีการเรียก API (ยกเว้น login, register)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// เพิ่ม interceptor สำหรับ response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // จัดการ error จาก API
    const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    
    // แสดง error เฉพาะกรณีที่ไม่ใช่ 401 (Unauthorized)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    // หาก token หมดอายุ (401) และไม่ได้กำลังล็อกอิน
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      toast.error('กรุณาเข้าสู่ระบบใหม่');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Authentication Service
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// User Service
export const userService = {
  updateProfile: (data) => api.patch('/user/update-profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePassword: (data) => api.patch('/user/update-password', data),
  deleteAccount: () => api.delete('/user/delete-account'),
  getProfile: () => api.get('/user/profile'),
  getChallengeHistory: () => api.get('/user/challenge-history'),
  getBadges: () => api.get('/user/badges'),
  submitProof: (challengeId, formData) => api.patch(`/user/challenges/${challengeId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Challenge Service
export const challengeService = {
  getAllChallenges: () => api.get('/challenges'),
  getUserChallenges: () => api.get('/user/challenges'),
  getUserCreatedChallenges: () => api.get('/user/created-challenges'),
  createChallenge: (data) => api.post('/challenges', data),
  joinChallenge: (challengeId) => api.post(`/challenges/${challengeId}/join`),
  deleteChallenge: (challengeId) => api.delete(`/challenges/${challengeId}/cancel`),
};

// Badge Service
export const badgeService = {
  getAllBadges: () => api.get('/badges'),
  getEligibleBadges: () => api.get('/user/badges/eligible'),
};

// Admin Service
export const adminService = {
  getUsers: () => api.get('/admin/users'),
  banUser: (userId) => api.post('/admin/ban-user', { userId }),
  unbanUser: (userId) => api.post('/admin/unban-user', { userId }),
  checkProof: (challengeId, proofId, status) => 
    api.patch(`/admin/challenges/${challengeId}/proof/${proofId}`, { status }),
  getChallenges: () => api.get('/admin/challenges'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;