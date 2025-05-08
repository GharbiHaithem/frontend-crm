import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const factureId = params.get('factureId');
    if (factureId) {
      axios.post('http://localhost:5000/api/stripe/confirm-payment', { factureId })
        .then(() => {
          Swal.fire({
            title: "Paiement effectué !",
            text: "La facture a été payée avec succès.",
            icon: "success"
          }).then(() => {
            navigate('/factures'); // Navigation après la fermeture de l'alerte
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la confirmation du paiement :", error);
          Swal.fire({
            title: "Erreur",
            text: "Une erreur est survenue lors de la confirmation du paiement.",
            icon: "error"
          }).then(() => {
            navigate('/factures'); // Redirection même en cas d'erreur
          });
        });
    }
  }, [params, navigate]); // ⚠️ Il faut ajouter `navigate` et `params` aux dépendances

  return <h2>Paiement effectué avec succès !</h2>;
}

export default PaymentSuccess;