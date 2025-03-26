// src/components/admin/UserTable.jsx
import React from "react";

const UserTable = ({ users, banUser, unbanUser, deleteUser }) => {
  return (
    <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-700">
          <th className="p-3">ID</th>
          <th className="p-3">Username</th>
          <th className="p-3">Email</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-700">
            <td className="p-3">{user.id}</td>
            <td className="p-3">{user.username}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">
              <button onClick={() => banUser(user.id)}>Ban</button>
              <button onClick={() => unbanUser(user.id)}>Unban</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
