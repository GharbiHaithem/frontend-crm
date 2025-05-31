import React from "react";
import axios from "axios";
import { TextField, Button, Grid, Box } from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CreateFamilleArticle() {
  const navigate = useNavigate();

  // Schéma de validation Yup
  const validationSchema = Yup.object().shape({
    designationFamille: Yup.string()
      .required("La désignation est obligatoire")
      .min(3, "La désignation doit contenir au moins 3 caractères"),
    codeFamille: Yup.string()
      .required("Le code est obligatoire")
      .matches(/^[A-Za-z0-9]+$/, "Le code ne doit contenir que des lettres et chiffres")
  });

  // Configuration Formik
  const formik = useFormik({
    initialValues: {
      designationFamille: "",
      codeFamille: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
  
        await axios.post("http://localhost:5000/famille", values);
        alert("Famille Article créée avec succès !");
        formik.resetForm();
        navigate("/FamilleArticle");
      } catch (error) {
        console.error("Erreur lors de la création :", error.response?.data || error);
        alert(`Erreur: ${error.response?.data?.message || "Une erreur s'est produite"}`);
      }
    },
  });

  return (
    <>
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto", maxHeight: "100vh" }}>
          <Box sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#fff", paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
            <h2 style={{
                          fontWeight: "bold",
                          textAlign: "start",
                          color: "#1976d2",
                          fontSize: "1.8rem",
                          padding: "10px",
                          background:"white",
                          width:"100%"
                        }}>Créer une Famille des Articles</h2>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={10}>
                <TextField
                  name="designationFamille"
                  label="Designation de famille"
                  fullWidth
                  margin="normal"
                  value={formik.values.designationFamille}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.designationFamille && Boolean(formik.errors.designationFamille)}
                  helperText={formik.touched.designationFamille && formik.errors.designationFamille}
                  size="small"
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={4}>
              <Grid item xs={10}>
                <TextField
                  name="codeFamille"
                  label="Code de famille"
                  fullWidth
                  margin="normal"
                  value={formik.values.codeFamille}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.codeFamille && Boolean(formik.errors.codeFamille)}
                  helperText={formik.touched.codeFamille && formik.errors.codeFamille}
                  size="small"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginTop: "20px", float: "left" }}
              sx={{ padding: "10px 20px", fontSize: "16px" }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Création..." : "Créer"}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}