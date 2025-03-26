import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Loading from "../../components/common/Loading";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoginError(null);
    const result = await login(data);
    
    if (result.success) {
      if (result.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/profile");
      }
    } else {
      setLoginError(result.message);
    }
  };

  return (
    <motion.div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {isLoading && <Loading fullScreen />}
      
      <motion.div
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-[400px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-center text-3xl font-semibold mb-6">
          Challenge System
        </h1>
        <h2 className="text-center text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
        
        {loginError && (
          <motion.div 
            className="bg-red-500 bg-opacity-20 text-red-300 p-3 rounded-md mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {loginError}
          </motion.div>
        )}
        
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้หรืออีเมล"
              {...register("identity", { required: "กรุณากรอกชื่อผู้ใช้หรืออีเมล" })}
              className={`w-full p-3 pl-10 rounded-md bg-gray-800 border ${
                errors.identity ? "border-red-500" : "border-gray-700"
              } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              disabled={isLoading}
            />
            {errors.identity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identity.message}
              </p>
            )}
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
              className={`w-full p-3 pl-10 pr-10 rounded-md bg-gray-800 border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-between">
            <motion.button
              type="button"
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              สมัครสมาชิก
            </motion.button>
            <motion.button
              type="submit"
              className="bg-blue-500 px-6 py-2 rounded-md hover:bg-blue-600 transition text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              เข้าสู่ระบบ
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}