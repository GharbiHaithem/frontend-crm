import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { FaAmazonPay } from "react-icons/fa";

function createData(_id,client, numFacture, totalTTC, status, typeDocument,lignes) {
  return {
      _id,
    client,
    numFacture,
    totalTTC,
    status,
    typeDocument,
    lignes,
    history: [],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const payer = async (factureId) => {
      console.log(factureId)
      try {
        const res = await axios.post('http://localhost:5000/api/stripe/create-checkout-session', { factureId });
        window.location.href = res.data.url;
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <>
   
      <TableRow   sx={{
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: row.status === 'paid' ? '#e0e0e0' : 'inherit', // gris clair si paid
    color: row.status === 'paid' ? '#888' : 'inherit',              // texte plus pâle si paid
    '& > *': { borderBottom: 'unset' }
  }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.client}</TableCell>
        <TableCell align="right">{row.numFacture}</TableCell>
        <TableCell align="right">{row.totalTTC}</TableCell>
        <TableCell align="right">
          <span className={`${row.status==="paid" ? 'paid' : 'unpaid'}`}>
            {row.status}
          </span>
        </TableCell>
        <TableCell align="right">{row.typeDocument}</TableCell>
        <TableCell align="right">
          <IconButton color="primary" disabled={row.status === 'paid'} onClick={() => payer(row._id)}>
            <FaAmazonPay />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Détails des articles
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="détails des articles">
            <TableHead>
              <TableRow>
                <TableCell>Article</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Prix Unitaire</TableCell>
                <TableCell align="right">Total HT</TableCell>
                <TableCell align="right">TVA</TableCell>
                <TableCell align="right">Total TTC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.lignes?.map((ligne, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {ligne.libelleArticle || 'N/A'}
                  </TableCell>
                  <TableCell align="right">{ligne.quantite || 0}</TableCell>
                  <TableCell align="right">
                    {ligne.prixHT?.toFixed(2) || '0.00'} TND
                  </TableCell>
                  <TableCell align="right">
                    {((ligne.quantite || 0) * (ligne.prixHT || 0)).toFixed(2)} TND
                  </TableCell>
                  <TableCell align="right">{ligne.tva || 0}%</TableCell>
                  <TableCell align="right">
                    {(
                      (ligne.quantite || 0) * 
                      (ligne.prixHT || 0) * 
                      (1 + (ligne.tva || 0)/100)
                    ).toFixed(2)} TND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Collapse>
  </TableCell>
</TableRow>
    </>
  );
}

export default function Payement() {
  const [factures, setFactures] = React.useState([]);
console.log(factures)
  React.useEffect(() => {
    axios.get('http://localhost:5000/facture/all')
      .then((response) => setFactures(response.data))
      .catch((err) => console.error(err));
  }, []);

  const rows = factures.map((facture) =>
    createData(
      facture._id,
      facture.client?.nom_prenom || 'Inconnu',
      facture.numFacture || facture._id,
      facture.totalTTC,
      facture.status,
      facture.typeDocument,
      facture.lignes
    )
  );

  return (
    <>
    <Typography
    variant="h6"
    sx={{
     
      fontWeight:900 ,
      marginBottom:'50px',
      color: "#1976d2",
      fontSize: "2rem",
     
    }}
 
  >
    Payer vos factures 
  </Typography>
    <TableContainer  sx={{ fontWeight: 'bold', fontStyle: 'italic' }} component={Paper}>
    
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Client Name</TableCell>
            <TableCell align="right">Numéro Facture</TableCell>
            <TableCell align="right">Total TTC (TND)</TableCell>
            <TableCell align="right">Statut Paiement</TableCell>
            <TableCell align="right">Type de Facture</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
