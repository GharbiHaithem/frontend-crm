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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, // Ajout de Box pour la pagination
} from '@mui/material';
import { Delete, Edit, Add, Visibility, FilterList } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getAllClients } from '../functions/client/clientApi';
import SearchBar from './SearchBar';
import Swal from 'sweetalert2';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
const[selectedClientId,setSelectedClientId] =useState(null)
  useEffect(() => {

    fetchClients();
  }, [page, filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getAllClients(page,filters);
      setClients(res.clients);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des clients', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`).then((result)=>Swal.fire( "Le client a été supprimer.","Le client a été supprimer.", "error")).catch((erreur)=>{
        Swal.fire( erreur.response.data.message,"Client ne peut pas etre supprimé ! ", "error")
        console.log(erreur)
      })
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
  const[openDialog,setOpenDialog]= useState(false)
    const handleCloseDialog = () => {
    setOpenDialog(false);
  
  };

  return (
    <div className='client-screen'>
    <Container maxWidth="lg" style={{ padding: '20px', width: '100%' }}>
      <div className='client-container'>
        <Typography className='text-lg font-semibold text-neutral-800' variant="h4" style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '2rem' }}>
          Liste des Clients
        </Typography>
        <div className='flex items-center'> 
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/clients/new"
            startIcon={<Add style={{ fontSize: '1.5rem' }} />}
            style={{ marginRight: '10px', borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
            className='hover:text-white'
          >
            Ajouter un client
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
          <Table className='text-lg font-semibold text-neutral-800'  style={{ width: '100%'}}>
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {['Nom & Prénom', 'Téléphone', 'Code', 'Raison Sociale', 'Actions'].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{  textAlign: 'center', color: '#1976d2', fontSize: '0.8rem', padding: '10px' }}
                   className="text-lg font-semibold text-neutral-800"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody style={{}}>
              {clients.map((client) => (
                <TableRow key={client._id} hover style={{ height: '60px' }}>
                  <TableCell style={{ fontSize: '0.8rem', padding: '10px',textAlign:'center' }}>{client.nom_prenom}</TableCell>
                  <TableCell style={{ fontSize: '0.8rem', padding: '10px',textAlign:'center' }}>{client.telephone}</TableCell>
                  <TableCell style={{ fontSize: '0.8rem', padding: '10px',textAlign:'center' }}>{client.code}</TableCell>
                  <TableCell style={{ fontSize: '0.8rem', padding: '10px',textAlign:'center' }}>{client.raison_social}</TableCell>
                  <TableCell style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <IconButton
                        color="secondary"
                        onClick={() =>{setOpenDialog(true)
                          setSelectedClientId(client?._id)
                        }}
                        aria-label="supprimer"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Delete style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/clients/${client._id}`}
                        aria-label="modifier"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Edit style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="info"
                        component={Link}
                        to={`/clients/details/${client._id}`}
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
    </Container>
       <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Supprimer client</DialogTitle>
            <DialogContent>
              <p>Êtes-vous sûr de vouloir supprimer ce client ?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Non
              </Button>
              <Button
                onClick={() => {
                   handleDelete(selectedClientId);
                  handleCloseDialog();
                }}
                color="secondary"
              >
                Oui
              </Button>
            </DialogActions>
          </Dialog>
    </div>
  );
};

export default ClientList;