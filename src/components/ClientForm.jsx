import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, Grid, Select, MenuItem, Autocomplete, InputAdornment } from '@mui/material';
import ReactCountryFlag from "react-country-flag";

const validationSchema = Yup.object().shape({
  nom_prenom: Yup.string()
    .required('Le nom et prénom sont obligatoires')
    .min(3, 'Trop court (minimum 3 caractères)'),
  telephone: Yup.string()
    .required('Le téléphone est obligatoire')
    .min(8, 'Trop court (minimum 8 chiffres)'),
  code: Yup.string()
    .required('Le code est obligatoire'),
  raison_social: Yup.string()
    .required('La raison sociale est obligatoire'),
  adresse: Yup.string()
    .required("L'adresse est obligatoire"),
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
const[erreurCode,setErreurCode]=useState(null)


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
          await axios.post('http://localhost:5000/clients', values)
          .then(()=>   navigate('/clients'))
          .catch((response)=>setErreurCode(response.response.data.message))
        }
     
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

  const countries = [
    { code: 'TN', label: 'Tunisie (+216)', prefix: '+216' },
    { code: 'FR', label: 'France (+33)', prefix: '+33' },
    { code: 'DZ', label: 'Algérie (+213)', prefix: '+213' },
    { code: 'MA', label: 'Maroc (+212)', prefix: '+212' },
    { code: 'EG', label: 'Egypte (+20)', prefix: '+20' },
  ];

  const [selectedCountry, setSelectedCountry] = useState({
    code: 'TN', 
    label: 'Tunisie (+216)', 
    prefix: '+216'
  });

  const handlePhoneChange = (e) => {
    const phoneWithoutPrefix = formik.values.telephone.replace(selectedCountry.prefix, '');
    const newPhoneValue = e.target.value ? `${selectedCountry.prefix}${e.target.value}` : '';
    formik.setFieldValue('telephone', newPhoneValue);
  };

  useEffect(() => {
    if (formik.values.telephone) {
      const phoneWithoutPrefix = formik.values.telephone.replace(/^\+\d+/, '');
      formik.setFieldValue('telephone', `${selectedCountry.prefix}${phoneWithoutPrefix}`);
    }
  }, [selectedCountry]);

  return (
    <Container component="main" maxWidth="md">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', marginTop: 4 }}
      >
        <Typography variant="h5" sx={{ marginBottom: 3 }}  style={{
                          fontWeight: "bold",
                          textAlign: "start",
                          color: "#1976d2",
                          fontSize: "1.8rem",
                          padding: "10px",
                          background:"white",
                          width:"100%"
                        }}>
          {id ? 'Modifier' : 'Ajouter'} un client
        </Typography>

       

        <Grid container spacing={2}>
          {Object.keys(formik.values)
            .filter(key => key !== '_id' && key !== '__v' && key !== 'telephone' && key !== 'transporteur')
            .map((key) => (
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
                  size="small"
                  type={['solde_initial', 'solde_initiale_bl', 'taux_retenu'].includes(key) ? 'number' : 'text'}
                  sx={{ 
                    '& .MuiInputBase-root': {
                      height: '40px',
                    },
                    '& .MuiFormHelperText-root': {
                      marginTop: 0.5,
                      lineHeight: 1.2
                    }
                  }}
                />
                {erreurCode && key === 'code' && (
          <span className="text-red-500 text-xs font-light">{erreurCode}</span>
        )}
              </Grid>
            ))}
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="telephone"
              label="Téléphone"
              variant="outlined"
              margin="normal"
              value={formik.values.telephone.replace(selectedCountry.prefix, '')}
              onChange={handlePhoneChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telephone && Boolean(formik.errors.telephone)}
              helperText={formik.touched.telephone && formik.errors.telephone}
              size="small"
              sx={{ 
                '& .MuiInputBase-root': {
                  height: '40px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Autocomplete
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      value={selectedCountry}
                      onChange={(_, newValue) => setSelectedCountry(newValue || countries[0])}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <ReactCountryFlag 
                            countryCode={option.code} 
                            svg 
                            style={{ marginRight: 8, width: '1em', height: '1em' }} 
                          />
                          {option.label}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            style: { padding: 0 }
                          }}
                          sx={{ 
                            width: 120,
                            '& .MuiInputBase-root': {
                              height: '40px',
                              padding: 0
                            }
                          }}
                        />
                      )}
                      sx={{
                        width: 120,
                        '& .MuiInputBase-root': {
                          height: '40px',
                          padding: 0
                        }
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              name="transporteur"
              value={formik.values.transporteur || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.transporteur && Boolean(formik.errors.transporteur)}
              size="small"
              displayEmpty
              sx={{ 
                mt: 2,
                '& .MuiInputBase-root': {
                  height: '40px',
                }
              }}
            >
              <MenuItem value="" disabled>
                Sélectionnez un transporteur
              </MenuItem>
              <MenuItem value="FedEx">FedEx</MenuItem>
              <MenuItem value="DHL">DHL</MenuItem>
              <MenuItem value="UPS">UPS</MenuItem>
            </Select>
            {formik.touched.transporteur && formik.errors.transporteur && (
              <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                {formik.errors.transporteur}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3, height: '40px' }}
        >
          {id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
    </Container>
  );
};

export default ClientForm;