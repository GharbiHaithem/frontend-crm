import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, Grid, Select, MenuItem } from '@mui/material';

const validationSchema = Yup.object().shape({
  nom_prenom: Yup.string()
    .required('Le nom et prénom sont obligatoires')
    .min(3, 'Trop court (minimum 3 caractères)'),
  telephone: Yup.string()
    .required('Le téléphone est obligatoire')
    .matches(/^[0-9]+$/, 'Doit contenir uniquement des chiffres')
    .min(8, 'Trop court (minimum 8 chiffres)'),
  code: Yup.string()
    .required('Le code est obligatoire'),
  raison_social: Yup.string()
    .required('La raison sociale est obligatoire'),
    adresse: Yup.string()
    .required("L'adresse' est obligatoire"),
    rapeBl: Yup.string()
    .required('rapeBl est obligatoire'),
    transporteur: Yup.string()
    .required('transporteur est obligatoire'),
    matricule_fiscale: Yup.string()
    .required('matricule_fiscale est obligatoire'),
    register_commerce: Yup.string()
    .required('register_commerce est obligatoire'),
});

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nom_prenom: '',
      telephone: '',
      code: '',
      raison_social: '',
      matricule_fiscale: '',
      adresse: '',
      register_commerce: '',
      solde_initial: 0,
      rapeBl: '',
      solde_initiale_bl: 0,
      taux_retenu: 0,
      transporteur: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await axios.put(`http://localhost:5000/clients/${id}`, values);
        } else {
          await axios.post('http://localhost:5000/clients', values);
        }
        navigate('/clients');
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire', error);
      }
    }
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/clients/${id}`)
        .then((response) => {
          formik.setValues(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du client', error);
        });
    }
  }, [id]);

  return (
    <Container component="main" maxWidth="md">
      <Box 
        component="form" 
        onSubmit={formik.handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}
      >
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          {id ? 'Modifier' : 'Ajouter'} un client
        </Typography>
        
        <Select
  fullWidth
  name="transporteur"
  value={formik.values.transporteur || ''} // Valeur par défaut vide
  onChange={formik.handleChange}
  sx={{ marginBottom: 3 }}
  displayEmpty // Affiche le MenuItem vide même quand la valeur est vide
>
  <MenuItem value="" disabled>
    Sélectionnez un transporteur
  </MenuItem>
  <MenuItem value="FedEx">FedEx</MenuItem>
  <MenuItem value="DHL">DHL</MenuItem>
  <MenuItem value="UPS">UPS</MenuItem>
</Select>

        <Typography variant="h6" sx={{ marginBottom: 2 }}>Informations sur l'adresse</Typography>
        
        <Grid container spacing={2}>
          {Object.keys(formik.values).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key.replace('_', ' ')}
                name={key}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formik.values[key]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched[key] && Boolean(formik.errors[key])}
                helperText={formik.touched[key] && formik.errors[key]}
               size='small'
                type={['solde_initial', 'solde_initiale_bl', 'taux_retenu'].includes(key) ? 'number' : 'text'}
              />
            </Grid>
          ))}
        </Grid>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ marginTop: 3 }}
        >
          {id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
    </Container>
  );
};

export default ClientForm;