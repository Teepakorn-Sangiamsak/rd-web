import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud, Lock } from "lucide-react";

const SettingsPage = () => {
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 🖼️ อัปเดตรูปโปรไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // 📝 อัปเดตชื่อและนามสกุล
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔒 อัปเดตรหัสผ่าน
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // ✅ อัปเดตโปรไฟล์
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      setIsUpdating(true);
      const res = await axios.patch("http://localhost:8080/api/user/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // บันทึกข้อมูลใหม่ลง Local Storage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));  // 🔄 แจ้งให้หน้า ProfilePage โหลดข้อมูลใหม่

      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Failed to update profile:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to update profile"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔄 อัปเดตรหัสผ่าน
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      setIsUpdating(true);
      await axios.patch("http://localhost:8080/api/user/update-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Password updated successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
    } catch (error) {
      console.log("Failed to update password:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to update password"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 bg-[#1E2139] min-h-screen text-white flex items-center justify-center">
      <motion.div
        className="bg-[#2C2F48] p-8 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl mb-6 text-center">Settings</h2>

        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
              <img
                src={
                  previewImage ||
                  JSON.parse(localStorage.getItem("user"))?.profileImage ||
                  `https://robohash.org/default.png?set=set4&size=150x150`
                }
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <UploadCloud className="text-white" />
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profileImage"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <input
          type="text"
          name="firstname"
          placeholder="Firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-[#2C2F48] border border-gray-600 text-white mb-2"
        />
        <input
          type="text"
          name="lastname"
          placeholder="Lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-[#2C2F48] border border-gray-600 text-white mb-4"
        />

        <motion.button
          onClick={handleUpdateProfile}
          className={`w-full py-2 rounded mb-6 ${isUpdating ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"} text-white transition`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating Profile..." : "Save Profile"}
        </motion.button>

        <h3 className="text-xl mb-4 flex items-center">
          <Lock className="mr-2" /> Change Password
        </h3>

        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-2 rounded bg-[#2C2F48] border border-gray-600 text-white"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-2 rounded bg-[#2C2F48] border border-gray-600 text-white"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-4 rounded bg-[#2C2F48] border border-gray-600 text-white"
        />

        {passwordError && <p className="text-red-500 mb-2 text-center">{passwordError}</p>}

        <motion.button
          onClick={handleChangePassword}
          className="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating Password..." : "Change Password"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
