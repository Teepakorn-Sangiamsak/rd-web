import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Lock } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import Loading from "../../components/common/Loading";

const SettingsPage = () => {
  const { user, updateProfile, updatePassword, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    profileImage: null,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  // โหลดข้อมูลผู้ใช้เมื่อหน้าโหลด
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        profileImage: null
      });
    }
  }, [user]);

  // อัปเดตรูปโปรไฟล์
// ตัวอย่าง handleFileChange ใน SettingsPage
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // ยกเลิก URL ของรูปตัวอย่างเดิม (ถ้ามี) เพื่อป้องกัน memory leak
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    
    setFormData({ ...formData, profileImage: file });
    setPreviewImage(URL.createObjectURL(file));
  }
};

  // อัปเดตชื่อและนามสกุล
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // อัปเดตรหัสผ่าน
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // อัปเดตโปรไฟล์
  const handleUpdateProfile = async () => {
    // สร้าง FormData
    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    // ใช้ updateProfile จาก store
    const success = await updateProfile(data);
    if (success) {
      setPreviewImage(null); // รีเซ็ตรูปตัวอย่าง
    }
  };

  // อัปเดตรหัสผ่าน
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    
    setPasswordError("");
    const success = await updatePassword(passwordData);
    if (success) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    // JSX เหมือนเดิม แต่เรียกใช้ฟังก์ชั่นที่อัพเดตแล้ว
    // และแสดง Loading เมื่อ isLoading เป็น true
    <div className="p-8 bg-[#1E2139] min-h-screen text-white flex items-center justify-center">
      {isLoading && <Loading />}
      {/* ส่วนที่เหลือเหมือนเดิม */}
    </div>
  );
};

export default SettingsPage;