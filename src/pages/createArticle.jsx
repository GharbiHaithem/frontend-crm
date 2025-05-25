import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
  FormHelperText,
  Typography,
  Paper,
} from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
  libelle: Yup.string().required("Ce champ est requis"),

  libeleCategorie: Yup.string().required("Ce champ est requis"),
  Nombre_unite: Yup.number().required("Ce champ est requis").positive(),
  tva: Yup.number().required("Ce champ est requis"),
  type: Yup.string().required("Ce champ est requis"),
  prix_brut: Yup.number().required("Ce champ est requis").positive(),
  remise: Yup.number().required("Ce champ est requis"),
  prix_net: Yup.number().required("Ce champ est requis").positive(),
  marge: Yup.number().required("Ce champ est requis"),
  prixht: Yup.number().required("Ce champ est requis").positive(),
  prix_totale_concré: Yup.number().required("Ce champ est requis").positive(),
  
  configuration: Yup.string().required("Ce champ est requis"),

  Nature: Yup.string().required("Ce champ est requis"),
  prixmin: Yup.number().required("Ce champ est requis"),
  prixmax: Yup.number().required("Ce champ est requis"),
  tva_achat: Yup.number().required("Ce champ est requis"),
  movement_article: Yup.string().required("Ce champ est requis"),
  prix_achat_initiale: Yup.number(),

});

