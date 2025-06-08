import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  DialogContent,
  InputLabel,
  Select,
  DialogActions,
  DialogTitle,
  Dialog,
  Typography,
  Menu,

} from "@mui/material";
import * as Yup from "yup";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { FilterList, Info as InfoIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProgressBarPending from "./ProgressBarPending/ProgressBarPending";
import { useFormik } from "formik";
import {useLocation} from 'react-router-dom'
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
const DocumentConsulter = ({ typeDocument }) => {
  const location = useLocation()
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [typeAchat, setTypeAchat] = useState("Bon Commande");
  const navigate = useNavigate();
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  // Formater les dates au format yyyy-mm-dd
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const{factId} = location.state || {}
  console.log(factId)
  const itemsPerPage = 10;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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
      alert(JSON.stringify(2, null, values))
      await handleGeneration()
    }
  })
  const [numEntete, setNumEntete] = useState({
    success: '',
    err: ''
  });
  const handelnumeroEntete = async (num) => {
    console.log(num)

    await axios.post(`http://localhost:5000/entetes/verifyNumero`, { numero: num }).then((result) => {
      setNumEntete({ success: result.data.message, err: "" })
      formik.setFieldValue('numero', num)
    }).catch((erreur) => setNumEntete({ success: "", err: erreur.response.data.message }))
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Ouvre le menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Ferme le menu
  };
  // Charger les documents depuis le backend
  useEffect(() => {
    const endpoint = typeDocument === "Facture"
      ? 'http://localhost:5000/facture/all'
      : `http://localhost:5000/entetes?type=${typeDocument}`;

    axios.get(endpoint)
      .then((response) => {
        const data = response.data || [];
        console.log("Données chargées:", data);
        setDocuments(data);
      })
      .catch((error) => {
        console.error("Erreur de chargement", error);
        setDocuments([]);
      });
  }, [typeDocument]);

  // Filtrage des documents
  const filteredDocuments = useMemo(() => {
    if (!documents || !Array.isArray(documents)) return [];

    return documents.filter(doc => {
      const docNum = typeDocument === "Facture"
        ? doc.numFacture
        : doc.numero;

      return docNum?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [documents, searchTerm, typeDocument]);

  // Documents pour la page actuelle
  const currentDocuments = useMemo(() => {
    return filteredDocuments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredDocuments, currentPage, itemsPerPage]);
  console.log(documents)
  // Générer un nouveau document
  const handleGeneration = async () => {
    if (!selectedDocument) return;
    console.log(selectedDocument);
    console.log(typeAchat);
    const documentData = {
      typeDocument: typeAchat,
      id: selectedDocument._id,
      numero: formik.values.numero,
      date: formik.values.date, // <-- Remplace ici par la date système actuelle
      client: selectedDocument?.client,
      totalHT: selectedDocument.totalHT,
      totalTTC: selectedDocument.totalTTC,
      lignes: selectedDocument.lignes || [],
      referenceCommande: selectedDocument.referenceCommande || "",
      pointVente: formik.values.pointVente || "",
      typePaiement: selectedDocument.typePaiement || "",
      commentaire: selectedDocument.commentaire || "",
    };
    console.log(documentData);
    navigate(`/${typeAchat.toLowerCase().replace(" ", "-")}`, {
      state: await documentData,
    });
    setOpenModal(false);
  };

  // Afficher les détails d'un document
  const handleViewDetails = (id) => {
    navigate(`/document/${typeDocument}/${id}`);
  };

  // Modifier un document
  const handleEdit = (id) => {
    navigate(`/document/${typeDocument}/edit/${id}`);
  };

  // Supprimer un document
  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
       cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint = typeDocument === "Facture"
          ? `http://localhost:5000/facture/${id}`
          : `http://localhost:5000/entetes/${id}`;

        axios.delete(endpoint)
          .then(() => {
            setDocuments(documents.filter((doc) => doc._id !== id));
            Swal.fire("Supprimé !", "Le document a été supprimé.", "success");
          })
          .catch((error) => {
            Swal.fire("Erreur", "Impossible de supprimer le document", "error");
            console.error("Erreur de suppression", error);
          });
      }
    });
  };
  const [date, setDate] = useState(null);
  // Télécharger un document en PDF
  const handleDownload = (document) => {
    const doc = new jsPDF();
    // Titre du document
    let titreDocument = typeDocument;
    if (typeDocument === "Bon Commande") titreDocument = "Bon de Commande";
    if (typeDocument === "Bon Livraison") titreDocument = "Bon de Livraison";

    // Formater la date
    const dateFormatee = new Date(document.date).toLocaleDateString();

    // Informations client
    const clientInfo = typeDocument === "Facture"
      ? document.client?.nom_prenom
      : document.client?.nom_prenom;

    // Ajouter le titre
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text(titreDocument, 15, 20);

    // Informations générales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Numéro: ${typeDocument === "Facture" ? document.numFacture : document.numero}`, 15, 30);
    doc.text(`Date: ${dateFormatee}`, 15, 40);
    doc.text(`Client: ${clientInfo}`, 15, 50);

    if (typeDocument !== "Facture") {
      doc.text(`Réf. BCC: ${document.referenceCommande || ''}`, 15, 60);
      doc.text(`Point de Vente: ${document.pointVente || ''}`, 15, 70);
      doc.text(`Type de Paiement: ${document.typePaiement || ''}`, 15, 80);
      doc.text(`Commentaire: ${document.commentaire || ''}`, 15, 90);
    }

    // Préparer les données du tableau
    const tableData = (document.lignes || []).map((ligne, index) => [
      index + 1,
      ligne.code || '',

      ligne.libelleArticle || '',
      ligne.quantite || 0,
      (ligne.prixHT || 0).toFixed(2),
      (ligne.remise || 0).toFixed(2),
      (ligne.tva || 0).toFixed(2),
      (ligne.prixTTC || 0).toFixed(2),
    ]);

    // En-têtes du tableau
    const headers = [
      "N°",
      "Code Article",

      "Libellé Article",
      "Quantité",
      "Prix HT",
      "Remise",
      "TVA",
      "Prix TTC",
    ];

    // Ajouter le tableau
    autoTable(doc, {
      startY: typeDocument === "Facture" ? 60 : 100,
      head: [headers],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Ajouter les totaux
    doc.setFontSize(12);
    doc.text(
      `Total HT: ${(document.totalHT || 0).toFixed(2)}`,
      15,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total TTC: ${(document.totalTTC || 0).toFixed(2)}`,
      15,
      doc.lastAutoTable.finalY + 20
    );

    // Sauvegarder le PDF
    doc.save(`${titreDocument}_${typeDocument === "Facture" ? document.numFacture : document.numero}.pdf`);
  };

  // Pagination
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDocuments.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  console.log(typeDocument)
  const handleSearch = async (value) => {
    try {
      const response = await axios.get(`http://localhost:5000/facture/search?query=${value}`);
      console.log(response.data);
      setDocuments(response.data)
    } catch (error) {
      console.error("Erreur de recherche:", error.response?.data || error.message);
    }
    console.log(document)
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Utilisez un debounce au lieu de setTimeout
    const timer = setTimeout(() => {
      if (value.trim().length > 0) {
        handleSearch(value);
      }
    }, 500); // Réduisez à 500ms

    return () => clearTimeout(timer);
  };
  const [startGeneration, setStartGeneration] = useState(false)
  const generateFacture = async (document) => {
    setStartGeneration(true)
    console.log(document)
    setTimeout(async () => {
      await axios
        .post("http://localhost:5000/facture/create", document)
        .then((res) => {
          console.log(res);
        });
    }, 1000);
    await axios.delete(`http://localhost:5000/entetes/${document._id}`)
    setTimeout(() => {
      navigate('/factures')
    }, 1000)
  }
  console.log(startGeneration)
  const [code, setCode] = useState(null)
  const handleFilter = async () => {
    let url = `http://localhost:5000/entetes/searchFilter?typeDocument=${encodeURIComponent(typeDocument)}`;

    if (code) {
      url += `&code=${encodeURIComponent(code)}`;
    }

    if (date) {
      const formattedDate = new Date(date).toLocaleDateString('en-CA'); // "2024-05-22"
      url += `&date=${encodeURIComponent(formattedDate)}`;
    }

    try {
      const res = await fetch(url);
      const result = await res.json();
      setDocuments(result);
    } catch (error) {
      console.error("Erreur lors du filtrage :", error);
    }
  };
  const [generateDocument, setGenerateDocument] = useState(false)

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
    console.log(type_achat)
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
  useEffect(() => {
    if (formik.values.date) {
      handelnumero(formik.values.date, typeAchat);
      handelnumeroEntete(formik.values.numero)
    }


  }, [formik.values.date, typeDocument, formik.values.numero]);
  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "10px" }}>
          <Typography
            variant="h4"
            style={{
              fontWeight: "bold",
              color: "#1976d2",
              fontSize: "2rem",
            }}
          >


            Consultation {typeDocument}  </Typography>
          {typeDocument !== 'Facture' && <div className="flex items-center my-1 gap-5">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/${typeDocument.toLowerCase()}/ajouter`)}
            >
              Ajouter
            </Button>
            <IconButton
              onClick={handleClick}
              color="primary"
              aria-label="filtrer"
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              <FilterList style={{ fontSize: "1.5rem" }} />
            </IconButton>
          </div>}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2, width: 1 }}>
            <TextField
              label="Rechercher par numéro"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Date</TableCell>

                  <TableCell>Client Code</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Total HT</TableCell>
                  <TableCell>Total TTC</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDocuments.map((doc) => (
                  <TableRow style={{background: doc._id===factId ?'#CFCED2' : ''}}  key={doc._id}>
                    <TableCell>{typeDocument === "Facture" ? doc.numFacture : doc.numero}</TableCell>
                    <TableCell>
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{doc?.client?.code}</TableCell>
                    <TableCell>

                      {typeDocument === "Facture"
                        ? doc?.client?.nom_prenom
                        : doc.client?.nom_prenom}
                    </TableCell>

                    <TableCell>{(doc.totalHT || 0).toFixed(2)}</TableCell>
                    <TableCell>{(doc.totalTTC || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(doc._id)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(doc._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doc._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDownload(doc)}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {typeDocument !== "Facture" && (
                        <Button
                          color="primary"
                          onClick={() => {
                            setSelectedDocument(doc);
                            if (typeDocument !== "Bon Commande" && typeDocument !== "Bon Livraison") {
                              setOpenModal(true);
                            } else {
                              generateFacture(doc)
                            }

                          }
                          }
                        >
                          Générer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ mx: 2, display: "flex", alignItems: "center" }}>
              Page {currentPage} sur{" "}
              {Math.ceil(filteredDocuments.length / itemsPerPage)}
            </Box>
            <IconButton
              onClick={handleNextPage}
              disabled={
                currentPage >= Math.ceil(filteredDocuments.length / itemsPerPage)
              }
              color="primary"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Modal pour la génération de document */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Choisir le type de document</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={typeAchat}
                  onChange={(e) => setTypeAchat(e.target.value)}
                >
                  <MenuItem value="Bon Commande">Bon de Commande</MenuItem>
                  <MenuItem value="Bon Livraison">Bon de Livraison</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Annuler</Button>
              <Button onClick={() => {
                setGenerateDocument(true)
                setOpenModal(false)
              }} color="primary">
                Générer
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog className="w-full" open={generateDocument} onClose={() => setGenerateDocument(false)}>
            <DialogTitle>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "semiBold",
                  color: "#1976d2",
                  fontSize: "1.3rem",
                }}
              >
                Generer vers {typeAchat}

              </Typography>
            </DialogTitle>
            <DialogContent>
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
                                  border: "none", // Supprimer le border du Select
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
                  }
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
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" size="small" color="error" onClick={() => setGenerateDocument(false)}>Annuler</Button>
              <Button onClick={() => {
                handleGeneration()
                setGenerateDocument(false)
              }} color="primary"
                variant="outlined" size="small"
                disabled={!formik.values.date && !formik.values.numero}
              >
                Générer
              </Button>
            </DialogActions>
          </Dialog>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Paper
              style={{ padding: "20px", width: "300px", borderRadius: "10px" }}
            >
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  color: "#1976d2",
                  fontSize: "1.2rem",
                }}
              >
                Filtres
              </Typography>
              <TextField
                name="client"
                label="Client"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                style={{ fontSize: "1.1rem" }}
              />

              <DatePicker
                label="Sélectionnez une date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                format="dd/MM/yyyy" // Format français
              />

              <Button
                onClick={handleFilter}
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  marginTop: "10px",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  padding: "10px 20px",
                }}
              >
                Appliquer
              </Button>
            </Paper>
          </Menu>
        </Box>
        {startGeneration && <ProgressBarPending setStartGeneration={setStartGeneration} />}
      </Box>
    </>
  );
};

export default DocumentConsulter;