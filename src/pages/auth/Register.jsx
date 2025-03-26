import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setPasswordError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    setPasswordError("");

    try {
      await axios.post("http://localhost:8080/api/auth/register", data);
      toast.success("สมัครสมาชิกสำเร็จ! 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "สมัครสมาชิกล้มเหลว";
      setError("username", { type: "manual", message: errorMessage });
      toast.error(errorMessage);
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
        <h1 className="text-center text-3xl font-semibold mb-2">
          ReforgeDestiny
        </h1>
        <h2 className="text-center text-xl font-bold mb-4">
          Create your account
        </h2>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { name: "username", icon: <User />, placeholder: "Username" },
            { name: "firstname", icon: <User />, placeholder: "Firstname" },
            { name: "lastname", icon: <User />, placeholder: "Lastname" },
            {
              name: "email",
              icon: <Mail />,
              placeholder: "Email",
              type: "email",
            },
          ].map((field, idx) => (
            <motion.div className="relative" key={idx}>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {field.icon}
              </span>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: `กรุณากรอก${field.placeholder}`,
                })}
                className={`w-full p-3 pl-12 rounded-md bg-gray-800 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-700"
                } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </motion.div>
          ))}

          {[
            { name: "password", placeholder: "Password" },
            { name: "confirmPassword", placeholder: "Confirm Password" },
          ].map((field, idx) => (
            <motion.div className="relative" key={idx}>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                <Lock />
              </span>
              <input
                type="password"
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: `กรุณากรอก${field.placeholder}`,
                  minLength: {
                    value: 6,
                    message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                  },
                })}
                className={`w-full p-3 pl-12 rounded-md bg-gray-800 border ${
                  errors[field.name] || passwordError
                    ? "border-red-500"
                    : "border-gray-700"
                } text-white focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {(errors[field.name] || passwordError) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]?.message || passwordError}
                </p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full bg-green-500 px-6 py-2 rounded-md hover:bg-green-600 transition text-white font-bold"
          >
            Sign up
          </motion.button>

          <motion.button
            type="button"
            className="w-full mt-2 border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition flex items-center gap-2"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft size={16} />
            Back to Login
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