export default function CreateArticle() {
  const navigate = useNavigate();
  const [familles, setFamilles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const {id} = useParams()
  const[article,setArticle]  = useState({})
  useEffect(()=>{
    if (id) {
    axios.get(`http://localhost:5000/articles/${id}`)
      .then((response) => {
        const articleData = response.data;
        setArticle(articleData);
        
      
      });
  }
 },[id])
  console.log(article)
  const formik = useFormik({
    initialValues: {
      libelle:id ? article.libelle : "",
  
      libeleCategorie:id ? article.libeleCategorie?._id :"",
      Nombre_unite:id ? article.Nombre_unite : 0,
      tva: id ? article.tva : 0,
      type:id ? article.type : "",
      prix_brut:id ? article.prix_brut : 0,
      remise:id ? article.remise :  0,
      prix_net:id ? article.prix_net : 0,
      marge:id ? article.marge : 0,
      prixht:id ? article.prixht : 0,
      prix_totale_concré:id ? article.prix_totale_concré : 0,
      gestion_configuration:id ? article.gestion_configuration : "",
      configuration:id ? article.configuration : "",
      serie: false,
      series: [],
      lib_fournisseur: id ? article.lib_fournisseur :"",
      Nature:  id ? article.Nature :"",
      image_article:id ? article.image_article : null,
      prixmin:id ? article.prixmin :  0,
      prixmax:id ? article.prixmax : 0,
      user_Connectée:id ? article.user_Connectée : "",
      action_user_connecté:id ? article.action_user_connecté :  "",
      date_modif: new Date().toISOString().split("T")[0],
      prix_achat_initiale:id ? article.prix_achat_initiale : 0,
      tva_achat:id ? article.tva_achat :  0,
      dimension_article: false,
      longueur: id ? article.longueur :0,
      largeur:id ? article.largeur : 0,
      hauteur: id ? article.hauteur :0,
      movement_article:id ? article.movement_article : "",
    },
    validationSchema,
    enableReinitialize:true,
  // Modifiez la soumission du formulaire
onSubmit: async (values) => {
  try {
   
    const formData = new FormData();
    
    // Ajout de tous les champs au FormData
    Object.keys(values).forEach((key) => {
      if (key === "image_article" && values[key]) {
        formData.append(key, values[key]);
      } else if (values[key] !== null && values[key] !== undefined) {
        // Convertir les valeurs en string pour FormData
        formData.append(key, String(values[key]));
      }
    });
   console.log(formData)
    if (!id) {
      const response = await axios.post("http://localhost:5000/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Article créé avec succès !");
      navigate("/Articles");
    } else {
      // Ajoutez un log pour vérifier les données envoyées
      console.log("Données envoyées:", {
     
        libeleCategorie: values.libeleCategorie
      });

      await axios.put(`http://localhost:5000/articles/${id}`,  values);
      alert("Article édité avec succès !");
      navigate("/Articles");
    }
  } catch (error) {
    console.error("Erreur:", error.response?.data || error.message);
    alert("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
  }
},
    
  })
  console.log("Erreurs de validation:", formik.errors); // Affiche toutes les erreurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ categoriesRes] = await Promise.all([
          
          axios.get("http://localhost:5000/categorie"),
        ]);
     
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    }
    fetchData();
    
  }, [id]);
 useEffect(()=>{
    if (id) {
    axios.get(`http://localhost:5000/articles/${id}`)
      .then((response) => {
        const articleData = response.data;
        setArticle(articleData);
        
      
      });
  }
 },[id])
  const handleFileChange = (event) => {
    formik.setFieldValue("image_article", event.currentTarget.files[0]);
  };

  return (
  <>
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {id ? 'Éditer un Article' : 'Créer un Article'}
            </Typography>
            
            <form onSubmit={formik.handleSubmit}>
              {/* Réduire l'espacement entre les lignes à 2 */}
              <Grid container spacing={2}>
                
                {/* Section Informations de base */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
                    Informations de base
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="libelle"
                    label="Libellé*"
                    fullWidth
                    size="small"
                    value={formik.values.libelle}
                    onChange={formik.handleChange}
                    error={formik.touched.libelle && Boolean(formik.errors.libelle)}
                    helperText={formik.touched.libelle && formik.errors.libelle}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="Nature"
                    label="Nature*"
                    fullWidth
                    size="small"
                    value={formik.values.Nature}
                    onChange={formik.handleChange}
                    error={formik.touched.Nature && Boolean(formik.errors.Nature)}
                    helperText={formik.touched.Nature && formik.errors.Nature}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="type"
                    label="Type*"
                    fullWidth
                    size="small"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                  />
                </Grid>
                
                {/* Section Catégorisation */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Catégorisation
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="libelleFamille"
                    label="Famille*"
                    fullWidth
                    size="small"
                    select
                    value={formik.values.libelleFamille}
                    onChange={formik.handleChange}
                    error={formik.touched.libelleFamille && Boolean(formik.errors.libelleFamille)}
                    helperText={formik.touched.libelleFamille && formik.errors.libelleFamille}
                  >
                    <MenuItem value="">Sélectionnez une famille</MenuItem>
                    {familles.map((famille) => (
                      <MenuItem key={famille._id} value={famille._id}>
                        {famille.designationFamille}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="libeleCategorie"
                    label="Catégorie*"
                    fullWidth
                    size="small"
                    select
                    value={formik.values.libeleCategorie}
                    onChange={formik.handleChange}
                    error={formik.touched.libeleCategorie && Boolean(formik.errors.libeleCategorie)}
                    helperText={formik.touched.libeleCategorie && formik.errors.libeleCategorie}
                  >
                    <MenuItem value="">Sélectionnez une catégorie</MenuItem>
                    {categories.map((categorie) => (
                      <MenuItem key={categorie._id} value={categorie._id}>
                        {categorie.designationCategorie}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                {/* Section Prix */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Tarification
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    name="prix_brut"
                    label="Prix Brut*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.prix_brut}
                    onChange={formik.handleChange}
                    error={formik.touched.prix_brut && Boolean(formik.errors.prix_brut)}
                    helperText={formik.touched.prix_brut && formik.errors.prix_brut}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    name="remise"
                    label="Remise %*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.remise}
                    onChange={formik.handleChange}
                    error={formik.touched.remise && Boolean(formik.errors.remise)}
                    helperText={formik.touched.remise && formik.errors.remise}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    name="prix_net"
                    label="Prix NET*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.prix_net}
                    onChange={formik.handleChange}
                    error={formik.touched.prix_net && Boolean(formik.errors.prix_net)}
                    helperText={formik.touched.prix_net && formik.errors.prix_net}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <TextField
                    name="marge"
                    label="Marge*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.marge}
                    onChange={formik.handleChange}
                    error={formik.touched.marge && Boolean(formik.errors.marge)}
                    helperText={formik.touched.marge && formik.errors.marge}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="prixht"
                    label="Prix HT*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.prixht}
                    onChange={formik.handleChange}
                    error={formik.touched.prixht && Boolean(formik.errors.prixht)}
                    helperText={formik.touched.prixht && formik.errors.prixht}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="tva"
                    label="TVA %*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.tva}
                    onChange={formik.handleChange}
                    error={formik.touched.tva && Boolean(formik.errors.tva)}
                    helperText={formik.touched.tva && formik.errors.tva}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="prix_totale_concré"
                    label="Prix Total*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.prix_totale_concré}
                    onChange={formik.handleChange}
                    error={formik.touched.prix_totale_concré && Boolean(formik.errors.prix_totale_concré)}
                    helperText={formik.touched.prix_totale_concré && formik.errors.prix_totale_concré}
                  />
                </Grid>
                
                {/* Section Fournisseur et Stock */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Fournisseur et Stock
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="lib_fournisseur"
                    label="Fournisseur"
                    fullWidth
                    size="small"
                    select
                    value={formik.values.lib_fournisseur}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="">Aucun fournisseur</MenuItem>
                    {fournisseurs.map((fournisseur) => (
                      <MenuItem key={fournisseur._id} value={fournisseur._id}>
                        {fournisseur.raison_sociale}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="Nombre_unite"
                    label="Nombre d'unités*"
                    fullWidth
                    size="small"
                    type="number"
                    value={formik.values.Nombre_unite}
                    onChange={formik.handleChange}
                    error={formik.touched.Nombre_unite && Boolean(formik.errors.Nombre_unite)}
                    helperText={formik.touched.Nombre_unite && formik.errors.Nombre_unite}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    name="movement_article"
                    label="Mouvement*"
                    fullWidth
                    size="small"
                    value={formik.values.movement_article}
                    onChange={formik.handleChange}
                    error={formik.touched.movement_article && Boolean(formik.errors.movement_article)}
                    helperText={formik.touched.movement_article && formik.errors.movement_article}
                  />
                </Grid>
                
                {/* Section Options */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Options
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="serie"
                        checked={formik.values.serie}
                        onChange={formik.handleChange}
                        size="small"
                      />
                    }
                    label="Gestion par série"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="dimension_article"
                        checked={formik.values.dimension_article}
                        onChange={formik.handleChange}
                        size="small"
                      />
                    }
                    label="Avec dimensions"
                  />
                </Grid>
                
                {/* Dimensions conditionnelles */}
                {formik.values.dimension_article && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="longueur"
                        label="Longueur"
                        fullWidth
                        size="small"
                        type="number"
                        value={formik.values.longueur}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="largeur"
                        label="Largeur"
                        fullWidth
                        size="small"
                        type="number"
                        value={formik.values.largeur}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="hauteur"
                        label="Hauteur"
                        fullWidth
                        size="small"
                        type="number"
                        value={formik.values.hauteur}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </>
                )}
                
                {/* Section Configuration et Image */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                    Configuration
                  </Typography>
                </Grid>
                
               <Grid item xs={4}>
                <TextareaAutosize
                  name="configuration"
                  placeholder="Configuration"
                  minRows={5}
                  style={{ width: "100%" }}
                  value={formik.values.configuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                    size="small"
                    className="border border-x-gray-200 px-5 py-5"
                />
                {formik.touched.configuration && formik.errors.configuration && (
                  <FormHelperText error>{formik.errors.configuration}</FormHelperText>
                )}
              </Grid>
                
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    Choisir une image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formik.values.image_article && !id && (
                    <img
                      src={
                        typeof formik.values.image_article === "string"
                          ? formik.values.image_article
                          : URL.createObjectURL(formik.values.image_article)
                      }
                      alt="Aperçu"
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </Grid>
                
                {/* Bouton de soumission */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="medium"
                    >
                      {id ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Box>
    </>
  );
}







  