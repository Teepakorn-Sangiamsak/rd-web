import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 🔄 ดึงรายชื่อผู้ใช้เมื่อ Component โหลด
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 🔒 แบนผู้ใช้
    const banUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:8080/api/admin/ban-user`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("แบนผู้ใช้สำเร็จ");
            setUsers(users.map(user => user.id === userId ? { ...user, isBanned: true } : user));
        } catch (error) {
            toast.error("แบนผู้ใช้ล้มเหลว");
        }
    };

    // 🔓 ปลดแบนผู้ใช้
    const unbanUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:8080/api/admin/unban-user`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("ปลดแบนผู้ใช้สำเร็จ");
            setUsers(users.map(user => user.id === userId ? { ...user, isBanned: false } : user));
        } catch (error) {
            toast.error("ปลดแบนผู้ใช้ล้มเหลว");
        }
    };

    // 🗑️ ลบผู้ใช้
    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8080/api/admin/delete-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("ลบผู้ใช้สำเร็จ");
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            toast.error("ลบผู้ใช้ล้มเหลว");
        }
    };

    if (loading) {
        return <div className="text-center text-white">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="p-3">ID</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-700">
                            <td className="p-3 text-center">{user.id}</td>
                            <td className="p-3 text-center">{user.username}</td>
                            <td className="p-3 text-center">{user.email}</td>
                            <td className="p-3 text-center">{user.role}</td>
                            <td className="p-3 text-center flex justify-center gap-2">
                                {user.isBanned ? (
                                    <button
                                        className="text-green-500 hover:text-green-300"
                                        onClick={() => unbanUser(user.id)}
                                    >
                                        <Unlock size={20} />
                                    </button>
                                ) : (
                                    <button
                                        className="text-red-500 hover:text-red-300"
                                        onClick={() => banUser(user.id)}
                                    >
                                        <Lock size={20} />
                                    </button>
                                )}
                                <button
                                    className="text-red-500 hover:text-red-300"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    <Trash size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
