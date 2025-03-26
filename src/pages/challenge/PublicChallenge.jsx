import React, { useEffect, useState } from "react";
import axios from "axios";

const PublicChallengePage = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchPublicChallenges = async () => {
      const res = await axios.get("http://localhost:8080/api/challenges");
      setChallenges(res.data.challenges);
    };

    fetchPublicChallenges();
  }, []);

  return (
    <div className="public-challenge-page-container">
      <h2>Public Challenges</h2>
      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>{challenge.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PublicChallengePage;
