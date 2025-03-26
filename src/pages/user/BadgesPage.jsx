// สร้างไฟล์ใหม่ src/pages/user/BadgesPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { userService } from "../../services/api";
import Loading from "../../components/common/Loading";

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await userService.getBadges();
        setBadges(response.data.badges);
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">ตรารางวัลของฉัน</h1>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="w-20 h-20 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Award className="text-yellow-400" size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">{badge.badge.name}</h3>
                <p className="text-sm text-gray-400">
                  {badge.badge.description || "ตรารางวัลพิเศษ"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ได้รับเมื่อ {new Date(badge.earnedAt).toLocaleDateString('th-TH')}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Award className="mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">คุณยังไม่มีตรารางวัล</h3>
            <p className="text-gray-400">ทำชาเลนจ์ให้สำเร็จเพื่อรับตรารางวัล</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesPage;