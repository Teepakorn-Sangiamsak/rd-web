// src/components/user/ChallengeCard.jsx
const ChallengeCard = ({ title, description }) => {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
  
  export default ChallengeCard;
  