import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailsClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/clients/${id}`).then((response) => {
        setClient(response.data);
      });
    }
  }, [id]);

  if (!client) return <p className="text-center text-gray-500">Aucun client sélectionné</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.489 0 4.797.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{client.nom_prenom}</h2>
          <div className="flex gap-2 mt-1">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
              Code : {client.code}
            </span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
              Tél : {client.telephone}
            </span>
          </div>
        </div>
      </div>

      {/* Bloc Informations */}
      <div className="space-y-6">
        {/* Infos pro */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-gray-700">
            <span className="mr-2">🧑‍💼</span> Informations Professionnelles
          </h3>
          <ul className="ml-6 mt-2 space-y-1 text-gray-600">
            <li>Raison Sociale : {client.raison_social}</li>
            <li>Matricule Fiscale : {client.matricule_fiscale || '-'}</li>
            <li>Reg. Commerce : {client.register_commerce || '-'}</li>
          </ul>
        </div>

        {/* Adresse */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-gray-700">
            <span className="mr-2">🏠</span> Adresse
          </h3>
          <p className="ml-6 mt-2 text-gray-600">{client.adresse || 'Non renseignée'}</p>
        </div>

        {/* Infos financières */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-gray-700">
            <span className="mr-2">💰</span> Informations Financières
          </h3>
          <ul className="ml-6 mt-2 space-y-1 text-gray-600">
            <li>Solde Initial : {client.solde_initial}</li>
            <li>Montant Rapproché : {client.montant_raprochement}</li>
            <li>Solde Initial BL : {client.solde_initiale_bl}</li>
            <li>Taux Retenu : {client.taux_retenu}%</li>
          </ul>
        </div>

        {/* Autres infos */}
        <div>
          <h3 className="text-lg font-semibold flex items-center text-gray-700">
            <span className="mr-2">📄</span> Autres Informations
          </h3>
          <ul className="ml-6 mt-2 space-y-1 text-gray-600">
            <li>Code Rapprochement : {client.code_rapprochement || '-'}</li>
            <li>Rape BL : {client.rapeBl || '-'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailsClient;
