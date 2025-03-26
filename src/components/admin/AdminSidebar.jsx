// src/components/admin/AdminSidebar.jsx
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-5">
      <h2 className="text-2xl mb-5">Admin Panel</h2>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/manage-users">Manage Users</Link></li>
        <li><Link to="/admin/manage-challenges">Manage Challenges</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
