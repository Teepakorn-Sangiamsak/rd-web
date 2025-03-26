import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Award, 
  Target, 
  Ban, 
  ShieldCheck,
  Trash,
  MoreHorizontal,
  ClipboardCheck
} from "lucide-react";
import useAdminStore from "../../store/adminStore";
import Loading from "../../components/common/Loading";
import { adminService, challengeService } from "../../services/api";

const AdminDashboard = () => {
  const { users, fetchUsers, banUser, unbanUser, isLoading } = useAdminStore();
  const [challenges, setChallenges] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChallenges: 0,
    pendingProofs: 0,
    bannedUsers: 0,
  });
  const [activeTab, setActiveTab] = useState("users");
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch users
        await fetchUsers();
        
        // Fetch challenges
        const challengesRes = await challengeService.getAllChallenges();
        setChallenges(challengesRes.data.challenges);
        
        // Calculate stats
        const calculatedStats = {
          totalUsers: users.length,
          totalChallenges: challengesRes.data.challenges.length,
          pendingProofs: 0, // Would require a separate API
          bannedUsers: users.filter(user => user.bannedUser).length,
        };
        setStats(calculatedStats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [fetchUsers]);

  const handleBanUser = async (userId) => {
    await banUser(userId);
  };

  const handleUnbanUser = async (userId) => {
    await unbanUser(userId);
  };

  // Filter options for users table
  const [userFilter, setUserFilter] = useState("");
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(userFilter.toLowerCase())
  );

  if (isLoading || loadingData) {
    return <Loading />;
  }

  return (
    <div className="p-8 bg-[#1E2139] min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">แผงควบคุมผู้ดูแลระบบ</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "ผู้ใช้ทั้งหมด", value: stats.totalUsers, icon: <Users className="text-blue-400" size={24} /> },
          { title: "ชาเลนจ์ทั้งหมด", value: stats.totalChallenges, icon: <Target className="text-green-400" size={24} /> },
          { title: "หลักฐานที่รอตรวจสอบ", value: stats.pendingProofs, icon: <ClipboardCheck className="text-yellow-400" size={24} /> },
          { title: "ผู้ใช้ที่ถูกแบน", value: stats.bannedUsers, icon: <Ban className="text-red-400" size={24} /> },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-[#2C2F48] p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="bg-[#343850] p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#343850] mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "users" 
              ? "text-blue-400 border-b-2 border-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("users")}
        >
          จัดการผู้ใช้
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "challenges" 
              ? "text-blue-400 border-b-2 border-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("challenges")}
        >
          จัดการชาเลนจ์
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "proofs" 
              ? "text-blue-400 border-b-2 border-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("proofs")}
        >
          ตรวจสอบหลักฐาน
        </button>
      </div>
      
      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full bg-[#2C2F48] border border-[#3D405A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => navigate("/admin/manage-users")}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              จัดการผู้ใช้
            </button>
          </div>
          
          <div className="bg-[#2C2F48] rounded-lg overflow-hidden shadow-lg">
            <table className="w-full text-white">
              <thead>
                <tr className="bg-[#343850] text-left">
                  <th className="p-4">ID</th>
                  <th className="p-4">ชื่อผู้ใช้</th>
                  <th className="p-4">อีเมล</th>
                  <th className="p-4">บทบาท</th>
                  <th className="p-4">สถานะ</th>
                  <th className="p-4">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 5).map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#3D405A] hover:bg-[#343850]"
                  >
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "ADMIN" 
                          ? "bg-purple-500 bg-opacity-20 text-purple-300" 
                          : "bg-blue-500 bg-opacity-20 text-blue-300"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.bannedUser 
                          ? "bg-red-500 bg-opacity-20 text-red-300" 
                          : "bg-green-500 bg-opacity-20 text-green-300"
                      }`}>
                        {user.bannedUser ? "ถูกแบน" : "ปกติ"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {user.role !== "ADMIN" && (
                          <>
                            {user.bannedUser ? (
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                className="text-green-400 hover:text-green-300"
                                title="ปลดแบน"
                              >
                                <ShieldCheck size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                                title="แบน"
                              >
                                <Ban size={18} />
                              </button>
                            )}
                            <button
                              className="text-gray-400 hover:text-gray-300"
                              title="ลบ"
                            >
                              <Trash size={18} />
                            </button>
                          </>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-300"
                          title="ตัวเลือกเพิ่มเติม"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      
      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">ชาเลนจ์ทั้งหมด</h3>
            <button
              onClick={() => navigate("/admin/manage-challenges")}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              จัดการชาเลนจ์
            </button>
          </div>
          
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.slice(0, 6).map((challenge) => (
                <motion.div
                  key={challenge.id}
                  className="bg-[#2C2F48] p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-semibold text-lg mb-2 truncate">{challenge.name}</h4>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Target className="text-green-400 mr-1" size={16} />
                      <span className="text-sm">{challenge.expReward} EXP</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      challenge.status === "PUBLIC" 
                        ? "bg-green-500 bg-opacity-20 text-green-300" 
                        : "bg-yellow-500 bg-opacity-20 text-yellow-300"
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2C2F48] p-8 rounded-lg text-center">
              <Target className="mx-auto mb-4" size={48} />
              <p className="text-gray-400">ยังไม่มีชาเลนจ์</p>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Proofs Tab */}
      {activeTab === "proofs" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold">หลักฐานที่รอการตรวจสอบ</h3>
          </div>
          
          {proofs.length > 0 ? (
            <div className="bg-[#2C2F48] rounded-lg overflow-hidden shadow-lg">
              <table className="w-full text-white">
                <thead>
                  <tr className="bg-[#343850] text-left">
                    <th className="p-4">ID</th>
                    <th className="p-4">ผู้ใช้</th>
                    <th className="p-4">ชาเลนจ์</th>
                    <th className="p-4">สถานะ</th>
                    <th className="p-4">วันที่ส่ง</th>
                    <th className="p-4">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {proofs.map((proof) => (
                    <tr key={proof.id} className="border-b border-[#3D405A]">
                      <td className="p-4">{proof.id}</td>
                      <td className="p-4">{proof.user.username}</td>
                      <td className="p-4">{proof.challenge.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          proof.status === "PENDING" 
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-300" 
                            : proof.status === "APPROVED"
                              ? "bg-green-500 bg-opacity-20 text-green-300"
                              : "bg-red-500 bg-opacity-20 text-red-300"
                        }`}>
                          {proof.status}
                        </span>
                      </td>
                      <td className="p-4">{new Date(proof.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm mr-2"
                        >
                          ดู
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
                        >
                          อนุมัติ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#2C2F48] p-8 rounded-lg text-center">
              <ClipboardCheck className="mx-auto mb-4" size={48} />
              <p className="text-gray-400">ไม่มีหลักฐานที่รอการตรวจสอบ</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;