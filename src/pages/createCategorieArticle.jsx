import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, Box, Typography, Stack } from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { categorieService } from "../services/api";

// Schéma de validation Yup
const validationSchema = Yup.object().shape({
  designationCategorie: Yup.string()
    .required("La désignation est obligatoire")
    .min(3, "La désignation doit contenir au moins 3 caractères")
    .max(50, "La désignation ne peut pas dépasser 50 caractères"),

     codeCategorie: Yup.string()
    .required("La désignation est obligatoire")
    .min(3, "La désignation doit contenir au moins 3 caractères")
    .max(50, "La désignation ne peut pas dépasser 50 caractères"),
});

export default function CreateCategorieArticle() {
const{id} = useParams()
const navigate = useNavigate()
const[catArticle,setCatArticle] = useState({})
useEffect(()=>{
  if(id){
  categorieService.getById(id).then((response)=>setCatArticle(response.data))
  }
},[id])
  const formik = useFormik({
    initialValues: {
      designationCategorie:id ? catArticle?.designationCategorie : "",
     codeCategorie:id ? catArticle?.codeCategorie  :""
    },
    validationSchema,
    enableReinitialize:true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if(id){
          await categorieService.update(id,values).then(()=>{Swal.fire("Edité !", "Catégorie d'article Edité avec succès !")
            setTimeout(()=>{
              navigate('/categorieArticle')
            },1500)
          })
        }else{
  await axios.post("http://localhost:5000/categorie", values).then(()=>Swal.fire("créé !", "Catégorie d'article créée avec succès !"))
      
        resetForm();
        }
      
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
            <Typography variant="h5" gutterBottom style={{
                          fontWeight: "bold",
                          textAlign: "start",
                          color: "#1976d2",
                          fontSize: "1.8rem",
                          padding: "10px",
                          background:"white",
                          width:"50%"
                        }}>
              {id ? 'Editer' : 'Créer'} une Catégorie d'Article
            </Typography>
          </Box>

      <form className="flex items-center gap-10 w-full" onSubmit={formik.handleSubmit}>
  <div className="flex flex-col gap-4 w-4/5 mt-4">

    {/* Désignation */}
    <div className="w-full">
      <label htmlFor="designationCategorie" className="block font-semibold mb-1 text-gray-700">
        Désignation de la Catégorie
      </label>
      <input
        type="text"
        name="designationCategorie"
        id="designationCategorie"
        value={formik.values.designationCategorie}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-4 py-2 rounded-md shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white
          ${formik.touched.designationCategorie && formik.errors.designationCategorie ? "border-red-500" : "border-gray-300"}
        `}
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
      />
      {formik.touched.designationCategorie && formik.errors.designationCategorie && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.designationCategorie}</p>
      )}
    </div>

    {/* Code */}
    <div className="w-full">
      <label htmlFor="codeCategorie" className="block font-semibold mb-1 text-gray-700">
        Code de la Catégorie
      </label>
      <input
        type="text"
        name="codeCategorie"
        id="codeCategorie"
        value={formik.values.codeCategorie}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-4 py-2 rounded-md shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white
          ${formik.touched.codeCategorie && formik.errors.codeCategorie ? "border-red-500" : "border-gray-300"}
        `}
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
      />
      {formik.touched.codeCategorie && formik.errors.codeCategorie && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.codeCategorie}</p>
      )}
    </div>

    {/* Bouton */}
    <button
      type="submit"
      disabled={formik.isSubmitting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-200"
    >
      {id ? 'Editer' : formik.isSubmitting ? "Création..." : "Créer"}
    </button>
  </div>
</form>

        </Box>
      </Box>
    </>
  );
}