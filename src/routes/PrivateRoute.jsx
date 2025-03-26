import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export const UserRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== "USER") return <Navigate to="/user/profile" />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== "ADMIN") return <Navigate to="/admin/dashboard" />;
  return children;
};
