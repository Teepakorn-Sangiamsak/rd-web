import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import ProfilePage from "../pages/user/Profile";
import SettingsPage from "../pages/user/SettingsPage";
import ChallengePage from "../pages/challenge/ChallengePage";
import MyChallengePage from "../pages/challenge/MyChallenge";
import PublicChallengePage from "../pages/challenge/PublicChallenge";
import DailyChallengePage from "../pages/challenge/DailyChallenge";
import AdminDashboard from "../pages/admin/AdminDashboard";


// 🔒 Private Route ตรวจสอบการ Login และ Role
const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {/* แสดง Navbar กับ Sidebar เฉพาะที่จำเป็น */}
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <Sidebar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Private Routes [User] */}
        <Route path="/user/profile" element={<PrivateRoute role="USER"><ProfilePage /></PrivateRoute>} />
        <Route path="/user/settings" element={<PrivateRoute role="USER"><SettingsPage /></PrivateRoute>} />
        <Route path="/user/challenges" element={<PrivateRoute role="USER"><ChallengePage /></PrivateRoute>} />
        <Route path="/user/my-challenges" element={<PrivateRoute role="USER"><MyChallengePage /></PrivateRoute>} />
        <Route path="/user/public-challenges" element={<PrivateRoute role="USER"><PublicChallengePage /></PrivateRoute>} />
        <Route path="/user/daily-challenges" element={<PrivateRoute role="USER"><DailyChallengePage /></PrivateRoute>} />

        {/* Private Routes [Admin] */}
        <Route path="/admin/dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />

        {/* Redirect ตาม Role หลัง Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/user/profile" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all Route (404) */}
        <Route path="*" />
      </Routes>
    </>
  );
};

export default AppRouter;
