import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Typography,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const validationSchema = Yup.object().shape({
  numero: Yup.string().required("Le numéro est obligatoire"),
  date: Yup.date().required("La date est obligatoire"),
  clientDetails: Yup.object().shape({
    code: Yup.string().required("Le code client est obligatoire"),
    adresse: Yup.string().required("adresse client est obligatoire"),
    matricule: Yup.string().required("matricule client est obligatoire"),
    raisonSociale: Yup.string().required("raisonSociale client est obligatoire"),
    telephone: Yup.string().required("telephone client est obligatoire"),
  }),
  refBCC: Yup.string().required("refBCC  est obligatoire"),
  pointVente: Yup.string().required("pointVente  est obligatoire"),
  typePaiement: Yup.string().required("typePaiement  est obligatoire"),
  commentaire: Yup.string().required("commentaire  est obligatoire"),
  lignes: Yup.array()
    .of(
      Yup.object().shape({
        codeArticle: Yup.string().required("Le code article est obligatoire"),
        famille: Yup.string(),
        libelleArticle: Yup.string(),
        quantite: Yup.number()
          .required("La quantité est obligatoire")
          .min(1, "La quantité doit être au moins 1"),
        prixHT: Yup.number().required("Le prix HT est obligatoire"),
        remise: Yup.number()
          .min(0, "La remise ne peut pas être négative")
          .max(100, "La remise ne peut pas dépasser 100%"),
        tva: Yup.number().required("La TVA est obligatoire"),
        prixTTC: Yup.number().required("Le prix TTC est obligatoire"),
      })
    )
    .min(1, "Au moins une ligne est requise"),
});

