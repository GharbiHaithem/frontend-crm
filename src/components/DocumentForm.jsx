import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  FormHelperText,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";

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

});

const DocumentForm = ({ typeDocument }) => {
  const [client, setClient] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  useEffect(() => {
    axios.get(`http://localhost:5000/clients/all`).then((result) => setClient(result.data))
  }, [])
  console.log(client)
  console.log(typeDocument)
  const navigate = useNavigate();
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  // Formater les dates au format yyyy-mm-dd
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
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

          libelleArticle: "",
          code: "",
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Données envoyées :", values);
        const documentData = {
          typeDocument: values.type_achat,
          numero: values.numero,
          date: values.date,
          client: values.client,
          totalHT: values.totalHT || 0,
          totalTTC: values.totalTTC || 0,
          lignes: values.lignes || [],
          referenceCommande: values.refBCC,
          pointVente: values.pointVente,
          typePaiement: values.typePaiement,
          commentaire: values.commentaire,
        };
  console.log(documentData)
        const response = await axios.post(
          "http://localhost:5000/entetes/devis",
          documentData
        );
        setId(response.data._id);
        setEnregistrementReussi(true);

        setTimeout(() => {
          console.log("Typpe Loading")
          if (typeDocument === "Devis") {
            console.log("Typpe Devis")
            Swal.fire("Enregistré !", "Le Devis a été Ajouter avec succees.", "success");

          }
        }, 2000)
        navigate('/devis-consulter')

      } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
      }
    },
  });
  useEffect(() => {
    if (selectedClient) {
      axios.get(`http://localhost:5000/clients/${selectedClient}`).then((response) => {
        console.log(response.data)
        formik.setFieldValue("client", selectedClient)
        formik.setFieldValue("clientDetails", {
          code: response.data.code,
          adresse: response.data.adresse,
          matricule: response.data.matricule_fiscale,
          raisonSociale: response.data.raison_social,
          telephone: response.data.telephone,
        })
      })
    }

  }, [selectedClient])


  useEffect(() => {
    handelnumero(formik.values.date, typeDocument);
    handelnumeroEntete(formik.values.numero)
  }, [formik.values.date, typeDocument, formik.values.numero]);
  const generateNumero = (prefix, y, m, d, count) => {
    return `${prefix}${y}${m}${d}${String(count).padStart(3, "0")}`;
  };

  const handelnumero = async (date, type_achat) => {
    if (!date) return;

    const d = new Date(date);
    const y = d.getFullYear().toString().slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const formattedDate = `${d.getFullYear()}-${m}-${day}`;

    const prefix = type_achat === "Devis" ? "DV" : type_achat === "Bon Commande" ? "BC" : "BL";
    const prefixPV = "PV";

    try {
      const response = await axios.get(
        `http://localhost:5000/entetes/total-par-date/${type_achat}/${formattedDate}`
      );

      let count = response.data.count || 0;
      let numeroValide = false;
      let numero = "";

      while (!numeroValide) {
        count++;
        numero = generateNumero(prefix, y, m, day, count);

        try {
          await axios.post(`http://localhost:5000/entetes/verifyNumero`, { numero });
          numeroValide = true; // si pas d'erreur, c’est OK

        } catch (error) {
          if (error.response?.data?.message !== "Numero reservé pour autre devis") {
            console.error("Erreur lors de la vérification :", error);
            break;
          }
          // sinon, continue la boucle pour essayer le suivant
        }
      }

      formik.setFieldValue("numero", numero);
      formik.setFieldValue("pointVente", generateNumero(prefixPV, y, m, day, count));

    } catch (error) {
      console.error("Erreur globale génération numéro :", error);
    }
  };


  const ajouterLigne = () => {
    const nouvelleLigne = {
        code: "",
      quantite: 1,
      prixHT: 0,
      remise: 0,
      tva: 0,
      prixTTC: 0,

      libelleArticle: "",
    
    };
    formik.setFieldValue("lignes", [...formik.values.lignes, nouvelleLigne]);
  };

  const supprimerLigne = (index) => {

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

    if (key === "code" && value.length > 0) {
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
    navigate("/devis-consulter");
  };
  const [erreurArticle, setErreurArticle] = useState(null)
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
  const [message, setMessage] = useState({
    success: '',
    err: ''
  });
  const [numEntete, setNumEntete] = useState({
    success: '',
    err: ''
  });
  console.log(selectedClient)
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
  const handleVerifyCode = async (code) => {
    console.log(code)
    await axios.post('http://localhost:5000/clients/verifyCode', { code }).then((response) => setMessage({ success: response.data.message, err: "" })).catch((erreur) => setMessage({ success: '', err: erreur.response.data.message }))

  }
  const fetchArticleByCode = (code, index) => {
    axios
      .get(`http://localhost:5000/articles/code/${code}`)
      .then((response) => {
        const article = response.data;

    console.log(article)


        const nouvellesLignes = [...formik.values.lignes];
        nouvellesLignes[index] = {
          ...nouvellesLignes[index],
          libelleArticle: article.libelle,
          prixHT: article.prix_brut,
          tva: article.tva,
          code: article.code,
          prixTTC: calculerPrixTTC(
            article.prix_brut,
            nouvellesLignes[index].remise,
            article.tva
          ),
        };
        formik.setFieldValue("lignes", nouvellesLignes);
        calculerTotal(nouvellesLignes);

      })
      .catch((error) => {
        setErreurArticle(error.response.data.message)
        console.error("Erreur de chargement des détails de l'article", error);
        const nouvellesLignes = [...formik.values.lignes];
        nouvellesLignes[index] = {
          ...nouvellesLignes[index],
          libelleArticle: "",
          prixHT: 0,
          tva: 0,
          famille: "",
          prixTTC: 0,
          code:''
        };
        formik.setFieldValue("lignes", nouvellesLignes);
        calculerTotal(nouvellesLignes);
      });
  };
  const handelnumeroEntete = async (num) => {
    console.log(num)

    await axios.post(`http://localhost:5000/entetes/verifyNumero`, { numero: num }).then((result) => {
      setNumEntete({ success: result.data.message, err: "" })
      formik.setFieldValue('numero', num)
    }).catch((erreur) => setNumEntete({ success: "", err: erreur.response.data.message }))
  }
  const [selectCodeArticle, setSelectCodeArticle] = useState('')
  const [article, setArticle] = useState('')
  useEffect(() => {
    axios.get(`http://localhost:5000/articles/`).then((result) => setArticle(result.data))
  }, [])
  console.log(article)
  const [customError, setCustomError] = useState('');

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom style={{
            fontWeight: "bold",
            textAlign: "start",
            color: "#1976d2",
            fontSize: "1.8rem",
            padding: "10px",
            background: "white",
            width: "100%"
          }}>
            Nouveau  {typeDocument}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              {/* Section Client */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Client
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="client-select-label">Client</InputLabel>
                  <Select
                    labelId="client-select-label"
                    id="client-select"
                    value={selectedClient || ""} // contrôler la valeur sélectionnée
                    onChange={(e) => setSelectedClient(e.target.value)}
                    label="Client"
                    size="small"
                    sx={{
                      border: "none",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      "& fieldset": {
                        border: "none",
                      },
                    }}
                  >
                    {client?.map((c) => (
                      <MenuItem key={c?._id} value={c?._id}>
                        {c?.nom_prenom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Code"
                  name="clientDetails.code"
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={true}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: message.success
                          ? '#34D399' // Vert-400
                          : message.err ? '#F87171' : '' // Rouge-400
                      },
                      '&:hover fieldset': {
                        borderColor: message.success
                          ? '#34D399' // Vert-400
                          : message.err ? '#F87171' : ''// Rouge-400

                      },
                      '&.Mui-focused fieldset': {
                        borderColor: message.success
                          ? '#34D399' // Vert-400
                          : message.err ? '#F87171' : '' // Rouge-400

                      }
                    },
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
                  InputProps={{
                    style: {
                      fontWeight: 500,
                      borderRadius: '8px'
                    }
                  }}

                  value={formik.values.clientDetails.code}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value.length > 0) {
                      fetchClientByCode(e.target.value);
                      handleVerifyCode(e.target.value);
                    } else {
                      setMessage({}); // Réinitialiser les messages
                      setNumEntete({})
                    }
                  }}
                  error={
                    formik.touched.clientDetails?.code &&
                    Boolean(formik.errors.clientDetails?.code || message.err)
                  }
                  helperText={
                    message.success ? (
                      <span className="text-green-600">{message.success}</span>
                    ) : (
                      (formik.touched.clientDetails?.code && formik.errors.clientDetails?.code) ||
                      <span className="text-red-600">{message.err}</span>
                    )
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
                  disabled={true}
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
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
                  disabled={true}
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
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
                  disabled={true}
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
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
                  disabled={true}
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
                />
              </Box>

              {/* Section Générale */}
              <Box sx={{ flex: 1 }}>

                <Typography variant="h6" gutterBottom>
                  Général
                </Typography>
               <TextField
  label="Date"
  name="date"
  type="date"
  fullWidth
  margin="normal"
  value={formik.values.date}
  onChange={(e) => {
    const inputDate = new Date(e.target.value);
    const minDate = new Date(today);
    const maxDate = new Date(fiveDaysLater);

    // Réinitialiser l'erreur personnalisée
    setCustomError('');

    if (inputDate < minDate || inputDate > maxDate) {
      // Affiche une alerte ou définis une erreur personnalisée
      setCustomError("Veuillez choisir une date entre aujourd'hui et les 5 prochains jours.");
      return;
    }

    formik.handleChange(e);
    handelnumero(e.target.value, typeDocument);
  }}
  InputLabelProps={{ shrink: true }}
  error={
    formik.touched.date &&
    Boolean(formik.errors.date) ||
    Boolean(customError)
  }
  helperText={
    (formik.touched.date && formik.errors.date) || customError
  }
  size="small"
  InputProps={{
    inputProps: {
      min: formatDate(today),
      max: formatDate(fiveDaysLater),
    },
  }}
  sx={{
    border: "none",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": {
      border: "none",
    },
  }}
/>

                <TextField

                  label="Numéro"
                  name="numero"
                  fullWidth
                  margin="normal"
                  value={formik.values.numero}
                  onChange={(e) => handelnumeroEntete(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: numEntete.success
                          ? '#34D399' // Vert-400
                          : numEntete.err ? '#F87171' : '' // Rouge-400
                      },
                      '&:hover fieldset': {
                        borderColor: numEntete.success
                          ? '#34D399' // Vert-400
                          : numEntete.err ? '#F87171' : '' // Rouge-400

                      },
                      '&.Mui-focused fieldset': {
                        borderColor: numEntete.success
                          ? '#34D399' // Vert-400
                          : numEntete.err ? '#F87171' : ''// Rouge-400

                      }
                    },
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
                  error={
                    formik.touched.numero &&
                    Boolean(formik.errors?.numero || numEntete.err)
                  }
                  helperText={
                    numEntete.success ? (
                      <span className="text-green-600">{numEntete.success}</span>
                    ) : (
                      (formik.touched.numero && formik.errors?.numero) ||
                      <span className="text-red-600">{numEntete.err}</span>
                    )
                  }
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
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
                />
                <TextField
                  label="Point de Vente"
                  name="pointVente"
                  fullWidth
                  margin="normal"
                  value={formik.values.pointVente}
                  onChange={formik.handleChange}
                  size="small"
                  disabled={true}
                  error={
                    formik.touched?.pointVente &&
                    Boolean(formik.errors?.pointVente)
                  }
                  helperText={
                    formik.touched.pointVente &&
                    formik.errors.pointVente
                  }
                  sx={{
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      border: "none", // Supprimer le border du Select
                    },
                  }}
                />
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="type-paiement-label">Type de Paiement</InputLabel>
                  <Select
                    labelId="type-paiement-label"
                    id="typePaiement"
                    name="typePaiement"
                    value={formik.values.typePaiement}
                    onChange={formik.handleChange}
                    error={
                      formik.touched?.typePaiement &&
                      Boolean(formik.errors?.typePaiement)
                    }
                    sx={{
                      border: "none",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                      "& fieldset": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value="chèque">Chèque</MenuItem>
                    <MenuItem value="espèce">Espèce</MenuItem>
                    <MenuItem value="effet">Effet</MenuItem>
                  </Select>
                  {formik.touched?.typePaiement && formik.errors?.typePaiement && (
                    <FormHelperText error>{formik.errors.typePaiement}</FormHelperText>
                  )}
                </FormControl>

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
            {formik.values.lignes?.length > 0 && <Box sx={{ overflowX: "auto" }}>
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
                        <FormControl fullWidth sx={{ minWidth: 200 }}>
                          <InputLabel id="client-select-label">code article</InputLabel>
                          <Select
                            labelId="client-select-label"
                            id="client-select"
                            value={ligne.code || ""}
                            onChange={(e) =>{
                              mettreAJourLigne(index, "code", e.target.value)
                              fetchArticleByCode( e.target.value , index)}
                            }
                            label="article"
                            size="small"
                            sx={{
                              width: "100%", // prendra la largeur du FormControl
                              border: "none",
                              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                              borderRadius: "8px",
                              backgroundColor: "#fff",
                              "& fieldset": {
                                border: "none",
                              },
                            }}
                          >
                            {article && article.map((c) => (
                              <MenuItem key={c?._id} value={c?.code}>
                                {c?.code}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {erreurArticle && (
                          <span className="text-red-500 text-xs font-light">
                            {erreurArticle}
                          </span>
                        )}
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

                        <Button
                          onClick={() => supprimerLigne(index)}
                          size="small"
                          color="error"
                        >
                       <RiDeleteBin6Line className="text-2xl"/>
                        </Button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>}

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
              {/* <Button
                variant="contained"
                color="secondary"
                onClick={ouvrirFenetreGeneration}
                size="medium"
                disabled={!enregistrementReussi}
              >
                Générer
              </Button> */}
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