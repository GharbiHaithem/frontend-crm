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
} from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  libelle: Yup.string().required("Ce champ est requis"),
  libelleFamille: Yup.string().required("Ce champ est requis"),
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
  gestion_configuration: Yup.string().required("Ce champ est requis"),
  configuration: Yup.string().required("Ce champ est requis"),

  Nature: Yup.string().required("Ce champ est requis"),
  prixmin: Yup.number().required("Ce champ est requis"),
  prixmax: Yup.number().required("Ce champ est requis"),
  tva_achat: Yup.number().required("Ce champ est requis"),
  movement_article: Yup.string().required("Ce champ est requis"),
  prix_achat_initiale: Yup.number(),
  longueur: Yup.number().when("dimension_article", {
    is: true,
    then: Yup.number().required("Ce champ est requis").positive(),
  }),
  largeur: Yup.number().when("dimension_article", {
    is: true,
    then: Yup.number().required("Ce champ est requis").positive(),
  }),
  hauteur: Yup.number().when("dimension_article", {
    is: true,
    then: Yup.number().required("Ce champ est requis").positive(),
  }),
});

export default function CreateArticle() {
  const navigate = useNavigate();
  const [familles, setFamilles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  const formik = useFormik({
    initialValues: {
      libelle: "",
      libelleFamille: "",
      libeleCategorie: "",
      Nombre_unite: 0,
      tva: 0,
      type: "",
      prix_brut: 0,
      remise: 0,
      prix_net: 0,
      marge: 0,
      prixht: 0,
      prix_totale_concré: 0,
      gestion_configuration: "",
      configuration: "",
      serie: false,
      series: [],
      lib_fournisseur: "",
      Nature: "",
      image_article: null,
      prixmin: 0,
      prixmax: 0,
      user_Connectée: "",
      action_user_connecté: "",
      date_modif: new Date().toISOString().split("T")[0],
      prix_achat_initiale: 0,
      tva_achat: 0,
      dimension_article: false,
      longueur: "",
      largeur: "",
      hauteur: "",
      movement_article: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        
        // Ajout de tous les champs au FormData
        Object.keys(values).forEach((key) => {
          if (key === "image_article" && values[key]) {
            formData.append(key, values[key]);
          } else if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        });

        const response = await axios.post("http://localhost:5000/articles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Article créé avec succès !");
        navigate("/Articles");
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
        alert("Erreur lors de la création: " + (error.response?.data?.message || error.message));
      }
    },
    
  });
  console.log("Erreurs de validation:", formik.errors); // Affiche toutes les erreurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [famillesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/famille"),
          axios.get("http://localhost:5000/categorie"),
        ]);
        setFamilles(famillesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    formik.setFieldValue("image_article", event.currentTarget.files[0]);
  };

  return (
    <>
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ 
            position: "sticky", 
            top: 0, 
            zIndex: 2, 
            bgcolor: "#fff", 
            pb: "10px", 
            borderBottom: "1px solid #ddd" 
          }}>
            <h2 className="px-3 py-3 text-2xl font-semibold">Créer un Article</h2>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
              
              {/* Libelle Article */}
              <Grid item xs={4}>
                <TextField
                  name="libelle"
                  label="Libellé"
                  fullWidth
                  margin="normal"
                  value={formik.values.libelle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.libelle && Boolean(formik.errors.libelle)}
                  helperText={formik.touched.libelle && formik.errors.libelle}
                  size="small"
                />
              </Grid>
              
              {/* Nature */}
              <Grid item xs={4}>
                <TextField
                  name="Nature"
                  label="Nature"
                  fullWidth
                  margin="normal"
                  value={formik.values.Nature}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Nature && Boolean(formik.errors.Nature)}
                  helperText={formik.touched.Nature && formik.errors.Nature}
                    size="small"
                />
              </Grid>
              
              {/* Type */}
              <Grid item xs={4}>
                <TextField
                  name="type"
                  label="Type"
                  fullWidth
                  margin="normal"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                    size="small"
                />
              </Grid>
              
              {/* prix_brut */}
              <Grid item xs={4}>
                <TextField
                  name="prix_brut"
                  label="Prix Brut"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prix_brut}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prix_brut && Boolean(formik.errors.prix_brut)}
                  helperText={formik.touched.prix_brut && formik.errors.prix_brut}
                    size="small"
                />
              </Grid>
              
              {/* remise */}
              <Grid item xs={4}>
                <TextField
                  name="remise"
                  label="Remise %"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.remise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.remise && Boolean(formik.errors.remise)}
                  helperText={formik.touched.remise && formik.errors.remise}
                    size="small"
                />
              </Grid>
              
              {/* prix_net */}
              <Grid item xs={4}>
                <TextField
                  name="prix_net"
                  label="Prix NET"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prix_net}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prix_net && Boolean(formik.errors.prix_net)}
                  helperText={formik.touched.prix_net && formik.errors.prix_net}
                    size="small"
                />
              </Grid>
              
              {/* marge */}
              <Grid item xs={4}>
                <TextField
                  name="marge"
                  label="Marge"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.marge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.marge && Boolean(formik.errors.marge)}
                  helperText={formik.touched.marge && formik.errors.marge}
                    size="small"
                />
              </Grid>
              
              {/* prixht */}
              <Grid item xs={4}>
                <TextField
                  name="prixht"
                  label="Prix ht"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prixht}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prixht && Boolean(formik.errors.prixht)}
                  helperText={formik.touched.prixht && formik.errors.prixht}
                    size="small"
                />
              </Grid>
              
              {/* prix_totale_concré */}
              <Grid item xs={4}>
                <TextField
                  name="prix_totale_concré"
                  label="Prix Totale Concré"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prix_totale_concré}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prix_totale_concré && Boolean(formik.errors.prix_totale_concré)}
                  helperText={formik.touched.prix_totale_concré && formik.errors.prix_totale_concré}
                    size="small"
                />
              </Grid>
              
              {/* gestion_configuration */}
              <Grid item xs={4}>
                <TextField
                  name="gestion_configuration"
                  label="gestion_configuration"
                  fullWidth
                  margin="normal"
                  value={formik.values.gestion_configuration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gestion_configuration && Boolean(formik.errors.gestion_configuration)}
                  helperText={formik.touched.gestion_configuration && formik.errors.gestion_configuration}
                    size="small"
                />
              </Grid>
              
              {/* Famille dropdown */}
              <Grid item xs={4}>
                <TextField
                  name="libelleFamille"
                  label="Famille de l'article"
                  fullWidth
                  margin="normal"
                  value={formik.values.libelleFamille}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.libelleFamille && Boolean(formik.errors.libelleFamille)}
                  helperText={formik.touched.libelleFamille && formik.errors.libelleFamille}
                  select
                  SelectProps={{ displayEmpty: true }}
                    size="small"
                >
                  <MenuItem value="" disabled>Sélectionnez une famille</MenuItem>
                  {familles.map((famille) => (
                    <MenuItem key={famille._id} value={famille._id}>
                      {famille.designationFamille}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Catégorie dropdown */}
              <Grid item xs={4}>
                <TextField
                  name="libeleCategorie"
                  label="Catégorie de l'article"
                  fullWidth
                  margin="normal"
                  value={formik.values.libeleCategorie}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.libeleCategorie && Boolean(formik.errors.libeleCategorie)}
                  helperText={formik.touched.libeleCategorie && formik.errors.libeleCategorie}
                  select
                  SelectProps={{ displayEmpty: true }}
                    size="small"
                >
                  <MenuItem value="" disabled>Sélectionnez une catégorie</MenuItem>
                  {categories.map((categorie) => (
                    <MenuItem key={categorie._id} value={categorie._id}>
                      {categorie.designationCategorie}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Fournisseur dropdown */}
              <Grid item xs={4}>
                <TextField
                  name="lib_fournisseur"
                  label="Fournisseur"
                  fullWidth
                  margin="normal"
                  value={formik.values.lib_fournisseur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ displayEmpty: true }}
                    size="small"
                >
                  <MenuItem value="">Aucun fournisseur</MenuItem>
                  {fournisseurs.map((fournisseur) => (
                    <MenuItem key={fournisseur._id} value={fournisseur._id}>
                      {fournisseur.raison_sociale}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Nombre_unite */}
              <Grid item xs={4}>
                <TextField
                  name="Nombre_unite"
                  label="Nombre d'unités"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.Nombre_unite}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Nombre_unite && Boolean(formik.errors.Nombre_unite)}
                  helperText={formik.touched.Nombre_unite && formik.errors.Nombre_unite}
                    size="small"
                />
              </Grid>
              
              {/* prixmin */}
              <Grid item xs={4}>
                <TextField
                  name="prixmin"
                  label="Prix Min"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prixmin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prixmin && Boolean(formik.errors.prixmin)}
                  helperText={formik.touched.prixmin && formik.errors.prixmin}
                    size="small"
                />
              </Grid>
              
              {/* prixmax */}
              <Grid item xs={4}>
                <TextField
                  name="prixmax"
                  label="Prix Max"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.prixmax}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.prixmax && Boolean(formik.errors.prixmax)}
                  helperText={formik.touched.prixmax && formik.errors.prixmax}
                    size="small"
                />
              </Grid>
              
              {/* tva_achat */}
              <Grid item xs={4}>
                <TextField
                  name="tva_achat"
                  label="Tva Achat"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.tva_achat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tva_achat && Boolean(formik.errors.tva_achat)}
                  helperText={formik.touched.tva_achat && formik.errors.tva_achat}
                    size="small"
                />
              </Grid>
              
              {/* tva */}
              <Grid item xs={4}>
                <TextField
                  name="tva"
                  label="TVA"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={formik.values.tva}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tva && Boolean(formik.errors.tva)}
                  helperText={formik.touched.tva && formik.errors.tva}
                    size="small"
                />
              </Grid>
              
              {/* configuration */}
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
              
              {/* movement_article */}
              <Grid item xs={4}>
                <TextField
                  name="movement_article"
                  label="Movement Article"
                  fullWidth
                  margin="normal"
                  value={formik.values.movement_article}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.movement_article && Boolean(formik.errors.movement_article)}
                  helperText={formik.touched.movement_article && formik.errors.movement_article}
                    size="small"
                />
              </Grid>
              
              {/* Serie checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="serie"
                      checked={formik.values.serie}
                      onChange={formik.handleChange}
                        size="small"
                    />
                  }
                  label="Série"
                />
              </Grid>
              
              {/* Dimension checkbox */}
              <Grid item xs={12}>
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
              
              {/* Conditional dimension fields */}
              {formik.values.dimension_article && (
                <>
                  <Grid item xs={4}>
                    <TextField
                      name="longueur"
                      label="Longueur"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={formik.values.longueur}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.longueur && Boolean(formik.errors.longueur)}
                      helperText={formik.touched.longueur && formik.errors.longueur}
                        size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      name="largeur"
                      label="Largeur"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={formik.values.largeur}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.largeur && Boolean(formik.errors.largeur)}
                      helperText={formik.touched.largeur && formik.errors.largeur}
                        size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      name="hauteur"
                      label="Hauteur"
                      fullWidth
                      margin="normal"
                      type="number"
                      value={formik.values.hauteur}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.hauteur && Boolean(formik.errors.hauteur)}
                      helperText={formik.touched.hauteur && formik.errors.hauteur}
                        size="small"
                    />
                  </Grid>
                </>
              )}
              
              {/* Image upload */}
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  sx={{ textTransform: "none" }}
                >
                  Choisir une image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {formik.values.image_article && (
                  <Box mt={2}>
                    <img
                      src={
                        typeof formik.values.image_article === "string"
                          ? formik.values.image_article
                          : URL.createObjectURL(formik.values.image_article)
                      }
                      alt="Aperçu"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Grid>
              
              {/* Submit button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{ marginTop: "20px", float: "right" }}
                >
                  Créer
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
}