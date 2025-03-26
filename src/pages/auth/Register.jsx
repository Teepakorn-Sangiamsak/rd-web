import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Loading from "../../components/common/Loading";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [registerError, setRegisterError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setRegisterError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    
    setRegisterError(null);
    const result = await registerUser(data);
    
    if (result.success) {
      // แสดง toast success อยู่ใน store แล้ว
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setRegisterError(result.message);
    }
  };

  const inputFields = [
    { name: "username", icon: <User size={18} />, placeholder: "ชื่อผู้ใช้" },
    { name: "firstname", icon: <User size={18} />, placeholder: "ชื่อจริง" },
    { name: "lastname", icon: <User size={18} />, placeholder: "นามสกุล" },
    { 
      name: "email", 
      icon: <Mail size={18} />, 
      placeholder: "อีเมล", 
      type: "email",
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "รูปแบบอีเมลไม่ถูกต้อง",
        }
      }
    },
  ];

  const passwordFields = [
    { 
      name: "password", 
      placeholder: "รหัสผ่าน", 
      show: showPassword,
      toggle: () => setShowPassword(!showPassword),
      validation: {
        minLength: {
          value: 6,
          message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        }
      }
    },
    { 
      name: "confirmPassword", 
      placeholder: "ยืนยันรหัสผ่าน", 
      show: showConfirmPassword,
      toggle: () => setShowConfirmPassword(!showConfirmPassword),
      customValidation: (value) => 
        value === password || "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"
    },
  ];

  return (
    <motion.div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {isLoading && <Loading fullScreen />}
      
      <motion.div
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-[400px] my-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-center text-3xl font-semibold mb-2">
          Challenge System
        </h1>
        <h2 className="text-center text-xl font-bold mb-4">
          สร้างบัญชีผู้ใช้
        </h2>

        {registerError && (
          <motion.div 
            className="bg-red-500 bg-opacity-20 text-red-300 p-3 rounded-md mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {registerError}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Normal input fields */}
          {inputFields.map((field, idx) => (
            <motion.div className="relative" key={idx}>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {field.icon}
              </span>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: `กรุณากรอก${field.placeholder}`,
                  ...field.validation
                })}
                className={`w-full p-3 pl-10 rounded-md bg-gray-800 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-700"
                } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
                disabled={isLoading}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </motion.div>
          ))}

          {/* Password fields */}
          {passwordFields.map((field, idx) => (
            <motion.div className="relative" key={idx}>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                <Lock size={18} />
              </span>
              <input
                type={field.show ? "text" : "password"}
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: `กรุณากรอก${field.placeholder}`,
                  ...field.validation,
                  validate: field.customValidation
                })}
                className={`w-full p-3 pl-10 pr-10 rounded-md bg-gray-800 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-700"
                } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={field.toggle}
              >
                {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full bg-green-500 px-6 py-2 rounded-md hover:bg-green-600 transition text-white font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            สร้างบัญชี
          </motion.button>

          <motion.button
            type="button"
            className="w-full mt-2 border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition flex items-center justify-center gap-2"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <ArrowLeft size={16} />
            กลับไปหน้าเข้าสู่ระบบ
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}