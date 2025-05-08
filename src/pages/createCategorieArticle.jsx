import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, Box, Typography, Stack } from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";

// Schéma de validation Yup
const validationSchema = Yup.object().shape({
  designationCategorie: Yup.string()
    .required("La désignation est obligatoire")
    .min(3, "La désignation doit contenir au moins 3 caractères")
    .max(50, "La désignation ne peut pas dépasser 50 caractères"),
});

export default function CreateCategorieArticle() {
  const formik = useFormik({
    initialValues: {
      designationCategorie: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("http://localhost:5000/categorie", values);
        alert("Catégorie d'article créée avec succès !");
        resetForm();
      } catch (error) {
        console.error(
          "Erreur lors de la création de la catégorie :",
          error.response ? error.response.data : error
        );
        alert(
          error.response?.data?.message ||
            "Une erreur s'est produite lors de la création."
        );
      }
    },
  });

  return (
    <>
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            maxHeight: "100vh",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "#fff",
              paddingBottom: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Créer une Catégorie d'Articles
            </Typography>
          </Box>

          <form className="flex items-center gap-10  w-full" onSubmit={formik.handleSubmit}>
        
<Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mt: 2, width: '80%' }}>
  <TextField
    name="designationCategorie"
    label="Désignation de la Catégorie"
    sx={{ 
      width: '80%', // Augmentez ce pourcentage selon vos besoins
      '& .MuiOutlinedInput-root': {
        height: '40px' // Ajuste la hauteur si nécessaire
      }
    }}
    value={formik.values.designationCategorie}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.designationCategorie && Boolean(formik.errors.designationCategorie)}
    helperText={formik.touched.designationCategorie && formik.errors.designationCategorie}
    size="small"
  />
  
  <Button
    type="submit"
    color="primary"
    variant="contained"
    disabled={formik.isSubmitting}
    sx={{ 
      height: '40px', 
      width: '20%', // Ajustez en fonction de la largeur du TextField
      minWidth: '100px' // Largeur minimale pour le texte du bouton
    }}
  >
    {formik.isSubmitting ? "Création..." : "Créer"}
  </Button>
</Stack>

          </form>
        </Box>
      </Box>
    </>
  );
}