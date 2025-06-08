import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

function BarChart({ viewMode }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      let data;

      if (viewMode === "mensuel") {
        data = [
          ["Mois", "Devis", "Bon Commande", "Bon Livraison"],
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
      } else if (viewMode === "trimestriel") {
        data = [
          ["Trimestre", "Devis", "Bon Commande", "Bon Livraison"],
          ["T1", 3430, 2780, 2170],
          ["T2", 3460, 2820, 2510],
          ["T3", 3460, 2860, 2510],
          ["T4", 3460, 2880, 2510],
        ];
      } else if (viewMode === "annuel") {
        data = [
          ["Année", "Devis", "Bon Commande", "Bon Livraison"],
          ["2023", 12000, 10500, 9000],
          ["2024", 15000, 12000, 11000],
        ];
      }

      setChartData(data);
      setIsLoading(false);
    };

    fetchChartData();
  }, [viewMode]);

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
    />
  );
}

export default BarChart;
