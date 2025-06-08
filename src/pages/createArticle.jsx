import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import { Typography } from "@mui/material";
import Swal from "sweetalert2";

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
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const [article, setArticle] = useState({});

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/articles/${id}`)
        .then((response) => {
          setArticle(response.data);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get("http://localhost:5000/categorie");
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    }
    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      libelle: id ? article.libelle : "",
      libeleCategorie: id ? article.libeleCategorie?._id : "",
      Nombre_unite: id ? article.Nombre_unite : 0,
      tva: id ? article.tva : 0,
      type: id ? article.type : "",
      prix_brut: id ? article.prix_brut : 0,
      remise: id ? article.remise : 0,
      prix_net: id ? article.prix_net : 0,
      marge: id ? article.marge : 0,
      prixht: id ? article.prixht : 0,
      prix_totale_concré: id ? article.prix_totale_concré : 0,
      gestion_configuration: id ? article.gestion_configuration : "",
      configuration: id ? article.configuration : "",
      serie: false,
      series: [],
      lib_fournisseur: id ? article.lib_fournisseur : "",
      Nature: id ? article.Nature : "",
      image_article: id ? article.image_article : null,
      prixmin: id ? article.prixmin : 0,
      prixmax: id ? article.prixmax : 0,
      user_Connectée: id ? article.user_Connectée : "",
      action_user_connecté: id ? article.action_user_connecté : "",
      date_modif: new Date().toISOString().split("T")[0],
      prix_achat_initiale: id ? article.prix_achat_initiale : 0,
      tva_achat: id ? article.tva_achat : 0,
      dimension_article: false,
      longueur: id ? article.longueur : 0,
      largeur: id ? article.largeur : 0,
      hauteur: id ? article.hauteur : 0,
      movement_article: id ? article.movement_article : "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "image_article" && values[key]) {
            formData.append(key, values[key]);
          } else if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, String(values[key]));
          }
        });

        if (!id) {
          await axios.post("http://localhost:5000/articles", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }).then(()=>Swal.fire("créé !", "Article créé avec succès"))
      
        } else {
          await axios.put(`http://localhost:5000/articles/${id}`, values).then((result)=> Swal.fire("Update !", "Article édité avec succès"))
        
        }
        navigate("/Articles");
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
        alert("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("image_article", event.currentTarget.files[0]);
  };
function bufferToBase64(buffer) {
  if (!buffer || !Array.isArray(buffer)) return '';
  const binary = buffer.reduce((data, byte) => data + String.fromCharCode(byte), '');
  return window.btoa(binary);
}


  return (
    <>
      <Navbar />
      <div className="h-[70px]" />
      <div className="flex">
        <Sidenav />
        <main className="flex-1 p-4">
          <div className="bg-white p-4 mb-4 rounded-lg shadow">
           <Typography
                     variant="h4"
                     style={{
                       fontWeight: "bold",
                       color: "#1976d2",
                       fontSize: "2rem",
                     }}
                   >
              {id ? 'Éditer un Article' : 'Créer un Article'}
            </Typography>
            
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Section Informations de base */}
               
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé*</label>
                  <input
                    name="libelle"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.libelle}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.libelle && formik.errors.libelle && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.libelle}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nature*</label>
                  <input
                    name="Nature"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.Nature}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.Nature && formik.errors.Nature && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Nature}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
                  <input
                    name="type"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.type && formik.errors.type && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
                  )}
                </div>
                
                {/* Section Catégorisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie*</label>
                  <select
                    name="libeleCategorie"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.libeleCategorie}
                    onChange={formik.handleChange}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((categorie) => (
                      <option key={categorie._id} value={categorie._id}>
                        {categorie.designationCategorie}
                      </option>
                    ))}
                  </select>
                  {formik.touched.libeleCategorie && formik.errors.libeleCategorie && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.libeleCategorie}</p>
                  )}
                </div>
                
                {/* Section Prix */}
                <div className="col-span-full">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Tarification</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Brut*</label>
                  <input
                    name="prix_brut"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.prix_brut}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.prix_brut && formik.errors.prix_brut && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.prix_brut}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remise %*</label>
                  <input
                    name="remise"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.remise}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.remise && formik.errors.remise && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.remise}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix NET*</label>
                  <input
                    name="prix_net"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.prix_net}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.prix_net && formik.errors.prix_net && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.prix_net}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marge*</label>
                  <input
                    name="marge"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.marge}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.marge && formik.errors.marge && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.marge}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT*</label>
                  <input
                    name="prixht"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.prixht}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.prixht && formik.errors.prixht && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.prixht}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TVA %*</label>
                  <input
                    name="tva"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.tva}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.tva && formik.errors.tva && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.tva}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Total*</label>
                  <input
                    name="prix_totale_concré"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.prix_totale_concré}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.prix_totale_concré && formik.errors.prix_totale_concré && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.prix_totale_concré}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'unités*</label>
                  <input
                    name="Nombre_unite"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.Nombre_unite}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.Nombre_unite && formik.errors.Nombre_unite && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Nombre_unite}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mouvement*</label>
                  <input
                    name="movement_article"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formik.values.movement_article}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.movement_article && formik.errors.movement_article && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.movement_article}</p>
                  )}
                </div>
                
                {/* Section Options */}
                <div className="col-span-full">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Options</h3>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="serie"
                    checked={formik.values.serie}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Gestion par série</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="dimension_article"
                    checked={formik.values.dimension_article}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Avec dimensions</label>
                </div>
                
                {/* Dimensions conditionnelles */}
                {formik.values.dimension_article && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longueur</label>
                      <input
                        name="longueur"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={formik.values.longueur}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Largeur</label>
                      <input
                        name="largeur"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={formik.values.largeur}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur</label>
                      <input
                        name="hauteur"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={formik.values.hauteur}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </>
                )}
                
                {/* Section Configuration et Image */}
                <div className="col-span-full">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Configuration</h3>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Configuration*</label>
                  <textarea
                    name="configuration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="5"
                    value={formik.values.configuration}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.configuration && formik.errors.configuration && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.configuration}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="mt-1 flex items-center">
                    <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                      Choisir une image
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {formik.values.image_article && !id && (
                    <img
                      src={
                        typeof formik.values.image_article === "string"
                          ? formik.values.image_article
                          : URL.createObjectURL(formik.values.image_article)
                      }
                      alt="Aperçu"
                      className="mt-2 w-full max-h-40 object-contain rounded"
                    />
                  )
}
                </div>
                
                {/* Bouton de soumission */}
                <div className="col-span-full flex justify-end mt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {id ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}