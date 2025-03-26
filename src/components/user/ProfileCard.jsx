// src/components/user/ProfileCard.jsx
const ProfileCard = ({ username, level, exp }) => {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">
        <h3 className="text-xl font-bold">{username}</h3>
        <p>Level: {level}</p>
        <p>EXP: {exp}</p>
      </div>
    );
  };
  
  export default ProfileCard;
  