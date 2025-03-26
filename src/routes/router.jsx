import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loading from "../components/common/Loading";

// Lazy load components for better performance
const LoginPage = lazy(() => import("../pages/auth/Login"));
const RegisterPage = lazy(() => import("../pages/auth/Register"));
const ProfilePage = lazy(() => import("../pages/user/Profile"));
const SettingsPage = lazy(() => import("../pages/user/SettingsPage"));
const ChallengePage = lazy(() => import("../pages/challenge/ChallengePage"));
const MyChallengePage = lazy(() => import("../pages/challenge/MyChallenge"));
const PublicChallengePage = lazy(() => import("../pages/challenge/PublicChallenge"));
const DailyChallengePage = lazy(() => import("../pages/challenge/DailyChallenge"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const ManageChallenges = lazy(() => import("../pages/admin/ManageChallenges"));

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return user?.role === "ADMIN" 
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/profile" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Layout for authenticated users
  const AuthenticatedLayout = ({ children }) => (
    <>
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-0 md:pl-64 min-h-screen bg-[#1E2139]">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </>
  );

  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/" /> 
              : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated 
              ? <Navigate to="/" /> 
              : <RegisterPage />
          } 
        />

        {/* User Routes */}
        <Route 
          path="/user/profile" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <ProfilePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/settings" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <SettingsPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/challenges" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <ChallengePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/my-challenges" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <MyChallengePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/public-challenges" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <PublicChallengePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/daily-challenges" 
          element={
            <ProtectedRoute role="USER">
              <AuthenticatedLayout>
                <DailyChallengePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="ADMIN">
              <AuthenticatedLayout>
                <AdminDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-users" 
          element={
            <ProtectedRoute role="ADMIN">
              <AuthenticatedLayout>
                <ManageUsers />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-challenges" 
          element={
            <ProtectedRoute role="ADMIN">
              <AuthenticatedLayout>
                <ManageChallenges />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect based on role */}
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

        {/* 404 Page */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">ไม่พบหน้าที่คุณกำลังค้นหา</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  กลับไปหน้าก่อนหน้า
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;