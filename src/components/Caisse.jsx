import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Paper,
  Menu,
  MenuItem,
  Container,
  Box, // Ajout de Box pour la pagination
} from '@mui/material';
import { Delete, Edit, Add, Visibility, FilterList } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getAllClients } from '../functions/client/clientApi';
import SearchBar from './SearchBar';

const Caisse = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
const[caisses,setCaisses]= useState([]);
  useEffect(() => {

    fetchClients();
  }, [page, filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/caisse/');
      setCaisses(res.data);
     
    } catch (error) {
      console.error('Erreur lors du chargement des clients', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Erreur lors de la suppression du client', error);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setOpenFilterMenu((prev) => !prev);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setOpenFilterMenu(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setPage(1); // Réinitialiser à la première page lors de l'application des filtres
    fetchClients();
    handleFilterClose();
  };

  // Gestion de la pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  console.log(caisses) 
  return (
    <div className='client-screen'>
    <Container maxWidth="lg" style={{ padding: '20px', width: '100%' }}>
      <div className='client-container'>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '2rem' }}>
          Liste des Caisse
        </Typography>
        <div className='flex items-center'> 
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/caisse/new"
            startIcon={<Add style={{ fontSize: '1.5rem' }} />}
            style={{ marginRight: '10px', borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
          >
            Ajouter une caisse
          </Button>
     <div className='w-[60%]'> <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setClients={setClients} /></div>
        </div>
      </div>

      <Paper elevation={3} style={{ borderRadius: '10px', overflow: 'hidden', width: '100%',marginTop:'20px'  }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress size={50} />
          </div>
        ) : (
          <Table  style={{ width: '100%'}}>
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {['Nom & Caisse', 'Fond Caisse', 'Client', 'Actions'].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{ fontWeight: 'bold', textAlign: 'start', color: '#1976d2', fontSize: '1.2rem', padding: '20px' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {caisses?.map((c) => (
                <TableRow key={c._id} hover style={{ height: '60px',textAlign: 'center' }}>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px'}}  className='text-center' >{c.nom_caisse}</TableCell>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px'}}>{c.fond_caisse}</TableCell>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px' }}>{c.client.nom_prenom}</TableCell>
              
                  <TableCell style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(c._id)}
                        aria-label="supprimer"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Delete style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/clients/${c._id}`}
                        aria-label="modifier"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Edit style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="info"
                        component={Link}
                        to={`/clients/details/${c._id}`}
                        aria-label="détails"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Visibility style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton
          onClick={handlePreviousPage}
          disabled={page === 1}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
          Page {page} sur {totalPages}
        </Box>
        <IconButton
          onClick={handleNextPage}
          disabled={page === totalPages}
          color="primary"
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Container></div>
  );
};

export default Caisse;