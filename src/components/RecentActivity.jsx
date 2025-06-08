import React, { useEffect, useState } from 'react'
import {factureService} from '../services/api'
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Link } from 'react-router-dom';
const RecentActivity = ({isLoading}) => {
      const[factures,setFactures]= useState()
      useEffect(()=>{
           factureService.getAllFacture().then((result)=>setFactures(result.data)) 
      },[])
      function formatCustomDate(dateString) {
  const date = parseISO(dateString); // convertit "2025-05-06T00:00:00.000Z" en objet Date

  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`; // ex : Today, 3:30 PM
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy, h:mm a"); // ex : May 4, 2025, 3:30 PM
  }
}
console.log(factures)
  return (
   <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">
          Activité récente
          </h3>
         
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
                {
                 factures&& factures?.slice(0,3)?.map((f)=>(
                          <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                      {f?.resteAPayer===f?.totalHT ||  f?.resteAPayer >0 ? <>
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
                      </> : <>
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
                      </>  }  
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                         {f?.resteAPayer===f?.totalHT && f?.resteAPayer!==0 ? 'New order from Client' : 'Payment from Client'}   #{f?.client?.code}
                          </div>
                          <div className="text-xs text-neutral-500">
                            Invoice #I{f.referenceCommande}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                      {formatCustomDate(f?.date)} 
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                      {(f?.totalHT).toFixed(2)} Tnd
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full p-1  ${f?.resteAPayer===f?.totalHT ||  f?.resteAPayer >0 ? 'bg-yellow-100 text-yellow-800' :  'bg-green-100 text-green-800'} `}>
                      {f?.resteAPayer===f?.totalHT || f?.resteAPayer >0 ? 'En attente de payement' :  'Payement Complete'}
                      </span>
                    </td>
                 
                  </tr>
                  ))
                }
                
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default RecentActivity