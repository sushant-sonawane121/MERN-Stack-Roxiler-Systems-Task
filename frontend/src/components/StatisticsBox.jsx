import React, { useEffect, useState } from "react";

const StatisticsBox = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    // Fetch statistics only if month is defined
    if (month !== undefined) {
      fetch(`http://localhost:5000/api/statistics?month=${month}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          
          setStatistics(data); // Update the state with received data
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [month]);
  

  const Months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-center mb-6">
        Statistics - {!Months[month] ? "All Data" : Months[month]}
      </h3>

      {/* Statistics Container */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sale Amount Card */}
        <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Sale Amount
          </h4>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${statistics.totalSaleAmount?.toLocaleString() || 0}
          </p>
        </div>

        {/* Total Sold Items Card */}
        <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Sold Items
          </h4>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {statistics.totalSoldItems || 0}
          </p>
        </div>

        {/* Total Not Sold Items Card */}
        <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Not Sold Items
          </h4>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {statistics.totalNotSoldItems || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsBox;
