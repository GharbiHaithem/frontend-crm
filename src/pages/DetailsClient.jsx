import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Stack,
  List,
  ListItem
} from '@mui/material';
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailsClient = () => {
      const {id} = useParams()
      const [client,setClient]= useState({})
      useEffect(()=>{
            if(id){
                   axios.get(`http://localhost:5000/clients/${id}`).then((response)=>setClient(response.data))
            }
      },[id])
  if (!client) return <Typography>Aucun client sélectionné</Typography>;
console.log(client)
  return (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 600 }}>
      {/* En-tête */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <PersonIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5">{client.nom_prenom}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip 
              label={`Code: ${client.code}`} 
              color="secondary" 
              size="medium"
              
            />
            <Chip 
              label={`Tél: ${client.telephone}`} 
              icon={<PhoneIcon fontSize="small" />}
              size="medium"
            />
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Liste des informations */}
      <List disablePadding>
        {/* Section Professionnelle */}
        <ListItem sx={{ display: 'block', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <WorkIcon color="action" sx={{ mr: 1 }} />
            Informations Professionnelles
          </Typography>
          <Box sx={{ pl: 4, mt: 1 }}>
            <Typography>Raison Sociale: {client.raison_social}</Typography>
            <Typography>Matricule Fiscale: {client.matricule_fiscale || '-'}</Typography>
            <Typography>Reg. Commerce: {client.register_commerce || '-'}</Typography>
          </Box>
        </ListItem>

        <Divider component="li" sx={{ my: 1 }} />

        {/* Adresse */}
        <ListItem sx={{ display: 'block', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <HomeIcon color="action" sx={{ mr: 1 }} />
            Adresse
          </Typography>
          <Typography sx={{ pl: 4, mt: 1 }}>{client.adresse || 'Non renseignée'}</Typography>
        </ListItem>

        <Divider component="li" sx={{ my: 1 }} />

        {/* Informations Financières */}
        <ListItem sx={{ display: 'block', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
            Informations Financières
          </Typography>
          <Box sx={{ pl: 4, mt: 1 }}>
            <Typography>Solde Initial: {client.solde_initial}</Typography>
            <Typography>Montant Rapproché: {client.montant_raprochement}</Typography>
            <Typography>Solde Initial BL: {client.solde_initiale_bl}</Typography>
            <Typography>Taux Retenu: {client.taux_retenu}%</Typography>
          </Box>
        </ListItem>

        <Divider component="li" sx={{ my: 1 }} />

        {/* Autres Informations */}
        <ListItem sx={{ display: 'block' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon color="action" sx={{ mr: 1 }} />
            Autres Informations
          </Typography>
          <Box sx={{ pl: 4, mt: 1 }}>
            <Typography>Code Rapprochement: {client.code_rapprochement || '-'}</Typography>
            <Typography>Rape BL: {client.rapeBl || '-'}</Typography>
          </Box>
        </ListItem>
      </List>
    </Paper>
  );
};

export default DetailsClient;