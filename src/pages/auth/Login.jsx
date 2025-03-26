import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/profile");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await login(data);  // ✅ เปลี่ยนตรงนี้
    if (result.success) {
      toast.success("เข้าสู่ระบบสำเร็จ!", { autoClose: 2000 });
      if (result.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/profile");
      }
    } else {
      toast.error(result.message || "เข้าสู่ระบบล้มเหลว", { autoClose: 3000 });
    }
  };

  return (
    <motion.div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-[400px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-center text-3xl font-semibold mb-6">
          ReforgeDestiny
        </h1>
        <h2 className="text-center text-xl font-bold mb-4">Sign in</h2>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Enter username or email"
            {...register("identity", { required: "กรุณากรอกข้อมูล" })}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.identity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.identity.message}
            </p>
          )}
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-6 py-2 rounded-md hover:bg-blue-600 transition text-white"
            >
              Login
            </button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
