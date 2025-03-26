import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useChallengeStore from "../../store/challengeStore";
import Loading from "../../components/common/Loading";

const MyChallengePage = () => {
  const { 
    challenges, 
    fetchChallenges, 
    createChallenge, 
    joinChallenge, 
    submitProof,
    showCreateModal,
    toggleCreateModal,
    isLoading 
  } = useChallengeStore();
  
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    expReward: 0,
    status: "PUBLIC",
    requirementType: "PROOF",
  });
  
  // Track proof files for each challenge separately
  const [proofFilesByChallenge, setProofFilesByChallenge] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleCreateChallenge = async () => {
    await createChallenge(newChallenge);
    // Reset form
    setNewChallenge({
      name: "",
      description: "",
      expReward: 0,
      status: "PUBLIC",
      requirementType: "PROOF",
    });
  };

  const handleJoinChallenge = async (challengeId) => {
    await joinChallenge(challengeId);
  };

  const handleFileChange = (challengeId, files) => {
    setProofFilesByChallenge({
      ...proofFilesByChallenge,
      [challengeId]: Array.from(files)
    });
  };

  const handleProofUpload = async (challengeId) => {
    const files = proofFilesByChallenge[challengeId];
    if (!files || !files.length) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append("proofImages", file));
    
    await submitProof(challengeId, formData);
    
    // Clear only the files for this challenge
    setProofFilesByChallenge({
      ...proofFilesByChallenge,
      [challengeId]: []
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        ชาเลนจ์ของฉัน
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            className="bg-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-black text-lg font-semibold">{challenge.name}</h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
            <p className="text-sm text-gray-500">
              รางวัล: {challenge.expReward} EXP
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleJoinChallenge(challenge.id)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                เข้าร่วม
              </button>
              <label className="flex items-center text-indigo-500 cursor-pointer">
                <UploadCloud className="text-indigo-500 mr-2" />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileChange(challenge.id, e.target.files)}
                />
                อัปโหลดหลักฐาน
              </label>
              <button
                onClick={() => handleProofUpload(challenge.id)}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                disabled={!proofFilesByChallenge[challenge.id]?.length}
              >
                ส่งหลักฐาน
              </button>
            </div>
          </motion.div>
        ))}
  
        <motion.div
          className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
          onClick={toggleCreateModal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus size={32} className="text-gray-500 mb-2" />
          <p className="text-gray-700">สร้างชาเลนจ์ใหม่</p>
        </motion.div>
      </div>
  
      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-black">สร้างชาเลนจ์</h2>
            <input
              type="text"
              placeholder="ชื่อชาเลนจ์"
              value={newChallenge.name}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, name: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded text-gray-600 bg-white"
            />
            <textarea
              placeholder="รายละเอียด"
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value,
                })
              }
              className="w-full p-2 mb-2 border rounded text-gray-600 bg-white"
            />
            <input
              type="number"
              placeholder="EXP รางวัล"
              value={newChallenge.expReward}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  expReward: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-2 mb-2 border rounded text-gray-600 bg-white"
            />
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">สถานะ</label>
              <select
                value={newChallenge.status}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, status: e.target.value })
                }
                className="w-full p-2 border rounded text-gray-600 bg-white"
              >
                <option value="PUBLIC">สาธารณะ</option>
                <option value="PRIVATE">ส่วนตัว</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">ประเภทเงื่อนไข</label>
              <select
                value={newChallenge.requirementType}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, requirementType: e.target.value })
                }
                className="w-full p-2 border rounded text-gray-600 bg-white"
              >
                <option value="PROOF">หลักฐาน</option>
                <option value="GPS">ตำแหน่ง GPS</option>
                <option value="STEP_COUNT">จำนวนก้าว</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={toggleCreateModal}
                className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreateChallenge}
                className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                disabled={!newChallenge.name || !newChallenge.description}
              >
                สร้าง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyChallengePage;