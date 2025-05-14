import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaidIcon from '@mui/icons-material/Paid';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';

const DetailsFacture = () => {
  const { id } = useParams();
  const [factDetails, setFactDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/facture/${id}`);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'unpaid': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!factDetails) return <Typography>Aucune donnée disponible</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems:'center' ,gap:'10px', mb: 4 }}>
        <Typography variant="h5" gutterBottom  >
          <ReceiptIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Facture {factDetails.numFacture}
        </Typography>
        <Chip
          label={factDetails.status === 'paid' ? 'Payée' : 'Impayée'}
          color={getStatusColor(factDetails.status)}
          variant="outlined"
        />
      </Box>

      <Grid container spacing={4}>
        {/* Section Informations Facture */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1 }} />
              Informations Facture
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <EventIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Date :</strong> {formatDate(factDetails.date)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <LocalAtmIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Total HT :</strong> {factDetails.totalHT?.toFixed(2)} €
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PaidIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Total TTC :</strong> {factDetails.totalTTC?.toFixed(2)} €
              </Typography>
            </Box>
            
            <Typography sx={{ mt: 2 }}>
              <strong>Point de vente :</strong> {factDetails.pointVente || 'Non spécifié'}
            </Typography>
            
            <Typography>
              <strong>Référence commande :</strong> {factDetails.referenceCommande || 'Non spécifié'}
            </Typography>
            
            <Typography sx={{ mt: 2 }}>
              <strong>Commentaire :</strong> {factDetails.commentaire || 'Aucun commentaire'}
            </Typography>
          </Paper>
        </Grid>

        {/* Section Client */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} />
              Client
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <BusinessIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Nom :</strong> {factDetails.client?.nom_prenom || 'Non spécifié'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <HomeIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Adresse :</strong> {factDetails.client?.adresse || 'Non spécifié'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PhoneIcon color="action" sx={{ mr: 1 }} />
              <Typography>
                <strong>Téléphone :</strong> {factDetails.client?.telephone || 'Non spécifié'}
              </Typography>
            </Box>
            
            <Typography>
              <strong>Matricule fiscale :</strong> {factDetails.client?.matricule_fiscale || 'Non spécifié'}
            </Typography>
            
            <Typography>
              <strong>Raison sociale :</strong> {factDetails.client?.raison_social || 'Non spécifié'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section Lignes de facture */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Articles
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Prix HT</TableCell>
                <TableCell align="right">Remise</TableCell>
                <TableCell align="right">TVA</TableCell>
                <TableCell align="right">Total HT</TableCell>
                <TableCell align="right">Total TTC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {factDetails.lignes?.map((ligne, index) => (
                <TableRow key={index}>
                  <TableCell>{ligne.libelleArticle || 'N/A'}</TableCell>
                  <TableCell align="right">{ligne.quantite || 0}</TableCell>
                  <TableCell align="right">{ligne.prixHT?.toFixed(2)} €</TableCell>
                  <TableCell align="right">{ligne.remise?.toFixed(2)} %</TableCell>
                  <TableCell align="right">{ligne.tva?.toFixed(2)} %</TableCell>
                  <TableCell align="right">
                    {(ligne.quantite * ligne.prixHT).toFixed(2)} €
                  </TableCell>
                  <TableCell align="right">{ligne.prixTTC?.toFixed(2)} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DetailsFacture;