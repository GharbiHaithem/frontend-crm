import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import explicite d'autoTable
import axios from "axios";

const BonCommandePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // useEffect(()=>{
  //   console.log('hello !');
  // })

  const {
    typeDocument,
    id,
    numero,
    date,
    client,
    totalHT,
    totalTTC,
    lignes,
    referenceCommande: refBCC,
    pointVente,
    typePaiement,
    commentaire,
  } = location.state;
  // console.log("--------------------------------");
   console.log(location.state);
  const genererFacture =async () => {
    const data = {
      typeDocument,
      id,
      numero,
        date,
    client,
    totalHT,
    totalTTC,
    lignes,
    referenceCommande: refBCC,
    pointVente,
    typePaiement,
    commentaire
    };
    console.log(data)
    // Créer un nouveau document PDF
    const doc = new jsPDF();
 // Formater la date au format local (ex: 21/03/2025)
 const dateFormatee = new Date(document.date).toLocaleDateString();
    // Ajouter le titre
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243); // Couleur bleue
    doc.text("Facture", 15, 20);

    // Informations générales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Couleur noire
    doc.text(`Numéro: ${numero}`, 15, 30);
    doc.text(`Date: ${dateFormatee }`, 15, 40);
    doc.text(`Client: ${client.raisonSociale}`, 15, 50);
    doc.text(`Réf. BCC: ${refBCC}`, 15, 60);
    doc.text(`Point de Vente: ${pointVente}`, 15, 70);
    doc.text(`Type de Paiement: ${typePaiement}`, 15, 80);
    doc.text(`Commentaire: ${commentaire}`, 15, 90);

    // Préparer les données du tableau
    const tableData = lignes.map((ligne, index) => [
      index + 1,
      ligne.codeArticle,
      ligne.famille,
      ligne.libelleArticle,
      ligne.quantite,
      ligne.prixHT.toFixed(2),
      ligne.remise.toFixed(2),
      ligne.tva.toFixed(2),
      ligne.prixTTC.toFixed(2),
    ]);

    // En-têtes du tableau
    const headers = [
      "N°",
      "Code Article",
      "Famille",
      "Libellé Article",
      "Quantité",
      "Prix HT",
      "Remise",
      "TVA",
      "Prix TTC",
    ];

    // Ajouter le tableau avec jspdf-autotable
    autoTable(doc, {
      startY: 100, // Position verticale du tableau
      head: [headers],
      body: tableData,
      theme: "striped", // Thème du tableau
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0], // Couleur du texte
        fillColor: [255, 255, 255], // Couleur de fond
      },
      headStyles: {
        fillColor: [33, 150, 243], // Couleur de fond de l'en-tête
        textColor: [255, 255, 255], // Couleur du texte de l'en-tête
        fontStyle: "bold", // Texte en gras
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Couleur de fond des lignes alternées
      },
    });

    // Ajouter les totaux
    doc.setFontSize(12);
    doc.text(
      `Total HT: ${totalHT.toFixed(2)}`,
      15,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total TTC: ${totalTTC.toFixed(2)}`,
      15,
      doc.lastAutoTable.finalY + 20
    );

    // Sauvegarder le PDF
    doc.save(`Facture_${numero}.pdf`);
    console.log('testy');
    console.log(data);
 await  axios
      .put("http://localhost:5000/entetes/devis", data)
      .then((response) => {
         console.log(response.data);
        if (response.status === 200) {
          alert("Facture générée avec succès");
          navigate("/Bon%20Commande-consulter");
        } else {
          alert("Erreur lors de la génération de la facture");
        }
      })
      .catch((error) => {
        console.error("Erreur Axios :", error);
        if (error.response) {
          console.log("Détails de l'erreur :", error.response.data);
        }
      });
  };

  const handleCancel = () => {
    navigate("/Home");
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "10px" }}>
          <h1>Bon de Commande</h1>
          <div className="document-form">
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <h3>Client</h3>
                <TextField
                  label="Code"
                  fullWidth
                  margin="normal"
                  value={client.code}
                  size="small"
                  disabled
                />
                <TextField
                  label="Adresse"
                  fullWidth
                  margin="normal"
                  value={client.adresse}
                  size="small"
                  disabled
                />
                <TextField
                  label="Matricule"
                  fullWidth
                  margin="normal"
                  value={client.matricule_fiscale}
                  size="small"
                  disabled
                />
                <TextField
                  label="Raison Sociale"
                  fullWidth
                  margin="normal"
                  value={client.raison_social}
                  size="small"
                  disabled
                />
                <TextField
                  label="Téléphone"
                  fullWidth
                  margin="normal"
                  value={client.telephone}
                  size="small"
                  disabled
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <h3>Général</h3>
                <TextField
                  label="Numéro"
                  fullWidth
                  margin="normal"
                  value={numero}
                  size="small"
                  disabled
                />
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={new Date(date).toLocaleDateString('fr-CA')}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  disabled
                />
                <TextField
                  label="Réf. BCC"
                  fullWidth
                  margin="normal"
                  value={refBCC}
                  size="small"
                  disabled
                />
                <TextField
                  label="Point de Vente"
                  fullWidth
                  margin="normal"
                  value={pointVente}
                  size="small"
                  disabled
                />
                <TextField
                  label="Type de Paiement"
                  fullWidth
                  margin="normal"
                  value={typePaiement}
                  size="small"
                  disabled
                />
                <TextField
                  label="Commentaire"
                  fullWidth
                  margin="normal"
                  value={commentaire}
                  multiline
                  rows={4}
                  size="small"
                  disabled
                />
              </Box>
            </Box>

            <h3>Lignes du document :</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    N°
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Code Article
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Famille
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Libelle Article
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Quantité
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Prix HT
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Remise
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    TVA
                  </th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Prix TTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.codeArticle}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.famille}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.libelleArticle}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.quantite}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.prixHT}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.remise}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.tva}
                    </td>
                    <td style={{ padding: "5px", border: "1px solid #ccc" }}>
                      {ligne.prixTTC.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Total HT : {totalHT.toFixed(2)}</h3>
            <h3>Total TTC : {totalTTC.toFixed(2)}</h3>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={genererFacture}
              startIcon={<ReceiptIcon />}
              sx={{ marginRight: 2 }}
            >
              Générer Facture
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default BonCommandePage;
