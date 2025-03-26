import React from "react";
import { motion } from "framer-motion";

const Loading = ({ fullScreen = false, text = "กำลังโหลด..." }) => {
  const loadingContainerStyle = fullScreen
    ? "fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    : "flex justify-center items-center py-10";

  return (
    <div className={loadingContainerStyle}>
      <div className="flex flex-col items-center">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="mt-4 text-white">{text}</p>
      </div>
    </div>
  );
};

export default Loading;