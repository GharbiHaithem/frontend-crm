import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/resetPassword/${token}`, { password });
      setMessage("Mot de passe mis à jour avec succès.");
    } catch (err) {
      setMessage("Erreur : " + err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h2>
      <form onSubmit={handleReset}>
        <label className="block mb-2">Nouveau mot de passe</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg  w-full">
          Réinitialiser
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default ResetPassword;
