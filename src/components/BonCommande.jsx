import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const BonCommande = () => {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [familles, setFamilles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [numDocument, setNumDocument] = useState("");
  const [dateDocument, setDateDocument] = useState("");
  const [typeDocument, setTypeDocument] = useState("");
  const [clientDetails, setClientDetails] = useState({
    code: "",
    adresse: "",
    matricule: "",
    raisonSociale: "",
    telephone: "",
  });

  const [lignes, setLignes] = useState([
    {
      quantite: 1,
      prixHT: 0,
      remise: 0,
      tva: 0,
      prixTTC: 0,
      famille: "",
      libelleArticle: "",
      codeArticle: "",
    },
  ]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/famille")
      .then((response) => {
        setFamilles(response.data);
      })
      .catch((error) =>
        console.error("Erreur de chargement des familles", error)
      );
  }, []);
  useEffect(() => {
    if (date) {
      const today = new Date(date);
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      setNumero(`DV${year}${month}${day}0001`);
    }
  }, [date]);

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
    const nouvellesLignes = lignes.filter((i) => i !== index);
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

    // Si le champ modifié est "codeArticle", récupérer les détails de l'article
    if (key === "codeArticle" && value.length > 0) {
      fetchArticleByCode(value, index);
    }

    // Recalculer le PrixTTC
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
    const totalTTC = totalHT * (1 + lignes[0]?.tva / 100); // Utiliser la TVA de la première ligne
    setTotalHT(totalHT);
    setTotalTTC(totalTTC);
  };

  const enregistrerDocument = () => {
    alert('aaaaaa')
    console.log("Données envoyées")
    const documentData = {
      typeDocument: "Devis",
      numero,
      date,
      client,
      totalHT,
      totalTTC,
      lignes,
    };
 
    axios
      .post("http://localhost:5000/entetes/devis", documentData)
      .then((response) => {
        console.log("Succès :", response.data);
        console.log("Données envoyées :", documentData);
      })
      .catch((error) => {
        console.error("Erreur Axios :", error);
        if (error.response) {
          console.log("Détails de l'erreur :", error.response.data); // Ajoutez ceci
        }
      });
  };

  const handleCancel = () => {
    navigate("/factures");
  };

  const ouvrirFenetreGeneration = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGeneration = () => {
    if (!numDocument || !dateDocument || !typeDocument) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const updatedDocument = {
      numero: numDocument,
      date: dateDocument,
      typeDocument,
      client,
      totalHT,
      totalTTC,
      lignes,
    };

    axios
      .post("http://localhost:5000/entetes/devis/transform", updatedDocument)
      .then(() => navigate(`/${typeDocument.toLowerCase()}s`))
      .catch((error) =>
        console.error("Erreur lors de la génération du document", error)
      );

    handleCloseModal();
  };

  const fetchClientByCode = (code) => {
    axios
      .get(`http://localhost:5000/clients/code/${code}`)
      .then((response) => {
        const client = response.data;
        setClientDetails({
          code: client.code,
          adresse: client.adresse,
          matricule: client.matricule_fiscale,
          raisonSociale: client.raison_social,
          telephone: client.telephone,
        });
        setClient(client._id); // Mettre à jour l'ID du client dans l'état
      })
      .catch((error) => {
        console.error("Erreur de chargement des détails du client", error);
        // Réinitialiser les détails du client si aucun client n'est trouvé
        setClientDetails({
          code: code,
          adresse: "",
          matricule: "",
          raisonSociale: "",
          telephone: "",
        });
        setClient(""); // Réinitialiser l'ID du client
      });
  };
  const fetchArticleByCode = (code, index) => {
    axios
      .get(`http://localhost:5000/articles/code/${code}`)
      .then((response) => {
        const article = response.data;
        console.log("Article récupéré :", article);

        // Récupérer les détails de la famille
        axios
          .get(`http://localhost:5000/famille/${article.libelleFamille}`)
          .then((familleResponse) => {
            const famille = familleResponse.data;
            console.log("Famille récupérée :", famille);

            // Mettre à jour la ligne avec les détails de l'article et de la famille
            const nouvellesLignes = [...lignes];
            nouvellesLignes[index] = {
              ...nouvellesLignes[index],
              libelleArticle: article.libelle,
              prixHT: article.prix_brut,
              tva: article.tva,
              famille: famille.designationFamille, // Utiliser le nom de la famille
              prixTTC: calculerPrixTTC(
                article.prix_brut,
                nouvellesLignes[index].remise,
                article.tva
              ),
            };

            setLignes(nouvellesLignes);
            calculerTotal(nouvellesLignes);
          })
          .catch((error) => {
            console.error(
              "Erreur de chargement des détails de la famille",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Erreur de chargement des détails de l'article", error);

        // Réinitialiser les champs de l'article si l'API échoue
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
      });
  };
  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "350px" }}>
          <h1>Bon Commandesw</h1>
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
                  size="small"
                  value={clientDetails.code}
                  onChange={(e) => {
                    const code = e.target.value;
                    setClientDetails({ ...clientDetails, code }); // Mettre à jour le code dans l'état
                    if (code.length > 0) {
                      fetchClientByCode(code); // Appeler l'API pour récupérer les détails du client
                    }
                  }}
                />
                <TextField
                  label="Adresse"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.adresse}
                />
                <TextField
                  label="Matricule"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.matricule}
                />
                <TextField
                  label="Raison Sociale"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.raisonSociale}
                />
                <TextField
                  label="Téléphone"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.telephone}
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
                />
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  label="Réf. BCC"
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Point de Vente"
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Type de Paiement"
                  fullWidth
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Commentaire"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  size="small"
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
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <TextField
                        value={ligne.codeArticle}
                        onChange={(e) => {
                          const code = e.target.value;
                          console.log(e.target.value);
                          mettreAJourLigne(index, "codeArticle", code);
                          if (code.length > 0) {
                            fetchArticleByCode(code, index);
                          }
                        }}
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField
                        type="string"
                        value={ligne.famille || ""} // Afficher la famille
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField
                        type="string"
                        value={ligne.libelleArticle}
                        size="small"
                      />
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
                      <TextField
                        type="number"
                        value={ligne.prixHT}
                        size="small"
                      />
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
                      <TextField type="number" value={ligne.tva} size="small" />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={ligne.prixTTC.toFixed(2)}
                        size="small"
                      />
                    </td>
                    <td>
                      {" "}
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

            <Button variant="contained" onClick={ajouterLigne} size="small">
              Ajouter une ligne
            </Button>

            <h3>Total HT : {totalHT.toFixed(2)}</h3>
            <h3>Total TTC : {totalTTC.toFixed(2)}</h3>

            <Button
              variant="contained"
              color="primary"
              onClick={ouvrirFenetreGeneration}
              size="small"
            >
              Générer
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={enregistrerDocument}
              size="small"
            >
              Enregistrerss
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCancel}
              size="small"
            >
              Annulerrrrr
            </Button>

            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Choisir le type de document</DialogTitle>
              <DialogContent>
                <TextField
                  label="Numéro"
                  fullWidth
                  value={numDocument}
                  onChange={(e) => setNumDocument(e.target.value)}
                  margin="normal"
                  size="small"
                />
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  value={dateDocument}
                  onChange={(e) => setDateDocument(e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type de document</InputLabel>
                  <Select
                    value={typeDocument}
                    onChange={(e) => setTypeDocument(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Bon de Commande">Bon de Commande</MenuItem>
                    <MenuItem value="Bon de Livraison">
                      Bon de Livraison
                    </MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} size="small">
                  Annuler
                </Button>
                <Button onClick={handleGeneration} color="primary" size="small">
                  Facturer
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default BonCommande;
