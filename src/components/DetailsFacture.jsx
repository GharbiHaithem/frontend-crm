import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const DetailsFacture = () => {
  const { id } = useParams();
  const [factDetails, setFactDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/facture/${id}`);
        console.log("Données reçues:", response.data);
        setFactDetails(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération:", err);
        setError("Impossible de charger les détails de la facture");
      } finally {
        setLoading(false);
      }
    };

    fetchFactureDetails();
  }, [id]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Erreur de formatage:", e);
      return 'Format de date invalide';
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!factDetails) return <div>Aucune donnée disponible</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Détails de la Facture
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          <strong>Numéro Facture:</strong> {factDetails?.numFacture || 'Non spécifié'}
        </Typography>
        <Typography variant="body1">
          <strong>Date Facturation:</strong> {formatDate(factDetails?.date)}
        </Typography>
        <Typography variant="body1">
          <strong>Client:</strong> {factDetails?.client?.nom_prenom || 'Non spécifié'}
        </Typography>
        <Typography variant="body1">
          <strong>Total HT:</strong> {factDetails?.totalHT?.toFixed(2)} €
        </Typography>
        <Typography variant="body1">
          <strong>Total TTC:</strong> {factDetails?.totalTTC?.toFixed(2)} €
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="lignes de facture">
          <TableHead>
            <TableRow>
              <TableCell>Article</TableCell>
              <TableCell align="right">Quantité</TableCell>
              <TableCell align="right">Prix unitaire</TableCell>
              <TableCell align="right">Remise</TableCell>
              <TableCell align="right">TVA</TableCell>
              <TableCell align="right">Total HT</TableCell>
              <TableCell align="right">Total TTC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {factDetails.lignes?.map((ligne, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {ligne.libelleArticle || 'N/A'}
                </TableCell>
                <TableCell align="right">{ligne.quantite || 0}</TableCell>
                <TableCell align="right">{ligne.prixUnitaire?.toFixed(2)} €</TableCell>
                <TableCell align="right">{ligne.remise?.toFixed(2)} %</TableCell>
                <TableCell align="right">{ligne.tva?.toFixed(2)} %</TableCell>
                <TableCell align="right">{ligne.totalHT?.toFixed(2)} €</TableCell>
                <TableCell align="right">{ligne.totalTTC?.toFixed(2)} €</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailsFacture;