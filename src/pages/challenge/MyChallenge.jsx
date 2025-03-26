import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Check, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    expReward: 0,
    status: "PUBLIC",
    requirementType: "PROOF",
  });
  const [proofFiles, setProofFiles] = useState([]);
  const navigate = useNavigate();

  const fetchChallenges = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/challenges", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChallenges(res.data.challenges);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreateChallenge = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8080/api/challenges", newChallenge, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsCreating(false);
      fetchChallenges();
    } catch (error) {
      console.log("Failed to create challenge:", error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:8080/api/challenges/${challengeId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchChallenges();
    } catch (error) {
      console.log("Failed to join challenge:", error);
    }
  };

  const handleProofUpload = async (challengeId) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    proofFiles.forEach((file) => formData.append("proofImages", file));

    try {
      await axios.patch(
        `http://localhost:8080/api/user/challenges/${challengeId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchChallenges();
      setProofFiles([]);
    } catch (error) {
      console.log("Failed to submit proof:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        My Challenge
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
              Reward: {challenge.expReward} XP
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleJoinChallenge(challenge.id)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                Join
              </button>
              <label className="flex items-center text-indigo-500 cursor-pointer">
                <UploadCloud className="text-indigo-500 mr-2" />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setProofFiles(Array.from(e.target.files))}
                />
                Upload Proof
              </label>
              <button
                onClick={() => handleProofUpload(challenge.id)}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Submit Proof
              </button>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setIsCreating(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus size={32} className="text-gray-500 mb-2" />
          <p>Create New Challenge</p>
        </motion.div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-black">Create Challenge</h2>
            <input
              type="text"
              placeholder="Challenge Name"
              value={newChallenge.name}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, name: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded text-gray-600 bg-white"
            />
            <textarea
              placeholder="Description"
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
              placeholder="XP Reward"
              value={newChallenge.expReward}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  expReward: e.target.value,
                })
              }
              className="w-full p-2 mb-4 border rounded text-gray-600 bg-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChallenge}
                className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyChallengePage;
