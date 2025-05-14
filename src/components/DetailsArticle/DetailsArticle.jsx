import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Buffer } from 'buffer';

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
const navigate=useNavigate()
 const [imageUrl, setImageUrl] = useState(null);
  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    // Si l'image est déjà en base64
    if (typeof imageData === 'string') {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    // Si l'image est un Buffer ou ArrayBuffer
    if (imageData.data && Array.isArray(imageData.data)) {
      try {
        const uint8Array = new Uint8Array(imageData.data);
        const blob = new Blob([uint8Array], { type: imageData.contentType || 'image/jpeg' });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error("Erreur de conversion de l'image:", err);
        return null;
      }
    }
    
    return null;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();

    // Nettoyage
    return () => {
      // Si vous utilisez URL.createObjectURL(), vous devriez révoquer les URLs ici
    };
  }, [id]);
  const handleImageClick = () => {
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Erreur: {error}</Typography>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Article non trouvé</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={()=>navigate('/articles')}
     
        sx={{ mb: 2 }}
      >
        Retour à la liste
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {article.libelle}
              </Typography>
              
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Code: {article.code}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={article.type} 
                  color="primary" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  label={article.Nature} 
                  color="secondary" 
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Famille:</Typography>
                  <Typography>{article.libelleFamille?.name || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Catégorie:</Typography>
                  <Typography>{article.libeleCategorie?.name || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Nombre d'unités:</Typography>
                  <Typography>{article.Nombre_unite || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">TVA:</Typography>
                  <Typography>{article.tva ? `${article.tva}%` : 'Non spécifié'}</Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                <Typography variant="h6" gutterBottom>
                  Informations financières
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prix brut:</Typography>
                    <Typography>{article.prix_brut?.toFixed(2) || '0.00'} €</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Remise:</Typography>
                    <Typography>{article.remise ? `${article.remise}%` : '0%'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prix net:</Typography>
                    <Typography>{article.prix_net?.toFixed(2) || '0.00'} €</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prix HT:</Typography>
                    <Typography>{article.prixht?.toFixed(2) || '0.00'} €</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Prix total:</Typography>
                    <Typography>{article.prix_totale_concré?.toFixed(2) || '0.00'} €</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Marge:</Typography>
                    <Typography>{article.marge || 'Non spécifié'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {article?.image_article && (
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Image de l'article
          </Typography>
          <Box 
            component="img"
            src={getImageUrl(article.image_article)}
            alt={article.libelle}
            sx={{ 
              maxHeight: 200, 
              cursor: 'pointer',
              border: '1px solid #ddd',
              borderRadius: 1
            }}
            onClick={handleImageClick}
            onError={(e) => {
              e.target.style.display = 'none'; // Cache l'image si elle ne peut pas être chargée
            }}
          />
        </Grid>
      )}
      
      {!article?.image_article && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Aucune image disponible pour cet article
          </Typography>
        </Grid>
      )}
            
            {article.dimension_article && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Dimensions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Longueur:</Typography>
                    <Typography>{article.longueur} cm</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Largeur:</Typography>
                    <Typography>{article.largeur} cm</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Hauteur:</Typography>
                    <Typography>{article.hauteur} cm</Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Autres informations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2">Gestion configuration:</Typography>
                  <Typography>{article.gestion_configuration || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2">Configuration:</Typography>
                  <Typography>{article.configuration || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2">Série:</Typography>
                  <Typography>{article.serie ? 'Oui' : 'Non'}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2">Mouvement article:</Typography>
                  <Typography>{article.movement_article || 'Non spécifié'}</Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">Dernière modification:</Typography>
              <Typography>
                {new Date(article.date_modif).toLocaleString()} par {article.user_Connectée}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Action:
              </Typography>
              <Typography>{article.action_user_connecté}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} maxWidth="md">
        <DialogTitle>Image de l'article: {article.libelle}</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={`data:image/jpeg;base64,${Buffer.from(article.image_article).toString('base64')}`}
            alt={article.libelle}
            sx={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleDetails;