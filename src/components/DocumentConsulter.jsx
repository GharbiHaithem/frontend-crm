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

const DocumentConsulter = ({ typeDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [typeAchat, setTypeAchat] = useState("Bon Commande");
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
  const handleGeneration = () => {
    if (!selectedDocument) return;
    console.log(selectedDocument)
    const documentData = {
      typeDocument: typeAchat,
      id: selectedDocument._id,
      numero: selectedDocument.numero?.replace(
        /^DV/,
        typeAchat === "Bon Commande" ? "BC" : "BL"
      ),
      date: selectedDocument.date,
      client: selectedDocument?.client?.nom_prenom,
      totalHT: selectedDocument.totalHT,
      totalTTC: selectedDocument.totalTTC,
      lignes: selectedDocument.lignes || [],
      referenceCommande: selectedDocument.referenceCommande || "",
      pointVente: selectedDocument.pointVente || "",
      typePaiement: selectedDocument.typePaiement || "",
      commentaire: selectedDocument.commentaire || "",
    };
    
    navigate(`/${typeAchat.toLowerCase().replace(" ", "-")}`, {
      state: documentData,
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
      : document.client?.raisonSociale;

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
      ligne.codeArticle || '',
      ligne.famille || '',
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
      "Famille",
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

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "50px" }}>
          <h1>Consultation {typeDocument}</h1>
         <div className="flex items-center gap-5">
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
         </div>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <TextField
              label="Rechercher par numéro"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  <TableCell>Client</TableCell>
                  <TableCell>Total HT</TableCell>
                  <TableCell>Total TTC</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDocuments.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell>{typeDocument === "Facture" ? doc.numFacture : doc.numero}</TableCell>
                    <TableCell>
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                   
                      {typeDocument === "Facture" 
                        ? doc?.client?.nom_prenom 
                        : doc.client?.raison_social}
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
                            setOpenModal(true);
                          }}
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
              <Button onClick={handleGeneration} color="primary">
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
      </Box>
    </>
  );
};

export default DocumentConsulter;