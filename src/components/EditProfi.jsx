import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';
import { MdOutlinePassword } from "react-icons/md";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
const EditProfi = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const[editPassword,setEditPassword]= useState(false)
    const[userName,setUserName]= useState(false)
  // Récupération du token
  const token = localStorage.getItem('token');
  const fetchProfile = async () => {
      try {
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/auth/profil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Profile data:', response.data);
        
        setInitialData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
  useEffect(() => {
  

    fetchProfile();
  }, []); // Ajoutez token comme dépendance

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone is required')
  });
const [messageErreur,setMessageErreur]=useState(null)
  const formik = useFormik({
    initialValues: initialData || {
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      currentPassword:''
    },
    enableReinitialize: true, // Important pour mettre à jour les valeurs initiales
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

const handleUpdate = async (values) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/auth/editProfil`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Mise à jour locale
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setInitialData(updatedUser); // ← ceci met à jour les champs du formulaire sans reload
    formik.setValues({
      ...formik.values,
      ...updatedUser,
      password: '',
      currentPassword: ''
    });

    // Optionnel : mettre à jour le nom affiché dans la navbar par exemple
    setUserName(updatedUser.name);

    Swal.fire({
      title: "Update successful!",
      text: response.data.message,
      icon: "success"
    });

  } catch (error) {
    setMessageErreur(error.response?.data?.message || "Erreur inconnue");
    console.error('Update error:', error);
  }
};


  if (loading) {
    return <Typography>Loading profile data...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
       <nav aria-label="breadcrumb">
          <ol class="breadcrumb   bg-white w-full p-3">
            <li class="breadcrumb-item"><Link to={"/"}>Home</Link></li>
         
            <li class="breadcrumb-item active" aria-current="page">Profile Info</li>
          </ol>
        </nav>
      <Typography variant="h5"  gutterBottom>
        Edit Profile
      </Typography>
      
      <form className='mt-5' onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Name Field */}
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="small"
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />

          {/* Email Field */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            size="small"
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />

        <div onClick={()=>setEditPassword(!editPassword)} style={{color:'#5CB4DA',fontWeight:200,cursor:'pointer'}} className='flex border rounded-sm p-2 items-center gap-1 text-secondary '>
          <MdOutlinePassword /> Editer Password
        </div>
      {editPassword && 
    <>
      <TextField
            fullWidth
            id="password"
            name="currentPassword"
            label="Current Password"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
            helperText={formik.touched.currentPassword && formik.errors.currentPassword}
            size="small"
            placeholder="Leave empty to keep current password"
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />
          {messageErreur && <span  style={{color:'red',fontWeight:400,fontSize:'14px', fontStyle: 'italic'}}>{messageErreur}</span>}
      <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            size="small"
            placeholder="Leave empty to keep current password"
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />
    </>
}
          {/* Address Field */}
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            size="small"
            multiline
            rows={2}
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />

          {/* Phone Field */}
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            size="small"
              sx={{ borderRadius: 2, backgroundColor: 'white' }} // 👈 Ajouté ici
          />

          {/* Submit Button */}
          <Button
            color="secondary"
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Update Infos
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditProfi;