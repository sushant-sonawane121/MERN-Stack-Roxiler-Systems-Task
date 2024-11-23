import React, { useState } from "react";

import TransactionsDashboard from "./components/TransactionsDashboard";

const App = () => {
  const [month, setMonth] = useState("0"); // Default month to March

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Transction Dashboard
        </h1>
        <TransactionsDashboard />
      </div>
    </div>
  );
};

export default App;
