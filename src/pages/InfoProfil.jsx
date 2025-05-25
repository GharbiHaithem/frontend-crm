import React, { useState } from 'react';
import { FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const InfoProfil = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du profil</h2>

      <div className="flex items-center gap-3 text-gray-700">
        <FaUser className="text-blue-500" />
        <span className="font-medium">{user.name}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <FaEnvelope className="text-green-500" />
        <span>{user.email}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <FaMapMarkerAlt className="text-red-500" />
        <span>{user.address}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <FaPhone className="text-purple-500" />
        <span>{user.phone}</span>
      </div>
    </div>
  );
};

export default InfoProfil;
