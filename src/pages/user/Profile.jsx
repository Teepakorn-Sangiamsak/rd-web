import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, Target, Star, TrendingUp, ArrowRight } from "lucide-react";
import useAuthStore from "../../store/authStore";
import Loading from "../../components/common/Loading";
import { userService } from "../../services/api";

const ProfilePage = () => {
  const { user, fetchProfile, isLoading } = useAuthStore();
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile if not available
    if (!user) {
      fetchProfile();
    }

    // Fetch user stats and badges
    const fetchUserData = async () => {
      setStatsLoading(true);
      try {
        // Fetch user challenge history and stats
        const historyRes = await userService.getChallengeHistory();
        setUserStats(historyRes.data.stats);

        // Fetch user badges
        const badgesRes = await userService.getBadges();
        setBadges(badgesRes.data.badges);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserData();
  }, [user, fetchProfile]);

  if (isLoading || !user) {
    return <Loading />;
  }

  // Calculate experience bar percentage
  const expToNextLevel = Math.floor(1000 * Math.pow(1.2, user.level - 1));
  const expPercentage = Math.min(100, (user.exp / expToNextLevel) * 100);

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">โปรไฟล์ของฉัน</h1>
        
        {/* Profile Card and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={user.profileImage || `https://robohash.org/${user.username}.png`}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500"
              />
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400">{user.firstname} {user.lastname}</p>
              <div className="mt-2 flex items-center bg-blue-900 px-3 py-1 rounded-full">
                <Star className="text-yellow-400 mr-1" size={18} />
                <span className="font-bold">Level {user.level}</span>
              </div>
            </div>
            
            {/* Experience Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>EXP</span>
                <span>{user.exp} / {expToNextLevel}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <motion.button
              onClick={() => navigate("/user/settings")}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 py-2 rounded-md transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              แก้ไขโปรไฟล์
            </motion.button>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div
            className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {statsLoading ? (
              <div className="col-span-2 flex justify-center items-center">
                <Loading />
              </div>
            ) : (
              <>
                {/* Challenge Stats */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <Target className="text-green-400 mr-2" size={24} />
                    <h3 className="text-xl font-semibold">ชาเลนจ์ของฉัน</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ชาเลนจ์ทั้งหมด</span>
                      <span className="font-bold">{userStats?.total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">สำเร็จแล้ว</span>
                      <span className="font-bold text-green-400">{userStats?.completed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">กำลังทำ</span>
                      <span className="font-bold text-yellow-400">{userStats?.inProgress || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">อัตราความสำเร็จ</span>
                      <span className="font-bold">{userStats?.completionRate || '0%'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <Award className="text-yellow-400 mr-2" size={24} />
                    <h3 className="text-xl font-semibold">ความสำเร็จ</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ตรารางวัล</span>
                      <span className="font-bold">{badges.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EXP ทั้งหมด</span>
                      <span className="font-bold">{userStats?.totalExpEarned || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">เลเวล</span>
                      <span className="font-bold text-blue-400">{user.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">วันที่เข้าร่วม</span>
                      <span className="font-bold">
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
        
        {/* Latest Badges */}
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">ตรารางวัลล่าสุด</h2>
            {badges.length > 0 && (
              <button 
                onClick={() => navigate("/user/badges")}
                className="flex items-center text-blue-400 hover:text-blue-300"
              >
                ดูทั้งหมด <ArrowRight size={16} className="ml-1" />
              </button>
            )}
          </div>
          
          {statsLoading ? (
            <Loading />
          ) : badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {badges.slice(0, 5).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className="bg-gray-700 p-3 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="w-16 h-16 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-2">
                    <Award className="text-yellow-400" size={32} />
                  </div>
                  <h3 className="font-semibold truncate">{badge.badge.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {badge.badge.description || "ตรารางวัลพิเศษ"}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="mx-auto mb-2" size={48} />
              <p>คุณยังไม่มีตรารางวัล</p>
              <p className="text-sm mt-2">ทำชาเลนจ์ให้สำเร็จเพื่อรับตรารางวัล</p>
            </div>
          )}
        </motion.div>
        
        {/* Start Challenge Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.button
            onClick={() => navigate("/user/challenges")}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg flex items-center text-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="mr-2" />
            เริ่มทำชาเลนจ์
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;