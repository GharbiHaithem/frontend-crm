import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const clientOptions = ['Client A', 'Client B', 'Client C'];

const validationSchema = Yup.object({
  nom_caisse: Yup.string()
    .required('Le nom caisse est obligatoire')
    .min(3, 'Trop court (minimum 3 caractères)'),
  fond_caisse: Yup.number()
    .required('Le fond_caisse est obligatoire')
    .min(5, 'Le montant doit être supérieur ou égal à 5'),

});

const CaisseForm = ({client,setCaisse}) => {
 
 
  const { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      client:client ,
      nom_caisse: '',
      fond_caisse: 0,

    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Exemple d'envoi des données
        console.log('Formulaire soumis:', values);
    axios.post('http://localhost:5000/caisse/' , values).then((result)=>{
   Swal.fire(result?.data?.nom_caisse, "Le caisse a été creer.", "success");

    }).then((resu)=> {axios.get('http://localhost:5000/caisse/').then((x)=>setCaisse(x.data))
      formik.resetForm()
    })
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire', error);
      }
    },
  });

const getFieldComponent = (key) => {
  if (key === 'client') return null; // 👈 Ne pas afficher ce champ

  const isNumber = key === 'fond_caisse';

  const commonProps = {
    label: key.replace('_', ' ').toUpperCase(),
    name: key,
    value: formik.values[key],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[key] && Boolean(formik.errors[key]),
    helperText: formik.touched[key] && formik.errors[key],
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    type: isNumber ? 'number' : 'text',
    sx: {
      '& .MuiInputBase-root': {
        height: '40px',
      },
      '& .MuiFormHelperText-root': {
        marginTop: 0.5,
        lineHeight: 1.2,
      },
    },
  };

  return <TextField {...commonProps} />;
};


  return (
    <Container className='border' component="main" maxWidth="lg">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}
      >
    

        <Grid container spacing={1}>
          {Object.keys(formik.values).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              {getFieldComponent(key)}
            </Grid>
          ))}
        </Grid>

        <Button
        disabled={formik.errors.fond_caisse || formik.errors.nom_caisse }
         data-bs-dismiss="modal"
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3, height: '40px' }}
        >
          {id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
    </Container>
  );
};

export default CaisseForm;