const DocumentForm = ({ typeDocument }) => {
  console.log(typeDocument)
  const navigate = useNavigate();
  const [familles, setFamilles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [enregistrementReussi, setEnregistrementReussi] = useState(false);
  const [id, setId] = useState();

  const formik = useFormik({
    initialValues: {
      numero: "",
      date: "",
      client: "",
      totalHT: 0,
      totalTTC: 0,
      refBCC: "",
      pointVente: "",
      typePaiement: "",
      commentaire: "",
      type_achat: typeDocument,
      clientDetails: {
        code: "",
        adresse: "",
        matricule: "",
        raisonSociale: "",
        telephone: "",
      },
      lignes: [
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
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const documentData = {
          typeDocument: values.type_achat,
          numero: values.numero,
          date: values.date,
          client: values.client,
          totalHT: values.totalHT,
          totalTTC: values.totalTTC,
          lignes: values.lignes,
          referenceCommande: values.refBCC,
          pointVente: values.pointVente,
          typePaiement: values.typePaiement,
          commentaire: values.commentaire,
        };

        const response = await axios.post(
          "http://localhost:5000/entetes/devis",
          documentData
        );
        setId(response.data._id);
        setEnregistrementReussi(true);
       if(typeDocument==="Devis") {
        return
       }else{
        setTimeout(async () => {
          await axios
            .post("http://localhost:5000/facture/create", documentData)
            .then((res) => {
              console.log(res);
            });
        }, 1000);
       }
       
      } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
      }
    },
  });

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
    handelnumero(formik.values.date, typeDocument);
  }, [formik.values.date, typeDocument]);

  const handelnumero = async (date, type_achat) => {
    if (date) {
      const today = new Date(date);
      const year = today.getFullYear().toString().slice(-2);

      let entete =
        type_achat === "Devis"
          ? "DV"
          : type_achat === "Bon Commande"
          ? "BC"
          : "BL";

      try {
        const response = await axios.get(
          `http://localhost:5000/entetes/total/${type_achat}/${today.getFullYear()}`
        );

        if (response.status === 200) {
          const documentCount = parseInt(response.data.documentCount, 10) || 0;
          formik.setFieldValue(
            "numero",
            `${entete}01${year}${String(documentCount + 1).padStart(4, "0")}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de la génération du numéro:", error);
      }
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
    formik.setFieldValue("lignes", [...formik.values.lignes, nouvelleLigne]);
  };

  const supprimerLigne = (index) => {
    if (index === 0) return;
    const nouvellesLignes = formik.values.lignes.filter((_, i) => i !== index);
    formik.setFieldValue("lignes", nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerPrixTTC = (prixHT, remise, tva) => {
    const prixApresRemise = prixHT * (1 - remise / 100);
    return prixApresRemise * (1 + tva / 100);
  };

  const mettreAJourLigne = (index, key, value) => {
    const nouvellesLignes = [...formik.values.lignes];
    nouvellesLignes[index][key] = value;

    if (key === "codeArticle" && value.length > 0) {
      fetchArticleByCode(value, index);
    }

    const { prixHT, remise, tva } = nouvellesLignes[index];
    nouvellesLignes[index].prixTTC = calculerPrixTTC(prixHT, remise, tva);

    formik.setFieldValue("lignes", nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerTotal = (lignes) => {
    const totalHT = lignes.reduce(
      (acc, ligne) =>
        acc + ligne.prixHT * ligne.quantite * (1 - ligne.remise / 100),
      0
    );
    const totalTTC = totalHT * (1 + lignes[0]?.tva / 100);
    formik.setFieldValue("totalHT", totalHT);
    formik.setFieldValue("totalTTC", totalTTC);
  };

  const handleCancel = () => {
    navigate("/Home");
  };

  const ouvrirFenetreGeneration = () => {
    if (enregistrementReussi) {
      setOpenModal(true);
    } else {
      alert("Veuillez d'abord enregistrer le document.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGeneration = (typeDocumentChoisi) => {
    const documentData = {
      typeDocument: typeDocumentChoisi,
      id,
      numero:
        typeDocumentChoisi === "Bon Commande"
          ? formik.values.numero.replace(/^DV/, "BC")
          : formik.values.numero.replace(/^DV/, "BL"),
      date: formik.values.date,
      client: formik.values.clientDetails,
      totalHT: formik.values.totalHT,
      totalTTC: formik.values.totalTTC,
      lignes: formik.values.lignes,
      referenceCommande: formik.values.refBCC,
      pointVente: formik.values.pointVente,
      typePaiement: formik.values.typePaiement,
      commentaire: formik.values.commentaire,
    };

    if (typeDocumentChoisi === "Bon Commande") {
      navigate("/bon-commande", { state: documentData });
    } else if (typeDocumentChoisi === "Bon Livraison") {
      navigate("/bon-livraison", { state: documentData });
    }

    handleCloseModal();
  };

  const fetchClientByCode = (code) => {
    axios
      .get(`http://localhost:5000/clients/code/${code}`)
      .then((response) => {
        const client = response.data;
        formik.setFieldValue("clientDetails", {
          code: client.code,
          adresse: client.adresse,
          matricule: client.matricule_fiscale,
          raisonSociale: client.raison_social,
          telephone: client.telephone,
        });
        formik.setFieldValue("client", client._id);
      })
      .catch((error) => {
        console.error("Erreur de chargement des détails du client", error);
        formik.setFieldValue("clientDetails", {
          ...formik.values.clientDetails,
          code: code,
        });
        formik.setFieldValue("client", "");
      });
  };

  const fetchArticleByCode = (code, index) => {
    axios
      .get(`http://localhost:5000/articles/code/${code}`)
      .then((response) => {
        const article = response.data;
        axios
          .get(`http://localhost:5000/famille/${article.libelleFamille}`)
          .then((familleResponse) => {
            const famille = familleResponse.data;
            const nouvellesLignes = [...formik.values.lignes];
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
            formik.setFieldValue("lignes", nouvellesLignes);
            calculerTotal(nouvellesLignes);
          });
      })
      .catch((error) => {
        console.error("Erreur de chargement des détails de l'article", error);
        const nouvellesLignes = [...formik.values.lignes];
        nouvellesLignes[index] = {
          ...nouvellesLignes[index],
          libelleArticle: "",
          prixHT: 0,
          tva: 0,
          famille: "",
          prixTTC: 0,
        };
        formik.setFieldValue("lignes", nouvellesLignes);
        calculerTotal(nouvellesLignes);
      });
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {typeDocument}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              {/* Section Client */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Client
                </Typography>
                <TextField
                  label="Code"
                  name="clientDetails.code"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formik.values.clientDetails.code}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value.length > 0) {
                      fetchClientByCode(e.target.value);
                    }
                  }}
                  error={
                    formik.touched.clientDetails?.code &&
                    Boolean(formik.errors.clientDetails?.code)
                  }
                  helperText={
                    formik.touched.clientDetails?.code &&
                    formik.errors.clientDetails?.code
                  }
                />
                <TextField
                  label="Adresse"
                  name="clientDetails.adresse"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formik.values.clientDetails.adresse}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientDetails?.adresse &&
                    Boolean(formik.errors.clientDetails?.adresse)
                  }
                  helperText={
                    formik.touched.clientDetails?.adresse &&
                    formik.errors.clientDetails?.adresse
                  }
                />
                <TextField
                  label="Matricule"
                  name="clientDetails.matricule"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formik.values.clientDetails.matricule}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientDetails?.matricule &&
                    Boolean(formik.errors.clientDetails?.matricule)
                  }
                  helperText={
                    formik.touched.clientDetails?.matricule &&
                    formik.errors.clientDetails?.matricule
                  } 
                />
                <TextField
                  label="Raison Sociale"
                  name="clientDetails.raisonSociale"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formik.values.clientDetails.raisonSociale}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientDetails?.raisonSociale &&
                    Boolean(formik.errors.clientDetails?.raisonSociale)
                  }
                  helperText={
                    formik.touched.clientDetails?.raisonSociale &&
                    formik.errors.clientDetails?.raisonSociale
                  } 
                />
                <TextField
                  label="Téléphone"
                  name="clientDetails.telephone"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formik.values.clientDetails.telephone}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.clientDetails?.telephone &&
                    Boolean(formik.errors.clientDetails?.telephone)
                  }
                  helperText={
                    formik.touched.clientDetails?.telephone &&
                    formik.errors.clientDetails?.telephone
                  } 
                />
              </Box>

              {/* Section Générale */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Général
                </Typography>
                <TextField
                  label="Numéro"
                  name="numero"
                  fullWidth
                  margin="normal"
                  value={formik.values.numero}
                  onChange={formik.handleChange}
                  error={formik.touched.numero && Boolean(formik.errors.numero)}
                  helperText={formik.touched.numero && formik.errors.numero}
                  size="small"
                />
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={formik.values.date}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handelnumero(e.target.value, typeDocument);
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  size="small"
                />
                <TextField
                  label="Réf. BCC"
                  name="refBCC"
                  fullWidth
                  margin="normal"
                  value={formik.values.refBCC}
                  onChange={formik.handleChange}
                  size="small"
                  error={
                    formik.touched?.refBCC &&
                    Boolean(formik.errors?.refBCC)
                  }
                  helperText={
                    formik.touched?.refBCC &&
                    formik.errors?.refBCC
                  } 
                />
                <TextField
                  label="Point de Vente"
                  name="pointVente"
                  fullWidth
                  margin="normal"
                  value={formik.values.pointVente}
                  onChange={formik.handleChange}
                  size="small"
                  error={
                    formik.touched?.pointVente &&
                    Boolean(formik.errors?.pointVente)
                  }
                  helperText={
                    formik.touched.pointVente &&
                    formik.errors.pointVente
                  } 
                />
                <TextField
                  label="Type de Paiement"
                  name="typePaiement"
                  fullWidth
                  margin="normal"
                  value={formik.values.typePaiement}
                  onChange={formik.handleChange}
                  size="small"
                  error={
                    formik.touched?.typePaiement &&
                    Boolean(formik.errors?.typePaiement)
                  }
                  helperText={
                    formik.touched?.typePaiement &&
                    formik.errors?.typePaiement
                  } 
                />
                <TextField
                  label="Commentaire"
                  name="commentaire"
                  fullWidth
                  margin="normal"
                  value={formik.values.commentaire}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                  size="small"
                  error={
                    formik.touched?.commentaire &&
                    Boolean(formik.errors?.commentaire)
                  }
                  helperText={
                    formik.touched?.commentaire &&
                    formik.errors?.commentaire
                  } 
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Lignes du document
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      N°
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Code Article
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Famille
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Libellé Article
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Quantité
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Prix HT
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Remise (%)
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      TVA (%)
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Prix TTC
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formik.values.lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.codeArticle}
                          onChange={(e) =>
                            mettreAJourLigne(index, "codeArticle", e.target.value)
                          }
                          size="small"
                          error={
                            formik.touched.lignes?.[index]?.codeArticle &&
                            Boolean(formik.errors.lignes?.[index]?.codeArticle)
                          }
                          helperText={
                            formik.touched.lignes?.[index]?.codeArticle &&
                            formik.errors.lignes?.[index]?.codeArticle
                          }
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.famille}
                          size="small"
                          disabled
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.libelleArticle}
                          size="small"
                          disabled
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          type="number"
                          value={ligne.quantite}
                          onChange={(e) =>
                            mettreAJourLigne(index, "quantite", e.target.value)
                          }
                          size="small"
                          error={
                            formik.touched.lignes?.[index]?.quantite &&
                            Boolean(formik.errors.lignes?.[index]?.quantite)
                          }
                          helperText={
                            formik.touched.lignes?.[index]?.quantite &&
                            formik.errors.lignes?.[index]?.quantite
                          }
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.prixHT.toFixed(2)}
                          size="small"
                          disabled
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          type="number"
                          value={ligne.remise}
                          onChange={(e) =>
                            mettreAJourLigne(index, "remise", e.target.value)
                          }
                          size="small"
                          error={
                            formik.touched.lignes?.[index]?.remise &&
                            Boolean(formik.errors.lignes?.[index]?.remise)
                          }
                          helperText={
                            formik.touched.lignes?.[index]?.remise &&
                            formik.errors.lignes?.[index]?.remise
                          }
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.tva}
                          size="small"
                          disabled
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <TextField
                          value={ligne.prixTTC.toFixed(2)}
                          size="small"
                          disabled
                        />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {index !== 0 && (
                          <Button
                            onClick={() => supprimerLigne(index)}
                            size="small"
                            color="error"
                          >
                            Supprimer
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            <Box sx={{ mt: 2, mb: 4 }}>
              <Button
                variant="outlined"
                onClick={ajouterLigne}
                size="small"
                sx={{ mr: 2 }}
              >
                Ajouter une ligne
              </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6">
                Total HT: {formik.values.totalHT.toFixed(2)} DT
              </Typography>
              <Typography variant="h6">
                Total TTC: {formik.values.totalTTC.toFixed(2)} DT
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
              >
                Enregistrer
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={ouvrirFenetreGeneration}
                size="medium"
                disabled={!enregistrementReussi}
              >
                Générer
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                size="medium"
              >
                Annuler
              </Button>
            </Box>
          </form>

          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Choisir le type de document</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={formik.values.type_achat}
                  onChange={(e) =>
                    formik.setFieldValue("type_achat", e.target.value)
                  }
                  size="small"
                >
                  <MenuItem value="Bon Commande">Bon de Commande</MenuItem>
                  <MenuItem value="Bon Livraison">Bon de Livraison</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} size="small">
                Annuler
              </Button>
              <Button
                onClick={() => handleGeneration(formik.values.type_achat)}
                color="primary"
                size="small"
              >
                Générer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default DocumentForm;