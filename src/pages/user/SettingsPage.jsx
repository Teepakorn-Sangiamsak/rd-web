import React, { Suspense, lazy } from "react";
import { Router, Routes, Route, Navigate, Outlet } from "react-router";
import { createBrowserHistory } from "history";
import useAuthStore from "../store/authStore";
import Loading from "../components/common/Loading";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

// Create history object
const history = createBrowserHistory();

// Lazy loaded pages
const LoginPage = lazy(() => import("../pages/auth/Login"));
const RegisterPage = lazy(() => import("../pages/auth/Register"));
const ProfilePage = lazy(() => import("../pages/user/Profile"));
const SettingsPage = lazy(() => import("../pages/user/SettingsPage"));
const ChallengePage = lazy(() => import("../pages/challenge/ChallengePage"));
const MyChallengePage = lazy(() => import("../pages/challenge/MyChallenge"));
const PublicChallengePage = lazy(() => import("../pages/challenge/PublicChallenge"));
const DailyChallengePage = lazy(() => import("../pages/challenge/DailyChallenge"));
const BadgesPage = lazy(() => import("../pages/user/BadgesPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const ManageChallenges = lazy(() => import("../pages/admin/ManageChallenges"));

// Wrapper for authenticated routes with layout
const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-0 md:pl-64 min-h-screen bg-[#1E2139]">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on user role
    return user?.role === "ADMIN" 
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/profile" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router navigator={history} location={history.location}>
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

          {/* User Routes (Authenticated) */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/settings" element={<SettingsPage />} />
            <Route path="/user/challenges" element={<ChallengePage />} />
            <Route path="/user/my-challenges" element={<MyChallengePage />} />
            <Route path="/user/public-challenges" element={<PublicChallengePage />} />
            <Route path="/user/daily-challenges" element={<DailyChallengePage />} />
            <Route path="/user/badges" element={<BadgesPage />} />
          </Route>

          {/* Admin Routes (Authenticated) */}
          <Route 
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-challenges" element={<ManageChallenges />} />
          </Route>

          {/* Root Route Redirect */}
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
                    onClick={() => history.back()} 
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
    </Router>
  );
};

export default AppRouter;