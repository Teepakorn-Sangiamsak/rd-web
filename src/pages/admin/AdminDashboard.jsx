import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ban, ShieldCheck } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8080/api/admin/ban-user",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error("Failed to ban user:", err);
    }
  };

  const handleUnbanUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8080/api/admin/unban-user",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error("Failed to unban user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="p-8 bg-[#1E2139] min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
      <table className="w-full bg-[#2C2F48] text-white rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-[#343850] text-left">
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-[#3D405A] hover:bg-[#2C2F48]"
            >
              <td className="p-4">{user.username}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className="p-4 flex space-x-2">
                {user.role !== "ADMIN" && (
                  <>
                    <button
                      onClick={() => handleBanUser(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-all flex items-center"
                    >
                      <Ban className="mr-1" size={16} /> Ban
                    </button>
                    <button
                      onClick={() => handleUnbanUser(user.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-all flex items-center"
                    >
                      <ShieldCheck className="mr-1" size={16} /> Unban
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
