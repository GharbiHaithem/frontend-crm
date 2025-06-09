import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, TextField, CircularProgress, Snackbar, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";

const DocumentEdit = ({ typeDocument }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [numero, setNumero] = useState("");
  const [date, setDate] = useState("");
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [lignes, setLignes] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [refBCC, setRefBCC] = useState("");
  const [pointVente, setPointVente] = useState("");
  const [typePaiement, setTypePaiement] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [clientDetails, setClientDetails] = useState({
    code: "",
    adresse: "",
    matricule: "",
    raisonSociale: "",
    telephone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
console.log(typeDocument)
  useEffect(() => {
    const fetchDocument = async () => {
      try {
      
      
         let url ="http://localhost:5000/entetes/"
        
        const response = await axios.get(`${url}${id}`);
        const doc = response.data;
        setDocument(doc);
        setNumero(doc.numero);
        setDate(doc.date);
        setTotalHT(doc.totalHT);
        setTotalTTC(doc.totalTTC);
        setLignes(doc.lignes || []);
        setRefBCC(doc.referenceCommande || "");
        setPointVente(doc.pointVente || "");
        setTypePaiement(doc.typePaiement || "");
        setCommentaire(doc.commentaire || "");
        setClientDetails(doc.client || {
          code: "",
          adresse: "",
          matricule: "",
          raisonSociale: "",
          telephone: "",
        });
      } catch (error) {
        setError("Erreur de chargement du document");
        console.error("Erreur de chargement", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFamilles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/famille");
        setFamilles(response.data);
      } catch (error) {
        console.error("Erreur de chargement des familles", error);
      }
    };

    fetchDocument();
    fetchFamilles();
  }, [id]);

  const handleSave = async () => {
    const updatedDocument = {
      ...document,
      numero,
      date,
      client: clientDetails,
      totalHT,
      totalTTC,
      lignes,
      referenceCommande: refBCC,
      pointVente,
      typePaiement,
      commentaire,
    };

    try {
      await axios.put(`http://localhost:5000/entetes/${id}`, updatedDocument);
      setSnackbarOpen(true);
      setTimeout(() => navigate(`/${typeDocument}`), 2000); // Redirection après 2 secondes
    } catch (error) {
      setError("Erreur de mise à jour du document");
      console.error("Erreur de mise à jour", error);
    }
  };

  const ajouterLigne = () => {
    const nouvelleLigne = {
      quantite: 1,
      prixHT: 0,
      remise: 0,
      tva: 0,
      prixTTC: 0,
      famille: "",
      libelleArticle: "",
      codeArticle: "",
    };
    setLignes([...lignes, nouvelleLigne]);
  };

  const supprimerLigne = (index) => {
    if (index === 0) return;
    const nouvellesLignes = lignes.filter((_, i) => i !== index);
    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerPrixTTC = (prixHT, remise, tva) => {
    const prixApresRemise = prixHT * (1 - remise / 100);
    return prixApresRemise * (1 + tva / 100);
  };

  const mettreAJourLigne = (index, key, value) => {
    const nouvellesLignes = [...lignes];
    nouvellesLignes[index][key] = value;

    if (key === "codeArticle" && value.length > 0) {
      fetchArticleByCode(value, index);
    }

    const { prixHT, remise, tva } = nouvellesLignes[index];
    nouvellesLignes[index].prixTTC = calculerPrixTTC(prixHT, remise, tva);

    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerTotal = (lignes) => {
    const totalHT = lignes.reduce(
      (acc, ligne) =>
        acc + ligne.prixHT * ligne.quantite * (1 - ligne.remise / 100),
      0
    );
    const totalTTC = totalHT * (1 + lignes[0]?.tva / 100);
    setTotalHT(totalHT);
    setTotalTTC(totalTTC);
  };

  const fetchArticleByCode = async (code, index) => {
    try {
      const response = await axios.get(`http://localhost:5000/articles/code/${code}`);
      const article = response.data;
      const familleResponse = await axios.get(`http://localhost:5000/famille/${article.libelleFamille}`);
      const famille = familleResponse.data;

      const nouvellesLignes = [...lignes];
      nouvellesLignes[index] = {
        ...nouvellesLignes[index],
        libelleArticle: article.libelle,
        prixHT: article.prix_brut,
        tva: article.tva,
        famille: famille.designationFamille,
        prixTTC: calculerPrixTTC(
          article.prix_brut,
          nouvellesLignes[index].remise,
          article.tva
        ),
      };
      setLignes(nouvellesLignes);
      calculerTotal(nouvellesLignes);
    } catch (error) {
      console.error("Erreur de chargement des détails de l'article", error);
      const nouvellesLignes = [...lignes];
      nouvellesLignes[index] = {
        ...nouvellesLignes[index],
        libelleArticle: "",
        prixHT: 0,
        tva: 0,
        famille: null,
        prixTTC: 0,
      };
      setLignes(nouvellesLignes);
      calculerTotal(nouvellesLignes);
    }
  };

  const fetchClientByCode = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5000/clients/code/${code}`);
      setClientDetails(response.data);
    } catch (error) {
      console.error("Erreur de chargement des détails du client", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "10px" }}>
          <Typography  variant="h5" sx={{ marginBottom: 3 }}  style={{
                          fontWeight: "bold",
                          textAlign: "start",
                          color: "#1976d2",
                          fontSize: "1.8rem",
                          padding: "10px",
                          background:"white",
                          width:"100%"
                        }}>Éditer {typeDocument}</Typography>

          {/* Formulaire d'édition */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Section Client */}
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Client</Typography>
                <TextField
                  label="Code"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.code}
                  onChange={(e) => {
                    const code = e.target.value;
                    setClientDetails({ ...clientDetails, code });
                    if (code.length > 0) {
                      fetchClientByCode(code);
                    }
                  }}
                />
                <TextField
                  label="Adresse"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.adresse}
                  disabled
                />
                <TextField
                  label="Matricule"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.matricule}
                  disabled
                />
                <TextField
                  label="Raison Sociale"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.raisonSociale}
                  disabled
                />
                <TextField
                  label="Téléphone"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.telephone}
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
                  value={numero}
                  size="small"
                  disabled
                />
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={new Date(date).toISOString().split("T")[0]}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  disabled
                />
                <TextField
                  label="Réf. BCC"
                  fullWidth
                  margin="normal"
                  value={refBCC}
                  onChange={(e) => setRefBCC(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Point de Vente"
                  fullWidth
                  margin="normal"
                  value={pointVente}
                  onChange={(e) => setPointVente(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Type de Paiement"
                  fullWidth
                  margin="normal"
                  value={typePaiement}
                  onChange={(e) => setTypePaiement(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Commentaire"
                  fullWidth
                  margin="normal"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  multiline
                  rows={4}
                  size="small"
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
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <TextField
                        value={ligne.codeArticle}
                        onChange={(e) =>
                          mettreAJourLigne(index, "codeArticle", e.target.value)
                        }
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.famille || ""} size="small" />
                    </td>
                    <td>
                      <TextField value={ligne.libelleArticle} size="small" />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={ligne.quantite}
                        onChange={(e) =>
                          mettreAJourLigne(index, "quantite", e.target.value)
                        }
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.prixHT} size="small" />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={ligne.remise}
                        onChange={(e) =>
                          mettreAJourLigne(index, "remise", e.target.value)
                        }
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.tva} size="small" />
                    </td>
                    <td>
                      <TextField
                        value={ligne.prixTTC.toFixed(2)}
                        size="small"
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => supprimerLigne(index)}
                        size="small"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bouton Ajouter une ligne */}
            <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={ajouterLigne}
              size="small"
             
            >
            ajouter Ligne
            </Button>
            </Box>

            {/* Section Totaux */}
            <Typography variant="h6">Total HT : {totalHT.toFixed(2)}</Typography>
            <Typography variant="h6">Total TTC : {totalTTC.toFixed(2)}</Typography>

            {/* Boutons d'action */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                size="small"
              >
                Enregistrer
              </Button>
              <Button
                variant="contained"
                color= "primary"
                onClick={() => navigate(-1)}
                size="small"
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Document mis à jour avec succès !
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentEdit;