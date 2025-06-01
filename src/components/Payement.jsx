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
import { TbCashRegister } from "react-icons/tb";
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, NativeSelect, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { OpenWithSharp } from '@mui/icons-material';
import { IoMdInformationCircle } from "react-icons/io";
import {Link, useNavigate} from 'react-router-dom'
import CaisseForm from './CaisseForm';
import Swal from 'sweetalert2';
import { IoIosAdd } from "react-icons/io";
function createData(_id,client, numFacture, totalTTC, status,montantPayé, typeDocument,lignes) {
  return {
      _id,
    client,
    numFacture,
    totalTTC,
    montantPayé,
    status,
    typeDocument,
    lignes,
    history: [],
  };
}

function Row(props) {


    const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false); // <-- ajout ici
  const { row, handleCheckboxChange,onClick } = props;
  const[details,setDetails] = useState([])
 


  const handleCheckboxToggle = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    handleCheckboxChange(row._id, isChecked); 
  };
   console.log(row._id)
  const payer = async (factureId) => {

      console.log(factureId)
  
      try {
        const res = await axios.post('http://localhost:5000/api/stripe/create-checkout-session', { factureId });
        window.location.href = res.data.url;
      } catch (err) {
        console.error(err);
      }
    };
    console.log(details)
     const navigate= useNavigate()
  return (
    <>

 <TableRow
  sx={{
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: row.status === 'paid' ? '#e0e0e0' :   'inherit',
    color: row.status === 'paid' ? '#888' : 'inherit',
    '& > *': { borderBottom: 'unset' },
  }}
>
  <TableCell padding="checkbox">
    <Checkbox disabled={row.totalTTC===0}  checked={checked} onChange={handleCheckboxToggle} />
  </TableCell>
  <TableCell>
    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  </TableCell>
  <TableCell>{row.client}</TableCell>
  <TableCell align="right">{row.numFacture}</TableCell>
  <TableCell align="right">{row.totalTTC} TND</TableCell>
  <TableCell align="right">{row.montantPayé} TND</TableCell>
  <TableCell align="right">
    <span className={`${row.status === "paid" ? 'paid' : 'unpaid'}`}>{row.status}</span>
  </TableCell>
  <TableCell align="right">{row.typeDocument}</TableCell>
  <TableCell align="right">
 <button disabled={row?.status==="unpaid"}  onClick={()=>navigate(`/payement/${row?._id}`)} type="button" className="bg-blue-100 px-2 rounded-md text-xs font-semibold uppercase text-blue-700 flex items-center gap-1" >
<IoMdInformationCircle className='text-2xl' />  Détails Paiement
</button>
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
              {row?.lignes &&row?.lignes?.map((ligne, index) => (
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


const  Espece= ({montant,setMontant,setErreur,handlePayement,setErreurPayement,erreurPayement,erreur})=>{

  return (
    <div className='flex flex-col gap-2 w-1/3'>
             <TextField
  label="Montant à payer"
  value={montant} // ceci lie l'input à l'état
  onChange={(e) =>{ setMontant(e.target.value)
    setErreur((prev)=>({
      ...prev,
      montant:''
    }))
  }} // met à jour l'état à chaque frappe
  type="number"
   size={"small"}
   required
     error={!!erreur.montant} // bordure rouge si erreur.montant est défini
    helperText={erreur.montant || erreurPayement} // message d'erreur affiché sous le champ
/>
                   
                    
    <button className='bg-blue-600 text-white p-2 rounded-lg' onClick={handlePayement}>Payer</button>
    
    </div>
  )
}
const Effet=({montant,setMontant,dateEcheance,erreur,setErreur,setDateEcheance,handlePayement,numeroCompte,setNumeroCompte,codeBanque,setCodeBanque,banqueName,setBanqueName})=>{
  return(
    <div className="space-y-4">
      {/* Ligne 1 */}
      <div className="flex gap-4">
        <FormControl  style={{ flex: 1 }} className="w-1/2">
          <InputLabel id="banque-select-label">Banque</InputLabel>
          <Select
            labelId="banque-select-label"
            id="banque-select"
            label="Banque"
           value={banqueName} // ✅ ici
    onChange={(e) =>{ setBanqueName(e.target.value)
       setErreur((prev)=>({
              ...prev,
              banqueName:''
            }))
    }} // ✅ ici
            size={"small"}
            required
          >
            <MenuItem value={'STB'}>STB</MenuItem>
            <MenuItem value={'BH'}>BH</MenuItem>
            <MenuItem value={'BNA'}>BNA</MenuItem>
            <MenuItem value={'BTS'}>BTS</MenuItem>
          </Select>
        </FormControl>

        <TextField
        style={{ flex: 1 }}
          className="w-1/2"
          label="Code Banque"
          variant="outlined"
          value={codeBanque}
          onChange={(e)=>{setCodeBanque(e.target.value)
              setErreur((prev)=>({
              ...prev,
              codeBanque:''
            }))
          }}
           size={"small"}
           required
        />
      </div>

      {/* Ligne 2 */}
      <div className="flex gap-4">
        <TextField
        style={{ flex: 1 }}
          className="w-1/2"
          label="Numéro Compte"
          type="number"
          variant="outlined"
            value={numeroCompte}
          onChange={(e)=>{setNumeroCompte(e.target.value)
             setErreur((prev)=>({
              ...prev,
              numeroCompte:''
            }))
          }}
           size={"small"}
           required
        />
          <TextField
  label="Montant à payer"
  value={montant} // ceci lie l'input à l'état
  onChange={(e) => {setMontant(e.target.value)
     setErreur((prev)=>({
              ...prev,
              montant:''
            }))
  }} // met à jour l'état à chaque frappe
  type="number"
    style={{ flex: 1 }}
          className="w-1/2"
         size={"small"}  
         required
/>

      </div>
   <div className='w-full h-[20px]'>
      <DatePicker
  className="w-full"
  label="Date Échéance"
  value={dateEcheance}
  onChange={(newValue) => {setDateEcheance(newValue)
      setErreur((prev)=>({
              ...prev,
              dateEcheance:''
            }))
  }}
  required
  slotProps={{ textField: { size: 'small' } }}
/>
   </div>
       <button  type='button'   className='bg-blue-600 text-white p-2 rounded-lg w-1/2' onClick={handlePayement}>Payer</button>
    </div>
  )
}
const Cheque=({montant,setMontant,handlePayement, erreurPayement,numeroCompte,setNumeroCompte,erreur,setErreur,codeBanque,setCodeBanque,banqueName,setBanqueName})=>{
  return(
    <div className="space-y-4">
      {/* Ligne 1 */}
      <div className="flex gap-4">
        <FormControl  style={{ flex: 1 }}    error={!!erreur.banqueName} className="w-1/2">
          <InputLabel id="banque-select-label">Banque</InputLabel>
          <Select
            labelId="banque-select-label"
            id="banque-select"
            label="Banque"
            required
           value={banqueName} // ✅ ici
    onChange={(e) =>{ setBanqueName(e.target.value)
       setErreur((prev)=>({
              ...prev,
              banqueName:''
            }))
    }} // ✅ ici
            size={"small"}
           // bordure rouge si erreur.montant est défini
  
          >
            <MenuItem value={'STB'}>STB</MenuItem>
            <MenuItem value={'BH'}>BH</MenuItem>
            <MenuItem value={'BNA'}>BNA</MenuItem>
            <MenuItem value={'BTS'}>BTS</MenuItem>
          </Select>
            {erreur.banqueName && (
    <FormHelperText>{erreur.banqueName}</FormHelperText>
  )}
        </FormControl>

        <TextField
        required
        style={{ flex: 1 }}
          className="w-1/2"
          label="Code Banque"
          variant="outlined"
          value={codeBanque}
          onChange={(e)=>{setCodeBanque(e.target.value)
            setErreur((prev)=>({
              ...prev,
              codeBanque:''
            }))
          }}
           size={"small"}
             error={!!erreur.codeBanque} // bordure rouge si erreur.montant est défini
    helperText={erreur.codeBanque} // message d'erreur affiché sous le champ
        />
      </div>

      {/* Ligne 2 */}
      <div className="flex gap-4">
        <TextField
        required
        style={{ flex: 1 }}
          className="w-1/2"
          label="Numéro Compte"
          type="number"
          variant="outlined"
            value={numeroCompte}
          onChange={(e)=>{setNumeroCompte(e.target.value)
             setErreur((prev)=>({
              ...prev,
              numeroCompte:''
            }))
          }}
           size={"small"}
             error={!!erreur.numeroCompte} // bordure rouge si erreur.montant est défini
    helperText={erreur.numeroCompte} // message d'erreur affiché sous le champ
        />
          <TextField
          required
  label="Montant à payer"
  value={montant} // ceci lie l'input à l'état
  onChange={(e) =>{ setMontant(e.target.value)
     setErreur((prev)=>({
              ...prev,
              montant:''
            }))
  }} // met à jour l'état à chaque frappe
  type="number"
    style={{ flex: 1 }}
          className="w-1/2"
           size={"small"}
             error={!!erreur.montant} // bordure rouge si erreur.montant est défini
    helperText={erreur.montant || erreurPayement} // message d'erreur affiché sous le champ
/>
      </div>
       <button  type='button'   className='bg-blue-600 text-white p-2 rounded-lg w-1/2' onClick={handlePayement}>Payer</button>
    </div>
  )
}
export default function Payement() {
  const [montant,setMontant] = useState(0)
  const [factures, setFactures] = React.useState([]);
  const[clients,setClients] = React.useState([])
  const[caisse,setCaisse] = React.useState([])
  const[modePayement,setModePayement] = React.useState(null)
  const[numeroCompte,setNumeroCompte]= useState(null)
  const[banqueName,setBanqueName]= useState(null)
  const[codeBanque,setCodeBanque]= useState(null)
   const[dateEcheance,setDateEcheance]= useState("")
  const[selectedCaisse,setSelectedCaisse]= useState("")

    const handleChangeModePayement = (event) => {
    setModePayement(event.target.value);
  };
console.log( modePayement)
  const[openCaisse,setOpenCaisse] = React.useState(false)
  const clientFromStorage = localStorage.getItem('client')|| null
    const [selectedClientId, setSelectedClientId] = React.useState(clientFromStorage);
        const [selectedFactures, setSelectedFactures] = React.useState([]);
  const handleChange = (event) => {
  const value = event.target.value;
  setSelectedClientId(value);
  localStorage.setItem('client', value); // Utilise la nouvelle valeur directement
  console.log('Client sélectionné:', value);
};
 React.useEffect(()=>{
  if(selectedClientId !== null){
    setOpenCaisse(true)
    axios.get(`http://localhost:5000/caisse/${selectedClientId}`).then((result)=>setCaisse(result?.data))
    axios.get(`http://localhost:5000/facture/factureFiltrer?clientid=${selectedClientId}`).then((result)=>{
      setFactures(result.data)}).catch((erreur)=>{
            Swal.fire({
            title: "Selectionner un client !",
            text: erreur.response.data.error,
            icon: "info"
          });
          console.log( erreur.response.data.error)
        })
      console.log(factures)
  }
 },[selectedClientId])
  React.useEffect(()=>{
    axios.get('http://localhost:5000/clients/all').then((result)=>setClients(result.data)).catch((error)=>console.log(error))
  },[])


const handleCheckboxChange = (factureId, isChecked) => {
  setSelectedFactures((prev) => {
    if (isChecked) {
      return [...prev, factureId]; // ajoute l'ID
    } else {
      return prev.filter(id => id !== factureId); // retire l'ID
    }
  });
};
console.log(selectedFactures)
const[erreurPayement,setErreurPayement]= useState('')
const getTotalTTC = () => {
  return factures
    .filter(facture => selectedFactures.includes(facture._id)) // garder uniquement les factures sélectionnées
    .reduce((totalFactures, facture) => {
    
        const prixTTC = (facture.resteAPayer ) ;
      
    
     ;
      return totalFactures + prixTTC;
    }, 0);
};
const[erreur,setErreur]=useState({})

const[montantPayer,setMontantPayer]=useState(0)

const handlePayement = async () => {
  
  const newErrors = {};

  if (!montant) newErrors.montant = 'Montant requis';
    if (!selectedCaisse) newErrors.caisse = 'Caisse requis';
  if (modePayement === "Cheque") {
    if (!numeroCompte) newErrors.numeroCompte = 'Numéro de compte requis';
    if (!banqueName) newErrors.banqueName = 'Banque requise';
    if (!codeBanque) newErrors.codeBanque = 'Code banque requis';
  if (!selectedCaisse) newErrors.caisse = 'Caisse requis';
  }
 if (modePayement === "Effet") {
    if (!numeroCompte) newErrors.numeroCompte = 'Numéro de compte requis';
    if (!banqueName) newErrors.banqueName = 'Banque requise';
    if (!codeBanque) newErrors.codeBanque = 'Code banque requis';
    if (!dateEcheance) newErrors.dateEcheance = 'Date échéance requise';
    if (!selectedCaisse) newErrors.caisse = 'Caisse requis';
  }
 
   console.log(caisse)
console.log(JSON.stringify(erreur.caisse))
  if (Object.keys(newErrors).length > 0) {
    setErreur((prev) => ({ ...prev, ...newErrors }));
    return;
  }




  try {
    // Paiement facture
    await axios.post('http://localhost:5000/facture/payer', {
     montant,
      factureIds: selectedFactures,
    }).then((result)=>{
         Swal.fire({
            title: "Payement successful!",
            text: "Payement successful!",
            icon: "success"
          });
    })

    // Enregistrement du mode de paiement
    await axios.post('http://localhost:5000/modePayement/', {
    montant,
      modeName: modePayement,
      banqueName,
      codeBanque,
      numeroCompte,
      facture: selectedFactures,
      dateEcheance,
    });

    // Actualiser les factures
    setTimeout(() => {
      axios
        .get(`http://localhost:5000/facture/factureFiltrer?clientid=${selectedClientId}`)
        .then((result) => setFactures(result.data)).catch((erreur)=>{
          //   Swal.fire({
          //   title: "Selectionner un client !",
          //   text: erreur.response.data.erreur,
          //   icon: "info"
          // });
          console.log(erreur)
        })
    }, 1000);

    // Nettoyer les champs
    setMontant("");
    setBanqueName("");
    setCodeBanque("");
    setNumeroCompte("");
    setDateEcheance("");
    setErreur({});
    setErreurPayement(""); // Réinitialiser le message d’erreur global

  } catch (error) {
    console.error(error);
    setErreurPayement(error?.response?.data?.message || "Erreur lors du paiement");
  }
};

  const rows = factures?.map((facture) =>
    createData(
      facture?._id,
      facture?.client?.nom_prenom,
      facture?.numFacture || facture?._id,
      facture?.resteAPayer,
    
      facture?.status,
        facture?.montantPayé || 0,
      facture?.typeDocument,
      facture?.lignes
    )
  );
const handleChangex = (event) => {
    const value = event.target.value;
    setSelectedCaisse(value);
    console.log(event.target.value)
   
  };
  console.log(selectedCaisse)
  return (
    <>


<div className="flex flex-wrap gap-6 items-center">
  {/* Sélecteur Client */}
<div className="w-1/2">
  <label htmlFor="client-select" className="block text-sm font-medium text-gray-700">
    Client <span className="text-red-500">*</span>
  </label>
  
  <div className="relative">
    <select
      id="client-select"
      name="client"
      value={selectedClientId}
      onChange={handleChange}
      className={`appearance-none mt-1 block w-full rounded-md border px-3 py-2 pr-10 shadow-sm focus:outline-none sm:text-sm
        ${erreur.client ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
    >
      <option value="">-- Choisir un client --</option>
      {clients?.map((c) => (
        <option key={c?._id} value={c?._id}>
          {c?.nom_prenom}
        </option>
      ))}
    </select>

    {/* Icône flèche */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
      </svg>
    </div>
  </div>

  {/* Message d'erreur */}
  {erreur.client && (
    <p className="mt-1 text-sm text-red-600">{erreur.client}</p>
  )}
</div>


  {/* Sélecteur Caisse */}
<div className='flex gap-5 w-full'>
    <div className="w-1/2 mb-0 ">
  <label htmlFor="caisse-select" className="block text-sm font-medium text-gray-700">
    Caisse <span className="text-red-500">*</span>
  </label>
  <select
    id="caisse-select"
    name="caisse"
    value={selectedCaisse}
    onChange={handleChangex}
    className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm
      ${erreur.caisse ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
  >
    <option value="">-- Choisir une caisse --</option>
    {caisse?.map((c) => (
      <option key={c._id} value={c._id}>
        {c.nom_caisse}
      </option>
    ))}
  </select>
  {erreur.caisse && (
    <p className="mt-1 text-sm text-red-600">{erreur.caisse}</p>
  )}
</div>

    <button style={{transform:'translateY(20px'}} className='p-2 btn h-[40px] w-[40px] flex items-center justify-center btn-secondary rounded-full  text-white ' data-bs-toggle="modal" data-bs-target="#exampleModal"><IoIosAdd className='text-xl'/></button>
</div>

  {/* Date Picker */}
  <DatePicker
  className='w-1/2'
    label="Date de facturation"
    name="startDate"
    slotProps={{
      textField: {
        size: 'small',
      
        sx: {
       
          '& .MuiInputBase-root': {
            height: 40,
          },
          '& .MuiInputBase-input': {
            padding: '10px',
          },
        },
      },
    }}
  />
</div>
  {selectedClientId &&
    <TableContainer  sx={{ fontWeight: 'bold', fontStyle: 'italic',marginTop:'50px' }} component={Paper}>
    
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
               <TableCell>Check</TableCell>
               <TableCell></TableCell>
               
            <TableCell>Client Name</TableCell>
            <TableCell align="right">Numéro Facture</TableCell>
            <TableCell align="right">Reste A Payer</TableCell>
           <TableCell align="right"> montantPayé</TableCell>
            <TableCell align="right">Statut Paiement</TableCell>
            <TableCell align="right">Type de Facture</TableCell>
            <TableCell align="right">Details de Paiement</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length>0  ? rows?.map((row, index) => (
            <Row key={index} row={row} onClick={()=>alert('xxxx')}   handleCheckboxChange={handleCheckboxChange}/>
          ))  :( <TableRow>
      <TableCell colSpan={7} align="center">
        Pas de Facture pour ce client
      </TableCell>
    </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>}
   {selectedClientId && selectedFactures?.length>0 &&<div className='flex flex-col'> <div className="flex justify-end">
 {selectedClientId && selectedFactures?.length>0 && <div className="bg-white shadow-lg rounded-md mt-2 px-3 py-1 w-fit">
  <span className=' text-blue-500  text-base font-light'>  Total  A Payer : {getTotalTTC().toFixed(2)} TND</span>
  </div>}
</div>
  <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Mode de Paiement</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
         value={modePayement}
        onChange={handleChangeModePayement}
      >
        <FormControlLabel value="Espece"   control={<Radio />} label="Espece" />
        <FormControlLabel value="Cheque" control={<Radio />} label="Cheque" />
        <FormControlLabel value="Effet" control={<Radio />} label="Effet" />
    
      </RadioGroup>
    </FormControl>
  
    {selectedClientId && selectedFactures?.length>0 &&  (modePayement==="Espece")&&<Espece erreur={erreur} setErreur={setErreur} montant={montant} erreurPayement={erreurPayement} setErreurPayement={setErreurPayement} setMontant={setMontant} handlePayement={handlePayement}/>}
  {selectedClientId && selectedFactures?.length>0 &&  (modePayement==="Cheque") && <Cheque setErreur={setErreur}   erreurPayement={erreurPayement} erreur={erreur} numeroCompte={numeroCompte} banqueName={banqueName} setBanqueName={setBanqueName} codeBanque={codeBanque} setCodeBanque={setCodeBanque} setNumeroCompte={setNumeroCompte} montant={montant} setMontant={setMontant} handlePayement={handlePayement} />}
   {selectedClientId && selectedFactures?.length>0 &&  (modePayement==="Effet") && <Effet erreur={erreur} setErreur={setErreur}  dateEcheance={dateEcheance} setDateEcheance={setDateEcheance} numeroCompte={numeroCompte} banqueName={banqueName} setBanqueName={setBanqueName} codeBanque={codeBanque} setCodeBanque={setCodeBanque} setNumeroCompte={setNumeroCompte} montant={montant} setMontant={setMontant} handlePayement={handlePayement} />}
</div>


}

<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5 italic font-medium" id="exampleModalLabel">    <Typography variant="h5" >
                  Ajouter une Caisse
                </Typography></h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
     <CaisseForm setCaisse={setCaisse}  client={selectedClientId}/>
      </div>
     
    </div>
  </div>
</div>
    </>
  );
}
