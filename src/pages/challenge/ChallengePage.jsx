import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChallengePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Select Your Challenge</h2>
      <div className="flex gap-6">
        <motion.button
          className="w-48 h-64 bg-indigo-600 text-white rounded-lg shadow-md flex flex-col justify-center items-center hover:bg-green-500 transition duration-300"
          onClick={() => navigate("/user/my-challenges")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3 className="text-xl font-semibold mb-2">My Challenge</h3>
          
        </motion.button>

        <motion.button
          className="w-48 h-64 bg-indigo-600 text-white rounded-lg shadow-md flex flex-col justify-center items-center hover:bg-green-500 transition duration-300"
          onClick={() => navigate("/user/daily-challenges")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3 className="text-xl font-semibold mb-2">Daily Challenge</h3>
          
        </motion.button>

        <motion.button
          className="w-48 h-64 bg-indigo-600 text-white rounded-lg shadow-md flex flex-col justify-center items-center hover:bg-green-500 transition duration-300"
          onClick={() => navigate("/user/public-challenges")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3 className="text-xl font-semibold mb-2">Public Challenge</h3>
          
        </motion.button>
      </div>
    </div>
  );
};

export default ChallengePage;
