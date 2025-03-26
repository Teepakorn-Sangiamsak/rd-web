import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Bell, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-[#2C2F48] text-white flex justify-between items-center p-4 shadow-md relative">
      <div className="flex items-center gap-x-4">
        <button className="text-2xl font-bold mr-4">LOGO</button>
        <Link to="/user/profile" className="text-white hover:text-gray-300">
          Profile
        </Link>
        <Link to="/user/challenges" className="text-white hover:text-gray-300">
          Challenges
        </Link>
      </div>
      <div className="flex items-center gap-x-4 relative">
        <Bell className="inline cursor-pointer text-white hover:text-gray-300" />
        <img
          src={user?.profileImage || `https://robohash.org/${user?.username}.png`}
          alt="User"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleDropdown}
        />

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/user/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="mr-2" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
