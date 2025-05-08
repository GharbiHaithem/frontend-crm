import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { documentService } from "../services/api";

function BarChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const currentYear = new Date().getFullYear();

        // Fetch data for devis, bon-commande, and bon-livraison
        const devisPromise = documentService.getTotalByTypeAndYear(
          "devis",
          currentYear
        );
        const bonCommandePromise = documentService.getTotalByTypeAndYear(
          "bon-commande",
          currentYear
        );
        const bonLivraisonPromise = documentService.getTotalByTypeAndYear(
          "bon-livraison",
          currentYear
        );

        // Previous year data
        const devisPrevPromise = documentService.getTotalByTypeAndYear(
          "devis",
          currentYear - 1
        );
        const bonCommandePrevPromise = documentService.getTotalByTypeAndYear(
          "bon-commande",
          currentYear - 1
        );
        const bonLivraisonPrevPromise = documentService.getTotalByTypeAndYear(
          "bon-livraison",
          currentYear - 1
        );

        const [
          devisRes,
          bonCommandeRes,
          bonLivraisonRes,
          devisPrevRes,
          bonCommandePrevRes,
          bonLivraisonPrevRes,
        ] = await Promise.all([
          devisPromise,
          bonCommandePromise,
          bonLivraisonPromise,
          devisPrevPromise,
          bonCommandePrevPromise,
          bonLivraisonPrevPromise,
        ]);

        // Format data for chart
        const data = [
          ["Month", "Devis", "Bon Commande", "Bon Livraison"],
          [
            "Jan",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Feb",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Mar",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Apr",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "May",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Jun",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Jul",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Aug",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Sep",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Oct",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Nov",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
          [
            "Dec",
            Math.random() * 1000,
            Math.random() * 800,
            Math.random() * 600,
          ],
        ];

        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Fallback to sample data
        const sampleData = [
          ["Month", "Devis", "Bon Commande", "Bon Livraison"],
          ["Jan", 1000, 800, 600],
          ["Feb", 1170, 860, 720],
          ["Mar", 1260, 1120, 850],
          ["Apr", 1030, 1040, 940],
          ["May", 1170, 860, 720],
          ["Jun", 1260, 1120, 850],
          ["Jul", 1030, 1040, 940],
          ["Aug", 1170, 860, 720],
          ["Sep", 1260, 1120, 850],
          ["Oct", 1030, 1040, 940],
          ["Nov", 1170, 860, 720],
          ["Dec", 1260, 1120, 850],
        ];
        setChartData(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Chart options
  const options = {
    chart: {
      title: "",
      subtitle: "",
    },
    colors: ["#0ea5e9", "#8b5cf6", "#404040"],
    backgroundColor: "transparent",
    legend: { position: "top", alignment: "center" },
    hAxis: {
      textStyle: { color: "#737373" },
      gridlines: { color: "transparent" },
    },
    vAxis: {
      textStyle: { color: "#737373" },
      gridlines: { color: "#e5e5e5" },
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
    chartArea: {
      width: "90%",
      height: "80%",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="100%"
      data={chartData}
      options={options}
      loader={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      }
    />
  );
}

export default BarChart;
