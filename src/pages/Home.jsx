import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import { documentService, factureService } from "../services/api";
import RecentActivity from "../components/RecentActivity";
import axios from "axios";
import PopularProduct from "../components/PopularProduct/PopularProduct";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // pour formatage YYYY-MM-DD
export default function Home() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
   const [factures, setFactures] = useState([]);
  const [total, setTotal] = useState(0);
  const [impayer, setImpayer] = useState(0);
  const [viewMode, setViewMode] = useState("mensuel");
 useEffect(()=>{
  factureService.getAllFacture().then((response)=>{
  setFactures(response.data);

        // 🧠 Calculer la somme avec reduce
        const somme = response.data.reduce((acc, facture) => {
          return acc + (facture.montantPayé || 0);
        }, 0);

        setTotal(somme);
        const resteApayer= response.data.reduce((acc,facture)=>{
          return acc +(facture.resteAPayer)
        },0)
        setImpayer(resteApayer)
  })
 },[])
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const currentYear = new Date().getFullYear();

        // Fetch total earnings from devis
        const devisResponse = await documentService.getTotalByTypeAndYear(
          "devis",
          currentYear
        );

        // Fetch total orders from bon commande
        const bonCommandeResponse = await documentService.getTotalByTypeAndYear(
          "bon-commande",
          currentYear
        );

        // Fetch total income from bon livraison
        const bonLivraisonResponse =
          await documentService.getTotalByTypeAndYear(
            "bon-livraison",
            currentYear
          );

        setTotalEarnings(devisResponse.data?.total || 0);
        setTotalOrders(bonCommandeResponse.data?.total || 0);
        setTotalIncome(bonLivraisonResponse.data?.total || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
const [dateFiltre, setDateFiltre] = useState(null);
const[totalImpayer,setTotalImpayer] = useState(0)
const [dateFiltrePaid, setDateFiltrePaid] = useState(null);
const[totalPayer,setTotalPayer] = useState(0)
const handleDateChange1 = async (date) => {
  setDateFiltrePaid(date);
  if (!date) return;

  // envoyer ISO complet (ex: "2025-06-10T00:00:00.000Z")
  const dateISO = new Date(date).toISOString();

  try {
    const response = await axios.get(
      `http://localhost:5000/facture/getTotalPayedAmount?dateDebut=${encodeURIComponent(dateISO)}`
    ).then((result)=>setTotalPayer(result.data.totalPaye))

    console.log("Résultat API :", response.data);
  } catch (err) {
    console.error("Erreur API :", err);
  }
};
const handleDateChange = async (date) => {
  setDateFiltre(date);
  if (!date) return;

  // envoyer ISO complet (ex: "2025-06-10T00:00:00.000Z")
  const dateISO = new Date(date).toISOString();

  try {
    const response = await axios.get(
      `http://localhost:5000/facture/getTotalAmount?dateDebut=${encodeURIComponent(dateISO)}`
    ).then((result)=>setTotalImpayer(result.data.totalResteAPayer))

    console.log("Résultat API :", response.data);
  } catch (err) {
    console.error("Erreur API :", err);
  }
};
console.log(totalImpayer)
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("tn-Tn", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full ">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Earnings Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Reste A Payer
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-primary-300/50 rounded animate-pulse"></div>
                ) : (
                 !dateFiltre ? formatCurrency(total) : <span className="text-4xl font-bold ">{totalImpayer}<em className="text-lg font-medium text-white">Tnd</em></span>
                )}
              </h3>
              <p className="text-white/60 text-xs mt-2">
               <DatePicker
        label="Choisir une date"
        value={dateFiltre}
        onChange={handleDateChange}
         slotProps={{
    textField: {
      variant: 'standard',
      InputProps: {
        disableUnderline: true,
        style: {
          color: 'white',
          backgroundColor: 'transparent',
        },
      },
      sx: {
        '& .MuiInputBase-root': {
          border: 'none',
          fontSize: '0.875rem',
          padding: 0,
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
         '& .MuiSvgIcon-root': {
          color: 'white', // 🎯 rend l'icône blanche
        },
        '& .MuiInputLabel-root': {
          display: 'none',
        },
      },
    },
  }}
     
      />
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Factures
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-secondary-300/50 rounded animate-pulse"></div>
                ) : (
                  (factures?.length)
                )}
              </h3>
              <p className="text-white/60 text-xs mt-2">
                +8.2% from last month
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-gradient-to-r from-neutral-700 to-neutral-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Factures payée
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-neutral-400/50 rounded animate-pulse"></div>
                ) : (
                !dateFiltrePaid ? formatCurrency(impayer) : <span className="text-4xl font-bold ">{totalPayer}<em className="text-lg font-medium text-white">Tnd</em></span>
                )}
              </h3>
              <p className="text-white/60 text-xs mt-2">
              <DatePicker
        label="Choisir une date"
        value={dateFiltrePaid}
        onChange={handleDateChange1}
         slotProps={{
    textField: {
      variant: 'standard',
      InputProps: {
        disableUnderline: true,
        style: {
          color: 'white',
          backgroundColor: 'transparent',
        },
      },
      sx: {
        '& .MuiInputBase-root': {
          border: 'none',
          fontSize: '0.875rem',
          padding: 0,
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
         '& .MuiSvgIcon-root': {
          color: 'white', // 🎯 rend l'icône blanche
        },
        '& .MuiInputLabel-root': {
          display: 'none',
        },
      },
    },
  }}
     
      />
    
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-neutral-800">
            Aperçu des revenus
            </h3>
         <div className="flex space-x-2">
  {["mensuel", "trimestriel", "annuel"].map((mode) => (
    <button
      key={mode}
      onClick={() => setViewMode(mode)}
      className={`px-3 py-1 text-xs rounded-md font-medium ${
        viewMode === mode
          ? "bg-primary-50 text-primary-600"
          : "text-neutral-500 hover:bg-neutral-100"
      }`}
    >
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </button>
  ))}
</div>

          </div>
          <div className="h-80">
            <BarChart viewMode={viewMode} />
          </div>
        </div>

        {/* Popular Products */}
    <PopularProduct  isLoading={isLoading}  setIsLoading={setIsLoading}/>
      </div>

 
      <RecentActivity  isLoading={isLoading}/>
    </div>
  );
}
