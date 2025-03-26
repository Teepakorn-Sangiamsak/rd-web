import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { User, LogOut, Settings, FileText, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-md focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">LOGO</h2>
              <nav className="space-y-4">
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2 hover:text-blue-400"
                >
                  <User className="icon" /> Profile
                </Link>
                <Link
                  to="/user/challenges"
                  className="flex items-center gap-2 hover:text-blue-400"
                >
                  <FileText className="icon" /> Challenges
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <Settings className="icon" /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400"
                >
                  <LogOut className="icon" /> Logout
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
