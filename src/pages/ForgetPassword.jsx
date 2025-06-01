import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res =
      setMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
    } catch (err) {
      setMessage("Erreur : " + err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Adresse email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Envoyer le lien
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
