import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, UploadCloud } from "lucide-react";
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
  const [proofFiles, setProofFiles] = useState([]);
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

  const handleProofUpload = async (challengeId) => {
    if (!proofFiles.length) return;
    
    const formData = new FormData();
    proofFiles.forEach(file => formData.append("proofImages", file));
    
    await submitProof(challengeId, formData);
    setProofFiles([]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    // ส่วนของ JSX เหมือนเดิม แต่เรียกใช้ฟังก์ชั่นที่อัพเดตแล้ว
    // ...
  );
};

export default MyChallengePage;