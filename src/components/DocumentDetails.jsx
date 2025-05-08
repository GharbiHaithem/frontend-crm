import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, TextField } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import DetailsFacture from "./DetailsFacture";

const DocumentDetails = () => {
  const { typeDocument, id } = useParams(); // Récupérer le type de document et l'ID
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/entetes/${id}`)
      .then((response) =>{
        console.log(response)
        setDocument(response.data)})
      .catch((error) => console.error("Erreur de chargement", error));
  }, [id]);

  if (!document) return <DetailsFacture/>;

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "10px" }}>
          <Typography variant="h4">
            Détails du {typeDocument.replace("-", " ")}
          </Typography>

          {/* Section Client */}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, my: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Client</Typography>
              <TextField
                label="Code"
                fullWidth
                margin="normal"
                size="small"
                value={document.client.code || ""}
                disabled
              />
              <TextField
                label="Adresse"
                fullWidth
                margin="normal"
                size="small"
                value={document.client.adresse || ""}
                disabled
              />
              <TextField
                label="Matricule"
                fullWidth
                margin="normal"
                size="small"
                value={document.client.matricule_fiscale || ""}
                disabled
              />
              <TextField
                label="Raison Sociale"
                fullWidth
                margin="normal"
                size="small"
                value={document.client.raison_social || ""}
                disabled
              />
              <TextField
                label="Téléphone"
                fullWidth
                margin="normal"
                size="small"
                value={document.client.telephone || ""}
                disabled
              />
            </Box>

            {/* Section Générale */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Général</Typography>
              <TextField
                label="Numéro"
                fullWidth
                margin="normal"
                value={document.numero || ""}
                size="small"
                disabled
              />
              <TextField
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                value={new Date(document.date).toISOString().split("T")[0]}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled
              />
              <TextField
                label="Réf. BCC"
                fullWidth
                margin="normal"
                value={document.referenceCommande || ""}
                size="small"
                disabled
              />
              <TextField
                label="Point de Vente"
                fullWidth
                margin="normal"
                value={document.pointVente || ""}
                size="small"
                disabled
              />
              <TextField
                label="Type de Paiement"
                fullWidth
                margin="normal"
                value={document.typePaiement || ""}
                size="small"
                disabled
              />
              <TextField
                label="Commentaire"
                fullWidth
                margin="normal"
                value={document.commentaire || ""}
                multiline
                rows={4}
                size="small"
                disabled
              />
            </Box>
          </Box>

          {/* Section Lignes du document */}
          <Typography variant="h6">Lignes du document :</Typography>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>N°</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Code Article</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Famille</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Libelle Article</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Quantité</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Prix HT</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Remise</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>TVA</th>
                <th style={{ padding: "5px", border: "1px solid #ccc" }}>Prix TTC</th>
              </tr>
            </thead>
            <tbody>
              {document.lignes.map((ligne, index) => (
                <tr key={index}>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{index + 1}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.codeArticle}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.famille}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.libelleArticle}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.quantite}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.prixHT.toFixed(2)}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.remise}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.tva}</td>
                  <td style={{ padding: "5px", border: "1px solid #ccc" }}>{ligne.prixTTC.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Section Totaux */}
          <Typography variant="h6">Total HT : {document.totalHT.toFixed(2)}</Typography>
          <Typography variant="h6">Total TTC : {document.totalTTC.toFixed(2)}</Typography>

          {/* Bouton Retour */}
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DocumentDetails;