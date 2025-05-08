import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const DocumentList = ({ typeDocument }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  console.log(typeDocument)
  useEffect(() => {
    // Récupérer les documents depuis l'API
    axios.get(`http://localhost:5000/entetes/${typeDocument.toLowerCase()}`)
      .then(response => {
        setDocuments(response.data);
      })
      .catch(error => {
        console.error("Erreur de chargement des documents", error);
      });
  }, [typeDocument]);

  const handleViewDocument = (id) => {
    // Rediriger vers la page de détail du document
    navigate(`/${typeDocument}/${id}`);
  };

  const handleCreateDocument = () => {
    // Rediriger vers la page de création d'un nouveau document
    navigate(`/${typeDocument}/nouveau`);
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Liste des {typeDocument}s</h1>
          <Button variant="contained" color="primary" onClick={handleCreateDocument} sx={{ mb: 2 }}>
            Créer un {typeDocument}
          </Button>
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
                {documents.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>{document.numero}</TableCell>
                    <TableCell>{new Date(document.date).toLocaleDateString()}</TableCell>
                    <TableCell>{document.client?.raisonSociale || "N/A"}</TableCell>
                    <TableCell>{document.totalHT.toFixed(2)}</TableCell>
                    <TableCell>{document.totalTTC.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleViewDocument(document._id)}>
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default DocumentList;