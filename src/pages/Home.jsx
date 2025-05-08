import React, { useState, useEffect } from "react";
import BarChart from "../charts/BarChart";
import { documentService } from "../services/api";

export default function Home() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Earnings Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Earnings
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-primary-300/50 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(totalEarnings)
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
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-secondary-300/50 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(totalOrders)
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
                Total Income
              </p>
              <h3 className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-24 bg-neutral-400/50 rounded animate-pulse"></div>
                ) : (
                  formatCurrency(totalIncome)
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-6">
            Popular Products
          </h3>

          <div className="space-y-4">
            {isLoading ? (
              Array(4)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center p-3 border border-neutral-100 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-neutral-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                ))
            ) : (
              <>
                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Laptop Pro</p>
                      <p className="text-xs text-neutral-500">Electronics</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-800">€1,299</span>
                </div>

                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-secondary-100 text-secondary-600 rounded-md flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">
                        Smartphone X
                      </p>
                      <p className="text-xs text-neutral-500">Electronics</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-800">€899</span>
                </div>

                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-neutral-100 text-neutral-600 rounded-md flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">
                        Wireless Earbuds
                      </p>
                      <p className="text-xs text-neutral-500">Audio</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-800">€149</span>
                </div>

                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">
                        Smart Watch
                      </p>
                      <p className="text-xs text-neutral-500">Wearables</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-800">€299</span>
                </div>
              </>
            )}
          </div>

          <button className="w-full mt-6 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Products
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">
            Recent Activity
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                Array(3)
                  .fill()
                  .map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-neutral-200 rounded w-1/4 ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            Payment from Client #1234
                          </div>
                          <div className="text-xs text-neutral-500">
                            Invoice #INV-2022-004
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        Today, 10:45 AM
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        €1,250.00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            New order from Client #5678
                          </div>
                          <div className="text-xs text-neutral-500">
                            Order #ORD-2022-089
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        Yesterday, 3:30 PM
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        €850.00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            Refund to Client #9012
                          </div>
                          <div className="text-xs text-neutral-500">
                            Order #ORD-2022-075
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        Jan 15, 2023
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        -€320.00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Refunded
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
