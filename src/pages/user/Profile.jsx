import React, { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  if (!user) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <img
            src={user.profileImage || `https://robohash.org/${user.username}.png`}
            alt="User Avatar"
            className="w-24 h-24 mx-auto rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold">Welcome, {user.username}!</h2>
        </div>

        <div className="space-y-2 mb-6">
          <p><span className="font-semibold">Level:</span> {user.level || 1}</p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <div
                style={{ width: `${(user.exp || 0) / 10}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
            <p className="text-sm text-gray-400">{user.exp || 0}/1000 XP</p>
          </div>
        </div>

        <motion.button
          onClick={() => navigate("/user/challenges")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300 w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Challenge
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
