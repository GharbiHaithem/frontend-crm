import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const DetailsFacture = () => {
  const { id } = useParams();
  const [factDetails, setFactDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/facture/${id}`);
        setFactDetails(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération:", err);
        setError("Impossible de charger les détails de la facture");
      } finally {
        setLoading(false);
      }
    };

    fetchFactureDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  const navigate = useNavigate()
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p className="text-gray-600 text-center mt-4">Chargement en cours...</p>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!factDetails) return <p className="text-gray-600 text-center mt-4">Aucune donnée disponible</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">
          🧾 Facture {factDetails.numFacture}
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(factDetails.status)}`}>
          {factDetails.status === 'paid' ? 'Payée' : 'Impayée'}
        </span>
      </div>
     <button
        onClick={() => navigate(`/factures`,{state:{
      factId:factDetails?._id 
        }})}
        className="mb-4 inline-flex items-center text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infos Facture */}
        <div className="bg-white shadow rounded-xl p-5 space-y-2">
          <h3 className="text-lg font-semibold border-b pb-2">📝 Informations Facture</h3>
          <p><strong>📅 Date :</strong> {formatDate(factDetails.date)}</p>
          <p><strong>💰 Total HT :</strong> {factDetails.totalHT?.toFixed(2)} <span className="text-sm font-semibold "> TND</span></p>
          <p><strong>💸 Total TTC :</strong> {factDetails.totalTTC?.toFixed(2)} <span className="text-sm font-semibold "> TND</span></p>
          <p><strong>🏪 Point de vente :</strong> {factDetails.pointVente || 'Non spécifié'}</p>
          <p><strong>📦 Référence commande :</strong> {factDetails.referenceCommande || 'Non spécifié'}</p>
          <p><strong>🗒️ Commentaire :</strong> {factDetails.commentaire || 'Aucun commentaire'}</p>
        </div>

        {/* Infos Client */}
        <div className="bg-white shadow rounded-xl p-5 space-y-2">
          <h3 className="text-lg font-semibold border-b pb-2">👤 Client</h3>
          <p><strong>🏢 Nom :</strong> {factDetails.client?.nom_prenom || 'Non spécifié'}</p>
          <p><strong>🏠 Adresse :</strong> {factDetails.client?.adresse || 'Non spécifié'}</p>
          <p><strong>📞 Téléphone :</strong> {factDetails.client?.telephone || 'Non spécifié'}</p>
          <p><strong>🧾 Matricule fiscale :</strong> {factDetails.client?.matricule_fiscale || 'Non spécifié'}</p>
          <p><strong>🏛️ Raison sociale :</strong> {factDetails.client?.raison_social || 'Non spécifié'}</p>
        </div>
      </div>

      {/* Lignes de facture */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">📄 Articles</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Article</th>
                <th className="p-2 border text-right">Quantité</th>
                <th className="p-2 border text-right">Prix HT</th>
                <th className="p-2 border text-right">Remise</th>
                <th className="p-2 border text-right">TVA</th>
                <th className="p-2 border text-right">Total HT</th>
                <th className="p-2 border text-right">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {factDetails.lignes?.map((ligne, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{ligne.libelleArticle || 'N/A'}</td>
                  <td className="p-2 border text-right">{ligne.quantite || 0}</td>
                  <td className="p-2 border text-right">{ligne.prixHT?.toFixed(2)} <span className="text-sm font-semibold "> TND</span></td>
                  <td className="p-2 border text-right">{ligne.remise?.toFixed(2)} %</td>
                  <td className="p-2 border text-right">{ligne.tva?.toFixed(2)} %</td>
                  <td className="p-2 border text-right">
                    {(ligne.quantite * ligne.prixHT).toFixed(2)} €
                  </td>
                  <td className="p-2 border text-right">{ligne.prixTTC?.toFixed(2)} <span className="text-sm font-semibold "> TND</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsFacture;
