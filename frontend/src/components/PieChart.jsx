import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const getPieChartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pieChartData?month=${month}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pie chart data');
        }

        const pieData = await response.json(); // Parse the JSON response

        // Check if pieData is available and not empty
        if (Object.keys(pieData).length > 0) {
          setData({
            labels: Object.keys(pieData),
            datasets: [
              {
                label: 'Number of Items',
                data: Object.values(pieData),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ],
              },
            ],
          });
        } else {
          console.warn('No data returned from API');
        }
      } catch (error) {
        console.error('Failed to fetch pie chart data:', error);
      }
    };
    
    // Fetch data only if month is defined
    if (month) {
      getPieChartData();
    }

    // Cleanup function
    return () => {
      setData({
        labels: [],
        datasets: [],
      }); // Reset data on unmount
    };
  }, [month]);

  // Ensure that the data is fully initialized before rendering the chart
  if (!data.datasets.length) return <p>Loading chart data...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-center mb-6">Pie Chart</h3>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PieChart;
