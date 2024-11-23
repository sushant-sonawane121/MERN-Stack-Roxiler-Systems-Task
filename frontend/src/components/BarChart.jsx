import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getBarChartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/barChartData?month=${month}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bar chart data");
        }

        const barData = await response.json(); // Parse the JSON response

        // Check if barData is available and not empty
        if (barData) {
          setData({
            labels: Object.keys(barData),
            datasets: [
              {
                label: "Number of Items",
                data: Object.values(barData),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch bar chart data:", error);
      }
    };

    // Fetch data only when month is defined
    if (month) {
      getBarChartData();
    }
  }, [month]);

  // Ensure that the data is fully initialized before rendering the chart
  if (!data.datasets.length) return <p>Loading chart data...</p>;



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-center mb-4">Bar Chart</h3>
      <div className="bg-gray-100 p-4 rounded-md">
        <Bar data={data} />
      </div>
    </div>
  );
};

export default BarChart;
