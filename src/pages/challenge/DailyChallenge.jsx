import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyChallengePage = () => {
  const [dailyChallenges, setDailyChallenges] = useState([]);

  useEffect(() => {
    const fetchDailyChallenges = async () => {
      const res = await axios.get("http://localhost:8080/api/challenges");
      setDailyChallenges(res.data.challenges);
    };

    fetchDailyChallenges();
  }, []);

  return (
    <div className="daily-challenge-page-container">
      <h2>Daily Challenges</h2>
      <ul>
        {dailyChallenges.map((challenge) => (
          <li key={challenge.id}>{challenge.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DailyChallengePage;
