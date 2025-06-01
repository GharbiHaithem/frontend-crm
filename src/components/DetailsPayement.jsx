
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Pagination from './Pagination/Pagination'
import { Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const DetailsPayement = () => {
  const [details, setDetails] = useState([])
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/modePayement/${id}`)
        .then((result) => setDetails(result.data))
        .catch((err) => console.error("Erreur de chargement des paiements :", err))
    }
  }, [id])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(details.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = details.slice(indexOfFirstItem, indexOfLastItem);

  const navigate = useNavigate()
  return (
    <>
  
      {currentItems?.length > 0 && (
        <div className="w-[90%] mx-auto max-w-full text-xs font-medium italic">
            <Button 
                  startIcon={<ArrowBack />} 
                  onClick={()=>navigate('/payement')}
               
                  sx={{ mb: 2 }}
                >
                  Retour àu payement 
                </Button>
          <h5>Détails Paiement ({details.length})</h5>
       

       
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Numero Facture</th>
                  <th scope="col">Code Client</th>
                  <th scope="col">Méthode Paiement</th>
                  <th scope="col">Montant</th>
                  <th scope="col">Date Paiement</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((d, i) => {
                  const f = d?.facture?.[0]
                  if (!f) return null

                  return (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{f?.numFacture}</td>
                        <td>{f?.client?.code}</td>
                        <td>{d?.modeName}</td>
                        <td>{d?.montant} TND</td>
                        <td>{new Date(d?.date).toLocaleString()}</td>
                      </tr>

                      {d.modeName === "Cheque" && (
                        <tr className="text-sm text-gray-600 italic bg-gray-100">
                          <td colSpan="5">
                            <div className="flex flex-wrap gap-6 pl-4 py-2">
                              <span><strong>Banque:</strong> {d.banqueName}</span>
                              <span><strong>Code Banque:</strong> {d.codeBanque}</span>
                              <span><strong>Numéro Compte:</strong> {d.numeroCompte}</span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {d.modeName === "Effet" && (
                        <tr className="text-sm text-gray-600 italic bg-gray-100">
                          <td colSpan="5">
                            <div className="flex flex-wrap gap-6 pl-4 py-2">
                              <span><strong>Banque:</strong> {d.banqueName}</span>
                              <span><strong>Code Banque:</strong> {d.codeBanque}</span>
                              <span><strong>Numéro Compte:</strong> {d.numeroCompte}</span>
                              <span><strong>Date Échéance:</strong> {new Date(d.dateEcheance).toLocaleDateString()}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
        

          <div >
          
          </div>
        </div>
      )}
        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} data={currentItems} />
    </>
  )
}

export default DetailsPayement
