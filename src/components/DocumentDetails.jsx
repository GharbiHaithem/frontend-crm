import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import DetailsFacture from "../components/DetailsFacture";

const DocumentDetails = () => {
  const { typeDocument, id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/entetes/${id}`)
      .then((response) => setDocument(response.data))
      .catch((error) => console.error("Erreur de chargement", error));
  }, [id]);

if (!document) return <DetailsFacture/>;

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidenav />
        <main className="flex-grow p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Détails du {typeDocument.replace("-", " ")}
          </h1>
     <button
        onClick={() => navigate(`/${typeDocument}-consulter`)}
        className="mb-4 inline-flex items-center text-blue-600 hover:underline"
      >
        ← Retour à la liste
      </button>
          {/* Section Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Client</h2>
              <div className="space-y-2">
                <p><strong>Code :</strong> {document.client.code}</p>
                <p><strong>Adresse :</strong> {document.client.adresse}</p>
                <p><strong>Matricule :</strong> {document.client.matricule_fiscale}</p>
                <p><strong>Raison Sociale :</strong> {document.client.raison_social}</p>
                <p><strong>Téléphone :</strong> {document.client.telephone}</p>
              </div>
            </div>

            {/* Section Générale */}
            <div className="bg-white shadow rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Général</h2>
              <div className="space-y-2">
                <p><strong>Numéro :</strong> {document.numero}</p>
                <p><strong>Date :</strong> {new Date(document.date).toLocaleDateString()}</p>
                <p><strong>Réf. BCC :</strong> {document.referenceCommande}</p>
                <p><strong>Point de Vente :</strong> {document.pointVente}</p>
                <p><strong>Type de Paiement :</strong> {document.typePaiement}</p>
                <p><strong>Commentaire :</strong> {document.commentaire}</p>
              </div>
            </div>
          </div>

          {/* Section Lignes */}
          <div className="bg-white shadow rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Lignes du document</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">N°</th>
                    <th className="p-2 border">Code Article</th>
               
                    <th className="p-2 border">Libelle</th>
                    <th className="p-2 border">Quantité</th>
                    <th className="p-2 border">Prix HT</th>
                    <th className="p-2 border">Remise</th>
                    <th className="p-2 border">TVA</th>
                    <th className="p-2 border">Prix TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {document.lignes.map((ligne, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{ligne.code}</td>
                 
                      <td className="p-2 border">{ligne.libelleArticle}</td>
                      <td className="p-2 border">{ligne.quantite}</td>
                      <td className="p-2 border">{ligne.prixHT.toFixed(2)} <span className="text-sm font-semibold "> TND</span></td>
                      <td className="p-2 border">{ligne.remise}</td>
                      <td className="p-2 border">{ligne.tva}  <span className="text-sm font-semibold "> %</span></td>
                      <td className="p-2 border">{ligne.prixTTC.toFixed(2)} <span className="text-sm font-semibold "> TND</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux */}
          <div className="bg-white shadow rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Totaux</h2>
            <p><strong>Total HT :</strong> {document.totalHT.toFixed(2)}</p>
            <p><strong>Total TTC :</strong> {document.totalTTC.toFixed(2)}</p>
          </div>

        
        </main>
      </div>
    </>
  );
};

export default DocumentDetails;
