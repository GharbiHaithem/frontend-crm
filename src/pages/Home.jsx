import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import { documentService, factureService } from "../services/api";
import RecentActivity from "../components/RecentActivity";
import axios from "axios";
import PopularProduct from "../components/PopularProduct/PopularProduct";

export default function Home() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
   const [factures, setFactures] = useState([]);
  const [total, setTotal] = useState(0);
  const [impayer, setImpayer] = useState(0);
  
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
                Total Payement
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-primary-300/50 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(total)
                )}
              </h3>
              <p className="text-white/60 text-xs mt-2">
                +12.5% from last month
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
                Total Factures Impayée
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-neutral-400/50 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(impayer)
                )}
              </h3>
              <p className="text-white/60 text-xs mt-2">
                +15.3% from last month
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
              Revenue Overview
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-primary-50 text-primary-600 rounded-md font-medium">
                Monthly
              </button>
              <button className="px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100 rounded-md font-medium">
                Quarterly
              </button>
              <button className="px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100 rounded-md font-medium">
                Yearly
              </button>
            </div>
          </div>
          <div className="h-80">
            <BarChart />
          </div>
        </div>

        {/* Popular Products */}
    <PopularProduct  isLoading={isLoading}  setIsLoading={setIsLoading}/>
      </div>

 
      <RecentActivity  isLoading={isLoading}/>
    </div>
  );
}
